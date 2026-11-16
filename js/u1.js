/* Unit 1 Short Vowels and Floss. Four lessons in UFLI order:
   1.1 short a (UFLI 1-11), 1.2 short i and o (UFLI 8-14),
   1.3 short u and e (UFLI 15-19, plus the single consonants that finish the set),
   1.4 floss ff ll ss zz (the FLSZ rule).
   Words use only sounds and heart words taught by that lesson. No blends, no ck, no digraphs. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, shuffle, icon, Snd, A, speakerBtn, sleep } = IR;
  const PICS = {
    mat: '<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="18" y="28" width="84" height="36" rx="6" fill="#D98A5B" stroke="#2B2540" stroke-width="3"/><rect x="28" y="36" width="64" height="6" fill="#F3D2A8"/><rect x="28" y="48" width="64" height="6" fill="#F3D2A8"/></svg>',
    map: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M20 18 h50 l10 8 v36 l-10 8 H20 z" fill="#F6E7B2" stroke="#2B2540" stroke-width="3"/><path d="M40 30 h20 M40 42 h28 M40 54 h16" stroke="#C45A3A" stroke-width="3"/></svg>',
    man: '<svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="24" r="12" fill="#F0C9A0" stroke="#2B2540" stroke-width="3"/><path d="M40 70 V46 h40 v24" fill="#3D7EA6" stroke="#2B2540" stroke-width="3"/></svg>',
    cat: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M30 40 L40 18 L52 36 L68 36 L80 18 L90 40 V62 H30 z" fill="#E8A15A" stroke="#2B2540" stroke-width="3"/><circle cx="50" cy="48" r="2" fill="#2B2540"/><circle cx="70" cy="48" r="2" fill="#2B2540"/></svg>',
    mop: '<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="56" y="10" width="8" height="40" fill="#C4A574" stroke="#2B2540" stroke-width="3"/><path d="M36 50 h48 l-6 18 H42 z" fill="#6E8B74" stroke="#2B2540" stroke-width="3"/></svg>',
    cap: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M28 46 h64 v8 H28 z" fill="#E25B4A" stroke="#2B2540" stroke-width="3"/><path d="M36 46 Q60 18 84 46" fill="#F07A66" stroke="#2B2540" stroke-width="3"/></svg>',
    pig: '<svg viewBox="0 0 120 80" aria-hidden="true"><ellipse cx="62" cy="44" rx="34" ry="22" fill="#F4A7C4" stroke="#2B2540" stroke-width="3"/><ellipse cx="90" cy="48" rx="8" ry="6" fill="#F7C2D6" stroke="#2B2540" stroke-width="3"/><circle cx="50" cy="40" r="2" fill="#2B2540"/></svg>',
    cup: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M34 24 h40 v28 a16 16 0 0 1-32 0 z" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/><path d="M74 32 h10 a10 10 0 0 1 0 20 H74" fill="none" stroke="#2B2540" stroke-width="3"/></svg>',
    bed: '<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="22" y="40" width="76" height="22" rx="4" fill="#7E9CC6" stroke="#2B2540" stroke-width="3"/><rect x="28" y="28" width="22" height="14" rx="3" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/></svg>',
    sun: '<svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="42" r="16" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><path d="M60 14 v10 M60 60 v10 M32 42 h10 M78 42 h10 M40 22 l7 7 M73 55 l7 7 M80 22 l-7 7 M47 55 l-7 7" stroke="#E0A106" stroke-width="3"/></svg>',
    hill: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M10 64 Q40 20 70 64 Q90 40 112 64 V74 H10 z" fill="#7DAA6A" stroke="#2B2540" stroke-width="3"/></svg>',
    bell: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M60 16 v8" stroke="#2B2540" stroke-width="3"/><path d="M40 58 Q40 28 60 28 Q80 28 80 58 z" fill="#F28C00" stroke="#2B2540" stroke-width="3"/><circle cx="60" cy="62" r="4" fill="#C95A10" stroke="#2B2540" stroke-width="2"/></svg>',
    doll: '<svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="24" r="12" fill="#F0C9A0" stroke="#2B2540" stroke-width="3"/><path d="M44 70 V42 h32 v28" fill="#C2408A" stroke="#2B2540" stroke-width="3"/></svg>'
  };

  function clip(w) { return 'audio/w_' + String(w).toLowerCase().replace(/[^a-z]/g, '') + '.mp3'; }
  function say(w) { return Snd.play(clip(w)); }
  function ding(w) { return Snd.seq(w ? [A.sfx.ding, clip(w)] : [A.sfx.ding], 90); }
  function again(w) { return Snd.seq(w ? [A.sfx.tryagain, clip(w)] : [A.sfx.tryagain], 140); }
  function teach() { return document.body.classList.contains('teach'); }

  function showWord(w, vowels) {
    const set = vowels || 'aeiou';
    return h('span', null, ...String(w).split('').map((ch) => {
      const low = ch.toLowerCase();
      return h('span', { class: set.indexOf(low) >= 0 ? 'chunk' : '' }, ch);
    }));
  }

  const LESSONS = [
    {
      id: 'u11', n: '1.1', name: 'Short a',
      blurb: 'UFLI lessons 1 to 11. Short a, then m, s, t, p, f, and n.',
      vowels: 'a',
      pattern: 'a',
      meet: 'Short a says /a/, as in mat. The letters are a, m, s, t, p, f, and n.',
      chips: ['mat', 'map', 'man', 'sat', 'fan'],
      heart: ['I'],
      words: ['am', 'at', 'mat', 'sat', 'map', 'tap', 'pat', 'pan', 'nap', 'fan', 'fat', 'man', 'sam'],
      pics: { mat: 'mat', map: 'map', man: 'man' },
      build: [
        { word: 'mat', onset: 'm', chunk: 'at', altOnset: 's', altChunk: 'ap' },
        { word: 'map', onset: 'm', chunk: 'ap', altOnset: 't', altChunk: 'an' },
        { word: 'pan', onset: 'p', chunk: 'an', altOnset: 'f', altChunk: 'at' },
        { word: 'fan', onset: 'f', chunk: 'an', altOnset: 's', altChunk: 'ap' }
      ],
      chain: ['mat', 'map', 'man', 'pan', 'pat', 'sat'],
      scramble: ['mat', 'map', 'fan', 'tap', 'pan'],
      sentences: [
        { text: 'I am Sam.', words: ['I', 'am', 'Sam.'] },
        { text: 'Sam sat.', words: ['Sam', 'sat.'] },
        { text: 'I tap Mat.', words: ['I', 'tap', 'Mat.'] }
      ],
      story: [
        { text: 'I am Sam.', words: ['I', 'am', 'Sam.'] },
        { text: 'Sam sat.', words: ['Sam', 'sat.'] },
        { text: 'I fan Sam.', words: ['I', 'fan', 'Sam.'] },
        { text: 'Mat sat.', words: ['Mat', 'sat.'] }
      ],
      bins: [{ id: 'a', label: 'Short a' }, { id: 'x', label: 'Not a' }],
      sort: [
        { word: 'mat', bin: 'a' }, { word: 'fan', bin: 'a' }, { word: 'map', bin: 'a' },
        { word: 'sat', bin: 'a' }, { word: 'pan', bin: 'a' }, { word: 'tap', bin: 'a' },
        { word: 'nap', bin: 'a' }, { word: 'pat', bin: 'a' }
      ],
      which: [
        { word: 'mat', vowel: 'a' }, { word: 'fan', vowel: 'a' }, { word: 'map', vowel: 'a' },
        { word: 'sat', vowel: 'a' }, { word: 'pan', vowel: 'a' }, { word: 'tap', vowel: 'a' }
      ],
      vowelChoices: ['a', 'm', 't'],
      check: [
        { word: 'mat', choices: ['mat', 'tam', 'atm'] },
        { word: 'map', choices: ['map', 'pam', 'amp'] },
        { word: 'fan', choices: ['fan', 'naf', 'anf'] },
        { word: 'sat', choices: ['sat', 'tas', 'ast'] },
        { word: 'pan', choices: ['pan', 'nap', 'apn'] },
        { word: 'man', choices: ['man', 'nam', 'amn'] }
      ]
    },
    {
      id: 'u12', n: '1.2', name: 'Short i and o',
      blurb: 'UFLI lessons 8 to 14. Short i, short o, then d and c.',
      vowels: 'aio',
      pattern: 'i o',
      meet: 'Short i says /i/, as in sit. Short o says /o/, as in mop. New letters: i, o, d, and c.',
      chips: ['sit', 'pin', 'mop', 'pot', 'cat'],
      heart: ['the'],
      words: ['sit', 'sip', 'pin', 'fin', 'pit', 'tip', 'did', 'dot', 'pot', 'mop', 'cop', 'cat', 'cap', 'cot', 'mad', 'sad', 'dad', 'mat', 'map'],
      pics: { cat: 'cat', mop: 'mop', cap: 'cap' },
      build: [
        { word: 'sit', onset: 's', chunk: 'it', altOnset: 'p', altChunk: 'at' },
        { word: 'mop', onset: 'm', chunk: 'op', altOnset: 'c', altChunk: 'ap' },
        { word: 'cat', onset: 'c', chunk: 'at', altOnset: 'h', altChunk: 'ot' },
        { word: 'pot', onset: 'p', chunk: 'ot', altOnset: 'd', altChunk: 'at' }
      ],
      chain: ['sit', 'sip', 'tip', 'tap', 'map', 'mop', 'cop', 'cap'],
      scramble: ['sit', 'mop', 'cat', 'pot', 'pin', 'dad'],
      sentences: [
        { text: 'The cat sat.', words: ['The', 'cat', 'sat.'] },
        { text: 'I mop the mat.', words: ['I', 'mop', 'the', 'mat.'] },
        { text: 'The man sat.', words: ['The', 'man', 'sat.'] }
      ],
      story: [
        { text: 'The cat sat on the mat.', words: ['The', 'cat', 'sat', 'on', 'the', 'mat.'] },
        { text: 'Sam did sit.', words: ['Sam', 'did', 'sit.'] },
        { text: 'Dad sat on the cot.', words: ['Dad', 'sat', 'on', 'the', 'cot.'] }
      ],
      bins: [{ id: 'a', label: 'a' }, { id: 'i', label: 'i' }, { id: 'o', label: 'o' }],
      sort: [
        { word: 'mat', bin: 'a' }, { word: 'sit', bin: 'i' }, { word: 'mop', bin: 'o' },
        { word: 'cat', bin: 'a' }, { word: 'pin', bin: 'i' }, { word: 'pot', bin: 'o' },
        { word: 'cap', bin: 'a' }, { word: 'fin', bin: 'i' }, { word: 'pot', bin: 'o' }
      ],
      which: [
        { word: 'sit', vowel: 'i' }, { word: 'mop', vowel: 'o' }, { word: 'cat', vowel: 'a' },
        { word: 'pin', vowel: 'i' }, { word: 'pot', vowel: 'o' }, { word: 'map', vowel: 'a' }
      ],
      vowelChoices: ['a', 'i', 'o'],
      check: [
        { word: 'sit', choices: ['sit', 'sat', 'sot'] },
        { word: 'mop', choices: ['mop', 'map', 'mip'] },
        { word: 'cat', choices: ['cat', 'cot', 'cit'] },
        { word: 'pot', choices: ['pot', 'pat', 'pit'] },
        { word: 'pin', choices: ['pin', 'pan', 'pon'] },
        { word: 'cap', choices: ['cap', 'cop', 'cat'] }
      ]
    },
    {
      id: 'u13', n: '1.3', name: 'Short u and e',
      blurb: 'UFLI lessons 15 to 19, then the rest of the single consonants. Still no blends.',
      vowels: 'aeiou',
      pattern: 'u e',
      meet: 'Short u says /u/, as in cup. Short e says /e/, as in bed. New letters include u, e, g, b, h, r, l, and w.',
      chips: ['cup', 'bug', 'bed', 'pen', 'sun'],
      heart: ['a', 'to'],
      words: ['cup', 'pup', 'bug', 'hug', 'bus', 'sun', 'run', 'gum', 'bud', 'rub', 'tub', 'bed', 'red', 'pet', 'hen', 'leg', 'web', 'pen', 'ten', 'men', 'bet', 'get', 'met', 'hat', 'hit', 'log', 'let', 'set', 'wet', 'ham', 'fig', 'rip', 'big', 'can', 'not', 'got', 'him', 'had', 'if', 'us', 'but', 'rug'],
      pics: { pig: 'pig', cup: 'cup', bed: 'bed', sun: 'sun' },
      build: [
        { word: 'cup', onset: 'c', chunk: 'up', altOnset: 'p', altChunk: 'ap' },
        { word: 'bed', onset: 'b', chunk: 'ed', altOnset: 'r', altChunk: 'ug' },
        { word: 'sun', onset: 's', chunk: 'un', altOnset: 'r', altChunk: 'en' },
        { word: 'hug', onset: 'h', chunk: 'ug', altOnset: 'b', altChunk: 'ag' }
      ],
      chain: ['bed', 'bet', 'pet', 'pen', 'ten', 'hen'],
      scramble: ['cup', 'bed', 'sun', 'hug', 'pen', 'log', 'wet'],
      sentences: [
        { text: 'A bug sat on the rug.', words: ['A', 'bug', 'sat', 'on', 'the', 'rug.'] },
        { text: 'The hen ran to the pen.', words: ['The', 'hen', 'ran', 'to', 'the', 'pen.'] },
        { text: 'I hug the pup.', words: ['I', 'hug', 'the', 'pup.'] }
      ],
      story: [
        { text: 'A bug sat on the rug.', words: ['A', 'bug', 'sat', 'on', 'the', 'rug.'] },
        { text: 'The hen ran to the pen.', words: ['The', 'hen', 'ran', 'to', 'the', 'pen.'] },
        { text: 'The pup had a nap in the sun.', words: ['The', 'pup', 'had', 'a', 'nap', 'in', 'the', 'sun.'] }
      ],
      bins: [{ id: 'a', label: 'a' }, { id: 'e', label: 'e' }, { id: 'i', label: 'i' }, { id: 'o', label: 'o' }, { id: 'u', label: 'u' }],
      sort: [
        { word: 'hat', bin: 'a' }, { word: 'bed', bin: 'e' }, { word: 'sit', bin: 'i' },
        { word: 'log', bin: 'o' }, { word: 'cup', bin: 'u' }, { word: 'pen', bin: 'e' },
        { word: 'bug', bin: 'u' }, { word: 'pig', bin: 'i' }, { word: 'sun', bin: 'u' },
        { word: 'map', bin: 'a' }
      ],
      which: [
        { word: 'cup', vowel: 'u' }, { word: 'bed', vowel: 'e' }, { word: 'pig', vowel: 'i' },
        { word: 'log', vowel: 'o' }, { word: 'hat', vowel: 'a' }, { word: 'sun', vowel: 'u' },
        { word: 'pen', vowel: 'e' }, { word: 'bug', vowel: 'u' }
      ],
      vowelChoices: ['a', 'e', 'i', 'o', 'u'],
      check: [
        { word: 'cup', choices: ['cup', 'cap', 'cop'] },
        { word: 'bed', choices: ['bed', 'bad', 'bid'] },
        { word: 'sun', choices: ['sun', 'sin', 'san'] },
        { word: 'hug', choices: ['hug', 'hog', 'hag'] },
        { word: 'pen', choices: ['pen', 'pan', 'pin'] },
        { word: 'log', choices: ['log', 'lag', 'leg'] }
      ]
    },
    {
      id: 'u14', n: '1.4', name: 'Floss',
      blurb: 'The FLSZ rule. After a short vowel, double f, l, s, or z.',
      vowels: 'aeiou',
      pattern: 'ff ll ss zz',
      meet: 'At the end of a short word, f, l, s, and z double. Hill. Miss. Puff. Buzz.',
      chips: ['hill', 'miss', 'puff', 'bell', 'buzz'],
      heart: ['of'],
      words: ['off', 'puff', 'buff', 'huff', 'cuff', 'miss', 'mess', 'kiss', 'less', 'fuss', 'hill', 'bell', 'doll', 'fill', 'fell', 'well', 'tell', 'mill', 'moss', 'loss', 'buzz', 'fuzz', 'sell'],
      pics: { hill: 'hill', bell: 'bell', doll: 'doll' },
      build: [
        { word: 'hill', onset: 'h', chunk: 'ill', altOnset: 'f', altChunk: 'ell' },
        { word: 'miss', onset: 'm', chunk: 'iss', altOnset: 'l', altChunk: 'ess' },
        { word: 'puff', onset: 'p', chunk: 'uff', altOnset: 'b', altChunk: 'ell' },
        { word: 'bell', onset: 'b', chunk: 'ell', altOnset: 't', altChunk: 'ill' }
      ],
      chain: ['hill', 'fill', 'fell', 'tell', 'bell'],
      scramble: ['hill', 'miss', 'puff', 'bell', 'doll', 'buzz'],
      sentences: [
        { text: 'The bell sat on the hill.', words: ['The', 'bell', 'sat', 'on', 'the', 'hill.'] },
        { text: 'The doll fell.', words: ['The', 'doll', 'fell.'] },
        { text: 'I miss the cat.', words: ['I', 'miss', 'the', 'cat.'] }
      ],
      story: [
        { text: 'The bell sat on the hill.', words: ['The', 'bell', 'sat', 'on', 'the', 'hill.'] },
        { text: 'A doll fell.', words: ['A', 'doll', 'fell.'] },
        { text: 'Sam will miss the pup.', words: ['Sam', 'will', 'miss', 'the', 'pup.'] }
      ],
      bins: [{ id: 'floss', label: 'Floss' }, { id: 'cvc', label: 'No floss' }],
      sort: [
        { word: 'hill', bin: 'floss' }, { word: 'mat', bin: 'cvc' }, { word: 'miss', bin: 'floss' },
        { word: 'cup', bin: 'cvc' }, { word: 'puff', bin: 'floss' }, { word: 'bed', bin: 'cvc' },
        { word: 'doll', bin: 'floss' }, { word: 'sun', bin: 'cvc' }, { word: 'bell', bin: 'floss' },
        { word: 'log', bin: 'cvc' }, { word: 'off', bin: 'floss' }, { word: 'pen', bin: 'cvc' }
      ],
      which: [
        { word: 'hill', vowel: 'i' }, { word: 'bell', vowel: 'e' }, { word: 'doll', vowel: 'o' },
        { word: 'puff', vowel: 'u' }, { word: 'miss', vowel: 'i' }, { word: 'moss', vowel: 'o' }
      ],
      vowelChoices: ['a', 'e', 'i', 'o', 'u'],
      check: [
        { word: 'hill', choices: ['hill', 'hil', 'hilll'] },
        { word: 'miss', choices: ['miss', 'mis', 'misss'] },
        { word: 'puff', choices: ['puff', 'puf', 'pufff'] },
        { word: 'bell', choices: ['bell', 'bel', 'belll'] },
        { word: 'off', choices: ['off', 'of', 'offf'] },
        { word: 'buzz', choices: ['buzz', 'buz', 'buzzs'] }
      ]
    }
  ];

  /* "will" in lesson 1.4 story is w+i+ll, floss, decodable. Good. */

  function picEl(key) {
    const svg = PICS[key];
    if (!svg) return null;
    return h('span', { class: 'u1pic', html: svg });
  }

  function choiceButton(w, vowels) {
    return h('button', { class: 'choice', type: 'button', 'data-w': w }, showWord(w, vowels));
  }

  function runMeet(ctx, L) {
    ctx.setInstr(L.meet, null);
    const chips = h('div', { class: 'chips' }, ...L.chips.map((w) => h('button', { class: 'chip', type: 'button', onclick: () => say(w) }, showWord(w, L.vowels))));
    const hearts = h('div', { class: 'chips' }, ...L.heart.map((w) => h('button', { class: 'chip', type: 'button', onclick: () => say(w) }, w)));
    ctx.stage.append(h('div', { class: 'activity nkmeet' },
      h('div', { class: 'bubble zip' }, h('b', { class: 'who' }, 'Zip'), h('p', null, L.meet)),
      h('p', { class: 'bigprompt' }, L.pattern),
      chips,
      L.heart.length ? h('p', { class: 'small' }, 'Heart word') : null,
      hearts));
    if (ctx.armReveal) ctx.armReveal(L.chips[0]);
    ctx.setNext(() => false);
    say(L.chips[0]);
  }

  function runHear(ctx, L) {
    const pool = shuffle(L.words.slice());
    const rounds = pool.slice(0, 6).map((word) => ({ word: word, choices: [word].concat(shuffle(pool.filter((w) => w !== word)).slice(0, 2)) }));
    let r = 0;
    function round() {
      if (r >= rounds.length) { ctx.progress(1); ctx.finish(); return; }
      const R = rounds[r];
      ctx.progress(r / rounds.length);
      if (ctx.count) ctx.count(r + 1, rounds.length);
      ctx.stage.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const grid = h('div', { class: 'choices' });
      shuffle(R.choices.slice()).forEach((w) => {
        const b = choiceButton(w, L.vowels);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (w === R.word) {
            locked = true; b.classList.add('right');
            status.textContent = 'Yes! ' + R.word;
            await ding(R.word);
            if (!ctx.scr.ok()) return;
            r++; round();
          } else {
            ctx.miss(); b.classList.add('tried');
            status.textContent = 'Not that one. Listen again.';
            await again(R.word);
          }
        });
        grid.append(b);
      });
      const spk = speakerBtn(() => say(R.word), 'Hear the word');
      spk.classList.add('huge');
      ctx.stage.append(h('div', { class: 'activity' }, spk, grid, status));
      if (ctx.armReveal) ctx.armReveal(R.word);
      say(R.word);
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setInstr('Listen. Tap the word you hear.', null);
    round();
  }

  function runMatch(ctx, L) {
    const keys = Object.keys(L.pics);
    const rounds = shuffle(keys.slice());
    let r = 0;
    const bank = L.words.slice();
    function round() {
      if (r >= rounds.length) { ctx.progress(1); ctx.finish(); return; }
      const word = rounds[r];
      ctx.progress(r / rounds.length);
      if (ctx.count) ctx.count(r + 1, rounds.length);
      ctx.stage.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const dist = shuffle(bank.filter((w) => w !== word)).slice(0, 2);
      const grid = h('div', { class: 'choices' });
      shuffle([word].concat(dist)).forEach((w) => {
        const b = choiceButton(w, L.vowels);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (w === word) {
            locked = true; b.classList.add('right');
            status.textContent = 'Yes! ' + word;
            await ding(word);
            if (!ctx.scr.ok()) return;
            r++; round();
          } else {
            ctx.miss(); b.classList.add('tried');
            status.textContent = 'Not that one.';
            await again(word);
          }
        });
        grid.append(b);
      });
      ctx.stage.append(h('div', { class: 'activity matchgame' },
        picEl(L.pics[word]),
        h('p', { class: 'bigprompt' }, 'Which word matches the picture?'),
        grid, status));
      if (ctx.armReveal) ctx.armReveal(word);
      say(word);
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setInstr('Which word matches the picture?', null);
    round();
  }

  function runBuild(ctx, L) {
    const rounds = L.build.slice();
    let r = 0;
    function round() {
      if (r >= rounds.length) { ctx.progress(1); ctx.finish(); return; }
      const R = rounds[r];
      ctx.progress(r / rounds.length);
      if (ctx.count) ctx.count(r + 1, rounds.length);
      ctx.stage.innerHTML = '';
      const slotsEl = h('div', { class: 'slots' });
      const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, teach() ? 'Tap a tile, then tap a box.' : 'Tap or drag tiles into the boxes.');
      const tiles = shuffle([
        { id: 'o1', text: R.onset, cls: 'onset' },
        { id: 'o2', text: R.altOnset, cls: 'onset' },
        { id: 'c1', text: R.chunk, cls: 'chunk' },
        { id: 'c2', text: R.altChunk, cls: 'chunk' }
      ]);
      IR.TileBoard({
        tiles: tiles, nSlots: 2, slotsEl: slotsEl, bankEl: bankEl,
        onFull: async (texts, b) => {
          b.locked = true;
          if (texts.join('') === R.word) {
            status.textContent = 'Yes! ' + R.word;
            slotsEl.classList.add('right');
            await ding(R.word);
            if (!ctx.scr.ok()) return;
            r++; round();
          } else {
            ctx.miss();
            status.textContent = 'Almost. Listen again.';
            slotsEl.classList.add('almost');
            await again(R.word);
            if (!ctx.scr.ok()) return;
            slotsEl.classList.remove('almost');
            b.slots.fill(null);
            b.locked = false;
            b.render();
          }
        }
      });
      const spk = speakerBtn(() => say(R.word), 'Hear the word');
      spk.classList.add('huge');
      ctx.stage.append(h('div', { class: 'activity' }, spk, slotsEl, bankEl, status));
      if (ctx.armReveal) ctx.armReveal(R.word, (root) => [...root.querySelectorAll('.tile')].filter((t) => t.dataset.id === 'o1' || t.dataset.id === 'c1'));
      say(R.word);
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setInstr('Listen. Build the word with the tiles.', null);
    round();
  }

  function runChain(ctx, L) {
    IR.runLetterChain(ctx, {
      words: L.chain,
      split: (w) => String(w).split(''),
      say: say,
      ding: ding,
      tryAgain: (w) => again(w),
      skipModel: false,
      model: { from: L.chain[0], to: L.chain[1], audioA: clip(L.chain[0]), audioB: clip(L.chain[1]) },
      line: 'Change one letter to make a new word.',
      promptKey: null
    });
  }

  function runScramble(ctx, L) {
    const order = shuffle(L.scramble.slice());
    let r = 0;
    function round() {
      if (r >= order.length) { ctx.progress(1); ctx.finish(); return; }
      const word = order[r];
      const parts = word.split('');
      let mix = shuffle(parts.map((t, i) => ({ t: t, i: i })));
      if (mix.map((m) => m.t).join('') === word && mix.length > 1) mix = mix.reverse();
      let got = [];
      ctx.progress(r / order.length);
      if (ctx.count) ctx.count(r + 1, order.length);
      ctx.stage.innerHTML = '';
      const slots = h('div', { class: 'wcur' });
      const pool = h('div', { class: 'wpool' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      function draw() {
        slots.innerHTML = '';
        parts.forEach((p, k) => slots.append(h('span', { class: 'wslot' }, got[k] ? got[k].t : '')));
        pool.innerHTML = '';
        mix.forEach((m) => {
          const used = got.indexOf(m) >= 0;
          const b = h('button', { class: 'wtile' + (used ? ' used' : ''), type: 'button', disabled: used }, m.t);
          b.addEventListener('click', () => put(m, b));
          pool.append(b);
        });
      }
      async function put(m, b) {
        if (got.indexOf(m) >= 0) return;
        if (m.t !== parts[got.length]) {
          ctx.miss();
          b.classList.add('nudge');
          status.textContent = 'Try another letter.';
          await again(word);
          return;
        }
        got.push(m);
        draw();
        if (got.length === parts.length) {
          status.textContent = word + '!';
          await ding(word);
          if (!ctx.scr.ok()) return;
          r++; round();
        }
      }
      const hearB = h('button', { class: 'btn big primary', type: 'button', onclick: () => say(word) }, icon('speaker'), 'Hear the word');
      ctx.stage.append(h('div', { class: 'activity wordplay' }, hearB, slots, pool, status));
      draw();
      if (ctx.armReveal) ctx.armReveal(word);
      say(word);
    }
    ctx.setNext(() => { if (r < order.length - 1) { r++; round(); return true; } return false; });
    ctx.setInstr('Listen. Tap the letters in order.', null);
    round();
  }

  function runFeed(ctx, L) {
    IR.runFeedZip(ctx, { words: L.words.slice(), say: say, colorWord: (w) => showWord(w, L.vowels), rounds: 6 });
  }

  function runSentence(ctx, L) {
    const rounds = L.sentences.slice();
    let r = 0;
    function round() {
      if (r >= rounds.length) { ctx.progress(1); ctx.finish(); return; }
      const R = rounds[r];
      ctx.progress(r / rounds.length);
      if (ctx.count) ctx.count(r + 1, rounds.length);
      ctx.stage.innerHTML = '';
      const slotsEl = h('div', { class: 'slots sent' });
      const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, teach() ? 'Tap a word, then tap a box.' : 'Tap or drag the words into the boxes.');
      const plain = R.words.map((w) => w.replace(/[^A-Za-z]/g, ''));
      const tiles = shuffle(plain.map((w, i) => ({ id: 'w' + i, text: w, cls: 'word' })));
      IR.TileBoard({
        tiles: tiles, nSlots: plain.length, slotsEl: slotsEl, bankEl: bankEl,
        onTap: (text) => say(text),
        onFull: async (texts, b) => {
          b.locked = true;
          if (texts.join(' ').toLowerCase() === plain.join(' ').toLowerCase()) {
            status.textContent = 'Yes! ' + R.text;
            slotsEl.classList.add('right');
            await ding(plain[0]);
            if (!ctx.scr.ok()) return;
            r++; round();
          } else {
            ctx.miss();
            status.textContent = 'Almost. Try again.';
            slotsEl.classList.add('almost');
            await again(plain[0]);
            if (!ctx.scr.ok()) return;
            slotsEl.classList.remove('almost');
            b.slots.fill(null);
            b.locked = false;
            b.render();
          }
        }
      });
      ctx.stage.append(h('div', { class: 'activity sentact' }, slotsEl, bankEl, status));
      if (ctx.armReveal) ctx.armReveal(R.text);
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setInstr('Put the words in order.', null);
    round();
  }

  function runRead(ctx, L) {
    const pages = L.story;
    let p = 0;
    function show() {
      const pg = pages[p];
      ctx.progress(p / Math.max(1, pages.length - 1));
      ctx.stage.innerHTML = '';
      const line = h('p', { class: 'sentence' }, ...pg.words.map((w) => h('button', {
        class: 'w', type: 'button', onclick: () => say(w)
      }, w)));
      const next = h('button', { class: 'btn big primary', type: 'button', onclick: () => {
        if (p < pages.length - 1) { p++; show(); } else ctx.finish();
      } }, p === pages.length - 1 ? 'Finish' : 'Next', icon('next'));
      ctx.stage.append(h('div', { class: 'activity story readit' }, h('p', { class: 'bigprompt' }, 'Now you read it'), line, next));
      if (ctx.armReveal) ctx.armReveal(pg.text);
    }
    ctx.setNext(() => { if (p < pages.length - 1) { p++; show(); return true; } return false; });
    ctx.setInstr('Tap a word to hear it. Then you read the line.', null);
    show();
  }

  function runSort(ctx, L) {
    const items = shuffle(L.sort.slice());
    let i = 0;
    function round() {
      if (i >= items.length) { ctx.progress(1); ctx.finish(); return; }
      const it = items[i];
      ctx.progress(i / items.length);
      if (ctx.count) ctx.count(i + 1, items.length);
      ctx.stage.innerHTML = '';
      let locked = false;
      const bins = h('div', { class: 'sortbins u1bins' });
      L.bins.forEach((b) => {
        const btn = h('button', { class: 'sortbin', type: 'button', 'data-bin': b.id }, h('b', null, b.label));
        btn.addEventListener('click', async () => {
          if (locked || btn.classList.contains('tried')) return;
          if (b.id === it.bin) {
            locked = true; btn.classList.add('right');
            await ding(it.word);
            if (!ctx.scr.ok()) return;
            i++; round();
          } else {
            ctx.miss(); btn.classList.add('tried');
            await again(it.word);
          }
        });
        bins.append(btn);
      });
      ctx.stage.append(h('div', { class: 'activity' },
        h('p', { class: 'sorword' }, showWord(it.word, L.vowels)),
        h('p', { class: 'bigprompt' }, 'Which group?'),
        bins));
      if (ctx.armReveal) ctx.armReveal(L.bins.filter((b) => b.id === it.bin)[0].label, (root) => root.querySelector('[data-bin="' + it.bin + '"]'));
      say(it.word);
    }
    ctx.setNext(() => { if (i < items.length - 1) { i++; round(); return true; } return false; });
    ctx.setInstr('Tap the group for the word.', null);
    round();
  }

  function runWhich(ctx, L) {
    const items = shuffle(L.which.slice());
    let i = 0;
    function round() {
      if (i >= items.length) { ctx.progress(1); ctx.finish(); return; }
      const it = items[i];
      ctx.progress(i / items.length);
      if (ctx.count) ctx.count(i + 1, items.length);
      ctx.stage.innerHTML = '';
      let locked = false;
      const grid = h('div', { class: 'choices' });
      shuffle(L.vowelChoices.slice()).forEach((v) => {
        const b = h('button', { class: 'choice', type: 'button', 'data-w': v }, v);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (v === it.vowel) {
            locked = true; b.classList.add('right');
            await ding(it.word);
            if (!ctx.scr.ok()) return;
            i++; round();
          } else {
            ctx.miss(); b.classList.add('tried');
            await again(it.word);
          }
        });
        grid.append(b);
      });
      ctx.stage.append(h('div', { class: 'activity' },
        h('p', { class: 'sorword' }, showWord(it.word, L.vowels)),
        h('p', { class: 'bigprompt' }, 'Tap the vowel.'),
        grid));
      if (ctx.armReveal) ctx.armReveal(it.vowel);
      say(it.word);
    }
    ctx.setNext(() => { if (i < items.length - 1) { i++; round(); return true; } return false; });
    ctx.setInstr('Tap the vowel you hear in the word.', null);
    round();
  }

  function runCheck(ctx, L) {
    const items = shuffle(L.check.slice());
    let q = 0;
    function step() {
      if (q >= items.length) { ctx.progress(1); ctx.finish(); return; }
      const it = items[q];
      ctx.progress(q / items.length);
      if (ctx.count) ctx.count(q + 1, items.length);
      ctx.stage.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, 'Question ' + (q + 1) + ' of ' + items.length);
      const grid = h('div', { class: 'choices' });
      shuffle(it.choices.slice()).forEach((w) => {
        const b = choiceButton(w, L.vowels);
        b.addEventListener('click', async () => {
          if (locked) return;
          locked = true;
          b.classList.add('picked');
          status.textContent = 'Thank you.';
          Snd.play(A.sfx.tap);
          q++;
          if (!ctx.scr.ok()) return;
          await sleep(400);
          if (ctx.scr.ok()) step();
        });
        grid.append(b);
      });
      const spk = speakerBtn(() => say(it.word), 'Hear the word');
      spk.classList.add('huge');
      ctx.stage.append(h('div', { class: 'activity' }, spk, grid, status));
      if (ctx.armReveal) ctx.armReveal(it.word);
      say(it.word);
    }
    ctx.setNext(() => { if (q < items.length - 1) { q++; step(); return true; } return false; });
    ctx.setInstr('Zip\u2019s Check. Listen, then tap.', null);
    step();
  }

  const ACTS = [
    { id: 'meet', title: 'Meet the sound', group: 'lesson', run: runMeet },
    { id: 'hear', title: 'Hear and Pick', group: 'activities', run: runHear },
    { id: 'bells', title: 'Match the word', group: 'activities', run: runMatch },
    { id: 'build', title: 'Build-a-Word', group: 'activities', run: runBuild },
    { id: 'chain', title: 'Word Chains', group: 'activities', run: runChain },
    { id: 'scramble', title: 'Scrambled Letters', group: 'activities', run: runScramble },
    { id: 'feed', title: 'Feed Zip', group: 'activities', run: runFeed },
    { id: 'sentence', title: 'Sentence Bridge', group: 'activities', run: runSentence },
    { id: 'read', title: 'Now You Read It', group: 'activities', run: runRead },
    { id: 'sort', title: 'Sort the words', group: 'activities', run: runSort },
    { id: 'which', title: 'Tap the vowel', group: 'activities', run: runWhich },
    { id: 'check', title: 'Zip\u2019s Check', group: 'activities', run: runCheck }
  ];

  function lessonById(id) { return LESSONS.filter((L) => L.id === id)[0] || null; }

  function menuScreen(app, L) {
    IR.newScreen();
    const items = ACTS.map((s, i) => ({
      n: i + 1,
      title: s.title,
      href: '#/' + L.id + '/' + s.id,
      done: IR.isDone(L.id + '_' + s.id),
      min: s.id === 'read' || s.id === 'check' ? 4 : 3,
      next: false
    }));
    const nx = items.filter((it) => !it.done)[0];
    if (nx) nx.next = true;
    const menu = IR.lessonMenu({ items: items });
    app.append(h('div', { class: 'screen trailscreen unitpage unitA u5menu u1menu' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(),
        h('h1', { class: 'uA-title' }, h('small', null, 'Unit 1 \u00b7 Lesson ' + L.n.slice(2) + ' \u00b7 '), L.name),
        IR.ui.gearButton()),
      h('p', { class: 'u1blurb' }, L.blurb),
      menu));
    if (IR.teach) IR.teach.sync();
  }

  function stepScreen(app, L, act) {
    const scr = IR.newScreen();
    let mistakes = 0;
    const fill = h('i');
    const bar = h('div', { class: 'pbar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100 }, fill);
    const instrBox = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    let nextH = null;
    const base = '#/' + L.id;
    const ctx = {
      scr: scr, stage: stage,
      miss: function () { mistakes++; },
      progress: function (f) {
        const v = Math.round(Math.max(0, Math.min(1, f)) * 100);
        fill.style.width = v + '%';
      },
      setInstr: function (text) {
        instrBox.innerHTML = '';
        if (!text) { instrBox.style.display = 'none'; return; }
        instrBox.style.display = '';
        instrBox.append(h('span', { class: 'itext' }, text));
      },
      setBack: function () {},
      setNext: function (fn) { nextH = fn; },
      goNext: function () { if (nextH && nextH()) return; ctx.finish(); },
      count: function () {},
      finish: function () {
        const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
        IR.recordActivity(L.id + '_' + act.id, stars);
        IR.save();
        const idx = ACTS.findIndex((s) => s.id === act.id);
        const nxt = ACTS[idx + 1];
        app.append(IR.engage.endScreen({
          title: act.title,
          stars: stars,
          nextLabel: nxt ? 'Next: ' + nxt.title : 'Back to the lesson',
          onBack: function () { location.hash = base; },
          onNext: function () { location.hash = nxt ? base + '/' + nxt.id : base; }
        }));
        Snd.play(A.sfx.done);
      }
    };
    const screen = h('div', { class: 'screen lessonscreen nkstep u5step u1step', style: '--c:#E8731C' },
      h('header', { class: 'lesson-top' },
        h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the lesson', onclick: () => { location.hash = base; } }, icon('close')),
        bar, IR.ui.homeButton(), IR.ui.gearButton()),
      h('h2', { class: 'acttitle' }, act.title),
      instrBox, stage);
    app.append(screen);
    if (IR.engage) IR.engage.mount(ctx, screen);
    if (IR.teach) { IR.teach.mount(ctx, screen); IR.teach.sync(); }
    ctx.progress(0);
    act.run(ctx, L);
  }

  function picker(app) {
    IR.newScreen();
    const items = LESSONS.map((L, i) => ({
      n: i + 1,
      title: L.name,
      href: '#/' + L.id,
      done: IR.isDone(L.id + '_check'),
      min: 12,
      next: false
    }));
    const nx = items.filter((it) => !it.done)[0];
    if (nx) nx.next = true;
    app.append(h('div', { class: 'screen trailscreen unitpage unitA u5menu u1menu' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(),
        h('h1', { class: 'uA-title' }, h('small', null, 'Unit 1 \u00b7 '), 'Short Vowels and Floss'),
        IR.ui.gearButton()),
      h('p', { class: 'u1blurb' }, 'Four lessons in UFLI order. Short a, then i and o, then u and e, then floss.'),
      IR.lessonMenu({ items: items })));
    if (IR.teach) IR.teach.sync();
  }

  IR.u1Lessons = LESSONS;
  IR.u1Route = function (hash, app) {
    if (hash === '#/u1' || hash === '#/u1/') { picker(app); return true; }
    const m = /^#\/(u1[1-4])(?:\/(\w+))?/.exec(hash);
    if (!m) return false;
    const L = lessonById(m[1]);
    if (!L) return false;
    if (!m[2]) { menuScreen(app, L); return true; }
    const act = ACTS.filter((s) => s.id === m[2])[0];
    if (!act) return false;
    stepScreen(app, L, act);
    return true;
  };
})();
