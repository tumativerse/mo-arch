---
sidebar_position: 2
title: MoPrograms
---

# MoPrograms

> *"The Architect"* — "I design your training structure"

**Status:** ✅ Built

MoPrograms provides program templates like PPL (Push/Pull/Legs) that define training structure.

---

## Purpose

- Define program structures and rotations
- Specify movement slots per day
- Set default rep ranges and RPE targets
- Enable template-based training
- Support program selection

---

## Implementation

### Database Schema

```typescript
// Program Template
export const programTemplates = pgTable("program_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  daysPerWeek: integer("days_per_week").notNull(),
  rotation: text("rotation").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Template Days
export const templateDays = pgTable("template_days", {
  id: text("id").primaryKey(),
  programId: text("program_id").references(() => programTemplates.id),
  name: text("name").notNull(),
  dayType: text("day_type").notNull(),      // 'push_a', 'pull_b', etc.
  displayOrder: integer("display_order").notNull(),
});

// Template Slots
export const templateSlots = pgTable("template_slots", {
  id: text("id").primaryKey(),
  templateDayId: text("template_day_id").references(() => templateDays.id),
  movementPattern: text("movement_pattern").notNull(),
  slotOrder: integer("slot_order").notNull(),
  defaultExerciseId: text("default_exercise_id"),
  sets: integer("sets").notNull(),
  repRangeMin: integer("rep_range_min").notNull(),
  repRangeMax: integer("rep_range_max").notNull(),
  targetRPE: integer("target_rpe"),
  isRequired: boolean("is_required").default(true),
  notes: text("notes"),
});
```

---

## PPL Template Structure

### Rotation Pattern

```
Week 1: Push A → Pull A → Legs A → Push B → Pull B → Legs B → Rest
Week 2: Push A → Pull A → Legs A → Push B → Pull B → Legs B → Rest
(Continues...)
```

### Push A Day

| Slot | Pattern | Exercise | Sets × Reps | RPE |
|------|---------|----------|-------------|-----|
| 1 | Horizontal Push | Barbell Bench Press | 4 × 6-8 | 8 |
| 2 | Horizontal Push | Incline DB Press | 3 × 8-10 | 7-8 |
| 3 | Vertical Push | Overhead Press | 3 × 8-10 | 7-8 |
| 4 | Horizontal Push | Cable Flyes | 3 × 12-15 | 7 |
| 5 | Arm Isolation | Tricep Pushdowns | 3 × 10-12 | 7 |
| 6 | Shoulder Isolation | Lateral Raises | 3 × 12-15 | 7 |

### Pull A Day

| Slot | Pattern | Exercise | Sets × Reps | RPE |
|------|---------|----------|-------------|-----|
| 1 | Vertical Pull | Pull-ups | 4 × 6-8 | 8 |
| 2 | Horizontal Pull | Barbell Row | 4 × 6-8 | 8 |
| 3 | Horizontal Pull | Cable Row | 3 × 10-12 | 7 |
| 4 | Vertical Pull | Lat Pulldown | 3 × 10-12 | 7 |
| 5 | Arm Isolation | Barbell Curls | 3 × 10-12 | 7 |
| 6 | Arm Isolation | Hammer Curls | 3 × 10-12 | 7 |

### Legs A Day

| Slot | Pattern | Exercise | Sets × Reps | RPE |
|------|---------|----------|-------------|-----|
| 1 | Squat | Barbell Back Squat | 4 × 6-8 | 8 |
| 2 | Hinge | Romanian Deadlift | 3 × 8-10 | 7-8 |
| 3 | Lunge | Walking Lunges | 3 × 10-12 | 7 |
| 4 | Leg Isolation | Leg Extension | 3 × 12-15 | 7 |
| 5 | Leg Isolation | Leg Curl | 3 × 12-15 | 7 |
| 6 | Leg Isolation | Calf Raises | 4 × 12-15 | 7 |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/programs` | GET | List all programs |
| `/api/programs/:id` | GET | Get program details |
| `/api/programs/:id/days` | GET | Get program days |
| `/api/programs/:id/days/:dayId` | GET | Get day with slots |

---

## Code Location

```
/lib/db
├── seed-ppl-template.ts    → PPL program seed
├── seed-warmup-general.ts  → General warmup
├── seed-warmup-push.ts     → Push day warmup
├── seed-warmup-pull.ts     → Pull day warmup
├── seed-warmup-legs.ts     → Legs day warmup
└── schema.ts               → Program schemas

/app/api/programs
├── route.ts                → List programs
└── [id]/
    ├── route.ts            → Program details
    └── days/route.ts       → Program days
```

---

## Warmup Templates

Each day type has an associated warmup template:

```typescript
interface WarmupTemplate {
  id: string;
  name: string;
  forDayType: string[];      // ['push_a', 'push_b']

  phases: WarmupPhase[];
}

interface WarmupPhase {
  name: string;               // 'General', 'Dynamic', 'Movement Prep'
  exercises: WarmupExercise[];
}

interface WarmupExercise {
  name: string;
  sets: number;
  reps: number | null;
  duration: number | null;    // seconds
  notes: string | null;
}
```

---

## Program Selection Flow

```
1. User onboarding
2. Show available programs
3. User selects PPL (only option for now)
4. Set as active program in user_settings
5. PPL rotation drives daily workouts
```

---

## Implementation Status

| Feature | Status |
|---------|--------|
| PPL template | ✅ Full 6-day rotation |
| Template slots | ✅ All patterns defined |
| Warmup templates | ✅ Per day type |
| Program API | ✅ Built |
| Day details API | ✅ Built |
| Multiple programs | ❌ Future (only PPL) |
| Custom programs | ❌ Future |
