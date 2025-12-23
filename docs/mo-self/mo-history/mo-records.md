---
sidebar_position: 1
title: MoRecords
---

# MoRecords

> *"The Historian"* — "I celebrate your victories"

**Status:** ✅ Built

MoRecords tracks personal records (PRs) with automatic detection and estimated 1RM calculation using the Brzycki formula.

---

## Purpose

- Automatically detect new PRs when sets are logged
- Calculate estimated 1RM for comparison
- Track PR history per exercise
- Provide PR achievements for motivation

---

## Implementation

### Code Location

```
/lib/mo-self/history/records.ts
```

### Key Functions

```typescript
// Calculate estimated 1RM using Brzycki formula
export function calculateEstimated1RM(weight: number, reps: number): number

// Check if a set is a new PR and record it
export async function checkAndRecordPR(
  userId: string,
  exerciseId: string,
  weight: number,
  reps: number,
  setId?: string
): Promise<PRCheckResult>

// Get all PRs for a user
export async function getAllPRs(userId: string): Promise<PersonalRecord[]>

// Get PRs for a specific exercise
export async function getExercisePRs(
  userId: string,
  exerciseId: string
): Promise<PersonalRecord[]>
```

### Usage

```typescript
import { checkAndRecordPR, getAllPRs } from '@/lib/mo-self';

// Auto-detect PR when logging a set
const result = await checkAndRecordPR(userId, exerciseId, 225, 5);

if (result.isNewPR) {
  console.log(`New PR! ${result.prType}: ${result.newRecord}`);
  console.log(`Estimated 1RM: ${result.estimated1RM}`);
}

// Get all PRs
const prs = await getAllPRs(userId);
```

---

## Data Model

```typescript
interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;

  // The record
  weight: number;
  reps: number;
  estimated1RM: number;

  // Reference
  setId: string | null;
  achievedAt: Date;

  createdAt: Date;
}

interface PRCheckResult {
  isNewPR: boolean;
  prType: 'weight' | 'reps' | 'estimated_1rm' | null;
  previousBest: number | null;
  newRecord: number | null;
  estimated1RM: number;
  improvement: number | null;     // Percentage improvement
}
```

### Database Table

```sql
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exercise_id UUID REFERENCES exercises(id),
  weight DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  estimated_1rm DECIMAL(6,2) NOT NULL,
  set_id UUID REFERENCES session_sets(id),
  achieved_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, exercise_id)  -- One PR per exercise per user
);
```

---

## Brzycki Formula

Estimated 1RM is calculated using:

```
1RM = weight × (36 / (37 - reps))
```

| Reps | Multiplier | Example (200 lbs) |
|------|------------|-------------------|
| 1 | 1.00 | 200 lbs |
| 3 | 1.06 | 212 lbs |
| 5 | 1.13 | 225 lbs |
| 8 | 1.24 | 248 lbs |
| 10 | 1.33 | 267 lbs |
| 12 | 1.44 | 288 lbs |

---

## Auto-Detection Logic

When a set is logged, MoRecords checks:

1. **Weight PR** — Is this weight higher than previous best at same or lower reps?
2. **Rep PR** — Is this more reps than previous best at same or higher weight?
3. **Estimated 1RM PR** — Is the calculated 1RM higher than previous best?

```typescript
// Simplified logic
if (currentWeight > previousWeight && currentReps >= previousReps) {
  // Weight PR
}
if (currentReps > previousReps && currentWeight >= previousWeight) {
  // Rep PR
}
if (current1RM > previous1RM) {
  // Estimated 1RM PR
}
```

---

## API Endpoints

### GET /api/records

Returns all PRs for the user.

**Query params:** `exerciseId` (optional)

```json
{
  "records": [
    {
      "exerciseId": "uuid",
      "exerciseName": "Barbell Bench Press",
      "weight": 225,
      "reps": 5,
      "estimated1RM": 253,
      "achievedAt": "2024-12-20T10:30:00Z"
    }
  ]
}
```

---

## Integration Points

### Receives from:
- `/api/ppl/session/sets` (auto-detection on set logging)

### Provides to:
- Progress page (PR display)
- Dashboard (recent PRs)
- MoAlerts (PR notifications - future)

---

## Auto-Hook

PR detection is automatically triggered when logging sets:

```typescript
// In /api/ppl/session/sets POST handler
const prResult = await checkAndRecordPR(
  user.id,
  sessionExercise.exerciseId,
  weight,
  reps,
  set.id
);

// Returns PR info in response
return NextResponse.json({
  set,
  pr: prResult?.isNewPR ? prResult : null
});
```
