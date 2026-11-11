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
  /* One button for the whole card. Inner Read label and activity dots are not separate controls. */
  IR.tapCard = function (opts) {
    opts = opts || {};
    let opened = false;
    const open = function () {
      if (opened) return;
      opened = true;
      setTimeout(function () { opened = false; }, 350);
      if (typeof opts.onOpen === 'function') opts.onOpen();
      else if (opts.href) { IR.Snd.stop(); location.hash = opts.href; }
    };
    return h('button', {
      class: 'tapcard ' + (opts.className || ''),
      type: 'button',
      'aria-label': opts.label || null,
      onclick: open
    }, ...(opts.kids || []));
  };
  /* Lesson or Story Time card. Future units call this and the whole card is the tap target. */
  IR.pairCard = function (o) {
    o = o || {};
    const lesson = !!o.lesson;
    const kids = [
      h('span', { class: 'bkind' }, o.kicker || (lesson ? 'Lesson' : 'Story')),
      o.done ? h('span', { class: 'bstar' }, h('span', { class: 'sstar on', 'aria-hidden': 'true' }, IR.icon('star'))) : null,
      IR.artFrame(o.img, o.alt || ''),
      h('span', { class: 'stxt bbot' }, h('b', null, o.title || ''), o.min != null && o.min !== '' ? h('span', { class: 'smin' }, o.min + ' min') : null),
      h('span', { class: 'cardgo', 'aria-hidden': 'true' }, lesson ? 'Learn' : 'Read')
    ];
    const label = o.label || (lesson
      ? 'Lesson. ' + (o.title || '') + '. Opens the lesson.'
      : 'Story. ' + (o.title || '') + '. Opens the story.');
    return h('li', { class: 'bigli' }, IR.tapCard({
      className: 'stopcard bigbox ' + (lesson ? 'lessonstop' : 'storystop') + (o.done ? ' done' : '') + (o.next ? ' nextup' : ''),
      label: label,
      href: o.href,
      kids: kids
    }));
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
