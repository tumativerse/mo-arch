---
sidebar_position: 2
title: MoHealth
---

# MoHealth

> *"The Health Hub"* — "I sync with your health apps"

**Status:** ❌ Future

MoHealth will integrate with platform health services like Apple Health and Google Fit.

---

## Purpose

- Push Mo workouts to health platforms
- Pull health metrics into Mo
- Centralize health data
- Enable cross-app data sharing
- Maintain health record continuity

---

## Supported Platforms (Planned)

### Apple Health (HealthKit)

| Metric | Direction | Priority |
|--------|-----------|----------|
| Workouts | Push/Pull | High |
| Weight | Push/Pull | High |
| Body Fat % | Push/Pull | Medium |
| Sleep | Pull | Medium |
| Heart Rate | Pull | Medium |
| Steps | Pull | Low |
| Active Energy | Push/Pull | Medium |

### Google Fit

| Metric | Direction | Priority |
|--------|-----------|----------|
| Workouts | Push/Pull | High |
| Weight | Push/Pull | High |
| Heart Rate | Pull | Medium |
| Sleep | Pull | Medium |
| Steps | Pull | Low |

### Samsung Health

| Metric | Direction | Priority |
|--------|-----------|----------|
| Workouts | Push | Medium |
| Weight | Push/Pull | Medium |
| Sleep | Pull | Medium |

---

## Data Model

```typescript
interface HealthPlatformConnection {
  id: string;
  userId: string;
  platform: HealthPlatform;

  // Permissions
  permissions: HealthPermission[];

  // Sync settings
  autoSync: boolean;
  pushWorkouts: boolean;
  pullMetrics: boolean;

  // Status
  status: 'connected' | 'disconnected' | 'permissions_needed';
  lastSyncAt: Date | null;

  createdAt: Date;
}

interface HealthSyncResult {
  platform: HealthPlatform;
  syncedAt: Date;

  pushed: {
    workouts: number;
    weightLogs: number;
  };

  pulled: {
    sleepSessions: number;
    heartRateSamples: number;
    steps: number;
  };

  errors: HealthSyncError[];
}

type HealthPlatform = 'apple_health' | 'google_fit' | 'samsung_health';

type HealthPermission =
  | 'read_workouts'
  | 'write_workouts'
  | 'read_weight'
  | 'write_weight'
  | 'read_sleep'
  | 'read_heart_rate'
  | 'read_steps';
```

---

## Workout Push Format

When pushing Mo workouts to health platforms:

```typescript
interface HealthWorkout {
  // Core data
  activityType: 'traditional_strength_training';
  startDate: Date;
  endDate: Date;
  duration: number;          // seconds

  // Metrics
  totalEnergyBurned: number; // kcal (estimated)

  // Metadata
  sourceName: 'Mo';
  sourceVersion: string;

  // Mo-specific (stored as metadata)
  metadata: {
    sessionId: string;
    templateDay: string;
    totalVolume: number;
    setCount: number;
    exerciseCount: number;
  };
}
```

---

## Permission Flow

```
1. User taps "Connect Apple Health"
2. Show permissions explanation screen
3. Request HealthKit authorization
4. User approves specific permissions
5. Save connection status
6. Initial sync begins
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Get connection status |
| `/api/health/connect` | POST | Connect platform |
| `/api/health/permissions` | GET | Check permissions |
| `/api/health/sync` | POST | Trigger sync |
| `/api/health/settings` | PATCH | Update sync settings |

---

## Privacy Considerations

- Request minimum necessary permissions
- Clear explanation of data usage
- User controls what data is shared
- Option to disconnect at any time
- No data sold to third parties

---

## Implementation Tasks

- [ ] Apple HealthKit integration
- [ ] Google Fit API integration
- [ ] Permission request flows
- [ ] Bi-directional workout sync
- [ ] Weight log sync
- [ ] Health settings UI
