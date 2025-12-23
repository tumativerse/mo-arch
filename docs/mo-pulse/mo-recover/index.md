---
sidebar_position: 3
title: MoRecover
---

# MoRecover

> *"I monitor how you heal"*

MoRecover tracks recovery metrics — sleep, energy, soreness, and strain.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoSleep](./mo-sleep) | *"The Night Watcher"* | ✅ Built | Sleep hours & quality |
| [MoEnergy](./mo-energy) | *"The Battery"* | ✅ Built | Daily energy levels |
| [MoSoreness](./mo-soreness) | *"The Pain Map"* | ✅ Built | Muscle soreness |
| [MoStrain](./mo-strain) | *"The Load Monitor"* | ❌ Future | Wearable strain data |

---

## Unified Recovery API

All recovery metrics are logged together via a single endpoint:

```
POST /api/recovery
{
  sleepHours: 7.5,
  sleepQuality: 4,
  energyLevel: 4,
  overallSoreness: 2,
  sorenessAreas: ["legs"],
  stressLevel: 3
}
```

---

## Vertical Interface

```typescript
interface MoRecoverInterface {
  // Combined logging
  logRecovery(userId: string, data: RecoveryData): Promise<RecoveryLog>;
  getRecovery(userId: string, date: Date): Promise<RecoveryLog | null>;
  getRecoveryHistory(userId: string, days: number): Promise<RecoveryLog[]>;

  // Summary
  getRecoverySummary(userId: string, days: number): Promise<RecoverySummary>;
}

interface RecoveryData {
  sleepHours: number;
  sleepQuality: number;      // 1-5
  energyLevel: number;       // 1-5
  overallSoreness: number;   // 1-5
  sorenessAreas?: string[];
  stressLevel?: number;      // 1-5
  notes?: string;
}
```

---

## Recovery Impact on Training

| Metric | Poor | OK | Good |
|--------|------|-----|------|
| Sleep | < 6 hrs | 6-7 hrs | 7+ hrs |
| Energy | 1-2 | 3 | 4-5 |
| Soreness | 4-5 | 3 | 1-2 |

Poor recovery feeds into MoFatigue calculation.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recovery` | GET | Get recovery logs |
| `/api/recovery` | POST | Log daily recovery |
