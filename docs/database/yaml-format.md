---
sidebar_position: 2
title: YAML Format
---

# Exercise YAML Format

Exercises are stored as YAML files in mo-docs and seeded into the app database.

---

## File Structure

```
mo-docs/data/exercises/
├── push/
│   ├── bench-press.yaml
│   ├── incline-dumbbell-press.yaml
│   └── ...
├── pull/
│   ├── barbell-row.yaml
│   ├── pull-up.yaml
│   └── ...
├── legs/
│   ├── back-squat.yaml
│   ├── romanian-deadlift.yaml
│   └── ...
└── core/
    ├── plank.yaml
    └── ...
```

---

## YAML Schema

```yaml
# Required fields
name: "Barbell Bench Press"
slug: "barbell-bench-press"
category: "chest"
movementPattern: "horizontal_push"

# Muscle targeting
primaryMuscles:
  - "chest"
secondaryMuscles:
  - "front_delts"
  - "triceps"

# Equipment and difficulty
equipment:
  - "barbell"
  - "bench"
difficulty: "intermediate"
priority: "essential"  # essential, common, specialized, niche
exerciseUse: "training"  # training, warmup, both

# Instructions
instructions:
  - "Lie on bench with eyes under the bar"
  - "Grip bar slightly wider than shoulder width"
  - "Unrack and lower to mid-chest"
  - "Press up to lockout"

tips:
  - "Keep shoulder blades pinched together"
  - "Drive feet into the floor"
  - "Control the descent"

commonMistakes:
  - "Flaring elbows too wide"
  - "Bouncing bar off chest"
  - "Lifting hips off bench"

# Relationships (optional)
variations:
  - "close-grip-bench-press"
  - "pause-bench-press"
alternatives:
  - "dumbbell-bench-press"
  - "push-up"
progressions:
  - "weighted-bench-press"
regressions:
  - "push-up"
```

---

## Field Definitions

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `slug` | string | URL-safe identifier |
| `category` | string | Primary muscle category |
| `movementPattern` | enum | Movement pattern classification |

### Muscle Fields

| Field | Type | Description |
|-------|------|-------------|
| `primaryMuscles` | string[] | Main muscles worked |
| `secondaryMuscles` | string[] | Supporting muscles |

### Classification

| Field | Type | Values |
|-------|------|--------|
| `equipment` | string[] | Required equipment |
| `difficulty` | enum | beginner, intermediate, advanced |
| `priority` | enum | essential, common, specialized, niche |
| `exerciseUse` | enum | training, warmup, both |

### Instruction Fields

| Field | Type | Description |
|-------|------|-------------|
| `instructions` | string[] | Step-by-step execution |
| `tips` | string[] | Form cues and optimization |
| `commonMistakes` | string[] | Errors to avoid |

### Relationship Fields

| Field | Type | Description |
|-------|------|-------------|
| `variations` | string[] | Slug refs to variations |
| `alternatives` | string[] | Slug refs to alternatives |
| `progressions` | string[] | Slug refs to harder versions |
| `regressions` | string[] | Slug refs to easier versions |

---

## Movement Patterns

| Pattern | Description |
|---------|-------------|
| `horizontal_push` | Pressing away from body (bench press) |
| `vertical_push` | Pressing overhead (OHP) |
| `horizontal_pull` | Pulling toward body (rows) |
| `vertical_pull` | Pulling down/up (pull-ups) |
| `squat` | Knee-dominant leg (squats) |
| `hinge` | Hip-dominant leg (deadlifts) |
| `lunge` | Single-leg movements |
| `core` | Anti-rotation, flexion, stability |
| `isolation` | Single-joint movements |

---

## Priority Levels

| Priority | Description | Usage |
|----------|-------------|-------|
| `essential` | Must-have exercises | Always suggested first |
| `common` | Standard exercises | Regular suggestions |
| `specialized` | Niche applications | Equipment/goal specific |
| `niche` | Rare use cases | Only when specifically needed |

---

## Validation

Before seeding, YAML files are validated for:

1. Required fields present
2. Valid enum values
3. Slug uniqueness
4. Valid relationship references (slugs exist)
5. Proper YAML syntax

---

## Seeding

```bash
# Run seed script
npx tsx lib/db/seed-exercises.ts
```

The seed script:
1. Reads all YAML files from mo-docs
2. Validates each exercise
3. Upserts to database (by slug)
4. Creates exercise_relationships entries
