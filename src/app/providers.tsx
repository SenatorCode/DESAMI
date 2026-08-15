import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { type ReactNode, useState } from 'react'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme'

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster richColors position="top-center" />
        <ThemeSync />
      </BrowserRouter>
    </QueryClientProvider>
  )
}