# Reviewing before you show the person

A passing `check` is not a look. Every round:

1. `npx hyperframes check --json` — fix every error. Expected warnings: `composition_file_too_large`
   (the 3D index), `text_below_floor` on in-scene labels.
2. `npx hyperframes snapshot --at <times> --json` → read the contact sheets. Sample:
   - frame 0 (the cover), every station once settled, every anchor word that triggers an action,
   - a sweep every 4 s across the whole film.
3. For each frame ask:
   - Is anything cut by the frame edge once the shot has settled? (tags, signs, umbrellas, stacks)
   - Is anything hidden behind the term card (y 330–505) or the caption (y 1190)?
   - Is the frame empty or static? Something should be happening on every phrase.
   - Does each action land on its word (a lookup can match the wrong word: "Now" for "no")?
   - Do two tags overlap?
  - **Does any tag, stamp or tick pop in while a term or question card is up, and land under it?**
    (Ep 03, 1:27: the "Cleared" stamp hid behind the "Customs" card.) For every TAG, compare its
    show/hide window with every TERMS window; where they overlap, snapshot that moment and look.
    The clamp at y 300 pulls a high-pinned tag straight into the card zone (330–505).
    List the moments to look at (run from the episode folder):
    ```bash
    python3 -c "import sys; sys.path.insert(0, 'build'); import build3d as D, build as B
    [print(tid, s, h, 'overlaps', title, round(ts, 2), round(te, 2)) for tid, _, _, s, h in D.TAGS
     for k, ts, te, title, _ in B.TERMS if s > 0 and s < te and h > ts]"
    ```
    Ep 03 had four such moments; three tags were hiding (1:27 "Cleared", 0:26 "Borrowed", 1:02 "Outside the port").
4. Fix, rebuild, re-snapshot only what changed, then one more sweep.
5. The person reports times like "1.07" — that is usually **1:07** (Studio/desktop timecode), not 1.07 s.
   Check both.

Snapshots are written under `.hyperframes/artifacts/snapshots/<id>/` (contact sheets + single frames).
