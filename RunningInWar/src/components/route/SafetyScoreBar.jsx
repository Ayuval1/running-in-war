import { scoreLabel } from '../../lib/safetyScore'

export default function SafetyScoreBar({ score }) {
  const { label, color } = scoreLabel(score)
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-brand-dim">ציון בטיחות</span>
        <span className="text-sm font-bold" style={{ color }}>{score}% — {label}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  )
}
