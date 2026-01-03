---
sidebar_position: 2
title: Model Selection
description: When Claude uses Opus, Sonnet, or Haiku
---

# Model Selection

Claude automatically selects the appropriate model based on task complexity.

## Model Overview

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| **Haiku** | Fastest | Lowest | Simple tasks |
| **Sonnet** | Fast | Balanced | Daily development |
| **Opus** | Slower | Highest | Complex reasoning |

## Automatic Selection

### Opus (Complex Tasks)

Claude switches to Opus for:

- Designing new system architecture
- Complex database schema design
- Difficult debugging (multi-file, unclear cause)
- Major refactoring decisions
- Performance optimization strategies
- Security-sensitive implementations
- Evaluating multiple approaches

**Example:**
```
You: Help me redesign the workout session data model
Claude: [Uses Opus for deep architectural reasoning]
```

### Sonnet (Daily Work)

Claude uses Sonnet for:

- Feature implementation
- Standard debugging
- Code reviews
- Writing tests
- Documentation
- Most agent tasks

**Example:**
```
You: Add a rest timer to the workout page
Claude: [Uses Sonnet for efficient implementation]
```

### Haiku (Quick Tasks)

Claude uses Haiku for:

- Quick questions about syntax
- Simple file lookups
- Formatting tasks
- Basic explanations

**Example:**
```
You: What's the syntax for a Drizzle join?
Claude: [Uses Haiku for quick response]
```

## Manual Override

Force a specific model when needed:

```
You: Use opus - help me debug this authentication issue
You: Use haiku - what's the path to the workout page?
```

## Project Default

The default model is set in `.claude/settings.json`:

```json
{
  "model": "sonnet"
}
```

Override locally in `.claude/settings.local.json` (gitignored).
