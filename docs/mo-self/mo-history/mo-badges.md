---
sidebar_position: 3
title: MoBadges
---

# MoBadges

> *"The Trophy Case"* — "I celebrate your milestones"

**Status:** ❌ Future

MoBadges will track achievements, milestones, and badges to gamify the fitness journey.

---

## Purpose

- Award badges for achievements
- Track milestone progress
- Gamify consistency and progress
- Provide shareable achievements

---

## Planned Badge Categories

### Consistency Badges

| Badge | Requirement | Icon |
|-------|-------------|------|
| First Step | Complete first workout | 🎯 |
| Week Warrior | 7-day streak | 🔥 |
| Month Master | 30-day streak | 💎 |
| Century Club | 100 total workouts | 💯 |
| Year of Iron | 365 workouts in a year | 🏆 |

### Strength Badges

| Badge | Requirement | Icon |
|-------|-------------|------|
| First PR | Set first personal record | ⭐ |
| PR Machine | 10 PRs in a month | 🌟 |
| 1 Plate Club | Bench 135 lbs | 🥉 |
| 2 Plate Club | Bench 225 lbs | 🥈 |
| 3 Plate Club | Bench 315 lbs | 🥇 |
| 1000 lb Club | Combined squat/bench/deadlift | 👑 |

### Volume Badges

| Badge | Requirement | Icon |
|-------|-------------|------|
| First Ton | Lift 2000 lbs in one session | 💪 |
| Volume King | 100,000 lbs total volume | 🦁 |
| Million Pound Club | 1,000,000 lbs lifetime | 🎖️ |

### Recovery Badges

| Badge | Requirement | Icon |
|-------|-------------|------|
| Sleep Champion | Log 8+ hrs sleep for 7 days | 😴 |
| Recovery Pro | Log recovery for 30 days | 🧘 |

---

## Data Model

```typescript
interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  requirement: BadgeRequirement;
  tier: BadgeTier;
}

interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
  progress: number;       // 0-100
  isComplete: boolean;
}

interface BadgeProgress {
  badge: Badge;
  currentProgress: number;
  requiredProgress: number;
  percentComplete: number;
  isEarned: boolean;
  earnedAt: Date | null;
}

type BadgeCategory =
  | 'consistency'
  | 'strength'
  | 'volume'
  | 'recovery'
  | 'special';

type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/badges` | GET | Get all badges with user progress |
| `/api/badges/earned` | GET | Get user's earned badges |
| `/api/badges/check` | POST | Check and award new badges |

---

## Integration Points

### Will Receive from:
- MoSession (workout completion triggers)
- MoRecords (PR achievements)
- MoStreaks (streak milestones)
- MoRecover (recovery logging)

### Will Provide to:
- Profile page (badge display)
- Dashboard (recent badges)
- MoShare (shareable achievements - future)
- MoAlerts (badge earned notifications)

---

## Badge Checking Logic

Badges would be checked:
1. On workout completion
2. On PR detection
3. On streak update
4. On recovery log
5. Daily cron job for time-based badges

```typescript
// Example badge check on workout complete
async function checkWorkoutBadges(userId: string, session: Session) {
  const checks = [
    checkFirstWorkoutBadge(userId),
    checkWorkoutCountBadges(userId),
    checkVolumeBadges(userId, session),
    checkStreakBadges(userId)
  ];

  const newBadges = await Promise.all(checks);
  return newBadges.filter(Boolean);
}
```

---

## Implementation Tasks

- [ ] Design badge system schema
- [ ] Create badges and user_badges tables
- [ ] Define all badges with requirements
- [ ] Build badge checking logic
- [ ] Create badge display UI
- [ ] Add badge earned notifications
- [ ] Build shareable badge cards
