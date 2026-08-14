// src/features/waitlist/WaitlistPage.tsx
import { AmbientBackground } from '@/components/animations/AmbientBackground'
import { WaitlistForm } from './components/WaitlistForm'

export function WaitlistPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AmbientBackground
        horizonColor="#0b0b12"
        waveColor="#7c5cff"
        crestColor="#fbbf24"
        tilt={0.6}      // was 1.11 — steeper downward angle, less empty sky
        zoom={0.85}       // slightly narrower FOV, pulls the horizon line up
        height={7} 
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-6 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          Coming soon
        </span>

        <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
          Study your way, through what you already love
        </h1>

        <p className="mt-5 max-w-md text-balance text-base text-muted-foreground sm:text-lg">
          DESAMI turns your lecture notes into explanations built around your hobbies —
          gaming, sports, music, whatever clicks for you. Be first in when we launch.
        </p>

        <div className="mt-10">
          <WaitlistForm />
        </div>
      </div>
    </main>
  )
}