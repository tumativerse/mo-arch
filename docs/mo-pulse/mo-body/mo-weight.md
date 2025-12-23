---
sidebar_position: 1
title: MoWeight
---

# MoWeight

> *"The Scale"* — "I track your body's journey"

**Status:** ✅ Built

MoWeight tracks daily body weight with trend analysis and goal tracking.

---

## Purpose

- Log daily body weight
- Calculate weight trends (7-day, 30-day averages)
- Track progress toward weight goals
- Visualize weight history with charts

---

## Implementation

### Code Location

```
/app/api/weight/route.ts
```

### API Operations

```typescript
// Get weight history
GET /api/weight?days=30

// Log weight
POST /api/weight { weight, unit?, date? }
```

---

## Data Model

```typescript
interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  unit: 'lbs' | 'kg';
  date: Date;
  notes: string | null;
  createdAt: Date;
}

interface WeightTrend {
  current: number;
  weekAverage: number;
  monthAverage: number;
  weekChange: number;      // lbs/kg gained/lost
  monthChange: number;
  trend: 'gaining' | 'losing' | 'maintaining';
}
```

### Database Table

```sql
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  weight DECIMAL(5,2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'lbs',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, date)  -- One entry per day
);
```

---

## API Endpoints

### GET /api/weight

Returns weight history and trend.

**Query params:** `days` (default: 30)

```json
{
  "entries": [
    {
      "id": "uuid",
      "weight": 165.5,
      "unit": "lbs",
      "date": "2024-12-22",
      "notes": null
    }
  ],
  "trend": {
    "current": 165.5,
    "weekAverage": 166.2,
    "monthAverage": 167.8,
    "weekChange": -0.7,
    "monthChange": -2.3,
    "trend": "losing"
  },
  "goal": {
    "targetWeight": 160,
    "remaining": 5.5,
    "percentComplete": 45
  }
}
```

### POST /api/weight

Logs a weight entry.

**Request:**
```json
{
  "weight": 165.5,
  "unit": "lbs",
  "date": "2024-12-22",
  "notes": "Morning weigh-in"
}
```

**Response:**
```json
{
  "entry": {
    "id": "uuid",
    "weight": 165.5,
    "date": "2024-12-22"
  },
  "isUpdate": false
}
```

---

## Trend Calculation

```typescript
function calculateTrend(entries: WeightEntry[]): WeightTrend {
  const current = entries[0]?.weight;

  // 7-day average
  const weekEntries = entries.filter(e =>
    daysSince(e.date) <= 7
  );
  const weekAverage = average(weekEntries.map(e => e.weight));

  // 30-day average
  const monthAverage = average(entries.map(e => e.weight));

  // Changes
  const weekAgo = entries.find(e => daysSince(e.date) >= 7);
  const weekChange = weekAgo ? current - weekAgo.weight : 0;

  // Determine trend
  const trend = weekChange < -0.5 ? 'losing'
              : weekChange > 0.5 ? 'gaining'
              : 'maintaining';

  return { current, weekAverage, monthAverage, weekChange, trend };
}
```

---

## Integration Points

### Provides to:
- Dashboard (current weight, trend)
- Weight chart (history visualization)
- MoGoals (weight goal progress)
- MoCoach (body weight context)

### Receives from:
- Weight logging UI
- MoWearables (smart scale import - future)

---

## Best Practices

- Weigh at consistent time (morning, after bathroom)
- Use 7-day average to smooth daily fluctuations
- Focus on trend, not daily changes
- Log consistently (daily or every few days)
