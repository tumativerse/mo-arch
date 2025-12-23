---
sidebar_position: 4
title: MoFuel
---

# MoFuel

> *"I track what powers you"*

MoFuel will track nutrition — meals, macros, and hydration.

**Status:** ❌ Future (all systems planned)

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoMeals](./mo-meals) | *"The Food Log"* | ❌ Future | Meal logging |
| [MoMacros](./mo-macros) | *"The Nutrient Counter"* | ❌ Future | Macro tracking |
| [MoHydration](./mo-hydration) | *"The Water Tracker"* | ❌ Future | Water intake |

---

## Why Nutrition Matters

| Goal | Nutrition Focus |
|------|-----------------|
| Build muscle | Calorie surplus, high protein |
| Lose fat | Calorie deficit, maintain protein |
| Performance | Adequate carbs, timing |
| Recovery | Protein timing, micronutrients |

---

## Planned Features

### Quick Logging
- Barcode scanner
- Recent/favorite meals
- Restaurant database
- Recipe builder

### Smart Suggestions
- Protein targets based on goals
- Pre/post workout nutrition
- Hydration reminders

### Integration
- Sync with MyFitnessPal
- Import from Apple Health
- Recipe websites

---

## Vertical Interface (Planned)

```typescript
interface MoFuelInterface {
  // Meals
  logMeal(userId: string, meal: MealInput): Promise<MealLog>;
  getMeals(userId: string, date: Date): Promise<MealLog[]>;

  // Macros
  getDailyMacros(userId: string, date: Date): Promise<DailyMacros>;
  getMacroTargets(userId: string): Promise<MacroTargets>;

  // Hydration
  logWater(userId: string, amount: number): Promise<HydrationLog>;
  getDailyHydration(userId: string, date: Date): Promise<HydrationLog>;
}
```

---

## Implementation Priority

MoFuel is lower priority than training features, but will be important for:

1. Users with specific body composition goals
2. Cutting phases
3. Performance optimization
4. Long-term health tracking

Target: Phase 11+
