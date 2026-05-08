import { useState } from 'react'
import LoginForm  from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'

/** Animated tactical hexagon shield logo */
function TacticalLogo() {
  return (
    <div className="relative flex items-center justify-center mb-8" style={{ height: 96 }}>
      {/* Outer ring — slow rotate */}
      <div
        className="absolute w-24 h-24 rounded-full"
        style={{
          border: '1px solid rgba(0,229,160,0.2)',
          animation: 'spin 12s linear infinite',
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute w-20 h-20 rounded-full"
        style={{
          border: '1px dashed rgba(0,229,160,0.12)',
          animation: 'spin 8s linear infinite reverse',
        }}
      />
      {/* Core badge */}
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,229,160,0.15) 0%, rgba(0,229,160,0.05) 100%)',
          border: '1.5px solid rgba(0,229,160,0.4)',
          boxShadow: '0 0 30px rgba(0,229,160,0.15), inset 0 1px 0 rgba(0,229,160,0.2)',
        }}
      >
        {/* Shield SVG */}
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 2L3 6.5V15C3 21.6 7.8 27.7 14 30C20.2 27.7 25 21.6 25 15V6.5L14 2Z"
            fill="rgba(0,229,160,0.15)"
            stroke="#00E5A0"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 15.5L12.5 18.5L18.5 12.5"
            stroke="#00E5A0"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    <div
      className="flex flex-col items-center justify-center px-6 tactical-grid"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #070D18 0%, #0A1220 100%)',
      }}
    >
      {/* Logo */}
      <TacticalLogo />

      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-black tracking-tight"
          style={{ color: '#E6F4F0' }}
        >
          ריצה בזמן מלחמה
        </h1>
        <p
          className="text-sm mt-2 mono"
          style={{ color: '#3D7070', letterSpacing: '0.05em' }}
        >
          הרץ בביטחון · תמיד קרוב למקלט
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, #0F2035 0%, #0C1929 100%)',
          border: '1px solid rgba(26,48,80,0.9)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Tab switcher */}
        <div
          role="tablist"
          className="flex rounded-xl p-1 mb-6"
          style={{ background: '#070D18' }}
        >
          {[
            { key: 'login',  label: 'כניסה'  },
            { key: 'signup', label: 'הרשמה'  },
          ].map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className="flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
              style={
                mode === key
                  ? {
                      background: '#00E5A0',
                      color: '#070D18',
                      boxShadow: '0 0 16px rgba(0,229,160,0.3)',
                    }
                  : { color: '#3D7070' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'login'
          ? <LoginForm  onSwitch={() => setMode('signup')} />
          : <SignupForm onSwitch={() => setMode('login')}  />
        }
      </div>

      <p
        className="mt-6 text-xs mono text-center"
        style={{ color: 'rgba(61,112,112,0.6)', letterSpacing: '0.04em' }}
      >
        אפליקציה ישראלית · פרטיות ואבטחה
      </p>

      {/* CSS for spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
