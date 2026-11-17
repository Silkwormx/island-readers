/* Team 1 Day 1 student sample: letters a and m only. One activity per screen. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, icon, Snd, A, speakerBtn } = IR;
  const ZIP = 'img/zipA.webp';
  const FRILL = 'img/frill.webp';
  const STEPS = [
    { id: 'team', title: 'Meet the Team' },
    { id: 'ears', title: 'Ears Only' },
    { id: 'see', title: 'See and Say' },
    { id: 'find', title: 'Hear and Find' },
    { id: 'build', title: 'Build and Blend' },
    { id: 'meet', title: 'Meet the Letter' },
    { id: 'word', title: 'Word Work' },
    { id: 'heart', title: 'Heart Word' },
    { id: 'read', title: 'Read It' }
  ];
  const SAY = { a: 'ah', m: 'mmm', am: 'am', heart: 'uh' };

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
  function no() { return Snd.play(A.sfx.tryagain); }

  function shell(step, index) {
    const scr = IR.newScreen();
    const fill = h('i');
    const bar = h('div', { class: 'pbar ll1bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': STEPS.length, 'aria-valuenow': index }, fill);
    const instr = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const foot = h('div', { class: 'll1foot' }, bar);
    const screen = h('div', { class: 'screen lessonscreen u5step ll-day1' },
      h('header', { class: 'lesson-top ll1top' },
        h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the team', onclick: () => { Snd.stop(); location.hash = '#/foundation/letters/g1'; } }, icon('close')),
        h('h1', null, step.title),
        h('img', { class: 'll1face', src: ZIP, alt: 'Zip' }),
        h('img', { class: 'll1face', src: FRILL, alt: 'Frill' })),
      instr, stage, foot);
    const ctx = {
      scr: scr,
      stage: stage,
      mistakes: 0,
      miss() { ctx.mistakes += 1; },
      progress(f) {
        const v = Math.round(((index + Math.max(0, Math.min(1, f))) / STEPS.length) * 100);
        fill.style.width = v + '%';
        bar.setAttribute('aria-valuenow', String(index));
      },
      setInstr(text) {
        instr.innerHTML = '';
        if (!text) return;
        instr.append(speakerBtn(() => say(text), 'Hear the directions'), h('span', { class: 'itext' }, text));
        say(text);
      },
      next() {
        Snd.stop();
        const nx = STEPS[index + 1];
        location.hash = nx ? '#/foundation/sample/' + nx.id : '#/foundation/letters/g1';
      },
      finish() {
        ctx.progress(1);
        IR.touchStreak();
        IR.save();
        const done = IR.engage.endScreen({
          title: 'Look what I can read!',
          stars: ctx.mistakes <= 1 ? 3 : ctx.mistakes <= 3 ? 2 : 1,
          nextLabel: 'Back to the team',
          backLabel: 'Play Day 1 again',
          onBack: () => { location.hash = '#/foundation/sample'; },
          onNext: () => { location.hash = '#/foundation/letters/g1'; }
        });
        done.classList.add('ll1end');
        const line = h('p', { class: 'll1readline' }, 'am');
        done.querySelector('.cbox').insertBefore(line, done.querySelector('.row'));
        document.querySelector('#app').append(done);
        Snd.play(A.sfx.done);
      }
    };
    document.querySelector('#app').append(screen);
    if (IR.engage) IR.engage.mount(ctx, screen);
    ctx.progress(0);
    return ctx;
  }

  function card(label, on) {
    return h('button', { class: 'll1card', type: 'button', onclick: on }, h('b', null, label));
  }

  function meetTeam(ctx) {
    ctx.setInstr('Tap the name. Then tap the sound three times.');
    const need = { a: 0, m: 0 };
    const names = { a: false, m: false };
    function done() {
      return names.a && names.m && need.a >= 3 && need.m >= 3;
    }
    function bump() {
      ctx.progress((need.a + need.m + (names.a ? 1 : 0) + (names.m ? 1 : 0)) / 8);
      if (done()) setTimeout(() => ctx.next(), 400);
    }
    const letter = (id, sound) => {
      const taps = [1, 2, 3].map((n) => h('button', {
        class: 'll1tap',
        type: 'button',
        'aria-label': 'Say ' + sound + ', time ' + n,
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          e.currentTarget.classList.add('lit');
          need[id] += 1;
          say(sound);
          yes();
          bump();
        }
      }, id));
      return h('div', { class: 'll1letter' },
        h('button', {
          class: 'll1name',
          type: 'button',
          onclick: (e) => {
            e.currentTarget.classList.add('lit');
            names[id] = true;
            say(id === 'a' ? 'ay' : 'em');
            bump();
          }
        }, h('span', null, 'My name is: ' + id)),
        h('div', { class: 'll1sound' },
          h('p', null, 'My sound is ' + sound),
          h('div', { class: 'll1taps' }, ...taps)));
    };
    ctx.stage.append(h('div', { class: 'll1pair' }, letter('a', '/a/'), letter('m', '/m/')));
  }

  function ears(ctx) {
    let round = 0;
    function show() {
      ctx.stage.innerHTML = '';
      ctx.progress(round / 2);
      if (round === 0) {
        ctx.setInstr('Listen to the sounds. Tap the word.');
        say('ah').then(() => say('mmm'));
        ctx.stage.append(h('div', { class: 'll1pair' },
          card('am', () => { yes(); round = 1; show(); }),
          card('a', () => no())));
        return;
      }
      ctx.setInstr('Listen to the word. Tap each sound.');
      say('am');
      let at = 0;
      const order = ['a', 'm'];
      const taps = order.map((id, n) => h('button', {
        class: 'll1card',
        type: 'button',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          if (order[at] !== id) { no(); return; }
          e.currentTarget.classList.add('lit');
          at += 1;
          say(SAY[id]);
          if (at < order.length) return;
          yes();
          setTimeout(() => ctx.next(), 400);
        }
      }, h('b', null, id)));
      ctx.stage.append(h('div', { class: 'll1pair' }, ...taps));
    }
    show();
  }

  function see(ctx) {
    const ids = ['a', 'm'];
    let i = 0;
    function show() {
      ctx.progress(i / ids.length);
      if (i >= ids.length) { ctx.next(); return; }
      const id = ids[i];
      ctx.setInstr('Tap the letter. Say the sound.');
      ctx.stage.innerHTML = '';
      ctx.stage.append(card(id, () => {
        say(SAY[id]);
        yes();
        i += 1;
        setTimeout(show, 350);
      }));
    }
    show();
  }

  function find(ctx) {
    const rounds = ['a', 'm'];
    let i = 0;
    function show() {
      ctx.progress(i / rounds.length);
      if (i >= rounds.length) { ctx.next(); return; }
      const id = rounds[i];
      ctx.setInstr('Hear the sound. Tap the letter.');
      say(SAY[id]);
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'll1pair' }, ...['a', 'm'].map((choice) => card(choice, () => {
        if (choice !== id) { no(); return; }
        yes();
        i += 1;
        setTimeout(show, 350);
      }))));
    }
    show();
  }

  function build(ctx) {
    ctx.setInstr('Tap the letters to build am.');
    const order = ['a', 'm'];
    let at = 0;
    const built = h('p', { class: 'll1built' }, '');
    const tiles = h('div', { class: 'll1pair' }, ...['m', 'a'].map((id) => h('button', {
      class: 'll1card',
      type: 'button',
      onclick: (e) => {
        if (e.currentTarget.disabled) return;
        if (order[at] !== id) { no(); return; }
        e.currentTarget.disabled = true;
        e.currentTarget.classList.add('lit');
        at += 1;
        built.textContent += id;
        say(SAY[id]);
        if (at < order.length) return;
        yes();
        ctx.stage.append(h('img', { class: 'll1link', src: 'foundation/img/scenes/link_am.jpg', alt: 'a and m link arms to make am' }));
        setTimeout(() => { say('am'); setTimeout(() => ctx.next(), 700); }, 400);
      }
    }, h('b', null, id))));
    ctx.stage.append(built, tiles);
  }

  function meet(ctx) {
    const letters = [
      { id: 'a', sound: '/a/', say: 'ah' },
      { id: 'm', sound: '/m/', say: 'mmm' }
    ];
    let i = 0;
    function show() {
      ctx.progress(i / letters.length);
      if (i >= letters.length) { ctx.next(); return; }
      const L = letters[i];
      let taps = 0;
      ctx.setInstr('Tap the name. Then tap each sound.');
      const circles = [0, 1, 2].map(() => h('button', {
        class: 'll1circle',
        type: 'button',
        onclick: (e) => {
          if (e.currentTarget.classList.contains('lit')) return;
          e.currentTarget.classList.add('lit');
          taps += 1;
          say(L.say);
          if (taps < 3) return;
          yes();
          i += 1;
          setTimeout(show, 400);
        }
      }, L.id));
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'll1meet' },
        h('button', { class: 'll1name', type: 'button', onclick: () => say(L.id === 'a' ? 'ay' : 'em') }, h('span', null, 'My name is: ' + L.id)),
        h('div', { class: 'll1mouth' },
          h('span', { class: 'll1mouthico', 'aria-hidden': 'true' }, icon('speaker')),
          h('p', null, 'My sound is ' + L.sound),
          h('div', { class: 'll1taps' }, ...circles))));
    }
    show();
  }

  function word(ctx) {
    let part = 0;
    function show() {
      ctx.stage.innerHTML = '';
      ctx.progress(part / 2);
      if (part === 0) {
        ctx.setInstr('Tap a, then m. They link arms.');
        let at = 0;
        const built = h('p', { class: 'll1built' }, '');
        ctx.stage.append(built, h('div', { class: 'll1pair' }, ...['a', 'm'].map((id, n) => card(id, () => {
          if (n !== at) { no(); return; }
          at += 1;
          built.textContent += id;
          say(SAY[id]);
          if (at < 2) return;
          ctx.stage.append(h('img', { class: 'll1link', src: 'foundation/img/scenes/link_am.jpg', alt: 'a and m link arms to make am' }));
          yes();
          part = 1;
          setTimeout(show, 800);
        }))));
        return;
      }
      ctx.setInstr('Tap the word that matches the picture.');
      ctx.stage.append(
        h('figure', { class: 'fs-scene ll1pic' },
          h('img', { src: 'foundation/img/scenes/am.jpg', alt: 'Am.' }),
          h('figcaption', null, 'Am.')),
        h('div', { class: 'll1pair' },
          card('am', () => { yes(); setTimeout(() => ctx.next(), 400); }),
          card('a', () => no())));
    }
    show();
  }

  function heart(ctx) {
    ctx.setInstr('This word is a. Learn it by heart.');
    let n = 0;
    ctx.stage.append(h('button', {
      class: 'll1card ll1heart',
      type: 'button',
      onclick: (e) => {
        n += 1;
        e.currentTarget.classList.add('lit');
        say(SAY.heart);
        ctx.progress(n / 3);
        if (n < 3) return;
        yes();
        setTimeout(() => ctx.next(), 400);
      }
    }, h('b', null, 'a'), h('span', null, 'By heart')));
  }

  function read(ctx) {
    ctx.setInstr('Read am two times.');
    let n = 0;
    const word = h('button', {
      class: 'll1card ll1read',
      type: 'button',
      onclick: () => {
        n += 1;
        say('am');
        ctx.progress(n / 2);
        if (n < 2) return;
        yes();
        setTimeout(() => ctx.finish(), 500);
      }
    }, h('b', null, 'am'));
    ctx.stage.append(word);
  }

  const RUN = { team: meetTeam, ears: ears, see: see, find: find, build: build, meet: meet, word: word, heart: heart, read: read };

  function open(hash, app) {
    const m = /^#\/foundation\/sample(?:\/([a-z]+))?\/?$/.exec(hash || '');
    if (!m) return false;
    const id = m[1] || 'team';
    const index = STEPS.findIndex((step) => step.id === id);
    if (index < 0) return false;
    app.innerHTML = '';
    const ctx = shell(STEPS[index], index);
    RUN[id](ctx);
    if (IR.teach) IR.teach.sync();
    return true;
  }

  const prev = IR.foundationRoute;
  IR.foundationRoute = function (hash, app) {
    if (open(hash, app)) return true;
    return prev ? prev(hash, app) : false;
  };
  IR.day1Flow = { STEPS: STEPS };
})();
