// src/features/study/components/StudyModuleView.tsx
import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { StudyChunkView } from './StudyChunkView'
import { CheckInQuestion } from './CheckInQuestion'
import { saveStudyProgress } from '../api'
import { extractErrorMessage } from '@/lib/axios'
import type { StudyModule } from '../types'

interface StudyModuleViewProps {
  sessionId: string
  module: StudyModule
  onModuleComplete: () => void
}

type ModulePhase = 'reading' | 'quiz'

export function StudyModuleView({ sessionId, module, onModuleComplete }: StudyModuleViewProps) {
  const [phase, setPhase] = useState<ModulePhase>('reading')
  const [chunkIndex, setChunkIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correctFirstTry, setCorrectFirstTry] = useState<Set<number>>(new Set())
  const [completed, setCompleted] = useState(false)

  // Flattened so all of a module's questions are presented together AFTER
  // its chunks are read, instead of interrupting reading chunk-by-chunk.
  const flatQuestions = useMemo(
    () =>
      module.chunks.flatMap((chunk) =>
        (chunk.quiz ?? []).map((question) => ({ chunkId: chunk.id, chunkText: chunk.text, question }))
      ),
    [module.chunks]
  )

  const saveMutation = useMutation({
    mutationFn: () =>
      saveStudyProgress(sessionId, {
        module_id: module.id,
        status: 'completed',
        total_correct_score: correctFirstTry.size,
      }),
    onSuccess: (data) => {
      setCompleted(true)
      toast.success(`+${data.xp_gained} XP earned!`)
      data.new_achievements.forEach((a) => toast(`🏆 Unlocked: ${a.title}`, { description: a.description }))
      onModuleComplete()
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  })

  const advanceChunk = () => {
    const isLastChunk = chunkIndex === module.chunks.length - 1
    if (!isLastChunk) {
      setChunkIndex((i) => i + 1)
      return
    }
    if (flatQuestions.length > 0) setPhase('quiz')
    else saveMutation.mutate()
  }

  const advanceQuestion = (questionId: number, firstTryCorrect: boolean) => {
    if (firstTryCorrect) setCorrectFirstTry((prev) => new Set(prev).add(questionId))
    const isLastQuestion = questionIndex === flatQuestions.length - 1
    if (isLastQuestion) saveMutation.mutate()
    else setQuestionIndex((i) => i + 1)
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-success/40 bg-success/10 p-8 text-center">
        <CheckCircle2 className="text-success" size={32} />
        <p className="font-semibold">Module complete!</p>
        {flatQuestions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {correctFirstTry.size}/{flatQuestions.length} correct on first try
          </p>
        )}
      </div>
    )
  }

  const totalSteps = module.chunks.length + flatQuestions.length
  const currentStep = phase === 'reading' ? chunkIndex : module.chunks.length + questionIndex
  const currentQuestion = flatQuestions[questionIndex]

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {phase === 'reading' ? (
        <StudyChunkView
          sessionId={sessionId}
          moduleId={module.id}
          chunk={module.chunks[chunkIndex]}
          onContinue={advanceChunk}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-muted/40 p-6">
          <p className="leading-relaxed text-foreground">{currentQuestion.chunkText}</p>
          <div className="mt-4">
            <CheckInQuestion
              sessionId={sessionId}
              moduleId={module.id}
              chunkId={currentQuestion.chunkId}
              question={currentQuestion.question}
              onResolved={(firstTryCorrect) =>
                advanceQuestion(currentQuestion.question.question_id, firstTryCorrect)
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}