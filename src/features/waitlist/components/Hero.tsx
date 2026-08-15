import hero from "@/assets/hero.png";
import { AmbientBackground } from '@/components/animations/AmbientBackground'
import { WaitlistForm } from './WaitlistForm'

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
      <AmbientBackground />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 md:flex-row">
        <div className="flex-1 rounded-3xl bg-background/60 p-8 text-center backdrop-blur-md dark:bg-transparent dark:p-0 dark:backdrop-blur-none md:text-left">
          <span className="mb-6 inline-block rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            Coming soon
          </span>
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            The future of personalized learning is almost here
          </h1>
          <p className="mx-auto mt-5 max-w-md text-balance text-base text-muted-foreground sm:text-lg md:mx-0">
            Transform passive reading into active mastery. Join the waitlist and
            be first to experience Study, Quiz, and Clutch mode.
          </p>
          <div className="mt-10 flex justify-center md:justify-start">
            <WaitlistForm />
          </div>
        </div>

        <div className="relative flex-1">
          <img src={hero} alt="Hero illustration" />
        </div>
      </div>
    </section>
  )
}