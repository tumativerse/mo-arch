---
sidebar_position: 5
title: MoMobility
---

# MoMobility

> *"The Flexibility Guide"* — "I keep you moving freely"

**Status:** ⚠️ Partial (exercises exist, no dedicated tracking)

MoMobility will track mobility work, stretching routines, and yoga sessions.

---

## Purpose

- Track stretching and mobility sessions
- Provide mobility routines
- Target specific areas based on workout history
- Reduce injury risk through flexibility work

---

## Current State

Mobility exercises exist in the exercise library with `exerciseUse: 'warmup'` or `'both'`, but there's no dedicated mobility session tracking.

Current mobility exercises include:
- Dynamic stretches (arm circles, leg swings)
- Static stretches (hamstring stretch, quad stretch)
- Foam rolling movements
- Band work for mobility

---

## Planned Data Model

```typescript
interface MobilitySession {
  id: string;
  userId: string;

  // Session info
  duration: number;           // minutes
  sessionType: MobilityType;
  focusAreas: MuscleGroup[];

  // Exercises
  exercises: MobilityExercise[];

  // Rating
  flexibilityRating: number;  // 1-5 how loose you feel after

  completedAt: Date;
  notes: string | null;
}

interface MobilityExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  holdTime: number;           // seconds
  reps: number | null;
  side: 'left' | 'right' | 'both' | null;
}

type MobilityType =
  | 'dynamic'           // Pre-workout
  | 'static'            // Post-workout
  | 'foam_rolling'      // Self-myofascial release
  | 'yoga'              // Full yoga session
  | 'targeted';         // Specific area focus

type MuscleGroup =
  | 'hip_flexors'
  | 'hamstrings'
  | 'quads'
  | 'glutes'
  | 'lower_back'
  | 'upper_back'
  | 'shoulders'
  | 'chest'
  | 'neck'
  | 'ankles'
  | 'wrists';
```

---

## Planned Features

### Smart Suggestions

Based on recent workouts, suggest mobility focus:

| Recent Workout | Suggested Focus |
|----------------|-----------------|
| Push day | Chest, shoulders, triceps |
| Pull day | Lats, biceps, upper back |
| Legs day | Hip flexors, hamstrings, quads |
| Heavy squat | Hip mobility, ankles |
| Heavy deadlift | Hamstrings, lower back |

### Pre-Built Routines

| Routine | Duration | Focus |
|---------|----------|-------|
| Morning Flow | 10 min | Full body wake-up |
| Post-Push | 8 min | Chest, shoulders |
| Post-Pull | 8 min | Lats, biceps |
| Post-Legs | 10 min | Hips, quads, hamstrings |
| Desk Worker | 15 min | Hips, neck, shoulders |
| Recovery Day | 20 min | Full body |

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mobility` | GET | Get mobility sessions |
| `/api/mobility` | POST | Log mobility session |
| `/api/mobility/routines` | GET | Get pre-built routines |
| `/api/mobility/suggest` | GET | Get suggested routine |

---

## Integration Points

### Will Receive from:
- MoSession (recent workout data for suggestions)
- MoSoreness (target sore areas)
- Routine library

### Will Provide to:
- MoRecover (mobility as recovery activity)
- Dashboard (recent mobility work)
- MoAlerts (mobility reminders)

---

## Implementation Tasks

- [ ] Create mobility_sessions table
- [ ] Build mobility exercise library
- [ ] Create pre-built routines
- [ ] Build suggestion algorithm
- [ ] Create mobility logging UI
- [ ] Add mobility to recovery view
