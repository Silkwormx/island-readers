/* Skill Practice catalog. Points at activities that already exist. Does not copy their games. */
(function (root) {
  'use strict';
  const KIND = {
    rhyme: 'rhyme',
    hear: 'pa',
    bells: 'pa',
    fish: 'pa'
  };
  const SKILLS = [
    { id: 'fluency', name: 'Fluency', blurb: 'Read a story again until it is smooth.' },
    { id: 'spelling', name: 'Spelling', blurb: 'Five spelling steps for each lesson.' },
    { id: 'rhyme', name: 'Rhyme', blurb: 'Rhyme Call and Rhyme Time.' },
    { id: 'pa', name: 'Phonemic Awareness', blurb: 'Hear a sound, then find the word.' },
    { id: 'families', name: 'Word Families', blurb: 'Coming soon.', soon: true },
    { id: 'sight', name: 'Heart / Sight Words', blurb: 'Practice the tricky words you have met.' }
  ];

  function lessonSteps(list, lesson) {
    const out = { rhyme: [], pa: [] };
    (list || []).forEach((step) => {
      const kind = KIND[step.id];
      if (!kind) return;
      out[kind].push({
        unit: lesson.unit,
        lesson: lesson.lesson,
        name: lesson.name,
        title: step.title,
        href: lesson.href(step),
        type: kind
      });
    });
    return out;
  }

  function collectSkills(src) {
    src = src || {};
    const bags = { fluency: [], spelling: [], rhyme: [], pa: [], sight: [] };
    (src.stories || []).forEach((s) => {
      bags.fluency.push({ unit: +s.unit || 0, lesson: s.lessonN || '', name: s.name || '', title: s.title || 'Read the story', href: s.href, type: 'Fluency' });
    });
    (src.spells || []).forEach((L) => {
      bags.spelling.push({ unit: L.unit, lesson: L.n, name: L.name, title: 'Spelling', href: '#/spell/' + L.id, type: 'Spelling' });
    });
    function take(steps, lesson) {
      const part = lessonSteps(steps, lesson);
      ['rhyme', 'pa'].forEach((k) => { bags[k] = bags[k].concat(part[k]); });
    }
    take(src.ng || [], { unit: 4, lesson: '4.1', name: 'ng', href: (step) => '#/lesson/' + ((src.ng || []).indexOf(step) + 1) });
    take(src.nk || [], { unit: 4, lesson: '4.2', name: 'nk', href: (step) => '#/nk/' + step.id });
    (src.u5 || []).forEach((L) => take(L.steps, { unit: 5, lesson: L.n, name: L.name, href: (step) => '#/' + L.key + '/' + step.id }));
    (src.u6 || []).forEach((L) => take(L.steps, { unit: 6, lesson: L.n, name: L.name, href: (step) => '#/u6/' + L.key + '/' + step.id }));
    (src.chests || []).forEach((c) => {
      bags.sight.push({ unit: c.unit, lesson: c.lesson, name: c.name, title: c.title, href: c.href, type: 'Sight words', locked: !c.href });
    });
    return SKILLS.map((s) => Object.assign({ items: bags[s.id] || [] }, s));
  }

  function searchSkills(skills, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    const hits = [];
    (skills || []).forEach((s) => {
      if (s.soon) {
        if (s.name.toLowerCase().indexOf(q) >= 0) hits.push({ skill: s.name, title: s.name, name: '', lesson: '', unit: 0, href: '', soon: true, type: 'Word Families' });
        return;
      }
      (s.items || []).forEach((it) => {
        const hay = [s.name, it.type, it.title, it.name, it.lesson, 'unit ' + it.unit].join(' ').toLowerCase();
        if (hay.indexOf(q) >= 0) hits.push(Object.assign({ skill: s.name }, it));
      });
    });
    return hits;
  }

  const api = { collectSkills: collectSkills, searchSkills: searchSkills, SKILLS: SKILLS };
  root.IR = root.IR || {};
  root.IR.collectSkills = collectSkills;
  root.IR.searchSkills = searchSkills;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
