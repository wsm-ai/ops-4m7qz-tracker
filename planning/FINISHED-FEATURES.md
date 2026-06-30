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

---

### v110 — 10 Features from IMPROVEMENTS-v101 + v102
**Files changed:** `src/tabs/today.js`, `src/tabs/aft.js`, `src/core/state.js`, `src/core/events.js`, `src/tabs/plan.{html,js}`, `src/core/skills-core.js`, `src/core/tree.js`, `src/core/migration.js`, `src/core/constants.js`, `src/tabs/awards.{html,js}`, `src/styles/main.css`

1. **Post-log adaptive target toast** — `log.js` already contained the diff-before/after logic and "🎯 N targets climbed" toast; verified present and working (no change needed).
2. **Skill fading digest on Dawn** — Field Notes row listing all skills within 20% of their fade window: "🍂 N skills fading: A · B · C → Skills".
3. **Baseline test due nudge on Dawn** — Field Notes row when no baseline test in 28+ days: "📐 Baseline test last done Nd ago — monthly max-effort test due → Log".
4. **AFT score history sparkline** — mini `miniSparkline()` trend above the AFT history list, with min–max range; inserted with duplicate-guard.
5. **Oath path/category breakdown** — compact path-chip row at top of Oaths tab showing oath count per path (⚔️ 3, 🌿 1, …).
6. **Oath archive search** — `<input class="q-arch-search">` above completed-oaths accordion; keystroke handler in `events.js` filters and re-renders archive details content without resetting the input.
7. **FM plan weekly goal from AFT gap** — `renderPlanRec()` function computes weeks-to-AFT and score gap, shows recommended sessions/week in a `#planRec` card above the FM plan.
8. **Daily order completion time tracking** — `d.doneTs=Date.now()` saved on completion; `disciplineLogHtml()` computes and shows median done hour in the discipline legend.
9. **Skill decay grace period (20%)** — `skEffectiveLevel()` uses `(fadeDays + 20%)` per interval; `skFadeState()` returns `"current"|"at-risk"|"decayed"`; `skLeafColor()` accepts optional `sk` param for amber on at-risk; tree fade-ring shows full amber when at-risk. `SKILL_LADDER_VER` bumped to 85.
10. **Qualification log with auto-skill advancement** — `QUAL_CATALOG` constant (10 military quals); `S.qualifications=[]` in DEFAULT; Awards tab "🎗️ Quals" section; live skill-advancement preview dropdown; `renderQuals()` renders earned qual cards; saving a qual calls `skReachLevel`-equivalent and records from/to levels.
11. **FM beginner prescription** — `BEGINNER_RX` constant (s1–s4, bodyweight/gym); `.rx-card` injected after each session exercise list showing sets × reps, rest, and effort note.

---

### v111 — Skill "Practiced" Button
**Files changed:** `src/core/skills-core.js`, `src/tabs/skills.js`, `src/core/events.js`, `src/styles/main.css`

1. **"practiced" button on skill cards** — Every started, non-auto skill card now shows a jade `practiced` button in the footer. Tapping it calls `skPractice(skId)` which resets `sk.lastQuestTs = Date.now()` and saves, resetting the fade countdown without changing the skill level. For skills that can't be tested in-app (land nav, swimming, marksmanship, etc.) but were genuinely practiced. Auto skills are blocked with an explanatory toast.

---

### v112 — 5 Features
**Files changed:** `src/tabs/skills.html`, `src/tabs/skills.js`, `src/tabs/today.js`, `src/tabs/aft.js`, `src/tabs/bosses.html`, `src/tabs/profile.js`, `src/core/state.js`, `src/core/events.js`, `src/core/constants.js`, `src/styles/main.css`

1. **Skill search / quick-find** — Persistent `<input id="skSearch" class="sk-search-input">` above the deck list in Skills tab. Module-level `_skSearchTerm` string; `_filterSkillDecks()` toggles `hidden` on `.sk-deck` elements and auto-expands matching decks without a full re-render. Term survives re-renders. CSS `.sk-search-input` / `::placeholder` / `:focus` with jade focus ring.

2. **Dawn "skill of the day"** — Deterministic daily focal skill computed in `renderToday()`. Eligible pool: started, non-auto, non-group skills. Sorted by `skDaysLeft()` ascending (soonest-to-fade first), then cycled by `Math.floor(Date.now()/864e5) % count`. Displayed as a Field Notes row: skill name, level, days-until-fade, link to Skills tab.

3. **AFT event drill suggestions** — `DRILL` object in `aft.js` maps each of the 5 AFT events (`hrp`, `sdc`, `run`, `dl`, `plank`) to a gap-keyed function returning a one-sentence training prescription. Gap = `100 - eventScore`. Drill note rendered as `.aft-drill` (11px italic `var(--ink-faint)`) below each event row in `showAftResult()`. `.aft-event` made `flex-wrap:wrap` so the drill note spans full width.

4. **Boss sub-task checkpoints** — Optional `checkpoints:[{name, done}]` array on boss objects. Textarea `id="bChecks"` in add-boss form (`bosses.html`); parsed in `bAdd` handler (`events.js`). `renderBosses()` in `state.js` renders checklist below HP bar; `data-bcheck` / `data-bchkidx` handler in `events.js` marks done + decrements HP + grants XP. Migration: `(b.checkpoints||[])` everywhere; `load()` backfills `checkpoints:[]` on all pre-v112 boss objects. CSS `.boss-checks`, `.boss-check-item`, `.boss-check-btn`.

5. **Profile body weight trend line** — Linear regression over last 30 weight entries (requires ≥5 points) in `renderProfile()`. Slope in lbs/entry × 30 = monthly delta. Displayed as `.wt-trend` below the sparkline: `📈/📉/➡️ ±N lbs/month at current rate`.

---

### v113 — 5 Features
**Files changed:** `src/tabs/quests.html`, `src/core/state.js`, `src/core/events.js`, `src/core/constants.js`, `src/tabs/profile.js`, `src/tabs/skills.js`, `src/styles/main.css`

1. **Oath notes / why field** — Optional `q.notes` string on quest objects. Textarea `id="qNotes"` in the add-oath form (`quests.html`); read and stored in the `qAdd` handler (`events.js`). Shown as a small italic `.q-notes` div under the oath name in both the active list and the archive. CSS `.q-notes`.

2. **Boss: add checkpoints to existing boss cards** — Inline add-checkpoint form on every active boss card: `<input class="boss-check-input" data-baddcheck>` + `<button class="boss-check-add-btn" data-baddcheckbtn>`. Click handler in `events.js` reads the input, pushes `{name, done:false}` to `b.checkpoints`, clears the input, saves, and re-renders. CSS `.boss-add-check`, `.boss-check-input`, `.boss-check-add-btn`.

3. **Weight goal + time-to-goal projection** — `S.profile.weightGoal` (number or null) added to `DEFAULT` and `load()` profile baseline. After the trend line in `renderProfile()`, shows a goal-setter input when unset, or a `.wt-goal` line with gap-to-goal and projected weeks-to-goal using the existing regression slope. Buttons wire to set/clear `S.profile.weightGoal`. CSS `.wt-goal`, `.wt-goal-setter`.

4. **Skill "last practiced" date in card footer** — In `leafCard()` in `skills.js`, computes `pracDays` from `sk.lastQuestTs` (set by both `skPractice()` and `skReachLevel()`). Renders "practiced today" or "practiced Nd ago" as a dim `.sk-prac-foot` span in the footer-left, after `fadeFoot`. CSS `.sk-prac-foot`.

5. **Daily orders stale warning** — In `renderDailies()` in `state.js`, computes stale status: a daily is stale if `doneTs` is unset and `streakLog` has ≥7 active days, or if `doneTs` is more than 7 days ago. Shows amber `⚠ stale` tag (`.order-stale`) in the order card meta row. CSS `.order-stale`.

---

### v115 — 5 Features (Feature 2 was already implemented)
**Files changed:** `src/core/constants.js`, `src/core/state.js`, `src/tabs/awards.html`, `src/tabs/awards.js`, `src/tabs/profile.html`, `src/tabs/profile.js`, `src/styles/main.css`, `sw.js`

1. **Wall bulk-entry wizard** — "Bulk add…" toggle (`.wall-bulk-toggle`, `data-bulktoggle`) on every Wall sub-section (Awards, Academic Honors, Memberships, Events, Volunteer). Opens `.wall-bulk-panel-wrap` with a monospace textarea, Preview button, and Commit button. Parser: `lines.map(l=>l.split("|").map(s=>s.trim()))`, one parser per section shape. Commit pushes parsed entries to the matching `S.*` array and re-renders. `_bulkSetup()` helper wires all 5 panels. CSS `.wall-bulk-toggle`, `.wall-bulk-panel`, `.wall-bulk-preview`, `.wall-bulk-preview-btn`, `.wall-bulk-commit`.

2. **Save file import** — already implemented via `importBtn` / `importFile` in `events.js` (not re-added).

3. **Academic Honors section on The Wall** — New `S.academicHonors: []` array in `DEFAULT` and `load()`. New "📚 Academic" sub-nav tab → `wsec-academic`. `renderAcademicHonors()` in `awards.js` renders cards reusing `.aw-card` anatomy. Add form: title, year, org, note. Bulk-entry wizard (Feature 1) also covers this section. `state.js` calls `renderAcademicHonors()` in `render()`. Migration: `merged.academicHonors = r.academicHonors || []`.

4. **ROTC Record section** — New `S.rotcRecord: {positions:[], competitions:[], campResults:[]}` in `DEFAULT` and `load()`. New "⭐ ROTC" sub-nav tab → `wsec-rotc`. Three collapsible `<details class="rotc-sub">` blocks: Positions held (`{id, title, startSem, endSem, note}`), Competitions & exercises (`{id, name, year, placement, note}`), Camp & evaluations (`{id, camp, year, rating, note}`). `renderRotcRecord()` in `awards.js` renders `.rotc-item` cards with jade left-border. Delete handlers via `data-drotcpos`, `data-drotccomp`, `data-drotccamp`. CSS `.rotc-sub`, `.rotc-sub-hd`, `.rotc-item`, `.rotc-title`, `.rotc-meta`.

5. **Language proficiency + clearance on Profile** — `S.profile.languages: []` (each `{lang, ilr, notes}`) and `S.profile.clearance: {level, grantedDate, notes}` added to `DEFAULT` and migrated in `load()`. Profile tab gains two sub-blocks: Language proficiency (list + add form with ILR level select 0+–5, `data-langdel` delete) and Clearance (select: None/Pending/Secret/TS/TS-SCI + date + notes). `renderLanguages()` in `profile.js` re-renders both. CSS `.lang-item`, `.ilr-badge`.

6. **Wall → résumé copy** — "📋 Copy résumé" button (`.wall-resume-btn`) in The Wall `sec-h`. `copyWallResume()` in `awards.js` builds multi-section plain-text string: Academic Honors, Awards, ROTC Record, Memberships, Events, Volunteer, Qualifications, Languages & Clearance; copies to clipboard via `navigator.clipboard.writeText()`.

---

### v114 — 6 Features
**Files changed:** `src/tabs/bosses.html`, `src/core/events.js`, `src/core/state.js`, `src/core/constants.js`, `src/core/skills-core.js`, `src/tabs/aft.js`, `src/tabs/skills.js`, `src/tabs/awards.js`, `src/styles/main.css`

1. **Boss: checkpoint-driven HP** — Boss HP is now always `checkpoints.length + 1`. Removed `<input id="bHp">` from `bosses.html`. `bAdd` derives `maxhp` from checkpoints and sets `cpDriven:true`. Inline checkpoint add increments `hp++` and `maxhp++` on `cpDriven` bosses. `renderBosses()` shows "🏆 Conquer the Trial" only when `hp===1`; otherwise "Complete a milestone to make progress" (no free hit). Legacy non-`cpDriven` bosses keep "⚔️ Strike it". Migration in `load()` backfills `cpDriven:true` on existing checkpoint-bearing bosses with consistent HP. CSS `.boss-no-strike`, `.hit.conquer`.

2. **Boss target date + daily pace** — Optional `b.targetDate` (YYYY-MM-DD) on boss objects. Date input in the add-boss form. After `.hp-meta`, `renderBosses()` computes `hp/daysLeft` steps/day needed and days remaining; shows `.boss-pace` row in jade (on pace ≤1 step/day) or ember (off-pace / overdue). CSS `.boss-pace`, `.boss-pace.on-pace`, `.boss-pace.overdue`.

3. **Oath progress updates (running log)** — `q.updates: [{ts, text}]` on quest objects. Each active oath shows a left-bordered log of time-stamped dispatches + an input/button to add new ones. Updates shown in archive too. Handler `data-qupdateadd` in `events.js` pushes to `q.updates`, saves, re-renders. CSS `.q-updates`, `.q-update-item`, `.q-update-ts`, `.q-update-form`, `.q-update-input`, `.q-update-add`.

4. **Daily orders: pause / resume** — `d.paused: bool` on daily objects. Paused orders show dimmed (`li.card.paused { opacity:.45 }`) with `⏸ paused` badge and Resume button; excluded from perfect-day math (`filter(x=>!x.paused)`) and stale checks. `data-dpause` / `data-dpausestate` handler in `events.js`. CSS `li.card.paused`, `.order-paused`, `.order-pause-btn`.

5. **AFT per-event target scores** — `S.aftEventTargets: {hrp, sdc, run, dl, plank}` in `DEFAULT` and `load()`. Collapsible `<details class="aft-target-set">` below the test date input in `renderAft()`; `document.addEventListener("input")` in `aft.js` saves on change. In `showAftResult()`, each event row shows `✓ target` (jade) or `↑ N to target` (ember) via `.aft-tgt-gap`. CSS `.aft-tgt-gap`, `.aft-target-set`, `.aft-target-grid`, `.aft-tgt-label`, `.aft-tgt-inp`.

6. **Skill target level marker on fill bar** — `sk.targetLevel` (int or null) per skill. Gold tick mark (`.sk-tgt-tick`) on the fill bar at `targetLevel/maxLv * 100%`. Footer shows "N to L[target] target" or "L[target] target reached" via `.sk-tgt-foot`. Set via a number input in the `sk-work-panel` (added to `skWorkGuidance()` in `skills-core.js`); saved on `change` event via `data-sktgtlv` handler in `awards.js`. `.sk-level-bar` gained `position:relative`. CSS `.sk-tgt-tick`, `.sk-tgt-foot`, `.sk-tgt-foot.reached`, `.sk-tgt-set`, `.sk-tgt-set-label`, `.sk-tgt-inp-work`.

---

### v116 — 6 Features + 4 New Skills + 3 Ladder Improvements
**Files changed:** `src/core/constants.js`, `src/core/state.js`, `src/core/skills-data.js`, `src/core/migration.js`, `src/tabs/profile.html`, `src/tabs/profile.js`, `src/tabs/awards.html`, `src/tabs/awards.js`, `src/tabs/records.html`, `src/tabs/records.js`, `src/tabs/today.js`, `src/styles/main.css`, `sw.js`

1. **GPA semester history log (Profile)** — `S.gpaHistory: []` added to `DEFAULT` and `load()` migration. Each entry: `{id, term, gpa, hours, standing, note}`. Profile tab gained a "GPA Semester Log" block with sparkline (`renderGpaHistory()`) and mini add-form (term, GPA, credit hours, standing, note). Committing auto-updates `S.profile.gpa` to the most-recent entry. `data-gpadel` deletes a row and re-syncs cumulative GPA. Label changed from "GPA (current)" to "GPA (cumulative)". CSS `.gpa-history-row`, `.gpa-term`, `.gpa-standing`.

2. **Membership edit** — Already fully implemented in `app-setup.js` (`mbEdit()`, `_mbEditId`, `_mbSave` handler, role management) — confirmed present, not re-added.

3. **Qualifications catalog expansion + custom quals** — `QUAL_CATALOG` in `constants.js` expanded with 5 entries: `airborne`, `air_assault`, `wlc`, `blc`, `ruck`. Added `<option value="custom">✏️ Custom / civilian cert</option>` to `qualKey` select and hidden `#qualCustomName` input. Custom quals push `{id, key:"custom", label, date, skills:[]}` without skill advancement. `renderQuals()` and `copyWallResume()` handle `q.key==="custom"` branch.

4. **Counseling bulk import** — "Bulk add counselings…" toggle (`.wall-bulk-toggle`, `data-bulktoggle="cnBulk"`) added above the counseling log in `records.html`. Inline block in `records.js` wires preview/commit: parser splits on `|` → `{id, date, type, people:"", summary, plan, followUp}` pushed to `S.counseling[]`. Reuses `.wall-bulk-panel` / `.wall-bulk-preview` / `.wall-bulk-commit` CSS from v115.

5. **Dawn academic snapshot (Today tab)** — Inline `academicHtml` block in `renderToday()` computes from `S.gpaHistory` and `S.profile.gpa`. Renders a `.td-card fn-card` with cumulative GPA + latest semester GPA; shows `.dl-badge` if `standing` contains "dean". Placed between field notes and FM Advisory in the flow array. CSS `.acad-strip`, `.acad-stat`, `.acad-stat b`, `.dl-badge`.

6. **Membership active/past filter** — Module-level `_mbFilter="all"` in `awards.js`. Filter bar (`<div class="mb-filter-bar">`) above `#mbList` with All/Active/Past buttons. `data-mbfilter` click handler updates `_mbFilter`, toggles `.on` class, calls `renderMemberships()`. Active = `!m.endYear || m.endYear >= currentYear`. CSS `.mb-filter-bar`, `.mb-filter`, `.mb-filter.on`.

**New skills (S2–S5; S1 Sleep discipline was already present):**
- **Radio communications** (`tactical / Soldier tasks`, fadeDays:90) — 8-level ladder from phonetic alphabet to company-level comms plan. Tiers: User/Operator/Net-Control/Comms-Planner.
- **OPSEC / digital security** (`personal / Life admin`, fadeDays:60) — 7-level ladder from unique passwords to sustained OPSEC discipline. Tiers: Unaware/Practicing/Disciplined. Includes `safety:` field.
- **Negotiation & influence** (`leadership`, fadeDays:90) — 8-level ladder from positions-vs-interests to third-party mediation. Tiers: Positional/Interest-Based/Skilled/Mediator.
- **Reading speed** (`cognitive / Speed`, fadeDays:45) — 10-level ladder from 150 WPM to 1500+ WPM. Tiers: Average/Fast/Efficient/Speed-Reader. Self-reported for now.

**Ladder improvements (SKILL_LADDER_VER 86→87):**
- **L1 Networking**: `advance[2]` now mentions "CompTIA Network+ maps well to L1–L3"; `advance[7]` updated to "CCNA/CCNP-level standard — CCNP roughly marks this tier; CCIE is the documented expert ceiling."
- **L2 Cybersecurity fundamentals**: Expanded from 8 to 9 levels. L7 = Security+ + 3 unguided CTFs across categories; L8 = eJPT/PNPT intermediate cert; L9 = OSCP/full-scope (formerly L8). `tiers` Expert bumped to `upTo:9`.
- **L3 Programming (Python/Java/JavaScript)**: All three L8 `advance` entries now specify concrete examples: "a deployed tool used by at least one real user outside yourself, a merged open-source PR in an active project, or a maintained internal tool with documented usage."

---

### v117 — 6 Features + 2 New Skills + 2 Ladder Improvements
**Files changed:** `src/core/state.js`, `src/core/events.js`, `src/core/skills-core.js`, `src/core/migration.js`, `src/core/skills-data.js`, `src/tabs/today.js`, `src/tabs/skills.html`, `src/tabs/skills.js`, `src/tabs/test.html`, `src/tabs/test.js`, `src/tabs/awards.js`, `src/styles/main.css`, `sw.js`

1. **Reading speed test (Test tab auto-integration)** — Four ~280-word timed passages from varied domains (FM 6-0, Army Writing, Leadership, Sleep & Recovery). Start timer → read → Done → comprehension self-check (yes/partial/no adjusts WPM × 1.0/0.7/0.4). Stores to `S.tests[]` with type `"reading"`. Updates Reading speed skill level if result improves on current. Reading speed `auto:"test:reading"` and `howTo` updated; `load()` migration backfills `auto` on old saves. `renderReadingTest()` wired into render chain from `state.js`. CSS `.rd-card`, `.rd-passage-wrap`, `.rd-timer`, `.rd-result-row`, `.rd-btn`, `.rd-history`, etc.

2. **OML snapshot panel (Today tab)** — Small read-only panel below the academic strip. Three rows: cumulative GPA (from `S.profile.gpa`), best AFT total (from `S.aft[]`), latest MS eval (from `S.rotcRecord.campResults[0]`). Shows only when any of these is present. "Profile →" button links to Profile tab. CSS `.oml-panel`, `.oml-row`, `.oml-label`, `.oml-val`, `.oml-sub`, `.oml-note`.

3. **Boss archive (conquered bosses)** — `completedAt: null` added to boss objects. When a boss reaches HP 0 (checkpoint handler or direct hit), `b.completedAt = localYMD()` is set instead of deleting. `renderBosses()` splits active (`!b.completedAt`) vs archived (`b.completedAt`). Archived renders in collapsible `<details class="boss-archive">` with conquest date and total HP. Migration in `load()` backfills `completedAt: null` on all existing boss objects. CSS `.boss-archive`, `.boss-archive-item`, `.boss-archive-icon`, `.boss-archive-name`, `.boss-conquered-date`.

4. **Skill decay heat-map (Skills tab)** — Toggle button (📅) next to search bar shows/hides a 13×7 = 91-day practice calendar. Each cell colored by count of skill history events that day: 0 = faint, 1–2 = light jade, 3–5 = mid jade, 6+ = full jade. Computed live from `sk.history[].ts` across all non-group skills. CSS `.sk-toolbar-row`, `.sk-hm-toggle`, `.sk-heatmap-wrap`, `.hm-grid`, `.hm-day`, `.hm-day.lv0–lv3`, `.hm-header`, `.hm-label`, `.hm-month-row`, `.hm-legend`.

5. **Counseling follow-up alert (Today tab)** — `renderToday()` scans `S.counseling[]` for entries with `followUp` dates within 7 days or past due. Renders a `.cn-alert` card listing each (date, relative label, summary excerpt). "Records →" button links to Records tab. CSS `.cn-alert`, `.cn-alert-row`, `.cn-alert-date`.

6. **Skill notes / log entries** — `skReachLevel(skId, level, note)` now accepts an optional `note` and stores it on the `history[]` entry. `skWorkGuidance()` renders a textarea (data-sknote) before the level-confirm button, pre-populated with the next advance guidance as placeholder. `data-skreach` handler in `awards.js` reads the note from the textarea and passes it through. `leafCard()` shows the last 3 noted history entries below the level bar in `.sk-log-recent`. CSS `.sk-note-wrap`, `.sk-note-input`, `.sk-log-recent`, `.sk-log-entry`, `.sk-log-entry-ts`.

**New skills (SKILL_LADDER_VER 87→88):**
- **Memory retention** (`cognitive / Memory`, fadeDays:30, auto:`quiz:retention`) — 10-level ladder from "complete a 10-card SRS session" to "sustain >90% retention across 500+ cards for 6+ months." Tiers: Learner/Practitioner/System-Builder/Master. Ties to the existing SRS system in the Test tab.
- **Reading speed** auto-upgraded — Previously self-reported, now set `auto:"test:reading"` and measured in-app via the new timed passage test.

**Ladder improvements:**
- **L5 Radio communications** — `howTo` now references FM 6-02 (Signal Support to Operations) as the authoritative doctrine source for PACE planning and net management.
- **Reading speed** — `howTo` rewritten to reference the in-app test and explain the comprehension adjustment. `auto:"test:reading"` field added.

---

### v118 — 3 Features + 1 New Skill + 2 Ladder Improvements
**Files changed:** `src/tabs/quests.html`, `src/core/events.js`, `src/core/state.js`, `src/tabs/skills.html`, `src/tabs/skills.js`, `src/tabs/records.html`, `src/tabs/records.js`, `src/core/skills-data.js`, `src/core/migration.js`, `src/styles/main.css`, `sw.js`

1. **Quest partial credit / step tracking (Oaths tab)** — Optional "Steps" field on quest creation form (`#qSteps`, number 2–20). If set, quest card shows a jade fill-bar (`q.progress / q.steps`), step count (`X/N`), and a "+1 step" button (`data-qprogress`). Tapping +1 increments `q.progress`; when progress reaches steps, the quest auto-completes and awards XP identically to a manual check. Progress is stored on the quest object (`q.steps`, `q.progress`). CSS `.q-steps-row`, `.q-steps-bar`, `.q-steps-fill`, `.q-steps-count`, `.q-step-btn`.

2. **Skill mastery summary bar (Skills tab)** — A compact stat row (`#skSummaryBar`, `.sk-summary-bar`) appears above the search bar. Computed on every `renderSkillsTab()` from all non-group leaf skills with levels: "N active", "⭐ N maxed", "🔶 N at risk", "🍂 N decayed". Each stat chip color-coded (gold/ember/blood) to match the state. Only shows when at least one skill is started. CSS `.sk-summary-bar`, `.sk-summary-stat`, `.sk-summary-stat.maxed`, `.sk-summary-stat.atrisk`, `.sk-summary-stat.decayed`.

3. **Counseling search & filter (Records tab)** — Filter bar above `#counselArea` with All / Event / Monthly / Developmental / Received / Given type buttons (`.mb-filter-bar`, reusing v116 CSS). Text search input (`#cnSearch`) filters by `c.summary` or `c.people` contains match. Module-level `_cnFilter` and `_cnSearch` in `records.js`; wired in `renderCounsel()`. CSS `.cn-filter-wrap`, `.cn-search-input`.

**New skill (SKILL_LADDER_VER 88→89):**
- **First aid / TCCC** (`tactical / Soldier tasks`, fadeDays:180) — 9-level ladder from "know the TCCC phases and MARCH protocol" through CPR/AED cert, tourniquet self-application, wound packing, airway management, tension pneumothorax recognition, full MARCH simulation, formal TCCC course completion, to serving as an instructor. Tiers: Aware/Responder/TCCC/Instructor.

**Ladder improvements:**
- **Negotiation & influence** — `howTo` now references FM 6-22 (Leader Development) for the upper levels where influence and command climate tie to leadership doctrine.
- **Memory retention** — `howTo` updated to clarify that level advancement is self-reported (no automatic wiring yet); honest metric is the SRS retention rate described in each level's criteria.

---

### v119 — 7 Features + Career-Stage Target System
**Files changed:** `src/core/constants.js`, `src/core/state.js`, `src/core/events.js`, `src/core/migration.js`, `src/core/skills-data.js`, `src/tabs/skills.html`, `src/tabs/skills.js`, `src/tabs/today.js`, `src/tabs/awards.html`, `src/tabs/awards.js`, `src/tabs/dailies.html`, `src/tabs/dailies.js`, `src/tabs/profile.html`, `src/tabs/profile.js`, `src/styles/main.css`, `sw.js`

1. **Career-stage skill targets (F1)** — Every major tactical, physical, technical, and leadership skill in `SEED_SKILLS` now has a `targets:{MS1,MS2,MS3,LDAC,MS4,commission,O1}` object with recommended level milestones per ROTC career stage. `careerStage()` in `migration.js` parses `S.rank` to detect current stage. `mergeNewSeedSkills()` auto-populates `sk.targetLevel` from the seed target on first install (only when `null` — manual overrides preserved). In `leafCard()` (skills.js), a dim secondary tick (`.sk-tgt-tick-next`, 25% opacity dashed gold) marks the next stage's target on the skill fill-bar alongside the existing bright tick. Skills with targets: Land navigation, Marksmanship (M4), Tactical movement, Troop leading procedures, Radio communications, First aid / TCCC, Fieldcraft & survival, Push-ups in 2 minutes, Run (2-mile), Public speaking, Decision-making under pressure, Counseling & mentorship, Networking, Programming (Python), Cybersecurity fundamentals, ROTC knowledge (quizzes). `SKILL_LADDER_VER` bumped **89→90**.

2. **Habit streak calendar (F2)** — 60-day perfect-day calendar on the Dailies tab. Toggle button (`#dailyCalToggle`) next to the Daily Orders section header shows/hides a `.daily-cal-grid` of 60 day-cells (10-column layout, jade for completed, dark for missed). Data source: `S.dailyHistory[]` (YYYY-MM-DD strings) populated by `onPerfectDay()` in `state.js`, trimmed to 365 entries. `renderDailyCal()` and `setupDailyCalToggle()` in `dailies.js`; `setupDailyCalToggle()` called from `renderDailies()`. CSS `.daily-cal-grid`, `.daily-cal-label`.

3. **Skill export / print view (F3)** — 📋 button in the Skills tab toolbar (`data-copyskillssummary`) calls `copySkillsSummary()` in `skills.js`. Outputs a multi-section plain-text block to clipboard, grouped by path, listing all started skills with level and tier: `[Path of War]\n  Land navigation — Level 4 (Navigator)`. Handler wired in `events.js`.

4. **Qualification expiry alerts (F4)** — `expires` date field added to the qualification form in awards.html and saved by awards.js. In `renderToday()`, scans `S.qualifications[]` for entries expiring within 60 days or already past. Shows a `.qual-alert` card in Field Notes with ember `⚠️ expired` rows and jade `🔔 expires in Nd` rows, plus a "Wall →" nav button. CSS `.qual-alert`, `.qual-alert-row`, `.qual-alert-row.overdue`.

5. **Boss sprint mode (F5)** — Daily HP commitment system on boss cards. If no sprint set for today, a setter row shows `b.hp` input + Set button (`data-bsprintset`). After setting, `b.todayCommit={date,hp,startHp}` is stored; the card shows a jade progress bar (actual HP hit today vs. committed). Done = jade `✓ Sprint complete`. If yesterday's sprint was missed, an ember `⚠ missed` warning shows. CSS `.boss-sprint`, `.boss-sprint.done`, `.boss-sprint.missed`, `.boss-sprint-bar`, `.boss-sprint-fill`, `.boss-sprint-setter`, `.boss-sprint-btn`, `.boss-sprint-input`.

6. **Weekly training load summary (F6)** — Field Notes on Today tab shows a `🏋️ This week:` row counting all workout sessions logged since Monday, total run distance (mi), and total reps. Computed from `S.workouts[]` filtered to the current ISO week using `w.ts` timestamp. Includes a "Log →" nav button.

7. **GPA goal + projected graduation GPA (F7)** — `S.profile.gpaGoal` (float) added to DEFAULT. `pfGpaGoal` number input below the GPA semester log in profile.html. `renderGpaProjection()` in `profile.js` fits a linear regression through `S.gpaHistory[]` by semester index and extrapolates to semester 8. Shows "Projected graduation GPA: X.XX" in jade if at or above goal, ember if below. Saved by profile save handler. CSS `.gpa-projection`.

---

### v120 — 6 Features: Skill assessment, milestones, quest alerts, AFT trend, new skills
**Files changed:** `src/core/constants.js`, `src/core/state.js`, `src/core/events.js`, `src/core/migration.js`, `src/core/skills-data.js`, `src/tabs/skills.html`, `src/tabs/skills.js`, `src/tabs/today.js`, `src/tabs/profile.html`, `src/tabs/profile.js`, `src/styles/main.css`, `sw.js`

1. **Skill target sync button (F1)** — `↑ sync` button in the Skills tab toolbar (`data-updateskilltgts`, `id="skSyncTargets"`). Calls `updateAllSkillTargets()` in `skills.js`: iterates all skills, finds `seed.targets[careerStage()]`, updates `sk.targetLevel` if null or behind (never downgrades manual overrides). Shows toast "↑ N skill targets updated to MS2". Handler wired via `events.js` `data-updateskilltgts`.

2. **Skill assessment panel (F3)** — `📊` toggle button in Skills tab toolbar (`id="skAssessToggle"`). When active, shows a flat gap table (`#skAssessWrap`, `.sk-assessment-table`) sorted by gap descending: path icon, skill name, current level, target level, gap (behind in ember, ahead in jade, met = ✓). Module-level `_skAssessVisible` flag. `renderSkillAssessment()` in `skills.js`. CSS `.sk-assessment-table`, `.sk-assess-head`, `.sk-assess-row`, `.sk-assess-gap.*`, `.sk-assess-empty`.

3. **User milestones (F2)** — `S.milestones[]` array added to `DEFAULT` (constants.js) and explicitly merged in `load()` (state.js). Profile tab has a milestone form: `#pfMsLabel` (label input), `#pfMsDate` (date input), `#pfMsAdd` (add button), `#pfMilestones` (rendered list). `renderMilestones()` in `profile.js` lists upcoming/past milestones with delete buttons. Milestone delete uses local `addEventListener("click", data-msdel)` in `profile.js`. Dawn tab (`renderToday()`) shows up to 3 upcoming milestones in a `.milestone-dawn` pill row below the commission countdown. CSS `.milestone-row`, `.milestone-date`, `.milestone-label`, `.milestone-when`, `.milestone-del`, `.milestone-dawn`, `.ms-pill`.

4. **Quest due-soon alert (F4)** — Field Notes row in `renderToday()` scans `S.quests[]` for open quests with `q.due` within 0–7 days. Shows "🚩 N oaths due within 7 days: [name] · [name]" with a Quests nav button.

5. **AFT linear trend projection (F5)** — When `S.aft.length >= 3`, `renderToday()` fits a linear regression through total scores (sorted by date), computes slope (pts/test), and projects next score. Field Notes shows "📈 AFT trend: ▲ +N.N pts/test → projected NNN pts next test" in jade/ember based on slope direction.

6. **New skills: Strength programming + Military writing (F6)** — Two new skills added to `SEED_SKILLS` (skills-data.js). **Strength programming** (cat:`physical`, parent:`Fitness programming` — new group also added, 8-level ladder from template-following to real-time coaching, fadeDays:60). **Military writing** (cat:`leadership`, 8-level ladder from BLUF paragraph to doctrine-quality OPORDs under time pressure, fadeDays:90). Both have `targets:{MS1–O1}` and full advance/maintain arrays. `SKILL_LADDER_VER` bumped **90→91**.

---

### v121 — 6 Features + 2 new skills: Milestone progress bar, skill streak, daily reorder, practiced quick-log, AFT sparklines, new skills
**Files changed:** `src/tabs/today.js`, `src/tabs/skills.js`, `src/tabs/aft.js`, `src/core/skills-core.js`, `src/core/state.js`, `src/core/events.js`, `src/core/skills-data.js`, `src/core/migration.js`, `src/styles/main.css`, `sw.js`

1. **Milestone countdown progress bar (F1)** — The nearest upcoming milestone in Dawn now shows as a `.milestone-bar-wrap` panel with a label ("📍 Label — Nd away") and a 5px fill bar (jade, amber if ≤7 days). Progress computed from the most recent past milestone (or 30 days before) as origin to the target date. Additional upcoming milestones still render as `.ms-pill` chips below. CSS `.milestone-bar-wrap`, `.milestone-bar-label`, `.milestone-bar`, `.milestone-bar-fill`.

2. **Skill streak — consecutive practice days (F2)** — `skStreak(sk)` added to `skills-core.js`: iterates `sk.history[]` sorted descending, counts consecutive calendar days (by ISO date string) with at least one entry going back from today. If streak ≥ 2, leaf card footer shows `🔥 N-day streak` in `.sk-streak` (ember color). Rendered in `skills.js` after `pracFoot`.

3. **Daily orders up/down reorder buttons (F3)** — `renderDailies()` in `state.js` now passes the index `(d, i)` to the map and renders a `.daily-move-col` column with `▲` / `▼` buttons (`data-moveup` / `data-movedown`) on each order row. Up arrow hidden (visibility:hidden) on first item; down arrow hidden on last. Handlers in `events.js` swap adjacent array elements and call `renderDailies()`. CSS `.daily-move-col`, `.daily-move-btn`.

4. **Skill-of-the-day "practiced" quick-log on Dawn (F4)** — The focal skill row in Today Field Notes now includes a `✓ practiced` button (`data-skpractice="[skId]"`) inline. Tapping it calls the existing `skPractice()` handler, which resets the fade timer and calls `save(); render()`. No new handler needed — the `data-skpractice` delegation already existed in `events.js` from v111.

5. **AFT event trend sparklines (F5)** — `showAftResult()` in `aft.js`: for each event row, computes `evVals` from all `S.aft[]` entries sorted by date. If ≥ 2 entries exist, renders `miniSparkline(evVals, 60, 16)` in a `.aft-event-spark` span inline with the event score. CSS `.aft-event-spark` (inline-flex, vertical-align:middle, opacity:.8).

6. **New skills: Rucking technique + Army history & officership (F6)** — Two skills added to `SEED_SKILLS`. **Rucking technique** (cat:`physical`, parent:`Endurance`, fadeDays:90, 6-level ladder from fit/load basics through teaching others; targets MS1–O1). **Army history & officership** (cat:`leadership`, fadeDays:180, 6-level ladder from naming major battles through facilitating peer discussions; targets MS1–O1). `SKILL_LADDER_VER` bumped **91→92**. Total skills: **111**.

---

### v122 — Full skills expansion: 64 new skills across all 10 paths
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

Pure skills expansion session — no UI changes. Added 64 new skills to `SEED_SKILLS`. `SKILL_LADDER_VER` bumped **92→93**. Total skills: **175**.

**Tactical batch (8 skills, parent:"Soldier tasks"):** Marksmanship (M17/pistol) — 7 levels, Familiar→Instructor; CBRN/NBC awareness — 8 levels, Aware→Evaluator; Grenade employment — 6 levels, Aware→Certifier; Military law & ROE — 8 levels, Aware→Advisor; Battle drills — 8 levels, Aware→Evaluator; SALUTE/spot reporting — 6 levels, Know it→Teach it; Rappelling & vertical movement — 6 levels, Aware→Rigger; Operational planning (MDMP) — 9 levels, Aware→Staff Officer (cat:`leadership`, standalone).

**Physical batch (4 skills):** Combat water survival (parent:`Endurance`, 7 levels); Obstacle course (parent:`Endurance`, 6 levels); Cycling/cross-training (parent:`Endurance`, 6 levels); Gymnastics/bodyweight skills (parent:`Strength`, 8 levels).

**Cognitive batch (3 skills, parent:"Reasoning"):** Critical thinking — 8 levels; Decision science — 7 levels; Spatial reasoning — 7 levels.

**Physiological batch (3 skills):** Recovery tracking (parent:`Daily inputs`, 6 levels); Injury prevention & prehab (standalone, 7 levels); Vision training (parent:`Body markers`, 6 levels).

**Technical batch — Core CS (5 skills):** Version control/Git (8 levels); SQL & databases (9 levels); Bash/shell scripting (parent:`Linux / command line`, 8 levels); Cloud computing (9 levels); Data structures & algorithms (10 levels).

**Technical batch — Cyber/Security (8 skills):** Systems programming C/C++ (9 levels); Web application development (9 levels); Penetration testing methodology (9 levels); Digital forensics & incident response (9 levels); Malware analysis (8 levels); Cryptography applied (8 levels); Network defense/blue team (9 levels); Reverse engineering (8 levels).

**Technical batch — DevOps & Emerging (5 skills):** DevOps/containerization (8 levels); PowerShell/Windows administration (7 levels); CTF/competitive security (8 levels); Machine learning/AI fundamentals (8 levels); Software testing (7 levels).

**Leadership batch (4 skills):** Brief preparation & delivery (7 levels); Ethics & moral reasoning (7 levels); Cross-cultural competence (6 levels); Project management (8 levels).

**Academic batch (10 skills):** Statistics & data analysis (9 levels); Research skills (parent:`Learning systems`, 7 levels); Geopolitics & foreign policy (7 levels); Spanish (parent:`Languages`, 8 levels ILR); French (parent:`Languages`, 8 levels ILR); Mandarin Chinese (parent:`Languages`, 8 levels ILR, fadeDays:21); Arabic (parent:`Languages`, 8 levels ILR, fadeDays:21); Russian (parent:`Languages`, 8 levels ILR, fadeDays:21); Philosophy & ethics (7 levels); Economics fundamentals (7 levels).

**Personal/Hearth/Roots batch (14 skills):** Professional networking (7L); Interview skills (7L); Tax preparation (5L); Investing & wealth building (8L); Home & life maintenance (7L); Health literacy (6L); Legal literacy (6L); Mindfulness & meditation (7L, fadeDays:14); Sleep optimization (7L, fadeDays:14); Mental health literacy (6L); Vehicle preparedness (6L, parent:`Sustainment`); Amateur radio/backup communications (6L, parent:`Sustainment`); Self-awareness (7L, parent:`Character`); Gratitude & positive reframing (5L, parent:`Character`, fadeDays:14).

### v123 — 6 UX + intelligence features, 4 new skills, full technical & leadership hierarchies
**Files changed:** `src/tabs/today.js`, `src/tabs/skills.js`, `src/tabs/skills.html`, `src/tabs/records.html`, `src/tabs/records.js`, `src/core/state.js`, `src/core/skills-data.js`, `src/core/migration.js`, `src/styles/main.css`, `sw.js`

`SKILL_LADDER_VER` bumped **93→94**. SW bumped to `operations-v123`. Total skills: **186** (4 new leaf skills + 7 new group nodes).

**Feature 1 — Path health snapshot on Dawn:** `renderToday()` in `today.js` now builds a `pathSummaryHtml` block listing every active path (one row: icon, name, active skill count, avg level, at-risk count). Color-coded jade/ember based on decay ratio. Appears between the milestone bar and Warrior's Focus. CSS `.path-summary-strip`, `.path-summary-row`, `.path-summary-icon`, `.path-summary-name`, `.path-summary-stat`.

**Feature 2 — Skill gap heatmap by career stage:** New `renderSkillGapMap()` in `skills.js`, toggled by 🗺️ button in the Skills toolbar. Renders a table: one row per path, columns = career stages (MS1→O1). Each cell shows ✓ (on track), count of skills behind, or — (no targets). Current stage column highlighted gold. `_gapMapVisible` module flag. CSS `.sk-gap-map`, `.sk-gm-table`, `.sk-gm-cur`, `.sk-gm-path`, `.sk-gm-td`, `.sk-gm-stage`, `.sk-gm-legend`.

**Feature 3 — Skill notes search / history viewer:** New `renderSkillNotes()` in `records.js`, called from `render()` in `state.js`. Shows all `history[]` entries with a `note` field across all skills, sorted descending by timestamp, filterable by a `#skNoteSearch` text input. Added "Skill Notes" section at top of `records.html`. CSS `.sk-note-entry`, `.sk-note-header`, `.sk-note-skill`, `.sk-note-date`, `.sk-note-text`.

**Feature 4 — Weekly skill practice planner:** New `renderWeeklyQueue()` in `skills.js`, toggled by 🗓️ button in Skills toolbar. Shows all started non-auto skills with `skDaysLeft(sk) ≤ 7` OR `skFadeState !== 'current'`, sorted by urgency. Each row shows sigil, name, days remaining, and a quick ✓ practiced button. `_skWeeklyVisible` module flag. CSS `.sk-weekly-queue`, `.sk-wq-row`, `.sk-wq-info`, `.sk-wq-name`, `.sk-wq-days`, `.sk-wq-tag`, `.sk-wq-btn`, `.sk-wq-emblem`.

**Feature 5 — New skills + skill hierarchies:** 4 new leaf skills added; 7 group nodes added to create hierarchies in the technical (4 groups) and leadership (3 groups) paths. All 23 technical skills and 13 leadership skills now have `parent` assignments. Migration reconciler automatically updates existing saves.

New groups — **technical:** `Foundations` (Linux, Networking, Git, SQL, Cloud, DSA, Bash); `Programming` (Python, Java, JavaScript, C/C++, Web app dev, ML/AI); `Cybersecurity` (Cybersecurity fundamentals, Pen testing, DFIR, Malware analysis, Cryptography, Network defense, Reverse engineering, CTF); `DevOps & ops` (DevOps/containerization, PowerShell, Software testing). **Leadership:** `Communication` (Public speaking, Negotiation, Brief prep, Military writing, Parliamentary procedure); `Command skills` (Drill & ceremony, Counseling, Army history & officership, Ethics, Cross-cultural); `Operations & planning` (Decision-making, MDMP, Project management, Obstacle leadership).

New leaf skills: **Combatives (physical control)** (physical, parent:`Close-Quarters Combat`, 7L, MACP Level 1–2 ladder, fadeDays:90); **Obstacle leadership** (leadership, parent:`Operations & planning`, 6L, individual→platoon evaluation, fadeDays:90); **Second language retention** (cognitive, parent:`Memory`, 5L, passive recognition→6-month no-decay maintenance, fadeDays:30); **Wilderness medicine / CASEVAC** (tactical, parent:`Soldier tasks`, 7L, WFA→WFR→platoon CASEVAC lead, fadeDays:180).

**Feature 6 — Tree layout audit:** `PAGEERRORS 0` confirmed; tree renders with updated hierarchy structure. Headless `--shot` screenshot has a pre-existing visibility limitation in the test runner.

### v124 — 6 features + 3 utility skills + skill fixes
**Files changed:** `src/tabs/profile.js`, `src/tabs/profile.html`, `src/tabs/skills.js`, `src/tabs/skills.html`, `src/tabs/quests.js`, `src/tabs/today.js`, `src/core/skills-core.js`, `src/core/skills-data.js`, `src/core/migration.js`, `src/styles/main.css`, `sw.js`

`SKILL_LADDER_VER` bumped **94→95**. SW bumped to `operations-v124`. Total skills: **186**.

**Feature 1 — Commissioning readiness dashboard:** `renderCommReadiness()` in `profile.js`. Six traffic-light indicators: AFT total score, GPA, skills at career target, qualifications current, ROTC record completeness, clearance status. Each indicator shows green/amber/red with specific gap text. Panel in `profile.html` after vitals. CSS `.comm-ready-wrap`, `.comm-indicator`, `.cr-green/.cr-amber/.cr-red`.

**Feature 2 — Skill-linked oath completion:** Skill-link row on each active quest card. A `<select>` of started skills + a radio (practice / level-up). On quest completion the linked skill auto-practices or levels up. Fields: `q.linkedSkillId`, `q.linkedSkillType`. Wired in `quests.js`.

**Feature 3 — Card table redesign of Skills tab:** Dark green felt `#view-skills` background. 10 path deck "cards" with embossed backs (sigil, path name, suit name, level corners). Decks open to a flex-wrap card grid. Rank corners on skill cards (Ace–King, importance-sorted). Group sub-skills render as 110px mini playing cards in `.sk-mini-grid`. Constants `SK_SUIT` and `CARD_RANKS` in `skills.js`.

**Feature 4 — End-of-day training journal:** `S.dayLog[]` array. `renderDayLog()` in `today.js`. 3-field form (title/notes/mood). Last 3 days shown in collapsible panel on Dawn. Handler `data-daylogadd`/`data-daylogdel` in `events.js`.

**Feature 5 — 30-day skill history sparkline in Work panel:** `skTrendSparkline(sk)` in `skills-core.js`. Produces a small SVG of level history over the last 30 days. Appended to `skWorkGuidance()` output.

**Feature 6 — Fix 5 orphaned skills missing `parent:` field:** `Statistics & data analysis`, `Geopolitics & foreign policy`, `Philosophy & ethics`, `Economics fundamentals`, `Injury prevention & prehab` — all given correct parent assignments in `skills-data.js`.

### v125 — Rarity system, sub-deck pages, Joker deck, foil shimmer
**Files changed:** `src/core/skills-core.js`, `src/tabs/skills.js`, `src/tabs/skills.html`, `src/core/events.js`, `src/styles/main.css`, `sw.js`

SW bumped to `operations-v125`. Total skills: **186**.

**Rarity system:** `skRarity(sk)` in `skills-core.js` — Common (≤4L), Uncommon (5–7L), Rare (8–10L), Legendary (11–13L), Mythic (14+L), Joker (auto or tagged). Rarity badge shown on card tier line. `--rar-col` CSS variable drives border color per card.

**Sub-deck pages:** Paths with >13 top-level skills split into sub-decks of 13 (I, II, III…). Each sub-deck gets its own embossed card back inside the opened path deck. Path card back shows "N decks" indicator.

**Joker deck:** All `auto:true` and `joker:true` skills aggregated in a "Wildcards" deck (deep violet gradient) at the top of `#skList`. Jump-bar includes 🃏 Wildcards button. Joker toggle checkbox on skill add/edit form (`sk.joker=true`, wired in `skCreate()`/`skEdit()`).

**Foil shimmer:** Legendary and Mythic cards get a `::after` CSS animation (`foilShimmer`, 4s linear infinite) — a diagonal gradient sweep on `.sk-card.rarity-legendary` and `.sk-card.rarity-mythic`.

**Path completion badges:** `<span class="sk-path-badge discovered">All Collected</span>` and `<span class="sk-path-badge mastered">★ All Mastered</span>` appear in deck header when all leaves started or all maxed.

**Skill synergy combos:** `SYNERGY_PAIRS` array (15 pairs) in `skills-core.js`. `skHasSynergy(sk)` checks if partner skill is at L4+. `⚡ Partner Name` shown in `.sk-synergy-foot` on card footer.

**Side Deck:** Unstarted leaves render face-down in a collapsible `<details class="sk-side-deck">` section below each path's active cards. `faceDownCard()` renders card back with rarity pip, name hidden, synthesis set progress bar and Combine button if synthesis pending.

### v126 — 6 card features + physical pyramid seeds + 3 utility skills + 4 utility improvements
**Files changed:** `src/tabs/today.js`, `src/tabs/skills.js`, `src/core/skills-core.js`, `src/core/skills-data.js`, `src/core/events.js`, `src/tabs/aft.js`, `src/styles/main.css`, `sw.js`

`SKILL_LADDER_VER` bumped **95→96**. SW bumped to `operations-v126`. Total skills: **220** (186 + 3 utility + 31 physical pyramid seeds).

**Today's Hand:** 5 started skills drawn deterministically each day via `hashStr(dateKey)` + `seededShuffle()` in `today.js`. Horizontal card strip `.th-hand` on Dawn above Field Notes.

**Collection stats chip:** `X/N collected` chip in `skSummaryBar` — started/total leaves per path, gold font.

**Pyramid system (skills-core.js):** `skSeedOf(name,cat)`, `skSetMembers(setKey)`, `skSetMasteredCount(setKey)`, `skSetCanCombine(setKey)`, `skCombineSet(setKey)`. Combine button handler via `data-skcombine` in `events.js`.

**Physical path pyramid seeds added to SEED_SKILLS:**
- 1 Mythic: "Physical Mastery" (`synthesizedFrom:"phys_leg"`)
- 5 Legendaries: one per cluster (Strength, Endurance, Composition, Combat, Movement), `setKey:"phys_leg"`, each `synthesizedFrom:"phys_r_[cluster]"`
- 25 Rares: 5 per Legendary cluster, `setKey:"phys_r_[cluster]"`, each `synthesizedFrom:"phys_u_[cluster]_[subset]"`

**3 utility skills:** Land navigation (tactical, 8L), 9-line MEDEVAC (tactical, 6L), Personal finance (personal, 7L).

**4 utility improvements:** Quick PT Log (3-field form on Dawn, saves to `S.workouts[]`); AFT Goal (`S.aftGoal`, `renderAftGoal()`, progress bar in `#aftGoalWrap`); Urgency-first focal skill (≤3 days from fade shown first with `⚠ Nd left`); Skill history export ("📋 Copy skill history" in Records tab).

### v127 — 25 Strength Uncommons + Synthesis Chain View + Synthesis-Ready Alert + pyramid reset migration
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `src/tabs/skills.js`, `src/tabs/today.js`, `src/styles/main.css`, `sw.js`

`SKILL_LADDER_VER` bumped **96→97**. SW bumped to `operations-v127`. Total skills: **245** (220 + 25 Strength Uncommons).

**25 Physical Strength Uncommons:** Added to `SEED_SKILLS`. Five sets of 5, each feeding a Strength Rare:
- `phys_u_strength_basics` (→ "Strength Foundation"): Hip Hinge Mastery, Squat Pattern, Push Pattern, Pull Pattern, Compound Integration
- `phys_u_strength_power` (→ "Power Development"): Jump Training, Sprint Mechanics, Ballistic Power, Speed-Strength Training, Reactive Strength
- `phys_u_strength_accessory` (→ "Accessory Work"): Shoulder Health Work, Posterior Chain Work, Grip Strength, Core Basics, Vertical Pull Pattern
- `phys_u_strength_programming` (→ "Strength Periodization"): 1RM Testing, Percentage Training, Volume Prescription, Deload Protocol, Peaking Cycle
- `phys_u_strength_recovery` (→ "Recovery Science"): Sleep Discipline, Nutrition Timing, Active Recovery, HRV Fundamentals, Stress Load Balance

Each Uncommon: `cat:"physical"`, `rarity:"uncommon"`, `fadeDays:30`, 5-level honest-benchmark ladder, `why`/`howTo`/`safety`/`roadmap`/`advance`/`maintain`.

**Pyramid reset migration:** `PYRAMID_RESET_VER=1` constant in `migration.js`. In `mergeNewSeedSkills()`, when `seed.setKey` is set and `live.pyramidResetApplied` is falsy: wipes `currentLevel→0`, `history→[]`, `lastQuestTs→null`, deletes `synthesisUnlocked`, sets `live.pyramidResetApplied=1`. User-authorized blank-slate rule. Fires once per skill.

**Synthesis Chain View:** `renderSynthesisChain(cat)` in `skills.js` — walks seed data to display mythic→legendary→rare tree. Each Legendary is a collapsible `<details>`, each Rare shows Uncommon mastery count. Status icons: ✦ mythic, ★ maxed, ▶ started, ⚡ ready-to-combine, 🔒 locked. Toggle button `.sc-toggle[data-sctoggle]` on each path deck header; `btn.onclick` with `e.stopPropagation()` to prevent parent header toggle. Output goes in `.sc-wrap#sc-{cat}`. CSS: `.sc-toggle`, `.sc-wrap`, `.synth-chain`, `.sc-mythic`, `.sc-legend`, `.sc-rares`, `.sc-rare`, `.sc-{maxed|started|ready|locked}`.

**Synthesis-Ready Alert on Dawn:** In `renderToday()`, after focal skill row. Iterates `SEED_SKILLS` for synthesis targets with `synthesizedFrom` set; checks `skSetCanCombine()` but not yet `synthesisUnlocked` on live skill. Shows gold-bordered `.sk-synth-ready-row` with `⚡ Synthesis ready: Name1, Name2 — open Skills to combine.` and a Skills → button.

### v128 — 48 Physical Uncommons (Endurance + Composition clusters)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **97→98**. SW bumped to `operations-v128`. Total skills: **293** (245 + 48 new seeds).

**Existing skill modifications:** "Rucking technique" and "Cycling (cross-training)" each received `setKey` and `rarity:"uncommon"` fields to slot them into the Ruck Mastery and Durability Training Rare chains respectively. Their existing ladders are unchanged. Pyramid reset migration fires on these on next load (user-authorized blank-slate).

**25 Physical Endurance Uncommons:** Added to `SEED_SKILLS`. Five sets feeding five Endurance Rares:
- `phys_u_running_basics` (→ "Running Foundation"): Weekly Run Consistency, Easy Pace Discipline, Run Warm-Up Protocol, Run Mileage Tracking, Running Frequency Base
- `phys_u_running_speed` (→ "Running Performance"): Tempo Running, Interval Training, Cadence Training, Running Drills, Race Pacing Protocol
- `phys_u_endurance_aerobic` (→ "Aerobic Base"): Zone 2 Training, Cardiac Output Sessions, Aerobic Threshold Runs, Breathing Mechanics, Aerobic Baseline Testing
- `phys_u_endurance_durability` (→ "Durability Training"): Cycling [existing], Progressive Volume Building, Back-to-Back Training Days, Long Effort Endurance, Training Load Management
- `phys_u_rucking` (→ "Ruck Mastery"): Rucking technique [existing], Pack Fitting & Load Distribution, Ruck Pacing, Foot Care for Rucking, Load Progression

**25 Physical Composition Uncommons:** Added to `SEED_SKILLS`. Five sets feeding five Composition Rares:
- `phys_u_lean_mass` (→ "Lean Mass Building"): Progressive Overload Practice, Protein Intake Protocol, Caloric Surplus Management, Hypertrophy Training Block, Lean Mass Tracking
- `phys_u_fat_loss` (→ "Fat Loss Protocol"): Caloric Deficit Execution, Protein Preservation During a Cut, Plateau Recognition and Response, Deficit Adherence Strategy, Body Composition Confirmation
- `phys_u_nutrition` (→ "Nutrition System"): Macronutrient Understanding, Food Label Reading, Protein Priority at Every Meal, Meal Prep Discipline, Hydration Baseline
- `phys_u_sleep` (→ "Sleep Mastery"): Sleep Duration Baseline, Consistent Wake Time, Pre-Sleep Hygiene Protocol, Sleep Environment Optimization, Sleep as Performance Input
- `phys_u_prehab` (→ "Injury Resilience"): Daily Movement Prep, Bilateral Symmetry Work, Load Management Awareness, Mobility Maintenance Routine, Return-to-Training Protocol

All Uncommons: `cat:"physical"`, `rarity:"uncommon"`, 5-level honest-benchmark ladders, `why`/`howTo`/`safety`/`roadmap`/`advance`/`maintain`. No UI changes this session — pure data.

### v129 — 47 Physical Uncommons (Combat + Movement clusters)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **98→99**. SW bumped to `operations-v129`. Total skills: **340** (293 + 47 new seeds). Physical pyramid Uncommon layer is now complete — all 5 Legendary chains fully fed.

**Existing skill modifications:** "Combat water survival" → `setKey:"phys_u_swimming"`, "Combatives (physical control)" → `setKey:"phys_u_combatives"`, "Obstacle course" → `setKey:"phys_u_field"`. All three also received `rarity:"uncommon"`. Pyramid reset migration fires on next load (user-authorized blank-slate).

**22 Physical Combat Uncommons:** Added to `SEED_SKILLS`. Five sets feeding five Combat Rares:
- `phys_u_swimming` (→ "Combat Swim Cert"): Combat water survival [existing], Basic Water Confidence, Freestyle Stroke Mechanics, Uniform/Gear Swimming, Back Float and Survival Float
- `phys_u_combatives` (→ "Combatives Level 2"): Combatives (physical control) [existing], Stand-Up Control and Takedowns, Guard Position and Sweeps, Escapes from Bad Positions, Safe Training Habits
- `phys_u_field` (→ "Field Hardening"): Obstacle course [existing], Cold Weather Acclimatization, Field Sleep Discipline, Load Carry Fitness, Heat Management and Hydration
- `phys_u_power_combat` (→ "Explosive Athleticism"): Box Jump Proficiency, Broad Jump Power, Lateral Quickness Drills, Explosive Hip Extension, Sprint Acceleration Mechanics
- `phys_u_mentaltoughness` (→ "Stress Inoculation"): Discomfort Tolerance Training, Breathing Under Stress, Focus During Fatigue, Self-Talk and Reframing, Embracing the Grind

**25 Physical Movement Uncommons:** Added to `SEED_SKILLS`. Five sets feeding five Movement Rares:
- `phys_u_mobility` (→ "Joint Mobility"): Hip Mobility Baseline, Thoracic Spine Rotation, Ankle Dorsiflexion Work, Shoulder Mobility Assessment, Full-Body Mobility Flow
- `phys_u_stability` (→ "Core Stability"): Plank Progressions, Anti-Rotation Training, Dead Bug Drill, Single-Leg Balance Progressions, Loaded Carry Stability
- `phys_u_mechanics` (→ "Movement Literacy"): Hip Hinge Pattern, Squat Pattern Quality, Push Pattern Quality, Pull Pattern Quality, Carry Pattern Quality
- `phys_u_flexibility` (→ "Soft Tissue Recovery"): Foam Rolling Protocol, Targeted Post-Run Stretching, Sleep Recovery Positioning, Contrast Therapy Basics, Active Recovery Sessions
- `phys_u_locomotion` (→ "Athletic Locomotion"): Ground Contact Time Reduction, Hill Running Mechanics, Arm Carriage Mechanics, Stride Length Optimization, Variable Terrain Adaptation

All Uncommons: `cat:"physical"`, `rarity:"uncommon"`, 5-level honest-benchmark ladders, `why`/`howTo`/`safety`/`roadmap`/`advance`/`maintain`. No UI changes this session — pure data.

### v135 — Tactical Specialties Uncommons + Full Leadership Pyramid (168 new seeds)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **103→104**. SW bumped to `operations-v135`. Total skills: **635** (467 + 168 new seeds).

**Part 1 — Tactical Specialties Uncommons (23 new seeds):** Completed the 5th and final Tactical Uncommon cluster.
- `tac_u_rappelling` ×4 new (Anchor System Rigging, Hasty Rappel Technique, Ascending Fundamentals, Tower NCO/Evaluator Duties; +1 existing "Rappelling & vertical movement" = 5 total)
- `tac_u_combatives_tac` ×5 new (MACP Ground Position Fundamentals, Takedowns and Trips, Guard Sweeps and Escapes, Weapon Retention under Grapple, MACP Sparring Safety and Habits)
- `tac_u_grenades` ×4 new (Grenade Types and Safety, Dry-Run Mechanics, Throw Accuracy, Employment Principles; +1 existing "Grenade employment" = 5 total)
- `tac_u_urban` ×5 new (MOUT Fundamentals, Building Entry Techniques, Room Clearing Sequence, Multi-Room Structure Clearance, Outer Cordon Establishment)
- `tac_u_convoy` ×5 new (Convoy Planning Basics, Vehicle Spacing and Communications, React to IED Drill, React to Vehicle Ambush, Convoy After-Action Report)

**Part 2 — Full Leadership Pyramid (145 new + existing integrations):**
- 1 Mythic: "Battlefield Commander" (14L, setKey:"lead_mythic")
- 5 Legendaries: Command Presence, People Development, Operational Mastery, Communication Mastery, Character & Ethics (11L each, setKey:"lead_leg")
- 25 Rares: 18 new 8L seeds + 7 existing skills with setKey added in-place. Rarities manually overridden where ladder depth differed from pyramid role.
- 121 Uncommon seeds across 25 sets (5 per set, max 2 existing per set):
  - Cluster 1 Command Presence: lead_u_dc ×4 new, lead_u_voice ×5, lead_u_bearing ×5, lead_u_authority ×5, lead_u_formation ×5 (+1 existing "Obstacle leadership")
  - Cluster 2 People Development: lead_u_counsel ×5 new, lead_u_dev ×5, lead_u_cohesion ×5, lead_u_feedback ×5, lead_u_conflict ×5 (+1 existing "Counseling & mentorship" as the Rare)
  - Cluster 3 Operational Mastery: lead_u_ops_mdmp ×5 new, lead_u_decision ×5, lead_u_risk ×5, lead_u_aar ×5, lead_u_pm ×5 (+2 existing as Rares)
  - Cluster 4 Communication Mastery: lead_u_speaking ×4 new, lead_u_writing ×5, lead_u_negot ×5, lead_u_orders ×5, lead_u_orgcomms ×5 (+1 existing "Brief preparation & delivery")
  - Cluster 5 Character & Ethics: lead_u_history ×5 new, lead_u_ethics_found ×4, lead_u_cross_cultural ×4, lead_u_identity ×5, lead_u_resilience ×5 (+2 existing "Ethics & moral reasoning", "Cross-cultural competence")
- All Uncommons: 5-level honest-benchmark ladders, why/howTo/roadmap/advance/maintain, synthesizedFrom:"lead_c_*" for future Common layer.

### v134 — Tactical pyramid Intelligence & Reporting Uncommons (24 new seeds)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **102→103**. SW bumped to `operations-v134`. Total skills: **467** (443 + 24 new seeds).

Added 24 new Intelligence & Reporting Uncommon seeds completing the 4th of 5 Tactical Uncommon clusters. Existing "SALUTE / spot reporting" already filled 1 slot in tac_u_salute from v131. Five sets complete:
- `tac_u_salute` ×4 new (SPOTREP Form Completion, Voice SPOTREP on Radio, Patrol Debrief Compilation, Pattern-of-Life Analysis; +1 existing = 5 total)
- `tac_u_terrain_analysis` ×5 new (OAKOC Framework, Terrain Overlay, Terrain Brief, Avenues of Approach Identification, Defensive Position Recommendation)
- `tac_u_osint` ×5 new (OSINT Categories, OSINT Search Exercise, Source Verification, Credibility Rating, OSINT Collection Plan)
- `tac_u_map_reading` ×5 new (Map Orientation, MGRS Grids, Declination and Azimuth, Terrain Features from Contour, Map-to-Ground Cross-Reference)
- `tac_u_contact_report` ×5 new (SALUTE Under Contact, ACE Report, Relay Up Chain, Multi-Contact Debrief, Lead Element Through Contact)

All seeds: 5-level honest-benchmark ladders, why/howTo/roadmap/advance/maintain. No UI changes this session — pure data.

### v139 — Academic path pyramid (139 new seeds + 17 existing wired)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **107→108**. SW bumped to `operations-v139`. Total skills: **1201**.

Built the complete Academic path pyramid: 1 Mythic ("Scholar-Warrior", 14L, synthesizedFrom:"acad_leg"); 5 Legendaries (Scholar's Method, Clear Communicator, Critical Analyst, Polyglot Operator, Domain Scholar — all 11L, setKey:"acad_leg"); 25 Rares across 5 clusters (acad_r_study, acad_r_comm, acad_r_analysis, acad_r_lang, acad_r_domains — 22 new 8L seeds + 3 existing wired: Writing, Higher mathematics, Statistics & data analysis). 111 new Uncommon seeds across 25 sets (5L each) plus 14 existing Uncommons wired. Wired existing skills: Writing→acad_r_comm/acad_u_writing; Higher mathematics→acad_r_analysis/acad_u_math; Statistics→acad_r_analysis/acad_u_data_analysis; Military history→acad_u_military_sci; Study & retention→acad_u_study_arch; ROTC knowledge→acad_u_military_sci; Note-taking→acad_u_capture; Research skills→acad_u_writing; Geopolitics→acad_u_geopolitics; Spanish/French/Mandarin/Arabic/Russian/German all assigned rarity:"uncommon" to override 8L auto-Rare and placed in respective Lang Uncommon clusters. Philosophy & ethics→acad_u_philosophy; Economics fundamentals→acad_u_economics. All Uncommons have synthesizedFrom:"acad_c_*" placeholder for future Common layer.

### v138 — Physiological path pyramid (146 new seeds + 7 existing wired)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **106→107**. SW bumped to `operations-v138`. Total skills: **1062**.

Built the complete Physiological path pyramid: 1 Mythic ("Vital Operator"); 5 Legendaries; 25 Rares across 5 clusters (phys2_r_nutrition, phys2_r_sleep, phys2_r_recovery, phys2_r_health, phys2_r_body). 125 Uncommon seeds across 25 sets. 7 existing physiological skills wired. All Uncommons have synthesizedFrom:"phys2_c_*".

### v137 — Cognitive path pyramid (144 new seeds + 11 existing wired)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **105→106**. SW bumped to `operations-v137`. Total skills: **915**.

Built the complete Cognitive path pyramid: 1 Mythic ("Master of the Mind", 14L, synthesizedFrom:"cog_leg"); 5 Legendaries (Processing Speed, Memory Mastery, Attentional Command, Mental Operations, Cognitive Synthesis — all 11L, setKey:"cog_leg"); 25 Rares across 5 clusters (cog_r_speed, cog_r_memory, cog_r_attention, cog_r_operations, cog_r_synthesis — 15 new 8L seeds + 10 existing skills wired). 124 new Uncommon seeds across 25 sets (5L each) plus 2 existing Uncommons wired. Wired 11 existing Rares: Reaction speed (cog_r_speed/cog_u_reaction), Cognitive/processing speed (cog_r_speed/cog_u_proc_speed), Working memory n-back (cog_r_memory/cog_u_working_mem), Memory span (cog_r_memory/cog_u_mem_span), Attention/sustained focus (cog_r_attention/cog_u_attention), Reading speed (cog_r_attention/cog_u_reading), Mental math (cog_r_operations/cog_u_mental_math), Pattern recognition (cog_r_operations/cog_u_pattern), Critical thinking (cog_r_synthesis/cog_u_critical). Wired 2 existing Uncommons: Decision science (cog_u_spatial_ops), Spatial reasoning (cog_u_decision). Memory technique and Memory retention left standalone (no cog_r_reasoning cluster exists). Typing speed & accuracy and Second language retention left standalone. All Uncommons have synthesizedFrom:"cog_c_*" placeholder for future Common layer.

### v133 — Tactical pyramid Leader's Tools Uncommons (25 new seeds)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped **101→102**. SW bumped to `operations-v133`. Total skills: **443** (418 + 25 new seeds).

Added 25 new Leader's Tools Uncommon seeds completing the 3rd of 5 Tactical Uncommon clusters. Five sets complete: tac_u_mdmp ×5 (Mission Analysis Fundamentals, COA Development, COA Analysis and Wargaming, COA Comparison and Approval, MDMP Integration), tac_u_law ×5 (Law of War Foundations, ROE Application, LOAC Principles in Training, EPW Handling, Reporting Violations), tac_u_opord ×5 (OPORD Structure, Situation Paragraph, Mission Statement, Execution Concept, Service Support and C2), tac_u_tlp ×5 (TLP Steps 1-3, TLP Steps 4-5, Warning Order Execution, Map Reconnaissance and Tentative Plan, TLP Steps 6-8), tac_u_counseling ×5 (DA 4856 Form Proficiency, Initial Counseling, Event Counseling, Performance Counseling, Follow-Up Counseling). All seeds: 5-level honest-benchmark ladders, why/howTo/roadmap/advance/maintain.

### v132 — Tactical pyramid Field Operator Uncommons (23 new seeds)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped to **101**. SW bumped to `operations-v132`. Total skills: **418**.

Added 23 new Field Operator Uncommon seeds. All existing tactical skills checked for integration — Radio communications (8L) and Fieldcraft & survival (10L) are both Rare depth and remain standalone. Five sets complete: tac_u_landnav ×5 (Map Reading Basics, Compass Fundamentals, Dead Reckoning, Terrain Association, Night Navigation), tac_u_comms ×5 (NATO Phonetic Alphabet, Radio Check Procedure, Radio Operation, PACE Planning, Net Control Duties), tac_u_fieldcraft ×5 (Kit Management, Field Shelter, Water and Rations Management, Temperature Management, Extended Field Sustainment), tac_u_terrain ×5 (Individual Movement Techniques, Cover and Concealment Use, Squad Formations, Bounding Overwatch, Obstacle Crossing Fundamentals), tac_u_casevac ×3 new (LZ Selection and Marking, Litter Construction and Patient Carry, Mass Casualty Triage — the remaining 3 slots of the 5-slot set; the other 2 were filled in v131). All seeds follow established pattern: 5-level honest-benchmark ladders, why/howTo/safety/roadmap/advance/maintain.

### v131 — Tactical pyramid (Mythic + 5 Legendaries + 25 Rares + Combat Soldier Uncommons)
**Files changed:** `src/core/skills-data.js`, `src/core/migration.js`, `sw.js`

`SKILL_LADDER_VER` bumped to **100**. SW bumped to `operations-v131`. Total skills: **395**.

Added the full Tactical pyramid skeleton: 1 Mythic ("Tactical Mastery", synthesizedFrom:"tac_leg"); 5 Legendaries (Combat Soldier, Field Operator, Leader's Tools, Intelligence & Reporting, Tactical Specialties); 25 Rares across 5 clusters (tac_r_combat_soldier, tac_r_field_operator, tac_r_leader_tools, tac_r_intel, tac_r_specialties). Integrated 6 existing tactical skills as Uncommons by adding `rarity:"uncommon"` + `setKey`: Marksmanship M17 (tac_u_weapons), Grenade employment (tac_u_grenades), SALUTE/spot reporting (tac_u_salute), Rappelling (tac_u_rappelling), Wilderness medicine/CASEVAC (tac_u_casevac), 9-line MEDEVAC (tac_u_casevac). Added 24 new Combat Soldier Uncommon seeds: tac_u_weapons ×4 (Weapon Safety Fundamentals, Trigger Control Mechanics, Malfunction Clearance, Qualification Course Prep), tac_u_battle_drills ×5 (React to Contact Actions, Break Contact Execution, React to Indirect Fire, Bunker and Fortification Actions, Battle Drill Integration), tac_u_cbrn ×5 (CBRN Threat Identification, MOPP Gear Execution, Detection Equipment Use, Hasty Decontamination, CBRN Reporting), tac_u_tccc ×5 (Tourniquet Application, Wound Packing and Occlusion, Airway and Breathing Control, Circulation and Hypothermia Prevention, MARCH Protocol Execution), tac_u_swimming ×5 (Water Entry Under Load, Uniform Swimming Technique, Equipment Buoyancy Management, Buddy Tow Technique, Combat Water Exit). All seeds follow the established pattern with `why`, `howTo`, `safety`, `levels`, `roadmap`, `advance`, `maintain`.

### v130 — synthesizedFrom backfill (all Physical Uncommons)
**Files changed:** `src/core/skills-data.js`, `sw.js`

SW bumped to `operations-v130`. No SKILL_LADDER_VER change (`synthesizedFrom` is a seed-only field, never synced to live skills).

Added `synthesizedFrom:"phys_c_*"` to all 100 Physical Uncommons that were previously leaf cards (Endurance, Composition, Combat, Movement clusters — 95 new seeds + 5 existing integrated skills). The 25 Strength Uncommons already had `synthesizedFrom` from v127. Every Physical Uncommon now points to a unique `phys_c_*` Common set key, making the Physical pyramid a consistent 5-layer tree across all 5 clusters. No Common seeds exist yet — those are written after all path pyramids reach Uncommon. Design decision: build all paths to Mythic first, then add Commons to all paths in one dedicated batch.
