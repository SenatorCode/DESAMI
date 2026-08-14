// src/features/waitlist/api.ts
import type { WaitlistFormValues } from './schema'

// TODO: replace with real endpoint once backend exposes POST /api/waitlist
export async function mockJoinWaitlist(data: WaitlistFormValues): Promise<{ position: number }> {
  await new Promise((r) => setTimeout(r, 900))
  if (data.email.endsWith('@fail.test')) throw new Error('Something went wrong')
  return { position: Math.floor(Math.random() * 500) + 120 }
}