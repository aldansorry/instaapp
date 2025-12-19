import { defineStore } from 'pinia'
import {
  fetchPosts as fetchPostsApi,
  createPost as createPostApi,
  likePost as likePostApi,
  commentPost as commentPostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  deleteComment as deleteCommentApi,
} from '@/services/postService'
import { normalizeError } from '@/lib/errors'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    loading: false,
    error: '',
  }),
  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = ''
      try {
        const { data } = await fetchPostsApi()
        this.posts = data
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async createPost(formData) {
      this.error = ''
      try {
        const { data } = await createPostApi(formData)
        this.posts = [data, ...this.posts]
        return data
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      }
    },
    async likePost(post) {
      this.error = ''
      try {
        const { data } = await likePostApi(post.id)
        post.liked_by_user_exists = data.liked
        post.likes_count = data.likes_count
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      }
    },
    async commentPost(post, content) {
      this.error = ''
      try {
        const { data } = await commentPostApi(post.id, content)
        post.comments.push(data)
        return data
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      }
    },
    async updatePost(post, { content, image }) {
      this.error = ''
      const formData = new FormData()
      formData.append('content', content)
      if (image) {
        formData.append('image', image)
      }
      try {
        const { data } = await updatePostApi(post.id, formData)
        const idx = this.posts.findIndex((p) => p.id === post.id)
        if (idx !== -1) {
          this.posts[idx] = data
        }
        return data
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      }
    },
    async deletePost(post) {
      this.error = ''
      try {
        await deletePostApi(post.id)
        this.posts = this.posts.filter((p) => p.id !== post.id)
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      }
    },
    async deleteComment(post, comment) {
      this.error = ''
      try {
        await deleteCommentApi(post.id, comment.id)
        post.comments = post.comments.filter((c) => c.id !== comment.id)
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      }
    },
  },
})
