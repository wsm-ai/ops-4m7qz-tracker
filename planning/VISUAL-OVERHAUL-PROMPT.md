# Visual Overhaul Session Prompt — Operations PWA

Paste this at the start of a session when implementing the visual redesign.
Pick **one phase** per session — do not attempt all three in one session.

---

You are implementing a major visual redesign of **Operations**, a gamified ROTC life-tracker PWA. Read `CLAUDE.md` first (binding rulebook), then `docs/OPERATIONS-HANDOFF.md` (architecture), then **`planning/DESIGN-VISUAL-OVERHAUL.md`** (the full visual specification you will implement from).

**Current version: v101.** Service worker is at `operations-v101` in `sw.js`. Bump to the next version when you ship.

---

## This session: implement Phase [N]

Replace `[N]` with the phase you are doing:

- **Phase 1** — Skill cards + deck UI
- **Phase 2** — Tree emblems
- **Phase 3** — Tab theming sweep (specify which tabs)

---

## Phase 1 — Skill cards + deck UI

### What to build
Transform the skills tab from a flat list into a deck-based card interface. Full spec in `planning/DESIGN-VISUAL-OVERHAUL.md` Section 1.

### Files to change
- `src/tabs/skills.js` — `leafCard()` and `renderSkillsTab()`
- `src/styles/main.css` — all `.sk-*` classes

### Card anatomy (abbreviated)
Each skill is a card with:
- **Header band**: path icon + "PATH OF X" label + "Lv N / Max" — dark background in path color tint
- **Center emblem**: placeholder circle for now (Phase 2 fills this in with the real emblem SVG)
- **Skill name**: large, below emblem
- **Tier label**: current tier name below skill name
- **Level fill bar**: path-colored, width = `(effectiveLevel / maxLevel * 100)%`
- **Footer**: fade warning (if fading) + copy button
- **Border**: layered box-shadow for depth + CSS `::before`/`::after` corner accents in path color

### Deck layout
- `renderSkillsTab()` groups cards by `sk.cat` (already does this; restructure the wrapper)
- Each path group becomes a `.sk-deck` with a `.sk-deck-header` (always visible) and `.sk-deck-body` (collapsible)
- Deck header shows: path icon, path name, world level, skill count, fading count, expand arrow
- Default: the path with the most recent XP activity (highest `pathXP[cat]`) is expanded; all others collapsed
- Tap the deck header toggles `.sk-deck-body` visibility (add `data-skdeck` attribute, handle in `events.js` or inline onclick)
- Cards in an expanded deck have a `2px` stagger shadow to feel like a physical stack

### Path colors
Use `skLeafColor()` from `skills-core.js` on the path's aggregate level, OR derive from the existing color palette per-path. The safe approach: use the `--ember`, `--gold`, etc. CSS vars mapped by cat, not a computed per-card color for the deck header (individual cards still use `skLeafColor` for their fill bar and border).

Suggested path-color mapping for deck headers (add these as CSS custom properties or hardcode):
```
tactical     → #7a3e3e  (dark red)
physical     → #7a5c2a  (dark amber)
cognitive    → #3a5c7a  (dark steel blue)
physiological→ #3a6b4a  (dark green)
technical    → #4a4a6b  (dark indigo)
leadership   → #6b5a2a  (dark gold)
academic     → #5a3a6b  (dark violet)
personal     → #3a6b3a  (dark sage)
hearth       → #7a4a2a  (dark ember)
roots        → #4a5a3a  (dark moss)
```

### CSS classes to add / update
- `.sk-deck` — outer deck wrapper, `margin-bottom: 18px`
- `.sk-deck-header` — flex row, `cursor: pointer`, `border-radius: 10px`, path color left accent, expand arrow rotates on `.open`
- `.sk-deck-body` — cards container, `display: none` by default, `display: block` when deck is open
- `.sk-card` — full redesign: `border-radius: 12px`, dark background, layered box-shadow border, `padding: 0` (internal sections handle padding), `position: relative` for corner accents
- `.sk-card::before` `.sk-card::after` — corner ornaments (top-left and bottom-right): small SVG-drawn corner bracket or knotwork in path color, achieved via `background-image: url("data:image/svg+xml,...")` or pure CSS clip-path
- `.sk-card-header` — header band inside card
- `.sk-card-emblem` — center emblem area, `min-height: 60px`, `display: flex; align-items: center; justify-content: center`
- `.sk-card-name` — skill name, larger weight
- `.sk-card-tier` — tier label, `var(--ink-dim)`, smaller
- `.sk-card-footer` — flex row with fade info + copy button
- `.sk-level-bar` — already exists, keep and refine

### Regression requirement
After changes: `npm run regress` must show 0 pageerror and the SKILL AUDIT `{badCount: 0}`.

---

## Phase 2 — Tree emblems

### What to build
Every started skill leaf on the Yggdrasil tree gets a per-skill SVG emblem inside it. Emblem complexity scales with `effectiveLevel / maxLevel` (5 tiers: Raw → Forged → Tempered → Refined → Mastered). Full motif spec per path in `planning/DESIGN-VISUAL-OVERHAUL.md` Section 3.

### File to change
`src/core/tree.js` — add a new `// === SKILL EMBLEMS ===` section before `renderSkillTree()`

### Implementation blueprint

**Step 1: Add helper functions**
```javascript
function _emblemSeed(skillId) {
  let h = 0;
  for (let i = 0; i < skillId.length; i++) h = ((h << 5) - h + skillId.charCodeAt(i)) | 0;
  return Math.abs(h) % 4;
}
function _emblemTier(eff, max) {
  if (!eff || eff < 1) return 0;
  const pct = eff / (max || 1);
  if (pct <= 0.20) return 1;
  if (pct <= 0.40) return 2;
  if (pct <= 0.60) return 3;
  if (pct <= 0.80) return 4;
  return 5;
}
```

**Step 2: Write one emblem function per path**
Each function signature: `function _emblemX(cx, cy, r, tier, seed)` returns an SVG string.
Implement them per the motif specs in Section 3 of the design doc.
Key constraint: keep generated SVG strings short — these are inlined into a large SVG. No `<style>` blocks inside emblem SVG. Use `stroke`, `fill`, `stroke-width` attributes directly.

**Step 3: Dispatcher**
```javascript
const _EMBLEM_FN = {
  tactical: _emblemSword, physical: _emblemFlame, cognitive: _emblemEye,
  physiological: _emblemValknut, technical: _emblemGear, leadership: _emblemCrown,
  academic: _emblemScroll, personal: _emblemSprout, hearth: _emblemHearth, roots: _emblemRoots,
};
function skEmblem(skill, eff, max, cx, cy, r) {
  const fn = _EMBLEM_FN[skill.cat]; if (!fn) return '';
  const tier = _emblemTier(eff, max);
  if (tier === 0) return '';
  const seed = _emblemSeed(skill.id || skill.name);
  return fn(cx, cy, r * 0.58, tier, seed); // emblem fits within 58% of leaf radius
}
```

**Step 4: Call in leaf rendering**
In the existing leaf-rendering loop where sub-leaves and solo-node circles are drawn, after the circle element, insert the emblem:
```javascript
const emblemSvg = skEmblem(leaf, eff, sk.levels.length, lx, ly, leafR);
// append to leaves array after the circle
```

### Emblem SVG style guidelines
- All emblems use `stroke="currentColor"` with `stroke-width` scaled to `r * 0.08` or similar fraction
- `fill="none"` by default; use `fill` only for solid inner shapes at tier 4–5
- Color: use the same leaf color (`skLeafColor(eff, max)`) so the emblem matches the leaf
- Keep each emblem to ≤ 8 SVG elements at tier 5. Tier 1 should be 1–2 elements.

### Screenshot verification
After implementing, run `npm run regress -- --shot` to generate `dist/tree.png` and verify:
- Emblems are visible at normal zoom
- No overlap with fade rings (rings are outside the circle; emblems are inside)
- No overlap with leaf labels

---

## Phase 3 — Tab theming sweep

### What to build
Apply per-tab visual atmosphere to each tab. Full tab specs in `planning/DESIGN-VISUAL-OVERHAUL.md` Section 2.

### Recommended session splits
**Session 3a**: Dawn, Oaths, Orders, AFT (the daily-use tabs — highest value)
**Session 3b**: Log, Plan, Awards, Records (secondary tabs)
**Session 3c**: Profile, Weight, Board, Shop (tertiary tabs)

### Files to change
- `src/styles/main.css` — add tab-scoped CSS classes for each tab's atmosphere
- `src/tabs/<tab>.html` — add `.tab-header-band` wrapper or atmosphere class to root element if needed
- `src/tabs/<tab>.js` — only if a render change is needed (e.g. adding a class to a wrapper element)

### Approach for each tab
1. Read the tab spec in `DESIGN-VISUAL-OVERHAUL.md` Section 2
2. Identify the CSS that creates the atmosphere (background tints, border styles, typography treatment)
3. Add it to `main.css` under a clearly labelled comment: `/* === DAWN TAB THEME === */`
4. Test that the tab renders correctly and all interactive elements still work
5. Run `npm run regress` before moving to the next tab

### What NOT to do in this phase
- Do not restructure the HTML of any tab significantly — this could break existing JS renderers
- Do not add new JS state
- Do not add any external assets
- Do not change how data is stored or displayed — only how it is styled

---

## Required workflow for all phases

```bash
# After each feature or tab:
python scripts/build.py
npm run check
npm run regress

# When the full phase is done:
# Bump sw.js:  operations-v101 → operations-v102 (or current+1)
npm run package
```

**Definition of done per phase:** `npm run verify` passes with 0 pageerror, SW version bumped, `npm run package` run, deliverable described in phase spec is visually complete.

---

## Architecture reminders

- `index.html` is assembled output — edit `src/` only, then `python scripts/build.py`
- `skLeafColor(eff, max)` returns an `rgb(r,g,b)` string — NOT a CSS var — use directly in `style=""` attributes
- `SK_PATH_ICON`, `SK_CAT` are defined at the top of `src/core/skills-data.js` and available globally
- `SK_CAT_ORDER` = `["tactical","physical","cognitive","physiological","technical","leadership","academic","personal","hearth","roots"]`
- Tree leaf rendering is in `renderSkillTree()` in `src/core/tree.js` — the leaf circles and their fade rings are added to the `leaves[]` array
- `skEffectiveLevel(sk)` and `skDaysLeft(sk)` are in `src/core/skills-core.js`
- No new dependencies. No network calls. No external fonts.

---

## After each phase

1. Commit or package the deliverable
2. Note what phase was completed in `planning/NEXT-SESSION-PROMPT.md` under "What was just completed"
3. On the final phase (Phase 3c), update `planning/NEXT-SESSION-PROMPT.md` to show the visual overhaul as fully complete
