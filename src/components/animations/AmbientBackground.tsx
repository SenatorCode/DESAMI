// src/components/animations/AmbientBackground.tsx
import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimationErrorBoundary } from './AnimationErrorBoundary'
import type { GradientWavesProps } from './GradientWaves'

const GradientWaves = lazy(() => import('./GradientWaves'))

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])
  return reduced
}

function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setIsMobile(mql.matches)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [breakpoint])
  return isMobile
}

const STATIC_FALLBACK = (
  <div className="absolute inset-0 bg-linear-to-b from-background via-background to-black" />
)

export function AmbientBackground(props: Partial<GradientWavesProps>) {
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const [canRenderGL] = useState(supportsWebGL2) // checked once, synchronously, before mount

  if (reducedMotion || !canRenderGL) return STATIC_FALLBACK

  const config: Partial<GradientWavesProps> = {
    detail: isMobile ? 'low' : 'medium',
    speed: 0.35,
    grain: true,
    grainIntensity: 0.04,
    mouseInteraction: !isMobile,
    ...props,
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimationErrorBoundary fallback={STATIC_FALLBACK}>
        <Suspense fallback={STATIC_FALLBACK}>
          <GradientWaves {...config} />
        </Suspense>
      </AnimationErrorBoundary>
    </div>
  )
}