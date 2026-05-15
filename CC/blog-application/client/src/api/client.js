import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('blog_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('blog_token')
      localStorage.removeItem('blog_user')
    }
    return Promise.reject(err)
  }
)

export default apiClient
