# The 3D world (`template/build/build3d.py`)

One HyperFrames root composition (`index.html`) holds a full-frame Three.js canvas
(three@0.181.2 from jsDelivr), the HTML overlays and the GSAP timeline for them. Two
sub-compositions: `compositions/terms.html` (term/question cards) and `compositions/captions.html`.
Three.js is driven by HyperFrames' `hf-seek` event: `renderAt(t)` must be a pure function of `t`
(no `Date.now`, `Math.random` — use `hash(i)`, no animation loop). Set `data-duration` on the root.

## How build3d.py is organised

1. `TT` — every animation time, from the spoken words in `vo2/timing.json` via `W(beat, prefix, n)`
   (`build.py`). Match on a prefix: beware collisions ("no" matches "Now", "f" matches "flies"),
   pass `n` or a longer prefix.
2. `TAGS` — HTML tags pinned to 3D objects: (id, html, class, show, hide).
3. `JS` — the Three.js scene, in sections:
   - helpers: `mat`, `add`, `outline` (charcoal edges = illustrated look), `paintable` (canvas textures
     you can repaint by state: the waybill, scale displays, boards), `heroBox`, `person` (arm pivot for
     actions), `jet`, `cubeStack` (InstancedMesh, 100 cubes).
   - the shared ground (apron, runway, dashes, skyline, towers).
   - **stations**: one `group(SX.name)` per idea, 60–70 units apart on x. Ep 01: shop 0, map 90,
     tarmac 180, weight 230, sdr 290, money 350, delay 410, deadline 470, protect 540 (+ umbrella at +21), part2 610.
   - `PINS` — which tag follows which object (with a y offset).
   - `K` — camera keys `[t, position, lookAt]`. Hold a shot with two keys at the same framing;
     fly between stations over ~0.9 s around the cut (`cut ± 0.45`). Long flights swoop up automatically.
   - `renderAt(t)` — every per-object animation (arm swings, cart roll, day/night, coin bounce,
     waybill repaint, cube burst, coins falling, stacks growing, clock hands, claim sliding, limit rising, rain).
4. `gsap_js()` — tag pop-ins, the buyer's phone, boarding pass, Part 2 card, end card.
5. `sfx()` — the effects list (see `sound.md`).
6. `index()` — writes the page. Run `python3 build/build3d.py`.

## Making a new episode

- Keep: ground, helpers, hero box, exporter, jet, the camera system, tags, overlays, end card.
- Replace the stations with your story's places: an airport cold room, a port quay with a crane and a
  container ship, a container yard, a highway and a border post, a truck dock, a customs counter, a map
  of the sea or road route… Every phrase gets a picture that **moves**.
- Draw the idea **on the object** (the limit as a plate rising over the cube stack; the contract as
  lines on the waybill), like the reference film draws a geofence on the city.
- Callback: end where you started (episode 01 returns to the shop for "check that box").

## Framing a 9:16 camera (the mistakes we fixed)

- Vertical FOV 46° gives only ~0.48 × distance of horizontal view. To fit something W metres wide,
  the camera needs distance ≥ W / 0.45. Most stations need 22–33 units back.
- Aim the look-at point so the subject sits in y 520–1170 (between the term card and the caption).
  To move objects up on screen, aim lower.
- Perspective makes high, wide things (umbrella canopies) look wider than their footprint: leave margin.
- Frames during a camera flight may cross edges; settled shots may not.
- The waybill close-up: camera ~3.8 units from the 0.85 × 1.05 plane, look-at 0.25 below its centre.

## Overlays

- Term cards ("THIS IS CALLED / term / plain meaning") appear just after the picture shows the idea;
  question cards (charcoal) open each turn. Both live in `build.py` `TERMS`.
- Buyer messages appear on a **phone mockup** that slides up with typing dots (the person asked for a phone).
- Tags are clamped to the frame in `pinAll()`; hidden when behind the camera.
