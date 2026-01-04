---
sidebar_position: 2
title: Specification
---

# MO:JOURNEY - Detailed Specification

**Domain:** Strategic Orchestration
**Personality:** "The Navigator"
**Role:** Guides you toward your goals, tracks progress, celebrates milestones

---

## Purpose

MO:JOURNEY is the strategic orchestration domain that manages:
- **Goal Setting**: Define specific, measurable fitness goals
- **Progress Tracking**: Monitor advancement toward goals across time
- **Milestone Management**: Break long journeys into achievable checkpoints
- **Visualization**: Show where you've been and where you're going
- **Orchestration**: Coordinate actions across all other domains to serve your goals

**Philosophy:** Your goals are the "why" that drives all other activities. MO:JOURNEY keeps you focused on what matters.

---

## Position in Architecture

```
MO:JOURNEY (Strategic Layer - Orchestrator)
     ↓
┌────┴─────────────────────────────────────┐
│                                           │
▼                                           ▼
MO:SELF (Identity)                    MO:PULSE (Tracking)
MO:COACH (Training Intelligence)      MO:FUEL (Nutrition)
MO:CONNECT (Ecosystem)                MO:MIND (Intelligence)
```

**MO:JOURNEY sits above other domains:**
- It doesn't collect data (that's MO:PULSE)
- It doesn't provide training advice (that's MO:COACH)
- It doesn't make intelligent recommendations (that's MO:MIND)
- It orchestrates all domains to serve your goals

---

## Verticals

MO:JOURNEY contains 3 verticals:

### 1. MoGoals (Goal Management)

**Purpose:** Create, update, and manage fitness goals

**Responsibilities:**
- Goal creation with SMART parameters (Specific, Measurable, Achievable, Relevant, Time-bound)
- Goal prioritization (primary, secondary, background)
- Goal status tracking (active, paused, completed)
- Goal validation (detect conflicts, suggest alternatives)

**Systems:**
- `MoGoalTypes` - Define goal categories (muscle_building, fat_loss, strength, recomp, general)
- `MoGoalCreate` - Create new goals with validation
- `MoGoalUpdate` - Modify existing goals
- `MoGoalArchive` - Complete or pause goals

**Example Goals:**
```typescript
{
  id: "goal_1",
  userId: "user_123",
  goalType: "body_recomp",
  priority: "primary",
  status: "active",
  startDate: "2026-01-01",
  targetDate: "2026-04-01", // 12 weeks (realistic for recomp)
  startingMetric: 180,       // lbs
  targetMetric: 175,         // lbs (5 lbs fat loss)
  metricType: "weight",
  notes: "Lose fat while maintaining/building muscle. Focus on chest measurement increase."
}
```

---

### 2. MoProgress (Progress Tracking)

**Purpose:** Calculate and visualize progress toward goals

**Responsibilities:**
- Progress calculation (% complete, trend direction)
- Data aggregation from MO:PULSE (workouts, measurements, nutrition)
- Timeline visualization (where you've been, where you're going)
- Leading indicators (strength gains, energy levels)
- Lagging indicators (weight, measurements, photos)

**Systems:**
- `MoProgressCalculate` - Compute progress percentages
- `MoProgressVisualize` - Generate charts, trends, predictions
- `MoProgressTrends` - Detect patterns (linear, exponential, plateau)
- `MoProgressMilestones` - Track checkpoints

**Example Progress Calculation:**
```typescript
function calculateProgress(goal: Goal, measurements: Measurement[]): Progress {
  const latest = measurements[0]; // Most recent
  const starting = goal.startingMetric;
  const target = goal.targetMetric;
  const current = latest.weight;

  const totalDistance = Math.abs(target - starting);
  const currentDistance = Math.abs(current - starting);
  const percentComplete = (currentDistance / totalDistance) * 100;

  const daysElapsed = daysBetween(goal.startDate, today());
  const daysTotal = daysBetween(goal.startDate, goal.targetDate);
  const timeProgress = (daysElapsed / daysTotal) * 100;

  // Ahead, on-track, or behind?
  const status = percentComplete >= timeProgress ? "ahead" : "behind";

  return {
    percentComplete: Math.min(percentComplete, 100),
    timeProgress,
    status,
    trend: calculateTrend(measurements), // "up" | "down" | "stable"
    predictedCompletion: estimateCompletionDate(measurements, target),
  };
}
```

---

### 3. MoMilestones (Checkpoint Management)

**Purpose:** Break long journeys into achievable checkpoints

**Responsibilities:**
- Milestone creation (weekly, monthly, quarterly)
- Checkpoint validation (did you hit it?)
- Celebration triggers (small wins)
- Adjustment recommendations (if milestones are missed)

**Systems:**
- `MoMilestoneCreate` - Generate milestones from goal timeline
- `MoMilestoneCheck` - Validate checkpoint achievement
- `MoMilestoneCelebrate` - Trigger UI celebrations
- `MoMilestoneAdjust` - Recommend goal adjustments if falling behind

**Example Milestones:**
```typescript
Goal: Lose 10 lbs in 12 weeks
Milestones:
- Week 1: -0.8 lbs (establish baseline, water weight)
- Week 2: -1.0 lbs
- Week 3: -1.0 lbs
- Week 4: -1.0 lbs (total: -3.8 lbs) ← Monthly checkpoint
- ...
- Week 12: -10 lbs total ← Goal complete

// If Week 4 milestone is missed:
Actual: -2.5 lbs (vs expected -3.8 lbs)
Recommendation from MO:MIND:
- "Adjust deficit by 100 calories"
- "Add 1 cardio session per week"
- "Extend timeline to 14 weeks"
```

---

## Data Models

### Goals Table

```typescript
type Goal = {
  id: string;              // UUID
  userId: string;          // FK to users
  goalType: GoalType;      // muscle_building | fat_loss | strength | recomp | general
  priority: Priority;      // primary | secondary | background
  status: Status;          // active | paused | completed
  startDate: Date;         // When goal began
  targetDate: Date;        // When goal should complete
  startingMetric: number;  // Initial value (weight, 1RM, measurement)
  targetMetric: number;    // Goal value
  metricType: MetricType;  // weight | measurement | 1rm | other
  notes?: string;          // User notes
  createdAt: Date;
  updatedAt: Date;
};

type GoalType =
  | "muscle_building"  // Gain muscle mass
  | "fat_loss"         // Lose body fat
  | "strength"         // Increase 1RM on lifts
  | "recomp"           // Simultaneous fat loss + muscle gain
  | "general";         // Custom goal

type Priority =
  | "primary"    // Drives macro targets, gets priority
  | "secondary"  // Influences training, maintenance mode
  | "background";// Passive tracking only

type Status =
  | "active"     // Actively working on it
  | "paused"     // Temporarily stopped
  | "completed"; // Goal achieved

type MetricType =
  | "weight"       // Scale weight (lbs/kg)
  | "measurement"  // Body measurements (inches/cm)
  | "1rm"          // One-rep max (lbs/kg)
  | "other";       // Custom metric
```

### Measurements Table

```typescript
type Measurement = {
  id: string;
  userId: string;
  date: Date;              // When measured
  weight?: number;         // Scale weight (lbs/kg)
  chest?: number;          // Chest circumference
  waist?: number;          // Waist circumference
  hips?: number;           // Hip circumference
  thigh?: number;          // Thigh circumference
  bicep?: number;          // Bicep circumference
  notes?: string;          // Optional notes
  createdAt: Date;
};
```

### Milestones Table

```typescript
type Milestone = {
  id: string;
  goalId: string;          // FK to goals
  targetDate: Date;        // When milestone should be hit
  targetValue: number;     // Expected metric value
  actualValue?: number;    // Actual value (if measured)
  status: MilestoneStatus; // upcoming | achieved | missed
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

type MilestoneStatus =
  | "upcoming"   // Not yet reached target date
  | "achieved"   // Hit the milestone
  | "missed";    // Missed the milestone (need adjustment)
```

---

## API Endpoints

### Goals

```typescript
POST   /api/journey/goals
GET    /api/journey/goals
GET    /api/journey/goals/[id]
PATCH  /api/journey/goals/[id]
DELETE /api/journey/goals/[id]

// Example: Create goal
POST /api/journey/goals
{
  "goalType": "recomp",
  "priority": "primary",
  "targetDate": "2026-04-01",
  "startingMetric": 180,
  "targetMetric": 175,
  "metricType": "weight",
  "notes": "12-week body recomposition"
}

// Example: Get progress
GET /api/journey/goals/[id]/progress
Response:
{
  "goal": { /* goal object */ },
  "progress": {
    "percentComplete": 35,
    "timeProgress": 40,
    "status": "behind",
    "trend": "down",
    "predictedCompletion": "2026-04-15"
  },
  "latestMeasurement": { /* measurement object */ },
  "recommendations": [ /* from MO:MIND */ ]
}
```

### Measurements

```typescript
POST   /api/journey/measurements
GET    /api/journey/measurements
GET    /api/journey/measurements/[id]
DELETE /api/journey/measurements/[id]

// Example: Log measurement
POST /api/journey/measurements
{
  "date": "2026-01-15",
  "weight": 178,
  "chest": 42,
  "waist": 34,
  "hips": 40,
  "notes": "Morning weight, after bathroom"
}

// Example: Get trend
GET /api/journey/measurements?startDate=2026-01-01&endDate=2026-01-31
Response:
{
  "measurements": [ /* array of measurements */ ],
  "trend": {
    "averageChange": -0.5,  // lbs per week
    "direction": "down",
    "consistency": "high"   // low | medium | high
  }
}
```

### Milestones

```typescript
GET    /api/journey/goals/[id]/milestones
POST   /api/journey/goals/[id]/milestones/check

// Example: Check milestone
POST /api/journey/goals/goal_1/milestones/check
{
  "milestoneId": "milestone_4",
  "actualValue": 177
}

Response:
{
  "milestone": { /* updated milestone */ },
  "status": "achieved",  // or "missed"
  "celebration": true,   // trigger UI celebration
  "recommendations": [   // from MO:MIND if missed
    "Great job! You're on track.",
    "Next milestone: 176 lbs by Feb 1"
  ]
}
```

---

## Integration with Other Domains

### MO:SELF (Identity)

**JOURNEY consumes from SELF:**
- User preferences (units, display format)
- Equipment availability (for strength goals)
- Training history (for progression goals)

**Example:**
```typescript
// When creating a strength goal:
const userEquipment = await MO_SELF.getAvailableEquipment();
if (!userEquipment.includes("barbell")) {
  return { error: "Barbell required for this goal" };
}
```

---

### MO:PULSE (Tracking)

**JOURNEY consumes from PULSE:**
- Workout session data (for strength goals)
- Recovery logs (energy, soreness)
- Nutrition data (for weight goals)

**Example:**
```typescript
// Calculate progress on strength goal:
const recentWorkouts = await MO_PULSE.getWorkoutHistory({
  exerciseId: goal.exerciseId,
  startDate: goal.startDate,
});

const currentMax = Math.max(...recentWorkouts.map(w => w.weight));
const progress = ((currentMax - goal.startingMetric) / (goal.targetMetric - goal.startingMetric)) * 100;
```

---

### MO:COACH (Training Intelligence)

**JOURNEY consumes from COACH:**
- Fatigue status (for realistic goal timelines)
- Progression recommendations (for strength goals)
- Deload indicators (affects goal timeline)

**Example:**
```typescript
// Before suggesting "increase weight", check fatigue:
const fatigueStatus = await MO_COACH.getFatigueStatus();
if (fatigueStatus === "high") {
  return { recommendation: "Maintain current weight, focus on recovery" };
}
```

---

### MO:MIND (Intelligence)

**JOURNEY consults MIND for:**
- Goal conflict detection (muscle gain vs fat loss)
- Progress analysis (ahead, on-track, behind)
- Milestone recommendations (adjust timeline, change approach)
- Daily action suggestions (what to do today)

**Example:**
```typescript
// Get intelligent recommendation:
const intelligence = await MO_MIND.analyzeGoals({
  goals: await getActiveGoals(),
  bodyData: await MO_PULSE.getRecentMeasurements(),
  workoutData: await MO_PULSE.getWorkoutHistory(),
  recoveryData: await MO_PULSE.getRecoveryLogs(),
});

// Intelligence might return:
{
  "conflicts": [
    {
      "goals": ["goal_1", "goal_2"],
      "issue": "Muscle gain requires surplus, fat loss requires deficit",
      "resolution": "Consider sequential approach or body recomposition"
    }
  ],
  "recommendations": [
    "Log your weight today (last measurement was 7 days ago)",
    "You're behind on fat loss goal - consider adding 1 cardio session",
    "Strength goal is ahead of schedule - great work!"
  ]
}
```

---

### MO:CONNECT (Ecosystem)

**JOURNEY sends to CONNECT:**
- Achievements (for social sharing)
- Goal completions (for badges/trophies)

**CONNECT sends to JOURNEY:**
- Wearable data (weight from smart scale)

**Example:**
```typescript
// When goal is completed:
await MO_CONNECT.shareAchievement({
  goalId: goal.id,
  goalType: goal.goalType,
  durationDays: daysBetween(goal.startDate, goal.completedAt),
  message: "Lost 10 lbs in 12 weeks!",
});
```

---

## User Interface

### Goals Page (Home Screen)

The Goals page is the primary landing page after onboarding.

**Layout:**
```
┌────────────────────────────────────┐
│  Your Goals                     +  │ ← Create new goal
├────────────────────────────────────┤
│                                    │
│  🎯 Primary Goal                   │
│  Lose 10 lbs by April 1            │
│  ████████░░░░░░  65% complete      │
│  ↓ Trending down (good!)           │
│                                    │
│  💡 Recommendation:                │
│  "Log your weight today"           │
│  [Log Weight]                      │
│                                    │
├────────────────────────────────────┤
│  🏃 Secondary Goal                 │
│  Bench press 225 lbs               │
│  ██████░░░░░░░░  45% complete      │
│  → Stable                          │
│                                    │
├────────────────────────────────────┤
│  📊 Recent Activity                │
│  • Jan 15: Weight 178 lbs          │
│  • Jan 13: Workout - Push Day      │
│  • Jan 12: Weight 179 lbs          │
└────────────────────────────────────┘
```

**Interactions:**
- Tap goal → View detailed progress chart
- Tap recommendation → Execute action (log weight, start workout)
- Tap "+" → Create new goal
- Long press goal → Edit or archive

---

## Implementation Phases

### Phase 1: Minimal MVP (Week 1)

**Goals:**
- ✅ Create single goal (type, target, timeline)
- ✅ Basic validation (required fields)
- ✅ Status: active | paused | completed

**Measurements:**
- ✅ Log weight and key measurements
- ✅ View last measurement

**Progress:**
- ✅ Calculate % complete
- ✅ Show trend arrow (up/down/stable)
- ✅ Days remaining counter

**Intelligence (Embedded in JOURNEY):**
- ✅ One recommendation per day
- ✅ Based on: days since last measurement, goal type

**UI:**
- ✅ Goals page as home screen
- ✅ Simple progress bar
- ✅ Recommendation card
- ✅ Log measurement button

---

### Phase 2: Multi-Goal & Milestones (Week 2-3)

**Goals:**
- ✅ Multiple simultaneous goals
- ✅ Priority system (primary, secondary, background)
- ✅ Conflict detection (consult MO:MIND)

**Measurements:**
- ✅ Measurement history view
- ✅ Photo comparison (before/after)
- ✅ Body part selection

**Progress:**
- ✅ Line charts (weight over time)
- ✅ Predicted completion date
- ✅ Milestone checkpoints

**Intelligence (Hybrid):**
- ✅ Extract to MO:MIND Journey Agent
- ✅ Multi-goal analysis
- ✅ Conflict resolution recommendations

**UI:**
- ✅ Goal detail page with charts
- ✅ Milestone timeline
- ✅ Celebration animations

---

### Phase 3: Advanced Features (Week 4+)

**Goals:**
- ✅ Goal templates (common goals)
- ✅ Goal cloning (repeat previous goal)
- ✅ Goal sharing (invite accountability partner)

**Measurements:**
- ✅ Wearable integration (auto-import weight)
- ✅ Measurement reminders
- ✅ Measurement streaks

**Progress:**
- ✅ Predictive analytics (ML-based completion estimates)
- ✅ Comparison to similar users (anonymous, opt-in)
- ✅ Export data (CSV, PDF report)

**Intelligence (Full MO:MIND):**
- ✅ All agents integrated (Journey, Training, Nutrition, Recovery)
- ✅ Multi-agent orchestration
- ✅ Personalized recommendations (LLM-powered)

**UI:**
- ✅ Goal insights dashboard
- ✅ Social features (share achievements)
- ✅ Gamification (badges, streaks)

---

## Testing Strategy

### Unit Tests

**Goal Creation:**
```typescript
describe("createGoal", () => {
  it("should validate required fields", async () => {
    await expect(createGoal({ goalType: "recomp" })).rejects.toThrow(
      "Target date is required"
    );
  });

  it("should detect past target dates", async () => {
    await expect(
      createGoal({ targetDate: "2020-01-01" })
    ).rejects.toThrow("Target date must be in the future");
  });
});
```

**Progress Calculation:**
```typescript
describe("calculateProgress", () => {
  it("should calculate % complete correctly", () => {
    const goal = { startingMetric: 180, targetMetric: 170 };
    const measurements = [{ weight: 175 }]; // 5 lbs lost (50%)

    const progress = calculateProgress(goal, measurements);
    expect(progress.percentComplete).toBe(50);
  });

  it("should detect trend direction", () => {
    const measurements = [
      { weight: 175, date: "2026-01-15" },
      { weight: 177, date: "2026-01-08" },
      { weight: 179, date: "2026-01-01" },
    ];

    const trend = calculateTrend(measurements);
    expect(trend).toBe("down"); // Trending down = good for fat loss
  });
});
```

---

### Integration Tests

**Goal → Measurement → Progress:**
```typescript
describe("Goal lifecycle", () => {
  it("should update progress when measurement is logged", async () => {
    const goal = await createGoal({
      goalType: "fat_loss",
      startingMetric: 180,
      targetMetric: 170,
    });

    await logMeasurement({ weight: 175 });

    const progress = await getGoalProgress(goal.id);
    expect(progress.percentComplete).toBe(50);
  });
});
```

---

### E2E Tests

**User Flow:**
```typescript
describe("Goals page", () => {
  it("should allow user to create goal and track progress", async () => {
    await signIn();
    await navigateTo("/goals");

    // Create goal
    await click("Create Goal");
    await select("Goal Type", "Fat Loss");
    await input("Starting Weight", "180");
    await input("Target Weight", "170");
    await input("Target Date", "2026-04-01");
    await click("Create");

    // Verify goal appears
    expect(screen.getByText("Lose 10 lbs by April 1")).toBeInTheDocument();

    // Log measurement
    await click("Log Weight");
    await input("Weight", "175");
    await click("Save");

    // Verify progress updated
    expect(screen.getByText("50% complete")).toBeInTheDocument();
  });
});
```

---

## Performance Considerations

### Database Queries

**Optimize goal progress calculation:**
```sql
-- Instead of fetching all measurements:
SELECT * FROM measurements WHERE user_id = ? ORDER BY date DESC;

-- Fetch only what's needed:
SELECT weight, date FROM measurements
WHERE user_id = ?
  AND date >= ? -- goal start date
ORDER BY date DESC
LIMIT 10; -- Last 10 measurements only
```

**Index strategy:**
```sql
CREATE INDEX idx_measurements_user_date ON measurements(user_id, date DESC);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
```

---

### Caching

**Cache goal progress (updates only on new measurement):**
```typescript
// Cache key: `goal_progress_${goalId}_${latestMeasurementDate}`
const cacheKey = `goal_progress_${goal.id}_${latestMeasurement.date}`;
const cached = await cache.get(cacheKey);

if (cached) return cached;

const progress = calculateProgress(goal, measurements);
await cache.set(cacheKey, progress, { ttl: 3600 }); // 1 hour TTL
return progress;
```

---

## Security Considerations

### Authorization

**Users can only access their own goals:**
```typescript
export async function getGoal(id: string) {
  const session = await getServerSession();
  const goal = await db.goals.findUnique({ where: { id } });

  if (goal.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return goal;
}
```

### Input Validation

**Prevent invalid goal data:**
```typescript
const goalSchema = z.object({
  goalType: z.enum(["muscle_building", "fat_loss", "strength", "recomp", "general"]),
  priority: z.enum(["primary", "secondary", "background"]),
  targetDate: z.date().min(new Date(), "Target date must be in the future"),
  startingMetric: z.number().positive(),
  targetMetric: z.number().positive(),
  metricType: z.enum(["weight", "measurement", "1rm", "other"]),
});

export async function createGoal(data: unknown) {
  const validated = goalSchema.parse(data); // Throws if invalid
  return db.goals.create({ data: validated });
}
```

---

## Future Enhancements

### AI-Powered Goal Suggestions

Use MO:MIND Journey Agent with LLM:
```typescript
const suggestions = await MO_MIND.suggestGoals({
  userHistory: await MO_SELF.getTrainingHistory(),
  currentGoals: await getActiveGoals(),
  bodyData: await MO_PULSE.getRecentMeasurements(),
});

// Suggestions might include:
// - "Based on your bench press progress, consider a 225 lbs goal"
// - "You've logged workouts consistently for 8 weeks - ready for a fat loss phase?"
```

### Predictive Analytics

Use historical data to predict goal completion:
```typescript
const prediction = await MO_MIND.predictGoalCompletion({
  goal,
  measurements: await getMeasurementHistory(),
  workoutConsistency: await MO_PULSE.getWorkoutStreakData(),
});

// Prediction:
{
  "estimatedCompletionDate": "2026-04-15",
  "confidence": 0.85,
  "factors": [
    "Current rate: 0.8 lbs/week (need 1.0 lbs/week)",
    "Workout consistency: 92% (excellent)",
    "Recommendation: Increase deficit by 100 calories"
  ]
}
```

### Social Accountability

Share goals with friends:
```typescript
await MO_CONNECT.shareGoal({
  goalId: goal.id,
  shareWith: "friend_user_id",
  permissions: ["view_progress", "send_encouragement"],
});
```

---

## Summary

MO:JOURNEY is the strategic orchestration domain that:
- Manages goal setting and tracking
- Calculates progress across multiple metrics
- Coordinates with MO:MIND for intelligent recommendations
- Serves as the home screen (primary user interface)
- Orchestrates actions across all other domains

**Key Principles:**
1. Goals are the "why" that drives all activities
2. Journey sits above data domains (orchestrator role)
3. Intelligence comes from MO:MIND (not embedded)
4. Progress is multi-faceted (weight, strength, measurements, photos)
5. Milestones break long journeys into achievable wins

**Next Steps:**
- Implement Phase 1 Minimal MVP (Week 1)
- Extract intelligence to MO:MIND (Week 3-4)
- Add multi-goal support (Phase 2)
- Integrate advanced analytics (Phase 3)

---

## References

- [Architectural Decisions](../architecture/decisions.md)
- [MO:MIND Domain Specification](../mo-mind/specification.md)
- [Architecture Overview](../architecture/overview.md)
- [Development Workflow](../development/workflow.md)
