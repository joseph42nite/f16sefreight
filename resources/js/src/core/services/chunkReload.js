/**
 * A tab opened before a deploy asks for page chunks the deploy removed. Webpack
 * throws a ChunkLoadError and the page goes blank. Loading the page the person was
 * going to fetches the new build — once: a second failure within a minute is a real
 * fault, and reloading again would loop.
 */
const KEY = "fx-chunk-reload-at";
const WINDOW_MS = 60 * 1000;

export function isChunkLoadError(err) {
  return !!err && (err.name === "ChunkLoadError" || /Loading (CSS )?chunk [\w-]+ failed/i.test(err.message || ""));
}

export function reloadOnChunkError(err, targetPath, { storage, location, now = Date.now() }) {
  if (!isChunkLoadError(err)) return false;

  // Storage blocked: with no way to remember the last reload, a reload could loop.
  try {
    if (now - (Number(storage.getItem(KEY)) || 0) < WINDOW_MS) return false;
    storage.setItem(KEY, String(now));
  } catch (e) {
    return false;
  }
  location.assign(targetPath || location.href);
  return true;
}
