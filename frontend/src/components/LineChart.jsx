import { useEffect, useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const tabs = [
  { id: '7D', label: '7D', days: 7 },
  { id: '14D', label: '14D', days: 14 },
  { id: '30D', label: '30D', days: 30 },
  { id: '90D', label: '90D', days: 90 },
]

const LineChart = ({ expenses = [] }) => {
  const [selectedRange, setSelectedRange] = useState('7D')

  // Build time series for selected range
  const { labels, expensesSeries, incomeSeries } = useMemo(() => {
    const range = tabs.find((t) => t.id === selectedRange) || tabs[0]
    // Normalize to local start/end of day and include near-future if data exists
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const toLocalDate = (val) => {
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const [y, m, d] = val.split('-').map(Number)
        return new Date(y, m - 1, d)
      }
      if (typeof val === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(val)) {
        // Support DD-MM-YYYY input strings
        const [d, m, y] = val.split('-').map(Number)
        return new Date(y, m - 1, d)
      }
      return new Date(val)
    }
    // Determine dynamic end as the latest of today or latest expense date
    const latestDataDate = expenses.reduce((max, e) => {
      const d = toLocalDate(e.date)
      return d > max ? d : max
    }, new Date(0))
    const end = latestDataDate > todayEnd ? new Date(latestDataDate) : todayEnd
    end.setHours(23, 59, 59, 999)
    const start = new Date(end)
    start.setDate(start.getDate() - (range.days - 1))
    start.setHours(0, 0, 0, 0)

    // Build label list for each day in range (start..end)
    const days = []
    const cursor = new Date(start)
    while (cursor <= end) {
      days.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const labels = days.map(fmt)

    // Group expenses by day and type
    const byDay = new Map(labels.map((l) => [l, { expense: 0, income: 0 }]))

    expenses.forEach((e) => {
      const d = toLocalDate(e.date)
      if (d < start || d > end) return
      const key = fmt(d)
      const slot = byDay.get(key)
      if (!slot) return
      if ((e.type || 'expense') === 'income') slot.income += Number(e.amount || 0)
      else slot.expense += Number(e.amount || 0)
    })

    const expensesSeries = labels.map((l) => byDay.get(l)?.expense || 0)
    const incomeSeries = labels.map((l) => byDay.get(l)?.income || 0)
    return { labels, expensesSeries, incomeSeries }
  }, [expenses, selectedRange])

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: expensesSeries,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.15)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Income',
        data: incomeSeries,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22,163,74,0.15)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  }), [labels, expensesSeries, incomeSeries])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } },
      tooltip: { callbacks: { label: (ctx) => `₹${(ctx.parsed.y || 0).toLocaleString('en-IN')}` } },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (v) => `₹${(v || 0).toLocaleString('en-IN')}` },
        grid: { color: '#E2E8F0' },
      },
    },
  }), [])

  const hasAnyData = useMemo(() => expensesSeries.some((v) => v > 0) || incomeSeries.some((v) => v > 0), [expensesSeries, incomeSeries])

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Spending trend</p>
          <h3 className="text-2xl font-bold text-slate-900">This period</h3>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Chart time range">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                selectedRange === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              onClick={() => setSelectedRange(tab.id)}
              aria-pressed={selectedRange === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 h-72">
        {!hasAnyData ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data yet</div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </section>
  )
}

export default LineChart
