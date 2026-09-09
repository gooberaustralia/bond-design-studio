# goober-design-pro

Goober Digital's one-prompt premium web design skill. It gives an AI coding
agent a complete **design intelligence process**, strategy → saved design DNA
→ generated imagery → build → motion → graded self-review, so client websites
come out custom-designed and polished, never "AI slop".

Built for Goober Builder, portable to Claude Code and Cursor.

## What it does differently

1. **Derives a design, never defaults to one.** Before any HTML, the agent
   works through a structured strategy (industry, audience, brand, goal →
   character direction, type pairing, colour system, shape language, texture,
   motion signature, imagery art direction) and **commits it to a design
   context file**. Every later decision must obey that file.
2. **Generates real imagery.** Heroes and support imagery are generated with
   GPT Image 2 on Replicate using one shared art-direction prompt prefix, so
   every image on the site belongs to the same world.
3. **Designs the seams.** Section transitions are designed (gradient hand-offs,
   curves, overlaps, shared background fields), pages flow instead of stacking.
4. **Grades its own work.** The agent screenshots the result, scores it on a
   10-axis rubric, runs the slop detector, fixes, and re-checks before
   presenting.

## Install: Claude Code (Desktop or CLI)

Copy this folder into your project (or user) skills directory:

```bash
# project-level (recommended)
cp -R goober-design-pro <your-project>/.claude/skills/goober-design-pro

# or user-level (all projects)
cp -R goober-design-pro ~/.claude/skills/goober-design-pro
```

Claude Code auto-discovers `SKILL.md`. Ask for any website work and the skill
triggers; or invoke it explicitly with `/goober-design-pro`.

## Install: Cursor

Point a always-on rule at the skill so Cursor loads it for web work:

```bash
mkdir -p .cursor/rules
cat > .cursor/rules/goober-design-pro.mdc <<'EOF'
---
description: Premium web design process, apply to ALL website/landing-page/UI work
alwaysApply: true
---
Read and follow `.claude/skills/goober-design-pro/SKILL.md` before any website
design or build task. It defines the mandatory design process, the design
context file, and the review loop. Read its reference files when the SKILL.md
router says to.
EOF
cp -R goober-design-pro .claude/skills/goober-design-pro
```

## Images

There is no key for you to set. Inside Goober Builder, images are planned
and generated in the Planning studio's Imagery step, through the app's own
Replicate connection; the skill reads `site/images.json` and places only
what it lists. In standalone Claude Code or Cursor, the agent uses the
Higgsfield connector when it is present, and otherwise follows the
pending-slot contract: it queues the slot, leaves a placeholder, and tells
you what to generate. Full detail in `references/imagery.md` §3.

## Files

| File | Purpose |
|---|---|
| `SKILL.md` | The process spine: 7 phases, hard laws, environment adapters |
| `references/sourcing.md` | Phase 1: sourcing two or three live references before the DNA is committed |
| `references/design-strategy.md` | Phase 1 thinking: business facts → committed Design DNA |
| `references/design-context.md` | The saved design-DNA file contract + template |
| `references/art-direction.md` | Craft library: type pairings, colour method, backgrounds & textures |
| `references/layout-flow.md` | Hero art direction, section flow + blending, composition recipes |
| `references/components.md` | Signature components (buttons, cards, icons, headers, forms, footers) |
| `references/motion.md` | Motion signature system: entrances, scroll, text animation, hovers |
| `references/imagery.md` | Image strategy + the generation contract (studio, pending slot, Higgsfield) |
| `references/review.md` | The graded self-review loop + slop detector |
| `references/qa-checklist.md` | Functional floor: accessibility, performance, GEO/schema |
