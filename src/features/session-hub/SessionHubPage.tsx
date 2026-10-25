// src/features/session-hub/SessionHubPage.tsx
import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Download,
  Settings,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Zap,
  Network,
} from 'lucide-react'
import { PageError, PageLoader } from '@/components/common/PageState'
import { describeStudyLoadError } from '@/features/study/loadError'
import { useStudyData } from '@/features/study/hooks/useStudyData'
import {
  placeholderAiSummary,
  placeholderModuleDescription,
  placeholderMasteryPercent,
  placeholderFileMeta,
} from '@/lib/placeholderContent'

export function SessionHubPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { data: study, isLoading, isError, error, refetch } = useStudyData(sessionId!)

  if (isLoading) return <PageLoader />

    if (isError || !study) {
    return (
      <PageError
        {...describeStudyLoadError(error)}
        onRetry={() => refetch()}
        action={
          <button
            onClick={() => navigate('/sessions')}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            All sessions
          </button>
        }
      />
    )
  }

  // ⚠️ placeholder — no file-metadata endpoint exists for a session
  const fileMeta = placeholderFileMeta()

  return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <button
          onClick={() => navigate('/sessions')}
          className="mb-6 flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={14} /> All Sessions
        </button>

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-xs text-muted-foreground">Study material</p>
            <h1 className="mt-1 text-3xl font-semibold">{study.subject_name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5">
              <BookOpen size={18} className="text-primary" />
              <div className="text-sm">
                <p className="font-medium leading-tight">{fileMeta.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {fileMeta.pages} pages · {fileMeta.sizeMb}MB
                </p>
              </div>
            </div>
            {/* Not wired — no share/download/settings behavior defined yet */}
            <button aria-label="Share" title="Not wired yet" className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
              <Share2 size={16} />
            </button>
            <button aria-label="Download" title="Not wired yet" className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
              <Download size={16} />
            </button>
            <button aria-label="Settings" title="Not wired yet" className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* ⚠️ Entirely placeholder — no AI-summary field/endpoint exists */}
        <div className="mb-10 rounded-2xl border border-border bg-background p-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="font-semibold">AI Synthesis Summary</span>
          </div>
          <p className="text-muted-foreground">{placeholderAiSummary(study.subject_name)}</p>
        </div>

        <h2 className="mb-4 text-lg font-semibold">Mastery Modes</h2>
        <div className="mb-10 flex flex-col gap-4">
          <ModeCard
            icon={<BookOpen size={28} />}
            title="Study"
            subtitle="Review your material"
            description="Interactive study session with hobby analogies and check-in questions after every chunk."
            action="Launch Study Mode"
            onAction={() => navigate(`/study/${sessionId}`)}
          />
          {/* Honest state: Quiz and Clutch aren't built yet, so these are
              visually present per the mockup but genuinely disabled — not
              faked as functional. */}
          <ModeCard
            icon={<ClipboardCheck size={28} />}
            title="Quiz"
            subtitle="Test your knowledge"
            description="Formal exam-style questions with detailed feedback on what you missed."
            action="Coming soon"
            disabled
          />
          <ModeCard
            icon={<Zap size={28} />}
            title="Clutch"
            subtitle="Quick last-minute review"
            description="High-yield summaries and flashcards for the hours before your exam."
            action="Coming soon"
            disabled
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network size={16} className="text-primary" />
              <h2 className="text-lg font-semibold">Extracted Learning Pathway</h2>
            </div>
            <span className="text-sm text-muted-foreground">{study.modules.length} modules</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {study.modules.map((module, i) => (
              <div key={module.id} className="rounded-2xl border border-border bg-background p-5">
                <span className="text-xs font-semibold text-primary">
                  MODULE {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 font-semibold">{module.title}</h3>
                {/* ⚠️ placeholder — StudyModules schema only has `title`, no description */}
                <p className="mt-1 text-sm text-muted-foreground">{placeholderModuleDescription()}</p>
                {/* ⚠️ placeholder — no mastery-percent concept exists in the schema */}
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {placeholderMasteryPercent(module.id)}% mastered
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

interface ModeCardProps {
  icon: ReactNode
  title: string
  subtitle: string
  description: string
  action: string
  onAction?: () => void
  disabled?: boolean
}

function ModeCard({ icon, title, subtitle, description, action, onAction, disabled }: ModeCardProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">
            {title} <span className="font-normal text-muted-foreground">— {subtitle}</span>
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={onAction}
        disabled={disabled}
        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {action} {!disabled && <ArrowRight size={14} />}
      </button>
    </div>
  )
}