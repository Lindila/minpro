import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sigpro_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sigpro_token')
      window.location.replace('/login')
    }
    return Promise.reject(err)
  }
)

export default api
