import { useState, useEffect } from 'react'
import { getProjects } from '../api/project.api'
import { useApp }  from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Card       from '../components/ui/Card.jsx'
import Badge      from '../components/ui/Badge.jsx'
import BudgetBar  from '../components/ui/BudgetBar.jsx'
import Loader     from '../components/ui/Loader.jsx'
import { formatMoney, budgetColor, budgetPercent } from '../utils/formatters'

const CATEGORIES = [
  'Personnel',
  'Équipement',
  'Transport',
  'Réactifs',
  'Formation',
  'Logiciels',
  'Matières premières',
  'Divers',
]

const CAT_EN = {
  'Personnel':         'Personnel',
  'Équipement':        'Equipment',
  'Transport':         'Transport',
  'Réactifs':          'Reagents',
  'Formation':         'Training',
  'Logiciels':         'Software',
  'Matières premières':'Raw Materials',
  'Divers':            'Miscellaneous',
}

const CAT_ICONS = {
  'Personnel':         'users',
  'Équipement':        'device-desktop',
  'Transport':         'car',
  'Réactifs':          'flask',
  'Formation':         'school',
  'Logiciels':         'code',
  'Matières premières':'package',
  'Divers':            'dots',
}

const CAT_COLORS = {
  'Personnel':         '#2563EB',
  'Équipement':        '#7C3AED',
  'Transport':         '#D97706',
  'Réactifs':          '#DC2626',
  'Formation':         '#16A34A',
  'Logiciels':         '#0891B2',
  'Matières premières':'#9333EA',
  'Divers':            '#6B7280',
}

export default function Finances() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const { lang } = useApp()
  const { user }  = useAuth()

  useEffect(() => {
    getProjects()
      .then(r => setProjects(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label={lang === 'fr' ? 'Chargement des finances...' : 'Loading finances...'} />

  /* ── Aggregated totals ── */
  const totalBudget   = projects.reduce((s, p) => s + (p.budgetInitial || 0), 0)
  const totalSpent    = projects.reduce((s, p) => s + (p.budgetDepense || 0), 0)
  const totalRemain   = totalBudget - totalSpent
  const avgPct        = projects.length > 0
    ? Math.round(projects.reduce((s, p) => s + budgetPercent(p), 0) / projects.length)
    : 0

  /* ── Category breakdown ── */
  const catTotals = {}
  CATEGORIES.forEach(c => { catTotals[c] = 0 })
  projects.forEach(p => {
    (p.depenses || []).forEach(d => {
      if (catTotals[d.categorie] !== undefined) {
        catTotals[d.categorie] += d.montant || 0
      }
    })
  })
  const catMax = Math.max(...Object.values(catTotals), 1)

  /* ── Styles ── */
  const TH = {
    fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase',
    letterSpacing: '.5px', padding: '10px 16px', textAlign: 'left',
    borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', whiteSpace: 'nowrap',
  }

  const summaryCards = [
    {
      icon: 'wallet',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
      label: lang === 'fr' ? 'Budget total' : 'Total Budget',
      value: formatMoney(totalBudget),
    },
    {
      icon: 'credit-card',
      iconBg: '#FEF9C3',
      iconColor: '#854D0E',
      label: lang === 'fr' ? 'Total dépensé' : 'Total Spent',
      value: formatMoney(totalSpent),
    },
    {
      icon: 'piggy-bank',
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      label: lang === 'fr' ? 'Solde restant' : 'Remaining',
      value: formatMoney(totalRemain),
    },
    {
      icon: 'chart-pie',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
      label: lang === 'fr' ? 'Consommation moyenne' : 'Average Consumption',
      value: `${avgPct}%`,
    },
  ]

  return (
    <div>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
          {lang === 'fr' ? 'Finances' : 'Finances'}
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
          {lang === 'fr'
            ? "Vue d'ensemble budgétaire de tous les projets de recherche."
            : 'Budget overview across all research projects.'}
        </p>
      </div>

      {/* ── Summary cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        {summaryCards.map((c, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: c.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <i className={`ti ti-${c.icon}`} style={{ fontSize: 22, color: c.iconColor }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{c.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginTop: 2 }}>{c.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Projects budget table ── */}
      <Card padding={0} style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
            {lang === 'fr' ? 'Budget par projet' : 'Budget by Project'}
          </span>
          <Badge variant="gray">{projects.length} {lang === 'fr' ? 'projet(s)' : 'project(s)'}</Badge>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[
                  lang === 'fr' ? 'Projet' : 'Project',
                  'Institut',
                  lang === 'fr' ? 'Budget initial' : 'Initial Budget',
                  lang === 'fr' ? 'Dépensé' : 'Spent',
                  lang === 'fr' ? 'Restant' : 'Remaining',
                  lang === 'fr' ? 'Consommation' : 'Consumption',
                ].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                    {lang === 'fr' ? 'Aucun projet trouvé' : 'No projects found'}
                  </td>
                </tr>
              ) : projects.map(p => {
                const pct     = budgetPercent(p)
                const spent   = p.budgetDepense || 0
                const budget  = p.budgetInitial || 0
                const remain  = budget - spent
                return (
                  <tr
                    key={p._id}
                    style={{ borderTop: '1px solid #E5E7EB', transition: 'background .1s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Projet */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                        {p.intitule}
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.code}</div>
                    </td>
                    {/* Institut */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant="gray">{p.institute?.sigle || '—'}</Badge>
                    </td>
                    {/* Budget initial */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>
                      {formatMoney(budget)}
                    </td>
                    {/* Depense */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: budgetColor(pct), fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatMoney(spent)}
                    </td>
                    {/* Restant */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: remain >= 0 ? '#16A34A' : '#DC2626', whiteSpace: 'nowrap' }}>
                      {formatMoney(remain)}
                    </td>
                    {/* Consommation */}
                    <td style={{ padding: '12px 16px', width: 150 }}>
                      <BudgetBar pct={pct} />
                      <div style={{ fontSize: 11, color: pct >= 90 ? '#DC2626' : '#6B7280', marginTop: 3, fontWeight: pct >= 90 ? 600 : 400 }}>
                        {pct}%
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* Totals row */}
            {projects.length > 0 && (
              <tfoot>
                <tr style={{ background: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
                  <td colSpan={2} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#111827' }}>
                    {lang === 'fr' ? 'TOTAL' : 'TOTAL'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                    {formatMoney(totalBudget)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: budgetColor(avgPct), whiteSpace: 'nowrap' }}>
                    {formatMoney(totalSpent)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: totalRemain >= 0 ? '#16A34A' : '#DC2626', whiteSpace: 'nowrap' }}>
                    {formatMoney(totalRemain)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#111827' }}>
                    {avgPct}%
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* ── Category breakdown ── */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
            {lang === 'fr' ? 'Répartition par catégorie de dépense' : 'Breakdown by Expense Category'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {CATEGORIES.map(cat => {
            const amount  = catTotals[cat]
            const barPct  = catMax > 0 ? Math.round((amount / catMax) * 100) : 0
            const sharePct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
            const color   = CAT_COLORS[cat]
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <i className={`ti ti-${CAT_ICONS[cat]}`} style={{ fontSize: 18, color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                      {lang === 'fr' ? cat : CAT_EN[cat]}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {formatMoney(amount)} ({sharePct}%)
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${barPct}%`, height: '100%',
                      background: color, borderRadius: 3,
                      transition: 'width .4s',
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
