import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function Stats() {
  const [sessions, setSessions] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: true })

      const { data: routeData } = await supabase
        .from('routes')
        .select('*')
        .eq ('style', 'Boulder')

      if (sessionData) setSessions(sessionData)
      if (routeData) setRoutes(routeData)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <p style={{ color: '#888' }}>Loading stats...</p>
  if (sessions.length === 0) return <p style={{ color: '#888' }}>No data yet. Log some sessions first!</p>

  function parseVGrade(grade) {
    if (!grade) return null
    const match = grade.toLowerCase().match(/v(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  const sentRoutes = routes.filter(r => r.result === 'Sent')

  const allGrades = sentRoutes.map(r => parseVGrade(r.grade)).filter(g => g !== null)
  const hardestGrade = allGrades.length > 0 ? Math.max(...allGrades) : null

  const chartData = sessions.map(session => {
    const sessionRoutes = sentRoutes.filter(r => r.session_id === session.id)
    const grades = sessionRoutes.map(r => parseVGrade(r.grade)).filter(g => g !== null)
    const highest = grades.length > 0 ? Math.max(...grades) : null

    return {
      date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      highestGrade: highest,
    }
  }).filter(d => d.highestGrade !== null)

  return (
    <div>
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Your stats</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2rem' }}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{sessions.length}</div>
          <div style={statLabelStyle}>Sessions</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{routes.length}</div>
          <div style={statLabelStyle}>Routes logged</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{sentRoutes.length}</div>
          <div style={statLabelStyle}>Routes sent</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>
            {hardestGrade !== null ? `V${hardestGrade}` : '—'}
          </div>
          <div style={statLabelStyle}>Hardest sent</div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem' }}>
            Grade progression
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#888' }}
              />
              <YAxis
                tickFormatter={v => `V${v}`}
                tick={{ fontSize: 11, fill: '#888' }}
                domain={[0, 10]}
              />
              <Tooltip
                formatter={v => [`V${v}`, 'Highest grade']}
                contentStyle={{ fontSize: '0.85rem', borderRadius: '8px', border: '1px solid #eee' }}
              />
              <Line
                type="monotone"
                dataKey="highestGrade"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length <= 1 && (
        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          Log at least 2 sessions with sent routes to see your progression chart.
        </p>
      )}
    </div>
  )
}

const statCardStyle = {
  background: '#f5f5f5',
  borderRadius: '10px',
  padding: '16px',
  textAlign: 'center',
}

const statNumberStyle = {
  fontSize: '1.8rem',
  fontWeight: '600',
  color: '#2563eb',
}

const statLabelStyle = {
  fontSize: '0.8rem',
  color: '#888',
  marginTop: '4px',
}

export default Stats