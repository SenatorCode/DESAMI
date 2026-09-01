import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { loginSchema, type LoginFormValues } from '../schema'
import { login, fetchMe } from '../api'
import { useAuthStore } from '@/store/auth'

export function LoginForm() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (tokens) => {
      setTokens(tokens.access_token, tokens.refresh_token)
      try {
        setUser(await fetchMe())
      } catch {
        // profile fetch failing shouldn't block navigation — dashboard can retry
      }
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Could not log in. Check your credentials.')
    },
  })

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="w-full max-w-sm" noValidate>
      <div className="mb-4">
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@university.edu"
          aria-invalid={!!errors.email}
          className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-foreground placeholder:text-muted-foreground outline-none ring-primary/50 focus:ring-2"
          {...register('email')}
        />
        {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>}
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