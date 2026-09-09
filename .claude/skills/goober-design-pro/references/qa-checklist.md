# QA Checklist, the functional floor (Phase 6)

Run every item before presenting anything. This file is the FLOOR, does the
page work, convert, rank, and load, not the bar. `review.md` judges whether
it's designed; §9 below is the bridge between the two, and it is a hard gate:
**a build that fails distinctiveness is not done, even if §1 to 8 all pass.**

For "review this page" requests: audit against this file plus `review.md`,
report as what's wrong → what it costs → the exact fix, ordered by impact.

---

## 1. Responsive walk: 390, 768, 1440

Walk the page at all three widths (390 matches the studio's mobile
screenshot viewport; screenshot if you can render, strict markup walk if not).

- [ ] No horizontal scroll at any of the three widths; spot-check 360 for
      long words, URLs and the footer email (`overflow-wrap: break-word`)
- [ ] Hero complete above the fold at 390×844: headline, primary CTA, one
      trust signal all visible without scrolling
- [ ] Fixed/sticky header doesn't hide content; anchor targets carry
      `scroll-margin-top` equal to the header height
- [ ] Grids collapse deliberately: 4→2→1, 3→1 (or 3→2→1); alternating
      image/text rows stack image-above-text on mobile
- [ ] Full-height sections use `100dvh`/`min-height: 100svh`, never `100vh`
      (mobile URL-bar jump); landscape phone still usable
- [ ] Sticky mobile call/quote bar doesn't cover the footer's contact info
      (compensating `padding-bottom` on the footer)
- [ ] Type reflows cleanly: no orphan single words in headings at common
      widths (`text-wrap: balance` on headings, `pretty` on body)

## 2. Header / nav / menus

- [ ] Sticky behaviour smooth; transparent-over-hero headers verified for
      contrast BOTH at top and once scrolled onto light content
- [ ] Active page indicated in the nav
- [ ] Dropdowns work by hover AND click/keyboard, Escape closes, and there's
      no cursor-gap dropout between trigger and panel
- [ ] Mobile menu: opens/closes cleanly, body scroll locked while open,
      closes on link tap, close button reachable one-handed, contains the
      primary CTA + `tel:` + `mailto:`, padded for safe-area insets
- [ ] Burger and close buttons ≥44px hit area, `aria-expanded` +
      `aria-controls` wired and updating

## 3. Conversion

- [ ] ONE clear primary action per page; CTA present in header, hero, every
      2 to 3 sections, and a final full band before the footer
- [ ] Button copy is action + outcome ("Get your free quote"), no
      "Submit"/"Learn More" primaries anywhere
- [ ] Phone number clickable everywhere it appears (`tel:` with country
      code); email addresses are `mailto:`
- [ ] Trust signal in the first viewport; proof (reviews, credentials, real
      numbers) sits before each major ask; zero invented stats, missing
      proof is flagged as a client TODO, never fabricated
- [ ] Forms: ≤4 fields (or multi-step), visible labels (placeholders are not
      labels), ~52px input height, correct `type`/`inputmode`/`autocomplete`,
      validation on blur, loading + success states, honeypot field present
- [ ] Thank-you flow works end-to-end: form posts to its real endpoint and
      lands on a styled confirmation page (Goober Builder: POST
      `/api/enquiry` → redirect to `/thank-you/`; never a `mailto:` form)
- [ ] Footer NAP (name, address, phone) matches the Google Business Profile
      exactly

## 4. Accessibility

- [ ] Text contrast ≥4.5:1 body, ≥3:1 large, measure the risky pairs:
      accent-on-white buttons, muted-on-tinted fields, text over images
      (against the image's LIGHTEST area, or add a wash)
- [ ] Visible `:focus-visible` styles on every interactive element; outline
      never removed without a replacement
- [ ] Exactly one `<h1>`; heading levels sequential (no h2→h4 jumps);
      `header/nav/main/footer` landmarks present
- [ ] Every image has meaningful alt (or `alt=""` if decorative); icon-only
      buttons carry `aria-label`
- [ ] Tab order matches visual order; mobile menu and accordions fully
      keyboard-operable
- [ ] Form labels associated via `for`/`id`; error messages use
      `role="alert"`
- [ ] Zoom not disabled in the viewport meta; all touch targets ≥44px

## 5. Performance

- [ ] Every image <300KB and served as WebP (or AVIF); explicit `width` +
      `height` (or `aspect-ratio`) on ALL media so nothing shifts layout
- [ ] Hero image: `fetchpriority="high"`, never `loading="lazy"`; everything
      below the fold IS lazy; large images get `srcset`
- [ ] Fonts: ≤2 families, only the weights used, `font-display: swap`,
      `preconnect` to the font host, display font preloaded
- [ ] Non-critical JS deferred (`defer`/`type="module"`); no render-blocking
      third-party scripts; maps/video embeds facade-loaded on interaction
- [ ] Scroll work uses IntersectionObserver (not scroll-position polling);
      any scroll/touch listeners are `passive`

## 6. Motion gates

- [ ] Animations run on `transform`/`opacity` only (+ `clip-path`/`filter`
      for reveals), grep for transitions on width/height/top/left/margin
- [ ] Scroll reveals fire once, except a named in-out device
      (`data-anim-out`) where the context file calls for it; thresholds per
      motion.md §7. Nothing already in the initial viewport animates on
      scroll, only the hero sequence plays on load
- [ ] Hero entrance completes <1.2s and never blocks interaction
- [ ] `prefers-reduced-motion` block present, and the page is complete and
      legible with all motion off
- [ ] Hover lift/physics only on elements that are actually clickable

## 7. GEO / schema (every page: this is what wins AI citations)

**Head:**
- [ ] `<title>` ≈50 to 60 chars: Primary Keyword | Brand (locality for local
      businesses: "Plumber Burleigh Heads | {Brand}")
- [ ] Meta description 140 to 160 chars with a concrete benefit + call to action
- [ ] Absolute canonical URL; `og:title/description/image` (1200×630) +
      twitter card; favicon set; correct `lang` (e.g. `en-AU`)

**Structure:**
- [ ] H2s phrased as the questions people actually ask, with a direct answer
      in the FIRST sentence beneath each (the citation-friendly pattern)
- [ ] FAQ sections present and substantive FAQs are the most-cited blocks
      in AI answers; thin filler earns nothing
- [ ] Specific, verifiable facts (prices, timeframes, service areas,
      credentials, est. year) in plain text, never locked inside images
- [ ] Descriptive internal links (no "click here"); services interlinked
      from home, footer, and body copy

**JSON-LD (validate before shipping):**
- [ ] Every page: `LocalBusiness` (or `Organization`), name, URL, logo,
      telephone, address, geo, openingHours, sameAs, matching the footer
      NAP exactly
- [ ] Service pages: `Service` with provider, areaServed, offers
- [ ] FAQ sections: `FAQPage` mirroring the exact on-page Q&As
- [ ] Inner pages: `BreadcrumbList`
- [ ] `AggregateRating` ONLY with genuine first-party review data

**Crawl:**
- [ ] `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
      (Goober default: allow; override only on client instruction)
- [ ] `sitemap.xml` referenced from robots with an absolute URL; clean
      descriptive URLs (`/services/landscaping-gold-coast/`)
- [ ] Image filenames + alt text descriptive
      (`gold-coast-bathroom-renovation.webp`, not `IMG_4021.jpg`)

## 8. Token discipline + Goober Builder verify

- [ ] All colour/type/radius/shadow/motion values come from the design
      tokens as custom properties, grep for stray hex values outside the
      generated `tokens.css` (standalone: outside the `:root` token block).
      A raw hex in component or page CSS is a contract violation
- [ ] `design-guide/current.md` + `design-guide/tokens.json` (standalone:
      `DESIGN-CONTEXT.md`) match what was actually built, same-turn sync
      rule held
- [ ] **Goober Builder:** `node tools/stitch.js --verify` passes clean
      before presenting, it catches emoji in shipped markup, broken
      internal links, broken/missing images, missing alt, and oversize
      images. Fix every warning, re-stitch, re-verify. A build presented
      with verify warnings is not done

## 9. Distinctiveness gate (hard gate: see `review.md`)

Functional passing is necessary, never sufficient. Before presenting:

- [ ] The ten-axis grade passed on BOTH viewports: average ≥8.0, no axis
      below 7 (`review.md` §2)
- [ ] Slop detector clean, zero hits across structure, surface, and
      behaviour slop (`review.md` §3)
- [ ] The signature moment is present, working, and you can name it in one
      sentence, the same sentence as `signature:` in the design context file
- [ ] "Could this be anyone's site?" answered **no**, with the reason
      written down (which axes make it unmistakably THIS business)

Fail any of these → back to `review.md` §4, fix, re-grade. Do not present a
functionally perfect page that looks like everyone else's, that is the exact
failure this skill exists to prevent.

---

Everything passes? Present per SKILL.md Phase 6: direction name, signature
moment, scores, honest notes on what more budget would improve.
