import { Component, type ErrorInfo, type ReactNode } from 'react'

/** Catches render errors so one broken page shows a recovery screen instead of a blank app. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Designer Kid crashed while rendering:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div className="card stack" style={{ maxWidth: 460, textAlign: 'center' }} role="alert">
          <h1 style={{ fontSize: '1.6rem' }}>Something went wrong</h1>
          <p className="muted">This page hit an unexpected error. Your progress is safe in this browser.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload the page</button>
            <a className="btn" href={import.meta.env.BASE_URL}>Go to the homepage</a>
          </div>
        </div>
      </main>
    )
  }
}
