// src/components/animations/AmbientBackground.tsx
import { useEffect, useState } from 'react'
import { AnimationErrorBoundary } from './AnimationErrorBoundary'
import ShapeGrid from './ShapeGrid'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])
  return reduced
}

function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [breakpoint])
  return isMobile
}

const STATIC_FALLBACK = (
  <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-black" />
)

export function AmbientBackground() {
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  if (reducedMotion) return STATIC_FALLBACK

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <AnimationErrorBoundary fallback={STATIC_FALLBACK}>
        <ShapeGrid
          direction="diagonal"
          speed={0.3}
          shape="square"
          squareSize={isMobile ? 56 : 40}
          borderColor="#262338"
          hoverFillColor="#4f46e5"
          hoverTrailAmount={isMobile ? 0 : 4}
        />
      </AnimationErrorBoundary>
    </div>
  )
}