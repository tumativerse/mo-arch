---
sidebar_position: 2
title: MoProgress
---

# MoProgress

> *"The Challenger"* — "I know when you're ready for more"

**Status:** ✅ Built

MoProgress manages progression gates — the conditions that must be met before increasing weight.

---

## Purpose

- Check if user is ready to progress
- Identify plateaued exercises
- Provide progression recommendations
- Prevent premature weight increases
- Suggest plateau-breaking strategies

---

## Implementation

### Code Location

```
/lib/mo-coach/adapt/progression.ts
```

### Key Functions

```typescript
// Check all progression gates for an exercise
export async function checkProgressionGates(
  userId: string,
  exerciseId: string
): Promise<GateResults>

// Get exercises ready to progress
export async function getReadyToProgress(userId: string): Promise<ExerciseProgress[]>

// Get plateaued exercises with suggestions
export async function getPlateaued(userId: string): Promise<ExercisePlateau[]>
```

---

## Progression Gates

Before allowing weight increase, ALL gates must pass:

```
┌─────────────────────────────────────────────────┐
│              PROGRESSION GATES                   │
├─────────────────────────────────────────────────┤
│ 1. Fatigue Gate    → Score must be < 7          │
│ 2. Performance Gate → Hit target reps 2+ times  │
│ 3. RPE Gate        → Average RPE under limit    │
│ 4. Recovery Gate   → Adequate sleep & energy    │
└─────────────────────────────────────────────────┘
```

### Gate Details

| Gate | Compound | Isolation |
|------|----------|-----------|
| Fatigue | < 7 | < 7 |
| Target Reps | 2 sessions | 2 sessions |
| Max RPE | 8 | 7 |
| Min Sleep | 6 hrs | 6 hrs |
| Min Energy | 3 | 3 |

---

## Gate Logic

```typescript
interface GateResults {
  allPassed: boolean;
  gates: {
    fatigue: GateResult;
    performance: GateResult;
    rpe: GateResult;
    recovery: GateResult;
  };
  recommendation: string;
}

interface GateResult {
  passed: boolean;
  current: number;
  required: number;
  message: string;
}

async function checkProgressionGates(
  userId: string,
  exerciseId: string
): Promise<GateResults> {
  const exercise = await getExercise(exerciseId);
  const isCompound = exercise.isCompound;

  // 1. Fatigue Gate
  const fatigue = await calculateFatigue(userId);
  const fatigueGate = {
    passed: fatigue.score < 7,
    current: fatigue.score,
    required: 7,
    message: fatigue.score >= 7 ? 'Fatigue too high' : 'Fatigue OK'
  };

  // 2. Performance Gate
  const history = await getRecentHistory(userId, exerciseId, 4);
  const sessionsAtTarget = history.filter(s => s.hitTargetReps).length;
  const performanceGate = {
    passed: sessionsAtTarget >= 2,
    current: sessionsAtTarget,
    required: 2,
    message: sessionsAtTarget >= 2 ? 'Hit reps consistently' : 'Need more consistent reps'
  };

  // 3. RPE Gate
  const avgRPE = average(history.map(s => s.avgRPE));
  const maxRPE = isCompound ? 8 : 7;
  const rpeGate = {
    passed: avgRPE <= maxRPE,
    current: avgRPE,
    required: maxRPE,
    message: avgRPE <= maxRPE ? 'RPE in range' : 'RPE too high'
  };

  // 4. Recovery Gate
  const recovery = await getRecentRecovery(userId, 3);
  const recoveryOK = recovery.avgSleep >= 6 && recovery.avgEnergy >= 3;
  const recoveryGate = {
    passed: recoveryOK,
    current: recovery.avgSleep,
    required: 6,
    message: recoveryOK ? 'Recovery adequate' : 'Need better recovery'
  };

  const allPassed = fatigueGate.passed &&
                    performanceGate.passed &&
                    rpeGate.passed &&
                    recoveryGate.passed;

  return {
    allPassed,
    gates: {
      fatigue: fatigueGate,
      performance: performanceGate,
      rpe: rpeGate,
      recovery: recoveryGate
    },
    recommendation: allPassed
      ? `Ready to add ${isCompound ? '5' : '2.5'} lbs`
      : getBlockedRecommendation(gates)
  };
}
```

---

## Plateau Detection

```typescript
interface ExercisePlateau {
  exerciseId: string;
  exerciseName: string;
  stuckAt: number;           // Weight stuck at
  sessionCount: number;      // How many sessions at this weight
  avgRPE: number;
  suggestions: string[];
}

function detectPlateau(history: SetHistory[]): boolean {
  // Same weight for 4+ sessions
  const weights = history.slice(0, 4).map(s => s.weight);
  const sameWeight = new Set(weights).size === 1;

  // Not hitting target reps
  const avgReps = average(history.slice(0, 4).map(s => s.reps));
  const belowTarget = avgReps < targetReps - 1;

  return sameWeight && (belowTarget || history.length >= 4);
}
```

### Plateau-Breaking Strategies

| Strategy | When to Use |
|----------|-------------|
| Drop set | RPE consistently high |
| Different rep range | Stuck for 4+ sessions |
| Variation exercise | Stuck for 6+ sessions |
| Deload then retry | After prolonged plateau |
| Increase frequency | Low volume on exercise |

---

## API Response

Part of `/api/progression`:

```json
{
  "exercises": {
    "readyToProgress": [
      {
        "exerciseId": "uuid",
        "name": "Barbell Bench Press",
        "currentWeight": 185,
        "suggestedWeight": 190,
        "gates": {
          "fatigue": { "passed": true },
          "performance": { "passed": true },
          "rpe": { "passed": true },
          "recovery": { "passed": true }
        }
      }
    ],
    "plateaued": [
      {
        "exerciseId": "uuid",
        "name": "Overhead Press",
        "stuckAt": 135,
        "sessionCount": 5,
        "suggestions": [
          "Try 5x5 instead of 3x8",
          "Add push press as assistance",
          "Consider a mini-deload"
        ]
      }
    ]
  }
}
```

---

## Integration Points

### Receives from:
- MoFatigue (fatigue score)
- MoStrength (performance data)
- MoRecover (recovery data)

### Provides to:
- MoSuggest (progression recommendations)
- Progress page (ready/plateaued lists)
- Workout UI (weight suggestions)
