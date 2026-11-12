/* Spelling plans from lesson data. No DOM.
   A future unit can pass spellWords (those words only) or any word lists.
   Words may use this lesson's sounds and earlier sounds, never a later pattern. */
(function (root) {
  'use strict';
  const HEART = new Set(['the', 'a', 'i', 'to', 'is', 'was', 'what', 'you', 'said', 'are', 'from', 'for', 'as', 'of', 'do', 'does', 'gone', 'says', 'orange', 'they', 'she', 'he', 'we', 'be', 'me', 'my', 'by', 'or', 'and', 'into', 'onto']);
  const SKIP = new Set(['text', 'cap', 'ex', 'desc', 'note', 'tip', 'audio', 'img', 'href', 'voice', 'who', 'say', 'id', 'key', 'name', 'storyTitle', 'title', 'prompts', 't', 'dur', 'html', 'alt', 'src', 'color', 'group', 'type']);
  const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
  const BASE_MULTI = ['sh', 'ch', 'th', 'wh', 'ck', 'ff', 'll', 'ss', 'zz', 'qu'];
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

  function cleanWord(s) {
    if (typeof s !== 'string' || /\s/.test(s)) return null;
    if (!/^[A-Za-z]+[.!?,']*$/.test(s)) return null;
    const w = s.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length < 2 || w.length > 12 || HEART.has(w)) return null;
    if (w === 'zip' || w === 'frill') return null;
    return w;
  }

  function walk(node, into, depth) {
    if (node == null || depth > 8) return;
    const one = cleanWord(node);
    if (one) { into.push(one); return; }
    if (typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach((x) => walk(x, into, depth + 1)); return; }
    Object.keys(node).forEach((k) => { if (!SKIP.has(k)) walk(node[k], into, depth + 1); });
  }

  const LIST_KEYS = ['bells', 'mixWords', 'introWords', 'chips', 'ido', 'wedo', 'youdo', 'newWords', 'scramble', 'chain', 'chains', 'feedYes', 'feedNo', 'fishYes', 'fishNo', 'build', 'hear', 'rhyme', 'check', 'fish', 'review', 'ngnk', 'spellWords'];
  const PART_KEYS = new Set(['chunk', 'onset', 'altChunk', 'altOnset', 'pre', 'post', 'ans', 'base']);

  function walkLists(node, into, fromKey, depth) {
    if (node == null || depth > 7) return;
    if (typeof node === 'string') {
      if (PART_KEYS.has(fromKey)) return;
      const c = cleanWord(node);
      if (c && c.length >= 3) into.push(c);
      return;
    }
    if (typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach((x) => walkLists(x, into, fromKey, depth + 1)); return; }
    Object.keys(node).forEach((k) => { if (!SKIP.has(k) && !PART_KEYS.has(k)) walkLists(node[k], into, k, depth + 1); });
  }

  function harvest(lesson) {
    const into = [];
    if (lesson && Array.isArray(lesson.spellWords) && lesson.spellWords.length) {
      lesson.spellWords.forEach((w) => { const c = cleanWord(w); if (c && c.length >= 3) into.push(c); });
    } else if (lesson) LIST_KEYS.forEach((k) => { if (lesson[k] != null) walkLists(lesson[k], into, k, 0); });
    return [...new Set(into)].sort();
  }

  function untaughtSuffix(word, spec, wordSet) {
    const endings = spec.endings || [];
    const pairs = [['ing', 3], ['es', 2], ['ed', 2], ['s', 1]];
    for (let i = 0; i < pairs.length; i++) {
      const e = pairs[i][0];
      if (endings.indexOf(e) >= 0) continue;
      if (word.length <= e.length + 2 || word.slice(-e.length) !== e) continue;
      if (e === 's' && /(ss|ff|ll|zz|ck|ng|nk)$/.test(word)) continue;
      const base = word.slice(0, -e.length);
      if (base.length >= 3 && wordSet.has(base)) return true;
    }
    return false;
  }

  function allowedSet(spec) {
    const set = new Set(LETTERS.concat(BASE_MULTI).concat(spec.add || []).concat(spec.endings || []));
    return set;
  }

  function multis(spec) {
    return ['ing', 'es', 'ed'].concat(BASE_MULTI).concat(spec.add || []).filter((g) => allowedSet(spec).has(g) || (spec.endings || []).indexOf(g) >= 0)
      .filter((g, i, a) => a.indexOf(g) === i)
      .sort((a, b) => b.length - a.length);
  }

  function splitStem(stem, spec) {
    const multi = multis(spec).filter((g) => (spec.endings || []).indexOf(g) < 0 || g.length > 2);
    const allow = allowedSet(spec);
    const out = [];
    let i = 0;
    while (i < stem.length) {
      let hit = null;
      for (let k = 0; k < multi.length; k++) {
        const g = multi[k];
        if (stem.slice(i, i + g.length) === g && (g.length > 1 || allow.has(g))) { hit = g; break; }
      }
      if (!hit) {
        const ch = stem[i];
        if (!allow.has(ch)) return null;
        hit = ch;
      }
      out.push(hit);
      i += hit.length;
    }
    return out;
  }

  function hasVowel(parts) {
    return (parts || []).some((g) => VOWELS.has(g[0]) || VOWELS.has(g));
  }

  function token(g, extra) {
    return Object.assign({ g: g, ending: false, magic: false }, extra || {});
  }

  function segment(word, spec) {
    const endings = (spec.endings || []).slice().sort((a, b) => b.length - a.length);
    for (let i = 0; i < endings.length; i++) {
      const e = endings[i];
      if (word.length > e.length + 1 && word.slice(-e.length) === e) {
        const base = word.slice(0, -e.length);
        const parts = splitStem(base, spec);
        if (parts && hasVowel(parts)) return parts.map((g) => token(g)).concat([token(e, { ending: true })]);
      }
    }
    if (spec.magic && /e$/.test(word) && word.length >= 4) {
      const stem = word.slice(0, -1);
      const parts = splitStem(stem, spec);
      if (parts && parts.length >= 2 && hasVowel(parts.slice(0, -1)) && !VOWELS.has(parts[parts.length - 1][0])) {
        return parts.map((g) => token(g)).concat([token('e', { magic: true })]);
      }
    }
    if (/e$/.test(word) && (spec.endings || []).indexOf('e') < 0 && !spec.magic) return null;
    const parts = splitStem(word, spec);
    if (!parts || !hasVowel(parts)) return null;
    if (/e$/.test(word) && !spec.magic && parts[parts.length - 1] === 'e' && parts.length > 2) return null;
    return parts.map((g) => token(g));
  }

  function boxes(tokens) { return tokens.filter((t) => !t.magic); }

  function focusToken(tokens, spec) {
    if (spec.focus === 'vowel') {
      const mag = tokens.some((t) => t.magic);
      if (!mag) return null;
      const sound = boxes(tokens);
      for (let i = sound.length - 2; i >= 0; i--) if (VOWELS.has(sound[i].g)) return sound[i];
      return null;
    }
    if (spec.focus === 'o') {
      const t = tokens.filter((x) => x.g === 'o' && tokens.some((m) => m.magic));
      return t[0] || null;
    }
    const hits = tokens.filter((t) => t.g === spec.focus && (spec.focus.length === 1 || t.ending || spec.add.indexOf(spec.focus) >= 0 || t.g === spec.focus));
    if (spec.endings && spec.endings.indexOf(spec.focus) >= 0) return tokens.filter((t) => t.ending && t.g === spec.focus)[0] || null;
    return hits[0] || null;
  }

  function spellable(words, spec) {
    const wordSet = new Set(words);
    const out = [];
    words.forEach((w) => {
      if (untaughtSuffix(w, spec, wordSet)) return;
      const tokens = segment(w, spec);
      if (!tokens) return;
      out.push({ w: w, tokens: tokens });
    });
    return out;
  }

  const PREFER = {
    ng: ['sing', 'ring', 'song', 'hung', 'bang', 'wing', 'long', 'king'],
    nk: ['sink', 'bank', 'junk', 'honk', 'pink', 'wink', 'skunk', 'trunk'],
    u51: ['cake', 'kite', 'bone', 'rope', 'home', 'cube', 'cape', 'tape'],
    u53: ['come', 'some', 'done', 'love', 'dove', 'glove', 'have', 'give'],
    u61: ['boxes', 'dishes', 'foxes', 'wishes', 'cats', 'hats', 'bugs'],
    u62: ['jumped', 'packed', 'helped', 'bumped', 'landed', 'rested'],
    u63: ['fishing', 'ringing', 'jumping', 'hanging', 'packing', 'resting']
  };

  function byPrefer(spec) {
    const pref = PREFER[spec.id] || [];
    return (a, b) => {
      const ia = pref.indexOf(a.w); const ib = pref.indexOf(b.w);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.w.localeCompare(b.w);
    };
  }

  function preferFocus(items, spec) {
    const yes = []; const no = [];
    items.forEach((it) => { (focusToken(it.tokens, spec) ? yes : no).push(it); });
    yes.sort(byPrefer(spec));
    no.sort(byPrefer(spec));
    return yes.concat(no);
  }

  function sameClass(g) {
    if (VOWELS.has(g)) return 'vowel';
    if (g === 's' || g === 'es' || g === 'ed' || g === 'ing') return 'ending';
    if (g === 'ng' || g === 'nk') return 'glue';
    return 'cons';
  }

  function distractors(correct, tokens, spec, n) {
    const used = new Set(tokens.map((t) => t.g));
    const pool = [];
    const endings = spec.endings || [];
    const extra = spec.focus === 'vowel' || spec.focus === 'o' ? ['a', 'e', 'i', 'o', 'u'] : [];
    extra.concat(endings).concat(spec.add || []).concat(['m', 't', 'n', 'p', 's', 'a', 'i', 'o']).forEach((g) => {
      if (pool.indexOf(g) < 0) pool.push(g);
    });
    const kind = sameClass(correct);
    const same = pool.filter((g) => g !== correct && !used.has(g) && sameClass(g) === kind && (allowedSet(spec).has(g) || endings.indexOf(g) >= 0 || VOWELS.has(g)));
    const rest = pool.filter((g) => g !== correct && !used.has(g) && same.indexOf(g) < 0 && (allowedSet(spec).has(g) || endings.indexOf(g) >= 0));
    return same.concat(rest).slice(0, n);
  }

  function keyOf(tokens) { return tokens.map((t) => (t.magic ? 'E' : t.g)).join('|'); }

  function diff(a, b) {
    const A = a.map((t) => (t.magic ? 'E' : t.g));
    const B = b.map((t) => (t.magic ? 'E' : t.g));
    if (A.length === B.length) {
      let n = 0; let i = -1;
      for (let k = 0; k < A.length; k++) if (A[k] !== B[k]) { n++; i = k; }
      return n === 1 ? { type: 'sub', i: i, from: A[i], to: B[i] } : null;
    }
    if (Math.abs(A.length - B.length) !== 1) return null;
    const add = B.length > A.length;
    const longer = add ? B : A;
    const shorter = add ? A : B;
    for (let i = 0; i < longer.length; i++) {
      const cut = longer.slice(0, i).concat(longer.slice(i + 1));
      if (cut.every((t, k) => t === shorter[k])) return { type: add ? 'add' : 'del', i: i, g: longer[i] };
    }
    return null;
  }

  function chainsFrom(items, spec) {
    const by = {};
    items.forEach((it) => { by[it.w] = it; });
    const words = Object.keys(by);
    const next = {};
    words.forEach((w) => { next[w] = []; });
    words.forEach((a) => {
      words.forEach((b) => {
        if (a >= b) return;
        const d = diff(by[a].tokens, by[b].tokens);
        if (!d) return;
        next[a].push(b);
        next[b].push(a);
      });
    });
    const paths = [];
    function walkPath(path) {
      if (path.length >= 2 && path.length <= 4) paths.push(path.slice());
      if (path.length === 4) return;
      const last = path[path.length - 1];
      next[last].forEach((n) => {
        if (path.indexOf(n) >= 0) return;
        const d = diff(by[last].tokens, by[n].tokens);
        if (!d) return;
        path.push(n);
        walkPath(path);
        path.pop();
      });
    }
    words.forEach((w) => walkPath([w]));
    const lessonChain = Array.isArray(spec.chainHint) ? spec.chainHint.map((w) => String(w).toLowerCase()) : [];
    function score(path) {
      let s = path.length * 10;
      let along = 0;
      for (let i = 1; i < path.length; i++) {
        const ia = lessonChain.indexOf(path[i - 1]);
        const ib = lessonChain.indexOf(path[i]);
        if (ia >= 0 && ib === ia + 1) along++;
      }
      s += along * 5;
      if (path.some((w) => focusToken(by[w].tokens, spec))) s += 3;
      return s;
    }
    paths.sort((a, b) => score(b) - score(a) || a.join(',').localeCompare(b.join(',')));
    const picked = [];
    const used = new Set();
    paths.forEach((p) => {
      if (picked.length >= 2) return;
      if (p.length < 2) return;
      if (p.some((w) => used.has(w))) return;
      if (picked.length && p.length < 3 && picked[0].length >= 3) return;
      picked.push(p);
      p.forEach((w) => used.add(w));
    });
    return picked.map((p) => p.map((w) => by[w]));
  }

  function withFocus(items, spec) {
    return items.filter((it) => focusToken(it.tokens, spec));
  }

  function take(list, n) { return list.slice(0, n); }

  function edSound(word) {
    const base = word.replace(/ed$/, '');
    if (/[td]$/.test(base)) return 'audio/u6_snd_ed_cut.mp3';
    if (/[pkfs]$/.test(base) || /(ch|sh|th|ck)$/.test(base)) return 'audio/u6_snd_t_cut.mp3';
    return 'audio/u6_snd_d_cut.mp3';
  }

  function sSound(word) {
    const base = word.replace(/s$/, '');
    if (/[pkfts]$/.test(base) || /(ch|sh|th|ck)$/.test(base)) return 'audio/u6_snd_s.mp3';
    return 'audio/u6_snd_z.mp3';
  }

  function soundSrc(tok, word) {
    if (!tok || tok.magic) return null;
    if (tok.g === 'ed' && tok.ending) return edSound(word);
    if (tok.g === 'es' && tok.ending) return 'audio/u6_snd_iz.mp3';
    if (tok.g === 'ing' && tok.ending) return 'audio/u6_snd_ing.mp3';
    if (tok.g === 's' && tok.ending) return sSound(word);
    if (tok.g === 'ang' || tok.g === 'ing' || tok.g === 'ong' || tok.g === 'ung') return 'audio/' + tok.g + '.mp3';
    return null;
  }

  const LESSONS = [
    { id: 'ng', unit: 4, n: '4.1', name: 'ng', focus: 'ng', add: ['ng'], endings: [], magic: false, back: '#/island3', wordSrc: (w) => 'audio/w_' + w + '.mp3', dataKey: 'ng',
      tip: { who: 'zip', text: 'n and g stick together. They make one sound.' } },
    { id: 'nk', unit: 4, n: '4.2', name: 'nk', focus: 'nk', add: ['ng', 'nk'], endings: [], magic: false, back: '#/nk', wordSrc: (w) => 'audio/nk_w_' + w + '.mp3', dataKey: 'nk',
      tip: { who: 'frill', text: 'n and k stick together. You hear the k at the end.' } },
    { id: 'u51', unit: 5, n: '5.1', name: 'Silent e', focus: 'vowel', add: ['ng', 'nk'], endings: [], magic: true, back: '#/u51', wordSrc: (w) => 'audio/u51_w_' + w + '.mp3', dataKey: 'u51',
      tip: { who: 'zip', text: 'The e at the end makes the vowel say its name.' } },
    { id: 'u53', unit: 5, n: '5.2', name: 'Tricky silent e', focus: 'o', add: ['ng', 'nk'], endings: [], magic: true, back: '#/u53', wordSrc: (w) => 'audio/u53_w_' + w + '.mp3', dataKey: 'u53',
      tip: { who: 'frill', text: 'In come, some, and done, o says /u/. The e is silent.' } },
    { id: 'u61', unit: 6, n: '6.1', name: '-s and -es', focus: 'es', add: ['ng', 'nk'], endings: ['es', 's'], magic: false, back: '#/u6/u61', wordSrc: (w) => 'audio/u6_w_' + w + '.mp3', dataKey: 'u61',
      tip: { who: 'zip', text: 'When a word already hisses, add es. You hear an extra beat.' } },
    { id: 'u62', unit: 6, n: '6.2', name: '-ed', focus: 'ed', add: ['ng', 'nk'], endings: ['es', 's', 'ed'], magic: false, back: '#/u6/u62', wordSrc: (w) => 'audio/u6_w_' + w + '.mp3', dataKey: 'u62',
      tip: { who: 'frill', text: 'ed says /t/ in jumped.' } },
    { id: 'u63', unit: 6, n: '6.3', name: '-ing', focus: 'ing', add: ['ng', 'nk'], endings: ['ing', 'es', 'ed', 's'], magic: false, back: '#/u6/u63', wordSrc: (w) => 'audio/u6_w_' + w + '.mp3', dataKey: 'u63',
      tip: { who: 'zip', text: 'ing at the end keeps one sound.' } }
  ];

  function sourceFor(spec, packs) {
    if (spec.words) return { spellWords: spec.words, chain: spec.chainHint || [] };
    if (spec.dataKey === 'ng') return packs.ng;
    if (spec.dataKey === 'nk') return packs.nk;
    if (packs.u5 && packs.u5[spec.dataKey]) return packs.u5[spec.dataKey];
    if (packs.u6 && Array.isArray(packs.u6.lessons)) return packs.u6.lessons.filter((L) => L.key === spec.dataKey)[0];
    return null;
  }

  function patternWords(focused, spec) {
    let list = focused.slice();
    if (spec.focus === 'ed') {
      const t = list.filter((it) => edSound(it.w) === 'audio/u6_snd_t_cut.mp3');
      if (t.length >= 3) list = t;
    }
    if (spec.focus === 'o') list = list.filter((it) => it.tokens.some((tok) => tok.g === 'o' && it.tokens.some((m) => m.magic)));
    const pref = PREFER[spec.id] || [];
    list.sort((a, b) => {
      const ia = pref.indexOf(a.w); const ib = pref.indexOf(b.w);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.w.localeCompare(b.w);
    });
    return take(list, 4);
  }

  function buildOne(spec, packs) {
    const src = sourceFor(spec, packs);
    const hint = src && (src.chain || src.chains);
    const chainHint = Array.isArray(hint) && typeof hint[0] === 'string' ? hint : (Array.isArray(hint) ? hint[0] : []);
    const spec2 = Object.assign({}, spec, { chainHint: chainHint });
    const words = harvest(src || {});
    const items = spellable(words, spec2);
    const ordered = preferFocus(items, spec2);
    const focused = withFocus(items, spec2).sort(byPrefer(spec2));
    const gapSrc = (focused.length ? focused : ordered);
    const chains = chainsFrom(items, spec2);
    return {
      id: spec.id, unit: spec.unit, n: spec.n, name: spec.name, focus: spec.focus, back: spec.back,
      wordSrc: spec.wordSrc, tip: spec.tip, magic: !!spec.magic,
      words: items.map((it) => it.w),
      steps: {
        gap: take(gapSrc, 4).map((it) => ({ w: it.w, tokens: it.tokens, gap: focusToken(it.tokens, spec2) || boxes(it.tokens)[0], choices: [ (focusToken(it.tokens, spec2) || boxes(it.tokens)[0]).g ].concat(distractors((focusToken(it.tokens, spec2) || boxes(it.tokens)[0]).g, it.tokens, spec2, 2)) })),
        boxes: take(ordered, 3).map((it) => ({ w: it.w, tokens: it.tokens, extras: distractors(boxes(it.tokens)[0].g, it.tokens, spec2, 2) })),
        tiles: take(ordered.filter((it) => boxes(it.tokens).length >= 3), 4).map((it) => ({ w: it.w, tokens: it.tokens, extras: distractors(boxes(it.tokens)[0].g, it.tokens, spec2, 2) })),
        chains: chains,
        pattern: patternWords(focused.length ? focused : items, spec2).map((it) => ({ w: it.w, tokens: it.tokens, extras: distractors((focusToken(it.tokens, spec2) || it.tokens[0]).g, it.tokens, spec2, 1) }))
      },
      chainCount: chains.length
    };
  }

  function buildAll(packs, extra) {
    const list = LESSONS.map((spec) => buildOne(spec, packs || {}));
    (extra || []).forEach((spec) => list.push(buildOne(spec, packs || {})));
    return list;
  }

  const api = {
    HEART: HEART, harvest: harvest, segment: segment, boxes: boxes, diff: diff, soundSrc: soundSrc, edSound: edSound,
    buildAll: buildAll, buildOne: buildOne, LESSONS: LESSONS, spellable: spellable, chainsFrom: chainsFrom
  };
  root.IR = root.IR || {};
  root.IR.spellPlan = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
