import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApp }  from '../../context/AppContext'

function CameroonFlag() {
  return (
    <svg viewBox="0 0 90 60" style={{ width: 32, height: 22, borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,.15)' }}>
      <rect x="0"  y="0" width="30" height="60" fill="#009B3A" />
      <rect x="30" y="0" width="30" height="60" fill="#CE1126" />
      <rect x="60" y="0" width="30" height="60" fill="#FCD116" />
      <polygon points="45,18 47.5,25 55,25 49,29.5 51,37 45,33 39,37 41,29.5 35,25 42.5,25" fill="#FCD116" />
    </svg>
  )
}

export default function Topbar({ title, alerts = [], onMenuClick }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { lang } = useApp()
  const navigate  = useNavigate()

  const initials = user ? `${user.prenom[0]}${user.nom[0]}` : '?'

  return (
    <header style={{
      position: 'sticky', top: 0, background: 'white',
      borderBottom: '1px solid #E5E7EB', height: 56,
      display: 'flex', alignItems: 'center', padding: '0 22px',
      gap: 14, zIndex: 50,
    }}>
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <i className="ti ti-menu-2" />
      </button>

      {/* Platform name + flag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <span className="topbar-platform-text" style={{ fontSize: 13, fontWeight: 600, color: '#1B4D3E', lineHeight: 1.3 }}>
          {lang === 'fr'
            ? 'Plateforme Nationale de Gestion et de Suivi des Projets des Instituts de Recherche'
            : 'National Platform for Research Institute Project Management'}
        </span>
        <CameroonFlag />
      </div>

      {/* Search */}
      <div className="topbar-search" style={{ position: 'relative', width: 220, flexShrink: 0 }}>
        <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#9CA3AF' }} />
        <input
          placeholder={lang === 'fr' ? 'Rechercher...' : 'Search...'}
          style={{ width: '100%', padding: '7px 12px 7px 34px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, outline: 'none', background: '#F9FAFB', fontFamily: 'inherit', color: '#374151' }}
        />
      </div>

      {/* Notification bell */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 7, border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', cursor: 'pointer', color: alerts.length > 0 ? '#DC2626' : '#6B7280', position: 'relative' }}
        >
          <i className="ti ti-bell" style={{ fontSize: 18 }} />
          {alerts.length > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, background: '#DC2626', borderRadius: 9, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>
              {alerts.length}
            </span>
          )}
        </button>

        {open && (
          <div style={{ position: 'absolute', right: 0, top: 46, width: 300, background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,.12)', zIndex: 60, maxHeight: 320, overflowY: 'auto' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #E5E7EB', fontSize: 12, fontWeight: 700, position: 'sticky', top: 0, background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{lang === 'fr' ? 'Alertes' : 'Alerts'} ({alerts.length})</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16 }}><i className="ti ti-x" /></button>
            </div>
            <div style={{ padding: 8 }}>
              {alerts.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>
                  <i className="ti ti-circle-check" style={{ fontSize: 30, display: 'block', marginBottom: 6, color: '#16A34A' }} />
                  {lang === 'fr' ? 'Aucune alerte' : 'No alerts'}
                </div>
              ) : alerts.map((a, i) => (
                <div
                  key={i}
                  onClick={() => { navigate(`/projects/${a.projectId}`); setOpen(false) }}
                  style={{ padding: '9px 12px', borderRadius: 9, marginBottom: 6, cursor: 'pointer', background: a.severity === 'danger' ? '#FEF2F2' : '#FFFBEB', border: `1px solid ${a.severity === 'danger' ? '#FECACA' : '#FDE68A'}`, display: 'flex', gap: 9 }}
                >
                  <i className="ti ti-alert-triangle" style={{ fontSize: 14, color: a.severity === 'danger' ? '#DC2626' : '#D97706', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{a.milestoneNom || `Budget ${a.pct}% consommé`}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.projectIntitule}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lang */}
      <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>FR</span>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(212,160,23,.2)', color: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
