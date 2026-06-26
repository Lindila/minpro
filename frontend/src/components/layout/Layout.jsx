import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar  from './Topbar.jsx'
import { getAlerts } from '../../api/project.api'
import { useApp } from '../../context/AppContext'

const TITLES = {
  '/dashboard':   { fr: 'Tableau de bord',          en: 'Dashboard'           },
  '/projects':    { fr: 'Projets de recherche',      en: 'Research Projects'   },
  '/researchers': { fr: 'Annuaire des chercheurs',   en: 'Researchers'         },
  '/users':       { fr: 'Gestion des utilisateurs',  en: 'User Management'     },
}

export default function Layout() {
  const location = useLocation()
  const { lang } = useApp()
  const [alerts, setAlerts] = useState([])

  const fetchAlerts = () => getAlerts().then(r => setAlerts(r.data.data)).catch(() => {})

  useEffect(() => {
    fetchAlerts()
    const id = setInterval(fetchAlerts, 60000) // Refresh toutes les minutes
    return () => clearInterval(id)
  }, [])

  const getTitle = () => {
    if (location.pathname.startsWith('/projects/')) return lang === 'fr' ? 'Détail du projet' : 'Project Detail'
    return TITLES[location.pathname]?.[lang] ?? 'SIGPRO-MINRESI'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar alertCount={alerts.length} />
      <main style={{ marginLeft: 236, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={getTitle()} alerts={alerts} />
        <div style={{ padding: 22, flex: 1, background: '#F5F7F5' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
