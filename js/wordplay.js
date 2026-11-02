/* Word Chains + Scrambled Letters (Nov 1 2026), Unit 3 ng model for all units. Whole-word audio only, never isolated sounds.
   Loaded after orange.js, before screens.js. Uses only taught Unit 3 words that have recorded audio. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h, sleep, shuffle, colorWord, icon, Snd, A, sayWord } = IR;
  const tile = (t, extra) => h('button', { class: 'wtile' + (t === 'ng' ? ' ngtile' : '') + (extra || ''), type: 'button', 'data-t': t }, t);
  const split = (w) => { const out = []; for (let i = 0; i < w.length; i++) { if (w.slice(i, i + 2) === 'ng') { out.push('ng'); i++; } else out.push(w[i]); } return out; };

  /* 1. Word Chains: change one tile at a time. */
  const CHAIN = ['sing', 'sang', 'rang', 'ring', 'king', 'wing'];
  const chain = {
    id: 'chain', title: 'Word Chains', blurb: 'Change one letter to make a new word', color: '#C95A10',
    run(ctx) {
      const stage = ctx.stage; let r = 1;
      ctx.setInstr('Listen to the new word. Change one letter to make it.', 'p_chain');
      const cur = h('div', { class: 'wcur' }); const pool = h('div', { class: 'wpool' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const hear = h('button', { class: 'btn big', type: 'button', onclick: () => sayWord(CHAIN[r]) }, icon('speaker'), 'Hear the new word');
      const trail = h('p', { class: 'wtrail' });
      stage.append(h('div', { class: 'activity wordplay' }, trail, cur, h('div', { class: 'row center' }, hear), h('p', { class: 'small center' }, 'Tap a letter in the word, then tap the new letter.'), pool, status));
      let parts = split(CHAIN[0]); let pick = -1;
      function show() {
        ctx.progress((r - 1) / (CHAIN.length - 1)); trail.textContent = CHAIN.slice(0, r).join(' \u2192 ');
        cur.innerHTML = ''; parts.forEach((p, i) => { const t = tile(p, i === pick ? ' sel' : ''); t.addEventListener('click', () => { pick = i; show(); }); cur.append(t); });
        pool.innerHTML = ''; const target = split(CHAIN[r]); const need = target.find((t, i) => t !== parts[i]);
        shuffle([need, ...shuffle(['a', 'i', 'o', 'u', 's', 'r', 'k', 'w', 'h', 'b'].filter((x) => x !== need && !parts.includes(x))).slice(0, 3)])
          .forEach((t) => { const b = tile(t); b.addEventListener('click', () => place(t, b)); pool.append(b); });
      }
      async function place(t, b) {
        if (pick < 0) { status.textContent = 'First tap the letter in the word you want to change.'; return; }
        const target = split(CHAIN[r]); const next = parts.slice(); next[pick] = t;
        if (next.join('') !== CHAIN[r]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 500); status.textContent = 'Not quite. Listen again and look at each letter.'; await IR.tryAgain(A.word(CHAIN[r])); return; }
        parts = target; pick = -1; status.textContent = CHAIN[r] + '!'; await IR.ding(CHAIN[r]); if (!ctx.scr.ok()) return;
        r++; if (r >= CHAIN.length) { ctx.progress(1); trail.textContent = CHAIN.join(' \u2192 '); status.textContent = 'You made the whole chain!'; await sleep(400); if (ctx.scr.ok()) ctx.finish(); return; }
        status.textContent = '\u00a0'; show(); await sleep(300); sayWord(CHAIN[r]);
      }
      show(); Snd.seq([A.prompt('p_chain'), A.word(CHAIN[1])], 300);
    }
  };

  /* 2. Scrambled Letters: tap tiles in order; ng stays one tile. */
  const SCR = ['king', 'song', 'hung', 'bang', 'wing'];
  const scramble = {
    id: 'scramble', title: 'Scrambled Letters', blurb: 'Put the tiles in order', color: '#D9631A',
    run(ctx) {
      const stage = ctx.stage; let r = 0; const order = shuffle(SCR);
      ctx.setInstr('Listen to the word. Tap the tiles in order to spell it.', 'p_scramble');
      const slots = h('div', { class: 'wcur' }); const pool = h('div', { class: 'wpool' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const hear = h('button', { class: 'btn big', type: 'button', onclick: () => sayWord(order[r]) }, icon('speaker'), 'Hear the word');
      const undo = h('button', { class: 'btn', type: 'button', onclick: () => { if (got.length) { got.pop(); draw(); } } }, 'Undo');
      stage.append(h('div', { class: 'activity wordplay' }, h('div', { class: 'row center' }, hear), slots, pool, h('div', { class: 'row center' }, undo), status));
      let parts, mix, got;
      function start() { parts = split(order[r]); do { mix = shuffle(parts.map((t, i) => ({ t, i }))); } while (mix.length > 1 && mix.every((m, k) => m.t === parts[k])); got = []; status.textContent = '\u00a0'; draw(); ctx.progress(r / order.length); }
      function draw() {
        slots.innerHTML = ''; parts.forEach((p, k) => slots.append(h('span', { class: 'wslot' + (p === 'ng' ? ' ngslot' : '') }, got[k] ? got[k].t : '')));
        pool.innerHTML = ''; mix.forEach((m) => { const used = got.includes(m); const b = tile(m.t, used ? ' used' : ''); b.disabled = used; b.addEventListener('click', () => put(m, b)); pool.append(b); });
      }
      async function put(m, b) {
        const k = got.length;
        if (m.t !== parts[k]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 500); status.textContent = 'Try another tile. Say the word slowly.'; await IR.tryAgain(A.word(order[r])); return; }
        got.push(m); draw();
        if (got.length === parts.length) { status.textContent = order[r] + '!'; await IR.ding(order[r]); if (!ctx.scr.ok()) return; r++;
          if (r >= order.length) { ctx.progress(1); status.textContent = 'All the words are spelled!'; await sleep(400); if (ctx.scr.ok()) ctx.finish(); return; }
          await sleep(300); start(); sayWord(order[r]); }
      }
      start(); Snd.seq([A.prompt('p_scramble'), A.word(order[0])], 300);
    }
  };
  if (IR.D.minutes) { IR.D.minutes.chain = 3; IR.D.minutes.scramble = 3; }
  const bi = IR.LESSONS.findIndex((x) => x.id === 'build');
  IR.LESSONS.splice(bi + 1, 0, chain, scramble);
})();
