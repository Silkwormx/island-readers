/* Placement engine (no screen code). Same items, stop rules and placement logic as the printable Island Readers Placement Test
   (reading-program/placement/Island_Readers_Placement_Test.pdf), plus an adaptive search so most readers finish in 10 to 15 minutes.
   Works in the browser (window.IR.placementEngine) and in node tests (module.exports). */
(function (root) {
  'use strict';
  const TEAMS = [
    { n: 1, letters: ['a', 'm', 's', 't'] }, { n: 2, letters: ['p', 'f', 'i', 'n'] }, { n: 3, letters: ['o', 'd', 'c', 'u'] },
    { n: 4, letters: ['g', 'b', 'e', 'k'] }, { n: 5, letters: ['h', 'r', 'l', 'w'] }, { n: 6, letters: ['j', 'y', 'x', 'q'] }, { n: 7, letters: ['v', 'z'] }
  ];
  const TEAM_OF = {}; TEAMS.forEach((t) => t.letters.forEach((l) => { TEAM_OF[l] = t.n; }));
  const LETTER_NAMES = 'k s b o w a t g y m e c r z i h l u p d x f j n q v'.split(' ');
  const LETTER_SOUNDS = 't o f m z c k i r s u x b l e w n g y a p d q h v j'.split(' ');
  /* [word, madeUp(1), fair reading for the grown-up] */
  const FOUND_WORDS = {
    1: [['sat', 0], ['tas', 1, 'rhymes with gas'], ['mat', 0], ['mas', 1, 'rhymes with gas']],
    2: [['pit', 0], ['nif', 1, 'rhymes with if'], ['fan', 0], ['mip', 1, 'rhymes with lip']],
    3: [['dot', 0], ['fod', 1, 'rhymes with nod'], ['cup', 0], ['sut', 1, 'rhymes with cut']],
    4: [['bed', 0], ['teb', 1, 'rhymes with web'], ['keg', 0], ['gub', 1, 'rhymes with tub']],
    5: [['web', 0], ['lom', 1, 'rhymes with Tom'], ['rug', 0], ['hib', 1, 'rhymes with bib']],
    6: [['jet', 0], ['yeb', 1, 'rhymes with web'], ['fox', 0], ['quep', 1, 'kw-ep, rhymes with step']],
    7: [['van', 0], ['vop', 1, 'rhymes with top'], ['zap', 0], ['zeb', 1, 'rhymes with web']]
  };
  const FOUND_HEART = ['a', 'the', 'is', 'I', 'to', 'his', 'has', 'of', 'you', 'was', 'said'];
  const U = (n, name, skill, real, made) => ({ n, name, skill, real, made });
  const UNITS = [
    U(1, 'Short Vowels & Floss', 'short a e i o u; ff ll ss zz', ['lot', 'bell', 'puff', 'miss', 'jazz'], [['fep', 'step'], ['tib', 'bib'], ['zoff', 'off'], ['vill', 'hill'], ['ruzz', 'buzz']]),
    U(2, 'Blends', 'st bl cl dr fr sk sw; nd mp nt ft', ['clap', 'drum', 'lamp', 'nest', 'swift'], [['plim', 'slim'], ['stog', 'frog'], ['skib', 'bib'], ['glent', 'went'], ['flund', 'fund']]),
    U(3, 'Digraphs', 'sh ch th wh ck', ['shed', 'chop', 'thin', 'whip', 'duck'], [['shap', 'map'], ['chab', 'cab'], ['thim', 'him, th as in thin'], ['whep', 'step'], ['zock', 'rock']]),
    U(4, 'Glued Sounds', 'ang ing ong ung; ank ink onk unk', ['sang', 'king', 'long', 'bunk', 'think'], [['fing', 'king'], ['shung', 'lung'], ['vank', 'bank'], ['yink', 'pink'], ['jonk', 'honk']]),
    U(5, 'Silent e', 'a_e i_e o_e u_e e_e', ['tape', 'slide', 'home', 'cube', 'these'], [['fape', 'tape'], ['brime', 'time'], ['trobe', 'robe'], ['plune', 'tune'], ['zete', 'Pete']]),
    U(6, 'Endings', '-s -es -ed -ing', ['jumps', 'wishes', 'hunted', 'filled', 'resting'], [['glims', 'rims'], ['zinches', 'pinches'], ['frimped', 'limped'], ['glunted', 'hunted'], ['blonking', 'honking']]),
    U(7, 'Syllables', 'two-syllable words', ['goblin', 'insect', 'tadpole', 'robot', 'problem'], [['fimbet', 'fim-bet'], ['lomtrin', 'lom-trin'], ['nubkite', 'nub-kite'], ['zopid', 'zo-pid or zop-id'], ['gasmon', 'gas-mon']]),
    U(8, 'Tricky Sounds', 'tch dge; ild old ind', ['match', 'ledge', 'child', 'fold', 'find'], [['plitch', 'pitch'], ['zudge', 'fudge'], ['brild', 'wild'], ['smold', 'cold'], ['vind', 'kind']]),
    U(9, 'Bossy R', 'ar or er ir ur', ['shark', 'horn', 'fern', 'shirt', 'burst'], [['zarp', 'harp'], ['blorn', 'horn'], ['kerm', 'term'], ['glirt', 'shirt'], ['nurp', 'burp']]),
    U(10, 'More Bossy R', 'air are ear', ['chair', 'share', 'clear', 'scare', 'beard'], [['plair', 'chair'], ['brare', 'care'], ['zear', 'hear or bear'], ['thrair', 'chair'], ['smare', 'care']]),
    U(11, 'Long A & E Teams', 'ai ay ee ea ey', ['paint', 'stray', 'sheep', 'cream', 'donkey'], [['glaim', 'claim'], ['smay', 'day'], ['fleem', 'seem'], ['jeat', 'heat'], ['lopkey', 'lop-kee']]),
    U(12, 'Long O & I Teams', 'oa ow oe ie igh', ['toast', 'blown', 'toe', 'pie', 'bright'], [['ploam', 'foam'], ['smow', 'snow or cow'], ['droe', 'toe'], ['snight', 'night'], ['groach', 'coach']]),
    U(13, 'The oo Sounds', 'oo ew ui ue', ['spoon', 'hook', 'chew', 'suit', 'clue'], [['ploon', 'moon'], ['frook', 'book or moon'], ['zew', 'new'], ['pruit', 'fruit'], ['strue', 'true']]),
    U(14, 'The au Sounds', 'au aw augh; ea as in head', ['launch', 'crawl', 'taught', 'thread', 'fault'], [['plaw', 'saw'], ['zaun', 'lawn'], ['braught', 'caught'], ['smead', 'head or bead'], ['taunch', 'launch']]),
    U(15, 'Sliding Vowels', 'oi oy ou ow', ['point', 'enjoy', 'cloud', 'crown', 'mouth'], [['ploin', 'coin'], ['zoy', 'boy'], ['vout', 'out'], ['frowl', 'growl'], ['sloud', 'cloud']]),
    U(16, 'Tricky Teams', 'ei eigh ew ough', ['vein', 'sleigh', 'few', 'though', 'rough'], [['jeil', 'veil or ceiling'], ['zeigh', 'sleigh'], ['snew', 'new or few'], ['plought', 'thought or out'], ['glough', 'any ough sound']]),
    U(17, 'Soft c and g', 'ce ci cy ge gi gy', ['city', 'fence', 'giant', 'stage', 'cell'], [['cim', 'sim, soft c'], ['gep', 'jep, soft g'], ['plice', 'nice'], ['zage', 'page'], ['gince', 'since, soft g']]),
    U(18, 'Silent Letters', 'kn wr mb gn gh', ['knob', 'wrap', 'climb', 'sign', 'ghost'], [['knaz', 'jazz, k is silent'], ['wrog', 'frog, w is silent'], ['flumb', 'plum'], ['gnop', 'top, g is silent'], ['ghup', 'cup, h is silent']]),
    U(19, 'Suffixes', '-er -est -ly -ful', ['smaller', 'quickest', 'softly', 'thankful', 'sweeter'], [['blunker', 'blunk-er'], ['flastest', 'flast-est'], ['drimly', 'drim-lee'], ['zoftful', 'zoft-ful'], ['smeelest', 'smeel-est']]),
    U(20, 'Suffix Spelling Rules', 'double, drop e, y to i', ['shopping', 'smiled', 'ponies', 'happiest', 'planned'], [['zabbing', 'zab-ing'], ['plimed', 'rhymes with timed'], ['fropped', 'rhymes with dropped'], ['lundies', 'lun-deez'], ['fozzier', 'foz-ee-er']]),
    U(21, 'Prefixes', 'un- pre- re- dis-', ['unpack', 'preheat', 'refill', 'dislike', 'unwrap'], [['unplim', 'un-plim'], ['preglode', 'pre-glode'], ['refrisp', 're-frisp'], ['disvamp', 'dis-vamp'], ['reblain', 're-blain']]),
    U(22, 'Big Endings', '-tion -ture -ment', ['motion', 'capture', 'payment', 'fiction', 'enjoyment'], [['glention', 'glen-shun'], ['dimpture', 'dimp-cher'], ['jandment', 'jand-ment'], ['voction', 'vok-shun'], ['flisture', 'flis-cher']])
  ];
  const LAST = UNITS.length; /* 22 */
  /* Lesson landing inside a unit. Add a row here when a later unit (10, 11, 12...) should open on a lesson. */
  const LESSONS = [
    { unit: 7, n: '7.1', key: 'u71', name: 'Compound words', w: 'sandbox' },
    { unit: 7, n: '7.2', key: 'u72', name: 'Closed syllables', w: 'napkin' },
    { unit: 7, n: '7.3', key: 'u73', name: 'Open syllables', w: 'robot' },
    { unit: 8, n: '8.1', key: 'u81', name: 'tch', w: 'match' },
    { unit: 8, n: '8.2', key: 'u82', name: 'dge', w: 'ledge' },
    { unit: 8, n: '8.3', key: 'u83', name: 'ild and old', w: 'child' },
    { unit: 9, n: '9.1', key: 'u91', name: 'ar', w: 'shark' },
    { unit: 9, n: '9.2', key: 'u92', name: 'or', w: 'horn' },
    { unit: 9, n: '9.3', key: 'u93', name: 'er', w: 'fern' },
    { unit: 9, n: '9.4', key: 'u94', name: 'ir and ur', w: 'bird' }
  ];
  function lessonItems(n) { return LESSONS.filter((row) => row.unit === n); }
  /* marks: [{ n, ok }] in lesson order. The first miss is the start. If every word is read, begin at that unit's first lesson. */
  function lessonStart(n, marks) {
    const rows = lessonItems(n);
    if (!rows.length) return null;
    const by = {}; (marks || []).forEach((m) => { by[m.n] = !!m.ok; });
    const miss = rows.filter((row) => by[row.n] === false)[0];
    const pick = miss || rows[0];
    return { unit: n, lesson: pick.n, key: pick.key, name: pick.name, href: '#/u' + n + '/' + pick.key };
  }
  const unit = (n) => UNITS[n - 1];
  const item = (w, made, hint) => ({ w, made: !!made, hint: hint || '' });
  /* Quick probe: 2 real + 2 made-up. The full check adds the other 6, so the probe counts toward the 10. */
  function probeItems(n) { const u = unit(n); return [item(u.real[0]), item(u.made[0][0], 1, u.made[0][1]), item(u.real[1]), item(u.made[1][0], 1, u.made[1][1])]; }
  function restItems(n) { const u = unit(n); const out = []; for (let i = 2; i < 5; i++) { out.push(item(u.made[i][0], 1, u.made[i][1]), item(u.real[i])); } return out; }
  function fullItems(n) { return probeItems(n).concat(restItems(n)); }
  /* Screener: one real word per level, not reused in the unit checks. */
  const SCREENER = [{ unit: 2, w: 'flag' }, { unit: 5, w: 'stone' }, { unit: 9, w: 'storm' }, { unit: 13, w: 'broom' }, { unit: 17, w: 'price' }, { unit: 21, w: 'replay' }];
  const HEART_SETS = [
    { id: 'F', name: 'Foundations', units: [0, 0], words: FOUND_HEART },
    { id: '1', name: 'Set 1', units: [1, 2], words: ['give', 'put', 'some', 'were', 'other', 'people', 'water', 'walk'] },
    { id: '2', name: 'Set 2', units: [3, 4], words: ['again', 'any', 'could', 'every', 'once', 'through', 'great', 'goes'] },
    { id: '3', name: 'Set 3', units: [5, 6], words: ['answer', 'country', 'learn', 'mother', 'move', 'school', 'should', 'wash'] },
    { id: '4', name: 'Set 4', units: [7, 8], words: ['because', 'been', 'does', 'eyes', 'father', 'many', 'their', 'would'] }
  ];
  const PA = {
    blend: [['/u/ /p/', 'up'], ['/m/ /a/ /p/', 'map'], ['/l/ /e/ /g/', 'leg'], ['/sh/ /i/ /p/', 'ship'], ['/b/ /e/ /l/ /t/', 'belt'], ['/s/ /t/ /o/ /p/', 'stop'], ['/f/ /r/ /o/ /g/', 'frog'], ['/s/ /p/ /l/ /a/ /sh/', 'splash']],
    first: [['sun', 's'], ['map', 'm'], ['dog', 'd'], ['fish', 'f'], ['chip', 'ch'], ['egg', 'e']],
    last: [['bus', 's'], ['cap', 'p'], ['hen', 'n'], ['log', 'g'], ['dish', 'sh'], ['milk', 'k']],
    count: [['it', 2], ['pin', 3], ['rug', 3], ['wish', 3], ['lamp', 4], ['spot', 4], ['desk', 4], ['crust', 5]]
  };
  const PA_PASS = { blend: 7, first: 5, last: 5, count: 7 };

  /* ---- rules from the printable test ---- */
  const UNIT_PASS = 8;                          /* 8, 9 or 10 of 10 */
  const probePass = (right, madeRight) => right >= 3 && madeRight >= 1;
  const rowPass = (right, madeRight) => right >= 3 && madeRight >= 1;   /* Foundations word row: 3 or 4 of 4, one made-up right */
  /* Team secure = every sound right + word row passed. Start at the first Team not secure.
     If the only misses are 1 or 2 sounds and every row passed, go on to the units (missed sounds become warm-ups). */
  function foundationsPlacement(soundMiss, rows) {
    const missedTotal = Object.keys(soundMiss).reduce((n, k) => n + (soundMiss[k] || 0), 0);
    const rowsAll = TEAMS.every((t) => rows[t.n] && rows[t.n].pass);
    if (rowsAll && missedTotal <= 2) return { team: null, warmups: missedTotal };
    for (const t of TEAMS) {
      const secure = !(soundMiss[t.n] > 0) && rows[t.n] && rows[t.n].pass;
      if (!secure) return { team: t.n };
    }
    return { team: null, warmups: missedTotal };
  }
  /* Adaptive unit search. results[n] = { probe:{right,made}, full:{right} }.
     A unit counts as passed by its full check when it has one, otherwise by its probe. */
  function passed(res, n) {
    const r = res[n]; if (!r) return null;
    if (r.full) return r.full.right >= UNIT_PASS;
    if (r.probe) return probePass(r.probe.right, r.probe.made);
    return null;
  }
  function bracket(res) {
    let hi = LAST + 1;
    for (let n = 1; n <= LAST; n++) if (passed(res, n) === false) { hi = n; break; }
    let lo = 0;
    for (let n = hi - 1; n >= 1; n--) if (passed(res, n) === true) { lo = n; break; }
    return { lo, hi };
  }
  /* Next step: { kind:'probe'|'full', unit } or { kind:'done', start } (start 23 = read every unit). */
  function nextStep(res) {
    const { lo, hi } = bracket(res);
    if (hi - lo > 1) {
      let mid = Math.floor((lo + hi) / 2);
      const hints = [].concat(res.__hint || []);   /* screener guesses are tried first, then halving */
      for (const g of hints) if (g > lo && g < hi && !res[g]) { mid = g; break; }
      return { kind: 'probe', unit: mid };
    }
    if (hi === LAST + 1) {
      if (!(res[LAST] && res[LAST].full)) return { kind: 'full', unit: LAST };
      return { kind: 'done', start: LAST + 1 };
    }
    if (!(res[hi] && res[hi].full)) return { kind: 'full', unit: hi };
    if (hi === 1) return { kind: 'done', start: 1 };
    if (!(res[hi - 1] && res[hi - 1].full)) return { kind: 'full', unit: hi - 1 };
    return { kind: 'done', start: hi };
  }
  /* Screener: read up the ladder, stop after 2 misses in a row. Returns a first unit to probe. */
  /* Age 8 and up start the ladder at Unit 5 (the printable's fast start). A miss on the first two steps adds the Unit 2 word. */
  function screenerOrder(age8) { return age8 ? SCREENER.slice(1).concat([SCREENER[0]]) : SCREENER.slice(); }
  function screenerHint(answers) {
    /* answers: [{unit, ok}] in order. Probe the highest level read first, then the first level missed above it. */
    let best = 0, miss = null;
    answers.forEach((a) => { if (a.ok && a.unit > best) { best = a.unit; miss = null; } else if (!a.ok && a.unit > best && miss == null) miss = a.unit; });
    return [best, miss].filter((x) => x);
  }
  function screenerDone(answers) {
    const n = answers.length; if (n >= SCREENER.length) return true;
    return n >= 2 && !answers[n - 1].ok && !answers[n - 2].ok;
  }
  function heartSetsFor(start) {
    /* start: { team } or { unit }. Foundations set for Teams and Units 1 to 2; Set k when its units come before the start unit. */
    const u = start.team ? 0 : start.unit;
    return HEART_SETS.filter((s) => (s.id === 'F' ? u <= 2 : s.units[0] < u));
  }
  const api = { TEAMS, TEAM_OF, LETTER_NAMES, LETTER_SOUNDS, FOUND_WORDS, FOUND_HEART, UNITS, LAST, LESSONS, unit, lessonItems, lessonStart, probeItems, restItems, fullItems,
    SCREENER, HEART_SETS, PA, PA_PASS, UNIT_PASS, probePass, rowPass, foundationsPlacement, passed, bracket, nextStep, screenerOrder, screenerHint, screenerDone, heartSetsFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root && root.IR) root.IR.placementEngine = api;
  else if (root) root.__placementEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
