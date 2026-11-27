/* Units 1 to 3: Short Vowels & Floss, Blends, Digraphs. Data: data_u123.js.
   Same lesson flow as Unit 5 and Unit 6: Meet first, then the games, then Zip's Check.
   Keeps the earlier Unit 1 games (Match the picture, Build-a-Word, Word Chains, Scrambled Letters,
   Feed Zip, Sentence Bridge, Now You Read It, Sort, Tap the vowel, Zip's Check) and adds the
   Unit 6 games (Hear and Pick, Ring every bell, Rhyme Call, Fish Pond).
   Voices: Zip en-US-RogerNeural +0%. Frill en-US-AriaNeural -12%. Words Aria -15%. Story Aria -10%.
   Letter sounds are pure recordings only (audio/phonemes). Never letter names, never TTS sounds. */
(function () {
  'use strict';
  const IR = window.IR;
  const PACK = window.IR_DATA_U123;
  if (!IR || !PACK) return;
  const { h, sleep, shuffle, icon, Snd, A, speakerBtn } = IR;
  const W = (w) => 'audio/w_' + String(w).toLowerCase().replace(/[^a-z]/g, '') + '.mp3';
  const P = (k) => 'audio/u123_p_' + k + '.mp3';
  const P6 = (k) => 'audio/u6_p_' + k + '.mp3';
  const PURE = { a: 1, d: 1, e: 1, i: 1, k: 1, m: 1, n: 1, p: 1, s: 1, t: 1, u: 1 };
  const PH = (s) => (PURE[s] ? 'audio/phonemes/' + s + '.mp3' : null);
  const say = (w) => Snd.play(W(w));
  const ding = (w) => Snd.seq(w ? [A.sfx.ding, W(w)] : [A.sfx.ding], 90);
  const tryAgain = (src) => Snd.seq(src ? [A.sfx.tryagain, src] : [A.sfx.tryagain], 150);
  const FOCUS = '#C95A10';
  const UNITS = [1, 2, 3];

  /* Old Unit 1 pictures (kept from the first Unit 1 build). Real photos are used first when a lesson has one. */
  const SVG = {
    map: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M20 18 h50 l10 8 v36 l-10 8 H20 z" fill="#F6E7B2" stroke="#2B2540" stroke-width="3"/><path d="M40 30 h20 M40 42 h28 M40 54 h16" stroke="#C45A3A" stroke-width="3"/></svg>',
    man: '<svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="24" r="12" fill="#F0C9A0" stroke="#2B2540" stroke-width="3"/><path d="M40 70 V46 h40 v24" fill="#3D7EA6" stroke="#2B2540" stroke-width="3"/></svg>',
    cat: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M30 40 L40 18 L52 36 L68 36 L80 18 L90 40 V62 H30 z" fill="#E8A15A" stroke="#2B2540" stroke-width="3"/><circle cx="50" cy="48" r="2" fill="#2B2540"/><circle cx="70" cy="48" r="2" fill="#2B2540"/></svg>',
    mop: '<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="56" y="10" width="8" height="40" fill="#C4A574" stroke="#2B2540" stroke-width="3"/><path d="M36 50 h48 l-6 18 H42 z" fill="#6E8B74" stroke="#2B2540" stroke-width="3"/></svg>',
    cap: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M28 46 h64 v8 H28 z" fill="#E25B4A" stroke="#2B2540" stroke-width="3"/><path d="M36 46 Q60 18 84 46" fill="#F07A66" stroke="#2B2540" stroke-width="3"/></svg>',
    pig: '<svg viewBox="0 0 120 80" aria-hidden="true"><ellipse cx="62" cy="44" rx="34" ry="22" fill="#F4A7C4" stroke="#2B2540" stroke-width="3"/><ellipse cx="90" cy="48" rx="8" ry="6" fill="#F7C2D6" stroke="#2B2540" stroke-width="3"/><circle cx="50" cy="40" r="2" fill="#2B2540"/></svg>',
    hill: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M10 64 Q40 20 70 64 Q90 40 112 64 V74 H10 z" fill="#7DAA6A" stroke="#2B2540" stroke-width="3"/></svg>',
    bell: '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M60 16 v8" stroke="#2B2540" stroke-width="3"/><path d="M40 58 Q40 28 60 28 Q80 28 80 58 z" fill="#F28C00" stroke="#2B2540" stroke-width="3"/><circle cx="60" cy="62" r="4" fill="#C95A10" stroke="#2B2540" stroke-width="2"/></svg>',
    doll: '<svg viewBox="0 0 120 80" aria-hidden="true"><circle cx="60" cy="24" r="12" fill="#F0C9A0" stroke="#2B2540" stroke-width="3"/><path d="M44 70 V42 h32 v28" fill="#C2408A" stroke="#2B2540" stroke-width="3"/></svg>'
  };

  const lessonsOf = (u) => PACK.lessons.filter((L) => L.unit === u);
  const unitInfo = (u) => (PACK.units || {})[u] || { name: 'Unit ' + u, sounds: '' };

  /* The part of a word this lesson teaches: vowel, floss ending, first blend, end blend, or digraph. */
  function focusSpan(w, L) {
    const s = String(w).toLowerCase();
    const kind = L.focusKind;
    const list = (L.focus || []).slice().sort((a, b) => b.length - a.length);
    if (kind === 'vowel') {
      const m = /[aeiou]/.exec(s.replace(/^[^a-z]+/, ''));
      if (!m) return null;
      const i = s.search(/[aeiou]/);
      return i >= 0 && (L.vowels || 'aeiou').indexOf(s[i]) >= 0 ? [i, i + 1] : null;
    }
    if (kind === 'floss') {
      const m = /(ff|ll|ss|zz)[^a-z]*$/.exec(s);
      return m ? [m.index, m.index + 2] : null;
    }
    if (kind === 'blend') {
      for (const f of list) if (s.indexOf(f) === 0) return [0, f.length];
      return null;
    }
    if (kind === 'endblend') {
      const bare = s.replace(/[^a-z]+$/, '');
      for (const f of list) if (bare.length > f.length && bare.slice(-f.length) === f) return [bare.length - f.length, bare.length];
      return null;
    }
    for (const f of list) { const i = s.indexOf(f); if (i >= 0) return [i, i + f.length]; }
    const any = /sh|ch|th|wh|ck/.exec(s);
    return any ? [any.index, any.index + 2] : null;
  }
  function colorWord(w, L) {
    const raw = String(w); const sp = focusSpan(raw, L);
    if (!sp) return document.createTextNode(raw);
    return h('span', null, raw.slice(0, sp[0]), h('span', { class: 'chunk', style: 'color:' + FOCUS }, raw.slice(sp[0], sp[1])), raw.slice(sp[1]));
  }
  /* Sound units for chains and scrambles: digraphs and floss doubles stay together. */
  const split = (w) => String(w).toLowerCase().replace(/[^a-z]/g, '').match(/sh|ch|th|wh|ck|ff|ll|ss|zz|./g) || [];

  const TIPS = {
    meet: 'Model the sound with the pure sound button. Never say the letter names.',
    hear: 'Let your child listen first, then call the number.',
    bells: 'Zip says a word. Ring the bell with that word.',
    match: 'Look at the picture. Tap the word that names it.',
    build: 'Hear the word. Build it with two tiles.',
    chain: 'The glowing box is the sound that changes.',
    scramble: 'Hear the word. Tap the letters in order.',
    feed: 'Listen, then call the number of the word.',
    sentence: 'Tap each word to hear it. Put the words in order.',
    read: 'Heart words first. Then one page at a time.',
    sort: 'Read the word. Tap its group.',
    which: 'Hear the word. Tap the part this lesson teaches.',
    rhyme: 'Play the word. The class calls 1, 2, or 3.',
    fish: 'Catch only the fish that fit the rule.',
    check: 'Let your child work alone. Just cheer.'
  };

  function stepsFor(L) {
    const s = [{ id: 'meet', title: L.unit === 1 && L.focusKind === 'vowel' ? 'Meet the sound' : 'Meet the pattern', group: 'lesson', run: (c) => runMeet(c, L), color: '#2E9E6B' }];
    s.push({ id: 'hear', title: 'Hear and Pick', group: 'activities', run: (c) => runHear(c, L), color: '#7E57C2' });
    s.push({ id: 'bells', title: 'Ring every bell', group: 'activities', run: (c) => runBells(c, L), color: '#E8731C' });
    if (L.pics && Object.keys(L.pics).length) s.push({ id: 'match', title: 'Match the picture', group: 'activities', run: (c) => runMatch(c, L), color: '#1F8FD6' });
    s.push({ id: 'build', title: 'Build-a-Word', group: 'activities', run: (c) => runBuild(c, L), color: '#E8603C' });
    s.push({ id: 'chain', title: 'Word Chains', group: 'activities', run: (c) => runChain(c, L), color: '#C95A10' });
    s.push({ id: 'scramble', title: 'Scrambled Letters', group: 'activities', run: (c) => runScramble(c, L), color: '#9C27B0' });
    s.push({ id: 'feed', title: 'Feed Zip', group: 'activities', run: (c) => runFeed(c, L), color: '#D98E00' });
    s.push({ id: 'sentence', title: 'Sentence Bridge', group: 'activities', run: (c) => runSentence(c, L), color: '#2E9E6B' });
    s.push({ id: 'read', title: 'Now You Read It', group: 'activities', run: (c) => runRead(c, L), color: '#8E5BD6' });
    s.push({ id: 'sort', title: 'Sort the words', group: 'activities', run: (c) => runSort(c, L), color: '#00897B' });
    s.push({ id: 'which', title: whichTitle(L), group: 'activities', run: (c) => runWhich(c, L), color: '#5C6BC0' });
    s.push({ id: 'rhyme', title: 'Rhyme Call', group: 'activities', run: (c) => runRhyme(c, L), color: '#C2408A' });
    s.push({ id: 'fish', title: 'Fish Pond', group: 'activities', run: (c) => runFish(c, L), color: '#1F8FD6' });
    s.push({ id: 'check', title: 'Zip\u2019s Check', group: 'activities', run: (c) => runCheck(c, L), color: '#2b2540' });
    return s.filter((x) => !L.only || L.only.indexOf(x.id) >= 0);
  }
  function whichTitle(L) {
    return { vowel: 'Tap the vowel', floss: 'Tap the floss ending', blend: 'Tap the blend', endblend: 'Tap the end blend', digraph: 'Tap the digraph' }[L.focusKind] || 'Tap the part';
  }
  function whichAudio(L) { return 'which_' + (L.focusKind || 'vowel'); }

  function choiceGrid(words, onPick, L, cls) {
    const grid = h('div', { class: 'choices ' + (cls || (words.length > 2 ? 'three' : 'two')) });
    words.forEach((w) => {
      const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorWord(w, L));
      b.addEventListener('click', () => onPick(w, b, grid));
      grid.append(b);
    });
    return grid;
  }
  function picEl(src) {
    if (!src) return null;
    if (src.indexOf('svg:') === 0) return SVG[src.slice(4)] ? h('span', { class: 'u1pic', html: SVG[src.slice(4)] }) : null;
    return h('span', { class: 'u1pic' }, h('img', { src: src, alt: '' }));
  }

  function runMeet(ctx, L) {
    const beats = L.meet; let i = 0; const st = ctx.stage;
    if (IR.zipShow) IR.zipShow.reset();
    const show = () => {
      const b = beats[i]; ctx.progress(i / beats.length); st.innerHTML = '';
      ctx.setInstr('', null);
      const letter = (L.focus && String(L.focus[0] || '').length === 1) ? L.focus[0] : '';
      const pose = i === 0
        ? { kind: letter ? 'keyword' : 'listen', key: letter, hint: 'Ears on!' }
        : (i === beats.length - 1 ? { kind: 'blend', key: letter, hint: 'Blend it fast!' } : { kind: 'say', key: letter, hint: 'Your turn!' });
      const choice = IR.zipShow ? IR.zipShow.next(pose) : null;
      const face = choice ? choice.src : (b.who === 'frill' ? 'img/frill.webp' : 'img/zipA.webp');
      const replay = speakerBtn(() => Snd.play(P(b.audio)), 'Hear this again');
      const body = h('div', { class: 'bubble ' + b.who }, h('b', { class: 'who' }, b.who === 'zip' ? 'Zip' : 'Frill'), h('p', null, b.text), replay);
      const pure = b.snd && PH(b.snd) ? h('button', { class: 'btn big sndbtn', type: 'button', onclick: () => Snd.play(PH(b.snd)) }, icon('speaker'), 'Sound') : null;
      st.append(h('div', { class: 'activity nkmeet' }, body,
        h('div', { class: 'meetrow' },
          h('div', { class: 'panelwrap small zs-face' }, h('img', { class: 'panel zs-art' + (choice ? ' zs-' + choice.motion : ''), src: face, alt: choice ? choice.alt : (b.who === 'frill' ? 'Frill' : 'Zip') }), choice ? h('b', { class: 'zs-chip' }, choice.prompt) : null),
          h('p', { class: 'bigword' }, colorWord(b.word, L)), pure),
        b.cap ? h('p', { class: 'cap' }, b.cap) : null,
        h('div', { class: 'chips' }, ...(b.chips || []).map((w) => h('button', { class: 'chip', type: 'button', onclick: () => say(w) }, colorWord(w, L))))));
      ctx.setNextLabel(i === beats.length - 1 ? 'Activities' : 'Next');
      Snd.play(P(b.audio)).then(() => { if (b.snd && PH(b.snd) && ctx.scr.ok()) Snd.play(PH(b.snd)); });
    };
    ctx.setNext(() => { if (i < beats.length - 1) { i++; show(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  function runHear(ctx, L) {
    const rounds = L.hear; let r = 0; const st = ctx.stage;
    ctx.setInstr('Tap the word you hear.', null);
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const grid = choiceGrid(shuffle(R.choices.slice()), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === R.word) { locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + w; await ding(w); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
        else {
          ctx.miss();
          const stepName = await IR.coachMiss({ key: 'u123-hear-' + L.key + r, wrongEl: b, correctEl: () => grid.querySelector('[data-w="' + R.word + '"]'), statusEl: status, replay: () => say(R.word) });
          if (stepName === 'model') IR.againLater(rounds, r);
        }
      }, L);
      st.append(h('div', { class: 'activity' }, spk, grid, status));
      IR.sayItem(ctx, P6('tapword'), W(R.word));
    }
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    round();
  }

  function runBells(ctx, L) {
    IR.ringBells(ctx, { words: L.bellWords.slice(), audio: (w) => W(w), color: (w) => colorWord(w, L) });
  }

  function runMatch(ctx, L) {
    const keys = shuffle(Object.keys(L.pics)); let r = 0; const st = ctx.stage;
    const bank = (L.words || []).concat(Object.keys(L.pics));
    ctx.setInstr('Which word matches the picture?', 'match');
    function round() {
      const word = keys[r]; ctx.progress(r / keys.length); if (ctx.count) ctx.count(r + 1, keys.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const dist = shuffle(bank.filter((w, i) => w !== word && bank.indexOf(w) === i)).slice(0, 2);
      const grid = choiceGrid(shuffle([word].concat(dist)), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === word) { locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + word; await ding(word); if (!ctx.scr.ok()) return; r++; if (r >= keys.length) ctx.finish(); else round(); }
        else { ctx.miss(); await IR.coachMiss({ key: 'u123-match-' + L.key + r, wrongEl: b, correctEl: () => grid.querySelector('[data-w="' + word + '"]'), statusEl: status, replay: () => say(word) }); }
      }, L);
      st.append(h('div', { class: 'activity matchgame' }, picEl(L.pics[word]), grid, status));
      IR.sayItem(ctx, P('match'), null);
    }
    ctx.setNext(() => { if (r < keys.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function runBuild(ctx, L) {
    const rounds = L.build; let r = 0; const st = ctx.stage;
    const teach = () => document.body.classList.contains('teach');
    ctx.setInstr('Listen. Build the word with the tiles.', 'build');
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      const slotsEl = h('div', { class: 'slots' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status' }, teach() ? 'Tap a tile, then tap a box.' : 'Tap or drag tiles into the boxes.');
      const tiles = shuffle([
        { id: 'o1', text: R.a, cls: 'onset' }, { id: 'o2', text: R.altA, cls: 'onset' },
        { id: 'c1', text: R.b, cls: 'chunk' }, { id: 'c2', text: R.altB, cls: 'chunk' }]);
      IR.TileBoard({
        tiles: tiles, nSlots: 2, slotsEl: slotsEl, bankEl: bankEl,
        onFull: async (texts, b) => {
          b.locked = true;
          if (texts.join('') === R.word) {
            status.textContent = 'Yes! ' + R.word; slotsEl.classList.add('right');
            await ding(R.word); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round();
          } else {
            ctx.miss(); status.textContent = 'Almost. Listen again.'; slotsEl.classList.add('almost');
            await tryAgain(W(R.word)); if (!ctx.scr.ok()) return;
            slotsEl.classList.remove('almost'); b.slots.fill(null); b.locked = false; b.render();
          }
        }
      });
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      st.append(h('div', { class: 'activity' }, spk, slotsEl, bankEl, status));
      IR.sayItem(ctx, P('build'), W(R.word));
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function runChain(ctx, L) {
    let c = 0; const done = ctx.finish.bind(ctx);
    const letters = {};
    (L.words || []).forEach((w) => split(w).forEach((p) => { letters[p] = 1; }));
    const opts = {
      split: split, say: say,
      distractors: Object.keys(letters),
      ding: (w) => ding(w), tryAgain: (w) => tryAgain(W(w)),
      promptAudio: 'audio/p_chain_rule.mp3', promptKey: null,
      model: { from: L.chains[0][0], to: L.chains[0][1], audioA: 'audio/u123_chain_' + (L.chainKey || L.key) + '_a.mp3', audioB: 'audio/u123_chain_' + (L.chainKey || L.key) + '_b.mp3' }
    };
    function start() {
      ctx.finish = () => { c++; if (c < L.chains.length) start(); else done(); };
      IR.runLetterChain(ctx, Object.assign({}, opts, { words: L.chains[c], skipModel: c > 0 }));
    }
    start();
  }

  function runScramble(ctx, L) {
    const order = L.scramble.slice(); let r = 0; const st = ctx.stage;
    ctx.setInstr('Listen. Tap the letters in order.', 'scramble');
    function round() {
      const word = order[r]; const parts = split(word);
      let mix = shuffle(parts.map((t, i) => ({ t: t, i: i })));
      if (mix.map((m) => m.t).join('') === parts.join('') && mix.length > 1) mix = mix.reverse();
      const got = []; ctx.progress(r / order.length); if (ctx.count) ctx.count(r + 1, order.length); st.innerHTML = '';
      const slots = h('div', { class: 'wcur' }); const pool = h('div', { class: 'wpool' });
      const status = h('p', { class: 'status' }, '\u00a0');
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
        if (m.t !== parts[got.length]) { ctx.miss(); b.classList.add('nudge'); status.textContent = 'Listen again. Try another one.'; await tryAgain(W(word)); return; }
        got.push(m); draw();
        if (got.length === parts.length) { status.textContent = 'Yes! ' + word; await ding(word); if (!ctx.scr.ok()) return; r++; if (r >= order.length) ctx.finish(); else round(); }
      }
      const spk = speakerBtn(() => say(word), 'Hear the word'); spk.classList.add('huge');
      st.append(h('div', { class: 'activity wordplay' }, spk, slots, pool, status));
      draw();
      IR.sayItem(ctx, P('scramble'), W(word));
    }
    ctx.setNext(() => { if (r < order.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function runFeed(ctx, L) {
    IR.runFeedZip(ctx, { words: L.feed.slice(), say: say, colorWord: (w) => colorWord(w, L), promptKey: null, promptAudio: 'audio/p_feed_rule.mp3' });
  }

  function runSentence(ctx, L) {
    const rounds = L.sentences; let r = 0; const st = ctx.stage;
    const teach = () => document.body.classList.contains('teach');
    ctx.setInstr('Put the words in order.', 'sentence');
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      const slotsEl = h('div', { class: 'slots sent' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status' }, teach() ? 'Tap a word, then tap a box.' : 'Tap or drag the words into the boxes.');
      const plain = R.words.map((w) => w.replace(/[^A-Za-z]/g, ''));
      const tiles = shuffle(plain.map((w, i) => ({ id: 'w' + i, text: w, cls: 'word' })));
      IR.TileBoard({
        tiles: tiles, nSlots: plain.length, slotsEl: slotsEl, bankEl: bankEl,
        onTap: (text) => say(text),
        onFull: async (texts, b) => {
          b.locked = true;
          if (texts.join(' ').toLowerCase() === plain.join(' ').toLowerCase()) {
            status.textContent = 'Yes! ' + R.text; slotsEl.classList.add('right');
            await ding(); if (!ctx.scr.ok()) return;
            await Snd.seq(plain.map(W), 120); if (!ctx.scr.ok()) return;
            r++; if (r >= rounds.length) ctx.finish(); else round();
          } else {
            ctx.miss(); status.textContent = 'Almost. Try again.'; slotsEl.classList.add('almost');
            await tryAgain(null); if (!ctx.scr.ok()) return;
            slotsEl.classList.remove('almost'); b.slots.fill(null); b.locked = false; b.render();
          }
        }
      });
      st.append(h('div', { class: 'activity sentact' }, slotsEl, bankEl, status));
      if (r === 0) IR.sayItem(ctx, P('sentence'), null);
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function heartItems(L) {
    const hearts = (L.heart || []).map((it) => ({ w: it.w || it, irregular: true }));
    const stars = (L.newWords || []).map((w) => ({ w: typeof w === 'string' ? w : w.w, irregular: false }));
    return hearts.concat(stars);
  }
  function runRead(ctx, L) {
    const pages = L.story; const words = heartItems(L); let p = 0; const st = ctx.stage; const seen = new Set();
    function showHeart() {
      st.innerHTML = '';
      ctx.setInstr('Tap each heart word and new word to hear it before the story.', null);
      ctx.progress(0);
      const done = h('button', { class: 'btn big primary', type: 'button', onclick: () => { Snd.stop(); showPages(); } }, 'Read the story', icon('next'));
      const row = h('div', { class: 'hearts' }, ...words.map((it) => h('button', {
        class: 'heartchip' + (it.irregular ? '' : ' newchip'), type: 'button', onclick: (e) => {
          e.currentTarget.classList.add('seen'); seen.add(it.w); ctx.progress(seen.size / words.length);
          Snd.play(W(it.w));
          if (seen.size === words.length) done.classList.add('glow');
        }
      }, it.irregular ? h('span', { class: 'heartmark', 'aria-hidden': 'true' }, '\u2665') : h('span', { class: 'heartmark newmark', 'aria-hidden': 'true' }, '\u2605'), h('span', { class: 'word' }, it.w))));
      st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Heart words and new words'), row, h('p', { class: 'small heartnote' }, 'Hearts have a part to learn by heart. Stars are new names and words in this story.'), h('div', { class: 'row center' }, done)));
      ctx.setBack(() => false);
      ctx.setNext(() => { Snd.stop(); showPages(); return true; });
      if (ctx.setNextLabel) ctx.setNextLabel('Next');
      if (IR.pinStoryNav) IR.pinStoryNav(null);
      if (ctx.setRepeat) ctx.setRepeat(null);
      Snd.play(P6('heart'));
    }
    function showPages() {
      p = 0; st.innerHTML = '';
      ctx.setInstr('Read the story. One page at a time.', null);
      const pic = h('img', { class: 'panel', alt: '' });
      const sent = h('p', { class: 'sentence' });
      const label = h('p', { class: 'small story-say' });
      const pageAudio = () => 'audio/' + L.key + '_s_' + (p + 1) + '.mp3';
      function show() {
        const pg = pages[p];
        pic.src = pg.img; sent.innerHTML = '';
        (pg.words || pg.text.split(' ')).forEach((w, k) => {
          if (k) sent.append(' ');
          sent.append(h('button', { class: 'w', type: 'button', onclick: () => say(w) }, w));
        });
        label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length;
        ctx.progress(p / pages.length);
        if (ctx.setRepeat) ctx.setRepeat(() => Snd.play(pageAudio()));
      }
      st.append(h('div', { class: 'activity story' }, h('div', { class: 'panelwrap' }, pic), h('div', { class: 'sentrow' }, sent), label));
      ctx.setBack(() => { if (p > 0) { p--; show(); return true; } if (words.length) { showHeart(); return true; } return false; });
      ctx.setNext(() => { if (p < pages.length - 1) { p++; show(); return true; } ctx.finish(); return true; });
      if (ctx.setNextLabel) ctx.setNextLabel('Next');
      if (IR.pinStoryNav) IR.pinStoryNav(() => { if (p > 0) { p--; show(); } else if (words.length) showHeart(); });
      show();
    }
    if (words.length) showHeart(); else showPages();
  }

  function runSort(ctx, L) {
    const items = L.sort.slice(); let i = 0; const st = ctx.stage;
    ctx.setInstr('Tap the group for the word.', 'sort');
    function round() {
      const it = items[i]; ctx.progress(i / items.length); if (ctx.count) ctx.count(i + 1, items.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const bins = h('div', { class: 'sortbins u1bins' });
      L.bins.forEach((b) => {
        const btn = h('button', { class: 'sortbin', type: 'button', 'data-bin': b.id }, h('b', null, b.label));
        btn.addEventListener('click', async () => {
          if (locked || btn.classList.contains('tried')) return;
          if (b.id === it.bin) { locked = true; btn.classList.add('right'); status.textContent = 'Yes!'; await ding(it.word); if (!ctx.scr.ok()) return; i++; if (i >= items.length) ctx.finish(); else round(); }
          else { ctx.miss(); await IR.coachMiss({ key: 'u123-sort-' + L.key + i, wrongEl: btn, correctEl: () => bins.querySelector('[data-bin="' + it.bin + '"]'), statusEl: status, replay: () => say(it.word) }); }
        });
        bins.append(btn);
      });
      const wordBtn = h('button', { class: 'bigword sorword', type: 'button', onclick: () => say(it.word) }, colorWord(it.word, L));
      st.append(h('div', { class: 'activity' }, wordBtn, h('p', { class: 'bigprompt' }, 'Which group?'), bins, status));
      if (i === 0) IR.sayItem(ctx, P('sort'), W(it.word)); else say(it.word);
    }
    ctx.setNext(() => { if (i < items.length - 1) { i++; round(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; round(); return true; } return false; });
    round();
  }

  function runWhich(ctx, L) {
    const items = L.which.slice(); let i = 0; const st = ctx.stage;
    ctx.setInstr(L.whichLabel || 'Tap the part you hear.', whichAudio(L));
    function round() {
      const it = items[i]; ctx.progress(i / items.length); if (ctx.count) ctx.count(i + 1, items.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const grid = h('div', { class: 'choices ' + (L.whichChoices.length > 3 ? '' : 'three') });
      shuffle(L.whichChoices.slice()).forEach((v) => {
        const b = h('button', { class: 'choice', type: 'button', 'data-w': v }, v);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (v === it.part) { locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + it.word; await ding(it.word); if (!ctx.scr.ok()) return; i++; if (i >= items.length) ctx.finish(); else round(); }
          else { ctx.miss(); await IR.coachMiss({ key: 'u123-which-' + L.key + i, wrongEl: b, correctEl: () => grid.querySelector('[data-w="' + it.part + '"]'), statusEl: status, replay: () => say(it.word) }); }
        });
        grid.append(b);
      });
      const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
      st.append(h('div', { class: 'activity' }, spk, h('p', { class: 'bigword' }, it.word), grid, status));
      if (i === 0) IR.sayItem(ctx, P(whichAudio(L)), W(it.word)); else say(it.word);
    }
    ctx.setNext(() => { if (i < items.length - 1) { i++; round(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; round(); return true; } return false; });
    round();
  }

  function runRhyme(ctx, L) {
    const rounds = L.rhyme; let r = 0; const st = ctx.stage;
    ctx.setInstr('Which word rhymes with this?', null);
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, 'Call out 1, 2, or 3.');
      const spk = speakerBtn(() => say(R.prompt), 'Hear the word'); spk.classList.add('huge');
      const grid = choiceGrid(R.choices.slice(), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === R.answer) { locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + w + ' rhymes with ' + R.prompt + '.'; await ding(w); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
        else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again.'; await Snd.seq([P6('listenagain'), W(R.prompt)], 160); }
      }, L, 'three');
      st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Which word rhymes with ' + R.prompt + '?'), spk, grid, status));
      IR.sayItem(ctx, P6('rhymewhich'), W(R.prompt));
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function runFish(ctx, L) {
    const fish = shuffle(L.fishYes.map((w) => ({ w, yes: true })).concat(L.fishNo.map((w) => ({ w, yes: false }))));
    const need = L.fishYes.length; let caught = 0; const st = ctx.stage;
    const line = 'Catch every fish with a word that ' + L.fishLabel + '.';
    ctx.setInstr(line, () => Snd.play(P('fish_' + L.key)));
    const status = h('p', { class: 'status' }, 'Caught 0 of ' + need + '.');
    const pond = h('div', { class: 'choices three fishpond' });
    fish.forEach((f) => {
      const b = h('button', { class: 'choice', type: 'button', 'data-w': f.w }, colorWord(f.w, L));
      b.addEventListener('click', async () => {
        if (b.classList.contains('right') || b.classList.contains('tried')) return;
        if (f.yes) { b.classList.add('right'); caught++; status.textContent = 'Yes! Caught ' + caught + ' of ' + need + '.'; ctx.progress(caught / need); await ding(f.w); if (caught >= need && ctx.scr.ok()) ctx.finish(); }
        else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again. That fish does not fit.'; await Snd.seq([P6('listenagain'), W(f.w)], 140); }
      });
      pond.append(b);
    });
    if (ctx.count) ctx.count(1, need);
    st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Fish Pond: ' + L.fishLabel), pond, status));
    IR.sayItem(ctx, P('fish_' + L.key), null);
  }

  function runCheck(ctx, L) {
    const items = L.check; let q = 0; const recs = []; const st = ctx.stage; let tok = 0;
    function finish() {
      const score = recs.filter(Boolean).length;
      const S = IR.S(); S[L.key + 'Check'] = { last: score, at: Date.now() }; IR.save();
      location.hash = '#/u' + L.unit + '/' + L.key + '/result';
    }
    function step() {
      if (q >= items.length) return finish();
      const it = items[q]; const my = ++tok; ctx.progress(q / items.length); st.innerHTML = '';
      if (ctx.count) ctx.count(q + 1, items.length);
      let locked = false;
      const status = h('p', { class: 'status' }, 'Question ' + (q + 1) + ' of ' + items.length);
      const ans = async (ok, b) => {
        if (locked) return; locked = true; recs[q] = !!ok; b.classList.add('picked');
        status.textContent = 'Thank you.'; Snd.play(A.sfx.tap); await sleep(500); if (!ctx.scr.ok() || my !== tok) return; q++; step();
      };
      ctx.setInstr('Zip\u2019s Check. Listen, then tap.', 'check');
      const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
      st.append(h('div', { class: 'activity' }, spk, choiceGrid(shuffle(it.choices.slice()), (w, b) => ans(w === it.word, b), L), status));
      if (q === 0) IR.sayItem(ctx, P('check'), W(it.word)); else say(it.word);
    }
    ctx.setNext(() => { if (q < items.length - 1) { q++; step(); return true; } return false; });
    ctx.setBack(() => { if (q > 0) { q--; step(); return true; } return false; });
    step();
  }

  function resultPage(app, L) {
    IR.newScreen(); const S = IR.S(); const score = (S[L.key + 'Check'] && S[L.key + 'Check'].last) || 0;
    const base = '#/u' + L.unit + '/' + L.key;
    const wrap = h('div', { class: 'result' });
    const back = h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = base; } }, icon('back'), 'Back to the lesson');
    const again = h('button', { class: 'btn big next', type: 'button', onclick: () => { location.hash = base + '/check'; } }, 'Try the check again');
    const home = h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = '#/home'; } }, 'See the sky map');
    if (score >= 9) wrap.append(h('h1', null, 'Move on'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10.'));
    else if (score >= 7) wrap.append(h('h1', null, 'Review'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. Practice Hear and Pick or Fish Pond, then try the check again.'));
    else wrap.append(h('img', { class: 'char zip big', src: 'img/zipA.webp', alt: 'Zip' }), h('h1', null, 'Let\u2019s practice this one more time'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. A grown-up can re-teach this lesson, then try the check again.'));
    wrap.append(h('div', { class: 'row' }, score >= 9 ? home : again, back));
    if (score >= 7) wrap.prepend(IR.celebration(score >= 9));
    app.append(h('div', { class: 'screen resultscreen' }, h('div', { class: 'unitbar' }, IR.ui.pageNav('#/u' + L.unit)), wrap));
    Snd.play(score >= 9 ? A.sfx.gong : A.sfx.done);
  }

  function lights(key) { try { return JSON.parse(sessionStorage.getItem('ir_sess_' + key) || '{}'); } catch (e) { return {}; } }
  function mark(key, id) { const L = lights(key); L[id] = 1; sessionStorage.setItem('ir_sess_' + key, JSON.stringify(L)); }

  /* Teacher materials per lesson: slideshow with Day buttons, teacher-led checks, daily sheets, independent pages, word list. */
  function teach(u, key) {
    const dir = 'materials/unit' + u + '/';
    const L = PACK.lessons.filter((x) => x.key === key)[0];
    const files = [
      { title: 'Daily practice sheets', href: dir + 'Unit' + u + '_Teacher_Led_Student_Sheets.pdf' },
      { title: 'Independent worksheets', href: dir + 'Unit' + u + '_Independent_Worksheets.pdf' }
    ];
    if (!L) {
      files.push({ title: 'Teacher pack', href: dir + 'Unit' + u + '_Teacher_Led_Checks_Combined.pdf' });
      return { files: files, hideSlides: true };
    }
    files.push({ title: 'Teacher pack', href: dir + 'Lesson' + L.n + '_Teacher_Led_Checks.pdf' });
    files.push({ title: 'Word List', href: dir + 'Lesson' + L.n + '_WordList.pdf' });
    return {
      slides: '#/teachers/slides/' + key,
      days: (L.days || ['', '', '']).map((d, i) => ({ label: 'Day ' + (i + 1) })),
      files: files
    };
  }

  function lessonMenu(app, L) {
    const STEPS = stepsFor(L);
    const base = '#/u' + L.unit + '/' + L.key;
    const prev = IR._u123HashWas || '';
    if (prev.indexOf(base) !== 0) sessionStorage.removeItem('ir_sess_' + L.key);
    IR.newScreen();
    const items = STEPS.map((s) => ({ id: s.id, title: s.title, group: s.group, href: base + '/' + s.id, done: !!(lights(L.key)[s.id]), min: s.id === 'read' ? 6 : s.id === 'check' ? 4 : s.id === 'meet' ? 4 : 3 }));
    const story = { title: L.storyTitle, href: base + '/read', min: 6, img: IR.storyCovers[L.n] || ('img/cover_' + L.key + '.webp'), alt: L.storyTitle, big: true };
    app.append(h('div', { class: 'screen trailscreen unitpage unitA stepage ngpreview' },
      h('header', { class: 'uA-top' }, IR.ui.pageNav('#/u' + L.unit), h('h1', { class: 'uA-title' }, h('small', null, 'Unit ' + L.unit + ' Lesson ' + IR.kidLesson(L.n)), L.name), IR.teacherBox(teach(L.unit, L.key))),
      IR.modeBar({
        lesson: items.filter((r) => r.group === 'lesson').map((r) => ({ title: r.title, href: r.href, min: r.min })),
        games: items.filter((r) => r.group === 'activities').map((r) => ({ id: r.id, title: r.title, href: r.href, note: TIPS[r.id], min: r.min })),
        story: story
      })));
  }

  function fromEach(ls, key, n) { return ls.reduce((list, L) => list.concat((L[key] || []).slice(0, n)), []); }
  function mixedLesson(u) {
    const ls = lessonsOf(u); const L0 = ls[0];
    const pics = {}; ls.forEach((L) => Object.keys(L.pics || {}).slice(0, 2).forEach((k) => { pics[k] = L.pics[k]; }));
    const bins = [];
    ls.forEach((L) => (L.which || []).forEach((x) => { if (bins.indexOf(x.part) < 0) bins.push(x.part); }));
    return {
      key: 'review' + u, n: String(u), unit: u, name: 'Unit Review',
      focusKind: u === 1 ? 'vowel' : u === 2 ? 'blend' : 'digraph',
      focus: ls.reduce((a, L) => a.concat(L.focus || []), []), vowels: 'aeiou',
      hear: fromEach(ls, 'hear', 2), bellWords: fromEach(ls, 'bellWords', 4), pics: pics,
      build: fromEach(ls, 'build', 2), chains: ls.map((L) => L.chains[0]),
      scramble: fromEach(ls, 'scramble', 2), feed: fromEach(ls, 'feed', 3), sentences: fromEach(ls, 'sentences', 1),
      words: fromEach(ls, 'words', 30),
      sort: [], bins: [], which: [], whichChoices: [],
      rhyme: fromEach(ls, 'rhyme', 2), fishYes: L0.fishYes, fishNo: L0.fishNo, fishLabel: L0.fishLabel,
      story: [], check: [], chainKey: L0.key,
      only: ['hear', 'bells', 'match', 'build', 'chain', 'scramble', 'feed', 'sentence', 'rhyme']
    };
  }
  function picker(app, u) {
    IR.newScreen();
    const info = unitInfo(u);
    const lessons = lessonsOf(u).map((L) => ({
      kicker: 'Lesson ' + IR.kidLesson(L.n), title: L.name, href: '#/u' + u + '/' + L.key,
      img: IR.pickerScene[L.key], alt: L.storyTitle, note: L.storyTitle
    }));
    lessons.push({ kicker: 'Unit Review', title: 'Mixed games', href: '#/u' + u + '/review', img: IR.pickerScene.review, alt: 'Zip and Frill', note: 'Words from every lesson', goLabel: 'Open review' });
    app.append(h('div', { class: 'screen trailscreen unitpage unitA stepage ngpreview lessonpick' },
      h('header', { class: 'uA-top' }, IR.ui.pageNav('#/home'), h('h1', { class: 'uA-title' }, h('small', null, 'Unit ' + u), info.name), IR.teacherBox(teach(u, 'hub'))),
      IR.modeBar({ lesson: lessons })));
  }
  function reviewMenu(app, u) {
    IR.newScreen();
    const cards = stepsFor(mixedLesson(u)).filter((s) => s.group === 'activities').map((s) => ({ id: s.id, title: s.title, href: '#/u' + u + '/review/' + s.id, note: 'Words from every lesson' }));
    app.append(h('div', { class: 'screen trailscreen unitpage unitA stepage ngpreview' },
      h('header', { class: 'uA-top' }, IR.ui.pageNav('#/u' + u), h('h1', { class: 'uA-title' }, h('small', null, 'Unit ' + u), 'Unit Review'), IR.teacherBox(teach(u, 'hub'))),
      IR.modeBar({ lesson: false, games: cards })));
  }

  function stepScreen(app, L, idx, base) {
    const STEPS = stepsFor(L);
    const S0 = STEPS[idx]; const scr = IR.newScreen(); let mistakes = 0;
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill);
    const instrBox = h('div', { class: 'instr' }); const stage = h('div', { class: 'stage' });
    let backH = null, nextH = null;
    const ctx = {
      scr, stage, miss() { mistakes++; },
      progress(f) { fill.style.width = Math.round(((idx + Math.max(0, Math.min(1, f))) / STEPS.length) * 100) + '%'; },
      setInstr(text, p) { instrBox.innerHTML = ''; if (!text) { instrBox.style.display = 'none'; return; } instrBox.style.display = ''; const play = typeof p === 'function' ? p : () => { if (p) Snd.play(P(p)); }; instrBox.append(speakerBtn(play, 'Hear the directions'), h('span', { class: 'itext' }, text)); },
      setBack(fn) { backH = fn; }, setNext(fn) { nextH = fn; },
      setNextLabel(t) { navApi.label(t); },
      showNav(on) { nav.classList.toggle('nonext', on === false); if (on === false) nextBtn.hidden = true; },
      goBack() { Snd.stop(); if (backH && backH()) return; location.hash = idx > 0 ? base + '/' + STEPS[idx - 1].id : base; },
      goNext() { Snd.stop(); if (nextH && nextH()) return; location.hash = idx < STEPS.length - 1 ? base + '/' + STEPS[idx + 1].id : base; },
      finish() { mark(L.key, S0.id); IR.recordActivity(L.key + '_' + S0.id, mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1); IR.save(); location.hash = base; }
    };
    const nextBtn = h('button', { class: 'btn big next', type: 'button', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, nextBtn);
    const navApi = IR.simpleNav(nav, nextBtn, () => { Snd.stop(); location.hash = base; }, /review/.test(L.key) ? 'Back' : undefined);
    const screen = h('div', { class: 'screen lessonscreen u6step u123step' + (S0.group === 'lesson' ? ' is-lesson' : ''), style: '--c:' + S0.color }, h('header', { class: 'lesson-top' }, IR.ui.pageNav(base), bar), instrBox, stage, nav);
    app.append(screen);
    if (S0.group === 'activities') IR.attachGameRules(ctx, screen, S0.title);
    if (IR.wireUnitControls) IR.wireUnitControls(screen, ctx);
    S0.run(ctx);
  }

  IR.u123Lessons = PACK.lessons;
  IR.u123SkillSteps = function () {
    return PACK.lessons.map((L) => ({ key: L.key, n: L.n, name: L.name, unit: L.unit, href: '#/u' + L.unit + '/' + L.key, steps: stepsFor(L).map((s) => Object.assign({}, s, { href: '#/u' + L.unit + '/' + L.key + '/' + s.id })) }));
  };
  IR.u123Route = function (hash, app) {
    const m = /^#\/u([123])(?:\/(.*))?$/.exec(hash);
    if (!m) return false;
    IR._u123HashWas = IR._u123Prev || '';
    IR._u123Prev = hash;
    const u = parseInt(m[1], 10); const rest = (m[2] || '').replace(/\/$/, '');
    if (!rest) { picker(app, u); return true; }
    if (rest === 'review') { reviewMenu(app, u); return true; }
    const rv = /^review\/([a-z]+)$/.exec(rest);
    if (rv) {
      const mix = mixedLesson(u); const steps = stepsFor(mix);
      const i = steps.findIndex((s) => s.id === rv[1]);
      if (i < 0) return false;
      stepScreen(app, mix, i, '#/u' + u + '/review');
      return true;
    }
    const lm = /^(u\d\d)(?:\/(.*))?$/.exec(rest);
    if (!lm) return false;
    const L = PACK.lessons.filter((x) => x.key === lm[1] && x.unit === u)[0];
    if (!L) return false;
    const sub = lm[2] || '';
    if (!sub) { lessonMenu(app, L); return true; }
    if (sub === 'result') { resultPage(app, L); return true; }
    const STEPS = stepsFor(L);
    const i = STEPS.findIndex((s) => s.id === sub);
    if (i < 0) return false;
    stepScreen(app, L, i, '#/u' + u + '/' + L.key);
    return true;
  };
})();
