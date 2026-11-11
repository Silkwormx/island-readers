/* Letter-change word chain, shared by ng, nk, Unit 5, and Unit 6.
   A short worked example comes first (the caller picks words that match the lesson).
   Then each step shows the start word, the sound that changes, and numbered choices. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h, sleep, shuffle, icon, Snd } = IR;

  function changedAt(fromParts, toParts) {
    const n = Math.max(fromParts.length, toParts.length);
    for (let i = 0; i < n; i++) if (fromParts[i] !== toParts[i]) return i;
    return 0;
  }

  function changeSrc(from, to) {
    return 'audio/chg_' + String(from).toLowerCase() + '_' + String(to).toLowerCase() + '.mp3';
  }

  IR.runLetterChain = function (ctx, opts) {
    const words = opts.words || [];
    const split = opts.split;
    const say = opts.say;
    const distractors = opts.distractors || ['a', 'e', 'i', 'o', 'u', 's', 't', 'n', 'p', 'r', 'm', 'd', 'k', 'b', 'h'];
    const model = opts.model || {
      from: 'cap', to: 'cape',
      audioA: 'audio/chain_model_a.mp3',
      audioB: 'audio/chain_model_b.mp3'
    };
    const rule = opts.promptAudio || 'audio/p_chain_rule.mp3';
    let r = 1;
    let token = 0;
    let ruled = false;
    const stage = ctx.stage;
    const line = opts.line || 'Change one letter to make a new word.';
    const steps = Math.max(1, words.length - 1);

    function slotsFor(parts, idx, emptyOk) {
      const n = parts.length;
      const els = [];
      for (let i = 0; i < n; i++) {
        const ch = parts[i] || '';
        els.push(h('span', { class: 'wtile chainslot' + (i === idx ? ' glow' : '') + (ch ? '' : ' empty') }, ch || (emptyOk ? '' : '?')));
      }
      return els;
    }

    async function modelStep() {
      const my = ++token;
      ctx.setInstr(line, opts.promptKey || null);
      if (ctx.count) ctx.count(0, steps);
      stage.innerHTML = '';
      const a = split(model.from);
      const b = split(model.to);
      const idx = changedAt(a, b);
      const boxes = slotsFor(a, idx, true);
      if (b.length > a.length) boxes.push(h('span', { class: 'wtile chainslot glow empty' }, ''));
      const sayLine = h('p', { class: 'bigprompt' }, 'This is ' + model.from + '.');
      const go = h('button', { class: 'btn big primary', type: 'button' }, 'Your turn', icon('next'));
      go.addEventListener('click', () => { token++; Snd.stop(); round(); });
      const again = h('button', { class: 'btn', type: 'button' }, icon('replay'), 'Watch again');
      again.addEventListener('click', () => { token++; Snd.stop(); modelStep(); });
      stage.append(h('div', { class: 'activity chainact' },
        h('div', { class: 'chainwho' }, h('img', { src: 'img/frill.webp', alt: '' }), h('b', null, 'Frill')),
        sayLine,
        h('p', { class: 'chainfrom' }, model.from),
        h('div', { class: 'chainslots' }, ...boxes),
        h('div', { class: 'row center' }, again, go)));
      ctx.setBack(() => false);
      ctx.setNext(() => { token++; Snd.stop(); round(); return true; });
      if (!ruled) { ruled = true; await IR.sayItem(ctx, rule, null); }
      if (my !== token || !ctx.scr.ok()) return;
      if (model.audioA) await Snd.play(model.audioA);
      if (my !== token || !ctx.scr.ok()) return;
      await sleep(200);
      if (my !== token || !ctx.scr.ok()) return;
      const next = boxes[idx] || boxes[boxes.length - 1];
      if (next) { next.textContent = b[idx] || b[b.length - 1]; next.classList.add('glow'); next.classList.remove('empty'); }
      sayLine.textContent = 'Listen: ' + model.to + '. What changed?';
      if (model.audioB) await Snd.play(model.audioB);
    }

    function round() {
      if (r >= words.length) { if (ctx.count) ctx.count(steps, steps); ctx.progress(1); ctx.finish(); return; }
      const my = ++token;
      const from = words[r - 1];
      const to = words[r];
      const a = split(from);
      const b = split(to);
      const idx = changedAt(a, b);
      const need = b[idx];
      let misses = 0;
      ctx.progress((r - 1) / steps);
      if (ctx.count) ctx.count(r, steps);
      ctx.setInstr(line, opts.promptKey || null);
      stage.innerHTML = '';
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'The highlighted box is the one that changes.');
      const n = Math.max(a.length, b.length);
      const slotEls = [];
      for (let i = 0; i < n; i++) {
        const ch = a[i] || '';
        slotEls.push(h('span', { class: 'wtile chainslot' + (i === idx ? ' glow' : '') + (ch ? '' : ' empty') }, ch));
      }
      const ending = /^(s|es|ed|ing|ng|nk|sh|ch|th|ck)$/;
      const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const graphemes = ending.test(need)
        ? ['s', 'es', 'ed', 'ing', 'ng', 'nk', 'sh', 'ch', 'th'].filter((x) => ending.test(x))
        : letters;
      const others = shuffle(graphemes.filter((x) => x !== need && b.indexOf(x) < 0)).slice(0, 3);
      const pool = h('div', { class: 'chainopts' });
      shuffle([need].concat(others)).forEach((t) => {
        const btn = h('button', { class: 'wtile chainpick', type: 'button', 'data-t': t }, t);
        btn.addEventListener('pointerup', () => pick(t, btn));
        btn.addEventListener('click', () => pick(t, btn));
        pool.append(btn);
      });
      stage.append(h('div', { class: 'activity chainact' },
        h('p', { class: 'chainfrom' }, from),
        h('div', { class: 'chainslots' }, ...slotEls),
        pool,
        status));
      ctx.setBack(() => { if (r > 1) { r--; round(); return true; } modelStep(); return true; });
      ctx.setNext(() => { if (r < words.length - 1) { r++; round(); return true; } return false; });
      const clip = changeSrc(from, to);
      if (!ruled) { ruled = true; IR.sayItem(ctx, rule, clip); }
      else Snd.play(clip);

      async function pick(t, btn) {
        if (pool.dataset.lock || my !== token) return;
        if (btn.dataset.hit) return;
        btn.dataset.hit = '1';
        if (t === need) {
          pool.dataset.lock = '1';
          slotEls[idx].textContent = need;
          slotEls[idx].classList.remove('empty');
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
            status.textContent = 'Not yet. Look at the highlighted box.';
            if (opts.tryAgain) await opts.tryAgain(to);
            btn.dataset.hit = '';
          } else {
            pool.dataset.lock = '1';
            slotEls[idx].textContent = need;
            slotEls[idx].classList.remove('empty');
            slotEls[idx].classList.add('right');
            status.textContent = from + ' makes ' + to + '.';
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
    else modelStep();
  };
})();
