---
name: goober-design-pro
description: Goober Digital's design intelligence system for one-prompt premium client websites. ALWAYS use this skill when building, designing, redesigning, reviewing, or improving any website, landing page, homepage, service page, or web section, including headers, navigation, mobile menus, heroes, footers, forms, CTAs, banners, imagery, or animations. Trigger on any mention of "build a website", "landing page", "client site", "homepage", "redesign", "hero section", "make this look better", "improve this page", or any HTML/CSS page work, even if the user doesn't say "design". It derives a committed design DNA per business, saves it as a design context file, generates on-brand imagery, and grades its own output before presenting.
---

# Goober Design Pro

You are designing production client websites for Goober Digital. The bar:
**a senior designer at a premium studio shipped this**: custom-designed for
THIS business, never "an AI generated this". You have full creative authority
and the obligation to use it: derive, commit, execute, verify.

Generic output is a process failure, not a taste failure. This skill exists
because agents that start typing HTML with an implicit design converge on the
same site every time. So: **no markup until the design DNA is derived and
written to the design context file.** After that, the file outranks your
instincts.

## The process: seven phases, in order

| Phase | Do | Read first |
|---|---|---|
| 0 INTAKE | Pin the business facts (industry, audience + moment, conversion goal, brand assets, anchor references, locale). Think, don't interrogate. | `references/design-strategy.md` §1 |
| 1 STRATEGY | Source two or three live references when a browser tool is available (blend, never clone). Derive the 8-axis Design DNA (character → type → colour → shape → texture → motion → imagery → layout). Apply the deviation rule. Name the signature moment. **Write the design context file before any HTML.** | `references/sourcing.md`, `references/design-strategy.md`, then `references/design-context.md` |
| 2 ASSETS | Set the design tokens from the DNA. Generate hero + support imagery with the shared art-direction prompt prefix. | `references/imagery.md` |
| 3 BUILD | Hero first (the hero IS the design), then the section flow with designed transitions. Components per the DNA. Copy defers to `goober-content-writing`. | `references/layout-flow.md`, `references/components.md`, `references/art-direction.md` |
| 4 MOTION | Apply the DNA's motion signature: one orchestrated hero entrance, a coherent scroll system, text reveals where the DNA calls them, hover physics. | `references/motion.md` |
| 5 VERIFY | Build, screenshot (desktop 1440 + mobile 390), grade the ten axes, run the slop detector, fix, re-check. A page you have not looked at is not finished. | `references/review.md` |
| 6 SHIP | Functional floor: accessibility, performance, forms, GEO/schema. Then present with the direction name + signature + honest notes. | `references/qa-checklist.md` |

For a scoped small task (one section, one fix), don't run the full pipeline:
read the design context file + the relevant reference, make the change obey
the DNA, and spot-check. A missing context file never blocks a scoped fix.
but flag that it's missing and offer to create one.

## Token discipline (read this, then obey it)

- **Never read all references up front.** Read each file AT its phase, once,
  per the table above and the router below. The full-build cost is paid once,
  during the build that needs it.
- **The design context file IS the cache.** Phase 1 distils all strategy into
  `design-guide/current.md` + `tokens.json` (≤ ~150 lines). Every later
  session, new chat, reopened project, small edit, starts by reading THAT
  (plus `site/*.json` for structure), not by re-reading this skill. Re-derive
  only when the user asks for a redesign.
- **Scoped edits read at most two files**: the context file + the one relevant
  reference. If you can state the DNA rule you're obeying, you've read enough.
- Don't quote these references back into chat; apply them.

## Hard laws (apply to every phase, no exceptions)

1. **Zero emoji in shipped markup.** Icons are inline SVG (consistent stroke,
   `currentColor`).
2. **Banned fonts**: Inter, Roboto, Arial, Helvetica, Space Grotesk, Poppins,
   Montserrat, Open Sans, Lato, Raleway, and system stacks, and any font not
   named in the design context file. Two families max, display ≠ body.
3. **No AI grammar**: no eyebrow-label above every section heading (a named
   kicker system used deliberately is voice; the reflex is the tell) · no
   01/02/03 numbered scaffolding as decoration · no side-stripe `border-left`
   accents · no gradient text · no icon-in-tinted-circle feature grids · no
   solid-border card grids as the default card.
4. **No flat-field pages**: section backgrounds are designed (layers, texture,
   tinted fields, image washes) and section TRANSITIONS are designed (≥3
   distinct treatments per page). Never white/grey alternating stripes; never
   a "coloured rectangle with centred text" section.
5. **Typography restraint with character**: H1 ≤ 56px desktop (≤ 36px mobile),
   weight ≤ 700 unless the DNA's direction explicitly commits heavier (then
   still ≤ 800 and tracking ≥ -0.04em). Fluid clamp() scale. `text-wrap:
   balance` on headings, `pretty` on body.
6. **Motion is orchestrated, not scattered**: transform/opacity (+ clip-path/
   filter for reveals), one easing family site-wide, entrances 150 to 900ms (hero
   sequence totals < 1.2s), scroll reveals fire once (except a named in-out
   device), `prefers-reduced-motion` always respected. The tell is one
   identical fade-up on every element, vary by role, not at random.
7. **Conversion architecture** (client sites exist to convert): one primary
   action per page, in the header, the hero, every 2 to 3 sections, and a final
   band; action+outcome CTA copy (never "Submit"/"Learn More"); clickable
   `tel:`/`mailto:`; sticky mobile call/quote bar for local businesses.
8. **Accessibility floor**: 4.5:1 body contrast (3:1 large), 44px touch
   targets, visible focus states, labelled fields, alt text, one `<h1>`,
   semantic landmarks, logical heading order.
9. **Real copy only**: outcome-led headlines grounded in the actual business
   and location. Banned energy: "Welcome to", "Quality you can trust",
   buzzwords (streamline/empower/elevate), the "X. No Y." rebuttal cadence,
   em-dash overuse. `goober-content-writing` governs all copy.
10. **Honest proof**: real numbers, real reviews, real locations. Invented
    stats are forbidden.

## Environment adapters

**Goober Builder project** (you'll see `tools/stitch.js` + `partials/` +
`design-guide/`):
- Design context = `design-guide/current.md` (prose DNA) + `design-guide/tokens.json`
  (tokens). Keep both in sync with the build in the same turn, always.
- Write styles in the framework's own vocabulary: CSS custom properties in
  `assets/css/tokens.css`-consumable form, shared patterns in
  `assets/css/components.css`, page-specific styles in
  `assets/css/pages/<slug>.css`. Framework classes (`.btn--primary`, `.grid--3`,
  `[data-block]` sections). **No Tailwind classes, this substrate has none.**
  No inline `style=""`.
- Images: keys and generation are handled by the app's Imagery step or the
  Higgsfield connector, per `references/imagery.md` §3.
- Build = `node tools/stitch.js` (verify with `--verify`). Screenshots arrive
  via the studio's Screenshot button into `.goober/screens/`, request them,
  then Read the PNGs with vision.
- The scaffolded partials/pages are wireframes: redesign header/nav/footer
  fresh for the brand before building pages. Shipping starter chrome = failed build.
- Cinematic video-scrub hero wanted? Run the `animated-website` skill for its
  pipeline, but THIS skill's DNA still governs type, colour, and restraint.

**Claude Code / Cursor (standalone)**:
- Design context = `DESIGN-CONTEXT.md` at the project root (same template).
- Match the project's actual stack and styling system; if greenfield, default
  to semantic HTML + modern vanilla CSS with custom properties.
- Images: the Higgsfield connector when present, per `references/imagery.md`
  §3c; otherwise follow the pending-slot contract in the same section (queue
  the slot, placeholder in place, tell the user what is queued).
- Screenshots via any available preview/Playwright tooling; if none, do the
  strict markup walk in `references/review.md` §1.

## Editing an existing site (identity lock)

When asked to edit/extend a site that already has a design context file or an
established look: first write ONE factual sentence describing the current
identity (actual fonts, actual palette, actual shape language, from the
context file or computed styles, not aspiration). Stay in **default mode**:
your change must be indistinguishable from the original designer's hand.
Enter **departure mode** (redesigning the identity) only when the user
explicitly asks for a redesign, and then update the context file FIRST.
If you're unsure which mode you're in, you're in default mode.

## Reference router

| Read | When |
|---|---|
| `references/sourcing.md` | Phase 0 to 1, before a direction is committed; any request for inspiration or templates |
| `references/design-strategy.md` | Phase 0 to 1 of any build; any "it looks generic" complaint |
| `references/design-context.md` | Writing/updating the context file; starting Phase 2 |
| `references/art-direction.md` | Choosing fonts/colours/backgrounds; any styling work |
| `references/layout-flow.md` | Heroes, page composition, section order + transitions |
| `references/components.md` | Headers, nav, buttons, cards, forms, footers, icons |
| `references/motion.md` | Any animation work |
| `references/imagery.md` | Generating or placing any image |
| `references/review.md` | Phase 5; any "review/improve this page" request |
| `references/qa-checklist.md` | Before presenting anything |

## Review mode

Asked to review or improve an existing page? Audit against (1) the design
context file (context-betrayals are bugs), (2) the ten-axis grade + slop
detector in `references/review.md`, (3) the functional floor. Report as
**what's wrong → why it costs quality or conversions → the exact fix with
code**, ordered by impact. Then offer to implement.
