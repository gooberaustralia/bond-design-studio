# Bond Design Studio — Website Project

## Claude Code skills (shipped with this project)
These folders are **in the repo** under `.claude/skills/`. Goober copies them from the app when the project is scaffolded or **project docs are regenerated** — you do **not** need to install them from the Skills gallery for baseline UI/UX guidance.

| Skill | SKILL.md |
|-------|----------|
| `animated-website` | `.claude/skills/animated-website/SKILL.md` |
| `banner-design` | `.claude/skills/banner-design/SKILL.md` |
| `brand` | `.claude/skills/brand/SKILL.md` |
| `design` | `.claude/skills/design/SKILL.md` |
| `design-system` | `.claude/skills/design-system/SKILL.md` |
| `goober-content-writing` | `.claude/skills/goober-content-writing/SKILL.md` |
| `goober-design-pro` | `.claude/skills/goober-design-pro/SKILL.md` |
| `goober-llm-seo` | `.claude/skills/goober-llm-seo/SKILL.md` |
| `slides` | `.claude/skills/slides/SKILL.md` |
| `ui-styling` | `.claude/skills/ui-styling/SKILL.md` |
| `ui-ux-pro-max` | `.claude/skills/ui-ux-pro-max/SKILL.md` |

## Claude Code skills (this machine — optional extras)
Additional skills installed under `~/.claude/skills/`. Use when they match the task.

| Skill | SKILL.md path |
|-------|---------------|
| `cinematic-scroll-hero` | `~/.claude/skills/cinematic-scroll-hero/SKILL.md` |
| `goober-site-scaffold` | `~/.claude/skills/goober-site-scaffold/SKILL.md` |
| `goober-web-design` | `~/.claude/skills/goober-web-design/SKILL.md` |
| `llm-seo` | `~/.claude/skills/llm-seo/SKILL.md` |

**How to use:** **Initial full-site build (wizard / empty pages):** mandatory — read **goober-design-pro** (governing design system, rules win) and **goober-content-writing** `SKILL.md` in full, derive + save the design context, then use **21st.dev** MCP (when installed) before implementing nav, hero, feature grids, and service/marketing sections (see workflow below). **Google Stitch** MCP: use **when installed and helpful** for UI/design work. **Later:** small copy or single-line fixes can skip MCP/skill; **new pages, redesigns, or multi-section UI** still follow the workflow.

## Build focus (wizard)
- UI/UX polish: spacing, visual hierarchy, responsive layout, and accessibility (WCAG-minded).
- Performance: image weight, lazy loading, and Core Web Vitals-friendly structure.
- SEO: unique titles and meta descriptions per page, semantic HTML, crawlable content.
- Brand consistency: colors, typography, and tone match project.json / CLAUDE.md.

## How to build this site (design quality is the product)

You are this client's **in-house website designer**. The bar is **high-end agency quality** — a committed, business-derived design DNA, real visual hierarchy, distinctive (not templated) sections, depth (layered backgrounds, imagery, orchestrated motion), and copy that flows. Your standing design system is the **goober-design-pro** skill (`.claude/skills/goober-design-pro/SKILL.md`) — read it first and follow its seven-phase process; its rules override this file when they conflict. The scaffolded pages and partials are placeholder-grade structure, **not a design** — never ship them as-is. Treat every build like it goes to a paying client tomorrow.

### A. Initial full-site build (mandatory order — HOME PAGE FIRST)
Use this on the **first run** (creating pages from the scaffold). Do these **in order**:

1. **Read the skills chosen for this build IN FULL before writing any markup.** They are listed under **Skills for this build** below (in `.claude/skills/`). **`goober-design-pro` is the GOVERNING design system for this build — read `.claude/skills/goober-design-pro/SKILL.md` in full and treat its rules as overriding anything in this file when they conflict**; `goober-content-writing` governs all copy. After reading, output one line per skill — `✓ read <skill>: <its core rule in your words>` — BEFORE your first page edit. No line, no build. If a path is missing, say so once and continue.
2. **Derive the Design DNA, then lock it (goober-design-pro Phases 0–2).** Work through `references/design-strategy.md` (character direction, typography, colour system, shape, texture, motion signature, imagery art direction, layout attitude + the deviation rule and signature moment), then **write `design-guide/current.md` (the full design context) and `design-guide/tokens.json` BEFORE any markup**. Run `node tools/stitch.js` so `assets/css/tokens.css` regenerates from tokens.json. Baseline: `node tools/stitch.js --checkpoint baseline`.
3. **Source imagery BEFORE building (no flat-colour-only pages).** Follow `goober-design-pro/references/imagery.md`: inventory `assets/images/`, then generate what's missing with the shared art-direction prompt prefix from your design context.
   - Key: `. ~/.goober/goober-secrets.sh` → `$REPLICATE_API_TOKEN` (if the file or key is missing, say so once, build with art-directed CSS fields + placeholders, and list the images to supply).
   - Primary model: `POST https://api.replicate.com/v1/models/openai/gpt-image-2/predictions` with header `Prefer: wait` and body `{"input":{"prompt":"<your prompt-prefix>, <image-specific suffix>","aspect_ratio":"3:2","output_format":"webp","quality":"high"}}` (fallback: `google/nano-banana-pro`).
   - Save to `assets/images/<purpose>.webp`, **look at every generated image** (Read tool — reject text artifacts / palette drift), keep files under ~300KB, and write alt text in the brand voice.
4. **Design the site chrome FRESH — replace, never patch.** Rewrite the ENTIRE contents of `partials/header.html`, `partials/header-home.html`, `partials/nav.html`, and `partials/footer.html` from scratch for THIS brand (keep only the `@use:` includes and `data-block` attributes). Do not reuse or tweak the starter markup or its class structure — design the chrome from the brand guide like a blank canvas, with its own CSS classes added to `components.css`. Requirements: real logo from `assets/images/` (check which logo files exist and use those exact paths — never a broken img), a deliberate mobile menu, CTA treatment, and a footer with hierarchy + trust signals. **NAV CONTRACT (multi-page, not a one-pager):** nav and footer links MUST point to the real page routes that exist in `pages/` — e.g. `/about/`, `/services/`, `/contact/` — and NEVER to in-page anchors like `#services`. Do not fold the other pages into anchor sections on the home page; each `pages/*.html` is its own route.
5. **Plan architecture + content flow BEFORE markup.** For each page write a one-line intent and an ordered section list. Each page reads top-to-bottom as a narrative: **hook → value props → proof → objection handling → one clear primary CTA**. No two pages share the same section sequence.
6. **Build the HOME PAGE ONLY, then STOP for approval.** Make it the standard-setter: distinctive hero (imagery/gradient depth, not a flat fill), varied section layouts, scroll-reveal/hover motion that respects `prefers-reduced-motion`, real copy. **Every `<section>` you write must carry a unique `data-block` attribute** (e.g. `data-block="hero-v2"`) — the visual editor and the `site/` registries depend on it. Stitch + verify it, present a short summary, and **wait for the user to approve before building any other page.** When approved, build EVERY other stubbed page in `pages/` as a full standalone route matching the locked design — do not skip pages and do not convert them into anchor sections of the home page.
7. **Verify every page:** `node tools/stitch.js --changed <file>` after each, and `node tools/stitch.js --verify` reporting `ok: true` — fix oversize images, broken links, and missing alt before moving on.

You may add **reusable** classes to `assets/css/components.css` (gradients, animations, new section patterns) — that's how the framework grows. Never `<style>` tags, never inline `style=""`, never edit generated `tokens.css`.

### B. Surgical edits after the site exists
For localized work (copy, one link, a single section), don't rebuild. Find the exact spot via `site/sections.json` (every section → `src_file` + `start_line`/`end_line`), edit in place, then `node tools/stitch.js --changed <file>`. Re-run the full design pass (step A) only when adding a new page or changing layout/visual structure.

### C. Content & copy quality
- Every word is written **originally for this business** — never lorem ipsum, never copied from example/inspiration sites.
- Lead with outcomes and specifics, not adjectives. Short scannable lines, one idea per section.
- Headings carry the message; body supports. CTAs are action-led and consistent in voice.
- SEO on every page: unique title + meta description in the `@seo` block, one h1, semantic heading order, descriptive internal links.

### D. Memory & context for larger builds
- Treat `CLAUDE.md` + `AGENTS.md` as the standing source of truth — re-read them if context gets long.
- Read the derived registries (`site/pages.json`, `blog.json`, `sections.json`, `blocks.json`, `internal-links.json`) **instead of re-reading every HTML file** — they're ~20× cheaper and always current after a stitch.
- Work page-by-page and stitch between pages so derived state + the preview stay in sync.
- Use `--checkpoint <name>` before a visual-direction change so you can diff drift or revert.

### E. MCP servers (only when connected — never required)
| Goal | Server | Use |
|------|--------|-----|
| Motion / scroll reveals | **Motion (Unframer)** | Fit static HTML + `/framework/js/runtime.js`; respect `prefers-reduced-motion`. |
| Supplied design files | **Figma (remote)** | Pull structure/spec when links are in scope. |
| Deploy / env / logs | **Vercel** | When shipping or debugging hosting. |
Note a server once if it's missing, then proceed with the skills + framework only. Ignore tooling nudges about Next.js/React/AI-SDK — this is a static HTML site; do not mention them in replies.

### F. Non-negotiables (always)
- **NEVER use emojis anywhere in site output** — headings, lists, buttons, icons, footers, anywhere. Icons are inline SVG (24px grid, `currentColor` strokes/fills) so they inherit brand colour.
- **Typography restraint — the #1 tell of AI slop is giant bold fonts.** H1 ≤ 56px desktop (≤ 36px mobile), weight 700 max, normal letter-spacing. Use the accent-keyword pattern: ONE phrase per major heading in the brand accent colour, the rest in ink/white. Body 16–18px.
- **Photo-led, trust-dense sections:** every major section is anchored by a real photo (card tops, split halves, galleries, hero backgrounds). The home page includes at least: an embedded quote form (hero card on desktop, repeated near the footer), a Google-review element, a photo gallery or photo-led grid, one brand-dark band, and a clickable phone number. A section that is just a coloured rectangle with centred text is a failed section.
- **No flat-colour-only sections as the default look:** heroes and key sections use imagery, gradient depth, or layered patterns. Flat is a deliberate accent, not the whole site.
- **Custom vanilla-JS components are encouraged** (review carousel, gallery lightbox, FAQ accordion, count-up stats, sticky mobile call/quote bar) — transform/opacity animation only, reveals fire once, `prefers-reduced-motion` respected.
- **Cohesion:** typography, spacing, radius, and CTA styling match **Brand** + `tokens.css` everywhere.
- **No generic filler:** vary section types; use documented section classes; never stack identical paragraph blocks.
- **Accessibility:** AA contrast, visible focus rings, alt text, semantic headings (one h1/page, no level skips).
- **Reconcile third-party snippets** with **Available Framework Classes** and **CRITICAL RULES**.

## Business Context
- Name: Bond Design Studio
- Industry: Business
- Location: 
- Phone: 
- Email: 
- Key services: 
- Tone: professional
- Target audience: general public

## Site content (wizard — paste / source draft)
I'll add the images, logo and video background into the assets folder once the folder is created. For now build out the wireframe design. Brand colours are literally just black and white, feel free to add a slight (very very light) nude colour if needed to contrast with black.

The design is white and bright, minimalistic, extreme white spacing, no overload of text or buttons or icons.

## Original Client Brief
You are building a single-page architecture website for Bond Design Studio 
(bonddesignstudio.com.au). Before writing any code, read and follow these 
skill files that are already in your project:

  - /mnt/skills/public/frontend-design/SKILL.md
  - /mnt/skills/public/ui-ux-pro-max/SKILL.md (if present)

Apply every design rule from those files throughout the entire build.

---

## CORE INTERACTION PATTERN — Scroll-Driven Video Scrubbing

The hero section is a FULLSCREEN video that plays frame-by-frame driven 
entirely by scroll position — NOT autoplay. As the user scrolls down, 
the video progresses forward. As they scroll up, it reverses.

Implementation rules:
- Load the video as an <video> element with preload="auto", muted, 
  playsinline, and NO autoplay attribute
- In JavaScript, listen to the window scroll event
- Map scrollY (from 0 → heroScrollHeight) to video.currentTime 
  (from 0 → video.duration)
- Use requestAnimationFrame for smooth frame seeking:
    function scrub() {
      const scrollFraction = window.scrollY / heroScrollHeight;
      video.currentTime = scrollFraction * video.duration;
    }
    window.addEventListener('scroll', () => requestAnimationFrame(scrub));
- The hero section height should be: (video.duration * scrollSpeed)px tall,
  where scrollSpeed = 300 (pixels of scroll per second of video). Calculate 
  this dynamically after video metadata loads.
- The video element must be position:fixed during the hero scroll phase, 
  then switch to position:relative (or be hidden) once the user scrolls 
  past the hero zone.
- Use an IntersectionObserver on a sentinel element at the bottom of the 
  hero zone to toggle the fixed/unfixed state.

---

## TEXT ANIMATION ON SCROLL (Hero Phase)

Two text blocks fade and translate in at specific scroll progress points 
during the video scrub phase:

  Paragraph 1 — appears at 15% scroll progress through the hero:
    "Refined residential spaces designed for clarity, light, and life."
    (Large display type, white, centered or left-aligned)

  Paragraph 2 — appears at 45% scroll progress through the hero:
    "To create residential spaces that inspire, nurture, and enrich 
     the lives of those who live in them. We believe every home should 
     be a sanctuary that feels as good as it looks."
    (Body type, white, max-width 600px)

Animation: opacity 0→1 + translateY(30px→0) over a 0.3s scroll window.
All text sits in a fixed overlay div (position:fixed, z-index:10) 
during the hero phase, with pointer-events:none.

---

## BRAND & DESIGN SYSTEM

Studio: Bond Design Studio
Aesthetic: Quiet luxury, minimalist, Helvetica Neue throughout

Typography:
  - Font: 'Helvetica Neue', Helvetica, Arial, sans-serif
  - Hero headline: clamp(2.5rem, 6vw, 5rem), weight 300, letter-spacing 
    -0.02em
  - Section headings: clamp(1.5rem, 3vw, 2.5rem), weight 300
  - Body: 1rem / 1.7, weight 300–400, color #1a1a1a
  - All caps labels: 0.75rem, letter-spacing 0.15em, weight 400

Colours:
  - Background (sections): #ffffff
  - Text: #1a1a1a
  - Accent / logo: #000000 (all black, no red border)
  - Subtle borders: #e8e8e8
  - Hero overlay gradient: linear-gradient(
      to bottom, 
      rgba(0,0,0,0.15) 0%, 
      rgba(0,0,0,0.4) 100%
    )

Spacing: generous whitespace — section padding min 6rem top/bottom.
Motion: all transitions ease-out, duration 0.4s unless specified above.

---

## PAGE SECTIONS (in order)

### 1. FIXED NAVIGATION (always visible)
- Logo left: "BOND DESIGN STUDIO" in all-caps, weight 400, black
- Nav right: Home · Services · Principal · Contact (smooth scroll anchors)
- Background: transparent over video hero, switches to rgba(255,255,255,0.95) 
  with backdrop-filter:blur(8px) once past hero zone
- No hamburger on desktop. Mobile: minimal hamburger → fullscreen overlay menu

### 2. HERO — Scroll-Driven Video Scrub (see above)
- Video source: use a placeholder <video> with a poster image initially.
  Add a comment: // TODO: replace src with final architecture video file
- Poster/fallback image: a high-contrast, minimal architectural photo 
  (dark concrete, natural light). Source from Unsplash with a direct URL:
  https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920
- Overlay: the gradient specified above, always present

### 3. TRANSITION — Video to White
- After the hero sentinel, a short 100vh section with background transitioning 
  from #111 to #fff using a CSS gradient, so the cut feels seamless

### 4. SERVICES (white background, id="services")
Heading: "What We Do"
Label above: "OUR SERVICES" (all caps, small, tracked)

Four services in a 2×2 grid (desktop) / stacked (mobile):
  1. Custom Home Design
  2. Interior Design  
  3. Home Transformations
  4. Sustainable Design

Use the full copy from the brief. Each card: no box-shadow, just a top 
border line (#e8e8e8), service name in heading weight, body copy in light 
weight. Generous padding.

Intro paragraph above grid:
"At Bond Design Studio, we offer a comprehensive range of services to help 
you create your perfect home. Our approach is collaborative, ensuring that 
every step of the design process is in line with your vision."

### 5. PRINCIPAL (white background, id="principal")
Layout: two columns — left is a portrait image placeholder (aspect 3:4, 
background #f0ede8 with a subtle label "Monica Vogel"), right is text.

Heading: "Monica Vogel"
Label: "LEAD DESIGNER"
Use full bio copy from the brief.

### 6. CONTACT (light background #f8f7f5, id="contact")
Heading: "Let's Chat."

Left column — details:
  100 Barangaroo Avenue, Sydney NSW 2000
  admin@bonddesignstudio.com.au

Right column — minimal contact form:
  Fields: Full Name / Email / Phone (optional) / Message / Submit
  Style: underline-only inputs (no box borders), black submit button with 
  white text, hover inverts. Label text floats up on focus (CSS only).
  No third-party libraries. Vanilla HTML form with basic JS validation.

### 7. FOOTER
  "© 2025 Bond Design Studio. All rights reserved."
  Centred, small type, #888, padding 3rem.

---

## TECHNICAL RULES

- Pure HTML + CSS + Vanilla JavaScript. Single index.html file. 
  No frameworks, no build tools, no npm.
- All CSS in a <style> block in <head>. All JS in a <script> block 
  before </body>.
- Mobile-first responsive. Breakpoints: 768px (tablet), 1024px (desktop).
- Smooth scroll: html { scroll-behavior: smooth } plus JS scroll listener 
  for the video scrubbing (these do not conflict — smooth-scroll only 
  applies to anchor clicks).
- Performance: use will-change: transform on the fixed video and text 
  overlay elements. Add loading="lazy" to all <img> tags.
- Accessibility: all images have descriptive alt text. Form inputs have 
  associated <label> elements. Focus styles are visible.
- The video scrub must be robust: guard against video.duration being NaN 
  (wait for 'loadedmetadata' event before calculating heroScrollHeight).
- Add a console.log('[Hero] video duration loaded:', video.duration) 
  for easy debugging.

---

## DELIVERABLE

Output a single, complete, production-ready index.html file. 
Do not omit any section. Do not use placeholder comments in place of 
actual CSS or JS — write the full implementation.

## Pages in This Project
- index.html — Home page

## Brand
- Primary color: #2563EB (use for headings, buttons, accents)
- Secondary color: #1E293B
- CTA color: #F97316 (use for call-to-action buttons)
- Heading font: Inter (loaded from Google Fonts)
- Body font: Inter
- Border radius: 0.5rem

## CRITICAL RULES
1. Never write `<style>` tags or `style=""` attributes
2. Never write CSS — the framework handles all styling
3. Always use framework class names listed below
4. Every page must link all framework CSS files and tokens.css
5. Every page must include `<script src="/framework/js/runtime.js" defer></script>`
6. If **Code injection** (Goober) is used, keep third-party snippets inside the marker comments exactly as placed: `<!-- goober:inject:head -->` … `<!-- /goober:inject:head -->`, `body-start`, and `footer` — do not duplicate or move them casually.
7. **Deploy shell placeholders:** If you copy `public/framework/shells/*.html`, replace `<!-- SITE_CONFIG_JSON -->` with a valid JSON object inline (or use the page shell in CLAUDE.md without that placeholder). Never ship `window.__SITE_CONFIG__ = <!-- SITE_CONFIG_JSON -->;` — it is invalid JavaScript until replaced.
8. **Skills & MCP:** Follow **How to build this site** (section A vs B). **Initial full-site build:** read every skill listed under **Skills for this build** in full, lock the design system, plan content flow, build page-by-page, `--verify` each. **Small later edits:** use `site/sections.json` to jump to the line; skills optional unless visual/structural. **Motion (Unframer)**, **Figma**, and **Vercel** MCP: use **when installed** and relevant.
9. **Example sites are not content sources:** When **Example sites** are listed above, use those URLs **only** for layout and visual patterns — never copy their wording, claims, or imitate their copy structure. All user-visible text must come from this project's brief, site content, documents, and brand — written originally for **Bond Design Studio**.
10. **Inspiration files are not page assets:** Files under `references/inspiration/` (when listed above) must never appear in `<img src>` or as CSS background images on **shipped** HTML. Real imagery: `assets/images/` and **Media & image sources** only; otherwise placeholders or layout without those reference files.

## Available Framework Classes

### Layout
- `.container` — max-width centered wrapper
- `.section` — standard section padding
- `.section-sm`, `.section-lg` — smaller/larger padding
- `.section-alt` — light grey background
- `.section-dark` — dark background, white text
- `.section-primary` — primary color background

### Buttons
- `.btn .btn-primary` — filled primary button
- `.btn .btn-secondary` — outlined button
- `.btn .btn-cta` — CTA color button (use for main actions)
- `.btn .btn-ghost` — subtle/text button
- `.btn .btn-lg` — large button

### Components
- `.card` — standard card
- `.card-bordered` — card with border
- `.form-group`, `.form-label`, `.form-input`, `.form-textarea` — form elements
- `.badge` — pill label
- `.avatar` — circular image

### Section Types
- `.section-hero` — hero/banner layout
- `.section-services-grid` — services grid layout
- `.section-trust-bar` — logos/badges bar
- `.section-faq-accordion` — FAQ with accordion
- `.section-cta-band` — full-width CTA strip
- `.grid-2`, `.grid-3`, `.grid-4` — responsive grids

### Typography
- `.label` — uppercase spaced label (use above section titles)
- `.section-title` — main section heading with accent underline
- `.text-muted`, `.text-center`, `.text-light`

## Page Shell Structure
Every page must follow this structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] | Bond Design Studio</title>
  <!-- <link rel="icon" href="/assets/favicon.ico" /> when favicon exists -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/framework/css/core.css">
  <link rel="stylesheet" href="/framework/css/components.css">
  <link rel="stylesheet" href="/framework/css/sections.css">
  <link rel="stylesheet" href="/css/tokens.css">
</head>
<body>
  <!-- nav here -->
  <!-- page sections here -->
  <!-- footer here -->
  <script src="/framework/js/runtime.js" defer></script>
</body>
</html>
```

<!-- goober:launch:start -->
## Launch

Every service this site needs is provisioned as a Vercel environment variable, never as a literal value in HTML, JS, or this repo. Read this before wiring any form, lead hook, or third-party call.

### Hosting: verified
- The site deploys to Vercel from this folder. `.vercel/project.json` links it to the right Vercel project. Never delete it or hand-edit the ids.

### Email: verified
Env vars: `EMAIL_PROVIDER`, `SENDGRID_API_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- Every contact or quote form POSTs to `/api/enquiry`. Never a third-party form service, never a `mailto:` action.
- Never hardcode an email address or an API key in HTML or JS. `api/enquiry.js` and `api/_autoreply.js` already read these env vars, with the baked defaults kept as a fallback.

### CRM connector (optional): verified
Env vars: `GOOBER_CONNECTOR_ID`, `GOOBER_CONNECTOR_KEY`, `GOOBER_CONNECTOR_ENDPOINT`
- Lead hooks POST to `/api/lead` with no key in the page. `window.gooberLead()` already does this. Never add a connector key to HTML or JS.
- Sites Goober does not manage after launch leave this item off. It is optional.

### Analytics (optional): saved locally
- GA4 and Google Ads ids live in `site/tracking.json` and are rendered into `partials/tracking-head.html`. They are not secret and are safe in the page.

### Domain (optional): not set
- The production domain is whatever is connected in the Domains panel. Never hardcode a domain in HTML or JS. Read `site/business.json`, field `canonical_url`.

After any publish, run the smoke test and fix red items before reporting done. When a new service is needed, add it as a launch item. Do not improvise a `.env` file.
<!-- goober:launch:end -->
