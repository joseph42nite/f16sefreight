/**
 * The old theme's stylesheet, cut down to the rules this app can actually use (2026-11-15 frontend audit, FP3).
 *
 * The theme generates whole families of rules in loops — every button in every colour in every state, 4,700
 * spacing and colour helpers — and about three quarters of what it writes styles classes that appear nowhere in
 * the app. All of it was in the stylesheet every page waits for. This is a PostCSS plugin that drops a rule when
 * the classes it needs are written nowhere.
 *
 * 🔴 WHAT "WRITTEN SOMEWHERE" MEANS — the whole safety of this file is here:
 *
 *   1. A word in the app's own source. Every run of letters, digits, "-" and "_" in resources/js/src (pages,
 *      scripts, the theme's own scripts, the layout config) and resources/views counts, wherever it stands: a
 *      class in a template, a string in a script, a value in a list. Generous on purpose.
 *   2. A word in the code of a library the app depends on — package.json "dependencies", and what THOSE depend
 *      on, all the way down (the blog editor is a wrapper around another library, which is the one that writes the
 *      toolbar's classes). BootstrapVue, the alert and editor libraries and the rest write class names at run time.
 *   3. A class a library BUILDS: a prefix it holds as a string ("btn-", "swal2-", "bs-popover-") joined to a word
 *      from 1 or 2. `<b-button variant="light-primary">` becomes `btn-light-primary` inside BootstrapVue and is
 *      written nowhere; "btn-" is in its code and "light-primary" is in ours.
 *   4. A class the APP builds the same way: a prefix our own code holds as a string ending in "-" or "--".
 *      The same for an ENDING a script adds to a base name, ours or a library's: the theme's own scripts turn
 *      "aside" into "aside-on", and BootstrapVue turns "navbar-toggler" into "navbar-toggler-icon".
 *   5. Bootstrap's grid (`col-md-6`, `offset-lg-2`, `order-1`), which BootstrapVue assembles from three pieces.
 *
 * A rule is kept when, for at least one of its comma-separated selectors, EVERY class in it passes. A class
 * inside `:not(...)` is not needed for the rule to match — `.a:not(.b)` matches where there is no `.b` — so it
 * is never a reason to drop one. Selectors
 * with no class at all (elements, attributes, :root) are always kept, and so is everything inside @keyframes
 * and @font-face.
 *
 * ⚠️ What it cannot see: a class name assembled from pieces that are not a prefix plus a word. If a page ever
 * needs such a class from the theme, write the class out in full somewhere in the source (a comment will do) or
 * add it to ALWAYS below. `node build/purge-theme.js --why <class>` says whether a class is kept and why, and
 * `PURGE_THEME=off npx mix` builds the stylesheet whole, to tell whether something that looks wrong is this file's doing.
 *
 * Only the theme's own stylesheet (App.vue) goes through this. Every page's own styles are left alone.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WORD = /[A-Za-z0-9_-]+/g;

/** Classes kept whatever the source says. Empty on purpose; add one only with the reason beside it. */
const ALWAYS = new Set([]);

/** Bootstrap's grid, assembled by BootstrapVue from "col" + "-md" + "-6". */
const GRID = /^(col|offset|order|row-cols)(-(sm|md|lg|xl|xxl))?(-(auto|first|last|\d+))?$/;

/**
 * Classes BootstrapVue assembles from three pieces, so no prefix-plus-word finds them: where a pop-up or tooltip
 * sits (`bs-popover-top`), its colour (`b-tooltip-danger`).
 */
const ASSEMBLED = /^(bs-(popover|tooltip)-(top|bottom|left|right|auto)|b-(popover|tooltip)-[a-z-]+)$/;

/** A screen size between a prefix and its word: `text-sm-right`, `justify-content-md-between`, `d-lg-none`. */
const BREAKPOINT = /^(sm|md|lg|xl)-(.+)$/;

function walk(dir, test, found = []) {
  if (!fs.existsSync(dir)) return found;

  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const file = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // The theme's stylesheets are what is being cut, not evidence of use; its bundled plugin scripts are not loaded.
      if (!/assets[\\/](sass|plugins)$/.test(file) && entry.name !== "node_modules") walk(file, test, found);
    } else if (test.test(entry.name)) {
      found.push(file);
    }
  });

  return found;
}

/** A string a script holds that ends in "-", "--" or "__": the start of a class name it finishes at run time. */
function prefixesIn(text, into) {
  (text.match(/["'`]([A-Za-z][A-Za-z0-9_-]*(?:-|__))(?=["'`$])/g) || []).forEach((m) => {
    const prefix = m.slice(1);

    if (prefix.length >= 3) into.add(prefix);
  });
  // `fx-chip--${status}` inside a longer template string.
  (text.match(/[A-Za-z][A-Za-z0-9_-]*(?:-|__)(?=\$\{)/g) || []).forEach((prefix) => { if (prefix.length >= 3) into.add(prefix); });
}

/** An ending a script adds to a base name: `base + "-on"`, or `"".concat(base, "-icon")` in compiled code. */
function suffixesIn(text, into) {
  (text.match(/\+\s*["'`](-[a-z][a-z0-9-]*)["'`]/g) || []).forEach((m) => into.add(m.replace(/^\+\s*["'`]|["'`]$/g, "")));
  (text.match(/concat\([A-Za-z_$0-9.]+,\s*["'](-[a-z][a-z0-9-]*)["']\)/g) || []).forEach((m) => into.add(m.replace(/^.*["'](-[a-z][a-z0-9-]*)["']\)$/, "$1")));
}

let cached = null;

function evidence() {
  if (cached) return cached;

  const words = new Set();
  const appPrefixes = new Set();
  const libPrefixes = new Set();
  const suffixes = new Set();
  const add = (text) => (text.match(WORD) || []).forEach((w) => words.add(w));

  walk(path.join(ROOT, "resources/js/src"), /\.(vue|js|json)$/).concat(walk(path.join(ROOT, "resources/views"), /\.(php|html)$/))
    .forEach((file) => {
      const text = fs.readFileSync(file, "utf8");

      add(text);
      prefixesIn(text, appPrefixes);
      suffixesIn(text, suffixes);
    });

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

  // Every library that ships: ours, and theirs, all the way down.
  const queue = Object.keys(pkg.dependencies || {});
  const seen = new Set(queue);

  while (queue.length) {
    const name = queue.shift();
    const dir = path.join(ROOT, "node_modules", name);
    let meta;

    try { meta = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")); } catch (e) { continue; }

    Object.keys(meta.dependencies || {}).forEach((dep) => { if (!seen.has(dep)) { seen.add(dep); queue.push(dep); } });

    [meta.main, meta.module, meta.browser, meta.unpkg, meta.jsdelivr].filter((f) => typeof f === "string").forEach((entry) => {
      let file = path.join(dir, entry);

      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.js");
      if (!fs.existsSync(file) && fs.existsSync(file + ".js")) file += ".js";
      if (!fs.existsSync(file) || fs.statSync(file).size > 8 * 1024 * 1024) return;

      const text = fs.readFileSync(file, "utf8");

      add(text);
      prefixesIn(text, libPrefixes);
      suffixesIn(text, suffixes);
    });
  }

  cached = { words, appPrefixes, libPrefixes, suffixes };

  return cached;
}

/** Why a class is kept, or null when nothing in the app could ever put it on an element. */
function reasonFor(cls) {
  const { words, appPrefixes, libPrefixes, suffixes } = evidence();

  if (ALWAYS.has(cls)) return "always";
  if (words.has(cls)) return "written";
  if (GRID.test(cls)) return "grid";
  if (ASSEMBLED.test(cls)) return "BootstrapVue assembles it";

  for (let i = cls.indexOf("-"); i !== -1; i = cls.indexOf("-", i + 1)) {
    // "fx-chip--late": the prefix may end in "--" or "__".
    let cut = i + 1;
    while (cls[cut] === "-" || cls[cut] === "_") cut += 1;

    const prefix = cls.slice(0, cut);
    const rest = cls.slice(cut);

    const sized = BREAKPOINT.exec(rest);
    const word = rest && (words.has(rest) || (sized && words.has(sized[2])));

    if (word) {
      if (libPrefixes.has(prefix)) return `a library builds it: "${prefix}" + "${rest}"`;
      if (appPrefixes.has(prefix)) return `the app builds it: "${prefix}" + "${rest}"`;
    }
  }

  for (const suffix of suffixes) {
    if (cls.endsWith(suffix) && words.has(cls.slice(0, -suffix.length))) return `built from a base name: "${cls.slice(0, -suffix.length)}" + "${suffix}"`;
  }

  return null;
}

const CLASS = /\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g;
const verdicts = new Map();
const alive = (cls) => {
  if (!verdicts.has(cls)) verdicts.set(cls, reasonFor(cls) !== null);

  return verdicts.get(cls);
};

/** The comma-separated selectors of a rule that could match something; "" when none could. */
function keptSelectors(selector) {
  return splitSelectors(selector).filter((part) => {
    // An attribute selector's value is not a class: `[class*="col-"]`, `[href$=".pdf"]`. And what stands inside
    // `:not(...)` is what must be ABSENT, so the rule does not need it to exist.
    const bare = withoutNot(part).replace(/\[[^\]]*\]/g, "");
    const classes = (bare.match(CLASS) || []).map((c) => c.slice(1));

    return classes.every(alive);
  }).join(",");
}

/** The selector with every `:not(...)` taken out, brackets balanced. */
function withoutNot(selector) {
  let out = "";

  for (let i = 0; i < selector.length; i += 1) {
    if (selector.startsWith(":not(", i)) {
      let depth = 0;

      for (i += 4; i < selector.length; i += 1) {
        if (selector[i] === "(") depth += 1;
        if (selector[i] === ")") { depth -= 1; if (depth === 0) break; }
      }
    } else {
      out += selector[i];
    }
  }

  return out;
}

function splitSelectors(selector) {
  const parts = [];
  let depth = 0;
  let current = "";

  for (const ch of selector) {
    if (ch === "(" || ch === "[") depth += 1;
    if (ch === ")" || ch === "]") depth -= 1;
    if (ch === "," && depth === 0) { parts.push(current.trim()); current = ""; } else current += ch;
  }
  if (current.trim()) parts.push(current.trim());

  return parts;
}

/** Only the theme's stylesheet, which is compiled from App.vue. */
const isTheme = (file) => /[\\/]resources[\\/]js[\\/]src[\\/]App\.vue/.test(String(file || ""));

function purge(root) {
  const stats = { rules: 0, removed: 0 };

  root.walkRules((rule) => {
    const parent = rule.parent;

    if (parent && parent.type === "atrule" && /keyframes$/.test(parent.name)) return;

    stats.rules += 1;
    const kept = keptSelectors(rule.selector);

    if (!kept) { rule.remove(); stats.removed += 1; } else if (kept !== rule.selector) rule.selector = kept;
  });

  // An @media or @supports left with nothing in it.
  root.walkAtRules((at) => { if (at.nodes && at.nodes.length === 0) at.remove(); });

  return stats;
}

const plugin = () => ({
  postcssPlugin: "purge-theme",
  Once(root) {
    const file = root.source && root.source.input && root.source.input.file;

    if (process.env.PURGE_THEME_DEBUG) console.error("[purge-theme]", isTheme(file) ? "PURGE" : "leave", file);
    // PURGE_THEME=off builds the stylesheet whole: the way to tell whether something that looks wrong is this file's doing.
    if (isTheme(file) && process.env.PURGE_THEME !== "off") purge(root);
  },
});
plugin.postcss = true;

module.exports = { plugin, purge, evidence, reasonFor, keptSelectors, withoutNot, isTheme };

if (require.main === module) {
  const asked = process.argv[process.argv.indexOf("--why") + 1];

  if (process.argv.includes("--why") && asked) {
    console.log(asked.replace(/^\./, ""), "→", reasonFor(asked.replace(/^\./, "")) || "REMOVED: nothing in the app or its libraries writes or builds it");
  } else {
    const e = evidence();

    console.log("words:", e.words.size, " prefixes the app holds:", e.appPrefixes.size, " prefixes its libraries hold:", e.libPrefixes.size);
  }
}
