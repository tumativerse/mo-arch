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

## MoAdapt Logic Overview

### Fatigue Calculation

```
Fatigue Score (0-10) = Sum of:
├── RPE Creep (0-2)        → Detects upward RPE trend
├── Performance Drop (0-2)  → High average RPE
├── Recovery Debt (0-3)     → Poor sleep/energy/soreness
├── Volume Load (0-2)       → Training volume spike
└── Streak Score (0-1)      → 5+ consecutive days
```

| Score | Level | Color | Action |
|-------|-------|-------|--------|
| 0-3 | Fresh | Green | Train normally |
| 4-5 | Normal | Yellow | Monitor closely |
| 6-7 | Elevated | Orange | Consider reducing |
| 8-9 | High | Red | Reduce intensity |
| 10 | Critical | Red | Rest day recommended |

### Progression Gates

Before allowing weight increase, all gates must pass:

```
┌─────────────────────────────────────────┐
│           PROGRESSION GATES             │
├─────────────────────────────────────────┤
│ 1. Fatigue Gate    → Score < 7          │
│ 2. Performance Gate → Hit target reps   │
│ 3. RPE Gate        → RPE in range       │
│ 4. Recovery Gate   → Adequate recovery  │
└─────────────────────────────────────────┘
```

| Exercise Type | Target Reps | Max RPE | Weight Jump |
|---------------|-------------|---------|-------------|
| Compound | 8 | 8 | +5 lbs |
| Isolation | 10 | 7 | +2.5 lbs |

### Deload Triggers

| Trigger | Condition | Deload Type |
|---------|-----------|-------------|
| Scheduled | Every 4 weeks | Volume (60% volume, 100% intensity) |
| Critical Fatigue | 2+ days at score 8+ | Intensity (70% volume, 85% intensity) |
| Prolonged Elevated | 5+ days at score 6+ | Volume |
| Combined Factors | High fatigue + poor recovery | Full Rest |

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
