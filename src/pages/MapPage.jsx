import { useState, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Shield, MapPin, LocateFixed, Loader2, CheckCircle2, X, AlertTriangle, Search, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useShelters } from '../hooks/useShelters'
import { useLocation } from '../hooks/useLocation'
import { useAlerts } from '../hooks/useAlerts'
import { addShelter, updateShelter, deleteShelter, saveHomeLocation, getUserProfile } from '../firebase/firestore'
import { findNearestShelter } from '../lib/geo'
import { useAddressAutocomplete, buildAddressLabel } from '../hooks/useAddressAutocomplete'
import ShelterMarker       from '../components/map/ShelterMarker'
import UserMarker    from '../components/map/UserMarker'
import SOSButton     from '../components/sos/SOSButton'
import SOSOverlay    from '../components/sos/SOSOverlay'
import Drawer        from '../components/ui/Drawer'
import ShelterForm   from '../components/shelters/ShelterForm'
import BottomNav     from '../components/ui/BottomNav'
import { SHELTER_TYPES } from '../constants/shelterTypes'

const ISRAEL_CENTER = [31.5, 34.9]

function MapClickHandler({ onMapClick, active }) {
  useMapEvents({
    click(e) {
      if (active) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

/** Home-location drawer content with GPS + autocomplete */
function HomeLocationForm({ userId, currentPosition, onSaved, onClose }) {
  const [address, setAddress]       = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [savedLabel, setSavedLabel] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

  const { suggestions, loading: loadingSug } = useAddressAutocomplete(address, { enabled: !saved })

  async function pickSuggestion(item) {
    setAddress(item.display_name)
    setSaving(true)
    try {
      await saveHomeLocation(userId, parseFloat(item.lat), parseFloat(item.lon))
      setSavedLabel(buildAddressLabel(item, address))
      setSaved(true)
      setAddress('')
      onSaved({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) })
      setTimeout(onClose, 1200)
    } catch (err) { console.error('saveHomeLocation error:', err); alert('שגיאה בשמירה') }
    finally { setSaving(false) }
  }

  function handleGPS() {
    if (!currentPosition) { alert('ממתין ל-GPS, נסה שוב בעוד שנייה'); return }
    setGpsLoading(true)
    saveHomeLocation(userId, currentPosition.lat, currentPosition.lng)
      .then(async () => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${currentPosition.lat}&lon=${currentPosition.lng}&format=json`,
            { headers: { 'Accept-Language': 'he' } }
          )
          const data = await res.json()
          setSavedLabel((data.display_name || '').split(',').slice(0, 2).join(','))
        } catch {}
        setSaved(true)
        onSaved(currentPosition)
        setTimeout(onClose, 1200)
      })
      .catch((err) => { console.error('saveHomeLocation GPS error:', err); alert('שגיאה בשמירה') })
      .finally(() => setGpsLoading(false))
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-brand-neon" strokeWidth={2} />
        </div>
        <p className="font-black text-lg">נשמר!</p>
        {savedLabel && <p className="text-white/40 text-sm text-center max-w-xs">{savedLabel}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/40 text-sm leading-relaxed">
        מיקום הבית ישמש כנקודת התחלה במסלולי ריצה.
      </p>

      {/* GPS button */}
      <button
        onClick={handleGPS}
        disabled={gpsLoading || !currentPosition}
        className="w-full flex items-center justify-center gap-2 bg-brand-neon/10 border border-brand-neon/40 text-brand-neon font-bold py-3.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40 cursor-pointer"
      >
        {gpsLoading
          ? <><Loader2 size={16} strokeWidth={2} className="animate-spin" /> שומר...</>
          : <><LocateFixed size={16} strokeWidth={2} /> השתמש במיקום הנוכחי (GPS)</>
        }
      </button>
      {!currentPosition && (
        <p className="text-xs text-white/30 text-center -mt-2">GPS לא זמין כרגע</p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">או הקלד כתובת</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Address autocomplete */}
      <div className="relative">
        <div className="relative">
          <input
            value={address}
            onChange={e => { setAddress(e.target.value); setSaved(false) }}
            placeholder='לדוגמה: "הרצל 10, תל אביב"'
            className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-4 py-3 text-brand-text placeholder:text-white/20 focus:outline-none focus:border-brand-neon transition-colors"
            style={{ fontSize: 16 }}
            autoComplete="off"
          />
          {loadingSug && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Loader2 size={14} className="text-brand-neon animate-spin" strokeWidth={2} />
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 bg-brand-card border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto">
            {suggestions.map((item, i) => {
              const a = item.address || {}
              const line1 = [a.road, a.house_number].filter(Boolean).join(' ')
              const line2 = [a.city || a.town || a.village, a.state].filter(Boolean).join(', ')
              return (
                <button
                  key={i}
                  onClick={() => pickSuggestion(item)}
                  className="w-full text-right px-4 py-3 flex items-center gap-3 hover:bg-white/5 active:bg-white/10 border-b border-white/5 last:border-0 transition-colors cursor-pointer"
                >
                  <MapPin size={14} className="text-white/30 flex-shrink-0" strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-brand-text truncate">
                      {line1 || item.display_name.split(',')[0]}
                    </span>
                    <span className="block text-xs text-white/40 truncate">
                      {line2 || item.display_name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function PlacementModeSelector({ mode, onModeChange, onAddressSelect }) {
  const [query, setQuery] = useState('')
  const { suggestions, loading } = useAddressAutocomplete(query, { enabled: mode === 'address' })

  function pick(item) {
    const label = buildAddressLabel(item, query)
    onAddressSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), label })
  }

  return (
    <div className="absolute top-16 left-0 right-0 z-30 mx-4">
      <div
        className="rounded-2xl shadow-2xl overflow-visible"
        style={{ background: 'rgba(15,32,53,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
      >
        {/* Tab headers */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => onModeChange('pin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors cursor-pointer ${
              mode === 'pin'
                ? 'text-brand-neon border-b-2 border-brand-neon -mb-px'
                : 'text-white/40'
            }`}
          >
            <MapPin size={14} strokeWidth={2} />
            נעיצת סיכה
          </button>
          <button
            type="button"
            onClick={() => onModeChange('address')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors cursor-pointer ${
              mode === 'address'
                ? 'text-brand-neon border-b-2 border-brand-neon -mb-px'
                : 'text-white/40'
            }`}
          >
            <Search size={14} strokeWidth={2} />
            הקלדת כתובת
          </button>
        </div>

        {/* Tab content */}
        {mode === 'pin' ? (
          <p className="text-center text-sm text-brand-neon font-semibold px-4 py-3 flex items-center justify-center gap-2">
            <MapPin size={14} strokeWidth={2} />
            לחץ על המפה לסימון המקלט
          </p>
        ) : (
          <div className="p-3 relative">
            {/* Search input */}
            <div className="relative flex items-center">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="חפש כתובת בישראל..."
                className="w-full bg-[#070D18] border border-white/10 rounded-xl px-4 py-2.5 text-brand-text placeholder:text-white/25 focus:outline-none focus:border-brand-neon/50 transition-colors"
                style={{ fontSize: 15, paddingLeft: 36 }}
                autoFocus
                autoComplete="off"
              />
              <span className="absolute left-3 pointer-events-none text-white/30">
                {loading
                  ? <Loader2 size={14} strokeWidth={2} className="animate-spin text-brand-neon" />
                  : <Search size={14} strokeWidth={2} />
                }
              </span>
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div
                className="absolute right-3 left-3 z-50 mt-1 overflow-hidden"
                style={{
                  top: '100%',
                  background: '#0A1628',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                  maxHeight: 220,
                  overflowY: 'auto',
                }}
              >
                {suggestions.map((item, i) => {
                  const a = item.address || {}
                  const line1 = [a.house_number, a.road].filter(Boolean).join(' ') || item.display_name.split(',')[0]
                  const line2 = a.city || a.town || a.village || ''
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={e => { e.preventDefault(); pick(item) }}
                      onClick={() => pick(item)}
                      className="w-full text-right flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer"
                      style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    >
                      <MapPin size={12} strokeWidth={2} className="text-white/30 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-brand-text truncate">{line1}</span>
                        {line2 && <span className="block text-xs text-white/40 truncate">{line2}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {query.length >= 2 && !loading && suggestions.length === 0 && (
              <p className="text-center text-xs text-white/30 mt-2">לא נמצאו תוצאות</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ShelterListOverlay({ shelters, onEdit, onDelete, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dim backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      />

      {/* Card */}
      <div
        className="relative w-[92%] flex flex-col"
        style={{
          maxWidth: 420,
          maxHeight: '70vh',
          background: 'rgba(15,32,53,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,229,160,0.2)',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-[18px] py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-black text-[#E6F4F0]">🛡 המקלטים שלי</span>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(0,229,160,0.12)',
                border: '1px solid rgba(0,229,160,0.3)',
                color: '#00E5A0',
              }}
            >
              {shelters.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1" style={{ padding: '6px 0' }}>
          {shelters.length === 0 ? (
            <p className="text-center text-xs py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
              אין מקלטים עדיין — הוסף דרך כפתור + מקלט
            </p>
          ) : (
            shelters.map((shelter, i) => {
              const type = SHELTER_TYPES[shelter.type] || SHELTER_TYPES.building
              return (
                <div
                  key={shelter.id}
                  className="flex items-center gap-3 px-[18px] py-3"
                  style={{
                    borderBottom: i < shelters.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {/* Type badge */}
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                    style={{
                      background: `${type.color}18`,
                      border: `1px solid ${type.color}44`,
                      color: type.color,
                    }}
                  >
                    {type.icon} {type.label}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: '#E6F4F0' }}>
                      {shelter.name || type.label}
                    </p>
                    {shelter.address && (
                      <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {shelter.address}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onEdit(shelter)}
                      className="w-[30px] h-[30px] rounded-lg flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(59,158,255,0.1)',
                        border: '1px solid rgba(59,158,255,0.35)',
                        color: '#3B9EFF',
                      }}
                    >
                      <Pencil size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onDelete(shelter.id)}
                      className="w-[30px] h-[30px] rounded-lg flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(255,65,84,0.08)',
                        border: '1px solid rgba(255,65,84,0.35)',
                        color: '#FF4154',
                      }}
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  const { user }         = useAuth()
  const { shelters, offline } = useShelters()
  const { position, error: gpsError } = useLocation()
  const { activeAlert }  = useAlerts(null)

  const [pendingPin, setPendingPin]     = useState(null)
  const [placingPin, setPlacingPin]     = useState(false)
  const [editingShelter, setEditing]    = useState(null)
  const [formLoading, setFormLoading]   = useState(false)
  const [sosTarget, setSosTarget]       = useState(null)
  const [showSOS, setShowSOS]           = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [manualPosition, setManualPosition] = useState(null)
  const [showShelterList, setShowShelterList] = useState(false)

  // Placement mode for adding a new shelter
  const [addMode, setAddMode]           = useState('pin')   // 'pin' | 'address'
  const [pendingAddress, setPendingAddress] = useState('')

  useEffect(() => {
    if (!user) return
    getUserProfile(user.uid).then(profile => {
      if (profile?.homeLocation) {
        const { latitude, longitude } = profile.homeLocation
        setManualPosition({ lat: latitude, lng: longitude })
      }
    })
  }, [user])

  const handleMapClick = useCallback((latlng) => {
    setPendingPin(latlng)
    setPlacingPin(true)
  }, [])

  async function handleSaveNew(formData) {
    if (!user) return
    setFormLoading(true)
    try {
      const lat = formData.lat ?? pendingPin?.lat
      const lng = formData.lng ?? pendingPin?.lng
      if (!lat || !lng) { alert('לא נבחרה נקודה על המפה'); return }
      await addShelter(user.uid, user.displayName, { ...formData, lat, lng })
      setPendingPin(null)
      setPlacingPin(false)
    } finally { setFormLoading(false) }
  }

  async function handleSaveEdit(formData) {
    if (!editingShelter) return
    setFormLoading(true)
    try {
      await updateShelter(editingShelter.id, {
        name:  formData.name || null,
        type:  formData.type,
        notes: formData.notes || null,
      })
      setEditing(null)
    } finally { setFormLoading(false) }
  }

  async function handleDelete(shelterId) {
    if (!confirm('למחוק את המקלט הזה?')) return
    await deleteShelter(shelterId)
  }

  function handleSOS() {
    if (!activePosition) { alert('ממתין ל-GPS...'); return }
    const nearest = findNearestShelter(activePosition, shelters)
    if (!nearest) { alert('אין מקלטים שמורים. הוסף מקלטים קודם.'); return }
    setSosTarget(nearest)
    setShowSOS(true)
  }

  function handleAddressSelect({ lat, lng, label }) {
    setPendingPin({ lat, lng })
    setPendingAddress(label)
    setPlacingPin(false)
  }

  function resetPlacement() {
    setPendingPin(null)
    setPlacingPin(false)
    setPendingAddress('')
    setAddMode('pin')
  }

  const activePosition = position || manualPosition
  const center = activePosition ? [activePosition.lat, activePosition.lng] : ISRAEL_CENTER

  return (
    <div className="fixed inset-0 bg-brand-bg">
      {offline && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-600 text-white text-center text-sm py-1 flex items-center justify-center gap-2">
          <AlertTriangle size={14} strokeWidth={2} />
          מצב לא מקוון — מציג נתונים שמורים
        </div>
      )}
      {gpsError && !position && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-orange-700/90 text-white text-center text-xs py-1 flex items-center justify-center gap-2">
          <AlertTriangle size={12} strokeWidth={2} />
          GPS לא זמין — מציג מרכז ישראל
        </div>
      )}

      {/* Top bar */}
      <div
        className="absolute left-0 right-0 z-30 bg-brand-bg/90 backdrop-blur-sm px-4 pb-2 flex items-center justify-between border-b border-white/8"
        style={{ top: 0, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}
      >
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-brand-neon" strokeWidth={2.5} />
          <h1 className="text-lg font-black">ריצה בזמן מלחמה</h1>
        </div>

        {placingPin ? (
          <button
            onClick={resetPlacement}
            className="flex items-center gap-1.5 text-brand-red text-sm font-semibold cursor-pointer"
          >
            <X size={16} strokeWidth={2.5} />
            ביטול
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowLocation(true)}
              title="הגדר מיקום בית"
              className="flex items-center gap-1.5 bg-white/10 text-brand-text text-sm font-bold px-3 py-1.5 rounded-lg active:scale-95 hover:bg-white/15 transition-all cursor-pointer"
            >
              <LocateFixed size={14} strokeWidth={2} />
              <span className="hidden sm:inline">בית</span>
            </button>

            <button
              onClick={() => setPlacingPin(true)}
              className="flex items-center gap-1.5 bg-brand-neon text-brand-bg text-sm font-bold px-3 py-1.5 rounded-lg active:scale-95 hover:opacity-90 transition-all cursor-pointer"
            >
              <MapPin size={14} strokeWidth={2.5} />
              + מקלט
            </button>
          </div>
        )}
      </div>

      {/* Placement mode selector */}
      {placingPin && !pendingPin && (
        <PlacementModeSelector
          mode={addMode}
          onModeChange={setAddMode}
          onAddressSelect={handleAddressSelect}
        />
      )}

      {/* MAP */}
      <MapContainer
        center={center}
        zoom={15}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapClickHandler onMapClick={handleMapClick} active={placingPin} />
        <UserMarker position={activePosition} />
        {shelters.map(s => (
          <ShelterMarker
            key={s.id}
            shelter={s}
            onEdit={setEditing}
            onDelete={handleDelete}
            currentUserId={user?.uid}
          />
        ))}
      </MapContainer>

      {!placingPin && <SOSButton onClick={handleSOS} />}

      {showSOS && sosTarget && (
        <SOSOverlay
          shelter={sosTarget}
          userPosition={activePosition}
          onDismiss={() => { setShowSOS(false); setSosTarget(null) }}
        />
      )}

      {shelters.length > 0 && !placingPin && (
        <div className="absolute top-14 right-4 z-30 bg-brand-card border border-white/10 rounded-full px-3 py-1 text-xs text-white/40">
          <span>{shelters.length} מקלטים</span>
        </div>
      )}

      {/* Add shelter drawer */}
      <Drawer
        open={!!pendingPin}
        onClose={resetPlacement}
        title="הוספת מקלט"
      >
        <p className="text-xs text-white/40 mb-4 flex items-center gap-1.5">
          <MapPin size={12} strokeWidth={2} />
          מיקום: {pendingPin?.lat.toFixed(5)}, {pendingPin?.lng.toFixed(5)}
        </p>
        <ShelterForm
          initial={{ lat: pendingPin?.lat, lng: pendingPin?.lng, address: pendingAddress }}
          onSave={handleSaveNew}
          onCancel={resetPlacement}
          loading={formLoading}
        />
      </Drawer>

      {/* Edit shelter drawer */}
      <Drawer
        open={!!editingShelter}
        onClose={() => setEditing(null)}
        title="עריכת מקלט"
      >
        {editingShelter && (
          <ShelterForm
            initial={editingShelter}
            onSave={handleSaveEdit}
            onCancel={() => setEditing(null)}
            loading={formLoading}
          />
        )}
      </Drawer>

      {/* Home location drawer */}
      <Drawer
        open={showLocation}
        onClose={() => setShowLocation(false)}
        title="הגדרת מיקום בית"
      >
        {showLocation && (
          <HomeLocationForm
            userId={user?.uid}
            currentPosition={position}
            onSaved={setManualPosition}
            onClose={() => setShowLocation(false)}
          />
        )}
      </Drawer>

      {showShelterList && (
        <ShelterListOverlay
          shelters={shelters}
          onClose={() => setShowShelterList(false)}
          onEdit={(shelter) => {
            setShowShelterList(false)
            setEditing(shelter)
          }}
          onDelete={handleDelete}
        />
      )}

      <BottomNav />
    </div>
  )
}
