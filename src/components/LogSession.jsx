// This component provides a form for users to log their training sessions. It includes fields for date, location, duration, and notes. When the user submits the form, it validates the input and then saves the session data to the Supabase database. It also displays success or error messages based on the outcome of the submission.
// It uses React's useState hook to manage the form state and status messages. The styling is done inline for simplicity, but can be extracted to a separate CSS file if desired.

import { useState } from 'react'
import { supabase } from '../supabaseClient'

function LogSession() {
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit() {
    if (!date) {
      setStatus('Please add a date.')
      return
    }

    if (!location) {
      setStatus('Please add a location.')
      return
    }

    if (duration <= 0){
        setStatus('Please add a duration.')
        return
    }

    const { error } = await supabase.from('sessions').insert({
      date,
      location,
      duration_mins: duration ? parseInt(duration) : null,
      notes,
    })

    if (error) {
      setStatus('Error: ' + error.message)
    } else {
      setStatus('Session logged!')
      if (onSessionLogged) onSessionLogged()
      setDate('')
      setLocation('')
      setDuration('')
      setNotes('')
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Log a session</h2>

      <label style={labelStyle}>Date</label>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Location</label>
      <input
        type="text"
        placeholder="Gym, Park, etc."
        value={location}
        onChange={e => setLocation(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Duration (minutes)</label>
      <input
        type="number"
        placeholder="0"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        style={inputStyle}
        min = {0}
      />

      <label style={labelStyle}>Notes</label>
      <textarea
        placeholder="How did it go?"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
      />

      <button onClick={handleSubmit} style={buttonStyle}>
        Save session
      </button>

      {status && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: status.startsWith('Error') || status.startsWith('Please') ? 'red' : 'green' }}>
          {status}
        </p>
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
  marginBottom: '4px',
}

const buttonStyle = {
  marginTop: '20px',
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

export default LogSession