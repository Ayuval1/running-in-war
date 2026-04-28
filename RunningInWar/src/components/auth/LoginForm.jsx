import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logIn } from '../../firebase/auth'

export default function LoginForm({ onSwitch }) {
  const navigate                = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await logIn(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      const msgs = {
        'auth/user-not-found':  'המשתמש לא נמצא',
        'auth/wrong-password':  'סיסמה שגויה',
        'auth/invalid-email':   'כתובת אימייל לא תקינה',
        'auth/too-many-requests': 'יותר מדי ניסיונות. נסה שוב מאוחר יותר',
        'auth/invalid-credential': 'אימייל או סיסמה שגויים',
      }
      setError(msgs[err.code] || 'שגיאה: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-brand-dim">אימייל</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="bg-[#0A1628] border border-white/10 rounded-lg px-4 py-3 text-brand-text placeholder:text-white/20 focus:outline-none focus:border-brand-neon transition-colors"
          dir="ltr"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-brand-dim">סיסמה</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-[#0A1628] border border-white/10 rounded-lg px-4 py-3 text-brand-text placeholder:text-white/20 focus:outline-none focus:border-brand-neon transition-colors"
          dir="ltr"
        />
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-neon text-brand-bg font-bold py-3 rounded-xl text-lg mt-1 disabled:opacity-50 active:scale-95 transition-transform"
      >
        {loading ? 'מתחבר...' : 'כניסה'}
      </button>

      <p className="text-center text-brand-dim text-sm">
        עדיין אין חשבון?{' '}
        <button type="button" onClick={onSwitch} className="text-brand-neon font-semibold">
          הרשמה
        </button>
      </p>
    </form>
  )
}
