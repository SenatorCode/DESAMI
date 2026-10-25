// src/features/study/hooks/useSessionStatus.ts
import { useQuery } from '@tanstack/react-query'
import { getSessionStatus } from '../api'
import type { Session } from '../types'

const POLL_INTERVAL_MS = 2000 // per v2.4 §4.3 step 2 — polls every 2 seconds

export function useSessionStatus(sessionId: string | null) {
  return useQuery<Session>({
    queryKey: ['session-status', sessionId],
    queryFn: () => getSessionStatus(sessionId as string),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      // Stop polling once we land on a terminal state
      if (status === 'completed' || status === 'failed') return false
      return POLL_INTERVAL_MS
    },
  })
}