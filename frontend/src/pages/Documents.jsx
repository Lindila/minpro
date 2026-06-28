import { useState, useEffect, useMemo } from 'react'
import { getProjects } from '../api/project.api'
import { useApp }  from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Card        from '../components/ui/Card.jsx'
import Badge, { DOC_VARIANT } from '../components/ui/Badge.jsx'
import Loader      from '../components/ui/Loader.jsx'
import EmptyState  from '../components/ui/EmptyState.jsx'
import { formatDate } from '../utils/formatters'

const TYPE_VARIANT = {
  rapport:   'blue',
  protocole: 'green',
  budget:    'yellow',
  contrat:   'purple',
  autre:     'gray',
}

const DOC_TYPES   = ['rapport', 'protocole', 'budget', 'contrat', 'autre']
const DOC_STATUTS = ['draft', 'pending', 'valid', 'rejete']

export default function Documents() {
  const [projects, setProjects] = useState([])
  const [search,   setSearch]   = useState('')
  const [fType,    setFType]    = useState('')
  const [fStatus,  setFStatus]  = useState('')
  const [loading,  setLoading]  = useState(true)
  const { lang } = useApp()
  const { user } = useAuth()

  const T = {
    title:        lang === 'fr' ? 'Documents'               : 'Documents',
    search:       lang === 'fr' ? 'Rechercher un document...' : 'Search document...',
    allTypes:     lang === 'fr' ? 'Tous les types'           : 'All types',
    allStatuses:  lang === 'fr' ? 'Tous les statuts'         : 'All statuses',
    docName:      lang === 'fr' ? 'Document'                 : 'Document',
    type:         lang === 'fr' ? 'Type'                     : 'Type',
    project:      lang === 'fr' ? 'Projet'                   : 'Project',
    institute:    lang === 'fr' ? 'Institut'                 : 'Institute',
    uploadedBy:   lang === 'fr' ? 'Uploadé par'             : 'Uploaded by',
    date:         lang === 'fr' ? 'Date'                     : 'Date',
    status:       lang === 'fr' ? 'Statut'                   : 'Status',
    noDoc:        lang === 'fr' ? 'Aucun document trouvé'    : 'No documents found',
    noDocSub:     lang === 'fr' ? 'Modifiez vos filtres ou ajoutez des documents aux projets' : 'Adjust filters or add documents to projects',
    total:        lang === 'fr' ? 'Total'                    : 'Total',
    pending:      lang === 'fr' ? 'En attente'               : 'Pending',
    validated:    lang === 'fr' ? 'Validés'                  : 'Validated',
    rejected:     lang === 'fr' ? 'Rejetés'                  : 'Rejected',
    docFound:     lang === 'fr' ? 'document(s) trouvé(s)'    : 'document(s) found',
  }

  const TYPE_LABEL = {
    rapport:   lang === 'fr' ? 'Rapport'   : 'Report',
    protocole: lang === 'fr' ? 'Protocole' : 'Protocol',
    budget:    lang === 'fr' ? 'Budget'    : 'Budget',
    contrat:   lang === 'fr' ? 'Contrat'   : 'Contract',
    autre:     lang === 'fr' ? 'Autre'     : 'Other',
  }

  const STATUS_LABEL = {
    draft:   lang === 'fr' ? 'Brouillon'  : 'Draft',
    pending: lang === 'fr' ? 'En attente'  : 'Pending',
    valid:   lang === 'fr' ? 'Validé'      : 'Validated',
    rejete:  lang === 'fr' ? 'Rejeté'      : 'Rejected',
  }

  useEffect(() => {
    setLoading(true)
    getProjects()
      .then(r => setProjects(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  /* Flatten all documents from all projects */
  const allDocs = useMemo(() => {
    const docs = []
    projects.forEach(p => {
      (p.documents || []).forEach(d => {
        docs.push({
          ...d,
          projectIntitule: p.intitule,
          projectCode:     p.code,
          instituteSigle:  p.institute?.sigle || '—',
        })
      })
    })
    return docs
  }, [projects])

  /* Apply client-side filters */
  const filtered = useMemo(() => {
    let list = allDocs
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(d => d.nom?.toLowerCase().includes(q))
    }
    if (fType)   list = list.filter(d => d.type === fType)
    if (fStatus) list = list.filter(d => d.statut === fStatus)
    return list
  }, [allDocs, search, fType, fStatus])

  /* Stats */
  const stats = useMemo(() => ({
    total:     allDocs.length,
    pending:   allDocs.filter(d => d.statut === 'pending').length,
    validated: allDocs.filter(d => d.statut === 'valid').length,
    rejected:  allDocs.filter(d => d.statut === 'rejete').length,
  }), [allDocs])

  const filterStyle = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', cursor: 'pointer' }

  const TH = { fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap' }

  const statCardStyle = {
    flex: 1, minWidth: 140, padding: '16px 20px', borderRadius: 12,
    background: 'white', border: '1px solid #E5E7EB',
    display: 'flex', alignItems: 'center', gap: 14,
  }

  const statIconStyle = (bg, color) => ({
    width: 40, height: 40, borderRadius: 10, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, color,
  })

  return (
    <div>
      {/* Stats cards */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={statCardStyle}>
          <div style={statIconStyle('#DBEAFE', '#2563EB')}><i className="ti ti-files" /></div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{T.total}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{stats.total}</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={statIconStyle('#FEF9C3', '#854D0E')}><i className="ti ti-clock" /></div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{T.pending}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#854D0E' }}>{stats.pending}</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={statIconStyle('#DCFCE7', '#16A34A')}><i className="ti ti-circle-check" /></div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{T.validated}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#16A34A' }}>{stats.validated}</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={statIconStyle('#FEE2E2', '#DC2626')}><i className="ti ti-x" /></div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{T.rejected}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#DC2626' }}>{stats.rejected}</div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 16, pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={T.search}
            style={{ ...filterStyle, paddingLeft: 34, width: '100%', cursor: 'text', boxSizing: 'border-box' }}
          />
        </div>
        <select value={fType} onChange={e => setFType(e.target.value)} style={{ ...filterStyle, minWidth: 160 }}>
          <option value="">{T.allTypes}</option>
          {DOC_TYPES.map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
        </select>
        <select value={fStatus} onChange={e => setFStatus(e.target.value)} style={{ ...filterStyle, minWidth: 160 }}>
          <option value="">{T.allStatuses}</option>
          {DOC_STATUTS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      {/* Count */}
      {!loading && (
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
          {filtered.length} {T.docFound}
        </div>
      )}

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[T.docName, T.type, T.project, T.institute, T.uploadedBy, T.date, T.status].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><Loader /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon="file-off" title={T.noDoc} subtitle={T.noDocSub} /></td></tr>
              ) : filtered.map((d, idx) => (
                <tr
                  key={d._id || idx}
                  style={{ borderTop: '1px solid #E5E7EB', transition: 'background .1s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Document name */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(27,77,62,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="ti ti-file-text" style={{ fontSize: 16, color: '#1B4D3E' }} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                        {d.nom}
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={TYPE_VARIANT[d.type] || 'gray'}>{TYPE_LABEL[d.type] || d.type}</Badge>
                  </td>
                  {/* Project */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{d.projectIntitule}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{d.projectCode}</div>
                  </td>
                  {/* Institute */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant="gray">{d.instituteSigle}</Badge>
                  </td>
                  {/* Uploaded by */}
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#374151' }}>
                    {d.uploadePar ? `${d.uploadePar.prenom} ${d.uploadePar.nom}` : '—'}
                  </td>
                  {/* Date */}
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {formatDate(d.createdAt)}
                  </td>
                  {/* Status */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={DOC_VARIANT[d.statut] || 'gray'}>{STATUS_LABEL[d.statut] || d.statut}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
