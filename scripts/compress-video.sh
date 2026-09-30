#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# KisanSathi Video Compression Script
# Produces web-optimized MP4 (H.264), WebM (VP9), and WebP poster frames.
# Requirements:
# - MP4: H.264, no audio track, ~1280x720, CRF 28, faststart (< 3MB for hero)
# - WebM: VP9, no audio track, ~1280x720, CRF 33 (< 3MB for hero, < 1.5MB for clips)
# - Poster: .webp frame at 0.5s
# ==============================================================================

# Locate ffmpeg binary
FFMPEG="ffmpeg"
if ! command -v ffmpeg &> /dev/null; then
  if [ -f "/c/Users/poona/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe" ]; then
    FFMPEG="/c/Users/poona/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe"
  elif [ -f "C:/Users/poona/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe" ]; then
    FFMPEG="C:/Users/poona/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe"
  else
    echo "Error: ffmpeg not found in PATH or WinGet Links." >&2
    exit 1
  fi
fi

INPUT="${1:-frontend/public/videos/raw-hero.mp4}"
BASENAME="${2:-hero}"
OUT_DIR="${3:-frontend/public/videos}"

mkdir -p "$OUT_DIR"

if [ ! -f "$INPUT" ]; then
  echo "Input file '$INPUT' does not exist." >&2
  exit 1
fi

echo "=========================================================="
echo "Compressing: $INPUT -> $OUT_DIR/$BASENAME.*"
echo "=========================================================="

# 1. Generate Web-optimized MP4 (H.264, CRF 28, no audio, faststart, 1280x720 max)
echo "[1/3] Generating MP4 (H.264, no audio, faststart)..."
"$FFMPEG" -y -i "$INPUT" \
  -an \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2" \
  -c:v libx264 -profile:v high -level 4.0 \
  -crf 28 -preset slow \
  -movflags +faststart \
  "$OUT_DIR/${BASENAME}.mp4"

# 2. Generate WebM (VP9, CRF 33, no audio, 1280x720 max)
echo "[2/3] Generating WebM (VP9, no audio)..."
"$FFMPEG" -y -i "$INPUT" \
  -an \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2" \
  -c:v libvpx-vp9 -b:v 0 -crf 33 \
  "$OUT_DIR/${BASENAME}.webm"

# 3. Generate Poster Image (.webp, quality 85)
echo "[3/3] Generating Poster WebP..."
"$FFMPEG" -y -ss 00:00:00.500 -i "$INPUT" \
  -vframes 1 \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease" \
  -c:v libwebp -quality 85 \
  "$OUT_DIR/${BASENAME}-poster.webp"

echo "=========================================================="
echo "Done! Generated files:"
ls -lh "$OUT_DIR/${BASENAME}.mp4" "$OUT_DIR/${BASENAME}.webm" "$OUT_DIR/${BASENAME}-poster.webp"
echo "=========================================================="
