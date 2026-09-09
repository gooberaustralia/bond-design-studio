# Design Strategy, from business facts to a committed Design DNA

Read this at Phase 1 of every build, BEFORE any HTML, CSS, or image work.
Output: a completed design context file (see `design-context.md`). Nothing in
the build may contradict that file once written.

Generic output happens when an agent starts typing HTML with an *implicit*
design in its head, it converges to the same safe defaults every time. This
process forces every visual decision to be **derived from the business** and
**committed in writing**. Variety comes from honest derivation, not randomness.

---

## 1. Intake: pin the facts (think, don't interrogate)

Extract from the brief/CLAUDE.md/brand assets. Infer confidently when
unstated; only ask the user when a fact is both unknowable and consequential.

| Fact | What to pin down |
|---|---|
| Industry + offer | What do they actually sell? Premium or volume? Urgent or considered purchase? |
| Audience + moment | Who arrives, on what device, in what state of mind? ("burst pipe at 9pm on a phone" vs "browsing wedding venues on a Sunday laptop") |
| Conversion goal | The ONE action a page exists to cause (call / quote form / booking / visit) |
| Brand reality | Logo (extract its colours + shapes), existing colours/fonts, photography supplied? Quality? |
| Competitive vibe | What do 3 typical competitors look like? (You know common industry aesthetics, name them so you can deviate deliberately) |
| Personality words | 3 to 5 adjectives the business should FEEL like, then convert to PHYSICAL words ("warm, mechanical, opinionated" beats "modern, clean"). Derive from copy/tone if not given ("family-owned since 1998" → heritage, trustworthy, personal) |
| Anchor references | 2 to 3 NAMED references, specific brands, objects, places ("Patagonia catalogue", "a Leica manual", "a Noosa beach house"), never adjectives. Unnamed ambition becomes beige. |
| Locale | Country/region → spelling, imagery landscape, seasonal light, cultural texture (Australian coastal ≠ London financial) |

**The moment-of-need test drives everything.** An emergency trade site optimises
for speed-to-phone-number with high-urgency contrast; a day spa optimises for
exhale-on-arrival with unhurried motion. Same skill, opposite designs.

### Finding anchors

Reflex anchors ("Apple", "Aesop") are usually as generic as unnamed ones. Name
the page this category always ships, and its predictable opposite, then set
both aside. From the audience's world, list seven concrete visual systems,
artefacts or rituals they know by heart, including the graphic traditions they
read daily (notation, publications, data displays, interfaces), not only
physical objects. Ask what this business would look like as a physical
object, and what its world looked like before the web. Push until the list
spans at least three material families (paper, metal, screen, textile,
landscape, signage, instrument): if most of the seven cluster in one family,
the search stopped at the obvious artefact. The top two or three become the
Anchor references row above.

---

## 2. The derivation sequence: eight axes, in order

Decide the axes IN THIS ORDER (each constrains the next). For every axis,
write the decision AND the one-line reason into the design context file.
A decision without a reason is a default in disguise, re-derive it.

### Axis 1: Character direction (the master choice)
Pick ONE direction from §4 (or synthesise a hybrid of two, naming it). It must
answer: *"When a visitor lands, what should they feel in the first 800ms?"*
Test the pick against: industry emotion, audience moment, brand assets,
competitor sameness. Then apply the **deviation rule** (§3).

### Axis 2: Typography
The direction gives a type energy (e.g. "confident grotesque + humanist body").
Run the **reflex-reject procedure**: (1) note the 2 fonts you'd reach for by
reflex; (2) if either is on the banned/overused list in `art-direction.md`,
reject it; (3) pick the CONCRETE pairing from the pairing tables, for the
brand as a physical object ("a 1970s workshop manual", "a gallery caption").
never from memory; (4) if your final pick equals your reflex pick, re-derive
once. Decide: display weight ceiling, heading case (sentence/caps/mixed),
letter-spacing personality (tight luxury ≤ -0.02em / neutral / spaced-caps
labels ≥ 0.14em), and the fluid scale ratio (1.2 calm → 1.333+ dramatic).

### Axis 3: Colour system
Derive in this order:
1. **Anchor**: brand colour if it exists (from logo/site); else the direction's
   palette family tuned to industry emotion.
2. **Commitment level**: pick ONE and name it in the context file:
   *Restrained* (neutral field, accent ≤10% of any screen) · *Committed* (one
   colour carries 30 to 60%, colour-block sections) · *Full-palette* (3 to 4 hues,
   each section owns one) · *Drenched* (the brand colour IS the site).
   Name a real reference for the level ("Aesop restraint", "Klim orange drench").
3. **Theme via scene sentence**: write ONE sentence of physical context, who
   uses this, where, under what light, in what mood, and let it force
   light vs dark vs dark-first. If the sentence doesn't force it, sharpen it.
4. **Dominant field strategy**: what colour are most section BACKGROUNDS?
   Never default pure-white-everywhere; never alternate white/grey stripes.
   **Anti-cream rule**: the warm-neutral body field (cream/sand/oat/beige) is
   the saturated AI default, pick it only as a NAMED deliberate choice for a
   direction that demands it, and carry "warmth" in accent + type + imagery
   instead. Tint neutrals toward the brand's own hue, not generic warm/cool.
5. **One sharp accent** (CTA-reserved) + optional support accent. Dominant +
   sharp beats evenly-spread palettes.
6. **Dark-section plan**: which 1 to 3 sections go dark/inverted, and what dark
   actually is (never #000; a brand-tinted ink).
7. **Contrast pairs**: write the exact fg/bg pairs w/ ratios (≥4.5:1 body,
   ≥3:1 large text), including accent-on-dark and muted-on-tinted. On
   saturated mid-luminance fills prefer white text even when dark technically
   passes (perceived-brightness rule).

### Axis 4: Shape language
Radius scale (sharp 0 to 2px / soft 6 to 10px / round 14 to 24px / pill, pick ONE
family + one exception), border philosophy (**default: no visible borders**.
separate with elevation, background shifts, or space; borders only if the
direction calls hairlines as a FEATURE), shadow physics (none / paper / soft
ambient / hard offset, one system), and the signature shape motif (arch,
blob, angled cut, rounded-XL card, circle badge) that recurs site-wide.

### Axis 5: Texture & depth system
Pick the background system from `art-direction.md` §Backgrounds: layered
gradients, grain/noise overlay, geometric pattern, image colour-wash, soft
radial fields, or deliberate flat-minimal (allowed only as a NAMED choice with
compensating craft in type/space). Sections need ≥2 layers of visual interest
(base + texture/gradient/pattern/image) unless flat-minimal is the commitment.

### Axis 6: Motion signature
From `motion.md`: energy (calm / assured / kinetic), the ONE easing family,
duration band, stagger rhythm, signature entrance (what makes THIS site's
reveals recognisable), text-animation policy (split-line reveals? counters?
shimmer?), and hover physics depth. Luxury drifts slow; trades snap fast.

### Axis 7: Imagery art direction
Decide: medium (photography / generated photo-real / illustration / 3D /
abstract-CSS), mood + light (golden hour? overcast soft? studio?), colour
grade (must live in the palette, plan a duotone/colour-wash treatment if
generation drifts), subject rules (real work-in-progress shots beat stock
smiles), crop/mask shapes (from Axis 4), and **write the shared prompt prefix**
(see `imagery.md`) that every generated image on the site reuses.

### Axis 8: Layout attitude
Composition personality: classic-centred / editorial-asymmetric / overlap-led /
grid-breaking, and density (airy premium ↔ information-dense trade). Decide
the container rhythm: base width + which sections BREAK it (full-bleed, offset,
split). A page where every section is the same-width centred column is a
failed derivation.

---

## 3. The deviation rule (differentiation guarantee)

After deriving all eight axes, run the **two-altitude test**:
- **First order**: could someone guess this theme + palette from the industry
  alone? ("plumber → navy + orange", "spa → sage + cream") → that's the
  training-data reflex. Push off it.
- **Second order**: could someone guess the aesthetic *lane* from
  industry-plus-avoiding-the-obvious? ("tradie site that's not navy/orange →
  charcoal + hi-vis industrial") → that's the trap one tier deeper. If your
  DNA lands in the predictable escape lane, push ONE axis (usually texture,
  layout attitude, or imagery) somewhere genuinely derived from THIS business
  (their anchor references, their locale, their actual work).

Also the **inverse test**: describe the planned site the way a competitor
would describe theirs. If the sentence fits the average site in the category,
re-derive. Note the final deviation in the context file:
`deviation: <axis> pushed because <reason>`.

**Voice vs grammar**: a device used once, deliberately, site-wide-consistent
is VOICE (a named kicker system, one numbered-steps section, one hairline
frame). The same device stamped on every section is AI GRAMMAR (the
eyebrow-above-every-heading tell). The context file names which devices this
site uses and where; everywhere else they're banned.

Also run the **sameness check across recent builds**, and don't trust memory
(you have none across sessions). It's file-backed:
- **Read** `~/.goober/design-history.log` at the start of Phase 1 (missing
  file = first build, skip gracefully).
- The new DNA must differ from the LAST build on ≥3 axes, and must not repeat
  the last build's display font, body font, palette family, or shape motif.
- **Append** one line when the context file is written:
  `2026-07-13 · <project> · <direction> · <palette family> · <display>/<body> · <motif> · <signature>`
- Standalone (no ~/.goober): use `.design-history.log` beside DESIGN-CONTEXT.md,
  or skip. Never converge on a house style, and never reuse a worked example's
  palette or motif from these reference files in a real build.

### The four AI-look clusters

AI-generated interfaces tend to cluster in a few looks regardless of subject:
warm cream ground with a high-contrast serif and a terracotta accent;
near-black with one neon accent and glowing edges; broadsheet hairlines with
an italic serif and tracked mono labels; white ground with an indigo or
violet primary and a purple gradient behind the hero. None of these are
wrong on their own brief, but landing in one when the brief left the
aesthetic free is worth a second look, and a warm or child-facing subject
sliding into the cream cluster by default is exactly the pattern the
anti-cream rule (Axis 3) exists to catch.

### What tends to look AI-made

The slop detector in `review.md` §3 is the graded list (eyebrow grammar,
01/02/03 scaffolding, icon-in-circle grids, bordered card grids, the default
hero, alternating stripes, gradient text, emoji, stock smiles, the cream
default field): any hit there is fixed before presenting, no exceptions.
Beyond that list, notice these and ask why they are there, not whether the
checklist allows them:

- Indigo or violet as the default primary, when the brand does not own that
  hue.
- Near-black plus a neon accent as the default "premium tech" look.
- Grey placeholder blocks standing in for content that was not written.
- A page that stops after a hero, three cards, logo row, pricing and FAQ
  when the business has more to say than that.

A dark hero or a bento grid can ship on a genuinely well-made site. The
question is whether it is here because it serves this business, or because
it was the fastest thing to reach for.

### What makes it feel designed

- A signature moment: the one thing a visitor describes to someone else an
  hour later, executed once at full strength and echoed quietly two or three
  more times. If the honest answer to "what would they remember" is a mood,
  the idea has not committed yet.
- A first viewport that states who this is, at the scale the offer has in
  life, not a generic header waiting for a title.
- Section transitions that vary: seams treated as decisions, not accidents
  of stacking rectangles.
- Density with real content: a rich page beats a sparse one when every
  element earns its place.
- Custom SVG icons and HTML mockups (a quote card, a browser frame, a
  before/after slider) that explain the actual offer instead of decorating
  around it. Recipes: `art-direction.md`, `components.md` §4 and
  `imagery.md`.
- Imagery with a real art direction: one grade, one subject logic, shot as
  if by the same photographer on the same day.
- Type with character: a pairing that reads as this brand's physical
  object, not the industry default.

---

## 4. Character directions library

Each entry: feel · suits · type energy · colour attitude · shape · texture ·
motion · hero attitude · **avoid-if**. These are starting recipes, tune every
axis to the business; never ship a direction unmodified.

### 4.1 Refined Editorial
Feel: considered, literate, quietly confident (magazine, not brochure).
Suits: consultancies, architecture, boutique legal/finance, interiors, writers.
Type: serif display (editorial contrast) + neutral humanist body; generous scale ratio; sentence case.
Colour: warm paper or cool ivory field, ink text, ONE deep accent (oxblood, forest, navy); dark sections = ink with cream text.
Shape: sharp-to-soft (0 to 6px); hairline rules used sparingly AS TYPOGRAPHY (not boxes); no shadows or paper-thin.
Texture: subtle grain on fields; oversized numerals/quote marks as graphic devices; generous whitespace IS the texture.
Motion: Calm tier (see motion.md §1); fade + small rise; split-line heading reveals; minimal hover (underline draw, image ease-scale).
Hero: asymmetric editorial spread, oversized headline column + offset image column (or full-bleed image, text on a third); eyebrow above, byline-style meta below.
Avoid-if: emergency trades, kids' services, discount retail.

### 4.2 Warm Craft / Organic
Feel: handmade, honest, tactile, you can smell the sawdust/sourdough.
Suits: cafés, bakers, makers, landscaping, florists, family farms, artisans.
Type: characterful serif or slab display (occasional hand-touch accents ONLY as small labels) + warm sans body.
Colour: cream/oat/clay fields, earthy dominants (terracotta, olive, walnut), butter or moss accent; dark = espresso.
Shape: soft-to-round (8 to 16px); organic blob/arch image masks; paper shadows.
Texture: paper grain, subtle torn-edge/brush section dividers, kraft tints, real-material photo backgrounds (linen, timber) colour-washed.
Motion: Assured tier, scale-settle on images (no spring easing); leaf/steam micro-accents ok if restrained.
Hero: warm full-bleed photo colour-washed to palette + text panel on textured card; or split with arch-masked image.
Avoid-if: corporate B2B, tech, high-urgency services.

### 4.3 Precision Engineering (Swiss)
Feel: exact, calibrated, nothing accidental.
Suits: engineering, manufacturing, B2B services, logistics, dev agencies.
Type: neo-grotesque display (tight tracking) + same-family body; mono accents for data/labels; strict scale.
Colour: cool neutral field (concrete, cloud), graphite ink, one calibrated accent (signal orange, technical blue); dark = graphite.
Shape: sharp (0 to 2px); visible 1px grid lines/registration ticks as a FEATURE (systematic, not decorative boxes); hard-edge offset shadows or none.
Texture: exposed layout grid, dimension-line motifs, blueprint tints on dark sections, mono ordinals (01/02/03).
Motion: Assured tier, precise end; clip-path wipes + exact staggers (no bounce ever); counters for specs.
Hero: hard asymmetric grid, headline block + spec-sheet card + technical image; thin rule frame; mono eyebrow.
Avoid-if: hospitality, wellness, anything warm/human-first.

### 4.4 Bold Civic / Community
Feel: confident, local, human, "we actually live here".
Suits: local services, gyms, schools/childcare (older kids), community orgs, real estate.
Type: heavy grotesque display (700 to 800, the law-5 ceiling) + friendly body; large scale jumps; 900 only on decorative ghost glyphs.
Colour: saturated confident dominants (cobalt, kelly, tomato) used as FULL section fields with white type; warm neutral rest sections.
Shape: soft (6 to 10px); chunky underline/highlight marker accents; sticker-ish badges.
Texture: duotone community photography, oversized outlined type as background devices, flag-block colour geometry.
Motion: Assured tier; solid rises, marker-underline draws, stat counters.
Hero: full-colour field + giant statement headline + real-people photo cluster/collage; trust strip directly under.
Avoid-if: luxury, formal professional services.

### 4.5 Luxury Noir
Feel: cinematic, exclusive, unhurried.
Suits: high-end builders, jewellers, premium venues, luxury auto/marine, fine dining.
Type: high-contrast serif or refined display (light-to-medium weight, LARGE) + light body; tight leading; spaced-caps eyebrows.
Colour: deep ink/charcoal-brown fields dominate; champagne/brass accent; ivory type; light sections = warm bone (never pure white).
Shape: sharp-to-soft (0 to 4px); NO borders, separation by tone; long soft ambient shadows.
Texture: cinematic imagery with heavy grade, gradient vignettes, brass hairline details, grain overlay.
Motion: Calm tier, slow end, silk easing; blur-in text reveals; parallax image drift; hover = slow lift + brass glow.
Hero: full-bleed cinematic image/video, text low-third or centred with vast negative space; single CTA; scroll cue.
Avoid-if: budget offers, urgent trades, playful brands. (Video-scrub hero wanted? → hand off to `animated-website` skill after strategy.)

### 4.6 Coastal Premium
Feel: light, salt-air, effortless quality (Gold Coast native).
Suits: coastal builders/pools, surf/marine, beach hospitality, resort real estate, physio/wellness by the sea.
Type: airy geometric or humanist display (medium weight, roomy tracking) + clean body.
Colour: warm sand + sea-glass/foam tints as fields, deep ocean navy ink, coral or sun accent; dark = ocean navy.
Shape: round (12 to 20px) or arch masks; soft ambient shadows; wave/curve section dividers (subtle, not clip-art).
Texture: sun-flare photography colour-washed, soft radial light fields, water-caustic gradient hints.
Motion: Assured tier; easy drifts, images float-settle, gentle hero parallax.
Hero: full-bleed coastal image, airy left-aligned text on gradient wash; or split with arched image + light panel.
Avoid-if: inland/industrial, formal corporate.

### 4.7 Industrial Utility
Feel: tough, capable, no-nonsense, gear that works.
Suits: construction, plant hire, electrical/plumbing (non-emergency positioning), automotive, security.
Type: condensed bold display (caps ok) + sturdy body; stencil/mono ONLY as small labels.
Colour: charcoal/steel fields, safety accent (hi-vis yellow, safety orange) used sparingly and sharply, concrete neutrals.
Shape: sharp (0 to 4px); angled cuts (clip-path) on sections/images; hard shadows or none.
Texture: diagonal hazard-line accents (thin, cropped), steel/concrete photo textures colour-washed, plate-metal dark sections.
Motion: Kinetic tier; hard rises; counters; no float, no bounce.
Hero: gritty on-site photo (dark wash) + condensed statement + hi-vis CTA; angled bottom edge into next section.
Avoid-if: wellness, luxury, childcare.

### 4.8 Soft Clinical / Care
Feel: calm, clean, safe hands.
Suits: medical/dental/allied health, childcare (littlies), aged care, vets, counselling.
Type: rounded-humanist display (500 to 700, sentence case) + very legible body; modest scale.
Colour: warm white + one calm tinted field (sage, sky, blush, from brand), deep teal/plum ink, gentle accent; dark sections rare (tinted, not black).
Shape: round (14 to 24px); borderless tinted cards; feather shadows.
Texture: soft radial light fields, rounded organic blob accents (subtle), airy photography with soft grade.
Motion: Calm tier; gentle fades/rises, zero aggression, reassuring hover (tint deepen).
Hero: soft split, warm human photo (rounded mask) + calm headline + trust badges (registrations, years) inline.
Avoid-if: bold trades, sport, nightlife.

### 4.9 Heritage Trade
Feel: established, generational, "the name your parents used".
Suits: family firms 20+ yrs, butchers/barbers/pubs, funeral services, traditional legal, heritage builders.
Type: classic serif or slab display + trustworthy body; small-caps/badge lockups.
Colour: deep heritage dominants (bottle green, burgundy, navy) + antique gold/brass accent, parchment fields; dark = the heritage colour itself.
Shape: sharp-to-soft; badge/crest motif (est. year), double-hairline rules as FRAMES used sparingly.
Texture: parchment grain, engraved-line illustration accents, sepia-washed photography.
Motion: Calm tier; dignified fades; underline draws; no gimmicks.
Hero: solid heritage-colour field + serif statement + est. badge + single photo (sepia wash), feels like a storefront sign.
Avoid-if: startups, youth brands, tech.

### 4.10 Kinetic Sport
Feel: fast, energetic, forward-leaning.
Suits: gyms/PTs, sports clubs, physio-performance, action tourism, esports.
Type: italic/oblique heavy display (condensed ok, caps ok) + tight body; angled baselines.
Colour: high-contrast, ink field + electric accent (volt, magenta, cyan) + white; big colour-block sections.
Shape: sharp with angled cuts (skewed section edges, parallelogram cards/images).
Texture: motion-blur photo treatments, speed-line accents, oversized outline numerals, diagonal composition.
Motion: Kinetic tier; skewed slide-ins; marquee strips; counters; hover = quick tilt/skew.
Hero: action photo with dark wash + italic slam headline (staggered lines) + angled CTA; diagonal cut to next section.
Avoid-if: professional services, calm/care brands.

### 4.11 Playful Pop
Feel: fun, friendly, a bit cheeky, makes you smile.
Suits: kids' activities, party services, casual food (gelato, burgers), pet services, creative studios.
Type: chunky rounded display + friendly body; occasional tilted word or highlight.
Colour: confident multi-colour system (3 to 4 buoyant hues on cream), each section owning ONE; ink outlines ok.
Shape: pill + round (16 to 24px); sticker cards (solid offset shadow); squiggle/star accents (SVG, restrained).
Texture: flat-colour fields with pattern sprinkles (dots, waves), sticker-style imagery cutouts.
Motion: Kinetic tier, spring easing (the one direction allowed it); wiggle-on-hover (subtle); marquee ok.
Hero: big colour field + chunky headline with ONE highlighted word + cutout photo/illustration + sticker badges.
Avoid-if: premium positioning, professional services, anything sombre. (Highest slop-risk direction, execute with craft or pick another.)

### 4.12 Modern Country / Rural
Feel: honest, sun-worn, capable, city polish with dirt on its boots.
Suits: rural suppliers, agri-services, regional trades, country venues, land/stock agents.
Type: sturdy slab or grotesque display + plain-speaking body.
Colour: wheat/saddle/eucalyptus dominants, big-sky blue or rust accent, off-white fields; dark = stockman brown/gum green.
Shape: soft (6 to 10px); timber/leather texture hints; simple line-icon set (fence-wire thin).
Texture: golden-hour landscape photography (colour-washed), topographic-line accents, linen grain.
Motion: Assured tier; steady rises; counters for hectares/years/head; no flourish.
Hero: wide-land photo, low-third text, warm wash; stat strip (years, area served) under.
Avoid-if: urban luxury, tech, fashion.

### 4.13 Tech Forward
Feel: capable, current, quietly powerful (for ACTUAL tech clients, not a default!).
Suits: SaaS, IT services, automation/AI consultancies, fintech.
Type: contemporary grotesque (NOT Inter/Space Grotesk, see pairings) + crisp body; mono for code/labels.
Colour: deep space-neutral field (ink-blue/graphite) OR light mode with tinted panels; ONE electric accent; glass panels (blur + border-glow) used sparingly.
Shape: soft (8 to 12px); glass cards; glow shadows (accent-tinted, subtle).
Texture: gradient mesh fields (brand hues, NOT purple-default), fine grid/dot matrices, beam/glow accents.
Motion: Kinetic tier, smooth end; blur-in reveals; gradient shimmer on key numerals; magnetic hover on CTAs.
Hero: gradient-mesh or dark field + strong claim + product visual (screenshot in device/glass frame) offset-right.
Avoid-if: any non-tech local business (the #1 misapplied direction).

### 4.14 Art-Deco Geometric
Feel: crafted glamour, symmetry, occasion.
Suits: event venues, cocktail bars, boutique hotels, salons/barbers (premium), theatres.
Type: geometric display with personality (deco-adjacent) + refined body; letterspaced caps for labels.
Colour: ink or deep emerald/bordeaux fields + metallic gold/brass accent + cream; jewel support tones.
Shape: sharp; deco line-work frames/sunburst corners (SVG, fine strokes); arch motifs.
Texture: fine geometric pattern bands, metallic gradient hairlines, velvet-dark photo grades.
Motion: Assured tier, poised; line-draw animations on frames; fade-scale imagery.
Hero: symmetric composition INSIDE deco frame, centred lockup, patterned band edges, symmetry as the deliberate exception to Axis 8's asymmetry bias.
Avoid-if: casual trades, minimal-modern brands.

**Hybrids** are encouraged when honest (e.g. "Coastal Premium × Precision" for
a marine engineer): name the hybrid, state which axes come from which parent.

---

## 5. The one memorable thing

Before writing the context file, name the site's **signature moment**, the one
thing a visitor describes to someone else. A scroll-scrubbed hero, an oversized
animated numeral system, a distinctive image-mask language, a magnetic CTA, a
split-line headline choreography, a blend-zone colour journey down the page.
ONE, executed perfectly, echoed subtly elsewhere. Write it in the context file
as `signature:` with where it appears.

---

## 6. Write the context file, then stop thinking about strategy

Fill EVERY field of the template in `design-context.md` (Goober Builder:
`design-guide/current.md` + `design-guide/tokens.json`; standalone:
`DESIGN-CONTEXT.md`). Include the reasons. Then move to Phase 2, and from
this point, the file outranks your instincts. If mid-build you want to change
an axis, change the FILE first (and say why), then update everything it touches.
