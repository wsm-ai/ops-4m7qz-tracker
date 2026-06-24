# Operations — Visual Overhaul Design Specification

This document defines the full visual redesign of the Operations PWA. The goal is for every surface of the app to feel like it belongs to the same world — Yggdrasil, the Norse world-tree, as filtered through a grounded military aesthetic. Nothing decorative for its own sake: every design decision should reinforce what the element *means*.

All implementations must remain offline-safe, no external assets, no CDN. All imagery is CSS or inline SVG.

---

## 1. Skill Cards — Path Decks

### Current state
Skill cards are plain list items with a colored left border added in v101. They render as a flat vertical list grouped by path.

### New design

#### Card anatomy
Each skill is a physical card with front-face design:

```
┌─────────────────────────────────────┐  ← intricate border (path color)
│ ⚔️  PATH OF WAR          [Lv 3 / 7] │  ← header band (path color, dark tint)
│─────────────────────────────────────│
│                                     │
│    [emblem — complexity = level]    │  ← center emblem (see Section 3)
│                                     │
│  Land Navigation                    │  ← skill name, prominent
│  Tier II — Map Reading              │  ← current tier label
│                                     │
│  ████████░░░░░░░░  3 / 7            │  ← level fill bar (path color)
│                                     │
│  🍂 Fades in 14d    ⧉ copy         │  ← footer: fade warning + copy
└─────────────────────────────────────┘
```

#### Border design
- CSS `box-shadow` layered inward: outer ring in path color at 20% opacity, inner line at 60% opacity, a subtle inner glow
- Corner accents drawn as `::before` / `::after` with CSS clip-path — 4-point knotwork corner in the path color
- At sub-level 1 (never started): border is `--line` gray, no corner accents, card is slightly desaturated

#### Path deck grouping
Each path becomes a **deck** — a collapsible container styled like a stack of cards:

```
╔══════════════════════════════════╗
║  ⚔️  PATH OF WAR    World Lv 4  ║  ← deck header (always visible)
║  12 skills  ·  3 fading  ·  ▼   ║  ← summary stats + expand toggle
╚══════════════════════════════════╝
   ┌──────────────────────────────┐   ← cards fan out below when expanded
   │  [card]                     │
   └──────────────────────────────┘
   ┌──────────────────────────────┐
   │  [card]                     │
   └──────────────────────────────┘
```

- Collapsed: shows only the deck header bar with world level, skill count, fading count
- Expanded: cards stack below with a subtle stagger shadow (each card offset 2px right from the previous)
- Tap the deck header to toggle. Default: the most active deck (most recent xp) is expanded; all others collapsed
- The deck header bar uses the path color as a left accent (4px) and a faint path-color background tint

#### Implementation files
- `src/tabs/skills.js` — `leafCard()` and `renderSkillsTab()` restructured for deck layout
- `src/styles/main.css` — `.sk-deck`, `.sk-deck-header`, `.sk-deck-body`, `.sk-card` redesign, `.sk-card::before/::after` corner accents

---

## 2. Per-Tab Visual Theming

Each tab gets a distinct visual atmosphere that matches its name and function. Changes are CSS + HTML only — no new JS state, no layout restructures that break existing functionality.

### Design principles for tab theming
- **Header zone**: each tab content area gets a `<div class="tab-header-band">` with the tab's emblem color and a subtle texture or line pattern
- **Card/container borders**: match the tab's aesthetic (angular for tactical, organic for personal, archival for records)
- **Section dividers**: styled to match (sword-rule for tactical, vine for personal, ledger-line for log)
- **Typography treatment**: letter-spacing and case adjusted per tab (orders = uppercase stencil, knowledge = normal scholarly)

---

### Tab-by-tab specifications

#### Dawn (today.js)
**Theme: First light over Asgard — golden, anticipatory, commanding**
- Background strip at top of content: deep navy-to-gold gradient, tall enough to frame the greeting
- Greeting card: wide horizontal card with a gold left border (4px), subtle gold inner shadow
- Field Brief card: parchment-toned background (`rgba(184,160,106,.07)`), rune-corner accents (::before/::after), amber text for the date
- Commission countdown bar: when active, renders with a gold pulse animation (CSS `@keyframes pulse-gold`)
- Section dividers between Field Notes / Path XP / Discipline / Quests: a thin horizontal rule with a small diamond or rune at center

#### Oaths (quests.js / state.js)
**Theme: Sworn word on parchment — weighty, binding, ancient**
- Oath cards: slightly warmer background (`rgba(184,160,106,.05)`), left border becomes a vertical rune-stroke (SVG inline, 3px wide, path-colored)
- Active oaths with a due date: a red wax-seal dot in the top-right corner (CSS circle + box-shadow for depth)
- Overdue oaths: full amber left border, card background slightly warmer
- Archive section: sepia-toned card backgrounds, reduced opacity, feels like old parchment
- Deck header: "THE OATH ARCHIVE" label in small-caps, with a horizontal line pattern beneath it

#### Orders (dailies.js)
**Theme: Military orders board — stencil, duty, accountability**
- Orders list container: dark background (`#0a0b07`), monospace-adjacent font treatment
- Each order row: horizontal rule between rows, checkbox redesigned as a square checkbox (not circle)
- Done state: line-through with a strike animation (CSS transition)
- 7-day summary banner: looks like a mission status board — stencil uppercase, amber numbers
- Habit cards: grid card layout instead of full-width rows

#### Objectives (bosses.js)
**Theme: Fortress under siege — HP bars as battlements**
- Boss/objective cards: dark bordered, angular corners (no border-radius on outer edge, 4px on inner)
- HP bar: styled as a battlement wall — the filled portion uses a crenellation top edge via CSS `clip-path` or repeating SVG pattern
- HP critical (< 20%): bar pulses red
- HP full (100%): gold celebration border

#### AFT (aft.js)
**Theme: Combat readiness — stark, honest, measurement-forward**
- Score card: black background, amber score number in a large font (48px+), ruled border
- Per-event rows: each event styled as a unit on a military scoresheet (horizontal dividers, monospace numbers)
- Sparkline (v102): rendered on a dark grid background (faint CSS grid lines)
- History cards: feel like official test records — date in small-caps at top, score ruled underneath

#### Profile (profile.js)
**Theme: Personnel dossier — ID card, classified file**
- Profile card container: styled as a file folder with a tabbed top edge (CSS `::before` clip-path creates the tab)
- Blood type / rank / commissioning: rendered as data fields in a structured form — label in uppercase, value in amber
- Photo area (if present): styled with a frame and classification-corner stamp

#### Log (log.js)
**Theme: Warrior's journal — hand-written ledger**
- Log entry cards: slightly aged paper tint, left margin line (a 1px amber rule 40px from left)
- Entry header (date + type): in small-caps, like a journal entry header
- Exercise rows: feel like ledger entries — exercise name left-aligned, values right-aligned

#### Plan (plan.js)
**Theme: Tactical map — mission planning, grid paper**
- Plan container background: faint grid texture (CSS `repeating-linear-gradient` crosshatch at very low opacity)
- Session cards: look like mission briefing cards — bold header with objective, body with details
- Weekly goal recommendation (v102): rendered as a mission parameter block, bordered top and bottom
- Coach-today section: styled as a "ORDERS FOR TODAY" panel with amber border

#### Awards / The Wall (awards.js)
**Theme: Trophy case / shadow box — honor, permanence**
- Award cards: dark navy background, gold inner glow on hover, feels like a display case
- Award name: in a heavier weight, gold color
- Unearned awards: desaturated, lower opacity, feels like an empty display slot

#### Records (records.js)
**Theme: Archive / stone inscription — permanence, history**
- Section headers: styled as stone tablet headers — engraved-look using `text-shadow: 1px 1px 0 #000, -1px -1px 0 rgba(255,255,255,.05)`
- History entries: archival card style, date in the top corner like a filing date

#### Weight / Promise Ledger (weight.js)
**Theme: Sacred oath on vellum — solemn, binding**
- Container: warm parchment-adjacent tint, slightly narrower to feel like a scroll
- Promise entries: each entry has a subtle left rule, weight rendered in amber

#### Skills (skills.js)
**Theme: Card deck — artifact, collectible, earned**
See Section 1 above.

#### Tree (tree.js)
**Theme: Yggdrasil — already themed; enhanced by emblem system (Section 3)**

---

## 3. Tree Emblems — Per-Skill Achievement Imagery

### Concept
Every skill leaf on the Yggdrasil tree gains an emblem — a small SVG symbol rendered inside or around the leaf. The emblem's visual complexity scales directly with the skill's effective level: at level 1 the emblem is a single raw stroke; at max level it is a fully realized, ornate version of the motif.

Each path has a **base motif**. Each skill within the path gets a **variation** — a subtle shift in orientation, proportions, or accent marks — derived deterministically from the skill's name (a simple hash). This means two skills on the same path at the same level look related but not identical.

### Complexity tiers
Mapped from `effectiveLevel / maxLevel`:

| Tier | Threshold | Visual character |
|---|---|---|
| 0 — Nascent | Not started | No emblem (plain circle) |
| 1 — Raw | 1–20% of max | Single stroke / outline shape only |
| 2 — Forged | 21–40% | Complete base form, no inner detail |
| 3 — Tempered | 41–60% | One inner element added |
| 4 — Refined | 61–80% | Secondary ornamentation, accent marks |
| 5 — Mastered | 81–100% | Full complexity, all elements present |

### Per-path motifs

#### `tactical` — Path of War → **Rune-sword**
1. Raw: a vertical line with a single horizontal cross-guard
2. Forged: fuller (groove) added to the blade, pommel circle
3. Tempered: edge bevel lines, crossguard ends curl outward
4. Refined: a single rune mark inscribed on the blade
5. Mastered: full Norse short-sword — knotwork pommel, full rune inscription, decorated crossguard

Variation seed controls: blade width ratio, pommel shape (round vs oval vs diamond), rune glyph (3 options: Tiwaz ᛏ, Algiz ᛉ, Eihwaz ᛇ)

#### `physical` — Path of the Body → **Ember flame**
1. Raw: single teardrop flame outline
2. Forged: inner flame teardrop added
3. Tempered: second outer tongue of flame
4. Refined: ember base arc, three distinct flame tongues
5. Mastered: full crown flame with ember ring and spark marks at base

Variation seed controls: flame lean (left / center / right), inner flame proportion, number of spark marks (1–3)

#### `cognitive` — Path of the Mind → **Rune-eye (Odin's eye)**
1. Raw: simple almond-shaped outline (closed)
2. Forged: open eye, iris ring added
3. Tempered: pupil dot, inner iris detail
4. Refined: brow line above, single rune mark
5. Mastered: full eye — upper and lower lashes (4 lines each), brow arc, double rune marks, iris ring detail

Variation seed controls: eye proportions (wide vs narrow), lash count (3–5), rune glyph variant

#### `physiological` — Path of Vitality → **Valknut**
1. Raw: single triangle
2. Forged: two overlapping triangles
3. Tempered: three triangles (valknut form, but open/unconnected)
4. Refined: fully connected valknut with inner lines
5. Mastered: valknut with outer containing circle and inner triangle detail

Variation seed controls: rotation angle (0 / 30 / 60 degrees), inner line weight

#### `technical` — Path of the Craft → **Gear / circuit node**
1. Raw: circle with 4 stubby teeth
2. Forged: 6-tooth gear, proper tooth shape
3. Tempered: 8-tooth gear, inner circle bore
4. Refined: inner hexagon, spoke lines from bore to inner ring
5. Mastered: full gear with 10 teeth, inner hexagon, circuit trace lines radiating from base

Variation seed controls: tooth count variant (4/6/8 → 6/8/10), inner shape (hexagon vs circle vs square), trace line count (1–3)

#### `leadership` — Path of Command → **Crown**
1. Raw: single center spire line
2. Forged: three-point crown, base line
3. Tempered: five-point crown, band base
4. Refined: crown with dot jewels at each point, detailed base band
5. Mastered: full crown — seven points, jewel insets, decorative base band with cross-hatching

Variation seed controls: point count (3/5/7), jewel shape (circle vs diamond), base band pattern

#### `academic` — Path of Knowledge → **Open rune-scroll**
1. Raw: single horizontal scroll line, curl marks at ends
2. Forged: scroll with two text lines (horizontal bars)
3. Tempered: open book form — two pages, spine line
4. Refined: book with four text lines per page
5. Mastered: fully detailed open tome — text lines, chapter markers, corner page curl, binding visible

Variation seed controls: page angle (slightly open vs wide open), text line count (2/3/4), a corner bookmark detail

#### `personal` — Path of the Self → **Seed to sprout**
1. Raw: seed shape (oval)
2. Forged: seed with single taproot line
3. Tempered: seed cracked open, single sprout shoot and leaf
4. Refined: plant with stem and two leaves
5. Mastered: small tree — visible roots below ground line, trunk, two branch pairs, small leaf forms at tips

Variation seed controls: leaf shape (rounded vs pointed), root depth, branching angle

#### `hearth` — Path of the Hearth → **Hearth with flame**
1. Raw: single ember dot
2. Forged: small teardrop flame
3. Tempered: flame with a base arc (hearth opening)
4. Refined: full arch with flame inside, ember dots at base
5. Mastered: detailed hearthstone arch, flame tongues, ember field, a small rune carved into the arch keystone

Variation seed controls: arch width, flame size, keystone rune (Othala ᚩ, Ingwaz ᛜ, Dagaz ᛞ)

#### `roots` — Path of Roots → **Root network**
1. Raw: single horizontal root line
2. Forged: T-branch root (down + two sideways)
3. Tempered: branching root system (4 branches)
4. Refined: deeper root network with secondary branchlets
5. Mastered: full root system — primary, secondary, tertiary branches, with knotwork node at the taproot center

Variation seed controls: branching angle spread (narrow vs wide), knotwork detail at center (knot vs simple node)

---

### Technical implementation approach

**Location:** `src/core/tree.js` — new section `// === SKILL EMBLEMS ===`

**Emblem generator signature:**
```javascript
function skEmblem(skill, effectiveLevel, maxLevel, cx, cy, r) {
  // Returns SVG string for the emblem centered at (cx, cy) within radius r
  // skill.id used to derive variation seed via simple hash
}
```

**Variation seed:**
```javascript
function _emblemSeed(skillId) {
  let h = 0;
  for (let i = 0; i < skillId.length; i++) h = ((h << 5) - h + skillId.charCodeAt(i)) | 0;
  return Math.abs(h) % 4; // 0–3
}
```

**Complexity tier:**
```javascript
function _emblemTier(eff, max) {
  if (!eff || eff < 1) return 0;
  const pct = eff / max;
  if (pct <= 0.20) return 1;
  if (pct <= 0.40) return 2;
  if (pct <= 0.60) return 3;
  if (pct <= 0.80) return 4;
  return 5;
}
```

**Per-path dispatcher:**
```javascript
const _EMBLEM_FN = {
  tactical: _emblemSword,
  physical: _emblemFlame,
  cognitive: _emblemEye,
  physiological: _emblemValknut,
  technical: _emblemGear,
  leadership: _emblemCrown,
  academic: _emblemScroll,
  personal: _emblemSprout,
  hearth: _emblemHearth,
  roots: _emblemRoots,
};
```

**Rendering location:** inside the existing leaf circle, at roughly 60% of the leaf radius. At the tree's normal zoom level, the emblem is a small but visible hint; at 2× zoom it becomes clearly readable.

**Fade ring interaction:** the fade countdown ring (added v101) wraps the outside of the leaf. The emblem sits inside the leaf. Together they form the full "achievement indicator" — ring shows temporal decay, emblem shows depth of mastery.

---

## 4. Implementation Phases

### Phase 1 — Skill cards + deck UI
**Sessions: 1**
Files: `src/tabs/skills.js`, `src/styles/main.css`
Validates the card aesthetic and deck interaction before rolling out elsewhere.
Deliverable: skills tab looks like an artifact deck; paths are collapsible stacks.

### Phase 2 — Tree emblems
**Sessions: 1–2**
Files: `src/core/tree.js`
Defines the achievement visual language used everywhere.
Deliverable: every started skill has a level-appropriate emblem on the tree.

### Phase 3 — Tab theming sweep
**Sessions: 2–3** (one session per 5–6 tabs)
Files: `src/styles/main.css` + per-tab HTML
Start with Dawn → Oaths → Orders → AFT → Log (the daily-use tabs).
Then do Awards → Records → Plan → Profile → Weight.
Deliverable: each tab feels like a distinct chamber of the same world.

---

## 5. Constraints (non-negotiable)

- No external images, fonts, or CDN assets. All SVG is inline in the JS string output.
- No new JS state. Theme is purely presentational.
- All changes go through `src/` → `python scripts/build.py` → verify with `npm run regress` (zero pageerror).
- `SKILL_LADDER_VER` is not bumped — no skill data is changing.
- SW cache version bumps once per shipping version, not per feature.
- The tree pan/zoom, tap-to-navigate, fade rings, and all existing functionality remain intact.
- No performance regression: emblem SVG must be generated inline, not from the DOM. Keep emblem SVG strings short.
