import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEMO = [
  { role: 'admin', label: 'Admin MINRESI',   email: 'admin@minresi.cm',     pwd: 'admin123', icon: 'shield-lock',   clr: '#8B5CF6' },
  { role: 'chef',  label: 'Chef de projet',  email: 'chef@minresi.cm',      pwd: 'chef123',  icon: 'folder-kanban', clr: '#1B4D3E' },
  { role: 'dir',   label: 'Directeur Inst.', email: 'dir@minresi.cm',       pwd: 'dir123',   icon: 'building',      clr: '#2563EB' },
  { role: 'ch',    label: 'Chercheur',       email: 'chercheur@minresi.cm', pwd: 'ch123',    icon: 'microscope',    clr: '#D4A017' },
]

const REDIRECT = { admin: '/dashboard', chef: '/projects', dir: '/dashboard', ch: '/projects' }

function CameroonMap() {
  return (
    <svg viewBox="0 0 200 300" className="auth-map-watermark" fill="rgba(255,255,255,0.85)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8">
      <path d="M90,2 L100,0 L108,5 L112,15 L110,25 L108,35 L112,48 L118,58 L125,64 L132,72 L138,84 L143,98 L147,112 L150,128 L148,144 L144,158 L138,172 L130,186 L120,200 L110,214 L100,226 L90,238 L80,246 L70,242 L60,234 L52,222 L45,210 L40,196 L36,182 L34,168 L36,154 L42,142 L48,132 L44,118 L40,106 L37,92 L40,78 L46,66 L52,56 L60,44 L68,32 L78,18 L85,8Z" />
      <circle cx="88" cy="190" r="4"   fill="rgba(255,255,255,0.7)" stroke="none" />
      <circle cx="44" cy="172" r="3.5" fill="rgba(255,255,255,0.6)" stroke="none" />
      <circle cx="108" cy="55" r="3"   fill="rgba(255,255,255,0.5)" stroke="none" />
      <circle cx="100" cy="22" r="2.5" fill="rgba(255,255,255,0.45)" stroke="none" />
      <circle cx="112" cy="100" r="3"  fill="rgba(255,255,255,0.5)" stroke="none" />
      <circle cx="48" cy="142" r="2.5" fill="rgba(255,255,255,0.45)" stroke="none" />
      <circle cx="130" cy="170" r="2.5" fill="rgba(255,255,255,0.4)" stroke="none" />
      <circle cx="70" cy="220" r="2.5" fill="rgba(255,255,255,0.4)" stroke="none" />
      <line x1="88" y1="190" x2="44" y2="172" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
      <line x1="88" y1="190" x2="112" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
      <line x1="112" y1="100" x2="108" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
      <line x1="108" y1="55" x2="100" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <line x1="88" y1="190" x2="130" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <line x1="44" y1="172" x2="48" y2="142" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <line x1="88" y1="190" x2="70" y2="220" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
    </svg>
  )
}

function RightPanel({ lang }) {
  return (
    <div className="auth-image-panel">
      <CameroonMap />
      <div className="auth-panel-content">
        <div className="auth-slogan">
          {lang === 'fr'
            ? <>Ensemble, innovons aujourd'hui pour un <span className="green">Cameroun</span> meilleur demain.</>
            : <>Together, let's innovate today for a better <span className="green">Cameroon</span> tomorrow.</>}
        </div>

        <div className="auth-features-grid">
          <div className="auth-feature-card">
            <div className="feature-icon"><i className="ti ti-clipboard-check" /></div>
            <span>{lang === 'fr' ? 'Planifiez' : 'Plan'}</span>
          </div>
          <div className="auth-feature-card">
            <div className="feature-icon"><i className="ti ti-chart-bar" /></div>
            <span>{lang === 'fr' ? 'Suivez' : 'Track'}</span>
          </div>
          <div className="auth-feature-card">
            <div className="feature-icon"><i className="ti ti-users-group" /></div>
            <span>{lang === 'fr' ? 'Collaborez' : 'Collaborate'}</span>
          </div>
          <div className="auth-feature-card">
            <div className="feature-icon"><i className="ti ti-shield-check" /></div>
            <span>{lang === 'fr' ? 'Sécurisez' : 'Secure'}</span>
          </div>
        </div>

        <div className="auth-secure-badge">
          <div className="badge-icon">
            <i className="ti ti-shield-check" />
          </div>
          <div>
            <strong>{lang === 'fr' ? 'Plateforme sécurisée' : 'Secure Platform'}</strong>
            <small>{lang === 'fr' ? 'Données protégées et confidentialité assurée.' : 'Protected data and guaranteed confidentiality.'}</small>
          </div>
        </div>
      </div>

      <div className="auth-bottom-bar">
        <div className="auth-bottom-item">
          <i className="ti ti-chart-dots-3" />
          <span>{lang === 'fr' ? 'Pilotage intelligent des projets' : 'Smart project management'}</span>
        </div>
        <div className="auth-bottom-item">
          <i className="ti ti-clock" />
          <span>{lang === 'fr' ? 'Suivi en temps réel des activités' : 'Real-time activity tracking'}</span>
        </div>
        <div className="auth-bottom-item">
          <i className="ti ti-file-analytics" />
          <span>{lang === 'fr' ? 'Rapports et analyses personnalisées' : 'Custom reports & analytics'}</span>
        </div>
        <div className="auth-bottom-item">
          <i className="ti ti-world" />
          <span>{lang === 'fr' ? 'Accessible partout, à tout moment' : 'Accessible anywhere, anytime'}</span>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('fr')
  const { login } = useAuth()
  const navigate = useNavigate()

  const pick = (acc) => { setEmail(acc.email); setPassword(acc.pwd); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const user = await login(email, password)
      navigate(REDIRECT[user.role] || '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'fr' ? 'Identifiants incorrects' : 'Invalid credentials'))
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      {/* ── Left Panel : Form ── */}
      <div className="auth-form-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <i className="ti ti-layers-intersect" style={{ fontSize: 24, color: '#1B4D3E' }} />
          </div>
          <div>
            <h2>Gestion des Projets</h2>
            <p>Instituts de Recherche — CMR</p>
          </div>
        </div>

        <div className="auth-header">
          <h1>{lang === 'fr' ? 'Connexion' : 'Sign In'}</h1>
          <p>{lang === 'fr'
            ? 'Accédez à votre espace de gestion des projets de recherche.'
            : 'Access your research project management workspace.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <span className="input-icon"><i className="ti ti-mail" /></span>
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder={lang === 'fr' ? 'Email professionnel' : 'Professional email'}
              autoComplete="username"
            />
          </div>

          <div className="auth-input-group">
            <span className="input-icon"><i className="ti ti-lock" /></span>
            <input
              type={showPwd ? 'text' : 'password'} value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder={lang === 'fr' ? 'Mot de passe' : 'Password'}
              autoComplete="current-password"
            />
            <button type="button" className="eye-toggle" onClick={() => setShowPwd(v => !v)}>
              <i className={`ti ti-eye${showPwd ? '-off' : ''}`} />
            </button>
          </div>

          {error && (
            <div className="auth-error-msg">
              <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 4 }}>
            <Link to="/forgot-password" style={{ fontSize: 12, color: '#1B4D3E', fontWeight: 600, textDecoration: 'none' }}>
              {lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
            </Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading || !email || !password}>
            {loading
              ? <><i className="ti ti-loader spin" />{lang === 'fr' ? 'Connexion...' : 'Signing in...'}</>
              : <><i className="ti ti-login" />{lang === 'fr' ? 'Se connecter' : 'Sign In'}</>}
          </button>
        </form>

        {/* Comptes démo */}
        <div className="auth-divider">{lang === 'fr' ? 'ou' : 'or'}</div>

        <button className="auth-demo-toggle" onClick={() => setShowDemo(v => !v)}>
          <i className={`ti ti-chevron-${showDemo ? 'up' : 'down'}`} style={{ fontSize: 14 }} />
          {lang === 'fr' ? 'Comptes de démonstration' : 'Demo accounts'}
        </button>

        {showDemo && (
          <div className="auth-demo-grid">
            {DEMO.map(acc => (
              <div
                key={acc.role}
                className={`auth-demo-item${email === acc.email ? ' active' : ''}`}
                onClick={() => pick(acc)}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${acc.clr}15`, color: acc.clr,
                  flexShrink: 0, fontSize: 15,
                }}>
                  <i className={`ti ti-${acc.icon}`} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{acc.label}</div>
                  <div style={{ fontSize: 9, color: '#9CA3AF' }}>{acc.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="auth-form-footer">
          {lang === 'fr' ? 'Pas encore de compte ? ' : "Don't have an account? "}
          <Link to="/register"><strong>{lang === 'fr' ? "S'inscrire" : 'Sign up'}</strong></Link>
        </div>
      </div>

      {/* ── Right Panel : Branding ── */}
      <RightPanel lang={lang} />
    </div>
  )
}
