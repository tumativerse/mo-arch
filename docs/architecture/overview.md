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

## The Four Domains

| Domain | Name | Personality | Role |
|--------|------|-------------|------|
| Foundation | **MO:SELF** | "The Memory" | Knows who you are, what you want, where you've been |
| Tracking | **MO:PULSE** | "The Observer" | Watches everything — workouts, body, recovery, fuel |
| Intelligence | **MO:COACH** | "The Brain" | Thinks, adapts, learns, coaches |
| Ecosystem | **MO:CONNECT** | "The Connector" | Links you to devices, community, knowledge |

### Domain Flow

```
MO:SELF      →    MO:PULSE    →    MO:COACH     →    MO:CONNECT
   │                  │                │                  │
"Who you are"  "What you do"   "How to improve"   "Share & sync"
```

---

## Data Flow

```
                              ┌─────────────┐
                              │  MO:COACH   │
                              │             │
                              │  Analyzes   │
                              │  Decides    │
                              │  Recommends │
                              └──────┬──────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                          ▼                     │
┌─────────────┐    ┌─────────────┐              │
│  MO:SELF    │───▶│  MO:PULSE   │──────────────┘
│             │    │             │
│  Provides   │    │  Collects   │
│  Context    │    │  Data       │
└─────────────┘    └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ MO:CONNECT  │
                   │             │
                   │  Syncs      │
                   │  Shares     │
                   │  Provides   │
                   └─────────────┘
```

### Interactions

```
MO:SELF provides to all domains:
├── User identity and preferences
├── Equipment availability
├── Training history context
└── Goal information

MO:PULSE sends to MO:COACH:
├── Workout session data (sets, reps, RPE)
├── Recovery logs (sleep, energy, soreness)
├── Body metrics (weight, measurements)
└── Nutrition data (meals, macros)

MO:COACH returns to MO:PULSE:
├── Fatigue status and recommendations
├── Progression decisions
├── Weight and set suggestions
└── Deload instructions

MO:CONNECT exchanges with all:
├── Syncs wearable data → MO:PULSE
├── Provides exercise library → MO:PULSE
├── Shares achievements → MO:SELF
└── Publishes workouts → External
```

---

## Current Status

| Domain | Verticals | Systems | Completion |
|--------|-----------|---------|------------|
| MO:SELF | 3/3 | 7/9 | 78% |
| MO:PULSE | 3/4 | 8/13 | 62% |
| MO:COACH | 2/3 | 5/9 | 56% |
| MO:CONNECT | 1/3 | 2/9 | 22% |

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
Wake up → Log recovery (MO:PULSE)
Check app → See status (MO:COACH)
Workout → Log sets (MO:PULSE)
Post-workout → See progress (MO:COACH)
Share → Post results (MO:CONNECT)
```
