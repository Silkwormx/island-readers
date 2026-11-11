/* Feed Zip: listen, then choose the word on a snack card. Shared by ng, nk, Unit 5, and Unit 6.
   Built for a classroom smartboard: big cards, big numbers, a tummy that fills. No timers, no lost lives. */
(function () {
  'use strict';
  const IR = window.IR;
  const { h, sleep, shuffle, icon, Snd, A } = IR;
  const LINE = 'Listen. Feed Zip the word you hear.';
  const BITES = 8;
  const COLORS = ['leaf', 'berry', 'bug', 'nut'];
  const YUMS = ['audio/sfx_yum1.mp3', 'audio/sfx_yum2.mp3', 'audio/sfx_yum3.mp3', 'audio/sfx_yum4.mp3', 'audio/sfx_yum5.mp3'];
  const TREATS = ['img/fz_cupcake.webp', 'img/fz_candy.webp', 'img/fz_pizza.webp', 'img/fz_icecream.webp', 'img/fz_cookie.webp'];
  const GROSS = ['img/fz_sock.webp', 'img/fz_fish.webp'];
  let lastYum = '';
  let lastGross = false;
  function nextYum() {
    let pick = YUMS[Math.floor(Math.random() * YUMS.length)];
    if (pick === lastYum) pick = YUMS[(YUMS.indexOf(pick) + 1) % YUMS.length];
    lastYum = pick;
    return pick;
  }
  function nextTreat() {
    let force = '';
    try { force = sessionStorage.getItem('ir_feed_force') || ''; } catch (e) { /* */ }
    const gross = force === 'yuck' ? true : force === 'yum' ? false : (!lastGross && Math.random() < (1 / 7));
    lastGross = gross;
    const set = gross ? GROSS : TREATS;
    const src = set[Math.floor(Math.random() * set.length)];
    return { src: src, yuck: gross };
  }

  IR.runFeedZip = function (ctx, opts) {
    const pool = (opts.words || []).filter(Boolean);
    const say = opts.say || ((w) => IR.sayWord && IR.sayWord(w));
    const colorWord = opts.colorWord || ((w) => document.createTextNode(w));
    const stage = ctx.stage;
    const targets = [];
    for (let i = 0; i < BITES; i++) targets.push(pool[i % Math.max(1, pool.length)]);
    shuffle(targets);
    let r = 0;
    let row = 0;
    let token = 0;
    ctx.setInstr(LINE, opts.promptKey || null);
    const rule = opts.promptAudio || 'audio/p_feed_rule.mp3';

    function others(w) {
      const rest = shuffle(pool.filter((x) => x !== w));
      const pick = rest.slice(0, 3);
      let guard = 0;
      while (pick.length < 2 && pool.length > 1 && guard < 6) {
        const x = pool[guard % pool.length];
        if (x !== w && pick.indexOf(x) < 0) pick.push(x);
        guard++;
      }
      return pick;
    }

    function tummy() {
      const bits = [];
      for (let i = 0; i < BITES; i++) bits.push(h('i', { class: i < r ? 'full' : '' }));
      return h('div', { class: 'fz-tummy', 'aria-label': r + ' of ' + BITES + ' bites' }, h('span', null, "Zip's tummy"), h('span', { class: 'fz-bites' }, ...bits), h('b', null, r + ' / ' + BITES));
    }

    function round() {
      if (!pool.length) { ctx.finish(); return; }
      if (r >= BITES) { ctx.progress(1); ctx.finish(); return; }
      const my = ++token;
      const w = targets[r];
      ctx.progress(r / BITES);
      if (ctx.count) ctx.count(r + 1, BITES);
      stage.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const zip = h('div', { class: 'fz-zip', 'aria-hidden': 'true' },
        h('img', { class: 'fz-zipimg', src: 'img/zipA.webp', alt: '' }),
        h('span', { class: 'fz-mouth' }, ''));
      const replay = h('button', { class: 'btn big primary fz-replay', type: 'button', onclick: () => say(w) }, icon('replay'), 'Hear the word');
      const field = h('div', { class: 'fz-field' });
      const streak = h('p', { class: 'fz-streak' }, 'In a row: ' + row);
      shuffle([w].concat(others(w))).forEach((choice, i) => {
        const kind = COLORS[i % COLORS.length];
        const b = h('button', { class: 'fz-bubble fz-snack ' + kind, type: 'button', 'data-w': choice, 'aria-label': 'Choice ' + (i + 1) + ', ' + choice },
          h('span', { class: 'fz-w' }, colorWord(choice)));
        b.addEventListener('pointerup', () => choose(choice, b));
        b.addEventListener('click', () => choose(choice, b));
        field.append(b);
      });
      stage.append(h('div', { class: 'activity feedzip' },
        h('div', { class: 'fz-top' }, zip, h('div', { class: 'fz-side' }, tummy(), replay, streak)),
        field, status));
      const myBite = my;
      (async () => {
        if (!ctx._saidInstr) ctx._saidInstr = Object.create(null);
        if (rule && !ctx._saidInstr[rule]) {
          ctx._saidInstr[rule] = 1;
          await Snd.play(rule);
          if (!ctx.scr.ok() || myBite !== token) return;
          await sleep(180);
        }
        if (ctx.scr.ok() && myBite === token) say(w);
      })();

      async function choose(choice, b) {
        if (locked || my !== token || b.classList.contains('tried') || b.dataset.hit === '1') return;
        b.dataset.hit = '1';
        if (choice === w) {
          locked = true;
          row++;
          b.classList.add('right', 'feeding');
          zip.classList.add('yum');
          const treat = nextTreat();
          status.textContent = treat.yuck ? 'Yuck!' : 'Yum! Zip munched ' + w + '.';
          streak.textContent = 'In a row: ' + row;
          const dots = document.querySelectorAll('.fz-bites i');
          if (dots[r]) dots[r].classList.add('full');
          const count = document.querySelector('.fz-tummy b');
          if (count) count.textContent = (r + 1) + ' / ' + BITES;
          $$fade();
          const pop = h('img', { class: 'fz-treat' + (treat.yuck ? ' yuck' : ''), src: treat.src, alt: treat.yuck ? 'A silly snack Zip does not like' : 'A treat for Zip' });
          zip.append(pop);
          await Snd.play(treat.yuck ? 'audio/sfx_yuck.mp3' : nextYum());
          if (!ctx.scr.ok() || my !== token) return;
          r++;
          ctx.progress(r / BITES);
          await sleep(700);
          if (ctx.scr.ok() && my === token) round();
        } else {
          b.classList.add('tried');
          row = 0;
          streak.textContent = 'In a row: 0';
          status.textContent = "Zip isn't hungry for that one, listen again.";
          if (ctx.miss) ctx.miss();
          await Snd.play(A.sfx.tryagain);
          if (ctx.scr.ok() && my === token) say(w);
        }
      }
      function $$fade() {
        [...field.children].forEach((el) => { if (!el.classList.contains('right')) el.classList.add('fade'); });
      }
    }

    ctx.setBack(() => { if (r > 0) { token++; r--; if (row > 0) row--; round(); return true; } return false; });
    ctx.setNext(() => { if (r < BITES - 1) { token++; r++; round(); return true; } return false; });
    round();
  };
})();
