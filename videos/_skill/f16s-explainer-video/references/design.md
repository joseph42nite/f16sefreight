# Look

## Palette (from the f16s website: its illustrations + the landing page)

| Role | Hex | Where |
|---|---|---|
| Charcoal | `#263238` | tags, question cards, runway paint, tyres, roofs, outlines |
| Slate | `#455A64` / `#37474F` | runway/apron, scale platforms, carts |
| Greys | `#E0E0E0` `#EBEBEB` `#F5F5F5` `#DBDBDB` | ground, walls, buildings |
| Bright blue | `#407BFF` | box tape, the exporter's jacket, the plane's tail, the umbrella (use sparingly) |
| Light blue | `#81A8FF` | windows, highlights, "lit" cubes, money stripes |
| Peach | `#FFBF9D` / horizon `#FFD6BE` `#FFE6D6` | skin, sky horizon, fog |
| Coral | `#FF9A6C` | the tug, crates, folder, the "limit" plate |
| Sky | `#F0F7FF` / `#DCEBFF` | sky gradient, end card |
| Brand blue | `#355594` | logo, waybill header, CTA pill, term-card titles |

The person said the all-blue version was "too blue". Keep blue for accents; the world is warm grey,
charcoal and peach.

## Type

Inter only (bundled in HyperFrames). Tags: 800, 30 px, caps, +6% tracking. Question cards: 800, 54 px,
white on charcoal. Term cards: eyebrow "THIS IS CALLED" 24 px caps, term 60 px 800 brand blue,
meaning 32 px. Captions: 800, 52 px, charcoal on white pills at y≈1190. Nothing readable under 28 px.

## Frame (1080 × 1920)

- Series bar at y 250: "CARGO, EXPLAINED · 0N" left, "F16SEFREIGHT.COM" right.
- Term/question cards: top 330 (≈330–505).
- Action: y 520–1170. Captions: y 1190. Below 1330: texture only (Instagram UI).
- Grid-safe: the cover (frame 0) must read inside the 3:4 crop (y 285–1635).
- **Nothing leaves the frame once a shot settles.** Pinned tags are clamped to x 40…1040, y 300…1170.
- **No tag under a card.** Because of that clamp, a tag pinned high (or on a tall object) slides up into
  the term/question card zone (y 330–505) and hides behind the card (cards sit on top). Pin tags, stamps
  and ticks on the object itself (its face or just above it, landing y ≥ 520), and end the card before a
  tag pops in at the same moment.

## Brand pieces

- Logo `template/assets/img/blue-logo.png` lands once, on the end card, with the tagline
  "Smart e-Freight for freight forwarders" and a pill button "f16sefreight.com →".
- The landing page's renders are in `template/assets/img/`: `banner-plane.webp`, `banner-ship.webp`, `banner-truck.webp`
  (its hero rotates FOCUS AIR / SEA / ROAD). The 3D world builds low-poly versions instead; build a ship
  (hull, deck, stacked containers) or a truck (cab, trailer, wheels) the same way `jet()` builds the plane.
- Recurring cast across modes: the **hero box** (white carton, blue tape, phone label, waybill taped on;
  a container or a truckload in sea and road episodes), the
  **exporter** (blue jacket, peach head, charcoal cap and legs), the coral tug.

## Rejected (don't bring back)

Flat 2D slide scenes; all-blue look; a "Ticket → Limit → Clock → Protect" progress bar at the top;
white ghost words that can't be read; text cards standing in for pictures; music beds; sub-bass booms.
