# Operations — Improvements for v124

Six features ranked by cadet impact. All additive, surgical diffs only.

---

## Feature 1 — Commissioning readiness dashboard on Profile

**Value:** Wyatt is an MS2 with a Cyber branch goal. Right now there's no single view answering "am I on track to commission?" All the data exists — AFT scores, GPA, skill targets, quals, ROTC record, clearance. This aggregates it into a traffic-light panel so he can see the full picture in one scroll.

**Implementation sketch:**

`src/tabs/profile.html` — add above "Vitals" section:

```html
<div class="sec-h"><h2>Commissioning Readiness</h2><span class="hint">real-time — tap any row to jump to that section</span></div>
<div id="commReadyWrap"></div>
```

`src/tabs/profile.js` — add `renderCommReadiness()` called from top of `renderProfile()`:

```js
function renderCommReadiness(){
  const el=document.getElementById("commReadyWrap"); if(!el) return;
  const items=[];
  // AFT
  const lastAft=(S.aftHistory||[]).slice(-1)[0];
  const aftTotal=lastAft&&lastAft.scores?Object.values(lastAft.scores).reduce((a,b)=>a+(+b||0),0):0;
  const aftOk=aftTotal>=270;
  items.push({label:"AFT total",value:lastAft?aftTotal+"pts":"no record",ok:aftOk,hint:"target ≥270 total"});
  // GPA
  const gpas=S.gpaHistory||[];
  const curGpa=gpas.length?gpas[gpas.length-1].gpa:null;
  const gpaOk=curGpa!=null&&curGpa>=2.0;
  items.push({label:"GPA",value:curGpa!=null?curGpa.toFixed(2):"no record",ok:gpaOk,hint:"min 2.0 to commission"});
  // Skills at target
  const withTgt=(S.lifeSkills||[]).filter(s=>!s.group&&(s.currentLevel||0)>0&&s.targetLevel!=null);
  const atTgt=withTgt.filter(s=>skEffectiveLevel(s)>=(s.targetLevel||0)).length;
  const skillOk=withTgt.length>0&&atTgt>=withTgt.length*0.7;
  items.push({label:"Skills at target",value:withTgt.length?atTgt+"/"+withTgt.length:"no targets set",ok:skillOk,hint:"advance lagging skills"});
  // Quals
  const quals=S.qualifications||[];
  const expired=quals.filter(q=>q.expDate&&new Date(q.expDate).getTime()<Date.now()).length;
  const qualOk=expired===0&&quals.length>0;
  items.push({label:"Qualifications",value:quals.length?quals.length+" held"+(expired?" · "+expired+" expired":""):"none logged",ok:qualOk,hint:"renew expired quals"});
  // ROTC record
  const rr=S.rotcRecord;
  const hasRecord=rr&&((rr.positions&&rr.positions.length)||(rr.competitions&&rr.competitions.length));
  items.push({label:"ROTC record",value:hasRecord?"entries logged":"none logged",ok:!!hasRecord,hint:"add positions & competition results"});
  // Clearance
  const hasClear=S.profile&&S.profile.clearance&&S.profile.clearance.level;
  items.push({label:"Clearance status",value:hasClear?S.profile.clearance.level:"not logged",ok:!!hasClear,hint:"log clearance in Profile"});
  const passing=items.filter(i=>i.ok).length;
  el.innerHTML=`<div class="comm-ready-bar">
    <div class="comm-ready-score">${passing}/${items.length}</div>
    <div class="comm-ready-label">readiness indicators on track</div>
  </div>
  <div class="comm-ready-list">
    ${items.map(i=>`<div class="comm-ready-row ${i.ok?'cr-ok':'cr-behind'}">
      <span class="cr-dot">${i.ok?'●':'○'}</span>
      <span class="cr-label">${esc(i.label)}</span>
      <span class="cr-value">${esc(i.value)}</span>
      ${!i.ok?`<span class="cr-hint">${esc(i.hint)}</span>`:''}
    </div>`).join('')}
  </div>`;
}
```

**CSS to add to `src/styles/main.css`:**
```css
.comm-ready-bar{display:flex;align-items:center;gap:.7rem;padding:.7rem 1rem;background:var(--card-bg);border-radius:.5rem;margin-bottom:.5rem;}
.comm-ready-score{font-size:1.6rem;font-weight:700;color:var(--jade);}
.comm-ready-label{font-size:.8rem;color:var(--text-muted);}
.comm-ready-list{display:flex;flex-direction:column;gap:.3rem;margin-bottom:1rem;}
.comm-ready-row{display:grid;grid-template-columns:1rem 1fr auto;align-items:center;gap:.4rem .5rem;padding:.5rem .8rem;border-radius:.4rem;font-size:.82rem;}
.comm-ready-row.cr-ok{background:color-mix(in srgb,var(--jade) 8%,transparent);}
.comm-ready-row.cr-behind{background:color-mix(in srgb,var(--ember) 10%,transparent);}
.cr-dot{font-size:.55rem;}
.cr-ok .cr-dot{color:var(--jade);}
.cr-behind .cr-dot{color:var(--ember);}
.cr-label{font-weight:600;}
.cr-value{color:var(--text-muted);font-size:.78rem;}
.cr-hint{color:var(--ember);font-size:.75rem;grid-column:2/-1;}
```

---

## Feature 2 — Skill-linked oath completion

**Value:** Oaths represent real training events. When completing an oath, Wyatt should be able to link it to a skill and auto-log a practice entry (or level-up). This bridges the quest system to the skill tree — completing a land nav exercise can credit the Land navigation skill directly.

**Implementation sketch:**

`src/tabs/quests.js` — add a skill-link row to each oath card (rendered inside the existing card footer area):

```js
// inside quest card render, after the dispatch button row:
function questSkillLinkHtml(q){
  const started=(S.lifeSkills||[]).filter(s=>!s.group&&(s.currentLevel||0)>0);
  const sel=started.map(s=>`<option value="${s.id}"${(q.linkedSkillId===s.id)?'selected':''}>${esc(s.name)}</option>`).join('');
  return `<div class="q-skilllink">
    <select class="q-skilllink-sel" data-qsklink="${q.id}">
      <option value="">link to skill…</option>${sel}
    </select>
    <span class="q-skilllink-type">
      <label><input type="radio" name="qlt${q.id}" value="practice"${(q.linkedSkillType!=='level')?' checked':''}> practice</label>
      <label><input type="radio" name="qlt${q.id}" value="level"${(q.linkedSkillType==='level')?' checked':''}> level up</label>
    </span>
  </div>`;
}
```

In the oath-complete handler (`data-qcomplete`), before `save()`:
```js
const sel=document.querySelector(`[data-qsklink="${qid}"]`);
if(sel&&sel.value){
  const type=document.querySelector(`input[name="qlt${qid}"]:checked`);
  const sk=(S.lifeSkills||[]).find(s=>s.id===sel.value);
  const note=`Oath completed: ${q.text||''}`;
  if(sk){ if(type&&type.value==='level') skReachLevel(sk.id,(sk.currentLevel||0)+1,note); else skPractice(sk.id); }
}
```

Persist link on quest object when select changes (fire `input` event, save `q.linkedSkillId`/`q.linkedSkillType`).

**CSS:**
```css
.q-skilllink{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;margin-top:.4rem;padding-top:.4rem;border-top:1px solid var(--border);}
.q-skilllink-sel{flex:1;min-width:0;font-size:.78rem;background:var(--surface);border:1px solid var(--border);border-radius:.3rem;color:var(--text);padding:.25rem .4rem;}
.q-skilllink-type{display:flex;gap:.5rem;font-size:.75rem;color:var(--text-muted);}
.q-skilllink-type label{display:flex;align-items:center;gap:.2rem;cursor:pointer;}
```

---

## Feature 3 — Card table redesign of the Skills tab

**Value:** The Skills tab is where Wyatt spends the most time, but it reads like a flat list. This redesign transforms it into a card table — dark green felt background, 10 path decks laid face-down in a grid, each embossed with its path sigil and a thematic suit. Tapping a deck flips it open to reveal the skills as individual playing cards with rank corners (Ace through King) and suit symbols. Groups within a deck act as dividers between "hands," and their child skills are mini playing cards — same visual anatomy (sigil, tier, fill bar) scaled to card size. All decks are closed by default; all backs visible at tab open.

**Pre-step — assign 5 missing parent fields in `src/core/skills-data.js`** (before the card changes, so the deck contents are structured correctly):
- `Statistics & data analysis` → add `parent:"Knowledge"`
- `Geopolitics & foreign policy` → add `parent:"Knowledge"`
- `Philosophy & ethics` → add `parent:"Knowledge"`
- `Economics fundamentals` → add `parent:"Knowledge"`
- `Injury prevention & prehab` → add `parent:"Daily inputs"`

Bump `SKILL_LADDER_VER` (94 → 95) for the parent updates, then verify with `npm run regress`.

---

**Suit definitions — add near the top of `src/tabs/skills.js`** (before `renderSkillsTab`):

```js
const SK_SUIT={
  tactical:      {sym:"⚔",  name:"Swords",    col:"#78909c", light:"#eceff1"},
  physical:      {sym:"🔥", name:"Wands",     col:"#bf5b30", light:"#fbe9e7"},
  cognitive:     {sym:"🌊", name:"Cups",      col:"#4a7fad", light:"#e3f2fd"},
  physiological: {sym:"🌿", name:"Pentacles", col:"#4caf70", light:"#e8f5e9"},
  technical:     {sym:"⚡", name:"Circuits",  col:"#7e57c2", light:"#ede7f6"},
  leadership:    {sym:"🛡", name:"Shields",   col:"#b58900", light:"#fff8e1"},
  academic:      {sym:"📜", name:"Scrolls",   col:"#00796b", light:"#e0f2f1"},
  personal:      {sym:"✦",  name:"Stars",     col:"#af8c00", light:"#fffde7"},
  hearth:        {sym:"🗝", name:"Keys",      col:"#8d6e63", light:"#efebe9"},
  roots:         {sym:"🌳", name:"Roots",     col:"#558b2f", light:"#f1f8e9"},
};
const CARD_RANKS=["A","2","3","4","5","6","7","8","9","10","Page","Knight","Queen","King"];
```

---

**Deck rendering — modify the main deck loop in `renderSkillsTab()`:**

Remove the `maxPxCat` auto-open logic — replace `const isOpen=cat===maxPxCat;` with `const isOpen=false;` (all decks start closed).

Add per-deck rank map so each leaf skill in the deck gets a card rank in order:

```js
const suit=SK_SUIT[cat]||{sym:"★",name:cat,col:"#555",light:"#ddd"};
const rankMap={};
let rIdx=0;
tops.forEach(sk=>{
  if(sk.group){
    skSubsOf(sk).forEach((sub,i)=>{ rankMap[sub.id]=CARD_RANKS[(rIdx+i)%14]; });
    rIdx+=skSubsOf(sk).length;
  } else { rankMap[sk.id]=CARD_RANKS[rIdx%14]; rIdx++; }
});
// Deck-back emblem: call skEmblemSvg with a fake skill at moderate development
const deckEmblemSvg=skEmblemSvg({id:cat+"-deck",cat:cat},5,10)||'';
const totalLeaves=S.lifeSkills.filter(s=>s.cat===cat&&!s.group&&s.levels&&s.levels.length).length;
```

Replace the `.sk-deck-header` inner HTML with a card-back visual:

```js
html+=`<div class="sk-deck" id="skcat-${cat}" style="--deck-col:${suit.col};--deck-light:${suit.light}">
  <div class="sk-deck-header${isOpen?' open':''}" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">
    <div class="sdb-corner tl"><div class="sdb-rank">Lv${fmtLvl(catLvl)}</div><div class="sdb-suit">${suit.sym}</div></div>
    <div class="sdb-center">
      <div class="sdb-emblem">${deckEmblemSvg}</div>
      <div class="sdb-path-name">${esc(pathName)}</div>
      <div class="sdb-suit-name">${esc(suit.name)}</div>
      <div class="sdb-count">${totalLeaves} skill${totalLeaves!==1?'s':''}${fadingCount?` · <span class="sdb-fading">🍂${fadingCount}</span>`:''}</div>
    </div>
    <div class="sdb-corner br"><div class="sdb-rank">Lv${fmtLvl(catLvl)}</div><div class="sdb-suit">${suit.sym}</div></div>
  </div>
  <div class="sk-deck-body${isOpen?' open':''}">
    ${tops.map(sk=>sk.group?groupCard(sk,suit,rankMap):leafCard(sk,false,suit,rankMap[sk.id])).join('')}
  </div>
</div>`;
```

---

**`leafCard(sk, isSub, suit, rank)` — add rank corner elements:**

Add `suit` and `rank` parameters to `leafCard`. At the top of the returned string (after `<div class="sk-card ...">`) add:

```js
const suitInfo=suit||(SK_SUIT[sk.cat]||{sym:"★",col:"#555",light:"#ddd"});
const cardRank=rank||"";
// Add to start of returned HTML (first child inside .sk-card):
`<div class="spc-corner tl" style="color:${suitInfo.col}">
  <div class="spc-rank">${cardRank}</div>
  <div class="spc-suit">${suitInfo.sym}</div>
</div>`
// Add before closing </div> of .sk-card:
`<div class="spc-corner br" style="color:${suitInfo.col}">
  <div class="spc-rank">${cardRank}</div>
  <div class="spc-suit">${suitInfo.sym}</div>
</div>`
```

Also add `style="--deck-col:${suitInfo.col};--deck-light:${suitInfo.light||'#eee'}"` to the `.sk-card` root div's existing style string.

---

**`groupCard(sk, suit, rankMap)` — mini playing cards for child skills:**

Add `suit` and `rankMap` parameters. Replace `.sk-subs` inner render with mini card versions:

```js
const miniCard=sub=>{
  const eff=skEffectiveLevel(sub); const max=(sub.levels||[]).length||10;
  const pct=Math.min(100,Math.round(eff/max*100));
  const col=skLeafColor(eff,max,sub);
  const tier=skTier(sub,eff); const tierLabel=tier&&eff>0?tier.label:(eff>0?"L"+eff:"—");
  const state=skFadeState(sub);
  const rank=rankMap&&rankMap[sub.id]||"";
  const s=suit||{sym:"★",col:"#555",light:"#ddd"};
  return `<div class="sk-mini-card${state!=='current'?' sk-mini-atrisk':''}${eff===0?' sk-mini-unstarted':''}" 
           style="--deck-col:${s.col};--deck-light:${s.light}">
    <div class="spc-corner tl" style="color:${s.col}"><div class="spc-rank">${rank}</div><div class="spc-suit">${s.sym}</div></div>
    <div class="sk-mini-emb">${skEmblemSvg(sub,eff,max)||''}</div>
    <div class="sk-mini-name">${esc(sub.name)}</div>
    <div class="sk-mini-tier">${esc(tierLabel)}</div>
    <div class="sk-mini-bar"><div class="sk-mini-fill" style="width:${pct}%;background:${col}"></div></div>
    <div class="sk-mini-lvl">L${eff}/${max}</div>
    ${sub.auto?'':`<button class="sk-mini-prac" data-skpractice="${sub.id}" title="practiced">✓</button>`}
    <div class="spc-corner br" style="color:${s.col}"><div class="spc-rank">${rank}</div><div class="spc-suit">${s.sym}</div></div>
  </div>`;
};
// In groupCard return:
`<div class="sk-group">
  <div class="sk-group-top">
    <span class="sk-group-suit">${suit?suit.sym:''}</span>
    <div class="sk-group-name">${esc(sk.name)}<span class="sk-group-sub"> ${subs.length} skills</span></div>
    <span class="sk-level-badge group">Lv ${fmtLvl(rolled)}</span>
    <button class="sk-card-edit" data-skedit="${sk.id}">✎</button>
    <button class="sk-card-del" data-skdel="${sk.id}">✕</button>
  </div>
  <div class="sk-subs sk-mini-grid">${subs.map(miniCard).join('')}</div>
</div>`
```

---

**CSS to add to `src/styles/main.css`:**

```css
/* Card table felt background */
#view-skills{background:linear-gradient(160deg,#0d2214 0%,#0a1a0f 100%);}

/* Deck grid — all decks listed */
#skList .sk-deck{margin-bottom:.75rem;}

/* Deck header = card back */
.sk-deck-header{
  position:relative; display:flex; align-items:center; justify-content:center;
  min-height:160px; cursor:pointer; border-radius:.6rem;
  background:var(--deck-col,#444);
  box-shadow:3px 3px 0 rgba(0,0,0,.35),6px 6px 0 rgba(0,0,0,.2),9px 9px 0 rgba(0,0,0,.1);
  transition:box-shadow .15s, transform .15s;
  border:1.5px solid color-mix(in srgb,var(--deck-col) 60%,#fff 40%);
  overflow:hidden;
}
.sk-deck-header:active{transform:translateY(2px);box-shadow:1px 1px 0 rgba(0,0,0,.35);}
.sk-deck-header::before{
  content:'';position:absolute;inset:6px;border:1px solid rgba(255,255,255,.12);border-radius:.35rem;pointer-events:none;
}
.sdb-corner{
  position:absolute;display:flex;flex-direction:column;align-items:center;
  gap:.05rem;padding:.45rem .55rem;line-height:1;
  color:color-mix(in srgb,var(--deck-light,#eee) 90%,transparent);
}
.sdb-corner.tl{top:0;left:0;}
.sdb-corner.br{bottom:0;right:0;transform:rotate(180deg);}
.sdb-rank{font-size:.75rem;font-weight:800;letter-spacing:.02em;}
.sdb-suit{font-size:.9rem;}
.sdb-center{display:flex;flex-direction:column;align-items:center;gap:.3rem;text-align:center;pointer-events:none;}
.sdb-emblem{width:52px;height:52px;opacity:.35;color:var(--deck-light,#eee);}
.sdb-emblem svg{width:100%;height:100%;}
.sdb-path-name{font-size:.85rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--deck-light,#eee);}
.sdb-suit-name{font-size:.65rem;text-transform:uppercase;letter-spacing:.18em;opacity:.65;color:var(--deck-light,#eee);}
.sdb-count{font-size:.7rem;opacity:.75;color:var(--deck-light,#eee);}
.sdb-fading{color:var(--ember);}
.sk-deck-header.open{box-shadow:1px 1px 0 rgba(0,0,0,.3);opacity:.9;}

/* Opened deck body: card grid */
.sk-deck-body.open{display:flex;flex-wrap:wrap;gap:10px;padding:12px 8px;}
.sk-deck-body:not(.open){display:none;}

/* Skill card — playing card face */
.sk-card{
  position:relative;
  flex:0 0 130px;width:130px;
  background:var(--deck-light,#f5f5f0);
  border:1.5px solid var(--deck-col,#555);
  border-radius:.55rem;
  transition:flex .25s;
  overflow:visible;
}
.sk-card:has(.sk-card-detail[open]){flex:1 1 100%;width:100%;}
/* Dim path header inside card (redundant inside a deck) */
.sk-deck-body .sk-card-header{display:none;}

/* Rank/suit corner overlays on skill cards */
.spc-corner{
  position:absolute;display:flex;flex-direction:column;align-items:center;
  gap:.04rem;padding:.3rem .35rem;line-height:1;z-index:2;
}
.spc-corner.tl{top:0;left:0;}
.spc-corner.br{bottom:0;right:0;transform:rotate(180deg);}
.spc-rank{font-size:.7rem;font-weight:800;}
.spc-suit{font-size:.75rem;}

/* Override dark text for light-background cards */
.sk-deck-body .sk-card-name,.sk-deck-body .sk-card-tier{color:#1a1a1a;}
.sk-deck-body .sk-card-name .sk-auto{color:#555;}
.sk-deck-body .sk-card-footer{background:rgba(0,0,0,.06);border-top:1px solid rgba(0,0,0,.1);}
.sk-deck-body .sk-fade-foot,.sk-deck-body .sk-prac-foot{color:#444;}
.sk-deck-body .sk-fade-foot.warn{color:#c0392b;}
.sk-deck-body .sk-card-detail>summary{color:#333;}

/* Group header inside card deck */
.sk-group-suit{font-size:1rem;margin-right:.3rem;}

/* Mini playing cards inside group drill-down */
.sk-mini-grid{display:flex;flex-wrap:wrap;gap:8px;padding:.5rem .25rem .25rem;}
.sk-mini-card{
  position:relative;flex:0 0 110px;
  background:var(--deck-light,#f5f5f0);
  border:1.5px solid var(--deck-col,#555);
  border-radius:.5rem;
  padding:.5rem .4rem .4rem;
  display:flex;flex-direction:column;align-items:center;gap:.2rem;
  font-size:.75rem;overflow:hidden;
}
.sk-mini-card.sk-mini-atrisk{border-color:var(--ember);opacity:.85;}
.sk-mini-card.sk-mini-unstarted{opacity:.5;}
.sk-mini-emb{width:36px;height:36px;color:#1a1a1a;}
.sk-mini-emb svg{width:100%;height:100%;}
.sk-mini-name{font-size:.72rem;font-weight:700;text-align:center;color:#1a1a1a;line-height:1.2;max-width:100px;overflow:hidden;}
.sk-mini-tier{font-size:.62rem;color:#555;text-align:center;}
.sk-mini-bar{width:100%;height:.3rem;background:rgba(0,0,0,.15);border-radius:1rem;overflow:hidden;margin-top:.1rem;}
.sk-mini-fill{height:100%;border-radius:1rem;}
.sk-mini-lvl{font-size:.68rem;font-weight:700;color:#333;}
.sk-mini-prac{font-size:.65rem;padding:.1rem .3rem;border:1px solid var(--jade);color:var(--jade);background:transparent;border-radius:.2rem;cursor:pointer;margin-top:.1rem;}
```

---

**Jump bar** — the path icon jump bar at the top of `#skList` still works since `.sk-deck` IDs haven't changed. Search (`_filterSkillDecks`) still looks for `.sk-deck-body` which exists. No changes needed there.

**Key visual result:**
- Dark green felt table behind everything
- 10 stacked card backs in a list, each with the path sigil embossed in its suit color and a level badge + suit symbol in the corners
- Tapping a deck fans the cards out in a flex-wrap grid below
- Each skill is a portrait playing card (130px wide) with rank/suit corners, sigil emblem, name, tier, fill bar
- Group sections are labeled with the suit symbol and act as dividers; their children are 110px mini playing cards with the same anatomy
- Expanding a skill card's `<details>` stretches it to full width (`:has(details[open])`)
- At-risk / decayed cards show ember/blood border tinting through the existing `skFadeState` color chain

---

## Feature 4 — End-of-day training journal on Dawn

**Value:** A dead-simple 3-field daily log at the bottom of the Dawn tab: "What did you train?", "Win of the day", "Notes". Stores to `S.dayLog[]`. Shows the last 3 days of entries below the form. Gives Wyatt a permanent narrative of his training without adding a tab.

**Implementation sketch:**

`src/core/constants.js` — add `dayLog:[]` to `DEFAULT`.

`src/tabs/today.html` — add section at bottom of today view (after the last `.td-card`):

```html
<div class="td-card fn-card" id="dayLogCard">
  <div class="td-h fn-h">Day Log</div>
  <div id="dayLogWrap"></div>
</div>
```

`src/tabs/today.js` — add `renderDayLog()` (called from `renderToday()`):

```js
function renderDayLog(){
  const el=document.getElementById("dayLogWrap"); if(!el) return;
  const today=new Date().toISOString().slice(0,10);
  const log=S.dayLog||[];
  const todayEntry=log.find(e=>e.date===today)||{date:today,trained:'',wins:'',notes:''};
  const recent=log.filter(e=>e.date!==today).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  el.innerHTML=`<div class="dl-form">
    <input class="dl-input" id="dlTrained" placeholder="What did you train today?" value="${esc(todayEntry.trained||'')}">
    <input class="dl-input" id="dlWins" placeholder="Win of the day" value="${esc(todayEntry.wins||'')}">
    <input class="dl-input" id="dlNotes" placeholder="Notes" value="${esc(todayEntry.notes||'')}">
    <button class="dl-save-btn" id="dlSave">Save</button>
  </div>
  ${recent.map(e=>`<div class="dl-past-row">
    <span class="dl-past-date">${e.date.slice(5)}</span>
    <span class="dl-past-text">${esc(e.trained||'—')}</span>
    ${e.wins?`<span class="dl-past-win">✓ ${esc(e.wins)}</span>`:''}
  </div>`).join('')}`;
  document.getElementById("dlSave").onclick=()=>{
    const entry={date:today,
      trained:(document.getElementById("dlTrained").value||'').trim(),
      wins:(document.getElementById("dlWins").value||'').trim(),
      notes:(document.getElementById("dlNotes").value||'').trim()};
    S.dayLog=(S.dayLog||[]).filter(e=>e.date!==today);
    if(entry.trained||entry.wins||entry.notes) S.dayLog.push(entry);
    save(); toast("Day logged");
  };
}
```

**CSS:**
```css
.dl-form{display:flex;flex-direction:column;gap:.4rem;margin-bottom:.6rem;}
.dl-input{background:var(--surface);border:1px solid var(--border);border-radius:.4rem;padding:.45rem .65rem;color:var(--text);font-size:.83rem;}
.dl-input::placeholder{color:var(--text-muted);}
.dl-save-btn{align-self:flex-end;padding:.3rem 1rem;background:var(--jade);color:#000;border:none;border-radius:.4rem;cursor:pointer;font-size:.8rem;font-weight:600;}
.dl-past-row{display:flex;align-items:baseline;gap:.5rem;font-size:.8rem;padding:.25rem 0;border-top:1px solid var(--border);}
.dl-past-date{font-size:.72rem;color:var(--text-muted);min-width:3rem;}
.dl-past-text{flex:1;color:var(--text);}
.dl-past-win{color:var(--jade);font-size:.75rem;}
```

---

## Feature 5 — 30-day skill history sparkline in Work panel

**Value:** The skill Work panel (opened by tapping a skill card) shows current level and recent log entries, but no visual of the progression curve. A 30-day mini sparkline from `history[]` shows the climb at a glance — useful for understanding decay patterns and the actual rate of growth.

**Implementation sketch:**

`src/tabs/skills.js` — add `skTrendSparkline(sk)` helper and wire into `skWorkPanel()`:

```js
function skTrendSparkline(sk){
  if(!sk.history||sk.history.length<2) return '';
  const now=Date.now(); const day=86400000; const days=30;
  const pts=[];
  for(let d=days-1;d>=0;d--){
    const ts=now-d*day;
    const entries=sk.history.filter(h=>h.ts<=ts);
    pts.push(entries.length?(entries[entries.length-1].level||0):0);
  }
  return miniSparkline(pts,220,28);
}
```

Inside `skWorkPanel()`, after the log entries block:
```js
const spark=skTrendSparkline(sk);
if(spark) panelHtml+=`<div class="sk-trend-wrap">
  <span class="sk-trend-label">30-day</span>${spark}
</div>`;
```

`miniSparkline` is already defined in `state.js` — no new helpers needed.

**CSS:**
```css
.sk-trend-wrap{margin-top:.5rem;display:flex;flex-direction:column;gap:.2rem;}
.sk-trend-label{font-size:.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;}
.sk-trend-wrap svg{border-radius:.25rem;background:var(--surface);width:100%;height:28px;}
```

---

## Feature 6 — Fix 5 orphaned skills missing parent assignments

**Value:** The v122 batch added 64 skills but a handful of academic and physiological skills were seeded without a `parent:` field, so they float as ungrouped leaves inside paths that otherwise have full hierarchy structure. This is a small data fix; no new group nodes needed since the groups already exist.

**What already exists (do not re-add):** Speed, Memory, Reasoning (cognitive); Body markers, Daily inputs (physiological); Knowledge, Learning systems, Languages (academic).

**Five skills to fix in `src/core/skills-data.js`:**

```js
// Add parent: to each of these seeds:
{name:"Statistics & data analysis", cat:"academic",      // → parent:"Knowledge"
{name:"Geopolitics & foreign policy", cat:"academic",    // → parent:"Knowledge"
{name:"Philosophy & ethics", cat:"academic",             // → parent:"Knowledge"
{name:"Economics fundamentals", cat:"academic",          // → parent:"Knowledge"
{name:"Injury prevention & prehab", cat:"physiological", // → parent:"Daily inputs"
```

These are already at lines ~3315, ~3369, ~3524, ~3549, ~2661 in `skills-data.js` — just add `parent:"Knowledge"` or `parent:"Daily inputs"` to each seed object. The migration reconciler (lines 130–134 of `migration.js`) will backfill `parent` on any existing saves automatically.

Bump `SKILL_LADDER_VER` (94 → 95) since parent assignments changed. Note: if Feature 3 (card table redesign) is also in this session, that feature already bumps SKILL_LADDER_VER — handle both in one bump.
