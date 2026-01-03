---
sidebar_position: 1
title: Claude Code Configuration
description: AI-assisted development setup for Mo App
---

# Claude Code Configuration

Complete documentation of the Claude Code setup for Mo App development.

## Quick Start

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Open project
cd /path/to/mo-app
claude
```

## Overview

The Mo App uses Claude Code with a comprehensive configuration including:

- **Automatic model selection** based on task complexity
- **8 specialized agents** for different task types
- **5 code generation skills** for consistent patterns
- **7 workflow commands** for common operations
- **4 coding rules** auto-applied by file type
- **Security permissions** to protect sensitive files
- **Auto-formatting hooks** for code quality

## Configuration Location

All configuration lives in the `.claude/` directory of mo-app:

```
mo-app/.claude/
├── settings.json          # Permissions, hooks, model default
├── settings.local.json    # Personal overrides (gitignored)
├── MEMORY.md              # Persistent project context
├── agents/                # Specialized task agents
├── rules/                 # Path-specific coding standards
├── skills/                # Code generation templates
└── commands/              # Workflow commands
```

## Documentation

| Page | Description |
|------|-------------|
| [Model Selection](./models) | When to use Opus, Sonnet, or Haiku |
| [Agents](./agents) | Specialized assistants for specific tasks |
| [Skills & Commands](./skills-commands) | Code generation and workflows |
| [Rules & Hooks](./rules-hooks) | Auto-applied standards and formatting |
| [Security](./security) | Permissions and protected files |
