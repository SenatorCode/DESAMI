import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Flame, Bell, Search, LogOut } from 'lucide-react'
import logoBlue from '@/assets/desamiBlue.png'
import { useAuthStore } from '@/store/auth'

const NAV_LINKS = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Sessions', to: '/sessions' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Resources', to: '/resources' },
]

interface AppHeaderProps {
  streak?: number
}

export function AppHeader({ streak }: AppHeaderProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = user
    ? `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
    : ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <img src={logoBlue} alt="Desami" className="h-6 w-auto" />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards, notes, topics…"
            className="h-9 w-full rounded-lg border border-border bg-muted px-9 text-sm outline-none ring-primary/50 focus:ring-2"
          />
        </div>

        <div className="flex items-center gap-3">
          {typeof streak === 'number' && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm font-medium text-clutch">
              <Flame size={14} className="fill-clutch" /> {streak}D
            </span>
          )}
          <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted">
            <Bell size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Account menu"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              {initials || '—'}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 w-36 rounded-xl border border-border bg-background p-1.5 shadow-lg">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}