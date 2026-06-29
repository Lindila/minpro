import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLandingData } from '../api/public.api'
import './VisitorInnovations.css'

const NAV_ITEMS = [
  { key: 'dashboard',    icon: 'home',           label: 'Tableau de bord' },
  { key: 'projects',     icon: 'folder-kanban',  label: 'Projets de recherche' },
  { key: 'publications', icon: 'file-text',      label: 'Publications' },
  { key: 'innovations',  icon: 'bulb',           label: 'Innovations' },
  { key: 'researchers',  icon: 'users',          label: 'Chercheurs' },
  { key: 'partners',     icon: 'handshake',      label: 'Partenaires' },
  { key: 'funding',      icon: 'coins',          label: 'Financements' },
  { key: 'events',       icon: 'calendar-event', label: 'Événements' },
  { key: 'documents',    icon: 'file-analytics',  label: 'Documents' },
  { key: 'reports',      icon: 'chart-bar',      label: 'Rapports' },
  { key: 'messages',     icon: 'mail',           label: 'Messagerie', badge: 3 },
  { key: 'settings',     icon: 'settings',       label: 'Paramètres' },
]

const HERO_SLIDES = [
  { img: '/Batiment.png', title: "L'innovation au service du Cameroun", sub: 'Ensemble, bâtissons un avenir intelligent et durable grâce à la recherche.' },
  { img: '/innovation-1.png', title: "Agriculture intelligente", sub: "Des solutions numériques pour transformer l'agriculture camerounaise." },
  { img: '/innovation-2.png', title: "Santé et innovation", sub: "La recherche médicale au service des populations africaines." },
  { img: '/innovation-3.png', title: "Matériaux du futur", sub: "Valoriser les ressources locales pour construire le Cameroun de demain." },
]

const COMMENTS = [
  { name: 'Dr. Marie N.', initials: 'MN', text: "Très intéressant ! Cette innovation pourrait révolutionner l'agriculture locale.", time: 'Il y a 1h' },
  { name: 'Pr. Jean Claude N.', initials: 'JC', text: "Je suis d'accord, les résultats semblent prometteurs. Bravo à l'équipe !", time: 'Il y a 2h' },
  { name: 'Dr. Aline K.', initials: 'AK', text: "Pourrait-on avoir plus de détails sur la méthodologie utilisée ?", time: 'Il y a 4h' },
]

const EVENTS = [
  { day: '15', month: 'JUIL.', title: "Forum National de la Recherche et de l'Innovation 2025", loc: 'Yaoundé, Palais des Congrès', btn: "S'inscrire", img: '/event-1.png' },
  { day: '22', month: 'JUIL.', title: 'Atelier : Rédaction de projets de recherche compétitifs', loc: 'En ligne (Zoom)', btn: 'Participer', img: '/event-2.png' },
  { day: '05', month: 'AOÛT', title: "Journée de l'Innovation et de l'Entrepreneuriat", loc: 'Douala, Bépanda', btn: "Plus d'infos", img: '/event-3.png' },
]

export default function VisitorInnovations() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [heroSlide, setHeroSlide] = useState(0)
  const [data, setData] = useState({ institutes: [], recentProjects: [], stats: {} })
  const eventsRef = useRef(null)

  useEffect(() => {
    if (!loading && !user) navigate('/visitor/login')
  }, [user, loading, navigate])

  useEffect(() => {
    getLandingData().then(r => setData(r.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7F5' }}>
      <i className="ti ti-loader spin" style={{ fontSize: 32, color: '#1B4D3E' }} />
    </div>
  )

  const initials = user ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}` : '?'
  const featuredProject = data.recentProjects[0]

  return (
    <div className="vi-layout">
      {/* Overlay mobile */}
      <div className={`vi-overlay${sidebarOpen ? ' visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* ── SIDEBAR ── */}
      <aside className={`vi-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="vi-sidebar-logo">
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-layers-intersect" style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div className="vi-sidebar-logo-text">
            <h3>MINRESI</h3>
            <p>Ministère de la Recherche Scientifique et de l'Innovation</p>
          </div>
        </div>

        <nav className="vi-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <div key={item.key}
              className={`vi-nav-item${activeNav === item.key ? ' active' : ''}`}
              onClick={() => { setActiveNav(item.key); setSidebarOpen(false) }}
            >
              <i className={`ti ti-${item.icon}`} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span className="vi-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="vi-sidebar-bottom">
          <p>"L'innovation aujourd'hui, le développement demain."</p>
          <h4>MINRESI</h4>
          <small>Construire le Cameroun par la Recherche et l'Innovation</small>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="vi-main">
        {/* Topbar */}
        <header className="vi-topbar">
          <button className="vi-menu-btn" onClick={() => setSidebarOpen(true)}>
            <i className="ti ti-menu-2" />
          </button>
          <div className="vi-search">
            <i className="ti ti-search" />
            <input placeholder="Rechercher un projet, une publication, un chercheur..." />
          </div>
          <div className="vi-topbar-right">
            <div className="vi-top-icon">
              <i className="ti ti-bell" />
              <span className="vi-top-badge">3</span>
            </div>
            <div className="vi-top-icon">
              <i className="ti ti-mail" />
              <span className="vi-top-badge">2</span>
            </div>
            <div className="vi-user-info" onClick={logout}>
              <div className="vi-avatar">{initials}</div>
              <div>
                <div className="vi-user-name">{user?.prenom} {user?.nom}</div>
                <div className="vi-user-role">Visiteur</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="vi-content">
          {/* ── Hero Carousel ── */}
          <div className="vi-hero">
            {HERO_SLIDES.map((slide, i) => (
              <img key={i} src={slide.img} alt={slide.title}
                style={{ opacity: heroSlide === i ? 1 : 0, zIndex: heroSlide === i ? 1 : 0 }}
                onError={e => { e.target.style.background = '#1B4D3E'; }}
              />
            ))}
            <div className="vi-hero-overlay" />
            <div className="vi-hero-text">
              <h2>{HERO_SLIDES[heroSlide].title}</h2>
              <p>{HERO_SLIDES[heroSlide].sub}</p>
              <button className="vi-hero-btn" onClick={() => setActiveNav('projects')}>
                Découvrir nos projets <i className="ti ti-arrow-right" />
              </button>
            </div>
            <button className="vi-hero-arrow left" onClick={() => setHeroSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>
              <i className="ti ti-chevron-left" />
            </button>
            <button className="vi-hero-arrow right" onClick={() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length)}>
              <i className="ti ti-chevron-right" />
            </button>
            <div className="vi-hero-dots">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} className={`vi-hero-dot${heroSlide === i ? ' active' : ''}`} onClick={() => setHeroSlide(i)} />
              ))}
            </div>
          </div>

          {/* ── Three Columns ── */}
          <div className="vi-three-grid">
            {/* Publications */}
            <div className="vi-card">
              <div className="vi-card-header">
                <span className="vi-card-title">Publications récentes</span>
                <span className="vi-card-link">Voir tout</span>
              </div>
              {data.recentProjects.slice(0, 3).map((p, i) => (
                <div key={p._id || i} className="vi-pub-item">
                  <img src={`/pub-${i + 1}.png`} alt="" className="vi-pub-img"
                    onError={e => { e.target.style.display = 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="vi-pub-title">{p.intitule}</div>
                    <div className="vi-pub-meta">
                      {p.institute?.sigle} · {new Date(p.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="vi-pub-pdf"><i className="ti ti-file-type-pdf" /></div>
                </div>
              ))}
            </div>

            {/* Innovation à la une */}
            <div className="vi-card">
              <div className="vi-card-header">
                <span className="vi-card-title">Innovations à la une</span>
                <span className="vi-card-link">Voir tout</span>
              </div>
              {featuredProject && (
                <div className="vi-innov-featured" style={{ position: 'relative' }}>
                  <img src="/innovation-1.png" alt={featuredProject.intitule}
                    onError={e => { e.target.style.background = '#E8F4EF'; }} />
                  <span className="vi-innov-badge">Nouveau</span>
                  <div className="vi-innov-title">{featuredProject.intitule}</div>
                  <div className="vi-innov-desc">
                    {featuredProject.domaine} — {featuredProject.institute?.sigle || 'MINRESI'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="vi-innov-meta">
                      {featuredProject.institute?.sigle} · {new Date(featuredProject.dateDebut).getFullYear()}
                    </span>
                    <button className="vi-innov-more">En savoir plus</button>
                  </div>
                </div>
              )}
            </div>

            {/* Commentaires */}
            <div className="vi-card">
              <div className="vi-card-header">
                <span className="vi-card-title">Commentaires récents</span>
                <span className="vi-card-link">Voir tout</span>
              </div>
              {COMMENTS.map((c, i) => (
                <div key={i} className="vi-comment-item">
                  <div className="vi-comment-top">
                    <div className="vi-comment-avatar">{c.initials}</div>
                    <div>
                      <div className="vi-comment-name">{c.name}</div>
                    </div>
                    <span className="vi-comment-time">{c.time}</span>
                  </div>
                  <div className="vi-comment-text">{c.text}</div>
                  <button className="vi-comment-reply">Répondre</button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Row ── */}
          <div className="vi-bottom-row">
            {/* Events */}
            <div className="vi-card">
              <div className="vi-card-header">
                <span className="vi-card-title">À ne pas manquer</span>
                <span className="vi-card-link">Voir tout</span>
              </div>
              <div className="vi-events-scroll" ref={eventsRef}>
                {EVENTS.map((ev, i) => (
                  <div key={i} className="vi-event-card">
                    <img src={ev.img} alt={ev.title}
                      onError={e => { e.target.style.opacity = '0'; }} />
                    <div className="vi-event-overlay">
                      <div className="vi-event-date">
                        <div className="vi-event-date-day">{ev.day}</div>
                        <div className="vi-event-date-month">{ev.month}</div>
                      </div>
                      <div className="vi-event-title">{ev.title}</div>
                      <div className="vi-event-loc"><i className="ti ti-map-pin" />{ev.loc}</div>
                      <button className="vi-event-btn">{ev.btn}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Innovation */}
            <div className="vi-card vi-share-card">
              <div style={{ marginBottom: 4 }}>
                <i className="ti ti-writing" style={{ fontSize: 32, color: '#1B4D3E' }} />
              </div>
              <h3><i className="ti ti-edit" /> Partager une innovation</h3>
              <p>Vous avez une innovation à partager avec la communauté ? Faites-le ici en quelques clics.</p>
              <button className="vi-share-btn">
                <i className="ti ti-upload" /> Publier une innovation
              </button>
              <div className="vi-quick-actions">
                {[
                  { icon: 'clipboard-plus', label: 'Nouveau projet' },
                  { icon: 'file-upload', label: 'Publier une publication' },
                  { icon: 'user-search', label: 'Rechercher un partenaire' },
                  { icon: 'report-money', label: 'Demande de financement' },
                ].map((a, i) => (
                  <div key={i} className="vi-quick-action">
                    <div className="vi-quick-action-icon"><i className={`ti ti-${a.icon}`} /></div>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
