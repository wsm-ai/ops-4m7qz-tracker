# Operations — Planned Improvements (v119+)

Features ranked by cadet impact. All are honest, offline-safe, and require no fake metrics.

---

## 1. Career-stage skill targets — auto goal lines per MS year

**Value:** The gold target-level tick already exists on every skill card, but it requires manual input and is blank by default. Every skill in the tree should have built-in recommended target levels at each career stage (MS1 → MS2 → MS3 → LDAC → MS4 → Commission → O1), so the tick auto-populates when the user's rank changes. This gives instant orientation on where each skill *should* be right now — and shows what's ahead.

**Data model — add `targets` to SEED_SKILLS:**
```js
// In skills-data.js, each skill entry gets a targets object:
{name:"Land navigation", ...,
 targets:{MS1:2, MS2:4, MS3:6, LDAC:8, MS4:8, commission:9, O1:10}}
```

The stages are: `MS1`, `MS2`, `MS3`, `LDAC` (the summer between MS3/MS4), `MS4`, `commission`, `O1`.

**Detect current stage from `S.rank`:**
```js
// In constants.js or state.js — parse rank to stage
function careerStage(){
  const r=(S.rank||"").toUpperCase();
  if(r.includes("MS1")) return "MS1";
  if(r.includes("MS2")) return "MS2";
  if(r.includes("MS3")) return "MS3";
  if(r.includes("MS4")) return "MS4";
  if(r.includes("O1")||r.includes("2LT")||r.includes("1LT")) return "O1";
  return "MS2"; // default
}
```

**Auto-populate `sk.targetLevel` when seeded / on merge:**
In `mergeNewSeedSkills()` (migration.js), after merging ladder content, if `sk.targetLevel == null` and the seed has `targets[stage]`, set `sk.targetLevel = seed.targets[stage]`. This runs once per skill — manual overrides are preserved because the check is `== null`.

```js
// In mergeNewSeedSkills(), inside the forEach over lifeSkills:
const stage = careerStage();
if(ex.targetLevel == null && seed.targets && seed.targets[stage] != null){
  ex.targetLevel = seed.targets[stage]; changed=true;
}
```

**Show next-stage target as a secondary dim tick:**
In `leafCard()` (skills.js), where `.sk-tgt-tick` is rendered, also show a faint secondary tick for the *next* stage (e.g., if user is MS2, show a dim tick at the MS3 target). Label it "MS3 goal" in tiny text below.

```js
const STAGE_ORDER=["MS1","MS2","MS3","LDAC","MS4","commission","O1"];
const curIdx=STAGE_ORDER.indexOf(careerStage());
const nextStage=STAGE_ORDER[curIdx+1];
const nextTgt=sk.targets&&nextStage!=null?sk.targets[nextStage]:null;
// render dim secondary tick at nextTgt if it differs from current targetLevel
```

**Which skills need targets and at what levels:**

For Wyatt (MS2, Cyber branch goal), the targets should reflect the realistic ROTC progression arc. Suggested MS2 targets (current stage) for the most impactful skills:

| Skill | MS1 | MS2 | MS3 | LDAC | MS4 | Commission | O1 |
|---|---|---|---|---|---|---|---|
| Land navigation | 2 | 4 | 6 | 8 | 8 | 9 | 10 |
| Marksmanship (M4) | 2 | 4 | 5 | 6 | 6 | 7 | 8 |
| Tactical movement | 2 | 3 | 5 | 6 | 6 | 7 | 9 |
| Troop leading procedures | 1 | 3 | 5 | 7 | 7 | 8 | 9 |
| Radio communications | 1 | 3 | 5 | 6 | 6 | 7 | 8 |
| First aid / TCCC | 1 | 3 | 5 | 7 | 7 | 8 | 9 |
| PT (all events) | 3 | 5 | 7 | 8 | 8 | 8 | 9 |
| Push-ups in 2 min | 3 | 5 | 7 | 8 | 8 | 9 | 10 |
| 2-Mile run | 3 | 5 | 7 | 8 | 8 | 9 | 10 |
| ROTC knowledge (quizzes) | 2 | 4 | 5 | 6 | 6 | 6 | 6 |
| Fieldcraft & survival | 1 | 3 | 5 | 6 | 6 | 7 | 8 |
| Leadership — any | 2 | 3 | 5 | 6 | 7 | 8 | 9 |
| Public speaking | 2 | 3 | 5 | 6 | 7 | 8 | 9 |
| Cybersecurity fundamentals | 2 | 4 | 6 | 6 | 7 | 8 | 9 |
| Networking | 2 | 4 | 6 | 6 | 7 | 8 | 9 |
| Programming (Python/JS/Java) | 2 | 4 | 6 | 6 | 7 | 8 | 9 |
| GPA / Academic | — | — | — | — | — | — | — |

**Files to edit:**
- `src/core/skills-data.js` — add `targets:{...}` to every SEED_SKILL that has meaningful career-stage milestones (focus on tactical, physical, leadership, technical/Cyber skills first)
- `src/core/migration.js` — add `careerStage()` helper + auto-populate logic in `mergeNewSeedSkills()`
- `src/tabs/skills.js` — render dim secondary tick for next-stage target in `leafCard()`
- `src/styles/main.css` — add `.sk-tgt-tick-next` (30% opacity, dashed) CSS

**CSS snippet:**
```css
.sk-tgt-tick-next{position:absolute;top:0;width:2px;height:100%;background:var(--gold);opacity:.3;border-right:1px dashed var(--gold)}
.sk-tgt-next-label{font-size:9px;color:var(--gold);opacity:.5;margin-top:1px}
```

**Note:** Bump `SKILL_LADDER_VER` since this changes seed data. The `targetLevel` auto-populate only fires once per skill (`== null` check), so existing manual targets are preserved.

---

## 2. Habit streak calendar

**Value:** The Dailies tab shows whether today's orders are done, but there's no visual history. A small calendar (similar to the Skill decay heat-map added in v117) showing the last 30–60 days of daily-order completion would give a powerful at-a-glance streak view and show patterns (always drop on Fridays, solid on weekdays).

**Implementation sketch:**
- Add a toggle button next to the Dailies section header: "📅 Streak calendar".
- When toggled, render a grid of cells — one per day for the last 60 days, colored green if `S.dailies` had all-done that day, red if missed, gray if no data. 
- Data source: add a `S.dailyHistory[]` array. Each time `onPerfectDay()` fires in `events.js`, push `{date: localYMD()}`. Trim to 365 entries.
- CSS: reuse `.hm-grid`, `.hm-day` cell pattern from the skill heat-map (v117).
- Files: `src/tabs/dailies.html`, `src/tabs/dailies.js` (or wherever `onPerfectDay` lives — check `events.js`), `src/core/constants.js` (add `dailyHistory:[]` to DEFAULT), `src/styles/main.css`.

```js
// In events.js, onPerfectDay():
if(!S.dailyHistory) S.dailyHistory=[];
const today=localYMD();
if(!S.dailyHistory.find(d=>d===today)){
  S.dailyHistory.push(today);
  if(S.dailyHistory.length>365) S.dailyHistory=S.dailyHistory.slice(-365);
}
```

---

## 3. Skill export / print view

**Value:** The user might want to show a cadre, résumé reviewer, or peer a clean view of their skill levels — similar to a PT card or skills résumé. A "Copy skills summary" button that outputs a clean text block (skill name, level, tier, path) would let the user paste into a document or email.

**Implementation sketch:**
- Add a "📋 Copy skills summary" button in the Skills tab header area (next to List/Tree toggle or below the summary bar).
- Click generates a multi-section plain-text block sorted by path, one skill per line: `[Path of War] Land navigation — Level 8 (Expert)`.
- Write to clipboard via `navigator.clipboard.writeText(...)`.
- Only include started skills (currentLevel > 0). Optionally filter by tier (only Tier 2+).
- Files: `src/tabs/skills.html`, `src/tabs/skills.js`.

```js
function copySkillsSummary(){
  const started=S.lifeSkills.filter(s=>!s.group&&s.currentLevel>0);
  const byPath={};
  started.forEach(s=>{ const p=s.cat||"personal"; (byPath[p]=byPath[p]||[]).push(s); });
  const text=Object.entries(byPath).map(([p,sks])=>{
    const pm=PATH_META[p]||{name:p};
    return `[${pm.name}]\n`+sks.map(s=>`  ${s.name} — Level ${skEffectiveLevel(s)}${s.tiers?` (${skTier(s,skEffectiveLevel(s))?.label||''})`:''}`).join("\n");
  }).join("\n\n");
  navigator.clipboard.writeText(text).then(()=>toast("📋 Skills summary copied"));
}
```

---

## 4. Qualification expiry alerts on Today tab

**Value:** Qualifications (from `S.quals[]`) have an `expires` date field, but nothing surfaces expiring quals on the Dawn tab. Adding a 60-day look-ahead that flags expiring qualifications would prevent the user from showing up at a board with a lapsed CPR cert or expired qual.

**Implementation sketch:**
- In `renderToday()` (today.js), scan `S.quals[]` for entries with `expires` dates within 60 days.
- Render a `.qual-alert` card in the Field Notes section listing each expiring qual with its name, expiry date, and a "Quals →" link to the Wall tab.
- CSS: `.qual-alert`, `.qual-alert-row` — style similar to `.cn-alert` (counseling follow-up from v117).
- Files: `src/tabs/today.js`, `src/styles/main.css`.

```js
// In renderToday(), Field Notes section:
const today=localYMD();
const soonExpiry=(S.quals||[]).filter(q=>q.expires&&q.expires>today&&dayDiff(today,q.expires)<=60);
const pastExpiry=(S.quals||[]).filter(q=>q.expires&&q.expires<=today);
if(soonExpiry.length||pastExpiry.length){
  const rows=[...pastExpiry.map(q=>`<div class="qual-alert-row overdue">⚠️ <b>${esc(q.name)}</b> expired ${esc(q.expires)}</div>`),
              ...soonExpiry.map(q=>`<div class="qual-alert-row">🔔 <b>${esc(q.name)}</b> expires ${esc(q.expires)} (${dayDiff(today,q.expires)}d)</div>`)].join("");
  notes.push(`<div class="td-card fn-card qual-alert">${rows}<button class="td-go-sm" data-gototab="awards">Wall →</button></div>`);
}
```

---

## 5. Boss "sprint" mode — time-boxed daily progress

**Value:** Bosses with target dates and daily pace already show how many HP per day are needed. "Sprint mode" adds a small daily HP commitment: at the start of a day, the user sets "I'll hit X HP today." If they do it, the boss card flashes a small reward (XP). If not, the boss pace indicator turns ember. This closes the gap between the target-date pace display and actually acting on it.

**Implementation sketch:**
- Add `b.todayCommit: {date, hp}` to boss objects.
- In the boss card UI, if no commitment set for today, show "Set today's commitment: __ HP" input + Set button.
- If commitment exists for today: show progress bar against the commitment (actual HP hit today = `b.maxhp - b.hp` vs yesterday's `b.hp`).
- If today's commitment was met: show "✓ Today's sprint complete" in jade. If missed (date < today): show an ember warning.
- Files: `src/core/state.js` (renderBosses), `src/core/events.js` (commitment handler), `src/styles/main.css`.

---

## 6. Weekly training load summary (Today tab)

**Value:** The Dawn tab shows the day's focus and daily orders, but there's no weekly view of training load. A small "This week" card listing how many sessions logged, total PT volume (reps/time), and a comparison vs the target from the FM plan would help spot under-training and overtraining before they compound.

**Implementation sketch:**
- In `renderToday()`, compute: workouts logged this week (`S.workouts[]` filtered to current ISO week), total run distance/time, total lift volume.
- Render a `.week-summary` card in the Field Notes section: "This week: 3 sessions · 6 mi · 245 reps logged" with a "Log →" button.
- For comparison, check `S.sessions` or `todaysPlan()` for the weekly session target.
- Files: `src/tabs/today.js`, `src/styles/main.css`.

---

## 7. GPA goal + projected graduation GPA

**Value:** The GPA semester history (added v116) shows trend, but there's no "goal" or projected final GPA. Adding a goal field and a linear projection ("at this trajectory, graduating GPA: X.XX") would close the same loop that the AFT prep card closes for fitness.

**Implementation sketch:**
- Add `S.profile.gpaGoal` (float) to DEFAULT.
- In `renderProfile()` (profile.js), below the GPA history, add a goal input and projection row.
- Projection: fit a line through `S.gpaHistory[]` by semester index; extrapolate to graduation (8 semesters if still in first 4, or remaining).
- Render `<span>Projected graduation GPA: X.XX</span>` in jade if above goal, ember if below.
- Files: `src/core/constants.js` (DEFAULT), `src/tabs/profile.js`, `src/styles/main.css`.

---

## New skills to consider

### S9. Strength & conditioning (programming)
An officer who can write a basic strength program (not just follow one) has a significant edge in unit PT leadership. Ladder: understand progressive overload → write a 4-week linear program → design a mesocycle → coach technique → program for a group with varying baselines.

`{name:"Strength programming", cat:"physical", parent:"Fitness programming", fadeDays:120}`

### S10. Writing (military / professional)
BLUF-style military writing is taught but rarely practiced deliberately. A ladder from "writes clear BLUFs" to "publishable-quality analysis" would formalize a skill that matters for OERs, MFRs, and ARPOADOR. Could auto-level from the `counseling` log (written entries as evidence).

`{name:"Military writing", cat:"leadership", fadeDays:60}`
