---
sidebar_position: 2
title: MoBody
---

# MoBody

> *"I watch your transformation"*

MoBody tracks body metrics — weight, measurements, and body composition.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoWeight](./mo-weight) | *"The Scale"* | ✅ Built | Daily weight tracking |
| [MoMeasure](./mo-measure) | *"The Tape"* | ❌ Future | Body measurements |
| [MoComposition](./mo-composition) | *"The Analyzer"* | ❌ Future | Body fat, muscle mass |

---

## Vertical Interface

```typescript
interface MoBodyInterface {
  // Weight
  logWeight(userId: string, weight: number, unit?: string): Promise<WeightEntry>;
  getWeightHistory(userId: string, days: number): Promise<WeightEntry[]>;
  getWeightTrend(userId: string): Promise<WeightTrend>;

  // Measurements (future)
  logMeasurements(userId: string, data: MeasurementData): Promise<Measurement>;
  getMeasurementHistory(userId: string): Promise<Measurement[]>;

  // Composition (future)
  logComposition(userId: string, data: CompositionData): Promise<Composition>;
  getCompositionHistory(userId: string): Promise<Composition[]>;
}
```

---

## API Endpoints

| Endpoint | Method | System |
|----------|--------|--------|
| `/api/weight` | GET | MoWeight |
| `/api/weight` | POST | MoWeight |
