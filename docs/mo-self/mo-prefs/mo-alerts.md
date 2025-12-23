---
sidebar_position: 3
title: MoAlerts
---

# MoAlerts

> *"The Notifier"* — "I remind you when it matters"

**Status:** ❌ Future

MoAlerts will manage notifications, reminders, and alerts for the user.

---

## Purpose

- Send workout reminders
- Notify about streak maintenance
- Alert on PR achievements
- Remind about recovery logging
- Weekly progress summaries

---

## Planned Implementation

### Code Location (Future)

```
/lib/mo-self/preferences/alerts.ts
```

### Key Functions (Planned)

```typescript
// Get alert settings
export async function getAlertSettings(userId: string): Promise<AlertSettings>

// Update alert settings
export async function updateAlertSettings(
  userId: string,
  settings: Partial<AlertSettings>
): Promise<AlertSettings>

// Send notification (internal)
export async function sendNotification(
  userId: string,
  notification: Notification
): Promise<void>
```

---

## Data Model

```typescript
interface AlertSettings {
  userId: string;

  // Workout reminders
  workoutReminderEnabled: boolean;
  workoutReminderTime: string;        // "09:00"
  workoutReminderDays: DayOfWeek[];

  // Streak alerts
  streakReminderEnabled: boolean;
  streakReminderHours: number;        // Hours before streak breaks

  // Achievement notifications
  prNotificationsEnabled: boolean;
  milestoneNotificationsEnabled: boolean;

  // Recovery
  recoveryReminderEnabled: boolean;
  recoveryReminderTime: string;

  // Summaries
  weeklyDigestEnabled: boolean;
  weeklyDigestDay: DayOfWeek;

  // Channels
  pushEnabled: boolean;
  emailEnabled: boolean;
}

interface Notification {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

type NotificationType =
  | 'workout_reminder'
  | 'streak_warning'
  | 'pr_achieved'
  | 'milestone_reached'
  | 'recovery_reminder'
  | 'weekly_digest';
```

---

## Planned API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts/settings` | GET | Get alert settings |
| `/api/alerts/settings` | PATCH | Update settings |
| `/api/alerts/test` | POST | Send test notification |

---

## Notification Triggers

| Event | Notification | Timing |
|-------|--------------|--------|
| Workout scheduled | Reminder | User-defined time |
| Streak about to break | Warning | X hours before 48hr window |
| New PR set | Achievement | Immediate |
| Recovery not logged | Reminder | Morning if not logged |
| Week complete | Summary | User-defined day |

---

## Integration Points

### Will Receive from:
- MoStreaks (streak warnings)
- MoRecords (PR achievements)
- MoSession (workout completion)
- MoRecover (recovery not logged)

### Will Provide to:
- Push notification service
- Email service
- In-app notification center

---

## Implementation Tasks

- [ ] Design notification system architecture
- [ ] Create alert_settings table
- [ ] Integrate push notification service (Expo/Firebase)
- [ ] Build notification preferences UI
- [ ] Implement scheduled reminders (cron)
- [ ] Create weekly digest generator
