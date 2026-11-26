/* Foundations voice: recorded clips first, one sound at a time.
   - Directions and stories play Frill's recorded line (edge-tts en-US-AriaNeural -12%, the same voice as the Unit 4 ng/nk Frill lines).
     Zip's one line plays Zip's voice. Words play the word voice (AriaNeural -15%, same as audio/w_*).
     Clips and the index come from tools/build_foundation_audio.py.
   - A new direction never talks over the last one, and a sound that was started by the app (not a tap) waits for
     the direction to finish instead of cutting it off. A tap always wins.
   - Device speech (the robot voice) is only a last resort for a line with no clip, and is cancelled with every stop.
   - Letter sounds: only HUMAN recordings play. See RECORDED below. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const V = window.IR_FOUNDATION_VOICE || { lines: {}, zip: {}, words: {} };
  const Snd = IR.Snd;

  /* ---- letter sounds ----
     Put a sound's key here once her own recording is saved at the path in FILES (for example audio/phonemes/f.mp3).
     The 13 files that are in audio/phonemes today (a d e ee i k m n oh p s t u) were made with espeak-ng, a computer voice,
     not recorded by a person (d.mp3 is silent, and k p t are tiny clicks). They stay in the repo but do not play
     unless PLAY_COMPUTER_SOUNDS is turned on. */
  const RECORDED = [];
  const PLAY_COMPUTER_SOUNDS = false;
  const COMPUTER_MADE = ['a', 'd', 'e', 'ee', 'i', 'k', 'm', 'n', 'oh', 'p', 's', 't', 'u'];
  const FILES = {
    a: 'a', m: 'm', s: 's', t: 't', p: 'p', f: 'f', i: 'i', n: 'n', o: 'o', d: 'd', c: 'k', k: 'k', u: 'u',
    g: 'g', b: 'b', e: 'e', h: 'h', r: 'r', l: 'l', w: 'w', j: 'j', y: 'y', x: 'ks', q: 'kw', v: 'v', z: 'z',
    ee: 'ee', oh: 'oh', th: 'th', ng: 'ng', nk: 'nk',
    /* spellings of a sound that a line might use */
    ah: 'a', mmm: 'm', sss: 's', nnn: 'n', fff: 'f', lll: 'l', rrr: 'r', vvv: 'v', zzz: 'z', eh: 'e', ih: 'i', uh: 'u'
  };
  function phonemeSrc(key) {
    const file = FILES[String(key || '').toLowerCase()];
    if (!file) return '';
    const ok = RECORDED.indexOf(file) >= 0 || (PLAY_COMPUTER_SOUNDS && COMPUTER_MADE.indexOf(file) >= 0);
    return ok ? 'audio/phonemes/' + file + '.mp3' : '';
  }

  /* ---- lookups ---- */
  function norm(t) {
    return String(t == null ? '' : t).toLowerCase().replace(/\u2019/g, "'").replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function lineSrc(text, who) {
    const k = norm(text);
    if (!k) return '';
    return (who === 'Zip' && V.zip[k]) || V.lines[k] || (who !== 'Frill' && V.zip[k]) || '';
  }
  function wordSrc(word) {
    const k = norm(word).replace(/[^a-z]/g, '');
    return (k && V.words[k]) || '';
  }
  const misses = [];
  function miss(kind, text) {
    const t = kind + ': ' + text;
    if (misses.indexOf(t) < 0) misses.push(t);
  }

  /* ---- no talking over each other ---- */
  let lastTap = 0;
  ['pointerdown', 'touchstart', 'keydown'].forEach((ev) => document.addEventListener(ev, () => { lastTap = Date.now(); }, true));
  let prompt = null;   /* { gen, done } while a direction is playing */
  function cancelSpeech() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* none */ } }
  const rawStop = Snd.stop.bind(Snd);
  Snd.stop = function () { cancelSpeech(); prompt = null; return rawStop(); };
  const rawPlay = Snd.play.bind(Snd);
  Snd.play = function (src, opts) {
    opts = opts || {};
    const pr = prompt;
    const fromTap = Date.now() - lastTap < 400;
    if (pr && pr.gen === Snd.id && Snd.playing && !opts.keep && !opts.manual && !Snd.manual && !fromTap && !/sfx_/.test(String(src))) {
      return pr.done.then(() => (Snd.id === pr.gen ? rawPlay(src, opts) : false));
    }
    cancelSpeech();
    return rawPlay(src, opts);
  };

  function playClip(src, isPrompt) {
    if (!isPrompt) return Snd.play(src);
    const p = rawPlay(src);
    const gen = Snd.id;
    const done = p.then((ok) => { if (prompt && prompt.gen === gen) prompt = null; return ok; });
    prompt = { gen: gen, done: done };
    return done;
  }
  /* last resort only: a line with no recording */
  function device(text, rate) {
    return new Promise((resolve) => {
      try {
        if (!window.speechSynthesis || !text) { resolve(false); return; }
        Snd.stop();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = rate || 0.9;
        let done = false;
        const fin = () => { if (done) return; done = true; resolve(true); };
        u.onend = fin; u.onerror = fin;
        window.speechSynthesis.speak(u);
        setTimeout(fin, Math.max(1500, String(text).length * 90));
      } catch (e) { resolve(false); }
    });
  }

  /* A direction or a story line. */
  function line(text, who) {
    const src = lineSrc(text, who);
    const pr = prompt;
    if (src && pr && pr.gen === Snd.id && Snd.playing && !Snd.manual && Date.now() - lastTap >= 400) {
      /* the app started this line while another is still talking: let that one finish first */
      return pr.done.then(() => (Snd.id === pr.gen ? line(text, who) : false));
    }
    if (src) return playClip(src, true);
    miss('line', text);
    const auto = IR.S && IR.S().settings && IR.S().settings.autoplay !== false;
    if (!auto && !Snd.manual) return Promise.resolve(false);
    return device(text);
  }
  /* One whole word. */
  function word(w) {
    const src = wordSrc(w);
    if (src) return playClip(src, false);
    miss('word', w);
    const clean = String(w || '').replace(/[^A-Za-z']/g, '');
    if (clean.length < 2 && !/^a$/i.test(clean)) return Promise.resolve(false);   /* a lone letter would come out as its name */
    return device(clean);
  }
  /* A story sentence: the recorded line, or each word in turn. */
  function story(text) {
    if (lineSrc(text)) return line(text);
    const words = String(text || '').split(/\s+/).filter(Boolean);
    return words.reduce((chain, w) => chain.then(() => word(w).then(() => IR.sleep(160))), Promise.resolve(false));
  }
  function phoneme(key) {
    const src = phonemeSrc(key);
    return src ? playClip(src, false) : Promise.resolve(false);
  }
  /* Play a list of steps one after another. Stops if the screen changes or a new sound starts. */
  function chain(steps, gap) {
    const start = Snd.id;
    let cur = start;
    return steps.reduce((p, step) => p.then((go) => {
      if (go === false || Snd.id !== cur) return false;
      return Promise.resolve(step()).then(() => { cur = Snd.id; return IR.sleep(gap == null ? 120 : gap); }).then(() => true);
    }), Promise.resolve(true));
  }

  IR.voice = { line: line, word: word, story: story, phoneme: phoneme, phonemeSrc: phonemeSrc, lineSrc: lineSrc, wordSrc: wordSrc,
    chain: chain, misses: misses, norm: norm, RECORDED: RECORDED, COMPUTER_MADE: COMPUTER_MADE };
  IR.hasPhoneme = (g) => Promise.resolve(!!phonemeSrc(g));
  IR.playPhoneme = phoneme;
})();
