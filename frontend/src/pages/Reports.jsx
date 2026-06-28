import { useState, useEffect } from 'react'
import { getStats, getProjects } from '../api/project.api'
import { getInstitutes } from '../api/institute.api'
import { useApp }  from '../context/AppContext'
import Card        from '../components/ui/Card.jsx'
import Badge       from '../components/ui/Badge.jsx'
import Loader      from '../components/ui/Loader.jsx'
import BarChart    from '../components/charts/BarChart.jsx'
import { formatMoney } from '../utils/formatters'
import { DOMAINS, STATUSES } from '../utils/constants'

/* ── colour palette ── */
const STATUS_COLORS = {
  'En préparation': '#3B82F6',
  'En cours':       '#16A34A',
  'Suspendu':       '#D97706',
  'Clôturé':        '#6B7280',
  'Archivé':        '#9CA3AF',
}
const STATUS_BG = {
  'En préparation': '#DBEAFE',
  'En cours':       '#DCFCE7',
  'Suspendu':       '#FEF3C7',
  'Clôturé':        '#F3F4F6',
  'Archivé':        '#F3F4F6',
}

const SL = (s, lang) => {
  const map = {
    'En préparation': lang === 'fr' ? 'En préparation' : 'In Preparation',
    'En cours':       lang === 'fr' ? 'En cours'       : 'Active',
    'Suspendu':       lang === 'fr' ? 'Suspendu'       : 'Suspended',
    'Clôturé':        lang === 'fr' ? 'Clôturé'        : 'Closed',
    'Archivé':        lang === 'fr' ? 'Archivé'        : 'Archived',
  }
  return map[s] || s
}

/* ── styles ── */
const wrap      = { maxWidth: 1200, margin: '0 auto' }
const section   = { marginBottom: 28 }
const sectionTitle = { fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }
const grid4     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }
const kpiCard   = { textAlign: 'center', padding: 20 }
const kpiValue  = { fontSize: 28, fontWeight: 800, color: '#1B4D3E', lineHeight: 1.1 }
const kpiLabel  = { fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: 500 }
const thStyle   = { fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap' }
const tdStyle   = { padding: '10px 14px', fontSize: 13, borderBottom: '1px solid #F3F4F6', color: '#374151' }
const tdMuted   = { ...tdStyle, color: '#9CA3AF' }
const tdRight   = { ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }

export default function Reports() {
  const [stats,      setStats]      = useState(null)
  const [projects,   setProjects]   = useState([])
  const [institutes, setInstitutes] = useState([])
  const [loading,    setLoading]    = useState(true)
  const { lang } = useApp()

  useEffect(() => {
    Promise.all([getStats(), getProjects(), getInstitutes()])
      .then(([s, p, inst]) => {
        setStats(s.data.data)
        setProjects(p.data.data)
        setInstitutes(inst.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label={lang === 'fr' ? 'Chargement des rapports...' : 'Loading reports...'} />

  /* ── derived data ── */
  const total          = stats?.total || 0
  const enCours        = stats?.enCours || 0
  const enPrep         = stats?.enPrep || 0
  const clotures       = stats?.clotures || 0
  const jalonsEnRetard = stats?.jalonsEnRetard || 0
  const rapportsEnAttente = stats?.rapportsEnAttente || 0

  /* projects by domain */
  const byDomain = {}
  projects.forEach(p => {
    const d = p.domaine || (lang === 'fr' ? 'Non spécifié' : 'Unspecified')
    byDomain[d] = (byDomain[d] || 0) + 1
  })

  /* projects by status */
  const byStatus = {}
  STATUSES.forEach(s => { byStatus[s] = 0 })
  projects.forEach(p => { if (p.statut) byStatus[p.statut] = (byStatus[p.statut] || 0) + 1 })
  const maxStatus = Math.max(...Object.values(byStatus), 1)

  /* budget summary by institute */
  const instMap = {}
  projects.forEach(p => {
    const key = p.institute?.sigle || p.institute?.nom || (lang === 'fr' ? 'Non rattaché' : 'Unassigned')
    if (!instMap[key]) instMap[key] = { count: 0, budget: 0, spent: 0 }
    instMap[key].count  += 1
    instMap[key].budget += p.budgetInitial || 0
    instMap[key].spent  += p.budgetDepense || 0
  })
  const budgetRows = Object.entries(instMap).sort((a, b) => b[1].budget - a[1].budget)
  const grandBudget = budgetRows.reduce((s, [, v]) => s + v.budget, 0)
  const grandSpent  = budgetRows.reduce((s, [, v]) => s + v.spent,  0)

  return (
    <div style={wrap}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1B4D3E', margin: 0 }}>
          <i className="ti ti-report-analytics" style={{ marginRight: 8, opacity: .7 }} />
          {lang === 'fr' ? 'Rapports & Analytiques' : 'Reports & Analytics'}
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
          {lang === 'fr'
            ? 'Vue consolidée de l\'activité des projets de recherche MINRESI.'
            : 'Consolidated view of MINRESI research project activity.'}
        </p>
      </div>

      {/* ══════════════════════════════════════════
          1. Summary KPI Cards
         ══════════════════════════════════════════ */}
      <div style={section}>
        <div style={sectionTitle}>
          <i className="ti ti-chart-dots-3" style={{ color: '#1B4D3E' }} />
          {lang === 'fr' ? 'Indicateurs clés' : 'Key Indicators'}
        </div>
        <div style={grid4}>
          <Card style={kpiCard}>
            <div style={kpiValue}>{total}</div>
            <div style={kpiLabel}>{lang === 'fr' ? 'Projets enregistrés' : 'Total Projects'}</div>
          </Card>
          <Card style={kpiCard}>
            <div style={{ ...kpiValue, color: '#16A34A' }}>{enCours}</div>
            <div style={kpiLabel}>{lang === 'fr' ? 'En cours' : 'Active'}</div>
          </Card>
          <Card style={kpiCard}>
            <div style={{ ...kpiValue, color: '#3B82F6' }}>{enPrep}</div>
            <div style={kpiLabel}>{lang === 'fr' ? 'En préparation' : 'In Preparation'}</div>
          </Card>
          <Card style={kpiCard}>
            <div style={{ ...kpiValue, color: '#6B7280' }}>{clotures}</div>
            <div style={kpiLabel}>{lang === 'fr' ? 'Clôturés' : 'Completed'}</div>
          </Card>
          <Card style={kpiCard}>
            <div style={{ ...kpiValue, color: '#DC2626' }}>{jalonsEnRetard}</div>
            <div style={kpiLabel}>{lang === 'fr' ? 'Jalons en retard' : 'Overdue Milestones'}</div>
          </Card>
          <Card style={kpiCard}>
            <div style={{ ...kpiValue, color: '#D97706' }}>{rapportsEnAttente}</div>
            <div style={kpiLabel}>{lang === 'fr' ? 'Documents en attente' : 'Pending Documents'}</div>
          </Card>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          2. Projects by Domain
         ══════════════════════════════════════════ */}
      <div style={section}>
        <div style={sectionTitle}>
          <i className="ti ti-category" style={{ color: '#1B4D3E' }} />
          {lang === 'fr' ? 'Projets par domaine' : 'Projects by Domain'}
        </div>
        <Card>
          {Object.keys(byDomain).length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#9CA3AF', fontSize: 13 }}>
              {lang === 'fr' ? 'Aucune donnée disponible' : 'No data available'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(byDomain)
                .sort((a, b) => b[1] - a[1])
                .map(([domain, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 140, fontSize: 13, fontWeight: 500, color: '#374151', flexShrink: 0 }}>{domain}</span>
                      <div style={{ flex: 1, height: 22, background: '#F3F4F6', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <div style={{
                          width: `${pct}%`, minWidth: count > 0 ? 24 : 0, height: '100%',
                          background: 'linear-gradient(90deg, #1B4D3E, #2D7A5F)',
                          borderRadius: 6, transition: 'width .6s cubic-bezier(.16,1,.3,1)',
                        }} />
                      </div>
                      <span style={{ width: 60, fontSize: 13, fontWeight: 600, color: '#1B4D3E', textAlign: 'right' }}>
                        {count} <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>({pct}%)</span>
                      </span>
                    </div>
                  )
                })}
            </div>
          )}
        </Card>
      </div>

      {/* ══════════════════════════════════════════
          3. Projects by Institute (BarChart)
         ══════════════════════════════════════════ */}
      <div style={section}>
        <div style={sectionTitle}>
          <i className="ti ti-building" style={{ color: '#1B4D3E' }} />
          {lang === 'fr' ? 'Projets par institut' : 'Projects by Institute'}
        </div>
        <Card style={{ padding: 20 }}>
          <div style={{ height: 280 }}>
            <BarChart byInstitute={stats?.byInstitute || {}} lang={lang} />
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════
          4. Projects by Status
         ══════════════════════════════════════════ */}
      <div style={section}>
        <div style={sectionTitle}>
          <i className="ti ti-list-check" style={{ color: '#1B4D3E' }} />
          {lang === 'fr' ? 'Répartition par statut' : 'Breakdown by Status'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
          {STATUSES.map(status => {
            const count = byStatus[status] || 0
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <Card key={status} style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
                {/* coloured accent bar at top */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: STATUS_COLORS[status],
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Badge variant={
                    status === 'En cours' ? 'green'
                    : status === 'En préparation' ? 'blue'
                    : status === 'Suspendu' ? 'yellow'
                    : 'gray'
                  }>
                    {SL(status, lang)}
                  </Badge>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{pct}%</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: STATUS_COLORS[status], marginBottom: 6 }}>{count}</div>
                {/* mini progress bar */}
                <div style={{ height: 5, background: STATUS_BG[status], borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${maxStatus > 0 ? (count / maxStatus) * 100 : 0}%`,
                    height: '100%', background: STATUS_COLORS[status], borderRadius: 3,
                    transition: 'width .6s cubic-bezier(.16,1,.3,1)',
                  }} />
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          5. Budget Summary by Institute
         ══════════════════════════════════════════ */}
      <div style={section}>
        <div style={sectionTitle}>
          <i className="ti ti-wallet" style={{ color: '#1B4D3E' }} />
          {lang === 'fr' ? 'Synthèse budgétaire par institut' : 'Budget Summary by Institute'}
        </div>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>{lang === 'fr' ? 'Institut' : 'Institute'}</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>{lang === 'fr' ? 'Projets' : 'Projects'}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>{lang === 'fr' ? 'Budget total' : 'Total Budget'}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>{lang === 'fr' ? 'Montant dépensé' : 'Total Spent'}</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>% {lang === 'fr' ? 'consommé' : 'consumed'}</th>
                  <th style={{ ...thStyle, width: 140 }}>{lang === 'fr' ? 'Progression' : 'Progress'}</th>
                </tr>
              </thead>
              <tbody>
                {budgetRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#9CA3AF', padding: 32 }}>
                      {lang === 'fr' ? 'Aucune donnée budgétaire' : 'No budget data'}
                    </td>
                  </tr>
                ) : budgetRows.map(([name, v]) => {
                  const pct = v.budget > 0 ? Math.round((v.spent / v.budget) * 100) : 0
                  const barColor = pct >= 90 ? '#DC2626' : pct >= 70 ? '#D97706' : '#16A34A'
                  return (
                    <tr key={name}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{name}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{v.count}</td>
                      <td style={tdRight}>{formatMoney(v.budget)}</td>
                      <td style={tdRight}>{formatMoney(v.spent)}</td>
                      <td style={{ ...tdRight, color: barColor, fontWeight: 600 }}>{pct}%</td>
                      <td style={tdStyle}>
                        <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${pct}%`, height: '100%',
                            background: barColor, borderRadius: 3,
                            transition: 'width .6s cubic-bezier(.16,1,.3,1)',
                          }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {budgetRows.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#F9FAFB' }}>
                    <td style={{ ...tdStyle, fontWeight: 700, borderTop: '2px solid #E5E7EB' }}>
                      {lang === 'fr' ? 'Total général' : 'Grand Total'}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, borderTop: '2px solid #E5E7EB' }}>
                      {projects.length}
                    </td>
                    <td style={{ ...tdRight, fontWeight: 700, borderTop: '2px solid #E5E7EB' }}>
                      {formatMoney(grandBudget)}
                    </td>
                    <td style={{ ...tdRight, fontWeight: 700, borderTop: '2px solid #E5E7EB' }}>
                      {formatMoney(grandSpent)}
                    </td>
                    <td style={{
                      ...tdRight, fontWeight: 700, borderTop: '2px solid #E5E7EB',
                      color: grandBudget > 0
                        ? (Math.round((grandSpent / grandBudget) * 100) >= 90 ? '#DC2626' : Math.round((grandSpent / grandBudget) * 100) >= 70 ? '#D97706' : '#16A34A')
                        : '#6B7280',
                    }}>
                      {grandBudget > 0 ? Math.round((grandSpent / grandBudget) * 100) : 0}%
                    </td>
                    <td style={{ ...tdStyle, borderTop: '2px solid #E5E7EB' }}>
                      <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${grandBudget > 0 ? Math.round((grandSpent / grandBudget) * 100) : 0}%`,
                          height: '100%', borderRadius: 3,
                          background: grandBudget > 0
                            ? (Math.round((grandSpent / grandBudget) * 100) >= 90 ? '#DC2626' : Math.round((grandSpent / grandBudget) * 100) >= 70 ? '#D97706' : '#16A34A')
                            : '#E5E7EB',
                          transition: 'width .6s cubic-bezier(.16,1,.3,1)',
                        }} />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
