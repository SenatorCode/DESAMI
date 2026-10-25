// src/features/study/hooks/useStudyData.ts
import { useQuery } from '@tanstack/react-query'
import { getStudyData } from '../api'

export function useStudyData(sessionId: string) {
  return useQuery({
    queryKey: ['study-data', sessionId],
    queryFn: () => getStudyData(sessionId),
  })
}