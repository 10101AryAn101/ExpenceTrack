const ExpenseItem = ({ expense }) => {
  const isIncome = expense.type === 'income'
  const toLocalDate = (val) => {
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m, d] = val.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    if (typeof val === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(val)) {
      const [d, m, y] = val.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    return new Date(val)
  }
  const prettyDate = toLocalDate(expense.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{expense.title}</p>
        <p className="text-xs text-slate-500">{expense.category} • {prettyDate}</p>
      </div>
      <p className={`text-sm font-semibold ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isIncome ? '+' : '-'}₹{Number(expense.amount || 0).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

export default ExpenseItem
