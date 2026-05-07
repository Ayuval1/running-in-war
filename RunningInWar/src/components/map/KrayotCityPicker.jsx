import { X, Loader2 } from 'lucide-react'
import { KRAYOT_CITIES } from '../../lib/krayotShelters'

export default function KrayotCityPicker({ selectedCity, onSelect, loading, error, onClose }) {
  return (
    <div
      className="absolute z-30 bg-brand-card border border-white/10 rounded-2xl p-4 shadow-xl"
      style={{ top: 64, right: 16, left: 16 }}
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-white/80">🏛️ מקלטים ציבוריים — קריות</span>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {KRAYOT_CITIES.map(city => {
          const isSelected = selectedCity === city.name
          return (
            <button
              key={city.name}
              onClick={() => onSelect(isSelected ? null : city.name)}
              disabled={loading}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                isSelected
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {loading && isSelected
                ? <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                : null
              }
              {city.name}
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-400 text-center">{error}</p>
      )}

      {!error && (
        <p className="mt-3 text-xs text-white/25 text-center">
          נתונים מ-OpenStreetMap · לחץ שוב על עיר להסתרה
        </p>
      )}
    </div>
  )
}
