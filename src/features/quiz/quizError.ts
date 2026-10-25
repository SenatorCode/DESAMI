import { ErrorCode, parseApiError } from '@/lib/apiError'

// The docs show the 429 two ways (with and without error_code), so accept both.
export function isQuizLimitError(error: unknown): boolean {
  const { status, code, message } = parseApiError(error)
  if (status !== 429) return false
  if (code === ErrorCode.QUIZ_DAILY_LIMIT_REACHED) return true
  return !code && /quiz/i.test(message)
}

function formatReset(iso?: string): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })
}

export function describeQuizError(error: unknown): { title: string; message: string } {
  const parsed = parseApiError(error)
  if (isQuizLimitError(error)) {
    const reset = formatReset(parsed.resetsAt)
    return {
      title: 'Daily quiz limit reached',
      message: `You've used all 5 quiz generations for today. ${reset ? `It resets ${reset}.` : 'Try again tomorrow.'} You can still retake your existing quiz.`,
    }
  }
  switch (parsed.code) {
    case ErrorCode.QUIZ_GENERATION_FAILED:
      return { title: "We couldn't build your quiz", message: parsed.message }
    case ErrorCode.SESSION_NOT_FOUND:
      return { title: 'Session not found', message: 'It may have been deleted.' }
    case ErrorCode.FORBIDDEN_NOT_OWNER:
      return { title: 'No access', message: 'This session belongs to a different account.' }
    default:
      return {
        title: parsed.isNetworkError ? "Can't reach the server" : 'Could not load your quiz',
        message: parsed.message,
      }
  }
}