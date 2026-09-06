import { Link } from 'react-router-dom'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { SignupForm } from './components/SignupForm'
import { GoogleAuthButton } from './components/GoogleAuthButton'

export function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-2xl font-semibold">Create your account</h1>
          <p className="mb-8 text-sm text-muted-foreground">Start learning your way.</p>
          <SignupForm />
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleAuthButton />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}