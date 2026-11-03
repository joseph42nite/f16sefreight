"""Writes index.html (+ terms/captions compositions) for Ep 03: one 3D port world in Three.js.

Run: python3 build/build3d.py   (after record.py has written vo2/timing.json)

"Why did my container cost money for sitting still?" The camera travels along one quay:
quay (the box lands, sits ten days, the bill) -> yard (borrowed, free time, demurrage, the daily fee)
-> gate (the catch: out it goes) -> warehouse (unload, the second clock: detention) -> split (inside vs
outside) -> back to the quay (someone else's cargo; the box goes back on a ship) -> avoid (papers, free
days, return on time) -> sum (moving vs stopped) -> storage (part two) -> the quay again, the ship sails.
Every move is keyed to a spoken word (vo2/timing.json). Helpers and overlays follow Ep 02.
"""
import json
import os

import build as B   # word times, TERMS, captions are shared
from build import BS, W

ROOT = B.ROOT
TOTAL = B.TOTAL


def spread(a, b, n):
    return [round(a + (b - a) * i / max(1, n - 1), 2) for i in range(n)]


TT = {
    "lands": W(1, "time") - 0.6, "furn": W(1, "furniture"),
    "sits": W(2, "sits"), "days2": W(2, "days", end=True), "paper": W(2, "paper"), "bill": W(2, "bill"),
    "thousand2": W(2, "thousand"), "lakh2": W(2, "lakh"), "never": W(2, "never"), "moved": W(2, "moved"),
    "why3": W(3, "why"), "explain": W(3, "explain"),
    "own": BS(4) - 0.25, "yours": W(4, "yours"), "belongs": W(4, "belongs"), "shipping4": W(4, "shipping"), "borrow": W(4, "borrow"),
    "yard": BS(5) - 0.2, "free5": W(5, "free", 2), "five": W(5, "five"),
    "clock6": W(6, "clock"), "dem6": W(6, "demurrage"),
    "hundred7": W(7, "hundred"), "nine7": W(7, "nine"), "rises": W(7, "rises"),
    "gate": BS(8) - 0.25, "catch": W(8, "catch"), "getting": W(8, "getting"), "end8": W(8, "end"),
    "wh": BS(9) - 0.25, "warehouse9": W(9, "warehouse"), "unload": W(9, "unload"), "empty9": W(9, "empty"),
    "second": W(9, "second"),
    "det10": W(10, "detention"), "outside10": W(10, "outside"),
    "split": BS(11) - 0.25, "dem11": W(11, "demurrage"), "det11": W(11, "detention"),
    "ret": BS(12) - 0.25, "carry": W(12, "carry"), "cargo12": W(12, "cargo"), "pushes": W(12, "pushes"), "return12": W(12, "return"),
    "avoid": BS(13) - 0.25, "papers": W(13, "papers"), "arrives": W(13, "arrives"), "clears": W(13, "clears"),
    "ask": W(13, "ask"), "extra13": W(13, "extra"), "book": W(13, "book"), "return13": W(13, "return"), "time13": W(13, "time"),
    "sum": BS(14) - 0.25, "freight": W(14, "freight"), "dem14": W(14, "demurrage"), "stops": W(14, "stops"),
    "store": BS(15) - 0.25, "storage": W(15, "storage"), "part": W(15, "part"),
    "end": BS(16) - 0.25, "watch": W(16, "watch"), "more": W(16, "more"), "f16": W(16, "f-six"), "total": TOTAL,
}
TT = {k: round(v, 2) for k, v in TT.items()}
DAYS_HOOK = spread(TT["sits"] - 0.1, TT["days2"] + 0.2, 10)                       # the counter flips 1 -> 10
DAYS_YARD = spread(TT["free5"] - 0.05, TT["five"] + 0.2, 5) + [TT["clock6"]] + spread(TT["dem6"] + 0.6, TT["rises"] + 0.2, 4)
DAYS_DET = [round(TT["second"] + 1.1 * i, 2) for i in range(7)]                    # detention day 1, 2, ...

# Pinned tags: (id, html, class, show, hide). Positions follow 3D objects (PINS in the JS). show <= 0: on screen at frame 0.
TAGS = [
    ("t-furn", "Furniture · 20 ft", "tag solid", 0, TT["sits"] - 0.2),
    ("t-never", "Never moved", "stampt", TT["never"] + 0.1, TT["own"] - 0.3),
    ("t-borrow", "Borrowed", "tag solid", TT["borrow"] - 0.05, TT["yard"] - 0.2),
    ("t-rate", '<div class="pt-eye">Demurrage</div><div class="pt-big">≈ $100 / day</div><div id="t-rate-inr" class="pt-small">≈ ₹9,000</div>', "tag price", TT["hundred7"] - 0.1, TT["rises"] - 0.1),
    ("t-rises", "Rises over time ↑", "tag solid", TT["rises"] - 0.05, TT["gate"] - 0.3),
    ("t-outside", "Outside the port", "tag solid", TT["outside10"] - 0.05, TT["split"] - 0.3),
    ("t-in", '<div class="pt-eye">Demurrage</div><div class="pt-big">Full box</div><div class="pt-small">inside the port</div>', "tag price", TT["dem11"] - 0.05, TT["ret"] - 0.3),
    ("t-ex", '<div class="pt-eye">Detention</div><div class="pt-big">Empty box</div><div class="pt-small">outside, not returned</div>', "tag price", TT["det11"] - 0.05, TT["ret"] - 0.3),
    ("t-else", "Someone else's cargo", "tag solid", TT["cargo12"] - 0.1, TT["avoid"] - 0.3),
    ("t-clear", "Cleared", "stampt", TT["clears"], TT["ask"] - 0.3),
    ("t-book", "Ask when you book", "tag solid", TT["book"] - 0.1, TT["return13"] - 0.3),
    ("t-back", "✓", "tick", TT["time13"] - 0.05, TT["sum"] - 0.3),
    ("t-moves", "Freight: it moves", "tag solid", TT["dem14"] - 0.05, TT["store"] - 0.3),
    ("t-stops", "Demurrage + detention: it stops", "tag", TT["stops"] - 0.4, TT["store"] - 0.3),
    ("t-store", "Storage fee?", "tag solid", TT["storage"] - 0.05, TT["end"] - 0.3),
    ("t-tick", "✓", "tick", TT["watch"] + 0.1, TT["more"] - 0.3),
]

JS = r"""
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/+esm";
const TT = __TT__;
const DAYS_HOOK = __DH__, DAYS_YARD = __DY__, DAYS_DET = __DD__;
const C = { ink: 0x263238, slate: 0x455A64, slate2: 0x37474F, grey: 0xE0E0E0, grey2: 0xEBEBEB, grey3: 0xDBDBDB, white: 0xFAFAFA,
            blue: 0x407BFF, lblue: 0x81A8FF, brand: 0x355594, peach: 0xFFBF9D, coral: 0xFF9A6C, sky: 0xF0F7FF, haze: 0xD0E6F8, gold: 0xFFD27F };
const Wd = 1080, Hd = 1920;
const SX = { quay: 0, yard: 80, gate: 160, wh: 210, split: 290, avoid: 370, sum: 450, store: 520 };

const canvas = document.getElementById("gl");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(Wd, Hd, false);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xFFE6D6, 80, 210);
const camera = new THREE.PerspectiveCamera(46, Wd / Hd, 0.1, 500);
scene.add(new THREE.HemisphereLight(0xFFFFFF, 0xE8D8CF, 1.6));
const sun = new THREE.DirectionalLight(0xFFE7D6, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 1, far: 140 });
sun.shadow.bias = -0.0005;
scene.add(sun, sun.target);

// ── helpers ─────────────────────────────────────────────────────────────────
const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...extra });
const add = (geo, m, x, y, z, parent = scene) => {
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};
const outline = (mesh, color = C.ink) => {
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), new THREE.LineBasicMaterial({ color })));
  return mesh;
};
const group = (x, y = 0, z = 0, parent = scene) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
function paintable(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  let key = null;
  const paint = (state) => {
    const k = JSON.stringify(state);
    if (k === key) return;
    key = k; draw(c.getContext("2d"), state, w, h); tex.needsUpdate = true;
  };
  paint({});
  return { tex, paint };
}
const tex = (w, h, draw) => paintable(w, h, (g, s, W, H) => draw(g, W, H)).tex;
const font = (g, size, weight = 800) => (g.font = `${weight} ${size}px Inter, sans-serif`);
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const ease = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const out = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const back = (x) => { x = clamp01(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const bounce = (x) => { x = clamp01(x); const n = 7.5625, d = 2.75;
  if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; };
const lerp = (a, b, k) => a + (b - a) * k;
const span = (t, a, d) => clamp01((t - a) / d);
const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const S0 = (k) => Math.max(0.0001, k);          // a scale that never hits zero
const count = (t, times) => times.filter((x) => t >= x).length;
const pin = (parent, x, y, z) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); return o; };

// ── reusable models ─────────────────────────────────────────────────────────
// a 20 ft container: 6.1 long (x), 2.6 high, 2.44 deep; doors at the -x end; ribbed sides, "ZZ LINE" on the side
const CL = 6.1, CH = 2.6, CD = 2.44;
const ribs = (hex, dark, label) => tex(1024, 440, (g, W, H) => {
  g.fillStyle = hex; g.fillRect(0, 0, W, H); g.fillStyle = dark;
  for (let x = 14; x < W; x += 34) g.fillRect(x, 0, 12, H);
  g.fillRect(0, 0, W, 16); g.fillRect(0, H - 16, W, 16);
  if (label) { g.fillStyle = "#FFFFFF"; g.fillRect(50, 46, 330, 92); g.fillStyle = "#263238"; font(g, 64, 900); g.fillText(label, 70, 116); }
});
const doorsTex = (hex, dark) => tex(440, 440, (g, W, H) => {
  g.fillStyle = hex; g.fillRect(0, 0, W, H); g.fillStyle = dark; g.fillRect(W / 2 - 4, 0, 8, H);
  for (const x of [70, 160, 280, 370]) g.fillRect(x - 6, 20, 12, H - 40);
  g.fillStyle = "#263238"; for (const x of [110, 330]) g.fillRect(x - 18, H / 2 - 8, 36, 16);
});
const BOXCOL = { coral: ["#FF9A6C", "#E8865A"], slate: ["#455A64", "#37474F"], grey: ["#E0E0E0", "#C9C9C9"], blue: ["#407BFF", "#3567D8"], peach: ["#FFBF9D", "#EFA982"], white: ["#F5F5F5", "#DDDDDD"] };
const boxMats = {};
function boxMat(name, label) {
  const k = name + (label || "");
  if (!boxMats[k]) {
    const [hex, dark] = BOXCOL[name];
    const side = new THREE.MeshStandardMaterial({ map: ribs(hex, dark, label), roughness: 0.8 });
    const plain = new THREE.MeshStandardMaterial({ map: ribs(hex, dark, null), roughness: 0.8 });
    const end = new THREE.MeshStandardMaterial({ map: doorsTex(hex, dark), roughness: 0.8 });
    const top = mat(parseInt(dark.slice(1), 16));
    boxMats[k] = [plain, end, top, top, side, side];   // +x, -x (doors), +y, -y, +z, -z
  }
  return boxMats[k];
}
// the hero box (coral, ZZ LINE) and its counter panel; counter: a paintable on the +z side
function counterPaint() {
  return paintable(512, 300, (g, s, W, H) => {
    g.clearRect(0, 0, W, H);
    if (!s.mode) return;
    const col = { day: "#263238", free: "#407BFF", dem: "#FF9A6C", det: "#FF9A6C", back: "#407BFF" }[s.mode];
    const head = { day: "AT THE PORT", free: "FREE TIME", dem: "DEMURRAGE", det: "DETENTION", back: "RETURNED" }[s.mode];
    g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H); g.fillStyle = col; g.fillRect(0, 0, W, 86);
    g.fillStyle = "#fff"; font(g, 52, 900); g.textAlign = "center"; g.fillText(head, W / 2, 62);
    g.fillStyle = "#263238"; font(g, 150, 900);
    g.fillText(s.mode === "back" ? "✓" : `DAY ${s.n}`, W / 2, 245);
    g.strokeStyle = "#263238"; g.lineWidth = 14; g.strokeRect(7, 7, W - 14, H - 14);
  });
}
function container(parent, x, y, z, color = "coral", opts = {}) {
  const g = group(x, y, z, parent);
  if (opts.ry) g.rotation.y = opts.ry;
  const body = outline(add(new THREE.BoxGeometry(CL, CH, CD), boxMat(color, opts.label), 0, CH / 2, 0, g));
  g.userData = { body };
  if (opts.counter) {
    const cp = counterPaint();
    const m = add(new THREE.PlaneGeometry(2.3, 1.35), new THREE.MeshStandardMaterial({ map: cp.tex, transparent: true, roughness: 0.6 }), 1.3, 1.6, CD / 2 + 0.02, g);
    m.castShadow = false;
    g.userData.counter = cp; g.userData.counterMesh = m;
  }
  if (opts.doors) {               // two door leaves on the -x end that can swing open
    const leaves = [-1, 1].map((sgn) => {
      const h = group(-CL / 2 - 0.02, 0, sgn * CD / 2, g);
      outline(add(new THREE.BoxGeometry(0.06, CH - 0.1, CD / 2), mat(parseInt(BOXCOL[color][1].slice(1), 16)), 0, CH / 2, -sgn * CD / 4, h));
      return [h, sgn];
    });
    g.userData.leaves = leaves;
  }
  return g;
}
const openDoors = (c, k) => { for (const [h, sgn] of c.userData.leaves) h.rotation.y = sgn * 1.9 * k; };
// a ship: hull along x, bridge at the stern (-x), containers on deck; `slot` is the empty top of one bay (local)
function ship(parent, x, z, s = 1, light = false) {
  const sh = group(x, 0, z, parent); sh.scale.setScalar(s);
  const hull = new THREE.Shape();
  hull.moveTo(-22, -4.5); hull.lineTo(17, -4.5); hull.lineTo(23, 0); hull.lineTo(17, 4.5); hull.lineTo(-22, 4.5); hull.lineTo(-22, -4.5);
  const hg = new THREE.ExtrudeGeometry(hull, { depth: 4.2, bevelEnabled: false }); hg.rotateX(-Math.PI / 2); hg.translate(0, -1.7, 0);
  outline(add(hg, mat(C.slate2), 0, 0, 0, sh));
  const bg = new THREE.ExtrudeGeometry(hull, { depth: 0.6, bevelEnabled: false }); bg.rotateX(-Math.PI / 2); bg.scale(1.002, 1, 1.01); bg.translate(0, -1.3, 0);
  add(bg, mat(C.coral), 0, 0, 0, sh);
  const br = group(-18.5, 2.5, 0, sh);
  outline(add(new THREE.BoxGeometry(5, 8, 8), mat(0xF5F5F5), 0, 4, 0, br));
  outline(add(new THREE.BoxGeometry(5.6, 0.5, 9.2), mat(C.slate2), 0, 8.2, 0, br));
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.05, 0.7, 6.6), mat(C.ink), 2.52, 6.8 - i * 1.6, 0, br);
  add(new THREE.CylinderGeometry(0.7, 0.8, 3, 10), mat(C.coral), -1, 10, 0, br);
  if (light) return sh;
  const names = ["coral", "slate", "grey", "blue", "peach", "white", "slate", "grey"];
  let k = 0;
  for (const bx of [-12.9, -6.6, -0.3, 6.0, 12.3]) for (const bz of [-2.6, 0, 2.6]) {
    const tiers = bx === 6.0 ? 1 : 1 + Math.floor(hash(k * 3.1) * 3);
    for (let tr = 0; tr < tiers; tr++) add(new THREE.BoxGeometry(CL, CH, CD), boxMat(names[Math.floor(hash(k * 7.7 + tr) * names.length)]), bx, 2.5 + CH / 2 + tr * CH, bz, sh);
    k++;
  }
  sh.userData.slot = new THREE.Vector3(6.0, 2.5 + CH, 0);
  return sh;
}
function person(parent, x, z, ry = 0) {
  const p = group(x, 0, z, parent); p.rotation.y = ry;
  for (const px of [-0.22, 0.22]) add(new THREE.CylinderGeometry(0.17, 0.17, 1.6, 8), mat(C.ink), px, 0.8, 0, p);
  add(new THREE.CapsuleGeometry(0.55, 1.1, 4, 10), mat(C.blue), 0, 2.25, 0, p);
  add(new THREE.SphereGeometry(0.42, 14, 10), mat(C.peach), 0, 3.45, 0, p);
  add(new THREE.CylinderGeometry(0.45, 0.45, 0.18, 14), mat(C.ink), 0, 3.75, 0, p);
  return p;
}
// a truck with a container chassis: cab at +x; `box` rides on the chassis
function rig(parent, x, z, ry = 0, color = "coral", opts = {}) {
  const r = group(x, 0, z, parent); r.rotation.y = ry;
  outline(add(new THREE.BoxGeometry(7.0, 0.35, 2.3), mat(C.ink), -0.8, 1.05, 0, r));
  outline(add(new THREE.BoxGeometry(2.2, 2.6, 2.5), mat(C.blue), 3.9, 1.9, 0, r));
  add(new THREE.BoxGeometry(0.06, 1.0, 2.1), mat(C.lblue), 5.01, 2.45, 0, r);
  for (const [wx, wz] of [[-3.4, -1.15], [-3.4, 1.15], [-2.4, -1.15], [-2.4, 1.15], [2.0, -1.15], [2.0, 1.15], [4.1, -1.15], [4.1, 1.15]])
    add(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 12), mat(C.ink), wx, 0.5, wz, r).rotation.x = Math.PI / 2;
  r.userData.box = color ? container(r, -0.9, 1.22, 0, color, opts) : null;
  return r;
}
const cratesTex = (hex) => tex(256, 256, (g) => { g.fillStyle = hex; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#263238"; g.lineWidth = 12; g.strokeRect(6, 6, 244, 244);
  g.beginPath(); g.moveTo(6, 6); g.lineTo(250, 250); g.moveTo(250, 6); g.lineTo(6, 250); g.stroke(); });
const crateMat = new THREE.MeshStandardMaterial({ map: cratesTex("#FFBF9D"), roughness: 0.85 });
const cartonTex = tex(256, 256, (g) => { g.fillStyle = "#FAFAFA"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#407BFF"; g.fillRect(113, 0, 30, 256); });
const cartonMat = new THREE.MeshStandardMaterial({ map: cartonTex, roughness: 0.85 });
function chair(parent, s = 1) {   // a little armchair: seat, back, arms
  const c = group(0, 0, 0, parent); c.scale.setScalar(s);
  outline(add(new THREE.BoxGeometry(1.0, 0.45, 0.9), mat(C.peach), 0, 0.35, 0, c));
  outline(add(new THREE.BoxGeometry(1.0, 0.8, 0.22), mat(C.peach), 0, 0.85, -0.34, c));
  for (const ax of [-0.45, 0.45]) outline(add(new THREE.BoxGeometry(0.16, 0.42, 0.9), mat(0xEFA982), ax, 0.72, 0, c));
  return c;
}
function shed(parent, x, z, w, h, d, label, sub) {
  const g = group(x, 0, z, parent);
  outline(add(new THREE.BoxGeometry(w, h, d), mat(0xF5F5F5), 0, h / 2, 0, g));
  outline(add(new THREE.BoxGeometry(w + 0.8, 0.6, d + 0.8), mat(C.slate2), 0, h + 0.3, 0, g));
  add(new THREE.PlaneGeometry(w * 0.34, h * 0.62), mat(C.slate2), 0, h * 0.31, d / 2 + 0.02, g);
  const sign = tex(768, 192, (q) => { q.fillStyle = "#355594"; q.fillRect(0, 0, 768, 192); q.fillStyle = "#fff"; font(q, 84); q.textAlign = "center"; q.fillText(label, 384, sub ? 100 : 128);
    if (sub) { font(q, 44, 700); q.fillStyle = "#FFBF9D"; q.fillText(sub, 384, 165); } });
  add(new THREE.PlaneGeometry(w * 0.6, w * 0.15), new THREE.MeshStandardMaterial({ map: sign }), 0, h * 0.8, d / 2 + 0.03, g);
  return g;
}
// a ship-to-shore crane over the quay edge; trolley runs along z on the boom
function crane(parent, x, light = false) {
  const g = group(x, 0, 0, parent);
  const legM = mat(C.peach);
  for (const lx of [-4, 4]) for (const lz of [-6, 4]) outline(add(new THREE.BoxGeometry(0.7, 15, 0.7), legM, lx, 7.5, lz, g));
  for (const lz of [-6, 4]) outline(add(new THREE.BoxGeometry(8.7, 0.8, 0.8), legM, 0, 15, lz, g));
  for (const lx of [-4, 4]) outline(add(new THREE.BoxGeometry(0.6, 0.6, 10.6), legM, lx, 6, -1, g));
  outline(add(new THREE.BoxGeometry(2.2, 1.2, 36), mat(C.ink), 0, 16.2, -9, g)).castShadow = false;
  outline(add(new THREE.BoxGeometry(3.4, 2.6, 3.2), mat(C.slate), 0, 18, 6, g));
  if (light) return g;
  const trolley = outline(add(new THREE.BoxGeometry(2.6, 0.8, 1.8), mat(C.coral), 0, 15.4, 0, g));
  const cable = add(new THREE.CylinderGeometry(0.06, 0.06, 1, 6), mat(C.ink), 0, 0, 0, g); cable.castShadow = false;
  const spreader = outline(add(new THREE.BoxGeometry(CL, 0.25, CD), mat(C.gold), 0, 0, 0, g));
  g.userData = { trolley, cable, spreader };
  return g;
}
// hang the spreader at world height y over local (0, z); returns nothing
function hang(cr, z, y, on = true) {
  const { trolley, cable, spreader } = cr.userData;
  trolley.position.z = z;
  spreader.visible = cable.visible = on;
  const top = 15.0, bot = y + 0.12;
  cable.position.set(0, (top + bot) / 2, z); cable.scale.y = Math.max(0.01, top - bot);
  spreader.position.set(0, y, z);
}
function fenceRun(parent, x0, x1, z, h = 2.6) {
  for (let x = x0; x <= x1 + 0.01; x += 2) add(new THREE.CylinderGeometry(0.08, 0.08, h, 6), mat(C.slate), x, h / 2, z, parent);
  for (const y of [0.6, h - 0.2]) add(new THREE.BoxGeometry(x1 - x0, 0.08, 0.08), mat(C.slate), (x0 + x1) / 2, y, z, parent);
  const mesh = add(new THREE.PlaneGeometry(x1 - x0, h - 0.4), mat(C.slate, { transparent: true, opacity: 0.18, side: THREE.DoubleSide }), (x0 + x1) / 2, h / 2, z, parent);
  mesh.castShadow = false;
}

// ── the ground: concrete quay in front, water behind ────────────────────────
add(new THREE.PlaneGeometry(2000, 120), mat(C.grey2), 300, 0, 53).rotation.x = -Math.PI / 2;
const water = add(new THREE.PlaneGeometry(2000, 300), mat(C.haze), 300, -1.2, -157); water.rotation.x = -Math.PI / 2; water.castShadow = false;
outline(add(new THREE.BoxGeometry(2000, 1.2, 0.6), mat(C.grey3), 300, -0.6, -7.3));
add(new THREE.PlaneGeometry(2000, 0.3), mat(C.gold), 300, 0.02, -6.4).rotation.x = -Math.PI / 2;
for (let x = -150; x < 750; x += 14) add(new THREE.CylinderGeometry(0.3, 0.38, 0.6, 10), mat(C.ink), x, 0.3, -6.8);
const waves = [];
for (let i = 0; i < 140; i++) { const w = add(new THREE.PlaneGeometry(2.4 + hash(i) * 2, 0.22), mat(C.lblue), -120 + hash(i + 7) * 760, -1.15, -10 - hash(i + 3) * 60); w.rotation.x = -Math.PI / 2; w.castShadow = false; waves.push(w); }
for (let i = 0; i < 44; i++) {                      // a pale city across the water
  const h = 6 + hash(i) * 14, w = 6 + hash(i + 9) * 8;
  add(new THREE.BoxGeometry(w, h, 6), mat(C.haze), -80 + i * 20, h / 2 - 1.2, -95 - hash(i + 3) * 20);
}
for (const cx of [-38, 46, 122, 250, 335, 410, 488, 560]) crane(scene, cx, true);
for (const [sx, sz] of [[60, -26], [330, -30], [600, -28]]) ship(scene, sx, sz, 0.8, false);

// ── 1-3, 12, 16 quay: the ship, the crane, the hero box, the bill ──────────
const qy = group(SX.quay);
const qShip = ship(qy, 0, -14);
const qCrane = crane(qy, 4);
const hero = container(qy, 4, 0, 0, "coral", { label: "ZZ LINE", counter: true });
const heroCnt = hero.userData.counter;
for (const [sx, sz, nm] of [[-9, 0, "slate"], [-9, 2.9, "grey"], [-16, 0, "blue"], [-16, 2.9, "peach"]]) {
  container(qy, sx, 0, sz, nm); container(qy, sx, CH, sz, nm === "slate" ? "white" : "slate");
}
const papers = [];
for (let i = 0; i < 14; i++) { const p = outline(add(new THREE.BoxGeometry(1.2, 0.12, 0.9), mat(0xFFFFFF), 8.7 + (hash(i) - 0.5) * 0.12, 0.06 + i * 0.13, 2.3, qy)); p.rotation.y = (hash(i + 4) - 0.5) * 0.3; papers.push(p); }
const qCrates = group(-3.5, 0, 3.5, qy);
for (let i = 0; i < 9; i++) outline(add(new THREE.BoxGeometry(1.1, 1.1, 1.1), i % 3 ? crateMat : cartonMat, (i % 3) * 1.2 - 1.2, 0.55 + Math.floor(i / 3) * 0 + (i >= 6 ? 1.1 : 0), Math.floor(i / 3) % 2 * 1.2, qCrates));
const qRig = rig(qy, 34, 0, 0, null);
const pinHero = pin(hero, 0, CH + 1.0, 0);
const pinCrates = pin(qCrates, 0, 3.2, 0.6);
const pinPapers = pin(qy, 8.7, 2.6, 2.3);

// ── 4-7 yard: borrowed; free time; demurrage day by day ─────────────────────
const yd = group(SX.yard);
const yBox = container(yd, 0, 0, 0, "coral", { label: "ZZ LINE", counter: true, ry: 0.45 });
const yLogo = add(new THREE.PlaneGeometry(2.1, 0.62), mat(0xFFFFFF, { emissive: 0xFFE6D6, emissiveIntensity: 0 }), -2.0, 2.05, CD / 2 + 0.03, yBox);
yLogo.castShadow = false;
const yLogoTex = tex(512, 152, (g) => { g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 512, 152); g.fillStyle = "#263238"; font(g, 100, 900); g.fillText("ZZ LINE", 30, 118); });
yLogo.material.map = yLogoTex; yLogo.material.color.setHex(0xFFFFFF);
const keyTag = group(-CL / 2 - 0.1, 1.5, 0.5, yBox);
add(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), mat(C.ink), 0, -0.3, 0, keyTag);
outline(add(new THREE.BoxGeometry(0.06, 0.55, 0.4), mat(C.coral), 0, -0.85, 0, keyTag));
const board = paintable(1440, 360, (g, s, W, H) => {
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#263238"; font(g, 56, 900); g.textAlign = "left"; g.fillText("DAYS AT THE PORT", 40, 72);
  for (let i = 0; i < 12; i++) {
    const x = 40 + i * 114, y = 110, lit = (s.n || 0) > i, free = i < 5;
    g.fillStyle = lit ? (free ? "#407BFF" : "#FF9A6C") : "#EBEBEB"; g.fillRect(x, y, 100, 200);
    g.fillStyle = lit ? "#FFFFFF" : "#9AA5AB"; font(g, 64, 900); g.textAlign = "center"; g.fillText(String(i + 1), x + 50, y + 100);
    if (lit) { font(g, 34, 800); g.fillText(free ? "FREE" : "$", x + 50, y + 165); }
  }
  g.strokeStyle = "#263238"; g.lineWidth = 14; g.strokeRect(7, 7, W - 14, H - 14);
});
const yBoard = group(0, 0, -3.2, yd);
for (const px of [-5, 5]) add(new THREE.CylinderGeometry(0.12, 0.12, 4.4, 8), mat(C.ink), px, 1.9, -0.1, yBoard);
add(new THREE.PlaneGeometry(11, 2.75), new THREE.MeshStandardMaterial({ map: board.tex, roughness: 0.7 }), 0, 3.9, 0, yBoard);
const coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.14, 18), coinMat = mat(C.gold);
const stacks = [0, 1, 2, 3, 4].map((i) => {
  const st = group(-2.8 + i * 1.4, 0, 3.4, yd);
  const n = 2 + i * 2;                              // later days cost more: taller stacks
  const coins = [];
  for (let c = 0; c < n; c++) { const m = outline(add(coinGeo, coinMat, 0, 0.07 + c * 0.15, 0, st)); coins.push(m); }
  st.userData = { coins, n };
  return st;
});
const pinYTop = pin(yd, 0, 4.2, 1.2);
const pinYDoor = pin(yBox, -CL / 2 - 0.2, 1.4, 0.5);   // on the door, clear of the term card
const pinCoins = pin(yd, 0, 2.6, 3.4);
const pinRise = pin(yd, 2.8, 2.9, 3.4);

// ── 8 gate: the barrier lifts, the box leaves the port ──────────────────────
const gt = group(SX.gate);
fenceRun(gt, -24, -4, 4); fenceRun(gt, 4, 24, 4);
outline(add(new THREE.BoxGeometry(2.4, 3.0, 2.4), mat(0xF5F5F5), 6, 1.5, 6.2, gt));
outline(add(new THREE.BoxGeometry(2.8, 0.3, 2.8), mat(C.slate2), 6, 3.15, 6.2, gt));
const arm = group(-4, 1.3, 4.3, gt);
outline(add(new THREE.BoxGeometry(0.5, 1.3, 0.5), mat(C.ink), 0, -0.65, 0, gt)).position.set(-4, 0.65, 4.3);
for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(2, 0.28, 0.2), mat(i % 2 ? 0xFFFFFF : C.coral), 1 + i * 2, 0, 0, arm);
const exitSign = tex(768, 192, (q) => { q.fillStyle = "#263238"; q.fillRect(0, 0, 768, 192); q.fillStyle = "#fff"; font(q, 96); q.textAlign = "center"; q.fillText("PORT EXIT", 384, 130); });
for (const px of [-5, 5]) add(new THREE.BoxGeometry(0.4, 6, 0.4), mat(C.ink), px, 3.0, 4, gt);
add(new THREE.PlaneGeometry(8, 2), new THREE.MeshStandardMaterial({ map: exitSign }), 0, 5.2, 4.05, gt);
for (const [sx, sz, nm] of [[-12, -4, "grey"], [-12, -1, "blue"], [12, -4, "slate"], [12, -1, "peach"]]) { container(gt, sx, 0, sz, nm); container(gt, sx, CH, sz, "white"); }
add(new THREE.PlaneGeometry(9, 60), mat(C.slate), 0, 0.015, 24).rotation.x = -Math.PI / 2;
const gRig = rig(gt, 0, -4, -Math.PI / 2, "coral", { label: "ZZ LINE" });

// ── 9-10 warehouse: unload; the second clock ────────────────────────────────
const wh = group(SX.wh);
shed(wh, -1, -6.5, 14, 7, 8, "YOUR WAREHOUSE");
const wRig = rig(wh, 4.8, 1.2, 0, "coral", { label: "ZZ LINE", counter: true, doors: true });
const wBox = wRig.userData.box;
const worker = person(wh, -0.6, 3.4, 0);
const carried = chair(worker, 0.9); carried.position.set(0, 2.2, 0.75);
const inside = [0, 1, 2].map((i) => { const c = chair(wh, 0.9); c.position.set(-5.0 + i * 1.3, 0, -1.6); return c; });
const pinWBox = pin(wBox, 0, CH + 0.5, 0);           // just above the roof, clear of the term card

// ── 11 split: full box inside the port fence vs empty box at the warehouse ──
const sp = group(SX.split);
const pen = group(-5, 0, 0, sp);
fenceRun(pen, -2.6, 2.6, 4.4, 2.2); fenceRun(pen, -2.6, 2.6, -4.4, 2.2);
const penSide = (x) => { const s = group(x, 0, 0, pen); s.rotation.y = Math.PI / 2; fenceRun(s, -4.4, 4.4, 0, 2.2); };
penSide(-2.6); penSide(2.6);
const sIn = container(pen, 0, 0, 0, "coral", { label: "ZZ LINE", ry: Math.PI / 2 });
const sInCrate = outline(add(new THREE.BoxGeometry(1.4, 1.4, 1.4), crateMat, 0, CH + 0.7, 0, pen));
shed(sp, 6.6, -5.5, 6, 4.5, 5, "WAREHOUSE");
const sEx = container(sp, 5, 0, 0.6, "coral", { label: "ZZ LINE", ry: Math.PI / 2 });
const pinIn = pin(pen, 0, CH + 3.4, 0);
const pinEx = pin(sp, 5, CH + 1.4, 0.6);

// ── 13 avoid: papers first; extra free days; return on time ─────────────────
const av = group(SX.avoid);
for (const px of [-7, 0, 7]) outline(add(new THREE.BoxGeometry(4.2, 0.6, 4.2), mat(C.slate), px, 0.3, 0, av));
const folder = group(-7, 1.9, 0.4, av);
outline(add(new THREE.BoxGeometry(2.0, 0.25, 2.6), mat(C.coral), 0, 0.12, 0, folder));
const folderTex = tex(400, 520, (g) => { g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 400, 520); g.fillStyle = "#355594"; g.fillRect(0, 0, 400, 90); g.fillStyle = "#fff"; font(g, 52); g.fillText("PAPERS", 30, 64);
  g.fillStyle = "#DBDBDB"; for (const y of [150, 220, 290, 360]) g.fillRect(30, y, 260, 26); g.fillStyle = "#407BFF"; for (const y of [150, 220, 290, 360]) g.fillRect(320, y - 6, 40, 40); });
const fPaper = add(new THREE.PlaneGeometry(1.7, 2.2), new THREE.MeshStandardMaterial({ map: folderTex }), 0, 0.27, 0, folder); fPaper.rotation.x = -Math.PI / 2;
folder.rotation.x = 0;
const avWater = add(new THREE.PlaneGeometry(14, 3), mat(C.lblue, { transparent: true, opacity: 0.55 }), -7, 0.02, -4.2, av); avWater.rotation.x = -Math.PI / 2; avWater.castShadow = false;
const avShip = ship(av, -12, -4.2, 0.14);
const cal = paintable(512, 560, (g, s, W, H) => {
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H); g.fillStyle = "#FF9A6C"; g.fillRect(0, 0, W, 110);
  g.fillStyle = "#fff"; font(g, 56, 900); g.textAlign = "center"; g.fillText("FREE DAYS", W / 2, 76);
  g.fillStyle = "#263238"; font(g, 240, 900); g.fillText(s.more ? "8" : "5", W / 2, 360);
  if (s.more) { g.fillStyle = "#407BFF"; font(g, 80, 900); g.fillText("+3", W / 2, 480); }
  g.strokeStyle = "#263238"; g.lineWidth = 14; g.strokeRect(7, 7, W - 14, H - 14);
});
const calG = group(0, 0.6, 0, av);
add(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8), mat(C.ink), 0, 1.1, -0.2, calG);
outline(add(new THREE.BoxGeometry(2.6, 2.84, 0.12), [mat(C.white), mat(C.white), mat(C.white), mat(C.white), new THREE.MeshStandardMaterial({ map: cal.tex }), mat(C.white)], 0, 2.9, 0, calG));
const avGate = group(7, 0.6, 0, av);
for (const px of [-2.0, 2.0]) add(new THREE.BoxGeometry(0.25, 3.2, 0.25), mat(C.ink), 0, 1.6, px, avGate);
add(new THREE.BoxGeometry(0.3, 0.3, 4.3), mat(C.ink), 0, 3.2, 0, avGate);
const avRig = rig(av, 3, 0, 0, "coral", { label: "ZZ LINE" }); avRig.scale.setScalar(0.5); avRig.position.y = 0.6;
const pinFolder = pin(av, -7, 1.5, 1.4);   // on the papers' face, clear of the term card
const pinCal = pin(av, 0, 5.4, 0);
const pinAvGate = pin(av, 7, 4.7, 0);

// ── 14 sum: moving vs stopped ───────────────────────────────────────────────
const sm = group(SX.sum);
const smWater = add(new THREE.PlaneGeometry(13, 5), mat(C.lblue, { transparent: true, opacity: 0.55 }), -2, 0.02, -5, sm); smWater.rotation.x = -Math.PI / 2; smWater.castShadow = false;
const smWaves = [0, 1, 2, 3, 4, 5].map((i) => { const w = add(new THREE.PlaneGeometry(1.4, 0.16), mat(0xFFFFFF), -2, 0.04, -6.8 + (i % 3) * 1.6, sm); w.rotation.x = -Math.PI / 2; w.castShadow = false; return w; });
const smShip = ship(sm, -1.6, -5, 0.24, true);
const smBox = container(smShip, 2, 2.5 / 1, 0, "coral", { label: "ZZ LINE" }); smBox.scale.setScalar(2.6); smBox.position.set(0, 2.5, 0);
const smStop = container(sm, 1.6, 0, 4.2, "coral", { label: "ZZ LINE", counter: true, ry: -0.2 });
const pinMove = pin(sm, -1.6, 5.2, -5);
const pinStop = pin(sm, 1.6, CH + 0.5, 4.2);

// ── 15 storage: the port's own shed (part two) ──────────────────────────────
const st = group(SX.store);
const stShed = shed(st, 0, -3, 12, 6.5, 8, "PORT STORAGE");
for (let i = 0; i < 6; i++) outline(add(new THREE.BoxGeometry(1.1, 1.1, 1.1), i % 2 ? crateMat : cartonMat, -1.2 + (i % 3) * 1.2, 0.55 + Math.floor(i / 3) * 1.1, 1.6, st));
const pinStore = pin(st, 0, 7.4, -1);

// ── pins: HTML tags that follow 3D objects ──────────────────────────────────
const PINS = [
  ["t-furn", pinHero, 0], ["t-never", pinHero, 0.6], ["t-borrow", pinYDoor, 0],
  ["t-rate", pinCoins, 0], ["t-rises", pinRise, 0], ["t-outside", pinWBox, 0],
  ["t-in", pinIn, 0], ["t-ex", pinEx, 0], ["t-else", pinCrates, 0], ["t-clear", pinFolder, 0], ["t-book", pinCal, 0],
  ["t-back", pinAvGate, 0], ["t-moves", pinMove, 0], ["t-stops", pinStop, 0], ["t-store", pinStore, 0], ["t-tick", pinHero, 0],
].map(([id, obj, dy]) => [document.getElementById(id), obj, dy]);
const v3 = new THREE.Vector3();
function pinAll() {
  for (const [el, obj, dy] of PINS) {
    obj.getWorldPosition(v3); v3.y += dy; v3.project(camera);
    const off = v3.z > 1 || Math.abs(v3.x) > 1.4 || Math.abs(v3.y) > 1.4;
    el.style.display = off ? "none" : "block";
    // keep every tag inside the frame: 40 px from the sides, below the series bar, above the captions
    const x = (v3.x * 0.5 + 0.5) * Wd - el.offsetWidth / 2, y = (-v3.y * 0.5 + 0.5) * Hd - el.offsetHeight;
    el.style.left = `${Math.min(Math.max(x, 40), Wd - 40 - el.offsetWidth)}px`;
    el.style.top = `${Math.min(Math.max(y, 300), 1170 - el.offsetHeight)}px`;
  }
}

// ── the camera path: one key per beat, flights between stations ─────────────
const P = (x, y, z) => new THREE.Vector3(x, y, z);
const HOOK = [P(4.5, 7.5, 34), P(3.5, 7.2, -6)], HOOK2 = [P(4.8, 7.2, 32.5), P(3.5, 7.2, -6)];
const PUSH = [P(7, 3.8, 14), P(4.6, 1.8, 0)];
const K = [
  [0, ...HOOK],
  [TT.lands, ...HOOK2],
  [TT.sits - 0.2, P(9, 5.5, 22), P(4.2, 2.6, -1)],
  [TT.bill - 0.3, ...PUSH],
  [TT.why3 - 0.2, P(7, 3.7, 13.4), P(4.6, 1.8, 0)],
  [TT.explain + 0.1, P(14, 7.5, 28), P(3, 4.5, -3)],
  [TT.own + 0.45, P(SX.yard - 6.5, 3.6, 11), P(SX.yard - 2.4, 1.6, 0.6)],
  [TT.yard - 0.35, P(SX.yard - 6.2, 3.5, 10.4), P(SX.yard - 2.4, 1.6, 0.6)],
  [TT.yard + 0.55, P(SX.yard, 5.6, 24), P(SX.yard, 3.0, 0)],
  [TT.gate - 0.45, P(SX.yard + 0.3, 5.4, 22.5), P(SX.yard, 3.0, 0)],
  [TT.gate + 0.45, P(SX.gate + 1, 8, 33), P(SX.gate, 4, 0)],
  [TT.wh - 0.45, P(SX.gate + 1.4, 7.8, 32), P(SX.gate, 4, 0)],
  [TT.wh + 0.45, P(SX.wh + 1.5, 7, 35), P(SX.wh + 1.5, 3, -1)],
  [TT.split - 0.45, P(SX.wh + 2, 6.8, 33.5), P(SX.wh + 1.5, 3, -1)],
  [TT.split + 0.45, P(SX.split, 9.5, 31), P(SX.split, 2.6, -0.5)],
  [TT.ret - 0.45, P(SX.split + 0.4, 9.2, 30), P(SX.split, 2.6, -0.5)],
  [TT.ret + 0.45, P(5.5, 8, 33), P(3, 6.6, -5)],
  [TT.avoid - 0.45, P(6, 7.8, 32), P(3, 6.6, -5)],
  [TT.avoid + 0.45, P(SX.avoid - 7, 4.6, 15), P(SX.avoid - 7, 2.0, -1)],
  [TT.ask - 0.4, P(SX.avoid - 6.6, 4.4, 14.4), P(SX.avoid - 7, 2.0, -1)],
  [TT.ask + 0.3, P(SX.avoid, 4.4, 14), P(SX.avoid, 2.9, 0)],
  [TT.return13 - 0.4, P(SX.avoid + 0.3, 4.3, 13.6), P(SX.avoid, 2.9, 0)],
  [TT.return13 + 0.3, P(SX.avoid + 7.6, 4.8, 16), P(SX.avoid + 7.6, 2.2, 0)],
  [TT.sum - 0.45, P(SX.avoid + 7.9, 4.6, 15.5), P(SX.avoid + 7.6, 2.2, 0)],
  [TT.sum + 0.45, P(SX.sum, 7, 29), P(SX.sum, 2.6, -0.5)],
  [TT.store - 0.45, P(SX.sum + 0.4, 6.8, 28), P(SX.sum, 2.6, -0.5)],
  [TT.store + 0.45, P(SX.store, 6, 24), P(SX.store, 3.2, 0)],
  [TT.end - 0.45, P(SX.store + 0.4, 5.8, 23), P(SX.store, 3.2, 0)],
  [TT.end + 0.75, ...HOOK],
  [TT.total, ...HOOK2],
];
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
function cameraAt(t) {
  let i = 0;
  while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const [t0, p0, l0] = K[i], [t1, p1, l1] = K[i + 1];
  const k = ease((t - t0) / Math.max(0.001, t1 - t0));
  camPos.copy(p0).lerp(p1, k); camLook.copy(l0).lerp(l1, k);
  camLook.y -= 0.08 * camPos.distanceTo(camLook);           // aim lower: the action sits above the captions
  const far = p0.distanceTo(p1);
  if (far > 20) camPos.y += Math.sin(Math.PI * k) * Math.min(18, far * 0.12);   // swoop over long flights
  camera.position.copy(camPos); camera.lookAt(camLook); camera.updateMatrixWorld();
  sun.target.position.copy(camLook); sun.position.copy(camLook).add(new THREE.Vector3(-18, 26, 14));
}

// ── the frame at time t ─────────────────────────────────────────────────────
const SLOT = qShip.userData.slot;               // local to the ship
function renderAt(t) {
  waves.forEach((w, i) => { w.position.x = -120 + ((hash(i + 7) * 760 + t * (0.6 + hash(i) * 0.6)) % 760); });

  // quay, opening: the crane lowers the box from the ship onto the quay (z -12 -> 0)
  const low = ease(span(t, 0.25, TT.lands - 0.25));
  const sail = ease(span(t, TT.watch + 0.4, 6.0));
  qShip.position.x = -sail * 30;
  let hx = 4, hy, hz, hooked = true;
  const r0 = TT.cargo12 + 0.2, r1 = TT.return12 - 0.35;                     // the empty box comes back on a truck, then is lifted
  const lift = span(t, r1, 2.0);
  if (t < r0) {
    hy = lerp(6.5, 0, low) + Math.sin(Math.PI * low) * 1.2; hz = lerp(-11, 0, ease(span(low, 0, 0.8)));
    hooked = low < 1;
  } else if (lift <= 0) {
    hy = 1.22; hz = 0; hx = lerp(34, 4, out(span(t, r0, 1.1))); hooked = false;
  } else {
    const up = ease(span(lift, 0, 0.35)), across = ease(span(lift, 0.25, 0.45)), down = ease(span(lift, 0.65, 0.35));
    const top = 8.5, land = SLOT.y;
    hy = lerp(lerp(1.22, top, up), land, down); hz = lerp(0, -14 + SLOT.z, across);
    hx = 4; hooked = lift < 1;
  }
  if (t >= r1 + 2.0) { hx = SLOT.x + qShip.position.x; hy = SLOT.y; hz = -14 + SLOT.z; }
  hero.position.set(hx, hy, hz);
  hero.visible = t < TT.own || t >= r0;
  qRig.position.x = t < r0 ? 60 : lerp(34, 4, out(span(t, r0, 1.1))) + 0.9 + (t > r1 + 0.8 ? out(span(t, r1 + 0.8, 1.2)) * 40 : 0);
  qRig.visible = t >= r0 && t < r1 + 2.2;
  if (hooked) hang(qCrane, hz, hy + CH, true); else hang(qCrane, t < r0 ? 0 : hz, 12, false);
  if (!hooked && t >= r0 && lift <= 0) hang(qCrane, 0, 9, true);
  const nh = count(t, DAYS_HOOK);
  heroCnt.paint(t >= r0 ? { mode: "back" } : nh ? { mode: "day", n: nh } : {});
  hero.userData.counterMesh.visible = (nh > 0 && t < TT.own) || t >= r0;
  papers.forEach((p, i) => { const k = span(t, TT.paper - 0.3 + i * 0.07, 0.25); p.visible = k > 0 && t < TT.own; p.position.y = 0.06 + i * 0.13 + (1 - out(k)) * 1.5; });
  qCrates.visible = t >= TT.ret;
  qCrates.scale.setScalar(S0(back(span(t, TT.carry - 0.4, 0.5))));

  // yard: logo plate glows on "shipping"; the key tag swings; the board fills day by day; coins stack up
  yLogo.material.emissiveIntensity = t >= TT.shipping4 - 0.05 && t < TT.yard ? 0.6 + 0.3 * Math.sin(t * 8) : 0;
  keyTag.rotation.x = Math.sin((t - TT.borrow) * 6) * 0.35 * Math.exp(-Math.max(0, t - TT.borrow) * 1.2);
  keyTag.visible = t >= TT.borrow - 0.1;
  const ny = count(t, DAYS_YARD);
  board.paint({ n: ny });
  yBoard.scale.setScalar(S0(back(span(t, TT.yard - 0.2, 0.5))));
  yBox.userData.counter.paint(ny ? { mode: ny > 5 ? "dem" : "free", n: ny } : {});
  yBox.userData.counterMesh.visible = ny > 0;
  stacks.forEach((s, i) => {
    const day = DAYS_YARD[5 + i];
    s.userData.coins.forEach((c, j) => { const k = bounce(span(t, day - 0.05 + j * 0.05, 0.35)); c.visible = t >= day - 0.05 + j * 0.05; c.position.y = 0.07 + j * 0.15 + (1 - k) * 3; });
  });

  // gate: the barrier lifts; the truck drives out through the gate
  arm.rotation.z = 1.35 * ease(span(t, TT.getting - 0.3, 0.6));
  gRig.position.z = lerp(-4, 14, ease(span(t, TT.getting + 0.1, 2.6)));

  // warehouse: doors open; the worker carries three chairs in; the second clock
  openDoors(wBox, ease(span(t, TT.wh + 0.3, 0.6)));
  const c0 = TT.warehouse9 - 0.1, trip = Math.max(0.9, (TT.second - c0) / 3);
  const nt = Math.floor(clamp01((t - c0) / (trip * 3)) * 3 - 1e-6);
  const ph = ((t - c0) / trip) % 1;
  if (t < c0) { worker.position.set(-0.6, 0, 3.4); carried.visible = false; }
  else if (t >= c0 + trip * 3) { worker.position.set(-0.6, 0, 3.4); carried.visible = false; worker.rotation.y = 0; }
  else {
    const go = ph < 0.5, k = go ? ease(ph / 0.5) : ease((ph - 0.5) / 0.5);
    worker.position.set(lerp(-0.6, -2.4, go ? k : 1 - k), Math.abs(Math.sin(ph * Math.PI * 4)) * 0.12, go ? lerp(3.4, -1.8, k) : lerp(-1.8, 3.4, k));
    worker.rotation.y = go ? Math.PI : 0; carried.visible = go;
  }
  inside.forEach((c, i) => { c.visible = t >= c0 + trip * (i + 0.5); });
  const nd = count(t, DAYS_DET);
  wBox.userData.counter.paint(nd ? { mode: "det", n: nd } : {});
  wBox.userData.counterMesh.visible = nd > 0;
  wBox.userData.counterMesh.scale.setScalar(S0(back(span(t, TT.second - 0.1, 0.4))));

  // split: a pulse on each side as it is named
  sIn.scale.setScalar(1 + 0.06 * Math.sin(Math.PI * span(t, TT.dem11 - 0.1, 0.5)));
  sEx.scale.setScalar(1 + 0.06 * Math.sin(Math.PI * span(t, TT.det11 - 0.1, 0.5)));
  sInCrate.visible = true;

  // avoid: the folder flips up; the little ship arrives; the calendar gains 3 days; the box goes back through the gate
  folder.rotation.x = lerp(0, 1.25, back(span(t, TT.papers - 0.2, 0.5)));
  avShip.position.x = lerp(-14, -6.5, ease(span(t, TT.arrives - 0.6, 1.0)));
  cal.paint({ more: t >= TT.extra13 });
  calG.scale.setScalar(1 + 0.08 * Math.sin(Math.PI * span(t, TT.extra13 - 0.05, 0.4)));
  avRig.position.x = lerp(4.0, 8.6, ease(span(t, TT.return13 - 0.1, 1.4)));

  // sum: the ship bobs and the water slides; the stopped box's meter runs
  smShip.position.y = Math.sin(t * 2.2) * 0.08; smShip.rotation.z = Math.sin(t * 1.7) * 0.02;
  smWaves.forEach((w, i) => { w.position.x = -2 + 5.5 - ((t * 1.6 + i * 1.3) % 11); });
  smStop.userData.counter.paint(t >= TT.dem14 - 0.2 ? { mode: "dem", n: 14 + Math.floor(Math.max(0, t - TT.dem14) * 1.5) } : {});
  smStop.userData.counterMesh.visible = t >= TT.dem14 - 0.2;

  cameraAt(t);
  renderer.render(scene, camera);
  pinAll();
}
window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
renderAt(window.__hfThreeTime || 0);
"""


def gsap_js():
    lines = []
    for tid, _, _, show, hide in TAGS:
        if show <= 0:
            lines.append(f'      tl.set("#{tid}", {{ opacity: 1 }}, 0);')
        else:
            lines.append(f'      tl.fromTo("#{tid}", {{ opacity: 0, scale: 0.7 }}, {{ opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2)" }}, {round(show, 2)});')
        lines.append(f'      tl.to("#{tid}", {{ opacity: 0, duration: 0.18 }}, {round(hide, 2)});')
    t = TT
    lines += [
        f'      tl.fromTo("#phone", {{ y: 1700 }}, {{ y: 0, duration: 0.5, ease: "expo.out" }}, {round(t["bill"] - 0.45, 2)});',
        f'      tl.fromTo("#dots", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.1 }}, {round(t["bill"] + 0.05, 2)});',
        f'      tl.fromTo(".dot", {{ y: 0 }}, {{ y: -10, duration: 0.15, yoyo: true, repeat: 3, stagger: 0.08, ease: "sine.inOut" }}, {round(t["bill"] + 0.05, 2)});',
        f'      tl.to("#dots", {{ opacity: 0, duration: 0.05 }}, {round(t["thousand2"] - 0.3, 2)});',
        f'      tl.fromTo("#msg", {{ opacity: 0, scale: 0.85, transformOrigin: "0% 100%" }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }}, {round(t["thousand2"] - 0.3, 2)});',
        f'      tl.fromTo("#msg-inr", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, {round(t["lakh2"] - 0.2, 2)});',
        f'      tl.to("#phone", {{ y: 1800, duration: 0.4, ease: "power3.in" }}, {round(t["never"] - 0.25, 2)});',
        f'      tl.fromTo("#p2card", {{ scale: 0.6, opacity: 0, rotation: -8 }}, {{ scale: 1, opacity: 1, rotation: -3, duration: 0.5, ease: "back.out(2)" }}, {round(t["part"] - 0.15, 2)});',
        f'      tl.to("#p2card", {{ opacity: 0, duration: 0.25 }}, {round(t["end"] - 0.2, 2)});',
        f'      tl.fromTo("#endcard", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4, ease: "power2.out" }}, {round(t["more"] - 0.3, 2)});',
        f'      tl.fromTo("#e-logo", {{ clipPath: "inset(0 100% 0 0)" }}, {{ clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.inOut" }}, {round(t["more"] - 0.15, 2)});',
        f'      tl.fromTo("#e-line", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.25 }}, {round(t["more"] + 0.4, 2)});',
        f'      tl.fromTo("#e-cta", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }}, {round(t["f16"] - 0.3, 2)});',
        f'      tl.to("#series", {{ opacity: 0, duration: 0.3 }}, {round(t["more"] - 0.3, 2)});',
    ]
    return "\n".join(lines)


def sfx():
    t = TT
    fx = [
        (0.3, "typing", 0.12, 0.8), (t["lands"] + 0.45, "click-soft", 0.3),
        *[(d + 0.02, ("click-soft", "key-press")[i % 2], 0.16) for i, d in enumerate(DAYS_HOOK[1::2])],
        (t["paper"] - 0.2, "whoosh-short", 0.14),
        (t["bill"] - 0.45, "whoosh-short", 0.2), (t["thousand2"] - 0.3, "pop", 0.25), (t["never"] + 0.15, "pop", 0.25),
        *[(t[k] - 0.45, "whoosh", 0.22) for k in ("gate", "wh", "split", "ret", "avoid", "sum", "store", "end")],
        (t["own"] - 0.2, "whoosh", 0.22), (t["yard"] - 0.15, "whoosh-short", 0.18),
        (t["shipping4"] + 0.25, "click-soft", 0.22), (t["belongs"] + 0.1, "pop", 0.2), (t["borrow"] + 0.2, "key-press", 0.22),
        *[(d + 0.03, ("click-soft", "key-press")[i % 2], 0.22) for i, d in enumerate(DAYS_YARD)],
        (t["hundred7"] - 0.15, "pop", 0.2), (t["rises"] + 0.15, "pop", 0.2),
        (t["catch"] + 0.55, "impact-bass-1", 0.16), (t["getting"] - 0.25, "typing", 0.14, 0.5), (t["getting"] + 0.3, "whoosh-short", 0.18),
        (t["wh"] + 0.35, "click-soft", 0.22), (t["warehouse9"] + 0.2, "key-press", 0.18), (t["unload"] + 0.2, "click-soft", 0.18),
        *[(d + 0.03, ("key-press", "click-soft")[i % 2], 0.2) for i, d in enumerate(DAYS_DET[:5])],
        (t["outside10"] + 0.1, "pop", 0.2), (t["dem11"] + 0.15, "pop", 0.22), (t["det11"] + 0.15, "pop", 0.22),
        (t["carry"] - 0.35, "pop", 0.2), (t["cargo12"] + 0.25, "whoosh-short", 0.16), (t["return12"] - 0.3, "typing", 0.14, 0.7),
        (t["papers"] - 0.15, "whoosh-short", 0.16), (t["arrives"] - 0.4, "whoosh-short", 0.14), (t["clears"] + 0.1, "pop", 0.25),
        (t["extra13"] + 0.05, "click-soft", 0.25), (t["book"] + 0.1, "pop", 0.2), (t["return13"] + 0.1, "whoosh-short", 0.16), (t["time13"] + 0.05, "pop", 0.22),
        (t["freight"] + 0.2, "pop", 0.2), (t["stops"] - 0.3, "pop", 0.2), (t["dem14"] + 0.1, "typing", 0.12, 0.8),
        (t["storage"] + 0.15, "pop", 0.2), (t["part"] - 0.1, "whoosh-short", 0.2),
        (t["end"] + 0.7, "whoosh-short", 0.16), (t["watch"] + 0.15, "pop", 0.25),
        (t["more"] - 0.15, "whoosh-short", 0.22), (t["f16"] - 0.2, "pop", 0.28),
        *[(s + 0.02, "click-soft", 0.18) for k, s, *_ in B.TERMS if s > 0],
    ]
    fx.sort(key=lambda e: e[0])
    return "\n".join(
        f'      <audio id="sfx-{i}" class="clip" src="assets/audio/sfx/{e[1]}.mp3" data-start="{round(e[0], 2)}" '
        f'data-duration="{e[3] if len(e) > 3 else B.DUR[e[1]]}" data-track-index="{5 + i % 6}" data-volume="{e[2]}"></audio>'
        for i, e in enumerate(fx))


def index():
    tags = "\n".join(f'      <div id="{tid}" class="{cls}" data-layout-ignore>{html}</div>' for tid, html, cls, *_ in TAGS)
    js = JS.replace("__TT__", json.dumps(TT)).replace("__DH__", json.dumps(DAYS_HOOK)).replace("__DY__", json.dumps(DAYS_YARD)).replace("__DD__", json.dumps(DAYS_DET))
    return f"""<!doctype html>
<html lang="en" data-resolution="portrait"
  data-composition-variables='[{{"id":"cta","type":"string","label":"End card URL","default":"f16sefreight.com"}}]'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <!-- generated by build/build3d.py: edit there, then rerun -->
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: #F0F7FF; }}
      #root {{ position: absolute; inset: 0; font-family: "Inter", sans-serif;
              background: linear-gradient(180deg, #DCEBFF 0%, #F0F7FF 32%, #FFE6D6 50%, #FFD6BE 58%); }}
      #gl {{ position: absolute; inset: 0; width: 1080px; height: 1920px; display: block; }}
      .tag {{ position: absolute; padding: 10px 22px; border-radius: 14px; background: #FFFFFF; border: 4px solid #263238; color: #263238;
             font-weight: 800; font-size: 30px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap;
             box-shadow: 0 12px 24px rgba(38,50,56,.18); opacity: 0; }}
      .tag.solid {{ background: #263238; color: #FFFFFF; }}
      .tag.price {{ text-transform: none; letter-spacing: 0; text-align: center; padding: 14px 24px; }}
      .pt-eye {{ font-weight: 700; font-size: 28px; letter-spacing: .12em; text-transform: uppercase; color: #5A6B8A; }}
      .pt-big {{ font-weight: 800; font-size: 50px; line-height: 1.05; color: #263238; }}
      .pt-small {{ font-weight: 700; font-size: 30px; color: #355594; }}
      .stampt {{ position: absolute; padding: 0 22px; border: 8px solid #263238; border-radius: 12px; background: #FFFFFF; color: #263238;
                font-weight: 900; font-size: 72px; letter-spacing: .06em; opacity: 0; transform: rotate(-6deg); }}
      .tick {{ position: absolute; width: 90px; height: 90px; border-radius: 50%; background: #407BFF; color: #fff; font-size: 56px; font-weight: 900;
              display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 24px rgba(38,50,56,.2); opacity: 0; }}
      #series {{ position: absolute; left: 70px; right: 70px; top: 250px; display: flex; justify-content: space-between; z-index: 30;
                font-weight: 800; font-size: 28px; letter-spacing: .12em; text-transform: uppercase; color: #263238; opacity: .7; }}
      #phone {{ position: absolute; left: 250px; top: 330px; width: 580px; height: 800px; border-radius: 72px; background: #263238; padding: 18px;
               box-shadow: 0 40px 80px rgba(38,50,56,.35); z-index: 20; }}
      #p2card {{ position: absolute; left: 240px; top: 560px; width: 600px; height: 220px; border-radius: 40px; background: #263238; color: #fff; z-index: 20;
                display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 30px 60px rgba(38,50,56,.3); opacity: 0; }}
      #endcard {{ position: absolute; inset: 0; background: #F0F7FF; z-index: 60; opacity: 0; display: flex; flex-direction: column; align-items: center;
                 justify-content: center; gap: 56px; padding-bottom: 330px; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
      <canvas id="gl" width="1080" height="1920" data-layout-ignore></canvas>
{tags}
      <div id="series"><span>Cargo, explained · 03</span><span>f16sefreight.com</span></div>
      <div id="phone">
        <div style="width:100%;height:100%;border-radius:56px;background:#fff;position:relative;overflow:hidden">
          <div style="height:150px;background:#F0F7FF;display:flex;align-items:center;gap:22px;padding:30px 34px 0">
            <div style="width:84px;height:84px;border-radius:50%;background:#FF9A6C;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:34px;color:#263238">ZZ</div>
            <div><div style="font-weight:800;font-size:38px;color:#263238">ZZ Line</div><div style="font-weight:500;font-size:28px;color:#5A6B8A">Shipping line · invoice</div></div></div>
          <div style="position:absolute;left:30px;top:190px;max-width:470px;padding:24px 30px;border-radius:30px 30px 30px 8px;background:#F0F7FF;font-weight:600;font-size:34px;color:#263238">Your container sat 10 days at the port.</div>
          <div id="dots" style="position:absolute;left:30px;top:370px;width:140px;height:80px;border-radius:30px 30px 30px 8px;background:#F0F7FF;display:flex;align-items:center;justify-content:center;gap:14px">
            <div class="dot" style="width:16px;height:16px;border-radius:50%;background:#5A6B8A"></div><div class="dot" style="width:16px;height:16px;border-radius:50%;background:#5A6B8A"></div><div class="dot" style="width:16px;height:16px;border-radius:50%;background:#5A6B8A"></div></div>
          <div id="msg" style="position:absolute;left:30px;top:370px;width:470px;padding:26px 32px;border-radius:30px 30px 30px 8px;background:#FF9A6C;color:#263238">
            <div style="font-weight:700;font-size:28px;letter-spacing:.1em;text-transform:uppercase">Amount due</div>
            <div style="font-weight:900;font-size:72px;line-height:1.1">≈ $1,000</div>
            <div id="msg-inr" style="font-weight:800;font-size:40px">≈ ₹88,000</div></div>
          <div style="position:absolute;left:30px;right:30px;bottom:40px;height:96px;border-radius:48px;background:#263238;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:36px">Pay now</div>
        </div>
      </div>
      <div id="p2card"><div style="font-weight:900;font-size:110px;line-height:1">Part 2</div><div style="font-weight:700;font-size:34px;color:#FFBF9D;margin-top:8px">coming soon</div></div>
      <div id="endcard">
        <img id="e-logo" src="assets/img/blue-logo.png" alt="F16s" style="width:680px" />
        <div id="e-line" style="font-weight:700;font-size:46px;color:#263238;text-align:center;line-height:1.3">Smart e-Freight for<br>freight forwarders</div>
        <div id="e-cta" style="display:inline-flex;align-items:center;background:#355594;border-radius:999px;padding:26px 26px 26px 56px;box-shadow:0 20px 50px rgba(53,85,148,.2)">
          <span data-var-text="cta" style="color:#fff;font-weight:700;font-size:44px">f16sefreight.com</span>
          <span style="margin-left:30px;width:72px;height:72px;border-radius:50%;background:#fff;color:#355594;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800">→</span></div>
      </div>
      <div id="terms" data-composition-id="terms" data-composition-src="compositions/terms.html" data-start="0" data-duration="{TOTAL}" data-track-index="3" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:40"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{TOTAL}" data-track-index="4" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:50"></div>
      <audio id="narration" class="clip" src="assets/audio/narration.wav" data-start="0" data-duration="{TOTAL}" data-track-index="12" data-volume="1"></audio>
{sfx()}
    </div>
    <script type="module">
{js}
    </script>
    <script>
      const tl = gsap.timeline({{ paused: true }});
{gsap_js()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""


if __name__ == "__main__":
    comp = os.path.join(ROOT, "compositions")
    os.makedirs(comp, exist_ok=True)
    for f in os.listdir(comp):
        if f.endswith(".html"):
            os.remove(os.path.join(comp, f))
    open(os.path.join(comp, "terms.html"), "w").write(B.terms_comp())
    open(os.path.join(comp, "captions.html"), "w").write(B.captions())
    open(os.path.join(ROOT, "index.html"), "w").write(index())
    print(f"wrote 3D index.html + terms + captions, {TOTAL} s")
