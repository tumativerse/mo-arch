---
sidebar_position: 3
title: "MO:PULSE"
---

# MO:PULSE - Tracking Domain

> *"The Observer"* — "I see everything you do"

MO:PULSE captures all user activity and health data. It's the primary input layer that feeds MO:COACH with data for analysis.

---

## Verticals & Systems

### MoMove — *"I track every rep, every mile"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoStrength | *"The Iron Counter"* | Weight training, sets, reps, RPE | ✅ Built |
| MoCardio | *"The Distance Tracker"* | Running, cycling, swimming, rowing | ❌ Future |
| MoMobility | *"The Flexibility Guide"* | Stretching, yoga, mobility work | ⚠️ Partial |
| MoSession | *"The Workout Manager"* | Active session state, timers, flow | ✅ Built |
| MoWarmup | *"The Preparer"* | Warmup templates, phase tracking, skip/complete | ✅ Built |

### MoBody — *"I watch your transformation"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoWeight | *"The Scale"* | Daily weight logging, trends | ✅ Built |
| MoMeasure | *"The Tape"* | Body measurements (chest, waist, arms) | ❌ Future |
| MoComposition | *"The Analyzer"* | Body fat %, muscle mass estimates | ❌ Future |

### MoRecover — *"I monitor how you heal"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoSleep | *"The Night Watcher"* | Sleep hours, quality tracking | ✅ Built |
| MoEnergy | *"The Battery"* | Daily energy levels (1-5) | ✅ Built |
| MoSoreness | *"The Pain Map"* | Muscle soreness tracking | ✅ Built |
| MoStrain | *"The Load Monitor"* | Daily strain from wearables | ❌ Future |

### MoFuel — *"I track what powers you"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoMeals | *"The Food Log"* | Meal logging, food diary | ❌ Future |
| MoMacros | *"The Nutrient Counter"* | Protein, carbs, fats tracking | ❌ Future |
| MoHydration | *"The Water Tracker"* | Daily water intake | ❌ Future |

---

## Data Model

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

## Interface

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
│   └── warmup.ts        → MoWarmup - Warmup tracking
└── index.ts             → Domain exports
```

### Import Pattern

```typescript
import { startWarmup, completeWarmup } from '@/lib/mo-pulse';
```

---

## Related APIs

| Endpoint | System |
|----------|--------|
| `/api/ppl/today` | MoSession |
| `/api/ppl/session` | MoSession |
| `/api/ppl/session/sets` | MoStrength |
| `/api/weight` | MoWeight |
| `/api/recovery` | MoSleep, MoEnergy, MoSoreness |
| `/api/warmup` | MoWarmup |
