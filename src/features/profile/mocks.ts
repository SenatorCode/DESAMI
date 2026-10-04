// src/features/profile/mocks.ts
import type { UserProfile } from './types'

export async function mockGetUserProfile(): Promise<UserProfile> {
  await new Promise((r) => setTimeout(r, 300))
  return {
    first_name: 'Maya',
    last_name: 'Osei',
    email: 'maya@example.com',
    tier: 'premium',
    xp: 3420,
    heart: 4,
    streak: 12,
    daily_goal_level: 45,
    quiz_completed: 21,
    session_completed: 15,
    avg_quiz_score: 94,
    recent: [
      { session_id: 'mock-completed-1', session_name: 'Organic Chemistry II', progress: 78 },
      { session_id: 'mock-completed-2', session_name: 'Cognitive Neuroscience', progress: 92 },
      { session_id: 'mock-completed-3', session_name: 'Macroeconomics', progress: 45 },
    ],
    achievements: [
      { id: 'FIRST_LESSON', title: 'First Timer', description: 'Completed your first desami lesson', icon: '' },
    ],
  }
}