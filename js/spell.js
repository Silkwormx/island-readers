/* Spelling for every lesson. Five steps unlock in order.
   A future unit calls IR.registerSpellLesson({ id, unit, n, name, focus, add, endings, magic, back, wordSrc, tip, spellWords }). */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR || !IR.spellPlan) return;
  const { h, shuffle, icon, Snd, A, speakerBtn } = IR;
  const STEPS = [
    { id: 'gap', title: 'Fill in the missing sound', line: 'Hear the word. Tap the missing sound.', prompt: 'gap' },
    { id: 'boxes', title: 'Sound boxes', line: 'Tap a box to hear its sound. Then fill each box.', prompt: 'boxes' },
    { id: 'tiles', title: 'Tap the tiles', line: 'Hear the word. Tap the tiles in order.', prompt: 'tiles' },
    { id: 'chain', title: 'Word chain', line: 'Change one sound to make the next word.', prompt: 'chain' },
    { id: 'pattern', title: 'Pattern hunt', line: 'Spell the words. Then tap the part that is the same.', prompt: 'pattern' }
  ];
  const extra = [];
  IR.registerSpellLesson = function (spec) { extra.push(spec); };

  function plans() {
    return IR.spellPlan.buildAll({
      ng: window.IR_DATA,
      nk: window.IR_DATA_NK,
      u5: window.IR_DATA_U5,
      u6: window.IR_DATA_U6
    }, extra);
  }
  function lessonById(id) { return plans().filter((L) => L.id === id)[0] || null; }
  const doneId = (lesson, step) => 'spell_' + lesson + '_' + step;
  function unlocked(lessonId, index) {
    if (IR.S && IR.S().settings && IR.S().settings.openAll) return true;
    if (index <= 0) return true;
    return IR.isDone(doneId(lessonId, STEPS[index - 1].id));
  }
  function sayWord(L, w) { return Snd.play(L.wordSrc(w)); }
  function playTok(tok, word) {
    if (!tok || tok.magic) return Promise.resolve(false);
    const src = IR.spellPlan.soundSrc(tok, word);
    if (src) return Snd.play(src);
    return IR.playPhoneme ? IR.playPhoneme(tok.g) : Promise.resolve(false);
  }
  function wiggle(el, tok, word) {
    if (!document.body.classList.contains('calm')) {
      el.classList.remove('wiggle');
      void el.offsetWidth;
      el.classList.add('wiggle');
    }
    playTok(tok, word);
  }
  function starLine() {
    return h('p', { class: 'spellstar', 'aria-label': 'Star earned' }, icon('star'), h('span', null, 'Star'));
  }
  async function yay(host, L, w) {
    host.classList.add('spelllit');
    host.append(starLine());
    await Snd.seq([A.sfx.ding, L.wordSrc(w)], 90);
  }
  function grapheme(tok) {
    return h('span', { class: 'spelltile' + (tok.magic ? ' silent' : '') + (tok.ending ? ' ending' : '') }, tok.magic ? 'e' : tok.g);
  }

  IR.spellLessons = plans;
  IR.spellCard = function (id) {
    const L = lessonById(id);
    if (!L) return null;
    const done = STEPS.every((s) => IR.isDone(doneId(id, s.id)));
    return h('li', { class: 'bigli spellli' }, IR.tapCard({
      className: 'stopcard bigbox spellstop' + (done ? ' done' : ''),
      label: 'Spelling. ' + L.n + ' ' + L.name + '. Opens spelling.',
      href: '#/spell/' + id,
      kids: [
        h('span', { class: 'bkind' }, 'Spelling'),
        done ? h('span', { class: 'bstar' }, h('span', { class: 'sstar on', 'aria-hidden': 'true' }, icon('star'))) : null,
        h('span', { class: 'spellpreview', 'aria-hidden': 'true' }, h('span', null, 'c'), h('span', { class: 'spellgap' }, '_'), h('span', null, 'p')),
        h('span', { class: 'stxt bbot' }, h('b', null, L.n + ' ' + L.name)),
        h('span', { class: 'cardgo', 'aria-hidden': 'true' }, 'Spell')
      ]
    }));
  };

  function shell(app, L, title) {
    IR.newScreen();
    const stage = h('div', { class: 'stage' });
    const instr = h('div', { class: 'instr' });
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the lesson', onclick: () => { Snd.stop(); location.hash = L.back; } }, icon('close'));
    app.append(h('div', { class: 'screen lessonscreen spellstep' },
      h('header', { class: 'lesson-top' }, x, IR.ui.homeButton(), IR.ui.gearButton()),
      h('h2', { class: 'acttitle' }, title),
      instr, stage));
    return { stage: stage, instr: instr };
  }
  function setInstr(box, text, prompt) {
    box.innerHTML = '';
    const hear = speakerBtn(() => Snd.play('audio/spell_p_' + prompt + '.mp3'), 'Hear the directions');
    box.append(hear, h('span', { class: 'itext' }, text));
  }

  function menu(app, L) {
    IR.newScreen();
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the lesson', onclick: () => { location.hash = L.back; } }, icon('close'));
    const cards = STEPS.map((s, i) => {
      const open = unlocked(L.id, i);
      const done = IR.isDone(doneId(L.id, s.id));
      const go = open ? '#/spell/' + L.id + '/' + s.id : null;
      return h('li', { class: 'bigli spellli' }, IR.tapCard({
        className: 'stopcard bigbox spellstop stepcard' + (done ? ' done' : '') + (open ? '' : ' locked'),
        label: 'Spelling step ' + (i + 1) + '. ' + s.title + (open ? '' : '. Locked until the step before is done.'),
        href: go,
        onOpen: open ? null : function () {},
        kids: [
          h('span', { class: 'bkind' }, 'Step ' + (i + 1)),
          done ? h('span', { class: 'bstar' }, h('span', { class: 'sstar on', 'aria-hidden': 'true' }, icon('star'))) : null,
          h('span', { class: 'stxt bbot' }, h('b', null, s.title)),
          h('span', { class: 'cardgo' + (open ? '' : ' off'), 'aria-hidden': 'true' }, open ? 'Spell' : 'Locked')
        ]
      }));
    });
    app.append(h('div', { class: 'screen trailscreen unitpage unitA spellmenu' },
      h('header', { class: 'uA-top' }, x, IR.ui.homeButton(), h('h1', { class: 'uA-title' }, h('small', null, 'Unit ' + L.unit + ' · Lesson ' + L.n + ' · '), 'Spelling'), IR.ui.gearButton()),
      h('p', { class: 'spelllead' }, 'Five spelling steps. Each one opens after the one before it.'),
      h('ul', { class: 'spellsteps' }, ...cards)));
  }

  function finishStep(stage, L, stepId, stars) {
    IR.recordActivity(doneId(L.id, stepId), stars);
    IR.save();
    const back = h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = '#/spell/' + L.id; } }, 'Back to spelling', icon('next'));
    stage.append(h('div', { class: 'row center' }, back));
  }

  function runGap(app, L) {
    const ui = shell(app, L, 'Fill in the missing sound');
    setInstr(ui.instr, STEPS[0].line, 'gap');
    const rounds = L.steps.gap;
    let i = 0; let misses = 0;
    function round() {
      if (i >= rounds.length) { finishStep(ui.stage, L, 'gap', misses ? 2 : 3); return; }
      const R = rounds[i];
      ui.stage.innerHTML = '';
      Snd.play('audio/spell_p_gap.mp3').then(() => sayWord(L, R.w));
      const word = h('div', { class: 'spellword' });
      const blank = h('span', { class: 'spelltile blank', 'aria-label': 'Missing sound' }, '_');
      R.tokens.forEach((t) => { word.append(t === R.gap ? blank : grapheme(t)); });
      const hear = speakerBtn(() => sayWord(L, R.w), 'Hear the word'); hear.classList.add('huge');
      const choices = h('div', { class: 'spellchoices' });
      let locked = false;
      shuffle(R.choices.slice()).forEach((g) => {
        const b = h('button', { class: 'spelltile pick', type: 'button' }, g);
        b.addEventListener('click', async () => {
          if (locked) return;
          const tok = { g: g, magic: false, ending: g === 'ed' || g === 'es' || g === 'ing' || (g === 's' && R.gap.ending) };
          if (g !== R.gap.g) { misses++; wiggle(b, tok, R.w); return; }
          locked = true;
          blank.textContent = R.gap.magic ? 'e' : R.gap.g;
          blank.classList.remove('blank');
          await yay(word, L, R.w);
          if (!ui.stage.isConnected) return;
          i++; round();
        });
        choices.append(b);
      });
      ui.stage.append(h('div', { class: 'activity spellact' }, h('p', { class: 'spellcount' }, (i + 1) + ' of ' + rounds.length), hear, word, choices));
    }
    round();
  }

  function runBoxes(app, L) {
    const ui = shell(app, L, 'Sound boxes');
    setInstr(ui.instr, STEPS[1].line, 'boxes');
    const rounds = L.steps.boxes;
    let i = 0; let misses = 0;
    function round() {
      if (i >= rounds.length) { finishStep(ui.stage, L, 'boxes', misses ? 2 : 3); return; }
      const R = rounds[i];
      ui.stage.innerHTML = '';
      const need = IR.spellPlan.boxes(R.tokens);
      const filled = [];
      const word = h('div', { class: 'spellword' });
      const boxEls = need.map((t, k) => {
        const b = h('button', { class: 'spelltile box', type: 'button', 'aria-label': 'Sound box ' + (k + 1) }, '');
        b.addEventListener('click', () => playTok(t, R.w));
        word.append(b);
        return b;
      });
      const magic = R.tokens.filter((t) => t.magic)[0];
      if (magic) word.append(h('span', { class: 'spelltile silent marker', 'aria-label': 'Silent e' }, 'e'));
      const hear = speakerBtn(() => sayWord(L, R.w), 'Hear the word'); hear.classList.add('huge');
      const tiles = h('div', { class: 'spellchoices' });
      const bag = shuffle(need.map((t) => t.g).concat(R.extras));
      bag.forEach((g) => {
        const b = h('button', { class: 'spelltile pick', type: 'button' }, g);
        b.addEventListener('click', async () => {
          if (b.disabled) return;
          const slot = filled.length;
          const tok = { g: g, magic: false, ending: need[slot] && need[slot].ending && need[slot].g === g };
          if (!need[slot] || g !== need[slot].g) { misses++; wiggle(b, { g: g, ending: false }, R.w); return; }
          b.disabled = true;
          b.classList.add('used');
          filled.push(g);
          boxEls[slot].textContent = g;
          boxEls[slot].classList.add('in');
          if (filled.length === need.length) { await yay(word, L, R.w); if (ui.stage.isConnected) { i++; round(); } }
        });
        tiles.append(b);
      });
      ui.stage.append(h('div', { class: 'activity spellact' }, h('p', { class: 'spellcount' }, (i + 1) + ' of ' + rounds.length), hear, word, tiles));
      sayWord(L, R.w);
    }
    round();
  }

  function runTiles(app, L) {
    const ui = shell(app, L, 'Tap the tiles');
    setInstr(ui.instr, STEPS[2].line, 'tiles');
    const rounds = L.steps.tiles;
    let i = 0; let misses = 0;
    function round() {
      if (i >= rounds.length) { finishStep(ui.stage, L, 'tiles', misses ? 2 : 3); return; }
      const R = rounds[i];
      ui.stage.innerHTML = '';
      let n = 0;
      const word = h('div', { class: 'spellword' });
      const slots = R.tokens.map(() => { const s = h('span', { class: 'spelltile blank' }, ''); word.append(s); return s; });
      const hear = speakerBtn(() => sayWord(L, R.w), 'Hear the word'); hear.classList.add('huge');
      const tiles = h('div', { class: 'spellchoices' });
      const bag = shuffle(R.tokens.map((t) => (t.magic ? 'e' : t.g)).concat(R.extras));
      bag.forEach((g) => {
        const b = h('button', { class: 'spelltile pick' + (g === 'e' ? ' silent' : ''), type: 'button' }, g);
        b.addEventListener('click', async () => {
          if (b.disabled || n >= R.tokens.length) return;
          const need = R.tokens[n];
          const show = need.magic ? 'e' : need.g;
          const tok = { g: g, magic: g === 'e' && need.magic, ending: need.ending && g === need.g };
          playTok(g === 'e' && need.magic ? { magic: true } : { g: g, ending: tok.ending }, R.w);
          if (g !== show) { misses++; wiggle(b, { g: g, ending: false }, R.w); return; }
          b.disabled = true;
          b.classList.add('used');
          slots[n].textContent = show;
          slots[n].classList.remove('blank');
          if (need.magic) slots[n].classList.add('silent');
          n++;
          if (n === R.tokens.length) { await yay(word, L, R.w); if (ui.stage.isConnected) { i++; round(); } }
        });
        tiles.append(b);
      });
      ui.stage.append(h('div', { class: 'activity spellact' }, h('p', { class: 'spellcount' }, (i + 1) + ' of ' + rounds.length), hear, word, tiles));
      sayWord(L, R.w);
    }
    round();
  }

  function runChain(app, L) {
    const ui = shell(app, L, 'Word chain');
    setInstr(ui.instr, STEPS[3].line, 'chain');
    const chains = L.steps.chains || [];
    if (!chains.length) {
      ui.stage.append(h('div', { class: 'activity spellact' }, h('p', { class: 'spelllead' }, 'This lesson does not have two words that change by one sound yet.'), h('button', { class: 'btn big primary', type: 'button', onclick: () => finishStep(ui.stage, L, 'chain', 3) }, 'Back to spelling')));
      return;
    }
    const jobs = [];
    chains.forEach((chain) => { for (let k = 1; k < chain.length; k++) jobs.push({ from: chain[k - 1], to: chain[k] }); });
    let i = 0; let misses = 0;
    function round() {
      if (i >= jobs.length) { finishStep(ui.stage, L, 'chain', misses ? 2 : 3); return; }
      const job = jobs[i];
      const d = IR.spellPlan.diff(job.from.tokens, job.to.tokens);
      ui.stage.innerHTML = '';
      const word = h('div', { class: 'spellword' });
      const from = job.from.tokens;
      const hear = speakerBtn(() => sayWord(L, job.to.w), 'Hear the word'); hear.classList.add('huge');
      let targetG = '';
      const tiles = h('div', { class: 'spellchoices' });
      function win() { yay(word, L, job.to.w).then(() => { if (ui.stage.isConnected) { i++; round(); } }); }
      if (!d) { i++; round(); return; }
      if (d.type === 'sub') {
        from.forEach((t, k) => {
          if (k === d.i) word.append(h('span', { class: 'spelltile blank glow' }, '_'));
          else word.append(grapheme(t));
        });
        targetG = d.to === 'E' ? 'e' : d.to;
      } else if (d.type === 'add') {
        const longer = [];
        from.forEach((t) => longer.push(t));
        longer.splice(d.i, 0, null);
        longer.forEach((t) => word.append(t ? grapheme(t) : h('span', { class: 'spelltile blank glow' }, '_')));
        targetG = d.g === 'E' ? 'e' : d.g;
      } else {
        from.forEach((t, k) => {
          const el = grapheme(t);
          if (k === d.i) el.classList.add('glow');
          word.append(el);
        });
        const gone = from[d.i];
        const btn = h('button', { class: 'spelltile pick', type: 'button' }, 'Take off ' + (gone.magic ? 'e' : gone.g));
        btn.addEventListener('click', () => { btn.disabled = true; word.children[d.i].remove(); win(); });
        tiles.append(btn);
      }
      if (d.type !== 'del') {
        const bag = shuffle([targetG, 'm', 't', 'a'].filter((g, idx, arr) => arr.indexOf(g) === idx && g !== targetG).concat([targetG]));
        const choices = shuffle([targetG].concat(['m', 't', 's', 'a', 'i'].filter((g) => g !== targetG)).slice(0, 3));
        choices.forEach((g) => {
          const b = h('button', { class: 'spelltile pick' + (g === 'e' ? ' silent' : ''), type: 'button' }, g);
          b.addEventListener('click', () => {
            if (b.disabled) return;
            if (g !== targetG) { misses++; wiggle(b, { g: g }, job.to.w); return; }
            b.disabled = true;
            const hole = word.querySelector('.blank');
            if (hole) { hole.textContent = g; hole.classList.remove('blank'); if (g === 'e') hole.classList.add('silent'); }
            win();
          });
          tiles.append(b);
        });
        void bag;
      }
      ui.stage.append(h('div', { class: 'activity spellact' },
        h('p', { class: 'spellcount' }, (i + 1) + ' of ' + jobs.length),
        h('p', { class: 'spellfrom' }, job.from.w),
        hear, word, tiles));
      sayWord(L, job.to.w);
    }
    round();
  }

  function runPattern(app, L) {
    const ui = shell(app, L, 'Pattern hunt');
    setInstr(ui.instr, STEPS[4].line, 'pattern');
    const rounds = L.steps.pattern;
    let i = 0; let misses = 0; let phase = 'spell';
    const spelled = [];
    function spellRound() {
      if (i >= rounds.length) { phase = 'tap'; tapPhase(); return; }
      const R = rounds[i];
      ui.stage.innerHTML = '';
      let n = 0;
      const word = h('div', { class: 'spellword' });
      const slots = R.tokens.map(() => { const s = h('span', { class: 'spelltile blank' }, ''); word.append(s); return s; });
      const hear = speakerBtn(() => sayWord(L, R.w), 'Hear the word'); hear.classList.add('huge');
      const tiles = h('div', { class: 'spellchoices' });
      shuffle(R.tokens.map((t) => (t.magic ? 'e' : t.g)).concat(R.extras || [])).forEach((g) => {
        const b = h('button', { class: 'spelltile pick', type: 'button' }, g);
        b.addEventListener('click', async () => {
          if (b.disabled || n >= R.tokens.length) return;
          const need = R.tokens[n];
          const show = need.magic ? 'e' : need.g;
          if (g !== show) { misses++; wiggle(b, { g: g, ending: need.ending }, R.w); return; }
          b.disabled = true;
          slots[n].textContent = show;
          slots[n].classList.remove('blank');
          n++;
          if (n === R.tokens.length) {
            await yay(word, L, R.w);
            spelled.push(R);
            if (ui.stage.isConnected) { i++; spellRound(); }
          }
        });
        tiles.append(b);
      });
      ui.stage.append(h('div', { class: 'activity spellact' }, h('p', { class: 'spellcount' }, (i + 1) + ' of ' + rounds.length), hear, word, tiles));
      sayWord(L, R.w);
    }
    function tapPhase() {
      ui.stage.innerHTML = '';
      setInstr(ui.instr, 'Tap the part that is the same in each word.', 'pattern');
      const focusOf = (R) => {
        if (L.focus === 'vowel' || L.focus === 'o') {
          const mag = R.tokens.some((t) => t.magic);
          if (L.focus === 'o') return R.tokens.filter((t) => t.g === 'o')[0];
          const sound = R.tokens.filter((t) => !t.magic);
          for (let k = sound.length - 2; k >= 0; k--) if ('aeiou'.indexOf(sound[k].g) >= 0) return sound[k];
          return mag ? R.tokens[R.tokens.length - 1] : R.tokens[0];
        }
        return R.tokens.filter((t) => t.g === L.focus)[0] || R.tokens[R.tokens.length - 1];
      };
      let left = spelled.length;
      const rows = spelled.map((R) => {
        const hit = focusOf(R);
        const row = h('div', { class: 'spellword' });
        R.tokens.forEach((t) => {
          const b = h('button', { class: 'spelltile pick', type: 'button' }, t.magic ? 'e' : t.g);
          b.addEventListener('click', () => {
            if (b.disabled) return;
            if (t !== hit) { misses++; wiggle(b, t, R.w); return; }
            b.disabled = true;
            b.classList.add('same');
            left--;
            if (left === 0) showTip();
          });
          row.append(b);
        });
        return row;
      });
      ui.stage.append(h('div', { class: 'activity spellact' }, h('p', { class: 'spelllead' }, 'Tap the part that is the same.'), ...rows));
    }
    function showTip() {
      const who = L.tip.who === 'frill' ? 'Frill' : 'Zip';
      const face = L.tip.who === 'frill' ? 'img/frill.webp' : 'img/zipA.webp';
      const bubble = h('div', { class: 'bubble ' + L.tip.who }, h('b', { class: 'who' }, who), h('p', null, L.tip.text), speakerBtn(() => Snd.play('audio/spell_tip_' + L.id + '.mp3'), 'Hear the tip'));
      ui.stage.append(h('div', { class: 'spelltip' }, h('img', { src: face, alt: who }), bubble), starLine());
      Snd.play('audio/spell_tip_' + L.id + '.mp3');
      finishStep(ui.stage, L, 'pattern', misses ? 2 : 3);
    }
    spellRound();
  }

  const RUN = { gap: runGap, boxes: runBoxes, tiles: runTiles, chain: runChain, pattern: runPattern };
  IR.spellRoute = function (hash, app) {
    const m = /^#\/spell\/([a-z0-9]+)(?:\/([a-z]+))?$/.exec(hash);
    if (!m) return false;
    const L = lessonById(m[1]);
    if (!L) return false;
    if (!m[2]) { menu(app, L); return true; }
    const idx = STEPS.findIndex((s) => s.id === m[2]);
    if (idx < 0) return false;
    if (!unlocked(L.id, idx)) { menu(app, L); return true; }
    RUN[m[2]](app, L);
    return true;
  };
})();
