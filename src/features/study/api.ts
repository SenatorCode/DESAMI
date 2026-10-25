// src/features/study/api.ts
import { api } from '@/lib/axios'
import type {
  Session,
  SessionListItem,
  StudyData,
  SaveProgressPayload,
  SaveProgressResponse,
  HobbyAnalogy,
  ExplainResponse,
  LoseHeartResponse,
} from './types'
import * as mocks from './mocks'

// Set VITE_USE_MOCK_STUDY=true in your local .env to preview Study Mode UI/UX
// without a live backend. Never set this in Vercel production/preview env vars.
const USE_MOCKS = import.meta.env.VITE_USE_MOCK_STUDY === 'true'

export async function createSession(files: File[]): Promise<Session> {
  if (USE_MOCKS) return mocks.mockCreateSession()

  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  const { data } = await api.post<Session>('/api/session/', formData)
  return data
}

export async function getSessionStatus(sessionId: string): Promise<Session> {
  if (USE_MOCKS) return mocks.mockGetSessionStatus(sessionId)

  const { data } = await api.get<Session>(`/api/session/${sessionId}/`)
  return data
}

export async function listSessions(): Promise<SessionListItem[]> {
  if (USE_MOCKS) return mocks.mockListSessions()

  const { data } = await api.get<SessionListItem[]>('/api/session/')
  return data
}

export async function getStudyData(sessionId: string): Promise<StudyData> {
  if (USE_MOCKS) return mocks.mockGetStudyData(sessionId)

  const { data } = await api.get<StudyData>(`/api/session/${sessionId}/study/`)
  return data
}

export async function saveStudyProgress(
  sessionId: string,
  payload: SaveProgressPayload
): Promise<SaveProgressResponse> {
  if (USE_MOCKS) return mocks.mockSaveProgress()

  const { data } = await api.post<SaveProgressResponse>(
    `/api/session/${sessionId}/study/save_progress/`,
    payload
  )
  return data
}

export async function getHobbyAnalogy(
  sessionId: string,
  moduleId: number,
  chunkId: number
): Promise<HobbyAnalogy> {
  if (USE_MOCKS) return mocks.mockGetHobbyAnalogy(chunkId)

  const { data } = await api.get<HobbyAnalogy>(
    `/api/session/${sessionId}/study/${moduleId}/${chunkId}/hobby_analogy/`
  )
  return data
}

export async function getExplanation(
  sessionId: string,
  moduleId: number,
  quizId: number
): Promise<ExplainResponse> {
  if (USE_MOCKS) return mocks.mockGetExplanation()

  const { data } = await api.get<ExplainResponse>(
    `/api/session/${sessionId}/study/${moduleId}/${quizId}/explain/`
  )
  return data
}

export async function loseHeart(): Promise<LoseHeartResponse> {
  if (USE_MOCKS) return mocks.mockLoseHeart()

  const { data } = await api.post<LoseHeartResponse>('/api/lose_heart/')
  return data
}