// src/features/study/components/StudyChunkView.tsx
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Lightbulb, Loader2 } from 'lucide-react'
import { getHobbyAnalogy } from '../api'
import { extractErrorMessage } from '@/lib/axios'
import type { StudyChunk } from '../types'

interface StudyChunkViewProps {
  sessionId: string
  moduleId: number
  chunk: StudyChunk
  onContinue: () => void
}

// Reading-only. Check-in questions for the module are now a separate phase
// presented AFTER all chunks are read — see StudyModuleView.
export function StudyChunkView({ sessionId, moduleId, chunk, onContinue }: StudyChunkViewProps) {
  const [analogy, setAnalogy] = useState<string | null>(null)

  const analogyMutation = useMutation({
    mutationFn: () => getHobbyAnalogy(sessionId, moduleId, chunk.id),
    onSuccess: (data) => setAnalogy(data.text),
    onError: (err) => toast.error(extractErrorMessage(err)),
  })

  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-6">
      <p className="leading-relaxed text-foreground">{chunk.text}</p>

      {analogy && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">Hobby Pivot</span>
          <p className="mt-1 text-sm text-foreground">{analogy}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={onContinue}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Continue
        </button>
        <button
          onClick={() => analogyMutation.mutate()}
          disabled={analogyMutation.isPending || !!analogy}
          className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {analogyMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
          Explain with my hobby
        </button>
      </div>
    </div>
  )
}