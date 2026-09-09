---
name: goober-llm-seo
description: Site-side LLM SEO (AEO, GEO) for every Goober website build. Makes a page eligible to be read, quoted and cited by ChatGPT, Gemini, Claude, Perplexity and Google AI Overviews, and keeps classic search intact while doing it. Use whenever a public page is planned, written, built or reviewed, whenever robots, sitemap, schema or llms.txt come up, and whenever someone asks "will AI recommend this business". The weekly engine tests and score tracking live in the Goober Portal, not here.
---

# Goober LLM SEO: built to be cited

AI answers pick a handful of sources per reply. The job is to be one of them
across many answers for this business's buying questions, not to hold one
ranking position. Three things get conflated; keep them apart in every report:

1. **Presence**: does the AI name the business for a relevant question.
2. **Citation**: does the AI cite the business's own site as a source.
3. **Readiness**: can AI crawlers technically read the site. Readiness is
   eligibility, never a ranking lever.

This skill owns readiness and the on-page structure that earns citations. It
never changes the design direction, the voice or the tokens; it changes what
the words say, how they are structured, and what the head and robots emit.

## Inputs, in this order

1. `site/business.json`: the entity facts. Name, address, phone, service
   names and areas must be identical everywhere: site, Google Business
   Profile, directories, schema. A mismatch is a finding, not a style choice.
2. `site/llm-seo.json` (when the planning studio wrote it): the buying
   questions a customer would ask an assistant, the entity facts to keep
   consistent, and whether the business is named today. Every service and
   location page answers at least one of these questions in its first 100
   words or its FAQ.
3. `site/seo.json`: target keywords and competitors. One primary keyword per
   page, no two pages share a primary.
4. `site/content/<slug>.md` when it exists: the approved copy. Structure
   edits are allowed; rewriting the voice is not.
5. `references/readiness.md` in this skill for the crawler roster and the
   audit checks.

## The page shape that gets cited

- **Answer first.** The page and every H2 open with a direct, self-contained
  answer of 40 to 80 words, then elaborate. The first 100 words name the
  business, what it does, where, and one citable fact (response time, price
  basis, years, licence, count).
- **Question headings** in the customer's own words, matched to the intent's
  shape: steps for how-to, a table for comparisons, a list for options.
- **Self-contained passages.** No "as mentioned above", no dangling "this".
  A retrieval system may take one H2 block and nothing around it.
- **Specifics in body text**, never only in images: prices or ranges,
  response times, years, counts, suburbs, licence numbers, a named quote.
- **Plain, unhedged vocabulary.** Stuffing measures negative for citations.
- **Visible content.** No accordion or tab that removes text from the DOM,
  phone number as text, server-rendered HTML. The v2 scaffold is static
  HTML, so this holds unless a script hides content on load.
- **A visible "Last updated" date** on service, location and problem pages,
  refreshed at least quarterly.
- **FAQ is the workhorse** on service and location pages: five to ten real
  questions from People Also Ask and review mining, each answered in 40 to 80
  words, answer first, one specific, one condition, the next step. No "Great
  question", no restating the question, never "it depends" alone. `FAQPage`
  schema with text identical to what is visible.
- **Problem-state pages** ("why is my hot water system leaking") get cited
  far more than generic service pages: H1 as the question, a 40 to 80 word
  answer, likely causes, what to check, when to call, cost, one CTA.

### The answer block

"[Business] is a licensed [trade] in [suburb], [region]. We [primary service]
for [customer type] across [area], with [one citable fact]. [The short answer
to the question the page title asks]." It fails when it opens with a greeting
and a claim of expertise, with no entity, no place and nothing specific.

## What the scaffold emits, and what you check

`tools/stitch.js` writes `<title>`, meta description, OG and Twitter tags,
canonical, JSON-LD, `sitemap.xml`, `robots.txt` and, when enabled,
`llms.txt`, from each page's `@seo` block plus `site/business.json`. Never
hand-write those into a page. Your levers are:

- `@seo` per page: `title` under 60 characters with the primary keyword at
  the front and the brand at the end; `description` 140 to 160 characters
  with a benefit and a call to action; `canonical` site-relative with a
  trailing slash; `primary_keyword`; `schema_type` (`LocalBusiness` subtype,
  `Service`, `Article`, `FAQPage`, `Product`).
- `site/seo.json`: `ai_crawlers` is `allow` by default. Citation crawlers
  (Googlebot, OAI-SearchBot, PerplexityBot, Claude-SearchBot) must be allowed
  on any page meant to be cited; GPTBot and Google-Extended are training
  controls, allowed unless the client objects in writing (note it in
  `seo.json`). `llms_txt` is harmless and unproven; leave it on, promise
  nothing for it.
- No `nosnippet`, no restrictive `max-snippet`, no leftover `noindex` from
  staging, on any page meant to be cited.
- Schema by page: home gets the `LocalBusiness` subtype (or `Organization`
  for non-local) with name, address, telephone, opening hours, areaServed and
  sameAs matching the footer exactly; service pages `Service` plus
  `BreadcrumbList`; any FAQ `FAQPage`; posts `Article` with a named author;
  reviews only from real, attributable data. Everything in the JSON-LD is
  also visible on the page. Validate the built output with Google's Rich
  Results Test before handover; a schema error is worse than no schema.
- Internal links: two to five per page with descriptive anchors, every
  important page within three clicks of home, zero broken links
  (`site/internal-links.json`), orphans fixed with contextual links, never a
  footer dump.

## The readiness audit

Run `python3 .claude/skills/goober-llm-seo/scripts/readiness_check.py <live url>
--max-pages 25 --json .goober/readiness.json` against the live site (never
against `dist/` alone; robots and headers only exist live). It is stdlib only,
polite (25 fetches, 0.3s apart) and honest: every check is pass, fail or not
measured. A fetch failure is not measured, never fail. Report in three lanes:
what the agent fixes now (robots, schema, structure, FAQ, freshness), what
needs a login or a person (Google Business Profile, directories, reviews),
and what is out of scope for the site (brand mentions elsewhere).

## What has no proven effect

Do not spend the client's money here: separate AI versions of pages or
Markdown twins (duplicate variants risk the scaled content policy), a page
per query variation, chunking content into fragments, keyword stuffing,
"authoritative tone" on its own, domain authority as the main driver (brand
mentions correlate far higher), schema as a citation multiplier, press
release syndication. `llms.txt` has no known consumer as of mid 2026.

## Report shape

Under 40 lines: Presence (measured or "not measured, needs the Portal"),
Readiness (the failing checks with the exact fix), Structure (pages missing
an answer block, an FAQ, a last-updated date, a schema type, with the fix),
Entity consistency (any mismatch, character for character), Three lanes. No
invented numbers. Never quote a study figure to a client without re-checking
it first.
