# Readiness reference: crawlers, checks, and what each verdict means

Companion to `SKILL.md`. Read before running or interpreting the readiness
audit. Facts only.

## The crawler roster

| Token | Who | Role | Default |
|---|---|---|---|
| Googlebot | Google Search, AI Overviews, AI Mode | Citation | Allow, always |
| OAI-SearchBot | ChatGPT search | Citation | Allow |
| ChatGPT-User | ChatGPT live fetch when a user asks | Citation | Allow |
| PerplexityBot | Perplexity | Citation | Allow |
| Perplexity-User | Perplexity live fetch | Citation | Allow |
| Claude-SearchBot | Claude search | Citation | Allow |
| ClaudeBot | Anthropic crawl | Training and index | Allow unless the client objects |
| GPTBot | OpenAI training | Training | Allow unless the client objects |
| Google-Extended | Gemini training | Training | Allow unless the client objects |
| Applebot-Extended | Apple Intelligence | Training | Allow unless the client objects |
| Bingbot | Bing, Copilot | Citation | Allow |

Blocking a training bot does not remove the business from answers; blocking a
citation bot does. Record any client-requested block in `site/seo.json` with
the date and who asked.

## What the script checks

`scripts/readiness_check.py <url> [--max-pages 25] [--json out.json]`

1. **robots.txt**: fetched, parsed per group; a verdict per bot in the roster
   for the root path and for sampled pages, honouring wildcard groups and
   the longest-match rule. Missing robots.txt is "allow (no file)". A fetch
   error is "not measured".
2. **HTTPS and canonical**: the site answers on https, redirects http, and
   every sampled page carries one absolute canonical that resolves 200.
3. **Sitemap**: discovered from robots or `/sitemap.xml`, parsed (index and
   url sets, gzip tolerated), URLs sampled across depth, `lastmod` bucketed
   into fresh (90 days), ageing (a year) and stale.
4. **Render mode**: whether the main content is present in the HTML as
   served or only after JavaScript. The v2 scaffold is static; an imported
   site may not be.
5. **Schema coverage**: JSON-LD types found per sampled page, classified by
   page type (home, service, location, post, contact) and flagged where the
   expected type is missing.
6. **Freshness**: visible last-updated dates where present, `lastmod` where
   not, never invented.

Every check reports pass, fail or not measured. Nothing is inferred from a
failure to fetch.

## Reading the verdicts

- A citation bot blocked on `/` or on a service page: fix first, before any
  content work; nothing else matters while it is blocked.
- Canonical missing or pointing at another host: fix in the page's `@seo`
  block, then re-stitch and publish; check the emitted `dist/` head.
- Sitemap missing pages: check `@page` `draft` flags and `_drafts/` folders;
  a published page absent from the sitemap is a stitch or drafts issue, not
  an SEO one.
- Content only after JavaScript: on an imported site, move the content into
  the HTML; on a v2 site, find the script that hides it and remove the
  hiding, never add a crawler-only variant.
- Schema type missing on a service page: set `schema_type="Service"` in
  `@seo`; the scaffold builds the JSON-LD from `business.json`, so fix the
  business facts there, not in the page.
- Stale freshness on key pages: refresh the answer block and FAQ with a real
  change, then update the visible date and `@page.last_human_edit`. Never
  bump a date without a change.

## Structure checks you do by hand

The script cannot judge writing. On the built `dist/` pages, per page:

- One `<h1>` naming the topic and the place; H2s phrased as questions.
- First 100 words: business, what, where, one citable fact. Grep the first
  paragraph after the H1.
- FAQ present on service and location pages, visible in the DOM, mirrored by
  `FAQPage` JSON-LD with identical text.
- Phone as text with `tel:`, footer NAP identical to `business.json` and the
  Google Business Profile, character for character.
- A visible "Last updated" date on key pages.
- No `nosnippet`, `max-snippet`, or staging `noindex` in the head.

Quick commands from the project root after `node tools/stitch.js`:

```bash
grep -c "<h1" dist/index.html
grep -A40 'application/ld+json' dist/index.html | head -60
cat dist/robots.txt
grep -o 'name="robots"[^>]*' -r dist | head
```

## Figures worth knowing, all directional, all 2026, re-check before quoting

- ChatGPT cites about 15 sources per answer, Gemini about 3 (Semrush).
- About 38% of citations come from a page's first 100 words; pages that
  confirm the query early are cited roughly twice as often (Surfer).
- Quotations, statistics and cited sources lift citation likelihood by
  roughly a quarter to two fifths over baseline; stuffing lowers it
  (Princeton GEO).
- Branded mentions correlate far more with AI Overview mentions (about 0.66)
  than domain rating (about 0.33) (Ahrefs).
- AI Overviews send most local citations to the business's own site; AI Mode
  sends most to Maps and the Business Profile (Steady Demand). Run both
  campaigns for a local business.
- Cited local businesses sat near 4.75 stars; reputation acts as a gate.
