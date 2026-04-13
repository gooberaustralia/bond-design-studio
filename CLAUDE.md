# Bond Design Studio — Website Project

## Claude Code skills (shipped with this project)
These folders are **in the repo** under `.claude/skills/`. Goober copies them from the app when the project is scaffolded or **project docs are regenerated** — you do **not** need to install them from the Skills gallery for baseline UI/UX guidance.

| Skill | SKILL.md |
|-------|----------|
| `banner-design` | `.claude/skills/banner-design/SKILL.md` |
| `brand` | `.claude/skills/brand/SKILL.md` |
| `design` | `.claude/skills/design/SKILL.md` |
| `design-system` | `.claude/skills/design-system/SKILL.md` |
| `slides` | `.claude/skills/slides/SKILL.md` |
| `ui-styling` | `.claude/skills/ui-styling/SKILL.md` |
| `ui-ux-pro-max` | `.claude/skills/ui-ux-pro-max/SKILL.md` |

## Claude Code skills (this machine — optional extras)
Additional skills installed under `~/.claude/skills/`. Use when they match the task.

| Skill | SKILL.md path |
|-------|---------------|
| `frontend-design` | `~/.claude/skills/frontend-design/SKILL.md` |

**How to use:** **Initial full-site build (wizard / empty pages):** mandatory — read **ui-ux-pro-max** `SKILL.md`, then use **21st.dev** MCP before implementing nav, hero, feature grids, and service/marketing sections (see workflow below). **Google Stitch** MCP: use **when installed and helpful** for UI/design work. **Later:** small copy or single-line fixes can skip MCP/skill; **new pages, redesigns, or multi-section UI** still follow the workflow.

## Build focus (wizard)
- UI/UX polish: spacing, visual hierarchy, responsive layout, and accessibility (WCAG-minded).
- Performance: image weight, lazy loading, and Core Web Vitals-friendly structure.
- SEO: unique titles and meta descriptions per page, semantic HTML, crawlable content.
- Brand consistency: colors, typography, and tone match project.json / CLAUDE.md.

## Design, motion & MCP workflow

### A. Initial full-site build (mandatory)
Use this when you are **creating most or all pages** from an empty or nearly empty scaffold (typical **first run** after Goober creates the project).

**Before writing** nav, hero, primary marketing sections, **feature grids**, or **service / pricing cards**:

1. **Read** `.claude/skills/ui-ux-pro-max/SKILL.md` **in full** (or follow its `search.py` / data steps if it defers to scripts). Use it to pick patterns, hierarchy, and spacing discipline — do **not** skip this on the first build.
2. **21st.dev (Magic) MCP — required when configured:** Use `/mcp` or your tool list to confirm the server is connected. Then **call 21st.dev** to search or fetch **reference patterns** for at least: **site header / nav**, **hero**, **feature or service grid**, and **one secondary marketing block** (e.g. social proof, CTA band, or bento). Treat MCP output as **layout/structure inspiration only** — **translate** every idea into this repo's **framework classes** (`.section-*`, `.card`, grids, `tokens.css`). No raw `<style>`, no inline `style=""`.
3. **Google Stitch MCP — use when it helps:** If **Stitch** is connected, you **may** use it for **designing the site** — e.g. screen ideas, layout structure, or structured design context — **especially** when you want faster UI ideation, ambiguous layout in the brief, or a clearer spec before writing HTML. Use it **alongside or after** the skill; it is **not** a substitute for reading **ui-ux-pro-max** on the first build. **Translate** everything into static **framework HTML** only (same rules as 21st.dev); never ship raw `<style>`, inline styles, or framework-incompatible component markup.
4. If **21st.dev is not installed or not connected**, say that **once**, then lean on **ui-ux-pro-max** + **Available Framework Classes** only (still no skipping the skill). **Stitch** may still be used when connected.

After the first build, see **B** for smaller follow-ups.

### B. Smaller changes after the site exists (optional unless UI-heavy)
When the site **already has real pages** and you are doing **localized work** — typo/copy fixes, a single link, one paragraph, a small HTML tweak with **no new section types** — you **do not** have to re-run the full MCP sweep.

**Still** follow **A** (skill + 21st.dev when installed; **Stitch** when useful) when you: add a **new `*.html`**, redesign a **hero or nav**, replace **multiple sections**, or anything that changes **layout or visual structure** meaningfully.

### C. Other MCP (when installed)
| Goal | Tooling | Guidance |
|------|---------|----------|
| UI ideation, Stitch-led specs, screen concepts | **Google Stitch MCP** | Use **when connected** and when it improves design quality; implement as **framework HTML** only. |
| Motion, scroll reveals | **Motion (Unframer MCP)** | Fit static HTML + `/framework/js/runtime.js`; respect **prefers-reduced-motion**. |
| Supplied design | **Figma (remote MCP)** | Pull structure/spec when links/files are in scope. |
| Deploy, env, logs | **Vercel MCP** | When shipping or debugging hosting. |

If a listed MCP is **not** installed, note it once and continue with **ui-ux-pro-max** + framework only.

### D. Non‑negotiables (always)
- **Cohesion:** Typography, spacing, and CTAs match **Brand** and **tokens.css**.
- **No generic filler:** Vary section types; use documented **section** classes; avoid repetitive stacked paragraphs.
- **Third-party snippets:** Always reconcile with **Available Framework Classes** and **CRITICAL RULES**.

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
8. **Skills & MCP:** Follow **Design, motion & MCP workflow** (section A vs B). **Initial full-site build:** mandatory **ui-ux-pro-max** `SKILL.md` + **21st.dev** MCP when connected (see A); **Google Stitch** MCP **when connected — use as needed** for design ideation/specs (see A step 3 and section C). **Small later edits:** optional unless the change is visual/structural. **Unframer/Motion**, **Figma**, and **Vercel** MCP: use **when installed** and relevant. Other project `SKILL.md` files apply when listed above.
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
