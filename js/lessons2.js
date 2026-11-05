/* Mini lessons 6-8: Feed Zip, Sentence Bridge, Now You Read It (comic). Heart words now live in Story Time (lesson 1). */
(function () {
  'use strict';
  const IR = window.IR;
  const { D, h, $, $$, sleep, shuffle, pick, colorWord, icon, Snd, A, sayWord, speakerBtn, CHUNK_COLORS } = IR;
  const LESSONS = IR.LESSONS;

  /* ---------- 6. Feed Zip: read the word, tap the matching bubble ---------- */
  LESSONS.push({
    id: 'feed', title: 'Feed Zip', blurb: 'Read the word, feed Zip the match', color: '#D98E00',
    run(ctx) {
      const words = (D.bells || []).concat((D.hear || []).map((x) => x.word || x)).filter(Boolean);
      const uniq = [...new Set(words)];
      IR.runFeedZip(ctx, {
        words: uniq,
        say: (w) => sayWord(w),
        colorWord,
        promptKey: 'feed',
        promptAudio: 'audio/p_feed.mp3',
        rounds: 6
      });
    }
  });

  /* ---------- 7. Sentence Bridge ---------- */
  LESSONS.push({
    id: 'sentence', title: 'Sentence Bridge', blurb: 'Build a sentence, build a bridge', color: '#2E9E6B',
    run(ctx) {
      ctx.setInstr('Listen. Put the words in order to make a sentence.', 'p_sent');
      const rounds = D.sentences; let r = 0; const stage = ctx.stage;
      function round() {
        const R = rounds[r]; ctx.progress(r / rounds.length); stage.innerHTML = ''; let misses = 0;
        const audio = 'audio/b_' + R.n + '.mp3';
        const spk = speakerBtn(() => Snd.play(audio), 'Hear the sentence');
        const slotsEl = h('div', { class: 'slots sent' }); const bankEl = h('div', { class: 'bank' });
        const status = h('p', { class: 'status', 'aria-live': 'polite' }, 'Tap or drag the words into the boxes.');
        const tiles = shuffle(R.words.map((w, i) => ({ id: 'w' + i, text: w, cls: 'word' })));
        const bridge = h('div', { class: 'bridgebar' }, ...R.words.map(() => h('i')));
        const board = IR.TileBoard({
          tiles, nSlots: R.words.length, slotsEl, bankEl,
          onChange: (b) => { $$('i', bridge).forEach((el, k) => el.classList.toggle('on', b.slots[k] != null)); },
          onFull: async (texts, b) => {
            b.locked = true;
            if (texts.join(' ') === R.text) {
              status.textContent = 'Yes! The bridge is built.'; slotsEl.classList.add('right'); bridge.classList.add('lit');
              await Snd.seq([A.sfx.ding, audio], 200);
              if (!ctx.scr.ok()) return; await sleep(500); if (!ctx.scr.ok()) return;
              r++; if (r < rounds.length) round(); else { ctx.progress(1); ctx.finish(); }
            } else {
              misses++; ctx.miss(); status.textContent = 'Almost! Listen again and try again.'; slotsEl.classList.add('almost');
              await IR.tryAgain(audio);
              if (!ctx.scr.ok()) return; slotsEl.classList.remove('almost'); b.slots.fill(null);
              if (misses >= 2) b.hint = tiles.find((t) => t.text === R.words[0]).id;
              b.locked = false; b.render();
            }
          }
        });
        stage.append(h('div', { class: 'activity sentact' },
          h('div', { class: 'pic' }, h('img', { src: R.img, alt: 'A picture from the story' })),
          h('div', { class: 'row center' }, spk), slotsEl, bridge, bankEl, status));
        Snd.play(audio);
      }
      round();
    }
  });

  /* ---------- 8. Now You Read It (comic read-along with the read-3-times tracker) ---------- */
  LESSONS.push({
    id: 'story', title: 'Now You Read It', blurb: 'Read the comic yourself, then read it 3 times', color: '#8E5BD6',
    run(ctx) {
      ctx.setInstr('Tap a speaker to hear a sentence. Then you read it!', 'p_story');
      const pages = D.story; let p = 0; let reached = 0; const stage = ctx.stage; let auto = false; const S = IR.S(); const heard = new Set(); ctx.showNav(false);   /* this lesson has its own Back / Next row */
      const picEl = h('img', { class: 'panel', alt: '' });
      const sentEl = h('p', { class: 'sentence', 'aria-live': 'polite' });
      const dots = h('div', { class: 'pagedots' }, ...pages.map(() => h('i')));
      const spk = speakerBtn(() => playPage(false), 'Hear this sentence'); spk.classList.add('huge');
      const prev = h('button', { class: 'btn small back', type: 'button' }, icon('back'), 'Back');
      const next = h('button', { class: 'btn small primary next', type: 'button' }, 'Next', icon('next'));
      const allBtn = h('button', { class: 'btn small', type: 'button' }, icon('play'), 'Play the whole story');
      const reads = h('div', { class: 'reads' });
      const readBtn = h('button', { class: 'btn small good', type: 'button' }, icon('check'), 'I read it aloud');
      function renderReads() {
        const n = S.reads.story || 0; reads.innerHTML = '';
        reads.append(h('span', null, 'Read it 3 times: '), ...[0, 1, 2].map((k) => h('i', { class: 'rd' + (k < n ? ' on' : '') })));
      }
      readBtn.addEventListener('click', () => { S.reads.story = Math.min(3, (S.reads.story || 0) + 1); IR.save(); renderReads(); setNextLabel(); });
      const readIt = () => heard.size >= pages.length || (S.reads.story || 0) > 0;     /* Finish (and the star) only after every sentence was heard to the end, or the child tapped 'I read it' */
      function setNextLabel() { next.firstChild.textContent = p === pages.length - 1 ? (readIt() ? 'Finish' : 'Next') : 'Next'; }
      function setPage(i) {
        p = i; reached = Math.max(reached, p); const pg = pages[p];
        picEl.src = pg.img; sentEl.innerHTML = '';
        pg.words.forEach((w, k) => sentEl.append(h('span', { class: 'w', 'data-k': k }, w), ' '));
        $$('i', dots).forEach((d, k) => { d.classList.toggle('cur', k === p); d.classList.toggle('seen', k <= reached); });
        setNextLabel();
        ctx.progress(reached / (pages.length - 1));
      }
      function playPage(keepAuto) {
        if (!keepAuto) auto = false;
        const pg = pages[p]; const ws = $$('.w', sentEl);
        return Snd.play('audio/s_' + pg.n + '.mp3', { onTime: (t) => {
          pg.t.forEach((tt, k) => { const el = ws[k]; if (!el) return; el.classList.toggle('hl', t >= tt[0] - 0.04 && t < (pg.t[k + 1] ? pg.t[k + 1][0] - 0.04 : 99)); el.classList.toggle('read', t >= tt[1]); });
        } }).then((ok) => { ws.forEach((e) => e.classList.remove('hl', 'read')); if (ok && pg.n != null) { heard.add(pg.n); setNextLabel(); } return ok; });
      }
      prev.addEventListener('click', () => { auto = false; if (p > 0) { setPage(p - 1); playPage(false); } else ctx.goBack(); });   /* first page: Back = previous lesson */
      next.addEventListener('click', async () => {
        auto = false;
        if (p < pages.length - 1) { setPage(p + 1); playPage(false); }
        else { Snd.stop(); if (!ctx.scr.ok()) return; if (readIt()) { ctx.progress(1); ctx.finish(); } else location.hash = '#/check'; }   /* not read yet: Next just skips ahead, no star */
      });
      allBtn.addEventListener('click', async () => {
        auto = true; setPage(0);
        for (let i = 0; i < pages.length && auto && ctx.scr.ok(); i++) { setPage(i); await playPage(true); await sleep(350); }
        auto = false;
      });
      stage.append(h('div', { class: 'activity story' },
        h('div', { class: 'panelwrap' }, picEl), h('div', { class: 'sentrow' }, spk, sentEl), dots,
        h('div', { class: 'row' }, prev, allBtn, next), h('div', { class: 'row' }, readBtn, reads)));
      renderReads(); setPage(0);
      Snd.seq([A.prompt('p_story')], 100).then(() => {});
    }
  });
})();
