import { motion } from 'framer-motion'

export function ScoreBar({ value, color = 'teal', className = '' }) {
  const colorMap = {
    teal: 'from-teal-500 to-teal-400',
    blue: 'from-blue-500 to-blue-400',
    amber: 'from-amber-500 to-amber-400',
    purple: 'from-purple-500 to-purple-400',
  }
  return (
    <div className={`h-1.5 bg-white/8 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}

export function Avatar({ initials, color = '#00d4aa', size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-14 h-14 text-base' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: `${color}22`, color }}
    >
      {initials}
    </div>
  )
}

export function SkillChip({ skill, variant = 'teal' }) {
  return (
    <span className={`skill-chip chip-${variant} text-xs`}>{skill}</span>
  )
}

export function AvailabilityBadge({ availability }) {
  const map = {
    immediate: { label: 'Immediate', cls: 'chip-teal' },
    '1 month': { label: '1 Month', cls: 'chip-amber' },
    '2 months': { label: '2 Months', cls: 'chip-amber' },
    '3 months': { label: '3 Months', cls: 'chip-red' },
  }
  const config = map[availability] || { label: availability, cls: 'chip-blue' }
  return <span className={`skill-chip ${config.cls} text-xs`}>{config.label}</span>
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-navy-700 rounded-xl animate-pulse ${className}`}
      style={{
        background: 'linear-gradient(90deg, #162447 25%, #1d3461 50%, #162447 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

export function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 bg-teal-500/15 rounded-xl flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-teal-500"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
