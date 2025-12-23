---
sidebar_position: 2
title: MoMacros
---

# MoMacros

> *"The Nutrient Counter"* — "I balance your fuel"

**Status:** ❌ Future

MoMacros will track macronutrients and provide targets based on goals.

---

## Purpose

- Calculate daily macro needs
- Track macro intake vs targets
- Adjust macros based on goals
- Visualize macro distribution

---

## Macro Targets

### Based on Goals

| Goal | Protein | Carbs | Fat |
|------|---------|-------|-----|
| Build Muscle | 1g/lb | 2g/lb | 0.4g/lb |
| Lose Fat | 1.2g/lb | 1g/lb | 0.3g/lb |
| Maintain | 0.8g/lb | 1.5g/lb | 0.35g/lb |
| Performance | 0.8g/lb | 2.5g/lb | 0.4g/lb |

### Calculation

```typescript
interface MacroTargets {
  calories: number;
  protein: number;      // grams
  carbs: number;        // grams
  fat: number;          // grams
  fiber: number;        // grams

  // Percentages
  proteinPercent: number;
  carbPercent: number;
  fatPercent: number;
}

function calculateMacros(
  weight: number,
  goal: FitnessGoal,
  activityLevel: ActivityLevel
): MacroTargets {
  // TDEE calculation
  const bmr = calculateBMR(weight, height, age, sex);
  const tdee = bmr * activityMultiplier[activityLevel];

  // Adjust for goal
  const calories = goal === 'build_muscle' ? tdee + 300
                 : goal === 'lose_fat' ? tdee - 500
                 : tdee;

  // Set protein (most important)
  const protein = weight * proteinMultiplier[goal];

  // Remaining calories for carbs/fat
  const proteinCals = protein * 4;
  const remainingCals = calories - proteinCals;

  // Split remaining between carbs and fat
  const fat = weight * fatMultiplier[goal];
  const fatCals = fat * 9;
  const carbs = (remainingCals - fatCals) / 4;

  return { calories, protein, carbs, fat };
}
```

---

## Data Model

```typescript
interface DailyMacros {
  date: Date;
  userId: string;

  // Targets
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;

  // Actual (from meals)
  actualCalories: number;
  actualProtein: number;
  actualCarbs: number;
  actualFat: number;

  // Progress
  caloriePercent: number;
  proteinPercent: number;
  carbPercent: number;
  fatPercent: number;
}
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/macros/targets` | GET | Get macro targets |
| `/api/macros/targets` | PUT | Set custom targets |
| `/api/macros/daily` | GET | Get daily summary |
| `/api/macros/calculate` | POST | Calculate recommended |

---

## Visualization

- Daily progress bars
- Weekly average charts
- Macro distribution pie chart
- Calorie trend over time

---

## Implementation Tasks

- [ ] Build macro calculator
- [ ] Create targets storage
- [ ] Aggregate from meal logs
- [ ] Build macro dashboard
- [ ] Add goal-based recommendations
