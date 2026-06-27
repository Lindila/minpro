import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { resetPassword } from '../api/auth.api'

export default function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 4) { setError('Le mot de passe doit contenir au moins 4 caractères'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return }
    setLoading(true)
    try {
      await resetPassword(token, { password })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', zIndex: 1, position: 'relative' }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#DCFCE7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <i className="ti ti-circle-check" style={{ fontSize: 32, color: '#16A34A' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Mot de passe réinitialisé !</h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <Link to="/login" style={{ display: 'inline-block', background: '#1B4D3E', color: 'white', padding: '12px 32px', borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Se connecter
            </Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: '#E8F4EF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <i className="ti ti-lock-cog" style={{ fontSize: 28, color: '#1B4D3E' }} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Nouveau mot de passe</h2>
              <p style={{ color: '#6B7280', fontSize: 13 }}>Choisissez un nouveau mot de passe sécurisé.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <span className="input-icon"><i className="ti ti-lock" /></span>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder="Nouveau mot de passe" />
                <button type="button" className="eye-toggle" onClick={() => setShowPwd(v => !v)}>
                  <i className={`ti ti-eye${showPwd ? '-off' : ''}`} />
                </button>
              </div>
              <div className="auth-input-group">
                <span className="input-icon"><i className="ti ti-lock" /></span>
                <input type={showPwd ? 'text' : 'password'} value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }} placeholder="Confirmer le mot de passe" />
              </div>
              {error && (
                <div className="auth-error-msg">
                  <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} />
                  {error}
                </div>
              )}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><i className="ti ti-loader spin" />Réinitialisation...</>
                  : <><i className="ti ti-check" />Réinitialiser</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
