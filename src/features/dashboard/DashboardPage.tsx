// src/features/dashboard/DashboardPage.tsx
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '@/features/auth/api'
import { useAuthStore } from '@/store/auth'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const { data } = useQuery({ queryKey: ['me'], queryFn: fetchMe })

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">You&apos;re logged in 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          {user?.first_name ? `Welcome, ${user.first_name}.` : 'Loading profile…'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
      </div>
    </main>
  )
}