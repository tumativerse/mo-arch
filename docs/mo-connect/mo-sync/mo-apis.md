---
sidebar_position: 3
title: MoAPIs
---

# MoAPIs

> *"The Gateway"* — "I connect to other services"

**Status:** ❌ Future

MoAPIs will handle third-party fitness service integrations beyond wearables and health platforms.

---

## Purpose

- Import workout history from other apps
- Sync with social fitness platforms
- Connect nutrition tracking services
- Enable data portability
- Extend Mo's capabilities

---

## Planned Integrations

### Strava
| Feature | Direction | Description |
|---------|-----------|-------------|
| Activities | Push | Share Mo workouts |
| Feed | Pull | See friend activity |
| Clubs | Read | Join fitness groups |

### MyFitnessPal
| Feature | Direction | Description |
|---------|-----------|-------------|
| Food Log | Pull | Import nutrition data |
| Weight | Pull | Sync weight entries |
| Macros | Pull | Get macro breakdown |

### Strong App (Import)
| Feature | Direction | Description |
|---------|-----------|-------------|
| Workout History | Pull (one-time) | Import past workouts |
| Exercise Names | Map | Match to Mo exercises |
| PRs | Pull | Import personal records |

### Other Planned
- Hevy (import)
- JEFIT (import)
- Fitbod (import)
- Cronometer (nutrition)

---

## Data Model

```typescript
interface ThirdPartyConnection {
  id: string;
  userId: string;
  service: ThirdPartyService;

  // OAuth
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;

  // Sync settings
  autoSync: boolean;
  syncDirection: 'push' | 'pull' | 'both';

  // Status
  status: ConnectionStatus;
  lastSyncAt: Date | null;

  createdAt: Date;
}

interface ImportJob {
  id: string;
  userId: string;
  service: ThirdPartyService;

  // Progress
  status: ImportStatus;
  totalItems: number;
  processedItems: number;

  // Results
  imported: {
    workouts: number;
    exercises: number;
    records: number;
  };

  errors: ImportError[];

  startedAt: Date;
  completedAt: Date | null;
}

type ThirdPartyService =
  | 'strava'
  | 'myfitnesspal'
  | 'strong'
  | 'hevy'
  | 'jefit'
  | 'fitbod'
  | 'cronometer';

type ImportStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
```

---

## Import Flow

```
1. User selects "Import from Strong"
2. Authenticate with Strong (if needed)
3. Fetch workout history
4. Show preview with exercise mapping
5. User confirms mapping corrections
6. Process import in background
7. Show import summary
```

---

## Exercise Mapping

When importing, map foreign exercises to Mo's exercise library:

```typescript
interface ExerciseMapping {
  foreignName: string;        // "Flat Barbell Bench Press"
  foreignService: string;     // "strong"

  moExerciseId: string;       // Match to MoExercises
  confidence: number;         // 0-1 match confidence

  userConfirmed: boolean;     // User verified mapping
}

// Mapping algorithm
function mapExercise(foreignName: string): ExerciseMatch {
  // 1. Exact name match
  // 2. Fuzzy name match (Levenshtein)
  // 3. Movement pattern match
  // 4. Manual mapping required
}
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/integrations` | GET | List connections |
| `/api/integrations/connect` | POST | OAuth connect |
| `/api/integrations/:id/sync` | POST | Trigger sync |
| `/api/integrations/import` | POST | Start import job |
| `/api/integrations/import/:id` | GET | Check import status |

---

## Rate Limiting & Quotas

Respect third-party API limits:

| Service | Rate Limit | Strategy |
|---------|------------|----------|
| Strava | 100/15min | Queue + backoff |
| MyFitnessPal | 200/hour | Batch requests |
| Strong | Export file | One-time import |

---

## Implementation Tasks

- [ ] OAuth flow infrastructure
- [ ] Strava integration
- [ ] Strong CSV import
- [ ] Exercise mapping system
- [ ] Import progress UI
- [ ] Sync settings management
