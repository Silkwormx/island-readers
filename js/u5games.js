/* Unit 5 games: Short or Long Sorting Race, and Listen and Spell with a magic e box.
   Lessons 5.1 (u51) and 5.2 (u53). Words are the taught short and long pairs only. */
(function (root) {
  'use strict';
  const PAIRS = [
    { short: 'cap', long: 'cape' },
    { short: 'kit', long: 'kite' },
    { short: 'hop', long: 'hope' },
    { short: 'cub', long: 'cube' },
    { short: 'pet', long: 'Pete' }
  ];
  const DIST = ['m', 'n', 'd', 's', 'r', 'l', 'f', 'b', 't', 'p', 'c', 'k', 'h', 'g'];

  function roundWords() {
    const words = [];
    PAIRS.forEach((p) => { words.push(p.short, p.long); });
    return words;
  }

  function plan(word) {
    const pair = PAIRS.filter((p) => p.short === word || p.long === word)[0];
    if (!pair) return null;
    const magic = pair.long === word;
    const show = word;
    const sounds = (magic ? show.slice(0, -1) : show).split('');
    const lower = show.toLowerCase();
    let vowel = 1;
    const stop = magic ? lower.length - 1 : lower.length;
    for (let i = 0; i < stop; i++) if ('aeiou'.indexOf(lower[i]) >= 0) { vowel = i; break; }
    return { show: show, sounds: sounds, magic: magic, vowel: vowel, pair: pair };
  }

  function firstWrong(placed, magicOn, info) {
    for (let i = 0; i < info.sounds.length; i++) {
      if ((placed[i] || '') !== info.sounds[i]) return i;
    }
    if (!!magicOn !== info.magic) return 'e';
    return null;
  }

  function distractor(sounds) {
    const used = {};
    sounds.forEach((s) => { used[String(s).toLowerCase()] = 1; });
    for (let i = 0; i < DIST.length; i++) if (!used[DIST[i]]) return DIST[i];
    return 'm';
  }

  function timerOn(settings) { return !(settings && settings.sortTimerOff); }

  function seconds(ms) {
    const s = Math.max(1, Math.round(ms / 1000));
    return s + (s === 1 ? ' second' : ' seconds');
  }

  function glyphs(h, word, on) {
    const info = plan(word);
    const mark = {};
    if (on) {
      mark[info.vowel] = 'vowel';
      if (info.magic) mark[info.show.length - 1] = 'magic';
    }
    return info.show.split('').map((ch, i) => h('span', { class: mark[i] || '' }, ch));
  }

  function pairRow(h, word) {
    const info = plan(word);
    const card = (w) => h('div', { class: 'paircard' + (w === word ? ' right' : '') },
      h('b', null, ...glyphs(h, w, true)),
      h('small', null, plan(w).magic ? 'Long vowel' : 'Short vowel'));
    return h('div', { class: 'pairrow' }, card(info.pair.short), card(info.pair.long));
  }

  function playBag() {
    const IR = root.IR;
    const S = IR.S();
    S.u5play = S.u5play || { sortBest: {}, badges: {} };
    S.u5play.sortBest = S.u5play.sortBest || {};
    S.u5play.badges = S.u5play.badges || {};
    return S.u5play;
  }

  function decorate(h, label, note) {
    const box = document.querySelector('.complete .cbox');
    if (!box) return;
    const row = box.querySelector('.row');
    const badge = h('div', { class: 'gamebadge' }, h('span', { class: 'badgeart', html: root.IR.ICON.badge }), h('span', null, label));
    const line = h('p', null, note);
    if (row) row.before(badge, line);
    else box.append(badge, line);
  }

  function sort(ctx, key) {
    const IR = root.IR;
    const { h, shuffle, icon, Snd, A, speakerBtn } = IR;
    ctx.setInstr('Listen. Tap Short vowel or Long vowel.', 'sort');
    if (ctx.setGameTitle) ctx.setGameTitle('Short or Long Sorting Race');
    const say = (w) => Snd.play('audio/' + key + '_w_' + w + '.mp3');
    const words = shuffle(roundWords());
    const useTimer = false;
    const limit = document.body.classList.contains('calm') ? 18000 : 12000;
    let i = 0, streak = 0, bestStreak = 0, elapsed = 0, frame = 0, playing = false;
    const stopFrame = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };

    function finish() {
      stopFrame();
      const bag = playBag();
      bag.badges.sort = true;
      let note = 'In a row best: ' + bestStreak + '.';
      if (useTimer && elapsed > 0) {
        const prev = bag.sortBest[key];
        if (prev == null || elapsed < prev) {
          bag.sortBest[key] = Math.round(elapsed);
          note = 'New best time: ' + seconds(elapsed) + '. ' + note;
        } else note = 'Time: ' + seconds(elapsed) + '. Best time: ' + seconds(prev) + '. ' + note;
      }
      IR.save();
      ctx.finish();
      decorate(h, 'Short and long badge', note);
    }

    function round() {
      playing = true;
      if (i >= words.length) return finish();
      stopFrame();
      const w = words[i];
      const info = plan(w);
      ctx.progress(i / words.length);
      if (ctx.count) ctx.count(i + 1, words.length);
      ctx.stage.innerHTML = '';
      let locked = false, clean = true, rested = false;
      const t0 = performance.now();
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap a bin.');
      const streakEl = h('p', { class: 'sorstreak' }, 'In a row: ' + streak);
      const wordEl = h('div', { class: 'sorword', 'data-word': w }, ...glyphs(h, w, false));
      const bar = h('i');
      const timer = useTimer ? h('div', { class: 'sortbar', role: 'presentation' }, bar) : null;
      const fix = h('div', { class: 'pairfix' });
      const bins = h('div', { class: 'sortbins' });
      const act = h('div', { class: 'activity sortrace', 'data-game': 'sort', 'data-phase': 'play' });
      function paint(on) { wordEl.innerHTML = ''; glyphs(h, w, on).forEach((n) => wordEl.append(n)); }
      function arm(name, isLong) {
        const b = h('button', { class: 'sortbin', type: 'button', 'data-bin': isLong ? 'long' : 'short', 'aria-label': name + (isLong ? '. Magic e.' : '. Short vowel.') },
          h('b', null, name), h('small', null, isLong ? 'magic e' : 'the vowel is short'));
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('tried')) return;
          if (isLong === info.magic) {
            locked = true; stopFrame();
            if (useTimer) elapsed += performance.now() - t0;
            if (clean) { streak++; if (streak > bestStreak) bestStreak = streak; }
            else streak = 0;
            b.classList.add('right');
            status.textContent = 'Yes! ' + w;
            await Snd.seq([A.sfx.ding, 'audio/' + key + '_w_' + w + '.mp3'], 90);
            if (!ctx.scr.ok()) return;
            await IR.sleep(400);
            if (!ctx.scr.ok()) return;
            i++; round();
          } else {
            clean = false; streak = 0; streakEl.textContent = 'In a row: 0';
            ctx.miss(); b.classList.add('tried');
            act.dataset.phase = 'error';
            paint(true);
            fix.innerHTML = ''; fix.append(pairRow(h, w));
            status.textContent = 'Listen again. Look at the vowel, then the pair.';
            say(w);
          }
        });
        return b;
      }
      bins.append(arm('Short vowel', false), arm('Long vowel', true));
      const spk = speakerBtn(() => say(w), 'Hear the word');
      act.append(streakEl, spk, wordEl);
      if (timer) act.append(timer);
      act.append(fix, bins, status);
      ctx.stage.append(act);
      if (ctx.armReveal) ctx.armReveal(info.magic ? 'Long vowel' : 'Short vowel', (root) => root.querySelector('[data-bin="' + (info.magic ? 'long' : 'short') + '"]'));
      say(w);
      if (useTimer) {
        const loop = () => {
          if (!ctx.scr.ok() || locked) return;
          const p = Math.min(1, (performance.now() - t0) / limit);
          bar.style.width = (p * 100) + '%';
          if (p >= 1) {
            if (!rested) { rested = true; status.textContent = 'Take your time. The word is still here.'; say(w); }
            return;
          }
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      }
    }

    ctx.setBack(() => { if (playing && i > 0) { stopFrame(); i--; round(); return true; } return false; });
    ctx.setNext(() => { if (playing && i < words.length - 1) { stopFrame(); i++; round(); return true; } return false; });
    const bestLine = 'Take your time.';
    ctx.stage.append(h('div', { class: 'activity sortrace', 'data-game': 'sort', 'data-phase': 'start' },
      h('p', { class: 'bigprompt' }, 'Short or Long Sorting Race'),
      h('p', null, 'A word appears. Listen, then tap Short vowel or Long vowel. Ten words.'),
      h('p', { class: 'sormeta' }, bestLine),
      h('button', { class: 'btn big primary', type: 'button', onclick: () => round() }, 'Start', icon('next'))));
    if (IR.sayItem) IR.sayItem(ctx, 'audio/' + key + '_p_sort.mp3');
  }

  function spell(ctx, key) {
    const IR = root.IR;
    const { h, shuffle, icon, Snd, A, speakerBtn } = IR;
    ctx.setInstr('Hear the word. Fill each sound box. The dotted box is for magic e.', 'mage');
    if (ctx.setGameTitle) ctx.setGameTitle('Listen and Spell with Magic e Box');
    const say = (w) => Snd.play('audio/' + key + '_w_' + w + '.mp3');
    const words = shuffle(roundWords());
    let i = 0, playing = false;

    function finish() {
      playBag().badges.mage = true;
      IR.save();
      ctx.finish();
      decorate(h, 'Magic e badge', 'You chose when the word needed magic e.');
    }

    function round() {
      playing = true;
      if (i >= words.length) return finish();
      const info = plan(words[i]);
      ctx.progress(i / words.length);
      if (ctx.count) ctx.count(i + 1, words.length);
      ctx.stage.innerHTML = '';
      const letters = info.sounds.concat(['e', distractor(info.sounds)]);
      const tiles = shuffle(letters.map((letter, n) => ({ id: n + ':' + letter, letter: letter, used: false })));
      const placed = info.sounds.map(() => null);
      let magicTile = null;
      let aim = 0;
      let checking = false;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap the letters into the boxes.');
      const boxes = h('div', { class: 'mageboxes' });
      const bank = h('div', { class: 'spellchoices' });
      const act = h('div', { class: 'activity magegame', 'data-game': 'mage', 'data-phase': 'play', 'data-word': info.show });

      function slotAim() {
        if (aim === 'e') return 'e';
        if (placed[aim] == null) return aim;
        const n = placed.findIndex((t) => !t);
        return n < 0 ? 'e' : n;
      }

      function draw(wrong) {
        boxes.innerHTML = '';
        info.sounds.forEach((_, k) => {
          const t = placed[k];
          const b = h('button', {
            class: 'magebox' + (wrong === k ? ' wrong' : '') + (slotAim() === k ? ' aim' : ''),
            type: 'button',
            'aria-label': 'Sound box ' + (k + 1) + (t ? ', ' + t.letter : ', empty')
          }, t ? t.letter : '');
          b.addEventListener('click', () => {
            if (t) { t.used = false; placed[k] = null; }
            aim = k; draw(null);
          });
          boxes.append(b);
        });
        const eBtn = h('button', {
          class: 'magebox dotted' + (wrong === 'e' ? ' wrong' : '') + (slotAim() === 'e' ? ' aim' : ''),
          type: 'button',
          'aria-label': 'Magic e box' + (magicTile ? ', e' : ', empty')
        }, magicTile ? 'e' : '');
        eBtn.addEventListener('click', () => {
          if (magicTile) { magicTile.used = false; magicTile = null; }
          aim = 'e'; draw(null);
        });
        boxes.append(eBtn);
        bank.innerHTML = '';
        tiles.forEach((t) => {
          const b = h('button', { class: 'spelltile pick' + (t.used ? ' used' : ''), type: 'button', disabled: t.used }, t.letter);
          b.addEventListener('click', () => {
            if (t.used || checking) return;
            const slot = slotAim();
            if (slot === 'e') {
              if (t.letter.toLowerCase() !== 'e') { status.textContent = 'The dotted box is only for e.'; return; }
              if (magicTile) return;
              magicTile = t; t.used = true;
            } else {
              placed[slot] = t; t.used = true;
              const n = placed.findIndex((x) => !x);
              aim = n < 0 ? 'e' : n;
            }
            status.textContent = 'Tap Check when the boxes look right.';
            draw(null);
          });
          bank.append(b);
        });
      }

      const check = h('button', { class: 'btn big primary', type: 'button' }, 'Check');
      check.addEventListener('click', async () => {
        if (checking) return;
        const lettersNow = placed.map((t) => (t ? t.letter : ''));
        const wrong = firstWrong(lettersNow, !!magicTile, info);
        if (wrong == null) {
          checking = true;
          act.dataset.phase = 'play';
          status.textContent = 'Yes! ' + info.show;
          boxes.classList.add('right');
          await Snd.seq([A.sfx.ding, 'audio/' + key + '_w_' + info.show + '.mp3'], 90);
          if (!ctx.scr.ok()) return;
          await IR.sleep(450);
          if (!ctx.scr.ok()) return;
          i++; round();
          return;
        }
        ctx.miss();
        if (wrong === 'e') { if (magicTile) { magicTile.used = false; magicTile = null; } aim = 'e'; }
        else if (placed[wrong]) { placed[wrong].used = false; placed[wrong] = null; aim = wrong; }
        else aim = wrong;
        act.dataset.phase = 'error';
        status.textContent = 'That box is not right. Listen again.';
        draw(wrong);
        say(info.show);
      });
      const spk = speakerBtn(() => say(info.show), 'Hear the word');
      act.append(spk, h('p', { class: 'magelab' }, 'Sound boxes', h('span', null, 'magic e')), boxes, bank, check, status);
      ctx.stage.append(act);
      draw(null);
      if (ctx.armReveal) ctx.armReveal(info.show);
      say(info.show);
    }

    ctx.setBack(() => { if (playing && i > 0) { i--; round(); return true; } return false; });
    ctx.setNext(() => { if (playing && i < words.length - 1) { i++; round(); return true; } return false; });
    ctx.stage.append(h('div', { class: 'activity magegame', 'data-game': 'mage', 'data-phase': 'start' },
      h('p', { class: 'bigprompt' }, 'Listen and Spell with Magic e Box'),
      h('p', null, 'Hear the word. Tap the letters into the sound boxes. Fill the dotted box only when the word needs magic e. Ten words.'),
      h('button', { class: 'btn big primary', type: 'button', onclick: () => round() }, 'Start', icon('next'))));
    if (IR.sayItem) IR.sayItem(ctx, 'audio/' + key + '_p_mage.mp3');
  }

  const REFRESH = {
    rule: 'Short vowels are quick. Long vowels say their name.',
    vowels: [
      { letter: 'a', short: { w: 'cap', img: 'img/u5_c_cap.webp' }, long: { w: 'cake', img: 'img/u5_c_cake.webp' } },
      { letter: 'e', short: { w: 'bed', img: 'img/refresh_bed.jpg' }, long: { w: 'Pete', img: 'img/refresh_pete.jpg' } },
      { letter: 'i', short: { w: 'pig', img: 'img/refresh_pig.jpg' }, long: { w: 'kite', img: 'img/u5_c_kite.webp' } },
      { letter: 'o', short: { w: 'mop', img: 'img/refresh_mop.jpg' }, long: { w: 'rope', img: 'img/u5_c_rope.webp' } },
      { letter: 'u', short: { w: 'cup', img: 'img/refresh_cup.jpg' }, long: { w: 'cube', img: 'img/u5_c_cube.webp' } }
    ],
    eShort: ['bed', 'pet', 'pen'],
    eLong: ['he', 'me', 'Pete'],
    practice: [
      { w: 'bed', long: false, pair: ['bed', 'he'] },
      { w: 'pet', long: false, pair: ['pet', 'Pete'] },
      { w: 'pen', long: false, pair: ['pen', 'Pete'] },
      { w: 'he', long: true, pair: ['bed', 'he'] },
      { w: 'me', long: true, pair: ['pet', 'me'] },
      { w: 'Pete', long: true, pair: ['pet', 'Pete'] },
      { w: 'cap', long: false, pair: ['cap', 'cake'] },
      { w: 'cake', long: true, pair: ['cap', 'cake'] }
    ]
  };
  const rfSrc = (w) => 'audio/u51_rf_' + w + '.mp3';

  function refresh(ctx) {
    const IR = root.IR;
    const { h, icon, Snd, A } = IR;
    ctx.setInstr(REFRESH.rule, 'refresh');
    if (ctx.setGameTitle) ctx.setGameTitle('Vowel Refresher');
    let i = 0, earned = 0, playing = false;
    const say = (w) => Snd.play(rfSrc(w));

    function card(side, item) {
      return h('button', { class: 'vcard', type: 'button', 'data-side': side, 'aria-label': (side === 'short' ? 'Short. ' : 'Long. ') + item.w + '. Hear it.' },
        h('img', { src: item.img, alt: '' }),
        h('small', null, side === 'short' ? 'Short' : 'Long'),
        h('b', null, item.w));
    }

    function teach() {
      playing = false;
      ctx.stage.innerHTML = '';
      if (ctx.count) ctx.count(0, 0);
      const rows = REFRESH.vowels.map((v) => h('div', { class: 'vrow' + (v.letter === 'e' ? ' efocus' : '') },
        h('span', { class: 'vlet' }, v.letter),
        card('short', v.short),
        card('long', v.long)));
      rows.forEach((row) => {
        row.querySelectorAll('.vcard').forEach((b) => {
          const w = b.querySelector('b').textContent;
          b.addEventListener('click', () => say(w));
        });
      });
      const chips = (list, side) => list.map((w) => {
        const b = h('button', { class: 'echip', type: 'button', 'data-side': side, 'aria-label': (side === 'short' ? 'Short e. ' : 'Long e. ') + w + '. Hear it.' }, w);
        b.addEventListener('click', () => say(w));
        return b;
      });
      ctx.stage.append(h('div', { class: 'activity vrefresh', 'data-game': 'refresh', 'data-phase': 'teach' },
        h('p', { class: 'bigprompt' }, 'Vowel Refresher'),
        ...rows,
        h('div', { class: 'efocusbox' },
          h('p', { class: 'efocuslab' }, 'Listen to e'),
          speakerBtnHear(),
          h('div', { class: 'erow' }, h('span', null, 'Quick'), ...chips(REFRESH.eShort, 'short')),
          h('div', { class: 'erow' }, h('span', null, 'Name'), ...chips(REFRESH.eLong, 'long'))),
        h('button', { class: 'btn big primary', type: 'button', onclick: () => round() }, 'Practice', icon('next'))));
      if (IR.sayItem) IR.sayItem(ctx, 'audio/u51_p_refresh.mp3');
    }

    function speakerBtnHear() {
      return IR.speakerBtn(() => Snd.play('audio/u51_p_refresh_e.mp3'), 'Hear the e words');
    }

    function finish() {
      const note = 'Stars: ' + earned + ' of ' + REFRESH.practice.length + '.';
      ctx.finish();
      decorate(h, 'Vowel refresher', note);
    }

    function round() {
      playing = true;
      if (i >= REFRESH.practice.length) return finish();
      const item = REFRESH.practice[i];
      ctx.progress(i / REFRESH.practice.length);
      if (ctx.count) ctx.count(i + 1, REFRESH.practice.length);
      ctx.stage.innerHTML = '';
      let locked = false, clean = true;
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap Short or Long.');
      const starRow = h('div', { class: 'rfstars', 'aria-label': earned + ' stars' }, ...Array.from({ length: earned }, () => icon('star')));
      const fix = h('div', { class: 'pairfix' });
      const act = h('div', { class: 'activity vrefresh', 'data-game': 'refresh', 'data-phase': 'play', 'data-word': item.w });
      function arm(name, isLong) {
        const b = h('button', { class: 'sortbin', type: 'button', 'data-bin': isLong ? 'long' : 'short', 'aria-label': name },
          h('b', null, name));
        b.addEventListener('click', async () => {
          if (locked || b.classList.contains('yes') || b.classList.contains('no')) return;
          if (isLong === item.long) {
            locked = true;
            if (clean) { earned++; starRow.append(icon('star')); starRow.setAttribute('aria-label', earned + ' stars'); }
            b.classList.add('yes');
            b.querySelector('b').textContent = 'Yes';
            status.textContent = 'Yes';
            status.className = 'status rfy';
            await Snd.seq([A.sfx.ding, rfSrc(item.w)], 80);
            if (!ctx.scr.ok()) return;
            await IR.sleep(350);
            if (!ctx.scr.ok()) return;
            i++; round();
          } else {
            clean = false;
            ctx.miss();
            b.classList.add('no');
            b.querySelector('b').textContent = 'No';
            act.dataset.phase = 'error';
            status.textContent = 'No. Listen to both.';
            status.className = 'status rfn';
            fix.innerHTML = '';
            item.pair.forEach((w) => {
              const ok = (REFRESH.practice.filter((p) => p.w === w)[0] || item).long === item.long && w === item.w;
              const heard = w === item.w;
              fix.append(h('button', { class: 'paircard' + (heard ? ' yes' : ''), type: 'button', 'aria-label': w + (heard ? '. This is the word.' : '.'), onclick: () => say(w) },
                h('b', null, w), h('small', null, heard ? 'Yes' : (item.long ? 'Short' : 'Long'))));
            });
            Snd.seq(item.pair.map(rfSrc), 160);
          }
        });
        return b;
      }
      const spk = IR.speakerBtn(() => say(item.w), 'Hear the word');
      act.append(h('p', { class: 'spellcount' }, (i + 1) + ' of ' + REFRESH.practice.length), starRow, spk, h('p', { class: 'vrule' }, 'Short or Long?'), h('div', { class: 'sortbins' }, arm('Short', false), arm('Long', true)), fix, status);
      ctx.stage.append(act);
      if (ctx.armReveal) ctx.armReveal(item.long ? 'Long' : 'Short', (root) => root.querySelector('[data-bin="' + (item.long ? 'long' : 'short') + '"]'));
      say(item.w);
    }

    ctx.setBack(() => {
      if (playing && i > 0) { i--; round(); return true; }
      if (playing) { teach(); return true; }
      return false;
    });
    ctx.setNext(() => {
      if (!playing) { round(); return true; }
      if (i < REFRESH.practice.length - 1) { i++; round(); return true; }
      return false;
    });
    teach();
  }

  const api = { PAIRS: PAIRS, roundWords: roundWords, plan: plan, firstWrong: firstWrong, distractor: distractor, timerOn: timerOn, REFRESH: REFRESH, sort: sort, spell: spell, refresh: refresh };
  root.IR = root.IR || {};
  root.IR.u5Games = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
