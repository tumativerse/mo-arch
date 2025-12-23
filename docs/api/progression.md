---
sidebar_position: 4
title: Progression Endpoints
---

# Progression Endpoints

Endpoints for training analysis, fatigue tracking, and progression recommendations.

---

## Get Progression Analysis

```
GET /api/progression
```

Returns comprehensive training analysis including fatigue, plateaus, and recommendations.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `exerciseId` | string | - | Filter to specific exercise |
| `days` | number | 14 | Analysis time window |

### Response

```json
{
  "fatigue": {
    "score": 5,
    "level": "elevated",
    "components": {
      "rpeCreep": 1.5,
      "performanceDrop": 1,
      "recoveryDebt": 1.5,
      "volumeLoad": 0.5,
      "streak": 0.5
    },
    "message": "Fatigue is elevated. Consider reducing volume.",
    "recommendations": [
      "Take an extra rest day this week",
      "Focus on sleep quality"
    ]
  },
  "exercises": {
    "readyToProgress": [
      {
        "exerciseId": "ex123",
        "name": "Barbell Bench Press",
        "currentWeight": 185,
        "suggestedWeight": 190,
        "reason": "Hit all reps at RPE 7 for 3 sessions"
      }
    ],
    "plateaued": [
      {
        "exerciseId": "ex456",
        "name": "Barbell Squat",
        "stuckAt": 225,
        "sessionCount": 5,
        "suggestions": [
          "Try a different rep range (5x5)",
          "Add pause reps",
          "Consider a deload week"
        ]
      }
    ],
    "needsAttention": [
      {
        "exerciseId": "ex789",
        "name": "Overhead Press",
        "issue": "RPE consistently at 9+",
        "suggestion": "Reduce weight by 5-10%"
      }
    ]
  },
  "recovery": {
    "avgSleep": 7.2,
    "avgEnergy": 3.8,
    "avgSoreness": 2.5,
    "trend": "stable"
  },
  "sessions": {
    "count": 8,
    "avgDuration": 72,
    "avgRpe": 7.3,
    "totalVolume": 125000
  }
}
```

---

## Get Training Status

```
GET /api/training/status
```

Returns current fatigue score and deload status.

### Response

```json
{
  "fatigue": {
    "score": 5,
    "level": "elevated",
    "color": "orange"
  },
  "deload": {
    "isActive": false,
    "isRecommended": true,
    "reason": "Elevated fatigue for 5+ days",
    "type": null,
    "daysRemaining": null
  },
  "lastWorkout": "2024-12-21",
  "streak": 5
}
```

---

## Trigger Deload

```
POST /api/training/status
```

Manually start or end a deload period.

### Request Body (Start Deload)

```json
{
  "action": "start",
  "type": "volume",
  "days": 7
}
```

### Deload Types

| Type | Volume | Intensity | Description |
|------|--------|-----------|-------------|
| `volume` | 60% | 100% | Fewer sets, same weight |
| `intensity` | 70% | 85% | Fewer sets, lighter weight |
| `full_rest` | 0% | 0% | Complete rest |

### Response

```json
{
  "deload": {
    "id": "deload123",
    "type": "volume",
    "startDate": "2024-12-22",
    "endDate": "2024-12-29",
    "trigger": "manual",
    "volumeModifier": 0.6,
    "intensityModifier": 1.0
  }
}
```

### Request Body (End Deload)

```json
{
  "action": "end"
}
```

---

## Get Weight Suggestion

```
GET /api/training/suggest
```

Returns suggested weight for an exercise based on history and current status.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `exerciseId` | string | Exercise to get suggestion for |

### Response

```json
{
  "exercise": {
    "id": "ex123",
    "name": "Barbell Bench Press"
  },
  "suggestion": {
    "weight": 185,
    "reps": "6-8",
    "rpe": 7,
    "notes": "Based on last session performance"
  },
  "lastPerformance": {
    "weight": 185,
    "reps": 8,
    "rpe": 7,
    "date": "2024-12-20"
  },
  "warmupSets": [
    { "weight": 95, "reps": 10, "note": "50% - empty feel" },
    { "weight": 135, "reps": 6, "note": "70% - groove" },
    { "weight": 160, "reps": 3, "note": "85% - prime" }
  ],
  "modifiers": {
    "fatigueAdjustment": 0,
    "deloadAdjustment": 0,
    "progressionReady": false
  }
}
```

---

## Fatigue Calculation

The fatigue score (0-10) is calculated from multiple factors:

| Component | Range | Calculation |
|-----------|-------|-------------|
| RPE Creep | 0-2 | Upward RPE trend over sessions |
| Performance Drop | 0-2 | Average RPE above target |
| Recovery Debt | 0-3 | Sleep, energy, soreness metrics |
| Volume Load | 0-2 | Volume spike vs 4-week baseline |
| Streak Score | 0-1 | 5+ consecutive training days |

### Fatigue Levels

| Score | Level | Color | Action |
|-------|-------|-------|--------|
| 0-2 | Fresh | Green | Train hard |
| 3-4 | Normal | Yellow | Normal training |
| 5-6 | Elevated | Orange | Monitor closely |
| 7-8 | High | Red | Reduce volume |
| 9-10 | Critical | Red | Rest recommended |

---

## Progression Gates

Before allowing weight increase, all gates must pass:

1. **Fatigue Gate** - Score must be < 7
2. **Performance Gate** - Hit target reps for 2+ sessions
3. **RPE Gate** - Average RPE below threshold (8 for compound, 7 for isolation)
4. **Recovery Gate** - Adequate sleep and energy

If any gate fails, progression is blocked and alternatives are suggested.
