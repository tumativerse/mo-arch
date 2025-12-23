---
sidebar_position: 2
title: MoAdvice
---

# MoAdvice

> *"The Counselor"* — "I guide your decisions"

**Status:** ⚠️ Partial (recommendations in existing systems)

MoAdvice provides contextual recommendations throughout the app.

---

## Purpose

- Provide actionable recommendations
- Surface insights at the right time
- Guide training decisions
- Explain the "why" behind suggestions

---

## Current Implementation

Advice is embedded in various systems:

| Location | Type of Advice |
|----------|---------------|
| MoFatigue | Recovery recommendations |
| MoProgress | Progression suggestions |
| MoDeload | Deload guidance |
| MoSuggest | Weight recommendations |

### Example from MoFatigue

```json
{
  "fatigue": {
    "score": 6,
    "recommendations": [
      "Consider taking a rest day tomorrow",
      "Focus on sleep - aim for 8 hours tonight",
      "If training, reduce volume by 20%"
    ]
  }
}
```

---

## Planned Enhancements

### Daily Tips

```typescript
interface DailyTip {
  id: string;
  category: TipCategory;
  title: string;
  content: string;
  relevance: string;      // Why this tip, now
  actionable: boolean;
  action?: {
    text: string;
    link: string;
  };
}

type TipCategory =
  | 'training'
  | 'recovery'
  | 'nutrition'
  | 'mindset'
  | 'technique';
```

### Contextual Triggers

| Trigger | Advice |
|---------|--------|
| High fatigue | "Consider a lighter session" |
| Plateau detected | "Try these 3 strategies..." |
| Streak milestone | "Congrats! Here's how to maintain..." |
| Poor sleep streak | "Sleep tips for better recovery" |
| New exercise | "Form cues for [exercise]" |

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/advice/daily` | GET | Get daily tip |
| `/api/advice/contextual` | GET | Get context-specific advice |
| `/api/advice/dismiss` | POST | Dismiss advice |

---

## Integration Points

### Will Receive from:
- MoFatigue (fatigue status)
- MoProgress (plateau detection)
- MoStreaks (streak milestones)
- MoRecover (recovery patterns)

### Will Provide to:
- Dashboard (tip card)
- Workout page (inline tips)
- Push notifications (via MoAlerts)

---

## Implementation Tasks

- [ ] Create advice content library
- [ ] Build context-based tip selection
- [ ] Add tip dismissal/seen tracking
- [ ] Create inline advice components
- [ ] Integrate with notifications
