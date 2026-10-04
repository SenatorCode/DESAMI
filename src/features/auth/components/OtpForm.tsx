import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signup, verifyOtp } from '../api'
import { OTP_LENGTH, otpSchema } from '../schema'
import { useCooldown } from '../hooks/useCooldown'
import { usePendingSignup } from '@/store/pendingSignup'
import { ErrorCode, parseApiError } from '@/lib/apiError'

const RESEND_SECONDS = 60

interface Terminal {
  title: string
  message: string
}

export function OtpForm({ email }: { email: string }) {
  const navigate = useNavigate()
  const pending = usePendingSignup((s) => s.pending)
  const clearPending = usePendingSignup((s) => s.clear)

  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  // Unrecoverable states (expired, too many attempts, details taken): the only way out is to sign up again.
  const [terminal, setTerminal] = useState<Terminal | null>(null)
  // The OTP email was just sent when this screen opens, so resend starts on cooldown.
  const cooldown = useCooldown(RESEND_SECONDS)

  const startOver = () => {
    clearPending()
    navigate('/signup', { replace: true })
  }

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success('Email verified — log in to continue.')
      // Navigate first: clearing the pending signup first would make VerifyOtpPage
      // redirect to /signup for a frame.
      navigate('/login', { replace: true, state: { email } })
      clearPending()
    },
    onError: (err) => {
      const { code, message } = parseApiError(err)
      switch (code) {
        case ErrorCode.OTP_INVALID:
          setError('That code is incorrect. Check it and try again.')
          setOtp('')
          break
        case ErrorCode.OTP_EXPIRED:
          setTerminal({ title: 'Code expired', message: 'Your code has expired. Sign up again to get a new one.' })
          break
        case ErrorCode.OTP_ATTEMPTS_EXCEEDED:
          setTerminal({ title: 'Too many attempts', message: 'Too many incorrect attempts. Sign up again to get a new code.' })
          break
        case ErrorCode.USERNAME_OR_EMAIL_TAKEN:
          setTerminal({ title: 'Details no longer available', message })
          break
        default:
          setError(message)
      }
    },
  })

  const resendMutation = useMutation({
    mutationFn: () => {
      if (!pending) throw new Error('No pending signup')
      return signup(pending.values)
    },
    onSuccess: () => {
      setOtp('')
      setError(null)
      cooldown.start(RESEND_SECONDS)
      toast.success('A new code is on its way. The previous one no longer works.')
    },
    onError: (err) => {
      const { code, message, retryAfter } = parseApiError(err)
      if (code === ErrorCode.OTP_RESEND_COOLDOWN) {
        cooldown.start(retryAfter ?? RESEND_SECONDS)
        return
      }
      if (code === ErrorCode.USERNAME_TAKEN) {
        setTerminal({ title: 'Username no longer available', message })
        return
      }
      toast.error(message)
    },
  })

  const submit = (value: string) => {
    const result = otpSchema.safeParse({ otp: value })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid code')
      return
    }
    setError(null)
    verifyMutation.mutate({ email, otp: value })
  }

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setOtp(digits)
    setError(null)
    // Auto-submit once complete (also covers paste and SMS autofill).
    if (digits.length === OTP_LENGTH && !verifyMutation.isPending) submit(digits)
  }

  if (terminal) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center" role="alert">
        <h2 className="font-semibold">{terminal.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{terminal.message}</p>
        <button
          onClick={startOver}
          className="mt-5 h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
        >
          Back to sign up
        </button>
      </div>
    )
  }

  const busy = verifyMutation.isPending

  return (
    <div>
      <label htmlFor="otp" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Verification code
      </label>
      <input
        id="otp"
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={OTP_LENGTH + 4}
        placeholder={'•'.repeat(OTP_LENGTH)}
        disabled={busy}
        aria-invalid={!!error}
        aria-describedby={error ? 'otp-error' : undefined}
        className="h-14 w-full rounded-xl border border-border bg-muted px-4 text-center text-2xl font-semibold tracking-[0.5em] text-foreground outline-none ring-primary/50 placeholder:text-muted-foreground/50 focus:ring-2 disabled:opacity-60"
      />
      {error && (
        <p id="otp-error" className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        onClick={() => submit(otp)}
        disabled={busy || otp.length !== OTP_LENGTH}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {busy ? 'Verifying…' : 'Verify email'}
      </button>

      <div className="mt-5 flex flex-col items-center gap-2 text-sm text-muted-foreground">
        {cooldown.secondsLeft > 0 ? (
          <p>Resend code in {cooldown.secondsLeft}s</p>
        ) : (
          <button
            onClick={() => resendMutation.mutate()}
            disabled={resendMutation.isPending}
            className="font-medium text-primary hover:underline disabled:opacity-60"
          >
            {resendMutation.isPending ? 'Sending…' : 'Resend code'}
          </button>
        )}
        <button onClick={startOver} className="hover:text-foreground">
          Wrong email? Start over
        </button>
      </div>
    </div>
  )
}