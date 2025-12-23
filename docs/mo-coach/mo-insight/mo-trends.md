---
sidebar_position: 1
title: MoTrends
---

# MoTrends

> *"The Pattern Finder"* — "I see your trajectory"

**Status:** ⚠️ Partial (included in progression API)

MoTrends analyzes long-term training data to identify trends in strength, volume, and performance.

---

## Purpose

- Track strength progression over time
- Identify exercises improving or plateauing
- Calculate volume trends
- Detect RPE creep (workouts getting harder)

---

## Current Implementation

Trend analysis is embedded in the `/api/progression` endpoint.

### Code Location

```
/app/api/progression/route.ts
```

---

## Trend Types

### Strength Trend

```typescript
interface StrengthTrend {
  exerciseId: string;
  exerciseName: string;

  // Current vs historical
  currentWeight: number;
  startWeight: number;
  weightChange: number;
  percentChange: number;

  // Estimated 1RM
  current1RM: number;
  peak1RM: number;

  // Trend direction
  trend: 'improving' | 'plateaued' | 'declining';
  sessionsAtCurrentWeight: number;
}
```

### Volume Trend

```typescript
interface VolumeTrend {
  period: '7d' | '14d' | '30d';

  // Weekly averages
  currentWeeklyVolume: number;
  previousWeeklyVolume: number;
  volumeChange: number;

  // By muscle group
  volumeByMuscle: {
    muscle: string;
    volume: number;
    change: number;
  }[];
}
```

### RPE Trend

```typescript
interface RPETrend {
  // Average RPE over time
  currentAvgRPE: number;
  previousAvgRPE: number;
  rpeChange: number;

  // RPE creep detection
  isCreeping: boolean;     // RPE trending up without weight increase
  creepRate: number;       // RPE increase per week
}
```

---

## Calculations

### Plateau Detection

```typescript
function isPlateaued(history: SetHistory[]): boolean {
  const recentSessions = history.slice(0, 4);

  // Same weight for 4+ sessions
  const weights = recentSessions.map(s => s.weight);
  const allSameWeight = new Set(weights).size === 1;

  // Not hitting target reps
  const avgReps = average(recentSessions.map(s => s.reps));
  const targetNotMet = avgReps < targetReps;

  return allSameWeight && targetNotMet;
}
```

### RPE Creep Detection

```typescript
function detectRPECreep(history: SetHistory[]): boolean {
  const recent = history.slice(0, 5);
  const older = history.slice(5, 10);

  const recentAvgRPE = average(recent.map(s => s.rpe));
  const olderAvgRPE = average(older.map(s => s.rpe));

  // RPE increased by 0.5+ without weight increase
  const rpeIncreased = recentAvgRPE - olderAvgRPE >= 0.5;
  const weightSame = recent[0].weight === older[0].weight;

  return rpeIncreased && weightSame;
}
```

---

## API Response

Part of `/api/progression`:

```json
{
  "exercises": {
    "readyToProgress": [...],
    "plateaued": [
      {
        "exerciseId": "uuid",
        "name": "Barbell Squat",
        "stuckAt": 225,
        "sessionCount": 5,
        "suggestions": [
          "Try 5x5 instead of 4x8",
          "Add pause reps",
          "Consider a deload"
        ]
      }
    ]
  }
}
```

---

## Integration Points

### Receives from:
- MoStrength (set history)
- MoSession (session data)

### Provides to:
- MoProgress (plateau detection)
- MoFatigue (RPE trends)
- Progress page (charts)

---

## Future Enhancements

- [ ] Dedicated trends API endpoint
- [ ] Muscle group volume balance
- [ ] Strength standards comparison
- [ ] Progress velocity predictions
