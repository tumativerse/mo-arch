---
sidebar_position: 3
title: MoSoreness
---

# MoSoreness

> *"The Pain Map"* — "I know where it hurts"

**Status:** ✅ Built (via unified recovery API)

MoSoreness tracks muscle soreness levels and locations as part of the recovery system.

---

## Purpose

- Track overall soreness level
- Identify specific sore areas
- Feed soreness data to fatigue calculation
- Help with exercise selection (avoid sore muscles)

---

## Implementation

Part of the unified recovery logging system.

### Code Location

```
/app/api/recovery/route.ts
```

### Fields

```typescript
interface SorenessData {
  overallSoreness: number;     // 1-5
  sorenessAreas?: string[];    // Specific body parts
}
```

---

## Soreness Scale

| Rating | Label | Physical State | Training Impact |
|--------|-------|----------------|-----------------|
| 1 | None | No soreness | Train normally |
| 2 | Mild | Slight tightness | Train normally |
| 3 | Moderate | Noticeable DOMS | May need warm-up |
| 4 | High | Uncomfortable | Avoid sore areas |
| 5 | Severe | Painful to move | Rest recommended |

---

## Soreness Areas

Trackable body parts:

| Category | Areas |
|----------|-------|
| Push muscles | Chest, front delts, triceps |
| Pull muscles | Back, rear delts, biceps |
| Leg muscles | Quads, hamstrings, glutes, calves |
| Core | Abs, obliques, lower back |
| Other | Neck, forearms |

---

## Impact on Training

### Fatigue Calculation

```typescript
function calculateSorenessDebt(overallSoreness: number): number {
  if (overallSoreness >= 4) return 1.5;
  if (overallSoreness === 3) return 0.5;
  return 0;
}
```

### Exercise Selection

When specific areas are sore:

```typescript
function getAvoidancePatterns(sorenessAreas: string[]): string[] {
  const avoid: string[] = [];

  if (sorenessAreas.includes('chest')) {
    avoid.push('horizontal_push');
  }
  if (sorenessAreas.includes('back')) {
    avoid.push('horizontal_pull', 'vertical_pull');
  }
  if (sorenessAreas.includes('quads')) {
    avoid.push('squat', 'lunge');
  }
  // etc.

  return avoid;
}
```

---

## Data Model

```typescript
// Part of RecoveryLog
interface RecoveryLog {
  // ... other fields
  overallSoreness: number;
  sorenessAreas: string[];
}
```

### Database Columns

```sql
-- In recovery_logs table
overall_soreness INTEGER CHECK (overall_soreness BETWEEN 1 AND 5),
soreness_areas TEXT[],  -- Array of body parts
```

---

## DOMS Patterns

Normal Delayed Onset Muscle Soreness (DOMS):

| Timing | What to Expect |
|--------|----------------|
| 0-12 hours | Minimal soreness |
| 24-48 hours | Peak soreness |
| 48-72 hours | Decreasing |
| 72+ hours | Should be recovered |

**Warning signs** (not normal DOMS):
- Sharp or acute pain
- Soreness lasting 5+ days
- Pain in joints (not muscles)
- Asymmetric pain (one side only)

---

## Integration Points

### Provides to:
- MoFatigue (fatigue calculation)
- MoSuggest (exercise avoidance)
- MoMobility (targeted stretching)
- Dashboard (soreness display)

### Receives from:
- Recovery check-in UI

---

## Best Practices

- Soreness ≠ effectiveness (don't chase it)
- Some soreness is normal for new exercises
- Severe soreness may indicate too much volume
- Use mobility work to reduce soreness
