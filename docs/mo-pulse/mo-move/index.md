---
sidebar_position: 1
title: MoMove
---

# MoMove

> *"I track every rep, every mile"*

MoMove handles all physical activity tracking — strength training, cardio, mobility work, and workout sessions.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoStrength](./mo-strength) | *"The Iron Counter"* | ✅ Built | Weight training, sets, reps, RPE |
| [MoSession](./mo-session) | *"The Workout Manager"* | ✅ Built | Active workout state, flow |
| [MoWarmup](./mo-warmup) | *"The Preparer"* | ✅ Built | Warmup templates, tracking |
| [MoCardio](./mo-cardio) | *"The Distance Tracker"* | ❌ Future | Running, cycling, swimming |
| [MoMobility](./mo-mobility) | *"The Flexibility Guide"* | ⚠️ Partial | Stretching, yoga |

---

## Data Flow

```
User starts workout
        ↓
MoWarmup (optional) → MoSession (manages state) → MoStrength (logs sets)
        ↓                                                    ↓
Warmup completion                                    PR detection (→ MoRecords)
                                                            ↓
                                              Streak update (→ MoStreaks)
```

---

## Vertical Interface

```typescript
interface MoMoveInterface {
  // Sessions
  getTodayWorkout(): Promise<WorkoutTemplate>;
  startSession(templateDayId: string): Promise<Session>;
  completeSession(sessionId: string, notes?: string): Promise<SessionSummary>;

  // Strength
  logSet(data: SetLogData): Promise<SetLog>;
  deleteSet(setId: string): Promise<void>;

  // Warmup
  startWarmup(sessionId: string): Promise<WarmupLog>;
  completeWarmup(sessionId: string): Promise<WarmupLog>;
  skipWarmup(sessionId: string): Promise<WarmupLog>;
}
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/ppl/today` | GET | MoSession |
| `/api/ppl/session` | POST | MoSession |
| `/api/ppl/session` | PATCH | MoSession |
| `/api/ppl/session/sets` | POST | MoStrength |
| `/api/ppl/session/sets` | DELETE | MoStrength |
| `/api/warmup` | GET/POST | MoWarmup |
