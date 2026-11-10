#!/usr/bin/env bash
# Mux the rendered video with the master mix and build the delivery versions.
set -euo pipefail
cd "$(dirname "$0")/.."
V=build/video_master_noaudio.mp4
A=audio/mix/drillgeo_master.wav
mkdir -p renders
# master (upload quality, not committed: large)
ffmpeg -y -loglevel error -i "$V" -i "$A" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart build/drillgeo_shorts_master.mp4
# light clean version (repository)
ffmpeg -y -loglevel error -i "$V" -i "$A" -map 0:v -map 1:a -c:v libx264 -preset slow -crf 24 -tune animation -pix_fmt yuv420p -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart renders/drillgeo_shorts.mp4
# burned-in captions (above the Shorts UI)
ffmpeg -y -loglevel error -i "$V" -i "$A" -map 0:v -map 1:a -vf "ass=build/captions.ass" -c:v libx264 -preset slow -crf 24 -tune animation -pix_fmt yuv420p \
  -profile:v high -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart renders/drillgeo_shorts_legendado.mp4
ls -la build/drillgeo_shorts_master.mp4 renders/drillgeo_shorts*.mp4
