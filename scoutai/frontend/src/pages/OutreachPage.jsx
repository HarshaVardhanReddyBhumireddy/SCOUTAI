import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../utils/api'
import { SectionHeading, ScoreBar, Avatar, LoadingSpinner, EmptyState } from '../components/UI'

export default function OutreachPage({ onNext, jdText, candidates, setConversations, conversations }) {
  const [selectedCandId, setSelectedCandId] = useState(null)
  const [simulating, setSimulating] = useState(false)

  const top5 = candidates.slice(0, 5)
  const activeCand = top5.find((c) => c.id === selectedCandId) || top5[0]
  const activeConv = conversations[activeCand?.id]

  if (!candidates.length) {
    return (
      <EmptyState
        icon="💬"
        title="No candidates yet"
        description="Please discover candidates first"
        action={null}
      />
    )
  }

  const handleSimulate = async (candId) => {
    const cand = candidates.find((c) => c.id === candId)
    if (!cand) return

    setSimulating(true)
    try {
      const res = await api.simulateOutreach(candId, jdText, cand.match_score)
      setConversations((prev) => ({
        ...prev,
        [candId]: res.data,
      }))
    } catch (e) {
      console.error('Outreach simulation failed:', e)
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <SectionHeading icon="💬" title="Conversational Outreach" subtitle="AI-powered engagement simulation" />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Sidebar: Candidate list */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">
            Top 5 Candidates
          </div>
          {top5.map((cand) => (
            <button
              key={cand.id}
              onClick={() => setSelectedCandId(cand.id)}
              className={`w-full card-inner p-3 flex items-center gap-3 transition-all duration-200
                ${activeCand?.id === cand.id ? 'border-teal-500/40 bg-teal-500/5' : 'hover:border-teal-500/20'}`}
            >
              <Avatar initials={cand.avatar} color={getColorByScore(cand.match_score)} size="sm" />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-semibold text-sm text-white truncate">{cand.name}</div>
                <div className="text-xs text-slate-500">{cand.match_score}% match</div>
              </div>
              {conversations[cand.id] && (
                <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Main: Chat window */}
        <div className="card overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
          {/* Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-navy-900/50">
            <div className="flex items-center gap-3">
              <Avatar initials={activeCand.avatar} color={getColorByScore(activeCand.match_score)} />
              <div>
                <div className="font-bold text-white">{activeCand.name}</div>
                <div className="text-sm text-slate-400">
                  {activeCand.title} · {activeCand.years_experience}yr exp
                </div>
              </div>
            </div>
            <button
              className={`btn-primary flex items-center gap-2 ${
                activeConv ? 'bg-navy-700 border border-teal-500/30 text-teal-400' : ''
              }`}
              onClick={() => handleSimulate(activeCand.id)}
              disabled={simulating}
            >
              {simulating ? (
                <>
                  <LoadingSpinner size={16} />
                  Simulating...
                </>
              ) : (
                <>
                  <span>{activeConv ? '🔄' : '▶️'}</span>
                  {activeConv ? 'Re-run Simulation' : 'Simulate Outreach'}
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <AnimatePresence mode="wait">
              {!activeConv && !simulating ? (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center justify-center h-full text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-4xl mb-4 opacity-40">💬</div>
                  <p className="text-slate-500 text-sm max-w-md">
                    Click "Simulate Outreach" to generate a realistic conversation with {activeCand.name}
                  </p>
                </motion.div>
              ) : simulating ? (
                <motion.div
                  key="loading"
                  className="flex flex-col items-center justify-center h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <LoadingSpinner size={40} />
                  <p className="text-slate-500 text-sm mt-4">Generating conversation...</p>
                </motion.div>
              ) : (
                <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {activeConv.messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className={`flex ${msg.role === 'agent' ? 'justify-end' : 'justify-start'} mb-4`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={`max-w-[75%] ${msg.role === 'agent' ? 'items-end' : 'items-start'}`}>
                        <div className="text-xs font-medium text-slate-500 mb-1 px-1">
                          {msg.role === 'agent' ? 'ScoutAI Agent' : 'Candidate'}
                        </div>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'agent'
                              ? 'bg-teal-500/15 border border-teal-500/20 text-slate-100 rounded-br-sm'
                              : 'bg-navy-700 border border-white/10 text-slate-200 rounded-bl-sm'
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

          {/* Interest Score Footer */}
          {activeConv && (
            <motion.div
              className="p-5 border-t border-white/5 bg-navy-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Interest Score
                  </div>
                  <div className="text-3xl font-bold text-teal-400">{activeConv.interest_score}%</div>
                </div>
                <div className="flex-1">
                  <ScoreBar value={activeConv.interest_score} color="blue" className="h-2 mb-3" />
                  <div className="flex flex-wrap gap-1.5">
                    {activeConv.interest_signals?.slice(0, 3).map((signal, i) => (
                      <span
                        key={i}
                        className="skill-chip bg-blue-500/15 text-blue-400 border-blue-500/25 text-xs"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button className="btn-primary flex items-center gap-2" onClick={onNext}>
          🏆 Generate Ranked Shortlist →
        </button>
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
