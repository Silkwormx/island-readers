/* Sidebar accordion. One panel open in a group. Header toggles, the X closes, Escape closes. */
(function (root) {
  function createSideGroup(doc) {
    const items = [];
    let onKey = null;
    const target = doc || root.document;
    function anyOpen() { return items.some((item) => item.isOpen()); }
    function unbind() {
      if (!target || !onKey) return;
      target.removeEventListener('keydown', onKey);
      onKey = null;
    }
    function bind() {
      if (!target || onKey) return;
      onKey = (e) => {
        if (!e || e.key !== 'Escape' || !anyOpen()) return;
        if (e.preventDefault) e.preventDefault();
        const open = items.filter((item) => item.isOpen());
        open.forEach((item) => item.hide());
        if (open[0] && open[0].focus) open[0].focus();
        unbind();
      };
      target.addEventListener('keydown', onKey);
    }
    return {
      register(item) { items.push(item); },
      open(item) {
        items.forEach((other) => { if (other !== item && other.isOpen()) other.hide(); });
        item.show();
        bind();
      },
      close(item) {
        item.hide();
        if (item.focus) item.focus();
        if (!anyOpen()) unbind();
      },
      destroy() { unbind(); items.length = 0; }
    };
  }
  const groups = new Map();
  function resetSideGroup(name, doc) {
    const prev = groups.get(name);
    if (prev) prev.destroy();
    const group = createSideGroup(doc || root.document);
    groups.set(name, group);
    return group;
  }
  function sideDrop(opts) {
    const IR = root.IR;
    const h = IR.h;
    const name = opts.group || 'page';
    if (!groups.has(name)) resetSideGroup(name, opts.doc);
    const group = groups.get(name);
    const panel = h('div', { class: 'sidedrop-panel', hidden: '' });
    const closeBtn = h('button', { class: 'sidedrop-x', type: 'button', 'aria-label': 'Close' }, IR.icon('close'));
    const body = h('div', { class: 'sidedrop-body' });
    panel.append(h('div', { class: 'sidedrop-bar' }, closeBtn), body);
    if (opts.fill) opts.fill(body);
    const tab = h('button', {
      class: (opts.tabClass || 'hometab') + ' sidedrop-tab',
      type: 'button',
      'aria-expanded': 'false'
    },
      opts.ico ? h('span', { class: 'hometab-ico', 'aria-hidden': 'true' }, IR.icon(opts.ico)) : null,
      h('span', { class: 'hometab-name sidedrop-label' }, opts.label));
    const wrap = h('div', { class: 'sidedrop' + (opts.extraClass ? ' ' + opts.extraClass : '') });
    const item = {
      isOpen() { return !panel.hidden; },
      show() { panel.hidden = false; wrap.classList.add('is-open'); tab.setAttribute('aria-expanded', 'true'); },
      hide() { panel.hidden = true; wrap.classList.remove('is-open'); tab.setAttribute('aria-expanded', 'false'); },
      focus() { tab.focus(); }
    };
    group.register(item);
    tab.addEventListener('click', () => { if (item.isOpen()) group.close(item); else group.open(item); });
    closeBtn.addEventListener('click', () => group.close(item));
    wrap.append(tab, panel);
    return wrap;
  }
  root.IR = root.IR || {};
  root.IR.createSideGroup = createSideGroup;
  root.IR.resetSideGroup = resetSideGroup;
  root.IR.sideDrop = sideDrop;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createSideGroup: createSideGroup };
})(typeof window !== 'undefined' ? window : globalThis);
