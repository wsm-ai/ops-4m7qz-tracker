const WEATHER={
  clear:{label:"Clear / fine", icon:"☀️", bad:false},
  rain:{label:"Rain", icon:"🌧️", bad:true},
  snow:{label:"Snow / ice", icon:"❄️", bad:true},
  heat:{label:"Extreme heat", icon:"🥵", bad:true},
  cold:{label:"Extreme cold", icon:"🧊", bad:true},
  wind:{label:"High wind", icon:"🌬️", bad:true},
  air:{label:"Poor air quality", icon:"😷", bad:true},
  dark:{label:"Dark / unsafe", icon:"🌙", bad:true},
};
function weatherBad(){ const w=WEATHER[(S&&S.weather)||"clear"]; return !!(w&&w.bad); }
function sessionEx(skey){
  const s=SESSIONS[skey]; if(!s) return [];
  const useGym=!!(S&&S.hasGym);
  let list=(useGym? s.gym : s.bw) || s.bw || s.ex || [];
  // Weather swap only applies to the no-equipment (outdoor) plan — gym work is already indoors.
  if(!useGym && weatherBad()){
    list=list.map(e=> (e.out && e.indoor) ? Object.assign({}, e.indoor, {_swapped:true, _from:e.n}) : e);
  }
  return list;
}
// Body areas / systems each FM session loads — used for PT recovery-aware adjustment.
const SESSION_AREAS = {
  s1:["legs","push","core"],   // Lower + Push
  s2:["cardio","legs"],         // Run
  s3:["pull","push","core"],    // Upper + Core
  s4:["legs","push","core","cardio"], // AFT circuit (full)
  s5:["mobility","balance"],    // Mobility + Balance (recovery-oriented, low fatigue)
  other:[],
};

// ===== Weekly training schedule (the coached rotation) =====
// JS getDay(): 0=Sun … 6=Sat. null = rest day.
const WEEK_PLAN = {
  0:{ session:null, intensity:"rest", label:"Active recovery", note:"20–40 min easy walk + the Session 5 stretch block. Rest is when you actually adapt — take it." },
  1:{ session:"s1", intensity:"hard", label:"Strength A — Lower + Push" },
  2:{ session:"s2", intensity:"moderate", label:"Run (keep it easy/tempo, not all-out)" },
  3:{ session:"s3", intensity:"hard", label:"Strength B — Upper + Core" },
  4:{ session:"s5", intensity:"easy", label:"Mobility + Balance (recovery)" },
  5:{ session:"s4", intensity:"hard", label:"AFT Circuit — your weak events" },
  6:{ session:"s2", intensity:"hard", label:"Run (intervals OR long easy)" },
};
// Short how-to for each exercise that appears in a session (matched by a keyword in the name).
// Keeps the coached card self-explanatory without opening the glossary.
const EX_HOWTO=[
  // --- no-equipment lower/push ---
  ["reverse lunge","From standing, step one foot straight back and lower until both knees are ~90°, then drive through the front heel back up. Alternate legs."],
  ["single-leg glute bridge","Lie on your back, one knee bent with that foot flat, other leg straight out. Push through the planted heel to lift your hips into a line, squeeze, lower."],
  ["hand-release push-up","A push-up where, at the bottom, you lower fully to the floor and lift your hands off for a moment, then place them and press up."],
  ["pike push-up","From a push-up position, walk your feet in and raise your hips into an upside-down V. Bend your elbows to lower your head toward the floor, then press up."],
  ["shrimp","A single-leg squat on the floor: stand on one leg, hold the other foot behind you (or just keep it lifted), and lower under control as far as you can, then stand. Hold a wall to balance."],
  ["hollow-body","Lie on your back, press your lower back into the floor, and lift your shoulders and legs a few inches so your body makes a shallow banana. Hold and breathe."],
  ["single-leg hip hinge","Stand on one leg, slight knee bend. Tip your torso forward and float the free leg straight behind you (arms out like wings), then stand tall. Hamstrings + balance."],
  // --- gym lower/push ---
  ["bulgarian split squat","Rest the top of your back foot on a bench behind you, lower the front leg until the thigh is ~parallel, drive back up through the front heel."],
  ["single-leg rdl","Stand on one leg holding a weight; hinge at the hip, tipping forward while the free leg lifts behind you, then stand tall. Keep your back flat."],
  ["bench press","Lying on a bench, press the bar or dumbbells from your chest to straight arms and back down."],
  ["overhead press","Standing, press a barbell or dumbbells from your shoulders to overhead, then lower under control."],
  ["leg press","Push the weighted platform away with your legs on the machine, then return under control without locking the knees hard."],
  ["goblet squat","Hold a dumbbell or kettlebell at your chest and squat down to at least parallel, chest tall, then stand."],
  ["machine crunch","Loaded core flexion on a cable or ab machine — curl your ribs toward your hips against the resistance."],
  ["deadlift","Bar over mid-foot; hinge with a flat back and grip it, then stand tall driving your hips forward, bar close to your body. Never round the lower back."],
  // --- runs / cardio (outdoor) ---
  ["intervals (sprint","Short fast efforts with rest between: sprint ~400m or 60–90s hard, then walk/jog 90s, and repeat for the set count. Builds speed."],
  ["tempo run","A sustained 'comfortably hard' pace you can only say a few words at — hold it for 15–25 minutes."],
  ["long easy run","A slow, conversational-pace run, longer than usual (30–50 min). Builds the aerobic base behind the 2-mile."],
  ["timed 2-mile","Run 2 miles as fast as you can sustain and record the time — the AFT run, used as a test, not every week."],
  // --- gym cardio ---
  ["treadmill interval","Run hard/easy bursts on a treadmill; add incline to build power and spare your joints."],
  ["treadmill tempo","Hold a comfortably-hard pace on the treadmill for 15–25 min."],
  ["rower or bike interval","Hard/easy bursts on a rowing machine or stationary bike — cardio that spares your legs for lifting days."],
  // --- indoor weather swaps ---
  ["indoor intervals","8 rounds of 30 seconds hard / 60 seconds easy (rest or march in place). Rotate through 4 moves so each gets hit exactly twice: round 1 burpees, 2 high-knees, 3 mountain-climbers, 4 squat jumps, then repeat the cycle for rounds 5–8. That keeps every move balanced. A burpee = squat down, kick your feet back to a push-up, do the push-up, jump your feet in, jump up."],
  ["indoor tempo","Keep moving continuously for 20 minutes at a steady, comfortably-hard effort — never fully stopping. Cycle through the 4 moves 5 minutes each (jumping jacks, shadow boxing, step-ups, jog in place) so every move gets equal time. The rotation just keeps any one move from wearing you out — the goal is continuous effort."],
  ["indoor steady cardio","40 min of easy, continuous low-impact movement. Cycle through the 4 moves 10 minutes each (march or jog in place, step-ups, jumping jacks, shadow boxing) so every move gets equal time. Keep it conversational; this is base-building, not a sprint."],
  ["indoor cardio test","Set a 20-minute clock and do as much steady jog-in-place / burpee work as you can, counting your reps or rounds. Log that number — it's your indoor benchmark to beat next time."],
  ["in-place shuttle","In a hallway or room, step or shuffle quickly to a mark a few yards away, touch low, and come back — repeat for the time. Or do burpee-to-sprint-step in place. Mimics the change-of-direction of the Sprint-Drag-Carry."],
  ["hard cardio burst","45 seconds all-out on one move — mountain climbers, jog in place, or jumping jacks — then move to the next exercise in the circuit."],
  // --- upper / core (no-equipment) ---
  ["doorway/towel row","Loop a towel around a sturdy doorknob (both sides of a door) or a fixed post, lean back with arms straight, then pull your chest toward your hands and squeeze your shoulder blades."],
  ["towel pull-apart","Hold a towel in front of you at shoulder width and pull it apart hard (it won't stretch — it's the tension that works the back). For Y-T-W raises: lie face-down and lift your arms off the floor tracing a Y, then a T, then a W shape, squeezing the upper back each time. Builds the pulling and posture muscles without a bar."],
  ["decline push-up","Push-ups with your feet up on a step or ledge so you're angled head-down. Shifts load to the upper chest and shoulders."],
  ["diamond push-up","Push-ups with your hands close together under your chest (thumbs and index fingers forming a diamond). Hits the triceps."],
  ["side plank","On one forearm, body turned sideways in a straight line, hips lifted and stacked. Hold, then switch sides. Trains the obliques."],
  ["superman","Lie face-down, arms extended ahead. Lift your arms, chest, and legs off the floor together (like flying), hold a moment, lower. Strengthens the lower back."],
  ["plank","Forearms under your shoulders, body in a straight line from head to heels, abs and glutes tight. Hold without letting your hips sag or pike up."],
  ["grip squeeze","Squeeze a grip trainer or a rolled towel hard for the time, then rest and repeat. Builds the grip that carries the Sprint-Drag-Carry."],
  // --- upper / core (gym) ---
  ["pull-up","Hang from a bar (palms away), arms straight, and pull until your chin clears the bar, then lower all the way. Use a band or the lat-pulldown machine if you can't do one yet."],
  ["lat pulldown","Seated at the machine, pull the bar down to your upper chest, squeezing your shoulder blades, then return under control."],
  ["cable / barbell row","Pull a cable handle or barbell toward your stomach, squeezing the shoulder blades, then return under control. Horizontal pulling for the mid-back."],
  ["incline db press","Press dumbbells from your shoulders to straight arms on an inclined bench — upper chest and shoulders."],
  ["face pull","Pull a rope to your face with your elbows high — strengthens the rear shoulders and posture muscles."],
  ["hanging knee raise","Hang from a bar and raise your knees toward your chest, then lower under control. Core."],
  ["back extension","Hinge over a back-extension bench or machine and raise your torso to a straight line, then lower. Loaded lower back."],
  ["farmer's carry","Hold a heavy dumbbell or kettlebell in each hand and walk a set distance, standing tall and braced. Grip, core, and carry strength."],
  // --- AFT circuit ---
  ["shuttle sprint","Sprint to a line ~25m away, touch it, sprint back, and repeat. Mimics the change-of-direction of the Sprint-Drag-Carry without a sled."],
  ["bear crawl","On hands and feet with knees just off the floor, crawl forward keeping your back flat. Replaces the SDC drag — taxes legs, shoulders, and core."],
  ["squat jump","Drop into a squat, explode straight up off the floor, land soft with bent knees, and immediately go into the next one. Explosive leg power."],
  ["200m run","A half-lap of a track at a hard pace — a short conditioning burst."],
  ["sled push","Push or drag a weighted sled the set distance — the closest thing to the real Sprint-Drag-Carry."],
  ["loaded carry","Carry heavy kettlebells or dumbbells a set distance, tall and braced — the carry portion of the SDC."],
  ["box jump","Jump from a squat onto a sturdy box, step back down, and repeat. Explosive power with a target."],
  ["rower 200m","An all-out 200m on the rowing machine — a full-body conditioning burst."],
  // --- mobility / balance ---
  ["world's-greatest","Step into a deep lunge, place both hands inside your front foot, then rotate your torso and reach the inside arm up toward the ceiling. Return, switch legs."],
  ["hamstring stretch","Standing, put one heel out front with the leg straight, toes up; hinge forward at the hips with a flat back until you feel the back of the thigh. Hold, switch."],
  ["hip-flexor stretch","Kneel on one knee with the other foot flat in front. Tuck your hips under and push them gently forward until you feel the front of the kneeling-leg hip. Hold, switch."],
  ["figure-4 glute","Lie on your back, cross one ankle over the opposite knee (a '4'), then pull that opposite thigh toward your chest until you feel the crossed-leg glute. Hold, switch."],
  ["quad stretch","Standing (hold a wall), grab one ankle behind you and pull your heel toward your butt, knees together, hips forward. Hold, switch."],
  ["calf stretch","Hands on a wall, one foot back with the leg straight and heel down — feel the upper calf. Then slightly bend that knee to shift the stretch lower. Hold each, switch."],
  ["doorway chest","Forearm on a door frame, elbow about shoulder height, step through gently until you feel a stretch across the chest and front shoulder. Hold, switch arms."],
  ["thoracic rotation","On hands and knees, hand behind your head, rotate that elbow down toward the opposite arm, then open it up toward the ceiling. Pair with cat-cow to loosen the mid-back."],
  ["single-leg stand","Stand on one leg near a wall. Progress over time: eyes open, then eyes closed, then on a pillow. Hold for the time, then switch legs."],
  ["single-leg hinge reach","Stand on one leg and slowly hinge forward, reaching toward the floor, then stand tall. Slow and controlled — it's a balance drill."],
  ["tandem","Walk a straight line placing the heel of each step directly against the toe of the other foot, like a tightrope. Arms out to balance."],
  ["y-balance","Stand on one leg. With the free foot, reach as far as you can to the front, then the side, then behind you (tracing a Y) without touching down. Return to center between reaches."],
  ["warm-up","5 minutes of easy movement to raise your temperature — jog in place, jumping jacks, or a brisk walk. Don't stretch cold muscles."],
  ["band shoulder","Hold a band wider than shoulder-width and, keeping your arms straight, take it from in front of you up and over your head to behind you, then back. Opens the shoulders."],
  ["foam-roll","Slowly roll the target muscle over a foam roller, pausing on tight spots, to loosen the tissue before stretching."],
];
function exHowto(name){
  const n=String(name||"").toLowerCase();
  const hit=EX_HOWTO.find(([k])=> n.includes(k));
  return hit? hit[1] : "";
}
function planForDay(d){ return WEEK_PLAN[ (d instanceof Date ? d.getDay() : d) ]; }
// For "pick one" sessions (the run), choose which variant to do today, with a sensible rotation.
// Tuesday = the easier/quality midweek run; Saturday = the harder/longer weekend run.
// Every 3rd week, the Saturday slot becomes a timed 2-mile test so progress gets measured.
function pickRunIndex(dateObj){
  const day=dateObj.getDay();
  // Continuous week count since a fixed epoch (a Monday) so the cadence never resets
  // at the New Year. Using local midnight avoids DST drift.
  const EPOCH=Date.UTC(2024,0,1); // Mon Jan 1 2024, an arbitrary stable anchor
  const dayUTC=Date.UTC(dateObj.getFullYear(),dateObj.getMonth(),dateObj.getDate());
  const week=Math.floor((dayUTC-EPOCH)/(7*864e5));
  if(day===6){ // Saturday = harder
    if(week%3===2) return 3;   // timed 2-mile test every 3rd week (continuous cadence)
    return 2;                  // long easy run
  }
  // Tuesday (or any other run slot) = the quality midweek session, alternating intervals/tempo
  return (week%2===0) ? 0 : 1; // intervals on even weeks, tempo on odd
}
// Set/rep prescription per intensity — how to actually run today's exercises, in order.
function prescriptionFor(intensity, ex){
  // returns a short "what to do" string for an exercise given the day's intensity
  const t=ex.type||ex.t;
  if(intensity==="hard"){
    if(t==="reps") return "3–4 sets, leave 1–2 reps in the tank";
    if(t==="time") return "3 sets, push the hold/effort";
    if(t==="dist") return "main effort — see the session note for distance/pace";
  } else if(intensity==="moderate"){
    if(t==="reps") return "2–3 sets, controlled";
    if(t==="time") return "2–3 sets, steady";
    if(t==="dist") return "easy–tempo pace, conversational";
  } else { // easy / recovery / rest
    if(t==="reps") return "1–2 easy sets, focus on form";
    if(t==="time") return "hold as prescribed, relaxed";
    if(t==="dist") return "easy pace only";
  }
  return "as prescribed";
}
// Did the user log a workout on a given Date (local day)?
function workoutOnDay(dateObj){
  const ymd=localYMD(dateObj);
  return (S.workouts||[]).find(w=> (w.ts? localYMD(new Date(w.ts)) : null)===ymd || w.date===dateObj.toLocaleDateString());
}
// Build a structured "today's plan": what session, the ordered exercises with prescriptions,
// and a read on yesterday (what was scheduled vs. what was logged).
function todaysPlan(){
  const now=new Date();
  const dayPlan=planForDay(now);
  const yest=new Date(now); yest.setDate(now.getDate()-1);
  const yPlan=planForDay(yest);
  const yLogged=workoutOnDay(yest);
  const tLogged=workoutOnDay(now);
  return {
    now, dayPlan,
    sessionKey: dayPlan.session,
    exercises: dayPlan.session ? sessionEx(dayPlan.session) : [],
    todayLogged: !!tLogged, todayLog: tLogged,
    yesterday: {
      plan: yPlan,
      wasRest: !yPlan.session,
      logged: !!yLogged,
      log: yLogged,
      // did yesterday's log match what was scheduled?
      onPlan: yLogged && yPlan.session && yLogged.session===yPlan.session,
    }
  };
}
// The areas the cadet can tag a PT session with.
const PT_AREAS = [
  {k:"legs",   label:"Legs / lower body", note:"squats, lunges, ruck, sprints"},
  {k:"push",   label:"Push (chest/shoulders/tris)", note:"push-ups, presses"},
  {k:"pull",   label:"Pull (back/biceps)", note:"pull-ups, rows"},
  {k:"core",   label:"Core", note:"planks, flutter kicks, sit-ups"},
  {k:"cardio", label:"Cardio / conditioning", note:"runs, sprints, circuits"},
];
// Movement keyword library: maps PT exercises (typed in free text) to the areas they load.
// Each entry: regex of synonyms -> {name (canonical), areas[]}. Order roughly specific→general.
const PT_MOVES = [
  {re:/\b(2[\s-]?mile|two[\s-]?mile|distance run|long run|formation run|ability group run|agr)\b/i, name:"distance run", areas:["cardio","legs"]},
  {re:/\b(sprint|interval|gasser|shuttle|suicides?|wind ?sprints?|200m|400m|hill repeats?)\b/i, name:"sprints/intervals", areas:["cardio","legs"]},
  {re:/\b(run|ruck|march|road march|jog)\b/i, name:"run/ruck", areas:["cardio","legs"]},
  {re:/\b(lunge|walking lunge|reverse lunge|step[\s-]?up)/i, name:"lunges", areas:["legs"]},
  {re:/\b(squat|air squat|jump squat|squat jump|wall sit|pistol)/i, name:"squats", areas:["legs"]},
  {re:/\b(deadlift|rdl|hinge|kettlebell swing|kb swing)/i, name:"deadlift/hinge", areas:["legs","pull","core"]},
  {re:/\b(jug carry|jug carries|water jug|farmer'?s? carr|sandbag carr|\bcarry\b|\bcarries\b|sdc|sprint[\s-]?drag[\s-]?carry)/i, name:"loaded carries", areas:["legs","core","pull"]},
  {re:/\b(box jump|broad jump|burpee|bound|plyo)/i, name:"plyometrics", areas:["legs","cardio","core"]},
  {re:/\b(push[\s-]?up|hand[\s-]?release|hrp|diamond push|pike push|incline push|decline push)/i, name:"push-ups", areas:["push","core"]},
  {re:/\b(bench|overhead press|ohp|shoulder press|\bdip|press)/i, name:"presses", areas:["push"]},
  {re:/\b(pull[\s-]?up|chin[\s-]?up|inverted row|\brow|lat pull)/i, name:"pulls/rows", areas:["pull"]},
  {re:/\b(plank|hollow|flutter|leg raise|sit[\s-]?up|crunch|v[\s-]?up|russian twist|mountain climber|toe touch|superman|back extension)/i, name:"core work", areas:["core"]},
  {re:/\b(jumping jack|sprawl|bear crawl|crawl|circuit|wod|metcon|conditioning|jump rope)/i, name:"conditioning", areas:["cardio","core","legs"]},
  {re:/\b(yoga|stretch|mobility|recovery|foam roll|cooldown|warm[\s-]?up)\b/i, name:"mobility", areas:[]},
];
// Parse free text -> {moves:[{name,areas}], areas[]}
function parsePT(text){
  const found=[], areas=new Set();
  const haveRun = /\b(2[\s-]?mile|two[\s-]?mile|distance run|long run|formation run|ability group run|agr|sprint|interval|gasser|shuttle|suicides?|wind ?sprints?|200m|400m|hill repeats?)\b/i.test(text);
  PT_MOVES.forEach(m=>{
    // skip the generic "run/ruck" if a more specific run/sprint already matched (avoids duplicate tag)
    if(m.name==="run/ruck" && haveRun) return;
    if(m.re.test(text)){ found.push({name:m.name,areas:m.areas}); m.areas.forEach(a=>areas.add(a)); }
  });
  return {moves:found, areas:[...areas]};
}
// ===== Adaptive training: missed-session tracking =====
// Scans the past 7 days, records any scheduled session that had no matching workout.
// Deduplicates — safe to call on every render. Trims to last 28 days automatically.
function trackMissedSessions(){
  if(!S.missedTraining) S.missedTraining=[];
  const now=new Date();
  for(let i=1;i<=7;i++){
    const d=new Date(now); d.setDate(now.getDate()-i);
    const plan=planForDay(d);
    if(!plan||!plan.session) continue;
    const dayStr=localYMD(d);
    if(S.missedTraining.some(m=>m.date===dayStr)) continue;
    if(!workoutOnDay(d)) S.missedTraining.push({date:dayStr, session:plan.session});
  }
  const cutoff=localYMD(new Date(now.getTime()-28*864e5));
  S.missedTraining=S.missedTraining.filter(m=>m.date>=cutoff);
}

// Sessions missed in the past N days (most-recent first).
function recentMissed(days){
  if(!S.missedTraining) return [];
  const cutoff=localYMD(new Date(Date.now()-days*864e5));
  return S.missedTraining.filter(m=>m.date>=cutoff).slice().reverse();
}

// Short coaching paragraph based on recent missed sessions.
function getAdaptiveNote(){
  const missed=recentMissed(7);
  if(!missed.length) return null;
  const names=[...new Set(missed.map(m=>(SESSIONS[m.session]?SESSIONS[m.session].name.split("·").slice(-1)[0].trim():"a session")))];
  if(missed.length===1){
    return `You missed ${names[0]} last week. Don't double up to compensate — just don't let it happen twice in a row. One missed session means nothing; a habit of skipping one type of work shows up in your score.`;
  }
  return `Last week you missed ${names.join(" and ")} (${missed.length} session${missed.length!==1?'s':''}). The plan keeps rolling — don't try to cram missed work in. Pick back up from today and hit the sessions you tend to skip hardest next week.`;
}

// How many training sessions have been completed vs scheduled this week (Mon–Sun).
function weekTrainingStats(){
  const now=new Date();
  const dFromMon=(now.getDay()+6)%7;
  const mon=new Date(now); mon.setDate(now.getDate()-dFromMon); mon.setHours(0,0,0,0);
  let sched=0,done=0;
  for(let i=0;i<7;i++){
    const d=new Date(mon); d.setDate(mon.getDate()+i);
    const plan=planForDay(d);
    if(!plan||!plan.session) continue;
    sched++;
    const dayEnd=new Date(d); dayEnd.setHours(23,59,59,999);
    if(dayEnd<=now && workoutOnDay(d)) done++;
  }
  return {done,sched};
}

// Monthly baseline = one max-effort set per key movement. These map to AFT
// events + the plan's core lifts so the updater can re-anchor each month.
const BASELINE_TEST = [
  {key:"max_pushups", name:"Max hand-release push-ups (2 min)", type:"reps", aft:"hrp"},
  {key:"max_plank",   name:"Max plank hold", type:"time", aft:"plank"},
  {key:"max_deadlift",name:"3-rep max deadlift (lbs)", type:"reps", w:true, aft:"dl"},
  {key:"max_pullups", name:"Max pull-ups (one set)", type:"reps"},
  {key:"max_squat",   name:"Max bodyweight squats (2 min)", type:"reps"},
  {key:"run_2mi",     name:"Timed 2-mile run", type:"dist", aft:"run", lowerBetter:true},
  {key:"sdc_sim",     name:"Sprint-Drag-Carry sim (time)", type:"time", aft:"sdc", lowerBetter:true},
];
