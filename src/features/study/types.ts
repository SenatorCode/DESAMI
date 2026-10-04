// src/features/study/types.ts

export type SessionStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface Session {
  session_id: string
  status: SessionStatus
  progress?: number
  message?: string
}

export interface SessionListItem {
  session_id: string
  name?: string
  status: SessionStatus
}

export interface StudyOption {
  option_text: string
}

export interface StudyQuizQuestion {
  question_id: number
  question: string
  options: StudyOption[]
  answer: string
}

export interface StudyChunk {
  id: number
  text: string
  quiz?: StudyQuizQuestion[]
}

export interface StudyModule {
  id: number
  title: string
  chunks: StudyChunk[]
}

export interface StudyData {
  session_id: string
  subject_name: string
  modules: StudyModule[]
}

export interface HobbyAnalogy {
  id: number
  text: string
}

export interface ExplainResponse {
  text: string
}

export interface LoseHeartResponse {
  hearts_remaining: number
  max_hearts: number
  can_continue: boolean
}

export interface SaveProgressPayload {
  module_id: number
  status: 'completed'
  total_correct_score: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
}

export interface SaveProgressResponse {
  status: string
  xp_gained: number
  new_achievements: Achievement[]
}