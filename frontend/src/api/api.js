import axios from 'axios'
import { getToken } from '../utils/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token && config?.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginUser = (payload) => api.post('/auth/login', payload)
export const registerUser = (payload) => api.post('/auth/register', payload)
export const fetchExpenses = (params) => api.get('/expenses', { params })
export const createExpense = (payload) => api.post('/expenses', payload)
export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)
export const fetchUserProfile = (id) => api.get(`/users/${id}`)
export const updateUserProfile = (id, payload) => api.put(`/users/${id}`, payload)

export default api
