import apiClient from './client'

export const getPosts = (params) => apiClient.get('/posts', { params })
export const getFeaturedPosts = () => apiClient.get('/posts/featured')
export const searchPosts = (q) => apiClient.get('/posts/search', { params: { q } })
export const getPostBySlug = (slug) => apiClient.get(`/posts/${slug}`)
export const getRelatedPosts = (slug) => apiClient.get(`/posts/related/${slug}`)
export const createPost = (data) => apiClient.post('/posts', data)
export const updatePost = (id, data) => apiClient.put(`/posts/${id}`, data)
export const deletePost = (id) => apiClient.delete(`/posts/${id}`)
export const likePost = (id) => apiClient.patch(`/posts/${id}/like`)
