import { useState, useEffect, useRef } from 'react'
import { SlidersHorizontal, Check } from 'lucide-react'
import { useCityName } from '../../context/CityNameContext'
import { getCityShelterCounts } from '../../hooks/useCityShelters'

const CITIES = [
  { id: 'kiryat_bialik', full: 'קרית ביאליק', short: "ק׳ ביאליק" },
  { id: 'kiryat_yam',     full: 'קרית ים',     short: "ק׳ ים"     },
  { id: 'kiryat_motzkin', full: 'קרית מוצקין', short: "ק׳ מוצקין" },
  { id: 'kiryat_haim',    full: 'קרית חיים',   short: "ק׳ חיים"   },
  { id: 'kiryat_ata',     full: 'קרית אתא',    short: "ק׳ אתא"    },
]

export default function CityFilter({ activeCities, onCityChange }) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState({})
  const { cityNameMode } = useCityName()
  const ref = useRef(null)

  const hasActive = activeCities.length > 0

  useEffect(() => {
    getCityShelterCounts().then(setCounts).catch(() => {})
  }, [])

  // Close panel on outside click
  useEffect(() => {
    if (!open) return
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open])

  return (
    <div ref={ref} className="absolute top-20 right-3 z-[1000]" dir="rtl">
      {/* Toggle pill button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 rounded-full cursor-pointer active:scale-95 transition-transform"
        style={{
          height: 44,
          background: hasActive ? 'rgba(59,158,255,0.15)' : 'rgba(11,25,47,0.92)',
          border: `1px solid ${hasActive ? 'rgba(59,158,255,0.55)' : 'rgba(59,158,255,0.25)'}`,
          boxShadow: hasActive
            ? '0 0 0 3px rgba(59,158,255,0.12), 0 0 24px rgba(59,158,255,0.35), 0 2px 12px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.5)',
          transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <SlidersHorizontal
          size={15}
          strokeWidth={2.2}
          color={hasActive ? '#3B9EFF' : '#3D7070'}
        />
        <span
          className="text-xs font-semibold"
          style={{ color: hasActive ? '#3B9EFF' : '#3D7070' }}
        >
          ערים
        </span>
        {hasActive && (
          <span
            className="flex items-center justify-center rounded-full text-[10px] font-bold tabular-nums"
            style={{
              background: '#3B9EFF',
              color: '#070D18',
              minWidth: 18,
              height: 18,
              padding: '0 5px',
            }}
          >
            {activeCities.length}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-[52px] right-0 w-48 rounded-2xl"
          style={{
            background: 'rgba(11,22,40,0.96)',
            border: '1px solid rgba(59,158,255,0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,158,255,0.06)',
            padding: '6px',
          }}
        >
          <div
            className="text-[10px] font-bold tracking-widest uppercase px-3 pt-2 pb-1.5"
            style={{ color: '#3D7070' }}
          >
            הצג מקלטי עיר
          </div>
          {CITIES.map(city => {
            const isActive = activeCities.includes(city.id)
            const count = counts[city.id] ?? '…'
            return (
              <button
                key={city.id}
                onClick={() => onCityChange(city.id)}
                className="w-full flex items-center gap-2.5 px-3 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                style={{
                  minHeight: 44,
                  background: isActive ? 'rgba(59,158,255,0.1)' : 'transparent',
                  borderRight: isActive ? '3px solid #3B9EFF' : '3px solid transparent',
                  transition: 'background 0.12s ease',
                }}
              >
                {/* Checkbox circle */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: isActive ? '#3B9EFF' : 'transparent',
                    border: `2px solid ${isActive ? '#3B9EFF' : 'rgba(59,158,255,0.3)'}`,
                    boxShadow: isActive ? '0 0 8px rgba(59,158,255,0.5)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isActive && (
                    <Check size={10} strokeWidth={3} color="#070D18" />
                  )}
                </div>
                {/* City name */}
                <span
                  className="flex-1 text-xs font-semibold text-right"
                  style={{ color: isActive ? '#E6F4F0' : '#3D7070' }}
                >
                  {cityNameMode === 'full' ? city.full : city.short}
                </span>
                {/* Count */}
                <span
                  className="text-xs tabular-nums"
                  style={{ color: isActive ? 'rgba(59,158,255,0.7)' : 'rgba(61,112,112,0.5)' }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
