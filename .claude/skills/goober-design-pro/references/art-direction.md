# Art Direction, typography, colour, and surface craft

The execution library for Phases 2 to 3 and any font/palette/background call.
`design-strategy.md` decides WHAT the site is; this file is HOW it gets
executed at studio quality. All CSS is vanilla, custom properties, plain
selectors: tokens in `assets/css/tokens.css`-consumable form, patterns in
`assets/css/components.css` (Goober Builder). No Tailwind. No inline `style=""`.

---

## 1. Typography
### 1.1 Picking (recap)

Run the reflex-reject procedure from `design-strategy.md` Axis 2: name your
two reflex fonts → reject banned/⚠ → pick from §1.3 for the brand as a
physical object → if the final pick equals the reflex, re-derive once.
### 1.2 Banned and flagged families

| Tier | Families | Rule |
|---|---|---|
| **Hard-banned: never** | Inter · Roboto · Arial · Helvetica · Space Grotesk · Poppins · Montserrat · Open Sans · Lato · Raleway · Geist · `system-ui` stacks | Not as display, not as body, not "just for the nav". No exceptions. Geist is the Vercel default: it reads as the reflex pick. |
| **Overused: ⚠ flag** | Playfair Display · Fraunces · Lora · Cormorant · DM Sans · DM Serif Display · Outfit · Plus Jakarta Sans · Instrument Sans · Instrument Serif · Syne · IBM Plex (any) · Space Mono · Crimson Text/Pro | The current AI reflex. Allowed ONLY with a named reason written in the design context file ("client's print stationery is set in Fraunces"). An unexplained ⚠ pick is a failed derivation. |

Also drifting common, same ⚠ rule: Figtree, Newsreader, Manrope, Work Sans,
Rubik, Fira Sans, Oswald, Anton, Bebas Neue, Quicksand, Nunito, Cormorant
Garamond. Two families max (+ optional mono), display ≠ body; any family not
named in the context file is banned on that site.
### 1.3 The pairing library

Organised by the `design-strategy.md` §4 directions. Format: **Display +
Body, character**. Every family is live on Google Fonts. ⚠ = common.
needs a named reason in the context file. *(1w)* = single weight: display
only; set `font-synthesis: none` so browsers can't fake a bold.
**No body family repeats across consecutive builds**: check the design
history log (design-strategy.md §3) before committing the pairing.
#### Refined Editorial
| Pairing | Character |
|---|---|
| Spectral + Karla | crisp bookish serif with ink-trap bite; Karla keeps captions plain-spoken |
| Newsreader ⚠ + Hanken Grotesk | broadsheet opinion-page serif, earn it by driving opsz ≥ 60 display cuts |
| Source Serif 4 + Albert Sans | scholarly warmth; opsz keeps big sizes sharp while the body stays out of the way |
| STIX Two Text + Schibsted Grotesk | journal-grade gravitas over a Scandinavian newsroom sans |
#### Warm Craft / Organic
| Pairing | Character |
|---|---|
| Young Serif *(1w)* + Karla | chunky 1970s-cookbook serif; honest, floury |
| Bitter + Cabin | bread-crust slab with a rounded humanist body, handmade minus the kitsch |
| Vollkorn + Alegreya Sans | wholegrain German text serif; calligraphic warmth underneath |
| Fraunces ⚠ + Asap | butter-soft wonk, only if you actually drive the SOFT/WONK axes |
#### Precision Engineering (Swiss)
| Pairing | Character |
|---|---|
| Archivo (wdth 125, 700 to 800) + Archivo | one family, two widths, expanded slam display, calibrated normal body |
| Chivo + Overpass | cool grotesque over highway-signage legibility |
| Familjen Grotesk + Hanken Grotesk | tight Swedish display, even neutral running text |
| Saira Semi Condensed + Saira | width-engineered super-family; data-plate headings |
#### Bold Civic / Community
| Pairing | Character |
|---|---|
| Bricolage Grotesque + Public Sans | ink-trapped civic shout over a government-issue body |
| Gabarito (800 to 900) + Figtree ⚠ | rounded-corner poster black; friendly, not childish |
| League Spartan (800) + Mulish | square-jawed geometric slam with a soft, even body |
| Epilogue (900 vs 300) + Epilogue | one family, violent weight contrast does the branding |
#### Luxury Noir
| Pairing | Character |
|---|---|
| Bodoni Moda + Albert Sans (300) | true didone with optical sizing; hairline body whispers |
| Prata *(1w)* + Commissioner (300) | Vogue-adjacent didone, set LARGE and unbolded |
| Italiana *(1w)* + Lexend (300) | engraved-logotype hairlines; headline sizes only |
| Cormorant Garamond ⚠ + Jost | candlelit garamond, needs its named reason, set huge and light |
#### Coastal Premium
| Pairing | Character |
|---|---|
| Marcellus *(1w)* + Albert Sans | inscriptional resort serif with a salt-clean body |
| Urbanist (500 to 600) + Be Vietnam Pro | lookbook geometric, roomy tracking, zero corporate stiffness |
| Sora (300 to 500) + Gantari | light-footed geometric that reads like morning glare off water |
| Petrona + Inria Sans | gentle upright serif; unhurried, sunlit |
#### Industrial Utility
| Pairing | Character |
|---|---|
| Barlow Condensed (700, caps) + Barlow | DIN-flavoured plate lettering; one super-family runs the whole ute |
| League Gothic + Chivo | vintage American gothic condensed; workshop signage |
| Fjalla One *(1w)* + Asap | sturdy display block over a plain mid-contrast body |
| Staatliches *(1w, caps)* + Public Sans | stamped-plate caps; poster energy without reaching for Anton ⚠ |

Reflex warning: Anton ⚠ / Bebas Neue ⚠ / Oswald ⚠, the condensed slams every model grabs; named reason required.
#### Soft Clinical / Care
| Pairing | Character |
|---|---|
| Lexend (600 vs 400) + Lexend | designed for reading proficiency, the care story is built into the font |
| Fredoka (500 to 600) + Mulish | soft rounds at medium weight; warm, never babyish |
| Gabarito (600) + Be Vietnam Pro | rounded corners read as kindness in sentence case |
| Petrona (500) + Alegreya Sans | softly serious serif for counselling and allied health |

Reflex warning: Quicksand ⚠ and Nunito ⚠ are the roundy defaults here.
#### Heritage Trade
| Pairing | Character |
|---|---|
| Besley (700) + PT Sans | a literal Clarendon revival, the letterhead your grandfather trusted |
| Libre Caslon Text + Source Sans 3 ⚠ | the oldest trust-serif in the book, kept off-sweet by a plain body |
| Brygada 1918 + Hanken Grotesk | a revived 1918 foundry serif; the est.-year story told in type |
| Arvo + Cabin | hot-metal slab over a public-bar honest body |
#### Kinetic Sport
| Pairing | Character |
|---|---|
| Saira (wdth 60 to 75, 800, italic) + Saira | one variable family: condensed slanted display and a level body |
| Barlow Condensed (800 italic, caps) + Barlow Semi Condensed | race-plate italics with a tightened body |
| Exo 2 (800 italic) + Exo 2 (400) | techno-sport italics that survive at body sizes |
| Kanit (700) + Bai Jamjuree | Thai-industrial edge Kanit dates fast; display only, small doses |
#### Playful Pop
| Pairing | Character |
|---|---|
| Baloo 2 (800) + Mulish | chubby but disciplined; Mulish stops the sugar overdose |
| Shrikhand *(1w)* + Be Vietnam Pro | Bollywood-poster juice, one word, one hero, done |
| Bungee *(1w)* + Onest | signage-letter fun; display slam only, never body |
| Grandstander + Cabin | comic bounce with an adult body |
#### Modern Country / Rural
| Pairing | Character |
|---|---|
| Bitter (700) + Asap | feed-shed slab over plain speech |
| BioRhyme + Karla | wide letterpress slab, reads like a stencilled wool bale |
| Hepta Slab (800) + Public Sans | heavyweight poster slab, government-plain body |
| Zilla Slab + PT Sans | friendly slab with dirt under its nails |
#### Tech Forward
| Pairing | Character |
|---|---|
| Sora + Archivo (text sizes) | future-leaning geometric without the Space Grotesk reflex |
| Schibsted Grotesk + Wix Madefor Text | sharp product display over a UI-native body |
| Geologica + Onest | engineered variable grotesque; quietly powerful at 500 to 700 |
| Unbounded + Reddit Sans | expanded crypto-weird display, headline only, small doses |

Reflex warning: Manrope ⚠ is drifting common; Space Grotesk is banned outright.
#### Art-Deco Geometric
| Pairing | Character |
|---|---|
| Cinzel + Jost | Trajan capitals over a Futura-blooded body, the marquee pairing |
| Poiret One *(1w)* + Gantari | hairline deco marquee; headline sizes only |
| Rozha One *(1w)* + Inria Sans | high-contrast poster didone for velvet-dark fields |
| Yeseva One *(1w)* + Faustina | jewel-box curves for premium salons; two sizes max |

**Accent fonts** (never display, never body): mono for labels/specs/code.
JetBrains Mono, Fragment Mono, Martian Mono, Kode Mono at 11 to 13px caps or in
code blocks. Hand accents Gochi Hand, Caveat ONLY as small annotation
labels (Warm Craft, Playful Pop), never headings, never paragraphs.
### 1.4 Loading & robustness

Google Fonts: one combined request, always `display=swap`, always preconnect:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Besley:wght@400..900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet">
```
**Goober Builder:** this `<link>` lives in `partials/meta.html`. It is
substituted ONCE at scaffold time and stitch never regenerates it, when the
DNA picks fonts, REPLACE it there with the exact families/weights/axes chosen,
then re-stitch. Leave it and headings silently render in the fallback stack.

Variable axes, request only the axes you'll use, then actually use them:
```
Fraunces:opsz,wght,SOFT,WONK@9..144,300..800,0..100,0..1   → drive via font-variation-settings: "SOFT" 70, "WONK" 1
Archivo:wdth,wght@62..125,100..900                          → the Expanded slam lives at font-stretch: 125%
Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800  → wide display cut at large opsz
Newsreader / Source Serif 4 / Bodoni Moda                   → keep font-optical-sizing: auto; opsz gives the sharp display cut free
```
Metric-matched fallback, kills layout shift during font load. Tune
`size-adjust` until the fallback's line-breaks match, then ascent/descent:
```css
@font-face {
  font-family: "Besley Fallback";
  src: local("Georgia");
  size-adjust: 104%; ascent-override: 93%; descent-override: 25%; line-gap-override: 0%;
}
```
The `@font-face` lives in `components.css`; the stack itself goes into
`tokens.json` as the full-stack string.
`"typography": { "heading": "'Besley', 'Besley Fallback', serif" }`, and
stitch emits it as `--font-heading`. Never re-declare `--font-heading` in CSS.
The shim is pre-swap plumbing NOT permission to design with a banned system font.

Goober Builder self-host (optional, best LCP): woff2 into `assets/fonts/`,
`@font-face` with `font-display: swap`, plus
`<link rel="preload" href="assets/fonts/besley-var.woff2" as="font" type="font/woff2" crossorigin>`.
### 1.5 The type system

**Fluid scale.** Poles 390px → 1440px. For any min/max pair:
vw-coefficient = (max − min in px) ÷ 10.5; rem-intercept = (min − coeff × 3.9) ÷ 16.
```css
/* ratio 1.25, the balanced premium default (body 16→18px) */
:root {
  --text-sm: clamp(0.875rem, 0.85rem + 0.10vw, 0.9375rem);
  --text-md: clamp(1rem, 0.95rem + 0.19vw, 1.125rem);
  --text-h4: clamp(1.25rem, 1.20rem + 0.19vw, 1.375rem);
  --text-h3: clamp(1.5rem, 1.41rem + 0.38vw, 1.75rem);
  --text-h2: clamp(1.8125rem, 1.67rem + 0.57vw, 2.1875rem);
  --text-h1: clamp(2.125rem, 1.89rem + 0.95vw, 2.75rem);
}
```
| Ratio | Feels | h4 / h3 / h2 / h1 desktop max (18px base) |
|---|---|---|
| 1.2 | calm, dense, engineered, info-heavy trades, clinical | 22 / 26 / 31 / 37px |
| 1.25 | balanced premium default | 22 / 28 / 35 / 44px |
| 1.333 | editorial confidence, visible drama | 24 / 32 / 43 / 56px (exactly the H1 cap) |
| 1.414 | statement, hero-led | 25 / 36 / 51 / 56px-capped, the drama lives in the h2→h1 jump |

H1 ≤ 56px desktop / ≤ 36px mobile (hard law 5), the 1.25 block's H1 runs 34→44px.

**Tracking**: tightens as size grows; floor −0.04em; never negative on body.

| Context | Tracking |
|---|---|
| Display ≥ 40px | −0.015 to −0.03em (condensed faces: halve it, they're already tight) |
| Headings 24 to 40px | −0.005 to −0.015em |
| Light display (≤ 300 weight) | 0 to +0.01em |
| Body / UI | 0 |
| Spaced-caps labels (11 to 13px, 500 to 600, uppercase) | 0.14 to 0.28em |

**Line-height bands**: display 0.95 to 1.1 · headings 1.1 to 1.25 · body 1.5 to 1.7
(longer measure → taller) · labels/captions 1.3 to 1.45.

**Weight contrast rule**: heavy display (700 to 800) pairs with a 350 to 450 body;
light display (≤ 300, set LARGE) pairs with a 400 to 500 body. Medium-on-medium
(500 + 500) is the flattest tell in the game. Same-family systems need a
≥ 300 weight gap between display and body.

**Wrapping + measure**: `text-wrap: balance` on headings, `text-wrap: pretty`
on body. Prose containers `max-width: 65ch` (acceptable universe 45 to 75ch).
a paragraph spanning a full 1200px container is a bug, not a layout.

**Hierarchy depth**: every section carries ≥ 3 distinct type voices, heading,
body, and a third: a stat numeral (`font-variant-numeric: tabular-nums`), a
pull-quote, a spaced-caps label from the NAMED kicker system, or a mono spec.
Two voices reads flat; five reads noisy.

---

## 2. Colour method

Strategy, commitment level, the scene sentence, dominant-field, the
anti-cream rule, is decided at `design-strategy.md` Axis 3 and already lives
in the context file. This section turns those calls into tokens, with math.
### 2.1 Composition math

| Rule | Line |
|---|---|
| Body ink contrast | ≥ 7:1 on its field. 4.5:1 is the legal floor, not the studio bar; muted/secondary text may sit 4.5 to 7:1 |
| Field distribution (across projects) | ~½ pure-ish white fields · ~¼ near-black/ink-first · ~¼ brand-tinted. If your last three builds were all cream, the anti-cream rule failed |
| Accent chroma | The CTA accent is SATURATED; muddy mid-tones (dusty teal, greyed mauve) never carry a CTA |
| Primary vs accent | Clearly distinct: different hue family AND ≥ 1.7:1 luminance contrast between the two |
| Neutral tinting | Neutrals carry the BRAND hue: same hue, 3 to 8% saturation, L 95 to 98 for fields / L 10 to 16 for inks. Generic warm/cool grey is a default in disguise |
| Perceived brightness | On saturated mid-luminance fills (kelly, cobalt, ember) use white text even when dark technically passes, dark-on-hot reads cheap |
### 2.2 Brand colour → the full token set (worked method)

1. `--brand` = the brand colour (nudge L until white text on it clears 4.5:1).
2. `--ink` = same hue, S 25 to 45%, L 10 to 16, a near-black with brand blood.
3. `--paper` = same hue, S 3 to 8%, L 95 to 98. `--surface-tint` = one step deeper (L 90 to 93).
4. `--dark` + `--dark-ink` = the dark-section pair: field at L 9 to 14 (more
   saturated than `--ink`), text at ≈ 88 to 92% white tinted toward the hue.
5. `--accent` = rotate toward complementary/adjacent HEAT (green → ember,
   navy → brass or coral, plum → gold); saturated, mid-dark, white-text-safe,
   and ≥ 1.7:1 against `--brand`.
6. `--border` = ink at 12 to 18% alpha. `--muted` = hue kept, S 10 to 20%, L 38 to 45.
7. Write the exact contrast pairs into the context file (Axis 3 step 7).
```css
/* Worked example, brand: deep plum #5C2148 pulled from a boutique salon's foil-stamped cards */
:root {
  --brand:        #5C2148;              /* primary, white on brand ≈ 11.9:1 */
  --ink:          #2B1424;              /* body text ≈ 16:1 on paper */
  --paper:        #FBF6F9;              /* dominant field, plum-blooded white */
  --surface-tint: #F2E4EC;              /* cards, alternate bands */
  --dark:         #331028;              /* dark-section field, never #000 */
  --dark-ink:     #F3E8EF;              /* ≈ 90% white, plum-tinted, ≈ 14:1 */
  --accent:       #8A5A00;              /* brass heat (plum → gold), CTAs only, white on it ≈ 5.9:1 */
  --border:       rgb(43 20 36 / 0.15); /* ink at 15% alpha */
  --muted:        #6F5466;              /* secondary text ≈ 6.3:1 on paper */
}
```
Never reuse a worked example's palette or motif in a real build, examples
show the method; copying one is the exact convergence this skill kills.
### 2.3 Dark sections that feel designed

- The field is brand-tinted ink (`--dark`), never `#000`, never a flat grey.
- Text drops to 85 to 92% white (`--dark-ink`); full `#FFF` vibrates on dark.
- Borders/dividers: white at 8 to 12% alpha, `rgb(255 255 255 / 0.10)`.
- The accent may glow ONCE per dark section (a CTA, an underline, a numeral).
- Imagery on dark gets lifted slightly (`filter: brightness(1.06)` or a
  lighter grade) so photos don't sink into the field.
- 1 to 3 dark sections per page, placed for rhythm: hero, mid-page proof
  (stats/testimonials), final CTA band. Alternating light/dark every section
  is the striped-brochure tell.
### 2.4 Gradients done right

- Brand-derived hues only; two hues per gradient (three only inside a mesh).
- Large and soft, the ramp travels ≥ 60% of the box. Tight multi-stop
  rainbow ramps are banned.
- Mesh = 2 to 3 stacked `radial-gradient`s with blend modes (recipe in §3.2).
- NEVER the purple-on-white AI default, unless the brand is actually purple.
- One direction site-wide: `:root { --grad-angle: 165deg; }`, every
  linear gradient on the site uses `var(--grad-angle)`.

---

## 3. Backgrounds & texture library

Copy-paste recipes. Axis 5 names the SYSTEM: one or two of these site-wide
(plus grain) is a texture language; six is noise. Parents hosting absolute
layers need `position: relative; overflow: hidden;` with content lifted
(`.section > * { position: relative; z-index: 1; }`). Suits-tags use the
`design-strategy.md` §4 direction names.
### 3.1 Layered radial light fields
Suits: Soft Clinical · Coastal Premium · Tech Forward (light mode) · Refined Editorial (very faint)
```css
.field-light {
  background:
    radial-gradient(1100px 700px at 85% -10%, rgb(20 80 58 / 0.10), transparent 60%),
    radial-gradient(900px 600px at -10% 110%, rgb(194 65 12 / 0.06), transparent 55%),
    var(--paper);
}
```
Taste: alphas 0.04 to 0.12, both glows from the token palette. If you can point
at where a glow "ends", it's too strong.
### 3.2 Gradient mesh
Suits: Tech Forward · Kinetic Sport · Luxury Noir (single-hue, barely there)
```css
.field-mesh {
  background-color: var(--dark);
  background-image:
    radial-gradient(55% 65% at 18% 12%, rgb(20 80 58 / 0.85), transparent 70%),   /* brand */
    radial-gradient(45% 55% at 82% 18%, rgb(194 65 12 / 0.35), transparent 70%),  /* accent, quiet */
    radial-gradient(65% 75% at 55% 95%, rgb(30 120 90 / 0.45), transparent 75%);  /* brand, lifted */
  background-blend-mode: screen, lighten, normal;
}
```
Taste: brand hues only, no default purple. Keep the edges soft, and test
text contrast at the brightest point of the mesh, not the average.
### 3.3 Noise / grain overlay
Suits: Refined Editorial · Luxury Noir · Warm Craft · Heritage Trade · Modern Country
```css
.grain { position: relative; isolation: isolate; }
.grain::after {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.06; mix-blend-mode: overlay;
}
```
Taste: opacity 0.04 to 0.08 (dark fields tolerate the top of the range). Grain
is a finishing pass, not a personality.
### 3.4 Fine geometric patterns
Suits: dots Tech Forward · Precision Engineering; grid Precision
Engineering (as the named FEATURE) · Refined Editorial (faint); hatch.
Industrial Utility · Kinetic Sport
```css
/* dot matrix, a faded band, not full-bleed wallpaper */
.section--dots::before {
  content: ""; position: absolute; inset: 0 0 auto 0; height: 240px;
  background-image: radial-gradient(rgb(15 36 28 / 0.12) 1px, transparent 1.5px);
  background-size: 18px 18px;
  mask-image: linear-gradient(180deg, #000, transparent);
}
/* hairline grid */
.section--grid::before {
  content: ""; position: absolute; inset: 0;
  background-image:
    linear-gradient(rgb(15 36 28 / 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgb(15 36 28 / 0.06) 1px, transparent 1px);
  background-size: 72px 72px;
}
/* diagonal hatch, a thin edge strip only */
.edge-hatch { height: 12px; background: repeating-linear-gradient(45deg, var(--accent) 0 10px, transparent 10px 24px); }
```
Taste: crop patterns to a band or edge and fade them with a mask. A
full-viewport pattern at full alpha is wallpaper, not craft.
### 3.5 Image colour-wash field
Suits: Warm Craft · Coastal Premium · Modern Country · Industrial Utility (dark wash) · Luxury Noir (heavy grade) · Bold Civic (duotone)
```css
.wash {
  position: relative; overflow: hidden;
  background: var(--brand) url("/assets/images/site-work.jpg") center / cover no-repeat;
  background-blend-mode: multiply;         /* the photo inherits the brand hue */
}
/* readable-text scrim on the text side */
.wash::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgb(15 36 28 / 0.72) 0%, rgb(15 36 28 / 0.35) 55%, transparent 100%);
}
.wash > * { position: relative; z-index: 1; }
```
Alternative: skip blend-mode and layer a `::before` filled with the brand
colour at `mix-blend-mode: multiply` (or `soft-light` for a gentler grade).
Taste: verify 4.5:1 at the BUSIEST point under the text, if the photo
fights the copy, the wash is too weak, not the photo too strong.
### 3.6 Oversized typographic ghosts
Suits: Refined Editorial (numerals, quote marks) · Kinetic Sport (outline numerals) · Bold Civic (outlined statements) · Precision Engineering (mono ordinals)
```css
[data-ghost] { position: relative; overflow: hidden; }
[data-ghost]::before {
  content: attr(data-ghost);
  position: absolute; top: -0.12em; right: -0.05em; z-index: 0;
  font-family: var(--font-heading); font-weight: 700; line-height: 1;
  font-size: clamp(12rem, 34vw, 30rem);
  color: transparent; -webkit-text-stroke: 1.5px rgb(15 36 28 / 0.10);
  pointer-events: none; user-select: none;
}
[data-ghost] > * { position: relative; z-index: 1; }
```
Filled variant: `color: rgb(15 36 28 / 0.05); -webkit-text-stroke: 0;`, keep
filled ghosts at 4 to 8% alpha. Taste: one ghost per 1 to 2 sections, kept off
body-copy zones. A ghost ordinal system counts as your ONE numbered device
(hard law 3), name it in the context file.
### 3.7 Soft blob / organic accents
Suits: Soft Clinical · Warm Craft · Coastal Premium · Playful Pop (flat, unblurred, higher alpha)
```css
.blob {
  position: absolute; width: clamp(280px, 30vw, 460px); aspect-ratio: 1;
  border-radius: 62% 38% 46% 54% / 55% 47% 53% 45%;
  background: var(--brand); opacity: 0.08; filter: blur(48px);
  pointer-events: none;
}
```
Taste: 1 to 2 per viewport, anchored to a corner or edge. NEVER animate a
blurred element (paint cost). Playful Pop drops the blur and raises the
alpha instead.
### 3.8 Deco / line-work bands
Suits: Art-Deco Geometric · Heritage Trade (double-hairline frames)
```css
.band-deco {
  height: 14px;
  border-block: 1px solid rgb(194 65 12 / 0.6);
  background: repeating-linear-gradient(90deg, transparent 0 22px, rgb(194 65 12 / 0.6) 22px 23px);
}
```
Taste: strokes 1 to 2px in the accent or a metallic tone. A band marks a
section edge or frames a lockup, it never tiles a whole section.
### 3.9 Section-blend gradients (the blend zone)
Suits: every direction, the default seam tool that `layout-flow.md` calls for.
```css
/* section A hands its floor colour to section B's ceiling */
.section--blend-out { background: linear-gradient(180deg, var(--paper) 55%, var(--surface-tint) 100%); }
.section--blend-in  { background: linear-gradient(180deg, var(--surface-tint) 0%, var(--paper) 45%); }
```
Rule: the two colours at the seam must be IDENTICAL tokens, a near-match
reads as a rendering bug, not a design. Cap: **≤2 blend seams per page**, and
at least one seam per page must be structural, overlap, curve, angle cut, or
hard cut (`layout-flow.md` §3). All-gradient seams read as one long smear.
### 3.10 The flat-minimal commitment
Suits: Precision Engineering · Refined Editorial · Luxury Noir (tone-separated)

Stark flatness is allowed ONLY as a named Axis 5 decision, and it must buy
its keep, the craft that texture would have done becomes mandatory elsewhere:
- type scale ratio ≥ 1.333 with real weight contrast (§1.5);
- whitespace as the texture: section padding ≥ `clamp(96px, 12vw, 160px)`;
- ONE hairline system, used consistently, as typography, not boxes;
- ink-rich contrast (≥ 7:1) and a disciplined dominant+sharp palette;
- the signature moment carried by motion or a single ghost device.

Flat + default type + default spacing = an unstyled document, not minimalism.
### Rules footer

- Every section carries ≥ 2 visual layers (base + texture/gradient/pattern/
  image) unless flat-minimal is the NAMED commitment in the context file.
- Texture never drags text below the contrast floor (4.5:1 body / 3:1 large).
  Test at the busiest point under the type, not the average.
- Performance: pure CSS / SVG-data-URI textures only; no texture image
  downloads over 20KB; never `filter`/`backdrop-filter` on scroll-animated
  elements; grain lives on its own pseudo-element and is never animated.
- Texture layers are decoration: `pointer-events: none`, `z-index` below the
  content, and invisible to screen readers (pseudo-elements or `aria-hidden`).
