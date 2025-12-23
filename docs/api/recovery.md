---
sidebar_position: 3
title: Recovery Endpoints
---

# Recovery Endpoints

Endpoints for tracking sleep, energy, and soreness.

---

## Get Recovery Logs

```
GET /api/recovery
```

Returns recovery logs for a time period.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `days` | number | 7 | Number of days to fetch |
| `date` | string | - | Get specific date (YYYY-MM-DD) |

### Response

```json
{
  "logs": [
    {
      "id": "rec123",
      "date": "2024-12-22",
      "sleepHours": 7.5,
      "sleepQuality": 4,
      "energyLevel": 4,
      "overallSoreness": 2,
      "sorenessAreas": ["legs"],
      "stressLevel": 3,
      "notes": null,
      "createdAt": "2024-12-22T08:00:00Z"
    }
  ],
  "summary": {
    "avgSleep": 7.2,
    "avgEnergy": 3.8,
    "avgSoreness": 2.3,
    "avgStress": 2.9,
    "avgQuality": 3.5,
    "daysLogged": 5,
    "totalDays": 7
  }
}
```

---

## Log Recovery

```
POST /api/recovery
```

Logs daily recovery metrics. Updates existing log if one exists for today.

### Request Body

```json
{
  "sleepHours": 7.5,
  "sleepQuality": 4,
  "energyLevel": 4,
  "overallSoreness": 2,
  "sorenessAreas": ["legs", "back"],
  "stressLevel": 3,
  "notes": "Slept well, feeling good"
}
```

### Field Definitions

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `sleepHours` | number | 0-24 | Hours of sleep |
| `sleepQuality` | number | 1-5 | 1=Poor, 5=Excellent |
| `energyLevel` | number | 1-5 | 1=Low, 5=High |
| `overallSoreness` | number | 1-5 | 1=None, 5=Severe |
| `sorenessAreas` | string[] | - | Body parts that are sore |
| `stressLevel` | number | 1-5 | 1=Low, 5=High |
| `notes` | string | - | Optional notes |

### Response

```json
{
  "log": {
    "id": "rec123",
    "date": "2024-12-22",
    "sleepHours": 7.5,
    "sleepQuality": 4,
    "energyLevel": 4,
    "overallSoreness": 2,
    "sorenessAreas": ["legs", "back"],
    "stressLevel": 3,
    "notes": "Slept well, feeling good",
    "createdAt": "2024-12-22T08:00:00Z"
  },
  "isUpdate": false
}
```

---

## How Recovery Affects Training

Recovery data feeds into the fatigue calculation:

| Metric | Impact on Fatigue |
|--------|-------------------|
| Sleep < 6 hours | +1 fatigue point |
| Sleep quality < 3 | +0.5 fatigue point |
| Energy < 3 | +1 fatigue point |
| Soreness > 3 | +1 fatigue point |
| Stress > 4 | +0.5 fatigue point |

High recovery debt can:
- Increase fatigue score
- Block progression gates
- Trigger deload recommendations
- Reduce suggested weights
