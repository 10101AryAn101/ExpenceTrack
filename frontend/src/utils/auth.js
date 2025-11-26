const TOKEN_KEY = 'expenseTrackToken'

export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}
