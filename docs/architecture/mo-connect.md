---
sidebar_position: 5
title: "MO:CONNECT"
---

# MO:CONNECT - Ecosystem Domain

> *"The Connector"* — "I link you to everything"

MO:CONNECT handles all external connections — social features, device integrations, and content delivery.

---

## Verticals & Systems

### MoCommunity — *"I connect you to others"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoShare | *"The Broadcaster"* | Workout sharing, social posts | ❌ Future |
| MoChallenges | *"The Competitor"* | Weekly/monthly challenges | ❌ Future |
| MoLeaderboard | *"The Ranks"* | Friend and global leaderboards | ❌ Future |

### MoSync — *"I talk to your devices"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoWearables | *"The Device Whisperer"* | Apple Watch, Garmin, WHOOP, Fitbit | ❌ Future |
| MoHealth | *"The Health Bridge"* | Apple Health, Google Fit integration | ❌ Future |
| MoAPIs | *"The Translator"* | Third-party API connections | ❌ Future |

### MoLibrary — *"I hold the knowledge"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoExercises | *"The Encyclopedia"* | Exercise database, demos, cues | ✅ Built |
| MoPrograms | *"The Curriculum"* | Training program templates | ✅ Built |
| MoLearn | *"The Classroom"* | Educational content, articles | ❌ Future |

---

## Data Model

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

## Interface

```typescript
interface MoConnectInterface {
  // Library
  getExercise(id: string): Promise<Exercise>;
  getExerciseAlternatives(pattern: string): Promise<Exercise[]>;
  getPrograms(): Promise<ProgramTemplate[]>;

  // Sync
  syncWearable(device: DeviceType): Promise<SyncResult>;
  pushToHealthKit(data: HealthData): Promise<void>;

  // Social
  shareWorkout(sessionId: string): Promise<ShareResult>;
  getChallenges(): Promise<Challenge[]>;
}
```

---

## Code Organization

```
/lib/mo-connect
└── index.ts             → Domain exports (placeholder)

/lib/db
├── seed-*.ts            → MoLibrary exercise/program seeding
└── schema.ts            → Data models
```

---

## Related APIs

| Endpoint | System |
|----------|--------|
| `/api/exercises` | MoExercises |
| `/api/exercises/alternatives` | MoExercises |
| `/api/programs` | MoPrograms |

---

## Future Roadmap

### Phase 9: Device Integration
- MoWearables — Apple Watch, Garmin, WHOOP integration
- MoHealth — Apple Health, Google Fit sync

### Phase 10: Community Features
- MoChallenges — Weekly/monthly competitions
- MoLeaderboard — Friend rankings
- MoShare — Social workout sharing

### Phase 11: Educational Content
- MoLearn — Training education library
