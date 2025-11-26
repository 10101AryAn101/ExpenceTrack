import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormShell from '../components/FormShell'
import { removeToken } from '../utils/auth'
import { getUser, removeUser, setUser } from '../utils/user'
import { fetchUserProfile, updateUserProfile } from '../api/api'

const Profile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const stored = getUser()
    if (!stored?.id) {
      navigate('/login')
      return
    }
    setUserId(stored.id)
    // Load initial displayed info from storage quickly
    setName(stored.name || '')
    setEmail(stored.email || '')
    if (stored.avatarUrl) setPhotoPreview(stored.avatarUrl)
    // Fetch fresh profile from backend
    fetchUserProfile(stored.id)
      .then(({ data }) => {
        setName(data?.name || '')
        setEmail(data?.email || '')
        if (data?.avatarUrl) setPhotoPreview(data.avatarUrl)
        setUser({ id: stored.id, name: data?.name, email: data?.email, avatarUrl: data?.avatarUrl || null })
      })
      .catch(() => {
        setStatus('Could not fetch profile from server.')
      })
  }, [navigate])

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result
      setPhotoPreview(dataUrl)
      setStatus('Photo ready to upload.')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!userId) return
    try {
      const payload = { name, avatarUrl: photoPreview || undefined }
      const { data } = await updateUserProfile(userId, payload)
      setUser({ id: userId, name: data?.name || name, email: email, avatarUrl: data?.avatarUrl || photoPreview || null })
      setStatus('Profile updated successfully!')
    } catch (error) {
      setStatus('Failed to update profile. Please try again.')
    }
  }

  const handleLogout = () => {
    removeToken()
    removeUser()
    navigate('/login')
  }

  const handleResetAppData = () => {
    removeToken()
    removeUser()
    setStatus('Local app data cleared.')
    // Force a full reload to ensure clean state across all components
    window.location.href = '/login'
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-900 text-center text-2xl font-bold text-white">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <span className="leading-[64px]">AT</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-transparent hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>
      <FormShell
        title="Personal details"
        description="Update name or profile photo (UI-only file picker)."
        status={status}
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              value={email}
              disabled
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Profile photo</label>
            <div className="mt-2 flex items-center gap-3">
              <label
                htmlFor="photo"
                className="cursor-pointer rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg"
              >
                Upload / Change
              </label>
              <span className="text-sm text-slate-500">PNG, JPG (demo only)</span>
            </div>
            <input id="photo" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 active:gradient-active"
          >
            Save profile
          </button>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleResetAppData}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Reset App Data
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-transparent hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </form>
      </FormShell>
    </div>
  )
}

export default Profile
