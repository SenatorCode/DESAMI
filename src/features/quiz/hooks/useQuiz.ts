import { useQuery } from '@tanstack/react-query'
import { getQuiz } from '../api'

const POLL_INTERVAL_MS = 2000
export const quizQueryKey = (sessionId: string) => ['quiz', sessionId] as const

export function useQuiz(sessionId: string) {
  return useQuery({
    queryKey: quizQueryKey(sessionId),
    queryFn: () => getQuiz(sessionId),
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false
      const status = query.state.data?.status
      return status === 'queued' || status === 'processing' ? POLL_INTERVAL_MS : false
    },
  })
}