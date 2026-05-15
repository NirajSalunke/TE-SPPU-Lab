import apiClient from './client'

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password })

export const getMe = () => apiClient.get('/auth/me')
