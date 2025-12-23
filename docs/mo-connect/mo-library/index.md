---
sidebar_position: 3
title: MoLibrary
---

# MoLibrary

> *"I provide the knowledge"*

MoLibrary manages the exercise database, program templates, and educational content.

**Status:** ⚠️ Partial (2/3 systems built)

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoExercises](./mo-exercises) | *"The Encyclopedia"* | ✅ Built | Exercise database |
| [MoPrograms](./mo-programs) | *"The Architect"* | ✅ Built | Program templates |
| [MoLearn](./mo-learn) | *"The Teacher"* | ❌ Future | Educational content |

---

## Purpose

- Provide comprehensive exercise library
- Offer proven program templates
- Educate users on training principles
- Enable exercise discovery and alternatives
- Support program customization

---

## Vertical Interface

```typescript
interface MoLibraryInterface {
  // Exercises
  getExercise(id: string): Promise<Exercise>;
  searchExercises(query: string): Promise<Exercise[]>;
  getExercisesByPattern(pattern: MovementPattern): Promise<Exercise[]>;
  getAlternatives(exerciseId: string): Promise<Exercise[]>;

  // Programs
  getPrograms(): Promise<ProgramTemplate[]>;
  getProgram(id: string): Promise<ProgramTemplate>;
  getProgramDays(programId: string): Promise<TemplateDay[]>;

  // Education (future)
  getArticles(topic: string): Promise<Article[]>;
  getCues(exerciseId: string): Promise<FormCue[]>;
}
```

---

## Code Location

```
/lib/db
├── seed-exercises.ts       → MoExercises data (200+ exercises)
├── seed-ppl-template.ts    → MoPrograms PPL template
├── seed-warmup-*.ts        → Warmup templates
└── schema.ts               → Database schemas

/app/api
├── exercises/              → Exercise endpoints
└── programs/               → Program endpoints
```

---

## Content Stats

| Content Type | Count | Status |
|--------------|-------|--------|
| Exercises | 200+ | ✅ Seeded |
| Movement Patterns | 12 | ✅ Defined |
| Programs | 1 (PPL) | ✅ Built |
| Warmup Templates | 3 | ✅ Built |
| Educational Articles | 0 | ❌ Future |

---

## Exercise Categories

| Pattern | Example Exercises |
|---------|-------------------|
| Horizontal Push | Bench Press, Push-ups |
| Horizontal Pull | Barbell Row, Cable Row |
| Vertical Push | OHP, Dumbbell Press |
| Vertical Pull | Pull-ups, Lat Pulldown |
| Squat | Back Squat, Leg Press |
| Hinge | Deadlift, RDL |
| Lunge | Walking Lunges, Split Squat |
| Carry | Farmer's Walk |
| Core | Planks, Ab Wheel |
| Isolation | Curls, Tricep Extensions |

---

## Implementation Status

| Feature | Status |
|---------|--------|
| Exercise database | ✅ Built |
| Exercise search | ✅ Built |
| Alternative suggestions | ✅ Built |
| PPL template | ✅ Built |
| Warmup system | ✅ Built |
| Educational content | ❌ Future |
