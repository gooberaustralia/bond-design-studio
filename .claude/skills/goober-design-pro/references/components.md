# Components, where the DNA becomes touchable

Read this at Phase 3, with the design context file open. Every recipe is a
skeleton: the context file supplies radius, colour, easing and duration.
never paste a block without tuning it to the DNA. **Goober Builder:** shared
patterns live in `assets/css/components.css`; extend the framework's `.btn`,
`.btn--primary`, `.btn--secondary`, `.btn--ghost`, `.btn--accent` and its
tokens (`--color-primary/accent/ink/paper/muted`, `--radius`, `--ease-out`,
`--focus-ring`, `--btn-lift`), never invent a parallel system beside them.
No Tailwind classes, no inline `style=""`.

**Motion-token bridge**: recipes below use `--ease-out` and the
`--motion-standard`/`--motion-micro` registers; stitch only generates
`--motion-easing/duration/stagger/distance`, so declare the bridge once:

```css
/* components.css :root, bridge stitch's motion tokens to the recipe registers */
:root { --ease-out: var(--motion-easing); --motion-standard: var(--motion-duration, 300ms); --motion-micro: 150ms; }
```

---

## 1. Headers & navigation

Highest-traffic component, first quality signal. The behaviour spec is
non-negotiable; the archetype is a DNA choice, the old single-header world
was a sameness engine.

### 1.1 Anatomy & measures

```
[ logo ]       [ nav · nav · nav ▾ · nav ]       [ 07 5555 5555 ] [ Get a Quote ]   (burger <1024px)
```

| Spec | Value |
|---|---|
| Height | 76px desktop / 64px mobile default via `--header-h*` VARIABLE per DNA: airy directions (Luxury, Editorial, Coastal) may run 88px, dense trades 68px. Offset page content by it |
| Logo | ≤40px tall (≤48px stacked), links to `/`, real `<img alt="{Business} logo">` |
| Nav | ≤5 items, 15px weight 500, gap ~2rem; active page marked via `aria-current="page"` (colour + underline, or weight, one device, consistent) |
| Phone | Local/service businesses: visible `tel:` link + icon, left of the CTA, semibold |
| CTA | ONE `.btn--accent`, clearly distinct from nav links. Never two buttons in a header |
| A11y | `<nav aria-label="Main">`; burger `<button aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">`, 44px hit area |

```css
:root { --header-h: 64px; --header-h-lg: 76px; } /* per DNA: 88 airy / 68 dense */
.site-header { position: fixed; inset: 0 0 auto; z-index: 50; transition: background var(--motion-standard) var(--ease-out), box-shadow var(--motion-standard) var(--ease-out); }
.header__inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; height: var(--header-h); }
.header__nav, .header__actions { display: none; align-items: center; }
.header__nav a, .header__phone, .header__burger { color: var(--nav-ink, var(--color-ink)); }
.header__nav a { font-size: .9375rem; font-weight: 500; }
.header__burger { display: flex; width: 44px; height: 44px; align-items: center; justify-content: center; }
@media (min-width: 1024px) { .header__inner { height: var(--header-h-lg); } .header__burger { display: none; }
  .header__nav { display: flex; gap: 2rem; } .header__actions { display: flex; gap: 1.25rem; } }
```

### 1.2 Sticky frost: the `.nav-scrolled` pattern (required)

Header starts transparent (or field-matched), gains a frosted solid after
24px. The frost field is the page's **dominant field**, not reflex-white, a
dark-first site frosts with its ink. Keep the `-webkit-` prefix wherever
`backdrop-filter` appears.

```css
.site-header.nav-scrolled { background: color-mix(in srgb, var(--color-paper) 92%, transparent);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); box-shadow: 0 1px 2px color-mix(in srgb, var(--color-ink) 8%, transparent); }
.site-header[data-on-dark]:not(.nav-scrolled) { --nav-ink: var(--color-paper); } /* light chrome over dark hero until frosted */
```

```js
const header = document.getElementById('site-header');
const frost = () => header.classList.toggle('nav-scrolled', scrollY > 24);
frost(); addEventListener('scroll', frost, { passive: true });
```

**Single source of truth:** this recipe owns nav frost, `motion.md`'s engine
does not re-implement it. One listener, one threshold (24px), defined here.

**Over-dark-hero contrast law (hard):** a transparent header over a dark or
image hero uses light logo + light links (swap logo variant or use a
currentColor SVG mark), and NEVER white text over a light hero photo. If the
hero can't guarantee contrast, start solid. Hide-on-scroll-down/reveal-on-up
is optional polish for long content sites; never hide while the drawer is open.

### 1.3 The five header archetypes (pick from the DNA, not habit)

**(a) Classic pro**: logo left · nav right · phone + CTA; the §1.1 skeleton
as-is. Suits trades, clinics, Bold Civic, Modern Country, conversion-first
local business. Default when the DNA doesn't argue otherwise.

**(b) Centre-brand**: nav split either side of a centred logo; phone/CTA far
right or in the drawer. Suits Heritage Trade, Refined Editorial, Art-Deco.
brands where the mark IS the authority.

```css
.header--centre .header__inner { display: grid; grid-template-columns: 1fr auto 1fr; }
.header--centre .header__nav--l { justify-self: end; } .header--centre .header__nav--r { justify-self: start; }
```

**(c) Editorial minimal**: wordmark + hamburger only at every width; the menu
is an oversized takeover drawer. Suits Luxury Noir, Refined Editorial,
portfolios. NOT for conversion-critical local services, hiding desktop nav
costs enquiries, so this is a deliberate, named trade.

```css
.header--minimal :is(.header__nav, .header__actions) { display: none; }
.header--minimal .header__burger { display: flex; }
.drawer--takeover .drawer__panel { width: 100vw; background: var(--color-ink); color: var(--color-paper); }
.drawer--takeover .drawer__nav a { font: 500 clamp(2rem, 6vw, 3.25rem)/1.3 var(--font-heading); }
```

**(d) Utility bar + nav**: a 38px microbar above the main nav: `display:flex;
justify-content:space-between` on the ink field, `.85rem`, holding hours ·
service area · phone. Suits Industrial Utility, emergency trades, Heritage.
The bar carries facts, the "24/7" or "Servicing all Gold Coast" callout lives
here, never a second CTA. Collapse to phone-only on mobile; add its height to
the fixed offset.

**(e) Pill / floating nav**: a detached rounded bar floating over the hero.
Suits Coastal Premium, Tech Forward, Playful Pop. The pill IS the frost, it
deepens on scroll instead of gaining a bar-wide background.

```css
.header--pill { position: fixed; top: 14px; left: 50%; translate: -50% 0; z-index: 50;
  width: min(100% - 2rem, 1080px); border-radius: 999px; padding-inline: 1.5rem;
  background: color-mix(in srgb, var(--color-paper) 72%, transparent); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  box-shadow: 0 8px 30px -12px color-mix(in srgb, var(--color-ink) 25%, transparent); }
.header--pill.nav-scrolled { background: color-mix(in srgb, var(--color-paper) 94%, transparent); }
```

### 1.4 Mobile drawer (<1024px): full spec

Slide-in from the right (takeover for bold/editorial DNAs). Markup:
`.drawer#mobile-menu[data-open="false" aria-hidden="true"]` wrapping
`.drawer__backdrop` + `.drawer__panel[role="dialog" aria-modal="true"
aria-label="Menu"]`. Panel order: logo + close row (`.drawer__close`,
`aria-label="Close menu"`) → `.drawer__nav` links (≥44px rows, 18px semibold)
→ full-width `.btn--accent .btn--block` CTA → contact block (`tel:` with the
real number PROMINENT, `mailto:`, hours) → socials. Laws: body scroll locks
while open; focus moves in, is trapped, and returns to the burger on close;
`Escape`, backdrop, X and any link tap all close; `aria-expanded`/
`aria-controls` stay synced; bottom padding respects
`env(safe-area-inset-bottom)`; item entrance staggers per the DNA's motion
signature (`motion.md`).

```css
.drawer { position: fixed; inset: 0; z-index: 60; pointer-events: none; }
.drawer__backdrop { position: absolute; inset: 0; opacity: 0; background: color-mix(in srgb, var(--color-ink) 45%, transparent); transition: opacity var(--motion-standard) var(--ease-out); }
.drawer__panel { position: absolute; top: 0; right: 0; height: 100dvh; width: min(86vw, 380px); display: flex; flex-direction: column; gap: 1.5rem;
  overflow-y: auto; overscroll-behavior: contain; background: var(--color-paper); transform: translateX(100%);
  transition: transform var(--motion-standard) var(--ease-out); padding: 1.25rem 1.5rem max(1.5rem, env(safe-area-inset-bottom)); }
.drawer[data-open="true"] { pointer-events: auto; }
.drawer[data-open="true"] .drawer__backdrop { opacity: 1; }
.drawer[data-open="true"] .drawer__panel { transform: none; }
.drawer__nav a { display: block; padding: .875rem 0; font-size: 1.125rem; font-weight: 600; color: var(--color-ink);
  opacity: 0; translate: 14px 0; transition: opacity var(--motion-standard) var(--ease-out), translate var(--motion-standard) var(--ease-out); }
.drawer[data-open="true"] .drawer__nav a { opacity: 1; translate: 0 0; }
.drawer[data-open="true"] .drawer__nav a:nth-child(2) { transition-delay: 50ms; } /* +50ms per item: (3) 100ms, (n+4) 150ms */
@media (prefers-reduced-motion: reduce) { .drawer__panel, .drawer__nav a { transition: none; } }
```

```js
const burger = document.getElementById('menu-toggle'), drawer = document.getElementById('mobile-menu');
const panel = drawer.querySelector('.drawer__panel');
const focusables = () => panel.querySelectorAll('a[href], button:not([disabled])');
function setMenu(open) {
  burger.setAttribute('aria-expanded', open);
  drawer.dataset.open = open; drawer.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
  document.getElementById('sticky-bar')?.classList.toggle('sticky-bar--suppressed', open);
  open ? focusables()[0]?.focus() : burger.focus();     // focus in on open, back on close
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
drawer.addEventListener('click', e => { if (e.target.closest('.drawer__backdrop, .drawer__close, a[href]')) setMenu(false); });
addEventListener('keydown', e => {
  if (drawer.dataset.open !== 'true') return;
  if (e.key === 'Escape') return setMenu(false);
  if (e.key !== 'Tab') return;                          // focus trap
  const f = focusables(), first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
});
```

### 1.5 Dropdowns (desktop)

One level max, deeper hierarchy belongs on landing pages. Trigger is a real
`<button>` + chevron with `aria-expanded`/`aria-controls`; opens on hover AND
click (touch parity), closes on outside click and `Escape`; keyboard users Tab
through panel links. The classic bug, cursor falls through the gap between
trigger and panel, is fixed by making the gap part of the panel (transparent
`padding-top`), never a margin.

```css
.nav-item { position: relative; }
.nav-item__menu { position: absolute; top: 100%; left: 0; min-width: 240px; padding-top: 10px; /* hover bridge */
  opacity: 0; translate: 0 6px; visibility: hidden; transition: opacity var(--motion-micro) var(--ease-out), translate var(--motion-micro) var(--ease-out), visibility var(--motion-micro); }
.nav-item:hover > .nav-item__menu, .nav-item:focus-within > .nav-item__menu,
.nav-item[data-open="true"] > .nav-item__menu { opacity: 1; translate: 0 0; visibility: visible; }
.nav-item__panel { display: grid; gap: 2px; padding: .5rem; background: var(--color-paper); border-radius: calc(var(--radius) * 1.5);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--color-ink) 8%, transparent), 0 16px 40px -16px color-mix(in srgb, var(--color-ink) 22%, transparent); }
.nav-item__panel a { padding: .625rem .75rem; border-radius: var(--radius); }
.nav-item__panel a:hover { background: color-mix(in srgb, var(--color-ink) 5%, transparent); }
```

```js
const closeAll = () => document.querySelectorAll('.nav-item[data-open="true"]').forEach(i => {
  i.dataset.open = 'false'; i.querySelector('.nav-item__trigger').setAttribute('aria-expanded', 'false'); });
document.querySelectorAll('.nav-item__trigger').forEach(t => t.addEventListener('click', () => {
  const item = t.closest('.nav-item'), open = item.dataset.open === 'true';
  closeAll(); item.dataset.open = String(!open); t.setAttribute('aria-expanded', String(!open));
}));
addEventListener('click', e => { if (!e.target.closest('.nav-item')) closeAll(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
```

### 1.6 Sticky mobile call/quote bar: default ON for local businesses

Two actions only: **Call = filled** (accent), **Quote = ghost**. Shows after
the hero leaves the viewport (never on load, it must not cover hero content);
hides while the footer is visible or the drawer is open. Give the last section
bottom padding so the bar covers nothing. One floating element per page, this
bar OR a chat bubble OR back-to-top, never a corner of widgets.

```css
.sticky-bar { position: fixed; inset: auto 0 0; z-index: 40; display: flex; gap: .75rem;
  padding: .625rem 1rem max(.625rem, env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--color-paper) 94%, transparent); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  border-top: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent); transform: translateY(100%); transition: transform var(--motion-standard) var(--ease-out); }
.sticky-bar--on:not(.sticky-bar--suppressed) { transform: none; }
.sticky-bar .btn { flex: 1; }
@media (min-width: 1024px) { .sticky-bar { display: none; } }
```

```js
const bar = document.getElementById('sticky-bar');
// The substrate's real hero anchor is <section data-block="hero…">;
// [data-hero] is only an optional standalone override. Null-guard both.
// a page with no hero (e.g. /thank-you/) keeps the bar hidden, gracefully.
const hero = document.querySelector('[data-block^="hero"]') || document.querySelector('[data-hero]');
const footer = document.querySelector('.site-footer');
if (bar && hero) {
  let pastHero = false, footerSeen = false;
  const sync = () => bar.classList.toggle('sticky-bar--on', pastHero && !footerSeen);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }).observe(hero);
  if (footer) new IntersectionObserver(([e]) => { footerSeen = e.isIntersecting; sync(); }).observe(footer);
}
```

### 1.7 Nav cognitive rules

≤5 top-level items + 1 CTA (demote the rest to footer/landing pages) · one
dropdown level max · active page always marked · the CTA never dresses like a
nav link · no hamburger on desktop for standard business sites (archetype (c)
is the named exception) · menus that don't close on link tap, don't lock
scroll, or lack an X are bugs, not styles.

---

## 2. Buttons

Extend the framework `.btn`, restyle its variables per DNA, never fork it.
Min-heights 40/48/56px (`--sm`/default/`--lg`) with a **44px touch floor**:
don't use `--sm` for primary actions on touch layouts. Radius follows the
shape language (pill / soft / sharp ONE family site-wide). Full-width mobile
= `.btn--block`. Icons in buttons: 16 to 20px, gap 8 to 10px, `currentColor`, arrow
nudges on hover. Pressed = return to rest (`translateY(0)` / `scale(.98)`).
Focus ring recipe (reads on any field): `:focus-visible { box-shadow: 0 0 0
2px var(--color-paper), 0 0 0 5px color-mix(in srgb, var(--color-accent) 55%,
transparent); }`. **Subordination law:** secondary/ghost is clearly quieter.
never two filled buttons side by side; a hero pairs one filled + one ghost.

**Hover physics, pick ONE pair site-wide from the motion signature:**

| Pair | Feel | Suits |
|---|---|---|
| Lift + shadow (`translateY(-2px)` + `--btn-lift`) | assured | Bold Civic, Coastal, trades |
| Brightness / tint-deepen (no movement) | calm | Care, Heritage, Editorial |
| Slide-fill (a field wipes across) | crafted | Editorial, Deco, Kinetic |
| Arrow-nudge (icon moves, button barely) | luxury | Luxury Noir, minimal |

```css
.btn--fill { position: relative; isolation: isolate; overflow: hidden; }  /* slide-fill, reusable */
.btn--fill::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--color-ink);
  transform: scaleX(0); transform-origin: left; transition: transform var(--motion-standard) var(--ease-out); }
.btn--fill:hover::before { transform: scaleX(1); }
.btn--fill:hover { color: var(--color-paper); }
```

Two DNA sets, same skeleton, opposite worlds, the range one `.btn` system
must cover:

```css
/* Luxury Noir, sharp, spaced caps, brass; arrow-nudge physics */
.btn { border-radius: 2px; font-weight: 500; font-size: .8125rem; letter-spacing: .09em; text-transform: uppercase; }
.btn--primary { background: var(--color-accent); color: #17130E; border-color: var(--color-accent); }
.btn--primary:hover { filter: brightness(1.07); box-shadow: 0 14px 40px -14px color-mix(in srgb, var(--color-accent) 60%, transparent); }
.btn--ghost { color: var(--color-paper); border-color: color-mix(in srgb, var(--color-paper) 35%, transparent); }
.btn--ghost:hover { border-color: var(--color-accent); color: var(--color-accent); }
.btn .icon { width: 18px; transition: translate .4s var(--ease-out); }
.btn:hover .icon { translate: 5px 0; }
```

```css
/* Bold Civic, chunky, sentence case, snappy lift */
.btn { border-radius: 10px; font-weight: 700; letter-spacing: 0; text-transform: none; }
.btn--primary { background: var(--color-accent); color: #fff; border-color: var(--color-accent);
  box-shadow: 0 2px 0 color-mix(in srgb, var(--color-ink) 30%, var(--color-accent)); }
.btn--primary:hover { transform: translateY(-2px); box-shadow: var(--btn-lift); }
.btn--primary:active { transform: none; box-shadow: 0 1px 0 color-mix(in srgb, var(--color-ink) 30%, var(--color-accent)); }
.btn--secondary { color: var(--color-primary); border-color: color-mix(in srgb, var(--color-primary) 40%, transparent); }
```

---

## 3. Cards: kill the border-box default

`border: 1px solid` around a grid of white boxes is the #1 slop tell. Pick the
treatment from the DNA's shape/texture axes; a hairline-outlined card is
allowed ONLY when the context file names hairlines as a voice device.

**(a) Elevation card**: borderless, layered shadows (2 to 3 stacked read as real
light; one big blur reads as sticker), hover lift. When: paper/soft-shadow
DNAs Civic, Coastal, Care, Tech.

```css
.card-elev { background: var(--color-paper); border-radius: calc(var(--radius) * 1.5); padding: 1.75rem;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--color-ink) 6%, transparent), 0 10px 28px -14px color-mix(in srgb, var(--color-ink) 16%, transparent);
  transition: transform var(--motion-standard) var(--ease-out), box-shadow var(--motion-standard) var(--ease-out); }
.card-elev:hover { transform: translateY(-4px);
  box-shadow: 0 2px 4px color-mix(in srgb, var(--color-ink) 6%, transparent), 0 22px 48px -18px color-mix(in srgb, var(--color-ink) 24%, transparent); }
```

**(b) Tinted-field card**: bg = the palette's surface tint, no border, no
shadow; hover deepens the tint. It must step visibly off the section field (on
a tinted section, deepen or swap hue). When: Warm Craft, Care, Editorial light.

```css
:root { --surface-tint: color-mix(in srgb, var(--color-primary) 6%, var(--color-paper)); }
.card-tint { background: var(--surface-tint); border-radius: calc(var(--radius) * 1.5); padding: 1.75rem; transition: background var(--motion-standard) var(--ease-out); }
.card-tint:hover { background: color-mix(in srgb, var(--color-primary) 11%, var(--color-paper)); }
```

**(c) Borderless gap grid**: no card chrome: content on the section field,
separated by generous gap + strict internal alignment; hover reveals a soft
field behind (negative margin keeps edges aligned). When: Precision,
Editorial, minimal, whitespace-as-texture DNAs.

```css
.grid-open { display: grid; gap: clamp(2rem, 5vw, 3.5rem); }
.grid-open > * { padding: 1.25rem; margin: -1.25rem; border-radius: var(--radius); transition: background var(--motion-standard) var(--ease-out); }
.grid-open > *:hover { background: color-mix(in srgb, var(--color-ink) 4%, transparent); }
```

**(d) Image-led card**: image top, masked per the shape language (arch,
rounded-XL, angled clip), content below; the WHOLE card is clickable via a
stretched link with a visible focus ring on the card. When: services with real
photography, portfolios, Coastal/Country.

```html
<article class="card-img">
  <div class="card-img__media"><img src="…" alt="Re-roofed Queenslander in Palm Beach" loading="lazy"></div>
  <h3><a href="/services/roofing/">Roof restorations</a></h3><p>Tile, metal and heritage roofs.</p>
</article>
```

```css
.card-img { position: relative; display: grid; gap: .625rem; }
.card-img__media { overflow: hidden; border-radius: calc(var(--radius) * 2); /* or the DNA's arch/clip mask */ }
.card-img img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; transition: scale .5s var(--ease-out); }
.card-img h3 a { color: inherit; }
.card-img h3 a::after { content: ""; position: absolute; inset: 0; }  /* whole card clickable */
.card-img:hover img { scale: 1.04; }
.card-img:focus-within { box-shadow: var(--focus-ring); border-radius: var(--radius); }
.card-img h3 a:focus-visible { outline: none; box-shadow: none; }     /* ring lives on the card */
```

**(e) Index / editorial row**: numbered or ruled rows; the hairline sits
BETWEEN rows only (a named voice device), never boxing them; hover indents the
title. When: Editorial, Luxury, Precision service lists.

```css
.index-rows > * { display: grid; grid-template-columns: 3.5rem 1fr auto; gap: 1.5rem; align-items: baseline; padding-block: 1.5rem; }
.index-rows > * + * { border-top: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent); }
.index-rows__n { font: 500 .875rem/1 var(--font-heading); color: var(--color-muted); }
.index-rows h3 { transition: translate var(--motion-standard) var(--ease-out); }
.index-rows > *:hover h3 { translate: 10px 0; }
```

### Card grids & their alternatives

One grid style per page. Equal heights via grid stretch, never JS. Gap rhythm
follows the DNA's density: airy `clamp(1.5rem, 3vw, 2.5rem)`, dense `1.25rem`.

```css
.cards { display: grid; gap: clamp(1.25rem, 3vw, 2rem); align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); }  /* 1→2→3 col; 240px min for 4-col */
```

When a grid is the lazy answer: **staggered offset**, 2-col with
`.cards--stagger > *:nth-child(even) { translate: 0 3rem; }` on desktop, one
per page · **horizontal scroll strip** for 5+ peers (give it `tabindex="0"
role="region" aria-label="…"` so keyboards can scroll it):

```css
.strip { display: grid; grid-auto-flow: column; grid-auto-columns: min(78vw, 340px); gap: 1.25rem;
  overflow-x: auto; scroll-snap-type: x mandatory; padding: .5rem var(--container-pad);
  mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent); }  /* fade edges */
.strip > * { scroll-snap-align: start; }
```

---

## 4. Icons

Inline SVG only Lucide-style geometry, ONE stroke weight site-wide (1.5px
refined / 2px sturdy, from the DNA), `currentColor`, 20/24px grid,
`aria-hidden="true"` (the label lives in the adjacent text).
`.icon { width: 20px; height: 20px; flex: none; }`

**Container treatments follow the shape language**: the tinted-circle grid is
banned as a default. Choose:

```css
.feat__icon { color: var(--color-accent); }                     /* bare accent icon, minimal/editorial */
.feat__tile { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px;
  background: var(--surface-tint); color: var(--color-primary); }   /* soft-square tile, civic/tech/care */
.feat__arch { display: grid; place-items: center; width: 48px; height: 56px;   /* shape-motif container, */
  border-radius: 999px 999px var(--radius) var(--radius);           /* arch shown; blob/angled per DNA */
  background: var(--surface-tint); color: var(--color-primary); }
.card--ghost-icon { position: relative; overflow: hidden; }        /* oversized ghost icon as corner art */
.card--ghost-icon .icon-ghost { position: absolute; right: -18px; bottom: -18px; width: 110px; height: 110px;
  color: color-mix(in srgb, var(--color-primary) 8%, transparent); pointer-events: none; }
```

**Feature-list alternatives to the icon-grid reflex:** stat-led cards (the
numeral is the graphic, `--font-heading`, oversized, real numbers) · numbered
editorial list (§3e with the number as the device) · photo-tile features (a
small masked photo where the icon would sit, real work beats pictograms).

Copy-paste set (24 grid; set `stroke-width` to the site's weight):

```html
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><!-- check -->
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg><!-- arrow-right -->
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><!-- phone -->
<svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><!-- star (filled, ratings) -->
```

### Icon and illustration sources

All the libraries below allow commercial client use with no visible attribution unless noted.

| Library | Coverage | Licence | Note |
|---|---|---|---|
| Lucide | ~1,500 icons, outline, 24 grid, 2px | ISC | shadcn/ui default |
| Phosphor | 9,000+ icons, 6 weights | MIT | pick one weight |
| Tabler | 6,100+ icons, outline and filled, 2px | MIT | widest coverage |
| Heroicons | 24, 20 and 16px sets | MIT | limited coverage |
| Material Symbols | full set | Apache 2.0 | reads as Google, product UI only |
| Noun Project | full set | attribution required unless paid | avoid on client sites |

Pairing: Lucide for Tailwind/shadcn builds, Phosphor for fills/duotone states, Tabler when coverage runs out. The chosen family and weight go in the design context file; every icon comes from it or the custom sprite drawn to match.

Illustration sources, when a client needs people or scene illustrations rather than icons:

| Source | Licence | Note |
|---|---|---|
| unDraw | custom, open | no attribution |
| Open Peeps / Humaaans | CC0 | hand-drawn/flat, mix and match people |
| Blush | custom | free tier is PNG only |
| Storyset | attribution required on the free tier | credit linked, or don't use |
| Icons8 Ouch | attribution required on the free tier | credit linked, or don't use |

Recolour note: recolour illustrations in the file, never with CSS filters (`hue-rotate` shifts skin tones and reads as broken). For unDraw, pick the accent hex on undraw.co before download (the default is `#6c63ff`); for files already downloaded, replace fills directly, for example `sed -i '' 's/#6[cC]63[fF][fF]/#B8845A/g' assets/images/illustrations/*.svg` (macOS; drop the `''` on Linux). Every remaining hex in an illustration must be a palette token or a derived neutral. Inline the SVG (or use `<img>` with `width`, `height` and `alt=""` when decorative), under 40KB.

---

## 5. Forms

**Field economy is the conversion lever.** Lead-gen: ≤4 fields, the
canonical set the wired backend reads: name, email, phone (optional),
message, ask the rest on the phone. Single column always; only first/last
name may pair. Inputs
52px tall, 16px text (stops iOS zoom), **visible labels above fields**.
placeholders are examples, never labels. Correct `type` + `autocomplete` +
`inputmode` per field (`tel`/`email` keyboards). 5+ questions → multi-step:
progress bar, contact details LAST, auto-advance on single-choice taps.

```html
<form class="form" action="/api/enquiry" method="POST" novalidate>
  <div class="field"><label for="f-name">Full name</label>
    <input id="f-name" name="name" type="text" required autocomplete="name" placeholder="Jane Smith"
           aria-describedby="f-name-err" data-error="Enter your name so we know who to ask for">
    <p class="field__error" id="f-name-err" role="alert"></p></div>
  <div class="field"><label for="f-email">Email</label>
    <input id="f-email" name="email" type="email" required autocomplete="email" inputmode="email" placeholder="jane@example.com"
           aria-describedby="f-email-err" data-error="Enter the email you want our reply sent to">
    <p class="field__error" id="f-email-err" role="alert"></p></div>
  <div class="field"><label for="f-phone">Phone (optional)</label>
    <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="0400 000 000"
           aria-describedby="f-phone-err">
    <p class="field__error" id="f-phone-err" role="alert"></p></div>
  <div class="field"><label for="f-message">What do you need?</label>
    <textarea id="f-message" name="message" rows="4" required placeholder="e.g. Re-roof a two-storey Queenslander in Palm Beach"
           aria-describedby="f-message-err" data-error="One line about the job helps us reply faster"></textarea>
    <p class="field__error" id="f-message-err" role="alert"></p></div>
  <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
  <input type="hidden" name="_started">
  <button class="btn btn--accent btn--lg btn--block" type="submit">Get My Free Quote</button>
  <p class="form__note">No spam, no obligation. We reply within one business day.</p>
</form>
```

These four `name`s are canonical: **`api/enquiry.js` reads ONLY `name`,
`email`, `phone`, `message`**, any other field posts fine but never reaches
the enquiry email. A service `<select name="service">` (real first option,
same `.field` pattern) is good UX, but fold its value into `message` on
submit (`message.value = '[' + service.value + '] ' + message.value`) or
consciously extend `api/enquiry.js`, a field the endpoint ignores is
silently lost data.

**Goober Builder:** keep `action="/api/enquiry" method="POST"` + hidden
`_gotcha`, the platform handles delivery and redirects to `/thank-you/`
(build that page as the success card). The JS below is enhancement, not
transport.

```css
.field { display: grid; gap: .4rem; margin-bottom: 1.25rem; }
.field label { font-size: .9rem; font-weight: 600; color: var(--color-ink); }
.field :is(input, select, textarea) { width: 100%; min-height: 52px; padding: 0 1rem; font-size: 1rem;
  color: var(--color-ink); background: var(--color-paper); border-radius: var(--radius);
  border: 1px solid color-mix(in srgb, var(--color-ink) 20%, transparent); }
.field :is(input, select, textarea):focus-visible { outline: none; border-color: var(--color-primary); box-shadow: var(--focus-ring); }
.field__error { display: none; font-size: .85rem; color: #B3261E; }
.field[data-invalid] :is(input, select, textarea) { border-color: #B3261E; }
.field[data-invalid] .field__error { display: block; }
.hp { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.form__note { font-size: .875rem; color: var(--color-muted); text-align: center; margin-top: .75rem; }
```

Validate on **blur**, never per keystroke; re-check on input only after a
field has erred; on submit, focus the first invalid field. Errors are specific
("Enter a number we can reach you on", not "Invalid input"), tied via
`aria-describedby`. Spam: honeypot + time-trap (drop < 3s submissions), no
visible CAPTCHA on lead forms.

```js
const form = document.querySelector('.form');
form.elements._started.value = Date.now();
const inputs = [...form.querySelectorAll('.field :is(input, select, textarea)')];
const check = el => { const f = el.closest('.field'), bad = !el.checkValidity();
  f.toggleAttribute('data-invalid', bad); el.setAttribute('aria-invalid', bad);
  f.querySelector('.field__error').textContent = bad ? (el.dataset.error || 'Please complete this field') : '';
  return !bad; };
inputs.forEach(el => { el.addEventListener('blur', () => check(el)); el.addEventListener('input',
  () => el.closest('.field').hasAttribute('data-invalid') && check(el)); });
form.addEventListener('submit', e => {
  const bad = inputs.filter(el => !check(el));
  if (bad.length) { e.preventDefault(); return bad[0].focus(); }
  if (form.elements._gotcha.value || Date.now() - +form.elements._started.value < 3000) return e.preventDefault();
  const b = form.querySelector('[type="submit"]'); b.disabled = true; b.textContent = 'Sending…';
});
```

Success is a **card, never an alert**: tick icon, "Thanks {name}, we'll call
you within 2 hours", plus an impatience escape ("In a hurry? Call
07 5555 5555"). Failure keeps every entered value and offers the phone number.

**Styling per DNA**: input radius/border follow the shape language, focus
ring from tokens. Editorial/Luxury → underline-only; Care/Coastal → filled soft:

```css
.form--underline .field :is(input, select, textarea) { border: 0; border-radius: 0; padding-inline: 0;
  background: transparent; border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 30%, transparent); }
.form--underline .field :is(input, select, textarea):focus-visible { box-shadow: 0 2px 0 var(--color-accent); border-bottom-color: var(--color-accent); }
.form--filled .field :is(input, select, textarea) { border: 0; border-radius: 14px; background: var(--surface-tint); }
.form--filled .field :is(input, select, textarea):focus-visible { background: var(--color-paper); box-shadow: var(--focus-ring); }
```

---

## 6. Footers

The footer is a SECTION, it gets the DNA treatment like every other section,
never a grey afterthought. Anatomy: **brand column** (logo, ONE-line
positioning, socials) · **nav columns** (≤3, sitemap, not a link dump) ·
**contact column** (NAP matching the Google Business Profile **character for
character**, clickable `tel:`/`mailto:`, hours) · **legal row** (ABN, privacy
link, © year).

```css
.site-footer { position: relative; overflow: hidden; }
.footer__grid { display: grid; gap: 2.5rem; padding-block: 4.5rem 3rem; grid-template-columns: 1.4fr repeat(3, 1fr); }
.footer__legal { display: flex; flex-wrap: wrap; gap: 1rem 2rem; padding-block: 1.5rem; font-size: .85rem;
  border-top: 1px solid color-mix(in srgb, currentColor 15%, transparent); }
@media (max-width: 860px) { .footer__grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .footer__grid { grid-template-columns: 1fr; gap: 2rem; }
  .footer__grid a { display: inline-block; padding-block: .5rem; } }  /* 44px targets when stacked */
```

Treatments (pick per DNA): **dark field + texture**, brand-tinted ink
carrying the site's grain/gradient system · **tinted field + ghost wordmark**
oversized brand name as background art (markup gets `aria-hidden="true"`) ·
**editorial ruled columns**: light field, hairline top rule per column (a
named voice device), generous type.

```css
.footer__ghost { position: absolute; inset: auto 0 -.14em; text-align: center; pointer-events: none; user-select: none;
  font: 700 clamp(5rem, 17vw, 14rem)/1 var(--font-heading); color: color-mix(in srgb, var(--color-ink) 5%, transparent); }
```

**Pre-footer CTA band pairing:** every page ends with the ask, and the band
must contrast the footer, accent/colour-committed band into a dark footer,
dark band into a light footer; never two same-value dark fields butt-jointed
(sharing a field needs a texture shift or hairline between). Band = h2
restating the outcome + ONE primary CTA + reassurance microline. Mobile:
stacked columns (accordion via `<details>` only when 3 nav columns genuinely
crowd), and bottom padding for the sticky bar (§1.6).

---

## 7. Trust & proof elements

**Honesty law: real numbers, real reviews, real badges, unknown values ship
as `<!-- TODO: real count -->` placeholders, never inventions.**

```css
.review-pill { display: inline-flex; align-items: center; gap: .5rem; min-height: 44px; padding: .375rem 1rem;
  border-radius: 999px; font-size: .9rem; font-weight: 600; background: color-mix(in srgb, var(--color-ink) 6%, transparent); }
.review-pill .icon { width: 15px; height: 15px; color: #E9A13B; }  /* stars stay star-coloured */
.badge-row { display: flex; flex-wrap: wrap; align-items: center; gap: 2rem; }
.badge-row :is(img, svg) { height: 32px; width: auto; opacity: .75; filter: grayscale(1); }  /* mono treatment */
.stat-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 2rem; }
.stat-strip strong { display: block; font: 700 clamp(2.25rem, 5vw, 3.5rem)/1 var(--font-heading); }
.stat-strip span { font-size: .9rem; color: var(--color-muted); }
.logo-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 2.5rem; }
.logo-strip img { height: 28px; width: auto; filter: grayscale(1); opacity: .65; }
```

Placement: one trust element in the first viewport (review pill in/under the
hero, "4.9 from 180 Google reviews" beats "highly rated") and before every
major ask; licence/insurance badges beside forms and pricing, where doubt
peaks. Stat strips: 3 to 4 numerals with labels, count-up wired per `motion.md`
(fires once, respects reduced-motion). Testimonials ONE pattern per page:
single spotlight quote with an oversized glyph (`::before { content: "\201C";
font: 700 6rem/0 var(--font-heading); color: color-mix(in srgb,
var(--color-accent) 30%, transparent); }`) · 2-col cards styled per §3 · the
§3 scroll strip for 5+. Logo strips introduce themselves ("Trusted by" /
"As seen in"), greyscale, one consistent height.
