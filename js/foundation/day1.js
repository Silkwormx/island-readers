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
  const MOUTH = '<svg viewBox="0 0 88 64" aria-hidden="true"><ellipse cx="44" cy="34" rx="36" ry="22" fill="#FFE4D6" stroke="#E39A86" stroke-width="3"/><path d="M16 30 Q44 58 72 30 Q44 44 16 30Z" fill="#E23B4A" stroke="#8E1D2C" stroke-width="4" stroke-linejoin="round"/><path d="M24 33 Q44 50 64 33 Q44 41 24 33Z" fill="#4A1020"/><ellipse cx="44" cy="40" rx="11" ry="6" fill="#F08A98"/></svg>';
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
    { id: 'feed', title: 'Feed the Friend', icon: ADDIE, faces: [ADDIE, MANNY] },
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
    const lesson = PACK && PACK.lesson;
    const fill = h('i');
    const bar = h('div', { class: 'pbar ll1bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instr = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const topNav = IR.ui && IR.ui.pageNav
      ? IR.ui.pageNav(() => { clearWait(); location.hash = back; })
      : h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back', onclick: () => { clearWait(); Snd.stop(); location.hash = back; } }, icon('close'));
    const roundEl = h('p', { class: lesson ? 'llkidprog' : 'qcount llround', 'aria-live': 'polite' }, '');
    const header = lesson
      ? h('header', { class: 'uA-top llbar' }, topNav, h('h1', { class: 'uA-title' }, title), roundEl)
      : h('header', { class: 'lesson-top ll1top' },
        topNav,
        h('h1', null, title),
        h('span', { class: 'll1faces' },
          h('img', { class: 'll1face', src: ZIP, alt: 'Zip' }),
          h('img', { class: 'll1face', src: FRILL, alt: 'Frill' })));
    const screen = h('div', { class: lesson ? 'screen fs-team ll-day1 ll-lessonplay' : 'screen lessonscreen u5step ll-day1' },
      header,
      lesson ? null : roundEl,
      instr, stage,
      h('div', { class: 'll1foot' }, bar));
    const ctx = {
      scr: scr,
      stage: stage,
      mistakes: 0,
      roundTo(x, n) {
        if (roundEl) roundEl.textContent = 'Round ' + x + ' of ' + n;
        ctx.progress((x - 1) / Math.max(1, n));
      },
      miss() { ctx.mistakes += 1; },
      progress(f) {
        const v = Math.round(Math.max(0, Math.min(1, f)) * 100);
        fill.style.width = v + '%';
        bar.setAttribute('aria-valuenow', String(v));
      },
      setInstr(text) {
        instr.innerHTML = '';
        if (!text) return;
        if (PACK && PACK.lesson) {
          instr.append(h('button', {
            class: 'llnarr',
            type: 'button',
            'aria-label': 'Frill says: ' + text,
            onclick: () => say(text)
          }, h('img', { src: FRILL, alt: 'Frill' }), h('span', null, text)));
          say(text);
          return;
        }
        instr.append(speakerBtn(() => say(text), 'Hear the directions'), h('span', { class: 'itext' }, text));
        say(text);
      },
      badge(label, again) {
        ctx.progress(1);
        if (PACK.onDone) PACK.onDone(again);
        IR.touchStreak();
        if (PACK && PACK.lesson && PACK.after) {
          Snd.play(A.sfx.done);
          location.hash = PACK.after;
          return;
        }
        const team = /^#\/foundation\/letters\/g(\d+)/.exec(back || '');
        const done = IR.engage.endScreen({
          title: label,
          stars: ctx.mistakes ? 2 : 3,
          backLabel: 'Play again',
          nextLabel: (PACK && PACK.nextLabel) || (team ? 'Back to Team ' + team[1] : 'More games'),
          onBack: () => {
            const app = document.querySelector('#app');
            app.innerHTML = '';
            if (team && IR.day1Play) IR.day1Play(app, again, PACK, back);
            else open('#/foundation/sample/' + again, app);
          },
          onNext: () => {
            if (PACK && PACK.after) { location.hash = PACK.after; return; }
            if (team) location.hash = back;
            else go('play');
          }
        });
        done.classList.add('ll1end');
        const againBtn = done.querySelector('.menulink');
        if (againBtn) { againBtn.classList.remove('menulink'); againBtn.classList.add('btn', 'big', 'llagain'); }
        if (PACK && PACK.lesson && againBtn) againBtn.remove();
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
    }, h('span', { class: 'll1gnum' }, String(n + 1)),
      game.faces
        ? h('span', { class: 'll1faces2' }, ...game.faces.map((src) => h('img', { src: src, alt: '' })))
        : h('img', { src: game.icon, alt: '' }),
      h('b', null, game.title)))));
  }

  const ROUND_N = 12;
  const LIKE = { a: 'ocdu', m: 'nwh', s: 'zcf', t: 'ilf', p: 'bdq', f: 'vth', i: 'ljt', n: 'mhu', o: 'acu', d: 'bpq', c: 'oea', u: 'nao', g: 'qjy', b: 'dph', e: 'cao', k: 'cgx', h: 'nbl', r: 'n', l: 'itf', w: 'vu', j: 'giy', y: 'vjg', x: 'kz', q: 'gp', v: 'fw', z: 's' };
  function cycle(list, n) {
    const out = [];
    if (!list.length) return out;
    const early = list.slice(0, Math.max(1, Math.ceil(list.length / 2)));
    for (let i = 0; i < (n || ROUND_N); i++) {
      const bag = i < 4 ? early : list;
      out.push(bag[i % bag.length]);
    }
    return out;
  }
  function likeIds(answer, ids, count) {
    const raw = (LIKE[answer] || '') + ids.join('');
    const out = [];
    for (const ch of raw) {
      if (ch !== answer && ids.indexOf(ch) >= 0 && out.indexOf(ch) < 0) out.push(ch);
      if (out.length >= count) break;
    }
    return out;
  }
  function choicesFor(id, n) {
    const pool = (PACK.ids || []).concat(PACK.foils || []);
    const out = [id];
    likeIds(id, pool, n).forEach((ch) => { if (out.indexOf(ch) < 0) out.push(ch); });
    return out;
  }
  function rounds(ctx, list, draw, id) {
    const plan = cycle(list, (PACK && PACK.roundN) || ROUND_N);
    let i = 0;
    let streak = 0;
    function step() {
      if (i >= plan.length) { ctx.badge(GAMES.filter((g) => g.id === id)[0].title, id); return; }
      ctx.roundTo(i + 1, plan.length);
      ctx.stage.innerHTML = '';
      if (streak >= 3 && streak % 3 === 0) ctx.stage.append(h('p', { class: 'llpraise', role: 'status' }, streak + ' in a row!'));
      const item = plan[i];
      draw(item, () => { streak += 1; i += 1; yes(); setTimeout(step, 280); }, (el) => {
        streak = 0;
        miss(el);
        const at = i + 3;
        if (at < plan.length) plan[at] = item;
        else if (plan.length < 14) plan.push(item);
      }, i);
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
    rounds(ctx, ids, (id, ok, again, i) => {
      say(PACK.say[id]);
      const shown = choicesFor(id, i < 4 ? 1 : i < 8 ? 2 : Math.max(2, ids.length - 1));
      const bubbles = shuffle(shown).map((letter) => h('button', {
        class: 'll1bubble',
        type: 'button',
        'data-yes': letter === id ? '1' : '0',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('popped')) return;
          if (letter !== id) { again(e.currentTarget); return; }
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
    rounds(ctx, PACK.ids, (id, ok, again, i) => {
      say(PACK.say[id]);
      const shown = [id].concat(likeIds(id, PACK.ids, i < 4 ? 1 : Math.max(2, PACK.ids.length - 1)));
      const friends = shuffle(shown).map((letter) => h('button', {
        class: 'll1friend',
        type: 'button',
        'data-yes': letter === id ? '1' : '0',
        onclick: (e) => { if (letter === id) ok(); else again(e.currentTarget); }
      }, h('img', { src: PACK.art[letter], alt: letter }), h('b', null, letter)));
      ctx.stage.append(h('div', { class: 'll1friends' }, ...friends));
    }, 'feed');
  }

  function catchSound(ctx) {
    ctx.setInstr('Tap the first sound.');
    rounds(ctx, pictureCards(), (pic, ok, again, i) => {
      const choices = [pic.answer].concat(likeIds(pic.answer, PACK.ids, i < 4 ? 1 : Math.max(2, PACK.ids.length - 1)));
      ctx.stage.append(
        h('img', { class: 'll1link', src: pic.src, alt: '' }),
        h('div', { class: 'll1friends' }, ...shuffle(choices).map((letter) => {
          const b = big(letter, (e) => { if (letter === pic.answer) ok(); else again(e.currentTarget); });
          b.setAttribute('data-yes', letter === pic.answer ? '1' : '0');
          return b;
        })));
    }, 'catch');
  }

  function hunt(ctx) {
    ctx.setInstr('Tap the letter you hear.');
    const spots = [[12, 18], [70, 14], [40, 42], [78, 58], [18, 66]];
    rounds(ctx, PACK.ids, (target, ok, again) => {
      say(PACK.say[target]);
      const others = choicesFor(target, 2).filter((ch) => ch !== target);
      const letters = [target, target].concat(others).slice(0, spots.length);
      let left = letters.filter((id) => id === target).length;
      const beach = h('div', { class: 'll1beach' });
      shuffle(letters).forEach((id, n) => {
        const spot = spots[n];
        beach.append(h('button', {
          class: 'll1hunt',
          type: 'button',
          'data-yes': id === target ? '1' : '0',
          style: 'left:' + spot[0] + '%;top:' + spot[1] + '%',
          onclick: (e) => {
            if (e.currentTarget.classList.contains('lit')) return;
            if (id !== target) { again(e.currentTarget); return; }
            e.currentTarget.classList.add('lit');
            left -= 1;
            say(PACK.say[target]);
            if (left > 0) return;
            ok();
          }
        }, id));
      });
      ctx.stage.append(beach);
    }, 'hunt');
  }

  function build(ctx) {
    ctx.setInstr('Tap the letters to make the word.');
    rounds(ctx, PACK.words, (word, ok, again) => {
      let at = 0;
      const built = h('p', { class: 'll1built' }, '');
      const extras = likeIds(word.parts[0], PACK.ids, 1);
      const tiles = shuffle(word.parts.concat(extras.filter((id) => word.parts.indexOf(id) < 0)));
      ctx.stage.append(built, h('div', { class: 'll1friends' }, ...tiles.map((id) => {
        const b = big(id, (e) => {
          const btn = e.currentTarget;
          if (btn.disabled) return;
          if (word.parts[at] !== id) { again(btn); return; }
          btn.disabled = true;
          btn.classList.add('lit');
          at += 1;
          built.textContent += id;
          say(PACK.say[id]);
          if (at < word.parts.length) return;
          ok();
        });
        return b;
      })));
    }, 'build');
  }

  function ears(ctx) {
    ctx.setInstr('Listen. Then tap the picture.');
    rounds(ctx, PACK.words, (word, ok, again, i) => {
      const choices = h('div', { class: 'll1friends' });
      ctx.stage.append(choices);
      const pics = [{ src: word.src, good: true }];
      const decoys = PACK.words.filter((item) => item.src !== word.src).slice(0, i < 4 ? 1 : 2);
      decoys.forEach((item) => pics.push({ src: item.src, good: false }));
      if (pics.length < 2) pics.push({ src: word.decoy || OBJ.apple, good: false });
      const pick = (src, good) => h('button', {
        class: 'll1friend', type: 'button', 'data-yes': good ? '1' : '0',
        onclick: (e) => { if (!good) { again(e.currentTarget); return; } ok(); }
      }, h('img', { src: src, alt: '' }));
      word.parts.reduce((p, id) => p.then(() => say(PACK.say[id])), Promise.resolve()).then(() => {
        shuffle(pics).forEach((item) => choices.append(pick(item.src, item.good)));
      });
    }, 'ears');
  }

  function flash(ctx) {
    ctx.setInstr('Say the sound. Tap I said it.');
    rounds(ctx, PACK.ids, (id, ok, again) => {
      ctx.stage.append(
        h('p', { class: 'll1flash' }, id),
        h('div', { class: 'll1pair' },
          h('button', { class: 'btn big primary', type: 'button', 'data-yes': '1', onclick: () => { say(PACK.say[id]); ok(); } }, 'I said it'),
          h('button', { class: 'btn big', type: 'button', onclick: () => again() }, 'Not yet')));
    }, 'flash');
  }

  function match(ctx) {
    ctx.setInstr('Tap the word for the picture.');
    rounds(ctx, PACK.words, (word, ok, again, i) => {
      const others = PACK.words.filter((item) => item.text !== word.text).slice(0, i < 6 ? 1 : 2);
      const choices = shuffle([{ text: word.text, good: true }].concat(others.map((item) => ({ text: item.text, good: false }))));
      ctx.stage.append(
        h('figure', { class: 'fs-scene ll1pic' },
          h('img', { src: word.src, alt: capWord(word.text) }),
          h('figcaption', null, capWord(word.text))),
        h('div', { class: 'll1friends' }, ...choices.map((choice) => {
          const b = big(choice.text, (e) => { if (choice.good) ok(); else again(e.currentTarget); });
          b.setAttribute('data-yes', choice.good ? '1' : '0');
          return b;
        })));
    }, 'match');
  }

  function soundMatch(ctx) {
    ctx.setInstr('Hear the sound. Tap the picture.');
    const list = pictureCards().map((pic) => ({ sound: pic.answer, src: pic.src }));
    rounds(ctx, list, (item, ok, again, i) => {
      say(PACK.say[item.sound]);
      const rest = pictureCards().filter((pic) => pic.src !== item.src);
      const decoys = rest.filter((pic) => likeIds(item.sound, PACK.ids, 3).indexOf(pic.answer) >= 0);
      const pool = (decoys.length ? decoys : rest).slice(0, i < 4 ? 1 : 2);
      const options = shuffle([{ src: item.src, good: true }].concat(pool.map((pic) => ({ src: pic.src, good: false }))));
      ctx.stage.append(h('div', { class: 'll1trio' }, ...options.map((opt) => h('button', {
        class: 'll1friend', type: 'button', 'data-yes': opt.good ? '1' : '0',
        onclick: (e) => { if (opt.good) ok(); else again(e.currentTarget); }
      }, h('img', { src: opt.src, alt: '' })))));
    }, 'sound');
  }

  function sortGame(ctx) {
    ctx.setInstr('Tap the first sound.');
    rounds(ctx, pictureCards(), (card, ok, again, i) => {
      const choices = [card.answer].concat(likeIds(card.answer, PACK.ids, i < 4 ? 1 : Math.max(2, PACK.ids.length - 1)));
      ctx.stage.append(
        h('img', { class: 'll1link', src: card.src, alt: '' }),
        h('div', { class: 'll1friends' }, ...shuffle(choices).map((letter) => {
          const b = big(letter, (e) => { if (letter === card.answer) ok(); else again(e.currentTarget); });
          b.setAttribute('data-yes', letter === card.answer ? '1' : '0');
          return b;
        })));
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
