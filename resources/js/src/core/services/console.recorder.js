/**
 * A rolling buffer of console errors, for bug reports — PRD.md §5.10.
 *
 * ═══ 🔴 THE CAPTURE PATH HAS NO MODEL IN IT, DELIBERATELY ═══════════════════
 * *"A hallucinated selector or route makes a bug report worse than useless."* Every
 * value a ticket carries is read off the browser: the selector from the clicked
 * element, the route from the router, the logs from here. Nothing is inferred.
 *
 * ⚠️ **Installed once at boot, and it never swallows anything.** The original console
 * method is always called through — a recorder that intercepted errors and forgot to
 * re-emit them would blind the devtools of the person debugging the very bug being
 * reported.
 */

const BUFFER_MAX = 50;
const buffer = [];
let installed = false;

/** Errors are serialised at capture time: an Error object does not survive JSON. */
function serialise(args) {
  return Array.prototype.map
    .call(args, (a) => {
      if (a instanceof Error) return a.stack || (a.name + ": " + a.message);
      if (typeof a === "object" && a !== null) {
        try {
          return JSON.stringify(a);
        } catch (e) {
          return "[unserialisable object]";
        }
      }
      return String(a);
    })
    .join(" ");
}

function record(level, args) {
  buffer.push({
    level,
    at: new Date().toISOString(),
    /* Truncated per ENTRY, not across the buffer: one enormous stack trace must not
       push out the twenty short lines that led to it. */
    text: serialise(args).slice(0, 2000),
  });

  while (buffer.length > BUFFER_MAX) buffer.shift();
}

export function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  ["error", "warn"].forEach((level) => {
    const original = window.console[level];
    window.console[level] = function () {
      record(level, arguments);
      return original.apply(window.console, arguments);  // always pass through
    };
  });

  // Uncaught errors and rejected promises never reach console.error in every browser,
  // and they are the ones a bug report most needs.
  window.addEventListener("error", (e) => record("uncaught", [e.message, e.filename + ":" + e.lineno]));
  window.addEventListener("unhandledrejection", (e) => record("unhandled_rejection", [e.reason]));
}

export function entries() {
  return buffer.slice();
}

export function clear() {
  buffer.length = 0;
}

export default { install, entries, clear };
