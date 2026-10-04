// src/features/study/SessionsPage.tsx
import { AppHeader } from '@/components/common/AppHeader'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { SessionList } from './components/SessionList'

export function SessionsPage() {
  const { data: profile } = useUserProfile()
  return (
    <main className="min-h-screen bg-muted/20">
      <AppHeader streak={profile?.streak} />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <SessionList />
      </div>
    </main>
  )
}