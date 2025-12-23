---
sidebar_position: 4
title: "MO:CONNECT"
---

# MO:CONNECT - Ecosystem Domain

> *"The Connector"* — "I link you to everything"

MO:CONNECT handles all external connections — social features, device integrations, and content delivery.

---

## Verticals

| Vertical | Purpose | Systems | Status |
|----------|---------|---------|--------|
| [MoCommunity](./mo-community/) | Social features | 3 | 0/3 built |
| [MoSync](./mo-sync/) | Device integrations | 3 | 0/3 built |
| [MoLibrary](./mo-library/) | Content & data | 3 | 2/3 built |

---

## Domain Data Model

```typescript
interface MoConnectServices {
  community: {
    posts: SocialPost[];
    challenges: Challenge[];
    friends: Friend[];
  };
  sync: {
    connectedDevices: Device[];
    healthPlatforms: HealthPlatform[];
    syncStatus: SyncStatus;
  };
  library: {
    exercises: Exercise[];
    programs: ProgramTemplate[];
    content: EducationalContent[];
  };
}
```

---

## Domain Interface

```typescript
interface MoConnectInterface {
  // Library
  getExercise(id: string): Promise<Exercise>;
  getExerciseAlternatives(pattern: string): Promise<Exercise[]>;
  getPrograms(): Promise<ProgramTemplate[]>;

  // Sync (future)
  syncWearable(device: DeviceType): Promise<SyncResult>;
  pushToHealthKit(data: HealthData): Promise<void>;

  // Social (future)
  shareWorkout(sessionId: string): Promise<ShareResult>;
  getChallenges(): Promise<Challenge[]>;
}
```

---

## Code Organization

```
/lib/mo-connect
└── index.ts                → Domain exports (placeholder)

/lib/db
├── seed-exercises.ts       → MoExercises data
├── seed-ppl-template.ts    → MoPrograms data
└── seed-warmup-*.ts        → Warmup templates
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/exercises` | GET | MoExercises |
| `/api/exercises/alternatives` | GET | MoExercises |
| `/api/programs` | GET | MoPrograms |

---

## Status

| Metric | Value |
|--------|-------|
| Verticals | 3/3 |
| Systems Built | 2/9 (22%) |
| API Endpoints | 3 |

---

## Future Roadmap

### Phase 9: Device Integration
- MoWearables — Apple Watch, Garmin, WHOOP
- MoHealth — Apple Health, Google Fit

### Phase 10: Community
- MoChallenges — Competitions
- MoLeaderboard — Rankings
- MoShare — Social sharing

### Phase 11: Content Expansion
- MoLearn — Educational library
