import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar  from './Topbar.jsx'
import { getAlerts } from '../../api/project.api'
import { useApp } from '../../context/AppContext'

const TITLES = {
  '/app/dashboard':    { fr: 'Tableau de bord',          en: 'Dashboard'           },
  '/app/projects':     { fr: 'Projets de recherche',      en: 'Research Projects'   },
  '/app/researchers':  { fr: 'Annuaire des chercheurs',   en: 'Researchers'         },
  '/app/users':        { fr: 'Gestion des utilisateurs',  en: 'User Management'     },
  '/app/institutes':   { fr: 'Instituts de recherche',    en: 'Research Institutes'  },
  '/app/reports':      { fr: 'Rapports et analyses',      en: 'Reports & Analytics' },
  '/app/finances':     { fr: 'Finances et budgets',       en: 'Finances & Budgets'  },
  '/app/partnerships': { fr: 'Partenariats',              en: 'Partnerships'        },
  '/app/calendar':     { fr: 'Calendrier',                en: 'Calendar'            },
  '/app/documents':    { fr: 'Documents',                 en: 'Documents'           },
}

export default function Layout() {
  const location = useLocation()
  const { lang } = useApp()
  const [alerts, setAlerts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchAlerts = () => getAlerts().then(r => setAlerts(r.data.data)).catch(() => {})

  useEffect(() => {
    fetchAlerts()
    const id = setInterval(fetchAlerts, 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const getTitle = () => {
    if (location.pathname.startsWith('/app/projects/')) return lang === 'fr' ? 'Détail du projet' : 'Project Detail'
    return TITLES[location.pathname]?.[lang] ?? 'SIGPRO-MINRESI'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar alertCount={alerts.length} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="layout-main" style={{ marginLeft: 236, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={getTitle()} alerts={alerts} onMenuClick={() => setSidebarOpen(true)} />
        <div className="layout-content" style={{ padding: 22, flex: 1, background: '#F5F7F5' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
