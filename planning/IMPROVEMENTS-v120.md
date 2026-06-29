# Operations — Planned Improvements (v120+)

Features ranked by cadet impact. All are honest, offline-safe, and require no fake metrics.

---

## 1. Skill target stage selector — change your stage, update all ticks

**Value:** The v119 career-stage target system auto-populates `sk.targetLevel` when a skill is first seen. But if Wyatt's rank changes (MS2 → MS3), none of the existing targets update — only future new skills would get the right tier. A one-tap "Update all skill targets to my current stage" action would re-run the auto-populate across every skill that still has an unmet target, bringing all the gold ticks current immediately.

**Implementation sketch:**
- Add a `<button>` in the Skills tab header (next to the heatmap toggle): "↑ Update targets to [stage]".
- On click, iterate `S.lifeSkills`, find all skills whose `seed.targets[careerStage()]` differs from their current `targetLevel` (not null), and update them. Never downgrade a target the user manually set higher. Show a toast: "Updated N skill targets to MS3."
- No migration needed — purely a runtime action in `skills.js` + `events.js`.
- Files: `src/tabs/skills.html` (button), `src/tabs/skills.js` (logic), `src/core/events.js` (handler)

```js
function updateAllSkillTargets(){
  const stage=careerStage();
  let n=0;
  S.lifeSkills.forEach(sk=>{
    const seed=SEED_SKILLS.find(s=>s.name===sk.name);
    if(!seed||!seed.targets||seed.targets[stage]==null) return;
    const newTgt=seed.targets[stage];
    // only update if it's a seed-default target (not higher than seed's next stage)
    if(sk.targetLevel===null||(sk.targetLevel<newTgt)){ sk.targetLevel=newTgt; n++; }
  });
  if(n>0){ save(); renderSkillsTab(); toast(`↑ Updated ${n} skill targets to ${stage}`); }
  else toast("All targets already current");
}
```

---

## 2. Today tab — commission countdown + career milestones

**Value:** The profile already stores `S.profile.commissionDate`. The Today/Dawn tab could display a live countdown: "Commission: 382 days". And alongside it, the next upcoming ROTC milestone (e.g., LDAC application window, MS3 fall semester, etc.) would give temporal grounding to the career-stage targets added in v119.

**Implementation sketch:**
- In `renderToday()`, compute days to `S.profile.commissionDate` if set. Render a compact banner in the Dawn/greeting section: `⭐ Commission: N days` in gold.
- Add a small `MILESTONES` array in `constants.js` (or inline in `today.js`) of named dates the user can update: `[{label:"LDAC App Opens", date:"2026-11-01"}, {label:"Advanced Camp", date:"2027-06-07"}]`. Stored as `S.milestones[]`.
- Render the nearest upcoming milestone below the commission countdown.
- Files: `src/tabs/today.js`, `src/core/constants.js` (DEFAULT.milestones:[]), CSS `.commission-countdown`.

```js
// In renderToday() greeting block:
const cd=S.profile&&S.profile.commissionDate;
const cDays=cd?Math.ceil((new Date(cd)-new Date())/(864e5)):null;
const cLine=cDays>0?`<span class="commission-countdown">⭐ Commission: ${cDays} days</span>`:"";
```

---

## 3. Skill comparison — "Where should I be?" panel

**Value:** The target tick on each skill card shows a single number. A deeper "assessment mode" — accessible from the Skills tab — would let the user answer "am I ahead, on track, or behind for my stage?" across all skills at once, as a sortable table: Skill | Level | Target | Gap.

**Implementation sketch:**
- Add a toggle in the Skills tab header: `📊 Assessment`. When active, render a flat table above the path decks instead of the card view.
- Columns: Path icon, Skill name, Level (effective), Target (for current stage), Gap (target − level, negative = ahead).
- Sort by gap descending (biggest behind-ness first).
- Only show skills with a non-null `targetLevel` and that have been started or have a target for the current stage.
- Files: `src/tabs/skills.html`, `src/tabs/skills.js`. CSS `.sk-assessment-table`, `.sk-assess-row`, `.sk-assess-gap`.

```js
function renderSkillAssessment(){
  const stage=careerStage();
  const rows=S.lifeSkills.filter(sk=>!sk.group&&sk.levels&&sk.targetLevel!=null)
    .map(sk=>({sk, eff:skEffectiveLevel(sk), gap:(sk.targetLevel||0)-skEffectiveLevel(sk)}))
    .sort((a,b)=>b.gap-a.gap);
  // render table...
}
```

---

## 4. Quest / Oath expiry + stale alerts on Today

**Value:** Oaths (quests) don't have a deadline field, so there's no urgency signal. Adding an optional `dueDate` to oaths would let the Today tab flag "3 oaths due this week" and show the soonest-due oath at the top of the quest list.

**Implementation sketch:**
- Add `q.dueDate` (YYYY-MM-DD, optional) to quest objects. Add a date input to the quest add form.
- In `renderToday()`, filter `S.quests` for open quests with `dueDate` within 7 days. Show a `.quest-due-alert` card in Field Notes.
- In `renderQuests()`, sort quests: overdue → due soon → in progress → no date.
- Files: `src/tabs/quests.html`, `src/tabs/quests.js`, `src/tabs/today.js`, `src/core/constants.js` (no DEFAULT change needed — optional field).

---

## 5. AFT trend + "ready by" projection on Dawn

**Value:** The AFT tab has the scoring history and event targets. Today tab has no fitness forward-looking view. A single-line projection "At current pace, AFT-ready in ~6 weeks" on Dawn would close the loop between tracking fitness and planning for the actual test.

**Implementation sketch:**
- In `renderToday()`, check `S.aftHistory` (last 2+ entries). If trend is improving, compute linear slope per event and project when each event crosses the target score.
- Show as a compact AFT projection row in the Dawn section: `⚡ AFT: all events on pace — projecting 520 in ~5 weeks` (or `⚠ 2-mile behind pace`).
- Only render if at least 2 AFT entries exist and at least one event has a target set.
- Files: `src/tabs/today.js`. No new data model needed.

---

## 6. New skills: Strength programming + Military writing

**Value (from v119 new-skills section):** Two skills suggested in v119 that weren't implemented:

**S9 — Strength programming** (`physical`, parent: new group `Fitness programming`, fadeDays:120)
An officer who can write a periodized program — not just follow one — has edge in unit PT leadership.
Ladder: understand progressive overload → write a 4-week linear plan → design a mesocycle → coach technique → program for a group with varying baselines → serve as a unit fitness NCO/OIC.

**S10 — Military writing** (`leadership`, fadeDays:60)
BLUF-style writing is taught but rarely practiced deliberately. Could auto-level from counseling log entries (written entries as evidence of use).
Ladder: write a clear BLUF paragraph → 1-page memo → DA Form 4856 counseling → 5-paragraph OPORD → formal report → published analysis.

**Files to edit:**
- `src/core/skills-data.js` — add both skills with full ladders, tiers, advance/maintain, targets
- `src/core/migration.js` — bump `SKILL_LADDER_VER` (90 → 91)
