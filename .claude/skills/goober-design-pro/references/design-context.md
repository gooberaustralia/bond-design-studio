# Design Context, the saved DNA that outranks your instincts

Write this file at the END of Phase 1, BEFORE any HTML, CSS, or image work.
It is the single source of truth for every visual decision on the site. Once
written, **the file outranks your instincts**, mid-build "wouldn't it look
better if…" impulses are exactly the convergence this skill exists to kill.

The contract:

- **Every field gets a value AND a one-line reason.** A decision without a
  reason is a default in disguise, re-derive it (`design-strategy.md` §2).
- **Contradictions between the build and this file are bugs**, found and
  fixed in Phase 5 (`review.md` §3.4), even if the contradiction looks fine.
- **Scoped edits read this file first** (identity lock, SKILL.md). An agent
  touching one section next month must be able to reconstruct the whole
  design language from this file alone, write it for that reader.
- Want to change an axis later? Change the FILE first, with the reason, then
  the build. Never the other way around (§5).

---

## 1. Where it lives

| Environment | Files | Rule |
|---|---|---|
| Goober Builder (`tools/stitch.js` present) | `design-guide/current.md` (prose DNA, §2) + `design-guide/tokens.json` (tokens, §3) | BOTH updated in the same turn as any direction change, a turn that changes visuals but not these files is incomplete |
| Claude Code / Cursor (standalone) | `DESIGN-CONTEXT.md` at project root | One file: the prose template §2 with the tokens as a fenced JSON block at the end (same schema as §3) |

Inherited project with an established look but no context file? A scoped fix
proceeds, but flag the gap and offer to write the file from the site's
computed styles (facts, not aspiration).

---

## 2. The prose template

Copy this skeleton and fill every field. Delete nothing, a section you
think doesn't apply is a derivation you skipped. Reasons stay one line.
**Budget: the finished file stays ≤ ~150 lines (~3k tokens).** It is re-read
at the start of EVERY later session and scoped edit, so it must stay cheap.
deep rationale lives in the build conversation, not the file.

```markdown
# Design Context, {Business Name}
Status: committed {date} · Direction locked. Edits obey this file.

## Direction
**{Direction name}** ({library entry, or "Hybrid: X × Y" naming which axes
come from which parent})
{One paragraph: what a visitor feels in the first 800ms, and why that
feeling is right for THIS business, audience and moment.}
Anchors: {2–3 NAMED references, brands, objects, places. Never adjectives.}

## Signature moment
**{Name it}**, {what it is, one sentence}.
Appears: {where it lives at full strength}. Echoed: {2–3 quieter recurrences}.

## Voice devices
Used deliberately, only where named:
- {device}, {exactly where} ({why it's voice here, not grammar})
- {device}, {exactly where}
Everything not listed is banned grammar: no reflex eyebrows, no 01/02/03
decoration, no side-stripe accents, no icon-in-circle grids.

## Typography
Display: {family} ({fallback stack}), weights {…} · {case} · tracking {…}
Body: {family} ({fallback stack}), weights {…} · sentence · tracking 0
Scale ratio: {1.2–1.4}, {reason}
h1 `clamp({min}, {fluid}, {max})` · h2 `clamp(…)` · h3 `clamp(…)` ·
body {size}/{line-height}

## Colour
Commitment: **{Restrained / Committed / Full-palette / Drenched}**.
"{named real-world reference for the level}"
Scene: "{the one physical sentence, who, where, what light, what mood.
that forced light vs dark vs dark-first}"
Dominant field: {what most section backgrounds are, and why not white}
Tokens (every one, with hex + job):
- primary {#hex} {job} · accent {#hex} {CTA-reserved, where it may NOT
  appear} · ink {#hex} · paper {#hex, name the tint} · muted {#hex}
- extended: {surface / surface_tint / dark / dark_ink / border / accent_2.
  the subset this DNA uses, each with hex + job}
Contrast pairs (exact, measured): ink/paper {n}:1 · white/accent {n}:1 ·
muted/{tint} {n}:1 · {accent-on-dark…}, every pair a visitor will read,
noting which pass body (≥4.5) vs large-only (≥3).
Dark sections: {which sections go dark, what "dark" is (brand-tinted hex,
never #000), what text + accent do there}

## Shape language
Radius family: {sharp/soft/round/pill + px} · Exception: {the ONE off-scale
element and why it earns it}
Borders: {philosophy, default none; hairlines only if named a feature}
Shadows: {the one system, with the actual recipe}
Motif: {the signature shape, arch, cut, blob, badge, and where it recurs}

## Texture & depth
Background system: {layered gradients / grain / pattern / image wash / soft
radial / named flat-minimal}
Recipes: {which treatments, per art-direction.md, on which section types}

## Motion signature
{calm / assured / kinetic} · easing `cubic-bezier(…)` site-wide ·
durations {band} · stagger {n}ms
Signature entrance: {what makes THIS site's reveals recognisable}
Text animation: {split-line reveals? counters? none?, the policy}
Hover physics: {depth and behaviour}

## Imagery art direction
Medium: {photography / generated photo-real / illustration / 3D / abstract}
· Light: {…} · Grade: {…} · Masks/crops: {from shape language}
Treatment: {the colour-wash/duotone recipe applied when grade drifts}
Shared prompt prefix (verbatim, every generated image starts with this):
> "{the exact prefix}"

## Layout attitude
Composition: {classic-centred / editorial-asymmetric / overlap-led /
grid-breaking} · Density: {airy ↔ dense, matched to audience}
Container: {base max-width}; breaks: {which sections go full-bleed / offset
/ split / overlap, at least two per page}

## Section flow map
### {page slug}: hero: pattern {n} ({name}) from layout-flow.md §1
1. {Section}, bg: {treatment} → {transition into next}
2. {Section}, bg: {treatment} → {transition}
{…every section, every page built. ≥3 distinct transition treatments per
page or the map fails. The home map MUST name the chosen hero pattern.
Phase 2 writes the imagery prompt suffix from it without reading ahead.}

## Per-axis reasons
1 Character, {decision}, {one-line reason}
2 Typography, {…}, {…}
3 Colour, {…}, {…}
4 Shape, {…}, {…}
5 Texture, {…}, {…}
6 Motion, {…}, {…}
7 Imagery, {…}, {…}
8 Layout, {…}, {…}

## Deviation note
{axis} pushed because {reason}, {two-altitude result: the first-order
reflex, the escape-lane trap, where this landed instead}.
```

---

## 3. tokens.json v2 schema (Goober Builder)

`design-guide/tokens.json` is the machine half of the contract, stitch
generates `assets/css/tokens.css` from it. **Backward-compatible**: every v1
key stays, same names and shapes; v2 adds optional blocks older readers
ignore. Colour values are **hex only** (no rgb()/hsl()/names).

```json
{
  "version": 2,
  "palette": {
    "primary": "#2F5D46",
    "accent": "#B34A20",
    "ink": "#1F2B24",
    "paper": "#F6F7F2",
    "muted": "#55675C"
  },
  "palette_extended": {
    "surface": "#EBF0E6",
    "surface_tint": "#DFE9DC",
    "dark": "#22352B",
    "dark_ink": "#EEF3EA",
    "border": "#D4DECF",
    "accent_2": "#D9A13B"
  },
  "typography": { "heading": "Besley", "body": "Alegreya Sans" },
  "typography_extended": {
    "scale_ratio": 1.25,
    "heading_weight": 600,
    "heading_tracking": "-0.01em",
    "body_size": "1.0625rem"
  },
  "spacing": { "unit": "0.25rem", "page_max": "1200px", "section_y": "6rem" },
  "radius": "12px",
  "shape": {
    "shadow": "0 24px 48px -24px rgb(31 43 36 / 0.25)",
    "radius_lg": "28px"
  },
  "motion": {
    "easing": "cubic-bezier(0.22, 1, 0.36, 1)",
    "duration_base": "450ms",
    "stagger": "90ms",
    "distance": "32px"
  }
}
```

| Block | Status | Keys |
|---|---|---|
| `version`, `palette`, `typography`, `spacing`, `radius` | **Required, v1, unchanged.** Never rename or drop; downstream tools read these exact paths | `palette.{primary,accent,ink,paper,muted}` · `typography.{heading,body}` · `spacing.{unit,page_max,section_y}` |
| `palette_extended` | Optional, any subset; only tokens the DNA actually uses (an unused token is palette drift waiting to happen) | `surface`, `surface_tint`, `dark`, `dark_ink`, `border`, `accent_2` |
| `typography_extended` | Optional, must agree with the prose Typography section | `scale_ratio` (number), `heading_weight` (number), `heading_tracking` (em string), `body_size` (rem string) |
| `motion` | Optional ONE easing family site-wide; this is it | `easing` (cubic-bezier string), `duration_base` (e.g. `"450ms"`), `stagger` (e.g. `"90ms"`), `distance` (e.g. `"32px"` → `--motion-distance`) |
| `shape` | Optional, `radius` stays the family; `radius_lg` is the named exception | `shadow` (complete box-shadow value), `radius_lg` |

In CSS, consume the generated custom properties, `--color-primary`,
`--color-accent`, `--color-ink`, `--color-paper`, `--color-muted`,
`--color-surface`, `--color-dark`, `--font-heading`, `--font-body`,
`--radius`, `--radius-lg`, `--shadow`, `--motion-easing`,
`--motion-duration`, `--motion-stagger`, `--motion-distance`, `--section-y`,
`--page-max`.
never re-declare raw hex. A hex value in `components.css` or a page
stylesheet (outside generated `tokens.css`) is a contract violation.

---

## 4. Sync rules

1. **File first, always.** Changing an axis mid-build = update
   `design-guide/current.md` (and `tokens.json` if tokens move) WITH the
   one-line reason, THEN every piece of CSS/markup the change touches, in
   the same turn. Build drifted from the file? Decide which one is wrong
   and fix that one.
2. **tokens.json changed → re-stitch.** Run `node tools/stitch.js` so
   `assets/css/tokens.css` regenerates. **Never hand-edit `tokens.css`**.
   it is generated output; the next stitch erases your edit.
3. **Typography change = tokens.json AND `partials/meta.html`.** A font swap
   updates `typography` in tokens.json AND replaces the Google-Fonts `<link>`
   in `partials/meta.html` with the exact families/weights/axes the DNA uses,
   then re-stitch. The scaffold-era link is substituted once at scaffold time
   and never updates itself, skip this and headings silently render in the
   fallback stack.
4. **Prose and tokens must agree.** `current.md` says clay accent while
   `tokens.json` says something else = a bug in whichever moved last.
5. **New pages append to the Section flow map** in the turn they're built.
   A page missing from the map is invisible to the next agent.
6. **Standalone**: same discipline, one file, edit the prose AND the
   fenced JSON block of `DESIGN-CONTEXT.md` together, then apply.

---

## 5. A filled example

Fictional client, study the shape of the reasoning, not the values. This is
the density to aim for.

```markdown
# Design Context Ironbark Landscapes (Gold Coast)
Status: committed 2026-07-13 · Direction locked.

## Direction
**Hybrid: Modern Country × Coastal Premium** (Country: type, texture, imagery · Coastal: colour lightness, shape, motion ease). Sun-warmed competence in the first 800ms, hinterland-acreage credibility with coastal polish; clients live in Currumbin Valley, holiday at the beach club.
Anchors: an R.M. Williams catalogue · a surveyor's site plan · Burleigh headland lookout at 5pm.

## Signature moment
**The contour line**, one fine survey-contour line that draws itself across section boundaries on scroll (landscapers draw levels; it's the thread).
Appears: hero, under the headline. Echoed: 3 section hand-offs + the footer NAP rule.

## Voice devices
Contour-line divider (hero, 3 hand-offs, footer, the signature) · ONE numbered section (the 4-step process, home §5 + /services) · spaced-caps kicker on dark sections ONLY. Everything else: banned grammar.

## Typography
Display: Besley (Georgia, serif) 600/700 · sentence · -0.01em Clarendon warmth reads "country" without the hat-and-boots cliché.
Body: Alegreya Sans ('Gill Sans','Segoe UI',sans-serif) 400/500/700, humanist, easy at length. Scale 1.25 (calm-confident).
h1 clamp(2.1rem, 1.4rem + 3vw, 3.4rem) · h2 clamp(1.6rem, 1.2rem + 1.8vw, 2.4rem) · h3 clamp(1.25rem, 1.1rem + 0.7vw, 1.6rem) · body 1.0625rem/1.65

## Colour
Commitment: **Committed**, eucalypt carries ~40% of home ("Aesop restraint undersells a trade; full drench would cheapen it").
Scene: "A Tallebudgera acreage owner on a laptop at 7pm, golden light still on the paddock, light theme, warmed and green-tinted, never sterile."
Dominant field: paper #F6F7F2, off-white tinted toward the brand green (anti-cream rule: warmth comes from imagery + clay accent, not a beige field).
primary #2F5D46 eucalypt · accent #B34A20 baked clay (CTAs only, never in icons/headings) · ink #1F2B24 gum-shadow · muted #55675C grey-green · surface #EBF0E6 · surface_tint #DFE9DC · dark #22352B · dark_ink #EEF3EA · accent_2 #D9A13B wattle gold (review stars + one highlight, nothing else)
Contrast: ink/paper 13.6 · primary/paper 7.0 · muted/paper 5.6 · muted/surface_tint 4.8 · white/accent 5.4 · dark_ink/dark 11.6, all pass body; accent fills always take white text (perceived-brightness rule).
Dark sections: proof strip (§2) + final CTA (§7) on #22352B, text dark_ink, CTA clay, kicker allowed here only.

## Shape language
Soft-round 12px. Exception: arch-top image masks (border-radius: 160px 160px 12px 12px) on hero + feature imagery, the arch IS the motif (coastal parent), echoed on review-card top edges.
Borders: none, separation by tint shift + elevation. Shadow (one recipe): 0 24px 48px -24px rgb(31 43 36 / 0.25).

## Texture & depth
Image colour-wash + soft radial fields: gum-green gradient wash (multiply) on all full-bleed photography; faint radial light top-left on paper sections; contour-line SVG tile (7% opacity) on dark sections only. No grain, the photography carries the texture.

## Motion signature
Assured · cubic-bezier(0.22, 1, 0.36, 1) · 350–600ms (base 450) · stagger 90ms.
Signature entrance: headline lines rise as the contour draws left-to-right beneath them (hero only, ~900ms). Counters on the proof strip; nothing else. Hover: cards lift 4px + shadow deepens; buttons darken 8% with a 2px arrow nudge.

## Imagery art direction
Generated photo-real + client photos, treated identically · golden hour, low sun · muted earthy grade, greens pulled toward #2F5D46 · arch-top masks · drifted sources get the gum-green wash at 20% multiply.
Shared prompt prefix (verbatim):
> "Editorial landscape photograph, premium residential garden in the Gold Coast hinterland, golden-hour subtropical light, eucalyptus greens, warm stone and spotted-gum timber, soft coastal haze behind, natural imperfect textures, 35mm, shallow depth of field, muted earthy grade, no people facing camera, no text, no watermarks"

## Layout attitude
Editorial-asymmetric, mid-density (acreage buyers read; they don't skim). Container 1200px; breaks: hero full-bleed · §4 project band full-bleed with caption card pulled left of container · §3 services offset two-column.

## Section flow map
### home: hero: pattern 2 (full-bleed immersive) from layout-flow.md §1
1. Hero, full-bleed washed acreage photo → wash deepens into §2's solid dark (blend zone)
2. Proof strip, dark + contour tile, counters → §3's arch image overlaps up into the dark band (pull-up)
3. Services, paper, offset 2-col surface cards → 120px gradient blend paper→surface_tint
4. Signature project, full-bleed washed photo, overlap caption card → contour line draws the hand-off
5. Process, paper, THE numbered section → arch-top tinted panel leads into §6
6. Reviews, surface_tint, wattle-gold stars → gradient blend into dark
7. Service areas + final CTA, dark, suburbs in plain text, clay CTA; contour closes above footer

## Per-axis reasons
1 Character, hybrid, hinterland clients, coastal taste · 2 Type Besley + Alegreya Sans, slab warmth w/o cliché · 3 Colour, committed eucalypt + clay, brand IS the landscape; clay = action heat · 4 Shape, 12px + arch, the arch owns the imagery · 5 Texture, wash + contour, contours are what they draw · 6 Motion, assured settle, confident, never showy · 7 Imagery, golden hour, their best work IS golden-hour acreage · 8 Layout, editorial-asymmetric, considered purchase = reading layout

## Deviation note
Texture pushed: survey-contour motif over the wheat/timber shelf (first-order reflex) and the coastal-wave divider (escape-lane trap), derived from the site plans this business actually produces.
```

Every field has its value and reason? Stop strategising, move to Phase 2
and execute what you committed.
