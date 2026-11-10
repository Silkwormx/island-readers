/* A blend is ready when every sounded tile is lit. A final silent e is shown, but it is not a sound, so it does not block Blend it. */
function blendSoundsReady(tiles) {
  const sounds = (tiles || []).filter((t) => !t.silent);
  return sounds.length > 0 && sounds.every((t) => !!t.lit);
}
if (typeof window !== 'undefined') window.IR = window.IR || {}, window.IR.blendSoundsReady = blendSoundsReady;
if (typeof module !== 'undefined' && module.exports) module.exports = { blendSoundsReady };
