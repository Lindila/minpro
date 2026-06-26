import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApp }  from '../../context/AppContext'

const NAV = [
  { key: 'dashboard',    path: '/dashboard',    icon: 'home',           roles: ['admin','chef','dir','ch'] },
  { key: 'projects',     path: '/projects',     icon: 'folder-kanban',  roles: ['admin','chef','dir','ch'] },
  { key: 'institutes',   path: '/projects',     icon: 'building',       roles: ['admin','dir'] },
  { key: 'researchers',  path: '/researchers',  icon: 'users',          roles: ['admin','chef','dir'] },
  { key: 'reports',      path: '/projects',     icon: 'file-text',      roles: ['admin','chef','dir'] },
  { key: 'finances',     path: '/projects',     icon: 'coins',          roles: ['admin','chef'] },
  { key: 'partnerships', path: '/projects',     icon: 'handshake',      roles: ['admin'] },
  { key: 'calendar',     path: '/projects',     icon: 'calendar',       roles: ['admin','chef','dir','ch'] },
  { key: 'documents',    path: '/projects',     icon: 'file-analytics', roles: ['admin','chef','dir','ch'] },
  { key: 'settings',     path: '/users',        icon: 'settings',       roles: ['admin'] },
]

export default function Sidebar({ alertCount = 0 }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()
  const { t, lang, toggleLang } = useApp()

  const navItems = NAV.filter(item => user && item.roles.includes(user.role))
  const initials = user ? `${user.prenom[0]}${user.nom[0]}` : '?'

  const isActive = (item) => {
    if (item.key === 'dashboard') return location.pathname === '/dashboard'
    if (item.key === 'projects')  return location.pathname.startsWith('/projects')
    return false
  }

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 236,
      background: '#0D2B1D', display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#D4A017', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ti ti-layers-intersect" style={{ fontSize: 20, color: 'white' }} />
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>MINRESI</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 9 }}>République du Cameroun</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <div
              key={item.key}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 9, cursor: 'pointer',
                marginBottom: 2, fontSize: 13, fontWeight: 500,
                color: active ? 'white' : 'rgba(255,255,255,.6)',
                background: active ? '#D4A017' : 'transparent',
                transition: 'all .15s', position: 'relative',
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.08)' }}
              onMouseOut={e  => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <i className={`ti ti-${item.icon}`} style={{ fontSize: 18, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{t(`nav.${item.key}`)}</span>
              {item.key === 'projects' && alertCount > 0 && (
                <span style={{ background: 'rgba(220,38,38,.35)', color: '#FCA5A5', fontSize: 10, padding: '1px 7px', borderRadius: 20, fontWeight: 600 }}>
                  {alertCount}
                </span>
              )}
            </div>
          )
        })}
      </nav>

      {/* Motivational bottom card */}
      <div style={{ margin: '0 10px 12px', padding: '16px 14px', background: 'rgba(27,77,62,.6)', borderRadius: 14, textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, margin: '0 auto 10px', borderRadius: 12, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-atom" style={{ fontSize: 22, color: '#86EFAC' }} />
        </div>
        <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 11, lineHeight: 1.5 }}>
          {lang === 'fr' ? "Innover aujourd'hui pour le Cameroun de demain" : 'Innovate today for the Cameroon of tomorrow'}
        </div>
      </div>

      {/* User footer */}
      <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,160,23,.2)', color: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.prenom} {user?.nom}
            </div>
            <div style={{ color: '#D4A017', fontSize: 10 }}>{t(`roles.${user?.role}`)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={toggleLang} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'transparent', color: 'rgba(255,255,255,.5)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button onClick={logout} style={{ flex: 2, padding: '7px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'transparent', color: 'rgba(255,255,255,.5)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <i className="ti ti-logout" style={{ fontSize: 13 }} />
            {lang === 'fr' ? 'Déconnexion' : 'Sign out'}
          </button>
        </div>
      </div>
    </aside>
  )
}
