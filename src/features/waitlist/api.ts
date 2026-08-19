import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import type { WaitlistFormValues } from './schema'

interface DRFValidationError {
  email?: string[]
}

export interface WaitlistEntry {
  id: number
  email: string
  joined_at: string
}

export async function joinWaitlist(data: WaitlistFormValues): Promise<WaitlistEntry> {
  try {
    const response = await api.post<WaitlistEntry>('/waitlist/', data)
    return response.data
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 400) {
      const body = err.response.data as DRFValidationError
      const message = body.email?.[0]
      throw new Error(message ?? 'Could not join the waitlist. Please try again.', { cause: err })
    }
    throw new Error('Something went wrong. Please try again.', { cause: err })
  }
}