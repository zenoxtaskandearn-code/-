# Zenox - Tasks & Earn

A premium modern web application for task-based earning with wallet management, withdrawals, and admin panel.

## Features

### User Features
- **Authentication**: Email/password login & registration (user only)
- **Dashboard**: Wallet balance, total earnings, total withdrawn, and task completion stats
- **Task Feed**: Browse tasks by category, view details, start tasks (redirects to external URL), mark complete
- **Wallet**: View balance, transaction history, submit withdrawal requests (requires UPI ID + screenshot proof)
- **History**: List of completed tasks with earned amounts
- **Profile**: Edit name, phone, profession
- **Settings**: Notification toggles (email, push) and profile privacy

### Admin Features
- **Dashboard**: Stats (total due payments, pending requests, total users, total paid) + recent requests
- **Withdrawals Management**: Approve, reject, or mark as paid with admin notes
- **UPI Verifications**: Verify or reject UPI screenshot proof submissions
- **User Management**: Search/filter users, block/activate accounts
- **Task Management**: Create, edit, delete tasks (title, category, description, reward, image URL, task URL, active status)

### Technical Highlights
- **Full-stack**: React/Vite frontend + Node.js/Express backend
- **Database**: Render PostgreSQL (raw SQL, no ORM)
- **File Upload**: UPI screenshots uploaded to Cloudinary (secure URLs stored)
- **Authentication**: JWT (access + refresh tokens) with role-based guards
- **Responsive Design**: Mobile, tablet, desktop layouts
- **UI**: MUI + custom styling, multiple fonts (Poppins, Roboto, Space Grotesk, Orbitron), animated icons (framer-motion + react-icons)
- **No empty sections**: Dense, human-made premium feel

## Project Structure
```
/backend   → Node.js/Express API
/src       → Source code (controllers, routes, middleware, utils, validations, db)
/sql       → Schema.sql
/uploads   → Local uploads placeholder (not used in production due to Cloudinary)

/frontend  → React/Vite app
/src       → Components, contexts, pages, lib, theme, styles
/public    → Static assets
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (we use Render PostgreSQL in example, but any Postgres works)
- Cloudinary account (for screenshot storage)

### Backend Setup
1. `cd backend`
2. Copy `.env.example` to `.env` and fill in the values:
   ```
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   DATABASE_URL=your_postgresql_connection_string
   DATABASE_SSL=true

   JWT_ACCESS_SECRET=your_long_random_secret
   JWT_REFRESH_SECRET=your_long_random_secret
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=zenox

   ADMIN_NAME=Zenox Admin
   ADMIN_EMAIL=admin@zenox.com
   ADMIN_PHONE=9999999999
   ADMIN_PROFESSION=Administrator
   ADMIN_PASSWORD=Admin@12345
   ```
3. Install dependencies: `npm install`
4. Migrate the database: `npm run db:migrate`
5. Seed the admin user: `npm run db:seed` (creates admin if not exists)
6. Start the server: `npm run dev` (runs on http://localhost:5000)

### Frontend Setup
1. `cd frontend`
2. Copy `.env.example` to `.env` and set:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install dependencies: `npm install`
4. Start development server: `npm run dev` (runs on http://localhost:5173)
5. For production build: `npm run build` (outputs to `/dist`)

## Deployment Hints
- **Frontend**: Deploy to Cloudflare Pages (recommended) or Render Static Site
- **Backend**: Deploy to Render Web Service (Node.js)
- **Database**: Keep using Render PostgreSQL (ensure `DATABASE_SSL=true` in backend .env)
- **CORS**: Set `FRONTEND_URL` in backend `.env` to your deployed frontend domain
- **Cloudinary**: Use your own credentials (update backend `.env`)

## API Overview
### Auth
- `POST /api/auth/register` (user only)
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### User
- `GET /api/user/dashboard`
- `GET /api/user/tasks`
- `GET /api/user/tasks/:taskId`
- `POST /api/user/tasks/:taskId/start`
- `POST /api/user/tasks/:taskId/complete`
- `GET /api/user/history`
- `GET /api/user/wallet`
- `POST /api/user/withdrawals` (multipart/form-data: upiId, amount, screenshot)
- `PATCH /api/user/profile`
- `GET /api/user/settings`
- `PATCH /api/user/settings`
- `GET /api/user/upi-verifications`
- `POST /api/user/upi-verifications` (multipart/form-data: upiId, screenshot)

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/withdrawals`
- `PATCH /api/admin/withdrawals/:id` (status: APPROVED/REJECTED/PAID + adminNote)
- `GET /api/admin/upi-verifications`
- `PATCH /api/admin/upi-verifications/:id` (status: VERIFIED/REJECTED + adminNote)
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status` (status: ACTIVE/BLOCKED)
- `GET /api/admin/tasks`
- `POST /api/admin/tasks`
- `PATCH /api/admin/tasks/:id`
- `DELETE /api/admin/tasks/:id`

## Design & UI Notes
- **Fonts**: Headings (Poppins), Body (Roboto), KPI numbers (Space Grotesk), Brand (Orbitron)
- **Colors**: Deep cyan (#0f8b8d), Gold (#ff9f1c), Sky (#4cb4c4), Dark background (#11212d)
- **Animated Icons**: Sparkles, Zap, Rocket, etc. using framer-motion + react-icons
- **Card Border Radius**: Set to 4px for a refined look
- **Responsive**: Mobile drawer sidebar, tablet compact sidebar, desktop fixed sidebar
- **No Empty Space**: Sections contain meaningful content, skeletons, or placeholder UI

## Screenshots (Imagined)
![Home Page](https://via.placeholder.com/800x450/0f8b8d/ffffff?text=Zenox+Home+Page)
![User Dashboard](https://via.placeholder.com/800x450/0f8b8d/ffffff?text=User+Dashboard)
![Task Details](https://via.placeholder.com/800x450/0f8b8d/ffffff?text=Task+Details)
![Admin Dashboard](https://via.placeholder.com/800x450/0f8b8d/ffffff?text=Admin+Dashboard)

## License
MIT

--- 
Built with ❤️ for premium task-earning experience.