/* nk activities that mirror the ng unit (Nov 2 2026): Hear and Pick, Ring every bell and learn its sounds, Build-a-Word, Word Chains,
   Scrambled Letters, Trace Trail (n, k), Sentence Bridge. Whole-word and whole-sentence audio only; no isolated sounds.
   Loaded before nk.js, which places them in the unit order. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h, $, $$, sleep, shuffle, icon, Snd, A, speakerBtn } = IR;
  const N = window.IR_DATA_NK;
  const W = (w) => 'audio/nk_w_' + w + '.mp3';
  const say = (w) => Snd.play(W(w));
  const ding = (w) => Snd.seq(w ? [A.sfx.ding, W(w)] : [A.sfx.ding], 90);
  const tryAgain = (src) => Snd.seq(src ? [A.sfx.tryagain, src] : [A.sfx.tryagain], 150);
  const NKCOL = '#C2408A';
  const CH = { ank: '#C2408A', ink: '#7E57C2', onk: '#1F8FD6', unk: '#E8603C' };
  const colorNk = (w) => { const m = /(nk|ng)$/.exec(w); if (!m) return document.createTextNode(w); return h('span', null, w.slice(0, m.index), h('span', { class: 'chunk', style: 'color:' + (m[1] === 'nk' ? NKCOL : '#0E8584') }, m[1])); };
  const split = (w) => { const o = []; for (let i = 0; i < w.length; i++) { const two = w.slice(i, i + 2); if (two === 'nk' || two === 'th') { o.push(two); i++; } else o.push(w[i]); } return o; };
  const tile = (t, extra) => h('button', { class: 'wtile' + (t === 'nk' ? ' ngtile nktile' : '') + (extra || ''), type: 'button', 'data-t': t }, t);

  function hear(ctx) {
    ctx.setInstr('Listen. Tap the word you hear.', 'hear');
    const rounds = N.hear; let r = 0; const got = new Set(); const stage = ctx.stage;
    const nextOpen = () => { for (let k = 1; k <= rounds.length; k++) { const j = (r + k) % rounds.length; if (!got.has(j)) return j; } return -1; };
    function round() {
      const R = rounds[r]; ctx.progress(got.size / rounds.length); stage.innerHTML = ''; let misses = 0, locked = false;
      ctx.setBack(() => { if (r > 0) { Snd.stop(); r--; round(); return true; } return false; });
      ctx.setNext(() => { if (r < rounds.length - 1) { Snd.stop(); r++; round(); return true; } return false; });
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const grid = h('div', { class: 'choices' }); const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      shuffle(R.choices).forEach((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, w);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (w === R.word) { locked = true; b.classList.add('right'); b.innerHTML = ''; b.append(colorNk(w), icon('check')); $$('.choice', grid).forEach((o) => { if (o !== b) o.classList.add('fade'); });
            status.textContent = 'Yes! ' + w; await ding(w); if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return;
            got.add(r); const nx = got.size >= rounds.length ? -1 : nextOpen(); if (nx < 0) { ctx.progress(1); ctx.finish(); } else { r = nx; round(); } }
          else { misses++; ctx.miss(); b.classList.add('tried'); status.textContent = 'Not that one. Listen again.'; await tryAgain(W(R.word)); if (misses >= 2) $$('.choice', grid).forEach((o) => { if (o.dataset.w === R.word) o.classList.add('hint'); }); }
        }); grid.append(b); });
      stage.append(h('div', { class: 'activity' }, spk, grid, status)); say(R.word);
    }
    round();
  }

  function bells(ctx) {
    const stage = ctx.stage; const words = N.bells; const order = shuffle(words); let r = 0; const lit = new Set();
    ctx.setInstr('Read the word out loud. Then tap the bell with the same word.', 'bells');
    const row = h('div', { class: 'bellrow' }); const card = h('div', { class: 'bellcard' });
    const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
    words.forEach((w) => { const b = h('button', { class: 'bellbtn', type: 'button', 'aria-label': 'Bell: ' + w }, h('img', { src: 'img/bell_unlit.png', alt: '' }), h('span', null, w)); b.addEventListener('click', () => tapBell(w, b)); row.append(b); });
    const hearB = h('button', { class: 'btn big', type: 'button', onclick: () => say(order[r]) }, icon('speaker'), 'Hear it');
    stage.append(h('div', { class: 'activity bellgame' }, h('div', { class: 'bellscene', style: 'background-image:url(img/ob_scene.jpg)' }), row, card,
      h('p', { class: 'small' }, 'nk is glued: n and k stay together at the end.'), h('div', { class: 'row center' }, hearB), status));
    const show = () => { ctx.progress(lit.size / words.length); card.innerHTML = ''; card.append(h('span', { class: 'bigword' }, colorNk(order[r]))); status.textContent = '\u00a0'; };
    async function tapBell(w, b) {
      if (lit.has(w)) { say(w); return; }
      if (w !== order[r]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 500); status.textContent = 'Look again. Find the bell that says ' + order[r] + '.'; await tryAgain(); return; }
      lit.add(w); b.classList.add('lit'); b.querySelector('img').src = 'img/bell_lit.png'; status.textContent = w + '! The bell lights up.';
      await ding(w); if (!ctx.scr.ok()) return; r++;
      if (r >= order.length) { ctx.progress(1); status.textContent = 'All the bells are lit!'; await Snd.play(A.sfx.gong); if (ctx.scr.ok()) ctx.finish(); return; }
      await sleep(300); if (ctx.scr.ok()) show();
    }
    ctx.setNext(() => { if (r < order.length - 1) { Snd.stop(); r++; show(); return true; } return false; });
    show(); Snd.play('audio/nk_p_bells.mp3');
  }

  function build(ctx) {
    ctx.setInstr('Listen. Build the word with the tiles.', 'build');
    const rounds = N.build; let r = 0; const stage = ctx.stage;
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); stage.innerHTML = ''; let misses = 0;
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const slotsEl = h('div', { class: 'slots' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap or drag tiles into the boxes.');
      const mk = (id, text, kind) => ({ id, text, cls: kind, style: kind === 'chunk' ? 'color:' + CH[text] + ';border-color:' + CH[text] : '' });
      const tiles = shuffle([mk('o1', R.onset, 'onset'), mk('o2', R.altOnset, 'onset'), mk('c1', R.chunk, 'chunk'), mk('c2', R.altChunk, 'chunk')]);
      IR.TileBoard({ tiles, nSlots: 2, slotsEl, bankEl, onFull: async (texts, b) => {
        b.locked = true;
        if (texts.join('') === R.word) { status.textContent = 'Yes! ' + R.word; slotsEl.classList.add('right'); await ding(R.word); if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return; r++; if (r < rounds.length) round(); else { ctx.progress(1); ctx.finish(); } }
        else { misses++; ctx.miss(); status.textContent = 'Almost! Listen again and try again.'; slotsEl.classList.add('almost'); await tryAgain(W(R.word)); if (!ctx.scr.ok()) return; slotsEl.classList.remove('almost'); b.slots.fill(null); if (misses >= 2) b.hint = 'o1'; b.locked = false; b.render(); }
      } });
      stage.append(h('div', { class: 'activity' }, spk, slotsEl, bankEl, status)); say(R.word);
    }
    round();
  }

  function chain(ctx) {
    const CHAIN = N.chain; const stage = ctx.stage; let r = 1;
    ctx.setInstr('Listen to the new word. Change one letter to make it.', 'chain');
    const cur = h('div', { class: 'wcur' }); const pool = h('div', { class: 'wpool' }); const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
    const hearB = h('button', { class: 'btn big', type: 'button', onclick: () => say(CHAIN[r]) }, icon('speaker'), 'Hear the new word'); const trail = h('p', { class: 'wtrail' });
    stage.append(h('div', { class: 'activity wordplay' }, trail, cur, h('div', { class: 'row center' }, hearB), h('p', { class: 'small center' }, 'Tap a letter in the word, then tap the new letter.'), pool, status));
    let parts = split(CHAIN[0]); let pick = -1;
    function show() {
      ctx.progress((r - 1) / (CHAIN.length - 1)); trail.textContent = CHAIN.slice(0, r).join(' \u2192 ');
      cur.innerHTML = ''; parts.forEach((p, i) => { const t = tile(p, i === pick ? ' sel' : ''); t.addEventListener('click', () => { pick = i; show(); }); cur.append(t); });
      pool.innerHTML = ''; const target = split(CHAIN[r]); const need = target.find((t, i) => t !== parts[i]);
      shuffle([need, ...shuffle(['a', 'i', 'o', 'u', 's', 'b', 'j', 'd', 'h', 't'].filter((x) => x !== need && !parts.includes(x))).slice(0, 3)]).forEach((t) => { const b = tile(t); b.addEventListener('click', () => place(t, b)); pool.append(b); });
    }
    async function place(t, b) {
      if (pick < 0) { status.textContent = 'First tap the letter in the word you want to change.'; return; }
      const next = parts.slice(); next[pick] = t;
      if (next.join('') !== CHAIN[r]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 500); status.textContent = 'Not quite. Listen again and look at each letter.'; await tryAgain(W(CHAIN[r])); return; }
      parts = split(CHAIN[r]); pick = -1; status.textContent = CHAIN[r] + '!'; await ding(CHAIN[r]); if (!ctx.scr.ok()) return;
      r++; if (r >= CHAIN.length) { ctx.progress(1); trail.textContent = CHAIN.join(' \u2192 '); status.textContent = 'You made the whole chain!'; await sleep(400); if (ctx.scr.ok()) ctx.finish(); return; }
      status.textContent = '\u00a0'; show(); await sleep(300); say(CHAIN[r]);
    }
    show(); Snd.seq(['audio/nk_p_chain.mp3', W(CHAIN[1])], 300);
  }

  function scramble(ctx) {
    const stage = ctx.stage; let r = 0; const order = shuffle(N.scramble);
    ctx.setInstr('Listen to the word. Tap the tiles in order to spell it.', 'scramble');
    const slots = h('div', { class: 'wcur' }); const pool = h('div', { class: 'wpool' }); const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
    const hearB = h('button', { class: 'btn big', type: 'button', onclick: () => say(order[r]) }, icon('speaker'), 'Hear the word');
    let parts, mix, got;
    const undo = h('button', { class: 'btn', type: 'button', onclick: () => { if (got.length) { got.pop(); draw(); } } }, 'Undo');
    stage.append(h('div', { class: 'activity wordplay' }, h('div', { class: 'row center' }, hearB), slots, pool, h('div', { class: 'row center' }, undo), status));
    function start() { parts = split(order[r]); do { mix = shuffle(parts.map((t, i) => ({ t, i }))); } while (mix.length > 1 && mix.every((m, k) => m.t === parts[k])); got = []; status.textContent = '\u00a0'; draw(); ctx.progress(r / order.length); }
    function draw() {
      slots.innerHTML = ''; parts.forEach((p, k) => slots.append(h('span', { class: 'wslot' + (p === 'nk' ? ' ngslot' : '') }, got[k] ? got[k].t : '')));
      pool.innerHTML = ''; mix.forEach((m) => { const used = got.includes(m); const b = tile(m.t, used ? ' used' : ''); b.disabled = used; b.addEventListener('click', () => put(m, b)); pool.append(b); });
    }
    async function put(m, b) {
      const k = got.length;
      if (m.t !== parts[k]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 500); status.textContent = 'Try another tile. Say the word slowly.'; await tryAgain(W(order[r])); return; }
      got.push(m); draw();
      if (got.length === parts.length) { status.textContent = order[r] + '!'; await ding(order[r]); if (!ctx.scr.ok()) return; r++;
        if (r >= order.length) { ctx.progress(1); status.textContent = 'All the words are spelled!'; await sleep(400); if (ctx.scr.ok()) ctx.finish(); return; }
        await sleep(300); start(); say(order[r]); }
    }
    start(); Snd.seq(['audio/nk_p_scramble.mp3', W(order[0])], 300);
  }

  function sentence(ctx) {
    ctx.setInstr('Listen. Put the words in order to make a sentence.', 'sent');
    const rounds = N.sentences; let r = 0; const stage = ctx.stage;
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); stage.innerHTML = ''; let misses = 0; const audio = 'audio/nk_b_' + R.n + '.mp3';
      const spk = speakerBtn(() => Snd.play(audio), 'Hear the sentence');
      const slotsEl = h('div', { class: 'slots sent' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap or drag the words into the boxes.');
      const tiles = shuffle(R.words.map((w, i) => ({ id: 'w' + i, text: w, cls: 'word' })));
      const bridge = h('div', { class: 'bridgebar' }, ...R.words.map(() => h('i')));
      IR.TileBoard({ tiles, nSlots: R.words.length, slotsEl, bankEl,
        onChange: (b) => { $$('i', bridge).forEach((el, k) => el.classList.toggle('on', b.slots[k] != null)); },
        onFull: async (texts, b) => {
          b.locked = true;
          if (texts.join(' ') === R.text) { status.textContent = 'Yes! The bridge is built.'; slotsEl.classList.add('right'); bridge.classList.add('lit'); await Snd.seq([A.sfx.ding, audio], 200); if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return; r++; if (r < rounds.length) round(); else { ctx.progress(1); ctx.finish(); } }
          else { misses++; ctx.miss(); status.textContent = 'Almost! Listen again and try again.'; slotsEl.classList.add('almost'); await tryAgain(audio); if (!ctx.scr.ok()) return; slotsEl.classList.remove('almost'); b.slots.fill(null); if (misses >= 2) b.hint = tiles.find((t) => t.text === R.words[0]).id; b.locked = false; b.render(); }
        } });
      stage.append(h('div', { class: 'activity sentact' }, h('div', { class: 'pic' }, h('img', { src: R.img, alt: 'A picture from the story' })), h('div', { class: 'row center' }, spk), slotsEl, bridge, bankEl, status));
      Snd.play(audio);
    }
    round();
  }

  function trace(ctx) {

      ctx.setInstr('Trace the n and the k. Start at the green dot.', 'trace');
      const W = 900, H = 440, BRUSH = 30, NS = 'http://www.w3.org/2000/svg';
      /* ---- stroke guide paths (manuscript, ball-and-stick). Canvas coords; baseline y=290, x-height line y=110. ---- */
      const bez = (p0, p1, p2, p3, n) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t;
        o.push([u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]); } return o; };
      const line = (a, b, n) => { const o = []; for (let i = 0; i <= n; i++) o.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); return o; };
      const join = (...parts) => parts.reduce((acc, p) => acc.concat(acc.length ? p.slice(1) : p), []);
      const circle = (cx, cy, rx, ry, a0, a1, n) => { const o = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; o.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return o; };
      const STROKES = [
        { letter: 'n', num: 1, pts: line([160, 110], [160, 290], 36) },
        { letter: 'n', num: 2, pts: join(bez([160, 190], [160, 150], [186, 110], [224, 110], 14), bez([224, 110], [264, 110], [282, 140], [282, 195], 14), line([282, 195], [282, 290], 19)) },
        { letter: 'k', num: 1, pts: line([600, 30], [600, 290], 52) },
        { letter: 'k', num: 2, pts: join(line([712, 110], [604, 206], 24), line([604, 206], [722, 290], 26)) }
      ];
      STROKES.forEach((s) => { let L = 0; s.cum = [0]; for (let i = 1; i < s.pts.length; i++) { L += Math.hypot(s.pts[i][0] - s.pts[i-1][0], s.pts[i][1] - s.pts[i-1][1]); s.cum.push(L); } s.len = L; });
      const at = (s, d) => { let i = 1; while (i < s.cum.length - 1 && s.cum[i] < d) i++; const a = s.pts[i-1], b = s.pts[i]; const f = (d - s.cum[i-1]) / ((s.cum[i] - s.cum[i-1]) || 1); return [a[0] + (b[0]-a[0]) * f, a[1] + (b[1]-a[1]) * f, Math.atan2(b[1]-a[1], b[0]-a[0]) * 180 / Math.PI]; };
      const d = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      const el = (name, attrs, parent) => { const e = document.createElementNS(NS, name); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };

      const under = el('svg', { class: 'cv', viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' });
      const ink = h('canvas', { class: 'cv ink', width: W, height: H, 'aria-label': 'Trace the letters n and k here', role: 'img' });
      const over = el('svg', { class: 'cv over', viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' });
      const box = h('div', { class: 'tracebox' }, under, ink, over);
      const meter = h('div', { class: 'meter' }, h('i'));
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Put your finger on the green 1 and follow the arrows.');
      const watch = h('button', { class: 'btn small', type: 'button' }, icon('play'), 'Watch me');
      const clear = h('button', { class: 'btn small', type: 'button' }, 'Start over');
      const skip = h('button', { class: 'btn small ghost', type: 'button' }, 'Skip');
      ctx.stage.append(h('div', { class: 'activity' }, box, meter, status, h('div', { class: 'row' }, watch, clear, skip)));

      /* ribbons + dotted centre lines (under the ink) */
      const ribbons = STROKES.map((s) => {
        const g = el('g', {}, under);
        el('path', { d: d(s.pts), fill: 'none', stroke: '#E4F1EF', 'stroke-width': 44, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        el('path', { d: d(s.pts), fill: 'none', stroke: '#8a7f9c', 'stroke-width': 3, 'stroke-dasharray': '2 11', 'stroke-linecap': 'round' }, g);
        return g;
      });
      /* arrows + numbered start dots (over the ink) */
      const marks = STROKES.map((s) => {
        const g = el('g', { class: 'strokemark' }, over);
        for (let dist = 70; dist < s.len - 30; dist += 82) { const p = at(s, dist); if (STROKES.some((o) => Math.hypot(o.pts[0][0] - p[0], o.pts[0][1] - p[1]) < 48)) continue;
          el('path', { d: 'M-9 -11 L9 0 L-9 11', fill: 'none', stroke: '#0E7C7C', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + p[2].toFixed(0) + ')' }, g); }
        const dot = el('g', { class: 'startdot', transform: 'translate(' + s.pts[0][0] + ' ' + s.pts[0][1] + ')' }, g);
        el('circle', { r: 25, fill: '#1E9E5A', stroke: '#fff', 'stroke-width': 4 }, dot);
        const t = el('text', { 'text-anchor': 'middle', y: 9, 'font-size': 28, 'font-weight': 700, fill: '#fff', 'font-family': 'Andika, sans-serif' }, dot); t.textContent = s.num;
        return g;
      });
      const sprite = el('circle', { r: 17, fill: '#FFD84D', stroke: '#2B2540', 'stroke-width': 4, class: 'watchdot', visibility: 'hidden' }, over);

      const ictx = ink.getContext('2d');
      let sIdx = 0, prog = 0, drawing = false, last = null, snap = null, watching = 0, finished = false;
      const START_R = 78, TOL = 58, LOOK = 70;           /* start must be near the dot; moves count only when they go forward along the path */
      const Pn = (s) => s.pts.length;
      function refresh() {
        STROKES.forEach((s, i) => { marks[i].classList.toggle('now', i === sIdx && !finished); marks[i].classList.toggle('later', i > sIdx); marks[i].classList.toggle('done', i < sIdx || finished); });
        meter.firstChild.style.width = Math.round(100 * (finished ? 4 : sIdx) / 4) + '%'; ctx.progress((finished ? 4 : sIdx) / 4);
      }
      function snapPath(s, color) { ictx.strokeStyle = color; ictx.lineWidth = BRUSH; ictx.lineCap = 'round'; ictx.lineJoin = 'round'; ictx.beginPath(); s.pts.forEach((p, i) => (i ? ictx.lineTo(p[0], p[1]) : ictx.moveTo(p[0], p[1]))); ictx.stroke(); }
      async function succeed() {
        if (finished) return; finished = true; refresh(); status.textContent = 'Nice, clean letters.';
        await IR.ding(); if (ctx.scr.ok()) ctx.finish();
      }
      function strokeDone() {
        const s = STROKES[sIdx]; ictx.putImageData(snap, 0, 0); snapPath(s, '#2E9E6B'); sIdx++; drawing = false; prog = 0; Snd.play(A.sfx.tap);
        if (sIdx >= STROKES.length) { succeed(); return; }
        refresh(); status.textContent = STROKES[sIdx].letter !== s.letter ? 'Now the k! Start at the green 1.' : 'Good! Now the green ' + STROKES[sIdx].num + '.';
      }
      const pos = (e) => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
      ink.addEventListener('pointerdown', (e) => {
        if (finished || watching) return; e.preventDefault();
        const s = STROKES[sIdx], p = pos(e);
        if (Math.hypot(p[0] - s.pts[0][0], p[1] - s.pts[0][1]) > START_R) {
          const dot = marks[sIdx].querySelector('.startdot circle'); dot.classList.remove('nudge'); void dot.getBoundingClientRect(); dot.classList.add('nudge');
          status.textContent = 'Start at the green ' + s.num + '.'; return; }
        try { ink.setPointerCapture(e.pointerId); } catch (err) { /* */ }
        drawing = true; prog = 0; last = p; snap = ictx.getImageData(0, 0, W, H);
        ictx.fillStyle = '#E39A00'; ictx.beginPath(); ictx.arc(p[0], p[1], BRUSH / 2, 0, 7); ictx.fill();
      });
      ink.addEventListener('pointermove', (e) => {
        if (!drawing) return; const p = pos(e), s = STROKES[sIdx];
        ictx.strokeStyle = '#E39A00'; ictx.lineWidth = BRUSH; ictx.lineCap = 'round'; ictx.beginPath(); ictx.moveTo(last[0], last[1]); ictx.lineTo(p[0], p[1]); ictx.stroke(); last = p;
        let best = prog;                                   /* forward only: look ahead along the path, never back */
        for (let j = prog + 1; j <= Math.min(Pn(s) - 1, prog + LOOK); j++) if (Math.hypot(p[0] - s.pts[j][0], p[1] - s.pts[j][1]) <= TOL) best = j;
        prog = best; if (prog >= Pn(s) - 4) strokeDone();
      });
      const up = () => { if (!drawing) return; drawing = false; ictx.putImageData(snap, 0, 0); prog = 0;
        status.textContent = 'Keep going along the arrows to the end. Try the green ' + STROKES[sIdx].num + ' again.'; };
      ink.addEventListener('pointerup', up); ink.addEventListener('pointercancel', up);
      clear.addEventListener('click', () => { if (watching) return; ictx.clearRect(0, 0, W, H); sIdx = 0; prog = 0; drawing = false; finished = false; refresh(); status.textContent = 'Fresh start. Put your finger on the green 1.'; });
      skip.addEventListener('click', () => { ctx.miss(); ctx.miss(); succeed(); });

      /* "Watch me": a yellow dot draws the strokes of the current letter, in order, along the arrows */
      const calm = () => document.body.classList.contains('calm') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      async function watchMe(auto) {
        if (watching || finished || drawing) return; const my = ++watching; const letter = STROKES[Math.min(sIdx, 3)].letter;
        const list = STROKES.map((s, i) => i).filter((i) => STROKES[i].letter === letter && i >= (letter === 'n' ? 0 : 2));
        if (!auto) Snd.play(A.prompt('p_watch'));
        if (calm()) { list.forEach((i) => marks[i].classList.add('flash')); await sleep(1200); list.forEach((i) => marks[i].classList.remove('flash')); watching = 0; return; }
        sprite.setAttribute('visibility', 'visible');
        for (const i of list) {
          const s = STROKES[i]; const t0 = performance.now(); const dur = Math.max(900, s.len / 0.28);
          await new Promise((res) => { const step = (now) => { if (!ctx.scr.ok()) return res(); const f = Math.min(1, (now - t0) / dur); const p = at(s, f * s.len); sprite.setAttribute('cx', p[0]); sprite.setAttribute('cy', p[1]); if (f < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
          await sleep(350);
        }
        sprite.setAttribute('visibility', 'hidden'); watching = 0;
      }
      watch.addEventListener('click', () => watchMe(false));
      IR._traceTestNk = { W, H, strokes: STROKES.map((s) => s.pts), ink, state: () => ({ sIdx, finished, watching }), succeed, watchMe };
      refresh(); Snd.seq(['audio/nk_p_trace.mp3'], 100);
      setTimeout(() => { if (ctx.scr.ok() && sIdx === 0 && !calm()) watchMe(true); }, 2200);
      }

  IR.nkActs = { hear, bells, build, chain, scramble, trace, sentence };
})();
