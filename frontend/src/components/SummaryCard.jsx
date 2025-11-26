const SummaryCard = ({ title, amount, icon, trend, actionLabel, onAction }) => (
  <article className="rounded-3xl bg-white px-6 py-5 shadow-md">
    {/* 2x2 grid ensures SET sits below icon and inline with amount */}
    <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-3">
      {/* Row 1 */}
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      <div className="justify-self-end text-lg">{icon}</div>

      {/* Row 2 */}
      <div className="mt-1 text-3xl font-bold text-slate-900">{amount}</div>
      <div className="mt-1 justify-self-end">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600 hover:text-white"
            aria-label={actionLabel || 'ADD'}
            title={actionLabel || 'ADD'}
          >
            {actionLabel || 'ADD'}
          </button>
        )}
      </div>
    </div>
    {trend && <p className="mt-3 text-xs text-slate-500">{trend}</p>}
  </article>
)

export default SummaryCard
