# Copy: SEO and GEO

Read whenever copy or page structure is written for a public page: website, landing page, location page, product page, blog post. App screens don't need it. About 2,900 tokens. Owns the ranking checklist, the citation rules, schema and the debunked list. Page structure and writing rules live in `SKILL.md` and `references/reader-psychology.md`; the detector and gate live in `references/voice.md`.

## Google's anchor guidance

Google's own guidance on generative AI features in Search is unambiguous: they're rooted in the core ranking and quality systems, so get indexed and eligible for a snippet and the same things that rank a page get it into AI Overviews and AI Mode. Write helpful, reliable, people first content, then apply SEO as a layer that helps machines understand it, never the reverse. No new machine-readable files, AI text files or special AI writing are needed; structured data isn't required; separate page variants per query breach the scaled content policy. What it asks for instead: helpful, people-first content, first-hand experience, images and video, semantic HTML, good page experience, a maintained Google Business Profile. Every page must demonstrate E-E-A-T (experience, expertise, authoritativeness, trust), shown, never claimed: a detail only a practitioner would know, credentials and years stated plainly, real named people with roles on the About page, real job photos with descriptive alt text, and zero filler.

## Keyword mapping

One primary keyword plus 2 to 4 supporting per page, mapped before writing and recorded in `COPY-BRIEF.md`; no two pages share a primary. `keyword_ideas` in the goober-tools MCP where connected; verify tool names at runtime. Place the primary in the H1, the first 100 words, at least one H2, the meta title and the URL slug, naturally; if the sentence bends around the keyword, rewrite the sentence, never keyword stuff.

Match intent to the query: crisis searches ("emergency plumber gold coast") want reassurance in the first line, the phone number as text in the first screen, a CTA to call; research searches ("how much does a bathroom renovation cost") want the real answer with ranges first, then a soft CTA. Mismatched intent kills rankings and conversions simultaneously.

Local SEO wants the suburb spelled exactly as the Google Business Profile, woven through the body, with local landmarks and area-specific FAQ; a template with the suburb swapped is a doorway page and never ships. Every page should carry at least one thing competitors don't: a named process, a real number, a genuine opinion.

### Page structure by type

The story arc in `SKILL.md` Phase 2 applies to all of these; this is what each page type needs to rank and be cited.

| Page | Sections | Keyword shape |
|---|---|---|
| Home | Hero, problem in their words, services as outcomes linking out, proof strip, how it works, area served, FAQ, close | "[service] [city]" |
| Service page | Hero, answer block, problem, inclusions with which-means bridges, process, proof, pricing context, FAQ, close | "[service] [city]" |
| Location page | Hero naming the suburb, answer block with travel time, services offered there, local jobs, area FAQ, close | "[service] [suburb]" |
| Problem-state page | H1 as the question, a 40 to 80 word answer, likely causes, what to check, when to call, cost, CTA | "why is my [thing] [symptom]" |
| Blog post | Answer in the first 100 words, H2s as sub-questions, a named author and role, links to the service | "how", "what", "cost", "vs" |
| Product page | Name and payoff, price and availability as text, materials and sizing, shipping and returns, reviews, FAQ | "[product] [attribute]" |

## GEO: writing to be cited

AI answers pick a handful of sources per reply and the job is to be one of them across many answers, not to hold one position (Semrush: ChatGPT cites about 15 sources per answer, Gemini about 3). Figures below are 2026 studies, directional for Australia; re-check before quoting one to a client.

Answer first, context second: the page and every H2 open with a direct, self-contained answer of 40 to 80 words, then elaborate; the first 100 words name the subject plainly and confirm the query (Surfer: 38% of citations now come from the first 100 words, and pages that confirm the query early are cited 45% of the time against 23%). Use question headings in the customer's own words, matched to the intent's shape: steps for how-to, a table for comparisons, a list for options.

Self-contained passages: keep each H2 self-contained, no "as mentioned above" or a dangling "this", with the business name and location present where natural, since a retrieval system may take one chunk and nothing around it; AI Mode fans one prompt into 5 to 20 sub-queries and only 27% are stable between runs, so covering the theme beats chasing one exact phrasing.

Entity clarity: state plainly and early what the business is, where it operates, and who it serves ("Goober Marketing Pty Ltd is a digital marketing agency on the Gold Coast specialising in..."). LLMs build their understanding from explicit statements, not vibes; keep entity details (name, address, phone, service names) identical across the site, the GBP and directories, with an About page carrying real people and credentials (Ahrefs: branded mentions correlate 0.66 with AI Overview mentions, ahead of Domain Rating at 0.33).

Quotable facts: put specifics in body text, never only in images: prices or ranges, response times, years, counts, suburbs, licence numbers, a named quote (Princeton GEO: quotations about +41%, statistics about +30%, citing sources about +27% over baseline). Keep vocabulary plain and unhedged, never stuffed (stuffing scored 17.7 against a 19.3 baseline in the same study).

Structured formats where they genuinely help: a numbered list for a process, a comparison table for options or tiers, bullets for inclusions; these are retrieval friendly, but never convert flowing persuasive copy into bullet soup, structure serves the content, not the other way around.

Keep content visible: no accordion or tab that removes text from the DOM, phone number as text, server-rendered HTML. Show a visible "Last updated" date and refresh answer blocks and FAQ at least quarterly (AI-cited content runs 25.7% fresher than organic top results, strongest for ChatGPT, no effect measured for AI Overviews).

FAQ is the workhorse on service and location pages: 5 to 10 real questions from People Also Ask and review mining, each answered in 40 to 80 words, answer first, no "Great question", no restating the question, no answer that only says "it depends". FAQPage schema, text identical to what's visible. Problem-state pages get cited far more than generic services pages do; brand mentions elsewhere (reviews that name the service, local press, directories) matter more than links. Run two campaigns for local: content on the site for AI Overviews, and a Google Business Profile campaign (categories, services, photos, review velocity, Q&A) for AI Mode, since AI Overviews send about three-quarters of local citations to the business's own site while AI Mode sends about four-fifths to Maps and GBP (Steady Demand). Reputation is closer to a pass or fail gate than a ranking lever: cited local businesses sat near 4.75 stars.

### The answer block, as a shape

"[Business] is a licensed [trade] in [suburb], [region]. We [primary service] for [customer type] across [area], with [one citable fact: response time, price basis, years]. [The short answer to the question the page title asks]." Fails when it opens "Welcome to [Business], your trusted experts" with no entity, no place and nothing specific.

### FAQ answer shape

The direct answer in the first sentence, one specific (a number, a time, a price basis), one condition or exception, the next step, 40 to 80 words. Example: "A like-for-like electric hot water replacement on the Gold Coast usually costs between $X and $Y installed, including removal of the old unit. Gas and heat pump systems cost more up front and less to run. We quote a fixed price before we start, and most replacements finish the same day. [CLIENT TO CONFIRM: price range]"

## Meta patterns

Meta title under 60 characters, primary keyword at the front, brand at the end, written as a click reason ("Emergency Plumber Gold Coast, On Site in 2 Hours | Smith Plumbing", not "Home | Smith Plumbing"). Meta description 140 to 160 characters with the keyword, a benefit and a call to action. URL slug lowercase, hyphen-separated, primary keyword, no dates or stop words. On the v2 scaffold, title, description, canonical, primary_keyword and schema_type live in the page's `@seo` marker; `tools/stitch.js` writes the head and JSON-LD from it plus `site/business.json`, so NAP lives in one place.

## Internal linking

2 to 5 links per page, descriptive anchors naming the destination, never "click here", marked inline as `[anchor → /url/]`. Every important page reachable within 3 clicks of home. Services link to locations and blog; locations link back to services; blog links to the service it supports.

## Schema by page type

A small, consistent positive, never a requirement or a substitute for visible text; everything in the JSON-LD should also be on the page.

| Page | JSON-LD |
|---|---|
| Home, local business | LocalBusiness subtype (Plumber, Electrician, ChildCare, BeautySalon, LegalService, Physiotherapy, Restaurant, RealEstateAgent; verify the subtype at schema.org), with name, address, telephone, openingHoursSpecification, areaServed, sameAs |
| Home, non-local | Organization: logo, sameAs, contactPoint |
| Service page | Service + BreadcrumbList, provider points to the LocalBusiness |
| Location page | LocalBusiness with areaServed for that suburb + BreadcrumbList |
| Any page with an FAQ | FAQPage, questions and answers identical to visible text |
| Product | Product + Offer: price, priceCurrency AUD, availability, sku |
| Blog post | Article, author as a named Person, dates matching the visible Last updated |
| Reviews | Review or AggregateRating, only from real, attributable reviews |

Validate with Google's Rich Results Test before handover; a schema error is worse than no schema.

## Crawler access

Citation bots retrieve and quote a page directly: Googlebot, OAI-SearchBot, PerplexityBot and Claude-SearchBot, allow always. Training and indexing bots feed a model or its index rather than a citation: ClaudeBot, GPTBot and Google-Extended, allow unless the client objects. No nosnippet, no restrictive max-snippet on a page meant to be cited. Never write a separate AI version of a page; the hero converts, the sections below are citable, same page, same voice.

`goober-llm-seo` owns the app's crawler and readiness rules (its `references/readiness.md` carries the full roster and verdicts); where this note and that skill differ, `goober-llm-seo` wins.

## What has no proven effect

llms.txt: John Mueller called it "purely speculative for now" as of June 2026, no AI system is known to use it. Harmless to generate if a client asks (`llms_txt` in goober-tools) but promise nothing. Also weak or debunked: AI-specific pages or Markdown twins (Google says not needed, and duplicate variants risk the scaled content policy), chunking content into fragments, a page per query variation, keyword stuffing, authoritative tone on its own, domain authority as the main driver of AI mentions (brand mentions correlate far higher), the "4.3x fresher" citation claim (no primary source), press-release syndication, schema tripling citations (unsourced).

## Handover notes

Close every page's build notes with: schema types and the fields that must match visible text; internal links, one per line; image placement, subject and alt text written with the copy (alt text names the subject and the place, never "image1"); SSR confirmed, robots.txt allows the crawlers above, no nosnippet, phone as text, FAQ visible in the DOM, NAP matching the GBP exactly; Last updated shown on page, next refresh due three months out. On the v2 scaffold `tools/stitch.js` writes `dist/robots.txt`, check the emitted file rather than assuming what it allows.

The happy truth: well structured, people-first, genuinely expert content is what both Google and LLMs reward, so there is no conflict between ranking and being cited; conflict only appears with old-school tricks, which this file bans anyway. Once the site is live, ongoing audits, prompt tests and weekly tracking are the `goober-llm-seo` skill's job, not this file's.
