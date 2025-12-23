---
sidebar_position: 3
title: MoEducate
---

# MoEducate

> *"The Teacher"* — "I help you understand why"

**Status:** ❌ Future

MoEducate will provide training education, exercise tutorials, and knowledge content.

---

## Purpose

- Explain training concepts
- Provide exercise tutorials
- Answer "why" questions
- Build training knowledge
- Link to mo-docs content

---

## Content Categories

### Training Principles

| Topic | Description |
|-------|-------------|
| Progressive Overload | How to build strength over time |
| Recovery | Why rest is part of training |
| RPE | Understanding Rate of Perceived Exertion |
| Deload | Why and when to reduce training |
| Periodization | Planning training cycles |

### Exercise Education

| Topic | Description |
|-------|-------------|
| Movement Patterns | Push, pull, squat, hinge explained |
| Form Cues | Key points for each exercise |
| Common Mistakes | What to avoid |
| Variations | When to use different versions |
| Progressions | How to advance exercises |

### Nutrition Basics

| Topic | Description |
|-------|-------------|
| Protein | How much and why |
| Calories | Surplus, deficit, maintenance |
| Timing | Pre/post workout nutrition |
| Hydration | Water and performance |

---

## Content Model

```typescript
interface EducationArticle {
  id: string;
  slug: string;
  title: string;
  category: EducationCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Content
  summary: string;
  content: string;           // Markdown
  keyTakeaways: string[];

  // Media
  images: string[];
  videoUrl: string | null;

  // Metadata
  readTime: number;          // minutes
  relatedArticles: string[];
  relatedExercises: string[];

  createdAt: Date;
  updatedAt: Date;
}

interface ExerciseTutorial {
  exerciseId: string;
  exerciseName: string;

  // Instructions
  setup: string[];
  execution: string[];
  breathing: string;

  // Cues
  formCues: string[];
  commonMistakes: string[];
  safetyNotes: string[];

  // Media
  videoUrl: string | null;
  imageUrls: string[];
}
```

---

## Example Content

### Article: Understanding RPE

```markdown
# Understanding RPE (Rate of Perceived Exertion)

RPE is a simple way to measure how hard a set feels on a scale of 1-10.

## The Scale

| RPE | Description | Reps Left |
|-----|-------------|-----------|
| 6   | Light warmup | 4+ |
| 7   | Could do 3 more | 3 |
| 8   | Could do 2 more | 2 |
| 9   | Could do 1 more | 1 |
| 10  | Maximum effort | 0 |

## Why Use RPE?

1. **Auto-regulation** - Adjust weight based on daily readiness
2. **Consistency** - Same effort across different days
3. **Communication** - Describe intensity precisely

## How Mo Uses RPE

Mo tracks your RPE to:
- Detect fatigue trends
- Know when you're ready to progress
- Suggest appropriate weights

## Key Takeaways

- RPE 7-8 is ideal for most working sets
- RPE 9-10 is for testing or special occasions
- If RPE trends up without weight increase, you're fatiguing
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/education/articles` | GET | List articles |
| `/api/education/articles/:slug` | GET | Get article |
| `/api/education/exercises/:id` | GET | Get exercise tutorial |
| `/api/education/search` | GET | Search content |

---

## Integration with mo-docs

MoEducate will pull content from the mo-docs knowledge base:

- Exercise descriptions from exercise library
- Nutrition info from nutrition guides
- Training concepts from playbook section

---

## Implementation Tasks

- [ ] Design content structure
- [ ] Migrate relevant mo-docs content
- [ ] Build article reading UI
- [ ] Create exercise tutorial pages
- [ ] Add search functionality
- [ ] Link education to workout context
