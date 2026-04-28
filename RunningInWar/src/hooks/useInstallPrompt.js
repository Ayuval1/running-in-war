import { useState, useEffect } from 'react'

/**
 * Handles the PWA "Add to Home Screen" install prompt.
 * Returns canInstall=true when the browser offers installation (Android/Chrome).
 * iOS doesn't support beforeinstallprompt — handle separately in UI.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [canInstall, setCanInstall] = useState(false)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  useEffect(() => {
    if (isStandalone) return
    function handler(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isStandalone])

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setCanInstall(false)
      setDeferredPrompt(null)
    }
  }

  return { canInstall: canInstall && !isStandalone, install, isStandalone }
}
