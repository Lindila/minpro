import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const REDIRECT = {
  visitor: '/visitor/innovations',
  admin: '/dashboard',
  dev: '/dashboard',
  chef: '/projects',
  dir: '/dashboard',
  comptable: '/finances',
  ch: '/projects',
}

export default function VisitorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(REDIRECT[user.role] || '/visitor/innovations')
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <i className="ti ti-layers-intersect" style={{ fontSize: 28, color: '#1B4D3E' }} />
          </div>
          <div>
            <div style={styles.logoTitle}>SIGPRO-MINRESI</div>
            <div style={styles.logoSub}>Portail Innovation</div>
          </div>
        </div>

        {/* Header */}
        <h1 style={styles.title}>Connexion visiteur</h1>
        <p style={styles.subtitle}>
          Acc&eacute;dez au portail d'innovation et de recherche du Cameroun
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <i className="ti ti-mail" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="Adresse email"
              autoComplete="username"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <i className="ti ti-lock" />
            </span>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Mot de passe"
              autoComplete="current-password"
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              style={styles.eyeBtn}
            >
              <i className={`ti ti-eye${showPwd ? '-off' : ''}`} />
            </button>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 4 }}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Mot de passe oubli&eacute; ?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading || !email || !password ? 0.6 : 1,
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <i className="ti ti-loader spin" style={{ fontSize: 18 }} />
                Connexion...
              </>
            ) : (
              <>
                <i className="ti ti-login" style={{ fontSize: 18 }} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={styles.footerText}>
          Pas encore de compte ?{' '}
          <Link to="/visitor/register" style={styles.footerLink}>
            Cr&eacute;er un compte
          </Link>
        </div>

        <Link to="/" style={styles.backLink}>
          <i className="ti ti-arrow-left" style={{ fontSize: 14 }} />
          Retour &agrave; l'accueil
        </Link>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F5F7F5 0%, #E8F4EF 100%)',
    padding: 20,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: '#fff',
    borderRadius: 20,
    padding: '40px 36px',
    boxShadow: '0 8px 32px rgba(27,77,62,0.08), 0 2px 8px rgba(0,0,0,0.04)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: '#E8F4EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1B4D3E',
    letterSpacing: -0.3,
  },
  logoSub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    margin: '0 0 28px 0',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: '#F9FAFB',
    border: '1.5px solid #E5E7EB',
    borderRadius: 12,
    transition: 'border-color 0.2s',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: '#9CA3AF',
    fontSize: 16,
    display: 'flex',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '13px 44px 13px 42px',
    border: 'none',
    background: 'transparent',
    fontSize: 14,
    color: '#111827',
    outline: 'none',
    fontFamily: 'inherit',
  },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    padding: 4,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: '#FEF2F2',
    color: '#DC2626',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
  },
  forgotLink: {
    fontSize: 12,
    color: '#1B4D3E',
    fontWeight: 600,
    textDecoration: 'none',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '13px 0',
    background: '#1B4D3E',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    fontFamily: 'inherit',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 24,
  },
  footerLink: {
    color: '#1B4D3E',
    fontWeight: 700,
    textDecoration: 'none',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    fontSize: 13,
    color: '#9CA3AF',
    textDecoration: 'none',
    fontWeight: 500,
  },
}
