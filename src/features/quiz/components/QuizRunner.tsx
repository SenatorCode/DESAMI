import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'
import { parseApiError } from '@/lib/apiError'
import { saveQuizProgress } from '../api'
import type { QuizQuestion } from '../types'
import { countCorrect, isCorrectOption, pickedOption } from '../utils'
import { QuizResults } from './QuizResults'

interface QuizRunnerProps {
  sessionId: string
  questions: QuizQuestion[]
  onNewQuiz: () => void
  isStartingNew: boolean
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function QuizRunner({ sessionId, questions, onNewQuiz, isStartingNew }: QuizRunnerProps) {
  const queryClient = useQueryClient()
  const [index, setIndex] = useState(0)
  const [picks, setPicks] = useState<Record<number, number>>({}) // question_id -> option_id
  const [finished, setFinished] = useState(false)
  const nextRef = useRef<HTMLButtonElement>(null)

  const total = questions.length
  const question = questions[index]

  const saveMutation = useMutation({
    mutationFn: (correct: number) =>
      saveQuizProgress(sessionId, { correct_count: correct, total_questions: total }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      if (res.xp_gained > 0) toast.success(`+${res.xp_gained} XP`)
      res.new_achievements.forEach((a) => toast.success(`Achievement unlocked: ${a.title}`))
    },
    onError: (err) => toast.error(parseApiError(err).message),
  })

  const picked = pickedOption(question, picks)
  const answered = Boolean(picked)
  const correctCount = countCorrect(questions, picks)

  function choose(optionId: number) {
    if (answered) return
    setPicks((prev) => ({ ...prev, [question.question_id]: optionId }))
    setTimeout(() => nextRef.current?.focus(), 0)
  }

  function next() {
    if (index < total - 1) {
      setIndex(index + 1)
      return
    }
    setFinished(true)
    saveMutation.mutate(correctCount)
  }

  function retake() {
    setPicks({})
    setIndex(0)
    setFinished(false)
    saveMutation.reset()
  }

  if (finished) {
    return (
      <QuizResults
        sessionId={sessionId}
        questions={questions}
        picks={picks}
        correct={correctCount}
        result={saveMutation.data}
        isSaving={saveMutation.isPending}
        saveFailed={saveMutation.isError}
        onRetrySave={() => saveMutation.mutate(correctCount)}
        onRetake={retake}
        onNewQuiz={onNewQuiz}
        isStartingNew={isStartingNew}
      />
    )
  }

  const pickedCorrect = picked ? isCorrectOption(question, picked) : false

  return (
    <div className="flex flex-col gap-6">
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-valuetext={`Question ${index + 1} of ${total}`}
        className="flex gap-1.5"
      >
        {questions.map((q, i) => {
          const p = pickedOption(q, picks)
          const color = p
            ? isCorrectOption(q, p) ? 'bg-success' : 'bg-destructive'
            : i === index ? 'bg-primary' : 'bg-muted'
          return <div key={q.question_id} className={`h-1.5 flex-1 rounded-full ${color}`} />
        })}
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Question {index + 1} of {total}</p>
        <h1 className="text-xl font-semibold leading-snug">{question.question}</h1>
      </div>

      <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
        {question.options.map((option, i) => {
          const isPicked = picked?.option_id === option.option_id
          const isCorrect = isCorrectOption(question, option)
          let style = 'border bg-card hover:bg-muted'
          if (answered) {
            if (isCorrect) style = 'border-success bg-success/10'
            else if (isPicked) style = 'border-destructive bg-destructive/10'
            else style = 'border bg-card opacity-60'
          }
          return (
            <button
              key={option.option_id}
              onClick={() => choose(option.option_id)}
              disabled={answered}
              className={`flex items-start gap-3 rounded-xl p-4 text-left text-sm transition ${style}`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-medium">
                {LETTERS[i] ?? i + 1}
              </span>
              <span className="flex-1">{option.option_text}</span>
              {answered && isCorrect && <CheckCircle2 size={18} className="shrink-0 text-success" aria-label="Correct answer" />}
              {answered && isPicked && !isCorrect && (
                <XCircle size={18} className="shrink-0 text-destructive" aria-label="Your answer, incorrect" />
              )}
            </button>
          )
        })}
      </div>

      <div role="status" aria-live="polite">
        {answered && (
          <div className={`rounded-xl border p-4 text-sm ${pickedCorrect ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'}`}>
            <p className={`font-semibold ${pickedCorrect ? 'text-success' : 'text-destructive'}`}>
              {pickedCorrect ? 'Correct!' : `Not quite. The answer is ${question.answer}.`}
            </p>
            {picked?.rationale && <p className="mt-2">{picked.rationale}</p>}
            {question.explanation && <p className="mt-2 text-muted-foreground">{question.explanation}</p>}
          </div>
        )}
      </div>

      {answered && (
        <button
          ref={nextRef}
          onClick={next}
          className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
        >
          {index < total - 1 ? 'Next question' : 'See results'}
        </button>
      )}
    </div>
  )
}