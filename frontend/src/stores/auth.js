import { defineStore } from 'pinia'
import { login, register, logout, me } from '@/services/authService'
import { normalizeError } from '@/lib/errors'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async init() {
      this.loading = true
      this.error = ''
      try {
        const { data } = await me()
        this.user = data
      } catch (err) {
        this.user = null
      } finally {
        this.loading = false
      }
    },
    async login(payload) {
      this.loading = true
      this.error = ''
      try {
        const { data } = await login(payload)
        this.user = data.user
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async register(payload) {
      this.loading = true
      this.error = ''
      try {
        const { data } = await register(payload)
        this.user = data.user
      } catch (err) {
        const normalized = normalizeError(err)
        this.error = normalized.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      try {
        await logout()
      } finally {
        this.user = null
        this.loading = false
      }
    },
    forceLogout() {
      this.user = null
      this.loading = false
      this.error = ''
    },
  },
})
