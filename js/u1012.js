/* Units 10 to 12: More Bossy R, Long A and E teams, Long O and I teams.
   Data: data_u1012.js. Same lesson flow as Units 7 to 9.
   air, are, ear, ai, ay, ee, ea, ey, oa, ow, oe, ie, and igh stay together as one sound unit.
   Fish Pond and find-the-sound games show the word in plain black until the child is right.
   Voices: Zip en-US-RogerNeural. Frill en-US-AriaNeural. Words Aria. Story Aria.
   Letter sounds are pure recordings only. A missing sound shows "Recording needed" in Teacher mode.
   Never speak a letter name. Never use the device voice for a sound.
*/
(function () {
  'use strict';
  const IR = window.IR;
  const PACK = window.IR_DATA_U1012;
  if (!IR || !PACK) return;
  const { h, sleep, shuffle, icon, Snd, A, speakerBtn } = IR;
  const W = (w) => 'audio/w_' + String(w).toLowerCase().replace(/[^a-z]/g, '') + '.mp3';
  const P = (k) => 'audio/u1012_p_' + k + '.mp3';
  const P6 = (k) => 'audio/u6_p_' + k + '.mp3';
  const PURE = { a: 1, d: 1, e: 1, i: 1, k: 1, m: 1, n: 1, p: 1, s: 1, t: 1, u: 1, ee: 1, oh: 1 };
  const PH = (s) => (PURE[s] ? 'audio/phonemes/' + s + '.mp3' : null);
  const say = (w) => Snd.play(W(w));
  const ding = (w) => Snd.seq(w ? [A.sfx.ding, W(w)] : [A.sfx.ding], 90);
  const tryAgain = (src) => Snd.seq(src ? [A.sfx.tryagain, src] : [A.sfx.tryagain], 150);
  const FOCUS = '#C95A10';
  const UNITS = [10, 11, 12];
  const SYL = PACK.syl || {};
  const SYLC = ['#C95A10', '#1F6FB2'];

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

  const bare = (w) => String(w).toLowerCase().replace(/[\u2019']s$/, '').replace(/[^a-z]/g, '');
  /* The part of a word this lesson teaches: a tch, dge, -ild/-old ending, or a bossy r spelling. */
  function focusSpan(w, L) {
    const s = String(w).toLowerCase();
    const list = (L.focus || []).slice().sort((a, b) => b.length - a.length);
    for (const f of list) {
      let i = s.indexOf(f);
      while (i >= 0) {
        const after = s[i + f.length] || '';
        const rc = /^(ar|or|er|ir|ur|air|are|ear)$/.test(f);
        if (!(rc && /[aeiou]/.test(after) && !(f === 'or' && after === 'e'))) return [i, i + f.length];
        i = s.indexOf(f, i + 1);
      }
    }
    return null;
  }
  /* Unit 7: two-part words show each syllable in its own color. Units 8 and 9: the focus part is orange. */
  function colorWord(w, L) {
    const raw = String(w);
    const parts = SYL[bare(raw)];
    if (L.focusKind === 'syllable' && parts && parts.join('') === bare(raw) && raw.toLowerCase().indexOf(parts.join('')) >= 0) {
      const lo = raw.toLowerCase(); const st = lo.indexOf(parts.join(''));
      const out = h('span', null, raw.slice(0, st)); let p = st;
      parts.forEach((x, k) => { out.append(h('span', { class: 'chunk syl', style: 'color:' + SYLC[k % 2] }, raw.slice(p, p + x.length))); p += x.length; });
      out.append(raw.slice(p));
      return out;
    }
    const sp = L.focusKind === 'syllable' ? null : focusSpan(raw, L);
    if (!sp) return document.createTextNode(raw);
    return h('span', null, raw.slice(0, sp[0]), h('span', { class: 'chunk', style: 'color:' + FOCUS }, raw.slice(sp[0], sp[1])), raw.slice(sp[1]));
  }
  /* Sound units for chains and scrambles. Two-part words split into syllables; tch, dge, ore and the bossy r
     spellings stay together (r before a vowel is not bossy: ro-bot is not or). */
  const GRAPH = ['igh', 'air', 'are', 'ear', 'tch', 'dge', 'ore', 'ee', 'ea', 'ai', 'ay', 'oa', 'ow', 'oe', 'ie', 'ar', 'or', 'er', 'ir', 'ur', 'sh', 'ch', 'th', 'wh', 'ck', 'ng', 'nk', 'ff', 'll', 'ss', 'zz'];
  function split(w) {
    const s = bare(w);
    if (SYL[s]) return SYL[s].slice();
    const out = []; let i = 0;
    while (i < s.length) {
      let hit = null;
      for (const g of GRAPH) {
        if (s.startsWith(g, i) && !(/^(ar|or|er|ir|ur|air|are|ear)$/.test(g) && i + g.length < s.length && /[aeiou]/.test(s[i + g.length]) && !(g === 'or' && s[i + g.length] === 'e'))) { hit = g; break; }
      }
      if (hit) { out.push(hit); i += hit.length; } else { out.push(s[i]); i += 1; }
    }
    return out;
  }

  const TIPS = {
    meet: 'Model with the pure sound button when there is one. Recording needed means Justine records that sound.',
    chant: 'Say the chant together. Clap the beat.',
    hear: 'Let your child listen first, then call the number.',
    bells: 'Zip says a word. Ring the bell with that word.',
    match: 'Look at the picture. Tap the word that names it.',
    build: 'Hear the word. Build it with two parts.',
    chain: 'The glowing box is the part that changes.',
    scramble: 'Hear the word. Tap the parts in order.',
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
    const s = [{ id: 'meet', title: L.unit === 7 ? 'Meet the syllables' : 'Meet the pattern', group: 'lesson', run: (c) => runMeet(c, L), color: '#2E9E6B' }];
    if (L.chant && L.chant.length) s.push({ id: 'chant', title: 'Chant', group: 'lesson', run: (c) => runChant(c, L), color: '#C2408A' });
    s.push({ id: 'hear', title: 'Hear and Pick', group: 'activities', run: (c) => runHear(c, L), color: '#7E57C2' });
    s.push({ id: 'bells', title: 'Ring every bell', group: 'activities', run: (c) => runBells(c, L), color: '#E8731C' });
    if (L.pics && Object.keys(L.pics).length) s.push({ id: 'match', title: 'Match the picture', group: 'activities', run: (c) => runMatch(c, L), color: '#1F8FD6' });
    s.push({ id: 'build', title: 'Build-a-Word', group: 'activities', run: (c) => runBuild(c, L), color: '#E8603C' });
    s.push({ id: 'chain', title: 'Word Chains', group: 'activities', run: (c) => runChain(c, L), color: '#C95A10' });
    s.push({ id: 'scramble', title: 'Scrambled Parts', group: 'activities', run: (c) => runScramble(c, L), color: '#9C27B0' });
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
  function whichTitle(L) { return 'Tap the team'; }
  function whichAudio(L) { return 'which_' + (L.whichKey || L.key); }

  function ynMark(w) {
    const t = String(w).trim().toLowerCase();
    if (t === 'yes') return ' yn-yes';
    if (t === 'no') return ' yn-no';
    return '';
  }
  function choiceGrid(words, onPick, L, cls) {
    const grid = h('div', { class: 'choices ' + (cls || (words.length > 2 ? 'three' : 'two')) });
    words.forEach((w) => {
      const b = h('button', { class: 'choice' + ynMark(w), type: 'button', 'data-w': w }, w);
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
    const show = () => {
      const b = beats[i]; ctx.progress(i / beats.length); st.innerHTML = '';
      ctx.setInstr('', null);
      const face = b.who === 'frill' ? ACT('frill_paint') : ACT('zip_magnify');
      const replay = speakerBtn(() => Snd.play(P(b.audio)), 'Hear this again');
      const body = h('div', { class: 'bubble ' + b.who }, h('b', { class: 'who' }, b.who === 'zip' ? 'Zip' : 'Frill'), h('p', null, b.text), replay);
      const pure = b.snd && PH(b.snd) ? h('button', { class: 'btn big sndbtn', type: 'button', onclick: () => Snd.play(PH(b.snd)) }, icon('speaker'), 'Sound') : null;
      const rec = i === 0 && (L.rec || []).length ? h('p', { class: 'recneed' }, 'Recording needed: ' + L.rec.map((x) => '/' + x + '/').join(', ') + '. Model this sound yourself.') : null;
      st.append(h('div', { class: 'activity nkmeet' }, body,
        h('div', { class: 'meetrow' },
          h('div', { class: 'panelwrap small' }, h('img', { class: 'panel', src: face, alt: b.who === 'frill' ? 'Frill' : 'Zip' })),
          h('p', { class: 'bigword' }, colorWord(b.word, L)), pure),
        b.cap ? h('p', { class: 'cap' }, b.cap) : null, rec,
        h('div', { class: 'chips' }, ...(b.chips || []).map((w) => {
          const pic = wordPic(w, L, 'chippic');
          return h('button', { class: 'chip' + (pic ? ' haspic' : ''), type: 'button', onclick: () => say(w) }, pic, colorWord(w, L));
        }))));
      ctx.setNextLabel(i === beats.length - 1 ? 'Activities' : 'Next');
      Snd.play(P(b.audio)).then(() => { if (b.snd && PH(b.snd) && ctx.scr.ok()) Snd.play(PH(b.snd)); });
    };
    ctx.setNext(() => { if (i < beats.length - 1) { i++; show(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  const PIC_ALT = {
    toe: 'a toe', hoe: 'a garden hoe', joe: 'Joe', foe: 'a foe', doe: 'a doe', woe: 'a sad moment',
    boat: 'a boat', toad: 'a toad', coat: 'a coat', soap: 'soap', toast: 'toast',
    float: 'a float', road: 'a road', goat: 'a goat', load: 'a load', moat: 'a moat',
    coal: 'coal', goal: 'a goal', soak: 'a soak'
  };
  function wordPic(w, L, cls) {
    const b = bare(w);
    let src = null;
    if (L && L.pics) {
      const key = Object.keys(L.pics).find((k) => k.toLowerCase() === b);
      if (key) src = L.pics[key];
    }
    if (!src && PIC_ALT[b]) src = 'img/u12pics/' + b + '.webp';
    if (!src) return null;
    return h('img', { class: cls || 'hoepic', src: src, alt: PIC_ALT[b] || b });
  }
  function hoeFace(w, node, L) {
    const pic = wordPic(w, L);
    if (!pic) return node;
    return h('span', { class: 'hoeword' }, pic, node);
  }
  function runChant(ctx, L) {
    ctx.setInstr('Say it with Frill. Clap the beat!', 'chant');
    IR.mountChant(ctx, { key: L.key, lines: L.chant, audio: (w) => W(w), color: (w) => colorWord(w, L), intro: P('chant') });
  }

  function runHear(ctx, L) {
    const rounds = L.hear; let r = 0; const st = ctx.stage;
    ctx.setInstr('Which word did Zip say? Tap it.', null);
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const grid = choiceGrid(shuffle(R.choices.slice()), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === R.word) { locked = true; b.classList.add('right'); b.replaceChildren(colorWord(w, L)); status.textContent = 'Yes! ' + w; await ding(w); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
        else {
          ctx.miss();
          const stepName = await IR.coachMiss({ key: 'u1012-hear-' + L.key + r, wrongEl: b, correctEl: () => grid.querySelector('[data-w="' + R.word + '"]'), statusEl: status, replay: () => say(R.word) });
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
    IR.ringBells(ctx, {
      words: L.bellWords.slice(), audio: (w) => W(w), color: (w) => document.createTextNode(w),
      banner: (w) => wordPic(w, L)
    });
    const face = ctx.stage.querySelector('.bellask img');
    if (face) { face.src = 'img/zip-show/frill-wave.webp'; face.alt = 'Frill'; face.classList.add('buddy'); }
  }

  function runMatch(ctx, L) {
    const keys = shuffle(Object.keys(L.pics)); let r = 0; const st = ctx.stage;
    const bank = (L.words || []).concat(Object.keys(L.pics));
    ctx.setInstr('Look at the picture. Which word fits?', 'match');
    function round() {
      const word = keys[r]; ctx.progress(r / keys.length); if (ctx.count) ctx.count(r + 1, keys.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const dist = shuffle(bank.filter((w, i) => w !== word && bank.indexOf(w) === i)).slice(0, 2);
      const grid = choiceGrid(shuffle([word].concat(dist)), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === word) { locked = true; b.classList.add('right'); b.replaceChildren(colorWord(w, L)); status.textContent = 'Yes! ' + word; await ding(word); if (!ctx.scr.ok()) return; r++; if (r >= keys.length) ctx.finish(); else round(); }
        else { ctx.miss(); await IR.coachMiss({ key: 'u1012-match-' + L.key + r, wrongEl: b, correctEl: () => grid.querySelector('[data-w="' + word + '"]'), statusEl: status, replay: () => say(word) }); }
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
    ctx.setInstr('Snap two parts together to make the word.', 'build');
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      const slotsEl = h('div', { class: 'slots' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status' }, teach() ? 'Tap a tile, then tap a box.' : 'Tap or drag tiles into the boxes.');
      const hoe = wordPic(R.word, L);
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
      st.append(h('div', { class: 'activity' }, hoe, spk, slotsEl, bankEl, status));
      IR.sayItem(ctx, P('build'), W(R.word));
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  /* Word chain that changes one sound unit or one syllable. Same screen as js/chain.js (IR.runLetterChain),
     but the choices are the same kind of part as the answer: a syllable, a bossy r spelling, tch or dge, or a letter. */
  const RPOOL = ['igh', 'air', 'are', 'ear', 'ee', 'ea', 'ey', 'ai', 'ay', 'oa', 'ow', 'oe', 'ie', 'ore', 'ar', 'or', 'er', 'ir', 'ur'];
  const EPOOL = ['tch', 'dge', 'ch', 'sh', 'ck', 'th'];
  function partPool(need, L, b) {
    let pool;
    if (RPOOL.indexOf(need) >= 0) pool = RPOOL;
    else if (EPOOL.indexOf(need) >= 0) pool = EPOOL;
    else if (need.length > 1 && /[aeiou]/.test(need)) {
      const all = {};
      (L.words || []).concat(...(L.chains || [])).forEach((w) => (SYL[bare(w)] || []).forEach((x) => { all[x] = 1; }));
      pool = Object.keys(all);
    } else pool = 'abcdefghijklmnoprstuvw'.split('');
    const vowel = /^[aeiou]$/.test(need);
    if (need.length === 1) pool = pool.filter((x) => /^[aeiou]$/.test(x) === vowel);
    return shuffle(pool.filter((x) => x !== need && b.indexOf(x) < 0)).slice(0, 3);
  }
  function runChain(ctx, L) {
    let c = 0; const done = ctx.finish.bind(ctx);
    const line = L.unit === 7 && L.focusKind === 'syllable' && SYL[bare(L.chains[0][0])] ? 'Change one part to make a new word.' : 'Change one sound to make a new word.';
    function start() {
      ctx.finish = () => { c++; if (c < L.chains.length) start(); else done(); };
      partChain(ctx, L, L.chains[c], c > 0, line);
    }
    start();
  }
  function partChain(ctx, L, words, skipModel, line) {
    const stage = ctx.stage; let r = 1; let token = 0; let ruled = false;
    const steps = Math.max(1, words.length - 1);
    const key = L.chainKey || L.key;
    const changedAt = (a, b) => { const n = Math.max(a.length, b.length); for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i; return 0; };
    const clipOf = (a, b) => 'audio/chg_' + bare(a) + '_' + bare(b) + '.mp3';
    async function modelStep() {
      const my = ++token; ctx.setInstr(line, 'chain'); if (ctx.count) ctx.count(0, steps); stage.innerHTML = '';
      const a = split(words[0]); const b = split(words[1]); const idx = changedAt(a, b);
      const boxes = a.map((x, i) => h('span', { class: 'wtile chainslot' + (i === idx ? ' glow' : '') }, x));
      if (b.length > a.length) boxes.push(h('span', { class: 'wtile chainslot glow empty' }, ''));
      const sayLine = h('p', { class: 'bigprompt' }, 'This is ' + words[0] + '.');
      const go = h('button', { class: 'btn big primary', type: 'button' }, 'Your turn', icon('next'));
      go.addEventListener('click', () => { token++; Snd.stop(); round(); });
      const again = h('button', { class: 'btn', type: 'button' }, icon('replay'), 'Watch again');
      again.addEventListener('click', () => { token++; Snd.stop(); modelStep(); });
      stage.append(h('div', { class: 'activity chainact' }, h('div', { class: 'chainwho' }, h('img', { src: 'img/zip-show/frill-shell.webp', alt: '' }), h('b', null, 'Frill')),
        sayLine, h('p', { class: 'chainfrom' }, colorWord(words[0], L)), h('div', { class: 'chainslots' }, ...boxes), h('div', { class: 'row center' }, again, go)));
      ctx.setBack(() => false); ctx.setNext(() => { token++; Snd.stop(); round(); return true; });
      if (!ruled) { ruled = true; await IR.sayItem(ctx, P('chain'), null); }
      if (my !== token || !ctx.scr.ok()) return;
      await Snd.play('audio/u1012_chain_' + key + '_a.mp3');
      if (my !== token || !ctx.scr.ok()) return;
      await sleep(200); if (my !== token || !ctx.scr.ok()) return;
      boxes[Math.min(idx, boxes.length - 1)].classList.add('coach-glow');
      sayLine.textContent = 'Your turn. What changed?';
    }
    function round() {
      if (r >= words.length) { if (ctx.count) ctx.count(steps, steps); ctx.progress(1); ctx.finish(); return; }
      const my = ++token; const from = words[r - 1]; const to = words[r];
      const a = split(from); const b = split(to); const idx = changedAt(a, b); const need = b[idx];
      ctx.progress((r - 1) / steps); if (ctx.count) ctx.count(r, steps); ctx.setInstr(line, 'chain'); stage.innerHTML = '';
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'The glowing box is the part that changes.');
      const n = Math.max(a.length, b.length); const slotEls = [];
      for (let i = 0; i < n; i++) { const ch = a[i] || ''; slotEls.push(h('span', { class: 'wtile chainslot' + (i === idx ? ' glow' : '') + (ch ? '' : ' empty') }, ch)); }
      const clip = clipOf(from, to);
      const pool = h('div', { class: 'chainopts' });
      shuffle([need].concat(partPool(need, L, b))).forEach((t, i) => {
        const btn = h('button', { class: 'wtile chainpick', type: 'button', 'data-t': t, 'aria-label': (i + 1) + ', ' + t }, IR.numBadge(i + 1), h('span', { class: 'chainletter' }, t));
        btn.addEventListener('click', () => pick(t, btn));
        pool.append(btn);
      });
      const again = h('button', { class: 'btn big', type: 'button', onclick: () => Snd.play(clip, { manual: true }) }, icon('replay'), 'Hear it again');
      stage.append(h('div', { class: 'activity chainact' }, h('p', { class: 'chainfrom' }, colorWord(from, L)), h('div', { class: 'chainslots' }, ...slotEls), h('div', { class: 'row center' }, again), pool, status));
      ctx.setBack(() => { if (r > 1) { r--; round(); return true; } if (skipModel) return false; modelStep(); return true; });
      ctx.setNext(() => { if (r < words.length - 1) { r++; round(); return true; } return false; });
      if (!ruled) { ruled = true; IR.sayItem(ctx, P('chain'), clip); } else Snd.play(clip);
      async function pick(t, btn) {
        if (pool.dataset.lock || my !== token || btn.dataset.hit) return;
        btn.dataset.hit = '1';
        if (t === need) {
          pool.dataset.lock = '1'; slotEls[idx].textContent = need; slotEls[idx].classList.remove('empty'); slotEls[idx].classList.add('right'); btn.classList.add('right');
          status.textContent = 'Yes! ' + to; await ding(to); if (!ctx.scr.ok() || my !== token) return;
          r++; await sleep(500); if (ctx.scr.ok() && my === token) round();
        } else {
          ctx.miss();
          const correct = [...pool.children].find((el) => el.dataset.t === need);
          const stepName = await IR.coachMiss({ key: 'u1012-chain-' + r, wrongEl: btn, correctEl: correct, statusEl: status, replay: () => tryAgain(W(to)) });
          btn.dataset.hit = '';
          if (stepName === 'model') IR.againLater(words, r);
        }
      }
    }
    if (skipModel) round(); else modelStep();
  }

  function runScramble(ctx, L) {
    const order = L.scramble.slice(); let r = 0; const st = ctx.stage;
    ctx.setInstr('Oops, the parts got mixed up! Tap them in order.', 'scramble');
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
    ctx.setInstr('Build the sentence, one word at a time.', 'sentence');
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
      Snd.play(P6('heart'));
    }
    function showPages() {
      p = 0; st.innerHTML = '';
      ctx.setInstr('Read the story. One page at a time.', null);
      const pic = h('img', { class: 'panel', alt: '' });
      const sent = h('p', { class: 'sentence' });
      const label = h('p', { class: 'small' });
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
      }
      st.append(h('div', { class: 'activity story' }, h('div', { class: 'panelwrap' }, pic), h('div', { class: 'sentrow' }, sent), label));
      ctx.setBack(() => { if (p > 0) { p--; show(); return true; } if (words.length) { showHeart(); return true; } return false; });
      ctx.setNext(() => { if (p < pages.length - 1) { p++; show(); return true; } ctx.finish(); return true; });
      if (ctx.setNextLabel) ctx.setNextLabel('Next');
      if (ctx.setRepeat) ctx.setRepeat(() => Snd.play(pageAudio()));
      if (IR.pinStoryNav) IR.pinStoryNav(() => { if (p > 0) { p--; show(); } else if (words.length) showHeart(); });
      show();
    }
    if (words.length) showHeart(); else showPages();
  }

  function runSort(ctx, L) {
    const items = L.sort.slice(); let i = 0; const st = ctx.stage;
    ctx.setInstr('Where does this word live? Tap its group.', 'sort');
    function round() {
      const it = items[i]; ctx.progress(i / items.length); if (ctx.count) ctx.count(i + 1, items.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const bins = h('div', { class: 'sortbins u1bins' });
      L.bins.forEach((b) => {
        const btn = h('button', { class: 'sortbin' + ynMark(b.label), type: 'button', 'data-bin': b.id }, h('b', null, b.label));
        btn.addEventListener('click', async () => {
          if (locked || btn.classList.contains('tried')) return;
          if (b.id === it.bin) { locked = true; btn.classList.add('right'); wordBtn.classList.add('found'); wordBtn.replaceChildren(colorWord(it.word, L)); status.textContent = 'Yes!'; await ding(it.word); if (!ctx.scr.ok()) return; i++; if (i >= items.length) ctx.finish(); else round(); }
          else { ctx.miss(); await IR.coachMiss({ key: 'u1012-sort-' + L.key + i, wrongEl: btn, correctEl: () => bins.querySelector('[data-bin="' + it.bin + '"]'), statusEl: status, replay: () => say(it.word) }); }
        });
        bins.append(btn);
      });
      const wordBtn = h('button', { class: 'bigword sorword', type: 'button', onclick: () => say(it.word) }, hoeFace(it.word, document.createTextNode(it.word), L));
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
      const opts = (L.whichItems && L.whichItems[it.word]) || L.whichChoices;
      const grid = h('div', { class: 'choices ' + (opts.length > 3 ? 'many' : opts.length === 2 ? 'two' : 'three') });
      shuffle(opts.slice()).forEach((v) => {
        const b = h('button', { class: 'choice' + ynMark(v), type: 'button', 'data-w': v }, v);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (v === it.part) { locked = true; b.classList.add('right'); wordEl.classList.add('found'); wordEl.replaceChildren(colorWord(it.word, L)); status.textContent = 'Yes! ' + it.word; await ding(it.word); if (!ctx.scr.ok()) return; i++; if (i >= items.length) ctx.finish(); else round(); }
          else { ctx.miss(); await IR.coachMiss({ key: 'u1012-which-' + L.key + i, wrongEl: b, correctEl: () => grid.querySelector('[data-w="' + it.part + '"]'), statusEl: status, replay: () => say(it.word) }); }
        });
        grid.append(b);
      });
      const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
      const wordEl = h('p', { class: 'bigword' }, hoeFace(it.word, document.createTextNode(it.word), L));
      st.append(h('div', { class: 'activity' }, spk, wordEl, grid, status));
      if (i === 0) IR.sayItem(ctx, P(whichAudio(L)), W(it.word)); else say(it.word);
    }
    ctx.setNext(() => { if (i < items.length - 1) { i++; round(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; round(); return true; } return false; });
    round();
  }

  function runRhyme(ctx, L) {
    const rounds = L.rhyme; let r = 0; const st = ctx.stage;
    ctx.setInstr('Find the word that rhymes.', null);
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, 'Call out 1, 2, or 3.');
      const spk = speakerBtn(() => say(R.prompt), 'Hear the word'); spk.classList.add('huge');
      const grid = choiceGrid(R.choices.slice(), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === R.answer) { locked = true; b.classList.add('right'); b.replaceChildren(colorWord(w, L)); status.textContent = 'Yes! ' + w + ' rhymes with ' + R.prompt + '.'; await ding(w); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
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
    const status = h('p', { class: 'status' }, '\u00a0');
    const pond = h('div', { class: 'choices three fishpond' });
    fish.forEach((f) => {
      const b = h('button', { class: 'choice', type: 'button', 'data-w': f.w }, f.w);
      b.addEventListener('click', async () => {
        if (b.classList.contains('right') || b.classList.contains('tried')) return;
        if (f.yes) { b.classList.add('right', 'found'); b.replaceChildren(colorWord(f.w, L)); caught++; status.textContent = '\u00a0'; if (ctx.count) ctx.count(caught, need); ctx.progress(caught / need); await ding(f.w); if (caught >= need && ctx.scr.ok()) ctx.finish(); }
        else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again. That fish does not fit.'; await Snd.seq([P6('listenagain'), W(f.w)], 140); }
      });
      pond.append(b);
    });
    if (ctx.count) ctx.count(0, need);
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
      ctx.setInstr('Zip\u2019s Check. Tap the word you hear.', 'check');
      const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
      st.append(h('div', { class: 'activity' }, spk, choiceGrid(shuffle(it.choices.slice()), (w, b) => { if (w === it.word) b.replaceChildren(colorWord(w, L)); ans(w === it.word, b); }, L), status));
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
    if (!L) {
      return {
        hideSlides: true,
        files: [
          { title: 'Day practice', href: dir + 'Unit' + u + '_Teacher_Led_Student_Sheets.pdf' },
          { title: 'Checks', href: dir + 'Unit' + u + '_Teacher_Led_Checks_Combined.pdf' },
          { title: 'Independent', href: dir + 'Unit' + u + '_Independent_Worksheets.pdf' }
        ]
      };
    }
    return {
      slides: '#/teachers/slides/' + key,
      days: [1, 2, 3].map((n) => ({ label: 'Day ' + n })),
      files: [1, 2, 3].map((n) => ({ title: 'Day ' + n + ' practice', href: dir + 'Lesson' + L.n + '_Day' + n + '_Practice.pdf' })).concat([
        { title: 'Word list', href: dir + 'Lesson' + L.n + '_WordList.pdf' },
        { title: 'Check', href: dir + 'Lesson' + L.n + '_Teacher_Led_Checks.pdf' },
        { title: 'Independent', href: dir + 'Unit' + u + '_Independent_Worksheets.pdf' }
      ])
    };
  }

  function lessonMenu(app, L) {
    const STEPS = stepsFor(L);
    const base = '#/u' + L.unit + '/' + L.key;
    const prev = IR._u1012HashWas || '';
    if (prev.indexOf(base) !== 0) sessionStorage.removeItem('ir_sess_' + L.key);
    IR.newScreen();
    const items = STEPS.map((s) => ({ id: s.id, title: s.title, group: s.group, href: base + '/' + s.id, done: !!(lights(L.key)[s.id]), min: s.id === 'read' ? 6 : s.id === 'check' ? 4 : s.id === 'meet' ? 4 : 3 }));
    const story = { title: L.n, note: L.storyTitle, href: base + '/read', min: 6, img: 'img/cover_' + L.key + '.webp', alt: L.storyTitle, big: true };
    app.append(h('div', { class: 'screen trailscreen unitpage unitA stepage ngpreview u1012page' },
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
      focusKind: u === 7 ? 'syllable' : 'pattern',
      focus: ls.reduce((a, L) => a.concat(L.focus || []), []), vowels: 'aeiou',
      hear: fromEach(ls, 'hear', 2), bellWords: fromEach(ls, 'bellWords', 4), pics: pics,
      build: fromEach(ls, 'build', 2), chains: ls.map((L) => L.chains[0]),
      scramble: fromEach(ls, 'scramble', 2), feed: fromEach(ls, 'feed', 3), sentences: fromEach(ls, 'sentences', 1),
      words: fromEach(ls, 'words', 30),
      sort: [], bins: [], which: [], whichChoices: [],
      rhyme: fromEach(ls, 'rhyme', 2), fishYes: L0.fishYes, fishNo: L0.fishNo, fishLabel: L0.fishLabel,
      story: [], check: [], chainKey: L0.key, whichKey: L0.key, chant: [],
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
    app.append(h('div', { class: 'screen trailscreen unitpage unitA stepage ngpreview lessonpick u1012page' },
      h('header', { class: 'uA-top' }, IR.ui.pageNav('#/home'), h('h1', { class: 'uA-title' }, h('small', null, 'Unit ' + u), info.name), IR.teacherBox(teach(u, 'hub'))),
      IR.modeBar({ lesson: lessons })));
  }
  function reviewMenu(app, u) {
    IR.newScreen();
    const cards = stepsFor(mixedLesson(u)).filter((s) => s.group === 'activities').map((s) => ({ id: s.id, title: s.title, href: '#/u' + u + '/review/' + s.id, note: 'Words from every lesson' }));
    app.append(h('div', { class: 'screen trailscreen unitpage unitA stepage ngpreview u1012page' },
      h('header', { class: 'uA-top' }, IR.ui.pageNav('#/u' + u), h('h1', { class: 'uA-title' }, h('small', null, 'Unit ' + u), 'Unit Review'), IR.teacherBox(teach(u, 'hub'))),
      IR.modeBar({ lesson: false, games: cards })));
  }

  // Action art for each game: Zip and Frill doing something different on every screen (never the same picture twice in a row).
  const ART = {
    zip_surf: 'img/zip-show/surf.webp',
    zip_magnify: 'img/zip-show/think.webp',
    zip_blocks: 'img/zip-show/dig.webp',
    zip_juggle: 'img/zip-show/juggle.webp',
    frill_bell: 'img/zip-show/frill-wave.webp',
    frill_paint: 'img/zip-show/frill-peek.webp',
    frill_drum: 'img/zip-show/frill-cheer.webp',
    frill_fish: 'img/zip-show/frill-glide.webp',
    both_dance: 'img/zip-show/dance.webp'
  };
  const ACT = (k) => ART[k] || ('img/zip-show/' + k + '.webp');
  const BUDDY = { hear: 'zip_surf', bells: 'frill_bell', match: 'zip_magnify', build: 'zip_blocks', chain: 'frill_paint', scramble: 'zip_juggle',
    sentence: 'both_dance', sort: 'zip_surf', which: 'zip_juggle', rhyme: 'frill_drum', fish: 'frill_fish', check: 'zip_magnify' };
  IR.u1012Buddy = BUDDY;
  function stepScreen(app, L, idx, base) {
    const STEPS = stepsFor(L);
    const S0 = STEPS[idx]; const scr = IR.newScreen(); let mistakes = 0;
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill);
    const instrBox = h('div', { class: 'instr' }); const stage = h('div', { class: 'stage' });
    let backH = null, nextH = null;
    const ctx = {
      scr, stage, miss() { mistakes++; },
      progress(f) { fill.style.width = Math.round(((idx + Math.max(0, Math.min(1, f))) / STEPS.length) * 100) + '%'; },
      setInstr(text, p) { instrBox.innerHTML = ''; if (!text) { instrBox.style.display = 'none'; return; } instrBox.style.display = ''; const play = typeof p === 'function' ? p : () => { if (p) Snd.play(P(p)); }; const bud = BUDDY[S0.id]; if (bud) { instrBox.classList.add('hasbuddy'); instrBox.append(h('img', { class: 'buddy', src: ACT(bud), alt: /^zip/.test(bud) ? 'Zip' : /^frill/.test(bud) ? 'Frill' : 'Zip and Frill' }), h('div', { class: 'ibubble' }, speakerBtn(play, 'Hear the directions'), h('span', { class: 'itext' }, text))); } else instrBox.append(speakerBtn(play, 'Hear the directions'), h('span', { class: 'itext' }, text)); },
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
    const screen = h('div', { class: 'screen lessonscreen u6step u789step u1012step' + (S0.group === 'lesson' ? ' is-lesson' : ''), style: '--c:' + S0.color }, h('header', { class: 'lesson-top' }, IR.ui.pageNav(base), bar), instrBox, stage, nav);
    app.append(screen);
    if (S0.group === 'activities') IR.attachGameRules(ctx, screen, S0.title);
    if (IR.wireUnitControls) IR.wireUnitControls(screen, ctx);
    S0.run(ctx);
  }

  IR.u1012Lessons = PACK.lessons;
  IR.u1012SkillSteps = function () {
    return PACK.lessons.map((L) => ({ key: L.key, n: L.n, name: L.name, unit: L.unit, href: '#/u' + L.unit + '/' + L.key, steps: stepsFor(L).map((s) => Object.assign({}, s, { href: '#/u' + L.unit + '/' + L.key + '/' + s.id })) }));
  };
  IR.u1012Route = function (hash, app) {
    const m = /^#\/u(10|11|12)(?:\/(.*))?$/.exec(hash);
    if (!m) return false;
    IR._u1012HashWas = IR._u1012Prev || '';
    IR._u1012Prev = hash;
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
    const lm = /^(u1[012]\d)(?:\/(.*))?$/.exec(rest);
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

  /* Placement can send a reader straight to a built unit. Other units push onto the same list. */
  IR.unitHrefs = IR.unitHrefs || [];
  IR.unitHrefs.push({
    units: [10, 11, 12],
    open: function (n) { return n >= 10 && n <= 12 && !!IR.u1012Route; },
    href: function (n) { return '#/u' + n; },
    probes: { 10: ['chair', 'share', 'clear'], 11: ['paint', 'sheep', 'key'], 12: ['toast', 'snow', 'night'] }
  });

  /* In-app slideshow. Home, Back, Forward, and full screen. One deck, Day 1 to Day 3 jumps. */
  IR.slides1012 = function (sound) {
    IR.newScreen();
    const root = h('div', { class: 'screen slidescreen u1012slides', tabindex: '0', 'data-sound': sound });
    const stage = h('div', { class: 'slide-stage' });
    const img = h('img', { class: 'slide-img', alt: 'Lesson slide' });
    const counter = h('div', { class: 'slide-count', 'aria-live': 'polite' }, '');
    const jumps = h('div', { class: 'slide-days' });
    const back = h('button', { class: 'btn big slidebtn', type: 'button' }, 'Back');
    const fwd = h('button', { class: 'btn big slidebtn', type: 'button' }, 'Forward');
    const fs = h('button', { class: 'btn big slidebtn', type: 'button', 'aria-pressed': 'false' }, 'Full screen');
    const home = IR.ui.homeButton();
    home.classList.add('slidebtn');
    const bar = h('div', { class: 'slidebar' }, home, back, fwd, fs);
    const top = h('div', { class: 'slide-top' }, h('h1', { class: 'slide-title' }, 'Slides'), counter);
    stage.append(img);
    root.append(top, jumps, stage, bar);
    app.append(root);
    let slides = []; let days = []; let i = 0; let keyHandler = null;
    function show() {
      if (!slides.length) { counter.textContent = 'No slides'; back.disabled = true; fwd.disabled = true; return; }
      img.src = slides[i];
      counter.textContent = (i + 1) + ' of ' + slides.length;
      back.disabled = i <= 0;
      fwd.disabled = i >= slides.length - 1;
      const n = i + 1; let here = null;
      days.forEach((day) => { if (n >= (day.start || day.page || 1)) here = day; });
      jumps.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('on', !!(here && button.dataset.day === String(here.day)));
      });
      root.focus({ preventScroll: true });
    }
    function go(d) { if (!slides.length) return; i = Math.max(0, Math.min(slides.length - 1, i + d)); show(); }
    back.addEventListener('click', () => go(-1));
    fwd.addEventListener('click', () => go(1));
    fs.addEventListener('click', () => {
      const on = document.fullscreenElement === root;
      const p = on ? document.exitFullscreen() : (root.requestFullscreen ? root.requestFullscreen() : Promise.resolve());
      if (p && p.catch) p.catch(function () {});
      fs.setAttribute('aria-pressed', on ? 'false' : 'true');
      fs.textContent = on ? 'Full screen' : 'Exit';
    });
    let touchX = 0;
    stage.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }, { passive: true });
    keyHandler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
      else if (e.key === 'Home') { e.preventDefault(); i = 0; show(); }
      else if (e.key === 'End') { e.preventDefault(); i = slides.length - 1; show(); }
      else if (e.key === 'Escape' && !document.fullscreenElement) { location.hash = '#/teachers'; }
    };
    window.addEventListener('keydown', keyHandler);
    const oldCleanup = IR._slideCleanup; if (typeof oldCleanup === 'function') oldCleanup();
    IR._slideCleanup = () => { window.removeEventListener('keydown', keyHandler); };
    const slideRoot = 'materials/unit' + sound.slice(1, 3) + '/slides/' + sound + '/';
    fetch(slideRoot + 'manifest.json').then((r) => r.json()).then((man) => {
      slides = (man.slides || []).map((name) => slideRoot + name);
      days = man.days || [];
      jumps.innerHTML = '';
      days.forEach((day, index) => {
        day.day = day.day || index + 1;
        jumps.append(h('button', {
          class: 'btn slide-day', type: 'button', 'data-day': String(day.day),
          onclick: () => { i = Math.max(0, (day.start || day.page || 1) - 1); show(); }
        }, day.label || ('Day ' + day.day)));
      });
      i = 0; show();
      if (man.title) top.querySelector('.slide-title').textContent = man.title;
    }).catch(() => { counter.textContent = 'Could not load slides'; });
    show();
  };
})();
