# Next Session Prompt — Operations PWA

Paste this into a new Claude Code session to resume work.

---

You are continuing work on **Operations**, a gamified ROTC life-tracker PWA built for an Army ROTC cadet (Wyatt, MS2, Cyber branch goal). **Read all three of these before touching any code:**

1. `CLAUDE.md` — the binding rulebook (hard rules, workflow, file layout)
2. `planning/FINISHED-FEATURES.md` — design language, color palette, completed features, project identity
3. `planning/IMPROVEMENTS-v120.md` — the features to implement this session, with full rationale, implementation sketches, and CSS snippets

**Read `IMPROVEMENTS-v120.md` in full before writing a single line of code.** It is the authoritative spec for everything below. The implementation sketches, CSS, and data structures in that file are the designs to follow — do not improvise around them.

**Current version: v119.** The service worker is at `operations-v119` in `sw.js`. `SKILL_LADDER_VER` is currently **90** (in `src/core/migration.js`).

---

## What's already done — do not re-implement

All visual overhaul phases and features through v117 are complete. Full record in `planning/FINISHED-FEATURES.md`.

**v102–v109 (visual overhaul):**
- Phase 1: Skills tab → collapsible path decks, per-skill card anatomy with sigil, fill bar, tier label
- Phase 2: `skEmblemSvg` sigil system (10 paths × 5 tiers), Carved Rings overhauled to sigil grid
- Phase 3: All 18 tabs themed with `#view-*` scoped CSS; dark walnut wood grain; AFT 54px score; Dawn atmospheric strip

**v110 (10 features):** skill fading digest on Dawn, baseline test nudge, AFT sparkline, oath path breakdown, oath archive search, FM plan recommendation, daily order completion timestamps, skill decay grace period + amber at-risk state, qualification log with auto-skill advancement, FM beginner prescription.

**v111 (1 feature):** "practiced" button on every started non-auto skill card — resets fade timer without level change. Handler `skPractice(skId)` in `skills-core.js`; button in `skills.js` footer; CSS `.sk-practice-btn`.

**v112 (5 features):** skill search / quick-find (`#skSearch`, `_filterSkillDecks()` in `skills.js`), Dawn "skill of the day" (deterministic daily focal skill in `today.js` Field Notes), AFT event drill suggestions (`DRILL` object in `aft.js`, one-sentence prescription per event), boss sub-task checkpoints (`checkpoints:[]` on boss objects, inline checklist UI, migration in `state.js` load), profile weight trend line (linear regression slope → `±N lbs/month` in `profile.js`).

**v113 (5 features):** oath notes/why field (`q.notes`, textarea in add form, shown in list + archive), boss add-checkpoint inline form (input + `+` button on active boss cards, `data-baddcheckbtn` handler), weight goal + projection (`S.profile.weightGoal`, gap + weeks-to-goal using existing regression slope), skill "last practiced" date in card footer (`sk.lastQuestTs` → "practiced Nd ago"), daily orders stale warning (amber `⚠ stale` tag on orders not done in 7+ days).

**v114 (6 features):** boss checkpoint-driven HP (`cpDriven:true`, no free-hit strike button, "Conquer the Trial" only at `hp===1`, migration backfills existing checkpoint bosses), boss target date + daily pace (`b.targetDate`, `.boss-pace` row jade/ember), oath progress dispatch log (`q.updates[]`, `data-qupdateadd` handler, shown in archive), daily orders pause/resume (`d.paused`, `⏸` badge + Resume btn, excluded from perfect-day and stale), AFT per-event target scores (`S.aftEventTargets`, collapsible target-setter, `↑ N to target` / `✓ target` per event row), skill target level marker (`.sk-tgt-tick` gold tick on fill bar, `.sk-tgt-foot` footer note, set via `data-sktgtlv` input in Work panel).

**v115 (5 features, Feature 2 was pre-existing):** Wall bulk-entry wizard (`.wall-bulk-toggle`/`.wall-bulk-panel` on all 5 Wall sections; `_bulkSetup()` helper; pipe-separated parse), Academic Honors section (`S.academicHonors[]`, "📚 Academic" sub-nav tab, `renderAcademicHonors()`, `.aw-card` reuse), ROTC Record section (`S.rotcRecord: {positions,competitions,campResults}`, "⭐ ROTC" sub-nav tab, `renderRotcRecord()`, `.rotc-item` cards with jade left-border, 3 collapsible sub-sections), Language proficiency + clearance on Profile (`S.profile.languages[]`/`clearance{}`, `renderLanguages()`, `.lang-item`/`.ilr-badge`), Wall → résumé copy (`copyWallResume()`, "📋 Copy résumé" `.wall-resume-btn` in Wall header, multi-section plain-text clipboard output).

**Skills expansion (between v115 and v116):** 7 new SEED_SKILLS added to `src/core/skills-data.js`; `SKILL_LADDER_VER` bumped to **86**. Total skill count was **100**. New skills: Competitive distance running, Programming (Java), Programming (JavaScript), Parliamentary procedure, Higher mathematics, Languages group node, German. Do NOT re-add these — check `src/core/skills-data.js` first.

**v116 (6 features + 4 new skills + 3 ladder improvements):** GPA semester history log on Profile (`S.gpaHistory[]`, `renderGpaHistory()`, sparkline, `data-gpadel`), quals catalog expansion (5 new entries + `custom` option with `qualCustomName` input), counseling bulk import (`.wall-bulk-toggle` in records.html, inline parser in records.js), Dawn academic snapshot (`academicHtml` block in `renderToday()`, `.acad-strip`/`.dl-badge`), membership active/past filter (`_mbFilter`, `.mb-filter-bar` buttons, filter logic in `renderMemberships()`). New skills: Radio communications, OPSEC / digital security, Negotiation & influence, Reading speed. Ladder improvements: Networking advance[2]+[7] cert milestones; Cybersecurity fundamentals expanded to 9 levels; Programming Python/Java/JavaScript L8 advance entries clarified. `SKILL_LADDER_VER` bumped to **87**. Total skills: **104**.

**v117 (6 features + 2 new skills + 2 ladder improvements):** Reading speed in-app timed passage test (4 passages, WPM + comprehension self-check, stores to `S.tests[]`, auto-levels skill), OML snapshot panel on Today tab (GPA/AFT/MS eval in one view), Boss archive (conquered bosses get `completedAt` date, split into active/archived with collapsible `<details>`), Skill decay heat-map (91-day calendar toggle on Skills tab, colored by activity density), Counseling follow-up alert on Today tab (7-day or overdue warning), Skill notes (practice textarea in Work panel, stored in `history[]`, shown in `sk-log-recent`). New skills: Memory retention (auto:`quiz:retention`, 10-level SRS ladder). Ladder improvements: Radio communications `howTo` now references FM 6-02; Reading speed `howTo` rewritten for in-app test. `SKILL_LADDER_VER` bumped to **88**. Total skills: **105**.

**v118 (3 features + 1 new skill + 2 ladder improvements):** Quest step tracking (optional `steps` count on oath creation, jade fill-bar progress display, `+1 step` button auto-completes when full, `q.steps`/`q.progress` fields), Skill mastery summary bar (`#skSummaryBar` above search bar in Skills tab — active/maxed/at-risk/decayed counts with color-coded chips), Counseling search & filter (type filter bar + text search in Records tab, `_cnFilter`/`_cnSearch` module vars, `renderCounsel()` updated). New skill: First aid / TCCC (`tactical / Soldier tasks`, fadeDays:180, 9-level TCCC ladder). Ladder improvements: Negotiation & influence `howTo` adds FM 6-22 reference; Memory retention `howTo` clarifies self-reported leveling. `SKILL_LADDER_VER` bumped to **89**. Total skills: **106**.

**v119 (7 features + career-stage target system):** Career-stage skill targets (auto goal-line ticks on skill cards from `targets:{MS1…O1}` in seed data, `careerStage()` in migration.js, dim next-stage secondary tick in leafCard), Habit streak calendar (60-day perfect-day calendar on Dailies with `S.dailyHistory[]`), Skill export / print view (📋 copy-to-clipboard skills summary button in Skills toolbar), Qualification expiry alerts on Today tab (60-day look-ahead, expired overdue styling), Boss sprint mode (`b.todayCommit`, daily HP commitment bar with progress + missed warning), Weekly training load summary in Today Field Notes (sessions/mi/reps from `S.workouts[]`), GPA goal + projected graduation GPA (linear regression through semester history, jade/ember vs. goal). `SKILL_LADDER_VER` bumped to **90**. SW bumped to `operations-v119`.

---

## Features to implement this session

These are drawn from `planning/IMPROVEMENTS-v119.md`. Read that file now — the sketches here are summaries only.

---

*Features for this session are in `planning/IMPROVEMENTS-v120.md`.*

---

## How to work — the exact process used every session

Follow this exactly, in order:

### Phase 0 — Orient before writing a single line
1. Read `CLAUDE.md`, `planning/FINISHED-FEATURES.md`, and `planning/IMPROVEMENTS-v118.md` in full.
2. For each feature, read the **specific source files** that will be touched before editing them:
   - Use `Grep` to find where the function/element you're adding near lives.
   - Use `Read` with `offset` + `limit` to read the exact surrounding code.
   - Never edit a file you haven't read in this session — the Edit tool will reject it and you'll break context.
3. Use `TodoWrite` to lay out all tasks as `pending` before starting any of them.

### Phase 1 — Implement one feature at a time
4. Mark the first task `in_progress`.
5. Edit source files in `src/` only — **never touch `index.html`**.
6. For each file edit: read the relevant block first, make a surgical diff. Match existing code style exactly (terse, no framework, small helpers).
7. After all edits for a feature: mark the task `completed` immediately.
8. Move to the next task.

### Phase 2 — Build and verify after each batch (or at the end for low-risk changes)
9. `python scripts/build.py` — assemble `index.html`. Must print `OK index.html`.
10. `npm run check` — syntax-check the assembled script. Must print `SYNTAX OK`.
11. `npm run regress` — headless 18-tab test. Must print `PAGEERRORS 0`. Fix any pageerrors before continuing.
12. If a build or check fails: read the error, find the source file that's wrong, fix it, rebuild.

### Phase 3 — Ship
13. Bump `sw.js`: `operations-v117` → `operations-v118` (increment once per session; increment again if you ship a second batch).
14. Bump `SKILL_LADDER_VER` in `src/core/migration.js` (currently **90**) **only** if any skill ladder/tier/guidance text changed.
15. `npm run package` — produces `dist/operations.zip`. Must complete without error.
16. Delete the now-implemented improvements doc: `rm planning/IMPROVEMENTS-v118.md`. It has been recorded in `FINISHED-FEATURES.md` — no need to keep the draft.
17. **Create the next session's improvements doc** — write `planning/IMPROVEMENTS-v119.md` (increment to match the next version). Populate it with the best 5–6 features you'd suggest next, ranked by cadet impact, following the same format as the doc you just deleted: feature title, value paragraph, implementation sketch with file names + code snippets, CSS. Ask Wyatt if he has specific requests before writing it, but default to writing it if he doesn't respond.
18. **Update `NEXT-SESSION-PROMPT.md`** — change every `v117`/`v118` reference to the new version numbers so the next session prompt is self-consistent (the improvements doc name, the SW bump line, the "what's already done" blurb).
19. Tell Wyatt to **hard-refresh / reopen the app** so the new service worker activates and any migrations run.

### What not to do
- Don't read reference docs and then skip reading the actual source files — the code is what matters.
- Don't edit more than one feature's files in a single batch before building/checking.
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
# bump sw.js: operations-v119 → operations-v120
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

---

## Tone constraints

Wyatt values: honesty, measurability, privacy, preserved progress, Yggdrasil symbolism. Keep copy plain and honest — no hype, no fake metrics. Ask before large architectural changes. Small surgical diffs.
