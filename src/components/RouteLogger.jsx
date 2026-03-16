// This component allows users to log climbing routes for a specific session. It fetches the routes associated with the given session from the Supabase database and displays them in a list. Users can add new routes by entering the grade, style, result, attempts, and notes, which are then saved to the database and displayed in the list of routes for that session.
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function RouteLogger({ session }) {
  const [routes, setRoutes] = useState([])
  const [grade, setGrade] = useState('')
  const [style, setStyle] = useState('boulder')
  const [result, setResult] = useState('sent')
  const [notes, setNotes] = useState('')
  const [attempts, setAttempts] = useState (1)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchRoutes()
  }, [session.id])

  async function fetchRoutes() {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('session_id', session.id)

    if (!error) setRoutes(data)
  }

  async function handleAddRoute() {
    if (!grade) {
      setStatus('Please enter a grade.')
      return
    }

    const { error } = await supabase.from('routes').insert({
      session_id: session.id,
      grade,
      style,
      result,
      notes,
      attempts: attempts ? parseInt(attempts) : 1,
    })

    if (error) {
      setStatus('Error: ' + error.message)
    } else {
      setStatus(null)
      setGrade('')
      setNotes('')
      setAttempts(1)
      fetchRoutes()
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
          {session.location || 'Unnamed location'}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
          {new Date(session.date).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric'
          })}
          {session.duration_mins && ` · ${session.duration_mins} mins`}
        </div>
        {session.notes && (
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '6px' }}>
            {session.notes}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>
        Log a route
      </h3>

      <label style={labelStyle}>Grade</label>
      <input
        type="text"
        placeholder="e.g. V4, Pink Tag, 5.11a"
        value={grade}
        onChange={e => setGrade(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Style</label>
      <select value={style} onChange={e => setStyle(e.target.value)} style={inputStyle}>
        <option value="boulder">Boulder</option>
        <option value="top_rope">Top rope</option>
        <option value="lead">Lead</option>
      </select>

      <label style={labelStyle}>Result</label>
      <select value={result} onChange={e => setResult(e.target.value)} style={inputStyle}>
        <option value="sent">Sent</option>
        <option value="fell">Fell</option>
        <option value="project">Project</option>
      </select>

  <label style={labelStyle}>Attempts (minutes)</label>
      <input
        type="number"
        placeholder="1"
        value={attempts}
        onChange={e => setAttempts(e.target.value)}
        style={inputStyle}
        min = {1}
      />
      <label style={labelStyle}>Notes</label>
      <input
        type="text"
        placeholder="Optional"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        style={inputStyle}
      />


      <button onClick={handleAddRoute} style={buttonStyle}>Add route</button>

      {status && (
        <p style={{ fontSize: '0.85rem', color: 'red', marginTop: '8px' }}>{status}</p>
      )}

      {routes.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px' }}>
            Routes this session ({routes.length})
          </h3>
          {routes.map(route => (
            <div key={route.id} style={routeRowStyle}>
              <span style={{ fontWeight: '600' }}>{route.grade}</span>
              <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '8px' }}>
                {route.style.replace('_', ' ')} · {route.result}
              </span>
              {route.notes && (
                <span style={{ fontSize: '0.8rem', color: '#aaa', marginLeft: '8px' }}>
                  {route.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '500',
  marginBottom: '4px',
  marginTop: '12px',
  color: '#444',
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxSizing: 'border-box',
}

const buttonStyle = {
  marginTop: '16px',
  width: '100%',
  padding: '14px',
  fontSize: '1rem',
  fontWeight: '600',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}

const routeRowStyle = {
  padding: '10px 12px',
  background: '#f5f5f5',
  borderRadius: '8px',
  marginBottom: '6px',
}

export default RouteLogger