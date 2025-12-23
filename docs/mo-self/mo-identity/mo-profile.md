---
sidebar_position: 2
title: MoProfile
---

# MoProfile

> *"The Record"* — "I know your story"

**Status:** ✅ Built

MoProfile stores and manages user profile information including fitness level, body metrics, and basic preferences.

---

## Purpose

- Store user profile data
- Track fitness level and experience
- Manage body metrics (height, weight goal)
- Provide context for personalized recommendations

---

## Implementation

### Code Location

```
/lib/db/schema.ts (users table extended fields)
```

### Database Fields

The user profile extends the base users table:

```typescript
// Profile fields on users table
height: number | null;          // in cm or inches
weightGoal: number | null;      // target weight
fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
experienceYears: number | null;
```

---

## Data Model

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;

  // Fitness profile
  height: number | null;
  weightGoal: number | null;
  fitnessLevel: FitnessLevel;
  experienceYears: number | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
```

---

## API Endpoints

### GET /api/user/profile

Returns the current user's profile.

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "height": 180,
  "weightGoal": 80,
  "fitnessLevel": "intermediate",
  "experienceYears": 3
}
```

### PATCH /api/user/profile

Updates profile fields.

```json
{
  "height": 180,
  "weightGoal": 75,
  "fitnessLevel": "intermediate"
}
```

---

## Integration Points

### Provides to:
- MoCoach (fitness level for recommendations)
- MoSuggest (experience-based weight suggestions)
- Dashboard (profile display)

### Receives from:
- MoAuth (user identity)
- Onboarding flow (initial setup)

---

## Future Enhancements

- [ ] Profile completion percentage
- [ ] Fitness assessment quiz
- [ ] Profile photo upload
- [ ] Bio/about section
