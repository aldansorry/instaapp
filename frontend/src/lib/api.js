import axios from 'axios'
import { normalizeError } from './errors'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
let backendOrigin = ''

try {
  const parsed = new URL(apiBase)
  backendOrigin = parsed.origin
} catch (e) {
  backendOrigin = ''
}

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// Optional bearer header helper
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const setupInterceptors = (pinia, authStoreFactory) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const normalized = normalizeError(error)
      if (
        error?.response?.status === 401 &&
        authStoreFactory &&
        !error?.config?.url?.includes('/logout')
      ) {
        try {
          const store = authStoreFactory(pinia)
          if (store?.forceLogout) {
            store.forceLogout()
          }
        } catch (_) {
          // ignore
        }
      }
      return Promise.reject(normalized)
    }
  )
}

export { apiBase, backendOrigin }
export default api
