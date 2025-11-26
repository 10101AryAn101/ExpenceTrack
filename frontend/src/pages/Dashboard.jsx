import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchExpenses, createExpense } from '../api/api'
import LineChart from '../components/LineChart'
import ExpenseList from '../components/ExpenseList'
import SummaryCard from '../components/SummaryCard'
import { getUser } from '../utils/user'

// Loaded from backend
const initialExpenses = []

const Dashboard = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [incomeForm, setIncomeForm] = useState({ title: 'Income', amount: '', date: new Date().toISOString().slice(0,10) })
  const [incomeSubmitting, setIncomeSubmitting] = useState(false)

  const formatCurrency = (num) => `₹${(num || 0).toLocaleString('en-IN')}`

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || expense.category === category
      const dateValue = new Date(expense.date)
      const afterFrom = !dateRange.from || dateValue >= new Date(dateRange.from)
      const beforeTo = !dateRange.to || dateValue <= new Date(dateRange.to)
      return matchesSearch && matchesCategory && afterFrom && beforeTo
    })
  }, [search, category, dateRange, expenses])

  const totals = useMemo(() => {
    const totalExpenses = filteredExpenses
      .filter((e) => (e.type || 'expense') === 'expense')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const totalIncome = filteredExpenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const net = totalIncome - totalExpenses
    return { totalExpenses, totalIncome, net }
  }, [filteredExpenses])

  const expensesPerPage = 4
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / expensesPerPage))
  const pagedExpenses = filteredExpenses.slice(
    (currentPage - 1) * expensesPerPage,
    currentPage * expensesPerPage,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search, category, dateRange.from, dateRange.to])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await fetchExpenses()
        if (!cancelled) {
          const items = (data.items || data).map((e) => ({
            id: e._id || e.id,
            title: e.title,
            amount: e.amount,
            category: e.category,
            date: typeof e.date === 'string' ? e.date : new Date(e.date).toISOString().slice(0, 10),
            type: e.type || 'expense'
          }))
          setExpenses(items)
        }
      } catch (err) {
        if (!cancelled) {
          // On error (e.g., backend down), show empty state to avoid leaking previous user's data
          setExpenses([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    // Initial load
    load()

    // Reload on auth/user changes
    const handleUserChange = () => {
      setExpenses([])
      setCurrentPage(1)
      load()
    }
    window.addEventListener('userUpdated', handleUserChange)
    window.addEventListener('storage', handleUserChange)

    return () => {
      cancelled = true
      window.removeEventListener('userUpdated', handleUserChange)
      window.removeEventListener('storage', handleUserChange)
    }
  }, [])

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return
    setCurrentPage(nextPage)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total Expenses" amount={formatCurrency(totals.totalExpenses)} icon="💸" />
        <SummaryCard
          title="Total Income"
          amount={formatCurrency(totals.totalIncome)}
          icon="💰"
          actionLabel="ADD"
          onAction={() => setShowIncomeModal(true)}
        />
        <SummaryCard title="Net" amount={formatCurrency(totals.net)} icon={totals.net >= 0 ? '📈' : '📉'} />
      </div>
      <LineChart expenses={expenses} />
      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent expenses</h2>
            <p className="text-sm text-slate-500">Track your latest spending and explore the breakdown.</p>
          </div>
          <Link
            to="/expense/add"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active"
          >
            + Add expense
          </Link>
        </div>
        {/* Filters removed per request to keep UI simple */}
        <div className="mt-6 space-y-4">
          <ExpenseList
            expenses={pagedExpenses}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowIncomeModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add Income</h3>
            <p className="text-sm text-slate-500">Quickly add an income entry.</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()
                if (!incomeForm.amount || Number(incomeForm.amount) <= 0) return
                setIncomeSubmitting(true)
                try {
                  const payload = {
                    title: incomeForm.title || 'Income',
                    amount: Number(incomeForm.amount),
                    category: 'Other',
                    date: incomeForm.date,
                    type: 'income',
                    status: 'paid',
                  }
                  const { data: created } = await createExpense(payload)
                  const mapped = {
                    id: created._id || created.id,
                    title: created.title,
                    amount: created.amount,
                    category: created.category,
                    date:
                      typeof created.date === 'string'
                        ? created.date
                        : new Date(created.date).toISOString().slice(0, 10),
                    type: created.type || 'income',
                  }
                  setExpenses((prev) => [...prev, mapped])
                  setShowIncomeModal(false)
                  setIncomeForm({ title: 'Income', amount: '', date: new Date().toISOString().slice(0, 10) })
                  window.dispatchEvent(new Event('expensesUpdated'))
                } catch (err) {
                  // keep modal open; optionally show error UI in future
                } finally {
                  setIncomeSubmitting(false)
                }
              }}
            >
              <div>
                <label className="text-sm font-semibold text-slate-700">Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm((p) => ({ ...p, amount: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  value={incomeForm.title}
                  onChange={(e) => setIncomeForm((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  value={incomeForm.date}
                  onChange={(e) => setIncomeForm((p) => ({ ...p, date: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => setShowIncomeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={incomeSubmitting}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-80"
                >
                  {incomeSubmitting ? 'Adding…' : 'Add Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

 
