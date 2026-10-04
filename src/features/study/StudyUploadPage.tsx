// src/features/study/StudyUploadPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/common/AppHeader'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { SessionUpload } from './components/SessionUpload'
import { SessionProcessing } from './components/SessionProcessing'

export function StudyUploadPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { data: profile } = useUserProfile()

  return (
    <main className="min-h-screen bg-muted/20">
      <AppHeader streak={profile?.streak} />
      <div className="px-6 py-16">
        {sessionId ? (
          <SessionProcessing sessionId={sessionId} onCompleted={(id) => navigate(`/session/${id}`)} />
        ) : (
          <SessionUpload onSessionCreated={setSessionId} />
        )}
      </div>
    </main>
  )
}