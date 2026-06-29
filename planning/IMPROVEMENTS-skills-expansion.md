# Operations — Comprehensive Skills Expansion

This document is dedicated entirely to new skills. Every skill listed here is a genuine gap in the current tree — things an Army ROTC cadet, CS/Cyber student, and functional adult could verifiably level up in. No feature requests, no UI work, only skills.

**Implementation notes (apply to every entry):**
- Add each skill to `SEED_SKILLS` in `src/core/skills-data.js`
- Include full `advance[]`, `maintain[]`, `roadmap[]` arrays matching ladder length
- Include `tiers[]` with `upTo` aligned to ladder length
- Bump `SKILL_LADDER_VER` in `src/core/migration.js` for every batch
- Add career-stage `targets:{MS1,MS2,MS3,LDAC,MS4,commission,O1}` to skills relevant to ROTC

---

## PATH OF WAR — `tactical`

**Already exists:** Land navigation, Marksmanship (M4), Tactical movement, Troop leading procedures, Radio communications, First aid / TCCC, Fieldcraft & survival

---

### T1 — Marksmanship (M17 / pistol)
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 180`

**Why:** The M17 is the standard Army sidearm. Pistol marksmanship is its own motor program — grip, trigger control, and draw stroke differ significantly from rifle work. Officer-specific qual events use it.

**Ladder (7 levels):**
1. Know M17 nomenclature, clearing procedures, and safety rules; observe a range
2. Safely load/unload/clear; achieve any grouping at 25m on paper
3. Qualify on the M17 Record Fire (score ≥30/40); consistent grip and trigger press
4. Qualify Expert (≥36/40); controlled pairs, consistent 25m groups ≤4"
5. Reload under 3 seconds; engage 2 targets 2 rounds each within 5 seconds at 10m
6. Low-light qualification; shoot-house walkthrough with holster draw
7. Taught/evaluated at least 2 Soldiers on M17 fundamentals; scored as evaluator

**Tiers:** Familiar (1–2) / Qualified (3–4) / Proficient (5–6) / Instructor (7)

---

### T2 — CBRN / NBC awareness
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 180`

**Why:** Chemical, biological, radiological, and nuclear threats are part of every wartime environment. ROTC dedicates lab time to MOPP levels and detection. A verifiable skill ladder reflects that.

**Ladder (8 levels):**
1. Name the four CBRN threat categories and explain why each matters tactically
2. Don MOPP 4 in under 8 minutes; explain MOPP level decision criteria
3. Use M8/M9 paper and M256A1 kit correctly; identify positive read result
4. Conduct a hasty decontamination procedure; brief a 5-line CBRN report
5. Plan a unit CBRN defense posture for a given threat environment
6. Conduct collective protection planning; use CBRN overlay on a map
7. Write a CBRN risk assessment for a training scenario; brief the commander
8. Evaluate a unit's CBRN readiness; identify and correct 3+ common deficiencies

**Tiers:** Aware (1–2) / User (3–4) / Planner (5–6) / Evaluator (7–8)

---

### T3 — Grenade employment
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 365`

**Why:** Fragmentation grenade throwing is a required Warrior Task. Technique, safety radius, and employment fundamentals are all verifiable.

**Ladder (6 levels):**
1. Name the types (frag, smoke, flash), describe construction and safety
2. Execute a dry-run throw with correct stance, grip, and arming sequence
3. Throw training grenades to within 5m of target at 25m; clear range procedures
4. Throw to within 3m of target consistently; explain employment principles (dead ground, masked effects)
5. Plan smoke / grenade use in a fire and movement element scenario
6. Evaluated as trainer/safety on a live frag range or field exercise; all subordinates pass

**Tiers:** Aware (1) / Trainee (2–3) / Proficient (4–5) / Certifier (6)

---

### T4 — Military law & ROE
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 180`

**Why:** Officers are legally responsible for their Soldiers' actions. Understanding UCMJ, law of armed conflict, and rules of engagement is a career-long requirement with verifiable knowledge milestones.

**Ladder (8 levels):**
1. Explain what the UCMJ is, who it covers, and the difference between Article 15 and court-martial
2. Identify the five punitive Articles most relevant to junior leaders (91, 92, 107, 128, 134)
3. Explain the law of armed conflict principles (distinction, proportionality, military necessity, humanity)
4. Apply ROE cards correctly to two contrasting OPFOR scenarios; explain your reasoning
5. Write a legal summary of a hypothetical Soldier misconduct case; identify applicable Articles
6. Brief your platoon on ROE before a field exercise; answer 5 scenario questions without notes
7. Advise a notional commander on a detainee handling situation citing LOAC and AR 190-8
8. Write a ROE annex for a training OPORD; evaluated by JAG or senior cadre

**Tiers:** Aware (1–2) / Familiar (3–4) / Practitioner (5–6) / Advisor (7–8)

---

### T5 — Battle drills
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 90`

**Why:** The Army's 8 Battle Drills are the muscle memory of small-unit tactics. Each has a precise sequence that must be internalized to execute under stress.

**Ladder (8 levels):**
1. Name all 8 battle drills and the order of execution for each
2. Execute BD1 (React to Direct Fire) as a team member without prompting
3. Execute BD2 (React to Indirect Fire) and BD3 (Break Contact) correctly as TL
4. Execute BD5 (Knock Out a Bunker) and BD6 (React to Ambush) as SL
5. Execute BD7 (Enter and Clear a Room) IAW MOUT fundamentals
6. Run a full sequence (1–8) walkthrough with your element at full speed without error
7. Evaluate subordinate leaders running battle drills; write a structured AAR
8. Design and run a battle drill training lane for 10+ Soldiers; cadre-evaluated

**Tiers:** Aware (1) / Member (2–3) / Team/Squad Leader (4–5) / Evaluator (6–8)

---

### T6 — SALUTE / spot reporting
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 90`

**Why:** Intelligence reporting — SALUTE format, SPOTREP, size/activity/location/unit/time/equipment — is a core Soldier Task and a common ROTC lab assessment.

**Ladder (6 levels):**
1. Recite SALUTE from memory; explain each element with examples
2. Complete a SALUTE report from a scenario description within 60 seconds
3. Submit a SPOTREP (SALUTE + grid) verbally over radio using correct format
4. Compile 3 SPOTREPs into a patrol debrief for an S2; fill a spot report form
5. Brief pattern-of-life analysis from 5 SPOTREPs over 48 hours
6. Train a squad on SALUTE reporting; evaluate their submissions during a FTX

**Tiers:** Know it (1–2) / Use it (3–4) / Analyze it (5) / Teach it (6)

---

### T7 — Rappelling & vertical movement
`cat: "tactical"`, `parent: "Soldier tasks"`, `fadeDays: 365`

**Why:** Rappelling is taught at most ROTC programs and at LDAC. Proficiency on the tower and the ability to rig a system are verifiable.

**Ladder (6 levels):**
1. Name the equipment (harness, ATC, carabiner, anchor), identify load-bearing components
2. Don harness correctly and pass an equipment check; explain anchor points
3. Complete a 15m rappel from a training tower under supervision
4. Complete a 30m+ rappel with self-belay; complete rappel in under 3 minutes
5. Rig a simple anchor system from available materials; test before use
6. Belay and evaluate 2+ Soldiers rappelling; serve as tower NCO or assistant

**Tiers:** Aware (1) / Student (2–3) / Proficient (4–5) / Rigger (6)

---

### T8 — Operational planning (MDMP)
`cat: "leadership"`, `fadeDays: 90`

**Why:** The Military Decision Making Process is the Army's formal planning methodology and the dominant cognitive tool for company-grade officers. It's heavily tested at LDAC and in MSL courses.

**Ladder (9 levels):**
1. Name the 7 steps of MDMP and the product of each step
2. Write a Mission Analysis given an OPORD; produce CCIR, PIR, and restated mission
3. Develop 2 COAs that meet all 5 COA criteria; brief them to a notional commander
4. Wargame COA 1 vs. COA 2 using a sync matrix; identify decision points
5. Write a full OPORD (5 paragraphs, all annexes complete) for a platoon operation
6. Brief an OPORD to a 10+ person audience with Q&A; no critical errors
7. Facilitate MDMP for a team as S3; manage time, resolve conflicts between staff
8. Run a complete MDMP from receipt of mission to OPORD in under 6 hours
9. Evaluated as MDMP facilitator/evaluator at a course or FTX; zero critical deficiencies

**Tiers:** Aware (1) / Analyst (2–3) / Planner (4–6) / Staff Officer (7–9)

---

## PATH OF THE BODY — `physical`

**Already exists:** All major PT events, CQC sub-skills, swimming, flexibility, balance, fitness programming

---

### P1 — Combat water survival
`cat: "physical"`, `parent: "Endurance"`, `fadeDays: 180`

**Why:** Combat Water Survival Test (CWST) is an Army requirement. Jumping in full uniform, swimming in BDUs, and equipment recovery are distinct from open-water swimming and must be practiced.

**Ladder (7 levels):**
1. Swim 15m in uniform (PT gear / shorts) without stopping
2. Complete a basic water safety briefing; jump entry from 1m platform
3. Swim 15m in ACU top and boots; cross-chest carry for 5m
4. Complete a CWST equivalent (drop-in uniform, swim 15m, exit without help)
5. Complete CWST with LBE and rifle (simulation); stay afloat 1 minute
6. Buddy-tow a person in uniform 10m; execute controlled pool exit
7. Serve as water safety NCO or aid swimmer in a unit CWST administration

**Tiers:** Survival (1–2) / Basic (3–4) / CWST Qualified (5–6) / Evaluator (7)

---

### P2 — Obstacle course
`cat: "physical"`, `parent: "Endurance"`, `fadeDays: 90`

**Why:** ROTC labs, LDAC, and field exercises all feature obstacle courses. The combination of climbing, swinging, and crawling under load is not captured by any existing skill.

**Ladder (6 levels):**
1. Complete a basic course (low crawl, log walk, rope cross) without time pressure
2. Complete all obstacles on a standard ROTC course without failing any element
3. Complete the course in under 20 minutes; no skips
4. Complete the course under 15 minutes with a 35lb ruck
5. Complete 2 laps of the course in under 35 minutes
6. Lead and evaluate a squad through the course as the lane grader; debrief AAR

**Tiers:** Beginner (1–2) / Competent (3–4) / Fit (5) / Evaluator (6)

---

### P3 — Loaded carries
Already in tree — skip.

### P4 — Cycling (cross-training)
`cat: "physical"`, `parent: "Endurance"`, `fadeDays: 60`

**Why:** Low-impact aerobic cross-training used during injury recovery and as a VO2max builder. Measurable and progressive.

**Ladder (6 levels):**
1. Ride 30 minutes at moderate effort; explain cadence and gear use
2. Complete a 1-hour ride at Zone 2 effort; maintain 80–90 RPM cadence
3. Complete a 20-mile ride in under 80 minutes (flat, outdoor or stationary equivalent)
4. Complete a 40-mile ride in a single session; average HR in Zone 3
5. 20-mile time trial under 60 minutes; hold power/effort consistently
6. Complete a century (100 miles) in a single day; documented effort log

**Tiers:** Active (1–2) / Fit (3–4) / Trained (5) / Endurance Athlete (6)

---

### P5 — Gymnastics / bodyweight skills
`cat: "physical"`, `parent: "Strength"`, `fadeDays: 60`

**Why:** Handstands, muscle-ups, L-sits, and similar skills require systematic progressive training. They are direct measures of strength-to-weight ratio and motor control that complement the current strength tree.

**Ladder (8 levels):**
1. Hold a wall handstand for 10 seconds; perform 5 strict dips
2. Free handstand 5 seconds; L-sit 3 seconds; 1 strict muscle-up attempt
3. Free handstand 15 seconds; L-sit 10 seconds; 1 clean muscle-up
4. Handstand walk 3 steps; L-sit 20 seconds; 3 muscle-ups unbroken
5. Handstand walk 5m; L-sit 30 seconds; 5 muscle-ups
6. Handstand hold 60 seconds; L-sit 45 seconds; 10 muscle-ups; chest-to-bar pull-up
7. Handstand press from floor (straddle or tuck); ring muscle-up; 15 consecutive L-sit dips
8. Full straddle press to handstand; free-standing ring support 30 seconds; 3 ring muscle-ups

**Tiers:** Foundation (1–2) / Developing (3–4) / Intermediate (5–6) / Advanced (7–8)

---

## PATH OF THE MIND — `cognitive`

**Already exists:** Speed skills (reaction, processing, typing, reading), memory (working mem, span, technique, retention), reasoning (focus, mental math, pattern recognition)

---

### C1 — Critical thinking
`cat: "cognitive"`, `parent: "Reasoning"`, `fadeDays: 60`

**Why:** Identifying logical fallacies, evaluating arguments, and distinguishing evidence from assertion is a core academic and military competency. Measurable via structured exercises.

**Ladder (8 levels):**
1. Name and define 10 common logical fallacies with one example each
2. Identify the fallacy in 10/10 constructed examples without notes
3. Evaluate a written argument: identify premises, conclusion, and one weak point
4. Write a counter-argument that addresses the strongest version of an opposing claim (steelmanning)
5. Analyze a military or policy decision: identify assumptions, identify what evidence would change the conclusion
6. Facilitate a structured argument session: moderate two sides, summarize both fairly
7. Write a 3-page analysis of a complex issue with explicitly identified assumptions and alternative conclusions
8. Evaluated externally (course grade, peer evaluation, grader feedback) as a strong critical thinker

**Tiers:** Aware (1–2) / Practitioner (3–4) / Analyst (5–6) / Evaluator (7–8)

---

### C2 — Decision science
`cat: "cognitive"`, `parent: "Reasoning"`, `fadeDays: 90`

**Why:** Cognitive bias awareness, probabilistic thinking, and structured decision methods are distinct from general critical thinking. They apply directly to MDMP, leadership, and life choices.

**Ladder (7 levels):**
1. Name 10 cognitive biases; give a military example for each
2. Identify which bias is operating in 10 real-world scenario descriptions
3. Apply Bayes' theorem to a simple probability update scenario with correct arithmetic
4. Use a decision matrix (weighted criteria) to pick between 3 COAs; document your logic
5. Run a pre-mortem on a plan you're about to execute; identify 3 failure modes
6. Keep a decision journal for 30 days: log decision, reasoning, outcome, and bias review
7. Teach a 30-minute block on cognitive bias to a group; field 5+ scenario questions

**Tiers:** Aware (1–2) / Applying (3–4) / Systematic (5–6) / Teacher (7)

---

### C3 — Spatial reasoning
`cat: "cognitive"`, `parent: "Reasoning"`, `fadeDays: 60`

**Why:** 3D spatial visualization — reading contour lines, mentally rotating objects, estimating distance and bearing — is directly tied to land navigation performance and engineering-track courses.

**Ladder (7 levels):**
1. Complete a standard mental rotation test (Shepard-Metzler type) at 60th percentile
2. Correctly read 10/10 contour map cross-sections (ridge vs. draw vs. saddle)
3. Sketch a terrain profile from a map cross-section to within 20% of actual slope
4. Complete spatial visualization tasks at 75th percentile on a standardized test
5. Navigate to 3 points using terrain association only (no compass) in daylight
6. Interpret an oblique aerial photo and identify 5 terrain features with correct map overlay
7. Complete a spatial test at 90th+ percentile; explain your mental rotation strategy

**Tiers:** Basic (1–2) / Developing (3–4) / Proficient (5–6) / Advanced (7)

---

## PATH OF VITALITY — `physiological`

**Already exists:** Resting heart rate, grip strength, sleep discipline, nutrition

---

### V1 — Recovery tracking
`cat: "physiological"`, `fadeDays: 30`

**Why:** HRV (heart rate variability), perceived recovery score, and soreness journaling are evidence-based inputs to training load management. A dedicated ladder makes this a first-class metric.

**Ladder (6 levels):**
1. Log perceived recovery (1–10) every morning for 7 consecutive days
2. Log recovery for 30 days; identify your 3 worst recovery triggers
3. Track at least one objective marker (waking HR, HRV if available) for 30 days alongside perceived recovery
4. Correlate training load with recovery score over a 4-week cycle; write a 1-page summary
5. Adjust training automatically based on recovery score for 2+ weeks; document decision rules
6. Use recovery data to peak for a performance event (AFT, run, field exercise); document the cycle

**Tiers:** Logging (1–2) / Tracking (3–4) / Applying (5–6)

---

### V2 — Injury prevention & prehab
`cat: "physiological"`, `fadeDays: 45`

**Why:** Stress fractures and shin splints end ROTC careers. Proactive prehab — calf raises, hip flexor work, ankle stability — is its own learnable protocol with clear measurable levels.

**Ladder (7 levels):**
1. Name the 5 most common Army training injuries and their primary cause
2. Perform a full lower-body prehab sequence (3 exercises × 15 reps) without coaching
3. Complete a 4-week prehab program consistently; log completion daily
4. Identify and correct a mobility or stability deficit in your own movement screen
5. Complete a 90-day run ramp-up program without incurring an overuse injury
6. Design a 4-week prehab program for yourself based on personal injury history
7. Screen a peer's movement patterns and prescribe 3 corrective exercises with rationale

**Tiers:** Aware (1) / Consistent (2–3) / Self-directed (4–5) / Coach (6–7)

---

### V3 — Vision training
`cat: "physiological"`, `fadeDays: 90`

**Why:** Peripheral awareness, tracking speed, and focal switching are trainable visual skills that affect marksmanship, driving, and sports performance.

**Ladder (6 levels):**
1. Complete a basic eye tracking test; baseline peripheral field measurement
2. Complete a 2-week eye tracking exercise program (smooth pursuit, saccades, focus switching)
3. Improve tracked target accuracy by ≥20% on a standard tracking task vs. baseline
4. Complete a peripheral vision exercise program; correctly identify 80% of peripheral flashes in a reaction test
5. Complete a 60-day visual training program; document any marksmanship or reaction speed improvement
6. Sustain a 6-month practice log; achieve 90th+ percentile on a validated visual tracking assessment

**Tiers:** Baseline (1) / Training (2–3) / Improving (4–5) / Advanced (6)

---

## PATH OF THE CRAFT — `technical`

**Already exists:** Linux / command line, Networking, Python, Cybersecurity fundamentals, Java, JavaScript

This is the largest gap section for a Cyber branch officer.

---

### TC1 — Version control (Git)
`cat: "technical"`, `fadeDays: 30`

**Why:** Git is the universal baseline for software development. Branching strategy, conflict resolution, and collaborative workflows are all concrete, testable competencies.

**Ladder (8 levels):**
1. Initialize a repo; stage, commit, and push a file; explain the working tree / staging area / history model
2. Create and switch branches; merge a branch with no conflicts; understand fast-forward vs. 3-way merge
3. Resolve a merge conflict manually; use `git rebase` to linearize history
4. Use `git bisect` to find a regression; use `git stash` and `git cherry-pick` fluently
5. Design a branching strategy (Gitflow or trunk-based) and explain tradeoffs; set up branch protection
6. Review a pull request: identify logic errors, suggest improvements, merge cleanly
7. Recover a corrupt or broken repo state; restore lost commits via reflog
8. Set up a CI pipeline that runs tests on every pull request using GitHub Actions or similar

**Tiers:** User (1–2) / Developer (3–4) / Lead (5–6) / Platform Engineer (7–8)

---

### TC2 — SQL & databases
`cat: "technical"`, `fadeDays: 45`

**Why:** Every data-driven system runs on a database. SQL is the most durable technical skill in CS after programming fundamentals. Essential for Cyber, backend development, and data analysis.

**Ladder (9 levels):**
1. Write a SELECT with WHERE and ORDER BY; understand tables, rows, and columns
2. Use JOIN (INNER, LEFT) to query across two related tables; explain NULL handling
3. Write GROUP BY + aggregate queries (COUNT, SUM, AVG); use subqueries
4. Design a normalized schema (3NF) for a 5-entity system; explain primary/foreign keys
5. Write a complex multi-join query with CTEs or window functions (ROW_NUMBER, LAG)
6. Create and explain an index; use EXPLAIN ANALYZE to diagnose a slow query
7. Design and implement a database migration without data loss on a live table
8. Write stored procedures and triggers; explain transaction isolation levels
9. Design a sharded or replicated database architecture; document tradeoffs at scale

**Tiers:** Beginner (1–2) / Practitioner (3–4) / Developer (5–6) / Engineer (7–8) / Architect (9)

---

### TC3 — Bash / shell scripting
`cat: "technical"`, `parent: "Linux / command line"`, `fadeDays: 45`

**Why:** Bash is the glue of Unix systems work. Automation, log parsing, deploy scripts, and cron jobs all require fluent scripting. Distinct from interactive CLI use.

**Ladder (8 levels):**
1. Write a script with variables, echo, and a conditional (if/else); run it from terminal
2. Use loops (for, while), read user input, and handle exit codes ($?)
3. Use pipes, redirections, xargs, and process substitution in a real task
4. Write a script that parses a log file and outputs a summary (grep, awk, sed)
5. Write a parameterized, idempotent deployment or setup script with error handling
6. Use cron to schedule a script; explain crontab syntax and failure detection
7. Write a script suite (multiple files, shared lib, help flags, --dry-run mode) for a real task
8. Profile and optimize a bash pipeline that processes 100k+ line files in under 5 seconds

**Tiers:** Beginner (1–2) / Scripting (3–4) / Automator (5–6) / Systems Engineer (7–8)

---

### TC4 — Cloud computing
`cat: "technical"`, `fadeDays: 60`

**Why:** DoD moves to cloud (JWCC, AWS GovCloud, Azure IL5). Cyber officers are expected to understand cloud architecture. AWS/Azure fundamentals are verifiable via certs.

**Ladder (9 levels):**
1. Explain IaaS/PaaS/SaaS; name 5 services from any major cloud provider and their purpose
2. Create a VM, configure a security group, and SSH in; understand billing basics
3. Host a static website on S3/Blob Storage with HTTPS; set up IAM roles correctly
4. Deploy a containerized app with auto-scaling; understand load balancers and health checks
5. Design a 3-tier architecture (web / app / db) with HA and disaster recovery on one cloud provider
6. Pass AWS Cloud Practitioner or AZ-900 (or equivalent entry-level cert)
7. Pass AWS Solutions Architect Associate or AZ-104 (or equivalent associate cert)
8. Implement cloud security controls: encryption at rest/transit, secrets management, audit logging
9. Pass an advanced cert (AWS Security Specialty, AZ-500) or design a multi-region resilient architecture

**Tiers:** Aware (1) / User (2–3) / Developer (4–5) / Certified (6–7) / Security Engineer (8–9)

---

### TC5 — Data structures & algorithms
`cat: "technical"`, `fadeDays: 45`

**Why:** DSA is the foundation of CS hiring interviews, computer science coursework, and performance-critical code. It's taught in every CS curriculum and has clear, universally recognized benchmarks.

**Ladder (10 levels):**
1. Implement array, stack, queue, and linked list; explain time/space complexity of basic operations
2. Implement binary search; explain O(log n) vs O(n) with a concrete example
3. Implement merge sort and quicksort; explain recurrence relations
4. Implement a binary search tree (insert, search, delete); explain BST invariant
5. Implement a hash table with separate chaining; explain load factor and collision resolution
6. Implement BFS and DFS on a graph; identify when to use each
7. Solve a dynamic programming problem from scratch (Knapsack, LCS, or edit distance)
8. Solve 50 LeetCode medium problems with correct solutions and time/space analysis
9. Solve LeetCode hard problems across 3+ categories; can optimize beyond brute force
10. Whiteboard a novel algorithm problem in under 30 minutes with correct solution and full complexity analysis

**Tiers:** Foundation (1–2) / Competent (3–5) / Proficient (6–7) / Advanced (8–9) / Expert (10)

---

### TC6 — Systems programming (C / C++)
`cat: "technical"`, `fadeDays: 60`

**Why:** Memory management, pointers, and low-level systems work are essential for Cyber (reverse engineering, exploit analysis) and for understanding how software actually runs. C is the language of the OS.

**Ladder (9 levels):**
1. Write a C program that reads input, computes a result, and prints it; compile with gcc
2. Use pointers, pointer arithmetic, and dynamic memory (malloc/free) without leaks
3. Implement a linked list, stack, and binary tree in C using struct and pointer manipulation
4. Debug a segfault and a memory leak using valgrind; explain buffer overflows
5. Write a program using POSIX sockets for a basic client/server echo application
6. Use threads (pthreads or std::thread) and a mutex; identify and fix a race condition
7. Implement a simple interpreter or compiler (tokenizer + parser for a toy language)
8. Write a kernel module or OS-level hook (Linux loadable module or Windows driver concept)
9. Read and explain a CVE involving a C buffer overflow or use-after-free; write a proof-of-concept

**Tiers:** Beginner (1–2) / Developer (3–4) / Systems (5–6) / Advanced (7–8) / Security Researcher (9)

---

### TC7 — Web application development
`cat: "technical"`, `fadeDays: 45`

**Why:** Web dev is the entry point for most Cyber attack surface work (OWASP Top 10 requires building before breaking) and produces deployable tools. HTML/CSS/React has a clear ladder.

**Ladder (9 levels):**
1. Write a semantic HTML page with CSS styling; explain box model and specificity
2. Make a page interactive with JavaScript DOM manipulation; handle 3+ event types
3. Consume a public API with fetch(); display data dynamically; handle errors gracefully
4. Build a multi-page SPA using React (or similar framework); use state and props correctly
5. Build a REST API backend (Node/Express, Python/Flask, or similar); handle CRUD operations
6. Add authentication (JWT or session-based) to a full-stack app; protect routes correctly
7. Deploy a full-stack app to a cloud provider with HTTPS, a real domain, and persistent storage
8. Write integration tests for your API; set up a CI pipeline that runs them on each commit
9. A deployed web tool is used by ≥5 people outside yourself for 6+ months without major defects

**Tiers:** Static (1–2) / Dynamic (3–4) / Full-Stack (5–6) / Production (7–8) / Proven (9)

---

### TC8 — Penetration testing methodology
`cat: "technical"`, `fadeDays: 45`

**Why:** Different from Cybersecurity fundamentals (which is defensive/conceptual). Pen testing is a structured offensive methodology: reconnaissance, scanning, exploitation, post-exploitation, reporting. Core 17A Cyber skill.

**Ladder (9 levels):**
1. Explain the 5 phases of a penetration test and what happens in each; name 5 pen testing tools
2. Run a Nmap scan; enumerate open ports, services, and OS on a lab machine
3. Use Metasploit to exploit a known vulnerability on a deliberately vulnerable machine (HackTheBox / TryHackMe)
4. Enumerate a web application manually: identify login, forms, parameters, and map attack surface
5. Exploit a web vulnerability (SQLi, XSS, or IDOR) on a legal lab target; document steps
6. Complete a full lab-based penetration test: recon → foothold → privilege escalation → persistence → clean up → report
7. Pass eJPT, PNPT, or complete 10 HackTheBox machines rated Easy–Medium
8. Conduct a scoped penetration test for a real organization (authorized); deliver a professional report
9. Pass OSCP; demonstrate exploitation of 4+ unique vulnerability classes in an exam environment

**Tiers:** Aware (1) / Scanner (2–3) / Exploiter (4–5) / Tester (6–7) / Certified (8) / OSCP (9)

---

### TC9 — Digital forensics & incident response
`cat: "technical"`, `fadeDays: 60`

**Why:** DFIR is a core 17A / 255A function. Chain of custody, disk imaging, memory forensics, and log analysis are all verifiable and tied to DoD certification pathways (GCFE, GCFA).

**Ladder (9 levels):**
1. Explain chain of custody; describe the difference between live and dead forensics
2. Use FTK Imager or dd to acquire a forensic disk image; verify hash integrity
3. Use Autopsy or Sleuth Kit to browse a disk image; recover deleted files
4. Analyze Windows event logs (Security, System, Application) for signs of compromise
5. Perform memory forensics with Volatility: extract process list, network connections, injected code
6. Write an incident response report documenting a simulated breach: timeline, artifacts, impact, remediation
7. Complete a DFIR CTF challenge or HackTheBox Forensics category (5+ challenges)
8. Lead a tabletop incident response exercise; present findings to a mock leadership audience
9. Pass GCFE or equivalent forensics certification; or lead a real authorized DFIR engagement

**Tiers:** Aware (1) / Technician (2–3) / Analyst (4–5) / Investigator (6–7) / Certified (8–9)

---

### TC10 — Malware analysis
`cat: "technical"`, `fadeDays: 60`

**Why:** Understanding malware behavior — static signatures, dynamic execution, unpacking — is essential for threat intelligence and Cyber defense roles. Directly relevant to 17A and 255S pathways.

**Ladder (8 levels):**
1. Explain the difference between static and dynamic analysis; name 5 common malware families and their behavior
2. Perform basic static analysis: file hashing, strings extraction, PE header inspection with PEStudio or similar
3. Run a sample in a sandboxed VM (Cuckoo or Any.run); document behavioral IOCs
4. Use IDA Free or Ghidra to open a binary; identify the main() function and trace 2 code paths
5. Unpack a simple UPX-packed binary; explain the unpacking stubs
6. Analyze a real-world malware sample (from MalwareBazaar or similar) end-to-end; write a threat report
7. Identify C2 communication patterns in a PCAP taken during dynamic analysis; extract indicators
8. Reverse-engineer an obfuscated script or binary well enough to write a YARA rule that detects it

**Tiers:** Aware (1) / Static (2–3) / Dynamic (4–5) / Reverse Engineering (6–7) / Analyst (8)

---

### TC11 — Cryptography (applied)
`cat: "technical"`, `fadeDays: 90`

**Why:** Cryptography is the foundation of network security, authentication, and secure communications — all core to Cyber. Practical understanding (not just theory) is measurable.

**Ladder (8 levels):**
1. Explain symmetric vs. asymmetric encryption with correct key management description; name AES, RSA, ECC
2. Encrypt and decrypt a file with GPG; sign a document and verify the signature
3. Generate a TLS certificate; explain the handshake and certificate chain validation
4. Implement AES-CBC and AES-GCM in Python; explain why GCM is preferred for authenticated encryption
5. Solve 5 CryptoPals challenges (sets 1–2); implement CBC padding oracle attack
6. Explain hash functions (SHA-256), HMAC, and rainbow tables; crack a weak hash from a wordlist
7. Solve CryptoPals sets 3–4; implement a timing attack on a vulnerable MAC comparison
8. Design a key management scheme for a multi-party application; explain forward secrecy and its implementation

**Tiers:** Aware (1) / User (2–3) / Developer (4–5) / Analyst (6–7) / Designer (8)

---

### TC12 — Network defense / blue team
`cat: "technical"`, `fadeDays: 45`

**Why:** Distinct from Cybersecurity fundamentals (which covers the broad field). Blue team work — SIEM, log analysis, threat hunting, SOC ops — is a specific, learnable discipline with concrete tools and procedures.

**Ladder (9 levels):**
1. Explain the SOC tier model; name 5 common SIEM platforms; describe what a SIEM ingests
2. Create detection rules in a SIEM (Splunk, Elastic, or similar) based on MITRE ATT&CK techniques
3. Analyze a provided PCAP with Wireshark; identify the attack type, source, and target
4. Hunt for evidence of lateral movement in Windows event logs; write a hunt hypothesis and document findings
5. Build a detection lab (SIEM + endpoint agent + simulated attack); generate and tune alerts
6. Complete a BlueTeamLabs or CyberDefenders challenge; document your methodology
7. Write a threat intelligence report for an APT based on open-source data; include IOCs and MITRE mapping
8. Design a detection and response playbook for a specific attack type (ransomware, phishing, credential theft)
9. Pass CySA+, BTL1, or lead a real authorized blue team engagement with documented outcomes

**Tiers:** Aware (1) / Analyst (2–3) / Hunter (4–5) / Builder (6–7) / Senior (8) / Certified (9)

---

### TC13 — Reverse engineering
`cat: "technical"`, `fadeDays: 60`

**Why:** RE is a foundational Cyber offensive and defensive skill. Understanding how compiled code works at the assembly level, patching binaries, and defeating obfuscation are all distinct from malware analysis (which is RE applied specifically to malware).

**Ladder (8 levels):**
1. Explain what an assembler and disassembler do; read 10 lines of x86 assembly and describe their effect
2. Disassemble a simple C program with Ghidra; match functions to source code
3. Trace a program's main control flow in Ghidra without source code; document a call graph
4. Patch a binary (NOP a check, change a branch) using a hex editor; test the modification
5. Solve 5 reverse engineering CTF challenges (crackmes or CTFtime.org) of beginner difficulty
6. Analyze an anti-debugging technique (timing check, IsDebuggerPresent); defeat it in a lab binary
7. Deobfuscate a packed or obfuscated sample; reconstruct readable pseudocode
8. Write a Ghidra or Binary Ninja script that automates a common RE task (rename functions, find crypto constants)

**Tiers:** Aware (1) / Reader (2–3) / Analyst (4–5) / Practitioner (6–7) / Automator (8)

---

### TC14 — DevOps / containerization
`cat: "technical"`, `fadeDays: 45`

**Why:** Docker, CI/CD pipelines, and infrastructure-as-code are now baseline skills for any developer or systems admin. DoD's Platform One and DSOP are container-native.

**Ladder (8 levels):**
1. Explain containers vs. VMs; pull and run a Docker image; list running containers
2. Write a Dockerfile for a simple app; build an image; push to a registry
3. Write a docker-compose.yml that runs a 3-service app (web, API, database)
4. Set up a GitHub Actions workflow that builds, tests, and pushes an image on every commit
5. Deploy a containerized app to Kubernetes (local or cloud); write Deployment + Service manifests
6. Use Helm to template Kubernetes deployments; explain ConfigMaps and Secrets management
7. Implement a complete CI/CD pipeline: test → build → security scan → deploy to staging → promote
8. Design a container security strategy: image scanning, least-privilege, network policy, secrets rotation

**Tiers:** User (1) / Builder (2–3) / Composer (4–5) / Orchestrator (6–7) / Security Engineer (8)

---

### TC15 — PowerShell / Windows administration
`cat: "technical"`, `fadeDays: 45`

**Why:** Army networks run on Windows and Active Directory. PowerShell is the administrative language of the Windows ecosystem, directly relevant to blue team, red team, and system administration.

**Ladder (7 levels):**
1. Run a PowerShell cmdlet; explain the Verb-Noun convention; pipe objects between commands
2. Write a script that reads files, filters output, and writes a report
3. Use PowerShell remoting (Invoke-Command) to run commands on a remote machine
4. Query Active Directory with RSAT / PowerShell: list users, groups, and computers
5. Write a user account management script (create, disable, reset password) for an OU
6. Use PowerShell for penetration testing primitives (BloodHound data collection, WMI queries)
7. Write a PowerShell module with functions, help comments, and error handling; publish to PowerShell Gallery or internal repo

**Tiers:** User (1–2) / Scripter (3–4) / Administrator (5–6) / Advanced (7)

---

### TC16 — CTF / competitive security
`cat: "technical"`, `fadeDays: 30`

**Why:** Capture the Flag competitions are the standardized benchmark for applied offensive security skill. They have verifiable performance metrics (platform rankings, challenge completions).

**Ladder (8 levels):**
1. Complete the PicoCTF beginner challenges (10+ problems) or equivalent onboarding
2. Score points in a public CTF (CTFtime.org) in any category
3. Solve a web, crypto, and binary challenge in a single competition
4. Finish in top 50% of a team in any public CTF with 100+ participants
5. Solve at least one "Hard" rated challenge or finish a PwnCollege module path
6. Lead a 2+ person team to a top-25% finish in a public CTF
7. Win a University-level CTF or finish top-10% in a 500+ team competition
8. Compete in CPTC, CCDC, or equivalent national collegiate cyber competition at regional or national level

**Tiers:** Learning (1–2) / Competitor (3–4) / Skilled (5–6) / Top Performer (7–8)

---

### TC17 — Machine learning / AI fundamentals
`cat: "technical"`, `fadeDays: 60`

**Why:** AI literacy is increasingly required in Cyber (ML-based threat detection) and DoD (Project Maven, autonomous systems). Foundational ML — not research — has concrete, learnable milestones.

**Ladder (8 levels):**
1. Explain the difference between supervised, unsupervised, and reinforcement learning with one example each
2. Train a logistic regression classifier on a dataset in scikit-learn; interpret precision, recall, F1
3. Train a decision tree and a random forest; tune hyperparameters; interpret feature importances
4. Build a neural network in PyTorch or TensorFlow for a classification task; explain forward/backward pass
5. Build and train a CNN on an image dataset; achieve above-baseline accuracy
6. Apply ML to a Cyber use case: anomaly detection on network flows or malware classification
7. Explain transformer architecture at a conceptual level; fine-tune a pre-trained model (BERT, DistilBERT)
8. Deploy an ML model as a REST API; monitor for drift; document performance vs. baseline

**Tiers:** Aware (1) / Practitioner (2–3) / Developer (4–5) / Applied (6–7) / Engineer (8)

---

### TC18 — Software testing
`cat: "technical"`, `fadeDays: 45`

**Why:** The ability to write tests, reason about edge cases, and set up CI pipelines is a professional skill distinct from the ability to write the code itself. Valued in industry and DoD software shops.

**Ladder (7 levels):**
1. Explain unit, integration, and end-to-end tests; write a unit test for a function with 3 test cases
2. Write a test suite with 10+ unit tests; use mocking to isolate dependencies
3. Achieve >80% code coverage on a 500-line module; fix a bug found only by a test
4. Write integration tests for a REST API using a real database; explain the value over mocks
5. Set up a CI pipeline that fails on test failure and shows coverage trend over time
6. Write property-based tests (Hypothesis, QuickCheck, or similar) that found a real edge-case bug
7. Lead a team in a test-driven development (TDD) workflow for a 2-week sprint; retrospective documents coverage delta

**Tiers:** Aware (1) / Writer (2–3) / Professional (4–5) / Advanced (6–7)

---

## PATH OF COMMAND — `leadership`

**Already exists:** Public speaking, Drill & ceremony, Counseling & mentorship, Decision-making under pressure, Parliamentary procedure, Negotiation & influence, Military writing

---

### L1 — Brief preparation & delivery
`cat: "leadership"`, `fadeDays: 60`

**Why:** Military briefings (OPORD brief, commander's update brief, staff summary) follow specific formats. The ability to build and deliver a slide deck to a command audience is a distinct, trainable skill from general public speaking.

**Ladder (7 levels):**
1. Name the 4 types of military briefings; build a 5-slide staff summary on any topic
2. Deliver a 5-minute information brief to 5+ people with Q&A; no critical format errors
3. Deliver a 10-minute decision brief with a recommendation and two COAs; answer 3 questions correctly
4. Build and deliver a WARNO brief to a platoon-sized audience; evaluated by a senior
5. Deliver a 30-minute commander's update brief with graphics, timeline, and 5+ attendees
6. Facilitate a staff brief for multiple briefers; manage time and handle commander questions
7. Brief a general officer or equivalent senior leader; no format errors; composure under pressure

**Tiers:** Aware (1) / Competent (2–3) / Proficient (4–5) / Expert (6–7)

---

### L2 — Ethics & moral reasoning
`cat: "leadership"`, `fadeDays: 90`

**Why:** Military ethics — obedience vs. conscience, the just war tradition, moral injury — is a core MSL topic and a lifelong professional requirement. It has a clear ladder from awareness to application.

**Ladder (7 levels):**
1. Define the Army Values from memory and give a situational example for each
2. Explain the just war tradition (jus ad bellum / jus in bello) and how it constrains military action
3. Apply utilitarian vs. deontological reasoning to the same ethical dilemma; explain the difference in outcome
4. Analyze a historical military ethics failure (My Lai, Abu Ghraib, etc.) using an ethical framework
5. Facilitate an ethics discussion with subordinates using a scenario; document key points raised
6. Write a personal ethics statement: your hierarchy of values and how you'd resolve conflicts among them
7. Apply your ethical framework in a real decision under time pressure; document the decision and review it

**Tiers:** Aware (1–2) / Thinker (3–4) / Practitioner (5–6) / Leader (7)

---

### L2 — Cross-cultural competence
`cat: "leadership"`, `fadeDays: 90`

**Why:** ROTC and the Army emphasize operating with partner nations. Being able to communicate respectfully, understand cultural context, and avoid strategic errors is a learnable, verifiable capability.

**Ladder (6 levels):**
1. Name 5 high-context vs. low-context communication differences; explain why they matter in a military context
2. Research the customs, military structure, and history of one partner nation; give a 10-minute brief
3. Complete a cultural intelligence (CQ) assessment; identify your lowest dimension and a development plan
4. Interact with a cultural mentor or host-nation speaker for 5+ hours; document learning
5. Conduct a cultural operations brief for a training scenario set in a non-US theater
6. Work alongside personnel from 3+ different nationalities in an exercise or professional setting; after-action reflection

**Tiers:** Aware (1) / Studying (2–3) / Practicing (4–5) / Proficient (6)

---

### L3 — Project management
`cat: "leadership"`, `fadeDays: 60`

**Why:** Event planning, training management, and staff coordination are all project management. PMP fundamentals — scope, schedule, cost, risk — translate directly to military staff work.

**Ladder (8 levels):**
1. Define scope, schedule, cost, and risk; explain the project management triangle
2. Build a project schedule (Gantt chart or task breakdown) for a 3-week event
3. Run a kickoff meeting with a defined agenda; produce meeting notes with action items and owners
4. Execute a project to scope and on time with a team of 3+; document what drifted and why
5. Use a risk register to track and mitigate 3+ project risks; brief status weekly to a stakeholder
6. Manage a project with a real budget; handle at least one scope change without blowing the schedule
7. Lead a project that spans multiple organizations or departments; manage conflicting priorities
8. Retrospect: facilitate a lessons-learned session; write a project close-out report used by the next team

**Tiers:** Aware (1) / Planner (2–3) / Manager (4–5) / Senior PM (6–8)

---

## PATH OF KNOWLEDGE — `academic`

**Already exists:** Military history, Writing, ROTC knowledge (quizzes), Higher mathematics, Study & retention, Note-taking, German

---

### A1 — Statistics & data analysis
`cat: "academic"`, `fadeDays: 45`

**Why:** Statistics is essential for Cyber (log analysis, threat modeling), research, and evidence-based decision making. It's its own cognitive domain distinct from higher mathematics.

**Ladder (9 levels):**
1. Explain mean, median, variance, and standard deviation; calculate them by hand for a 5-number set
2. Explain probability: P(A), P(A|B), Bayes' theorem; solve a Bayes problem from scratch
3. Interpret a confidence interval and a p-value correctly; explain what p < 0.05 does and doesn't mean
4. Run a t-test and a chi-squared test in Python; interpret the output and write a 1-paragraph conclusion
5. Explain and use linear and logistic regression; check model assumptions; interpret coefficients
6. Design a sample: calculate required sample size for a given power and effect size
7. Explain A/B testing: randomization, confounders, multiple comparisons correction (Bonferroni / FDR)
8. Build and interpret a basic survival analysis or time-series forecast (ARIMA or Prophet)
9. Produce a reproducible statistical analysis notebook (R or Python) for a real dataset; peer-reviewed

**Tiers:** Beginner (1–2) / Applied (3–4) / Practitioner (5–6) / Analyst (7–8) / Researcher (9)

---

### A2 — Research skills
`cat: "academic"`, `fadeDays: 60`

**Why:** Academic research — finding sources, evaluating credibility, synthesizing literature, citing correctly — is a foundational student skill with clear progression milestones.

**Ladder (7 levels):**
1. Correctly identify a peer-reviewed article; explain the difference between primary and secondary sources
2. Use Google Scholar, EBSCO, or JSTOR to find 5 sources relevant to a topic; cite them in APA or Chicago
3. Evaluate 3 sources on bias, currency, authority, and methodology; write a credibility rating for each
4. Write a literature review (1,500+ words) synthesizing 8+ sources on a focused research question
5. Design a research methodology for an original claim; identify dependent/independent variables and controls
6. Complete an IRB-approved survey or observational study; analyze results and write a 5-page report
7. Submit a paper for peer review or present at an undergraduate research symposium; incorporate reviewer feedback

**Tiers:** Aware (1) / Finder (2–3) / Analyst (4–5) / Researcher (6–7)

---

### A3 — Geopolitics & foreign policy
`cat: "academic"`, `fadeDays: 45`

**Why:** Cyber operations exist in a geopolitical context. Officers are expected to understand strategic competitors, alliances, and the political environment of any operational theater.

**Ladder (7 levels):**
1. Name the 5 permanent UN Security Council members; explain their veto power and current strategic priorities
2. Explain US National Defense Strategy categories (great-power competition, rogue states, non-state actors) with current examples
3. Describe the security environment of one INDOPACOM theater country in detail (alliance, threat, history)
4. Brief a 15-minute "regional update" on a hot-spot country using current open-source intelligence
5. Analyze a geopolitical event using a realist vs. liberal theory lens; present both interpretations
6. Write a 3-page strategic assessment of a country's relationship with the US military, citing doctrine
7. Sustain a 6-month reading habit tracking 3+ geopolitical regions; demonstrate knowledge in a structured Q&A

**Tiers:** Aware (1–2) / Informed (3–4) / Analyst (5–6) / Strategist (7)

---

### A4 — Spanish
`cat: "academic"`, `parent: "Languages"`, `fadeDays: 30`

**Ladder (10 levels):** ILR 0 → 0+ → 1 → 1+ → 2 → 2+ → 3 → 3+ → 4 → 5
(Use the same ILR framework already in the language system.)

---

### A5 — French
`cat: "academic"`, `parent: "Languages"`, `fadeDays: 30`

Same ILR framework.

---

### A6 — Mandarin Chinese
`cat: "academic"`, `parent: "Languages"`, `fadeDays: 21`

Higher fade rate because tonal/character complexity requires more frequent exposure.

---

### A7 — Arabic
`cat: "academic"`, `parent: "Languages"`, `fadeDays: 21`

Higher fade rate, abjad script adds complexity.

---

### A8 — Russian
`cat: "academic"`, `parent: "Languages"`, `fadeDays: 21`

Strategic competitor relevance; Cyrillic script.

---

### A9 — Philosophy & ethics
`cat: "academic"`, `fadeDays: 90`

**Why:** Ethical theory (not just military ethics) is foundational for moral leadership and clear thinking. Distinct from the leadership ethics skill — this is the academic/theoretical side.

**Ladder (7 levels):**
1. Explain the three major ethical theories: utilitarianism, deontology, virtue ethics — with one example each
2. Describe Plato's allegory of the cave, Kant's categorical imperative, and Mill's harm principle
3. Analyze a contemporary moral dilemma using all three frameworks; reach a defended conclusion
4. Write a 2,000-word essay defending an original ethical position with objections and rebuttals
5. Teach a 1-hour philosophy discussion to a group; facilitate productive disagreement
6. Read 5 primary texts (Plato, Aristotle, Kant, Mill, Rawls); write annotated summaries of each
7. Write a research paper applying philosophical theory to a military or technology ethics problem

**Tiers:** Aware (1–2) / Student (3–4) / Thinker (5–6) / Scholar (7)

---

### A10 — Economics fundamentals
`cat: "academic"`, `fadeDays: 90`

**Why:** Defense budgeting, contractor relationships, and acquisition all require economic literacy. Micro and macro fundamentals are testable and carry into defense policy understanding.

**Ladder (7 levels):**
1. Explain supply and demand curves; describe equilibrium price and what shifts each curve
2. Explain GDP, inflation (CPI), unemployment, and the Federal Reserve's mandate
3. Explain comparative advantage; describe how trade deficits and surpluses work
4. Explain game theory basics: Nash equilibrium, prisoner's dilemma; apply to a military scenario
5. Explain defense acquisition basics: PPBE system, MDAPs, and why cost overruns happen
6. Analyze a defense budget line item: explain what drives the cost and what alternatives exist
7. Write a 2,000-word policy brief on a defense economics topic; pass an economics final exam

**Tiers:** Aware (1–2) / Student (3–4) / Applied (5–6) / Analyst (7)

---

## PATH OF THE SELF — `personal`

**Already exists:** Cooking, Personal finance, First aid, Time management, Driving / vehicle ops, OPSEC / digital security, Discipline / habits, Stress regulation, Relationships & connection, Digital discipline

---

### PS1 — Professional networking
`cat: "personal"`, `parent: "Life admin"`, `fadeDays: 60`

**Why:** Building a professional network intentionally — LinkedIn, career fairs, mentor relationships, informational interviews — is a learnable skill distinct from social relationships.

**Ladder (7 levels):**
1. Create a complete LinkedIn profile (photo, headline, experience, education); connect with 10 people you actually know
2. Reach out to 3 people you don't know well for informational interviews; at least 1 responds and meets
3. Attend a career fair, networking event, or professional conference; exchange contact info with 5+ people
4. Follow up on every professional introduction within 48 hours; maintain a contact log of 20+ people
5. Connect with a mentor in your target field (Cyber, Army) who meets with you at least twice in a year
6. Introduce 2 people in your network who would benefit from knowing each other
7. Build an active professional community of 50+ contacts who know your work and goals

**Tiers:** Starting (1) / Active (2–3) / Building (4–5) / Networked (6–7)

---

### PS2 — Interview skills
`cat: "personal"`, `parent: "Life admin"`, `fadeDays: 60`

**Why:** Internship, commissioning board, security clearance, and civilian job interviews all require preparation. STAR method, salary negotiation, and technical interviews are distinct sub-skills.

**Ladder (7 levels):**
1. Explain the STAR method (Situation, Task, Action, Result); write 3 STAR stories from your own experience
2. Deliver a 2-minute "tell me about yourself" without notes; evaluated by a peer
3. Complete a mock behavioral interview (10 questions) with zero "um/uh" crutches and complete STAR answers
4. Complete a mock technical interview for a software/cyber role; answer 3 domain questions at a passing level
5. Receive an interview offer after a real application process (internship, job, commissioning board)
6. Successfully negotiate a starting offer, signing bonus, or package improvement via a documented conversation
7. Prepare and conduct at least 2 successful technical or behavioral interviews in your target field

**Tiers:** Prepared (1–2) / Practiced (3–4) / Interviewing (5–6) / Experienced (7)

---

### PS3 — Tax preparation
`cat: "personal"`, `parent: "Life admin"`, `fadeDays: 365`

**Why:** Filing taxes, understanding military pay exceptions (combat zone, housing allowance), and avoiding common errors are all learnable. Annually testable.

**Ladder (5 levels):**
1. Explain the difference between W-2 and 1099; describe standard deduction vs. itemizing
2. File your own federal + state tax return using TurboTax or IRS Free File without assistance
3. File taxes including military-specific items: BAH/BAS exclusions, SCRA, PCS moving expenses
4. Understand TSP contributions, Roth vs. traditional tax treatment, and how to optimize for your tax bracket
5. File a return with at least 3 complex items (investment income, education credits, itemized deductions); verified correct

**Tiers:** Aware (1) / Independent (2–3) / Military-Savvy (4) / Advanced (5)

---

### PS4 — Investing & wealth building
`cat: "personal"`, `parent: "Life admin"`, `fadeDays: 90`

**Why:** TSP, Roth IRA, and index fund investing are lifetime decisions made early in a career. Distinct from Personal finance (budgeting) — this is asset growth.

**Ladder (8 levels):**
1. Explain compound interest with a concrete example; explain what TSP is and how to enroll
2. Enroll in TSP with ≥5% contribution; understand traditional vs. Roth TSP
3. Open a Roth IRA and make at least one contribution; explain annual contribution limits
4. Allocate your portfolio across asset classes; explain risk tolerance and time horizon
5. Understand index funds vs. actively managed funds; explain expense ratios and their long-term impact
6. Build a net worth tracker; maintain it for 12+ months; compute assets − liabilities monthly
7. Understand BRS (Blended Retirement System); model your projected retirement income from TSP + matching + annuity
8. Read 3 personal finance books (Bogle, Ramsey, Collins, or equivalent) and apply ≥2 principles to your actual accounts

**Tiers:** Starting (1–2) / Investing (3–4) / Optimizing (5–6) / Building (7–8)

---

### PS5 — Home & life maintenance
`cat: "personal"`, `parent: "Life admin"`, `fadeDays: 180`

**Why:** Changing a tire, unclogging a drain, patching drywall, and replacing a light switch are adult competencies with real cost savings and independence value.

**Ladder (7 levels):**
1. Change a flat tire; jump-start a dead battery; add oil and washer fluid without help
2. Replace a clogged air filter (HVAC or car); reset a tripped circuit breaker; replace a light switch
3. Patch a drywall hole (≤3"); re-caulk a window or tub surround; replace a faucet washer
4. Install and configure a smart thermostat or door lock; repair a running toilet
5. Replace a light fixture or ceiling fan; run a new circuit (low-voltage / ethernet)
6. Diagnose and repair one household appliance malfunction (dishwasher, dryer, etc.)
7. Execute a home improvement project requiring 3+ different trades (plumbing + electrical + drywall)

**Tiers:** Basic (1) / Competent (2–3) / Handy (4–5) / Skilled (6–7)

---

### PS6 — Health literacy
`cat: "personal"`, `parent: "Wellbeing"`, `fadeDays: 90`

**Why:** Reading lab results, understanding medication interactions, and communicating effectively with doctors are learnable skills that reduce poor health outcomes and dependency on others for medical decisions.

**Ladder (6 levels):**
1. Interpret a basic metabolic panel (BMP): know what sodium, potassium, creatinine, and glucose indicate
2. Interpret a CBC (complete blood count): know what RBC, WBC, hemoglobin, and platelets indicate
3. Read a lipid panel; understand cardiovascular risk scores (Framingham, ASCVD)
4. Explain how to evaluate a medical study: RCT vs. observational; what NNT and NNH mean
5. Research a symptom or condition using UpToDate, Mayo Clinic, or PubMed; distinguish evidence quality levels
6. Navigate a complex medical situation (surgery, specialist referral, insurance dispute) with complete documentation and informed decision-making

**Tiers:** Aware (1–2) / Informed (3–4) / Literate (5–6)

---

### PS7 — Legal literacy
`cat: "personal"`, `parent: "Life admin"`, `fadeDays: 180`

**Why:** Understanding contracts, tenant rights, consumer protection, and military legal tools (JAG, SCRA, USERRA) prevents costly mistakes and gives real independence.

**Ladder (6 levels):**
1. Explain what a contract requires to be enforceable (offer, acceptance, consideration, capacity)
2. Read a standard lease agreement; identify 5 tenant-unfavorable clauses and understand your rights under them
3. Understand SCRA protections: interest rate cap, eviction protection, lease termination rights; know how to invoke them
4. Navigate a civil small-claims scenario: prepare, file, and present a case (mock or real)
5. Draft a basic legal letter (demand letter, notice of dispute) that follows correct format and legal standards
6. Use JAG legal assistance services for a real need (will, POA, landlord dispute); understand the scope of free services

**Tiers:** Aware (1) / Reader (2–3) / User (4–5) / Literate (6)

---

### PS8 — Mindfulness & meditation
`cat: "personal"`, `parent: "Wellbeing"`, `fadeDays: 14`

**Why:** Formal meditation practice has the strongest evidence base of any stress-management intervention. Distinct from Stress regulation (which covers the broader regulation toolkit). Short fade days because the skill degrades rapidly without practice.

**Ladder (7 levels):**
1. Complete a 10-minute guided body scan or breath-focus session without falling asleep
2. Maintain a 7-consecutive-day streak of ≥5 minutes daily meditation
3. Maintain a 30-day streak of ≥10 minutes daily; notice and name distractions without following them
4. Sit 20+ minutes without guided audio; maintain attention on a single anchor for the full session
5. Practice insight meditation (Vipassana) for 30+ minutes; describe a specific moment of observing a mental event arise and pass
6. Maintain a 90-day consistent daily practice; document measurable change in HRV or stress response
7. Complete a silent retreat (minimum 1 full day) or equivalent immersive practice

**Tiers:** Beginner (1) / Regular (2–3) / Established (4–5) / Advanced (6–7)

---

### PS9 — Sleep optimization
`cat: "personal"`, `parent: "Wellbeing"`, `fadeDays: 14`

**Why:** Sleep discipline (existing) is about following a schedule. Sleep optimization is about the deeper techniques: sleep pressure, circadian alignment, environment tuning. Different skill, much deeper ladder.

**Ladder (7 levels):**
1. Explain the two-process model of sleep (homeostatic pressure + circadian rhythm); name 5 sleep hygiene rules
2. Log sleep timing and perceived quality for 14 consecutive days; identify your chronotype
3. Implement ≥5 sleep hygiene changes; maintain them for 30 days; document quality change
4. Use a wearable or sleep tracking app for 60+ days; correlate sleep data with next-day performance
5. Implement a 90-minute pre-sleep protocol consistently for 30 days; measure sleep latency
6. Sleep in a variety of operational environments (field, travel, irregular schedule) and apply evidence-based countermeasures
7. Sustain optimal sleep architecture (7–9 hours, consistent timing) for 3+ months; demonstrate measurable recovery improvements

**Tiers:** Learning (1–2) / Applying (3–4) / Optimizing (5–6) / Mastered (7)

---

### PS10 — Mental health literacy
`cat: "personal"`, `parent: "Wellbeing"`, `fadeDays: 90`

**Why:** Recognizing depression, anxiety, PTSD, and TBI in yourself and Soldiers is a leadership competency. ACE (Ask, Care, Escort) training is formalized. This is the skill behind it.

**Ladder (6 levels):**
1. Explain ACE suicide prevention protocol; describe the 5 signs of emotional suffering
2. Describe the diagnostic criteria for depression, anxiety, and PTSD at a lay level; know what a PHQ-9 is
3. Recognize a Soldier or peer in distress; initiate a conversation using ACE; document the interaction
4. Complete QPR (Question, Persuade, Refer) gatekeeper training; maintain certification
5. Facilitate a small-group mental health discussion (resilience training, stress inoculation) for your unit
6. Develop a mental health resource map for your unit (chaplain, behavioral health, hotlines) and distribute it

**Tiers:** Aware (1–2) / Informed (3–4) / Trained (5–6)

---

## PATH OF THE HEARTH — `hearth`

**Already exists:** Logistics & resupply, Gear readiness, Field sustainment, Frugality & resourcefulness

---

### H1 — Vehicle preparedness
`cat: "hearth"`, `parent: "Sustainment"`, `fadeDays: 90`

**Why:** Maintaining a vehicle — oil changes, tire rotation, pre-trip inspections — and having an emergency kit are adult competencies with safety implications.

**Ladder (6 levels):**
1. Change a flat tire; jump a dead battery; know dashboard warning lights and what each means
2. Check and top off all fluids (oil, coolant, brake fluid, power steering, washer); inspect tire pressure and tread
3. Change your own oil and filter; rotate tires; replace air filter
4. Diagnose a common fault using an OBD-II scanner; replace brake pads
5. Assemble a complete vehicle emergency kit; complete a pre-trip inspection checklist before every long drive
6. Complete a roadside assistance qualification or vehicle maintenance course; teach 2 skills to a peer

**Tiers:** Basic (1) / Competent (2–3) / Self-Sufficient (4–5) / Proficient (6)

---

### H2 — Amateur radio / backup communications
`cat: "hearth"`, `parent: "Sustainment"`, `fadeDays: 180`

**Why:** In grid-down scenarios and as a complement to Radio communications (tactical), amateur radio (HAM) provides personal/family backup communication. Licensing is verifiable.

**Ladder (6 levels):**
1. Explain why amateur radio matters; describe the three license classes; pass 10 practice exam questions
2. Pass the FCC Technician license exam; obtain a callsign
3. Make your first contact (QSO) on a local repeater; log it with date, callsign, and frequency
4. Pass the General license exam; make a HF contact to a station 500+ miles away
5. Operate a 72-hour emergency communications exercise or participate in ARES/RACES
6. Pass the Amateur Extra exam; serve as net control for a local traffic net

**Tiers:** Learning (1) / Licensed (2–3) / General (4–5) / Expert (6)

---

## PATH OF ROOTS — `roots`

**Already exists:** Integrity, Resilience / grit, Values & purpose, Mental fortitude

---

### R1 — Self-awareness
`cat: "roots"`, `parent: "Character"`, `fadeDays: 90`

**Why:** Knowing your own strengths, blind spots, and default responses under stress is a prerequisite for effective leadership. The Johari window and 360-degree feedback are its tools.

**Ladder (7 levels):**
1. Complete a Big Five personality assessment; write a 1-page reflection on what surprised you
2. Complete a StrengthsFinder or VIA Character Strengths survey; name your top 5 and one limiting cost of each
3. Solicit honest written feedback from 3+ people who know you well; identify a common theme
4. Use a Johari window with a trusted partner; identify 2 items in your blind spot and 2 in your façade
5. Keep a 30-day reflection journal focused on triggered reactions; identify 3 recurring patterns
6. Receive a 360-degree feedback report (formal or structured informal); build a 90-day development plan
7. Demonstrate measurable behavior change based on feedback; validated by the original feedback givers

**Tiers:** Exploring (1–2) / Reflecting (3–4) / Acting (5–6) / Transforming (7)

---

### R2 — Gratitude & positive reframing
`cat: "roots"`, `parent: "Character"`, `fadeDays: 14`

**Why:** Evidence-based (Emmons, Seligman) positive psychology interventions measurably reduce depression and increase resilience. Short fade — requires active daily practice.

**Ladder (5 levels):**
1. Complete a 7-day gratitude journal (3 items/day) without missing a day
2. Sustain a 30-day gratitude practice; write one specific, concrete item per day (not vague)
3. Practice gratitude letters: write and deliver (in person or in writing) a gratitude letter to 3 different people
4. Reframe a genuinely negative event in writing using the "best possible self" exercise; notice your emotional state before and after
5. Sustain a daily gratitude practice for 6+ months; demonstrate its integration with your morning routine and stress response

**Tiers:** Starting (1) / Consistent (2–3) / Deep (4–5)

---

## IMPLEMENTATION PRIORITY

### Tier 1 — Highest value for a Cyber-branch ROTC cadet
*Add these first. Directly maps to career milestones.*
- TC1 Version control (Git) — used immediately
- TC2 SQL & databases — CS curriculum required
- TC5 Data structures & algorithms — interview/course required
- TC8 Penetration testing methodology — 17A core
- TC9 Digital forensics & IR — 17A/255A core
- TC12 Network defense / blue team — daily job as 17A
- T8 Operational planning (MDMP) — LDAC requirement
- T4 Military law & ROE — officer requirement
- L1 Brief preparation — weekly Army task
- A1 Statistics & data analysis — used in every tech job
- PS4 Investing & wealth building — early career, compounding

### Tier 2 — High value, implement next batch
- TC3 Bash scripting, TC4 Cloud computing, TC7 Web dev, TC11 Cryptography
- TC13 Reverse engineering, TC14 DevOps, TC16 CTF
- T5 Battle drills, T6 SALUTE reporting, T2 CBRN
- C1 Critical thinking, C2 Decision science
- L2 Ethics, L3 Project management
- PS1 Professional networking, PS2 Interview skills
- A2 Research skills, A3 Geopolitics

### Tier 3 — Real value, lower urgency
- T3 Grenade employment, T7 Rappelling, T1 M17 marksmanship
- P2 Obstacle course, P5 Gymnastics, P1 Combat water survival
- TC6 Systems programming (C/C++), TC10 Malware analysis, TC17 ML/AI, TC18 Software testing
- A4–A8 Additional languages
- PS3 Taxes, PS5 Home maintenance, PS6 Health literacy, PS7 Legal literacy
- H2 Amateur radio, R1 Self-awareness, R2 Gratitude
