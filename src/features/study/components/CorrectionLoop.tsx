// src/features/study/components/CorrectionLoop.tsx
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getExplanation, loseHeart } from '../api'
import { useStudyRuntimeStore } from '@/store/study'
import { ErrorCode, parseApiError } from '@/lib/apiError'
import type { StudyQuizQuestion } from '../types'
import type { UserProfile } from '@/features/profile/types'

interface CorrectionLoopProps {
  sessionId: string
  moduleId: number
  question: StudyQuizQuestion
  onValidated: () => void
}

export function CorrectionLoop({ sessionId, moduleId, question, onValidated }: CorrectionLoopProps) {
  const setHearts = useStudyRuntimeStore((s) => s.setHearts)
  const setNextHeartIn = useStudyRuntimeStore((s) => s.setNextHeartIn)
  const queryClient = useQueryClient()
  const [retryAnswer, setRetryAnswer] = useState<string | null>(null)

  const syncHearts = (hearts: number, max: number) => {
    setHearts(hearts, max)
    // Keep the cached profile (Dashboard, header) in sync without a refetch.
    queryClient.setQueryData<UserProfile>(['user-profile'], (old) => (old ? { ...old, heart: hearts } : old))
  }

  const heartMutation = useMutation({
    mutationFn: loseHeart,
    onSuccess: (data) => {
      syncHearts(data.hearts_remaining, data.max_hearts)
      if (!data.can_continue) toast.error('Out of hearts — come back later to continue.')
    },
    onError: (err) => {
      const parsed = parseApiError(err)
      if (parsed.code === ErrorCode.OUT_OF_HEARTS) {
        // 403: the user is at 0. Lock the study screen and show the countdown.
        syncHearts(0, useStudyRuntimeStore.getState().maxHearts)
        setNextHeartIn(parsed.timeUntilNextHeart ?? null)
        return
      }
      toast.error(parsed.message)
    },
  })

  const explainMutation = useMutation({
    mutationFn: () => getExplanation(sessionId, moduleId, question.question_id),
    onError: (err) => toast.error(parseApiError(err).message),
  })

  useEffect(() => {
    heartMutation.mutate()
    explainMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = (optionText: string) => {
    setRetryAnswer(optionText)
    if (optionText === question.answer) onValidated()
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-5">
      <span className="text-xs font-semibold uppercase tracking-wide text-clutch">Not quite — here's why</span>

      {explainMutation.isPending ? (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" /> Getting an explanation…
        </div>
      ) : explainMutation.data ? (
        <p className="mt-2 text-foreground">{explainMutation.data.text}</p>
      ) : (
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <span>We couldn&apos;t load an explanation.</span>
          <button onClick={() => explainMutation.mutate()} className="font-medium text-primary hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Hobby Pivot intentionally removed here for now: in v2.6 questions belong to a
          module, but the hobby_analogy endpoint needs a chunk_id. See open question. */}

      <p className="mt-4 text-sm font-medium">Now try again:</p>
      <div className="mt-2 flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.option_text}
            onClick={() => handleRetry(opt.option_text)}
            className={`rounded-lg border px-4 py-2.5 text-left text-sm transition ${
              retryAnswer === opt.option_text
                ? opt.option_text === question.answer
                  ? 'border-success bg-success/10'
                  : 'border-destructive bg-destructive/10'
                : 'border-border hover:bg-muted'
            }`}
          >
            {opt.option_text}
          </button>
        ))}
      </div>
    </div>
  )
}