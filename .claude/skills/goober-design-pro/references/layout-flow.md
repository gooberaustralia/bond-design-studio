# Layout & Flow, heroes, section order, and the seams between them

Read this at Phase 3 (BUILD), after the design context file exists. Build the
hero first, **the hero IS the design**, then the section flow, then the seams.

The old method ("pick a page archetype, restyle it, vary the styling, not the
bones") is the disease this file replaces: fixed bones produce the same site
every time, whatever the paint. Here composition is **derived**: the DNA's
layout attitude (Axis 8) picks the hero pattern, the belief ladder (§2) picks
the section order, and every seam is a named decision (§3). The recipes below
are starting skeletons to tune, never templates to fill.

Where CSS lives (Goober Builder): shared recipes → `assets/css/components.css`;
one-off page compositions → `assets/css/pages/<slug>.css`. Token names below
(`--color-ink/-paper/-primary`, `--page-max`, `--container-pad`,
`--section-pad`, `--radius`) come from `tokens.css`, swap to match the
project. Sections are `<section data-block="...">`. Vanilla CSS, plain
selectors, no inline `style=""`, ever. Mobile collapses for every recipe: §4.6.

---

## 1. The hero IS the design

The first screenful decides whether the site reads custom or template. The
banned default, centred title + subtitle + two buttons on a flat fill, is
exactly what the scaffold ships as a wireframe; shipping it is a failed build
(review.md §3.1). Compose the hero WITH its image, from the DNA's hero attitude.

### 1.1 The anatomy contract (invariant: WHAT, never WHERE)

Every hero contains, reachable above the fold on mobile:

| Element | Rule |
|---|---|
| One `<h1>` | Outcome-led headline grounded in the business + place. The only h1 on the page. |
| Support line | How / for whom / where. One or two lines, no more. |
| Primary CTA | The page's ONE action; verb + outcome copy (`goober-content-writing`). Optional quieter secondary. |
| Proof element | Rating + review count, years, badge REAL numbers only (hard law 10). |
| Phone (local) | Visible `tel:` link in the hero AND the header. |
| Header over it | Transparent/solid per `components.md`, contrast verified against the actual hero field. |

The contract fixes WHAT exists; where it sits is composition, the design itself.

### 1.2 Composition patterns

Pick ONE from the DNA's hero attitude, then tune every value. Never 50/50
symmetric-by-default; never force `100vh`, use `svh` and let content breathe.

| # | Pattern | Suits | Image treatment | Callouts sit |
|---|---|---|---|---|
| 1 | Editorial split | Refined Editorial, Precision, Heritage, Modern Country | Offset column, DNA mask, 4:5 crop | Meta/trust row under headline; pill on image corner |
| 2 | Full-bleed immersive | Luxury Noir, Coastal, Industrial (dark wash), Rural | Full viewport + engineered scrim | Pill floats on image; scroll cue low corner |
| 3 | Offset panel | Coastal, Soft Clinical, Warm Craft, Heritage | Full-bleed behind a raised panel | Proof inside the panel; badge on panel edge |
| 4 | Colour-field + cutout | Bold Civic, Playful Pop, Kinetic, Heritage | Cutout PNG overlapping the field edge | Badge cluster beside cutout |
| 5 | Split w/ shaped mask | Coastal, Warm Craft, Soft Clinical | Arch/blob/angle mask from Axis 4 | Pill overlaps the mask corner |
| 6 | Form-in-hero | Urgent trades, lead-gen campaigns | Wash or none, the form is the visual | Trust strip directly under both columns |
| 7 | Typographic slam | Kinetic, Refined Editorial, Precision | None, type + texture field carry it | Meta row under headline only |
| 8 | Video/scrub cinematic | Luxury Noir, premium builds | Frame-scrub canvas | Minimal, one line + CTA |

**1 · Editorial split**: asymmetric 55/45 or 60/40; headline column leads; the
image hangs LOWER than the headline; meta/trust row beneath the headline.

```css
/* pages/home.css */
.hero--editorial { display: grid; grid-template-columns: minmax(0, 11fr) minmax(0, 9fr);
  gap: clamp(2.5rem, 6vw, 5.5rem); align-items: start;
  padding-block: calc(var(--header-h, 5rem) + clamp(2rem, 6vh, 4rem)) var(--section-pad); }
.hero--editorial .hero__media { position: relative; margin-top: clamp(2rem, 8vh, 6rem); } /* the offset IS the move */
.hero--editorial .hero__media img { aspect-ratio: 4/5; width: 100%; object-fit: cover;
  border-radius: var(--radius-media, var(--radius)); }         /* or the DNA's mask, pattern 5 */
.hero__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; margin-top: 2.5rem; }
@media (max-width: 768px) { .hero--editorial { grid-template-columns: 1fr; }
  .hero--editorial .hero__media { order: 2; margin-top: 0; } } /* other patterns: §4.6 */
```

**2 · Full-bleed immersive**: image/scene fills the viewport; text anchored
LOW-THIRD or corner, not reflex-centred; scrim engineered per §1.3; scroll cue if tall.

```css
.hero--immersive { position: relative; isolation: isolate; min-height: min(92svh, 60rem);
  display: grid; align-content: end; justify-items: start;     /* bottom-left anchor */
  padding: calc(var(--header-h, 5rem) + 2rem) var(--container-pad) clamp(3rem, 9vh, 6rem); }
.hero--immersive > img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%;
  object-fit: cover; object-position: var(--focal, 65% 40%); } /* subject on the far third */
.hero--immersive::after { content: ""; position: absolute; inset: 0; z-index: -1; /* low-third scrim */
  background: linear-gradient(to top, color-mix(in oklab, var(--color-ink) 82%, transparent),
    color-mix(in oklab, var(--color-ink) 38%, transparent) 45%, transparent 78%); }
.hero--immersive .hero__content { max-width: 38rem; color: var(--color-paper); }
```

**3 · Offset panel**: full-bleed image; a solid (or glass) panel overlaps from
one side via grid overlay and carries headline + CTA + proof, on the image's calm side.

```css
.hero--panel { display: grid; align-items: center; min-height: min(88svh, 56rem);
  grid-template-columns: minmax(var(--container-pad), 1fr) minmax(0, var(--page-max)) minmax(var(--container-pad), 1fr); }
.hero--panel > .hero__media { grid-area: 1 / 1 / 2 / 4; height: 100%; }
.hero--panel > .hero__media img { width: 100%; height: 100%; object-fit: cover; }
.hero--panel > .hero__card { grid-column: 2; justify-self: start; /* or end */
  max-width: 34rem; margin-block: clamp(3rem, 8vh, 5rem);
  background: var(--color-paper); padding: clamp(2rem, 4vw, 3.5rem); border-radius: var(--radius);
  box-shadow: 0 24px 60px -24px color-mix(in oklab, var(--color-ink) 45%, transparent); }
/* glass variant only if Axis 5 names glass:
   background: color-mix(in oklab, var(--color-paper) 72%, transparent); backdrop-filter: blur(14px); */
```

**4 · Colour-field + cutout**: committed brand-colour field (Axis 3 ≥
"Committed"), headline at the top of the scale, cutout image crossing the
field's bottom edge, badge cluster beside it.

```css
.hero--field { background: var(--color-primary); color: var(--color-paper);
  padding-block: calc(var(--header-h, 5rem) + 2rem) 0; }
.hero--field .hero__grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(2rem, 5vw, 4rem); align-items: end; }
.hero--field .hero__cutout { position: relative; z-index: 2;
  margin-bottom: calc(-1 * var(--drop, 5rem));                 /* crosses the field edge */
  filter: drop-shadow(0 24px 32px color-mix(in oklab, var(--color-ink) 35%, transparent)); }
.hero--field + [data-block] { padding-top: calc(var(--section-pad) + var(--drop, 5rem)); } /* compensate */
```

**5 · Split with shaped mask**: pattern 1's grid, image masked in the DNA's
shape language. ONE mask language site-wide (Axis 4's signature motif).

```css
.mask-arch  { border-radius: 999em 999em var(--radius) var(--radius); } /* clamps to a true arch */
.mask-blob  { border-radius: 58% 42% 55% 45% / 52% 48% 45% 55%; }
.mask-angle { clip-path: polygon(0 0, 100% 6%, 100% 100%, 0 94%); }
```

**6 · Form-in-hero**: urgent trades / paid lead-gen only: pitch left, short
form card right (≤ 4 fields, spec in `components.md`), trust strip directly under.
Highest-converting pattern when leads are the only goal, and only then.

```css
.hero--capture { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(2.5rem, 6vw, 5rem); align-items: center;
  padding-block: calc(var(--header-h, 5rem) + 2.5rem) var(--section-pad); }
.hero--capture .lead-card { background: var(--color-paper); border-radius: var(--radius);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  box-shadow: 0 24px 56px -20px color-mix(in oklab, var(--color-ink) 40%, transparent); }
```

**7 · Typographic slam**: no image: the headline is the visual, on a designed
texture field (Axis 5), with ONE kinetic accent word or underline draw
(`motion.md`). Only when the DNA's display face can carry a page alone. The
type ceiling still applies (H1 ≤ 56px desktop), slam comes from measure,
leading, and emptiness; an oversized outlined word may sit BEHIND as texture
(`aria-hidden`) because it isn't the h1.

```css
.hero--slam { position: relative; isolation: isolate;
  min-height: min(85svh, 52rem); display: grid; align-content: center; }
.hero--slam h1 { max-width: 14ch; line-height: 1.02; }         /* top of the fluid scale */
.hero--slam .word-accent { color: var(--color-primary); }      /* or underline draw, motion.md */
.hero--slam::before { content: ""; position: absolute; inset: 0; z-index: -1;
  background: var(--hero-texture); }                           /* grain / radial / mesh, Axis 5 */
```

**8 · Video/scrub cinematic**: hand the build to the `animated-website`
skill's pipeline. The DNA still governs type, colour, and restraint; the
anatomy contract (§1.1) still applies over the frames.

### 1.3 Hero image art direction

- **Generate FOR the composition, never crop after.** Extend the shared prompt
  prefix (`imagery.md`) with placement: text left → *"subject on the right
  third, calm uncluttered negative space across the left half"*.
- **Focal point**: subject on the third AWAY from the text; encode it as
  `--focal` → `object-position` so crops track it at every width.
- **Scrim recipes**: directional and engineered, never a flat 50% black wash:

```css
/* Side scrim, text column left, image busy right */
.scrim-side::after { background: linear-gradient(90deg,
  color-mix(in oklab, var(--color-ink) 80%, transparent) 0%,
  color-mix(in oklab, var(--color-ink) 42%, transparent) 40%, transparent 72%); }
/* Vignette, centred low-third text on a bright scene */
.scrim-vignette::after { background: radial-gradient(120% 85% at 50% 92%,
  color-mix(in oklab, var(--color-ink) 74%, transparent), transparent 62%); }
/* Colour-wash, brand tint pulls any image on-palette, then darkens the text anchor */
.scrim-wash::after { background:
  linear-gradient(to top, color-mix(in oklab, var(--color-ink) 70%, transparent), transparent 60%),
  color-mix(in oklab, var(--color-primary) 26%, transparent); }
```

- **Verify for the worst pixel, not the average**: check 4.5:1 against the
  LIGHTEST/busiest region the text actually touches (Phase 5 screenshots).
  Failing → thicken the scrim at the text anchor, shift `--focal`, or (last
  resort) a blurred-tint backplate behind the text block only.
- **Mobile crop plan**: art-direct the crop per breakpoint when choosing the
  image: e.g. `object-position: 66% 38%` desktop → `78% 30%` at ≤768px. If no
  calm zone survives at 390px, the mobile hero stacks: image band on top
  (deliberate ~16:10 crop), text below on a solid field.

### 1.4 Callout placement grammar

**1 to 2 floating callouts maximum**: clutter kills premium. Every callout
carries a real number (hard law 10). The set:

| Callout | Placement |
|---|---|
| Review pill (★ row + "4.9 · 212 reviews") | Anchored to an image/panel corner, breaking the edge slightly |
| Stat badge (years / jobs done) | Small card overlapping the hero's opposite edge |
| Trust logo strip | Directly UNDER the hero, logos greyscale/monochrome |
| Phone | Header AND hero for local businesses, both `tel:` |
| Location line ("Servicing the Gold Coast") | In the hero meta row, beside the proof element |

```css
/* components.css */
.hero__media, .hero__card { position: relative; }
.pill-review, .badge-stat { position: absolute; background: var(--color-paper); color: var(--color-ink);
  box-shadow: 0 16px 40px -16px color-mix(in oklab, var(--color-ink) 50%, transparent); }
.pill-review { left: calc(-1 * clamp(.75rem, 2vw, 1.5rem)); bottom: clamp(1.5rem, 4vh, 2.5rem);
  display: inline-flex; align-items: center; gap: .6rem; padding: .7rem 1.1rem; border-radius: 999px; }
.badge-stat { top: clamp(1rem, 3vh, 2rem); right: calc(-1 * clamp(.75rem, 2vw, 1.25rem));
  padding: .9rem 1.15rem; border-radius: var(--radius); }
.trust-strip img { height: clamp(1.5rem, 2.5vw, 2rem); width: auto; filter: grayscale(1); opacity: .62; }
/* dark/tinted fields: filter: grayscale(1) brightness(0) invert(1); opacity: .55; */
@media (max-width: 768px) { .pill-review { left: .75rem; }     /* tuck INSIDE the image edge */
  .badge-stat { position: static; display: inline-flex; margin-top: .75rem; } }
```

---

## 2. Section flow: narrative before layout

Do NOT reach for a fixed page template. Section order is derived: list what
this visitor must believe, in order, before they'll act, then give each
belief exactly ONE section. A section that earns no belief gets deleted,
however normal it looks ("websites have an About section" is not a reason).

### 2.1 The belief ladder

Write the ladder into the design context file's section flow map before
building. Rules: the hero earns belief zero ("right place, real outcome"); one
section per belief, two sections proving the same thing means one is dead
weight; the ladder ends at the ask.

**Local service home page** (plumber, physio, landscaper…):

| The visitor must believe, in order | The ONE section that earns it |
|---|---|
| "They do exactly what I need" | Services, named, linked, right after the hero |
| "They're real, and they're local" | Proof-of-place strip: Google rating + suburbs served + a real local photo |
| "They're actually good" | ONE strong proof section, reviews with names + suburbs, or before/after work |
| "Starting is easy and safe" | Process ("what happens when you call") + guarantee inline |
| "My specific worry is answered" | FAQ built from real objections (price, mess, timing) |
|, ready, | The final ask band (§2.3, designed, not defaulted) |

**Service detail page:**

| Belief | Section |
|---|---|
| "This page is about MY exact problem" | Problem → outcome opener, visitor-voiced |
| "I know exactly what I'd get" | Scope / inclusions |
| "They've done THIS before, for people like me" | Proof specific to this service, never recycled site-wide quotes |
| "I know how it starts / roughly what it costs" | Process, or a "From $X" anchor |
| Objections | FAQ specific to this service |
|, ready, | The ask |

**About page** (it still converts, end with the ask):

| Belief | Section |
|---|---|
| "Real people, not a facade" | Story + faces, real photography |
| "Their reason maps to my need" | Why-we-do-it, written customer-relevant |
| "They're credible" | Credentials, years, numbers |
| "I'd like dealing with them" | Values shown through work/community shots, never listed as adjectives |
|, ready, | The ask |

**Contact page** (brief): the visitor already believes, remove friction, add
nothing. `h1` + one reassurance line → form beside direct methods (tel, mailto,
address, hours, map) → optionally FAQ. Phone and email visible without
scrolling on mobile. No other sections.

### 2.2 Conversion cadence

- A CTA opportunity every 2 to 3 sections; never more than ~2 viewports of
  scrolling without an action available.
- **Vary the ask's form, not its target**: inline one-line band → split panel
  with phone beside the button → floating/sticky mobile call-quote bar (hard
  law 7) → the final band. Same action, same wording family everywhere.
- Friction microcopy under primary CTAs: "Free, no obligation · Replies within 2 hours."
- The final section before the footer is always the ask. Never two
  ask-sections adjacent, proof or process must separate them.

### 2.3 Rhythm rules

- **No two ADJACENT sections share** background treatment + layout + alignment.
  Two tinted centred grids in a row → one of them changes.
- **Density alternates**: a dense proof section (compact cards, many numbers)
  follows an airy statement section. Never three text-dense sections running.
- **≥2 deliberate container breaks per page (aim for 3)**: e.g. one
  full-bleed moment and one asymmetric moment; a page of same-width centred
  columns is a failed derivation (Axis 8).
- **Page endings are designed.** The final ask band belongs to the DNA, a
  colour-field with texture, an image-wash, a brand-tinted dark, never the
  default navy rectangle with centred white text. Its seams (previous section
  → band → footer) are chosen in §3 like any other.

### 2.4 Interior pages: siblings, not clones

- Inherit the DNA wholesale: same tokens, devices, mask language, motion signature.
- **Compress the hero**: 40 to 60svh variants, a title band (tinted field,
  breadcrumb, `h1`, one-liner), a compressed split, or an image band with
  low-third title. Same family as the home hero, smaller commitment.
- **Vary one axis per page** so pages read as siblings: the services page
  flips the dominant field; the about page leads with imagery where home led
  with type. One axis, more and the site falls apart.
- **No two pages share the same section sequence.** Ladders differ, so this
  falls out naturally; identical sequences mean a ladder was copied, not derived.

---

## 3. Section transitions: design the seams

Butt-jointed colour rectangles are the #1 structural tell of an undesigned
page. The page must read as ONE composition: **every seam gets a named
treatment, chosen in the section flow map BEFORE building**, ≥3 distinct
treatments per page (hard law 4), and the ask-band → footer seam counts too.
"No treatment" is only valid inside a shared field (§3.6). An unnamed seam is
a bug at review (review.md §2, axis 7). Map format, in the design context file:

```
1 hero--immersive          ▼ overlap pull (review strip rides up)
2 proof strip (ink)        ▼ hard cut, chosen: stepping into daylight
3 services (sand tint)     ▼ blend zone (sand → sage)
4 process (sage tint)      ▼ shared field ─┐ one linen wash
5 testimonials             ─┘ spacing only
6 FAQ (sand)               ▼ gradient bridge (sand → ink)
7 final ask (ink + image-wash)  ▼ tonal hairline → footer (ink)
```

### 3.1 Blend zone: the workhorse

Adjacent sections share a colour edge: A ends in B's colour via a bottom
gradient band, so the join reads as light changing, not a border.

```css
/* components.css, generalized recipe */
.blend-out { position: relative; }
.blend-out::after { content: ""; position: absolute; inset: auto 0 0 0;
  height: clamp(4rem, 10vw, 8rem); pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--blend-to, var(--color-paper))); }
/* pages/home.css, declare each seam where it happens */
[data-block="services-v2"] { --blend-to: var(--field-sage); }
```

Alternative: wrap both sections and let ONE gradient span them
(`.blend-pair { background: linear-gradient(to bottom, var(--field-a) 40%, var(--field-b) 60%); }`,
children transparent). Best between neighbouring tints (sand → sage); tonally
distant fields want a bridge (§3.2) or a hard cut (§3.7).

Workhorse, not wallpaper: **≤2 blend seams per page**, and at least one seam
per page must be structural, overlap pull, curve, angle cut, or hard cut
(§3.3 to §3.7). A page of nothing but gradients reads as one long smear.

### 3.2 Gradient bridge

A dedicated thin band (60 to 120px) carrying the gradient between two committed
fields when neither can host a blend band (both have busy internals):
`<div class="bridge" aria-hidden="true"></div>` between the two.

```css
.bridge { height: clamp(3.75rem, 8vw, 7.5rem); pointer-events: none;
  background: linear-gradient(to bottom in oklab, var(--from), var(--to)); }
/* `in oklab` avoids the grey dead-zone between saturated hues */
```

Never between near-identical fields, that's a blend zone's job.

### 3.3 Curve / arc divider

One curve style site-wide, shallow, from the DNA's shape language, tasteful
for Coastal, Soft Clinical, Warm Craft. **Never clip-art multi-lobe waves.**

```html
<svg class="seam-curve" viewBox="0 0 1440 88" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <path d="M0 88 C 320 12 1120 12 1440 88 Z"/>
</svg>
```
```css
.seam-curve { display: block; width: 100%; height: clamp(2.5rem, 6vw, 5.5rem); margin-bottom: -1px; }
.seam-curve path { fill: var(--curve-fill); }   /* = the NEXT section's field, doming up */
```

Alternate (no SVG): oversized `border-radius: 100% 100% 0 0 / 4rem 4rem 0 0`
on the next section's top plus a matching negative margin.

### 3.4 Angle cut

Clip the section edge on a diagonal Kinetic Sport, Industrial Utility
(echoes Axis 4's angled-cut motif). One direction site-wide; subtle ≈1.5 to 2deg
for assured brands, bold ≈4deg only where the DNA is kinetic.

```css
.cut-top { --cut: clamp(1.25rem, 3.5vw, 4rem);         /* ≈1.5–4deg across common viewports */
  clip-path: polygon(0 var(--cut), 100% 0, 100% 100%, 0 100%);
  margin-top: calc(-1 * var(--cut));
  padding-top: calc(var(--section-pad) + var(--cut)); } /* keeps text clear of the wedge */
/* clip-path clips box-shadows, floating elements near the edge live outside the clipped box */
```

### 3.5 Overlap pull: the strongest "designed" signal

The next section's lead element (card row, stat strip, image) pulls UP into
the previous section, straddling the boundary. Strongest across a colour
change; 1 to 2 per page. Classic uses: stat strip riding up into the hero image;
services card row straddling hero → section one.

```css
.pull-host { padding-bottom: calc(var(--section-pad) + var(--pull, 5rem)); } /* host makes room */
.pull-up { position: relative; z-index: 2; margin-top: calc(-1 * var(--pull, 5rem)); }
@media (max-width: 768px) { .pull-up { --pull: 2rem; } }     /* tucked offset, never zero */
```

The pulled element must carry its own surface, card background + elevation.
or it reads as a rendering mistake, not a decision.

### 3.6 Shared background field

One background (image wash, mesh, linen texture) spans 2 to 3 RELATED sections.
wrap them in a plain `div.field-group`; inside, separation is spacing and type
scale only. Binds a narrative unit (the proof cluster: work + reviews + stats).

```css
.field-group { background: var(--group-wash, var(--field-2)); } /* quiet, must survive 3 sections */
.field-group > [data-block] { background: transparent; }
```

### 3.7 Hard cut (named)

A deliberate full-contrast switch, light → brand-tinted dark (never `#000`,
Axis 3), at a narrative turning point: entering the proof act, or arriving at
the final ask. Allowed because it's CHOSEN in the map, not defaulted.
**Maximum 2 per page.** Give the incoming dark section its own opening move (a
different first element, not the same heading pattern), and step dark-on-dark
junctions tonally:

```css
[data-block^="cta-"] + .site-footer {
  border-top: 1px solid color-mix(in oklab, var(--color-paper) 14%, transparent); }
```

---

## 4. Composition & width rhythm

### 4.1 The container system: and its deliberate breaks

A page where everything sits in one centred column is a failed derivation.
Base container plus **≥2 deliberate container breaks per page (aim for 3)**:

```css
/* components.css, layers on the base .container */
.container { max-width: var(--page-max); margin-inline: auto; padding-inline: var(--container-pad); }
.container--wide   { max-width: calc(var(--page-max) * 1.2); } /* stat bands, galleries */
.container--prose  { max-width: 65ch; }                        /* long-form reading */
.container--offset { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr); }
.container--offset > * { grid-column: 2; }                     /* the empty column is intentional air */
/* Full-bleed element from INSIDE a container (breaks under transformed ancestors.
   prefer making the section itself the bleed and containing only the copy): */
.full-bleed { width: 100vw; margin-inline: calc(50% - 50vw); }
```

### 4.2 Asymmetry recipes

**Split-bleed**: 60/40 or 66/33; copy stays on the page grid, image bleeds to
the viewport edge:

```css
.split-bleed { display: grid; grid-template-columns: 6fr 4fr; } /* or 2fr 1fr */
.split-bleed .split-copy { padding-block: var(--section-pad);
  padding-inline: max(var(--container-pad), calc((100vw - var(--page-max)) / 2)) clamp(2rem, 5vw, 4rem); }
.split-bleed .split-media { position: relative; min-height: 24rem; }
.split-bleed .split-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
```

**Heading outside the content column** (Refined Editorial), the `h2` in a
narrow left rail, prose in the main column:

```css
.aside-heading { display: grid; grid-template-columns: minmax(0, 16rem) minmax(0, 60ch); gap: clamp(2rem, 6vw, 5rem); }
```

Content off-centre = `.container--offset`. Pick the empty side once per page
and keep it, alternating randomly reads as drift, not rhythm.

### 4.3 Overlap recipes

Card straddling two backgrounds → the overlap pull (§3.5). Image crossing a
section boundary → the same maths on the media element (see `.hero__cutout`,
§1.2 pattern 4). Badge overlapping an image corner → the callout grammar
(§1.4). All one mechanism: negative margin + `z-index` + host padding compensation.

### 4.4 Grid-break moments

One element per 2 to 3 sections escapes its container, a pull-quote wider than
the prose, an image bleeding to one edge, a full-bleed marquee. **Planned in
the flow map, not sprinkled.**

```css
.container--prose .breakout { width: min(52rem, 100vw - 2 * var(--container-pad));
  margin-inline: calc((100% - min(52rem, 100vw - 2 * var(--container-pad))) / 2); }
```

### 4.5 Density: set once, by the DNA

```css
:root { --section-pad: clamp(3.5rem, 7vw, 6rem); }  /* substrate default */
/* airy premium: clamp(5.5rem, 11vw, 10rem), few elements, vast fields    */
/* dense trust:  clamp(3rem, 6vw, 4.5rem)  , compact cards, many proofs   */
```

Airy premium and dense trust are BOTH premium when consistent (Axis 8 decides
which this business is). Random per-section spacing is neither.

### 4.6 Mobile resolution (≤ 768px): every recipe collapses deliberately

| Recipe | Resolution |
|---|---|
| Editorial / mask split hero | One column; copy first, media second (the h1 is the hook) |
| Feature splits mid-page | Media ABOVE its copy (the image earns the read), `order` or DOM order |
| Split-bleed | Media stacks on top at ~16:10, keeps full width; copy returns to the container |
| Offset panel hero | Image becomes a top band (~16:10 crop); panel becomes a card pulled up over it by ~2rem |
| Colour-field cutout | `--drop` shrinks to ~2.5rem; cutout narrows, never clips faces |
| Form-in-hero | One column; form card directly under headline + CTA, above all else |
| Overlap pull | `--pull: 2rem`, a tucked offset; never collapse to zero, keep the signal |
| `.container--offset` / `.aside-heading` | Single column; the air column disappears |
| Angle / curve seams | `clamp()` floors them (~1.25rem / 2.5rem) so they stay proportionate |
| Full-bleed imagery | Keeps a deliberate crop: `aspect-ratio` + art-directed `object-position` (§1.3) |
| Everything | **No horizontal scroll at 390px, ever.** Hunt the cause (`100vw` + scrollbar, un-collapsed negative margins), `overflow-x: clip` is a bandage, not a fix |

Verify at Phase 5: 1440 + 390 screenshots, graded against review.md axis 5
(layout) and axis 7 (section flow).
