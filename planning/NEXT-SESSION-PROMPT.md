# Next Session Prompt — Operations PWA

Paste this into a new Claude Code session to resume work.

---

You are continuing work on **Operations**, a gamified ROTC life-tracker PWA built for an Army ROTC cadet (Wyatt, MS2, Cyber branch goal). **Read all of these before touching any code:**

1. `CLAUDE.md` — the binding rulebook (hard rules, workflow, file layout)
2. `planning/FINISHED-FEATURES.md` — design language, color palette, completed features, project identity
3. `planning/IMPROVEMENTS-v140.md` — the features to implement this session, with full rationale, implementation sketches, and CSS snippets
4. `planning/IMPROVEMENTS-skills-expansion.md` — the comprehensive skills backlog (60+ new skills across all paths, with ladder sketches and tier names); consult this whenever adding skills so you don't duplicate effort or miss obvious gaps

**Read `IMPROVEMENTS-v140.md` in full before writing a single line of code.** It is the authoritative spec for everything below. The implementation sketches, CSS, and data structures in that file are the designs to follow — do not improvise around them.

**Current version: v139.** The service worker is at `operations-v139` in `sw.js`. `SKILL_LADDER_VER` is currently **108** (in `src/core/migration.js`).

---

## What's already done

Full history is in `planning/FINISHED-FEATURES.md`. Do not re-implement anything listed there. Current skill total: **1201**.

### Pyramid state (the active multi-session workstream)

The app has a card-game pyramid system where skills form a 5-tier synthesis chain: Common → Uncommon → Rare → Legendary → Mythic. Five paths have complete pyramid builds through the Uncommon layer:

**Physical pyramid — complete through Uncommon layer (v126–v130):**
- 1 Mythic, 5 Legendaries, 25 Rares, 125 Uncommons across 5 clusters. All Uncommons have `synthesizedFrom:"phys_c_*"` for future Common layer.

**Tactical pyramid — complete through Uncommon layer (v131–v135):**
- 1 Mythic ("Tactical Mastery"), 5 Legendaries, 25 Rares, 125 Uncommons across 5 clusters. All Uncommons have `synthesizedFrom:"tac_c_*"`.

**Leadership pyramid — complete through Uncommon layer (v135):**
- 1 Mythic ("Battlefield Commander"), 5 Legendaries, 25 Rares, ~121 Uncommons across 5 clusters. All have `synthesizedFrom:"lead_c_*"`.

**Technical pyramid — complete through Uncommon layer (v136):**
- 1 Mythic ("Cyberspace Operations Officer"), 5 Legendaries, 25 Rares, 125 Uncommons across 5 clusters. All Uncommons have `synthesizedFrom:"tech_c_*"`. 21 existing technical skills wired.

**Cognitive pyramid — complete through Uncommon layer (v137):**
- 1 Mythic ("Master of the Mind"), 5 Legendaries, 25 Rares, ~124 Uncommons across 5 clusters. All Uncommons have `synthesizedFrom:"cog_c_*"`. 11 existing cognitive skills wired as Rares; 2 as Uncommons. Memory technique, Memory retention, Typing speed & accuracy, and Second language retention left standalone.

**Physiological pyramid — complete through Uncommon layer (v138):**
- 1 Mythic ("Vital Operator"), 5 Legendaries, 25 Rares, 125 Uncommons across 5 clusters. All Uncommons have `synthesizedFrom:"phys2_c_*"`. 7 existing physiological skills wired.

**Academic pyramid — complete through Uncommon layer (v139):**
- 1 Mythic ("Scholar-Warrior"), 5 Legendaries, 25 Rares, 125 Uncommons across 5 clusters. All Uncommons have `synthesizedFrom:"acad_c_*"`. 17 existing academic skills wired.

**3 paths with NO pyramid yet:** personal, hearth, roots.

**Active workstream:** Build Mythic + Legendaries + Rares + Uncommons for all 3 remaining paths, **one path per session**, before adding Commons to any path. Commons come after all paths are complete.

**Session sequence:**
- v139: academic path ✓ done
- v140: personal path ← **this session**
- v141: hearth path
- v142: roots path
- v143+: Common layers for all paths

---

## Features to implement this session

*See `planning/IMPROVEMENTS-v140.md` for the full spec.*

**This session goal:** Build the complete Personal path pyramid (Mythic + 5 Legendaries + 25 Rares + 125 Uncommons), then wire 20 existing personal skills into the pyramid by adding setKey + synthesizedFrom. One path per session — do not start Hearth until Personal is fully done and verified.

At the end of the session, write `planning/IMPROVEMENTS-v141.md` for the Hearth path (template is at the bottom of IMPROVEMENTS-v140.md).

---

## How to work — the exact process used every session

Follow this exactly, in order:

### Throughput expectation
**Each session targets 100–200 new skills.** The improvements doc specifies multiple clusters or entire path layers per session — not a single 25-skill cluster. Do not stop after the first cluster. The total skill goal is 1000+; getting there requires batching aggressively.

### Phase 0 — Orient before writing a single line
1. Read `CLAUDE.md`, `planning/FINISHED-FEATURES.md`, and `planning/IMPROVEMENTS-v139.md` in full.
2. For each cluster or feature block, read the **specific source files** that will be touched before editing them:
   - Grep `src/core/skills-data.js` for existing skills in the relevant cat before writing seeds.
   - Use `Read` with `offset` + `limit` to read the exact surrounding code.
   - Never edit a file you haven't read in this session — the Edit tool will reject it and you'll break context.
3. Use `TodoWrite` to lay out all tasks as `pending` before starting any of them. One task per cluster/block, not per file.

### Phase 1 — Implement one cluster at a time
4. Mark the first cluster task `in_progress`.
5. Edit source files in `src/` only — **never touch `index.html`**.
6. For each file edit: read the relevant block first, make a surgical diff. Match existing code style exactly (terse, no framework, small helpers).
7. After all edits for a cluster: mark the task `completed` immediately. Move to the next cluster without stopping to build (build at phase 2).
8. Repeat until all clusters in the improvements doc are complete.

### Phase 2 — Build and verify (once per session, or after every 50–75 skills)
9. `python scripts/build.py` — assemble `index.html`. Must print `OK index.html`.
10. `npm run check` — syntax-check the assembled script. Must print `SYNTAX OK`.
11. `npm run regress` — headless 18-tab test. Must print `PAGEERRORS 0`. Fix any pageerrors before continuing.
12. If a build or check fails: read the error, find the source file that's wrong, fix it, rebuild.

### Phase 3 — Ship
13. Bump `sw.js`: `operations-v139` → `operations-v140` (increment once per session; increment again if you ship a second batch).
14. Bump `SKILL_LADDER_VER` in `src/core/migration.js` (currently **108**) if any ladder changed.
15. `npm run package` — produces `dist/operations.zip`. Must complete without error.
16. Delete the now-implemented improvements doc: `rm planning/IMPROVEMENTS-v140.md`. It has been recorded in `FINISHED-FEATURES.md` — no need to keep the draft.
17. **Create the next session's improvements doc** — write `planning/IMPROVEMENTS-v141.md` for the next batch.
18. **Update `NEXT-SESSION-PROMPT.md`** — change every `v139`/`v140` reference to the new version numbers so the next session prompt is self-consistent.
19. Tell Wyatt to **hard-refresh / reopen the app** so the new service worker activates and any migrations run.

### What not to do
- Don't read reference docs and then skip reading the actual source files — the code is what matters.
- Don't stop after one cluster and call it done — the improvements doc specifies multiple clusters per session.
- Don't add error handling, fallbacks, or validation for scenarios that can't happen.
- Don't add comments explaining what the code does — only the why if it's non-obvious.
- Don't restructure or reformat unrelated code while making a targeted change.

---

## Required workflow summary

```bash
# After every feature or batch of changes:
python scripts/build.py       # must say OK
npm run check                 # must say SYNTAX OK
npm run regress               # must say PAGEERRORS 0

# After all features, before reporting done:
# bump sw.js: operations-v139 → operations-v140
npm run package               # produces dist/operations.zip
```

---

## Key architecture reminders

- `index.html` is **assembled output** — edit `src/`, then build
- All data in `localStorage["operations_v2"]` via `S = load()`; `DEFAULT` is in `src/core/constants.js`
- `skLeafColor(eff, max, sk?)` → `rgb(r,g,b)` string; optional `sk` returns amber if at-risk
- `skEffectiveLevel(sk)` → working level accounting for decay + 20% grace, floors at 1 if started
- `skFadeState(sk)` → `"current" | "at-risk" | "decayed"`
- `skDaysLeft(sk)` → days until actual decay (after grace); null if not started
- `skPractice(skId)` → resets fade timer without level change (non-auto, started skills only)
- `skReachLevel(skId, targetLevel, note?)` → levels up to targetLevel, stores optional note in history
- `skEmblemSvg(sk, eff, max)` — sigil generator in `skills.js`, also used in `trophies.js`
- `miniSparkline(values, w, h)` — small SVG sparkline, defined in `state.js`
- `toast(msg)` — bottom toast, defined in `events.js`
- `PATH_META` — path metadata (name, icon, color, world, lore), in `constants.js`
- `SK_PATH_ICON` — path → emoji map, in `tree.js`
- `renderBosses()` lives in `src/core/state.js` (not a dedicated bosses.js)
- All CSS in `src/styles/main.css` — no per-tab CSS files
- Regression covers **18 tabs** (see `scripts/regress.js`)
- No network calls, no CDN fonts, no telemetry — ever

**Pyramid system:**
- `skRarity(sk)` — rarity from explicit `rarity` field or ladder depth (≤4 Common, 5-7 Uncommon, 8-10 Rare, 11-13 Legendary, 14+ Mythic, auto/joker Joker)
- `skSeedOf(name, cat)` — find a skill's seed in SEED_SKILLS
- `skSetMembers(setKey)` — all non-group seeds with matching setKey
- `skSetMasteredCount(setKey)` / `skSetCanCombine(setKey)` — set progress
- `skCombineSet(setKey)` — sets `synthesisUnlocked=true`, saves, renders
- `SYNERGY_PAIRS` — 15 complementary skill pairs; `skHasSynergy(sk)` — partner at L4+?
- Seeds use: `rarity`, `setKey`, `synthesizedFrom`, `unlockHint` fields
- Live skills use: `synthesisUnlocked` (boolean, the only pyramid field on live data)
- Live skills use: `pyramidResetApplied` (int, set once when skill first gains setKey — prevents re-wipe)
- Side Deck (unstarted leaves): collapsible `<details class="sk-side-deck">` in `skills.js`
- Face-down card function: `faceDownCard(sk, suit, rank, isSynthPending)` in `skills.js`
- Combine button handler: `data-skcombine` in `events.js` delegation
- Chain view: `renderSynthesisChain(cat)` in `skills.js`; toggle `.sc-toggle[data-sctoggle]` wired post-render; output in `.sc-wrap#sc-{cat}`

**Existing skill integration rule (applies every session that builds out a path cluster):**
When arriving at a new cluster, first grep existing `SEED_SKILLS` for that `cat` and audit ladder depths. Assign each existing skill that fits by adding `setKey` (and if needed `rarity` or `synthesizedFrom`) directly to its seed object. Rules:
- Existing skills fill slots, not complete sets. At most 2 existing skills per set of 5; never all 5 from existing seeds.
- A skill that covers multiple aspects is OK as one slot — its extra aspects are represented by other new seeds.
- Don't force every existing skill into the pyramid. If one doesn't fit, leave it without a setKey.
- Sets must have exactly 5 members. If a set already has 5, an existing skill cannot be added.
- Add explicit `rarity` field when the depth-based auto-rarity is wrong for the skill's role.

**Progress reset rule — intentional, permanent, user-authorized:**
> *"I want to be a blank slate even if I have in the past reached a certain level. I want to go back to basics and earn progress."*

When an existing skill gains a `setKey`, its live progress is wiped (`currentLevel→0`, `history→[]`, `lastQuestTs→null`). It moves from the face-up deck into the Side Deck. `pyramidResetApplied` flag prevents re-wipe on subsequent migrations. Already implemented in `src/core/migration.js` — no changes needed unless adding new pyramid paths.

---

## Tone constraints

Wyatt values: honesty, measurability, privacy, preserved progress, Yggdrasil symbolism. Keep copy plain and honest — no hype, no fake metrics. Ask before large architectural changes. Small surgical diffs.
