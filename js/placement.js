/* Placement check (#/placement): a grown-up sits with the reader, the reader reads each word aloud, the grown-up taps right or not yet.
   Groups follow the app's unit order. 5 words per group (3 real, 2 made-up). Pass = 4 of 5. Stops at the first group with 3 or fewer.
   Only the starting bell number is saved on this device (localStorage 'ir_start_bell'). Nothing is recorded, sent, or analysed. No microphone. */
(function () {
  'use strict';
  const IR = window.IR; const { h, icon, Snd } = IR;
  const KEY = 'ir_start_bell';
  const SKILL = { 1: 'blends', 2: 'sh ch th', 3: 'ng nk', 4: 'silent e', 5: 'long words', 6: 'bossy r', 7: 'vowel teams', 8: 'oi ow aw', 9: 'word parts', 10: 'tch dge igh' };
  /* [word, madeUp?] Each group uses only its pattern plus earlier ones. */
  const GROUPS = [
    { n: 0, name: 'short vowels', words: [['map'], ['sit'], ['hug'], ['jop', 1], ['ved', 1]] },
    { n: 1, name: SKILL[1], words: [['stop'], ['frog'], ['plum'], ['blim', 1], ['snad', 1]] },
    { n: 2, name: SKILL[2], words: [['shop'], ['chin'], ['math'], ['thib', 1], ['shem', 1]] },
    { n: 3, name: SKILL[3], words: [['ring'], ['sunk'], ['long'], ['pank', 1], ['drung', 1]] },
    { n: 4, name: SKILL[4], words: [['cake'], ['bike'], ['hope'], ['tume', 1], ['plade', 1]] },
    { n: 5, name: SKILL[5], words: [['sunset'], ['napkin'], ['picnic'], ['tamfud', 1], ['plinbet', 1]] },
    { n: 6, name: SKILL[6], words: [['park'], ['fork'], ['bird'], ['hurd', 1], ['zarm', 1]] },
    { n: 7, name: SKILL[7], words: [['rain'], ['feet'], ['boat'], ['keam', 1], ['sloat', 1]] },
    { n: 8, name: SKILL[8], words: [['coin'], ['cow'], ['saw'], ['moil', 1], ['plawn', 1]] },
    { n: 9, name: SKILL[9], words: [['jumping'], ['unlock'], ['rested'], ['rinting', 1], ['unflop', 1]] },
    { n: 10, name: SKILL[10], words: [['catch'], ['bridge'], ['night'], ['plidge', 1], ['zight', 1]] },
  ];
  const KID_LINE = 'Read each word out loud. Some are made-up words, so just sound them out. Try your best!';
  function speakBtn(text) {
    const b = h('button', { class: 'speaker zfread', type: 'button', 'aria-label': 'Read aloud', 'aria-pressed': 'false' }, icon('speaker'));
    let on = false;
    const set = (v) => { on = v; b.classList.toggle('playing', v); b.setAttribute('aria-pressed', String(v)); b.textContent = ''; b.append(icon(v ? 'pause' : 'speaker')); };
    b.addEventListener('click', () => {
      if (on) { try { speechSynthesis.cancel(); } catch (e) {} set(false); return; }
      try { Snd.stop(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.9; u.onend = u.onerror = () => set(false); speechSynthesis.cancel(); speechSynthesis.speak(u); set(true); } catch (e) { set(false); }
    });
    return b;
  }
  const stopSpeech = () => { try { speechSynthesis.cancel(); } catch (e) {} };
  const list = (arr) => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  const saved = () => { try { const v = parseInt(localStorage.getItem(KEY), 10); return v >= 1 && v <= 10 ? v : null; } catch (e) { return null; } };

  function render(app, openUnit) {
    IR.newScreen(); stopSpeech();
    const wrap = h('div', { class: 'mwrap plc' });
    const home = () => { stopSpeech(); location.hash = '#/home'; };
    const top = h('div', { class: 'gtop' }, h('button', { class: 'back homebtn', type: 'button', onclick: home }, icon('home'), h('span', null, 'Home')));
    app.append(h('div', { class: 'screen home placement' }, wrap));
    const show = (...kids) => { wrap.innerHTML = ''; wrap.append(top, ...kids.filter((k) => k != null && k !== false)); try { window.scrollTo(0, 0); } catch (e) {} };

    function intro() {
      const prev = saved();
      show(h('h1', null, 'Find your first bell'),
        h('div', { class: 'plc-card' },
          h('p', { class: 'plc-adult' }, h('b', null, 'For the grown-up: '), 'Sit with your reader. They read each word out loud. Tap \u2713 if read right, \u2717 if not. About 5 minutes.'),
          h('p', { class: 'plc-small' }, 'Some words are made up, to check sounding out, not memory. The check stops on its own when a group gets tricky. Only the starting bell is saved, on this device. Nothing is recorded or sent.')),
        h('div', { class: 'plc-card plc-kid' }, h('div', { class: 'zfpics' }, h('img', { src: 'img/zipA.webp', alt: 'Zip' }), h('img', { src: 'img/frill.webp', alt: 'Frill' })), h('p', { class: 'plc-kidline' }, KID_LINE), speakBtn(KID_LINE)),
        h('div', { class: 'plc-actions' }, h('button', { class: 'btn big primary plc-go', type: 'button', onclick: () => run() }, h('span', { 'aria-hidden': 'true' }, '\u{1F514}'), h('span', null, 'Start the sound check')),
          prev ? h('button', { class: 'btn big', type: 'button', onclick: () => result(prev, null) }, 'See last result: Unit ' + prev) : null));
    }

    function run() {
      stopSpeech();
      let g = 0, i = 0, right = 0, wrong = 0; const passed = [];
      const next = () => {
        const G = GROUPS[g];
        if (i === 5 || wrong >= 2) {
          if (right >= 4) { passed.push(G); g++; i = 0; right = 0; wrong = 0; if (g === GROUPS.length) return result(10, passed, true); }
          else return result(Math.max(G.n, 1), passed, false, G.n === 0);
        }
        const H = GROUPS[g]; const [w, made] = H.words[i];
        const mark = (ok) => { if (ok) right++; else wrong++; i++; next(); };
        show(h('p', { class: 'plc-prog' }, (H.n === 0 ? 'Warm-up: ' + H.name : 'Bell ' + H.n + ': ' + H.name) + ' \u00b7 word ' + (i + 1) + ' of 5'),
          h('div', { class: 'plc-dots', 'aria-hidden': 'true' }, ...GROUPS.map((x, k) => h('span', { class: k < g ? 'on' : k === g ? 'cur' : '' }))),
          h('div', { class: 'plc-word', lang: 'en' }, w),
          h('p', { class: 'plc-small plc-made' }, made ? 'Made-up word: check the sounds, not the meaning.' : '\u00a0'),
          h('div', { class: 'plc-marks' },
            h('button', { class: 'btn big plc-no', type: 'button', 'aria-label': 'Not yet: ' + w, onclick: () => mark(false) }, h('span', { 'aria-hidden': 'true' }, '\u2717'), h('span', null, 'Not yet')),
            h('button', { class: 'btn big primary plc-yes', type: 'button', 'aria-label': 'Read right: ' + w, onclick: () => mark(true) }, h('span', { 'aria-hidden': 'true' }, '\u2713'), h('span', null, 'Read right'))));
      };
      next();
    }

    function result(start, passed, all, cvc) {
      try { localStorage.setItem(KEY, String(start)); } catch (e) { /* storage blocked */ }
      let summary = '';
      if (passed) {
        const known = passed.map((x) => x.name);
        summary = cvc ? 'Short vowel words need more practice first. Start with short-vowel review, then Unit 1 blends.'
          : all ? 'Read every group. Start at Unit 10 tch dge igh to review, or pick any bell.'
          : (known.length ? 'Knows ' + list(known) + '. ' : '') + 'Start at ' + SKILL[start] + '.';
      }
      const bells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
        const st = n < start ? 'rung' : n === start ? 'start' : 'later';
        return h('div', { class: 'plc-bell pb-' + st, 'aria-label': 'Unit ' + n + ', ' + SKILL[n] + (st === 'rung' ? ', rung' : st === 'start' ? ', start here' : '') },
          h('span', { class: 'gpic' }, h('img', { src: 'img/units/unit' + String(n).padStart(2, '0') + '.webp', alt: '' }), h('span', { class: 'gunit' }, 'Unit ' + n),
            st === 'start' ? h('span', { class: 'plc-here' }, h('img', { src: 'img/zipA.webp', alt: '' }), h('img', { src: 'img/frill.webp', alt: '' }), h('b', null, 'Start here!')) : null,
            st === 'rung' ? h('span', { class: 'plc-rung' }, '\u2713 rung') : null),
          h('span', { class: 'plc-bname' }, SKILL[n]));
      });
      show(h('h1', null, cvc ? 'Let\u2019s warm up first' : 'Your first bell'),
        summary ? h('p', { class: 'plc-summary' }, h('b', null, 'For the grown-up: '), summary) : null,
        cvc ? h('p', { class: 'plc-small' }, 'Island Readers starts with blends, so it expects short vowel words like map and hug to be easy. A short-vowel review is not built into the app yet. Practise reading short words together, then start Unit 1 and retake this check.') : null,
        h('div', { class: 'plc-map' }, ...bells),
        h('div', { class: 'plc-actions' },
          h('button', { class: 'btn big primary', type: 'button', onclick: () => { stopSpeech(); openUnit(start); } }, h('span', { 'aria-hidden': 'true' }, '\u{1F514}'), h('span', null, cvc ? 'Go to Unit 1' : 'Go to this bell')),
          h('button', { class: 'btn big', type: 'button', onclick: () => run() }, 'Retake the check')));
    }
    intro();
  }
  IR.placement = { render, GROUPS, saved };
})();
