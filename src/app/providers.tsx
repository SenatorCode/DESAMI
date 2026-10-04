import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import { type ReactNode, useState, useEffect } from 'react'
import { useThemeStore } from '@/store/theme'

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // Don't hammer a flaky backend, and don't refetch just because the tab regained focus.
          queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
        },
      })
  )

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
          <Toaster richColors position="top-center" />
          <ThemeSync />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}