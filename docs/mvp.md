---
sidebar_position: 2
title: MVP Progress
---

# MVP Progress

## Goal

Build a minimal fitness app that I actually use every workout.

---

## Implementation Phases

### Phase 1: Database Schema ✅

- [x] Configure Clerk auth
- [x] Set up Neon database
- [x] Run initial migration
- [x] Add PPL training system tables (13 new tables)
- [x] Add enums (exerciseUse, slotType, dayType, warmupPhaseType, equipmentLevel, sessionStatus)

### Phase 2: Seed Data ✅

- [x] Seed exercise library (~500 exercises)
- [x] Seed PPL template (6 days, 36 slots)
- [x] Seed warmup templates (3 templates, 9 phases)
- [x] Seed warmup exercises (30 exercises, 20 phase links)

### Phase 3: API Endpoints ✅

- [x] GET /api/ppl/today - Today's workout with rotation
- [x] POST/PATCH /api/ppl/session - Start/complete sessions
- [x] POST/DELETE /api/ppl/session/sets - Log sets
- [x] GET /api/exercises/alternatives - Exercise swaps
- [x] GET/POST /api/recovery - Recovery logging
- [x] GET /api/progression - Progression & fatigue tracking

### Phase 4: Frontend Components ✅

- [x] Workout page with two-mode design (overview/focused)
- [x] Exercise swap modal
- [x] Recovery check-in component
- [x] Dashboard with recovery integration
- [x] Progression analytics page

### Phase 5: Logic & Auto-Regulation ✅

- [x] Fatigue calculation (0-10 score)
- [x] Progression gates system
- [x] Deload detection & management
- [x] Weight suggestions
- [x] Training status API

### Phase 6: Deploy ✅

- [x] Deploy to Vercel
- [ ] Use for 2 weeks
- [ ] Adjust thresholds based on real usage

### Phase 7: Mo Universe Architecture ✅

- [x] Created Mo Universe directory structure (`/lib/mo-*`)
- [x] MoStreaks - Workout streak tracking
- [x] MoRecords - Personal record detection
- [x] MoSettings - User preferences
- [x] MoWarmup - Warmup tracking
- [x] Auto-hooks for streak updates and PR detection

---

## Tech Stack

| Layer | Choice | Status |
|-------|--------|--------|
| **Framework** | Next.js 15 (App Router) | ✅ |
| **Language** | TypeScript | ✅ |
| **Styling** | Tailwind CSS | ✅ |
| **Database** | Neon (PostgreSQL) | ✅ |
| **ORM** | Drizzle | ✅ |
| **Auth** | Clerk | ✅ |
| **Charts** | Recharts | ✅ |
| **Hosting** | Vercel | ✅ |

---

## MVP Features

### Must Have (Launched)

1. **Authentication** — Clerk (email/OAuth) ✅
2. **Program library** — PPL template with 6 days ✅
3. **Today's workout** — Show exercises for today ✅
4. **Quick logging** — Enter sets/reps/weight with minimal taps ✅
5. **Workout history** — View past workouts ✅
6. **Progress charts** — Weight lifted over time ✅
7. **Body weight tracking** — Log and chart weight ✅

### Deferred

- Custom program builder
- AI coaching
- Exercise video demos
- Social features / sharing
- Nutrition / calorie tracking
- Mobile native app

---

## PPL Template Design

The PPL (Push/Pull/Legs) system uses **movement pattern slots** instead of fixed exercises:

| Day | Primary | Secondary |
|-----|---------|-----------|
| **Push A** | Horizontal Push | Vertical Push, Triceps, Side Delts |
| **Push B** | Incline Push | Vertical Push, Triceps, Chest Fly |
| **Pull A** | Vertical Pull | Horizontal Pull, Biceps, Rear Delts |
| **Pull B** | Horizontal Pull | Vertical Pull, Biceps, Rear Delts |
| **Legs A** | Squat | Hinge, Leg Curl, Calves |
| **Legs B** | Hinge | Squat, Leg Extension, Calves |

**Key Features:**
- Exercises suggested based on movement pattern, equipment, and history
- Users can swap exercises within the same movement pattern
- RPE targets and rep ranges defined per slot
- Warmup templates specific to each day type

---

## Success Criteria

**v0.1 is successful when:**

- [ ] I use it for every workout for 2 weeks
- [ ] Logging a set takes < 5 seconds
- [ ] I can see my bench/squat/deadlift progress charted
- [ ] The app doesn't confuse me or slow me down
