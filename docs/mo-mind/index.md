---
sidebar_position: 5
title: "MO:MIND"
---

# MO:MIND - Intelligence Domain

> *"The Advisor"* — "I analyze data and suggest what's next"

MO:MIND is the centralized intelligence layer that analyzes data from all domains, detects patterns, and provides personalized recommendations through specialized agents.

---

## Verticals

| Vertical | Purpose | Systems | Status |
|----------|---------|---------|--------|
| MoAgents | Specialized intelligence agents | 4 | 0/4 planned |
| MoOrchestrator | Multi-agent coordination | 1 | 0/1 planned |

---

## Agent Architecture

```
MO:MIND (Intelligence Layer)
├── Journey Agent      → Goal intelligence
├── Training Agent     → Workout intelligence
├── Nutrition Agent    → Meal/macro intelligence
├── Recovery Agent     → Sleep/rest intelligence
└── Orchestrator       → Multi-agent coordination
```

---

## Domain Data Model

```typescript
interface MoMindOutput {
  recommendations: Recommendation[];
  insights: {
    journey?: JourneyAnalysis;
    training?: TrainingAnalysis;
    nutrition?: NutritionAnalysis;
    recovery?: RecoveryAnalysis;
  };
  conflicts?: Conflict[];
}

interface Recommendation {
  text: string;
  priority: 'high' | 'medium' | 'low';
  source: 'journey' | 'training' | 'nutrition' | 'recovery' | 'orchestrator';
  action?: {
    type: 'navigate' | 'log' | 'view';
    path?: string;
  };
}

interface Conflict {
  type: string;
  agents: string[];
  issue: string;
  resolution: string;
}
```

---

## Domain Interface

```typescript
interface MoMindInterface {
  // Orchestrator
  generateDailyRecommendations(userId: string): Promise<MoMindOutput>;

  // Journey Agent
  analyzeGoalProgress(input: JourneyInput): Promise<JourneyAnalysis>;

  // Training Agent
  analyzeFatigue(input: TrainingInput): Promise<FatigueAnalysis>;
  recommendProgression(input: TrainingInput): Promise<ProgressionRecommendation>;

  // Nutrition Agent
  recommendMacros(input: NutritionInput): Promise<MacroRecommendation>;

  // Recovery Agent
  analyzeSleep(input: RecoveryInput): Promise<SleepAnalysis>;
  recommendRestDay(input: RecoveryInput): Promise<RestDayRecommendation>;
}
```

---

## Code Organization

```
/lib/mo-mind
├── /agents
│   ├── journey-agent.ts      → Journey intelligence
│   ├── training-agent.ts     → Workout intelligence
│   ├── nutrition-agent.ts    → Meal intelligence
│   └── recovery-agent.ts     → Sleep intelligence
├── /orchestrator
│   ├── index.ts              → Main orchestrator
│   ├── detect-conflicts.ts   → Find contradictions
│   └── resolve-conflicts.ts  → Apply resolution rules
└── index.ts                  → Domain exports
```

### Import Pattern

```typescript
import {
  generateDailyRecommendations,  // Orchestrator
  analyzeGoalProgress,            // Journey Agent
  analyzeFatigue,                 // Training Agent
  recommendMacros,                // Nutrition Agent
  analyzeSleep                    // Recovery Agent
} from '@/lib/mo-mind';
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/mind/daily-recommendations` | POST | Orchestrator |
| `/api/mind/agents/journey/analyze-goals` | POST | Journey Agent |
| `/api/mind/agents/training/analyze-fatigue` | POST | Training Agent |
| `/api/mind/agents/nutrition/recommend-macros` | POST | Nutrition Agent |
| `/api/mind/agents/recovery/analyze-sleep` | POST | Recovery Agent |

---

## Agent Details

### Journey Agent
**Purpose:** Goal intelligence
- Calculate progress (% complete, ahead/behind)
- Detect trends (linear, plateau, exponential)
- Predict completion dates
- Recommend adjustments
- Detect goal conflicts

### Training Agent
**Purpose:** Workout intelligence
- Calculate fatigue status
- Recommend weight/rep progressions
- Detect deload needs
- Suggest exercise substitutions
- Analyze volume trends

### Nutrition Agent
**Purpose:** Meal intelligence
- Calculate TDEE
- Recommend macro targets
- Detect macro imbalances
- Suggest meal timing
- Analyze nutrient trends

### Recovery Agent
**Purpose:** Sleep/rest intelligence
- Analyze sleep quality
- Recommend rest days
- Detect overtraining signals
- Suggest recovery modalities
- Optimize training volume

### Orchestrator
**Purpose:** Multi-agent coordination
- Call agents in parallel
- Detect conflicts between recommendations
- Resolve conflicts with priority rules
- Merge recommendations into unified output

---

## Integration with Other Domains

**Consumes from:**
- MO:JOURNEY → Goals, measurements
- MO:PULSE → Workouts, recovery logs, nutrition, body metrics
- MO:COACH → Fatigue status, progression decisions
- MO:SELF → User preferences, equipment

**Provides to:**
- MO:JOURNEY → Goal analysis, daily recommendations
- MO:COACH → Training insights (via Training Agent)
- MO:PULSE → Nutrition recommendations (via Nutrition Agent)
- All domains → Intelligent recommendations

---

## Implementation Strategy

**Phase 1** (Week 1-2): Embed intelligence in MO:JOURNEY
- Goal progress calculation
- Basic recommendations
- No separate MO:MIND yet

**Phase 2** (Week 3): Extract Journey Agent
- Create MO:MIND domain
- Move goal intelligence to Journey Agent
- MO:JOURNEY calls Journey Agent

**Phase 3** (Week 4): Add Training Agent
- Extract training intelligence from MO:COACH
- MO:COACH calls Training Agent

**Phase 4** (Week 5): Build Orchestrator
- Coordinate multiple agents
- Detect and resolve conflicts

**Phase 5** (Week 6+): Complete Agent Suite
- Add Nutrition Agent
- Add Recovery Agent
- Full multi-agent coordination

---

## Status

| Metric | Value |
|--------|-------|
| Verticals | 0/2 |
| Systems Built | 0/5 (0%) |
| API Endpoints | 0 |
| **Target** | **Phase 2+ - Week 3+** |

---

## Related Documentation

- [Architectural Decisions](../architecture/decisions.md) - Why MO:MIND was created
- [MO:MIND Specification](./specification.md) - Detailed agent architecture
- [MO:JOURNEY Integration](../mo-journey/) - How Journey Agent works with goals
