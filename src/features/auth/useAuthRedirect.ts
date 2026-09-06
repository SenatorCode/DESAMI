import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { fetchMe, fetchHobbies } from './api'

export function useAuthRedirect() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  return async () => {
    // Profile fetch failing shouldn't block routing — dashboard/onboarding
    // can retry it themselves. Log it so it's not invisible.
    try {
      setUser(await fetchMe())
    } catch (err) {
      console.error('[useAuthRedirect] fetchMe failed:', err)
    }

    // Hobbies check is what actually decides routing — must not be masked
    // by an unrelated fetchMe failure.
    try {
      const hobbies = await fetchHobbies()
      navigate(hobbies.length === 0 ? '/onboarding/hobbies' : '/dashboard')
    } catch (err) {
      console.error('[useAuthRedirect] fetchHobbies failed:', err)
      // If we genuinely can't tell whether they have hobbies, default to
      // onboarding rather than dashboard — safer to ask again than to skip
      // a mandatory step.
      navigate('/onboarding/hobbies')
    }
  }
}