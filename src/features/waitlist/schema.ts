// src/features/waitlist/schema.ts
import { z } from 'zod'

export const waitlistSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export type WaitlistFormValues = z.infer<typeof waitlistSchema>