---
sidebar_position: 1
title: MoAuth
---

# MoAuth

> *"The Gatekeeper"* — "I control who enters"

**Status:** ✅ Built

MoAuth handles all authentication and user account management using Clerk.

---

## Purpose

- Authenticate users via email/OAuth
- Manage user sessions
- Provide user context to all domains
- Sync Clerk user data with database

---

## Implementation

### Code Location

```
/lib/mo-self/identity/auth.ts
```

### Key Functions

```typescript
// Get current authenticated user
export async function getCurrentUser(): Promise<User | null>

// Sync Clerk user to database (called on first login)
export async function syncUser(clerkUser: ClerkUser): Promise<User>
```

### Usage

```typescript
import { getCurrentUser } from '@/lib/mo-self';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // User is authenticated
}
```

---

## Data Model

```typescript
interface User {
  id: string;           // Internal UUID
  clerkId: string;      // Clerk user ID
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| Clerk | Authentication provider |
| @clerk/nextjs | Next.js integration |

---

## Integration Points

### Provides to:
- All API routes (user context)
- MoProfile (user identity)
- MoPrefs (user preferences lookup)

### Receives from:
- Clerk webhooks (user sync)

---

## Configuration

Environment variables required:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

## Future Enhancements

- [ ] Role-based access control
- [ ] API key authentication for external integrations
- [ ] Session activity logging
