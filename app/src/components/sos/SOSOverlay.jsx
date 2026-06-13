import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Navigation, MapPin, CheckCircle2, RefreshCw } from 'lucide-react'
import { SHELTER_TYPES } from '../../constants/shelterTypes'
import { etaSeconds, bearing, haversineDistance } from '../../lib/geo'
import { useLocation } from '../../hooks/useLocation'

const ARROWS = ['↑','↗','→','↘','↓','↙','←','↖']

function bearingArrow(deg) {
  return ARROWS[Math.round(deg / 45) % 8]
}

export default function SOSOverlay({ shelter, onDismiss, onNextShelter }) {
  const [elapsed, setElapsed] = useState(0)
  const [address, setAddress] = useState(shelter.address || null)
  const wakeLockRef = useRef(null)
  const { position } = useLocation()

  // If the shelter has no saved address, reverse-geocode its coordinates
  useEffect(() => {
    if (shelter.address) { setAddress(shelter.address); return }
    const lat = shelter.location?.latitude  ?? shelter.location?.lat
    const lng = shelter.location?.longitude ?? shelter.location?.lng
    if (!lat || !lng) return

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'he' } }
    )
      .then(r => r.json())
      .then(data => {
        const a = data.address || {}
        const road = [a.house_number, a.road].filter(Boolean).join(' ')
        const city = a.city || a.town || a.village || ''
        setAddress([road, city].filter(Boolean).join(', ') || data.display_name?.split(',').slice(0, 2).join(', ') || null)
      })
      .catch(() => {})
  }, [shelter])

  useEffect(() => {
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])

    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen')
        .then(lock => { wakeLockRef.current = lock })
        .catch(() => {})
    }

    const t = setInterval(() => setElapsed(s => s + 1), 1000)

    return () => {
      clearInterval(t)
      wakeLockRef.current?.release()
    }
  }, [])

  if (!shelter) return null

  const type = SHELTER_TYPES[shelter.type] || SHELTER_TYPES.building
  const lat  = shelter.location?.latitude  ?? shelter.location?.lat
  const lng  = shelter.location?.longitude ?? shelter.location?.lng

  // Live calculations — update every render as position changes
  const livePos  = position
  const distMeters = livePos ? haversineDistance(livePos, { lat, lng }) : shelter.distanceMeters
  const dist     = (distMeters / 1000).toFixed(2)
  const eta      = etaSeconds(distMeters)
  const arrow    = livePos ? bearingArrow(bearing(livePos, { lat, lng })) : '↑'

  const wazeUrl  = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
  const gmapsUrl = `https://maps.google.com/?daddr=${lat},${lng}`

  return (
    <div
      className="fixed inset-0 z-[100] bg-brand-red flex flex-col items-center justify-center text-white text-center px-6"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Elapsed timer */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        <span className="bg-white/20 text-white/90 text-sm px-4 py-1.5 rounded-full font-medium tabular-nums">
          {elapsed} שניות
        </span>
      </div>

      {/* Alert icon with pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '1.2s' }} />
        <div className="relative w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
          <AlertTriangle size={48} strokeWidth={2} />
        </div>
      </div>

      <h1 className="text-3xl font-black mb-1 tracking-tight">אזעקה פעילה</h1>
      <p className="text-xl font-bold mb-1">{shelter.name || type.label}</p>
      {address && (
        <p className="text-white/70 text-sm mb-5 max-w-xs leading-relaxed">{address}</p>
      )}

      {/* Direction + distance + ETA — live */}
      <div className="flex items-center gap-6 my-4 bg-white/10 rounded-2xl px-6 py-4 w-full max-w-sm">
        <div className="flex flex-col items-center flex-1">
          <span className="text-5xl font-black leading-none">{arrow}</span>
          <span className="text-xs text-white/70 mt-2 font-medium">כיוון</span>
        </div>
        <div className="w-px h-12 bg-white/20" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl font-black tabular-nums">{dist}</span>
          <span className="text-xs text-white/70 mt-1 font-medium">ק"מ</span>
        </div>
        <div className="w-px h-12 bg-white/20" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl font-black tabular-nums">{eta}</span>
          <span className="text-xs text-white/70 mt-1 font-medium">שניות ריצה</span>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex gap-3 mb-4 w-full max-w-sm">
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer"
        >
          <Navigation size={16} strokeWidth={2} />
          Waze
        </a>
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer"
        >
          <MapPin size={16} strokeWidth={2} />
          Google Maps
        </a>
      </div>

      {/* Next shelter button */}
      {onNextShelter && (
        <button
          onClick={onNextShelter}
          className="flex items-center justify-center gap-2 bg-white/15 text-white font-bold text-sm px-6 py-3 rounded-xl w-full max-w-sm mb-3 active:scale-95 transition-transform cursor-pointer"
        >
          <RefreshCw size={16} strokeWidth={2} />
          המקלט סגור — מקלט אחר
        </button>
      )}

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="flex items-center justify-center gap-3 bg-white text-brand-red font-black text-xl px-12 py-5 rounded-2xl w-full max-w-sm active:scale-95 transition-transform shadow-xl cursor-pointer"
      >
        <CheckCircle2 size={24} strokeWidth={2.5} />
        הגעתי למקלט
      </button>
    </div>
  )
}
