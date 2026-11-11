/* Shared game rules for every unit and the sight-word chests.
   Future games get them by calling IR.attachGameRules(ctx, screen, title)
   and IR.sayItem(ctx, instructionSrc, itemSrc) for each question. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h } = IR;
  /* One picture for every lesson card. Swap this when the shared teaching art arrives. */
  IR.lessonArt = 'img/lesson_zip_frill.webp';
  IR.lessonArtAlt = 'Zip and Frill teaching at a chalkboard';
  IR.artFrame = function (src, alt) {
    return h('span', { class: 'bframe' }, h('img', { src: src, alt: alt || '' }));
  };
  IR.storyCovers = {
    '4.1': 'img/cover_u41.webp',
    '4.2': 'img/cover_u42.webp',
    '5.1': 'img/cover_u51.webp',
    '5.2': 'img/cover_u52.webp',
    '6.1': 'img/cover_u61.webp',
    '6.2': 'img/cover_u62.webp',
    '6.3': 'img/cover_u63.webp'
  };
  IR.actButton = function (href, flags) {
    flags = flags || [];
    const done = flags.filter(Boolean).length;
    return h('button', {
      class: 'actdots', type: 'button',
      'aria-label': 'Activities. ' + done + ' of ' + flags.length + ' done.',
      onclick: function (e) { e.stopPropagation(); IR.Snd.stop(); location.hash = href; }
    }, h('span', { class: 'dots' }, ...flags.map(function (on) {
      return h('i', { class: 'dot' + (on ? ' on' : '') });
    })));
  };

  IR.storyRead = function (href) {
    return h('button', {
      class: 'storyread', type: 'button',
      onclick: function (e) { e.stopPropagation(); IR.Snd.stop(); location.hash = href; }
    }, 'Read');
  };

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
