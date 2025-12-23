---
sidebar_position: 2
title: MoChallenges
---

# MoChallenges

> *"The Competitor"* — "I add stakes to your training"

**Status:** ❌ Future

MoChallenges will provide weekly and monthly fitness challenges to keep users motivated.

---

## Purpose

- Create competition and motivation
- Set collective goals
- Build community engagement
- Provide variety in training focus
- Award achievement badges

---

## Challenge Types

### Volume Challenges

| Challenge | Goal | Duration |
|-----------|------|----------|
| Push Week | Most push volume | 1 week |
| Pull Month | Most pull volume | 1 month |
| Leg Day Heroes | Most leg volume | 1 week |
| Volume King | Total volume | 1 month |

### Consistency Challenges

| Challenge | Goal | Duration |
|-----------|------|----------|
| Perfect Week | 5+ sessions | 1 week |
| Streak Builder | Longest streak | 1 month |
| Early Bird | 6 AM workouts | 1 week |
| Recovery Focused | Log recovery daily | 1 week |

### Strength Challenges

| Challenge | Goal | Duration |
|-----------|------|----------|
| PR Hunt | Most PRs set | 1 month |
| Bench Battle | Highest bench PR | 1 month |
| Squat Challenge | Highest squat PR | 1 month |
| 1000 lb Club | Combined total | Ongoing |

---

## Data Model

```typescript
interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;

  // Timing
  startDate: Date;
  endDate: Date;
  duration: 'week' | 'month' | 'ongoing';

  // Goal
  metric: ChallengeMetric;
  target: number | null;

  // Rewards
  badge: Badge | null;

  // Participation
  participantCount: number;
  isActive: boolean;
}

interface ChallengeParticipation {
  challengeId: string;
  userId: string;
  joinedAt: Date;
  currentProgress: number;
  rank: number;
  isComplete: boolean;
}

type ChallengeType = 'volume' | 'consistency' | 'strength' | 'recovery';
type ChallengeMetric = 'total_volume' | 'sessions' | 'streak' | 'prs' | 'max_weight';
```

---

## Challenge Flow

```
1. Browse available challenges
2. Join challenge
3. Track progress automatically
4. View leaderboard
5. Complete and earn badge
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/challenges` | GET | List challenges |
| `/api/challenges/:id` | GET | Get challenge details |
| `/api/challenges/:id/join` | POST | Join challenge |
| `/api/challenges/:id/leaderboard` | GET | Get leaderboard |

---

## Leaderboard Display

```
🏆 Push Week Challenge - Day 5/7

  #   User           Volume      Sessions
  1   @strongguy     45,230 lbs    4
  2   @fitfam        42,100 lbs    5
  3   You            38,500 lbs    3
  ...
  15  @newcomer      12,000 lbs    2

Your Progress: 38,500 / 50,000 lbs target
```

---

## Implementation Tasks

- [ ] Design challenge system
- [ ] Create challenge templates
- [ ] Build auto-progress tracking
- [ ] Implement leaderboard
- [ ] Design challenge badges
- [ ] Create challenge UI
