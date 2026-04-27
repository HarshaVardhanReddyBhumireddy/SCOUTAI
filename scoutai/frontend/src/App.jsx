import { useState } from 'react'
import Topbar from './components/Topbar'
import JDPage from './pages/JDPage'
import CandidatesPage from './pages/CandidatesPage'
import OutreachPage from './pages/OutreachPage'
import ShortlistPage from './pages/ShortlistPage'

function App() {
  const [view, setView] = useState('jd')
  const [progress, setProgress] = useState(0)

  // State
  const [jdText, setJdText] = useState('')
  const [parsedJD, setParsedJD] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [conversations, setConversations] = useState({})

  const handleViewChange = (newView) => {
    const viewOrder = ['jd', 'candidates', 'outreach', 'shortlist']
    const newIdx = viewOrder.indexOf(newView)
    if (newIdx > progress) {
      setProgress(newIdx)
    }
    setView(newView)
  }

  const goNext = () => {
    const order = ['jd', 'candidates', 'outreach', 'shortlist']
    const currentIdx = order.indexOf(view)
    if (currentIdx < order.length - 1) {
      const nextView = order[currentIdx + 1]
      handleViewChange(nextView)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar view={view} setView={handleViewChange} progress={progress} />

      <main className="flex-1 p-6 md:p-8">
        {view === 'jd' && (
          <JDPage
            onNext={goNext}
            jdText={jdText}
            setJdText={setJdText}
            parsedJD={parsedJD}
            setParsedJD={setParsedJD}
          />
        )}

        {view === 'candidates' && (
          <CandidatesPage
            onNext={goNext}
            jdText={jdText}
            candidates={candidates}
            setCandidates={setCandidates}
          />
        )}

        {view === 'outreach' && (
          <OutreachPage
            onNext={goNext}
            jdText={jdText}
            candidates={candidates}
            conversations={conversations}
            setConversations={setConversations}
          />
        )}

        {view === 'shortlist' && (
          <ShortlistPage candidates={candidates} conversations={conversations} />
        )}
      </main>

      <footer className="bg-navy-900/50 border-t border-white/5 py-4 text-center text-xs text-slate-600">
        <p>
          ScoutAI — AI-Powered Talent Scouting Agent | Built for Catalyst Hackathon 2025
        </p>
      </footer>
    </div>
  )
}

export default App
