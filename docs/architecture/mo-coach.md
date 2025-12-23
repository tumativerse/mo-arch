---
sidebar_position: 4
title: "MO:COACH"
---

# MO:COACH - Intelligence Domain

> *"The Brain"* — "I think so you don't have to"

MO:COACH is the intelligence layer that analyzes data from MO:PULSE, applies training science, and provides personalized guidance.

---

## Verticals & Systems

### MoInsight — *"I find meaning in your data"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoTrends | *"The Pattern Finder"* | Long-term trend analysis | ⚠️ Partial |
| MoReports | *"The Summarizer"* | Weekly/monthly progress reports | ❌ Future |
| MoPatterns | *"The Detective"* | Behavioral pattern recognition | ❌ Future |

### MoAdapt — *"I adjust your training"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoFatigue | *"The Guardian"* | Fatigue scoring (0-10), protection from overtraining | ✅ Built |
| MoProgress | *"The Challenger"* | Progression gates, readiness checks | ✅ Built |
| MoDeload | *"The Healer"* | Deload detection, recovery weeks | ✅ Built |
| MoSuggest | *"The Advisor"* | Weight, set, and rest recommendations | ✅ Built |

### MoChat — *"I speak to you directly"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoVoice | *"The Conversationalist"* | AI chat interface | ❌ Future |
| MoAdvice | *"The Counselor"* | Contextual recommendations | ⚠️ Partial |
| MoEducate | *"The Teacher"* | Training education, explanations | ❌ Future |

---

## Data Model

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

## MoAdapt Logic

### MoFatigue — Fatigue Calculation

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

### MoProgress — Progression Gates

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

### MoDeload — Deload Triggers

| Trigger | Condition | Deload Type |
|---------|-----------|-------------|
| Scheduled | Every 4 weeks | Volume (60% volume, 100% intensity) |
| Critical Fatigue | 2+ days at score 8+ | Intensity (70% volume, 85% intensity) |
| Prolonged Elevated | 5+ days at score 6+ | Volume |
| Combined Factors | High fatigue + poor recovery | Full Rest |

---

## Interface

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
│   ├── fatigue.ts       → MoFatigue - Fatigue calculation
│   ├── progression.ts   → MoProgress - Progression gates
│   ├── deload.ts        → MoDeload - Deload detection
│   └── suggestions.ts   → MoSuggest - Weight suggestions
└── index.ts             → Domain exports
```

### Import Pattern

```typescript
import { calculateFatigue, checkProgressionGates } from '@/lib/mo-coach';
```

---

## Related APIs

| Endpoint | System |
|----------|--------|
| `/api/progression` | MoProgress, MoTrends |
| `/api/training/status` | MoFatigue, MoDeload |
| `/api/training/suggest` | MoSuggest |
