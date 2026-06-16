# Animated Website — Cinematic Hero Orchestrator

**Purpose:** This skill orchestrates the full build pipeline for animated websites: it generates a cinematic background image via Replicate (Nano Banana), converts it to a video via kie.ai (Google Veo), extracts frames with FFmpeg, builds a canvas scroll-scrubber hero section, then builds the full site following standard design quality rules.

**CRITICAL:** Read this file top-to-bottom and execute every step in order. Do not skip steps. Do not start building HTML until Steps 1–4 are complete.

---

## Pre-flight — Read design skills first

Before any step below, read both of these in full:

1. `~/.claude/skills/ui-ux-pro-max/SKILL.md` (or `.claude/skills/ui-ux-pro-max/SKILL.md` in this project)
2. `~/.claude/skills/frontend-design/SKILL.md` (or `.claude/skills/frontend-design/SKILL.md` in this project)

These govern typography, layout, spacing, and visual quality for the full site. You will need them in Step 6.

---

## Pre-flight — Load API keys

API keys are written by Goober Builder to `~/.goober/goober-secrets.sh` whenever you save them in the Integrations tab. Source that file — **no Keychain password prompts**:

```bash
SECRETS_FILE="$HOME/.goober/goober-secrets.sh"
if [ -f "$SECRETS_FILE" ]; then
  # shellcheck source=/dev/null
  source "$SECRETS_FILE"
else
  echo "ERROR: ~/.goober/goober-secrets.sh not found."
  echo "Open Goober → Integrations → Connections and save your Replicate and kie.ai API keys, then retry."
  exit 1
fi
```

Check both keys are non-empty:
```bash
if [ -z "$REPLICATE_API_TOKEN" ]; then
  echo "ERROR: Replicate API key not set."
  echo "Add it in Goober → Integrations → Connections → Replicate API key and save."
  exit 1
fi
if [ -z "$KIE_API_KEY" ]; then
  echo "ERROR: kie.ai API key not set."
  echo "Add it in Goober → Integrations → Connections → kie.ai API key and save."
  exit 1
fi
echo "✓ API keys loaded from ~/.goober/goober-secrets.sh"
```

---

## Pre-flight — Create required directories

Run these commands before anything else:

```bash
mkdir -p assets/frames
mkdir -p assets/video
```

Print: `✓ Directories ready`

---

## STEP 1 — Analyse the hero image (or brand brief) and craft the Replicate prompt

**Goal:** Write a detailed image generation prompt that will produce a cinematic, full-bleed 16:9 background optimised for video animation. Source material is the uploaded hero image if one exists — otherwise derive everything from the brand brief in CLAUDE.md.

**1a. Check whether a hero image exists:**

```bash
HERO_IMAGE=$(ls assets/images/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP} 2>/dev/null | head -1)
if [ -n "$HERO_IMAGE" ]; then
  echo "✓ Hero image found: $HERO_IMAGE — will use as Nano Banana reference"
  HAS_HERO_IMAGE=true
else
  echo "⚠ No hero image found — will generate from brand brief (text-only)"
  HAS_HERO_IMAGE=false
fi
```

**1b. Gather source material:**

- **If `HAS_HERO_IMAGE=true`:** Open and visually analyse the image. Note:
  - Primary subject (landscape, architecture, people, abstract, interior, product, etc.)
  - Lighting quality (golden hour, overcast, studio, dramatic, night)
  - Dominant colour palette and mood
  - Any elements that should carry through to the generated version

- **If `HAS_HERO_IMAGE=false`:** Read CLAUDE.md and extract:
  - Industry / business type
  - Brand tone and keywords (bold, luxury, energetic, professional, friendly, etc.)
  - Any colour preferences or visual references
  - The feeling the brand wants to convey

**1c. Write the Replicate image prompt:**

Craft a prompt that:
- Describes a **cinematic widescreen scene** matching the subject or brand (16:9, full-bleed)
- Specifies **clear negative space** in the centre and lower third — where hero text will sit — no clutter in those zones
- Uses photorealistic, ultra-high-detail language appropriate to the subject
- Includes the brand's visual tone
- **Explicitly states: no text, no words, no captions, no watermarks, no logos in the image**
- Ends with: `cinematic lighting, 8K resolution, award-winning photography, ultra-detailed, no text`

Also note in the prompt that the image will be used as the **first frame of a video** — it should have inherent motion potential (e.g. moving clouds, flowing water, swaying trees, dynamic light).

**Save the prompt to `assets/video/replicate-prompt.txt`**

Print: `✓ Step 1: Replicate prompt crafted — source: [hero image / brand brief] — saved to assets/video/replicate-prompt.txt`

---

## STEP 2 — Generate background image via Replicate (Nano Banana)

**Goal:** Call Nano Banana to generate the cinematic background image. If a hero image was uploaded, send it as a reference so Nano Banana re-imagines it. If no image was uploaded, generate from the text prompt alone.

`$REPLICATE_API_TOKEN` is already set in the environment from the pre-flight source step.
`$HAS_HERO_IMAGE` and `$HERO_IMAGE` are set from Step 1.

**2a. Build request JSON and call Replicate:**

```bash
PROMPT=$(cat assets/video/replicate-prompt.txt)

if [ "$HAS_HERO_IMAGE" = "true" ]; then
  # ── IMAGE-GUIDED GENERATION ───────────────────────────────
  # Base64-encode the hero image and pass it as the reference input.
  HERO_MIME=$(file --mime-type -b "$HERO_IMAGE")
  HERO_B64=$(base64 -i "$HERO_IMAGE" | tr -d '\n')
  echo "✓ Hero image encoded — sending as reference to Nano Banana"

  REQUEST_JSON=$(jq -n \
    --arg prompt "$PROMPT" \
    --arg image "data:${HERO_MIME};base64,${HERO_B64}" \
    '{
      input: {
        prompt: $prompt,
        image: $image,
        image_prompt_strength: 0.35,
        resolution: "2K",
        aspect_ratio: "16:9",
        output_format: "png",
        safety_filter_level: "block_only_high",
        allow_fallback_model: false
      }
    }')
  # image_prompt_strength 0.35 = strong creative reinterpretation while preserving subject/mood.
  # Increase toward 0.5 to stay closer to the reference; lower to 0.2 for more creative freedom.

else
  # ── TEXT-ONLY GENERATION ─────────────────────────────────
  # No hero image provided — generate entirely from the brand brief prompt.
  echo "⚠ No hero image — generating from text prompt only"

  REQUEST_JSON=$(jq -n \
    --arg prompt "$PROMPT" \
    '{
      input: {
        prompt: $prompt,
        resolution: "2K",
        aspect_ratio: "16:9",
        output_format: "png",
        safety_filter_level: "block_only_high",
        allow_fallback_model: false
      }
    }')
fi

# Specs: 16:9 landscape · 2K resolution · PNG · Prefer:wait (synchronous response)
REPLICATE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: wait" \
  -d "$REQUEST_JSON" \
  https://api.replicate.com/v1/models/google/nano-banana-pro/predictions)

echo "$REPLICATE_RESPONSE"
```

**2c. Extract the output URL and download:**

```bash
IMAGE_URL=$(echo "$REPLICATE_RESPONSE" | python3 -c "
import sys, json
d = json.load(sys.stdin)
status = d.get('status','')
output = d.get('output', [])
if status == 'succeeded' and output:
    print(output[0])
else:
    print('')
")

if [ -z "$IMAGE_URL" ]; then
  echo "⚠ Replicate generation failed or returned no output."
  echo "Response: $REPLICATE_RESPONSE"
  if [ "$HAS_HERO_IMAGE" = "true" ]; then
    echo "Falling back to original hero image."
    cp "$HERO_IMAGE" assets/images/hero-bg-generated.png
    echo "FALLBACK" > assets/video/replicate-image-url.txt
  else
    echo "ERROR: No hero image to fall back to and Replicate returned no output. Check your API key and credits."
    exit 1
  fi
else
  echo "$IMAGE_URL" > assets/video/replicate-image-url.txt
  curl -sL "$IMAGE_URL" -o assets/images/hero-bg-generated.png
fi
```

**2d. Visually verify the generated image — REQUIRED before proceeding to kie.ai:**

Open `assets/images/hero-bg-generated.png` and inspect it. Check ALL of the following:

| Check | Pass condition |
|-------|----------------|
| Subject integrity | If hero image used: original subject/mood is recognisable. If text-only: scene matches the brand prompt. |
| No text overlay | No words, letters, watermarks, or captions visible anywhere in the image |
| Landscape orientation | Image is wider than tall (16:9) |
| Usable as background | Sufficient negative space in centre/lower third for hero text overlays |
| No artefacts | No obvious AI artefacts, corruption, blank patches, or distorted areas |
| Motion potential | Scene has elements that could animate naturally (light, atmosphere, texture, depth) |

- If ALL checks pass → print `✓ Step 2: Image verified — proceeding to video generation` and continue.
- If ANY check fails → print a description of what failed, then use the fallback:
  ```bash
  cp "$HERO_IMAGE" assets/images/hero-bg-generated.png
  echo "FALLBACK" > assets/video/replicate-image-url.txt
  echo "⚠ Verification failed — using original hero image as fallback for video generation"
  ```

Print: `✓ Step 2: Background image ready → assets/images/hero-bg-generated.png`

---

## STEP 3 — Generate video via kie.ai (Google Veo)

**Goal:** Convert the verified background image into a cinematic video using Google Veo via the kie.ai API.

`$KIE_API_KEY` is already set in the environment from the pre-flight source step.

**3a. Resolve the image URL for kie.ai:**

kie.ai requires a publicly accessible URL. Use the Replicate CDN URL saved in Step 2 when available. If the fallback was used (original hero image), upload the local file to Replicate's file endpoint first:

```bash
SAVED_URL=$(cat assets/video/replicate-image-url.txt)

if [ "$SAVED_URL" = "FALLBACK" ] || [ -z "$SAVED_URL" ]; then
  echo "Uploading fallback image to Replicate file storage for kie.ai access..."
  UPLOAD_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
    -H "Content-Type: application/octet-stream" \
    --data-binary @assets/images/hero-bg-generated.png \
    https://api.replicate.com/v1/files)
  IMAGE_URL=$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('urls',{}).get('get',''))")
  echo "$IMAGE_URL" > assets/video/replicate-image-url.txt
else
  IMAGE_URL="$SAVED_URL"
fi

echo "Image URL for kie.ai: $IMAGE_URL"
```

**3b. Submit the generation job:**

Pass the same image as both first and last frame so Veo animates the scene and returns to the same composition — creating a natural loop that never feels like it restarts.

Craft a video motion prompt that matches the mood of the hero image from Step 1. Use the subject and atmosphere you identified (e.g. dramatic push for landscapes, sweeping pan for architecture, slow drift for abstract). The prompt below is the **base template** — tailor the specific motion style to the subject:

```bash
# ── CHOOSE CAMERA MOVEMENT ───────────────────────────────────────────────────
# Pick the PRIMARY camera move that fits the subject from Step 1 analysis:
#
#   Landscape / nature    → slow cinematic zoom IN to subject, organic handheld breathing,
#                           parallax depth layers separating as camera pushes forward
#
#   Architecture / urban  → dramatic low-angle zoom OUT revealing full scale of building,
#                           sweeping lateral pan with subtle lens distortion, epic reveal
#
#   Abstract / texture    → slow morphing zoom IN to surface detail, surreal depth pull,
#                           colour and light bloom evolving organically
#
#   People / lifestyle    → gentle handheld zoom IN with natural camera sway, shallow
#                           depth of field pull shifting focus foreground to background
#
#   Interior / space      → slow push IN through the space, gentle rack focus, ambient
#                           light shifting and breathing on surfaces
#
#   Product / brand       → elegant orbit around subject, dramatic rim light sweep,
#                           subtle zoom IN to key detail with cinematic flare
#
# Then set the variable:
CAMERA_MOVE="[chosen camera move description from above]"

# ── BUILD THE FULL MOTION PROMPT ─────────────────────────────────────────────
# Always include: zoom direction, organic camera energy, atmospheric motion, loop-safe.
MOTION_PROMPT="${CAMERA_MOVE}, natural organic handheld camera breathing and micro-movement, volumetric light rays shifting and evolving through frame, atmospheric depth with foreground parallax layers separating from background, rich cinematic colour grading with dynamic shadows, dramatic light and shadow interplay, photorealistic immersive motion, smooth seamless loop with matching start and end frame, no text, no watermarks, no logos, no people entering or leaving frame"

KIE_REQUEST=$(jq -n \
  --arg imageUrl "$IMAGE_URL" \
  --arg prompt "$MOTION_PROMPT" \
  '{
    model: "veo3_fast",
    generationMode: "FIRST_AND_LAST_FRAMES_2_VIDEO",
    imageUrls: [$imageUrl, $imageUrl],
    aspectRatio: "16:9",
    resolution: "1080p",
    prompt: $prompt
  }')

KIE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$KIE_REQUEST" \
  https://api.kie.ai/api/veo/v1/generate)
# Specs: veo3_fast · 16:9 · 1080p · same image for first+last frame (seamless loop)

echo "$KIE_RESPONSE"
```

> **Note:** If you receive a 404, check the kie.ai API dashboard for the correct endpoint base path — the query endpoint uses the same base.

Extract `data.taskId` from the response JSON. Save to `assets/video/kie-task-id.txt`.

**3b. Poll for completion** (every 15 seconds, up to 20 minutes):

```bash
TASK_ID=$(cat assets/video/kie-task-id.txt)
ELAPSED=0

while true; do
  QUERY=$(curl -s \
    -H "Authorization: Bearer $KIE_API_KEY" \
    "https://api.kie.ai/api/veo/v1/query/$TASK_ID")
  
  STATUS=$(echo "$QUERY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('status','unknown'))")
  
  echo "⏳ Step 3: Video generating... (${ELAPSED}s elapsed) — status: $STATUS"
  
  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "succeed" ] || [ "$STATUS" = "success" ]; then
    VIDEO_URL=$(echo "$QUERY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('videoUrl','') or d.get('data',{}).get('video_url',''))")
    echo "$VIDEO_URL" > assets/video/kie-video-url.txt
    break
  fi
  
  if [ "$STATUS" = "failed" ] || [ "$STATUS" = "error" ]; then
    echo "⚠ kie.ai video generation failed. Check your API key, credits, and endpoint."
    exit 1
  fi
  
  if [ $ELAPSED -ge 1200 ]; then
    echo "⚠ kie.ai timed out after 20 minutes."
    exit 1
  fi
  
  sleep 15
  ELAPSED=$((ELAPSED + 15))
done
```

**3c. Download the video:**

```bash
curl -sL "$(cat assets/video/kie-video-url.txt)" -o assets/video/hero-bg.mp4
```

Verify `assets/video/hero-bg.mp4` exists and is > 10KB.

Print: `✓ Step 3: Video downloaded → assets/video/hero-bg.mp4`

---

## STEP 4 — Extract frames with FFmpeg

**Goal:** Convert the video to individual JPEG frames for canvas scroll scrubbing.

**4a. Check video duration:**

```bash
DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 assets/video/hero-bg.mp4)
echo "Video duration: ${DURATION}s"
```

**4b. Choose extraction rate:**
- If `DURATION ≤ 12`: extract at **24fps** → `fps=24`
- If `DURATION > 12`: extract at **12fps** (every 2nd frame) → `fps=12`
  This keeps the total frame count at ≤ 288 for performance.

**4c. Extract:**

```bash
# For duration ≤ 12s:
ffmpeg -i assets/video/hero-bg.mp4 \
  -vf "fps=24,scale=1920:1080" \
  -q:v 3 \
  assets/frames/frame_%04d.jpg

# For duration > 12s (swap fps=24 for fps=12):
ffmpeg -i assets/video/hero-bg.mp4 \
  -vf "fps=12,scale=1920:1080" \
  -q:v 3 \
  assets/frames/frame_%04d.jpg
```

**4d. Record frame count:**

```bash
FRAME_COUNT=$(ls assets/frames/frame_*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "$FRAME_COUNT" > assets/frames/frame-count.txt
echo "Total frames extracted: $FRAME_COUNT"
```

Verify `FRAME_COUNT > 0`. If zero, stop and report the ffmpeg error.

**4e. Extract the video's dominant fade colour:**

Sample the last frame to get the dominant dark/muted colour. This colour is used in Step 5 to fade the video out, and in Step 6 to make the first section below the hero blend seamlessly.

```bash
# Sample the last extracted frame and find the dominant colour.
LAST_FRAME=$(ls assets/frames/frame_*.jpg 2>/dev/null | sort | tail -1)

DOMINANT_COLOUR=$(python3 - <<'EOF'
import sys, os, json
try:
    from PIL import Image
    img = Image.open(sys.argv[1]).convert('RGB')
    img = img.resize((80, 45))   # fast sample
    pixels = list(img.getdata())
    # Bias toward darker pixels (better for text readability on overlay)
    dark = [p for p in pixels if (p[0]+p[1]+p[2]) < 480]
    sample = dark if dark else pixels
    r = sum(p[0] for p in sample) // len(sample)
    g = sum(p[1] for p in sample) // len(sample)
    b = sum(p[2] for p in sample) // len(sample)
    # Darken slightly so text stays readable
    r, g, b = int(r*0.55), int(g*0.55), int(b*0.55)
    print('#{:02x}{:02x}{:02x}'.format(r, g, b))
except Exception:
    print('#0d0d0d')   # safe near-black fallback
EOF
"$LAST_FRAME")

echo "$DOMINANT_COLOUR" > assets/video/dominant-colour.txt
echo "✓ Dominant fade colour: $DOMINANT_COLOUR"
```

> If `Pillow` is not installed: `pip3 install Pillow --quiet`. If unavailable, Claude should visually inspect the last frame and choose a close hex equivalent, saving it to `assets/video/dominant-colour.txt`.

Print: `✓ Step 4: ${FRAME_COUNT} frames extracted → assets/frames/ | Fade colour: $DOMINANT_COLOUR`

---

## STEP 5 — Plan visual story strategy, then build the canvas hero

**Goal:** Design the scroll-driven visual narrative first, then implement it. The hero must feel like a cinematic experience — the video plays on scroll, and text layers reveal in choreographed phases that match the motion and mood.

---

### 5a — Visual story planning (do this before writing any code)

Read CLAUDE.md. Extract:
- Business name
- Primary headline / value proposition
- Secondary headline or key differentiator (if present)
- Tagline / subheading
- Primary CTA (label + href)
- Secondary CTA (label + href, if any)
- Brand tone (bold/elegant/energetic/professional/friendly)

Then design the **text reveal sequence** for this specific brand. Choose from:

| Brand tone | Recommended reveal style |
|------------|--------------------------|
| Bold / energetic | Headline slams in large (scale 1.08→1.0), holds, tagline slides up |
| Elegant / luxury | Everything fades in slowly with gentle upward drift, generous spacing |
| Professional / trust | Label first, headline rises cleanly, CTA appears last with confidence |
| Friendly / approachable | Warm fade-in sequence, headline and tagline appear close together |

Decide the **phase timing** based on how many text elements exist:

- **2 elements** (headline + CTA): phases at 20%, 55%
- **3 elements** (headline + tagline + CTA): phases at 20%, 45%, 65%
- **4 elements** (label + headline + tagline + CTA): phases at 10%, 25%, 50%, 68%
- **5 elements** (label + headline 1 + headline 2 + tagline + CTA): phases at 8%, 22%, 42%, 60%, 75%

Write out your plan as a comment block at the top of the `<script>` before the code.

---

### 5b — Canvas scroll-scrubber JavaScript

Read `FRAME_COUNT` from `assets/frames/frame-count.txt`.
Read `DOMINANT_COLOUR` from `assets/video/dominant-colour.txt`.
Replace `%%FRAME_COUNT%%` and `%%DOMINANT_COLOUR%%` with the actual values before writing the file.

```javascript
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     VISUAL STORY PLAN  (Claude fills this in from 5a)
     ─────────────────────────────────────────────────────────────────
     Phase 0 — 0–8%:    Video breathes. Nothing yet. Scroll indicator visible.
     Phase 1 — 8–20%:   Industry label fades in.
     Phase 2 — 15–38%:  Primary headline ZOOMS IN from large (1.18→1.0).
                         Bold luxury title card — takes up most of the viewport.
     Phase 3 — 42–58%:  [h2 or skip]. h1 yields if h2 exists.
     Phase 4 — 55–70%:  Tagline drifts up softly beneath headline.
     Phase 5 — 68–82%:  CTA buttons appear — the payoff.
     Phase 6 — 80–100%: ALL text fades OUT as video dissolves to flat colour.
                         Colour overlay ramps in. Everything exits gracefully.
     ───────────────────────────────────────────────────────────────── */

  var canvas    = document.getElementById('hero-canvas');
  var colourOverlay = document.getElementById('hero-colour-fade');
  if (!canvas) return;
  var ctx       = canvas.getContext('2d');
  var frameCount   = %%FRAME_COUNT%%;
  var fadeColour   = '%%DOMINANT_COLOUR%%'; /* from assets/video/dominant-colour.txt */

  /* ── Mobile / reduced-motion fallback ───────────────────────────── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile || prefersReducedMotion) {
    canvas.style.display = 'none';
    var staticBg = document.getElementById('hero-static-bg');
    if (staticBg) staticBg.style.display = 'block';
    document.querySelectorAll('.hero-phase').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    return;
  }

  /* ── Frame preload ───────────────────────────────────────────────── */
  var frames = [];
  function pad(n, len) { var s = String(n); while (s.length < len) s = '0' + s; return s; }
  for (var i = 1; i <= frameCount; i++) {
    (function (idx) {
      var img = new Image();
      img.src = '/assets/frames/frame_' + pad(idx, 4) + '.jpg';
      frames.push(img);
    })(i);
  }

  /* ── Canvas draw ─────────────────────────────────────────────────── */
  var currentFrame = 0, targetFrame = 0;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(Math.round(currentFrame));
  }

  function drawFrame(idx) {
    var i   = Math.max(0, Math.min(frameCount - 1, idx));
    var img = frames[i];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }

  /* ── Easing ──────────────────────────────────────────────────────── */
  function lerp(a, b, t)   { return a + (b - a) * t; }
  function clamp(v, lo, hi){ return Math.min(hi, Math.max(lo, v)); }
  function smoothstep(t)   { t = clamp(t,0,1); return t*t*(3-2*t); }
  function easeOutExpo(t)  { return t === 1 ? 1 : 1 - Math.pow(2, -10*t); } /* snappy luxury feel */

  function phaseIn(p, s, e)        { return smoothstep(clamp((p-s)/(e-s),0,1)); }
  function phaseInOut(p,is,ie,os,oe) {
    return clamp(smoothstep(clamp((p-is)/(ie-is),0,1)) - smoothstep(clamp((p-os)/(oe-os),0,1)),0,1);
  }

  /* ── Text phase controller ───────────────────────────────────────── */
  function updatePhases(progress) {
    var hasH2 = !!document.getElementById('hero-h2');

    /* ── EXIT FADE: from 80% all text dissolves as colour takes over ── */
    var exitFade = 1 - smoothstep(clamp((progress - 0.80) / 0.18, 0, 1));

    /* Label */
    var labelOp = phaseIn(progress, 0.08, 0.20) * exitFade;
    setPhase('hero-label', labelOp, 14, 0);

    /* Primary headline — ZOOM IN: starts at scale 1.18, settles to 1.0
       Luxury title card — dominant, fills the screen, zooms deliberately */
    var h1InOp = hasH2
      ? phaseInOut(progress, 0.15, 0.36, 0.44, 0.57)
      : phaseIn(progress, 0.15, 0.36);
    var h1Op = h1InOp * exitFade;
    setPhaseZoomIn('hero-h1', h1Op, 1.18, 1.0);   /* ZOOM IN from large */

    /* Secondary headline — rises up after h1 exits */
    if (hasH2) {
      var h2Op = phaseIn(progress, 0.50, 0.64) * exitFade;
      setPhaseZoomIn('hero-h2', h2Op, 1.08, 1.0);
    }

    /* Tagline */
    var tagStart = hasH2 ? 0.62 : 0.44;
    var tagOp = phaseIn(progress, tagStart, tagStart + 0.15) * exitFade;
    setPhase('hero-tagline', tagOp, 22, 0);

    /* CTA */
    var ctaStart = hasH2 ? 0.74 : 0.60;
    var ctaOp = phaseIn(progress, ctaStart, ctaStart + 0.13) * exitFade;
    setPhase('hero-cta', ctaOp, 18, 0);

    /* Scroll indicator */
    setPhase('hero-scroll-indicator', 1 - phaseIn(progress, 0.06, 0.20), 0, 0);

    /* ── COLOUR OVERLAY: fades in from 78% → fully opaque at 100% ─── */
    /* The video dissolves into the dominant colour extracted from its last frame.
       The section below the hero starts with this same colour — seamless blend. */
    if (colourOverlay) {
      var colourOp = smoothstep(clamp((progress - 0.78) / 0.22, 0, 1));
      colourOverlay.style.opacity = colourOp;
    }
  }

  /* translateY: yOffsetPx when hidden → 0 when visible */
  function setPhase(id, opacity, yOffsetPx) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.opacity = opacity;
    el.style.transform = 'translateY(' + (yOffsetPx * (1 - opacity)) + 'px)';
  }

  /* ZOOM IN: starts large (scaleFrom > 1.0), settles to scaleTo (1.0) as opacity → 1 */
  function setPhaseZoomIn(id, opacity, scaleFrom, scaleTo) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.opacity = opacity;
    /* When opacity=0: scale=scaleFrom (large). When opacity=1: scale=scaleTo (normal). */
    var scale = lerp(scaleFrom, scaleTo, easeOutExpo(opacity));
    el.style.transform = 'scale(' + scale + ')';
  }

  /* ── Scroll handler ──────────────────────────────────────────────── */
  var scrollDriver = document.querySelector('.hero-scroll-driver');

  function onScroll() {
    if (!scrollDriver) return;
    var maxScroll = scrollDriver.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    var progress = clamp(window.scrollY / maxScroll, 0, 1);
    targetFrame  = progress * (frameCount - 1);
    updatePhases(progress);
  }

  /* ── RAF loop ────────────────────────────────────────────────────── */
  var rafRunning = false;
  function animate() {
    currentFrame = lerp(currentFrame, targetFrame, 0.09);
    drawFrame(Math.round(currentFrame));
    if (rafRunning) requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  rafRunning = true;
  resizeCanvas();
  updatePhases(0);
  requestAnimationFrame(animate);

})();
```

---

### 5c — Hero section HTML

The hero goes at the **very top of `<body>`** (after `<nav>`). Every text element is a `.hero-phase` with `opacity:0` as its default — the JS drives them from there. Replace all bracketed placeholders from CLAUDE.md.

```html
<!-- ═══════════════════════════════════════════════════════
     ANIMATED HERO — canvas scroll scrubber
     300vh scroll driver = animation space.
     Sticky inner keeps canvas in viewport the whole time.
     Text phases are driven by scroll progress via JS.
     ═══════════════════════════════════════════════════════ -->
<div class="hero-scroll-driver" style="height:300vh;position:relative;">
  <div style="position:sticky;top:0;height:100vh;overflow:hidden;">

    <!-- Canvas (desktop) -->
    <canvas id="hero-canvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>

    <!-- Static fallback (mobile / reduced-motion) -->
    <div id="hero-static-bg" style="
      display:none;position:absolute;inset:0;
      background-image:url('/assets/images/hero-bg-generated.png');
      background-size:cover;background-position:center;
    "></div>

    <!-- Cinematic gradient — fades top and bottom for depth and legibility -->
    <div style="
      position:absolute;inset:0;pointer-events:none;z-index:1;
      background:linear-gradient(
        to bottom,
        rgba(0,0,0,0.40) 0%,
        rgba(0,0,0,0.05) 35%,
        rgba(0,0,0,0.05) 55%,
        rgba(0,0,0,0.65) 100%
      );
    "></div>

    <!-- COLOUR FADE OVERLAY — dissolves video into flat colour at scroll end.
         JS ramps opacity 0→1 over the last 22% of scroll progress.
         Replace %%DOMINANT_COLOUR%% with value from assets/video/dominant-colour.txt -->
    <div id="hero-colour-fade" style="
      position:absolute;inset:0;z-index:2;pointer-events:none;
      background:%%DOMINANT_COLOUR%%;
      opacity:0;
    "></div>

    <!-- Text stage — all children start hidden; JS reveals them via scroll -->
    <div style="
      position:absolute;inset:0;z-index:3;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;padding:2rem;
    ">

      <!-- Phase 0: Industry label — spaced caps, whisper before the statement -->
      <p id="hero-label" class="hero-phase" style="
        opacity:0;
        font-family:var(--font-body);
        font-size:0.7rem;letter-spacing:0.28em;text-transform:uppercase;
        color:rgba(255,255,255,0.55);margin-bottom:1.5rem;
        will-change:opacity,transform;
      ">
        [INDUSTRY / SHORT DESCRIPTOR]
      </p>

      <!-- Phase 1: Primary headline — LUXURY BOLD. Huge. Zooms in. Owns the screen.
           Font size is intentionally oversized — this is the cinematic title card moment. -->
      <h1 id="hero-h1" class="hero-phase" style="
        opacity:0;
        font-family:var(--font-heading);
        font-size:clamp(3.5rem,9vw,8rem);
        font-weight:900;
        line-height:0.95;
        letter-spacing:-0.03em;
        color:#fff;
        text-shadow:0 4px 48px rgba(0,0,0,0.45);
        max-width:12ch;
        margin:0 auto;
        will-change:opacity,transform;
      ">
        [PRIMARY HEADLINE FROM BRIEF]
      </h1>

      <!-- Phase 2: Secondary headline — only if brief has a second key message.
           DELETE this block entirely if not needed — JS auto-detects its absence. -->
      <h2 id="hero-h2" class="hero-phase" style="
        opacity:0;
        font-family:var(--font-heading);
        font-size:clamp(2rem,4.5vw,4rem);
        font-weight:700;
        line-height:1.05;
        letter-spacing:-0.02em;
        color:rgba(255,255,255,0.90);
        text-shadow:0 2px 24px rgba(0,0,0,0.4);
        max-width:18ch;
        margin:0 auto;
        will-change:opacity,transform;
      ">
        [SECONDARY HEADLINE / KEY DIFFERENTIATOR]
      </h2>

      <!-- Phase 3: Tagline — refined, restrained, appears after the big statement -->
      <p id="hero-tagline" class="hero-phase" style="
        opacity:0;
        font-family:var(--font-body);
        font-size:clamp(0.95rem,1.6vw,1.15rem);
        font-weight:300;
        letter-spacing:0.04em;
        color:rgba(255,255,255,0.75);
        max-width:520px;
        margin:2rem auto 0;
        text-shadow:0 1px 8px rgba(0,0,0,0.25);
        will-change:opacity,transform;
      ">
        [TAGLINE OR VALUE PROPOSITION]
      </p>

      <!-- Phase 4: CTA buttons — the payoff after the story is told -->
      <div id="hero-cta" class="hero-phase" style="
        opacity:0;
        display:flex;gap:1.25rem;flex-wrap:wrap;justify-content:center;
        margin-top:2.5rem;
        will-change:opacity,transform;
      ">
        <a href="[PRIMARY CTA HREF]" class="btn btn-primary btn-lg">
          [PRIMARY CTA TEXT]
        </a>
        <a href="[SECONDARY CTA HREF]" class="btn btn-ghost btn-lg"
           style="color:#fff;border-color:rgba(255,255,255,0.35);letter-spacing:0.06em;">
          [SECONDARY CTA TEXT]
        </a>
      </div>

    </div>

    <!-- Scroll indicator — fades out as user begins scrolling -->
    <div id="hero-scroll-indicator" style="
      position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);
      z-index:4;color:rgba(255,255,255,0.45);font-size:0.65rem;letter-spacing:0.18em;
      text-transform:uppercase;display:flex;flex-direction:column;align-items:center;gap:0.5rem;
    ">
      <span>Scroll</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

  </div>
</div>
<!-- END ANIMATED HERO -->

<!-- ═══════════════════════════════════════════════════════════════════
     BLEND SECTION — immediately follows the hero.
     Background matches dominant-colour so the video dissolve is seamless.
     Transitions to the site's normal background via gradient at the bottom.
     Replace %%DOMINANT_COLOUR%% with value from assets/video/dominant-colour.txt
     ═══════════════════════════════════════════════════════════════════ -->
<div style="
  background: linear-gradient(to bottom, %%DOMINANT_COLOUR%% 0%, var(--color-bg, #fff) 100%);
  padding: 0;
  height: 80px;
  pointer-events: none;
" aria-hidden="true"></div>
```

---

### 5d — Required CSS

Add to `css/tokens.css` (or the `<head>` `<style>` block if tokens.css doesn't exist yet):

```css
/* Animated hero phases — JS drives opacity/transform, CSS provides the transition feel */
.hero-phase {
  transition: none; /* JS controls everything — no CSS transition fighting the scroll */
  will-change: opacity, transform;
}

/* Scroll indicator pulse animation */
@keyframes hero-indicator-pulse {
  0%, 100% { opacity: 0.55; transform: translateX(-50%) translateY(0); }
  50%       { opacity: 0.35; transform: translateX(-50%) translateY(5px); }
}
#hero-scroll-indicator {
  animation: hero-indicator-pulse 2.2s ease-in-out infinite;
}

/* Mobile: show all text immediately, no canvas */
@media (max-width: 767px) {
  .hero-phase { opacity: 1 !important; transform: none !important; }
  #hero-scroll-indicator { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-phase { opacity: 1 !important; transform: none !important; }
}
```

---

### 5e — Script placement

Place the canvas `<script>` block **just before `</body>`**, after all other scripts. Replace `%%FRAME_COUNT%%` with the exact integer from `assets/frames/frame-count.txt`.

Print: `✓ Step 5: Animated hero section built — [N] text phases choreographed`

---

## STEP 6 — Page animation system + full site build

**Goal:** Every section, heading, card, stat, and image on every page animates in as it enters the viewport. The whole site must feel like a living, breathing story — not a static page with a video stuck at the top. The animation language must match the mood and energy of the video generated in Step 3.

---

### 6a — Design personality: bold, luxury, cinematic

This is not a generic website. It must feel expensive, intentional, and alive. Apply these rules before writing any HTML:

**Typography rules (non-negotiable):**
- Section headings: `font-size: clamp(2.5rem, 5vw, 4.5rem)` minimum. Never small.
- Letter-spacing on headings: `-0.02em` to `-0.04em` (tight — luxury compresses, not expands)
- Letter-spacing on labels/eyebrows: `0.18em` to `0.28em` (spaced caps whisper before the headline shouts)
- Heading font-weight: `700` minimum, `800–900` for hero and section statements
- Body/tagline font-weight: `300` or `400` — light weight creates contrast against heavy headings
- Line-height on headings: `0.95`–`1.1` (tight — luxury headlines compress vertically)
- Max paragraph width: `560px` — never let body text stretch full-width

**Colour and space rules:**
- Generous section padding: `padding: 8rem 0` minimum — luxury breathes
- The section immediately below the hero MUST use `%%DOMINANT_COLOUR%%` as its background (from `assets/video/dominant-colour.txt`) — this is the seamless blend point
- Subsequent sections can transition back to the brand's normal background
- High contrast: near-black on white OR white on dark — no mid-grey muddiness
- Accent colour used sparingly — one pop per section maximum

**Animation personality:**

| Video/Brand mood | Duration | Easing | Stagger | Distance |
|------------------|----------|--------|---------|----------|
| Bold / cinematic | 0.7s | `cubic-bezier(0.16, 1, 0.3, 1)` | 90ms | 40px |
| Elegant / luxury | 1.0s | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 140ms | 28px |
| Warm / friendly  | 0.65s | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 100ms | 32px |
| Professional     | 0.6s | `cubic-bezier(0.4, 0, 0.6, 1)` | 80ms | 36px |

Record in `css/tokens.css`:

```css
:root {
  --anim-duration:   0.85s;
  --anim-easing:     cubic-bezier(0.16, 1, 0.3, 1);
  --anim-stagger:    110ms;
  --anim-distance:   38px;
  --anim-scale-from: 0.93;
  /* Set %%DOMINANT_COLOUR%% from assets/video/dominant-colour.txt */
  --hero-blend-colour: %%DOMINANT_COLOUR%%;
}
```

---

### 6b — Animation CSS (add to `css/tokens.css`)

These classes are the **only** animation system needed. Apply them as data attributes and classes in HTML — never write one-off keyframes per section.

```css
/* ════════════════════════════════════════════════════════════════════
   ANIMATION SYSTEM — driven by data attributes + JS IntersectionObserver
   data-anim / data-stagger      → animate IN only (fire once)
   data-anim-out / data-stagger-out → animate IN and OUT (stays observed)
   ════════════════════════════════════════════════════════════════════ */

/* ── Hidden base state ──────────────────────────────────────────────── */
[data-anim], [data-anim-out] {
  opacity: 0;
  will-change: opacity, transform;
}

/* ── Visible state (JS adds .is-visible) ───────────────────────────── */
[data-anim].is-visible,
[data-anim-out].is-visible {
  opacity: 1;
  transform: none !important;
  transition:
    opacity var(--anim-duration, 0.85s) var(--anim-easing, cubic-bezier(0.16,1,0.3,1)),
    transform var(--anim-duration, 0.85s) var(--anim-easing, cubic-bezier(0.16,1,0.3,1));
}

/* ── Entry transforms by direction ─────────────────────────────────── */
[data-anim="fade-up"],    [data-anim-out="fade-up"]    { transform: translateY(var(--anim-distance, 38px)); }
[data-anim="fade-down"],  [data-anim-out="fade-down"]  { transform: translateY(calc(-1 * var(--anim-distance, 38px))); }
[data-anim="fade-left"],  [data-anim-out="fade-left"]  { transform: translateX(calc(-1 * var(--anim-distance, 38px))); }
[data-anim="fade-right"], [data-anim-out="fade-right"] { transform: translateX(var(--anim-distance, 38px)); }
[data-anim="scale-in"],   [data-anim-out="scale-in"]   { transform: scale(var(--anim-scale-from, 0.93)); }
[data-anim="fade"],       [data-anim-out="fade"]        { transform: none; }

/* ── Stagger children (IN only) ─────────────────────────────────────── */
[data-stagger] > * {
  opacity: 0;
  transform: translateY(var(--anim-distance, 38px));
  will-change: opacity, transform;
  transition:
    opacity var(--anim-duration, 0.85s) var(--anim-easing, cubic-bezier(0.16,1,0.3,1)),
    transform var(--anim-duration, 0.85s) var(--anim-easing, cubic-bezier(0.16,1,0.3,1));
  transition-delay: var(--delay, 0ms);
}
[data-stagger].is-visible > * { opacity: 1; transform: none; }

/* ── Stagger children (IN + OUT) ───────────────────────────────────── */
[data-stagger-out] > * {
  opacity: 0;
  transform: translateY(var(--anim-distance, 38px));
  will-change: opacity, transform;
  transition:
    opacity var(--anim-duration, 0.85s) var(--anim-easing, cubic-bezier(0.16,1,0.3,1)),
    transform var(--anim-duration, 0.85s) var(--anim-easing, cubic-bezier(0.16,1,0.3,1));
  transition-delay: var(--delay, 0ms);
}
[data-stagger-out].is-visible > * { opacity: 1; transform: none; }

/* ── Accessibility ──────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  [data-anim], [data-anim-out], [data-stagger] > *, [data-stagger-out] > * {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

### 6c — Animation JavaScript (one script, all pages)

Create `js/animations.js`. Link on **every page** with `<script src="/js/animations.js" defer></script>`.

```javascript
(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════
     SCROLL ANIMATION ENGINE
     Supports:
       [data-anim]      — single element, animates IN on enter
       [data-anim-out]  — single element, animates IN on enter AND OUT on exit
       [data-stagger]   — children stagger IN on parent enter
       [data-stagger-out] — children stagger IN AND OUT
       [data-count]     — number counts up when element enters viewport
     ════════════════════════════════════════════════════════════════ */

  var root = document.documentElement;
  var STAGGER_MS = parseInt(getComputedStyle(root).getPropertyValue('--anim-stagger') || '110');

  /* ── Stagger delay assignment ──────────────────────────────────── */
  function assignStaggerDelays(el) {
    Array.prototype.forEach.call(el.children, function (child, i) {
      child.style.setProperty('--delay', (i * STAGGER_MS) + 'ms');
    });
  }

  /* ── Observer: animate IN only (fire once, unobserve) ───────────
     Use [data-anim] for most elements — section headings, images, CTAs.
     Fire-once keeps things clean for content users scroll past once.    */
  var inObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.hasAttribute('data-stagger')) assignStaggerDelays(el);
      el.classList.add('is-visible');
      inObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -52px 0px' });

  /* ── Observer: animate IN + OUT (keeps observing) ───────────────
     Use [data-anim-out] or [data-stagger-out] for cards, grids, and
     sections that should EXIT as the user scrolls past them.
     This makes the whole page feel alive — nothing is static.         */
  var inOutObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      if (entry.isIntersecting) {
        if (el.hasAttribute('data-stagger-out')) assignStaggerDelays(el);
        el.classList.add('is-visible');
      } else {
        /* EXIT: remove class so element resets to hidden state.
           CSS transition plays in reverse on the way out.             */
        el.classList.remove('is-visible');
        /* Reset stagger delays so next entry looks fresh */
        if (el.hasAttribute('data-stagger-out')) {
          Array.prototype.forEach.call(el.children, function (child) {
            child.style.setProperty('--delay', '0ms');
          });
        }
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  /* ── Wire up all elements ──────────────────────────────────────── */
  document.querySelectorAll('[data-anim], [data-stagger]').forEach(function (el) {
    inObserver.observe(el);
  });
  document.querySelectorAll('[data-anim-out], [data-stagger-out]').forEach(function (el) {
    inOutObserver.observe(el);
  });

  /* ── Nav: frosted-glass on scroll ─────────────────────────────── */
  var nav = document.querySelector('nav, .nav, header');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Animated number counters ──────────────────────────────────── */
  /* Usage: <span data-count="500" data-count-suffix="+">0</span>
     The number counts up with an ease-out curve when it enters view.  */
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el     = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-count-suffix') || '';
      var prefix = el.getAttribute('data-count-prefix') || '';
      var dur    = 2000;
      var t0     = performance.now();
      (function tick(now) {
        var p     = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

})();
```

---

### 6d — Animation map: which element gets which attribute

Apply these rules **without exception** on every section of every page. Every element must animate. Nothing is static.

**Animate-IN only** (`data-anim`, `data-stagger`) — fires once as element enters. Use for headings, labels, images, CTAs, and any element the user likely scrolls past only once.

**Animate-IN and OUT** (`data-anim-out`, `data-stagger-out`) — fires on enter AND resets on exit. Use for card grids, feature blocks, and testimonials that should feel alive as the user scrolls through them.

| Element type | Attribute | Notes |
|---|---|---|
| Section label / eyebrow | `data-anim="fade-up"` | Whispers first — sets up the heading |
| Section `<h2>` heading | `data-anim="fade-up"` + `style="transition-delay:80ms"` | Rises just after label |
| Section intro `<p>` | `data-anim="fade-up"` + `style="transition-delay:160ms"` | Third in sequence |
| **Card grid / feature grid** | `data-stagger-out` on wrapper | **Animates IN and OUT** — cards breathe with scroll |
| Individual card (in stagger) | no attribute — parent drives it | |
| Full-width image or banner | `data-anim="scale-in"` | Grows from 0.93→1.0, cinematic |
| Split section — image | `data-anim-out="fade-left"` or `"fade-right"` | Slides IN and OUT from its edge |
| Split section — text block | `data-anim="fade-up"` | Standard enter-only |
| **Testimonial grid** | `data-stagger-out` on wrapper | Animates IN and OUT |
| Testimonial single quote | `data-anim-out="fade-up"` | Enters and exits |
| Stat block wrapper | `data-anim="scale-in"` | |
| Stat `<span>` number | `data-count="[n]"` `data-count-suffix="+"` | Counts up on enter |
| CTA band heading | `data-anim="fade-up"` | |
| CTA buttons wrapper | `data-stagger` | Staggers buttons left-to-right, fires once |
| Logo / trust bar | `data-stagger` on wrapper | Fire-once is fine for logos |
| Process / timeline steps | `data-stagger-out` on wrapper | Steps animate through as user passes |
| Footer columns | `data-stagger` on inner wrapper | Subtle, fire-once |

**First section below hero — colour blend section:**
This section MUST have `background: var(--hero-blend-colour)` and transition to the normal background at its base. It is the landing zone after the video dissolve — make it feel intentional, not accidental.

```html
<!-- First section after hero — BLEND ZONE -->
<section style="background: var(--hero-blend-colour); padding: 8rem 0 6rem; position: relative;">
  <!-- Gradient to normal bg at bottom -->
  <div style="
    position:absolute;bottom:0;left:0;right:0;height:120px;pointer-events:none;
    background: linear-gradient(to bottom, transparent, var(--color-bg, #fff));
  " aria-hidden="true"></div>
  <!-- Section content with white/light text to suit the dark blend colour -->
  <div class="container">
    <p data-anim="fade-up" style="color:rgba(255,255,255,0.55);letter-spacing:0.2em;text-transform:uppercase;font-size:0.7rem;">[LABEL]</p>
    <h2 data-anim="fade-up" style="color:#fff;font-size:clamp(2.5rem,5vw,4.5rem);font-weight:800;letter-spacing:-0.03em;transition-delay:80ms;">[HEADING]</h2>
    <div data-stagger-out style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin-top:3rem;">
      <!-- cards here -->
    </div>
  </div>
</section>
```

**CRITICAL RULES:**
1. **Never** leave a section, card grid, or heading without an animation attribute
2. **Stagger/stagger-out wrappers only** — individual cards inside get no attribute, the parent drives them
3. **Label → heading → body** always in that stagger sequence with increasing `transition-delay`
4. **Card grids and testimonials always use `data-stagger-out`** — they should feel alive as user scrolls past
5. **Images always use `scale-in`** — scaling feels more cinematic than sliding
6. **CTAs are always last** in their section — the payoff after the story builds

---

### 6e — Nav scroll behaviour CSS (add to `css/tokens.css`)

```css
nav, .nav, header {
  transition: background 0.35s ease, box-shadow 0.35s ease;
}
.nav-scrolled {
  background: rgba(var(--color-bg-rgb, 255,255,255), 0.92) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 24px rgba(0,0,0,0.08);
}
```

---

### 6f — Build index.html (home page)

The animated hero from Step 5 is the **first element inside `<body>`** (after `<nav>`).

Below the hero, build all sections from the project brief. Apply the animation map from 6d to **every element**. Sections to include (adapt to brief):

- Trust bar / logo bar — `data-stagger` on logo wrapper
- Services / features grid — `data-stagger` on card grid
- Why choose us (split layout) — `data-anim="fade-left"` image, `data-anim="fade-up"` text
- Stats / numbers — staggered stat cards with `data-count` counters
- Testimonials — `data-stagger` on testimonial grid
- CTA band — `data-anim="fade-up"` heading, staggered buttons
- Footer — subtle `data-stagger` on footer columns

Add `<script src="/js/animations.js" defer></script>` and the canvas script before `</body>`.

---

### 6g — Build all other pages

Every page (about, services, contact, etc.) uses:
1. A **static hero** with the generated background image
2. The **same animation system** — `js/animations.js` is linked, all sections use `data-anim` and `data-stagger`
3. The nav scroll behaviour

Static hero for non-home pages:

```html
<section style="
  background-image: url('/assets/images/hero-bg-generated.png');
  background-size:cover;background-position:center;position:relative;min-height:60vh;
  display:flex;align-items:center;justify-content:center;text-align:center;
">
  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.48);"></div>
  <div class="container" style="position:relative;z-index:1;color:#fff;padding:6rem 1.5rem;">
    <p class="label" data-anim="fade-up" style="color:rgba(255,255,255,0.7);">[PAGE LABEL]</p>
    <h1 class="section-title" data-anim="fade-up" style="color:#fff;margin-top:0.5rem;">[PAGE HEADING]</h1>
    <p data-anim="fade-up" style="color:rgba(255,255,255,0.82);max-width:520px;margin:1rem auto 0;">[PAGE SUBHEADING]</p>
  </div>
</section>
```

Note: even the static hero headings get `data-anim` — they'll snap in on page load since they're immediately visible.

Print: `✓ Step 6: Full site built — animation system applied to every section`

---

## STEP 7 — Verify and polish

Run through this checklist in full. Fix every failure before declaring the build complete.

**Pipeline assets:**
- [ ] `assets/images/hero-bg-generated.png` exists and is a valid image
- [ ] `assets/video/hero-bg.mp4` exists and is > 10KB
- [ ] `assets/frames/` contains `frame_0001.jpg` through `frame_XXXX.jpg`
- [ ] `assets/frames/frame-count.txt` has a number > 0

**Hero canvas:**
- [ ] `index.html` — canvas scroll scrubber plays frames on scroll
- [ ] `index.html` — hero text phases reveal in sequence as user scrolls through the 300vh driver
- [ ] Hero text is legible against the video background at all scroll positions
- [ ] Mobile fallback (`#hero-static-bg`) shows `hero-bg-generated.png` correctly

**Page animations:**
- [ ] `js/animations.js` is linked on **every** page with `defer`
- [ ] Every section on every page has at least one `data-anim` or `data-stagger` attribute — grep to confirm: `grep -r "data-anim\|data-stagger" *.html` — result must not be empty
- [ ] No section, card grid, or heading block is missing an animation attribute
- [ ] Stagger wrappers (`data-stagger`) contain multiple children — not just one
- [ ] Stat numbers that should count up have `data-count` attributes on their `<span>`
- [ ] Nav gains `.nav-scrolled` class on scroll (check CSS is applied)
- [ ] `@media (prefers-reduced-motion)` rule is in `css/tokens.css` — animations collapse gracefully

**All pages:**
- [ ] All pages listed in CLAUDE.md are built as `.html` files
- [ ] Nav and footer are consistent across all pages
- [ ] Static hero on non-home pages also has `data-anim` on its heading elements
- [ ] All framework CSS files, `css/tokens.css`, and `js/animations.js` linked on every page
- [ ] `<script src="/framework/js/runtime.js" defer></script>` on every page

**Self-review:**
Open `index.html` mentally and scroll through it section by section. Ask: *does every element earn its place by animating in with intention?* If anything feels static or arbitrary, fix it.

Print: `✓ Build complete — animated website ready`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Replicate returns `status: failed` | Check `~/.goober/goober-secrets.sh` has `REPLICATE_API_TOKEN` set. Verify account credits. |
| kie.ai returns 401 | Check `~/.goober/goober-secrets.sh` has `KIE_API_KEY` set. Re-save the key in Goober → Integrations. |
| kie.ai returns 404 on generate endpoint | Verify the endpoint URL with your kie.ai API dashboard — the path may differ slightly. |
| Text phases don't animate on scroll | Check `FRAME_COUNT` is > 0 and hero IDs in HTML match the IDs in JS `updatePhases()`. |
| Headline 2 showing when not needed | Delete the `<h2 id="hero-h2">` block from the HTML — the JS auto-detects its absence. |
| kie.ai returns 402 | Insufficient credits — top up your kie.ai account. |
| ffmpeg not found | Install with `brew install ffmpeg` (macOS). |
| ffprobe not found | Included with ffmpeg — install the same package. |
| Frame count is 0 | ffmpeg failed silently — re-run `ffmpeg -i assets/video/hero-bg.mp4 ...` manually and check the output. |
| Canvas shows black | Frames haven't finished loading. Add a 500ms delay or check that frame paths match exactly (zero-padded 4 digits). |
| Text unreadable over canvas | Increase the dark overlay opacity: change `rgba(0,0,0,0.45)` to `rgba(0,0,0,0.6)`. |
