import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormShell from '../components/FormShell'
import { loginUser } from '../api/api'
import { setToken } from '../utils/auth'
import { setUser } from '../utils/user'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const currentErrors = {}
    if (!form.email.trim()) {
      currentErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      currentErrors.email = 'Enter a valid email.'
    }
    if (!form.password.trim()) {
      currentErrors.password = 'Password is required.'
    } else if (form.password.length < 6) {
      currentErrors.password = 'Password must be at least 6 characters long.'
    }
    setErrors(currentErrors)
    return Object.keys(currentErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await loginUser({ email: form.email, password: form.password })
      const token = data?.token
      const user = data?.user
      if (!token || !user) throw new Error('Invalid login response')
      setToken(token)
      setUser({ id: user._id || user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || null })
      setStatus('Login successful! Redirecting…')
      navigate('/dashboard')
    } catch (error) {
      setStatus('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <FormShell
        title="ExpenseTrack Login"
        description="Enter your credentials to access the dashboard."
        status={status}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active disabled:opacity-80"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-slate-900">
            Register
          </Link>
        </p>
      </FormShell>
    </div>
  )
}

export default Login
