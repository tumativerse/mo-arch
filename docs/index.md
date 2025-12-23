---
slug: /
sidebar_position: 1
title: Mo Architecture
---

# Mo Architecture

> Mo isn't just an app — it's your training partner.

This is the technical documentation for the Mo fitness platform. Here you'll find the system architecture, API reference, and implementation details.

---

## Quick Links

| Resource | Description |
|----------|-------------|
| [Architecture Overview](./architecture/overview) | Mo Universe - domains, verticals, systems |
| [MVP Progress](./mvp) | Implementation phases and progress |
| [API Reference](./api/) | Endpoint documentation |
| [Database Schema](./database/schema) | Data models and relationships |

---

## Mo Universe

The Mo app is organized into 4 domains:

```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   MO:SELF     │ │   MO:PULSE    │ │   MO:COACH    │ │  MO:CONNECT   │
│               │ │               │ │               │ │               │
│  "This is    │ │ "Your daily   │ │  "Your smart  │ │ "Your link to │
│     you"      │ │    rhythm"    │ │    trainer"   │ │  the world"   │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘

     Foundation        Tracking        Intelligence       Ecosystem
```

| Domain | Role |
|--------|------|
| [MO:SELF](./mo-self/) | Knows who you are, what you want, where you've been |
| [MO:PULSE](./mo-pulse/) | Watches everything — workouts, body, recovery |
| [MO:COACH](./mo-coach/) | Thinks, adapts, learns, coaches |
| [MO:CONNECT](./mo-connect/) | Links you to devices, community, knowledge |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Drizzle ORM |
| **Auth** | Clerk |
| **Hosting** | Vercel |

---

## Related Resources

- [Mo Knowledge Base](https://modocs.tumati.me) — Nutrition, training, wellness content
- [mo-app Repository](https://github.com/tumativerse/mo-app) — Source code
