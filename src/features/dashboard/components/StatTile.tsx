// src/features/dashboard/components/StatTile.tsx
import type { ReactNode } from 'react'

interface StatTileProps {
  label: string
  value: string
  icon: ReactNode
  barPercent?: number
  barClassName?: string
}

export function StatTile({ label, value, icon, barPercent, barClassName }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      {typeof barPercent === 'number' && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${barClassName ?? 'bg-primary'}`}
            style={{ width: `${Math.min(100, Math.max(0, barPercent))}%` }}
          />
        </div>
      )}
    </div>
  )
}