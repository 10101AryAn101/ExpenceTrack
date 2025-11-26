import { Router } from 'express'
import Joi from 'joi'
import { authRequired } from '../middleware/auth.js'
import Expense from '../models/Expense.js'

const router = Router()

const expenseSchema = Joi.object({
  title: Joi.string().min(2).required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().valid('Food', 'Bills', 'Travel', 'Shopping', 'Entertainment', 'Other').required(),
  type: Joi.string().valid('expense', 'income').default('expense'),
  status: Joi.string().valid('paid', 'pending').default('pending'),
  date: Joi.date().required(),
  notes: Joi.string().allow('', null)
})

router.get('/', authRequired, async (req, res, next) => {
  try {
    const { category, status, q, page = 1, limit = 10, type } = req.query
    const filter = { userId: req.user.id }
    if (category) filter.category = category
    if (status) filter.status = status
    if (type) filter.type = type
    if (q) filter.title = { $regex: q, $options: 'i' }

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(filter)
    ])
    res.json({ items, total, page: Number(page), limit: Number(limit) })
  } catch (e) { next(e) }
})

router.post('/', authRequired, async (req, res, next) => {
  try {
    const { value, error } = expenseSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })
    const created = await Expense.create({ ...value, userId: req.user.id })
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const { value, error } = expenseSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.message })
    const updated = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, value, { new: true })
    if (!updated) return res.status(404).json({ message: 'Not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ message: 'Not found' })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router
