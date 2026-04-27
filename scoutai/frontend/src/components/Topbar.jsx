import { motion } from 'framer-motion'

const STEPS = [
  { id: 'jd', label: 'JD Input', icon: '📋', step: 1 },
  { id: 'candidates', label: 'Discovery', icon: '🔍', step: 2 },
  { id: 'outreach', label: 'Outreach', icon: '💬', step: 3 },
  { id: 'shortlist', label: 'Shortlist', icon: '🏆', step: 4 },
]

export default function Topbar({ view, setView, progress }) {
  const isAccessible = (stepId) => {
    const order = ['jd', 'candidates', 'outreach', 'shortlist']
    return order.indexOf(stepId) <= progress
  }

  return (
    <header className="bg-navy-900/80 backdrop-blur-md border-b border-teal-500/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center">
            <span className="text-teal-400 text-sm font-bold">S</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Scout<span className="text-teal-400">AI</span>
          </span>
        </div>

        {/* Nav steps */}
        <nav className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const accessible = isAccessible(step.id)
            const active = view === step.id
            const done = progress > i

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => accessible && setView(step.id)}
                  disabled={!accessible}
                  className={`nav-pill ${
                    active
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                      : done
                      ? 'text-teal-400/70 hover:bg-teal-500/10 cursor-pointer'
                      : accessible
                      ? 'text-slate-400 hover:bg-white/5 cursor-pointer'
                      : 'text-slate-700 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                    ${active ? 'bg-teal-500 border-teal-500 text-navy-950 shadow-[0_0_10px_rgba(0,212,170,0.5)]'
                            : done ? 'bg-teal-500/30 border-teal-500/50 text-teal-400'
                            : 'border-slate-700 text-slate-600'}`}
                  >
                    {done && !active ? '✓' : step.step}
                  </span>
                  <span className="hidden sm:block text-sm">{step.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-px mx-1 ${done ? 'bg-teal-500/40' : 'bg-slate-800'}`} />
                )}
              </div>
            )
          })}
        </nav>

        {/* Badge */}
        <div className="text-xs text-slate-600 font-medium hidden md:block">
          Catalyst 2025
        </div>
      </div>
    </header>
  )
}
