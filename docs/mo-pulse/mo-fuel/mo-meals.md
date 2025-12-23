---
sidebar_position: 1
title: MoMeals
---

# MoMeals

> *"The Food Log"* — "I remember what you ate"

**Status:** ❌ Future

MoMeals will handle meal logging and food diary functionality.

---

## Purpose

- Log meals and snacks
- Search food database
- Scan barcodes
- Save favorite meals
- Track meal timing

---

## Data Model

```typescript
interface MealLog {
  id: string;
  userId: string;
  date: Date;
  mealType: MealType;
  time: string;              // "12:30"

  foods: FoodItem[];

  // Totals
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;

  notes: string | null;
  createdAt: Date;
}

interface FoodItem {
  id: string;
  foodId: string;            // Reference to food database
  name: string;
  servingSize: number;
  servingUnit: string;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
}

type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'pre_workout'
  | 'post_workout';
```

---

## Features

### Quick Add Methods

| Method | Use Case |
|--------|----------|
| Search | Find food by name |
| Barcode | Scan packaged foods |
| Recent | Quick re-log recent foods |
| Favorites | Saved frequent meals |
| Recipes | Multi-ingredient meals |

### Food Database

Sources:
- USDA FoodData Central
- Open Food Facts
- User-submitted foods

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/meals` | GET | Get meals for date |
| `/api/meals` | POST | Log a meal |
| `/api/meals/:id` | PATCH | Update meal |
| `/api/meals/:id` | DELETE | Delete meal |
| `/api/foods/search` | GET | Search food database |
| `/api/foods/barcode/:code` | GET | Lookup by barcode |

---

## Implementation Tasks

- [ ] Design meals and food_items tables
- [ ] Integrate food database API
- [ ] Build meal logging UI
- [ ] Implement barcode scanner
- [ ] Create favorites/recent system
- [ ] Build recipe builder
