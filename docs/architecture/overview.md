---
sidebar_position: 1
title: Overview
---

# Architecture Overview

## Hierarchy

```
DOMAIN (4) → VERTICAL (12) → SYSTEM (30+)
```

| Level | Purpose | Naming Pattern | Example |
|-------|---------|----------------|---------|
| Domain | Strategic boundaries | `MO:NAME` | MO:COACH |
| Vertical | Functional areas | `MoName` | MoAdapt |
| System | Specific implementations | `MoName` | MoFatigue |

---

## The Six Domains

| Domain | Name | Personality | Role |
|--------|------|-------------|------|
| Foundation | **MO:SELF** | "The Memory" | Knows who you are, what you want, where you've been |
| Tracking | **MO:PULSE** | "The Observer" | Watches everything — workouts, body, recovery, fuel |
| Training | **MO:COACH** | "The Trainer" | Plans workouts, manages progression, prevents overtraining |
| Strategy | **MO:JOURNEY** | "The Navigator" | Guides you toward goals, tracks progress, celebrates milestones |
| Intelligence | **MO:MIND** | "The Advisor" | Analyzes data, detects patterns, provides recommendations |
| Ecosystem | **MO:CONNECT** | "The Connector" | Links you to devices, community, knowledge |

### Domain Flow

```
                    MO:JOURNEY (Strategic Orchestrator)
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
MO:SELF      →    MO:PULSE    →    MO:COACH     →    MO:CONNECT
   │                  │                │                  │
"Who you are"  "What you do"      "Training"       "Share & sync"
                    │
                    ▼
                 MO:MIND
                    │
            "Why & What's Next"
```

**New Strategic Flow:**
1. **MO:JOURNEY** orchestrates all domains to serve your goals
2. **MO:MIND** provides intelligence to all domains
3. Data domains (SELF, PULSE, COACH) handle "what" and "how"
4. Intelligence layers (JOURNEY, MIND) handle "why" and "what's next"

---

## Data Flow

```
                    ┌─────────────┐
                    │ MO:JOURNEY  │ ← Home Screen (Goals Page)
                    │ (Strategy)  │
                    └──────┬──────┘
                           │
                    Orchestrates
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │  MO:SELF    │───▶│  MO:PULSE   │───▶│  MO:COACH   │
 │ (Identity)  │    │ (Tracking)  │    │ (Training)  │
 └─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    Provides Data
                           │
                           ▼
                    ┌─────────────┐
                    │   MO:MIND   │
                    │(Intelligence)│
                    └──────┬──────┘
                           │
                    Returns Insights
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │ MO:JOURNEY  │    │  MO:PULSE   │    │  MO:COACH   │
 │(Recommendations) │(Nutrition)  │    │(Progression)│
 └─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ MO:CONNECT  │
                    │ (Ecosystem) │
                    └─────────────┘
```

### Interactions

```
MO:JOURNEY orchestrates:
├── Consults MO:MIND for intelligent recommendations
├── Fetches progress data from MO:PULSE (measurements, workouts)
├── Displays unified view on Goals page (home screen)
└── Drives all other features (workouts serve goals)

MO:MIND analyzes data from:
├── MO:JOURNEY → Goals, measurements
├── MO:PULSE → Workouts, recovery, nutrition
├── MO:COACH → Fatigue, progression
└── Returns recommendations to all domains

MO:SELF provides to all domains:
├── User identity and preferences
├── Equipment availability
├── Training history context
└── Goal information

MO:PULSE sends to MO:COACH and MO:MIND:
├── Workout session data (sets, reps, RPE)
├── Recovery logs (sleep, energy, soreness)
├── Body metrics (weight, measurements)
└── Nutrition data (meals, macros)

MO:COACH returns to MO:PULSE and MO:MIND:
├── Fatigue status and recommendations
├── Progression decisions
├── Weight and set suggestions
└── Deload instructions

MO:CONNECT exchanges with all:
├── Syncs wearable data → MO:PULSE
├── Provides exercise library → MO:PULSE
├── Shares achievements → MO:JOURNEY, MO:SELF
└── Publishes workouts → External
```

---

## Current Status

| Domain | Verticals | Systems | Completion |
|--------|-----------|---------|------------|
| MO:SELF | 3/3 | 7/9 | 78% |
| MO:PULSE | 3/4 | 8/13 | 62% |
| MO:COACH | 2/3 | 5/9 | 56% |
| MO:JOURNEY | 0/3 | 0/9 | 0% (New - In Planning) |
| MO:MIND | 0/4 | 0/5 | 0% (New - In Planning) |
| MO:CONNECT | 1/3 | 2/9 | 22% |

**New Domains (January 2026):**
- **MO:JOURNEY**: Strategic orchestration domain for goals and progress tracking
- **MO:MIND**: Centralized intelligence domain with agent-based architecture

---

## Design Principles

### 1. Domain Isolation
Each domain is as independent as possible. Cross-domain communication happens through defined interfaces only.

### 2. Data Ownership
Each system owns its data. Other systems request data through the owning system's interface.

### 3. Single Responsibility
Each system does one thing well. If a system grows too complex, split it.

### 4. Progressive Enhancement
Core features (MO:PULSE, MO:COACH) work without optional features (MO:CONNECT social, wearables).

### 5. User-Centric Flow
The architecture follows the user's daily journey:
```
Wake up → Open app (MO:JOURNEY - Goals Page)
See goals → Get recommendation (MO:MIND)
Follow recommendation → Log weight/workout (MO:PULSE)
After workout → See progress update (MO:JOURNEY)
Share → Post achievement (MO:CONNECT)
```

### 6. Goals-First Philosophy (New - January 2026)
Everything serves the user's goals:
```
Goals (MO:JOURNEY) drive:
├── What to do today (MO:MIND recommendation)
├── How to train (MO:COACH progression)
├── What to eat (MO:PULSE nutrition)
└── When to rest (MO:MIND recovery analysis)
```
