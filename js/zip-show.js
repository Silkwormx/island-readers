/* Action scenes for independent lessons.
   Zip (and sometimes Frill) does something different on each step.
   Short prompts rotate with the step. The same scene and the same prompt
   never show twice in a row. Spoken prompts are Frill's recorded line
   (en-US-AriaNeural), from tools/build_foundation_audio.py. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;

  const SCENES = [
    { id: 'listen', src: 'img/zip-show/listen.webp', who: 'Zip', motion: 'tilt', alt: 'Zip holds a hand to his ear' },
    { id: 'point', src: 'img/zip-show/point.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip points at the letter' },
    { id: 'think', src: 'img/zip-show/think.webp', who: 'Zip', motion: 'tilt', alt: 'Zip thinks, finger on his chin' },
    { id: 'cheer', src: 'img/zip-show/cheer.webp', who: 'Zip', motion: 'hop', alt: 'Zip cheers with both arms up' },
    { id: 'dance', src: 'img/zip-show/dance.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip dances' },
    { id: 'surprise', src: 'img/zip-show/surprise.webp', who: 'Zip', motion: 'in', alt: 'Zip looks surprised' },
    { id: 'drum', src: 'img/zip-show/drum.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip drums the sound' },
    { id: 'apple', src: 'img/zip-show/apple.webp', who: 'Zip', motion: 'in', alt: 'Zip bites an apple' },
    { id: 'surf', src: 'img/zip-show/surf.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip surfs a wave' },
    { id: 'dig', src: 'img/zip-show/dig.webp', who: 'Zip', motion: 'in', alt: 'Zip digs in the sand' },
    { id: 'banyan', src: 'img/zip-show/banyan.webp', who: 'Zip', motion: 'in', alt: 'Zip climbs the banyan' },
    { id: 'bell', src: 'img/zip-show/bell.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip rings the bell' },
    { id: 'splash', src: 'img/zip-show/splash.webp', who: 'Zip', motion: 'hop', alt: 'Zip splashes in a tide pool' },
    { id: 'juggle', src: 'img/zip-show/juggle.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip juggles shells' },
    { id: 'shell', src: 'img/zip-show/shell.webp', who: 'Zip', motion: 'in', alt: 'Zip holds up a shell' },
    { id: 'mouth', src: 'img/zip-show/mouth.webp', who: 'Zip', motion: 'tilt', alt: 'Zip points at his mouth' },
    { id: 'wave', src: 'img/zipA.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip waves' },
    /* Frill stays the approved v4 B portrait. Motion is CSS, not a new drawing. */
    { id: 'frill-swim', src: 'img/frill.webp', who: 'Frill', motion: 'slide', alt: 'Frill swims by', approved: true },
    { id: 'highfive', src: 'img/zipA.webp', who: 'both', motion: 'hop', alt: 'Zip and Frill high-five', pair: 'img/frill.webp', approved: true },
    { id: 'mangrove', src: 'img/zip-show/mangrove.webp', who: 'Zip', motion: 'in', alt: 'Zip climbs the mangrove roots' },
    { id: 'snake', src: 'img/zip-show/snake.webp', who: 'Zip', motion: 'wiggle', alt: 'Zip meets a sea snake' },
    { id: 'turtle', src: 'img/zip-show/turtle.webp', who: 'Zip', motion: 'in', alt: 'Zip walks with a sea turtle' }
  ];
  const BY_ID = {};
  SCENES.forEach((scene) => { BY_ID[scene.id] = scene; });

  const PROMPTS = {
    listen: ['Ears on!', 'Hear this one.', 'Listen close.'],
    say: ['Your turn!', 'Say it with me!', 'You say it.'],
    mouth: ['Watch my mouth', 'Look at the mouth.'],
    find: ['Can you find it?', 'Look for it.', 'Which one?'],
    teach: ['Teach me!', 'Show me.', 'You know this.'],
    cheer: ['Nice!', 'Yes!'],
    blend: ['Blend it fast!', 'Snap them together.', 'Put the sounds together.'],
    think: ['Picture the word.', 'Think of it.'],
    keyword: ['Picture the word.', 'Ears on!', 'Think of it.']
  };
  const POOLS = {
    listen: ['listen', 'drum', 'shell', 'surprise'],
    say: ['point', 'dance', 'mouth', 'wave'],
    mouth: ['mouth', 'point'],
    find: ['dig', 'banyan', 'bell'],
    teach: ['think', 'listen', 'wave'],
    cheer: ['highfive', 'cheer', 'dance'],
    blend: ['juggle', 'drum', 'cheer'],
    think: ['think', 'shell'],
    keyword: ['surf', 'dig', 'banyan', 'bell', 'splash', 'juggle']
  };
  /* One scene per letter so a keyword step can match the sound, and neighbors differ. */
  const LETTER = {
    a: 'apple', m: 'mangrove', s: 'snake', t: 'turtle',
    p: 'splash', f: 'surf', i: 'think', n: 'shell',
    o: 'dig', d: 'banyan', c: 'bell', u: 'juggle',
    g: 'drum', b: 'dance', e: 'surprise', k: 'point',
    h: 'cheer', r: 'listen', l: 'highfive', w: 'surf',
    j: 'juggle', y: 'apple', x: 'dig', q: 'think',
    v: 'banyan', z: 'dance'
  };

  let state = blank();
  function blank() { return { scene: '', prompt: '', n: 0, cursor: {} }; }
  function reset() { state = blank(); }

  function planBeat(id) {
    const row = /^([a-z])-(meet|word|silly|turn|pop)$/.exec(id || '');
    if (row) {
      const kind = { meet: 'listen', word: 'keyword', silly: 'say', turn: 'say', pop: 'listen' }[row[2]];
      const hint = { meet: 'Ears on!', word: 'Picture the word.', silly: 'Say it with me!', turn: 'Your turn!', pop: 'Hear this one.' }[row[2]];
      return { kind: kind, key: row[1], hint: hint };
    }
    if (String(id).indexOf('blend') === 0) return { kind: 'blend', key: '', hint: 'Blend it fast!' };
    if (id === 'find') return { kind: 'find', key: '', hint: 'Can you find it?' };
    if (id === 'zip') return { kind: 'teach', key: '', hint: 'Teach me!' };
    if (id === 'review' || id === 'read') return { kind: 'cheer', key: '', hint: 'Nice!' };
    return { kind: 'listen', key: '', hint: 'Ears on!' };
  }

  function take(list, cursorKey, last) {
    const start = state.cursor[cursorKey] || 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[(start + i) % list.length];
      if (item !== last) {
        state.cursor[cursorKey] = (start + i + 1) % list.length;
        return item;
      }
    }
    return list[0];
  }

  function sceneId(opts) {
    const letterScene = opts.kind === 'keyword' && LETTER[opts.key];
    if (letterScene && letterScene !== state.scene) return letterScene;
    if (opts.kind !== 'keyword' && state.n > 0 && state.n % 6 === 5) {
      const frill = state.scene === 'frill-swim' ? 'highfive' : 'frill-swim';
      if (BY_ID[frill] && frill !== state.scene) return frill;
    }
    const pool = POOLS[opts.kind] || POOLS.listen;
    const id = take(pool, 's:' + opts.kind, state.scene);
    if (id !== state.scene) return id;
    for (let i = 0; i < SCENES.length; i++) {
      if (SCENES[i].id !== state.scene) return SCENES[i].id;
    }
    return id;
  }

  function promptFor(opts) {
    const list = PROMPTS[opts.kind] || PROMPTS.listen;
    if (opts.hint && opts.hint !== state.prompt && list.indexOf(opts.hint) >= 0) return opts.hint;
    return take(list, 'p:' + (opts.kind || 'listen'), state.prompt);
  }

  function pick(opts) {
    opts = opts || {};
    const id = sceneId(opts);
    const scene = BY_ID[id] || SCENES[0];
    const prompt = promptFor(opts);
    const step = state.n;
    state.scene = scene.id;
    state.prompt = prompt;
    state.n += 1;
    const celebrate = scene.motion === 'hop' || scene.id === 'highfive' || scene.id === 'cheer';
    let surprise = '';
    if (!celebrate && scene.who === 'Zip') {
      if (step % 5 === 3) surprise = 'peek';
      else if (step % 5 === 1) surprise = 'shell';
      else if (step % 4 === 2) surprise = 'wag';
    }
    let enter = 'pop';
    if (scene.motion === 'slide' || surprise === 'wag') enter = scene.motion === 'slide' ? 'slide' : 'wag';
    else if (celebrate) enter = 'hop';
    else if (step % 3 === 1) enter = 'slide';
    return {
      id: scene.id,
      src: scene.src,
      pair: scene.pair || '',
      alt: scene.alt,
      who: scene.who,
      motion: scene.motion,
      enter: enter,
      surprise: surprise,
      celebrate: celebrate,
      prompt: prompt
    };
  }

  function speak(text) {
    if (IR.voice && IR.voice.line) IR.voice.line(text, 'Frill');
  }

  function figure(choice) {
    const h = IR.h;
    const who = choice.who === 'both' ? 'Zip and Frill' : choice.who;
    const art = choice.pair
      ? h('span', { class: 'zs-pair' },
        h('img', { class: 'zs-art', src: choice.src, alt: 'Zip' }),
        h('img', { class: 'zs-art', src: choice.pair, alt: 'Frill' }))
      : h('img', { class: 'zs-art', src: choice.src, alt: choice.alt });
    const say = h('button', {
      class: 'zs-say',
      type: 'button',
      'aria-label': who + ' says: ' + choice.prompt,
      onclick: () => speak(choice.prompt)
    }, choice.prompt);
    const extra = [];
    if (choice.surprise === 'peek') extra.push(h('img', { class: 'zs-peekimg', src: 'img/frill.webp', alt: '' }));
    if (choice.surprise === 'shell') extra.push(h('span', { class: 'zs-shell', 'aria-hidden': 'true' }));
    if (choice.celebrate) extra.push(h('span', { class: 'zs-bits', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('i'), h('i')));
    return h('div', {
      class: 'zs zs-' + (choice.enter || 'pop') + (choice.celebrate ? ' zs-celebrate' : '') + (choice.who === 'Frill' ? ' zs-frill' : ''),
      'data-scene': choice.id,
      'data-prompt': choice.prompt,
      'data-surprise': choice.surprise || ''
    }, art, ...extra, say);
  }

  function retarget(root, opts) {
    const choice = pick(opts);
    if (!root || !root.querySelector) return choice;
    const old = root.querySelector('.zs');
    if (!old) return choice;
    old.replaceWith(figure(choice));
    return choice;
  }

  IR.zipShow = {
    SCENES: SCENES,
    PROMPTS: PROMPTS,
    LETTER: LETTER,
    reset: reset,
    planBeat: planBeat,
    pick: pick,
    next: pick,
    figure: figure,
    retarget: retarget,
    state: function () { return { scene: state.scene, prompt: state.prompt, n: state.n }; }
  };
})();
