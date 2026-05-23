import { useState, useEffect } from 'react'
import { useCityName } from '../../context/CityNameContext'
import { getCityShelterCounts } from '../../hooks/useCityShelters'

const CITIES = [
  { id: 'kiryat_bialik', full: 'קרית ביאליק', short: "ק׳ ביאליק" },
  { id: 'kiryat_yam',     full: 'קרית ים',     short: "ק׳ ים"     },
  { id: 'kiryat_motzkin', full: 'קרית מוצקין', short: "ק׳ מוצקין" },
  { id: 'kiryat_haim',    full: 'קרית חיים',   short: "ק׳ חיים"   },
  { id: 'kiryat_ata',     full: 'קרית אתא',    short: "ק׳ אתא"    },
]

export default function CityFilter({ activeCity, onCityChange }) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState({})
  const { cityNameMode } = useCityName()
  const highlighted = open || !!activeCity

  useEffect(() => {
    getCityShelterCounts().then(setCounts).catch(() => {})
  }, [])

  return (
    <div className="absolute top-20 right-3 z-[1000]" dir="rtl">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: highlighted ? 'rgba(59,158,255,0.15)' : 'rgba(11,25,47,0.92)',
          border: `1px solid ${highlighted ? 'rgba(59,158,255,0.5)' : 'rgba(59,158,255,0.25)'}`,
          boxShadow: highlighted
            ? '0 0 0 3px rgba(59,158,255,0.12), 0 0 20px rgba(59,158,255,0.25)'
            : '0 2px 12px rgba(0,0,0,0.5)',
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={highlighted ? '#3B9EFF' : '#6A9CC0'} strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 6h18M6 12h12M9 18h6"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-12 right-0 w-44 rounded-2xl"
          style={{
            background: 'rgba(11,22,40,0.96)',
            border: '1px solid rgba(59,158,255,0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,158,255,0.06)',
            padding: '6px',
          }}
        >
          {CITIES.map(city => {
            const isActive = activeCity === city.id
            const count = counts[city.id] ?? '…'
            return (
              <button
                key={city.id}
                onClick={() => { onCityChange(isActive ? null : city.id); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer"
                style={{
                  background: isActive ? 'rgba(59,158,255,0.1)' : 'transparent',
                  transition: 'background 0.12s ease',
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{
                    background: isActive ? '#3B9EFF' : 'transparent',
                    border: `2px solid ${isActive ? '#3B9EFF' : 'rgba(59,158,255,0.3)'}`,
                    boxShadow: isActive
                      ? '0 0 0 3px rgba(59,158,255,0.2), 0 0 12px rgba(59,158,255,0.5)'
                      : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
                <span
                  className="flex-1 text-xs font-semibold text-right"
                  style={{ color: isActive ? '#3B9EFF' : '#7AA8C8' }}
                >
                  {cityNameMode === 'full' ? city.full : city.short}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: isActive ? 'rgba(59,158,255,0.6)' : 'rgba(122,168,200,0.35)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
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
