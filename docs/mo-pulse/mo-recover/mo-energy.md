---
sidebar_position: 2
title: MoEnergy
---

# MoEnergy

> *"The Battery"* — "I know your fuel level"

**Status:** ✅ Built (via unified recovery API)

MoEnergy tracks daily energy levels as part of the recovery system.

---

## Purpose

- Track daily energy/readiness
- Identify patterns in energy levels
- Feed energy data to fatigue calculation
- Help adjust training intensity

---

## Implementation

Part of the unified recovery logging system.

### Code Location

```
/app/api/recovery/route.ts
```

### Field

```typescript
interface EnergyData {
  energyLevel: number;    // 1-5
}
```

---

## Energy Scale

| Rating | Label | Physical State | Training Adjustment |
|--------|-------|----------------|---------------------|
| 1 | Very Low | Exhausted, need rest | Skip or very light |
| 2 | Low | Tired, sluggish | Reduce volume |
| 3 | Moderate | Normal, okay | Train normally |
| 4 | Good | Energized, ready | Train hard |
| 5 | Excellent | Peak energy | PR attempts okay |

---

## Impact on Training

### Fatigue Calculation

```typescript
function calculateEnergyDebt(energyLevel: number): number {
  if (energyLevel <= 2) return 1.5;
  if (energyLevel === 3) return 0.5;
  return 0;  // 4-5 = no debt
}
```

### Suggested Adjustments

| Energy | Volume | Intensity | Rest |
|--------|--------|-----------|------|
| 1-2 | -30% | -20% | +30s |
| 3 | Normal | Normal | Normal |
| 4-5 | +10% | Normal | Normal |

---

## Data Model

```typescript
// Part of RecoveryLog
interface RecoveryLog {
  // ... other fields
  energyLevel: number;
}
```

### Database Column

```sql
-- In recovery_logs table
energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
```

---

## Energy Patterns

Common patterns to watch:

| Pattern | Possible Cause | Solution |
|---------|---------------|----------|
| Consistently low | Overtraining | Deload week |
| Low after legs | High CNS demand | Extra rest day |
| Low Monday | Weekend recovery | Better weekend sleep |
| Declining trend | Accumulated fatigue | Reduce volume |

---

## Integration Points

### Provides to:
- MoFatigue (fatigue calculation)
- MoSuggest (intensity adjustments)
- Dashboard (energy display)

### Receives from:
- Recovery check-in UI
- MoWearables (future - HRV correlation)

---

## Best Practices

- Log energy in the morning before caffeine
- Be honest (don't inflate for ego)
- Low energy = opportunity for technique work
- Track patterns over weeks, not days
