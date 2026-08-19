// src/features/waitlist/components/HowItWorksSection.tsx
import { Upload, LayoutGrid, BookOpen, CheckCircle2, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { FadeIn } from '@/components/common/FadeIn'

interface Step {
  number: string
  title: string
  description: string
  icon: ReactNode
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Upload your notes',
    description: 'Drop in lecture slides, PDFs, or even photos of handwritten notes.',
    icon: <Upload size={22} />,
  },
  {
    number: '02',
    title: 'AI structures it',
    description: 'DESAMI splits your material into clear, digestible study modules automatically.',
    icon: <LayoutGrid size={22} />,
  },
  {
    number: '03',
    title: 'Study your way',
    description: 'Work through each module with hobby-based analogies tailored to you.',
    icon: <BookOpen size={22} />,
  },
  {
    number: '04',
    title: 'Test your knowledge',
    description: 'Quick check-in questions after every module confirm it actually stuck.',
    icon: <CheckCircle2 size={22} />,
  },
  {
    number: '05',
    title: 'Earn XP',
    description: 'Every module you complete builds your streak and climbs your league.',
    icon: <Sparkles size={22} />,
  },
]

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          5 Steps to Personalized Learning
        </h2>
        <p className="mt-3 text-muted-foreground">
          From raw notes to real understanding, in one guided flow.
        </p>
      </FadeIn>

      <div className="relative flex flex-col gap-8 md:flex-row md:gap-4">
        {/* connecting line — desktop only, sits behind the numbered dots */}
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />

        {STEPS.map((step, i) => (
          <FadeIn key={step.number} delay={i * 0.08} className="relative flex-1">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
                {step.icon}
              </div>
              <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step {step.number}
              </span>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}