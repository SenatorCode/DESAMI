// src/lib/apiError.ts
import axios from 'axios'

/** Error codes defined in DESAMI_API_Error_Responses. Extend as endpoints are added. */
export const ErrorCode = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  FORBIDDEN_NOT_OWNER: 'FORBIDDEN_NOT_OWNER',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  // OTP
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_ATTEMPTS_EXCEEDED: 'OTP_ATTEMPTS_EXCEEDED',
  OTP_RESEND_COOLDOWN: 'OTP_RESEND_COOLDOWN',
  USERNAME_OR_EMAIL_TAKEN: 'USERNAME_OR_EMAIL_TAKEN',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  // Sessions / study
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  STUDY_NOT_READY: 'STUDY_NOT_READY',
  OUT_OF_HEARTS: 'OUT_OF_HEARTS',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
  CHUNK_NOT_FOUND: 'CHUNK_NOT_FOUND',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  // Uploads
  NO_FILE_PROVIDED: 'NO_FILE_PROVIDED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  UPLOAD_QUOTA_EXCEEDED: 'UPLOAD_QUOTA_EXCEEDED',
} as const

interface ApiErrorBody {
  status?: string
  error_code?: string
  message?: string
  details?: Record<string, unknown>
  retry_after?: number
  time_until_next_heart?: number
}

export interface ParsedApiError {
  /** HTTP status, undefined for network failures */
  status?: number
  /** Backend `error_code`, if the response followed the documented shape */
  code?: string
  /** Best human-readable message available */
  message: string
  /** Seconds to wait before retrying (OTP resend cooldown, rate limits) */
  retryAfter?: number
  /** Seconds until the next heart regenerates (OUT_OF_HEARTS) */
  timeUntilNextHeart?: number
  isNetworkError: boolean
}

const FALLBACK = 'Something went wrong. Please try again.'

function firstDetail(details: Record<string, unknown>): string | undefined {
  const first = Object.values(details)[0]
  if (Array.isArray(first)) return first.length ? String(first[0]) : undefined
  return first == null ? undefined : String(first)
}

export function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError(error)) {
    return { message: FALLBACK, isNetworkError: false }
  }
  if (!error.response) {
    return { message: 'Network error — could not reach the server.', isNetworkError: true }
  }

  const body = (error.response.data ?? {}) as ApiErrorBody
  const detail = body.details ? firstDetail(body.details) : undefined

  return {
    status: error.response.status,
    code: body.error_code,
    message: detail ?? body.message ?? FALLBACK,
    retryAfter: typeof body.retry_after === 'number' ? body.retry_after : undefined,
    timeUntilNextHeart:
      typeof body.time_until_next_heart === 'number' ? body.time_until_next_heart : undefined,
    isNetworkError: false,
  }
}

export function hasErrorCode(error: unknown, code: string): boolean {
  return parseApiError(error).code === code
}