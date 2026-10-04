// src/features/dashboard/DashboardPage.tsx
import { useNavigate } from 'react-router-dom'
import { Loader2, BookOpenCheck, Target, Flame, Plus, Sparkles, ArrowRight } from 'lucide-react'
import { AppHeader } from '@/components/common/AppHeader'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { StatTile } from './components/StatTile'
import { RecentSessionCard } from './components/RecentSessionCard'
import { deriveLevel, placeholderDailyTargetMinutes, placeholderAiInsight } from '@/lib/placeholderContent'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: profile, isLoading, isError } = useUserProfile()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Could not load your dashboard.
      </div>
    )
  }

  const level = deriveLevel(profile.xp)

  return (
    <main className="min-h-screen bg-muted/20">
      <AppHeader streak={profile.streak} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Good morning, {profile.first_name}</h1>
            <p className="mt-1 text-muted-foreground">Ready to kickstart today's session?</p>
          </div>

          {/* ⚠️ Level/XP-to-next-level is placeholder math — see placeholderContent.ts */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-background px-5 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent">
              <Sparkles size={18} />
            </div>
            <div className="min-w-48">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{level.label}</span>
                <span className="text-muted-foreground">{profile.xp.toLocaleString()} XP</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(level.xpIntoLevel / level.xpForLevel) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {level.xpToNext.toLocaleString()} XP to next level · Daily target{' '}
                {placeholderDailyTargetMinutes()}m
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatTile
            label="Sessions Completed"
            value={String(profile.recent.length)}
            icon={<BookOpenCheck size={16} />}
          />
          <StatTile
            label="Avg. Quiz Accuracy"
            value={`${profile.avg_quiz_score}%`}
            icon={<Target size={16} />}
            barPercent={profile.avg_quiz_score}
          />
          <StatTile
            label="Current Streak"
            value={`${profile.streak} Days`}
            icon={<Flame size={16} />}
            barClassName="bg-clutch"
            barPercent={(profile.streak / 30) * 100}
          />
        </div>

        <div className="mb-10 flex flex-col justify-between gap-6 rounded-2xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center">
          <div className="max-w-lg">
            <h2 className="text-2xl font-semibold">Start an AI Study Session</h2>
            <p className="mt-2 text-primary-foreground/80">
              Upload syllabi, raw notes, or lecture slide decks. DESAMI structures the
              content into study modules built around what you actually enjoy.
            </p>
          </div>
          <button
            onClick={() => navigate('/study/upload')}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-background px-5 py-3 font-medium text-foreground transition hover:opacity-90"
          >
            <Plus size={16} /> New Session
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Recent Sessions{' '}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {profile.recent.length} total
              </span>
            </h2>

            {profile.recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sessions yet — start your first one above.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.recent.map((session) => (
                  <RecentSessionCard key={session.session_id} session={session} />
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/sessions')}
              className="mt-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all sessions <ArrowRight size={14} />
            </button>
          </div>

          {/* ⚠️ Entirely placeholder — no AI-insight endpoint exists yet */}
          <div className="h-fit rounded-2xl border border-border bg-background p-5">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-semibold">DESAMI AI Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">{placeholderAiInsight()}</p>
          </div>
        </div>
      </div>
    </main>
  )
}