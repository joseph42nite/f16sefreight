"""Writes index.html (+ terms/captions compositions) for the reel, v4: one 3D world in Three.js.

Run: python3 build/build3d.py   (after build/record.py has written vo2/timing.json)

The film is a single Three.js scene the camera flies through, station by station:
shop -> map -> tarmac -> the waybill on the box -> the scale -> the SDR basket -> the money ->
the delay -> the deadlines -> protection -> part 2 -> back to the shop. Every move is keyed to a
spoken word (vo2/timing.json). HTML on top: tags pinned to 3D objects, the buyer's phone, the
boarding pass, the Part 2 and end cards, "This is called"/question cards and captions.
Palette: the site's own illustration colours (charcoal, slate, greys, bright and light blue,
peach, coral) with the landing page's sky and brand blue. Look test: videos/_lab/look-3d.
"""
import json
import os

import build as B   # word times, TERMS, captions and term cards are shared with the 2D builder
from build import BS, W

ROOT = B.ROOT
TOTAL = B.TOTAL

TT = {
    "phones": W(1, "phones"), "abroad": W(1, "abroad"), "kilos": W(1, "kilos"), "fifty": W(1, "fifty"), "forty": W(1, "forty"),
    "map": BS(2) - 0.2, "delayed": W(2, "delayed"), "tarmac": W(2, "your") - 0.15, "two": W(2, "two"),
    "buyer": W(2, "buyer"), "every": W(2, "every"), "so": W(3, "so"), "who": W(3, "who"), "explain": W(3, "explain"),
    "waybill": W(3, "explain") + 0.1, "plane4": W(4, "plane"), "b5": BS(5), "contract1": W(5, "contract", 1),
    "airline1": W(5, "airline", 1), "promises": W(5, "promises"), "stops": W(5, "stops"), "box6": W(6, "box"),
    "n": W(6, "n."), "v": W(6, "v."), "d": W(6, "d."),
    "weight": BS(7) - 0.25, "only": W(7, "only"), "weightw": W(7, "weight"), "value7": W(7, "value"),
    "twenty8": W(8, "twenty"), "kilo8": W(8, "kilo", end=True),
    "sdr": BS(9) - 0.25, "imf": W(9, "i."), "world": W(9, "world"), "one": W(9, "one"), "rupees": W(9, "rupees"),
    "money": BS(10) - 0.25, "hundred10": W(10, "hundred"), "thirty10": W(10, "thirty"), "three10": W(10, "three"), "forty10": W(10, "forty"),
    "delay": BS(11) - 0.25, "delay11": W(11, "delay"), "counts": W(11, "counts"), "losses": W(11, "losses"), "prove": W(11, "prove"),
    "deadline": BS(12) - 0.25, "twenty12": W(12, "twenty"), "two12": W(12, "two"), "gone": W(12, "gone"),
    "protect": BS(13) - 0.25, "write": W(13, "write"), "real": W(13, "real"), "value13": W(13, "value"), "fee": W(13, "fee"),
    "limit": W(13, "limit"), "or": W(13, "or"), "insurance": W(13, "insurance"), "most": W(13, "most"), "delay13": W(13, "delay"),
    "part2": BS(14) - 0.25, "part": W(14, "part"),
    "end": BS(15) - 0.25, "flies": W(15, "flies"), "check": W(15, "check"), "box15": W(15, "box"), "more": W(15, "more"),
    "f16": W(15, "f-six"), "total": TOTAL,
}
TT = {k: round(v, 2) for k, v in TT.items()}

# Pinned tags: (id, text, class, show, hide). Their positions follow 3D objects (see PINS in the JS).
TAGS = [
    ("t-time", "Tuesday · 7:00 PM", "tag solid", 0.2, TT["map"] - 0.3),
    ("t-kg", "100 kg", "tag", TT["kilos"], TT["map"] - 0.3),
    ("t-price", '<div class="pt-big">$50,000</div><div id="t-price-inr" class="pt-small">≈ ₹44 lakh</div>', "tag price", TT["fifty"], TT["map"] - 0.3),
    ("t-bom", "Mumbai", "tag", TT["map"] + 0.4, TT["tarmac"] - 0.3),
    ("t-fra", "Frankfurt", "tag", TT["map"] + 0.5, TT["tarmac"] - 0.3),
    ("t-late", "Delayed · 48 h", "tag solid", TT["delayed"], TT["tarmac"] - 0.3),
    ("t-day1", "Day 1", "tag solid", TT["two"] - 0.1, TT["two"] + 0.55),
    ("t-day2", "Day 2", "tag solid", TT["two"] + 0.55, TT["explain"] - 0.4),
    ("t-you", "You", "tag solid", TT["who"] - 0.1, TT["explain"] - 0.3),
    ("t-air", "Airline", "tag", TT["who"], TT["explain"] - 0.3),
    ("t-1kg", "1 kg", "tag", TT["weightw"] + 0.1, TT["sdr"] - 0.3),
    ("t-each", "Each kilo = 26 SDR", "tag solid", TT["kilo8"] - 0.1, TT["sdr"] - 0.3),
    ("t-imf", "Made by the IMF", "tag solid", TT["imf"] - 0.1, TT["one"] - 0.1),
    ("t-inr", "≈ ₹120 · $1.35", "tag solid", TT["rupees"] - 0.3, TT["money"] - 0.3),
    ("t-sum", "100 kg × 26 SDR = 2,600 SDR", "tag solid", TT["hundred10"] - 0.1, TT["delay"] - 0.3),
    ("t-small", '<div class="pt-eye">Airline pays</div><div class="pt-big">≈ ₹3 lakh</div><div class="pt-small">about $3,500</div>', "tag price", TT["three10"] - 0.1, TT["delay"] - 0.3),
    ("t-big", '<div class="pt-eye">Your goods</div><div class="pt-big">₹44 lakh</div><div class="pt-small">about $50,000</div>', "tag price", TT["forty10"] + 0.3, TT["delay"] - 0.3),
    ("t-counts", "Delay counts", "tag solid", TT["counts"] - 0.1, TT["deadline"] - 0.3),
    ("t-proof", "Proof", "stampt", TT["prove"], TT["deadline"] - 0.3),
    ("t-fee", "+ a small fee", "tag solid", TT["fee"] - 0.1, TT["or"] - 0.2),
    ("t-limit", "Limit", "tag solid", TT["write"] - 0.2, TT["or"] - 0.2),
    ("t-notcov", "Delay: not covered", "tag solid", TT["delay13"] - 0.05, TT["part2"] - 0.3),
    ("t-next", "Next shipment", "tag solid", TT["end"] + 0.6, TT["more"] - 0.3),
    ("t-tick", "✓", "tick", TT["box15"] - 0.05, TT["more"] - 0.3),
]

JS = r"""
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/+esm";
const TT = __TT__;
const C = { ink: 0x263238, slate: 0x455A64, slate2: 0x37474F, grey: 0xE0E0E0, grey2: 0xEBEBEB, grey3: 0xDBDBDB, white: 0xFAFAFA,
            blue: 0x407BFF, lblue: 0x81A8FF, brand: 0x355594, peach: 0xFFBF9D, coral: 0xFF9A6C, sky: 0xF0F7FF, haze: 0xD0E6F8 };
const HEX = (n) => "#" + n.toString(16).padStart(6, "0");
const Wd = 1080, Hd = 1920;
const SX = { shop: 0, map: 90, tarmac: 180, weight: 230, sdr: 290, money: 350, delay: 410, deadline: 470, protect: 540, part2: 610 };

const canvas = document.getElementById("gl");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(Wd, Hd, false);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xFFE6D6, 70, 190);
const camera = new THREE.PerspectiveCamera(46, Wd / Hd, 0.1, 500);
const hemi = new THREE.HemisphereLight(0xFFFFFF, 0xE8D8CF, 1.6);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xFFE7D6, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 120 });
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

// ── reusable models ─────────────────────────────────────────────────────────
const cartonTex = tex(512, 512, (g) => {
  g.fillStyle = "#FAFAFA"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#407BFF"; g.fillRect(226, 0, 60, 512);
  g.fillStyle = "#FFFFFF"; g.strokeStyle = "#263238"; g.lineWidth = 10; g.fillRect(60, 330, 130, 120); g.strokeRect(60, 330, 130, 120);
  g.fillStyle = "#263238"; g.fillRect(84, 356, 28, 70); g.fillRect(132, 356, 28, 70);
});
const cartonMat = new THREE.MeshStandardMaterial({ map: cartonTex, roughness: 0.85 });
const smallWaybill = tex(256, 320, (g) => {
  g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#355594"; g.fillRect(0, 0, 256, 60);
  g.fillStyle = "#fff"; font(g, 30); g.fillText("AIR WAYBILL", 22, 42);
  g.fillStyle = "#81A8FF"; for (const y of [96, 140, 184, 228]) g.fillRect(24, y, 150 + (y % 3) * 20, 14);
  g.strokeStyle = "#263238"; g.lineWidth = 8; g.strokeRect(4, 4, 248, 312);
});
function heroBox(parent, x, y, z, withWaybill = true, s = 1) {
  const gbox = group(x, y, z, parent); gbox.scale.setScalar(s);
  const b = outline(add(new THREE.BoxGeometry(2.0, 1.8, 1.9), cartonMat, 0, 0.9, 0, gbox));
  if (withWaybill) add(new THREE.PlaneGeometry(0.85, 1.05), new THREE.MeshStandardMaterial({ map: smallWaybill, roughness: 0.7 }), 0.35, 0.93, 0.96, gbox);
  gbox.userData.body = b;
  return gbox;
}
function person(parent, x, z, ry = 0) {
  const p = group(x, 0, z, parent); p.rotation.y = ry;
  for (const px of [-0.22, 0.22]) add(new THREE.CylinderGeometry(0.17, 0.17, 1.6, 8), mat(C.ink), px, 0.8, 0, p);
  add(new THREE.CapsuleGeometry(0.55, 1.1, 4, 10), mat(C.blue), 0, 2.25, 0, p);
  add(new THREE.SphereGeometry(0.42, 14, 10), mat(C.peach), 0, 3.45, 0, p);
  add(new THREE.CylinderGeometry(0.45, 0.45, 0.18, 14), mat(C.ink), 0, 3.75, 0, p);
  add(new THREE.BoxGeometry(0.5, 0.06, 0.4), mat(C.ink), 0, 3.68, 0.38, p);
  const arm = group(-0.6, 2.75, 0, p);              // shoulder pivot
  add(new THREE.CapsuleGeometry(0.15, 1.0, 4, 8), mat(C.blue), 0, -0.6, 0, arm);
  const held = add(new THREE.BoxGeometry(0.28, 0.5, 0.06), mat(C.ink), 0, -1.25, 0.1, arm);
  held.visible = false;
  p.userData = { arm, held };
  return p;
}
function jet(parent, x, z, ry, s = 1) {
  const pl = group(x, 0, z, parent); pl.rotation.y = ry; pl.scale.setScalar(s);
  add(new THREE.CylinderGeometry(1.3, 1.3, 16, 12), mat(0xF7F7F7), 0, 2.9, 0, pl).rotation.z = Math.PI / 2;
  add(new THREE.SphereGeometry(1.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xF7F7F7), 8, 2.9, 0, pl).rotation.z = -Math.PI / 2;
  add(new THREE.ConeGeometry(1.3, 4, 12), mat(0xF7F7F7), -10, 3.3, 0, pl).rotation.z = Math.PI / 2;
  add(new THREE.BoxGeometry(4, 0.25, 15), mat(C.grey), 0.5, 2.3, 0, pl);
  add(new THREE.BoxGeometry(2.6, 3.6, 0.3), mat(C.blue), -10.2, 5.4, 0, pl).rotation.z = -0.35;
  add(new THREE.BoxGeometry(2, 0.2, 5.5), mat(C.grey), -10.4, 3.6, 0, pl);
  for (const zz of [-3.6, 3.6]) add(new THREE.CylinderGeometry(0.65, 0.65, 2.6, 10), mat(C.grey), 1.4, 1.5, zz, pl).rotation.z = Math.PI / 2;
  for (let i = 0; i < 12; i++) add(new THREE.BoxGeometry(0.42, 0.42, 0.05), mat(C.lblue), 5.5 - i * 1.05, 3.35, 1.29, pl);
  add(new THREE.BoxGeometry(1.2, 0.5, 0.06), mat(C.ink), 7.6, 3.5, 1.15, pl);
  for (const [gx, gz] of [[6, 0], [-1, -1.5], [-1, 1.5]]) add(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 10), mat(C.ink), gx, 0.42, gz, pl).rotation.x = Math.PI / 2;
  return pl;
}
function cubeStack(parent, x, z, size, gap) {      // 100 one-kilo cubes, 5 × 5 × 4
  const geo = new THREE.BoxGeometry(size, size, size);
  const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.7, flatShading: true }), 100);
  m.castShadow = m.receiveShadow = true;
  m.position.set(x, 0, z); parent.add(m);
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const lx = i % 5, lz = Math.floor(i / 5) % 5, ly = Math.floor(i / 25);
    cells.push(new THREE.Vector3((lx - 2) * (size + gap), size / 2 + ly * (size + gap), (lz - 2) * (size + gap)));
    m.setColorAt(i, new THREE.Color(0xFFFFFF));
  }
  m.userData = { cells, size };
  return m;
}
const dummy = new THREE.Object3D();
function poseStack(m, f, colorK = 0) {             // f(i) -> {k, from:Vector3}; colorK in 0..1 paints blue by index
  const c = new THREE.Color();
  m.userData.cells.forEach((cell, i) => {
    const { k, from } = f(i);
    dummy.position.copy(from).lerp(cell, k);
    dummy.scale.setScalar(Math.max(0.0001, k));
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    m.setColorAt(i, c.set(i / 100 < colorK ? 0x81A8FF : 0xFFFFFF));
  });
  m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
}

// ── the ground under everything ─────────────────────────────────────────────
add(new THREE.PlaneGeometry(2000, 400), mat(C.grey2), 300, 0, 0).rotation.x = -Math.PI / 2;
const runway = add(new THREE.PlaneGeometry(1400, 9), mat(C.slate), 300, 0.01, 9); runway.rotation.x = -Math.PI / 2;
for (let x = -200; x < 800; x += 6) add(new THREE.PlaneGeometry(3, 0.35), mat(0xFFFFFF), x, 0.02, 9).rotation.x = -Math.PI / 2;
add(new THREE.PlaneGeometry(1400, 0.25), mat(0xFFD27F), 300, 0.02, 3.2).rotation.x = -Math.PI / 2;
for (let i = 0; i < 40; i++) {                      // a pale skyline far behind
  const h = 6 + hash(i) * 14, w = 6 + hash(i + 9) * 8;
  add(new THREE.BoxGeometry(w, h, 6), mat(C.haze), -60 + i * 22, h / 2, -70 - hash(i + 3) * 20);
}
for (const tx of [60, 330, 560]) {                   // control towers
  add(new THREE.CylinderGeometry(0.9, 1.2, 16, 8), mat(C.grey), tx, 8, -40);
  outline(add(new THREE.CylinderGeometry(2.6, 2.2, 2.4, 8), mat(C.lblue), tx, 17, -40));
}

// ── 1 shop ──────────────────────────────────────────────────────────────────
const shop = group(SX.shop);
add(new THREE.BoxGeometry(18, 0.3, 13), mat(0xF5F5F5), 0, 0.15, -0.5, shop);
for (const [bx, bw] of [[-5.5, 7], [6.5, 5]]) outline(add(new THREE.BoxGeometry(bw, 8, 0.4), mat(0xF5F5F5), bx, 4, -7, shop));
outline(add(new THREE.BoxGeometry(4, 2.4, 0.4), mat(0xF5F5F5), 2, 1.2, -7, shop));
outline(add(new THREE.BoxGeometry(4, 2.4, 0.4), mat(0xF5F5F5), 2, 6.8, -7, shop));
add(new THREE.BoxGeometry(4.2, 0.2, 0.6), mat(C.slate), 2, 2.45, -6.8, shop);
outline(add(new THREE.BoxGeometry(0.4, 8, 13), mat(0xEDE7E3), -9, 4, -0.5, shop));
add(new THREE.BoxGeometry(5, 0.2, 1.2), mat(C.slate), -4.4, 4.6, -6.3, shop);
for (let i = 0; i < 4; i++) outline(add(new THREE.BoxGeometry(0.9, 0.7 + (i % 2) * 0.3, 0.9), cartonMat, -6.1 + i * 1.15, 5.05 + (i % 2) * 0.15, -6.3, shop));
const clockTex = tex(256, 256, (g) => {
  g.fillStyle = "#fff"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = "#263238"; g.lineWidth = 14; g.stroke();
  g.lineCap = "round"; g.lineWidth = 14; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 50); g.stroke();
  g.strokeStyle = "#407BFF"; g.lineWidth = 10; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 200); g.stroke();
});
const shopClock = add(new THREE.CircleGeometry(0.8, 24), new THREE.MeshStandardMaterial({ map: clockTex }), -3.6, 6.4, -6.75, shop);
outline(add(new THREE.BoxGeometry(7, 0.25, 2.8), mat(C.slate), 0, 2.4, 0, shop));
for (const [lx, lz] of [[-3.2, -1.1], [3.2, -1.1], [-3.2, 1.1], [3.2, 1.1]]) add(new THREE.BoxGeometry(0.22, 2.3, 0.22), mat(C.ink), lx, 1.15, lz, shop);
outline(add(new THREE.BoxGeometry(2.8, 0.25, 2.2), mat(C.ink), -0.6, 2.65, 0, shop));
const shopDisplay = paintable(256, 128, (g, s) => {
  g.fillStyle = "#263238"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#81A8FF"; font(g, 76); g.textAlign = "center";
  g.fillText(`${s.kg ?? 0}`, 128, 96);
});
const shopDisp = add(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshStandardMaterial({ map: shopDisplay.tex, emissive: 0x111111 }), -0.6, 2.5, 1.43, shop);
const shopBox = heroBox(shop, -0.6, 2.78, 0, false);
const lid = outline(add(new THREE.BoxGeometry(2.1, 0.14, 2.0), mat(0xF2F2F2), 0, 1.86, 0, shopBox));
const crate = group(4.6, 2.53, 0.2, shop);
outline(add(new THREE.BoxGeometry(1.8, 0.8, 1.4), mat(C.coral), 0, 0.4, 0, crate));
for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.3, 0.55, 0.08), mat(C.ink), -0.55 + i * 0.37, 0.95, 0, crate);
const shopMe = person(shop, 2.3, -1.9, 0);
const tagPrice = new THREE.Object3D(); tagPrice.position.set(0.9, 2.2, 0.5); shopBox.add(tagPrice);
const shopJet = jet(shop, 30, -30, 0.1, 0.35); shopJet.position.y = 9;

// ── 2 map: Mumbai -> Frankfurt laid on the ground, seen from above ───────────
const mapG = group(SX.map);
const mapTex = tex(1024, 1024, (g) => {
  g.fillStyle = "#DCEBFF"; g.fillRect(0, 0, 1024, 1024);
  g.fillStyle = "#F5F5F5";
  g.beginPath(); g.moveTo(0, 520); g.bezierCurveTo(200, 380, 330, 560, 520, 470); g.bezierCurveTo(700, 380, 820, 520, 1024, 430); g.lineTo(1024, 1024); g.lineTo(0, 1024); g.fill();
  g.beginPath(); g.moveTo(380, 0); g.bezierCurveTo(470, 140, 640, 200, 700, 330); g.bezierCurveTo(820, 260, 920, 300, 1024, 220); g.lineTo(1024, 0); g.fill();
  g.strokeStyle = "rgba(53,85,148,.12)"; g.lineWidth = 2; for (let i = 0; i <= 1024; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(1024, i); g.stroke(); }
});
const mapPlane = add(new THREE.BoxGeometry(34, 0.3, 34), new THREE.MeshStandardMaterial({ map: mapTex, roughness: 0.9 }), 0, 0.15, -2, mapG);
const BOM = new THREE.Vector3(-10, 0.5, 8), FRA = new THREE.Vector3(10, 0.5, -12);
for (const p of [BOM, FRA]) add(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16), mat(C.brand), p.x, 0.55, p.z, mapG);
const routeCurve = new THREE.QuadraticBezierCurve3(BOM.clone(), new THREE.Vector3(0, 7, -2), FRA.clone());
const routeGeo = new THREE.TubeGeometry(routeCurve, 80, 0.18, 8, false);
add(routeGeo, mat(C.brand), 0, 0.2, 0, mapG);
const routeTotal = routeGeo.index.count;
const miniJet = jet(mapG, 0, 0, 0, 0.16);
const pinBOM = new THREE.Object3D(); pinBOM.position.copy(BOM); mapG.add(pinBOM);
const pinFRA = new THREE.Object3D(); pinFRA.position.copy(FRA); mapG.add(pinFRA);

// ── 3 tarmac ────────────────────────────────────────────────────────────────
const tar = group(SX.tarmac);
const shed = group(-11, 0, -8, tar);
outline(add(new THREE.BoxGeometry(16, 7, 9), mat(0xF5F5F5), 0, 3.5, 0, shed));
outline(add(new THREE.BoxGeometry(16.8, 0.6, 9.8), mat(C.slate2), 0, 7.3, 0, shed));
const doorTex = tex(256, 256, (g) => { g.fillStyle = "#C7C7C7"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#A6A6A6"; for (let y = 8; y < 256; y += 24) g.fillRect(0, y, 256, 6); });
for (const dx of [-4, 3]) add(new THREE.PlaneGeometry(4.5, 5), new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.9 }), dx, 2.5, 4.51, shed);
const signTex = tex(512, 128, (g) => { g.fillStyle = "#407BFF"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#fff"; font(g, 84); g.textAlign = "center"; g.fillText("CARGO", 256, 98); });
add(new THREE.PlaneGeometry(5, 1.25), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.6 }), -0.5, 5.9, 4.52, shed);
const bigJet = jet(tar, 9, -6, -0.55);
const cart = group(0, 0, 4.2, tar);
outline(add(new THREE.BoxGeometry(5.2, 0.35, 2.6), mat(C.slate), 0, 0.85, 0, cart));
outline(add(new THREE.BoxGeometry(1.8, 1.6, 2.2), mat(C.coral), 3.9, 1.2, 0, cart));
add(new THREE.BoxGeometry(1.2, 0.7, 2.24), mat(C.lblue), 4.0, 1.5, 0, cart);
add(new THREE.BoxGeometry(0.9, 0.12, 0.12), mat(C.ink), 2.75, 0.85, 0, cart);
const wheels = [];
for (const [x, z] of [[-1.9, -1.3], [-1.9, 1.3], [1.9, -1.3], [1.9, 1.3], [3.9, -1.15], [3.9, 1.15]]) {
  const w = add(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 14), mat(C.ink), x, 0.42, z, cart); w.rotation.x = Math.PI / 2; wheels.push(w);
}
const tarBox = heroBox(cart, -0.6, 1.02, 0, false);
// the waybill taped on the box: also the close-up's document
const doc = paintable(1024, 1264, (g, s, W, H) => {
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#355594"; g.fillRect(0, 0, W, 170); g.fillStyle = "#fff"; font(g, 92); g.textAlign = "center"; g.fillText("AIR WAYBILL", W / 2, 120);
  g.textAlign = "left";
  if (s.promise) { g.fillStyle = "#355594"; font(g, 46, 700); g.fillText("The airline promises…", 60, 250); }
  g.fillStyle = "#D0E6F8"; for (const [y, w] of [[290, 520], [350, 760], [430, 440], [490, 700]]) { g.fillRect(60, y, w, 26); }
  if (s.line) { g.strokeStyle = "#263238"; g.setLineDash([36, 22]); g.lineWidth = 10; g.beginPath(); g.moveTo(0, 580); g.lineTo(W * s.line, 580); g.stroke(); g.setLineDash([]); }
  if (s.stop) { g.fillStyle = "#263238"; g.fillRect(470, 545, 520, 70); g.fillStyle = "#fff"; font(g, 40); g.fillText("PROMISE STOPS HERE", 490, 595); }
  g.fillStyle = s.field ? "#FFE6D6" : "#F0F7FF"; g.strokeStyle = s.field ? "#FF9A6C" : "#81A8FF"; g.lineWidth = 12;
  g.fillRect(50, 650, W - 100, 240); g.strokeRect(50, 650, W - 100, 240);
  g.fillStyle = "#5A6B8A"; font(g, 40, 700); g.fillText("DECLARED VALUE FOR CARRIAGE", 80, 715);
  g.fillStyle = "#263238"; font(g, 150, 900); ["N", "V", "D"].forEach((L, i) => { if (s.nvd > i) g.fillText(L, 90 + i * 150, 860); });
  for (const [x, label, on] of [[60, "YOU", s.sig1], [580, "AIRLINE", s.sig2]]) {
    g.fillStyle = "#263238"; g.fillRect(x, 1130, 380, 8); font(g, 40, 700); g.fillStyle = "#5A6B8A"; g.fillText(label, x, 1190);
    if (on) { g.fillStyle = "#407BFF"; g.beginPath(); g.arc(x + 60, 1060, 48, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 14; g.lineCap = "round";
      g.beginPath(); g.moveTo(x + 36, 1060); g.lineTo(x + 54, 1080); g.lineTo(x + 86, 1040); g.stroke(); }
  }
  g.strokeStyle = "#263238"; g.lineWidth = 16; g.strokeRect(8, 8, W - 16, H - 16);
});
const waybill = add(new THREE.PlaneGeometry(0.85, 1.05), new THREE.MeshStandardMaterial({ map: doc.tex, roughness: 0.7 }), 0.35, 0.93, 0.961, tarBox);
const tarMe = person(tar, -4.6, 1.8, 0.5);
const coin = add(new THREE.CylinderGeometry(0.7, 0.7, 0.16, 28), mat(C.peach), 0, -10, 0, tar);
coin.rotation.x = Math.PI / 2;

// ── 5 weight: the box on a platform scale becomes 100 one-kilo cubes ────────
const wt = group(SX.weight);
outline(add(new THREE.BoxGeometry(7, 0.5, 6), mat(C.slate), 0, 0.25, 0, wt));
add(new THREE.BoxGeometry(0.4, 3.2, 0.4), mat(C.ink), 3.9, 1.6, 2.6, wt);
const wtDisplay = paintable(512, 200, (g, s) => {
  g.fillStyle = "#263238"; g.fillRect(0, 0, 512, 200); g.fillStyle = s.sdr ? "#81A8FF" : "#FFFFFF"; font(g, 84); g.textAlign = "center";
  g.fillText(s.sdr ? "26 SDR / kg" : "100 kg", 256, 130);
});
outline(add(new THREE.BoxGeometry(3.0, 1.2, 0.3), new THREE.MeshStandardMaterial({ map: wtDisplay.tex, emissive: 0x111111 }), 3.9, 3.6, 2.6, wt));
const wtBox = heroBox(wt, 0, 0.5, 0, true, 1.2);
const wtStack = cubeStack(wt, 0, 0, 0.48, 0.08); wtStack.position.y = 0.5;
const priceTex = tex(512, 256, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#263238"; g.lineWidth = 16; g.strokeRect(8, 8, 496, 240);
  g.fillStyle = "#263238"; font(g, 104); g.textAlign = "center"; g.fillText("$50,000", 256, 140); g.fillStyle = "#355594"; font(g, 54, 700); g.fillText("value", 256, 210); });
const priceTag = outline(add(new THREE.BoxGeometry(2.0, 1.0, 0.1), [mat(0xffffff), mat(0xffffff), mat(0xffffff), mat(0xffffff), new THREE.MeshStandardMaterial({ map: priceTex }), mat(0xffffff)], 2.6, 9, 0, wt));
const pin1kg = new THREE.Object3D(); wt.add(pin1kg);
const pinEach = new THREE.Object3D(); pinEach.position.set(0, 3.4, 0); wt.add(pinEach);

// ── 6 SDR: a basket of world coins melts into one SDR coin ──────────────────
const sd = group(SX.sdr);
const basket = add(new THREE.CylinderGeometry(3.2, 2.4, 2.4, 24, 1, true), mat(C.slate, { side: THREE.DoubleSide }), 0, 1.2, 0, sd);
add(new THREE.TorusGeometry(3.2, 0.18, 8, 32), mat(C.ink), 0, 2.4, 0, sd).rotation.x = Math.PI / 2;
add(new THREE.CylinderGeometry(2.4, 2.4, 0.1, 24), mat(C.ink), 0, 0.05, 0, sd);
const coinFace = (sym, bg = "#FFBF9D", fg = "#263238") => tex(256, 256, (g) => {
  g.fillStyle = bg; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = fg; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 104, 0, 7); g.stroke();
  g.fillStyle = fg; font(g, sym.length > 2 ? 70 : 130); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(sym, 128, 136);
});
const worldCoins = ["$", "€", "£", "¥", "元"].map((sym, i) => {
  const face = new THREE.MeshStandardMaterial({ map: coinFace(sym), roughness: 0.5 });
  const c = add(new THREE.CylinderGeometry(0.9, 0.9, 0.22, 28), [mat(C.coral), face, face], 0, 20, 0, sd);
  c.userData.home = new THREE.Vector3([-1.4, 0, 1.4, -0.7, 0.7][i], [2.0, 2.1, 2.0, 2.6, 2.6][i], [0.4, -0.6, 0.4, 0.2, -0.2][i]);
  return c;
});
const sdrFace = new THREE.MeshStandardMaterial({ map: coinFace("1 SDR", "#355594", "#FFFFFF"), roughness: 0.45 });
const sdrCoin = add(new THREE.CylinderGeometry(2.1, 2.1, 0.4, 40), [mat(C.brand), sdrFace, sdrFace], 0, 4.6, 0, sd);
sdrCoin.rotation.x = Math.PI / 2;
const pinIMF = new THREE.Object3D(); pinIMF.position.set(0, 1.2, 3.3); sd.add(pinIMF);
const pinINR = new THREE.Object3D(); pinINR.position.set(0, 2.1, 0.4); sd.add(pinINR);

// ── 7 money: 100 kilos next to two stacks of notes ──────────────────────────
const mo = group(SX.money);
const moStack = cubeStack(mo, -3.6, 0, 0.32, 0.05);
const noteTex = tex(64, 256, (g) => { for (let y = 0; y < 256; y += 16) { g.fillStyle = (y / 16) % 2 ? "#81A8FF" : "#FFFFFF"; g.fillRect(0, y, 64, 16); } });
const noteMat = new THREE.MeshStandardMaterial({ map: noteTex, roughness: 0.8 });
const small = outline(add(new THREE.BoxGeometry(2.0, 1.0, 1.4), noteMat, 0, 0.5, 0, mo));
const tall = outline(add(new THREE.BoxGeometry(2.0, 7.0, 1.4), noteMat, 3.4, 3.5, 0, mo));
const pinSum = new THREE.Object3D(); pinSum.position.set(-3.0, 4.6, 0); mo.add(pinSum);
const pinSmall = new THREE.Object3D(); pinSmall.position.set(0, 1.4, 0); mo.add(pinSmall);
const pinTall = new THREE.Object3D(); pinTall.position.set(3.4, 7.4, 0); mo.add(pinTall);

// ── 8 delay: a clock on the apron, receipts into a folder ───────────────────
const dl = group(SX.delay);
jet(dl, 6, -9, -0.4);
add(new THREE.CylinderGeometry(0.15, 0.15, 6, 8), mat(C.ink), -4, 3, 0, dl);
const faceTex = tex(512, 512, (g) => { g.fillStyle = "#fff"; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = "#263238"; g.lineWidth = 22; g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.lineWidth = i % 3 ? 8 : 16; g.beginPath(); g.moveTo(256 + Math.sin(a) * 200, 256 - Math.cos(a) * 200); g.lineTo(256 + Math.sin(a) * 228, 256 - Math.cos(a) * 228); g.stroke(); } });
const clock = group(-4, 7, 0, dl);
outline(add(new THREE.CylinderGeometry(2.0, 2.0, 0.4, 32), [mat(C.slate), new THREE.MeshStandardMaterial({ map: faceTex }), mat(C.slate)], 0, 0, 0, clock)).rotation.x = Math.PI / 2;
const hHand = group(0, 0, 0.25, clock), mHand = group(0, 0, 0.3, clock);
add(new THREE.BoxGeometry(0.18, 1.0, 0.06), mat(C.ink), 0, 0.5, 0, hHand);
add(new THREE.BoxGeometry(0.12, 1.5, 0.06), mat(C.blue), 0, 0.75, 0, mHand);
const folder = group(2.2, 0, 1, dl);
outline(add(new THREE.BoxGeometry(4, 0.3, 2.8), mat(C.coral), 0, 0.15, 0, folder));
outline(add(new THREE.BoxGeometry(4, 2.6, 0.2), mat(C.coral), 0, 1.4, -1.3, folder));
const front = outline(add(new THREE.BoxGeometry(4, 1.6, 0.2), mat(C.peach), 0, 0.9, 1.3, folder));
const receiptTex = tex(256, 320, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#355594"; font(g, 70); g.fillText("₹", 24, 80);
  g.fillStyle = "#5A6B8A"; font(g, 34, 700); g.fillText("missed sale", 24, 140); g.fillStyle = "#E0E0E0"; for (const y of [180, 220, 260]) g.fillRect(24, y, 200, 16);
  g.strokeStyle = "#263238"; g.lineWidth = 8; g.strokeRect(4, 4, 248, 312); });
const receipts = [0, 1, 2].map((i) => add(new THREE.PlaneGeometry(1.2, 1.5), new THREE.MeshStandardMaterial({ map: receiptTex, side: THREE.DoubleSide }), 1.1 + i * 1.1, 12, 1, dl));
const pinCounts = new THREE.Object3D(); pinCounts.position.set(-4, 4.6, 0); dl.add(pinCounts);
const pinProof = new THREE.Object3D(); pinProof.position.set(2.2, 1.0, 2.6); dl.add(pinProof);

// ── 9 deadline: a timeline drawn on the apron, the claim rides it and falls off ──
const dd = group(SX.deadline);
outline(add(new THREE.BoxGeometry(26, 0.2, 1.4), mat(C.slate), 0, 0.1, 2, dd));
const postTex = (big, small) => tex(512, 256, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#263238"; g.lineWidth = 16; g.strokeRect(8, 8, 496, 240);
  g.fillStyle = "#263238"; font(g, 100); g.textAlign = "center"; g.fillText(big, 256, 128); g.fillStyle = "#5A6B8A"; font(g, 44, 700); g.fillText(small, 256, 200); });
const posts = [[-11, "Day 0", "delivery"], [0, "21 days", "complain in writing"], [11, "2 years", "go to court"]].map(([x, b, s], i) => {
  const p = group(x, 0, 0.6, dd);
  add(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8), mat(C.ink), 0, 1.6, 0, p);
  outline(add(new THREE.BoxGeometry(3.6, 1.8, 0.15), [mat(0xffffff), mat(0xffffff), mat(0xffffff), mat(0xffffff), new THREE.MeshStandardMaterial({ map: postTex(b, s) }), mat(0xffffff)], 0, 3.6, 0, p));
  return p;
});
const claimTex = tex(256, 320, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#355594"; font(g, 64); g.fillText("CLAIM", 22, 86);
  g.fillStyle = "#E0E0E0"; for (const y of [130, 175, 220, 265]) g.fillRect(22, y, 200 - (y % 2) * 40, 18); g.strokeStyle = "#263238"; g.lineWidth = 10; g.strokeRect(5, 5, 246, 310); });
const claim = outline(add(new THREE.BoxGeometry(1.6, 2.0, 0.12), [mat(0xffffff), mat(0xffffff), mat(0xffffff), mat(0xffffff), new THREE.MeshStandardMaterial({ map: claimTex }), mat(0xffffff)], -11, 1.2, 2, dd));

// ── 10 protect: declare the value (the limit rises) / insure (delay left in the rain) ──
const pr = group(SX.protect);
const board = paintable(1024, 512, (g, s, W, H) => {
  g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); g.strokeStyle = "#263238"; g.lineWidth = 20; g.strokeRect(10, 10, W - 20, H - 20);
  g.fillStyle = "#5A6B8A"; font(g, 52, 700); g.fillText("DECLARED VALUE FOR CARRIAGE", 60, 110);
  if (s.val) { g.fillStyle = "#263238"; font(g, 170); g.fillText("₹44 lakh", 60, 340); }
  else { g.strokeStyle = "#355594"; g.lineWidth = 16; g.strokeRect(70, 190, 380, 190); g.fillStyle = "#355594"; font(g, 150, 900); g.fillText("NVD", 95, 345); }
});
outline(add(new THREE.BoxGeometry(6.4, 3.2, 0.25), [mat(0xffffff), mat(0xffffff), mat(0xffffff), mat(0xffffff), new THREE.MeshStandardMaterial({ map: board.tex }), mat(0xffffff)], -3.6, 3.6, 0, pr));
add(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8), mat(C.ink), -3.6, 1.1, 0, pr);
const prStack = cubeStack(pr, 3.6, 0, 0.42, 0.06);
const limitPlane = add(new THREE.BoxGeometry(4.2, 0.08, 4.2), mat(C.coral, { transparent: true, opacity: 0.75 }), 3.6, 0.5, 0, pr);
const pinFee = new THREE.Object3D(); pinFee.position.set(-3.6, 1.6, 0.3); pr.add(pinFee);
const umb = group(21, 0, 0, pr);
heroBox(umb, 0, 0, 0, true);
const canopy = add(new THREE.ConeGeometry(4.2, 1.8, 12, 1, true), mat(C.blue, { side: THREE.DoubleSide }), 0, 6.2, 0, umb);
add(new THREE.CylinderGeometry(0.1, 0.1, 5.4, 8), mat(C.ink), 0, 3.6, 0, umb);
const rclock = group(5.2, 2.2, 0.5, umb);
add(new THREE.CylinderGeometry(1.1, 1.1, 0.25, 28), [mat(C.slate), new THREE.MeshStandardMaterial({ map: faceTex }), mat(C.slate)], 0, 0, 0, rclock).rotation.x = Math.PI / 2;
add(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8), mat(C.ink), 0, -1.1, 0, rclock);
const cross = group(0, 0, 0.4, rclock);
for (const r of [0.785, -0.785]) add(new THREE.BoxGeometry(2.6, 0.28, 0.1), mat(C.ink), 0, 0, 0, cross).rotation.z = r;
const rain = [];
for (let i = 0; i < 36; i++) { const d = add(new THREE.BoxGeometry(0.05, 0.6, 0.05), mat(C.lblue), 3.3 + hash(i) * 3.8, 0, -1 + hash(i + 50) * 2.6, umb); d.castShadow = false; rain.push(d); }
const pinNotCov = new THREE.Object3D(); pinNotCov.position.set(5.2, 3.9, 0.5); umb.add(pinNotCov);

// ── 11 part 2: two ways, side by side ───────────────────────────────────────
const p2 = group(SX.part2);
heroBox(p2, -3.2, 0, 0, true); heroBox(p2, 3.2, 0, 0, true);

// ── pins: HTML tags that follow 3D objects ──────────────────────────────────
const PINS = [
  ["t-time", shopClock, 1.1], ["t-kg", shopDisp, 0.6], ["t-price", tagPrice, 0], ["t-bom", pinBOM, 1.2], ["t-fra", pinFRA, 1.2],
  ["t-late", miniJet, 2.4], ["t-day1", tarBox, 2.6], ["t-day2", tarBox, 2.6], ["t-you", tarMe, 4.5], ["t-air", bigJet, 8],
  ["t-1kg", pin1kg, 0.5], ["t-each", pinEach, 0], ["t-imf", pinIMF, 0], ["t-inr", pinINR, 0], ["t-sum", pinSum, 0],
  ["t-small", pinSmall, 0], ["t-big", pinTall, 0], ["t-counts", pinCounts, 0], ["t-proof", pinProof, 0], ["t-fee", pinFee, 0],
  ["t-limit", limitPlane, 0.4], ["t-notcov", pinNotCov, 0], ["t-next", shopClock, 1.1], ["t-tick", shopBox, 2.4],
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
tarBox.updateWorldMatrix(true, true);
const wbAt = () => { cart.position.x = 0; tar.updateMatrixWorld(true); return waybill.getWorldPosition(new THREE.Vector3()); };
const WB = wbAt();
const K = [
  [0, P(-7.5, 12, 25), P(-0.4, 2.4, -1)],
  [TT.map - 0.45, P(-6.5, 11, 23), P(-0.4, 2.4, -1)],
  [TT.map + 0.45, P(SX.map - 2, 50, 24), P(SX.map, 0, -2)],
  [TT.tarmac - 0.45, P(SX.map - 1, 46, 21), P(SX.map, 0, -2)],
  [TT.tarmac + 0.45, P(SX.tarmac - 14, 17, 38), P(SX.tarmac - 1, 1.5, -1)],
  [TT.so - 0.3, P(SX.tarmac - 9.5, 11, 28.5), P(SX.tarmac - 0.5, 1.6, 1.5)],
  [TT.explain - 0.1, P(SX.tarmac - 8, 9.5, 25), P(SX.tarmac - 0.5, 1.6, 2)],
  [TT.waybill + 0.55, P(WB.x, WB.y - 0.25, WB.z + 3.8), P(WB.x, WB.y - 0.25, WB.z)],
  [TT.weight - 0.45, P(WB.x, WB.y - 0.25, WB.z + 3.6), P(WB.x, WB.y - 0.25, WB.z)],
  [TT.weight + 0.45, P(SX.weight - 2, 9.5, 19), P(SX.weight + 1.9, 2.2, 0.5)],
  [TT.sdr - 0.45, P(SX.weight - 1, 8.8, 17.5), P(SX.weight + 1.9, 2.2, 0.5)],
  [TT.sdr + 0.45, P(SX.sdr - 4, 10, 18), P(SX.sdr, 3.8, 0)],
  [TT.money - 0.45, P(SX.sdr - 3, 9.5, 17), P(SX.sdr, 3.8, 0)],
  [TT.money + 0.45, P(SX.money, 9.5, 25), P(SX.money, 2.6, 0)],
  [TT.delay - 0.45, P(SX.money, 9.2, 24), P(SX.money, 2.6, 0)],
  [TT.delay + 0.45, P(SX.delay - 2, 10, 25), P(SX.delay - 0.5, 4, 0)],
  [TT.deadline - 0.45, P(SX.delay - 1.5, 9.5, 23.5), P(SX.delay - 0.5, 4, 0)],
  [TT.deadline + 0.45, P(SX.deadline - 11, 8, 19), P(SX.deadline - 10, 2.4, 1)],
  [TT.twenty12 - 0.2, P(SX.deadline - 10.5, 8, 18.5), P(SX.deadline - 10, 2.4, 1)],
  [TT.twenty12 + 0.4, P(SX.deadline - 0.5, 8, 19), P(SX.deadline, 2.4, 1)],
  [TT.two12 - 0.2, P(SX.deadline, 8, 18.5), P(SX.deadline, 2.4, 1)],
  [TT.two12 + 0.4, P(SX.deadline + 10, 8, 19), P(SX.deadline + 10.5, 2.4, 1)],
  [TT.protect - 0.45, P(SX.deadline + 10.5, 8, 18.5), P(SX.deadline + 10.5, 2.4, 1)],
  [TT.protect + 0.45, P(SX.protect - 1, 11, 27), P(SX.protect - 0.8, 3, 0)],
  [TT.or - 0.25, P(SX.protect - 0.5, 10.5, 26), P(SX.protect - 0.8, 3, 0)],
  [TT.or + 0.65, P(SX.protect + 23.2, 11, 33), P(SX.protect + 23.2, 3.4, 0)],
  [TT.part2 - 0.45, P(SX.protect + 23.2, 10.6, 32), P(SX.protect + 23.2, 3.4, 0)],
  [TT.part2 + 0.45, P(SX.part2, 8.5, 26), P(SX.part2, 2, 0)],
  [TT.end - 0.45, P(SX.part2, 8, 24.5), P(SX.part2, 2, 0)],
  [TT.end + 0.75, P(-7.5, 12, 25), P(-0.4, 2.4, -1)],
  [TT.total, P(-6.5, 11, 23), P(-0.4, 2.4, -1)],
];
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
function cameraAt(t) {
  let i = 0;
  while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const [t0, p0, l0] = K[i], [t1, p1, l1] = K[i + 1];
  const k = ease((t - t0) / Math.max(0.001, t1 - t0));
  camPos.copy(p0).lerp(p1, k); camLook.copy(l0).lerp(l1, k);
  const far = p0.distanceTo(p1);
  if (far > 20) camPos.y += Math.sin(Math.PI * k) * Math.min(18, far * 0.12);   // swoop over long flights
  camera.position.copy(camPos); camera.lookAt(camLook); camera.updateMatrixWorld();
  sun.target.position.copy(camLook); sun.position.copy(camLook).add(new THREE.Vector3(-18, 26, 14));
}

// ── the frame at time t ─────────────────────────────────────────────────────
const nightEl = document.getElementById("night");
function renderAt(t) {
  // shop: three phones from the crate into the box, the lid, the scale, then the end's tick
  const me = shopMe.userData;
  let armRot = 0, held = false;
  for (let k = 0; k < 3; k++) {
    const c = TT.phones - 0.45 + k * 0.5;
    if (t >= c && t < c + 0.5) {
      const u = (t - c) / 0.5;
      armRot = u < 0.35 ? lerp(0, 0.9, ease(u / 0.35)) : lerp(0.9, -1.25, ease((u - 0.35) / 0.55));
      held = u > 0.3 && u < 0.9;
    }
  }
  if (t >= TT.check - 0.1 && t < TT.box15 + 0.6) armRot = -1.1 * Math.sin(Math.PI * span(t, TT.check - 0.1, 0.9));
  me.arm.rotation.z = armRot; me.held.visible = held;
  const lidK = back(span(t, TT.abroad, 0.4));
  lid.position.y = lerp(3.4, 1.86, lidK); lid.visible = t >= TT.abroad || t >= TT.end;
  if (t >= TT.end) lid.position.y = 1.86;
  shopDisplay.paint({ kg: t < TT.kilos - 0.1 ? 0 : Math.round(lerp(0, 100, span(t, TT.kilos - 0.1, 0.5)) / 25) * 25 });
  document.getElementById("t-price-inr").style.opacity = t >= TT.forty - 0.05 ? 1 : 0;
  shopJet.position.x = lerp(-40, 40, span(t, TT.flies - 0.6, 2.2));

  // map: the route draws, the plane flies to the halfway point and stops
  routeGeo.setDrawRange(0, Math.floor(routeTotal * ease(span(t, TT.map + 0.3, 0.9)) / 3) * 3);
  const fk = 0.5 * out(span(t, TT.map + 0.4, TT.delayed - TT.map - 0.4));
  const fp = routeCurve.getPointAt(Math.max(0.001, fk)), ft = routeCurve.getTangentAt(Math.max(0.001, fk));
  miniJet.position.copy(fp).add(new THREE.Vector3(0, 0.4, 0));
  miniJet.rotation.set(0, Math.atan2(-ft.z, ft.x), 0);

  // tarmac: the cart rolls in; two days pass; the coin bounces between you and the airline
  const roll = out(span(t, TT.tarmac + 0.2, 2.4));
  cart.position.x = lerp(-28, 0, roll);
  wheels.forEach((w) => (w.rotation.y = -cart.position.x / 0.42));
  const dayU = span(t, TT.two - 0.1, 1.3);
  const night = dayU > 0 && dayU < 1 ? Math.max(0, -Math.cos(dayU * Math.PI * 4)) * 0.55 : 0;
  nightEl.style.opacity = night.toFixed(3);
  hemi.intensity = 1.6 - night * 1.1; sun.intensity = 2.4 - night * 2.0;
  const cu = span(t, TT.who + 0.1, 1.28);
  if (t >= TT.who && t < TT.explain - 0.35) {
    const leg = Math.min(3, Math.floor(cu * 4)), lu = cu * 4 - leg;
    const a = new THREE.Vector3(-4.6, 4.8, 1.8), b = new THREE.Vector3(6, 7.5, -3);
    const from = leg % 2 ? b : a, to = leg % 2 ? a : b;
    coin.position.copy(from).lerp(to, ease(lu)); coin.position.y += Math.sin(Math.PI * lu) * 2.2;
    coin.rotation.z = t * 6;
  } else coin.position.y = -10;

  // the waybill close-up: ticket, signatures, the promise and where it stops, then N-V-D
  doc.paint({
    promise: t >= TT.promises - 0.1, sig1: t >= TT.contract1, sig2: t >= TT.airline1,
    line: Math.round(out(span(t, TT.stops - 0.25, 0.45)) * 20) / 20, stop: t >= TT.stops,
    field: t >= TT.box6 - 0.1, nvd: (t >= TT.n - 0.05) + (t >= TT.v - 0.05) + (t >= TT.d - 0.05),
  });

  // weight: the box turns into 100 cubes; the price tag lands and bounces off; 26 SDR per kilo
  const burst = span(t, TT.only - 0.1, 0.7);
  wtBox.visible = t < TT.only - 0.05;
  const centre = new THREE.Vector3(0, 1.4, 0);
  poseStack(wtStack, (i) => ({ k: back(clamp01(burst * 1.6 - (99 - i) / 160)), from: centre }), clamp01((t - (TT.twenty8 - 0.1)) / 0.6));
  wtStack.visible = t >= TT.only - 0.1;
  const tagDrop = span(t, TT.value7 - 0.3, 0.35), tagFly = span(t, TT.value7 + 0.05, 0.8);
  priceTag.position.set(lerp(2.6, 9, tagFly), lerp(9, 3.0, tagDrop) - tagFly * 4 + Math.sin(Math.PI * tagFly) * 2.5, lerp(0, 3, tagFly));
  priceTag.rotation.set(0, 0, -tagFly * 2.2);
  priceTag.visible = t >= TT.value7 - 0.3 && tagFly < 1;
  wtDisplay.paint({ sdr: t >= TT.twenty8 - 0.15 });
  pin1kg.position.copy(wtStack.userData.cells[4]).add(new THREE.Vector3(0, 0.5 + 3 * 0.56, 0));

  // SDR: coins rain into the basket, then melt into one SDR coin
  worldCoins.forEach((c, i) => {
    const fall = span(t, TT.world - 0.15 + i * 0.12, 0.5), melt = span(t, TT.one - 0.15, 0.35);
    const h = c.userData.home;
    c.position.set(h.x * (1 - melt), lerp(14, h.y, bounce(fall)) + melt * 2, h.z * (1 - melt));
    c.scale.setScalar(Math.max(0.0001, 1 - melt));
    c.rotation.set(0.3 + i * 0.2, i, 0);
    c.visible = t >= TT.world - 0.15 + i * 0.12 && melt < 1;
  });
  const sk = back(span(t, TT.one + 0.15, 0.45));
  sdrCoin.scale.setScalar(Math.max(0.0001, sk)); sdrCoin.visible = t >= TT.one + 0.15;
  sdrCoin.rotation.z = Math.sin(t * 1.2) * 0.25;

  // money: 100 kilos x 26 SDR; a short stack and a tall one
  poseStack(moStack, () => ({ k: 1, from: new THREE.Vector3() }), 1);
  small.scale.y = Math.max(0.0001, back(span(t, TT.thirty10 - 0.15, 0.45))); small.position.y = 0.5 * small.scale.y;
  tall.scale.y = Math.max(0.0001, out(span(t, TT.forty10 - 0.25, 0.8))); tall.position.y = 3.5 * tall.scale.y;

  // delay: the hands race; receipts drop into the folder
  const race = ease(span(t, TT.delay11 - 0.1, 1.1));
  mHand.rotation.z = -race * Math.PI * 6; hHand.rotation.z = -race * Math.PI / 2 - 0.6;
  receipts.forEach((r, i) => {
    const drop = out(span(t, TT.losses + i * 0.15, 0.35)), sink = span(t, TT.prove - 0.2 + i * 0.06, 0.25);
    r.position.y = lerp(12, 3.4, drop) - sink * 2.6; r.rotation.z = (i - 1) * 0.25 * (1 - sink);
    r.visible = t >= TT.losses + i * 0.15 && sink < 1;
  });

  // deadline: the claim rides from day 0 to 21 days to 2 years and falls off the end
  const leg1 = ease(span(t, TT.twenty12 - 0.1, 0.6)), leg2 = ease(span(t, TT.two12 - 0.1, 0.6)), fall = span(t, TT.gone - 0.35, 0.8);
  claim.position.set(-11 + leg1 * 11 + leg2 * 11 + fall * 4, 1.2 - fall * fall * 6, 2);
  claim.rotation.set(0, 0, -fall * 1.6);
  claim.visible = fall < 1;

  // protect: NVD -> ₹44 lakh; the limit rises over the cubes; the umbrella opens; rain on the clock
  board.paint({ val: t >= TT.real });
  poseStack(prStack, () => ({ k: 1, from: new THREE.Vector3() }), 0);
  limitPlane.position.y = lerp(0.55, 3.0, out(span(t, TT.limit - 0.1, 0.8)));
  const open = back(span(t, TT.insurance - 0.15, 0.5));
  canopy.scale.set(Math.max(0.05, open), Math.max(0.2, open), Math.max(0.05, open));
  rain.forEach((d, i) => { d.position.y = 7 - (((t * 9 + hash(i) * 7) % 7)); d.visible = t >= TT.most - 0.2; });
  cross.scale.setScalar(Math.max(0.0001, back(span(t, TT.delay13 - 0.1, 0.3)))); cross.visible = t >= TT.delay13 - 0.1;

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
        lines.append(f'      tl.fromTo("#{tid}", {{ opacity: 0, scale: 0.7 }}, {{ opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2)" }}, {round(show, 2)});')
        lines.append(f'      tl.to("#{tid}", {{ opacity: 0, duration: 0.18 }}, {round(hide, 2)});')
    t = TT
    lines += [
        f'      tl.fromTo("#phone", {{ y: 1700 }}, {{ y: 0, duration: 0.5, ease: "expo.out" }}, {round(t["buyer"] - 0.4, 2)});',
        f'      tl.fromTo("#dots", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.1 }}, {round(t["buyer"] - 0.05, 2)});',
        f'      tl.fromTo(".dot", {{ y: 0 }}, {{ y: -10, duration: 0.15, yoyo: true, repeat: 3, stagger: 0.08, ease: "sine.inOut" }}, {round(t["buyer"] - 0.05, 2)});',
        f'      tl.to("#dots", {{ opacity: 0, duration: 0.05 }}, {round(t["every"] - 0.1, 2)});',
        f'      tl.fromTo("#msg", {{ opacity: 0, scale: 0.85, transformOrigin: "0% 100%" }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }}, {round(t["every"] - 0.1, 2)});',
        f'      tl.to("#phone", {{ y: 1800, duration: 0.4, ease: "power3.in" }}, {round(t["so"] - 0.35, 2)});',
        f'      tl.fromTo("#pass", {{ opacity: 0, x: 160, rotation: 12 }}, {{ opacity: 1, x: 0, rotation: 6, duration: 0.45, ease: "back.out(1.8)" }}, {round(t["plane4"] - 0.1, 2)});',
        f'      tl.to("#pass", {{ opacity: 0, x: 220, duration: 0.3, ease: "power3.in" }}, {round(t["b5"] - 0.2, 2)});',
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
        *[(t["phones"] - 0.01 + k * 0.5, ("click-soft", "key-press")[k % 2], 0.3) for k in range(3)],
        (t["abroad"] + 0.3, "pop", 0.22), (t["kilos"] - 0.1, "typing", 0.18, 0.5), (t["fifty"], "pop", 0.25),
        *[(t[k] - 0.45, "whoosh", 0.22) for k in ("map", "tarmac", "weight", "sdr", "money", "delay", "deadline", "protect", "part2", "end")],
        (t["waybill"] - 0.2, "whoosh-short", 0.25), (t["map"] + 0.4, "whoosh-short", 0.15), (t["delayed"], "pop", 0.25),
        (t["tarmac"] + 0.25, "whoosh-short", 0.18), (t["two"] - 0.1, "whoosh-short", 0.15), (t["two"] + 0.55, "click-soft", 0.3),
        (t["buyer"] - 0.4, "whoosh-short", 0.2), (t["every"] - 0.1, "pop", 0.25),
        (t["who"] + 0.42, "click-soft", 0.22), (t["who"] + 0.74, "key-press", 0.22), (t["who"] + 1.06, "click-soft", 0.22),
        (t["plane4"] - 0.1, "whoosh-short", 0.18), (t["contract1"] + 0.05, "key-press", 0.28), (t["airline1"] + 0.05, "key-press", 0.28),
        (t["stops"] - 0.2, "whoosh-short", 0.18), (t["stops"] + 0.05, "pop", 0.22),
        (t["n"], "key-press", 0.28), (t["v"], "click-soft", 0.28), (t["d"], "key-press", 0.28),
        (t["only"] - 0.1, "typing", 0.2, 0.8), (t["value7"] + 0.05, "click-soft", 0.3), (t["value7"] + 0.1, "whoosh-short", 0.2),
        (t["kilo8"] + 0.05, "impact-bass-1", 0.16), (t["twenty8"] - 0.15, "click-soft", 0.25),
        (t["imf"] - 0.1, "pop", 0.2), *[(t["world"] + 0.2 + k * 0.12, ("click-soft", "key-press")[k % 2], 0.2) for k in range(5)],
        (t["one"] + 0.2, "pop", 0.28), (t["hundred10"] - 0.1, "pop", 0.2), (t["thirty10"], "pop", 0.22), (t["forty10"] - 0.25, "whoosh", 0.25),
        (t["delay11"] - 0.1, "typing", 0.16, 1.0), (t["counts"], "pop", 0.22), (t["losses"] + 0.3, "click-soft", 0.22),
        (t["prove"] + 0.05, "key-press", 0.35), (t["twenty12"] - 0.1, "click-soft", 0.28), (t["two12"] - 0.1, "click-soft", 0.28),
        (B.W(12, "gone", end=True) + 0.02, "whoosh", 0.25),
        (t["real"], "whoosh-short", 0.16), (t["value13"] + 0.05, "key-press", 0.28), (t["fee"], "pop", 0.22),
        (t["limit"], "whoosh", 0.2), (t["insurance"], "whoosh", 0.22), (t["most"] - 0.1, "click-soft", 0.22),
        (t["delay13"] - 0.05, "pop", 0.25), (t["part"], "pop", 0.3),
        (t["flies"] - 0.4, "whoosh-short", 0.2), (t["box15"], "pop", 0.25), (t["more"] - 0.15, "whoosh-short", 0.22), (t["f16"] - 0.2, "pop", 0.28),
        *[(s + 0.02, "click-soft", 0.18) for _, s, *_ in B.TERMS],
    ]
    fx.sort(key=lambda e: e[0])
    return "\n".join(
        f'      <audio id="sfx-{i}" class="clip" src="assets/audio/sfx/{e[1]}.mp3" data-start="{round(e[0], 2)}" '
        f'data-duration="{e[3] if len(e) > 3 else B.DUR[e[1]]}" data-track-index="{5 + i % 6}" data-volume="{e[2]}"></audio>'
        for i, e in enumerate(fx))


def index():
    tags = "\n".join(f'      <div id="{tid}" class="{cls}" data-layout-ignore>{html}</div>' for tid, html, cls, *_ in TAGS)
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
      #night {{ position: absolute; inset: 0; background: linear-gradient(180deg, #355594 0%, #81A8FF 60%); opacity: 0; }}
      #gl {{ position: absolute; inset: 0; width: 1080px; height: 1920px; display: block; }}
      .tag {{ position: absolute; padding: 10px 22px; border-radius: 14px; background: #FFFFFF; border: 4px solid #263238; color: #263238;
             font-weight: 800; font-size: 30px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap;
             box-shadow: 0 12px 24px rgba(38,50,56,.18); opacity: 0; }}
      .tag.solid {{ background: #263238; color: #FFFFFF; }}
      .tag.price {{ text-transform: none; letter-spacing: 0; text-align: center; padding: 14px 24px; }}
      .pt-eye {{ font-weight: 700; font-size: 24px; letter-spacing: .12em; text-transform: uppercase; color: #5A6B8A; }}
      .pt-big {{ font-weight: 800; font-size: 50px; line-height: 1.05; color: #263238; }}
      .pt-small {{ font-weight: 700; font-size: 30px; color: #355594; }}
      .stampt {{ position: absolute; padding: 0 22px; border: 8px solid #263238; border-radius: 12px; background: #FFFFFF; color: #263238;
                font-weight: 900; font-size: 72px; letter-spacing: .06em; opacity: 0; }}
      .tick {{ position: absolute; width: 90px; height: 90px; border-radius: 50%; background: #407BFF; color: #fff; font-size: 56px; font-weight: 900;
              display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 24px rgba(38,50,56,.2); opacity: 0; }}
      #series {{ position: absolute; left: 70px; right: 70px; top: 250px; display: flex; justify-content: space-between; z-index: 30;
                font-weight: 800; font-size: 28px; letter-spacing: .12em; text-transform: uppercase; color: #263238; opacity: .7; }}
      #phone {{ position: absolute; left: 250px; top: 330px; width: 580px; height: 800px; border-radius: 72px; background: #263238; padding: 18px;
               box-shadow: 0 40px 80px rgba(38,50,56,.35); z-index: 20; }}
      #pass {{ position: absolute; left: 600px; top: 1010px; width: 400px; height: 230px; border-radius: 24px; background: #fff; overflow: hidden;
              box-shadow: 0 30px 60px rgba(38,50,56,.25); z-index: 20; opacity: 0; }}
      #p2card {{ position: absolute; left: 240px; top: 560px; width: 600px; height: 220px; border-radius: 40px; background: #263238; color: #fff; z-index: 20;
                display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 30px 60px rgba(38,50,56,.3); opacity: 0; }}
      #endcard {{ position: absolute; inset: 0; background: #F0F7FF; z-index: 60; opacity: 0; display: flex; flex-direction: column; align-items: center;
                 justify-content: center; gap: 56px; padding-bottom: 330px; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
      <div id="night" data-layout-ignore></div>
      <canvas id="gl" width="1080" height="1920" data-layout-ignore></canvas>
{tags}
      <div id="series"><span>Cargo, explained · 01</span><span>f16sefreight.com</span></div>
      <div id="phone">
        <div style="width:100%;height:100%;border-radius:56px;background:#fff;position:relative;overflow:hidden">
          <div style="height:150px;background:#F0F7FF;display:flex;align-items:center;gap:22px;padding:30px 34px 0">
            <div style="width:84px;height:84px;border-radius:50%;background:#FFBF9D;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:38px;color:#263238">B</div>
            <div><div style="font-weight:800;font-size:38px;color:#263238">Your buyer</div><div style="font-weight:500;font-size:28px;color:#5A6B8A">Frankfurt · online</div></div></div>
          <div style="position:absolute;left:30px;top:190px;max-width:420px;padding:24px 30px;border-radius:30px 30px 30px 8px;background:#F0F7FF;font-weight:600;font-size:34px;color:#263238">Where's my shipment?</div>
          <div id="dots" style="position:absolute;left:30px;top:330px;width:140px;height:80px;border-radius:30px 30px 30px 8px;background:#F0F7FF;display:flex;align-items:center;justify-content:center;gap:14px">
            <div class="dot" style="width:16px;height:16px;border-radius:50%;background:#5A6B8A"></div><div class="dot" style="width:16px;height:16px;border-radius:50%;background:#5A6B8A"></div><div class="dot" style="width:16px;height:16px;border-radius:50%;background:#5A6B8A"></div></div>
          <div id="msg" style="position:absolute;left:30px;top:330px;max-width:470px;padding:26px 32px;border-radius:30px 30px 30px 8px;background:#407BFF;font-weight:700;font-size:44px;line-height:1.2;color:#fff">I want my ₹44 lakh back.</div>
        </div>
      </div>
      <div id="pass">
        <div style="height:74px;background:#263238;color:#fff;font-weight:800;font-size:28px;display:flex;align-items:center;padding-left:26px">✈&nbsp; BOARDING PASS</div>
        <div style="padding:18px 26px 0;font-weight:700;font-size:24px;color:#5A6B8A">PASSENGER</div>
        <div style="padding:0 26px;font-weight:800;font-size:42px;color:#263238">1 box · 100 kg</div></div>
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
{JS.replace("__TT__", json.dumps(TT))}
    </script>
    <script>
      const tl = gsap.timeline({{ paused: true }});
{gsap_js()}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""


def themed(html):
    """The overlays in the warmer palette: charcoal for the question cards and term borders."""
    return (html.replace("background: #355594; color: #FFFFFF; font-family: Inter, sans-serif; font-weight: 800; font-size: 54px",
                         "background: #263238; color: #FFFFFF; font-family: Inter, sans-serif; font-weight: 800; font-size: 54px")
                .replace("border: 4px solid #355594; text-align: center", "border: 4px solid #263238; text-align: center"))


if __name__ == "__main__":
    comp = os.path.join(ROOT, "compositions")
    os.makedirs(comp, exist_ok=True)
    for f in os.listdir(comp):
        if f.endswith(".html"):
            os.remove(os.path.join(comp, f))
    open(os.path.join(comp, "terms.html"), "w").write(themed(B.terms_comp()))
    open(os.path.join(comp, "captions.html"), "w").write(B.captions())
    open(os.path.join(ROOT, "index.html"), "w").write(index())
    print(f"wrote 3D index.html + terms + captions, {TOTAL} s")
