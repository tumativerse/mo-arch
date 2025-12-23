---
sidebar_position: 1
title: MoIdentity
---

# MoIdentity

> *"I know who you are"*

MoIdentity handles user authentication, profiles, and goals. It's the entry point for all user context in the Mo Universe.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoAuth](./mo-auth) | *"The Gatekeeper"* | ✅ Built | Authentication, user accounts |
| [MoProfile](./mo-profile) | *"The Record"* | ✅ Built | User profile, fitness level |
| [MoGoals](./mo-goals) | *"The Target"* | ⚠️ Partial | Training goals, targets |

---

## Data Flow

```
User Login → MoAuth → MoProfile → MoGoals
                ↓
         User Context available to all domains
```

---

## Vertical Interface

```typescript
interface MoIdentityInterface {
  // Authentication
  getCurrentUser(): Promise<User | null>;

  // Profile
  getProfile(): Promise<UserProfile>;
  updateProfile(data: Partial<UserProfile>): Promise<void>;

  // Goals
  getGoals(): Promise<UserGoals>;
  setGoals(goals: UserGoals): Promise<void>;
}
```
