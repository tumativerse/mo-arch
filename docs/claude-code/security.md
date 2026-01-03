---
sidebar_position: 6
title: Security
description: Permissions and protected files
---

# Security

Claude Code operates with explicit permissions to protect sensitive files and prevent dangerous operations.

---

## Allowed Operations

### npm Commands

```
npm run *       # Any npm script
npm install *   # Install packages
npm test *      # Run tests
npx *           # Run npx commands
```

### Git Commands

```
git status      # Check status
git diff        # View changes
git log         # View history
git branch      # List branches
git checkout    # Switch branches
git add         # Stage files
```

### File Operations

```
ls              # List files
mkdir           # Create directories
Read            # Read file contents
Edit            # Edit files
Write           # Create files
Glob            # Find files by pattern
Grep            # Search file contents
```

### Web Operations

```
WebFetch        # Fetch web pages
WebSearch       # Search the web
```

---

## Denied Operations

### Sensitive Files

Claude cannot read:

| Pattern | Reason |
|---------|--------|
| `.env` | Environment secrets |
| `.env.local` | Local secrets |
| `.env.production` | Production secrets |
| `.env*.local` | Any local env file |
| `./secrets/**` | Secrets directory |
| `.git/config` | Git credentials |

### Dangerous Commands

Claude cannot run:

| Command | Reason |
|---------|--------|
| `curl` | Arbitrary network requests |
| `wget` | Arbitrary downloads |
| `rm -rf` | Destructive deletion |

---

## Configuration

Permissions are set in `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run:*)",
      "Bash(git status:*)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.local)",
      "Read(./secrets/**)",
      "Bash(curl:*)",
      "Bash(rm -rf:*)"
    ]
  }
}
```

---

## Local Overrides

Personal settings in `.claude/settings.local.json` (gitignored):

```json
{
  "model": "opus",
  "env": {
    "MO_DOCS_PATH": "/path/to/mo-docs"
  }
}
```

---

## MCP Servers

For additional integrations (GitHub, PostgreSQL), see the MCP setup guide in `.claude/MCP_SETUP.md`.

**Security notes for MCP:**

- Use environment variables for tokens
- Use read-only database credentials when possible
- Review MCP server permissions before enabling
