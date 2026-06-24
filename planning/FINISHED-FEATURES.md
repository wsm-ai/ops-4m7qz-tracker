# Operations PWA — Finished Features & Project Reference

This document is the permanent record. It holds completed visual overhaul phases, previous session prompts, and a full description of the project's design language and architecture. Use it as a reference when continuing work — you do not need to re-derive what's already been built.

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
| `tactical` | Path of War | Fólkvangr | ⚔️ | `#7a3e3e` dark red |
| `physical` | Path of the Body | Midgard | 🌿 | `#7a5c2a` dark amber |
| `cognitive` | Path of the Mind | Well of Mimir | 🌀 | `#3a5c7a` dark steel blue |
| `physiological` | Path of Vitality | Asgard | ❤️ | `#3a6b4a` dark green |
| `technical` | Path of the Craft | Nidavellir | ⚙️ | `#4a4a6b` dark indigo |
| `leadership` | Path of Command | Valhalla | ⭐ | `#6b5a2a` dark gold |
| `academic` | Path of Knowledge | Jotunheim | 📚 | `#5a3a6b` dark violet |
| `personal` | Path of the Self | Alfheim | 🌱 | `#3a6b3a` dark sage |
| `hearth` | Path of the Hearth | Vanaheim | 🔥 | `#7a4a2a` dark ember |
| `roots` | Path of Roots | Niflheim | 🌾 | `#4a5a3a` dark moss |

### Color palette (CSS variables)

```
--bg:        #080b08    (near-black, forest floor)
--panel:     #0e1209    (card background)
--panel-2:   #111408    (nested card)
--line:      #1e2318    (border default)
--ink:       #d4cdb8    (primary text)
--ink-dim:   #9a9480    (secondary text)
--ink-faint: #5a5649    (muted text)
--gold:      #b8a06a    (earned / peak)
--gold-bright: #d4b87a  (highlight)
--ember:     #c87440    (warning / fading / fire)
--jade:      #5a8a5a    (growth / promote)
--violet:    #7c64c8    (cognitive / memory)
--blood:     #8a3a3a    (tactical / danger)
```

### Visual character

- Background: deep forest green-black, not pure black. Subtle radial gradients at viewport center for atmospheric depth.
- Cards: dark panel backgrounds with colored borders and corner bracket accents (`::before` / `::after` CSS).
- Typography: slightly loose letter-spacing on labels; small-caps for path names and military titles.
- Icons: emoji for path/tab icons (avoids font loading); SVG for all skill emblems (inline, generated in JS).
- No hover effects that require pointer cursor assumptions (mobile-first).

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
npm run regress           # headless 17-tab test, assert 0 pageerror
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

## Completed Visual Overhaul Features

---

### Phase 1 — Skill Cards + Path Deck UI
**Shipped: v102**
**Files changed:** `src/tabs/skills.js`, `src/styles/main.css`, `src/core/tree.js`, `src/tabs/awards.js`

**What was built:**

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

**What was built:**

Every skill gets a unique SVG sigil that evolves as the skill's level grows. The sigil is generated entirely in JavaScript as an inline SVG string — no images, no fonts, no external assets.

**The sigil system lives in `src/tabs/skills.js`** as the `skEmblemSvg` IIFE (immediately-invoked function expression). It is globally available to `trophies.js` which loads after it.

**Tier system:**
| Tier | Threshold | Visual character |
|---|---|---|
| 0 — Nascent | Not started | No sigil (placeholder circle) |
| 1 — Raw | 1–20% of max | Single stroke / outline shape |
| 2 — Forged | 21–40% | Complete base form |
| 3 — Tempered | 41–60% | One inner element added |
| 4 — Refined | 61–80% | Secondary ornamentation |
| 5 — Mastered | 81–100% | Full complexity, all elements |

**Variation seed:** `Math.abs(hash(skill.id)) % 4` → 0–3. Controls which variant of each ornament appears (pommel shape, rune glyph, leaf shape, etc.) so skills on the same path look related but not identical.

**Shared outer ring** (`_ring`): wraps every sigil. Starts as a plain circle; gains tick marks at tier 2, double ring at tier 4. The ring's opacity and stroke-width grow with level.

**Per-path motifs:**

| Path | Motif | Progression summary |
|---|---|---|
| `tactical` | Rune-sword | Vertical blade → crossguard emerges → pommel (shape varies by seed) → rune mark on blade |
| `physical` | Ember flame | Teardrop outline → inner flame → side tongue → ember base arc → crown flame |
| `cognitive` | Rune-eye (Odin's eye) | Almond outline → iris ring → pupil dot → brow arc → lashes + rune marks |
| `physiological` | Valknut | Single triangle → two triangles → three triangles → inner detail → outer circle |
| `technical` | Gear / circuit node | 4-tooth gear → 6 teeth → 8 teeth + bore → inner shape + spokes → circuit traces |
| `leadership` | Crown | Center spire → side spires → more spires → jewels at points → base band ornamentation |
| `academic` | Open rune-scroll / tome | Scroll bar + curl ends → open book form → text lines per page → chapter marks → page curl + bookmark |
| `personal` | Seed to sprout | Oval seed → taproot line → sprout shoot + leaf → two leaves → full small tree |
| `hearth` | Hearthstone arch | Ember dot → flame teardrop → arch opening arc → full arch with pillars → keystone rune |
| `roots` | Root network | Horizontal root bar → T-branch → 4-branch system → secondary branchlets → knotwork taproot node |

**Color:** sigils use `skLeafColor(eff, max)` — the same color as the skill's leaf on the Yggdrasil tree, so the sigil and tree leaf are visually linked. Cold gray when low; ember gold at peak.

**On skill cards (skills tab):**
- Sigil rendered at 48×48 in `.sk-card-emblem`
- Uses **current effective level** (`eff`) — shows your present state
- If not started: shows a dashed placeholder circle

**On Carved Rings tab (trophies tab):**
- Sigil rendered at 62×62 in `.trophy-ring-sigil`
- Uses **peak level** (`sk.peakLevel`) — permanent record of highest ever reached
- Even if a skill decays, the Carved Rings still shows the peak-tier sigil
- Clicking the sigil shows the detail panel for that peak-level ability
- Unstarted skills show as ghost cards (opacity 0.28, desaturated)

---

### Carved Rings Tab Overhaul
**Shipped: v103**
**Files changed:** `src/tabs/trophies.js`, `src/styles/main.css`

**What was built:**

The Carved Rings tab ("every level earned, kept here") was redesigned from a horizontal row layout (skill name + chip row side-by-side) into a **sigil card grid**.

**New layout:**
- Path sections remain `<details>` accordions (paths with earned rings open by default)
- Inside each path: responsive grid of ring cards (`repeat(auto-fill, minmax(118px, 1fr))`)
- Each card:
  ```
  ┌─────────────────┐
  │   [62px sigil]  │  ← peak-level sigil, clickable → detail
  │  Skill Name     │
  │  Tier · L4/8   │
  │ ● ● ● ● ○ ○ ○ ○ │  ← chip row (earned = colored)
  └─────────────────┘
  ```
- Chips shrank to 22×22 to fit neatly under the sigil
- Path progress bar + earned/total count in the header unchanged

---

## Previous Session Prompts (for historical reference)

### v101 — Yggdrasil theme sweep + 10 features
Implemented 10 features:
1. Fix skill XP → pathXP.academic (silent bug)
2. Post-log adaptive target toast
3. AFT per-event delta on Dawn
4. Quest snooze fatigue counter
5. Habit 7-day consistency summary
6. Commissioning memento card
7. Weight mirror sync-recency footer
8. Tree leaf tap → skill card navigation
9. Yggdrasil skill card theming (colored left border, world path badge, level fill bar)
10. Full Yggdrasil theme sweep (vocabulary, color semantics, radial gradients)

### v102 — Visual Overhaul Phase 1 (skill deck UI) + sigil system (skills tab)
- Transformed skills tab to deck-based card interface
- Added per-skill sigil SVG generation system
- Added sigils to skill cards (using current effective level)
- Tree-leaf tap → opens target deck then scrolls

### v103 — Carved Rings tab overhaul + sigil integration
- Overhauled Carved Rings from chip rows to sigil grid cards
- Sigils in Carved Rings show peak-level (permanent record)
- Chips shrunk to fit under sigil in card grid
