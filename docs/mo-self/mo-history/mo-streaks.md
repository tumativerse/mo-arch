---
sidebar_position: 2
title: MoStreaks
---

# MoStreaks

> *"The Motivator"* — "I keep you consistent"

**Status:** ✅ Built

MoStreaks tracks workout consistency with a 48-hour window for maintaining streaks, and provides motivational messaging.

---

## Purpose

- Track consecutive workout days
- Maintain streak with 48-hour window (allows rest days)
- Provide motivational messages based on streak status
- Auto-update on workout completion

---

## Implementation

### Code Location

```
/lib/mo-self/history/streaks.ts
```

### Key Functions

```typescript
// Get current streak data
export async function getStreak(userId: string): Promise<StreakData>

// Update streak on workout completion (called automatically)
export async function updateStreakOnWorkout(userId: string): Promise<StreakData>

// Get streak statistics
export async function getStreakStats(userId: string): Promise<StreakStats>

// Get motivational message based on streak
export function getStreakMessage(streak: StreakData): StreakMessage
```

### Usage

```typescript
import { getStreak, updateStreakOnWorkout } from '@/lib/mo-self';

// Get current streak
const streak = await getStreak(userId);
console.log(`Current streak: ${streak.currentStreak} days`);

// Auto-update on workout (called in session complete handler)
const updatedStreak = await updateStreakOnWorkout(userId);
```

---

## Data Model

```typescript
interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: Date | null;
  streakStartDate: Date | null;
  totalWorkouts: number;

  // Computed
  isActive: boolean;          // Has valid streak
  hoursRemaining: number;     // Hours until streak breaks
  status: StreakStatus;
}

type StreakStatus =
  | 'none'          // No streak (0 days)
  | 'starting'      // 1-2 days
  | 'building'      // 3-6 days
  | 'strong'        // 7-13 days
  | 'impressive'    // 14-29 days
  | 'legendary';    // 30+ days

interface StreakMessage {
  title: string;
  message: string;
  emoji: string;
}
```

### Database Table

```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  streak_start_date DATE,
  total_workouts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 48-Hour Window

Streaks use a 48-hour window instead of daily:

```
Day 1: Workout ✓ (streak = 1)
Day 2: Rest day (streak maintained)
Day 3: Workout ✓ (streak = 2)
Day 4: Rest day (streak maintained)
Day 5: No workout (streak breaks after 48hrs from Day 3)
```

This allows for proper rest while maintaining motivation.

### Logic

```typescript
const STREAK_WINDOW_HOURS = 48;

function isStreakActive(lastWorkoutDate: Date): boolean {
  const hoursSinceLastWorkout =
    (Date.now() - lastWorkoutDate.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastWorkout <= STREAK_WINDOW_HOURS;
}
```

---

## Motivational Messages

| Status | Days | Example Message |
|--------|------|-----------------|
| `none` | 0 | "Start your journey today!" |
| `starting` | 1-2 | "Great start! Keep it going!" |
| `building` | 3-6 | "Building momentum!" |
| `strong` | 7-13 | "One week strong!" |
| `impressive` | 14-29 | "Two weeks of dedication!" |
| `legendary` | 30+ | "Legendary consistency!" |

---

## API Endpoints

### GET /api/streaks

Returns streak data with stats and message.

```json
{
  "currentStreak": 7,
  "longestStreak": 14,
  "lastWorkoutDate": "2024-12-21",
  "totalWorkouts": 45,
  "isActive": true,
  "hoursRemaining": 36,
  "status": "strong",
  "message": {
    "title": "One Week Strong!",
    "message": "You've worked out 7 days in a row. Keep pushing!",
    "emoji": "💪"
  }
}
```

---

## Integration Points

### Receives from:
- `/api/ppl/session` PATCH (auto-update on workout complete)

### Provides to:
- Dashboard (streak display)
- MoAlerts (streak warning notifications - future)

---

## Auto-Hook

Streak is automatically updated when a workout is completed:

```typescript
// In /api/ppl/session PATCH handler
const streak = await updateStreakOnWorkout(user.id);

return NextResponse.json({
  session,
  metrics,
  streak
});
```

---

## Streak Recovery

If a streak breaks, users start fresh at 0. There's no "recovery" mechanism - this encourages consistent training.

Future enhancement: Allow one "streak save" per month for illness/travel.
