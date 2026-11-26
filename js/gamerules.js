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
  IR.storyCovers = { '7.1': 'img/cover_u71.webp', '7.2': 'img/cover_u72.webp', '7.3': 'img/cover_u73.webp', '8.1': 'img/cover_u81.webp', '8.2': 'img/cover_u82.webp', '8.3': 'img/cover_u83.webp', '9.1': 'img/cover_u91.webp', '9.2': 'img/cover_u92.webp', '9.3': 'img/cover_u93.webp', '9.4': 'img/cover_u94.webp',
    '10.1': 'img/cover_u101.webp', '10.2': 'img/cover_u102.webp', '11.1': 'img/cover_u111.webp', '11.2': 'img/cover_u112.webp', '12.1': 'img/cover_u121.webp', '12.2': 'img/cover_u122.webp', '12.3': 'img/cover_u123.webp',
    '1.1': 'img/cover_u11.webp',
    '1.2': 'img/cover_u12.webp',
    '1.3': 'img/cover_u13.webp',
    '1.4': 'img/cover_u14.webp',
    '2.1': 'img/cover_u21.webp',
    '2.2': 'img/cover_u22.webp',
    '2.3': 'img/cover_u23.webp',
    '2.4': 'img/cover_u24.webp',
    '3.1': 'img/cover_u31.webp',
    '3.2': 'img/cover_u32.webp',
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
  /* One small "Back to lesson menu" link, and one orange Next only when a lesson asks for it.
     Round-skip Back and Next stay off the screen. Correct answers still move on by themselves. */
  /* Keep Next (and Back, once the story has pages) in the bottom bar. Phone story
     screens were hiding Next, and the in-page button sat below the fold. */
  IR.pinStoryNav = function (onBack) {
    const nav = document.querySelector('.lesson-nav');
    if (!nav) return;
    nav.classList.add('storynav');
    nav.classList.remove('nonext');
    const next = nav.querySelector('.btn.next');
    if (next) { next.hidden = false; if (next.firstChild && next.firstChild.nodeType === 3) next.firstChild.textContent = 'Next'; }
    let back = nav.querySelector('.storyback');
    if (onBack) {
      if (!back) {
        back = h('button', { class: 'btn big storyback', type: 'button', 'aria-label': 'Back' }, IR.icon('back'), 'Back');
        if (next) nav.insertBefore(back, next);
        else nav.append(back);
      }
      back.onclick = function () { IR.Snd.stop(); onBack(); };
    } else if (back) back.remove();
  };

  IR.simpleNav = function (nav, nextBtn, goMenu, menuLabel) {
    const back = nav.querySelector(':scope > .btn.back');
    if (back) back.remove();
    nextBtn.hidden = true;
    nextBtn.classList.add('primary');
    const link = h('button', {
      class: 'menulink',
      type: 'button',
      onclick: function () { if (typeof goMenu === 'function') goMenu(); }
    }, menuLabel || 'Back to lesson menu');
    nav.insertBefore(link, nav.firstChild);
    nav.classList.add('simple');
    return {
      label: function (t) {
        const show = !!(t && String(t).trim());
        nextBtn.hidden = !show;
        if (show && nextBtn.firstChild) nextBtn.firstChild.textContent = t;
      }
    };
  };

  IR.sayItem = function (ctx, instr, item) {
    const said = ctx._saidInstr || (ctx._saidInstr = Object.create(null));
    if (instr && !said[instr]) {
      said[instr] = 1;
      return IR.Snd.seq(item ? [instr, item] : [instr], 240);
    }
    return item ? IR.Snd.play(item) : Promise.resolve(false);
  };

  /* Index of this question inside its category (same type), 1-based. */
  /* Classroom number badge. Same orange circle on bells, word tiles, and chain choices. */
  IR.numBadge = function (n) {
    return h('span', { class: 'irnum', 'aria-hidden': 'true' }, String(n));
  };
  /* Silent e: the "no e" choice is a red box with a bold X over the letter e. */
  IR.noEMark = function () {
    return h('span', { class: 'noe', role: 'img', 'aria-label': 'no e' },
      h('span', { class: 'noe-e' }, 'e'),
      h('span', { class: 'noe-x', 'aria-hidden': 'true' }));
  };

  IR.catCount = function (items, q, keyFn) {
    const key = keyFn(items[q]);
    const same = [];
    items.forEach((it, i) => { if (keyFn(it) === key) same.push(i); });
    return { i: same.indexOf(q) + 1, n: same.length };
  };

  /* Ring every bell: Frill says a whole word. Three bells, one of them that word. */
  function bellNorm(w) { return String(w || '').toLowerCase().replace(/[^a-z]/g, ''); }
  function bellStem(w) {
    const s = bellNorm(w);
    if (s.length > 4 && s.endsWith('ing')) return s.slice(0, -3);
    if (s.length > 3 && s.endsWith('es')) return s.slice(0, -2);
    if (s.length > 3 && s.endsWith('ed')) return s.slice(0, -2);
    if (s.length > 3 && /[^s]s$/.test(s)) return s.slice(0, -1);
    return s;
  }
  function bellLev(a, b) {
    const m = [];
    for (let i = 0; i <= a.length; i++) {
      m[i] = [i];
      for (let j = 1; j <= b.length; j++) {
        if (i === 0) m[i][j] = j;
        else m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return m[a.length][b.length];
  }
  function bellClose(a, b) {
    const A = bellNorm(a); const B = bellNorm(b);
    if (!A || !B || A === B) return 99;
    if (bellStem(A) === bellStem(B)) return 1;
    const d = bellLev(A, B);
    if (d === 1) return 2;
    if (d === 2) return 4;
    return 8 + d;
  }
  function bellPool(words) {
    const seen = Object.create(null); const out = [];
    (words || []).forEach((w) => {
      const n = bellNorm(w);
      if (n.length < 3 || n.length > 12 || seen[n]) return;
      if (n === 'ing' || n === 'ed' || n === 'es') return;
      seen[n] = 1; out.push(n);
    });
    return out;
  }
  function bellMates(target, pool) {
    const ranked = pool.filter((w) => w !== target).map((w) => ({ w: w, s: bellClose(target, w) }));
    ranked.sort((a, b) => a.s - b.s || (a.w < b.w ? -1 : 1));
    const out = [];
    ranked.forEach((item) => { if (out.length < 2 && (out.length === 0 || item.s <= 4)) out.push(item); });
    ranked.forEach((item) => { if (out.length < 2 && !out.some((x) => x.w === item.w)) out.push(item); });
    return out.slice(0, 2);
  }
  IR.bellClose = bellClose;
  IR.bellRounds = function (words) {
    const pool = bellPool(words);
    function usable(maxScore) {
      return pool.filter((t) => {
        const mates = bellMates(t, pool);
        return mates.length === 2 && mates.every((x) => x.s <= maxScore);
      });
    }
    let targets = usable(2);
    if (targets.length < 10) targets = usable(4);
    const order = IR.shuffle ? IR.shuffle(targets.slice()) : targets.slice();
    const n = Math.min(12, order.length);
    const take = n >= 10 ? order.slice(0, n) : order.slice(0, Math.min(12, order.length));
    return take.map((t) => {
      const mates = bellMates(t, pool);
      return { target: t, bells: [t, mates[0].w, mates[1].w] };
    });
  };
  IR.ringBells = function (ctx, opts) {
    opts = opts || {};
    const audio = opts.audio;
    const color = opts.color || function (w) { return document.createTextNode(w); };
    const rounds = IR.bellRounds(opts.words);
    let r = 0; let locked = false; let current = '';
    const { h, sleep, shuffle, icon, Snd, A } = IR;
    function speak(manual) { return Snd.play(audio(current), manual ? { manual: true } : {}); }
    if (ctx.setInstr) ctx.setInstr('');
    function show() {
      if (r >= rounds.length) return done();
      const round = rounds[r];
      current = round.target;
      locked = false;
      if (IR.coachReset) IR.coachReset('ring-' + r);
      ctx.progress(r / rounds.length);
      ctx.stage.innerHTML = '';
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const row = h('div', { class: 'bellrow trio' });
      shuffle(round.bells.slice()).forEach((w, i) => {
        const n = String(i + 1);
        const b = h('button', { class: 'bellbtn', type: 'button', 'data-w': w, 'aria-label': 'Bell ' + n + ', ' + w },
          h('span', { class: 'bellface' },
            h('img', { src: 'img/bell_unlit.png', alt: '' }),
            h('span', { class: 'bellnum irnum', 'aria-hidden': 'true' }, n)),
          h('span', { class: 'bellword' }, color(w)));
        b.addEventListener('click', () => tap(w, b, status, row));
        row.append(b);
      });
      const again = h('button', { class: 'btn big', type: 'button', onclick: () => speak(true) }, icon('speaker'), 'Hear it again');
      ctx.stage.append(h('div', { class: 'activity bellgame' },
        h('div', { class: 'bellask' },
          h('img', { src: 'img/frill.webp', alt: 'Frill' }),
          h('p', null, 'Ring the bell you hear.'),
          again),
        h('div', { class: 'bellscene', style: 'background-image:url(img/ob_scene.jpg)' }),
        row, status));
      speak(false);
    }
    async function tap(w, b, status, row) {
      if (locked || b.classList.contains('tried')) return;
      if (w !== current) {
        ctx.miss();
        const stepName = await IR.coachMiss({
          key: 'ring-' + r, wrongEl: b,
          correctEl: () => row.querySelector('[data-w="' + current + '"]'),
          statusEl: status, replay: () => speak(true), model: () => speak(true)
        });
        if (stepName === 'model') IR.againLater(rounds, r);
        return;
      }
      locked = true;
      b.classList.add('lit');
      if (typeof opts.onRight === 'function') opts.onRight(b, w);
      const img = b.querySelector('img');
      if (img) img.src = 'img/bell_lit.png';
      status.textContent = 'The bell rings.';
      await Snd.play(A.sfx.ding, { manual: true });
      if (!ctx.scr.ok()) return;
      await sleep(420);
      if (!ctx.scr.ok()) return;
      r++;
      show();
    }
    async function done() {
      ctx.progress(1);
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'activity bellgame belldone' },
        IR.celebration(false),
        h('h2', null, 'The bells rang!')));
      await Snd.play(A.sfx.gong, { manual: true });
      await sleep(900);
      if (ctx.scr.ok()) ctx.finish();
    }
    ctx.setBack(() => { if (r > 0) { Snd.stop(); r--; show(); return true; } return false; });
    ctx.setNext(() => { if (r < rounds.length - 1) { Snd.stop(); r++; show(); return true; } return false; });
    show();
  };
})();
