import { MalformedResponseError } from './apiError'

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export function toAuthTokens(data: unknown): AuthTokens {
  const body = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>
  const access = body.access_token ?? body.access
  const refresh = body.refresh_token ?? body.refresh

  if (typeof access !== 'string' || !access || typeof refresh !== 'string' || !refresh) {
    console.error('[auth] Response is missing access/refresh tokens. Got:', data)
    throw new MalformedResponseError(
      'Signed in, but the server did not send valid login tokens. Please tell support.'
    )
  }
  return { access_token: access, refresh_token: refresh }
}