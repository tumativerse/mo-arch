---
sidebar_position: 1
title: MoStrength
---

# MoStrength

> *"The Iron Counter"* — "I track every rep you lift"

**Status:** ✅ Built

MoStrength handles weight training tracking — logging sets with weight, reps, and RPE.

---

## Purpose

- Log individual sets during workouts
- Track weight, reps, and RPE per set
- Support warmup vs working sets
- Calculate session volume and averages
- Trigger PR detection

---

## Implementation

### Code Location

```
/app/api/ppl/session/sets/route.ts
```

### Key Operations

```typescript
// Log a set
POST /api/ppl/session/sets
{
  sessionExerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  isWarmup?: boolean;
}

// Delete a set
DELETE /api/ppl/session/sets?setId=xxx
```

---

## Data Model

```typescript
interface SessionSet {
  id: string;
  sessionExerciseId: string;
  setNumber: number;

  // Performance
  weight: number;
  weightUnit: 'lbs' | 'kg';
  reps: number;
  rpe: number | null;

  // Metadata
  isWarmup: boolean;
  completedAt: Date;
  notes: string | null;
}

interface SetLogData {
  sessionExerciseId: string;
  setNumber: number;
  weight: number;
  weightUnit?: 'lbs' | 'kg';
  reps: number;
  rpe?: number;
  isWarmup?: boolean;
  notes?: string;
}
```

### Database Table

```sql
CREATE TABLE session_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_exercise_id UUID REFERENCES session_exercises(id),
  set_number INTEGER NOT NULL,
  weight DECIMAL(6,2),
  weight_unit VARCHAR(10) DEFAULT 'lbs',
  reps INTEGER,
  rpe DECIMAL(3,1),
  is_warmup BOOLEAN DEFAULT false,
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,

  UNIQUE(session_exercise_id, set_number)
);
```

---

## RPE Scale

Rate of Perceived Exertion (1-10):

| RPE | Description | Reps in Reserve |
|-----|-------------|-----------------|
| 6 | Light warmup | 4+ |
| 7 | Could do 3 more | 3 |
| 8 | Could do 2 more | 2 |
| 9 | Could do 1 more | 1 |
| 10 | Maximum effort | 0 |

Target RPE varies by slot type:
- Primary exercises: RPE 7-8
- Secondary: RPE 7-8
- Accessory: RPE 8-9

---

## Volume Calculation

```typescript
// Volume per set
const setVolume = weight * reps;

// Session total (excluding warmup sets)
const sessionVolume = sets
  .filter(s => !s.isWarmup)
  .reduce((sum, s) => sum + (s.weight * s.reps), 0);

// Average RPE (excluding warmup)
const avgRpe = sets
  .filter(s => !s.isWarmup && s.rpe)
  .reduce((sum, s) => sum + s.rpe, 0) / count;
```

---

## API Endpoints

### POST /api/ppl/session/sets

Logs a set and checks for PRs.

**Request:**
```json
{
  "sessionExerciseId": "uuid",
  "setNumber": 1,
  "weight": 185,
  "reps": 8,
  "rpe": 7,
  "isWarmup": false
}
```

**Response:**
```json
{
  "set": {
    "id": "uuid",
    "setNumber": 1,
    "weight": 185,
    "reps": 8,
    "rpe": 7,
    "isWarmup": false,
    "completedAt": "2024-12-22T10:15:00Z"
  },
  "pr": {
    "isNewPR": true,
    "prType": "weight",
    "previousBest": 180,
    "newRecord": 185,
    "estimated1RM": 228
  }
}
```

### DELETE /api/ppl/session/sets

Removes a set.

**Query params:** `setId`

---

## Integration Points

### Provides to:
- MoRecords (set data for PR detection)
- MoSession (volume/RPE for session summary)
- MoFatigue (RPE data for fatigue calculation)
- MoProgress (performance trends)

### Receives from:
- Workout UI (set logging)
- MoSuggest (weight suggestions)

---

## Auto-Hooks

When a working set is logged:

1. **PR Detection** — Calls `checkAndRecordPR()` from MoRecords
2. **User Defaults Update** — Saves last weight/reps for exercise

```typescript
// After logging set
if (!isWarmup && weight && reps) {
  // Check for PR
  const prResult = await checkAndRecordPR(userId, exerciseId, weight, reps, set.id);

  // Update user defaults for next time
  await updateUserExerciseDefault(userId, exerciseId, { weight, reps, rpe });
}
```
