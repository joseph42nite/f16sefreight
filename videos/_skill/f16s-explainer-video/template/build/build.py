"""Writes index.html and compositions/*.html for the 9:16 reel, v3: one continuous world.

Run: python3 build/build.py   (after build/record.py has written vo2/timing.json)

Structure learned from the reference (videos/_refs/video-23373/ANALYSIS.md):
- one world the camera travels through: a shared sky, skyline and ground under every scene, and
  scenes that pan or zoom into each other instead of cutting to a new page;
- ideas drawn onto the real objects (the waybill taped to the box, the box split into 100 kilos);
- a "This is called" card names each term after the picture shows it; question cards open each turn;
- small tags on the objects; it ends back in the shop where it began.
Every move is keyed to a spoken word in vo2/timing.json. No music; soft effects just off the words.
The previous slide-per-idea builder is kept as build/build_v2_slides.py.
"""
import json
import os
import re

from parts import BRAND, HAZE1, HAZE2, INK, MUTED, PAPER, PERI, RULE, SKY, icon, tile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(ROOT, "vo2", "timing.json")))
TAIL = 4.2
TOTAL = round(T["end"] + TAIL, 2)
GROUND = 1100   # the world's ground line; everything stands on it
OV = 0.35       # half a transition: neighbouring scenes overlap by 2 * OV while the camera moves


def W(beat, prefix, n=1, end=False):
    """Film time a word in `beat` starts (or ends), matched by lowercase prefix, nth occurrence."""
    hits = [w for w in T["words"] if w["beat"] == beat and w["w"].lower().startswith(prefix.lower())]
    if len(hits) < n:
        raise KeyError(f"beat {beat}: no word #{n} starting {prefix!r} in {[w['w'] for w in T['words'] if w['beat'] == beat]}")
    return hits[n - 1]["e" if end else "s"]


def BS(beat):
    return T["starts"][beat - 1]


# ── the journey: (scene, cut time, how the camera arrives) ───────────────────
CUTS = [("shop", 0, None), ("map", BS(2) - 0.2, "pan"), ("tarmac", W(2, "your") - 0.15, "pan"),
        ("waybill", W(3, "explain") + 0.1, "zoom"), ("weight", BS(7) - 0.25, "pull"), ("sdr", BS(9) - 0.25, "pan"),
        ("money", BS(10) - 0.25, "pan"), ("delay", BS(11) - 0.25, "pan"), ("deadline", BS(12) - 0.25, "pan"),
        ("protect", BS(13) - 0.25, "pan"), ("part2", BS(14) - 0.25, "pan"), ("end", BS(15) - 0.25, "pan")]
SCENES = []
for i, (sid, cut, arrive) in enumerate(CUTS):
    nxt = CUTS[i + 1] if i + 1 < len(CUTS) else None
    start = 0 if i == 0 else cut - OV
    end = TOTAL if nxt is None else nxt[1] + OV
    SCENES.append((sid, round(start, 2), round(end - start, 2), arrive, nxt[2] if nxt else None))
START = {sid: st for sid, st, *_ in SCENES}


class Tl:
    """Collects GSAP calls in film time; `@` in a call becomes the scene-local time."""

    def __init__(self, sid):
        self.sid, self.t0, self.lines = sid, START[sid], []

    def __call__(self, film_t, call):
        self.lines.append("    " + call.replace("@", str(max(0.0, round(film_t - self.t0, 2)))))


def scene_file(sid, body, tl, css="", focus=(540, 900)):
    """Wraps a scene in its camera: it arrives (pan / zoom / pull) and leaves the way the next scene arrives."""
    _, start, dur, arrive, leave = next(s for s in SCENES if s[0] == sid)
    fx, fy = focus
    cam = []
    if arrive == "pan":
        cam.append(f'    tl.fromTo("#{sid}-cam", {{ x: 1080 }}, {{ x: 0, duration: {2 * OV}, ease: "power2.inOut" }}, 0);')
    elif arrive == "zoom":
        cam.append(f'    tl.fromTo("#{sid}-cam", {{ scale: 0.35, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: {2 * OV}, ease: "power2.out" }}, 0);')
    elif arrive == "pull":
        cam.append(f'    tl.fromTo("#{sid}-cam", {{ scale: 2.6, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: {2 * OV}, ease: "power2.out" }}, 0);')
    out = round(dur - 2 * OV, 2)
    if leave == "pan":
        cam.append(f'    tl.to("#{sid}-cam", {{ x: -1080, duration: {2 * OV}, ease: "power2.inOut" }}, {out});')
    elif leave == "zoom":
        cam.append(f'    tl.to("#{sid}-cam", {{ scale: 4, opacity: 0, duration: {2 * OV}, ease: "power2.in" }}, {out});')
    elif leave == "pull":
        cam.append(f'    tl.to("#{sid}-cam", {{ scale: 0.4, opacity: 0, duration: {2 * OV}, ease: "power2.in" }}, {out});')
    js = "\n".join(tl.lines + cam)
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; overflow: hidden; }}
    #{sid}-cam {{ position: absolute; inset: 0; transform-origin: {fx}px {fy}px; }}
{css}
  </style>
  <div id="root" data-composition-id="{sid}" data-width="1080" data-height="1920">
    <div id="{sid}-cam" data-layout-allow-overflow>
{body}
    </div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js}
    window.__timelines["{sid}"] = tl;
  </script>
</template>
"""


# ── drawings ─────────────────────────────────────────────────────────────────
def hero(hid, width=320, waybill=False):
    """The hero box: one carton of phones, the same drawing everywhere (optionally with its waybill taped on)."""
    doc = (f'<g id="{hid}-doc"><rect x="150" y="96" width="130" height="150" rx="8" fill="{PAPER}" stroke="{BRAND}" stroke-width="5"/>'
           f'<rect x="150" y="96" width="130" height="30" rx="6" fill="{BRAND}"/>'
           f'<rect x="166" y="144" width="80" height="9" rx="4" fill="{HAZE1}"/><rect x="166" y="166" width="98" height="9" rx="4" fill="{RULE}"/>'
           f'<rect x="166" y="188" width="70" height="9" rx="4" fill="{HAZE1}"/>'
           f'<rect x="138" y="88" width="40" height="16" fill="{PERI}" opacity=".8" transform="rotate(-20 158 96)"/></g>') if waybill else ""
    return (f'<svg id="{hid}" viewBox="0 0 320 300" width="{width}" height="{width * 300 / 320:.0f}">'
            f'<rect x="10" y="40" width="300" height="250" rx="16" fill="{PAPER}" stroke="{BRAND}" stroke-width="7"/>'
            f'<rect x="100" y="42" width="34" height="246" fill="{HAZE1}"/>'
            f'<rect x="30" y="190" width="58" height="70" rx="8" fill="{SKY}" stroke="{PERI}" stroke-width="4"/>'
            f'<rect x="40" y="206" width="16" height="36" rx="4" fill="{INK}"/><rect x="62" y="206" width="16" height="36" rx="4" fill="{INK}"/>'
            f'{doc}</svg>')


def person(pid, width=270):
    """The exporter: cap, blue jacket, one working arm (#{pid}-arm, pivot at the shoulder 110,160)."""
    return f"""<svg id="{pid}" viewBox="0 0 300 560" width="{width}" height="{width * 560 / 300:.0f}">
        <rect x="110" y="300" width="34" height="230" rx="16" fill="{INK}"/><rect x="156" y="300" width="34" height="230" rx="16" fill="{INK}"/>
        <rect x="88" y="120" width="124" height="210" rx="48" fill="{BRAND}"/>
        <rect x="150" y="150" width="70" height="26" rx="13" fill="{PERI}" transform="rotate(40 160 160)"/>
        <circle cx="150" cy="68" r="52" fill="{PERI}"/><path d="M98 60 Q150 0 202 60 Z" fill="{INK}"/><rect x="92" y="54" width="120" height="14" rx="7" fill="{INK}"/>
        <g id="{pid}-arm"><rect x="96" y="150" width="28" height="200" rx="14" fill="{BRAND}"/>
          <g id="{pid}-held" opacity="0"><rect x="80" y="330" width="60" height="100" rx="11" fill="{INK}"/><rect x="88" y="338" width="44" height="84" rx="6" fill="{PERI}"/></g></g>
      </svg>"""


def tag(tid, text, style, solid=False):
    return f'<div id="{tid}" class="tag{" solid" if solid else ""}" style="{style}">{text}</div>'


def stamp(text, sid, size, rot, style):
    return (f'<div id="{sid}-wrap" style="position:absolute;transform:rotate({rot}deg);{style}">'
            f'<div id="{sid}" class="stamp" style="font-size:{size}px">{text}</div></div>')


def plane(pid, style):
    return (f'<div id="{pid}" data-layout-allow-overflow style="position:absolute;{style}">'
            f'<img src="assets/img/banner-plane.webp" alt="" style="width:100%;filter:drop-shadow(0 30px 60px rgba(53,85,148,.18))" /></div>')


def blocks(bid, x, base, cell=30, gap=3):
    """100 one-kilo blocks, 10 × 10, standing on y = base. Returns (html, side)."""
    side = 10 * cell + 9 * gap
    cells = "".join(f'<div class="{bid}-b" style="position:absolute;left:{c * (cell + gap)}px;top:{r * (cell + gap)}px;width:{cell}px;height:{cell}px;'
                    f'border-radius:5px;background:{PAPER};border:3px solid {BRAND}"></div>' for r in range(10) for c in range(10))
    return f'<div id="{bid}" style="position:absolute;left:{x}px;top:{base - side}px;width:{side}px;height:{side}px">{cells}</div>', side


def shop_room():
    """The exporter's shop: back wall, window, shelf, clock at 7:00, packing table."""
    shelf = "".join(f'<div style="position:absolute;left:{130 + i * 70}px;top:{560 - (i % 2) * 20}px;width:60px;height:{60 + (i % 2) * 20}px;border-radius:8px;background:{PAPER};border:4px solid {PERI}"></div>' for i in range(4))
    return f"""
      <div style="position:absolute;left:50px;top:380px;width:980px;height:{GROUND - 380}px;border-radius:36px 36px 0 0;background:{HAZE2};border:5px solid {PERI};border-bottom:0"></div>
      <div style="position:absolute;left:620px;top:440px;width:340px;height:230px;border-radius:24px;background:{SKY};border:6px solid {PERI}"></div>
      <div style="position:absolute;left:110px;top:640px;width:330px;height:14px;border-radius:7px;background:{PERI}"></div>{shelf}
      <svg style="position:absolute;left:120px;top:420px" width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="48" fill="{PAPER}" stroke="{BRAND}" stroke-width="7"/>
        <line x1="55" y1="55" x2="55" y2="20" stroke="{INK}" stroke-width="7" stroke-linecap="round"/><line x1="55" y1="55" x2="55" y2="80" stroke="{BRAND}" stroke-width="5" stroke-linecap="round"/></svg>
      <div style="position:absolute;left:170px;top:960px;width:580px;height:30px;border-radius:10px;background:{BRAND}"></div>
      <div style="position:absolute;left:200px;top:990px;width:24px;height:{GROUND - 990}px;background:{INK}"></div>
      <div style="position:absolute;left:696px;top:990px;width:24px;height:{GROUND - 990}px;background:{INK}"></div>"""


ENTER = 'ease: "expo.out"'
POP = 'ease: "back.out(1.8)"'
S = {}

# ── 1 shop ─ "Imagine you're shipping a box of phones abroad. A hundred kilos, worth fifty thousand dollars. That's about forty-four lakh rupees."
tl = Tl("shop")
ph = W(1, "phones")
for k in range(3):
    c = ph - 0.45 + k * 0.5
    tl(c, 'tl.to("#sh-me-arm", { rotation: -43, duration: 0.18, ease: "power2.inOut", svgOrigin: "110 160" }, @);')
    tl(c + 0.16, 'tl.fromTo("#sh-me-held", { opacity: 0 }, { opacity: 1, duration: 0.04, immediateRender: false }, @);')
    tl(c + 0.2, 'tl.to("#sh-me-arm", { rotation: 75, duration: 0.24, ease: "power2.inOut", svgOrigin: "110 160" }, @);')
    tl(c + 0.44, 'tl.to("#sh-me-held", { opacity: 0, duration: 0.04 }, @);')
    tl(c + 0.44, 'tl.fromTo("#sh-boxsvg", { scaleY: 1 }, { scaleY: 0.95, duration: 0.06, yoyo: true, repeat: 1, transformOrigin: "50% 100%", immediateRender: false }, @);')
tl(ph + 1.05, 'tl.to("#sh-me-arm", { rotation: 0, duration: 0.3, ease: "power2.out", svgOrigin: "110 160" }, @);')
tl(W(1, "abroad"), 'tl.fromTo("#sh-lid", { y: -200, rotation: -25, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.4, ' + POP + ' }, @);')
tl(W(1, "kilos") - 0.1, 'tl.fromTo("#sh-strip", { y: 0 }, { y: -280, duration: 0.5, ease: "steps(4)" }, @);')
tl(W(1, "kilos"), 'tl.fromTo("#sh-kg", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
tl(W(1, "fifty") - 0.05, 'tl.fromTo("#sh-tagwrap", { rotation: -70, opacity: 0, transformOrigin: "0 0" }, { rotation: 0, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.45)" }, @);')
tl(W(1, "forty") - 0.05, 'tl.fromTo("#sh-inr", { opacity: 0 }, { opacity: 1, duration: 0.25 }, @);')
S["shop"] = scene_file("shop", f"""
      {shop_room()}
      {tag("sh-time", "Tuesday · 7:00 PM", "left:250px;top:440px", solid=True)}
      <div style="position:absolute;left:600px;top:560px">{person("sh-me", 270)}</div>
      <div style="position:absolute;left:800px;top:880px;width:180px;height:90px;border-radius:14px;background:{PAPER};border:6px solid {BRAND}">
        {"".join(f'<div style="position:absolute;left:{12 + i * 40}px;top:-34px;width:32px;height:56px;border-radius:7px;background:{INK}"></div>' for i in range(4))}</div>
      <div style="position:absolute;left:830px;top:970px;width:20px;height:{GROUND - 970}px;background:{INK}"></div><div style="position:absolute;left:930px;top:970px;width:20px;height:{GROUND - 970}px;background:{INK}"></div>
      <div style="position:absolute;left:290px;top:930px;width:320px;height:30px;border-radius:8px;background:{INK}"></div>
      <div style="position:absolute;left:380px;top:1000px;width:140px;height:70px;border-radius:14px;background:{INK};overflow:hidden">
        <div id="sh-strip" data-layout-ignore style="position:absolute;left:0;top:0;width:100%">
          {"".join(f'<div style="height:70px;line-height:70px;text-align:center;color:{PAPER};font-weight:800;font-size:34px">{n}</div>' for n in (0, 25, 50, 75, 100))}
        </div></div>
      {tag("sh-kg", "100 kg", "left:530px;top:1012px")}
      <div style="position:absolute;left:330px;top:705px">{hero("sh-boxsvg", 240)}
        <div id="sh-lid" style="position:absolute;left:0;top:30px;width:240px;height:36px;border-radius:10px;background:{HAZE2};border:6px solid {BRAND}"></div></div>
      <div id="sh-tagwrap" style="position:absolute;left:560px;top:720px;width:0;height:0">
        <div style="position:absolute;left:-30px;top:0;width:330px">
          <div style="margin-left:30px;width:5px;height:60px;background:{BRAND};transform:rotate(-38deg);transform-origin:0 0"></div>
          <div style="margin-left:30px;width:280px;padding:18px 24px;border-radius:22px;background:{PAPER};border:6px solid {BRAND};box-shadow:0 20px 40px rgba(53,85,148,.15)">
            <div style="font-weight:800;font-size:50px;color:{INK};line-height:1.1">$50,000</div>
            <div id="sh-inr" style="font-weight:700;font-size:38px;color:{BRAND}">≈ ₹44 lakh</div></div>
        </div></div>
""", tl)

# ── 2 map ─ "The flight is delayed." The camera rises to a map: Mumbai → Frankfurt, the plane stops halfway.
tl = Tl("map")
fly = round(W(2, "delayed") - START["map"] - 0.4, 2)
tl(START["map"] + 0.4, 'tl.fromTo("#mp-route", { strokeDashoffset: 760 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, @);')
tl(START["map"] + 0.5, f'tl.fromTo("#mp-plane", {{ x: 0, y: 0 }}, {{ x: 300, y: -210, duration: {fly}, ease: "power1.out" }}, @);')
tl(W(2, "delayed"), 'tl.fromTo("#mp-delayed", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ' + POP + ' }, @);')
grid = f"repeating-linear-gradient(0deg,{HAZE2} 0 2px,transparent 2px 60px),repeating-linear-gradient(90deg,{HAZE2} 0 2px,transparent 2px 60px)"
S["map"] = scene_file("map", f"""
      <div style="position:absolute;left:90px;top:420px;width:900px;height:660px;border-radius:36px;background:{PAPER};background-image:{grid};box-shadow:0 30px 60px rgba(53,85,148,.15);overflow:hidden">
        <svg width="900" height="660" viewBox="0 0 900 660" style="position:absolute;inset:0">
          <path d="M60 520 Q180 380 300 470 T560 330 L900 260 L900 660 L60 660 Z" fill="{HAZE1}" opacity=".6"/>
          <path d="M520 0 Q600 120 720 90 T900 140 L900 0 Z" fill="{HAZE1}" opacity=".6"/>
          <path id="mp-route" d="M160 540 L760 120" stroke="{BRAND}" stroke-width="8" stroke-linecap="round" stroke-dasharray="760" fill="none"/>
          <circle cx="160" cy="540" r="16" fill="{BRAND}"/><circle cx="760" cy="120" r="16" fill="{BRAND}"/>
        </svg>
        {tag("mp-bom", "Mumbai", "left:110px;top:570px")}
        {tag("mp-fra", "Frankfurt", "left:640px;top:40px")}
        <div id="mp-plane" style="position:absolute;left:110px;top:490px;width:100px;height:100px;border-radius:50%;background:{BRAND};display:flex;align-items:center;justify-content:center">
          <div style="transform:rotate(-35deg) scaleX(-1)">{icon("plane", 64, PAPER)}</div></div>
        {tag("mp-delayed", "Delayed · 48 h", "left:450px;top:360px", solid=True)}
      </div>
""", tl)

# ── 3 tarmac ─ "Your box sits at the airport for two days, and your buyer wants every rupee back. So who pays? Let me explain."
tl = Tl("tarmac")
t2 = W(2, "two")
tl(START["tarmac"] + 0.3, 'tl.fromTo("#tm-cart", { x: -900 }, { x: 0, duration: 1.2, ease: "power2.out" }, @);')
tl(START["tarmac"] + 0.3, 'tl.fromTo(".tm-wheel", { rotation: 0 }, { rotation: 720, duration: 1.2, ease: "power2.out", svgOrigin: "0 0" }, @);')
tl(t2 - 0.1, 'tl.fromTo("#tm-orbit", { rotation: -60 }, { rotation: 660, duration: 1.3, ease: "none" }, @);')
for a, b in ((0.27, 0.54), (0.81, 1.08)):  # the sun is below the horizon between 90° and 270° of each turn
    tl(t2 - 0.1 + a, 'tl.to("#tm-night", { opacity: 0.45, duration: 0.1 }, @);')
    tl(t2 - 0.1 + b, 'tl.to("#tm-night", { opacity: 0, duration: 0.1 }, @);')
tl(t2 - 0.1, 'tl.fromTo("#tm-day1", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.25, ' + POP + ' }, @);')
tl(t2 + 0.55, 'tl.to("#tm-day1", { opacity: 0, duration: 0.08 }, @);')
tl(t2 + 0.55, 'tl.fromTo("#tm-day2", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.2, ' + POP + ' }, @);')
tl(W(2, "buyer") - 0.4, 'tl.fromTo("#tm-phone", { y: 1700 }, { y: 0, duration: 0.5, ' + ENTER + ' }, @);')
tl(W(2, "buyer") - 0.05, 'tl.fromTo("#tm-dots", { opacity: 0 }, { opacity: 1, duration: 0.1 }, @);')
tl(W(2, "buyer") - 0.05, 'tl.fromTo(".tm-dot", { y: 0 }, { y: -10, duration: 0.15, yoyo: true, repeat: 3, stagger: 0.08, ease: "sine.inOut" }, @);')
tl(W(2, "every") - 0.1, 'tl.to("#tm-dots", { opacity: 0, duration: 0.05 }, @);')
tl(W(2, "every") - 0.1, 'tl.fromTo("#tm-msg", { opacity: 0, scale: 0.85, transformOrigin: "0% 100%" }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
tl(W(3, "so") - 0.35, 'tl.to("#tm-phone", { y: 1800, duration: 0.4, ease: "power3.in" }, @);')
tl(W(3, "who") - 0.2, 'tl.fromTo("#tm-me", { x: -400 }, { x: 0, duration: 0.5, ' + ENTER + ' }, @);')
tl(W(3, "who") - 0.1, 'tl.fromTo(["#tm-you", "#tm-air"], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ', stagger: 0.1 }, @);')
tl(W(3, "who"), 'tl.fromTo("#tm-coin", { x: 0, opacity: 0 }, { x: 0, opacity: 1, duration: 0.12 }, @);')
tl(W(3, "who") + 0.1, 'tl.fromTo("#tm-coin", { x: 0 }, { x: 560, duration: 0.32, ease: "power1.inOut", yoyo: true, repeat: 3, immediateRender: false }, @);')
tl(W(3, "explain") - 0.45, 'tl.to(["#tm-coin", "#tm-you", "#tm-air"], { opacity: 0, duration: 0.2 }, @);')
tl(W(3, "explain") - 0.4, 'tl.fromTo("#tm-boxsvg-doc", { opacity: 0, scale: 0.4, transformOrigin: "215px 170px" }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
wheels = "".join(f'<svg style="position:absolute;left:{x - 34}px;top:224px" width="68" height="68" viewBox="-34 -34 68 68"><circle r="30" fill="{INK}"/><g class="tm-wheel"><path d="M-16 0 H16 M0 -16 V16" stroke="{PERI}" stroke-width="6"/></g></svg>' for x in (60, 300, 470))
S["tarmac"] = scene_file("tarmac", f"""
      <div id="tm-night" style="position:absolute;inset:0;background:{PERI};opacity:0"></div>
      <div id="tm-orbit" style="position:absolute;left:540px;top:{GROUND}px;width:0;height:0">
        <div style="position:absolute;left:-70px;top:-800px;width:140px;height:140px;border-radius:50%;background:{PAPER};border:10px solid {PERI}"></div>
        <svg style="position:absolute;left:-60px;top:660px" width="120" height="120" viewBox="0 0 120 120"><path d="M80 10 a52 52 0 1 0 30 80 a42 42 0 1 1 -30 -80 z" fill="{BRAND}"/></svg>
      </div>
      {plane("tm-plane", "left:470px;top:640px;width:620px")}
      {tag("tm-air", "Airline", "left:760px;top:600px", solid=True)}
      <div id="tm-cart" style="position:absolute;left:260px;top:{GROUND - 290}px;width:560px;height:300px">
        <div style="position:absolute;left:30px;top:10px">{hero("tm-boxsvg", 220, waybill=True)}</div>
        {tag("tm-day1", "Day 1", "left:40px;top:-40px", solid=True).replace("<div ", "<div data-layout-allow-overlap ", 1)}{tag("tm-day2", "Day 2", "left:40px;top:-40px", solid=True).replace("<div ", "<div data-layout-allow-overlap ", 1)}
        <div style="position:absolute;left:10px;top:216px;width:380px;height:36px;border-radius:12px;background:{BRAND}"></div>
        <div style="position:absolute;left:400px;top:150px;width:110px;height:110px;border-radius:20px 20px 12px 12px;background:{INK}"></div>
        <div style="position:absolute;left:416px;top:164px;width:78px;height:44px;border-radius:10px;background:{PERI}"></div>
        <div style="position:absolute;left:380px;top:226px;width:30px;height:14px;background:{INK}"></div>
        {wheels}
      </div>
      <div id="tm-me" style="position:absolute;left:10px;top:{GROUND - 470}px">{person("tm-mesvg", 250)}</div>
      {tag("tm-you", "You", "left:80px;top:" + str(GROUND - 530) + "px", solid=True)}
      <div id="tm-coin" style="position:absolute;left:150px;top:560px;width:140px;height:140px;border-radius:50%;background:{PERI};border:8px solid {BRAND};display:flex;flex-direction:column;align-items:center;justify-content:center;color:{BRAND};font-weight:800">
        <div style="font-size:48px;line-height:1">₹44</div><div style="font-size:24px">lakh</div></div>
      <div id="tm-phone" style="position:absolute;left:250px;top:320px;width:580px;height:800px;border-radius:72px;background:{INK};padding:18px;box-shadow:0 40px 80px rgba(53,85,148,.3)">
        <div style="width:100%;height:100%;border-radius:56px;background:{PAPER};position:relative;overflow:hidden">
          <div style="height:150px;background:{SKY};display:flex;align-items:center;gap:22px;padding:30px 34px 0">
            <div style="width:84px;height:84px;border-radius:50%;background:{HAZE1};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:38px;color:{BRAND}">B</div>
            <div><div style="font-weight:800;font-size:38px;color:{INK}">Your buyer</div><div style="font-weight:500;font-size:28px;color:{MUTED}">Frankfurt · online</div></div></div>
          <div style="position:absolute;left:30px;top:190px;max-width:420px;padding:24px 30px;border-radius:30px 30px 30px 8px;background:{SKY};font-weight:600;font-size:34px;color:{INK}">Where's my shipment?</div>
          <div id="tm-dots" style="position:absolute;left:30px;top:330px;width:140px;height:80px;border-radius:30px 30px 30px 8px;background:{SKY};display:flex;align-items:center;justify-content:center;gap:14px">
            {"".join(f'<div class="tm-dot" style="width:16px;height:16px;border-radius:50%;background:{MUTED}"></div>' for _ in range(3))}</div>
          <div id="tm-msg" style="position:absolute;left:30px;top:330px;max-width:470px;padding:26px 32px;border-radius:30px 30px 30px 8px;background:{BRAND};font-weight:700;font-size:44px;line-height:1.2;color:{PAPER}">I want my ₹44 lakh back.</div>
        </div>
      </div>
""", tl, focus=(437, GROUND - 165))

# ── 4–6 waybill ─ the camera is on the box: the air waybill taped to it. "...contract of carriage... N. V. D."
tl = Tl("waybill")
tl(W(4, "plane") - 0.1, 'tl.fromTo("#wb-pass", { opacity: 0, x: 120, rotation: 12 }, { opacity: 1, x: 0, rotation: 6, duration: 0.45, ' + POP + ' }, @);')
tl(BS(5) - 0.2, 'tl.to("#wb-pass", { opacity: 0, x: 200, duration: 0.3, ease: "power3.in" }, @);')
tl(W(5, "contract", 1), 'tl.fromTo("#wb-sig1", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.2)" }, @);')
tl(W(5, "airline", 1), 'tl.fromTo("#wb-sig2", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.2)" }, @);')
tl(W(5, "promises") - 0.1, 'tl.fromTo("#wb-promise", { opacity: 0 }, { opacity: 1, duration: 0.3 }, @);')
tl(W(5, "stops") - 0.25, 'tl.fromTo("#wb-line", { scaleX: 0 }, { scaleX: 1, duration: 0.45, ' + ENTER + ' }, @);')
tl(W(5, "stops"), 'tl.fromTo("#wb-stop", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
tl(W(6, "box") - 0.1, 'tl.fromTo("#wb-field", { borderColor: "#ABC0FF" }, { borderColor: "#355594", duration: 0.25 }, @);')
tl(W(6, "declared", 1) - 0.1, 'tl.to(["#wb-stop", "#wb-promise"], { opacity: 0, duration: 0.2 }, @);')
tl(W(6, "declared", 1) - 0.1, 'tl.fromTo("#wb-field", { scale: 1 }, { scale: 1.08, duration: 0.5, ease: "back.out(2)", transformOrigin: "50% 50%" }, @);')
for i, lw in enumerate(("n.", "v.", "d.")):
    tl(W(6, lw) - 0.05, f'tl.fromTo("#wb-l{i}", {{ opacity: 0, scale: 1.8 }}, {{ opacity: 1, scale: 1, duration: 0.25, {POP} }}, @);')
rows = "".join(f'<div style="position:absolute;left:40px;top:{y}px;width:{w}px;height:14px;border-radius:7px;background:{c}"></div>'
               for y, w, c in ((150, 360, HAZE1), (180, 560, RULE), (232, 300, HAZE1), (262, 500, RULE), (480, 340, HAZE1), (510, 520, RULE)))
sigs = "".join(f'<div style="text-align:center"><div id="wb-sig{n}" style="width:56px;height:56px;margin:0 auto 8px;border-radius:50%;background:{BRAND};display:flex;align-items:center;justify-content:center">{icon("check", 40, PAPER)}</div>'
               f'<div style="width:200px;border-top:4px solid {INK};padding-top:6px;font-weight:700;font-size:24px;color:{MUTED}">{who}</div></div>' for n, who in ((1, "YOU"), (2, "AIRLINE")))
S["waybill"] = scene_file("waybill", f"""
      <div style="position:absolute;inset:0;background:{HAZE2}"></div>
      <div style="position:absolute;left:0;top:0;width:150px;height:1920px;background:{HAZE1}"></div>
      <div id="wb-doc" style="position:absolute;left:140px;top:540px;width:800px;height:620px;border-radius:20px;background:{PAPER};border:5px solid {BRAND};box-shadow:0 40px 80px rgba(53,85,148,.18);transform-origin:400px 390px">
        <div style="height:100px;border-radius:14px 14px 0 0;background:{BRAND};color:{PAPER};font-weight:800;font-size:48px;letter-spacing:.05em;display:flex;align-items:center;justify-content:center">AIR WAYBILL</div>
        <div style="position:absolute;left:-30px;top:-24px;width:120px;height:40px;background:{PERI};opacity:.8;transform:rotate(-14deg)"></div>
        <div style="position:absolute;right:-30px;top:-24px;width:120px;height:40px;background:{PERI};opacity:.8;transform:rotate(14deg)"></div>
        <div id="wb-promise" style="position:absolute;left:40px;top:112px;font-weight:700;font-size:26px;color:{BRAND}">The airline promises…</div>
        {rows}
        <div id="wb-line" style="position:absolute;left:0;top:300px;width:100%;height:0;border-top:6px dashed {BRAND};transform-origin:0 50%"></div>
        {tag("wb-stop", "Promise stops here", "left:400px;top:258px", solid=True)}
        <div id="wb-field" style="position:absolute;left:40px;top:330px;width:720px;height:120px;border-radius:14px;border:5px solid {PERI};background:{SKY};padding:12px 20px">
          <div style="font-weight:700;font-size:22px;letter-spacing:.1em;text-transform:uppercase;color:{MUTED}">Declared value for carriage</div>
          <div style="display:flex;gap:18px;margin-top:4px">{"".join(f'<div id="wb-l{i}" style="font-weight:900;font-size:56px;color:{BRAND};line-height:1.1">{L}</div>' for i, L in enumerate("NVD"))}</div>
        </div>
        <div style="position:absolute;left:40px;bottom:26px;right:40px;display:flex;justify-content:space-between">{sigs}</div>
      </div>
      <div id="wb-pass" data-layout-allow-overlap style="position:absolute;left:600px;top:880px;width:400px;height:240px;border-radius:24px;background:{PAPER};box-shadow:0 30px 60px rgba(53,85,148,.2);overflow:hidden">
        <div style="height:74px;background:{BRAND};color:{PAPER};font-weight:800;font-size:28px;display:flex;align-items:center;gap:12px;padding-left:26px">{icon("plane", 40, PAPER)}BOARDING PASS</div>
        <div style="padding:20px 26px 0;font-weight:700;font-size:24px;color:{MUTED}">PASSENGER</div>
        <div style="padding:0 26px;font-weight:800;font-size:42px;color:{INK}">1 box · 100 kg</div></div>
""", tl, focus=(540, 780))

# ── 7–8 weight ─ pull back to the tarmac: the box on a scale becomes 100 one-kilo blocks; the price tag bounces off.
tl = Tl("weight")
plat = GROUND - 90
pile, side = blocks("wt-pile", 377, plat)
top = plat - side
tl(W(7, "only") - 0.2, 'tl.to("#wt-box", { opacity: 0, scale: 0.9, duration: 0.25, transformOrigin: "50% 100%" }, @);')
tl(W(7, "only") - 0.1, 'tl.fromTo(".wt-pile-b", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)", stagger: { each: 0.006, grid: [10, 10], from: "end" } }, @);')
tl(W(7, "weight") + 0.1, 'tl.fromTo("#wt-1kg", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ' + POP + ' }, @);')
tl(W(7, "value") - 0.3, 'tl.fromTo("#wt-tag", { y: -600, opacity: 0, rotation: 0 }, { y: 0, opacity: 1, rotation: 0, duration: 0.35, ease: "power2.in" }, @);')
tl(W(7, "value") + 0.05, 'tl.to("#wt-tag", { y: 260, x: 300, rotation: 55, opacity: 0, duration: 0.7, ease: "power2.in" }, @);')
tl(W(7, "value") + 0.05, 'tl.fromTo("#wt-x", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, @);')
tl(W(7, "value") + 0.75, 'tl.to("#wt-x", { opacity: 0, duration: 0.2 }, @);')
tl(W(8, "twenty") - 0.15, 'tl.fromTo("#wt-strip", { y: 0 }, { y: -74, duration: 0.2, ' + ENTER + ' }, @);')
tl(W(8, "twenty") - 0.1, 'tl.fromTo(".wt-pile-b", { backgroundColor: "#FFFFFF" }, { backgroundColor: "#ABC0FF", duration: 0.12, stagger: { each: 0.004, grid: [10, 10], from: "start" }, immediateRender: false }, @);')
tl(W(8, "kilo") - 0.05, 'tl.fromTo("#wt-each", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
S["weight"] = scene_file("weight", f"""
      <div style="position:absolute;left:260px;top:{plat}px;width:560px;height:40px;border-radius:12px;background:{INK}"></div>
      <div style="position:absolute;left:500px;top:{plat + 40}px;width:80px;height:50px;background:{INK}"></div>
      <div style="position:absolute;left:330px;top:{GROUND + 10}px;width:420px;height:80px;border-radius:18px;background:{BRAND};overflow:hidden;color:{PAPER};text-align:center">
        <div id="wt-strip" data-layout-ignore style="position:absolute;left:0;top:0;width:100%">
          <div style="height:74px;line-height:80px;font-weight:800;font-size:44px">100 kg</div>
          <div style="height:74px;line-height:80px;font-weight:800;font-size:44px">26 SDR per kg</div></div></div>
      <div id="wt-box" style="position:absolute;left:420px;top:{plat - 225}px">{hero("wt-boxsvg", 240, waybill=True)}</div>
      {pile}
      {tag("wt-1kg", "1 kg", f"left:250px;top:{top + 4}px")}
      <div id="wt-tag" style="position:absolute;left:600px;top:{top - 130}px;width:220px;height:110px;border-radius:16px;background:{PAPER};border:6px solid {BRAND};display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="font-weight:800;font-size:40px;color:{INK};line-height:1">$50,000</div><div style="font-weight:700;font-size:26px;color:{BRAND}">value</div></div>
      <div id="wt-x" style="position:absolute;left:770px;top:{top - 180}px">{icon("cross", 160, INK)}</div>
      {tag("wt-each", "Each kilo = 26 SDR", f"left:330px;top:{top - 90}px", solid=True)}
""", tl, focus=(540, 860))

# ── 9 sdr ─ "SDR stands for Special Drawing Rights: a currency made by the IMF from a basket of world currencies..."
tl = Tl("sdr")
tl(START["sdr"] + 0.4, 'tl.fromTo("#sd-basket", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.4, ' + ENTER + ' }, @);')
tl(W(9, "i.") - 0.1, 'tl.fromTo("#sd-imf", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
for i in range(5):
    tl(W(9, "world") - 0.15 + i * 0.12, f'tl.fromTo("#sd-c{i}", {{ y: -760, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.45, ease: "bounce.out" }}, @);')
tl(W(9, "one") - 0.15, 'tl.to(["#sd-c0", "#sd-c1", "#sd-c2", "#sd-c3", "#sd-c4"], { x: (i) => [180, 0, -180, 90, -90][i], y: -140, scale: 0.5, opacity: 0, duration: 0.35, ease: "power3.in" }, @);')
tl(W(9, "one") - 0.1, 'tl.to("#sd-imf", { opacity: 0, duration: 0.2 }, @);')
tl(W(9, "one") + 0.15, 'tl.fromTo("#sd-sdr", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, @);')
tl(W(9, "rupees") - 0.3, 'tl.fromTo("#sd-inr", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
coins = "".join(
    f'<div id="sd-c{i}" style="position:absolute;left:{x}px;top:{y}px;width:150px;height:150px;border-radius:50%;background:{PERI};border:8px solid {BRAND};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:66px;color:{BRAND}">{s}</div>'
    for i, (s, x, y) in enumerate(zip(("$", "€", "£", "¥", "元"), (285, 465, 645, 375, 555), (720, 720, 720, 610, 610))))
S["sdr"] = scene_file("sdr", f"""
      <div id="sd-basket" style="position:absolute;left:220px;top:{GROUND - 280}px;width:640px;height:280px">
        <div style="position:absolute;left:0;top:30px;width:640px;height:250px;border-radius:0 0 90px 90px;background:{BRAND}"></div>
        {"".join(f'<div style="position:absolute;left:{70 + i * 100}px;top:60px;width:14px;height:190px;border-radius:7px;background:{INK}"></div>' for i in range(6))}
        <div style="position:absolute;left:-24px;top:10px;width:688px;height:40px;border-radius:20px;background:{INK}"></div>
      </div>
      {tag("sd-imf", "Made by the IMF", f"left:380px;top:{GROUND - 160}px", solid=True)}
      {coins}
      <div id="sd-sdr" style="position:absolute;left:375px;top:560px;width:330px;height:330px;border-radius:50%;background:{BRAND};border:14px solid {PERI};box-shadow:0 30px 60px rgba(53,85,148,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;color:{PAPER}">
        <div style="font-weight:700;font-size:42px">1</div><div style="font-weight:900;font-size:110px;line-height:1">SDR</div></div>
      {tag("sd-inr", "≈ ₹120 · $1.35", "left:410px;top:905px", solid=True)}
""", tl)

# ── 10 money ─ "For our hundred kilos, about thirty-five hundred dollars. Roughly three lakh rupees, for goods worth forty-four lakh."
tl = Tl("money")
mpile, mside = blocks("mo-pile", 70, GROUND, cell=22, gap=2)
tl(START["money"] + 0.4, 'tl.fromTo("#mo-pile", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ' + ENTER + ' }, @);')
tl(W(10, "hundred") - 0.1, 'tl.fromTo("#mo-sum", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ' + POP + ' }, @);')
tl(W(10, "thirty") - 0.15, 'tl.fromTo("#mo-small", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.45, ' + POP + ' }, @);')
tl(W(10, "three") - 0.1, 'tl.fromTo("#mo-small-t", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
tl(W(10, "forty") - 0.25, 'tl.fromTo("#mo-big", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.8, ' + ENTER + ' }, @);')
tl(W(10, "forty") + 0.3, 'tl.fromTo("#mo-big-t", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
bills = f"repeating-linear-gradient(180deg,{PERI} 0 34px,{BRAND} 34px 40px)"
S["money"] = scene_file("money", f"""
      {mpile}
      {tag("mo-sum", "100 kg × 26 SDR = 2,600 SDR", "left:70px;top:620px", solid=True)}
      <div id="mo-small" style="position:absolute;left:470px;top:{GROUND - 130}px;width:190px;height:130px;border-radius:14px;border:6px solid {BRAND};background:{bills}"></div>
      <div id="mo-small-t" style="position:absolute;left:420px;top:{GROUND - 330}px;width:290px;text-align:center">
        <div class="who">Airline pays</div><div class="amt">≈ ₹3 lakh</div><div class="usd">about $3,500</div></div>
      <div id="mo-big" style="position:absolute;left:770px;top:{GROUND - 480}px;width:220px;height:480px;border-radius:14px;border:6px solid {BRAND};background:{bills}"></div>
      <div id="mo-big-t" style="position:absolute;left:720px;top:{GROUND - 690}px;width:320px;text-align:center">
        <div class="who">Your goods</div><div class="amt">₹44 lakh</div><div class="usd">about $50,000</div></div>
""", tl, f"""
    .amt {{ font-weight: 800; font-size: 64px; color: {INK}; white-space: nowrap; line-height: 1.05; }}
    .usd {{ font-weight: 600; font-size: 30px; color: {MUTED}; }}
    .who {{ font-weight: 700; font-size: 28px; color: {BRAND}; text-transform: uppercase; letter-spacing: .1em; }}
""")

# ── 11 delay ─ "What about the delay? It counts, but only for losses you can prove it caused."
tl = Tl("delay")
ticks = "".join(f'<line x1="150" y1="22" x2="150" y2="{42 if i % 3 == 0 else 34}" stroke="{BRAND}" stroke-width="{7 if i % 3 == 0 else 4}" transform="rotate({i * 30} 150 150)"/>' for i in range(12))
tl(W(11, "delay") - 0.1, 'tl.fromTo("#dl-min", { rotation: 0, svgOrigin: "150 150" }, { rotation: 1080, duration: 1.1, ease: "power2.inOut" }, @);')
tl(W(11, "delay") - 0.1, 'tl.fromTo("#dl-hr", { rotation: 0, svgOrigin: "150 150" }, { rotation: 90, duration: 1.1, ease: "power2.inOut" }, @);')
tl(W(11, "counts") - 0.1, 'tl.fromTo("#dl-counts", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
tl(W(11, "losses") - 0.15, 'tl.fromTo("#dl-folder", { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: 0.4, ' + ENTER + ' }, @);')
for i in range(3):
    tl(W(11, "losses") + i * 0.15, f'tl.fromTo("#dl-r{i}", {{ opacity: 0, y: -420 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }}, @);')
    tl(W(11, "prove") - 0.2 + i * 0.06, f'tl.to("#dl-r{i}", {{ y: 250, duration: 0.25, ease: "power2.in" }}, @);')
tl(W(11, "prove"), 'tl.fromTo("#dl-proof", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
receipts = "".join(
    f'<div id="dl-r{i}" data-layout-allow-overlap style="position:absolute;left:{x}px;top:640px;width:170px;height:210px;border-radius:12px;background:{PAPER};border:4px solid {PERI};padding:20px 18px">'
    f'<div style="font-weight:800;font-size:34px;color:{BRAND}">₹</div><div style="font-weight:700;font-size:26px;color:{MUTED}">missed sale</div>'
    + "".join(f'<div style="height:10px;border-radius:5px;background:{RULE};margin-top:12px;width:{w}%"></div>' for w in (90, 60)) + '</div>'
    for i, x in enumerate((440, 610, 780)))
S["delay"] = scene_file("delay", f"""
      {plane("dl-plane", "left:-120px;top:760px;width:560px")}
      <svg style="position:absolute;left:90px;top:470px" width="300" height="300" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="138" fill="{PAPER}" stroke="{BRAND}" stroke-width="10"/>{ticks}
        <g id="dl-hr"><line x1="150" y1="150" x2="150" y2="85" stroke="{INK}" stroke-width="12" stroke-linecap="round"/></g>
        <g id="dl-min"><line x1="150" y1="150" x2="150" y2="50" stroke="{BRAND}" stroke-width="8" stroke-linecap="round"/></g>
        <circle cx="150" cy="150" r="12" fill="{INK}"/></svg>
      {tag("dl-counts", "Delay counts", "left:110px;top:790px", solid=True)}
      {receipts}
      <svg id="dl-folder" style="position:absolute;left:420px;top:{GROUND - 330}px" width="560" height="330" viewBox="0 0 560 330">
        <path d="M10 40 Q10 20 30 20 L190 20 L225 54 L530 54 Q550 54 550 74 L550 320 Q550 330 540 330 L20 330 Q10 330 10 320 Z" fill="{BRAND}"/>
        <path d="M10 120 Q10 100 30 100 L530 100 Q550 100 550 120 L550 320 Q550 330 540 330 L20 330 Q10 330 10 320 Z" fill="{PERI}" stroke="{BRAND}" stroke-width="6"/></svg>
      {stamp("PROOF", "dl-proof", 84, -8, f"left:540px;top:{GROUND - 170}px")}
""", tl)

# ── 12 deadline ─ "Complain in writing within twenty-one days, and go to court within two years, or the claim is gone."
tl = Tl("deadline")
tl(START["deadline"] + 0.4, 'tl.fromTo("#dd-line", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, @);')
tl(START["deadline"] + 0.45, 'tl.fromTo("#dd-n0", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
tl(START["deadline"] + 0.6, 'tl.fromTo("#dd-claim", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.35, ' + POP + ' }, @);')
tl(W(12, "twenty") - 0.15, 'tl.fromTo("#dd-n1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
tl(W(12, "twenty") - 0.1, 'tl.to("#dd-claim", { x: 330, duration: 0.6, ease: "power2.inOut" }, @);')
tl(W(12, "two") - 0.15, 'tl.fromTo("#dd-n2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ' + POP + ' }, @);')
tl(W(12, "two") - 0.1, 'tl.to("#dd-claim", { x: 690, duration: 0.6, ease: "power2.inOut" }, @);')
tl(W(12, "gone") - 0.35, 'tl.to("#dd-claim", { x: 900, y: 360, rotation: 60, opacity: 0, filter: "blur(8px)", duration: 0.7, ease: "power2.in" }, @);')


def dnode(nid, x, big, small):
    return (f'<div id="{nid}" style="position:absolute;left:{x - 140}px;top:856px;width:280px;text-align:center">'
            f'<div style="width:60px;height:60px;margin:0 auto;border-radius:50%;background:{BRAND};border:10px solid {HAZE1}"></div>'
            f'<div style="font-weight:800;font-size:52px;color:{INK};margin-top:14px;line-height:1">{big}</div>'
            f'<div style="font-weight:600;font-size:28px;color:{MUTED}">{small}</div></div>')


S["deadline"] = scene_file("deadline", f"""
      <div id="dd-line" style="position:absolute;left:150px;top:880px;width:760px;height:12px;border-radius:6px;background:{BRAND};transform-origin:0 50%"></div>
      {dnode("dd-n0", 150, "Day 0", "delivery")}{dnode("dd-n1", 500, "21 days", "complain in writing")}{dnode("dd-n2", 900, "2 years", "go to court")}
      <div id="dd-claim" style="position:absolute;left:70px;top:650px;width:170px;height:170px;border-radius:18px;background:{PAPER};border:5px solid {BRAND};box-shadow:0 20px 40px rgba(53,85,148,.2);padding:20px 22px">
        <div style="font-weight:900;font-size:38px;color:{BRAND};letter-spacing:.04em">CLAIM</div>
        <div style="height:10px;border-radius:5px;background:{RULE};margin-top:16px"></div><div style="height:10px;width:70%;border-radius:5px;background:{RULE};margin-top:12px"></div>
        <div style="height:10px;width:85%;border-radius:5px;background:{RULE};margin-top:12px"></div></div>
""", tl)

# ── 13 protect ─ "Write the real value in that box and pay an extra fee, and the limit goes up. Or buy cargo insurance... don't cover delay."
tl = Tl("protect")
tl(W(13, "write") - 0.3, 'tl.fromTo("#pr-o1", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ' + ENTER + ' }, @);')
tl(W(13, "real") - 0.05, 'tl.fromTo("#pr-nvd", { clipPath: "inset(0 0% 0 0)" }, { clipPath: "inset(0 0% 0 100%)", duration: 0.3, ease: "power3.in" }, @);')
tl(W(13, "value"), 'tl.fromTo("#pr-val", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, @);')
tl(W(13, "fee") - 0.1, 'tl.fromTo("#pr-fee", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ' + POP + ' }, @);')
tl(W(13, "limit") - 0.1, 'tl.fromTo("#pr-limit", { y: 0 }, { y: -330, duration: 0.8, ease: "power2.out" }, @);')
tl(W(13, "or") - 0.3, 'tl.to("#pr-o1", { y: -500, opacity: 0, duration: 0.4, ease: "power3.in" }, @);')
tl(W(13, "or") - 0.1, 'tl.fromTo("#pr-o2", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: 0.45, ' + ENTER + ' }, @);')
tl(W(13, "insurance") - 0.15, 'tl.fromTo("#pr-canopy", { scaleX: 0.08, scaleY: 0.3, opacity: 0, transformOrigin: "50% 100%" }, { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.5, ' + POP + ' }, @);')
tl(W(13, "most") - 0.2, 'tl.fromTo("#pr-clock", { opacity: 0, x: 160 }, { opacity: 1, x: 0, duration: 0.4, ' + ENTER + ' }, @);')
for i in range(8):
    tl(W(13, "most") + (i % 4) * 0.12, f'tl.fromTo("#pr-rain{i}", {{ y: -120, opacity: 0 }}, {{ y: 260, opacity: 1, duration: 0.6, ease: "none", repeat: 3 }}, @);')
tl(W(13, "delay") - 0.1, 'tl.fromTo("#pr-x", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, @);')
ppile, pside = blocks("pr-pile", 640, GROUND, cell=26, gap=3)
rain = "".join(f'<div id="pr-rain{i}" style="position:absolute;left:{810 + (i % 4) * 50}px;top:{580 + (i // 4) * 60}px;width:6px;height:44px;border-radius:3px;background:{PERI}"></div>' for i in range(8))
S["protect"] = scene_file("protect", f"""
      <div id="pr-o1" style="position:absolute;inset:0">
        <div style="position:absolute;left:50px;top:600px;width:560px;height:230px;border-radius:28px;background:{PAPER};box-shadow:0 20px 40px rgba(53,85,148,.12);padding:30px 34px">
          <div style="font-weight:700;font-size:26px;letter-spacing:.1em;text-transform:uppercase;color:{MUTED}">Declared value for carriage</div>
          <div id="pr-val" style="font-weight:800;font-size:80px;color:{INK};margin-top:12px">₹44 lakh</div>
          {stamp("NVD", "pr-nvd", 80, -6, "left:40px;top:90px")}
        </div>
        {tag("pr-fee", "+ a small fee", "left:50px;top:860px", solid=True)}
        {ppile}
        <div id="pr-limit" style="position:absolute;left:600px;top:{GROUND - 30}px;width:380px">
          <div style="height:0;border-top:6px dashed {BRAND}"></div>
          <div class="tag solid" style="position:relative;display:inline-block;margin-top:8px">Limit</div></div>
      </div>
      <div id="pr-o2" style="position:absolute;inset:0">
        <svg style="position:absolute;left:150px;top:580px" width="560" height="320" viewBox="0 0 560 320">
          <g id="pr-canopy"><path d="M10 210 Q280 -40 550 210 Q500 182 455 210 Q410 182 370 210 Q325 182 280 210 Q235 182 190 210 Q150 182 105 210 Q60 182 10 210 Z" fill="{BRAND}"/></g>
          <path d="M280 60 L280 300" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round"/></svg>
        <div style="position:absolute;left:310px;top:{GROUND - 225}px">{hero("pr-box", 240, waybill=True)}</div>
        {rain}
        <div id="pr-clock" style="position:absolute;left:800px;top:{GROUND - 230}px">{tile("clock", "pr-clockt", 200)}
          <div id="pr-x" style="position:absolute;left:0;top:0">{icon("cross", 200, INK)}</div></div>
      </div>
""", tl)

# ── 14 part2 ─ "Which option costs less? That's part two."
tl = Tl("part2")
tl(W(14, "part") - 0.15, 'tl.fromTo("#p2-card", { scale: 0.6, opacity: 0, rotation: -8 }, { scale: 1, opacity: 1, rotation: -3, duration: 0.5, ease: "back.out(2)" }, @);')
S["part2"] = scene_file("part2", f"""
      <div style="position:absolute;left:130px;top:{GROUND - 225}px">{hero("p2-a", 240, waybill=True)}</div>
      <div style="position:absolute;left:710px;top:{GROUND - 225}px">{hero("p2-b", 240, waybill=True)}</div>
      <div style="position:absolute;left:480px;top:{GROUND - 170}px;font-weight:900;font-size:96px;color:{BRAND}">vs</div>
      <div id="p2-card" style="position:absolute;left:240px;top:580px;width:600px;height:220px;border-radius:40px;background:{BRAND};box-shadow:0 30px 60px rgba(53,85,148,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;color:{PAPER}">
        <div style="font-weight:900;font-size:110px;line-height:1">Part 2</div><div style="font-weight:700;font-size:34px;color:{PERI};margin-top:8px">coming soon</div></div>
""", tl)

# ── 15 end ─ back in the shop: "before your cargo flies, check that box." Then the end card.
tl = Tl("end")
tl(W(15, "flies") - 0.4, 'tl.fromTo("#en-wplane", { x: -320 }, { x: 420, duration: 1.0, ease: "power1.inOut" }, @);')
tl(W(15, "check") - 0.1, 'tl.to("#en-me-arm", { rotation: 70, duration: 0.3, ease: "power2.inOut", svgOrigin: "110 160" }, @);')
tl(W(15, "box") - 0.05, 'tl.fromTo("#en-tick", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" }, @);')
tl(W(15, "box") + 0.3, 'tl.to("#en-me-arm", { rotation: 0, duration: 0.3, ease: "power2.out", svgOrigin: "110 160" }, @);')
tl(W(15, "more") - 0.3, 'tl.fromTo("#en-card", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, @);')
tl(W(15, "more") - 0.15, 'tl.fromTo("#en-logo", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.inOut" }, @);')
tl(W(15, "more") + 0.4, 'tl.fromTo("#en-line", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, @);')
tl(W(15, "f-six") - 0.3, 'tl.fromTo("#en-cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ' + ENTER + ' }, @);')
S["end"] = scene_file("end", f"""
      {shop_room()}
      <div style="position:absolute;left:626px;top:446px;width:328px;height:218px;border-radius:18px;overflow:hidden">
        <div id="en-wplane" style="position:absolute;left:70px;top:50px;width:200px"><img src="assets/img/banner-plane.webp" alt="" style="width:100%" /></div></div>
      {tag("en-time", "Next shipment", "left:250px;top:440px", solid=True)}
      <div style="position:absolute;left:600px;top:560px">{person("en-me", 270)}</div>
      <div style="position:absolute;left:330px;top:735px">{hero("en-box", 240, waybill=True)}</div>
      <div id="en-tick" style="position:absolute;left:470px;top:780px;width:80px;height:80px;border-radius:50%;background:{BRAND};display:flex;align-items:center;justify-content:center">{icon("check", 56, PAPER)}</div>
      <div id="en-card" style="position:absolute;inset:0;background:{SKY}">
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px;padding-bottom:330px">
          <img id="en-logo" src="assets/img/blue-logo.png" alt="F16s" style="width:680px" />
          <div id="en-line" style="font-weight:700;font-size:46px;color:{INK};text-align:center;line-height:1.3">Smart e-Freight for<br>freight forwarders</div>
          <div id="en-cta" style="display:inline-flex;align-items:center;background:{BRAND};border-radius:999px;padding:26px 26px 26px 56px;box-shadow:0 20px 50px rgba(53,85,148,.2)">
            <span data-var-text="cta" style="color:{PAPER};font-weight:700;font-size:44px">f16sefreight.com</span>
            <span style="margin-left:30px;width:72px;height:72px;border-radius:50%;background:{PAPER};color:{BRAND};display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800">→</span>
          </div></div></div>
""", tl)


# ── overlays: "This is called" term cards and the question cards that open each turn ──
TERMS = [  # (kind, start, end, title, meaning)
    ("q", W(3, "so"), W(3, "explain") + 0.2, "So who pays?", ""),
    ("t", W(4, "waybill") - 0.1, BS(5) - 0.2, "Air waybill", "your cargo's plane ticket"),
    ("t", W(5, "contract", 2) - 0.1, BS(6) - 0.2, "Contract of carriage", "what the airline promises, and where it stops"),
    ("t", W(6, "n.") - 0.1, BS(7) - 0.3, "NVD", "No Value Declared"),
    ("q", BS(7), W(7, "global") - 0.1, "Here's the catch", ""),
    ("t", W(7, "montreal") - 0.1, BS(8) - 0.15, "Montreal Convention", "the global treaty for air cargo"),
    ("t", W(8, "limit") - 0.1, BS(9) - 0.3, "Liability limit", "26 SDR for every kilo"),
    ("t", BS(9) + 0.05, BS(10) - 0.3, "SDR", "Special Drawing Rights: the IMF's basket currency"),
    ("q", BS(10), W(10, "thirty") - 0.2, "What does that mean in money?", ""),
    ("q", BS(11), W(11, "losses") - 0.25, "What about the delay?", ""),
    ("t", W(11, "prove") - 0.2, BS(12) - 0.3, "Proof of loss", "receipts for what the delay cost you"),
    ("t", W(12, "complain") - 0.1, BS(13) - 0.3, "Time limits", "21 days to complain · 2 years to sue"),
    ("q", BS(13), W(13, "write") - 0.15, "How do you protect yourself?", ""),
    ("t", W(13, "write"), W(13, "or") - 0.15, "Declared value", "write the real value, pay a small fee"),
    ("t", W(13, "insurance") - 0.2, BS(14) - 0.3, "Cargo insurance", "read it: most policies don't cover delay"),
]


def terms_comp():
    els, js = [], []
    for i, (kind, s, e, title, meaning) in enumerate(TERMS):
        s, d = round(s, 2), round(max(e - s, 1.2), 2)
        inner = (f'<div class="q">{title}</div>' if kind == "q" else
                 f'<div class="t"><div class="t-eye">This is called</div><div class="t-term">{title}</div><div class="t-mean">{meaning}</div></div>')
        els.append(f'    <div id="term-{i}" class="clip slot" data-start="{s}" data-duration="{d}" data-track-index="0">{inner}</div>')
        js.append(f'    tl.fromTo("#term-{i} > div", {{ opacity: 0, y: -24, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.8)" }}, {s});')
        js.append(f'    tl.to("#term-{i} > div", {{ opacity: 0, y: -16, duration: 0.18, ease: "power2.in" }}, {round(s + d - 0.2, 2)});')
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .slot {{ position: absolute; left: 60px; right: 60px; top: 330px; display: flex; justify-content: center; }}
    .q {{ padding: 22px 40px; border-radius: 26px; background: {BRAND}; color: {PAPER}; font-family: Inter, sans-serif; font-weight: 800; font-size: 54px;
          box-shadow: 0 20px 40px rgba(53,85,148,.2); text-align: center; }}
    .t {{ padding: 18px 40px 22px; border-radius: 26px; background: {PAPER}; border: 4px solid {BRAND}; text-align: center; font-family: Inter, sans-serif;
          box-shadow: 0 20px 40px rgba(53,85,148,.15); max-width: 940px; }}
    .t-eye {{ font-weight: 700; font-size: 24px; letter-spacing: .16em; text-transform: uppercase; color: {MUTED}; }}
    .t-term {{ font-weight: 800; font-size: 60px; letter-spacing: -.02em; color: {BRAND}; line-height: 1.1; margin-top: 4px; }}
    .t-mean {{ font-weight: 600; font-size: 32px; color: {INK}; margin-top: 4px; }}
  </style>
  <div id="root" data-composition-id="terms" data-width="1080" data-height="1920">
{chr(10).join(els)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{chr(10).join(js)}
    window.__timelines["terms"] = tl;
  </script>
</template>
"""


SAY = (("N. V. D.", "NVD"), ("N V D", "NVD"), ("S. D. R.", "SDR"), ("I. M. F.", "IMF"), ("twenty-six", "26"),
       ("twenty-one", "21"), ("forty-four", "44"), ("thirty-five hundred dollars", "$3,500"), ("fifty thousand dollars", "$50,000"))


def spoken_words():
    """Kokoro's words, with the spelled-out web address joined back into one token."""
    ws, out, i = T["words"], [], 0
    while i < len(ws):
        seq = [w["w"].lower() for w in ws[i:i + 6]]
        if seq[0].startswith("f-sixteen") and "com" in seq:
            j = i + seq.index("com")
            out.append(dict(ws[i], w="f16sefreight.com", e=ws[j]["e"])); i = j + 1
        else:
            out.append(ws[i]); i += 1
    return out


def captions():
    groups, cur = [], []
    for w in spoken_words():
        tok = w["w"]
        if re.fullmatch(r"[.,?:!;]", tok):
            if cur:
                cur[-1] = dict(cur[-1], w=cur[-1]["w"] + tok)
                if tok != ":" or len(cur) >= 3:
                    groups.append(cur); cur = []
            continue
        cur.append(w)
        if len(cur) >= 4:
            groups.append(cur); cur = []
    if cur:
        groups.append(cur)
    out = []
    for i, g in enumerate(groups):
        start, nxt = g[0]["s"], (groups[i + 1][0]["s"] if i + 1 < len(groups) else None)
        end = g[-1]["e"] + 0.35
        if nxt is not None:
            end = min(nxt, max(end, start + 0.6))
        text = " ".join(w["w"] for w in g)
        for a, b in SAY:
            text = text.replace(a, b)
        out.append((round(start, 2), round(end - start, 2), text))
    els = "\n".join(f'    <div id="cap-{i}" class="clip cap" data-start="{s}" data-duration="{d}" data-track-index="0"><span>{txt}</span></div>'
                    for i, (s, d, txt) in enumerate(out))
    js = "\n".join(f'    tl.fromTo("#cap-{i} span", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.12, ease: "power3.out" }}, {s});'
                   for i, (s, d, txt) in enumerate(out))
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .cap {{ position: absolute; left: 90px; right: 90px; top: 1190px; text-align: center; }}
    .cap span {{ display: inline-block; padding: 14px 30px; border-radius: 24px; background: {PAPER}; box-shadow: 0 10px 25px rgba(53,85,148,.15);
                font-family: Inter, sans-serif; font-weight: 800; font-size: 52px; line-height: 1.2; letter-spacing: -.01em; color: {INK}; }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
{els}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js}
    window.__timelines["captions"] = tl;
  </script>
</template>
"""


# ── sound: a soft effect on each visible action, kept just off the stressed words; one low hit ──
def _sfx():
    t2 = W(2, "two")
    fx = [
        (ph - 0.01, "click-soft", 0.3), (ph + 0.49, "key-press", 0.3), (ph + 0.99, "click-soft", 0.3),
        (W(1, "abroad") + 0.3, "pop", 0.22), (W(1, "kilos") - 0.1, "typing", 0.18, 0.5), (W(1, "fifty") + 0.05, "pop", 0.25),
        *[(cut - OV, "whoosh", 0.2) for _, cut, how in CUTS[1:] if how == "pan"],
        *[(cut - OV, "whoosh-short", 0.25) for _, cut, how in CUTS[1:] if how in ("zoom", "pull")],
        (W(2, "delayed"), "pop", 0.25),
        (START["tarmac"] + 0.3, "whoosh-short", 0.18), (t2 - 0.1, "whoosh-short", 0.15), (t2 + 0.55, "click-soft", 0.3),
        (W(2, "buyer") - 0.4, "whoosh-short", 0.2), (W(2, "every") - 0.1, "pop", 0.25),
        (W(3, "who") - 0.2, "whoosh-short", 0.15), (W(3, "who") + 0.42, "click-soft", 0.22), (W(3, "who") + 0.74, "key-press", 0.22),
        (W(3, "who") + 1.06, "click-soft", 0.22), (W(3, "explain") - 0.4, "pop", 0.22),
        (W(4, "plane") - 0.1, "whoosh-short", 0.18),
        (W(5, "contract", 1) + 0.1, "key-press", 0.28), (W(5, "airline", 1) + 0.1, "key-press", 0.28),
        (W(5, "stops") - 0.2, "whoosh-short", 0.18), (W(5, "stops") + 0.1, "pop", 0.22),
        (W(6, "declared", 1) - 0.1, "whoosh", 0.2),
        (W(6, "n.") + 0.05, "key-press", 0.28), (W(6, "v.") + 0.05, "click-soft", 0.28), (W(6, "d.") + 0.05, "key-press", 0.28),
        (W(7, "only") - 0.1, "typing", 0.2, 0.8), (W(7, "value") - 0.05, "click-soft", 0.3), (W(7, "value") + 0.1, "whoosh-short", 0.2),
        (W(8, "kilo", end=True) + 0.05, "impact-bass-1", 0.16), (W(8, "twenty") - 0.15, "click-soft", 0.25),
        (START["sdr"] + 0.4, "whoosh-short", 0.15), (W(9, "i.") - 0.1, "pop", 0.2),
        *[(W(9, "world") + 0.15 + k * 0.12, ("click-soft", "key-press")[k % 2], 0.2) for k in range(5)],
        (W(9, "one") + 0.2, "pop", 0.28),
        (W(10, "hundred") - 0.1, "pop", 0.2), (W(10, "thirty"), "pop", 0.22), (W(10, "forty") - 0.25, "whoosh", 0.25),
        (W(11, "delay") - 0.1, "typing", 0.16, 1.0), (W(11, "counts"), "pop", 0.22),
        (W(11, "losses") + 0.3, "click-soft", 0.22), (W(11, "prove") + 0.05, "key-press", 0.35),
        (START["deadline"] + 0.45, "whoosh-short", 0.15), (W(12, "twenty") - 0.1, "click-soft", 0.28), (W(12, "two") - 0.1, "click-soft", 0.28),
        (W(12, "gone", end=True) + 0.02, "whoosh", 0.25),
        (W(13, "real"), "whoosh-short", 0.16), (W(13, "value") + 0.05, "key-press", 0.28), (W(13, "fee"), "pop", 0.22),
        (W(13, "limit"), "whoosh", 0.2), (W(13, "insurance"), "whoosh", 0.22), (W(13, "most") - 0.1, "click-soft", 0.22),
        (W(13, "delay") - 0.05, "pop", 0.25), (W(14, "part"), "pop", 0.3),
        (W(15, "flies") - 0.4, "whoosh-short", 0.2), (W(15, "box"), "pop", 0.25),
        (W(15, "more") - 0.15, "whoosh-short", 0.22), (W(15, "f-six") - 0.2, "pop", 0.28),
        *[(s + 0.02, "click-soft", 0.18) for _, s, *_ in TERMS],
    ]
    return sorted(fx, key=lambda e: e[0])


SFX = _sfx()
DUR = {"pop": 0.7, "whoosh": 0.57, "whoosh-short": 0.57, "click-soft": 0.37, "key-press": 0.43, "typing": 1.0, "impact-bass-1": 2.1}


def world():
    """The shared world under every scene: drifting clouds, a pale skyline and tower, the ground.
    The skyline and ground pan with the camera at each 'pan' cut, so the scenes read as one place."""
    clouds = "".join(
        f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{w * .42:.0f}px">'
        f'<div style="position:absolute;left:0;bottom:0;width:{w}px;height:{w * .23:.0f}px;border-radius:{w}px;background:{PAPER}"></div>'
        f'<div style="position:absolute;left:{w * .18:.0f}px;bottom:{w * .08:.0f}px;width:{w * .38:.0f}px;height:{w * .38:.0f}px;border-radius:50%;background:{PAPER}"></div>'
        f'<div style="position:absolute;left:{w * .45:.0f}px;bottom:{w * .04:.0f}px;width:{w * .3:.0f}px;height:{w * .3:.0f}px;border-radius:50%;background:{PAPER}"></div></div>'
        for x, y, w in [(i * 520 + (i % 3) * 90, 300 + (i % 4) * 90, 200 + (i % 3) * 60) for i in range(30)])
    skyline = "".join(f'<div style="position:absolute;left:{x}px;top:{GROUND - h}px;width:{wd}px;height:{h}px;border-radius:10px 10px 0 0;background:{HAZE1}"></div>'
                      for x, h, wd in [(i * 230 + (i % 2) * 40, 120 + (i * 37) % 160, 120 + (i % 3) * 40) for i in range(70)])
    tower = "".join(f'<div style="position:absolute;left:{x}px;top:{GROUND - 330}px;width:40px;height:330px;background:{HAZE1}"></div>'
                    f'<div style="position:absolute;left:{x - 40}px;top:{GROUND - 390}px;width:120px;height:70px;border-radius:16px;background:{HAZE1}"></div>' for x in (900, 4700, 9800))
    dashes = f"repeating-linear-gradient(90deg,{PAPER} 0 110px,transparent 110px 190px)"
    pans = [cut for _, cut, how in CUTS if how == "pan"]
    js = "\n".join(
        f'      tl.to("#w-far", {{ x: {-(k + 1) * 380}, duration: {2 * OV}, ease: "power2.inOut" }}, {round(c - OV, 2)});\n'
        f'      tl.to("#w-near", {{ x: {-(k + 1) * 1080}, duration: {2 * OV}, ease: "power2.inOut" }}, {round(c - OV, 2)});'
        for k, c in enumerate(pans))
    html = f"""      <div id="world" data-layout-ignore style="position:absolute;inset:0;overflow:hidden">
        <div id="w-clouds" style="position:absolute;left:0;top:0;width:16000px;height:1920px">{clouds}</div>
        <div id="w-far" style="position:absolute;left:0;top:0;width:16000px;height:1920px">{skyline}{tower}</div>
        <div id="w-near" style="position:absolute;left:0;top:{GROUND}px;width:{(len(pans) + 2) * 1080}px;height:{1920 - GROUND}px;background:{RULE}">
          <div style="position:absolute;left:0;top:0;width:100%;height:8px;background:{HAZE1}"></div>
          <div style="position:absolute;left:0;top:200px;width:100%;height:16px;background:{dashes}"></div></div>
      </div>"""
    return html, js


def index():
    hosts = "\n".join(
        f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{st}" '
        f'data-duration="{d}" data-track-index="{1 + i % 2}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:{2 + i}"></div>'
        for i, (sid, st, d, *_) in enumerate(SCENES))
    sfx = "\n".join(
        f'      <audio id="sfx-{i}" class="clip" src="assets/audio/sfx/{f}.mp3" data-start="{round(t, 2)}" data-duration="{d}" '
        f'data-track-index="{5 + i % 6}" data-volume="{v}"></audio>'
        for i, (t, f, v, d) in enumerate((e + (DUR[e[1]],))[:4] for e in SFX))
    world_html, world_js = world()
    return f"""<!doctype html>
<html lang="en" data-resolution="portrait"
  data-composition-variables='[{{"id":"cta","type":"string","label":"End card URL","default":"f16sefreight.com"}}]'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <!-- generated by build/build.py: edit there, then rerun -->
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: {SKY}; }}
      #root {{ width: 100%; height: 100%; position: relative; font-family: "Inter", sans-serif; }}
      .tag {{ position: absolute; padding: 10px 22px; border-radius: 14px; background: {PAPER}; border: 4px solid {BRAND}; color: {BRAND};
             font-weight: 800; font-size: 30px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap;
             box-shadow: 0 12px 24px rgba(53,85,148,.14); }}
      .tag.solid {{ background: {BRAND}; color: {PAPER}; }}
      .tile {{ border-radius: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }}
      .stamp {{ font-weight: 900; letter-spacing: .06em; border: 8px solid {BRAND}; color: {BRAND}; border-radius: 12px; padding: 0 22px;
               white-space: nowrap; background: {PAPER}; }}
      #series {{ position: absolute; left: 70px; right: 70px; top: 250px; display: flex; justify-content: space-between; z-index: 30;
                font-weight: 800; font-size: 28px; letter-spacing: .12em; text-transform: uppercase; color: {BRAND}; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
{world_html}
{hosts}
      <div id="series"><span>Cargo, explained · 01</span><span>f16sefreight.com</span></div>
      <div id="terms" data-composition-id="terms" data-composition-src="compositions/terms.html" data-start="0" data-duration="{TOTAL}" data-track-index="3" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:40"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{TOTAL}" data-track-index="4" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:50"></div>
      <audio id="narration" class="clip" src="assets/audio/narration.wav" data-start="0" data-duration="{TOTAL}" data-track-index="12" data-volume="1"></audio>
{sfx}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      tl.fromTo("#w-clouds", {{ x: 0 }}, {{ x: -1300, duration: {TOTAL}, ease: "none" }}, 0);
{world_js}
      tl.fromTo("#series", {{ opacity: 0.75 }}, {{ opacity: 0.75, duration: 0.01 }}, 0);
      tl.to(["#series", "#world"], {{ opacity: 0, duration: 0.4 }}, {round(W(15, "more") - 0.3, 2)});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""


if __name__ == "__main__":
    comp = os.path.join(ROOT, "compositions")
    os.makedirs(comp, exist_ok=True)
    for f in os.listdir(comp):  # drop scenes from the previous cut
        if f.endswith(".html"):
            os.remove(os.path.join(comp, f))
    for sid, html in S.items():
        open(os.path.join(comp, f"{sid}.html"), "w").write(html)
    open(os.path.join(comp, "terms.html"), "w").write(terms_comp())
    open(os.path.join(comp, "captions.html"), "w").write(captions())
    open(os.path.join(ROOT, "index.html"), "w").write(index())
    print(f"wrote {len(S) + 2} compositions + index.html, {TOTAL} s")
