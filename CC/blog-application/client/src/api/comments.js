import apiClient from './client'

export const getComments = (postId) => apiClient.get(`/comments/post/${postId}`)
export const addComment = (postId, data) => apiClient.post(`/comments/post/${postId}`, data)
export const deleteComment = (id) => apiClient.delete(`/comments/${id}`)
