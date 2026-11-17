/* Team 1 Day 1 student sample. A short lesson, then games. Letters a and m only. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, icon, Snd, A, speakerBtn } = IR;
  const ZIP = 'img/zipA.webp';
  const FRILL = 'img/frill.webp';
  const ASA = 'foundation/img/letters/a_asa_apple_snail.jpg';
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
  const SAY = { a: 'ah', m: 'mmm', am: 'am' };
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
  const DAY = '#/foundation/letters/g1/day/day1a';
  function go(id) { clearWait(); Snd.stop(); location.hash = '#/foundation/sample/' + id; }

  function shell(title, back) {
    const scr = IR.newScreen();
    const fill = h('i');
    const bar = h('div', { class: 'pbar ll1bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instr = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const screen = h('div', { class: 'screen lessonscreen u5step ll-day1' },
      h('header', { class: 'lesson-top ll1top' },
        h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back', onclick: () => { clearWait(); Snd.stop(); location.hash = back; } }, icon('close')),
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
        IR.touchStreak();
        const done = IR.engage.endScreen({
          title: label,
          stars: ctx.mistakes ? 2 : 3,
          nextLabel: 'More games',
          backLabel: 'Play again',
          onBack: () => { const app = document.querySelector('#app'); app.innerHTML = ''; open('#/foundation/sample/' + again, app); },
          onNext: () => { location.hash = DAY; }
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
            say(SAY[id]);
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
          say(SAY[L.id]);
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
      say(SAY[id]);
      if (at < 2) return;
      ctx.stage.append(
        h('img', { class: 'll1link', src: LINK, alt: 'a and m link arms' }),
        h('p', { class: 'll1cap' }, 'Am.'));
      yes();
      ctx.progress(1);
      IR._day1Wait = setTimeout(() => { location.hash = DAY; }, 700);
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

  function pop(ctx) {
    ctx.setInstr('Hear the sound. Pop that bubble.');
    const bag = ['a', 'm', 'a', 'm'];
    rounds(ctx, bag, (id, ok) => {
      say(SAY[id]);
      const bubbles = shuffle(['a', 'm', 'a', 'm']).map((letter) => h('button', {
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
    rounds(ctx, ['a', 'm', 'm', 'a'], (id, ok) => {
      say(SAY[id]);
      const friend = (letter, src) => h('button', {
        class: 'll1friend',
        type: 'button',
        onclick: (e) => { if (letter === id) ok(); else miss(e.currentTarget); }
      }, h('img', { src: src, alt: letter }), h('b', null, letter));
      ctx.stage.append(h('div', { class: 'll1pair' }, friend('a', ASA), friend('m', MANNY)));
    }, 'feed');
  }

  function catchSound(ctx) {
    ctx.setInstr('Tap the first sound.');
    const pics = [
      { src: OBJ.ant, answer: 'a' },
      { src: OBJ.apple, answer: 'a' },
      { src: OBJ.mat, answer: 'm' },
      { src: OBJ.mango, answer: 'm' },
      { src: OBJ.mop, answer: 'm' }
    ];
    rounds(ctx, pics, (pic, ok) => {
      ctx.stage.append(
        h('img', { class: 'll1link', src: pic.src, alt: '' }),
        h('div', { class: 'll1pair' }, ...['a', 'm'].map((letter) => big(letter, (e) => {
          if (letter === pic.answer) ok(); else miss(e.currentTarget);
        }))));
    }, 'catch');
  }

  function hunt(ctx) {
    ctx.setInstr('Tap every a.');
    const spots = [
      { id: 'a', x: 12, y: 18 }, { id: 'm', x: 70, y: 14 }, { id: 'a', x: 40, y: 42 },
      { id: 'a', x: 78, y: 58 }, { id: 'm', x: 18, y: 66 }
    ];
    let left = spots.filter((s) => s.id === 'a').length;
    const beach = h('div', { class: 'll1beach' });
    spots.forEach((spot) => {
      beach.append(h('button', {
        class: 'll1hunt',
        type: 'button',
        style: 'left:' + spot.x + '%;top:' + spot.y + '%',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          if (spot.id !== 'a') { miss(e.currentTarget); return; }
          e.currentTarget.classList.add('lit');
          left -= 1;
          say('ah');
          ctx.progress((3 - left) / 3);
          if (left > 0) return;
          yes();
          setTimeout(() => ctx.badge('Letter Hunt', 'hunt'), 300);
        }
      }, spot.id));
    });
    ctx.stage.append(beach);
  }

  function build(ctx) {
    ctx.setInstr('Tap a, then m, to make am.');
    const order = ['a', 'm'];
    let at = 0;
    const built = h('p', { class: 'll1built' }, '');
    ctx.stage.append(built, h('div', { class: 'll1pair' }, ...['m', 'a'].map((id) => big(id, (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return;
      if (order[at] !== id) { miss(btn); return; }
      btn.disabled = true;
      btn.classList.add('lit');
      at += 1;
      built.textContent += id;
      say(SAY[id]);
      ctx.progress(at / 2);
      if (at < 2) return;
      yes();
      setTimeout(() => ctx.badge('Build It', 'build'), 350);
    }))));
  }

  function ears(ctx) {
    ctx.setInstr('Listen. Then tap the picture.');
    const choices = h('div', { class: 'll1pair' });
    ctx.stage.append(choices);
    const pick = (src, good) => h('button', {
      class: 'll1friend', type: 'button',
      onclick: (e) => {
        if (good) { yes(); ctx.progress(1); setTimeout(() => ctx.badge('Ears Only Blend', 'ears'), 300); }
        else miss(e.currentTarget);
      }
    }, h('img', { src: src, alt: '' }));
    say('ah').then(() => say('mmm')).then(() => {
      choices.append(pick(AM, true), pick(OBJ.apple, false));
    });
  }

  function flash(ctx) {
    const deck = ['a', 'm'];
    function show() {
      if (!deck.length) { ctx.badge('Quick Flash', 'flash'); return; }
      const id = deck[0];
      ctx.progress(1 - deck.length / 2);
      ctx.setInstr('Say the sound. Tap I said it.');
      const meter = h('i');
      ctx.stage.innerHTML = '';
      ctx.stage.append(
        h('p', { class: 'll1flash' }, id),
        h('div', { class: 'll1meter', 'aria-hidden': 'true' }, meter),
        h('div', { class: 'll1pair' },
          h('button', { class: 'btn big primary', type: 'button', onclick: () => { say(SAY[id]); deck.shift(); show(); } }, 'I said it'),
          h('button', { class: 'btn big', type: 'button', onclick: () => { deck.push(deck.shift()); ctx.miss(); show(); } }, 'Not yet')));
      requestAnimationFrame(() => { meter.style.width = '100%'; });
    }
    show();
  }

  function match(ctx) {
    ctx.setInstr('Tap the word for the picture.');
    ctx.stage.append(
      h('figure', { class: 'fs-scene ll1pic' },
        h('img', { src: AM, alt: 'Am.' }),
        h('figcaption', null, 'Am.')),
      h('div', { class: 'll1pair' },
        big('am', () => { yes(); ctx.progress(1); setTimeout(() => ctx.badge('Read and Match', 'match'), 300); }),
        big('a', (e) => miss(e.currentTarget))));
  }

  function soundMatch(ctx) {
    ctx.setInstr('Hear the sound. Tap the picture.');
    const list = [
      { sound: 'a', src: OBJ.apple },
      { sound: 'm', src: OBJ.mango },
      { sound: 'a', src: OBJ.ant },
      { sound: 'm', src: OBJ.mop }
    ];
    rounds(ctx, list, (item, ok) => {
      say(SAY[item.sound]);
      const options = shuffle([
        { src: item.src, good: true },
        { src: item.sound === 'a' ? OBJ.mango : OBJ.apple, good: false },
        { src: item.sound === 'a' ? OBJ.mop : OBJ.ant, good: false }
      ]);
      ctx.stage.append(h('div', { class: 'll1trio' }, ...options.map((opt) => h('button', {
        class: 'll1friend', type: 'button',
        onclick: (e) => { if (opt.good) ok(); else miss(e.currentTarget); }
      }, h('img', { src: opt.src, alt: '' })))));
    }, 'sound');
  }

  function sortGame(ctx) {
    ctx.setInstr('Tap a or m for the picture.');
    const cards = [
      { src: OBJ.ant, answer: 'a' },
      { src: OBJ.apple, answer: 'a' },
      { src: OBJ.mat, answer: 'm' },
      { src: OBJ.mango, answer: 'm' }
    ];
    rounds(ctx, cards, (card, ok) => {
      ctx.stage.append(
        h('img', { class: 'll1link', src: card.src, alt: '' }),
        h('div', { class: 'll1pair' }, ...['a', 'm'].map((letter) => big(letter, (e) => {
          if (letter === card.answer) ok(); else miss(e.currentTarget);
        }))));
    }, 'sort');
  }

  const RUN = {
    team: team, meet: meet, link: link, done: lessonBadge, play: menu,
    pop: pop, feed: feed, catch: catchSound, hunt: hunt, build: build, ears: ears, flash: flash, match: match, sound: soundMatch, sort: sortGame
  };

  function open(hash, app) {
    const m = /^#\/foundation\/sample(?:\/([a-z]+))?\/?$/.exec(hash || '');
    if (!m) return false;
    const id = m[1] || 'team';
    if (id === 'play') { location.hash = DAY; return true; }
    if (!RUN[id]) return false;
    app.innerHTML = '';
    const titles = { done: 'Look what I can read', play: 'Games' };
    const step = LESSON.filter((item) => item.id === id)[0] || GAMES.filter((item) => item.id === id)[0];
    const back = DAY;
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
  IR.day1Flow = { LESSON: LESSON, GAMES: GAMES };
})();
