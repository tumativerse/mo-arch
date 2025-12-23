---
sidebar_position: 2
title: "MO:PULSE"
---

# MO:PULSE - Tracking Domain

> *"The Observer"* — "I see everything you do"

MO:PULSE captures all user activity and health data. It's the primary input layer that feeds MO:COACH with data for analysis.

---

## Verticals

| Vertical | Purpose | Systems | Status |
|----------|---------|---------|--------|
| [MoMove](./mo-move/) | Activity tracking | 5 | 4/5 built |
| [MoBody](./mo-body/) | Body metrics | 3 | 1/3 built |
| [MoRecover](./mo-recover/) | Recovery tracking | 4 | 3/4 built |
| [MoFuel](./mo-fuel/) | Nutrition tracking | 3 | 0/3 built |

---

## Domain Data Model

```typescript
interface MoPulseData {
  activity: {
    sessions: WorkoutSession[];
    exercises: ExerciseLog[];
    cardioActivities: CardioActivity[];
  };
  body: {
    weightEntries: WeightEntry[];
    measurements: BodyMeasurement[];
  };
  recovery: {
    sleepLogs: SleepLog[];
    energyLevels: EnergyLog[];
    sorenessLogs: SorenessLog[];
  };
  nutrition: {
    meals: MealLog[];
    macros: DailyMacros[];
    hydration: HydrationLog[];
  };
}
```

---

## Domain Interface

```typescript
interface MoPulseInterface {
  // Activity
  getTodayWorkout(): Promise<WorkoutTemplate>;
  startSession(templateDayId: string): Promise<Session>;
  logSet(data: SetLogData): Promise<void>;
  completeSession(sessionId: string): Promise<SessionSummary>;

  // Body
  logWeight(weight: number): Promise<void>;
  getWeightHistory(days: number): Promise<WeightEntry[]>;

  // Recovery
  logRecovery(data: RecoveryData): Promise<void>;
  getRecovery(date: Date): Promise<RecoveryLog>;
}
```

---

## Code Organization

```
/lib/mo-pulse
├── /move
│   └── warmup.ts           → MoWarmup
└── index.ts                → Domain exports

/app/api
├── /ppl/today              → MoSession
├── /ppl/session            → MoSession
├── /ppl/session/sets       → MoStrength
├── /weight                 → MoWeight
├── /recovery               → MoSleep, MoEnergy, MoSoreness
└── /warmup                 → MoWarmup
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/ppl/today` | GET | MoSession |
| `/api/ppl/session` | POST/PATCH | MoSession |
| `/api/ppl/session/sets` | POST/DELETE | MoStrength |
| `/api/weight` | GET/POST | MoWeight |
| `/api/recovery` | GET/POST | MoSleep, MoEnergy, MoSoreness |
| `/api/warmup` | GET/POST | MoWarmup |

---

## Status

| Metric | Value |
|--------|-------|
| Verticals | 4/4 |
| Systems Built | 8/15 (53%) |
| API Endpoints | 6 |
