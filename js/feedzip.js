/* Feed Zip: quick decoding game. Child reads a word, then taps the matching bubble to feed Zip.
   Shared by ng / nk / Unit 5. No gambling / FOMO. Dyslexia-friendly: big type, high contrast, calm pace. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h, $$, sleep, shuffle, icon, Snd, A, speakerBtn } = IR;

  /** @param {object} ctx lesson context
   *  @param {{ words:string[], say:(w:string)=>any, colorWord?:(w:string)=>Node, pics?:Record<string,string>, prompt?:string, promptAudio?:string|null, rounds?:number }} opts */
  IR.runFeedZip = function (ctx, opts) {
    const pool = (opts.words || []).filter(Boolean);
    const say = opts.say || ((w) => IR.sayWord && IR.sayWord(w));
    const colorWord = opts.colorWord || ((w) => document.createTextNode(w));
    const pics = opts.pics || {};
    const need = Math.min(opts.rounds || 6, pool.length || 1);
    const targets = shuffle(pool.slice()).slice(0, need);
    let r = 0;
    const got = new Set();
    const stage = ctx.stage;
    ctx.setInstr(opts.prompt || 'Read the word. Then tap the bubble that matches to feed Zip.', opts.promptKey || null);
    if (opts.promptAudio) Snd.play(opts.promptAudio);

    function distractors(w) {
      const others = shuffle(pool.filter((x) => x !== w));
      const pick = others.slice(0, 2);
      while (pick.length < 2 && pool.length > 1) {
        const x = pool[Math.floor(Math.random() * pool.length)];
        if (x !== w && !pick.includes(x)) pick.push(x);
        else break;
      }
      return pick;
    }

    function bubble(w) {
      const pic = pics[w];
      const inner = [];
      if (pic) inner.push(h('img', { class: 'fz-pic', src: pic, alt: '' }));
      inner.push(h('span', { class: 'fz-w' }, colorWord(w)));
      return h('button', { class: 'fz-bubble' + (pic ? ' haspic' : ''), type: 'button', 'data-w': w, 'aria-label': 'Feed Zip: ' + w }, ...inner);
    }

    function round() {
      if (r >= targets.length) { ctx.progress(1); ctx.finish(); return; }
      const w = targets[r];
      ctx.progress(got.size / targets.length);
      stage.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const zip = h('div', { class: 'fz-zip', 'aria-hidden': 'true' },
        h('img', { class: 'fz-zipimg', src: 'img/zipA.webp', alt: '' }),
        h('span', { class: 'fz-mouth' }, '\u25CF'));
      const card = h('div', { class: 'fz-card' },
        h('p', { class: 'fz-ask' }, 'Read this word'),
        h('div', { class: 'fz-word' }, colorWord(w)),
        speakerBtn(() => say(w), 'Hear the word'));
      const field = h('div', { class: 'fz-field' }, ...shuffle([w].concat(distractors(w))).map(bubble));
      ctx.setBack(() => { if (r > 0) { Snd.stop(); r--; round(); return true; } return false; });
      ctx.setNext(() => { if (r < targets.length - 1) { Snd.stop(); r++; round(); return true; } return false; });

      $$('.fz-bubble', field).forEach((b) => {
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          const x = b.getAttribute('data-w');
          if (x === w) {
            locked = true;
            b.classList.add('right', 'eaten');
            zip.classList.add('yum');
            status.textContent = 'Yum! Zip ate ' + w + '!';
            $$('.fz-bubble', field).forEach((o) => { if (o !== b) o.classList.add('fade'); });
            await Snd.seq([A.sfx.ding].concat(typeof say === 'function' ? [] : []), 80);
            await say(w);
            if (!ctx.scr.ok()) return;
            await sleep(550);
            if (!ctx.scr.ok()) return;
            got.add(r); r++; round();
          } else {
            b.classList.add('tried');
            status.textContent = 'Not that one. Read the word again.';
            ctx.miss && ctx.miss();
            await Snd.play(A.sfx.tryagain);
          }
        });
      });

      stage.append(h('div', { class: 'activity feedzip' },
        h('div', { class: 'fz-top' }, zip, card),
        h('p', { class: 'fz-hint' }, 'Tap the bubble that matches'),
        field, status));
    }
    round();
  };
})();
