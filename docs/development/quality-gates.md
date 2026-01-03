---
sidebar_position: 2
title: Quality Gates & Deployment
description: Comprehensive 27-gate quality system with 100% coverage enforcement
---

# Quality Gates & Deployment

Complete reference for the Mo app's quality enforcement system: 27 automated quality gates across 4 layers ensuring production-ready code on every push.

---

**Related Documentation:**
- [Development Workflow](./workflow.md) - Feature development methodology (Phase 1 & 2 testing)
- See `.claude/WORKFLOW_GUIDE.md` in mo-app for operational details

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    27 Quality Gates                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Pre-Commit       → 6 checks  → ~45 sec            │
│ Layer 2: Pre-Push         → 21 checks → ~3 min             │
│ Layer 3: GitHub Actions   → Multiple workflows → ~5 min    │
│ Layer 4: Post-Merge       → 6 jobs    → ~5 min             │
└─────────────────────────────────────────────────────────────┘

Philosophy: Quality > Speed
Solo Developer Workflow: Direct pushes to main (no PR requirement)
Coverage Enforcement: 100% on all business logic
```

---

## Quick Reference

### Solo Developer Workflow (Current)

```bash
# 1. Make changes
git add .
git commit -m "feat: description"  # Pre-commit: 6 checks (~45 sec)

# 2. Push to main
git push origin main  # Pre-push: 21 checks (~3 min)

# 3. Post-merge validation runs automatically on main
```

**No PR required** - Direct pushes to `main` allowed for solo development.

---

## Layer 1: Pre-Commit Gates (6 checks, ~45 sec)

Runs automatically on `git commit`. **Purpose:** Fail fast, prevent bad code from entering git history.

### Gate 1.1: File Size Limits
**Check:** Prevents oversized files from bloating the repository

**Limits:**
- Source files (`.ts`, `.tsx`, `.js`, `.jsx`): 100 KB
- Config files (`.json`, `.yaml`, `.md`): 500 KB
- Images (`.png`, `.jpg`, `.svg`): 2 MB

**Why:** Large files slow down git operations and indicate poor code organization

**Fix if fails:**
```bash
# Split large files into smaller modules
# Compress images before committing
# Use dynamic imports for large dependencies
```

---

### Gate 1.2: Auto-Formatting (Prettier)
**Check:** Enforces consistent code formatting across the entire codebase

**Scope:**
- TypeScript/JavaScript files
- JSON, YAML, Markdown
- CSS, HTML

**Auto-applied:** Yes (via `.claude/settings.json` hooks)

**Configuration:** `.prettierrc` + `.prettierignore`

**Fix if fails:** Prettier automatically formats on every Edit/Write tool use

---

### Gate 1.3: Test Coverage Gate
**Check:** Ensures tests exist for changed testable files

**Purpose:** Prevent untested code from entering the codebase

**Logic:**
```
IF source files changed (app/api/, lib/, components/)
AND no test files changed (*test.ts, *test.tsx)
THEN fail commit
```

**Exclusions:**
- Page/layout files (tested via E2E)
- Pure UI components (tested via E2E)
- Config files
- Database schema declarations

**Fix if fails:**
```bash
# Added new utility function?
touch lib/utils/my-utility.ts
touch lib/utils/my-utility.test.ts  # ✅ Now commit passes
```

---

### Gate 1.4: New Test Execution
**Check:** Verifies new tests actually run and pass

**Purpose:** Catch broken test files before commit

**Scope:** Only tests modified in current commit

**Command:** `npm run test:fast` (vitest --changed --bail=1)

**Fix if fails:**
```bash
# Run tests locally to see error
npm run test:fast

# Fix the test file
# Recommit
```

---

### Gate 1.5: Parallel Quality Checks
**Check:** Runs multiple fast checks in parallel

**Includes:**
1. **Secret detection** - `secretlint` scans for API keys, tokens
2. **TypeScript** - `tsc --noEmit` checks type errors
3. **All tests** - `vitest run` runs full test suite
4. **ESLint** - `eslint --max-warnings=0` checks code quality

**Parallelization:** All 4 run simultaneously using `npm-run-all --parallel`

**Duration:** ~30 sec (would be ~2 min if sequential)

**Fix if fails:** See specific error in output (secrets/types/tests/lint)

---

### Gate 1.6: Coverage Verification
**Check:** Enforces 100% coverage threshold on tested files

**Thresholds:**
```json
{
  "lines": 100,
  "functions": 100,
  "branches": 100,
  "statements": 100
}
```

**Important:** Only applies to files that have test files

**Coverage excludes:**
- `app/` pages and layouts (E2E tested)
- `components/ui/` pure presentational components
- Config files
- `*.d.ts` type definition files

**Fix if fails:**
```bash
# Run coverage report to see uncovered lines
npm run test:coverage

# Add tests for uncovered lines
# Lines marked with /* istanbul ignore next */ are intentionally excluded
```

---

## Layer 2: Pre-Push Gates (21 checks, ~3 min)

Runs automatically on `git push`. **Purpose:** Comprehensive validation before code reaches remote repository.

### Phase 1: Fast Static Checks (~15-20 sec)

**All 12 checks run in parallel:**

#### Gate 2.1: Secret Detection
**Tool:** `secretlint`

**Scans for:**
- AWS credentials
- API keys
- Private keys
- OAuth tokens
- Database URLs with passwords

**Config:** `.secretlintrc.json`

**Whitelisting:** Add `/* secretlint-disable */` for false positives (e.g., example code)

---

#### Gate 2.2: TypeScript Type Check
**Tool:** `tsc --noEmit`

**Checks:**
- All type errors across codebase
- Strict mode violations
- Missing types
- Type incompatibilities

**Why:** Catch type errors before build

---

#### Gate 2.3: ESLint
**Tool:** `eslint --max-warnings=0`

**Rules:**
- No console.log (except in specific files)
- Import order enforcement
- Unused variables
- Complexity limits
- React hooks rules

**Config:** `eslint.config.mjs`

---

#### Gate 2.4: Debug Code Detection
**Check:** Grep for debug statements

**Searches for:**
```javascript
console.log()
console.debug()
console.info()
debugger
```

**Excluded files:**
- `*.test.ts` - test files can have console
- `seed*.ts` - seed scripts need logging
- `check*.ts` - check scripts need logging

**Fix:** Remove debug code or move to excluded files

---

#### Gate 2.5: Dead Code Detection
**Tool:** `ts-prune`

**Finds:**
- Unused exports
- Unused variables across files
- Dead functions

**Note:** Currently informational (doesn't block push)

---

#### Gate 2.6: License Compliance
**Tool:** `license-checker`

**Allowed licenses:**
- MIT, Apache-2.0
- BSD-2-Clause, BSD-3-Clause, BSD
- ISC, 0BSD
- MPL-2.0
- CC0-1.0, CC-BY-4.0, CC-BY-3.0
- BlueOak-1.0.0
- Public Domain

**Why:** Prevent incompatible licenses (GPL, AGPL)

---

#### Gate 2.7: Database Schema Check
**Tool:** `drizzle-kit check`

**Validates:**
- Schema is valid TypeScript
- No conflicting migrations
- Column types are correct
- Indexes are properly defined

**Config:** `drizzle.config.ts`

---

#### Gate 2.8: Database Migration Safety
**Check:** Validates migration files won't cause data loss

**Detects:**
- DROP COLUMN without backup
- ALTER COLUMN that truncates data
- Missing NOT NULL defaults

**Note:** Currently basic check, enhanced in CI

---

#### Gate 2.9: Privacy Leak Detection
**Check:** Grep for health data in console logs

**Searches for:**
```javascript
console.log(...weight...)
console.log(...bmi...)
console.log(...injury...)
console.log(...condition...)
console.log(...medication...)
console.log(...health...)
```

**Why:** Prevent HIPAA-sensitive data from appearing in logs

**Fix:** Use encrypted logs or remove health data from console

---

#### Gate 2.10: E2E Coverage Verification
**Tool:** `scripts/check-e2e-coverage.js`

**Ensures:**
- All critical user flows have E2E tests
- Test files exist in `tests/e2e/critical/`
- Minimum coverage: 100% of critical flows

**Critical flows:**
- Auth (sign in, sign out)
- Onboarding
- Workout session (start, log, complete)
- Progress tracking

---

#### Gate 2.11: Accessibility Coverage
**Tool:** `scripts/check-a11y-coverage.js`

**Ensures:**
- All pages have accessibility tests
- Test files exist in `tests/accessibility/`
- Minimum coverage: 100% of pages

**Tested with:** Axe-core + Playwright

---

#### Gate 2.12: API Contract Coverage
**Tool:** `scripts/check-api-coverage.js`

**Ensures:**
- All API routes have tests
- Request validation tested
- Response schemas tested
- Auth checks tested

**Coverage target:** 100% of endpoints

---

### Phase 2: Heavy Validation (~2 min)

**7 checks, some parallel, some sequential:**

#### Gate 2.13: Unit Tests + Coverage
**Command:** `npm run test:coverage`

**Runs:** Full Vitest suite with V8 coverage

**Coverage thresholds:**
```json
{
  "lines": 100,
  "functions": 100,
  "branches": 100,
  "statements": 100
}
```

**Includes:**
- Unit tests (`lib/**/*.test.ts`)
- Integration tests (`app/api/**/*.test.ts`)
- Component tests (`components/**/*.test.tsx`)

**Duration:** ~30-45 sec

**Output:** Coverage report in `coverage/` directory

---

#### Gate 2.14: Coverage Count Check
**Tool:** `scripts/check-coverage-count.sh`

**Purpose:** Detects if files dropped out of coverage

**How it works:**
```bash
# Count files in coverage report
ACTUAL_FILES=$(cat coverage/lcov.info | grep "^SF:" | wc -l)

# Compare to baseline
MINIMUM_FILES=15

if [ $ACTUAL_FILES -lt $MINIMUM_FILES ]; then
  echo "Coverage count dropped!"
  exit 1
fi
```

**Why needed:** Vitest reports 100% on files it tests, but doesn't report on untested files

**Fix if fails:**
```bash
# You added untested code OR removed tests
# Option 1: Add tests
# Option 2: Update MINIMUM_FILES if intentional
```

---

#### Gate 2.15: Production Build
**Command:** `npm run build`

**Validates:**
- All TypeScript compiles
- No build errors
- Next.js builds successfully
- Bundle size within limits

**Duration:** ~45-60 sec

**Output:** `.next/` directory

**Fix if fails:**
```bash
# Run build locally to see error
npm run build

# Common issues:
# - Import errors
# - Type errors not caught by tsc
# - Missing dependencies
```

---

#### Gate 2.16: E2E Critical Flows
**Command:** `npm run test:e2e:critical`

**Tool:** Playwright

**Tests:** `tests/e2e/critical/*.spec.ts`

**Flows tested:**
1. **Auth:** Sign in, sign out, session persistence
2. **Onboarding:** Complete full flow, data persistence
3. **Workout:** Start session, log sets, complete workout
4. **Progress:** View history, see trends

**Duration:** ~30-45 sec

**Runs against:** Dev server on localhost:3000

**Fix if fails:**
```bash
# Run E2E tests locally
npm run test:e2e:critical

# Debug with UI mode
npm run test:e2e:ui

# Check screenshots in test-results/ directory
```

---

#### Gate 2.17: Accessibility Tests
**Command:** `npm run test:axe`

**Tool:** Axe-core + Playwright

**Tests:** `tests/accessibility/*.spec.ts`

**Pages tested:**
- `/` - Home
- `/onboarding` - Onboarding flow
- `/workout` - Workout page
- `/progress` - Progress dashboard
- `/settings` - Settings page

**Rules checked:**
- WCAG 2.1 Level A
- WCAG 2.1 Level AA
- Best practices

**Duration:** ~20-30 sec

**Fix if fails:**
```bash
# Run accessibility tests locally
npm run test:axe

# Common issues:
# - Missing alt text
# - Insufficient color contrast
# - Missing ARIA labels
# - Invalid HTML structure
```

---

### Phase 3: Post-Processing (~30 sec)

**2 checks run in parallel:**

#### Gate 2.18: SonarCloud Analysis
**Command:** `npm run sonar`

**Tool:** `sonar-scanner`

**Analyzes:**
- Code quality (code smells)
- Security vulnerabilities
- Coverage gaps
- Code duplication
- Cognitive complexity

**Minimum coverage:** 80% (100% requires paid tier)

**Quality gate:**
- Coverage: 80%+
- Duplications: `<3%`
- Maintainability rating: A
- Reliability rating: A
- Security rating: A

**Duration:** ~20-30 sec (local analysis)

**Dashboard:** https://sonarcloud.io/dashboard?id=tumativerse_mo-app

**Fix if fails:**
```bash
# View detailed report on SonarCloud dashboard
# Common issues:
# - Coverage below 80%
# - Code duplication
# - Complex functions (reduce cognitive complexity)
# - Security hotspots (potential vulnerabilities)
```

**Requires:** `SONAR_TOKEN` environment variable

---

#### Gate 2.19: Vulnerability Check
**Command:** `npm audit --production --audit-level=high`

**Checks:**
- High severity vulnerabilities
- Critical vulnerabilities
- Production dependencies only

**Fix if fails:**
```bash
# View detailed audit
npm audit

# Auto-fix (if available)
npm audit fix

# If no fix available:
# - Upgrade dependency
# - Find alternative package
# - Accept risk (document in security.md)
```

---

## Layer 3: GitHub Actions (CI/CD)

Runs automatically on push to any branch. **Purpose:** Cloud validation, deployment.

### Workflow: Quick Check (~1 min)

**File:** `.github/workflows/quick-check.yml`

**Triggers:** Every push

**Jobs:**
1. **Lint check** - ESLint
2. **Type check** - TypeScript
3. **Format check** - Prettier

**Why:** Fast feedback loop in PR/push

---

### Workflow: PR Validation (~4 min)

**File:** `.github/workflows/pr-validation.yml`

**Triggers:** Pull requests to main

**Jobs:**
1. **Test** - Full test suite + coverage
2. **Build** - Production build
3. **E2E** - Critical flow tests
4. **Coverage upload** - Codecov

**Status:** Required for PR merge (when PRs enabled)

---

### Workflow: Code Quality (~2 min)

**File:** `.github/workflows/code-quality.yml`

**Triggers:** Every push

**Jobs:**
1. **SonarCloud** - Full analysis
2. **Coverage report** - Generate coverage badge

**Output:** Quality metrics on SonarCloud dashboard

---

### Workflow: Security (~2 min)

**File:** `.github/workflows/security.yml`

**Triggers:** Push to main, scheduled (weekly)

**Jobs:**
1. **Dependency scan** - `npm audit`
2. **Secret detection** - `secretlint`
3. **Snyk analysis** - Vulnerability database check

**Output:** Security report in GitHub Security tab

---

### Workflow: Post-Merge (6 jobs, ~5 min)

**File:** `.github/workflows/post-merge.yml`

**Triggers:** Push to main only

**Jobs:**

#### Job 1: Full Test Suite
```yaml
- Run all unit tests
- Run all integration tests
- Generate coverage report
- Upload to Codecov
```

#### Job 2: Production Build + Bundle Analysis
```yaml
- Build production bundle
- Analyze bundle size
- Check for bundle bloat (>500KB warning)
- Upload bundle stats
```

#### Job 3: E2E Critical Flows
```yaml
- Start production build
- Run Playwright tests
- Upload screenshots/videos on failure
```

#### Job 4: Database Migration Safety
```yaml
- Validate migrations
- Check for breaking changes
- Verify rollback scripts exist
```

#### Job 5: Code Quality Verification
```yaml
- Run SonarCloud analysis
- Upload coverage to SonarCloud
- Enforce quality gate (blocks on failure)
```

#### Job 6: Summary Status
```yaml
- Aggregate all job results
- Post summary comment (if PR)
- Block merge if any job fails
```

---

## Layer 4: Deployment

### Vercel Deployment (Automatic)

**Triggers:**
- Every push to main → Production deployment
- Every PR → Preview deployment

**Build command:** `npm run build`

**Environment variables:** Loaded from Vercel dashboard

**Deployment checks:**
1. Build succeeds
2. TypeScript compiles
3. No runtime errors on start

**Preview URLs:** Posted as PR comment

**Production URL:** https://mo-app.vercel.app

---

## Coverage Philosophy

### 100% Coverage Enforcement

**Why 100%?**
- Fitness data is sensitive - bugs can cause injury
- Solo developer - need automated safety net
- Prevents regressions during rapid development

---

### Three-Layer Coverage System

#### Layer 1: Vitest (100% on tested files)
**Enforces:** 100% coverage on files that have test files

**Configuration:**
```json
{
  "coverage": {
    "lines": 100,
    "functions": 100,
    "branches": 100,
    "statements": 100
  }
}
```

**Limitation:** Doesn't detect untested files (only reports on files it tests)

---

#### Layer 2: Coverage Count (Detects untested files)
**Purpose:** Catch files that dropped out of coverage

**How it works:**
```bash
# Baseline: 15 files currently tested
MINIMUM_FILES=15

# Check current count
ACTUAL=$(cat coverage/lcov.info | grep "^SF:" | wc -l)

# Fail if count drops
if [ $ACTUAL -lt $MINIMUM_FILES ]; then
  echo "Coverage count dropped from $MINIMUM_FILES to $ACTUAL"
  echo "You added untested code or removed tests"
  exit 1
fi
```

**When to update baseline:**
```bash
# Added new tested code → INCREASE baseline
MINIMUM_FILES=16

# Intentionally removed code → DECREASE baseline
MINIMUM_FILES=14
```

---

#### Layer 3: SonarCloud (80% overall)
**Purpose:** Overall project health metric

**Why 80% not 100%?**
- Includes pages/layouts (tested via E2E, not unit tests)
- Includes UI components (tested via E2E)
- 100% requires paid SonarCloud tier

**What it catches:**
- Low coverage on business logic
- Code duplication
- Code smells
- Security vulnerabilities

**Dashboard:** Live metrics at https://sonarcloud.io/dashboard?id=tumativerse_mo-app

---

### What Gets Tested Where

| Code Type | Unit/Integration | E2E | Accessibility |
|-----------|-----------------|-----|---------------|
| API routes (`app/api/`) | ✅ 100% | ✅ Critical flows | ❌ |
| Business logic (`lib/mo-*/`) | ✅ 100% | ❌ | ❌ |
| Utilities (`lib/utils/`) | ✅ 100% | ❌ | ❌ |
| Security (`lib/security/`) | ✅ 100% | ❌ | ❌ |
| Database (`lib/db/`) | ✅ Queries | ❌ | ❌ |
| Components (logic) | ✅ 100% | ❌ | ❌ |
| Pages/Layouts | ❌ | ✅ 100% | ✅ 100% |
| UI Components (pure) | ❌ | ✅ | ✅ |

---

## Phase 1 & 2 Testing Workflow

The 27 quality gates enforce **how** code is validated. The Phase 1 & 2 workflow defines **when** tests are written.

### Phase 1: Behavior Tests (Before Building)

**Written:** Before implementing the feature
**Purpose:** Define expected behavior (requirements)
**Enforced by:** Gate 1.3 (test coverage gate)

**Example:**
```typescript
// tests/api/workout.behavior.test.ts
it('should allow user to start a workout', async () => {
  // Test will FAIL initially - that's expected
  const response = await POST('/api/ppl/session', {...});
  expect(response.status).toBe(201);
});
```

**Gate Enforcement:**
- Gate 1.3 blocks commit if you add source files without test files
- Forces you to write tests BEFORE or WITH code

### Phase 2: Implementation Tests (After Building)

**Written:** After implementation passes Phase 1 tests
**Purpose:** Verify implementation details and edge cases
**Enforced by:** Gate 1.6 & 2.13 (100% coverage)

**Example:**
```typescript
// tests/lib/fatigue.test.ts
describe('calculateFatigue', () => {
  it('should calculate fatigue score from factors', () => {
    // Test implementation details
    const score = calculateFatigue({...});
    expect(score).toBeGreaterThan(0);
  });
});
```

**Gate Enforcement:**
- Gate 1.6: Enforces 100% coverage on all tested files
- Gate 2.14: Detects if files dropped out of coverage

### How They Work Together

```
1. Write Phase 1 tests → 🔴 Tests fail (expected)
2. Implement feature → ✅ Phase 1 tests pass
3. Write Phase 2 tests → ✅ 100% coverage achieved
4. Commit → Gate 1.3 passes (tests exist)
5. Commit → Gate 1.6 passes (100% coverage)
```

**See also:** [Development Workflow](./workflow.md) for detailed Phase 1 & 2 methodology

---

## Conventional Commits

### Format (Enforced by commitlint)

```
<type>(<scope>): <description>

[optional body]

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

### Types

| Type | When to use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(workout): add rest timer` |
| `fix` | Bug fix | `fix(api): handle missing user profile` |
| `chore` | Maintenance | `chore: update dependencies` |
| `docs` | Documentation | `docs: update API reference` |
| `refactor` | Code restructuring | `refactor(auth): extract validation logic` |
| `test` | Tests only | `test: add edge cases for fatigue calc` |
| `perf` | Performance | `perf(db): add index to sessions table` |
| `style` | Formatting | `style: fix prettier formatting` |
| `ci` | CI/CD changes | `ci: add coverage upload step` |
| `build` | Build system | `build: update next.js to v15` |

---

### Scopes (Optional)

Common scopes:
- `workout` - Workout features
- `progress` - Progress tracking
- `auth` - Authentication
- `api` - API routes
- `db` - Database
- `ui` - User interface
- `ppl` - PPL program system

---

### Examples

#### Good commits:
```bash
git commit -m "feat(workout): add rest timer with audio alert"
git commit -m "fix(api): validate exercise IDs before creating session"
git commit -m "chore: upgrade dependencies to latest versions"
git commit -m "test(fatigue): add edge cases for zero training load"
git commit -m "refactor(profile): extract encryption to shared util"
```

#### Bad commits:
```bash
git commit -m "updates"  # ❌ Too vague
git commit -m "Fixed bug"  # ❌ No type, no scope, no details
git commit -m "WIP"  # ❌ Don't commit work in progress
git commit -m "feat: added stuff"  # ❌ What stuff?
```

---

### Auto-Added Footer

All commits automatically include:
```
🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Configuration:** `.husky/prepare-commit-msg`

---

## Troubleshooting

### Pre-Commit Failures

#### "Source files changed but no test files modified"
```bash
# You added/modified testable code without tests
# Fix: Add test file

# Example:
touch lib/utils/calculate-volume.ts
touch lib/utils/calculate-volume.test.ts  # ✅ Add test

git add .
git commit -m "feat: add volume calculator"
```

---

#### "Coverage dropped below 100%"
```bash
# Run coverage report to see uncovered lines
npm run test:coverage

# Check uncovered lines in coverage/lcov-report/index.html
# Add tests to cover those lines

# Alternatively, use /* istanbul ignore next */ for intentionally untested code
```

---

#### "New tests failed"
```bash
# Your new test has errors
npm run test:fast

# Common issues:
# - Import path incorrect
# - Missing test setup
# - Async timing issues

# Fix the test and recommit
```

---

### Pre-Push Failures

#### "Playwright browsers not installed"
```bash
# E2E and accessibility tests require Playwright browsers
npx playwright install

# Then retry push
git push origin main
```

---

#### "Coverage count check failed"
```bash
# You added untested code OR removed tests

# Option 1: Add tests for new code
npm run test:coverage
# Check which files are missing from coverage

# Option 2: Update baseline (if intentional)
# Edit scripts/check-coverage-count.sh
MINIMUM_FILES=16  # Increase if you added tested code
MINIMUM_FILES=14  # Decrease if you removed code
```

---

#### "SonarCloud quality gate failed"
```bash
# View detailed report
# https://sonarcloud.io/dashboard?id=tumativerse_mo-app

# Common issues:
# 1. Coverage below 80%
#    Fix: Add more tests

# 2. Code duplication
#    Fix: Extract duplicated code to shared function

# 3. Code smells
#    Fix: Refactor complex functions

# 4. Security hotspots
#    Fix: Address security vulnerabilities
```

---

#### "SONAR_TOKEN not set"
```bash
# Get token from SonarCloud
# https://sonarcloud.io/account/security

# Set in environment
export SONAR_TOKEN=your-token-here

# Add to ~/.zshrc or ~/.bashrc for persistence
echo 'export SONAR_TOKEN=your-token' >> ~/.zshrc
```

---

#### "Dev server failed to start"
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

---

#### "E2E tests failed"
```bash
# Run locally with UI mode for debugging
npm run test:e2e:ui

# Check test results
cat playwright-report/index.html

# Check screenshots
ls test-results/

# Common issues:
# - Timing issues (add waitFor)
# - Element selectors changed (update selectors)
# - API responses changed (update expectations)
```

---

### GitHub Actions Failures

#### "Build failed in CI but passes locally"
```bash
# Check for:
# 1. Environment variable differences
# 2. Node version mismatch (CI uses Node 20)
# 3. Dependency version differences

# Run with same Node version as CI
nvm use 20
npm run build

# Check CI logs for specific error
gh run view --log
```

---

#### "E2E tests failed in CI"
```bash
# Download test artifacts from GitHub
gh run download <run-id>

# View screenshots and videos
ls test-results/

# Common issues:
# - CI environment differences (no auth tokens)
# - Timing issues (CI slower than local)
# - Database seeding issues
```

---

#### "SonarCloud analysis timed out"
```bash
# Retry workflow manually
gh run rerun <run-id>

# If persists, check SonarCloud status
# https://status.sonarcloud.io/
```

---

## Git Hook Debugging

### Check if hooks are installed
```bash
git config core.hooksPath
# Should output: .husky

ls -la .husky/
# Should see: pre-commit, pre-push, prepare-commit-msg
```

---

### Reinstall hooks
```bash
npm install
# Runs "prepare" script which sets up Husky
```

---

### Bypass hooks (emergency only)
```bash
# Skip pre-commit (NOT RECOMMENDED)
git commit --no-verify -m "message"

# Skip pre-push (NOT RECOMMENDED)
git push --no-verify

# ⚠️ Only use for emergencies (CI will catch issues anyway)
```

---

### View hook output
```bash
# Hooks log to stdout
# If hook fails, error is displayed in terminal

# Manual hook execution
bash .husky/pre-commit  # Run pre-commit manually
bash .husky/pre-push    # Run pre-push manually
```

---

## Performance Optimization

### Speed up pre-push (~3 min → faster)

**Current bottlenecks:**
1. SonarCloud analysis (~30 sec)
2. Production build (~45 sec)
3. E2E tests (~45 sec)

**Optimizations:**

#### Skip SonarCloud locally (runs in CI anyway)
```bash
# Edit .husky/pre-push
# Comment out SonarCloud step

# Note: Quality gate still enforced in CI
```

#### Use existing dev server
```bash
# Start dev server in separate terminal
npm run dev

# Pre-push detects running server and skips startup
# Saves ~10 sec
```

#### Run selective E2E
```bash
# Only run critical flows (default)
npm run test:e2e:critical

# Full E2E suite runs in CI
```

---

## Branch Protection Settings

Current configuration for `main` branch:

```json
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": false
}
```

**Summary:**
- ✅ Linear history enforced (no merge commits)
- ✅ No force pushes (can't rewrite history)
- ✅ Branch can't be deleted
- ❌ No PR requirement (solo dev)
- ❌ No required approvals (solo dev)

---

### When to Enable PR Requirement

**If adding team members:**

```bash
# Update branch protection
gh api repos/tumativerse/mo-app/branches/main/protection -X PUT \
  --input @.github/protection-with-pr.json

# Requires:
# - 1 approval minimum
# - All status checks pass
# - Conversations resolved
```

---

## Manual Quality Checks

All automated checks can be run manually:

```bash
# Quick checks
npm run check:secrets     # Secret detection
npm run check:types       # TypeScript
npm run check:lint        # ESLint
npm run check:tests       # Run all tests

# All checks in parallel
npm run check:all         # Secrets + Types + Tests + Lint

# Coverage
npm run test:coverage     # Full coverage report
npm run check:coverage-count  # Coverage count check

# Build
npm run build             # Production build

# E2E & Accessibility
npm run test:e2e          # All E2E tests
npm run test:e2e:critical # Critical flows only
npm run test:axe          # Accessibility tests

# Code quality
npm run sonar             # SonarCloud analysis (requires SONAR_TOKEN)

# Security
npm run check:vulnerabilities  # npm audit
```

---

## Quality Metrics Dashboard

### Codecov
**URL:** https://codecov.io/gh/tumativerse/mo-app

**Tracks:**
- Coverage trends over time
- Coverage by file/directory
- Untested code visualization

---

### SonarCloud
**URL:** https://sonarcloud.io/dashboard?id=tumativerse_mo-app

**Tracks:**
- Overall coverage
- Code smells
- Bugs
- Vulnerabilities
- Technical debt
- Duplication

---

### GitHub Actions
**URL:** https://github.com/tumativerse/mo-app/actions

**Shows:**
- Workflow run history
- Success/failure rates
- Performance trends

---

## Quick Reference Tables

### Gate Summary by Layer

| Layer | Gates | Duration | Purpose |
|-------|-------|----------|---------|
| Pre-Commit | 6 | ~45 sec | Fail fast before commit |
| Pre-Push | 21 | ~3 min | Comprehensive validation |
| GitHub Actions | Multiple | ~5 min | Cloud validation |
| Post-Merge | 6 | ~5 min | Main branch health |
| **Total** | **27+** | **~14 min** | **Production-ready code** |

---

### Coverage Requirements

| Code Type | Unit Tests | E2E Tests | Accessibility |
|-----------|-----------|-----------|---------------|
| API routes | 100% | Critical flows | N/A |
| Business logic | 100% | N/A | N/A |
| Utilities | 100% | N/A | N/A |
| Pages/Layouts | N/A | 100% | 100% |
| UI Components | Varies | 100% | 100% |

---

### Common Commands

| Task | Command |
|------|---------|
| Run all checks | `npm run check:all` |
| Run tests | `npm run test` |
| Run with coverage | `npm run test:coverage` |
| Run E2E tests | `npm run test:e2e:critical` |
| Run accessibility tests | `npm run test:axe` |
| Build production | `npm run build` |
| Check coverage count | `npm run check:coverage-count` |
| SonarCloud analysis | `npm run sonar` |
| Check vulnerabilities | `npm run check:vulnerabilities` |

---

### When Checks Run

| Trigger | Gates Executed | Duration |
|---------|---------------|----------|
| `git commit` | Pre-commit (6 gates) | ~45 sec |
| `git push` | Pre-push (21 gates) | ~3 min |
| Push to GitHub | GitHub Actions (multiple workflows) | ~5 min |
| Merge to main | Post-merge (6 jobs) | ~5 min |
| **Total validation** | **27+ gates** | **~14 min** |

---

## Example: Full Push Workflow

### Scenario: Add new feature

```bash
# 1. Make changes
vim lib/mo-pulse/warmup.ts
vim lib/mo-pulse/warmup.test.ts

# 2. Stage changes
git add .

# 3. Commit (triggers pre-commit)
git commit -m "feat(warmup): add dynamic warmup generator"

# Pre-commit runs (~45 sec):
# ✅ File size check
# ✅ Prettier formatting
# ✅ Test coverage gate
# ✅ New test execution
# ✅ Parallel checks (secrets, types, tests, lint)
# ✅ Coverage verification (100%)

# 4. Push (triggers pre-push)
git push origin main

# Pre-push Phase 1 (~20 sec):
# ✅ 12 static checks in parallel

# Pre-push Phase 2 (~2 min):
# ✅ Tests + Build in parallel
# ✅ Coverage count check
# ✅ E2E + Accessibility tests in parallel

# Pre-push Phase 3 (~30 sec):
# ✅ SonarCloud analysis
# ✅ Vulnerability check

# 5. GitHub Actions trigger automatically
# ✅ Quick check (~1 min)
# ✅ Code quality (~2 min)
# ✅ Security scan (~2 min)
# ✅ Post-merge validation (~5 min)

# 6. Vercel deployment
# ✅ Production build
# ✅ Deploy to production
# ✅ Health check

# Total time: ~14 min from commit to production
# Local time: ~4 min (commit + push)
# Remote time: ~10 min (GitHub + Vercel)
```

---

## Resources

- **Workflow Guide:** `.claude/WORKFLOW_GUIDE.md`
- **SonarCloud Setup:** `.claude/SONARCLOUD_SETUP.md`
- **GitHub Secrets:** `.claude/ALL_GITHUB_SECRETS.md`
- **DevOps Infrastructure:** `.claude/DEVOPS_INFRASTRUCTURE.md`
- **Branch Protection:** `.github/BRANCH_PROTECTION_SETUP.md`

---

_This quality system ensures production-ready code on every push while maintaining fast iteration cycles for solo development._
