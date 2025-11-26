import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import User from '../models/User.js'

const router = Router()

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

router.post('/register', async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const exists = await User.findOne({ email: value.email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const hash = await bcrypt.hash(value.password, 10)
    const user = await User.create({ name: value.name, email: value.email, passwordHash: hash })

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } })
  } catch (e) { next(e) }
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

router.post('/login', async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })

    const user = await User.findOne({ email: value.email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(value.password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } })
  } catch (e) { next(e) }
})

export default router
