// src/features/waitlist/WaitlistPage.tsx
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { Hero } from './components/Hero'
import { TripleModeSection } from './components/TripleModeSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { HobbyPivotDemo } from './components/HobbyPivotDemo'
import { LeaderboardPreview } from './components/LeaderboardPreview'

export function WaitlistPage() {
  return (
    <main className="relative min-h-screen text-foreground">
      <Header />
      <Hero />
      <TripleModeSection />
      <HowItWorksSection />
      <HobbyPivotDemo />
      <LeaderboardPreview />
      <Footer />
    </main>
  )
}