import type { JobStatus } from '@/lib/status'
import type { Achievement } from '@/features/study/types'

export interface QuizOption {
  option_id: number
  option_text: string
  rationale?: string | null
}
export interface QuizQuestion {
  question_id: number
  question: string
  options: QuizOption[]
  answer: string               // text of the correct option
  explanation?: string | null
}
export interface QuizResponse {
  session_id: string
  status: JobStatus
  progress?: number
  message?: string
  questions?: QuizQuestion[]
}
export interface SaveQuizPayload { correct_count: number; total_questions: number }
export interface SaveQuizResponse {
  status: string
  score: number
  xp_gained: number
  new_achievements: Achievement[]
}