/* Team 1 Day 1 student sample. A short lesson, then games. Letters a and m only. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, icon, Snd, A, speakerBtn } = IR;
  const ZIP = 'img/zipA.webp';
  const FRILL = 'img/frill.webp';
  const ADDIE = 'foundation/img/letters/a_apple.jpg';
  const MANNY = 'foundation/img/letters/m_manny_mangrove.jpg';
  const AM = 'foundation/img/scenes/am.jpg';
  const LINK = 'foundation/img/scenes/link_am.jpg';
  const OBJ = {
    ant: 'foundation/img/objects/ant.jpg',
    apple: 'foundation/img/objects/apple.jpg',
    mat: 'foundation/img/scenes/mat.jpg',
    mango: 'foundation/img/objects/mango.jpg',
    mop: 'img/refresh_mop.jpg'
  };
  const MOUTH = '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M8 14 Q32 36 56 14 Q32 30 8 14Z" fill="#fff"/><path d="M16 18 Q32 28 48 18" fill="none" stroke="#0E7C7C" stroke-width="3" stroke-linecap="round"/></svg>';
  function samplePack() {
    return {
      ids: ['a', 'm'],
      say: { a: 'ah', m: 'mmm', am: 'am' },
      art: { a: ADDIE, m: MANNY },
      pics: {
        a: [OBJ.ant, OBJ.apple],
        m: [OBJ.mat, OBJ.mango, OBJ.mop]
      },
      words: [{ text: 'am', src: AM, parts: ['a', 'm'], decoy: OBJ.apple }]
    };
  }
  let PACK = samplePack();
  const LESSON = [
    { id: 'team', title: 'Meet the Team' },
    { id: 'meet', title: 'Meet the Letter' },
    { id: 'link', title: 'Link Arms' }
  ];
  const GAMES = [
    { id: 'pop', title: 'Sound Pop', icon: 'foundation/img/games/pop.jpg' },
    { id: 'feed', title: 'Feed the Friend', icon: 'foundation/img/games/feed.jpg' },
    { id: 'catch', title: 'Beginning Sound Catch', icon: 'foundation/img/games/catch.jpg' },
    { id: 'hunt', title: 'Letter Hunt', icon: 'foundation/img/games/hunt.jpg' },
    { id: 'build', title: 'Build It', icon: 'foundation/img/games/build.jpg' },
    { id: 'ears', title: 'Ears Only Blend', icon: 'foundation/img/games/ears.jpg' },
    { id: 'flash', title: 'Quick Flash', icon: 'foundation/img/games/flash.jpg' },
    { id: 'match', title: 'Read and Match', icon: 'foundation/img/games/match.jpg' },
    { id: 'sound', title: 'Sound Match', icon: 'foundation/img/games/sound.jpg' },
    { id: 'sort', title: 'Sort the Sound', icon: 'foundation/img/games/sort.jpg' }
  ];

  function say(text) {
    return new Promise((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.92;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch (e) { resolve(); }
    });
  }
  function yes() { return Snd.play(A.sfx.ding); }
  function miss(el) {
    Snd.play(A.sfx.tryagain);
    if (!el || !el.classList) return;
    el.classList.remove('ll1miss');
    void el.offsetWidth;
    el.classList.add('ll1miss');
  }
  function clearWait() {
    if (IR._day1Wait) { clearTimeout(IR._day1Wait); IR._day1Wait = 0; }
  }
  function go(id) { clearWait(); Snd.stop(); location.hash = '#/foundation/sample/' + id; }

  function shell(title, back) {
    const scr = IR.newScreen();
    const fill = h('i');
    const bar = h('div', { class: 'pbar ll1bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instr = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const topNav = IR.ui && IR.ui.pageNav
      ? IR.ui.pageNav(() => { clearWait(); location.hash = back; })
      : h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back', onclick: () => { clearWait(); Snd.stop(); location.hash = back; } }, icon('close'));
    const screen = h('div', { class: 'screen lessonscreen u5step ll-day1' },
      h('header', { class: 'lesson-top ll1top' },
        topNav,
        h('h1', null, title),
        h('span', { class: 'll1faces' },
          h('img', { class: 'll1face', src: ZIP, alt: 'Zip' }),
          h('img', { class: 'll1face', src: FRILL, alt: 'Frill' }))),
      instr, stage,
      h('div', { class: 'll1foot' }, bar));
    const ctx = {
      scr: scr,
      stage: stage,
      mistakes: 0,
      miss() { ctx.mistakes += 1; },
      progress(f) {
        const v = Math.round(Math.max(0, Math.min(1, f)) * 100);
        fill.style.width = v + '%';
        bar.setAttribute('aria-valuenow', String(v));
      },
      setInstr(text) {
        instr.innerHTML = '';
        if (!text) return;
        instr.append(speakerBtn(() => say(text), 'Hear the directions'), h('span', { class: 'itext' }, text));
        say(text);
      },
      badge(label, again) {
        ctx.progress(1);
        if (PACK.onDone) PACK.onDone(again);
        IR.touchStreak();
        const done = IR.engage.endScreen({
          title: label,
          stars: ctx.mistakes ? 2 : 3,
          nextLabel: 'More games',
          backLabel: 'Play again',
          onBack: () => { const app = document.querySelector('#app'); app.innerHTML = ''; open('#/foundation/sample/' + again, app); },
          onNext: () => go('play')
        });
        done.classList.add('ll1end');
        document.querySelector('#app').append(done);
        Snd.play(A.sfx.done);
      }
    };
    document.querySelector('#app').append(screen);
    if (IR.engage) IR.engage.mount(ctx, screen);
    return ctx;
  }

  function big(label, on) {
    return h('button', { class: 'll1card', type: 'button', onclick: on }, h('b', null, label));
  }

  function team(ctx) {
    ctx.progress(0.05);
    ctx.setInstr('Tap the name. Then tap the sound three times.');
    const need = { a: 0, m: 0 };
    const named = { a: false, m: false };
    function bump() {
      ctx.progress((need.a + need.m + (named.a ? 1 : 0) + (named.m ? 1 : 0)) / 8);
      if (named.a && named.m && need.a >= 3 && need.m >= 3) setTimeout(() => go('meet'), 400);
    }
    const one = (id, sound, nameSay) => h('div', { class: 'll1letter' },
      h('button', { class: 'll1name', type: 'button', onclick: (e) => { e.currentTarget.classList.add('lit'); named[id] = true; say(nameSay); bump(); } },
        h('span', null, 'My name is: ' + id)),
      h('div', { class: 'll1sound' },
        h('p', null, 'My sound is ' + sound),
        h('div', { class: 'll1taps' }, ...[1, 2, 3].map(() => h('button', {
          class: 'll1tap', type: 'button',
          onclick: (e) => {
            if (e.currentTarget.classList.contains('lit')) return;
            e.currentTarget.classList.add('lit');
            need[id] += 1;
            say(PACK.say[id]);
            yes();
            bump();
          }
        }, id)))));
    ctx.stage.append(h('div', { class: 'll1pair' }, one('a', '/a/', 'ay'), one('m', '/m/', 'em')));
  }

  function meet(ctx, which) {
    const letters = [
      { id: 'a', sound: '/a/', name: 'ay' },
      { id: 'm', sound: '/m/', name: 'em' }
    ];
    let i = which === 'm' ? 1 : 0;
    function show() {
      if (i >= letters.length) { go('link'); return; }
      const L = letters[i];
      let taps = 0;
      ctx.progress((i + 0.15) / letters.length);
      ctx.setInstr('Tap the name. Then tap each sound.');
      const circles = [0, 1, 2].map(() => h('button', {
        class: 'll1circle', type: 'button',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          e.currentTarget.classList.add('lit');
          taps += 1;
          say(PACK.say[L.id]);
          ctx.progress((i + taps / 3) / letters.length);
          if (taps < 3) return;
          yes();
          i += 1;
          setTimeout(show, 350);
        }
      }, L.id));
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'll1meet' },
        h('button', { class: 'll1name', type: 'button', onclick: () => say(L.name) }, h('span', null, 'My name is: ' + L.id)),
        h('div', { class: 'll1mouth' },
          h('span', { class: 'll1mouthico', html: MOUTH }),
          h('p', null, 'My sound is ' + L.sound),
          h('div', { class: 'll1taps' }, ...circles))));
    }
    show();
  }

  function link(ctx) {
    ctx.progress(0.7);
    ctx.setInstr('Tap a, then m. They link arms.');
    let at = 0;
    const built = h('p', { class: 'll1built' }, '');
    ctx.stage.append(built, h('div', { class: 'll1pair' }, ...['a', 'm'].map((id, n) => big(id, (e) => {
      if (n !== at) { miss(e.currentTarget); return; }
      at += 1;
      built.textContent += id;
      say(PACK.say[id]);
      if (at < 2) return;
      ctx.stage.append(
        h('img', { class: 'll1link', src: LINK, alt: 'a and m link arms' }),
        h('p', { class: 'll1cap' }, 'Am.'));
      yes();
      ctx.progress(1);
      IR._day1Wait = setTimeout(() => go('done'), 700);
    }))));
  }

  function lessonBadge(ctx) {
    ctx.progress(1);
    ctx.setInstr('');
    ctx.stage.append(h('div', { class: 'll1celebrate' },
      h('img', { src: ZIP, alt: 'Zip' }),
      h('img', { src: FRILL, alt: 'Frill' }),
      h('div', { class: 'badgeart', html: IR.ICON.badge }),
      h('h2', null, 'Look what I can read!'),
      h('p', { class: 'll1readline' }, 'am'),
      h('button', { class: 'btn big primary', type: 'button', onclick: () => go('play') }, 'Play the games')));
  }

  function menu(ctx) {
    ctx.progress(1);
    ctx.setInstr('Pick a game.');
    ctx.stage.append(h('div', { class: 'll1menu' }, ...GAMES.map((game, n) => h('button', {
      class: 'll1game',
      type: 'button',
      onclick: () => go(game.id)
    }, h('span', { class: 'll1gnum' }, String(n + 1)), h('img', { src: game.icon, alt: '' }), h('b', null, game.title)))));
  }

  function rounds(ctx, list, draw, id) {
    let i = 0;
    function step() {
      if (i >= list.length) { ctx.badge(GAMES.filter((g) => g.id === id)[0].title, id); return; }
      ctx.progress(i / list.length);
      ctx.stage.innerHTML = '';
      draw(list[i], () => { i += 1; yes(); setTimeout(step, 280); });
    }
    step();
  }

  function letterBag() {
    return PACK.ids.length > 2 ? PACK.ids.slice() : PACK.ids.concat(PACK.ids);
  }
  function pictureCards() {
    const out = [];
    PACK.ids.forEach((id) => {
      (PACK.pics[id] || []).forEach((src) => out.push({ src: src, answer: id }));
    });
    return out;
  }
  function capWord(text) {
    const s = String(text);
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }
  function pop(ctx) {
    ctx.setInstr('Hear the sound. Pop that bubble.');
    const ids = PACK.ids;
    rounds(ctx, letterBag(), (id, ok) => {
      say(PACK.say[id]);
      const shown = ids.length > 2 ? shuffle(ids) : shuffle(ids.concat(ids));
      const bubbles = shown.map((letter) => h('button', {
        class: 'll1bubble',
        type: 'button',
        onclick: (e) => {
          if (letter !== id) { miss(e.currentTarget); return; }
          e.currentTarget.classList.add('popped');
          ok();
        }
      }, letter));
      ctx.stage.append(h('div', { class: 'll1bubbles' }, ...bubbles));
    }, 'pop');
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function feed(ctx) {
    ctx.setInstr('Hear the sound. Tap that friend.');
    rounds(ctx, letterBag(), (id, ok) => {
      say(PACK.say[id]);
      const friends = PACK.ids.map((letter) => h('button', {
        class: 'll1friend',
        type: 'button',
        onclick: (e) => { if (letter === id) ok(); else miss(e.currentTarget); }
      }, h('img', { src: PACK.art[letter], alt: letter }), h('b', null, letter)));
      ctx.stage.append(h('div', { class: PACK.ids.length > 2 ? 'll1friends' : 'll1pair' }, ...friends));
    }, 'feed');
  }

  function catchSound(ctx) {
    ctx.setInstr('Tap the first sound.');
    rounds(ctx, pictureCards(), (pic, ok) => {
      ctx.stage.append(
        h('img', { class: 'll1link', src: pic.src, alt: '' }),
        h('div', { class: PACK.ids.length > 2 ? 'll1friends' : 'll1pair' }, ...PACK.ids.map((letter) => big(letter, (e) => {
          if (letter === pic.answer) ok(); else miss(e.currentTarget);
        }))));
    }, 'catch');
  }

  function hunt(ctx) {
    ctx.setInstr('Tap the letter you hear.');
    const spots = [[12, 18], [70, 14], [40, 42], [78, 58], [18, 66]];
    let round = 0;
    function show() {
      if (round >= PACK.ids.length) { ctx.badge('Letter Hunt', 'hunt'); return; }
      const target = PACK.ids[round];
      say(PACK.say[target]);
      const others = PACK.ids.filter((id) => id !== target);
      const letters = [target, target, target].concat(others).slice(0, spots.length);
      let left = 3;
      const beach = h('div', { class: 'll1beach' });
      shuffle(letters).forEach((id, n) => {
        const spot = spots[n];
        beach.append(h('button', {
          class: 'll1hunt',
          type: 'button',
          style: 'left:' + spot[0] + '%;top:' + spot[1] + '%',
          onclick: (e) => {
            if (e.currentTarget.classList.contains('lit')) return;
            if (id !== target) { miss(e.currentTarget); return; }
            e.currentTarget.classList.add('lit');
            left -= 1;
            say(PACK.say[target]);
            ctx.progress((round + (3 - left) / 3) / PACK.ids.length);
            if (left > 0) return;
            yes();
            round += 1;
            setTimeout(show, 280);
          }
        }, id));
      });
      ctx.stage.innerHTML = '';
      ctx.stage.append(beach);
    }
    show();
  }

  function build(ctx) {
    ctx.setInstr('Tap the letters to make the word.');
    let w = 0;
    function show() {
      if (w >= PACK.words.length) { ctx.badge('Build It', 'build'); return; }
      const word = PACK.words[w];
      let at = 0;
      const built = h('p', { class: 'll1built' }, '');
      ctx.stage.innerHTML = '';
      ctx.stage.append(built, h('div', { class: 'll1pair' }, ...shuffle(word.parts).map((id) => big(id, (e) => {
        const btn = e.currentTarget;
        if (btn.disabled) return;
        if (word.parts[at] !== id) { miss(btn); return; }
        btn.disabled = true;
        btn.classList.add('lit');
        at += 1;
        built.textContent += id;
        say(PACK.say[id]);
        ctx.progress((w + at / word.parts.length) / PACK.words.length);
        if (at < word.parts.length) return;
        yes();
        w += 1;
        setTimeout(show, 350);
      }))));
    }
    show();
  }

  function ears(ctx) {
    ctx.setInstr('Listen. Then tap the picture.');
    let w = 0;
    function show() {
      if (w >= PACK.words.length) { ctx.badge('Ears Only Blend', 'ears'); return; }
      const word = PACK.words[w];
      const choices = h('div', { class: 'll1pair' });
      ctx.stage.innerHTML = '';
      ctx.stage.append(choices);
      const pick = (src, good) => h('button', {
        class: 'll1friend', type: 'button',
        onclick: (e) => {
          if (!good) { miss(e.currentTarget); return; }
          yes();
          w += 1;
          ctx.progress(w / PACK.words.length);
          setTimeout(show, 280);
        }
      }, h('img', { src: src, alt: '' }));
      word.parts.reduce((p, id) => p.then(() => say(PACK.say[id])), Promise.resolve()).then(() => {
        choices.append(pick(word.src, true), pick(word.decoy || OBJ.apple, false));
      });
    }
    show();
  }

  function flash(ctx) {
    const deck = PACK.ids.slice();
    function show() {
      if (!deck.length) { ctx.badge('Quick Flash', 'flash'); return; }
      const id = deck[0];
      ctx.progress(1 - deck.length / PACK.ids.length);
      ctx.setInstr('Say the sound. Tap I said it.');
      const meter = h('i');
      ctx.stage.innerHTML = '';
      ctx.stage.append(
        h('p', { class: 'll1flash' }, id),
        h('div', { class: 'll1meter', 'aria-hidden': 'true' }, meter),
        h('div', { class: 'll1pair' },
          h('button', { class: 'btn big primary', type: 'button', onclick: () => { say(PACK.say[id]); deck.shift(); show(); } }, 'I said it'),
          h('button', { class: 'btn big', type: 'button', onclick: () => { deck.push(deck.shift()); ctx.miss(); show(); } }, 'Not yet')));
      requestAnimationFrame(() => { meter.style.width = '100%'; });
    }
    show();
  }

  function match(ctx) {
    ctx.setInstr('Tap the word for the picture.');
    let w = 0;
    function show() {
      if (w >= PACK.words.length) { ctx.badge('Read and Match', 'match'); return; }
      const word = PACK.words[w];
      const next = PACK.words[(w + 1) % PACK.words.length];
      const wrong = PACK.words.length > 1 ? next.text : (PACK.ids[0] === word.text ? PACK.ids[1] : PACK.ids[0]);
      ctx.stage.innerHTML = '';
      ctx.stage.append(
        h('figure', { class: 'fs-scene ll1pic' },
          h('img', { src: word.src, alt: capWord(word.text) }),
          h('figcaption', null, capWord(word.text))),
        h('div', { class: 'll1pair' },
          big(word.text, () => {
            yes();
            w += 1;
            ctx.progress(w / PACK.words.length);
            setTimeout(show, 280);
          }),
          big(wrong, (e) => miss(e.currentTarget))));
    }
    show();
  }

  function soundMatch(ctx) {
    ctx.setInstr('Hear the sound. Tap the picture.');
    const list = pictureCards().map((pic) => ({ sound: pic.answer, src: pic.src }));
    rounds(ctx, list, (item, ok) => {
      say(PACK.say[item.sound]);
      const rest = pictureCards().filter((pic) => pic.src !== item.src).slice(0, 2);
      const options = shuffle([{ src: item.src, good: true }].concat(rest.map((pic) => ({ src: pic.src, good: false }))));
      ctx.stage.append(h('div', { class: 'll1trio' }, ...options.map((opt) => h('button', {
        class: 'll1friend', type: 'button',
        onclick: (e) => { if (opt.good) ok(); else miss(e.currentTarget); }
      }, h('img', { src: opt.src, alt: '' })))));
    }, 'sound');
  }

  function sortGame(ctx) {
    ctx.setInstr('Tap the first sound.');
    rounds(ctx, pictureCards(), (card, ok) => {
      ctx.stage.append(
        h('img', { class: 'll1link', src: card.src, alt: '' }),
        h('div', { class: PACK.ids.length > 2 ? 'll1friends' : 'll1pair' }, ...PACK.ids.map((letter) => big(letter, (e) => {
          if (letter === card.answer) ok(); else miss(e.currentTarget);
        }))));
    }, 'sort');
  }

  const RUN = {
    team: team, meet: meet, link: link, done: lessonBadge, play: menu,
    pop: pop, feed: feed, catch: catchSound, hunt: hunt, build: build, ears: ears, flash: flash, match: match, sound: soundMatch, sort: sortGame
  };

  function day1Play(app, id, pack, back) {
    if (!RUN[id] || !GAMES.some((item) => item.id === id)) return false;
    PACK = pack || samplePack();
    app.innerHTML = '';
    const step = GAMES.filter((item) => item.id === id)[0];
    const ctx = shell(step.title, back || '#/foundation/letters/g1');
    RUN[id](ctx);
    return true;
  }

  function open(hash, app) {
    const m = /^#\/foundation\/sample(?:\/([a-z]+))?\/?$/.exec(hash || '');
    if (!m) return false;
    PACK = samplePack();
    const id = m[1] || 'team';
    if (!RUN[id]) return false;
    app.innerHTML = '';
    const titles = { done: 'Look what I can read', play: 'Games' };
    const step = LESSON.filter((item) => item.id === id)[0] || GAMES.filter((item) => item.id === id)[0];
    const back = (id === 'team' || id === 'meet' || id === 'link' || id === 'done') ? '#/foundation/letters/g1' : '#/foundation/sample/play';
    const ctx = shell(titles[id] || (step && step.title) || 'Day 1', back);
    if (id === 'meet') meet(ctx, '');
    else RUN[id](ctx);
    return true;
  }

  const prev = IR.foundationRoute;
  IR.foundationRoute = function (hash, app) {
    if (open(hash, app)) return true;
    return prev ? prev(hash, app) : false;
  };
  IR.day1Play = day1Play;
  IR.day1Flow = { LESSON: LESSON, GAMES: GAMES };
})();
