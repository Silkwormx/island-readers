/* Shared game rules for every unit and the sight-word chests.
   Future games get them by calling IR.attachGameRules(ctx, screen, title)
   and IR.sayItem(ctx, instructionSrc, itemSrc) for each question. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h } = IR;

  IR.attachGameRules = function (ctx, screen, title) {
    if (!screen || screen.querySelector('.acttitle')) return ctx;
    const titleEl = h('h2', { class: 'acttitle' }, title || '');
    const countEl = h('p', { class: 'qcount', 'aria-live': 'polite' }, '');
    const top = screen.querySelector('.lesson-top');
    if (top) top.after(titleEl);
    else screen.insertBefore(titleEl, screen.firstChild);
    const nav = screen.querySelector('.lesson-nav');
    if (nav) screen.insertBefore(countEl, nav);
    else screen.append(countEl);
    ctx._saidInstr = Object.create(null);
    ctx.count = function (i, n) { countEl.textContent = n ? (i + ' of ' + n) : ''; };
    ctx.setGameTitle = function (t) { titleEl.textContent = t || ''; };
    return ctx;
  };

  /* Instruction audio plays once per activity. Later questions play only the item.
     The speaker button can still replay the instruction on its own. */
  IR.sayItem = function (ctx, instr, item) {
    const said = ctx._saidInstr || (ctx._saidInstr = Object.create(null));
    if (instr && !said[instr]) {
      said[instr] = 1;
      return IR.Snd.seq(item ? [instr, item] : [instr], 240);
    }
    return item ? IR.Snd.play(item) : Promise.resolve(false);
  };

  /* Index of this question inside its category (same type), 1-based. */
  IR.catCount = function (items, q, keyFn) {
    const key = keyFn(items[q]);
    const same = [];
    items.forEach((it, i) => { if (keyFn(it) === key) same.push(i); });
    return { i: same.indexOf(q) + 1, n: same.length };
  };
})();
