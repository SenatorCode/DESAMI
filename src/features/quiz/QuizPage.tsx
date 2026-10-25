import { Link, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { PageError, PageLoader } from '@/components/common/PageState'
import { startNewQuiz } from './api'
import { useQuiz, quizQueryKey } from './hooks/useQuiz'
import { describeQuizError } from './quizError'
import { QuizRunner } from './components/QuizRunner'

export function QuizPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  if (!sessionId) return <PageError title="Missing session" message="Open a quiz from your session page." />
  return <QuizScreen sessionId={sessionId} />
}

function QuizScreen({ sessionId }: { sessionId: string }) {
  const queryClient = useQueryClient()
  const { data, isPending, isError, error, refetch } = useQuiz(sessionId)

  const newQuiz = useMutation({
    mutationFn: () => startNewQuiz(sessionId),
    onSuccess: (res) => queryClient.setQueryData(quizQueryKey(sessionId), res), // resumes polling
    onError: (err) => {
      const { title, message } = describeQuizError(err)
      toast.error(`${title}. ${message}`)
    },
  })

  const exit = (
    <Link to={`/session/${sessionId}`} className="text-sm text-muted-foreground underline">
      Back to session
    </Link>
  )

  let body
  if (isPending) {
    body = <PageLoader label="Loading your quiz…" />
  } else if ((isError && data?.status !== 'completed') || !data) {
    const { title, message } = describeQuizError(error)
    body = <PageError title={title} message={message} onRetry={() => refetch()} action={exit} />
  } else if (data.status === 'failed') {
    body = (
      <PageError
        title="We couldn't build your quiz"
        message="Generation failed. Trying again will load your previous quiz if you have one."
        onRetry={() => refetch()}
        action={exit}
      />
    )
  } else if (data.status === 'completed' && data.questions) {
    body = (
      <QuizRunner
        key={data.questions.map((q) => q.question_id).join('-')}
        sessionId={sessionId}
        questions={data.questions}
        onNewQuiz={() => newQuiz.mutate()}
        isStartingNew={newQuiz.isPending}
      />
    )
  } else {
    const progress = data.progress ?? 0
    body = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center" role="status">
        <h1 className="text-lg font-semibold">Building your quiz…</h1>
        <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
        <div className="h-2 w-64 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link
        to={`/session/${sessionId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} /> Exit quiz
      </Link>
      {body}
    </main>
  )
}