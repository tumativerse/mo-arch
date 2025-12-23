---
sidebar_position: 2
title: MoSync
---

# MoSync

> *"I connect your devices"*

MoSync will handle all device integrations — wearables, health platforms, and third-party APIs.

**Status:** ❌ Future (all systems planned)

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoWearables](./mo-wearables) | *"The Device Bridge"* | ❌ Future | Wearable device sync |
| [MoHealth](./mo-health) | *"The Health Hub"* | ❌ Future | Health platform integration |
| [MoAPIs](./mo-apis) | *"The Gateway"* | ❌ Future | Third-party API connections |

---

## Vision

Seamless device integration that enriches training data:

- Sync workouts from wearables
- Import health metrics automatically
- Push data to health platforms
- Connect third-party fitness services
- Real-time heart rate during workouts

---

## Vertical Interface (Planned)

```typescript
interface MoSyncInterface {
  // Wearables
  connectDevice(deviceType: DeviceType): Promise<Connection>;
  syncDevice(connectionId: string): Promise<SyncResult>;
  getDeviceData(connectionId: string, dateRange: DateRange): Promise<DeviceData>;

  // Health Platforms
  connectHealthPlatform(platform: HealthPlatform): Promise<Connection>;
  pushToHealth(data: HealthData): Promise<void>;
  pullFromHealth(metrics: MetricType[]): Promise<HealthData>;

  // Third-Party
  connectService(service: ThirdPartyService): Promise<Connection>;
  importData(connectionId: string): Promise<ImportResult>;
}
```

---

## Supported Integrations (Planned)

### Wearables
- Apple Watch
- Garmin devices
- WHOOP
- Fitbit
- Polar

### Health Platforms
- Apple Health
- Google Fit
- Samsung Health

### Third-Party Services
- Strava
- MyFitnessPal
- Strong app (import)

---

## Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Wearable       │────▶│   MoSync     │────▶│  Mo Core    │
│  (Apple Watch)  │     │  (Adapter)   │     │  (Database) │
└─────────────────┘     └──────────────┘     └─────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │ Health Kit   │
                        │ (Push back)  │
                        └──────────────┘
```

---

## Implementation Priority

MoSync is Phase 9, after core training features are complete.
