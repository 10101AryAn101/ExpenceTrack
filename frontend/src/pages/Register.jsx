import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormShell from '../components/FormShell'
import { registerUser } from '../api/api'
import { setToken } from '../utils/auth'
import { setUser } from '../utils/user'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const currentErrors = {}
    if (!form.name.trim()) currentErrors.name = 'Name is required.'
    if (!form.email.trim()) {
      currentErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      currentErrors.email = 'Enter a valid email.'
    }
    if (!form.password) currentErrors.password = 'Password is required.'
    else if (form.password.length < 6) currentErrors.password = 'Password must be at least 6 characters long.'
    if (form.password !== form.confirmPassword) currentErrors.confirmPassword = 'Passwords must match.'
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
      const { data } = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      const token = data?.token
      const user = data?.user
      if (!token || !user) throw new Error('Invalid register response')
      setToken(token)
      setUser({ id: user._id || user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || null })
      setStatus('Account created! Redirecting…')
      navigate('/dashboard')
    } catch (error) {
      setStatus('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <FormShell
        title="Create your account"
        description="Fill out the form to start tracking expenses."
        status={status}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active disabled:opacity-80"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-slate-900">
            Sign in
          </Link>
        </p>
      </FormShell>
    </div>
  )
}

export default Register
