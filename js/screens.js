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
  function gearButton() {
    const b = h('button', { class: 'gear', type: 'button', 'aria-label': 'Parent and Teacher Materials. Press and hold.' }, icon('gear'));
    let t = null;
    const start = () => { b.classList.add('holding'); t = setTimeout(() => { b.classList.remove('holding'); openGrownups(); }, 800); };
    const stop = () => { b.classList.remove('holding'); clearTimeout(t); };
    b.addEventListener('pointerdown', start); b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop); b.addEventListener('pointercancel', stop);
    b.addEventListener('click', () => toast('Parent and Teacher Materials: press and hold.'));
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
      h('a', { class: 'btn big primary tmbtn', href: '#/about', onclick: () => { modalRoot.innerHTML = ''; } }, 'About Island Readers'),
      h('a', { class: 'btn big tmbtn', href: '#/teachers', onclick: () => { modalRoot.innerHTML = ''; } }, 'Teacher materials'),
      h('p', null, 'This is an early version of Island Readers. Unit 4 (ng and nk) is open now, and more units are on the way. Progress is saved only on this device. Nothing is sent anywhere.'),
      h('p', null, 'Check best score: ' + (sc.best == null ? 'not taken yet' : sc.best + ' of 10') + (sc.attempts ? ' (' + sc.attempts + ' tries)' : '') + '.'),
      h('label', { class: 'opt' }, calm, ' Calm motion (fish hold still, no wiggles)'),
      h('label', { class: 'opt' }, open, ' Open every lesson and the check (for testing)'),
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
    const imgs = (u) => h('div', { class: 'uimg' }, ...u.img.map((n) => h('img', { src: 'img/' + ({ zip: 'zipA', frill: 'frillC' }[n] || n) + '.webp', alt: '' })), u.state === 'open' ? null : h('span', { class: 'lk' }, icon('lock')));
    const stars = (u) => h('div', { class: 'dots', 'aria-hidden': 'true' }, ...Array.from({ length: u.total }, (_, k) => h('span', { class: 'sstar' + (k < u.done ? ' on' : '') }, icon('star'))));
    const cards = info.list.map((u) => {
      const title = u.kind === 'review' ? 'Review' : u.name;
      const kind = u.kind === 'review' ? 'Unit ' + w.n + ' Review' : 'Lesson ' + w.n + '.' + (info.list.indexOf(u) + 1);   /* naming standard: Unit 3 = Island 3; ng = Lesson 3.1, nk = Lesson 3.2 */
      const body = h('div', { class: 'ubody' }, h('div', { class: 'uk' }, kind), h('h2', null, title),
        h('div', { class: 'umin' }, u.min ? 'About ' + u.min + ' min' : ''), u.desc ? h('div', { class: 'rvd' }, u.desc) : null, stars(u),
        u.state === 'open' ? h('div', { class: 'uprog' }, u.done + ' of ' + u.total + ' stars' + (u.soft ? ' \u00b7 ' + u.soft : '')) : h('div', { class: 'uprog lockmsg' }, icon('lock'), u.lockMsg));
      const card = h('button', { class: 'tapcard ucard ' + (u.state === 'open' ? 'open' : 'locked') + (u.kind === 'review' ? ' rv' : ''), type: 'button', 'data-unit': u.id, 'data-state': u.state,
        'aria-label': (u.kind === 'review' ? 'Unit ' + w.n + ' Review' : 'Lesson ' + w.n + '.' + (info.list.indexOf(u) + 1) + ': ' + u.name) + '. ' + (u.state === 'open' ? u.done + ' of ' + u.total + ' stars. Open.' : 'Locked. ' + u.lockMsg + '.'),
        onclick: () => { Snd.stop(); if (u.state === 'open') { modalRoot.innerHTML = ''; location.hash = u.href; } else toast(u.lockMsg + '.'); } }, imgs(u), body);
      if (u.state === 'open') body.append(h('span', { class: 'obtn' }, 'Open lesson'));
      return card;
    });
    const nextIs0 = WORLD[WORLD.indexOf(w0) + 1]; const nextIs = nextIs0 && nextIs0.kind === 'island' ? { kind: 'island', n: w.n + 1 } : nextIs0;
    /* Unit 5 Silent e is already open locally/live; do not say it still unlocks after Unit 4 Review. */
    const nextOpen = nextIs && ((nextIs.n === 5 && !!IR.u5Route) || info.done);
    const note = nextIs && nextIs.kind === 'island' ? h('div', { class: 'pnote' }, icon(nextOpen ? 'star' : 'lock'), nextOpen ? 'Unit ' + nextIs.n + ' is unlocked!' : 'Unit ' + nextIs.n + ' unlocks when the Unit ' + w.n + ' Review is done') : null;
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
      ['Silent e', 'a_e \u00b7 i_e \u00b7 o_e \u00b7 u_e', 2, ['yellow']], ['Endings', '-s \u00b7 -es \u00b7 -ed \u00b7 -ing', 4, ['green']],
      ['Syllables', 'closed \u00b7 open', 3, ['lblue']], ['Tricky Sounds', 'tch \u00b7 dge \u00b7 -ild \u00b7 -old', 3, ['dblue']],
      ['Bossy R', 'ar \u00b7 or \u00b7 er \u00b7 ir \u00b7 ur', 4, ['purple']], ['More Bossy R', 'air \u00b7 are \u00b7 ear', 2, ['pink']],
      ['Long A & E Teams', 'ai \u00b7 ay \u00b7 ee \u00b7 ea \u00b7 ey', 2, ['silver']], ['Long O & I Teams', 'oa \u00b7 ow \u00b7 oe \u00b7 ie \u00b7 igh', 3, ['red', 'red']],
      ['The oo Sounds', 'oo \u00b7 ew \u00b7 ui \u00b7 ue', 4, ['coral', 'coral']], ['The au Sounds', 'au \u00b7 aw \u00b7 augh \u00b7 ea', 2, ['orange', 'orange']],
      ['Sliding Vowels', 'oi \u00b7 oy \u00b7 ou \u00b7 ow', 3, ['yellow', 'yellow']], ['Tricky Teams', 'ei \u00b7 eigh \u00b7 ew \u00b7 ough', 3, ['green', 'green']],
      ['Soft c and g', 'soft c \u00b7 soft g', 1, ['lblue', 'lblue']], ['Silent Letters', 'kn \u00b7 wr \u00b7 mb \u00b7 gn \u00b7 gh', 2, ['dblue', 'dblue']],
      ['Suffixes', '-er \u00b7 -est \u00b7 -ly \u00b7 -ful', 6, ['purple', 'purple']], ['Suffix Spelling Rules', 'double \u00b7 drop e \u00b7 y to i', 4, ['pink', 'pink']],
      ['Prefixes', 'un- \u00b7 pre- \u00b7 re- \u00b7 dis-', 5, ['rainbow']], ['Big Endings', '-tion \u00b7 -ture \u00b7 -ment', 6, ['gold']]];
    const BUILT = 4, BUILT_ID = 'i3';
    const SKILL = {}; TILES.forEach((t, n) => { if (t) SKILL[n] = t[0]; });
    const unit = (n) => {
      const t = TILES[n]; const isl = n === BUILT && !!(D.islands || {})[BUILT_ID];
      const u5 = n === 5 && !!IR.u5Route;   /* Nov 3 2026 local: Unit 5 Silent e is open (js/u5.js: same lesson flow as Unit 4; picker data islands.i5) */
      const u6 = n === 6 && !!IR.u6Route;   /* Unit 6 Endings (-s, -es, -ed, -ing), same lesson flow as Unit 4 */
      const open = u5 || u6;
      const st = n < BUILT ? 'locked' : n === BUILT ? (complete ? 'done' : 'here') : open ? 'open' : 'locked'; const lit = n === BUILT + 1 && complete;
      const note = open ? 'Open' : st === 'here' ? 'You are here' : n === BUILT ? 'Finished' : st === 'done' ? 'Done' : lit ? 'Unlocked' : 'Coming soon';
      const label = 'Unit ' + n + ': ' + t[0] + ', ' + t[1].replace(/\u00b7/g, ',') + ', ' + t[2] + (t[2] === 1 ? ' lesson. ' : ' lessons. ') + note + (n === BUILT || open ? '. Opens Unit ' + n + '.' : '.');
      const b = h('button', { class: 'tcard t-' + st + (st === 'here' ? ' t-current' : ''), type: 'button', 'data-id': 'u' + n, 'data-kind': 'island', 'data-n': n, 'aria-label': label },
        h('span', { class: 'tpic' }, h('img', { src: 'img/units/tile' + String(n).padStart(2, '0') + '.webp', alt: '', width: 600, height: 600, loading: n > 8 ? 'lazy' : 'eager' })),
        h('span', { class: 'tbody' },
          h('span', { class: 'thead' }, h('span', { class: 'tdots', 'aria-hidden': 'true' }, ...t[3].map((c) => h('i', { class: 'tdot td-' + c }))), h('b', { class: 'tnum' }, 'Unit ' + n)),
          h('span', { class: 'tname' }, t[0]), h('span', { class: 'tsnd' }, ...t[1].split(' \u00b7 ').map((x, i, a) => h('span', null, x + (i < a.length - 1 ? ' \u00b7' : '')))),
          h('span', { class: 'tmeta' }, t[2] + (t[2] === 1 ? ' lesson' : ' lessons') + ' \u00b7 ' + note)));
      b.addEventListener('click', () => { if (u6) { Snd.stop(); location.hash = '#/u6'; } else if (u5) { openIsland('i5'); } else if (isl) openIsland(BUILT_ID); else { Snd.stop(); toast(st === 'done' ? 'Unit ' + n + ' is done. It is part of the full app.' : n < BUILT ? 'Unit ' + n + ' is coming soon in the full app!' : lit ? 'Unit ' + n + ' is unlocked! It is coming soon in the full app.' : 'Unit ' + n + ' is coming soon! Finish Unit ' + BUILT + ' first.'); } });
      return b;
    };
    const grid = h('div', { class: 'ugrid tgrid', id: 'skymap' }, ...Array.from({ length: 22 }, (_, i) => unit(i + 1)));
    const sideEntry = (href, name, note) => h('a', { class: 'sideentry', href: href, 'aria-label': name + (note ? '. ' + note : '') },
      h('span', { class: 'sidetext' }, h('b', null, name), note ? h('small', null, note) : null),
      h('span', { class: 'cardgo', 'aria-hidden': 'true' }, 'Open'));
    const practice = h('nav', { class: 'sidenav', 'aria-label': 'Sections' },
      sideEntry('#/home', 'Home', 'The unit list'),
      sideEntry('#/trail', 'Island Trail', 'Start here to find your first bell'),
      sideEntry('#/practice/skills', 'Targeted Skills', 'Practice one skill at a time'),
      sideEntry('#/boxes', 'Sight Word Treasure Boxes', 'Heart words and sight words'),
      sideEntry('#/reading-room', 'Reading Room', 'Stories and passages'));
    const hero = h('p', { class: 'sr-only' }, 'Learn to read with Zip and Frill. Ring every bell by learning its sounds. Start here to find your first bell.');
    const banner = h('header', { class: 'hbanner' }, h('h1', null, 'Island Readers'),
      h('div', { class: 'grownwrap' }, h('span', { class: 'grownlab' }, 'Parent and Teacher Materials'), IR.ui.gearButton()));
    const cur = complete ? BUILT + 1 : BUILT;
    const youbar = h('button', { class: 'youbar', type: 'button', 'aria-label': 'You are here: Unit ' + cur + ', ' + SKILL[cur] + '. Dots show all 22 units. ' + nEarned + ' of 10 gems. Opens the gem box.', onclick: () => { Snd.stop(); location.hash = '#/gems'; } },
      h('span', { class: 'ybtxt' }, 'You are here: ', h('b', null, 'Unit ' + cur + ' \u00b7 ' + SKILL[cur])),
      h('span', { class: 'ybdots', 'aria-hidden': 'true' }, ...TILES.slice(1).map((t, i) => h('i', { class: 'tdot td-' + t[3][0] + (i + 1 === cur ? ' ybcur' : complete && i + 1 === BUILT ? ' ybdone' : '') }))));
    app.append(h('div', { class: 'screen home mapscreen gridhome' }, h('div', { class: 'mwrap' }, banner, h('div', { class: 'homelay' }, h('div', { class: 'homeside' }, h('a', { class: 'btn big aboutbtn', href: '#/about' }, 'About Island Readers'), hero, practice), grid)), youbar));
    /* Nov 3 2026: the whole left sidebar (About, Start here, Practice) stays in one spot while the tiles scroll (wide layouts only). */
    const side = app.querySelector('.homeside'); const scr = app.querySelector('.screen.home');
    const pin = () => {
      if (!side || !scr || !side.isConnected) { window.removeEventListener('resize', pin); return; }
      side.style.top = ''; side.style.maxHeight = ''; side.style.overflowY = '';
      if (!matchMedia('(min-width:1100px)').matches) return;
      const top = Math.round(side.getBoundingClientRect().top - scr.getBoundingClientRect().top + scr.scrollTop);
      const bar = app.querySelector('.youbar'); const barH = bar ? bar.getBoundingClientRect().height + 24 : 16;
      side.style.top = top + 'px'; side.style.maxHeight = Math.max(240, innerHeight - top - barH) + 'px'; side.style.overflowY = 'auto';
    };
    requestAnimationFrame(pin); window.addEventListener('resize', pin);
  }
  function gemScreen() {
    IR.newScreen(); const earned = gemsEarned(); const nEarned = earned.filter(Boolean).length; const nx = gemNext();
    const back = h('button', { class: 'back homebtn', type: 'button', onclick: () => { location.hash = '#/home'; } }, icon('back'), h('span', null, 'Map'));
    const cells = GEMS.map((g, i) => h('div', { class: 'gcell' + (earned[i] ? ' got' : i === nx ? ' next' : '') },
      h('div', { class: 'gimg' }, h('img', { src: gemSrc(i), alt: earned[i] ? g[1] + ' gem' : '' })),
      h('b', { style: earned[i] || i === nx ? 'color:' + g[2] : '' }, g[1]), h('small', null, 'Unit ' + (i + 1) + (i === nx ? ' \u00b7 next' : ''))));
    app.append(h('div', { class: 'screen gemscreen' }, h('div', { class: 'mwrap' }, h('div', { class: 'gtop' }, back),
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
  function trailScreen() {
    const S = IR.S(); IR.newScreen();
    const secs = unitSections(); const nx = nextUp(); const req = secs.filter((r) => !r.optional); const doneN = req.filter((r) => r.done).length; const total = req.length; const complete = doneN === total;
    const totalMin = req.reduce((a, r) => a + r.min, 0);
    const star = (on) => h('span', { class: 'sstar' + (on ? ' on' : ''), 'aria-hidden': 'true' }, icon(on ? 'star' : 'starOutline'));
    const aria = (r, extra) => r.label + '. ' + r.min + ' minutes. ' + extra + (r.done ? ' Done, star earned.' : nx && nx.id === r.id ? ' Next up.' : '');
    const actFlags = secs.filter((r) => r.group === 'activities').map((r) => !!r.done);
    function bigBox(r) {
      const lesson = r.group === 'lesson';
      return IR.pairCard({
        lesson: lesson,
        kicker: lesson ? 'Lesson' : 'Story',
        title: r.title,
        min: r.min,
        href: r.href,
        img: lesson ? IR.lessonArt : IR.storyCovers['4.1'],
        alt: lesson ? IR.lessonArtAlt : 'The Twigs in the Bell',
        done: r.done,
        next: nx && nx.id === r.id,
        flags: actFlags
      });
    }
    function actRow(r) {
      const isNext = nx && nx.id === r.id;
      return h('li', null, h('button', { class: 'stopcard arow gamestop' + (r.done ? ' done' : '') + (isNext ? ' nextup' : ''), type: 'button', 'data-id': r.id, 'data-group': 'activities',
        'aria-label': aria(r, 'Activity ' + r.act + '.'), 'aria-current': isNext ? 'step' : null, onclick: () => { Snd.stop(); location.hash = r.href; } },
        h('span', { class: 'snum', 'aria-hidden': 'true' }, String(r.act)),
        h('span', { class: 'stxt' }, h('b', null, r.title), TIPS[r.id] ? h('span', { class: 'sblurb' }, TIPS[r.id]) : null),
        h('span', { class: 'smin' + (r.optional ? ' opt' : '') }, r.optional ? 'Optional' : r.min + ' min'),
        h('span', { class: 'sside' }, star(r.done), h('span', { class: 'slabel ' + (isNext ? 'tag' : 'none') }, isNext ? 'Next' : ''))));
    }
    const LK = 'ir_sess_ng'; const prevH = IR._ngHashWas || '';
    if (!/^#\/(island3|lesson\/|check)/.test(prevH)) try { sessionStorage.removeItem(LK); } catch (e) {}
    IR._ngHashWas = location.hash || '#/island3';
    let lit = {}; try { lit = JSON.parse(sessionStorage.getItem(LK) || '{}'); } catch (e) {}
    const lights = h('div', { class: 'clights', role: 'status', 'aria-label': 'Session progress lights' }, h('span', { class: 'clab' }, 'This visit:'),
      h('span', { class: 'clightdots' }, ...secs.map((r) => h('span', { class: 'clight' + (lit[r.id] || r.done ? ' on' : ''), 'data-kind': r.group, 'data-id': r.id, title: r.title }))));
    const left = h('section', { class: 'uA-sec uA-start' }, h('h2', { class: 'uA-h' }, 'Start here'), h('ul', { class: 'uA-left' }, ...secs.filter((r) => r.group !== 'activities').map(bigBox)));
    const right = h('section', { class: 'uA-sec uA-right' }, lights, h('h2', { class: 'uA-h' }, 'Activities'), h('ol', { class: 'stoplist uA-acts' }, ...secs.filter((r) => r.group === 'activities').map(actRow)));
    const foot = h('footer', { class: 'uA-foot island4 ' + (complete ? 'open' : 'locked'), 'aria-live': 'polite' },
      h('span', { class: 'i4ico', 'aria-hidden': 'true' }, icon(complete ? 'star' : 'lock')),
      h('span', { class: 'i4txt' }, h('small', null, complete ? 'Unit 4 is unlocked!' : 'Unit 4 unlocks when all stars are done')),
      h('span', { class: 'i4count' }, doneN + ' of ' + total));
    app.append(h('div', { class: 'screen trailscreen unitpage unitA orangeunit' },
      h('header', { class: 'uA-top' }, homeButton(), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 4 \u00b7 Lesson 4.1 \u00b7 '), 'ng'),
        h('button', { class: 'cartoonpill', type: 'button', 'aria-label': 'Welcome cartoon, optional. Opens a video.', onclick: () => IR.openCartoon() }, icon('play'), h('span', { class: 'cp-long' }, 'Welcome Cartoon (optional)'), h('span', { class: 'cp-short' }, 'Cartoon')),
        h('span', { class: 'uA-time', 'aria-label': 'About ' + totalMin + ' minutes in total' }, h('span', { class: 't-long' }, 'About ' + totalMin + ' min total'), h('span', { class: 't-short' }, totalMin + ' min')), gearButton()),
      unitIntro('i3'),
      h('main', { class: 'uA-main' }, left, right), foot));
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
    const starTop = homeButton();
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the trail', onclick: () => { location.hash = '#/island3'; } }, icon('close'));
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
      setNextLabel(txt) { nextLabel.firstChild.textContent = txt; },
      showNav(on) { nav.style.display = on === false ? 'none' : ''; }
    };
    let backHandler = null; let nextHandler = null;
    const backBtn0 = h('button', { class: 'btn big back', type: 'button', 'aria-label': idx > 0 ? 'Back to the previous lesson' : 'Back to the trail', onclick: () => ctx.goBack() }, icon('back'), 'Back');
    const nextBtn0 = h('button', { class: 'btn big next', type: 'button', 'aria-label': idx === LESSONS.length - 1 ? 'Next: Zip\u2019s Check' : 'Next lesson', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nextLabel = nextBtn0; const nav = h('div', { class: 'lesson-nav' }, backBtn0, nextBtn0);
    function complete() {
      const stars = (L.id === 'listen' || L.id === 'intro') ? 3 : mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
      const prev = S.lessons[L.id] || {};
      S.lessons[L.id] = { done: true, stars: Math.max(prev.stars || 0, stars), tries: (prev.tries || 0) + 1 };
      IR.recordActivity(L.id, stars);
      IR.touchStreak(); IR.save();
      const last = idx === LESSONS.length - 1;
      const nextBtn = h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = last ? '#/check' : '#/lesson/' + (idx + 2); } }, last ? 'On to Zip\u2019s Check' : 'Next lesson', icon('next'));
      const backBtn = h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/island3'; } }, icon('back'), 'Back to the trail');
      ctx.progress(1);
      const ov = h('div', { class: 'complete' }, h('div', { class: 'cbox' },
        IR.celebration(false),
        h('h1', null, 'Done!'), h('p', { class: 'lead' }, L.title),
        h('div', { class: 'bigstars', 'aria-label': stars + ' stars' }, ...[1, 2, 3].map((k) => icon(k <= stars ? 'star' : 'starOutline', (k <= stars ? 'on' : 'off') + ' k' + k))),
        h('div', { class: 'row' }, backBtn, nextBtn)));
      app.append(ov); Snd.play(A.sfx.done);
    }
    const screen = h('div', { class: 'screen lessonscreen' + (L.id === 'intro' ? ' is-lesson' : ''), style: '--c:' + L.color }, h('header', { class: 'lesson-top' }, x, bar, starTop, unitButton(L.id), gearButton()), instrBox, stage, nav);
    app.append(screen);
    if (L.id !== 'intro' && L.id !== 'listen' && L.id !== 'read') IR.attachGameRules(ctx, screen, L.title);
    setBar(); L.run(ctx);
  }

  function checkScreen() {
    const scr = IR.newScreen(); const stage = h('div', { class: 'stage' });
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill); const instrBox = h('div', { class: 'instr' });
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the trail', onclick: () => { location.hash = '#/island3'; } }, icon('close'));
    const ctx = { scr, stage, miss() {}, progress(f) { fill.style.width = Math.round(((LESSONS.length + f) / (LESSONS.length + 1)) * 100) + '%'; }, setInstr(text, pid) { instrBox.innerHTML = ''; instrBox.style.display = text ? '' : 'none'; if (text) instrBox.append(IR.speakerBtn(() => Snd.play(A.prompt(pid)), 'Hear'), h('span', { class: 'itext' }, text)); }, finish() {} };
    let backHandler = null;
    ctx.setBack = (fn) => { backHandler = fn; };
    ctx.goBack = () => { Snd.stop(); if (backHandler && backHandler()) return; location.hash = '#/island3'; };
    let nextHandler = null; ctx.setNext = (fn) => { nextHandler = fn; };
    ctx.goNext = () => { Snd.stop(); if (nextHandler && nextHandler()) return; location.hash = '#/island3'; };
    const nav = h('div', { class: 'lesson-nav' }, h('button', { class: 'btn big back', type: 'button', 'aria-label': 'Back', onclick: () => ctx.goBack() }, icon('back'), 'Back'),
      h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next question', onclick: () => ctx.goNext() }, 'Next', icon('next')));
    const screen = h('div', { class: 'screen lessonscreen checkscreen', style: '--c:#2b2540' }, h('header', { class: 'lesson-top' }, x, bar, homeButton(), unitButton('check'), gearButton()), instrBox, stage, nav);
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
  IR.ui = { chips, gearButton, homeButton, toast, modalRoot, app };
  /* ---------- Practice pages (Nov 1 2026) ---------- */
  function simplePage(title, ...kids) {
    IR.newScreen();
    const back = h('button', { class: 'back homebtn', type: 'button', onclick: () => { location.hash = '#/home'; } }, icon('back'), h('span', null, 'Home'));
    app.append(h('div', { class: 'screen home simplepage' }, h('div', { class: 'mwrap' }, h('div', { class: 'gtop' }, back), h('h1', null, title), ...kids)));
  }
  /* Same lesson line as the unit pages: "Unit 4 · Lesson 4.1 · ng". The small line is storyTitle from that lesson's data. */
  function fluencyStories() {
    const out = [];
    const lessonName = (name) => { const s = String(name || ''); if (s === 'ng' || s === 'nk' || s.charAt(0) === '-') return s; return /^[a-z]/.test(s) ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
    const add = (unit, lesson, name, title, href) => out.push({ href, unit: +unit, lessonN: lesson, name: lessonName(name), lesson: 'Unit ' + unit + ' \u00b7 Lesson ' + lesson + ' \u00b7 ' + lessonName(name), title: title || '' });
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
      const w = WORLD.find((x) => x.id === 'chest' + n);
      return { unit: n * 2 - 1, lesson: 'Units ' + (n * 2 - 1) + '\u2013' + (n * 2), name: 'Sight words ' + n, title: 'Sight words ' + n, href: w && w.href ? w.href : '' };
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
    const lockMsg = (n) => n < 4 ? 'Unit ' + n + ' is coming soon in the full app!' : 'Unit ' + n + ' is coming soon! Finish Unit 4 first.';
    const sight = skill.id === 'sight';
    const nums = sight ? [...new Set(skill.items.map((it) => it.unit))] : Array.from({ length: 22 }, (_, i) => i + 1);
    let opened = nums.filter((n) => (sight ? skill.items.some((it) => it.unit === n && it.href) : spellUnitOpen(n)) && skill.items.some((it) => it.unit === n))[0] || 0;
    const host = h('div', { class: 'spellindex' });
    function render() {
      host.innerHTML = '';
      nums.forEach((n) => {
        const mine = skill.items.filter((it) => it.unit === n);
        const open = sight ? mine.some((it) => it.href) : spellUnitOpen(n);
        const expanded = open && opened === n;
        const uname = sight && mine[0] ? mine[0].lesson : UNIT_NAMES[n];
        const head = h('button', { class: 'spellunit' + (open ? ' open' : ' locked') + (expanded ? ' on' : ''), type: 'button', 'aria-expanded': open ? String(expanded) : 'false',
          'aria-label': 'Unit ' + n + ', ' + uname + (open ? (expanded ? '. Hide lessons.' : '. Show lessons.') : '. Locked.') },
          h('span', { class: 'su-n' }, sight ? '' : 'Unit ' + n),
          h('span', { class: 'su-name' }, sight ? uname : uname),
          open ? h('span', { class: 'su-go', 'aria-hidden': 'true' }, expanded ? 'Hide' : 'Lessons') : h('span', { class: 'su-lock', 'aria-hidden': 'true' }, icon('lock')));
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
    const ORDER = ['spelling', 'rhyme', 'pa', 'families', 'fluency'];
    const skills = ORDER.map((id) => skillCatalog().filter((s) => s.id === id)[0]).filter(Boolean);
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
    return simplePage('Targeted Skills', h('p', { class: 'calm' }, 'Choose a skill. Each one opens by unit, then by lesson.'), input, results, tiles);
  }
  function islandTrailPage() {
    return simplePage('Island Trail',
      h('div', { class: 'trailhold' },
        h('img', { class: 'homeart', src: 'img/home_zip_frill.webp', width: 1280, height: 720, alt: 'Zip and Frill sit on a tree root reading a book together. An orange bell hangs from the banyan behind them, and the island coast glows at sunset.' }),
        h('p', { class: 'calm' }, 'The trail map is coming soon. It will show the path from the first bell to the last.')),
      h('a', { class: 'cardgo traingo', href: '#/placement' }, 'Take the placement test'));
  }
  function treasureBoxes() {
    const skill = skillCatalog().filter((s) => s.id === 'sight')[0];
    if (!skill) return simplePage('Sight Word Treasure Boxes', h('p', { class: 'calm' }, 'The boxes are coming soon.'));
    return skillList(Object.assign({}, skill, { name: 'Sight Word Treasure Boxes', blurb: 'Open a box to practice its heart words and sight words.' }));
  }
  function readingRoom() {
    const stories = fluencyStories();
    const cards = stories.map((s) => h('a', { class: 'gchest open fluencycard', href: s.href, 'aria-label': s.lesson + (s.title ? '. ' + s.title : '') },
      h('span', { class: 'fl-lesson' }, s.lesson), s.title ? h('span', { class: 'fl-title' }, s.title) : null));
    const passages = UNIT_NAMES.slice(1).map((name, i) => h('div', { class: 'spellunit locked', 'aria-label': 'Unit ' + (i + 1) + ' ' + name + '. Coming soon.' },
      h('span', { class: 'su-n' }, 'Unit ' + (i + 1)), h('span', { class: 'su-name' }, name), h('span', { class: 'su-soon' }, 'Coming soon')));
    return simplePage('Reading Room',
      h('h2', { class: 'roomh' }, 'Fluency Stories'),
      h('p', { class: 'calm' }, 'Read a story again and again. It gets smoother each time.'),
      h('div', { class: 'chestlist fluencylist' }, ...cards),
      h('h2', { class: 'roomh' }, 'Comprehension Passages'),
      h('p', { class: 'calm' }, 'Passages are coming soon. They follow the same unit order.'),
      h('div', { class: 'spellindex' }, ...passages));
  }
  function skillScreen(id) {
    if (!id) return skillHub();
    if (id === 'sight') { location.replace('#/boxes'); return; }
    if (id === 'families') return simplePage('Word Families', h('p', { class: 'calm' }, 'Word Families is coming soon.'));
    const skill = skillCatalog().filter((s) => s.id === id)[0];
    if (!skill) { location.hash = '#/practice/skills'; return; }
    return skillList(skill);
  }
  function practiceScreen(key) {
    if (key === 'sight') {
      const curUnit = islandDone('i3') ? 4 : 3; const curBox = Math.ceil(curUnit / 2);   /* same rule as the You-are-here bar */
      const rows = [1, 2, 3, 4].map((n) => { const w = WORLD.find((x) => x.id === 'chest' + n); const ok = !!w.href;
        const mine = n === curBox;
        const b = h('button', { class: 'gchest sbox ' + (ok ? 'open' : 'locked') + (mine ? ' mine' : ''), type: 'button', 'data-kind': 'chest', 'data-n': n, 'aria-label': 'Sight words ' + n + ', for Units ' + (2 * n - 1) + ' and ' + (2 * n) + (mine ? '. Practice this one.' : '') + (ok ? '. Word games.' : '. Coming soon.') },
          h('b', null, String(n)), h('span', { class: 'sbt' }, h('span', null, 'Sight words ' + n), h('small', null, 'Units ' + (2 * n - 1) + '\u2013' + (2 * n) + (ok ? '' : ' \u00b7 Coming soon')), mine ? h('span', { class: 'mine-tag' }, 'Practice this one') : null));
        b.addEventListener('click', () => { if (ok) location.hash = w.href; else { Snd.stop(); toast('This sight words box is coming soon!'); } }); return b; });
      return simplePage('Sight Word Practice', h('div', { class: 'chestlist' }, ...rows), h('p', { class: 'calm small' }, 'Units 9\u201310: sight words come later.'));
    }
    if (key === 'fluency') {
      const stories = fluencyStories();
      const cards = stories.map((s) => h('a', { class: 'gchest open fluencycard', href: s.href, 'aria-label': s.lesson + (s.title ? '. ' + s.title : '') },
        h('span', { class: 'fl-lesson' }, s.lesson), s.title ? h('span', { class: 'fl-title' }, s.title) : null));
      return simplePage('Fluency Stories', h('p', { class: 'calm' }, 'Read a story again and again. It gets smoother each time.'),
        h('div', { class: 'chestlist fluencylist' }, ...cards));
    }
    if (key === 'spelling' || key === 'fluency' || key === 'sight') { location.replace('#/practice/skills/' + key); return; }
    location.hash = '#/home';
  }
  /* ---------- About Island Readers (approved copy, Nov 6 2026) ---------- */
  function aboutScreen() {
    IR.newScreen();
    const a = (href, t) => h('a', { href, target: '_blank', rel: 'noopener' }, t);
    const sec = (title, ...kids) => h('section', { class: 'absec' }, h('h2', null, title), ...kids);
    const p = (...k) => h('p', null, ...k);
    const ul = (...items) => h('ul', null, ...items.map((x) => h('li', null, ...[].concat(x))));
    const UNITS = [['1', 'short vowels and floss'], ['2', 'blends'], ['3', 'sh, ch, th, wh, ck'], ['4', 'ng, nk (glued sounds)'], ['5', 'silent e'], ['6', '-s, -es, -ed, -ing'], ['7', 'syllables'], ['8', 'tricky sounds: tch, dge, -ild, -old'], ['9', 'bossy r: ar, or, er, ir, ur'], ['10', 'air, are, ear'], ['11', 'ai, ay, ee, ea, ey'], ['12', 'oa, ow, oe, ie, igh'], ['13', 'oo, ew, ui, ue'], ['14', 'au, aw, augh, ea'], ['15', 'oi, oy, ou, ow'], ['16', 'ei, eigh, ew, ough'], ['17', 'soft c and g'], ['18', 'silent letters: kn, wr, mb, gn, gh'], ['19', 'suffixes: -er, -est, -ly, -ful'], ['20', 'suffix spelling rules'], ['21', 'prefixes: un-, pre-, re-, dis-'], ['22', 'big endings: -tion, -ture, -ment']];
    const home2 = h('button', { class: 'btn big primary abhome', type: 'button', onclick: () => { location.hash = '#/home'; } }, icon('home'), h('span', null, 'Back to Home'));
    app.append(h('div', { class: 'screen aboutscreen' }, h('div', { class: 'abwrap' },
      h('div', { class: 'abtop' }, homeButton()),
      h('h1', null, 'About Island Readers'),
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
        p('Island Readers is a free-to-try phonics app that teaches reading skills directly and in order. Readers join Zip, a gecko inventor, and Frill, a nudibranch, on an adventure across the islands. Each island has a bell, and readers ring it by learning that unit\u2019s sounds. It is made for older kids, so it looks like an adventure, not a baby book. English learners can use it too.'),
        p('It is a free web app that can be added to the home screen. It runs on the phones, tablets and Chromebooks families and schools already have, with no app store and no cost to install.'),
        ul('Plan about 20\u201330 minutes a session. Steps are short, and it is fine to take breaks.',
          'Each unit starts with a lesson: I do (Zip shows the skill), we do (you try it together), you do (you try it on your own).',
          'Next come practice activities, a story to read with only the sounds already taught, and heart words (tricky words to learn by heart).',
          ['At the end, Zip\u2019s Check asks 10 quick questions: ', h('b', null, '9\u201310'), ' move on, ', h('b', null, '7\u20138'), ' review first, ', h('b', null, '6 or below'), ' re-teach the lesson.'],
          'Stars and gems show progress. Grown-up tips appear under each activity.',
          'Not sure where to start? Tap “Start here to find your first bell” on the home screen. A grown-up sits with the reader, who reads short groups of real and made-up words in the same order as the units. A group passes at 4 of 5, and the check stops at the first group that is hard, which shows the starting bell. It takes about 5 minutes. Only the starting bell is saved, on this device. Nothing is recorded or sent, and the microphone is not used.')),
      sec('The research behind it',
        ul(['The National Reading Panel (2000) reviewed the research and found that systematic phonics instruction helps children learn to read. (', a('https://www.nichd.nih.gov/publications/pubs/nrp/smallbook', 'NICHD: National Reading Panel report'), ')'],
          ['The Simple View of Reading (Gough & Tunmer, 1986): reading comprehension depends on both decoding words and understanding language. Island Readers builds the decoding side. (', a('https://doi.org/10.1177/074193258600700104', 'Gough & Tunmer, 1986'), ')'],
          ['Orthographic mapping (Ehri, 2014): readers store words in memory by connecting each letter or letter group to its sound. That is why every lesson links letters to sounds. (', a('https://doi.org/10.1080/10888438.2013.819356', 'Ehri, 2014'), ')'],
          ['Structured literacy is the International Dyslexia Association’s name for reading instruction that is explicit, systematic and cumulative, the approach Island Readers follows. (', a('https://dyslexiaida.org/structured-literacy/', 'IDA: Structured Literacy'), ')'],
          'Decodable stories let readers practice only what they have been taught, and each unit reviews earlier skills so they stick.')),
      sec('Why this order',
        p('The units follow a research-based scope and sequence like those used in schools. Each step builds on the last, from simple to complex, with the most useful patterns first.'),
        h('ol', { class: 'abunits' }, ...UNITS.map(([n, t]) => h('li', null, h('b', null, 'Unit ' + n + ': '), t))),
        p('Readers start with short vowels and simple words, then learn sounds made by two letters, then longer words and word parts. That way no step asks for a skill that has not been taught.')),
      h('div', { class: 'abbottom' }, home2))));
  }
  /* ---------- Teacher materials (grown-up corner): by unit, then sound ---------- */
  function teachersScreen() {
    IR.newScreen();
    const UNITS = [{ name: 'Unit 4 \u00b7 Glued Sounds', sounds: [
      { s: 'ng', lesson: 'Lesson 4.1', days: 3, daily: 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf', pack: 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf', deck: 'teachers/ng/Lesson3.1_ng_Slide_Presentation.pptx', view: '#/teachers/slides/ng' },
      { s: 'nk', lesson: 'Lesson 4.2', days: 3, daily: 'teachers/nk/Lesson3.2_nk_Daily_Practice_Sheets.pdf', pack: 'teachers/nk/Lesson3.2_nk_Teacher_Pack.pdf', deck: 'teachers/nk/Lesson3.2_nk_Slide_Presentation.pptx', view: '#/teachers/slides/nk' }] }];
    const card = (x) => h('div', { class: 'tmcard' }, h('h3', null, h('span', { class: 'tmsound' }, x.s), ' ' + x.lesson),
      h('a', { class: 'btn big tmlink primary', href: x.view }, 'Open on smartboard'),
      h('p', { class: 'tmnote' }, 'Full-screen slide show in the browser. No download needed.'),
      h('a', { class: 'btn big tmlink', href: x.deck, download: '' }, 'Download slides \u00b7 ' + x.days + ' days (PPTX)'),
      h('p', { class: 'tmnote' }, 'One PowerPoint for the whole sound.'),
      h('a', { class: 'btn big tmlink', href: x.daily, target: '_blank', rel: 'noopener' }, 'Daily practice sheets (PDF)'),
      h('p', { class: 'tmnote' }, 'Worksheets for each day, labeled Day 1 to Day ' + x.days + '.'),
      h('a', { class: 'btn big tmlink', href: x.pack, target: '_blank', rel: 'noopener' }, 'Teacher pack (PDF)'),
      h('p', { class: 'tmnote' }, 'Slides with notes, worksheets and answer key.'));
    app.append(h('div', { class: 'screen tmscreen' }, h('div', { class: 'tmwrap' },
      h('div', { class: 'abtop' }, homeButton()),
      h('h1', null, 'Teacher materials'),
      h('p', { class: 'tmlead' }, 'For teaching in class. Students practice on their own in the app.'),
      ...UNITS.map((u) => h('section', { class: 'tmunit' }, h('h2', null, u.name), h('div', { class: 'tmgrid' }, ...u.sounds.map(card)))))));
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
      h('a', { class: 'btn small ghost slide-back', href: '#/teachers' }, icon('back'), 'Teacher materials'),
      h('h1', { class: 'slide-title' }, sound + ' week slides'),
      counter, gearButton());
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
    else if (IR.nkRoute && IR.nkRoute(hash, app)) { /* nk unit + Island Review (js/nk.js) */ }
    else if (IR.u5Route && IR.u5Route(hash, app)) { /* Unit 5 Silent e (js/u5.js) */ }
    else if (IR.u6Route && IR.u6Route(hash, app)) { /* Unit 6 Endings (js/u6.js) */ }
    else if ((m = /^#\/lesson\/(\d+)/.exec(hash))) lessonScreen(parseInt(m[1], 10) - 1);
    else if (/^#\/chest[1-4]/.test(hash)) IR.chest.render(hash, app);
    else if (hash === '#/practice/sight' || hash === '#/practice/skills/sight') { location.replace('#/boxes'); return; }
    else if (hash === '#/practice/spelling' || hash === '#/practice/fluency') { location.replace(hash.replace('#/practice/', '#/practice/skills/')); return; }
    else if (hash === '#/trail' || hash === '#/trail/') { islandTrailPage(); }
    else if (hash === '#/boxes' || hash === '#/boxes/') { treasureBoxes(); }
    else if (hash === '#/reading-room' || hash === '#/reading-room/') { readingRoom(); }
    else if ((m = /^#\/practice\/skills(?:\/([a-z]+))?$/.exec(hash))) skillScreen(m[1]);
    else if ((m = /^#\/practice\/(\w+)/.exec(hash))) practiceScreen(m[1]);
    else if (hash.startsWith('#/gems')) gemScreen();
    else if (hash.startsWith('#/about')) aboutScreen();
    else if ((m = /^#\/teachers\/slides\/(ng|nk)$/.exec(hash))) slidesViewer(m[1]);
    else if (hash.startsWith('#/teachers')) { if (IR._slideCleanup) { IR._slideCleanup(); IR._slideCleanup = null; } teachersScreen(); }
    else if (hash.startsWith('#/placement')) IR.placement.render(app, (n) => { const id = 'i' + n; if ((D.islands || {})[id]) { location.hash = '#/home'; setTimeout(() => openIsland(id), 0); } else { location.hash = '#/home'; setTimeout(() => toast('Unit ' + n + ' (' + ({1:'blends',2:'sh ch th',3:'ng nk',4:'silent e',5:'long words',6:'bossy r',7:'vowel teams',8:'oi ow aw',9:'word parts',10:'tch dge igh'})[n] + ') is coming soon in the full app. Try Unit 3 for now.'), 50); } });
    else if (hash.startsWith('#/island3')) trailScreen();
    else if (hash.startsWith('#/check')) checkScreen();
    else if (hash.startsWith('#/result')) { IR.newScreen(); app.append(h('div', { class: 'screen resultscreen' })); IR.renderResult($('.resultscreen')); $('.resultscreen').prepend(h('div', { class: 'unitbar' }, homeButton(), unitButton('check'))); }
    else homeScreen();
  }
  /* Nov 4 2026: "Back to Unit N" on every lesson / activity / game page of a unit. Opens that unit's lesson picker.
     Shared template: a new unit only needs one row here (route test + picker id + unit number). */
  IR.UNIT_ROUTES = IR.UNIT_ROUTES || [
    { n: 4, id: 'i3', test: (hs) => /^#\/(nk|island3|lesson\/|review3|check|result)/.test(hs) || /^#\/spell\/(ng|nk)(\/|$)/.test(hs) },
    { n: 5, id: 'i5', test: (hs) => /^#\/(u5\d|review5)/.test(hs) || /^#\/spell\/u5(\/|$)/.test(hs) },
    { n: 6, id: 'u6', href: '#/u6', test: (hs) => /^#\/u6(\/|$)/.test(hs) || /^#\/spell\/u6(\/|$)/.test(hs) }];
  function addUnitBack() {
    const hs = location.hash || ''; const u = IR.UNIT_ROUTES.find((r) => r.test(hs));
    if (!u || app.querySelector('.unitback')) return;
    const home = app.querySelector('.homebtn'); if (!home) return;
    const b = h('button', { class: 'back homebtn unitback', type: 'button', 'aria-label': 'Back to Unit ' + u.n + ': pick another lesson', onclick: () => { Snd.stop(); if (u.href) location.hash = u.href; else { location.hash = '#/home'; setTimeout(() => openIsland(u.id), 0); } } }, icon('back'), h('span', null, 'Back to Unit ' + u.n));
    home.style.marginRight = '0'; home.after(b);
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
