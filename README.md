# Bond Design Studio — Frame Extraction

The scroll-driven hero uses pre-extracted JPEG frames rendered to a `<canvas>` element for smooth, jitter-free scrubbing.

## Step 1 — Extract frames with ffmpeg

Run this from the project root:

```bash
ffmpeg -i assets/videos/Camera_moves_through_202604131357.mp4 \
  -vf "fps=15,scale=1920:-1" \
  -q:v 5 \
  frames/frame%04d.jpg
```

**What each flag does:**
- `fps=15` — 15 frames per second (smooth at typical scroll speeds)
- `scale=1920:-1` — scale to 1920px wide, preserve aspect ratio
- `-q:v 5` — JPEG quality 5 (1=best, 31=worst; 5 is high quality ~200–400KB/frame)

## Step 2 — Count frames and update the script

After extraction, run:

```bash
ls frames/*.jpg | wc -l
```

Then open `index.html` and set `FRAME_COUNT` in the hero script to the exact number returned.

## Step 3 — Rename source video (optional)

If your final video is delivered as `assets/hero-video.mp4`, update the `ffmpeg -i` path accordingly and re-run the extraction.

## Notes

- The `frames/` directory is gitignored (add `frames/` to `.gitignore` — they can be large).
- Frames are named `frame0001.jpg`, `frame0002.jpg`, … — zero-padded to 4 digits.
- At 15fps a 10-second video = 150 frames (~50–80MB total at q:v 5).
