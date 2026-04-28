export default function Drawer({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative bg-brand-card rounded-t-2xl drawer-enter max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0">
            <h2 className="text-lg font-bold">{title}</h2>
            <button onClick={onClose} className="text-brand-dim text-2xl leading-none">×</button>
          </div>
        )}
        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto flex-1" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
