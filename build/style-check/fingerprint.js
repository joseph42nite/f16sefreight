// Run in the page. mode "save": remember how every element is styled. mode "compare": report what changed since.
((mode, label = "") => {
  const PROPS = ["display", "position", "color", "background-color", "background-image", "font-family", "font-size", "font-weight", "line-height", "text-align", "text-transform", "letter-spacing", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-color", "border-top-style", "border-top-left-radius", "box-shadow", "opacity", "flex-direction", "justify-content", "align-items", "gap", "float", "overflow-x", "white-space", "text-decoration-line", "vertical-align", "z-index", "cursor", "min-height", "max-width"];
  const path = (el) => { const parts = []; for (let n = el; n && n !== document.body; n = n.parentElement) { const same = [...n.parentElement.children].filter((c) => c.tagName === n.tagName); parts.unshift(n.tagName.toLowerCase() + (same.length > 1 ? ":" + same.indexOf(n) : "")); } return parts.join(">"); };
  const now = {};
  [...document.body.querySelectorAll("*")].slice(0, 6000).forEach((el) => {
    if (["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT"].includes(el.tagName)) return;
    const cs = getComputedStyle(el);
    now[path(el)] = [String(el.getAttribute("class") || ""), PROPS.map((p) => cs.getPropertyValue(p)).join("|")];
  });
  const key = "__style_print__" + location.pathname + (label ? "#" + label : "");
  if (mode === "save") { localStorage.setItem(key, JSON.stringify(now)); return { saved: Object.keys(now).length, page: location.pathname + (label ? "#" + label : "") }; }
  const before = JSON.parse(localStorage.getItem(key) || "null");
  if (!before) return { error: "nothing saved for " + location.pathname };
  const changed = []; let same = 0, gone = 0, classChanged = 0;
  Object.keys(before).forEach((p) => {
    if (!now[p]) { gone += 1; return; }
    if (before[p][0] !== now[p][0]) { classChanged += 1; return; }   // a different element state, not a style change
    if (before[p][1] === now[p][1]) { same += 1; return; }
    const a = before[p][1].split("|"), b = now[p][1].split("|");
    changed.push({ el: p.split(">").slice(-2).join(">"), cls: now[p][0].slice(0, 60), diff: PROPS.map((prop, i) => (a[i] !== b[i] ? prop + ": " + a[i] + " → " + b[i] : null)).filter(Boolean).slice(0, 4) });
  });
  return { page: location.pathname + (label ? "#" + label : ""), same, changedCount: changed.length, notComparable: gone + classChanged, added: Object.keys(now).length - Object.keys(before).length, changed: changed.slice(0, 12) };
})
