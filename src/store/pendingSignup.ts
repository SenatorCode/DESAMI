import { create } from 'zustand'
import type { SignupFormValues } from '@/features/auth/schema'

interface Pending {
  values: SignupFormValues
  email: string
  /** Returned by POST register; required by verify-otp. Replaced on every resend. */
  registrationId?: string | number
}

interface PendingSignupState {
  /** Signup details awaiting OTP verification. Kept for "resend", which re-POSTs register. */
  pending: Pending | null
  setPending: (values: SignupFormValues, email: string, registrationId?: string | number) => void
  clear: () => void
}

// Deliberately NOT persisted: it holds the password, so it lives in memory only.
// A page refresh sends the user back to signup rather than writing it to storage.
export const usePendingSignup = create<PendingSignupState>((set) => ({
  pending: null,
  setPending: (values, email, registrationId) => set({ pending: { values, email, registrationId } }),
  clear: () => set({ pending: null }),
}))