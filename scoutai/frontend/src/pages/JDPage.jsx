import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";
import { SectionHeading, SkillChip, LoadingSpinner } from "../components/UI";

const SAMPLE_JD = `We are looking for a Senior Machine Learning Engineer with 5+ years of experience. Must have: Python, PyTorch, NLP, model deployment. Nice to have: MLOps, Kubernetes, LLM fine-tuning, Hugging Face. The role involves building production NLP pipelines and working closely with the product team in a fast-growing AI startup.`;

export default function JDPage({
  onNext,
  jdText,
  setJdText,
  parsedJD,
  setParsedJD,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Analyze JD
  const handleAnalyze = async () => {
  if (!jdText.trim()) return;

  setLoading(true);
  setError(null);

  try {
    const res = await api.parseJD(jdText);

    // 🔥 SAFE PARSING
    if (!res || !res.data || !res.data.data) {
      throw new Error("Invalid API response");
    }

    setParsedJD(res.data.data);

  } catch (e) {
    console.error("JD Parse Error:", e);
    setError("Backend failed or returned empty response");
  } finally {
    setLoading(false);
  }
};

  const handleFindCandidates = () => {
    if (parsedJD) onNext();
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <SectionHeading
        icon="📋"
        title="Job Description Input"
        subtitle="Paste your JD — our AI will parse it and discover matching candidates"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT */}
        <div className="card p-6">
          <label className="block text-xs font-semibold text-slate-500 mb-3">
            Job Description
          </label>

          <textarea
            className="input-base w-full resize-none text-sm"
            rows={10}
            placeholder="Paste your JD..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleAnalyze}
              disabled={loading || !jdText.trim()}
            >
              {loading ? <LoadingSpinner size={16} /> : "🧠"}
              {loading ? "Analyzing..." : "Analyze JD"}
            </button>

            {parsedJD && (
              <button
                className="btn-primary"
                onClick={handleFindCandidates}
              >
                🔍 Find Candidates →
              </button>
            )}

            <button
              className="btn-ghost text-xs"
              onClick={() => setJdText(SAMPLE_JD)}
            >
              Load Sample
            </button>
          </div>

          {error && (
            <div className="mt-3 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <AnimatePresence mode="wait">
          {!parsedJD ? (
            <motion.div
              key="empty"
              className="card p-6 text-center min-h-[300px]"
            >
              <div className="text-4xl opacity-40">🧠</div>
              <p className="text-slate-500 mt-2">
                Parse JD to see results
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="parsed"
              className="card p-6 space-y-5"
            >
              {/* ROLE */}
              <div>
                <div className="text-sm text-slate-500">Role</div>
                <div className="text-lg font-bold text-white">
                  {parsedJD.role || "N/A"}
                </div>

                <div className="flex gap-2 mt-2">
                  <span className="skill-chip">
                    {parsedJD.seniority || "N/A"}
                  </span>
                  <span className="skill-chip">
                    {parsedJD.min_experience || 0}+ yrs
                  </span>
                  <span className="skill-chip">
                    {parsedJD.domain || "General"}
                  </span>
                </div>
              </div>

              {/* MUST */}
              {parsedJD.must_skills?.length > 0 && (
                <div>
                  <div className="text-sm text-slate-500">
                    Must Skills
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedJD.must_skills.map((s) => (
                      <SkillChip key={s} skill={s} />
                    ))}
                  </div>
                </div>
              )}

              {/* NICE */}
              {parsedJD.nice_skills?.length > 0 && (
                <div>
                  <div className="text-sm text-slate-500">
                    Nice Skills
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedJD.nice_skills.map((s) => (
                      <SkillChip key={s} skill={s} />
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn-primary w-full"
                onClick={handleFindCandidates}
              >
                🔍 Discover Candidates →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}