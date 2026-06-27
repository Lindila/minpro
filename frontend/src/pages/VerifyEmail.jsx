import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { verifyEmail } from '../api/auth.api'

export default function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyEmail(token)
      .then(r => { setStatus('success'); setMessage(r.data.message) })
      .catch(err => { setStatus('error'); setMessage(err.response?.data?.message || 'Lien invalide ou expiré') })
  }, [token])

  return (
    <div className="auth-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', zIndex: 1, position: 'relative' }}>
        {status === 'loading' && (
          <>
            <i className="ti ti-loader spin" style={{ fontSize: 48, color: '#1B4D3E', display: 'block', marginBottom: 16 }} />
            <p style={{ color: '#6B7280', fontSize: 14 }}>Vérification en cours...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#DCFCE7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <i className="ti ti-circle-check" style={{ fontSize: 32, color: '#16A34A' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Email vérifié !</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>{message}</p>
            <Link to="/login" style={{ display: 'inline-block', background: '#1B4D3E', color: 'white', padding: '12px 32px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Se connecter
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FEE2E2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 32, color: '#DC2626' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Échec de vérification</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>{message}</p>
            <Link to="/register" style={{ display: 'inline-block', background: '#1B4D3E', color: 'white', padding: '12px 32px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Réessayer l'inscription
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
