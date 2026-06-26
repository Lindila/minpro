import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, validateDoc, rejectDoc, deleteMilestone, deleteExpense } from '../api/project.api'
import { useAuth } from '../context/AuthContext'
import { useApp }  from '../context/AppContext'
import Button      from '../components/ui/Button.jsx'
import Card        from '../components/ui/Card.jsx'
import Badge, { STATUS_VARIANT, MS_VARIANT, DOC_VARIANT } from '../components/ui/Badge.jsx'
import BudgetBar   from '../components/ui/BudgetBar.jsx'
import Loader      from '../components/ui/Loader.jsx'
import AddMilestoneModal from '../components/modals/AddMilestoneModal.jsx'
import AddExpenseModal   from '../components/modals/AddExpenseModal.jsx'
import AddDocumentModal  from '../components/modals/AddDocumentModal.jsx'
import { formatDate, formatMoney, budgetPercent } from '../utils/formatters'
import { getMilestoneStatus, daysUntil } from '../utils/dateUtils'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canCreate, canValidate } = useAuth()
  const { lang, showToast } = useApp()

  const [project,   setProject]   = useState(null)
  const [tab,       setTab]       = useState('info')
  const [loading,   setLoading]   = useState(true)
  const [msModal,   setMsModal]   = useState(null) // null | 'add' | milestone object
  const [expModal,  setExpModal]  = useState(false)
  const [docModal,  setDocModal]  = useState(false)

  const fetchProject = useCallback(() => {
    setLoading(true)
    getProject(id)
      .then(r => setProject(r.data.data))
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  useEffect(() => { fetchProject() }, [fetchProject])

  if (loading || !project) return <Loader />

  const pct = budgetPercent(project)

  const SL = {
    'En préparation': lang === 'fr' ? 'En préparation' : 'In Preparation',
    'En cours':       lang === 'fr' ? 'En cours'       : 'Active',
    'Suspendu':       lang === 'fr' ? 'Suspendu'       : 'Suspended',
    'Clôturé':        lang === 'fr' ? 'Clôturé'        : 'Closed',
    'Archivé':        lang === 'fr' ? 'Archivé'        : 'Archived',
  }

  const TABS = [
    { key: 'info',       label: lang === 'fr' ? 'Informations'  : 'Information', icon: 'info-circle'  },
    { key: 'milestones', label: lang === 'fr' ? 'Jalons'        : 'Milestones',  icon: 'flag'         },
    { key: 'budget',     label: lang === 'fr' ? 'Budget'        : 'Budget',      icon: 'coins'        },
    { key: 'docs',       label: lang === 'fr' ? 'Documents'     : 'Documents',   icon: 'files'        },
  ]

  // ── Tab: Info ───────────────────────────────────────────
  const InfoTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <Card padding={18}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>{lang === 'fr' ? 'Général' : 'General'}</h4>
        {[
          { l: lang === 'fr' ? 'Code' : 'Code',           v: project.code },
          { l: lang === 'fr' ? 'Domaine' : 'Domain',      v: project.domaine },
          { l: 'Institut',                                 v: `${project.institute?.sigle} — ${project.institute?.nom}` },
          { l: lang === 'fr' ? 'Chef de projet' : 'PM',   v: project.chefProjet ? `${project.chefProjet.prenom} ${project.chefProjet.nom}` : '—' },
          { l: lang === 'fr' ? 'Début' : 'Start',         v: formatDate(project.dateDebut) },
          { l: lang === 'fr' ? 'Fin prévue' : 'End Date', v: formatDate(project.dateFin) },
        ].map(({ l, v }) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{l}</span>
            <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
          </div>
        ))}
      </Card>
      <Card padding={18}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>{lang === 'fr' ? 'Financement' : 'Funding'}</h4>
        {[
          { l: lang === 'fr' ? 'Budget initial'   : 'Initial Budget',  v: formatMoney(project.budgetInitial) },
          { l: lang === 'fr' ? 'Dépenses'         : 'Spent',           v: formatMoney(project.budgetDepense) },
          { l: lang === 'fr' ? 'Restant'          : 'Remaining',       v: formatMoney(project.budgetInitial - project.budgetDepense) },
          { l: lang === 'fr' ? 'Consommation'     : 'Consumption',     v: `${pct}%` },
        ].map(({ l, v }) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{l}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: l.includes('Cons') || l.includes('Consomm') ? (pct >= 90 ? '#DC2626' : '#111827') : '#111827' }}>{v}</span>
          </div>
        ))}
        <BudgetBar pct={pct} height={8} />
        {project.bailleurs?.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>{lang === 'fr' ? 'Bailleurs' : 'Funders'}</div>
            {project.bailleurs.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0' }}>
                <span style={{ fontWeight: 500 }}>{b.source}</span>
                <span style={{ color: '#6B7280' }}>{formatMoney(b.montant)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      {project.description && (
        <Card padding={18} style={{ gridColumn: 'span 2' }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>Description</h4>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0 }}>{project.description}</p>
        </Card>
      )}
    </div>
  )

  // ── Tab: Jalons ─────────────────────────────────────────
  const MilestoneTab = () => {
    const msStatus = { done: { fr: 'Complété', en: 'Completed' }, pending: { fr: 'En cours', en: 'In Progress' }, late: { fr: 'En retard', en: 'Overdue' } }
    return (
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{project.milestones?.length || 0} {lang === 'fr' ? 'jalon(s)' : 'milestone(s)'}</span>
          {canCreate && <Button variant="primary" size="sm" icon="plus" onClick={() => setMsModal('add')}>{lang === 'fr' ? 'Ajouter' : 'Add'}</Button>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {[lang === 'fr' ? 'Jalon' : 'Milestone', lang === 'fr' ? 'Date prévue' : 'Due Date', 'Statut', lang === 'fr' ? 'Délai' : 'Timeline', ''].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', padding: '9px 16px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!project.milestones?.length ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>
                {lang === 'fr' ? 'Aucun jalon défini' : 'No milestones defined'}
              </td></tr>
            ) : project.milestones.map(m => {
              const st    = getMilestoneStatus(m)
              const days  = daysUntil(m.datePrevue)
              const dLabel = m.statut === 'done' ? (m.dateReelle ? formatDate(m.dateReelle) : '—') : (days !== null && days < 0 ? `${Math.abs(days)}j retard` : days !== null ? `J-${days}` : '—')
              return (
                <tr key={m._id} style={{ borderTop: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{m.nom}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(m.datePrevue)}</td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={MS_VARIANT[st]}>{msStatus[st]?.[lang === 'fr' ? 'fr' : 'en'] || st}</Badge></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: st === 'late' ? '#DC2626' : '#6B7280', fontWeight: st === 'late' ? 600 : 400 }}>{dLabel}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {canCreate && <Button size="sm" variant="ghost" icon="pencil" onClick={() => setMsModal(m)} />}
                      {canCreate && <Button size="sm" variant="danger" icon="trash" onClick={async () => { if (!window.confirm(lang === 'fr' ? 'Supprimer ce jalon ?' : 'Delete milestone?')) return; const r = await deleteMilestone(id, m._id); setProject(p => ({ ...p, milestones: r.data.data })); showToast(lang === 'fr' ? 'Jalon supprimé' : 'Milestone deleted') }} />}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    )
  }

  // ── Tab: Budget ─────────────────────────────────────────
  const BudgetTab = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 14 }}>
        {[
          { l: lang === 'fr' ? 'Budget initial' : 'Initial Budget', v: formatMoney(project.budgetInitial), c: '#111827' },
          { l: lang === 'fr' ? 'Dépenses totales' : 'Total Expenses', v: formatMoney(project.budgetDepense), c: pct >= 90 ? '#DC2626' : '#111827' },
          { l: lang === 'fr' ? 'Budget restant' : 'Remaining', v: formatMoney(project.budgetInitial - project.budgetDepense), c: project.budgetDepense > project.budgetInitial ? '#DC2626' : '#16A34A' },
        ].map(({ l, v, c }) => (
          <Card key={l} padding={16} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 6 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
            {l.includes('initial') || l.includes('Initial') ? <BudgetBar pct={pct} style={{ marginTop: 10 }} /> : null}
          </Card>
        ))}
      </div>
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{project.depenses?.length || 0} {lang === 'fr' ? 'dépense(s)' : 'expense(s)'}</span>
          {canCreate && <Button variant="primary" size="sm" icon="plus" onClick={() => setExpModal(true)}>{lang === 'fr' ? 'Ajouter' : 'Add'}</Button>}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {['Catégorie','Montant','Date','Description',''].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', padding: '9px 16px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!project.depenses?.length ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>{lang === 'fr' ? 'Aucune dépense saisie' : 'No expenses recorded'}</td></tr>
            ) : project.depenses.map(d => (
              <tr key={d._id} style={{ borderTop: '1px solid #E5E7EB' }}>
                <td style={{ padding: '11px 16px' }}><Badge variant="blue">{d.categorie}</Badge></td>
                <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700 }}>{formatMoney(d.montant)}</td>
                <td style={{ padding: '11px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(d.date)}</td>
                <td style={{ padding: '11px 16px', fontSize: 12, color: '#374151' }}>{d.description || '—'}</td>
                <td style={{ padding: '11px 16px' }}>
                  {canCreate && <Button size="sm" variant="danger" icon="trash" onClick={async () => { if (!window.confirm(lang === 'fr' ? 'Supprimer cette dépense ?' : 'Delete expense?')) return; const r = await deleteExpense(id, d._id); setProject(p => ({ ...p, depenses: r.data.data, budgetDepense: r.data.budgetDepense })); showToast(lang === 'fr' ? 'Dépense supprimée' : 'Expense deleted') }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )

  // ── Tab: Documents ──────────────────────────────────────
  const DocsTab = () => {
    const DSL = { valid: lang === 'fr' ? 'Validé' : 'Validated', pending: lang === 'fr' ? 'En attente' : 'Pending', draft: 'Brouillon', rejete: lang === 'fr' ? 'Rejeté' : 'Rejected' }
    const DOC_ICONS = { rapport: 'file-text', protocole: 'flask', budget: 'coins', contrat: 'contract', autre: 'file' }
    return (
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{project.documents?.length || 0} {lang === 'fr' ? 'document(s)' : 'document(s)'}</span>
          <Button variant="primary" size="sm" icon="file-upload" onClick={() => setDocModal(true)}>{lang === 'fr' ? 'Déposer' : 'Upload'}</Button>
        </div>
        <div style={{ padding: 16 }}>
          {!project.documents?.length ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>{lang === 'fr' ? 'Aucun document' : 'No documents'}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {project.documents.map(doc => (
                <div key={doc._id} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(27,77,62,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ti-${DOC_ICONS[doc.type] || 'file'}`} style={{ fontSize: 20, color: '#1B4D3E' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.nom}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6 }}>{doc.type} · {formatDate(doc.createdAt)}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Badge variant={DOC_VARIANT[doc.statut] || 'gray'} style={{ fontSize: 10 }}>{DSL[doc.statut] || doc.statut}</Badge>
                      {canValidate && doc.statut === 'pending' && (
                        <>
                          <button onClick={async () => { const r = await validateDoc(id, doc._id); setProject(p => ({ ...p, documents: r.data.data })); showToast(lang === 'fr' ? 'Document validé' : 'Document validated') }} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#DCFCE7', color: '#166534', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            ✓ {lang === 'fr' ? 'Valider' : 'Validate'}
                          </button>
                          <button onClick={async () => { const r = await rejectDoc(id, doc._id, {}); setProject(p => ({ ...p, documents: r.data.data })); showToast(lang === 'fr' ? 'Document rejeté' : 'Rejected', 'warning') }} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#FEE2E2', color: '#991B1B', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                            ✗ {lang === 'fr' ? 'Rejeter' : 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    )
  }

  const TAB_CONTENT = { info: <InfoTab />, milestones: <MilestoneTab />, budget: <BudgetTab />, docs: <DocsTab /> }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 18 }}>
        <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => navigate('/projects')}>
          {lang === 'fr' ? 'Retour' : 'Back'}
        </Button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>{project.intitule}</h2>
            <Badge variant="gray" style={{ fontSize: 11 }}>{project.code}</Badge>
            <Badge variant={STATUS_VARIANT[project.statut] || 'gray'} style={{ fontSize: 11 }}>
              {SL[project.statut] || project.statut}
            </Badge>
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
            {project.institute?.sigle} · {project.domaine} · {lang === 'fr' ? 'Budget' : 'Budget'}: {formatMoney(project.budgetInitial)} · {pct}% {lang === 'fr' ? 'consommé' : 'spent'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'white', padding: 4, borderRadius: 11, border: '1px solid #E5E7EB', width: 'fit-content' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, transition: 'all .15s', background: tab === t.key ? '#1B4D3E' : 'transparent', color: tab === t.key ? 'white' : '#6B7280' }}
          >
            <i className={`ti ti-${t.icon}`} style={{ fontSize: 15 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {TAB_CONTENT[tab]}

      {/* Modals */}
      <AddMilestoneModal
        isOpen={!!msModal}
        onClose={() => setMsModal(null)}
        projectId={id}
        milestone={msModal !== 'add' ? msModal : null}
        onSaved={(data) => { setProject(p => ({ ...p, milestones: data })); setMsModal(null); showToast(lang === 'fr' ? 'Jalon enregistré !' : 'Milestone saved!') }}
      />
      <AddExpenseModal
        isOpen={expModal}
        onClose={() => setExpModal(false)}
        projectId={id}
        onSaved={({ data, budgetDepense }) => { setProject(p => ({ ...p, depenses: data, budgetDepense })); setExpModal(false); showToast(lang === 'fr' ? 'Dépense enregistrée !' : 'Expense saved!') }}
      />
      <AddDocumentModal
        isOpen={docModal}
        onClose={() => setDocModal(false)}
        projectId={id}
        onSaved={(data) => { setProject(p => ({ ...p, documents: data })); setDocModal(false); showToast(lang === 'fr' ? 'Document déposé !' : 'Document uploaded!') }}
      />
    </div>
  )
}
