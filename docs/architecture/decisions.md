---
sidebar_position: 2
title: Architectural Decisions
---

# Architectural Decisions

This document captures key architectural decisions made during the evolution of the Mo Universe.

---

## Decision: Create MO:JOURNEY Domain (January 2026)

### Context

After implementing the Settings Page, we recognized the need for a goal-oriented system that goes beyond simple identity data. Users need a way to:
- Set specific, measurable fitness goals
- Track progress across multiple simultaneous goals
- Visualize their journey over time (12-16 week timelines for body recomposition)
- Get intelligent recommendations for achieving their goals

### Research Findings

**Behavioral Psychology:**
- Process goals are 10x more effective than outcome goals (effect size d = 1.36 vs 0.09)
- 84% of users abandon rigid daily goals in the first week
- 20% increase in retention with flexible weekly targets
- Implementation intentions ("if-then" planning) significantly increase adherence

**Competitive Analysis:**
- MyFitnessPal: Algorithm-generated targets trigger shame (1.5 star rating)
- Apple Fitness: Activity rings show 48% reduction in poor sleep quality for consistent users
- Fitbod: 1RM displacement tracking shows 12-15% strength increases in 10 weeks
- Strava: Challenge-based goals see 84% abandonment despite gamification
- Peloton: Personalized Plans with AI allow flexible pause/resume

**User Pain Points:**
- Current apps force single-goal selection (frustrating for multi-goal users)
- Scale weight doesn't change during recomp (demotivating)
- Manual logging is #1 complaint
- Generic notifications are ignored (54% conversion with context-aware vs spam)

### Decision

**Create MO:JOURNEY as a new strategic domain** to orchestrate goal-setting, progress tracking, and milestone management across all fitness activities.

**Rationale:**
1. Goals don't fit cleanly into existing domains:
   - MO:SELF is about identity, not active orchestration
   - MO:PULSE is for data collection, not goal management
   - MO:COACH is for training intelligence, not broader life goals
2. Goals should orchestrate across all domains (training, nutrition, recovery, measurements)
3. Journey is the "why" that drives all other activities
4. Goals page should be the home screen (primary user interface)

**Impact:**
- MO:JOURNEY becomes the 5th domain
- Goals page becomes the default landing page
- All other features (workouts, nutrition, recovery) serve the journey
- Architecture changes from 4 domains to 5 domains

---

## Decision: Create MO:MIND Domain (January 2026)

### Context

As we designed MO:JOURNEY, we realized intelligence logic was spreading across multiple domains:
- MO:COACH had training intelligence (fatigue, progression, deload)
- MO:JOURNEY needed goal intelligence (progress analysis, recommendations)
- Future nutrition tracking would need meal intelligence (macro suggestions, timing)
- Recovery tracking would need sleep intelligence (rest day recommendations)

This created several problems:
1. **Duplication**: Similar ML/LLM logic repeated in each domain
2. **Inconsistency**: Different recommendation styles across features
3. **Complexity**: Hard to test and maintain scattered intelligence
4. **Scalability**: Adding new intelligence required domain changes

### Decision

**Create MO:MIND as a separate intelligence domain** with an agent-based architecture.

**MO:MIND Structure:**
```
MO:MIND/
├── agents/
│   ├── journey-agent.ts    // Goal intelligence
│   ├── training-agent.ts   // Workout intelligence
│   ├── nutrition-agent.ts  // Meal/macro intelligence
│   └── recovery-agent.ts   // Sleep/rest intelligence
├── orchestrator/
│   ├── coordinate-agents.ts
│   ├── resolve-conflicts.ts
│   └── prioritize-recommendations.ts
└── shared/
    ├── agent-types.ts
    ├── recommendation-types.ts
    └── analysis-utils.ts
```

**Rationale:**

1. **Separation of Concerns**:
   - Data domains (SELF, PULSE, COACH, JOURNEY, CONNECT) handle "what" and "how"
   - Intelligence domain (MIND) handles "why" and "recommendations"

2. **Consistency**:
   - All recommendations come from MIND agents
   - Unified recommendation format across features
   - Consistent tone and style

3. **Reusability**:
   - Journey Agent can use Training Agent insights
   - Training Agent can use Recovery Agent insights
   - Agents collaborate through orchestrator

4. **Testability**:
   - Each agent is independently testable
   - Mock agents for testing data domains
   - Test agent collaboration separately

5. **Scalability**:
   - Add new agents without touching data domains
   - Agents can call LLM APIs centrally
   - Future: Replace rule-based agents with ML models

6. **Multi-Agent Patterns**:
   - Orchestrator resolves conflicts (e.g., "muscle gain needs surplus" vs "fat loss needs deficit")
   - Agents can vote on recommendations
   - Prioritization based on user goals

7. **Future-Proofing**:
   - Ready for actual LLM integration (Claude API, OpenAI)
   - Can add reinforcement learning
   - Can implement A/B testing at agent level

**Impact:**
- Architecture changes from 5 domains to 6 domains
- All intelligence logic migrates to MO:MIND over time
- Data domains become simpler (just data management)
- Clear boundary between data and intelligence

---

## Decision: Goals as Home Screen (January 2026)

### Context

Traditional fitness apps use one of these patterns:
- **Workout-first**: Homepage shows "Start Workout" button (Strong, Fitbod)
- **Feed-first**: Homepage shows social feed (Strava, Peloton)
- **Dashboard-first**: Homepage shows metrics grid (MyFitnessPal, Apple Health)

Our research showed:
- 84% abandon apps in first week with workout-first approach
- Social features are Phase 2 (not MVP)
- Metrics grids feel overwhelming to new users

### Decision

**Make Goals page the home screen** (primary landing page after onboarding).

**Rationale:**
1. Goals provide context for all other activities
2. Users understand "why" before being asked "what"
3. Progress visualization gives immediate value
4. Clear call-to-action based on current state

**User Flow:**
```
1. Open app → Goals page (home screen)
2. See current goals and progress
3. Get intelligent recommendations from MO:MIND
4. Tap recommendation → Execute (workout, log meal, measure, rest)
5. Return to Goals page → See updated progress
```

**Impact:**
- Onboarding flows directly to Goals page
- All navigation starts from Goals hub
- Other pages (workouts, nutrition, measurements) are accessed from Goals
- Goals become the "operating system" of the app

---

## Decision: Phased Intelligence Implementation (January 2026)

### Context

We have two options for implementing MO:MIND:

**Option A: Build MO:MIND first**
- Create full agent architecture upfront
- Then build MO:JOURNEY to use it
- Cleaner architecture from day 1

**Option B: Embed intelligence first**
- Build MO:JOURNEY with embedded intelligence
- Extract to MO:MIND later
- Faster time to MVP

### Decision

**Use phased approach (Option B)** - embed intelligence first, then extract.

**Phase 1: Embedded Intelligence (Week 1-2)**
```typescript
// lib/mo-journey/intelligence/
export function analyzeGoalProgress(goal, data) {
  // Intelligence logic embedded in JOURNEY
}
```

**Phase 2: Extract to MO:MIND (Week 3-4)**
```typescript
// lib/mo-mind/agents/journey-agent.ts
export class JourneyAgent {
  analyzeGoalProgress(goal, data) {
    // Same logic, now in MIND
  }
}

// lib/mo-journey/intelligence/
import { JourneyAgent } from '@/lib/mo-mind/agents/journey-agent';
export const analyzeGoalProgress = (goal, data) =>
  new JourneyAgent().analyzeGoalProgress(goal, data);
```

**Rationale:**
1. **Speed**: Get Goals page working in 1 week
2. **Learning**: Discover actual intelligence needs through usage
3. **Validation**: Test goal-setting patterns before committing to architecture
4. **Risk Reduction**: Don't over-engineer before proving concept
5. **Clean Migration**: Intelligence logic is in one place (lib/mo-journey/intelligence/), easy to move

**Impact:**
- MVP ships faster (1 week vs 2-3 weeks)
- Can pivot based on real usage data
- MO:MIND architecture informed by actual needs
- No technical debt (clean extraction path)

---

## Decision: Multi-Goal Support with Conflict Detection (January 2026)

### Context

Research showed that current fitness apps handle multiple goals poorly:
- Most force single-goal selection
- Some allow multiple but provide confusing/conflicting advice
- Users want to pursue multiple goals simultaneously (e.g., "get stronger" + "lose fat")

**The Problem: Goal Conflicts**
- Muscle gain requires caloric surplus
- Fat loss requires caloric deficit
- Body recomposition requires specific macro timing

### Decision

**Support multiple simultaneous goals with intelligent conflict detection**.

**Goal Priority System:**
```typescript
type GoalPriority = 'primary' | 'secondary' | 'background';

// User can have:
// - 1 primary goal (drives macro targets)
// - 2-3 secondary goals (influences training)
// - Unlimited background goals (tracking only)
```

**Conflict Detection Examples:**

1. **Contradictory Macro Goals:**
   ```typescript
   Primary: "Lose 10 lbs fat" (deficit)
   Secondary: "Gain 5 lbs muscle" (surplus)

   → MO:MIND detects conflict
   → Recommends: "Body Recomposition" sequence
   → Suggests: Deficit on rest days, surplus on training days
   ```

2. **Overtraining Risk:**
   ```typescript
   Primary: "Bench press 225 lbs"
   Secondary: "Run half marathon"

   → MO:MIND detects overtraining risk
   → Recommends: Periodization (strength phase, then endurance phase)
   → Suggests: Maintenance volume for secondary goal during primary focus
   ```

3. **Complementary Goals:**
   ```typescript
   Primary: "Lose 15 lbs"
   Secondary: "Improve sleep quality"

   → MO:MIND detects synergy
   → Reinforces: Better sleep improves fat loss
   → Suggests: Track sleep metrics as leading indicator
   ```

**Rationale:**
1. Respects user autonomy (doesn't force single goal)
2. Provides intelligent guidance (detects conflicts)
3. Educates user (explains why conflicts exist)
4. Offers solutions (phased approach, recomp, periodization)

**Impact:**
- Database schema includes `priority` field on goals
- MO:MIND orchestrator checks for conflicts
- UI shows conflict warnings with recommendations
- User satisfaction increases (no frustrating limitations)

---

## Decision: Minimal Phase 1 MVP (~1 week) (January 2026)

### Context

We could build a comprehensive Goals system with all features, or start minimal and iterate.

**Full Phase 1 Option (2-3 weeks):**
- Multiple goal types (muscle gain, fat loss, strength, recomp, general)
- Photo comparison tools
- Measurement tracking with body part selection
- Advanced visualizations (charts, trends, predictions)
- Milestone system (weekly, monthly, quarterly)
- Social sharing

**Minimal Phase 1 Option (1 week):**
- Single goal creation (type, target, timeline)
- Basic measurement logging (weight, key measurements)
- Simple progress visualization (percentage complete)
- One intelligent recommendation per day

### Decision

**Build Minimal Phase 1 (~1 week)** with rapid iteration.

**MVP Scope:**

**Goals:**
- ✅ Create one goal at a time
- ✅ Goal types: muscle_building | fat_loss | strength | recomp | general
- ✅ Required: target metric, target value, target date
- ✅ Status: active | paused | completed

**Measurements:**
- ✅ Weight tracking (primary metric)
- ✅ Key measurements: chest, waist, hips (body recomp)
- ✅ Manual logging only (no photo comparison yet)

**Progress Visualization:**
- ✅ Simple percentage bar
- ✅ "Days remaining" counter
- ✅ Last measurement date
- ✅ Trend arrow (up/down/stable)

**Intelligence (Embedded):**
- ✅ One recommendation per day
- ✅ Based on: goal type, days since last measurement, workout history
- ✅ Examples: "Log your weight", "Take measurements", "Check workout"

**Out of Scope (Phase 2):**
- ❌ Multiple simultaneous goals
- ❌ Photo comparison
- ❌ Advanced charts/trends
- ❌ Milestone system
- ❌ Social sharing
- ❌ Wearable integration

**Rationale:**
1. **Speed**: Ship in 1 week vs 2-3 weeks
2. **Learning**: 84% abandon in first week - need to test approach quickly
3. **Validation**: Prove goal-setting value before adding complexity
4. **Iteration**: Add features based on actual usage patterns

**Impact:**
- Goals page ships in Week 1
- User feedback informs Phase 2 priorities
- Can pivot quickly if approach doesn't resonate
- Lower risk of over-engineering

---

## Summary of Decisions

| Decision | Impact | Status |
|----------|--------|--------|
| Create MO:JOURNEY domain | +1 strategic domain (5 total) | Approved |
| Create MO:MIND domain | +1 intelligence domain (6 total) | Approved |
| Goals as Home Screen | Changes default landing page | Approved |
| Phased Intelligence | Embed first, extract later | Approved |
| Multi-Goal Support | Conflict detection required | Approved |
| Minimal Phase 1 MVP | Ships in 1 week | Approved |
| Keep Onboarding Simple | Goal creation in Goals page | Approved |
| Social Features Phase 2 | Deferred | Approved |

---

## Next Steps

1. **Document MO:JOURNEY architecture** (domain-level spec)
2. **Document MO:MIND architecture** (agent-based spec)
3. **Update architecture overview** (6 domains)
4. **Plan implementation** (Minimal Phase 1)
5. **Build Goals page MVP** (Week 1)
6. **Extract intelligence to MO:MIND** (Week 3-4)

---

## References

- [MO:JOURNEY Domain Specification](./mo-journey.md)
- [MO:MIND Domain Specification](./mo-mind.md)
- [Architecture Overview](./overview.md)
- [Development Workflow](../development/workflow.md)
