// src/features/waitlist/components/LeaderboardPreview.tsx
import { Trophy } from 'lucide-react'
import { FadeIn } from '@/components/common/FadeIn'

interface Entry {
  rank: number
  name: string
  xp: number
  zone?: 'promotion' | 'demotion'
}

const ENTRIES: Entry[] = [
  { rank: 1, name: 'Alex M.', xp: 12450, zone: 'promotion' },
  { rank: 2, name: 'Sarah K.', xp: 11200, zone: 'promotion' },
  { rank: 3, name: 'Priya R.', xp: 9870 },
  { rank: 24, name: 'Jordan T.', xp: 2100, zone: 'demotion' },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function LeaderboardPreview() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <FadeIn className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Compete. Rank. Excel.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join a global community of learners. Earn XP, climb your league,
            and turn academic rigor into a friendly competitive sport.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="w-full flex-1 overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center justify-between bg-primary px-5 py-3 text-primary-foreground">
            <span className="text-sm font-semibold">Gold League</span>
            <Trophy size={16} />
          </div>

          <ul className="divide-y divide-border bg-muted/40">
            {ENTRIES.map((entry) => (
              <li
                key={entry.rank}
                className="relative flex items-center gap-3 py-3 pl-4 pr-5"
              >
                <span
                  className={`absolute inset-y-0 left-0 w-1 ${
                    entry.zone === 'promotion'
                      ? 'bg-success'
                      : entry.zone === 'demotion'
                        ? 'bg-destructive'
                        : 'bg-transparent'
                  }`}
                />
                <span className="w-5 text-sm text-muted-foreground">{entry.rank}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {initials(entry.name)}
                </span>
                <span className="flex-1 text-sm font-medium">{entry.name}</span>
                <span className="text-sm text-muted-foreground">
                  {entry.xp.toLocaleString()} XP
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between bg-muted/60 px-5 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" /> Promotion zone
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-destructive" /> Relegation zone
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}