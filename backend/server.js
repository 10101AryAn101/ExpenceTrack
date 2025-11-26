import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'
import expenseRoutes from './src/routes/expense.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Validate required environment variables early
if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string' || !process.env.MONGO_URI.trim()) {
  console.error('Missing MONGO_URI in .env. Create backend/.env and set a valid MongoDB Atlas URI including a database name (e.g., /expensetrack).')
  // Do not hard-exit; start server so health/CORS errors can be observed.
  // Returning here will skip DB connection; API endpoints relying on DB will fail gracefully.
}

// Attempt to connect to MongoDB with retry to avoid immediate process exit
const connectWithRetry = async () => {
  if (!process.env.MONGO_URI) return
  try {
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('Mongo connection error:', err.message)
    console.error('Retrying MongoDB connection in 5s…')
    setTimeout(connectWithRetry, 5000)
  }
}
connectWithRetry()

app.use(helmet())

// Flexible CORS: support multiple dev origins via CLIENT_URLS (comma-separated) or fallback to CLIENT_URL
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (e.g., Postman with no Origin)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`Not allowed by CORS: ${origin}`))
    },
    credentials: true,
  }),
)
// Increase JSON payload limit to support base64 avatars (default ~100kb)
app.use(express.json({ limit: process.env.JSON_LIMIT || '5mb' }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/expenses', expenseRoutes)

app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

// Global process-level error hooks to aid troubleshooting
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
