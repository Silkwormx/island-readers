/* Cumulative letter scope for Learn the Letters.
   A practice item may use only letters and heart words already taught. */
(function (root) {
  function clean(word) {
    return String(word || '').replace(/[^A-Za-z]/g, '');
  }
  function letterIds(word) {
    const lower = clean(word).toLowerCase();
    const out = [];
    let i = 0;
    if (lower.indexOf('qu') === 0) { out.push('q'); i = 2; }
    for (; i < lower.length; i++) out.push(lower.charAt(i));
    return out;
  }
  function isHeart(program, word) {
    const raw = clean(word).toLowerCase();
    const hearts = (program && program.heart_words) || {};
    return Object.keys(hearts).some((key) => String(key).toLowerCase() === raw);
  }
  function wordOk(program, word, letters, hearts) {
    const ids = letterIds(word);
    if (!ids.length) return false;
    if (ids.some((id) => letters.indexOf(id) < 0)) return false;
    if (isHeart(program, word) && hearts.indexOf(clean(word).toLowerCase()) < 0) return false;
    return true;
  }
  function addWord(list, word) {
    const raw = String(word || '').trim();
    if (!raw || list.indexOf(raw) >= 0) return;
    list.push(raw);
  }
  function splitWords(text, list) {
    String(text || '').split(/\s+/).forEach((part) => addWord(list, part));
  }
  function pool(program, index) {
    const words = [];
    const lessons = program.lessons || [];
    for (let i = 0; i <= index && i < lessons.length; i++) {
      const lesson = lessons[i];
      (lesson.new_words || []).forEach((word) => addWord(words, word));
      (lesson.review_words || []).forEach((word) => addWord(words, word));
      (lesson.word_bank || []).forEach((word) => addWord(words, word));
      (lesson.reading_sequence || []).forEach((word) => addWord(words, word));
      ((lesson.ears_warmup && lesson.ears_warmup.words) || []).forEach((word) => addWord(words, word));
      (lesson.sentences_today || []).forEach((line) => splitWords(line, words));
      if (lesson.dictation) {
        (lesson.dictation.words || []).forEach((word) => addWord(words, word));
        splitWords(lesson.dictation.sentence, words);
      }
      (lesson.word_scenes || []).forEach((scene) => addWord(words, scene.word));
    }
    return words;
  }
  function known(program, index, letterCount, withHearts) {
    const lessons = program.lessons || [];
    const letters = [];
    const hearts = [];
    const takeLetter = (id) => { if (id && letters.indexOf(id) < 0) letters.push(id); };
    const takeHeart = (word) => {
      const key = clean(word).toLowerCase();
      if (key && hearts.indexOf(key) < 0) hearts.push(key);
    };
    for (let i = 0; i < index; i++) {
      (lessons[i].new_letters || []).forEach(takeLetter);
      (lessons[i].heart_words_today || []).forEach(takeHeart);
    }
    const lesson = lessons[index] || {};
    (lesson.new_letters || []).slice(0, letterCount).forEach(takeLetter);
    if (withHearts) (lesson.heart_words_today || []).forEach(takeHeart);
    return { letters: letters, hearts: hearts };
  }
  function wordsFor(program, index, scope) {
    return pool(program, index).filter((word) => letterIds(word).length > 1 && wordOk(program, word, scope.letters, scope.hearts));
  }
  function sentencesFor(program, index, scope) {
    const lesson = (program.lessons || [])[index] || {};
    const lines = (lesson.sentences_today || []).slice();
    if (lesson.dictation && lesson.dictation.sentence) lines.push(lesson.dictation.sentence);
    return lines.filter((line) => {
      const parts = String(line).split(/\s+/).map(clean).filter(Boolean);
      return parts.length && parts.every((part) => wordOk(program, part, scope.letters, scope.hearts));
    });
  }
  function sortsFor(lesson, scope) {
    return (lesson.lookalike_sorts || []).filter((sort) => (sort.letters || []).every((id) => scope.letters.indexOf(id) >= 0));
  }
  function itemsFrom(scope, words, sentences, sorts, checks) {
    const items = scope.letters.map((id) => ({ type: 'letter', value: id }));
    words.forEach((word) => items.push({ type: 'word', value: word }));
    sentences.forEach((line) => items.push({ type: 'sentence', value: line }));
    sorts.forEach((sort) => (sort.letters || []).forEach((id) => items.push({ type: 'letter', value: id })));
    (checks || []).forEach((check) => {
      if (!check || !check.item) return;
      items.push({ type: check.type === 'word' ? 'word' : 'letter', value: check.item });
    });
    return items;
  }
  function lessonPlan(program, lesson) {
    const lessons = (program && program.lessons) || [];
    const index = lessons.indexOf(lesson);
    const at = index < 0 ? 0 : index;
    const news = (lesson && lesson.new_letters) || [];
    const phases = news.map((id, n) => {
      const scope = known(program, at, n + 1, false);
      const words = wordsFor(program, at, scope);
      return { letter: id, letters: scope.letters, hearts: scope.hearts, flash: scope.letters.slice(), words: words, items: itemsFrom(scope, words, [], [], []) };
    });
    const closeScope = known(program, at, news.length, true);
    const closeWords = wordsFor(program, at, closeScope);
    const sentences = sentencesFor(program, at, closeScope);
    const sorts = sortsFor(lesson || {}, closeScope);
    const checks = (lesson && lesson.mastery_check && lesson.mastery_check.items) || [];
    const close = {
      letters: closeScope.letters,
      hearts: closeScope.hearts,
      flash: closeScope.letters.slice(),
      words: closeWords,
      sentences: sentences,
      sorts: sorts,
      items: itemsFrom(closeScope, closeWords, sentences, sorts, checks)
    };
    return { phases: phases, close: close };
  }
  root.IRLetterScope = { letterIds: letterIds, isHeart: isHeart, wordOk: wordOk, lessonPlan: lessonPlan };
})(typeof window !== 'undefined' ? window : globalThis);
