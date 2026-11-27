/* Unit 1, short a: a sample guided trail. Other units stay on their own routes.
   Inside a stop the child only has Home and Repeat. The stop moves itself.
   Teacher mode (html.teach) also shows Back and Next.
   Every answer choice wears a number badge so a class can call the number. */
(function () {
  'use strict';
  const IR = window.IR;
  const PACK = window.IR_DATA_U123;
  if (!IR || !PACK) return;
  const { h, icon, shuffle, Snd } = IR;
  const SFX = IR.A.sfx;
  /* Flip to false when the kid build should hide Next. Activities still auto-advance. */
  const PREVIEW_NEXT = true;
  const READ_KEY = 'ir_u11_read';
  const PROG_KEY = 'ir_u11_prog';
  const SESS_KEY = 'ir_u11_trail';
  const SIT_KEY = 'ir_u11_sit';
  /* Research dosage. One place for the numbers. */
  const DOSE = {
    groupMin: 6,
    groupMax: 10,
    groupDefault: 8,
    heartMin: 3,
    heartMax: 5,
    heartMissedMax: 3,
    compMin: 2,
    compMax: 3,
    sittingMin: 4,
    sittingMax: 6,
    sittingDefault: 5,
    recapMin: 3,
    recapMax: 5,
    firstTryGem: 0.9,
    longerPerSitting: 1
  };
  const ACC_KEY = 'ir_u11_acc';
  const SEEN_KEY = 'ir_u11_seen';
  const LONG_KEY = 'ir_u11_long';
  const FOCUS = '#C95A10';
  const REC = { a: 1, m: 1, n: 1, p: 1, s: 1, t: 1 };
  let timer = 0;

  const SVG = {
    tree: '<svg viewBox="0 0 200 120" aria-hidden="true"><path d="M100 110 V48" stroke="#6b4a2e" stroke-width="8" stroke-linecap="round"/><path d="M100 78 C70 90 40 70 28 96 M100 70 C130 88 160 66 176 94 M100 60 C76 40 48 48 36 30 M100 56 C128 34 162 42 174 24" fill="none" stroke="#7d5a38" stroke-width="3"/><ellipse cx="100" cy="36" rx="46" ry="22" fill="#3f7d45"/><ellipse cx="78" cy="42" rx="28" ry="16" fill="#4e9454"/><ellipse cx="126" cy="40" rx="30" ry="16" fill="#2f6a3a"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>'
  };
  const PICS = {
    mat: { kind: 'img', src: 'foundation/img/story/single-mat.jpg', alt: 'A mat' },
    pan: { kind: 'img', src: 'foundation/img/story/single-pan.jpg', alt: 'A pan' },
    map: { kind: 'img', src: 'img/u11-map.jpg', alt: 'A map' },
    man: { kind: 'img', src: 'img/u11-man.jpg', alt: 'A man' },
    fan: { kind: 'img', src: 'img/u11-fan.jpg', alt: 'A fan' }
  };
  const POSE = {
    zip: 'img/zip-show/listen.webp',
    point: 'img/zip-show/point.webp',
    apple: 'img/zip-show/apple.webp',
    cheer: 'img/zip-show/cheer.webp',
    nap: 'img/zip-show/think.webp',
    tap: 'img/zip-show/drum.webp',
    surf: 'img/zip-show/surf.webp',
    bell: 'img/zip-show/bell.webp',
    frill: 'img/zip-show/frill-wave.webp',
    frillcheer: 'img/zip-show/frill-cheer.webp',
    both: 'img/zip-show/frill-highfive.webp'
  };

  const TWIST_LINES = ['Sam sat at a mat.', 'Pam sat at a pan.', 'A fat man sat at a fan.'];
  const CHANT_LINES = ['Mat. Map. Man.', 'Sat. Sap. Sam.', 'Tap. Tap. Pan.', 'Pam sat. Sam sat.'];
  const STOPS = [
    { id: 'listen', name: 'Listen', gem: 'img/gem_01_ruby.webp', gemName: 'ruby', beats: ['concept', 'hear', 'match', 'twist'] },
    { id: 'satchel', name: 'Pack the satchel', gem: 'img/gem_02_coral.webp', gemName: 'coral', beats: ['review', 'satchel', 'chant'], review: ['mat', 'sat', 'map'] },
    { id: 'words', name: 'Match', gem: 'img/gem_03_amber.webp', gemName: 'amber', beats: ['drag', 'fill', 'picsent'] },
    { id: 'book-map-pan', name: 'A Map at a Pan', gem: 'img/gem_04_topaz.webp', gemName: 'topaz', beats: ['book'], book: 'map-pan' },
    { id: 'raft', name: 'Build a raft', gem: 'img/gem_05_emerald.webp', gemName: 'emerald', beats: ['review', 'raft'], review: ['fan', 'mat', 'map', 'sat', 'tap'] },
    { id: 'read', name: 'Read', gem: 'img/gem_06_aquamarine.webp', gemName: 'aquamarine', beats: ['heart', 'yesno', 'comp'] },
    { id: 'book-fat-fan', name: 'A Fat Fan', gem: 'img/gem_07_sapphire.webp', gemName: 'sapphire', beats: ['book'], book: 'fat-fan' },
    { id: 'tree', name: 'Light the tree', gem: 'img/gem_08_amethyst.webp', gemName: 'amethyst', beats: ['review', 'tree'], review: ['tap', 'pat', 'mat', 'nap', 'man'] },
    { id: 'book-tap-map', name: 'Tap a Map', gem: 'img/gem_09_rosequartz.webp', gemName: 'rose quartz', beats: ['book'], book: 'tap-map' }
  ];

  const BOOKS = [
    {
      id: 'map-pan', title: 'A Map at a Pan', at: 2, pose: 'both',
      blurb: 'Sam sat at a map. A map sat at a pan.',
      pages: [
        { line: 'I am Sam.', pose: 'zip' },
        { line: 'Sam sat at a map.', pose: 'point', prop: 'map' },
        { line: 'Tap. Tap. Tap.', pose: 'tap', prop: 'map' },
        { line: 'A man sat.', pose: 'zip', prop: 'man' },
        { line: 'A fat man sat at a mat.', pose: 'zip', prop: 'mat' },
        { line: 'Pam sat at a pan.', pose: 'frill', prop: 'pan' },
        { line: 'A map sat at a pan.', pose: 'frill', prop: 'pan' },
        { line: 'Sam sat. Pam sat.', pose: 'both' },
        { line: 'I nap.', pose: 'nap' }
      ],
      ask: [
        { line: 'Sam sat at a map.', choices: ['Sam', 'Pam', 'man'], answer: 'Sam' },
        { line: 'A map sat at a pan.', choices: ['pan', 'mat', 'fan'], answer: 'pan' }
      ]
    },
    {
      id: 'fat-fan', title: 'A Fat Fan', at: 4, pose: 'frill',
      blurb: 'A fat fan sat at Sam.',
      pages: [
        { line: 'I am Pam.', pose: 'frill' },
        { line: 'A fan sat.', pose: 'frill', prop: 'fan' },
        { line: 'A fat fan sat.', pose: 'frill', prop: 'fan' },
        { line: 'Pam sat at a fan.', pose: 'frill', prop: 'fan' },
        { line: 'Pat. Pat. Pat.', pose: 'tap' },
        { line: 'Sam sat at a mat.', pose: 'zip', prop: 'mat' },
        { line: 'I fan Sam.', pose: 'both' },
        { line: 'A fat fan sat at Sam.', pose: 'frillcheer', prop: 'fan' },
        { line: 'Sam sat. A nap.', pose: 'nap' }
      ],
      ask: [
        { line: 'Pam sat at a fan.', choices: ['Pam', 'Sam', 'man'], answer: 'Pam' },
        { line: 'Sam sat at a mat.', choices: ['mat', 'pan', 'map'], answer: 'mat' }
      ]
    },
    {
      id: 'tap-map', title: 'Tap a Map', at: 5, pose: 'point',
      blurb: 'Pat sat at a map. A man sat at a tap.',
      pages: [
        { line: 'Pat sat at a map.', pose: 'point', prop: 'map' },
        { line: 'I tap a map.', pose: 'tap', prop: 'map' },
        { line: 'A sap. A map.', pose: 'zip', prop: 'map' },
        { line: 'Pam sat at a tap.', pose: 'frill' },
        { line: 'Tap. Map. Pat.', pose: 'tap' },
        { line: 'A man sat at a tap.', pose: 'zip', prop: 'man' },
        { line: 'Pat sat. Pam sat.', pose: 'both' },
        { line: 'I sat at a map.', pose: 'nap', prop: 'map' }
      ],
      ask: [
        { line: 'Pat sat at a map.', choices: ['Pat', 'Pam', 'Sam'], answer: 'Pat' },
        { line: 'A man sat at a tap.', choices: ['tap', 'mat', 'fan'], answer: 'tap' }
      ]
    }
  ];

  const BUILDS = {
    satchel: {
      title: 'Pack the satchel', scene: 'satchel', done: 'Packed.',
      steps: [
        { line: 'Tap map.', say: 'map', choices: ['map', 'man', 'nap'], answer: 'map', part: 'map' },
        { line: 'Pam sat at a', blank: true, say: 'Pam sat at a', choices: ['fan', 'pan', 'fat'], answer: 'fan', part: 'fan' },
        { line: 'Tap mat.', say: 'mat', choices: ['mat', 'map', 'man'], answer: 'mat', part: 'mat' }
      ]
    },
    raft: {
      title: 'Build a raft', scene: 'raft', done: 'The raft is set.',
      steps: [
        { line: 'A fat man sat at a', blank: true, say: 'A fat man sat at a', choices: ['mat', 'map', 'nap'], answer: 'mat', part: 'mat' },
        { line: 'Tap fan.', say: 'fan', choices: ['fan', 'fat', 'pan'], answer: 'fan', part: 'fan' },
        { line: 'Tap map.', say: 'map', choices: ['map', 'man', 'mat'], answer: 'map', part: 'map' }
      ]
    },
    tree: {
      title: 'Light the tree', scene: 'tree', done: 'Lit.',
      steps: [
        { line: 'Tap tap.', say: 'tap', choices: ['tap', 'tan', 'pat'], answer: 'tap', part: 'l1' },
        { line: 'Pat sat at a', blank: true, say: 'Pat sat at a', choices: ['mat', 'map', 'man'], answer: 'mat', part: 'l2' },
        { line: 'Tap pan.', say: 'pan', choices: ['pan', 'pat', 'nap'], answer: 'pan', part: 'l3' }
      ]
    }
  };

  function W(w) { return 'audio/w_' + String(w).toLowerCase().replace(/[^a-z]/g, '') + '.mp3'; }
  function sayText(text) {
    const files = String(text).split(/\s+/).filter(Boolean).map(W);
    return files.length ? Snd.seq(files, 200) : Promise.resolve(false);
  }
  function partsOf(word) {
    const letters = String(word).toLowerCase().replace(/[^a-z]/g, '').split('');
    const files = [];
    const missing = [];
    letters.forEach((ch) => {
      if (REC[ch]) files.push('audio/phonemes/' + ch + '.mp3');
      else missing.push(ch);
    });
    files.push(W(word));
    return { files: files, missing: missing };
  }
  function cueWord(word) {
    const bits = partsOf(word);
    return Snd.seq(bits.files, 160);
  }
  function wordNode(w) {
    const s = String(w);
    const box = h('span', { class: 'u11t-wd' });
    for (let i = 0; i < s.length; i++) {
      box.append(s[i].toLowerCase() === 'a' ? h('span', { class: 'a', style: 'color:' + FOCUS }, s[i]) : s[i]);
    }
    return box;
  }
  function picNode(id, cls) {
    const p = PICS[id];
    if (!p) return null;
  if (p.kind === 'img') return h('img', { class: cls || 'u11t-pic', src: p.src, alt: p.alt });
  return h('span', { class: 'u11t-svg' + (cls ? ' ' + cls : ''), html: p.svg });
  }
  function badge(n) { return IR.numBadge(n); }
  function demo() { return !!(IR.DEMO_UNLOCK_ALL); }
  function load() {
    let gems = [];
    let moveFrom = null;
    try { const g = JSON.parse(localStorage.getItem(PROG_KEY) || '[]'); if (Array.isArray(g)) gems = g; } catch (e) { /* ignore */ }
    try { const s = JSON.parse(sessionStorage.getItem(SESS_KEY) || '{}'); moveFrom = s.moveFrom; } catch (e) { /* ignore */ }
    return { gems: gems, moveFrom: moveFrom };
  }
  function save(st) {
    try { localStorage.setItem(PROG_KEY, JSON.stringify(st.gems || [])); } catch (e) { /* ignore */ }
    try { sessionStorage.setItem(SESS_KEY, JSON.stringify({ moveFrom: st.moveFrom == null ? null : st.moveFrom })); } catch (e) { /* ignore */ }
  }
  function sitting() {
    try { return parseInt(sessionStorage.getItem(SIT_KEY) || '0', 10) || 0; } catch (e) { return 0; }
  }
  function setSitting(n) {
    try { sessionStorage.setItem(SIT_KEY, String(n)); } catch (e) { /* ignore */ }
  }
  function longerCount() {
    try { return parseInt(sessionStorage.getItem(LONG_KEY) || '0', 10) || 0; } catch (e) { return 0; }
  }
  function reserveLonger() {
    const n = longerCount();
    if (n >= DOSE.longerPerSitting) return false;
    try { sessionStorage.setItem(LONG_KEY, String(n + 1)); } catch (e) { /* ignore */ }
    return true;
  }
  function afterStop() {
    const st = load();
    if (st.gems.length >= STOPS.length) { location.hash = '#/u1/u11/trail/end'; return; }
    if (sitting() >= DOSE.sittingDefault) { location.hash = '#/u1/u11/trail/bye'; return; }
    location.hash = '#/u1/u11';
  }
  function reads() {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || '') || {}; }
    catch (e) { return {}; }
  }
  function markRead(id) {
    const r = reads();
    r[id] = 1;
    try { localStorage.setItem(READ_KEY, JSON.stringify(r)); } catch (e) { /* ignore */ }
  }
  function markerIndex(gems) {
    for (let i = 0; i < STOPS.length; i++) if (gems.indexOf(i) < 0) return i;
    return STOPS.length;
  }
  function takeJump() {
    try {
      const raw = sessionStorage.getItem('ir_u11_jump');
      if (!raw) return null;
      sessionStorage.removeItem('ir_u11_jump');
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function teacherPlan() {
    return {
      slides: '#/teachers/slides/u11',
      days: [{ label: 'Day 1' }, { label: 'Day 2' }, { label: 'Day 3' }],
      files: [
        { title: 'Daily practice sheets', href: 'materials/unit1/Unit1_Teacher_Led_Student_Sheets.pdf' },
        { title: 'Independent worksheets', href: 'materials/unit1/Unit1_Independent_Worksheets.pdf' },
        { title: 'Teacher pack', href: 'materials/unit1/Lesson1.1_Teacher_Led_Checks.pdf' },
        { title: 'Word List', href: 'materials/unit1/Lesson1.1_WordList.pdf' }
      ]
    };
  }
  function recNote(missing) {
    if (!missing || !missing.length) return null;
    return h('p', { class: 'u11t-rec' }, 'Recording needed: ' + missing.map((ch) => '/' + ch + '/').join(', ') + '.');
  }

  function shell(app, o) {
    const scr = IR.newScreen();
    app.querySelectorAll(':scope > .screen.u11trail').forEach((el) => el.remove());
    clearTimeout(timer);
    let doNext = () => { if (o.onNext) o.onNext(); };
    let doBack = () => { if (o.onBack) o.onBack(); };
    let replay = () => {};
    const stage = h('div', { class: 'u11t-stage' });
    const countEl = h('p', { class: 'qcount' }, o.count || '');
    const unitBtn = h('button', {
      class: 'u11t-unit', type: 'button',
      'aria-label': o.unitLabel || 'Back to Unit'
    }, icon('back'), o.unitLabel || 'Back to Unit');
    const home = h('button', { class: 'u11t-home', type: 'button', 'aria-label': 'Home' }, icon('home'), 'Home');
    const back = h('button', { class: 'ir-btn ir-back', type: 'button', 'aria-label': 'Back' }, icon('back'), 'Back');
    const repeat = h('button', { class: 'ir-btn ir-repeat', type: 'button', 'aria-label': 'Repeat' }, icon('replay'), 'Repeat');
    const forward = h('button', { class: 'ir-btn ir-forward', type: 'button', 'aria-label': 'Next' }, 'Next', icon('next'));
    let screen = null;
    function go(dest) {
      if (o.confirm === false) { Snd.stop(); clearTimeout(timer); location.hash = dest; return; }
      if (!screen || screen.querySelector('.u11t-leave')) return;
      const box = h('div', { class: 'u11t-leave', role: 'dialog', 'aria-label': 'Leave this game?' },
        h('p', null, 'Leave this game?'),
        h('div', { class: 'u11t-leave-row' },
          h('button', { class: 'u11t-stay', type: 'button' }, 'Stay'),
          h('button', { class: 'u11t-go', type: 'button' }, 'Leave')));
      box.querySelector('.u11t-stay').addEventListener('click', () => box.remove());
      box.querySelector('.u11t-go').addEventListener('click', () => { Snd.stop(); clearTimeout(timer); location.hash = dest; });
      screen.append(box);
    }
    unitBtn.addEventListener('click', () => go(o.unitTo || '#/u1/u11'));
    home.addEventListener('click', () => go('#/home'));
    back.addEventListener('click', () => { Snd.stop(); clearTimeout(timer); doBack(); });
    forward.addEventListener('click', () => { Snd.stop(); clearTimeout(timer); doNext(); });
    repeat.addEventListener('click', () => { Snd.stop(); replay(); });
    const corner = o.corner || 'unit';
    const bar = h('div', { class: 'u11t-bar' + (corner === 'home' ? ' is-home' : ' is-unit') },
      corner === 'home' ? home : unitBtn);
    const top = h('div', { class: 'u11t-top' }, h('h2', { class: 'acttitle' }, o.title || ''));
    if (o.teach) top.append(h('div', { class: 'u11t-teach' }, IR.teacherBox(teacherPlan())));
    const showNext = PREVIEW_NEXT && o.preview !== false;
    screen = h('div', { class: 'screen u11trail' + (showNext ? ' u11t-preview' : ''), 'data-view': o.view || '' },
      bar, top, stage, countEl,
      h('div', { class: 'lesson-nav ir-controls u11t-nav' }, back, repeat, forward));
    app.append(screen);
    const ctx = {
      stage: stage,
      scr: scr,
      setNext(fn) { doNext = () => { clearTimeout(timer); if (fn) fn(); }; },
      finish() { doNext(); }
    };
    if (IR.teach) IR.teach.mount(ctx, screen);
    return {
      scr: scr,
      stage: stage,
      setCount(t) { countEl.textContent = t || ''; },
      setReplay(fn) { replay = fn || (() => {}); },
      setNext(fn) { ctx.setNext(() => { if (fn) fn(); return true; }); },
      setBack(fn) { doBack = () => { if (fn) fn(); }; },
      auto(ms, fn) {
        clearTimeout(timer);
        timer = setTimeout(() => { if (scr.ok()) fn(); }, ms);
      },
      arm(text) { if (ctx.armReveal) ctx.armReveal(text); }
    };
  }

  function trailWide() { return window.matchMedia('(min-width: 900px)').matches; }
  function pts() {
    if (!trailWide()) {
      return [
        { x: 34, y: 90 }, { x: 68, y: 80 }, { x: 32, y: 70 }, { x: 70, y: 60 }, { x: 30, y: 50 },
        { x: 68, y: 40 }, { x: 32, y: 30 }, { x: 66, y: 21 }, { x: 36, y: 13 }, { x: 64, y: 6 }
      ];
    }
    /* Horizontal W from 00a064b: across the banyan, gem at the lower left. */
    return [
      { x: 8, y: 74 }, { x: 17, y: 40 }, { x: 27, y: 76 }, { x: 37, y: 38 }, { x: 47, y: 78 },
      { x: 57, y: 36 }, { x: 67, y: 76 }, { x: 77, y: 38 }, { x: 87, y: 72 }, { x: 94, y: 32 }
    ];
  }
  function controlsFor(list) {
    const segs = [];
    const bowBase = 7;
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1];
      const b = list[i];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = bowBase * (i % 2 ? 1 : -1);
      segs.push({ a: a, b: b, c: { x: mx + (-dy / len) * bow, y: my + (dx / len) * bow * 0.45 } });
    }
    return segs;
  }
  function curve(list) {
    const segs = controlsFor(list);
    let d = 'M ' + list[0].x + ' ' + list[0].y;
    segs.forEach((s) => { d += ' Q ' + s.c.x + ' ' + s.c.y + ' ' + s.b.x + ' ' + s.b.y; });
    return d;
  }
  function quad(a, c, b, t) {
    const u = 1 - t;
    return {
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y
    };
  }
  function walkPair(marker, list, fromI, toI, scr) {
    const dest = list[toI];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function idleAt(p) {
      marker.classList.remove('is-walk');
      marker.classList.add('is-idle');
      marker.style.left = p.x + '%';
      marker.style.top = p.y + '%';
    }
    if (reduce || fromI === toI) { idleAt(dest); return; }
    const segs = controlsFor(list);
    const samples = [];
    const dir = toI > fromI ? 1 : -1;
    for (let i = fromI; i !== toI; i += dir) {
      const seg = segs[dir > 0 ? i : i - 1];
      const n = 28;
      for (let s = 0; s <= n; s++) {
        const t = dir > 0 ? s / n : 1 - s / n;
        samples.push(quad(seg.a, seg.c, seg.b, t));
      }
    }
    marker.classList.add('is-walk');
    const ms = 1800;
    const t0 = performance.now();
    function frame(now) {
      if (!scr.ok()) return;
      const u = Math.min(1, (now - t0) / ms);
      const eased = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const p = samples[Math.min(samples.length - 1, Math.round(eased * (samples.length - 1)))];
      marker.style.left = p.x + '%';
      marker.style.top = p.y + '%';
      if (u < 1) requestAnimationFrame(frame);
      else idleAt(dest);
    }
    requestAnimationFrame(frame);
  }

  function map(app) {
    const st = load();
    const here = markerIndex(st.gems);
    const list = pts();
    const view = shell(app, {
      title: 'Short a',
      view: 'map',
      corner: 'home',
      preview: false,
      confirm: false,
      teach: true,
      count: st.gems.length + ' of ' + STOPS.length,
      onNext() { if (here >= STOPS.length) location.hash = '#/u1/u11/trail/end'; else location.hash = '#/u1/u11/trail/' + here; },
      onBack() { location.hash = '#/u1'; }
    });
    view.setReplay(() => Snd.play('audio/phonemes/a.mp3'));
    const d = curve(list);
    const gems = h('div', { class: 'u11t-gembar', 'aria-label': st.gems.length + ' gems collected' });
    STOPS.forEach((stop, i) => {
      const got = st.gems.indexOf(i) >= 0;
      gems.append(h('span', { class: 'u11t-gemslot' + (got ? ' got' : '') }, got ? h('img', { src: stop.gem, alt: '' }) : null));
    });
    const board = h('div', { class: 'u11t-map' },
      h('div', { class: 'u11t-path', html:
        '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
        '<path d="' + d + '" fill="none" stroke="#4a2e16" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#f3d7a1" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#b67a3c" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="1.8 2.2"/>' +
        '</svg>' }));
    list.forEach((p, i) => {
      if (i >= STOPS.length) return;
      const stop = STOPS[i];
      const locked = i > here;
      const done = st.gems.indexOf(i) >= 0;
      const face = h('span', { class: 'u11t-stop-face' });
      if (done) face.append(h('img', { src: stop.gem, alt: '' }));
      else if (locked) face.append(h('span', { class: 'u11t-lock', html: SVG.lock }));
      else face.append(h('span', null, String(i + 1)));
      const btn = h('button', {
        class: 'u11t-stop' + (done ? ' is-done' : '') + (locked ? ' is-locked' : '') + (!locked && !done && i === here ? ' is-now' : ''),
        type: 'button',
        style: 'left:' + p.x + '%;top:' + p.y + '%',
        'aria-label': (locked ? 'Locked. ' : '') + stop.name + (locked && demo() ? '. Open in this sample.' : '')
      }, face);
      if (!locked || demo()) btn.addEventListener('click', () => {
        if (!done && sitting() >= DOSE.sittingDefault && !PREVIEW_NEXT) { location.hash = '#/u1/u11/trail/bye'; return; }
        if (!done && stop.book && longerCount() >= DOSE.longerPerSitting && !PREVIEW_NEXT) { location.hash = '#/u1/u11/trail/bye'; return; }
        location.hash = '#/u1/u11/trail/' + i;
      });
      else btn.disabled = true;
      board.append(btn);
    });
    const endP = list[STOPS.length];
    const endLocked = here < STOPS.length;
    const end = h('button', {
      class: 'u11t-end' + (endLocked ? ' is-locked' : ''),
      type: 'button',
      style: 'left:' + endP.x + '%;top:' + endP.y + '%',
      'aria-label': endLocked ? 'Bells. Locked until the gems are in.' : 'Bells'
    }, h('span', { class: 'u11t-stop-face' }, endLocked ? h('span', { class: 'u11t-lock', html: SVG.lock }) : h('img', { src: 'img/bell_lit.png', alt: '' })));
    if (!endLocked || demo()) end.addEventListener('click', () => { location.hash = '#/u1/u11/trail/end'; });
    else end.disabled = true;
    board.append(end);
    const toI = Math.min(here, list.length - 1);
    const fromI = st.moveFrom == null ? toI : Math.min(st.moveFrom, list.length - 1);
    if (st.moveFrom != null) { st.moveFrom = null; save(st); }
    const marker = h('div', {
      class: 'u11t-marker',
      style: 'left:' + list[fromI].x + '%;top:' + list[fromI].y + '%'
    }, h('span', { class: 'u11t-ground' }), h('img', { src: 'img/u11-zip-frill.png', alt: 'Zip and Frill' }));
    board.append(marker);
    view.stage.append(h('div', { class: 'u11t-mapwrap' }, gems, board));
    walkPair(marker, list, fromI, toI, view.scr);
    view.setReplay(() => Snd.play('audio/phonemes/a.mp3'));
  }

  function runStop(app, si, beat, startStep, warmed, stats) {
    const stop = STOPS[si];
    if (!stop) { map(app); return; }
    stats = stats || { firstOk: 0, firstN: 0, missed: [] };
    const jump = takeJump();
    if (jump && jump.stop === si) {
      if (jump.beat != null) beat = jump.beat;
      if (jump.step != null) startStep = jump.step;
    }
    if (beat >= stop.beats.length) { finishStop(app, si, stats); return; }
    const kind = stop.beats[beat];
    const ctx = {
      app: app,
      stop: stop,
      si: si,
      beat: beat,
      startStep: startStep || 0,
      stats: stats,
      next() {
        if (beat + 1 >= stop.beats.length) finishStop(app, si, stats);
        else runStop(app, si, beat + 1, 0, true, stats);
      },
      prev() { if (beat > 0) runStop(app, si, beat - 1, 0, true, stats); else map(app); }
    };
    (PLAY[kind] || map)(ctx);
  }

  function loadJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }
  function seenGame(id) { return !!loadJson(SEEN_KEY)[id]; }
  function markSeen(id) { const s = loadJson(SEEN_KEY); s[id] = 1; saveJson(SEEN_KEY, s); }
  function recentMissed() {
    const book = loadJson(ACC_KEY);
    const out = [];
    Object.keys(book).forEach((k) => (book[k].missed || []).forEach((w) => { if (out.indexOf(w) < 0) out.push(w); }));
    return out.slice(0, DOSE.heartMissedMax);
  }
  function finishStop(app, si, stats) {
    const book = loadJson(ACC_KEY);
    book[STOPS[si].id] = { firstOk: stats.firstOk, firstN: stats.firstN, missed: stats.missed.slice(), at: Date.now() };
    saveJson(ACC_KEY, book);
    const rate = stats.firstN ? stats.firstOk / stats.firstN : 1;
    if (rate < DOSE.firstTryGem && stats.missed.length) {
      const recap = [];
      while (recap.length < DOSE.recapMin) recap.push(stats.missed[recap.length % stats.missed.length]);
      runRecap(app, recap.slice(0, DOSE.recapMax), () => celebrate(app, si));
      return;
    }
    celebrate(app, si);
  }
  function runRecap(app, words, done) {
    const items = words.map((word) => ({
      word: word, answer: word,
      choices: shuffle([word].concat(shuffle(['mat', 'map', 'man', 'sat', 'pan', 'fan', 'tap'].filter((w) => w !== word)).slice(0, 2)))
    }));
    playRounds({ app: app, stats: null, next: done, prev: () => map(app) }, {
      title: 'One more look', view: 'recap', items: items, track: false,
      speak(item) { return sayText(item.word); },
      render(item, status, hit) {
        return h('div', { class: 'u11t-card' },
          h('p', { class: 'u11t-line' }, 'Tap the word.'),
          choiceRow(item.choices, (w, b) => hit(w === item.answer, b)),
          status);
      }
    });
  }

  function celebrate(app, si) {
    const stop = STOPS[si];
    const st = load();
    const before = markerIndex(st.gems);
    const fresh = st.gems.indexOf(si) < 0;
    if (fresh) {
      st.gems.push(si);
      setSitting(sitting() + 1);
    }
    st.moveFrom = before;
    save(st);
    const view = shell(app, {
      title: fresh ? 'Stop clear' : 'Already passed',
      view: 'gem',
      confirm: false,
      count: st.gems.length + ' of ' + STOPS.length,
      onNext() { afterStop(); },
      onBack() { afterStop(); }
    });
    const prize = fresh ? stop.gemName.charAt(0).toUpperCase() + stop.gemName.slice(1) + '.' : 'Gem safe.';
    view.stage.append(h('div', { class: 'u11t-celebrate' },
      h('div', { class: 'u11t-cast' },
        h('span', { class: 'u11t-ground' }),
        h('img', { src: 'img/u11-zip-frill-cheer.png', alt: 'Zip and Frill' })),
      h('img', { class: 'prize', src: stop.gem, alt: '' }),
      h('p', { class: 'u11t-line' }, prize)));
    Snd.seq([SFX.ding, SFX.done], 120);
    view.setReplay(() => Snd.seq([SFX.ding, SFX.done], 120));
    view.auto(2200, afterStop);
  }

  function goodbye(app) {
    const view = shell(app, {
      title: 'See you next time',
      view: 'bye',
      confirm: false,
      count: load().gems.length + ' of ' + STOPS.length,
      onNext() { location.hash = '#/u1/u11'; }
    });
    view.stage.append(h('div', { class: 'u11t-card' },
      h('div', { class: 'u11t-faces' },
        h('img', { src: POSE.cheer, alt: 'Zip' }),
        h('img', { src: POSE.frillcheer, alt: 'Frill' })),
      h('p', { class: 'u11t-line' }, 'Great job, see you next time.')));
    view.setReplay(() => Snd.play(SFX.done));
    Snd.play(SFX.done);
  }

  function warmUp(app, si, done) {
    const bank = ['mat', 'map', 'man', 'sat', 'pan', 'fan', 'tap', 'pat'];
    const sets = [
      ['mat'],
      ['mat', 'sat'],
      ['map', 'fan'],
      ['mat', 'pan'],
      ['fan', 'map'],
      ['sat', 'tap']
    ];
    const words = sets[si] || ['mat'];
    const items = words.map((word) => ({
      word: word,
      answer: word,
      choices: shuffle([word].concat(shuffle(bank.filter((w) => w !== word)).slice(0, 2)))
    }));
    playRounds({ app: app, next: done, prev: () => map(app) }, {
      title: 'Warm-up',
      view: 'warm',
      items: items,
      speak(item) { return sayText(item.word); },
      render(item, status, hit) {
        return h('div', { class: 'u11t-card' },
          h('p', { class: 'u11t-line' }, 'Tap the word.'),
          choiceRow(item.choices, (w, b) => hit(w === item.answer, b)),
          status);
      }
    });
  }

  function hintThen(view, word, pic, again) {
    view.stage.innerHTML = '';
    const bits = partsOf(word);
    view.stage.append(h('div', { class: 'u11t-card' },
      pic ? picNode(pic) : null,
      h('p', { class: 'u11t-letter', style: 'font-size:clamp(2.4rem,8vw,4rem)' }, wordNode(word)),
      h('p', { class: 'u11t-line' }, 'Listen.'),
      recNote(bits.missing)));
    view.setReplay(() => sayText(word));
    sayText(word);
    view.auto(1400, again);
  }

  function playRounds(ctx, o) {
    const view = shell(ctx.app, {
      title: o.title,
      view: o.view,
      count: '',
      home: '#/u1/u11',
      onNext() { ctx.next(); },
      onBack() { ctx.prev(); }
    });
    const queue = o.items.map((item) => Object.assign({ again: 0 }, item));
    let i = 0;
    let locked = false;
    function round() {
      if (!view.scr.ok()) return;
      if (i >= queue.length) { ctx.next(); return; }
      locked = false;
      const item = queue[i];
      if (o.game && i === 0 && !item.again && !seenGame(o.game)) {
        markSeen(o.game);
        item.guide = true;
        view.stage.innerHTML = '';
        view.setCount('Watch');
        view.stage.append(h('div', { class: 'u11t-card' },
          h('p', { class: 'u11t-line' }, o.demo || 'Watch.'),
          h('p', { class: 'u11t-letter', style: 'font-size:clamp(2.4rem,8vw,4rem)' }, wordNode(item.answer || item.word))));
        sayText(item.answer || item.word);
        view.auto(1400, () => { if (view.scr.ok()) round(); });
        return;
      }
      view.setCount((i + 1) + ' of ' + queue.length);
      view.stage.innerHTML = '';
      view.arm(item.answer || item.word);
      const goOn = () => {
        if (!view.scr.ok()) return;
        i++;
        if (i >= queue.length) ctx.next();
        else round();
      };
      view.setNext(goOn);
      view.setBack(() => { if (i > 0) { i--; round(); } else ctx.prev(); });
      const status = h('p', { class: 'u11t-status' }, '\u00a0');
      const body = o.render(item, status, function hit(ok, btn) {
        if (locked) return;
        const ans = item.answer || item.word;
        if (!ok) {
          locked = true;
          if (!item.touched && ctx.stats && !item.again) {
            item.touched = true;
            item.wasWrong = true;
            ctx.stats.firstN++;
            if (ctx.stats.missed.indexOf(ans) < 0) ctx.stats.missed.push(ans);
          }
          const rightBtn = view.stage.querySelector('[data-w="' + ans + '"]');
          if (rightBtn) rightBtn.classList.add('right');
          status.textContent = ans;
          const release = () => { if (view.scr.ok()) { locked = false; status.textContent = 'Tap ' + ans; } };
          view.setReplay(() => cueWord(ans));
          cueWord(ans).then(release);
          return;
        }
        if (!item.touched && ctx.stats && !item.again) {
          item.touched = true;
          ctx.stats.firstN++;
          ctx.stats.firstOk++;
        }
        locked = true;
        if (btn) btn.classList.add('right');
        status.textContent = 'Yes. ' + ans;
        if (item.wasWrong && !item.again) {
          queue.splice(Math.min(queue.length, i + 3), 0, { word: item.word, answer: ans, line: item.line, before: item.before, after: item.after, pic: item.pic, choices: item.choices, say: item.say, yes: item.yes, again: 1 });
        }
        let moved = false;
        const go = () => { if (moved || !view.scr.ok()) return; moved = true; goOn(); };
        view.setNext(go);
        sayText(item.say || ans).then(() => { if (!moved && view.scr.ok()) view.auto(450, go); });
      });
      view.stage.append(body);
      if (item.guide) {
        const ans = item.answer || item.word;
        const rightBtn = view.stage.querySelector('[data-w="' + ans + '"]');
        if (rightBtn) rightBtn.classList.add('right');
        const st = view.stage.querySelector('.u11t-status');
        if (st) st.textContent = 'Tap ' + ans;
      }
      const spoken = o.speak ? o.speak(item) : sayText(item.say || item.word || item.line || '');
      view.setReplay(() => { if (o.speak) o.speak(item); else sayText(item.say || item.word || item.line || ''); });
      spoken;
    }
    round();
    return view;
  }

  function choiceRow(words, onPick) {
    const row = h('div', { class: 'u11t-choices' });
    words.forEach((w, n) => {
      const b = h('button', {
        class: 'u11t-choice', type: 'button', 'data-n': String(n + 1), 'data-w': w,
        'aria-label': (n + 1) + '. ' + w
      }, badge(n + 1), wordNode(w));
      b.addEventListener('click', () => onPick(w, b, n + 1));
      row.append(b);
    });
    return row;
  }

  const PLAY = {
    concept(ctx) {
      const view = shell(ctx.app, {
        title: 'Short a', view: 'concept', count: '',
        home: '#/u1/u11',
        onNext() { ctx.next(); },
        onBack() { ctx.prev(); }
      });
      view.stage.append(h('div', { class: 'u11t-card' },
        h('img', { class: 'u11t-pose', src: POSE.apple, alt: 'Zip holds an apple' }),
        h('div', { class: 'u11t-letter' }, 'a'),
        h('p', { class: 'u11t-line' }, 'The a says /a/.'),
        h('p', { class: 'u11t-line' }, 'Open wide.'),
        h('p', { class: 'u11t-rec' }, 'Recording needed: the spoken line. The sound /a/ is ready.')));
      const play = () => Snd.play('audio/phonemes/a.mp3');
      view.setReplay(play);
      play();
      view.auto(1800, () => ctx.next());
    },
    hear(ctx) {
      const items = [
        { word: 'mat', choices: shuffle(['mat', 'map', 'man']) },
        { word: 'sat', choices: shuffle(['sat', 'pat', 'sap']) },
        { word: 'pan', choices: shuffle(['pan', 'pat', 'nap']) },
        { word: 'map', choices: shuffle(['map', 'man', 'mat']) }
      ].slice(0, 3);
      playRounds(ctx, {
        title: 'Hear and Pick', view: 'hear', game: 'hear', demo: 'Watch. Tap the word you hear.', items: items,
        speak(item) { return sayText(item.word); },
        render(item, status, hit) {
          const row = choiceRow(item.choices, (w, b) => hit(w === item.word, b));
          const spk = h('button', { class: 'u11t-spk', type: 'button', 'aria-label': 'Hear the word' }, icon('speaker'));
          spk.addEventListener('click', () => sayText(item.word));
          return h('div', { class: 'u11t-card' }, spk, row, status);
        }
      });
    },
    match(ctx) {
      const items = [
        { word: 'mat', pic: 'mat', choices: shuffle(['mat', 'map', 'man']) },
        { word: 'fan', pic: 'fan', choices: shuffle(['fan', 'fat', 'pan']) },
        { word: 'man', pic: 'man', choices: shuffle(['man', 'map', 'mat']) },
        { word: 'pan', pic: 'pan', choices: shuffle(['pan', 'pat', 'nap']) }
      ].slice(0, 3);
      playRounds(ctx, {
        title: 'Match the picture', view: 'match', game: 'match', demo: 'Watch. Tap the word for the picture.', items: items,
        speak(item) { return sayText(item.word); },
        render(item, status, hit) {
          const row = choiceRow(item.choices, (w, b) => hit(w === item.word, b));
          return h('div', { class: 'u11t-card' }, picNode(item.pic), row, status);
        }
      });
    },
    review(ctx) {
      const words = ctx.stop.review || ['mat', 'sat'];
      const bank = ['mat', 'map', 'man', 'sat', 'pan', 'fan', 'tap', 'pat', 'nap'];
      const items = words.map((word) => ({
        word: word, answer: word,
        choices: shuffle([word].concat(shuffle(bank.filter((w) => w !== word)).slice(0, 2)))
      }));
      playRounds(ctx, {
        title: 'Warm-up', view: 'review', items: items,
        speak(item) { return sayText(item.word); },
        render(item, status, hit) {
          return h('div', { class: 'u11t-card' },
            h('p', { class: 'u11t-line' }, 'Tap the word.'),
            choiceRow(item.choices, (w, b) => hit(w === item.answer, b)),
            status);
        }
      });
    },
    heart(ctx) {
      const base = [
        { word: 'I', answer: 'I', choices: shuffle(['I', 'a', 'am']) },
        { word: 'a', answer: 'a', choices: shuffle(['a', 'I', 'at']) },
        { word: 'I', answer: 'I', choices: shuffle(['I', 'am', 'a']) },
        { word: 'a', answer: 'a', choices: shuffle(['a', 'at', 'an']) }
      ].slice(0, DOSE.heartMax);
      while (base.length < DOSE.heartMin) base.push({ word: 'a', answer: 'a', choices: shuffle(['a', 'I', 'at']) });
      const extra = recentMissed().slice(0, Math.min(DOSE.heartMissedMax, DOSE.groupMax - (base.length + DOSE.compMin + 2)));
      const bank = ['mat', 'map', 'man', 'sat', 'pan', 'fan', 'tap'];
      extra.forEach((word) => base.push({
        word: word, answer: word,
        choices: shuffle([word].concat(shuffle(bank.filter((w) => w !== word)).slice(0, 2)))
      }));
      playRounds(ctx, {
        title: 'Heart words', view: 'heart', items: base,
        speak(item) { return sayText(item.word); },
        render(item, status, hit) {
          return h('div', { class: 'u11t-card' },
            h('p', { class: 'u11t-line' }, 'Tap the word.'),
            choiceRow(item.choices, (w, b) => hit(w === item.answer, b)),
            status);
        }
      });
    },
    fill(ctx) {
      const items = [
        { line: 'Sam sat at a map.', answer: 'sat', before: 'Sam', after: 'at a map.', choices: shuffle(['sat', 'pan', 'fan']) },
        { line: 'A man sat at a mat.', answer: 'mat', before: 'A man sat at a', after: '.', choices: shuffle(['mat', 'map', 'nap']) }
      ];
      playRounds(ctx, {
        title: 'Fill the blank', view: 'fill', game: 'fill', demo: 'Watch. Tap the missing word.', items: items,
        speak(item) { return sayText(item.before + ' ' + item.after); },
        render(item, status, hit) {
          const row = choiceRow(item.choices, (w, b) => hit(w === item.answer, b));
          return h('div', { class: 'u11t-card' },
            h('p', { class: 'u11t-sent' }, wordNode(item.before), h('span', { class: 'u11t-blank' }, '\u00a0'), wordNode(item.after)),
            row, status);
        }
      });
    },
    picsent(ctx) {
      const items = [
        { line: 'A fat man sat at a mat.', answer: 'mat', pic: 'mat', before: 'A fat man sat at a', after: '.', choices: shuffle(['mat', 'pan', 'fan']) },
        { line: 'Pam sat at a pan.', answer: 'pan', pic: 'pan', before: 'Pam sat at a', after: '.', choices: shuffle(['pan', 'map', 'nap']) }
      ];
      playRounds(ctx, {
        title: 'Picture sentence', view: 'picsent', items: items,
        speak(item) { return sayText(item.before); },
        render(item, status, hit) {
          const row = choiceRow(item.choices, (w, b) => hit(w === item.answer, b));
          return h('div', { class: 'u11t-card' }, picNode(item.pic),
            h('p', { class: 'u11t-sent' }, wordNode(item.before), h('span', { class: 'u11t-blank' }, '\u00a0'), wordNode(item.after)),
            row, status);
        }
      });
    },
    yesno(ctx) {
      const items = [
        { word: 'sat', yes: true, answer: 'Yes' },
        { word: 'man', yes: false, answer: 'No' }
      ];
      const view = shell(ctx.app, {
        title: 'Yes or No', view: 'yesno', count: '',
        home: '#/u1/u11',
        onNext() { ctx.next(); },
        onBack() { ctx.prev(); }
      });
      const queue = items.map((item) => Object.assign({ again: 0 }, item));
      let i = 0;
      let locked = false;
      function round() {
        if (i >= queue.length) { ctx.next(); return; }
        locked = false;
        const item = queue[i];
        view.setCount((i + 1) + ' of ' + queue.length);
        view.stage.innerHTML = '';
        view.arm(item.answer);
        const goOn = () => { i++; if (i >= queue.length) ctx.next(); else round(); };
        view.setNext(goOn);
        view.setBack(() => { if (i > 0) { i--; round(); } else ctx.prev(); });
        const status = h('p', { class: 'u11t-status' }, '\u00a0');
        function pick(yes, btn, yesBtn, noBtn) {
          if (locked) return;
          const ok = yes === item.yes;
          if (!ok) {
            locked = true;
            if (!item.touched && ctx.stats && !item.again) {
              item.touched = true;
              item.wasWrong = true;
              ctx.stats.firstN++;
              if (ctx.stats.missed.indexOf(item.word) < 0) ctx.stats.missed.push(item.word);
            }
            (item.yes ? yesBtn : noBtn).classList.add('right');
            status.textContent = (item.yes ? 'Yes. ' : 'No. ') + item.word;
            cueWord(item.word).then(() => { if (view.scr.ok()) { locked = false; status.textContent = 'Tap ' + (item.yes ? 'Yes' : 'No'); } });
            return;
          }
          if (!item.touched && ctx.stats && !item.again) {
            item.touched = true;
            ctx.stats.firstN++;
            ctx.stats.firstOk++;
          }
          locked = true;
          status.textContent = 'Yes. ' + item.word;
          if (item.wasWrong && !item.again) {
            queue.splice(Math.min(queue.length, i + 3), 0, { word: item.word, yes: item.yes, answer: item.answer, again: 1 });
          }
          let moved = false;
          const go = () => { if (moved || !view.scr.ok()) return; moved = true; goOn(); };
          view.setNext(go);
          sayText(item.word).then(() => { if (!moved && view.scr.ok()) view.auto(500, go); });
        }
        const yes = h('button', { class: 'u11t-yes', type: 'button', 'data-n': '1', 'aria-label': '1. Yes' }, badge(1), 'Yes');
        const no = h('button', { class: 'u11t-no', type: 'button', 'data-n': '2', 'aria-label': '2. No' }, badge(2), 'No');
        yes.addEventListener('click', () => pick(true, yes, yes, no));
        no.addEventListener('click', () => pick(false, no, yes, no));
        view.stage.append(h('div', { class: 'u11t-card' },
          h('p', { class: 'u11t-line' }, wordNode('mat')),
          h('p', { class: 'u11t-letter', style: 'font-size:clamp(2.2rem,8vw,3.4rem)' }, wordNode(item.word)),
          h('div', { class: 'u11t-yn' }, yes, no),
          status));
        view.setReplay(() => sayText('mat ' + item.word));
        sayText('mat ' + item.word);
      }
      round();
    },
    comp(ctx) {
      const items = [
        { line: 'A fat man sat at a mat.', choices: shuffle(['man', 'Pam', 'Sam']), answer: 'man' },
        { line: 'Pam sat at a pan.', choices: shuffle(['pan', 'map', 'fan']), answer: 'pan' }
      ];
      playRounds(ctx, {
        title: 'Tap the match', view: 'comp', items: items,
        speak(item) { return sayText(item.line); },
        render(item, status, hit) {
          const row = choiceRow(item.choices, (w, b) => hit(w === item.answer, b));
          return h('div', { class: 'u11t-card' }, h('p', { class: 'u11t-line' }, wordNode(item.line)), row, status);
        }
      });
    },
    drag(ctx) { dragGame(ctx); },
    satchel(ctx) { buildGame(ctx, BUILDS.satchel); },
    raft(ctx) { buildGame(ctx, BUILDS.raft); },
    tree(ctx) { buildGame(ctx, BUILDS.tree); },
    twist(ctx) {
      runLines(ctx.app, {
        title: 'Tongue twister', view: 'twist', pose: POSE.frill, ms: 2400, lines: TWIST_LINES,
        done() { ctx.next(); }, back() { ctx.prev(); }
      });
    },
    chant(ctx) {
      runLines(ctx.app, {
        title: 'Chant', view: 'chant', poses: [POSE.tap, POSE.frill], ms: 2200, lines: CHANT_LINES,
        done() { ctx.next(); }, back() { ctx.prev(); }
      });
    },
    book(ctx) {
      const book = BOOKS.filter((b) => b.id === ctx.stop.book)[0];
      if (!book) { ctx.next(); return; }
      const passed = load().gems.indexOf(ctx.si) >= 0;
      if (!passed && !reserveLonger() && !PREVIEW_NEXT) { goodbye(ctx.app); return; }
      readBook(ctx.app, book, '#/u1/u11', () => ctx.next());
    }
  };

  function dragGame(ctx) {
    const words = shuffle(['mat', 'map', 'pan', 'man']);
    const pics = shuffle(['mat', 'map', 'pan', 'man']);
    const view = shell(ctx.app, {
      title: 'Drag to the picture', view: 'drag', count: '0 of 4',
      home: '#/u1/u11',
      onNext() { ctx.next(); },
      onBack() { ctx.prev(); }
    });
    const placed = {};
    let picked = '';
    let left = 4;
    const later = [];
    const bank = h('div', { class: 'u11t-bank' });
    const grid = h('div', { class: 'u11t-pics' });
    const status = h('p', { class: 'u11t-status' }, 'Drag the word to its picture.');
    const note = h('div');
    function finishIf() {
      if (left > 0) return;
      if (later.length) {
        later.splice(0).forEach((word) => {
          placed[word] = 0;
          left++;
          const tile = bank.querySelector('[data-word="' + word + '"]');
          if (tile) { tile.classList.remove('gone'); tile.dataset.wrong = ''; }
          const cap = grid.querySelector('[data-pic="' + word + '"] .snapped');
          if (cap) cap.remove();
        });
        status.textContent = 'One more time.';
        return;
      }
      view.auto(700, () => ctx.next());
    }
    function snap(word, tile) {
      if (!tile.dataset.touched && ctx.stats) {
        tile.dataset.touched = '1';
        ctx.stats.firstN++;
        if (tile.dataset.wrong) {
          if (ctx.stats.missed.indexOf(word) < 0) ctx.stats.missed.push(word);
        } else ctx.stats.firstOk++;
      }
      if (tile.dataset.wrong && !tile.dataset.requeued) {
        tile.dataset.requeued = '1';
        later.push(word);
      }
      placed[word] = 1;
      left--;
      tile.classList.add('gone');
      const pic = grid.querySelector('[data-pic="' + word + '"]');
      if (pic) pic.append(h('span', { class: 'snapped' }, wordNode(word)));
      view.setCount((4 - left) + ' of 4');
      const sound = partsOf(word);
      note.innerHTML = '';
      if (sound.missing.length) note.append(recNote(sound.missing));
      status.textContent = word;
      Snd.seq(sound.files, 180).then(() => finishIf());
    }
    function wrong(word, tile) {
      tile.dataset.wrong = '1';
      if (!tile.dataset.touched && ctx.stats) {
        tile.dataset.touched = '1';
        ctx.stats.firstN++;
        if (ctx.stats.missed.indexOf(word) < 0) ctx.stats.missed.push(word);
      }
      status.textContent = word;
      const pic = grid.querySelector('[data-pic="' + word + '"]');
      if (pic) {
        pic.classList.add('is-hot');
        setTimeout(() => pic.classList.remove('is-hot'), 900);
      }
      const sound = partsOf(word);
      note.innerHTML = '';
      if (sound.missing.length) note.append(recNote(sound.missing));
      cueWord(word);
    }
    function dropOn(word, picId, tile) {
      if (placed[word]) return;
      if (picId === word) snap(word, tile);
      else wrong(word, tile);
    }
    function draw() {
      view.stage.innerHTML = '';
      grid.innerHTML = '';
      bank.innerHTML = '';
      pics.forEach((id, n) => {
        const hit = h('div', {
          class: 'u11t-pichit', 'data-pic': id, role: 'button', tabindex: '0',
          'aria-label': (n + 1) + '. Picture of ' + id
        }, badge(n + 1), picNode(id, 'u11t-pic'));
        if (placed[id]) hit.append(h('span', { class: 'snapped' }, wordNode(id)));
        hit.addEventListener('click', () => {
          if (!picked || placed[picked]) return;
          const tile = bank.querySelector('[data-word="' + picked + '"]');
          dropOn(picked, id, tile);
          picked = '';
          bank.querySelectorAll('.picked').forEach((el) => el.classList.remove('picked'));
        });
        grid.append(hit);
      });
      words.forEach((w, n) => {
        const tile = h('div', {
          class: 'u11t-tile' + (placed[w] ? ' gone' : ''),
          'data-word': w, 'data-n': String(n + 1), role: 'button', tabindex: '0',
          'aria-label': (n + 1) + '. ' + w
        }, badge(n + 1), wordNode(w));
        let pid = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false;
        tile.addEventListener('pointerdown', (e) => {
          if (placed[w]) return;
          pid = e.pointerId;
          sx = e.clientX; sy = e.clientY;
          const r = tile.getBoundingClientRect();
          ox = r.left; oy = r.top;
          moved = false;
          try { tile.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        });
        tile.addEventListener('pointermove', (e) => {
          if (e.pointerId !== pid) return;
          const dx = e.clientX - sx, dy = e.clientY - sy;
          if (!moved && Math.hypot(dx, dy) < 8) return;
          if (!moved) {
            moved = true;
            tile.classList.add('dragging');
            tile.style.width = rWidth(tile) + 'px';
          }
          tile.style.left = (ox + (e.clientX - sx)) + 'px';
          tile.style.top = (oy + (e.clientY - sy)) + 'px';
        });
        tile.addEventListener('pointerup', (e) => {
          if (e.pointerId !== pid) return;
          pid = null;
          const was = moved;
          moved = false;
          tile.classList.remove('dragging');
          tile.style.left = '';
          tile.style.top = '';
          tile.style.width = '';
          if (!was) {
            picked = picked === w ? '' : w;
            bank.querySelectorAll('.u11t-tile').forEach((el) => el.classList.toggle('picked', el === tile && picked === w));
            return;
          }
          tile.style.pointerEvents = 'none';
          const el = document.elementFromPoint(e.clientX, e.clientY);
          tile.style.pointerEvents = '';
          const pic = el && el.closest ? el.closest('[data-pic]') : null;
          if (pic) dropOn(w, pic.dataset.pic, tile);
        });
        tile.addEventListener('pointercancel', () => {
          pid = null;
          tile.classList.remove('dragging');
          tile.style.left = '';
          tile.style.top = '';
          tile.style.width = '';
        });
        bank.append(tile);
      });
      view.stage.append(h('div', { class: 'u11t-drag' }, grid, bank, status, note));
      view.setCount((4 - left) + ' of 4');
    }
    function rWidth(tile) { return tile.getBoundingClientRect().width; }
    view.setReplay(() => sayText(words.join(' ')));
    view.setNext(() => ctx.next());
    view.setBack(() => ctx.prev());
    draw();
  }

  function buildScene(kind) {
    if (kind === 'satchel') {
      return h('div', { class: 'u11-scene u11-satchel', 'data-scene': 'satchel' },
        h('img', { class: 'satchel-art', src: 'img/u11-satchel.jpg', alt: 'An open satchel' }),
        h('img', { class: 'pack map', 'data-part': 'map', src: 'img/u11-map.jpg', alt: '' }),
        h('img', { class: 'pack fan', 'data-part': 'fan', src: 'img/u11-fan.jpg', alt: '' }),
        h('img', { class: 'pack mat', 'data-part': 'mat', src: PICS.mat.src, alt: '' }));
    }
    if (kind === 'raft') {
      return h('div', { class: 'u11-scene', 'data-scene': 'raft' },
        h('div', { class: 'water' }),
        h('img', { class: 'deckmat', 'data-part': 'mat', src: PICS.mat.src, alt: '' }),
        h('div', { class: 'raftbox' }),
        h('img', { class: 'sailpic', 'data-part': 'fan', src: 'img/u11-fan.jpg', alt: '' }),
        h('img', { class: 'pinmap', 'data-part': 'map', src: 'img/u11-map.jpg', alt: '' }));
    }
    return h('div', { class: 'u11-scene', 'data-scene': 'tree' },
      h('span', { class: 'banyan', html: SVG.tree }),
      h('span', { class: 'lantern l1', 'data-part': 'l1' }),
      h('span', { class: 'lantern l2', 'data-part': 'l2' }),
      h('span', { class: 'lantern l3', 'data-part': 'l3' }));
  }

  function buildGame(ctx, spec) {
    spec = {
      title: spec.title, scene: spec.scene, done: spec.done,
      steps: spec.steps.map((s) => Object.assign({}, s))
    };
    const view = shell(ctx.app, {
      title: spec.title, view: spec.scene, count: '',
      home: '#/u1/u11',
      onNext() { ctx.next(); },
      onBack() { ctx.prev(); }
    });
    let step = ctx.startStep || 0;
    let locked = false;
    const done = {};
    for (let k = 0; k < step; k++) if (spec.steps[k]) done[spec.steps[k].part] = 1;
    const scene = buildScene(spec.scene);
    function paintParts() {
      scene.querySelectorAll('[data-part]').forEach((el) => {
        el.classList.toggle('is-on', !!done[el.dataset.part]);
      });
    }
    function finale() {
      scene.classList.add('finale');
      view.stage.innerHTML = '';
      view.setCount(spec.steps.length + ' of ' + spec.steps.length);
      view.stage.append(h('div', { class: 'u11-build', 'data-finale': spec.scene },
        scene,
        h('div', { class: 'u11t-faces' },
          h('img', { src: spec.scene === 'raft' ? POSE.surf : POSE.cheer, alt: 'Zip' }),
          h('img', { src: POSE.frillcheer, alt: 'Frill' })),
        h('p', { class: 'u11t-line' }, spec.done)));
      paintParts();
      step = spec.steps.length;
      paintParts();
      Snd.seq([SFX.ding, SFX.done], 140);
      view.setReplay(() => Snd.seq([SFX.ding, SFX.done], 140));
      let left = false;
      const leave = () => { if (left || !view.scr.ok()) return; left = true; ctx.next(); };
      view.setNext(leave);
      view.auto(2800, leave);
    }
    function round() {
      if (step >= spec.steps.length) { finale(); return; }
      locked = false;
      const item = spec.steps[step];
      view.setCount((step + 1) + ' of ' + spec.steps.length);
      view.arm(item.answer);
      view.setNext(() => { step++; if (step >= spec.steps.length) finale(); else round(); });
      view.setBack(() => { if (step > 0) { step--; round(); } else ctx.prev(); });
      const status = h('p', { class: 'u11t-status' }, '\u00a0');
      const choices = shuffle(item.choices.slice());
      const row = choiceRow(choices, (w, b) => {
        if (locked) return;
        if (w !== item.answer) {
          locked = true;
          if (!item.touched && ctx.stats && !item.again) {
            item.touched = true;
            item.wasWrong = true;
            ctx.stats.firstN++;
            if (ctx.stats.missed.indexOf(item.answer) < 0) ctx.stats.missed.push(item.answer);
          }
          const rightBtn = row.querySelector('[data-w="' + item.answer + '"]');
          if (rightBtn) rightBtn.classList.add('right');
          status.textContent = item.answer;
          cueWord(item.answer).then(() => { if (view.scr.ok()) { locked = false; status.textContent = 'Tap ' + item.answer; } });
          return;
        }
        if (!item.touched && ctx.stats && !item.again) {
          item.touched = true;
          ctx.stats.firstN++;
          ctx.stats.firstOk++;
        }
        if (item.wasWrong && !item.again) {
          spec.steps.splice(Math.min(spec.steps.length, step + 3), 0, { line: 'Tap ' + item.answer + '.', say: item.answer, choices: item.choices, answer: item.answer, again: 1 });
        }
        locked = true;
        b.classList.add('right');
        if (item.part) done[item.part] = 1;
        step++;
        paintParts();
        status.textContent = item.answer;
        let moved = false;
        const go = () => {
          if (moved || !view.scr.ok()) return;
          moved = true;
          if (step >= spec.steps.length) finale();
          else round();
        };
        view.setNext(go);
        sayText(item.answer).then(() => { if (!moved && view.scr.ok()) view.auto(500, go); });
      });
      const prompt = item.blank
        ? h('p', { class: 'u11t-sent' }, wordNode(item.line), h('span', { class: 'u11t-blank' }, '\u00a0'))
        : h('p', { class: 'u11t-line' }, wordNode(item.line));
      view.stage.innerHTML = '';
      view.stage.append(h('div', { class: 'u11-build', 'data-step': String(step) }, scene, prompt, row, status));
      paintParts();
      view.setReplay(() => sayText(item.say || item.line));
      sayText(item.say || item.line);
    }
    round();
  }

  function readBook(app, book, backHash, onDone) {
    let i = 0;
    const pages = book.pages;
    const ask = book.ask.map((q) => Object.assign({}, q));
    function len() { return pages.length + ask.length; }
    function show() {
      if (i < pages.length) showPage();
      else if (i < len()) showAsk();
      else {
        markRead(book.id);
        if (onDone) onDone();
        else location.hash = backHash;
      }
    }
    function showPage() {
      const page = pages[i];
      const view = shell(app, {
        title: book.title, view: 'book', count: (i + 1) + ' of ' + len(),
        home: backHash,
        onNext() { i++; show(); },
        onBack() { if (i > 0) { i--; show(); } else location.hash = backHash; }
      });
      const cast = h('div', { class: 'u11t-cast' }, h('img', { src: POSE[page.pose] || POSE.zip, alt: '' }));
      if (page.prop) cast.append(picNode(page.prop));
      view.stage.append(h('div', { class: 'u11t-book' }, cast, h('p', { class: 'u11t-line' }, wordNode(page.line))));
      view.setReplay(() => sayText(page.line));
      sayText(page.line);
      view.auto(2600, () => { if (view.scr.ok()) { i++; show(); } });
    }
    function showAsk() {
      const q = ask[i - pages.length];
      const view = shell(app, {
        title: book.title, view: 'book-ask', count: (i + 1) + ' of ' + len(),
        home: backHash,
        onNext() { i++; show(); },
        onBack() { if (i > 0) { i--; show(); } }
      });
      let locked = false;
      const status = h('p', { class: 'u11t-status' }, '\u00a0');
      const choices = shuffle(q.choices.slice());
      function draw() {
        view.stage.innerHTML = '';
        view.arm(q.answer);
        const row = choiceRow(choices, (w, b) => {
          if (locked) return;
          if (w !== q.answer) {
            locked = true;
            const rightBtn = row.querySelector('[data-w="' + q.answer + '"]');
            if (rightBtn) rightBtn.classList.add('right');
            status.textContent = q.answer;
            if (!q.again) {
              q.again = 1;
              const at = (i - pages.length) + 3;
              ask.splice(Math.min(ask.length, at), 0, Object.assign({}, q));
            }
            let moved = false;
            const go = () => { if (moved || !view.scr.ok()) return; moved = true; i++; show(); };
            view.setNext(go);
            sayText(q.answer).then(() => { if (!moved && view.scr.ok()) view.auto(700, go); });
            return;
          }
          locked = true;
          b.classList.add('right');
          status.textContent = q.answer;
          sayText(q.line);
          view.auto(900, () => { i++; show(); });
        });
        view.stage.append(h('div', { class: 'u11t-card' }, h('p', { class: 'u11t-line' }, wordNode(q.line)), row, status));
      }
      view.setReplay(() => sayText(q.line));
      view.setBack(() => { if (i > 0) { i--; show(); } });
      draw();
      sayText(q.line);
    }
    show();
  }

  function runLines(app, o) {
    const lines = o.lines;
    let i = 0;
    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      if (o.done) o.done();
      else location.hash = o.home || '#/u1/u11';
    }
    function show() {
      const last = i === lines.length - 1;
      const view = shell(app, {
        title: o.title, view: o.view, count: (i + 1) + ' of ' + lines.length,
        home: o.home || '#/u1/u11',
        onNext() { if (!last) { i++; show(); } else finish(); },
        onBack() { if (i > 0) { i--; show(); } else if (o.back) o.back(); else finish(); }
      });
      const pose = o.poses ? o.poses[i % o.poses.length] : (o.pose || POSE.frill);
      view.stage.append(h('div', { class: 'u11t-card' },
        h('img', { class: 'u11t-pose', src: pose, alt: '' }),
        h('p', { class: 'u11t-line' }, wordNode(lines[i]))));
      view.setReplay(() => sayText(lines[i]));
      sayText(lines[i]);
      view.auto(o.ms || 2200, () => {
        if (!view.scr.ok() || finished) return;
        if (!last) { i++; show(); }
        else finish();
      });
    }
    show();
  }

  function library(app, hash) {
    const id = (hash || '').replace(/^#\/library\/?/, '');
    if (id) {
      const book = BOOKS.filter((b) => b.id === id)[0];
      if (book) { readBook(app, book, '#/library'); return; }
    }
    const got = reads();
    const view = shell(app, {
      title: 'Library', view: 'library', corner: 'home', preview: false, confirm: false, count: '',
      onBack() { location.hash = '#/home'; },
      onNext() {}
    });
    const list = h('div', { class: 'u11t-lib' });
    BOOKS.forEach((book) => {
      const row = h('button', {
        class: 'u11t-librow', type: 'button',
        'aria-label': book.title + (got[book.id] ? '. Read.' : '. Not read yet.')
      },
        h('img', { src: POSE[book.pose] || POSE.zip, alt: '' }),
        h('span', null, h('b', null, book.title), h('span', { style: 'display:block;font-weight:400' }, book.blurb)),
        got[book.id] ? h('span', { class: 'u11t-check' }, icon('check')) : h('span'));
      row.addEventListener('click', () => { location.hash = '#/library/' + book.id; });
      list.append(row);
    });
    view.stage.append(list);
    view.setReplay(() => {});
  }

  function endPrize(app) {
    const view = shell(app, {
      title: 'The bells', view: 'end', confirm: false, count: STOPS.length + ' of ' + STOPS.length,
      onNext() { location.hash = '#/u1/u11'; },
      onBack() { location.hash = '#/u1/u11'; }
    });
    const bells = h('div', { class: 'u11t-bells' });
    for (let i = 0; i < 5; i++) bells.append(h('img', { src: 'img/bell_lit.png', alt: '' }));
    view.stage.append(h('div', { class: 'u11t-card' },
      bells,
      h('div', { class: 'u11t-faces' },
        h('img', { src: POSE.bell, alt: 'Zip' }),
        h('img', { src: POSE.frill, alt: 'Frill' })),
      h('p', { class: 'u11t-joke' }, 'Pam pat a pan.'),
      h('p', { class: 'u11t-joke' }, 'A map sat at a pan.'),
      h('p', { class: 'u11t-rec' }, 'Recording needed: Zip and Frill say the joke. The bell sounds are ready.')));
    const tune = () => Snd.seq([SFX.ding, SFX.tap, SFX.ding, SFX.gong, SFX.ding], 160);
    view.setReplay(tune);
    tune();
  }

  function openFind(app, id) {
    const longer = id === 'chant' || id.indexOf('book:') === 0;
    if (longer) {
      let n = 0;
      try { n = parseInt(sessionStorage.getItem(LONG_KEY) || '0', 10) || 0; } catch (e) { n = 0; }
      if (n >= DOSE.longerPerSitting) { goodbye(app); return; }
      try { sessionStorage.setItem(LONG_KEY, String(n + 1)); } catch (e) { /* ignore */ }
    }
    if (id === 'twist') {
      runLines(app, { title: 'Tongue twister', view: 'twist', pose: POSE.frill, ms: 2400, lines: TWIST_LINES });
      return;
    }
    if (id === 'chant') {
      runLines(app, { title: 'Chant', view: 'chant', poses: [POSE.tap, POSE.frill], ms: 2200, lines: CHANT_LINES });
      return;
    }
    if (id.indexOf('book:') === 0) {
      const book = BOOKS.filter((b) => b.id === id.slice(5))[0];
      if (!book) { map(app); return; }
      const si = STOPS.findIndex((s) => s.book === book.id);
      if (si >= 0 && markerIndex(load().gems) < si) { map(app); return; }
      readBook(app, book, '#/u1/u11');
      return;
    }
    map(app);
  }

  IR.u11Trail = {
    wants(sub) { return !sub || sub === 'trail' || sub.indexOf('trail/') === 0; },
    open(app, L, sub) {
      const rest = (sub || '').replace(/^trail\/?/, '');
      if (!rest) { map(app); return; }
      if (rest === 'end') { endPrize(app); return; }
      if (rest === 'bye') { goodbye(app); return; }
      const find = /^find\/(.+)$/.exec(rest);
      if (find) { openFind(app, find[1]); return; }
      const m = /^(\d+)$/.exec(rest);
      if (m) {
        const si = parseInt(m[1], 10);
        const here = markerIndex(load().gems);
        if (si > here && !demo()) { map(app); return; }
        runStop(app, si, 0, 0);
        return;
      }
      map(app);
    },
    library: library,
    books: BOOKS
  };
})();
