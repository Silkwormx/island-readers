/* Unit 3 orange bell update (Oct 31 2026): orange accents for the ng lesson, "Ring every bell and learn its sounds" (replaces Fish Pond),
   new mascots (Zip A, Frill C) in this lesson. Loaded after sor.js, before screens.js. */
(function () {
  'use strict';
  const IR = window.IR;
  const { D, colorWord, A } = IR;
  const ORANGE = ['#C95A10', '#E8731C', '#D9631A', '#B85410', '#E07B22', '#CC6A14', '#BF5E12', '#D46A1A'];
  IR.LESSONS.forEach((L, i) => { L.color = ORANGE[i % ORANGE.length]; });
  const L = (id) => IR.LESSONS.find((x) => x.id === id);
  L('listen').blurb = 'Heart words, then the bell story';
  L('story').blurb = 'Read the bell story, then read it 3 times';

  const bells = {
    id: 'bells', title: 'Ring every bell and learn its sounds', blurb: 'Frill says a word. Ring that bell.', color: '#E8731C',
    run(ctx) {
      const words = [].concat(D.bells || [], (D.fish && D.fish.ng) || [], (D.build || []).map((x) => x.word), (D.hear || []).reduce((list, x) => list.concat([x.word], x.choices || []), []));
      IR.ringBells(ctx, { words: words, audio: (w) => A.word(w), color: colorWord });
    }
  };
  const fi = IR.LESSONS.findIndex((x) => x.id === 'fish');
  if (fi >= 0) IR.LESSONS.splice(fi, 1, bells);
})();
