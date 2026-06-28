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

## 9. Qualification log with auto-skill advancement

**Value:** A cadet who passes the CWST, earns a CLS certification, or qualifies Expert on BRM has verified their skill at an objective standard — but currently has to manually level each affected skill. There's also no permanent record in the app that a skill level came from a formal military qualification vs. self-assessment. A qualification log gives each earned credential a home, and automatically advances the skills that credential certifies, so the app reflects verified competency rather than estimates.

**Design:**
- A new **Qualifications** section in the Awards tab (alongside existing awards/memberships)
- A `QUAL_CATALOG` constant mapping qual name → `{fullName, category, description, skills: [{name, level, note}]}`
  - `name` matches the exact `name` field in SEED_SKILLS
  - `level` is the minimum level that qualification certifies — `skReachLevel()` is called, so it never lowers a skill that's already higher
- `S.qualifications = []` in DEFAULT state; migration defaults absent saves to `[]`
- Log Qualification button → modal with: qual dropdown, date field, and a live preview showing "This will advance: Swimming Lv 3 → 5, ..."
- On save: for each skill in the qual's list, call `skReachLevel(sk, targetLevel)`; record `{skillName, fromLevel, toLevel}` in the qual entry
- Display earned quals as cards: qual name, date, category badge, "Skills advanced: X" summary
- Toast: "CWST logged · Swimming advanced to Lv 5"

**Starting qualification catalog (military):**

| Qualification | Skills advanced | Level granted |
|---|---|---|
| CWST (Combat Water Survival Test) | Swimming | 5 (the ladder explicitly marks L5 as "Complete the CWST") |
| BRM — Marksman | Marksmanship (M4) | 4 |
| BRM — Sharpshooter | Marksmanship (M4) | 5 |
| BRM — Expert | Marksmanship (M4) | 6 |
| CLS (Combat Lifesaver) | First aid | 7 (ladder L7: "Hold a current Combat Lifesaver certification") |
| TCCC | First aid | 5 (ladder L5: "Perform CPR to current standard") |
| SERE | Fieldcraft & survival | 10 (ladder L10: "Complete a multi-day field-survival course (e.g. SERE-level)") |
| Day land nav course (pass) | Land navigation | 4 (ladder L4: "Complete a 3-point day land-nav course unassisted") |
| Night land nav course (pass) | Land navigation | 5 (ladder L5: "Complete a night land-nav course unassisted") |
| Land nav — Ranger standard | Land navigation | 10 (ladder L10: "Pass a Ranger/SF-school-standard land-nav assessment") |

**BRM sub-qualifications:** These are three separate entries in the catalog (Marksman / Sharpshooter / Expert) so the cadet logs the actual score tier they earned. The dropdown shows all three; only one should be logged per qualification event.

**Future expansion:** The catalog is a plain JS object in `src/core/constants.js`. New categories (certifications, civilian quals, licenses) just add keys. A future version can split the dropdown by category when there are too many to list.

**Implementation files:**
- `src/core/constants.js` — add `QUAL_CATALOG`
- `src/core/state.js` — `DEFAULT` gets `qualifications:[]`; migration handles absent field
- `src/tabs/awards.js` — new `renderQuals()` section + log modal
- `src/tabs/awards.html` — add `<div id="qualsSection"></div>` in the awards tab
- `src/styles/main.css` — `.qual-card`, `.qual-badge`, `.qual-preview` styles

---

---

## 10. FM beginner prescription — auto-assign sets, reps, weights, and rest

**Value:** The FM tab tells a cadet *what* to do (e.g. "Reverse lunge — 3–4 sets") but never tells them *how many reps, how much weight, how long to rest, or how hard to push.* Someone who has never been to a gym, has no concept of effort limits, and has never lifted a weight has no frame of reference for those decisions. Without concrete numbers, they either under-train (wasting the session) or over-train (getting hurt and quitting). A per-session prescription card — showing exact sets × reps, specific starting weights for gym mode, rest periods, and a one-sentence effort guide — turns the FM tab from a menu into a training manual anyone can open on day one.

**Design principle:** Assume the user has *never* done any of this before. Every number is a "start here" floor, not a recommendation based on any prior fitness. The first-day minimums are lower than most people need — that is intentional. Adding reps is easy; recovering from an injury in week one is not.

**What gets prescribed per exercise:**
- `sets × reps` (or `sets × hold-time` for isometrics/planks)
- **No-equipment:** a plain-English effort cue ("stop when you could still do 2 clean reps — the set should feel like work but never a grind")
- **Gym mode:** a specific starting weight, stated as the lightest sensible load for the movement (not a percentage — a cadet with no 1RM history can't use percentages)
- **Rest:** explicit rest period between sets (strength = 2–3 min, accessories = 60–90s, conditioning = 90s)
- **When to progress:** one weekly rule: "when all sets felt like you had at least 3 reps left, add 1 rep next session (bodyweight) or 5 lbs (gym)"
- **First-day option:** a "just starting" tier — 2 sets at the low end — for someone truly coming off the couch

**Per-session prescriptions (no-equipment / gym):**

**Session 1 — Lower + Push**
| Exercise | Sets | Reps | Rest |
|---|---|---|---|
| Reverse lunge | 3 | 8/leg | 90s |
| Single-leg glute bridge | 3 | 10/leg | 60s |
| Hand-release push-ups | 3 | 6–8 (first-day: 3–5) | 90s |
| Pike push-ups | 2 | 6–8 | 90s |
| Hollow-body hold | 3 | 20s | 45s |
| Shrimp squat (assisted) | 2 | 5/leg | 90s |

Gym additions (replace bodyweight equivalents):
| Exercise | Start Weight | Sets | Reps | Rest |
|---|---|---|---|---|
| Trap-bar / barbell deadlift | 65 lbs (bar + 10 lb plates) | 3 | 5 | 3 min |
| Goblet squat | 15 lbs | 3 | 10 | 90s |
| DB bench press | 15 lbs / hand | 3 | 10 | 90s |
| Overhead press | 10 lbs / hand | 3 | 10 | 90s |
| Leg press | 70 lbs | 3 | 12 | 90s |

**Session 2 — Run**
| Workout | Protocol | First-day option |
|---|---|---|
| Intervals | 4 × 400m at "can't talk" pace, 90s walk between | 3 × 200m, 2 min walk |
| Tempo run | 15 min at "only a few words" pace | 10 min |
| Long easy run | 25 min conversational | 15 min walk/jog |
| Timed 2-mile | Run 2 miles as fast as you can sustain; record time | Same — it's a test |

Gym (treadmill / rower):
- Treadmill: same duration/protocol; add 1% incline minimum
- Rower intervals: 4 × 250m at full effort, 90s rest

**Session 3 — Upper + Core**
| Exercise | Sets | Reps | Rest |
|---|---|---|---|
| Doorway / towel rows | 3 | 8–10 | 90s |
| Decline push-ups | 3 | 6–8 | 90s |
| Plank | 3 | 20–30s | 45s |
| Side plank | 2/side | 15–20s | 45s |
| Superman / back extension | 3 | 10 | 45s |
| Towel pull-aparts | 2 | 15 | 45s |
| Grip squeeze | 3 | 30s | 30s |

Gym:
| Exercise | Start Weight | Sets | Reps | Rest |
|---|---|---|---|---|
| Lat pulldown | 40 lbs | 3 | 10 | 90s |
| Seated cable row | 35 lbs | 3 | 10 | 90s |
| Incline DB press | 15 lbs/hand | 3 | 10 | 90s |
| Cable face pulls | 20 lbs | 3 | 15 | 60s |
| Hanging knee raises | bodyweight | 3 | 8 | 60s |
| Farmer's carry | 25 lbs/hand | 3 | 40 ft | 90s |

**Session 4 — AFT Circuit**
Do 3 rounds. Rest 2 min between rounds. *Do not rush — control beats speed on week one.*
| Exercise | Reps / Duration | Notes |
|---|---|---|
| Shuttle sprints | 4 lengths (~25m each) | Walk the first set if needed |
| Bear crawl | 20 ft forward, 20 ft back | Knees 2 inches off the floor |
| Hand-release push-ups | 10 (first-day: 5) | Full stop at the bottom |
| Squat jumps | 8 | Land soft — bend the knees on landing |
| Plank | 30s | Stop before form breaks |
| 200m run / jog | 1 lap (~50s–90s) | Easy to moderate pace |

Gym circuit (same structure, swap):
- Sled push 25m → 25m return: start with no extra weight beyond the sled
- Loaded carry: 25 lbs/hand × 40 ft
- Box jump: 12" box, 6–8 reps
- Rower 200m: all-out

**Session 5 — Mobility + Balance**
Already prescriptive (hold times and progression levels are in the existing tab). No changes needed.

**Effort guide (plain English, applies to all sessions):**
> "When you're doing a strength set, it should feel like hard work by the last 2 reps — but you should be able to do 2 or 3 more if you absolutely had to. That's the line. If you couldn't do another rep, you went too heavy or too long. If you could've done 6 more, add reps next session. Pain, shaking joints, or sharp sensations mean stop immediately — soreness the next day is normal, sharp pain during is not."

**Signs you went too hard:**
- Can't sleep (nervous system overloaded)
- Still sore 3+ days later in the same area
- Form fell apart during the set
- Heart rate didn't come down within 5 min after the session

**Signs you went too easy (progress next session):**
- All sets felt like a warm-up
- Finished the last rep with energy to spare on every set
- Heart rate was barely elevated during conditioning

**Implementation sketch:**
- Add a `BEGINNER_RX` constant to `src/tabs/plan.js`: a nested object keyed by `s1–s5`, each entry containing an array of `{name, sets, reps, rest, gym?: {weight, reps, rest}}` objects matching the exercises already listed in the EX_HOWTO/session structures.
- In `renderPlan()`, after rendering each session's `data-sess` exercise list, inject a `<div class="rx-card">` containing a compact table from `BEGINNER_RX[sessId]`.
- CSS: `.rx-card{background:rgba(111,158,84,.07);border:1px solid rgba(111,158,84,.25);border-radius:9px;padding:11px 14px;margin-top:10px}` `.rx-table{width:100%;font-size:12px;border-collapse:collapse}` `.rx-table td,th{padding:4px 8px;border-bottom:1px solid rgba(255,255,255,.04)}` — styled as a green field-manual card.
- The gym toggle already controls which exercise list is shown; `rxCard` checks `S.gymMode` and renders the matching prescription.
- No new state fields. `BEGINNER_RX` is static data — it's the field manual, not user progress.
- A "first-day tier" note at the top of the rx-card: `<p class="rx-note">New to this? Do the lower number first. Add reps when the sets feel genuinely easy — not before.</p>`

---

## Implementation order recommendation

| Priority | Feature | Effort | Impact |
|---|---|---|---|
| 1 | Skill fading digest on Dawn | Very low | High (daily awareness) |
| 2 | Baseline test nudge on Dawn | Very low | High (training system input) |
| 3 | AFT score history sparkline | Low | High (trend visibility) |
| 4 | Qualification log + auto-leveling | Medium | High (verified competency record) |
| 5 | FM beginner prescription | Medium | High (critical — makes FM tab actionable for a true beginner) |
| 6 | Oath path breakdown | Low | Medium (balance awareness) |
| 7 | FM weekly goal from AFT gap | Low | Medium (prescription) |
| 8 | Oath archive search | Low | Medium (history access) |
| 9 | Daily order completion time | Low | Medium (behavioral insight) |
| 10 | Skill decay grace period | Medium | Medium (fairness / realism) |
