// src/features/waitlist/components/TripleModeSection.tsx
import { BookOpen, ClipboardCheck, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { FadeIn } from '@/components/common/FadeIn'

interface Mode {
  phase: string
  title: string
  description: string
  icon: ReactNode
  colorClass: string       // bg color for the visual block
  fgClass: string          // icon/text color on that block
}

const modes: Mode[] = [
  {
    phase: 'Phase 01',
    title: 'Study Mode',
    description:
      'Deep dive into subjects with AI-driven hobby analogies and check-in questions. Build a real foundational understanding before testing yourself.',
    icon: <BookOpen size={40} />,
    colorClass: 'bg-primary',
    fgClass: 'text-primary-foreground',
  },
  {
    phase: 'Phase 02',
    title: 'Quiz Mode',
    description:
      'Formal academic assessment with targeted feedback. Identify weak spots and reinforce retention with spaced, exam-realistic questions.',
    icon: <ClipboardCheck size={40} />,
    colorClass: 'bg-accent',
    fgClass: 'text-accent-foreground',
  },
  {
    phase: 'Phase 03',
    title: 'Clutch Mode',
    description:
      'High-speed, high-density revision for the hours before an exam. Zero penalties, maximum focus — just the 20% that matters most.',
    icon: <Zap size={40} />,
    colorClass: 'bg-clutch',
    fgClass: 'text-clutch-foreground',
  },
]

export function TripleModeSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">The Triple-Mode Architecture</h2>
        <p className="mt-3 text-muted-foreground">
          A rigorous approach to knowledge acquisition, retention, and performance.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {modes.map((mode, i) => (
          <FadeIn key={mode.title} delay={i * 0.1}>
          <div
            key={mode.title}
            className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-muted/40 md:flex-row ${
              i % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex h-48 shrink-0 items-center justify-center md:h-auto md:w-72 ${mode.colorClass} ${mode.fgClass}`}
            >
              {mode.icon}
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 p-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {mode.phase}
              </span>
              <h3 className="text-2xl font-semibold">{mode.title}</h3>
              <p className="text-muted-foreground">{mode.description}</p>
            </div>
          </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}