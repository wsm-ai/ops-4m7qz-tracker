# Next Session Prompt — Operations PWA

Paste this into a new Claude Code session to resume work.

---

You are continuing work on **Operations**, a gamified ROTC life-tracker PWA built for an Army ROTC cadet (Wyatt, MS2, Cyber branch goal). **Read all four of these before touching any code:**

1. `CLAUDE.md` — the binding rulebook (hard rules, workflow, file layout)
2. `planning/FINISHED-FEATURES.md` — design language, current color palette, completed features, project identity
3. `planning/IMPROVEMENTS-v101.md` — one remaining feature from v101 (post-log adaptive toast), with full implementation sketch
4. `planning/IMPROVEMENTS-v102.md` — all 10 v102 features with full implementation sketches, original rationale, and CSS snippets

This prompt summarizes the features and gives you the key code. The improvements docs are the authoritative detail — cross-reference them if any implementation sketch below is unclear or seems incomplete.

**Current version: v109.** The service worker is at `operations-v109` in `sw.js`.

---

## What's already done — do not re-implement

All three phases of the visual overhaul are complete (v102–v109):
- **Phase 1 (v102):** Skills tab → collapsible path decks, per-skill card anatomy with sigil, fill bar, tier label
- **Phase 2 (v102–v103):** `skEmblemSvg` sigil system (10 paths × 5 tiers), Carved Rings overhauled to sigil grid
- **Phase 3 (v104–v109):** All 18 tabs themed with `#view-*` scoped CSS; dark walnut wood grain on body + card backgrounds; AFT 54px total score display; Dawn atmospheric strip; Orders done-flash animation; Profile folder tab

Full details in `planning/FINISHED-FEATURES.md`. Do not touch the visual overhaul work.

---

## Features to implement this session

Work through these in priority order. Bump `sw.js` to the next version number when you ship each batch, run `npm run verify` to confirm 0 pageerrors, and `npm run package` at the end.

---

### 1. Post-log adaptive target toast [v101 — LOW EFFORT]
**File:** `src/tabs/log.js`

When a workout is saved and adaptive targets auto-update, the change is silent. Close the loop with a toast.

- In the workout-save handler (after `save(); render();`), snapshot adaptive targets before save, then diff after.
- Emit: `toast('🎯 ' + count + ' exercise target' + (count!==1?'s':'') + ' climbed — plan updated')`
- The existing `adaptiveTarget()` function in `log.js` already computes per-exercise targets — use it before and after the save to count changes.

---

### 2. Skill "fading soon" digest on Dawn [VERY LOW EFFORT]
**File:** `src/tabs/today.js` — in the `notes` array section of `renderToday()`

The Dawn tab only mentions the single most urgent fading skill. A cadet with 4 fading skills misses 3 of them.

```javascript
const fadingSoon=(S.lifeSkills||[]).filter(s=>!s.group&&s.currentLevel>0)
  .map(s=>({s,days:skDaysLeft(s)}))
  .filter(x=>x.days!==null&&x.days<=Math.ceil((x.s.fadeDays||30)*0.2))
  .sort((a,b)=>a.days-b.days);
if(fadingSoon.length>1) notes.push(
  `<div class="fn-row"><span class="fn-dot">🍂</span><span>${fadingSoon.length} skills fading: ${fadingSoon.slice(0,4).map(x=>esc(x.s.name)).join(' · ')}</span><button class="td-go-sm" data-gototab="skills">→</button></div>`
);
```

The existing single-skill fade alert still runs for the most urgent one — this adds a summary note when there are multiple.

---

### 3. Baseline test "due this month" nudge on Dawn [VERY LOW EFFORT]
**File:** `src/tabs/today.js` — in the `notes` array section of `renderToday()`

Monthly baseline tests (max pushups, plank, 2-mile) drive the adaptive training system. A cadet who forgets them for 6 weeks gets stale targets.

```javascript
const lastBL=(S.baselines||[]).sort((a,b)=>b.ts-a.ts)[0];
const daysSinceBL=lastBL?Math.round((Date.now()-lastBL.ts)/864e5):999;
if(daysSinceBL>28) notes.push(
  `<div class="fn-row"><span class="fn-dot">📐</span><span>Baseline test ${lastBL?'last done '+daysSinceBL+'d ago':'not yet done'} — monthly max-effort test due</span><button class="td-go-sm" data-gototab="log">→</button></div>`
);
```

---

### 4. AFT total-score trend sparkline [LOW EFFORT]
**File:** `src/tabs/aft.js` — in `renderAft()`, after `showAftResult()` and before the history cards

The AFT tab shows individual test history as cards but has no trend chart. Uses the existing `miniSparkline()` from `state.js`.

```javascript
const last7=(S.aft||[]).slice(-7);
if(last7.length>=2){
  const svg=miniSparkline(last7.map(t=>t.total),200,44);
  histEl.insertAdjacentHTML("beforebegin",
    `<div class="aft-trend-wrap">${svg}<div class="aft-trend-range">${Math.min(...last7.map(t=>t.total))} – ${Math.max(...last7.map(t=>t.total))} pts</div></div>`
  );
}
```

CSS:
```css
.aft-trend-wrap{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:11px 13px;margin-bottom:10px;display:flex;align-items:center;gap:12px}
.aft-trend-range{font-size:12px;color:var(--ink-faint);white-space:nowrap}
```

---

### 5. Oath path/category breakdown on Oaths tab [LOW EFFORT]
**File:** `src/core/state.js` — in `renderQuests()`, above the oath list

A cadet swearing 8 tactical oaths and no physical oaths is out of balance, but that's invisible in the Oaths tab.

```javascript
const active=S.quests.filter(q=>!q.done);
const byPath={};
active.forEach(q=>{ byPath[q.path||"tactical"]=(byPath[q.path||"tactical"]||0)+1; });
const pathRow=Object.entries(byPath).sort((a,b)=>b[1]-a[1]).map(([p,n])=>{
  const pm=PATH_META[p]||{icon:"•",name:p,color:"var(--ink-faint)"};
  return `<span class="q-path-chip" style="color:${pm.color}">${pm.icon} ${n}</span>`;
}).join("");
if(pathRow) el.insertAdjacentHTML("beforebegin",`<div class="q-path-dist">${pathRow}</div>`);
```

CSS:
```css
.q-path-dist{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.q-path-chip{font-size:12px;font-weight:600;background:var(--panel-2);border:1px solid var(--line);padding:3px 9px;border-radius:20px}
```

---

### 6. Oath archive search + filter [LOW EFFORT]
**File:** `src/core/state.js` — in `renderQuests()`, above the `#qArchive` details element

The questArchive holds completed oaths but is a fixed 20-item list. A cadet with 40+ oaths can't find a specific one.

- Add `<input class="q-arch-search" placeholder="Search completed oaths…">` above the archive details.
- On `input` event (delegated from `document.body`), re-render `archEl.innerHTML` filtered by `q.name.toLowerCase().includes(term)`.
- Cap display at 40 items when unfiltered, all matches when searching.

CSS:
```css
.q-arch-search{width:100%;background:var(--panel-2);border:1px solid var(--line);color:var(--ink);padding:8px 10px;border-radius:8px;font-family:inherit;font-size:13px;margin-bottom:8px}
```

---

### 7. FM training plan weekly goal from AFT gap [LOW EFFORT]
**File:** `src/tabs/plan.js` — at the top of `renderPlan()`

The FM plan generates sessions but doesn't prescribe weekly volume relative to AFT goal.

```javascript
const lastAft=(S.aft||[])[S.aft.length-1];
const testDate=S.aftTestDate;
if(lastAft&&testDate){
  const weeksLeft=Math.max(1,Math.round((new Date(testDate+"T12:00:00")-Date.now())/(7*864e5)));
  const gap=380-lastAft.total;
  const rec=gap>60?"5 sessions/week":gap>30?"4 sessions/week":gap>10?"3 sessions/week":"2–3 sessions/week (maintenance)";
  el.insertAdjacentHTML("afterbegin",
    `<div class="plan-rec">🎯 ${weeksLeft} weeks to AFT · gap: ${gap>0?'+'+gap+' pts needed':'on target'} · Recommendation: <b>${rec}</b></div>`
  );
}
```

CSS:
```css
.plan-rec{background:rgba(184,160,106,.08);border:1px solid rgba(184,160,106,.25);border-radius:9px;padding:10px 13px;font-size:13px;color:var(--ink-dim);margin-bottom:12px;line-height:1.5}
.plan-rec b{color:var(--gold)}
```

---

### 8. Daily order completion time tracking [LOW EFFORT]
**Files:** `src/core/events.js` + `src/tabs/today.js`

Orders are checked off but never timestamped. Storing the completion hour reveals behavioral patterns.

- In `events.js`, when `d.done=true`, also set `d.doneTs=Date.now()`.
- In `disciplineLogHtml()` in `today.js`, compute median done hour:
  ```javascript
  const doneHours=(S.dailies||[]).filter(d=>d.done&&d.doneTs).map(d=>new Date(d.doneTs).getHours());
  const medHr=doneHours.length?doneHours.sort((a,b)=>a-b)[Math.floor(doneHours.length/2)]:null;
  ```
- Append `medHr !== null ? ' · avg done by '+medHr+':00' : ''` to the discipline summary.
- No migration needed — `doneTs` is absent for historical entries and defaults to falsy.

---

### 9. Skill decay grace period [MEDIUM EFFORT]
**File:** `src/core/skills-core.js` — in `skEffectiveLevel()` and add new `skFadeState()` helper

Currently a skill drops a level the instant `fadeDays` elapses. Field exercise for 3 days = instant loss.

- In `skEffectiveLevel()`, introduce a 20% grace buffer after each fade interval:
  ```javascript
  const grace=(sk.fadeDays||30)*0.2;
  const intervals=Math.floor(elapsed/((sk.fadeDays+grace)*864e5));
  ```
- Add `skFadeState(sk)` → `"current" | "at-risk" | "decayed"` based on elapsed vs. fadeDays vs. fadeDays+grace.
- Use `skFadeState` in `skLeafColor()` and the fade-ring renderer to show amber "at-risk" state before actual decay.
- Bump `SKILL_LADDER_VER` in `src/core/migration.js` after this change.

---

### 10. Qualification log with auto-skill advancement [MEDIUM EFFORT]
**Files:** `src/core/constants.js`, `src/core/state.js`, `src/tabs/awards.{html,js}`, `src/styles/main.css`

A cadet who passes the CWST, CLS, or qualifies Expert on BRM has verified their skill at an objective standard — but currently must manually level each affected skill.

**New state:** `S.qualifications = []` in `DEFAULT` in `constants.js`. Migration defaults absent saves to `[]`.

**New constant:** `QUAL_CATALOG` in `constants.js`:
```javascript
const QUAL_CATALOG = {
  cwst:      {fullName:"CWST — Combat Water Survival Test", cat:"physical",   skills:[{name:"Swimming",level:5}]},
  brm_mks:   {fullName:"BRM — Marksman",                   cat:"tactical",   skills:[{name:"Marksmanship (M4)",level:4}]},
  brm_shp:   {fullName:"BRM — Sharpshooter",               cat:"tactical",   skills:[{name:"Marksmanship (M4)",level:5}]},
  brm_exp:   {fullName:"BRM — Expert",                     cat:"tactical",   skills:[{name:"Marksmanship (M4)",level:6}]},
  cls:       {fullName:"CLS — Combat Lifesaver",           cat:"tactical",   skills:[{name:"First aid",level:7}]},
  tccc:      {fullName:"TCCC",                             cat:"tactical",   skills:[{name:"First aid",level:5}]},
  sere:      {fullName:"SERE",                             cat:"tactical",   skills:[{name:"Fieldcraft & survival",level:10}]},
  landnav_d: {fullName:"Day land nav (pass)",              cat:"tactical",   skills:[{name:"Land navigation",level:4}]},
  landnav_n: {fullName:"Night land nav (pass)",            cat:"tactical",   skills:[{name:"Land navigation",level:5}]},
  landnav_r: {fullName:"Land nav — Ranger standard",       cat:"tactical",   skills:[{name:"Land navigation",level:10}]},
};
```

**New section in Awards tab:**
- `<div id="qualsSection"></div>` in `src/tabs/awards.html`
- `renderQuals()` in `src/tabs/awards.js`: renders earned quals as cards + "Log qualification" button
- Log modal: qual dropdown, date field, live preview showing "This will advance: Swimming Lv 3 → 5"
- On save: for each skill in the qual's list, call `skReachLevel(sk, targetLevel)`; never lowers a skill already higher; record `{skillName, fromLevel, toLevel}` in the qual entry
- Toast: `"CWST logged · Swimming advanced to Lv 5"`

CSS: `.qual-card`, `.qual-badge` (category color chip), `.qual-preview` (preview in log modal showing affected skills)

---

### 11. FM beginner prescription — sets, reps, weights, rest [MEDIUM EFFORT]
**Files:** `src/tabs/plan.js`, `src/styles/main.css`

The FM tab tells a cadet *what* to do but never gives concrete numbers. Someone who has never been to a gym has no frame of reference for sets, reps, weight, or how hard to push. Assume zero prior fitness knowledge.

**New constant** `BEGINNER_RX` in `src/tabs/plan.js` — nested object keyed by `s1`–`s4`, each containing per-exercise prescriptions:

```javascript
const BEGINNER_RX = {
  s1: { // Session 1 — Lower + Push
    bw: [ // No-equipment
      {name:"Reverse lunge",         sets:3, reps:"8/leg",  rest:"90s"},
      {name:"Single-leg glute bridge",sets:3, reps:"10/leg", rest:"60s"},
      {name:"Hand-release push-ups", sets:3, reps:"6–8",    rest:"90s", note:"first day: 3–5"},
      {name:"Pike push-ups",         sets:2, reps:"6–8",    rest:"90s"},
      {name:"Hollow-body hold",      sets:3, reps:"20s",    rest:"45s"},
    ],
    gym: [ // Gym mode
      {name:"Trap-bar deadlift",   sets:3, reps:"5",  weight:"65 lbs", rest:"3 min"},
      {name:"Goblet squat",        sets:3, reps:"10", weight:"15 lbs", rest:"90s"},
      {name:"DB bench press",      sets:3, reps:"10", weight:"15 lbs/hand", rest:"90s"},
      {name:"Overhead press",      sets:3, reps:"10", weight:"10 lbs/hand", rest:"90s"},
    ],
  },
  s2: { // Session 2 — Run
    bw: [
      {name:"Intervals",     sets:"4×", reps:"400m hard", rest:"90s walk"},
      {name:"Tempo run",     sets:1,    reps:"15 min at 'only a few words' pace", rest:"—"},
      {name:"Long easy run", sets:1,    reps:"25 min conversational", rest:"—"},
    ],
    gym: [
      {name:"Treadmill intervals", sets:"4×", reps:"400m, 1% incline", rest:"90s"},
      {name:"Rower intervals",     sets:"4×", reps:"250m all-out",     rest:"90s"},
    ],
  },
  s3: { // Session 3 — Upper + Core
    bw: [
      {name:"Doorway/towel rows",  sets:3, reps:"8–10", rest:"90s"},
      {name:"Decline push-ups",    sets:3, reps:"6–8",  rest:"90s"},
      {name:"Plank",               sets:3, reps:"20–30s", rest:"45s"},
      {name:"Side plank",          sets:2, reps:"15–20s/side", rest:"45s"},
      {name:"Superman",            sets:3, reps:"10",   rest:"45s"},
      {name:"Grip squeeze",        sets:3, reps:"30s",  rest:"30s"},
    ],
    gym: [
      {name:"Lat pulldown",    sets:3, reps:"10", weight:"40 lbs", rest:"90s"},
      {name:"Seated cable row",sets:3, reps:"10", weight:"35 lbs", rest:"90s"},
      {name:"Incline DB press",sets:3, reps:"10", weight:"15 lbs/hand", rest:"90s"},
      {name:"Farmer's carry",  sets:3, reps:"40 ft", weight:"25 lbs/hand", rest:"90s"},
    ],
  },
  s4: { // Session 4 — AFT Circuit (3 rounds, 2 min rest between)
    bw: [
      {name:"Shuttle sprints",       sets:"3 rounds", reps:"4 lengths ~25m", rest:"2 min between rounds"},
      {name:"Hand-release push-ups", sets:"3 rounds", reps:"10 (first day: 5)", rest:""},
      {name:"Squat jumps",           sets:"3 rounds", reps:"8", rest:""},
      {name:"Plank",                 sets:"3 rounds", reps:"30s", rest:""},
      {name:"200m run / jog",        sets:"3 rounds", reps:"1 lap", rest:""},
    ],
    gym: [
      {name:"Sled push + return",  sets:"3 rounds", reps:"25m + 25m", weight:"no extra load", rest:"2 min"},
      {name:"Loaded carry",        sets:"3 rounds", reps:"40 ft", weight:"25 lbs/hand", rest:""},
      {name:"Box jumps",           sets:"3 rounds", reps:"6–8", weight:"12\" box", rest:""},
      {name:"Rower 200m sprint",   sets:"3 rounds", reps:"all-out", rest:""},
    ],
  },
};
```

**In `renderPlan()`:** after rendering each `data-sess` exercise list, inject:

```javascript
const gymMode = S.gymMode; // existing flag
const rx = BEGINNER_RX[sessId];
if(rx){
  const rows = (gymMode ? rx.gym : rx.bw).map(e=>
    `<tr><td>${esc(e.name)}</td><td>${esc(e.sets)}</td><td>${esc(e.reps)}</td>${gymMode&&e.weight?`<td>${esc(e.weight)}</td>`:'<td></td>'}<td>${esc(e.rest||'')}</td></tr>`
  ).join('');
  sessEl.insertAdjacentHTML('afterend',
    `<div class="rx-card"><p class="rx-note">New to this? Start here. Add reps when all sets feel easy — not before.</p>
    <table class="rx-table"><thead><tr><th>Exercise</th><th>Sets</th><th>Reps</th>${gymMode?'<th>Start weight</th>':'<th></th>'}<th>Rest</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="rx-effort">Stop each set when you could still do 2 clean reps. That margin is what makes this sustainable for months.</p></div>`
  );
}
```

CSS:
```css
.rx-card{background:rgba(111,158,84,.07);border:1px solid rgba(111,158,84,.25);border-radius:9px;padding:11px 14px;margin-top:10px}
.rx-note{font-size:12px;color:var(--jade);font-weight:600;margin-bottom:8px}
.rx-effort{font-size:11.5px;color:var(--ink-dim);margin-top:8px;font-style:italic}
.rx-table{width:100%;font-size:12px;border-collapse:collapse}
.rx-table th{text-align:left;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);padding:0 6px 5px;border-bottom:1px solid var(--line)}
.rx-table td{padding:5px 6px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--ink-dim)}
.rx-table tr:last-child td{border-bottom:none}
```

---

## Required workflow for every change

1. Edit source files in `src/` only — never touch `index.html` directly
2. Run `python scripts/build.py` after changes
3. Run `npm run check` (syntax) and `npm run regress` (headless 18-tab, 0 pageerror required)
4. Bump `sw.js` cache version: `operations-vN` → `operations-v(N+1)`
5. Bump `SKILL_LADDER_VER` in `src/core/migration.js` **only** if any skill ladder/tier/guidance changed (item 9 requires this)
6. Run `npm run package` to produce the final zip

---

## Key architecture reminders

- `index.html` is **assembled output** — edit `src/`, then build
- All data in `localStorage["operations_v2"]` via `S = load()`; `DEFAULT` is in `src/core/constants.js`
- `skLeafColor(eff, max)` → `rgb(r,g,b)` string (cold gray at 0 → ember gold at max)
- `skEffectiveLevel(sk)` → working level accounting for decay, floors at 1 if started
- `skReachLevel(sk, targetLevel)` — levels a skill up to `targetLevel`, never lowers; use for qual log
- `skDaysLeft(sk)` → days until fade; null if not started or no fadeDays
- `skEmblemSvg(sk, eff, max)` — sigil generator, defined in `skills.js`, used in `trophies.js`
- `miniSparkline(values, w, h)` — small SVG sparkline, defined in `state.js`
- `toast(msg)` — bottom toast, defined in `events.js`
- `PATH_META` — path metadata (name, icon, color, world, lore), in `constants.js`
- `SK_PATH_ICON` — path → emoji map, in `tree.js`
- All CSS in `src/styles/main.css` — no per-tab CSS files
- Regression covers **18 tabs** (see `scripts/regress.js`)
- No network calls, no CDN fonts, no telemetry — ever

## Tone constraints

Wyatt values: honesty, measurability, privacy, preserved progress, Yggdrasil symbolism. Keep copy plain and honest — no hype, no fake metrics. The FM prescription assumes zero prior fitness knowledge. Ask before large architectural changes. Small surgical diffs.
