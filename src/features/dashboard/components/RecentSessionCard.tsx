// src/features/dashboard/components/RecentSessionCard.tsx
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import type { RecentSessionSummary } from '@/features/profile/types'

// ⚠️ File-type tag and "In Progress"/"Complete" derivation are placeholders —
// GET /users/me/'s `recent` array only returns session_id, session_name, progress.
export function RecentSessionCard({ session }: { session: RecentSessionSummary }) {
  const navigate = useNavigate()
  const inProgress = session.progress < 100

  return (
    <button
      onClick={() => navigate(`/session/${session.session_id}`)}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 text-left transition hover:border-primary/40"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <FileText size={14} className="text-clutch" />
        DOCUMENT
      </div>
      <h3 className="font-semibold leading-snug">{session.session_name}</h3>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{session.progress}% Mastered</span>
        <span className="text-muted-foreground">{inProgress ? 'In Progress' : 'Complete'}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${session.progress}%` }} />
      </div>
    </button>
  )
}