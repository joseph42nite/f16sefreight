"""Shared pieces for the Ep 03 reel: word timing, "This is called"/question cards, captions.

build/build3d.py imports this and writes index.html + compositions/terms.html + compositions/captions.html.
(Ep 01's 2D scene builder lived here too; Ep 02 and 03 are 3D only, so only the shared helpers remain.)
Every time comes from a spoken word in vo2/timing.json, so a re-record re-times the film.
"""
import json
import os
import re

from parts import BRAND, MUTED, PAPER

INK = "#263238"   # charcoal, the site illustrations' outline colour

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(ROOT, "vo2", "timing.json")))
TAIL = 4.2
TOTAL = round(T["end"] + TAIL, 2)


def W(beat, prefix, n=1, end=False, exact=False):
    """Film time a word in `beat` starts (or ends), matched by lowercase prefix (or the whole word), nth occurrence."""
    hits = [w for w in T["words"] if w["beat"] == beat
            and (w["w"].lower() == prefix.lower() if exact else w["w"].lower().startswith(prefix.lower()))]
    if len(hits) < n:
        raise KeyError(f"beat {beat}: no word #{n} {prefix!r} in {[w['w'] for w in T['words'] if w['beat'] == beat]}")
    return hits[n - 1]["e" if end else "s"]


def BS(beat):
    return T["starts"][beat - 1]


# ── overlays: the cover card, "This is called" term cards, question cards that open each turn ──
TERMS = [  # (kind, start, end, title, meaning); kind "c" is the cover, on screen from frame 0
    ("c", 0, W(1, "ship") - 0.1, "Paying for a box that never moved?", "Demurrage &amp; detention"),
    ("q", W(3, "why"), W(3, "explain") + 0.5, "Why pay for standing still?", ""),
    ("t", W(4, "shipping") - 0.1, W(4, "borrowing") + 0.5, "Shipping line", "runs the ship and owns the box"),
    ("t", W(5, "free", 2) - 0.1, BS(6) - 0.1, "Free time", "days you keep the box at no cost"),
    ("t", W(6, "demurrage") - 0.1, W(7, "nine") - 0.1, "Demurrage", "a daily fee while the full box waits in the port"),
    ("q", BS(8), W(8, "end") + 0.3, "Here's the catch", ""),
    ("t", W(10, "detention") - 0.1, W(10, "keeping") - 0.1, "Detention", "a daily fee until the empty box goes back"),
    ("q", BS(11), W(11, "demurrage") - 0.15, "So, the difference?", ""),
    ("q", BS(12), W(12, "box") - 0.1, "Why charge at all?", ""),
    ("q", BS(13), W(13, "have") - 0.1, "How do you avoid it?", ""),
    ("t", W(13, "customs") - 0.1, W(13, "clears") - 0.15, "Customs", "the government's check on imports"),
    ("t", W(14, "freight") - 0.1, W(14, "demurrage") - 0.1, "Freight", "what you pay to move the box"),
]


def terms_comp():
    els, js = [], []
    for i, (kind, s, e, title, meaning) in enumerate(TERMS):
        s, d = round(s, 2), round(max(e - s, 1.2), 2)
        if kind == "c":
            inner = f'<div class="c"><div class="c-eye">{meaning}</div><div class="c-t">{title}</div></div>'
        elif kind == "q":
            inner = f'<div class="q">{title}</div>'
        else:
            inner = f'<div class="t"><div class="t-eye">This is called</div><div class="t-term">{title}</div><div class="t-mean">{meaning}</div></div>'
        els.append(f'    <div id="term-{i}" class="clip slot" data-start="{s}" data-duration="{d}" data-track-index="0">{inner}</div>')
        if s > 0:  # the cover is already on screen at frame 0 (the thumbnail)
            js.append(f'    tl.fromTo("#term-{i} > div", {{ opacity: 0, y: -24, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.8)" }}, {s});')
        js.append(f'    tl.to("#term-{i} > div", {{ opacity: 0, y: -16, duration: 0.18, ease: "power2.in" }}, {round(s + d - 0.2, 2)});')
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .slot {{ position: absolute; left: 60px; right: 60px; top: 330px; display: flex; justify-content: center; }}
    .q {{ padding: 22px 40px; border-radius: 26px; background: {INK}; color: {PAPER}; font-family: Inter, sans-serif; font-weight: 800; font-size: 54px;
          box-shadow: 0 20px 40px rgba(38,50,56,.2); text-align: center; }}
    .c {{ padding: 24px 44px 30px; border-radius: 30px; background: {INK}; color: {PAPER}; font-family: Inter, sans-serif; text-align: center;
          box-shadow: 0 20px 40px rgba(38,50,56,.25); max-width: 940px; }}
    .c-eye {{ font-weight: 700; font-size: 30px; letter-spacing: .14em; text-transform: uppercase; color: #FFBF9D; }}
    .c-t {{ font-weight: 800; font-size: 64px; line-height: 1.1; letter-spacing: -.02em; margin-top: 6px; }}
    .t {{ padding: 18px 40px 22px; border-radius: 26px; background: {PAPER}; border: 4px solid {INK}; text-align: center; font-family: Inter, sans-serif;
          box-shadow: 0 20px 40px rgba(38,50,56,.15); max-width: 940px; }}
    .t-eye {{ font-weight: 700; font-size: 28px; letter-spacing: .16em; text-transform: uppercase; color: {MUTED}; }}
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


# Spoken phrases shown as figures in the captions: Kokoro's tokens (lowercase, punctuation included) -> one token.
MERGE = [
    (("ten", "days"), "10 days"), (("a", "thousand", "dollars"), "$1,000"), (("one", "lakh", "rupees"), "₹1 lakh"),
    (("five", "days"), "5 days"), (("twenty-foot",), "20-foot"), (("a", "hundred", "dollars"), "$100"),
    (("nine", "thousand", "rupees"), "₹9,000"),
]


def spoken_words():
    """Kokoro's words, with numbers, NVD and the spelled-out web address joined back into one token."""
    ws, out, i = T["words"], [], 0
    while i < len(ws):
        seq = [w["w"].lower() for w in ws[i:i + 6]]
        if seq[0].startswith("f-sixteen") and "com" in seq:
            j = i + seq.index("com")
            out.append(dict(ws[i], w="f16sefreight.com", e=ws[j]["e"])); i = j + 1
            continue
        for toks, shown in MERGE:
            if tuple(seq[:len(toks)]) == toks:
                out.append(dict(ws[i], w=shown, e=ws[i + len(toks) - 1]["e"])); i += len(toks)
                break
        else:
            out.append(ws[i]); i += 1
    return out


def captions():
    # split at punctuation, then into balanced chunks: a short phrase stays whole, a long one splits evenly (max 4 words)
    segs, cur = [], []
    for w in spoken_words():
        if re.fullmatch(r"[.,?:!;]", w["w"]):
            if cur:
                cur[-1] = dict(cur[-1], w=cur[-1]["w"] + w["w"])
                segs.append(cur); cur = []
            elif segs:
                segs[-1][-1] = dict(segs[-1][-1], w=segs[-1][-1]["w"] + w["w"])
            continue
        cur.append(w)
    if cur:
        segs.append(cur)
    groups = []
    for seg in segs:
        if len(seg) <= 5 and len(" ".join(w["w"] for w in seg)) <= 28:
            groups.append(seg); continue
        n = -(-len(seg) // 4)
        size = -(-len(seg) // n)
        groups += [seg[k:k + size] for k in range(0, len(seg), size)]
    out = []
    for i, g in enumerate(groups):
        start, nxt = g[0]["s"], (groups[i + 1][0]["s"] if i + 1 < len(groups) else None)
        end = g[-1]["e"] + 0.35
        if nxt is not None:
            end = min(nxt, max(end, start + 0.6))
        out.append((round(start, 2), round(end - start, 2), " ".join(w["w"] for w in g)))
    els = "\n".join(f'    <div id="cap-{i}" class="clip cap" data-start="{s}" data-duration="{d}" data-track-index="0"><span>{txt}</span></div>'
                    for i, (s, d, txt) in enumerate(out))
    js = "\n".join(f'    tl.fromTo("#cap-{i} span", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.12, ease: "power3.out" }}, {s});'
                   for i, (s, d, txt) in enumerate(out))
    return f"""<template>
  <style>
    #root {{ position: absolute; inset: 0; pointer-events: none; }}
    .cap {{ position: absolute; left: 90px; right: 90px; top: 1190px; text-align: center; }}
    .cap span {{ display: inline-block; padding: 14px 30px; border-radius: 24px; background: {PAPER}; box-shadow: 0 10px 25px rgba(38,50,56,.15);
                font-family: Inter, sans-serif; font-weight: 800; font-size: 52px; line-height: 1.2; letter-spacing: -.01em; color: #263238; }}
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


DUR = {"pop": 0.7, "whoosh": 0.57, "whoosh-short": 0.57, "click-soft": 0.37, "key-press": 0.43, "typing": 1.0, "impact-bass-1": 2.1}


if __name__ == "__main__":
    for s, d, txt in re.findall(r'data-start="([\d.]+)" data-duration="([\d.]+)"[^>]*><span>(.*?)</span>', captions()):
        print(s, txt)
