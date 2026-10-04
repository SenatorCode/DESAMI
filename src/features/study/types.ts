// src/features/study/types.ts

export type SessionStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface Session {
  session_id: string
  status: SessionStatus
  progress?: number
  message?: string
}

// GET api/session/ (Endpoint 5). Note: the list uses `upload_status`, while the
// single-session poll (Endpoint 6) uses `status`.
export interface SessionListItem {
  session_id: string
  name?: string
  upload_status: SessionStatus
  visited_last?: string
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
}

// v2.6: StudyQuestion belongs to a module, so `quiz` is a sibling of `chunks`.
export interface StudyModule {
  id: number
  title: string
  chunks: StudyChunk[]
  quiz?: StudyQuizQuestion[]
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