---
sidebar_position: 3
title: MoGoals
---

# MoGoals

> *"The Target"* — "I know what you're aiming for"

**Status:** ⚠️ Partial (DB schema only)

MoGoals manages user training goals and target metrics. Currently has database schema but no dedicated API or UI.

---

## Purpose

- Define training goals (strength, muscle, endurance, weight loss)
- Set target metrics (target weight, target lifts)
- Track goal progress over time
- Inform MoCoach recommendations

---

## Planned Implementation

### Code Location (Future)

```
/lib/mo-self/identity/goals.ts
```

### Key Functions (Planned)

```typescript
// Get user's current goals
export async function getGoals(userId: string): Promise<UserGoals>

// Set or update goals
export async function setGoals(userId: string, goals: GoalInput): Promise<UserGoals>

// Check goal progress
export async function getGoalProgress(userId: string): Promise<GoalProgress[]>
```

---

## Data Model

```typescript
interface UserGoals {
  id: string;
  userId: string;

  // Primary goal
  primaryGoal: GoalType;

  // Target metrics
  targetWeight: number | null;      // Body weight goal
  targetBodyFat: number | null;     // Body fat % goal

  // Strength targets (optional)
  targetBench: number | null;
  targetSquat: number | null;
  targetDeadlift: number | null;

  // Timeline
  targetDate: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

type GoalType =
  | 'build_muscle'
  | 'lose_fat'
  | 'gain_strength'
  | 'improve_endurance'
  | 'maintain'
  | 'recomp';
```

### Database Table (Exists)

```sql
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  primary_goal VARCHAR(50) NOT NULL,
  target_weight DECIMAL(5,2),
  target_body_fat DECIMAL(4,1),
  target_bench DECIMAL(5,2),
  target_squat DECIMAL(5,2),
  target_deadlift DECIMAL(5,2),
  target_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/goals` | GET | Get current goals |
| `/api/goals` | POST | Set goals |
| `/api/goals` | PATCH | Update goals |
| `/api/goals/progress` | GET | Get progress toward goals |

---

## Integration Points

### Will Provide to:
- MoCoach (training recommendations based on goal)
- MoSuggest (rep ranges based on goal type)
- Dashboard (goal progress display)
- MoReports (goal tracking in reports)

### Will Receive from:
- Onboarding flow (initial goal setting)
- Profile settings (goal updates)

---

## Goal-Based Training Adjustments

| Goal | Rep Range | Rest | Volume |
|------|-----------|------|--------|
| Build Muscle | 8-12 | 60-90s | High |
| Gain Strength | 3-6 | 3-5min | Moderate |
| Lose Fat | 12-15 | 30-60s | High |
| Endurance | 15-20 | 30s | Very High |

---

## Implementation Tasks

- [ ] Create `/lib/mo-self/identity/goals.ts`
- [ ] Add API endpoints
- [ ] Build goal setting UI in onboarding
- [ ] Add goal progress tracking
- [ ] Integrate with MoCoach recommendations
