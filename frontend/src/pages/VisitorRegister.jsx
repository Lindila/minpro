import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function VisitorRegister() {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', password: '', confirm: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.prenom || !form.nom || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (form.password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères')
      return
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      await register({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || undefined,
        password: form.password,
        role: 'visitor',
      })
      setSuccess(
        'Un email de vérification a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l\'email pour activer votre compte.'
      )
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription")
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
        <h1 style={styles.title}>Cr&eacute;er un compte visiteur</h1>
        <p style={styles.subtitle}>
          Rejoignez le portail d'innovation camerounais
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Prénom / Nom */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>
                <i className="ti ti-user" />
              </span>
              <input
                value={form.prenom}
                onChange={set('prenom')}
                placeholder="Prénom"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>
                <i className="ti ti-user" />
              </span>
              <input
                value={form.nom}
                onChange={set('nom')}
                placeholder="Nom"
                style={styles.input}
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <i className="ti ti-mail" />
            </span>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="Adresse email"
              autoComplete="email"
              style={styles.input}
            />
          </div>

          {/* Téléphone */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <i className="ti ti-phone" />
            </span>
            <input
              type="tel"
              value={form.telephone}
              onChange={set('telephone')}
              placeholder="Téléphone (optionnel)"
              style={styles.input}
            />
          </div>

          {/* Mot de passe */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <i className="ti ti-lock" />
            </span>
            <input
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="Mot de passe"
              autoComplete="new-password"
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

          {/* Confirmer */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <i className="ti ti-lock" />
            </span>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              style={styles.eyeBtn}
            >
              <i className={`ti ti-eye${showConfirm ? '-off' : ''}`} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={styles.successBox}>
              <i className="ti ti-circle-check" style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }} />
              <div>
                <div>{success}</div>
                <Link to="/visitor/login" style={{ color: '#1B4D3E', fontWeight: 600, marginTop: 6, display: 'inline-block', textDecoration: 'none' }}>
                  &rarr; Aller &agrave; la page de connexion
                </Link>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading || !!success ? 0.6 : 1,
              cursor: loading || !!success ? 'not-allowed' : 'pointer',
            }}
            disabled={loading || !!success}
          >
            {loading ? (
              <>
                <i className="ti ti-loader spin" style={{ fontSize: 18 }} />
                Inscription...
              </>
            ) : (
              <>
                <i className="ti ti-user-plus" style={{ fontSize: 18 }} />
                Cr&eacute;er mon compte
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div style={styles.footerText}>
          D&eacute;j&agrave; un compte ?{' '}
          <Link to="/visitor/login" style={styles.footerLink}>
            Se connecter
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
    maxWidth: 460,
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
    gap: 12,
  },
  row: {
    display: 'flex',
    gap: 10,
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: '#F9FAFB',
    border: '1.5px solid #E5E7EB',
    borderRadius: 12,
    flex: 1,
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
    padding: '12px 44px 12px 42px',
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
  successBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '12px 16px',
    background: '#E8F4EF',
    color: '#1B4D3E',
    borderRadius: 10,
    fontSize: 14,
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
