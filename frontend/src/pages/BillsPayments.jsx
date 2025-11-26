const upcomingBills = [
  { id: 1, title: 'Electricity Bill', due: '28 Nov 2025', amount: 2890, status: 'Pending' },
  { id: 2, title: 'Water Services', due: '02 Dec 2025', amount: 620, status: 'Pending' },
  { id: 3, title: 'Wi-Fi Subscription', due: '04 Dec 2025', amount: 1499, status: 'Scheduled' },
  { id: 4, title: 'Gym Membership', due: '15 Dec 2025', amount: 1200, status: 'Paid' },
]

const BillsPayments = () => (
  <div className="space-y-6">
    <section className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Bills & Payments</p>
          <h1 className="text-2xl font-bold text-slate-900">Track due dates</h1>
          <p className="text-sm text-slate-500">Pay on time and keep subscriptions in sync with your budget.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">Paid</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">Pending</span>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {upcomingBills.map((bill) => (
          <article
            key={bill.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{bill.title}</p>
              <p className="text-xs text-slate-500">Due {bill.due}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">₹{bill.amount.toLocaleString()}</p>
              <p
                className={`text-xs font-semibold ${bill.status === 'Paid' ? 'text-emerald-500' : 'text-amber-600'}`}
              >
                {bill.status}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
    <section className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Payments history</h2>
        <p className="text-sm text-slate-500">Last 30 days</p>
      </div>
      <div className="mt-4 space-y-4">
        {upcomingBills.map((bill) => (
          <div key={bill.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{bill.title}</p>
              <p className="text-xs text-slate-500">Paid on {bill.due}</p>
            </div>
            <p
              className={`text-sm font-bold ${bill.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {bill.status === 'Paid' ? '+' : '-'}₹{bill.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  </div>
)

export default BillsPayments
