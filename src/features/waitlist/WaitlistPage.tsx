// src/features/waitlist/WaitlistPage.tsx
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { Hero } from './components/Hero'
import { TripleModeSection } from './components/TripleModeSection'
import { HobbyPivotDemo } from './components/HobbyPivotDemo'
import { LeaderboardPreview } from './components/LeaderboardPreview'

export function WaitlistPage() {
  return (
    <main className="relative min-h-screen text-foreground">
      <Header />
      <Hero />
      <TripleModeSection />
      <HobbyPivotDemo />
      <LeaderboardPreview />
      <Footer />
    </main>
  )
}