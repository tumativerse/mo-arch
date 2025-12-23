---
sidebar_position: 4
title: MoSuggest
---

# MoSuggest

> *"The Advisor"* — "I know what weight to use"

**Status:** ✅ Built

MoSuggest provides weight, set, and rest recommendations based on history, fatigue, and goals.

---

## Purpose

- Suggest working weight for exercises
- Recommend warmup set progression
- Adjust for fatigue and deload
- Provide rest time recommendations
- Learn from user's performance

---

## Implementation

### Code Location

```
/lib/mo-coach/adapt/suggestions.ts
```

### Key Functions

```typescript
// Get weight suggestion for an exercise
export async function suggestWeight(
  userId: string,
  exerciseId: string
): Promise<WeightSuggestion>

// Get warmup set progression
export async function suggestWarmupSets(
  userId: string,
  exerciseId: string,
  workWeight: number
): Promise<WarmupSet[]>

// Get rest time recommendation
export async function suggestRest(
  slotType: SlotType,
  rpe: number
): Promise<number>
```

---

## Weight Suggestion Logic

```typescript
async function suggestWeight(
  userId: string,
  exerciseId: string
): Promise<WeightSuggestion> {
  // Get user's last performance
  const lastPerformance = await getLastPerformance(userId, exerciseId);
  const defaults = await getUserExerciseDefaults(userId, exerciseId);

  // Start with last used weight
  let suggestedWeight = lastPerformance?.weight || defaults?.lastWeight || 0;

  // Check if ready to progress
  const gates = await checkProgressionGates(userId, exerciseId);
  if (gates.allPassed) {
    const exercise = await getExercise(exerciseId);
    const increment = exercise.isCompound ? 5 : 2.5;
    suggestedWeight += increment;
  }

  // Apply fatigue adjustment
  const fatigue = await calculateFatigue(userId);
  if (fatigue.score >= 7) {
    suggestedWeight *= 0.9;  // -10% for high fatigue
  } else if (fatigue.score >= 5) {
    suggestedWeight *= 0.95; // -5% for elevated
  }

  // Apply deload modifier
  const deload = await getActiveDeload(userId);
  if (deload) {
    suggestedWeight *= deload.intensityModifier;
  }

  // Round to nearest increment
  suggestedWeight = roundToIncrement(suggestedWeight, 2.5);

  return {
    weight: suggestedWeight,
    reps: getTargetReps(exerciseId),
    rpe: getTargetRPE(exerciseId),
    basis: getBasis(lastPerformance, gates, fatigue, deload),
    modifiers: {
      fatigue: fatigue.score >= 5,
      deload: !!deload,
      progression: gates.allPassed
    }
  };
}
```

---

## Warmup Set Progression

Standard warmup progression to working weight:

```typescript
function suggestWarmupSets(workWeight: number): WarmupSet[] {
  return [
    {
      weight: Math.round(workWeight * 0.5 / 5) * 5,   // 50%
      reps: 10,
      note: 'Easy warmup, feel the movement'
    },
    {
      weight: Math.round(workWeight * 0.7 / 5) * 5,   // 70%
      reps: 6,
      note: 'Build speed, find your groove'
    },
    {
      weight: Math.round(workWeight * 0.85 / 5) * 5,  // 85%
      reps: 3,
      note: 'Prime the muscles, feel the weight'
    }
  ];
}
```

### Example

For 200 lb working weight:
- Set 1: 100 lbs × 10 (50%)
- Set 2: 140 lbs × 6 (70%)
- Set 3: 170 lbs × 3 (85%)

---

## Rest Time Recommendations

| Slot Type | Base Rest | After RPE 8+ | After RPE 9+ |
|-----------|-----------|--------------|--------------|
| Primary | 180s | 210s | 240s |
| Secondary | 120s | 150s | 180s |
| Accessory | 90s | 120s | 150s |

```typescript
function suggestRest(slotType: SlotType, rpe: number): number {
  const baseRest = {
    primary: 180,
    secondary: 120,
    accessory: 90,
    optional: 60
  }[slotType];

  // Add time for high RPE
  if (rpe >= 9) return baseRest + 60;
  if (rpe >= 8) return baseRest + 30;
  return baseRest;
}
```

---

## Data Model

```typescript
interface WeightSuggestion {
  weight: number;
  reps: string;              // "6-8"
  rpe: number;
  notes: string;
  basis: string;             // Explanation
  modifiers: {
    fatigue: boolean;
    deload: boolean;
    progression: boolean;
  };
}

interface WarmupSet {
  weight: number;
  reps: number;
  note: string;
}
```

---

## API Endpoints

### GET /api/training/suggest

Returns suggestion for an exercise:

```json
{
  "exercise": {
    "id": "uuid",
    "name": "Barbell Bench Press"
  },
  "suggestion": {
    "weight": 190,
    "reps": "6-8",
    "rpe": 7,
    "notes": "Progress from 185 - all gates passed"
  },
  "warmupSets": [
    { "weight": 95, "reps": 10, "note": "50% - empty feel" },
    { "weight": 135, "reps": 6, "note": "70% - groove" },
    { "weight": 160, "reps": 3, "note": "85% - prime" }
  ],
  "modifiers": {
    "fatigueAdjustment": 0,
    "deloadAdjustment": 0,
    "progressionReady": true
  }
}
```

---

## Integration Points

### Receives from:
- MoFatigue (fatigue adjustments)
- MoDeload (deload modifiers)
- MoProgress (progression status)
- User exercise defaults (last performance)

### Provides to:
- Workout UI (weight suggestions)
- Set logging (pre-fill weights)
