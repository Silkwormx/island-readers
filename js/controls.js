/* One calm control row for Units 1-3 and 7-9 lesson screens.
   Home, Back, Repeat, and Forward. Other screens do not call this. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, icon } = IR;

  function shortenBack(link) {
    if (!link || link.dataset.irBack) return;
    link.dataset.irBack = '1';
    link.classList.add('ir-btn', 'ir-back');
    const full = (link.getAttribute('aria-label') || link.textContent || 'Back').replace(/\s+/g, ' ').trim();
    link.setAttribute('aria-label', full || 'Back');
    if (full.length > 5) {
      link.textContent = '';
      link.append(icon('back'), document.createTextNode('Back'));
    }
  }

  function order(nav) {
    const want = ['.homebtn:not(.pageback)', '.menulink', '.storyback', '.pageback', '.ir-repeat', '.btn.next']
      .map((sel) => nav.querySelector(sel)).filter(Boolean);
    const have = [...nav.children].filter((el) => want.indexOf(el) >= 0);
    if (want.length === have.length && want.every((el, i) => el === have[i])) return;
    want.forEach((el) => nav.append(el));
  }

  function stripStoryExtras(screen) {
    screen.querySelectorAll('.activity.story button').forEach((b) => {
      const label = (b.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^next page$/i.test(label)) b.remove();
    });
    screen.querySelectorAll('.activity.story .row').forEach((row) => {
      if (!row.querySelector('button') && !(row.textContent || '').trim()) row.remove();
    });
    screen.querySelectorAll('.sfxmute').forEach((el) => el.remove());
  }

  IR.wireUnitControls = function (screen, ctx) {
    if (!screen || !ctx) return;
    const nav = screen.querySelector('.lesson-nav');
    if (!nav || nav.dataset.irWired) return;
    nav.dataset.irWired = '1';
    nav.classList.add('ir-controls');
    const page = screen.querySelector('.lesson-top .pagenav');
    const home = page && page.querySelector('.homebtn:not(.pageback)');
    if (home) nav.insertBefore(home, nav.firstChild);
    if (page) page.classList.add('ir-nav-folded');
    shortenBack(nav.querySelector('.menulink'));
    nav.querySelectorAll('.homebtn, .storyback, .btn.next').forEach((b) => b.classList.add('ir-btn'));
    const repeat = h('button', {
      class: 'btn big ir-btn ir-repeat',
      type: 'button',
      hidden: true,
      'aria-label': 'Repeat'
    }, icon('replay'), 'Repeat');
    const next = nav.querySelector('.btn.next');
    if (next) nav.insertBefore(repeat, next);
    else nav.append(repeat);
    ctx.setRepeat = function (fn) {
      if (typeof fn !== 'function') {
        repeat.hidden = true;
        repeat.onclick = null;
        return;
      }
      repeat.hidden = false;
      repeat.onclick = function () { IR.Snd.stop(); fn(); };
    };
    let busy = false;
    const tidy = () => {
      if (busy) return;
      busy = true;
      try {
        shortenBack(nav.querySelector('.menulink'));
        nav.querySelectorAll('.homebtn, .storyback, .btn.next, .ir-repeat').forEach((b) => b.classList.add('ir-btn'));
        order(nav);
        stripStoryExtras(screen);
      } finally { busy = false; }
    };
    tidy();
    const stage = screen.querySelector('.stage');
    if (stage && window.MutationObserver) {
      const mo = new MutationObserver(() => tidy());
      mo.observe(stage, { childList: true, subtree: true });
      mo.observe(nav, { childList: true });
    }
  };
})();
