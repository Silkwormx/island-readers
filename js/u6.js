/* Unit 6 Endings (-s, -es, -ed, -ing). Same lesson shape as Unit 4: lesson, story, then 10 activities.
   Fish Pond is activity 9. Zip's Check is last. Original words. Data: data_u6.js. */
(function () {
  'use strict';
  const IR = window.IR; const N = window.IR_DATA_U6; if (!IR || !N) return;
  const { h, $, $$, sleep, shuffle, icon, Snd, A, speakerBtn } = IR;
  const W = (w) => 'audio/u6_w_' + String(w).toLowerCase().replace(/[^a-z]/g, '') + '.mp3';
  const P = (k) => 'audio/u6_p_' + k + '.mp3';
  const say = (w) => Snd.play(W(w));
  const ding = (w) => Snd.seq(w ? [A.sfx.ding, W(w)] : [A.sfx.ding], 90);
  const tryAgain = (src) => Snd.seq(src ? [A.sfx.tryagain, src] : [A.sfx.tryagain], 150);
  const ENDCOL = { s: '#2E9E6B', es: '#1F8FD6', ed: '#C2408A', ing: '#E8731C' };
  function endingOf(w) {
    const m = /(ing|es|ed|s)$/.exec(String(w).toLowerCase());
    if (!m || m.index < 2) return null;
    return m[1];
  }
  function colorEnd(w) {
    const e = endingOf(w); if (!e) return document.createTextNode(w);
    const i = String(w).length - e.length;
    return h('span', null, w.slice(0, i), h('span', { class: 'chunk', style: 'color:' + ENDCOL[e] }, w.slice(i)));
  }
  function parts(word) {
    let w = String(word); let end = '';
    const e = endingOf(w); if (e) { end = w.slice(w.length - e.length); w = w.slice(0, w.length - e.length); }
    const o = w.match(/sh|ch|th|ck|ng|nk|./gi) || [];
    if (end) o.push(end);
    return o;
  }

  const TIPS = {
    hear: 'Let your child listen first, then point.',
    bells: 'Ask your child to read the word out loud first.',
    build: 'Say the base word, then the ending.',
    chain: 'Only one part changes each time.',
    scramble: 'Say the word slowly, then find each part.',
    feed: 'Ask your child to read the word out loud, then feed Zip.',
    sentence: 'Read the sentence together at the end.',
    read: 'Reading it 3 times builds fluency.',
    fish: 'Catch only the fish with s, es, ed, or ing.',
    check: 'Let your child work alone. Just cheer.'
  };

  function runMeet(ctx) {
    ctx.setInstr('An ending sits on a base word. Listen, then read the examples.', 'meet');
    ctx.showNav(false);
    const chips = [['-s', 'cats', 's'], ['-es', 'boxes', 'es'], ['-ed', 'jumped', 'ed'], ['-ing', 'fishing', 'ing']];
    const row = h('div', { class: 'hearts' }, ...chips.map(([lab, w]) => h('button', { class: 'heartchip newchip', type: 'button', onclick: () => say(w) },
      h('span', { class: 'heartmark newmark', 'aria-hidden': 'true' }, lab), h('span', { class: 'word' }, colorEnd(w)))));
    const tips = [
      'Say the base word, then add the ending. cats is cat plus s.',
      'If the base ends in s, x, sh, or ch, use es. boxes, foxes, dishes.',
      'ed can sound like t, as in jumped. It can sound like d, as in hugged. It can be its own beat, as in rested. If the sound is off, say the word in a short line and clap the beats.',
      'ing means it is happening now. If a letter drops out, point back to the base word and add ing together.',
      'When a try is wrong, say listen again and play the word. Do not spell it first. After two misses, show the ending.'
    ];
    const go = h('button', { class: 'btn big primary', type: 'button', onclick: () => ctx.finish(3) }, 'We practiced the endings', icon('next'));
    ctx.stage.append(h('div', { class: 'activity' },
      h('p', { class: 'bigprompt' }, 'Endings: -s, -es, -ed, -ing'),
      row,
      h('div', { class: 'u6tips' },
        h('h2', null, 'For a grown-up: about 10 minutes'),
        h('p', null, 'Hear each ending, read three examples together, then use these fixes when a try goes wrong.'),
        h('ol', null, ...tips.map((t) => h('li', null, t)))),
      h('div', { class: 'row center' }, go)));
    Snd.play(P('meet'));
  }

  function wordsInto(el, pg) { el.innerHTML = ''; pg.words.forEach((w, k) => el.append(h('span', { class: 'w', 'data-k': k }, w), ' ')); }
  function hl(pg, ws) {
    return (t) => { if (!pg.t || pg.t.length !== pg.words.length) return; pg.t.forEach((tt, k) => { const e = ws[k]; if (!e) return; const a = tt[0], b = tt[1]; e.classList.toggle('hl', t >= a - 0.04 && t < b); e.classList.toggle('read', t >= b); }); };
  }
  function runListen(ctx) {
    ctx.showNav(false);
    if (!ctx._heartDone) { ctx._heartDone = true; runHeart(ctx, () => { ctx.stage.innerHTML = ''; runListen(ctx); }); return; }
    ctx.setInstr('Listen to the story and follow along.', 'listen');
    const pages = N.story; let p = 0, token = 0, mode = 'reading'; const heard = new Set(); const st = ctx.stage;
    const picEl = h('img', { class: 'panel', alt: '' }); const sentEl = h('p', { class: 'sentence', 'aria-live': 'polite' });
    const dots = h('div', { class: 'pagedots' }, ...pages.map(() => h('i'))); const label = h('p', { class: 'small story-say' }); const ctl = h('div', { class: 'row center story-ctl' });
    const allHeard = () => heard.size >= pages.length;
    const btn = (cls, ico, text, fn) => { const b = h('button', { class: 'btn big ' + cls, type: 'button' }, ico ? icon(ico) : null, text); b.addEventListener('click', fn); return b; };
    function renderCtl() {
      ctl.innerHTML = ''; const last = p === pages.length - 1;
      const prev = btn('story-prev', 'back', 'Previous page', () => { if (p > 0) goPage(p - 1); }); if (p === 0) prev.disabled = true;
      let mid, nextLbl = 'Next page', nextFn = () => { if (p < pages.length - 1) goPage(p + 1); };
      if (mode === 'reading') { label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length + '. Listening.'; mid = btn('story-stop', 'pause', 'Pause', () => { token++; Snd.stop(); mode = 'stopped'; renderCtl(); }); }
      else { label.textContent = 'Page ' + (p + 1) + ' of ' + pages.length + '.'; mid = btn('story-again', 'replay', 'Read again', () => playPage()); if (last && allHeard()) { nextLbl = 'Finish'; nextFn = () => ctx.finish(3); } }
      const nb = btn('primary story-nextpage', null, nextLbl, nextFn); nb.append(icon('next'));
      ctl.append(prev, mid, nb);
    }
    function setPage(i) { p = i; picEl.src = pages[p].img; wordsInto(sentEl, pages[p]); $$('i', dots).forEach((d, k) => { d.classList.toggle('cur', k === p); d.classList.toggle('seen', heard.has(k)); }); ctx.progress(heard.size / pages.length); }
    function playPage() {
      const pg = pages[p]; const ws = $$('.w', sentEl); const my = ++token; mode = 'reading'; renderCtl();
      return Snd.play(pg.audio, { onTime: hl(pg, ws) }).then((ok) => { ws.forEach((e) => e.classList.remove('hl', 'read')); if (my !== token || !ctx.scr.ok()) return; if (ok) heard.add(p); mode = 'done'; setPage(p); renderCtl(); });
    }
    const goPage = (i) => { token++; Snd.stop(); setPage(i); playPage(); };
    st.append(h('div', { class: 'activity story listenmode' }, h('div', { class: 'panelwrap' }, picEl), h('div', { class: 'sentrow' }, sentEl), dots, label, ctl));
    setPage(0); playPage();
  }
  function runHeart(ctx, after) {
    ctx.setInstr('Tap each heart word to hear it before the story.', 'meet');
    const seen = new Set(); const words = N.heart;
    const row = h('div', { class: 'hearts' }, ...words.map((w) => h('button', { class: 'heartchip', type: 'button', onclick: (e) => { e.currentTarget.classList.add('seen'); seen.add(w); say(w); ctx.progress(seen.size / words.length); if (seen.size === words.length) done.classList.add('glow'); } },
      h('span', { class: 'heartmark', 'aria-hidden': 'true' }, '\u2665'), h('span', { class: 'word' }, w))));
    const done = h('button', { class: 'btn big primary', type: 'button', onclick: () => { Snd.stop(); after(); } }, 'Listen to the story', icon('next'));
    ctx.stage.append(h('div', { class: 'activity' }, h('p', { class: 'bigprompt' }, 'Heart words'), row, h('p', { class: 'small' }, 'These words do not follow every sound rule. Learn them by heart.'), h('div', { class: 'row center' }, done)));
  }

  function runHear(ctx) {
    ctx.setInstr('Listen. Tap the word you hear.', 'hear');
    const rounds = N.hear; let r = 0; const got = new Set(); const stage = ctx.stage;
    function round() {
      const R = rounds[r]; ctx.progress(got.size / rounds.length); stage.innerHTML = ''; let misses = 0, locked = false;
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const grid = h('div', { class: 'choices' }); const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      shuffle(R.choices).forEach((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorEnd(w));
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (w === R.word) { locked = true; b.classList.add('right'); $$('.choice', grid).forEach((o) => { if (o !== b) o.classList.add('fade'); }); status.textContent = 'Yes! ' + w; await ding(w); if (!ctx.scr.ok()) return; await sleep(400); if (!ctx.scr.ok()) return; got.add(r); if (got.size >= rounds.length) { ctx.progress(1); ctx.finish(); } else { r = (r + 1) % rounds.length; while (got.has(r)) r = (r + 1) % rounds.length; round(); } }
          else { misses++; ctx.miss(); b.classList.add('tried'); status.textContent = 'Not that one. Listen again.'; await tryAgain(W(R.word)); if (misses >= 2) $$('.choice', grid).forEach((o) => { if (o.dataset.w === R.word) o.classList.add('hint'); }); }
        }); grid.append(b); });
      stage.append(h('div', { class: 'activity' }, spk, grid, status)); say(R.word);
    }
    round();
  }

  function runBells(ctx) {
    const words = N.bells.slice(); const order = shuffle(words); let r = 0; const lit = new Set(); const stage = ctx.stage;
    ctx.setInstr('Read the word out loud. Then tap the bell with the same word.', 'bells');
    const row = h('div', { class: 'bellrow' }); const card = h('div', { class: 'bellcard' });
    const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
    words.forEach((w) => { const b = h('button', { class: 'bellbtn', type: 'button', 'aria-label': 'Bell: ' + w }, h('img', { src: 'img/bell_unlit.png', alt: '' }), h('span', null, colorEnd(w))); b.addEventListener('click', () => tap(w, b)); row.append(b); });
    const show = () => { ctx.progress(lit.size / words.length); card.innerHTML = ''; card.append(h('span', { class: 'bigword' }, colorEnd(order[r]))); status.textContent = '\u00a0'; };
    async function tap(w, b) {
      if (lit.has(w)) { say(w); return; }
      if (w !== order[r]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 500); status.textContent = 'Look again. Find the bell that says ' + order[r] + '.'; await tryAgain(); return; }
      lit.add(w); b.classList.add('lit'); b.querySelector('img').src = 'img/bell_lit.png'; status.textContent = w + '! The bell lights up.';
      await ding(w); if (!ctx.scr.ok()) return; r++;
      if (r >= order.length) { ctx.progress(1); status.textContent = 'All the bells are lit!'; await Snd.play(A.sfx.gong); if (ctx.scr.ok()) ctx.finish(); return; }
      await sleep(300); if (ctx.scr.ok()) show();
    }
    stage.append(h('div', { class: 'activity bellgame' }, h('div', { class: 'bellscene', style: 'background-image:url(img/ob_scene.jpg)' }), row, card,
      h('p', { class: 'small' }, 'The ending is part of the word. Read the whole word.'), h('div', { class: 'row center' }, h('button', { class: 'btn big', type: 'button', onclick: () => say(order[r]) }, icon('speaker'), 'Hear it')), status));
    show(); Snd.play(P('bells'));
  }

  function runBuild(ctx) {
    ctx.setInstr('Listen. Build the word with the tiles.', 'build');
    const rounds = N.build; let r = 0; const stage = ctx.stage;
    function round() {
      const R = rounds[r]; ctx.progress(r / rounds.length); stage.innerHTML = ''; let misses = 0;
      const spk = speakerBtn(() => say(R.word), 'Hear the word'); spk.classList.add('huge');
      const slotsEl = h('div', { class: 'slots' }); const bankEl = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap the base word, then the ending.');
      const mk = (id, text, kind) => ({ id, text, cls: kind, style: kind === 'chunk' ? 'color:' + (ENDCOL[text] || '#2E9E6B') : '' });
      const tiles = shuffle([mk('o1', R.onset, 'onset'), mk('o2', R.altOnset, 'onset'), mk('c1', R.ending, 'chunk'), mk('c2', R.altEnding, 'chunk')]);
      IR.TileBoard({ tiles, nSlots: 2, slotsEl, bankEl, onFull: async (texts, b) => {
        b.locked = true;
        if (texts.join('') === R.word) { status.textContent = 'Yes! ' + R.word; slotsEl.classList.add('right'); await ding(R.word); if (!ctx.scr.ok()) return; await sleep(400); if (!ctx.scr.ok()) return; r++; if (r < rounds.length) round(); else { ctx.progress(1); ctx.finish(); } }
        else { misses++; ctx.miss(); status.textContent = 'Almost! Listen again and try again.'; slotsEl.classList.add('almost'); await tryAgain(W(R.word)); if (!ctx.scr.ok()) return; slotsEl.classList.remove('almost'); b.slots.fill(null); if (misses >= 2) b.hint = 'o1'; b.locked = false; b.render(); }
      } });
      stage.append(h('div', { class: 'activity' }, spk, slotsEl, bankEl, status)); say(R.word);
    }
    round();
  }

  function runChain(ctx) {
    ctx.setInstr('Only one part changes. Tap the next word.', 'chain');
    const chains = N.chains; let c = 0, i = 0, steps = 0, done = 0;
    const total = chains.reduce((n, ch) => n + ch.length - 1, 0);
    const stage = ctx.stage;
    function show() {
      const ch = chains[c]; ctx.progress(done / total); stage.innerHTML = '';
      if (i >= ch.length - 1) { c++; i = 0; if (c >= chains.length) { ctx.progress(1); ctx.finish(); return; } show(); return; }
      const cur = ch[i], next = ch[i + 1];
      const pool = chains.flat().filter((w) => w !== next && w !== cur);
      const opts = shuffle([next, pool[steps % pool.length]]);
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Which word comes next?');
      const grid = h('div', { class: 'choices two' });
      opts.forEach((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorEnd(w));
        b.addEventListener('click', async () => {
          if (b.classList.contains('tried') || grid.dataset.lock) return;
          if (w === next) { grid.dataset.lock = '1'; b.classList.add('right'); status.textContent = 'Yes! ' + w; await ding(w); if (!ctx.scr.ok()) return; done++; i++; steps++; await sleep(350); if (ctx.scr.ok()) show(); }
          else { ctx.miss(); b.classList.add('tried'); status.textContent = 'Not that one. One part changes.'; await tryAgain(W(next)); }
        }); grid.append(b); });
      stage.append(h('div', { class: 'activity' }, h('p', { class: 'bigword' }, colorEnd(cur)), grid, status));
      say(cur);
    }
    show();
  }

  function runScramble(ctx) {
    ctx.setInstr('Tap the parts in order.', 'scramble');
    const words = N.scramble; let r = 0; const stage = ctx.stage;
    function round() {
      const w = words[r]; const goal = parts(w); ctx.progress(r / words.length); stage.innerHTML = '';
      let got = []; let misses = 0;
      const slots = h('div', { class: 'slots' }); const bank = h('div', { class: 'bank' });
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Say it slowly, then tap each part.');
      const tiles = shuffle(goal.map((t, i) => ({ t, i })));
      tiles.forEach((m) => { const b = h('button', { class: 'wtile' + (endingOf(m.t) || m.t.length > 1 ? ' ngtile' : ''), type: 'button' }, m.t);
        b.addEventListener('click', async () => {
          if (b.disabled) return;
          if (m.t !== goal[got.length]) { misses++; ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 400); status.textContent = 'Try another part.'; await tryAgain(W(w)); if (misses >= 2) { bank.querySelectorAll('button').forEach((x, k) => { if (tiles[k] && tiles[k].t === goal[got.length] && !x.disabled) x.classList.add('hint'); }); } return; }
          b.disabled = true; b.classList.add('used'); got.push(m.t); slots.append(h('span', { class: 'wtile' }, m.t));
          if (got.length === goal.length) { status.textContent = w + '!'; await ding(w); if (!ctx.scr.ok()) return; r++; await sleep(350); if (!ctx.scr.ok()) return; if (r < words.length) round(); else { ctx.progress(1); ctx.finish(); } }
        }); bank.append(b); });
      const spk = speakerBtn(() => say(w), 'Hear the word'); spk.classList.add('huge');
      stage.append(h('div', { class: 'activity' }, spk, slots, bank, status)); say(w);
    }
    round();
  }

  function runFeed(ctx) {
    IR.runFeedZip(ctx, { words: N.feed, say, colorWord: colorEnd, prompt: 'Read the word. Then tap the bubble that matches to feed Zip.', promptAudio: P('feed'), rounds: 4 });
  }

  function runSentence(ctx) {
    ctx.setInstr('Tap the words in order.', 'sentence');
    const lines = N.sentences; let r = 0; const stage = ctx.stage;
    function round() {
      const words = lines[r]; ctx.progress(r / lines.length); stage.innerHTML = '';
      let k = 0;
      const line = h('p', { class: 'sentence' }); const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Build the sentence.');
      const grid = h('div', { class: 'choices' });
      shuffle(words.slice()).forEach((w) => { const b = h('button', { class: 'choice', type: 'button' }, w);
        b.addEventListener('click', async () => {
          if (b.disabled) return;
          if (w !== words[k]) { ctx.miss(); b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 400); status.textContent = 'Not yet. Listen to the sentence.'; await tryAgain(linesAudio(r)); return; }
          b.disabled = true; b.classList.add('fade'); line.append(h('span', { class: 'w read' }, colorEnd(w)), ' '); k++;
          if (k === words.length) { status.textContent = words.join(' '); await ding(); if (!ctx.scr.ok()) return; r++; await sleep(400); if (!ctx.scr.ok()) return; if (r < lines.length) round(); else { ctx.progress(1); ctx.finish(); } }
        }); grid.append(b); });
      const spk = speakerBtn(() => Snd.play(linesAudio(r)), 'Hear the sentence');
      stage.append(h('div', { class: 'activity' }, spk, line, grid, status));
      Snd.play(linesAudio(r));
    }
    round();
  }
  function linesAudio(r) { return 'audio/u6_line' + (r + 1) + '.mp3'; }

  function runRead(ctx) {
    ctx.setInstr('Tap a speaker to hear a sentence. Then you read it.', 'read');
    ctx.showNav(false);
    const pages = N.story; let p = 0; const heard = new Set(); const S = IR.S(); S.reads = S.reads || {};
    const picEl = h('img', { class: 'panel', alt: '' }); const sentEl = h('p', { class: 'sentence' });
    const dots = h('div', { class: 'pagedots' }, ...pages.map(() => h('i')));
    const spk = speakerBtn(() => play(), 'Hear this sentence'); spk.classList.add('huge');
    const prev = h('button', { class: 'btn small back', type: 'button' }, icon('back'), 'Back');
    const next = h('button', { class: 'btn small primary next', type: 'button' }, 'Next', icon('next'));
    const reads = h('div', { class: 'reads' });
    const readBtn = h('button', { class: 'btn small good', type: 'button' }, icon('check'), 'I read it to a grown-up');
    const readIt = () => heard.size >= pages.length || (S.reads.u6 || 0) > 0;
    const renderReads = () => { const n = S.reads.u6 || 0; reads.innerHTML = ''; reads.append(h('span', null, 'Read it 3 times: '), ...[0, 1, 2].map((k) => h('i', { class: 'rd' + (k < n ? ' on' : '') }))); };
    const setLbl = () => { next.firstChild.textContent = p === pages.length - 1 ? (readIt() ? 'Finish' : 'Next') : 'Next'; };
    readBtn.addEventListener('click', () => { S.reads.u6 = Math.min(3, (S.reads.u6 || 0) + 1); IR.save(); renderReads(); setLbl(); });
    function setPage(i) { p = i; picEl.src = pages[p].img; wordsInto(sentEl, pages[p]); $$('i', dots).forEach((d, k) => d.classList.toggle('cur', k === p)); setLbl(); ctx.progress(p / Math.max(1, pages.length - 1)); }
    function play() { const pg = pages[p]; const ws = $$('.w', sentEl); return Snd.play(pg.audio, { onTime: hl(pg, ws) }).then((ok) => { ws.forEach((e) => e.classList.remove('hl', 'read')); if (ok) { heard.add(p); setLbl(); } }); }
    prev.addEventListener('click', () => { if (p > 0) { setPage(p - 1); play(); } else ctx.goBack(); });
    next.addEventListener('click', () => { if (p < pages.length - 1) { setPage(p + 1); play(); } else if (readIt()) ctx.finish(); });
    ctx.stage.append(h('div', { class: 'activity story' }, h('div', { class: 'panelwrap' }, picEl), h('div', { class: 'sentrow' }, spk, sentEl), dots, h('div', { class: 'row' }, prev, next), h('div', { class: 'row' }, readBtn, reads)));
    renderReads(); setPage(0); Snd.play(P('read'));
  }

  function runFish(ctx) {
    ctx.setInstr('Tap the fish that have an ending: s, es, ed, or ing.', 'fish');
    const need = N.fish.need; let caught = 0; const stage = ctx.stage;
    const words = shuffle(N.fish.yes.map((w) => ({ w, yes: true })).concat(N.fish.no.map((w) => ({ w, yes: false }))));
    const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap a fish to hear its word.');
    const counter = h('div', { class: 'catchcount' }, icon('bucket'), h('b', null, '0'), ' of ' + need + ' ending fish');
    const pond = h('div', { class: 'pond' });
    const pauseBtn = h('button', { class: 'btn small', type: 'button' }, icon('pause'), 'Pause fish');
    pauseBtn.addEventListener('click', () => { const p = pond.classList.toggle('paused'); pauseBtn.innerHTML = ''; pauseBtn.append(icon(p ? 'play' : 'pause'), p ? 'Swim again' : 'Pause fish'); });
    const hues = ['#F6A15A', '#4DB6AC', '#F26E86', '#8E7CC3', '#F2C14E', '#5BA7E5'];
    words.forEach((f, idx) => {
      const lane = idx % 5;
      const fish = h('button', { class: 'fish', type: 'button', 'data-w': f.w, 'aria-label': 'fish with the word ' + f.w });
      fish.innerHTML = '<span class="fishbody"><svg class="fishsvg" viewBox="0 0 200 110" aria-hidden="true"><path d="M170 55 L198 28 Q190 55 198 82Z" fill="' + hues[idx % hues.length] + '"/><ellipse cx="95" cy="55" rx="85" ry="46" fill="' + hues[idx % hues.length] + '"/><path d="M60 14 Q95 -2 130 14 Q95 22 60 14Z" fill="#00000022"/><circle cx="38" cy="42" r="8" fill="#fff"/><circle cx="36" cy="42" r="4" fill="#2b2540"/><path d="M26 66 Q36 74 46 66" stroke="#2b2540" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span><span class="fw">' + f.w + '</span>';
      const dur = 15 + lane * 2.4; const round = Math.floor(idx / 5);
      fish.classList.toggle('rev', lane % 2 === 1);
      fish.style.setProperty('--dur', dur + 's');
      fish.style.setProperty('--delay', '-' + ((dur * 2) * ((0.31 * round + lane * 0.19 + 0.07) % 1)).toFixed(2) + 's');
      fish.style.top = (2 + lane * 19) + '%';
      fish.addEventListener('click', async () => {
        if (fish.classList.contains('caught')) return;
        if (f.yes) { fish.classList.add('caught'); caught++; counter.querySelector('b').textContent = caught; status.textContent = 'Yes! ' + f.w + ' has an ending.'; ctx.progress(caught / need); await ding(f.w); if (!ctx.scr.ok()) return; if (caught >= need) { await sleep(400); if (ctx.scr.ok()) ctx.finish(); } }
        else { ctx.miss(); fish.classList.add('wiggle'); setTimeout(() => fish.classList.remove('wiggle'), 700); status.textContent = f.w + ' is a base word. Keep looking.'; await tryAgain(W(f.w)); }
      });
      pond.append(fish);
    });
    stage.append(h('div', { class: 'activity fishgame' }, h('div', { class: 'fishhead' }, counter, pauseBtn), pond, status));
    Snd.play(P('fish'));
  }

  function runCheck(ctx) {
    const items = N.check; let q = 0, tok = 0; const recs = []; const st = ctx.stage;
    ctx.setInstr('Ten quick questions. Work on your own.', 'check');
    const finish = () => {
      const S = IR.S(); const score = recs.filter(Boolean).length;
      S.u6Check = S.u6Check || { best: null, attempts: 0 };
      S.u6Check.last = score; S.u6Check.attempts++; S.u6Check.best = Math.max(S.u6Check.best || 0, score);
      if (score >= 9) S.u6Sticker = true;
      IR.recordActivity('u6_check', score >= 9 ? 3 : score >= 7 ? 2 : 1); IR.touchStreak(); IR.save();
      location.hash = '#/u6/result';
    };
    const step = () => {
      if (q >= items.length) return finish();
      const it = items[q]; const my = ++tok; ctx.progress(q / items.length); st.innerHTML = '';
      const status = h('p', { class: 'status' }, 'Question ' + (q + 1) + ' of ' + items.length); let locked = false;
      const ans = async (ok, b) => { if (locked) return; locked = true; recs[q] = !!ok; b.classList.add('picked'); $$('.choice', st).forEach((x) => { if (x !== b) x.classList.add('fade'); }); status.textContent = 'Thank you. Next one.'; Snd.play(A.sfx.tap); const qq = q; await sleep(600); if (!ctx.scr.ok() || my !== tok || q !== qq) return; q++; step(); };
      const body = h('div', { class: 'activity' });
      if (it.type === 'pick') {
        const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
        body.append(spk, h('div', { class: 'choices' }, ...shuffle(it.choices).map((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorEnd(w)); b.addEventListener('click', () => ans(w === it.word, b)); return b; })));
        say(it.word);
      } else if (it.type === 'end') {
        const spk = speakerBtn(() => say(it.word), 'Hear the word'); spk.classList.add('huge');
        const slot = h('span', { class: 'chunkslot' }, '?');
        body.append(spk, h('div', { class: 'wordframe' }, h('span', { class: 'onset' }, it.onset), slot), h('div', { class: 'choices' }, ...it.choices.map((e) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': e, style: 'color:' + (ENDCOL[e] || '#2b2540') }, e); b.addEventListener('click', () => { slot.textContent = e; slot.style.color = ENDCOL[e] || ''; ans(e === it.answer, b); }); return b; })));
        Snd.seq([P('ending'), W(it.word)], 180);
      } else {
        body.append(h('p', { class: 'bigprompt' }, it.ask), speakerBtn(() => Snd.play(P(it.prompt)), 'Hear the question'),
          h('div', { class: 'choices' }, ...shuffle(it.choices).map((w) => { const b = h('button', { class: 'choice', type: 'button', 'data-w': w }, colorEnd(w)); b.addEventListener('click', () => ans(w === it.answer, b)); return b; })));
        Snd.play(P(it.prompt));
      }
      body.append(status); st.append(body);
    };
    step();
  }

  const ACT = { hear: runHear, bells: runBells, build: runBuild, chain: runChain, scramble: runScramble, feed: runFeed, sentence: runSentence, read: runRead, fish: runFish, check: runCheck };
  const STEPS = [
    { id: 'meet', title: 'Meet the endings', group: 'lesson', run: runMeet, color: '#2E9E6B' },
    { id: 'listen', title: 'Story Time', group: 'story', run: runListen, color: '#8E5BD6' },
    { id: 'hear', title: 'Hear and Pick', group: 'activities', run: ACT.hear, color: '#7E57C2' },
    { id: 'bells', title: 'Ring every bell and learn its sounds', group: 'activities', run: ACT.bells, color: '#E8731C' },
    { id: 'build', title: 'Build-a-Word', group: 'activities', run: ACT.build, color: '#E8603C' },
    { id: 'chain', title: 'Word Chains', group: 'activities', run: ACT.chain, color: '#C95A10' },
    { id: 'scramble', title: 'Scrambled Letters', group: 'activities', run: ACT.scramble, color: '#D9631A' },
    { id: 'feed', title: 'Feed Zip', group: 'activities', run: ACT.feed, color: '#D98E00' },
    { id: 'sentence', title: 'Sentence Bridge', group: 'activities', run: ACT.sentence, color: '#2E9E6B' },
    { id: 'read', title: 'Now You Read It', group: 'activities', run: ACT.read, color: '#8E5BD6' },
    { id: 'fish', title: 'Fish Pond', group: 'activities', run: ACT.fish, color: '#1F8FD6' },
    { id: 'check', title: 'Zip\u2019s Check', group: 'activities', run: ACT.check, color: '#2b2540' }
  ];
  const pid = (s) => 'u6_' + s.id;
  function sections() {
    const items = STEPS.map((s, i) => ({ id: s.id, title: s.title, group: s.group, href: '#/u6/' + s.id, num: i + 1, done: IR.isDone(pid(s)), min: (N.minutes || {})[s.id] || 3 }));
    items.filter((r) => r.group === 'activities').forEach((r, k) => { r.act = k + 1; r.label = 'Activity ' + (k + 1) + ': ' + r.title; });
    items.forEach((r) => { if (!r.label) r.label = r.title; });
    return items;
  }
  IR.u6 = { sections, steps: STEPS };

  const LIGHT_KEY = 'ir_sess_u6';
  function loadLights() { try { return JSON.parse(sessionStorage.getItem(LIGHT_KEY) || '{}'); } catch (e) { return {}; } }
  function markLight(id) { const L = loadLights(); L[id] = 1; sessionStorage.setItem(LIGHT_KEY, JSON.stringify(L)); }
  function resetLights() { sessionStorage.removeItem(LIGHT_KEY); }

  function unitPage(app) {
    const prev = IR._u6HashWas || '';
    if (!/^#\/u6(\/|$)/.test(prev)) resetLights();
    IR.newScreen();
    const secs = sections(); const nx = secs.find((r) => !r.done) || null;
    const doneN = secs.filter((r) => r.done).length; const total = secs.length;
    const totalMin = secs.reduce((a, r) => a + r.min, 0);
    const star = (on) => h('span', { class: 'sstar' + (on ? ' on' : ''), 'aria-hidden': 'true' }, icon(on ? 'star' : 'starOutline'));
    const go = (r) => () => { Snd.stop(); location.hash = r.href; };
    const big = (r) => { const isNext = nx && nx.id === r.id; const lesson = r.group === 'lesson';
      return h('li', { class: 'bigli' }, h('button', { class: 'stopcard bigbox ' + (lesson ? 'lessonstop' : 'storystop') + (r.done ? ' done' : '') + (isNext ? ' nextup' : ''), type: 'button', 'data-id': r.id, 'aria-label': r.label + '. ' + r.min + ' minutes.', onclick: go(r) },
        h('span', { class: 'bkind' }, lesson ? 'Lesson' : 'Story'), r.done ? h('span', { class: 'bstar' }, star(true)) : null,
        h('img', { class: 'bimg', src: lesson ? 'img/zipA.webp' : 'img/frillC.webp', alt: '' }),
        h('span', { class: 'stxt bbot' }, h('b', null, r.title), h('span', { class: 'smin' }, r.min + ' min'),
          h('span', { class: 'sside' }, h('span', { class: 'slabel ' + (r.done ? 'rev' : isNext ? 'tag' : 'none') }, r.done ? (lesson ? 'Review lesson' : 'Read again') : isNext ? 'Next' : ''))))); };
    const row = (r) => { const isNext = nx && nx.id === r.id;
      return h('li', null, h('button', { class: 'stopcard arow gamestop' + (r.done ? ' done' : '') + (isNext ? ' nextup' : ''), type: 'button', 'data-id': r.id, 'aria-label': r.label + '. ' + r.min + ' minutes.', onclick: go(r) },
        h('span', { class: 'snum', 'aria-hidden': 'true' }, String(r.act)), h('span', { class: 'stxt' }, h('b', null, r.title), TIPS[r.id] ? h('span', { class: 'sblurb' }, TIPS[r.id]) : null), h('span', { class: 'smin' }, r.min + ' min'),
        h('span', { class: 'sside' }, star(r.done), h('span', { class: 'slabel ' + (isNext ? 'tag' : 'none') }, isNext ? 'Next' : '')))); };
    const lit = loadLights();
    const lights = h('div', { class: 'clights', role: 'status', 'aria-label': 'Session progress lights' }, h('span', { class: 'clab' }, 'This visit:'),
      ...secs.map((r) => h('span', { class: 'clight' + (lit[r.id] || r.done ? ' on' : ''), 'data-id': r.id, title: r.title })));
    const left = h('ul', { class: 'uA-left' }, ...secs.filter((r) => r.group !== 'activities').map(big));
    const right = h('section', { class: 'uA-right' }, lights, h('h2', { class: 'uA-h' }, 'Activities'), h('ol', { class: 'stoplist uA-acts' }, ...secs.filter((r) => r.group === 'activities').map(row)));
    app.append(h('div', { class: 'screen trailscreen unitpage unitA' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(), h('h1', { class: 'uA-title' }, h('small', null, 'Unit 6 \u00b7 '), 'Endings'),
        h('span', { class: 'uA-time' }, h('span', { class: 't-long' }, 'About ' + totalMin + ' min total'), h('span', { class: 't-short' }, totalMin + ' min')), IR.ui.gearButton()),
      h('main', { class: 'uA-main' }, left, right),
      h('footer', { class: 'uA-foot' }, h('span', { class: 'i4txt' }, h('b', null, 'Zip\u2019s Check'), h('small', null, '9 or 10: move on. 7 or 8: review. 6 or below: re-teach.')), h('span', { class: 'i4count' }, doneN + ' of ' + total))));
  }

  function stepScreen(app, idx) {
    const S0 = STEPS[idx]; const scr = IR.newScreen(); let mistakes = 0;
    const fill = h('i'); const bar = h('div', { class: 'pbar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instrBox = h('div', { class: 'instr' }); const stage = h('div', { class: 'stage' });
    let backH = null, nextH = null;
    const ctx = {
      scr, stage, miss() { mistakes++; },
      progress(f) { const v = Math.round(((idx + Math.max(0, Math.min(1, f))) / STEPS.length) * 100); fill.style.width = v + '%'; bar.setAttribute('aria-valuenow', v); },
      setInstr(text, p) { instrBox.innerHTML = ''; if (!text) { instrBox.style.display = 'none'; return; } instrBox.style.display = ''; const hear = () => { if (p) Snd.play(P(p)); }; instrBox.append(speakerBtn(hear, 'Hear the directions'), h('span', { class: 'itext' }, text)); },
      setBack(fn) { backH = fn; }, setNext(fn) { nextH = fn; },
      goBack() { Snd.stop(); if (backH && backH()) return; location.hash = idx > 0 ? '#/u6/' + STEPS[idx - 1].id : '#/u6'; },
      goNext() { Snd.stop(); if (nextH && nextH()) return; location.hash = idx < STEPS.length - 1 ? '#/u6/' + STEPS[idx + 1].id : '#/u6'; },
      showNav(on) { nav.style.display = on === false ? 'none' : ''; },
      finish(starsOverride) {
        const stars = starsOverride || (mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1);
        markLight(S0.id); IR.recordActivity(pid(S0), stars); IR.touchStreak(); IR.save(); ctx.progress(1);
        const nx = STEPS[idx + 1];
        const ov = h('div', { class: 'complete' }, h('div', { class: 'cbox' }, IR.celebration(false), h('h1', null, 'Great job!'), h('p', { class: 'lead' }, S0.title),
          h('div', { class: 'bigstars', 'aria-label': stars + ' stars' }, ...[1, 2, 3].map((k) => icon(k <= stars ? 'star' : 'starOutline'))),
          h('div', { class: 'row' }, h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/u6'; } }, icon('back'), 'Back to the unit'),
            nx ? h('button', { class: 'btn big primary', type: 'button', onclick: () => { location.hash = '#/u6/' + nx.id; } }, 'Next: ' + nx.title, icon('next')) : null)));
        app.append(ov); Snd.play(A.sfx.done);
      }
    };
    const nextBtn = h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, h('button', { class: 'btn big back', type: 'button', 'aria-label': 'Back', onclick: () => ctx.goBack() }, icon('back'), 'Back'), nextBtn);
    const x = h('button', { class: 'xbtn', type: 'button', 'aria-label': 'Back to the unit', onclick: () => { location.hash = '#/u6'; } }, icon('close'));
    app.append(h('div', { class: 'screen lessonscreen nkstep u6-' + S0.id, style: '--c:' + S0.color }, h('header', { class: 'lesson-top' }, x, bar, IR.ui.homeButton(), IR.ui.gearButton()), instrBox, stage, nav));
    ctx.progress(0); S0.run(ctx);
  }

  function resultPage(app) {
    IR.newScreen(); const S = IR.S(); const score = (S.u6Check && S.u6Check.last) || 0;
    const wrap = h('div', { class: 'result' });
    const trail = h('button', { class: 'btn big back', type: 'button', onclick: () => { location.hash = '#/u6'; } }, icon('back'), 'Back to the unit');
    const again = h('button', { class: 'btn big next', type: 'button', onclick: () => { location.hash = '#/u6/check'; } }, 'Try the check again');
    const home = h('button', { class: 'btn big primary next', type: 'button', onclick: () => { location.hash = '#/home'; } }, 'See the sky map');
    if (score >= 9) wrap.append(h('div', { class: 'badgeart', html: IR.ICON.badge }), h('h1', null, 'Move on'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. The Endings sticker is on the map.'));
    else if (score >= 7) wrap.append(h('h1', null, 'Review'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. Practice Hear and Pick or Fish Pond, then try the check again.'));
    else wrap.append(h('img', { class: 'char zip big', src: 'img/zipA.webp', alt: 'Zip' }), h('h1', null, 'Re-teach'), h('p', { class: 'lead' }, 'You got ' + score + ' out of 10. A grown-up can teach the endings again with you, then try the check again.'));
    wrap.append(h('div', { class: 'row' }, score >= 9 ? home : again, trail));
    if (score >= 7) wrap.prepend(IR.celebration(score >= 9));
    app.append(h('div', { class: 'screen resultscreen' }, h('div', { class: 'unitbar' }, IR.ui.homeButton()), wrap));
    Snd.play(score >= 9 ? A.sfx.gong : A.sfx.done);
  }

  IR.u6Route = function (hash, app) {
    const was = IR._u6HashWas || '';
    if (/^#\/u6(\/|$)/.test(was) && !/^#\/u6(\/|$)/.test(hash)) resetLights();
    IR._u6HashWas = hash;
    if (hash === '#/u6' || hash === '#/u6/') { unitPage(app); return true; }
    if (hash === '#/u6/result') { resultPage(app); return true; }
    const m = /^#\/u6\/(\w+)/.exec(hash);
    if (m) { const i = STEPS.findIndex((s) => s.id === m[1]); if (i < 0) return false; stepScreen(app, i); return true; }
    return false;
  };
})();
