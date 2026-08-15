// src/features/waitlist/components/HobbyPivotDemo.tsx
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Shuffle } from 'lucide-react'
import { FadeIn } from '@/components/common/FadeIn'

interface Pivot {
  concept: string
  hobbyLabel: string
  result: string
}

const PIVOTS: Pivot[] = [
  { concept: 'Cellular Respiration', hobbyLabel: 'Gaming', result: 'Power Plant Management' },
  { concept: 'Supply and Demand', hobbyLabel: 'Football', result: 'Transfer Market Bidding Wars' },
  { concept: 'Newton\u2019s Third Law', hobbyLabel: 'Music', result: 'Kick Drum Recoil on a Stage Riser' },
]

export function HobbyPivotDemo() {
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const pivot = PIVOTS[index]

  const next = () => setIndex((i) => (i + 1) % PIVOTS.length)

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <FadeIn className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Speak your language: the Hobby Pivot
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stuck on a rigid academic definition? One tap re-explains it through
            whatever you already understand — gaming, sports, music, and more.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="w-full flex-1">
          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Academic concept
            </span>
            <div className="mt-2 rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground">
              {pivot.concept}
            </div>

            <div className="my-4 flex justify-center">
              <button
                onClick={next}
                aria-label="Try another example"
                className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground transition hover:opacity-90 active:scale-95"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={reducedMotion ? 'static' : index}
                initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-xl bg-primary px-4 py-4 text-primary-foreground"
              >
                <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                  Hobby pivot &middot; {pivot.hobbyLabel}
                </span>
                <p className="mt-1 text-lg font-semibold">{pivot.result}</p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={next}
              className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <Shuffle size={14} />
              Try another
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}