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
  function home() { return IR._teamHome || '#/foundation/letters/g1'; }
  function teamId() {
    const m = /g[1-7]/.exec(home());
    return m ? m[0] : 'g1';
  }
  function pool() {
    const list = IR._teamLetters && IR._teamLetters.length ? IR._teamLetters.slice() : ['a', 'm'];
    return list;
  }
  function speakId(id) {
    const rows = (IR.letters && IR.letters.LETTERS) || [];
    const row = rows.filter((item) => item.id === id)[0];
    return say(row ? String(row.soundSay || id).split(',')[0] : (SAY[id] || id));
  }
  function face(id) {
    return ({
      a: ASA,
      m: MANNY,
      s: 'foundation/img/letters/s_sami_sea_snake.jpg',
      t: 'foundation/img/letters/t_tama_sea_turtle.jpg'
    })[id] || '';
  }
  function go(id) { clearWait(); Snd.stop(); location.hash = '#/foundation/play/' + teamId() + '/' + id; }

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
        if (IR.letterPath) IR.letterPath.markGame(teamId(), again, ctx.mistakes ? 2 : 3);
        const done = IR.engage.endScreen({
          title: label,
          stars: ctx.mistakes ? 2 : 3,
          onlyNext: true,
          orange: true,
          onNext: () => { location.hash = home(); }
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
        h('p', { class: 'll1cap' }, 'Am.'),
        h('button', { class: 'btn big primary daynext', type: 'button', onclick: () => {
          clearWait();
          if (IR.letterPath) IR.letterPath.mark(teamId(), 1, 'lesson');
          location.hash = home();
        } }, 'Next', icon('next')));
      yes();
      ctx.progress(1);
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
      h('button', { class: 'btn big primary daynext', type: 'button', onclick: () => {
        location.hash = IR.letterPath ? IR.letterPath.cheer(teamId()) : home();
      } }, 'Next', icon('next'))));
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
    const ids = pool();
    const bag = [];
    while (bag.length < 4) ids.forEach((id) => { if (bag.length < 4) bag.push(id); });
    rounds(ctx, bag, (id, ok) => {
      speakId(id);
      const choices = shuffle(ids.filter((letter) => letter !== id)).slice(0, 3);
      choices.push(id);
      const bubbles = shuffle(choices).map((letter) => h('button', {
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
    const ids = pool();
    const bag = [];
    while (bag.length < 4) ids.forEach((id) => { if (bag.length < 4) bag.push(id); });
    rounds(ctx, bag, (id, ok) => {
      speakId(id);
      const other = ids.filter((letter) => letter !== id)[0] || id;
      const friend = (letter) => {
        const src = face(letter);
        return h('button', {
          class: 'll1friend',
          type: 'button',
          onclick: (e) => { if (letter === id) ok(); else miss(e.currentTarget); }
        }, src ? h('img', { src: src, alt: '' }) : h('b', null, letter), h('b', null, letter));
      };
      ctx.stage.append(h('div', { class: 'll1pair' }, friend(id), friend(other)));
    }, 'feed');
  }

  function catchSound(ctx) {
    ctx.setInstr('Tap the first sound.');
    const ids = pool();
    const known = {
      a: [OBJ.ant, OBJ.apple],
      m: [OBJ.mat, OBJ.mango],
      s: [face('s')],
      t: [face('t')]
    };
    const pics = [];
    ids.forEach((id) => (known[id] || []).forEach((src) => { if (src) pics.push({ src: src, answer: id }); }));
    const deck = (pics.length ? pics : [{ src: OBJ.apple, answer: ids[0] }]).slice(0, 4);
    rounds(ctx, deck, (pic, ok) => {
      ctx.stage.append(
        h('img', { class: 'll1link', src: pic.src, alt: '' }),
        h('div', { class: 'll1pair' }, ...ids.map((letter) => big(letter, (e) => {
          if (letter === pic.answer) ok(); else miss(e.currentTarget);
        }))));
    }, 'catch');
  }

  function hunt(ctx) {
    ctx.setInstr('Tap the sound you hear.');
    const ids = pool();
    const target = ids[ids.length - 1];
    speakId(target);
    const spots = [
      { id: target, x: 12, y: 18 }, { id: ids[0], x: 70, y: 14 }, { id: target, x: 40, y: 42 },
      { id: target, x: 78, y: 58 }, { id: ids[0], x: 18, y: 66 }
    ];
    let left = spots.filter((s) => s.id === target).length;
    const beach = h('div', { class: 'll1beach' });
    spots.forEach((spot) => {
      beach.append(h('button', {
        class: 'll1hunt',
        type: 'button',
        style: 'left:' + spot.x + '%;top:' + spot.y + '%',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          if (spot.id !== target) { miss(e.currentTarget); return; }
          e.currentTarget.classList.add('lit');
          left -= 1;
          speakId(target);
          ctx.progress((3 - left) / 3);
          if (left > 0) return;
          yes();
          setTimeout(() => ctx.badge('Letter Hunt', 'hunt'), 300);
        }
      }, spot.id));
    });
    ctx.stage.append(beach);
  }

  function buildWord() {
    const have = pool();
    const words = ['am', 'at', 'mat', 'sat'];
    const ok = words.filter((word) => word.split('').every((ch) => have.indexOf(ch) >= 0));
    return (ok[ok.length - 1] || have.slice(0, 2).join('') || 'am').split('');
  }
  function build(ctx) {
    ctx.setInstr('Tap the sounds.');
    const order = buildWord();
    let at = 0;
    const built = h('p', { class: 'll1built' }, '');
    const shown = shuffle(order.slice());
    ctx.stage.append(built, h('div', { class: 'll1pair' }, ...shown.map((id) => big(id, (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return;
      if (order[at] !== id) { miss(btn); return; }
      btn.disabled = true;
      btn.classList.add('lit');
      at += 1;
      built.textContent += id;
      speakId(id);
      ctx.progress(at / order.length);
      if (at < order.length) return;
      yes();
      setTimeout(() => ctx.badge('Build It', 'build'), 350);
    }))));
  }

  function ears(ctx) {
    ctx.setInstr('Listen. Then tap the picture.');
    const word = buildWord();
    const choices = h('div', { class: 'll1pair' });
    ctx.stage.append(choices);
    const pick = (src, good) => h('button', {
      class: 'll1friend', type: 'button',
      onclick: (e) => {
        if (good) { yes(); ctx.progress(1); setTimeout(() => ctx.badge('Ears Only Blend', 'ears'), 300); }
        else miss(e.currentTarget);
      }
    }, h('img', { src: src, alt: '' }));
    const pics = { am: AM, mat: 'foundation/img/scenes/mat.jpg', sat: 'foundation/img/scenes/sat.jpg', at: 'foundation/img/scenes/mat.jpg' };
    const right = pics[word.join('')] || face(word[0]) || AM;
    let chain = Promise.resolve();
    word.forEach((id) => { chain = chain.then(() => speakId(id)); });
    chain.then(() => { choices.append(pick(right, true), pick(OBJ.apple, false)); });
  }

  function flash(ctx) {
    const deck = pool().slice();
    function show() {
      if (!deck.length) { ctx.badge('Quick Flash', 'flash'); return; }
      const id = deck[0];
      ctx.progress(1 - deck.length / pool().length);
      ctx.setInstr('Say the sound.');
      speakId(id);
      const meter = h('i');
      ctx.stage.innerHTML = '';
      ctx.stage.append(
        h('p', { class: 'll1flash' }, id),
        h('div', { class: 'll1meter', 'aria-hidden': 'true' }, meter),
        h('div', { class: 'll1pair' },
          h('button', { class: 'btn big primary daynext', type: 'button', 'aria-label': 'I said it', onclick: () => { deck.shift(); show(); } }, icon('check')),
          h('button', { class: 'btn big', type: 'button', 'aria-label': 'Not yet', onclick: () => { deck.push(deck.shift()); ctx.miss(); show(); } }, icon('close'))));
      requestAnimationFrame(() => { meter.style.width = '100%'; });
    }
    show();
  }

  function match(ctx) {
    ctx.setInstr('Tap the word for the picture.');
    const word = buildWord().join('');
    const pics = { am: AM, mat: 'foundation/img/scenes/mat.jpg', sat: 'foundation/img/scenes/sat.jpg', at: 'foundation/img/scenes/mat.jpg' };
    speak(word);
    ctx.stage.append(
      h('img', { class: 'll1link', src: pics[word] || AM, alt: '' }),
      h('div', { class: 'll1pair' },
        big(word, () => { yes(); ctx.progress(1); setTimeout(() => ctx.badge('Read and Match', 'match'), 300); }),
        big(pool()[0], (e) => miss(e.currentTarget))));
  }

  function soundMatch(ctx) {
    ctx.setInstr('Hear the sound. Tap the picture.');
    const ids = pool();
    const photos = { a: OBJ.apple, m: OBJ.mango, s: face('s'), t: face('t') };
    const list = [];
    let guard = 0;
    while (list.length < 4 && guard < 8) {
      guard += 1;
      let added = false;
      ids.forEach((id) => {
        const src = photos[id] || face(id);
        if (list.length < 4 && src) { list.push({ sound: id, src: src }); added = true; }
      });
      if (!added) break;
    }
    if (!list.length) list.push({ sound: ids[0], src: OBJ.apple });
    rounds(ctx, list, (item, ok) => {
      speakId(item.sound);
      const other = ids.filter((id) => id !== item.sound && photos[id])[0] || ids[0];
      const options = shuffle([
        { src: item.src, good: true },
        { src: photos[other] || OBJ.apple, good: false }
      ]);
      ctx.stage.append(h('div', { class: 'll1trio' }, ...options.map((opt) => h('button', {
        class: 'll1friend', type: 'button',
        onclick: (e) => { if (opt.good) ok(); else miss(e.currentTarget); }
      }, h('img', { src: opt.src, alt: '' })))));
    }, 'sound');
  }

  function sortGame(ctx) {
    ctx.setInstr('Tap the sound for the picture.');
    const ids = pool();
    const known = { a: [OBJ.ant, OBJ.apple], m: [OBJ.mat, OBJ.mango], s: [face('s')], t: [face('t')] };
    const cards = [];
    ids.forEach((id) => (known[id] || []).forEach((src) => { if (src && cards.length < 4) cards.push({ src: src, answer: id }); }));
    rounds(ctx, cards.length ? cards : [{ src: OBJ.apple, answer: ids[0] }], (card, ok) => {
      ctx.stage.append(
        h('img', { class: 'll1link', src: card.src, alt: '' }),
        h('div', { class: 'll1pair' }, ...ids.map((letter) => big(letter, (e) => {
          if (letter === card.answer) ok(); else miss(e.currentTarget);
        }))));
    }, 'sort');
  }

  const RUN = {
    team: team, meet: meet, link: link, done: lessonBadge, play: menu,
    pop: pop, feed: feed, catch: catchSound, hunt: hunt, build: build, ears: ears, flash: flash, match: match, sound: soundMatch, sort: sortGame
  };

  function open(hash, app) {
    const play = /^#\/foundation\/play\/(g[1-7])\/([a-z]+)\/?$/.exec(hash || '');
    const m = play || /^#\/foundation\/sample(?:\/([a-z]+))?\/?$/.exec(hash || '');
    if (!m) return false;
    if (play && IR.letterPath && IR.letterPath.playLetters) {
      IR._teamLetters = IR.letterPath.playLetters(play[1]);
      IR._teamHome = '#/foundation/letters/' + play[1];
    }
    const id = play ? play[2] : (m[1] || 'team');
    if (id === 'play') { location.hash = home(); return true; }
    if (!RUN[id]) return false;
    app.innerHTML = '';
    const titles = { done: 'Look what I can read', play: 'Games' };
    const step = LESSON.filter((item) => item.id === id)[0] || GAMES.filter((item) => item.id === id)[0];
    const back = home();
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
