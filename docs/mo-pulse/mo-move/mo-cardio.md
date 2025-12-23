---
sidebar_position: 4
title: MoCardio
---

# MoCardio

> *"The Distance Tracker"* — "I measure every mile"

**Status:** ❌ Future

MoCardio will track cardiovascular activities like running, cycling, swimming, and rowing.

---

## Purpose

- Log cardio sessions (duration, distance, pace)
- Track heart rate zones
- Calculate calories burned
- Integrate with wearables for auto-import
- Analyze cardio trends

---

## Planned Activities

| Activity | Metrics |
|----------|---------|
| Running | Distance, pace, elevation, heart rate |
| Cycling | Distance, speed, cadence, power |
| Swimming | Laps, distance, stroke count |
| Rowing | Distance, split time, stroke rate |
| Walking | Steps, distance, pace |
| HIIT | Intervals, work/rest, heart rate |
| Stair Climber | Floors, duration, calories |

---

## Data Model

```typescript
interface CardioSession {
  id: string;
  userId: string;
  activityType: CardioType;

  // Core metrics
  duration: number;           // seconds
  distance: number | null;    // meters
  calories: number | null;

  // Pace/Speed
  avgPace: number | null;     // seconds per km
  avgSpeed: number | null;    // km/h

  // Heart rate
  avgHeartRate: number | null;
  maxHeartRate: number | null;
  heartRateZones: HeartRateZone[];

  // Activity-specific
  elevation: number | null;   // meters (running/cycling)
  laps: number | null;        // swimming
  strokes: number | null;     // rowing

  // Source
  source: 'manual' | 'apple_watch' | 'garmin' | 'strava';
  externalId: string | null;

  startedAt: Date;
  completedAt: Date;
  notes: string | null;
}

interface HeartRateZone {
  zone: number;           // 1-5
  timeInZone: number;     // seconds
  percentOfSession: number;
}

type CardioType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'rowing'
  | 'walking'
  | 'hiit'
  | 'stair_climber'
  | 'elliptical';
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cardio` | GET | Get cardio sessions |
| `/api/cardio` | POST | Log cardio session |
| `/api/cardio/stats` | GET | Get cardio statistics |

---

## Heart Rate Zones

| Zone | % Max HR | Name | Purpose |
|------|----------|------|---------|
| 1 | 50-60% | Recovery | Warm up, cool down |
| 2 | 60-70% | Fat Burn | Base endurance |
| 3 | 70-80% | Aerobic | Improve fitness |
| 4 | 80-90% | Threshold | Increase speed |
| 5 | 90-100% | Maximum | Peak performance |

---

## Integration Points

### Will Receive from:
- MoWearables (auto-import from devices)
- Manual logging UI

### Will Provide to:
- MoFatigue (cardio load in fatigue calc)
- Dashboard (recent activities)
- MoReports (weekly cardio summary)
- MoGoals (cardio goal tracking)

---

## Implementation Tasks

- [ ] Design cardio_sessions table
- [ ] Build manual logging UI
- [ ] Create cardio stats calculations
- [ ] Integrate with MoWearables for imports
- [ ] Add cardio to fatigue calculation
- [ ] Build cardio history view
