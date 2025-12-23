---
sidebar_position: 1
title: API Overview
---

# API Reference

All API routes require Clerk authentication via `getCurrentUser()` from MO:SELF.

---

## Endpoints by Domain

### MO:PULSE (Tracking)

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/api/ppl/today`](./ppl#get-todays-workout) | GET | Today's workout from PPL rotation |
| [`/api/ppl/session`](./ppl#start-session) | POST | Start a workout session |
| [`/api/ppl/session`](./ppl#complete-session) | PATCH | Complete a workout session |
| [`/api/ppl/session/sets`](./ppl#log-set) | POST | Log a set |
| `/api/weight` | GET/POST | Weight tracking |
| [`/api/recovery`](./recovery) | GET/POST | Recovery logging |
| `/api/warmup` | GET/POST | Warmup tracking |

### MO:SELF (Foundation)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/streaks` | GET | Workout streak data |
| `/api/records` | GET | Personal records |
| `/api/preferences` | GET/PATCH | User preferences |

### MO:COACH (Intelligence)

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/api/progression`](./progression) | GET | Progression analysis |
| `/api/training/status` | GET/POST | Fatigue & deload status |
| `/api/training/suggest` | GET | Weight suggestions |

### MO:CONNECT (Library)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exercises/alternatives` | GET | Exercise alternatives by pattern |
| `/api/programs` | GET | Available programs |

---

## Common Patterns

### Authentication

All endpoints use Clerk for authentication:

```typescript
import { getCurrentUser } from '@/lib/mo-self';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of handler
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| 401 | Unauthorized - not logged in |
| 400 | Bad Request - invalid parameters |
| 404 | Not Found - resource doesn't exist |
| 500 | Server Error - unexpected error |

```json
{
  "error": "Error message here"
}
```

### Success Responses

All successful responses return JSON with the relevant data.

---

## Quick Examples

### Start a Workout

```bash
POST /api/ppl/session
Content-Type: application/json

{
  "templateDayId": "abc123"
}
```

### Log a Set

```bash
POST /api/ppl/session/sets
Content-Type: application/json

{
  "sessionExerciseId": "xyz789",
  "setNumber": 1,
  "weight": 135,
  "reps": 8,
  "rpe": 7
}
```

### Get Today's Workout

```bash
GET /api/ppl/today
```

### Log Recovery

```bash
POST /api/recovery
Content-Type: application/json

{
  "sleepHours": 7.5,
  "sleepQuality": 4,
  "energyLevel": 4,
  "overallSoreness": 2,
  "stressLevel": 3
}
```
