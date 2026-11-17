/* Shared calm play pieces for a lesson: a per-game progress bar, an in-a-row count,
   a mute control for short sound effects, a small Zip and Frill reaction, and an end badge.
   Frill is the v4 B portrait only (img/frill.webp). Other units call IR.engage.mount and IR.lessonMenu. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, icon } = IR;
  const ZIP = 'img/zipA.webp';
  const FRILL = 'img/frill.webp';
  let row = 0;
  let best = 0;
  let flips = 0;
  let lastKind = '';
  let lastAt = 0;
  let popTimer = 0;
  let streakEl = null;
  let popEl = null;

  function muted() {
    const s = IR.S();
    return !!(s.settings && s.settings.sfxMute);
  }

  function isEffect(src) {
    return typeof src === 'string' && src.indexOf('/sfx_') >= 0;
  }

  function paintStreak() {
    if (streakEl) streakEl.textContent = 'In a row: ' + row;
  }

  function showPop(kind) {
    if (!popEl || !document.querySelector('.u5step')) return;
    const yes = kind === 'yes';
    const who = yes ? (flips++ % 2 ? ZIP : FRILL) : FRILL;
    const img = popEl.querySelector('img');
    const say = popEl.querySelector('b');
    if (img) img.src = who;
    if (say) say.textContent = yes ? 'Yes' : 'Try again';
    popEl.classList.toggle('yes', yes);
    popEl.classList.toggle('again', !yes);
    popEl.hidden = false;
    clearTimeout(popTimer);
    popTimer = setTimeout(function () { if (popEl) popEl.hidden = true; }, 900);
  }

  function poke(kind) {
    if (!document.querySelector('.u5step')) return;
    const now = Date.now();
    if (kind === lastKind && now - lastAt < 450) return;
    lastKind = kind;
    lastAt = now;
    if (kind === 'yes') { row += 1; if (row > best) best = row; }
    else row = 0;
    paintStreak();
    showPop(kind);
  }

  function onEffect(src) {
    if (/sfx_ding|sfx_yum|sfx_yuck/.test(src)) poke('yes');
    else if (/sfx_try/.test(src)) poke('again');
  }

  const origPlay = IR.Snd.play.bind(IR.Snd);
  IR.Snd.play = function (src, opts) {
    if (isEffect(src)) {
      onEffect(src);
      if (muted()) return Promise.resolve(true);
    }
    return origPlay(src, opts);
  };

  function muteButton() {
    const b = h('button', { class: 'sfxmute' + (muted() ? ' off' : ''), type: 'button' });
    const draw = () => {
      b.classList.toggle('off', muted());
      b.setAttribute('aria-pressed', muted() ? 'true' : 'false');
      b.setAttribute('aria-label', muted() ? 'Sound effects off. Tap to turn them on.' : 'Sound effects on. Tap to turn them off.');
      b.innerHTML = '';
      b.append(icon('speaker'));
    };
    b.addEventListener('click', () => {
      const s = IR.S();
      s.settings.sfxMute = !muted();
      IR.save();
      draw();
    });
    draw();
    return b;
  }

  function faces() {
    return h('div', { class: 'badgefaces' },
      h('img', { src: ZIP, alt: '' }),
      h('img', { src: FRILL, alt: '' }));
  }

  IR.engage = {
    ZIP: ZIP,
    FRILL: FRILL,
    faces: faces,
    best: function () { return best; },
    row: function () { return row; },
    mount: function (ctx, screen) {
      row = 0;
      best = 0;
      lastKind = '';
      streakEl = h('span', { class: 'streakline', 'aria-live': 'polite' }, 'In a row: 0');
      popEl = h('div', { class: 'reactpop', hidden: true }, h('img', { src: ZIP, alt: '' }), h('b', null, 'Yes'));
      const top = screen.querySelector('.lesson-top');
      const bar = screen.querySelector('.pbar');
      if (bar) bar.after(streakEl, muteButton());
      else if (top) top.append(streakEl, muteButton());
      screen.append(popEl);
      const prevMiss = ctx.miss.bind(ctx);
      ctx.miss = function () { prevMiss(); poke('again'); };
      const prevProg = ctx.progress.bind(ctx);
      ctx.progress = function (f) {
        const n = Math.max(0, Math.min(1, Number(f) || 0));
        prevProg(n);
        const fill = screen.querySelector('.pbar i');
        if (fill) fill.style.width = Math.round(n * 100) + '%';
      };
    },
    endScreen: function (o) {
      o = o || {};
      const stars = o.stars || 0;
      return h('div', { class: 'complete calmend' }, h('div', { class: 'cbox' },
        faces(),
        h('div', { class: 'badgeart', html: IR.ICON.badge }),
        h('h1', null, 'Great job!'),
        h('p', { class: 'lead' }, o.title || ''),
        h('p', { class: 'streakend' }, 'In a row: ' + best),
        stars ? h('p', { class: 'starline' }, stars + (stars === 1 ? ' star' : ' stars')) : null,
        h('div', { class: 'row endrow' },
          o.onlyNext ? null : h('button', { class: 'menulink', type: 'button', onclick: o.onBack }, o.backLabel || 'Back to lesson menu'),
          h('button', { class: 'btn big primary' + (o.orange ? ' daynext' : ''), type: 'button', onclick: o.onNext }, o.onlyNext ? 'Next' : (o.nextLabel || 'Continue'), icon('next')))));
    }
  };

  /* One lesson menu: same card for every step, a bar instead of dots, clear order. */
  IR.lessonMenu = function (o) {
    o = o || {};
    const items = o.items || [];
    const done = items.filter(function (it) { return it.done; }).length;
    const total = items.length || 1;
    const bar = h('div', { class: 'gamebar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': done },
      h('i', { style: 'width:' + Math.round(done / total * 100) + '%' }));
    const card = function (it) {
      const kids = [
        h('span', { class: 'u5ord' }, String(it.n)),
        h('span', { class: 'u5name' }, it.title),
        it.min ? h('span', { class: 'u5min' }, it.min + ' min') : null,
        it.done ? h('span', { class: 'u5mark', 'aria-hidden': 'true' }, icon('check')) : null
      ];
      return h('li', null, h('button', {
        class: 'u5card' + (it.done ? ' done' : '') + (it.next ? ' on' : ''),
        type: 'button',
        'aria-label': it.n + '. ' + it.title + (it.done ? '. Done.' : '.'),
        onclick: function () { IR.Snd.stop(); location.hash = it.href; }
      }, ...kids));
    };
    const extra = (o.extras || []).length ? h('section', { class: 'u5extra' },
      h('h2', null, 'Extra'),
      h('ol', { class: 'u5grid' }, ...(o.extras || []).map(card))) : null;
    let review = null;
    if (o.review) {
      const r = o.review;
      review = r.open
        ? h('button', { class: 'u5card u5review', type: 'button', onclick: function () { IR.Snd.stop(); location.hash = r.href; } },
          h('span', { class: 'u5name' }, r.title), h('span', { class: 'u5min' }, r.note || ''))
        : h('div', { class: 'u5card u5review locked' },
          h('span', { class: 'u5name' }, r.title), h('span', { class: 'u5min' }, r.note || ''));
    }
    return h('main', { class: 'u5main' },
      h('div', { class: 'u5teachrow' }, h('button', { class: 'btn teachgo', type: 'button', onclick: function () { if (IR.teach) IR.teach.toggle(true); } }, 'Teacher mode')),
      h('div', { class: 'u5prog' }, bar, h('span', { class: 'u5count' }, done + ' of ' + items.length)),
      h('ol', { class: 'u5grid' }, ...items.map(card)),
      extra,
      review);
  };
})();
