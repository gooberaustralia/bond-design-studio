# Goober session card — Bond Design Studio

Updated 2026-09-09

## Facts
- Client: Bond Design Studio (bonddesignstudio.com.au). Boutique Sydney residential design studio.
- Lead designer: Monica Vogel. Ex Luigi Rosselli Architects, Stafford Architecture.
- Type: client website. Stack: static HTML/CSS/JS, Goober v2 substrate, Vercel.
- Surface mode: Persuade (lead generation, high-consideration purchase).
- Job this session: ONE test page at `/new-home` proving the redesign direction. Existing `index.html` stays live untouched.
- NOTE: Clayton's prompt named "Coast 2 Coast Property Finance"; the brief, working folder and repo are all Bond Design Studio. Proceeding as Bond. Flagged.

## File locations
- Repo: /Users/claytonhackett/websites/bond-design-studio
- New page: new-home.html + css/new-home.css + js/new-home.js
- Design context: design-guide/current.md
- Copy brief: design-guide/copy-brief.md
- Hero frames: frames/ (120 source jpg 1920x1080, Veo watermark bottom-right — must be cropped)
- Assets: assets/images/Monica Vogel Image.jpg, assets/videos/Camera_moves_through_*.mp4
- Client image library: Dropbox "Website Images" folder, public view+download. NOT yet pulled (awaiting Clayton's go).

## Active modules
goober-os SKILL.md, design/thinking.md principles applied from director judgement, platform = static Goober site.

## Decisions
- 2026-09-09 Standalone stylesheet for new-home rather than framework/css/sections.css. The framework is a generic marketing component set and fights an editorial layout. Still no inline styles, no <style> blocks. Logged as a deliberate departure from CLAUDE.md section D.
- 2026-09-09 No portfolio grid. Client has no completed projects. The reference sites (archaea, ona) are portfolio-led, so the page is rebuilt around the studio's thinking and process instead of work photos. This is the core strategic move.
- 2026-09-09 Dark mode framed as Day / Night, not a dev toggle. Justified by the studio's subject: the same house in different light.

## Director's notes
(pending first render)

## Director's notes — 2026-09-09, render 3
- First 800ms: expensive and specific. Reads as a real Sydney studio, not a template.
- Eye path as built vs planned: headline reads before the light, not after. Better than planned; kept.
- Three most generic decisions: the benefits list is a plain ruled list; the process list is a
  conventional numbered stack; the contact block is a standard two-column close.
- Removable without loss: the hero progress hairline. Kept because it explains that scrolling
  drives the film, which nothing else on the page does.
- Fixed across three loops: dead white voids (rhythm halved, statement lands inside the blow-out),
  hero over-length, header contrast over the bright frame, burger X targeting the wrong span,
  drawer email inheriting the display serif, night manifesto disappearing into the page.

## Rebuild — 2026-09-09, after Clayton supplied real assets
- Real renders arrived for Kenthurst, Mosman and Strathfield, plus the logo. The AI courtyard
  imagery and the 120 frame scroll scrub are gone from the page; assets/hero and assets/hero-sm
  deleted. frames/ stays because the old live index.html still uses it.
- Hero is now one still photograph (Strathfield) with a slow parallax. Page weight fell from
  4.47MB to 0.79MB, LCP 552ms, CLS 0.0005.
- Logo recoloured to monochrome in assets/logo/. White over the hero, black on the white
  scrolled header, white at night and in the footer.
- Reviewer findings applied: focus ring white over the hero, drawer sets inert on main and
  footer, burger is a 44px target, mobile services teasers restored, spaces added before every
  <br> so screen readers do not run words together, benefits rebuilt as a definition list so the
  numbered device stays reserved for services and process, manifesto rewritten (it was repeating
  a clause from the studio paragraph), services index moved onto the white ground as the
  composition block specifies, process ticks aligned to the numerals.
- Verified: axe 0 violations, no console errors, Day and Night, 390 and 1440, accordion, drawer,
  reduced motion.

## SEO and LLM SEO phase — 2026-09-10
- Ran the llm-seo skill with goober-tools. Keyword data (Google Ads, Sydney), AI visibility test
  across ChatGPT and Claude. Gemini failed twice, recorded as no data.
- Baseline: 0/100 every engine, 0% share of voice. Bond named in zero answers, cited zero times.
- Master internal file: strategy/seo-llm-strategy.md. Everything client-facing derives from it.
- HARD CONSTRAINT discovered: "architect" is a protected title in NSW (ChatGPT cited
  architects.nsw.gov.au). Site must not use it. Costs us architect sydney (1,300/mo) and
  architecture firms sydney (480). OPEN: confirm Monica's registration status.
- Beachhead: knockdown rebuild, ~1,010/mo cluster, two biggest terms LOW competition.
- Fee gap: AI tells buyers designers charge 3-5%; Bond quotes from 10%. Answered in the FAQ.
- Home page FAQ built: 7 questions, visible (no accordion, the services index already opens),
  FAQPage schema generated from the markup so it cannot drift. Build green, no console errors.
- Client docs published as artifacts: strategy, open questions, build status.

## Full site build — 2026-09-10
- New design promoted to the live home page. pages/new-home.html deleted, the old scrub page
  retired. Old assets (frames, framework css/js, source video) moved to source-art/old-site/.
- Eight pages built, exactly the client's brief structure: index, services, services/knockdown-rebuild,
  services/renovations-extensions, services/new-homes, process, monica, contact, plus thank-you.
- Shared partials: bond-head, bond-header, bond-footer. Pages generated via tools/mkpage.py so
  FAQPage schema is always extracted from the markup and cannot drift.
- css/new-home.css -> css/site.css, js/new-home.js -> js/site.js.
- Masthead default is now the solid state; data-over="true" is the exception, set by JS only when
  a .hero exists. Interior pages were showing a white logo on white paper before this.
- Enquiry handler extended with suburb, project_type and budget.
- Verified: build green, 0 broken links, 0 missing alt, axe 0 violations on all pages, no JS
  errors, no horizontal overflow at 390. dist is 1.5MB total.
- Interior Design deliberately has no page of its own: the client's structure lists only three
  service children. It is a section on /services and is quoted as an upsell.
- 2026-09-10 Process page had no imagery. Added a Kenthurst interior full bleed after the page
  head, and turned its principle band into a photograph (Strathfield 6) behind a left weighted
  scrim, so the page varies one axis from the home page's flat ink manifesto.
- 2026-09-10 Two Higgsfield images generated (nano_banana_pro, 2 credits each, Monica's real
  photo as face reference): consult-* on /contact, monica-work-* on /monica. Source PNGs kept in
  source-art/generated/. Deliberately NO project captions on these two, because captioning a
  generated image as a named project would assert something false. OPEN: Monica's own sign-off on
  the use of her likeness.
- Services page hero swapped to Strathfield 3 so band-pool is no longer on two pages.
