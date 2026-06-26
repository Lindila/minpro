import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../api/project.api'
import { getInstitutes } from '../api/institute.api'
import { useAuth } from '../context/AuthContext'
import { useApp }  from '../context/AppContext'
import CreateProjectModal from '../components/modals/CreateProjectModal.jsx'
import Card        from '../components/ui/Card.jsx'
import Badge, { STATUS_VARIANT } from '../components/ui/Badge.jsx'
import Button      from '../components/ui/Button.jsx'
import BudgetBar   from '../components/ui/BudgetBar.jsx'
import Loader      from '../components/ui/Loader.jsx'
import EmptyState  from '../components/ui/EmptyState.jsx'
import { formatDate, budgetPercent } from '../utils/formatters'
import { STATUSES } from '../utils/constants'

export default function Projects() {
  const [projects,   setProjects]   = useState([])
  const [institutes, setInstitutes] = useState([])
  const [search,     setSearch]     = useState('')
  const [fInst,      setFInst]      = useState('')
  const [fStat,      setFStat]      = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [loading,    setLoading]    = useState(true)
  const { canCreate } = useAuth()
  const { lang, showToast } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    getInstitutes().then(r => setInstitutes(r.data.data)).catch(() => {})
  }, [])

  const fetchProjects = useCallback(() => {
    setLoading(true)
    getProjects({ search: search || undefined, institute: fInst || undefined, statut: fStat || undefined })
      .then(r => setProjects(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, fInst, fStat])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const SL = {
    'En préparation': lang === 'fr' ? 'En préparation' : 'In Preparation',
    'En cours':       lang === 'fr' ? 'En cours'       : 'Active',
    'Suspendu':       lang === 'fr' ? 'Suspendu'       : 'Suspended',
    'Clôturé':        lang === 'fr' ? 'Clôturé'        : 'Closed',
    'Archivé':        lang === 'fr' ? 'Archivé'        : 'Archived',
  }

  const overdueMs = (p) => p.milestones?.filter(m => m.statut !== 'done' && new Date(m.datePrevue) < new Date()).length || 0

  const filterStyle = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', cursor: 'pointer' }

  const TH = { fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap' }

  return (
    <div>
      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 16, pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher un projet...' : 'Search project...'}
            style={{ ...filterStyle, paddingLeft: 34, width: '100%', cursor: 'text', boxSizing: 'border-box' }}
          />
        </div>
        <select value={fInst} onChange={e => setFInst(e.target.value)} style={{ ...filterStyle, minWidth: 160 }}>
          <option value="">{lang === 'fr' ? 'Tous les instituts' : 'All institutes'}</option>
          {institutes.map(i => <option key={i._id} value={i._id}>{i.sigle}</option>)}
        </select>
        <select value={fStat} onChange={e => setFStat(e.target.value)} style={{ ...filterStyle, minWidth: 160 }}>
          <option value="">{lang === 'fr' ? 'Tous les statuts' : 'All statuses'}</option>
          {STATUSES.map(s => <option key={s} value={s}>{SL[s]}</option>)}
        </select>
        {canCreate && (
          <Button variant="primary" icon="folder-plus" onClick={() => setShowModal(true)}>
            {lang === 'fr' ? 'Nouveau projet' : 'New Project'}
          </Button>
        )}
      </div>

      {/* Count */}
      {!loading && (
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
          {projects.length} {lang === 'fr' ? 'projet(s) trouvé(s)' : 'project(s) found'}
        </div>
      )}

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[
                  lang === 'fr' ? 'Projet' : 'Project',
                  'Institut',
                  'Statut',
                  lang === 'fr' ? 'Consommation budget' : 'Budget usage',
                  lang === 'fr' ? 'Chef de projet' : 'Project Manager',
                  lang === 'fr' ? 'Fin prévue' : 'End Date',
                ].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><Loader /></td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="folder-off" title={lang === 'fr' ? 'Aucun projet trouvé' : 'No projects found'} subtitle={lang === 'fr' ? 'Modifiez vos filtres ou créez un nouveau projet' : 'Adjust filters or create a project'} /></td></tr>
              ) : projects.map(p => {
                const pct  = budgetPercent(p)
                const late = overdueMs(p)
                return (
                  <tr
                    key={p._id}
                    onClick={() => navigate(`/projects/${p._id}`)}
                    style={{ borderTop: '1px solid #E5E7EB', cursor: 'pointer', transition: 'background .1s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Projet */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(27,77,62,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="ti ti-folder" style={{ fontSize: 18, color: '#1B4D3E' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{p.intitule}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.code} · {p.domaine}</div>
                          {late > 0 && (
                            <div style={{ fontSize: 10, color: '#DC2626', marginTop: 2 }}>
                              <i className="ti ti-alert-triangle" style={{ fontSize: 10 }} /> {late} {lang === 'fr' ? 'jalon(s) en retard' : 'overdue milestone(s)'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Institut */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant="gray">{p.institute?.sigle || '—'}</Badge>
                    </td>
                    {/* Statut */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={STATUS_VARIANT[p.statut] || 'gray'}>{SL[p.statut] || p.statut}</Badge>
                    </td>
                    {/* Budget */}
                    <td style={{ padding: '12px 16px', width: 140 }}>
                      <BudgetBar pct={pct} />
                      <div style={{ fontSize: 11, color: pct >= 90 ? '#DC2626' : '#6B7280', marginTop: 3, fontWeight: pct >= 90 ? 600 : 400 }}>{pct}%</div>
                    </td>
                    {/* Chef */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#374151' }}>
                      {p.chefProjet ? `${p.chefProjet.prenom} ${p.chefProjet.nom}` : '—'}
                    </td>
                    {/* Fin */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>
                      {formatDate(p.dateFin)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        institutes={institutes}
        onCreated={(p) => {
          setProjects(prev => [p, ...prev])
          showToast(lang === 'fr' ? 'Projet créé avec succès !' : 'Project created successfully!')
          setShowModal(false)
        }}
      />
    </div>
  )
}
