---
sidebar_position: 3
title: MoLeaderboard
---

# MoLeaderboard

> *"The Ranks"* — "I show where you stand"

**Status:** ❌ Future

MoLeaderboard will provide friend and global rankings across various metrics.

---

## Purpose

- Compare with friends
- See global rankings
- Track progress relative to peers
- Provide healthy competition
- Celebrate top performers

---

## Leaderboard Types

### Streak Leaderboard

```
🔥 Active Streak Rankings

  #   User           Streak    Last Workout
  1   @ironman       45 days   Today
  2   @consistent    32 days   Yesterday
  3   You            7 days    Today
  ...
```

### Strength Leaderboards

```
🏋️ Bench Press Rankings (Estimated 1RM)

  #   User           1RM        BW Ratio
  1   @powerlifter   315 lbs    1.8x
  2   @strongguy     285 lbs    1.6x
  3   You            253 lbs    1.5x
  ...
```

### Volume Leaderboard

```
📊 Weekly Volume Rankings

  #   User           Volume      Sessions
  1   @grinder       62,500 lbs    6
  2   @dedicated     58,200 lbs    5
  3   You            45,000 lbs    4
  ...
```

---

## Data Model

```typescript
interface Leaderboard {
  id: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  scope: LeaderboardScope;

  entries: LeaderboardEntry[];
  updatedAt: Date;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  value: number;
  change: number;           // Rank change from last period
  isCurrentUser: boolean;
}

type LeaderboardType =
  | 'streak'
  | 'volume_weekly'
  | 'volume_monthly'
  | 'bench_1rm'
  | 'squat_1rm'
  | 'deadlift_1rm'
  | 'total_1rm'
  | 'consistency'
  | 'prs_monthly';

type LeaderboardPeriod = 'all_time' | 'monthly' | 'weekly';
type LeaderboardScope = 'global' | 'friends' | 'country';
```

---

## Privacy & Opt-In

- Opt-in to appear on leaderboards
- Friends-only by default
- Can hide specific metrics
- Pseudonymous option available

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leaderboards` | GET | List leaderboard types |
| `/api/leaderboards/:type` | GET | Get leaderboard |
| `/api/leaderboards/rank` | GET | Get user's ranks |

---

## User Rank Card

```typescript
interface UserRanks {
  userId: string;

  // Current ranks
  ranks: {
    streak: { rank: number; total: number; percentile: number };
    weeklyVolume: { rank: number; total: number; percentile: number };
    bench1RM: { rank: number; total: number; percentile: number };
    // ...
  };

  // Highlights
  bestRank: { type: string; rank: number };
  recentImprovement: { type: string; change: number };
}
```

---

## Implementation Tasks

- [ ] Design leaderboard calculation system
- [ ] Create leaderboard update jobs
- [ ] Build opt-in/privacy settings
- [ ] Implement friend leaderboards
- [ ] Create leaderboard UI
- [ ] Add rank history tracking
