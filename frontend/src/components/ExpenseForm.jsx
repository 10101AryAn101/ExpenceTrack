import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

const categoryOptions = ['Food', 'Bills', 'Travel', 'Shopping', 'Entertainment', 'Other']

const ExpenseForm = ({ initialData = {}, onSubmit, submitLabel = 'Save Expense' }) => {
  const [values, setValues] = useState({
    title: initialData.title || '',
    amount: initialData.amount || '',
    category: initialData.category || 'Food',
    date: initialData.date || dayjs().format('YYYY-MM-DD'),
    notes: initialData.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const currentErrors = {}
    if (!values.title.trim()) currentErrors.title = 'Title is required.'
    if (!values.amount || Number(values.amount) <= 0) currentErrors.amount = 'Amount must be greater than 0.'
    if (!values.category) currentErrors.category = 'Choose a category.'
    if (!values.date) currentErrors.date = 'Date is required.'
    setErrors(currentErrors)
    return Object.keys(currentErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await onSubmit({ ...values, amount: Number(values.amount) })
    setSubmitting(false)
  }

  const today = useMemo(() => dayjs().format('YYYY-MM-DD'), [])

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="amount">
          Amount (₹)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={values.amount}
          onChange={handleChange}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
        {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={values.date}
            max={today}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active disabled:opacity-80"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

export default ExpenseForm
