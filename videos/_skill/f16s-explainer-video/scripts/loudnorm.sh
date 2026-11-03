#!/usr/bin/env bash
# Normalise a rendered reel to Instagram loudness (-14 LUFS, true peak <= -1.5 dBTP) without
# re-encoding the picture, then print the measured result.
# Usage: bash loudnorm.sh renders/<file>.mp4
set -euo pipefail
f="$1"
tmp="${f%.mp4}.loudnorm.tmp.mp4"
ffmpeg -v error -y -i "$f" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$tmp"
mv "$tmp" "$f"
ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:"
