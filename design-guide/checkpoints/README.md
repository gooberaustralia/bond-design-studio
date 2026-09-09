# Design checkpoints

Approved-state snapshots of the design tokens + guide. Use them as a baseline to
compare drift against, or to revert after a bad change.

Create one:

```bash
node tools/stitch.js --checkpoint <name>
```

This writes `checkpoints/<name>.json` containing the current
`design-guide/tokens.json` and `design-guide/current.md`. Take a checkpoint named
`baseline` once the initial design is approved, and a fresh one whenever you
deliberately change visual direction.
