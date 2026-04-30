# Zenox Backend (Express + PostgreSQL)

Backend API for **Zenox - Tasks & Earn** with role-based auth (`USER`, `ADMIN`), task system, wallet, withdrawals, and UPI verification.

## Stack

- Node.js + Express (JavaScript)
- PostgreSQL (`pg`)
- Cloudinary (image proof uploads)
- JWT auth (access + refresh)
- Multer memory upload + Cloudinary stream upload
- Zod validation

## Project Structure

```
backend/
  src/
    app.js
    server.js
    config/
    constants/
    controllers/
    db/
    middlewares/
    routes/
    utils/
    validations/
  sql/schema.sql
  uploads/
```

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run database migration:

```bash
npm run db:migrate
```

4. Seed admin user (admin is DB-only, no admin register route):

```bash
npm run db:seed
```

5. Start server:

```bash
npm run dev
```

6. Run full API integration test (success + validation + auth guards):

```bash
npm run test:apis
```

API base URL: `http://localhost:5000/api`

## Important Notes

- Admin registration is intentionally **not exposed**.
- Withdrawal request requires `UPI screenshot` upload (`multipart/form-data`, field name: `screenshot`).
- UPI verification request also requires screenshot upload.
- Screenshot proofs are uploaded to Cloudinary and stored as secure URLs.

## Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## User APIs

- `GET /api/user/dashboard`
- `GET /api/user/tasks`
- `GET /api/user/tasks/:taskId`
- `POST /api/user/tasks/:taskId/start`
- `POST /api/user/tasks/:taskId/complete`
- `GET /api/user/history`
- `GET /api/user/wallet`
- `POST /api/user/withdrawals` (with `screenshot`)
- `PATCH /api/user/profile`
- `GET /api/user/settings`
- `PATCH /api/user/settings`
- `GET /api/user/upi-verifications`
- `POST /api/user/upi-verifications` (with `screenshot`)

## Admin APIs

- `GET /api/admin/dashboard`
- `GET /api/admin/withdrawals`
- `PATCH /api/admin/withdrawals/:id`
- `GET /api/admin/upi-verifications`
- `PATCH /api/admin/upi-verifications/:id`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/tasks`
- `POST /api/admin/tasks`
- `PATCH /api/admin/tasks/:id`
- `DELETE /api/admin/tasks/:id`
