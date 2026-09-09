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
