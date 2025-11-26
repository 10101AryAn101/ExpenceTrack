import ExpenseItem from './ExpenseItem'

const ExpenseList = ({ expenses, loading, currentPage, totalPages, onPageChange }) => (
  <div className="space-y-3">
    {loading ? (
      Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl bg-slate-100 p-4">
          <div className="h-4 w-3/4 rounded bg-slate-300" />
          <div className="mt-3 flex justify-between">
            <span className="h-4 w-1/3 rounded bg-slate-300" />
            <span className="h-4 w-1/4 rounded bg-slate-300" />
          </div>
        </div>
      ))
    ) : expenses.length === 0 ? (
      <p className="text-sm text-slate-500">No recent activity yet.</p>
    ) : (
      expenses.map((expense) => <ExpenseItem key={expense.id} expense={expense} />)
    )}
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Page {currentPage} of {totalPages || 1}
      </p>
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600 hover:text-white hover:shadow-xl disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:border-slate-100 disabled:hover:text-slate-300 disabled:hover:from-transparent disabled:hover:via-transparent disabled:hover:to-transparent"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600 hover:text-white hover:shadow-xl disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:border-slate-100 disabled:hover:text-slate-300 disabled:hover:from-transparent disabled:hover:via-transparent disabled:hover:to-transparent"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)

export default ExpenseList
