import { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { useStudyRuntimeStore } from '@/store/study'

export function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { data: profile } = useUserProfile(!!accessToken)
  const setHearts = useStudyRuntimeStore((s) => s.setHearts)
  const hasHydrated = useRef(false)

  // Hydrate hearts once, app-wide, the first time we have real profile data —
  // not per-page. After this, loseHeart() mutations keep both the runtime
  // store AND the cached profile in sync (see CorrectionLoop), so no page
  // needs to re-hydrate.
  useEffect(() => {
    if (profile && !hasHydrated.current) {
      setHearts(profile.heart, 5) // ⚠️ 5 = documented default max; no explicit max_hearts field exists yet
      hasHydrated.current = true
    }
  }, [profile, setHearts])

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />
}