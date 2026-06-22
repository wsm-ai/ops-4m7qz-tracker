# Operations

A personal command-center PWA for an Army ROTC cadet — a gamified, evidence-based
tracker for fitness, cognition, officer knowledge, habits, and branching goals.
Installable on laptop, tablet, and phone; works offline; all data stays on the
device (with optional cloud-file sync).

## What goes live (GitHub Pages)

These files at the repo **root** are the app. Pages serves them as the site:

- `index.html` — the app
- `quizbank.js` — the quiz questions (sourced from ROTC advance sheets & TCs)
- `sw.js` — service worker (installability + offline)
- `manifest.json` — PWA manifest
- `icon-192.png`, `icon-512.png` — app icons

Keep all of them at the root, together. After uploading a new version, hard-refresh
(Ctrl/Cmd+Shift+R) so the service worker picks up the new files. The cache version in
`sw.js` is bumped on every release to force the update. **Export a backup before
updating** — your data migrates automatically, but a backup is cheap insurance.

## The app, in brief

A set of tabs, each a tool. Current version: **v34** (16 tabs).

### Daily use
- **Today** — the landing dashboard. Aggregates everything actionable today in one
  screen: habits due (checkable here), daily orders left, skills needing attention,
  spaced-repetition cards due, study reviews due, your training focus (your weakest
  AFT event), and status/reminders (AFT pass status, blood-donation eligibility,
  stale-weight nudge). Open the app → know what to do.
- **Missions / Orders / Objectives** — one-off tasks, **daily habits**, and big
  multi-step goals. Habits have their own streaks (independent of the day-streak), a
  starter library, a one-time **grace day** so one miss doesn't reset months, and they
  **feed linked skills** (completing a habit refreshes that skill's decay timer).
- **Momentum** — a perfect-day bonus, escalating streak milestones, a readiness bar,
  and streak-at-risk warnings. Motivating-strict, never punitive.

### Body & health
- **Profile** — identity, birthdate (auto-age), height/weight with last-measured
  dates, best lifts, an **Emergency Info** card (blood type + allergies, screen-grab
  ready), **Blood Donation** tracking (real ABO/Rh compatibility + 56-day eligibility),
  and a **Vitals** log (pulse, blood pressure, hemoglobin) with trend sparklines.
  *Vitals are informational only — not medical advice.*
- **AFT** — the Army Fitness Test scorecard using the **official scoring tables**
  (HQDA EXORD 218-25 Annex B, eff 1 Jun 2025), age/sex-bracketed, with a General vs
  Combat standard toggle and pass/fail against the real thresholds. Anchor points are
  exact; values between anchors are interpolated — verify graded scores on the official
  chart.
- **Log** — a workout logger with per-exercise progress, stall detection, and a
  monthly baseline that re-anchors targets.
- **FM** — an adaptive training plan whose targets auto-calculate from the log and
  baseline. Logging **cadre PT** makes it recovery-aware (eases off recently-worked
  muscle groups). Factors in age-based recovery pacing and your build.

### Mind & knowledge
- **Test** — in-app cognitive tests, each measuring a skill and giving improvement
  tips: reaction time, memory span, typing, n-back (working memory), go/no-go
  (attention), processing speed, mental math. Plus the **Memory Track**: a real
  spaced-repetition (SRS) engine and a memory-palace trainer — the "memorize anything"
  system. *Browser tests are relative progress trackers, not clinical/IQ instruments.*
- **Quiz** — 16 banks (~124 questions) on Army knowledge from real ROTC advance sheets
  and TCs; each question cites its source. Passing banks levels the **ROTC knowledge**
  skill. Includes a **study-plan generator** that builds a spaced review schedule for
  any graded test. *Study aid — verify against the originals and cadre.*
- **Board** — Cyber Branch (17-series) reference facts and a Talent-Based Branching /
  promotion-board prep checklist.

### Skills
- **Skills** — a hierarchical skill tree across eight categories (Tactical, Physical,
  Cognitive, Physiological, Technical, Leadership, Academic, Personal). Each skill has
  a level ladder, a decay timer, a quest, a **peak-level memory** (your all-time high,
  so you can see what to reclaim), and never falls below Level 1 once started. Many
  carry plain-language **"why & how"** copy (including exercise form, warm-up/cool-down,
  and instructor-safety notes for the combat skills), and every skill has a **"Work on
  this"** button that routes to the right trainer, plan, or protocol. Strength skills
  auto-level from your real lift-to-bodyweight ratios; AFT events and quiz/test results
  feed their skills automatically.

### Records & rewards
- **R&R** — a rewards shop you spend Merit Points in.
- **The Wall** — the "I Love Me" wall: awards, coins, badges, certs, memberships,
  events, and volunteer hours.
- **Records** — **History & Trends** (AFT/weight/vitals/skills over time), a private
  **Counseling Log** (4856-style leadership-event record), reusable **packing/gear
  checklists** (ruck/FTX/lab templates), and **CSV export** of AFT history, awards,
  volunteer hours, and counseling.
- **Weight** — a **read-only mirror** of the standalone *The Weight* promise-ledger app
  (`tw-9f3kx-ledger`). Binding and keeping happen in the real Weight app; this shows
  the jars, keystone, memorial, and ledger. Kept solemn — no points or streaks touch it.

## Data & sync

- All data is stored locally in the browser, **per device** — nothing is sent to a
  server, and the public site never contains your data, only the app code.
- **Export / import backup** moves data between devices manually (works everywhere,
  including iPhone).
- **Link cloud file** (footer) uses the File System Access API to auto-save your data
  to a `.json` file in a synced folder (e.g. OneDrive), keeping linked devices in sync.
  Works on desktop Chrome/Edge and Android; **not** on iPhone/iPad Safari, which uses
  export/import instead.

## Install

1. Host these root files (GitHub Pages, or drag the folder to a static host).
2. Open the resulting URL on each device and install:
   - **Windows (Chrome/Edge):** install icon in the address bar, or menu → Install.
   - **Samsung (Chrome / Samsung Internet):** menu → Add to Home screen.
   - **iPhone (Safari only):** Share → Add to Home Screen.

## Honest constraints (kept visible in the app too)

- **No automatic Apple Watch sync.** A static web app can't read HealthKit/Bluetooth.
  Vitals are manual entry; the "Import from Apple Health export" button is a stub for a
  future file-import feature.
- **In-app cognitive tests are relative trackers**, not clinical or IQ instruments —
  device and input lag affect reaction/processing scores.
- **Brain-training transfer is limited** — gains are mostly task-specific. The Memory
  Track trains *deliberate* memorization to a high level; it won't make unrelated
  remembering effortless.
- **Combat (CQC) and Physical Control skills are concept-tracking only.** You cannot
  learn to fight or restrain safely from text — train hands-on with a qualified
  instructor. Heavy lifts likewise need a coach to check form.
- **AFT scoring** uses the official 1 Jun 2025 tables (exact anchors + interpolation);
  the official PDF and your cadre are the final word for graded tests.
- **Quiz content** is an AI-assisted study aid and may contain errors; confirm against
  original ROTC materials.
- **Blood type** is used only for emergency ID and real donation-compatibility facts —
  never for invented "blood-type fitness" claims.
- **Vitals/BP/hemoglobin ranges are informational, not medical advice** — see a
  clinician for anything concerning.
- The training plan is a general framework, not medical or cadre direction.
- Privacy: a GitHub Pages site is publicly reachable by anyone with the URL even with
  an obscure repo name. For true privacy, host behind a password (Cloudflare Pages /
  Netlify). Your personal data stays safe regardless — it lives only in the browser or
  your linked cloud file.
