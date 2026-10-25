// src/features/study/StudyPage.tsx
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { PageError, PageLoader } from '@/components/common/PageState'
import { useStudyData } from './hooks/useStudyData'
import { StudyModuleView } from './components/StudyModuleView'
import { describeStudyLoadError } from './loadError'
import { useStudyRuntimeStore } from '@/store/study'

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Ticks once a second while `active`, so countdowns re-render. */
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [active])
  return now
}

export function StudyPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { data, isLoading, isError, error, refetch } = useStudyData(sessionId!)
  const [moduleIndex, setModuleIndex] = useState(0)
  const hearts = useStudyRuntimeStore((s) => s.hearts)
  const maxHearts = useStudyRuntimeStore((s) => s.maxHearts)
  const nextHeartAt = useStudyRuntimeStore((s) => s.nextHeartAt)
  const now = useNow(nextHeartAt != null)

  if (isLoading) {
    return <PageLoader />
  }

  if (isError || !data) {
    return (
      <PageError
        {...describeStudyLoadError(error)}
        onRetry={() => refetch()}
        action={
          <Link to="/sessions" className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted">
            All sessions
          </Link>
        }
      />
    )
  }

  const currentModule = data.modules[moduleIndex]
  const isLastModule = moduleIndex === data.modules.length - 1
  const outOfHearts = hearts <= 0

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to={`/session/${sessionId}`}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={14} /> Exit study
      </Link>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{data.subject_name}</p>
          <h1 className="text-2xl font-semibold">{currentModule.title}</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
          <Heart size={16} className="fill-clutch text-clutch" />
          <span className="text-sm font-medium">
            {hearts}/{maxHearts}
          </span>
        </div>
      </div>

      {outOfHearts ? (
        <div className="rounded-2xl border border-clutch/40 bg-clutch/10 p-8 text-center">
          <p className="font-semibold text-clutch">Out of hearts</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Wait for your hearts to regenerate, or upgrade to keep going.
          </p>
          {nextHeartAt != null && nextHeartAt > now && (
            <p className="mt-2 text-sm font-medium">Next heart in {formatCountdown(nextHeartAt - now)}</p>
          )}
        </div>
      ) : (
        <StudyModuleView
          key={currentModule.id}
          sessionId={sessionId!}
          module={currentModule}
          onModuleComplete={() => {
            if (!isLastModule) setModuleIndex((i) => i + 1)
          }}
        />
      )}
    </main>
  )
}