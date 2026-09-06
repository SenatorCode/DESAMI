import { api } from "@/lib/axios";
import type { LoginFormValues, SignupFormValues } from "./schema";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export async function login(values: LoginFormValues): Promise<AuthTokens> {
  const isEmail = values.identifier.includes('@')

  const { data } = await api.post<AuthTokens>('/api/login/', {
    username: isEmail ? '' : values.identifier,
    email: isEmail ? values.identifier : '',
    password: values.password,
  })
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