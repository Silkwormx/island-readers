/* Teacher mode for a smart board. Shared by any unit that calls IR.teach.mount.
   Full screen, large type, tap targets, Reveal answer, Next, and an optional Zip vs Frill tally.
   Sound stays on unless the mute button is used. */
(function () {
  'use strict';
  const IR = window.IR;
  if (!IR) return;
  const { h, icon } = IR;
  const TEAMS = 'ir_class_teams';

  function settings() {
    const s = IR.S();
    if (!s.settings) s.settings = {};
    return s.settings;
  }
  function on() { return !!settings().teacher; }
  function teams() {
    try {
      const t = JSON.parse(localStorage.getItem(TEAMS) || '');
      if (t && typeof t.zip === 'number') return t;
    } catch (e) { /* keep a fresh tally */ }
    return { zip: 0, frill: 0 };
  }
  function saveTeams(t) { try { localStorage.setItem(TEAMS, JSON.stringify(t)); } catch (e) { /* ignore */ } }

  function paintToggle() {
    const b = document.querySelector('.teachtoggle');
    if (!b) return;
    b.classList.toggle('on', on());
    b.setAttribute('aria-pressed', on() ? 'true' : 'false');
    b.textContent = on() ? 'Smart board on' : 'Smart board';
  }
  function applyClass() {
    document.documentElement.classList.toggle('teach', on());
    document.body.classList.toggle('teach', on());
    document.querySelectorAll('.teachbar').forEach((el) => { el.hidden = !on(); });
    paintToggle();
  }
  function requestFs() {
    const el = document.documentElement;
    if (document.fullscreenElement || !el.requestFullscreen) return;
    el.requestFullscreen().catch(function () { /* the board still scales if full screen is blocked */ });
  }
  function exitFs() {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
  }
  function setOn(v, gesture) {
    settings().teacher = !!v;
    if (v) settings().sfxMute = false;
    IR.save();
    applyClass();
    if (gesture && v) requestFs();
    if (gesture && !v) exitFs();
  }
  function ensureToggle() {
    document.querySelectorAll('.teachtoggle').forEach((el) => el.remove());
  }

  function teamButton(name, key) {
    const b = h('button', { class: 'teampip ' + key, type: 'button' });
    const draw = () => { b.textContent = name + ' ' + teams()[key]; b.setAttribute('aria-label', 'Add one point for ' + name + '. Score ' + teams()[key]); };
    b.addEventListener('click', () => {
      const t = teams();
      t[key] += 1;
      saveTeams(t);
      document.querySelectorAll('.teampip.' + key).forEach((el) => { el.textContent = name + ' ' + t[key]; });
      draw();
    });
    draw();
    return b;
  }
  function showScores() {
    return (location.hash || '').indexOf('#/foundation') !== 0;
  }

  function highlight(stage, info) {
    stage.querySelectorAll('.teachshow').forEach((el) => el.classList.remove('teachshow'));
    let nodes = [];
    if (info.pick) nodes = info.pick(stage) || [];
    else if (info.text != null) {
      const want = String(info.text);
      nodes = [...stage.querySelectorAll('[data-w]')].filter((el) => el.dataset.w === want);
    }
    if (nodes && nodes.classList) nodes = [nodes];
    [...(nodes || [])].forEach((el) => { if (el && el.classList) el.classList.add('teachshow'); });
  }

  IR.teach = {
    on: on,
    toggle: function (force) { setOn(force == null ? !on() : !!force, true); },
    sync: ensureToggle,
    mount: function (ctx, screen) {
      ctx.armReveal = function (text, pick) { ctx._reveal = { text: text, pick: pick || null }; };
      const ans = h('p', { class: 'teachans', hidden: true });
      const reveal = h('button', { class: 'btn big teachreveal', type: 'button' }, 'Reveal answer');
      const next = h('button', { class: 'btn big primary teachnext', type: 'button' }, 'Next', icon('next'));
      const clear = h('button', { class: 'teachclear', type: 'button' }, 'Clear scores');
      reveal.addEventListener('click', () => {
        const info = ctx._reveal;
        if (!info) { ans.hidden = false; ans.textContent = 'Answer is on the board.'; return; }
        ans.hidden = false;
        ans.textContent = 'Answer: ' + info.text;
        highlight(ctx.stage, info);
      });
      next.addEventListener('click', () => {
        IR.Snd.stop();
        if (ctx._stepNext && ctx._stepNext()) return;
        ctx.finish();
      });
      clear.addEventListener('click', () => {
        saveTeams({ zip: 0, frill: 0 });
        screen.querySelectorAll('.teampip.zip').forEach((el) => { el.textContent = 'Zip 0'; });
        screen.querySelectorAll('.teampip.frill').forEach((el) => { el.textContent = 'Frill 0'; });
      });
      const bar = h('div', { class: 'teachbar', hidden: !on() },
        reveal, next, ...(showScores() ? [teamButton('Zip', 'zip'), teamButton('Frill', 'frill'), clear] : []), ans);
      screen.append(bar);
      const prevSet = ctx.setNext.bind(ctx);
      ctx.setNext = function (fn) { ctx._stepNext = fn; prevSet(fn); };
    }
  };

  function boot() {
    if (on()) setOn(false, false);
    else applyClass();
    ensureToggle();
  }
  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);
  window.addEventListener('hashchange', () => setTimeout(ensureToggle, 0));
})();
