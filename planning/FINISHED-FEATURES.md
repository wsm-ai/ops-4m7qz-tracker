# Operations PWA — Finished Features & Project Reference

This document is the permanent record. It holds all completed features, visual overhaul phases, and the project's design language and architecture. Use it as a reference when continuing work — you do not need to re-derive what's already been built.

---

## Project Identity

**Operations** is a gamified ROTC + life-tracker Progressive Web App built for one Army ROTC cadet (Wyatt, MS2, Cyber branch goal). It ships as a single `index.html` assembled from `src/` via `python scripts/build.py`. No framework, no dependencies, no CDN, no network calls. All data lives in `localStorage` key `operations_v2`.

### Core values
- **Honesty** — only real, evidence-based metrics. Skill levels describe what you can *do*, never status labels. Top level = documented human ceiling.
- **Measurability** — every skill has a ladder of verifiable benchmarks.
- **Privacy** — fully offline. No telemetry, no uploads, no accounts.
- **Preserved progress** — migrations never lose a level, peak, or history entry.
- **Symbolism** — the Yggdrasil / Norse world-tree theme is a feature, not decoration.

---

## Design Language & Themes

### The Yggdrasil World

The app's organizing metaphor is Yggdrasil, the Norse world-tree. Every skill is a leaf on the tree. Every path is a world within the tree. Progress is expressed as growth: leaves brighten from cold gray to ember gold as levels rise.

**Ten paths (worlds):**

| Key | Path name | World | Icon | Color |
|---|---|---|---|---|
| `tactical` | Path of War | Fólkvangr | ⚔️ | `--blood: #9c4a34` brick red |
| `physical` | Path of the Body | Midgard | 🌿 | `--jade: #6f9e54` OD green |
| `cognitive` | Path of the Mind | Well of Mimir | 🌀 | `--violet: #7c93a8` slate blue |
| `physiological` | Path of Vitality | Asgard | ❤️ | `--jade: #6f9e54` OD green |
| `technical` | Path of the Craft | Nidavellir | ⚙️ | `--ember: #c8772e` signal amber |
| `leadership` | Path of Command | Valhalla | ⭐ | `--gold: #b8a06a` coyote tan |
| `academic` | Path of Knowledge | Jotunheim | 📚 | `--gold: #b8a06a` coyote tan |
| `personal` | Path of the Self | Alfheim | 🌱 | `--jade: #6f9e54` OD green |
| `hearth` | Path of the Hearth | Vanaheim | 🔥 | `--ember: #c8772e` signal amber |
| `roots` | Path of Roots | Niflheim | 🌾 | `--jade: #6f9e54` OD green |

### Color palette (CSS variables — current as of v109)

```
--bg:          #14160f    (dark forest green-black — body background)
--panel:       #1c1f15    (card / panel background)
--panel-2:     #252a1c    (nested card / inner panel)
--line:        #343a26    (border default)
--ink:         #e8ead9    (primary text)
--ink-dim:     #a4ab8e    (secondary text)
--ink-faint:   #6e7459    (muted text)
--gold:        #b8a06a    (coyote tan — earned / peak)
--gold-bright: #d9c48a    (light tan — highlight / header)
--ember:       #c8772e    (signal amber — warning / fading / fire)
--jade:        #6f9e54    (OD green — growth / promote)
--violet:      #7c93a8    (slate blue — cognitive / memory)
--blood:       #9c4a34    (brick red — tactical / danger)
--shadow:      0 8px 30px rgba(0,0,0,.6)
```

### Body background layers (v109)

The body uses a stacked `background` of 7 layers (top to bottom):
1. Crown of Yggdrasil — `radial-gradient` gold ellipse from above (rgba(184,160,106,.14))
2. Deep roots — `radial-gradient` jade tinge from below (rgba(111,158,84,.11))
3. Side vignettes — two `radial-gradient` forest shadows on the flanks
4. **Dark walnut annual rings** — `repeating-linear-gradient` at 90° (rgba(120,65,12,.13))
5. **Medium grain bands** — `repeating-linear-gradient` at 89.4° (rgba(165,92,18,.15))
6. **Fine tight grain** — `repeating-linear-gradient` at 88° (rgba(185,105,22,.16))
7. Base solid color — `var(--bg)` (#14160f)

The wood grain (layers 4–6) creates a dark walnut table texture, warm amber against the forest-green base, visible in the gaps between panel cards.

### Visual character

- Background: dark forest green with wood grain texture and Yggdrasil atmospheric gradients.
- Cards: `.card` surfaces also carry subtle grain (`repeating-linear-gradient` at 88°/89.5°, opacity 0.05–0.06) layered above the panel gradient.
- Typography: slightly loose letter-spacing on labels; small-caps for path names and military titles; `ui-monospace` for scores and data.
- Icons: emoji for path/tab icons (avoids font loading); SVG for all skill emblems (inline, generated in JS).
- Per-tab atmosphere: each of the 18 tabs has scoped `#view-*` CSS giving it a distinct chamber feel (see Phase 3 below).

---

## Architecture Summary

```
src/
  _shell.html              outer HTML frame (head, nav, footer, modals, script tags)
  styles/main.css          all CSS
  core/
    constants.js           DEFAULT, TRACKS, VALUES, PATH_META, SESSIONS
    training.js            WEATHER, WEEK_PLAN, EX_HOWTO, PT_AREAS
    state.js               KEY, load(), save(), render(), esc(), miniSparkline()
    events.js              nav/body event delegation, add-buttons, backup, toast
    aft-scoring.js         AFT_TABLES, aftLookup(), score_* helpers
    app-setup.js           skills-UI wiring, award/event editors, cloud sync
    skills-data.js         SK_CAT, SK_CAT_ORDER, SK_PATH_ICON, SEED_SKILLS
    migration.js           SKILL_LADDER_VER, RENAMES, mergeNewSeedSkills()
    auto-level.js          syncSkillsFromActivity(), integrityLevel(), rhrToLevel()
    skills-core.js         skEffectiveLevel, skRolledLevel, skLeafColor, skDaysLeft, etc.
    tree.js                SK_PATH_ICON, Yggdrasil SVG renderer, pan/zoom
    init.js                SW register, seedSkillsIfEmpty(), render()
  tabs/
    today.{html,js}        Dawn dashboard
    quests.{html,js}       Oaths (mission list)
    dailies.{html,js}      Orders (daily habits)
    bosses.{html,js}       Objectives (HP bars)
    board.{html,js}        Branch-prep task board
    shop.html              R&R reward shop
    quizzes.{html,js}      ROTC quiz + SRS
    aft.{html,js}          AFT scoring
    profile.{html,js}      Profile + Apple Health import
    test.{html,js}         Cognitive tests, SRS, memory palace
    log.{html,js}          Workout log, PT, baseline testing
    skills.{html,js}       Skills tab (deck card view + sigil system)
    plan.{html,js}         FM training plan
    awards.{html,js}       The Wall (awards, events, volunteer hours)
    records.{html,js}      History, counseling log, checklists
    weight.{html,js}       Promise ledger
    garden.{html,js}       Grove of the World Tree (path XP idols)
    trophies.{html,js}     Carved Rings (peak-level skill record)
```

**Build workflow:**
```bash
python scripts/build.py   # assemble index.html from src/
npm run check             # syntax-check assembled script
npm run regress           # headless 18-tab test, assert 0 pageerror
npm run package           # build zip + preview
```

**Key data paths:**
- `S = load()` — full state from `localStorage["operations_v2"]`
- `S.lifeSkills[]` — all skill objects with `.id, .cat, .levels[], .currentLevel, .peakLevel, .history[]`
- `S.pathXP{}` — XP per path key (feeds Garden and path level display)
- `skEffectiveLevel(sk)` — returns current working level (floors at 1 if started, accounts for decay)
- `skLeafColor(eff, max)` — returns `rgb(r,g,b)` string (cold gray at 0 → ember gold at max)
- `skDaysLeft(sk)` — days until the current level fades; null if not started or no fadeDays

---

## Completed Features by Version

---

### v96 — AFT Prep + Daily Engagement
**Files changed:** `src/core/constants.js`, `src/tabs/aft.{html,js}`, `src/tabs/today.js`, `src/tabs/log.{html,js}`, `src/core/events.js`, `src/core/init.js`

1. **AFT test date + per-event improvement math** — `S.aftTestDate` input on AFT tab; `aftPrepCard()` computes event-level improvement targets and days-to-test countdown.
2. **All-time personal records board** — `aftPrCard()` on AFT tab showing best-ever per-event score; `.aft-pr-card` CSS.
3. **Session log note field** — `<textarea id="lgNote">` on Log tab; note saved with each session entry.
4. **Quest / oath due dates** — `qDue` input, `due` field on quest object, `overdue` CSS class, overdues sorted first in the list.
5. **PWA install prompt on Dawn** — `beforeinstallprompt` captured, dismissed state in `DEFAULT`, install/dismiss card rendered in Field Notes.
6. **Push notifications for streak protection** — `Notification.requestPermission()` flow, `scheduleStreakNotif()` in `init.js`, opt-in card on Dawn.

---

### v97 — Habit Heat Maps + Weight Log
**Files changed:** `src/tabs/dailies.{html,js}`, `src/tabs/profile.js`, `src/tabs/log.js`, `src/tabs/quests.html`, `src/core/state.js`, `src/core/constants.js`, `src/core/events.js`, `src/tabs/today.js`, `src/tabs/plan.js`

1. **Habit streak calendar / heat-map** — `habitHeatMap()` in `dailies.js`; last-90-days heat grid, `.habit-heat-row` / `.heat-sq` CSS.
2. **Daily weight tracking on Profile** — weight log input, 30-day sparkline via `miniSparkline()`.
3. **PT session calendar (last 30 days)** — `.pt-cal-dot` grid in Log tab history; each session leaves a dot.
4. **Quest / oath archive** — `questArchive:[]` in DEFAULT, completed oaths pushed to archive, `#qArchive` rendered in Oaths tab.
5. **Session-level RPE** — `<select id="lgRpe">` on Log tab; saved with each session, shown in history.
6. **Dawn overdue oath count** — overdueCount computed and pushed to Field Notes with link to Oaths tab.
7. **Baseline test history sparkline** — `miniSparkline()` for each baseline (pushup/plank/2-mile) in Plan tab adaptive targets section.

---

### v98 — Discipline Tracking + Boss Sync
**Files changed:** `src/core/state.js`, `src/core/constants.js`, `src/tabs/today.js`, `src/tabs/aft.js`, `src/tabs/log.js`, `src/core/events.js`

1. **Quest sorting by urgency** — overdue first, then soonest due date, then no date; in `state.js` render.
2. **Active boss on Dawn tab** — `dawnBossHtml()` card showing highest-HP active objective.
3. **Habit best streak badge** — `hb-best` class shows all-time best run in each habit's header.
4. **Daily completion log (7-day discipline score)** — `streakLog:[]` in DEFAULT; 7-day bar chart `disciplineLogHtml()` on Dawn.
5. **AFT score drop detection** — `aftRegressionCard()` detects per-event regressions across last 2 tests, `.aft-regress` styling.
6. **Workout weekly volume summary** — `.week-summary` in Log history; sets/reps/exercises totaled for the current week.
7. **Printable daily OPORD** — `copyDailyBrief()` formats today's state as clipboard-ready text; triggered by Dawn copy button.

---

### v99 — Trophy System + Timeline
**Files changed:** `src/tabs/trophies.{html,js}`, `src/tabs/skills.js`, `src/tabs/dailies.js`, `src/tabs/plan.js`, `src/core/skills-core.js`, `src/core/events.js`, `src/core/constants.js`, `src/tabs/today.js`

1. **Rune name tooltips on Carved Rings** — `#trophyDetail` panel, click → reveals tier name, ability description, level date.
2. **Trophy unlock toast on skill level-up** — `getTierLabelForLevel` check in `skills-core.js` triggers 🏺 toast when a tier boundary is crossed.
3. **Skill level-history timeline** — collapsible history entries under each skill card; `.sk-hist-item` / `.sk-hist-sep` CSS.
4. **Per-event AFT delta badges** — inline `trend()` function in `aft.js` shows ▲/▼ per event vs. previous test.
5. **Habit streak calendar (monthly toggle)** — `habitMonthGrid()` adds calendar month grid view; toggle button switches heat vs. month.
6. **Baseline PR history cards** — `blPrCard()` in `plan.js`; best-ever for each baseline test shown in Plan tab.
7. **Oath completion time tracking** — `createdDate` set at creation; archive shows days-to-complete and age tag.
8. **Dawn streak-recovery mode** — `streakBrokenDate` in DEFAULT; `.recovery-mode-card` rendered for 3 days after streak break, guiding re-entry.

---

### v100 — Tree Decay + Navigation Polish
**Files changed:** `src/tabs/today.js`, `src/core/state.js`, `src/core/events.js`, `src/core/tree.js`, `src/tabs/skills.js`, `src/core/training.js`, `src/_shell.html`

1. **Path XP progress bar on Dawn** — `pathPipsHtml()` shows XP pips per path in the Dawn header row.
2. **Quest "snooze" (+3 days)** — `q-snooze` button; bumps due date, increments `snoozeCount`.
3. **Weekly training summary card on Dawn** — `weekTrainCardHtml()` + `weekTrainingStats()` shows this-week session count and type breakdown.
4. **Skill decay countdown ring on the Tree** — `pushFadeRing()` in `tree.js`; concentric amber ring around leaves within 20% of their fade window.
5. **Overdue oath count badge on nav button** — `<span class="nav-badge">` in nav, populated in `state.js`; visible in mobile strip and sidebar.
6. **AFT test countdown on Dawn** — days-to-AFT pushed to Field Notes from `S.aftTestDate`.
7. **Habit "grace day" visual indicator** — `graceIcon` (⏰ available, ⚠️ used) displayed in habit card header.
8. **Export / share a single skill card** — `sk-copy-btn` copies skill name + level + tier + ladder to clipboard.

---

### v101 — Theme Sweep + 9 Features
**Files changed:** `src/core/skills-core.js`, `src/tabs/today.js`, `src/core/events.js`, `src/tabs/dailies.js`, `src/tabs/aft.js`, `src/core/constants.js`, `src/tabs/weight.js`, `src/core/tree.js`, `src/tabs/skills.js`, `src/styles/main.css`

1. **Fix skill XP → pathXP.academic** — silent bug where leveling Knowledge skills credited wrong path; fixed in `skPass()` and `skReachLevel()`.
2. ~~Post-log adaptive target toast~~ — **NOT IMPLEMENTED.** The diff-before/after logic and "🎯 N targets climbed" toast was never added to `log.js`. Remaining in `IMPROVEMENTS-v101.md`.
3. **AFT per-event delta note on Dawn** — per-event deltas vs. previous test pushed to Field Notes with 📉 icon and link.
4. **Quest snooze fatigue counter** — `q.snoozeCount` incremented; `.oath-postpone-warn` badge shown when count > 1.
5. **Habit 7-day consistency summary** — `.orders-week-summary` bar above the daily list; this-week done/total count.
6. **Commissioning memento card** — past-commission date shows "Commissioned [date] · N days of commissioned service" on Dawn.
7. **Weight mirror sync-recency indicator** — `S.lastMirrorUpdate` in DEFAULT; `.weight-sync-footer` shows last sync date in Weight tab.
8. **Tree leaf tap → skill card navigation** — `data-skid` on leaf circles; tap opens target path deck in Skills tab and scrolls to card.
9. **Yggdrasil skill card theming** — path-colored left border, world path badge, level fill bar (`--sk-col`, `--sk-fill`) on every skill card.
10. **Full Yggdrasil theme sweep** — vocabulary (Oaths/Orders/Postpone), `.forge-recovery-card`, discipline bar rename, CSS color semantics, radial gradients.

---

### Phase 1 — Skill Cards + Path Deck UI
**Shipped: v102**
**Files changed:** `src/tabs/skills.js`, `src/styles/main.css`, `src/core/tree.js`, `src/tabs/awards.js`

The skills tab was transformed from a flat scrolling list into a **deck-based card interface**. Each of the 10 paths became a collapsible `.sk-deck` container. The most recently active path (highest `pathXP[cat]`) expands by default; all others collapse.

**Deck header (`.sk-deck-header`):**
- Path icon + path name + world level + skill count + fading badge + expand arrow
- 4px left accent border in path color; faint path-color background tint
- Arrow rotates 180° when open (CSS transition)

**Skill card anatomy (`.sk-card`):**
```
┌─────────────────────────────────────┐
│ ⚔️  PATH OF WAR          [Lv 3 / 7] │  ← header band, path color tint
├─────────────────────────────────────┤
│           [emblem SVG]              │  ← center sigil (Phase 2)
│  Land Navigation                    │  ← skill name
│  Tier II — Map Reading              │  ← current tier label
│  ████████░░░░░░░░                   │  ← level fill bar (path color)
│  🍂 14d left          ⧉ copy        │  ← footer
└─────────────────────────────────────┘
  ▸ Ladder & history                     ← collapsible <details>
```

- Corner bracket accents via `::before` / `::after` (started skills only)
- `--sk-col` CSS var drives the fill bar color (via `skLeafColor`)
- `--sk-fill` CSS var drives fill bar width
- Slipped skills show `⚠️ Slipped` in footer
- Sub-skills rendered indented inside `.sk-group` wrappers

**Navigation updated:**
- Tree-leaf tap now opens the target deck before scrolling to it
- Awards tab skill-jump also opens the deck

**CSS classes added:** `.sk-deck`, `.sk-deck-header`, `.sk-deck-body`, `.sk-deck-icon`, `.sk-deck-name`, `.sk-deck-lv`, `.sk-deck-count`, `.sk-deck-fading`, `.sk-deck-arrow`, `.sk-card` (redesigned), `.sk-card-header`, `.sk-card-path-icon`, `.sk-card-path-label`, `.sk-card-path-lv`, `.sk-card-emblem`, `.sk-card-name`, `.sk-card-tier`, `.sk-level-bar`, `.sk-level-fill`, `.sk-card-footer`, `.sk-emblem-placeholder`, `.sk-emblem-svg`

---

### Phase 2 — Per-Skill Sigil System
**Shipped: v102 (skills tab) + v103 (carved rings tab)**
**Files changed:** `src/tabs/skills.js`, `src/tabs/trophies.js`, `src/styles/main.css`

Every skill gets a unique SVG sigil that evolves as the skill's level grows. The sigil is generated entirely in JavaScript as an inline SVG string — no images, no fonts, no external assets.

**The sigil system lives in `src/tabs/skills.js`** as the `skEmblemSvg` IIFE. It is globally available to `trophies.js` which loads after it.

**Tier system:**
| Tier | Threshold | Visual character |
|---|---|---|
| 0 — Nascent | Not started | No sigil (placeholder circle) |
| 1 — Raw | 1–20% of max | Single stroke / outline shape |
| 2 — Forged | 21–40% | Complete base form |
| 3 — Tempered | 41–60% | One inner element added |
| 4 — Refined | 61–80% | Secondary ornamentation |
| 5 — Mastered | 81–100% | Full complexity, all elements |

**Variation seed:** `Math.abs(hash(skill.id)) % 4` → 0–3. Controls which variant of each ornament appears so skills on the same path look related but not identical.

**Per-path motifs:**

| Path | Motif | Progression summary |
|---|---|---|
| `tactical` | Rune-sword | Vertical blade → crossguard → pommel (seed variant) → rune mark on blade |
| `physical` | Ember flame | Teardrop outline → inner flame → side tongue → ember base arc → crown flame |
| `cognitive` | Rune-eye | Almond outline → iris ring → pupil dot → brow arc → lashes + rune marks |
| `physiological` | Valknut | Single triangle → two → three → inner detail → outer circle |
| `technical` | Gear / circuit node | 4-tooth gear → 6 → 8 + bore → inner shape + spokes → circuit traces |
| `leadership` | Crown | Center spire → side spires → more → jewels → base band ornamentation |
| `academic` | Open rune-scroll | Scroll bar + curls → open book → text lines → chapter marks → page curl + bookmark |
| `personal` | Seed to sprout | Oval seed → taproot → sprout + leaf → two leaves → full small tree |
| `hearth` | Hearthstone arch | Ember dot → flame → arch arc → full arch with pillars → keystone rune |
| `roots` | Root network | Horizontal bar → T-branch → 4-branch → secondary branchlets → knotwork node |

**Color:** sigils use `skLeafColor(eff, max)` — the same color as the skill's leaf on the Yggdrasil tree.

**On skill cards:** sigil at 48×48 using current effective level.
**On Carved Rings:** sigil at 62×62 using peak level — permanent record of highest ever reached.

---

### Carved Rings Tab Overhaul
**Shipped: v103**
**Files changed:** `src/tabs/trophies.js`, `src/styles/main.css`

The Carved Rings tab was redesigned from a horizontal row layout into a **sigil card grid**.

- Path sections remain `<details>` accordions (paths with earned rings open by default)
- Inside each path: responsive grid (`repeat(auto-fill, minmax(118px, 1fr))`)
- Each card: 62px sigil (clickable → detail panel) + skill name + tier label + chip row
- Chips shrank to 22×22 to fit neatly under the sigil

---

### Phase 3 — Per-Tab Visual Atmosphere
**Shipped: v104–v109**
**Files changed:** `src/styles/main.css`, `src/tabs/aft.js`

All 18 tabs received `#view-*` scoped CSS giving each a distinct chamber feel. Every card and element within a tab is themed by its tab's identity.

**Tab themes:**

| Tab | Theme concept | Key treatments |
|---|---|---|
| Dawn (`today`) | First light over Asgard | Gold atmospheric gradient strip at top; gold-glow section headers; `.fn-card` with corner rune accents; commissioning bar pulses gold |
| Oaths (`quests`) | Sworn word on parchment | Gold left-border cards; ember left-border for overdue; wax-seal dot on due-dated cards; sepia archive with small-caps |
| Orders (`dailies`) | Military orders board | Dark board background; square checkboxes; jade flash animation on task completion (`@keyframes order-done`); monospace week summary |
| AFT (`aft`) | Combat readiness — measurement-forward | Black card background; large 54px total score display (`.aft-score-big`, added in JS `showAftResult()`); faint date label; ember border; crosshatch sparkline grid |
| Log (`log`) | Warrior's journal | Ruled ledger line at 40px (red vertical rule via gradient); gold date headers; monospace exercise rows |
| Plan (`plan`) | Tactical map — grid paper | Crosshatch grid on view background; amber coach card with gold left-border |
| Awards (`awards`) | Trophy case / shadow box | Navy-shifted card background; gold aw-title; amber member/event card tints |
| Records (`records`) | Stone inscription | Embossed section headers; gold-tinted history/checklist cards |
| Profile (`profile`) | Personnel dossier | `.adder::before` "PERSONNEL FILE" folder tab; amber border; gold form section labels; blood-tinted blood card |
| Weight (`weight`) | Sacred oath on vellum | Amber atmospheric gradient; gold vow text; amber ledger entries with left-border |
| Board (`board`) | The Muster — cyber prep | Dark board background; violet left-border items; jade border on done items |
| Shop (`shop`) | The Mead Hall | Gold section header; ember-tinted reward cards |
| Objectives (`bosses`) | Trials — fortress under siege | Blood-tinted boss cards; ember name color; HP bar gets a striped overlay (`.hpfill::after`) |
| Grove (`garden`) | Grove of the World Tree | Jade section headers |
| Quizzes (`quizzes`) | Well of Mimir | Violet-tinted quiz cards; jade tint for passed |
| Test & Train (`test`) | Cognitive measurement | Steel-blue test cards; violet mem-block cards |
| Skills (`skills`) | Yggdrasil deck | Jade section header; 2px jade top border on `.adder` |
| Carved Rings (`trophies`) | Permanent record | Gold section header with subtle glow |

**New CSS additions in Phase 3:**
- `@keyframes pulse-gold` — commissioning bar heartbeat
- `@keyframes order-done` — jade flash on Orders completion
- `.aft-score-big` — 54px monospace total score
- `.aft-score-pass` / `.aft-score-fail` — color-coded pass/fail label under score
- Profile `.adder::before` folder tab with clip-path shape and "PERSONNEL FILE" label

**AFT JS change (v108):** `showAftResult()` in `src/tabs/aft.js` now extracts the total score into a `<div class="aft-score-big">` above the event rows. The `<h3>` was reduced to a small date label.

**Wood grain (v109):** `body` background gained 3 repeating-linear-gradient layers (fine/medium/coarse) for dark walnut texture. `li.card` also gained a subtle grain overlay. See "Body background layers" section above.

---

## Open Items Remaining

**From v101:**
- Post-log adaptive target toast — when a workout is saved and adaptive targets change, show "🎯 N targets climbed" toast. Needs diff-before/after in `log.js` save handler.

**All of v102** — none of the 10 features are implemented (see `IMPROVEMENTS-v102.md`).
