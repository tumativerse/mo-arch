---
sidebar_position: 3
title: MoLearn
---

# MoLearn

> *"The Teacher"* — "I help you understand why"

**Status:** ❌ Future

MoLearn will provide educational content about training principles, form cues, and fitness concepts.

---

## Purpose

- Educate users on training principles
- Provide exercise form cues
- Explain programming concepts
- Answer common questions
- Support informed training decisions

---

## Content Types (Planned)

### Quick Tips
Short, actionable advice shown contextually:

```typescript
interface QuickTip {
  id: string;
  context: TipContext;       // When to show
  title: string;
  content: string;
  exerciseId?: string;       // If exercise-specific
}

type TipContext =
  | 'pre_workout'
  | 'post_workout'
  | 'exercise_start'
  | 'pr_achieved'
  | 'plateau_detected'
  | 'deload_week';
```

Example tips:
- "Warm up with 50% of your working weight for 10 reps"
- "Focus on the eccentric (lowering) phase for muscle growth"
- "Take your deload week seriously — recovery drives progress"

### Form Cues
Exercise-specific technique reminders:

```typescript
interface FormCue {
  exerciseId: string;
  phase: 'setup' | 'execution' | 'common_errors';
  cues: string[];
}

// Example
{
  exerciseId: 'barbell-bench-press',
  phase: 'setup',
  cues: [
    "Retract and depress shoulder blades",
    "Arch upper back, keep glutes on bench",
    "Grip slightly wider than shoulder width",
    "Unrack with arms locked"
  ]
}
```

### Articles
In-depth educational content:

```typescript
interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  readTimeMinutes: number;
  content: string;           // Markdown
  relatedExercises?: string[];
  publishedAt: Date;
}

type ArticleCategory =
  | 'training_principles'
  | 'nutrition_basics'
  | 'recovery'
  | 'exercise_technique'
  | 'programming'
  | 'mindset';
```

---

## Planned Content Topics

### Training Principles
- Progressive overload explained
- Understanding RPE and RIR
- Why rep ranges matter
- The role of volume in hypertrophy
- When to increase weight

### Recovery
- Sleep and muscle growth
- Signs of overtraining
- Active vs passive recovery
- The importance of deload weeks

### Nutrition Basics
- Protein requirements for muscle
- Pre and post workout nutrition
- Hydration for performance
- Supplements that actually work

### Exercise Technique
- Bench press setup mastery
- How to hip hinge properly
- Pull-up progressions
- Fixing squat form issues

---

## Content Delivery

### Contextual Tips
Show relevant tips at the right moment:

```
[Before heavy set]
💡 Tip: Brace your core by taking a deep breath
   and pushing your abs out against your belt.
```

### Exercise Info Modal
Accessible from exercise cards:

```
┌─────────────────────────────────────┐
│  Barbell Bench Press                │
│                                     │
│  [Setup] [Execution] [Tips] [Video] │
│                                     │
│  Setup Cues:                        │
│  • Retract shoulder blades          │
│  • Arch upper back                  │
│  • Grip slightly wider than         │
│    shoulder width                   │
│                                     │
│  [Read Full Guide →]                │
└─────────────────────────────────────┘
```

### Learning Hub
Dedicated section for articles:

```
/learn
├── /training-principles
├── /exercise-guides
├── /recovery
└── /nutrition
```

---

## Data Model

```typescript
interface LearningContent {
  articles: Article[];
  formCues: Map<string, FormCue>;
  quickTips: QuickTip[];
}

interface UserLearning {
  userId: string;
  articlesRead: string[];
  tipsViewed: string[];
  savedArticles: string[];
}
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/learn/articles` | GET | List articles |
| `/api/learn/articles/:id` | GET | Get article |
| `/api/learn/tips` | GET | Get contextual tips |
| `/api/learn/cues/:exerciseId` | GET | Get form cues |

---

## Content Strategy

1. **Start with cues** — Most immediate value during workouts
2. **Add contextual tips** — Low-effort, high-impact
3. **Build article library** — Comprehensive education
4. **Video integration** — Partner with content creators

---

## Implementation Tasks

- [ ] Design content management system
- [ ] Create form cues database
- [ ] Build contextual tip system
- [ ] Write core articles
- [ ] Create learning hub UI
- [ ] Add exercise video links
