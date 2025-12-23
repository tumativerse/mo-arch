---
sidebar_position: 1
title: MoSleep
---

# MoSleep

> *"The Night Watcher"* — "I know how well you rested"

**Status:** ✅ Built (via unified recovery API)

MoSleep tracks sleep duration and quality as part of the recovery system.

---

## Purpose

- Track sleep hours
- Rate sleep quality
- Feed sleep data to fatigue calculation
- Identify sleep patterns affecting training

---

## Implementation

Part of the unified recovery logging system.

### Code Location

```
/app/api/recovery/route.ts
```

### Fields

```typescript
interface SleepData {
  sleepHours: number;      // 0-24
  sleepQuality: number;    // 1-5
}
```

---

## Sleep Quality Scale

| Rating | Label | Description |
|--------|-------|-------------|
| 1 | Poor | Restless, woke multiple times |
| 2 | Fair | Some issues, not restful |
| 3 | OK | Average sleep |
| 4 | Good | Solid sleep, felt rested |
| 5 | Excellent | Deep, uninterrupted, refreshed |

---

## Impact on Training

### Fatigue Calculation

```typescript
// Sleep contributes to recovery debt
function calculateSleepDebt(sleepHours: number, sleepQuality: number): number {
  let debt = 0;

  // Hours
  if (sleepHours < 6) debt += 1.5;
  else if (sleepHours < 7) debt += 0.5;

  // Quality
  if (sleepQuality <= 2) debt += 1;
  else if (sleepQuality === 3) debt += 0.5;

  return debt;  // 0-2.5 points
}
```

### Progression Gates

Sleep affects the Recovery Gate:

```typescript
function checkRecoveryGate(recovery: RecoveryLog): boolean {
  // Block progression if sleep is poor
  if (recovery.sleepHours < 6) return false;
  if (recovery.sleepQuality <= 2) return false;
  return true;
}
```

---

## Data Model

```typescript
// Part of RecoveryLog
interface RecoveryLog {
  // ... other fields
  sleepHours: number;
  sleepQuality: number;
}
```

### Database Column

```sql
-- In recovery_logs table
sleep_hours DECIMAL(4,2),
sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
```

---

## Integration Points

### Provides to:
- MoFatigue (recovery debt calculation)
- MoProgress (recovery gate)
- Dashboard (sleep display)

### Receives from:
- Recovery check-in UI
- MoWearables (future - auto-import)

---

## Best Practices

- Log sleep quality in the morning
- 7-9 hours optimal for recovery
- Consistency matters more than duration
- Poor sleep = consider lighter training
