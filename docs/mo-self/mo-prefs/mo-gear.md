---
sidebar_position: 2
title: MoGear
---

# MoGear

> *"The Inventory"* — "I know what tools you have"

**Status:** ✅ Built (via MoSettings)

MoGear tracks available equipment for the user. Currently implemented as part of MoSettings via the `equipmentLevel` field.

---

## Purpose

- Track available equipment
- Filter exercise suggestions based on equipment
- Enable gym-specific workout customization

---

## Current Implementation

MoGear is currently simplified as an `equipmentLevel` enum in MoSettings:

```typescript
type EquipmentLevel = 'full_gym' | 'home_gym' | 'bodyweight';
```

### Equipment by Level

| Level | Available Equipment |
|-------|---------------------|
| `full_gym` | Everything: barbells, dumbbells, machines, cables, racks |
| `home_gym` | Barbell, dumbbells, bench, squat rack, pull-up bar |
| `bodyweight` | No equipment (bodyweight exercises only) |

---

## Usage

```typescript
import { getPreferences } from '@/lib/mo-self';

const prefs = await getPreferences(userId);
const equipmentLevel = prefs.equipmentLevel;

// Use in exercise filtering
const exercises = await getExerciseAlternatives({
  pattern: 'horizontal_push',
  equipment: equipmentLevel
});
```

---

## Integration Points

### Provides to:
- `/api/exercises/alternatives` (equipment filtering)
- MoSuggest (exercise selection)
- Workout page (exercise swaps)

### Receives from:
- MoSettings (equipment level setting)
- Onboarding flow

---

## Future Enhancements

Full MoGear implementation would include:

### Detailed Equipment Tracking

```typescript
interface UserEquipment {
  userId: string;

  // Barbells
  hasStraightBar: boolean;
  hasEzBar: boolean;
  hasTrapBar: boolean;

  // Dumbbells
  hasDumbbells: boolean;
  dumbbellMaxWeight: number;

  // Machines
  machines: MachineType[];

  // Cardio
  cardioEquipment: CardioType[];

  // Other
  hasPullUpBar: boolean;
  hasDipStation: boolean;
  hasCables: boolean;
  hasResistanceBands: boolean;
}
```

### Implementation Tasks

- [ ] Create dedicated equipment table
- [ ] Build equipment selection UI
- [ ] Granular exercise filtering
- [ ] Gym profile presets (save equipment setups)
