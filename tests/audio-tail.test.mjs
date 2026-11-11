import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('..', import.meta.url);

function wordClips() {
  const dir = new URL('audio/', root);
  return fs.readdirSync(dir).filter((name) => /^(w_|nk_w_|u51_w_|u53_w_|u6_w_)/.test(name) && name.endsWith('.mp3')).map((name) => path.join(dir.pathname, name));
}

test('every word clip keeps a quiet tail after the last voiced sound', () => {
  const files = wordClips();
  assert.ok(files.length > 100);
  const py = `
import sys, subprocess, array, json
thr = 10 ** (-42 / 20) * 32768
bad = []
for path in sys.argv[1:]:
    raw = subprocess.check_output(['ffmpeg','-v','error','-i',path,'-ac','1','-ar','16000','-f','s16le','-'])
    a = array.array('h'); a.frombytes(raw)
    frame = 160
    last = -1
    for i in range(0, len(a) - frame, frame):
        s = a[i:i+frame]
        rms = (sum(x*x for x in s) / frame) ** 0.5
        if rms > thr:
            last = i
    dur = len(a) / 16000
    tail = dur if last < 0 else dur - (last + frame) / 16000
    if tail < 0.15:
        bad.append(path + ' ' + format(tail, '.3f'))
print(json.dumps(bad))
`;
  const run = spawnSync('python3', ['-c', py, ...files], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (run.status !== 0) throw new Error(run.stderr || 'tail check failed');
  const bad = JSON.parse(run.stdout);
  assert.deepEqual(bad, [], 'word clips missing a trailing silence');
  const rings = files.find((f) => f.endsWith('/u6_w_rings.mp3') || f.endsWith('\\u6_w_rings.mp3'));
  assert.ok(rings, 'rings clip is part of the check');
});
