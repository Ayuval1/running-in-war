import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertOctagon, MapPin, Route, Map, Building2, ChevronLeft, Trash2 } from 'lucide-react'
import { useShelters } from '../hooks/useShelters'
import { useLocation } from '../hooks/useLocation'
import { useAlerts } from '../hooks/useAlerts'
import { useAuth } from '../context/AuthContext'
import { findNearestShelter, haversineDistance, bearing, geoPointToLatLng, etaSeconds } from '../lib/geo'
import { SHELTER_TYPES } from '../constants/shelterTypes'
import { deleteShelter } from '../firebase/firestore'
import SOSOverlay from '../components/sos/SOSOverlay'
import BottomNav from '../components/ui/BottomNav'

const ARROWS = ['↑','↗','→','↘','↓','↙','←','↖']
function bearingArrow(deg) { return ARROWS[Math.round(deg / 45) % 8] }

/** GPS status dot with animated ping */
function GpsIndicator({ active }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-2.5 h-2.5 flex items-center justify-center">
        {active && (
          <span
            className="absolute inset-0 rounded-full gps-ping"
            style={{ background: 'rgba(0,229,160,0.4)' }}
          />
        )}
        <span
          className="relative w-2.5 h-2.5 rounded-full"
          style={{ background: active ? '#00E5A0' : '#3D7070' }}
        />
      </div>
      <span
        className="text-xs font-semibold tracking-wide mono"
        style={{ color: active ? '#00E5A0' : '#3D7070' }}
      >
        {active ? 'GPS ON' : 'GPS...'}
      </span>
    </div>
  )
}

/** Tactical shelter card */
function ShelterCard({ shelter, userPosition, onTap, onDelete, isOwner }) {
  const type = SHELTER_TYPES[shelter.type] || SHELTER_TYPES.building
  const loc  = geoPointToLatLng(shelter.location)
  const dist = userPosition && loc ? (haversineDistance(userPosition, loc) / 1000).toFixed(2) : null
  const eta  = dist ? etaSeconds(dist) : null
  const arr  = userPosition && loc ? bearingArrow(bearing(userPosition, loc)) : '↑'

  return (
    <div
      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-right"
      style={{
        background: 'linear-gradient(135deg, #0F2035 0%, #0C1929 100%)',
        border: '1px solid rgba(26,48,80,0.9)',
        borderRight: `3px solid ${type.color}`,
      }}
    >
      {/* Direction + distance (monospace, neon) */}
      {dist != null && (
        <div
          className="flex-shrink-0 w-14 flex flex-col items-center gap-0 mono"
          style={{ color: type.color }}
        >
          <span className="text-2xl font-bold leading-none">{arr}</span>
          <span className="text-sm font-bold tabular-nums">{dist}</span>
          <span className="text-[10px] opacity-60">ק"מ</span>
        </div>
      )}

      <button onClick={onTap} className="flex-1 min-w-0 text-right cursor-pointer active:opacity-80">
        <p className="font-bold text-sm truncate" style={{ color: '#E6F4F0' }}>
          {shelter.name || type.label}
        </p>
        {shelter.address && (
          <p className="text-xs truncate mt-0.5" style={{ color: '#3D7070' }}>{shelter.address}</p>
        )}
        {/* Type badge */}
        <span
          className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1"
          style={{ background: `${type.color}18`, color: type.color }}
        >
          {type.emoji} {type.label}
        </span>
      </button>

      {eta != null && (
        <div className="flex-shrink-0 text-left mono" style={{ color: '#3D7070' }}>
          <span className="text-base font-bold tabular-nums" style={{ color: '#E6F4F0' }}>{eta}</span>
          <span className="text-[10px] block">שנ'</span>
        </div>
      )}

      {isOwner && !shelter.isImported ? (
        <button
          onClick={onDelete}
          className="flex-shrink-0 p-1.5 rounded-lg cursor-pointer active:scale-90 transition-transform"
          style={{ color: '#FF4154', background: 'rgba(255,65,84,0.08)' }}
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
      ) : (
        <ChevronLeft size={14} className="flex-shrink-0 opacity-30" />
      )}
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user }        = useAuth()
  const { shelters }    = useShelters()
  const { position }    = useLocation()
  const { activeAlert } = useAlerts(null)
  const [sosTarget, setSosTarget] = useState(null)

  async function handleDelete(shelterId) {
    if (!confirm('למחוק את המקלט הזה?')) return
    await deleteShelter(shelterId)
  }

  const sorted = position
    ? [...shelters]
        .map(s => {
          const loc = geoPointToLatLng(s.location)
          return { ...s, distanceMeters: loc ? haversineDistance(position, loc) : Infinity }
        })
        .sort((a, b) => a.distanceMeters - b.distanceMeters)
        .slice(0, 3)
    : shelters.slice(0, 3)

  const nearest = sorted[0] || null

  function handleSOS() {
    if (!position) return
    const target = findNearestShelter(position, shelters)
    if (target) setSosTarget(target)
  }

  return (
    <div
      className="fixed inset-0 flex flex-col tactical-grid"
      style={{
        background: 'linear-gradient(180deg, #070D18 0%, #0A1220 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/* Alert banner */}
      {activeAlert && (
        <div
          className="flex items-center justify-center gap-2 font-black text-sm px-4 py-2.5 alert-pulse"
          style={{ background: '#FF1744', color: '#fff' }}
        >
          <AlertOctagon size={15} strokeWidth={2.5} />
          אזעקה פעילה — לך למקלט עכשיו!
        </div>
      )}

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(26,48,80,0.8)' }}
      >
        <div className="flex items-center gap-2">
          <Shield size={20} strokeWidth={2.5} style={{ color: '#00E5A0' }} />
          <span className="text-base font-black tracking-tight" style={{ color: '#E6F4F0' }}>
            ריצה בזמן מלחמה
          </span>
        </div>
        <GpsIndicator active={!!position} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 flex flex-col gap-4">

        {/* Readiness bar */}
        {(() => {
          const count = shelters.length
          const pct = count === 0 ? 0 : count === 1 ? 40 : count === 2 ? 70 : 100
          const label = count === 0 ? 'הוסף מקלטים כדי להתחיל' : count === 1 ? 'טוב להתחלה — הוסף עוד' : count === 2 ? 'כמעט מוכן!' : 'מוכן לחלוטין!'
          const color = pct < 40 ? '#FF4154' : pct < 80 ? '#FFB800' : '#00E5A0'
          return (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'linear-gradient(135deg, #0F2035, #0C1929)', border: '1px solid rgba(26,48,80,0.9)' }}
            >
              <div className="flex-shrink-0 text-2xl">{pct === 100 ? '✅' : pct >= 70 ? '🟡' : '🔴'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color }}>{label}</span>
                  <span className="text-xs font-black mono" style={{ color }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,48,80,0.8)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className="text-[10px] mt-0.5 block" style={{ color: '#3D7070' }}>
                  {count} {count === 1 ? 'מקלט' : 'מקלטים'} סומנו
                </span>
              </div>
            </div>
          )
        })()}

        {/* SOS Hero Button */}
        <button
          onClick={handleSOS}
          disabled={!position || shelters.length === 0}
          className="relative w-full rounded-2xl flex flex-col items-center justify-center py-6 cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-50 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1A0A10 0%, #200813 100%)',
            border: '1px solid rgba(255,23,68,0.25)',
            boxShadow: '0 0 0 1px rgba(255,23,68,0.1), 0 8px 40px rgba(255,23,68,0.15)',
            minHeight: 100,
          }}
        >
          {/* Background glow blob */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,23,68,0.12) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2.5">
              <AlertOctagon size={22} strokeWidth={2.5} style={{ color: '#FF1744' }} />
              <span className="text-xl font-black" style={{ color: '#FF1744' }}>
                SOS — מצא מקלט קרוב
              </span>
            </div>

            {nearest && position ? (
              <span className="text-sm mono" style={{ color: 'rgba(255,100,120,0.8)' }}>
                {nearest.name || SHELTER_TYPES[nearest.type]?.label}
                {'  ·  '}
                {(nearest.distanceMeters / 1000).toFixed(2)} ק"מ
              </span>
            ) : shelters.length === 0 ? (
              <span className="text-sm flex items-center gap-1.5" style={{ color: 'rgba(255,80,100,0.6)' }}>
                <Building2 size={13} strokeWidth={2} />
                הוסף מקלטים במפה קודם
              </span>
            ) : (
              <span className="text-sm mono shimmer" style={{ color: 'rgba(255,80,100,0.6)' }}>
                ממתין למיקום...
              </span>
            )}
          </div>
        </button>

        {/* Nearby shelters */}
        {sorted.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <span
                className="text-[10px] font-bold tracking-widest uppercase mono"
                style={{ color: '#3D7070' }}
              >
                מקלטים קרובים
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(26,48,80,0.7)' }} />
            </div>
            {sorted.map(s => (
              <ShelterCard
                key={s.id}
                shelter={s}
                userPosition={position}
                onTap={() => setSosTarget(s)}
                onDelete={() => handleDelete(s.id)}
                isOwner={s.ownerId === user?.uid}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(15,32,53,0.8)', border: '1px solid rgba(26,48,80,0.8)' }}
            >
              <Building2 size={30} strokeWidth={1.5} style={{ color: '#3D7070' }} />
            </div>
            <p className="font-bold text-base" style={{ color: '#E6F4F0' }}>אין מקלטים עדיין</p>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#3D7070' }}>
              לחץ על "מפה" וסמן את המקלטים הקרובים אליך
            </p>
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl mt-2 active:scale-95 transition-transform cursor-pointer"
              style={{
                background: '#00E5A0',
                color: '#070D18',
                boxShadow: '0 0 20px rgba(0,229,160,0.25)',
              }}
            >
              <Map size={17} strokeWidth={2} />
              פתח מפה
            </button>
          </div>
        )}

        {/* Secondary actions */}
        {sorted.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/map')}
              className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm active:scale-95 transition-all cursor-pointer"
              style={{
                background: 'rgba(15,32,53,0.8)',
                border: '1px solid rgba(26,48,80,0.9)',
                color: '#E6F4F0',
              }}
            >
              <Map size={15} strokeWidth={2} />
              מפה
            </button>
            <button
              onClick={() => navigate('/route')}
              className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm active:scale-95 transition-all cursor-pointer"
              style={{
                background: 'rgba(15,32,53,0.8)',
                border: '1px solid rgba(26,48,80,0.9)',
                color: '#E6F4F0',
              }}
            >
              <Route size={15} strokeWidth={2} />
              מסלול
            </button>
          </div>
        )}
      </div>

      {sosTarget && (
        <SOSOverlay
          shelter={sosTarget}
          onDismiss={() => setSosTarget(null)}
          onNextShelter={(() => {
            const idx = sorted.findIndex(s => s.id === sosTarget.id)
            const next = sorted[idx + 1]
            return next ? () => setSosTarget(next) : null
          })()}
        />
      )}

      <BottomNav />
    </div>
  )
}
