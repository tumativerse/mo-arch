---
sidebar_position: 3
title: MoHistory
---

# MoHistory

> *"I remember your journey"*

MoHistory tracks user achievements, personal records, streaks, and milestones.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoRecords](./mo-records) | *"The Historian"* | ✅ Built | Personal records, 1RM tracking |
| [MoStreaks](./mo-streaks) | *"The Motivator"* | ✅ Built | Workout consistency tracking |
| [MoBadges](./mo-badges) | *"The Trophy Case"* | ❌ Future | Achievements, milestones |

---

## Vertical Interface

```typescript
interface MoHistoryInterface {
  // Records
  getPersonalRecords(userId: string, exerciseId?: string): Promise<PersonalRecord[]>;
  checkAndRecordPR(userId: string, exerciseId: string, weight: number, reps: number): Promise<PRResult>;

  // Streaks
  getStreak(userId: string): Promise<StreakData>;
  updateStreakOnWorkout(userId: string): Promise<StreakData>;

  // Badges (future)
  getBadges(userId: string): Promise<Badge[]>;
  checkBadgeProgress(userId: string): Promise<BadgeProgress[]>;
}
```

---

## Code Location

```
/lib/mo-self/history/
├── records.ts      → MoRecords
├── streaks.ts      → MoStreaks
└── index.ts        → Vertical exports
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/records` | GET | MoRecords |
| `/api/streaks` | GET | MoStreaks |
