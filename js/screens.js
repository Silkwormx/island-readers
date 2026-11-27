/* Screens + router: Home sky map, Island 3 trail, lesson shell, grown-up corner, cartoon. */
(function () {
  'use strict';
  const IR = window.IR;
  const { D, h, $, $$, sleep, icon, Snd, A, say } = IR;
  const app = $('#app'); const modalRoot = $('#modal-root');
  const LESSONS = IR.LESSONS;
  /* The whole world in order: Ground Level, Islands 1-10, two Review Reefs, four treasure boxes (after Islands 2, 4, 6, 8). All four treasure chests open from the map data and from Sight Word Practice. */
  const WORLD = [
    { id: 'ground', kind: 'ground', title: 'Ground Level', sub: 'Where the journey starts' },
    { id: 'i1', kind: 'island', n: 1, title: 'Blends and Floss' }, { id: 'i2', kind: 'island', n: 2, title: 'Digraphs' },
    { id: 'chest1', kind: 'chest', n: 1, title: 'Treasure chest 1', sub: 'Level 1 \u00b7 Word games', href: '#/chest1' },
    { id: 'i3', kind: 'island', n: 3, title: 'Glued Sounds', sub: 'ng, nk', href: '#/island3' },
    { id: 'i4', kind: 'island', n: 4, title: 'Silent e and Word Endings' },
    { id: 'chest2', kind: 'chest', n: 2, title: 'Treasure chest 2', sub: 'Level 2 \u00b7 Word games', href: '#/chest2' },
    { id: 'i5', kind: 'island', n: 5, title: 'Longer Words' }, { id: 'reef1', kind: 'reef', title: 'Review Reef', sub: 'After Island 5' },
    { id: 'i6', kind: 'island', n: 6, title: 'Bossy r' },
    { id: 'chest3', kind: 'chest', n: 3, title: 'Treasure chest 3', sub: 'Level 3 \u00b7 Word games', href: '#/chest3' },
    { id: 'i7', kind: 'island', n: 7, title: 'Vowel Teams' }, { id: 'i8', kind: 'island', n: 8, title: 'Other Vowels' },
    { id: 'chest4', kind: 'chest', n: 4, title: 'Treasure chest 4', sub: 'Level 4 \u00b7 Word games', href: '#/chest4' },
    { id: 'i9', kind: 'island', n: 9, title: 'Word Parts' }, { id: 'i10', kind: 'island', n: 10, title: 'Spelling Patterns' },
    { id: 'reef2', kind: 'reef', title: 'Review Reef', sub: 'After Island 10' }
  ];

  /* ---------- shared bits ---------- */
  function toast(msg) {
    $$('.toast').forEach((t) => t.remove());
    const t = h('div', { class: 'toast', role: 'status' }, msg); document.body.append(t); setTimeout(() => t.remove(), 3200);
  }
  /* The star count and streak chips were removed from every top bar. */
  function chips() { return null; }
  /* Standard Home button (house icon + "Home") on the top bar of every unit, lesson, activity and game screen: back to the world map. */
  function homeButton() {
    return h('button', { class: 'back homebtn', type: 'button', 'aria-label': 'Home: the world map', onclick: () => { Snd.stop(); location.hash = '#/home'; } }, icon('home'), h('span', null, 'Home'));
  }
  function backButton(up) {
    return h('button', { class: 'back homebtn pageback', type: 'button', 'aria-label': 'Back', onclick: () => { Snd.stop(); if (typeof up === 'function') up(); else location.hash = up; } }, icon('back'), h('span', null, 'Back'));
  }
  function pageNav(up) {
    return h('div', { class: 'pagenav' }, backButton(up), homeButton());
  }
  /* Day starts are the title slides in each image deck. Unit 5 has no day slides. */
  const WEEK_DAYS = {
    ng: [
      { label: 'Day 1', page: 1 },
      { label: 'Day 2', page: 22 },
      { label: 'Day 3', page: 42 },
      { label: 'Day 4', page: 55 },
      { label: 'Day 5', page: 65 }
    ],
    nk: [
      { label: 'Day 1', page: 1 },
      { label: 'Day 2', page: 21 },
      { label: 'Day 3', page: 43 }
    ]
  };
  IR.weekDays = WEEK_DAYS;
  function dayMenu(days, onPick) {
    const list = (days || []).filter((day) => /^Day\s+\d+/i.test(String((day && (day.label || (day.day ? 'Day ' + day.day : ''))) || '')));
    if (!list.length) return null;
    return h('div', { class: 'slidedays' },
      h('p', { class: 'slidedays-title' }, 'Pick a day'),
      ...list.map((day) => h('button', {
        class: 'btn big slideday',
        type: 'button',
        onclick: () => onPick(day.page || day.start)
      }, day.label || ('Day ' + day.day))));
  }
  IR.dayMenu = dayMenu;
  function gearButton() {
    const b = h('button', { class: 'gear', type: 'button', 'aria-label': 'Parent and Teacher Materials. Press and hold to open.' }, icon('gear'));
    let t = null;
    const start = () => { b.classList.add('holding'); t = setTimeout(() => { b.classList.remove('holding'); openGrownups(); }, 800); };
    const stop = () => { b.classList.remove('holding'); clearTimeout(t); };
    b.addEventListener('pointerdown', start); b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop); b.addEventListener('pointercancel', stop);
    b.addEventListener('click', () => toast('Press and hold for Parent and Teacher Materials.'));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter') openGrownups(); });
    return b;
  }
  function openModal(content, cls) {
    modalRoot.innerHTML = '';
    const close = () => { modalRoot.innerHTML = ''; };
    const box = h('div', { class: 'modal ' + (cls || ''), role: 'dialog', 'aria-modal': 'true' }, content);
    const x = h('button', { class: 'modal-x', type: 'button', 'aria-label': 'Close' }, icon('close')); x.addEventListener('click', () => { close(); if (cls === 'video') $$('video', box).forEach((v) => v.pause()); });
    box.prepend(x);
    modalRoot.append(h('div', { class: 'scrim' }, box)); return { close };
  }
  /* ---- cartoon player with word-by-word captions (CC on by default, remembered) ---- */
  const CC_KEY = 'ir_cc_on';
  function ccGet() { try { const r = localStorage.getItem(CC_KEY); return r === null ? true : r === '1'; } catch (e) { return true; } }
  function ccSet(on) { try { localStorage.setItem(CC_KEY, on ? '1' : '0'); } catch (e) { /* ignore */ } }
  let ccCache = null;
  /* The cartoon is configured in data.js (D.cartoon) so the file can be swapped later: change src / captions (or set captions to null) / poster / title / note, rebuild. */
  const CARTOON = () => Object.assign({ src: 'video/ng_cartoon_small.mp4', captions: 'video/ng_cartoon_captions.json', poster: 'img/island3_banner.jpg', title: 'Zip and Frill: The Nose Hum', note: 'Optional cartoon, 2 min 27 s. Captions highlight each word as it is spoken.' }, D.cartoon || {});
  function loadCaptions() {
    if (ccCache) return Promise.resolve(ccCache);
    if (!CARTOON().captions) return Promise.resolve([]);
    return fetch(CARTOON().captions).then((r) => r.json()).then((d) => { ccCache = d; return d; }).catch(() => []);
  }
  function captionPlayer(v, box, cues) {
    let on = ccGet(); let curCue = -2; let curWord = -2; let spans = []; let raf = 0;
    const overlay = h('div', { class: 'cc-overlay', 'aria-hidden': 'true' });
    const toggle = h('button', { class: 'btn small ghost cc-toggle', type: 'button', 'aria-pressed': String(on) });
    const setToggle = () => { toggle.textContent = on ? 'CC: on' : 'CC: off'; toggle.setAttribute('aria-pressed', String(on)); overlay.classList.toggle('off', !on); };
    function findCue(t) { let lo = 0; let hi = cues.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; const c = cues[m]; if (t < c.start) hi = m - 1; else if (t >= c.end) lo = m + 1; else return m; } return -1; }
    function render() {
      const t = v.currentTime; const ci = findCue(t);
      if (ci !== curCue) {
        curCue = ci; curWord = -2; overlay.innerHTML = ''; spans = [];
        if (ci >= 0) {
          const c = cues[ci];
          const who = h('span', { class: 'cc-who cc-' + c.speaker.toLowerCase() }, c.speaker + ':');
          overlay.append(who);
          c.words.forEach((w) => { const sp = h('span', { class: 'cc-w' }, w.w); spans.push(sp); overlay.append(' ', sp); });
        }
        overlay.classList.toggle('empty', ci < 0);
      }
      if (ci >= 0) {
        const ws = cues[ci].words; let wi = -1;
        for (let i = 0; i < ws.length; i++) { if (t >= ws[i].start && t < ws[i].end) { wi = i; break; } }
        if (wi !== curWord) { if (curWord >= 0 && spans[curWord]) spans[curWord].classList.remove('on'); if (wi >= 0) spans[wi].classList.add('on'); curWord = wi; }
      }
    }
    function loop() { render(); if (!v.paused && !v.ended) raf = requestAnimationFrame(loop); else raf = 0; }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    ['play', 'playing', 'seeking', 'seeked', 'timeupdate', 'pause', 'ended', 'loadedmetadata'].forEach((ev) => v.addEventListener(ev, () => { render(); if (!v.paused) kick(); }));
    toggle.addEventListener('click', () => { on = !on; ccSet(on); setToggle(); });
    setToggle(); render();
    const fsBtn = (box.requestFullscreen || box.webkitRequestFullscreen) ? h('button', { class: 'btn small ghost', type: 'button' }, 'Full screen') : null;
    if (fsBtn) fsBtn.addEventListener('click', () => { const f = box.requestFullscreen ? box.requestFullscreen() : box.webkitRequestFullscreen(); if (f && f.catch) f.catch(() => {}); });
    return { overlay, toggle, fsBtn, stop: () => { cancelAnimationFrame(raf); raf = 0; } };
  }
  IR.openCartoon = function () {
    Snd.stop();
    const C = CARTOON();
    const v = h('video', { controls: true, playsinline: true, preload: 'metadata', poster: C.poster, controlslist: 'nofullscreen', 'aria-label': C.title + ' cartoon' }, h('source', { src: C.src, type: /\.webm$/i.test(C.src) ? 'video/webm' : 'video/mp4' }));
    const wrap = h('div', { class: 'vwrap' }, v);
    const bar = h('div', { class: 'row center cc-row' });
    openModal(h('div', null, h('h2', null, C.title), wrap, bar, h('p', { class: 'small' }, C.note)), 'video');
    { const mb = $('.modal.video'); if (mb) mb.append(h('div', { class: 'row center', style: 'margin-top:.8rem' }, h('button', { class: 'btn big back', type: 'button', 'aria-label': 'Back', onclick: () => { $$('video', modalRoot).forEach((v) => v.pause()); modalRoot.innerHTML = ''; } }, icon('back'), 'Back'), h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next: start the lessons', onclick: () => { $$('video', modalRoot).forEach((v) => v.pause()); modalRoot.innerHTML = ''; const n = nextUp(); location.hash = n ? n.href : '#/home'; } }, 'Next', icon('next')))); }
    loadCaptions().then((cues) => {
      if (!cues || !cues.length) return;
      const cp = captionPlayer(v, wrap, cues);
      wrap.append(cp.overlay); bar.append(cp.toggle); if (cp.fsBtn) bar.append(cp.fsBtn);
      window.__irCC = cp;
    });
  };
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });
  function openGrownups() {
    const S = IR.S();
    const calm = h('input', { type: 'checkbox', id: 'opt-calm' }); calm.checked = !!S.settings.calm;
    calm.addEventListener('change', () => { S.settings.calm = calm.checked; IR.save(); IR.applySettings(); });
    const open = h('input', { type: 'checkbox', id: 'opt-open' }); open.checked = !!S.settings.openAll;
    open.addEventListener('change', () => { S.settings.openAll = open.checked; IR.save(); });
    const timerOff = h('input', { type: 'checkbox', id: 'opt-sort-timer' }); timerOff.checked = !!S.settings.sortTimerOff;
    timerOff.addEventListener('change', () => { S.settings.sortTimerOff = timerOff.checked; IR.save(); });
    const kidsBtn = h('button', { class: 'btn small', type: 'button' }, 'Student progress');
    kidsBtn.addEventListener('click', () => openKidReport());
    const reset = h('button', { class: 'btn small warn', type: 'button' }, 'Reset this child');
    reset.addEventListener('click', () => {
      if (reset.dataset.sure) { IR.resetAll(); modalRoot.innerHTML = ''; location.hash = '#/home'; route(); toast('Progress cleared.'); }
      else { reset.dataset.sure = 1; reset.textContent = 'Tap again to clear everything'; }
    });
    const inst = h('button', { class: 'btn small', type: 'button' }, 'Install on this device');
    inst.addEventListener('click', async () => { if (deferredInstall) { deferredInstall.prompt(); } else toast('Use your browser menu: Add to Home Screen / Install app.'); });
    const hearNg = h('button', { class: 'btn small', type: 'button', hidden: true }, icon('speaker'), 'Play the recorded ng sound');
    hearNg.addEventListener('click', () => IR.playPhoneme('ng')); IR.hasPhoneme('ng').then((ok) => { if (ok) hearNg.hidden = false; });
    const sc = S.check;
    openModal(h('div', { class: 'grown' },
      h('h2', null, 'Parent and Teacher Materials'),
      h('a', { class: 'btn big primary tmbtn', href: '#/teachers', onclick: () => { modalRoot.innerHTML = ''; } }, 'Teacher materials'),
      h('p', null, 'This is an early version of Island Readers. Unit 4 (ng and nk) is open now, and more units are on the way. Progress is saved only on this device. Nothing is sent anywhere.'),
      h('p', null, 'Check best score: ' + (sc.best == null ? 'not taken yet' : sc.best + ' of 10') + (sc.attempts ? ' (' + sc.attempts + ' tries)' : '') + '.'),
      h('label', { class: 'opt' }, calm, ' Calm motion (fish hold still, no wiggles)'),
      h('label', { class: 'opt' }, open, ' Open every lesson and the check (for testing)'),
      h('label', { class: 'opt' }, timerOff, ' Turn off the sorting timer'),
      h('div', { class: 'row' }, kidsBtn, hearNg, inst, reset),
      IR.chest && IR.chest.checklist ? IR.chest.checklist() : null,
      h('p', { class: 'small' }, 'The app cannot listen to a child read. Reading aloud stays with a grown-up. Check the isolated ng sound by ear before sharing.')));
  }


  /* ---------- ISLAND PICKER (panel over the map): the island's units + Island Review, all from D.islands (data.js) ----------
     Rules: unit 1 is open; the next unit opens when the previous unit has all its stars; Island Review opens when every unit is done;
     the next island opens when Island Review is done. A unit with no content yet (ready:false) shows "Coming soon" instead. */
  function islandItems(id) {
    const cfg = (D.islands || {})[id]; if (!cfg) return null;
    const list = cfg.units.map((u) => Object.assign({ kind: 'unit' }, u)).concat(cfg.review ? [Object.assign({ kind: 'review' }, cfg.review)] : []);
    let prevDone = true; let prev = null;
    list.forEach((u, i) => {
      if (u.id === 'ng') { const secs = unitSections(); const req = secs.filter((r) => !r.optional); u.total = req.length; u.done = req.filter((r) => r.done).length; u.min = req.reduce((a, r) => a + r.min, 0); }
      else { const pr = IR.nkProgress && IR.nkProgress(u.id); if (pr) { u.total = pr.total; u.done = pr.done; u.min = pr.min; } else { u.total = u.stars || 1; u.done = 0; u.min = u.minutes || 0; } }       /* progress for the other units is wired up when their content exists */
      u.complete = u.ready && u.done >= u.total;
      const before = list.slice(0, i); const need = u.kind === 'review' ? before : (prev ? [prev] : []);
      const needDone = need.every((x) => x.complete);
      /* Nov 3 2026: lessons are never hard-locked (nk opens even before ng is finished; a gentle 'best after' note shows instead). Only the Review waits. */
      u.state = !u.ready ? 'soon' : 'open';   /* Nov 3 2026: the Unit Review is always open too (was locked until ng and nk had all their stars) */
      u.soft = !needDone && prev ? (u.kind === 'review' ? 'Best after ' + before.map((x) => x.name).join(' and ') : 'Best after ' + prev.name) : '';
      u.lockMsg = !needDone ? (u.kind === 'review' ? 'Unlocks when ' + before.map((x) => x.name).join(' and ') + ' are done' : 'Unlocks when ' + prev.name + ' has all ' + prev.total + ' stars') : u.state === 'soon' ? 'Coming soon' : '';
      prev = u;
    });
    return { cfg, list, done: list.every((x) => x.complete) };
  }
  const islandDone = (id) => { const r = islandItems(id); return !!r && r.done; };
  IR.islandDone = islandDone;
  function openIsland(id) {
    const w0 = WORLD.find((x) => x.id === id); const info = islandItems(id); if (!info) return;
    /* Nov 3 2026: 22-unit plan. Glued Sounds is Unit 4 (data id stays 'i3', route #/island3). */
    const w = Object.assign({}, w0, id === 'i5' ? { n: 5, title: 'Silent e' } : { n: id === 'i3' ? 4 : w0.n });
    Snd.stop();
    const imgs = (u) => h('div', { class: 'uimg' }, ...u.img.map((n) => h('img', { src: 'img/' + ({ zip: 'zipA', frill: 'frillC' }[n] || n) + '.webp', alt: '' })), u.state === 'open' ? null : h('span', { class: 'herechip soonchip' }, 'Coming soon'));
    const stars = (u) => h('div', { class: 'dots', 'aria-hidden': 'true' }, ...Array.from({ length: u.total }, (_, k) => h('span', { class: 'sstar' + (k < u.done ? ' on' : '') }, icon('star'))));
    const cards = info.list.map((u) => {
      const title = u.kind === 'review' ? 'Review' : u.name;
      const step = info.list.filter((x) => x.kind !== 'review').indexOf(u) + 1;
      const kind = u.kind === 'review' ? 'Unit ' + w.n + ' Review' : 'Lesson ' + step;
      const body = h('div', { class: 'ubody' }, h('div', { class: 'uk' }, kind), h('h2', null, title),
        h('div', { class: 'umin' }, u.min ? 'About ' + u.min + ' min' : ''), u.desc ? h('div', { class: 'rvd' }, u.desc) : null, stars(u),
        u.state === 'open' ? h('div', { class: 'uprog' }, u.done + ' of ' + u.total + ' stars' + (u.soft ? ' \u00b7 ' + u.soft : '')) : h('div', { class: 'uprog' }, 'Coming soon'));
      const card = h('button', { class: 'tapcard ucard ' + (u.state === 'open' ? 'open' : 'soon') + (u.kind === 'review' ? ' rv' : ''), type: 'button', 'data-unit': u.id, 'data-state': u.state,
        'aria-label': (u.kind === 'review' ? 'Unit ' + w.n + ' Review' : 'Lesson ' + step + ': ' + u.name) + '. ' + (u.state === 'open' ? u.done + ' of ' + u.total + ' stars. Open.' : 'Coming soon.'),
        onclick: () => { Snd.stop(); if (u.state === 'open') { modalRoot.innerHTML = ''; location.hash = u.href; } else toast('Coming soon.'); } }, imgs(u), body);
      if (u.state === 'open') body.append(h('span', { class: 'obtn' }, 'Open lesson'));
      return card;
    });
    const nextIs0 = WORLD[WORLD.indexOf(w0) + 1]; const nextIs = nextIs0 && nextIs0.kind === 'island' ? { kind: 'island', n: w.n + 1 } : nextIs0;
    /* Unit 5 Silent e is already open locally/live; do not say it still unlocks after Unit 4 Review. */
    const nextOpen = nextIs && ((nextIs.n === 5 && !!IR.u5Route) || info.done);
    const note = nextIs && nextIs.kind === 'island' ? h('div', { class: 'pnote' }, nextOpen ? icon('star') : null, nextOpen ? 'Unit ' + nextIs.n + ' is open.' : 'Unit ' + nextIs.n + ' is coming soon.') : null;
    const close = () => { modalRoot.innerHTML = ''; document.removeEventListener('keydown', onKey); const b = $('[data-id="' + id + '"]'); if (b) b.focus({ preventScroll: true }); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const panel = h('div', { class: 'panel picker' + (id === 'i3' ? ' orangepick' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Unit ' + w.n + ': ' + w.title + '. Pick a lesson.', 'data-island': id },
      h('div', { class: 'ph' }, h('button', { class: 'home', type: 'button', onclick: close }, icon('home'), 'Home'),
        h('h1', null, 'Unit ' + w.n + ' \u00b7 ' + w.title, h('small', null, 'Pick a lesson')),
        h('button', { class: 'x', type: 'button', 'aria-label': 'Close', onclick: close }, icon('close'))),
      h('div', { class: 'pcards' }, ...cards), note);
    modalRoot.innerHTML = '';
    const scrim = h('div', { class: 'scrim picker-scrim' }, panel); scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
    modalRoot.append(scrim);
    const first = $('.ucard.open', panel); (first || $('.x', panel)).focus({ preventScroll: true });
  }
  IR.openIsland = openIsland;

  /* ---------- HOME: the world map as one screen (Option A grid). Top row: Placement + Get Started. Then 5 rows of
     [Unit, Unit, Sight Words box]; the last row ends with Finish. Each unit is a painted fantasy world (img/w1..w10.webp). ---------- */
  const HI = {
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21.1l1.5-7L2 9.3l7-.8z" fill="#ffc83d" stroke="#b07a10" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V8a5 5 0 0110 0v3" fill="none" stroke="#7a5a3a" stroke-width="2.6"/><rect x="4" y="10.5" width="16" height="11" rx="3" fill="#c99a5b" stroke="#7a5a3a" stroke-width="1.6"/><circle cx="12" cy="16" r="1.8" fill="#7a5a3a"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="#ffe36a" stroke="#d29b16" stroke-width="1.3"/></svg>',
    clip: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="6" width="32" height="40" rx="5" fill="#c98b4e" stroke="#7a4a22" stroke-width="2"/><rect x="12" y="11" width="24" height="31" rx="2" fill="#fff6e3"/><rect x="17" y="3" width="14" height="7" rx="3" fill="#8fd0dc" stroke="#2c7f95" stroke-width="2"/><path d="M16 20l3 3 5-6M16 31l3 3 5-6" stroke="#3aa35a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M27 21h6M27 32h6" stroke="#b9a58a" stroke-width="3" stroke-linecap="round"/></svg>',
    abc: '<svg viewBox="0 0 60 48" aria-hidden="true"><g font-family="Andika" font-weight="700" font-size="20" text-anchor="middle"><rect x="2" y="14" width="18" height="18" rx="4" fill="#ff8a7a" stroke="#a24a3a" stroke-width="2"/><text x="11" y="29" fill="#fff">a</text><rect x="21" y="6" width="18" height="18" rx="4" fill="#ffd25a" stroke="#a7801c" stroke-width="2"/><text x="30" y="21" fill="#5a3a10">b</text><rect x="40" y="16" width="18" height="18" rx="4" fill="#7fd08a" stroke="#2f7d3c" stroke-width="2"/><text x="49" y="31" fill="#fff">c</text></g></svg>',
    flag: '<svg viewBox="0 0 80 70" aria-hidden="true"><ellipse cx="40" cy="60" rx="34" ry="8" fill="#f1d79a" stroke="#c9a560" stroke-width="2"/><rect x="26" y="8" width="4" height="52" rx="2" fill="#8a5a2b"/><path d="M30 9 h30 l-7 9 7 9 h-30z" fill="#ff7a6a" stroke="#a24a3a" stroke-width="2"/><g fill="#ffd84a"><circle cx="10" cy="20" r="2.5"/><circle cx="68" cy="40" r="2.5"/><circle cx="16" cy="42" r="2"/></g></svg>'
  };
  const SHORT = { 4: 'Silent e', 10: 'Spelling' };
  const NAMES4 = { 4: 'Silent e and Endings' };
  /* ---------- HOME map (Banyan grid, Oct 31 2026; mockup full_mockup/a_map): rows [Unit, Unit, Sight words box], last row ends with Finish.
     Full-bleed tree art per unit (img/map_tN.webp), Unit 3 = the user's own painting (img/map_u3.webp). Gem box strip opens #/gems. ---------- */
  const UCOL = { 1: '#C8202A', 2: '#F27A7D', 3: '#F28C00', 4: '#F5D020', 5: '#3FA055', 6: '#7CCCEB', 7: '#1F3E9E', 8: '#8A4FC8', 9: '#E0559B', 10: '#C9A227' };
  const GEMS = [['ruby', 'Ruby', '#C8302C'], ['coral', 'Coral', '#F07A62'], ['amber', 'Amber', '#E8731C'], ['topaz', 'Topaz', '#C9A227'], ['emerald', 'Emerald', '#2E8B57'],
    ['aquamarine', 'Aquamarine', '#3BA3C4'], ['sapphire', 'Sapphire', '#1F3E9E'], ['amethyst', 'Amethyst', '#8A4FC8'], ['rosequartz', 'Rose quartz', '#E0559B'], ['gold', 'Gold', '#B8901C']];
  const gemSrc = (i) => 'img/gem_' + String(i + 1).padStart(2, '0') + '_' + GEMS[i][0] + '.webp';
  /* sample rules: Units 1-2 count as done; the amber gem is earned when Unit 3 is finished (ng + nk + review) */
  const gemsEarned = () => { const n = [true, true, islandDone('i3')]; return GEMS.map((_, i) => !!n[i]); };
  const gemNext = () => gemsEarned().indexOf(false);
  /* A unit module can register itself so placement, the trail, and the home tiles open it.
     Units 7 to 9 stay on their own checks. Units 10 to 12 register from js/u1012.js. */
  function builtUnitHref(n) {
    const list = IR.unitHrefs || [];
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (row.units.indexOf(n) >= 0 && (!row.open || row.open(n))) return row.href(n);
    }
    return '';
  }
  /* Continue opens the placement test when nothing is saved yet, otherwise the first unfinished built lesson. */
  function continueTarget() {
    const start = IR.placement && IR.placement.savedStart ? IR.placement.savedStart() : null;
    const acts = (IR.S().progress && IR.S().progress.activities) || {};
    const any = Object.keys(acts).some((k) => acts[k] && acts[k].completed);
    const early = (IR.u123Lessons || []).map((L) => ({ unit: L.unit, lesson: L.n, href: '#/u' + L.unit + '/' + L.key, done: () => IR.isDone(L.key + '_check') }));
    const path = early.concat([
      { unit: 4, lesson: '4.1', href: '#/island3', done: () => IR.isDone('check') },
      { unit: 4, lesson: '4.2', href: '#/nk', done: () => IR.isDone('nk_check') },
      { unit: 5, lesson: '5.1', href: '#/u51', done: () => IR.isDone('u51_check') },
      { unit: 5, lesson: '5.2', href: '#/u53', done: () => IR.isDone('u53_check') },
      { unit: 6, lesson: '6.1', href: '#/u6/u61', done: () => IR.isDone('u61_check') },
      { unit: 6, lesson: '6.2', href: '#/u6/u62', done: () => IR.isDone('u62_check') },
      { unit: 6, lesson: '6.3', href: '#/u6/u63', done: () => IR.isDone('u63_check') }
    ].concat((IR.u789Lessons || []).map((L) => ({ unit: L.unit, lesson: L.n, href: '#/u' + L.unit + '/' + L.key, done: () => IR.isDone(L.key + '_check') })))
      .concat((IR.u1012Lessons || []).map((L) => ({ unit: L.unit, lesson: L.n, href: '#/u' + L.unit + '/' + L.key, done: () => IR.isDone(L.key + '_check') }))));
    if (!any && !start) return { href: '#/placement', sub: 'Pick up where you left off' };
    if (!any && start && start.team) return { href: '#/foundation/letters/g' + start.team, sub: 'Team ' + start.team };
    /* Units 1 to 3 join the path (Nov 27 2026). A reader who already started at Unit 4 or later keeps that start. */
    const startedEarly = Object.keys(acts).some((k) => /^u[123]\d_/.test(k) && acts[k] && acts[k].completed);
    let startAt = any && !startedEarly ? Math.max(0, path.findIndex((p) => p.unit === 4)) : 0;
    if (!any && start && start.unit) {
      /* Adaptive placement stores a unit number. Units 1-3 stay on that unit when those lessons are built.
         A start above the built units lands on the last open unit, the same as the Island hop game. */
      let unitForBell = start.unit;
      if (!(early.length && unitForBell <= 3) && !builtUnitHref(unitForBell)) unitForBell = unitForBell <= 4 ? 4 : unitForBell === 5 ? 5 : (unitForBell >= 7 && unitForBell <= 9 && IR.u789Route) ? unitForBell : 6;
      const i = path.findIndex((p) => p.unit >= unitForBell);
      if (i >= 0) startAt = i;
    }
    for (let i = startAt; i < path.length; i++) {
      if (!path[i].done()) return { href: path[i].href, sub: 'Unit ' + path[i].unit + ' \u00b7 Lesson ' + IR.kidLesson(path[i].lesson) };
    }
    const last = path[path.length - 1];
    return { href: last.href, sub: 'Unit ' + last.unit + ' \u00b7 Lesson ' + IR.kidLesson(last.lesson) };
  }
  function continueButton() {
    const go = continueTarget();
    return h('button', { class: 'zfstart2', type: 'button', 'aria-label': 'Continue. ' + go.sub, onclick: () => { Snd.stop(); location.hash = go.href; } },
      h('span', { class: 'zfst' }, h('b', null, 'Continue'), h('small', null, go.sub)));
  }
  function openKidPicker() {
    const pics = IR.KID_PICS || {};
    let pic = 'zip';
    const name = h('input', { class: 'kidname', type: 'text', maxlength: '16', placeholder: 'First name', 'aria-label': 'First name' });
    const choices = h('div', { class: 'kidpics' }, ...Object.keys(pics).map((key) => {
      const b = h('button', { class: 'kidpic' + (key === pic ? ' on' : ''), type: 'button', 'aria-label': key }, h('img', { src: IR.kidPic(key), alt: '' }));
      b.addEventListener('click', () => {
        pic = key;
        [...choices.children].forEach((el) => el.classList.toggle('on', el === b));
      });
      return b;
    }));
    const add = h('button', { class: 'btn big primary', type: 'button' }, 'Add this child');
    add.addEventListener('click', () => {
      if (!IR.addKid(name.value, pic)) { toast('Type a first name.'); return; }
      modalRoot.innerHTML = '';
      location.hash = '#/home';
      route();
    });
    const list = IR.kidList().map((kid) => h('button', {
      class: 'btn big' + (kid.active ? ' primary' : ''),
      type: 'button',
      onclick: () => { IR.useKid(kid.id); modalRoot.innerHTML = ''; location.hash = '#/home'; route(); }
    }, h('img', { src: IR.kidPic(kid.pic), alt: '', width: 36, height: 36 }), ' ' + kid.name));
    openModal(h('div', { class: 'kidpick' }, h('h2', null, 'Who is reading?'), ...list, h('h3', null, 'Add a child'), name, choices, add));
  }
  function kidChip() {
    const cur = IR.kidList().filter((kid) => kid.active)[0] || { name: 'My reader', pic: 'zip' };
    return h('button', { class: 'kidchip', type: 'button', 'aria-label': 'Switch child. ' + cur.name, onclick: openKidPicker },
      h('img', { src: IR.kidPic(cur.pic), alt: '' }), h('span', null, cur.name));
  }
  function openKidReport() {
    const rows = IR.kidList().map((kid) => h('p', null, kid.name + ': ' + IR.kidActivityCount(kid.id) + ' done'));
    const dl = h('button', { class: 'btn big', type: 'button' }, 'Download CSV');
    dl.addEventListener('click', () => {
      const blob = new Blob([IR.progressCsv()], { type: 'text/csv' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'island-readers-progress.csv' });
      document.body.append(a); a.click(); a.remove();
    });
    openModal(h('div', null, h('h2', null, 'Student progress'), ...rows, dl));
  }
  function homeScreen() {
    const S = IR.S(); IR.newScreen();
    const complete = islandDone('i3'); const earned = gemsEarned(); const nEarned = earned.filter(Boolean).length; const nx = gemNext();
    const head = h('header', { class: 'mhead' }, h('h1', null, 'Island Readers'), IR.ui.gearButton());
    const strip = h('button', { class: 'gemstrip', type: 'button', 'aria-label': 'Gem box: ' + nEarned + ' of 10 gems. Opens the gem box.', onclick: () => { Snd.stop(); location.hash = '#/gems'; } },
      h('span', { class: 'gslab' }, 'Gem box \u00b7 ' + nEarned + ' of 10'),
      h('span', { class: 'gsrow' }, ...GEMS.map((g, i) => h('span', { class: 'gs' + (earned[i] ? ' got' : i === nx ? ' next' : '') }, earned[i] || i === nx ? h('img', { src: gemSrc(i), alt: '' }) : null))));
    /* Nov 3 2026: 22-unit plan tiles (approved mockup home_tiles_part1/2). Built: Unit 4 Glued Sounds = island data 'i3' (#/island3). */
    const TILES = [null,
      ['Short Vowels & Floss', 'a e i o u \u00b7 ff ll ss', 4, ['gong']], ['Blends', 'bl \u00b7 st \u00b7 tr \u00b7 -nd \u00b7 -mp', 4, ['red']],
      ['Digraphs', 'sh \u00b7 ch \u00b7 th \u00b7 wh \u00b7 ck', 2, ['coral']], ['Glued Sounds', 'ng \u00b7 nk', 3, ['orange']],
      ['Silent e', 'a_e \u00b7 i_e \u00b7 o_e \u00b7 u_e', 2, ['yellow']], ['Endings', '-s \u00b7 -es \u00b7 -ed \u00b7 -ing', 3, ['green']],
      ['Syllables', 'closed \u00b7 open', 3, ['lblue']], ['Tricky Sounds', 'tch \u00b7 dge \u00b7 -ild \u00b7 -old', 3, ['dblue']],
      ['Bossy R', 'ar \u00b7 or \u00b7 er \u00b7 ir \u00b7 ur', 4, ['purple']], ['More Bossy R', 'air \u00b7 are \u00b7 ear', 2, ['pink']],
      ['Long A & E Teams', 'ai \u00b7 ay \u00b7 ee \u00b7 ea \u00b7 ey', 2, ['silver']], ['Long O & I Teams', 'oa \u00b7 ow \u00b7 oe \u00b7 ie \u00b7 igh', 3, ['red', 'red']],
      ['The oo Sounds', 'oo \u00b7 ew \u00b7 ui \u00b7 ue', 4, ['coral', 'coral']], ['The au Sounds', 'au \u00b7 aw \u00b7 augh \u00b7 ea', 2, ['orange', 'orange']],
      ['Sliding Vowels', 'oi \u00b7 oy \u00b7 ou \u00b7 ow', 3, ['yellow', 'yellow']], ['Tricky Teams', 'ei \u00b7 eigh \u00b7 ew \u00b7 ough', 3, ['green', 'green']],
      ['Soft c and g', 'soft c \u00b7 soft g', 1, ['lblue', 'lblue']], ['Silent Letters', 'kn \u00b7 wr \u00b7 mb \u00b7 gn \u00b7 gh', 2, ['dblue', 'dblue']],
      ['Suffixes', '-er \u00b7 -est \u00b7 -ly \u00b7 -ful', 6, ['purple', 'purple']], ['Suffix Spelling Rules', 'double \u00b7 drop e \u00b7 y to i', 4, ['pink', 'pink']],
      ['Prefixes', 'un- \u00b7 pre- \u00b7 re- \u00b7 dis-', 5, ['rainbow']], ['Big Endings', '-tion \u00b7 -ture \u00b7 -ment', 6, ['gold']]];
    const BUILT = 4, BUILT_ID = 'i3';
    const place = trailPlace();
    const atFoundations = continueTarget().href.indexOf('#/foundation') === 0;
    const hereUnit = atFoundations ? 0 : place.here;
    const ledgesHome = !/[?&]home=zigzag\b/.test(location.search);
    const coilSide = (n) => (n % 2 === 1 ? 'r' : 'l');
    /* Paint Zip and Frill into the island daylight: drop the studio edge, warm the light, and leave no halo. */
    function paintIntoScene(img, done) {
      const paint = () => {
        const w = img.naturalWidth, ht = img.naturalHeight;
        if (!w || !ht || img.dataset.painted) { if (done) done(); return; }
        img.dataset.painted = '1';
        const scale = Math.min(1, 420 / w);
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(w * scale));
        c.height = Math.max(1, Math.round(ht * scale));
        const g = c.getContext('2d', { willReadFrequently: true });
        if (!g) { if (done) done(); return; }
        g.drawImage(img, 0, 0, c.width, c.height);
        const frame = g.getImageData(0, 0, c.width, c.height);
        const p = frame.data;
        const W = c.width, H = c.height;
        const N = W * H;
        const cream = (i) => {
          const r = p[i], gg = p[i + 1], b = p[i + 2], a = p[i + 3];
          if (a < 16) return true;
          const light = r > 214 && gg > 206 && b > 186;
          const pale = r > 196 && gg > 188 && b > 170 && (r - b) < 70 && Math.abs(r - gg) < 36;
          return light || pale;
        };
        const seen = new Uint8Array(N);
        const qx = new Int16Array(N);
        const qy = new Int16Array(N);
        let qs = 0, qe = 0;
        const seed = (x, y) => {
          const k = y * W + x;
          if (seen[k] || !cream(k * 4)) return;
          seen[k] = 1;
          qx[qe] = x; qy[qe] = y; qe++;
        };
        for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
        for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }
        while (qs < qe) {
          const x = qx[qs], y = qy[qs]; qs++;
          p[(y * W + x) * 4 + 3] = 0;
          if (x > 0) seed(x - 1, y);
          if (x + 1 < W) seed(x + 1, y);
          if (y > 0) seed(x, y - 1);
          if (y + 1 < H) seed(x, y + 1);
        }
        /* Drop only the studio backdrop. Do not erode or recolor, or Frill's wavy foot becomes legs. */
        g.putImageData(frame, 0, 0);
        img.src = c.toDataURL('image/png');
        if (done) done();
        return;
        const solid = new Uint8Array(N);
        for (let i = 0; i < N; i++) solid[i] = p[i * 4 + 3] > 20 ? 1 : 0;
        const eroded = new Uint8Array(N);
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            let ok = 1;
            for (let dy = -2; dy <= 2 && ok; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                const xx = x + dx, yy = y + dy;
                if (xx < 0 || yy < 0 || xx >= W || yy >= H || !solid[yy * W + xx]) { ok = 0; break; }
              }
            }
            eroded[y * W + x] = ok;
          }
        }
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const k = y * W + x;
            const i = k * 4;
            if (!eroded[k]) { p[i + 3] = 0; continue; }
            let r = p[i], gg = p[i + 1], b = p[i + 2];
            const lum = r * 0.3 + gg * 0.52 + b * 0.18;
            r = r * 0.72 + lum * 0.28;
            gg = gg * 0.72 + lum * 0.28;
            b = b * 0.72 + lum * 0.28;
            r = r * 0.9 + 138 * 0.1;
            gg = gg * 0.9 + 128 * 0.1;
            b = b * 0.9 + 112 * 0.1;
            r = r * 0.93 + 255 * 0.07;
            gg = gg * 0.95 + 232 * 0.05;
            b = b * 0.9 + 196 * 0.05;
            let edge = 0;
            for (let dy = -1; dy <= 1 && !edge; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const xx = x + dx, yy = y + dy;
                if (xx < 0 || yy < 0 || xx >= W || yy >= H || !eroded[yy * W + xx]) edge = 1;
              }
            }
            if (edge && x < W * 0.72) {
              const rim = 0.28 * (1 - x / (W * 0.72)) * (0.55 + 0.45 * (1 - y / H));
              r = r * (1 - rim) + 255 * rim;
              gg = gg * (1 - rim) + 236 * rim;
              b = b * (1 - rim) + 206 * rim;
            }
            p[i] = r < 0 ? 0 : r > 255 ? 255 : r;
            p[i + 1] = gg < 0 ? 0 : gg > 255 ? 255 : gg;
            p[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
            p[i + 3] = 255;
          }
        }
        let minX = W, minY = H, maxX = 0, maxY = 0;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            if (!eroded[y * W + x]) continue;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
        g.putImageData(frame, 0, 0);
        if (maxX > minX && maxY > minY) {
          const cut = document.createElement('canvas');
          cut.width = maxX - minX + 1;
          cut.height = maxY - minY + 1;
          cut.getContext('2d').drawImage(c, minX, minY, cut.width, cut.height, 0, 0, cut.width, cut.height);
          img.onload = null;
          img.src = cut.toDataURL('image/png');
        } else {
          img.onload = null;
          img.src = c.toDataURL('image/png');
        }
        if (!done) return;
        if (img.complete && img.naturalWidth) done();
        else img.addEventListener('load', done, { once: true });
      };
      if (img.complete && img.naturalWidth) paint();
      else img.addEventListener('load', paint, { once: true });
    }
    const GEMN = ['ruby', 'coral', 'amber', 'topaz', 'emerald', 'aquamarine', 'sapphire', 'amethyst', 'rosequartz', 'gold'];
    function skyStop(opts) {
      const gem = opts.done && opts.n
        ? h('img', { class: 'skygem', src: 'img/gem_' + String(((opts.n - 1) % 10) + 1).padStart(2, '0') + '_' + GEMN[(opts.n - 1) % 10] + '.webp', alt: '' })
        : null;
      const b = h('button', {
        class: 'tcard skystop sky-' + opts.side + (opts.here ? ' is-here t-current' : '') + (opts.soon ? ' is-soon' : '') + (opts.done ? ' is-done' : ''),
        type: 'button',
        'data-id': opts.id,
        'data-kind': 'island',
        'data-n': opts.n,
        title: opts.title,
        'aria-label': opts.label
      },
        h('span', { class: 'skybody' },
          h('img', { class: 'skyisland', src: opts.img, alt: '', loading: opts.lazy ? 'lazy' : 'eager' })),
        h('span', { class: 'skylbl' },
          h('span', { class: 'thead' },
            opts.dots && opts.dots.length ? h('span', { class: 'tdots', 'aria-hidden': 'true' }, ...opts.dots.map((c) => h('i', { class: 'tdot td-' + c }))) : null,
            h('b', { class: 'tnum' }, opts.kicker),
            opts.soon ? h('span', { class: 'skylock', 'aria-hidden': 'true' }, icon('lock')) : null),
          h('span', { class: 'tname' }, opts.name),
          opts.sounds ? h('span', { class: 'tsnd' }, opts.sounds) : null,
          opts.count ? h('span', { class: 'tcount' }, opts.count) : null),
        gem);
      b.addEventListener('click', opts.onclick);
      return b;
    }
    const unit = (n) => {
      const t = TILES[n]; const isl = n === BUILT && !!(D.islands || {})[BUILT_ID];
      const u5 = n === 5 && !!IR.u5Route;   /* Nov 3 2026 local: Unit 5 Silent e is open (js/u5.js: same lesson flow as Unit 4; picker data islands.i5) */
      const u6 = n === 6 && !!IR.u6Route;   /* Unit 6 Endings (-s, -es, -ed, -ing), same lesson flow as Unit 4 */
      const u123 = n <= 3 && !!IR.u123Route;   /* Nov 27 2026: Units 1 to 3 (js/u123.js), same lesson flow as Units 5 and 6 */
      const u789 = n >= 7 && n <= 9 && !!IR.u789Route;   /* Nov 27 2026: Units 7 to 9 (js/u789.js), same lesson flow as Units 1 to 3 */
      const hop = builtUnitHref(n);
      const built = isl || u5 || u6 || u123 || u789 || !!hop;
      const st = !built ? 'soon' : n === hereUnit ? 'here' : (place.finished[n] ? 'done' : 'open');
      const note = st === 'here' ? 'You are here' : st === 'done' ? 'Done' : st === 'open' ? 'Open' : 'Coming soon';
      const label = 'Unit ' + n + ': ' + t[0] + ', ' + t[1].replace(/\u00b7/g, ',') + ', ' + t[2] + (t[2] === 1 ? ' lesson. ' : ' lessons. ') + note + (built ? '. Opens Unit ' + n + '.' : '.') + (st === 'here' ? ' Zip and Frill are here.' : '');
      return skyStop({
        id: 'u' + n,
        n: n,
        side: coilSide(n),
        here: st === 'here',
        soon: st === 'soon',
        done: st === 'done',
        img: 'img/sky/stops/u' + String(n).padStart(2, '0') + '.webp', /* painted from img/units/tile */
        lazy: n > 8,
        kicker: 'Unit ' + n,
        name: t[0],
        sounds: t[1],
        count: t[2] + (t[2] === 1 ? ' lesson' : ' lessons'),
        dots: t[3],
        title: 'Unit ' + n + ': ' + t[0],
        label: label,
        onclick: () => { if (hop) { Snd.stop(); location.hash = hop; } else if (u123 || u789) { Snd.stop(); location.hash = '#/u' + n; } else if (u6) { Snd.stop(); location.hash = '#/u6'; } else if (u5) { Snd.stop(); location.hash = '#/u5'; } else if (isl) openIsland(BUILT_ID); else { Snd.stop(); toast('Unit ' + n + ' is coming soon.'); } }
      });
    };
    const coverSrc = 'foundation/img/foundations_cover.jpg';
    const foundations = skyStop({
      id: 'foundations',
      n: 0,
      side: coilSide(0),
      here: atFoundations,
      img: 'img/sky/stops/f.webp', /* painted from coverSrc, foundation/img/foundations_cover.jpg */
      kicker: 'Foundations',
      name: 'Learn the letters',
      title: 'Foundations: Learn the letters',
      label: 'Foundations. Learn the letters. Opens Foundation Skills.' + (atFoundations ? ' You are here. Zip and Frill are here.' : ''),
      onclick: () => { Snd.stop(); location.hash = '#/foundation'; }
    });
    const cards = [foundations];
    for (let n = 1; n <= 22; n++) cards.push(unit(n));
    const BOOK = '<svg viewBox="0 0 140 110" class="bookpic" aria-hidden="true"><ellipse cx="70" cy="102" rx="46" ry="7" fill="#2b2540" opacity=".14"/><ellipse cx="48" cy="96" rx="22" ry="6" fill="#fff" opacity=".85"/><ellipse cx="70" cy="94" rx="26" ry="7" fill="#fff"/><ellipse cx="94" cy="96" rx="20" ry="6" fill="#fff" opacity=".8"/><path d="M18 20h46c7 8 14 11 20 12v60c-6-2-13-5-20-11H18z" fill="#f4ead8" stroke="#7a5230" stroke-width="2.4" stroke-linejoin="round"/><path d="M122 20H76c-7 8-14 11-20 12v60c6-2 13-5 20-11h46z" fill="#c4552a" stroke="#7a3218" stroke-width="2.4" stroke-linejoin="round"/><path d="M70 32v50" stroke="#7a5230" stroke-width="2.2"/><path d="M82 38h26M82 48h20M82 58h24" stroke="#f8e6d0" stroke-width="2.4" stroke-linecap="round"/></svg>';
    const library = h('button', {
      class: 'skybook',
      type: 'button',
      'aria-label': 'Library. Opens the Library.',
      onclick: () => { Snd.stop(); location.hash = '#/library'; }
    }, h('span', { class: 'skybookart', html: BOOK, 'aria-hidden': 'true' }), h('b', null, 'Library'));
    const NS = 'http://www.w3.org/2000/svg';
    const pathSvg = document.createElementNS(NS, 'svg');
    pathSvg.setAttribute('class', 'skypath');
    pathSvg.setAttribute('aria-hidden', 'true');
    const skyfar = ledgesHome ? h('div', { class: 'skyfar', 'aria-hidden': 'true' }) : null;
    const trailBits = [skyfar, pathSvg, library].concat(cards).filter(Boolean);
    const zipImg = h('img', { class: 'skyfigpic', alt: '', src: 'img/zipA.webp' });
    const frillImg = h('img', { class: 'skyfigpic', alt: '', src: 'img/zip-show/frill-glide.webp' });
    const tuft = () => h('img', { class: 'skygrass', alt: '', src: 'img/sky/grass_tuft.webp' });
    const zipFig = h('div', { class: 'skyfig zip is-painting' }, h('span', { class: 'skyshade', 'aria-hidden': 'true' }), zipImg, tuft());
    const frillFig = h('div', { class: 'skyfig frill is-painting' }, h('span', { class: 'skyshade', 'aria-hidden': 'true' }), frillImg, tuft());
    const walkers = h('div', { class: 'skywalk', 'aria-hidden': 'true' }, zipFig, frillFig);
    if (!ledgesHome) trailBits.push(walkers);
    const grid = h('div', { class: 'bellpath skytrail', id: 'skymap' }, ...trailBits);
    const tab = (href, name, icoName) => h('a', { class: 'hometab', href: href, 'aria-label': name },
      h('span', { class: 'hometab-ico', 'aria-hidden': 'true' }, icon(icoName)),
      h('span', { class: 'hometab-name' }, name));
    IR.resetSideGroup('home');
    const aboutDrop = IR.sideDrop({
      group: 'home',
      label: 'About Island Readers',
      ico: 'info',
      tabClass: 'btn big aboutbtn',
      extraClass: 'about-drop',
      fill(body) { aboutNodes().forEach((node) => body.append(node)); }
    });
    const trailBtn = h('button', {
      class: 'hometab trailtab',
      type: 'button',
      'aria-label': 'Trail Map and Placement Test',
      onclick: () => openTrailMap()
    }, h('span', { class: 'hometab-ico', 'aria-hidden': 'true' }, icon('map')), h('span', { class: 'hometab-name' }, 'Trail Map and Placement Test'));
    const sightDrop = IR.sideDrop({
      group: 'home',
      label: 'Sight Word Practice',
      ico: 'star',
      fill(body) {
        for (let n = 1; n <= 4; n++) {
          body.append(h('button', { class: 'drop-link', type: 'button', onclick: () => { Snd.stop(); location.hash = '#/chest' + n; } }, 'Sight words ' + n + '. Units ' + (2 * n - 1) + ' and ' + (2 * n)));
        }
        body.append(h('p', { class: 'drop-soon' }, 'Units 9 and 10 come later.'));
      }
    });
    const booksBtn = h('button', {
      class: 'homebook', type: 'button', 'aria-label': 'Library. Open every book.',
      onclick: () => { Snd.stop(); location.hash = '#/library'; }
    }, h('span', { class: 'homebook-art', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')), h('span', { class: 'homebook-name' }, 'Library'));
    const tabs = h('nav', { class: 'hometabs', 'aria-label': 'More places' },
      booksBtn, trailBtn, sightDrop, tab('#/find', 'Find It', 'search'));
    /* Nov 6 2026: full-width home feature (approved banyan scene), then About + the hero beside the unit grid */
    const banner = h('header', { class: 'hbanner' }, h('h1', null, 'Island Readers'), kidChip(),
      h('div', { class: 'grownwrap' }, h('span', { class: 'grownlab' }, 'Parent and Teacher Materials'), IR.ui.gearButton()));
    /* Read-aloud for the hero text: HOME_INTRO_AUDIO recording if set, else speechSynthesis. Tap again to stop. */
    function readAloudBtn() {
      const TEXT = 'Learn to read with Zip and Frill. Ring every bell by learning its sounds. Start here to find your first bell.';
      const HOME_INTRO_AUDIO = 'audio/home_intro.mp3'; /* Zip's lesson voice (edge-tts en-US-RogerNeural +0%); browser speech is only a fallback */
      const b = h('button', { class: 'zfspk', type: 'button', 'aria-label': 'Read aloud', 'aria-pressed': 'false' }, icon('speaker'));
      let au = null, on = false;
      const set = (v) => { on = v; b.classList.toggle('playing', v); b.setAttribute('aria-pressed', v ? 'true' : 'false'); b.textContent = ''; b.append(icon(v ? 'pause' : 'speaker')); };
      const stop = () => { if (au) { au.pause(); au.currentTime = 0; } try { speechSynthesis.cancel(); } catch (e) {} set(false); };
      const speak = () => { try { const u = new SpeechSynthesisUtterance(TEXT); u.lang = 'en-US'; u.rate = 0.9; const v = speechSynthesis.getVoices().find((x) => x.lang === 'en-US'); if (v) u.voice = v; u.onend = u.onerror = () => set(false); speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { set(false); } };
      b.addEventListener('click', async () => {
        if (on) { stop(); return; }
        try { Snd.stop(); } catch (e) {}
        set(true);
        const src = HOME_INTRO_AUDIO;
        if (src) { let fell = false; const fb = () => { if (fell || !on) return; fell = true; speak(); }; if (!au) { au = new Audio(src); } au.onended = () => set(false); au.onerror = fb; au.currentTime = 0; au.play().catch(fb); } else speak();
      });
      window.addEventListener('hashchange', stop, { once: true });
      return b;
    }
    /* Home card in the left column. On a phone these controls sit in the bottom bar. */
    const HERO_VARIANT = (/[?&]hero=B\b/.test(location.search) ? 'B' : 'A');
    const hero = h('section', { class: 'homefeature zf' + HERO_VARIANT, 'aria-label': 'Learn to read with Zip and Frill' },
      h('div', { class: 'zfpics' }, h('img', { class: 'homeart', src: 'img/home_zip_frill.webp', width: 1280, height: 720, alt: 'Zip and Frill sit on a tree root reading a book together. An orange bell hangs from the banyan behind them, and the island coast glows at sunset.' })),
      h('div', { class: 'hfbody' },
        h('div', { class: 'zfhead' }, h('h2', { class: 'zfline' }, 'Learn to read with Zip and Frill'), readAloudBtn()),
        h('p', { class: 'zfsub' }, 'Ring every bell by learning its sounds.'),
        continueButton()));
    app.append(h('div', { class: 'screen home mapscreen gridhome bellfit bellspeek skyhome' + (ledgesHome ? ' ledges' : '') }, h('div', { class: 'mwrap' }, banner, h('div', { class: 'homelay' }, h('div', { class: 'homeside' }, aboutDrop, hero, tabs), h('div', { class: 'bellslot' }, grid)))));
    if (ledgesHome) standOnTrail(grid, hereUnit, null, null, null, null, null);
    else standOnTrail(grid, hereUnit, zipFig, frillFig, zipImg, frillImg, paintIntoScene);
    const side = app.querySelector('.homeside'); const scr = app.querySelector('.screen.home');
    let layoutHome = function () {};
    const pin = () => {
      if (!side || !scr || !side.isConnected) { window.removeEventListener('resize', layoutHome); return; }
      const nav = side.querySelector('.hometabs');
      const tabEls = nav ? [...nav.querySelectorAll('.hometab')] : [];
      const heroEl = side.querySelector('.homefeature');
      const pics = side.querySelector('.zfpics');
      const artEl = side.querySelector('.homeart');
      const goBtn = side.querySelector('.zfstart2');
      const relax = () => {
        side.style.removeProperty('height');
        side.style.removeProperty('max-height');
        side.style.removeProperty('overflow-y');
        side.style.removeProperty('gap');
        if (nav) nav.style.removeProperty('gap');
        tabEls.forEach((t) => { t.style.removeProperty('height'); t.style.removeProperty('min-height'); t.style.removeProperty('max-height'); });
        if (artEl) artEl.style.removeProperty('max-height');
        if (pics) { pics.style.removeProperty('max-height'); pics.style.removeProperty('flex-grow'); pics.style.removeProperty('flex-basis'); }
      };
      if (!matchMedia('(min-width:1000px)').matches) { side.style.removeProperty('--side-top'); relax(); return; }
      const bannerEl = scr.querySelector('.hbanner');
      const bannerH = bannerEl ? bannerEl.offsetHeight : 0;
      side.style.setProperty('--side-top', bannerH + 'px');
      const top = side.getBoundingClientRect().top;
      const room = Math.max(200, Math.floor(scr.getBoundingClientRect().bottom - top - 8));
      side.style.height = room + 'px';
      side.style.maxHeight = room + 'px';
      if (artEl) artEl.style.removeProperty('max-height');
      if (pics) { pics.style.removeProperty('max-height'); pics.style.removeProperty('flex-grow'); pics.style.removeProperty('flex-basis'); }
      if (side.querySelector('.sidedrop.is-open')) return;
      const shadow = 4;
      const limits = () => {
        const sideBox = side.getBoundingClientRect();
        const heroBox = heroEl ? heroEl.getBoundingClientRect() : sideBox;
        const viewBottom = Math.min(window.innerHeight, scr.getBoundingClientRect().bottom);
        return { sideBox, heroBox, viewBottom };
      };
      const buttonPast = () => {
        if (!goBtn) return false;
        const btn = goBtn.getBoundingClientRect();
        const box = limits();
        const edge = Math.min(box.heroBox.bottom, box.sideBox.bottom, box.viewBottom);
        return btn.bottom + shadow > edge + 1;
      };
      const sideOverflow = () => side.scrollHeight > side.clientHeight + 2;
      const heroOverflow = () => !!(heroEl && heroEl.scrollHeight > heroEl.clientHeight + 2);
      if (buttonPast() || sideOverflow() || heroOverflow()) {
        side.style.gap = '6px';
        if (nav) nav.style.gap = '6px';
        tabEls.forEach((t) => {
          if (t.classList.contains('trailtab')) return;
          t.style.height = '42px';
          t.style.minHeight = '42px';
          t.style.maxHeight = '42px';
        });
      }
      if (pics && (buttonPast() || heroOverflow())) {
        const btn = goBtn ? goBtn.getBoundingClientRect() : null;
        const box = limits();
        const edge = Math.min(box.heroBox.bottom, box.sideBox.bottom, box.viewBottom);
        const past = btn ? Math.ceil(btn.bottom + shadow - edge) : 0;
        const extra = heroEl ? Math.max(0, heroEl.scrollHeight - heroEl.clientHeight) : 0;
        const cut = Math.max(past, extra);
        if (cut > 1) {
          const next = Math.max(72, Math.round(pics.getBoundingClientRect().height - cut - 2));
          pics.style.flexGrow = '0';
          pics.style.flexBasis = 'auto';
          pics.style.maxHeight = next + 'px';
        }
      }
      const stillTight = buttonPast() || sideOverflow() || heroOverflow();
      if (matchMedia('(max-height:520px)').matches && stillTight) side.style.overflowY = 'auto';
      else side.style.removeProperty('overflow-y');
    };
    layoutHome = () => { pin(); };
    requestAnimationFrame(layoutHome); window.addEventListener('resize', layoutHome);
    const art = side && side.querySelector('.homeart');
    if (art && !art.complete) art.addEventListener('load', layoutHome, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (side && side.isConnected) layoutHome(); });
  }
  /* Zip and Frill stand on the current island. After a unit is completed they walk the path to the next one. */
  function standOnTrail(trail, here, zipFig, frillFig, zipImg, frillImg, paintIntoScene) {
    let layingLedges = false;
    let ledgesAgain = false;
    if (!zipFig) {
      const draw = () => { if (trail.isConnected) layoutPath(); };
      requestAnimationFrame(draw);
      window.addEventListener('resize', () => { if (trail.isConnected) draw(); });
      const islands = [...trail.querySelectorAll('.skyisland')];
      const whenReady = (img) => (img.complete && img.naturalWidth) ? Promise.resolve() : new Promise((res) => {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true });
      });
      islands.forEach((img) => { if (!img.complete) img.addEventListener('load', draw, { once: true }); });
      /* A large island can finish after the first layout and miss that pass, which leaves its sign small. */
      if (islands.some((img) => !img.complete || !img.naturalWidth)) {
        Promise.all(islands.map(whenReady)).then(() => { if (trail.isConnected) draw(); });
      }
      return;
    }
    const WALK_MS = 2000;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STOOD = 'ir_sky_stood';
    let ready = 0;
    const go = () => {
      ready++;
      if (ready < 2 || !trail.isConnected) return;
      requestAnimationFrame(() => {
        placePair();
        zipFig.classList.remove('is-painting');
        frillFig.classList.remove('is-painting');
      });
    };
    paintIntoScene(zipImg, go);
    paintIntoScene(frillImg, go);
    function standAt(stop) {
      const art = stop.querySelector('.skyisland');
      const a = art.getBoundingClientRect();
      const t = trail.getBoundingClientRect();
      const back = stop.classList.contains('sky-b');
      const home = trail.closest('.skyhome');
      const coil = home.classList.contains('spiral');
      const ledges = home.classList.contains('ledges');
      const onRight = stop.classList.contains('sky-r');
      const y = a.top - t.top + a.height * (ledges ? 0.66 : coil ? 0.7 : 0.62);
      const zipR = ledges ? (onRight ? 0.28 : 0.58) : (back ? 0.52 : 0.28);
      const frillR = ledges ? (onRight ? 0.42 : 0.74) : (back ? 0.74 : 0.7);
      return { y: y, zipX: a.left - t.left + a.width * zipR, frillX: a.left - t.left + a.width * frillR, midX: a.left - t.left + a.width * (back ? 0.3 : 0.5) };
    }
    function put(fig, x, y) {
      fig.style.transform = 'translate(' + (x - fig.offsetWidth / 2) + 'px,' + (y - fig.offsetHeight) + 'px)';
    }
    function svgEl(NS, name, attrs) {
      const el = document.createElementNS(NS, name);
      Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
      return el;
    }
    function paintBridges(svg, pts, sagOf, NS) {
      const g = svgEl(NS, 'g', { class: 'skybridges' });
      const curve = (a, b, sag, t) => {
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 + sag, u = 1 - t;
        return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
      };
      const tangent = (a, b, sag, t) => {
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 + sag, u = 1 - t;
        return { x: 2 * u * (cx - a.x) + 2 * t * (b.x - cx), y: 2 * u * (cy - a.y) + 2 * t * (b.y - cy) };
      };
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], sag = sagOf(a, b);
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const n = Math.max(5, Math.round(dist / 13));
        const samples = [];
        for (let s = 0; s <= n; s++) {
          const t = s / n;
          const p = curve(a, b, sag, t);
          const tan = tangent(a, b, sag, t);
          const len = Math.hypot(tan.x, tan.y) || 1;
          samples.push({ x: p.x, y: p.y, nx: -tan.y / len, ny: tan.x / len });
        }
        const rope = (side, width, color) => {
          let d = '';
          samples.forEach((p, k) => {
            const x = (p.x + p.nx * side).toFixed(1), y = (p.y + p.ny * side + 1).toFixed(1);
            d += (k ? ' L ' : 'M ') + x + ' ' + y;
          });
          g.append(svgEl(NS, 'path', { d: d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round' }));
        };
        rope(0, 14, 'rgba(40,26,12,.2)');
        for (let s = 2; s < n - 1; s += 3) {
          const p = samples[s];
          const half = 13;
          const x1 = p.x + p.nx * half, y1 = p.y + p.ny * half;
          const x2 = p.x - p.nx * half, y2 = p.y - p.ny * half;
          const wood = ['#C9954C', '#E2B56A', '#B8833C', '#D6A45A'][s % 4];
          const lip = ['#6E4520', '#8A5A28', '#5C3816', '#7A4E22'][s % 4];
          g.append(svgEl(NS, 'line', { x1: x1.toFixed(1), y1: (y1 + 4).toFixed(1), x2: x2.toFixed(1), y2: (y2 + 4).toFixed(1), stroke: lip, 'stroke-width': 7, 'stroke-linecap': 'round' }));
          g.append(svgEl(NS, 'line', { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1), stroke: wood, 'stroke-width': 6, 'stroke-linecap': 'round' }));
        }
        rope(14, 3.2, '#5A3A1E');
        rope(-14, 3.2, '#5A3A1E');
        rope(14, 1.3, '#F0D7A4');
        rope(-14, 1.3, '#F0D7A4');
      }
      svg.append(g);
    }
    function placeLedgeLabels(stops, narrow) {
      /* A small drop from the seat just under the grass: about 14px on a laptop, less on a phone. */
      const drop = narrow ? 8 : 14;
      const seats = [];
      stops.forEach((el) => {
        const img = el.querySelector('.skyisland');
        const lbl = el.querySelector('.skylbl');
        if (!lbl || !img || !img.naturalWidth) return;
        const fit = fittedArt(el, img);
        const rim = plateauRim(img);
        const rows = islandRows(img);
        if (!rim.ok || !rows) return;
        const grass = rim.fy * img.naturalHeight;
        const scaleX = fit.w / img.naturalWidth;
        const scaleY = fit.h / img.naturalHeight;
        const y0 = Math.round(grass) + 2;
        const y1 = Math.min(img.naturalHeight - 2, Math.round(grass + (img.naturalHeight - grass) * 0.2));
        let best = null;
        for (let y = y0; y <= y1; y += 2) {
          const row = rows[y] || rows[y - 1];
          if (row && (!best || row.w > best.w)) best = row;
        }
        if (!best || best.w < 8) {
          best = {
            min: Math.round(rim.left * img.naturalWidth),
            max: Math.round(rim.right * img.naturalWidth),
            w: Math.max(8, Math.round((rim.right - rim.left) * img.naturalWidth))
          };
        }
        const grassTop = fit.y + grass * scaleY;
        seats.push({
          el: el,
          lbl: lbl,
          img: img,
          fit: fit,
          rows: rows,
          grass: grass,
          scaleX: scaleX,
          scaleY: scaleY,
          grassTop: grassTop,
          imgBottom: fit.y + fit.h,
          rockW: best.w * scaleX,
          room: Math.max(34, fit.y + fit.h - (grassTop + drop) - 2)
        });
        el.dataset.fy = String(rim.fy);
      });
      if (!seats.length) return;
      const bySize = (key) => seats.map((s) => s[key]).sort((a, b) => a - b);
      const rocks = bySize('rockW');
      const rooms = bySize('room');
      /* Skip the two narrowest undersides so one slim island does not shrink every sign. */
      const pick = Math.min(2, rocks.length - 1);
      const median = rocks[Math.floor(rocks.length / 2)];
      const widthCap = Math.round(Math.max(narrow ? 132 : 158, median * 0.9));
      const roomCap = rooms[pick];
      const applySize = (px, boxW) => {
        let maxH = 0;
        let overflow = false;
        seats.forEach((s) => {
          const lbl = s.lbl;
          lbl.style.position = 'absolute';
          lbl.style.boxSizing = 'border-box';
          lbl.style.width = boxW + 'px';
          lbl.style.height = 'auto';
          lbl.style.maxHeight = 'none';
          lbl.style.overflow = 'visible';
          lbl.style.fontSize = px + 'px';
          const hgt = lbl.offsetHeight;
          if (hgt > maxH) maxH = hgt;
          if (lbl.scrollWidth > lbl.clientWidth + 2) overflow = true;
        });
        return { maxH: maxH, overflow: overflow };
      };
      let px = narrow ? 15 : 17;
      let sized = applySize(px, widthCap);
      let guard = 0;
      while ((sized.overflow || sized.maxH > roomCap) && px > 11 && guard < 16) {
        px -= 0.5;
        sized = applySize(px, widthCap);
        guard++;
      }
      /* If the longest line is shorter than the rock, pull the shared box in so the words fill it. */
      let contentW = 0;
      seats.forEach((s) => {
        const head = s.lbl.querySelector('.thead');
        if (head) contentW = Math.max(contentW, head.scrollWidth);
        s.lbl.querySelectorAll('.tname,.tsnd').forEach((n) => {
          const prev = n.style.whiteSpace;
          n.style.whiteSpace = 'nowrap';
          contentW = Math.max(contentW, n.scrollWidth);
          n.style.whiteSpace = prev;
        });
      });
      const boxW = Math.min(widthCap, Math.max(contentW + (narrow ? 12 : 16), Math.round(widthCap * 0.86)));
      if (boxW !== widthCap) sized = applySize(px, boxW);
      const uniformH = sized.maxH;
      seats.forEach((s) => {
        const lbl = s.lbl;
        lbl.style.width = boxW + 'px';
        lbl.style.height = uniformH + 'px';
        lbl.style.fontSize = px + 'px';
        lbl.style.textAlign = 'center';
        lbl.style.alignItems = 'stretch';
        lbl.style.justifyContent = 'flex-start';
        const thead = lbl.querySelector('.thead');
        if (thead) thead.style.justifyContent = 'center';
        let top = Math.round(s.grassTop + drop);
        if (top + uniformH > s.imgBottom - 2) top = Math.round(s.imgBottom - uniformH - 2);
        if (top < s.grassTop + 2) top = Math.round(s.grassTop + 2);
        const mid = Math.min(s.img.naturalHeight - 2, Math.round(s.grass + (top - s.grassTop + uniformH / 2) / s.scaleY));
        const row = s.rows[mid - (mid % 2)] || s.rows[mid - 1];
        const rockLeft = row ? s.fit.x + row.min * s.scaleX : s.fit.x;
        const rockRight = row ? s.fit.x + row.max * s.scaleX : s.fit.x + s.fit.w;
        let left = (rockLeft + rockRight) / 2 - boxW / 2;
        const spare = (rockRight - rockLeft - boxW) / 2;
        if (spare > 0) left = Math.max(rockLeft + 2, Math.min(left, rockRight - boxW - 2));
        lbl.style.left = Math.round(left) + 'px';
        lbl.style.right = 'auto';
        lbl.style.top = top + 'px';
        lbl.style.bottom = 'auto';
        lbl.style.transform = 'none';
      });
    }
    function heightRoom(rowH, narrow, avail) {
      /* Phone islands stay a little under the laptop scale so each span stays a diagonal. */
      return Math.round(Math.min(rowH * (narrow ? 1.16 : 1.62), avail * (narrow ? 0.36 : 0.46)));
    }
    function placeLedges() {
      if (layingLedges) { ledgesAgain = true; return; }
      layingLedges = true;
      try {
      const stops = [...trail.querySelectorAll('.skystop')];
      const book = trail.querySelector('.skybook');
      if (stops.length) {
      const w = trail.clientWidth;
      const narrow = w < 520;
      const sideEl = trail.closest('.skyhome').querySelector('.homeside');
      const fixed = sideEl && getComputedStyle(sideEl).position === 'fixed';
      const limit = fixed ? sideEl.getBoundingClientRect().top : window.innerHeight;
      const avail = Math.max(narrow ? 500 : 620, limit - trail.getBoundingClientRect().top - 8);
      const rowH = Math.round((avail - 12) / (narrow ? 3.15 : 3.48));
      const total = Math.round((stops.length - 1) * rowH + heightRoom(rowH, narrow, avail) + 36);
      trail.style.height = total + 'px';
      stops.forEach((el, i) => {
        const side = i % 2 === 0 ? 'l' : 'r';
        const img = el.querySelector('.skyisland');
        const aspect = img && img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1.15;
        const height = heightRoom(rowH, narrow, avail);
        let width = Math.round(height / aspect);
        width = Math.min(width, Math.round(w * (narrow ? 0.46 : 0.62)));
        el.classList.remove('sky-l', 'sky-r', 'sky-b');
        el.classList.add(side === 'r' ? 'sky-r' : 'sky-l');
        el.dataset.land = String(Math.floor(Math.max(0, i - 1) / 6));
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        el.style.top = Math.round(i * rowH + 6) + 'px';
        /* Foundations keeps the a m s t letters inside the frame.
           On the phone the stops sit farther apart sideways so the span is a diagonal. */
        if (side === 'l') el.style.left = narrow ? '8px' : (i === 0 ? '16px' : '26px');
        else el.style.left = Math.max(narrow ? 8 : 16, Math.round(w - width - (narrow ? 8 : 20))) + 'px';
      });
      placeLedgeLabels(stops, narrow);
      if (book) {
        book.style.position = 'absolute';
        book.style.width = (narrow ? 46 : 58) + 'px';
        book.style.top = '10px';
        book.style.left = 'auto';
        book.style.right = '12px';
        book.style.zIndex = '6';
      }
      }
      } catch (err) { /* a late image can retrigger layout; keep the last good pass */ }
      layingLedges = false;
      if (ledgesAgain) { ledgesAgain = false; placeLedges(); }
    }
    function paintRootBridges(svg, pts, NS) {
      const g = svgEl(NS, 'g', { class: 'skybridges' });
      const defs = svgEl(NS, 'defs', {});
      const filter = svgEl(NS, 'filter', { id: 'rootmist', x: '-40%', y: '-40%', width: '180%', height: '180%' });
      filter.append(svgEl(NS, 'feGaussianBlur', { stdDeviation: '8' }));
      defs.append(filter);
      svg.append(defs);
      const curve = (a, b, sag, t) => {
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 + sag, u = 1 - t;
        return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y };
      };
      const kinds = ['net', 'plank', 'deck', 'lantern'];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const sag = Math.max(28, Math.min(78, Math.abs(b.x - a.x) * 0.22 + 16));
        const kind = kinds[i % 4];
        const n = 16;
        const samples = [];
        for (let s = 0; s <= n; s++) samples.push(curve(a, b, sag, s / n));
        const mid = samples[8];
        g.append(svgEl(NS, 'ellipse', {
          cx: mid.x.toFixed(1), cy: (mid.y - 8).toFixed(1),
          rx: (Math.abs(b.x - a.x) * 0.34).toFixed(1), ry: '26',
          fill: 'rgba(210,224,214,.42)', filter: 'url(#rootmist)'
        }));
      }
      svg.append(g);
    }
    function placePaintedBridges(pts) {
      let canvas = trail.querySelector('.skyrootspans');
      if (!canvas || canvas.tagName !== 'CANVAS') {
        if (canvas) canvas.remove();
        canvas = document.createElement('canvas');
        canvas.className = 'skyrootspans';
        trail.append(canvas);
      }
      const w = trail.clientWidth;
      const hgt = parseInt(trail.style.height, 10) || trail.scrollHeight;
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, hgt);
      canvas.style.width = w + 'px';
      canvas.style.height = hgt + 'px';
      const ctx = canvas.getContext('2d');
      const kinds = ['img/sky/bridges/bridge-vine.webp', 'img/sky/bridges/bridge-net.webp', 'img/sky/bridges/bridge-deck.webp'];
      const paint = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(6, 0, Math.max(0, w - 12), hgt);
        ctx.clip();
        for (let i = 0; i < pts.length - 1; i++) {
          const img = trail._bridgeImgs && trail._bridgeImgs[i % kinds.length];
          if (img && img.complete && img.naturalWidth) hangBridge(ctx, img, pts[i], pts[i + 1], w);
        }
        ctx.restore();
      };
      if (!trail._bridgeImgs) {
        trail._bridgeImgs = kinds.map((src) => {
          const img = new Image();
          img.onload = () => { if (trail.isConnected) paint(); };
          img.src = src;
          return img;
        });
      }
      paint();
    }
    function bridgeInk(img) {
      if (img._ink) return img._ink;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const data = g.getImageData(0, 0, c.width, c.height).data;
      let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
      for (let y = 0; y < c.height; y += 2) {
        for (let x = 0; x < c.width; x += 2) {
          if (data[(y * c.width + x) * 4 + 3] > 24) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      img._ink = { minX, minY, maxX: Math.max(minX + 1, maxX), maxY: Math.max(minY + 1, maxY) };
      return img._ink;
    }
    /* Where the painted island sits inside its box. object-fit is contain, pinned to the bottom. */
    function fittedArt(el, img) {
      const bw = el.clientWidth, bh = el.clientHeight;
      const nw = img && img.naturalWidth, nh = img && img.naturalHeight;
      if (!nw || !nh || !bw || !bh) return { x: 0, y: 0, w: bw || 0, h: bh || 0 };
      const scale = Math.min(bw / nw, bh / nh);
      const w = nw * scale, h = nh * scale;
      return { x: (bw - w) / 2, y: bh - h, w: w, h: h };
    }
    /* Grass rim: the top of the wide plateau, inset so a span meets moss rather than a rock tip or a root. */
    function grassRim(img, onRight) {
      if (!img.complete || !img.naturalWidth) return { fx: onRight ? 0.28 : 0.72, fy: 0.6 };
      if (!img._plateau) {
        const p = plateauRim(img);
        if (p.ok) img._plateau = p;
        else return { fx: onRight ? 0.28 : 0.72, fy: 0.6 };
      }
      const p = img._plateau;
      return { fx: onRight ? p.left : p.right, fy: p.fy };
    }
    function plateauRim(img) {
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const data = g.getImageData(0, 0, w, h).data;
      const runs = [];
      let y0 = h, y1 = 0;
      for (let y = 0; y < h; y += 2) {
        let bestL = 0, bestR = -1, bestLen = 0, runS = -1;
        const stride = y * w * 4;
        for (let x = 0; x < w; x += 2) {
          const op = data[stride + x * 4 + 3] > 48;
          if (op && runS < 0) runS = x;
          if (!op && runS >= 0) {
            const len = x - runS;
            if (len > bestLen) { bestLen = len; bestL = runS; bestR = x - 2; }
            runS = -1;
          }
        }
        if (runS >= 0) {
          const len = w - runS;
          if (len > bestLen) { bestLen = len; bestL = runS; bestR = w - 2; }
        }
        if (bestLen > 0) { if (y < y0) y0 = y; y1 = y; }
        runs.push({ y: y, l: bestL, r: bestR, len: bestLen });
      }
      const span = Math.max(1, y1 - y0);
      let maxl = 1;
      const sm = runs.map((row, i) => {
        let s = 0, n = 0;
        for (let k = Math.max(0, i - 2); k <= Math.min(runs.length - 1, i + 2); k++) { s += runs[k].len; n++; }
        const v = s / n;
        if (v > maxl) maxl = v;
        return v;
      });
      const wide = (i) => runs[i].y > y0 + span * 0.40 && sm[i] > maxl * 0.62;
      let bestSeg = null;
      for (let i = 0; i < runs.length; i++) {
        if (!wide(i)) continue;
        let j = i;
        while (j < runs.length && wide(j)) j++;
        if (!bestSeg || j - i > bestSeg[1] - bestSeg[0]) bestSeg = [i, j];
        i = j - 1;
      }
      if (!bestSeg) return { left: 0.22, right: 0.78, fy: 0.6, ok: false };
      const row = runs[Math.min(bestSeg[1] - 1, bestSeg[0] + 3)];
      const inset = Math.max(8, Math.round(row.len * 0.08));
      return { left: (row.l + inset) / w, right: (row.r - inset) / w, fy: row.y / h, ok: row.len > w * 0.35 };
    }
    function islandRows(img) {
      if (img._rows) return img._rows;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const data = g.getImageData(0, 0, c.width, c.height).data;
      const rows = new Array(c.height);
      for (let y = 0; y < c.height; y += 2) {
        const stride = y * c.width * 4;
        let runS = -1, bestL = 0, bestR = -1, best = 0;
        for (let x = 0; x < c.width; x += 2) {
          const on = data[stride + x * 4 + 3] > 36;
          if (on && runS < 0) runS = x;
          if (!on && runS >= 0) {
            if (x - runS > best) { best = x - runS; bestL = runS; bestR = x - 2; }
            runS = -1;
          }
        }
        if (runS >= 0 && c.width - runS > best) { best = c.width - runS; bestL = runS; bestR = c.width - 2; }
        if (best > 8) {
          const row = { min: bestL, max: bestR, w: best, y: y };
          rows[y] = row;
          if (y + 1 < c.height) rows[y + 1] = row;
        }
      }
      img._rows = rows;
      return rows;
    }
    function hangBridge(ctx, img, a, b, frameW) {
      const left = a.x <= b.x ? a : b;
      const right = a.x <= b.x ? b : a;
      const dx = right.x - left.x;
      const dy = right.y - left.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 18) return;
      const slim = frameW < 520;
      const box = bridgeInk(img);
      const bw = Math.max(1, box.maxX - box.minX);
      const bh = Math.max(1, box.maxY - box.minY);
      let rail = dist * (bh / bw);
      rail = Math.max(slim ? 42 : 54, Math.min(slim ? 68 : 80, rail * (slim ? 0.7 : 0.48)));
      const ang = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(left.x, left.y);
      ctx.rotate(ang);
      /* Shift the end post back onto the grass, so the ropes meet the rim instead of a floating root. */
      const tuck = Math.min(slim ? 36 : 56, dist * 0.16);
      ctx.drawImage(img, box.minX, box.minY, bw, bh, -tuck, -rail * 0.38, dist + tuck * 2, rail);
      ctx.restore();
    }
    function layoutPath() {
      const home = trail.closest('.skyhome');
      const ledges = !!(home && home.classList.contains('ledges'));
      if (ledges) placeLedges();
      const svg = trail.querySelector('.skypath');
      const stops = [...trail.querySelectorAll('.skystop')];
      if (!svg || !stops.length) return;
      const w = trail.clientWidth;
      const hgt = trail.scrollHeight;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + hgt);
      svg.style.width = w + 'px';
      svg.style.height = hgt + 'px';
      const origin = trail.getBoundingClientRect();
      const coil = false;
      const innerEdge = (s) => {
        const art = s.querySelector('.skyisland').getBoundingClientRect();
        const onRight = s.classList.contains('sky-r');
          return {
          x: art.left - origin.left + art.width * (onRight ? 0.34 : 0.66),
          y: art.top - origin.top + art.height * 0.58
        };
      };
      const pts = stops.map((s) => {
        const art = s.querySelector('.skyisland').getBoundingClientRect();
        if (ledges) {
          const onRight = s.classList.contains('sky-r');
          const img = s.querySelector('.skyisland');
          const rim = img && img.naturalWidth ? grassRim(img, onRight) : { fx: onRight ? 0.28 : 0.72, fy: 0.6 };
          const fit = fittedArt(s, img);
          /* Step onto the grass, toward the middle of this island. */
          const inward = onRight ? 6 : -6;
          return {
            x: art.left - origin.left + fit.x + fit.w * rim.fx + inward,
            y: art.top - origin.top + fit.y + fit.h * rim.fy
          };
        }
        if (coil) return { x: art.left - origin.left + art.width * 0.5, y: art.top - origin.top + art.height * 0.7 };
        return innerEdge(s);
      });
      const sagOf = (a, b) => Math.max(46, Math.min(120, Math.abs(b.x - a.x) * 0.42));
      let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        if (coil) {
          const y1 = a.y + (b.y - a.y) * 0.45;
          const y2 = a.y + (b.y - a.y) * 0.72;
          d += ' C ' + (w * 0.5).toFixed(1) + ' ' + y1.toFixed(1) + ', ' + (w * 0.5).toFixed(1) + ' ' + y2.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
        } else {
          const sag = sagOf(a, b);
          d += ' Q ' + ((a.x + b.x) / 2).toFixed(1) + ' ' + ((a.y + b.y) / 2 + sag).toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
        }
      }
      const NS = 'http://www.w3.org/2000/svg';
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (ledges) {
        paintRootBridges(svg, pts, NS);
        placePaintedBridges(pts);
      } else if (!coil) paintBridges(svg, pts, sagOf, NS);
      const line = document.createElementNS(NS, 'path');
      line.setAttribute('class', 'skyline');
      line.setAttribute('d', d);
      const stones = document.createElementNS(NS, 'path');
      stones.setAttribute('class', 'skystones');
      stones.setAttribute('d', d);
      svg.append(line, stones);
      const path = line;
      const len = path.getTotalLength();
      const samples = [];
      for (let dist = 0; dist <= len; dist += 7) {
        const p = path.getPointAtLength(Math.min(dist, len));
        samples.push({ x: p.x, y: p.y });
      }
      trail._stopAt = pts.map((pt) => {
        let best = 0, bd = 1e12;
        for (let i = 0; i < samples.length; i++) {
          const dx = samples[i].x - pt.x, dy = samples[i].y - pt.y, dd = dx * dx + dy * dy;
          if (dd < bd) { bd = dd; best = i; }
        }
        return best;
      });
      trail._samples = samples;
    }
    function pathBetween(fromIndex, toIndex) {
      const samples = trail._samples || [];
      const at = trail._stopAt || [];
      if (!samples.length || at[fromIndex] == null || at[toIndex] == null) return [];
      const a = at[fromIndex], b = at[toIndex];
      const slice = samples.slice(Math.min(a, b), Math.max(a, b) + 1);
      if (a > b) slice.reverse();
      return slice;
    }
    function placePair() {
      layoutPath();
      const stops = [...trail.querySelectorAll('.skystop')];
      const now = stops[here] || stops[0];
      if (!now) return;
      let prev = null;
      try { prev = sessionStorage.getItem(STOOD); } catch (e) { /* storage blocked */ }
      const fromIndex = prev == null ? here : Number(prev);
      const from = stops[fromIndex] || now;
      const hop = prev != null && fromIndex + 1 === here && from !== now;
      const end = standAt(now);
      if (!hop || reduce) {
        put(zipFig, end.zipX, end.y);
        put(frillFig, end.frillX, end.y);
        zipFig.classList.remove('is-walking');
        frillFig.classList.remove('is-walking');
        try { sessionStorage.setItem(STOOD, String(here)); } catch (e) { /* ignore */ }
        return;
      }
      const start = standAt(from);
      const line = pathBetween(fromIndex, here);
      if (line.length < 2) line.push({ x: start.midX, y: start.y }, { x: end.midX, y: end.y });
      /* They keep the drawn pose. A mirror would move the satchel and scarf off model. */
      zipFig.classList.add('is-walking');
      frillFig.classList.add('is-walking');
      const scr = trail.closest('.skyhome');
      if (scr) {
        const y = from.getBoundingClientRect().top - scr.getBoundingClientRect().top + scr.scrollTop;
        scr.scrollTop = Math.max(0, y - 72);
      }
      const t0 = performance.now();
      let finished = false;
      const finish = () => {
        if (finished || !trail.isConnected) return;
        finished = true;
        put(zipFig, end.zipX, end.y);
        put(frillFig, end.frillX, end.y);
        zipFig.classList.remove('is-walking');
        frillFig.classList.remove('is-walking');
        try { sessionStorage.setItem(STOOD, String(here)); } catch (e) { /* ignore */ }
      };
      const step = (nowMs) => {
        if (finished || !trail.isConnected) return;
        const raw = Math.min(1, (nowMs - t0) / WALK_MS);
        const t = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
        const seg = t * (line.length - 1);
        const i = Math.min(line.length - 2, Math.floor(seg));
        const u = seg - i;
        const x = line[i].x + (line[i + 1].x - line[i].x) * u;
        const y = line[i].y + (line[i + 1].y - line[i].y) * u - Math.sin(raw * Math.PI * 3) * 3;
        const spread0 = start.frillX - start.zipX;
        const spread1 = end.frillX - end.zipX;
        const together = 0.46 + 0.54 * (0.5 + 0.5 * Math.cos(raw * Math.PI));
        const spread = (spread0 + (spread1 - spread0) * raw) * together;
        put(zipFig, x - spread / 2, y);
        put(frillFig, x + spread / 2, y);
        if (raw < 1) requestAnimationFrame(step);
        else finish();
      };
      requestAnimationFrame(step);
      setTimeout(finish, WALK_MS + 60);
    }
    const onResize = () => {
      if (!trail.isConnected) { window.removeEventListener('resize', onResize); return; }
      if (zipFig.classList.contains('is-walking')) return;
      layoutPath();
      const stops = [...trail.querySelectorAll('.skystop')];
      const now = stops[here];
      if (!now) return;
      const end = standAt(now);
      put(zipFig, end.zipX, end.y);
      put(frillFig, end.frillX, end.y);
    };
    window.addEventListener('resize', onResize);
    trail.querySelectorAll('.skyisland').forEach((img) => {
      if (!img.complete) img.addEventListener('load', onResize, { once: true });
    });
  }
  function gemScreen() {
    IR.newScreen(); const earned = gemsEarned(); const nEarned = earned.filter(Boolean).length; const nx = gemNext();
    const cells = GEMS.map((g, i) => h('div', { class: 'gcell' + (earned[i] ? ' got' : i === nx ? ' next' : '') },
      h('div', { class: 'gimg' }, h('img', { src: gemSrc(i), alt: earned[i] ? g[1] + ' gem' : '' })),
      h('b', { style: earned[i] || i === nx ? 'color:' + g[2] : '' }, g[1]), h('small', null, 'Unit ' + (i + 1) + (i === nx ? ' \u00b7 next' : ''))));
    app.append(h('div', { class: 'screen gemscreen' }, h('div', { class: 'mwrap' }, h('div', { class: 'gtop' }, pageNav('#/home')),
      h('h1', null, 'Gem box'), h('p', null, nEarned + ' of 10 gems. Pass a Unit Review to earn its gem.'), h('div', { class: 'ggrid' }, ...cells))));
  }


  /* ---------- "In this unit" progress sheet: quiet toggle on every unit screen, collapsed by default ---------- */
  /* The unit in its recommended order, in three groups: Lesson (Meet ng), Story (Story Time), Activities (numbered Activity 1, 2, 3 ...). */
  const GROUPS = [{ id: 'lesson', title: 'Lesson', sub: 'Learn it once', ids: ['intro'] }, { id: 'story', title: 'Story', sub: 'Listen and read along', ids: ['listen'] },
    { id: 'activities', title: 'Activities', sub: 'Play as often as you like', ids: ['hear', 'bells', 'build', 'chain', 'scramble', 'feed', 'sentence', 'story', 'check'] }];
  const OPTIONAL = [];   /* Nov 4 2026: Feed Zip replaced Trace Trail */
  /* one-line tips for grown-ups, shown small under each activity */
  const TIPS = { hear: 'Let your child listen first, then point.', bells: 'Frill says a word. Ring the bell with that word.', build: 'Say the word slowly together.', chain: 'Only one letter changes each time.', scramble: 'Say the word slowly, then find each part.', feed: 'Ask your child to read the word out loud, then feed Zip.', sentence: 'Read the sentence together at the end.', story: 'Reading it 3 times builds fluency.', check: 'Let your child work alone. Just cheer.' };   /* optional extra: not needed to finish the unit, not counted in the total time */
  const GICON = { lesson: 'book', story: 'speaker', activities: 'play' };
  function unitSections() {
    const items = LESSONS.map((L, i) => ({ id: L.id, title: L.title, blurb: L.blurb, href: '#/lesson/' + (i + 1), color: L.color }))
      .concat([{ id: 'check', title: 'Zip\u2019s Check', blurb: '10 quick questions with Zip', href: '#/check', color: '#2b2540' }]);
    items.forEach((r, i) => { r.num = i + 1; r.done = IR.isDone(r.id); r.stars = IR.activityStars(r.id); r.group = GROUPS.find((g) => g.ids.includes(r.id)).id; });
    items.filter((r) => r.group === 'activities').forEach((r, k) => { r.act = k + 1; r.label = 'Activity ' + (k + 1) + ': ' + r.title; });
    items.forEach((r) => { if (!r.label) r.label = r.title; r.min = (D.minutes || {})[r.id] || 3; r.optional = OPTIONAL.includes(r.id); });
    return items;
  }
  const unitComplete = () => unitSections().every((r) => r.done || r.optional);
  IR.unitComplete = unitComplete;
  const nextUp = () => unitSections().find((r) => !r.done && !r.optional) || null;
  function unitButton(currentId) {
    const btn = h('button', { class: 'unitbtn', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-label': 'In this unit: show the lesson map' }, icon('list'), h('span', { class: 'ulab' }, 'In this unit'));
    let open = null;
    function close() { if (!open) return; document.removeEventListener('keydown', open.onKey); open.el.remove(); open = null; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    function show() {
      if (open) return close();
      const secs = unitSections(); let lastG = null; const rows = [];
      secs.forEach((r) => {
        if (r.group !== lastG) { lastG = r.group; rows.push(h('li', { class: 'ugroup', 'aria-hidden': 'true' }, GROUPS.find((g) => g.id === r.group).title)); }
        rows.push(rowFor(r));
      });
      function rowFor(r) {
        const cur = r.id === currentId;
        const status = r.done ? h('span', { class: 'ustar', 'aria-hidden': 'true' }, icon('star')) : cur ? h('span', { class: 'udot', 'aria-hidden': 'true' }, icon('next')) : h('span', { class: 'ucircle', 'aria-hidden': 'true' });
        return h('li', null, h('button', { class: 'urow' + (cur ? ' cur' : '') + (r.done ? ' done' : ''), type: 'button', 'data-id': r.id, 'aria-current': cur ? 'step' : null,
          'aria-label': r.label + ', ' + (r.done ? 'done' : cur ? 'you are here' : 'to do'),
          onclick: () => { Snd.stop(); const same = cur; close(); if (!same) location.hash = r.href; } }, status, h('span', { class: 'ut' }, r.act ? h('span', { class: 'uact' }, 'Activity ' + r.act) : null, r.title)));
      }
      const x = h('button', { class: 'ush-x', type: 'button', 'aria-label': 'Close', onclick: () => close() }, icon('close'));
      const el = h('div', { class: 'usheet-scrim', onclick: (e) => { if (e.target === e.currentTarget) close(); } },
        h('div', { class: 'usheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'In this unit' }, h('div', { class: 'ush-head' }, h('h2', null, 'In this unit'), x), h('ol', { class: 'ush-list' }, ...rows)));
      const onKey = (e) => { if (e.key === 'Escape') close(); };
      document.addEventListener('keydown', onKey); modalRoot.append(el); open = { el, onKey }; btn.setAttribute('aria-expanded', 'true');
      const first = el.querySelector('.urow.cur') || el.querySelector('.urow'); if (first) first.focus();
    }
    btn.addEventListener('click', show);
    return btn;
  }
  /* opening line from Zip and Frill at the top of each unit page (text only, no audio) */
  const UNIT_INTRO = { i3: 'This bell holds ng and nk. Let\u2019s learn them!', i5: 'This bell holds silent e. Let\u2019s learn it!' };
  function unitIntro(id) { const t = UNIT_INTRO[id]; if (!t) return null; return h('p', { class: 'zfintro' }, h('img', { src: 'img/zipA.webp', alt: '' }), h('img', { src: 'img/frill.webp', alt: '' }), h('span', null, t)); }
  IR.unitIntro = unitIntro;
  /* "For teachers" row on the ng and nk lesson pages: her own slides and worksheets, linked (not cached offline). */
  const TEACH = {
    ng: { lesson: 'teachers/ng/Lesson3.1_ng_Slides_Lesson_Notes.pdf', deck: 'teachers/ng/Lesson3.1_ng_Slide_Presentation.pptx', ws: 'teachers/ng/Lesson3.1_ng_Worksheets_Student.pdf', key: 'teachers/ng/Lesson3.1_ng_Worksheets_Answer_Key.pdf' },
    nk: { pack: 'teachers/nk/Lesson3.2_nk_Teacher_Pack.pdf', deck: 'teachers/nk/Lesson3.2_nk_Slide_Presentation.pptx' }
  };
  function teacherRow(u) {
    const t = TEACH[u]; if (!t) return null;
    if (t.pack) return h('div', { class: 'teachrow', role: 'group', 'aria-label': 'For teachers' }, h('span', { class: 'trlab' }, 'For teachers'),
      h('a', { class: 'btn trbtn', href: t.pack, target: '_blank', rel: 'noopener' }, 'Teacher pack (PDF)'),
      h('a', { class: 'trsmall', href: t.deck, download: '' }, 'Editable slides (.pptx)'));
    const link = (href, label, extra) => href ? h('a', Object.assign({ class: 'btn trbtn', href, target: '_blank', rel: 'noopener' }, extra || {}), label) : h('span', { class: 'btn trbtn off', 'aria-disabled': 'true', title: 'Being updated' }, label);
    const ws = h('details', { class: 'trws' }, h('summary', { class: 'btn trbtn' }, 'Worksheets'),
      h('div', { class: 'trmenu' }, h('a', { href: t.ws, target: '_blank', rel: 'noopener' }, 'Student pages (PDF)'), h('a', { href: t.key, target: '_blank', rel: 'noopener' }, 'Answer key (PDF)')));
    return h('div', { class: 'teachrow', role: 'group', 'aria-label': 'For teachers' }, h('span', { class: 'trlab' }, 'For teachers'),
      link(t.lesson, 'Slides lesson'), link(t.deck, 'Slide presentation', { download: '' }), ws);
  }
  IR.teacherRow = teacherRow;
  /* ---------- Unit page (Option A): Lesson + Story boxes on the left, numbered Activities with minutes on the right, total time on top ---------- */
  function goItem(item) {
    return () => {
      Snd.stop();
      if (item.go) item.go();
      else if (item.href) location.hash = item.href;
    };
  }
  function lessonTab(item) {
    const pics = item.imgs && item.imgs.length ? item.imgs : (item.img ? [item.img] : []);
    const stars = item.stars;
    return h('button', {
      class: 'tapcard ucard open lessontab' + (item.tone ? ' ' + item.tone : ''),
      type: 'button',
      'aria-label': (item.kicker || 'Lesson') + '. ' + item.title + '. Opens the lesson.',
      onclick: goItem(item)
    },
      h('div', { class: 'uimg' }, ...pics.map((src) => h('img', { src: src, alt: item.alt || '' }))),
      h('div', { class: 'ubody' },
        h('div', { class: 'uk' }, item.kicker || 'Lesson'),
        h('h2', null, item.title),
        item.note ? h('div', { class: 'umin' }, item.note) : null,
        stars && stars.total ? h('div', { class: 'dots', 'aria-hidden': 'true' }, ...Array.from({ length: stars.total }, (_, k) => h('span', { class: 'sstar' + (k < stars.done ? ' on' : '') }, icon('star')))) : null,
        stars && stars.total ? h('div', { class: 'uprog' }, stars.done + ' of ' + stars.total + ' stars') : null,
        h('span', { class: 'obtn' }, item.goLabel || 'Open lesson')));
  }
  const GAME_ICON = {
    hear: 'hear.svg', bells: 'bell.svg', build: 'build.svg', chain: 'chain.svg', scramble: 'scramble.svg',
    feed: 'zip.svg', sentence: 'bridge.svg', story: 'read.svg', read: 'read.svg', check: 'check.svg',
    fish: 'fish.svg', sort: 'shortlong.svg', mage: 'magic.svg', ngnk: 'choice.svg', rhyme: 'rhyme.svg',
    comp: 'storycheck.svg', review: 'review.svg'
  };
  const GAME_ICON_TITLE = {
    'Add the ending': 'addend.svg',
    'Tap each word that has an ending': 'tapend.svg',
    'Match the word': 'matchword.svg',
    'Short or Long': 'shortlong.svg',
    'Magic e Boxes': 'magic.svg',
    'e or no e?': 'choice.svg',
    've or me?': 'choice.svg',
    'Story Check': 'storycheck.svg',
    'Rhyme Time': 'rhyme.svg',
    'Rhyme Call': 'rhyme.svg',
    'Letter review': 'review.svg',
    'Ring every bell': 'bell.svg',
    'Ring every bell and learn its sounds': 'bell.svg'
  };
  function gamePicture(item) {
    const href = String(item.href || '');
    if (item.title === 'Word Chains' && href.indexOf('#/u6/') === 0) return 'foundation/img/games/icons/chain-end.svg';
    const titled = GAME_ICON_TITLE[item.title];
    if (titled) return 'foundation/img/games/icons/' + titled;
    const id = item.id || String(item.href || '').split('/').filter(Boolean).pop() || '';
    return GAME_ICON[id] ? 'foundation/img/games/icons/' + GAME_ICON[id] : '';
  }
  function itemCard(item, num) {
    if (!num && item.pick) return lessonTab(item);
    const pic = item.img || (num ? gamePicture(item) : '');
    const body = [
      num ? h('span', { class: 'gamenum' }, String(num)) : null,
      num ? h('span', { class: 'gameico', 'aria-hidden': 'true' }, icon('play')) : null,
      item.imgs && item.imgs.length
        ? h('span', { class: 'gamepair' }, ...item.imgs.map((src) => h('img', { class: num ? 'gamepic' : 'storypic', src: src, alt: '' })))
        : (pic ? h('img', { class: num ? 'gamepic' : 'storypic', src: pic, alt: item.alt || '' }) : null),
      h('span', { class: 'gametxt' }, h('b', null, item.title), item.note ? h('span', { class: 'gamenote' }, item.note) : null, item.min ? h('span', { class: 'gamemin' }, item.min + ' min') : null),
      item.done ? h('span', { class: 'gamedone', 'aria-hidden': 'true' }, icon(item.doneIcon || 'check')) : null
    ];
    const cls = (item.big ? 'storycard' : (num ? 'gamecard' : 'stepcard')) + (item.done ? ' done' : '');
    if (item.href && item.href.charAt(0) !== '#') return h('a', { class: cls, href: item.href, target: '_blank', rel: 'noopener' }, ...body);
    return h('button', { class: cls, type: 'button', onclick: goItem(item) }, ...body);
  }
  function stepHead(n, label) {
    return h('div', { class: 'stephead' }, h('span', { class: 'stepnum' }, String(n)), h('span', { class: 'steplab' }, label));
  }
  function gameRowsBlock(n, label, rows) {
    let n0 = 0;
    return h('section', { class: 'stepblock gamerowsblock' },
      stepHead(n, label),
      h('div', { class: 'gamerows' }, ...rows.map((row) => {
        const cards = h('ol', { class: 'gamegrid' }, ...row.items.map((item, i) => h('li', null, itemCard(item, n0 + i + 1))));
        n0 += row.items.length;
        return h('div', { class: 'gamerow' }, h('p', { class: 'gamerowlab' }, row.label), cards);
      })));
  }
  function stepSection(n, label, items, numbered, extra) {
    const cards = !items || !items.length
      ? h('p', { class: 'stepsoon' }, 'Coming soon')
      : numbered
        ? h('ol', { class: 'gamegrid' + (extra || '') }, ...items.map((item, i) => h('li', null, itemCard(item, i + 1))))
        : h('div', { class: 'lessonrow' }, ...items.map((item) => itemCard(item)));
    return h('section', { class: 'stepblock' }, stepHead(n, label), cards);
  }
  function slideDays(plan) {
    const raw = plan.days;
    if (typeof raw === 'number') return raw === 1 ? '1 day' : raw + ' days';
    const days = raw || [];
    const count = days.filter((day) => /^Day\s+\d+/i.test(String((day && (day.label || (day.day ? 'Day ' + day.day : ''))) || ''))).length;
    if (count === 1) return '1 day';
    if (count > 1) return count + ' days';
    return 'Slideshow';
  }
  function soonBox(name) {
    return h('button', {
      class: 'teachbox teachslides is-soon',
      type: 'button',
      disabled: true,
      'aria-disabled': 'true',
      'aria-label': name + '. Coming soon'
    }, h('span', { class: 'teachslides-name' }, name), h('span', { class: 'teachslides-sub' }, 'Coming soon'));
  }
  function teacherBox(plan) {
    plan = plan || {};
    const files = plan.files || [];
    const deck = plan.slides || '';
    const wrap = h('div', { class: 'teachcorner' });
    if (deck || plan.pdf) {
      const sub = h('span', { class: 'teachslides-sub' }, slideDays(plan));
      const slides = h('button', {
        class: 'teachbox teachslides',
        type: 'button',
        'aria-label': 'Teacher Slides. ' + sub.textContent
      }, h('span', { class: 'teachslides-name' }, 'Teacher Slides'), sub);
      slides.addEventListener('click', () => {
        Snd.stop();
        if (deck) location.hash = deck;
        else window.open(plan.pdf, '_blank', 'noopener');
      });
      wrap.append(slides);
    } else if (!plan.hideSlides) wrap.append(soonBox('Teacher Slides'));
    if (!files.length) {
      wrap.append(soonBox('Printables'));
      return wrap;
    }
    const list = h('div', { class: 'teachpop teachfiles', hidden: '' },
      ...files.map((file) => h('a', { class: 'teachlink' + (file.small ? ' tmsmall' : ''), href: file.href, target: '_blank', rel: 'noopener' }, file.title)));
    const print = h('button', { class: 'teachbox teachprint', type: 'button', 'aria-expanded': 'false' }, 'Printables');
    function onDoc(e) { if (!wrap.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    function setOpen(open) {
      list.hidden = !open;
      print.setAttribute('aria-expanded', open ? 'true' : 'false');
      print.classList.toggle('is-open', open);
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
      if (open) {
        document.addEventListener('click', onDoc);
        document.addEventListener('keydown', onKey);
      }
    }
    print.addEventListener('click', (e) => { e.stopPropagation(); setOpen(list.hidden); });
    wrap.append(print, list);
    return wrap;
  }
  IR.teacherBox = teacherBox;
  function prepLesson(item) {
    const kick = String(item.kicker || '');
    const generic = !kick || kick === 'Student' || kick === 'Lesson';
    const next = Object.assign({}, item, {
      pick: true,
      tone: 'student',
      kicker: generic ? 'Independent' : kick,
      goLabel: item.goLabel || 'Open lesson'
    });
    if (!next.img && !(next.imgs && next.imgs.length)) next.img = IR.lessonArt || 'img/pick_review.webp';
    next.stars = null;
    return next;
  }
  function prepGame(item) {
    return Object.assign({ doneIcon: 'star' }, item);
  }
  function gamesOf(plan) {
    const listed = plan.gameRows
      ? plan.gameRows.reduce((list, row) => list.concat(row.items || []), [])
      : (plan.games || []);
    return listed.map(prepGame);
  }
  function kidShell(name, on) {
    return h('div', { class: 'ngshellwrap' },
      h('span', { class: 'ngshell' + (on ? ' on' : ''), 'aria-hidden': 'true' }),
      h('span', null, name));
  }
  function modeBar(plan) {
    plan = plan || {};
    const labels = plan.labels || ['Lesson', 'Games', 'Story'];
    let lessons = (plan.lesson || []).filter((item) => item && item.tone !== 'teachled').map(prepLesson);
    if (!lessons.length && plan.choose) lessons = plan.choose.map(prepLesson);
    const games = gamesOf(plan);
    const stories = ((plan.stories && plan.stories.length) ? plan.stories : (plan.story ? [plan.story] : []))
      .filter(Boolean)
      .map((item) => Object.assign({ big: true, doneIcon: 'star', note: item.note || 'Story Time' }, item));
    const shells = [];
    const shellNames = [];
    if (lessons.length) { shells.push(kidShell(labels[0], lessons.every((item) => item.done))); shellNames.push(labels[0]); }
    if (games.length) { shells.push(kidShell(labels[1], games.every((item) => item.done))); shellNames.push(labels[1]); }
    if (stories.length) { shells.push(kidShell(labels[2], stories.every((item) => item.done))); shellNames.push(labels[2]); }
    return h('div', { class: 'ngpath' },
      plan.before || null,
      shells.length ? h('div', { class: 'ngshells', role: 'group', 'aria-label': shellNames.join(', ') }, ...shells) : null,
      lessons.length ? h('section', { class: 'ngstep' },
        stepHead(1, labels[0]),
        h('div', { class: 'lessonrow' }, ...lessons.map((item) => lessonTab(item)))) : null,
      games.length ? h('section', { class: 'ngstep' },
        stepHead(2, labels[1]),
        h('div', { class: 'gamerows' }, h('div', { class: 'gamerow' },
          h('ol', { class: 'gamegrid' + (plan.gameClass || '') }, ...games.map((item, i) => h('li', null, itemCard(item, i + 1))))))) : null,
      stories.length ? h('section', { class: 'ngstep' },
        stepHead(3, labels[2]),
        h('div', { class: 'ngstories' }, ...stories.map((item) => itemCard(item)))) : null);
  }
  IR.modeBar = modeBar;
  function trailScreen() {
    IR.newScreen();
    const secs = unitSections();
    const LK = 'ir_sess_ng'; const prevH = IR._ngHashWas || '';
    if (!/^#\/(island3|lesson\/|check)/.test(prevH)) try { sessionStorage.removeItem(LK); } catch (e) {}
    IR._ngHashWas = location.hash || '#/island3';
    const byId = {};
    secs.forEach((row) => { byId[row.id] = row; });
    function playItem(row) {
      return { id: row.id, title: row.title, href: row.href, done: !!row.done, doneIcon: 'star', alt: row.title };
    }
    const gameGroups = [
      ['Sounds', ['hear', 'bells']],
      ['Words', ['build', 'chain', 'scramble', 'feed']],
      ['Read', ['sentence', 'story', 'check']]
    ];
    const gameRows = gameGroups.map(([label, ids]) => ({
      label: label,
      items: ids.map((id) => byId[id]).filter(Boolean).map(playItem)
    }));
    const lesson = byId.intro;
    const listen = byId.listen;
    app.append(h('div', { class: 'screen trailscreen unitpage unitA orangeunit stepage ngpreview lessonpick' },
      h('header', { class: 'uA-top' }, pageNav('#/home'), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 4 Lesson 1'), 'ng'), teacherBox({
        slides: '#/teachers/slides/ng',
        days: WEEK_DAYS.ng,
        files: [
          { title: 'Daily practice sheets', href: 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf' },
          { title: 'Teacher pack', href: 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf' }
        ]
      })),
      modeBar({
        lesson: [{
          kicker: 'Independent',
          title: lesson ? lesson.title : 'Meet ng',
          img: IR.pickerScene.ng,
          alt: 'Zip and Frill',
          done: !!(lesson && lesson.done),
          go: () => { Snd.stop(); location.hash = lesson ? lesson.href : '#/lesson/1'; }
        }],
        gameRows: gameRows,
        story: {
          title: (D && D.storyTitle) || (listen && listen.title) || 'Story Time',
          note: 'Story Time',
          big: true,
          img: IR.pickerScene.ng,
          alt: (D && D.storyTitle) || 'Story',
          href: listen ? listen.href : '#/lesson/2',
          done: !!(listen && listen.done)
        }
      })));
  }

  /* ---------- lesson shell ---------- */
  function lessonScreen(idx) {
    const L = LESSONS[idx]; if (!L) { location.hash = '#/island3'; return; }
    const scr = IR.newScreen(); const S = IR.S();
    let mistakes = 0; let prog = 0; const totalSteps = LESSONS.length + 1;
    const fill = h('i'); const bar = h('div', { class: 'pbar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100 }, fill,
      ...LESSONS.map((_, k) => h('em', { style: `left:${(k + 1) / totalSteps * 100}%` })));
    const instrText = h('span', { class: 'itext' }); const instrBox = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const starTop = null;
    function setBar() { const v = Math.round(((idx + prog) / totalSteps) * 100); fill.style.width = v + '%'; bar.setAttribute('aria-valuenow', v); }
    const ctx = {
      scr, stage, miss() { mistakes++; },
      progress(f) { prog = Math.max(0, Math.min(1, f)); setBar(); },
      setInstr(text, pid) {
        instrBox.innerHTML = ''; if (!text) { instrBox.style.display = 'none'; return; } instrBox.style.display = '';
        const play = typeof pid === 'function' ? pid : () => Snd.play(A.prompt(String(pid).replace(/^p_/, 'p_')));
        instrBox.append(IR.speakerBtn(play, 'Hear the directions'), h('span', { class: 'itext' }, text));
      },
      finish() { complete(); },
      /* Back: a lesson registers setBack(fn) (fn returns true if it stepped back inside the lesson). Otherwise Back goes to the previous lesson, or the trail from the first one. */
      setBack(fn) { backHandler = fn; },
      goBack() { Snd.stop(); if (backHandler && backHandler()) return; location.hash = idx > 0 ? '#/lesson/' + idx : '#/island3'; },
      /* Next: a lesson may register setNext(fn) (fn returns true if it stepped forward inside the lesson). Otherwise Next SKIPS AHEAD to the next mini lesson (or Zip's Check) and never marks this one complete. */
      setNext(fn) { nextHandler = fn; },
      goNext() { Snd.stop(); if (nextHandler && nextHandler()) return; location.hash = idx === LESSONS.length - 1 ? '#/check' : '#/lesson/' + (idx + 2); },
      setNextLabel(txt) { navApi.label(txt); },
      showNav(on) { nav.classList.toggle('nonext', on === false); if (on === false) nextBtn0.hidden = true; }
    };
    let backHandler = null; let nextHandler = null;
    const nextBtn0 = h('button', { class: 'btn big next', type: 'button', 'aria-label': idx === LESSONS.length - 1 ? 'Next: Zip\u2019s Check' : 'Next lesson', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, nextBtn0);
    const navApi = IR.simpleNav(nav, nextBtn0, () => { Snd.stop(); location.hash = '#/island3'; });
    function complete() {
      const stars = (L.id === 'listen' || L.id === 'intro') ? 3 : mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
      const prev = S.lessons[L.id] || {};
      S.lessons[L.id] = { done: true, stars: Math.max(prev.stars || 0, stars), tries: (prev.tries || 0) + 1 };
      IR.recordActivity(L.id, stars);
      IR.touchStreak(); IR.save();
      const last = idx === LESSONS.length - 1;
      const nextBtn = h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = last ? '#/check' : '#/lesson/' + (idx + 2); } }, last ? 'On to Zip\u2019s Check' : 'Next lesson', icon('next'));
      const backBtn = h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/island3'; } }, icon('back'), 'Back');
      ctx.progress(1);
      const ov = h('div', { class: 'complete' }, h('div', { class: 'cbox' },
        IR.celebration(false),
        h('h1', null, 'Done!'), h('p', { class: 'lead' }, L.title),
        h('div', { class: 'bigstars', 'aria-label': stars + ' stars' }, ...[1, 2, 3].map((k) => icon(k <= stars ? 'star' : 'starOutline', (k <= stars ? 'on' : 'off') + ' k' + k))),
        h('div', { class: 'row' }, backBtn, nextBtn)));
      app.append(ov); Snd.play(A.sfx.done);
    }
    const screen = h('div', { class: 'screen lessonscreen' + (L.id === 'intro' ? ' is-lesson' : ''), style: '--c:' + L.color }, h('header', { class: 'lesson-top' }, pageNav('#/island3'), bar), instrBox, stage, nav);
    app.append(screen);
    if (L.id !== 'intro' && L.id !== 'listen' && L.id !== 'read') IR.attachGameRules(ctx, screen, L.title);
    setBar(); L.run(ctx);
  }

  function checkScreen() {
    const scr = IR.newScreen(); const stage = h('div', { class: 'stage' });
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill); const instrBox = h('div', { class: 'instr' });
    const x = null;
    const ctx = { scr, stage, miss() {}, progress(f) { fill.style.width = Math.round(((LESSONS.length + f) / (LESSONS.length + 1)) * 100) + '%'; }, setInstr(text, pid) { instrBox.innerHTML = ''; instrBox.style.display = text ? '' : 'none'; if (text) instrBox.append(IR.speakerBtn(() => Snd.play(A.prompt(pid)), 'Hear'), h('span', { class: 'itext' }, text)); }, finish() {} };
    let backHandler = null;
    ctx.setBack = (fn) => { backHandler = fn; };
    ctx.goBack = () => { Snd.stop(); if (backHandler && backHandler()) return; location.hash = '#/island3'; };
    let nextHandler = null; ctx.setNext = (fn) => { nextHandler = fn; };
    ctx.goNext = () => { Snd.stop(); if (nextHandler && nextHandler()) return; location.hash = '#/island3'; };
    const checkNext = h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next question', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, checkNext);
    IR.simpleNav(nav, checkNext, () => { Snd.stop(); location.hash = '#/island3'; });
    const screen = h('div', { class: 'screen lessonscreen checkscreen', style: '--c:#2b2540' }, h('header', { class: 'lesson-top' }, pageNav('#/island3'), bar), instrBox, stage, nav);
    app.append(screen);
    IR.attachGameRules(ctx, screen, 'Zip\u2019s Check');
    ctx.progress(0); IR.runCheck(ctx);
  }

  /* Nov 4 2026: session completion lights (reset when a unit menu is opened from outside / closed) */
  const _rec0 = IR.recordActivity; IR.recordActivity = function (id, stars) {
    try { const m = /^(nk_|u5\d_|i3_|lesson)/.exec(id) || /^(\w+)_/.exec(id); const key = id.indexOf('u5') === 0 ? 'ir_sess_' + id.split('_')[0] : id.indexOf('nk_') === 0 ? 'ir_sess_nk' : 'ir_sess_ng';
      const L = JSON.parse(sessionStorage.getItem(key) || '{}'); const sid = id.replace(/^(nk_|u51_|u53_|u5\d_)/, '').replace(/^i3_/, '');
      L[sid] = 1; if (id.indexOf('nk_') === 0) L[id.slice(3)] = 1; sessionStorage.setItem(key, JSON.stringify(L)); } catch (e) {}
    return _rec0.apply(this, arguments);
  };
  IR.ui = { chips, gearButton, homeButton, backButton, pageNav, toast, modalRoot, app };
  /* ---------- Practice pages (Nov 1 2026) ---------- */
  function simplePage(title, ...kids) {
    IR.newScreen();
    app.append(h('div', { class: 'screen home simplepage' }, h('div', { class: 'mwrap' }, h('div', { class: 'gtop' }, pageNav('#/home')), h('h1', null, title), ...kids)));
  }
  /* Same lesson line as the unit pages: "Unit 4 · Lesson 4.1 · ng". The small line is storyTitle from that lesson's data. */
  function fluencyStories() {
    const out = [];
    const lessonName = (name) => { const s = String(name || ''); if (s === 'ng' || s === 'nk' || s.charAt(0) === '-') return s; return /^[a-z]/.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
    const add = (unit, lesson, name, title, href) => out.push({ href, unit: +unit, lessonN: lesson, name: lessonName(name), lesson: 'Unit ' + unit + ' \u00b7 Lesson ' + IR.kidLesson(lesson) + ' \u00b7 ' + lessonName(name), title: title || '' });
    if (Array.isArray(D.story) && D.story.length) {
      const i = LESSONS.findIndex((l) => l.id === 'story');
      if (i >= 0) add('4', '4.1', 'ng', D.storyTitle, '#/lesson/' + (i + 1));
    }
    const nk = window.IR_DATA_NK;
    if (nk && Array.isArray(nk.story) && nk.story.length) add('4', '4.2', 'nk', nk.storyTitle, '#/nk/read');
    const u5 = window.IR_DATA_U5;
    if (u5) Object.keys(u5).map((k) => u5[k]).filter((L) => L && Array.isArray(L.story) && L.story.length).sort((a, b) => String(a.n || a.key).localeCompare(String(b.n || b.key), undefined, { numeric: true })).forEach((L) => {
      add('5', L.n || L.key, L.name || L.title, L.storyTitle, '#/' + (L.key || '') + '/read');
    });
    const u123 = window.IR_DATA_U123;
    if (u123 && Array.isArray(u123.lessons)) u123.lessons.forEach((L) => { if (L && Array.isArray(L.story) && L.story.length) add(String(L.unit), L.n, L.name, L.storyTitle, '#/u' + L.unit + '/' + L.key + '/read'); });
    const u789 = window.IR_DATA_U789;
    if (u789 && Array.isArray(u789.lessons)) u789.lessons.forEach((L) => { if (L && Array.isArray(L.story) && L.story.length) add(String(L.unit), L.n, L.name, L.storyTitle, '#/u' + L.unit + '/' + L.key + '/read'); });
    const u1012 = window.IR_DATA_U1012;
    if (u1012 && Array.isArray(u1012.lessons)) u1012.lessons.forEach((L) => { if (L && Array.isArray(L.story) && L.story.length) add(String(L.unit), L.n, L.name, L.storyTitle, '#/u' + L.unit + '/' + L.key + '/read'); });
    const u6 = window.IR_DATA_U6;
    if (u6 && Array.isArray(u6.lessons)) u6.lessons.forEach((L) => { if (L && Array.isArray(L.story) && L.story.length) add('6', L.n || L.key, L.name, L.storyTitle, '#/u6/' + L.key + '/read'); });
    else if (u6 && Array.isArray(u6.story) && u6.story.length) add('6', '6', u6.name || 'Endings', u6.storyTitle, '#/u6/read');
    return out;
  }
  /* Same open/locked rule as the home map: Units 4, 5, and 6 are open. Earlier and later units are still coming soon. */
  function spellUnitOpen(n) {
    return (n <= 3 && !!IR.u123Route) || n === 4 || (n === 5 && !!IR.u5Route) || (n === 6 && !!IR.u6Route) || (n >= 7 && n <= 9 && !!IR.u789Route) || !!builtUnitHref(n);
  }
  const UNIT_NAMES = [null, 'Short Vowels & Floss', 'Blends', 'Digraphs', 'Glued Sounds', 'Silent e', 'Endings', 'Syllables', 'Tricky Sounds', 'Bossy R', 'More Bossy R', 'Long A & E Teams', 'Long O & I Teams', 'The oo Sounds', 'The au Sounds', 'Sliding Vowels', 'Tricky Teams', 'Soft c and g', 'Silent Letters', 'Suffixes', 'Suffix Spelling Rules', 'Prefixes', 'Big Endings'];
  function skillCatalog() {
    const chests = [1, 2, 3, 4].map((n) => {
      return { unit: n * 2 - 1, lesson: 'Units ' + (n * 2 - 1) + '\u2013' + (n * 2), name: 'Sight words ' + n, title: 'Sight words ' + n, href: '#/chest' + n };
    });
    return IR.collectSkills({
      stories: fluencyStories(),
      spells: IR.spellLessons ? IR.spellLessons() : [],
      ng: IR.LESSONS || [],
      nk: (IR.nk && IR.nk.steps) || [],
      u5: IR.u5Lessons || [],
      u6: IR.u6SkillSteps ? IR.u6SkillSteps() : [],
      u123: IR.u123SkillSteps ? IR.u123SkillSteps() : [],
      u789: IR.u789SkillSteps ? IR.u789SkillSteps() : [],
      u1012: IR.u1012SkillSteps ? IR.u1012SkillSteps() : [],
      chests: chests
    });
  }
  function skillGo(label) {
    if (label === 'Spelling') return 'Spell';
    if (label === 'Fluency' || label === 'Read the story') return 'Read';
    return 'Open';
  }
  function skillButton(it, label) {
    const go = skillGo(it.type || label);
    return h('button', { class: 'spellesson', type: 'button', 'aria-label': label + '. Opens ' + (it.title || label) + '.', onclick: () => { Snd.stop(); location.hash = it.href; } },
      h('span', null, label), h('span', { class: 'su-spell' }, go));
  }
  function skillList(skill) {
    const lockMsg = (n) => n < 4 ? 'Unit ' + n + ' is coming soon in the full app!' : 'Unit ' + n + ' is coming soon.';
    const sight = skill.id === 'sight';
    const nums = sight ? [...new Set(skill.items.map((it) => it.unit))] : Array.from({ length: 22 }, (_, i) => i + 1);
    let opened = nums.filter((n) => (sight ? skill.items.some((it) => it.unit === n && it.href) : spellUnitOpen(n)) && skill.items.some((it) => it.unit === n))[0] || 0;
    const host = h('div', { class: 'spellindex' });
    function render() {
      host.innerHTML = '';
      nums.forEach((n) => {
        const mine = skill.items.filter((it) => it.unit === n);
        const open = sight ? true : spellUnitOpen(n);
        const expanded = open && opened === n;
        const uname = sight && mine[0] ? mine[0].lesson : UNIT_NAMES[n];
        const head = h('button', { class: 'spellunit' + (open ? ' open' : ' soon') + (expanded ? ' on' : ''), type: 'button', 'aria-expanded': open ? String(expanded) : 'false',
          'aria-label': 'Unit ' + n + ', ' + uname + (open ? (expanded ? '. Hide lessons.' : '. Show lessons.') : '. Coming soon.') },
          h('span', { class: 'su-n' }, sight ? '' : 'Unit ' + n),
          h('span', { class: 'su-name' }, sight ? uname : uname),
          open ? h('span', { class: 'su-go', 'aria-hidden': 'true' }, expanded ? 'Hide' : 'Lessons') : h('span', { class: 'su-soon' }, 'Coming soon'));
        if (sight) head.querySelector('.su-n').remove();
        head.addEventListener('click', () => {
          if (!open) { Snd.stop(); toast(lockMsg(n)); return; }
          opened = expanded ? 0 : n;
          render();
        });
        const box = [head];
        if (expanded) {
          const groups = [];
          mine.forEach((it) => {
            const key = String(it.lesson).toLowerCase();
            const label = (String(it.lesson) + ' ' + it.name).replace(/\s+/g, ' ').trim();
            let g = groups.filter((x) => x.key === key)[0];
            if (!g) { g = { key: key, label: label, items: [] }; groups.push(g); }
            else if (/[A-Z]/.test(label) && !/[A-Z]/.test(g.label)) g.label = label;
            g.items.push(it);
          });
          const rows = [];
          if (!groups.length) rows.push(h('p', { class: 'calm small' }, 'Nothing in this unit yet.'));
          const entryLabel = (lessonLabel, it) => {
            const title = it.title || '';
            if (!title || lessonLabel.toLowerCase().indexOf(title.toLowerCase()) >= 0) return lessonLabel;
            return lessonLabel + ' \u00b7 ' + title;
          };
          groups.forEach((g) => {
            if (g.items.length === 1) rows.push(skillButton(g.items[0], entryLabel(g.label, g.items[0])));
            else {
              rows.push(h('p', { class: 'skilllesson' }, g.label));
              g.items.forEach((it) => rows.push(skillButton(it, entryLabel(g.label, it))));
            }
          });
          box.push(h('div', { class: 'spellessons' }, ...rows));
        }
        host.append(h('section', { class: 'spellubox' + (expanded ? ' on' : '') }, ...box));
      });
    }
    render();
    const lead = skill.id === 'spelling'
      ? 'Pick a unit, then a lesson. Each lesson has five spelling steps.'
      : skill.blurb;
    return simplePage(skill.name, h('p', { class: 'calm' }, lead), host);
  }
  function skillHub() {
    const skills = skillCatalog();
    const input = h('input', { class: 'skillsearch', type: 'search', placeholder: 'Search by name or type', 'aria-label': 'Search activities by name or type' });
    const results = h('div', { class: 'skillresults' });
    const tiles = h('div', { class: 'skillgrid' });
    skills.forEach((s) => {
      const card = IR.tapCard({
        className: 'stopcard bigbox skilltile' + (s.soon ? ' soon' : ''),
        label: s.name + (s.soon ? '. Coming soon.' : '. ' + s.items.length + ' activities. Opens ' + s.name + '.'),
        href: '#/practice/skills/' + s.id,
        kids: [
          h('span', { class: 'bkind' }, 'Skill'),
          h('span', { class: 'stxt bbot' }, h('b', null, s.name), h('span', { class: 'smin' }, s.soon ? 'Coming soon' : s.items.length + (s.items.length === 1 ? ' activity' : ' activities'))),
          h('span', { class: 'cardgo' + (s.soon ? ' off' : ''), 'aria-hidden': 'true' }, s.soon ? 'Soon' : 'Open')
        ]
      });
      tiles.append(card);
    });
    function paint() {
      const q = input.value.trim();
      results.innerHTML = '';
      tiles.hidden = !!q;
      if (!q) return;
      const hits = IR.searchSkills(skills, q);
      if (!hits.length) { results.append(h('p', { class: 'calm' }, 'No activities match.')); return; }
      hits.forEach((it) => {
        if (it.soon) { results.append(h('p', { class: 'calm' }, 'Word Families is coming soon.')); return; }
        const label = it.skill + ' \u00b7 Unit ' + it.unit + ' \u00b7 ' + it.lesson + ' ' + it.name + (it.title && it.title !== 'Spelling' ? ' \u00b7 ' + it.title : '');
        results.append(skillButton(it, label));
      });
    }
    input.addEventListener('input', paint);
    return simplePage('Skill Practice', h('p', { class: 'calm' }, 'Choose a skill. Each one opens by unit, then by lesson.'), input, results, tiles);
  }
  function skillScreen(id) {
    if (!id) return skillHub();
    if (id === 'sight') return practiceScreen('sight');
    if (id === 'families') return simplePage('Word Families', h('p', { class: 'calm' }, 'Word Families is coming soon.'));
    const skill = skillCatalog().filter((s) => s.id === id)[0];
    if (!skill) { location.hash = '#/practice/skills'; return; }
    return skillList(skill);
  }
  function practiceScreen(key) {
    if (key === 'sight') {
      const rows = [1, 2, 3, 4].map((n) => {
        const href = '#/chest' + n;
        const words = (D['box' + n] || []).length;
        const st = IR.S()['chest' + n];
        const played = !!(st && st.plays && Object.keys(st.plays).some((id) => st.plays[id] > 0));
        const b = h('button', { class: 'gchest sbox open' + (played ? ' boxcard played' : ' boxcard'), type: 'button', 'data-kind': 'chest', 'data-n': n, 'data-state': played ? 'check' : 'open', 'aria-label': 'Treasure Box ' + n + '. ' + words + ' words. ' + (played ? 'Check.' : 'Open.') },
          h('span', { class: 'boxpic', html: IR.chestSVG(n), 'aria-hidden': 'true' }),
          h('span', { class: 'boxname' }, 'Box ' + n),
          h('span', { class: 'boxcount' }, words + ' words'),
          h('span', { class: 'boxmark' + (played ? ' is-check' : ' is-open'), 'aria-hidden': 'true' }, icon('check')));
        b.addEventListener('click', () => { location.hash = href; });
        return b;
      });
      IR.newScreen();
      app.append(h('div', { class: 'screen simplepage boxpage' }, h('div', { class: 'mwrap' },
        h('div', { class: 'gtop' }, pageNav('#/home')),
        h('h1', null, 'Sight Word Practice'),
        h('p', { class: 'calm' }, 'Tap a box.'),
        h('div', { class: 'chestlist boxgrid' }, ...rows))));
      return;
    }
    if (key === 'fluency') {
      const stories = fluencyStories();
      const cards = stories.map((s) => h('a', { class: 'gchest open fluencycard', href: s.href, 'aria-label': s.lesson + (s.title ? '. ' + s.title : '') },
        h('span', { class: 'fl-lesson' }, s.lesson), s.title ? h('span', { class: 'fl-title' }, s.title) : null));
      return simplePage('Fluency Stories', h('p', { class: 'calm' }, 'Read a story again and again. It gets smoother each time.'),
        h('div', { class: 'chestlist fluencylist' }, ...cards));
    }
    if (key === 'spelling' || key === 'fluency') { location.replace('#/practice/skills/' + key); return; }
    location.hash = '#/home';
  }
  /* ---------- About Island Readers (approved copy, Nov 6 2026) ---------- */
  function aboutNodes() {
    const a = (href, t) => h('a', { href, target: '_blank', rel: 'noopener' }, t);
    const sec = (title, ...kids) => h('section', { class: 'absec' }, h('h2', null, title), ...kids);
    const p = (...k) => h('p', null, ...k);
    const ul = (...items) => h('ul', null, ...items.map((x) => h('li', null, ...[].concat(x))));
    const UNITS = [['1', 'short vowels and floss'], ['2', 'blends'], ['3', 'sh, ch, th, wh, ck'], ['4', 'ng, nk (glued sounds)'], ['5', 'silent e'], ['6', '-s, -es, -ed, -ing'], ['7', 'syllables'], ['8', 'tricky sounds: tch, dge, -ild, -old'], ['9', 'bossy r: ar, or, er, ir, ur'], ['10', 'air, are, ear'], ['11', 'ai, ay, ee, ea, ey'], ['12', 'oa, ow, oe, ie, igh'], ['13', 'oo, ew, ui, ue'], ['14', 'au, aw, augh, ea'], ['15', 'oi, oy, ou, ow'], ['16', 'ei, eigh, ew, ough'], ['17', 'soft c and g'], ['18', 'silent letters: kn, wr, mb, gn, gh'], ['19', 'suffixes: -er, -est, -ly, -ful'], ['20', 'suffix spelling rules'], ['21', 'prefixes: un-, pre-, re-, dis-'], ['22', 'big endings: -tion, -ture, -ment']];
    return [
      h('p', { class: 'ablead' }, 'A guide for families, schools and anyone helping a reader.'),
      sec('Building reading confidence through phonics practice',
        p('Island Readers gives older children a way to revisit the skills they need to become confident readers without being treated like younger learners. Through engaging stories, puzzles and games, the program sparks curiosity and makes reading practice something children want to do.')),
      sec('Background',
        p('I\u2019ve taught special education for over 15 years and have seen many reading programs come and go. My own reading journey began when technology meant a record player, a rotary phone and a television with a turn dial and antenna. The tools have changed, but the importance of clear teaching, meaningful practice and encouragement hasn\u2019t. Island Readers distills the best of what I\u2019ve learned in the classroom into a resource parents can use to support reading practice at home while keeping learning fun.')),
      sec('Foundational skills, not a younger experience',
        p('When reading foundations are first taught, some children aren\u2019t ready to master them. Others miss key pieces along the way. By the time they reach the upper grades, the class has moved on, and there\u2019s often little time to revisit those skills.'),
        p('Older readers still need those foundations, but they don\u2019t need materials that make them feel like they\u2019re back in kindergarten. Island Readers combines direct phonics teaching with puzzles, games and illustrated adventures designed to respect their age while meeting their learning needs.')),
      sec('Start with what\u2019s missing',
        p('A short placement check helps identify a starting point and skills that need attention. From there, Island Readers teaches those skills directly, building on what readers already know rather than asking them to start over or keep guessing.'),
        p('Drawing on the science of reading, lessons progress from phonemic awareness (hearing and working with sounds) to letter\u2013sound relationships and decoding. Strengthening decoding helps readers develop fluency: reading accurately, smoothly and with expression, as naturally as they speak, while freeing their attention to understand what they\u2019re reading.'),
        p('Readers also practice frequently used words, building toward recognizing them automatically as sight words, rather than needing to sound them out each time they appear.')),
      sec('Practice with a purpose',
        p('Island Readers brings teaching methods used in the classroom into home practice, with a clear purpose behind each activity.'),
        p('Word chains help readers notice how changing one sound changes a word and its spelling. Mnemonics provide memorable clues for recalling sounds, while colors help readers recognize and organize spelling patterns. Puzzles encourage them to apply what they know and work through words step by step. Rhyming stories provide repeated practice with each unit\u2019s sounds in a story that makes readers want to keep going.'),
        p('Visuals, short instructions and positive feedback keep practice manageable and help build confidence. These supports draw on approaches used with learners with dyslexia, ADHD and language-processing difficulties, but can benefit many different readers.')),
      sec('How to use it',
        p('Island Readers is a phonics app that teaches reading skills directly and in order. Readers join Zip, a gecko inventor, and Frill, a nudibranch, on an adventure across the islands. Each island has a bell, and readers ring it by learning that unit\u2019s sounds. It is made for older kids, so it looks like an adventure, not a baby book. English learners can use it too.'),
        p('It is a web app that can be added to the home screen. It runs on the phones, tablets and Chromebooks families and schools already have, with no app store needed.'),
        ul('Plan about 20\u201330 minutes a session. Steps are short, and it is fine to take breaks.',
          'Each unit starts with a lesson: I do (Zip shows the skill), we do (you try it together), you do (you try it on your own).',
          'Next come practice activities, a story to read with only the sounds already taught, and heart words (tricky words to learn by heart).',
          ['At the end, Zip\u2019s Check asks 10 quick questions: ', h('b', null, '9\u201310'), ' move on, ', h('b', null, '7\u20138'), ' review first, ', h('b', null, '6 or below'), ' re-teach the lesson.'],
          'Stars and gems show progress. Grown-up tips appear under each activity.',
          'Not sure where to start? Tap Continue on the home screen. A grown-up sits with the reader, who reads short groups of real and made-up words in the same order as the units. A group passes at 4 of 5, and the check stops at the first group that is hard, which shows the starting bell. It takes about 5 minutes. Only the starting bell is saved, on this device. Nothing is recorded or sent, and the microphone is not used.')),
      sec('The research behind it',
        ul(['The National Reading Panel (2000) reviewed the research and found that systematic phonics instruction helps children learn to read. (', a('https://www.nichd.nih.gov/publications/pubs/nrp/smallbook', 'NICHD: National Reading Panel report'), ')'],
          ['The Simple View of Reading (Gough & Tunmer, 1986): reading comprehension depends on both decoding words and understanding language. Island Readers builds the decoding side. (', a('https://doi.org/10.1177/074193258600700104', 'Gough & Tunmer, 1986'), ')'],
          ['Orthographic mapping (Ehri, 2014): readers store words in memory by connecting each letter or letter group to its sound. That is why every lesson links letters to sounds. (', a('https://doi.org/10.1080/10888438.2013.819356', 'Ehri, 2014'), ')'],
          ['Structured literacy is the International Dyslexia Association’s name for reading instruction that is explicit, systematic and cumulative, the approach Island Readers follows. (', a('https://dyslexiaida.org/structured-literacy/', 'IDA: Structured Literacy'), ')'],
          'Decodable stories let readers practice only what they have been taught, and each unit reviews earlier skills so they stick.')),
      sec('Why this order',
        p('The units follow a research-based scope and sequence like those used in schools. Each step builds on the last, from simple to complex, with the most useful patterns first.'),
        h('ol', { class: 'abunits' }, ...UNITS.map(([n, t]) => h('li', null, h('b', null, 'Unit ' + n + ': '), t))),
        p('Readers start with short vowels and simple words, then learn sounds made by two letters, then longer words and word parts. That way no step asks for a skill that has not been taught.'))];
  }
  function aboutScreen() {
    IR.newScreen();
    app.append(h('div', { class: 'screen aboutscreen' }, h('div', { class: 'abwrap' },
      h('div', { class: 'abtop' }, pageNav('#/home')),
      h('h1', null, 'About Island Readers'),
      ...aboutNodes())));
  }
  /* ---------- Teacher materials (grown-up corner): by unit, then sound ---------- */
  function teachersScreen() {
    IR.newScreen();
    /* One box per lesson, in course order. Slideshow opens the deck. Printables lists the files. */
    function lessonCard(lesson) {
      const files = [];
      if (lesson.daily) files.push({ title: 'Daily practice sheets', href: lesson.daily });
      if (lesson.deck) files.push({ title: 'Slideshow PDF', href: lesson.deck });
      if (lesson.wordlist) files.push({ title: 'Word List', href: lesson.wordlist });
      if (lesson.indep) files.push({ title: 'Independent worksheets', href: lesson.indep });
      if (lesson.pack) files.push({ title: 'Teacher pack', href: lesson.pack });
      (lesson.files || []).forEach((file) => files.push(file));
      const title = lesson.title
        ? h('h3', null, lesson.title)
        : h('h3', null, h('span', { class: 'tmsound' }, lesson.s), h('span', { class: 'tmlesson' }, lesson.lesson));
      const dayText = lesson.days ? slideDays({ days: lesson.days }) : '';
      const slide = lesson.board
        ? h('button', { class: 'btn big tmlink tmslide', type: 'button', onclick: () => { Snd.stop(); location.hash = lesson.board; } }, 'Slideshow', dayText && dayText !== slideDays({}) ? h('span', { class: 'tmdays' }, dayText) : null)
        : h('span', { class: 'btn big tmlink is-soon', 'aria-disabled': 'true' }, 'Slideshow');
      let print = h('span', { class: 'btn big tmlink is-soon', 'aria-disabled': 'true' }, 'Printables');
      let list = null;
      if (files.length === 1) {
        print = h('a', { class: 'btn big tmlink tmprint', href: files[0].href, target: '_blank', rel: 'noopener' }, 'Printables');
      } else if (files.length) {
        list = h('div', { class: 'tmfiles', hidden: '' }, ...files.map((file) => h('a', { class: 'tmfile' + (file.small ? ' tmsmall' : ''), href: file.href, target: '_blank', rel: 'noopener' }, file.title)));
        print = h('button', { class: 'btn big tmlink tmprint', type: 'button', onclick: () => { list.hidden = !list.hidden; } }, 'Printables');
      }
      return h('div', { class: 'tmcard' },
        title,
        slide,
        print,
        list,
        (!lesson.board || !files.length) ? h('p', { class: 'tmnote' }, 'Coming soon') : null);
    }
    const UNITS = [
      { name: 'Meet the Teams', sounds: [
        { title: 'Meet the Teams', board: '#/foundation' },
        { title: 'Team 1: m s a t', board: '#/foundation/slides/g1', days: 5, daily: 'foundation/printables/Team1_Quick_Sounds.pdf' },
        { title: 'Team 2: p f i n', board: '#/foundation/slides/g2', days: 5, daily: 'foundation/printables/Team2_Quick_Sounds.pdf', deck: 'foundation/slides/Learn_the_Letters_Team2.pdf' },
        { title: 'Team 3: o d c u', board: '#/foundation/slides/g3', days: 5, daily: 'foundation/printables/Team3_Quick_Sounds.pdf', deck: 'foundation/slides/Learn_the_Letters_Team3.pdf' },
        { title: 'Team 4: g b e k', board: '#/foundation/slides/g4', days: 5, daily: 'foundation/printables/Team4_Quick_Sounds.pdf', deck: 'foundation/slides/Learn_the_Letters_Team4.pdf' },
        { title: 'Team 5: h r l w', board: '#/foundation/slides/g5', days: 5, daily: 'foundation/printables/Team5_Quick_Sounds.pdf', deck: 'foundation/slides/Learn_the_Letters_Team5.pdf' },
        { title: 'Team 6: j y x q', board: '#/foundation/slides/g6', days: 5, daily: 'foundation/printables/Team6_Quick_Sounds.pdf' },
        { title: 'Team 7: v z', board: '#/foundation/slides/g7', days: 5, daily: 'foundation/printables/Team7_Quick_Sounds.pdf' }
      ] },
      { name: 'Unit 1 \u00b7 Short Vowels & Floss', sounds: [
        { s: 'a', lesson: 'Lesson 1.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u11', daily: 'materials/unit1/Unit1_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit1/Lesson1.1_Slides.pdf', wordlist: 'materials/unit1/Lesson1.1_WordList.pdf', pack: 'materials/unit1/Lesson1.1_Teacher_Led_Checks.pdf', indep: 'materials/unit1/Unit1_Independent_Worksheets.pdf' },
        { s: 'i o', lesson: 'Lesson 1.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u12', daily: 'materials/unit1/Unit1_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit1/Lesson1.2_Slides.pdf', wordlist: 'materials/unit1/Lesson1.2_WordList.pdf', pack: 'materials/unit1/Lesson1.2_Teacher_Led_Checks.pdf', indep: 'materials/unit1/Unit1_Independent_Worksheets.pdf' },
        { s: 'u e', lesson: 'Lesson 1.3', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u13', daily: 'materials/unit1/Unit1_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit1/Lesson1.3_Slides.pdf', wordlist: 'materials/unit1/Lesson1.3_WordList.pdf', pack: 'materials/unit1/Lesson1.3_Teacher_Led_Checks.pdf', indep: 'materials/unit1/Unit1_Independent_Worksheets.pdf' },
        { s: 'ff ll ss zz', lesson: 'Lesson 1.4', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u14', daily: 'materials/unit1/Unit1_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit1/Lesson1.4_Slides.pdf', wordlist: 'materials/unit1/Lesson1.4_WordList.pdf', pack: 'materials/unit1/Lesson1.4_Teacher_Led_Checks.pdf', indep: 'materials/unit1/Unit1_Independent_Worksheets.pdf' }
      ] },
      { name: 'Unit 2 \u00b7 Blends', sounds: [
        { s: 'l-blends', lesson: 'Lesson 2.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u21', daily: 'materials/unit2/Unit2_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit2/Lesson2.1_Slides.pdf', wordlist: 'materials/unit2/Lesson2.1_WordList.pdf', pack: 'materials/unit2/Lesson2.1_Teacher_Led_Checks.pdf', indep: 'materials/unit2/Unit2_Independent_Worksheets.pdf' },
        { s: 'r-blends', lesson: 'Lesson 2.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u22', daily: 'materials/unit2/Unit2_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit2/Lesson2.2_Slides.pdf', wordlist: 'materials/unit2/Lesson2.2_WordList.pdf', pack: 'materials/unit2/Lesson2.2_Teacher_Led_Checks.pdf', indep: 'materials/unit2/Unit2_Independent_Worksheets.pdf' },
        { s: 's-blends', lesson: 'Lesson 2.3', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u23', daily: 'materials/unit2/Unit2_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit2/Lesson2.3_Slides.pdf', wordlist: 'materials/unit2/Lesson2.3_WordList.pdf', pack: 'materials/unit2/Lesson2.3_Teacher_Led_Checks.pdf', indep: 'materials/unit2/Unit2_Independent_Worksheets.pdf' },
        { s: '-nd -mp -st', lesson: 'Lesson 2.4', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u24', daily: 'materials/unit2/Unit2_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit2/Lesson2.4_Slides.pdf', wordlist: 'materials/unit2/Lesson2.4_WordList.pdf', pack: 'materials/unit2/Lesson2.4_Teacher_Led_Checks.pdf', indep: 'materials/unit2/Unit2_Independent_Worksheets.pdf' }
      ] },
      { name: 'Unit 3 \u00b7 Digraphs', sounds: [
        { s: 'sh ch th', lesson: 'Lesson 3.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u31', daily: 'materials/unit3/Unit3_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit3/Lesson3.1_Slides.pdf', wordlist: 'materials/unit3/Lesson3.1_WordList.pdf', pack: 'materials/unit3/Lesson3.1_Teacher_Led_Checks.pdf', indep: 'materials/unit3/Unit3_Independent_Worksheets.pdf' },
        { s: 'ck wh', lesson: 'Lesson 3.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u32', daily: 'materials/unit3/Unit3_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit3/Lesson3.2_Slides.pdf', wordlist: 'materials/unit3/Lesson3.2_WordList.pdf', pack: 'materials/unit3/Lesson3.2_Teacher_Led_Checks.pdf', indep: 'materials/unit3/Unit3_Independent_Worksheets.pdf' }
      ] },
      { name: 'Unit 4 \u00b7 Glued Sounds', sounds: [
        { s: 'ng', lesson: 'Lesson 4.1', days: [1, 2, 3, 4, 5].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/ng', slides: 'teachers/ng/Lesson3.1_ng_Week_Slides_v2.pptx', daily: 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf', pack: 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf' },
        { s: 'nk', lesson: 'Lesson 4.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/nk', slides: 'teachers/nk/Lesson3.2_nk_Slide_Presentation.pptx', daily: 'teachers/nk/Lesson3.2_nk_Daily_Practice_Sheets.pdf', pack: 'teachers/nk/Lesson3.2_nk_Teacher_Pack.pdf' }
      ] },
      { name: 'Unit 5 \u00b7 Silent e', sounds: [
        { s: 'a_e', lesson: 'Lesson 5.1', days: [{ label: 'Day 1' }], board: '#/teachers/slides/u5', slides: 'materials/unit5/Island_Readers_Magic_e_Lesson.pptx', daily: 'materials/unit5/Unit5_Teacher_Led_Student_Sheets.pdf', pack: 'materials/unit5/Lesson5.1_Teacher_Led_Checks.pdf' },
        { s: 'e', lesson: 'Lesson 5.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/tricky', slides: 'materials/unit5/Island_Readers_Tricky_e_Endings.pptx', daily: 'materials/unit5/Unit5_Teacher_Led_Student_Sheets.pdf', pack: 'materials/unit5/Lesson5.2_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 6 \u00b7 Endings', sounds: [
        { s: '-s -es', lesson: 'Lesson 6.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u61', daily: 'materials/unit6/Unit6_Teacher_Led_Student_Sheets.pdf', deck: 'foundation/slides/Lesson6.1_Endings_s_es.pdf', wordlist: 'materials/unit6/Lesson6.1_WordList_s_es.pdf', pack: 'materials/unit6/Lesson6.1_Teacher_Led_Checks.pdf' },
        { s: '-ed', lesson: 'Lesson 6.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u62', daily: 'materials/unit6/Unit6_Teacher_Led_Student_Sheets.pdf', deck: 'foundation/slides/Lesson6.2_Endings_ed.pdf', wordlist: 'materials/unit6/Lesson6.2_WordList_ed.pdf', pack: 'materials/unit6/Lesson6.2_Teacher_Led_Checks.pdf' },
        { s: '-ing', lesson: 'Lesson 6.3', days: [1, 2].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u63', daily: 'materials/unit6/Unit6_Teacher_Led_Student_Sheets.pdf', deck: 'foundation/slides/Lesson6.3_Endings_ing.pdf', wordlist: 'materials/unit6/Lesson6.3_WordList_ing.pdf', pack: 'materials/unit6/Lesson6.3_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 7 \u00b7 Syllables', sounds: [
        { s: 'compound words', lesson: 'Lesson 7.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u71', daily: 'materials/unit7/Unit7_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit7/Lesson7.1_Slides.pdf', pack: 'materials/unit7/Lesson7.1_Teacher_Led_Checks.pdf' },
        { s: 'closed + closed', lesson: 'Lesson 7.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u72', daily: 'materials/unit7/Unit7_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit7/Lesson7.2_Slides.pdf', pack: 'materials/unit7/Lesson7.2_Teacher_Led_Checks.pdf' },
        { s: 'open + closed', lesson: 'Lesson 7.3', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u73', daily: 'materials/unit7/Unit7_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit7/Lesson7.3_Slides.pdf', pack: 'materials/unit7/Lesson7.3_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 8 \u00b7 Tricky Sounds', sounds: [
        { s: 'tch', lesson: 'Lesson 8.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u81', daily: 'materials/unit8/Unit8_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit8/Lesson8.1_Slides.pdf', pack: 'materials/unit8/Lesson8.1_Teacher_Led_Checks.pdf' },
        { s: 'dge', lesson: 'Lesson 8.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u82', daily: 'materials/unit8/Unit8_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit8/Lesson8.2_Slides.pdf', pack: 'materials/unit8/Lesson8.2_Teacher_Led_Checks.pdf' },
        { s: '-ild -old', lesson: 'Lesson 8.3', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u83', daily: 'materials/unit8/Unit8_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit8/Lesson8.3_Slides.pdf', pack: 'materials/unit8/Lesson8.3_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 9 \u00b7 Bossy R', sounds: [
        { s: 'ar', lesson: 'Lesson 9.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u91', daily: 'materials/unit9/Unit9_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit9/Lesson9.1_Slides.pdf', pack: 'materials/unit9/Lesson9.1_Teacher_Led_Checks.pdf' },
        { s: 'or ore', lesson: 'Lesson 9.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u92', daily: 'materials/unit9/Unit9_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit9/Lesson9.2_Slides.pdf', pack: 'materials/unit9/Lesson9.2_Teacher_Led_Checks.pdf' },
        { s: 'er', lesson: 'Lesson 9.3', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u93', daily: 'materials/unit9/Unit9_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit9/Lesson9.3_Slides.pdf', pack: 'materials/unit9/Lesson9.3_Teacher_Led_Checks.pdf' },
        { s: 'ir ur (w)or', lesson: 'Lesson 9.4', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u94', daily: 'materials/unit9/Unit9_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit9/Lesson9.4_Slides.pdf', pack: 'materials/unit9/Lesson9.4_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 10 \u00b7 More Bossy R', sounds: [
        { s: 'air, are', lesson: 'Lesson 10.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u101', daily: 'materials/unit10/Unit10_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit10/Lesson10.1_Slides.pdf', pack: 'materials/unit10/Lesson10.1_Teacher_Led_Checks.pdf' },
        { s: 'ear', lesson: 'Lesson 10.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u102', daily: 'materials/unit10/Unit10_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit10/Lesson10.2_Slides.pdf', pack: 'materials/unit10/Lesson10.2_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 11 \u00b7 Long A and E Teams', sounds: [
        { s: 'ai, ay', lesson: 'Lesson 11.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u111', daily: 'materials/unit11/Unit11_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit11/Lesson11.1_Slides.pdf', pack: 'materials/unit11/Lesson11.1_Teacher_Led_Checks.pdf' },
        { s: 'ee, ea, ey', lesson: 'Lesson 11.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u112', daily: 'materials/unit11/Unit11_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit11/Lesson11.2_Slides.pdf', pack: 'materials/unit11/Lesson11.2_Teacher_Led_Checks.pdf' }
      ] },
      { name: 'Unit 12 \u00b7 Long O and I Teams', sounds: [
        { s: 'oa, oe', lesson: 'Lesson 12.1', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u121', daily: 'materials/unit12/Unit12_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit12/Lesson12.1_Slides.pdf', pack: 'materials/unit12/Lesson12.1_Teacher_Led_Checks.pdf' },
        { s: 'ow', lesson: 'Lesson 12.2', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u122', daily: 'materials/unit12/Unit12_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit12/Lesson12.2_Slides.pdf', pack: 'materials/unit12/Lesson12.2_Teacher_Led_Checks.pdf' },
        { s: 'ie, igh', lesson: 'Lesson 12.3', days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })), board: '#/teachers/slides/u123', daily: 'materials/unit12/Unit12_Teacher_Led_Student_Sheets.pdf', deck: 'materials/unit12/Lesson12.3_Slides.pdf', pack: 'materials/unit12/Lesson12.3_Teacher_Led_Checks.pdf' }
      ] }
    ];
    const sections = UNITS.map((unit) => h('section', { class: 'tmunit' },
      h('h2', null, unit.name),
      h('div', { class: 'tmgrid' }, ...unit.sounds.map(lessonCard))));
    app.append(h('div', { class: 'screen tmscreen' }, h('div', { class: 'tmwrap' },
      h('div', { class: 'abtop' }, pageNav('#/home')),
      h('h1', null, 'Parent and Teacher Materials'),
      h('p', { class: 'tmlead' }, 'In course order. Slideshow opens the deck. Printables opens the files.'),
      ...sections)));
    Snd.hideFallback();
  }
  /* Day jumps for the in-app decks. Same ranges as teachers/<id>/slides.json. */
  IR.deckDays = {
    ng: [
      { label: 'Day 1', start: 1, end: 21 },
      { label: 'Day 2', start: 22, end: 41 },
      { label: 'Day 3', start: 42, end: 54 },
      { label: 'Day 4', start: 55, end: 64 },
      { label: 'Day 5', start: 65, end: 74 }
    ],
    nk: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 42 },
      { label: 'Day 3', start: 43, end: 60 }
    ],
    u5: [
      { label: 'Day 1', start: 1, end: 20 }
    ],
    u61: [
      { label: 'Day 1', start: 1, end: 24 },
      { label: 'Day 2', start: 25, end: 48 },
      { label: 'Day 3', start: 49, end: 77 }
    ],
    u62: [
      { label: 'Day 1', start: 1, end: 21 },
      { label: 'Day 2', start: 22, end: 43 },
      { label: 'Day 3', start: 44, end: 74 }
    ],
    u63: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 43 }
    ],
    u11: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u12: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u13: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u14: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u21: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u22: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u23: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u24: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 71 }
    ],
    u31: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u32: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u71: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u72: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u73: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u81: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u82: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u83: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u91: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u92: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u93: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ],
    u94: [
      { label: 'Day 1', start: 1, end: 20 },
      { label: 'Day 2', start: 21, end: 40 },
      { label: 'Day 3', start: 41, end: 67 }
    ]
  };
  /* In-app week-deck slideshow for smartboard (ng / nk / unit 5). Keeps PPTX download on the teachers page. */
  function slidesViewer(sound) {
    IR.newScreen();
    const calm = /^u[123789]\d$/.test(sound);
    const root = h('div', { class: 'screen slidescreen' + (calm ? ' slidecalm' : ''), tabindex: '0', 'data-sound': sound });
    const stage = h('div', { class: 'slide-stage' });
    const img = h('img', { class: 'slide-img', alt: sound + ' week slide' });
    const videoBox = h('div', { class: 'slide-video', hidden: '' });
    const SLIDE_VIDEO = {
      ng: { file: 'teachers/ng/slides/04.jpg', src: 'video/ng_cartoon_small.mp4', captions: 'video/ng_cartoon_captions.json', title: 'Zip and Frill: The Nose Hum' }
    };
    const counter = h('div', { class: 'slide-count', 'aria-live': 'polite' }, '');
    const prev = h('button', { class: 'slide-nav slide-prev', type: 'button', 'aria-label': 'Previous slide' }, '\u25C0');
    const next = h('button', { class: 'slide-nav slide-next', type: 'button', 'aria-label': 'Next slide' }, '\u25B6');
    const jumps = h('div', { class: 'fs-dayjumps slide-days' });
    const top = h('div', { class: 'slide-top' },
      calm ? null : pageNav('#/teachers'),
      h('h1', { class: 'slide-title' }, sound + ' week slides'),
      counter);
    if (!calm) stage.append(prev, next);
    stage.append(img, videoBox);
    root.append(top, jumps, stage);
    let fullBtn = null;
    if (calm) {
      const home = h('button', { class: 'btn big ir-btn', type: 'button', 'aria-label': 'Home' }, icon('home'), 'Home');
      home.addEventListener('click', () => { Snd.stop(); location.hash = '#/home'; });
      const back = h('button', { class: 'btn big ir-btn slide-back', type: 'button', 'aria-label': 'Back' }, icon('back'), 'Back');
      const forward = h('button', { class: 'btn big ir-btn slide-forward', type: 'button', 'aria-label': 'Forward' }, 'Next', icon('next'));
      fullBtn = h('button', { class: 'btn big ir-btn slide-full', type: 'button', 'aria-pressed': 'false', 'aria-label': 'Full screen' }, 'Full');
      back.addEventListener('click', () => { if (i > 0) go(-1); else location.hash = '#/teachers'; });
      forward.addEventListener('click', () => go(1));
      fullBtn.addEventListener('click', () => {
        const on = document.fullscreenElement === root;
        const p = on ? document.exitFullscreen() : root.requestFullscreen();
        if (p && p.catch) p.catch(() => {});
      });
      root._onFs = () => {
        const on = document.fullscreenElement === root;
        fullBtn.textContent = on ? 'Exit' : 'Full';
        fullBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        fullBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
      };
      document.addEventListener('fullscreenchange', root._onFs);
      root.append(h('div', { class: 'lesson-nav ir-controls slide-controls' }, home, back, forward, fullBtn));
      let startX = 0; let startY = 0;
      stage.addEventListener('pointerdown', (e) => { startX = e.clientX; startY = e.clientY; });
      stage.addEventListener('pointerup', (e) => {
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        go(dx < 0 ? 1 : -1);
      });
    }
    app.append(root);
    let slides = []; let days = []; let i = 0; let keyHandler = null;
    let videoStop = null;
    function dayStart(day) { return day.start || day.page || 1; }
    function clearVideo() {
      if (videoStop) videoStop();
      videoStop = null;
      videoBox.innerHTML = '';
      videoBox.hidden = true;
      img.hidden = false;
    }
    function showVideo(spec) {
      clearVideo();
      img.hidden = true;
      videoBox.hidden = false;
      const v = h('video', { class: 'slide-img', controls: true, playsinline: true, preload: 'metadata', 'aria-label': spec.title }, h('source', { src: spec.src, type: 'video/mp4' }));
      const wrap = h('div', { class: 'vwrap slide-vwrap' }, v);
      const bar = h('div', { class: 'row center cc-row' });
      videoBox.append(wrap, bar);
      loadCaptions().then((cues) => {
        if (!cues || !cues.length || !videoBox.isConnected) return;
        const cp = captionPlayer(v, wrap, cues);
        videoStop = cp.stop;
        wrap.append(cp.overlay);
        bar.append(cp.toggle);
      });
    }
    function show() {
      if (!slides.length) { clearVideo(); img.removeAttribute('src'); counter.textContent = 'No slides'; prev.disabled = true; next.disabled = true; return; }
      const spec = SLIDE_VIDEO[sound];
      if (spec && slides[i] === spec.file) showVideo(spec);
      else { clearVideo(); img.src = slides[i]; }
      counter.textContent = calm ? ((i + 1) + ' of ' + slides.length) : ((i + 1) + ' / ' + slides.length);
      prev.disabled = i <= 0; next.disabled = i >= slides.length - 1;
      const backBtn = root.querySelector('.slide-back');
      const fwdBtn = root.querySelector('.slide-forward');
      if (fwdBtn) fwdBtn.disabled = i >= slides.length - 1;
      const n = i + 1;
      let here = null;
      days.forEach((day) => { if (n >= dayStart(day)) here = day; });
      jumps.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('on', !!(here && button.dataset.day === String(here.day)));
      });
      root.focus({ preventScroll: true });
    }
    function go(d) { if (!slides.length) return; i = Math.max(0, Math.min(slides.length - 1, i + d)); show(); }
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    keyHandler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
      else if (e.key === 'Home') { e.preventDefault(); i = 0; show(); }
      else if (e.key === 'End') { e.preventDefault(); i = slides.length - 1; show(); }
      else if (e.key === 'Escape') { location.hash = '#/teachers'; }
    };
    window.addEventListener('keydown', keyHandler);
    const oldCleanup = IR._slideCleanup; if (typeof oldCleanup === 'function') oldCleanup();
    IR._slideCleanup = () => {
      window.removeEventListener('keydown', keyHandler);
      if (root._onFs) document.removeEventListener('fullscreenchange', root._onFs);
    };
    const slideRoot = /^u[123789]\d$/.test(sound) ? 'materials/unit' + sound.charAt(1) + '/slides/' + sound + '/' : { u61: 'materials/unit6/slides/u61/', u62: 'materials/unit6/slides/u62/', u63: 'materials/unit6/slides/u63/' }[sound];
    fetch(slideRoot ? slideRoot + 'manifest.json' : 'teachers/' + sound + '/slides.json').then((r) => r.json()).then((man) => {
      slides = (man.slides || []).map((name) => (slideRoot && name.indexOf('/') < 0) ? slideRoot + name : name);
      days = (man.days && man.days.length) ? man.days : ((WEEK_DAYS[sound] || []).slice());
      jumps.innerHTML = '';
      days.forEach((day, index) => {
        day.day = day.day || index + 1;
        jumps.append(h('button', {
          class: 'btn fs-dayjump slide-day',
          type: 'button',
          'data-day': String(day.day),
          onclick: () => { i = Math.max(0, dayStart(day) - 1); show(); }
        }, day.label || ('Day ' + day.day)));
      });
      i = 0;
      show();
      if (man.title) top.querySelector('.slide-title').textContent = man.title;
    }).catch(() => { counter.textContent = 'Could not load slides'; });
    show();
  }

  /* Same color names as the home bell cards (TILES). Hex values match the card swatches. */
  const UNIT_BELL = [null, 'gong', 'red', 'coral', 'orange', 'yellow', 'green', 'lblue', 'dblue', 'purple', 'pink', 'silver', 'red', 'coral', 'orange', 'yellow', 'green', 'lblue', 'dblue', 'purple', 'pink', 'rainbow', 'gold'];
  const BELL_HEX = { gong: '#CD7F32', red: '#d93a2b', coral: '#f2765a', orange: '#f08a1c', yellow: '#f2c21b', green: '#2fa84f', lblue: '#5fb4ec', dblue: '#1f3f8f', purple: '#8e3fc9', pink: '#e8609a', silver: '#c0c4cc', gold: '#d4a017' };
  const BELL_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" stroke="#5a4632" stroke-width=".55" d="M8 1.2a.85.85 0 0 1 .85.85v.3A4.5 4.5 0 0 1 13.1 6.8v2.2l1.15 1.8H1.75L2.9 9V6.8A4.5 4.5 0 0 1 7.15 2.35v-.3A.85.85 0 0 1 8 1.2z"/><circle cx="8" cy="13.15" r="1.15" fill="currentColor" stroke="#5a4632" stroke-width=".45"/></svg>';
  const RAIN_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><defs><linearGradient id="pinbell-rainbow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d93a2b"/><stop offset=".25" stop-color="#f2c21b"/><stop offset=".5" stop-color="#2fa84f"/><stop offset=".75" stop-color="#5fb4ec"/><stop offset="1" stop-color="#8e3fc9"/></linearGradient></defs><path fill="url(#pinbell-rainbow)" stroke="#5a4632" stroke-width=".55" d="M8 1.2a.85.85 0 0 1 .85.85v.3A4.5 4.5 0 0 1 13.1 6.8v2.2l1.15 1.8H1.75L2.9 9V6.8A4.5 4.5 0 0 1 7.15 2.35v-.3A.85.85 0 0 1 8 1.2z"/><circle cx="8" cy="13.15" r="1.15" fill="url(#pinbell-rainbow)" stroke="#5a4632" stroke-width=".45"/></svg>';
  function pinBell(n) {
    const key = UNIT_BELL[n];
    return h('span', { class: 'pinbell', 'aria-hidden': 'true', style: key === 'rainbow' ? '' : 'color:' + BELL_HEX[key], html: key === 'rainbow' ? RAIN_SVG : BELL_SVG });
  }
  function bellInk(hex) {
    const n = parseInt(hex.slice(1), 16);
    const y = (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
    return y > 160 ? '#3b2a1a' : '#fff';
  }
  /* Painted trail: img/trail/trail_map.webp is 720 by 1280.
     x and y are percentages from the top-left. Nudge a label by editing its numbers. */
  const TRAIL_MAP = {
    src: 'img/trail/trail_map.webp',
    width: 720,
    height: 1280,
    marks: [
      { kind: 'unit', n: 1, x: 40, y: 13 },
      { kind: 'unit', n: 2, x: 50, y: 12.5 },
      { kind: 'unit', n: 3, x: 60, y: 13.5 },
      { kind: 'unit', n: 4, x: 70, y: 15 },
      { kind: 'unit', n: 5, x: 80, y: 18 },
      { kind: 'unit', n: 6, x: 74, y: 23 },
      { kind: 'unit', n: 7, x: 62, y: 24.5 },
      { kind: 'unit', n: 8, x: 50, y: 25.5 },
      { kind: 'unit', n: 9, x: 36, y: 28.5 },
      { kind: 'unit', n: 10, x: 24, y: 31.5 },
      { kind: 'unit', n: 11, x: 36, y: 35 },
      { kind: 'unit', n: 12, x: 50, y: 37.5 },
      { kind: 'unit', n: 13, x: 64, y: 41 },
      { kind: 'unit', n: 14, x: 76, y: 43 },
      { kind: 'unit', n: 15, x: 66, y: 48.5 },
      { kind: 'unit', n: 16, x: 52, y: 51.5 },
      { kind: 'unit', n: 17, x: 38, y: 55.5 },
      { kind: 'unit', n: 18, x: 30, y: 59.5 },
      { kind: 'unit', n: 19, x: 48, y: 63.5 },
      { kind: 'unit', n: 20, x: 66, y: 66.5 },
      { kind: 'unit', n: 21, x: 70, y: 72 },
      { kind: 'unit', n: 22, x: 56, y: 74 },
      { kind: 'finale', x: 66, y: 91 }
    ]
  };
  const UNIT_META = [null,
    ['a e i o u \u00b7 ff ll ss', 4], ['bl \u00b7 st \u00b7 tr \u00b7 -nd \u00b7 -mp', 4], ['sh \u00b7 ch \u00b7 th \u00b7 wh \u00b7 ck', 2], ['ng \u00b7 nk', 3],
    ['a_e \u00b7 i_e \u00b7 o_e \u00b7 u_e', 2], ['-s \u00b7 -es \u00b7 -ed \u00b7 -ing', 3], ['closed \u00b7 open', 3], ['tch \u00b7 dge \u00b7 -ild \u00b7 -old', 3],
    ['ar \u00b7 or \u00b7 er \u00b7 ir \u00b7 ur', 4], ['air \u00b7 are \u00b7 ear', 2], ['ai \u00b7 ay \u00b7 ee \u00b7 ea \u00b7 ey', 2], ['oa \u00b7 ow \u00b7 oe \u00b7 ie \u00b7 igh', 3],
    ['oo \u00b7 ew \u00b7 ui \u00b7 ue', 4], ['au \u00b7 aw \u00b7 augh \u00b7 ea', 2], ['oi \u00b7 oy \u00b7 ou \u00b7 ow', 3], ['ei \u00b7 eigh \u00b7 ew \u00b7 ough', 3],
    ['soft c \u00b7 soft g', 1], ['kn \u00b7 wr \u00b7 mb \u00b7 gn \u00b7 gh', 2], ['-er \u00b7 -est \u00b7 -ly \u00b7 -ful', 6], ['double \u00b7 drop e \u00b7 y to i', 4],
    ['un- \u00b7 pre- \u00b7 re- \u00b7 dis-', 5], ['-tion \u00b7 -ture \u00b7 -ment', 6]];
  function trailPlace() {
    const finished = {
      4: islandDone('i3'),
      5: !!(IR.isDone('u51_check') && IR.isDone('u53_check') && IR.isDone('u5_review')),
      6: !!(IR.isDone('u61_check') && IR.isDone('u62_check') && IR.isDone('u63_check'))
    };
    let here = 4;
    if (finished[4] && !finished[5]) here = 5;
    else if (finished[4] && finished[5] && !finished[6]) here = 6;
    else if (finished[4] && finished[5] && finished[6]) here = 7;
    const acts = (IR.S().progress && IR.S().progress.activities) || {};
    const any = Object.keys(acts).some((k) => acts[k] && acts[k].completed);
    if (!any && IR.placement && IR.placement.savedStart) {
      const start = IR.placement.savedStart();
      if (start) here = start.unit || 1;
    }
    return { finished: finished, here: here };
  }
  function unitStatus(n, place) {
    if (place.finished[n]) return 'Done';
    if (n === place.here) return 'You are here';
    if ((n <= 3 && IR.u123Route) || n === 4 || (n === 5 && IR.u5Route) || (n === 6 && IR.u6Route) || (n >= 7 && n <= 9 && IR.u789Route) || builtUnitHref(n)) return 'Open';
    return 'Coming soon';
  }
  function openTrailBell(n) {
    const u5 = n === 5 && !!IR.u5Route;
    const u6 = n === 6 && !!IR.u6Route;
    const isl = n === 4 && !!(D.islands || {}).i3;
    if (n <= 3 && IR.u123Route) { Snd.stop(); location.hash = '#/u' + n; return; }
    if (builtUnitHref(n)) { Snd.stop(); location.hash = builtUnitHref(n); return; }
    if (n >= 7 && n <= 9 && IR.u789Route) { Snd.stop(); location.hash = '#/u' + n; return; }
    if (u6) { Snd.stop(); location.hash = '#/u6'; return; }
    if (u5) { Snd.stop(); location.hash = '#/u5'; return; }
    if (isl) { openIsland('i3'); return; }
    Snd.stop();
    toast('Unit ' + n + ' is coming soon.');
  }
  function islandTrailPage() {
    IR.newScreen();
    const place = trailPlace();
    const here = place.here;
    let pointer = 'mouse';
    const test = h('a', { class: 'btn big primary trailgo', href: '#/placement' }, 'Take the Placement Test');
    const art = h('img', { class: 'trailmap-art', src: TRAIL_MAP.src, alt: '', width: TRAIL_MAP.width, height: TRAIL_MAP.height });
    const frame = h('div', { class: 'trailmap', style: 'aspect-ratio:' + TRAIL_MAP.width + ' / ' + TRAIL_MAP.height }, art);
    art.addEventListener('error', () => { frame.classList.add('is-missing'); art.remove(); });
    const closeTips = () => { document.querySelectorAll('.trailpinwrap.tipopen').forEach((el) => el.classList.remove('tipopen')); };
    const touchNow = () => pointer === 'touch' || (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);
    const pin = (mark) => {
      const style = 'left:' + mark.x + '%;top:' + mark.y + '%';
      const tipId = 'trailtip-' + (mark.kind === 'unit' ? mark.n : mark.kind + (mark.n || ''));
      let title = 'Golden Bell';
      let lines = [h('span', { class: 'tipmeta' }, 'The end of the path. Coming soon.')];
      let open = () => { Snd.stop(); toast('Golden Bell is coming soon.'); };
      let pinClass = 'trailpin finale';
      let bits = [h('span', { class: 'pinstar', 'aria-hidden': 'true' }, icon('star'))];
      let label = 'Golden Bell. The end of the path. Coming soon.';
      let pinStyle = '';
      if (mark.kind === 'unit') {
        const meta = UNIT_META[mark.n];
        const status = unitStatus(mark.n, place);
        const hex = UNIT_BELL[mark.n] === 'rainbow' ? '' : BELL_HEX[UNIT_BELL[mark.n]];
        title = 'Unit ' + mark.n;
        const soon = status === 'Coming soon';
        lines = [h('span', { class: 'tipskill' }, UNIT_NAMES[mark.n]), h('span', { class: 'tipsounds' }, meta[0]), h('span', { class: 'tipmeta' }, meta[1] + (meta[1] === 1 ? ' lesson' : ' lessons') + ' \u00b7 ' + status), soon ? h('span', { class: 'lockpill' }, 'Coming soon') : null];
        open = () => openTrailBell(mark.n);
        pinClass = 'trailpin' + (mark.n === here ? ' here' : '') + (place.finished[mark.n] ? ' done' : '') + (soon ? ' is-soon' : '') + (UNIT_BELL[mark.n] === 'rainbow' ? ' rainbow' : '');
        bits = [h('span', { class: 'pinnum' + (mark.n > 9 ? ' pinnum2' : '') }, String(mark.n)), place.finished[mark.n] ? h('span', { class: 'pindone', 'aria-hidden': 'true' }, icon('check')) : null];
        label = 'Unit ' + mark.n + '. ' + UNIT_NAMES[mark.n] + '. ' + status + '.';
        if (hex) pinStyle = 'background:' + hex + ';color:' + bellInk(hex);
      }
      const go = h('button', { class: 'tipgo', type: 'button' }, 'Open');
      const tip = h('div', { class: 'trailtip' + (mark.y < 18 ? ' below' : ''), id: tipId, role: 'tooltip' }, h('b', null, title), ...lines, go);
      const btn = h('button', { class: pinClass, type: 'button', style: pinStyle, 'aria-label': label, 'aria-describedby': tipId }, ...bits);
      go.addEventListener('click', (e) => { e.stopPropagation(); open(); });
      btn.addEventListener('click', () => {
        if (touchNow() && !wrap.classList.contains('tipopen')) { closeTips(); wrap.classList.add('tipopen'); return; }
        open();
      });
      const isHere = mark.kind === 'unit' && mark.n === here;
      const hereSide = mark.x > 58 ? ' left' : '';
      const hereTag = isHere ? h('span', { class: 'heretag' + hereSide, 'aria-hidden': 'true' }, 'You are here') : null;
      const wrap = h('div', { class: 'trailpinwrap' + (isHere ? ' here' : ''), style: style }, btn, tip, hereTag);
      return wrap;
    };
    const listItem = (mark) => {
      if (mark.kind === 'finale') return h('li', null, h('button', { type: 'button', onclick: () => { Snd.stop(); toast('Golden Bell is coming soon.'); } }, 'Golden Bell'));
      const name = UNIT_NAMES[mark.n];
      const status = unitStatus(mark.n, place);
      const label = 'Unit ' + mark.n + '. ' + name + '. ' + status + '.';
      return h('li', null, h('button', { type: 'button', class: mark.n === here ? 'here' : '', 'aria-label': label, onclick: () => openTrailBell(mark.n) }, h('b', null, 'Unit ' + mark.n), h('span', null, name), place.finished[mark.n] ? h('span', { class: 'pindone', 'aria-hidden': 'true' }, icon('check')) : null));
    };
    if (IR._trailPointer) document.removeEventListener('pointerdown', IR._trailPointer, true);
    IR._trailPointer = (e) => { pointer = e.pointerType || 'mouse'; if (!e.target.closest('.trailpinwrap')) closeTips(); };
    document.addEventListener('pointerdown', IR._trailPointer, true);
    app.append(h('div', { class: 'screen home simplepage trailpage' }, h('div', { class: 'mwrap trailwrap' },
      h('div', { class: 'gtop' }, pageNav('#/home')),
      h('h1', null, 'Trail Map'),
      test,
      h('div', { class: 'trailstage' }, frame, h('div', { class: 'trailpins' }, ...TRAIL_MAP.marks.map(pin))),
      h('h2', null, 'Every bell'),
      h('ol', { class: 'traillist' }, ...TRAIL_MAP.marks.map(listItem)))));
  }
  function openTrailMap() {
    const place = trailPlace();
    const close = () => {
      modalRoot.innerHTML = '';
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const x = h('button', { class: 'trail-x', type: 'button', 'aria-label': 'Close' }, icon('close'));
    x.addEventListener('click', close);
    const test = h('a', { class: 'btn big primary trailgo', href: '#/placement', onclick: () => close() }, 'Take the Placement Test');
    const art = h('img', { class: 'trailmap-art', src: TRAIL_MAP.src, alt: '', width: TRAIL_MAP.width, height: TRAIL_MAP.height });
    const frame = h('div', { class: 'trailmap', style: 'aspect-ratio:' + TRAIL_MAP.width + ' / ' + TRAIL_MAP.height }, art);
    art.addEventListener('error', () => { frame.classList.add('is-missing'); art.remove(); });
    const closeTips = () => { document.querySelectorAll('.trailpinwrap.tipopen').forEach((el) => el.classList.remove('tipopen')); };
    let pointer = 'mouse';
    const here = place.here;
    const touchNow = () => pointer === 'touch' || (window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);
    const pin = (mark) => {
      const style = 'left:' + mark.x + '%;top:' + mark.y + '%';
      const tipId = 'trailtip-pop-' + (mark.kind === 'unit' ? mark.n : mark.kind + (mark.n || ''));
      let title = 'Golden Bell';
      let lines = [h('span', { class: 'tipmeta' }, 'The end of the path. Coming soon.')];
      let open = () => { Snd.stop(); close(); toast('Golden Bell is coming soon.'); };
      let pinClass = 'trailpin finale';
      let bits = [h('span', { class: 'pinstar', 'aria-hidden': 'true' }, icon('star'))];
      let label = 'Golden Bell. The end of the path. Coming soon.';
      let pinStyle = '';
      if (mark.kind === 'unit') {
        const meta = UNIT_META[mark.n];
        const status = unitStatus(mark.n, place);
        const hex = UNIT_BELL[mark.n] === 'rainbow' ? '' : BELL_HEX[UNIT_BELL[mark.n]];
        title = 'Unit ' + mark.n;
        const soon = status === 'Coming soon';
        lines = [h('span', { class: 'tipskill' }, UNIT_NAMES[mark.n]), h('span', { class: 'tipsounds' }, meta[0]), h('span', { class: 'tipmeta' }, meta[1] + (meta[1] === 1 ? ' lesson' : ' lessons') + ' \u00b7 ' + status), soon ? h('span', { class: 'lockpill' }, 'Coming soon') : null];
        open = () => { close(); openTrailBell(mark.n); };
        pinClass = 'trailpin' + (mark.n === here ? ' here' : '') + (place.finished[mark.n] ? ' done' : '') + (soon ? ' is-soon' : '') + (UNIT_BELL[mark.n] === 'rainbow' ? ' rainbow' : '');
        bits = [h('span', { class: 'pinnum' + (mark.n > 9 ? ' pinnum2' : '') }, String(mark.n)), place.finished[mark.n] ? h('span', { class: 'pindone', 'aria-hidden': 'true' }, icon('check')) : null];
        label = 'Unit ' + mark.n + '. ' + UNIT_NAMES[mark.n] + '. ' + status + '.';
        if (hex) pinStyle = 'background:' + hex + ';color:' + bellInk(hex);
      }
      const go = h('button', { class: 'tipgo', type: 'button' }, 'Open');
      const tip = h('div', { class: 'trailtip' + (mark.y < 18 ? ' below' : ''), id: tipId, role: 'tooltip' }, h('b', null, title), ...lines, go);
      const btn = h('button', { class: pinClass, type: 'button', style: pinStyle, 'aria-label': label, 'aria-describedby': tipId }, ...bits);
      const isHere = mark.kind === 'unit' && mark.n === here;
      const wrap = h('div', { class: 'trailpinwrap' + (isHere ? ' here' : ''), style: style }, btn, tip);
      go.addEventListener('click', (e) => { e.stopPropagation(); open(); });
      btn.addEventListener('click', () => {
        if (touchNow() && !wrap.classList.contains('tipopen')) { closeTips(); wrap.classList.add('tipopen'); return; }
        open();
      });
      return wrap;
    };
    if (IR._trailPointer) document.removeEventListener('pointerdown', IR._trailPointer, true);
    IR._trailPointer = (e) => { pointer = e.pointerType || 'mouse'; if (!e.target.closest('.trailpinwrap')) closeTips(); };
    document.addEventListener('pointerdown', IR._trailPointer, true);
    const pins = TRAIL_MAP.marks.map(pin);
    const box = h('div', { class: 'modal trailpop', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Trail Map' },
      x,
      h('h2', null, 'Trail Map'),
      h('p', { class: 'trailhere' }, 'You are here: Unit ' + here),
      test,
      h('div', { class: 'trailstage' }, frame, h('div', { class: 'trailpins' }, ...pins)));
    const scrim = h('div', { class: 'scrim' }, box);
    scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
    modalRoot.innerHTML = '';
    modalRoot.append(scrim);
    x.focus();
  }
  function findCatalog() {
    const skills = skillCatalog();
    const bag = (id) => ((skills.filter((s) => s.id === id)[0] || {}).items || []).filter((it) => it.href);
    const kindName = { pa: 'Phonemic Awareness', spelling: 'Spelling', Spelling: 'Spelling', rhyme: 'Rhyme', fluency: 'Fluency', Fluency: 'Fluency', 'Sight words': 'Sight words' };
    const link = (title, href, extra) => ({ title: title, href: href, blob: (title + ' ' + (extra || '')).toLowerCase() });
    const act = (it) => Object.assign(link('Unit ' + it.unit + ' \u00b7 Lesson ' + IR.kidLesson(it.lesson) + ' \u00b7 ' + it.name + (it.title ? ' \u00b7 ' + it.title : ''), it.href, kindName[it.type] || it.type || ''), { unit: it.unit, skill: kindName[it.type] || it.type || '' });
    const lessons = [
      { unit: 4, title: 'Unit 4 \u00b7 Lesson 1 \u00b7 ng', href: '#/island3' },
      { unit: 4, title: 'Unit 4 \u00b7 Lesson 2 \u00b7 nk', href: '#/nk' },
      { unit: 5, title: 'Unit 5 \u00b7 Lesson 1 \u00b7 Silent e', href: '#/u51' },
      { unit: 5, title: 'Unit 5 \u00b7 Lesson 2 \u00b7 Tricky silent e', href: '#/u53' },
      { unit: 6, title: 'Unit 6 \u00b7 Lesson 1 \u00b7 -s and -es', href: '#/u6/u61' },
      { unit: 6, title: 'Unit 6 \u00b7 Lesson 2 \u00b7 -ed', href: '#/u6/u62' },
      { unit: 6, title: 'Unit 6 \u00b7 Lesson 3 \u00b7 -ing', href: '#/u6/u63' }
    ].map((L) => Object.assign(link(L.title, L.href, 'lesson'), { unit: L.unit }));
    const comp = [];
    if ((IR.nk && IR.nk.steps || []).some((s) => s.id === 'comp')) comp.push(link('Unit 4 \u00b7 Lesson 2 \u00b7 Story Check', '#/nk/comp', 'comprehension'));
    (IR.u5Lessons || []).forEach((L) => {
      if ((L.steps || []).some((s) => s.id === 'comp')) comp.push(link('Unit 5 \u00b7 Lesson ' + IR.kidLesson(L.n) + ' \u00b7 Story Check', '#/' + L.key + '/comp', 'comprehension'));
    });
    const stories = fluencyStories().map((s) => link(s.lesson + (s.title ? ' \u00b7 ' + s.title : ''), s.href, 'fluency story reader'));
    const byHref = new Map();
    bag('pa').concat(bag('rhyme'), bag('spelling'), bag('fluency').filter((it) => it.type !== 'Fluency')).map(act).forEach((it) => {
      const prev = byHref.get(it.href);
      if (!prev) byHref.set(it.href, it);
      else if (prev.blob.indexOf(it.blob) < 0) prev.blob += ' ' + it.blob;
    });
    const plays = [...byHref.values()];
    const unit = [];
    for (let n = 1; n <= 22; n++) unit.push({ name: 'Unit ' + n + ' \u00b7 ' + UNIT_NAMES[n], items: lessons.filter((L) => L.unit === n) });
    const skill = skillCatalog().filter((s) => s.id !== 'sight').map((s) => ({
      name: s.id === 'pa' ? 'Phonemic Awareness' : s.name,
      items: (s.items || []).filter((it) => it.href).map((it) => link(it.name + (it.title ? ' \u00b7 ' + it.title : ''), it.href, s.name + ' ' + (it.lesson || '')))
    }));
    const games = (IR.chest && IR.chest.GAMES) || [];
    const sight = [1, 2, 3, 4].map((n) => {
      const href = '#/chest' + n;
      const range = 'Units ' + (n * 2 - 1) + '\u2013' + (n * 2);
      const items = [link('Treasure chest ' + n, href, 'sight words heart words treasure ' + range)];
      games.forEach((g) => items.push(link(g.title, href + '/' + g.id, 'sight words heart words treasure ' + range + ' ' + (g.blurb || ''))));
      return { name: 'Sight words ' + n + ' \u00b7 ' + range, items: items };
    });
    const fluency = [
      { name: 'Stories', items: stories },
      { name: 'Comprehension', items: comp }
    ];
    const search = [link('Word Families is coming soon.', '', 'word families')];
    const seen = new Set();
    function addSearch(it) {
      if (!it || !it.href || seen.has(it.href + '|' + it.title)) return;
      seen.add(it.href + '|' + it.title);
      search.push(it);
    }
    unit.forEach((g) => g.items.forEach(addSearch));
    skill.forEach((g) => g.items.forEach(addSearch));
    sight.forEach((g) => g.items.forEach(addSearch));
    fluency.forEach((g) => g.items.forEach(addSearch));
    return { unit: unit, skill: skill, sight: sight, fluency: fluency, search: search };
  }
  function findScreen() {
    IR.newScreen();
    const data = findCatalog();
    const input = h('input', { class: 'skillsearch', type: 'search', placeholder: 'Search', 'aria-label': 'Search lessons, games, stories, and skills' });
    const tabs = h('div', { class: 'findtabs', role: 'tablist' });
    const host = h('div', { class: 'findhost' });
    const modes = [['unit', 'By Unit'], ['skill', 'By Skill'], ['sight', 'Sight Words'], ['fluency', 'Fluency Readers']];
    let mode = 'unit';
    let openKey = '';
    function row(it) {
      if (!it.href) return h('p', { class: 'findsoon' }, it.title);
      return h('a', { class: 'hometab', href: it.href }, h('span', { class: 'hometab-name' }, it.title));
    }
    function section(g) {
      const open = openKey === g.name;
      const b = h('button', {
        class: 'hometab findhead',
        type: 'button',
        'aria-expanded': open ? 'true' : 'false',
        onclick: () => { openKey = open ? '' : g.name; paint(); }
      }, h('span', { class: 'hometab-name' }, g.name));
      const kids = open
        ? [h('div', { class: 'findkids' }, ...(g.items.length ? g.items.map(row) : [h('p', { class: 'findsoon' }, 'Coming soon')]))]
        : [];
      return h('section', { class: 'findgroup' }, b, ...kids);
    }
    function paint() {
      host.innerHTML = '';
      const q = input.value.trim().toLowerCase();
      const groups = data[mode] || [];
      if (q) {
        const hits = [];
        groups.forEach((g) => {
          const groupHit = g.name.toLowerCase().indexOf(q) >= 0;
          g.items.forEach((it) => {
            if (groupHit || (it.blob || it.title || '').toLowerCase().indexOf(q) >= 0) hits.push(it);
          });
          if (!g.items.length && groupHit) hits.push({ title: g.name, href: '' });
        });
        if (!hits.length) host.append(h('p', { class: 'calm' }, 'No matches.'));
        else host.append(h('section', { class: 'findgroup' }, ...hits.map(row)));
        return;
      }
      groups.forEach((g) => host.append(section(g)));
    }
    modes.forEach(([id, label]) => {
      const b = h('button', { class: 'findtab' + (id === mode ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': id === mode ? 'true' : 'false' }, label);
      b.addEventListener('click', () => {
        mode = id;
        openKey = '';
        input.value = '';
        tabs.querySelectorAll('.findtab').forEach((el, i) => {
          const on = modes[i][0] === mode;
          el.classList.toggle('on', on);
          el.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        paint();
      });
      tabs.append(b);
    });
    input.addEventListener('input', () => { openKey = ''; paint(); });
    paint();
    app.append(h('div', { class: 'screen home simplepage findpage' }, h('div', { class: 'mwrap' },
      h('div', { class: 'gtop' }, pageNav('#/home')),
      h('h1', null, 'Find It'),
      h('div', { class: 'findstack' }, input, tabs), host)));
  }
  /* ---------- router ---------- */
  let lastRouted = '';
  function route() {
    const hash = location.hash || '#/home';
    if (hash === lastRouted && app.childElementCount) return;
    lastRouted = hash;
    modalRoot.innerHTML = '';
    app.innerHTML = ''; window.scrollTo(0, 0);
    let m;
    if (IR.spellRoute && IR.spellRoute(hash, app)) { /* spelling for every lesson */ }
    else if (IR.foundationRoute && IR.foundationRoute(hash, app)) { /* Foundation Skills */ }
    else if (IR.nkRoute && IR.nkRoute(hash, app)) { /* nk unit + Island Review (js/nk.js) */ }
    else if (IR.u5Route && IR.u5Route(hash, app)) { /* Unit 5 Silent e (js/u5.js) */ }
    else if (IR.u6Route && IR.u6Route(hash, app)) { /* Unit 6 Endings (js/u6.js) */ }
    else if (IR.u123Route && IR.u123Route(hash, app)) { /* Units 1 to 3 (js/u123.js) */ }
    else if (IR.u789Route && IR.u789Route(hash, app)) { /* Units 7 to 9 (js/u789.js) */ }
    else if (IR.u1012Route && IR.u1012Route(hash, app)) { /* Units 10 to 12 (js/u1012.js) */ }
    else if ((m = /^#\/lesson\/(\d+)/.exec(hash))) lessonScreen(parseInt(m[1], 10) - 1);
    else if (/^#\/chest[1-4]/.test(hash)) IR.chest.render(hash, app);
    else if (hash === '#/practice/spelling' || hash === '#/practice/fluency') { location.replace(hash.replace('#/practice/', '#/practice/skills/')); return; }
    else if ((m = /^#\/practice\/skills(?:\/([a-z]+))?$/.exec(hash))) skillScreen(m[1]);
    else if ((m = /^#\/practice\/(\w+)/.exec(hash))) practiceScreen(m[1]);
    else if (hash.startsWith('#/gems')) gemScreen();
    else if (hash.startsWith('#/about')) aboutScreen();
    else if (hash.startsWith('#/trail')) islandTrailPage();
    else if (hash.startsWith('#/find')) findScreen();
    else if ((m = /^#\/teachers\/slides\/(u1[012]\d)$/.exec(hash)) && IR.slides1012) IR.slides1012(m[1]);
    else if ((m = /^#\/teachers\/slides\/(ng|nk|u5|tricky|u61|u62|u63|u11|u12|u13|u14|u21|u22|u23|u24|u31|u32|u71|u72|u73|u81|u82|u83|u91|u92|u93|u94)$/.exec(hash))) slidesViewer(m[1]);
    else if (hash.startsWith('#/teachers')) { if (IR._slideCleanup) { IR._slideCleanup(); IR._slideCleanup = null; } teachersScreen(); }
    else if (hash.startsWith('#/placement/classic')) IR.placementClassic.render(app, (n) => {
      const bell = (IR.placementClassic.BELL || {})[n] || { unit: n, name: 'this bell' };
      if (bell.unit <= 3 && IR.u123Route) { location.hash = '#/u' + bell.unit; return; }
      if (builtUnitHref(bell.unit)) { location.hash = builtUnitHref(bell.unit); return; }
      if (bell.unit >= 7 && bell.unit <= 9 && IR.u789Route) { location.hash = '#/u' + bell.unit; return; }
      if (bell.unit === 4) { location.hash = '#/home'; setTimeout(() => openIsland('i3'), 0); return; }
      if (bell.unit === 5) { location.hash = '#/u5'; return; }
      if (bell.unit === 6) { location.hash = '#/u6'; return; }
      location.hash = '#/home';
      setTimeout(() => toast(bell.name + ' is coming soon in the full app. Try Glued Sounds for now.'), 50);
    });
    else if (hash.startsWith('#/placement')) IR.placement.render(app, (start) => {
      if (start.team) { location.hash = '#/foundation/letters/g' + start.team; return; }
      if (start.href) { location.hash = start.href; return; }
      const n = start.unit;
      if (n <= 3 && IR.u123Route) { location.hash = '#/u' + n; return; }
      if (builtUnitHref(n)) { location.hash = builtUnitHref(n); return; }
      if (n >= 7 && n <= 9 && IR.u789Route) { location.hash = '#/u' + n; return; }
      if (n === 4) { location.hash = '#/home'; setTimeout(() => openIsland('i3'), 0); return; }
      if (n === 5) { location.hash = '#/u5'; return; }
      if (n === 6) { location.hash = '#/u6'; return; }
      location.hash = '#/home';
      setTimeout(() => toast('Unit ' + n + ' is coming soon. Your starting point is saved for this reader.'), 50);
    });
    else if (hash.startsWith('#/library') && IR.u11Trail) IR.u11Trail.library(app, hash);
    else if (hash.startsWith('#/island3')) trailScreen();
    else if (hash.startsWith('#/check')) checkScreen();
    else if (hash.startsWith('#/result')) { IR.newScreen(); app.append(h('div', { class: 'screen resultscreen' })); IR.renderResult($('.resultscreen')); $('.resultscreen').prepend(h('div', { class: 'unitbar' }, pageNav('#/island3'))); }
    else homeScreen();
  }
  /* Nov 4 2026: "Back to Unit N" on every lesson / activity / game page of a unit. Opens that unit's lesson picker.
     Shared template: a new unit only needs one row here (route test + picker id + unit number). */
  IR.UNIT_ROUTES = IR.UNIT_ROUTES || [
    { n: 1, id: 'u1', href: '#/u1', test: (hs) => /^#\/u1(\/|$)/.test(hs) },
    { n: 2, id: 'u2', href: '#/u2', test: (hs) => /^#\/u2(\/|$)/.test(hs) },
    { n: 3, id: 'u3', href: '#/u3', test: (hs) => /^#\/u3(\/|$)/.test(hs) },
    { n: 4, id: 'i3', test: (hs) => /^#\/(nk|island3|lesson\/|review3|check|result)/.test(hs) || /^#\/spell\/(ng|nk)(\/|$)/.test(hs) },
    { n: 5, id: 'i5', test: (hs) => /^#\/(u5\d|review5)/.test(hs) || /^#\/spell\/u5(\/|$)/.test(hs) },
    { n: 6, id: 'u6', href: '#/u6', test: (hs) => /^#\/u6(\/|$)/.test(hs) || /^#\/spell\/u6(\/|$)/.test(hs) },
    { n: 7, id: 'u7', href: '#/u7', test: (hs) => /^#\/u7(\/|$)/.test(hs) },
    { n: 8, id: 'u8', href: '#/u8', test: (hs) => /^#\/u8(\/|$)/.test(hs) },
    { n: 9, id: 'u9', href: '#/u9', test: (hs) => /^#\/u9(\/|$)/.test(hs) },
    { n: 10, id: 'u10', href: '#/u10', test: (hs) => /^#\/u10(\/|$)/.test(hs) },
    { n: 11, id: 'u11', href: '#/u11', test: (hs) => /^#\/u11(\/|$)/.test(hs) },
    { n: 12, id: 'u12', href: '#/u12', test: (hs) => /^#\/u12(\/|$)/.test(hs) }];
  function addUnitBack() {
    /* Back in the page nav already goes one level up. A second "Back to Unit" button is not added. */
  }
  IR.addUnitBack = addUnitBack;
  const route0 = route; route = function () { route0(); addUnitBack(); setTimeout(addUnitBack, 60); };
  /* Route inside the click that opened the screen, so the first tap can start audio the way Unit 4 does. */
  let routeQueued = false;
  document.addEventListener('click', () => { if (routeQueued) return; routeQueued = true; queueMicrotask(() => { routeQueued = false; route(); }); }, true);
  window.addEventListener('hashchange', () => { if (routeQueued) return; route(); });
  IR.applySettings();
  route();
  window.addEventListener('error', (e) => { window.__irErrors = (window.__irErrors || []).concat(String(e.message)); });
  /* service worker is optional: the app renders without it */
  try {
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      const hadCtl = !!navigator.serviceWorker.controller;
      window.addEventListener('load', () => { try { navigator.serviceWorker.register('sw.js').then((r) => r.update()).catch(() => {}); } catch (e) {} });
      /* reload once, only when an older version was in control */
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        try { if (!hadCtl || sessionStorage.getItem('ir-sw-reloaded')) return; sessionStorage.setItem('ir-sw-reloaded', '1'); location.reload(); } catch (e) {}
      });
    }
  } catch (e) {}
})();
