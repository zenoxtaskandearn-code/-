# Zenox Frontend

Premium responsive React frontend for Zenox - Tasks & Earn.

## Setup

1. Copy env:

```bash
cp .env.example .env
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Build:

```bash
npm run build
```

## Architecture

- `src/components/` reusable UI blocks and layouts
- `src/context/` auth/session provider
- `src/lib/` API clients and shared utilities
- `src/pages/public/` home + auth
- `src/pages/user/` user dashboard and task flows
- `src/pages/admin/` admin panel pages

## Routing

- Public: `/`, `/login`, `/register`
- User: `/app/dashboard`, `/app/tasks`, `/app/tasks/:taskId`, `/app/history`, `/app/profile`, `/app/wallet`, `/app/settings`
- Admin: `/admin/dashboard`, `/admin/withdrawals`, `/admin/upi-verifications`, `/admin/users`, `/admin/tasks`
