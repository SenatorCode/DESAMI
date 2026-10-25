import { useQuery } from '@tanstack/react-query'
import { isTerminal } from '@/lib/status'
import { getSessionStatus } from '../api'
import type { Session } from '../types'

const POLL_INTERVAL_MS = 2000

export function useSessionStatus(sessionId: string | null) {
  return useQuery<Session>({
    queryKey: ['session-status', sessionId],
    queryFn: () => getSessionStatus(sessionId as string),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false
      const status = query.state.data?.status
      return status && isTerminal(status) ? false : POLL_INTERVAL_MS
    },
  })
}