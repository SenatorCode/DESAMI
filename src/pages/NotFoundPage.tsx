import { Link } from 'react-router-dom'
import { Header } from '@/components/common/Header'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="max-w-sm text-muted-foreground">
          That page doesn&apos;t exist or has moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </main>
    </div>
  )
}