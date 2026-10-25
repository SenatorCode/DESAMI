import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import type { QuizQuestion, SaveQuizResponse } from '../types'
import { isCorrectOption, pickedOption } from '../utils'

interface QuizResultsProps {
  sessionId: string
  questions: QuizQuestion[]
  picks: Record<number, number>
  correct: number
  result?: SaveQuizResponse
  isSaving: boolean
  saveFailed: boolean
  onRetrySave: () => void
  onRetake: () => void
  onNewQuiz: () => void
  isStartingNew: boolean
}

export function QuizResults({
  sessionId, questions, picks, correct, result, isSaving, saveFailed,
  onRetrySave, onRetake, onNewQuiz, isStartingNew,
}: QuizResultsProps) {
  const total = questions.length
  const percent = result?.score ?? Math.round((correct / total) * 100) // backend score wins
  const missed = questions.filter((q) => {
    const picked = pickedOption(q, picks)
    return !picked || !isCorrectOption(q, picked)
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">Your score</p>
        <p className="mt-1 text-5xl font-bold text-primary">{percent}%</p>
        <p className="mt-2 text-sm text-muted-foreground">{correct} correct · {total - correct} incorrect</p>

        <div className="mt-4 text-sm" role="status" aria-live="polite">
          {isSaving && (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Saving your result…
            </span>
          )}
          {result && result.xp_gained > 0 && (
            <span className="inline-flex items-center gap-2 font-medium text-success">
              <Sparkles size={14} /> +{result.xp_gained} XP earned
            </span>
          )}
          {result && result.xp_gained === 0 && (
            <span className="text-muted-foreground">XP is only awarded the first time you complete a quiz.</span>
          )}
          {saveFailed && (
            <span className="inline-flex flex-col items-center gap-2 text-destructive">
              We couldn't save your result.
              <button onClick={onRetrySave} className="rounded-xl border px-3 py-1.5 text-foreground transition hover:bg-muted">
                Try saving again
              </button>
            </span>
          )}
        </div>
      </div>

      {missed.length > 0 && (
        <section aria-labelledby="missed-heading">
          <h2 id="missed-heading" className="mb-3 text-lg font-semibold">Review missed questions</h2>
          <ul className="flex flex-col gap-3">
            {missed.map((q) => {
              const picked = pickedOption(q, picks)
              return (
                <li key={q.question_id} className="rounded-xl border bg-card p-4 text-sm">
                  <p className="font-medium">{q.question}</p>
                  <p className="mt-2 flex items-start gap-2 text-destructive">
                    <XCircle size={16} className="mt-0.5 shrink-0" />
                    <span>Your answer: {picked?.option_text ?? 'Not answered'}</span>
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-success">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <span>Correct answer: {q.answer}</span>
                  </p>
                  {q.explanation && <p className="mt-2 text-muted-foreground">{q.explanation}</p>}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRetake}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
        >
          <RotateCcw size={16} /> Retake this quiz
        </button>
        <button
          onClick={onNewQuiz}
          disabled={isStartingNew}
          className="flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
        >
          {isStartingNew ? 'Starting…' : 'New quiz (uses 1 of 5 daily)'}
        </button>
        <Link
          to={`/session/${sessionId}`}
          className="flex-1 rounded-xl border px-4 py-3 text-center text-sm font-medium transition hover:bg-muted"
        >
          Back to session
        </Link>
      </div>
    </div>
  )
}