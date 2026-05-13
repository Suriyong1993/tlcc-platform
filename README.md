# My Church App — คริสตจักรชีวิตสุขสันต์

## Project Overview

AI-native church community platform. Production-grade monorepo with:
- **Mobile App** (React Native Expo) — สำหรับสมาชิกทั่วไป
- **Admin Dashboard** (Next.js 15) — สำหรับเจ้าหน้าที่
- **Backend API** (NestJS) — REST + WebSocket + Queue

Prototype version: v6.2 (HTML prototype แก้ bug + UX/UI ปรับปรุงแล้ว → ไฟล์เดิมอยู่ที่ `../files/`)

## Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Mobile | Expo Router, NativeWind, Zustand, React Query, React Hook Form, Zod |
| Web Admin | Next.js 15 (App Router), TailwindCSS |
| Backend | NestJS, Prisma ORM, PostgreSQL, Redis, Socket.IO, BullMQ |
| Monorepo | Turborepo, pnpm workspace |
| Auth | JWT + Refresh Token, bcrypt |
| AI | OpenRouter API integration |

## Getting Started

```bash
# Install dependencies (root)
pnpm install

# Start dev environment
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Run Prisma migrations
pnpm db:generate
pnpm db:migrate

# Start all apps
pnpm dev
```

## Monorepo Structure

```
My Church App/
├── apps/
│   ├── mobile/           # React Native Expo (มือถือ)
│   ├── admin/            # Next.js 15 Admin Dashboard
│   └── api/              # NestJS Backend API
│       ├── prisma/
│       │   └── schema.prisma   # Database schema (20 models)
│       └── src/
│           ├── modules/        # Feature modules (11)
│           ├── common/         # Shared services, guards, filters
│           ├── websocket/      # Socket.IO gateway
│           └── main.ts
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── sdk/              # API client SDK
│   └── ui/               # Shared UI components
└── infrastructure/       # Docker, nginx configs
```

## API Modules (11 modules)

| Module | Endpoints | Auth |
|---|---|---|
| auth | /auth/register, /auth/login, /auth/refresh | Public |
| users | /users/me, /users/profile | JWT |
| events | /events, /events/:id/register | JWT + Admin |
| prayers | /prayers, /prayers/:id/pray | JWT |
| chat | /chat/rooms, /chat/messages | JWT |
| reports | /reports, /reports/:id/publish | JWT + Admin |
| notifications | /notifications, /notifications/mark-all-read | JWT |
| groups | /groups, /groups/:id/join, /groups/:id/leave | JWT |
| ai | /ai/chat, /ai/history | JWT |
| payments | /payments, /payments/me | JWT |
| analytics | /analytics/dashboard | Admin only |

## Database (Prisma — 20 models)

User, Profile, Token, Group, GroupMember, Event, EventRegistration,
Report, ReportImage, Discussion, PrayerRequest, Prayer, ChatRoom,
ChatRoomMember, Message, Notification, Booking, Payment, AIRequest,
Activity, AuditLog, Bookmark

## Env Variables

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
OPENROUTER_API_KEY=...
PORT=3001
```

---

> Prototype (HTML) → อยู่ที่ `files/tlcc-prototype-v6.1-fixed.html`
> Audit report → `files/tlcc-audit-report.md`
> Production code → โฟลเดอร์นี้ (`My Church App/`)
