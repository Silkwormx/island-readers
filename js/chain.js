/* Letter-change word chain, shared by ng, nk, and Unit 5.
   Frill models cap to cape once, then each step shows the start word, the letter that changes, and 3 or 4 numbered letters. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h, sleep, shuffle, icon, Snd } = IR;

  function changedAt(fromParts, toParts) {
    const n = Math.max(fromParts.length, toParts.length);
    for (let i = 0; i < n; i++) if (fromParts[i] !== toParts[i]) return i;
    return 0;
  }

  IR.runLetterChain = function (ctx, opts) {
    const words = opts.words || [];
    const split = opts.split;
    const say = opts.say;
    const pics = opts.pics || {};
    const distractors = opts.distractors || ['a', 'e', 'i', 'o', 'u', 's', 't', 'n', 'p', 'r', 'm', 'd', 'k', 'b', 'h'];
    let r = 1;
    let token = 0;
    const stage = ctx.stage;
    const line = 'Listen. Change one letter to make the new word.';

    function replayLine() {
      if (opts.promptAudio) Snd.play(opts.promptAudio);
    }

    async function model() {
      const my = ++token;
      ctx.setInstr(line, opts.promptKey || null);
      ctx.progress(0);
      stage.innerHTML = '';
      const slots = ['c', 'a', 'p'].map((ch) => h('span', { class: 'wtile chainslot' }, ch));
      const extra = h('span', { class: 'wtile chainslot chainnew' }, 'e');
      extra.hidden = true;
      const sayLine = h('p', { class: 'bigprompt' }, 'This is cap.');
      const row = h('div', { class: 'chainslots' }, ...slots, extra);
      const go = h('button', { class: 'btn big primary', type: 'button' }, 'Your turn', icon('next'));
      go.addEventListener('click', () => { token++; Snd.stop(); round(); });
      stage.append(h('div', { class: 'activity chainact' },
        h('div', { class: 'chainwho' }, h('img', { src: 'img/frill.webp', alt: '' }), h('b', null, 'Frill')),
        sayLine, row, go));
      ctx.setBack(() => false);
      ctx.setNext(() => { token++; Snd.stop(); round(); return true; });
      const again = h('button', { class: 'btn', type: 'button' }, icon('replay'), 'Watch again');
      again.addEventListener('click', () => { token++; Snd.stop(); model(); });
      go.before(again);
      if (opts.modelA) await Snd.play(opts.modelA);
      if (my !== token || !ctx.scr.ok()) return;
      await sleep(250);
      if (my !== token || !ctx.scr.ok()) return;
      sayLine.textContent = 'Listen: cape. What changed?';
      extra.hidden = false;
      extra.classList.add('glow');
      if (opts.modelB) await Snd.play(opts.modelB);
    }

    function round() {
      if (r >= words.length) { ctx.progress(1); ctx.finish(); return; }
      const my = ++token;
      const from = words[r - 1];
      const to = words[r];
      const a = split(from);
      const b = split(to);
      const idx = changedAt(a, b);
      const need = b[idx];
      let misses = 0;
      ctx.progress((r - 1) / Math.max(1, words.length - 1));
      ctx.setInstr(line, opts.promptKey || null);
      stage.innerHTML = '';
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'The glowing letter is the one that changes.');
      const slotEls = [];
      const n = Math.max(a.length, b.length);
      for (let i = 0; i < n; i++) {
        const ch = a[i] || '';
        const slot = h('span', { class: 'wtile chainslot' + (i === idx ? ' glow' : '') + (ch ? '' : ' empty') }, ch || '?');
        slotEls.push(slot);
      }
      const others = shuffle(distractors.filter((x) => x !== need && b.indexOf(x) < 0)).slice(0, 3);
      const pool = h('div', { class: 'wpool chainpool' });
      shuffle([need].concat(others)).forEach((t) => {
        const btn = h('button', { class: 'wtile', type: 'button', 'data-t': t }, t);
        btn.addEventListener('pointerup', () => pick(t, btn));
        btn.addEventListener('click', () => pick(t, btn));
        pool.append(btn);
      });
      const pic = pics[from];
      const head = h('div', { class: 'chainhead' },
        pic ? h('img', { class: 'chainpic', src: pic, alt: '' }) : null,
        h('div', { class: 'chainwords' },
          h('button', { class: 'btn', type: 'button', onclick: () => say(from) }, icon('speaker'), from),
          h('span', { class: 'chainarrow', 'aria-hidden': 'true' }, '\u2192'),
          h('button', { class: 'btn', type: 'button', onclick: () => say(to) }, icon('speaker'), 'Hear the new word')));
      const again = h('button', { class: 'btn', type: 'button', onclick: () => { replayLine(); say(to); } }, icon('replay'), 'Hear it again');
      stage.append(h('div', { class: 'activity chainact' },
        h('p', { class: 'bigprompt' }, line),
        head, h('div', { class: 'chainslots' }, ...slotEls), pool, h('div', { class: 'row center' }, again), status));
      ctx.setBack(() => { if (r > 1) { r--; round(); return true; } model(); return true; });
      ctx.setNext(() => { if (r < words.length - 1) { r++; round(); return true; } return false; });
      say(from);
      sleep(650).then(() => { if (my === token && ctx.scr.ok()) say(to); });

      async function pick(t, btn) {
        if (pool.dataset.lock || my !== token) return;
        if (btn.dataset.hit) return;
        btn.dataset.hit = '1';
        if (t === need) {
          pool.dataset.lock = '1';
          slotEls[idx].textContent = need;
          slotEls[idx].classList.add('right');
          btn.classList.add('right');
          status.textContent = 'Yes! ' + to;
          if (opts.ding) await opts.ding(to);
          if (!ctx.scr.ok() || my !== token) return;
          r++;
          await sleep(500);
          if (ctx.scr.ok() && my === token) round();
        } else {
          misses++;
          if (ctx.miss) ctx.miss();
          btn.classList.add('tried');
          if (misses < 2) {
            status.textContent = 'Not yet. Look at the glowing letter, then try a new one.';
            slotEls[idx].classList.add('hint');
            if (opts.tryAgain) await opts.tryAgain(to);
            btn.dataset.hit = '';
          } else {
            pool.dataset.lock = '1';
            slotEls[idx].textContent = need;
            slotEls[idx].classList.add('right');
            status.textContent = 'The new letter is ' + need + '. ' + from + ' makes ' + to + '.';
            [...pool.children].forEach((el) => { if (el.dataset.t === need) el.classList.add('hint'); });
            await say(to);
            if (!ctx.scr.ok() || my !== token) return;
            r++;
            await sleep(900);
            if (ctx.scr.ok() && my === token) round();
          }
        }
      }
    }

    if (opts.skipModel) round();
    else model();
  };
})();
