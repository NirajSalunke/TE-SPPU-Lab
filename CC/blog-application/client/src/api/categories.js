import apiClient from './client'

export const getCategories = () => apiClient.get('/categories')
export const createCategory = (data) => apiClient.post('/categories', data)
export const updateCategory = (id, data) => apiClient.put(`/categories/${id}`, data)
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`)
