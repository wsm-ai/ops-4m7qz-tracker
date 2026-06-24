# Next Session Prompt — Operations PWA

Paste this into a new Claude Code session to resume work.

---

You are continuing work on **Operations**, a gamified ROTC life-tracker PWA built for an Army ROTC cadet (MS2, Cyber branch goal). Read `CLAUDE.md` first — it is the binding rulebook. Then read `docs/OPERATIONS-HANDOFF.md` for full architecture. Then read `planning/VISUAL-OVERHAUL-PROMPT.md` for the visual redesign spec and phase tracker.

**Current version: v102.** The service worker is at `operations-v102` in `sw.js`.

### What was just completed (v102 — Visual Overhaul Phase 1)

**Phase 1 — Skill cards + deck UI** is complete:

- Skills tab transformed from a flat list into a collapsible deck-based card interface
- Each path (tactical, physical, cognitive, etc.) is now a `.sk-deck` with a collapsible header showing path icon, name, world level, skill count, and fading count badge
- The most recently active path (highest `pathXP[cat]`) is expanded by default; all others collapsed
- Each skill card (`leafCard()`) redesigned: header band with "PATH OF X" + Lv N/Max, center emblem placeholder (Phase 2 will fill this in), skill name (large, centered), tier label, level fill bar, footer with fade warning + copy button, corner accents via `::before`/`::after`, and detailed ladder/history in a collapsible `<details>` element
- Jump bar navigation and tree-tap navigation both now open the target deck when navigating to it
- Files changed: `src/tabs/skills.js`, `src/styles/main.css`, `src/core/tree.js`, `src/tabs/awards.js`
- `npm run regress` passes with 0 pageerror, SKILL AUDIT `{badCount: 0}`

### What was just completed (v101)

All 10 v101 features implemented + full Yggdrasil theme sweep:

1. **Fix skill XP → pathXP.academic (bug)** — silent XP was writing to `S.skills.knowledge.xp` (dead path); fixed in `src/core/skills-core.js` and `src/tabs/quizzes.js` to write `S.pathXP.academic` instead
2. **Post-log adaptive target toast** — after logging a workout in `src/tabs/log.js`, computes before/after adaptive targets and appends "· 🎯 N targets updated" to the toast when any change
3. **AFT per-event delta on Dawn** — `renderToday()` in `src/tabs/today.js` compares last two AFT records, surfaces per-event drops (DL/HRP/SDC/Plank/Run) with individual deltas in Field Notes
4. **Quest snooze fatigue counter** — `q.snoozeCount` incremented in `src/core/events.js` on each +3d; `renderQuests()` in `src/core/state.js` shows `<span class="oath-postpone-warn">postponed N×</span>` badge when ≥2 snoozes
5. **Habit 7-day consistency summary** — `renderHabits()` in `src/tabs/dailies.js` prepends a `<div class="orders-week-summary">` row with avg % and lagging habit names; PR star gold on best streak with `.at-peak` CSS class
6. **Commissioning memento card** — `renderToday()` in `src/tabs/today.js` handles `daysLeft<=0`: day-of gets `"today is the day"` banner; post-commission shows days-of-service counter
7. **Weight mirror sync-recency footer** — `<div class="weight-sync-footer" id="wmSyncFooter">` in `src/tabs/weight.html`; `renderWeight()` in `src/tabs/weight.js` populates with "Last synced N days ago · M entries"
8. **Tree leaf tap → skill card** — `data-skid` attributes on leaf circles in `src/core/tree.js`; click handler (with `_moved` guard for pan vs tap) navigates to Skills tab and scrolls to the correct category
9. **Yggdrasil skill card theming** — `leafCard()` in `src/tabs/skills.js` adds colored left border, world path badge (`sk-card-world`), and level fill bar (`sk-level-bar`) using `skLeafColor()` output
10. **Full Yggdrasil theme sweep** — vocabulary (`"FIELD BRIEF"`, `"forge-back"`, `"forge-recovery-card"`), discipline log color semantics (0% → `--line`), body background radial gradients for atmospheric depth, CSS class renames throughout

### Your task

Implement the features from `IMPROVEMENTS-v102.md` in the recommended order. Start with features 1–2 (both in `today.js`, low effort, high daily impact), then 3 (AFT sparkline), then 4–5 (oath balance + plan recommendation), then 6–7 (search + time tracking), then 8 (grace period, most complex).

**Required workflow for every change:**
1. Edit source files in `src/` only — never touch `index.html` directly
2. Run `python scripts/build.py` after each feature to rebuild
3. Run `npm run check` (syntax check) and `npm run regress` (headless tab test, 17 tabs) to verify
4. Bump `sw.js` cache to `operations-v102` once all features are done
5. Run `npm run package` to produce the final zip

**After implementing the features in `planning/IMPROVEMENTS-v102.md`, do two more things:**

1. **Suggest 5–8 more improvements** based on what you observe in the codebase and what would genuinely help a cadet using this daily. Apply the same filter: honest, offline-safe, no fake metrics, no personal data pre-loaded. Rank them by impact.

2. **Create `planning/IMPROVEMENTS-v103.md`** with those new suggestions, formatted the same way — each with a value statement and implementation sketch. Also update `planning/NEXT-SESSION-PROMPT.md` to reflect the new version and what was completed.

### Key architecture reminders

- `index.html` is **assembled output** — edit `src/`, then build
- All data lives in `localStorage` key `"operations_v2"` via `S = load()`
- `pathXP` replaces the old `S.skills.{fitness,tactics,...}.xp` system (migrated in v91–92) — new XP grants must write to `S.pathXP[path]`, NOT `S.skills.*`
- `S.dailies` = daily orders (check-off), `S.quests` = oaths (complete-once missions)
- `S.aft` = array of `{date, raw, scores:{dl,hrp,sdc,plank,run}, total}`
- `S.profile` = `{birthdate, sex, bloodType, commissionDate, gpa}`
- `S.habits` = array of `{id, name, linkedSkill, streak, bestStreak, lastDone, graceUsed, history:[]}`
- `S.workouts` = workout log; `S.ptLog` = cadre PT log; `S.baselines` = monthly max-effort tests
- `S.questArchive` = completed oaths archive (added v97) — array of `{...quest, completedDate}`
- `S.streakLog` = daily order completion rates (added v98) — array of `{date, pct}`, last 90 days
- `S.streakBrokenDate` = YYYY-MM-DD when streak last broke (added v99), cleared after 3 recovery days
- `q.snoozeCount` = number of times an oath has been postponed (added v101, defaults absent=0)
- `miniSparkline(vals, W, H)` helper in `src/core/state.js` — reuse for any mini trend chart
- `skLeafColor(eff, max)` in `src/core/skills-core.js` returns an `rgb(r,g,b)` string (NOT a CSS var) — use directly in style attributes
- `skDaysLeft(sk)` — available in `today.js` scope for computing days until fade; returns null if not started
- `_hbView` — module-level map in `src/tabs/dailies.js` for per-habit view state (strip|month)
- Auto skills (anything with `auto:` field in SEED_SKILLS) are never self-reportable
- Regression test covers **17 tabs** (`TABS` in `scripts/regress.js`)
- No network calls, no CDN fonts, no telemetry — ever

### Files most likely to touch for v102

| Feature | Files |
|---|---|
| Fading-soon digest on Dawn | `src/tabs/today.js` |
| Baseline test nudge on Dawn | `src/tabs/today.js` |
| AFT score history sparkline | `src/tabs/aft.js`, `src/styles/main.css` |
| Qualification log + auto-leveling | `src/core/constants.js`, `src/core/state.js`, `src/tabs/awards.js`, `src/tabs/awards.html`, `src/styles/main.css` |
| Oath path breakdown | `src/core/state.js`, `src/styles/main.css` |
| FM weekly goal from AFT gap | `src/tabs/plan.js`, `src/styles/main.css` |
| Oath archive search | `src/core/state.js`, `src/core/events.js`, `src/styles/main.css` |
| Daily order completion time | `src/core/events.js`, `src/tabs/today.js` |
| Skill decay grace period | `src/core/skills-core.js`, `src/core/tree.js` |

### Tone and constraints

The user (Wyatt) values: honesty, measurability, privacy, preserved progress, and the Yggdrasil symbolism. He is sharing this tool with other cadets in his unit. Default to asking before large architectural changes. Keep copy plain and honest — no hype, no fake metrics.
