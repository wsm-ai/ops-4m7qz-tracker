# CLAUDE.md — Operating rules for AI assistants in this repo

You are continuing work on **Operations**, a single-file offline PWA. Read this file first, then **OPERATIONS-HANDOFF.md** for full architecture and history. This file is the short, binding rulebook.

---

## What this project is (30-second version)

- One app file: **`index.html`** (~8,200 lines, HTML+CSS+JS together) + **`quizbank.js`** + **`sw.js`** (service worker holding the version string).
- Fully **offline**, no framework, no runtime dependencies. Data in `localStorage` (key `operations_v2`), optional cloud-JSON backup.
- Everything measurable is a **skill** with a measurable level ladder, decay, peak, and progression, themed as a **Yggdrasil world-tree**.
- Current version: **v88** (see `sw.js`).

The user is an Army ROTC cadet building this for himself. He values **honesty, measurability, privacy, preserved progress, and symbolism** above all.

---

## Hard rules (do not violate)

1. **Edit the real `index.html`.** There is no source-to-build transform; `index.html` *is* the app. The `dist/` preview is generated output — never edit it by hand.
2. **Honesty / no faked metrics.** Only real, evidence-based methods. Skill levels describe what the user can *do* (verifiable benchmarks), never status labels ("elite", "instructor"). Top level = a documented human ceiling, framed honestly.
3. **Offline & private.** Never add network calls, telemetry, analytics, external fonts/CDNs, or anything that uploads user data. The app must keep working with no internet.
4. **Preserve user progress in every migration.** The user uploads OLD save files. Adding/renaming/reshaping skills must never lose a level, peak, or history entry. See "Migrations" below.
5. **Auto skills are never self-reportable.** Any skill with an `auto:` field levels only from measured/logged data. Do not add tap-to-level UI to them. (Exception already designed: `weight:integrity` may move *down*, still read-only.)
6. **A skill is never lost.** `skEffectiveLevel` floors a started skill at level 1. Don't add logic that can zero or delete a started skill.
7. **Symbolism is intentional.** The tree-of-growth / Yggdrasil theme is a feature. Keep it coherent; don't strip it for convenience.
8. **Don't over-format the app or invent scope.** Make the requested change; ask before large architectural shifts.

---

## The required workflow for any change

```bash
# 1. (first time only) install dev tooling
npm install
npx playwright install chromium

# 2. make your edit in index.html (and/or quizbank.js, sw.js)

# 3. verify — BOTH must pass before you call it done
npm run check        # syntax-check the main script (fast, no browser)
npm run regress      # headless: load app, click all 16 tabs, assert ZERO pageerror
#   (npm run verify runs both)
#   add a tree screenshot when you change the tree:
npm run regress -- --shot   # writes dist/tree.png

# 4. if you changed any skill ladder/tier/guidance, bump SKILL_LADDER_VER in index.html
# 5. ALWAYS bump the service-worker cache in sw.js:  operations-vNN -> vN+1
# 6. package the deliverables
npm run package      # regenerates icons, builds dist/operations.zip + dist/operations-preview.html
```

**Definition of done:** `npm run verify` passes with **0 `pageerror`**, the SW cache version is bumped, `SKILL_LADDER_VER` is bumped if any ladder changed, and `npm run package` has been run. Then tell the user to **hard-refresh / reopen the app** so the new service worker and any migration take effect.

> Benign console 404/403s from the headless test server (a font or icon fetch) are NOT `pageerror`s and don't fail the regression. Only uncaught JS errors do.

---

## Where things live in index.html

- **State & seed:** `const DEFAULT = {...}` (initial state, includes `_seeded`, `_skillLadderVer`), `load()`, `save()`, `render()`.
- **Skills:** `SK_CAT`, `SK_CAT_ORDER`, `SK_PATH_ICON` (category maps); `const SEED_SKILLS=[...]` (every skill). Rollups: `skSubsOf`, `skTopLevelInCat`, `skRolledLevel`, `catRolledLevel`. Decay/peak: `skEffectiveLevel`, `skUpdatePeak`. Level-up: `skReachLevel`.
- **Auto-leveling:** `syncSkillsFromActivity()` maps logged data → rungs; `rhrToLevel`, `integrityLevel`.
- **Migration:** `seedSkillsIfEmpty()` → `mergeNewSeedSkills()`; `SKILL_LADDER_VER`; the `RENAMES` map; manual `#resyncBtn` handler.
- **Tree:** `renderSkillTree()` (Yggdrasil SVG), `skLeafColor`, `_treeView`/`treeZoom`/`treeReset`/`_treeWireGestures`, `setSkView`.
- **Tabs:** `#sideNav button[data-tab=X]` ↔ `id=view-X`; ~50 `render*()` functions.
- **AFT:** `AFT_TABLES`, `aftLookup`, `clampScore`.

Use editor search; line numbers move after edits, so re-read a region before a second edit to it.

---

## Migrations — read before touching skills

The user's saves are often many versions old. `mergeNewSeedSkills()` must bring any old save fully current **without losing progress**. When you change skills:

- **Adding a skill:** just add it to `SEED_SKILLS`. The merge adds missing skills by name. Give it a full measurable ladder, `tiers` (top tier `upTo` == ladder length), `advance`/`maintain`/`roadmap` arrays whose lengths equal the ladder length, and the honesty/guidance copy.
- **Renaming a skill:** add `{from:"Old name", to:"New name"}` to the `RENAMES` array in `mergeNewSeedSkills()`. It carries the higher progress onto the new skill and removes the orphan. **Renaming without this leaves a duplicate old skill in old saves** — this was a real bug.
- **Changing any ladder/tier/guidance text:** **bump `SKILL_LADDER_VER`.** That triggers a one-time force-resync of all ladder content on old saves (progress numbers preserved).
- **Always test against a simulated old save:** strip the new skills/Paths, set a known progress (and seed `S.weight.promises` if testing Integrity), run the migration, and assert progress preserved + orphans merged + ladders correct + new Paths present. (The repo's regression starts from a fresh seed; for migration-specific checks, write a throwaway `_migtest.js` — files matching `_*` are git-ignored — and delete it after.)

---

## Tree (Yggdrasil) specifics

- 10 worlds: 7 in the crown on a radial fan, 3 in the roots (Self, Hearth, Roots).
- Placement is deterministic via `SLOT_BY_CAT` + polar math, spaced so **no path's foliage overlaps another's**. If you add a Path or change spacing, re-verify there's no overlap (centers must stay well apart relative to foliage radius) and screenshot with `npm run regress -- --shot`.
- Limbs must visibly **connect** the trunk to each world (swollen base, tapered tip into the disc edge). Root worlds connect via the drawn root.
- Keep CSS variables for colors; keep pan/zoom, leaf tooltips, and the List↔Tree toggle working.

---

## Style & conventions

- Match the existing code style (terse, no framework, lots of small helpers). No new dependencies.
- Keep copy in the app's honest, plain voice. Medical/health content stays "educational, not medical advice."
- Don't reformat or churn unrelated code. Small, surgical diffs.
- Never commit `dist/`, `node_modules/`, or scratch `_*` files (they're git-ignored).

When in doubt about scope or a design decision, ask the user — he iterates deliberately and cares about getting names and progressions right.
