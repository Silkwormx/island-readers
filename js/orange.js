/* Unit 4 ng look: orange accents. Fish Pond was already replaced, and Ring every bell is not on this lesson. */
(function () {
  'use strict';
  const IR = window.IR;
  const ORANGE = ['#C95A10', '#E8731C', '#D9631A', '#B85410', '#E07B22', '#CC6A14', '#BF5E12', '#D46A1A'];
  IR.LESSONS.forEach((L, i) => { L.color = ORANGE[i % ORANGE.length]; });
  const L = (id) => IR.LESSONS.find((x) => x.id === id);
  L('listen').blurb = 'Heart words, then the bell story';
  L('story').blurb = 'Read the bell story, then read it 3 times';
  const fi = IR.LESSONS.findIndex((x) => x.id === 'fish');
  if (fi >= 0) IR.LESSONS.splice(fi, 1);
})();
