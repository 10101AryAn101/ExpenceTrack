import { Router } from 'express'
import Joi from 'joi'
import { authRequired } from '../middleware/auth.js'
import User from '../models/User.js'

const router = Router()

router.get('/:id', authRequired, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    const user = await User.findById(req.user.id)
    res.json({ id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl })
  } catch (e) { next(e) }
})

const updateSchema = Joi.object({
  name: Joi.string().min(2),
  // Accept http(s) URLs and data URLs for simple uploads
  avatarUrl: Joi.string()
    .pattern(/^data:image\/(png|jpg|jpeg);base64,[A-Za-z0-9+/=]+$/)
    .message('avatarUrl must be a valid data URL')
    .allow('', null)
    .optional()
    .concat(Joi.string().uri().optional())
})

router.put('/:id', authRequired, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    const { value, error } = updateSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })
    const user = await User.findByIdAndUpdate(req.user.id, value, { new: true })
    res.json({ id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl })
  } catch (e) { next(e) }
})

export default router
