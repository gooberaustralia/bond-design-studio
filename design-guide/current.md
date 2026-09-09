# Bond Design Studio — design context

Owner of every visual decision on `new-home.html`. Change this first, then the build.

## The client, in one line
A boutique Sydney residential design studio whose work is drawn but not yet built.

## The strategic problem
The two sites the client pointed at, archaea.com.au and ona.com.au, are portfolio-led. Their
power comes from photographs of finished buildings. Bond has none: every project is still in
design or construction, and the client has said plainly that they do not want a portfolio
section yet.

## The answer (signature idea)
Show the work at the stage it actually exists. As at 2026-09-09 the client supplied real
renders for three named Sydney projects, Kenthurst, Mosman and Strathfield. They carry the page
as **imagery throughout, never as a project index**, each captioned with its suburb and the
words "in design". That is honest, it gives the page the one thing it had none of (specifics),
and it respects the client's instruction. The buyer meets real Bond architecture on every
screen and is never told a house is finished.

The hero is one still photograph of the Strathfield house at dusk: a paperbark framing the
left, the white brick facade catching the last light. Dark, expensive, quiet, and it hands over
to a bright white page. No scroll-scrubbed video: the client asked for it to be removed, and a
single still loads in half a second where the frame sequence cost four megabytes.

**Day / Night.** The theme switcher is not a developer toggle. It is the same house at two
times of day, which is exactly the thing a residential designer is judged on. Labelled Day and
Night, it earns its place in the header.

## Direction
Refined, quiet, warm-neutral. Editorial rather than corporate. Space and typography do the work;
there are almost no boxes, no shadows, no icons, no rounded cards. Rules are hairlines. Every
piece of motion has to explain something.

## Axes (how this is not an interchangeable minimal site)
1. Warm paper, not cold white — the whole neutral ramp is warm; most minimal sites go blue-grey.
2. Serif display against a neutral grotesque — authority without a corporate voice.
3. Asymmetric editorial columns with deliberate hanging indents, not a centred stack.
4. The services block is an index that opens, not a grid of cards.
5. A drawn plumb-line down the process, because the studio's output is drawings.
6. Type at two extremes — very large display, very small tracked labels — nothing in between.
7. The hero resolves into the page rather than sitting above it.
8. Day / Night as content, not chrome.
9. Real projects named by suburb, so nothing on the page is generic stock.

## The logo
Supplied 2026-09-09. A heavy Didone wordmark stacked over three lines inside an open frame.
The supplied files carry a red frame; the header uses a recoloured monochrome version, white
over the hero photograph and black once a white ground is under it. At night it stays white,
because the ground stays dark. Source art lives in `assets/images/Bond Design Logo/`, the
recoloured PNGs in `assets/logo/`.

## Tokens
Light (Day)
- paper        #FAFAF8   page ground, warm
- paper-raised #FFFFFF   contrast blocks
- nude         #EDE7DF   the "very light nude" the client allowed, used for one block only
- ink          #111110
- ink-muted    #6B6A66
- line         #E4E2DC
- line-strong  #C9BFB2

Dark (Night)
- paper        #111110
- paper-raised #191917
- nude         #26231E
- ink          #F2F0EB
- ink-muted    #93908A
- line         #2A2926
- line-strong  #46433C

Type
- Display / headings: Newsreader, weights 200-400, optical size high. Tracking -0.02em at large sizes.
- Body, nav, labels: Inter, weights 300-500.
- Micro labels: Inter 500, 0.68rem, uppercase, 0.18em tracking, ink-muted.
- Display scale: clamp(2.6rem, 6.4vw, 6.2rem) hero; clamp(2rem, 4vw, 3.6rem) section.
- Body: 1.0625rem / 1.72, weight 300. Measure 62ch max, 48ch for the statement paragraph.

Space
- Section rhythm: clamp(6rem, 12vh, 10rem) top and bottom. Statement block gets double.
- Page gutter: clamp(1.25rem, 5vw, 5rem). Content max 1400px, editorial measure inside it.

Motion
- Duration 0.5-0.8s, ease (0.22, 1, 0.36, 1). Reveals are once-only, never on re-entry.
- Permitted: hero scrub, masked line rise on headings, services row open, plumb line draw,
  theme cross-fade. Nothing else moves.
- prefers-reduced-motion: hero becomes a single still, all reveals resolve instantly.

## Composition
**Eye path.** 1) The Strathfield house in the hero, lit from behind the tree. 2) The serif
headline over the dark lower third. 3) The studio statement against the Mosman stair. 4) The
services index, the densest black mass on the page and the first place a buyer can self-identify
("knockdown rebuild", that's me). 5) Monica's portrait in the nude block. 6) The contact line.

This order serves the moment of need: a homeowner arrives unsure whether their problem
(outgrown house, vacant block, tired layout) is something this studio handles. They must feel
the calibre first (hero, headline), then find themselves named (services index), then meet the
person (Monica), then act.

**Dominant mass:** the hero image and its blowout, roughly the first two viewports.
**Secondary mass:** the services index — dense hairline-ruled type on white.
**Negative space:** a full band of empty paper between the statement and the index, and again
before the contact line. The page is allowed to go quiet twice.

**Silhouette scrolling down:** dark photograph → warm paper (studio) → paper (why Bond) →
full bleed pool image → white (services index) → ink manifesto → white (process) → nude
(Monica) → paper (contact) → dark footer. Two dark bookends with one dark punctuation in the
middle, warm throughout.

**Container breaks:** the hero is full bleed. The tall Mosman render beside the statement bleeds
off the left edge. The pool image is full bleed. The services index runs the full content width
with hairlines to the gutters.

## Conversion
Primary action: **Start a conversation** (contact). One primary action on the page.
Secondary: download the brochure (client asked for it) — quiet, text-and-rule, never a filled button.
Email is a mailto:. Instagram handle bonddesignstudio_au in the footer.

## Open
- OPEN: real logo file. Wordmark is set in type until Clayton supplies artwork.
- OPEN: client CAD renders in the Dropbox "Website Images" folder — not pulled yet.
- OPEN: phone number and studio address. Contact block currently email-only, as per the brief.
