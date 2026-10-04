import { Routes, Route } from 'react-router-dom'
import { WaitlistPage } from '@/features/waitlist/WaitlistPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { HobbyOnboardingPage } from '@/features/onboarding/HobbyOnboardingPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProtectedRoute } from './ProtectedRoute'
import { StudyUploadPage } from '@/features/study/StudyUploadPage'
import { StudyPage} from '@/features/study/StudyPage'
import { SessionsPage } from '@/features/study/SessionsPage'
import { SessionHubPage } from '@/features/session-hub/SessionHubPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WaitlistPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding/hobbies" element={<HobbyOnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/study/upload" element={<StudyUploadPage />} />
        <Route path="/study/:sessionId" element={<StudyPage />} />
        <Route path="/session/:sessionId" element={<SessionHubPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
      </Route>
    </Routes>
  )
}