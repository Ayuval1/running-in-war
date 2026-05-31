import { useState } from 'react'
import LoginForm  from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'


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
      <img src="/logo/full/logo-dark.png" alt="RunningINWar" className="h-32 mb-2" />

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

    </div>
  )
}
