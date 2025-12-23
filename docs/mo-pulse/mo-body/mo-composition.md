---
sidebar_position: 3
title: MoComposition
---

# MoComposition

> *"The Analyzer"* — "I reveal what the scale can't"

**Status:** ❌ Future

MoComposition will track body composition — body fat percentage, muscle mass, and related metrics.

---

## Purpose

- Track body fat percentage
- Estimate lean muscle mass
- Monitor body composition changes
- Provide more meaningful progress than weight alone

---

## Data Sources

Body composition can come from:

| Source | Accuracy | Method |
|--------|----------|--------|
| DEXA scan | Very high | Medical facility |
| Smart scale | Moderate | Bioelectrical impedance |
| Navy method | Moderate | Tape measurements |
| Calipers | Moderate | Skinfold measurements |
| Visual estimate | Low | Progress photos |

---

## Data Model

```typescript
interface BodyComposition {
  id: string;
  userId: string;
  date: Date;

  // Core metrics
  bodyFatPercent: number;
  leanMassLbs: number;
  fatMassLbs: number;

  // Calculated
  ffmi: number;              // Fat-free mass index

  // Source
  source: CompositionSource;
  notes: string | null;

  createdAt: Date;
}

interface CompositionTrend {
  currentBodyFat: number;
  previousBodyFat: number;
  bodyFatChange: number;

  currentLeanMass: number;
  previousLeanMass: number;
  leanMassChange: number;

  trend: 'recomp' | 'bulking' | 'cutting' | 'maintaining';
}

type CompositionSource =
  | 'dexa'
  | 'smart_scale'
  | 'navy_method'
  | 'calipers'
  | 'estimate';
```

---

## Calculations

### Navy Method (from measurements)

```typescript
// For men
bodyFatPercent = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450;

// For women
bodyFatPercent = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450;
```

### FFMI (Fat-Free Mass Index)

```typescript
// Normalized measure of muscularity
const leanMassKg = (weight * (1 - bodyFatPercent / 100)) / 2.205;
const heightM = height / 100;
const ffmi = leanMassKg / (heightM * heightM) + 6.1 * (1.8 - heightM);

// FFMI ranges (men)
// 18-20: Average
// 20-22: Above average
// 22-25: Excellent
// 25+: Elite/suspicious
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/composition` | GET | Get composition history |
| `/api/composition` | POST | Log composition |
| `/api/composition/calculate` | POST | Calculate from measurements |

---

## Integration Points

### Will Receive from:
- Smart scale import (MoWearables)
- MoMeasure (Navy method calculation)
- Manual entry

### Will Provide to:
- Progress page (composition charts)
- MoGoals (body fat goals)
- MoCoach (training recommendations)

---

## Implementation Tasks

- [ ] Create body_composition table
- [ ] Implement Navy method calculator
- [ ] Build composition logging UI
- [ ] Create composition charts
- [ ] Integrate with smart scale (MoWearables)
- [ ] Add FFMI calculation and display
