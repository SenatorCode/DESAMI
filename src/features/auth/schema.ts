import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type SignupFormValues = z.infer<typeof signupSchema>