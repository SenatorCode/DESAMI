import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { PageError } from '@/components/common/PageState'
import { parseApiError } from '@/lib/apiError'
import { useSessionStatus } from '../hooks/useSessionStatus'

interface SessionProcessingProps {
  sessionId: string
  onCompleted: (sessionId: string) => void
  onUploadAgain: () => void
}

export function SessionProcessing({ sessionId, onCompleted, onUploadAgain }: SessionProcessingProps) {
  const { data, isError, error, refetch } = useSessionStatus(sessionId)

  const handled = useRef(false) // fire onCompleted once only
  useEffect(() => {
    if (data?.status === 'completed' && !handled.current) {
      handled.current = true
      onCompleted(sessionId)
    }
  }, [data?.status, sessionId, onCompleted])

  if (data?.status === 'failed') {
    return (
      <PageError
        title="We couldn't process your file"
        message={data.message ?? 'Please try uploading it again.'}
        onRetry={onUploadAgain}
      />
    )
  }

  if (isError) {
    return (
      <PageError
        title="Couldn't check your upload"
        message={parseApiError(error).message}
        onRetry={() => refetch()}
        action={
          <Link
            to="/sessions"
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            My sessions
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center" role="status">
      <Loader2 className="animate-spin text-primary" size={32} />
      <p className="text-lg font-semibold">
        {data?.status === 'processing' ? 'Building your study session…' : 'Queued…'}
      </p>
      {typeof data?.progress === 'number' && (
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${data.progress}%` }} />
        </div>
      )}
    </div>
  )
}