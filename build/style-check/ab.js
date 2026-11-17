// Run in the page: the SAME state styled with the whole stylesheet, then with the purged one; report differences.
(async (label) => {
  const f = eval(await (await fetch("/__fp.js")).text());
  const link = [...document.querySelectorAll('link[rel="stylesheet"]')].find((l) => /\/css\/app\.css|__app\.before\.css/.test(l.href));
  const swap = (href) => new Promise((resolve) => { link.onload = () => setTimeout(resolve, 250); link.onerror = () => resolve(); link.href = href; });
  await swap("/__app.before.css?x=" + Date.now());
  const saved = f("save", "ab-" + label);
  await swap("/css/app.css?x=" + Date.now());
  const r = f("compare", "ab-" + label);
  return { state: label, elements: saved.saved, same: r.same, changedCount: r.changedCount, notComparable: r.notComparable, changed: (r.changed || []).slice(0, 8) };
})
