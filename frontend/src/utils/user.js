const USER_KEY = 'expenseTrackUser'

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }))
  }
}

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY)
    window.dispatchEvent(new Event('userUpdated'))
  }
}
