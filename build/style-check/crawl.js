// Run in the page: visit each path through the app's own router and save or compare its styles.
(async (mode, paths, wait = 2500) => {
  const f = eval(await (await fetch("/__fp.js")).text());
  const host = [...document.querySelectorAll("*")].find((e) => e.__vue__);
  const router = host.__vue__.$root.$router;
  const out = [];
  for (const p of paths) {
    await router.push(p).catch(() => {});
    await new Promise((r) => setTimeout(r, wait));
    if (location.pathname !== p) { out.push({ page: p, skipped: "landed on " + location.pathname }); continue; }
    const r = f(mode);
    out.push(mode === "save" ? r : { page: r.page, same: r.same, changedCount: r.changedCount, notComparable: r.notComparable, changed: (r.changed || []).slice(0, 5), error: r.error });
  }
  return out;
})
