---
sidebar_position: 1
title: "MO:SELF"
---

# MO:SELF - Foundation Domain

> *"The Memory"* — "I remember everything about you"

MO:SELF is the foundation layer that stores user identity, preferences, and history. All other domains reference MO:SELF to understand context.

---

## Verticals

| Vertical | Purpose | Systems | Status |
|----------|---------|---------|--------|
| [MoIdentity](./mo-identity/) | User authentication & profile | 3 | 2/3 built |
| [MoPrefs](./mo-prefs/) | User preferences & settings | 3 | 2/3 built |
| [MoHistory](./mo-history/) | Records, streaks, achievements | 3 | 2/3 built |

---

## Domain Data Model

```typescript
interface MoSelfContext {
  identity: {
    userId: string;
    profile: UserProfile;
    goals: UserGoals;
  };
  preferences: {
    equipment: EquipmentLevel;
    settings: AppSettings;
  };
  history: {
    records: PersonalRecord[];
    streaks: StreakData;
    achievements: Achievement[];
  };
}
```

---

## Domain Interface

```typescript
interface MoSelfInterface {
  // Get user context
  getContext(): Promise<MoSelfContext>;

  // Profile
  getProfile(): Promise<UserProfile>;
  updateProfile(data: Partial<UserProfile>): Promise<void>;

  // Preferences
  getPreferences(): Promise<UserPreferences>;
  getEquipment(): Promise<EquipmentLevel>;

  // History
  getPersonalRecords(exerciseId?: string): Promise<PersonalRecord[]>;
  getStreak(): Promise<StreakData>;
}
```

---

## Code Organization

```
/lib/mo-self
├── /identity
│   └── auth.ts              → MoAuth
├── /preferences
│   └── settings.ts          → MoSettings
├── /history
│   ├── streaks.ts           → MoStreaks
│   └── records.ts           → MoRecords
└── index.ts                 → Domain exports
```

### Import Pattern

```typescript
import {
  getCurrentUser,      // MoAuth
  getPreferences,      // MoSettings
  getStreak,           // MoStreaks
  checkAndRecordPR     // MoRecords
} from '@/lib/mo-self';
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/preferences` | GET/PATCH | MoSettings |
| `/api/streaks` | GET | MoStreaks |
| `/api/records` | GET | MoRecords |

---

## Status

| Metric | Value |
|--------|-------|
| Verticals | 3/3 |
| Systems Built | 6/9 (67%) |
| API Endpoints | 3 |
