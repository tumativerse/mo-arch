---
sidebar_position: 2
title: PPL Endpoints
---

# PPL Workout Endpoints

Endpoints for the Push/Pull/Legs training system.

---

## GET Today's Workout

```
GET /api/ppl/today
```

Returns today's workout based on PPL rotation, including fatigue status and deload modifiers.

### Response

```json
{
  "templateDay": {
    "id": "abc123",
    "name": "Push A",
    "dayType": "push",
    "targetMuscles": ["chest", "shoulders", "triceps"],
    "estimatedDuration": 60,
    "notes": null
  },
  "slots": [
    {
      "id": "slot1",
      "slotOrder": 1,
      "slotType": "primary",
      "movementPattern": "horizontal_push",
      "targetMuscles": ["chest"],
      "sets": 4,
      "repRangeMin": 6,
      "repRangeMax": 8,
      "rpeTarget": 8,
      "restSeconds": 180,
      "suggestedExercise": {
        "id": "ex123",
        "name": "Barbell Bench Press",
        "slug": "barbell-bench-press",
        "equipment": ["barbell", "bench"]
      }
    }
  ],
  "warmup": {
    "id": "warmup1",
    "name": "Push Day Warmup",
    "estimatedDuration": 10,
    "phases": [
      {
        "name": "General",
        "exercises": [...]
      }
    ]
  },
  "dayNumber": 1,
  "trainingStatus": {
    "fatigueScore": 4,
    "fatigueLevel": "normal",
    "isDeloadActive": false
  }
}
```

---

## Start Session

```
POST /api/ppl/session
```

Creates a new workout session for a template day.

### Request Body

```json
{
  "templateDayId": "abc123"
}
```

### Response

```json
{
  "session": {
    "id": "session123",
    "userId": "user456",
    "templateDayId": "abc123",
    "sessionNumber": 15,
    "status": "in_progress",
    "startedAt": "2024-12-22T10:00:00Z"
  },
  "exercises": [
    {
      "id": "se123",
      "exerciseId": "ex123",
      "slotId": "slot1",
      "exerciseOrder": 1,
      "targetSets": 4,
      "targetReps": "6-8"
    }
  ]
}
```

---

## Complete Session

```
PATCH /api/ppl/session
```

Marks a session as complete and calculates summary metrics. Also triggers streak update.

### Request Body

```json
{
  "sessionId": "session123",
  "notes": "Felt strong today"
}
```

### Response

```json
{
  "session": {
    "id": "session123",
    "status": "completed",
    "completedAt": "2024-12-22T11:15:00Z",
    "totalDuration": 75,
    "totalVolume": 15240,
    "totalSets": 18,
    "avgRpe": 7.5,
    "notes": "Felt strong today"
  },
  "metrics": {
    "totalVolume": 15240,
    "totalSets": 18,
    "avgRpe": 7.5,
    "duration": 75
  },
  "streak": {
    "currentStreak": 5,
    "longestStreak": 12,
    "lastWorkoutDate": "2024-12-22"
  }
}
```

---

## Log Set

```
POST /api/ppl/session/sets
```

Logs a set for an exercise. Auto-detects personal records.

### Request Body

```json
{
  "sessionExerciseId": "se123",
  "setNumber": 1,
  "weight": 185,
  "weightUnit": "lbs",
  "reps": 8,
  "rpe": 7,
  "isWarmup": false,
  "notes": null
}
```

### Response

```json
{
  "set": {
    "id": "set123",
    "sessionExerciseId": "se123",
    "setNumber": 1,
    "weight": 185,
    "weightUnit": "lbs",
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

If no PR was set, `pr` will be `null`.

---

## Delete Set

```
DELETE /api/ppl/session/sets?setId=set123
```

Removes a logged set.

### Response

```json
{
  "success": true
}
```

---

## Get Exercise Alternatives

```
GET /api/exercises/alternatives
```

Returns alternative exercises for a movement pattern slot.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `pattern` | string | Movement pattern (e.g., "horizontal_push") |
| `exerciseId` | string | Current exercise ID (optional) |
| `equipment` | string | Equipment level filter (optional) |
| `limit` | number | Max results (default: 10) |

### Response

```json
{
  "alternatives": [
    {
      "id": "ex456",
      "name": "Dumbbell Bench Press",
      "slug": "dumbbell-bench-press",
      "equipment": ["dumbbells", "bench"],
      "difficulty": "intermediate",
      "priority": "essential",
      "score": 85,
      "previouslyUsed": true,
      "isDirectAlternative": true
    }
  ]
}
```
