---
sidebar_position: 2
title: MoAdapt
---

# MoAdapt

> *"I adjust your training"*

MoAdapt is the core intelligence system that manages fatigue, progression, deloads, and suggestions.

**Status:** ✅ Fully Built

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoFatigue](./mo-fatigue) | *"The Guardian"* | ✅ Built | Fatigue scoring |
| [MoProgress](./mo-progress) | *"The Challenger"* | ✅ Built | Progression gates |
| [MoDeload](./mo-deload) | *"The Healer"* | ✅ Built | Deload management |
| [MoSuggest](./mo-suggest) | *"The Advisor"* | ✅ Built | Weight suggestions |

---

## How It Works

```
Recovery Data (MO:PULSE)
        ↓
   MoFatigue → Calculate fatigue score (0-10)
        ↓
   MoDeload → Check if deload needed
        ↓
   MoProgress → Check progression gates
        ↓
   MoSuggest → Generate weight/set suggestions
        ↓
Workout Modifications
```

---

## Vertical Interface

```typescript
interface MoAdaptInterface {
  // Fatigue
  calculateFatigue(userId: string): Promise<FatigueResult>;
  logFatigue(userId: string, score: number, components: FatigueComponents): Promise<void>;

  // Progression
  checkProgressionGates(userId: string, exerciseId: string): Promise<GateResults>;
  getReadyToProgress(userId: string): Promise<ExerciseProgress[]>;
  getPlateaued(userId: string): Promise<ExercisePlateau[]>;

  // Deload
  checkDeloadNeeded(userId: string): Promise<DeloadDecision>;
  startDeload(userId: string, type: DeloadType): Promise<DeloadPeriod>;
  endDeload(userId: string): Promise<void>;

  // Suggestions
  suggestWeight(userId: string, exerciseId: string): Promise<WeightSuggestion>;
  suggestWarmupSets(userId: string, exerciseId: string, workWeight: number): Promise<WarmupSet[]>;
}
```

---

## Code Organization

```
/lib/mo-coach/adapt/
├── fatigue.ts          → MoFatigue
├── progression.ts      → MoProgress
├── deload.ts           → MoDeload
├── suggestions.ts      → MoSuggest
└── index.ts            → Exports
```

---

## API Endpoints

| Endpoint | Method | Systems |
|----------|--------|---------|
| `/api/training/status` | GET | MoFatigue, MoDeload |
| `/api/training/status` | POST | MoDeload (manual trigger) |
| `/api/training/suggest` | GET | MoSuggest |
| `/api/progression` | GET | MoProgress, MoTrends |
