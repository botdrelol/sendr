import MediaUploader from './MediaUploader'

function RouteDetail({ route, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={backButtonStyle}>
        ← Back to session
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{route.grade}</div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
          {route.style.replace('_', ' ')} · {route.result}
        </div>
        {route.notes && (
          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '8px' }}>
            {route.notes}
          </div>
        )}
      </div>

      <MediaUploader route={route} />
    </div>
  )
}

const backButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: '0 0 16px 0',
}

export default RouteDetail