import { AlertOctagon } from 'lucide-react'

export default function SOSButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="כפתור SOS — מצא מקלט קרוב"
      className="fixed bottom-24 right-4 z-40 w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-90 transition-transform select-none"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #FF4060, #FF1744)',
        boxShadow: '0 0 0 2px rgba(255,23,68,0.3), 0 0 40px rgba(255,23,68,0.4), 0 4px 16px rgba(0,0,0,0.6)',
      }}
    >
      {/* Radar rings */}
      <span className="radar-ring" style={{ borderColor: '#FF1744' }} />
      <span className="radar-ring radar-ring-2" style={{ borderColor: '#FF1744' }} />
      <span className="radar-ring radar-ring-3" style={{ borderColor: '#FF1744' }} />

      {/* Icon + label */}
      <AlertOctagon size={26} strokeWidth={2.5} className="text-white relative z-10" />
      <span className="text-[10px] font-bold tracking-widest text-white/90 relative z-10 font-mono">SOS</span>
    </button>
  )
}
