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
    { id: 'ears', title: 'Blend and Pick', icon: 'foundation/img/games/ears.jpg' },
    { id: 'flash', title: 'Quick Flash', icon: 'foundation/img/games/flash.jpg' },
    { id: 'match', title: 'Read and Match', icon: 'foundation/img/games/match.jpg' },
    { id: 'sound', title: 'Sound Match', icon: 'foundation/img/games/sound.jpg' },
    { id: 'sort', title: 'Sort the Sound', icon: 'foundation/img/games/sort.jpg' },
    { id: 'count', title: 'Count the Sounds', icon: 'foundation/img/games/sound.jpg' }
  ];

  function bareSound(text) {
    const raw = String(text || '').trim().toLowerCase().replace(/[^a-z]/g, '');
    const alias = {
      mmm: 'm', em: 'm', sss: 's', ess: 's', tee: 't', ttt: 't', ay: 'a', ah: 'a',
      nnn: 'n', en: 'n', fff: 'f', eff: 'f', lll: 'l', rrr: 'r', vvv: 'v', zzz: 'z',
      pee: 'p', dee: 'd', kay: 'k', bee: 'b', eh: 'e', ih: 'i', uh: 'u', ee: 'ee', oh: 'oh'
    };
    if (alias[raw]) return alias[raw];
    if (raw.length === 1) return raw;
    if (/^(m{2,}|s{2,}|t{2,}|n{2,}|f{2,}|l{2,}|r{2,})$/.test(raw)) return raw.charAt(0);
    return '';
  }
  function say(text) {
    const key = bareSound(text);
    if (key) return playSound(key).then(() => {});
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    const spoken = words.filter((word) => !bareSound(word)).join(' ');
    if (!spoken) return Promise.resolve();
    return new Promise((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(spoken);
        u.lang = 'en-US';
        u.rate = 0.92;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch (e) { resolve(); }
    });
  }
  function playSound(key, el) {
    const played = IR.playPhoneme ? IR.playPhoneme(key) : Promise.resolve(false);
    return Promise.resolve(played).then((ok) => {
      if (ok === false && el && IR.soundSoon) IR.soundSoon(el, key);
      return ok;
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
    (IR._day1Waits || []).forEach((id) => clearTimeout(id));
    IR._day1Waits = [];
    if (IR._day1Wait) { clearTimeout(IR._day1Wait); IR._day1Wait = 0; }
  }
  function later(fn, ms) {
    const id = setTimeout(() => {
      IR._day1Waits = (IR._day1Waits || []).filter((item) => item !== id);
      fn();
    }, ms);
    IR._day1Waits = IR._day1Waits || [];
    IR._day1Waits.push(id);
    return id;
  }
  function go(id) { clearWait(); Snd.stop(); location.hash = '#/foundation/sample/' + id; }

  function shell(title, back, gameId) {
    const scr = IR.newScreen();
    const lesson = PACK && PACK.lesson;
    const isGame = GAMES.some((item) => item.id === gameId);
    const fill = h('i');
    const bar = h('div', { class: 'pbar ll1bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instr = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const topNav = IR.ui && IR.ui.pageNav
      ? IR.ui.pageNav(() => { clearWait(); location.hash = back; })
      : h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back', onclick: () => { clearWait(); Snd.stop(); location.hash = back; } }, icon('close'));
    const roundEl = h('p', { class: lesson ? 'llkidprog' : 'qcount llround', 'aria-live': 'polite' }, '');
    const header = !isGame && lesson
      ? h('header', { class: 'uA-top llbar' }, topNav, h('h1', { class: 'uA-title' }, title), roundEl)
      : h('header', { class: 'lesson-top ll1top' }, topNav, bar);
    let nextH = null;
    const nextBtn = h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next' }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, nextBtn);
    const screen = h('div', { class: (isGame ? 'screen lessonscreen u5step ll-day1' : (lesson ? 'screen fs-team ll-day1 ll-lessonplay' : 'screen lessonscreen u5step ll-day1')) },
      header,
      isGame ? null : roundEl,
      instr, stage,
      isGame ? nav : h('div', { class: 'll1foot' }, bar));
    const ctx = {
      scr: scr,
      stage: stage,
      mistakes: 0,
      roundTo(x, n) {
        if (roundEl) roundEl.textContent = 'Round ' + x + ' of ' + n;
        if (ctx.count) ctx.count(x, n);
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
        instr.append(h('button', {
          class: 'llnarr',
          type: 'button',
          'aria-label': 'Frill says: ' + text,
          onclick: () => say(text)
        }, h('img', { src: FRILL, alt: 'Frill' }), h('span', null, text)));
        say(text);
      },
      setNext(fn) { nextH = fn; },
      goNext() { clearWait(); Snd.stop(); if (nextH && nextH()) return; },
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
        const at = GAMES.findIndex((item) => item.id === again);
        const nxt = at >= 0 ? GAMES[at + 1] : null;
        const done = IR.engage.endScreen({
          title: label,
          stars: ctx.mistakes ? 2 : 3,
          backLabel: 'Games',
          nextLabel: nxt ? 'Next activity' : ((PACK && PACK.nextLabel) || (team ? 'Back to Team ' + team[1] : 'More games')),
          onBack: () => { location.hash = back; },
          onHome: () => { location.hash = '#/home'; },
          onNext: () => {
            if (nxt) {
              const app = document.querySelector('#app');
              app.innerHTML = '';
              if (team && IR.day1Play) IR.day1Play(app, nxt.id, PACK, back);
              else open('#/foundation/sample/' + nxt.id, app);
              return;
            }
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
    if (isGame) {
      nextBtn.addEventListener('click', () => ctx.goNext());
      const navApi = IR.simpleNav(nav, nextBtn, () => { clearWait(); Snd.stop(); location.hash = back; });
      const keep = navApi.label;
      navApi.label = function (t) {
        keep(t && String(t).trim() ? t : 'Next');
        nextBtn.hidden = false;
      };
      navApi.label('Next');
      if (IR.attachGameRules) IR.attachGameRules(ctx, screen, title);
      if (IR.engage) IR.engage.mount(ctx, screen);
      if (IR.teach) { IR.teach.mount(ctx, screen); IR.teach.sync(); }
    } else if (IR.engage) IR.engage.mount(ctx, screen);
    return ctx;
  }

  function kid(text) { return String(text == null ? '' : text).toLowerCase(); }
  function tag(el, n) {
    el.classList.add('llpick');
    if (n && IR.numBadge) el.prepend(IR.numBadge(n));
    return el;
  }
  function hearWord(word) {
    if (IR.playWord) return IR.playWord(word);
    return say(word);
  }
  function big(label, on, n) {
    return tag(h('button', { class: 'll1card', type: 'button', onclick: on }, h('b', null, kid(label))), n);
  }

  function team(ctx) {
    ctx.progress(0.05);
    ctx.setInstr('Tap the sound three times.');
    const need = { a: 0, m: 0 };
    const named = { a: false, m: false };
    function bump() {
      ctx.progress((need.a + need.m + (named.a ? 1 : 0) + (named.m ? 1 : 0)) / 8);
      if (named.a && named.m && need.a >= 3 && need.m >= 3) setTimeout(() => go('meet'), 400);
    }
    const one = (id, sound) => {
      named[id] = true;
      return h('div', { class: 'll1letter' },
      h('span', { class: 'll1name is-quiet' }, h('span', null, 'My name is: ' + id)),
      h('div', { class: 'll1sound' },
        h('p', null, 'My sound is ' + sound),
        h('div', { class: 'll1taps' }, ...[1, 2, 3].map(() => h('button', {
          class: 'll1tap', type: 'button',
          onclick: (e) => {
            if (e.currentTarget.classList.contains('lit')) return;
            e.currentTarget.classList.add('lit');
            need[id] += 1;
            playSound(id, e.currentTarget);
            yes();
            bump();
          }
        }, id)))));
    };
    ctx.stage.append(h('div', { class: 'll1pair' }, one('a', '/a/'), one('m', '/m/')));
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
      ctx.setInstr('Tap each sound.');
      const circles = [0, 1, 2].map(() => h('button', {
        class: 'll1circle', type: 'button',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          e.currentTarget.classList.add('lit');
          taps += 1;
          playSound(L.id, e.currentTarget);
          ctx.progress((i + taps / 3) / letters.length);
          if (taps < 3) return;
          yes();
          i += 1;
          setTimeout(show, 350);
        }
      }, L.id));
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'll1meet' },
        h('span', { class: 'll1name is-quiet' }, h('span', null, 'My name is: ' + L.id)),
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
      playSound(id);
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
    const rounds = n || ROUND_N;
    for (let i = 0; i < rounds; i++) {
      let item = list[i % list.length];
      if (out.length && item === out[out.length - 1] && list.length > 1) item = list[(i + 1) % list.length];
      out.push(item);
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
  /* 3 choices on the early rounds, 4 once the set is familiar. Never a blank or a placeholder. */
  function soundChoices(answer, total) {
    const want = total >= 4 ? 4 : 3;
    const ids = (PACK.ids || []).filter((id) => id && id !== answer);
    const out = [answer];
    likeIds(answer, (PACK.ids || []).concat(PACK.foils || []), want - 1).forEach((id) => {
      if (out.indexOf(id) < 0) out.push(id);
    });
    ids.forEach((id) => { if (out.length < want && out.indexOf(id) < 0) out.push(id); });
    (LIKE[answer] || '').split('').forEach((id) => {
      if (out.length < want && id && out.indexOf(id) < 0) out.push(id);
    });
    return out.slice(0, want);
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
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      draw(item, () => {
        streak += 1;
        const here = i;
        const move = () => {
          if (i !== here || !ctx.stage.isConnected) return;
          i += 1;
          yes();
          later(step, 200);
        };
        later(move, 280);
        later(move, 1200);
      }, (el) => {
        streak = 0;
        const correct = ctx.stage.querySelector('[data-yes="1"]');
        return IR.coachMiss({
          key: 'day1-' + id + '-' + i,
          wrongEl: el,
          correctEl: correct,
          statusEl: status,
          replay: ctx._coachReplay || null
        }).then((stepName) => { if (stepName === 'model') IR.againLater(plan, i); });
      }, i);
      ctx.stage.append(status);
    }
    if (ctx.setNext) ctx.setNext(() => {
      if (i < plan.length - 1) { i += 1; step(); return true; }
      ctx.badge(GAMES.filter((g) => g.id === id)[0].title, id);
      return true;
    });
    if (ctx.setBack) ctx.setBack(() => { if (i > 0) { i -= 1; step(); return true; } return false; });
    step();
  }

  function letterBag() {
    return PACK.ids.length > 2 ? PACK.ids.slice() : PACK.ids.concat(PACK.ids);
  }
  function pictureCards() {
    const by = {};
    const ids = [];
    (PACK.ids || []).forEach((id) => {
      ids.push(id);
      by[id] = [];
      (PACK.pics[id] || []).forEach((pic) => {
        if (pic && typeof pic === 'object') by[id].push({ src: pic.src, answer: id, name: pic.name || '' });
        else by[id].push({ src: pic, answer: id, name: '' });
      });
    });
    const out = [];
    const deep = Math.max.apply(null, ids.map((id) => by[id].length).concat([0]));
    for (let n = 0; n < deep; n++) {
      ids.forEach((id) => { if (by[id][n]) out.push(by[id][n]); });
    }
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
      const hear = h('button', { class: 'btn big primary', type: 'button', onclick: () => playSound(id, hear) }, 'Hear the sound');
      ctx._coachReplay = () => playSound(id, hear);
      playSound(id, hear);
      const shown = choicesFor(id, i < 4 ? 1 : i < 8 ? 2 : Math.max(2, ids.length - 1));
      const bubbles = shuffle(shown).map((letter, n) => tag(h('button', {
        class: 'll1bubble',
        type: 'button',
        'data-yes': letter === id ? '1' : '0',
        'aria-label': 'Choice ' + (n + 1) + ', ' + letter,
        onclick: (e) => {
          if (e.currentTarget.classList.contains('popped')) return;
          if (letter !== id) { again(e.currentTarget); return; }
          e.currentTarget.classList.add('popped');
          ok();
        }
      }, kid(letter)), n + 1));
      ctx.stage.append(
        h('div', { class: 'row center' }, hear),
        h('div', { class: 'll1bubbles' }, ...bubbles));
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
      ctx._coachReplay = () => playSound(id);
      playSound(id);
      const shown = [id].concat(likeIds(id, PACK.ids, i < 4 ? 1 : Math.max(2, PACK.ids.length - 1)));
      const friends = shuffle(shown).map((letter, n) => tag(h('button', {
        class: 'll1friend',
        type: 'button',
        'data-yes': letter === id ? '1' : '0',
        'aria-label': 'Choice ' + (n + 1) + ', ' + letter,
        onclick: (e) => { if (letter === id) ok(); else again(e.currentTarget); }
      }, h('img', { src: PACK.art[letter], alt: '' }), h('b', null, kid(letter))), n + 1));
      ctx.stage.append(h('div', { class: 'll1friends' }, ...friends));
    }, 'feed');
  }

  function catchSound(ctx) {
    ctx.setInstr('Hear the sound. Tap that letter.');
    rounds(ctx, pictureCards(), (pic, ok, again, i) => {
      const choices = soundChoices(pic.answer, i < 6 ? 3 : 4);
      const hear = () => playSound(pic.answer);
      ctx._coachReplay = hear;
      hear();
      ctx.stage.append(h('div', { class: 'llfirst llhear' },
        h('button', { class: 'btn big primary', type: 'button', onclick: hear }, 'Hear the word'),
        h('img', { class: 'll1link', src: pic.src, alt: '' }),
        h('div', { class: 'll1friends' }, ...shuffle(choices).map((letter, n) => {
          const b = big(letter, (e) => { if (letter === pic.answer) ok(); else again(e.currentTarget); }, n + 1);
          b.setAttribute('data-yes', letter === pic.answer ? '1' : '0');
          b.setAttribute('aria-label', 'Choice ' + (n + 1) + ', ' + letter);
          return b;
        }))));
    }, 'catch');
  }

  function hunt(ctx) {
    ctx.setInstr('Tap the letter you hear.');
    const spots = [[12, 18], [70, 14], [40, 42], [78, 58], [18, 66]];
    rounds(ctx, PACK.ids, (target, ok, again) => {
      ctx._coachReplay = () => playSound(target);
      playSound(target);
      const others = choicesFor(target, 2).filter((ch) => ch !== target);
      const letters = [target, target].concat(others).slice(0, spots.length);
      let left = letters.filter((id) => id === target).length;
      const beach = h('div', { class: 'll1beach' });
      shuffle(letters).forEach((id, n) => {
        const spot = spots[n];
        beach.append(tag(h('button', {
          class: 'll1hunt',
          type: 'button',
          'data-yes': id === target ? '1' : '0',
          'aria-label': 'Choice ' + (n + 1) + ', ' + id,
          style: 'left:' + spot[0] + '%;top:' + spot[1] + '%',
          onclick: (e) => {
            if (e.currentTarget.classList.contains('lit')) return;
            if (id !== target) { again(e.currentTarget); return; }
            e.currentTarget.classList.add('lit');
            left -= 1;
            playSound(target);
            if (left > 0) return;
            ok();
          }
        }, kid(id)), n + 1));
      });
      ctx.stage.append(beach);
    }, 'hunt');
  }

  function build(ctx) {
    ctx.setInstr('Tap the letters to make the word.');
    rounds(ctx, PACK.words, (word, ok, again) => {
      let at = 0;
      const slots = word.parts.map(() => h('span', { class: 'llbuildslot' }));
      const extras = likeIds(word.parts[0], PACK.ids, 1);
      const tiles = shuffle(word.parts.concat(extras.filter((id) => word.parts.indexOf(id) < 0)));
      const hear = () => hearWord(word.text);
      ctx._coachReplay = hear;
      hear();
      ctx.stage.append(h('div', { class: 'llbuild' },
        h('div', { class: 'llbuildslots' }, ...slots),
        h('button', { class: 'btn big primary', type: 'button', onclick: hear }, 'Hear the word'),
        h('div', { class: 'll1friends' }, ...tiles.map((id, n) => {
          const b = big(id, (e) => {
            const btn = e.currentTarget;
            if (btn.disabled) return;
            if (word.parts[at] !== id) { again(btn); return; }
            btn.disabled = true;
            btn.classList.add('lit');
            slots[at].textContent = id;
            slots[at].classList.add('filled');
            at += 1;
            playSound(id);
            if (at < word.parts.length) return;
            ok();
          }, n + 1);
          return b;
        }))));
    }, 'build');
  }

  function blendPick(ctx) {
    ctx.setInstr('Hear the sounds. Tap the picture.');
    let blendToken = 0;
    rounds(ctx, PACK.words, (word, ok, again) => {
      const speak = () => {
        const mine = ++blendToken;
        Snd.stop();
        return word.parts.reduce((p, id) => p.then(() => {
          if (mine !== blendToken) return undefined;
          return playSound(id).then(() => new Promise((r) => setTimeout(r, 180)));
        }), Promise.resolve());
      };
      ctx._coachReplay = speak;
      speak();
      const others = PACK.words.filter((item) => item.src !== word.src);
      const pics = [word].concat(others.slice(0, 2));
      while (pics.length < 3) pics.push(word);
      ctx.stage.append(h('div', { class: 'llfirst' },
        h('button', { class: 'btn big primary', type: 'button', onclick: speak }, 'Hear the sounds'),
        h('div', { class: 'll1friends' }, ...shuffle(pics).slice(0, 3).map((item, n) => {
          const good = item === word;
          return tag(h('button', {
            class: 'll1friend', type: 'button', 'data-yes': good ? '1' : '0',
            'aria-label': 'Choice ' + (n + 1),
            onclick: (e) => { if (good) ok(); else again(e.currentTarget); }
          }, h('img', { src: item.src, alt: '' })), n + 1);
        }))));
    }, 'ears');
  }

  function flash(ctx) {
    ctx.setInstr('Say the sound. Tap I said it.');
    rounds(ctx, PACK.ids, (id, ok, again) => {
      ctx._coachReplay = () => playSound(id);
      ctx.stage.append(
        h('p', { class: 'll1flash' }, id),
        h('div', { class: 'll1pair' },
          tag(h('button', { class: 'btn big primary', type: 'button', 'data-yes': '1', onclick: () => { playSound(id); ok(); } }, 'I said it'), 1),
          tag(h('button', { class: 'btn big', type: 'button', onclick: () => again() }, 'Not yet'), 2)));
    }, 'flash');
  }

  function match(ctx) {
    ctx.setInstr('Tap the word for the picture.');
    rounds(ctx, PACK.words, (word, ok, again, i) => {
      ctx._coachReplay = () => hearWord(word.text);
      const others = PACK.words.filter((item) => item.text !== word.text).slice(0, i < 6 ? 1 : 2);
      const choices = shuffle([{ text: word.text, good: true }].concat(others.map((item) => ({ text: item.text, good: false }))));
      ctx.stage.append(
        h('figure', { class: 'fs-scene ll1pic' },
          h('img', { src: word.src, alt: '' })),
        h('div', { class: 'll1friends' }, ...choices.map((choice, n) => {
          const b = big(choice.text, (e) => { if (choice.good) ok(); else again(e.currentTarget); }, n + 1);
          b.setAttribute('data-yes', choice.good ? '1' : '0');
          return b;
        })));
    }, 'match');
  }

  function soundMatch(ctx) {
    ctx.setInstr('Hear the sound. Tap its picture.');
    const cards = pictureCards().filter((pic) => pic && pic.src);
    rounds(ctx, cards, (item, ok, again, i) => {
      const hear = () => playSound(item.answer);
      ctx._coachReplay = hear;
      hear();
      const rest = shuffle(cards.filter((pic) => pic.src !== item.src && pic.answer !== item.answer));
      const decoys = rest.slice(0, i < 6 ? 2 : 3);
      const options = shuffle([item].concat(decoys));
      ctx.stage.append(h('div', { class: 'llfirst llhear lltapfit' },
        h('button', { class: 'btn big primary', type: 'button', onclick: hear }, 'Hear the sound'),
        h('div', { class: 'll1trio' }, ...options.map((opt, n) => tag(h('button', {
          class: 'll1friend', type: 'button', 'data-yes': opt.src === item.src ? '1' : '0',
          'aria-label': 'Choice ' + (n + 1),
          onclick: (e) => { if (opt.src === item.src) ok(); else again(e.currentTarget); }
        }, h('img', { src: opt.src, alt: '' })), n + 1)))));
    }, 'sound');
  }

  const PHONEME_KEY = { a: 'a', m: 'm', s: 's', t: 't', ee: 'ee', uh: 'u' };
  function countItems(words) {
    return words.map((word) => {
      const sounds = (window.IRPhonemes && IRPhonemes.of(word)) || [];
      return { w: word, sounds: sounds, n: sounds.length };
    }).filter((item) => item.n > 0);
  }
  function countList() {
    const ids = PACK.ids || [];
    const raw = (PACK.words || []).map((item) => String(item.text || '').toLowerCase());
    const extra = ['am', 'at'];
    const words = (raw.length ? raw : extra).concat(extra).filter((word, index, list) => {
      if (list.indexOf(word) !== index) return false;
      const parts = (window.IRPhonemes && IRPhonemes.of(word)) || String(word).split('');
      return parts.length > 0 && parts.every((part) => ids.indexOf(part) >= 0);
    });
    const letter = PACK && PACK.countLetter;
    const picked = letter ? words.filter((word) => word.charAt(0) === letter) : words;
    const use = (picked.length ? picked : words).slice(0, 8);
    return countItems(use.length ? use : ['am', 'at']);
  }
  function countSay(text, phoneme) {
    const key = phoneme ? (PHONEME_KEY[text] || '') : bareSound(text);
    if (key) return Promise.race([Promise.resolve(playSound(key)).catch(() => {}), new Promise((r) => setTimeout(r, 700))]);
    if (phoneme) return Promise.resolve();
    if (String(text || '').replace(/[^A-Za-z]/g, '').length < 2) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const fin = () => { if (done) return; done = true; resolve(); };
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        u.onend = fin;
        u.onerror = fin;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch (e) { fin(); return; }
      setTimeout(fin, Math.max(320, String(text).length * 80));
    });
  }
  function playRecordedWord(word) {
    return hearWord(word);
  }
  function countGame(ctx) {
    const items = countList();
    let i = 0;
    let token = 0;
    ctx.setInstr('How many sounds?');
    function show() {
      const roundToken = ++token;
      const item = items[i];
      if (!item) { ctx.badge('Count the Sounds', 'count'); return; }
      ctx.stage.innerHTML = '';
      if (ctx.roundTo) ctx.roundTo(i + 1, items.length);
      ctx.progress(i / items.length);
      const boxes = h('div', { class: 'llcountboxes' });
      for (let n = 0; n < 4; n++) boxes.append(h('i', { class: 'llcountbox' + (n < item.n ? ' wait' : '') }));
      const choices = h('div', { class: 'llcountchoices' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      let locked = false;
      [1, 2, 3, 4].forEach((n) => {
        const b = h('button', {
          class: 'llcountchoice',
          type: 'button',
          'data-yes': n === item.n ? '1' : '0',
          'aria-label': 'Choice ' + n + ', ' + n + ' sounds',
          onclick: async (e) => {
            if (locked || roundToken !== token) return;
            if (n === item.n) {
              locked = true;
              e.currentTarget.classList.add('lit');
              [...boxes.children].forEach((box, k) => box.classList.toggle('on', k < item.n));
              status.textContent = 'Yes.';
              ctx.progress((i + 1) / items.length);
              i += 1;
              setTimeout(() => { if (roundToken === token) show(); }, 500);
              return;
            }
            const stepName = await IR.coachMiss({
              key: 'count-' + i,
              wrongEl: e.currentTarget,
              correctEl: () => choices.querySelector('[data-yes="1"]'),
              statusEl: status,
              replay: () => playRecordedWord(item.w)
            });
            if (stepName === 'model') IR.againLater(items, i);
          }
        }, String(n));
        choices.append(b);
      });
      const hear = h('button', { class: 'btn big primary', type: 'button', onclick: () => playRecordedWord(item.w) }, 'Hear word again');
      ctx.stage.append(h('div', { class: 'llcountplay llcountfit' },
        h('p', { class: 'llcountask' }, 'How many sounds?'),
        h('button', { class: 'llcountword llcountbig', type: 'button', onclick: () => playRecordedWord(item.w) }, kid(item.w)),
        hear,
        boxes,
        choices,
        status));
      playRecordedWord(item.w);
    }
    ctx.setNext(() => {
      token += 1;
      if (i < items.length - 1) { i += 1; show(); return true; }
      ctx.badge('Count the Sounds', 'count');
      return true;
    });
    show();
  }

  function sortGame(ctx) {
    ctx.setInstr('Hear the sound. Tap its bucket.');
    rounds(ctx, pictureCards(), (card, ok, again, i) => {
      const choices = soundChoices(card.answer, i < 6 ? 3 : 4);
      const hear = () => playSound(card.answer);
      ctx._coachReplay = hear;
      hear();
      ctx.stage.append(h('div', { class: 'llsortfit' },
        h('button', { class: 'btn big primary', type: 'button', onclick: hear }, 'Hear the word'),
        h('img', { class: 'll1link', src: card.src, alt: '' }),
        h('div', { class: 'llbuckets' }, ...shuffle(choices).map((letter, n) => {
          const b = tag(h('button', {
            class: 'llbucket',
            type: 'button',
            'data-yes': letter === card.answer ? '1' : '0',
            'aria-label': 'Choice ' + (n + 1) + ', ' + letter,
            onclick: (e) => { if (letter === card.answer) ok(); else again(e.currentTarget); }
          }, h('b', null, kid(letter))), n + 1);
          return b;
        }))));
    }, 'sort');
  }

  const RUN = {
    team: team, meet: meet, link: link, done: lessonBadge, play: menu,
    pop: pop, feed: feed, catch: catchSound, hunt: hunt, build: build, ears: blendPick, flash: flash, match: match, sound: soundMatch, sort: sortGame, count: countGame
  };

  function day1Play(app, id, pack, back) {
    if (!RUN[id] || !GAMES.some((item) => item.id === id)) return false;
    clearWait();
    PACK = pack || samplePack();
    app.innerHTML = '';
    const step = GAMES.filter((item) => item.id === id)[0];
    const ctx = shell(step.title, back || '#/foundation/letters/g1', id);
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
    const ctx = shell(titles[id] || (step && step.title) || 'Day 1', back, id);
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
