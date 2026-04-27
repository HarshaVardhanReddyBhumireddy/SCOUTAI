const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  parseJD: (jd_text) =>
    request('/parse-jd', { method: 'POST', body: JSON.stringify({ jd_text }) }),

  matchCandidates: (jd_text) =>
    request('/match-candidates', { method: 'POST', body: JSON.stringify({ jd_text }) }),

  simulateOutreach: (candidate_id, jd_text, match_score) =>
    request('/simulate-outreach', {
      method: 'POST',
      body: JSON.stringify({ candidate_id, jd_text, match_score }),
    }),

  buildShortlist: (candidates, match_weight = 0.6, interest_weight = 0.4) =>
    request('/build-shortlist', {
      method: 'POST',
      body: JSON.stringify({ candidates, match_weight, interest_weight }),
    }),
}
