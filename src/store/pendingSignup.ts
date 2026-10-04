import { create } from 'zustand'
import type { SignupFormValues } from '@/features/auth/schema'

interface PendingSignupState {
  /** Signup details awaiting OTP verification. Kept for "resend", which re-POSTs register. */
  pending: { values: SignupFormValues; email: string } | null
  setPending: (values: SignupFormValues, email: string) => void
  clear: () => void
}

// Deliberately NOT persisted: it holds the password, so it lives in memory only.
// A page refresh sends the user back to signup rather than writing it to storage.
export const usePendingSignup = create<PendingSignupState>((set) => ({
  pending: null,
  setPending: (values, email) => set({ pending: { values, email } }),
  clear: () => set({ pending: null }),
}))