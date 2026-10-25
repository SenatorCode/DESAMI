// src/features/study/loadError.ts
import { ErrorCode, parseApiError } from '@/lib/apiError'

/** Turns a failed study/session fetch into user-facing copy keyed on the backend's error_code. */
export function describeStudyLoadError(error: unknown): { title: string; message: string } {
  const { code, message, isNetworkError } = parseApiError(error)
  switch (code) {
    case ErrorCode.STUDY_NOT_READY:
      return { title: 'Still preparing your study material', message: 'This session is still processing. Give it a moment and try again.' }
    case ErrorCode.SESSION_NOT_FOUND:
      return { title: 'Session not found', message: 'It may have been deleted.' }
    case ErrorCode.FORBIDDEN_NOT_OWNER:
      return { title: 'No access', message: "This session belongs to a different account." }
    default:
      return {
        title: isNetworkError ? "Can't reach the server" : 'Could not load this session',
        message,
      }
  }
}