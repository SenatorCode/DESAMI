import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground transition hover:bg-muted"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}