import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats, getProjects, getAlerts, getActivities as fetchActivities } from '../api/project.api'
import { useApp }  from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Badge       from '../components/ui/Badge.jsx'
import Loader      from '../components/ui/Loader.jsx'
import LineChart   from '../components/charts/LineChart.jsx'
import PieChart    from '../components/charts/PieChart.jsx'
import { formatDate, formatMoney, budgetColor } from '../utils/formatters'

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
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".6" />
    </svg>
  )
}

function StatCard({ icon, iconBg, iconColor, label, value, trend, trendUp, sparkData, sparkColor, extra }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-top">
        <div className="dash-stat-info">
          <div className="dash-stat-icon" style={{ background: iconBg }}>
            <i className={`ti ti-${icon}`} style={{ color: iconColor }} />
          </div>
          <div>
            <div className="dash-stat-label">{label}</div>
            <div className="dash-stat-value">{value}</div>
          </div>
        </div>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
      {extra || (
        <div className={`dash-stat-trend ${trendUp ? 'up' : 'down'}`}>
          <i className={`ti ti-trending-${trendUp ? 'up' : 'down'}`} />
          {trend}
        </div>
      )}
    </div>
  )
}

function ActivityItem({ icon, iconBg, iconColor, title, desc, time }) {
  return (
    <div className="dash-activity-item">
      <div className="dash-activity-icon" style={{ background: iconBg }}>
        <i className={`ti ti-${icon}`} style={{ color: iconColor }} />
      </div>
      <div className="dash-activity-body">
        <div className="dash-activity-title">{title}</div>
        <div className="dash-activity-desc">{desc}</div>
      </div>
      <div className="dash-activity-time">{time}</div>
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
  const clotures = stats?.clotures || 0
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
    <div className="dash-wrap">
      {/* ── Welcome Header ── */}
      <div className="dash-welcome">
        <div>
          <h1>{lang === 'fr' ? 'Bonjour' : 'Hello'} {user?.prenom} {user?.nom}</h1>
          <p className="dash-welcome-sub">
            {lang === 'fr' ? "Voici un aperçu global de l'activité des projets de recherche." : 'Here is an overview of research project activity.'}
          </p>
        </div>
        <div className="dash-date-badge">
          <i className="ti ti-calendar" />
          {today}
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="dash-stats">
        <StatCard
          icon="folder" iconBg="#DCFCE7" iconColor="#16A34A"
          label={lang === 'fr' ? 'Projets enregistrés' : 'Registered Projects'}
          value={total} trend={`12% ${lang === 'fr' ? 'ce mois' : 'this month'}`} trendUp
          sparkData={SPARKLINE_DATA[0]} sparkColor="#16A34A"
        />
        <StatCard
          icon="loader" iconBg="#FEF3C7" iconColor="#D97706"
          label={lang === 'fr' ? 'Projets en cours' : 'Active Projects'}
          value={enCours} trend={`8% ${lang === 'fr' ? 'ce mois' : 'this month'}`} trendUp
          sparkData={SPARKLINE_DATA[1]} sparkColor="#D97706"
        />
        <StatCard
          icon="circle-check" iconBg="#DBEAFE" iconColor="#2563EB"
          label={lang === 'fr' ? 'Projets terminés' : 'Completed Projects'}
          value={clotures} trend={`15% ${lang === 'fr' ? 'ce mois' : 'this month'}`} trendUp
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
                <div style={{ width: `${budgetPct}%`, height: '100%', background: budgetColor(budgetPct), borderRadius: 3, transition: 'width .6s cubic-bezier(.16,1,.3,1)' }} />
              </div>
              <div className="dash-stat-trend down">
                <i className="ti ti-trending-down" />
                4% {lang === 'fr' ? 'depuis le mois dernier' : 'since last month'}
              </div>
            </div>
          }
        />
      </div>

      {/* ── Charts + Activities Row ── */}
      <div className="dash-charts-row">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">{lang === 'fr' ? 'Évolution des projets' : 'Project Trend'}</span>
            <select className="dash-card-select">
              <option>{lang === 'fr' ? '6 derniers mois' : 'Last 6 months'}</option>
              <option>{lang === 'fr' ? '12 derniers mois' : 'Last 12 months'}</option>
            </select>
          </div>
          <div style={{ height: 220 }}><LineChart lang={lang} /></div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">{lang === 'fr' ? 'Répartition par institut' : 'By Institute'}</span>
          </div>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart stats={stats} lang={lang} />
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">{lang === 'fr' ? 'Activités récentes' : 'Recent Activity'}</span>
            <span className="dash-card-link">{lang === 'fr' ? 'Voir tout' : 'See all'}</span>
          </div>
          {activityItems.length === 0 ? (
            <div className="dash-empty">
              <i className="ti ti-activity" />
              {lang === 'fr' ? 'Aucune activité récente' : 'No recent activity'}
            </div>
          ) : activityItems.map((a, i) => <ActivityItem key={i} {...a} />)}
        </div>
      </div>

      {/* ── Deadline + Map + Budget Row ── */}
      <div className="dash-bottom-row">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">{lang === 'fr' ? "Projets proches de l'échéance" : 'Upcoming Deadlines'}</span>
            <span className="dash-card-link" onClick={() => navigate('/projects')}>
              {lang === 'fr' ? 'Voir tout' : 'See all'}
            </span>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>{lang === 'fr' ? 'Projet' : 'Project'}</th>
                <th>Institut</th>
                <th>{lang === 'fr' ? 'Date limite' : 'Deadline'}</th>
                <th>{lang === 'fr' ? 'Statut' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {deadlineProjects.length === 0 ? (
                <tr><td colSpan={4} className="dash-empty">{lang === 'fr' ? 'Aucun projet proche' : 'No upcoming deadlines'}</td></tr>
              ) : deadlineProjects.map(p => {
                const ds = getDeadlineStatus(p.dateFin)
                return (
                  <tr key={p._id} onClick={() => navigate(`/projects/${p._id}`)}>
                    <td className="td-title">{p.intitule}</td>
                    <td className="td-muted">{p.institute?.sigle || '—'}</td>
                    <td className="td-muted">{formatDate(p.dateFin)}</td>
                    <td><Badge variant={ds.variant}>{ds.label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">{lang === 'fr' ? 'Répartition géographique' : 'Geographic Distribution'}</span>
          </div>
          <div className="dash-geo-wrap">
            <div className="dash-geo-map">
              <img src="/Cameroun.png" alt="Carte du Cameroun" onError={e => { e.target.style.display = 'none' }} />
            </div>
            <div className="dash-geo-list">
              {[
                { region: 'Maroua',       count: 2,  color: '#16A34A' },
                { region: 'Extrême-Nord', count: 3,  color: '#16A34A' },
                { region: 'Adamaoua',     count: 2,  color: '#16A34A' },
                { region: 'Centre',       count: 15, color: '#DC2626' },
                { region: 'Sud',          count: 3,  color: '#16A34A' },
                { region: 'Littoral',     count: 7,  color: '#16A34A' },
                { region: 'Ouest',        count: 6,  color: '#16A34A' },
              ].map((r, i) => (
                <div key={i} className="dash-geo-item">
                  <div className="dash-geo-dot" style={{ background: r.color }} />
                  <span className="dash-geo-name">{r.region}</span>
                  <span className="dash-geo-count">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">{lang === 'fr' ? 'Exécution budgétaire' : 'Budget Execution'}</span>
            <span className="dash-card-link" onClick={() => navigate('/projects')}>
              {lang === 'fr' ? 'Voir détails' : 'Details'}
            </span>
          </div>
          <div className="dash-donut-wrap">
            <div className="dash-donut">
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke={budgetColor(budgetPct)} strokeWidth="3.5"
                  strokeDasharray={`${budgetPct * 0.88} 88`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .8s cubic-bezier(.16,1,.3,1)' }} />
              </svg>
              <div className="dash-donut-label">
                <span className="dash-donut-pct">{budgetPct}%</span>
                <span className="dash-donut-sub">{lang === 'fr' ? 'utilisé' : 'used'}</span>
              </div>
            </div>
            <div className="dash-budget-details">
              <div className="dash-budget-row">
                <div className="dash-budget-row-label">{lang === 'fr' ? 'Budget total' : 'Total Budget'}</div>
                <div className="dash-budget-row-value">{formatMoney(totalBudget)}</div>
              </div>
              <div className="dash-budget-row">
                <div className="dash-budget-row-label">{lang === 'fr' ? 'Montant utilisé' : 'Amount Used'}</div>
                <div className="dash-budget-row-value" style={{ color: budgetColor(budgetPct) }}>{formatMoney(totalDepense)}</div>
              </div>
              <div className="dash-budget-row">
                <div className="dash-budget-row-label">{lang === 'fr' ? 'Solde disponible' : 'Available'}</div>
                <div className="dash-budget-row-value" style={{ color: '#16A34A' }}>{formatMoney(totalBudget - totalDepense)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Stats Bar ── */}
      <div className="dash-quick-stats">
        {[
          { icon: 'users',      iconBg: '#DCFCE7', iconColor: '#16A34A', label: lang === 'fr' ? 'Chercheurs actifs' : 'Active Researchers', value: '320', trend: '↑ 18%' },
          { icon: 'notebook',   iconBg: '#DBEAFE', iconColor: '#2563EB', label: 'Publications',                                              value: '245', trend: '↑ 22%' },
          { icon: 'certificate',iconBg: '#FEF9C3', iconColor: '#854D0E', label: lang === 'fr' ? 'Brevets déposés' : 'Patents Filed',         value: '18',  trend: '↑ 5%' },
          { icon: 'handshake',  iconBg: '#F3E8FF', iconColor: '#7C3AED', label: lang === 'fr' ? 'Partenariats' : 'Partnerships',             value: '36',  trend: '↑ 12%' },
        ].map((item, i) => (
          <div key={i} className="dash-quick-card">
            <div className="dash-quick-icon" style={{ background: item.iconBg }}>
              <i className={`ti ti-${item.icon}`} style={{ color: item.iconColor }} />
            </div>
            <div>
              <div className="dash-quick-label">{item.label}</div>
              <div className="dash-quick-row">
                <span className="dash-quick-value">{item.value}</span>
                <span className="dash-quick-trend">{item.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
