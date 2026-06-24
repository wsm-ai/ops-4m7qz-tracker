# Visual Overhaul Session Prompt — Operations PWA

Paste this at the start of a session when continuing the visual redesign.

**Phases 1 and 2 are complete.** See `planning/FINISHED-FEATURES.md` for the full record of what was built (skill deck UI, sigil system, carved rings overhaul). Only Phase 3 remains.

**Current version: v103.** Service worker is at `operations-v103` in `sw.js`. Bump to `v104` when you ship.

---

## Phase 3 — Tab Theming Sweep

Read `planning/DESIGN-VISUAL-OVERHAUL.md` Section 2 for the full per-tab specifications. Read `planning/FINISHED-FEATURES.md` for design language reference (color palette, path colors, Yggdrasil theme rules).

### Recommended session splits

**Session 3a — Daily-use tabs (highest value, do these first):**
- Dawn (`today.js`) — golden light, anticipatory, commanding
- Oaths (`quests.js`) — sworn parchment, weighty, ancient
- Orders (`dailies.js`) — military stencil, accountability board
- AFT (`aft.js`) — stark, measurement-forward, combat readiness

**Session 3b — Secondary tabs:**
- Log (`log.js`) — warrior's journal, hand-written ledger
- Plan (`plan.js`) — tactical map, grid paper, mission briefing
- Awards (`awards.js`) — trophy case, shadow box, honor
- Records (`records.js`) — archive, stone inscription, permanence

**Session 3c — Tertiary tabs:**
- Profile (`profile.js`) — personnel dossier, ID card
- Weight (`weight.js`) — sacred oath on vellum, solemn
- Board (`board.js`) — task board styling
- Shop (`shop.html`) — reward shop styling

---

## Implementation rules for Phase 3

### What you're doing
Apply per-tab visual atmosphere using CSS only. No new JS state. No layout restructures that break existing JS renderers.

### Files to change
- `src/styles/main.css` — primary change target; add tab-scoped CSS under a clear comment per tab
- `src/tabs/<tab>.html` — only if a wrapper element or class attribute needs to be added
- `src/tabs/<tab>.js` — only if a class needs to be applied to a dynamically-rendered wrapper

### Approach for each tab
1. Read the tab's spec in `DESIGN-VISUAL-OVERHAUL.md` Section 2
2. Identify the CSS that creates the atmosphere (background tints, border styles, typography treatment)
3. Add to `main.css` under: `/* === TAB NAME THEME === */`
4. Test that the tab renders and all interactive elements still work
5. Run `npm run regress` before moving to the next tab

### What NOT to do
- Do not restructure HTML significantly — this breaks existing JS renderers
- Do not add new JS state or new localStorage keys
- Do not add external assets, CDN links, or network calls
- Do not change how data is stored, loaded, or computed
- Do not alter the Yggdrasil tree renderer or skill sigil system

### Per-tab atmosphere specs (abbreviated — see DESIGN-VISUAL-OVERHAUL.md for full detail)

#### Dawn (`view-today`)
- Top strip: deep navy-to-gold gradient framing the greeting
- Greeting card: wide, gold left border (4px), subtle gold inner shadow
- Field Brief card: parchment tint (`rgba(184,160,106,.07)`), rune-corner accents (::before/::after)
- Commission countdown bar: gold pulse animation when active
- Section dividers: thin rule with diamond or rune at center

#### Oaths (`view-quests`)
- Oath cards: warmer background tint, left border as vertical rune-stroke
- Overdue oaths: amber left border, warmer card background
- Active oaths with due date: small red wax-seal dot (CSS circle) in top-right
- Archive: sepia-toned reduced-opacity cards, "THE OATH ARCHIVE" in small-caps

#### Orders (`view-dailies`)
- Container: near-black background (`#0a0b07`), monospace-adjacent treatment
- Order rows: horizontal rules between rows
- Done state: strike animation on check
- 7-day summary banner: mission status board look — stencil uppercase, amber numbers

#### AFT (`view-aft`)
- Score card: black background, amber score in 48px+ font, ruled border
- Per-event rows: military scoresheet style, monospace numbers
- Sparkline: dark grid background (faint CSS `repeating-linear-gradient` crosshatch)
- History cards: official test record feel — date in small-caps

#### Log (`view-log`)
- Entry cards: slight aged-paper tint, 1px amber left-margin rule 40px from left
- Entry header (date + type): small-caps journal header style
- Exercise rows: ledger entries — name left-aligned, values right-aligned

#### Plan (`view-plan`)
- Container: faint grid texture (`repeating-linear-gradient` crosshatch at very low opacity)
- Session cards: mission briefing card — bold header with objective
- Weekly goal block: mission parameter block, bordered top and bottom
- Coach-today: "ORDERS FOR TODAY" panel with amber border

#### Awards (`view-awards`)
- Award cards: dark navy background, gold inner glow on hover
- Award name: heavier weight, gold color
- Unearned awards: desaturated, lower opacity (empty display slot)

#### Records (`view-records`)
- Section headers: engraved-look via `text-shadow: 1px 1px 0 #000, -1px -1px 0 rgba(255,255,255,.05)`
- History entries: archival card style, filing date in top corner

#### Profile (`view-profile`)
- Profile card: file folder with tabbed top edge (CSS `::before` clip-path creates the tab)
- Blood type / rank: data fields — label in uppercase, value in amber

#### Weight (`view-weight`)
- Container: warm parchment tint, slightly narrower to feel like a scroll
- Promise entries: subtle left rule, weight values in amber

---

## Required workflow

```bash
# After each tab:
python scripts/build.py
npm run check
npm run regress       # must show 0 pageerror

# When the full session's tabs are done:
# Bump sw.js: operations-v103 → operations-v104 (or current+1)
npm run package
```

**Definition of done:** `npm run regress` passes with 0 pageerror, SW bumped, `npm run package` run.

---

## Architecture reminders

- `index.html` is assembled output — edit `src/` only, then build
- `skLeafColor(eff, max)` returns `rgb(r,g,b)` — use in `style=""` attributes directly, not as a CSS var
- `SK_PATH_ICON` is in `src/core/tree.js`; `SK_CAT` and `SK_CAT_ORDER` in `src/core/skills-data.js`
- All CSS lives in `src/styles/main.css` — no per-tab CSS files
- No new dependencies. No network calls. No external fonts.
- After this phase, update `planning/NEXT-SESSION-PROMPT.md` to mark the visual overhaul fully complete
