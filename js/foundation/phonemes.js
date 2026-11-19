/* One phoneme list for Team 1. A part is a sound, not a letter.
   me is m + ee. see is s + ee. the is th + uh. Silent letters are not sounds. */
(function () {
  const PARTS = {
    a: ['a'],
    am: ['a', 'm'],
    at: ['a', 't'],
    mat: ['m', 'a', 't'],
    sat: ['s', 'a', 't'],
    sam: ['s', 'a', 'm'],
    tam: ['t', 'a', 'm'],
    mats: ['m', 'a', 't', 's'],
    me: ['m', 'ee'],
    see: ['s', 'ee'],
    the: ['th', 'uh']
  };
  /* Team 1 words first, then the long-e and heart-word examples the count must get right. */
  const countWords = ['am', 'at', 'sat', 'mat', 'Sam', 'Tam', 'mats', 'me', 'see', 'the'];
  const buildWords = ['am', 'at', 'mat', 'sat', 'Sam', 'Tam'];
  function of(word) {
    const parts = PARTS[String(word || '').toLowerCase()];
    return parts ? parts.slice() : null;
  }
  window.IRPhonemes = { parts: PARTS, countWords: countWords, buildWords: buildWords, of: of };
})();
