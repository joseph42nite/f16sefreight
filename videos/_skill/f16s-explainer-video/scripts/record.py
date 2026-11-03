"""Record an episode's voiceover with Kokoro (Docker container `kokoro-tts`, port 8880).

Usage: python3 record.py <episode-dir>

Reads <episode-dir>/vo-script.json:
  {"voice": "af_heart", "speed": 1.0, "gap": 0.12, "first_gap": 0.2, "lines": ["...", "..."]}
Writes one WAV per line plus Kokoro's word timestamps to <episode-dir>/vo2/, then lays the lines
end to end into <episode-dir>/assets/audio/narration.wav and writes vo2/timing.json
({starts, durs, end, words: [{beat, w, s, e}]}), which build/build.py reads.

Resumable: a line whose WAV and JSON exist with the same text is not re-requested, so a hang or a
changed line costs one line, not the whole script. Each request waits up to 4 minutes.
"""
import base64
import json
import os
import subprocess
import sys
import urllib.request

URL = "http://localhost:8880/dev/captioned_speech"


def dur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True).stdout)


def main(ep):
    cfg = json.load(open(os.path.join(ep, "vo-script.json")))
    lines, voice, speed = cfg["lines"], cfg.get("voice", "af_heart"), cfg.get("speed", 1.0)
    gaps = [cfg.get("first_gap", 0.2)] + [cfg.get("gap", 0.12)] * (len(lines) - 1)
    vo = os.path.join(ep, "vo2")
    os.makedirs(vo, exist_ok=True)
    os.makedirs(os.path.join(ep, "assets", "audio"), exist_ok=True)

    for i, text in enumerate(lines, 1):
        wav, js = f"{vo}/vo-{i:02d}.wav", f"{vo}/vo-{i:02d}.json"
        if os.path.exists(wav) and os.path.exists(js) and json.load(open(js)).get("text") == text:
            continue
        body = json.dumps({"model": "kokoro", "input": text, "voice": voice, "response_format": "wav", "speed": speed,
                           "stream": False, "return_timestamps": True}).encode()
        resp = json.load(urllib.request.urlopen(urllib.request.Request(URL, body, {"Content-Type": "application/json"}), timeout=240))
        open(wav + ".raw.wav", "wb").write(base64.b64decode(resp["audio"]))
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", wav + ".raw.wav", "-ar", "48000", wav], check=True)
        os.remove(wav + ".raw.wav")
        json.dump({"text": text, "timestamps": resp.get("timestamps", [])}, open(js, "w"))
        print("recorded", i, round(dur(wav), 2), flush=True)

    t, words, starts, durs = 0.0, [], [], []
    for i in range(1, len(lines) + 1):
        d = dur(f"{vo}/vo-{i:02d}.wav")
        t += gaps[i - 1]
        s = round(t, 3)
        starts.append(s); durs.append(d)
        for w in json.load(open(f"{vo}/vo-{i:02d}.json"))["timestamps"]:
            words.append({"beat": i, "w": w["word"], "s": round(s + w["start_time"], 2), "e": round(s + w["end_time"], 2)})
        t += d
    json.dump({"starts": starts, "durs": durs, "end": round(t, 3), "words": words}, open(f"{vo}/timing.json", "w"), indent=0)

    inputs, filt = [], []
    for i, s in enumerate(starts):
        inputs += ["-i", f"{vo}/vo-{i + 1:02d}.wav"]
        ms = int(s * 1000)
        filt.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
    filt.append("".join(f"[a{i}]" for i in range(len(starts))) + f"amix=inputs={len(starts)}:normalize=0,apad=pad_dur=6[out]")
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[out]",
                    "-t", str(round(t + 4.5, 2)), "-ar", "48000", "-ac", "2", os.path.join(ep, "assets", "audio", "narration.wav")], check=True)
    print("narration", round(t, 2), "s")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
