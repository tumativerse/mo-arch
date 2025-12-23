---
sidebar_position: 1
title: MoInsight
---

# MoInsight

> *"I find meaning in your data"*

MoInsight analyzes training data to find trends, patterns, and actionable insights.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoTrends](./mo-trends) | *"The Pattern Finder"* | ⚠️ Partial | Long-term trend analysis |
| [MoReports](./mo-reports) | *"The Summarizer"* | ❌ Future | Progress reports |
| [MoPatterns](./mo-patterns) | *"The Detective"* | ❌ Future | Behavioral patterns |

---

## Vertical Interface

```typescript
interface MoInsightInterface {
  // Trends
  getExerciseTrend(userId: string, exerciseId: string, days: number): Promise<ExerciseTrend>;
  getOverallTrends(userId: string, days: number): Promise<OverallTrends>;

  // Reports (future)
  generateWeeklyReport(userId: string): Promise<WeeklyReport>;
  generateMonthlyReport(userId: string): Promise<MonthlyReport>;

  // Patterns (future)
  detectPatterns(userId: string): Promise<PatternInsight[]>;
  getPredictions(userId: string): Promise<Prediction[]>;
}
```

---

## Data Sources

MoInsight pulls from:

| Source | Data |
|--------|------|
| MoStrength | Set logs, RPE, volume |
| MoRecover | Sleep, energy, soreness |
| MoBody | Weight trends |
| MoSession | Session frequency, duration |
