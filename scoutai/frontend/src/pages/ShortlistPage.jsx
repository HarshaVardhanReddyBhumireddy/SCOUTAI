import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Trophy } from 'lucide-react'
import { SectionHeading, ScoreBar, Avatar, EmptyState } from '../components/UI'

const RANK_COLORS = {
  1: { bg: 'rgba(255, 215, 0, 0.15)', border: '#ffd700', medal: '🥇' },
  2: { bg: 'rgba(192, 192, 192, 0.15)', border: '#c0c0c0', medal: '🥈' },
  3: { bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f32', medal: '🥉' },
}

export default function ShortlistPage({ candidates, conversations }) {
  const [shortlist, setShortlist] = useState([])
  const [matchWeight, setMatchWeight] = useState(0.6)
  const [interestWeight, setInterestWeight] = useState(0.4)

  useEffect(() => {
    buildShortlist()
  }, [candidates, conversations, matchWeight, interestWeight])

  const buildShortlist = () => {
    const enriched = candidates.slice(0, 5).map((cand) => {
      const conv = conversations[cand.id]
      const interestScore = conv?.interest_score || 50
      const interestSignals = conv?.interest_signals || []
      const combinedScore = Math.round(matchWeight * cand.match_score + interestWeight * interestScore)

      return {
        ...cand,
        interest_score: interestScore,
        interest_signals: interestSignals,
        combined_score: combinedScore,
      }
    })

    const sorted = enriched.sort((a, b) => b.combined_score - a.combined_score)
    setShortlist(sorted.map((item, i) => ({ ...item, rank: i + 1 })))
  }

  const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Title', 'Match Score', 'Interest Score', 'Combined Score', 'Availability']
    const rows = shortlist.map((c) => [
      c.rank,
      c.name,
      c.title,
      `${c.match_score}%`,
      `${c.interest_score}%`,
      `${c.combined_score}%`,
      c.availability,
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scoutai_shortlist.csv'
    a.click()
  }

  if (!candidates.length) {
    return (
      <EmptyState
        icon="🏆"
        title="No candidates yet"
        description="Complete the discovery and outreach stages first"
        action={null}
      />
    )
  }

  if (!shortlist.length) {
    return (
      <EmptyState
        icon="🏆"
        title="Building shortlist..."
        description="Calculating combined scores"
        action={null}
      />
    )
  }

  const avgMatch = Math.round(shortlist.reduce((acc, c) => acc + c.match_score, 0) / shortlist.length)
  const avgInterest = Math.round(shortlist.reduce((acc, c) => acc + c.interest_score, 0) / shortlist.length)
  const avgCombined = Math.round(shortlist.reduce((acc, c) => acc + c.combined_score, 0) / shortlist.length)

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading icon="🏆" title="Ranked Shortlist" subtitle="Top candidates ready to interview" />
        <button className="btn-secondary flex items-center gap-2" onClick={exportCSV}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Avg Combined Score
          </div>
          <div className="text-3xl font-bold text-teal-400">{avgCombined}%</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Avg Match Score
          </div>
          <div className="text-3xl font-bold text-blue-400">{avgMatch}%</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Avg Interest Score
          </div>
          <div className="text-3xl font-bold text-amber-400">{avgInterest}%</div>
        </div>
      </div>

      {/* Weight Controls */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
              Match Weight: {(matchWeight * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={matchWeight}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setMatchWeight(val)
                setInterestWeight(1 - val)
              }}
              className="w-full accent-teal-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
              Interest Weight: {(interestWeight * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={interestWeight}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setInterestWeight(val)
                setMatchWeight(1 - val)
              }}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Shortlist Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-900/50 border-b border-white/5">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest p-4">
                  Rank
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest p-4">
                  Candidate
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest p-4">
                  Match
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest p-4">
                  Interest
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest p-4">
                  Combined
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest p-4">
                  Key Signals
                </th>
              </tr>
            </thead>
            <tbody>
              {shortlist.map((cand, idx) => {
                const rankStyle = RANK_COLORS[cand.rank]
                return (
                  <motion.tr
                    key={cand.id}
                    className="border-b border-white/5 hover:bg-teal-500/5 transition-colors"
                    style={rankStyle ? { borderLeft: `3px solid ${rankStyle.border}` } : {}}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {/* Rank */}
                    <td className="p-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          background: rankStyle?.bg || 'rgba(255, 255, 255, 0.05)',
                          color: rankStyle?.border || '#94a3b8',
                        }}
                      >
                        {rankStyle?.medal || `#${cand.rank}`}
                      </div>
                    </td>

                    {/* Candidate */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={cand.avatar} color={getColorByScore(cand.match_score)} size="sm" />
                        <div>
                          <div className="font-semibold text-white text-sm">{cand.name}</div>
                          <div className="text-xs text-slate-500">{cand.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Match Score */}
                    <td className="p-4">
                      <div className="font-bold text-teal-400 mb-1.5 text-sm">{cand.match_score}%</div>
                      <ScoreBar value={cand.match_score} color="teal" className="w-20" />
                    </td>

                    {/* Interest Score */}
                    <td className="p-4">
                      <div className="font-bold text-blue-400 mb-1.5 text-sm">{cand.interest_score}%</div>
                      <ScoreBar value={cand.interest_score} color="blue" className="w-20" />
                    </td>

                    {/* Combined Score */}
                    <td className="p-4">
                      <div className="font-bold text-amber-400 mb-1.5 text-sm">{cand.combined_score}%</div>
                      <ScoreBar value={cand.combined_score} color="amber" className="w-20" />
                    </td>

                    {/* Signals */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cand.interest_signals.slice(0, 2).map((signal, i) => (
                          <span
                            key={i}
                            className="skill-chip bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="card p-5 mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full" />
          <span>
            <strong className="text-white">Scoring:</strong> Combined = {(matchWeight * 100).toFixed(0)}% Match
            + {(interestWeight * 100).toFixed(0)}% Interest
          </span>
        </div>
        <div>
          <strong className="text-white">Match:</strong> Skills + experience alignment
        </div>
        <div>
          <strong className="text-white">Interest:</strong> Conversation signal analysis
        </div>
      </div>
    </div>
  )
}

function getColorByScore(score) {
  if (score >= 80) return '#00d4aa'
  if (score >= 65) return '#60a5fa'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}
