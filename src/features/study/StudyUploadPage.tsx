// src/features/study/StudyUploadPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionUpload } from './components/SessionUpload'
import { SessionProcessing } from './components/SessionProcessing'

export function StudyUploadPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      {sessionId ? (
        <SessionProcessing sessionId={sessionId} onCompleted={(id) => navigate(`/session/${id}`)} />
      ) : (
        <SessionUpload onSessionCreated={setSessionId} />
      )}
    </div>
  )
}