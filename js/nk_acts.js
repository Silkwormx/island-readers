/* nk activities that mirror the ng unit (Nov 2 2026): Hear and Pick, Ring every bell and learn its sounds, Build-a-Word, Word Chains,
   Scrambled Letters, Feed Zip, Sentence Bridge. Whole-word and whole-sentence audio only; no isolated sounds.
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
      const R = rounds[r]; ctx.progress(got.size / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); stage.innerHTML = ''; let misses = 0, locked = false;
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
      stage.append(h('div', { class: 'activity' }, spk, grid, status)); IR.sayItem(ctx, 'audio/nk_p_hear.mp3', W(R.word));
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
    const show = () => { ctx.progress(lit.size / words.length); if (ctx.count) ctx.count(r + 1, words.length); card.innerHTML = ''; card.append(h('span', { class: 'bigword' }, colorNk(order[r]))); status.textContent = '\u00a0'; };
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
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); stage.innerHTML = ''; let misses = 0;
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
      stage.append(h('div', { class: 'activity' }, spk, slotsEl, bankEl, status)); IR.sayItem(ctx, 'audio/nk_p_build.mp3', W(R.word));
    }
    round();
  }

  function chain(ctx) {
    IR.runLetterChain(ctx, {
      words: N.chain,
      split: split,
      say: say,
      pics: N.pics || {},
      ding: (w) => ding(w),
      tryAgain: (w) => tryAgain(W(w)),
      promptAudio: 'audio/nk_p_chain.mp3',
      promptKey: 'chain',
      modelA: 'audio/chain_model_a.mp3',
      modelB: 'audio/chain_model_b.mp3'
    });
  }

  function scramble(ctx) {
    const stage = ctx.stage; let r = 0; const order = shuffle(N.scramble);
    ctx.setInstr('Listen to the word. Tap the tiles in order to spell it.', 'scramble');
    const slots = h('div', { class: 'wcur' }); const pool = h('div', { class: 'wpool' }); const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
    const hearB = h('button', { class: 'btn big', type: 'button', onclick: () => say(order[r]) }, icon('speaker'), 'Hear the word');
    let parts, mix, got;
    const undo = h('button', { class: 'btn', type: 'button', onclick: () => { if (got.length) { got.pop(); draw(); } } }, 'Undo');
    stage.append(h('div', { class: 'activity wordplay' }, h('div', { class: 'row center' }, hearB), slots, pool, h('div', { class: 'row center' }, undo), status));
    function start() { parts = split(order[r]); do { mix = shuffle(parts.map((t, i) => ({ t, i }))); } while (mix.length > 1 && mix.every((m, k) => m.t === parts[k])); got = []; status.textContent = '\u00a0'; draw(); ctx.progress(r / order.length); if (ctx.count) ctx.count(r + 1, order.length); }
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
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); stage.innerHTML = ''; let misses = 0; const audio = 'audio/nk_b_' + R.n + '.mp3';
      const spk = speakerBtn(() => Snd.play(audio), 'Hear the sentence');
      const slotsEl = h('div', { class: 'slots sent' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap or drag the words into the boxes.');
      const tiles = shuffle(R.words.map((w, i) => ({ id: 'w' + i, text: w, cls: 'word' })));
      const bridge = h('div', { class: 'bridgebar' }, ...R.words.map(() => h('i')));
      IR.TileBoard({ tiles, nSlots: R.words.length, slotsEl, bankEl, onTap: (text) => say(String(text).replace(/[^a-z]/gi, '')),
        onChange: (b) => { $$('i', bridge).forEach((el, k) => el.classList.toggle('on', b.slots[k] != null)); },
        onFull: async (texts, b) => {
          b.locked = true;
          if (texts.join(' ') === R.text) { status.textContent = 'Yes! The bridge is built.'; slotsEl.classList.add('right'); bridge.classList.add('lit'); await Snd.seq([A.sfx.ding, audio], 200); if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return; r++; if (r < rounds.length) round(); else { ctx.progress(1); ctx.finish(); } }
          else { misses++; ctx.miss(); status.textContent = 'Almost! Listen again and try again.'; slotsEl.classList.add('almost'); await tryAgain(audio); if (!ctx.scr.ok()) return; slotsEl.classList.remove('almost'); b.slots.fill(null); if (misses >= 2) b.hint = tiles.find((t) => t.text === R.words[0]).id; b.locked = false; b.render(); }
        } });
      stage.append(h('div', { class: 'activity sentact' }, h('div', { class: 'pic' }, h('img', { src: R.img, alt: 'A picture from the story' })), h('div', { class: 'row center' }, spk), slotsEl, bridge, bankEl, status));
      if (r === 0) IR.sayItem(ctx, 'audio/nk_p_sent.mp3', audio); else Snd.play(audio);
    }
    round();
  }

  function feed(ctx) {
    const words = (N.bells || []).concat((N.hear || []).map((x) => x.word)).concat(N.chips || []).filter(Boolean);
    const uniq = [...new Set(words)];
    const pics = {};
    ['trunk', 'pen', 'duck', 'sock', 'skunk'].forEach((w) => { if (uniq.includes(w) || true) pics[w] = 'img/nk_c_' + w + '.webp'; });
    // only attach pics that exist as choices in this lesson's word list when present
    const usePics = {};
    uniq.forEach((w) => { if (pics[w]) usePics[w] = pics[w]; });
    IR.runFeedZip(ctx, {
      words: uniq,
      say,
      colorWord: colorNk,
      pics: usePics,
      promptKey: 'feed',
      promptAudio: 'audio/nk_p_feed.mp3',
      rounds: 6
    });
  }

  IR.nkActs = { hear, bells, build, chain, scramble, feed, sentence };
})();
