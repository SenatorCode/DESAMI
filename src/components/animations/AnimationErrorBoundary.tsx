// src/components/animations/AnimationErrorBoundary.tsx
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: ReactNode
}
interface State {
  hasError: boolean
}

export class AnimationErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[AmbientBackground] render error:', error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}