import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getInstitutes } from '../api/institute.api'

const ROLES = [
  { value: 'ch',   label: { fr: 'Chercheur',          en: 'Researcher' } },
  { value: 'chef', label: { fr: 'Chef de projet',     en: 'Project Manager' } },
  { value: 'dir',  label: { fr: 'Directeur Institut', en: 'Institute Director' } },
  { value: 'admin',label: { fr: 'Administrateur',     en: 'Administrator' } },
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

export default function Register() {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', password: '', confirm: '', role: 'ch', institute: '',
  })
  const [institutes, setInstitutes] = useState([])
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('fr')
  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getInstitutes().then(r => setInstitutes(r.data.data)).catch(() => {})
  }, [])

  const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.prenom || !form.nom || !form.email || !form.password) {
      setError(lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields')
      return
    }
    if (form.password.length < 4) {
      setError(lang === 'fr' ? 'Le mot de passe doit contenir au moins 4 caractères' : 'Password must be at least 4 characters')
      return
    }
    if (form.password !== form.confirm) {
      setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const user = await register({
        prenom: form.prenom, nom: form.nom, email: form.email,
        password: form.password, role: form.role,
        institute: form.institute || undefined,
      })
      navigate(REDIRECT[user.role] || '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || (lang === 'fr' ? "Erreur lors de l'inscription" : 'Registration failed'))
    } finally { setLoading(false) }
  }

  const needsInstitute = ['chef', 'dir', 'ch'].includes(form.role)

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
          <h1>{lang === 'fr' ? 'Créer un compte' : 'Create an account'}</h1>
          <p>{lang === 'fr'
            ? 'Rejoignez la plateforme pour gérer et suivre les projets de recherche efficacement.'
            : 'Join the platform to manage and track research projects efficiently.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-row">
            <div className="auth-input-group">
              <span className="input-icon"><i className="ti ti-user" /></span>
              <input value={form.prenom} onChange={set('prenom')} placeholder={lang === 'fr' ? 'Prénom' : 'First name'} />
            </div>
            <div className="auth-input-group">
              <span className="input-icon"><i className="ti ti-user" /></span>
              <input value={form.nom} onChange={set('nom')} placeholder={lang === 'fr' ? 'Nom' : 'Last name'} />
            </div>
          </div>

          <div className="auth-input-group">
            <span className="input-icon"><i className="ti ti-mail" /></span>
            <input type="email" value={form.email} onChange={set('email')} placeholder={lang === 'fr' ? 'Email professionnel' : 'Professional email'} autoComplete="email" />
          </div>

          <div className="auth-input-group">
            <span className="input-icon"><i className="ti ti-lock" /></span>
            <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder={lang === 'fr' ? 'Mot de passe' : 'Password'} autoComplete="new-password" />
            <button type="button" className="eye-toggle" onClick={() => setShowPwd(v => !v)}>
              <i className={`ti ti-eye${showPwd ? '-off' : ''}`} />
            </button>
          </div>

          <div className="auth-input-group">
            <span className="input-icon"><i className="ti ti-lock" /></span>
            <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder={lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'} autoComplete="new-password" />
            <button type="button" className="eye-toggle" onClick={() => setShowConfirm(v => !v)}>
              <i className={`ti ti-eye${showConfirm ? '-off' : ''}`} />
            </button>
          </div>

          <div className="auth-input-row">
            <div className="auth-input-group">
              <span className="input-icon"><i className="ti ti-badge" /></span>
              <select value={form.role} onChange={set('role')} className="has-value">
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label[lang]}</option>)}
              </select>
            </div>
            <div className="auth-input-group">
              <span className="input-icon"><i className="ti ti-building" /></span>
              <select value={form.institute} onChange={set('institute')} className={form.institute ? 'has-value' : ''} disabled={!needsInstitute}>
                <option value="">{lang === 'fr' ? 'Institut / Structure' : 'Institute'}</option>
                {institutes.map(i => <option key={i._id} value={i._id}>{i.sigle}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="auth-error-msg">
              <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? <><i className="ti ti-loader spin" />{lang === 'fr' ? 'Inscription...' : 'Creating...'}</>
              : <><i className="ti ti-user-plus" />{lang === 'fr' ? "S'inscrire" : 'Sign Up'}</>}
          </button>
        </form>

        <div className="auth-form-footer">
          {lang === 'fr' ? 'Vous avez déjà un compte ? ' : 'Already have an account? '}
          <Link to="/login"><strong>{lang === 'fr' ? 'Se connecter' : 'Sign in'}</strong></Link>
        </div>
      </div>

      {/* ── Right Panel : Branding ── */}
      <RightPanel lang={lang} />
    </div>
  )
}
