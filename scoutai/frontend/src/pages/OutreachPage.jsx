import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../utils/api'
import {
  SectionHeading,
  ScoreBar,
  Avatar,
  LoadingSpinner,
  EmptyState
} from '../components/UI'

export default function OutreachPage({
  onNext,
  jdText,
  candidates,
  setConversations,
  conversations
}) {
  const [selectedCandId, setSelectedCandId] = useState(null)
  const [simulating, setSimulating] = useState(false)
  const [error, setError] = useState(null)

  const top5 = (candidates || []).slice(0, 5)

  // ✅ Safe selection
  const activeCand =
    top5.find((c) => c.id === selectedCandId) || top5[0]

  const activeConv = activeCand ? conversations[activeCand.id] : null

  // ❌ No candidates
  if (!candidates?.length) {
    return (
      <EmptyState
        icon="💬"
        title="No candidates yet"
        description="Please discover candidates first"
      />
    )
  }

  // 🚀 API Call
  const handleSimulate = async (candId) => {
    const cand = candidates.find((c) => c.id === candId)
    if (!cand) return

    setSimulating(true)
    setError(null)

    try {
      const res = await api.simulateOutreach(
        candId,
        jdText,
        cand.match_score
      )

      const data = res?.data || {}

      setConversations((prev) => ({
        ...prev,
        [candId]: data,
      }))
    } catch (e) {
      console.error("Outreach Error:", e)
      setError("Failed to simulate outreach. Try again.")
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <SectionHeading
        icon="💬"
        title="Conversational Outreach"
        subtitle="AI-powered engagement simulation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

        {/* LEFT SIDEBAR */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 mb-3 px-1">
            Top 5 Candidates
          </div>

          {top5.map((cand) => (
            <button
              key={cand.id}
              onClick={() => setSelectedCandId(cand.id)}
              className={`w-full card-inner p-3 flex items-center gap-3 transition-all duration-200
              ${
                activeCand?.id === cand.id
                  ? 'border-teal-500/40 bg-teal-500/5'
                  : 'hover:border-teal-500/20'
              }`}
            >
              <Avatar
                initials={cand.avatar || "?"}
                color={getColorByScore(cand.match_score)}
                size="sm"
              />

              <div className="flex-1 text-left">
                <div className="font-semibold text-sm text-white truncate">
                  {cand.name || "Unknown"}
                </div>
                <div className="text-xs text-slate-500">
                  {cand.match_score || 0}% match
                </div>
              </div>

              {conversations[cand.id] && (
                <div className="w-2 h-2 rounded-full bg-teal-400" />
              )}
            </button>
          ))}
        </div>

        {/* MAIN CHAT */}
        <div className="card flex flex-col overflow-hidden min-h-[600px]">

          {/* HEADER */}
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-navy-900/50">
            {activeCand && (
              <div className="flex items-center gap-3">
                <Avatar
                  initials={activeCand.avatar || "?"}
                  color={getColorByScore(activeCand.match_score)}
                />
                <div>
                  <div className="font-bold text-white">
                    {activeCand.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {activeCand.title || "-"} · {activeCand.years_experience || 0}yr
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => handleSimulate(activeCand.id)}
              disabled={simulating || !activeCand}
            >
              {simulating ? (
                <>
                  <LoadingSpinner size={16} />
                  Simulating...
                </>
              ) : (
                <>
                  <span>{activeConv ? '🔄' : '▶️'}</span>
                  {activeConv ? 'Re-run' : 'Simulate'}
                </>
              )}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-3 text-red-400 text-sm border-b border-red-500/20">
              {error}
            </div>
          )}

          {/* MESSAGES */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <AnimatePresence mode="wait">

              {!activeConv && !simulating ? (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="text-4xl opacity-40 mb-3">💬</div>
                  <p className="text-slate-500 text-sm">
                    Click simulate to start conversation
                  </p>
                </motion.div>
              ) : simulating ? (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center justify-center h-full"
                >
                  <LoadingSpinner size={40} />
                  <p className="text-slate-500 mt-3">Generating...</p>
                </motion.div>
              ) : (
                <motion.div key="messages">
                  {(activeConv.messages || []).map((msg, i) => (
                    <motion.div
                      key={i}
                      className={`flex ${
                        msg.role === 'agent'
                          ? 'justify-end'
                          : 'justify-start'
                      } mb-4`}
                    >
                      <div className="max-w-[75%]">
                        <div className="text-xs text-slate-500 mb-1">
                          {msg.role === 'agent'
                            ? 'ScoutAI'
                            : 'Candidate'}
                        </div>

                        <div
                          className={`px-4 py-2 rounded-xl text-sm ${
                            msg.role === 'agent'
                              ? 'bg-teal-500/20'
                              : 'bg-navy-700'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SCORE */}
          {activeConv && (
            <div className="p-5 border-t border-white/5">
              <div className="text-sm text-slate-500 mb-2">
                Interest Score
              </div>

              <div className="text-2xl font-bold text-teal-400 mb-2">
                {activeConv.interest_score || 0}%
              </div>

              <ScoreBar
                value={activeConv.interest_score || 0}
                color="blue"
              />
            </div>
          )}
        </div>
      </div>

      {/* NEXT */}
      <div className="flex justify-end mt-6">
        <button
          className="btn-primary flex items-center gap-2"
          onClick={onNext}
        >
          🏆 Generate Ranked Shortlist →
        </button>
      </div>
    </div>
  )
}

// 🎨 helper
function getColorByScore(score = 0) {
  if (score >= 80) return '#00d4aa'
  if (score >= 65) return '#60a5fa'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}