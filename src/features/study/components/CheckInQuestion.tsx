// src/features/study/components/CheckInQuestion.tsx
import { useState } from 'react'
import { CorrectionLoop } from './CorrectionLoop'
import type { StudyQuizQuestion } from '../types'

interface CheckInQuestionProps {
  sessionId: string
  moduleId: number
  chunkId: number
  question: StudyQuizQuestion
  onResolved: (firstTryCorrect: boolean) => void
}

export function CheckInQuestion({ sessionId, moduleId, chunkId, question, onResolved }: CheckInQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showCorrection, setShowCorrection] = useState(false)
  const [resolved, setResolved] = useState(false)

  const handleSelect = (optionText: string) => {
    if (resolved) return
    setSelected(optionText)
    if (optionText === question.answer) {
      setResolved(true)
      onResolved(true) // correct first try
    } else {
      setShowCorrection(true)
    }
  }

  const handleValidated = () => {
    setResolved(true)
    onResolved(false) // needed the correction loop — not first-try correct
  }

  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="font-medium">{question.question}</p>
      <div className="mt-3 flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.option_text}
            onClick={() => handleSelect(opt.option_text)}
            disabled={resolved}
            className={`rounded-lg border px-4 py-2.5 text-left text-sm transition ${
              selected === opt.option_text
                ? opt.option_text === question.answer
                  ? 'border-success bg-success/10'
                  : 'border-destructive bg-destructive/10'
                : 'border-border hover:bg-muted'
            } disabled:cursor-default`}
          >
            {opt.option_text}
          </button>
        ))}
      </div>

      {showCorrection && !resolved && (
        <div className="mt-4">
          <CorrectionLoop
            sessionId={sessionId}
            moduleId={moduleId}
            chunkId={chunkId}
            question={question}
            onValidated={handleValidated}
          />
        </div>
      )}

      {resolved && <p className="mt-3 text-sm font-medium text-success">Nice — locked in. ✓</p>}
    </div>
  )
}