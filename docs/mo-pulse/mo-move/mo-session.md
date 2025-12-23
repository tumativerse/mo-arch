---
sidebar_position: 2
title: MoSession
---

# MoSession

> *"The Workout Manager"* — "I orchestrate your training"

**Status:** ✅ Built

MoSession manages workout session state — starting workouts, tracking progress, and completing sessions.

---

## Purpose

- Determine today's workout from PPL rotation
- Create and manage workout sessions
- Track session state (planned → in_progress → completed)
- Calculate session metrics on completion
- Trigger post-workout hooks (streaks, etc.)

---

## Implementation

### Code Location

```
/app/api/ppl/today/route.ts      → Get today's workout
/app/api/ppl/session/route.ts    → Start/complete sessions
```

### Key Operations

```typescript
// Get today's workout
GET /api/ppl/today

// Start a session
POST /api/ppl/session { templateDayId }

// Complete a session
PATCH /api/ppl/session { sessionId, notes? }
```

---

## Data Model

```typescript
interface WorkoutSession {
  id: string;
  userId: string;
  templateDayId: string;
  sessionNumber: number;        // Sequential session count

  // State
  status: SessionStatus;
  startedAt: Date | null;
  completedAt: Date | null;

  // Metrics (calculated on completion)
  totalDuration: number | null; // minutes
  totalVolume: number | null;   // total weight lifted
  totalSets: number | null;
  avgRpe: number | null;

  notes: string | null;
}

type SessionStatus =
  | 'planned'      // Created but not started
  | 'warmup'       // Warmup in progress
  | 'in_progress'  // Main workout active
  | 'completed'    // Finished
  | 'skipped';     // User skipped
```

### Database Tables

```sql
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  template_day_id UUID REFERENCES template_days(id),
  session_number INTEGER NOT NULL,
  status session_status DEFAULT 'planned',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  total_duration INTEGER,
  total_volume DECIMAL(10,2),
  total_sets INTEGER,
  avg_rpe DECIMAL(3,1),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id),
  exercise_id UUID REFERENCES exercises(id),
  slot_id UUID REFERENCES template_slots(id),
  exercise_order INTEGER NOT NULL,
  target_sets INTEGER,
  target_reps VARCHAR(20),
  notes TEXT
);
```

---

## PPL Rotation

The 6-day PPL rotation determines today's workout:

```typescript
const PPL_ROTATION = [
  'Push A',   // Day 1
  'Pull A',   // Day 2
  'Legs A',   // Day 3
  'Push B',   // Day 4
  'Pull B',   // Day 5
  'Legs B',   // Day 6
];

function getTodayWorkout(lastSessionNumber: number): string {
  const dayIndex = lastSessionNumber % 6;
  return PPL_ROTATION[dayIndex];
}
```

---

## API Endpoints

### GET /api/ppl/today

Returns today's workout with slots and exercise suggestions.

```json
{
  "templateDay": {
    "id": "uuid",
    "name": "Push A",
    "dayType": "push",
    "targetMuscles": ["chest", "shoulders", "triceps"],
    "estimatedDuration": 60
  },
  "slots": [
    {
      "id": "uuid",
      "slotOrder": 1,
      "slotType": "primary",
      "movementPattern": "horizontal_push",
      "sets": 4,
      "repRangeMin": 6,
      "repRangeMax": 8,
      "rpeTarget": 8,
      "suggestedExercise": {
        "id": "uuid",
        "name": "Barbell Bench Press"
      }
    }
  ],
  "warmup": { ... },
  "dayNumber": 1,
  "trainingStatus": {
    "fatigueScore": 4,
    "fatigueLevel": "normal",
    "isDeloadActive": false
  }
}
```

### POST /api/ppl/session

Starts a new workout session.

**Request:**
```json
{
  "templateDayId": "uuid"
}
```

**Response:**
```json
{
  "session": {
    "id": "uuid",
    "sessionNumber": 15,
    "status": "in_progress",
    "startedAt": "2024-12-22T10:00:00Z"
  },
  "exercises": [
    {
      "id": "uuid",
      "exerciseId": "uuid",
      "exerciseName": "Barbell Bench Press",
      "targetSets": 4,
      "targetReps": "6-8"
    }
  ]
}
```

### PATCH /api/ppl/session

Completes a session and calculates metrics.

**Request:**
```json
{
  "sessionId": "uuid",
  "notes": "Felt strong today"
}
```

**Response:**
```json
{
  "session": {
    "status": "completed",
    "completedAt": "2024-12-22T11:15:00Z",
    "totalDuration": 75,
    "totalVolume": 15240,
    "totalSets": 18,
    "avgRpe": 7.5
  },
  "streak": {
    "currentStreak": 5,
    "longestStreak": 12
  }
}
```

---

## Session Flow

```
1. User opens workout page
   → GET /api/ppl/today
   → Shows day overview

2. User taps "Start Workout"
   → POST /api/ppl/session
   → Creates session, enters focused mode

3. User logs sets
   → POST /api/ppl/session/sets (for each set)
   → Updates UI with completion

4. User taps "Complete Workout"
   → PATCH /api/ppl/session
   → Calculates metrics, updates streak
   → Shows summary
```

---

## Integration Points

### Provides to:
- Workout UI (session state)
- MoStreaks (workout completion trigger)
- Dashboard (recent sessions)
- MoFatigue (session data for fatigue calc)

### Receives from:
- MoStrength (set data)
- MoWarmup (warmup state)
- Template system (workout structure)
