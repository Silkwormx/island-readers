/* Unit 7 (nk) on Island 3 + the Island 3 Review. Own routes: #/nk (unit page), #/nk/<step>, #/nk/result, #/review3.
   Reuses the ng look (same classes) and adds two reusable activity types: Story Check (comprehension) and Rhyme Time. */
(function () {
  'use strict';
  const IR = window.IR; const N = window.IR_DATA_NK; if (!N) return;
  const { h, $, $$, sleep, shuffle, icon, Snd, speakerBtn } = IR;
  const AU = { w: (w) => 'audio/nk_w_' + w + '.mp3', p: (k) => 'audio/nk_p_' + k + '.mp3', c: (c) => 'audio/nk_c_' + c + '.mp3', l: (l) => 'audio/nk_l_' + l + '.mp3', nk: 'audio/nk_sound.mp3' };
  const say = (w) => Snd.play(AU.w(w));
  const NKCOL = '#C2408A';
  function colorNk(w) {           /* nk (and ng in the mixed items) in its own colour */
    const m = /(nk|ng)$/.exec(w); if (!m) return document.createTextNode(w);
    return h('span', null, w.slice(0, m.index), h('span', { class: 'chunk', style: 'color:' + (m[1] === 'nk' ? NKCOL : '#0E8584') }, m[1]));
  }
  const PIC = {   /* simple original pictures for words with no story art */
    sink: '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M58 18 v-8 h22 v8" stroke="#8a93a6" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="54" y="22" width="10" height="16" rx="3" fill="#8a93a6"/><path d="M14 40 h92 q0 40 -46 40 q-46 0 -46 -40z" fill="#dfe8f2" stroke="#2b2540" stroke-width="4"/><ellipse cx="60" cy="44" rx="40" ry="6" fill="#9fd3f0"/><rect x="52" y="78" width="16" height="16" fill="#8a93a6"/></svg>',
    ink: '<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="38" y="10" width="44" height="14" rx="3" fill="#2b2540"/><path d="M32 26 h56 v54 q0 10 -10 10 h-36 q-10 0 -10 -10z" fill="#3b4bd6" stroke="#2b2540" stroke-width="4"/><rect x="40" y="46" width="40" height="22" rx="4" fill="#fff8e7"/><path d="M96 70 q8 12 0 18 q-8 -6 0 -18z" fill="#3b4bd6"/></svg>',
    'face:glad': '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="#FFD76A" stroke="#2b2540" stroke-width="4"/><circle cx="36" cy="42" r="5" fill="#2b2540"/><circle cx="64" cy="42" r="5" fill="#2b2540"/><path d="M30 60 q20 22 40 0" stroke="#2b2540" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
    'face:sad': '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="#A9D4F5" stroke="#2b2540" stroke-width="4"/><circle cx="36" cy="42" r="5" fill="#2b2540"/><circle cx="64" cy="42" r="5" fill="#2b2540"/><path d="M32 72 q18 -18 36 0" stroke="#2b2540" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
    'face:mad': '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="#F59A8B" stroke="#2b2540" stroke-width="4"/><path d="M26 32 l18 8 M74 32 l-18 8" stroke="#2b2540" stroke-width="5" stroke-linecap="round"/><circle cx="37" cy="46" r="5" fill="#2b2540"/><circle cx="63" cy="46" r="5" fill="#2b2540"/><path d="M34 70 h32" stroke="#2b2540" stroke-width="5" stroke-linecap="round"/></svg>'
  };
  const picFor = (w, src) => { src = src || ({ skunk: 'img/nk_c_skunk.webp', trunk: 'img/nk_c_trunk.webp' })[w] || w;
    return /^img\//.test(src) ? h('img', { class: 'nkpic', src, alt: '' }) : h('span', { class: 'nkpic svgpic', html: PIC[src] || '' }); };

  /* ---------- the unit: steps in the approved order ---------- */
  const ACT = IR.nkActs;
  const STEPS = [
    { id: 'meet', title: 'Meet nk', group: 'lesson', run: runMeet, color: '#1FA6A6' },
    { id: 'listen', title: 'Story Time', group: 'story', run: runListen, color: '#8E5BD6' },
    { id: 'hear', title: 'Hear and Pick', group: 'activities', run: ACT.hear, color: '#7E57C2' },
    { id: 'bells', title: 'Ring every bell and learn its sounds', group: 'activities', run: ACT.bells, color: '#E8731C' },
    { id: 'build', title: 'Build-a-Word', group: 'activities', run: ACT.build, color: '#E8603C' },
    { id: 'chain', title: 'Word Chains', group: 'activities', run: ACT.chain, color: '#C95A10' },
    { id: 'scramble', title: 'Scrambled Letters', group: 'activities', run: ACT.scramble, color: '#D9631A' },
    { id: 'feed', title: 'Feed Zip', group: 'activities', run: ACT.feed, color: '#D98E00' },
    { id: 'sentence', title: 'Sentence Bridge', group: 'activities', run: ACT.sentence, color: '#2E9E6B' },
    { id: 'read', title: 'Now You Read It', group: 'activities', run: runRead, color: '#8E5BD6' },
    { id: 'ngnk', title: 'ng or nk?', group: 'activities', run: runNgnk, color: '#2E9E6B' },
    { id: 'check', title: 'Zip\u2019s Check', group: 'activities', run: runCheck, color: '#2b2540' },
    { id: 'comp', title: 'Story Check', group: 'extra', run: runComp, color: '#D98E00' },
    { id: 'rhyme', title: 'Rhyme Time', group: 'extra', run: runRhyme, color: '#C2408A' }
  ];
  /* one-line tips for grown-ups, in the same style as the ng unit */
  const TIPS = { hear: 'Let your child listen first, then point.', bells: 'Ask your child to read the word out loud first.', build: 'Say the word slowly together.', chain: 'Only one letter changes each time.', scramble: 'Say the word slowly, then find each part.', feed: 'Ask your child to read the word out loud, then feed Zip.', sentence: 'Read the sentence together at the end.', read: 'Reading it 3 times builds fluency.', ngnk: 'Say the word slowly. Listen for the k at the end.', check: 'Let your child work alone. Just cheer.', comp: 'Optional extra. Look back at the story page together.', rhyme: 'Optional extra. Read the poem together for fun.' };
  IR.nkTips = TIPS;
  const pid = (s) => 'nk_' + s.id;
  function sections() {
    const items = STEPS.map((s, i) => ({ id: s.id, title: s.title, group: s.group, href: '#/nk/' + s.id, num: i + 1, done: IR.isDone(pid(s)), min: (N.minutes || {})[s.id] || 3 }));
    items.filter((r) => r.group === 'activities').forEach((r, k) => { r.act = k + 1; r.label = 'Activity ' + (k + 1) + ': ' + r.title; });
    items.filter((r) => r.group === 'extra').forEach((r) => { r.optional = true; r.label = 'Extra: ' + r.title; });
    items.forEach((r) => { if (!r.label) r.label = r.title; }); return items;
  }
  IR.nk = { sections, steps: STEPS };
  /* progress for the island picker */
  IR.nkProgress = (id) => {
    if (id === 'nk') { const s = sections().filter((r) => !r.optional); return { total: s.length, done: s.filter((r) => r.done).length, min: s.reduce((a, r) => a + r.min, 0) }; }
    if (id === 'review') return { total: 1, done: IR.isDone('i3_review') ? 1 : 0, min: 6 };
    return null;
  };
  const nextUp = () => sections().find((r) => !r.done && !r.optional) || null;

  /* ---------- unit page (same layout as the ng unit page) ---------- */
  const LIGHT_KEY = 'ir_sess_nk';
  function loadLights() { try { return JSON.parse(sessionStorage.getItem(LIGHT_KEY) || '{}'); } catch (e) { return {}; } }
  function markLight(id) { const L = loadLights(); L[id] = 1; sessionStorage.setItem(LIGHT_KEY, JSON.stringify(L)); }
  function resetLights() { sessionStorage.removeItem(LIGHT_KEY); }
  function unitPage(app) {
    /* Completion lights reset when this lesson menu is opened from outside the unit (or closed). */
    const prev = IR._nkHashWas || '';
    if (!/^#\/nk(\/|$)/.test(prev) && prev !== '#/review3') resetLights();
    IR.newScreen(); const all = sections(); const secs = all.filter((r) => !r.optional); const extras = all.filter((r) => r.optional); const nx = nextUp(); const doneN = secs.filter((r) => r.done).length; const total = secs.length;
    const totalMin = secs.reduce((a, r) => a + r.min, 0);
    const star = (on) => h('span', { class: 'sstar' + (on ? ' on' : ''), 'aria-hidden': 'true' }, icon(on ? 'star' : 'starOutline'));
    const go = (r) => () => { Snd.stop(); location.hash = r.href; };
    const big = (r) => { const isNext = nx && nx.id === r.id; const lesson = r.group === 'lesson';
      const body = [
        h('span', { class: 'bkind' }, lesson ? 'Lesson' : 'Story'), r.done ? h('span', { class: 'bstar' }, star(true)) : null,
        IR.artFrame(lesson ? IR.lessonArt : 'img/frillC.webp', lesson ? '' : r.title),
        h('span', { class: 'stxt bbot' }, h('b', null, r.title), h('span', { class: 'smin' }, r.min + ' min'))
      ];
      if (lesson) {
        body.push(h('span', { class: 'sside' }, h('span', { class: 'slabel ' + (r.done ? 'rev' : isNext ? 'tag' : 'none') }, r.done ? 'Review lesson' : isNext ? 'Next' : '')));
        return h('li', { class: 'bigli' }, h('button', { class: 'stopcard bigbox lessonstop' + (r.done ? ' done' : '') + (isNext ? ' nextup' : ''), type: 'button', 'data-id': r.id, 'aria-label': r.label + '. ' + r.min + ' minutes.', onclick: go(r) }, ...body));
      }
      body.push(IR.storyRead(r.href));
      return h('li', { class: 'bigli' }, h('div', { class: 'stopcard bigbox storystop' + (r.done ? ' done' : '') + (isNext ? ' nextup' : ''), 'data-id': r.id }, ...body)); };
    const row = (r) => { const isNext = nx && nx.id === r.id;
      return h('li', null, h('button', { class: 'stopcard arow gamestop' + (r.done ? ' done' : '') + (isNext ? ' nextup' : ''), type: 'button', 'data-id': r.id, 'aria-label': r.label + '. ' + r.min + ' minutes.', onclick: go(r) },
        h('span', { class: 'snum', 'aria-hidden': 'true' }, r.optional ? '+' : String(r.act)), h('span', { class: 'stxt' }, h('b', null, r.title), TIPS[r.id] ? h('span', { class: 'sblurb' }, TIPS[r.id]) : null), h('span', { class: 'smin' }, r.min + ' min'),
        h('span', { class: 'sside' }, star(r.done), h('span', { class: 'slabel ' + (isNext ? 'tag' : 'none') }, isNext ? 'Next' : '')))); };
    const lit = loadLights();
    const lights = h('div', { class: 'clights', role: 'status', 'aria-label': 'Session progress lights' },
      h('span', { class: 'clab' }, 'This visit:'),
      h('span', { class: 'clightdots' }, ...secs.map((r) => h('span', { class: 'clight' + (lit[r.id] || r.done ? ' on' : ''), 'data-kind': r.group, 'data-id': r.id, title: r.title, 'aria-label': r.title + (lit[r.id] || r.done ? ' done this visit' : ' not yet') }))));
    const left = h('ul', { class: 'uA-left' }, ...secs.filter((r) => r.group !== 'activities').map(big));
    const right = h('section', { class: 'uA-right' }, lights, h('h2', { class: 'uA-h' }, 'Activities'), h('ol', { class: 'stoplist uA-acts' }, ...secs.filter((r) => r.group === 'activities').map(row)),
      extras.length ? h('h2', { class: 'uA-h uA-extra' }, 'Extras (optional)') : null, extras.length ? h('ul', { class: 'stoplist uA-acts uA-extras' }, ...extras.map(row)) : null);
    const complete = doneN === total;
    const foot = h('footer', { class: 'uA-foot island4 ' + (complete ? 'open' : 'locked') }, h('span', { class: 'i4ico', 'aria-hidden': 'true' }, icon(complete ? 'star' : 'lock')),
      h('span', { class: 'i4txt' }, h('b', null, 'Unit 4 Review'), h('small', null, complete ? 'Unlocked! Mix ng and nk.' : 'Finish all stars to unlock')), h('span', { class: 'i4count' }, doneN + ' of ' + total));
    app.append(h('div', { class: 'screen trailscreen unitpage unitA nkunit' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 4 \u00b7 Lesson 4.2 \u00b7 '), 'nk'),
        h('span', { class: 'uA-time' }, h('span', { class: 't-long' }, 'About ' + totalMin + ' min total'), h('span', { class: 't-short' }, totalMin + ' min')), IR.ui.gearButton()),
      IR.unitIntro ? IR.unitIntro('i3') : null,
      h('main', { class: 'uA-main' }, left, right), foot));
  }

  /* ---------- step shell (same top bar / instructions / Back-Next as the ng lessons) ---------- */
  function stepScreen(app, idx, OV) {
    const S0 = OV || STEPS[idx]; const scr = IR.newScreen(); let mistakes = 0;
    const fill = h('i'); const bar = h('div', { class: 'pbar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100 }, fill, ...STEPS.slice(1).map((_, k) => h('em', { style: `left:${(k + 1) / STEPS.length * 100}%` })));
    const instrBox = h('div', { class: 'instr' }); const stage = h('div', { class: 'stage' });
    let backH = null, nextH = null;
    const ctx = {
      scr, stage, miss() { mistakes++; },
      progress(f) { const v = Math.round(((idx + Math.max(0, Math.min(1, f))) / STEPS.length) * 100); fill.style.width = v + '%'; bar.setAttribute('aria-valuenow', v); },
      setInstr(text, p) { instrBox.innerHTML = ''; instrBox.style.display = text ? '' : 'none'; if (text) instrBox.append(speakerBtn(() => Snd.play(AU.p(p)), 'Hear the directions'), h('span', { class: 'itext' }, text)); },
      setBack(fn) { backH = fn; }, setNext(fn) { nextH = fn; },
      goBack() { Snd.stop(); if (backH && backH()) return; location.hash = idx > 0 ? '#/nk/' + STEPS[idx - 1].id : '#/nk'; },
      goNext() { Snd.stop(); if (nextH && nextH()) return; location.hash = idx < STEPS.length - 1 ? '#/nk/' + STEPS[idx + 1].id : '#/nk'; },
      setNextLabel(t) { nextBtn.firstChild.textContent = t; }, showNav(on) { nav.style.display = on === false ? 'none' : ''; },
      finish(starsOverride) {
        const stars = starsOverride || ((S0.id === 'meet' || S0.id === 'listen') ? 3 : mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1);
        markLight(S0.id); IR.recordActivity(S0.rec || pid(S0), stars); IR.touchStreak(); IR.save(); ctx.progress(1);
        const last = !!OV || idx === STEPS.length - 1; const nx = STEPS[idx + 1];
        const ov = h('div', { class: 'complete' }, h('div', { class: 'cbox' }, IR.celebration(false), h('h1', null, 'Great job!'), h('p', { class: 'lead' }, S0.title),
          h('div', { class: 'bigstars', 'aria-label': stars + ' stars' }, ...[1, 2, 3].map((k) => icon(k <= stars ? 'star' : 'starOutline', (k <= stars ? 'on' : 'off') + ' k' + k))),
          h('div', { class: 'row' }, h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/nk'; } }, icon('back'), 'Back to the trail'),
            h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = OV ? '#/home' : last ? '#/nk' : '#/nk/' + nx.id; } }, OV ? 'See the sky map' : last ? 'Back to the unit' : 'Next: ' + nx.title, icon('next')))));
        app.append(ov); Snd.play(IR.A.sfx.done);
      }
    };
    const nextBtn = h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, h('button', { class: 'btn big back', type: 'button', 'aria-label': 'Back', onclick: () => ctx.goBack() }, icon('back'), 'Back'), nextBtn);
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the unit', onclick: () => { location.hash = '#/nk'; } }, icon('close'));
    const screen = h('div', { class: 'screen lessonscreen nkstep nk-' + S0.id + (S0.group === 'lesson' ? ' is-lesson' : ''), style: '--c:' + S0.color }, h('header', { class: 'lesson-top' }, x, bar, IR.ui.homeButton(), unitSheetBtn(S0.id), IR.ui.gearButton()), instrBox, stage, nav);
    app.append(screen);
    if (S0.group === 'activities') IR.attachGameRules(ctx, screen, S0.title);
    ctx.progress(0); S0.run(ctx);
  }
  function unitSheetBtn(cur) {
    const btn = h('button', { class: 'unitbtn', type: 'button', 'aria-label': 'In this unit: show the lesson map' }, icon('list'), h('span', { class: 'ulab' }, 'In this unit'));
    btn.addEventListener('click', () => {
      const close = () => el.remove();
      const rows = sections().map((r) => h('li', null, h('button', { class: 'urow' + (r.id === cur ? ' cur' : '') + (r.done ? ' done' : ''), type: 'button', onclick: () => { Snd.stop(); close(); location.hash = r.href; } },
        r.done ? h('span', { class: 'ustar' }, icon('star')) : h('span', { class: 'ucircle' }), h('span', { class: 'ut' }, r.act ? h('span', { class: 'uact' }, 'Activity ' + r.act) : null, r.title))));
      const el = h('div', { class: 'usheet-scrim', onclick: (e) => { if (e.target === e.currentTarget) close(); } }, h('div', { class: 'usheet', role: 'dialog', 'aria-label': 'In this unit' },
        h('div', { class: 'ush-head' }, h('h2', null, 'In this unit'), h('button', { class: 'ush-x', type: 'button', 'aria-label': 'Close', onclick: close }, icon('close'))), h('ol', { class: 'ush-list' }, ...rows)));
      IR.ui.modalRoot.append(el);
    });
    return btn;
  }
  const nkCard = (big) => h('div', { class: 'ngpill joined nkcard' + (big ? '' : ' small') }, h('span', { class: 'l n' }, 'n'), h('span', { class: 'l g' }, 'k'));

  /* 1. Meet the sound */
  function runMeet(ctx) {
    ctx.setInstr('', null); const st = ctx.stage; let i = 0;
    const beats = [{ who: 'zip', p: 'm1', img: 'img/nk_p1.webp' }, { who: 'frill', p: 'm2', img: 'img/nk_p3.webp', tap: true }, { who: 'zip', p: 'm3', img: 'img/nk_p2.webp', tap: true }];
    const show = () => { const b = beats[i]; ctx.progress(i / beats.length); st.innerHTML = '';
      const card = nkCard(true); const tapBtn = h('div', { class: 'nkcardbtn' }, card, phBtn());
      st.append(h('div', { class: 'activity nkmeet' }, h('div', { class: 'bubble ' + b.who }, h('b', { class: 'who' }, b.who === 'zip' ? 'Zip' : 'Frill'), h('p', null, N.prompts[b.p].text), speakerBtn(() => Snd.play(AU.p(b.p)), 'Hear this again')),
        h('div', { class: 'meetrow' }, h('div', { class: 'panelwrap small' }, h('img', { class: 'panel', src: b.img, alt: '' })), tapBtn),
        h('p', { class: 'cap' }, 'n and k glued at the end, like in sink. Tap a word to hear it.'),
        h('div', { class: 'chips' }, ...['sink', 'pink', 'bank', 'junk'].map((w) => h('button', { class: 'chip', type: 'button', onclick: () => say(w) }, colorNk(w))))));
      ctx.setNextLabel(i === beats.length - 1 ? 'Watch Zip' : 'Next');
      Snd.seq([AU.p(b.p)], 250); };
    ctx.setNext(() => { if (i < beats.length - 1) { i++; show(); } else runIdo(ctx); return true; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }
  /* future recorded nk sound: hidden until audio/phonemes/nk.mp3 exists (her own recording). Computer-made nk_sound / nk_l_* / nk_c_* files are no longer played. */
  function phBtn() { const b = h('button', { class: 'btn', type: 'button', hidden: true, onclick: () => IR.playPhoneme && IR.playPhoneme('nk') }, icon('speaker'), 'Hear nk'); if (IR.hasPhoneme) IR.hasPhoneme('nk').then((ok) => { if (ok) b.hidden = false; }); return b; }
  const parts = (w) => w.match(/nk|th|./g);
  function tilesFor(w) {
    const gs = parts(w) || [];
    return h('div', { class: 'blendrow' }, ...gs.map((l, i) => {
      const silent = i === gs.length - 1 && l === 'e';
      return h('button', { class: 'btile' + (l === 'nk' ? ' nk' : '') + (silent ? ' silent' : ''), type: 'button', 'data-l': l, 'data-silent': silent ? '1' : '0' }, l);
    }));
  }
  function armBlend(row, blend) {
    const tiles = $$('.btile', row).map((t) => ({ silent: t.dataset.silent === '1', lit: t.classList.contains('lit') }));
    const ready = IR.blendSoundsReady(tiles);
    blend.disabled = !ready;
    blend.classList.toggle('glow', ready);
  }
  /* 2. I do: Zip blends sound by sound */
  function runIdo(ctx) {
    ctx.setInstr('I do: watch Zip. Zip looks at each letter, then reads the whole word.', 'ido2'); const st = ctx.stage; let i = 0; const W = N.ido;
    const show = async () => { const w = W[i]; ctx.progress(i / W.length); st.innerHTML = ''; const row = tilesFor(w); const out = h('p', { class: 'blendout' }, '\u00a0');
      const play = async () => { Snd.stop(); const id = Snd.id; const ts = $$('.btile', row); out.textContent = '\u00a0';
        for (const t of ts) { if (Snd.id !== id) return; ts.forEach((x) => x.classList.remove('lit')); t.classList.add('lit'); await sleep(650); }
        if (Snd.id !== id) return; ts.forEach((x) => x.classList.add('lit')); out.innerHTML = ''; out.append(colorNk(w)); await Snd.play(AU.w(w), { keep: true }); };
      st.append(h('div', { class: 'activity' }, h('div', { class: 'zipsays' }, h('img', { class: 'char zip mini', src: 'img/zip.webp', alt: 'Zip' }), h('span', null, 'Zip blends: ' + w)), row, out,
        h('button', { class: 'btn', type: 'button', onclick: play }, icon('replay'), 'Watch again')));
      ctx.setNextLabel(i === W.length - 1 ? 'Finish' : 'Next'); if (i === 0) await Snd.seq([AU.p('ido2')], 200); if (ctx.scr.ok()) play(); };
    ctx.setNext(() => { if (i < W.length - 1) { i++; show(); } else runWedo(ctx); return true; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }
  /* 3. We do: tap each letter, then blend */
  function runWedo(ctx) {
    ctx.setInstr('We do: tap each letter and say its sound. Then tap Blend it.', 'wedo2'); ctx.setNextLabel('Next'); const st = ctx.stage; let i = 0; const W = N.wedo;
    const show = () => { const w = W[i]; ctx.progress(i / W.length); st.innerHTML = ''; const row = tilesFor(w); const out = h('p', { class: 'blendout' }, '\u00a0');
      const blend = h('button', { class: 'btn big primary', type: 'button', disabled: true }, icon('speaker'), 'Blend it');
      $$('.btile', row).forEach((t) => {
        const mark = () => { t.classList.add('lit'); armBlend(row, blend); };
        t.addEventListener('pointerup', mark);
        t.addEventListener('click', mark);
      });
      blend.addEventListener('click', async () => { if (blend.disabled) return; out.innerHTML = ''; out.append(colorNk(w)); await IR.ding(); await Snd.play(AU.w(w)); if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return; if (i < W.length - 1) { i++; show(); } else runYoudo(ctx); });
      st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Word ' + (i + 1) + ' of ' + W.length), row, out, blend)); };
    ctx.setNext(() => { if (i < W.length - 1) { i++; show(); } else runYoudo(ctx); return true; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    Snd.play(AU.p('wedo2')); show();
  }
  /* generic "hear it, tap the right choice" round runner (used by You do, ng or nk?, Review) */
  function pickRounds(ctx, rounds, build, onAll) {
    let r = 0; const got = new Set(); const st = ctx.stage;
    const round = () => { const R = rounds[r]; ctx.progress(got.size / rounds.length); st.innerHTML = ''; let locked = false, misses = 0;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const { body, buttons } = build(R);
      buttons.forEach(({ el, ok, word }) => el.addEventListener('click', async () => {
        if (locked || el.classList.contains('tried')) return;
        if (ok) { locked = true; el.classList.add('right'); buttons.forEach((b) => { if (b.el !== el) b.el.classList.add('fade'); }); status.textContent = 'Yes! ' + R.word;
          await IR.ding(); await say(R.word); if (!ctx.scr.ok()) return; await sleep(400); if (!ctx.scr.ok()) return;
          got.add(r); if (got.size >= rounds.length) { onAll ? onAll() : ctx.finish(); } else { r = (r + 1) % rounds.length; while (got.has(r)) r = (r + 1) % rounds.length; round(); } }
        else { misses++; ctx.miss(); el.classList.add('tried'); status.textContent = 'Not that one. Listen again.'; await IR.tryAgain(AU.w(R.word)); if (misses >= 2) buttons.forEach((b) => { if (b.ok) b.el.classList.add('hint'); }); }
      }));
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      st.append(h('div', { class: 'activity' }, spk, body, status)); say(R.word); };
    ctx.setBack(() => { if (r > 0) { r--; round(); return true; } return false; });
    ctx.setNext(() => { if (r < rounds.length - 1) { r++; round(); return true; } return false; });
    round();
  }
  /* 4. You do: picture choice */
  function runYoudo(ctx) {
    ctx.setInstr('You do: listen. Tap the picture of the word you hear.', 'youdo');
    pickRounds(ctx, N.youdo, (R) => { const buttons = shuffle(R.choices).map((w) => ({ word: w, ok: w === R.word, el: h('button', { class: 'choice picchoice', type: 'button', 'data-w': w, 'aria-label': w }, picFor(w), h('span', { class: 'pw' }, w)) }));
      return { body: h('div', { class: 'choices pics3' }, ...buttons.map((b) => b.el)), buttons }; });
  }
  /* 5. ng or nk? */
  function runNgnk(ctx) {
    ctx.setInstr('Listen. Does it end with ng or nk? Tap the ending.', 'ngnk');
    pickRounds(ctx, N.ngnk, (R) => { const slot = h('span', { class: 'chunkslot' }, '?');
      const buttons = ['ng', 'nk'].map((e) => { const el = h('button', { class: 'choice endchoice', type: 'button', 'data-w': e, style: 'color:' + (e === 'nk' ? NKCOL : '#0E8584') }, e); el.addEventListener('click', () => { if (e === R.answer) { slot.textContent = e; slot.style.color = el.style.color; } }); return { word: e, ok: e === R.answer, el }; });
      return { body: h('div', null, h('div', { class: 'wordframe' }, h('span', { class: 'onset' }, R.onset), slot), h('div', { class: 'choices two' }, ...buttons.map((b) => b.el))), buttons }; });
  }
  /* 6. Heart words */
  function runHeart(ctx, after) {
    ctx.setInstr('Tap each new or heart word to hear it before the story.', 'heart'); const seen = new Set();
    const words = (N.heart || []).concat(N.newWords || []);
    const total = Math.max(1, words.length);
    const row = h('div', { class: 'hearts' }, ...words.map((it) => {
      const w = it.w || it; const irregular = !!(it.w);
      return h('button', { class: 'heartchip' + (irregular ? '' : ' newchip'), type: 'button', onclick: (e) => {
        e.currentTarget.classList.add('seen'); seen.add(w); ctx.progress(seen.size / total);
        const hx = irregular ? ('audio/nk_hx_' + w + '.mp3') : null;
        Snd.seq([AU.w(w)].concat(hx ? [hx] : []), 200);
        if (seen.size === total) done.classList.add('glow'); } }, irregular ? h('span', { class: 'heartmark', 'aria-hidden': 'true' }, '\u2665') : h('span', { class: 'heartmark newmark', 'aria-hidden': 'true' }, '\u2605'), h('span', { class: 'word' }, w)); }));
    const done = h('button', { class: 'btn big primary', type: 'button', onclick: () => { Snd.stop(); if (after) after(); else ctx.finish(3); } }, 'Listen to the story', icon('next'));
    ctx.stage.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Heart words and new words'), row, h('p', { class: 'small heartnote' }, 'Hearts are irregular. Stars are new words in this story.'), h('div', { class: 'row center' }, done)));
    Snd.play(AU.p('heart'));
  }
  function wordsInto(el, pg) { el.innerHTML = ''; pg.words.forEach((w, k) => el.append(h('span', { class: 'w', 'data-k': k }, w), ' ')); }
  function hl(pg, ws) { return (t) => pg.t.forEach((tt, k) => { const e = ws[k]; if (!e) return; e.classList.toggle('hl', t >= tt[0] - 0.04 && t < (pg.t[k + 1] ? pg.t[k + 1][0] - 0.04 : 99)); e.classList.toggle('read', t >= tt[1]); }); }
  /* 7. Story Time: same behaviour as ng Story Time (auto-read each page, Read again / Next page / Previous page, Finish, tap-to-hear fallback) */
  function runListen(ctx) { ctx.showNav(false); if (!ctx._heartDone) { ctx._heartDone = true; ctx.setNext(() => { Snd.stop(); runListen(ctx); return true; }); runHeart(ctx, () => runListen(ctx)); return; } ctx.stage.innerHTML = ''; ctx.setInstr('Listen to the story and follow along.', 'listen'); const st = ctx.stage;
    const pages = N.story; let p = 0, token = 0, mode = 'reading', finished = false; const heard = new Set();
    const picEl = h('img', { class: 'panel', alt: '' }); const sentEl = h('p', { class: 'sentence', 'aria-live': 'polite' });
    const dots = h('div', { class: 'pagedots' }, ...pages.map(() => h('i'))); const label = h('p', { class: 'small story-say' }); const ctl = h('div', { class: 'row center story-ctl' });
    const allHeard = () => heard.size >= pages.length; const firstUnheard = () => pages.findIndex((_, k) => !heard.has(k));
    const btn = (cls, ico, text, fn) => { const b = h('button', { class: 'btn big ' + cls, type: 'button' }, ico ? icon(ico) : null, text); b.addEventListener('click', fn); return b; };
    function renderCtl() { ctl.innerHTML = ''; const last = p === pages.length - 1;
      const prev = btn('story-prev', 'back', 'Previous page', () => { if (p > 0) goPage(p - 1); }); if (p === 0) prev.disabled = true;
      let mid, nextLbl = 'Next page', nextFn = () => { if (p < pages.length - 1) goPage(p + 1); };
      if (mode === 'reading') {
        label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length + '. Listening\u2026';
        mid = btn('story-stop', 'pause', 'Pause', () => { halt(); mode = 'stopped'; renderCtl(); });
        nextFn = () => { halt(); if (p < pages.length - 1) goPage(p + 1); };
      } else if (mode === 'blocked') {
        label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length;
        mid = btn('primary story-tap', 'speaker', 'Tap to hear', () => playPage());
      } else {
        label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length + '.';
        mid = btn('story-again', 'replay', 'Read again', () => playPage());
        const u = firstUnheard();
        if (last) { if (allHeard()) { nextLbl = 'Finish'; nextFn = finishNow; } else { nextLbl = 'Hear page ' + (u + 1); nextFn = () => goPage(u); } }
      }
      const nb = btn('primary story-nextpage' + (mode !== 'reading' ? ' glow' : ''), null, nextLbl, nextFn); nb.append(icon('next'));
      if (last && mode !== 'reading' && allHeard()) { /* ok */ } else if (last && mode === 'reading') nb.disabled = true;
      ctl.append(prev, mid, nb); }
    function setPage(i) { p = i; picEl.src = pages[p].img; wordsInto(sentEl, pages[p]); $$('i', dots).forEach((d, k) => { d.classList.toggle('cur', k === p); d.classList.toggle('seen', heard.has(k)); }); ctx.progress(heard.size / pages.length); }
    function playPage() { const pg = pages[p]; const ws = $$('.w', sentEl); const my = ++token; mode = 'reading'; Snd.hideFallback(); renderCtl();
      return Snd.play(pg.audio, { onTime: hl(pg, ws) }).then((ok) => { ws.forEach((e) => e.classList.remove('hl', 'read')); if (my !== token || !ctx.scr.ok()) return;
        if (ok) { heard.add(p); mode = 'done'; } else { mode = 'blocked'; Snd.hideFallback(); } setPage(p); renderCtl(); }); }
    const halt = () => { token++; Snd.stop(); };
    const finishNow = () => { if (finished) return; finished = true; halt(); ctx.finish(3); };
    const goPage = (i) => { halt(); setPage(i); playPage(); };
    ctx.setBack(() => { if (p > 0) { goPage(p - 1); return true; } return false; });
    ctx.setNext(() => { if (p < pages.length - 1) { goPage(p + 1); return true; } if (allHeard()) { finishNow(); return true; } return false; });
    st.append(h('div', { class: 'activity story listenmode' }, h('div', { class: 'panelwrap' }, picEl), h('div', { class: 'sentrow' }, sentEl), dots, label, ctl));
    setPage(0); playPage();
    IR._nkStory = { heardAll: () => { pages.forEach((_, k) => heard.add(k)); mode = 'done'; setPage(pages.length - 1); renderCtl(); } };
  }
  /* 8. Now You Read It (same as ng) */
  function runRead(ctx) {
    ctx.setInstr('Tap a speaker to hear a sentence. Then you read it!', 'read'); ctx.showNav(false);
    const pages = N.story; let p = 0, reached = 0; const heard = new Set(); const S = IR.S(); S.reads = S.reads || {};
    const picEl = h('img', { class: 'panel', alt: '' }); const sentEl = h('p', { class: 'sentence' }); const dots = h('div', { class: 'pagedots' }, ...pages.map(() => h('i')));
    const spk = speakerBtn(() => play(), 'Hear this sentence'); spk.classList.add('huge');
    const prev = h('button', { class: 'btn small back', type: 'button' }, icon('back'), 'Back'); const next = h('button', { class: 'btn small primary next', type: 'button' }, 'Next', icon('next'));
    const reads = h('div', { class: 'reads' }); const readBtn = h('button', { class: 'btn small good', type: 'button' }, icon('check'), 'I read it to a grown-up');
    const readIt = () => heard.size >= pages.length || (S.reads.nk || 0) > 0;
    const renderReads = () => { const n = S.reads.nk || 0; reads.innerHTML = ''; reads.append(h('span', null, 'Read it 3 times: '), ...[0, 1, 2].map((k) => h('i', { class: 'rd' + (k < n ? ' on' : '') }))); };
    const setLbl = () => { next.firstChild.textContent = p === pages.length - 1 ? (readIt() ? 'Finish' : 'Next') : 'Next'; };
    readBtn.addEventListener('click', () => { S.reads.nk = Math.min(3, (S.reads.nk || 0) + 1); IR.save(); renderReads(); setLbl(); });
    function setPage(i) { p = i; reached = Math.max(reached, p); picEl.src = pages[p].img; wordsInto(sentEl, pages[p]); $$('i', dots).forEach((d, k) => { d.classList.toggle('cur', k === p); d.classList.toggle('seen', k <= reached); }); setLbl(); ctx.progress(reached / (pages.length - 1)); }
    function play() { const pg = pages[p]; const ws = $$('.w', sentEl); return Snd.play(pg.audio, { onTime: hl(pg, ws) }).then((ok) => { ws.forEach((e) => e.classList.remove('hl', 'read')); if (ok) { heard.add(p); setLbl(); } }); }
    prev.addEventListener('click', () => { if (p > 0) { setPage(p - 1); play(); } else ctx.goBack(); });
    next.addEventListener('click', () => { if (p < pages.length - 1) { setPage(p + 1); play(); } else { Snd.stop(); if (readIt()) ctx.finish(); else location.hash = '#/nk/comp'; } });
    ctx.stage.append(h('div', { class: 'activity story' }, h('div', { class: 'panelwrap' }, picEl), h('div', { class: 'sentrow' }, spk, sentEl), dots, h('div', { class: 'row' }, prev, next), h('div', { class: 'row' }, readBtn, reads)));
    renderReads(); setPage(0); Snd.play(AU.p('read'));
  }
  /* 9. Story Check (reusable comprehension type): question read aloud, 3 picture+word answers, gentle hint with the story page, no penalties */
  IR.runComprehension = function (ctx, items, opts) {
    let q = 0; const st = ctx.stage; const pages = opts.pages;
    const step = () => { const it = items[q]; ctx.progress(q / items.length); st.innerHTML = ''; let locked = false;
      const hint = h('div', { class: 'comphint', 'aria-live': 'polite' });
      const grid = h('div', { class: 'choices pics3' }, ...it.choices.map(([w, img]) => { const b = h('button', { class: 'choice picchoice', type: 'button', 'data-w': w, 'aria-label': w }, picFor(w, img), h('span', { class: 'pw' }, w));
        b.addEventListener('click', async () => { if (locked || b.classList.contains('tried')) return;
          if (w === it.answer) { locked = true; b.classList.add('right'); hint.innerHTML = ''; hint.append(h('p', { class: 'status' }, 'Yes! ' + w + '.')); await IR.ding(); await say(w); if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return; q++; if (q < items.length) step(); else ctx.finish(3); }
          else { b.classList.add('tried'); const pg = pages[it.page - 1]; hint.innerHTML = '';
            hint.append(h('img', { class: 'hintthumb', src: pg.img, alt: 'Story page ' + it.page }), h('div', null, h('p', { class: 'hinttxt' }, opts.hintText(it, q)), h('p', { class: 'hintpage' }, 'Page ' + it.page + ': ' + pg.text)));
            Snd.seq([IR.A.sfx.tryagain, opts.hintAudio(q)], 150); } }); return b; }));
      st.append(h('div', { class: 'activity comp' }, h('p', { class: 'small' }, 'Question ' + (q + 1) + ' of ' + items.length), h('div', { class: 'compq' }, speakerBtn(() => Snd.play(opts.qAudio(q)), 'Hear the question'), h('p', { class: 'bigprompt' }, it.q)), grid, hint));
      Snd.play(opts.qAudio(q)); };
    ctx.setBack(() => { if (q > 0) { q--; step(); return true; } return false; });
    ctx.setNext(() => { if (q < items.length - 1) { q++; step(); return true; } return false; });
    step();
  };
  const HINTS = { recall: 'Look at this page again. Who pulls out what?', cause: 'Look at this page again. What hops out of the trunk?', sequence: 'Look at this page again. This came out first.', feeling: 'Look at this page again. Is the skunk glad, sad, or mad?' };
  function runComp(ctx) {
    ctx.setInstr('Think about the story. Listen, then tap the answer.', 'comp');
    IR.runComprehension(ctx, N.comp, { pages: N.story, qAudio: (q) => AU.p('q' + (q + 1)), hintAudio: (q) => AU.p('qh' + (q + 1)), hintText: (it) => HINTS[it.kind] });
  }
  /* 10. Rhyme Time (reusable): each line read aloud, child taps the rhyming word, small Zip/Frill reaction, then the whole poem plays back for read-along */
  IR.runRhymeTime = function (ctx, lines, opts) {
    let i = 0; const st = ctx.stage; const done = [];
    /* couplets: L.lead (read aloud, always shown) + L.line (ends in ___ = the tap word). Old single-line items (no lead) still work. */
    const tail = (L) => L.line.split('___');
    const poemBox = () => h('div', { class: 'poem' }, ...lines.flatMap((L, k) => { const shown = k < done.length || k === i; const out = [];
      if (L.lead) out.push(h('p', { class: 'pline lead' + (k === i ? ' cur' : ''), 'data-k': k }, shown ? L.lead : ''));
      out.push(h('p', { class: 'pline' + (k < done.length ? ' got' : '') + (k === i ? ' cur' : ''), 'data-k': k },
        k < done.length ? [tail(L)[0], h('b', { class: 'rw' }, L.answer), tail(L)[1]] : k === i ? [tail(L)[0], h('span', { class: 'blank' }, '\u00a0?\u00a0'), tail(L)[1]] : ''));
      return out; }));
    const step = () => { const L = lines[i]; ctx.progress(i / lines.length); st.innerHTML = ''; let locked = false;
      const react = h('div', { class: 'rreact', 'aria-live': 'polite' });
      const grid = h('div', { class: 'choices three' }, ...shuffle(L.choices).map((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorNk(w));
        b.addEventListener('click', async () => { if (locked || b.classList.contains('tried')) return; say(w);
          if (w === L.answer) { locked = true; b.classList.add('right'); done.push(w); const who = i % 2 ? 'frill' : 'zip';
            react.innerHTML = ''; react.append(h('img', { class: 'rchar ' + who, src: 'img/' + who + '.webp', alt: '' }), h('span', { class: 'rbubble' }, who === 'zip' ? 'Yes! That rhymes!' : 'Nice rhyme!'));
            await sleep(500); await Snd.seq([IR.A.sfx.ding, opts.yay(who), opts.full(i)], 150); if (!ctx.scr.ok()) return; await sleep(400); if (!ctx.scr.ok()) return; i++; if (i < lines.length) step(); else finale(); }
          else { b.classList.add('tried'); ctx.miss(); await sleep(300); Snd.seq([IR.A.sfx.tryagain, opts.line(i)], 150); } }); return b; }));
      st.append(h('div', { class: 'activity rhyme' }, h('p', { class: 'bigprompt' }, 'Rhyme Time'), poemBox(), h('div', { class: 'compq' }, speakerBtn(() => Snd.play(opts.line(i)), 'Hear the line again'), h('span', { class: 'small' }, 'Tap the word that rhymes.')), grid, react));
      Snd.play(opts.line(i)); };
    const finale = () => { ctx.progress(0.95); st.innerHTML = ''; i = lines.length; ctx.setNextLabel('Finish'); const box = poemBox();
      const playAll = async () => { Snd.stop(); const id = Snd.id; const ps = $$('.pline', box); await Snd.play(opts.end, { keep: true });
        for (let k = 0; k < ps.length; k++) { if (Snd.id !== id) return; ps.forEach((x) => x.classList.remove('hlline')); ps[k].classList.add('hlline'); await Snd.play(opts.pline && lines[0].lead ? opts.pline(k) : opts.full(k), { keep: true }); await sleep(300); }
        ps.forEach((x) => x.classList.remove('hlline')); };
      st.append(h('div', { class: 'activity rhyme' }, h('p', { class: 'bigprompt' }, 'Read the whole poem!'), box,
        h('div', { class: 'row center' }, h('button', { class: 'btn', type: 'button', onclick: playAll }, icon('replay'), 'Play the poem'), h('button', { class: 'btn primary', type: 'button', onclick: () => ctx.finish() }, 'Finish', icon('next')))));
      playAll(); };
    ctx.setBack(() => { if (i > 0 && i < lines.length) { i--; done.length = Math.min(done.length, i); step(); return true; } return false; });
    ctx.setNext(() => { if (i < lines.length - 1) { done.push(lines[i].answer); i++; step(); return true; } if (i === lines.length - 1) { done.push(lines[i].answer); finale(); return true; } if (i >= lines.length) { ctx.finish(); return true; } return false; });
    step();
  };
  function runRhyme(ctx) {
    ctx.setInstr('Listen to each line. Tap the word that rhymes.', 'rhyme');
    IR.runRhymeTime(ctx, N.rhyme, { line: (k) => AU.p('r' + (k + 1)), full: (k) => AU.p('rf' + (k + 1)), yay: (who) => AU.p(who === 'zip' ? 'yay_z' : 'yay_f'), end: AU.p('rhyme_end'), pline: (k) => AU.p('rl' + (k + 1)) });
  }
  /* 11. Zip's Check: 10 items, 9-10 move on, 7-8 review, <=6 re-teach, sticker on the map */
  function runCheck(ctx) {
    const items = N.check; let q = 0, tok = 0; const recs = []; const st = ctx.stage; ctx.setInstr('', null);
    const finish = () => { const S = IR.S(); const score = recs.filter(Boolean).length; S.nkCheck = S.nkCheck || { best: null, attempts: 0 };
      S.nkCheck.last = score; S.nkCheck.attempts++; S.nkCheck.best = Math.max(S.nkCheck.best || 0, score); if (score >= 9) S.nkSticker = true;
      IR.recordActivity('nk_check', score >= 9 ? 3 : score >= 7 ? 2 : 1); IR.touchStreak(); IR.save(); location.hash = '#/nk/result'; };
    const step = () => { if (q >= items.length) return finish(); const it = items[q]; const my = ++tok; ctx.progress(q / items.length); st.innerHTML = '';
      const cat = IR.catCount(items, q, (x) => x.type || 'q'); if (ctx.count) ctx.count(cat.i, cat.n);
      const status = h('p', { class: 'status' }, 'Question ' + (q + 1) + ' of ' + items.length); let locked = false;
      const ans = async (ok, b) => { if (locked) return; locked = true; recs[q] = !!ok; b.classList.add('picked'); $$('.choice', st).forEach((x) => { if (x !== b) x.classList.add('fade'); });
        status.textContent = 'Thank you! Next one.'; Snd.play(IR.A.sfx.tap); const qq = q; await sleep(700); if (!ctx.scr.ok() || my !== tok || q !== qq) return; q++; step(); };
      const body = h('div', { class: 'activity' });
      if (it.silly) body.append(h('div', { class: 'sillytag' }, h('img', { src: 'img/zip.webp', alt: '' }), h('span', null, 'Zip\u2019s silly word!')));
      if (it.type === 'pick') { const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
        body.append(spk, h('div', { class: 'choices' }, ...shuffle(it.choices).map((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, w); b.addEventListener('click', () => ans(w === it.word, b)); return b; }))); say(it.word); }
      else if (it.type === 'end') { const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge'); const slot = h('span', { class: 'chunkslot' }, '?');
        body.append(spk, h('div', { class: 'wordframe' }, h('span', { class: 'onset' }, it.onset), slot), h('div', { class: 'choices two' }, ...['ng', 'nk'].map((e) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': e }, e); b.addEventListener('click', () => { slot.textContent = e; ans(e === it.answer, b); }); return b; })));
        Snd.seq([AU.p('end'), AU.w(it.word)], 200); }
      else { body.append(h('p', { class: 'bigprompt' }, 'Tap the word that has nk.'), speakerBtn(() => Snd.play(AU.p('which')), 'Hear the question'),
          h('div', { class: 'choices' }, ...shuffle(it.choices).map((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, w); b.addEventListener('click', () => ans(w === it.answer, b)); return b; }))); Snd.play(AU.p('which')); }
      body.append(status); st.append(body); };
    let inQ = false;
    ctx.setNext(() => { if (!inQ) { inQ = true; step(); return true; } tok++; if (q < items.length - 1) { q++; step(); return true; } if (items.every((_, k) => recs[k] !== undefined)) { finish(); return true; } return false; });
    ctx.setBack(() => { if (!inQ) return false; tok++; if (q > 0) { q--; step(); } else { inQ = false; intro(); } return true; });
    const intro = () => { st.innerHTML = ''; ctx.progress(0); st.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Zip\u2019s Check'), h('p', null, '10 quick questions. There is no rush!'),
      h('button', { class: 'btn big primary', type: 'button', onclick: () => { inQ = true; step(); } }, 'Start the check', icon('next')))); };
    intro(); Snd.play(AU.p('check'));
  }
  function resultPage(app) {
    IR.newScreen(); const S = IR.S(); const score = (S.nkCheck && S.nkCheck.last) || 0; const wrap = h('div', { class: 'result' });
    const trail = h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/nk'; } }, icon('back'), 'Back to the trail');
    const again = h('button', { class: 'btn big next', type: 'button', onclick: () => { location.hash = '#/nk/check'; } }, 'Try the check again');
    const home = h('button', { class: 'btn big primary next', type: 'button', onclick: () => { location.hash = '#/home'; } }, 'See the sky map');
    if (score < 7) wrap.append(h('img', { class: 'char zip big', src: 'img/zip.webp', alt: 'Zip' }));
    if (score >= 9) wrap.append(h('div', { class: 'badgeart', html: IR.ICON.badge }), h('h1', null, 'nk sticker!'), h('p', { class: 'lead' }, 'Your nk sticker is on the map.'), h('p', null, 'You got ' + score + ' out of 10.'), h('div', { class: 'row' }, home, trail));
    else if (score >= 7) wrap.append(h('h1', null, 'Review islet'), h('p', { class: 'lead' }, 'Good work! Let\u2019s practice a little more, then try again.'), h('p', null, 'You got ' + score + ' out of 10. Replay Hear and Pick or ng or nk?, then take the check again.'), h('div', { class: 'row' }, trail, again));
    else wrap.append(h('h1', null, 'Re-teach islet'), h('p', { class: 'lead' }, 'Thank you for trying! Let\u2019s learn nk again with a grown-up.'), h('p', null, 'You got ' + score + ' out of 10. A grown-up can teach the nk sound again with you, then try the check again.'), h('div', { class: 'row' }, trail, again));
    if (score >= 7) wrap.prepend(IR.celebration(score >= 9));
    app.append(h('div', { class: 'screen resultscreen' }, h('div', { class: 'unitbar' }, IR.ui.homeButton()), wrap)); Snd.play(score >= 9 ? IR.A.sfx.gong : IR.A.sfx.done);
  }
  /* Island 3 Review: ng and nk mixed */
  function reviewPage(app) {
    const fake = { id: 'review', rec: 'i3_review', title: 'Unit 4 Review', color: '#0E8584', run: (ctx) => {
      ctx.setInstr('Listen. Is it ng or nk? Tap the word you hear.', 'review');
      pickRounds(ctx, N.review, (R) => { const buttons = shuffle(R.choices).map((w) => ({ word: w, ok: w === R.word, el: h('button', { class: 'choice', type: 'button', 'data-w': w }, colorNk(w)) }));
        return { body: h('div', { class: 'choices two' }, ...buttons.map((b) => b.el)), buttons }; }, () => ctx.finish());
      Snd.play(AU.p('review')); } };
    stepScreen(app, STEPS.length - 1, fake);
    $('.nkstep').classList.add('reviewstep'); $('.nkstep .pbar').style.display = 'none';
  }
  IR.nkRoute = function (hash, app) {
    const was = IR._nkHashWas || '';
    if (/^#\/nk(\/|$)/.test(was) && !/^#\/nk(\/|$)/.test(hash) && hash !== '#/review3') resetLights();
    IR._nkHashWas = hash;
    let m;
    if (hash === '#/nk' || hash === '#/nk/') { unitPage(app); return true; }
    if (hash.startsWith('#/nk/result')) { resultPage(app); return true; }
    if ((m = /^#\/nk\/(\w+)/.exec(hash))) { const i = STEPS.findIndex((s) => s.id === m[1]); if (i < 0) return false; stepScreen(app, i); return true; }
    if (hash.startsWith('#/review3')) { reviewPage(app); return true; }
    return false;
  };
})();
