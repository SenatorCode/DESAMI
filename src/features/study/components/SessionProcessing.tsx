// src/features/study/components/SessionProcessing.tsx
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useSessionStatus } from '../hooks/useSessionStatus'

interface SessionProcessingProps {
  sessionId: string
  onCompleted: (sessionId: string) => void
}

export function SessionProcessing({ sessionId, onCompleted }: SessionProcessingProps) {
  const { data, isError } = useSessionStatus(sessionId)

  useEffect(() => {
    if (data?.status === 'completed') onCompleted(sessionId)
  }, [data?.status, sessionId, onCompleted])

  const failed = isError || data?.status === 'failed'

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      {failed ? (
        <>
          <p className="text-lg font-semibold text-destructive">
            Something went wrong processing your file
          </p>
          <p className="text-sm text-muted-foreground">
            {data?.message ?? 'Please try uploading again.'}
          </p>
        </>
      ) : (
        <>
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-lg font-semibold">
            {data?.status === 'processing' ? 'Building your study session…' : 'Queued…'}
          </p>
          {typeof data?.progress === 'number' && (
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}