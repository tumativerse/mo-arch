---
sidebar_position: 5
title: Rules & Hooks
description: Auto-applied coding standards and formatting
---

# Rules & Hooks

Rules enforce coding standards automatically. Hooks run on file changes.

---

## Rules

Rules are applied automatically based on file path patterns.

### TypeScript Rule

**Files:** `*.ts`, `*.tsx`

| Guideline | Details |
|-----------|---------|
| No `any` | Use `unknown` if type is truly unknown |
| Strict types | Create interfaces for API responses |
| Naming | PascalCase for types/interfaces |
| Imports | Use `@/` path alias, group by type |

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
}

// Bad
const data: any = fetchData();
```

### React Rule

**Files:** `*.tsx`, `components/**`

| Guideline | Details |
|-----------|---------|
| Functional only | No class components |
| One per file | Name file same as component |
| Hooks at top | Include all useEffect dependencies |
| Accessibility | Use semantic HTML, aria-labels |

```tsx
// Good
export function WorkoutCard({ workout }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  // ...
}

// Bad
export class WorkoutCard extends React.Component {}
```

### API Rule

**Files:** `app/api/**/*.ts`

| Guideline | Details |
|-----------|---------|
| Auth first | Always call `getCurrentUser()` |
| Validate | Use Zod for request bodies |
| Error format | Return `{ error, details? }` |
| Status codes | Use proper HTTP codes |

```typescript
// Required pattern
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({
      error: 'Invalid data',
      details: parsed.error.flatten()
    }, { status: 400 });
  }
  // ...
}
```

### Testing Rule

**Files:** `*.test.ts`, `*.test.tsx`, `*.spec.ts`

| Guideline | Details |
|-----------|---------|
| Query by role | Not by test-id |
| userEvent | Not fireEvent |
| Async | Use `findBy*` for async content |
| Mock resets | Reset mocks in `beforeEach` |

```typescript
// Good
await user.click(screen.getByRole('button', { name: /submit/i }));
await screen.findByText(/success/i);

// Bad
fireEvent.click(screen.getByTestId('submit-btn'));
```

---

## Hooks

Hooks run automatically after file operations.

### ESLint Hook

**Trigger:** Edit or Write `.ts`, `.tsx`, `.js`, `.jsx`

**Action:** Runs `eslint --fix` to auto-fix issues.

### Prettier Hook

**Trigger:** Edit or Write `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`

**Action:** Runs `prettier --write` to format code.

---

## Configuration

### Rules Location

```
.claude/rules/
├── typescript.md
├── react.md
├── api.md
└── testing.md
```

Each rule file has a frontmatter specifying which paths it applies to:

```markdown
---
paths: "**/*.ts,**/*.tsx"
---

# TypeScript Rules
...
```

### Hooks Location

Hooks are defined in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint --fix \"$FILE\"",
            "timeout": 10000
          }
        ]
      }
    ]
  }
}
```
