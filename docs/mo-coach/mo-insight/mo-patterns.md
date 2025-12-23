---
sidebar_position: 3
title: MoPatterns
---

# MoPatterns

> *"The Detective"* — "I find what you can't see"

**Status:** ❌ Future

MoPatterns will use machine learning to detect behavioral patterns and predict outcomes.

---

## Purpose

- Detect patterns in training behavior
- Predict future performance
- Identify optimal training times
- Correlate recovery with performance
- Personalize recommendations

---

## Pattern Types

### Training Patterns

| Pattern | Example |
|---------|---------|
| Best training days | "You perform best on Tuesday/Thursday" |
| Optimal session length | "Sessions under 60 min have better RPE" |
| Rest day impact | "Performance drops after 3+ rest days" |
| Volume tolerance | "You handle 20 sets/session well" |

### Recovery Patterns

| Pattern | Example |
|---------|---------|
| Sleep-performance correlation | "Below 6 hrs sleep = +0.5 avg RPE" |
| Energy cycles | "Energy dips every Thursday" |
| Soreness recovery | "Legs need 72 hrs between sessions" |

### Progression Patterns

| Pattern | Example |
|---------|---------|
| PR frequency | "You set PRs every 2-3 weeks" |
| Plateau indicators | "RPE creep precedes plateaus by 2 weeks" |
| Deload timing | "Performance peaks 1 week after deload" |

---

## Data Model

```typescript
interface PatternInsight {
  id: string;
  type: PatternType;
  confidence: number;        // 0-100%
  description: string;
  recommendation: string;
  dataPoints: number;        // How much data supports this
  firstDetected: Date;
  lastConfirmed: Date;
}

interface Prediction {
  type: PredictionType;
  target: string;            // e.g., "bench press"
  prediction: number;        // predicted value
  confidence: number;
  timeframe: string;         // "2 weeks"
  basis: string;             // explanation
}

type PatternType =
  | 'training_timing'
  | 'recovery_correlation'
  | 'volume_tolerance'
  | 'progression_rate'
  | 'fatigue_pattern';

type PredictionType =
  | 'next_pr'
  | 'plateau_risk'
  | 'deload_needed'
  | 'optimal_weight';
```

---

## Machine Learning Approach

### Data Features

```typescript
interface TrainingFeatures {
  // Session features
  dayOfWeek: number;
  timeOfDay: number;
  sessionDuration: number;
  restDaysBefore: number;

  // Recovery features
  sleepHours: number;
  sleepQuality: number;
  energyLevel: number;
  soreness: number;

  // Historical features
  recentVolume: number;
  recentAvgRPE: number;
  daysSinceDeload: number;
}

interface PerformanceTarget {
  avgRPE: number;
  volumeCompleted: number;
  prAchieved: boolean;
}
```

### Models (Future)

1. **Performance Predictor** - Predict session quality from recovery data
2. **Plateau Detector** - Predict when plateau will occur
3. **Deload Recommender** - Optimal deload timing
4. **PR Predictor** - When user is likely to hit a PR

---

## Implementation Tasks

- [ ] Collect sufficient training data
- [ ] Design feature extraction
- [ ] Train initial models
- [ ] Build pattern detection logic
- [ ] Create insight delivery system
- [ ] Add confidence scoring
- [ ] Build explanation generation
