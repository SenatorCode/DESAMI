// src/features/study/hooks/useSessions.ts
import { useQuery } from '@tanstack/react-query'
import { listSessions } from '../api'

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: listSessions,
  })
}