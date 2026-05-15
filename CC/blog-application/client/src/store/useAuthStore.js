import { create } from 'zustand'
import { login as loginApi, getMe } from '../api/auth'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('blog_user') || 'null'),
  token: localStorage.getItem('blog_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await loginApi(email, password)
      localStorage.setItem('blog_token', data.token)
      localStorage.setItem('blog_user', JSON.stringify(data))
      set({ user: data, token: data.token, loading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('blog_token')
    localStorage.removeItem('blog_user')
    set({ user: null, token: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
