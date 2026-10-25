// src/features/study/components/CorrectionLoop.tsx
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Lightbulb, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getExplanation, getHobbyAnalogy, loseHeart } from '../api'
import { useStudyRuntimeStore } from '@/store/study'
import { ErrorCode, parseApiError } from '@/lib/apiError'
import type { StudyChunk, StudyQuizQuestion } from '../types'
import type { UserProfile } from '@/features/profile/types'

interface CorrectionLoopProps {
  sessionId: string
  moduleId: number
  /** The module's chunks — the hobby analogy endpoint is per-chunk. */
  chunks: StudyChunk[]
  question: StudyQuizQuestion
  onValidated: () => void
}

export function CorrectionLoop({ sessionId, moduleId, chunks, question, onValidated }: CorrectionLoopProps) {
  const setHearts = useStudyRuntimeStore((s) => s.setHearts)
  const setNextHeartIn = useStudyRuntimeStore((s) => s.setNextHeartIn)
  const queryClient = useQueryClient()
  const [retryAnswer, setRetryAnswer] = useState<string | null>(null)

  // Hobby Pivot. A quiz question belongs to a module, not a chunk (v2.6), but the
  // analogy endpoint is per-chunk. Use the question's chunk if the backend provides
  // one, or the module's only chunk; otherwise the student picks what confused them.
  const knownChunkId = question.chunk_id ?? (chunks.length === 1 ? chunks[0].id : undefined)
  const [pivotOpen, setPivotOpen] = useState(false)
  const [pivotChunkId, setPivotChunkId] = useState<number | null>(null)
  const [analogies, setAnalogies] = useState<Record<number, string>>({})

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

  const hobbyMutation = useMutation({
    mutationFn: (chunkId: number) => getHobbyAnalogy(sessionId, moduleId, chunkId),
    onSuccess: (data, chunkId) => setAnalogies((prev) => ({ ...prev, [chunkId]: data.text })),
    // Shown inline with a retry; no toast needed.
  })

  const pickChunk = (chunkId: number) => {
    setPivotChunkId(chunkId)
    if (!analogies[chunkId]) hobbyMutation.mutate(chunkId)
  }

  const openPivot = () => {
    setPivotOpen(true)
    if (knownChunkId != null) pickChunk(knownChunkId)
  }

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

      {!pivotOpen ? (
        <button onClick={openPivot} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Lightbulb size={14} /> Still stuck? Explain with my hobby
        </button>
      ) : (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">Hobby Pivot</span>

          {pivotChunkId == null ? (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Which part is confusing?</p>
              <div className="mt-2 flex flex-col gap-2">
                {chunks.map((chunk, i) => (
                  <button
                    key={chunk.id}
                    onClick={() => pickChunk(chunk.id)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition hover:bg-muted"
                  >
                    <span className="mr-1.5 text-xs font-semibold text-muted-foreground">{i + 1}.</span>
                    {chunk.text.length > 90 ? `${chunk.text.slice(0, 90)}…` : chunk.text}
                  </button>
                ))}
              </div>
            </div>
          ) : analogies[pivotChunkId] ? (
            <p className="mt-1 text-sm text-foreground">{analogies[pivotChunkId]}</p>
          ) : hobbyMutation.isError ? (
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{parseApiError(hobbyMutation.error).message}</span>
              <button onClick={() => hobbyMutation.mutate(pivotChunkId)} className="font-medium text-primary hover:underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Finding a better way to explain this…
            </div>
          )}

          {pivotChunkId != null && chunks.length > 1 && (
            <button
              onClick={() => setPivotChunkId(null)}
              className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Try a different part
            </button>
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