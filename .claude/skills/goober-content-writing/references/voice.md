# Copy: voice and the detector

Read before every editing pass, and at every review gate that includes words. About 2,400 tokens. Owns the voice method, the dash rule, the detector lists (the app's copy checker, `copy:check`, and `tools/copy-rules.json` hold the deterministic version enforced again at build time by `stitch --verify`; this file is the human-readable version the writer and reviewer work from) and the scoring gate. The brief, page structure and headline craft live in `SKILL.md` and `references/reader-psychology.md`; ranking rules live in `references/seo-geo.md`.

## Voice constant, tone flexes

Voice is who the brand is and never changes; tone is how it sounds in a given moment and flexes with context. Both are set in `COPY-BRIEF.md`.

### The We Are / We Are Not table

Five pairs, each an attribute and the failure mode it must not tip into, written from how the owner actually talks on the phone, not from a workshop.

| We are | We are not | How it shows |
|---|---|---|
| Confident | Arrogant | States prices and guarantees plainly, never mocks a competitor or the reader |
| Approachable | Sloppy | Contractions and plain words, still correct grammar and exact facts |
| Direct | Blunt | Says what it costs and won't do, gives the why in half a sentence |
| Knowledgeable | Lecturing | One practitioner detail per section, no paragraphs of theory |
| Warm | Gushing | Notices the reader's situation, no exclamation marks, no "amazing" |

Two or three attributes lead each piece; all five at once reads as noise. Every attribute should show up somewhere on the page, and no We Are Not line gets crossed. Test: cover the logo, can the reader still tell which business wrote it?

### Tone dials

Set formality, energy and technical depth each 1 to 5 in the brief as a baseline; a context can shift them but never changes the We Are list. A hero usually sits a notch livelier and a notch plainer than the baseline; an FAQ answers first and a notch more technical; an error message drops energy and apologises once; an SMS stays under 160 characters and names the next step and the time.

## The dash rule

No em dashes, no en dashes, no hyphen with a space either side used as a pause, anywhere. Rebuild the sentence instead: an aside becomes commas or parentheses ("Our plumbers, all licensed, arrive within two hours"); what explained the first half becomes a colon ("One price: the one we quoted"); two thoughts jammed together become two sentences ("We arrive at 7. The job is done by lunch"); a dramatic pause before a punchline just gets cut. Hyphens stay in compound modifiers and established compounds (mobile-first, fixed-price, 12-month, call-out, check-in). Ranges use "to" (40 to 80 words). Manual check: `rg -n '\x{2013}|\x{2014}| \x2d '`.

## The detector

Run on every draft. A hit is the quoted line plus a severity: P0 must fix before anything ships (a dash as punctuation, a phrase from the list below, an invented fact, a We Are Not crossing, a banned heading or button); P1 fix before the gate (a vocabulary cluster, a construction below, metronomic rhythm, an unpaid adjective); P2 judgement call (one transition word, one long sentence, a formal word used once). One ordinary word in a sentence that needs it is not a hit on its own; the tell is a cluster, or an evaluative adjective (fast, trusted, premium, reliable, expert) with no fact paid against it in the same or the next sentence.

### Vocabulary (flag when two or more cluster in a passage)

delve, tapestry, testament, landscape, realm, pivotal, crucial, vital, intricate, robust, seamless, elevate, unlock, unleash, harness, leverage, empower, foster, garner, underscore, showcase, enhance, streamline, navigate, embark, journey, vibrant, bustling, nestled, breathtaking, stunning, renowned, game-changer, cutting-edge, revolutionise, transformative, innovative, holistic, synergy, meticulous, comprehensive, ever-evolving, dynamic, bespoke, solutions. Also watch highlight, and optimise when it means nothing (Kobak et al. found "delves" at 28 times its expected rate across 15 million PubMed abstracts).

### Phrases and openers (flag on sight)

"In today's fast-paced world", "In a world where", "Whether you're a X or a Y", "Look no further", "We've got you covered", "Your one-stop shop", "one-stop shop", "Taking X to the next level", "Welcome to", "At [Brand], we", "We pride ourselves", "We understand that", "It's important to note", "It's worth noting", "At its core", "At the end of the day", "When it comes to", "Here's the thing", "Let's dive in", "Let's explore", "Without further ado", "The truth is", "Make no mistake", "Let that sink in", "In conclusion", "Overall", "The future looks bright", "Exciting times ahead", "Experts say" or "studies show" with no source, "I hope this helps", "Great question", "We do things differently", "Making X simple", "Quality you can trust", "your trusted", "it just works", "AI-powered", "all-in-one", "people first", "Effortless", "rest assured", "hassle-free", "peace of mind", "second to none", "state-of-the-art", "best-in-class", "world-class", "we are passionate about", "revolutionise".

### Constructions

Negative parallelism ("it's not X, it's Y"): state the point instead. Forced triplets by reflex: use two, or one, or as many as are true. False ranges ("from X to Y") where no spectrum exists. Copula avoidance ("serves as", "boasts", "features", "offers", "represents" instead of is or has). Shallow participle tails (", ensuring / highlighting / showcasing..."). Significance inflation ("plays a vital role", "a testament to"). Rhetorical setup then answer ("What does this mean? It means..."). Fake candour ("Honestly?", "Look,"). Answering unraised objections ("To be clear", "Don't get me wrong"). False agency ("the data tells us"): name the human who did it. Hedge stacks ("could potentially"). Announcing the next point instead of making it. The heading restated as the first sentence under it. The "X. No Y." cadence ("Real people. No bots.").

### Structure and punctuation

Em and en dashes as punctuation, the most recognised tell. Title Case Headings. Bold scattered through prose. "Label: description" bullet lists. Emoji in headings or anywhere else. Metronomic sentence length, every sentence near 18 words, where a person writes 3, then 40, then 12. Every paragraph ending on a punchline. Rows of fragments. Compulsive summaries. Excessive hyphenated pairs (data-driven, end-to-end, cross-functional).

### Leave alone

A single short sentence for emphasis, one transition word, a formal word in isolation, quoted material and proper names, deliberate repetition for rhythm, a specific unusual detail, a genuine aside. Persuasion itself is not a tell. A rhetorical question is fine once per page as a headline naming a specific pain in the reader's words; it reads as generated when it opens a paragraph that then answers itself.

### Word swaps

utilise/use, leverage/use, seamless/smooth or cut it, robust/strong, in order to/to, facilitate/help, prior to/before, commence/start, assist/help, endeavour/try, individuals/people, optimal/best, sufficient/enough, numerous/many, additional/more, in the event that/if, comprehensive/full, solutions/name the service, bespoke/made for you, ensure/make sure.

## The scoring gate

Five dimensions, 1 to 10 each, revise below 35 out of 50: directness (a 3 hedges into paragraph three; a 9 says the thing in the first sentence), rhythm (a 3 sits near 18 words every sentence; a 9 varies 3, 40, 12 and earns its punchlines), trust (a 3 uses adjectives with no fact attached; a 9 has a number, name, date or quote beside every claim), authenticity (a 3 could be any business in the category; a 9 carries the owner's own phrasing and a practitioner detail), density (a 3 opens with filler and restates headings; a 9 makes every sentence carry new information). Any open P0 fails the gate whatever the score, and a single invented fact fails it even above 35. Record the result as `REVIEW GATE: passed 41/50 (directness 8, rhythm 7, trust 9, authenticity 8, density 9) | P0 0, P1 2 fixed | leading: Direct, Warm`. After three failed loops on one page, stop and hand the specific blockers to the client rather than writing a fourth draft.
