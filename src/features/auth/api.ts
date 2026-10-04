import { api } from "@/lib/axios";
import type { LoginFormValues, SignupFormValues } from "./schema";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

// Add above signup()
interface SignupResponse {
  status: string
  message: string
  user_id: number
}

export async function login(values: LoginFormValues): Promise<AuthTokens> {
  const isEmail = values.identifier.includes('@')

  // Backend expects either `username` OR `email` present — not both, and not
  // the unused one sent as an empty string. Omit the key entirely instead.
  const payload: { username?: string; email?: string; password: string } = {
    password: values.password,
  }

  if (isEmail) {
    payload.email = values.identifier
  } else {
    payload.username = values.identifier
  }

  const { data } = await api.post<AuthTokens>('/api/login', payload)
  return data
}

export async function signup(values: SignupFormValues): Promise<SignupResponse> {
  const { data } = await api.post<SignupResponse>('/api/register', values)
  return data
}

export async function fetchHobbies(): Promise<Array<{ hobby_name: string; hobby_description: string }>> {
  const { data } = await api.get('/api/hobbies/')
  return data
}

export async function loginWithGoogle(googleAccessToken: string): Promise<AuthTokens> {
  const { data } = await api.post('/api/auth-google/', {
    access_token: googleAccessToken,
    callback_url: window.location.origin,
  })
  return {
    access_token: data.access_token ?? data.access,
    refresh_token: data.refresh_token ?? data.refresh,
  }
}