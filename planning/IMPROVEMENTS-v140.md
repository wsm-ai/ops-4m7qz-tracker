# IMPROVEMENTS v140 — Personal Path Pyramid (Uncommon Layer)

Authoritative spec for the v140 session. Read in full before writing a single line of code.
One path per session. This session: **personal**.

---

## Context

v139 completed the Academic Path pyramid through the Uncommon layer. Seven paths now have full pyramid builds (physical, tactical, leadership, technical, cognitive, physiological, academic). Three paths have no pyramid structure. The directive:

> Build Mythic + 5 Legendaries + 25 Rares + 125 Uncommons for every remaining path before adding Commons to any path. One path per session.

**This session: personal path only.** At end of session, write `planning/IMPROVEMENTS-v141.md` for the hearth path.

---

## Pyramid structure reminder

| Tier | Count | Ladder depth | setKey pattern | synthesizedFrom |
|---|---|---|---|---|
| Mythic | 1 | 14L | `pers_mythic` | `pers_leg` |
| Legendary | 5 | 11L | `pers_leg` | `pers_r_{cluster}` |
| Rare | 25 | 8L (or existing depth) | `pers_r_{cluster}` | `pers_u_{set}` |
| Uncommon | 125 | 5L (or existing depth) | `pers_u_{set}` | `pers_c_{set}` (placeholder) |

**Integration rule:** Max 2 existing skills per set of 5. Never all 5 from existing seeds. When an existing skill gains a setKey its live progress is wiped by migration (pyramidResetApplied prevents re-wipe).

---

## Existing personal skills (audit before writing)

Run `grep -n 'cat:"personal"' src/core/skills-data.js` before assigning pyramid roles.

| Skill name | Confirmed depth | Auto-rarity | Pyramid role |
|---|---|---|---|
| Personal finance | 8L | Rare | `pers_r_finance` slot 1 → `pers_u_personal_finance` |
| First aid | 8L | Rare | `pers_r_wellbeing` slot 1 → `pers_u_first_aid` |
| Time management | 8L | Rare | `pers_r_life_ops` slot 1 → `pers_u_time_mgmt` |
| Discipline / habits | 8L | Rare | `pers_r_self` slot 1 → `pers_u_discipline` |
| Driving / vehicle ops | 10L | Rare | `pers_r_life_ops` slot 2 → `pers_u_vehicle` |
| Investing & wealth building | 8L | Rare | `pers_r_finance` slot 2 → `pers_u_investing` |
| Cooking | 7L | Uncommon | `pers_u_home_ops` slot 1 |
| OPSEC / digital security | 7L | Uncommon | `pers_u_digital_hygiene` slot 1 |
| Stress regulation | 6L | Uncommon | `pers_u_stress` slot 1 |
| Relationships & connection | 6L | Uncommon | `pers_u_relationships` slot 1 |
| Digital discipline | 6L | Uncommon | `pers_u_emo_reg` slot 1 |
| Professional networking | 7L | Uncommon | `pers_u_prof_network` slot 1 |
| Interview skills | 7L | Uncommon | `pers_u_prof_network` slot 2 |
| Tax preparation | 5L | Uncommon | `pers_u_tax` slot 1 |
| Home & life maintenance | 7L | Uncommon | `pers_u_home_ops` slot 2 |
| Health literacy | 6L | Uncommon | `pers_u_health_maint` slot 1 |
| Legal literacy | 6L | Uncommon | `pers_u_admin` slot 1 |
| Mindfulness & meditation | 7L | Uncommon | `pers_u_stress` slot 2 |
| Sleep optimization | 7L | Uncommon | `pers_u_sleep_rec` slot 1 |
| Mental health literacy | 6L | Uncommon | `pers_u_emo_reg` slot 2 |
| Personal finance (duplicate 7L) | 7L | Uncommon | **DO NOT WIRE** — orphan from v88 era, leave without setKey |

**Note on duplicate:** There are two `{name:"Personal finance", cat:"personal"}` entries. The 8L one (`parent:"Life admin"`) is the current Rare slot. The 7L one (no parent, line ~4022) is a legacy orphan. Do not wire the 7L one — it will be cleaned up in a future session.

Total existing skills to wire: **6 Rares + 14 Uncommons = 20 skills**.

---

## Phase 1 — New seeds

Write all new pyramid seeds first (append to `src/core/skills-data.js`). Do NOT modify existing skills yet — that happens in Phase 2.

### Mythic (1 new seed)

```
name: "Sovereign Self"
cat: "personal"
rarity: "mythic"
setKey: "pers_mythic"
synthesizedFrom: "pers_leg"
fadeDays: 90
```

14-level ladder: from basic adult competence to integrated, self-directed mastery — life systems running, inner discipline solid, finances sovereign, relationships deep, health resilient.
- L1–L3: functional adult (managing money, time, home, and health at baseline)
- L4–L6: intentional operator (habits designed, goals structured, relationships cultivated)
- L7–L9: optimized self (systems automated, finances compounding, social capital deep)
- L10–L12: resilient mastery (sustaining through adversity, mentoring others, integration across all domains)
- L13–L14: sovereign self (life designed around values, autonomous, model for others)

### 5 Legendaries (all `setKey:"pers_leg"`, 11L, `cat:"personal"`)

1. **"Life Operations"** — `synthesizedFrom:"pers_r_life_ops"` — arc from getting the basics done to having frictionless life systems that run without thought
2. **"Inner Discipline"** — `synthesizedFrom:"pers_r_self"` — arc from reactive living to deliberate identity, habits, goals, and emotional intelligence
3. **"Financial Sovereignty"** — `synthesizedFrom:"pers_r_finance"` — arc from budget awareness to compounding wealth, tax optimization, and long-term security
4. **"Social Fluency"** — `synthesizedFrom:"pers_r_social"` — arc from basic social competence to professional presence, deep relationships, and community leadership
5. **"Physical Resilience"** — `synthesizedFrom:"pers_r_wellbeing"` — arc from first aid literacy to sleep, stress, and health mastery that sustains performance over a career

### 25 Rares

5 clusters × 5 slots each. New seeds are 8L. Existing-skill slots noted — do NOT write seeds for those; wire in Phase 2.

**pers_r_life_ops → Life Operations:**
- slot 1: Time management — EXISTING (8L, wire in Phase 2), `synthesizedFrom:"pers_u_time_mgmt"`
- slot 2: Driving / vehicle ops — EXISTING (10L, wire in Phase 2), `synthesizedFrom:"pers_u_vehicle"`
- slot 3 [NEW]: Home Operations — 8L, `synthesizedFrom:"pers_u_home_ops"`
- slot 4 [NEW]: Administrative Competence — 8L, `synthesizedFrom:"pers_u_admin"`
- slot 5 [NEW]: Logistics & Transition — 8L, `synthesizedFrom:"pers_u_logistics"`

**pers_r_self → Inner Discipline:**
- slot 1: Discipline / habits — EXISTING (8L, wire in Phase 2), `synthesizedFrom:"pers_u_discipline"`
- slot 2 [NEW]: Emotional Regulation — 8L, `synthesizedFrom:"pers_u_emo_reg"`
- slot 3 [NEW]: Identity & Values Clarity — 8L, `synthesizedFrom:"pers_u_identity"`
- slot 4 [NEW]: Goal Architecture — 8L, `synthesizedFrom:"pers_u_goals"`
- slot 5 [NEW]: Resilience & Adaptability — 8L, `synthesizedFrom:"pers_u_resilience"`

**pers_r_finance → Financial Sovereignty:**
- slot 1: Personal finance — EXISTING (8L, wire in Phase 2), `synthesizedFrom:"pers_u_personal_finance"`
- slot 2: Investing & wealth building — EXISTING (8L, wire in Phase 2), `synthesizedFrom:"pers_u_investing"`
- slot 3 [NEW]: Tax Strategy — 8L, `synthesizedFrom:"pers_u_tax"`
- slot 4 [NEW]: Debt Management — 8L, `synthesizedFrom:"pers_u_debt"`
- slot 5 [NEW]: Long-Term Financial Planning — 8L, `synthesizedFrom:"pers_u_fin_planning"`

**pers_r_social → Social Fluency:**
- slot 1 [NEW]: Professional Presence — 8L, `synthesizedFrom:"pers_u_prof_network"`
- slot 2 [NEW]: Relationship Depth — 8L, `synthesizedFrom:"pers_u_relationships"`
- slot 3 [NEW]: Communication Mastery — 8L, `synthesizedFrom:"pers_u_communication"`
- slot 4 [NEW]: Social Presence — 8L, `synthesizedFrom:"pers_u_presence"`
- slot 5 [NEW]: Community & Mentorship — 8L, `synthesizedFrom:"pers_u_community"`

**pers_r_wellbeing → Physical Resilience:**
- slot 1: First aid — EXISTING (8L, wire in Phase 2), `synthesizedFrom:"pers_u_first_aid"`
- slot 2 [NEW]: Stress Mastery — 8L, `synthesizedFrom:"pers_u_stress"`
- slot 3 [NEW]: Sleep & Recovery Mastery — 8L, `synthesizedFrom:"pers_u_sleep_rec"`
- slot 4 [NEW]: Health Maintenance — 8L, `synthesizedFrom:"pers_u_health_maint"`
- slot 5 [NEW]: Digital & Information Hygiene — 8L, `synthesizedFrom:"pers_u_digital_hygiene"`

### 125 Uncommons

25 sets × 5 each. Existing-skill slots noted — do NOT write new seeds for those.

| setKey | Existing slots | New Uncommons (5L each) |
|---|---|---|
| pers_u_time_mgmt | — | Focus block scheduling [slot 1], Priority matrix [slot 2], Task batching [slot 3], Friction reduction [slot 4], Deadline management [slot 5] |
| pers_u_vehicle | — | Defensive driving technique [slot 1], Vehicle maintenance basics [slot 2], Navigation & route planning [slot 3], Emergency vehicle procedures [slot 4], Convoy & tactical vehicle ops [slot 5] |
| pers_u_home_ops | Cooking (slot 1), Home & life maintenance (slot 2) | Meal planning [slot 3], Home repair basics [slot 4], Household supply management [slot 5] |
| pers_u_admin | Legal literacy (slot 1) | Documentation management [slot 2], Record-keeping system [slot 3], Government services navigation [slot 4], Essential paperwork mastery [slot 5] |
| pers_u_logistics | — | Packing & travel prep [slot 1], Errand batching [slot 2], Supply chain thinking [slot 3], Move planning [slot 4], Life transition management [slot 5] |
| pers_u_discipline | — | Morning routine design [slot 1], Habit stacking [slot 2], Temptation bundling [slot 3], Environment design [slot 4], Habit tracking & review [slot 5] |
| pers_u_emo_reg | Digital discipline (slot 1), Mental health literacy (slot 2) | Emotional labeling [slot 3], Cognitive reframing [slot 4], Self-compassion practice [slot 5] |
| pers_u_identity | — | Values clarification [slot 1], Purpose statement [slot 2], Identity anchoring [slot 3], Role definition [slot 4], Core principles articulation [slot 5] |
| pers_u_goals | — | Goal architecture (SMART+) [slot 1], OKR setting [slot 2], Milestone planning [slot 3], Progress review cadence [slot 4], Course correction method [slot 5] |
| pers_u_resilience | — | Post-failure recovery [slot 1], Adversity reframing [slot 2], Anti-fragility practice [slot 3], Identity stability under pressure [slot 4], Stress inoculation [slot 5] |
| pers_u_personal_finance | — | Budgeting method [slot 1], Net worth tracking [slot 2], Emergency fund discipline [slot 3], Expense audit [slot 4], Cash flow management [slot 5] |
| pers_u_investing | — | Index fund principles [slot 1], Asset allocation [slot 2], Brokerage account setup [slot 3], Dollar-cost averaging [slot 4], Long-term vs short-term framing [slot 5] |
| pers_u_tax | Tax preparation (slot 1) | Deduction identification [slot 2], Military tax benefits [slot 3], Tax-advantaged accounts [slot 4], Filing process optimization [slot 5] |
| pers_u_debt | — | Debt snowball vs avalanche [slot 1], Interest rate management [slot 2], Loan payoff math [slot 3], Credit score management [slot 4], Debt-free planning [slot 5] |
| pers_u_fin_planning | — | Retirement accounts (TSP, Roth IRA) [slot 1], Insurance basics [slot 2], Estate planning basics [slot 3], Financial goal milestones [slot 4], Military pension math [slot 5] |
| pers_u_prof_network | Professional networking (slot 1), Interview skills (slot 2) | LinkedIn & career presence [slot 3], Reference cultivation [slot 4], Mentorship navigation [slot 5] |
| pers_u_relationships | Relationships & connection (slot 1) | Family communication [slot 2], Friendship maintenance [slot 3], Romantic partnership skills [slot 4], Conflict resolution [slot 5] |
| pers_u_communication | — | Active listening [slot 1], Assertive communication [slot 2], Feedback delivery [slot 3], Nonverbal communication [slot 4], Written social communication [slot 5] |
| pers_u_presence | — | First impression management [slot 1], Body language awareness [slot 2], Speaking confidence [slot 3], Professional bearing [slot 4], Social reading [slot 5] |
| pers_u_community | — | Volunteer leadership [slot 1], Community contribution [slot 2], Peer mentorship [slot 3], Brotherhood/sisterhood maintenance [slot 4], Alumni network cultivation [slot 5] |
| pers_u_first_aid | — | CPR & AED [slot 1], Wound care & bleeding control [slot 2], Shock recognition & management [slot 3], Sick call decision-making [slot 4], Medical evacuation planning [slot 5] |
| pers_u_stress | Stress regulation (slot 1), Mindfulness & meditation (slot 2) | Breathing protocols [slot 3], Recovery blocks [slot 4], Deployment stress management [slot 5] |
| pers_u_sleep_rec | Sleep optimization (slot 1) | Sleep hygiene audit [slot 2], Nap strategy [slot 3], Circadian rhythm management [slot 4], Sleep tracking & feedback [slot 5] |
| pers_u_health_maint | Health literacy (slot 1) | Preventive care schedule [slot 2], Sick care navigation [slot 3], Dental health basics [slot 4], Vision & sensory health [slot 5] |
| pers_u_digital_hygiene | OPSEC / digital security (slot 1) | Screen time management [slot 2], Social media discipline [slot 3], Information diet curation [slot 4], Cyber hygiene maintenance [slot 5] |

---

## Phase 2 — Wire existing skills into pyramid

After all new seeds are written and verified to build, edit each existing personal skill in `src/core/skills-data.js` to add `setKey` and `synthesizedFrom`. Only add these two fields (no `rarity` override needed — all are auto-correct).

**Existing Rares to wire:**
- Personal finance → `setKey:"pers_r_finance"`, `synthesizedFrom:"pers_u_personal_finance"`
- First aid → `setKey:"pers_r_wellbeing"`, `synthesizedFrom:"pers_u_first_aid"`
- Time management → `setKey:"pers_r_life_ops"`, `synthesizedFrom:"pers_u_time_mgmt"`
- Discipline / habits → `setKey:"pers_r_self"`, `synthesizedFrom:"pers_u_discipline"`
- Driving / vehicle ops → `setKey:"pers_r_life_ops"`, `synthesizedFrom:"pers_u_vehicle"`
- Investing & wealth building → `setKey:"pers_r_finance"`, `synthesizedFrom:"pers_u_investing"`

**Existing Uncommons to wire:**
- Cooking → `setKey:"pers_u_home_ops"`, `synthesizedFrom:"pers_c_cooking"` (slot 1)
- Home & life maintenance → `setKey:"pers_u_home_ops"`, `synthesizedFrom:"pers_c_home_maintenance"` (slot 2)
- Legal literacy → `setKey:"pers_u_admin"`, `synthesizedFrom:"pers_c_legal_literacy"` (slot 1)
- Digital discipline → `setKey:"pers_u_emo_reg"`, `synthesizedFrom:"pers_c_digital_discipline"` (slot 1)
- Mental health literacy → `setKey:"pers_u_emo_reg"`, `synthesizedFrom:"pers_c_mental_health_lit"` (slot 2)
- Tax preparation → `setKey:"pers_u_tax"`, `synthesizedFrom:"pers_c_tax_prep"` (slot 1)
- Professional networking → `setKey:"pers_u_prof_network"`, `synthesizedFrom:"pers_c_pro_networking"` (slot 1)
- Interview skills → `setKey:"pers_u_prof_network"`, `synthesizedFrom:"pers_c_interview_skills"` (slot 2)
- Relationships & connection → `setKey:"pers_u_relationships"`, `synthesizedFrom:"pers_c_relationships"` (slot 1)
- Stress regulation → `setKey:"pers_u_stress"`, `synthesizedFrom:"pers_c_stress_reg"` (slot 1)
- Mindfulness & meditation → `setKey:"pers_u_stress"`, `synthesizedFrom:"pers_c_mindfulness"` (slot 2)
- Sleep optimization → `setKey:"pers_u_sleep_rec"`, `synthesizedFrom:"pers_c_sleep_opt"` (slot 1)
- Health literacy → `setKey:"pers_u_health_maint"`, `synthesizedFrom:"pers_c_health_literacy"` (slot 1)
- OPSEC / digital security → `setKey:"pers_u_digital_hygiene"`, `synthesizedFrom:"pers_c_opsec"` (slot 1)

**Do NOT wire:** the duplicate 7L `Personal finance` at line ~4022 (no parent field). Leave it without setKey.

---

## Version bumps

- `SKILL_LADDER_VER`: **108 → 109**
- SW: `operations-v139` → `operations-v140`

---

## Seed count targets

- New Mythic: 1
- New Legendaries: 5
- New Rares: 19 (6 slots filled by existing Rares)
- New Uncommons: ~111 (14 slots filled by existing Uncommons)
- **Total new seeds: ~136**

Current skill total after v139: ~1201. After v140: ~1337.

---

## Session close checklist

- [ ] Audit all existing `cat:"personal"` skills for depth before writing any seeds
- [ ] All new personal seeds written (~136 new)
- [ ] All 20 existing personal skills wired (setKey + synthesizedFrom added), duplicate 7L Personal finance skipped
- [ ] `python scripts/build.py` → OK
- [ ] `npm run check` → SYNTAX OK
- [ ] `npm run regress` → PAGEERRORS 0
- [ ] SKILL_LADDER_VER bumped to 109
- [ ] SW bumped to operations-v140
- [ ] `npm run package` → zip created
- [ ] `planning/IMPROVEMENTS-v140.md` deleted
- [ ] `planning/IMPROVEMENTS-v141.md` created (hearth path spec)
- [ ] `planning/NEXT-SESSION-PROMPT.md` updated (v139/v140 → v140/v141)
- [ ] Tell Wyatt to hard-refresh

---

## Template for IMPROVEMENTS-v141.md (write at session close)

v141 = hearth path. Audit `cat:"hearth"` in skills-data.js before writing. Pyramid structure:

- Mythic: "Keeper of the Flame" or similar (14L) — `setKey:"hearth_mythic"`, `synthesizedFrom:"hearth_leg"`
- 5 Legendaries — setKey `hearth_leg`, feeds from `hearth_r_{cluster}`
- 25 Rares — 5 clusters × 5 slots
- 125 Uncommons — 25 sets × 5 slots

After v141, continue:
- v142: roots path
- v143+: Common layers for all paths
