# Next Session Prompt — Operations PWA

Paste this into a new Claude Code session to resume work.

---

You are continuing work on **Operations**, a gamified ROTC life-tracker PWA built for an Army ROTC cadet (MS2, Cyber branch goal). Read `CLAUDE.md` first — it is the binding rulebook. Then read `docs/OPERATIONS-HANDOFF.md` for full architecture. Then read `planning/FINISHED-FEATURES.md` for the design language, completed features, and project identity — this is your primary reference for what already exists and how things should look and feel.

**Current version: v106.** The service worker is at `operations-v106` in `sw.js`.

---

### ✅ Visual Overhaul — COMPLETE (v102–v106)

All three phases of the visual overhaul are done. Full details in `planning/FINISHED-FEATURES.md`.

**Phase 1 (v102) — Skill Cards + Deck UI:**
- Skills tab transformed into collapsible path decks with card-based skill layout
- Each skill card has: path header band, center sigil, tier label, level fill bar, fade footer

**Phase 2 (v102–v103) — Per-Skill Sigil System + Carved Rings:**
- `skEmblemSvg` IIFE in `src/tabs/skills.js`: 10 path motifs, 5 complexity tiers, variation seed from skill ID hash
- Carved Rings tab overhauled to sigil card grid (peak-level sigils, permanent record)

**Phase 3 (v104–v106) — Tab Theming Sweep (all 12 tabs):**
- v104 (3a): Dawn, Oaths, Orders, AFT
- v105 (3b): Log, Plan, Awards, Records
- v106 (3c): Profile, Weight, Board, Shop

Every tab now has a distinct atmosphere scoped to its `#view-*` ID in `src/styles/main.css`. No new JS state, no HTML restructuring, no external assets.

---

### Ready for new work

The app is at a solid visual baseline. Wyatt will direct what comes next. Some candidate areas (do not implement until asked):

- **New skill ladders** — any domain Wyatt wants to add with measurable benchmarks
- **Objective / Boss improvements** — HP bar crenellation styling (spec in `DESIGN-VISUAL-OVERHAUL.md`)
- **Quiz bank expansion** — more ROTC subject coverage
- **Training plan refinements** — session variety, baseline test tracking
- **Export improvements** — PDF/printable counseling forms

---

### Required workflow for every change

1. Edit source files in `src/` only — never touch `index.html` directly
2. Run `python scripts/build.py` after changes
3. Run `npm run check` (syntax) and `npm run regress` (headless 18-tab test, 0 pageerror required)
4. Bump `sw.js` cache version when shipping
5. Run `npm run package` to produce the final zip

---

### Key architecture reminders

- `index.html` is **assembled output** — edit `src/`, then build
- All data in `localStorage` key `"operations_v2"` via `S = load()`
- `skLeafColor(eff, max)` returns `rgb(r,g,b)` string — use directly in `style=""` attributes
- `skEmblemSvg(sk, eff, max)` — sigil generator, globally available (defined in `skills.js`, used in `trophies.js`)
- `SK_PATH_ICON` is in `src/core/tree.js`; `SK_CAT` / `SK_CAT_ORDER` in `src/core/skills-data.js`
- All CSS in `src/styles/main.css` — no per-tab CSS files
- No network calls, no CDN fonts, no telemetry — ever
- Regression test covers **18 tabs** (see `scripts/regress.js`)

### Tone and constraints

Wyatt values: honesty, measurability, privacy, preserved progress, and the Yggdrasil symbolism. Keep copy plain and honest — no hype, no fake metrics. Ask before large architectural changes. Small surgical diffs.
