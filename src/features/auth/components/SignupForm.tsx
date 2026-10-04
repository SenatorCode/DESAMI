import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { signupSchema, type SignupFormValues } from '../schema'
import { signup } from '../api'
import { ErrorCode, parseApiError } from '@/lib/apiError'
import { usePendingSignup } from '@/store/pendingSignup'

export function SignupForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) })

  const setPending = usePendingSignup((s) => s.setPending)

  const mutation = useMutation({
    mutationFn: signup,
    // v2.6: no account yet — the backend emailed an OTP. Keep the details in memory
    // (needed for "resend") and move to the verification screen.
    onSuccess: (data, values) => {
      setPending(values, data.email ?? values.email)
      toast.success('Check your email for a verification code.')
      navigate('/verify-otp')
    },
    onError: (error) => {
      const { code, message, fieldErrors } = parseApiError(error)
      if (code === ErrorCode.USERNAME_TAKEN) {
        setError('username', { message })
        return
      }
      // Field-level validation (e.g. email already in use) goes on the matching input.
      const known = fieldErrors && Object.keys(fieldErrors).filter((k) => k in signupSchema.shape)
      if (known && known.length > 0) {
        known.forEach((k) => setError(k as keyof SignupFormValues, { message: fieldErrors[k] }))
        return
      }
      toast.error(message)
    },
  })

  const field = (name: keyof SignupFormValues, label: string, type = 'text', autoComplete?: string) => (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!errors[name]}
        className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground outline-none ring-primary/50 focus:ring-2"
        {...register(name)}
      />
      {errors[name] && <p className="mt-1.5 text-sm text-destructive">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="w-full max-w-sm" noValidate>
      <div className="grid grid-cols-2 gap-3">
        {field('first_name', 'First name', 'text', 'given-name')}
        {field('last_name', 'Last name', 'text', 'family-name')}
      </div>
      {field('username', 'Username', 'text', 'username')}
      {field('email', 'Email address', 'email', 'email')}
      {field('password', 'Password', 'password', 'new-password')}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        {mutation.isPending ? 'Sending code…' : 'Create account'}
      </button>
    </form>
  )
}