---
sidebar_position: 2
title: MoPrefs
---

# MoPrefs

> *"I know what you like"*

MoPrefs manages user preferences for training, equipment, and notifications.

---

## Systems

| System | Name | Status | Description |
|--------|------|--------|-------------|
| [MoSettings](./mo-settings) | *"The Customizer"* | ✅ Built | Training preferences, units |
| [MoGear](./mo-gear) | *"The Inventory"* | ✅ Built | Available equipment |
| [MoAlerts](./mo-alerts) | *"The Notifier"* | ❌ Future | Notifications, reminders |

---

## Vertical Interface

```typescript
interface MoPrefsInterface {
  // Settings
  getPreferences(userId: string): Promise<UserPreferences>;
  updatePreferences(userId: string, prefs: Partial<UserPreferences>): Promise<void>;

  // Equipment
  getEquipment(userId: string): Promise<EquipmentLevel>;
  setEquipment(userId: string, level: EquipmentLevel): Promise<void>;

  // Alerts (future)
  getAlertSettings(userId: string): Promise<AlertSettings>;
  setAlertSettings(userId: string, settings: AlertSettings): Promise<void>;
}
```

---

## Code Location

```
/lib/mo-self/preferences/
├── settings.ts     → MoSettings
└── index.ts        → Vertical exports
```
