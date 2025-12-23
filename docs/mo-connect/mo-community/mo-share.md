---
sidebar_position: 1
title: MoShare
---

# MoShare

> *"The Broadcaster"* — "I let you celebrate wins"

**Status:** ❌ Future

MoShare will enable sharing workouts, PRs, and achievements with friends.

---

## Purpose

- Share workout summaries
- Announce PRs and milestones
- Create shareable workout cards
- Post to social media
- Build workout feed

---

## Shareable Content

### Workout Summary Card

```
┌────────────────────────────────────────┐
│  🏋️ Push A - Complete                  │
│                                        │
│  Duration: 62 min                      │
│  Volume: 12,450 lbs                    │
│  Sets: 18                              │
│  Avg RPE: 7.2                          │
│                                        │
│  ⭐ New PR: Bench Press 225×5          │
│                                        │
│  🔥 Streak: 7 days                     │
│                                        │
│           Shared via Mo               │
└────────────────────────────────────────┘
```

### PR Card

```
┌────────────────────────────────────────┐
│  🏆 NEW PERSONAL RECORD                │
│                                        │
│  Barbell Bench Press                   │
│  225 lbs × 5 reps                      │
│                                        │
│  Est. 1RM: 253 lbs                     │
│  +10 lbs from previous best            │
│                                        │
│           Achieved with Mo            │
└────────────────────────────────────────┘
```

---

## Data Model

```typescript
interface Share {
  id: string;
  userId: string;
  type: ShareType;
  contentId: string;         // Session ID or Record ID
  visibility: Visibility;

  // Generated content
  imageUrl: string;
  caption: string;

  // Engagement
  reactions: Reaction[];
  comments: Comment[];

  sharedAt: Date;
}

interface Reaction {
  userId: string;
  type: ReactionType;
  createdAt: Date;
}

type ShareType = 'workout' | 'pr' | 'streak' | 'badge' | 'challenge';
type Visibility = 'private' | 'friends' | 'public';
type ReactionType = 'fire' | 'strong' | 'respect' | 'inspired';
```

---

## Sharing Options

| Destination | Method |
|-------------|--------|
| Mo Feed | In-app sharing |
| Instagram | Story/Post image |
| Twitter/X | Tweet with image |
| Copy Link | Shareable URL |
| Save Image | Download card |

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/share` | POST | Create share |
| `/api/share/:id` | GET | Get share details |
| `/api/share/:id/react` | POST | Add reaction |
| `/api/feed` | GET | Get activity feed |

---

## Implementation Tasks

- [ ] Design share card templates
- [ ] Build card image generation
- [ ] Create sharing UI
- [ ] Integrate social media APIs
- [ ] Build activity feed
- [ ] Add reactions system
