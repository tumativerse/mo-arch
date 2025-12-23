---
sidebar_position: 3
title: MoHydration
---

# MoHydration

> *"The Water Tracker"* — "I keep you flowing"

**Status:** ❌ Future

MoHydration will track daily water intake.

---

## Purpose

- Log water consumption
- Set hydration goals
- Send hydration reminders
- Track hydration patterns

---

## Hydration Guidelines

### Daily Water Needs

| Factor | Recommendation |
|--------|----------------|
| Baseline | 0.5 oz per lb bodyweight |
| Exercise | +16-24 oz per hour of exercise |
| Hot weather | +8-16 oz |
| High altitude | +8-16 oz |

### Example

```
175 lb person:
- Baseline: 87.5 oz (~11 cups)
- + 1 hr workout: +20 oz
- Total: ~107 oz (~13 cups)
```

---

## Data Model

```typescript
interface HydrationLog {
  id: string;
  userId: string;
  date: Date;

  // Entries through the day
  entries: WaterEntry[];

  // Daily totals
  totalOz: number;
  targetOz: number;
  percentOfGoal: number;
}

interface WaterEntry {
  id: string;
  amount: number;         // oz
  time: Date;
  source: WaterSource;
}

type WaterSource =
  | 'water'
  | 'coffee'
  | 'tea'
  | 'sports_drink'
  | 'other';
```

---

## Quick Logging

Common amounts for fast entry:

| Button | Amount |
|--------|--------|
| Glass | 8 oz |
| Bottle | 16 oz |
| Large bottle | 32 oz |
| Custom | Any amount |

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hydration` | GET | Get daily hydration |
| `/api/hydration` | POST | Log water |
| `/api/hydration/goal` | GET/PUT | Get/set daily goal |

---

## Integration Points

### Will Receive from:
- Quick log UI
- MoWearables (smart water bottles)
- Reminders

### Will Provide to:
- Dashboard (hydration widget)
- MoAlerts (hydration reminders)
- Recovery analysis

---

## Implementation Tasks

- [ ] Create hydration_logs table
- [ ] Build quick-log UI
- [ ] Calculate personalized goals
- [ ] Add hydration reminders
- [ ] Create hydration widget
