import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue: Array<(token: string) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Loud, honest logging — no more silent failures during testing.
    console.error(
      `[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      '\nStatus:', error.response?.status,
      '\nResponse:', error.response?.data ?? error.message
    )

    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
      original._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }

      isRefreshing = true
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/refresh/`, {
  refresh_token: refreshToken,
})
        useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
        queue.forEach((cb) => cb(data.access_token))
        queue = []
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        queue = []
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// Small helper so forms can show the backend's real message instead of guessing.
// Small helper so forms can show the backend's real message instead of guessing.
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { details?: Record<string, unknown>; message?: string } | undefined
    if (data?.details) {
      const first = Object.values(data.details)[0]
      return Array.isArray(first) ? String(first[0]) : String(first)
    }
    if (data?.message) return data.message
    if (!error.response) return 'Network error — could not reach the server.'
  }
  return 'Something went wrong. Please try again.'
}