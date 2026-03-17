import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function MediaUploader({ route }) {
  const [mediaItems, setMediaItems] = useState([])
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchMedia()
  }, [route.id])

  async function fetchMedia() {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('route_id', route.id)
      .order('uploaded_at', { ascending: false })

    if (!error) setMediaItems(data)
  }

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024

    if (file.size > maxSize) {
      setStatus(`File too large. Max size is ${isVideo ? '50MB' : '10MB'}.`)
      return
    }

    setUploading(true)
    setStatus(null)

    const fileExt = file.name.split('.').pop()
    const fileName = `${route.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('session-media')
      .upload(fileName, file)

    if (uploadError) {
      setStatus('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('session-media')
      .getPublicUrl(fileName)

    const { error: dbError } = await supabase.from('media').insert({
      route_id: route.id,
      url: urlData.publicUrl,
      type: isVideo ? 'video' : 'photo',
      caption: file.name,
    })

    if (dbError) {
      setStatus('Error saving to database: ' + dbError.message)
    } else {
      setStatus('Uploaded!')
      fetchMedia()
    }

    setUploading(false)
  }
    const uploadButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    border: '1.5px dashed #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    opacity: uploading ? 0.5 : 1,
    }
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>
        Photos & videos
      </h3>

     <label style={uploadButtonStyle}>
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2563eb"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
  <input
    type="file"
    accept="image/*,video/*"
    onChange={handleFileChange}
    disabled={uploading}
    style={{ display: 'none' }}
  />
</label>

      {status && (
        <p style={{ fontSize: '0.85rem', marginTop: '8px', color: status.startsWith('Upload') || status.startsWith('Error') ? 'red' : 'green' }}>
          {status}
        </p>
      )}

      {mediaItems.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {mediaItems.map(item => (
            <div key={item.id} style={mediaTileStyle}>
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



const mediaTileStyle = {
  width: 'calc(100% - 0px)',
  height: 'calc(100% - 0px)',
  aspectRatio: '1',
  borderRadius: '8px',
  overflow: 'hidden',
  background: '#f0f0f0',
}

export default MediaUploader