import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth'
import { parseApiError } from './apiError'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// A 401 from these endpoints means "bad credentials / bad token", not "access
// token expired" — attempting a refresh there would be wrong (and, with a stale
// refresh token in storage, would silently swallow the real error).
const NO_REFRESH_PATHS = [
  '/api/login/',
  '/api/register/',
  '/api/register/verify-otp/',
  '/api/refresh/',
  '/api/auth-google/',
]

function skipsRefresh(url?: string) {
  if (!url) return false
  return NO_REFRESH_PATHS.some((p) => url.endsWith(p))
}

let isRefreshing = false
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function flushQueue(error: unknown, token?: string) {
  queue.forEach((p) => (token ? p.resolve(token) : p.reject(error)))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error(
      `[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      '\nStatus:', error.response?.status,
      '\nResponse:', error.response?.data ?? error.message
    )

    const original = error.config as RetriableConfig | undefined
    if (!original || error.response?.status !== 401 || original._retry || skipsRefresh(original.url)) {
      return Promise.reject(error)
    }

    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }
    original._retry = true

    if (isRefreshing) {
      // Wait for the in-flight refresh; reject too if it fails (previously these hung forever).
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          },
          reject,
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/refresh/`, {
        refresh_token: refreshToken,
      })
      useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
      flushQueue(null, data.access_token)
      original.headers.Authorization = `Bearer ${data.access_token}`
      return api(original)
    } catch (refreshError) {
      useAuthStore.getState().logout()
      flushQueue(refreshError)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

/** Backend's real message for forms/toasts. For error codes, use `parseApiError`. */
export function extractErrorMessage(error: unknown): string {
  return parseApiError(error).message
}