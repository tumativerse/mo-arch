---
sidebar_position: 1
title: MoExercises
---

# MoExercises

> *"The Encyclopedia"* — "I know every movement"

**Status:** ✅ Built

MoExercises provides the comprehensive exercise database with 200+ exercises, movement patterns, and intelligent alternatives.

---

## Purpose

- Store exercise definitions and metadata
- Categorize by movement pattern
- Provide equipment requirements
- Enable exercise alternatives
- Support search and discovery

---

## Implementation

### Database Schema

```typescript
// From schema.ts
export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  movementPattern: text("movement_pattern").notNull(),
  equipment: text("equipment").notNull(),
  primaryMuscles: text("primary_muscles").array().notNull(),
  secondaryMuscles: text("secondary_muscles").array(),
  isCompound: boolean("is_compound").default(true),
  difficulty: text("difficulty"),
  instructions: text("instructions"),
  tips: text("tips").array(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Seed Data Structure

```typescript
// From seed-exercises.ts
const exercises = [
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    movementPattern: "horizontal_push",
    equipment: "barbell",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["front_deltoids"],
    isCompound: true,
    difficulty: "intermediate",
    instructions: "Lie on bench, grip bar slightly wider than shoulders...",
    tips: ["Keep shoulder blades retracted", "Drive feet into floor"]
  },
  // ... 200+ more exercises
];
```

---

## Movement Patterns

| Pattern | Code | Description |
|---------|------|-------------|
| Horizontal Push | `horizontal_push` | Chest-focused pressing |
| Horizontal Pull | `horizontal_pull` | Back rowing movements |
| Vertical Push | `vertical_push` | Overhead pressing |
| Vertical Pull | `vertical_pull` | Pulldowns and pull-ups |
| Squat | `squat` | Knee-dominant legs |
| Hinge | `hinge` | Hip-dominant legs |
| Lunge | `lunge` | Single-leg patterns |
| Carry | `carry` | Loaded carries |
| Core | `core` | Trunk stability |
| Arm Isolation | `arm_isolation` | Biceps/triceps |
| Shoulder Isolation | `shoulder_isolation` | Delt work |
| Leg Isolation | `leg_isolation` | Quads/hams/calves |

---

## Equipment Types

| Equipment | Code | Examples |
|-----------|------|----------|
| Barbell | `barbell` | Bench, Squat, Deadlift |
| Dumbbell | `dumbbell` | DB Press, Rows |
| Cable | `cable` | Pushdowns, Flyes |
| Machine | `machine` | Leg Press, Pec Deck |
| Bodyweight | `bodyweight` | Pull-ups, Dips |
| Kettlebell | `kettlebell` | Swings, Goblet Squat |
| EZ Bar | `ez_bar` | Curls, Skullcrushers |
| Bands | `bands` | Band Pull-aparts |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exercises` | GET | List all exercises |
| `/api/exercises?pattern=X` | GET | Filter by pattern |
| `/api/exercises?equipment=X` | GET | Filter by equipment |
| `/api/exercises/search?q=X` | GET | Search by name |
| `/api/exercises/:id` | GET | Get single exercise |
| `/api/exercises/alternatives` | GET | Get alternatives |

### Alternatives Endpoint

```
GET /api/exercises/alternatives?exerciseId=X&pattern=Y

Response:
{
  "alternatives": [
    {
      "id": "incline-dumbbell-press",
      "name": "Incline Dumbbell Press",
      "equipment": "dumbbell",
      "score": 0.85,
      "reason": "Same pattern, different equipment"
    },
    ...
  ]
}
```

---

## Code Location

```
/lib/db
├── seed-exercises.ts       → Exercise seed data
└── schema.ts               → Exercise table schema

/app/api/exercises
├── route.ts                → List/search exercises
├── [id]/route.ts           → Get single exercise
└── alternatives/route.ts   → Get alternatives
```

---

## Alternative Scoring

```typescript
function scoreAlternative(original: Exercise, candidate: Exercise): number {
  let score = 0;

  // Same movement pattern (required)
  if (candidate.movementPattern !== original.movementPattern) {
    return 0;
  }

  // Primary muscle overlap
  const muscleOverlap = intersect(
    original.primaryMuscles,
    candidate.primaryMuscles
  ).length;
  score += muscleOverlap * 0.3;

  // Same difficulty level
  if (candidate.difficulty === original.difficulty) {
    score += 0.2;
  }

  // Equipment availability bonus
  if (isEquipmentAvailable(candidate.equipment)) {
    score += 0.2;
  }

  return Math.min(score, 1);
}
```

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Exercise database | ✅ 200+ exercises |
| Movement patterns | ✅ 12 patterns |
| Equipment types | ✅ 8 types |
| Search endpoint | ✅ Built |
| Filter by pattern | ✅ Built |
| Alternative scoring | ✅ Built |
| Form instructions | ⚠️ Partial |
| Video references | ❌ Future |
