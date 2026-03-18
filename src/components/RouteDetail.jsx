import { useState } from 'react'
import { supabase } from '../supabaseClient'
import MediaUploader from './MediaUploader'

function RouteDetail({ route, onBack, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    grade: route.grade || '',
    style: route.style || 'boulder',
    result: route.result || 'sent',
    attempts: route.attempts || '1',
    notes: route.notes || '',
  })

  async function handleDelete() {
    const confirmed = window.confirm('Delete this route?')
    if (!confirmed) return

    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', route.id)

    if (!error) onDelete(route.id)
  }

  async function handleSaveEdit() {
    const { error } = await supabase
      .from('routes')
      .update({
        grade: editForm.grade,
        style: editForm.style,
        result: editForm.result,
        attempts: editForm.attempts ? parseInt(editForm.attempts) : 1,
        notes: editForm.notes,
      })
      .eq('id', route.id)

    if (!error) {
      onEdit({ ...route, ...editForm })
      setEditing(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={onBack} style={backButtonStyle}>← Back to routes</button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setEditing(!editing)} style={editButtonStyle}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} style={deleteButtonStyle}>Delete</button>
        </div>
      </div>

      {editing ? (
        <div>
          <label style={labelStyle}>Grade</label>
          <input
            type="text"
            value={editForm.grade}
            onChange={e => setEditForm({ ...editForm, grade: e.target.value })}
            style={inputStyle}
          />

          <label style={labelStyle}>Style</label>
          <select
            value={editForm.style}
            onChange={e => setEditForm({ ...editForm, style: e.target.value })}
            style={inputStyle}
          >
            <option value="Boulder">Boulder</option>
            <option value="Top_rope">Top rope</option>
            <option value="Lead">Lead</option>
          </select>

          <label style={labelStyle}>Result</label>
          <select
            value={editForm.result}
            onChange={e => setEditForm({ ...editForm, result: e.target.value })}
            style={inputStyle}
          >
            <option value="Sent">Sent</option>
            <option value="Fell">Fell</option>
            <option value="Project">Project</option>
          </select>
  <label style={labelStyle}>Attempts</label>
        <input
          type="number"
          placeholder="1"
          value={editForm.attempts}
          onChange={e => setEditForm({ ...editForm, attempts: e.target.value })}
          style={inputStyle}
          min = {1}
        />
          <label style={labelStyle}>Notes</label>
          <input
            type="text"
            value={editForm.notes}
            onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
            style={inputStyle}
          />

          <button onClick={handleSaveEdit} style={saveButtonStyle}>Save changes</button>
        </div>
      ) : (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{route.name}</div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
           {route.grade} ·  {route.style.replace('_', ' ')} · {route.result} · {route.attempts} attempts
          </div>
          {route.notes && (
            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '8px' }}>
              {route.notes}
            </div>
          )}
        </div>
      )}

      {!editing && <MediaUploader route={route} />}
    </div>
  )
}

const backButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: 0,
}

const editButtonStyle = {
  background: 'none',
  border: '1px solid #ddd',
  color: '#444',
  fontSize: '0.9rem',
  borderRadius: '6px',
  padding: '4px 12px',
  cursor: 'pointer',
}

const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#e53e3e',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: 0,
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

const saveButtonStyle = {
  marginTop: '16px',
  width: '100%',
  padding: '12px',
  fontSize: '1rem',
  fontWeight: '600',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}

export default RouteDetail