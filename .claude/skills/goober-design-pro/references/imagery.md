# Imagery, one world per site, generated and verified

Read this at Phase 2 (assets), after the design context file exists, the
prompt prefix, treatment recipe, and mask shapes below all come FROM that file
(Axis 7 + Axis 4), and before generating or placing ANY image in a scoped fix.
Output: 3 to 6 verified on-palette images in `assets/images/`, or an honest
placeholder plan, never an empty rectangle, never a guessed URL.

---

## 1. Image strategy: decisive, sourced, one world

**On an image-led build, zero images is a bug, not restraint.** A hero the DNA
says is photographic cannot ship as a flat colour field because generation felt
optional. Equally: one decisive image beats five mediocre ones, imagery is the
main course in the hero, seasoning at the section level.

**Sourcing priority, always in this order:**

1. **Client-supplied real photos.** ALWAYS first, real work, real team, real
   premises beat every generated frame for trust. Assess each: *keep* (sharp,
   on-mood) · *treat* (usable but off-grade, §5 pulls it into the world) ·
   *replace* (blurry, cluttered, wrong era), never discard a real photo a
   treatment can save.
2. **Generated imagery**: this file's pipeline (§2 to §4).
3. **CSS/SVG art direction**: when the DNA is typographic/abstract, or
   generation is unavailable: layered fields per `art-direction.md`.

Never generic stock-smile imagery (handshakes, headset women, laptop-pointing
teams). Never hotlinked URLs you haven't verified exist, see §6.

**The shot list, per page:**

| Slot | Count | Notes |
|---|---|---|
| Home hero | 1 (possibly 2: separate mobile crop) | The most important image on the site, composed WITH the headline (§2) |
| Section support | 1 to 2 | About/process/proof sections; detail crops count |
| Texture/atmosphere | as needed | Usually CSS fields (`art-direction.md`), occasionally one generated texture |
| Interior pages | 0 to 1 new each | Reuse the hero-world: compressed crops of existing images, or ONE new image per page |

**One world.** Every image, client, generated, or treated, must read as shot
on the same day, by the same photographer, under the same light, graded by the
same colourist. That is what the shared prompt prefix (§2) and single treatment
recipe (§5) enforce. An off-world image is a context-betrayal even when beautiful.

---

## 2. The art-direction prompt prefix

Axis 7 of the DNA produces a PREFIX, written ONCE into the design context
file and reused VERBATIM for every image on the site. The prefix carries the
world; the per-image suffix carries the shot. Formula:

```
<medium + lens/feel>, <subject world, the business's actual physical world,
location-aware>, <light>, <colour grade tied to palette, name the 2–3
dominant hues>, <mood>, no text, no words, no watermarks, no logos, no borders
```

The `no text…no borders` tail lives in the prefix so it is never forgotten.
Name real palette hues, "warm tones" drifts; "eucalyptus green, warm sand, deep sky blue" holds.

**Per-image suffixes** add three things and nothing else:
- **Subject specifics**: the actual shot (who/what, doing what).
- **Composition instruction**: WHERE the calm zone sits, matching the hero
  pattern chosen in `layout-flow.md`: "open sky across the upper-left
  two-thirds for the headline", "subject on the right third". Heroes are
  composed around the headline, generate the negative space on purpose.
- **Aspect intent**: in the suffix AND passed as `aspect_ratio` (§3): 16:9 / 3:2 heroes, 2:3 portrait, 1:1 detail.

**People rules.** Real-feeling people mid-work, absorbed in the task, never
posed-at-camera grins (the #1 stock tell). Hands/tools/detail crops often beat
faces: more honest, no uncanny-face risk. When faces appear: cultural and
demographic fit for the locale, age-plausible for the trade, dressed for the actual work.

### Worked examples: prefix + hero suffix + support suffix

**Gold Coast landscaper (Modern Country × Coastal):**
```
PREFIX: on-location documentary photography, 35mm, natural depth of field, the working
world of a Gold Coast landscaping crew, native coastal gardens, spotted-gum decks,
hinterland-backed backyards under a subtropical Queensland sky, late-afternoon sun with
long soft shadows, colour grade warm and sun-washed, eucalyptus green, warm sand, deep
sky blue, mood honest, capable, outdoors, no text, no words, no watermarks, no logos, no borders
HERO: wide establishing shot of a finished backyard, curved stone path through lomandra
and native grasses to a new timber deck, pool edge catching light, shot low from garden
level; open sky and soft foliage across the upper-left two-thirds as calm negative space
for the headline; deck and planting detail held in the lower-right third, 16:9
SUPPORT: tight crop of a landscaper's gloved hands bedding a stone paver, knee on soil,
trowel mid-use, garden blur behind, shallow focus, subject centred, 3:2
```

**Luxury home builder (Luxury Noir):**
```
PREFIX: architectural photography, medium-format feel, tripod-still dusk exposure, the
world of a high-end custom home builder, sculptural contemporary residences in stone,
glass and dark timber, blue-hour dusk with warm interior glow spilling onto terraces,
colour grade cinematic and deep, charcoal ink, champagne glow, bone stone, mood
exclusive, quiet, unhurried, no text, no words, no watermarks, no logos, no borders
HERO: frontal dusk elevation of a completed residence, still pool reflecting the lit
interior, deep dusk sky filling the upper half as dark calm space for an ivory headline,
the house held low in frame, 16:9
SUPPORT: macro detail of a brushed-brass door pull on dark-stained oak, raking warm
light, extreme shallow focus, subject on the right third, 2:3
```

**Physio clinic (Soft Clinical):**
```
PREFIX: natural-light lifestyle photography, 50mm, gentle focus falloff, the world of a
modern physiotherapy clinic, light-filled treatment rooms, pale timber, linen curtains,
real patients mid-treatment, bright overcast daylight through big windows, colour grade
airy and warm-neutral, warm white, soft sage, muted teal, mood calm, unhurried, safe,
no text, no words, no watermarks, no logos, no borders
HERO: physiotherapist guiding a patient through a shoulder mobility exercise, both
absorbed in the movement, seen three-quarter from behind so nobody faces camera;
soft-lit plain wall across the left half as calm space for the headline; subjects on
the right third, 3:2
SUPPORT: close crop of a practitioner's hands applying steady pressure to a patient's
shoulder, blurred sunlit room behind, shallow focus, 3:2
```

**Electrician (Industrial Utility):**
```
PREFIX: documentary trade photography, 28mm, crisp and true to life, the working world
of a licensed electrical contractor, switchboards, conduit runs, site interiors and a
fitted-out work van, hard directional work-light with deep shadow, colour grade steely
and controlled, charcoal, gunmetal grey, a single hi-vis yellow note, mood tough,
exact, no-nonsense, no text, no words, no watermarks, no logos, no borders
HERO: electrician seen from behind terminating a neatly-dressed switchboard, insulated
tools in hand, tool bag soft in the foreground; dark uncluttered wall filling the left
two-thirds as calm space for a bold condensed headline; subject on the right third, 16:9
SUPPORT: overhead flat-lay of coiled cable, insulated pliers and a voltage tester on a
steel work bench, hard side light, arranged square, 1:1
```

---

## 3. The generation pipeline

This is the app's contract, not a script the agent runs. Three cases, always
in this order.

**(a) The normal case.** Images are planned in the Planning studio's Imagery
step and generated there, through the app's own Replicate connection.
`site/images.json` is the registry: one entry per slot (id, page, section,
role, files per breakpoint, width, height, alt text, source, prompt,
treatment, cost, status). The builder never calls a generation API itself and
never invents a file path: it places only what the registry lists, in
`<picture>` markup with `width`, `height`, `alt`, `fetchpriority="high"` on
the hero and `loading="lazy"` on everything below the fold. Read the registry
before placing any image.

**(b) The registry does not have this slot yet.** Do not generate it here.
Append a slot to `site/images.json`: `id`, `page_slug`, `section_id`, `role`,
`status: "pending"`, and the 8-line brief as `prompt` (destination, role,
dimensions, crop, overlay, responsive, budget, model, with the style card
prepended verbatim). Leave a CSS field placeholder in the markup carrying
`data-image-slot="<id>"` so the spot stays visible and findable, never an
empty rectangle and never a guessed URL. Tell the user a slot was queued.
The studio generates it on the next visit. That is the whole contract; there
is no bash shortcut around it.

**(c) The Higgsfield connector is connected** (its MCP tools are present in
the session: `models_explore`, `generate_image`, `generate_video`,
`media_import_url`, `media_upload`). The agent may generate directly for
public-facing slots, still against this file's style card, budgets and
verification gate, and generating sequentially: one image, verify it, then
the next, at most 3 per request.

Model ids, verified today:

| Model id | Notes |
|---|---|
| `gpt_image_2` | resolution 1k, 2k or 4k; quality low, medium or high; ratios 1:1, 4:3, 3:4, 16:9, 21:9, 9:16, 3:2, 2:3; reference images use role `image` |
| `nano_banana_pro` | resolution 2k by default; ratios include 4:5; references use role `image_references`; best for people, product edits and multi-reference composites |
| `kling_omni_image` | photoreal variants |
| `flux_2_pro_outpaint` | extends a crop by pixels per side |

References are uploaded first with `media_upload` or `media_import_url` and
passed as media ids, never as URLs. Preflight every generation with
`get_cost true` and state the credits to the user before running. Never set
`use_unlim` yourself. Once a result passes the verification gate (§4),
download it, encode to WebP within the role's budget (§6), and register the
file in `site/images.json` exactly as the studio would, same fields, same shape.

**Model routing and prices.** This is what the studio's own routing runs on
Replicate; know it so a cost conversation with the client is accurate, even
though the agent itself only calls it directly under case (c) above.

| Model | Variant | USD per image |
|---|---|---|
| `openai/gpt-image-2` | low | 0.012 |
| `openai/gpt-image-2` | medium | 0.047 |
| `openai/gpt-image-2` | high | 0.128 |
| `google/nano-banana-2` | 1K | 0.067 |
| `google/nano-banana-2` | 2K | 0.101 |
| `google/nano-banana-2-lite` | draft | 0.034 |
| `google/nano-banana-pro` | 2K | 0.15 |
| `google/nano-banana-pro` | 4K | 0.30 |

`gpt-image-2` always takes an explicit quality, never `"auto"`.
`nano-banana-2-lite` is for drafts and mood boards only, never a shipped
public-facing image. `nano-banana-pro` is for people, product edits and
multi-reference composites, always with `allow_fallback_model` set to false.
Aspect ratios are always set explicitly, never left to a default:
`gpt-image-2` on Replicate takes 1:1, 3:2 or 2:3 only, so a slot needing
something wider generates at 3:2 and gets cropped to fit; the nano-banana
family takes the full set, 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9.

---

## 4. The verification gate

MANDATORY after every generation, before the next one: open the file with the
Read tool (vision) and check ALL of:

| Check | Pass condition |
|---|---|
| Subject | Matches the suffix intent THIS business's world, not adjacent-generic |
| Text/marks | ZERO letters, words, watermarks, signage gibberish, phantom logos anywhere |
| Palette | Sits inside the DNA's named hues, if it drifts, NAME the drift ("reads teal; grade calls sage") |
| Composition | The calm zone is where the suffix put it; the headline won't fight detail |
| Artifacts | Hands, tool geometry, reflections, faces, type-like textures all sane |

On failure, pick ONE, in order:
1. **Regenerate with a corrected suffix** naming the failure explicitly ("plain
   wall, no signage"), max 2 retries per slot, then move down.
2. **Accept + treat**: when palette drift is the only failure, a colour-wash
   or duotone (§5) pulls it into the world; note the plan.
3. **Fall back** down the §3 chain.

**An image you haven't looked at is not shipped.** No exceptions, not for
"it's just a support image", not for retries of a previously-good prompt.

---

## 5. Treatments: forcing cohesion

Generated frames, client photos, and phone shots never grade identically. The
treatment layer makes mixed sources read as one world. **Pick ONE recipe, name
it in the design context file, apply it to EVERY image.** Vanilla CSS; markup
pattern: `<figure class="img-wash mask-arch"><img … loading="lazy"></figure>`.

**Brand colour-wash**: the workhorse:
```css
.img-wash { position: relative; overflow: hidden; }
.img-wash > img { display: block; width: 100%; height: 100%; object-fit: cover; }
.img-wash::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: var(--color-primary);
  mix-blend-mode: multiply;   /* or soft-light for a gentler cast */
  opacity: 0.28; }            /* commit ONE value in the 0.15–0.45 band, site-wide */
```

**Duotone**: exact 2-layer recipe (highlights take the light hue, shadows the dark):
```css
.img-duotone { position: relative; background: var(--duo-light); }
.img-duotone > img { display: block; width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(1) contrast(1.1);
  mix-blend-mode: multiply; }           /* highlights → --duo-light */
.img-duotone::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: var(--duo-dark);
  mix-blend-mode: lighten; }            /* shadows → --duo-dark */
```

**Directional scrim**: for text-over-image zones, aimed at the calm zone. Each
class also gets `content:""; position:absolute; inset:0; pointer-events:none;`:
```css
:root { --scrim: color-mix(in srgb, var(--color-ink) 85%, transparent); }
.scrim-left::after   { background: linear-gradient(90deg,  var(--scrim) 0%, transparent 62%); }  /* text left half   */
.scrim-bottom::after { background: linear-gradient(180deg, transparent 40%, var(--scrim) 100%); } /* text lower third */
.scrim-tl::after     { background: linear-gradient(135deg, var(--scrim) 0%, transparent 55%); }  /* text upper-left  */
```
After applying: verify 4.5:1 where the text ACTUALLY sits, check the lightest
pixel behind the smallest text; failing → deepen the scrim's first stop, not the image.

**Grain unify**: the same feTurbulence block as `art-direction.md`
§Backgrounds. ONE baseFrequency, ONE opacity, everywhere, shared grain is the
cheapest way to make mixed sources feel same-world:
```css
.grain::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  opacity: 0.06; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
```

**Masks per shape language** (must match Axis 4, never mix mask families):
```css
.mask-arch   { border-radius: 999px 999px var(--radius, 8px) var(--radius, 8px); overflow: hidden; }
.mask-blob   { border-radius: 58% 42% 55% 45% / 52% 48% 56% 44%; overflow: hidden; }
.mask-xl     { border-radius: 24px; overflow: hidden; }
.mask-angled { clip-path: polygon(0 0, 100% 4%, 100% 100%, 0 96%); }
```

**Frame / offset-border**: Editorial and Heritage directions only:
```css
.img-frame { padding: 10px; background: var(--color-paper);
  border: 1px solid color-mix(in srgb, var(--color-ink) 25%, transparent); }
.img-offset { position: relative; }
.img-offset::before { content: ""; position: absolute; inset: 0; z-index: -1;
  translate: 14px 14px; border: 1px solid var(--color-accent); }
```

---

## 6. Specs, performance, fallbacks

**Files.** Everything in `assets/images/`, purposeful kebab names describing the
shot: `hero-workshop.webp`, not `img1.webp`. Formats: webp for photos, SVG for
icons/patterns; png only when alpha demands it.

**Budgets**: hero ≤ 280KB · support ≤ 180KB · thumbs/details ≤ 80KB. Check
with `ls -la assets/images/`; over budget → recompress:
```bash
npm i --no-save sharp   # the scaffold has zero npm deps, install ephemerally first
node -e "require('sharp')('assets/images/hero-backyard.webp').resize({width:2000,withoutEnlargement:true}).webp({quality:82}).toFile('assets/images/_o.webp').then(()=>require('fs').renameSync('assets/images/_o.webp','assets/images/hero-backyard.webp'))"
```
(No-dep alternative Goober Builder's app-side optimiser converts imports to
webp at quality 86 on demand and rewrites refs, so an oversize file can be
left to it, but the budget check is still yours.)

**Markup**: every image, no exceptions:
```html
<img src="/assets/images/hero-backyard.webp"
     alt="Curved stone path through native grasses to a new spotted-gum deck in Currumbin"
     width="2000" height="1125" fetchpriority="high" decoding="async">
```
- Root-absolute `src` always (`/assets/images/…`), relative paths 404 on
  nested routes like `/about/`.
- Explicit `width`/`height` always (no CLS). Hero: `fetchpriority="high"`, no
  `loading` attr. Everything else: `loading="lazy" decoding="async"`.
- `object-fit: cover` + art-directed `object-position` (protect the calm zone).
- Alt text is voice: the actual scene, business-relevant, no "image of".

**Mobile crops**: per the hero's calm-zone plan (`layout-flow.md`). Re-aim
the crop per breakpoint, or ship a true second crop when the wide hero dies at 390:
```css
.hero-media img { object-position: 68% 45%; }
@media (max-width: 640px) { .hero-media img { object-position: 84% 45%; } }
```
```html
<picture>
  <source media="(max-width: 640px)" srcset="/assets/images/hero-backyard-m.webp">
  <img src="/assets/images/hero-backyard.webp" alt="…" width="2000" height="1125" fetchpriority="high" decoding="async">
</picture>
```

**No key / generation unavailable.** The build still ships designed:
1. Give the section an art-directed CSS field (layered gradient/texture per
   `art-direction.md`), the page must not look broken or bare.
2. Drop a styled placeholder carrying the EXACT prompt, generatable later:
   ```html
   <div class="img-placeholder" role="img" aria-label="Placeholder: finished backyard hero"
        data-prompt="PREFIX, wide establishing shot of a finished backyard …, 16:9">
     <span>hero-backyard.webp, supply or generate</span>
   </div>
   ```
   ```css
   .img-placeholder { display: grid; place-items: center; min-height: min(60vh, 480px);
     color: var(--color-muted); font-size: 0.85rem; letter-spacing: 0.08em;
     background: radial-gradient(120% 90% at 20% 10%, color-mix(in srgb,
       var(--color-primary) 16%, var(--color-surface)), transparent 60%), var(--color-surface); }
   ```
3. Tell the user exactly which images to supply: filename + subject + aspect.
4. NEVER hotlink stock and never guess a URL, a 404'd hero is worse than no
   image, and an unverified URL in markup is a lie.
