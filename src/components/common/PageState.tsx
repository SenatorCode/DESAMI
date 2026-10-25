import type { ReactNode } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground" role="status">
      <Loader2 className="animate-spin text-primary" size={32} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  )
}

interface PageErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
}

export function PageError({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
  action,
}: PageErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center" role="alert">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle size={22} />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      <div className="mt-2 flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
          >
            Try again
          </button>
        )}
        {action}
      </div>
    </div>
  )
}