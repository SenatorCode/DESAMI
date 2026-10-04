import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoBlue from "@/assets/desamiBlue.png";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/auth";

export function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const accessToken = useAuthStore((s) => s.accessToken)
  const logout = useAuthStore((s) => s.logout)

  const scrollToForm = () => {
    document
      .getElementById("waitlist-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isWaitlistPage = pathname === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/">
          <img src={logoBlue} alt="Desami" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          {isWaitlistPage && (
            <button
              onClick={scrollToForm}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
            >
              Join Waitlist
            </button>
          )}

          {!isWaitlistPage && accessToken && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-foreground transition hover:text-primary"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Log out
              </button>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}