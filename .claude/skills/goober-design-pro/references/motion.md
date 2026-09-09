# Motion, one signature, orchestrated everywhere

Read this at Phase 4 (the motion pass) and at Axis 6 of strategy, when the DNA
commits its motion signature. Hard law 6 governs: transform/opacity (+
clip-path/filter for reveals), ONE easing family site-wide, reveals fire once,
`prefers-reduced-motion` always respected. Motion is the brand's physics, a
visitor can't name an easing curve, but they can feel when one hand animated
everything versus when effects were sprinkled. All vanilla CSS/JS: signature
tokens in `design-guide/tokens.json` (stitch generates `assets/css/tokens.css`
never hand-edit it), derived registers + engine CSS in
`assets/css/components.css`, scripts in `assets/js/` linked `defer` on every
page (standalone: the project's own conventions).

## 1. Motion signatures: the DNA picks one

A signature = **energy + easing family + duration band + stagger rhythm +
entrance style + hover physics**, chosen ONCE at Axis 6, written into the
design context file, applied everywhere. Mid-build improvisation ("this
section wants a bounce") is how coherence dies, change the file first or
don't change anything.

| Energy | Directions | Entrances | Easing | Stagger | Distance | Vocabulary |
|---|---|---|---|---|---|---|
| **Calm** | Luxury Noir, Refined Editorial, Soft Care, Heritage | 500 to 800ms | silk `cubic-bezier(0.25,0.46,0.45,0.94)` or slow expo-out `cubic-bezier(0.16,1,0.3,1)` | 120 to 150ms | 16 to 24px | soft rises, blur-in allowed, split-line reveals, dignified fades |
| **Assured** | Bold Civic, Coastal, Country, Precision, Art-Deco, Warm Craft | 350 to 550ms | expo-out `cubic-bezier(0.16,1,0.3,1)` | 80 to 110ms | 24 to 38px | clean rises, clip reveals, counters, underline draws |
| **Kinetic** | Sport, Industrial, Playful, Tech | 200 to 400ms | expo-out fast; spring `cubic-bezier(0.34,1.56,0.64,1)` Playful ONLY | 60 to 90ms | 32 to 48px | hard rises, skew/scale accents, marquees, magnetic CTAs |

Per-direction tuning (overrides the tier midpoint):
- **Luxury Noir**: Calm, slow end (600 to 900ms): blur-in text, parallax image drift, slow-lift + glow hover.
- **Refined Editorial**: Calm: split-line heading rises, underline-draw hovers, image ease-scale; nothing else.
- **Soft Care**: Calm: gentle fades and short rises, zero aggression, tint-deepen hovers.
- **Heritage Trade**: Calm: dignified fades, underline draws; no gimmicks, no marquee.
- **Bold Civic**: Assured: solid rises, marker-underline draws, stat counters.
- **Coastal Premium**: Assured: easy drifts, images float-settle (scale-in), gentle hero parallax.
- **Modern Country**: Assured: steady rises, counters for years/hectares; no flourish.
- **Precision**: Assured, fast edge (250 to 400ms): clip-reveals, exact staggers, counters; bounce is a firing offence.
- **Art-Deco**: Assured: line-draw frames (SVG stroke), fade-scale imagery, poised symmetry.
- **Warm Craft**: Assured, soft edge: images settle with scale; a whisper of overshoot on SMALL elements only.
- **Kinetic Sport**: Kinetic: skewed slide-ins, marquee strips, counters, quick tilt hovers.
- **Industrial**: Kinetic: hard fast rises, counters; no float, no bounce, no drift.
- **Playful Pop**: Kinetic: spring easing, subtle wiggle hovers, marquee ok; restraint IS the craft here.
- **Tech Forward**: Kinetic, smooth edge (300 to 400ms): blur-in allowed, shimmer numerals, magnetic CTA.

**Signature rules:** (1) ONE easing family site-wide, a second curve only for
exits (same family faster, or plain `ease-out`). (2) Exits run ~75% of
entrance duration, things leave faster than they arrive; the engine
implements this mechanically. (3) The **100/300/500 rule**, three duration
registers, never blurred: micro-interactions ~100 to 150ms · standard transitions
(menus, fills, accordions) ~300ms · set-piece entrances ~500ms+. Kinetic
compresses the whole ladder; the ratios hold. (4) The signature lives in
tokens, nothing hardcodes a duration or curve. Set the values ONCE from the
tier table and record them in the context file. `easing`, `duration_base`,
`stagger` and `distance` go in `design-guide/tokens.json` (`motion` block).
stitch generates `--motion-easing`, `--motion-duration`, `--motion-stagger`
and `--motion-distance` in `tokens.css`; **never hand-edit `tokens.css`**:

```json
"motion": { "easing": "cubic-bezier(0.16, 1, 0.3, 1)", "duration_base": "480ms",
            "stagger": "95ms", "distance": "32px" }
```

The DERIVED registers, standard transitions, micro-interactions, scale/blur
entrance values, are defined in `assets/css/components.css :root`, exactly:

```css
:root { --motion-standard: var(--motion-duration, 300ms); --motion-micro: 150ms; --motion-scale-from: 0.94; --motion-blur: 8px; }
```

## 2. The scroll reveal engine

One attribute-driven engine animates every below-the-fold element on every
page, never one-off keyframes per section:

- `data-anim="<variant>"`: single element, reveals once on enter.
- `data-stagger`: children cascade in once (cards get NO attribute; the parent drives).
- `data-anim-out` / `data-stagger-out`, enter AND exit; a named device for
  grids/testimonials on Assured/Kinetic (the page breathes as you scroll).
  Calm skips it, re-hiding at silk speeds reads as a glitch, not life.
  Fire-once is the default everywhere else.
- `data-count`: numbers count up (spec in §4.3).

### 2.1 Reveal safety (law)

**Content must be fully readable without JavaScript.** Hidden base states are
scoped under `html.js`, and that class is added by the FIRST statement of
`animations.js` itself, hide and reveal ship in the same file, so a blocked
or 404'd script can never strand content invisible. The CSS-only alternative
is `@media (scripting: enabled) { … }`, fine for JS-off, but it does NOT
cover the engine file failing to load, so prefer `html.js`. Reduced motion
collapses every hidden state to visible (§7). An invisible page is worse than
an unanimated one, no exceptions.

### 2.2 Engine CSS

```css
/* Hidden base states, exist ONLY while the engine runs (§2.1) */
html.js [data-anim], html.js [data-anim-out],
html.js [data-stagger] > *, html.js [data-stagger-out] > * {
  opacity: 0;
  transition: opacity calc(var(--motion-duration) * .75) var(--motion-easing),
    transform calc(var(--motion-duration) * .75) var(--motion-easing),
    filter calc(var(--motion-duration) * .75) var(--motion-easing),
    clip-path calc(var(--motion-duration) * .75) var(--motion-easing);
  transition-delay: var(--delay, 0ms); /* base = exit speed: the 75% law */
}
html.js [data-anim="fade-up"],    html.js [data-anim-out="fade-up"]    { transform: translateY(var(--motion-distance)); }
html.js [data-anim="fade-down"],  html.js [data-anim-out="fade-down"]  { transform: translateY(calc(-1 * var(--motion-distance))); }
html.js [data-anim="fade-left"],  html.js [data-anim-out="fade-left"]  { transform: translateX(calc(-1 * var(--motion-distance))); }
html.js [data-anim="fade-right"], html.js [data-anim-out="fade-right"] { transform: translateX(var(--motion-distance)); }
html.js [data-anim="scale-in"],   html.js [data-anim-out="scale-in"]   { transform: scale(var(--motion-scale-from)); }
html.js [data-anim="blur-in"] { filter: blur(var(--motion-blur)); transform: translateY(calc(var(--motion-distance) / 2)); } /* Calm; small elements only */
html.js [data-anim="clip-reveal"] { opacity: 1; clip-path: inset(0 0 100% 0); } /* opens top→down; inset(0 100% 0 0) = left→right */
html.js [data-anim="clip-reveal"] > img { transform: scale(1.08); transition: transform calc(var(--motion-duration) * 1.3) var(--motion-easing); }
html.js [data-stagger] > *, html.js [data-stagger-out] > * { transform: translateY(var(--motion-distance)); }
/* Visible state, entrances run at FULL duration */
html.js [data-anim].is-visible, html.js [data-anim-out].is-visible,
html.js [data-stagger].is-visible > *, html.js [data-stagger-out].is-visible > * {
  opacity: 1; transform: none; filter: none; transition-duration: var(--motion-duration); }
html.js [data-anim="clip-reveal"].is-visible { clip-path: inset(0 0 0 0); }
html.js [data-anim="clip-reveal"].is-visible > img { transform: none; }
/* Delay steps for header sequences, rhythm derives from the stagger token */
.d-1 { --delay: calc(var(--motion-stagger) * 1); }  .d-2 { --delay: calc(var(--motion-stagger) * 2); }
```

### 2.3 The engine: `assets/js/animations.js` (one script, defer, all pages)

```javascript
/* animations.js, the site's entire scroll-motion engine.
   <script src="/assets/js/animations.js" defer></script> on every page. */
(function () {
  'use strict';
  document.documentElement.classList.add('js'); // arms hidden states, same file reveals them
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STAGGER = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-stagger')) || 100;

  function setDelays(el, zero) {
    Array.prototype.forEach.call(el.children, function (c, i) {
      c.style.setProperty('--delay', (zero ? 0 : i * STAGGER) + 'ms');
    });
  }
  /* IN once, the default: fires, reveals, unobserves */
  var inOnce = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.hasAttribute('data-stagger')) setDelays(e.target);
      e.target.classList.add('is-visible');
      inOnce.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
  /* IN + OUT, grids/testimonials only; base CSS (75% duration) plays the exit */
  var inOut = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var out = e.target.hasAttribute('data-stagger-out');
      if (e.isIntersecting) {
        if (out) setDelays(e.target);
        e.target.classList.add('is-visible');
      } else {
        e.target.classList.remove('is-visible');
        if (out) setDelays(e.target, true);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
  document.querySelectorAll('[data-anim], [data-stagger]').forEach(function (el) { inOnce.observe(el); });
  document.querySelectorAll('[data-anim-out], [data-stagger-out]').forEach(function (el) { inOut.observe(el); });

  /* Counters, markup holds the FINAL value (no-JS safe); JS rewinds and counts */
  var counters = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counters.unobserve(e.target);
      var el = e.target, end = parseInt(el.getAttribute('data-count'), 10),
          pre = el.getAttribute('data-count-prefix') || '', suf = el.getAttribute('data-count-suffix') || '',
          dur = parseInt(el.getAttribute('data-count-duration'), 10) || 1800;
      if (reduced) { el.textContent = pre + end.toLocaleString() + suf; return; }
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
        el.textContent = pre + Math.round(eased * end).toLocaleString() + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { counters.observe(el); });
})();
```

Nav frost is owned by `components.md` §1.2, do not re-implement it here.

### 2.4 The animation map: roles, not whims

The single biggest motion tell is the **uniform reflex**: one identical
fade-up stamped on everything. Its cure is not randomness, the same ROLE
animates the same WAY on every page. Vary by role, never by whim:

| Role | Attribute | Note |
|---|---|---|
| Section kicker/label | `data-anim="fade-up"` | whispers first |
| Section `<h2>` | `data-anim="split"` + `data-split-lines` (Calm/Assured, §4.1) or `fade-up` + `.d-1` | second beat |
| Intro paragraph | `data-anim="fade-up"` + `.d-2` | third beat; reveal blocks, never individual body paragraphs |
| Card/feature grid | `data-stagger` (default) · `data-stagger-out` (Assured/Kinetic) | wrapper only, cards get nothing |
| Full-bleed image/banner | `data-anim="scale-in"` | settles, cinematic |
| Framed/inset image | `data-anim="clip-reveal"` | the premium image entrance |
| Split section, media / text | `fade-left`/`fade-right` from ITS OWN edge / `fade-up` | |
| Stats band | `scale-in` wrapper; numbers get `data-count` | |
| Testimonials | `data-stagger-out` (Assured/Kinetic) or `data-stagger` | |
| CTA band | heading `fade-up`, buttons wrapper `data-stagger` | CTAs land last, the payoff |
| Footer columns | `data-stagger`, subtle, or nothing | |
| Header/nav | **NOTHING**, chrome is instant, always | |

Reveals cause zero CLS by construction: hidden elements keep their layout box
(opacity/transform don't reflow). Cap staggered groups at ~8 children, beyond
that, group items or rise the wrapper as one.

## 3. Hero entrance orchestration

One well-orchestrated page load beats twenty scattered effects. The hero NEVER
uses the scroll engine, pure CSS keyframes (they complete even if JS dies),
starting within 100ms, finished inside 1.2s. Phase order: **background/image
settles → headline (possibly by line) → support line → CTA + proof → floating
callouts**, each phase starting while the previous is ~60% settled, expo-out
front-loads its motion, so delay steps stay short and the eye reads flow, not queue.

```css
@keyframes hero-rise   { from { opacity: .01; transform: translateY(var(--motion-distance)); } to { opacity: 1; transform: none; } }
@keyframes hero-settle { from { opacity: .01; transform: scale(1.05); } to { opacity: 1; transform: none; } }
@keyframes hero-blur   { from { opacity: .01; transform: translateY(14px); filter: blur(12px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes hero-slam   { from { opacity: .01; transform: translateY(48px) skewY(2deg); }
                         70%  { transform: translateY(-3px) skewY(-0.3deg); } to { opacity: 1; transform: none; } }
.hero [data-hero] { animation: hero-rise var(--hero-dur, calc(var(--motion-duration) * 1.15)) var(--motion-easing) both;
                    animation-delay: var(--d, 0ms); }
.hero [data-hero="settle"] { animation-name: hero-settle; } /* media/background */
.hero [data-hero="blur"]   { animation-name: hero-blur; }   /* Calm */
.hero [data-hero="slam"]   { animation-name: hero-slam; }   /* Kinetic */
/* Delay ladder Assured shown; Calm ≈ ×1.4, Kinetic ≈ ×0.65. No inline styles.
   the ladder lives in CSS. Audit: last delay + duration ≤ 1.2s. */
.hero__media   { --d: 0ms; }    .hero__kicker  { --d: 80ms; }
.hero__title   { --d: 140ms; }  /* LCP text: never later than 300ms */
.hero__lede    { --d: 280ms; }  .hero__actions { --d: 400ms; }
.hero__proof   { --d: 520ms; }  .hero__callout { --d: 640ms; } /* decorative tail, always last */
```

`data-hero` here marks entrance PHASES on hero children, it is NOT the hero
section anchor. Scripts that need the hero section itself (sticky bar,
observers) anchor on `[data-block^="hero"]`, null-guarded (`components.md` §1.6).

Distances follow the signature (Calm 16 to 24px · Assured 24 to 38px · Kinetic
32 to 48px). Per-direction flavour: **Luxury**, slow blur-in (`hero-blur`,
~800ms, ladder ×1.4) · **Editorial**, line-mask rises on the h1 (§4.1; the
engine fires on first paint for in-viewport elements) · **Kinetic**.
staggered line slams with skew settle (`hero-slam`) · **Care**, soft fades,
minimal distance. **Non-negotiables:** the header/nav never animates, chrome
is instant while the stage moves. Never delay the h1 beyond 300ms and never
hide it with `display:none`/`visibility:hidden`, keyframes start from
`opacity: .01` so the LCP element paints immediately (or animate a wrapper and
leave the h1 untouched). The visitor must never wait for the page.

## 4. Text animation

### 4.1 Split-line masked reveal (the premium heading entrance)

Wrap each RENDERED line in an overflow-hidden span; lines rise
`translateY(115%) → 0` with stagger. Use on the hero h1 + section h2s for
Calm/Assured DNAs. Plain-text headings only, a heading with nested accent
markup falls back to `data-anim="fade-up"` (whole-heading rise).

```css
html.js [data-anim="split"] { opacity: 1; transform: none; } /* the lines hide, not the heading */
.line-mask { display: inline-block; overflow: hidden; vertical-align: bottom;
             padding-block-end: .12em; margin-block-end: -.12em; } /* room for descenders */
.line { display: inline-block; transform: translateY(115%);
        transition: transform calc(var(--motion-duration) * 1.2) var(--motion-easing) var(--delay, 0ms); }
html.js [data-anim="split"].is-visible .line { transform: none; }
.hero [data-anim="split"] .line { transition-delay: calc(var(--delay, 0ms) + 140ms); } /* slot into the hero ladder */
```

```javascript
/* split-lines.js, <h2 data-anim="split" data-split-lines>…</h2>
   Lines only exist if this ran, intrinsically JS-safe. */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('[data-split-lines]');
  if (!els.length) return;
  var stagger = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-stagger')) || 100;
  function split(el) {
    var text = el.dataset.srcText || (el.dataset.srcText = el.textContent.trim());
    el.textContent = '';
    text.split(/\s+/).forEach(function (w) {  /* 1. word spans to measure wrapping */
      var s = document.createElement('span');
      s.style.display = 'inline-block'; s.textContent = w;
      el.appendChild(s); el.appendChild(document.createTextNode(' '));
    });
    var lines = [], top = null;
    Array.prototype.forEach.call(el.children, function (s) {
      if (s.offsetTop !== top) { lines.push([]); top = s.offsetTop; }
      lines[lines.length - 1].push(s.textContent);
    });
    el.textContent = '';
    lines.forEach(function (words, i) {       /* 2. rebuild as masked lines */
      var mask = document.createElement('span'), line = document.createElement('span');
      mask.className = 'line-mask'; line.className = 'line';
      line.textContent = words.join(' ');
      line.style.setProperty('--delay', Math.round(i * stagger * 1.2) + 'ms');
      mask.appendChild(line); el.appendChild(mask); el.appendChild(document.createTextNode(' '));
    });
  }
  els.forEach(split);
  var t;                                      /* 3. resize-safe re-split, debounced */
  window.addEventListener('resize', function () {
    clearTimeout(t); t = setTimeout(function () { els.forEach(split); }, 200);
  });
})();
```

### 4.2 Accent words: ONE per heading, ONE treatment per site

Named in the context file; everywhere else banned. **NEVER gradient text.**
All trigger off the containing reveal's `.is-visible`, timed to land just
after the heading settles.

```css
/* Underline draw-in */
.accent-draw { position: relative; white-space: nowrap; }
.accent-draw::after { content: ""; position: absolute; inset-inline: 0; bottom: .04em; height: .09em;
  background: var(--color-accent); transform: scaleX(0); transform-origin: left;
  transition: transform calc(var(--motion-duration) * 1.1) var(--motion-easing) calc(var(--motion-duration) * .8); }
.is-visible .accent-draw::after { transform: scaleX(1); }
/* Highlight sweep */
.accent-sweep { background: linear-gradient(0deg, color-mix(in srgb, var(--color-accent) 30%, transparent) 0 38%, transparent 38%)
  no-repeat 0 0 / 0% 100%; transition: background-size calc(var(--motion-duration) * 1.2) var(--motion-easing) calc(var(--motion-duration) * .8); }
.is-visible .accent-sweep { background-size: 100% 100%; }
/* Clip-path colour wipe, <span class="accent-wipe" data-text="coastal">coastal</span> */
.accent-wipe { position: relative; }
.accent-wipe::after { content: attr(data-text); position: absolute; inset: 0; color: var(--color-accent);
  clip-path: inset(0 100% 0 0); transition: clip-path calc(var(--motion-duration) * 1.3) var(--motion-easing) calc(var(--motion-duration) * .7); }
.is-visible .accent-wipe::after { clip-path: inset(0 0 0 0); }
/* Colour shift, the quietest option */
.accent-shift { transition: color var(--motion-standard) var(--motion-easing) calc(var(--motion-duration) * .9); }
.is-visible .accent-shift { color: var(--color-accent); }
```

### 4.3 Counters (`data-count`: engine spec in §2.3)

`<span data-count="1250" data-count-prefix="$" data-count-suffix="+">$1,250+</span>`
Markup carries the formatted FINAL value (no-JS safe); JS rewinds and counts.
Rules: 1.5 to 2s, ease-out cubic, fires at 60% visibility, once. `toLocaleString()`
supplies locale separators; count integers only (write "4.9" statically, never
animate decimals). `font-variant-numeric: tabular-nums` so width doesn't
jitter. Real numbers only (hard law 10).

### 4.4 Marquee strips (logos/keywords)

A DELIBERATE device, max one per page, named in the context file. Markup:
`.marquee > .marquee__track >` TWO identical `.marquee__group` lists, second
`aria-hidden="true"`. Speed by signature: Calm ~55s · Assured ~40s · Kinetic
~26s. Reduced motion: static row (§7).

```css
.marquee { overflow: hidden; mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); }
.marquee__track { display: flex; width: max-content; animation: marquee var(--marquee-dur, 40s) linear infinite; }
.marquee__group { display: flex; gap: 5rem; padding-right: 5rem; list-style: none; }
.marquee:hover .marquee__track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
```

### 4.5 Shimmer numerals: Tech/Sport only, named in the context file

Reads as light passing over solid ink, not gradient text, both ends ARE the text colour:

```css
.stat-shimmer { background: linear-gradient(105deg, var(--color-ink) 42%, var(--color-accent) 50%, var(--color-ink) 58%) 0 0 / 250% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmer 4s var(--motion-easing) infinite; }
@keyframes shimmer { from { background-position: 115% 0; } to { background-position: -15% 0; } }
```

## 5. Hover & micro-interaction physics

Pick ONE button system, ONE card system, ONE link system, site-wide, recorded
in the context file. Mixed hover physics is the interaction version of two
easing families.

| System | What | Signature fit |
|---|---|---|
| Lift | `translateY(-2 to -6px)` + shadow deepens | Calm ≤2px or none · Assured 3 to 4px · Kinetic 4 to 6px |
| Fill-slide | button bg slides in from left/bottom | Assured, Kinetic |
| Arrow-nudge | icon `translateX(4px)` | pairs with any button system |
| Image ease-scale | `scale(1.03 to 1.06)`, 600 to 900ms, parent `overflow: hidden` | all, slowest on Calm |
| Underline draw | `scaleX(0→1)`, origin left | Calm/Assured nav + inline links |
| Tint-deepen | surface colour deepens one step | Calm cards |
| Magnetic pull | CTA follows pointer | Kinetic/Tech ONLY, `pointer: fine` only |

```css
/* Derived hover registers, components.css :root, built from schema tokens only */
:root {
  --color-accent-deep: color-mix(in srgb, var(--color-accent) 82%, var(--color-ink));
  --surface-deep:      color-mix(in srgb, var(--color-primary) 11%, var(--color-paper));
  --shadow-lifted:     0 22px 48px -18px color-mix(in srgb, var(--color-ink) 24%, transparent);
}
/* Buttons */
.btn { transition: transform var(--motion-micro) ease-out, background-color var(--motion-micro) ease-out,
                   box-shadow var(--motion-micro) ease-out; }
.btn:hover, .btn:focus-visible { transform: translateY(-2px); }
.btn:active { transform: translateY(0) scale(.98); transition-duration: 80ms; } /* touch feedback */
.btn .icon { transition: transform var(--motion-micro) var(--motion-easing); }
.btn:hover .icon, .btn:focus-visible .icon { transform: translateX(4px); }
.btn--fill { position: relative; isolation: isolate; overflow: hidden; }
.btn--fill::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--color-accent-deep);
  transform: translateX(-101%); transition: transform var(--motion-standard) var(--motion-easing); }
.btn--fill:hover::before, .btn--fill:focus-visible::before { transform: none; }
/* Cards, clickable only: hover affordance is a click promise */
.card { transition: transform var(--motion-standard) var(--motion-easing), box-shadow var(--motion-standard) var(--motion-easing),
                    background-color var(--motion-standard) var(--motion-easing); }
.card--lift:hover, .card--lift:focus-within { transform: translateY(-4px); box-shadow: var(--shadow-lifted); }
.card--tint:hover, .card--tint:focus-within { background-color: var(--surface-deep); }
/* Images */
.media { overflow: hidden; }
.media img { transition: transform .8s var(--motion-easing); }
a:hover .media img, a:focus-visible .media img { transform: scale(1.04); }
/* Links / nav, underline draw */
.link { position: relative; }
.link::after { content: ""; position: absolute; inset-inline: 0; bottom: -3px; height: 1.5px; background: currentColor;
  transform: scaleX(0); transform-origin: left; transition: transform var(--motion-standard) var(--motion-easing); }
.link:hover::after, .link:focus-visible::after, .link[aria-current="page"]::after { transform: scaleX(1); }
```

```javascript
/* magnetic.js Kinetic/Tech CTAs only: <a class="btn" data-magnetic> */
if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach(function (el) {
    var raf;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect(),
          x = (e.clientX - r.left - r.width / 2) * 0.25, y = (e.clientY - r.top - r.height / 2) * 0.25;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      });
    });
    el.addEventListener('mouseleave', function () {
      cancelAnimationFrame(raf);
      el.style.transition = 'transform .4s cubic-bezier(0.34,1.56,0.64,1)';
      el.style.transform = '';
      setTimeout(function () { el.style.transition = ''; }, 400);
    });
  });
}
```

**Focus and touch:** every `:hover` rule pairs with `:focus-visible` at the
same intensity, plus a visible focus ring. Wrap pointer-dependent flourishes in
`@media (hover: hover)`; touch gets `:active` compression instead. Hover must
never be load-bearing, no content (menus, prices, CTAs) revealed only on
hover, because touch users never see it.

## 6. Scroll-linked effects

**Parallax, tasteful means barely.** Background/media layers move at
0.85 to 0.95 of scroll speed; max 2 parallax layers per page; NEVER parallax body
text. Size the layer ~110% inside an `overflow: hidden` parent so edges never show.

```javascript
/* parallax.js, <div class="hero__bg" data-parallax="0.9"> */
(function () {
  var els = document.querySelectorAll('[data-parallax]');
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var ratio = parseFloat(el.dataset.parallax) || 0.9;
      el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * (1 - ratio)).toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
```

CSS-only alternative where supported (skip the JS if this covers the need):

```css
@supports (animation-timeline: view()) {
  .hero__bg { animation: drift linear both; animation-timeline: view(); }
  @keyframes drift { from { transform: translateY(-5%); } to { transform: translateY(5%); } }
}
```

**Sticky-reveal section**: pinned panel while content scrolls past. ONE per
site max; Editorial/Tech DNAs only:

```css
.sticky-story { display: grid; grid-template-columns: 1fr 1fr; align-items: start; }
.sticky-story__pin { position: sticky; top: calc(var(--header-h, 72px) + 2rem); }
.sticky-story__steps > * { min-height: 60vh; display: grid; align-content: center; } /* steps carry data-anim */
```

**Reading progress bar**: blogs/long-form only, progressive enhancement:

```css
@supports (animation-timeline: scroll()) {
  .read-progress { position: fixed; inset: 0 0 auto 0; height: 3px; background: var(--color-accent);
    transform-origin: left; transform: scaleX(0); animation: readbar linear both; animation-timeline: scroll(); }
  @keyframes readbar { to { transform: scaleX(1); } }
}
```

**Video-scrub heroes** → run the `animated-website` skill for its pipeline;
this skill's DNA still governs type, colour, and restraint. For the hero
loop itself, that skill tries the Higgsfield connector first when it is
connected (the approved hero still generates a short loop that returns
cleanly to its own first frame) and falls back to the kie.ai Veo path when
it is not; see that skill for the full procedure.

## 7. Performance & accessibility gates

- **Animate `transform`/`opacity` only.** `clip-path`/`filter` are allowed on
  SMALL elements (headings, accent words, masks), never animate `filter` on
  large scroll-animated surfaces (blur on a full-bleed image tanks paint).
  Never animate `width`/`height`/`top`/`margin`/`font-size`, no
  layout-shifting animation, ever.
- **`will-change`** only on continuously-animating elements (marquee track,
  parallax layer) or added/removed around an animation, never blanket on
  every reveal (it pins compositor layers forever).
- **Mental 60fps test on a mid-range Android:** >12 elements animating in one
  frame means regroup, stagger caps at ~8, sections reveal as blocks.
- **Scroll listeners** are `passive: true` + rAF-throttled (`parallax.js` in
  §6 is the template; nav frost lives in `components.md` §1.2). Engine IO
  settings, the actual thresholds: reveals `threshold .1 / rootMargin -8%` ·
  in-out `.05 / -4%` · counters `.6`. Reveals fire once;
  `data-anim-out`/`data-stagger-out` is the sanctioned re-fire exception,
  named in the context file.
- **JS budget: ≤ ~200 lines of motion JS site-wide.** The full stack here.
  engine ~60 + split-lines ~35 + magnetic ~20 + parallax ~20 ≈ 135. If a page
  needs more, the design is wrong, not the budget.
- **Reduced motion collapses everything to visible**: include verbatim; every
  standalone script also early-returns (as above):

```css
@media (prefers-reduced-motion: reduce) {
  html.js [data-anim], html.js [data-anim-out],
  html.js [data-stagger] > *, html.js [data-stagger-out] > *,
  [data-split-lines] .line, .hero [data-hero] {
    opacity: 1 !important; transform: none !important; filter: none !important;
    clip-path: none !important; transition: none !important; animation: none !important;
  }
  .marquee__track, [data-parallax], .read-progress, .stat-shimmer { animation: none !important; }
  html { scroll-behavior: auto; }
}
```

Ship check: kill JS, every word readable? Enable reduced motion, everything
visible, nothing moving? Scroll fast on mobile, no jank, no half-revealed
strays? Then the motion pass is done.
