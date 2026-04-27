import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../utils/api'
import {
  SectionHeading,
  ScoreBar,
  Avatar,
  SkillChip,
  AvailabilityBadge,
  Skeleton,
  EmptyState
} from '../components/UI'

export default function CandidatesPage({ onNext, jdText, candidates, setCandidates }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedReasons, setExpandedReasons] = useState({})

  // ✅ FIX: Add jdText dependency
  useEffect(() => {
    if (!candidates.length && jdText) {
      fetchCandidates()
    }
  }, [jdText]) // ✅ important fix

  const fetchCandidates = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await api.matchCandidates(jdText)

      // ✅ safe handling
      const data = res?.data || []
      setCandidates(data)
    } catch (e) {
      console.error("Candidate fetch error:", e)
      setError("Failed to fetch candidates. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleReasons = (id) => {
    setExpandedReasons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // ❌ No JD
  if (!jdText) {
    return (
      <EmptyState
        icon="🔍"
        title="No JD analyzed yet"
        description="Please go back and analyze a job description first"
      />
    )
  }

  // ⏳ Loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <SectionHeading icon="🔍" title="Discovering Candidates" subtitle="Scoring profiles..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      </div>
    )
  }

  // ❌ Error
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Discovery Failed"
        description={error}
        action={
          <button className="btn-primary" onClick={fetchCandidates}>
            Retry Discovery
          </button>
        }
      />
    )
  }

  // 📭 No candidates
  if (!candidates.length) {
    return (
      <EmptyState
        icon="🔍"
        title="No candidates loaded"
        description="Click below to discover matching candidates"
        action={
          <button className="btn-primary" onClick={fetchCandidates}>
            🔍 Discover Candidates
          </button>
        }
      />
    )
  }

  // 📊 Calculations (safe)
  const avgScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce((acc, c) => acc + (c.match_score || 0), 0) /
            candidates.length
        )
      : 0

  const immediateCount = candidates.filter(
    (c) => c.availability === 'immediate'
  ).length

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <SectionHeading
        icon="🔍"
        title="Candidate Discovery"
        subtitle={`Top ${candidates.length} matches found`}
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {candidates.map((cand, idx) => (
          <motion.div
            key={cand.id || idx}
            className="card p-5 hover:border-teal-500/30 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <Avatar
                initials={cand.avatar || "?"}
                color={getColorByScore(cand.match_score)}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm truncate">
                  {cand.name || "Unknown"}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {cand.title || "-"}
                </p>
                <p className="text-xs text-slate-600">
                  {cand.location || "-"} · {cand.years_experience || 0}yr
                </p>
              </div>
            </div>

            {/* Match Score */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Match Score</span>
                <span className="font-bold text-teal-400">
                  {cand.match_score || 0}%
                </span>
              </div>
              <ScoreBar value={cand.match_score || 0} color="teal" />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(cand.skills || []).slice(0, 3).map((skill) => (
                <SkillChip key={skill} skill={skill} variant="teal" />
              ))}
              {(cand.skills || []).length > 3 && (
                <span className="skill-chip bg-white/5 text-slate-500 text-xs">
                  +{cand.skills.length - 3}
                </span>
              )}
            </div>

            {/* Reasons */}
            {cand.match_reasons?.length > 0 && (
              <div className="border-t border-white/5 pt-3">
                <button
                  className="text-xs text-teal-400 font-medium flex items-center gap-1"
                  onClick={() => toggleReasons(cand.id)}
                >
                  <span>{expandedReasons[cand.id] ? '▼' : '▶'}</span>
                  Why matched
                </button>

                {expandedReasons[cand.id] && (
                  <motion.div
                    className="mt-2 space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {cand.match_reasons.map((reason, i) => (
                      <div key={i} className="text-xs text-slate-500 flex gap-2">
                        <span className="text-teal-400">›</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <AvailabilityBadge availability={cand.availability} />
              <div className="text-xs text-slate-600">
                {cand.education || "-"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">
            {candidates.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Candidates</div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {avgScore}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Avg Score</div>
        </div>

        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">
            {immediateCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Immediate</div>
        </div>
      </div>

      {/* Next */}
      <div className="flex justify-end">
        <button className="btn-primary flex items-center gap-2" onClick={onNext}>
          💬 Proceed to Outreach →
        </button>
      </div>
    </div>
  )
}

// 🎨 Helper
function getColorByScore(score = 0) {
  if (score >= 80) return '#00d4aa'
  if (score >= 65) return '#60a5fa'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}