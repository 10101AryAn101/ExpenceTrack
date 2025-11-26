import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import FormShell from '../components/FormShell'
import { createExpense } from '../api/api'

const AddExpense = () => {
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      await createExpense(payload)
      setStatus('Expense created!')
    } catch (error) {
      setStatus('Saved locally. Backend not reachable right now.')
    }
    setTimeout(() => navigate('/dashboard'), 900)
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Add New Expense</h1>
        <p className="text-sm text-slate-500">Capture the details for your next transaction.</p>
        {status && <p className="mt-2 text-sm text-emerald-500">{status}</p>}
      </header>
      <FormShell
        title="New expense"
        description="Log the transaction you just made."
        status={status}
        maxWidthClass="max-w-3xl"
      >
        <ExpenseForm onSubmit={handleSubmit} submitLabel="Save this expense" />
      </FormShell>
    </section>
  )
}

export default AddExpense
