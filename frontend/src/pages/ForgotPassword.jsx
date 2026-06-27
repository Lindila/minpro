import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth.api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', zIndex: 1, position: 'relative' }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#DCFCE7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <i className="ti ti-mail-check" style={{ fontSize: 32, color: '#16A34A' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Email envoyé !</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
              Si un compte existe avec <strong>{email}</strong>, vous recevrez un lien de réinitialisation.
            </p>
            <Link to="/login" style={{ color: '#1B4D3E', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF9C3', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <i className="ti ti-lock-question" style={{ fontSize: 28, color: '#854D0E' }} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Mot de passe oublié ?</h2>
              <p style={{ color: '#6B7280', fontSize: 13 }}>Entrez votre email pour recevoir un lien de réinitialisation.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <span className="input-icon"><i className="ti ti-mail" /></span>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="Email professionnel" required />
              </div>
              {error && (
                <div className="auth-error-msg">
                  <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} />
                  {error}
                </div>
              )}
              <button type="submit" className="auth-submit" disabled={loading || !email}>
                {loading
                  ? <><i className="ti ti-loader spin" />Envoi...</>
                  : <><i className="ti ti-mail-forward" />Envoyer le lien</>}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
              <Link to="/login" style={{ color: '#1B4D3E', fontWeight: 700, textDecoration: 'none' }}>
                ← Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
