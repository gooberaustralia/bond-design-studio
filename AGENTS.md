# AGENTS.md Operating rules for AI agents working on Bond Design Studio — Website Project

> Read this FIRST. This is a **GooberAI v2** site. It is plain HTML/CSS/JS built
> by a tiny zero-dependency stitch step. Follow these rules exactly so every
> edit stays consistent with the brand, the design guide, and the build system.
> (Human + Claude Code also read `CLAUDE.md`; this file is the portable,
> tool-agnostic contract for ANY external agent.)

---

## 0. Read these before editing anything (in order)

1. `design-guide/current.md`: LIVING design rules. Overrides BRIEF.md for visuals.
2. `design-guide/tokens.json`: colours, fonts, spacing (drives `assets/css/tokens.css`).
3. `site/business.json`: brand/business identity (name, tone, services, contact).
4. `site/pages.json` + `site/blog.json`, what exists, each page's intent + keyword.
5. `site/sections.json`: **every section's source file + exact line range** (the surgical-edit index, open straight to a block, no grepping).
6. `site/blocks.json`: approved section patterns (where each is defined, its classes).
7. `site/internal-links.json`: link graph, orphans, broken links.
8. `partials/header.html`, `footer.html`, `nav.html`, shared chrome.
9. `BRIEF.md`: original brief (intent only; the design guide overrides it).

Reading these (~15 to 20 KB) tells you the whole site. **Do not re-read all source
files for orientation**, read the JSON first, then open only the file you edit.

---

## 1. Project shape

```
BRIEF.md  CLAUDE.md  AGENTS.md  vercel.json  package.json
.goober-scaffold-version            ← "v2" marker
design-guide/  current.md  tokens.json  checkpoints/<name>.json (design snapshots)
partials/      meta header header-home nav footer tracking-head tracking-body-end
pages/         *.html  + _drafts/
blog/          _template.html  index.html  *.html  + _drafts/
assets/css/    tokens.css(generated) base.css components.css blog.css  pages/<slug>.css(per-page)
site/          business.json pages.json blog.json seo.json internal-links.json
               assets.json blocks.json sections.json drafts.json perf-budget.json
               tracking.json locations.json  agents/<persona>.md  agents/audit-log.jsonl
tools/stitch.js                     ← build engine
dist/                               ← generated output (gitignored). NEVER hand-edit.
```

## 2. Page format (the source-of-truth API)

A page is HTML with comment markers. **Markers MUST be on their own line.**

```html
<!-- @seo title="…" description="…" canonical="/services/" primary_keyword="…"
     secondary_keywords=["…","…"] schema_type="Service" noindex=false -->
<!-- @page intent="…" sections=["hero","services","cta"] primary_cta="Get a quote"
     last_human_edit="YYYY-MM-DD" -->
<!DOCTYPE html><html lang="en">
<head>
  <!-- @use:meta -->          ← builds <title>/<meta>/OG/canonical/JSON-LD from @seo + business.json
</head>
<body class="page-services">
  <!-- @use:header -->        ← home page may use <!-- @use:header-home -->
  <main>
    <section id="hero" data-block="hero-v2">…</section>
  </main>
  <!-- @use:footer -->
</body></html>
```

Blog posts additionally start with:
```html
<!-- @post date="YYYY-MM-DD" author="…" tags=["…"] hero="/assets/images/blog/x.jpg"
     reading_minutes=5 status="published" -->   ← status="draft" to keep it unpublished
```

## 3. Hard rules: DO

- **New page** → `pages/<slug>.html` with `@seo` + `@page` + `@use:meta/header/footer`.
- **New post** → `blog/<YYYY-MM-DD>-<slug>.html` from `blog/_template.html`, add `@post`.
- **Site-wide chrome change** (header/footer/nav/tracking) → edit the **partial**, not pages.
- **Follow the `goober-design-pro` skill** (`.claude/skills/goober-design-pro/SKILL.md`)
  on any build, redesign, or section work, it is the **governing design system**
  (design-DNA derivation → `design-guide/current.md` context file → designed
  sections/transitions/motion → graded self-review; no template looks, no AI
  grammar). Use `goober-content-writing` for all copy. These override ad-hoc
  choices when they conflict.
- **Copy read order**: `goober-content-writing`'s `assets/copy-brief.template.md`
  before any copy is drafted, then `references/voice.md` (the detector and the
  scoring gate) before every editing pass and at every review.
- **Images**: `site/images.json` is the registry; the pending-slot contract
  applies when a slot is missing (`goober-design-pro`'s `references/imagery.md` §3).
- **Reuse approved section patterns**: see `data-block` names in `site/blocks.json`.
- **Match the design guide**: colours/fonts/spacing come from `design-guide/tokens.json`.
- **If you change visual direction**, also update `design-guide/current.md` + `tokens.json`.
- **Page-specific CSS** → `assets/css/pages/<slug>.css` (home page = `home.css`).
  Stitch links it into that page only (after the shared stylesheets) and copies
  it to dist. In parallel builds each page agent owns exactly its
  `pages/<slug>.html` + `assets/css/pages/<slug>.css`, shared files are read-only.
- **Drafts** go in `pages/_drafts/` or `blog/_drafts/` and stay there until a human promotes.
- After edits, run `node tools/stitch.js --verify`, it must exit 0 (perf budget + validity).

## 4. Hard rules: DO NOT

- ❌ Inline a `<header>`/`<footer>`/`<nav>` into a page, use the partials.
- ❌ Use in-page `#anchors` as primary navigation, or collapse separate pages
  into anchor sections of the home page. This is a MULTI-PAGE site: nav/footer
  links point to real routes (`/about/`, `/services/`, `/contact/`), one route
  per `pages/*.html`.
- ❌ Hand-edit generated files: `assets/css/tokens.css`, anything in `dist/`,
  or auto-derived `site/{pages,blog,internal-links,assets,blocks,drafts}.json`.
- ❌ Change `site/business.json`, `design-guide/*`, `partials/header*`,
  `partials/footer.html`, `site/perf-budget.json`, or `site/tracking.json`
  unless your persona (`site/agents/<persona>.md`) explicitly allows it.
- ❌ Delete pages/posts or publish drafts (move out of `_drafts/`) autonomously.
- ❌ Put a marker mid-line, `@use:` markers must be alone on their line.
- ❌ Use brand-blue/decorative styles that contradict the design guide.

## 5. Build + deploy

```bash
node tools/stitch.js              # full build → dist/
node tools/stitch.js --verify     # dry-run: perf budget + HTML validity (use before commit)
node tools/stitch.js --state-only # re-derive site/*.json only
node tools/stitch.js --changed <path>   # incremental (changed file + dependents)
node tools/stitch.js --checkpoint <name># snapshot design-guide → checkpoints/<name>.json
```
Vercel runs `node tools/stitch.js` and serves `dist/` (`vercel.json`). The local
preview and the live site are produced by the identical code path.

**Build outcome (last stdout line JSON).** Always machine-readable. Use it to
self-check instead of guessing:
```json
{ "ok": true, "pagesWritten": 4,
  "counts": { "pages": 4, "posts": 0, "sections": 6, "blocks": 4, "images": 3 },
  "checks": { "perf": { "oversize_images": 0 },
              "links": { "broken": 0, "orphans": 0 },
              "seo": { "missing_alt": 0 } },
  "errors": [], "warnings": [], "elapsedMs": 12 }
```
`ok:false` means a hard error (perf budget bust / fatal), the build aborts.
`checks` + `warnings` are advisory (build still succeeds) but you SHOULD fix them:
warnings cover bad blog filenames, non-`YYYY-MM-DD` dates, `@use:` markers not on
their own line, malformed `audit-log.jsonl`, and published pages missing a
`primary_keyword`.

## 6. Finding + reusing things (no grepping)

- **Edit a section surgically** → look it up in `site/sections.json`:
  `{ route, src_file, block, id, start_line, end_line }`. Open `src_file` at
  `start_line` and edit between the line range. Re-run `--changed <src_file>`.
- **Reuse a pattern** → `site/blocks.json` gives each block's `defined_in`,
  `example_line`, and `classes`. Open the example to copy the markup, keep the
  same `data-block` name and classes so it stays on-brand.
- **Design snapshots** → `design-guide/checkpoints/<name>.json` hold approved
  token/guide states. Take one (`--checkpoint`) before a visual-direction change;
  diff against it to detect drift.
- Derived `site/*.json` are marked `merge=ours` in `.gitattributes`, never
  hand-merge them; re-run stitch after a merge to regenerate.

## 7. Autonomous agents (weekly audit / portal)

If you are an autonomous agent, you are bound by your **persona file**
`site/agents/<persona>.md` (e.g. `seo-optimizer.md`) which lists **Allowed
writes** and **Forbidden writes**. The host enforces them: any forbidden change
is reverted; only allowed changes are committed. Required workflow:

1. Work on a branch `agent/<persona>/<timestamp>`, never on `main` directly.
2. Read §0 files; make ≤3 surgical changes within your allowlist.
3. Skip any page whose `@page.last_human_edit` is within the last 7 days.
4. Run `node tools/stitch.js --verify`; revert if it fails.
5. Append one line per action to `site/agents/audit-log.jsonl`
   (`{ "ts", "agent", "action", "files", "rationale" }`).
6. Commit + open a PR for human review. Do not auto-merge.

Stay inside these rules and your edits will always match the brand, pass the
build, and deploy cleanly.

## 8. Technical SEO plumbing (hard rules)

`tools/stitch.js` generates the site's technical SEO from **one** value:
`site/business.json` → `canonical_url`, the client's **real production domain**.
These rules are non-negotiable, every build must be compliant:

1. **Sitemap `<loc>` are ABSOLUTE.** `dist/sitemap.xml` entries are full URLs
   (`https://www.example.com.au/about-us/`), never relative (`/about-us/`).
2. **Canonical is ABSOLUTE.** Every page's `<link rel="canonical">` is the
   absolute URL of that page, never `/` or `/about/`. In a page's `@seo` block,
   leave `canonical` relative (or blank), stitch makes it absolute against the
   domain. An already-absolute `@seo.canonical` is kept as-is.
3. **robots.txt references the absolute sitemap.** `dist/robots.txt` contains
   `Sitemap: https://<domain>/sitemap.xml`.
4. **The domain is the client's real production URL** from the project profile
   (`project.json` `data.website`), in the exact **www / non-www** form the site
   serves on. **NEVER guess it.** If `canonical_url` is empty, stitch emits a
   WARNING and the URLs stay relative (invalid) until an operator sets it in the
   editor's Performance panel → "Production domain".
5. **Every published page/blog post appears in the sitemap in the same build.**
   Stitch derives the sitemap from all published, indexable routes, so when you
   add a page or post, it's in `sitemap.xml` automatically after re-stitch. Do
   not maintain a separate sitemap by hand; never remove a published route from
   the sitemap while it's live.

## Agent Protocol (WordPress builds)

1. **Never edit without the bundle.** If you only have site access, first
   `GET /wp-json/claude-connector/v1/context?path=claude.md` (then design-guide,
   site/*.json), or clone the git repo named in bundle.json.
2. **Check drift before editing** (see §5.1). Never blind-overwrite live pages.
3. **Edit locally in the substrate** (`pages/`, `partials/`, `blog/`), never
   write raw HTML into WP directly, never touch plugin/core files, never the DB.
4. **Publish = `node tools/stitch.js` && wp-sync.** Nothing else counts as done.
5. **Design changes update `design-guide/current.md` + tokens in the same
   turn** (existing rule) and re-mirror the bundle.
6. **One live session per project**: respect `bundle.json.lock` (set/cleared
   by the app; external agents check-and-set).

<!-- goober:launch:start -->
## Launch

Every service this site needs is provisioned as a Vercel environment variable, never as a literal value in HTML, JS, or this repo. Read this before wiring any form, lead hook, or third-party call.

### Hosting: verified
- The site deploys to Vercel from this folder. `.vercel/project.json` links it to the right Vercel project. Never delete it or hand-edit the ids.

### Email: on Vercel
Env vars: `EMAIL_PROVIDER`, `SENDGRID_API_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- Every contact or quote form POSTs to `/api/enquiry`. Never a third-party form service, never a `mailto:` action.
- Never hardcode an email address or an API key in HTML or JS. `api/enquiry.js` and `api/_autoreply.js` already read these env vars, with the baked defaults kept as a fallback.

### CRM connector (optional): skipped
Env vars: `GOOBER_CONNECTOR_ID`, `GOOBER_CONNECTOR_KEY`, `GOOBER_CONNECTOR_ENDPOINT`
- Lead hooks POST to `/api/lead` with no key in the page. `window.gooberLead()` already does this. Never add a connector key to HTML or JS.
- Sites Goober does not manage after launch leave this item off. It is optional.

### Analytics (optional): not set
- GA4 and Google Ads ids live in `site/tracking.json` and are rendered into `partials/tracking-head.html`. They are not secret and are safe in the page.

### Domain (optional): not set
- The production domain is whatever is connected in the Domains panel. Never hardcode a domain in HTML or JS. Read `site/business.json`, field `canonical_url`.

After any publish, run the smoke test and fix red items before reporting done. When a new service is needed, add it as a launch item. Do not improvise a `.env` file.
<!-- goober:launch:end -->
