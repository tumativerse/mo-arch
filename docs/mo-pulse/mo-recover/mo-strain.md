---
sidebar_position: 4
title: MoStrain
---

# MoStrain

> *"The Load Monitor"* — "I measure your body's stress"

**Status:** ❌ Future

MoStrain will track daily strain and recovery scores from wearable devices.

---

## Purpose

- Import strain scores from wearables
- Track daily recovery readiness
- Correlate strain with training load
- Provide objective fatigue data

---

## Supported Devices (Planned)

| Device | Metrics Available |
|--------|-------------------|
| WHOOP | Strain score, recovery %, HRV |
| Apple Watch | Activity, HRV, cardio fitness |
| Garmin | Body Battery, stress, HRV |
| Oura | Readiness score, HRV, sleep stages |
| Fitbit | Daily readiness, stress score |

---

## Data Model

```typescript
interface StrainData {
  id: string;
  userId: string;
  date: Date;

  // Strain (activity load)
  strainScore: number;        // 0-21 (WHOOP scale)
  activityCalories: number;
  activeMinutes: number;

  // Recovery
  recoveryScore: number;      // 0-100%
  hrvMs: number;              // Heart rate variability
  restingHr: number;          // Resting heart rate

  // Source
  source: WearableSource;
  externalId: string;

  syncedAt: Date;
}

interface HRVTrend {
  current: number;
  baseline: number;           // 7-day average
  percentOfBaseline: number;
  trend: 'above' | 'at' | 'below';
}

type WearableSource =
  | 'whoop'
  | 'apple_watch'
  | 'garmin'
  | 'oura'
  | 'fitbit';
```

---

## Strain Scoring

### WHOOP-style Scale (0-21)

| Score | Level | Description |
|-------|-------|-------------|
| 0-9 | Light | Easy day, good recovery |
| 10-13 | Moderate | Typical training day |
| 14-17 | High | Hard workout |
| 18-21 | Very High | Extreme exertion |

### Recovery Score (0-100%)

| Score | Level | Training Recommendation |
|-------|-------|------------------------|
| 0-33% | Poor | Rest or light activity |
| 34-66% | Moderate | Normal training |
| 67-100% | Good | Train hard, PR attempts |

---

## HRV Analysis

Heart Rate Variability is a key recovery indicator:

```typescript
function analyzeHRV(current: number, baseline: number): HRVAnalysis {
  const percentOfBaseline = (current / baseline) * 100;

  if (percentOfBaseline < 85) {
    return {
      status: 'suppressed',
      recommendation: 'Consider reducing training load'
    };
  }
  if (percentOfBaseline > 115) {
    return {
      status: 'elevated',
      recommendation: 'Well recovered, train hard'
    };
  }
  return {
    status: 'normal',
    recommendation: 'Train as planned'
  };
}
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/strain` | GET | Get strain/recovery data |
| `/api/strain/sync` | POST | Sync from wearable |
| `/api/strain/trend` | GET | Get HRV/recovery trend |

---

## Integration Points

### Will Receive from:
- MoWearables (device sync)

### Will Provide to:
- MoFatigue (objective fatigue data)
- Dashboard (strain/recovery display)
- MoSuggest (training adjustments)

---

## Implementation Tasks

- [ ] Design strain_data table
- [ ] Integrate with wearable APIs
- [ ] Build HRV analysis
- [ ] Create strain dashboard widget
- [ ] Add strain to fatigue calculation
- [ ] Build sync settings UI
