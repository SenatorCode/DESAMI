import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '@/features/auth/api'
import { useAuthStore } from '@/store/auth'

export function DashboardPage() {
  const logout = useAuthStore((s) => s.logout)
  const { data: user, isLoading } = useQuery({ queryKey: ['me'], queryFn: fetchMe })

  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">You're logged in 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          {isLoading ? 'Loading profile…' : user?.first_name ? `Welcome, ${user.first_name}.` : 'Profile unavailable'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-6 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Log out
        </button>
      </div>
    </main>
  )
}