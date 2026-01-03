---
sidebar_position: 4
title: Skills & Commands
description: Code generation and workflow automation
---

# Skills & Commands

Skills generate code following project patterns. Commands automate common workflows.

Both are invoked with `/` prefix.

---

## Skills

### `/component`

Generate React components following Mo patterns.

```bash
/component WorkoutTimer           # Basic component
/component ProgressPage --page    # Page component
/component ExerciseCard --with-api  # With API route
```

**Options:**
- `--page` - Create in `app/(app)/` as a page
- `--with-api` - Also generate matching API route

**Generated pattern:**
```tsx
'use client';

interface ComponentProps {
  // Props
}

export function Component({ ...props }: ComponentProps) {
  return (/* JSX */);
}
```

### `/api`

Generate API routes with auth and validation.

```bash
/api goals              # All methods
/api stats GET POST     # Specific methods
```

**Generated pattern:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/mo-self';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // ...
}
```

### `/test`

Generate tests for components or API routes.

```bash
/test components/WorkoutTimer.tsx
/test app/api/workout/route.ts
```

**Generated pattern:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('should render correctly', () => {});
  it('should handle user interaction', async () => {});
});
```

### `/drizzle`

Generate database schema changes.

```bash
/drizzle table goals userId:uuid name:text
/drizzle column exercises videoUrl:text
/drizzle relation goals exercises many
```

**Field types:** `text`, `int`, `bool`, `uuid`, `timestamp`, `decimal`, `json`

### `/readme`

Generate or update README.

```bash
/readme           # Full README
/readme setup     # Just setup section
/readme api       # Just API section
```

---

## Commands

### `/test`

Run tests and analyze results.

```bash
/test                      # All tests
/test workout              # Matching pattern
/test app/(app)/workout    # Specific file
```

**Output:** Pass/fail counts, failure analysis, suggested fixes.

### `/review`

Review code changes.

```bash
/review                    # Unstaged changes
/review staged             # Staged changes
/review app/api/workout    # Specific file
```

**Checks:** TypeScript, React patterns, security, performance, tests.

### `/build`

Full build verification pipeline.

```bash
/build
```

**Runs:** Lint → TypeScript → Tests → Build

### `/db-status`

Check database state.

```bash
/db-status
```

**Shows:** Schema sync status, table row counts, recommendations.

### `/research`

Research codebase or web.

```bash
/research how does exercise selection work
/research best practices for rest timers
```

**Returns:** Findings with file/URL sources, recommendations.

### `/docs`

Generate documentation.

```bash
/docs app/api/workout/route.ts   # API docs
/docs workout feature            # Feature docs
```

### `/changelog`

Generate changelog from commits.

```bash
/changelog            # Unreleased changes
/changelog 1.2.0      # Specific version
```

---

## Automatic Usage

Claude automatically follows skill patterns when:

| Task | Follows |
|------|---------|
| Creating components | `/component` patterns |
| Creating API routes | `/api` patterns |
| Writing tests | `/test` patterns |
| Modifying schema | `/drizzle` patterns |
