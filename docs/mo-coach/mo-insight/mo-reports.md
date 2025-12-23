---
sidebar_position: 2
title: MoReports
---

# MoReports

> *"The Summarizer"* — "I tell your story in numbers"

**Status:** ❌ Future

MoReports will generate periodic progress reports summarizing training, recovery, and body metrics.

---

## Purpose

- Generate weekly/monthly summaries
- Highlight key achievements
- Identify areas for improvement
- Track goal progress
- Provide shareable reports

---

## Report Types

### Weekly Report

```typescript
interface WeeklyReport {
  period: { start: Date; end: Date };

  // Training summary
  training: {
    sessionsCompleted: number;
    totalVolume: number;
    avgSessionDuration: number;
    avgRPE: number;
    muscleDistribution: MuscleVolume[];
  };

  // Achievements
  achievements: {
    newPRs: PersonalRecord[];
    streakDays: number;
    badgesEarned: Badge[];
  };

  // Recovery
  recovery: {
    avgSleep: number;
    avgEnergy: number;
    avgSoreness: number;
    fatigueRange: { min: number; max: number };
  };

  // Body
  body: {
    weightChange: number;
    measurementChanges: MeasurementChange[];
  };

  // Recommendations
  recommendations: string[];
}
```

### Monthly Report

Includes weekly data plus:

```typescript
interface MonthlyReport extends WeeklyReport {
  // Trends
  strengthProgress: ExerciseTrend[];
  volumeProgression: WeeklyVolume[];
  consistencyScore: number;

  // Comparisons
  vsLastMonth: {
    volumeChange: number;
    strengthChange: number;
    bodyChange: number;
  };

  // Goals
  goalProgress: GoalProgress[];
}
```

---

## Report Sections

### 1. Training Overview

```
This Week:
- 4 sessions completed (vs 3 last week)
- 45,000 lbs total volume (+12%)
- Average session: 62 minutes
- Average RPE: 7.2 (optimal range)
```

### 2. Strength Highlights

```
PRs This Week:
🏆 Bench Press: 225 x 5 (new estimated 1RM: 253 lbs)
🏆 Squat: 275 x 3 (new estimated 1RM: 292 lbs)

Ready to Progress:
- Overhead Press: Hit 8 reps at RPE 7 for 3 sessions
- Barbell Row: Consider adding 5 lbs next session
```

### 3. Recovery Summary

```
Recovery Score: 78/100 (Good)

Sleep: 7.2 hrs avg (target: 7+) ✓
Energy: 3.8 avg (stable)
Soreness: 2.1 avg (low) ✓

💡 Tip: Energy dipped mid-week. Consider earlier bedtime.
```

### 4. Recommendations

```
Next Week Focus:
1. Ready to increase bench press weight
2. Consider deload if fatigue stays elevated
3. Legs volume was low - add extra quad work
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/weekly` | GET | Generate weekly report |
| `/api/reports/monthly` | GET | Generate monthly report |
| `/api/reports/custom` | POST | Custom date range report |

---

## Delivery Options

- In-app report view
- Email digest (MoAlerts)
- PDF export
- Shareable link

---

## Implementation Tasks

- [ ] Design report generation logic
- [ ] Build report UI components
- [ ] Create email templates
- [ ] Add PDF generation
- [ ] Schedule automated reports
- [ ] Build shareable report pages
