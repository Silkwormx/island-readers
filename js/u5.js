/* Unit 5 · Silent e (Nov 3 2026, local build). Own routes: #/u5 (unit menu), #/u5/<lesson>/<act>, #/u5/teach/<lesson>,
   #/u5/story, #/u5/check, #/u5/review. Story: The Silent Tide (Brick and Dash, the Bell Keepers, with Zip and Frill).
   Word audio uses the device voice (speechSynthesis) until recorded audio is made. All words and text are original. */
(function () {
  'use strict';
  const IR = window.IR; if (!IR) return;
  const { h, $$, sleep, shuffle, icon, Snd } = IR;
  const BELL = '#E8B90C';   /* Unit 5 bell: yellow */
  const speak = (t) => { try { Snd.stop(); speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = 0.8; speechSynthesis.speak(u); } catch (e) {} };
  const spk = (t, label) => h('button', { class: 'speaker u5spk', type: 'button', 'aria-label': label || 'Hear it', onclick: () => speak(typeof t === 'function' ? t() : t) }, icon('speaker'));
  /* colour the vowel and the silent e of a VCe word */
  function vce(w) {
    const m = /([aeiou])([^aeiou]{1,2})e(s?)$/.exec(w); if (!m) return document.createTextNode(w);
    return h('span', { class: 'vce' }, w.slice(0, m.index), h('b', { class: 'u5v' }, m[1]), m[2], h('b', { class: 'u5e' }, 'e'), m[3]);
  }
  const PIC = { cake: '\u{1F382}', kite: '\u{1FA81}', bone: '\u{1F9B4}', cube: '\u{1F9CA}', rose: '\u{1F339}', snake: '\u{1F40D}', pine: '\u{1F332}', cone: '\u{1F366}', home: '\u{1F3E0}', nose: '\u{1F443}', bike: '\u{1F6B2}', smile: '\u{1F603}', plate: '\u{1F37D}\uFE0F', grape: '\u{1F347}', skate: '\u26F8\uFE0F', wave: '\u{1F30A}', globe: '\u{1F30D}', stone: '\u{1FAA8}', five: '5', nine: '9', glove: '\u{1F9E4}', dove: '\u{1F54A}\uFE0F', game: '\u{1F3B2}', hive: '\u{1F41D}', cap: '\u{1F9E2}', can: '\u{1F96B}', pin: '\u{1F4CC}' };
  const pic = (w) => h('span', { class: 'u5pic', 'aria-hidden': 'true' }, PIC[w] || '');

  /* ---------- lessons (22-unit plan: 5.1 #57, 5.2 #59, 5.3 #62) ---------- */
  const L = [
    { id: 'l1', n: '5.1', title: 'Silent e: e_e', sound: 'e_e', sheet: '#57',
      rule: 'When e comes at the end after one consonant, it is silent. It makes the first e say its name: /ē/.',
      words: ['Pete', 'these', 'theme', 'Steve', 'eve', 'Zeke'],
      acts: [
        { k: 'magic', t: 'Add the e', items: [['pet', 'Pete'], ['them', 'theme'], ['Zek', 'Zeke'], ['Stev', 'Steve']] },
        { k: 'sort', t: 'Short or long?', bins: ['short e', 'long e (e_e)'], items: [['pet', 0], ['Pete', 1], ['them', 0], ['theme', 1], ['step', 0], ['these', 1], ['bed', 0], ['Steve', 1]] },
        { k: 'scramble', t: 'Scrambled Letters', items: ['these', 'Pete', 'theme', 'Steve'] },
        { k: 'fill', t: 'Sentence Bridge', items: [['___ ants fix bells.', 'These', ['These', 'Them', 'Then']], ['Pete has a big ___ for the club.', 'theme', ['them', 'theme', 'then']], ['Steve and ___ swim.', 'Pete', ['pet', 'Pete', 'pen']]] }
      ] },
    { id: 'l2', n: '5.2', title: 'Silent e: a_e, i_e, o_e, u_e', sound: 'a_e i_e o_e u_e', sheet: '#59',
      rule: 'Silent e jumps over one consonant and makes the vowel before it say its name: cap \u2192 cape, kit \u2192 kite, hop \u2192 hope, cub \u2192 cube.',
      words: ['cake', 'kite', 'bone', 'cube', 'snake', 'pine', 'rope', 'cute', 'plate', 'smile', 'stone', 'mule'],
      acts: [
        { k: 'match', t: 'Picture Match', items: [['cake', ['cake', 'cap', 'cane']], ['kite', ['kit', 'kite', 'bike']], ['bone', ['bone', 'bin', 'cone']], ['cube', ['cub', 'cube', 'tube']], ['snake', ['snack', 'snake', 'shake']], ['pine', ['pin', 'pine', 'spine']], ['nose', ['nose', 'nod', 'rose']], ['grape', ['grab', 'grape', 'gate']]] },
        { k: 'missing', t: 'Missing Letters', items: [['cake', 'c_ke', 'a'], ['kite', 'k_te', 'i'], ['bone', 'b_ne', 'o'], ['cube', 'c_be', 'u'], ['home', 'h_me', 'o'], ['five', 'f_ve', 'i'], ['wave', 'w_ve', 'a'], ['globe', 'gl_be', 'o']] },
        { k: 'magic', t: 'Add the e', items: [['cap', 'cape'], ['kit', 'kite'], ['hop', 'hope'], ['cub', 'cube'], ['tap', 'tape'], ['pin', 'pine'], ['not', 'note'], ['cut', 'cute']] },
        { k: 'sort', t: 'Word Sort', bins: ['short vowel', 'long vowel (silent e)'], items: [['cap', 0], ['cape', 1], ['slid', 0], ['slide', 1], ['rob', 0], ['robe', 1], ['tub', 0], ['tube', 1], ['plan', 0], ['plane', 1]] },
        { k: 'chain', t: 'Word Chains', items: [['tap', 'tape', 'Add e.'], ['tape', 'cape', 'Change t to c.'], ['cape', 'cane', 'Change p to n.'], ['cane', 'cone', 'Change a to o.'], ['cone', 'bone', 'Change c to b.'], ['bone', 'bon', 'Take off e.']], fix: { bon: 'bone' } },
        { k: 'draw', t: 'Read and Draw', items: [['A snake is on a rock.', 'snake', ['snake', 'cake', 'kite']], ['Dash has a kite.', 'kite', ['bike', 'kite', 'bone']], ['The cake is on a plate.', 'cake', ['cake', 'cube', 'rose']], ['A bone is in the dish.', 'bone', ['stone', 'bone', 'nose']]] }
      ] },
    { id: 'l3', n: '5.3', title: 'Silent e: tricky words', sound: 've \u00b7 o_e as /u/', sheet: '#62',
      rule: 'English words do not end in v, so an e is added: have, give, live. Here the e does not make the vowel long. Some words like come, some, done have a vowel that says /u/.',
      words: ['have', 'give', 'live', 'love', 'glove', 'come', 'some', 'done'],
      acts: [
        { k: 'sort', t: 'Long or tricky?', bins: ['long vowel (rule)', 'tricky (no long vowel)'], items: [['cake', 0], ['have', 1], ['five', 0], ['give', 1], ['hope', 0], ['come', 1], ['bike', 0], ['love', 1], ['bone', 0], ['done', 1]] },
        { k: 'match', t: 'Picture Match', items: [['glove', ['globe', 'glove', 'gave']], ['dove', ['dive', 'dove', 'done']], ['hive', ['have', 'hive', 'hike']], ['five', ['five', 'fine', 'give']]] },
        { k: 'fill', t: 'Sentence Bridge', items: [['I ___ a red cap.', 'have', ['have', 'hive', 'hav']], ['Brick, ___ me the rope.', 'give', ['give', 'gave', 'five']], ['Brick is ___ with the bell.', 'done', ['done', 'dune', 'dine']], ['___ and fix the bell!', 'Come', ['Come', 'Cone', 'Came']]] }
      ] }
  ];
  /* ---------- story: decodable (Units 1-5 + heart words the, a, to, says, I) ---------- */
  const STORY = [
    ['img/u5_p1.webp', 'Brick and Dash hike up to the next bell. Zip and Frill hike with them. The Hush is thick on the cliff.'],
    ['img/u5_p1.webp', 'The bell hangs on a pine. It is still. Dash taps it. Clunk! It rings a sad, flat tone.'],
    ['img/u5_p2.webp', 'Zip spots a crack in the rim. \u201cThe bell lost its e!\u201d says Brick. \u201cIt rings tap, not tape. It rings kit, not kite.\u201d'],
    ['img/u5_p3.webp', '\u201cBad tones can wake the vast thing in the tide,\u201d says Dash. Then the rocks shake. A vast shape lifts its fin!'],
    ['img/u5_p4.webp', '\u201cFast! Fix it!\u201d says Frill. Brick files the crack. Zip and Frill hang the bell on the pine with a rope.'],
    ['img/u5_p4.webp', '\u201cRing it, Dash!\u201d says Brick. Dash bangs the bell with a stick. Bong! The bell rings a fine, rich tone. Tape! Kite! Cone! Cute!'],
    ['img/u5_p4.webp', 'The Hush drifts off the cliff. The vast shape sinks back in the tide to rest. \u201cFive bells ring!\u201d says Dash. Brick grins. \u201cNext bell!\u201d']
  ];
  /* ---------- end-of-unit check: 10 items, read the word and pick the picture / word ---------- */
  const CHECK = [
    ['Which word says cape?', 'cape', ['cap', 'cape', 'cope']], ['Which word says kite?', 'kite', ['kit', 'kite', 'cute']],
    ['Which word says hope?', 'hope', ['hop', 'hope', 'hip']], ['Which word says cube?', 'cube', ['cub', 'cube', 'cab']],
    ['Which word says these?', 'these', ['this', 'these', 'those']], ['Which word says snake?', 'snake', ['snack', 'snake', 'stake']],
    ['Which word says slide?', 'slide', ['slid', 'slide', 'sled']], ['Which word says stone?', 'stone', ['stone', 'stun', 'stem']],
    ['Which word says give?', 'give', ['give', 'gave', 'gift']], ['Which word says come?', 'come', ['came', 'come', 'cone']]
  ];
  /* ---------- 10-minute scripted lessons ---------- */
  const SCRIPT = {
    l1: { review: 'Quick review (1 min): read pet, step, them, bed. Short e.', ido: ['Write pet. Read it: /p/ /e/ /t/, pet.', 'Add e to make Pete. Say: \u201cThe e at the end is silent. It jumps back over the t and makes the e say its name, /\u0113/. Pete.\u201d', 'Draw a loop from the end e back to the first e.'],
      wedo: ['Together: them \u2192 theme, Zek \u2192 Zeke. Child taps the vowel, then the silent e, then reads.', 'Read together: these, Steve, eve.'], youdo: ['Child reads alone: Pete, these, theme, Steve, step, them.', 'Child spells on paper: these, Pete.'],
      fix: ['Child reads Pete as pet: cover the e, read pet; uncover it and ask \u201cWhat does the e tell the vowel to do?\u201d', 'Child says the e at the end: \u201cThis e is silent. It only works, it never talks.\u201d', 'Child guesses: point under each letter and blend again, slowly.'] },
    l2: { review: 'Quick review (1 min): read cap, kit, hop, cub, then Pete, these.', ido: ['Write cap, kit, hop, cub in a row. Read each one.', 'Add e to each: cape, kite, hope, cube. Model: \u201cVowel, one consonant, e. The e is silent and the vowel says its name.\u201d', 'Mark each one: vowel with a long line on top, e crossed out lightly.'],
      wedo: ['Together read pairs: tap/tape, pin/pine, not/note, cut/cute.', 'Sort 8 word cards into short and long piles.'], youdo: ['Child reads: cake, bike, bone, mule, snake, smile, stone, plate.', 'Dictation: kite, cube, rope, game.'],
      fix: ['Reads kite as kit: \u201cLook at the end first. Is there an e? Then the vowel says its name.\u201d', 'Reads cute as cut-e (two beats): \u201cThe e is silent, one beat.\u201d Tap once.', 'Spells cake as cak: say \u201cDo you hear the long a? Long a here needs a silent e.\u201d'] },
    l3: { review: 'Quick review (1 min): read cake, kite, hope, cube, these.', ido: ['Write have, give, live. Say: \u201cEnglish words do not end in v. The e is there to keep v company. It does not make the vowel long.\u201d', 'Write come, some, done. Say: \u201cIn these, o says /u/. We learn them as tricky words.\u201d'],
      wedo: ['Sort cards: rule words (five, bike, hope) and tricky words (give, have, come).', 'Read together: love, glove, done.'], youdo: ['Child reads: have, give, love, come, some, done, five, hive.', 'Child writes one sentence with have or give.'],
      fix: ['Reads give as /g\u012bv/: \u201cThat is a real word? Try the short sound. Which makes sense?\u201d (flex the vowel).', 'Reads come as /k\u014dm/: \u201cThis is a tricky one. o says /u/ here.\u201d Add it to the tricky word ring.', 'Mixes hive and have: compare them side by side; hive follows the rule.'] }
  };

  /* ---------- progress ---------- */
  const pid = (a, b) => 'u5_' + a + (b != null ? '_' + b : '');
  const lessonDone = (l) => l.acts.every((_, i) => IR.isDone(pid(l.id, i)));
  IR.u5Progress = () => { const ids = []; L.forEach((l) => l.acts.forEach((_, i) => ids.push(pid(l.id, i)))); ids.push(pid('story'), pid('check')); return { total: ids.length, done: ids.filter(IR.isDone).length }; };

  /* ---------- shells ---------- */
  function top(back, title) {
    return h('header', { class: 'u5top' }, h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back', onclick: () => { location.hash = back; } }, icon('back')),
      h('h1', { class: 'u5title' }, title), IR.ui.homeButton());
  }
  function done(app, title, stars, back, next) {
    IR.recordActivity(title.id, stars); IR.touchStreak && IR.touchStreak(); IR.save && IR.save();
    app.append(h('div', { class: 'complete' }, h('div', { class: 'cbox' }, IR.celebration ? IR.celebration(false) : null, h('h1', null, 'Great job!'), h('p', { class: 'lead' }, title.t),
      h('div', { class: 'bigstars', 'aria-label': stars + ' stars' }, ...[1, 2, 3].map((k) => icon(k <= stars ? 'star' : 'starOutline', (k <= stars ? 'on' : 'off') + ' k' + k))),
      h('div', { class: 'row' }, h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = back; } }, icon('back'), 'Back'),
        next ? h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = next[0]; } }, next[1], icon('next')) : null))));
    try { Snd.play(IR.A.sfx.done); } catch (e) {}
  }
  const starsFor = (m) => m <= 1 ? 3 : m <= 3 ? 2 : 1;

  /* ---------- unit menu ---------- */
  function menu(app) {
    IR.newScreen(); const P = IR.u5Progress();
    const card = (l) => h('section', { class: 'u5lesson' + (lessonDone(l) ? ' done' : '') },
      h('h2', null, h('span', { class: 'u5num' }, 'Lesson ' + l.n), ' ', l.title),
      h('p', { class: 'u5rule' }, l.rule),
      h('p', { class: 'u5words' }, ...l.words.slice(0, 8).map((w) => h('span', null, vce(w)))),
      h('ol', { class: 'u5acts' }, ...l.acts.map((a, i) => h('li', null, h('a', { class: 'u5act' + (IR.isDone(pid(l.id, i)) ? ' done' : ''), href: '#/u5/' + l.id + '/' + i },
        h('span', { class: 'snum' }, String(i + 1)), h('b', null, a.t), h('span', { class: 'sstar' + (IR.isDone(pid(l.id, i)) ? ' on' : '') }, icon(IR.isDone(pid(l.id, i)) ? 'star' : 'starOutline')))))),
      h('a', { class: 'u5teach', href: '#/u5/teach/' + l.id }, 'For grown-ups: 10-minute lesson ' + l.n));
    app.append(h('div', { class: 'screen u5screen' }, top('#/home', 'Unit 5 \u00b7 Silent e'),
      h('div', { class: 'u5intro' }, h('span', { class: 'u5bell', 'aria-hidden': 'true' }), h('p', null, 'The yellow bell is cracked! Help Brick and Dash fix it by learning silent e.'), h('span', { class: 'u5count' }, P.done + ' of ' + P.total + ' stars')),
      h('main', { class: 'u5main' },
        h('a', { class: 'u5story', href: '#/u5/story' }, h('img', { src: 'img/u5_p2.webp', alt: '' }), h('span', null, h('small', null, 'Story'), h('b', null, 'The Silent Tide: The Bell on the Pine'), IR.isDone(pid('story')) ? h('em', null, 'Read again') : null)),
        ...L.map(card),
        h('div', { class: 'u5end' },
          h('a', { class: 'btn big u5chk', href: '#/u5/check' }, 'Bell Check (10 words)'),
          h('a', { class: 'btn big', href: '#/u5/review' }, 'Unit 5 Review')))));
  }

  /* ---------- activity engine ---------- */
  function activity(app, lid, ai) {
    const l = L.find((x) => x.id === lid); const A = l && l.acts[ai]; if (!A) { location.hash = '#/u5'; return; }
    const scr = IR.newScreen(); let r = 0, miss = 0; const stage = h('div', { class: 'u5stage' }); const instr = h('p', { class: 'instr u5instr' });
    const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill);
    const items = A.k === 'sort' ? shuffle(A.items) : A.items;
    const prog = () => { fill.style.width = Math.round(r / items.length * 100) + '%'; };
    const next = async () => { await sleep(650); if (!scr.ok()) return; r++; if (r >= items.length) { fill.style.width = '100%'; const nx = l.acts[ai + 1]; done(app, { id: pid(lid, ai), t: 'Lesson ' + l.n + ': ' + A.t }, starsFor(miss), '#/u5', nx ? ['#/u5/' + lid + '/' + (ai + 1), 'Next: ' + nx.t] : null); } else round(); };
    const wrong = (b) => { miss++; b.classList.add('tried'); status.textContent = 'Not yet. Look again, sound it out slowly.'; try { Snd.play(IR.A.sfx.tryagain); } catch (e) {} };
    const right = (b, w) => { b.classList.add('right'); status.textContent = 'Yes! ' + w; speak(w); next(); };
    const choices = (opts, ans, show) => h('div', { class: 'choices' }, ...shuffle(opts).map((o) => { const b = h('button', { class: 'choice', type: 'button' }, show ? show(o) : vce(o)); b.addEventListener('click', () => { if (b.classList.contains('tried') || stage.querySelector('.right')) return; o === ans ? right(b, o) : wrong(b); }); return b; }));
    function round() {
      prog(); stage.innerHTML = ''; status.textContent = '\u00a0'; const it = items[r];
      if (A.k === 'match') { instr.textContent = 'Look at the picture. Read the words. Tap the word that matches.'; stage.append(h('div', { class: 'u5card' }, pic(it[0])), choices(it[1], it[0])); }
      else if (A.k === 'missing') { instr.textContent = 'What vowel is missing? Tap it.'; stage.append(h('div', { class: 'u5card' }, pic(it[0]), h('span', { class: 'bigword' }, it[1].replace('_', '\u25A2'))), choices(['a', 'i', 'o', 'u'], it[2], (o) => o)); }
      else if (A.k === 'magic') { instr.textContent = 'Read the word. Tap the e to add it. Read the new word.'; const word = h('span', { class: 'bigword' }, it[0]);
        const eb = h('button', { class: 'btn big u5addE', type: 'button' }, '+ e'); eb.addEventListener('click', () => { word.innerHTML = ''; word.append(vce(it[1])); eb.disabled = true; status.textContent = it[0] + ' \u2192 ' + it[1]; speak(it[1]); next(); });
        stage.append(h('div', { class: 'u5card' }, word, spk(it[0], 'Hear ' + it[0])), h('div', { class: 'row center' }, eb)); }
      else if (A.k === 'sort') { instr.textContent = 'Read the word. Which group does it go in?'; stage.append(h('div', { class: 'u5card' }, h('span', { class: 'bigword' }, it[0]), spk(it[0])),
        h('div', { class: 'u5bins' }, ...A.bins.map((bn, i) => { const b = h('button', { class: 'choice u5bin', type: 'button' }, bn); b.addEventListener('click', () => { if (b.classList.contains('tried') || stage.querySelector('.right')) return; i === it[1] ? right(b, it[0]) : wrong(b); }); return b; }))); }
      else if (A.k === 'scramble') { instr.textContent = 'Tap the letters in order to build the word.'; const w = it; let built = ''; const out = h('span', { class: 'bigword u5built' }, '\u00a0');
        const bank = h('div', { class: 'bank' }, ...shuffle(w.split('').map((c, i) => [c, i])).map(([c]) => { const b = h('button', { class: 'wtile', type: 'button' }, c); b.addEventListener('click', () => { if (b.disabled) return; if (c === w[built.length]) { built += c; b.disabled = true; out.textContent = built; if (built === w) { status.textContent = 'Yes! ' + w; speak(w); next(); } } else { miss++; status.textContent = 'Not yet. What sound comes next?'; } }); return b; }));
        stage.append(h('div', { class: 'u5card' }, spk(w, 'Hear the word'), out), bank); }
      else if (A.k === 'chain') { instr.textContent = it[2] + ' Which word do you make?'; const ans = it[1]; const pool = Array.from(new Set([ans, it[0], ...L[1].words.slice(0, 6)])).filter((x) => x !== ans).slice(0, 2);
        stage.append(h('div', { class: 'u5card' }, h('span', { class: 'bigword' }, vce(it[0])), h('span', { class: 'u5arrow' }, '\u2192'), h('span', { class: 'bigword' }, '?')), choices([ans, ...pool], ans)); }
      else if (A.k === 'fill') { instr.textContent = 'Read the sentence. Tap the word that fits.'; stage.append(h('div', { class: 'u5card u5sent' }, it[0].replace('___', '______')), choices(it[2], it[1])); }
      else if (A.k === 'draw') { instr.textContent = 'Read the sentence. Tap the picture that shows it. Then draw it on paper!'; stage.append(h('div', { class: 'u5card u5sent' }, it[0]), choices(it[2], it[1], (o) => h('span', { class: 'u5pic' }, PIC[o]))); }
      stage.querySelectorAll('.choice').forEach((b) => b.setAttribute('aria-label', b.textContent || 'picture'));
    }
    app.append(h('div', { class: 'screen u5screen u5act-' + A.k, style: '--c:' + BELL }, top('#/u5', 'Lesson ' + l.n + ' \u00b7 ' + A.t), bar, instr, stage, status));
    round();
  }

  /* ---------- story ---------- */
  function story(app) {
    IR.newScreen(); let p = 0; const box = h('div', { class: 'u5page' });
    const show = () => { box.innerHTML = ''; const [img, t] = STORY[p];
      box.append(h('img', { class: 'u5pimg', src: img, alt: '' }), h('div', { class: 'u5ptxt' }, h('p', null, t), spk(t, 'Read this page to me')),
        h('div', { class: 'lesson-nav' }, h('button', { class: 'btn big back', type: 'button', disabled: p === 0, onclick: () => { p--; show(); } }, icon('back'), 'Back'),
          h('span', { class: 'u5pn' }, (p + 1) + ' / ' + STORY.length),
          h('button', { class: 'btn big next', type: 'button', onclick: () => { if (p < STORY.length - 1) { p++; show(); } else done(app, { id: pid('story'), t: 'The Silent Tide: The Bell on the Pine' }, 3, '#/u5', ['#/u5/check', 'Bell Check']); } }, p < STORY.length - 1 ? 'Next' : 'Finish', icon('next')))); };
    app.append(h('div', { class: 'screen u5screen u5storyscr' }, top('#/u5', 'The Silent Tide \u00b7 The Bell on the Pine'), box)); show();
  }

  /* ---------- check / review ---------- */
  function check(app, review) {
    const scr = IR.newScreen(); let r = 0, score = 0; const stage = h('div', { class: 'u5stage' });
    const items = review ? shuffle([].concat(CHECK.slice(0, 4), [['Which word says glove?', 'glove', ['globe', 'glove', 'gave']], ['Which word says theme?', 'theme', ['them', 'theme', 'then']], ['Which word says note?', 'note', ['not', 'note', 'nut']], ['Which word says mule?', 'mule', ['mule', 'mile', 'mud']], ['Which word says have?', 'have', ['have', 'hive', 'hav']], ['Which word says smile?', 'smile', ['smell', 'smile', 'small']]])) : CHECK;
    const fill = h('i'); const bar = h('div', { class: 'pbar' }, fill);
    const round = () => { fill.style.width = (r * 10) + '%'; stage.innerHTML = ''; const it = items[r];
      stage.append(h('p', { class: 'u5q' }, h('span', null, (r + 1) + ' of 10. ' + (review ? 'Listen, then tap the word.' : 'A grown-up reads the word. Tap it.')), spk(it[1], 'Hear the word')),
        h('div', { class: 'choices' }, ...shuffle(it[2]).map((o) => h('button', { class: 'choice', type: 'button', onclick: async (e) => { if (stage.dataset.lock) return; stage.dataset.lock = 1; if (o === it[1]) score++; e.currentTarget.classList.add('picked'); await sleep(350); if (!scr.ok()) return; delete stage.dataset.lock; r++; r < 10 ? round() : result(); } }, o)))); };
    const result = () => { fill.style.width = '100%'; IR.recordActivity(pid(review ? 'review' : 'check'), score >= 9 ? 3 : score >= 7 ? 2 : 1); stage.innerHTML = '';
      const msg = score >= 9 ? ['The bell rings true!', 'Move on to Unit 6.'] : score >= 7 ? ['Almost there!', 'Do the Unit 5 Review, then try again.'] : ['Let\u2019s fix it together.', 'Grown-up: re-teach Lessons 5.1 to 5.3 with the 10-minute lessons, then check again.'];
      stage.append(h('div', { class: 'u5card u5res' }, h('span', { class: 'u5bell big', 'aria-hidden': 'true' }), h('h2', null, score + ' of 10'), h('p', { class: 'lead' }, msg[0]), h('p', null, msg[1]),
        h('p', { class: 'small' }, 'Grown-ups: 9\u201310 move on \u00b7 7\u20138 review \u00b7 6 or below re-teach.'),
        h('div', { class: 'row' }, h('a', { class: 'btn big', href: '#/u5' }, 'Back to Unit 5'), score < 9 && !review ? h('a', { class: 'btn big primary', href: '#/u5/review' }, 'Unit 5 Review') : null))); };
    app.append(h('div', { class: 'screen u5screen' }, top('#/u5', review ? 'Unit 5 Review' : 'Bell Check \u00b7 Unit 5'), bar, stage)); round();
  }

  /* ---------- grown-up lesson script (printable) ---------- */
  function teach(app, lid) {
    IR.newScreen(); const l = L.find((x) => x.id === lid) || L[0]; const s = SCRIPT[l.id];
    const sec = (t, min, arr) => h('section', { class: 'u5ts' }, h('h2', null, t, h('small', null, ' \u00b7 ' + min)), h('ul', null, ...arr.map((x) => h('li', null, x))));
    app.append(h('div', { class: 'screen u5screen u5teachscr' }, top('#/u5', 'Lesson ' + l.n + ' \u00b7 10-minute lesson'),
      h('main', { class: 'u5tmain' }, h('h1', null, 'Lesson ' + l.n + ': ' + l.title), h('p', { class: 'u5rule' }, l.rule),
        h('p', null, h('b', null, 'Words: '), l.words.join(', ')), h('p', null, s.review),
        sec('I do', '3 min', s.ido), sec('We do', '3 min', s.wedo), sec('You do', '3 min', s.youdo), sec('If your reader gets stuck', 'error correction', s.fix),
        h('p', { class: 'small' }, 'Then play the Lesson ' + l.n + ' activities in the app (about 10 minutes). Keep it calm and short; stop while it is still fun.'),
        h('div', { class: 'row' }, h('button', { class: 'btn big', type: 'button', onclick: () => window.print() }, 'Print this lesson')))));
  }

  IR.u5Route = function (hash, app) {
    let m; if (!/^#\/u5(\/|$)/.test(hash)) return false;
    if ((m = /^#\/u5\/(l\d)\/(\d+)/.exec(hash))) activity(app, m[1], +m[2]);
    else if ((m = /^#\/u5\/teach\/(l\d)/.exec(hash))) teach(app, m[1]);
    else if (hash.startsWith('#/u5/story')) story(app);
    else if (hash.startsWith('#/u5/check')) check(app, false);
    else if (hash.startsWith('#/u5/review')) check(app, true);
    else menu(app);
    return true;
  };
  IR.u5 = { L, STORY, CHECK, SCRIPT };
})();
