---
sidebar_position: 3
title: Agents
description: Specialized assistants for specific tasks
---

# Agents

Agents are specialized assistants that Claude uses automatically based on your request.

## Available Agents

| Agent | Purpose | Auto-Used When |
|-------|---------|----------------|
| `code-reviewer` | Review code quality and security | Reviewing changes |
| `ui-improver` | Suggest UI/UX improvements | Improving interfaces |
| `api-debugger` | Debug API issues | API failures |
| `test-runner` | Run and analyze tests | Testing code |
| `database-migrator` | Handle schema changes | Modifying database |
| `performance-analyzer` | Find performance issues | Optimizing code |
| `researcher` | Research codebase or web | Investigating topics |
| `doc-writer` | Write documentation | Documenting code |

## Agent Details

### Code Reviewer

Reviews code for:
- TypeScript best practices
- React patterns and hooks
- Security vulnerabilities
- Performance issues
- Test coverage

**Triggered by:** "Review this code", "Check my changes"

### UI Improver

Analyzes UI for:
- Accessibility issues
- Mobile responsiveness
- Dark theme consistency
- User experience improvements
- Component composition

**Triggered by:** "Improve this UI", "Make this more user-friendly"

### API Debugger

Debugs APIs by:
- Tracing request flow
- Checking auth middleware
- Validating Zod schemas
- Inspecting database queries
- Analyzing error responses

**Triggered by:** "API returns 500", "Endpoint not working"

### Test Runner

Handles testing by:
- Running test suites
- Analyzing failures
- Identifying root causes
- Suggesting fixes
- Checking coverage

**Triggered by:** "Run tests", "Why is this test failing"

### Database Migrator

Manages database by:
- Modifying Drizzle schema
- Running migrations
- Seeding data
- Checking integrity
- Handling relations

**Triggered by:** "Add a new table", "Modify the schema"

### Performance Analyzer

Optimizes by:
- Analyzing bundle size
- Finding render issues
- Checking query efficiency
- Identifying bottlenecks
- Suggesting improvements

**Triggered by:** "Page is slow", "Optimize performance"

### Researcher

Researches by:
- Exploring codebase
- Searching documentation
- Finding patterns
- Comparing approaches
- Citing sources

**Triggered by:** "How does X work", "Find where Y is implemented"

### Doc Writer

Documents by:
- API endpoint docs
- Component documentation
- Feature guides
- README updates
- Code comments

**Triggered by:** "Document this", "Write docs for"

## Agent Configuration

Agents are defined in `.claude/agents/`:

```markdown
---
model: sonnet
tools:
  - Read
  - Glob
  - Grep
---

# Agent Name

Instructions for the agent...
```

All agents currently use **Sonnet** for balanced speed and capability.
