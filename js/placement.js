/* Island hop placement game (#/placement). The same items, stop rules and placement logic as the printable Island Readers
   Placement Test, made adaptive: a short grown-up intake, a quick word ladder, then bigger jumps forward when probes pass and
   smaller steps back when they miss (halving across Units 1 to 22), confirmed by a full 10-word check of the start unit and the
   unit before it. Kid-tap rounds where recorded audio allows; read-aloud rounds use Grown-up helper mode (the adult taps).
   The result saves to the active reader profile (IR.S().placement). Nothing is recorded or sent. No microphone.
   The earlier 5-words-per-bell check is kept at #/placement/classic (js/placement-classic.js). */
(function () {
  'use strict';
  const IR = window.IR; const { h, icon, Snd } = IR; const E = IR.placementEngine;
  /* Pure letter sounds with a human recording (audio/phonemes). c, o and the rest have none yet, so those are grown-up rounds. */
  const PHONEME = { a: 'a', d: 'd', e: 'e', i: 'i', k: 'k', m: 'm', n: 'n', p: 'p', s: 's', t: 't', u: 'u' };
  /* Recorded words. Words missing here are spoken with the device voice, the same fallback the classic check used. */
  const WORD_AUDIO = {"a":"audio/w_a.mp3","the":"audio/w_the.mp3","is":"audio/w_is.mp3","I":"audio/w_I.mp3","to":"audio/w_to.mp3","his":"audio/w_his.mp3","has":"audio/w_has.mp3","of":"audio/w_of.mp3","you":"audio/w_you.mp3","was":"audio/nk_w_was.mp3","said":"audio/u51_w_said.mp3","give":"audio/w_give.mp3","put":"audio/w_put.mp3","some":"audio/w_some.mp3","were":"audio/w_were.mp3","other":"audio/w_other.mp3","people":"audio/w_people.mp3","water":"audio/w_water.mp3","walk":"audio/w_walk.mp3","again":"audio/w_again.mp3","any":"audio/w_any.mp3","could":"audio/w_could.mp3","every":"audio/w_every.mp3","once":"audio/w_once.mp3","through":"audio/w_through.mp3","great":"audio/w_great.mp3","goes":"audio/w_goes.mp3","answer":"audio/w_answer.mp3","country":"audio/w_country.mp3","learn":"audio/w_learn.mp3","mother":"audio/w_mother.mp3","move":"audio/w_move.mp3","school":"audio/w_school.mp3","should":"audio/w_should.mp3","wash":"audio/w_wash.mp3","because":"audio/w_because.mp3","been":"audio/w_been.mp3","does":"audio/w_does.mp3","eyes":"audio/w_eyes.mp3","father":"audio/w_father.mp3","many":"audio/w_many.mp3","their":"audio/w_their.mp3","would":"audio/w_would.mp3","sun":"audio/w_sun.mp3","map":"audio/w_map.mp3","fish":"audio/nk_w_fish.mp3","chip":"audio/w_chip.mp3","bus":"audio/u6_w_bus.mp3","cap":"audio/u51_w_cap.mp3","log":"audio/w_log.mp3","dish":"audio/u6_w_dish.mp3","it":"audio/w_it.mp3","pin":"audio/u51_w_pin.mp3","rug":"audio/w_rug.mp3","wish":"audio/w_wish.mp3","spot":"audio/u6_w_spot.mp3"};
  const SECTIONS = {
    intake: 'Grown-up start', names: 'Letter names', sounds: 'Letter sounds', listen: 'Listening', short: 'Short words',
    ladder: 'Word ladder', islands: 'Word islands', heart: 'Heart words', done: 'Your island'
  };
  const BREAKS = ['Stand up and stretch up tall, like a palm tree.', 'Do 5 slow wall push-ups.', 'Shake out your hands, then your feet.',
    'Take 3 slow breaths, in through your nose.', 'Look out of a window and find something green.', 'Walk one lap of the room, then sit back down.'];

  function tts(text) {
    return new Promise((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85;
        let done = false; const fin = () => { if (!done) { done = true; resolve(true); } };
        u.onend = u.onerror = fin; speechSynthesis.cancel(); speechSynthesis.speak(u); setTimeout(fin, 2500);
      } catch (e) { resolve(false); }
    });
  }
  function hush() { try { Snd.stop(); } catch (e) { /* */ } try { speechSynthesis.cancel(); } catch (e) { /* */ } }
  function sayWord(w) { hush(); return WORD_AUDIO[w] ? Snd.play(WORD_AUDIO[w], { manual: true }).then((ok) => ok || tts(w)) : tts(w); }
  function saySound(l) { hush(); return Snd.play('audio/phonemes/' + PHONEME[l] + '.mp3', { manual: true }); }

  /* ---------- saved result (per reader profile) ---------- */
  const LEGACY_BELL_UNIT = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 15, 9: 19, 10: 8 };
  function savedRecord() { const s = IR.S(); return (s && s.placement) || null; }
  function savedStart() {
    const r = savedRecord(); if (r && r.start) return r.start;
    try {
      const t = Number(localStorage.getItem('ir_start_team')); const b = Number(localStorage.getItem('ir_start_bell'));
      if (b && LEGACY_BELL_UNIT[b]) return { unit: LEGACY_BELL_UNIT[b] };
      if (t) return { team: t };
    } catch (e) { /* storage blocked */ }
    return null;
  }
  function saveRecord(rec) {
    const s = IR.S(); const prev = s.placement; const hist = (prev && prev.history) || [];
    if (prev && prev.start) hist.unshift({ at: prev.at, start: prev.start });
    rec.history = hist.slice(0, 5); s.placement = rec; IR.save();
  }
  const startLabel = (st) => st.team ? 'Team ' + st.team + ': ' + E.TEAMS[st.team - 1].letters.join(' ') : st.lesson ? ('Lesson ' + st.lesson + ' \u00b7 ' + (st.name || E.unit(st.unit).name)) : ('Unit ' + st.unit + ': ' + E.unit(st.unit).name);

  function render(app, openStart) {
    IR.newScreen(); hush();
    const root = h('div', { class: 'screen placement pg2' });
    app.append(root);
    let trail = [];            /* section ids planned for this reader */
    let here = 'intake';
    let breakFn = null;        /* set while an item is waiting, so Break can pause it */
    const home = () => { hush(); location.hash = '#/home'; };

    function trailBar() {
      const at = trail.indexOf(here);
      return h('ol', { class: 'pg2-trail', 'aria-label': 'Island trail' }, ...trail.map((id, i) =>
        h('li', { class: i < at ? 'past' : i === at ? 'now' : 'later', 'aria-current': i === at ? 'step' : null },
          h('span', { class: 'isle', 'aria-hidden': 'true' }), h('span', { class: 'tl' }, SECTIONS[id]))));
    }
    function show(opts, ...kids) {
      opts = opts || {};
      root.innerHTML = '';
      const top = h('div', { class: 'pg2-top' }, IR.ui.pageNav(opts.back || home),
        trail.length && !opts.noTrail ? trailBar() : h('span', { class: 'pg2-sp' }),
        opts.pause ? h('button', { class: 'btn pg2-break', type: 'button', onclick: () => breakFn && breakFn() }, 'Break') : h('span', { class: 'pg2-sp' }));
      root.append(top, h('div', { class: 'pg2-main' + (opts.cls ? ' ' + opts.cls : '') }, ...kids.filter((k) => k != null && k !== false)));
      try { window.scrollTo(0, 0); } catch (e) { /* */ }
    }
    const guides = (cls) => h('div', { class: 'pg2-guides ' + (cls || '') }, h('img', { src: 'img/zipA.webp', alt: 'Zip the gecko' }), h('img', { src: 'img/frill.webp', alt: 'Frill' }));
    const go = (label, onclick, extra) => h('button', Object.assign({ class: 'btn big pg2-go', type: 'button', onclick }, extra || {}), label);
    const plain = (label, onclick) => h('button', { class: 'btn big pg2-plain', type: 'button', onclick }, label);
    const helper = (text) => h('div', { class: 'pg2-helper', role: 'note' }, h('b', null, 'Grown-up helper'), h('span', null, text));
    const hearBtn = (fn, label) => h('button', { class: 'pg2-hear', type: 'button', 'aria-label': label || 'Hear it again', onclick: fn }, icon('speaker'));

    /* ---------- intro ---------- */
    function intro() {
      trail = []; const last = savedRecord();
      try {
        if (sessionStorage.getItem('ir_place_preview') === '8') {
          sessionStorage.removeItem('ir_place_preview');
          result({ at: new Date().toISOString(), start: { unit: 8, lesson: '8.1', key: 'u81', name: 'tch', href: '#/u8/u81' }, ladder: [{ w: 'match', ok: false }], units: { 7: { full: { right: 9, of: 10, missed: [] } }, 8: { full: { right: 5, of: 10, missed: ['plitch', 'brild'] } } }, heart: [] });
          return;
        }
      } catch (e) { /* storage blocked */ }
      show({}, guides('big'),
        h('h1', { class: 'pg2-title' }, 'Island hop'),
        h('p', { class: 'pg2-lead' }, 'A calm trip across the islands to find the best place to start reading.'),
        h('p', { class: 'pg2-note' }, h('b', null, 'For the grown-up: '), 'sit with your reader. Most readers finish in 10 to 15 minutes, with breaks whenever you like. Some rounds your reader taps; in others your reader reads out loud and you tap. Nothing is recorded or sent. The result saves to this reader.'),
        h('div', { class: 'pg2-row' }, go('Start the island hop', () => flow()),
          last && last.start ? plain('Last summary', () => summary(last, true)) : null),
        h('a', { class: 'pg2-classic', href: '#/placement/classic' }, 'Classic quick check'));
    }

    /* ---------- generic rounds ---------- */
    function pauseable(build) {
      return new Promise((resolve) => {
        const draw = () => { breakFn = () => { breakFn = null; rest('Take a breather', () => draw()); }; build(resolve); };
        draw();
      }).then((v) => { breakFn = null; return v; });
    }
    /* Grown-up read round: one big word, the adult taps. Resolves true (read right) or false (not yet). */
    function readRound(word, adultLine, kidLine) {
      return pauseable((resolve) => {
        show({ pause: true, cls: 'read' },
          helper(adultLine),
          h('p', { class: 'pg2-kid' }, kidLine || 'Read this out loud.'),
          h('div', { class: 'pg2-word', lang: 'en' }, word),
          h('div', { class: 'pg2-marks' },
            h('button', { class: 'btn big pg2-no', type: 'button', 'aria-label': 'Not yet: ' + word, onclick: () => resolve(false) }, h('span', { 'aria-hidden': 'true' }, '\u2717'), h('span', null, 'Not yet')),
            h('button', { class: 'btn big pg2-yes', type: 'button', 'aria-label': 'Read it right: ' + word, onclick: () => resolve(true) }, h('span', { 'aria-hidden': 'true' }, '\u2713'), h('span', null, 'Read it right'))));
      });
    }
    /* Kid tap round: hear something, tap one choice. Feedback is neutral (no right or wrong shown). Resolves the choice. */
    function tapRound(prompt, play, choices, render) {
      return pauseable((resolve) => {
        let picked = false;
        const tiles = choices.map((c) => h('button', { class: 'pg2-tile', type: 'button', onclick: (ev) => {
          if (picked) return; picked = true; ev.currentTarget.classList.add('chosen'); hush(); setTimeout(() => resolve(c), 380);
        } }, render ? render(c) : String(c)));
        show({ pause: true, cls: 'tap' },
          h('div', { class: 'pg2-ask' }, guides('small'), h('p', { class: 'pg2-kid' }, prompt), hearBtn(play)),
          h('div', { class: 'pg2-tiles n' + choices.length }, ...tiles));
        setTimeout(play, 250);
      });
    }
    function rest(title, next, line) {
      hush();
      const tip = BREAKS[Math.floor(Math.random() * BREAKS.length)];
      show({ cls: 'rest' }, guides('big'), h('h1', { class: 'pg2-title' }, title),
        line ? h('p', { class: 'pg2-lead' }, line) : null,
        h('p', { class: 'pg2-tip' }, tip), go('I\u2019m ready', () => next()));
    }
    const restP = (title, line) => new Promise((r) => rest(title, r, line));
    const pickN = (pool, n, not) => IR.shuffle(pool.filter((x) => not.indexOf(x) < 0)).slice(0, n);

    /* ---------- the flow ---------- */
    async function flow() {
      const st = { at: new Date().toISOString(), age: null, reads: null, names: null, sounds: null, listen: null, rows: null, ladder: [], units: {}, heart: [], start: null };
      const ans = await intake();
      st.age = ans.age; st.reads = ans.reads;
      const foundFirst = ans.reads === 'no' || (ans.reads === 'unsure' && ans.age === '5');
      trail = foundFirst ? ['intake', 'names', 'sounds', 'listen', 'short', 'islands', 'heart', 'done'] : ['intake', 'ladder', 'islands', 'heart', 'done'];
      let foundDone = false;
      if (foundFirst) {
        const team = await foundations(st, true); foundDone = true;
        if (team) st.start = { team };
        else { trail = trail.filter((x) => x !== 'names'); st.units.__hint = [1, 3]; }
      } else {
        here = 'ladder'; await restP('First stop: the word ladder', 'A few words that get harder. Stop when it gets tricky.');
        await ladder(st);
      }
      if (!st.start) {
        here = 'islands'; await restP('Next stop: word islands', 'Short hops from island to island. Some words are made-up, so sound them out.');
        const start = await islands(st);
        if (start === 1 && !foundDone) {
          trail = trail.slice(0, trail.indexOf('islands')).concat(['sounds', 'short'], trail.slice(trail.indexOf('islands')));
          here = 'sounds'; await restP('A quick look at letters', 'Unit 1 was tricky, so let\u2019s check letters and short words too.');
          const team = await foundations(st, false);
          st.start = team ? { team } : { unit: 1 };
        } else st.start = start === E.LAST + 1 ? { unit: E.LAST, beyond: true } : { unit: start };
        if (st.start.unit && E.lessonItems(st.start.unit).length) {
          const fine = await lessonPick(st.start.unit);
          if (fine) st.start = fine;
        }
      }
      here = 'heart'; await restP('Last stop: heart words', 'Listen to a word, then tap it.');
      await heartWords(st);
      here = 'done'; finish(st);
    }
    function intake() {
      here = 'intake'; trail = ['intake'];
      return new Promise((resolve) => {
        const pick = { age: null, reads: null };
        const opt = (key, val, label) => h('button', { class: 'pg2-opt', type: 'button', 'aria-pressed': 'false', onclick: (ev) => {
          pick[key] = val; ev.currentTarget.parentNode.querySelectorAll('.pg2-opt').forEach((b) => b.setAttribute('aria-pressed', String(b === ev.currentTarget)));
          next.disabled = !(pick.age && pick.reads);
        } }, label);
        const next = go('Next', () => resolve(pick), { disabled: true });
        show({ cls: 'intake' }, helper('Two quick questions so the hop starts in the right place.'),
          h('p', { class: 'pg2-q' }, 'How old is your reader?'),
          h('div', { class: 'pg2-opts' }, opt('age', '5', '5 to 6'), opt('age', '7', '7'), opt('age', '8', '8 or older')),
          h('p', { class: 'pg2-q' }, 'Can they read short words like ', h('b', null, 'sat'), ' and ', h('b', null, 'pin'), '?'),
          h('div', { class: 'pg2-opts' }, opt('reads', 'yes', 'Yes'), opt('reads', 'no', 'Not yet'), opt('reads', 'unsure', 'Not sure')),
          h('div', { class: 'pg2-row' }, next));
      });
    }
    /* Foundations: letter names (first pass only), letter sounds, listening (first pass only), short word rows. Returns a Team or null. */
    async function foundations(st, full) {
      if (full) {
        here = 'names'; await restP('First stop: letter names', 'Your reader says each letter\u2019s name.');
        const names = { missed: [], tested: 0 }; let run = 0;
        for (const l of E.LETTER_NAMES) {
          const ok = await readRound(l, 'Tap \u2713 if your reader says the letter name.', 'What is this letter called?');
          names.tested++; if (!ok) { names.missed.push(l); run++; } else run = 0;
          if (run >= 6) break;
        }
        st.names = names;
        here = 'sounds'; await restP('Next stop: letter sounds', 'Listen for the sound, then tap the letter.');
      }
      /* Letter sounds: tap rounds for recorded sounds, then grown-up rounds for the rest. Stop each part after 6 misses in a row. */
      const sounds = { missed: [], tested: 0, byTeam: {} };
      const miss = (l) => { sounds.missed.push(l); const t = E.TEAM_OF[l]; sounds.byTeam[t] = (sounds.byTeam[t] || 0) + 1; };
      let run = 0;
      for (const l of E.LETTER_SOUNDS.filter((x) => PHONEME[x])) {
        const not = l === 'k' ? [l, 'c', 'q'] : [l];
        const choices = IR.shuffle([l].concat(pickN('abdefghijlmnoprstuvwyz'.split(''), 3, not)));
        const pickd = await tapRound('Listen. Which letter makes this sound?', () => saySound(l), choices);
        sounds.tested++; if (pickd !== l) { miss(l); run++; } else run = 0;
        if (run >= 6) break;
      }
      run = 0;
      for (const l of E.LETTER_SOUNDS.filter((x) => !PHONEME[x])) {
        const ok = await readRound(l, 'Tap \u2713 for the pure sound, not the name. Short vowels; hard c and g; x is /ks/; q is /kw/ or /k/.', 'What sound does this letter make?');
        sounds.tested++; if (!ok) { miss(l); run++; } else run = 0;
        if (run >= 6) break;
      }
      st.sounds = sounds;
      if (full) {
        here = 'listen'; await restP('Next stop: listening', 'No letters this time. Just listen.');
        st.listen = await listening();
      }
      here = 'short'; await restP('Next stop: short words', 'Some are made-up words. Sound them out.');
      const rows = {}; let fails = 0;
      for (const t of E.TEAMS) {
        let right = 0, made = 0;
        for (const [w, mu, hint] of E.FOUND_WORDS[t.n]) {
          const ok = await readRound(w, mu ? 'Made-up word. A fair reading: ' + hint + '.' : 'Real word. Sounding out first is fine.', 'Read this word.');
          if (ok) { right++; if (mu) made++; }
        }
        rows[t.n] = { right, made, pass: E.rowPass(right, made) };
        fails = rows[t.n].pass ? 0 : fails + 1;
        if (fails >= 2) break;
      }
      st.rows = rows;
      const fp = E.foundationsPlacement(sounds.byTeam, rows);
      return fp.team;
    }
    async function listening() {
      const out = {};
      const part = async (key, ask) => { let right = 0, run = 0, n = 0; for (const it of E.PA[key]) { const ok = await ask(it); n++; if (ok) { right++; run = 0; } else run++; if (run >= 3) break; } out[key] = { right, tested: n, of: E.PA[key].length, pass: right >= E.PA_PASS[key] }; };
      await part('blend', ([sounds, word]) => readRound(sounds, 'Say these sounds slowly, about a second apart. Tap \u2713 if your reader says "' + word + '".', 'Listen to the sounds. What word is it?'));
      await part('first', async ([word, ans]) => (await tapRound('Listen. What is the first sound?', () => sayWord(word), IR.shuffle([ans].concat(pickN(['s', 'm', 'd', 'f', 'ch', 'e', 'p', 'n', 't', 'b'], 2, [ans]))))) === ans);
      await part('count', async ([word, n]) => (await tapRound('Listen. How many sounds?', () => sayWord(word), [2, 3, 4, 5], (c) => h('span', { class: 'pg2-dots', 'aria-label': c + ' sounds' }, ...Array.from({ length: c }, () => h('i'))))) === n);
      await part('last', async ([word, ans]) => (await tapRound('Listen. What is the last sound?', () => sayWord(word), IR.shuffle([ans].concat(pickN(['s', 'p', 'n', 'g', 'sh', 'k', 't', 'm', 'd'], 2, [ans]))))) === ans);
      return out;
    }
    /* Word ladder: one real word per level; stop after 2 misses in a row. Age 8 and up start at Unit 5. */
    async function ladder(st) {
      const order = E.screenerOrder(st.age === '8');
      const answers = [];
      for (const step of order) {
        if (st.age === '8' && step.unit === 2 && answers.some((a) => a.ok)) continue;
        const ok = await readRound(step.w, 'Ladder word. Tap \u2713 if read right within about 5 seconds.', 'Read this word.');
        answers.push({ unit: step.unit, w: step.w, ok });
        const n = answers.length;
        if (n >= 2 && !answers[n - 1].ok && !answers[n - 2].ok && !(st.age === '8' && step.unit !== 2 && !answers.some((a) => a.ok) && answers.every((a) => a.unit !== 2))) break;
      }
      st.ladder = answers;
      st.units.__hint = E.screenerHint(answers);
    }
    /* Word islands: adaptive probes and full checks until the engine settles on a start unit. */
    async function islands(st) {
      const res = st.units; let sinceRest = 0;
      for (let guard = 0; guard < 30; guard++) {
        const step = E.nextStep(res);
        if (step.kind === 'done') return step.start;
        const n = step.unit; const u = E.unit(n);
        const r = res[n] || (res[n] = {});
        const items = step.kind === 'probe' ? E.probeItems(n) : (r.probe ? E.restItems(n) : E.fullItems(n));
        if (sinceRest >= 16) { await restP('Rest stop', 'Nice sailing. Stretch, then we hop on.'); sinceRest = 0; }
        let right = 0, made = 0; const missed = [];
        for (const it of items) {
          const label = (step.kind === 'probe' ? 'Quick hop' : 'Full check') + ', Unit ' + n + ' (' + u.skill + '). ' + (it.made ? 'Made-up word. A fair reading: ' + it.hint + '.' : 'Real word.');
          const ok = await readRound(it.w, label, 'Read this word.');
          if (ok) { right++; if (it.made) made++; } else missed.push(it.w);
          sinceRest++;
        }
        if (step.kind === 'probe') r.probe = { right, made, of: 4, missed };
        else {
          const pr = r.probe || { right: 0, made: 0, missed: [] };
          r.full = { right: right + (r.probe ? pr.right : 0), of: 10, missed: (r.probe ? pr.missed : []).concat(missed) };
        }
      }
      return E.bracket(res).hi;
    }
    /* One screen of short words when a unit has lessons. Grown-up marks each word, then Next. */
    function lessonPick(unit) {
      const items = E.lessonItems(unit);
      return new Promise((resolve) => {
        const marks = {};
        const rows = items.map((it) => {
          const yes = h('button', { class: 'btn pg2-yes', type: 'button', 'aria-label': 'Read it right: ' + it.w }, 'Read it');
          const no = h('button', { class: 'btn pg2-no', type: 'button', 'aria-label': 'Not yet: ' + it.w }, 'Not yet');
          const set = (ok) => { marks[it.n] = ok; yes.classList.toggle('on', ok); no.classList.toggle('on', !ok); };
          yes.addEventListener('click', () => set(true));
          no.addEventListener('click', () => set(false));
          return h('div', { class: 'pg2-lessonrow' }, h('b', { class: 'pg2-word', lang: 'en' }, it.w), h('span', null, it.n + ' \u00b7 ' + it.name), h('span', { class: 'pg2-markpair' }, yes, no));
        });
        const next = h('button', { class: 'btn big ir-btn', type: 'button' }, 'Next', icon('next'));
        next.addEventListener('click', () => {
          if (items.some((it) => marks[it.n] == null)) return;
          resolve(E.lessonStart(unit, items.map((it) => ({ n: it.n, ok: marks[it.n] }))));
        });
        const home = h('button', { class: 'btn big ir-btn', type: 'button', 'aria-label': 'Home' }, icon('home'), 'Home');
        home.addEventListener('click', () => { hush(); location.hash = '#/home'; });
        const back = h('button', { class: 'btn big ir-btn', type: 'button', 'aria-label': 'Back' }, icon('back'), 'Back');
        back.addEventListener('click', () => resolve(null));
        show({ cls: 'lessonpick', noTrail: true },
          h('h1', { class: 'pg2-title' }, 'A few more words'),
          h('p', { class: 'pg2-kid' }, 'Read each word. A grown-up taps Read it or Not yet.'),
          h('div', { class: 'pg2-lessons' }, ...rows),
          h('div', { class: 'lesson-nav ir-controls pg2-calm' }, home, back, next));
      });
    }
    async function heartWords(st) {
      const sets = E.heartSetsFor(st.start);
      for (const set of sets) {
        const missed = [];
        for (const w of set.words) {
          const choices = IR.shuffle([w].concat(pickN(set.words, 2, [w])));
          const got = await tapRound('Listen. Tap the word you hear.', () => sayWord(w), choices, (c) => h('span', { class: 'pg2-hw', lang: 'en' }, c));
          if (got !== w) missed.push(w);
        }
        st.heart.push({ id: set.id, name: set.name, of: set.words.length, missed });
        if (missed.length >= 4) break;
      }
    }

    /* ---------- result + teacher summary ---------- */
    function finish(st) {
      const units = {}; Object.keys(st.units).forEach((k) => { if (k !== '__hint') units[k] = st.units[k]; });
      const rec = { at: st.at, start: st.start, age: st.age, reads: st.reads, names: st.names, sounds: st.sounds, listen: st.listen, rows: st.rows, ladder: st.ladder, units, heart: st.heart };
      saveRecord(rec);
      result(rec);
    }
    function result(rec) {
      here = 'done'; hush();
      const s = rec.start;
      const pic = s.team ? h('div', { class: 'pg2-teampic', 'aria-hidden': 'true' }, E.TEAMS[s.team - 1].letters.join(' '))
        : h('img', { class: 'pg2-unitpic', src: 'img/units/tile' + String(s.unit).padStart(2, '0') + '.webp', alt: '' });
      const line = s.beyond ? 'Your reader read every island. Start with Unit 22 as a review, then focus on reading stories.'
        : s.team ? 'Letters and sounds are the first stop. Earlier Teams are already strong.' : s.unit === 1 ? 'This is the first island. A great place to begin.' : 'This is where the new learning begins. The islands before it are already strong.';
      show({ cls: 'result' },
        h('div', { class: 'pg2-start' }, pic, h('div', null, h('p', { class: 'pg2-kicker' }, 'Start here'), h('h1', { class: 'pg2-title' }, startLabel(s)), h('p', { class: 'pg2-lead' }, line))),
        guides('cheer'),
        h('div', { class: 'pg2-row' },
          go(s.team ? 'Go to Team ' + s.team : (s.lesson ? 'Go to Lesson ' + s.lesson : 'Go to Unit ' + s.unit), () => { hush(); openStart(s); }),
          plain('Teacher summary', () => summary(rec)),
          plain('Hop again', () => intro())));
    }
    function summary(rec, fromIntro) {
      here = 'done';
      const tr = (...c) => h('tr', null, ...c.map((x) => h('td', null, x)));
      const units = Object.keys(rec.units || {}).map(Number).sort((a, b) => a - b);
      const why = units.map((n) => {
        const r = rec.units[n]; const u = E.unit(n);
        const res = r.full ? r.full.right + ' of 10' + (r.full.right >= E.UNIT_PASS ? ', passed' : ', not yet') : r.probe.right + ' of 4 (quick hop)' + (E.probePass(r.probe.right, r.probe.made) ? ', passed' : ', not yet');
        const missed = (r.full ? r.full.missed : r.probe.missed) || [];
        return tr('Unit ' + n + ' ' + u.name, res, missed.join(', ') || 'none');
      });
      const rows = rec.rows ? Object.keys(rec.rows).map((t) => tr('Team ' + t + ' (' + E.TEAMS[t - 1].letters.join(' ') + ')', rec.rows[t].right + ' of 4' + (rec.rows[t].pass ? ', passed' : ', not yet'), ((rec.sounds && rec.sounds.missed) || []).filter((l) => E.TEAM_OF[l] === Number(t)).join(' ') || 'none')) : [];
      const pa = rec.listen ? Object.keys(rec.listen).map((k) => tr({ blend: 'Blend sounds', first: 'First sound', last: 'Last sound', count: 'Count sounds' }[k], rec.listen[k].right + ' of ' + rec.listen[k].of, rec.listen[k].pass ? 'on track' : 'add 2 minutes of listening practice each day')) : [];
      const reason = rec.start.team ? 'Team ' + rec.start.team + ' is the first Team where a sound or the word row was not yet secure.'
        : rec.start.beyond ? 'Every unit checked passed, including a full check of Unit 22.'
        : 'Unit ' + rec.start.unit + ' scored under 8 of 10 on its full check' + (rec.start.unit > 1 ? ', and Unit ' + (rec.start.unit - 1) + ' passed its full check.' : '.');
      const sec = (title, head, body) => body.length ? h('section', { class: 'pg2-sec' }, h('h2', null, title), h('table', null, h('thead', null, h('tr', null, ...head.map((x) => h('th', null, x)))), h('tbody', null, ...body))) : null;
      const who = (IR.kidList && IR.kidList().filter((k) => k.active)[0]) || null;
      show({ cls: 'summary', back: () => (fromIntro ? intro() : result(rec)), noTrail: true },
        h('div', { class: 'pg2-sum' },
          h('h1', null, 'Placement summary'),
          h('p', null, (who ? who.name + ' \u00b7 ' : '') + new Date(rec.at).toLocaleDateString() + ' \u00b7 Age ' + ({ 5: '5 to 6', 7: '7', 8: '8 or older' }[rec.age] || '?')),
          h('p', { class: 'pg2-sumstart' }, h('b', null, 'Start here: ' + startLabel(rec.start)), h('br'), h('span', null, 'Why: ' + reason)),
          rec.ladder && rec.ladder.length ? h('p', null, h('b', null, 'Word ladder: '), rec.ladder.map((a) => a.w + (a.ok ? ' \u2713' : ' \u2717')).join(', ')) : null,
          sec('Word islands (units checked)', ['Unit', 'Result', 'Missed words'], why),
          sec('Foundations', ['Team', 'Word row', 'Sounds missed'], rows),
          rec.names ? h('p', null, h('b', null, 'Letter names missed: '), rec.names.missed.join(' ') || 'none') : null,
          sec('Listening', ['Part', 'Score', 'Next step'], pa),
          sec('Heart words', ['Set', 'Known', 'For the practice list'], (rec.heart || []).map((s) => tr(s.name, (s.of - s.missed.length) + ' of ' + s.of, s.missed.join(', ') || 'none'))),
          h('p', { class: 'pg2-fine' }, 'Units pass at 8 of 10. Quick hops use 4 of the 10 words (pass with 3, including a made-up word). The start is confirmed by full checks of the start unit and the unit before it. Retest after each unit check or every 6 to 8 weeks.')),
        h('div', { class: 'pg2-row noprint' }, go('Print summary', () => window.print())));
    }
    intro();
  }
  IR.placement = { render, savedStart, savedRecord, startLabel, LEGACY_BELL_UNIT };
})();
