/* Unit 6 Endings: three lessons (6.1 -s/-es, 6.2 -ed, 6.3 -ing). Data: data_u6.js.
   Ten activities each. Fish Pond is 9. Zip's Check is last.
   Voices match Unit 4 ng/nk. Zip: en-US-RogerNeural, rate +0%, pitch +0Hz.
   Frill: en-US-AriaNeural, rate -10%, pitch +0Hz. Meet `who` and story `voice` pick the speaker.
   Narration and game prompts use Zip's voice. Sounds are real ending sounds, never letter names. */
(function () {
  'use strict';
  const IR = window.IR;
  const PACK = window.IR_DATA_U6;
  if (!IR || !PACK) return;
  const { h, $, $$, sleep, shuffle, icon, Snd, A, speakerBtn } = IR;
  const W = (w) => 'audio/u6_w_' + String(w).toLowerCase().replace(/[^a-z]/g, '') + '.mp3';
  const P = (k) => 'audio/u6_p_' + k + '.mp3';
  const SND = (k) => 'audio/u6_snd_' + k + '.mp3';
  const say = (w) => Snd.play(W(w));
  const ding = (w) => Snd.seq(w ? [A.sfx.ding, W(w)] : [A.sfx.ding], 90);
  const tryAgain = (src) => Snd.seq(src ? [A.sfx.tryagain, src] : [A.sfx.tryagain], 150);
  const ENDCOL = { s: '#2E9E6B', es: '#1F8FD6', ed: '#C2408A', ing: '#E8731C' };
  const LAB = { s: '-s', es: '-es', ed: '-ed', ing: '-ing' };

  function endingOf(w) {
    const m = /(ing|es|ed|s)$/.exec(String(w).toLowerCase().replace(/[^a-z]/g, ''));
    if (!m || m.index < 2) return null;
    return m[1];
  }
  function colorEnd(w) {
    const raw = String(w);
    const bare = raw.replace(/[^A-Za-z]/g, '');
    const e = endingOf(bare);
    if (!e) return document.createTextNode(raw);
    const i = bare.length - e.length;
    const punct = raw.slice(bare.length);
    return h('span', null, bare.slice(0, i), h('span', { class: 'chunk', style: 'color:' + ENDCOL[e] }, bare.slice(i)), punct);
  }
  function splitChain(word) {
    const bare = String(word).toLowerCase().replace(/[^a-z]/g, '');
    const e = endingOf(bare);
    const base = e ? bare.slice(0, bare.length - e.length) : bare;
    const bits = base.match(/sh|ch|th|ck|ng|nk|./g) || [];
    if (e) bits.push(e);
    return bits;
  }
  function hasLessonEnd(word, lesson) {
    const e = endingOf(word);
    return !!(e && lesson.endings.indexOf(e) >= 0);
  }

  const TIPS = {
    meet: 'Model the ending sound. Never say the letter names.',
    hear: 'Let your child listen first, then call the number.',
    bells: '1 means the word has the ending. 2 means it does not.',
    build: 'Hear the word. Pick the ending that was added.',
    chain: 'The glowing letter is the one that changes.',
    feed: 'Listen, then call the number of the word.',
    sentence: 'Tap each word that has the ending.',
    read: 'One page at a time. You only step in if a word sticks.',
    rhyme: 'Play the word. The class calls 1, 2, or 3.',
    fish: 'Catch only the fish whose word has the ending.',
    check: 'Let your child work alone. Just cheer.'
  };
  const GROWN = 'First miss: Listen again, then play the ending sound. Second miss: read the base, then play the ending sound. Never say the letter names. About 10 to 12 minutes for the skill, then the story. 9 or 10: move on. 7 or 8: review. 6 or below: re-teach.';

  function stepsFor(L) {
    return [
      { id: 'meet', title: 'Meet the ending', group: 'lesson', run: (c) => runMeet(c, L), color: '#2E9E6B' },
      { id: 'hear', title: 'Hear and Pick', group: 'activities', run: (c) => runHear(c, L), color: '#7E57C2' },
      { id: 'bells', title: 'Ring every bell', group: 'activities', run: (c) => runBells(c, L), color: '#E8731C' },
      { id: 'build', title: 'Add the ending', group: 'activities', run: (c) => runBuild(c, L), color: '#E8603C' },
      { id: 'chain', title: 'Word Chains', group: 'activities', run: (c) => runChain(c, L), color: '#C95A10' },
      { id: 'feed', title: 'Feed Zip', group: 'activities', run: (c) => runFeed(c, L), color: '#D98E00' },
      { id: 'sentence', title: 'Tap each word that has an ending', group: 'activities', run: (c) => runSentence(c, L), color: '#2E9E6B' },
      { id: 'read', title: 'Now You Read It', group: 'activities', run: (c) => runRead(c, L), color: '#8E5BD6' },
      { id: 'rhyme', title: 'Rhyme Call', group: 'activities', run: (c) => runRhyme(c, L), color: '#C2408A' },
      { id: 'fish', title: 'Fish Pond', group: 'activities', run: (c) => runFish(c, L), color: '#1F8FD6' },
      { id: 'check', title: 'Zip\u2019s Check', group: 'activities', run: (c) => runCheck(c, L), color: '#2b2540' }
    ];
  }

  function choiceGrid(words, onPick, cls) {
    const grid = h('div', { class: 'choices ' + (cls || (words.length > 2 ? 'three' : 'two')) });
    words.forEach((w) => {
      const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorEnd(w));
      b.addEventListener('click', () => onPick(w, b, grid));
      grid.append(b);
    });
    return grid;
  }

  function pairRow(a, b) {
    return h('div', { class: 'pairrow' },
      h('span', { class: 'bigword pairword' }, colorEnd(a)),
      h('span', { class: 'pairarrow', 'aria-hidden': 'true' }, '\u2192'),
      h('span', { class: 'bigword pairword' }, colorEnd(b)));
  }

  function runMeet(ctx, L) {
    const beats = L.meet; let i = 0; const st = ctx.stage;
    const groups = L.soundGroups || null;
    const show = () => {
      const b = beats[i]; ctx.progress(i / beats.length); st.innerHTML = '';
      ctx.setInstr('', null);
      const face = b.who === 'frill' ? 'img/frill.webp' : 'img/zipA.webp';
      const replay = speakerBtn(() => Snd.play(P(b.audio)), 'Hear this again');
      const body = h('div', { class: 'bubble ' + b.who }, h('b', { class: 'who' }, b.who === 'zip' ? 'Zip' : 'Frill'), h('p', null, b.text), replay);
      let visual;
      if (groups) {
        const edWord = (w) => h('button', { class: 'edword', type: 'button', onclick: () => say(w) }, w.slice(0, -2), h('span', { class: 'edmark' }, 'ed'));
        visual = h('div', { class: 'edgroups' }, ...groups.map((g) => h('section', { class: 'edgroup' + (b.focus === g.id ? ' on' : '') },
          h('button', { class: 'edhead', type: 'button', onclick: () => Snd.play(SND(g.sound)) },
            h('span', { class: 'edspell' }, 'ed'),
            h('span', { class: 'edsep' }, ' \u2013 '),
            h('span', { class: 'edsay' }, g.say)),
          h('div', { class: 'edwords' }, ...g.words.map(edWord)))));
      } else if (b.pairs) {
        visual = h('div', { class: 'pairlist' }, ...b.pairs.map((pair) => pairRow(pair[0], pair[1])));
      } else {
        visual = h('div', null,
          h('div', { class: 'meetrow' },
            h('div', { class: 'panelwrap small' }, h('img', { class: 'panel', src: face, alt: b.who === 'frill' ? 'Frill' : 'Zip' })),
            h('p', { class: 'bigword' }, colorEnd(b.word))),
          b.cap ? h('p', { class: 'cap' }, b.cap) : null,
          h('div', { class: 'chips' }, ...(b.chips || []).map((w) => h('button', { class: 'chip', type: 'button', onclick: () => say(w) }, colorEnd(w)))));
      }
      st.append(h('div', { class: 'activity nkmeet' }, body,
        groups ? h('div', { class: 'meetrow' }, h('div', { class: 'panelwrap small' }, h('img', { class: 'panel', src: face, alt: '' }))) : null,
        visual));
      ctx.setNextLabel(i === beats.length - 1 ? 'Activities' : 'Next');
      Snd.play(P(b.audio));
    };
    ctx.setNext(() => { if (i < beats.length - 1) { i++; show(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  function runHear(ctx, L) {
    const rounds = L.hear; let r = 0; const st = ctx.stage;
    ctx.setInstr('Tap the word you hear.', 'tapword');
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, '\u00a0');
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const grid = choiceGrid(shuffle(R.choices), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === R.word) { locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + w; await ding(w); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
        else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again.'; await Snd.seq([P('listenagain'), W(R.word), SND(soundFor(R.word))], 180); }
      });
      st.append(h('div', { class: 'activity' }, spk, grid, status));
      IR.sayItem(ctx, P('tapword'), W(R.word));
    }
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    round();
  }

  function soundFor(word) {
    const map = {
      cats: 's', hats: 's', cups: 's', maps: 's', packs: 's', taps: 's', hits: 's', spots: 's', sticks: 's', hikes: 's', shifts: 's', tucks: 's', caps: 's',
      bugs: 'z', dogs: 'z', bells: 'z', hugs: 'z', hangs: 'z', rings: 'z', tugs: 'z', hills: 'z', kids: 'z', bags: 'z',
      boxes: 'iz', foxes: 'iz', dishes: 'iz', wishes: 'iz', buses: 'iz', benches: 'iz', bushes: 'iz', lunches: 'iz',
      jumped: 'ed_t', bumped: 'ed_t', packed: 'ed_t', stacked: 'ed_t', helped: 'ed_t', missed: 'ed_t', wished: 'ed_t', fished: 'ed_t', passed: 'ed_t', jumps: 's', packs: 's', helps: 's',
      filled: 'ed_d', smelled: 'ed_d', spelled: 'ed_d', yelled: 'ed_d', banged: 'ed_d',
      lifted: 'ed_id', rested: 'ed_id', landed: 'ed_id', ended: 'ed_id', tested: 'ed_id', handed: 'ed_id', mended: 'ed_id'
    };
    if (map[word]) return map[word];
    if (/ing$/.test(word)) return 'ing';
    if (/es$/.test(word)) return 'iz';
    if (/ed$/.test(word)) return 'ed_id';
    if (/s$/.test(word)) return 's';
    return 's';
  }

  function runBells(ctx, L) {
    const items = shuffle(L.bells.yes.map((w) => ({ w, yes: true })).concat(L.bells.no.map((w) => ({ w, yes: false }))));
    let r = 0; const st = ctx.stage;
    ctx.setInstr('Does this word have the ending? Listen first. Answer 1 for yes, 2 for no.', 'yesno');
    function round() {
      const it = items[r]; ctx.progress(r / items.length); if (ctx.count) ctx.count(r + 1, items.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, 'Listen.');
      const word = h('p', { class: 'bigword yn-secret' }, '\u00a0');
      const reveal = () => { word.classList.remove('yn-secret'); word.textContent = ''; word.append(colorEnd(it.w)); };
      const grid = h('div', { class: 'choices two yn-row' });
      [['yes', 'Yes', 'yn yn-yes'], ['no', 'No', 'yn yn-no']].forEach(([id, lab, cls]) => {
        const b = h('button', { class: 'choice ' + cls, type: 'button', 'data-w': id }, lab);
        b.addEventListener('click', async () => {
          if (locked) return;
          const ok = (id === 'yes') === it.yes;
          reveal();
          if (ok) { locked = true; b.classList.add('right'); status.textContent = 'Yes. ' + it.w + '.'; await ding(it.w); if (!ctx.scr.ok()) return; r++; if (r >= items.length) ctx.finish(); else round(); }
          else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Not this time. The word is ' + it.w + '.'; await Snd.seq([P('listenagain'), W(it.w)], 160); }
        });
        grid.append(b);
      });
      st.append(h('div', { class: 'activity' }, word, speakerBtn(() => say(it.w), 'Hear the word'), grid, status));
      IR.sayItem(ctx, P('yesno'), W(it.w));
    }
    ctx.setNext(() => { if (r < items.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function runBuild(ctx, L) {
    const rounds = L.build; let r = 0; let showed = false; const st = ctx.stage;
    const ex = L.example;
    function example() {
      showed = true; st.innerHTML = ''; ctx.progress(0);
      ctx.setInstr('Watch Frill. Then you pick the ending.', null);
      st.append(h('div', { class: 'activity' },
        h('div', { class: 'chainwho' }, h('img', { src: 'img/frill.webp', alt: '' }), h('b', null, 'Frill')),
        h('p', { class: 'bigprompt' }, 'This is ' + ex.base + '. Listen: ' + ex.word + '.'),
        h('p', { class: 'bigword' }, colorEnd(ex.base), ' + ', h('span', { class: 'chunk', style: 'color:' + ENDCOL[ex.end] }, LAB[ex.end]), ' = ', colorEnd(ex.word)),
        h('button', { class: 'btn big primary', type: 'button', onclick: () => round() }, 'Your turn', icon('next'))));
      Snd.seq([W(ex.base), W(ex.word)], 280);
    }
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false; let misses = 0;
      ctx.setInstr('Listen. Pick the ending that makes this word.', 'finish');
      const status = h('p', { class: 'status' }, '\u00a0');
      const grid = h('div', { class: 'choices ' + (L.endings.length >= 3 ? 'three' : 'two') });
      L.endings.forEach((e) => {
        const b = h('button', { class: 'choice', type: 'button', 'data-w': e }, LAB[e]);
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (e === R.end) {
            locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + R.word;
            await Snd.seq([A.sfx.ding, W(R.word), SND(R.sound)], 140);
            if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round();
          } else {
            misses++; ctx.miss(); b.classList.add('tried');
            if (misses < 2) { status.textContent = 'Listen again.'; await Snd.seq([P('listenagain'), W(R.word), SND(R.sound)], 160); }
            else { status.textContent = 'The ending is ' + LAB[R.end] + '. ' + R.base + ' makes ' + R.word + '.'; await Snd.seq([W(R.word), SND(R.sound)], 160); }
          }
        });
        grid.append(b);
      });
      st.append(h('div', { class: 'activity' },
        speakerBtn(() => say(R.word), 'Hear the word'),
        h('p', { class: 'bigword' }, colorEnd(R.base), h('span', { class: 'chunk', style: 'color:#9C7A00' }, ' + ?')),
        grid, status));
      IR.sayItem(ctx, P('finish'), W(R.word));
    }
    ctx.setNext(() => { if (!showed) { round(); return true; } if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } if (showed) { showed = false; example(); return true; } return false; });
    example();
  }

  function runChain(ctx, L) {
    let c = 0;
    const done = ctx.finish.bind(ctx);
    const MODELS = {
      u61: { from: 'cat', to: 'cats', audioA: 'audio/u6_chain_u61_a.mp3', audioB: 'audio/u6_chain_u61_b.mp3' },
      u62: { from: 'jump', to: 'jumped', audioA: 'audio/u6_chain_u62_a.mp3', audioB: 'audio/u6_chain_u62_b.mp3' },
      u63: { from: 'hang', to: 'hanging', audioA: 'audio/u6_chain_u63_a.mp3', audioB: 'audio/u6_chain_u63_b.mp3' }
    };
    const opts = {
      split: splitChain,
      say: say,
      distractors: ['s', 'es', 'ed', 'ing', 'a', 't', 'p', 'm', 'b', 'h', 'c', 'r'],
      ding: (w) => ding(w),
      tryAgain: (w) => tryAgain(W(w)),
      promptAudio: 'audio/p_chain_rule.mp3',
      promptKey: null,
      model: MODELS[L.key]
    };
    function start() {
      ctx.finish = () => { c++; if (c < L.chains.length) start(); else done(); };
      IR.runLetterChain(ctx, Object.assign({}, opts, { words: L.chains[c], skipModel: c > 0 }));
    }
    start();
  }

  function runFeed(ctx, L) {
    const words = L.feedYes.concat(L.feedNo);
    IR.runFeedZip(ctx, { words: words, say: say, colorWord: colorEnd, promptKey: null, promptAudio: 'audio/p_feed_rule.mp3' });
  }

  function runSentence(ctx, L) {
    const rounds = L.sentences; let r = 0; const st = ctx.stage;
    ctx.setInstr('Tap each word that has an ending.', 'sentence');
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      const need = new Set(); const got = new Set();
      R.words.forEach((w, i) => { if (hasLessonEnd(w, L)) need.add(i); });
      const status = h('p', { class: 'status' }, 'Tap every word with the ending.');
      const grid = h('div', { class: 'choices' });
      R.words.forEach((w, i) => {
        const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorEnd(w));
        b.addEventListener('click', async () => {
          if (b.classList.contains('right') || b.classList.contains('tried')) return;
          say(w);
          if (need.has(i)) {
            b.classList.add('right'); got.add(i);
            if (got.size === need.size) { status.textContent = 'Yes. That is every one.'; await ding(); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
          } else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again. That word does not have the ending.'; await Snd.play(P('listenagain')); }
        });
        grid.append(b);
      });
      st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, R.text), grid, status));
      const spoken = R.words.map((w) => W(w));
      if (r === 0) IR.sayItem(ctx, P('sentence'), null).then(() => { if (ctx.scr.ok()) Snd.seq(spoken, 140); });
      else Snd.seq(spoken, 140);
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
      ctx.setInstr('Tap each new or heart word to hear it before the story.', 'heart');
      ctx.progress(0);
      ctx.setNextLabel('Listen to the story');
      const row = h('div', { class: 'hearts' }, ...words.map((it) => h('button', {
        class: 'heartchip' + (it.irregular ? '' : ' newchip'), type: 'button', onclick: (e) => {
          e.currentTarget.classList.add('seen'); seen.add(it.w); ctx.progress(seen.size / words.length);
          Snd.play(W(it.w));
          if (seen.size === words.length) done.classList.add('glow');
        }
      }, it.irregular ? h('span', { class: 'heartmark', 'aria-hidden': 'true' }, '\u2665') : h('span', { class: 'heartmark newmark', 'aria-hidden': 'true' }, '\u2605'), h('span', { class: 'word' }, it.w))));
      const done = h('button', { class: 'btn big primary', type: 'button', onclick: () => { Snd.stop(); showPages(); } }, 'Listen to the story', icon('next'));
      st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Heart words and new words'), row, h('p', { class: 'small heartnote' }, 'Hearts are irregular. Stars are new words in this story.'), h('div', { class: 'row center' }, done)));
      ctx.setBack(() => false);
      ctx.setNext(() => { Snd.stop(); showPages(); return true; });
      Snd.play(P('heart'));
    }
    function showPages() {
      p = 0; st.innerHTML = '';
      ctx.setInstr('Read the story. One page at a time.', 'listen');
      ctx.setNextLabel('Next');
      const pic = h('img', { class: 'panel', alt: '' });
      const sent = h('p', { class: 'sentence' });
      const label = h('p', { class: 'small' });
      const pageAudio = () => 'audio/' + L.key + '_s_' + (p + 1) + '.mp3';
      const replay = speakerBtn(() => Snd.play(pageAudio()), 'Hear this page'); replay.classList.add('huge');
      function show() {
        pic.src = pages[p].img; sent.textContent = pages[p].text;
        label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length;
        ctx.progress(p / pages.length);
        Snd.play(pageAudio());
      }
      const prev = h('button', { class: 'btn big', type: 'button', onclick: () => { if (p > 0) { p--; show(); } else if (words.length) showHeart(); } }, icon('back'), 'Previous page');
      const next = h('button', { class: 'btn big primary', type: 'button', onclick: () => { if (p < pages.length - 1) { p++; show(); } else ctx.finish(); } }, 'Next page', icon('next'));
      st.append(h('div', { class: 'activity story' }, h('div', { class: 'panelwrap' }, pic), h('div', { class: 'sentrow' }, replay, sent), label, h('div', { class: 'row center' }, prev, next)));
      ctx.setBack(() => { if (p > 0) { p--; show(); return true; } if (words.length) { showHeart(); return true; } return false; });
      ctx.setNext(() => { if (p < pages.length - 1) { p++; show(); return true; } ctx.finish(); return true; });
      show();
    }
    if (words.length) showHeart(); else showPages();
  }

  function runRhyme(ctx, L) {
    const rounds = L.rhyme; let r = 0; const st = ctx.stage;
    ctx.setInstr('Which word rhymes with this?', 'rhymewhich');
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); if (ctx.count) ctx.count(r + 1, rounds.length); st.innerHTML = '';
      let locked = false;
      const status = h('p', { class: 'status' }, 'Call out 1, 2, or 3.');
      const spk = speakerBtn(() => say(R.prompt), 'Hear the word'); spk.classList.add('huge');
      const grid = choiceGrid(R.choices.slice(), async (w, b) => {
        if (locked || b.classList.contains('tried')) return;
        if (w === R.answer) { locked = true; b.classList.add('right'); status.textContent = 'Yes! ' + w + ' rhymes with ' + R.prompt + '.'; await ding(w); if (!ctx.scr.ok()) return; r++; if (r >= rounds.length) ctx.finish(); else round(); }
        else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again.'; await Snd.seq([P('listenagain'), W(R.prompt)], 160); }
      }, 'three');
      st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Which word rhymes with ' + R.prompt + '?'), spk, grid, status));
      IR.sayItem(ctx, P('rhymewhich'), W(R.prompt));
    }
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    round();
  }

  function runFish(ctx, L) {
    const fish = shuffle(L.fishYes.map((w) => ({ w, yes: true })).concat(L.fishNo.map((w) => ({ w, yes: false }))));
    const need = L.fishYes.length; let caught = 0; const st = ctx.stage;
    ctx.setInstr('Tap the fish whose word has the ending.', 'fish');
    const status = h('p', { class: 'status' }, 'Caught 0 of ' + need + '.');
    const pond = h('div', { class: 'choices three' });
    fish.forEach((f) => {
      const b = h('button', { class: 'choice', type: 'button', 'data-w': f.w }, colorEnd(f.w));
      b.addEventListener('click', async () => {
        if (b.classList.contains('right') || b.classList.contains('tried')) return;
        if (f.yes) { b.classList.add('right'); caught++; status.textContent = 'Yes! Caught ' + caught + ' of ' + need + '.'; ctx.progress(caught / need); await ding(f.w); if (caught >= need && ctx.scr.ok()) ctx.finish(); }
        else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Listen again. That fish does not have the ending.'; await Snd.play(P('listenagain')); }
      });
      pond.append(b);
    });
    if (ctx.count) ctx.count(1, need);
    st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Fish Pond'), pond, status));
    IR.sayItem(ctx, P('fish'), null);
  }

  function runCheck(ctx, L) {
    const items = L.check; let q = 0; const recs = []; const st = ctx.stage; let tok = 0;
    function finish() {
      const score = recs.filter(Boolean).length;
      const S = IR.S(); S[L.key + 'Check'] = { last: score, at: Date.now() }; IR.save();
      location.hash = '#/u6/' + L.key + '/result';
    }
    function step() {
      if (q >= items.length) return finish();
      const it = items[q]; const my = ++tok; ctx.progress(q / items.length); st.innerHTML = '';
      const cat = IR.catCount(items, q, (x) => x.type || 'q'); if (ctx.count) ctx.count(cat.i, cat.n);
      let locked = false;
      const status = h('p', { class: 'status' }, 'Question ' + (q + 1) + ' of ' + items.length);
      const ans = async (ok, b) => {
        if (locked) return; locked = true; recs[q] = !!ok; b.classList.add(ok ? 'right' : 'tried');
        status.textContent = 'Thank you.'; await sleep(500); if (!ctx.scr.ok() || my !== tok) return; q++; step();
      };
      let body;
      if (it.type === 'pick') {
        ctx.setInstr('Tap the word you hear.', 'tapword');
        body = h('div', { class: 'activity' }, speakerBtn(() => say(it.word), 'Hear the word'), choiceGrid(shuffle(it.choices), (w, b) => ans(w === it.word, b)), status);
        IR.sayItem(ctx, P('tapword'), W(it.word));
      } else if (it.type === 'sound') {
        ctx.setInstr('Which word has this ending?', 'whichending');
        body = h('div', { class: 'activity' }, speakerBtn(() => Snd.play(SND(it.sound)), 'Hear the ending'), choiceGrid(shuffle(it.choices), (w, b) => ans(w === it.answer, b)), status);
        IR.sayItem(ctx, P('whichending'), SND(it.sound));
      } else {
        ctx.setInstr('Finish the word.', 'finish');
        const grid = h('div', { class: 'choices two' });
        it.choices.forEach((e) => {
          const b = h('button', { class: 'choice', type: 'button', 'data-w': e }, LAB[e] || e);
          b.addEventListener('click', () => ans(e === it.answer, b));
          grid.append(b);
        });
        body = h('div', { class: 'activity' }, h('p', { class: 'bigword' }, colorEnd(it.base), ' + ?'), grid, status);
        IR.sayItem(ctx, P('finish'), null);
      }
      st.append(body);
    }
    ctx.setNext(() => { if (q < items.length - 1) { q++; step(); return true; } return false; });
    ctx.setBack(() => { if (q > 0) { q--; step(); return true; } return false; });
    step();
  }

  function resultPage(app, L) {
    IR.newScreen(); const S = IR.S(); const score = (S[L.key + 'Check'] && S[L.key + 'Check'].last) || 0;
    const wrap = h('div', { class: 'result' });
    const back = h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/u6/' + L.key; } }, icon('back'), 'Back to the lesson');
    const again = h('button', { class: 'btn big next', type: 'button', onclick: () => { location.hash = '#/u6/' + L.key + '/check'; } }, 'Try the check again');
    const home = h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = '#/home'; } }, 'See the sky map');
    if (score >= 9) wrap.append(h('h1', null, 'Move on'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10.'));
    else if (score >= 7) wrap.append(h('h1', null, 'Review'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. Practice Hear and Pick or Fish Pond, then try the check again.'));
    else wrap.append(h('img', { class: 'char zip big', src: 'img/zipA.webp', alt: 'Zip' }), h('h1', null, 'Re-teach'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. A grown-up can teach this ending again, then try the check again.'));
    wrap.append(h('div', { class: 'row' }, score >= 9 ? home : again, back));
    if (score >= 7) wrap.prepend(IR.celebration(score >= 9));
    app.append(h('div', { class: 'screen resultscreen' }, h('div', { class: 'unitbar' }, IR.ui.homeButton()), wrap));
    Snd.play(score >= 9 ? A.sfx.gong : A.sfx.done);
  }

  const LIGHT = {};
  function lights(key) { try { return JSON.parse(sessionStorage.getItem('ir_sess_' + key) || '{}'); } catch (e) { return {}; } }
  function mark(key, id) { const L = lights(key); L[id] = 1; sessionStorage.setItem('ir_sess_' + key, JSON.stringify(L)); }

  function lessonMenu(app, L) {
    const STEPS = stepsFor(L);
    const prev = IR._u6HashWas || '';
    if (!new RegExp('^#/u6/' + L.key + '(/|$)').test(prev)) sessionStorage.removeItem('ir_sess_' + L.key);
    IR.newScreen();
    const items = STEPS.map((s) => ({ id: s.id, title: s.title, group: s.group, href: '#/u6/' + L.key + '/' + s.id, done: !!(lights(L.key)[s.id]), min: s.id === 'read' ? 6 : s.id === 'check' ? 4 : s.id === 'meet' ? 4 : 3 }));
    items.filter((r) => r.group === 'activities').forEach((r, k) => { r.act = k + 1; });
    const nx = items.find((r) => !r.done) || null;
    const star = (on) => h('span', { class: 'sstar' + (on ? ' on' : '') }, icon(on ? 'star' : 'starOutline'));
    const go = (r) => () => { Snd.stop(); location.hash = r.href; };
    /* Same two boxes as Unit 4: Lesson on the left, Story on the right. */
    const actFlags = items.filter((r) => r.group === 'activities').map((r) => !!r.done);
    const big = (r) => IR.pairCard({
      lesson: r.group === 'lesson',
      title: r.title,
      min: r.min,
      href: r.href,
      img: r.group === 'lesson' ? IR.lessonArt : IR.storyCovers[L.n],
      alt: r.group === 'lesson' ? IR.lessonArtAlt : r.title,
      done: r.done,
      next: nx && nx.id === r.id,
      flags: actFlags
    });
    const row = (r) => h('li', null, h('button', { class: 'stopcard arow gamestop' + (r.done ? ' done' : '') + (nx && nx.id === r.id ? ' nextup' : ''), type: 'button', 'data-id': r.id, onclick: go(r) },
      h('span', { class: 'snum' }, String(r.act)), h('span', { class: 'stxt' }, h('b', null, r.title), TIPS[r.id] ? h('span', { class: 'sblurb' }, TIPS[r.id]) : null),
      h('span', { class: 'sside' }, star(r.done))));
    const meet = items.filter((r) => r.group !== 'activities')[0];
    const story = { id: 'read', title: L.storyTitle, group: 'story', href: '#/u6/' + L.key + '/read', done: !!(lights(L.key).read), min: 6 };
    const left = h('ul', { class: 'uA-left' }, big(meet), big(story));
    const right = h('section', { class: 'uA-right' }, h('h2', { class: 'uA-h' }, 'Activities'), h('ol', { class: 'stoplist uA-acts' }, ...items.filter((r) => r.group === 'activities').map(row)),
      h('p', { class: 'small' }, GROWN));
    app.append(h('div', { class: 'screen trailscreen unitpage unitA' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 6 \u00b7 Lesson ' + L.n + ' \u00b7 '), L.name),
        h('button', { class: 'btn', type: 'button', onclick: () => { location.hash = '#/u6'; } }, 'All lessons'), IR.ui.gearButton()),
      h('main', { class: 'uA-main' }, left, right)));
  }

  function picker(app) {
    IR.newScreen();
    const cards = PACK.lessons.flatMap((L) => {
      const flags = stepsFor(L).filter((s) => s.group === 'activities').map((s) => !!(lights(L.key)[s.id] || IR.isDone(L.key + '_' + s.id)));
      const lesson = IR.pairCard({
        lesson: true, kicker: 'Lesson ' + L.n, title: L.name, href: '#/u6/' + L.key,
        img: IR.lessonArt, alt: IR.lessonArtAlt, flags: flags
      });
      const story = IR.pairCard({
        lesson: false, title: L.storyTitle, min: 6, href: '#/u6/' + L.key + '/read',
        img: IR.storyCovers[L.n], alt: L.storyTitle
      });
      return [lesson, story];
    });
    app.append(h('div', { class: 'screen trailscreen unitpage unitA' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 6 \u00b7 '), 'Endings'), IR.ui.gearButton()),
      h('main', { class: 'uA-main' }, h('ul', { class: 'uA-left' }, ...cards),
        h('section', { class: 'uA-right' }, h('h2', { class: 'uA-h' }, 'Three lessons'), h('p', null, '6.1 is -s and -es. 6.2 is -ed. 6.3 is -ing. Each lesson has ten activities. Zip\u2019s Check is last.'), h('p', { class: 'small' }, GROWN)))));
  }

  function stepScreen(app, L, idx) {
    const STEPS = stepsFor(L);
    const S0 = STEPS[idx]; const scr = IR.newScreen(); let mistakes = 0;
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill);
    const instrBox = h('div', { class: 'instr' }); const stage = h('div', { class: 'stage' });
    let backH = null, nextH = null;
    const base = '#/u6/' + L.key;
    const ctx = {
      scr, stage, miss() { mistakes++; },
      progress(f) { fill.style.width = Math.round(((idx + Math.max(0, Math.min(1, f))) / STEPS.length) * 100) + '%'; },
      setInstr(text, p) { instrBox.innerHTML = ''; if (!text) { instrBox.style.display = 'none'; return; } instrBox.style.display = ''; instrBox.append(speakerBtn(() => { if (p) Snd.play(P(p)); }, 'Hear the directions'), h('span', { class: 'itext' }, text)); },
      setBack(fn) { backH = fn; }, setNext(fn) { nextH = fn; },
      setNextLabel(t) { if (nextBtn.firstChild) nextBtn.firstChild.textContent = t; },
      goBack() { Snd.stop(); if (backH && backH()) return; location.hash = idx > 0 ? base + '/' + STEPS[idx - 1].id : base; },
      goNext() { Snd.stop(); if (nextH && nextH()) return; location.hash = idx < STEPS.length - 1 ? base + '/' + STEPS[idx + 1].id : base; },
      finish() { mark(L.key, S0.id); IR.recordActivity(L.key + '_' + S0.id, mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1); IR.save(); location.hash = base; }
    };
    const nextBtn = h('button', { class: 'btn big next', type: 'button', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' },
      h('button', { class: 'btn big back', type: 'button', onclick: () => ctx.goBack() }, icon('back'), 'Back'),
      nextBtn);
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the lesson', onclick: () => { location.hash = base; } }, icon('close'));
    const screen = h('div', { class: 'screen lessonscreen u6step' + (S0.group === 'lesson' ? ' is-lesson' : ''), style: '--c:' + S0.color }, h('header', { class: 'lesson-top' }, x, bar, IR.ui.homeButton(), IR.ui.gearButton()), instrBox, stage, nav);
    app.append(screen);
    if (S0.group === 'activities') IR.attachGameRules(ctx, screen, S0.title);
    S0.run(ctx);
  }

  IR.u6Route = function (hash, app) {
    IR._u6HashWas = hash;
    if (hash === '#/u6' || hash === '#/u6/') { picker(app); return true; }
    const lesson = /^#\/u6\/(u61|u62|u63)(?:\/(.*))?$/.exec(hash);
    if (!lesson) return false;
    const L = PACK.lessons.filter((x) => x.key === lesson[1])[0];
    if (!L) return false;
    const rest = lesson[2] || '';
    if (!rest) { lessonMenu(app, L); return true; }
    if (rest === 'result') { resultPage(app, L); return true; }
    const STEPS = stepsFor(L);
    const i = STEPS.findIndex((s) => s.id === rest);
    if (i < 0) return false;
    stepScreen(app, L, i);
    return true;
  };
})();
