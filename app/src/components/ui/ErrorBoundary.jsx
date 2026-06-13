import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Failed to fetch')

    if (isChunkError) {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ height: '100dvh', background: '#070D18', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}
        >
          <div style={{ fontSize: 48 }}>⚠️</div>
          <p style={{ color: '#E6F4F0', fontFamily: 'Rubik, sans-serif', fontWeight: 700 }}>משהו השתבש</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#00E5A0', color: '#070D18', border: 'none', borderRadius: 12, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Rubik, sans-serif' }}
          >
            רענן
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
