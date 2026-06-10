import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function showFatalError(message) {
  const el = document.createElement('div')
  el.className = 'fatal-error'
  el.textContent = message
  document.body.appendChild(el)
}

window.addEventListener('error', (event) => {
  showFatalError(event.message || 'Lỗi không xác định')
})

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  const message = reason instanceof Error ? reason.message : String(reason)
  showFatalError(message)
})

function loadVoices() {
  try {
    window.speechSynthesis?.getVoices()
  } catch {
    /* Safari có thể chưa sẵn sàng */
  }
}

function Root() {
  useEffect(() => {
    loadVoices()
    const synth = window.speechSynthesis
    if (!synth) return undefined
    synth.addEventListener('voiceschanged', loadVoices)
    return () => synth.removeEventListener('voiceschanged', loadVoices)
  }, [])

  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}

const rootEl = document.getElementById('root')
if (rootEl) {
  try {
    createRoot(rootEl).render(<Root />)
  } catch (error) {
    showFatalError(error instanceof Error ? error.message : String(error))
  }
}
