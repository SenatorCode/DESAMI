import { useCallback, useEffect, useState } from 'react'

/** Seconds-remaining countdown. `start(n)` (re)starts it; returns 0 when finished. */
export function useCooldown(initialSeconds = 0) {
  const [endAt, setEndAt] = useState(() => Date.now() + initialSeconds * 1000)
  const [now, setNow] = useState(() => Date.now())

  const active = endAt > now
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [active])

  const start = useCallback((seconds: number) => {
    const t = Date.now()
    setNow(t)
    setEndAt(t + seconds * 1000)
  }, [])

  return { secondsLeft: Math.max(0, Math.ceil((endAt - now) / 1000)), start }
}