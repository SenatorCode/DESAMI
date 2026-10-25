import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

/** Shared shell for every signed-in page that wants the header + mobile tab bar. */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20 md:pb-0">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}