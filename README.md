# ExpenceTrack (ExpenseTrack)

Smart expense & income manager with protected user accounts, CRUD operations, dashboard analytics and profile management.

## Implemented
User registration & login (JWT + bcrypt)  
Protected routes for dashboard & profile  
CRUD for expenses (create / read / update / delete)  
Search & basic filters (category, date range)  
Dashboard with summary cards and line chart (7D / 14D / 30D / 90D)  
Profile management 
Recent activity sidebar + quick income "ADD" action

## Tech Stack
Frontend: React (Vite), Tailwind CSS, React Router, Axios, Chart.js  
Backend: Node.js (Express), MongoDB Atlas (Mongoose), JWT, bcrypt, CORS

## Run Locally
1. Backend:
	- `cd backend`
	- `npm install`
	- Copy `.env.example` to `.env` and set `MONGO_URI` + `JWT_SECRET`
	- `npm run dev` (wait for "API server running" + "MongoDB connected" or retry logs)
2. Frontend:
	- `cd frontend`
	- `npm install`
	- Create `.env` with `VITE_API_URL=http://localhost:5000/api`
	- `npm run dev` then open the printed localhost URL
3. Register a user, then login to see the dashboard (empty until you add data).
4. Add an expense and use the Income "ADD" button to verify totals, chart and recent activity update immediately.

## API Overview
Auth: `POST /api/auth/register`, `POST /api/auth/login`  
Users: `GET /api/users/:id`, `PUT /api/users/:id` (JWT)  
Expenses: `GET /api/expenses`, `POST /api/expenses`, `PUT /api/expenses/:id`, `DELETE /api/expenses/:id` (JWT)

## Attachments
- Postman collection: `postman_collection.json` (import into Postman; set `token` after login).
- Screenshots: `screenshots/` folder (UI samples: login, dashboard, add expense, profile).

## Environment Files
- `backend/.env.example` (template) – do not put secrets in commits.
- `backend/.env` (local only) – contains `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES`.
- `frontend/.env` – `VITE_API_URL=http://localhost:5000/api`.


