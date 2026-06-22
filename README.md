# Operations

A personal command-center PWA for an Army ROTC cadet — a gamified tracker for
fitness, officer knowledge, and branching goals, plus a hub that links out to other
projects. Installable on laptop, tablet, and phone; works offline; all data stays on
the device (with optional cloud-file sync).

## What goes live (GitHub Pages)

These files at the repo **root** are the app. Pages serves them as the site:

- `index.html` — the app
- `quizbank.js` — the quiz questions (sourced from ROTC advance sheets & TCs)
- `sw.js` — service worker (installability + offline)
- `manifest.json` — PWA manifest
- `icon-192.png`, `icon-512.png` — app icons

Keep all of them at the root, together. After uploading a new version, hard-refresh
(Ctrl/Cmd+Shift+R) so the service worker picks up the new files. The cache version in
`sw.js` is bumped on every release to force the update.

## The app, in brief

A set of tabs, each a tool:

- **Missions / Orders / Objectives** — tasks, daily habits, and big multi-step goals.
  Completing them earns Merit Points and XP across four skill tracks (Fitness,
  Tactics, Knowledge, Discipline).
- **Momentum** — a perfect-day bonus, escalating streak milestones, a readiness bar,
  and streak-at-risk warnings. Motivating-strict, never punitive.
- **AFT** — the Army Fitness Test scorecard, pre-loaded with real test history,
  trend arrows per event, and auto-detected weak points that re-tune the plan.
- **Log** — a workout logger (reps/weight, time, distance) with per-exercise progress
  and stall detection, plus a **monthly baseline** test that re-anchors targets.
- **FM** — an adaptive training plan whose next-session targets are auto-calculated
  from the log and the monthly baseline.
- **Quiz** — 16 banks (~124 questions) on Army knowledge, sourced from real ROTC
  advance sheets and TCs; each question cites its source. *Study aid — verify against
  the originals and cadre before graded use.*
- **Board** — Cyber Branch (17-series) reference facts and a Talent-Based Branching /
  promotion-board prep checklist.
- **Awards** — the "I Love Me" wall: awards, coins, badges, certs, milestones, and
  memorabilia accumulate as cards.
- **Weight** — a **read-only mirror** of the standalone *The Weight* promise-ledger
  app (`tw-9f3kx-ledger`). Shows the jars, keystone, memorial, and ledger; binding
  and keeping happen in the real Weight app, where the rituals live. Refresh via the
  daily nudge by importing a ledger export. Kept solemn — no points or streaks touch
  it.

## Data & sync

- All data is stored locally in the browser, **per device** — nothing is sent to a
  server, and the public site never contains your data, only the app code.
- **Export / import backup** moves data between devices manually (and works
  everywhere, including iPhone).
- **Link cloud file** (footer) uses the File System Access API to auto-save your data
  to a `.json` file in a synced folder (e.g. OneDrive), keeping linked devices in
  sync. Works on desktop Chrome/Edge and Android; **not** on iPhone/iPad Safari, which
  uses export/import instead.

## Install

1. Host these root files (GitHub Pages, or drag the folder to a static host).
2. Open the resulting URL on each device and install:
   - **Windows (Chrome/Edge):** install icon in the address bar, or menu → Install.
   - **Samsung (Chrome / Samsung Internet):** menu → Add to Home screen.
   - **iPhone (Safari only):** Share → Add to Home Screen.

## Notes

- The quiz content and AFT scoring are AI-assisted study aids and may contain errors;
  confirm against original ROTC materials and cadre before relying on them.
- The training plan is a general framework, not medical or cadre direction.
- The Weight tab is a respectful mirror, not a replacement — the standalone Weight app
  remains the source of truth for promises.
- Privacy note: a GitHub Pages site is publicly reachable by anyone with the URL even
  with an obscure repo name. For true privacy, host behind a password (Cloudflare
  Pages / Netlify). Your personal data stays safe regardless, since it lives only in
  the browser / your linked cloud file.
