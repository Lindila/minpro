import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats, getProjects, getAlerts, getActivities as fetchActivities } from '../api/project.api'
import { useApp }  from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Card        from '../components/ui/Card.jsx'
import Badge, { STATUS_VARIANT } from '../components/ui/Badge.jsx'
import BudgetBar   from '../components/ui/BudgetBar.jsx'
import Loader      from '../components/ui/Loader.jsx'
import LineChart   from '../components/charts/LineChart.jsx'
import PieChart    from '../components/charts/PieChart.jsx'
import BarChart    from '../components/charts/BarChart.jsx'
import { formatDate, formatMoney, budgetPercent, budgetColor } from '../utils/formatters'

const SPARKLINE_DATA = [
  [20,25,22,30,28,35,40,38,45,50,48,55],
  [15,18,20,22,19,25,28,30,27,32,35,38],
  [5,8,10,12,11,15,18,20,22,25,28,30],
  [60,62,65,68,70,72,74,73,75,76,78,78],
]

function Sparkline({ data, color, width = 100, height = 32 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
  ).join(' ')
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({ icon, iconBg, iconColor, label, value, trend, trendUp, sparkData, sparkColor, extra }) {
  return (
    <Card padding={20}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={`ti ti-${icon}`} style={{ fontSize: 22, color: iconColor }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{value}</div>
          </div>
        </div>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
      {extra || (
        <div style={{ fontSize: 12, color: trendUp ? '#16A34A' : '#DC2626', fontWeight: 500 }}>
          <i className={`ti ti-trending-${trendUp ? 'up' : 'down'}`} style={{ marginRight: 4 }} />
          {trend}
        </div>
      )}
    </Card>
  )
}

function ActivityItem({ icon, iconBg, iconColor, title, desc, time }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`ti ti-${icon}`} style={{ fontSize: 17, color: iconColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{title}</div>
        <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4, marginTop: 1 }}>{desc}</div>
      </div>
      <div style={{ fontSize: 10, color: '#9CA3AF', whiteSpace: 'nowrap', flexShrink: 0 }}>{time}</div>
    </div>
  )
}

export default function Dashboard() {
  const [stats,      setStats]      = useState(null)
  const [projects,   setProjects]   = useState([])
  const [alerts,     setAlerts]     = useState([])
  const [activities, setActivities] = useState([])
  const [loading,    setLoading]    = useState(true)
  const { lang } = useApp()
  const { user }  = useAuth()
  const navigate  = useNavigate()

  useEffect(() => {
    Promise.all([getStats(), getProjects(), getAlerts(), fetchActivities(10)])
      .then(([s, p, a, act]) => {
        setStats(s.data.data)
        setProjects(p.data.data)
        setAlerts(a.data.data)
        setActivities(act.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label={lang === 'fr' ? 'Chargement du tableau de bord...' : 'Loading dashboard...'} />

  const total    = stats?.total || 0
  const enCours  = stats?.enCours || 0
  const clotures = (stats?.clotures || 0)
  const totalBudget  = projects.reduce((s, p) => s + (p.budgetInitial || 0), 0)
  const totalDepense = projects.reduce((s, p) => s + (p.budgetDepense || 0), 0)
  const budgetPct    = totalBudget > 0 ? Math.round((totalDepense / totalBudget) * 100) : 0

  const deadlineProjects = [...projects]
    .filter(p => p.statut === 'En cours' && p.dateFin)
    .sort((a, b) => new Date(a.dateFin) - new Date(b.dateFin))
    .slice(0, 5)

  const getDeadlineStatus = (dateFin) => {
    const days = Math.ceil((new Date(dateFin) - Date.now()) / 86400000)
    if (days < 0)  return { label: lang === 'fr' ? 'En retard' : 'Overdue',   variant: 'red' }
    if (days < 15) return { label: lang === 'fr' ? 'Critique'  : 'Critical',  variant: 'red' }
    if (days < 30) return { label: 'Attention', variant: 'yellow' }
    return { label: 'Normal', variant: 'green' }
  }

  const today = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const ACTIVITY_META = {
    project_created:      { icon: 'folder-plus',   iconBg: '#DCFCE7', iconColor: '#16A34A' },
    project_updated:      { icon: 'edit',           iconBg: '#DBEAFE', iconColor: '#2563EB' },
    milestone_added:      { icon: 'flag',           iconBg: '#FEF9C3', iconColor: '#854D0E' },
    milestone_done:       { icon: 'circle-check',   iconBg: '#DCFCE7', iconColor: '#16A34A' },
    expense_added:        { icon: 'coins',          iconBg: '#FEF9C3', iconColor: '#854D0E' },
    document_uploaded:    { icon: 'file-upload',    iconBg: '#DBEAFE', iconColor: '#2563EB' },
    document_validated:   { icon: 'file-check',     iconBg: '#DCFCE7', iconColor: '#16A34A' },
    document_rejected:    { icon: 'file-x',         iconBg: '#FEE2E2', iconColor: '#DC2626' },
    user_registered:      { icon: 'user-plus',      iconBg: '#F3E8FF', iconColor: '#7C3AED' },
    user_login:           { icon: 'login',          iconBg: '#E0E7FF', iconColor: '#4F46E5' },
    budget_updated:       { icon: 'wallet',         iconBg: '#FEF9C3', iconColor: '#854D0E' },
  }

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 60)    return lang === 'fr' ? "À l'instant" : 'Just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)} min`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    const days = Math.floor(diff / 86400)
    if (days === 1)   return lang === 'fr' ? 'Hier' : 'Yesterday'
    return `${days} ${lang === 'fr' ? 'jours' : 'days'}`
  }

  const activityItems = activities.map(a => {
    const meta = ACTIVITY_META[a.type] || { icon: 'activity', iconBg: '#F3F4F6', iconColor: '#6B7280' }
    const userName = a.user ? `${a.user.prenom} ${a.user.nom}` : ''
    return {
      ...meta,
      title: a.details || a.type,
      desc: userName + (a.project ? ` — ${a.project.intitule}` : ''),
      time: timeAgo(a.createdAt),
    }
  })

  return (
    <div>
      {/* ── Welcome Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
            {lang === 'fr' ? 'Bonjour' : 'Hello'} {user?.prenom} {user?.nom}
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
            {lang === 'fr' ? "Voici un aperçu global de l'activité des projets de recherche." : 'Here is an overview of research project activity.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#374151' }}>
          <i className="ti ti-calendar" style={{ fontSize: 16, color: '#6B7280' }} />
          {today}
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        <StatCard
          icon="folder" iconBg="#DCFCE7" iconColor="#16A34A"
          label={lang === 'fr' ? 'Projets enregistrés' : 'Registered Projects'}
          value={total} trend={`↑ 12% ${lang === 'fr' ? 'ce mois' : 'this month'}`} trendUp
          sparkData={SPARKLINE_DATA[0]} sparkColor="#16A34A"
        />
        <StatCard
          icon="loader" iconBg="#FEF3C7" iconColor="#D97706"
          label={lang === 'fr' ? 'Projets en cours' : 'Active Projects'}
          value={enCours} trend={`↑ 8% ${lang === 'fr' ? 'ce mois' : 'this month'}`} trendUp
          sparkData={SPARKLINE_DATA[1]} sparkColor="#D97706"
        />
        <StatCard
          icon="circle-check" iconBg="#DBEAFE" iconColor="#2563EB"
          label={lang === 'fr' ? 'Projets terminés' : 'Completed Projects'}
          value={clotures} trend={`↑ 15% ${lang === 'fr' ? 'ce mois' : 'this month'}`} trendUp
          sparkData={SPARKLINE_DATA[2]} sparkColor="#2563EB"
        />
        <StatCard
          icon="wallet" iconBg="#FEE2E2" iconColor="#DC2626"
          label={lang === 'fr' ? 'Budget utilisé' : 'Budget Used'}
          value={`${budgetPct}%`}
          trend=""
          sparkData={SPARKLINE_DATA[3]} sparkColor="#DC2626"
          extra={
            <div>
              <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ width: `${budgetPct}%`, height: '100%', background: budgetColor(budgetPct), borderRadius: 3, transition: 'width .4s' }} />
              </div>
              <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 500 }}>
                <i className="ti ti-trending-down" style={{ marginRight: 4 }} />
                ↓ 4% {lang === 'fr' ? 'depuis le mois dernier' : 'since last month'}
              </div>
            </div>
          }
        />
      </div>

      {/* ── Charts + Activities Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.2fr', gap: 14, marginBottom: 16 }}>
        {/* Line Chart */}
        <Card padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === 'fr' ? 'Évolution des projets' : 'Project Trend'}</div>
            <select style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 11, color: '#6B7280', background: 'white', cursor: 'pointer' }}>
              <option>{lang === 'fr' ? '6 derniers mois' : 'Last 6 months'}</option>
              <option>{lang === 'fr' ? '12 derniers mois' : 'Last 12 months'}</option>
            </select>
          </div>
          <div style={{ height: 220 }}><LineChart lang={lang} /></div>
        </Card>

        {/* Donut Chart — Répartition par institut */}
        <Card padding={20}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{lang === 'fr' ? 'Répartition par institut' : 'By Institute'}</div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart stats={stats} lang={lang} />
          </div>
        </Card>

        {/* Activités récentes */}
        <Card padding={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === 'fr' ? 'Activités récentes' : 'Recent Activity'}</div>
            <span style={{ fontSize: 11, color: '#1B4D3E', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'fr' ? 'Voir tout' : 'See all'}
            </span>
          </div>
          {activityItems.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>
              <i className="ti ti-activity" style={{ fontSize: 28, display: 'block', marginBottom: 6 }} />
              {lang === 'fr' ? 'Aucune activité récente' : 'No recent activity'}
            </div>
          ) : activityItems.map((a, i) => <ActivityItem key={i} {...a} />)}
        </Card>
      </div>

      {/* ── Deadline + Map + Budget Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
        {/* Projets proches de l'échéance */}
        <Card padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === 'fr' ? "Projets proches de l'échéance" : 'Upcoming Deadlines'}</div>
            <span onClick={() => navigate('/projects')} style={{ fontSize: 11, color: '#1B4D3E', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'fr' ? 'Voir tout' : 'See all'}
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#6B7280', fontWeight: 600 }}>{lang === 'fr' ? 'Projet' : 'Project'}</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#6B7280', fontWeight: 600 }}>Institut</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#6B7280', fontWeight: 600 }}>{lang === 'fr' ? 'Date limite' : 'Deadline'}</th>
                <th style={{ textAlign: 'left', padding: '8px 0', color: '#6B7280', fontWeight: 600 }}>{lang === 'fr' ? 'Statut' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {deadlineProjects.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '20px 0', textAlign: 'center', color: '#9CA3AF' }}>{lang === 'fr' ? 'Aucun projet proche' : 'No upcoming deadlines'}</td></tr>
              ) : deadlineProjects.map(p => {
                const ds = getDeadlineStatus(p.dateFin)
                return (
                  <tr key={p._id} onClick={() => navigate(`/projects/${p._id}`)} style={{ cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '10px 0', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.intitule}</td>
                    <td style={{ padding: '10px 0', color: '#6B7280' }}>{p.institute?.sigle || '—'}</td>
                    <td style={{ padding: '10px 0', color: '#6B7280' }}>{formatDate(p.dateFin)}</td>
                    <td style={{ padding: '10px 0' }}><Badge variant={ds.variant}>{ds.label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>

        {/* Répartition géographique */}
        <Card padding={20}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>{lang === 'fr' ? 'Répartition géographique des instituts' : 'Geographic Distribution'}</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <img
                src="/Cameroun.png"
                alt="Carte du Cameroun"
                style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: 340 }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <div style={{ width: 140, flexShrink: 0, fontSize: 11 }}>
              {[
                { region: 'Maroua',       count: 2,  color: '#16A34A' },
                { region: 'Extrême-Nord', count: 3,  color: '#16A34A' },
                { region: 'Adamaoua',     count: 2,  color: '#16A34A' },
                { region: 'Centre',       count: 15, color: '#DC2626' },
                { region: 'Sud',          count: 3,  color: '#16A34A' },
                { region: 'Littoral',     count: 7,  color: '#16A34A' },
                { region: 'Ouest',        count: 6,  color: '#16A34A' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontWeight: 500, color: '#374151' }}>{r.region}</span>
                  <span style={{ color: '#6B7280' }}>{r.count} {lang === 'fr' ? 'instituts' : 'inst.'}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Exécution budgétaire */}
        <Card padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{lang === 'fr' ? 'Exécution budgétaire' : 'Budget Execution'}</div>
            <span onClick={() => navigate('/projects')} style={{ fontSize: 11, color: '#1B4D3E', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'fr' ? 'Voir détails' : 'Details'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {/* Mini donut */}
            <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke={budgetColor(budgetPct)} strokeWidth="3.5"
                  strokeDasharray={`${budgetPct * 0.88} 88`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{budgetPct}%</span>
                <span style={{ fontSize: 9, color: '#6B7280' }}>{lang === 'fr' ? 'Budget utilisé' : 'Used'}</span>
              </div>
            </div>
            {/* Details */}
            <div style={{ flex: 1, fontSize: 12 }}>
              <div style={{ marginBottom: 10, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ color: '#6B7280', marginBottom: 2 }}>{lang === 'fr' ? 'Budget total' : 'Total Budget'}</div>
                <div style={{ fontWeight: 600 }}>{formatMoney(totalBudget)}</div>
              </div>
              <div style={{ marginBottom: 10, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ color: '#6B7280', marginBottom: 2 }}>{lang === 'fr' ? 'Montant utilisé' : 'Amount Used'}</div>
                <div style={{ fontWeight: 600, color: budgetColor(budgetPct) }}>{formatMoney(totalDepense)}</div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div style={{ color: '#6B7280', marginBottom: 2 }}>{lang === 'fr' ? 'Solde disponible' : 'Available'}</div>
                <div style={{ fontWeight: 600, color: '#16A34A' }}>{formatMoney(totalBudget - totalDepense)}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Bottom Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: 'users',      iconBg: '#DCFCE7', iconColor: '#16A34A', label: lang === 'fr' ? 'Chercheurs actifs' : 'Active Researchers', value: '320', trend: '↑ 18%' },
          { icon: 'notebook',   iconBg: '#DBEAFE', iconColor: '#2563EB', label: 'Publications',                                              value: '245', trend: '↑ 22%' },
          { icon: 'certificate',iconBg: '#FEF9C3', iconColor: '#854D0E', label: lang === 'fr' ? 'Brevets déposés' : 'Patents Filed',         value: '18',  trend: '↑ 5%' },
          { icon: 'handshake',  iconBg: '#F3E8FF', iconColor: '#7C3AED', label: lang === 'fr' ? 'Partenariats' : 'Partnerships',             value: '36',  trend: '↑ 12%' },
        ].map((item, i) => (
          <Card key={i} padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`ti ti-${item.icon}`} style={{ fontSize: 20, color: item.iconColor }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{item.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{item.value}</span>
                  <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 500 }}>{item.trend}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
