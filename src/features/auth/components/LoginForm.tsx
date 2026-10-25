import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLocation } from 'react-router-dom'
import { loginSchema, type LoginFormValues } from '../schema'
import { login } from '../api'
import { extractErrorMessage } from '@/lib/axios'
import { useAuthStore } from '@/store/auth'
import { useAuthRedirect } from '../useAuthRedirect'

export function LoginForm() {
  const setTokens = useAuthStore((s) => s.setTokens)
  const redirectAfterAuth = useAuthRedirect()
   // After OTP verification we land here with the email pre-filled.
  const prefillEmail = (useLocation().state as { email?: string } | null)?.email ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { identifier: prefillEmail } })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (tokens) => {
      setTokens(tokens.access_token, tokens.refresh_token)
      toast.success('Welcome back!')
      await redirectAfterAuth()
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  })

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="w-full max-w-sm" noValidate>
      <div className="mb-4">
  <label htmlFor="identifier" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
    Email or username
  </label>
  <input
    id="identifier"
    type="text"
    autoComplete="username"
    placeholder="you@university.edu or username"
    aria-invalid={!!errors.identifier}
    className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground placeholder:text-muted-foreground outline-none ring-primary/50 focus:ring-2"
    {...register('identifier')}
  />
  {errors.identifier && <p className="mt-1.5 text-sm text-destructive">{errors.identifier.message}</p>}
</div>

      <div className="mb-6">
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground placeholder:text-muted-foreground outline-none ring-primary/50 focus:ring-2"
          {...register('password')}
        />
        {errors.password && <p className="mt-1.5 text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="h-12 w-full rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        {mutation.isPending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}