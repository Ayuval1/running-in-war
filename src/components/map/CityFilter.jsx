import { useState, useEffect } from 'react'
import { SlidersHorizontal, Check } from 'lucide-react'
import { useCityName } from '../../context/CityNameContext'
import { getCityShelterCounts } from '../../hooks/useCityShelters'
import Drawer from '../ui/Drawer'

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
      <button
        onClick={() => setOpen(o => !o)}
        className="absolute top-24 right-3 z-[1000] flex items-center gap-2 px-4 rounded-full cursor-pointer active:scale-95 transition-transform"
        dir="rtl"
        style={{
          height: 44,
          background: 'rgba(11,25,47,0.92)',
          border: `1px solid ${hasActive ? 'rgba(59,158,255,0.65)' : 'rgba(59,158,255,0.25)'}`,
          boxShadow: hasActive
            ? '0 0 0 2px rgba(59,158,255,0.12), 0 0 20px rgba(59,158,255,0.3), 0 2px 12px rgba(0,0,0,0.5)'
            : '0 2px 12px rgba(0,0,0,0.5)',
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

      <Drawer open={open} onClose={() => setOpen(false)} title="הצג מקלטי עיר">
        <div className="flex flex-col gap-2" dir="rtl">
          {CITIES.map(city => {
            const isActive = activeCities.includes(city.id)
            const count = counts[city.id] ?? '…'
            return (
              <button
                key={city.id}
                onClick={() => onCityChange(city.id)}
                className="w-full flex items-center gap-3 px-4 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                style={{
                  minHeight: 52,
                  background: isActive ? 'rgba(59,158,255,0.1)' : 'rgba(15,32,53,0.5)',
                  border: `1px solid ${isActive ? 'rgba(59,158,255,0.3)' : 'rgba(26,48,80,0.6)'}`,
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
      </Drawer>
    </>
  )
}
