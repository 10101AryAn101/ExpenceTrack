# ExpenseTrack – Smart Expense Manager

ExpenseTrack is a React + Vite frontend scaffolded for the MERN stack. It ships with Tailwind CSS, Chart.js, React Router, Axios helpers, and a component architecture optimized for modern expense tracking.

## Setup

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Build production assets: `npm run build`
4. Preview the build locally: `npm run preview`

## Environment

- The default backend base URL is `http://localhost:5000/api`. To change it, set `VITE_API_URL` in a `.env` file before running the dev server.
- Authentication helpers in `src/utils/auth.js` manage the JWT token, and `src/api/api.js` automatically attaches `Authorization: Bearer <token>` headers via an Axios interceptor.

## Component entry points

- **Pages**: `src/pages/Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `Profile.jsx`, `AddExpense.jsx`, `EditExpense.jsx`.
- **Shared UI**: `src/components/AppShell.jsx`, `Sidebar.jsx`, `Navbar.jsx`, `SummaryCard.jsx`, `LineChart.jsx`, `ExpenseList.jsx`, `ExpenseForm.jsx`, `TransactionHistory.jsx`, `ProtectedRoute.jsx`.
- The main router and guard live in `src/App.jsx`, which mounts `AppShell` for authenticated routes and uses `ProtectedRoute` to redirect unauthenticated users to `/login`.

## Backend wiring

Prepare the following MERN-style REST APIs to connect the frontend to a Node/Express backend:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/users/:id`
- `PUT /api/users/:id`

`src/api/api.js` already exports helper wrappers (`loginUser`, `registerUser`, `fetchExpenses`, `createExpense`, `updateExpense`, `deleteExpense`, `fetchUserProfile`, `updateUserProfile`), so simply returning the expected payloads (especially `{ token }` for auth) lets these components talk to the backend immediately.
