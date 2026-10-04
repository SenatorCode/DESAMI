// src/features/profile/api.ts
import { api } from '@/lib/axios'
import type { UserProfile } from './types'
import { mockGetUserProfile } from './mocks'

// ⚠️ Reuses the existing VITE_USE_MOCK_STUDY flag even though its name says
// "study" — it's become a general "preview without backend" toggle now that
// profile data needs mocking too. Worth renaming to something like
// VITE_USE_MOCK_API later, but not doing that rename unprompted since it'd
// touch your local .env setup.
const USE_MOCKS = import.meta.env.VITE_USE_MOCK_STUDY === 'true'

export async function getUserProfile(): Promise<UserProfile> {
  if (USE_MOCKS) return mockGetUserProfile()
  const { data } = await api.get<UserProfile>('/api/users/me')
  return data
}