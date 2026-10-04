import { Navigate } from 'react-router-dom'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { usePendingSignup } from '@/store/pendingSignup'
import { OtpForm } from './components/OtpForm'

export function VerifyOtpPage() {
  const pending = usePendingSignup((s) => s.pending)

  // Refresh / direct visit: the pending signup lives in memory only, so start over.
  if (!pending) return <Navigate to="/signup" replace />

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6 pb-16 pt-24">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-semibold">Check your email</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            We sent a verification code to <span className="font-medium text-foreground">{pending.email}</span>.
            Enter it below to create your account.
          </p>
          <OtpForm email={pending.email} />
        </div>
      </div>
      <Footer />
    </main>
  )
}