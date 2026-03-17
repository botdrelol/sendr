// This is the main entry point of the application. It sets up the basic structure and routing for the app.
// It uses React's useState hook to manage the current screen state, which determines which component to display.

import { useState } from 'react'
import LogSession from './components/LogSession'
import SessionHistory from './components/SessionHistory'
import RouteLogger from './components/RouteLogger'
import Stats from './components/Stats'

function App() {
  const [screen, setScreen] = useState('history')
  const [selectedSession, setSelectedSession] = useState(null)

  function handleSelectSession(session) {
    setSelectedSession(session)
    setScreen('routes')
  }

  function handleSessionLogged() {
    setScreen('history')
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', marginBottom: '1.5rem' }}>
  <h1 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Sendr</h1>
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
    <button onClick={() => setScreen('log')} style={screen === 'log' ? activeTabStyle : tabStyle}>Log</button>
    <button onClick={() => setScreen('history')} style={screen === 'history' ? activeTabStyle : tabStyle}>History</button>
      <button onClick={() => setScreen('stats')} style={screen === 'stats' ? activeTabStyle : tabStyle}>Stats</button>
  </div>
  <div />
</div>
      </div>

      {screen === 'log' && <LogSession onSessionLogged={handleSessionLogged} />}
      {screen === 'history' && <SessionHistory onSelectSession={handleSelectSession} />}
      {screen === 'stats' && <Stats />}
      {screen === 'routes' && selectedSession && (
        <>
          <button onClick={() => setScreen('history')} style={backButtonStyle}>
            ← Back
          </button>
          <RouteLogger session={selectedSession} />
        </>
      )}
    </div>
  )
}

const tabStyle = {
  padding: '6px 0',
  width: '80px',
  textAlign: 'center',
  fontSize: '0.85rem',
  border: '1px solid #ddd',
  borderRadius: '20px',
  background: 'white',
  cursor: 'pointer',
  color: '#444',
}

const activeTabStyle = {
  ...tabStyle,
  background: '#2563eb',
  color: 'white',
  border: '1px solid #2563eb',
}

const backButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: '0 0 16px 0',
}

export default App