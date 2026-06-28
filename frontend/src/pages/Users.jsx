import { useState, useEffect } from 'react'
import { getUsers, toggleUser } from '../api/user.api'
import { getInstitutes } from '../api/institute.api'
import { useAuth } from '../context/AuthContext'
import { useApp }  from '../context/AppContext'
import Card        from '../components/ui/Card.jsx'
import Badge       from '../components/ui/Badge.jsx'
import Button      from '../components/ui/Button.jsx'
import Loader      from '../components/ui/Loader.jsx'
import EmptyState  from '../components/ui/EmptyState.jsx'
import CreateUserModal from '../components/modals/CreateUserModal.jsx'
import { formatDate } from '../utils/formatters'

export default function Users() {
  const [users,      setUsers]      = useState([])
  const [institutes, setInstitutes] = useState([])
  const [search,     setSearch]     = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [loading,    setLoading]    = useState(true)
  const { isAdmin } = useAuth()
  const { lang, showToast } = useApp()

  useEffect(() => { getInstitutes().then(r => setInstitutes(r.data.data)).catch(() => {}) }, [])

  useEffect(() => {
    if (!isAdmin) return
    setLoading(true)
    getUsers({ search: search || undefined })
      .then(r => setUsers(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, isAdmin])

  if (!isAdmin) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <i className="ti ti-shield-off" style={{ fontSize: 48, color: '#9CA3AF', display: 'block', marginBottom: 12 }} />
      <div style={{ fontSize: 14, color: '#6B7280' }}>{lang === 'fr' ? 'Accès réservé aux administrateurs' : 'Admin access only'}</div>
    </div>
  )

  const ROLE_V = { dev: 'red', admin: 'purple', chef: 'green', dir: 'blue', comptable: 'yellow', ch: 'gray' }
  const ROLE_L = { dev: 'Développeur', admin: 'Admin MINRESI', chef: 'Chef de projet', dir: 'Directeur Inst.', comptable: 'Comptable', ch: 'Chercheur' }

  const TH = { fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }

  const handleToggle = async (u) => {
    try {
      const r = await toggleUser(u._id)
      setUsers(prev => prev.map(x => x._id === u._id ? r.data.data : x))
      showToast(r.data.data.actif ? (lang === 'fr' ? 'Compte activé' : 'Account activated') : (lang === 'fr' ? 'Compte désactivé' : 'Account deactivated'), r.data.data.actif ? 'success' : 'warning')
    } catch { showToast(lang === 'fr' ? 'Erreur' : 'Error', 'error') }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 16, pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'fr' ? 'Rechercher un utilisateur...' : 'Search user...'} style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <Button variant="primary" icon="user-plus" onClick={() => setShowModal(true)}>{lang === 'fr' ? 'Nouvel utilisateur' : 'New User'}</Button>
      </div>

      {!loading && <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{users.length} {lang === 'fr' ? 'utilisateur(s)' : 'user(s)'}</div>}

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[lang === 'fr' ? 'Utilisateur' : 'User', 'Rôle', 'Institut', 'Email', lang === 'fr' ? 'Dernière connexion' : 'Last Login', 'Statut', ''].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><Loader /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon="users" title={lang === 'fr' ? 'Aucun utilisateur' : 'No users'} /></td></tr>
              ) : users.map(u => (
                <tr key={u._id} style={{ borderTop: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: u.actif ? 'rgba(27,77,62,.1)' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: u.actif ? '#1B4D3E' : '#9CA3AF', flexShrink: 0 }}>
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: u.actif ? '#111827' : '#9CA3AF' }}>{u.prenom} {u.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={ROLE_V[u.role] || 'gray'}>{ROLE_L[u.role] || u.role}</Badge></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{u.institute?.sigle || <span style={{ color: '#9CA3AF' }}>—</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{u.lastLogin ? formatDate(u.lastLogin) : <span style={{ color: '#9CA3AF' }}>—</span>}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={u.actif ? 'green' : 'gray'}>{u.actif ? (lang === 'fr' ? 'Actif' : 'Active') : (lang === 'fr' ? 'Inactif' : 'Inactive')}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Button size="sm" variant={u.actif ? 'danger' : 'default'} onClick={() => handleToggle(u)}>
                      {u.actif ? (lang === 'fr' ? 'Désactiver' : 'Disable') : (lang === 'fr' ? 'Activer' : 'Enable')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        institutes={institutes}
        onCreated={(u) => { setUsers(prev => [...prev, u]); setShowModal(false); showToast(lang === 'fr' ? 'Utilisateur créé !' : 'User created!') }}
      />
    </div>
  )
}
