# Sourcing design references

Read at the Planning studio's Inspiration step, before the Design DNA is derived, and whenever asked for inspiration or templates. About 1,300 tokens. The product of a pass is a written description of why two or three references work, recorded in `design-guide/current.md`'s Anchors line, not the sites themselves or their assets.

## When to source

Yes: a client site or landing page before the direction is committed; an unfamiliar app UI pattern (a pricing matrix, an onboarding flow, a data table with bulk actions), pattern level only; whenever asked directly for references. Skip it during the build itself, since mid-build browsing is how a page drifts from its own direction: if the direction feels wrong, change `design-guide/current.md` first, then the build. Skip it too when no browser tool loads or every site blocks automation, and derive from the named anchors instead. For app UI, describe the pattern's states (empty, loading, error, success) as well as its layout; the states are what galleries rarely show.

## Budget

At most three sources, ten minutes of wall clock, six screenshots per project. This is calibration, not research: if the budget runs out before two references you can explain, derive from anchors anyway rather than let a late direction cost more than a thin one.

## Protocol

1. Pick one or two galleries by industry or style. Search the client's own industry first, to learn the conventions worth keeping, then a distant industry with the same feeling, for the move that stops the site looking like its category.
2. Open three to five candidate sites, about a minute per site: hero, one scroll, footer.
3. For each site that earns a place, write two or three lines on why: structure, rhythm, hierarchy, type attitude, colour commitment (restrained, committed or drenched, and where the accent is allowed), one memorable device.
4. Clip only what you will reference: a hero, a seam, a device. These come back into the conversation for Phase 1; they are not saved into the project as assets.
5. Leave assets, copy, code and any distinctive colour-plus-type-plus-layout combination where they are, especially from a competitor in the client's own market.
6. Blend at least two references: one reference is a template, two or three, described, is a direction.
7. Record the references and their why in `design-guide/current.md`'s Anchors line, alongside the object and place anchors the derivation asks for: `Anchors: sitename (asymmetric hero, image bleeds right, one serif line) · sitename (hard-cut dark seam before pricing) · a surveyor's site plan`.
8. Feed the description, not the site, into the design: "asymmetric hero, image bleeding off the right edge, one serif display line, everything else quiet" is what gets built from. A URL pasted into a build prompt tends to produce a clone. A good "why" states facts about construction rather than adjectives: full-height hero, headline left on a third, image bleeding off the right, a hard cut to a near-black testimonial band before pricing, one condensed display face doing everything, one clay accent on CTAs only, prices set like scoreboard numerals.

## Galleries

| Gallery | Use it for |
|---|---|
| Awwwards | The high end of what a site can be, filter by colour, style, technology |
| Recent.design, Land-book, Lapa.ninja | Daily curation, and filters by industry, style and page section; first stop for a client's industry |
| Saaspo, Siteinspire | SaaS pages by style; Typographic, Minimal and Unusual Layout |
| Framer marketplace free templates | Live preview links, method below |
| Refero, Mobbin (Pro/login) | App UI: iOS, Android and web flows and states |
| Dribbble, Behance | Mood only, not structure; most shots were concepts, not built sites |

## The Framer approach

Framer's free marketplace templates make useful structural references: every one has a live preview and was built to be used, not to win an award. Open the preview, not the product page. Read the structure (section order, hero composition, nav collapse, footer) and the motion (load versus scroll, one easing or several), describe it in the same six terms as the protocol, note what to keep and drop, then rebuild from the description and the project's own tokens rather than cloning the template as the design or lifting its copy: its look belongs to every other buyer, and the client is paying for one that is theirs.

## UI kits and blocks

For Next.js apps and dashboards; a client site on the v2 scaffold's vanilla CSS takes only structure ideas here. shadcn/ui is the base primitive set and the most recognisable tell in app UI when left at its defaults, so its colour, radius and neutrals get repointed at the project's tokens before the first component lands. Untitled UI, Aceternity UI and Relume offer free or freemium components; check licences before anything client-facing ships, and treat motion-block libraries (aurora backgrounds, sparkles, glowing borders) as tells in their own right, worth restyling rather than shipping as found.

## The legal and ethical line

Copyright protects specific code, images, copy and logos, not layout patterns, section order or common UI components. Trade dress can protect a distinctive, non-functional combination of colour, layout, typography and navigation, so reference structure, rhythm and mood rather than a specific combination, and steer clear of a same-market competitor. Blending references and adapting them to the client's own imagery and brand is both the ethical practice and the one that makes a better site.

## In this app

The Planning studio's **Inspiration** step is the primary path, not a browser opened by hand: browse in its embedded viewport (the default bookmark bar covers the galleries above), then Clip, Clip full page or Clip element to save a reference to `site/references.json`. A clip carries a screenshot and extracted facts and a "why it works" line, never code, matching the protocol above; the clip budget (`CLIP_BUDGET`) holds the studio to the three-source limit. The Design DNA step then reads `site/references.json` and blends at least two clips with the client's own material into each proposed direction, and writes the chosen direction's Anchors line into `design-guide/current.md` naming the clips it draws from and why.

## Verify

Sourcing happened at the Inspiration step or on request, not mid-build, within the three-source, ten-minute, six-screenshot budget. Each reference carries two or three written lines on why. At least two are blended, none reproducing a same-market competitor's combination. The Anchors line in `design-guide/current.md` names the clips with their why, and no URL is pasted into a build prompt.
