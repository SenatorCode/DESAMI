// src/features/study/components/CorrectionLoop.tsx
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { getExplanation, getHobbyAnalogy, loseHeart } from '../api'
import { useStudyRuntimeStore } from '@/store/study'
import { extractErrorMessage } from '@/lib/axios'
import type { StudyQuizQuestion } from '../types'
import type { UserProfile } from '@/features/profile/types'

interface CorrectionLoopProps {
  sessionId: string
  moduleId: number
  chunkId: number
  question: StudyQuizQuestion
  onValidated: () => void
}

export function CorrectionLoop({ sessionId, moduleId, chunkId, question, onValidated }: CorrectionLoopProps) {
  const setHearts = useStudyRuntimeStore((s) => s.setHearts)
  const queryClient = useQueryClient()
  const [retryAnswer, setRetryAnswer] = useState<string | null>(null)
  const [wantsHobbyPivot, setWantsHobbyPivot] = useState(false)

  const heartMutation = useMutation({
    mutationFn: loseHeart,
    onSuccess: (data) => {
      setHearts(data.hearts_remaining, data.max_hearts)
      // Keep the cached profile (used on Dashboard, etc.) in sync so nothing
      // needs a second hydration or a background refetch to catch up.
      queryClient.setQueryData<UserProfile>(['user-profile'], (old) =>
        old ? { ...old, heart: data.hearts_remaining } : old
      )
      if (!data.can_continue) toast.error('Out of hearts — come back later to continue.')
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })

  const explainMutation = useMutation({
    mutationFn: () => getExplanation(sessionId, moduleId, chunkId, question.question_id),
    onError: (err) => toast.error(extractErrorMessage(err)),
  })

  const hobbyMutation = useMutation({
    mutationFn: () => getHobbyAnalogy(sessionId, moduleId, chunkId),
    onError: (err) => toast.error(extractErrorMessage(err)),
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

      {explainMutation.isPending || !explainMutation.data ? (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" /> Getting an explanation…
        </div>
      ) : (
        <p className="mt-2 text-foreground">{explainMutation.data.text}</p>
      )}

      {!wantsHobbyPivot ? (
        <button
          onClick={() => { setWantsHobbyPivot(true); hobbyMutation.mutate() }}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Lightbulb size={14} /> Still stuck? Explain with my hobby
        </button>
      ) : (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">Hobby Pivot</span>
          {hobbyMutation.isPending || !hobbyMutation.data ? (
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Finding a better way to explain this…
            </div>
          ) : (
            <p className="mt-1 text-sm text-foreground">{hobbyMutation.data.text}</p>
          )}
        </div>
      )}

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