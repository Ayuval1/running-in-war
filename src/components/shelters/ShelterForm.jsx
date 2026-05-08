import { useState } from 'react'
import { Building2, Building, Shield, Search, CheckCircle2, Loader2, MapPin, Save, X } from 'lucide-react'
import { SHELTER_TYPE_LIST } from '../../constants/shelterTypes'
import { useAddressAutocomplete, buildAddressLabel } from '../../hooks/useAddressAutocomplete'

const TYPE_ICONS = {
  building:  Building2,
  municipal: Building,
  safe_room: Shield,
}

export default function ShelterForm({ initial = {}, onSave, onCancel, loading }) {
  const [name,  setName]  = useState(initial.name  || '')
  const [type,  setType]  = useState(initial.type  || 'building')
  const [notes, setNotes] = useState(initial.notes || '')

  const [address,  setAddress]  = useState(initial.address || '')
  const [resolved, setResolved] = useState(null)   // { lat, lng, label }

  const isNew = !initial.lat
  const { suggestions, loading: loadingSug } =
    useAddressAutocomplete(address, { enabled: isNew && !resolved })

  function pickSuggestion(item) {
    const label = buildAddressLabel(item, address)
    setResolved({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), label })
    setAddress(label)
  }

  function clearResolved() {
    setResolved(null)
    setAddress('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (resolved) {
      onSave({ name, type, notes, address: resolved.label, lat: resolved.lat, lng: resolved.lng })
    } else {
      onSave({ name, type, notes, address })
    }
  }

  const inputStyle = {
    background: '#070D18',
    border: '1px solid rgba(26,48,80,0.9)',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 15,
    color: '#E6F4F0',
    width: '100%',
    outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Shelter type */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest mono mb-2 block" style={{ color: '#3D7070' }}>
          סוג מקלט
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SHELTER_TYPE_LIST.map(t => {
            const Icon = TYPE_ICONS[t.id] || Shield
            const active = type === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all cursor-pointer"
                style={{
                  background: active ? `${t.color}15` : 'rgba(15,32,53,0.6)',
                  border: `1.5px solid ${active ? t.color : 'rgba(26,48,80,0.8)'}`,
                  boxShadow: active ? `0 0 16px ${t.color}25` : 'none',
                }}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} style={{ color: active ? t.color : '#3D7070' }} />
                <span className="text-xs text-center leading-tight font-medium" style={{ color: active ? t.color : '#3D7070' }}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest mono mb-2 block" style={{ color: '#3D7070' }}>
          שם (אופציונלי)
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='לדוגמה: "מקלט ליד המכולת"'
          style={{ ...inputStyle, caretColor: '#00E5A0' }}
          className="focus:outline-none placeholder:text-white/20"
          onFocus={e => { e.target.style.borderColor = 'rgba(0,229,160,0.5)' }}
          onBlur={e  => { e.target.style.borderColor = 'rgba(26,48,80,0.9)' }}
        />
      </div>

      {/* Address autocomplete — only for new shelters */}
      {isNew && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest mono mb-2 block" style={{ color: '#3D7070' }}>
            כתובת המקלט
          </label>

          {resolved ? (
            /* Resolved address chip */
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.35)' }}
            >
              <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#00E5A0', flexShrink: 0 }} />
              <span className="flex-1 text-sm truncate" style={{ color: '#00E5A0' }}>{resolved.label}</span>
              <button
                type="button"
                onClick={clearResolved}
                className="cursor-pointer"
                style={{ color: '#3D7070' }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ) : (
            /* Autocomplete input */
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder='לדוגמה: "רוטשילד 1, תל אביב"'
                  style={{ ...inputStyle, paddingLeft: 40, caretColor: '#00E5A0' }}
                  className="focus:outline-none placeholder:text-white/20"
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,229,160,0.5)' }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(26,48,80,0.9)' }}
                  autoComplete="off"
                />
                <span className="absolute left-3 pointer-events-none" style={{ color: '#3D7070' }}>
                  {loadingSug
                    ? <Loader2 size={15} strokeWidth={2} className="animate-spin" />
                    : <Search size={15} strokeWidth={2} />
                  }
                </span>
              </div>

              {suggestions.length > 0 && (
                <div
                  className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden"
                  style={{
                    background: '#0F2035',
                    border: '1px solid rgba(26,48,80,0.9)',
                    borderRadius: 12,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                >
                  {suggestions.map((item, i) => {
                    const a = item.address || {}
                    const line1 = [a.road, a.house_number].filter(Boolean).join(' ')
                    const line2 = [a.city || a.town || a.village, a.state].filter(Boolean).join(', ')
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); pickSuggestion(item) }}
                        className="w-full text-right flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                        style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(26,48,80,0.5)' : 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <MapPin size={13} strokeWidth={2} style={{ color: '#3D7070', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-bold truncate" style={{ color: '#E6F4F0' }}>
                            {line1 || item.display_name.split(',')[0]}
                          </span>
                          <span className="block text-xs truncate" style={{ color: '#3D7070' }}>
                            {line2 || item.display_name}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: '#3D7070' }}>
            <MapPin size={11} strokeWidth={2} />
            הזן כתובת <strong style={{ color: '#3D7070' }}>או</strong> לחץ על המפה ישירות
          </p>
        </div>
      )}

      {/* Manual address input — when pin is already placed on map */}
      {!isNew && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest mono mb-2 block" style={{ color: '#3D7070' }}>
            כתובת (אופציונלי)
          </label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder='לדוגמה: "הרצל 10, תל אביב"'
            style={{ ...inputStyle, caretColor: '#00E5A0' }}
            className="focus:outline-none placeholder:text-white/20"
            onFocus={e => { e.target.style.borderColor = 'rgba(0,229,160,0.5)' }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(26,48,80,0.9)' }}
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest mono mb-2 block" style={{ color: '#3D7070' }}>
          הערות (אופציונלי)
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder='לדוגמה: "פתוח 24/7, נגיש לכיסאות גלגלים"'
          style={{ ...inputStyle, resize: 'none', caretColor: '#00E5A0' }}
          className="focus:outline-none placeholder:text-white/20"
          onFocus={e => { e.target.style.borderColor = 'rgba(0,229,160,0.5)' }}
          onBlur={e  => { e.target.style.borderColor = 'rgba(26,48,80,0.9)' }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
          style={{
            background: '#00E5A0',
            color: '#070D18',
            boxShadow: '0 0 20px rgba(0,229,160,0.2)',
          }}
        >
          {loading
            ? <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            : <Save size={16} strokeWidth={2.5} />
          }
          {loading ? 'שומר...' : 'שמור מקלט'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 rounded-xl font-medium cursor-pointer active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#3D7070', border: '1px solid rgba(26,48,80,0.8)' }}
        >
          ביטול
        </button>
      </div>
    </form>
  )
}
