# Tools (all open source, all local on this Mac)

| Tool | What it does here | Where / how |
|---|---|---|
| **HyperFrames** (HeyGen, open source) | HTML → video: preview, check, snapshot, render | `npx hyperframes@0.8.212 …` (pinned in `package.json`); skills in `~/.claude/skills/hyperframes*` |
| **Three.js** 0.181.2 | the 3D world | imported from `https://cdn.jsdelivr.net/npm/three@0.181.2/+esm` inside `index.html` |
| **GSAP** 3.14.2 | HTML overlay animation | `https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js` |
| **Kokoro TTS** (82M, via `remsky/kokoro-fastapi`) | the voiceover + word timestamps | Docker image `ghcr.io/remsky/kokoro-fastapi-cpu:latest`, container `kokoro-tts`, port 8880 |
| **earshot** (github.com/Leonxlnx/earshot) | sound-design rules (and optional film critique) | `videos/_refs/earshot` |
| **hypit** (hypit-ai/hypit) | analysing reference videos (probe, cut boundaries, labelled frame grids) | `/Volumes/Mac Valhalla/Projects/hypit` (`node bin/hypit.mjs …`) |
| **OpenAI Whisper** | transcribing a reference video (hypit's own WhisperX runtime isn't set up) | system `python3` has `whisper` + models in `~/.cache/whisper` |
| ffmpeg / ffprobe | loudness, frame grabs | on PATH |
| Google Chrome | HyperFrames rendering | installed |

## Kokoro

Note: `npx hyperframes tts` looks for a Python `kokoro-onnx` package that is **not** installed. Use the
Docker container instead (the person's own setup, also driven by `~/.hyphening-tts/kokoro-render`).

```bash
docker ps --format '{{.Names}} {{.Status}}' | grep kokoro-tts     # running?
docker start kokoro-tts                                            # if stopped
# if it is wedged (requests time out, CPU at 2000%): recreate it
docker rm -f kokoro-tts && docker run -d --name kokoro-tts -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu:latest
curl -sf localhost:8880/health                                     # ready after ~2 min warm-up
```

- Voice `af_heart`, speed 1.0, `POST /dev/captioned_speech` with `return_timestamps: true` gives audio + word times.
- Check a pronunciation: `POST /dev/phonemize {"text": "...", "language": "a"}`.
- On this Intel Mac with 4 GB for Docker a line takes ~1–2 min. Recording a whole script takes 15–25 min;
  run it in the background. `scripts/record.py` is resumable: re-running only re-records changed lines.
  More Docker memory (Docker Desktop → Resources) makes it faster.

## Build, preview, render

```bash
cd videos/<slug>
python3 build/build3d.py                       # writes index.html + compositions/
npx hyperframes check --json
npx hyperframes snapshot --at 0,5,12 --json    # look at the frames
npx hyperframes preview --background           # Studio at http://localhost:300x/#project/<slug>
npx hyperframes open .                         # HyperFrames desktop app (bigger, has Framey chat)
npx hyperframes catch-up .                     # after the person used the desktop app
npx hyperframes render --quality delivery -o renders/<slug>_reel.mp4   # ~15 min for 110 s of 3D
bash ../_skill/f16s-explainer-video/scripts/loudnorm.sh renders/<slug>_reel.mp4
```

## Analysing a reference video with hypit

```bash
H="/Volumes/Mac Valhalla/Projects/hypit/bin/hypit.mjs"
node "$H" media probe ref.mp4
node "$H" media boundaries ref.mp4                       # where the cuts are (few = one continuous world)
node "$H" media tile ref.mp4 --start 0 --end 80 --every 2.5 --columns 8 --cell 240 --to evidence/overview.jpg
node "$H" media tile ref.mp4 --start 33 --end 42 --every 0.45 --columns 10 --cell 200 --to evidence/move.jpg
```

Transcribe with Whisper into hypit's format (`hypit.transcript@1`, see
`videos/_refs/video-23373/transcript.json`) if you need word-level context.
