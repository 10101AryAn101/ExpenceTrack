import { useState } from 'react'
import FormShell from '../components/FormShell'

const Help = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('Please fill out all fields before sending your message.')
      return
    }
    setStatus(
      'Thanks! We received your message and will follow up via the email address you provided.',
    )
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Need help?</p>
            <h1 className="text-2xl font-bold text-slate-900">We’re here for you</h1>
            <p className="text-sm text-slate-500">
              Reach out with questions about billing, integrations, or account security—our team responds within 24
              hours.
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-500 md:text-right">
            <p>support@expensetrack.app</p>
            <p>+91 80 1234 5678</p>
          </div>
        </div>
      </section>
      <FormShell
        title="Contact support"
        description="Fill out the form and we’ll be in touch shortly."
        status={status}
        className="shadow-lg"
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-semibold text-slate-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-700">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-700 md:col-span-2">
            Subject
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What can we help with?"
              className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-slate-700 md:col-span-2">
            Message
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="Share any details that will help us assist you faster."
              className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="md:col-span-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active"
          >
            Send message
          </button>
        </form>
      </FormShell>
    </div>
  )
}

export default Help
