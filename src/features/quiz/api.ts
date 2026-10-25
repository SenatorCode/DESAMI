import { api } from '@/lib/axios'
import { MalformedResponseError } from '@/lib/apiError'
import { normalizeStatus } from '@/lib/status'
import type { QuizResponse, SaveQuizPayload, SaveQuizResponse } from './types'
import * as mocks from './mocks'

const USE_MOCKS = import.meta.env.VITE_USE_MOCK_STUDY === 'true'
type RawQuizResponse = Omit<QuizResponse, 'status'> & { status: string }

function toQuiz(raw: RawQuizResponse): QuizResponse {
  const quiz: QuizResponse = { ...raw, status: normalizeStatus(raw.status) }
  if (quiz.status === 'completed' && (!Array.isArray(quiz.questions) || quiz.questions.length === 0)) {
    console.error('[quiz] Completed quiz has no questions. Got:', raw)
    throw new MalformedResponseError('This quiz came back empty. Please try again.')
  }
  return quiz
}

// First call STARTS generation and counts toward the 5/day limit.
export async function getQuiz(sessionId: string): Promise<QuizResponse> {
  if (USE_MOCKS) return mocks.mockGetQuiz(sessionId)
  const { data } = await api.get<RawQuizResponse>(`/api/session/${sessionId}/quiz/`)
  return toQuiz(data)
}
export async function startNewQuiz(sessionId: string): Promise<QuizResponse> {
  if (USE_MOCKS) return mocks.mockStartNewQuiz(sessionId)
  const { data } = await api.post<RawQuizResponse>(`/api/session/${sessionId}/quiz/new/`)
  return toQuiz(data)
}
export async function saveQuizProgress(sessionId: string, payload: SaveQuizPayload): Promise<SaveQuizResponse> {
  if (USE_MOCKS) return mocks.mockSaveQuizProgress(sessionId, payload)
  const { data } = await api.post<SaveQuizResponse>(`/api/session/${sessionId}/quiz/save_progress/`, payload)
  return data
}