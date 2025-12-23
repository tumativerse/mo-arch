---
sidebar_position: 1
title: MoSettings
---

# MoSettings

> *"The Customizer"* — "I remember how you like things"

**Status:** ✅ Built

MoSettings manages user training preferences including equipment level, units, session duration targets, and warmup settings.

---

## Purpose

- Store training preferences
- Configure equipment availability
- Set preferred units (lbs/kg)
- Define session duration targets
- Control warmup behavior
- Enable/disable auto-progression

---

## Implementation

### Code Location

```
/lib/mo-self/preferences/settings.ts
```

### Key Functions

```typescript
// Get user preferences (creates defaults if none exist)
export async function getPreferences(userId: string): Promise<UserPreferences>

// Update preferences
export async function updatePreferences(
  userId: string,
  updates: UpdatePreferencesInput
): Promise<UserPreferences>

// Get equipment level shorthand
export async function getEquipmentLevel(userId: string): Promise<EquipmentLevel>
```

### Usage

```typescript
import { getPreferences, updatePreferences } from '@/lib/mo-self';

// Get preferences
const prefs = await getPreferences(userId);

// Update preferences
await updatePreferences(userId, {
  equipmentLevel: 'home_gym',
  preferredUnits: 'kg',
  sessionDurationTarget: 60
});
```

---

## Data Model

```typescript
interface UserPreferences {
  id: string;
  userId: string;

  // Equipment
  equipmentLevel: EquipmentLevel;

  // Units
  preferredUnits: 'lbs' | 'kg';

  // Session
  sessionDurationTarget: number;  // minutes
  restTimerEnabled: boolean;

  // Warmup
  warmupEnabled: boolean;
  warmupDuration: number;         // minutes

  // Progression
  autoProgressionEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

type EquipmentLevel = 'full_gym' | 'home_gym' | 'bodyweight';
```

### Database Table

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  equipment_level equipment_level DEFAULT 'full_gym',
  preferred_units VARCHAR(10) DEFAULT 'lbs',
  session_duration_target INTEGER DEFAULT 60,
  rest_timer_enabled BOOLEAN DEFAULT true,
  warmup_enabled BOOLEAN DEFAULT true,
  warmup_duration INTEGER DEFAULT 10,
  auto_progression_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### GET /api/preferences

Returns user preferences.

```json
{
  "equipmentLevel": "full_gym",
  "preferredUnits": "lbs",
  "sessionDurationTarget": 60,
  "restTimerEnabled": true,
  "warmupEnabled": true,
  "warmupDuration": 10,
  "autoProgressionEnabled": true
}
```

### PATCH /api/preferences

Updates preferences.

```json
{
  "equipmentLevel": "home_gym",
  "preferredUnits": "kg"
}
```

---

## Equipment Levels

| Level | Description | Example Equipment |
|-------|-------------|-------------------|
| `full_gym` | Commercial gym | All machines, cables, barbells |
| `home_gym` | Home setup | Barbell, dumbbells, bench, rack |
| `bodyweight` | No equipment | Bodyweight exercises only |

Equipment level affects exercise suggestions in MoSuggest.

---

## Integration Points

### Provides to:
- MoSuggest (equipment filtering)
- MoWarmup (warmup settings)
- Workout UI (rest timer, units)
- MoProgress (auto-progression flag)

### Receives from:
- Settings UI
- Onboarding flow

---

## Default Values

New users get these defaults:

| Setting | Default |
|---------|---------|
| equipmentLevel | `full_gym` |
| preferredUnits | `lbs` |
| sessionDurationTarget | 60 |
| restTimerEnabled | true |
| warmupEnabled | true |
| warmupDuration | 10 |
| autoProgressionEnabled | true |
