import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/auth'
import { getUser, removeUser } from '../utils/user'

const Navbar = ({ onOpenMenu }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const initials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    const first = parts[0]?.[0] || ''
    const last = parts[1]?.[0] || ''
    return (first + last).toUpperCase() || first.toUpperCase() || 'U'
  }

  const handleLogout = () => {
    removeToken()
    removeUser()
    navigate('/login')
  }

  useEffect(() => {
    const refreshUser = () => {
      const stored = getUser()
      if (stored) {
        setDisplayName(stored.name || '')
        setAvatarUrl(stored.avatarUrl || '')
      } else {
        setDisplayName('')
        setAvatarUrl('')
      }
    }
    refreshUser()

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    const handleUserUpdated = () => refreshUser()
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('userUpdated', handleUserUpdated)
    window.addEventListener('storage', handleUserUpdated)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('userUpdated', handleUserUpdated)
      window.removeEventListener('storage', handleUserUpdated)
    }
  }, [])

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 md:hidden"
          onClick={onOpenMenu}
        >
          <span className="sr-only">Open navigation</span>
          ☰
        </button>
        <Link
          to="/dashboard"
          className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
        >
          ExpenseTrack
        </Link>
      </div>
      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <Link
          to="/help"
          className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600 hover:text-white hover:shadow-xl sm:block active:gradient-active active:text-white"
        >
          Contact Support
        </Link>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <span className="h-8 w-8 overflow-hidden rounded-full bg-slate-900 text-center text-base font-semibold leading-8 text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="h-8 w-8 object-cover" />
            ) : (
              initials(displayName)
            )}
          </span>
          <span>{displayName || 'User'}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <Link
              to="/profile"
              className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:via-blue-500 hover:to-purple-600"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-white hover:bg-rose-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
