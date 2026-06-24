# Operations — Planned Improvements (v102+)

Eight features ranked by cadet impact. All are honest, offline-safe, and require no fake metrics.

---

## 1. Oath archive search + filter
**Value:** The questArchive now holds completed oaths (since v97), but is rendered as a fixed 20-item list with no search. A cadet who swore 40+ oaths over a semester can't find a specific one. A text-filter input above the archive list makes the history actually usable.

**Implementation sketch:**
- In `renderQuests()` in `src/core/state.js`, add a `<input class="q-arch-search" placeholder="Search completed oaths…">` above the `qArchive` details element.
- On `input` event (delegated from `document.body`), re-render `archEl.innerHTML` filtered by `q.name.toLowerCase().includes(term)`.
- Cap display at 40 items when unfiltered, all matches when searching.
- CSS: `.q-arch-search{width:100%;background:#0e0f09;border:1px solid var(--line);color:var(--ink);padding:8px 10px;border-radius:8px;font-family:inherit;font-size:13px;margin-bottom:8px}`

---

## 2. Skill "fading soon" digest on Dawn
**Value:** The Skills tab shows fading leaves, but the Dawn tab only mentions the single most urgent fading skill. A cadet with 4 fading skills at once misses 3 of them entirely. A compact "Fading soon: X · Y · Z" row in Field Notes — showing all skills within 20% of their fade window — surfaces the full picture in one glance without requiring a tab switch.

**Implementation sketch:**
- In `renderToday()` in `src/tabs/today.js`, in the `notes` array section:
  ```javascript
  const fadingSoon=(S.lifeSkills||[]).filter(s=>!s.group&&s.currentLevel>0).map(s=>({s,days:skDaysLeft(s)})).filter(x=>x.days!==null&&x.days<=Math.ceil((x.s.fadeDays||30)*0.2)).sort((a,b)=>a.days-b.days);
  if(fadingSoon.length>1) notes.push(`<div class="fn-row"><span class="fn-dot">🍂</span><span>${fadingSoon.length} skills fading: ${fadingSoon.slice(0,4).map(x=>esc(x.s.name)).join(' · ')}</span><button class="td-go-sm" data-gototab="skills">→</button></div>`);
  ```
- No state changes. The focus card still calls out the single most urgent one; this note covers the full list.

---

## 3. AFT score history sparkline on the AFT tab
**Value:** The AFT tab shows individual test history as cards but has no compact trend chart. A cadet who has taken 6 tests can't instantly see whether their score is trending up or flattening. A 7-value sparkline SVG (one point per last 7 tests) above the history cards gives the trend at a glance and is motivating when progress is visible.

**Implementation sketch:**
- In `renderAft()` in `src/tabs/aft.js`, after the current score card and before the history list:
  ```javascript
  const last7=(S.aft||[]).slice(-7);
  if(last7.length>=2){ const svg=miniSparkline(last7.map(t=>t.total),200,44); histEl.insertAdjacentHTML("beforebegin",`<div class="aft-trend-wrap">${svg}<div class="aft-trend-range">${Math.min(...last7.map(t=>t.total))} – ${Math.max(...last7.map(t=>t.total))} pts</div></div>`); }
  ```
- `miniSparkline` is already in `src/core/state.js` — reuse it.
- CSS: `.aft-trend-wrap{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:11px 13px;margin-bottom:10px;display:flex;align-items:center;gap:12px}` `.aft-trend-range{font-size:12px;color:var(--ink-faint);white-space:nowrap}`

---

## 4. Baseline test "due this month" nudge on Dawn
**Value:** Monthly baseline tests (max pushups, plank, 2-mile) drive the adaptive training system. A cadet who forgets to do them for 6 weeks gets stale adaptive targets. A one-line nudge on Dawn — "Baseline test due — last done N days ago" — closes the reminder loop without requiring a tab switch.

**Implementation sketch:**
- In `renderToday()` in `src/tabs/today.js`, in the `notes` section:
  ```javascript
  const lastBL=(S.baselines||[]).sort((a,b)=>b.ts-a.ts)[0];
  const daysSinceBL=lastBL?Math.round((Date.now()-lastBL.ts)/864e5):999;
  if(daysSinceBL>28) notes.push(`<div class="fn-row"><span class="fn-dot">📐</span><span>Baseline test ${lastBL?'last done '+daysSinceBL+'d ago':'not yet done'} — monthly max-effort test due</span><button class="td-go-sm" data-gototab="log">→</button></div>`);
  ```
- No state changes. Links to the Log tab where baselines are recorded.

---

## 5. Daily order completion time tracking
**Value:** Orders are checked off but never timestamped. A cadet can't see whether they always complete orders in the morning vs scrambling at 11pm. Storing the completion timestamp (already saved as `Date.now()` would be trivial to add) and showing the avg completion hour in the Discipline log card gives genuine behavioral data.

**Implementation sketch:**
- In `events.js`, when `d.done=true`, also set `d.doneTs=Date.now()`.
- In `disciplineLogHtml()` in `src/tabs/today.js`, compute the median done hour across today's completed orders:
  ```javascript
  const doneHours=(S.dailies||[]).filter(d=>d.done&&d.doneTs).map(d=>new Date(d.doneTs).getHours());
  const medHr=doneHours.length?doneHours.sort((a,b)=>a-b)[Math.floor(doneHours.length/2)]:null;
  ```
- Show `medHr !== null ? ` · avg done by ${medHr}:00` : ""` appended to the disc-avg span.
- On state reset (`onPerfectDay`), already clears `done` flag; `doneTs` clears with it naturally since dailies reset done=false each day.

---

## 6. Skill decay grace period before level drop
**Value:** Currently, `skEffectiveLevel` drops a level immediately when `fadeDays` elapse. If a cadet goes on field exercise for 3 days, their skill drops instantly on return. A grace-period system — show the skill as "at risk" for a configurable window (e.g., 20% extra) before actually counting the decay — gives honest warning without punishing unavoidable absences.

**Implementation sketch:**
- In `skEffectiveLevel()` in `src/core/skills-core.js`, introduce a grace buffer:
  ```javascript
  const grace=(sk.fadeDays||30)*0.2; // 20% grace after each fade interval
  const intervals=Math.floor(elapsed/((sk.fadeDays+grace)*864e5));
  ```
- Add a new `skFadeState(sk)` helper that returns `"current" | "at-risk" | "decayed"` without actually dropping the level, so the tree and cards can show amber before full decay.
- In `skLeafColor()` and the fade-ring renderer, check `skFadeState` for the "at-risk" amber signal.
- No migration needed; grace is computed, not stored.

---

## 7. FM training plan weekly goal auto-set from AFT gap
**Value:** The FM plan generates sessions but doesn't tell the cadet *how many* sessions per week to target given their AFT goal. A cadet scoring 320 with a 350 goal in 10 weeks needs a different weekly volume than one scoring 290. Computing a weekly session recommendation from the score gap and time to test (already available as `S.aftTestDate` and `S.aft`) and surfacing it on the Plan tab makes the plan prescriptive rather than descriptive.

**Implementation sketch:**
- In `renderPlan()` in `src/tabs/plan.js`, add a recommendation block:
  ```javascript
  const lastAft=(S.aft||[])[S.aft.length-1];
  const testDate=S.aftTestDate;
  if(lastAft&&testDate){
    const weeksLeft=Math.max(1,Math.round((new Date(testDate+"T12:00:00")-Date.now())/(7*864e5)));
    const gap=380-lastAft.total; // target 380 as a solid passing buffer
    const rec=gap>60?"5 sessions/week":gap>30?"4 sessions/week":gap>10?"3 sessions/week":"2–3 sessions/week (maintenance)";
    el.insertAdjacentHTML("afterbegin",`<div class="plan-rec">🎯 ${weeksLeft} weeks to AFT · gap: ${gap>0?'+'+gap+' pts needed':'on target'} · Recommendation: <b>${rec}</b></div>`);
  }
  ```
- CSS: `.plan-rec{background:rgba(184,160,106,.08);border:1px solid #5e4715;border-radius:9px;padding:10px 13px;font-size:13px;color:var(--ink-dim);margin-bottom:12px;line-height:1.5}` `.plan-rec b{color:var(--gold)}`

---

## 8. Oath path/category breakdown on the Oaths tab
**Value:** The Oaths tab shows all oaths sorted by due date but gives no aggregate view of how they're distributed across paths (Tactical, Physical, Academic, etc.). A cadet swearing 8 tactical oaths and no physical oaths is out of balance — but that's invisible until the neglected-path alert fires on Dawn. A compact bar or count row at the top of the Oaths tab makes the imbalance visible in the tool where it can be acted on.

**Implementation sketch:**
- In `renderQuests()` in `src/core/state.js`, above the oath list:
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
- CSS: `.q-path-dist{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--line)}` `.q-path-chip{font-size:12px;font-weight:600;background:#0e0f09;border:1px solid var(--line);padding:3px 9px;border-radius:20px}`

---

## Implementation order recommendation

| Priority | Feature | Effort | Impact |
|---|---|---|---|
| 1 | Skill fading digest on Dawn | Very low | High (daily awareness) |
| 2 | Baseline test nudge on Dawn | Very low | High (training system input) |
| 3 | AFT score history sparkline | Low | High (trend visibility) |
| 4 | Oath path breakdown | Low | Medium (balance awareness) |
| 5 | FM weekly goal from AFT gap | Low | Medium (prescription) |
| 6 | Oath archive search | Low | Medium (history access) |
| 7 | Daily order completion time | Low | Medium (behavioral insight) |
| 8 | Skill decay grace period | Medium | Medium (fairness / realism) |
