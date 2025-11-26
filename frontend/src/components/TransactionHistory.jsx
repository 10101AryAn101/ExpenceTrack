import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchExpenses } from '../api/api'

const TransactionHistory = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await fetchExpenses({ page: 1, limit: 5 })
        if (!cancelled) setItems((data.items || data || []).slice(0, 5))
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    const handleUser = () => load()
    const handleExpensesUpdated = () => load()
    window.addEventListener('userUpdated', handleUser)
    window.addEventListener('storage', handleUser)
    window.addEventListener('expensesUpdated', handleExpensesUpdated)
    return () => {
      cancelled = true
      window.removeEventListener('userUpdated', handleUser)
      window.removeEventListener('storage', handleUser)
      window.removeEventListener('expensesUpdated', handleExpensesUpdated)
    }
  }, [])

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">Your Transaction History</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Recent activity</h2>
      </div>
      {/* Let the aside scroll; keep button in original position */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-100 px-4 py-3">
              <div className="h-4 w-3/4 rounded bg-slate-300" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-300" />
            </div>
          ))
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        ) : (
          items.map((tx) => (
            <div key={tx._id || tx.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 shadow-inner">
              <div>
                <p className="text-sm font-semibold text-slate-900">{tx.title}</p>
                <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
              </p>
            </div>
          ))
        )}
      </div>
      <Link
        to="/expense/add"
        className="block rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active"
      >
        Add New Transaction
      </Link>
    </div>
  )
}

export default TransactionHistory
