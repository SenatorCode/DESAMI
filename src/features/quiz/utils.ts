import type { QuizOption, QuizQuestion } from './types'

export function isCorrectOption(question: QuizQuestion, option: QuizOption): boolean {
  return option.option_text === question.answer
}
export function pickedOption(question: QuizQuestion, picks: Record<number, number>): QuizOption | undefined {
  return question.options.find((o) => o.option_id === picks[question.question_id])
}
export function countCorrect(questions: QuizQuestion[], picks: Record<number, number>): number {
  return questions.filter((q) => {
    const picked = pickedOption(q, picks)
    return picked ? isCorrectOption(q, picked) : false
  }).length
}