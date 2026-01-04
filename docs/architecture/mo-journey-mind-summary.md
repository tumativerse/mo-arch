---
sidebar_position: 6
title: Quick Reference
---

# MO:JOURNEY & MO:MIND Summary

**Quick Reference Guide**

This document provides a high-level overview of the two new domains (MO:JOURNEY and MO:MIND) and how they integrate with the existing Mo Universe architecture.

---

## Executive Summary

We're adding **two new domains** to the Mo Universe:

1. **MO:JOURNEY** (Strategic Orchestration)
   - Goals page as home screen
   - Progress tracking across all metrics
   - Milestone management
   - Orchestrates all other domains to serve user goals

2. **MO:MIND** (Intelligence Layer)
   - Centralized intelligence with agent-based architecture
   - 4 specialized agents + orchestrator
   - Provides recommendations to all domains
   - Future-proofed for ML/LLM integration

---

## Why These Domains?

### Problem: Goals Were Scattered

**Before:**
- User identity in MO:SELF (who you are)
- Workout tracking in MO:PULSE (what you do)
- Training intelligence in MO:COACH (how to improve)
- **Missing:** Strategic orchestration (why you do it, where you're going)

**Issues:**
- No unified view of progress toward goals
- Intelligence logic duplicated across domains
- Users lost sight of "why" they were training
- Hard to coordinate multi-goal pursuits (e.g., gain muscle + lose fat)

### Solution: Strategic + Intelligence Layers

**MO:JOURNEY** provides:
- ✅ Unified goals page (home screen)
- ✅ Progress tracking across all metrics (weight, strength, measurements)
- ✅ Milestone management (break long journeys into wins)
- ✅ Orchestration (coordinate all domains to serve goals)

**MO:MIND** provides:
- ✅ Centralized intelligence (no duplication)
- ✅ Agent-based architecture (specialized, testable, scalable)
- ✅ Multi-agent coordination (resolve conflicts, prioritize)
- ✅ Future-ready (ML, LLM, reinforcement learning)

---

## Architecture at a Glance

### The 6 Domains

| Domain | Personality | Primary Role |
|--------|-------------|--------------|
| **MO:SELF** | "The Memory" | Identity, preferences, history |
| **MO:PULSE** | "The Observer" | Data collection (workouts, body, fuel, recovery) |
| **MO:COACH** | "The Trainer" | Training plans, progression, fatigue management |
| **MO:JOURNEY** | "The Navigator" | Goals, progress, milestones, orchestration |
| **MO:MIND** | "The Advisor" | Intelligence, analysis, recommendations |
| **MO:CONNECT** | "The Connector" | Wearables, community, external integrations |

---

### How They Relate

```
┌─────────────────────────────────────────────────┐
│  USER OPENS APP → MO:JOURNEY (Goals Page)      │
└─────────────────────┬───────────────────────────┘
                      │
         1. Shows goals & progress
                      │
                      ▼
         ┌────────────────────────┐
         │  MO:MIND (Orchestrator) │
         │  "What should I do today?"│
         └────────┬───────────────┘
                  │
      Fetches data from:
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌─────────┐  ┌──────────┐
│MO:SELF │  │MO:PULSE │  │MO:COACH  │
└────────┘  └─────────┘  └──────────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
      Analyzes with agents:
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│Journey  │  │Training  │  │Nutrition │
│Agent    │  │Agent     │  │Agent     │
└─────────┘  └──────────┘  └──────────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
      Returns recommendations:
                  │
                  ▼
         ┌────────────────────────┐
         │  MO:JOURNEY (Goals Page)│
         │  Shows: "Log weight"    │
         │         "Start workout" │
         └────────────────────────┘
```

---

## MO:JOURNEY in Detail

### What It Does

1. **Goal Management**
   - Create goals (muscle gain, fat loss, strength, recomp, general)
   - Set SMART parameters (specific, measurable, achievable, relevant, time-bound)
   - Prioritize goals (primary, secondary, background)
   - Detect conflicts (muscle gain vs fat loss)

2. **Progress Tracking**
   - Calculate % complete
   - Detect trends (ahead, on-track, behind)
   - Predict completion dates
   - Visualize journey (charts, timelines)

3. **Milestone Management**
   - Break long goals into weekly/monthly checkpoints
   - Celebrate achievements (trigger UI celebrations)
   - Adjust timelines if milestones are missed

4. **Orchestration**
   - Coordinate actions across all domains
   - Drive "what to do today" recommendations
   - Serve as home screen (primary UI)

### Key Features

**Goals Page Layout:**
```
┌────────────────────────────────────┐
│  Your Goals                     +  │
├────────────────────────────────────┤
│  🎯 Primary Goal                   │
│  Lose 10 lbs by April 1            │
│  ████████░░░░░░  65% complete      │
│  ↓ Trending down (good!)           │
│                                    │
│  💡 Today's Recommendation:        │
│  "Log your weight"                 │
│  [Log Weight Button]               │
├────────────────────────────────────┤
│  🏃 Secondary Goal                 │
│  Bench press 225 lbs               │
│  ██████░░░░░░░░  45% complete      │
└────────────────────────────────────┘
```

**Data Models:**
- `goals` table (goal type, target, timeline, status, priority)
- `measurements` table (weight, body measurements, date)
- `milestones` table (checkpoints, status)

**API Endpoints:**
```
POST   /api/journey/goals
GET    /api/journey/goals
GET    /api/journey/goals/[id]/progress
PATCH  /api/journey/goals/[id]

POST   /api/journey/measurements
GET    /api/journey/measurements
```

---

## MO:MIND in Detail

### What It Does

1. **Analyzes Data**
   - Fetches data from all domains (SELF, PULSE, COACH, JOURNEY)
   - Processes with specialized agents
   - Detects patterns, trends, anomalies

2. **Provides Recommendations**
   - Goal-specific advice (Journey Agent)
   - Training recommendations (Training Agent)
   - Nutrition suggestions (Nutrition Agent)
   - Recovery guidance (Recovery Agent)

3. **Coordinates Agents**
   - Runs agents in parallel (performance)
   - Detects conflicts (e.g., "train today" vs "rest day needed")
   - Resolves conflicts (recovery wins over training)
   - Prioritizes recommendations (primary goal first)

4. **Future-Proofs**
   - Agent architecture ready for ML models
   - Can integrate LLMs (GPT-4, Claude)
   - Can implement reinforcement learning

### The 5 Agents

| Agent | Purpose | Input | Output |
|-------|---------|-------|--------|
| **Journey Agent** | Goal intelligence | Goals, measurements, workouts | Progress %, recommendations, conflicts |
| **Training Agent** | Workout intelligence | Workouts, recovery logs | Fatigue status, progression advice, deload signals |
| **Nutrition Agent** | Meal intelligence | Goals, meals, body metrics | TDEE, macro targets, meal timing advice |
| **Recovery Agent** | Sleep/rest intelligence | Recovery logs, workouts | Sleep analysis, rest day recommendations |
| **Orchestrator** | Multi-agent coordination | All agent outputs | Unified recommendations, conflict resolution |

### Example Agent Flow

**User opens app:**
1. MO:JOURNEY displays Goals page
2. MO:JOURNEY calls MO:MIND orchestrator
3. Orchestrator calls all 4 agents in parallel:
   - Journey Agent: "You're behind schedule on fat loss goal"
   - Training Agent: "Fatigue is high, deload recommended"
   - Nutrition Agent: "Protein intake is 30g below target"
   - Recovery Agent: "Sleep quality poor, rest day needed"
4. Orchestrator detects conflict:
   - Journey Agent says "increase training" (behind on goal)
   - Recovery Agent says "rest day needed" (high fatigue)
5. Orchestrator resolves:
   - Recovery wins (prevent injury)
   - Recommendation: "Take a rest day, focus on sleep"
6. MO:JOURNEY displays recommendation on Goals page

---

## Integration Examples

### Example 1: Goals Page on App Launch

```typescript
// app/(app)/goals/page.tsx
export default async function GoalsPage() {
  const session = await getServerSession();
  const userId = session.user.id;

  // 1. Fetch goals from MO:JOURNEY
  const goals = await MO_JOURNEY.getActiveGoals(userId);

  // 2. Fetch measurements from MO:JOURNEY
  const measurements = await MO_JOURNEY.getMeasurements(userId);

  // 3. Consult MO:MIND for intelligent recommendations
  const intelligence = await MO_MIND.generateDailyRecommendations(userId);

  // 4. Display unified view
  return (
    <GoalsHub
      goals={goals}
      measurements={measurements}
      topRecommendation={intelligence.topRecommendation}
      allRecommendations={intelligence.allRecommendations}
      insights={intelligence.insights}
    />
  );
}
```

### Example 2: Training Page Uses MO:MIND

```typescript
// app/(app)/workout/page.tsx
export default async function WorkoutPage() {
  const workouts = await MO_PULSE.getWorkoutHistory();
  const recoveryLogs = await MO_PULSE.getRecoveryLogs();

  // Consult MO:MIND Training Agent
  const fatigueAnalysis = await MO_MIND.trainingAgent.analyzeFatigue({
    workouts,
    recoveryLogs,
  });

  const progressionAdvice = await MO_MIND.trainingAgent.recommendProgression({
    workouts,
  });

  return (
    <WorkoutDashboard
      fatigueStatus={fatigueAnalysis.fatigue.status}
      progression={progressionAdvice}
    />
  );
}
```

### Example 3: Multi-Goal Conflict Detection

```typescript
// MO:MIND Orchestrator detects conflict:
const goals = [
  { id: "1", goalType: "muscle_building", priority: "primary" },
  { id: "2", goalType: "fat_loss", priority: "secondary" },
];

const conflicts = orchestrator.detectConflicts({
  journey: { goals },
  nutrition: { macros: { calories: { target: 2800 } } }, // Surplus
});

// Conflict detected:
{
  "type": "goal_conflict",
  "issue": "Muscle building requires surplus, fat loss requires deficit",
  "resolution": "Consider body recomposition approach or sequential phases",
  "recommendation": {
    "text": "Your goals conflict. Try body recomposition (deficit on rest days, surplus on training days) or focus on one goal at a time.",
    "priority": "high"
  }
}
```

---

## Implementation Timeline

### Phase 1: Embedded Intelligence (Week 1-2)

**Goal:** Ship Goals page MVP with intelligence embedded in MO:JOURNEY

**Deliverables:**
- ✅ Goals page (home screen)
- ✅ Create/edit/archive goals
- ✅ Log measurements (weight, key body parts)
- ✅ Calculate progress (% complete, trend)
- ✅ One recommendation per day (rule-based, embedded)

**No MO:MIND yet** - Intelligence logic lives in `lib/mo-journey/intelligence/`

---

### Phase 2: Extract Journey Agent (Week 3)

**Goal:** Move intelligence to MO:MIND, starting with Journey Agent

**Deliverables:**
- ✅ Create `lib/mo-mind/agents/journey-agent.ts`
- ✅ Move goal intelligence from MO:JOURNEY to Journey Agent
- ✅ MO:JOURNEY calls Journey Agent (clean interface)
- ✅ No UI changes (users don't notice)

**MO:MIND begins** - Journey Agent is first agent

---

### Phase 3: Add Training Agent (Week 4)

**Goal:** Extract existing training intelligence from MO:COACH to MO:MIND

**Deliverables:**
- ✅ Create `lib/mo-mind/agents/training-agent.ts`
- ✅ Move fatigue/progression logic from MO:COACH
- ✅ MO:COACH calls Training Agent
- ✅ Both JOURNEY and COACH now use MO:MIND

**Multi-domain integration** - MO:MIND serves multiple domains

---

### Phase 4: Build Orchestrator (Week 5)

**Goal:** Coordinate multiple agents, resolve conflicts

**Deliverables:**
- ✅ Create `lib/mo-mind/orchestrator/`
- ✅ Call all agents in parallel
- ✅ Detect conflicts (training vs recovery, goals vs nutrition)
- ✅ Resolve conflicts (priority rules)
- ✅ Unified daily recommendations

**Intelligence coordination** - Agents collaborate

---

### Phase 5: Add Nutrition & Recovery Agents (Week 6+)

**Goal:** Complete agent suite

**Deliverables:**
- ✅ Nutrition Agent (macro recommendations, meal timing)
- ✅ Recovery Agent (sleep analysis, rest day suggestions)
- ✅ Full orchestration (all 4 agents + orchestrator)
- ✅ Comprehensive daily recommendations

**Full intelligence layer** - All domains use MO:MIND

---

## Directory Structure

### MO:JOURNEY

```
lib/mo-journey/
├── goals/
│   ├── create-goal.ts          // Create new goal
│   ├── update-goal.ts          // Modify goal
│   ├── archive-goal.ts         // Complete/pause goal
│   ├── get-goals.ts            // Fetch goals
│   ├── goal-types.ts           // TypeScript types
│   └── goal-validation.ts      // Validation logic
├── progress/
│   ├── calculate-progress.ts   // % complete, trend
│   ├── get-measurements.ts     // Fetch measurements
│   ├── visualize-progress.ts   // Charts, graphs
│   └── predict-completion.ts   // Estimate finish date
├── milestones/
│   ├── create-milestones.ts    // Generate checkpoints
│   ├── check-milestone.ts      // Validate achievement
│   └── celebrate.ts            // Trigger UI celebration
└── intelligence/               // Phase 1 only (embedded)
    └── analyze-progress.ts     // Moved to MO:MIND in Phase 2
```

### MO:MIND

```
lib/mo-mind/
├── agents/
│   ├── journey-agent.ts        // Goal intelligence
│   ├── training-agent.ts       // Workout intelligence
│   ├── nutrition-agent.ts      // Meal intelligence
│   └── recovery-agent.ts       // Sleep/rest intelligence
├── orchestrator/
│   ├── index.ts                // Main orchestrator
│   ├── coordinate-agents.ts    // Call agents in parallel
│   ├── detect-conflicts.ts     // Find contradictions
│   ├── resolve-conflicts.ts    // Apply resolution rules
│   └── prioritize.ts           // Sort recommendations
└── shared/
    ├── agent-types.ts          // TypeScript interfaces
    ├── recommendation-types.ts // Recommendation format
    └── analysis-utils.ts       // Shared utilities
```

---

## Database Schema

### New Tables for MO:JOURNEY

```sql
-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  goal_type TEXT CHECK (goal_type IN (
    'muscle_building',
    'fat_loss',
    'strength',
    'recomp',
    'general'
  )),
  priority TEXT CHECK (priority IN ('primary', 'secondary', 'background')),
  status TEXT CHECK (status IN ('active', 'paused', 'completed')),
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  starting_metric DECIMAL NOT NULL,
  target_metric DECIMAL NOT NULL,
  metric_type TEXT CHECK (metric_type IN ('weight', 'measurement', '1rm', 'other')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user_status ON goals(user_id, status);

-- Measurements
CREATE TABLE measurements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  weight DECIMAL,
  chest DECIMAL,
  waist DECIMAL,
  hips DECIMAL,
  thigh DECIMAL,
  bicep DECIMAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_measurements_user_date ON measurements(user_id, date DESC);

-- Milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY,
  goal_id UUID REFERENCES goals(id),
  target_date DATE NOT NULL,
  target_value DECIMAL NOT NULL,
  actual_value DECIMAL,
  status TEXT CHECK (status IN ('upcoming', 'achieved', 'missed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_milestones_goal ON milestones(goal_id);
```

### No New Tables for MO:MIND

**MO:MIND is stateless** - It doesn't store data, it analyzes data from other domains.

(Future: May add `recommendations` table to track which recommendations users follow for reinforcement learning)

---

## Testing Strategy

### MO:JOURNEY Tests

**Unit Tests:**
```typescript
// Test goal creation
describe("createGoal", () => {
  it("should validate required fields");
  it("should detect past target dates");
  it("should prevent duplicate active primary goals");
});

// Test progress calculation
describe("calculateProgress", () => {
  it("should calculate % complete correctly");
  it("should detect trend direction");
  it("should identify ahead/behind status");
});
```

**Integration Tests:**
```typescript
// Test goal lifecycle
describe("Goal lifecycle", () => {
  it("should create goal → log measurement → update progress");
  it("should complete goal → trigger celebration");
});
```

**E2E Tests:**
```typescript
// Test user flow
describe("Goals page", () => {
  it("should allow user to create goal and see progress");
  it("should show recommendation and allow user to follow it");
});
```

---

### MO:MIND Tests

**Unit Tests (Agent Level):**
```typescript
// Test Journey Agent
describe("JourneyAgent", () => {
  it("should analyze goal progress");
  it("should detect conflicts between goals");
  it("should generate recommendations");
});

// Test Training Agent
describe("TrainingAgent", () => {
  it("should calculate fatigue score");
  it("should recommend progression when ready");
  it("should detect deload signals");
});
```

**Integration Tests (Orchestrator Level):**
```typescript
// Test multi-agent coordination
describe("MindOrchestrator", () => {
  it("should call all agents in parallel");
  it("should detect conflicts between agents");
  it("should resolve conflicts with priority rules");
  it("should prioritize recommendations");
});
```

**E2E Tests:**
```typescript
// Test full intelligence flow
describe("Daily Recommendations", () => {
  it("should provide intelligent recommendation on Goals page");
  it("should handle conflicts between training and recovery");
});
```

---

## Migration Path

### From Current State → MO:JOURNEY & MO:MIND

**Current State (Before):**
```
User opens app → Workout page (hardcoded home screen)
No unified goal tracking
Intelligence scattered across domains
```

**Step 1: Add MO:JOURNEY (Week 1-2)**
```
User opens app → Goals page (new home screen)
Goals tracked with measurements
Intelligence embedded in JOURNEY
```

**Step 2: Extract to MO:MIND (Week 3-5)**
```
User opens app → Goals page
Goals tracked with measurements
Intelligence centralized in MO:MIND
All domains use MO:MIND agents
```

**Final State (Week 6+):**
```
User opens app → Goals page (orchestrator)
Goals tracked across all metrics
Intelligence via 4 agents + orchestrator
Multi-agent coordination, conflict resolution
ML/LLM ready for future upgrades
```

---

## Key Decisions Summary

| Decision | Rationale | Impact |
|----------|-----------|--------|
| **Create MO:JOURNEY domain** | Goals don't fit cleanly into SELF/PULSE/COACH | +1 domain (strategic orchestration) |
| **Create MO:MIND domain** | Intelligence was scattered, needed centralization | +1 domain (agent-based intelligence) |
| **Goals as home screen** | "Why" before "what" - goals drive all actions | Changes default landing page |
| **Phased implementation** | Ship MVP fast, extract intelligence later | Week 1 MVP vs Week 3 clean architecture |
| **Multi-goal support** | Users want parallel goals | Conflict detection required |
| **Agent-based architecture** | Testable, scalable, future-proof | Ready for ML/LLM integration |

---

## Next Steps

1. **Review Documentation**
   - Read [Architectural Decisions](./decisions.md)
   - Read [MO:JOURNEY Specification](./mo-journey-spec.md)
   - Read [MO:MIND Specification](./mo-mind-spec.md)
   - Read [Updated Architecture Overview](./overview.md)

2. **Plan Implementation**
   - Define Phase 1 MVP tasks
   - Create database migrations
   - Design UI components
   - Write API endpoints

3. **Build Phase 1 (Week 1-2)**
   - Goals page (home screen)
   - Goal creation/editing
   - Measurement logging
   - Basic progress calculation
   - One recommendation per day (embedded)

4. **Extract to MO:MIND (Week 3-5)**
   - Journey Agent
   - Training Agent
   - Orchestrator
   - Multi-agent coordination

5. **Complete Agent Suite (Week 6+)**
   - Nutrition Agent
   - Recovery Agent
   - Full orchestration
   - Advanced features

---

## Questions & Clarifications

**Q: Why not build MO:MIND first, then MO:JOURNEY?**
A: Faster to ship MVP with embedded intelligence, then extract. Proves concept before committing to full architecture.

**Q: Why separate JOURNEY and MIND?**
A: Separation of concerns. JOURNEY orchestrates (strategic layer), MIND analyzes (intelligence layer). Clean boundaries.

**Q: Can domains call other domains directly?**
A: Generally no. Domains should be independent. JOURNEY orchestrates (calls multiple domains). MIND is called by domains (provides intelligence).

**Q: What if user has no goals?**
A: Goals page shows empty state with "Create your first goal" CTA. Onboarding creates first goal automatically.

**Q: How does MIND handle new goal types?**
A: Journey Agent has extensible logic. New goal types add new analysis rules. Future: LLM handles any goal type.

**Q: Performance impact of calling all agents?**
A: Agents run in parallel. Total latency ≈ slowest agent. Cache recommendations for 1 hour (update only on new data).

---

## References

- [Architectural Decisions](./decisions.md) - Why we made these choices
- [MO:JOURNEY Specification](./mo-journey-spec.md) - Detailed domain spec
- [MO:MIND Specification](./mo-mind-spec.md) - Detailed agent architecture
- [Architecture Overview](./overview.md) - Updated 6-domain architecture
- [Development Workflow](../development/workflow.md) - How to build features

---

**Document Version:** 1.0 (January 2026)
**Last Updated:** January 4, 2026
**Status:** Approved - Ready for Implementation
