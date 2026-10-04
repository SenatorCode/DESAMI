import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { WaitlistPage } from '@/features/waitlist/WaitlistPage'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/common/AppLayout'
import { PageLoader } from '@/components/common/PageState'

// Route-level code splitting: the landing page stays eager, everything behind
// it loads on demand (fixes the >500 kB bundle warning).
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('@/features/auth/SignupPage').then((m) => ({ default: m.SignupPage })))
const HobbyOnboardingPage = lazy(() =>
  import('@/features/onboarding/HobbyOnboardingPage').then((m) => ({ default: m.HobbyOnboardingPage }))
)
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const StudyUploadPage = lazy(() => import('@/features/study/StudyUploadPage').then((m) => ({ default: m.StudyUploadPage })))
const StudyPage = lazy(() => import('@/features/study/StudyPage').then((m) => ({ default: m.StudyPage })))
const SessionsPage = lazy(() => import('@/features/study/SessionsPage').then((m) => ({ default: m.SessionsPage })))
const SessionHubPage = lazy(() =>
  import('@/features/session-hub/SessionHubPage').then((m) => ({ default: m.SessionHubPage }))
)
const VerifyOtpPage = lazy(() => import('@/features/auth/VerifyOtpPage').then((m) => ({ default: m.VerifyOtpPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<WaitlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route element={<ProtectedRoute />}>
          {/* Focused screens — no app chrome */}
          <Route path="/onboarding/hobbies" element={<HobbyOnboardingPage />} />
          <Route path="/study/:sessionId" element={<StudyPage />} />

          {/* App shell: header + mobile tab bar */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/study/upload" element={<StudyUploadPage />} />
            <Route path="/session/:sessionId" element={<SessionHubPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}