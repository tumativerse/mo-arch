---
sidebar_position: 2
title: MoMeasure
---

# MoMeasure

> *"The Tape"* — "I track every inch of progress"

**Status:** ❌ Future

MoMeasure will track body measurements for a complete picture of body composition changes.

---

## Purpose

- Track body measurements (chest, waist, arms, etc.)
- Monitor muscle growth in specific areas
- Track fat loss independently of weight
- Provide visual progress comparison

---

## Planned Measurements

| Area | Description |
|------|-------------|
| Neck | Around Adam's apple |
| Shoulders | Around widest point |
| Chest | Around nipple line |
| Biceps | Around peak, flexed |
| Forearms | Around thickest point |
| Waist | Around navel |
| Hips | Around widest point |
| Thighs | Around thickest point |
| Calves | Around thickest point |

---

## Data Model

```typescript
interface Measurement {
  id: string;
  userId: string;
  date: Date;

  // Upper body (in cm or inches)
  neck: number | null;
  shoulders: number | null;
  chest: number | null;
  bicepLeft: number | null;
  bicepRight: number | null;
  forearmLeft: number | null;
  forearmRight: number | null;

  // Core
  waist: number | null;
  hips: number | null;

  // Lower body
  thighLeft: number | null;
  thighRight: number | null;
  calfLeft: number | null;
  calfRight: number | null;

  unit: 'in' | 'cm';
  notes: string | null;
  createdAt: Date;
}

interface MeasurementChange {
  area: string;
  current: number;
  previous: number;
  change: number;
  percentChange: number;
}
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/measurements` | GET | Get measurement history |
| `/api/measurements` | POST | Log measurements |
| `/api/measurements/compare` | GET | Compare two dates |

---

## Measurement Schedule

Recommended frequency:

| Goal | Frequency |
|------|-----------|
| Muscle building | Every 2 weeks |
| Fat loss | Weekly |
| Maintenance | Monthly |

Measurements change slower than weight, so less frequent logging is fine.

---

## Integration Points

### Will Provide to:
- Progress page (measurement charts)
- MoComposition (for body fat estimation)
- MoGoals (measurement-based goals)

### Will Receive from:
- Measurement logging UI

---

## Implementation Tasks

- [ ] Create measurements table
- [ ] Build measurement logging UI
- [ ] Create measurement comparison view
- [ ] Add measurement charts
- [ ] Integrate with progress page
