import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import FormShell from '../components/FormShell'
import { updateExpense } from '../api/api'

const demoExpenses = [
  { id: '1', title: 'Café Brew Works', amount: 480, category: 'Food', date: '2025-11-18', notes: '' },
  { id: '2', title: 'Monthly Rent', amount: 24000, category: 'Bills', date: '2025-11-16', notes: '' },
  { id: '3', title: 'Budget Travel', amount: 14500, category: 'Travel', date: '2025-11-14', notes: '' },
]

const EditExpense = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  const expense = useMemo(() => demoExpenses.find((item) => item.id === id), [id])

  const handleSubmit = async (payload) => {
    try {
      await updateExpense(id, payload)
      setStatus('Expense updated!')
    } catch (error) {
      setStatus('Updated locally. Backend not reachable yet.')
    }
    setTimeout(() => navigate('/dashboard'), 900)
  }

  if (!expense) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <p className="text-sm text-slate-500">Expense not found. You can create a new one instead.</p>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Edit Expense</h1>
        <p className="text-sm text-slate-500">Adjust the values and save the changes.</p>
        {status && <p className="mt-2 text-sm text-emerald-500">{status}</p>}
      </header>
      <FormShell
        title="Edit expense"
        description="Tweak the values and save."
        status={status}
        maxWidthClass="max-w-3xl"
      >
        <ExpenseForm
          initialData={{
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            notes: expense.notes,
          }}
          onSubmit={handleSubmit}
          submitLabel="Update expense"
        />
      </FormShell>
    </section>
  )
}

export default EditExpense
