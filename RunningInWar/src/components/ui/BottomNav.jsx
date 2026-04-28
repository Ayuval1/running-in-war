import { NavLink } from 'react-router-dom'
import { Home, Map, Route, User } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'

export default function BottomNav() {
  const { t } = useLang()

  const items = [
    { to: '/',        Icon: Home,  labelKey: 'nav_home'    },
    { to: '/map',     Icon: Map,   labelKey: 'nav_map'     },
    { to: '/route',   Icon: Route, labelKey: 'nav_route'   },
    { to: '/profile', Icon: User,  labelKey: 'nav_profile' },
  ]

  return (
    <nav
      aria-label="ניווט ראשי"
      className="fixed bottom-0 left-0 right-0 z-50 flex safe-bottom"
      style={{
        background: 'rgba(7,13,24,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(26,48,80,0.8)',
      }}
    >
      {items.map(({ to, Icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex-1 relative flex flex-col items-center gap-1 py-3 cursor-pointer transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#00E5A0' : '#3D7070',
          })}
        >
          {({ isActive }) => (
            <>
              {/* Active indicator dot at top */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 rounded-b-full"
                  style={{ height: 2, background: '#00E5A0', boxShadow: '0 0 8px rgba(0,229,160,0.8)' }}
                />
              )}
              <span
                className="p-1.5 rounded-xl transition-all"
                style={{
                  background: isActive ? 'rgba(0,229,160,0.08)' : 'transparent',
                }}
              >
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{t(labelKey)}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
