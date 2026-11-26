/* Team 1 independent lesson sample. Auto-advancing, one screen.
   Frill narration is en-US-AriaNeural, rate -10%, pitch +0Hz. Zip never narrates.
   Isolated sounds are not computer-made. If audio/t1/pure_a.mp3 (and m, s, t)
   is missing, the sound stays on screen with a recording note.
   Pure recordings she still needs to make:
   audio/t1/pure_a.mp3  short /a/ as in apple. Not the letter name.
   audio/t1/pure_m.mp3  /m/ as in mangrove. Not the letter name.
   audio/t1/pure_s.mp3  /s/ as in sea snake. Not the letter name.
   audio/t1/pure_t.mp3  /t/ as in turtle. Not the letter name. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, Snd, icon } = IR;
  const FRILL = 'img/frill.webp';
  const ZIP = 'img/zipA.webp';

  const PURE = {
    a: { src: 'audio/t1/pure_a.mp3', note: 'Recording needed: pure /a/, as in apple' },
    m: { src: 'audio/t1/pure_m.mp3', note: 'Recording needed: pure /m/, as in mangrove' },
    s: { src: 'audio/t1/pure_s.mp3', note: 'Recording needed: pure /s/, as in sea snake' },
    t: { src: 'audio/t1/pure_t.mp3', note: 'Recording needed: pure /t/, as in turtle' }
  };
  const CLIP = {
    say: 'audio/t1/frill_say.mp3',
    nice: 'audio/t1/frill_nice.mp3',
    snap: 'audio/t1/frill_snap.mp3',
    find: 'audio/t1/frill_find.mp3',
    zip: 'audio/t1/frill_zip.mp3',
    review: 'audio/t1/frill_review.mp3',
    withme: 'audio/t1/frill_withme.mp3',
    am: 'audio/t1/frill_am.mp3',
    at: 'audio/t1/frill_at.mp3',
    sat: 'audio/t1/frill_sat.mp3',
    mat: 'audio/u51_w_mat.mp3'
  };
  const LETTERS = [
    {
      id: 'a', word: 'apple',
      art: 'foundation/img/letters/a_apple.jpg',
      mouth: 'foundation/img/mouths/mouth_a.jpg',
      thisClip: 'audio/t1/frill_this_a.mp3',
      saysClip: 'audio/t1/frill_says_a.mp3',
      wordClip: 'audio/t1/frill_apple.mp3',
      thinkClip: 'audio/t1/frill_think_a.mp3',
      lines: [
        { text: 'Ants add apples.', img: 'foundation/img/story/allit-a-ants.jpg', say: 'audio/t1/frill_allit_a1.mp3' },
        { text: 'Alligators act angry.', img: 'foundation/img/story/allit-a-alligators.jpg', say: 'audio/t1/frill_allit_a2.mp3' }
      ]
    },
    {
      id: 'm', word: 'mangrove',
      art: 'foundation/img/letters/m_manny_mangrove.jpg',
      mouth: 'foundation/img/mouths/mouth_m.jpg',
      thisClip: 'audio/t1/frill_this_m.mp3',
      saysClip: 'audio/t1/frill_says_m.mp3',
      wordClip: 'audio/t1/frill_mangrove.mp3',
      thinkClip: 'audio/t1/frill_think_m.mp3',
      lines: [
        { text: 'Moles make mighty mud mountains.', img: 'foundation/img/story/allit-m-moles.jpg', say: 'audio/t1/frill_allit_m1.mp3' },
        { text: 'Messy monkeys munch muffins.', img: 'foundation/img/story/allit-m-monkeys.jpg', say: 'audio/t1/frill_allit_m2.mp3' }
      ]
    },
    {
      id: 's', word: 'sea snake',
      art: 'foundation/img/letters/s_sami_sea_snake.jpg',
      mouth: 'foundation/img/mouths/mouth_s.jpg',
      thisClip: 'audio/t1/frill_this_s.mp3',
      saysClip: 'audio/t1/frill_says_s.mp3',
      wordClip: 'audio/t1/frill_seasnake.mp3',
      thinkClip: 'audio/t1/frill_think_s.mp3',
      lines: [
        { text: 'Snakes sell sandy socks.', img: 'foundation/img/story/allit-s-snakes.jpg', say: 'audio/t1/frill_allit_s1.mp3' },
        { text: 'Silly seals sip soup.', img: 'foundation/img/story/allit-s-seals.jpg', say: 'audio/t1/frill_allit_s2.mp3' }
      ]
    },
    {
      id: 't', word: 'turtle',
      art: 'foundation/img/letters/t_tama_sea_turtle.jpg',
      mouth: 'foundation/img/mouths/mouth_t.jpg',
      thisClip: 'audio/t1/frill_this_t.mp3',
      saysClip: 'audio/t1/frill_says_t.mp3',
      wordClip: 'audio/t1/frill_turtle.mp3',
      thinkClip: 'audio/t1/frill_think_t.mp3',
      lines: [
        { text: 'Tigers tap ten toes.', img: 'foundation/img/story/allit-t-tigers.jpg', say: 'audio/t1/frill_allit_t1.mp3' },
        { text: 'Tiny turtles tumble.', img: 'foundation/img/story/allit-t-turtles.jpg', say: 'audio/t1/frill_allit_t2.mp3' }
      ]
    }
  ];
  const BY = {};
  LETTERS.forEach((L) => { BY[L.id] = L; });

  const POPS = [
    { x: '12%', y: '8%', color: '#2B2540', rot: '-8deg', size: 'clamp(4.5rem, 18vh, 8rem)' },
    { x: '58%', y: '4%', color: '#E26500', rot: '7deg', size: 'clamp(5rem, 20vh, 9rem)' },
    { x: '28%', y: '36%', color: '#0E7C7C', rot: '-4deg', size: 'clamp(5.2rem, 22vh, 9.5rem)', outline: true },
    { x: '54%', y: '34%', color: '#C2408A', rot: '9deg', size: 'clamp(4.2rem, 16vh, 7.5rem)' },
    { x: '16%', y: '18%', color: '#2E9E6B', rot: '5deg', size: 'clamp(4.8rem, 19vh, 8.5rem)' },
    { x: '42%', y: '12%', color: '#5B3FA0', rot: '-6deg', size: 'clamp(5.4rem, 22vh, 10rem)' }
  ];

  const pureReady = {};
  LETTERS.forEach((L) => {
    pureReady[L.id] = fetch(PURE[L.id].src).then((res) => res.ok).catch(() => false);
  });

  let session = 0;
  let mine = 0;
  let timers = [];
  let clock = null;
  let index = 0;
  let holdFlag = false;
  let isPaused = false;
  let pauseBtn = null;
  let capHost = null;
  let stage = null;

  function clearTimers() {
    timers.forEach((id) => clearTimeout(id));
    timers = [];
  }
  function stopSession() {
    session += 1;
    clearTimers();
    clock = null;
    try { Snd.stop(); } catch (e) { /* quiet */ }
  }
  function say(src) {
    if (!src || session !== mine) return;
    Snd.play(src);
  }
  function playPure(id) {
    const token = mine;
    const ready = pureReady[id];
    if (!ready) return;
    ready.then((ok) => {
      if (ok && token === mine && token === session) Snd.play(PURE[id].src);
    });
  }
  function soundSlot(id) {
    const note = h('span', { class: 't1need' }, PURE[id].note);
    const box = h('span', { class: 't1sound' }, h('b', { class: 't1slash' }, '/' + id + '/'), note);
    pureReady[id].then((ok) => { if (ok && note.isConnected) note.remove(); });
    return box;
  }
  function spoken(before, id, after) {
    const note = h('span', { class: 't1need' }, PURE[id].note);
    pureReady[id].then((ok) => { if (ok && note.isConnected) note.remove(); });
    return h('div', { class: 't1spoken' },
      h('p', { class: 't1line' },
        h('img', { src: FRILL, alt: 'Frill' }),
        h('span', null, before + '/' + id + '/' + after)),
      note);
  }
  function frill(text) {
    const kids = [h('img', { src: FRILL, alt: 'Frill' })];
    if (text) kids.push(h('span', null, text));
    for (let i = 1; i < arguments.length; i++) {
      if (arguments[i]) kids.push(arguments[i]);
    }
    return h('p', { class: 't1line' }, ...kids);
  }
  function setCap(node) {
    capHost.replaceChildren(node || h('span'));
  }
  function micIcon() {
    return h('span', {
      class: 't1mic',
      html: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="24" y="6" width="16" height="28" rx="8" fill="#F28C00"/><path d="M16 28a16 16 0 0 0 32 0" fill="none" stroke="#C95A10" stroke-width="4"/><path d="M32 44v10M22 54h20" fill="none" stroke="#C95A10" stroke-width="4" stroke-linecap="round"/></svg>'
    });
  }
  function setPauseLabel() {
    if (!pauseBtn) return;
    pauseBtn.replaceChildren(icon(isPaused ? 'play' : 'pause'), h('span', null, isPaused ? 'Resume' : 'Pause'));
    pauseBtn.setAttribute('aria-label', isPaused ? 'Resume' : 'Pause');
    pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
  }

  function paintMeet(L, hold) {
    stage.append(h('b', { class: 't1giant' }, L.id));
    setCap(spoken('This is ' + L.id + '. ' + L.id + ' says ', L.id, ''));
    if (hold) return [];
    return [
      { at: 250, fn: () => say(L.thisClip) },
      { at: 2600, fn: () => say(L.saysClip) },
      { at: 4900, fn: () => playPure(L.id) },
      { at: 7000, fn: () => {} }
    ];
  }
  function paintWord(L, hold) {
    stage.append(h('div', { class: 't1split' },
      h('b', { class: 't1giant t1side' }, L.id),
      h('div', { class: 't1keycol' },
        h('b', { class: 't1keyword' }, L.word),
        h('img', { class: 't1pic', src: L.art, alt: L.word }),
        h('img', { class: 't1mouth', src: L.mouth, alt: 'Mouth for /' + L.id + '/' }))));
    setCap(spoken('', L.id, ', ' + L.word + '.'));
    if (hold) return [];
    return [
      { at: 300, fn: () => playPure(L.id) },
      { at: 1800, fn: () => say(L.wordClip) },
      { at: 7000, fn: () => {} }
    ];
  }
  function paintSilly(L, hold) {
    const line = L.lines[0];
    const pic = h('img', { class: 't1allit', src: line.img, alt: line.text });
    const sent = h('p', { class: 't1sent' }, line.text);
    const mic = micIcon();
    mic.hidden = !hold;
    stage.append(h('div', { class: 't1silly' }, pic, sent, mic));
    setCap(frill(hold ? 'Say it with me!' : line.text));
    function show(i) {
      const row = L.lines[i];
      pic.src = row.img;
      pic.alt = row.text;
      sent.textContent = row.text;
      setCap(frill(row.text));
    }
    if (hold) return [];
    return [
      { at: 200, fn: () => { show(0); say(L.lines[0].say); } },
      { at: 4000, fn: () => { show(1); say(L.lines[1].say); } },
      { at: 7800, fn: () => { mic.hidden = false; sent.textContent = L.lines[0].text + ' ' + L.lines[1].text; setCap(frill('Say it with me!')); say(CLIP.withme); } },
      { at: 12600, fn: () => {} }
    ];
  }
  function paintTurn(L, hold) {
    const mic = micIcon();
    stage.append(h('div', { class: 't1turn' }, h('b', { class: 't1giant t1turnlet' }, L.id), mic));
    setCap(spoken('Say ', L.id, '.'));
    if (hold) return [];
    return [
      { at: 200, fn: () => say(CLIP.say) },
      { at: 5000, fn: () => { mic.classList.add('is-done'); setCap(frill('Nice!')); say(CLIP.nice); } },
      { at: 7600, fn: () => {} }
    ];
  }
  function paintPop(L, hold) {
    const host = h('div', { class: 't1pops' });
    stage.append(host);
    function popAt(n) {
      host.replaceChildren();
      const from = Math.max(0, n - 2);
      for (let k = from; k <= n; k++) {
        const spec = POPS[k];
        const el = h('b', { class: 't1pop' + (k === n ? ' is-now' : ' is-old') + (spec.outline ? ' is-outline' : '') }, L.id);
        el.style.left = spec.x;
        el.style.top = spec.y;
        if (!spec.outline) el.style.color = spec.color;
        el.style.fontSize = spec.size;
        el.style.transform = 'rotate(' + spec.rot + ')';
        host.append(el);
      }
    }
    function closing() {
      setCap(spoken(L.id + ' says ', L.id, '. Think ' + L.word + '.'));
    }
    if (hold) {
      popAt(2);
      closing();
      return [];
    }
    popAt(0);
    setCap(spoken('', L.id, ''));
    const cues = POPS.map((spec, n) => ({ at: n * 1600, fn: () => { popAt(n); playPure(L.id); } }));
    cues.push({ at: 10200, fn: () => { closing(); say(L.saysClip); } });
    cues.push({ at: 12600, fn: () => playPure(L.id) });
    cues.push({ at: 14200, fn: () => say(L.thinkClip) });
    cues.push({ at: 16800, fn: () => {} });
    return cues;
  }
  function paintBlend(parts, word, audio, hold) {
    const row = h('div', { class: 't1blend' + (hold ? ' is-in' : '') });
    parts.forEach((ch, i) => {
      if (i) row.append(h('span', { class: 't1plus' }, '+'));
      row.append(h('b', { class: 't1piece' }, ch));
    });
    row.append(h('span', { class: 't1eq' }, '='));
    const made = h('b', { class: 't1made' + (hold ? '' : ' is-wait') }, word);
    row.append(made);
    stage.append(row);
    setCap(frill('Watch them snap.'));
    if (hold) return [];
    return [
      { at: 200, fn: () => say(CLIP.snap) },
      { at: 900, fn: () => { row.classList.add('is-in'); made.classList.remove('is-wait'); } },
      { at: 2800, fn: () => say(audio) },
      { at: 5600, fn: () => {} }
    ];
  }
  function paintFind(hold) {
    const rows = [
      { where: 'top', word: 'am' },
      { where: 'middle', word: 'mat' },
      { where: 'bottom', word: 'sat' }
    ];
    let shown = hold;
    const buttons = rows.map((row) => {
      const arrow = h('span', { class: 't1arrow', hidden: !(hold && row.word === 'mat') });
      const btn = h('button', {
        class: 't1row' + (hold && row.word === 'mat' ? ' is-on' : ''),
        type: 'button',
        'data-word': row.word
      }, h('span', { class: 't1where' }, row.where), h('b', null, row.word), arrow);
      btn.addEventListener('click', () => {
        if (shown) return;
        if (row.word === 'mat') reveal();
        else {
          btn.classList.remove('is-shake');
          void btn.offsetWidth;
          btn.classList.add('is-shake');
        }
      });
      return btn;
    });
    function reveal() {
      if (shown) return;
      shown = true;
      buttons.forEach((btn) => {
        const yes = btn.getAttribute('data-word') === 'mat';
        btn.classList.toggle('is-on', yes);
        const arrow = btn.querySelector('.t1arrow');
        if (arrow) arrow.hidden = !yes;
      });
    }
    stage.append(h('div', { class: 't1stack' }, ...buttons));
    setCap(frill('Top, middle, or bottom.'));
    if (hold) return [];
    return [
      { at: 300, fn: () => say(CLIP.find) },
      { at: 3600, fn: () => say(CLIP.mat) },
      { at: 6400, fn: reveal },
      { at: 8800, fn: () => {} }
    ];
  }
  function paintZip(hold) {
    const letter = h('b', { class: 't1giant t1ziplet' }, 'a');
    const mic = micIcon();
    stage.append(h('div', { class: 't1zip' },
      h('img', { class: 't1zippic', src: ZIP, alt: 'Zip' }),
      h('div', { class: 't1zipask' }, letter, mic)));
    function show(id) {
      letter.textContent = id;
      mic.classList.remove('is-done');
      setCap(spoken('Say ', id, '.'));
    }
    if (hold) {
      show('a');
      return [];
    }
    setCap(frill('Teach Zip. He does not know this sound yet.'));
    const cues = [{ at: 200, fn: () => say(CLIP.zip) }];
    let t = 5600;
    LETTERS.forEach((L) => {
      const at = t;
      cues.push({ at: at, fn: () => show(L.id) });
      cues.push({ at: at + 3200, fn: () => { mic.classList.add('is-done'); playPure(L.id); setCap(spoken('', L.id, '')); } });
      t += 4800;
    });
    cues.push({ at: t, fn: () => {} });
    return cues;
  }
  function paintReview(hold) {
    const cards = LETTERS.map((L, i) => h('div', { class: 't1rev' + (hold && i === 0 ? ' is-on' : ''), 'data-id': L.id },
      h('b', null, L.id),
      h('small', null, L.word),
      soundSlot(L.id)));
    stage.append(h('div', { class: 't1revs' }, ...cards));
    setCap(frill('Four sounds.'));
    if (hold) return [];
    const cues = [{ at: 200, fn: () => say(CLIP.review) }];
    LETTERS.forEach((L, i) => {
      cues.push({
        at: 2600 + i * 2200,
        fn: () => {
          cards.forEach((card, n) => card.classList.toggle('is-on', n === i));
          playPure(L.id);
        }
      });
    });
    cues.push({ at: 2600 + LETTERS.length * 2200, fn: () => {} });
    return cues;
  }

  function letterBeats(L) {
    return [
      { id: L.id + '-meet', run: (hold) => paintMeet(L, hold) },
      { id: L.id + '-word', run: (hold) => paintWord(L, hold) },
      { id: L.id + '-silly', run: (hold) => paintSilly(L, hold) },
      { id: L.id + '-turn', run: (hold) => paintTurn(L, hold) },
      { id: L.id + '-pop', run: (hold) => paintPop(L, hold) }
    ];
  }
  const BEATS = letterBeats(BY.a)
    .concat(letterBeats(BY.m))
    .concat([{ id: 'blend-am', run: (hold) => paintBlend(['a', 'm'], 'am', CLIP.am, hold) }])
    .concat(letterBeats(BY.s))
    .concat(letterBeats(BY.t))
    .concat([
      { id: 'blend-sat', run: (hold) => paintBlend(['s', 'a', 't'], 'sat', CLIP.sat, hold) },
      { id: 'find', run: (hold) => paintFind(hold) },
      { id: 'zip', run: (hold) => paintZip(hold) },
      { id: 'review', run: (hold) => paintReview(hold) },
      { id: 'read', run: () => [] }
    ]);

  function startBeat(i) {
    if (session !== mine) return;
    clearTimers();
    try { Snd.stop(); } catch (e) { /* quiet */ }
    index = i;
    const beat = BEATS[i];
    if (!beat) return;
    if (beat.id === 'read' && !holdFlag) {
      location.hash = '#/foundation/letters/g1/celebrate';
      return;
    }
    stage.replaceChildren();
    stage.dataset.beat = beat.id;
    const screen = stage.closest('.t1watch');
    if (screen) screen.dataset.beat = beat.id;
    const cues = beat.run(holdFlag) || [];
    if (holdFlag || !cues.length) {
      clock = null;
      isPaused = false;
      setPauseLabel();
      return;
    }
    let ci = 0;
    let elapsed = 0;
    let paused = false;
    let stamp = 0;
    let wait = 0;
    function arm() {
      if (session !== mine || paused) return;
      if (ci >= cues.length) {
        timers.push(setTimeout(() => {
          if (session !== mine || paused || holdFlag) return;
          startBeat(index + 1);
        }, 400));
        return;
      }
      wait = Math.max(0, cues[ci].at - elapsed);
      stamp = performance.now();
      timers.push(setTimeout(() => {
        if (session !== mine || paused) return;
        elapsed = cues[ci].at;
        const fn = cues[ci].fn;
        ci += 1;
        fn();
        arm();
      }, wait));
    }
    clock = {
      pause() {
        if (paused || session !== mine) return;
        elapsed += Math.min(wait, Math.max(0, performance.now() - stamp));
        paused = true;
        isPaused = true;
        clearTimers();
        if (Snd.el && !Snd.el.paused) Snd.el.pause();
        setPauseLabel();
      },
      resume() {
        if (!paused || session !== mine) return;
        paused = false;
        isPaused = false;
        setPauseLabel();
        if (Snd.el && Snd.el.src && Snd.el.paused && Snd.el.currentTime > 0 && !Snd.el.ended) {
          const pending = Snd.el.play();
          if (pending && pending.catch) pending.catch(() => {});
        }
        arm();
      }
    };
    isPaused = false;
    setPauseLabel();
    arm();
  }

  function team1Watch(app, beatId, flag) {
    IR.newScreen();
    stopSession();
    mine = session;
    holdFlag = flag === 'hold' || flag === 'phone';
    const screen = h('div', { class: 'screen t1watch' + (flag === 'phone' ? ' t1narrow' : ''), 'data-beat': beatId || 'a-meet' },
      h('header', { class: 'uA-top t1top' }, IR.ui.pageNav('#/foundation/letters/g1')),
      h('h1', { class: 't1title' }, 'Independent Lesson'));
    stage = h('main', { class: 't1stage' });
    capHost = h('div', { class: 't1cap', 'aria-live': 'polite' });
    pauseBtn = h('button', { class: 'btn big t1go', type: 'button' }, 'Pause');
    const replayBtn = h('button', { class: 'btn big t1go', type: 'button', 'aria-label': 'Replay' }, icon('replay'), h('span', null, 'Replay'));
    pauseBtn.addEventListener('click', () => {
      if (!clock) return;
      if (isPaused) clock.resume();
      else clock.pause();
    });
    replayBtn.addEventListener('click', () => {
      holdFlag = false;
      isPaused = false;
      startBeat(index);
    });
    screen.append(h('div', { class: 't1body' }, stage, capHost), h('div', { class: 't1controls' }, pauseBtn, replayBtn));
    app.append(screen);
    setPauseLabel();
    const onLeave = () => {
      const now = (location.hash || '').split('?')[0];
      if (/^#\/foundation\/letters\/g1\/watch/.test(now)) return;
      stopSession();
      window.removeEventListener('hashchange', onLeave);
    };
    window.addEventListener('hashchange', onLeave);
    let start = BEATS.findIndex((beat) => beat.id === beatId);
    if (start < 0) start = 0;
    startBeat(start);
  }
  IR.team1Watch = team1Watch;
  IR.team1WatchBeats = BEATS.map((beat) => beat.id);
})();
