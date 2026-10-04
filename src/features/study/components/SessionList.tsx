// src/features/study/components/SessionList.tsx
import { useNavigate } from 'react-router-dom'
import { Loader2, BookOpen, AlertTriangle, Plus } from 'lucide-react'
import { useSessions } from '../hooks/useSessions'
import type { SessionStatus } from '../types'

const STATUS_CONFIG: Record<SessionStatus, { label: string; dotClass: string; textClass: string }> = {
  queued: { label: 'Queued', dotClass: 'bg-muted-foreground', textClass: 'text-muted-foreground' },
  processing: { label: 'Processing…', dotClass: 'bg-primary animate-pulse', textClass: 'text-primary' },
  completed: { label: 'Ready', dotClass: 'bg-success', textClass: 'text-success' },
  failed: { label: 'Failed', dotClass: 'bg-destructive', textClass: 'text-destructive' },
}

export function SessionList() {
  const { data, isLoading, isError } = useSessions()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 size={16} className="animate-spin" /> Loading your sessions…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle size={16} /> Could not load your sessions.
      </div>
    )
  }

  const handleOpen = (sessionId: string, status: SessionStatus) => {
    if (status === 'completed') navigate(`/session/${sessionId}`)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Sessions</h1>
        <button
          onClick={() => navigate('/study/upload')}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
        >
          <Plus size={15} /> New Session
        </button>
      </div>

      {!data || data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-muted-foreground">No sessions yet — upload your first set of notes to get started.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((session) => {
            const status = STATUS_CONFIG[session.status]
            const clickable = session.status === 'completed'
            return (
              <li key={session.session_id}>
                <button
                  onClick={() => handleOpen(session.session_id, session.status)}
                  disabled={!clickable}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background px-5 py-4 text-left transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:border-border"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen size={18} />
                  </div>
                  <span className="flex-1 font-medium">{session.name ?? 'Untitled session'}</span>
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${status.textClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                    {status.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}