<<<<<<< HEAD
# ExpenseTrack – Smart Expense Manager

Modern full‑stack expense tracking application with authenticated, per‑user data, responsive dashboard analytics (daily expense/income line chart), and CRUD for expenses & quick income adds.

**Stack**  
Frontend: React (Vite) + Tailwind CSS + React Router + Axios + Chart.js  
Backend: Node.js (Express) + MongoDB Atlas (Mongoose) + JWT Auth + bcrypt + Joi + Helmet + CORS + Morgan

## Setup

### Frontend
```powershell
cd c:\Users\Aryan\OneDrive\Desktop\ExpenseTracker\frontend
npm install
# Create .env (do NOT commit) with:
# VITE_API_URL=http://localhost:5000/api
npm run dev -- --host
```

### Backend
```powershell
cd c:\Users\Aryan\OneDrive\Desktop\ExpenseTracker\backend
npm install
copy .env.example .env
# Edit .env to set: MONGO_URI (Atlas URI), JWT_SECRET
# Allow your local IP in Atlas Network Access or use 0.0.0.0/0 for dev only.
# Server retries Mongo connection every 5s if unreachable.
npm run dev
```

## API Endpoints (JWT required except register/login)

Auth:
- POST /api/auth/register
- POST /api/auth/login

Users:
- GET /api/users/:id (JWT)
- PUT /api/users/:id (JWT)

Expenses:
- GET /api/expenses (JWT, supports q, category, status, type, page, limit)
- POST /api/expenses (JWT)
- PUT /api/expenses/:id (JWT)
- DELETE /api/expenses/:id (JWT)

## Frontend Wiring & State
- axios baseURL: `src/api/api.js` uses `import.meta.env.VITE_API_URL`
- Protected routes: `src/components/ProtectedRoute.jsx` check token in localStorage
- After login/register, token saved via `src/utils/auth.js` then redirect to `/dashboard`

## Security & Validation
- Password hashing: bcrypt
- JWT issuance/validation: jsonwebtoken
- Auth middleware protects private routes
- Helmet, CORS, validation via Joi, centralized error handler

## Postman
Import `postman_collection.json` at repository root.  
Set `{{token}}` and `{{userId}}` after login.

## Features
- Auth: Register/Login with JWT; protected routes.
- Profile: Update name and Upload/Change Profile Picture
- Expenses: Create, edit, delete per-user entries; income vs expense types.
- Dashboard: Dynamic totals (expenses, income, net), daily trend chart (7D / 14D / 30D / 90D ranges with local date normalization).
- Recent Activity: Scrollable sidebar history; updates live on changes.
- Quick Income: Inline "ADD" action opens modal to log income instantly.
- Empty State Handling: New users see blank dashboard until they add data.
- Performance: Minimal re-renders via `useMemo`; data normalized client-side.

## Scaling Notes / Next Steps
- Modular routers (`auth`, `users`, `expenses`) and services via Mongoose models
- Add rate limiting (express-rate-limit) and request validation per route
- Production: deploy backend on a managed host, set `CLIENT_URL` and CORS properly
- Observability: add request IDs, log aggregation, health checks
- Caching: per-user summaries via Redis; pagination for lists
- CI/CD: Lint/test/build, run `npm run build` for frontend and `npm start` for backend

## Local Verification Before Submission
1. Start backend: `npm run dev` (see "MongoDB connected" or retry logs).
2. Start frontend: `npm run dev -- --host` and open `http://localhost:5173`.
3. Register account, verify avatar upload, add expense + income, confirm chart updates.
4. Check Recent Activity scroll & button position.
5. Run lint & build: `npm run lint` / `npm run build` (frontend), `npm start` (backend).
6. Ensure no secrets committed: Only `.env.example` in repo.

## Submission Package
- GitHub repository link (no real secrets).
- Postman collection (`postman_collection.json`).
- Short README screenshots or a demo video link (login, add expense, chart update, income add).
- Brief feature summary (can reuse Features section).


=======
# ExpenceTrack
Track expenses and income with a clean UI, quick add, and day‑by‑day trend charts. Built with React/Vite/Tailwind and a secure Express/MongoDB API (JWT-protected).
>>>>>>> 54c4013bec0d331401bc29769e29da72eec31af9
