// src/features/profile/types.ts
export interface RecentSessionSummary {
  session_id: string
  session_name: string
  progress: number
}

export interface ProfileAchievement {
  id: string
  title: string
  description: string
  icon: string
}

export interface UserProfile {
  first_name: string
  last_name: string
  email: string
  tier: 'basic' | 'premium' | 'premium+'
  xp: number
  heart: number
  streak: number
  daily_goal_level: number
  quiz_completed: number
  session_completed: number
  avg_quiz_score: number
  recent: RecentSessionSummary[]
  achievements: ProfileAchievement[]
}