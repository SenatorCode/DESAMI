import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { useStudyRuntimeStore } from '@/store/study'

/**
 * Single logout path for every header/menu. Besides clearing tokens it drops the
 * React Query cache and runtime hearts, otherwise the next user to log in on the
 * same browser briefly sees the previous user's profile and sessions.
 */
export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)
  const setHearts = useStudyRuntimeStore((s) => s.setHearts)

  return () => {
    logout()
    queryClient.clear()
    setHearts(5, 5)
    navigate('/login', { replace: true })
  }
}