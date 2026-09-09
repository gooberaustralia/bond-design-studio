# Review, the graded loop that makes "done" mean designed

Read this at Phase 5, after motion is applied. You are not checking whether the
page works (that's `qa-checklist.md`), you are judging whether a senior design
director would put their name on it. **A page you have not looked at is not
finished.**

---

## 1. Look at the actual pixels

**Goober Builder:** build (`node tools/stitch.js`), then request screenshots.
the studio's Screenshot button captures the current preview route at desktop
1440px and mobile 390px into `.goober/screens/<slug>-<width>.png`, and drops
the paths into chat. Read those PNGs with your Read tool (vision). Screenshot
the home page AND at least one interior page (the human navigates + clicks.
ask for each route by name). **Ask once; if no screenshot paths arrive in this
turn, do NOT stall**: run the strict markup walk below, finish the loop from
it, and present with a one-line note, "visual review pending screenshots".
Also check `.goober/screens/` for existing recent captures before asking.

**Claude Code / Cursor:** if Playwright or a preview tool is available,
screenshot 1440 + 390. If nothing can render, do a strict markup walk instead:
for each section, state its background, its transition treatment, its type
sizes, and its motion attrs, any section you can't describe distinctly fails
§3.1.

Scroll the full page in your head as a first-time visitor on the target
device. First 800ms feeling. Then judge.

---

## 2. The ten-axis grade

Score each axis 1 to 10 against the design context file. **Ship bar: average
≥ 8.0 and no axis below 7.** Below bar → fix worst axis first → re-screenshot
→ re-grade. Maximum 3 loops, then present with known gaps listed honestly.

| # | Axis | 10 looks like | Classic 5 |
|---|---|---|---|
| 1 | Character | The DNA's feel hits in the first screenful; you could name the direction from the screenshot | Competent but anonymous, could be any business |
| 2 | Typography | Scale contrast is confident; headings have personality; rhythm is consistent; nothing defaulted | Timid sizes, one weight, system-ish feel |
| 3 | Colour | Dominant field strategy visible; accent lands only on actions; dark sections feel designed | White page + grey stripes + accent sprinkled everywhere |
| 4 | Depth & texture | Backgrounds have layers; sections have atmosphere; light feels intentional | Flat solid rectangles butt-jointed down the page |
| 5 | Layout | Container rhythm varies; at least one asymmetric/overlap moment per page; density matches DNA | Every section = same-width centred column |
| 6 | Imagery | On-palette, consistent grade, deliberate crops/masks; heroes composed WITH the image | Stocky, off-palette, slapped in rectangles |
| 7 | Section flow | Transitions are designed (≥3 distinct treatments); page reads as one journey | Hard colour jumps, no hand-offs, stacked blocks |
| 8 | Motion | One orchestrated hero entrance; reveals share a signature; text animation where the DNA calls it; hovers have physics | Uniform fade-ups everywhere, or nothing |
| 9 | Conversion | Primary action obvious in 3s at every scroll depth; CTAs styled as the page's most confident element; tel: prominent on mobile | CTA blends in; "Learn More" energy |
| 10 | Craft | Aligned edges, consistent gaps, balanced whitespace, focus states, tidy responsive reflow at 390 | Uneven padding, orphan words in headings, cramped mobile |

Grade honestly, inflated scores ship slop, but **don't invent defects to
demonstrate iteration** either: if the build genuinely clears the bar on loop
one, say so and move on. A clean slop-detector pass (§3) is a floor, not a
verdict: a flat, timid page can pass every checklist rule; only this grade
catches that. Write the scores down (Goober Builder: append one line per loop
to `.goober/critique-log.md`, like `2026-07-13 home: 8.3 avg, low: motion 7`, so
later sessions can see the trend).

**The Character axis, in one line.** Before scoring axis 1, write the verdict
as one word plus one sentence: `Authored: the hero is the job card this
workshop actually uses.` or `Interchangeable: swap the logo and this is any
Gold Coast electrician.` An Interchangeable verdict is the single most
important finding in the review; the fix is usually a direction change on
one axis, not polish.

**Persona check.** Before presenting, walk the build as three people and
note what breaks for each: Jordan (a first timer, is the primary action
obvious in 5 seconds), Casey (distracted on a phone, thumb zone and a slow
connection), Sam (screen reader and keyboard only, whole flow reachable,
focus visible, nothing carried by colour alone). This is the same check
`goober-reviewer` reports under Personas.

---

## 3. The slop detector

Run after grading, every loop. These are the telltales that make a site read
"AI-generated" at a glance. Any hit = fix before presenting, no exceptions.

### 3.1 Structure slop
- [ ] **Solid-border card grids**: cards outlined with `border: 1px solid`
      as the default treatment. Fix: elevation, tinted fills, borderless
      spacing, or the DNA's card recipe (`components.md`). Hairlines only if
      the DNA names them as a feature.
- [ ] **Flat alternating stripes**: white/grey/white section backgrounds.
      Fix: dominant-field strategy + texture system + blend zones.
- [ ] **Same-width monotony**: every section content in the identical centred
      container. Fix: ≥2 width/alignment breaks per page (full-bleed, offset,
      split, overlap).
- [ ] **Centered-everything**: every heading + paragraph centre-aligned.
      Fix: left-align body content; centre only what the DNA centres.
- [ ] **The default hero**: centred title + subtitle + two buttons on a flat
      colour/gradient. Fix: rebuild from the DNA's hero attitude + `layout-flow.md`.
- [ ] **Icon-in-circle feature grid**: 3× identical tinted circles + h3 + text.
      Fix: a signature treatment from `components.md` (numbered editorial list,
      icon-on-photo tiles, stat-led cards…).
- [ ] **Eyebrow grammar**: a tiny uppercase tracked label above EVERY section
      heading. One named kicker system used deliberately is voice; the reflex
      on every section is the single most reliable AI tell. Fix: keep it only
      where the context file names it; vary section openings elsewhere.
- [ ] **01/02/03 scaffolding**: numbered section markers as default decoration
      (fine as ONE deliberate process section; not as page grammar).
- [ ] **Side-stripe accents**: `border-left` colour bars on cards/quotes as
      the default emphasis device.

### 3.2 Surface slop
- [ ] **Emoji anywhere** in markup (icons, bullets, headings). Fix: inline SVG.
- [ ] **Banned fonts**: Inter, Roboto, Arial, Space Grotesk, system stacks.
      or any font not in the context file.
- [ ] **Purple-gradient-on-white** (or any gradient not derived from the palette).
- [ ] **Uniform radius**: one border-radius on everything without a shape
      decision. Fix: apply the DNA's shape language (incl. its exception).
- [ ] **#000 / #fff fields**: un-tinted pure black/white section backgrounds
      (unless the DNA explicitly commits to stark).
- [ ] **Palette drift**: images/illustrations whose colours fight the palette.
      Fix: regenerate with the prompt prefix, or colour-wash/duotone overlay.
- [ ] **Cream default field**: a warm-neutral (cream/sand/oat/beige) body
      background with no named reason in the context file (the anti-cream rule,
      design-strategy Axis 3). Fix: re-derive the field strategy; carry warmth
      in accent + type + imagery.
- [ ] **Stock-smile imagery**: posed-at-camera grins, handshake stock energy.
      Fix: real work/detail/mid-action imagery per the prompt prefix.
- [ ] **Escape-lane check (re-run on pixels)**: does the finished page sit in
      the PREDICTABLE escape lane for this industry (the second-order trap from
      design-strategy §3, e.g. "not navy/orange, so charcoal + hi-vis")? If a
      competitor could describe this page and be right about theirs too, one
      axis must move.

### 3.3 Behaviour slop
- [ ] **Scattered motion**: random fade-ups with no shared signature, or a
      dead page with none. Fix: apply the motion signature end-to-end.
- [ ] **No hero orchestration**: page loads all-at-once. Fix: staggered hero
      entrance per `motion.md`.
- [ ] **Default-looking buttons**: unstyled/borderless-text CTAs, or primary
      and secondary with equal visual weight.
- [ ] **Generic copy energy**: "Welcome to", "Quality you can trust",
      "Learn More" primaries. Fix: goober-content-writing rules.
- [ ] **AI copy cadence**: more than 2 em-dashes on a screen; three+ sections
      landing on the short-rebuttal pattern ("X. No Y." / "Not a feature. A
      platform."); buzzwords (streamline, empower, supercharge, elevate).
- [ ] **Gradient text** on headings (`background-clip: text`), decorative,
      never meaningful.

### 3.4 The context-betrayal check
Re-read `design-guide/current.md` (or `DESIGN-CONTEXT.md`) top to bottom.
List every place the build contradicts it (a colour that isn't in the palette,
a radius off-scale, a section with no transition treatment, a font weight
outside the plan). Contradictions = bugs. Fix or (rarely, with reason) amend
the file.

---

## 4. Targeted fixing, not thrashing

Fix in this order: worst-scoring axis → all slop-detector hits → craft nits.
Make the 3 to 6 highest-impact changes, re-stitch, re-screenshot, re-grade.
Don't redesign a passing page; don't polish padding while the hero scores 5.

**The Chanel rule**: before the final present, remove ONE decoration
(an accent, a texture, an animation) that the page doesn't need. If removing
it hurts, put it back; if you don't miss it, it was noise.

---

## 5. Stop conditions

Present the build when: grade ≥ bar on both viewports, slop detector clean,
no context-betrayals, `qa-checklist.md` (functional floor) passes, and you can
answer in one sentence: *"What will the visitor remember?"* (It should be the
`signature:` from the context file.)

Then present with: the direction name, the signature moment, the scores, and
anything you'd improve with more budget, honest, no theatre.
