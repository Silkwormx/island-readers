import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const root = new URL('..', import.meta.url);

function start(cmd, args, cwd) {
  return spawn(cmd, args, { cwd, stdio: 'ignore' });
}

async function waitFor(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server did not start');
}

test('Units 1-3 phone screens fit slides, equal choices, and the bottom control row', async () => {
  const port = 8794;
  const debug = 9344;
  const server = start('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], root.pathname);
  const chrome = start('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
    '--remote-debugging-port=' + debug, '--user-data-dir=/tmp/chrome-u123-phone', 'about:blank'
  ], root.pathname);
  try {
    await waitFor('http://127.0.0.1:' + port + '/');
    await waitFor('http://127.0.0.1:' + debug + '/json/version');
    const version = await (await fetch('http://127.0.0.1:' + debug + '/json/version')).json();
    const bws = new WebSocket(version.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    const send = (method, params = {}, sessionId) => {
      const msg = { id: ++id, method, params };
      if (sessionId) msg.sessionId = sessionId;
      bws.send(JSON.stringify(msg));
      return new Promise((resolve, reject) => pending.set(msg.id, { resolve, reject }));
    };
    await new Promise((resolve, reject) => { bws.addEventListener('open', resolve); bws.addEventListener('error', reject); });
    bws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id); pending.delete(msg.id);
        if (msg.error) p.reject(new Error(JSON.stringify(msg.error))); else p.resolve(msg.result);
      }
    });
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    const ev = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }, sessionId);
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    const open = async (hash, width, height) => {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true }, sessionId);
      await send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/?phone=' + Date.now() + hash }, sessionId);
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        const ready = await ev(`(() => {
          if (location.hash.indexOf('${hash.slice(1)}') < 0) return false;
          const slide = document.querySelector('.slide-img');
          if (location.hash.indexOf('/teachers/slides/') >= 0) return !!(slide && slide.complete && slide.naturalWidth > 0);
          return !!document.querySelector('.u6step .lesson-nav');
        })()`);
        if (ready) return;
        await new Promise((r) => setTimeout(r, 80));
      }
      throw new Error('page did not settle ' + hash);
    };
    const check = `(() => {
      const vh = window.innerHeight, vw = window.innerWidth;
      const bad = [];
      const inside = (r, name) => {
        if (r.top < -1 || r.left < -1 || r.bottom > vh + 1 || r.right > vw + 1) bad.push(name + ' outside');
      };
      const img = document.querySelector('.slide-img');
      if (img) {
        const fit = getComputedStyle(img).objectFit;
        if (fit !== 'contain') bad.push('slide object-fit ' + fit);
        const r = img.getBoundingClientRect();
        inside(r, 'slide');
        if (r.width < 80 || r.height < 80) bad.push('slide too small');
        const screen = document.querySelector('.slidescreen');
        if (screen && (screen.scrollHeight > screen.clientHeight + 2 || screen.scrollWidth > screen.clientWidth + 2)) bad.push('slide scrolls');
      }
      const choices = [...document.querySelectorAll('.choices > .choice, .wpool > .wtile, .sortbins > .sortbin, .bank > .tile')];
      if (choices.length >= 2) {
        const boxes = choices.map((el) => el.getBoundingClientRect());
        const ws = boxes.map((b) => Math.round(b.width));
        const hs = boxes.map((b) => Math.round(b.height));
        if (Math.max(...ws) - Math.min(...ws) > 2) bad.push('widths ' + ws.join(','));
        if (Math.max(...hs) - Math.min(...hs) > 2) bad.push('heights ' + hs.join(','));
        boxes.forEach((b, i) => {
          if (b.width < 44 || b.height < 44) bad.push('tap ' + i + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
          inside(b, 'choice ' + i);
        });
      }
      const nav = document.querySelector('.u6step .lesson-nav');
      if (nav) {
        const r = nav.getBoundingClientRect();
        inside(r, 'nav');
        const step = document.querySelector('.u6step');
        if (step && step.scrollHeight > step.clientHeight + 2) bad.push('lesson scrolls');
        [...nav.querySelectorAll('button')].forEach((b) => {
          if (b.hidden || !b.getClientRects().length) return;
          const br = b.getBoundingClientRect();
          if (br.height < 44) bad.push('nav short ' + (b.innerText || '').trim().slice(0, 16));
          inside(br, 'nav ' + (b.innerText || '').trim().slice(0, 16));
        });
      }
      return bad;
    })()`;
    const viewports = [[390, 844], [360, 740], [844, 390]];
    const routes = ['#/teachers/slides/u11', '#/teachers/slides/u21', '#/u1/u11/hear', '#/u1/u11/which', '#/u2/u21/hear', '#/u1/u11/read', '#/u1/u11/meet'];
    const found = [];
    for (const [width, height] of viewports) {
      for (const hash of routes) {
        await open(hash, width, height);
        await new Promise((r) => setTimeout(r, 120));
        const bad = await ev(check);
        if (bad.length) found.push(width + 'x' + height + ' ' + hash + ' ' + bad.join('; '));
      }
    }
    bws.close();
    assert.deepEqual(found, []);
  } finally {
    server.kill('SIGTERM');
    chrome.kill('SIGTERM');
  }
});
