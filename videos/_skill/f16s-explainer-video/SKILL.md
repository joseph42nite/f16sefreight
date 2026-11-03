---
name: f16s-explainer-video
description: Make F16s "Cargo, explained" reels — 9:16 Instagram explainer videos that teach how freight moves by air, sea and road and how freight forwarding works (contracts, liability, special cargo, pricing, customs, documents) to ordinary people, as a 3D motion-graphics world with a Kokoro voiceover, built in HyperFrames + Three.js. Use whenever the person asks for a new F16s explainer, a new episode or topic for the series, a change to an existing episode, or a render of one. Not for other brands or general video work.
---

# F16s explainer video pipeline

You make one kind of video: an episode of **"Cargo, explained"** for F16s (f16sefreight.com), a
freight-forwarding software company. Each episode explains one tricky part of logistics, by air, sea or road, so that a
normal person, not only a logistics head, understands it in under two minutes.

The finished product is a **1080×1920, 30 fps MP4** (Instagram reel, grid-safe), about 90–120 s:
a 3D world the camera flies through (an airport, a port, a highway, a warehouse, whatever the topic needs), one hero object that carries the story (a box, a container, a truckload), a female Kokoro voice,
burned-in captions, "This is called…" term cards, soft sound effects, **no music**, and an end card
with the F16s logo and **f16sefreight.com**.

Episode 01 ("Who pays when your cargo is late?") is the reference build. Its builder, recorder,
assets and script are in `template/`. Start every new episode by copying `template/`, never from
a blank page.

## Non-negotiables (the person asked for each of these; don't drift)

1. **Script first.** Write `SCRIPT.md` and show the full script. Do not record or build until the person approves it. (`references/script.md`)
2. **Shape:** a hook that poses the problem → the line **"Let me explain."** → the explanation in signposted steps → the one-line takeaway → **"That's part two."** teaser if anything is left unexplained → "More at F-sixteens e-freight dot com."
3. **For ordinary people.** Every term is explained the first time it is said (air waybill = "your cargo's plane ticket"). Money in **dollars and rupees** (₹ lakh). If a concept can't be explained simply, defer it to "part two".
4. **Voiceover: Kokoro, voice `af_heart`**, run as the local Docker container `kokoro-tts` (not HeyGen, not silent). Pronounce the brand **"F-sixteens"**, never "F sixteen S". Tight gaps (~0.12 s) between lines.
5. **No background music.** Sound is voice + soft effects on visible actions, placed just before or after words, never on them; at most one low "impact" in the whole film. (`references/sound.md`)
6. **9:16, grid-safe.** All key content between y 300 and y 1170; captions at y≈1190; nothing important under y 1330 (Reels UI). Frame 0 is the thumbnail and must be a full, readable scene. **Nothing may leave the frame** once a shot settles. (`references/design.md`)
7. **Real 3D, not flat slides.** One Three.js world, the camera travels between stations, ideas are drawn onto the objects. Not 2D cards on a blue background. (`references/3d-world.md`)
8. **Palette:** warm, not all-blue — charcoal/slate/greys/peach/coral from the f16s site illustrations + the landing page's sky and brand blue. Inter only. (`references/design.md`)
9. **Show every phrase.** Each spoken idea gets a picture that moves (phones dropped into the box, the cart rolling in, days passing). Something new on screen every 2–4 s.
10. **Facts:** every legal/number claim must be checked against a primary source before publishing. Ask before web searching. Mark illustrative rates on screen ("≈", "approximate").

## Workflow

| Step | What you do | Read |
|---|---|---|
| 0 | Confirm tools are up: Docker + `kokoro-tts`, `npx hyperframes`, Chrome, ffmpeg | `references/tools.md` |
| 1 | Pick the topic with the person (or from `references/topics.md`), find the one idea and the hero object | `references/topics.md` |
| 2 | Write `SCRIPT.md` (+ a table of what's on screen per line). **Stop and show it.** | `references/script.md` |
| 3 | Copy `template/` to `videos/<episode-slug>/`; put the approved lines in `vo-script.json` | — |
| 4 | Record: `python3 scripts/record.py videos/<slug>` → `vo2/*.wav`, `vo2/timing.json`, `assets/audio/narration.wav` | `references/tools.md` |
| 5 | Write `STORYBOARD.md`: one row per phrase → picture, keyed to the anchor word | `references/3d-world.md` |
| 6 | Edit `build/build3d.py` (stations, camera keys, tags, overlays, SFX) and `build/build.py` (TERMS cards, caption fixes); run `python3 build/build3d.py` | `references/3d-world.md` |
| 7 | `npx hyperframes check --json` → fix errors; `npx hyperframes snapshot --at …` every station + every ~4 s → **look at every frame**, fix clipping/overlap/empty frames, repeat | `references/review.md` |
| 8 | Preview: `npx hyperframes preview --background` (Studio) or `npx hyperframes open .` (desktop app). Wait for approval. | — |
| 9 | Render, normalise loudness to −14 LUFS, spot-check frames, deliver | `references/tools.md` |

If the person edited the project in the HyperFrames desktop app, run `npx hyperframes catch-up .`
and diff before rebuilding; `build3d.py` regenerates `index.html`, `compositions/terms.html` and
`compositions/captions.html` and would overwrite their edits.

## Lessons the person taught (read `references/lessons.md` before step 2)

Each one cost a revision. In short: script first; INR next to USD; explain jargon or defer it;
"F-sixteens"; no music; few soft effects, not booms; 9:16 grid-safe; motion graphics that show the
phrase literally; 3D not flat; not too blue; nothing out of frame; a phone mockup when someone
sends a message; ghost/background words must be legible; the "path" progress bar was rejected;
**no tag, stamp or tick may hide behind a term/question card: check every overlap in time (Ep 03, 1:27).**

## Files

- `template/` — episode 01, ready to copy: `build/build3d.py` (3D world + index), `build/build.py`
  (shared word-timing helpers, TERMS cards, captions; also the older 2D builder), `build/parts.py`,
  `assets/` (plane render, logo, 8 SFX), `SCRIPT.md`, `STORYBOARD.md`, `hyperframes.json`, `package.json`.
- `scripts/record.py` — Kokoro recorder (resumable, word timestamps). `scripts/loudnorm.sh` — final mix.
- `references/` — `script.md`, `design.md`, `3d-world.md`, `sound.md`, `review.md`, `tools.md`,
  `topics.md`, `lessons.md`, `reference-film-analysis.md` (what we learned from a pro reference with hypit).
