---
sidebar_position: 1
title: MoFatigue
---

# MoFatigue

> *"The Guardian"* — "I protect you from yourself"

**Status:** ✅ Built

MoFatigue calculates a fatigue score (0-10) based on training load, recovery metrics, and RPE trends.

---

## Purpose

- Calculate daily fatigue score
- Identify when to reduce training
- Trigger deload recommendations
- Block progression when fatigued
- Log fatigue history for trends

---

## Implementation

### Code Location

```
/lib/mo-coach/adapt/fatigue.ts
```

### Key Functions

```typescript
// Calculate current fatigue
export async function calculateFatigue(userId: string): Promise<FatigueResult>

// Get fatigue status with recommendations
export async function getFatigueStatus(userId: string): Promise<FatigueStatus>

// Log fatigue to database
export async function logFatigue(
  userId: string,
  score: number,
  components: FatigueComponents
): Promise<void>
```

---

## Fatigue Calculation

### Score Components (0-10 total)

| Component | Range | What It Measures |
|-----------|-------|------------------|
| RPE Creep | 0-2 | Are workouts getting harder? |
| Performance Drop | 0-2 | Is average RPE too high? |
| Recovery Debt | 0-3 | Sleep, energy, soreness metrics |
| Volume Load | 0-2 | Volume spike vs baseline |
| Streak Score | 0-1 | 5+ consecutive training days |

### Calculation Logic

```typescript
function calculateFatigueScore(data: FatigueData): FatigueResult {
  let score = 0;
  const components: FatigueComponents = {};

  // RPE Creep (0-2)
  // Compare recent RPE to previous period
  const rpeCreep = calculateRPECreep(data.recentSets, data.olderSets);
  components.rpeCreep = Math.min(rpeCreep, 2);
  score += components.rpeCreep;

  // Performance Drop (0-2)
  // High average RPE indicates struggling
  const avgRPE = average(data.recentSets.map(s => s.rpe));
  components.performanceDrop = avgRPE > 8.5 ? 2 : avgRPE > 7.5 ? 1 : 0;
  score += components.performanceDrop;

  // Recovery Debt (0-3)
  // Poor sleep, low energy, high soreness
  const recovery = data.recentRecovery;
  let recoveryDebt = 0;
  if (recovery.avgSleep < 6) recoveryDebt += 1.5;
  else if (recovery.avgSleep < 7) recoveryDebt += 0.5;
  if (recovery.avgEnergy < 3) recoveryDebt += 1;
  if (recovery.avgSoreness > 3) recoveryDebt += 0.5;
  components.recoveryDebt = Math.min(recoveryDebt, 3);
  score += components.recoveryDebt;

  // Volume Load (0-2)
  // Current week vs 4-week average
  const volumeRatio = data.currentWeekVolume / data.baselineVolume;
  components.volumeLoad = volumeRatio > 1.3 ? 2 : volumeRatio > 1.15 ? 1 : 0;
  score += components.volumeLoad;

  // Streak Score (0-1)
  // 5+ consecutive days
  components.streakScore = data.consecutiveDays >= 5 ? 1 : 0;
  score += components.streakScore;

  return {
    score: Math.min(score, 10),
    level: getFatigueLevel(score),
    components
  };
}
```

---

## Fatigue Levels

| Score | Level | Color | Recommendation |
|-------|-------|-------|----------------|
| 0-2 | Fresh | Green | Train hard, PR attempts OK |
| 3-4 | Normal | Yellow | Normal training |
| 5-6 | Elevated | Orange | Monitor closely, maybe reduce |
| 7-8 | High | Red | Reduce volume/intensity |
| 9-10 | Critical | Red | Rest day recommended |

---

## Data Model

```typescript
interface FatigueResult {
  score: number;              // 0-10
  level: FatigueLevel;
  color: string;
  components: FatigueComponents;
  message: string;
  recommendations: string[];
}

interface FatigueComponents {
  rpeCreep: number;
  performanceDrop: number;
  recoveryDebt: number;
  volumeLoad: number;
  streakScore: number;
}

type FatigueLevel = 'fresh' | 'normal' | 'elevated' | 'high' | 'critical';
```

### Database Table

```sql
CREATE TABLE fatigue_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score DECIMAL(3,1) NOT NULL,
  level fatigue_level NOT NULL,
  rpe_creep DECIMAL(3,1),
  performance_drop DECIMAL(3,1),
  recovery_debt DECIMAL(3,1),
  volume_load DECIMAL(3,1),
  streak_score DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, date)
);
```

---

## API Response

Part of `/api/training/status`:

```json
{
  "fatigue": {
    "score": 5.5,
    "level": "elevated",
    "color": "orange",
    "components": {
      "rpeCreep": 1.5,
      "performanceDrop": 1,
      "recoveryDebt": 1.5,
      "volumeLoad": 1,
      "streakScore": 0.5
    },
    "message": "Fatigue is elevated. Consider reducing volume.",
    "recommendations": [
      "Take an extra rest day this week",
      "Focus on sleep quality",
      "Reduce sets by 20-30%"
    ]
  }
}
```

---

## Integration Points

### Receives from:
- MoStrength (RPE data)
- MoSession (volume data)
- MoRecover (sleep, energy, soreness)
- MoStreaks (consecutive days)

### Provides to:
- MoDeload (deload triggers)
- MoProgress (progression gates)
- MoSuggest (weight adjustments)
- Dashboard (fatigue display)
