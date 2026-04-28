export default function LoadingSpinner({ text = 'טוען...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{ height: '100dvh', minHeight: '-webkit-fill-available', background: '#070D18' }}
    >
      <div className="text-6xl animate-pulse">🛡️</div>
      <p className="text-brand-neon font-bold text-lg">ריצה בזמן מלחמה</p>
      <p className="text-white/40 text-sm">{text}</p>
    </div>
  )
}
