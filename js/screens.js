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
    const reset = h('button', { class: 'btn small warn', type: 'button' }, 'Reset all progress');
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
      h('div', { class: 'row' }, hearNg, inst, reset),
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
  /* Continue opens the placement test when nothing is saved yet, otherwise the first unfinished built lesson. */
  function continueTarget() {
    const bell = IR.placement && IR.placement.saved ? IR.placement.saved() : null;
    const acts = (IR.S().progress && IR.S().progress.activities) || {};
    const any = Object.keys(acts).some((k) => acts[k] && acts[k].completed);
    const path = [
      { unit: 4, lesson: '4.1', href: '#/island3', done: () => IR.isDone('check') },
      { unit: 4, lesson: '4.2', href: '#/nk', done: () => IR.isDone('nk_check') },
      { unit: 5, lesson: '5.1', href: '#/u51', done: () => IR.isDone('u51_check') },
      { unit: 5, lesson: '5.2', href: '#/u53', done: () => IR.isDone('u53_check') },
      { unit: 6, lesson: '6.1', href: '#/u6/u61', done: () => IR.isDone('u61_check') },
      { unit: 6, lesson: '6.2', href: '#/u6/u62', done: () => IR.isDone('u62_check') },
      { unit: 6, lesson: '6.3', href: '#/u6/u63', done: () => IR.isDone('u63_check') }
    ];
    if (!any && !bell) return { href: '#/placement', sub: 'Pick up where you left off' };
    let startAt = 0;
    if (!any && bell) {
      const unitForBell = bell <= 3 ? 4 : bell === 4 ? 5 : 6;
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
    const unit = (n) => {
      const t = TILES[n]; const isl = n === BUILT && !!(D.islands || {})[BUILT_ID];
      const u5 = n === 5 && !!IR.u5Route;   /* Nov 3 2026 local: Unit 5 Silent e is open (js/u5.js: same lesson flow as Unit 4; picker data islands.i5) */
      const u6 = n === 6 && !!IR.u6Route;   /* Unit 6 Endings (-s, -es, -ed, -ing), same lesson flow as Unit 4 */
      const built = isl || u5 || u6;
      const st = !built ? 'soon' : n === BUILT && complete ? 'done' : n === BUILT ? 'here' : 'open';
      const note = st === 'here' ? 'You are here' : st === 'done' ? 'Done' : st === 'open' ? 'Open' : 'Coming soon';
      const label = 'Unit ' + n + ': ' + t[0] + ', ' + t[1].replace(/\u00b7/g, ',') + ', ' + t[2] + (t[2] === 1 ? ' lesson. ' : ' lessons. ') + note + (built ? '. Opens Unit ' + n + '.' : '.');
      const b = h('button', { class: 'tcard t-' + st + (st === 'here' ? ' t-current' : ''), type: 'button', 'data-id': 'u' + n, 'data-kind': 'island', 'data-n': n, 'aria-label': label },
        h('span', { class: 'tpic' }, h('img', { src: 'img/units/tile' + String(n).padStart(2, '0') + '.webp', alt: '', width: 600, height: 600, loading: n > 8 ? 'lazy' : 'eager' }),
          st === 'here' ? h('span', { class: 'herechip' }, 'You are here') : st === 'soon' ? h('span', { class: 'herechip soonchip' }, 'Coming soon') : null),
        h('span', { class: 'tbody' },
          h('span', { class: 'thead' }, h('span', { class: 'tdots', 'aria-hidden': 'true' }, ...t[3].map((c) => h('i', { class: 'tdot td-' + c }))), h('b', { class: 'tnum' }, 'Unit ' + n)),
          h('span', { class: 'tname' }, t[0]),
          h('span', { class: 'tsnd' }, t[1]),
          h('span', { class: 'tcount' }, t[2] + (t[2] === 1 ? ' lesson' : ' lessons'))));
      b.addEventListener('click', () => { if (u6) { Snd.stop(); location.hash = '#/u6'; } else if (u5) { openIsland('i5'); } else if (isl) openIsland(BUILT_ID); else { Snd.stop(); toast('Unit ' + n + ' is coming soon.'); } });
      return b;
    };
    const cover = h('img', { src: 'foundation/img/foundations_cover.jpg', alt: '' });
    const pic = h('span', { class: 'tpic' }, cover);
    cover.addEventListener('error', () => {
      pic.className = 'tpic tfaces';
      pic.replaceChildren(...['a_apple.jpg', 'm_manny_mangrove.jpg', 's_sami_sea_snake.jpg', 't_tama_sea_turtle.jpg'].map((file) => h('img', { src: 'foundation/img/letters/' + file, alt: '' })));
    });
    const foundations = h('button', {
      class: 'tcard',
      type: 'button',
      'data-id': 'foundations',
      'aria-label': 'Foundations. Learn the letters. Opens Foundation Skills.'
    },
      pic,
      h('span', { class: 'tbody' },
        h('span', { class: 'thead' }, h('b', { class: 'tnum' }, 'Foundations')),
        h('span', { class: 'tname' }, 'Learn the letters'),
        h('span', { class: 'tsnd' }, '\u00a0'),
        h('span', { class: 'tcount' }, '\u00a0')));
    foundations.addEventListener('click', () => { Snd.stop(); location.hash = '#/foundation'; });
    const cards = [foundations];
    for (let n = 1; n <= 22; n++) cards.push(unit(n));
    const grid = h('div', { class: 'bellpath', id: 'skymap' }, h('div', { class: 'bellgrid' }, ...cards));
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
    const tabs = h('nav', { class: 'hometabs', 'aria-label': 'More places' },
      trailBtn, sightDrop, tab('#/find', 'Find It', 'search'));
    /* Nov 6 2026: full-width home feature (approved banyan scene), then About + the hero beside the unit grid */
    const banner = h('header', { class: 'hbanner' }, h('h1', null, 'Island Readers'),
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
    /* Home card in the left column. 'A' = the picture on top (default); 'B' = heading above the picture. Test with ?hero=B. */
    const HERO_VARIANT = (/[?&]hero=B\b/.test(location.search) ? 'B' : 'A');
    const hero = h('section', { class: 'homefeature zf' + HERO_VARIANT, 'aria-label': 'Learn to read with Zip and Frill' },
      h('div', { class: 'zfpics' }, h('img', { class: 'homeart', src: 'img/home_zip_frill.webp', width: 1280, height: 720, alt: 'Zip and Frill sit on a tree root reading a book together. An orange bell hangs from the banyan behind them, and the island coast glows at sunset.' })),
      h('div', { class: 'hfbody' },
        h('div', { class: 'zfhead' }, h('h2', { class: 'zfline' }, 'Learn to read with Zip and Frill'), readAloudBtn()),
        h('p', { class: 'zfsub' }, 'Ring every bell by learning its sounds.'),
        continueButton()));
    app.append(h('div', { class: 'screen home mapscreen gridhome' }, h('div', { class: 'mwrap' }, banner, h('div', { class: 'homelay' }, h('div', { class: 'homeside' }, aboutDrop, hero, tabs), h('div', { class: 'bellslot' }, grid)))));
    /* Nov 3 2026: the whole left sidebar (About, Start here, Practice) stays in one spot while the tiles scroll (wide layouts only). */
    const side = app.querySelector('.homeside'); const scr = app.querySelector('.screen.home');
    const pin = () => {
      if (!side || !scr || !side.isConnected) { window.removeEventListener('resize', pin); return; }
      const nav = side.querySelector('.hometabs');
      const tabs = nav ? [...nav.querySelectorAll('.hometab')] : [];
      const relax = () => {
        side.style.removeProperty('height');
        side.style.removeProperty('max-height');
        side.style.removeProperty('gap');
        if (nav) nav.style.removeProperty('gap');
        tabs.forEach((t) => { t.style.removeProperty('height'); t.style.removeProperty('min-height'); t.style.removeProperty('max-height'); });
      };
      if (!matchMedia('(min-width:1000px)').matches) { side.style.removeProperty('--side-top'); relax(); return; }
      const banner = scr.querySelector('.hbanner');
      const bannerH = banner ? banner.offsetHeight : 0;
      side.style.setProperty('--side-top', bannerH + 'px');
      const room = Math.max(240, scr.getBoundingClientRect().bottom - side.getBoundingClientRect().top - 8);
      side.style.height = room + 'px';
      side.style.maxHeight = room + 'px';
      const open = side.querySelector('.sidedrop.is-open');
      if (!open && side.scrollHeight > side.clientHeight + 2) {
        side.style.gap = '8px';
        if (nav) nav.style.gap = '8px';
        tabs.forEach((t) => { t.style.height = '48px'; t.style.minHeight = '48px'; t.style.maxHeight = '48px'; });
      } else if (!open) {
        side.style.removeProperty('gap');
        if (nav) nav.style.removeProperty('gap');
        tabs.forEach((t) => { t.style.removeProperty('height'); t.style.removeProperty('min-height'); t.style.removeProperty('max-height'); });
      }
    };
    requestAnimationFrame(pin); window.addEventListener('resize', pin);
    const art = side.querySelector('.homeart');
    if (art && !art.complete) art.addEventListener('load', pin, { once: true });
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
  const TIPS = { hear: 'Let your child listen first, then point.', bells: 'Ask your child to read the word out loud first.', build: 'Say the word slowly together.', chain: 'Only one letter changes each time.', scramble: 'Say the word slowly, then find each part.', feed: 'Ask your child to read the word out loud, then feed Zip.', sentence: 'Read the sentence together at the end.', story: 'Reading it 3 times builds fluency.', check: 'Let your child work alone. Just cheer.' };   /* optional extra: not needed to finish the unit, not counted in the total time */
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
  function itemCard(item, num) {
    const body = [
      num ? h('span', { class: 'gamenum' }, String(num)) : null,
      num && !item.img && !(item.imgs && item.imgs.length) ? h('span', { class: 'gameico', 'aria-hidden': 'true' }, icon('play')) : null,
      item.imgs && item.imgs.length
        ? h('span', { class: 'gamepair' }, ...item.imgs.map((src) => h('img', { class: num ? 'gamepic' : 'storypic', src: src, alt: '' })))
        : (item.img ? h('img', { class: num ? 'gamepic' : 'storypic', src: item.img, alt: item.alt || '' }) : null),
      h('span', { class: 'gametxt' }, h('b', null, item.title), item.note ? h('span', { class: 'gamenote' }, item.note) : null, item.min ? h('span', { class: 'gamemin' }, item.min + ' min') : null),
      item.done ? h('span', { class: 'gamedone', 'aria-hidden': 'true' }, icon('check')) : null
    ];
    const cls = (item.big ? 'storycard' : (num ? 'gamecard' : 'stepcard')) + (item.done ? ' done' : '');
    if (item.href && item.href.charAt(0) !== '#') return h('a', { class: cls, href: item.href, target: '_blank', rel: 'noopener' }, ...body);
    return h('button', { class: cls, type: 'button', onclick: goItem(item) }, ...body);
  }
  function stepHead(n, label) {
    return h('div', { class: 'stephead' }, h('span', { class: 'stepnum' }, String(n)), h('span', { class: 'steplab' }, label));
  }
  function stepSection(n, label, items, numbered, extra) {
    const cards = !items || !items.length
      ? h('p', { class: 'stepsoon' }, 'Coming soon')
      : numbered
        ? h('ol', { class: 'gamegrid' + (extra || '') }, ...items.map((item, i) => h('li', null, itemCard(item, i + 1))))
        : h('div', { class: 'lessonrow' }, ...items.map((item) => itemCard(item)));
    return h('section', { class: 'stepblock' }, stepHead(n, label), cards);
  }
  function teacherBox(plan) {
    plan = plan || {};
    const files = plan.files || [];
    const days = plan.days || [];
    const slides = days.length
      ? days.map((day) => h('button', { class: 'teachlink', type: 'button', onclick: () => { Snd.stop(); location.hash = day.href; } }, day.label))
      : [plan.slides ? h('button', { class: 'teachlink', type: 'button', onclick: () => { Snd.stop(); location.hash = plan.slides; } }, 'Open the slideshow') : h('p', { class: 'teachsoon' }, 'Coming soon')];
    const panel = h('div', { class: 'teachpop', hidden: '' },
      h('p', { class: 'teachstep' }, h('span', null, '1'), 'Slideshow'),
      ...slides,
      h('p', { class: 'teachstep' }, h('span', null, '2'), 'Printables'),
      files.length ? h('div', null, ...files.map((file) => h('a', { class: 'teachlink', href: file.href, target: '_blank', rel: 'noopener' }, file.title))) : h('p', { class: 'teachsoon' }, 'Coming soon'));
    const btn = h('button', { class: 'teachbox', type: 'button', 'aria-expanded': 'false' }, 'Teacher Materials');
    const wrap = h('div', { class: 'teachcorner' }, btn, panel);
    function onDoc(e) { if (!wrap.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('is-open', open);
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
      if (open) {
        document.addEventListener('click', onDoc);
        document.addEventListener('keydown', onKey);
      }
    }
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(panel.hidden); });
    return wrap;
  }
  IR.teacherBox = teacherBox;
  function modeBar(plan) {
    plan = plan || {};
    const labels = plan.labels || ['Lesson', 'Games', 'Story'];
    return h('div', { class: 'modebar' },
      plan.note === false ? null : h('p', { class: 'stepnote' }, plan.note || 'Watch the lesson, then play.'),
      plan.before || null,
      h('div', { class: 'stepflow' },
        plan.choose ? null : stepSection(1, labels[0], plan.lesson || []),
        plan.choose ? null : stepSection(2, labels[1], plan.games || [], true, plan.gameClass || ''),
        plan.choose || !plan.story ? null : stepSection(3, labels[2], [plan.story]),
        ...(plan.choose || []).map((item, i) => stepSection(i + 1, item.title, [item]))));
  }
  IR.modeBar = modeBar;
  function trailScreen() {
    IR.newScreen();
    const secs = unitSections();
    const LK = 'ir_sess_ng'; const prevH = IR._ngHashWas || '';
    if (!/^#\/(island3|lesson\/|check)/.test(prevH)) try { sessionStorage.removeItem(LK); } catch (e) {}
    IR._ngHashWas = location.hash || '#/island3';
    const pick = (group) => secs.filter((r) => r.group === group).map((r) => ({ title: r.title, href: r.href, note: TIPS[r.id], min: r.min }));
    const story = pick('story')[0];
    if (story) { story.title = D.storyTitle || story.title; story.note = 'Story Time'; story.img = IR.storyCovers['4.1']; story.alt = D.storyTitle || ''; story.big = true; }
    app.append(h('div', { class: 'screen trailscreen unitpage unitA orangeunit stepage' },
      h('header', { class: 'uA-top' }, pageNav('#/home'), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 4 Lesson 1'), 'ng'), teacherBox({
        slides: '#/teachers/slides/ng',
        files: [
          { title: 'Daily practice sheets', href: 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf' },
          { title: 'Teacher pack', href: 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf' }
        ]
      })),
      modeBar({
        lesson: pick('lesson'),
        games: pick('activities'),
        story: story,
        slides: '#/teachers/slides/ng',
        files: [
          { title: 'Daily practice sheets', href: 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf' },
          { title: 'Teacher pack', href: 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf' }
        ]
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
        instrBox.append(IR.speakerBtn(() => Snd.play(A.prompt(pid.replace(/^p_/, 'p_'))), 'Hear the directions'), h('span', { class: 'itext' }, text));
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
    const u6 = window.IR_DATA_U6;
    if (u6 && Array.isArray(u6.lessons)) u6.lessons.forEach((L) => { if (L && Array.isArray(L.story) && L.story.length) add('6', L.n || L.key, L.name, L.storyTitle, '#/u6/' + L.key + '/read'); });
    else if (u6 && Array.isArray(u6.story) && u6.story.length) add('6', '6', u6.name || 'Endings', u6.storyTitle, '#/u6/read');
    return out;
  }
  /* Same open/locked rule as the home map: Units 4, 5, and 6 are open. Earlier and later units are still coming soon. */
  function spellUnitOpen(n) {
    return n === 4 || (n === 5 && !!IR.u5Route) || (n === 6 && !!IR.u6Route);
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
    /* One card for every lesson. Item types stay in this order, with the same labels. */
    function lessonCard(lesson) {
      const kinds = [
        { key: 'board', primary: true, label: 'Open on smartboard', note: 'Full-screen slide show in the browser. No download needed.' },
        { key: 'slides', download: true, label: 'Download slides' + (lesson.days ? (' \u00b7 ' + lesson.days + ' days (PPTX)') : ' (PPTX)'), note: 'One PowerPoint for the whole sound.' },
        { key: 'daily', label: 'Daily practice sheets (PDF)', note: lesson.days ? ('Worksheets for each day, labeled Day 1 to Day ' + lesson.days + '.') : 'Worksheets for each day.' },
        { key: 'pack', label: 'Teacher pack (PDF)', note: 'Slides with notes, worksheets and answer key.' }
      ];
      const rows = kinds.map((kind) => {
        const href = lesson[kind.key];
        if (!href) {
          return [
            h('span', { class: 'btn big tmlink is-soon' + (kind.primary ? ' primary' : ''), 'aria-disabled': 'true' }, kind.label),
            h('p', { class: 'tmnote' }, 'Coming soon.')
          ];
        }
        const attrs = { class: 'btn big tmlink' + (kind.primary ? ' primary' : ''), href: href };
        if (kind.download) attrs.download = '';
        else if (!href.startsWith('#')) { attrs.target = '_blank'; attrs.rel = 'noopener'; }
        return [h('a', attrs, kind.label), h('p', { class: 'tmnote' }, kind.note)];
      });
      return h('div', { class: 'tmcard' },
        h('h3', null, h('span', { class: 'tmsound' }, lesson.s), ' ' + lesson.lesson),
        ...rows.flat());
    }
    const UNITS = [
      { name: 'Unit 4 \u00b7 Glued Sounds', sounds: [
        { s: 'ng', lesson: 'Lesson 4.1', days: 3, board: '#/teachers/slides/ng', slides: 'teachers/ng/Lesson3.1_ng_Slide_Presentation.pptx', daily: 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf', pack: 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf' },
        { s: 'nk', lesson: 'Lesson 4.2', days: 3, board: '#/teachers/slides/nk', slides: 'teachers/nk/Lesson3.2_nk_Slide_Presentation.pptx', daily: 'teachers/nk/Lesson3.2_nk_Daily_Practice_Sheets.pdf', pack: 'teachers/nk/Lesson3.2_nk_Teacher_Pack.pdf' }
      ] },
      { name: 'Unit 5 \u00b7 Silent e', sounds: [
        { s: 'a_e', lesson: 'Lesson 5.1', daily: 'materials/unit5/Unit5_Teacher_Led_Student_Sheets.pdf', pack: 'materials/unit5/Lesson5.1_Teacher_Led_Checks.pdf', bundle: 'materials/unit5/Unit5_Teacher_Led_Checks_Combined.pdf' },
        { s: 'e', lesson: 'Lesson 5.2', daily: 'materials/unit5/Unit5_Teacher_Led_Student_Sheets.pdf', pack: 'materials/unit5/Lesson5.2_Teacher_Led_Checks.pdf', bundle: 'materials/unit5/Unit5_Teacher_Led_Checks_Combined.pdf' }
      ] },
      { name: 'Learn the Letters', sounds: [
        { s: 'amst', lesson: 'Team 1', board: '#/foundation/slides/g1' }
      ] }
    ];
    app.append(h('div', { class: 'screen tmscreen' }, h('div', { class: 'tmwrap' },
      h('div', { class: 'abtop' }, pageNav('#/home')),
      h('h1', null, 'Teacher materials'),
      h('p', { class: 'tmlead' }, 'For teaching in class. Students practice on their own in the app.'),
      ...UNITS.map((u) => h('section', { class: 'tmunit' }, h('h2', null, u.name), h('div', { class: 'tmgrid' }, ...u.sounds.map(lessonCard)))))));
  }
  /* In-app week-deck slideshow for smartboard (ng / nk). Keeps PPTX download on the teachers page. */
  function slidesViewer(sound) {
    IR.newScreen();
    const root = h('div', { class: 'screen slidescreen', tabindex: '0' });
    const stage = h('div', { class: 'slide-stage' });
    const img = h('img', { class: 'slide-img', alt: sound + ' week slide' });
    const counter = h('div', { class: 'slide-count', 'aria-live': 'polite' }, '');
    const prev = h('button', { class: 'slide-nav slide-prev', type: 'button', 'aria-label': 'Previous slide' }, '\u25C0');
    const next = h('button', { class: 'slide-nav slide-next', type: 'button', 'aria-label': 'Next slide' }, '\u25B6');
    const top = h('div', { class: 'slide-top' },
      pageNav('#/teachers'),
      h('h1', { class: 'slide-title' }, sound + ' week slides'),
      counter);
    stage.append(prev, img, next);
    root.append(top, stage);
    app.append(root);
    let slides = []; let i = 0; let keyHandler = null;
    function show() {
      if (!slides.length) { img.removeAttribute('src'); counter.textContent = 'No slides'; prev.disabled = true; next.disabled = true; return; }
      img.src = slides[i];
      counter.textContent = (i + 1) + ' / ' + slides.length;
      prev.disabled = i <= 0; next.disabled = i >= slides.length - 1;
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
    IR._slideCleanup = () => { window.removeEventListener('keydown', keyHandler); };
    fetch('teachers/' + sound + '/slides.json').then((r) => r.json()).then((man) => {
      slides = man.slides || []; i = 0; show();
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
    if (!any && IR.placement && IR.placement.saved) {
      const start = IR.placement.saved();
      if (start === 10) here = 22;
      else {
        const bell = IR.placement.BELL && IR.placement.BELL[start];
        if (bell && bell.unit) here = bell.unit;
      }
    }
    return { finished: finished, here: here };
  }
  function unitStatus(n, place) {
    if (place.finished[n]) return 'Done';
    if (n === place.here) return 'You are here';
    if (n === 4 || (n === 5 && IR.u5Route) || (n === 6 && IR.u6Route)) return 'Open';
    return 'Coming soon';
  }
  function openTrailBell(n) {
    const u5 = n === 5 && !!IR.u5Route;
    const u6 = n === 6 && !!IR.u6Route;
    const isl = n === 4 && !!(D.islands || {}).i3;
    if (u6) { Snd.stop(); location.hash = '#/u6'; return; }
    if (u5) { openIsland('i5'); return; }
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
    else if ((m = /^#\/lesson\/(\d+)/.exec(hash))) lessonScreen(parseInt(m[1], 10) - 1);
    else if (/^#\/chest[1-4]/.test(hash)) IR.chest.render(hash, app);
    else if (hash === '#/practice/spelling' || hash === '#/practice/fluency') { location.replace(hash.replace('#/practice/', '#/practice/skills/')); return; }
    else if ((m = /^#\/practice\/skills(?:\/([a-z]+))?$/.exec(hash))) skillScreen(m[1]);
    else if ((m = /^#\/practice\/(\w+)/.exec(hash))) practiceScreen(m[1]);
    else if (hash.startsWith('#/gems')) gemScreen();
    else if (hash.startsWith('#/about')) aboutScreen();
    else if (hash.startsWith('#/trail')) islandTrailPage();
    else if (hash.startsWith('#/find')) findScreen();
    else if ((m = /^#\/teachers\/slides\/(ng|nk)$/.exec(hash))) slidesViewer(m[1]);
    else if (hash.startsWith('#/teachers')) { if (IR._slideCleanup) { IR._slideCleanup(); IR._slideCleanup = null; } teachersScreen(); }
    else if (hash.startsWith('#/placement')) IR.placement.render(app, (n) => {
      const bell = (IR.placement.BELL || {})[n] || { unit: n, name: 'this bell' };
      if (bell.unit === 4) { location.hash = '#/home'; setTimeout(() => openIsland('i3'), 0); return; }
      if (bell.unit === 5) { location.hash = '#/home'; setTimeout(() => openIsland('i5'), 0); return; }
      if (bell.unit === 6) { location.hash = '#/u6'; return; }
      location.hash = '#/home';
      setTimeout(() => toast(bell.name + ' is coming soon in the full app. Try Glued Sounds for now.'), 50);
    });
    else if (hash.startsWith('#/island3')) trailScreen();
    else if (hash.startsWith('#/check')) checkScreen();
    else if (hash.startsWith('#/result')) { IR.newScreen(); app.append(h('div', { class: 'screen resultscreen' })); IR.renderResult($('.resultscreen')); $('.resultscreen').prepend(h('div', { class: 'unitbar' }, pageNav('#/island3'))); }
    else homeScreen();
  }
  /* Nov 4 2026: "Back to Unit N" on every lesson / activity / game page of a unit. Opens that unit's lesson picker.
     Shared template: a new unit only needs one row here (route test + picker id + unit number). */
  IR.UNIT_ROUTES = IR.UNIT_ROUTES || [
    { n: 4, id: 'i3', test: (hs) => /^#\/(nk|island3|lesson\/|review3|check|result)/.test(hs) || /^#\/spell\/(ng|nk)(\/|$)/.test(hs) },
    { n: 5, id: 'i5', test: (hs) => /^#\/(u5\d|review5)/.test(hs) || /^#\/spell\/u5(\/|$)/.test(hs) },
    { n: 6, id: 'u6', href: '#/u6', test: (hs) => /^#\/u6(\/|$)/.test(hs) || /^#\/spell\/u6(\/|$)/.test(hs) }];
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
