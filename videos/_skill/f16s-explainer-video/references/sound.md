# Sound

**No music** (the person said so). Voice + effects only.

Learned from **earshot** (open source, github.com/Leonxlnx/earshot — a toolkit that gives agents
"ears"; its `docs/launch-video-sound.md` measures professional launch films):

- Not a hit on every cut. Accents go on moments that mean something; the rest is quiet.
- **Never put a big hit on top of a key word** while the voice speaks; place effects ~0.05–0.3 s before
  or after the word.
- One element in the low end at a time. At most **one** `impact-bass-1` in the film (episode 01: right
  after "per kilo"). The first cut had 8 booms and was called "too many sub booms".
- Rotate takes for repeats (`click-soft` / `key-press`, `whoosh` / `whoosh-short`).

The person later asked for **more** effects: one soft effect per visible action is right
(~70 in episode 01) as long as volumes stay low (0.15–0.35) and the rule above holds.

## Kit (`template/assets/audio/sfx/`, from the HyperFrames media-use bundle)

| File | Use for | Volume |
|---|---|---|
| `click-soft.mp3` / `key-press.mp3` | taps, ticks, letters, coins landing, card pops | 0.2–0.35 |
| `pop.mp3` | tags, stamps, tick marks, logo | 0.2–0.3 |
| `whoosh.mp3` / `whoosh-short.mp3` | camera flights, things flying | 0.15–0.25 |
| `typing.mp3` | counters, scales, clock hands (cut to 0.5–1 s) | 0.16–0.2 |
| `impact-bass-1.mp3` | the one payoff number | ≤ 0.18 |

## Levels

Narration track at volume 1. After render: `scripts/loudnorm.sh <file>` → −14 LUFS integrated,
true peak ≤ −1 dBTP (Instagram). The raw render comes out around −25 LUFS; don't skip this.
Say in the hand-off that levels were measured, not listened to.

`earshot` can also critique a finished film (`earshot critique film.mp4`) if it is installed
(`/Volumes/Mac Valhalla/Projects/f16sefreight/videos/_refs/earshot`); optional.
