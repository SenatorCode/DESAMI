import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Flame, Home, Layers, LogOut } from 'lucide-react'
import logoBlue from '@/assets/desamiBlue.png'
import { useAuthStore } from '@/store/auth'
import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { useLogout } from '@/features/auth/useLogout'
import { ThemeToggle } from './ThemeToggle'

// Only routes that exist. Leaderboard (endpoints 15/16) and Resources get added
// here when their pages are built — dead links previously led to a blank screen.
const NAV_LINKS = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Sessions', to: '/sessions', icon: Layers },
]

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const { data: profile } = useUserProfile()
  const logout = useLogout()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const first = user?.first_name ?? profile?.first_name ?? ''
  const last = user?.last_name ?? profile?.last_name ?? ''
  const initials = `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
  const streak = profile?.streak

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link to="/dashboard" aria-label="Desami home">
            <img src={logoBlue} alt="Desami" className="h-6 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
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

          <div className="ml-auto flex items-center gap-3">
            {typeof streak === 'number' && (
              <span
                className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm font-medium text-clutch"
                title="Current streak"
              >
                <Flame size={14} className="fill-clutch" /> {streak}D
              </span>
            )}
            <ThemeToggle />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              >
                {initials || '—'}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-11 w-44 rounded-xl border border-border bg-background p-1.5 shadow-lg"
                >
                  {(first || profile?.email) && (
                    <div className="border-b border-border px-3 pb-2 pt-1.5">
                      <p className="truncate text-sm font-medium">{`${first} ${last}`.trim()}</p>
                      <p className="truncate text-xs text-muted-foreground">{profile?.email ?? user?.email}</p>
                    </div>
                  )}
                  <button
                    role="menuitem"
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-first: primary nav lives at the thumb on small screens */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        {NAV_LINKS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}