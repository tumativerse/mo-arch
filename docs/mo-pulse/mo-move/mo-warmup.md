---
sidebar_position: 3
title: MoWarmup
---

# MoWarmup

> *"The Preparer"* — "I get you ready to perform"

**Status:** ✅ Built

MoWarmup manages warmup routines with templates specific to each workout type (push/pull/legs).

---

## Purpose

- Provide day-type specific warmup templates
- Track warmup completion/skipping
- Guide users through warmup phases
- Log warmup for recovery analysis

---

## Implementation

### Code Location

```
/lib/mo-pulse/move/warmup.ts
/app/api/warmup/route.ts
```

### Key Functions

```typescript
// Get warmup template for a day type
export async function getWarmupTemplate(dayType: string): Promise<WarmupTemplate | null>

// Start warmup for a session
export async function startWarmup(sessionId: string, templateId?: string): Promise<WarmupLog>

// Complete warmup
export async function completeWarmup(sessionId: string, notes?: string): Promise<WarmupLog>

// Skip warmup
export async function skipWarmup(sessionId: string): Promise<WarmupLog>
```

---

## Data Model

```typescript
interface WarmupTemplate {
  id: string;
  name: string;
  dayType: string;            // push, pull, legs
  estimatedDuration: number;  // minutes
  description: string | null;
  phases: WarmupPhase[];
}

interface WarmupPhase {
  id: string;
  phaseOrder: number;
  phaseType: WarmupPhaseType;
  name: string;
  durationSeconds: number;
  description: string | null;
  exercises: WarmupExercise[];
}

interface WarmupExercise {
  exerciseId: string;
  exerciseName: string;
  exerciseOrder: number;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  notes: string | null;
}

interface WarmupLog {
  id: string;
  userId: string;
  sessionId: string;
  templateId: string | null;
  status: 'started' | 'completed' | 'skipped';
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null;
  skippedPhases: string[];
  notes: string | null;
}

type WarmupPhaseType = 'general' | 'dynamic' | 'movement_prep';
```

### Database Tables

```sql
CREATE TABLE warmup_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  day_type day_type NOT NULL,
  estimated_duration INTEGER DEFAULT 10,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE warmup_phases (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES warmup_templates(id),
  phase_order INTEGER NOT NULL,
  phase_type warmup_phase_type NOT NULL,
  name VARCHAR(100) NOT NULL,
  duration_seconds INTEGER,
  description TEXT
);

CREATE TABLE warmup_phase_exercises (
  id UUID PRIMARY KEY,
  phase_id UUID REFERENCES warmup_phases(id),
  exercise_id UUID REFERENCES exercises(id),
  exercise_order INTEGER NOT NULL,
  sets INTEGER DEFAULT 1,
  reps INTEGER,
  duration_seconds INTEGER,
  notes TEXT
);

CREATE TABLE warmup_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES workout_sessions(id),
  template_id UUID REFERENCES warmup_templates(id),
  status VARCHAR(20) DEFAULT 'started',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration INTEGER,
  skipped_phases TEXT[],
  notes TEXT
);
```

---

## Warmup Phases

Each warmup template has 3 phases:

### 1. General (2-3 min)
Low-intensity cardio to raise heart rate and body temperature.
- Jump rope
- Jumping jacks
- Light jogging

### 2. Dynamic (3-4 min)
Dynamic stretches targeting the day's muscle groups.
- Arm circles (push day)
- Band pull-aparts (pull day)
- Leg swings (leg day)

### 3. Movement Prep (3-4 min)
Light versions of main exercises to practice movement patterns.
- Empty bar bench press (push day)
- Light rows (pull day)
- Bodyweight squats (leg day)

---

## API Endpoints

### GET /api/warmup

Get warmup template for a day type.

**Query params:** `dayType` (push/pull/legs)

```json
{
  "template": {
    "id": "uuid",
    "name": "Push Day Warmup",
    "estimatedDuration": 10,
    "phases": [
      {
        "name": "General Warmup",
        "phaseType": "general",
        "durationSeconds": 180,
        "exercises": [
          {
            "name": "Jumping Jacks",
            "sets": 1,
            "durationSeconds": 60
          }
        ]
      }
    ]
  }
}
```

### POST /api/warmup

Start, complete, or skip warmup.

**Start:**
```json
{
  "action": "start",
  "sessionId": "uuid",
  "templateId": "uuid"
}
```

**Complete:**
```json
{
  "action": "complete",
  "sessionId": "uuid",
  "notes": "Felt good"
}
```

**Skip:**
```json
{
  "action": "skip",
  "sessionId": "uuid"
}
```

---

## Integration Points

### Provides to:
- Workout UI (warmup flow)
- MoSession (warmup state)

### Receives from:
- MoSettings (warmup enabled/disabled)
- Template system (warmup templates)

---

## User Flow

```
1. User starts workout
   → Check if warmup enabled (MoSettings)
   → If yes, show warmup option

2. User starts warmup
   → POST /api/warmup { action: "start" }
   → Show phase-by-phase guide

3. User completes each phase
   → Update UI progress

4. User finishes warmup
   → POST /api/warmup { action: "complete" }
   → Transition to main workout

OR

3. User skips warmup
   → POST /api/warmup { action: "skip" }
   → Proceed to main workout
```
