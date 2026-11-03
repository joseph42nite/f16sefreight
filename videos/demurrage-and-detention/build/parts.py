"""Shared drawings for the reel, in the landing page's palette only.

Every helper returns an SVG/HTML string. Scenes in build.py place them and animate
wrappers with GSAP, so no drawing carries a CSS transform GSAP also writes.
"""

SKY, PAPER, HAZE1, HAZE2, PERI = "#F0F7FF", "#FFFFFF", "#D0E6F8", "#E6F0FF", "#ABC0FF"
BRAND, INK, MUTED, RULE = "#355594", "#1E3A6E", "#5A6B8A", "#E2E8F0"


def haze(w, h, color, style):
    return f'<div class="haze" data-layout-allow-overflow style="width:{w}px;height:{h}px;background:{color};{style}"></div>'


def ghost(text, style, pid):
    return f'<div id="{pid}" class="ghost" data-layout-ignore style="{style}">{text}</div>'


def carton(x, y, w, h, cid=""):
    i = f' id="{cid}"' if cid else ""
    return (f'<g{i}><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}" stroke="{BRAND}" stroke-width="5"/>'
            f'<rect x="{x + w / 2 - 14}" y="{y + 2}" width="28" height="{h - 4}" fill="{HAZE1}"/>'
            f'<rect x="{x + 16}" y="{y + h - 42}" width="{w * 0.32}" height="24" rx="4" fill="{HAZE2}" stroke="{PERI}" stroke-width="3"/></g>')


def pallet(pid, width=420):
    """Cartons strapped on a pallet; viewBox 420 x 300."""
    body = (carton(10, 150, 130, 100) + carton(145, 150, 130, 100) + carton(280, 150, 130, 100)
            + carton(75, 50, 130, 100) + carton(210, 50, 130, 100)
            + f'<path d="M 30 150 L 30 250 M 390 150 L 390 250" stroke="{BRAND}" stroke-width="4" stroke-dasharray="10 8"/>'
            + f'<rect x="0" y="252" width="420" height="16" rx="4" fill="{BRAND}"/>'
            + f'<rect x="20" y="268" width="50" height="22" fill="{INK}"/><rect x="185" y="268" width="50" height="22" fill="{INK}"/>'
            + f'<rect x="350" y="268" width="50" height="22" fill="{INK}"/><rect x="0" y="288" width="420" height="10" rx="3" fill="{BRAND}"/>')
    return f'<svg id="{pid}" viewBox="0 0 420 300" width="{width}" height="{width * 300 / 420:.0f}">{body}</svg>'


def warehouse(pid, width=470):
    return (f'<svg id="{pid}" viewBox="0 0 470 340" width="{width}" height="{width * 340 / 470:.0f}">'
            f'<rect x="20" y="110" width="430" height="230" fill="{HAZE2}" stroke="{BRAND}" stroke-width="5"/>'
            f'<polygon points="0,120 235,20 470,120" fill="{BRAND}"/>'
            f'<rect x="150" y="56" width="170" height="44" rx="8" fill="{PAPER}"/>'
            f'<text x="235" y="88" text-anchor="middle" font-family="Inter" font-weight="800" font-size="26" fill="{BRAND}" letter-spacing="3">CARGO</text>'
            + "".join(f'<rect x="{x}" y="190" width="120" height="150" fill="{PAPER}" stroke="{BRAND}" stroke-width="4"/>'
                      + "".join(f'<line x1="{x + 4}" x2="{x + 116}" y1="{y}" y2="{y}" stroke="{PERI}" stroke-width="4"/>' for y in range(205, 340, 18))
                      for x in (60, 290))
            + f'<rect x="200" y="200" width="70" height="56" rx="6" fill="{PAPER}" stroke="{PERI}" stroke-width="4"/></svg>')


def icon(name, size=96, color=BRAND):
    """Line icons on a 64 grid, stroked in brand blue."""
    paths = {
        "kettlebell": '<path d="M22 22 a10 10 0 0 1 20 0" fill="none"/><path d="M20 26 h24 l6 10 a18 18 0 0 1 -36 0 z"/><text x="32" y="48" text-anchor="middle" font-family="Inter" font-weight="800" font-size="11" stroke="none" fill="COL">KG</text>',
        "note": '<rect x="6" y="18" width="52" height="28" rx="4"/><circle cx="32" cy="32" r="7"/><path d="M14 26 v12 M50 26 v12"/>',
        "plane": '<path d="M8 36 l14 -2 l12 -18 h6 l-6 18 l14 -2 l6 -6 h4 l-2 10 l2 10 h-4 l-6 -6 l-14 -2 l6 18 h-6 l-12 -18 l-14 -2 z" fill="COL" stroke="none"/>',
        "clock": '<circle cx="32" cy="32" r="24"/><path d="M32 18 v14 l10 6"/>',
        "carton": '<rect x="10" y="18" width="44" height="34" rx="4"/><path d="M10 28 h44 M32 18 v12"/>',
        "check": '<path d="M14 34 l12 12 l24 -26"/>',
        "cross": '<path d="M18 18 l28 28 M46 18 l-28 28"/>',
    }
    p = paths[name].replace("COL", color)
    return (f'<svg viewBox="0 0 64 64" width="{size}" height="{size}" fill="none" stroke="{color}" stroke-width="4.5" '
            f'stroke-linecap="round" stroke-linejoin="round">{p}</svg>')


def tile(name, tid, size=180, filled=False):
    bg, col = (BRAND, PAPER) if filled else (PAPER, BRAND)
    return (f'<div id="{tid}" class="tile" style="width:{size}px;height:{size}px;background:{bg};box-shadow:0 20px 40px rgba(53,85,148,.12)">'
            f'{icon(name, int(size * 0.55), col)}</div>')


def coin(cx, cy, r=60, label=""):
    t = (f'<text x="{cx}" y="{cy + 10}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="{int(r * 0.5)}" fill="{BRAND}">{label}</text>' if label else "")
    return (f'<ellipse cx="{cx}" cy="{cy + 8}" rx="{r}" ry="{r * 0.38}" fill="{BRAND}"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{r}" ry="{r * 0.38}" fill="{PERI}" stroke="{BRAND}" stroke-width="4"/>{t}')
