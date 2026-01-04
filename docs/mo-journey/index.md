---
sidebar_position: 4
title: "MO:JOURNEY"
---

# MO:JOURNEY - Strategic Domain

> *"The Navigator"* — "I guide you toward your goals"

MO:JOURNEY orchestrates all domains to serve user goals. It tracks progress across multiple metrics, manages milestones, and provides the home screen experience.

---

## Verticals

| Vertical | Purpose | Systems | Status |
|----------|---------|---------|--------|
| MoGoals | Goal creation & management | 3 | 0/3 planned |
| MoProgress | Progress tracking & visualization | 3 | 0/3 planned |
| MoMilestones | Checkpoint management | 3 | 0/3 planned |

---

## Domain Data Model

```typescript
interface MoJourneyData {
  goals: {
    active: Goal[];
    paused: Goal[];
    completed: Goal[];
  };
  progress: {
    measurements: Measurement[];
    trends: TrendAnalysis[];
    predictions: CompletionPrediction[];
  };
  milestones: {
    upcoming: Milestone[];
    achieved: Milestone[];
    missed: Milestone[];
  };
}

interface Goal {
  id: string;
  userId: string;
  goalType: 'muscle_building' | 'fat_loss' | 'strength' | 'recomp' | 'general';
  priority: 'primary' | 'secondary' | 'background';
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  targetDate: Date;
  startingMetric: number;
  targetMetric: number;
  metricType: 'weight' | 'measurement' | '1rm' | 'other';
}

interface Measurement {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
  bicep?: number;
}
```

---

## Domain Interface

```typescript
interface MoJourneyInterface {
  // Goals
  createGoal(data: CreateGoalInput): Promise<Goal>;
  getActiveGoals(userId: string): Promise<Goal[]>;
  updateGoal(goalId: string, data: UpdateGoalInput): Promise<Goal>;
  archiveGoal(goalId: string): Promise<void>;

  // Progress
  getGoalProgress(goalId: string): Promise<ProgressResult>;
  getMeasurements(userId: string, limit?: number): Promise<Measurement[]>;
  logMeasurement(data: MeasurementInput): Promise<Measurement>;

  // Milestones
  getMilestones(goalId: string): Promise<Milestone[]>;
  checkMilestone(milestoneId: string, actualValue: number): Promise<MilestoneResult>;
}
```

---

## Code Organization

```
/lib/mo-journey
├── /goals
│   ├── create-goal.ts        → MoGoalCreate
│   ├── update-goal.ts        → MoGoalUpdate
│   └── archive-goal.ts       → MoGoalArchive
├── /progress
│   ├── calculate-progress.ts → MoProgressCalculate
│   ├── get-measurements.ts   → MoProgressVisualize
│   └── predict-completion.ts → MoProgressTrends
├── /milestones
│   ├── create-milestones.ts  → MoMilestoneCreate
│   └── check-milestone.ts    → MoMilestoneCheck
└── index.ts                  → Domain exports
```

### Import Pattern

```typescript
import {
  createGoal,           // MoGoalCreate
  getActiveGoals,       // MoGoals
  getGoalProgress,      // MoProgressCalculate
  logMeasurement,       // MoProgress
  checkMilestone        // MoMilestoneCheck
} from '@/lib/mo-journey';
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/journey/goals` | GET/POST | MoGoalCreate, MoGoals |
| `/api/journey/goals/[id]` | GET/PATCH/DELETE | MoGoalUpdate |
| `/api/journey/goals/[id]/progress` | GET | MoProgressCalculate |
| `/api/journey/measurements` | GET/POST | MoProgress |
| `/api/journey/goals/[id]/milestones` | GET | MoMilestones |

---

## Integration with Other Domains

**Consumes from:**
- MO:SELF → User preferences, equipment, training history
- MO:PULSE → Workout sessions, recovery logs, body metrics
- MO:COACH → Fatigue status, progression decisions
- MO:MIND → Intelligent recommendations, conflict detection

**Provides to:**
- All domains → Strategic context (what goals are active)
- MO:MIND → Goals and measurements for analysis
- Home screen → Primary user interface

---

## Status

| Metric | Value |
|--------|-------|
| Verticals | 0/3 |
| Systems Built | 0/9 (0%) |
| API Endpoints | 0 |
| **Target** | **Phase 1 MVP - Week 1-2** |

---

## Related Documentation

- [Architectural Decisions](../architecture/decisions.md) - Why MO:JOURNEY was created
- [MO:JOURNEY Specification](./specification.md) - Detailed specification
- [MO:MIND Integration](../mo-mind/) - How intelligence layer works
