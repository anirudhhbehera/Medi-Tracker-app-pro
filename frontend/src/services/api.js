import axios from 'axios'

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medi-tracker-app-pro.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Medication API
export const medicationAPI = {
  getAll: (userId) => api.get(`/medications?userId=${userId}`),
  getById: (id, userId) => api.get(`/medications/${id}?userId=${userId}`),
  create: (medication) => api.post('/medications', medication),
  update: (id, medication, userId) => api.put(`/medications/${id}?userId=${userId}`, medication),
  delete: (id, userId) => api.delete(`/medications/${id}?userId=${userId}`),
  search: (userId, query) => api.get(`/medications/search?userId=${userId}&query=${query}`),
  getLowStock: (userId, threshold = 7) => api.get(`/medications/low-stock?userId=${userId}&threshold=${threshold}`),
  updateStock: (id, userId, stock) => api.patch(`/medications/${id}/stock?userId=${userId}&stock=${stock}`),
  getStats: (userId) => api.get(`/medications/stats?userId=${userId}`)
}

// Reminder API
export const reminderAPI = {
  getAll: (userId) => api.get(`/reminders?userId=${userId}`),
  getById: (id, userId) => api.get(`/reminders/${id}?userId=${userId}`),
  create: (reminder) => api.post('/reminders', reminder),
  update: (id, reminder, userId) => api.put(`/reminders/${id}?userId=${userId}`, reminder),
  delete: (id, userId) => api.delete(`/reminders/${id}?userId=${userId}`),
  toggle: (id, userId) => api.patch(`/reminders/${id}/toggle?userId=${userId}`),
  markTaken: (id, userId) => api.patch(`/reminders/${id}/taken?userId=${userId}`)
}

// User API
export const userAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
}

// AI Insights API
export const aiInsightsAPI = {
  getInsights: (userId) => api.get(`/ai-insights/${userId}`),
  refreshInsights: (userId) => api.post(`/ai-insights/${userId}/refresh`)
}

export default api