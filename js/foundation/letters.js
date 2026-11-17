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
  /* Same steps in every group, in this order. */
  const LESSON = [
    { id: 'flash', title: 'Review flash' },
    { id: 'ears', title: 'Sound play' },
    { id: 'meet', title: 'Review the letters' },
    { id: 'say', title: 'Say it from the letter', day: 2 },
    { id: 'trace', title: 'Trace' },
    { id: 'games', title: 'Games' },
    { id: 'spell', title: 'Spell it' },
    { id: 'read', title: 'Read it!' },
    { id: 'check', title: 'Mastery check', day: 3 },
    { id: 'celebrate', title: 'Look what I can read!' }
  ];
  const MEMORY = {
    a: { chant: 'Ant on an apple, /a/ /a/ /a/.', action: 'Open wide, like a bite.' },
    m: { chant: 'Twin mountains hum, /m/ /m/ /m/.', action: 'Lips together. Hum.' },
    s: { chant: 'Sea snake in the sand, /s/ /s/ /s/.', action: 'Slide your hand like the snake.' },
    t: { chant: 'Palm tree tap, /t/ /t/ /t/.', action: 'Tap two fingers.' },
    p: { chant: 'Puff like a pig, /p/ /p/ /p/.', action: 'Puff your lips.' },
    f: { chant: 'Fan the fish, /f/ /f/ /f/.', action: 'Bite your lip and blow.' },
    i: { chant: 'Little insect, /i/ /i/ /i/.', action: 'Smile a little and say /i/.' },
    n: { chant: 'Nod at the nest, /n/ /n/ /n/.', action: 'Nod your head.' },
    o: { chant: 'Round as an ox, /o/ /o/ /o/.', action: 'Make a round mouth.' },
    d: { chant: 'Dog digs down, /d/ /d/ /d/.', action: 'Tap your tongue.' },
    c: { chant: 'Cat curls up, /k/ /k/ /k/.', action: 'Open for /k/.' },
    u: { chant: 'Hands up, /u/ /u/ /u/.', action: 'Lift your hands a little.' },
    g: { chant: 'Goat gulps, /g/ /g/ /g/.', action: 'Gulp once.' },
    b: { chant: 'Bounce the bus, /b/ /b/ /b/.', action: 'Press your lips, then pop.' },
    e: { chant: 'Edge of the egg, /e/ /e/ /e/.', action: 'Smile and say /e/.' },
    k: { chant: 'Kick the kite, /k/ /k/ /k/.', action: 'A small kick.' },
    h: { chant: 'Huff on the hat, /h/ /h/ /h/.', action: 'Huff on your hand.' },
    r: { chant: 'Rat runs, /r/ /r/ /r/.', action: 'Make a little engine.' },
    l: { chant: 'Lift the lamp, /l/ /l/ /l/.', action: 'Lift your tongue.' },
    w: { chant: 'Wave at the web, /w/ /w/ /w/.', action: 'Wave hello.' },
    j: { chant: 'Jump for jam, /j/ /j/ /j/.', action: 'A tiny jump.' },
    y: { chant: 'Yank the yarn, /y/ /y/ /y/.', action: 'Pull your hands apart.' },
    x: { chant: 'Cross the box, /ks/ /ks/.', action: 'Cross your arms.' },
    q: { chant: 'Quilt says /kw/ /kw/.', action: 'A circle, then a tail.' },
    v: { chant: 'Van goes /v/ /v/ /v/.', action: 'Bite your lip and hum.' },
    z: { chant: 'Zip zooms, /z/ /z/ /z/.', action: 'Zip a jacket.' }
  };
  /* The picture is the letter. s is a snake on sand. */
  function memo(inner) { return '<svg viewBox="0 0 160 200" aria-hidden="true">' + inner + '</svg>'; }
  const MNEMONIC = {
    a: memo('<circle cx="70" cy="110" r="42" fill="#E25B4A" stroke="#2B2540" stroke-width="4"/><rect x="108" y="48" width="10" height="110" rx="4" fill="#6B3A22" stroke="#2B2540" stroke-width="3"/><ellipse cx="118" cy="78" rx="10" ry="6" fill="#8C4A32" stroke="#2B2540" stroke-width="3"/><path d="M112 74 L104 62 M124 74 L132 62" stroke="#2B2540" stroke-width="2"/>'),
    m: memo('<path d="M18 160 L18 70 L50 28 L80 78 L112 28 L142 70 V160" fill="#7DAA6A" stroke="#2B2540" stroke-width="6" stroke-linejoin="round"/>'),
    s: memo('<rect width="160" height="200" fill="#F3D7A1"/><path d="M118 36 C118 16 36 18 40 52 C44 86 124 78 116 114 C108 152 34 146 42 176" fill="none" stroke="#2F8F4E" stroke-width="18" stroke-linecap="round"/><circle cx="116" cy="34" r="10" fill="#2F8F4E" stroke="#2B2540" stroke-width="3"/><circle cx="120" cy="32" r="2" fill="#fff"/>'),
    t: memo('<rect x="74" y="28" width="12" height="150" fill="#C4A574" stroke="#2B2540" stroke-width="3"/><rect x="28" y="70" width="104" height="12" fill="#E07A4A" stroke="#2B2540" stroke-width="3"/><path d="M40 82 L80 150 L120 82" fill="none" stroke="#C45A3A" stroke-width="4"/>'),
    p: memo('<rect x="36" y="24" width="12" height="160" fill="#F4A7C4" stroke="#2B2540" stroke-width="3"/><ellipse cx="86" cy="78" rx="36" ry="32" fill="#F7C2D6" stroke="#2B2540" stroke-width="4"/><circle cx="78" cy="72" r="3" fill="#2B2540"/><ellipse cx="108" cy="86" rx="8" ry="6" fill="#F4A7C4" stroke="#2B2540" stroke-width="3"/>'),
    f: memo('<path d="M120 36 C120 16 48 14 48 46 V170" fill="none" stroke="#3D7EA6" stroke-width="14" stroke-linecap="round"/><path d="M28 86 H92" stroke="#F6C445" stroke-width="12" stroke-linecap="round"/><path d="M100 40 q20 10 8 28" fill="#7EB6E0" stroke="#2B2540" stroke-width="3"/>'),
    i: memo('<rect x="74" y="70" width="12" height="100" rx="4" fill="#3D4A66" stroke="#2B2540" stroke-width="3"/><circle cx="80" cy="40" r="14" fill="#E25B4A" stroke="#2B2540" stroke-width="3"/><path d="M68 36 L60 22 M92 36 L102 22" stroke="#2B2540" stroke-width="3"/>'),
    n: memo('<path d="M28 160 V70 C28 36 132 36 132 78 V160" fill="none" stroke="#6B3A22" stroke-width="14" stroke-linecap="round"/><ellipse cx="70" cy="78" rx="16" ry="12" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/><ellipse cx="108" cy="78" rx="16" ry="12" fill="#F4F0E6" stroke="#2B2540" stroke-width="3"/>'),
    o: memo('<circle cx="80" cy="110" r="52" fill="#C4A574" stroke="#2B2540" stroke-width="6"/><path d="M40 70 C28 30 58 36 62 64 M120 70 C132 30 102 36 98 64" fill="none" stroke="#2B2540" stroke-width="6"/><circle cx="64" cy="104" r="4" fill="#2B2540"/><circle cx="98" cy="104" r="4" fill="#2B2540"/>'),
    d: memo('<rect x="112" y="24" width="12" height="150" fill="#C48A4A" stroke="#2B2540" stroke-width="3"/><ellipse cx="72" cy="118" rx="40" ry="32" fill="#E0A15A" stroke="#2B2540" stroke-width="4"/><circle cx="60" cy="110" r="3" fill="#2B2540"/><ellipse cx="40" cy="124" rx="10" ry="7" fill="#C48A4A" stroke="#2B2540" stroke-width="3"/>'),
    c: memo('<path d="M124 58 C100 28 36 36 36 100 C36 164 104 172 128 140" fill="none" stroke="#E8A15A" stroke-width="18" stroke-linecap="round"/><path d="M48 70 L36 48 L62 62" fill="#E8A15A" stroke="#2B2540" stroke-width="3"/><circle cx="70" cy="96" r="3" fill="#2B2540"/>'),
    u: memo('<path d="M36 40 V120 C36 160 124 160 124 120 V40" fill="none" stroke="#5B9BC4" stroke-width="14" stroke-linecap="round"/><path d="M124 40 V150" stroke="#2B2540" stroke-width="8" stroke-linecap="round"/><path d="M70 28 L88 8 L106 28" fill="#F28C00" stroke="#2B2540" stroke-width="3"/>'),
    g: memo('<circle cx="78" cy="78" r="36" fill="#F4F0E6" stroke="#2B2540" stroke-width="6"/><path d="M108 70 V150 C108 176 48 176 44 150" fill="none" stroke="#2B2540" stroke-width="10" stroke-linecap="round"/><path d="M58 48 L48 20 M98 48 L110 18" stroke="#2B2540" stroke-width="4"/><circle cx="66" cy="74" r="3" fill="#2B2540"/>'),
    b: memo('<rect x="32" y="20" width="12" height="156" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><circle cx="86" cy="118" r="36" fill="#F6C445" stroke="#2B2540" stroke-width="6"/><rect x="48" y="96" width="28" height="16" fill="#9FD4F2" stroke="#2B2540" stroke-width="3"/><circle cx="70" cy="168" r="8" fill="#2B2540"/>'),
    e: memo('<ellipse cx="80" cy="108" rx="40" ry="48" fill="#F4F0E6" stroke="#2B2540" stroke-width="6"/><path d="M46 108 H118" stroke="#E0A106" stroke-width="8" stroke-linecap="round"/>'),
    k: memo('<rect x="36" y="24" width="10" height="150" fill="#E25B4A" stroke="#2B2540" stroke-width="3"/><path d="M120 40 L58 100 L124 168" fill="none" stroke="#E25B4A" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 36 L130 20 L118 52" fill="#F6C445" stroke="#2B2540" stroke-width="3"/>'),
    h: memo('<rect x="28" y="20" width="12" height="156" fill="#3D7EA6" stroke="#2B2540" stroke-width="3"/><path d="M40 96 C40 60 124 60 124 100 V176" fill="none" stroke="#3D7EA6" stroke-width="12" stroke-linecap="round"/><path d="M78 58 h36 v14 H78 z" fill="#E25B4A" stroke="#2B2540" stroke-width="3"/><path d="M84 58 V40 h24 v18" fill="#5B9BC4" stroke="#2B2540" stroke-width="3"/>'),
    r: memo('<path d="M48 168 V70" stroke="#C4A8A0" stroke-width="16" stroke-linecap="round"/><path d="M48 96 C48 60 120 58 124 90" fill="none" stroke="#C4A8A0" stroke-width="14" stroke-linecap="round"/><circle cx="108" cy="78" r="8" fill="#C4A8A0" stroke="#2B2540" stroke-width="3"/><circle cx="112" cy="76" r="2" fill="#2B2540"/>'),
    l: memo('<rect x="74" y="16" width="12" height="150" rx="4" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><path d="M48 36 h52 l8 28 H40 z" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><rect x="56" y="166" width="48" height="10" fill="#2B2540"/>'),
    w: memo('<path d="M16 40 L40 168 L80 80 L120 168 L148 40" fill="none" stroke="#5B9BC4" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 90 q10 16 20 0" fill="none" stroke="#2B2540" stroke-width="2"/>'),
    j: memo('<circle cx="96" cy="36" r="12" fill="#C2406A" stroke="#2B2540" stroke-width="3"/><path d="M96 56 V140 C96 172 40 172 36 146" fill="none" stroke="#C2406A" stroke-width="14" stroke-linecap="round"/><rect x="70" y="78" width="28" height="36" rx="4" fill="#F6C445" stroke="#2B2540" stroke-width="3"/>'),
    y: memo('<path d="M28 36 L80 110" stroke="#C2408A" stroke-width="14" stroke-linecap="round"/><path d="M132 36 L70 150" stroke="#C2408A" stroke-width="14" stroke-linecap="round"/><circle cx="48" cy="70" r="10" fill="#C2408A" stroke="#2B2540" stroke-width="3"/>'),
    x: memo('<path d="M28 40 L132 168" stroke="#C4A574" stroke-width="14" stroke-linecap="round"/><path d="M132 40 L28 168" stroke="#C4A574" stroke-width="14" stroke-linecap="round"/><rect x="58" y="86" width="44" height="28" fill="#E7C48A" stroke="#2B2540" stroke-width="3"/>'),
    q: memo('<circle cx="74" cy="86" r="40" fill="#7EB6E0" stroke="#2B2540" stroke-width="6"/><path d="M108 86 V160 L136 140" fill="none" stroke="#2B2540" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M54 70 h40 M54 86 h40 M54 102 h40 M70 58 v56" stroke="#F4F0E6" stroke-width="3"/>'),
    v: memo('<path d="M24 40 L80 170 L136 40" fill="none" stroke="#5B9BC4" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><rect x="58" y="78" width="44" height="22" fill="#F6C445" stroke="#2B2540" stroke-width="3"/><circle cx="68" cy="112" r="6" fill="#2B2540"/><circle cx="96" cy="112" r="6" fill="#2B2540"/>'),
    z: memo('<path d="M28 40 H132 L28 160 H132" fill="none" stroke="#F28C00" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><rect x="70" y="70" width="18" height="60" rx="3" fill="#C4A574" stroke="#2B2540" stroke-width="3"/>')
  };
  /* Placeholder island characters. Final art is still needed for every letter. */
  const WHO = {
    a: 'Island ant', m: 'Twin mountains', s: 'Sea snake', t: 'Palm tree',
    p: 'Puffer fish', f: 'Fan coral', i: 'Island sun', n: 'Fishing net',
    o: 'Round ox', d: 'Island dog', c: 'Crab claw', u: 'Sea urchin',
    g: 'Hill goat', b: 'Beach bus', e: 'Reef eel', k: 'Reef kite',
    h: 'Hill house', r: 'Manta ray', l: 'Lighthouse', w: 'Shore waves',
    j: 'Jellyfish', y: 'Young palm', x: 'Crossed oars', q: 'Queen conch',
    v: 'Island valley', z: 'Zigzag lizard'
  };
  const ART_NEEDED = Object.keys(WHO);
  const FACE_AT = {
    a: [62, 100], m: [46, 58], t: [70, 78], p: [78, 70], f: [62, 78],
    i: [70, 100], n: [62, 110], o: [70, 108], d: [62, 112], c: [70, 96],
    u: [62, 90], g: [66, 74], b: [78, 112], e: [68, 100], k: [52, 90],
    h: [70, 110], r: [62, 120], l: [70, 90], w: [68, 70], j: [86, 40],
    y: [62, 70], x: [68, 96], q: [64, 82], v: [68, 86], z: [68, 96]
  };
  function eyes(x, y) {
    return '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="#2B2540"/><circle cx="' + (x + 12) + '" cy="' + y + '" r="3.2" fill="#2B2540"/>';
  }
  Object.keys(FACE_AT).forEach((id) => {
    const at = FACE_AT[id];
    MNEMONIC[id] = MNEMONIC[id].replace('</svg>', eyes(at[0], at[1]) + '</svg>');
  });
  function character(id) { return MNEMONIC[id] || ''; }
  /* VC and CVC words only, plus quit (qu is the letter q). A line is a 2 or 3 word phrase. */
  const BANK = [
    { w: 'am', g: 1 },
    { w: 'at', g: 1, line: 'at a mat' },
    { w: 'mat', g: 1, line: 'a mat' },
    { w: 'sat', g: 1, line: 'Sam sat.' },
    { w: 'Sam', g: 1, line: 'Sam sat.' },
    { w: 'Tam', g: 1, line: 'Tam sat.' },
    { w: 'in', g: 2, line: 'Sit in.' },
    { w: 'it', g: 2 },
    { w: 'an', g: 2, line: 'an ant' },
    { w: 'pin', g: 2, line: 'a pin' },
    { w: 'fin', g: 2, line: 'a fin' },
    { w: 'tip', g: 2, line: 'a tip' },
    { w: 'sip', g: 2, line: 'Sip, Sam.' },
    { w: 'nap', g: 2, line: 'a nap' },
    { w: 'fan', g: 2, line: 'a fan' },
    { w: 'pan', g: 2, line: 'a pan' },
    { w: 'tan', g: 2, line: 'a tan' },
    { w: 'map', g: 2, line: 'a map' },
    { w: 'fit', g: 2, line: 'Fit in.' },
    { w: 'pit', g: 2, line: 'a pit' },
    { w: 'sit', g: 2, line: 'Sit, Sam.' },
    { w: 'man', g: 2, line: 'a man' },
    { w: 'pat', g: 2, line: 'Pat sat.' },
    { w: 'Tim', g: 2, line: 'Tim sat.' },
    { w: 'on', g: 3, line: 'on a mat' },
    { w: 'pot', g: 3, line: 'a pot' },
    { w: 'top', g: 3, line: 'a top' },
    { w: 'cot', g: 3, line: 'a cot' },
    { w: 'dot', g: 3, line: 'a dot' },
    { w: 'mom', g: 3, line: 'Mom sat.' },
    { w: 'Tom', g: 3, line: 'Tom sat.' },
    { w: 'cat', g: 3, line: 'a cat' },
    { w: 'cap', g: 3, line: 'a cap' },
    { w: 'can', g: 3, line: 'a can' },
    { w: 'cup', g: 3, line: 'a cup' },
    { w: 'cut', g: 3 },
    { w: 'up', g: 3, line: 'up at' },
    { w: 'mud', g: 3, line: 'mud pit' },
    { w: 'pup', g: 3, line: 'a pup' },
    { w: 'sun', g: 3, line: 'a sun' },
    { w: 'dad', g: 3, line: 'Dad sat.' },
    { w: 'did', g: 3 },
    { w: 'sad', g: 3, line: 'Sam sat.' },
    { w: 'Pam', g: 3, line: 'Pam sat.' },
    { w: 'dog', g: 4, line: 'a dog' },
    { w: 'bag', g: 4, line: 'a bag' },
    { w: 'tag', g: 4, line: 'a tag' },
    { w: 'got', g: 4 },
    { w: 'gum', g: 4, line: 'a gum' },
    { w: 'bat', g: 4, line: 'a bat' },
    { w: 'bit', g: 4 },
    { w: 'bus', g: 4, line: 'a bus' },
    { w: 'bug', g: 4, line: 'a bug' },
    { w: 'bed', g: 4, line: 'a bed' },
    { w: 'pet', g: 4, line: 'a pet' },
    { w: 'pen', g: 4, line: 'a pen' },
    { w: 'ten', g: 4 },
    { w: 'net', g: 4, line: 'a net' },
    { w: 'men', g: 4 },
    { w: 'met', g: 4 },
    { w: 'kit', g: 4, line: 'a kit' },
    { w: 'kid', g: 4, line: 'a kid' },
    { w: 'Ben', g: 4, line: 'Ben sat.' },
    { w: 'Ken', g: 4, line: 'Ken sat.' },
    { w: 'hat', g: 5, line: 'a hat' },
    { w: 'hit', g: 5 },
    { w: 'hot', g: 5, line: 'a hot pot' },
    { w: 'hen', g: 5, line: 'a hen' },
    { w: 'hut', g: 5, line: 'a hut' },
    { w: 'hid', g: 5 },
    { w: 'rat', g: 5, line: 'a rat' },
    { w: 'ran', g: 5, line: 'Sam ran.' },
    { w: 'rip', g: 5 },
    { w: 'red', g: 5, line: 'a red hat' },
    { w: 'lap', g: 5, line: 'a lap' },
    { w: 'let', g: 5 },
    { w: 'lit', g: 5 },
    { w: 'lot', g: 5 },
    { w: 'log', g: 5, line: 'a log' },
    { w: 'pal', g: 5, line: 'a pal' },
    { w: 'lid', g: 5, line: 'a lid' },
    { w: 'wet', g: 5, line: 'a wet hat' },
    { w: 'win', g: 5 },
    { w: 'web', g: 5, line: 'a web' },
    { w: 'jam', g: 6, line: 'a jam' },
    { w: 'jet', g: 6, line: 'a jet' },
    { w: 'jog', g: 6 },
    { w: 'jug', g: 6, line: 'a jug' },
    { w: 'yam', g: 6, line: 'a yam' },
    { w: 'yet', g: 6 },
    { w: 'box', g: 6, line: 'a box' },
    { w: 'fox', g: 6, line: 'a fox' },
    { w: 'six', g: 6 },
    { w: 'tax', g: 6 },
    { w: 'wax', g: 6, line: 'a wax' },
    { w: 'fix', g: 6 },
    { w: 'mix', g: 6 },
    { w: 'quit', g: 6, line: 'Sam quit.' },
    { w: 'van', g: 7, line: 'a van' },
    { w: 'vat', g: 7, line: 'a vat' },
    { w: 'vet', g: 7, line: 'a vet' },
    { w: 'zip', g: 7, line: 'Zip sat.' },
    { w: 'Zip', g: 7, line: 'Zip sat.' },
    { w: 'zap', g: 7 }
  ];
  const WORD_AUDIO = {
    mat: 'audio/u51_w_mat.mp3', pin: 'audio/u51_w_pin.mp3', fin: 'audio/w_fin.mp3', fan: 'audio/u53_w_fan.mp3',
    map: 'audio/w_map.mp3', sit: 'audio/w_sit.mp3', man: 'audio/w_man.mp3', on: 'audio/u6_w_on.mp3',
    dot: 'audio/u53_w_dot.mp3', cat: 'audio/u6_w_cat.mp3', cap: 'audio/u51_rf_cap.mp3', can: 'audio/u6_w_can.mp3',
    cup: 'audio/u51_w_cup.mp3', mud: 'audio/u51_w_mud.mp3', sun: 'audio/u53_w_sun.mp3', sad: 'audio/nk_w_sad.mp3',
    bag: 'audio/w_bag.mp3', got: 'audio/w_got.mp3', gum: 'audio/u53_w_gum.mp3', bit: 'audio/u51_w_bit.mp3',
    bus: 'audio/u6_w_bus.mp3', bug: 'audio/w_bug.mp3', bed: 'audio/u51_rf_bed.mp3', pet: 'audio/u51_rf_pet.mp3',
    pen: 'audio/u51_rf_pen.mp3', men: 'audio/w_men.mp3', kit: 'audio/w_kit.mp3', hat: 'audio/u53_w_hat.mp3',
    rip: 'audio/w_rip.mp3', red: 'audio/w_red.mp3', let: 'audio/w_let.mp3', log: 'audio/w_log.mp3',
    win: 'audio/w_win.mp3', box: 'audio/u6_w_box.mp3', fox: 'audio/u6_w_fox.mp3', zip: 'audio/u6_w_zip.mp3',
    zap: 'audio/nk_w_zap.mp3'
  };

  function groupById(id) { return GROUPS.filter((g) => g.id === id)[0] || null; }
  function lettersOf(group) { return group.letters.map((id) => BY[id]); }
  function taughtThrough(group) {
    const out = [];
    GROUPS.forEach((g) => { if (g.n <= group.n) out.push(...lettersOf(g)); });
    return out;
  }
  function earlierLetters(group) {
    const out = [];
    GROUPS.forEach((g) => { if (g.n < group.n) out.push(...lettersOf(g)); });
    return out;
  }
  function gamesFor(group) { return GAME_DEFS.filter((g) => !g.min || group.n >= g.min); }
  function lettersIn(word) {
    return String(word || '').toLowerCase().replace(/[^a-z]/g, '').split('');
  }
  function taughtSet(group) {
    const set = {};
    taughtThrough(group).forEach((L) => { set[L.id] = 1; });
    return set;
  }
  function wordOk(group, word) {
    const set = taughtSet(group);
    const chars = lettersIn(word);
    if (word.toLowerCase().indexOf('qu') === 0) {
      return chars.every((ch) => set[ch]) && chars[0] === 'q' && chars[1] === 'u';
    }
    return chars.length > 0 && chars.every((ch) => set[ch]);
  }
  function readable(group) {
    return BANK.filter((item) => item.g <= group.n && wordOk(group, item.w) && (!item.line || item.line.split(/\s+/).every((part) => wordOk(group, part.replace(/[^A-Za-z]/g, '')))));
  }
  /* Placeholder lists until /workspace/reading-program/learn_letters/program.json arrives.
     That file may be { lessons: [ { id: "g1", read: ["am", "at", "Sam", "sat"] } ] }. */
  const PLACEHOLDER_READ = {
    g1: ['am', 'at', 'Sam', 'sat'],
    g2: ['pin', 'fin', 'map', 'sit'],
    g3: ['cat', 'sun', 'cup', 'mom'],
    g4: ['dog', 'bed', 'bus', 'kit'],
    g5: ['hat', 'ran', 'red', 'web'],
    g6: ['jam', 'box', 'fox', 'quit'],
    g7: ['van', 'zip', 'Zip', 'zap']
  };
  const READ_KEY = 'ir_letters_read';
  let program = null;
  function bankItem(word) {
    return BANK.filter((item) => item.w === word)[0] || { w: word, g: 1 };
  }
  function lessonRead(group) {
    const lessons = program && program.lessons;
    let names = null;
    if (Array.isArray(lessons)) {
      const row = lessons.filter((item) => item && item.id === group.id)[0];
      if (row && row.read && row.read.length) names = row.read;
    } else if (lessons && lessons[group.id] && lessons[group.id].read && lessons[group.id].read.length) {
      names = lessons[group.id].read;
    }
    if (!names) names = PLACEHOLDER_READ[group.id] || [];
    return names.filter((word) => wordOk(group, word)).map(bankItem);
  }
  function readBank() {
    try {
      const list = JSON.parse(localStorage.getItem(READ_KEY) || '[]');
      return Array.isArray(list) ? list.filter((word) => typeof word === 'string' && word) : [];
    } catch (e) { return []; }
  }
  function rememberWord(word) {
    const list = readBank();
    if (list.some((item) => item.toLowerCase() === String(word).toLowerCase())) return list;
    list.push(word);
    try { localStorage.setItem(READ_KEY, JSON.stringify(list)); } catch (e) { /* keep the list in memory for this page */ }
    return list;
  }
  let programReady = null;
  function ensureProgram() {
    if (program && program.lessons) return Promise.resolve(program);
    if (!programReady) {
      programReady = fetch('foundation/data/program.json').then((res) => (res && res.ok ? res.json() : null)).then((data) => {
        if (data && data.lessons) program = data;
        return program;
      }).catch(() => program);
    }
    return programReady;
  }
  ensureProgram();
  const DAY_KEY = 'ir_ll_day';
  const PRINT_FONTS = ['llfont-a', 'llfont-b', 'llfont-c'];
  function dayOf(group) {
    try {
      const all = JSON.parse(sessionStorage.getItem(DAY_KEY) || '{}');
      const n = Number(all[group.id]);
      if (n >= 1 && n <= 4) return n;
    } catch (e) { /* day 1 */ }
    return 1;
  }
  function setDay(group, n) {
    let all = {};
    try { all = JSON.parse(sessionStorage.getItem(DAY_KEY) || '{}'); } catch (e) { all = {}; }
    all[group.id] = n;
    try { sessionStorage.setItem(DAY_KEY, JSON.stringify(all)); } catch (e2) { /* this page still uses n */ }
  }
  function dayFromLabel(label) {
    const m = /Day\s+(\d+)/i.exec(label || '');
    return m ? Number(m[1]) : 1;
  }
  function fadeStep(group, letterId) {
    const day = dayOf(group);
    const list = program && program.lessons;
    if (Array.isArray(list)) {
      const rows = list.filter((item) => item.group === 'G' + group.n && dayFromLabel(item.label) === day);
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].fade && rows[i].fade.letters && rows[i].fade.letters[letterId];
        const step = row && row.start_step;
        if (step === 'picture' || step === 'outline' || step === 'plain') return step;
      }
    }
    if (day <= 1) return 'picture';
    if (day === 2) return 'outline';
    return 'plain';
  }
  function artUrl(id) {
    const list = program && program.letters;
    const row = list && list.filter((item) => item.letter === id)[0];
    if (!row || !row.art) return '';
    return 'foundation/' + String(row.art).replace(/^\.?\//, '');
  }
  function letterCard(L) {
    const step = fadeStep({ id: 'g' + (L.group || 1), n: L.group || 1 }, L.id);
    return letterCardStep(L, step);
  }
  function letterCardStep(L, step, n) {
    const look = printLook(L.id, n || 0);
    const plain = h('b', { class: 'llplain' + (step === 'plain' ? ' ' + look.className : '') }, step === 'plain' ? look.text : L.id);
    const src = artUrl(L.id);
    if (step === 'plain' || !src) return h('span', { class: 'llfade plain' }, plain);
    const img = h('img', { src: src, alt: '' });
    if (step === 'outline') return h('span', { class: 'llfade outline' }, img, plain);
    return h('span', { class: 'llfade picture' }, img, plain);
  }
  function printLook(text, n) {
    const raw = String(text);
    const shown = n % 3 === 2 ? raw.charAt(0).toUpperCase() + raw.slice(1) : raw;
    return { className: PRINT_FONTS[n % PRINT_FONTS.length], text: shown };
  }
  function letterInfo(id) {
    return program && program.letters && program.letters.filter((row) => row.letter === id)[0];
  }
  function cueFor(id) {
    const info = letterInfo(id);
    if (info && info.cue) return info.cue;
    const mem = MEMORY[id];
    return mem ? mem.action : '';
  }
  function stepsFor(group) {
    const day = dayOf(group);
    return LESSON.filter((step) => {
      if (step.id === 'say') return day === 2;
      if (step.id === 'check') return day >= 3;
      return true;
    });
  }
  function hintButton(ids) {
    const pop = h('span', { class: 'llhintpop', hidden: true });
    let timer = 0;
    const b = h('button', { class: 'llhint', type: 'button' }, 'Hint');
    b.addEventListener('click', () => {
      const lines = (ids || []).map(cueFor).filter(Boolean);
      if (!lines.length) return;
      pop.innerHTML = '';
      lines.forEach((line) => pop.append(h('p', null, String(line).replace(/'/g, '').replace(/\s*\+\s*/g, '. ').replace(/\s+/g, ' ').trim())));
      pop.hidden = false;
      pop.classList.remove('fade');
      clearTimeout(timer);
      timer = setTimeout(() => pop.classList.add('fade'), 900);
      setTimeout(() => { pop.hidden = true; pop.classList.remove('fade'); }, 1700);
    });
    return h('span', { class: 'llhintwrap' }, b, pop);
  }
  function wordsFor(group) {
    const planned = lessonRead(group);
    if (planned.length) return planned;
    const all = readable(group);
    const fresh = shuffle(all.filter((item) => item.g === group.n));
    const old = shuffle(all.filter((item) => item.g < group.n));
    return shuffle(fresh.slice(0, 6).concat(old.slice(0, 2)));
  }
  function graphemes(word) {
    const out = [];
    let i = 0;
    if (word.toLowerCase().indexOf('qu') === 0) {
      out.push({ g: word.slice(0, 2), id: 'q' });
      i = 2;
    }
    for (; i < word.length; i++) out.push({ g: word[i], id: word[i].toLowerCase() });
    return out;
  }
  function sayRead(word) {
    const src = WORD_AUDIO[String(word).toLowerCase()];
    if (src) return Snd.play(src).then((ok) => (ok ? true : speak(word)));
    return speak(word);
  }
  function stepDone(group, id) {
    if (id === 'games') return gamesFor(group).every((game) => IR.isDone(doneId(group, game.id)));
    return IR.isDone(doneId(group, id));
  }
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
      const path = '<path class="llstroke" d="' + s.d + '" fill="' + (s.dot ? '#2B2540' : 'none') + '" stroke="#2B2540" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"' + (s.dot ? '' : ' marker-end="url(#llarrow)"') + '/>';
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
      const steps = stepsFor(g);
      const done = steps.filter((step) => stepDone(g, step.id)).length;
      return { g: g, done: done, total: steps.length };
    });
    const finished = items.filter((it) => it.done === it.total).length;
    const bar = h('div', { class: 'gamebar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': items.length, 'aria-valuenow': finished },
      h('i', { style: 'width:' + Math.round(finished / items.length * 100) + '%' }));
    const cards = items.map((it) => h('li', null, h('button', {
      class: 'u5card llgroup' + (it.done === it.total ? ' done' : ''),
      type: 'button',
      'aria-label': 'Team ' + it.g.n + ', ' + it.g.letters.join(', ') + '.',
      onclick: () => { Snd.stop(); location.hash = '#/foundation/letters/' + it.g.id; }
    },
      h('span', { class: 'u5ord' }, String(it.g.n)),
      h('span', { class: 'u5name' }, it.g.letters.join(', ')),
      h('span', { class: 'u5min' }, it.done + ' of ' + it.total),
      it.done === it.total ? h('span', { class: 'u5mark', 'aria-hidden': 'true' }, icon('check')) : null)));
    app.append(h('div', { class: 'screen trailscreen unitpage u5menu llpage lllist' },
      h('header', { class: 'uA-top' }, IR.ui.homeButton(),
        h('button', { class: 'back homebtn', type: 'button', onclick: () => { Snd.stop(); location.hash = '#/foundation'; } }, icon('back'), h('span', null, 'Foundation')),
        h('h1', { class: 'uA-title' }, 'Learn the Letters'), IR.ui.gearButton()),
      h('main', { class: 'u5main' },
        h('div', { class: 'llintro' },
          h('img', { src: 'img/zipA.webp', alt: '' }),
          h('img', { src: 'img/frill.webp', alt: '' }),
          h('p', null, 'Seven teams, before Unit 1. This is not a unit.'),
          h('p', null, 'Same steps every time.')),
        h('div', { class: 'u5teachrow' }, h('button', { class: 'btn teachgo', type: 'button', onclick: () => { if (IR.teach) IR.teach.toggle(true); } }, 'Teacher mode')),
        h('div', { class: 'u5prog' }, bar, h('span', { class: 'u5count' }, finished + ' of ' + items.length)),
        h('ol', { class: 'u5grid llgroups' }, ...cards))));
    if (IR.teach) IR.teach.sync();
  }

  function startLetters(group) {
    const lessons = lessonsOf(group);
    const map = doneMap();
    const next = lessons.filter((lesson) => !map[String(lesson.lesson_number)])[0] || lessons[0];
    if (!next) return;
    Snd.stop();
    location.hash = dayHash(group, next);
  }
  function daySlug(lesson) {
    return String(lesson.label || ('Day ' + lesson.lesson_number)).toLowerCase().replace(/[^a-z0-9]+/g, '');
  }
  function dayHash(group, lesson) {
    return '#/foundation/letters/' + group.id + '/day/' + daySlug(lesson);
  }
  function dayTabs(group, current) {
    const lessons = lessonsOf(group);
    const tabs = lessons.map((lesson) => {
      const slug = daySlug(lesson);
      return h('button', {
        class: 'daytab' + (slug === current ? ' on' : ''),
        type: 'button',
        'aria-pressed': slug === current ? 'true' : 'false',
        onclick: () => { Snd.stop(); location.hash = dayHash(group, lesson); }
      }, lesson.label || ('Day ' + lesson.lesson_number));
    });
    tabs.push(h('button', {
      class: 'daytab' + (current === 'check' ? ' on' : ''),
      type: 'button',
      'aria-pressed': current === 'check' ? 'true' : 'false',
      onclick: () => { Snd.stop(); location.hash = '#/foundation/letters/' + group.id + '/day/check'; }
    }, 'Team check'));
    return h('div', { class: 'daytabs', role: 'tablist' }, ...tabs);
  }
  function dayTeacher(group, lesson, isCheck) {
    const deck = SLIDES[group.id];
    const label = isCheck ? 'Team check' : (lesson && lesson.label);
    const day = deck && (deck.days || []).filter((row) => row.label === label)[0];
    const slides = deck ? '#/foundation/slides/' + group.id + (day && day.page ? '/' + day.page : '') : '';
    const files = group.id === 'g1'
      ? [{ title: 'Team 1 Quick Sounds', href: 'foundation/printables/Team1_Quick_Sounds.pdf' }]
      : group.id === 'g2'
        ? [{ title: 'Team 2 Quick Sounds', href: 'foundation/printables/Team2_Quick_Sounds.pdf' }]
        : [];
    return { slides: slides, slideLabel: (label || 'Team') + ' slideshow', files: files };
  }
  const DAY1_SHORT = { pop: 'Pop', feed: 'Feed', catch: 'Catch', hunt: 'Hunt', build: 'Build', ears: 'Ears', flash: 'Flash', match: 'Match', sound: 'Sounds', sort: 'Sort' };
  function dayFocus(lesson) {
    const letters = (lesson.new_letters || []).filter(Boolean);
    if (letters.length) return letters.join(', ');
    const words = (lesson.new_words || lesson.review_words || []).slice(0, 3);
    if (words.length) return words.join(' ');
    return 'Review';
  }
  function dayGames(group, lesson) {
    if (group.id === 'g1' && lesson && lesson.lesson_number === 1 && IR.day1Flow && IR.day1Flow.GAMES) {
      return IR.day1Flow.GAMES.map((game) => ({
        title: DAY1_SHORT[game.id] || game.title,
        label: game.title,
        img: game.icon,
        href: '#/foundation/sample/' + game.id
      }));
    }
    return [];
  }
  function dayLinks(group, lesson, isCheck) {
    const teach = dayTeacher(group, lesson, isCheck);
    const links = [];
    if (teach.slides) links.push({ title: 'Slideshow', href: teach.slides });
    (teach.files || []).forEach((file) => links.push({ title: 'Quick Sounds', href: file.href }));
    links.push({ title: 'Smart board', go: () => { if (IR.teach) IR.teach.toggle(); } });
    return links;
  }
  function groupPage(app, group, slug) {
    IR.newScreen();
    const lessons = lessonsOf(group);
    const isCheck = slug === 'check';
    const lesson = isCheck ? null : (lessons.filter((row) => daySlug(row) === slug)[0] || (!slug ? lessons[0] : null));
    if (!isCheck && !lesson) { foundationPage(app); return; }
    const current = isCheck ? 'check' : daySlug(lesson);
    const day1 = group.id === 'g1' && lesson && lesson.lesson_number === 1;
    const lessonCard = isCheck
      ? { title: 'Start', href: '#/foundation/letters/' + group.id + '/check' }
      : day1
        ? { title: 'a, m', href: '#/foundation/sample/team' }
        : { title: dayFocus(lesson), href: lessonHash(group, lesson, flowFor(lesson)[0].id) };
    const words = !isCheck && ((lesson.new_words || []).slice(0, 3).join(' '));
    const read = isCheck ? null : day1
      ? { title: 'am', img: 'foundation/img/scenes/am.jpg', alt: 'am', big: true, href: '#/foundation/sample/done' }
      : { title: words || 'Read', big: true, href: lessonHash(group, lesson, 'read') };
    app.append(h('div', { class: 'screen trailscreen unitpage llpage fs-group stepage' },
      h('header', { class: 'uA-top' },
        IR.ui.homeButton(),
        h('button', { class: 'back homebtn unitback', type: 'button', onclick: () => { Snd.stop(); location.hash = '#/foundation'; } }, icon('back'), h('span', null, 'Foundations')),
        h('h1', { class: 'uA-title' }, 'Team ' + group.n),
        IR.teacherBox({ label: 'Teacher', links: dayLinks(group, lesson, isCheck) }),
        IR.ui.gearButton()),
      dayTabs(group, current),
      IR.modeBar({
        note: false,
        lessonLabel: isCheck ? 'Check' : 'Lesson',
        lesson: [lessonCard],
        hideGames: isCheck,
        games: isCheck ? [] : dayGames(group, lesson),
        gamesSoon: 'Games coming soon',
        story: read,
        storyLabel: 'Read It'
      })));
    if (IR.teach) IR.teach.sync();
  }

  function gamesPage(app, group) {
    IR.newScreen();
    const games = gamesFor(group);
    const cards = games.map((game) => {
      const done = IR.isDone(doneId(group, game.id));
      return h('li', null, h('button', {
        class: 'u5card llplay' + (done ? ' done' : ''),
        type: 'button',
        'aria-label': game.title + (done ? '. Done.' : '.'),
        onclick: () => { Snd.stop(); location.hash = '#/foundation/letters/' + group.id + '/' + game.id; }
      }, h('span', { class: 'u5name' }, game.title), done ? h('span', { class: 'u5mark', 'aria-hidden': 'true' }, icon('check')) : null));
    });
    app.append(h('div', { class: 'screen trailscreen unitpage u5menu llpage' },
      h('header', { class: 'uA-top' },
        h('button', { class: 'back homebtn', type: 'button', onclick: () => { Snd.stop(); location.hash = '#/foundation/letters/' + group.id; } }, icon('back'), h('span', null, 'Team')),
        h('h1', { class: 'uA-title' }, 'Games'),
        IR.ui.gearButton()),
      h('main', { class: 'llmain' }, h('ol', { class: 'llsteps llgames' }, ...cards))));
    if (IR.teach) IR.teach.sync();
  }

  function stepScreen(app, group, game) {
    const scr = IR.newScreen();
    let mistakes = 0;
    const fill = h('i');
    const bar = h('div', { class: 'pbar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, fill);
    const instrBox = h('div', { class: 'instr' });
    const stage = h('div', { class: 'stage' });
    const base = '#/foundation/letters/' + group.id;
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
    const navApi = IR.simpleNav(nav, nextBtn, () => { Snd.stop(); location.hash = base; }, 'Back to the group');
    ctx.setNextLabel = (t) => navApi.label(t);
    ctx.quietDone = () => {
      IR.recordActivity(doneId(group, game.id), mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1);
      IR.touchStreak();
      IR.save();
      location.hash = base;
    };
    ctx.finishRead = () => {
      IR.recordActivity(doneId(group, 'read'), mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1);
      IR.touchStreak();
      IR.save();
      location.hash = base + '/celebrate';
    };
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
    else if (game.id === 'flash') runFlash(ctx, group);
    else if (game.id === 'ears') runEars(ctx, group);
    else if (game.id === 'meet') runMeet(ctx, group);
    else if (game.id === 'say') runSay(ctx, group);
    else if (game.id === 'trace') runTrace(ctx, group);
    else if (game.id === 'check') runCheck(ctx, group);
    else if (game.id === 'read') runRead(ctx, group);
    else if (game.id === 'spell') runSpell(ctx, group);
    else runReview(ctx, taughtThrough(group));
  }

  function runFlash(ctx, group) {
    const prior = shuffle(earlierLetters(group));
    if (!prior.length) {
      ctx.setInstr('This is the first group. No earlier letters yet.');
      ctx.stage.append(h('div', { class: 'activity llgame llflash' },
        h('img', { src: 'img/zipA.webp', alt: '' }),
        h('img', { src: 'img/frill.webp', alt: '' }),
        h('p', { class: 'llprompt' }, 'Today you meet ' + group.letters.join(', ') + '.')));
      ctx.setNextLabel('Done');
      ctx.setNext(() => { ctx.quietDone(); return true; });
      return;
    }
    ctx.setInstr('Say the sound. Then tap the letter.');
    let i = 0;
    function show() {
      if (i >= prior.length) { ctx.quietDone(); return; }
      const L = prior[i];
      ctx.progress(i / prior.length);
      if (ctx.count) ctx.count(i + 1, prior.length);
      ctx.stage.innerHTML = '';
      const b = h('button', {
        class: 'llflashcard',
        type: 'button',
        'aria-label': 'Say the sound for ' + L.id + '. Tap to hear it.',
        onclick: async () => {
          b.disabled = true;
          await hear(L, 'sound');
          await Snd.play(A.sfx.ding);
          i++;
          if (ctx.scr.ok()) show();
        }
      }, letterCardStep(L, fadeStep(group, L.id)));
      ctx.stage.append(h('div', { class: 'activity llgame llflash' }, h('p', { class: 'llask' }, 'Say the sound.'), b));
      if (ctx.armReveal) ctx.armReveal(L.sound);
    }
    ctx.setNext(() => { if (i < prior.length) { i++; show(); return true; } return false; });
    show();
  }

  function runMeet(ctx, group) {
    const letters = lettersOf(group);
    let i = 0;
    ctx.setInstr('Look, chant, and do the action.');
    function show() {
      const L = letters[i];
      const mem = MEMORY[L.id];
      const info = program && program.letters && program.letters.filter((row) => row.letter === L.id)[0];
      ctx.progress(i / letters.length);
      if (ctx.count) ctx.count(i + 1, letters.length);
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'activity llgame llmeet' },
        letterCardStep(L, fadeStep(group, L.id), i),
        h('div', { class: 'llmeettext' },
          h('p', { class: 'llwho' }, (info && info.character) || WHO[L.id] || ''),
          h('p', { class: 'llchant' }, (info && info.chant) || mem.chant),
          h('p', { class: 'llaction' }, 'Action: ' + ((info && info.action) || mem.action)),
          h('button', { class: 'btn primary', type: 'button', onclick: () => hear(L, 'sound') }, icon('speaker'), 'Hear the sound'))));
      ctx.setNextLabel(i < letters.length - 1 ? 'Next letter' : 'Done');
      if (ctx.armReveal) ctx.armReveal(L.id);
      hear(L, 'sound');
      if (!program && !show.retried) {
        show.retried = true;
        setTimeout(() => { if (ctx.scr.ok()) show(); }, 400);
      }
    }
    ctx.setNext(() => {
      if (i < letters.length - 1) { i++; show(); return true; }
      ctx.quietDone();
      return true;
    });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  function runTrace(ctx, group) {
    const letters = lettersOf(group);
    let i = 0;
    ctx.setInstr(dayOf(group) === 1 ? 'Draw the letter over the character. Or tap the numbers.' : 'Trace the plain letter, or tap the numbers.');
    function show() {
      const L = letters[i];
      let stroke = 0;
      let moved = 0;
      ctx.progress(i / letters.length);
      if (ctx.count) ctx.count(i + 1, letters.length);
      ctx.stage.innerHTML = '';
      const over = fadeStep(group, L.id) === 'picture' && artUrl(L.id);
      const art = h('div', { class: 'lltraceart' + (over ? ' over' : '') },
        over ? h('img', { class: 'lltracephoto', src: artUrl(L.id), alt: '' }) : null,
        h('div', { class: 'lltraceform', html: formation(L) }));
      const nums = h('div', { class: 'lltracenums' });
      function paint() {
        art.querySelectorAll('.lltraceform .llstroke').forEach((path, n) => {
          path.setAttribute('stroke', n < stroke ? '#E8731C' : '#2B2540');
          path.setAttribute('stroke-width', n === stroke ? '12' : '7');
        });
        nums.querySelectorAll('button').forEach((b, n) => b.classList.toggle('on', n === stroke));
      }
      function advance() {
        if (stroke >= L.strokes.length) return;
        stroke++;
        moved = 0;
        paint();
        if (stroke >= L.strokes.length) {
          Snd.play(A.sfx.ding);
          ctx.setNextLabel(i < letters.length - 1 ? 'Next letter' : 'Done');
        }
      }
      L.strokes.forEach((s, n) => {
        const b = h('button', {
          class: 'lltracenum' + (n === 0 ? ' on' : ''),
          type: 'button',
          'aria-label': 'Stroke ' + (n + 1),
          onclick: () => { if (n === stroke) advance(); }
        }, String(n + 1));
        nums.append(b);
      });
      art.addEventListener('pointerdown', () => { moved = 0; });
      art.addEventListener('pointermove', (e) => {
        if (e.buttons || e.pressure > 0) moved += Math.abs(e.movementX) + Math.abs(e.movementY);
        if (moved > 36) advance();
      });
      ctx.stage.append(h('div', { class: 'activity llgame lltrace' }, art, nums));
      ctx.setNextLabel('');
      paint();
      if (ctx.armReveal) ctx.armReveal(L.id);
    }
    ctx.setNext(() => {
      if (i < letters.length - 1) { i++; show(); return true; }
      ctx.quietDone();
      return true;
    });
    show();
  }

  function runSay(ctx, group) {
    const letters = lettersOf(group);
    let i = 0;
    ctx.setInstr('Say it from the letter. No picture.');
    function show() {
      const L = letters[i];
      const look = printLook(L.id, i + 1);
      ctx.progress(i / letters.length);
      if (ctx.count) ctx.count(i + 1, letters.length);
      ctx.stage.innerHTML = '';
      ctx.stage.append(h('div', { class: 'activity llgame llsay' },
        h('p', { class: 'llsayprompt' }, 'Say it from the letter.'),
        h('b', { class: 'llplain ' + look.className }, look.text),
        h('button', { class: 'btn primary', type: 'button', onclick: () => hear(L, 'sound') }, icon('speaker'), 'Hear the sound')));
      ctx.setNextLabel(i < letters.length - 1 ? 'Next letter' : 'Done');
      if (ctx.armReveal) ctx.armReveal(L.id);
    }
    ctx.setNext(() => {
      if (i < letters.length - 1) { i++; show(); return true; }
      ctx.quietDone();
      return true;
    });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  function runCheck(ctx, group) {
    if (ctx.setGameTitle) ctx.setGameTitle('Mastery check');
    runFind(ctx, lettersOf(group), 'Mastery check. Plain letters only.');
  }

  function runRead(ctx, group) {
    const items = wordsFor(group);
    let i = 0;
    let token = 0;
    ctx.setInstr('Tap each letter. They step in, hold hands, and say the word.');
    function show() {
      const my = ++token;
      if (i >= items.length) { ctx.finishRead(); return; }
      const item = items[i];
      const parts = graphemes(item.w);
      let at = 0;
      ctx.progress(i / items.length);
      if (ctx.count) ctx.count(i + 1, items.length);
      ctx.stage.innerHTML = '';
      const cast = h('div', { class: 'llcast' });
      const hands = h('i', { class: 'llhands' });
      const line = h('p', { class: 'llline' }, '');
      const spread = 90;
      parts.forEach((part, n) => {
        const from = Math.round((n - (parts.length - 1) / 2) * spread);
        const b = h('button', {
          class: 'llbuddy',
          type: 'button',
          style: '--from:' + from,
          'data-g': part.g,
          'aria-label': 'Sound ' + (n + 1) + ', ' + part.g
        }, h('b', { class: 'llprint ' + printLook(part.g, n + i).className }, printLook(part.g, n + i).text));
        b.addEventListener('click', async () => {
          if (my !== token || b.classList.contains('lit')) return;
          if (n !== at) {
            ctx.miss();
            b.classList.add('tried');
            await Snd.play(A.sfx.tryagain);
            b.classList.remove('tried');
            return;
          }
          b.classList.add('lit');
          at++;
          await hear(BY[part.id], 'sound');
          if (at < parts.length || my !== token || !ctx.scr.ok()) return;
          cast.classList.add('held');
          hands.classList.add('go');
          await Snd.play(A.sfx.ding);
          rememberWord(item.w);
          if (ctx.scr.ok() && my === token) await sayRead(item.w);
          line.textContent = item.line || item.w;
          ctx.setNextLabel(i < items.length - 1 ? 'Next word' : 'Look what I can read!');
        });
        cast.append(b);
      });
      ctx.stage.append(h('div', { class: 'activity llgame llread' }, cast, hands, line, hintButton(parts.map((part) => part.id))));
      ctx.setNextLabel('');
      if (ctx.armReveal) ctx.armReveal(item.w, (stage) => [...stage.querySelectorAll('.llbuddy')]);
    }
    ctx.setNext(() => {
      if (i < items.length - 1) { i++; show(); return true; }
      ctx.finishRead();
      return true;
    });
    show();
  }

  function celebrateScreen(app, group) {
    IR.newScreen();
    IR.recordActivity(doneId(group, 'celebrate'), 3);
    IR.touchStreak();
    IR.save();
    const words = readBank();
    const fresh = {};
    lessonRead(group).forEach((item) => { fresh[item.w.toLowerCase()] = 1; });
    const screen = h('div', { class: 'screen lessonscreen nkstep u5step llstep' },
      h('header', { class: 'lesson-top' }, IR.ui.homeButton(), IR.ui.gearButton()),
      h('div', { class: 'stage' }, h('div', { class: 'activity llgame llcelebrate' },
        IR.engage.faces(),
        h('div', { class: 'badgeart', html: IR.ICON.badge }),
        h('h1', null, 'Look what I can read!'),
        h('p', { class: 'llprompt' }, words.length ? words.length + (words.length === 1 ? ' word' : ' words') : 'Read a word and it stays here.'),
        h('div', { class: 'llreadwords' }, ...words.map((word) => h('span', { class: fresh[word.toLowerCase()] ? 'fresh' : '' }, word))))));
    const nav = h('div', { class: 'lesson-nav' });
    screen.append(nav);
    IR.simpleNav(nav, h('button', { class: 'btn big next', type: 'button' }), () => { location.hash = '#/foundation/letters/' + group.id; }, 'Back to the group');
    app.append(screen);
    if (IR.teach) IR.teach.sync();
    Snd.play(A.sfx.done);
  }

  function soundBit(L) {
    return String(L.soundSay || L.id).split(',')[0];
  }
  async function sayBits(parts) {
    for (let n = 0; n < parts.length; n++) {
      await speak(soundBit(BY[parts[n].id]));
      await sleep(260);
    }
  }

  function runEars(ctx, group) {
    const pool = taughtThrough(group);
    const words = readable(group);
    const kinds = ['first', 'blend', 'segment'];
    const rounds = [];
    for (let n = 0; n < 6; n++) rounds.push({ kind: kinds[n % 3], item: words[n % words.length] });
    shuffle(rounds);
    let i = 0;
    let token = 0;
    function show() {
      const my = ++token;
      if (i >= rounds.length) { ctx.quietDone(); return; }
      const round = rounds[i];
      const item = round.item;
      const parts = graphemes(item.w);
      ctx.progress(i / rounds.length);
      if (ctx.count) ctx.count(i + 1, rounds.length);
      ctx.stage.innerHTML = '';
      const host = h('div', { class: 'activity llgame llear' });
      ctx.stage.append(host);
      if (round.kind === 'first') {
        ctx.setInstr('Listen to the word. Tap the first sound.');
        const first = BY[parts[0].id];
        const opts = options(first, pool, Math.min(3, pool.length)).map((L) => ({
          letter: L, yes: L.id === first.id, label: glyph(L.id, false)
        }));
        host.append(h('p', { class: 'llprompt llprint ' + printLook(item.w, i).className }, printLook(item.w, i).text), choiceGrid(opts, async (it, btn) => {
          if (my !== token || btn.classList.contains('lit')) return;
          if (!it.yes) {
            ctx.miss();
            btn.classList.add('tried');
            await Snd.play(A.sfx.tryagain);
            return;
          }
          btn.classList.add('lit');
          await Snd.play(A.sfx.ding);
          i++;
          if (ctx.scr.ok() && my === token) show();
        }));
        sayRead(item.w);
        if (ctx.armReveal) ctx.armReveal(first.id);
        return;
      }
      if (round.kind === 'blend') {
        ctx.setInstr('Listen to the sounds. Tap the word.');
        const other = words.filter((row) => row.w !== item.w)[0] || item;
        const picks = shuffle([item, other]);
        const row = h('div', { class: 'llblendpick' });
        picks.forEach((pick) => {
          const yes = pick.w === item.w;
          const b = h('button', {
            class: 'llwordpick',
            type: 'button',
            'data-yes': yes ? '1' : '0',
            'aria-label': pick.w
          }, h('b', { class: 'llprint ' + printLook(pick.w, picks.indexOf(pick)).className }, printLook(pick.w, picks.indexOf(pick)).text));
          b.addEventListener('click', async () => {
            if (my !== token) return;
            if (!yes) {
              ctx.miss();
              b.classList.add('tried');
              await Snd.play(A.sfx.tryagain);
              return;
            }
            b.classList.add('lit');
            await Snd.play(A.sfx.ding);
            i++;
            if (ctx.scr.ok() && my === token) show();
          });
          row.append(b);
        });
        host.append(row, hintButton(parts.map((part) => part.id)));
        sayBits(parts);
        if (ctx.armReveal) ctx.armReveal(item.w, (stage) => [...stage.querySelectorAll('.llwordpick')].filter((el) => el.dataset.yes === '1'));
        return;
      }
      ctx.setInstr('Listen. Then tap each sound.');
      let at = 0;
      const cast = h('div', { class: 'llcast' });
      parts.forEach((part, n) => {
        const look = printLook(part.g, n);
        const b = h('button', { class: 'llbuddy', type: 'button', 'aria-label': part.g },
          h('b', { class: 'llprint ' + look.className }, look.text));
        b.addEventListener('click', async () => {
          if (my !== token || b.classList.contains('lit')) return;
          if (n !== at) {
            ctx.miss();
            await Snd.play(A.sfx.tryagain);
            return;
          }
          b.classList.add('lit');
          at++;
          await speak(soundBit(BY[part.id]));
          if (at < parts.length || my !== token) return;
          await Snd.play(A.sfx.ding);
          i++;
          if (ctx.scr.ok() && my === token) show();
        });
        cast.append(b);
      });
      host.append(cast, hintButton(parts.map((part) => part.id)));
      sayRead(item.w);
      if (ctx.armReveal) ctx.armReveal(item.w);
    }
    ctx.setNext(() => { if (i < rounds.length - 1) { i++; show(); return true; } return false; });
    show();
  }

  function runSpell(ctx, group) {
    const items = wordsFor(group).slice(0, 5);
    const bank = taughtThrough(group);
    let i = 0;
    let token = 0;
    ctx.setInstr('Listen. Tap the letters to build the word.');
    function show() {
      const my = ++token;
      if (i >= items.length) { ctx.quietDone(); return; }
      const item = items[i];
      const parts = graphemes(item.w);
      let at = 0;
      ctx.progress(i / items.length);
      if (ctx.count) ctx.count(i + 1, items.length);
      ctx.stage.innerHTML = '';
      const slots = parts.map(() => h('span', { class: 'llslot' }));
      const used = {};
      parts.forEach((part) => { used[part.id] = (used[part.id] || 0) + 1; });
      const bag = [];
      parts.forEach((part) => bag.push(part));
      shuffle(bank.filter((L) => !used[L.id])).slice(0, 2).forEach((L) => bag.push({ g: L.id, id: L.id }));
      const tray = h('div', { class: 'llbank' });
      shuffle(bag).forEach((part) => {
        const look = printLook(part.g, bag.indexOf(part));
        const b = h('button', { class: 'llbuddy', type: 'button', 'data-l': part.id, 'aria-label': part.g },
          h('b', { class: 'llprint ' + look.className }, look.text));
        b.addEventListener('click', async () => {
          if (my !== token || b.classList.contains('used') || at >= parts.length) return;
          if (part.id !== parts[at].id) {
            ctx.miss();
            b.classList.add('tried');
            await Snd.play(A.sfx.tryagain);
            b.classList.remove('tried');
            return;
          }
          b.classList.add('used');
          slots[at].classList.add('filled');
          slots[at].append(h('b', { class: 'llprint ' + printLook(parts[at].g, at).className }, parts[at].g));
          at++;
          await hear(BY[part.id], 'sound');
          if (at < parts.length || my !== token || !ctx.scr.ok()) return;
          await Snd.play(A.sfx.ding);
          if (ctx.scr.ok() && my === token) await sayRead(item.w);
          ctx.setNextLabel(i < items.length - 1 ? 'Next word' : 'Done');
        });
        tray.append(b);
      });
      ctx.stage.append(h('div', { class: 'activity llgame llspell' },
        h('div', { class: 'llslots' }, ...slots),
        tray,
        hintButton(parts.map((part) => part.id))));
      ctx.setNextLabel('');
      sayRead(item.w);
      if (ctx.armReveal) ctx.armReveal(item.w, (stage) => {
        const want = parts[Math.min(at, parts.length - 1)].id;
        return [...stage.querySelectorAll('.llbank .llbuddy')].filter((el) => el.dataset.l === want && !el.classList.contains('used'));
      });
    }
    ctx.setNext(() => {
      if (i < items.length - 1) { i++; show(); return true; }
      ctx.quietDone();
      return true;
    });
    show();
  }

  function choiceGrid(items, onPick) {
    return h('div', { class: 'llchoices' + (items.length < 3 ? ' few' : '') }, ...items.map((it) => {
      const b = h('button', {
        class: 'llchoice',
        type: 'button',
        'data-l': it.letter.id,
        'data-yes': it.yes ? '1' : '0',
        'aria-label': it.label
      }, h('b', { class: 'llprint ' + printLook(it.label, items.indexOf(it)).className }, printLook(it.label, items.indexOf(it)).text));
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
      if (round.letter) host.append(hintButton([round.letter.id]));
      host.append(status);
    }
    ctx.setNext(() => { if (i < rounds.length - 1) { i++; show(); return true; } return false; });
    ctx.setBack(() => { if (i > 0) { i--; show(); return true; } return false; });
    show();
  }

  function runFind(ctx, pool, instr) {
    ctx.setInstr(instr || 'Hear the sound. Tap that letter.');
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
      say: (id) => hear(BY[id], 'sound'),
      colorWord: (id) => {
        const el = document.createElement('span');
        const look = printLook(id, id.charCodeAt(0));
        el.className = 'llprint ' + look.className;
        el.textContent = look.text;
        return el;
      }
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

  function aboutOrder() {
    return IR.sideDrop({
      group: 'foundation',
      label: 'Why this order?',
      tabClass: 'btn big fs-sidebtn',
      fill(body) {
        [
          'This is a letter review. It firms up each letter name and its sound before reading.',
          'We review lowercase letters and their sounds first. Capitals come lightly, a little later.',
          'The first set is a m s t. Those letters make real words right away: am, at, Sam, and sat.',
          'Letters that look alike, like b and d and p, are spread apart so they are easier to tell apart.',
          'Sounds children use every day come early. Rare letters, q and x and z, come last.',
          'The order follows a research-based science of reading sequence.'
        ].forEach((line) => body.append(h('p', { class: 'drop-note' }, line)));
      }
    });
  }
  function planFor(lesson) {
    if (!window.IRLetterScope || !program || !program.lessons) return null;
    return IRLetterScope.lessonPlan(program, lesson);
  }
  function flowFor(lesson) {
    const plan = planFor(lesson);
    if (!plan) {
      if (lesson.new_letters && lesson.new_letters.length) {
        return [{ id: 'ido', title: 'I do' }, { id: 'wedo', title: 'We do' }].concat(FLOW);
      }
      return FLOW;
    }
    const steps = [];
    plan.phases.forEach((phase) => {
      steps.push({ id: 'ido-' + phase.letter, title: 'I do ' + phase.letter, phase: phase, kind: 'ido' });
      steps.push({ id: 'wedo-' + phase.letter, title: 'We do ' + phase.letter, phase: phase, kind: 'wedo' });
      steps.push({ id: 'check-' + phase.letter, title: 'Name and sound', phase: phase, kind: 'checkname' });
      steps.push({ id: 'use-' + phase.letter, title: 'Practice ' + phase.letter, phase: phase, kind: 'use' });
    });
    const close = plan.close;
    FLOW.forEach((step) => steps.push({ id: step.id, title: step.title, phase: close, kind: step.id }));
    return steps;
  }
  function grownTip(lesson) {
    const tips = [];
    if (program && program.correction_words) tips.push(program.correction_words);
    if (program && program.word_error_script) tips.push(program.word_error_script);
    (lesson.new_letters || []).forEach((id) => {
      const row = letterInfo(id);
      if (row && row.cue) tips.push(id + ': ' + String(row.cue).replace(/'/g, '').replace(/\s*\+\s*/g, '. '));
      if (row && row.formation) tips.push('Trace ' + id + '. ' + row.formation);
    });
    const show = IR.teach && IR.teach.on && IR.teach.on();
    return h('details', { class: 'fs-tip', open: show || null },
      h('summary', null, 'If your child needs a hand'),
      ...tips.map((tip) => h('p', null, tip)));
  }
  function modelBlend(word) {
    const parts = graphemes(String(word));
    parts.forEach((part, n) => {
      const letter = BY[part.id];
      if (letter) setTimeout(() => hear(letter, 'sound'), n * 420);
    });
    setTimeout(() => speak(word), parts.length * 420 + 180);
  }
  const FLOW = [
    { id: 'warm', title: 'Warm-up' },
    { id: 'review', title: 'Review' },
    { id: 'meet', title: 'Review the letters' },
    { id: 'read', title: 'Blend and read' },
    { id: 'write', title: 'Write' },
    { id: 'bank', title: 'Look what I can read!' }
  ];

  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function doneMap() { return readStore('ir_ll_done'); }
  function checkMap() { return readStore('ir_ll_check'); }
  function markDone(n) {
    const map = doneMap();
    map[String(n)] = 1;
    writeStore('ir_ll_done', map);
  }
  function markCheck(group) {
    const map = checkMap();
    map[programId(group)] = 1;
    writeStore('ir_ll_check', map);
  }
  function programId(group) {
    const rows = (program && program.groups) || [];
    const row = rows.filter((g) => String(g.id).toLowerCase() === group.id)[0];
    return row ? row.id : String(group.id || '').toUpperCase();
  }
  function lessonsOf(group) {
    const id = String(programId(group)).toUpperCase();
    return ((program && program.lessons) || []).filter((lesson) => String(lesson.group).toUpperCase() === id);
  }
  function lookStep(lesson, id) {
    const row = lesson && lesson.fade && lesson.fade.letters && lesson.fade.letters[id];
    if (row && (row.start_step === 'picture' || row.start_step === 'outline' || row.start_step === 'plain')) return row.start_step;
    return 'plain';
  }
  function groupOpen(group) {
    const list = (program && program.groups) || [];
    const i = list.findIndex((g) => String(g.id).toLowerCase() === group.id);
    if (i <= 0) return true;
    if (IR.teach && IR.teach.on && IR.teach.on()) return true;
    return !!checkMap()[list[i - 1].id];
  }
  function lessonLine(lesson) {
    if (lesson.win) return lesson.win;
    const letters = (lesson.new_letters || []).join(' ');
    const words = (lesson.new_words && lesson.new_words.length ? lesson.new_words : (lesson.review_words || [])).slice(0, 4).join(', ');
    if (letters && words) return 'Meet ' + letters + '. Read ' + words + '.';
    if (words) return 'Read ' + words + '.';
    if (letters) return 'Meet ' + letters + '.';
    return 'Practice the letters you know.';
  }
  function lessonHash(group, lesson, step) {
    return '#/foundation/letters/' + group.id + '/l/' + lesson.lesson_number + '/' + step;
  }
  function nextStop() {
    for (let i = 0; i < GROUPS.length; i++) {
      const group = GROUPS[i];
      if (!groupOpen(group)) continue;
      const lessons = lessonsOf(group);
      const map = doneMap();
      for (let n = 0; n < lessons.length; n++) {
        if (!map[String(lessons[n].lesson_number)]) return { group: group, lesson: lessons[n] };
      }
      if (lessons.some((lesson) => lesson.mastery_check) && !checkMap()[programId(group)]) {
        return { group: group, check: true };
      }
    }
    const first = lessonsOf(GROUPS[0])[0];
    return { group: GROUPS[0], lesson: first };
  }
  function letterContinue() {
    const stop = nextStop();
    const team = 'Team ' + ((stop && stop.group && stop.group.n) || 1);
    let href = '#/foundation/letters/g1';
    if (stop && stop.check) href = '#/foundation/letters/' + stop.group.id + '/check';
    else if (stop && stop.lesson) href = lessonHash(stop.group, stop.lesson, flowFor(stop.lesson)[0].id);
    return h('button', {
      class: 'zfstart2',
      type: 'button',
      'aria-label': 'Continue. ' + team + '. Pick up where you left off',
      onclick: () => { Snd.stop(); location.hash = href; }
    }, h('span', { class: 'zfst' }, h('b', null, 'Continue'), h('small', null, team + '. Pick up where you left off')));
  }
  function nextUpGroup() {
    for (let i = 0; i < GROUPS.length; i++) {
      const group = GROUPS[i];
      if (!groupOpen(group)) continue;
      const lessons = lessonsOf(group);
      const done = lessons.filter((lesson) => doneMap()[String(lesson.lesson_number)]).length;
      const checked = !lessons.some((lesson) => lesson.mastery_check) || !!checkMap()[programId(group)];
      if (done < lessons.length || !checked) return group;
    }
    return null;
  }
  function faceRow(group) {
    return h('span', { class: 'fs-faces' }, ...group.letters.map((id) => {
      const src = artUrl(id);
      if (src) return h('img', { class: 'fs-face', src: src, alt: '' });
      return h('span', { class: 'fs-face', html: character(id) });
    }));
  }
  function sampleWords(group) {
    const seen = [];
    lessonsOf(group).forEach((lesson) => {
      (lesson.new_words || []).forEach((word) => {
        const clean = String(word).replace(/[^A-Za-z]/g, '');
        if (clean.length < 2) return;
        if (seen.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
        seen.push(word);
      });
    });
    return seen.slice(0, 4).join(', ');
  }
  function foundationPage(app) {
    IR.resetSideGroup('foundation');
    IR.newScreen();
    const up = nextUpGroup();
    const cards = GROUPS.map((group) => {
      const open = groupOpen(group);
      const isNext = up && up.id === group.id;
      const faces = group.letters.map((id) => {
        const src = artUrl(id);
        return src ? h('img', { src: src, alt: id }) : null;
      });
      const taught = sampleWords(group);
      return h('button', {
        class: 'tcard fs-groupcard' + (isNext ? ' t-current' : '') + (open ? '' : ' locked'),
        type: 'button',
        'aria-disabled': open ? 'false' : 'true',
        'aria-label': 'Team ' + group.n + ': ' + group.letters.join(', ') + (taught ? '. Words: ' + taught : '') + '. Opens the lessons.',
        onclick: () => { if (open) { Snd.stop(); location.hash = '#/foundation/letters/' + group.id; } }
      },
        h('span', { class: 'tpic fs-setpic', style: 'grid-template-columns:repeat(' + (group.letters.length > 2 ? 2 : group.letters.length) + ',minmax(0,1fr))' }, ...faces,
          isNext ? h('span', { class: 'herechip' }, 'Next up') : null),
        open ? null : h('span', { class: 'lockbadge' }, icon('lock'), h('span', null, 'Locked')),
        h('span', { class: 'tbody' },
          h('span', { class: 'thead' }, h('b', { class: 'tnum' }, 'Team ' + group.n)),
          h('span', { class: 'tname' }, group.letters.join(', ')),
          h('span', { class: 'tsnd' }, taught ? ('Words: ' + taught) : (open ? '' : 'After the last check'))));
    });
    const sideBtn = (label, go) => h('button', { class: 'btn big fs-sidebtn', type: 'button', onclick: go }, label);
    const banner = h('header', { class: 'hbanner' },
      h('h1', null, h('a', { class: 'fs-titlelink', href: '#/home' }, 'Foundation Skills')),
      h('div', { class: 'grownwrap' }, h('span', { class: 'grownlab' }, 'Parent and Teacher Materials'), IR.ui.gearButton()));
    const homeBtn = h('a', { class: 'btn big fs-homebtn', href: '#/home' }, icon('home'), h('span', null, 'Home'));
    const hero = h('section', { class: 'homefeature', 'aria-label': 'Review the letters with Zip and Frill' },
      h('div', { class: 'zfpics' }, h('img', { class: 'homeart', src: 'foundation/img/foundations_sidebar.jpg', width: 900, height: 506, alt: 'Zip and Frill with Team 1 letters a, m, s, t on the beach.' })),
      h('div', { class: 'hfbody' },
        h('h2', { class: 'zfline' }, 'Review the letters with Zip and Frill'),
        h('p', { class: 'zfsub' }, 'Names and sounds, then real words.'),
        letterContinue()));
    const materials = h('section', { class: 'fs-mats', 'aria-label': 'For grown-ups' },
      teacherSlides(),
      teacherGuideDrop(),
      printablesDrop(),
      trackingDrop(),
      sideBtn('Teacher mode', () => { if (IR.teach) IR.teach.toggle(); }));
    app.append(h('div', { class: 'screen home mapscreen gridhome fs-home' },
      h('div', { class: 'mwrap' },
        banner,
        h('div', { class: 'homelay' },
          h('div', { class: 'homeside' }, homeBtn, hero, aboutOrder(), materials),
          h('div', { class: 'bellslot' }, h('div', { class: 'bellpath' }, h('div', { class: 'bellgrid' }, ...cards)))))));
    if (IR.teach) IR.teach.sync();
  }

  function paintStep(stage, group, lesson, step) {
    const stepId = step && step.kind ? step.kind : step;
    const phase = step && step.phase;
    stage.innerHTML = '';
    if (stepId === 'ido') return paintIdo(stage, lesson, phase);
    if (stepId === 'wedo') return paintWedo(stage, lesson, phase);
    if (stepId === 'checkname') return paintNameCheck(stage, phase);
    if (stepId === 'use') return paintUse(stage, lesson, phase);
    if (stepId === 'warm') return paintWarm(stage, lesson, phase);
    if (stepId === 'review') return paintReview(stage, lesson, group, phase);
    if (stepId === 'meet') return paintMeet(stage, lesson, phase);
    if (stepId === 'read') return paintRead(stage, lesson, phase);
    if (stepId === 'write') return paintWrite(stage, lesson, group, phase);
    paintBank(stage, lesson);
  }
  function allowedWords(lesson, phase) {
    if (phase && phase.words) return phase.words;
    const plan = planFor(lesson);
    return (plan && plan.close && plan.close.words) || [];
  }
  function paintWarm(stage, lesson, phase) {
    const words = allowedWords(lesson, phase);
    if (!words.length) {
      stage.append(h('p', { class: 'llask' }, 'Words come after the letters they need.'));
      return;
    }
    const ears = lesson.ears_warmup || {};
    let i = 0;
    const ask = h('p', { class: 'llask' }, ears.goal || 'Tap each sound.');
    const host = h('div', { class: 'fs-stagein' });
    function show() {
      host.innerHTML = '';
      const word = String(words[Math.min(i, words.length - 1)]);
      const parts = word.toLowerCase().replace(/[^a-z]/g, '').split('');
      let at = 0;
      host.append(
        h('p', { class: 'llshown llprint' }, word),
        h('div', { class: 'llrow' }, ...parts.map((ch, n) => h('button', {
          class: 'lltap',
          type: 'button',
          onclick: (e) => {
            if (n !== at) return;
            at += 1;
            e.currentTarget.classList.add('lit');
            const letter = BY[ch];
            if (letter) hear(letter, 'sound');
            if (at >= parts.length && i < words.length - 1 && i < 2) {
              i += 1;
              setTimeout(show, 450);
            }
          }
        }, ch))));
    }
    stage.append(ask, host);
    show();
  }
  function paintReview(stage, lesson, group, phase) {
    const ids = (phase && phase.flash && phase.flash.length ? phase.flash : taughtThrough(group).map((letter) => letter.id)).slice(0, 8);
    stage.append(
      h('p', { class: 'llask' }, 'Tap each letter and say its sound.'),
      h('div', { class: 'llrow' }, ...ids.map((id) => {
        const letter = BY[id];
        if (!letter) return null;
        return h('button', {
          class: 'lltap',
          type: 'button',
          onclick: () => hear(letter, 'sound')
        }, letterCardStep(letter, lookStep(lesson, id)));
      })));
  }
  function paintMeet(stage, lesson, phase) {
    const known = phase && phase.letters;
    const ids = (lesson.new_letters || []).filter((id) => !known || known.indexOf(id) >= 0);
    if (!ids.length) {
      stage.append(h('p', { class: 'llask' }, 'These letters are already friends. Say each sound on the next step.'));
      return;
    }
    stage.append(h('p', { class: 'llask' }, 'Review the letters.'), h('div', { class: 'fs-meet' }, ...ids.map((id) => {
      const letter = BY[id];
      if (!letter) return null;
      return h('div', { class: 'fs-meetone' }, letterCardStep(letter, lookStep(lesson, id)), hintButton([id]));
    })));
  }
  function sceneSrc(scene) {
    const file = scene && scene.image;
    if (!file) return '';
    return file.indexOf('foundation/') === 0 ? file : 'foundation/' + file;
  }
  function paintRead(stage, lesson, phase) {
    const words = allowedWords(lesson, phase).slice(0, 6);
    const scenes = (lesson.word_scenes || []).filter((scene) => scene && scene.word);
    if (scenes.length) {
      stage.append(h('div', { class: 'fs-scenes' }, ...scenes.map((scene) => {
        const src = sceneSrc(scene);
        const caption = scene.caption || '';
        if (!src) return null;
        return h('figure', { class: 'fs-scene' },
          h('img', { src: src, alt: scene.scene || '' }),
          caption ? h('figcaption', null, caption) : null);
      })));
    }
    stage.append(
      h('p', { class: 'llask' }, 'Tap a word. Say each sound, then the word.'),
      h('div', { class: 'llrow' }, ...words.map((word) => h('button', {
        class: 'lltap llprint',
        type: 'button',
        onclick: () => {
          rememberWord(word);
          const parts = String(word).toLowerCase().replace(/[^a-z]/g, '').split('');
          parts.forEach((ch, n) => {
            const letter = BY[ch];
            if (letter) setTimeout(() => hear(letter, 'sound'), n * 280);
          });
          setTimeout(() => speak(word), parts.length * 280 + 200);
        }
      }, word))));
  }
  function paintWrite(stage, lesson, group, phase) {
    const day = Number(lesson.fade && lesson.fade.day) || dayFromLabel(lesson.label);
    const known = (phase && phase.letters) || [];
    const ids = (lesson.new_letters && lesson.new_letters.length ? lesson.new_letters : known).filter((id) => !known.length || known.indexOf(id) >= 0);
    if (day <= 2 && ids.length) {
      stage.append(h('p', { class: 'llask' }, day === 1 ? 'Trace the letter over the character.' : 'Write the letter.'), h('div', { class: 'fs-meet' }, ...ids.slice(0, 2).map((id) => {
        const letter = BY[id];
        if (!letter) return null;
        return h('div', { class: 'fs-meetone' }, letterCardStep(letter, day === 1 ? 'picture' : 'outline'));
      })));
      return;
    }
    const word = allowedWords(lesson, phase).filter((item) => letterIdsSafe(item).length > 1)[0] || '';
    if (!word) {
      stage.append(h('p', { class: 'llask' }, 'Write a letter you know.'));
      return;
    }
    const built = h('p', { class: 'llshown llprint' }, '');
    const letters = String(word).toLowerCase().replace(/[^a-z]/g, '').split('');
    let at = 0;
    const pool = shuffle(letters.slice());
    stage.append(
      h('p', { class: 'llask' }, 'Build ' + word + '.'),
      built,
      h('div', { class: 'llrow' }, ...pool.map((ch) => h('button', {
        class: 'lltap',
        type: 'button',
        onclick: (e) => {
          if (letters[at] !== ch || e.currentTarget.disabled) return;
          e.currentTarget.disabled = true;
          at += 1;
          built.textContent += ch;
          const letter = BY[ch];
          if (letter) hear(letter, 'sound');
          if (at >= letters.length) rememberWord(word);
        }
      }, ch))));
  }
  function letterIdsSafe(word) {
    return window.IRLetterScope ? IRLetterScope.letterIds(word) : String(word || '').toLowerCase().replace(/[^a-z]/g, '').split('');
  }
  function paintUse(stage, lesson, phase) {
    const words = allowedWords(lesson, phase).slice(0, 4);
    const ids = (phase && phase.flash) || [];
    stage.append(
      h('p', { class: 'llask' }, 'Practice with the letters you know.'),
      h('div', { class: 'llrow' }, ...ids.map((id) => {
        const letter = BY[id];
        if (!letter) return null;
        return h('button', { class: 'lltap', type: 'button', onclick: () => hear(letter, 'sound') }, letterCardStep(letter, 'plain'));
      })));
    if (words.length) stage.append(h('div', { class: 'llrow' }, ...words.map((word) => h('button', {
      class: 'lltap llprint',
      type: 'button',
      onclick: () => modelBlend(word)
    }, word))));
  }
  function letterIntro(id) {
    const letter = BY[id];
    const sound = letter && letter.sound ? letter.sound : '';
    const taps = [1, 2, 3].map((n) => h('button', {
      class: 'fs-tapc',
      type: 'button',
      'aria-label': 'Say the sound, time ' + n,
      onclick: (e) => {
        e.currentTarget.classList.add('lit');
        if (letter) hear(letter, 'sound');
      }
    }, String(n)));
    return h('div', { class: 'fs-intro' },
      letter ? letterCardStep(letter, 'picture') : h('b', { class: 'llplain' }, id),
      h('button', {
        class: 'fs-nametag',
        type: 'button',
        'aria-label': 'My name is: ' + id,
        onclick: () => { if (letter) hear(letter, 'name'); }
      },
        h('span', { class: 'fs-nameband', 'aria-hidden': 'true' }),
        h('span', { class: 'fs-nametext' }, 'My name is: ' + id)),
      h('div', { class: 'fs-soundbubble' },
        h('p', null, 'My sound is ' + sound),
        h('div', { class: 'fs-taps' }, ...taps)));
  }
  function paintIdo(stage, lesson, phase) {
    const id = (phase && phase.letter) || (lesson.new_letters || [])[0];
    stage.append(
      h('div', { class: 'llbuddies' }, h('img', { src: 'img/frill.webp', alt: 'Frill' })),
      letterIntro(id),
      grownTip(lesson));
  }
  function paintWedo(stage, lesson, phase) {
    const id = (phase && phase.letter) || (lesson.new_letters || [])[0];
    stage.append(
      h('div', { class: 'llbuddies' }, h('img', { src: 'img/zipA.webp', alt: 'Zip' }), h('img', { src: 'img/frill.webp', alt: 'Frill' })),
      h('p', { class: 'llask' }, 'Say it with us.'),
      letterIntro(id),
      grownTip(lesson));
  }
  function paintNameCheck(stage, phase) {
    const id = phase && phase.letter;
    stage.append(
      h('p', { class: 'llask' }, 'Your turn. Name, then the sound three times.'),
      letterIntro(id));
  }
  function paintBank(stage, lesson) {
    const words = readBank();
    stage.append(
      h('p', { class: 'llask' }, 'Look what I can read!'),
      h('p', { class: 'fs-words big' }, words.length ? words.join('  ') : 'Read a word and it stays here.'),
      h('div', { class: 'llbuddies' }, h('img', { src: 'img/frill.webp', alt: 'Frill' }), h('img', { src: 'img/zipA.webp', alt: 'Zip' })));
    if (lesson) markDone(lesson.lesson_number);
  }
  function lessonScreen(app, group, lesson, stepId) {
    const steps = flowFor(lesson);
    const step = steps.filter((item) => item.id === stepId)[0] || steps[0];
    const index = steps.indexOf(step);
    IR.newScreen();
    const stage = h('div', { class: 'fs-stage' });
    const teacher = IR.teach && IR.teach.on && IR.teach.on();
    const strip = h('div', { class: 'fs-strip', role: 'list' }, ...steps.map((item, i) => {
      const cls = 'fs-step' + (i === index ? ' on' : '') + (i < index ? ' past' : '');
      if (i > index && !teacher) return h('span', { class: cls, role: 'listitem' }, item.title);
      return h('button', {
        class: cls,
        type: 'button',
        role: 'listitem',
        onclick: () => { location.hash = lessonHash(group, lesson, item.id); }
      }, item.title);
    }));
    if (step.id === 'bank') paintBank(stage, lesson);
    else paintStep(stage, group, lesson, step);
    app.append(h('div', { class: 'screen trailscreen unitpage llpage fs-lesson' },
      h('header', { class: 'uA-top' },
        h('button', { class: 'back homebtn', type: 'button', onclick: () => { Snd.stop(); location.hash = dayHash(group, lesson); } }, icon('back'), h('span', null, 'Day')),
        h('h1', { class: 'uA-title' }, lesson.label || ('Lesson ' + lesson.lesson_number)),
        IR.ui.gearButton()),
      strip,
      h('main', { class: 'llmain fs-stagewrap' }, stage),
      h('div', { class: 'llnav' }, h('button', {
        class: 'btn big primary',
        type: 'button',
        onclick: () => {
          Snd.stop();
          if (index >= steps.length - 1) {
            markDone(lesson.lesson_number);
            location.hash = '#/foundation/letters/' + group.id;
            return;
          }
          location.hash = lessonHash(group, lesson, steps[index + 1].id);
        }
      }, index >= FLOW.length - 1 ? 'Done' : 'Next'))));
    if (IR.teach) IR.teach.sync();
  }
  function checkScreen(app, group) {
    const lessons = lessonsOf(group);
    const source = lessons.filter((lesson) => lesson.mastery_check).slice(-1)[0];
    const close = source && planFor(source) && planFor(source).close;
    const items = ((source && source.mastery_check && source.mastery_check.items) || []).filter((item) => {
      if (!close || !window.IRLetterScope) return true;
      if (item.type === 'word') return IRLetterScope.wordOk(program, item.item, close.letters, close.hearts);
      return close.letters.indexOf(item.item) >= 0;
    });
    let i = 0;
    let right = 0;
    let picked = false;
    IR.newScreen();
    const stage = h('div', { class: 'fs-stage' });
    function show() {
      stage.innerHTML = '';
      picked = false;
      if (!items.length || i >= items.length) {
        const pass = !items.length || right * 10 >= items.length * 7;
        if (pass) markCheck(group);
        stage.append(
          h('p', { class: 'llask' }, pass ? 'The next group is open.' : 'We can practice this group again.'),
          h('p', { class: 'llshown' }, right + ' of ' + items.length));
        return;
      }
      const item = items[i];
      const pool = item.type === 'word'
        ? lessons.reduce((list, lesson) => list.concat(lesson.new_words || []), [])
        : taughtThrough(group).map((letter) => letter.id);
      const others = pool.filter((value, n) => value !== item.item && pool.indexOf(value) === n).slice(0, 2);
      const choices = shuffle([item.item].concat(others));
      stage.append(
        h('p', { class: 'llask' }, item.type === 'word' ? 'Which word?' : 'Which letter?'),
        h('div', { class: 'llrow' }, ...choices.map((value) => h('button', {
          class: 'lltap llprint',
          type: 'button',
          onclick: (e) => {
            if (picked) return;
            picked = true;
            const yes = value === item.item;
            if (yes) right += 1;
            e.currentTarget.classList.add(yes ? 'lit' : 'off');
          }
        }, value))));
      if (item.type === 'word') speak(item.item);
      else {
        const letter = BY[item.item];
        if (letter) hear(letter, 'sound');
      }
    }
    show();
    app.append(h('div', { class: 'screen trailscreen unitpage llpage fs-lesson' },
      h('header', { class: 'uA-top' },
        h('button', { class: 'back homebtn', type: 'button', onclick: () => { Snd.stop(); location.hash = '#/foundation/letters/' + group.id + '/day/check'; } }, icon('back'), h('span', null, 'Day')),
        h('h1', { class: 'uA-title' }, 'Team check'),
        IR.ui.gearButton()),
      h('main', { class: 'llmain fs-stagewrap' }, stage),
      h('div', { class: 'llnav' }, h('button', {
        class: 'btn big primary',
        type: 'button',
        onclick: () => {
          Snd.stop();
          if (i >= items.length) { location.hash = '#/foundation/letters/' + group.id + '/day/check'; return; }
          i += 1;
          show();
        }
      }, 'Next'))));
    if (IR.teach) IR.teach.sync();
  }

  const SLIDES = {
    g1: {
      file: 'foundation/slides/Learn_the_Letters_Team1.pdf',
      days: [
        { label: 'Day 1a', page: 3 },
        { label: 'Day 1b', page: 21 },
        { label: 'Day 2', page: 44 },
        { label: 'Day 3', page: 79 },
        { label: 'Day 4', page: 110 },
        { label: 'Team check', page: 110 }
      ]
    },
    g2: {
      file: 'foundation/slides/Learn_the_Letters_Team2.pdf',
      days: [
        { label: 'Day 1', page: 3 },
        { label: 'Day 2', page: 28 },
        { label: 'Day 3', page: 53 },
        { label: 'Day 4', page: 93 },
        { label: 'Team check', page: 93 }
      ]
    }
  };
  function openSlides(team, page) {
    Snd.stop();
    location.hash = '#/foundation/slides/' + team + (page ? '/' + page : '');
  }
  function teamTeacher(group) {
    if (!SLIDES[group.id]) return null;
    const files = group.id === 'g1'
      ? [{ title: 'Team 1 Quick Sounds', href: 'foundation/printables/Team1_Quick_Sounds.pdf' }]
      : [{ title: 'Team 2 Quick Sounds', href: 'foundation/printables/Team2_Quick_Sounds.pdf' }];
    return { slides: '#/foundation/slides/' + group.id, files: files };
  }
  function pdfLink(label, href) {
    return h('a', { class: 'drop-link', href: href, target: '_blank', rel: 'noopener' }, label);
  }
  const SCORE_TRACKER = '';
  function teacherSlides() {
    return IR.sideDrop({
      group: 'foundation',
      label: 'Teacher Slideshows',
      tabClass: 'btn big fs-sidebtn',
      extraClass: 'fs-slidepanel',
      fill(body) {
        const cols = h('div', { class: 'fs-slidecols' });
        [1, 2].forEach((n) => {
          const id = 'g' + n;
          const deck = SLIDES[id];
          const col = h('div', { class: 'fs-slidecol' });
          col.append(h('button', { class: 'drop-link', type: 'button', onclick: () => openSlides(id) }, 'Team ' + n));
          deck.days.forEach((day) => col.append(h('button', { class: 'drop-link fs-daylink', type: 'button', onclick: () => openSlides(id, day.page) }, day.label)));
          cols.append(col);
        });
        body.append(cols, h('p', { class: 'drop-soon' }, 'Teams 3-7 coming soon'));
      }
    });
  }
  function teacherGuideDrop() {
    return IR.sideDrop({
      group: 'foundation',
      label: 'Teacher guide',
      tabClass: 'btn big fs-sidebtn',
      fill(body) {
        body.append(
          h('a', { class: 'drop-link', href: '#/teachers/slides/ng' }, 'ng slides'),
          h('a', { class: 'drop-link', href: '#/teachers/slides/nk' }, 'nk slides'),
          pdfLink('ng teacher pack', 'teachers/ng/Lesson3.1_ng_Teacher_Pack.pdf'),
          pdfLink('nk teacher pack', 'teachers/nk/Lesson3.2_nk_Teacher_Pack.pdf'),
          pdfLink('Lesson 5.1 Teacher-Led Checks', 'materials/unit5/Lesson5.1_Teacher_Led_Checks.pdf'),
          pdfLink('Lesson 5.2 Teacher-Led Checks', 'materials/unit5/Lesson5.2_Teacher_Led_Checks.pdf'),
          pdfLink('Unit 5 All Checks (teacher scripts and answer keys)', 'materials/unit5/Unit5_Teacher_Led_Checks_Combined.pdf'));
      }
    });
  }
  function printablesDrop() {
    return IR.sideDrop({
      group: 'foundation',
      label: 'Printables',
      tabClass: 'btn big fs-sidebtn',
      fill(body) {
        body.append(
          pdfLink('Team 1 Quick Sounds', 'foundation/printables/Team1_Quick_Sounds.pdf'),
          pdfLink('Team 2 Quick Sounds', 'foundation/printables/Team2_Quick_Sounds.pdf'));
        if (SCORE_TRACKER) body.append(h('a', { class: 'drop-link', href: SCORE_TRACKER, target: '_blank', rel: 'noopener' }, 'Score Tracker'));
        body.append(
          pdfLink('ng daily practice sheets', 'teachers/ng/Lesson3.1_ng_Daily_Practice_Sheets.pdf'),
          pdfLink('nk daily practice sheets', 'teachers/nk/Lesson3.2_nk_Daily_Practice_Sheets.pdf'),
          pdfLink('Unit 5 Student Sheets', 'materials/unit5/Unit5_Teacher_Led_Student_Sheets.pdf'));
      }
    });
  }
  function trackingDrop() {
    const track = (program && program.tracking) || { fields: [], decision_rules: [] };
    return IR.sideDrop({
      group: 'foundation',
      label: 'Tracking sheet',
      tabClass: 'btn big fs-sidebtn',
      fill(body) {
        track.fields.forEach((line) => body.append(h('p', { class: 'drop-note' }, line)));
        track.decision_rules.forEach((line) => body.append(h('p', { class: 'drop-note' }, line)));
      }
    });
  }
  function slidesScreen(app, team, page) {
    IR.newScreen();
    const deck = SLIDES[team];
    const day = deck.days.filter((item) => String(item.page) === String(page))[0];
    const title = day ? ('Team ' + team.slice(1) + ', ' + day.label) : ('Team ' + team.slice(1) + ' slideshow');
    const view = h('div', { class: 'screen fs-slideview' });
    const goFull = () => {
      const el = document.querySelector('.fs-slideview');
      if (el && el.requestFullscreen) el.requestFullscreen();
    };
    view.append(
      h('header', { class: 'uA-top' },
        h('button', { class: 'back homebtn', type: 'button', onclick: () => { Snd.stop(); if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen(); location.hash = '#/foundation'; } }, icon('back'), h('span', null, 'Foundation')),
        h('h1', { class: 'uA-title' }, title),
        h('button', { class: 'btn big primary fs-slidebtn', type: 'button', onclick: goFull }, 'Full screen')),
      h('iframe', { class: 'fs-pdf', src: deck.file + (page ? '#page=' + page : ''), title: title }));
    app.append(view);
    if (IR.teach) IR.teach.sync();
  }
  IR.letters = { GROUPS: GROUPS, LETTERS: LETTERS, artNeeded: ART_NEEDED, who: WHO };
  IR.lettersRoute = function (hash, app) {
    const deck = hash.match(/^#\/foundation\/slides\/(g[12])(?:\/(\d+))?\/?$/);
    if (deck && SLIDES[deck[1]]) { slidesScreen(app, deck[1], deck[2]); return true; }
    if (/^#\/foundation\/letters\/?$/.test(hash)) { foundationPage(app); return true; }
    const lesson = /^#\/foundation\/letters\/(g[1-7])\/l\/(\d+)(?:\/([a-z0-9-]+))?\/?$/.exec(hash);
    if (lesson) {
      const g = groupById(lesson[1]);
      const row = lessonsOf(g || { id: lesson[1] }).filter((item) => item.lesson_number === Number(lesson[2]))[0];
      if (!g || !row) return false;
      if (!groupOpen(g) && !(IR.teach && IR.teach.on && IR.teach.on())) { foundationPage(app); return true; }
      lessonScreen(app, g, row, lesson[3] || '');
      return true;
    }
    const day = /^#\/foundation\/letters\/(g[1-7])\/day\/([a-z0-9]+)\/?$/.exec(hash);
    if (day) {
      const g = groupById(day[1]);
      if (!g) return false;
      if (!groupOpen(g)) { foundationPage(app); return true; }
      groupPage(app, g, day[2]);
      return true;
    }
    const group = /^#\/foundation\/letters\/(g[1-7])\/?$/.exec(hash);
    if (group) {
      const g = groupById(group[1]);
      if (!g) return false;
      if (!groupOpen(g)) { foundationPage(app); return true; }
      groupPage(app, g, '');
      return true;
    }
    const check = /^#\/foundation\/letters\/(g[1-7])\/check\/?$/.exec(hash);
    if (check) {
      const g = groupById(check[1]);
      if (!g || !groupOpen(g)) return false;
      checkScreen(app, g);
      return true;
    }
    const play = /^#\/foundation\/letters\/(g[1-7])\/(flash|ears|meet|say|trace|games|read|spell|celebrate|find|match|sound|feed|review)$/.exec(hash);
    if (play) {
      const g = groupById(play[1]);
      if (!g) return false;
      if (play[2] === 'games') { gamesPage(app, g); return true; }
      if (play[2] === 'celebrate') { celebrateScreen(app, g); return true; }
      const step = LESSON.filter((item) => item.id === play[2])[0];
      const game = step || gamesFor(g).filter((item) => item.id === play[2])[0];
      if (!game) return false;
      stepScreen(app, g, game);
      return true;
    }
    return false;
  };
  IR.foundationRoute = function (hash, app) {
    const mine = hash === '#/foundation' || hash === '#/foundation/' || hash.startsWith('#/foundation/');
    if (!mine) return false;
    const paint = () => {
      if ((location.hash.split('?')[0] || '') !== hash) return;
      app.innerHTML = '';
      if (hash === '#/foundation' || hash === '#/foundation/') foundationPage(app);
      else IR.lettersRoute(hash, app);
    };
    if (program && program.lessons) paint();
    else ensureProgram().then(paint);
    return true;
  };
})();
