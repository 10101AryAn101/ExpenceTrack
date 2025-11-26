import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['Food', 'Bills', 'Travel', 'Shopping', 'Entertainment', 'Other'], required: true },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  date: { type: Date, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('Expense', expenseSchema)
