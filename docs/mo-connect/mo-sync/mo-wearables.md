---
sidebar_position: 1
title: MoWearables
---

# MoWearables

> *"The Device Bridge"* — "I talk to your watch"

**Status:** ❌ Future

MoWearables will handle connections to fitness wearables like Apple Watch, Garmin, and WHOOP.

---

## Purpose

- Sync workout data from wearables
- Get real-time heart rate during workouts
- Import sleep and recovery metrics
- Track daily activity and steps
- Consolidate data from multiple devices

---

## Supported Devices (Planned)

### Apple Watch
| Data Type | Sync Direction |
|-----------|----------------|
| Workouts | Pull |
| Heart Rate | Pull (real-time) |
| Active Calories | Pull |
| Stand Hours | Pull |
| Sleep | Pull |

### Garmin
| Data Type | Sync Direction |
|-----------|----------------|
| Activities | Pull |
| Heart Rate | Pull |
| Body Battery | Pull |
| Sleep | Pull |
| Stress | Pull |

### WHOOP
| Data Type | Sync Direction |
|-----------|----------------|
| Strain | Pull |
| Recovery | Pull |
| Sleep | Pull |
| HRV | Pull |

---

## Data Model

```typescript
interface DeviceConnection {
  id: string;
  userId: string;
  deviceType: DeviceType;
  deviceName: string;

  // Connection status
  status: ConnectionStatus;
  lastSyncAt: Date | null;
  syncError: string | null;

  // Authentication
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

interface DeviceSyncData {
  connectionId: string;
  syncedAt: Date;

  // Synced metrics
  heartRateSamples: HeartRateSample[];
  workouts: DeviceWorkout[];
  sleepSessions: DeviceSleep[];
  activitySummary: ActivitySummary;
}

type DeviceType = 'apple_watch' | 'garmin' | 'whoop' | 'fitbit' | 'polar';
type ConnectionStatus = 'connected' | 'disconnected' | 'expired' | 'error';
```

---

## Real-Time Heart Rate

During active workouts, stream heart rate from connected watch:

```typescript
interface HeartRateStream {
  // Subscribe to real-time HR
  subscribe(callback: (hr: number) => void): Subscription;

  // Get current HR
  getCurrentHeartRate(): number | null;

  // Get session stats
  getSessionStats(): {
    average: number;
    max: number;
    zones: { zone: HRZone; duration: number }[];
  };
}

type HRZone = 'rest' | 'warmup' | 'fatburn' | 'cardio' | 'peak';
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/devices` | GET | List connected devices |
| `/api/devices/connect` | POST | Initiate device connection |
| `/api/devices/:id/sync` | POST | Trigger manual sync |
| `/api/devices/:id/disconnect` | DELETE | Remove connection |
| `/api/devices/:id/data` | GET | Get synced data |

---

## Sync Strategy

```
Automatic Sync:
- On app open (if last sync > 1 hour)
- After completing a workout
- Background sync every 4 hours

Manual Sync:
- Pull-to-refresh on devices screen
- "Sync Now" button per device

Conflict Resolution:
- Mo workout data takes priority
- Device data fills gaps
- Duplicate detection by timestamp
```

---

## Implementation Tasks

- [ ] Apple Watch integration via HealthKit
- [ ] Garmin Connect API integration
- [ ] WHOOP API integration
- [ ] Real-time heart rate streaming
- [ ] Background sync service
- [ ] Device management UI
