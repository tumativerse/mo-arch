---
sidebar_position: 2
title: "MO:SELF"
---

# MO:SELF - Foundation Domain

> *"The Memory"* — "I remember everything about you"

MO:SELF is the foundation layer that stores user identity, preferences, and history. All other domains reference MO:SELF to understand context.

---

## Verticals & Systems

### MoIdentity — *"I know who you are"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoAuth | *"The Gatekeeper"* | Authentication, user accounts | ✅ Built |
| MoProfile | *"The Record"* | User profile, fitness level, goals | ✅ Built |
| MoGoals | *"The Target"* | Training goals, target metrics | ⚠️ Partial |

### MoPrefs — *"I know what you like"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoSettings | *"The Customizer"* | Training prefs, equipment level, units, warmup settings | ✅ Built |
| MoGear | *"The Inventory"* | Available equipment, gym setup | ✅ Built |
| MoAlerts | *"The Notifier"* | Notification preferences, reminders | ❌ Future |

### MoHistory — *"I remember your journey"*

| System | Name | Description | Status |
|--------|------|-------------|--------|
| MoRecords | *"The Historian"* | Personal records with auto-detection, estimated 1RM | ✅ Built |
| MoBadges | *"The Trophy Case"* | Achievements, milestones, badges | ❌ Future |
| MoStreaks | *"The Motivator"* | Workout streaks (48hr window), auto-update on completion | ✅ Built |

---

## Data Model

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

## Interface

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
│   └── auth.ts          → MoAuth - Authentication
├── /preferences
│   └── settings.ts      → MoSettings - User preferences
├── /history
│   ├── streaks.ts       → MoStreaks - Workout streaks
│   └── records.ts       → MoRecords - Personal records
└── index.ts             → Domain exports
```

### Import Pattern

```typescript
import { getCurrentUser, getPreferences, getStreak } from '@/lib/mo-self';
```

---

## Related APIs

| Endpoint | System |
|----------|--------|
| `/api/streaks` | MoStreaks |
| `/api/records` | MoRecords |
| `/api/preferences` | MoSettings |
