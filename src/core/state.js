const KEY="operations_v2";
let S = load();
try{ if(typeof window!=="undefined") window.S = S; }catch(_){}  // expose for tests/devtools; harmless in app

function id(){return Math.random().toString(36).slice(2,9)}
function load(){
  try{
    const r=JSON.parse(localStorage.getItem(KEY));
    if(!r) return structuredClone(DEFAULT);
    const merged=Object.assign(structuredClone(DEFAULT),r);
    // ensure nested structures exist after upgrades
    const defaultPXP={tactical:0,physical:0,cognitive:0,physiological:0,technical:0,leadership:0,academic:0,personal:0,hearth:0,roots:0};
    merged.pathXP=Object.assign({...defaultPXP},r.pathXP||{});
    // Migrate old skills.{fitness,tactics,knowledge,discipline} XP → pathXP (one-time, old saves)
    if(r.skills && !r.pathXP){
      if(r.skills.fitness)    merged.pathXP.physical  =(merged.pathXP.physical||0) +(r.skills.fitness.xp||0);
      if(r.skills.tactics)    merged.pathXP.tactical  =(merged.pathXP.tactical||0) +(r.skills.tactics.xp||0);
      if(r.skills.knowledge)  merged.pathXP.academic  =(merged.pathXP.academic||0) +(r.skills.knowledge.xp||0);
      if(r.skills.discipline) merged.pathXP.personal  =(merged.pathXP.personal||0) +(r.skills.discipline.xp||0);
    }
    // Migrate old track → path field in quests/dailies/bosses
    [...(merged.quests||[]),...(merged.dailies||[]),...(merged.bosses||[])].forEach(item=>{
      if(!item.path && item.track) item.path=TRACK_TO_PATH[item.track]||item.track;
    });
    merged.quizzes=r.quizzes||{};
    merged.aft=r.aft||[];
    merged.workouts=r.workouts||[];
    merged.baselines=r.baselines||[];
    merged.boardTasks=r.boardTasks||structuredClone(DEFAULT.boardTasks);
    merged.branchGoal=r.branchGoal||DEFAULT.branchGoal;
    merged.weight=r.weight||structuredClone(DEFAULT.weight);
    if(!merged.weight.promises) merged.weight.promises=[];
    if(!merged.weight.memorial) merged.weight.memorial=[];
    merged.weightAppUrl=r.weightAppUrl||"https://wsm-ai.github.io/tw-9f3kx-ledger/";
    merged.lastMirrorUpdate=r.lastMirrorUpdate||null;
    merged.awards=r.awards||[];
    merged.ptLog=r.ptLog||[];
    merged.memberships=r.memberships||[];
    merged.events=r.events||[];
    merged.volunteer=r.volunteer||[];
    merged.lifeSkills=r.lifeSkills||[];
    merged._seeded=r._seeded||false;
    merged._skillLadderVer=r._skillLadderVer||0;
    // migration: if skills exist but lack hierarchy fields, they're the old flat set — reseed fresh
    if(merged.lifeSkills.length && merged.lifeSkills.every(s=>s.group===undefined && s.parent===undefined)){
      merged.lifeSkills=[]; merged._seeded=false;
    }
    // backfill peakLevel (all-time high) for any skill missing it
    merged.lifeSkills.forEach(s=>{ s.peakLevel=Math.max(s.peakLevel||0, s.currentLevel||0); });
    merged.navLabels=r.navLabels!==undefined?r.navLabels:true;
    merged.navExpanded=r.navExpanded!==undefined?r.navExpanded:false;
    merged.missedTraining=r.missedTraining||[];
    merged.profile=Object.assign({birthdate:null,heightIn:null,heightDate:null,weightLb:null,weightDate:null,sex:null,bloodType:null,units:"imperial",notes:"",commissionDate:null,gpa:null}, r.profile||{});
    merged.lifts=Object.assign({deadliftLb:null,squatLb:null,benchLb:null,liftDate:null}, r.lifts||{});
    merged.aftStandard=r.aftStandard||"general";
    merged.donations=r.donations||[];
    merged.weightLog=r.weightLog||[];
    merged.vitals=r.vitals||[];
    merged.healthImport=Object.assign({lastImport:null}, r.healthImport||{});
    merged.habits=r.habits||[];
    merged.tests=r.tests||[];
    merged.srsDecks=r.srsDecks||[];
    merged.palaces=r.palaces||[];
    merged.studyPlans=r.studyPlans||[];
    merged.counseling=r.counseling||[];
    merged.checklists=r.checklists||[];
    return merged;
  }catch(e){return structuredClone(DEFAULT)}
}
function save(){localStorage.setItem(KEY,JSON.stringify(S)); try{ if(typeof window!=="undefined") window.S=S; }catch(_){} cloudWriteDebounced();}
// skill level from xp: rising cost curve
function skillLevel(xp){let lvl=1,need=80,acc=0;while(xp>=acc+need){acc+=need;lvl++;need+=40;}return{lvl,into:xp-acc,need};}

/* ---------------- Daily reset & streak ---------------- */
function today(){return new Date().toDateString()}
function checkDailyReset(){
  const t=today();
  if(S.lastDaily===t) return;
  if(S.lastDaily){
    const diff=Math.round((new Date(t)-new Date(S.lastDaily))/864e5);
    if(diff===1 && S._yesterdayComplete){ S.streak++; S.missedYesterday=false; }
    else { if(S.streak>0) S.missedYesterday=true; S.streak=0; }
  }
  if(S.streak>S.bestStreak) S.bestStreak=S.streak;
  S._yesterdayComplete = S.dailies.length>0 && S.dailies.every(d=>d.done);
  S.dailies.forEach(d=>d.done=false);
  S.lastDaily=t;
  save();
}
// readiness status — degrades as undone dailies pile up; this is the "don't slip" signal
function readiness(){
  const total=S.dailies.length||1;
  const done=S.dailies.filter(d=>d.done).length;
  const pct=done/total;
  if(pct>=1) return {label:"FULLY MISSION READY",color:"var(--jade)",pct};
  if(pct>=0.66) return {label:"READY",color:"var(--gold)",pct};
  if(pct>=0.34) return {label:"PARTIALLY READY",color:"var(--ember)",pct};
  return {label:"NOT MISSION READY",color:"var(--blood)",pct};
}

/* ---------------- XP / rewards ---------------- */
function grant(xp,gold,label,path){
  S.gold+=gold; S.totalDone++;
  path=path||"tactical";
  if(!S.pathXP) S.pathXP={};
  if(!S.pathXP[path]) S.pathXP[path]=0;
  const before=skillLevel(S.pathXP[path]).lvl;
  S.pathXP[path]+=xp;
  const after=skillLevel(S.pathXP[path]).lvl;
  save(); render();
  const pm=PATH_META[path];
  if(after>before) showLevelUp(path,after);
  else toast(`<span class="t-xp">+${xp} XP → ${pm?pm.name:path} &nbsp;+${gold} pts</span> &nbsp;·&nbsp; ${label}`);
}

// Perfect day = all dailies cleared. Escalating dopamine + streak milestones.
function onPerfectDay(){
  const t=today();
  if(S.lastPerfect===t) return; // only once per day
  S.lastPerfect=t;
  S.perfectDays=(S.perfectDays||0)+1;
  // tomorrow's reset will bump the streak; the *pending* streak is streak+1
  const pending=S.streak+1;
  // bonus merit scales with streak (loss aversion: the longer the streak, the more you'd lose)
  const bonus=20+Math.min(80,pending*3);
  S.gold+=bonus;
  if(!S.pathXP) S.pathXP={};
  S.pathXP.personal=(S.pathXP.personal||0)+40;
  save();render();
  // milestone celebrations
  const milestones={3:"3-day streak — momentum building.",7:"7 days straight. One week locked in.",14:"Two weeks. This is becoming who you are.",30:"30 DAYS. Discipline is now a habit, not a choice.",60:"60 days. Most people never get here.",100:"100 DAYS. Elite consistency."};
  const ms=milestones[pending];
  document.getElementById("luTitle").textContent=ms?("🔥 "+pending+"-Day Streak!"):"✅ Perfect Day";
  document.getElementById("luSub").textContent=(ms||"All orders cleared. +"+bonus+" merit, +40 Discipline XP.")+(ms?` +${bonus} merit.`:"");
  document.querySelector("#levelup .lu-burst").textContent=ms?"🔥":"🎖️";
  document.getElementById("levelup").classList.add("show");
}

/* ---------------- Render ---------------- */
function render(){
  checkDailyReset();
  document.getElementById("heroName").textContent=S.name;
  document.getElementById("rankLine").textContent=S.rank;
  document.getElementById("posLine").textContent=S.position;
  document.getElementById("sGold").textContent=S.gold;
  document.getElementById("sStreak").textContent=S.streak;
  document.getElementById("sBest").textContent=S.bestStreak||0;
  // readiness bar
  const rd=readiness();
  const done=S.dailies.filter(d=>d.done).length, total=S.dailies.length;
  document.getElementById("rdLabel").textContent=rd.label;
  document.getElementById("rdLabel").style.color=rd.color;
  document.getElementById("rdPct").textContent=done+"/"+total+" orders today";
  document.getElementById("rdFill").style.width=Math.round(rd.pct*100)+"%";
  document.getElementById("rdFill").style.background=rd.color;
  const warn=document.getElementById("rdWarn");
  const undone=total-done;
  if(S.missedYesterday && S.streak===0){
    warn.className="rd-warn show"; warn.style.color="var(--blood)";
    warn.innerHTML="💥 Streak broken — you missed a day. Clear every order today to start rebuilding.";
  } else if(undone>0 && S.streak>0){
    warn.className="rd-warn show"; warn.style.color="var(--ember)";
    warn.innerHTML=`⚠️ ${S.streak}-day streak AT RISK — ${undone} order${undone>1?'s':''} left. Don't lose it now.`;
  } else if(undone>0){
    warn.className="rd-warn show"; warn.style.color="var(--ink-faint)";
    warn.innerHTML=`${undone} order${undone>1?'s':''} left to lock in a perfect day.`;
  } else {
    warn.className="rd-warn"; warn.innerHTML="";
  }
  renderQuests(); renderDailies(); renderBosses(); renderShop();
  if(typeof renderQuizzes==="function") renderQuizzes();
  if(typeof renderAft==="function") renderAft();
  if(typeof renderLog==="function") renderLog();
  if(typeof renderProfile==="function") renderProfile();
  if(typeof renderEmergencyAndBlood==="function") renderEmergencyAndBlood();
  if(typeof renderVitals==="function") renderVitals();
  if(typeof renderHabits==="function") renderHabits();
  if(typeof renderTests==="function") renderTests();
  if(typeof renderSRS==="function") renderSRS();
  if(typeof renderPalace==="function") renderPalace();
  if(typeof renderStudy==="function") renderStudy();
  if(typeof renderToday==="function") renderToday();
  if(typeof renderHistory==="function") renderHistory();
  if(typeof renderCounsel==="function") renderCounsel();
  if(typeof renderChecklists==="function") renderChecklists();
  if(typeof renderSectionPicker==="function") renderSectionPicker();
  if(typeof renderPT==="function") renderPT();
  if(typeof renderSkillBalance==="function") renderSkillBalance();
  if(typeof renderRecoveryAdvisory==="function") renderRecoveryAdvisory();
  if(typeof renderSessionLists==="function") renderSessionLists();
  if(typeof renderCoachToday==="function") renderCoachToday();
  if(typeof renderSkillsTab==="function") renderSkillsTab();
  if(typeof renderAdaptiveTargets==="function") renderAdaptiveTargets();
  if(typeof renderBaseline==="function") renderBaseline();
  if(typeof renderBoard==="function") renderBoard();
  if(typeof renderWeight==="function") renderWeight();
  if(typeof renderAwards==="function") renderAwards();
  if(typeof renderGarden==="function") renderGarden();
}

function pathTag(path){
  const pm=PATH_META[path];
  if(!pm) return "";
  return `<span class="tag path-tag" style="color:${pm.color}">${pm.icon} ${pm.name}</span>`;
}
function diffTag(scope,diff){
  const cls=diff==="easy"?"diff-easy":diff==="hard"?"diff-hard":"diff-med";
  const labels={easy:"routine",med:"priority",hard:"high-risk"};
  const v=VALUES[scope][diff];
  return `<span class="tag ${cls}">${labels[diff]}</span><span class="tag xp">+${v.xp} XP · ${v.g} pts</span>`;
}

function renderQuests(){
  const el=document.getElementById("qList");
  if(!S.quests.length){el.innerHTML=`<div class="empty"><span class="big">🎯</span>The board is clear. Swear an oath above and carry it forward.</div>`;return}
  el.innerHTML=S.quests.map(q=>`
    <li class="card ${q.done?'done':''}">
      <div class="check" data-q="${q.id}">${q.done?'✓':''}</div>
      <div class="c-body"><div class="c-name">${esc(q.name)}</div>
        <div class="c-meta">${diffTag('quest',q.diff)}${pathTag(q.path)}</div></div>
      <button class="del" data-dq="${q.id}">✕</button>
    </li>`).join("");
}
function renderDailies(){
  const el=document.getElementById("dList");
  if(!S.dailies.length){el.innerHTML=`<div class="empty"><span class="big">📋</span>No orders standing. Lay your daily oaths — executed at dawn, every dawn.</div>`;return}
  el.innerHTML=S.dailies.map(d=>`
    <li class="card ${d.done?'done':''}">
      <div class="check" data-d="${d.id}">${d.done?'✓':''}</div>
      <div class="c-body"><div class="c-name">${esc(d.name)}</div>
        <div class="c-meta">${diffTag('daily',d.diff)}${pathTag(d.path)}${d.best?`<span class="tag streakt">🔥 best ${d.best}</span>`:''}</div></div>
      <button class="del" data-dd="${d.id}">✕</button>
    </li>`).join("");
}
function renderBosses(){
  const el=document.getElementById("bList");
  if(!S.bosses.length){el.innerHTML=`<div class="empty"><span class="big">⚔️</span>No trials set. Name what you must endure and begin the reckoning.</div>`;return}
  el.innerHTML=S.bosses.map(b=>{
    const pct=Math.max(0,b.hp/b.maxhp*100);
    const dead=b.hp<=0;
    return `<li class="card boss">
      <div class="boss-top">
        <div class="boss-skull">${dead?'🏆':'⚔️'}</div>
        <div class="boss-name">${esc(b.name)}${dead?' — Conquered.':''}</div>
        <button class="del" data-db="${b.id}">✕</button>
      </div>
      ${dead?'':`
      <div class="hpbar"><div class="hpfill" style="width:${pct}%"></div></div>
      <div class="hp-meta"><span>${b.hp} / ${b.maxhp} steps remaining</span><span>+${b.maxhp*8} XP · ${b.maxhp*4} pts when conquered</span></div>
      <div class="boss-actions">
        <button class="hit" data-hit="${b.id}">⚔️ Strike it</button>
      </div>`}
    </li>`}).join("");
}
function renderShop(){
  const el=document.getElementById("rList");
  if(!S.rewards.length){el.innerHTML=`<div class="empty"><span class="big">🍺</span>The Mead Hall is empty. Name your earned rest so victory has a destination.</div>`;return}
  el.innerHTML=S.rewards.map(r=>`
    <li class="card">
      <div class="c-body reward">
        <div style="flex:1"><div class="c-name">${esc(r.name)}</div>
          <div class="c-meta"><span class="cost">🎖️ ${r.cost} merit</span></div></div>
        <button class="btn-buy" data-buy="${r.id}" ${S.gold<r.cost?'disabled':''}>Claim Rest</button>
      </div>
      <button class="del" data-dr="${r.id}">✕</button>
    </li>`).join("");
}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
