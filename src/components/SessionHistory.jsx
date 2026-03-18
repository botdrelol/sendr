// This component fetches the user's climbing sessions from the Supabase database and displays them in a list. Each session card shows the location, date, duration, and any notes associated with that session. When a user clicks on a session, it calls the onSelectSession callback with the selected session's data, allowing the parent component to display the details of that session or log routes for it.
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function SessionHistory({ onSelectSession }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSessions() {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false })

      if (!error) setSessions(data)
      setLoading(false)
    }
    fetchSessions()
  }, [])
  
  async function handleDelete(id) {
  const confirmed = window.confirm('Delete this session? All routes and media will be deleted too.')
  if (!confirmed) return

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)

  if (!error) {
    setSessions(sessions.filter(s => s.id !== id))
  }
}

  if (loading) return <p style={{ color: '#888' }}>Loading sessions...</p>
  if (sessions.length === 0) return <p style={{ color: '#888' }}>No sessions yet. Log one first!</p>

  return (
    <div>
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Your sessions</h2>
      {sessions.map(session => (
  <div key={session.id} style={{ position: 'relative' }}>
    <div
      onClick={() => onSelectSession(session)}
      style={cardStyle}
    >
      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
        {session.location || 'Unnamed location'}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>
        {new Date(session.date).toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric'
        })}
        {session.duration_mins && ` · ${session.duration_mins} mins`}
      </div>
      {session.notes && (
        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '6px' }}>
          {session.notes}
        </div>
      )}
    </div>
    <button
      onClick={() => handleDelete(session.id)}
      style={deleteButtonStyle}
    >
      ✕
    </button>
  </div>
))}
    </div>
  )
}

const cardStyle = {
  padding: '14px',
  border: '1px solid #eee',
  borderRadius: '10px',
  marginBottom: '10px',
  cursor: 'pointer',
  background: '#fafafa',
}

const deleteButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'none',
  border: 'none',
  color: '#f80000',
  fontSize: '1rem',
  cursor: 'pointer',
  padding: '4px 8px',
}
export default SessionHistory