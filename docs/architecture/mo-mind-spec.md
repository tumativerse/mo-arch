---
sidebar_position: 5
title: MO:MIND Specification
---

# MO:MIND - Detailed Specification

**Domain:** Intelligence Layer
**Personality:** "The Advisor"
**Role:** Analyzes data, detects patterns, provides intelligent recommendations

---

## Purpose

MO:MIND is the centralized intelligence domain that:
- **Analyzes**: Processes data from all domains to extract insights
- **Recommends**: Provides actionable advice based on analysis
- **Coordinates**: Orchestrates multiple specialized agents
- **Learns**: Adapts recommendations based on user behavior (future)

**Philosophy:** Data domains know "what" happened. MO:MIND understands "why" and suggests "what's next".

---

## Position in Architecture

```
                    ┌─────────────┐
                    │  MO:MIND    │
                    │ (Intelligence)
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │ MO:JOURNEY  │    │  MO:COACH   │    │  MO:PULSE   │
 │ (Strategy)  │    │ (Training)  │    │ (Tracking)  │
 └─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────┴──────┐
                    │   MO:SELF   │
                    │ (Identity)  │
                    └─────────────┘
```

**MO:MIND sits above all domains:**
- It doesn't own data (data lives in domain databases)
- It doesn't execute actions (domains handle that)
- It analyzes and recommends (pure intelligence layer)

---

## Architecture: Agent-Based System

MO:MIND uses an **agent-based architecture** with specialized agents coordinated by an orchestrator.

### Why Agents?

**Traditional Approach (Scattered Intelligence):**
```typescript
// Intelligence logic scattered across domains:
lib/mo-coach/fatigue.ts          // Training intelligence
lib/mo-journey/progress.ts       // Goal intelligence
lib/mo-pulse/nutrition.ts        // Nutrition intelligence
lib/mo-pulse/recovery.ts         // Recovery intelligence

// Problems:
// - Duplication (similar ML logic repeated)
// - Inconsistency (different recommendation styles)
// - Hard to test (coupled to domain logic)
// - Can't collaborate (fatigue affects goals, but they're separate)
```

**Agent-Based Approach (Centralized Intelligence):**
```typescript
// All intelligence in MO:MIND:
lib/mo-mind/agents/journey-agent.ts    // Goal intelligence
lib/mo-mind/agents/training-agent.ts   // Workout intelligence
lib/mo-mind/agents/nutrition-agent.ts  // Meal intelligence
lib/mo-mind/agents/recovery-agent.ts   // Sleep/rest intelligence
lib/mo-mind/orchestrator/               // Coordinates agents

// Benefits:
// ✅ Single source of truth for intelligence
// ✅ Consistent recommendation format
// ✅ Agents can collaborate (via orchestrator)
// ✅ Testable in isolation
// ✅ Easy to swap implementations (rule-based → ML → LLM)
```

---

## Agents

MO:MIND contains 4 specialized agents + 1 orchestrator:

### 1. Journey Agent (Goal Intelligence)

**Purpose:** Analyzes goal progress and recommends actions

**Responsibilities:**
- Calculate goal progress (% complete, ahead/behind)
- Detect trends (linear, plateau, exponential)
- Predict completion dates
- Recommend goal adjustments (change timeline, modify approach)
- Detect goal conflicts (muscle gain vs fat loss)

**Input:**
```typescript
{
  goals: Goal[];                    // From MO:JOURNEY
  measurements: Measurement[];      // From MO:JOURNEY
  workouts: WorkoutSession[];       // From MO:PULSE
  recoveryLogs: RecoveryLog[];      // From MO:PULSE
}
```

**Output:**
```typescript
{
  progress: {
    percentComplete: number;
    status: "ahead" | "on-track" | "behind";
    trend: "up" | "down" | "stable";
    predictedCompletion: Date;
  };
  recommendations: [
    "Log your weight today (last measurement was 7 days ago)",
    "You're behind schedule - consider adding 1 cardio session per week",
    "Great job! You're ahead of schedule."
  ];
  conflicts: [
    {
      goals: ["goal_1", "goal_2"],
      issue: "Muscle gain requires surplus, fat loss requires deficit",
      resolution: "Consider sequential approach or body recomposition"
    }
  ];
}
```

**Example Implementation (Phase 1 - Rule-based):**
```typescript
export class JourneyAgent {
  analyzeGoalProgress(input: JourneyInput): JourneyOutput {
    const { goals, measurements } = input;

    return goals.map(goal => {
      const latest = measurements[0];
      const progress = this.calculateProgress(goal, measurements);
      const recommendations = this.generateRecommendations(goal, measurements);

      return {
        goalId: goal.id,
        progress,
        recommendations,
      };
    });
  }

  private calculateProgress(goal: Goal, measurements: Measurement[]) {
    const latest = measurements[0];
    const totalDistance = Math.abs(goal.targetMetric - goal.startingMetric);
    const currentDistance = Math.abs(latest.weight - goal.startingMetric);
    const percentComplete = (currentDistance / totalDistance) * 100;

    const daysElapsed = daysBetween(goal.startDate, new Date());
    const daysTotal = daysBetween(goal.startDate, goal.targetDate);
    const timeProgress = (daysElapsed / daysTotal) * 100;

    return {
      percentComplete: Math.min(percentComplete, 100),
      status: percentComplete >= timeProgress ? "ahead" : "behind",
    };
  }

  private generateRecommendations(goal: Goal, measurements: Measurement[]) {
    const recommendations = [];

    // Check if measurement is overdue
    const daysSinceLastMeasurement = daysBetween(measurements[0].date, new Date());
    if (daysSinceLastMeasurement >= 7) {
      recommendations.push("Log your weight today (last measurement was 7 days ago)");
    }

    // Check if behind schedule
    const progress = this.calculateProgress(goal, measurements);
    if (progress.status === "behind") {
      recommendations.push("You're behind schedule - consider adding 1 cardio session per week");
    }

    // Check if ahead
    if (progress.status === "ahead") {
      recommendations.push("Great job! You're ahead of schedule.");
    }

    return recommendations;
  }
}
```

---

### 2. Training Agent (Workout Intelligence)

**Purpose:** Analyzes training data and recommends progression

**Responsibilities:**
- Calculate fatigue status (undertraining, optimal, overreaching, overtraining)
- Recommend weight/rep progressions
- Detect deload needs
- Suggest exercise substitutions
- Analyze volume trends

**Input:**
```typescript
{
  workouts: WorkoutSession[];       // From MO:PULSE
  exercises: Exercise[];            // From MO:PULSE
  recoveryLogs: RecoveryLog[];      // From MO:PULSE
  userProfile: UserProfile;         // From MO:SELF
}
```

**Output:**
```typescript
{
  fatigue: {
    status: "undertraining" | "optimal" | "overreaching" | "overtraining";
    score: number; // 0-100
    factors: ["Soreness: 7/10", "Sleep: 6 hours", "Energy: 4/10"];
  };
  progression: {
    exercise: "Bench Press";
    currentWeight: 185;
    suggestedWeight: 190;
    reasoning: "Hit 3x5 at RPE 7, ready to progress";
  };
  deload: {
    needed: boolean;
    reasoning: "Volume accumulated for 6 weeks, deload recommended";
    suggestions: ["Reduce weight by 30%", "Reduce sets by 50%"];
  };
}
```

**Example Implementation (Phase 1 - Rule-based):**
```typescript
export class TrainingAgent {
  analyzeFatigue(input: TrainingInput): FatigueOutput {
    const { workouts, recoveryLogs } = input;

    // Calculate fatigue score from multiple factors
    const factors = {
      soreness: this.calculateSorenessScore(recoveryLogs),
      sleep: this.calculateSleepScore(recoveryLogs),
      energy: this.calculateEnergyScore(recoveryLogs),
      volume: this.calculateVolumeScore(workouts),
    };

    const fatigueScore =
      factors.soreness * 0.3 +
      factors.sleep * 0.3 +
      factors.energy * 0.2 +
      factors.volume * 0.2;

    let status: FatigueStatus;
    if (fatigueScore < 30) status = "undertraining";
    else if (fatigueScore < 70) status = "optimal";
    else if (fatigueScore < 85) status = "overreaching";
    else status = "overtraining";

    return {
      status,
      score: fatigueScore,
      factors: Object.entries(factors).map(([key, value]) => `${key}: ${value}/100`),
    };
  }

  recommendProgression(input: TrainingInput): ProgressionOutput {
    const { workouts } = input;

    // Get last 3 sessions for exercise
    const recentSessions = workouts.slice(0, 3);

    // Check if ready to progress
    const lastSession = recentSessions[0];
    const hitTargetReps = lastSession.sets.every(set => set.reps >= set.targetReps);
    const rpeOk = lastSession.sets.every(set => set.rpe <= 8);

    if (hitTargetReps && rpeOk) {
      return {
        exercise: lastSession.exercise.name,
        currentWeight: lastSession.sets[0].weight,
        suggestedWeight: lastSession.sets[0].weight + 5, // 5 lb progression
        reasoning: `Hit ${lastSession.sets[0].targetReps} reps at RPE ${lastSession.sets[0].rpe}, ready to progress`,
      };
    }

    return null; // Not ready to progress
  }
}
```

---

### 3. Nutrition Agent (Meal Intelligence)

**Purpose:** Analyzes nutrition data and recommends macro adjustments

**Responsibilities:**
- Calculate TDEE (Total Daily Energy Expenditure)
- Recommend macro targets based on goals
- Detect macro imbalances
- Suggest meal timing optimizations
- Analyze nutrient trends

**Input:**
```typescript
{
  goals: Goal[];                    // From MO:JOURNEY
  meals: Meal[];                    // From MO:PULSE
  bodyMetrics: BodyMetrics[];       // From MO:PULSE
  activityLevel: ActivityLevel;     // From MO:SELF
}
```

**Output:**
```typescript
{
  tdee: {
    bmr: 1800;           // Basal Metabolic Rate
    activityMultiplier: 1.5;
    totalTdee: 2700;
  };
  macros: {
    protein: { target: 180, current: 150, status: "low" };
    carbs: { target: 300, current: 320, status: "ok" };
    fats: { target: 75, current: 80, status: "ok" };
    calories: { target: 2500, current: 2480, status: "on-track" };
  };
  recommendations: [
    "Increase protein by 30g (add 1 scoop whey or 4oz chicken)",
    "You're consistently hitting calorie target - great job!",
    "Consider front-loading carbs pre-workout for better performance"
  ];
}
```

**Example Implementation (Phase 2 - After nutrition tracking is built):**
```typescript
export class NutritionAgent {
  calculateTDEE(input: NutritionInput): TDEEOutput {
    const { bodyMetrics, activityLevel } = input;
    const latestWeight = bodyMetrics[0].weight;

    // Mifflin-St Jeor equation
    const bmr = 10 * latestWeight + 6.25 * bodyMetrics[0].height - 5 * bodyMetrics[0].age + 5;

    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    return { bmr, activityMultiplier: activityMultipliers[activityLevel], totalTdee: tdee };
  }

  recommendMacros(input: NutritionInput): MacroOutput {
    const { goals, bodyMetrics } = input;
    const tdee = this.calculateTDEE(input).totalTdee;
    const latestWeight = bodyMetrics[0].weight;

    // Adjust TDEE based on goal
    const primaryGoal = goals.find(g => g.priority === "primary");
    let targetCalories = tdee;

    if (primaryGoal.goalType === "fat_loss") {
      targetCalories = tdee - 500; // 500 cal deficit
    } else if (primaryGoal.goalType === "muscle_building") {
      targetCalories = tdee + 300; // 300 cal surplus
    }

    // Protein: 0.8-1g per lb bodyweight
    const proteinTarget = latestWeight * 0.9;

    // Fats: 25-30% of calories
    const fatTarget = (targetCalories * 0.28) / 9; // 9 cal/g

    // Carbs: Remainder
    const carbTarget = (targetCalories - proteinTarget * 4 - fatTarget * 9) / 4;

    return {
      protein: { target: proteinTarget },
      carbs: { target: carbTarget },
      fats: { target: fatTarget },
      calories: { target: targetCalories },
    };
  }
}
```

---

### 4. Recovery Agent (Sleep/Rest Intelligence)

**Purpose:** Analyzes recovery data and recommends rest strategies

**Responsibilities:**
- Analyze sleep quality and duration
- Recommend rest days based on fatigue
- Detect overtraining signals
- Suggest recovery modalities (stretching, massage, active recovery)
- Optimize training volume based on recovery capacity

**Input:**
```typescript
{
  recoveryLogs: RecoveryLog[];      // From MO:PULSE
  workouts: WorkoutSession[];       // From MO:PULSE
  goals: Goal[];                    // From MO:JOURNEY
}
```

**Output:**
```typescript
{
  sleepAnalysis: {
    averageHours: 7.2;
    quality: "good" | "fair" | "poor";
    trend: "improving" | "stable" | "declining";
    recommendations: ["Aim for 8+ hours on training days"];
  };
  restDayNeeded: {
    needed: boolean;
    urgency: "low" | "medium" | "high";
    reasoning: "Soreness 8/10, sleep 5 hours, energy 3/10";
    suggestion: "Take a full rest day or active recovery (light walk)";
  };
  recoveryModalities: [
    "Foam roll lower body (high soreness)",
    "Cold shower or ice bath (reduce inflammation)",
    "10 min stretching (improve mobility)"
  ];
}
```

**Example Implementation (Phase 2):**
```typescript
export class RecoveryAgent {
  analyzeSleep(input: RecoveryInput): SleepOutput {
    const { recoveryLogs } = input;

    // Last 7 days
    const recentLogs = recoveryLogs.slice(0, 7);
    const averageHours = recentLogs.reduce((sum, log) => sum + log.sleepHours, 0) / recentLogs.length;

    let quality: "good" | "fair" | "poor";
    if (averageHours >= 7.5) quality = "good";
    else if (averageHours >= 6.5) quality = "fair";
    else quality = "poor";

    const recommendations = [];
    if (quality === "poor") {
      recommendations.push("Aim for 8+ hours on training days");
      recommendations.push("Consider earlier bedtime or later wake time");
    }

    return { averageHours, quality, recommendations };
  }

  recommendRestDay(input: RecoveryInput): RestDayOutput {
    const { recoveryLogs, workouts } = input;

    const latestLog = recoveryLogs[0];
    const fatigueScore =
      latestLog.soreness * 0.4 +
      (10 - latestLog.sleepHours) * 0.3 +
      (10 - latestLog.energyLevel) * 0.3;

    let needed = false;
    let urgency: "low" | "medium" | "high" = "low";

    if (fatigueScore > 7) {
      needed = true;
      urgency = "high";
    } else if (fatigueScore > 5) {
      needed = true;
      urgency = "medium";
    }

    return {
      needed,
      urgency,
      reasoning: `Soreness ${latestLog.soreness}/10, sleep ${latestLog.sleepHours} hours, energy ${latestLog.energyLevel}/10`,
      suggestion: needed
        ? "Take a full rest day or active recovery (light walk)"
        : "You're recovered - ready to train",
    };
  }
}
```

---

### 5. Orchestrator (Multi-Agent Coordination)

**Purpose:** Coordinates multiple agents and resolves conflicts

**Responsibilities:**
- Call multiple agents in parallel
- Detect recommendation conflicts
- Prioritize recommendations based on user goals
- Merge recommendations into unified output
- Provide context for recommendations

**Example Workflow:**
```typescript
export class MindOrchestrator {
  async generateDailyRecommendations(userId: string) {
    // 1. Fetch data from all domains
    const goals = await MO_JOURNEY.getActiveGoals(userId);
    const measurements = await MO_JOURNEY.getMeasurements(userId);
    const workouts = await MO_PULSE.getWorkoutHistory(userId);
    const recoveryLogs = await MO_PULSE.getRecoveryLogs(userId);
    const meals = await MO_PULSE.getMeals(userId);

    // 2. Call all agents in parallel
    const [journeyAnalysis, trainingAnalysis, nutritionAnalysis, recoveryAnalysis] =
      await Promise.all([
        journeyAgent.analyzeGoalProgress({ goals, measurements, workouts, recoveryLogs }),
        trainingAgent.analyzeFatigue({ workouts, recoveryLogs }),
        nutritionAgent.recommendMacros({ goals, meals }),
        recoveryAgent.recommendRestDay({ recoveryLogs, workouts }),
      ]);

    // 3. Detect conflicts
    const conflicts = this.detectConflicts({
      journey: journeyAnalysis,
      training: trainingAnalysis,
      nutrition: nutritionAnalysis,
      recovery: recoveryAnalysis,
    });

    // 4. Resolve conflicts
    const resolvedRecommendations = this.resolveConflicts(conflicts);

    // 5. Prioritize recommendations
    const prioritized = this.prioritizeRecommendations(resolvedRecommendations, goals);

    // 6. Return unified output
    return {
      topRecommendation: prioritized[0],
      allRecommendations: prioritized,
      insights: {
        journeyAnalysis,
        trainingAnalysis,
        nutritionAnalysis,
        recoveryAnalysis,
      },
      conflicts: conflicts.length > 0 ? conflicts : null,
    };
  }

  private detectConflicts(analyses: AllAnalyses): Conflict[] {
    const conflicts = [];

    // Example: Training agent says "train today", but recovery agent says "rest day needed"
    if (
      analyses.training.progression &&
      analyses.recovery.restDayNeeded.needed &&
      analyses.recovery.restDayNeeded.urgency === "high"
    ) {
      conflicts.push({
        type: "training_vs_recovery",
        agents: ["training", "recovery"],
        issue: "Training agent recommends workout, but recovery agent recommends rest",
        resolution: "Prioritize recovery - high urgency rest day needed",
      });
    }

    // Example: Journey agent says "increase calories", but nutrition agent says "deficit needed"
    if (
      analyses.journey.progress.status === "behind" &&
      analyses.nutrition.macros.calories.target < analyses.nutrition.tdee.totalTdee
    ) {
      conflicts.push({
        type: "goal_vs_nutrition",
        agents: ["journey", "nutrition"],
        issue: "Behind on goal, but already in deficit",
        resolution: "Review goal timeline - may need to extend target date",
      });
    }

    return conflicts;
  }

  private resolveConflicts(conflicts: Conflict[]): Recommendation[] {
    // Resolution rules:
    // 1. Recovery always wins over training (prevent injury)
    // 2. Nutrition goals align with primary journey goal
    // 3. If conflict can't be resolved, surface to user

    return conflicts.map(conflict => {
      if (conflict.type === "training_vs_recovery") {
        return {
          text: "Take a rest day today - recovery is critical",
          priority: "high",
          source: "recovery",
        };
      }

      if (conflict.type === "goal_vs_nutrition") {
        return {
          text: "Consider extending goal timeline by 2 weeks or increasing deficit slightly",
          priority: "medium",
          source: "journey",
        };
      }

      return {
        text: conflict.resolution,
        priority: "medium",
        source: "orchestrator",
      };
    });
  }

  private prioritizeRecommendations(
    recommendations: Recommendation[],
    goals: Goal[]
  ): Recommendation[] {
    // Priority order:
    // 1. High-priority conflicts (recovery, injury prevention)
    // 2. Primary goal recommendations
    // 3. Secondary goal recommendations
    // 4. General health recommendations

    const primaryGoal = goals.find(g => g.priority === "primary");

    return recommendations.sort((a, b) => {
      if (a.priority === "high" && b.priority !== "high") return -1;
      if (a.source === primaryGoal?.goalType && b.source !== primaryGoal?.goalType) return -1;
      return 0;
    });
  }
}
```

---

## Integration with Data Domains

### How Domains Use MO:MIND

**MO:JOURNEY (Goals Page):**
```typescript
export default async function GoalsPage() {
  const goals = await MO_JOURNEY.getActiveGoals();

  // Consult MO:MIND for intelligent analysis
  const intelligence = await MO_MIND.generateDailyRecommendations(userId);

  return (
    <GoalsHub
      goals={goals}
      topRecommendation={intelligence.topRecommendation}
      allRecommendations={intelligence.allRecommendations}
      insights={intelligence.insights}
    />
  );
}
```

**MO:COACH (Training Page):**
```typescript
export async function getWorkoutRecommendations() {
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

  return { fatigueAnalysis, progressionAdvice };
}
```

**MO:PULSE (Nutrition Page - Future):**
```typescript
export async function getMacroRecommendations() {
  const goals = await MO_JOURNEY.getActiveGoals();
  const meals = await MO_PULSE.getMeals();
  const bodyMetrics = await MO_PULSE.getBodyMetrics();

  // Consult MO:MIND Nutrition Agent
  const macroAdvice = await MO_MIND.nutritionAgent.recommendMacros({
    goals,
    meals,
    bodyMetrics,
  });

  return macroAdvice;
}
```

---

## API Design

### Orchestrator API

```typescript
POST /api/mind/daily-recommendations
Request:
{
  "userId": "user_123"
}

Response:
{
  "topRecommendation": {
    "text": "Log your weight today (last measurement was 7 days ago)",
    "priority": "high",
    "source": "journey",
    "action": {
      "type": "navigate",
      "path": "/goals/log-measurement"
    }
  },
  "allRecommendations": [
    { /* ... */ },
    { /* ... */ }
  ],
  "insights": {
    "journeyAnalysis": { /* ... */ },
    "trainingAnalysis": { /* ... */ },
    "nutritionAnalysis": { /* ... */ },
    "recoveryAnalysis": { /* ... */ }
  },
  "conflicts": null
}
```

### Individual Agent APIs

```typescript
// Journey Agent
POST /api/mind/agents/journey/analyze-goals
Request:
{
  "goals": [ /* ... */ ],
  "measurements": [ /* ... */ ]
}

Response:
{
  "progress": { /* ... */ },
  "recommendations": [ /* ... */ ],
  "conflicts": [ /* ... */ ]
}

// Training Agent
POST /api/mind/agents/training/analyze-fatigue
Request:
{
  "workouts": [ /* ... */ ],
  "recoveryLogs": [ /* ... */ ]
}

Response:
{
  "fatigue": { /* ... */ },
  "progression": { /* ... */ },
  "deload": { /* ... */ }
}
```

---

## Implementation Phases

### Phase 1: Embedded Intelligence (Week 1-2)

**Goal:** Ship Goals page with basic intelligence embedded in MO:JOURNEY

**Implementation:**
```typescript
// lib/mo-journey/intelligence/analyze-progress.ts
export function analyzeGoalProgress(goal: Goal, measurements: Measurement[]) {
  // Rule-based logic embedded in JOURNEY
  const percentComplete = calculateProgress(goal, measurements);
  const recommendations = generateRecommendations(goal, measurements);
  return { percentComplete, recommendations };
}

// app/(app)/goals/page.tsx
const progress = analyzeGoalProgress(goal, measurements);
```

**Status:** In-domain intelligence (no separate MO:MIND yet)

---

### Phase 2: Extract Journey Agent (Week 3)

**Goal:** Move intelligence to MO:MIND, starting with Journey Agent

**Implementation:**
```typescript
// lib/mo-mind/agents/journey-agent.ts
export class JourneyAgent {
  analyzeGoalProgress(input: JourneyInput): JourneyOutput {
    // Same logic, now in MIND domain
  }
}

// lib/mo-journey/intelligence/analyze-progress.ts (updated)
import { JourneyAgent } from "@/lib/mo-mind/agents/journey-agent";

export function analyzeGoalProgress(goal: Goal, measurements: Measurement[]) {
  const agent = new JourneyAgent();
  return agent.analyzeGoalProgress({ goals: [goal], measurements });
}

// app/(app)/goals/page.tsx (no changes needed!)
const progress = analyzeGoalProgress(goal, measurements);
```

**Status:** Journey Agent extracted, clean interface maintained

---

### Phase 3: Add Training Agent (Week 4)

**Goal:** Extract existing training intelligence from MO:COACH to MO:MIND

**Implementation:**
```typescript
// lib/mo-mind/agents/training-agent.ts
export class TrainingAgent {
  analyzeFatigue(input: TrainingInput): FatigueOutput {
    // Move logic from lib/mo-coach/fatigue.ts
  }
}

// lib/mo-coach/fatigue.ts (updated)
import { TrainingAgent } from "@/lib/mo-mind/agents/training-agent";

export async function getFatigueStatus(userId: string) {
  const workouts = await getWorkoutHistory(userId);
  const recoveryLogs = await getRecoveryLogs(userId);

  const agent = new TrainingAgent();
  return agent.analyzeFatigue({ workouts, recoveryLogs });
}
```

**Status:** Training Agent extracted, MO:COACH now consumes from MO:MIND

---

### Phase 4: Build Orchestrator (Week 5)

**Goal:** Create orchestrator to coordinate multiple agents

**Implementation:**
```typescript
// lib/mo-mind/orchestrator/index.ts
export class MindOrchestrator {
  private journeyAgent = new JourneyAgent();
  private trainingAgent = new TrainingAgent();

  async generateDailyRecommendations(userId: string) {
    // Fetch data
    const data = await this.fetchAllData(userId);

    // Call agents in parallel
    const [journeyAnalysis, trainingAnalysis] = await Promise.all([
      this.journeyAgent.analyzeGoalProgress(data),
      this.trainingAgent.analyzeFatigue(data),
    ]);

    // Detect conflicts
    const conflicts = this.detectConflicts({ journeyAnalysis, trainingAnalysis });

    // Prioritize
    return this.prioritizeRecommendations(conflicts);
  }
}
```

**Status:** Orchestrator built, multi-agent coordination working

---

### Phase 5: Add Nutrition & Recovery Agents (Week 6+)

**Goal:** Complete agent suite

**Implementation:**
```typescript
// lib/mo-mind/agents/nutrition-agent.ts
export class NutritionAgent { /* ... */ }

// lib/mo-mind/agents/recovery-agent.ts
export class RecoveryAgent { /* ... */ }

// lib/mo-mind/orchestrator/index.ts (updated)
export class MindOrchestrator {
  private journeyAgent = new JourneyAgent();
  private trainingAgent = new TrainingAgent();
  private nutritionAgent = new NutritionAgent();
  private recoveryAgent = new RecoveryAgent();

  async generateDailyRecommendations(userId: string) {
    // All 4 agents called in parallel
  }
}
```

**Status:** Full agent suite, comprehensive intelligence

---

## Testing Strategy

### Unit Tests (Agent Level)

**Journey Agent:**
```typescript
describe("JourneyAgent", () => {
  it("should calculate progress correctly", () => {
    const agent = new JourneyAgent();
    const goal = { startingMetric: 180, targetMetric: 170 };
    const measurements = [{ weight: 175 }]; // 50% progress

    const result = agent.analyzeGoalProgress({ goals: [goal], measurements });
    expect(result.progress.percentComplete).toBe(50);
  });

  it("should detect 'behind schedule' status", () => {
    const agent = new JourneyAgent();
    const goal = {
      startDate: "2026-01-01",
      targetDate: "2026-03-01", // 60 days
      startingMetric: 180,
      targetMetric: 170,
    };
    const measurements = [
      { date: "2026-02-01", weight: 178 }, // 30 days in, only 20% progress
    ];

    const result = agent.analyzeGoalProgress({ goals: [goal], measurements });
    expect(result.progress.status).toBe("behind");
  });
});
```

**Training Agent:**
```typescript
describe("TrainingAgent", () => {
  it("should detect high fatigue", () => {
    const agent = new TrainingAgent();
    const recoveryLogs = [
      { soreness: 8, sleepHours: 5, energyLevel: 3 }, // High fatigue
    ];

    const result = agent.analyzeFatigue({ recoveryLogs });
    expect(result.fatigue.status).toBe("overtraining");
  });

  it("should recommend progression when ready", () => {
    const agent = new TrainingAgent();
    const workouts = [
      {
        exercise: { name: "Bench Press" },
        sets: [
          { weight: 185, reps: 5, targetReps: 5, rpe: 7 },
          { weight: 185, reps: 5, targetReps: 5, rpe: 7 },
          { weight: 185, reps: 5, targetReps: 5, rpe: 7 },
        ],
      },
    ];

    const result = agent.recommendProgression({ workouts });
    expect(result.suggestedWeight).toBe(190); // 5 lb increase
  });
});
```

---

### Integration Tests (Orchestrator Level)

**Conflict Detection:**
```typescript
describe("MindOrchestrator", () => {
  it("should detect training vs recovery conflict", async () => {
    const orchestrator = new MindOrchestrator();

    // Mock agents
    vi.spyOn(orchestrator.trainingAgent, "recommendProgression").mockReturnValue({
      exercise: "Squat",
      suggestedWeight: 300,
    });

    vi.spyOn(orchestrator.recoveryAgent, "recommendRestDay").mockReturnValue({
      needed: true,
      urgency: "high",
    });

    const result = await orchestrator.generateDailyRecommendations("user_123");

    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].type).toBe("training_vs_recovery");
    expect(result.topRecommendation.text).toContain("rest day");
  });
});
```

---

### E2E Tests (Full Flow)

**Daily Recommendation Flow:**
```typescript
describe("Daily Recommendations", () => {
  it("should provide intelligent recommendations on Goals page", async () => {
    await signIn();
    await navigateTo("/goals");

    // Should show recommendation from MO:MIND
    expect(screen.getByText(/Log your weight today/i)).toBeInTheDocument();

    // Click recommendation
    await click("Log your weight today");

    // Should navigate to measurement logging
    expect(window.location.pathname).toBe("/goals/log-measurement");
  });
});
```

---

## Future Enhancements

### Machine Learning Integration

Replace rule-based agents with ML models:

```typescript
export class JourneyAgent {
  private model: TensorFlowModel;

  async analyzeGoalProgress(input: JourneyInput): Promise<JourneyOutput> {
    // Use ML model instead of rules
    const features = this.extractFeatures(input);
    const prediction = await this.model.predict(features);

    return {
      progress: prediction.progress,
      recommendations: prediction.recommendations,
    };
  }
}
```

---

### LLM Integration (GPT-4, Claude)

Use LLMs for natural language recommendations:

```typescript
export class JourneyAgent {
  private llm: OpenAI;

  async analyzeGoalProgress(input: JourneyInput): Promise<JourneyOutput> {
    const prompt = `
      User has a goal to ${input.goals[0].goalType}.
      Starting weight: ${input.goals[0].startingMetric} lbs
      Target weight: ${input.goals[0].targetMetric} lbs
      Current weight: ${input.measurements[0].weight} lbs

      Analyze their progress and provide:
      1. Status (ahead/on-track/behind)
      2. One actionable recommendation
    `;

    const response = await this.llm.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return this.parseResponse(response.choices[0].message.content);
  }
}
```

---

### Reinforcement Learning

Agents learn from user behavior:

```typescript
export class JourneyAgent {
  async analyzeGoalProgress(input: JourneyInput): Promise<JourneyOutput> {
    const recommendations = this.generateRecommendations(input);

    // Track which recommendations users follow
    await this.trackRecommendation(recommendations);

    // Over time, learn which recommendations are most effective
    const optimizedRecommendations = await this.optimizeWithRL(recommendations);

    return { recommendations: optimizedRecommendations };
  }

  private async trackRecommendation(recommendations: Recommendation[]) {
    // Store recommendation in database
    // Track if user followed it (action taken within 24 hours)
    // Track if it led to positive outcome (goal progress improved)
  }

  private async optimizeWithRL(recommendations: Recommendation[]) {
    // Use historical data to rank recommendations
    // Prioritize recommendations with highest follow-through rate
    // A/B test new recommendation phrasings
  }
}
}
```

---

## Summary

MO:MIND is the centralized intelligence domain that:
- Uses agent-based architecture (Journey, Training, Nutrition, Recovery agents)
- Sits above data domains (analyzes data, doesn't own it)
- Provides consistent, intelligent recommendations
- Coordinates multiple agents via orchestrator
- Resolves conflicts between competing recommendations
- Future-proofs for ML/LLM integration

**Key Principles:**
1. Separation of concerns (data vs intelligence)
2. Agent specialization (each agent does one thing well)
3. Orchestration (agents collaborate, don't compete)
4. Testability (agents are independently testable)
5. Scalability (easy to add new agents)
6. Consistency (unified recommendation format)

**Implementation Strategy:**
- Phase 1: Embed intelligence in domains (fast MVP)
- Phase 2: Extract to MO:MIND (cleaner architecture)
- Phase 3: Build orchestrator (multi-agent coordination)
- Phase 4: Add ML/LLM (smarter recommendations)

---

## References

- [Architectural Decisions](./decisions.md)
- [MO:JOURNEY Domain Specification](./mo-journey-spec.md)
- [Architecture Overview](./overview.md)
- [Development Workflow](../development/workflow.md)
