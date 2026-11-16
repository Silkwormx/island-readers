/* Learn the Letters. Not a unit. It sits before Unit 1.
   UFLI alphabet order, taught in groups: a m s t, p f i n, o d c u, g b e k, h r l w, j y x q, v z.
   A recorded word plays when one exists. Otherwise the browser speaks the sound. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, shuffle, icon, Snd, A, speakerBtn, sleep } = IR;

  function svg(body) {
    return '<svg viewBox="0 0 80 64" aria-hidden="true">' + body + '</svg>';
  }
  const PICS = {
    ant: svg('<ellipse cx="34" cy="40" rx="14" ry="9" fill="#8C4A32" stroke="#2B2540" stroke-width="3"/><circle cx="50" cy="34" r="7" fill="#A85B3C" stroke="#2B2540" stroke-width="3"/><path d="M46 28 L40 14 M54 28 L62 14 M22 36 L10 26 M20 42 L8 44 M22 48 L12 58 M44 32 L58 22 M42 42 L58 46 M42 48 L56 58" fill="none" stroke="#2B2540" stroke-width="2" stroke-linecap="round"/><circle cx="40" cy="14" r="2" fill="#2B2540"/><circle cx="62" cy="14" r="2" fill="#2B2540"/>'),
    map: svg('<path d="M14 12 h32 l8 6 v30 l-8 6 H14 z" fill="#F6E7B2" stroke="#2B2540" stroke-width="3"/><path d="M24 24 h16 M24 34 h22 M24 44 h12" stroke="#C45A3A" stroke-width="3" stroke-linecap="round"/>'),
    moon: svg('<path d="M48 10 A22 22 0 1 0 48 54 A16 16 0 1 1 48 10 z" fill="#F6E7B2" stroke="#2B2540" stroke-width="3"/>'),
    sun: svg('<circle cx="40" cy="34" r="12" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><path d="M40 8 v8 M40 50 v8 M16 34 h8 M56 34 h8 M22 16 l6 6 M52 46 l6 6 M58 16 l-6 6 M28 46 l-6 6" stroke="#E0A106" stroke-width="3" stroke-linecap="round"/>'),
    tent: svg('<path d="M8 52 L40 12 L72 52 z" fill="#E07A4A" stroke="#2B2540" stroke-width="3"/><path d="M40 52 V28" stroke="#2B2540" stroke-width="3"/>'),
    pig: svg('<ellipse cx="38" cy="36" rx="22" ry="16" fill="#F4A7C4" stroke="#2B2540" stroke-width="3"/><ellipse cx="58" cy="40" rx="8" ry="6" fill="#F7C2D6" stroke="#2B2540" stroke-width="3"/><circle cx="30" cy="32" r="2" fill="#2B2540"/>'),
    fan: svg('<path d="M40 34 L18 14 L22 36 z M40 34 L64 16 L48 40 z M40 34 L58 54 L36 46 z" fill="#7EB6E0" stroke="#2B2540" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="34" r="4" fill="#F6C445" stroke="#2B2540" stroke-width="2"/>'),
    ink: svg('<rect x="30" y="28" width="20" height="26" rx="3" fill="#2B2540"/><path d="M34 28 L40 12 L46 28" fill="#3D4A66" stroke="#2B2540" stroke-width="3"/><rect x="34" y="36" width="12" height="4" fill="#F6E7B2"/>'),
    nest: svg('<path d="M12 36 Q40 58 68 36" fill="none" stroke="#C4A574" stroke-width="4"/><path d="M18 36 Q40 50 62 36" fill="none" stroke="#A68455" stroke-width="3"/><ellipse cx="32" cy="32" rx="6" ry="5" fill="#F4F0E6" stroke="#2B2540" stroke-width="2"/><ellipse cx="48" cy="32" rx="6" ry="5" fill="#F4F0E6" stroke="#2B2540" stroke-width="2"/>'),
    ox: svg('<ellipse cx="40" cy="38" rx="18" ry="14" fill="#C4A574" stroke="#2B2540" stroke-width="3"/><path d="M24 28 C16 10 28 12 30 24 M56 28 C64 10 52 12 50 24" fill="none" stroke="#2B2540" stroke-width="3"/><circle cx="34" cy="36" r="2" fill="#2B2540"/><circle cx="48" cy="36" r="2" fill="#2B2540"/>'),
    dog: svg('<ellipse cx="42" cy="38" rx="20" ry="14" fill="#C48A4A" stroke="#2B2540" stroke-width="3"/><path d="M24 28 L18 14 L32 26 M58 30 L68 14 L60 34" fill="#C48A4A" stroke="#2B2540" stroke-width="3"/><circle cx="36" cy="36" r="2" fill="#2B2540"/><ellipse cx="58" cy="42" rx="5" ry="3" fill="#8C5A2A"/>'),
    cat: svg('<path d="M16 40 L24 16 L34 32 H48 L58 16 L66 40 V54 H16 z" fill="#E8A15A" stroke="#2B2540" stroke-width="3"/><circle cx="32" cy="40" r="2" fill="#2B2540"/><circle cx="50" cy="40" r="2" fill="#2B2540"/>'),
    up: svg('<path d="M40 10 L58 32 H48 V54 H32 V32 H22 z" fill="#F28C00" stroke="#2B2540" stroke-width="3" stroke-linejoin="round"/>'),
    goat: svg('<ellipse cx="40" cy="40" rx="18" ry="14" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/><path d="M28 28 L22 10 M52 28 L58 10" stroke="#2B2540" stroke-width="3"/><path d="M40 46 v10" stroke="#C4A574" stroke-width="3"/><circle cx="34" cy="38" r="2" fill="#2B2540"/><circle cx="48" cy="38" r="2" fill="#2B2540"/>'),
    bus: svg('<rect x="10" y="18" width="60" height="30" rx="4" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><rect x="16" y="24" width="12" height="10" fill="#9FD4F2" stroke="#2B2540" stroke-width="2"/><rect x="32" y="24" width="12" height="10" fill="#9FD4F2" stroke="#2B2540" stroke-width="2"/><circle cx="24" cy="50" r="5" fill="#2B2540"/><circle cx="56" cy="50" r="5" fill="#2B2540"/>'),
    egg: svg('<ellipse cx="40" cy="36" rx="16" ry="22" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/>'),
    kite: svg('<path d="M40 6 L62 32 L40 58 L18 32 z" fill="#E25B4A" stroke="#2B2540" stroke-width="3"/><path d="M40 58 C48 66 44 74 52 78" fill="none" stroke="#2B2540" stroke-width="3"/>'),
    hat: svg('<path d="M14 40 h52 v6 H14 z" fill="#3D7EA6" stroke="#2B2540" stroke-width="3"/><path d="M24 40 Q40 12 56 40" fill="#5B9BC4" stroke="#2B2540" stroke-width="3"/>'),
    rat: svg('<ellipse cx="36" cy="38" rx="16" ry="10" fill="#C4A8A0" stroke="#2B2540" stroke-width="3"/><circle cx="54" cy="32" r="8" fill="#C4A8A0" stroke="#2B2540" stroke-width="3"/><path d="M18 36 C8 28 8 48 18 42" fill="none" stroke="#2B2540" stroke-width="3"/><circle cx="56" cy="30" r="1.5" fill="#2B2540"/>'),
    lamp: svg('<path d="M24 28 h32 l6 14 H18 z" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><rect x="36" y="42" width="8" height="12" fill="#C4A574" stroke="#2B2540" stroke-width="3"/><rect x="28" y="52" width="24" height="5" fill="#2B2540"/>'),
    web: svg('<circle cx="40" cy="34" r="4" fill="#2B2540"/><path d="M40 34 L40 8 M40 34 L64 20 M40 34 L62 50 M40 34 L40 60 M40 34 L16 50 M40 34 L14 20" stroke="#2B2540" stroke-width="2"/><ellipse cx="40" cy="34" rx="10" ry="8" fill="none" stroke="#2B2540" stroke-width="2"/><ellipse cx="40" cy="34" rx="20" ry="16" fill="none" stroke="#2B2540" stroke-width="2"/>'),
    jam: svg('<path d="M28 24 h24 v30 a8 8 0 0 1-8 8 h-8 a8 8 0 0 1-8-8 z" fill="#C2406A" stroke="#2B2540" stroke-width="3"/><rect x="26" y="16" width="28" height="10" rx="2" fill="#F6C445" stroke="#2B2540" stroke-width="3"/>'),
    yarn: svg('<circle cx="40" cy="34" r="18" fill="#C2408A" stroke="#2B2540" stroke-width="3"/><path d="M28 28 C40 40 36 48 52 40 M24 40 C36 30 48 44 58 30" fill="none" stroke="#F4F0E6" stroke-width="2"/>'),
    box: svg('<path d="M14 24 L40 12 L66 24 L40 36 z" fill="#E7C48A" stroke="#2B2540" stroke-width="3"/><path d="M14 24 V46 L40 58 V36 M66 24 V46 L40 58" fill="#F6E7B2" stroke="#2B2540" stroke-width="3"/>'),
    quilt: svg('<rect x="14" y="14" width="52" height="40" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/><path d="M14 28 h52 M14 42 h52 M32 14 v40 M50 14 v40" stroke="#7EB6E0" stroke-width="3"/>'),
    van: svg('<path d="M8 40 V26 h28 l10 10 h18 v14 H8 z" fill="#5B9BC4" stroke="#2B2540" stroke-width="3"/><circle cx="22" cy="46" r="5" fill="#2B2540"/><circle cx="54" cy="46" r="5" fill="#2B2540"/>'),
    zip: svg('<rect x="34" y="8" width="12" height="48" rx="2" fill="#C4A574" stroke="#2B2540" stroke-width="3"/><path d="M36 16 h8 M36 24 h8 M36 32 h8 M36 40 h8" stroke="#2B2540" stroke-width="2"/>')
  };

  /* Stroke numbers sit at the start. The arrow is the end of the stroke. */
  const LETTERS = [
    { id: 'a', name: 'a', nameSay: 'ay', sound: '/a/', soundSay: 'ah, ant', word: 'ant', cue: 'a as in ant', where: 'start',
      strokes: [{ d: 'M68 78 C68 48 28 46 28 76 C28 106 70 108 70 78', nx: 96, ny: 70 }, { d: 'M70 58 L70 112', nx: 96, ny: 44 }] },
    { id: 'm', name: 'm', nameSay: 'em', sound: '/m/', soundSay: 'mmm, map', word: 'map', audio: 'audio/w_map.mp3', cue: 'm as in map', where: 'start',
      strokes: [{ d: 'M24 112 L24 52', nx: 12, ny: 40 }, { d: 'M24 70 C24 48 52 48 52 74 L52 112', nx: 36, ny: 40 }, { d: 'M52 70 C52 48 82 48 82 74 L82 112', nx: 70, ny: 40 }] },
    { id: 's', name: 's', nameSay: 'ess', sound: '/s/', soundSay: 'sss, sun', word: 'sun', audio: 'audio/w_sun.mp3', cue: 's as in sun', where: 'start',
      strokes: [{ d: 'M78 52 C78 34 30 36 32 58 C34 78 86 72 78 96 C70 118 28 112 30 92', nx: 90, ny: 40 }] },
    { id: 't', name: 't', nameSay: 'tee', sound: '/t/', soundSay: 't, tent', word: 'tent', cue: 't as in tent', where: 'start',
      strokes: [{ d: 'M58 30 L58 116', nx: 72, ny: 24 }, { d: 'M34 64 L82 64', nx: 22, ny: 50 }] },
    { id: 'p', name: 'p', nameSay: 'pee', sound: '/p/', soundSay: 'p, pig', word: 'pig', audio: 'audio/w_pig.mp3', cue: 'p as in pig', where: 'start',
      strokes: [{ d: 'M36 36 L36 132', nx: 18, ny: 28 }, { d: 'M36 48 C36 34 84 34 84 64 C84 94 36 94 36 74', nx: 48, ny: 28 }] },
    { id: 'f', name: 'f', nameSay: 'eff', sound: '/f/', soundSay: 'fff, fan', word: 'fan', audio: 'audio/u53_w_fan.mp3', cue: 'f as in fan', where: 'start',
      strokes: [{ d: 'M74 40 C74 18 34 16 34 42 L34 122', nx: 84, ny: 28 }, { d: 'M20 70 L62 70', nx: 12, ny: 54 }] },
    { id: 'i', name: 'i', nameSay: 'eye', sound: '/i/', soundSay: 'ih, ink', word: 'ink', audio: 'audio/nk_w_ink.mp3', cue: 'i as in ink', where: 'start',
      strokes: [{ d: 'M58 62 L58 116', nx: 74, ny: 56 }, { d: 'M58 36 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', nx: 78, ny: 28, dot: true }] },
    { id: 'n', name: 'n', nameSay: 'en', sound: '/n/', soundSay: 'nnn, nest', word: 'nest', cue: 'n as in nest', where: 'start',
      strokes: [{ d: 'M32 112 L32 52', nx: 16, ny: 44 }, { d: 'M32 68 C32 46 84 46 84 74 L84 112', nx: 48, ny: 38 }] },
    { id: 'o', name: 'o', nameSay: 'oh', sound: '/o/', soundSay: 'o, ox', word: 'ox', cue: 'o as in ox', where: 'start',
      strokes: [{ d: 'M78 78 C78 46 28 46 28 78 C28 110 78 110 78 78', nx: 90, ny: 58 }] },
    { id: 'd', name: 'd', nameSay: 'dee', sound: '/d/', soundSay: 'd, dog', word: 'dog', cue: 'd as in dog', where: 'start',
      strokes: [{ d: 'M78 28 L78 116', nx: 92, ny: 22 }, { d: 'M78 70 C78 46 26 46 26 76 C26 106 78 108 78 78', nx: 58, ny: 40 }] },
    { id: 'c', name: 'c', nameSay: 'see', sound: '/k/', soundSay: 'k, cat', word: 'cat', audio: 'audio/u6_w_cat.mp3', cue: 'c as in cat', where: 'start',
      strokes: [{ d: 'M82 54 C64 34 26 40 26 76 C26 112 66 120 84 100', nx: 92, ny: 42 }] },
    { id: 'u', name: 'u', nameSay: 'you', sound: '/u/', soundSay: 'uh, up', word: 'up', cue: 'u as in up', where: 'start',
      strokes: [{ d: 'M30 48 L30 90 C30 114 78 114 78 90', nx: 14, ny: 38 }, { d: 'M78 48 L78 112', nx: 92, ny: 40 }] },
    { id: 'g', name: 'g', nameSay: 'jee', sound: '/g/', soundSay: 'g, goat', word: 'goat', cue: 'g as in goat', where: 'start',
      strokes: [{ d: 'M72 78 C72 50 26 48 26 76 C26 104 72 106 72 78', nx: 84, ny: 58 }, { d: 'M72 62 L72 124 C72 140 36 140 32 122', nx: 90, ny: 50 }] },
    { id: 'b', name: 'b', nameSay: 'bee', sound: '/b/', soundSay: 'b, bus', word: 'bus', audio: 'audio/u6_w_bus.mp3', cue: 'b as in bus', where: 'start',
      strokes: [{ d: 'M34 26 L34 116', nx: 16, ny: 20 }, { d: 'M34 62 C34 44 86 44 86 76 C86 108 34 108 34 80', nx: 52, ny: 38 }] },
    { id: 'e', name: 'e', nameSay: 'ee', sound: '/e/', soundSay: 'eh, egg', word: 'egg', cue: 'e as in egg', where: 'start',
      strokes: [{ d: 'M30 74 L80 74', nx: 16, ny: 60 }, { d: 'M78 74 C78 46 24 44 24 76 C24 108 76 114 82 94', nx: 90, ny: 62 }] },
    { id: 'k', name: 'k', nameSay: 'kay', sound: '/k/', soundSay: 'k, kite', word: 'kite', audio: 'audio/u51_w_kite.mp3', cue: 'k as in kite', where: 'start',
      strokes: [{ d: 'M36 26 L36 116', nx: 18, ny: 20 }, { d: 'M78 48 L42 76 L80 116', nx: 90, ny: 38 }] },
    { id: 'h', name: 'h', nameSay: 'aitch', sound: '/h/', soundSay: 'h, hat', word: 'hat', audio: 'audio/u6_w_hat.mp3', cue: 'h as in hat', where: 'start',
      strokes: [{ d: 'M30 26 L30 116', nx: 14, ny: 20 }, { d: 'M30 70 C30 46 82 46 82 74 L82 116', nx: 46, ny: 40 }] },
    { id: 'r', name: 'r', nameSay: 'are', sound: '/r/', soundSay: 'rrr, rat', word: 'rat', cue: 'r as in rat', where: 'start',
      strokes: [{ d: 'M34 116 L34 52', nx: 16, ny: 42 }, { d: 'M34 70 C34 48 72 46 80 64', nx: 48, ny: 40 }] },
    { id: 'l', name: 'l', nameSay: 'ell', sound: '/l/', soundSay: 'lll, lamp', word: 'lamp', cue: 'l as in lamp', where: 'start',
      strokes: [{ d: 'M58 24 L58 116', nx: 74, ny: 18 }] },
    { id: 'w', name: 'w', nameSay: 'double you', sound: '/w/', soundSay: 'w, web', word: 'web', cue: 'w as in web', where: 'start',
      strokes: [{ d: 'M16 48 L34 116 L52 62 L70 116 L90 48', nx: 8, ny: 34 }] },
    { id: 'j', name: 'j', nameSay: 'jay', sound: '/j/', soundSay: 'j, jam', word: 'jam', cue: 'j as in jam', where: 'start',
      strokes: [{ d: 'M64 60 L64 118 C64 136 30 136 28 116', nx: 80, ny: 52 }, { d: 'M64 34 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0', nx: 84, ny: 26, dot: true }] },
    { id: 'y', name: 'y', nameSay: 'why', sound: '/y/', soundSay: 'y, yarn', word: 'yarn', cue: 'y as in yarn', where: 'start',
      strokes: [{ d: 'M24 48 L52 92', nx: 12, ny: 36 }, { d: 'M84 48 L46 122', nx: 96, ny: 36 }] },
    { id: 'x', name: 'x', nameSay: 'ex', sound: '/ks/', soundSay: 'ks, box', word: 'box', audio: 'audio/u6_w_box.mp3', cue: 'x at the end of box', where: 'end',
      strokes: [{ d: 'M28 48 L78 116', nx: 16, ny: 36 }, { d: 'M78 48 L28 116', nx: 90, ny: 36 }] },
    { id: 'q', name: 'q', nameSay: 'cue', sound: '/kw/', soundSay: 'kw, quilt', word: 'quilt', cue: 'q as in quilt', where: 'start',
      strokes: [{ d: 'M70 74 C70 48 26 48 26 76 C26 104 70 106 70 78', nx: 82, ny: 56 }, { d: 'M70 70 L70 126 L88 112', nx: 88, ny: 60 }] },
    { id: 'v', name: 'v', nameSay: 'vee', sound: '/v/', soundSay: 'vvv, van', word: 'van', cue: 'v as in van', where: 'start',
      strokes: [{ d: 'M22 46 L52 116 L84 46', nx: 10, ny: 34 }] },
    { id: 'z', name: 'z', nameSay: 'zee', sound: '/z/', soundSay: 'zzz, zip', word: 'zip', audio: 'audio/u6_w_zip.mp3', cue: 'z as in zip', where: 'start',
      strokes: [{ d: 'M26 48 L80 48 L26 116 L80 116', nx: 14, ny: 34 }] }
  ];
  const BY = {};
  LETTERS.forEach((L) => { BY[L.id] = L; });
  const GROUPS = [
    { id: 'g1', n: 1, letters: ['a', 'm', 's', 't'] },
    { id: 'g2', n: 2, letters: ['p', 'f', 'i', 'n'] },
    { id: 'g3', n: 3, letters: ['o', 'd', 'c', 'u'] },
    { id: 'g4', n: 4, letters: ['g', 'b', 'e', 'k'] },
    { id: 'g5', n: 5, letters: ['h', 'r', 'l', 'w'] },
    { id: 'g6', n: 6, letters: ['j', 'y', 'x', 'q'] },
    { id: 'g7', n: 7, letters: ['v', 'z'] }
  ];
  const GAME_DEFS = [
    { id: 'find', title: 'Find the letter' },
    { id: 'match', title: 'Match upper and lower' },
    { id: 'sound', title: 'First sound' },
    { id: 'feed', title: 'Feed Zip' },
    { id: 'review', title: 'Letter review', min: 2 }
  ];

  function groupById(id) { return GROUPS.filter((g) => g.id === id)[0] || null; }
  function lettersOf(group) { return group.letters.map((id) => BY[id]); }
  function taughtThrough(group) {
    const out = [];
    GROUPS.forEach((g) => { if (g.n <= group.n) out.push(...lettersOf(g)); });
    return out;
  }
  function gamesFor(group) { return GAME_DEFS.filter((g) => !g.min || group.n >= g.min); }
  function doneId(group, game) { return 'll_' + group.id + '_' + game; }
  function glyph(id, upper) { return upper ? id.toUpperCase() : id; }

  function speak(text) {
    return new Promise((resolve) => {
      try {
        if (!window.speechSynthesis || !text) { resolve(false); return; }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.82;
        let done = false;
        const fin = () => { if (done) return; done = true; resolve(true); };
        u.onend = fin;
        u.onerror = fin;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
        setTimeout(fin, 2200);
      } catch (e) { resolve(false); }
    });
  }
  function hear(L, kind) {
    if (kind === 'sound' && L.audio) {
      return Snd.play(L.audio).then((ok) => (ok ? true : speak(L.soundSay)));
    }
    return speak(kind === 'name' ? L.nameSay : L.soundSay);
  }
  function formation(L) {
    const marks = L.strokes.map((s, i) => {
      const n = String(i + 1);
      const path = '<path d="' + s.d + '" fill="' + (s.dot ? '#2B2540' : 'none') + '" stroke="#2B2540" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"' + (s.dot ? '' : ' marker-end="url(#llarrow)"') + '/>';
      return path + '<circle cx="' + s.nx + '" cy="' + s.ny + '" r="11" fill="#F28C00" stroke="#2B2540" stroke-width="2"/><text x="' + s.nx + '" y="' + (s.ny + 5) + '" text-anchor="middle" font-size="14" font-family="Andika,sans-serif" fill="#fff" font-weight="700">' + n + '</text>';
    }).join('');
    return '<svg viewBox="0 0 120 150" aria-hidden="true"><defs><marker id="llarrow" markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="16" refX="14" refY="8" orient="auto"><path d="M0 1 L16 8 L0 15 z" fill="#E8731C"/></marker></defs><line x1="18" y1="78" x2="104" y2="78" stroke="#F3E6C4" stroke-width="2" stroke-dasharray="4 4"/><line x1="18" y1="116" x2="104" y2="116" stroke="#E4D6B4" stroke-width="3"/>' + marks + '</svg>';
  }
  function take(pool, n) {
    const out = [];
    let bag = [];
    while (out.length < n) {
      if (!bag.length) bag = shuffle(pool);
      out.push(bag.pop());
    }
    return out;
  }
  function options(correct, pool, n) {
    const rest = shuffle(pool.filter((x) => x.id !== correct.id));
    const picked = [correct];
    rest.forEach((x) => { if (picked.length < n) picked.push(x); });
    return shuffle(picked);
  }

  function listPage(app) {
    IR.newScreen();
    const items = GROUPS.map((g) => {
      const games = gamesFor(g);
      const done = games.filter((game) => IR.isDone(doneId(g, game.id))).length;
      return { g: g, done: done, total: games.length };
    });
    const finished = items.filter((it) => it.done === it.total).length;
    const bar = h('div', { class: 'gamebar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': items.length, 'aria-valuenow': finished },
      h('i', { style: 'width:' + Math.round(finished / items.length * 100) + '%' }));
    const cards = items.map((it) => h('li', null, h('button', {
      class: 'u5card llgroup' + (it.done === it.total ? ' done' : ''),
      type: 'button',
      'aria-label': 'Group ' + it.g.n + ', ' + it.g.letters.join(' ') + '.',
      onclick: () => { Snd.stop(); location.hash = '#/letters/' + it.g.id; }
    },
      h('span', { class: 'u5ord' }, String(it.g.n)),
      h('span', { class: 'u5name' }, it.g.letters.join(' \u00b7 ')),
      h('span', { class: 'u5min' }, it.done + ' of ' + it.total),
      it.done === it.total ? h('span', { class: 'u5mark', 'aria-hidden': 'true' }, icon('check')) : null)));
    app.append(h('div', { class: 'screen trailscreen unitpage u5menu llpage lllist' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(), h('h1', { class: 'uA-title' }, 'Learn the Letters'), IR.ui.gearButton()),
      h('main', { class: 'u5main' },
        h('div', { class: 'llintro' },
          h('img', { src: 'img/zipA.webp', alt: '' }),
          h('img', { src: 'img/frill.webp', alt: '' }),
          h('p', null, 'Seven groups, before Unit 1. This is not a unit.')),
        h('div', { class: 'u5teachrow' }, h('button', { class: 'btn teachgo', type: 'button', onclick: () => { if (IR.teach) IR.teach.toggle(true); } }, 'Teacher mode')),
        h('div', { class: 'u5prog' }, bar, h('span', { class: 'u5count' }, finished + ' of ' + items.length)),
        h('ol', { class: 'u5grid llgroups' }, ...cards))));
    if (IR.teach) IR.teach.sync();
  }

  function groupPage(app, group) {
    IR.newScreen();
    const letters = lettersOf(group);
    let current = letters[0];
    const form = h('div', { class: 'llform' });
    const row = h('div', { class: 'llletters' });
    function paintCards() {
      row.innerHTML = '';
      letters.forEach((L) => {
        const b = h('button', {
          class: 'llcard' + (L === current ? ' on' : ''),
          type: 'button',
          'aria-label': L.id.toUpperCase() + ' ' + L.id + '. ' + L.cue + '. Tap to hear the sound.',
          onclick: () => { current = L; paintCards(); paintForm(); hear(L, 'sound'); }
        },
          h('b', { class: 'llpair' }, glyph(L.id, true) + L.id),
          h('span', { class: 'llcue' }, L.cue));
        row.append(b);
      });
    }
    function paintForm() {
      const L = current;
      form.innerHTML = '';
      form.append(
        h('div', { class: 'llsvg', html: formation(L) }),
        h('div', { class: 'llmeta' },
          h('p', { class: 'llname' }, 'Name: ' + L.name),
          h('p', { class: 'llsound' }, 'Sound: ' + L.sound + ' as in ' + L.word),
          h('div', { class: 'llpic', html: PICS[L.word] || '' }),
          h('p', { class: 'llhow' }, 'Start at the orange number. Follow the arrow.'),
          h('div', { class: 'llhear' },
            h('button', { class: 'btn primary', type: 'button', onclick: () => hear(L, 'sound') }, icon('speaker'), 'Hear the sound'),
            h('button', { class: 'btn', type: 'button', onclick: () => hear(L, 'name') }, icon('speaker'), 'Hear the name'))));
    }
    const games = gamesFor(group);
    const gameRow = h('div', { class: 'llgames' }, ...games.map((game) => {
      const done = IR.isDone(doneId(group, game.id));
      return h('button', {
        class: 'u5card llplay' + (done ? ' done' : ''),
        type: 'button',
        'aria-label': game.title + (done ? '. Done.' : '.'),
        onclick: () => { Snd.stop(); location.hash = '#/letters/' + group.id + '/' + game.id; }
      }, h('span', { class: 'u5name' }, game.title), done ? h('span', { class: 'u5mark', 'aria-hidden': 'true' }, icon('check')) : null);
    }));
    paintCards();
    paintForm();
    app.append(h('div', { class: 'screen trailscreen unitpage u5menu llpage llgrouppage' },
      h('header', { class: 'uA-top' },
        h('button', { class: 'back homebtn', type: 'button', onclick: () => { Snd.stop(); location.hash = '#/letters'; } }, icon('back'), h('span', null, 'Letters')),
        h('h1', { class: 'uA-title' }, 'Group ' + group.n + ' · ' + group.letters.join(' ')),
        IR.ui.gearButton()),
      h('main', { class: 'llmain' }, row, form, gameRow)));
    if (IR.teach) IR.teach.sync();
  }

  function stepScreen(app, group, game) {
    const scr = IR.newScreen();
    let mistakes = 0;
    const fill = h('i');
    const bar = h('div', { class: 'pbar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instrBox = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const base = '#/letters/' + group.id;
    let backH = null;
    let nextH = null;
    const ctx = {
      scr: scr,
      stage: stage,
      miss() { mistakes++; },
      progress(f) {
        const v = Math.round(Math.max(0, Math.min(1, f)) * 100);
        fill.style.width = v + '%';
        bar.setAttribute('aria-valuenow', v);
      },
      setInstr(text) {
        instrBox.innerHTML = '';
        instrBox.style.display = text ? '' : 'none';
        if (text) instrBox.append(speakerBtn(() => speak(text), 'Hear the directions'), h('span', { class: 'itext' }, text));
      },
      setBack(fn) { backH = fn; },
      setNext(fn) { nextH = fn; },
      goBack() { Snd.stop(); if (backH && backH()) return; location.hash = base; },
      goNext() { Snd.stop(); if (nextH && nextH()) return; location.hash = base; },
      finish() {
        const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
        IR.recordActivity(doneId(group, game.id), stars);
        IR.touchStreak();
        IR.save();
        ctx.progress(1);
        const ov = IR.engage.endScreen({
          title: game.title,
          stars: stars,
          nextLabel: 'Back to the group',
          backLabel: 'Back to the group',
          onBack: () => { location.hash = base; },
          onNext: () => { location.hash = base; }
        });
        app.append(ov);
        Snd.play(A.sfx.done);
      }
    };
    const nextBtn = h('button', { class: 'btn big next', type: 'button', 'aria-label': 'Next', onclick: () => ctx.goNext() }, 'Next', icon('next'));
    const nav = h('div', { class: 'lesson-nav' }, nextBtn);
    IR.simpleNav(nav, nextBtn, () => { Snd.stop(); location.hash = base; }, 'Back to the group');
    const screen = h('div', { class: 'screen lessonscreen nkstep u5step llstep' },
      h('header', { class: 'lesson-top' }, bar, IR.ui.homeButton(), IR.ui.gearButton()),
      instrBox, stage, nav);
    app.append(screen);
    IR.attachGameRules(ctx, screen, game.title);
    if (IR.engage) IR.engage.mount(ctx, screen);
    if (IR.teach) { IR.teach.mount(ctx, screen); IR.teach.sync(); }
    ctx.progress(0);
    if (game.id === 'find') runFind(ctx, lettersOf(group));
    else if (game.id === 'match') runMatch(ctx, lettersOf(group));
    else if (game.id === 'sound') runSound(ctx, lettersOf(group));
    else if (game.id === 'feed') runFeed(ctx, lettersOf(group));
    else runReview(ctx, taughtThrough(group));
  }

  function choiceGrid(items, onPick) {
    return h('div', { class: 'llchoices' + (items.length < 3 ? ' few' : '') }, ...items.map((it) => {
      const b = h('button', {
        class: 'llchoice',
        type: 'button',
        'data-l': it.letter.id,
        'data-yes': it.yes ? '1' : '0',
        'aria-label': it.label
      }, it.label);
      b.addEventListener('click', () => onPick(it, b));
      return b;
    }));
  }

  function runRounds(ctx, rounds, draw) {
    let i = 0;
    let token = 0;
    function show() {
      const my = ++token;
      if (i >= rounds.length) { ctx.progress(1); ctx.finish(); return; }
      ctx.progress(i / rounds.length);
      if (ctx.count) ctx.count(i + 1, rounds.length);
      const round = rounds[i];
      let locked = false;
      ctx.stage.innerHTML = '';
      const status = h('p', { class: 'status', 'aria-live': 'polite' }, '\u00a0');
      const host = h('div', { class: 'activity llgame' });
      ctx.stage.append(host);
      if (ctx.armReveal) ctx.armReveal(round.reveal, (stage) => [...stage.querySelectorAll('.llchoice')].filter((el) => el.dataset.yes === '1'));
      draw(round, host, async (ok, btn) => {
        if (locked || my !== token) return;
        if (!ok) {
          btn.classList.add('tried');
          ctx.miss();
          status.textContent = 'Try again.';
          await Snd.play(A.sfx.tryagain);
          if (round.replay && ctx.scr.ok() && my === token) round.replay();
          return;
        }
        locked = true;
        btn.classList.add('right');
        status.textContent = 'Yes.';
        await Snd.play(A.sfx.ding);
        if (!ctx.scr.ok() || my !== token) return;
        i++;
        await sleep(420);
        if (ctx.scr.ok() && my === token) show();
      });
      host.append(status);
    }
    ctx.setNext(() => { if (i < rounds.length - 1) { i++; show(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  function runFind(ctx, pool) {
    ctx.setInstr('Hear the sound. Tap that letter.');
    const rounds = take(pool, Math.max(6, pool.length)).map((L) => ({
      letter: L,
      reveal: L.id,
      replay: () => hear(L, 'sound'),
      upper: Math.random() < 0.5
    }));
    runRounds(ctx, rounds, (round, host, pick) => {
      const opts = options(round.letter, pool, Math.min(4, pool.length)).map((L) => ({
        letter: L,
        yes: L.id === round.letter.id,
        label: glyph(L.id, round.upper)
      }));
      host.append(h('p', { class: 'llprompt' }, 'Which letter?'), choiceGrid(opts, (it, btn) => pick(it.yes, btn)));
      round.replay();
    });
  }

  function runMatch(ctx, pool) {
    ctx.setInstr('Tap the letter that matches.');
    const rounds = take(pool, Math.max(6, pool.length)).map((L, n) => ({ letter: L, reveal: L.id, showUpper: n % 2 === 0 }));
    runRounds(ctx, rounds, (round, host, pick) => {
      const wantUpper = !round.showUpper;
      const opts = options(round.letter, pool, Math.min(4, pool.length)).map((L) => ({
        letter: L,
        yes: L.id === round.letter.id,
        label: glyph(L.id, wantUpper)
      }));
      host.append(
        h('p', { class: 'llshown' }, glyph(round.letter.id, round.showUpper)),
        choiceGrid(opts, (it, btn) => pick(it.yes, btn)));
    });
  }

  function runSound(ctx, pool) {
    ctx.setInstr('Look at the picture. Tap the letter.');
    const rounds = take(pool, Math.max(6, pool.length)).map((L) => ({ letter: L, reveal: L.id }));
    runRounds(ctx, rounds, (round, host, pick) => {
      const L = round.letter;
      const end = L.where === 'end';
      const opts = options(L, pool, Math.min(4, pool.length)).map((item) => ({
        letter: item,
        yes: item.id === L.id,
        label: glyph(item.id, false)
      }));
      host.append(
        h('div', { class: 'llpic big', html: PICS[L.word] || '' }),
        h('p', { class: 'llword' }, L.word),
        h('p', { class: 'llask' }, end ? 'Which letter is at the end?' : 'Which letter is at the start?'),
        choiceGrid(opts, (it, btn) => pick(it.yes, btn)));
      hear(L, 'sound');
    });
  }

  function runFeed(ctx, pool) {
    IR.runFeedZip(ctx, {
      words: pool.map((L) => L.id),
      bites: Math.max(4, pool.length),
      line: 'Listen. Feed Zip the letter you hear.',
      promptAudio: '',
      say: (id) => hear(BY[id], 'sound')
    });
  }

  function runReview(ctx, pool) {
    ctx.setInstr('These letters are from this group and the groups before it.');
    const kinds = ['find', 'match', 'sound'];
    const rounds = shuffle(take(pool, 8).map((L, n) => ({
      letter: L,
      reveal: L.id,
      kind: kinds[n % kinds.length],
      showUpper: n % 2 === 0,
      replay: () => hear(L, 'sound')
    })));
    runRounds(ctx, rounds, (round, host, pick) => {
      const L = round.letter;
      const opts = options(L, pool, Math.min(4, pool.length));
      if (round.kind === 'match') {
        const wantUpper = !round.showUpper;
        host.append(
          h('p', { class: 'llshown' }, glyph(L.id, round.showUpper)),
          choiceGrid(opts.map((item) => ({ letter: item, yes: item.id === L.id, label: glyph(item.id, wantUpper) })), (it, btn) => pick(it.yes, btn)));
        return;
      }
      if (round.kind === 'sound') {
        host.append(
          h('div', { class: 'llpic big', html: PICS[L.word] || '' }),
          h('p', { class: 'llword' }, L.word),
          h('p', { class: 'llask' }, L.where === 'end' ? 'Which letter is at the end?' : 'Which letter is at the start?'),
          choiceGrid(opts.map((item) => ({ letter: item, yes: item.id === L.id, label: glyph(item.id, false) })), (it, btn) => pick(it.yes, btn)));
        hear(L, 'sound');
        return;
      }
      host.append(
        h('p', { class: 'llprompt' }, 'Which letter?'),
        choiceGrid(opts.map((item) => ({ letter: item, yes: item.id === L.id, label: glyph(item.id, round.showUpper) })), (it, btn) => pick(it.yes, btn)));
      round.replay();
    });
  }

  IR.letters = { GROUPS: GROUPS, LETTERS: LETTERS };
  IR.lettersRoute = function (hash, app) {
    const home = /^#\/letters\/?$/.exec(hash);
    if (home) { listPage(app); return true; }
    const group = /^#\/letters\/(g[1-7])\/?$/.exec(hash);
    if (group) {
      const g = groupById(group[1]);
      if (!g) return false;
      groupPage(app, g);
      return true;
    }
    const play = /^#\/letters\/(g[1-7])\/(find|match|sound|feed|review)$/.exec(hash);
    if (play) {
      const g = groupById(play[1]);
      const game = gamesFor(g || { n: 0 }).filter((item) => item.id === play[2])[0];
      if (!g || !game) return false;
      stepScreen(app, g, game);
      return true;
    }
    return false;
  };
})();
