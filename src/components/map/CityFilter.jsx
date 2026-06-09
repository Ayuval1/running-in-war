import { useState, useEffect } from 'react'
import { SlidersHorizontal, Check, X } from 'lucide-react'
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
  const hasActive = activeCities.length > 0

  useEffect(() => {
    getCityShelterCounts().then(setCounts).catch(() => {})
  }, [])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute right-3 z-[1000] flex items-center gap-2 px-4 rounded-full cursor-pointer active:scale-95 transition-transform"
        dir="rtl"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 120px)',
          height: 44,
          background: 'rgba(11,25,47,0.92)',
          border: `1px solid ${hasActive ? 'rgba(59,158,255,0.65)' : 'rgba(59,158,255,0.25)'}`,
          boxShadow: hasActive
            ? '0 0 0 2px rgba(59,158,255,0.12), 0 0 20px rgba(59,158,255,0.3), 0 2px 12px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <SlidersHorizontal size={15} strokeWidth={2.2} color={hasActive ? '#3B9EFF' : '#3D7070'} />
        <span className="text-xs font-semibold" style={{ color: hasActive ? '#3B9EFF' : '#3D7070' }}>
          ערים
        </span>
        {hasActive && (
          <span
            className="flex items-center justify-center rounded-full text-[10px] font-bold tabular-nums"
            style={{ background: '#3B9EFF', color: '#070D18', minWidth: 18, height: 18, padding: '0 5px' }}
          >
            {activeCities.length}
          </span>
        )}
      </button>

      {/* Centered overlay — same pattern as ShelterListOverlay */}
      {open && (
        <div
          className="fixed inset-0 z-[1001] flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          />
          <div
            className="relative w-[92%] flex flex-col"
            dir="rtl"
            style={{
              maxWidth: 380,
              background: 'rgba(15,32,53,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(59,158,255,0.2)',
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
                <SlidersHorizontal size={15} strokeWidth={2.2} color="#3B9EFF" />
                <span className="text-[15px] font-black" style={{ color: '#E6F4F0' }}>
                  מקלטי ערים
                </span>
                {hasActive && (
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(59,158,255,0.12)',
                      border: '1px solid rgba(59,158,255,0.3)',
                      color: '#3B9EFF',
                    }}
                  >
                    {activeCities.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* City list */}
            <div className="flex flex-col" style={{ padding: '6px 0' }}>
              {CITIES.map(city => {
                const isActive = activeCities.includes(city.id)
                const count = counts[city.id] ?? '…'
                return (
                  <button
                    key={city.id}
                    onClick={() => onCityChange(city.id)}
                    className="w-full flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                    style={{
                      minHeight: 52,
                      padding: '0 18px',
                      background: isActive ? 'rgba(59,158,255,0.08)' : 'transparent',
                      borderRight: isActive ? '3px solid #3B9EFF' : '3px solid transparent',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: isActive ? '#3B9EFF' : 'transparent',
                        border: `2px solid ${isActive ? '#3B9EFF' : 'rgba(59,158,255,0.3)'}`,
                        boxShadow: isActive ? '0 0 8px rgba(59,158,255,0.5)' : 'none',
                      }}
                    >
                      {isActive && <Check size={11} strokeWidth={3} color="#070D18" />}
                    </div>
                    <span
                      className="flex-1 text-sm font-semibold text-right"
                      style={{ color: isActive ? '#E6F4F0' : '#3D7070' }}
                    >
                      {cityNameMode === 'full' ? city.full : city.short}
                    </span>
                    <span
                      className="text-sm tabular-nums font-medium"
                      style={{ color: isActive ? 'rgba(59,158,255,0.7)' : 'rgba(61,112,112,0.5)' }}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
