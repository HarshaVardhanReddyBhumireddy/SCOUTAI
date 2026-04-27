import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../utils/api'
import { SectionHeading, SkillChip, LoadingSpinner } from '../components/UI'

const SAMPLE_JD = `We are looking for a Senior Machine Learning Engineer with 5+ years of experience. Must have: Python, PyTorch, NLP, model deployment. Nice to have: MLOps, Kubernetes, LLM fine-tuning, Hugging Face. The role involves building production NLP pipelines and working closely with the product team in a fast-growing AI startup.`

export default function JDPage({ onNext, jdText, setJdText, parsedJD, setParsedJD }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ CLEAN & CORRECT API CALL
  const handleAnalyze = async () => {
    if (!jdText.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await api.parseJD(jdText)

      // ✅ safe handling
      const data = res?.data || {}
      setParsedJD(data)

    } catch (e) {
      console.error("JD Parse Error:", e)
      setError("Failed to analyze JD. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFindCandidates = () => {
    if (parsedJD) onNext()
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <SectionHeading
        icon="📋"
        title="Job Description Input"
        subtitle="Paste your JD — our AI will parse it and discover matching candidates"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT: INPUT */}
        <div className="card p-6">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Job Description
          </label>

          <textarea
            className="input-base w-full resize-none text-sm leading-relaxed"
            rows={10}
            placeholder="Paste or type your job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />

          <div className="flex items-center gap-3 mt-4 flex-wrap">

            {/* ANALYZE BUTTON */}
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleAnalyze}
              disabled={loading || !jdText.trim()}
            >
              {loading ? <LoadingSpinner size={16} /> : <span>🧠</span>}
              {loading ? 'Analyzing...' : 'Analyze JD'}
            </button>

            {/* NEXT BUTTON */}
            {parsedJD && (
              <button
                className="btn-primary flex items-center gap-2"
                onClick={handleFindCandidates}
              >
                🔍 Find Candidates →
              </button>
            )}

            {/* SAMPLE */}
            <button
              className="btn-ghost text-xs"
              onClick={() => setJdText(SAMPLE_JD)}
            >
              Load Sample JD
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT: PARSED RESULT */}
        <AnimatePresence mode="wait">
          {!parsedJD ? (
            <motion.div
              key="empty"
              className="card p-6 flex flex-col items-center justify-center text-center min-h-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-4xl mb-4 opacity-40">🧠</div>
              <p className="text-slate-600 text-sm">
                Parse a JD to see extracted fields
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="parsed"
              className="card p-6 space-y-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >

              {/* ROLE */}
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">Role</div>
                <div className="text-lg font-bold text-white">
                  {parsedJD.role || "N/A"}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="skill-chip chip-blue">
                    {parsedJD.seniority || "N/A"}
                  </span>
                  <span className="skill-chip chip-amber">
                    {parsedJD.min_experience || 0}+ yrs
                  </span>
                  <span className="skill-chip chip-purple">
                    {parsedJD.domain || "General"}
                  </span>
                </div>
              </div>

              {/* MUST SKILLS */}
              {parsedJD.must_skills?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Must-Have Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedJD.must_skills.map((s) => (
                      <SkillChip key={s} skill={`✓ ${s}`} variant="teal" />
                    ))}
                  </div>
                </div>
              )}

              {/* NICE SKILLS */}
              {parsedJD.nice_skills?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Nice-to-Have
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedJD.nice_skills.map((s) => (
                      <SkillChip key={s} skill={`+ ${s}`} variant="blue" />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                className="btn-primary w-full mt-2"
                onClick={handleFindCandidates}
              >
                🔍 Discover Matching Candidates →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PIPELINE */}
      <div className="mt-6 card p-5">
        <div className="text-xs font-semibold text-slate-500 mb-4">
          Agent Pipeline
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '📋', title: 'Parse JD' },
            { icon: '🔍', title: 'Discover' },
            { icon: '💬', title: 'Outreach' },
            { icon: '🏆', title: 'Rank' },
          ].map((step, i) => (
            <div key={i} className="card-inner p-4 text-center">
              <div className="text-2xl mb-2">{step.icon}</div>
              <div className="text-sm font-semibold text-white">{step.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}