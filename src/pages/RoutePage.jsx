import { useState, useTransition } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Route, RotateCcw, MapPin, Shield, AlertTriangle, CheckCircle2, ChevronLeft, Loader2, X, Search } from 'lucide-react'
import { useAuth }     from '../context/AuthContext'
import { useShelters } from '../hooks/useShelters'
import { useLocation } from '../hooks/useLocation'
import { buildCircularRoute, buildPointToPointRoute, routeDistanceKm } from '../lib/routeAlgorithm'
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete'
import { exportToGPX } from '../lib/gpxExport'
import { calcSafetyScore } from '../lib/safetyScore'
import ShelterMarker  from '../components/map/ShelterMarker'
import UserMarker     from '../components/map/UserMarker'
import RoutePolyline  from '../components/map/RoutePolyline'
import SafetyScoreBar from '../components/route/SafetyScoreBar'
import BottomNav      from '../components/ui/BottomNav'

const ISRAEL_CENTER = [31.5, 34.9]

function MapClickHandler({ active, onPick }) {
  useMapEvents({
    click(e) {
      if (active) onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function RoutePage() {
  const { user }     = useAuth()
  const { shelters } = useShelters()
  const { position } = useLocation()

  const [mode, setMode]             = useState('circular')
  const [distanceKm, setDist]       = useState(3)
  const [endPoint, setEnd]          = useState(null)
  const [route, setRoute]           = useState(null)
  const [score, setScore]           = useState(null)
  const [settingEnd, setSettingEnd] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [endAddress, setEndAddress] = useState('')
  const { suggestions: endSuggestions, loading: loadingEndSug } =
    useAddressAutocomplete(endAddress, { enabled: !endPoint })

  function pickEndSuggestion(item) {
    const a = item.address || {}
    const label = [a.road, a.house_number, a.city || a.town || a.village]
      .filter(Boolean).join(' ') || item.display_name.split(',')[0]
    setEnd({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) })
    setEndAddress(label)
  }

  function clearEnd() {
    setEnd(null)
    setEndAddress('')
  }

  function buildRoute() {
    if (!position) { alert('ממתין ל-GPS...'); return }
    if (!shelters.length) { alert('אין מקלטים. הוסף מקלטים במפה קודם.'); return }
    if (mode === 'point2point' && !endPoint) { alert('בחר נקודת יעד על המפה'); return }

    startTransition(() => {
      const result = mode === 'circular'
        ? buildCircularRoute(position, shelters, distanceKm)
        : buildPointToPointRoute(position, endPoint, shelters)
      setRoute(result)
      setScore(calcSafetyScore(result.waypoints, shelters))
    })
  }

  const center  = position ? [position.lat, position.lng] : ISRAEL_CENTER
  const totalKm = route ? routeDistanceKm(route.waypoints) : null

  return (
    <div
      className="fixed inset-0 flex flex-col tactical-grid"
      style={{ background: 'linear-gradient(180deg, #070D18 0%, #0A1220 100%)' }}
    >
      {/* Top panel */}
      <div
        className="z-20 px-4 pb-3"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          background: 'rgba(7,13,24,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(26,48,80,0.8)',
        }}
      >
        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <Route size={18} strokeWidth={2.5} style={{ color: '#00E5A0' }} />
          <h1 className="text-base font-black" style={{ color: '#E6F4F0' }}>תכנון מסלול</h1>
        </div>

        {/* Mode selector */}
        <div
          className="flex rounded-xl p-1 mb-3"
          style={{ background: '#070D18' }}
        >
          <button
            onClick={() => { setMode('circular'); setRoute(null) }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={mode === 'circular'
              ? { background: '#00E5A0', color: '#070D18', boxShadow: '0 0 16px rgba(0,229,160,0.3)' }
              : { color: '#3D7070' }}
          >
            <RotateCcw size={14} strokeWidth={2} />
            ריצה מהבית
          </button>
          <button
            onClick={() => { setMode('point2point'); setRoute(null) }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={mode === 'point2point'
              ? { background: '#3B9EFF', color: '#070D18', boxShadow: '0 0 16px rgba(59,158,255,0.3)' }
              : { color: '#3D7070' }}
          >
            <ChevronLeft size={14} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
            א׳ → ב׳
          </button>
        </div>

        {/* Distance chips (circular) */}
        {mode === 'circular' && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs mono" style={{ color: '#3D7070' }}>מרחק:</span>
            {[2, 3, 5, 8].map(km => (
              <button
                key={km}
                onClick={() => setDist(km)}
                className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer mono"
                style={distanceKm === km
                  ? { background: 'rgba(0,229,160,0.15)', color: '#00E5A0', border: '1px solid rgba(0,229,160,0.4)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#3D7070', border: '1px solid rgba(26,48,80,0.8)' }}
              >
                {km}ק"מ
              </button>
            ))}
          </div>
        )}

        {/* End point — address autocomplete + map click (point2point) */}
        {mode === 'point2point' && (
          <div className="mb-3">
            {endPoint ? (
              /* Selected destination chip */
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.35)' }}
              >
                <CheckCircle2 size={15} strokeWidth={2} style={{ color: '#00E5A0', flexShrink: 0 }} />
                <span className="flex-1 text-sm truncate" style={{ color: '#00E5A0' }}>{endAddress || `${endPoint.lat.toFixed(4)}, ${endPoint.lng.toFixed(4)}`}</span>
                <button type="button" onClick={clearEnd} className="cursor-pointer" style={{ color: '#3D7070' }}>
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            ) : (
              /* Address input + map tap option */
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    value={endAddress}
                    onChange={e => setEndAddress(e.target.value)}
                    placeholder='כתובת יעד, לדוגמה: "דיזנגוף 1"'
                    className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none"
                    style={{
                      background: 'rgba(59,158,255,0.08)',
                      border: '1px solid rgba(59,158,255,0.35)',
                      color: '#E6F4F0',
                      fontSize: 14,
                      paddingLeft: 36,
                      caretColor: '#3B9EFF',
                    }}
                    autoComplete="off"
                  />
                  <span className="absolute left-3 pointer-events-none" style={{ color: '#3B9EFF' }}>
                    {loadingEndSug
                      ? <Loader2 size={14} strokeWidth={2} className="animate-spin" />
                      : <Search size={14} strokeWidth={2} />
                    }
                  </span>
                </div>

                {/* Suggestions */}
                {endSuggestions.length > 0 && (
                  <div
                    className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden"
                    style={{
                      background: '#0F2035',
                      border: '1px solid rgba(26,48,80,0.9)',
                      borderRadius: 12,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {endSuggestions.map((item, i) => {
                      const a = item.address || {}
                      const line1 = [a.road, a.house_number].filter(Boolean).join(' ') || item.display_name.split(',')[0]
                      const line2 = [a.city || a.town || a.village, a.state].filter(Boolean).join(', ')
                      return (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={e => { e.preventDefault(); pickEndSuggestion(item) }}
                          className="w-full text-right flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                          style={{ borderBottom: i < endSuggestions.length - 1 ? '1px solid rgba(26,48,80,0.5)' : 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <MapPin size={13} strokeWidth={2} style={{ color: '#3B9EFF', flexShrink: 0 }} />
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-bold truncate" style={{ color: '#E6F4F0' }}>{line1}</span>
                            <span className="block text-xs truncate" style={{ color: '#3D7070' }}>{line2}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Map tap option */}
                <button
                  onClick={() => setSettingEnd(true)}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  style={{ background: 'rgba(59,158,255,0.06)', border: '1px dashed rgba(59,158,255,0.3)', color: '#3B9EFF' }}
                >
                  <MapPin size={13} strokeWidth={2} />
                  או לחץ על המפה לבחירת יעד
                </button>
              </div>
            )}
          </div>
        )}

        {/* Build route button */}
        <button
          onClick={buildRoute}
          className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl cursor-pointer active:scale-95 transition-transform"
          style={{
            background: '#00E5A0',
            color: '#070D18',
            boxShadow: '0 0 20px rgba(0,229,160,0.25)',
          }}
        >
          <Route size={16} strokeWidth={2.5} />
          חשב מסלול
        </button>

        {/* Route result */}
        {route && score !== null && (
          <div
            className="mt-3 p-3 rounded-xl"
            style={{ background: 'rgba(15,32,53,0.9)', border: '1px solid rgba(26,48,80,0.8)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm mono" style={{ color: '#E6F4F0' }}>
                <span style={{ color: '#00E5A0' }}>{totalKm}</span> ק"מ
                <span style={{ color: '#3D7070' }}> · </span>
                <span style={{ color: '#00E5A0' }}>{route.sheltersCovered.length}</span> מקלטים
              </span>
              <Shield size={14} strokeWidth={2} style={{ color: '#00E5A0' }} />
            </div>
            <SafetyScoreBar score={score} />
            {score < 50 && (
              <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: '#FF4060' }}>
                <AlertTriangle size={12} strokeWidth={2} />
                מסלול מסוכן! הוסף יותר מקלטים באזור זה.
              </p>
            )}
            <button
              onClick={() => exportToGPX(route.waypoints)}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-transform"
              style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.3)', color: '#00E5A0' }}
            >
              <MapPin size={13} strokeWidth={2} />
              ייצוא ל-Garmin (.gpx)
            </button>
          </div>
        )}
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        {settingEnd && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-semibold pointer-events-none"
            style={{
              background: 'rgba(59,158,255,0.15)',
              border: '1px solid rgba(59,158,255,0.5)',
              color: '#3B9EFF',
            }}
          >
            לחץ על המפה לבחירת נקודת סיום
          </div>
        )}
        <MapContainer
          center={center}
          zoom={14}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler
            active={settingEnd}
            onPick={pos => { setEnd(pos); setEndAddress(`${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`); setSettingEnd(false) }}
          />
          <UserMarker position={position} />
          {shelters.map(s => (
            <ShelterMarker key={s.id} shelter={s} onEdit={() => {}} onDelete={() => {}} currentUserId={user?.uid} />
          ))}
          {route && <RoutePolyline waypoints={route.waypoints} />}
        </MapContainer>
      </div>

      <BottomNav />
    </div>
  )
}
