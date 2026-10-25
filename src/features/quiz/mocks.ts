import type { QuizQuestion, QuizResponse, SaveQuizPayload, SaveQuizResponse } from './types'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const QUESTION_SETS: QuizQuestion[][] = [
  [
    { question_id: 201, question: 'What is the powerhouse of the cell?',
      options: [
        { option_id: 1, option_text: 'Mitochondria', rationale: 'Mitochondria produce most of the cell’s ATP.' },
        { option_id: 2, option_text: 'Nucleus', rationale: 'The nucleus stores DNA; it does not make ATP.' },
        { option_id: 3, option_text: 'Ribosome', rationale: 'Ribosomes assemble proteins.' },
      ],
      answer: 'Mitochondria', explanation: 'Mitochondria make most of the cell’s ATP.' },
    { question_id: 202, question: 'Where does glycolysis occur?',
      options: [
        { option_id: 4, option_text: 'Cytoplasm', rationale: 'Glycolysis takes place in the cytoplasm.' },
        { option_id: 5, option_text: 'Mitochondrial matrix', rationale: 'The matrix hosts the Krebs cycle.' },
      ],
      answer: 'Cytoplasm', explanation: 'Glycolysis splits glucose in the cytoplasm.' },
  ],
  [
    { question_id: 301, question: 'Which molecule is the main energy currency?',
      options: [
        { option_id: 11, option_text: 'ATP', rationale: 'ATP transfers usable energy.' },
        { option_id: 12, option_text: 'DNA', rationale: 'DNA stores genetic information.' },
      ],
      answer: 'ATP', explanation: 'ATP is used within seconds of being made.' },
  ],
]

const generation = new Map<string, { set: number; startedAt: number }>()
const completedOnce = new Set<string>()

export async function mockGetQuiz(sessionId: string): Promise<QuizResponse> {
  await delay()
  const current = generation.get(sessionId) ?? { set: 0, startedAt: Date.now() }
  generation.set(sessionId, current)
  const elapsed = Date.now() - current.startedAt
  if (elapsed < 1500) return { session_id: sessionId, status: 'queued' }
  if (elapsed < 4500) return { session_id: sessionId, status: 'processing', progress: Math.round(((elapsed - 1500) / 3000) * 90) }
  return { session_id: sessionId, status: 'completed', questions: QUESTION_SETS[current.set % QUESTION_SETS.length] }
}

export async function mockStartNewQuiz(sessionId: string): Promise<QuizResponse> {
  await delay()
  const previous = generation.get(sessionId)?.set ?? 0
  generation.set(sessionId, { set: previous + 1, startedAt: Date.now() })
  return { session_id: sessionId, status: 'queued' }
}

export async function mockSaveQuizProgress(sessionId: string, payload: SaveQuizPayload): Promise<SaveQuizResponse> {
  await delay()
  const score = Math.round((payload.correct_count / payload.total_questions) * 100)
  const key = `${sessionId}:${generation.get(sessionId)?.set ?? 0}`
  const firstTime = !completedOnce.has(key)
  completedOnce.add(key)
  return {
    status: 'Progress saved',
    score,
    xp_gained: firstTime ? payload.correct_count * 25 : 0,
    new_achievements: score > 80
      ? [{ id: 'QUIZ_MASTER', title: 'Quiz Master', description: 'Scored over 80% in a quiz', icon: '' }]
      : [],
  }
}