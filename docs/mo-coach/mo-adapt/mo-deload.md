---
sidebar_position: 3
title: MoDeload
---

# MoDeload

> *"The Healer"* — "I give you permission to recover"

**Status:** ✅ Built

MoDeload manages deload periods — planned recovery weeks to prevent overtraining.

---

## Purpose

- Detect when deload is needed
- Manage deload periods
- Apply volume/intensity modifiers
- Track deload history
- Provide post-deload guidance

---

## Implementation

### Code Location

```
/lib/mo-coach/adapt/deload.ts
```

### Key Functions

```typescript
// Check if deload is needed
export async function checkDeloadNeeded(userId: string): Promise<DeloadDecision>

// Start a deload period
export async function startDeload(
  userId: string,
  type: DeloadType,
  days?: number
): Promise<DeloadPeriod>

// End deload early or on schedule
export async function endDeload(userId: string): Promise<void>

// Get active deload modifiers
export async function getDeloadModifiers(userId: string): Promise<DeloadModifiers | null>
```

---

## Deload Triggers

| Trigger | Condition | Auto/Manual |
|---------|-----------|-------------|
| Scheduled | Every 4 weeks | Auto-suggest |
| Critical Fatigue | 2+ days at score 8+ | Auto-suggest |
| Prolonged Elevated | 5+ days at score 6+ | Auto-suggest |
| High + Poor Recovery | Score 7+ AND recovery < 3 | Auto-suggest |
| Manual | User request | Manual |

### Detection Logic

```typescript
async function checkDeloadNeeded(userId: string): Promise<DeloadDecision> {
  const fatigueLogs = await getRecentFatigueLogs(userId, 14);
  const lastDeload = await getLastDeload(userId);
  const daysSinceDeload = daysBetween(lastDeload?.endDate, new Date());

  // Check triggers
  const triggers: DeloadTrigger[] = [];

  // Scheduled (every 4 weeks)
  if (daysSinceDeload >= 28) {
    triggers.push({
      type: 'scheduled',
      message: 'Time for scheduled deload (4 weeks)'
    });
  }

  // Critical fatigue (2+ days at 8+)
  const criticalDays = fatigueLogs.filter(l => l.score >= 8).length;
  if (criticalDays >= 2) {
    triggers.push({
      type: 'critical_fatigue',
      message: `Critical fatigue for ${criticalDays} days`
    });
  }

  // Prolonged elevated (5+ days at 6+)
  const elevatedDays = fatigueLogs.filter(l => l.score >= 6).length;
  if (elevatedDays >= 5) {
    triggers.push({
      type: 'prolonged_elevated',
      message: `Elevated fatigue for ${elevatedDays} days`
    });
  }

  return {
    isNeeded: triggers.length > 0,
    isRecommended: triggers.length > 0,
    triggers,
    suggestedType: getSuggestedType(triggers),
    suggestedDays: 7
  };
}
```

---

## Deload Types

| Type | Volume | Intensity | Use Case |
|------|--------|-----------|----------|
| Volume | 60% | 100% | Scheduled, normal fatigue |
| Intensity | 70% | 85% | Critical fatigue |
| Full Rest | 0% | 0% | Extreme fatigue, illness |

### Modifiers Applied

```typescript
interface DeloadModifiers {
  volumeModifier: number;      // 0.6 for volume deload
  intensityModifier: number;   // 1.0 or 0.85
  setsModifier: number;        // Reduce sets
  repsModifier: number;        // Keep reps same usually
}

// During volume deload
const modifiers = {
  volumeModifier: 0.6,      // 60% of normal sets
  intensityModifier: 1.0,   // Same weight
  setsModifier: 0.6,        // 3 sets → 2 sets
  repsModifier: 1.0         // Same reps
};
```

---

## Data Model

```typescript
interface DeloadPeriod {
  id: string;
  userId: string;
  type: DeloadType;
  trigger: DeloadTrigger;

  startDate: Date;
  endDate: Date;
  daysPlanned: number;

  volumeModifier: number;
  intensityModifier: number;

  status: 'active' | 'completed' | 'cancelled';
  completedAt: Date | null;
  notes: string | null;
}

type DeloadType = 'volume' | 'intensity' | 'full_rest';
```

### Database Table

```sql
CREATE TABLE deload_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type deload_type NOT NULL,
  trigger VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_planned INTEGER NOT NULL,
  volume_modifier DECIMAL(3,2) NOT NULL,
  intensity_modifier DECIMAL(3,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### GET /api/training/status

Returns deload status:

```json
{
  "deload": {
    "isActive": true,
    "type": "volume",
    "startDate": "2024-12-20",
    "endDate": "2024-12-27",
    "daysRemaining": 5,
    "modifiers": {
      "volume": 0.6,
      "intensity": 1.0
    }
  }
}
```

### POST /api/training/status

Start or end deload:

```json
{
  "action": "start",
  "type": "volume",
  "days": 7
}
```

---

## Integration Points

### Receives from:
- MoFatigue (fatigue triggers)
- MoSession (days since last deload)

### Provides to:
- MoSuggest (apply modifiers)
- Workout UI (deload indicator)
- Dashboard (deload status)
