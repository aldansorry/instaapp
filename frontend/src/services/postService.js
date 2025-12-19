import api from '@/lib/api'

export const fetchPosts = () => api.get('/posts')
export const createPost = (formData) =>
  api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const likePost = (postId) => api.post(`/posts/${postId}/like`)
export const commentPost = (postId, content) => api.post(`/posts/${postId}/comment`, { content })
export const updatePost = (postId, formData) =>
  api.post(`/posts/${postId}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deletePost = (postId) => api.delete(`/posts/${postId}`)
export const deleteComment = (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`)
