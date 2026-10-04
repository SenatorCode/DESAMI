// src/features/study/StudyPage.tsx
import {useState } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, Loader2 } from 'lucide-react'
import { useStudyData } from './hooks/useStudyData'
import { StudyModuleView } from './components/StudyModuleView'
import { useStudyRuntimeStore } from '@/store/study'

export function StudyPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { data, isLoading, isError } = useStudyData(sessionId!)
  const [moduleIndex, setModuleIndex] = useState(0)
  const hearts = useStudyRuntimeStore((s) => s.hearts)
  const maxHearts = useStudyRuntimeStore((s) => s.maxHearts)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Could not load this study session.
      </div>
    )
  }

  const currentModule = data.modules[moduleIndex]
  const isLastModule = moduleIndex === data.modules.length - 1
  const outOfHearts = hearts <= 0

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{data.subject_name}</p>
          <h1 className="text-2xl font-semibold">{currentModule.title}</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
          <Heart size={16} className="fill-clutch text-clutch" />
          <span className="text-sm font-medium">
            {hearts}/{maxHearts}
          </span>
        </div>
      </div>

      {outOfHearts ? (
        <div className="rounded-2xl border border-clutch/40 bg-clutch/10 p-8 text-center">
          <p className="font-semibold text-clutch">Out of hearts</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Wait for your hearts to regenerate, or upgrade to keep going.
          </p>
        </div>
      ) : (
        <StudyModuleView
          key={currentModule.id}
          sessionId={sessionId!}
          module={currentModule}
          onModuleComplete={() => {
            if (!isLastModule) setModuleIndex((i) => i + 1)
          }}
        />
      )}
    </main>
  )
}