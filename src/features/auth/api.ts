import { api } from '@/lib/axios'
import type { LoginFormValues, SignupFormValues } from './schema'

interface AuthTokens {
  access_token: string
  refresh_token: string
}

export async function login(values: LoginFormValues): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/api/login/', values)
  return data
}

export async function signup(values: SignupFormValues) {
  const { data } = await api.post('/api/register/', values)
  return data
}

export async function fetchMe() {
  const { data } = await api.get('/api/users/me/')
  return data
}

// Stub — do not wire to the real button until Client ID + token flow are confirmed.
export async function loginWithGoogle(googleToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/api/auth-google/', {
    access_token: googleToken,
    callback_url: window.location.origin,
  })
  return data
}