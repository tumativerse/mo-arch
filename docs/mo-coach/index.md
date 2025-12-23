---
sidebar_position: 3
title: "MO:COACH"
---

# MO:COACH - Intelligence Domain

> *"The Brain"* — "I think so you don't have to"

MO:COACH is the intelligence layer that analyzes data from MO:PULSE, applies training science, and provides personalized guidance.

---

## Verticals

| Vertical | Purpose | Systems | Status |
|----------|---------|---------|--------|
| [MoInsight](./mo-insight/) | Data analysis & patterns | 3 | 1/3 built |
| [MoAdapt](./mo-adapt/) | Training adjustments | 4 | 4/4 built |
| [MoChat](./mo-chat/) | AI coaching | 3 | 0/3 built |

---

## Domain Data Model

```typescript
interface MoCoachOutput {
  insight: {
    trends: TrendAnalysis[];
    patterns: PatternInsight[];
  };
  adaptation: {
    fatigue: FatigueResult;
    progression: ProgressionStatus;
    deload: DeloadDecision;
    suggestions: WorkoutSuggestions;
  };
  coaching: {
    recommendations: Recommendation[];
    education: EducationContent[];
  };
}
```

---

## Domain Interface

```typescript
interface MoCoachInterface {
  // Fatigue
  calculateFatigue(userId: string): Promise<FatigueResult>;
  getFatigueStatus(): Promise<FatigueStatus>;

  // Progression
  checkProgressionGates(exerciseId: string): Promise<ProgressionGates>;
  getProgressionRecommendation(exerciseId: string): Promise<ProgressionRec>;

  // Deload
  checkDeloadNeeded(): Promise<DeloadDecision>;
  startDeload(type: DeloadType): Promise<void>;

  // Suggestions
  suggestWeight(exerciseId: string): Promise<WeightSuggestion>;
  getTrainingStatus(): Promise<TrainingStatus>;
}
```

---

## Code Organization

```
/lib/mo-coach
├── /adapt
│   ├── fatigue.ts          → MoFatigue
│   ├── progression.ts      → MoProgress
│   ├── deload.ts           → MoDeload
│   └── suggestions.ts      → MoSuggest
└── index.ts                → Domain exports
```

### Import Pattern

```typescript
import {
  calculateFatigue,
  checkProgressionGates,
  checkDeloadNeeded,
  suggestWeight
} from '@/lib/mo-coach';
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/progression` | GET | MoProgress, MoTrends |
| `/api/training/status` | GET/POST | MoFatigue, MoDeload |
| `/api/training/suggest` | GET | MoSuggest |

---

## Status

| Metric | Value |
|--------|-------|
| Verticals | 3/3 |
| Systems Built | 5/10 (50%) |
| API Endpoints | 3 |
