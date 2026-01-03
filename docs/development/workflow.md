---
sidebar_position: 1
title: Development Workflow
description: Two-phase testing workflow for building features
---

# Development Workflow

Standard workflow for building features in the Mo app with two-phase testing approach.

---

## Workflow Overview

```
1. Research
2. Plan Architecture (if complex)
3. Write Behavior Tests (Phase 1) ← Define expected behavior
4. Build ← Implement to pass tests
5. Write Implementation Tests (Phase 2) ← Verify details
6. Review
7. Verify
8. Document
9. Commit
```

---

## Phase 1 vs Phase 2 Testing

### Why Two Phases?

| Phase | When | Purpose | Example |
|-------|------|---------|---------|
| **Phase 1** | Before building | Define expected behavior | User can complete workout |
| **Phase 2** | After building | Verify implementation | API correctly calculates volume |

**Phase 1 (Behavior Tests):**
- Written **before** implementation
- Defines user requirements
- Tests will **fail initially** (expected)
- Acts as acceptance criteria

**Phase 2 (Implementation Tests):**
- Written **after** implementation
- Tests internal logic
- Verifies edge cases
- Ensures code coverage

---

## Detailed Steps

### 1. Research

**Goal:** Understand what exists and what's needed.

**Tasks:**
- [ ] Explore existing codebase for similar patterns
- [ ] Identify files that need changes
- [ ] Research dependencies or libraries needed
- [ ] Check for existing solutions/components
- [ ] Read project context (CLAUDE.md, MEMORY.md)

**Tools:**
- Explore agent for codebase exploration
- researcher agent for web/docs research
- Glob/Grep for finding files

**Duration:** 5-30 min depending on complexity

---

### 2. Plan Architecture

**Goal:** Design the solution before coding.

**When to do this:**
- ✅ Complex features (multiple files)
- ✅ New system components
- ✅ Database schema changes
- ✅ Major refactoring
- ❌ Simple bug fixes
- ❌ One-file changes

**Tasks:**
- [ ] Design component/module structure
- [ ] Identify all files to create/modify
- [ ] Plan data flow and API contracts
- [ ] Consider edge cases and error handling
- [ ] Get user approval for complex changes

**Tools:**
- Plan agent for complex features
- Use Opus model for architectural decisions

**Deliverable:** Implementation plan with file list

---

### 3. Write Behavior Tests (Phase 1)

**Goal:** Define expected behavior before building.

**Test Types:**
- User workflow tests (E2E scenarios)
- API contract tests (request/response)
- Component behavior tests (user interactions)

**Example - API Test:**
```typescript
// tests/api/workout.behavior.test.ts
describe('Workout API - User Behavior', () => {
  it('should allow user to start a workout', async () => {
    const response = await POST('/api/ppl/session', {
      templateDayId: 'push-a',
      exercises: [...]
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('session');
    expect(response.body.session.status).toBe('in_progress');
  });

  it('should reject workout without exercises', async () => {
    const response = await POST('/api/ppl/session', {
      templateDayId: 'push-a',
      exercises: []
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('exercises');
  });

  it('should prevent duplicate active sessions', async () => {
    await POST('/api/ppl/session', { ... }); // First session

    const response = await POST('/api/ppl/session', { ... }); // Duplicate

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('active session');
  });
});
```

**Example - Component Test:**
```typescript
// tests/components/workout-page.behavior.test.tsx
describe('Workout Page - User Behavior', () => {
  it('should display today\'s workout template', async () => {
    render(<WorkoutPage />);

    await waitFor(() => {
      expect(screen.getByText('Push Day A')).toBeInTheDocument();
    });
  });

  it('should allow user to start workout', async () => {
    const user = userEvent.setup();
    render(<WorkoutPage />);

    const startButton = await screen.findByRole('button', { name: /start workout/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/exercise 1 of/i)).toBeInTheDocument();
    });
  });

  it('should show error if API fails', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'));
    render(<WorkoutPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
```

**Important:**
- ✅ Tests will **fail** at this stage - that's expected
- ✅ Focus on **what** should happen, not **how**
- ✅ Write tests for happy paths AND error cases
- ❌ Don't test implementation details yet

**Deliverable:** Failing tests that define requirements

---

### 4. Build

**Goal:** Implement to make Phase 1 tests pass.

**TDD Loop:**
```
1. Run Phase 1 test → RED (fails)
2. Write minimal code to pass
3. Run test again → GREEN (passes)
4. Refactor if needed
5. Move to next test
```

**Patterns to follow:**
- Components: Follow React patterns in `.claude/rules/react.md`
- API routes: Follow API patterns in `.claude/rules/api.md`
- TypeScript: No `any`, proper types

**Auto-applied:**
- ESLint fixes (via hooks)
- Prettier formatting (via hooks)
- Type checking (TypeScript compiler)

**Model:** Use Sonnet for implementation

**Implementation is done when:** All Phase 1 tests pass

---

### 5. Write Implementation Tests (Phase 2)

**Goal:** Verify implementation details and edge cases.

**Test Types:**
- **Unit tests:** Pure functions, utilities, helpers
- **Integration tests:** API + database interactions
- **Component tests:** Rendering, state management
- **E2E tests:** Full user flows (optional)

**Example - Unit Test:**
```typescript
// tests/lib/fatigue.test.ts
describe('calculateFatigue', () => {
  it('should calculate fatigue score from factors', () => {
    const score = calculateFatigue({
      volumeLoad: 0.8,
      intensityFactor: 0.9,
      frequency: 6,
      recovery: { sleep: 7, energy: 3 }
    });

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(10);
  });

  it('should return 0 for no training load', () => {
    const score = calculateFatigue({
      volumeLoad: 0,
      intensityFactor: 0,
      frequency: 0,
      recovery: { sleep: 8, energy: 5 }
    });

    expect(score).toBe(0);
  });
});
```

**Example - Integration Test:**
```typescript
// tests/api/progression.integration.test.ts
describe('Progression API Integration', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await seedTestData();
  });

  it('should calculate fatigue from real sessions', async () => {
    const response = await GET('/api/progression?days=14');

    expect(response.status).toBe(200);
    expect(response.body.fatigueScore).toBeGreaterThan(0);
    expect(response.body.fatigueHistory).toHaveLength(14);
  });

  it('should return ready-to-progress exercises', async () => {
    // Create sessions with consistent progress
    await createProgressingSessions('bench-press', 5);

    const response = await GET('/api/progression');

    expect(response.body.readyToProgress).toContainEqual(
      expect.objectContaining({ exerciseName: 'Bench Press' })
    );
  });
});
```

**Coverage Goals:**
- ✅ 80%+ line coverage
- ✅ All edge cases covered
- ✅ Error paths tested
- ✅ Happy paths verified

**Tools:**
- `/test` command to run tests
- test-runner agent for analysis
- Coverage reports in CI

---

### 6. Review

**Goal:** Ensure code quality.

**Checklist:**
- [ ] No TypeScript `any` types
- [ ] Proper error handling
- [ ] Auth checks in API routes
- [ ] Zod validation for API inputs
- [ ] Accessible UI (semantic HTML, ARIA labels)
- [ ] No security vulnerabilities
- [ ] Follows project patterns

**Tools:**
- code-reviewer agent
- `/review` command
- ui-improver agent (for UI)
- performance-analyzer agent (if critical)

---

### 7. Verify

**Goal:** Confirm everything builds and works.

**Tasks:**
- [ ] Run full build pipeline: `/build`
- [ ] Fix any lint/type/test errors
- [ ] Manual testing in browser
- [ ] Test on mobile (if UI changes)
- [ ] Check console for errors

**Command:**
```bash
/build  # Runs: lint → typecheck → test → build
```

---

### 8. Document

**Goal:** Capture knowledge for future.

**What to document:**

| Type | When | Where |
|------|------|-------|
| Inline comments | Complex logic | Code files |
| JSDoc | Public APIs | Code files |
| Architecture decisions | Major changes | mo-arch/docs/architecture |
| API docs | New endpoints | mo-arch/docs/api |
| Feature docs | New features | mo-arch/docs/features |

**Tools:**
- doc-writer agent for extensive docs
- `/docs` command

---

### 9. Commit

**Goal:** Version control and create PR.

**Commit Message Format:**
```
<type>: <short description>

<detailed description if needed>

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:** feat, fix, refactor, docs, test, chore

**Before committing:**
- [ ] Review staged changes: `/review staged`
- [ ] All tests pass
- [ ] Build succeeds

---

## Quick Reference by Feature Size

### Simple (< 30 min)
```
1. Research (5 min)
2. Build (15 min)
3. Quick test (5 min)
4. Commit (5 min)
```

### Medium (1-3 hrs)
```
1. Research (15 min)
2. Plan (15 min)
3. Phase 1 Tests (30 min)
4. Build (1-2 hrs)
5. Phase 2 Tests (30 min)
6. Review (15 min)
7. Document + Commit (15 min)
```

### Complex (> 3 hrs)
```
1. Research (30 min)
2. Plan + Approval (1 hr)
3. Phase 1 Tests (1 hr)
4. Build (2-4 hrs)
5. Phase 2 Tests (1 hr)
6. Review (30 min)
7. Verify (30 min)
8. Document (30 min)
9. Commit (15 min)
```

---

## Model Selection

| Task | Model | Why |
|------|-------|-----|
| Research | Sonnet | Fast exploration |
| Simple planning | Sonnet | Standard patterns |
| **Complex architecture** | **Opus** | Deep reasoning needed |
| **Database design** | **Opus** | Critical decisions |
| **Difficult debugging** | **Opus** | Multi-file complexity |
| Building | Sonnet | Efficient implementation |
| Testing | Sonnet | Standard patterns |
| Review | Sonnet | Code analysis |

---

## Anti-Patterns to Avoid

❌ **Skip Phase 1 tests** - leads to unclear requirements
❌ **Document before building** - documentation becomes stale
❌ **No review step** - quality issues slip through
❌ **Test only happy paths** - bugs in production
❌ **Commit without running tests** - breaks main branch
❌ **Skip planning for complex features** - requires rewrites

---

## Example: Full Workflow

**Feature:** Add rest timer to workout page

### 1. Research (10 min)
- Found existing timer state in workout page
- No visual timer component exists
- Need to add countdown display and auto-start

### 2. Plan (15 min)
- Add timer state to workout page
- Create `RestTimer` component
- Auto-start after logging set
- Allow manual dismiss

### 3. Phase 1 Tests (30 min)
```typescript
it('should show timer after logging set', async () => {
  // Define expected behavior
});

it('should countdown from rest duration', async () => {
  // Define expected behavior
});

it('should allow dismissing timer early', async () => {
  // Define expected behavior
});
```

### 4. Build (1 hr)
- Create RestTimer component
- Add timer state to workout page
- Implement auto-start logic
- **All Phase 1 tests now pass** ✅

### 5. Phase 2 Tests (30 min)
```typescript
it('should format time correctly', () => {
  // Test implementation detail
});

it('should cleanup interval on unmount', () => {
  // Test React internals
});
```

### 6. Review (10 min)
- Run `/review`
- No issues found

### 7. Verify (10 min)
- Run `/build` - passes
- Test in browser - works

### 8. Document (5 min)
- Add JSDoc to RestTimer component

### 9. Commit
```
feat: add rest timer to workout page

Displays countdown timer after logging each set.
Auto-starts with configurable duration, can be dismissed early.

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Total time:** ~2.5 hours
