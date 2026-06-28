import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* ── Hardcoded preview data ── */
const PROJECTS = [
  { title: 'Amélioration des variétés de cacao résistantes', domain: 'Agriculture', year: 2025, institute: 'IRAD' },
  { title: 'Plantes médicinales contre le paludisme résistant', domain: 'Santé', year: 2025, institute: 'IMPM' },
  { title: 'Technologies solaires pour l\'électrification rurale', domain: 'Technologie', year: 2025, institute: 'CNDT' },
]

const INSTITUTES = [
  { sigle: 'IRAD', nom: 'Institut de Recherche Agricole pour le Développement', domaines: 'Agriculture, Agroalimentaire, Environnement' },
  { sigle: 'IMPM', nom: 'Institut de Recherches Médicales et d\'Études des Plantes Médicinales', domaines: 'Santé, Pharmacologie, Plantes médicinales' },
  { sigle: 'IRGM', nom: 'Institut de Recherches Géologiques et Minières', domaines: 'Géologie, Mines, Ressources minérales' },
  { sigle: 'INC',  nom: 'Institut National de Cartographie', domaines: 'Cartographie, Télédétection, SIG' },
]

const INNOVATIONS = [
  { name: 'Agri\'Smart', desc: 'Application mobile pour le conseil agricole', domain: 'Agriculture' },
  { name: 'MedSahara', desc: 'Dispositif de diagnostic médical portable', domain: 'Santé' },
  { name: 'EcoBrique', desc: 'Brique écologique à base de matériaux locaux', domain: 'Environnement' },
]

const STATS = [
  { icon: 'ti-folder',      value: '256+', label: 'Projets de recherche' },
  { icon: 'ti-building',    value: '18',   label: 'Instituts de recherche' },
  { icon: 'ti-bulb',        value: '134+', label: 'Innovations' },
  { icon: 'ti-users-group', value: '850+', label: 'Chercheurs impliqués' },
]

const HERO_SLIDES = [
  { img: '/innovation-1.png', alt: 'Innovation agricole — Agri\'Smart' },
  { img: '/innovation-2.png', alt: 'Innovation médicale — MedSahara' },
  { img: '/innovation-3.png', alt: 'Innovation matériaux — EcoBrique' },
]

const NAV_LINKS = [
  { label: 'Accueil',      href: '#accueil' },
  { label: 'Projets',      href: '#projets' },
  { label: 'Instituts',    href: '#instituts' },
  { label: 'Innovations',  href: '#innovations' },
  { label: 'Actualités',   href: '#actualites' },
  { label: 'À propos',     href: '#apropos' },
]

const DOMAIN_COLORS = {
  Agriculture:   { bg: '#E8F4EF', text: '#1B4D3E' },
  Santé:         { bg: '#EDE9FE', text: '#5B21B6' },
  Technologie:   { bg: '#FEF3C7', text: '#92400E' },
  Environnement: { bg: '#DBEAFE', text: '#1E40AF' },
}

const FEATURES = [
  { icon: 'ti-search',   title: 'Explorez',       desc: 'Recherchez et découvrez des projets de recherche et leurs résultats.' },
  { icon: 'ti-bulb',     title: 'Innovez',        desc: 'Découvrez les innovations qui transforment notre société et notre économie.' },
  { icon: 'ti-building', title: 'Collaborez',     desc: 'Trouvez les bons partenaires et construisez ensemble l\'avenir.' },
  { icon: 'ti-mail',     title: 'Contactez-nous', desc: 'Un projet, une idée ou un partenariat ? Échangeons ensemble.' },
]

/* ── Color constants ── */
const C = {
  green:     '#1B4D3E',
  greenDark: '#0D2B1D',
  gold:      '#D4A017',
  lightGreen:'#E8F4EF',
  white:     '#FFFFFF',
  bg:        '#F5F7F5',
  border:    '#E5E7EB',
  text:      '#111827',
  muted:     '#6B7280',
}

/* ── Smooth scroll handler ── */
function scrollTo(e, href) {
  e.preventDefault()
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── Image fallback ── */
function imgFallback(e) {
  e.target.style.display = 'none'
}

/* ══════════════════════════════════════════════════════════
   Landing Page Component
   ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [search, setSearch] = useState('')
  const [heroSlide, setHeroSlide] = useState(0)
  const innovRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(s => (s + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const scrollInnovations = (dir) => {
    if (innovRef.current) {
      innovRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ background: C.white, minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{landingCSS}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav className="landing-navbar" id="accueil">
        <div className="landing-nav-inner">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-layers-intersect" style={{ color: C.white, fontSize: 20 }} />
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Gestion des Projets de Recherche</div>
              <div style={{ fontSize: 11, color: C.muted }}>Instituts de Recherche &ndash; CMR</div>
            </div>
          </div>

          {/* Center links */}
          <div className="landing-nav-links">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)}
                 className="landing-nav-link">
                {l.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 18 }} role="img" aria-label="Cameroun">{'\u{1F1E8}\u{1F1F2}'}</span>
            <Link to="/visitor/login" className="landing-btn-green" style={{ fontSize: 13, padding: '8px 20px' }}>
              Se connecter
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="landing-hero" id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Bâtiment MINRESI en fond */}
        <img src="/Batiment.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,.92) 0%, rgba(255,255,255,.75) 50%, rgba(255,255,255,.3) 100%)', zIndex: 1 }} />
        <div className="landing-hero-inner" style={{ position: 'relative', zIndex: 2 }}>
          <div className="landing-hero-left">
            <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, color: C.text, marginBottom: 20, letterSpacing: -0.5 }}>
              Ensemble, innovons aujourd'hui pour un{' '}
              <span style={{ color: C.green }}>Cameroun</span>{' '}
              meilleur demain.
            </h1>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
              Découvrez les projets de recherche, les innovations et les instituts qui construisent l'avenir du Cameroun.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#projets" onClick={e => scrollTo(e, '#projets')} className="landing-btn-green" style={{ padding: '12px 28px', fontSize: 15 }}>
                <i className="ti ti-arrow-right" style={{ fontSize: 18 }} /> Découvrir les projets
              </a>
              <a href="#apropos" onClick={e => scrollTo(e, '#apropos')} className="landing-btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>
                En savoir plus
              </a>
            </div>
          </div>

          <div className="landing-hero-right">
            <div className="landing-hero-img-wrap" style={{ background: '#0D2B1D' }}>
              {HERO_SLIDES.map((slide, i) => (
                <img key={i} src={slide.img} alt={slide.alt}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: heroSlide === i ? 1 : 0,
                    transition: 'opacity 1.2s ease-in-out',
                    zIndex: 1,
                  }}
                />
              ))}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.35) 0%, transparent 50%)', zIndex: 2, pointerEvents: 'none' }} />
              {/* Dots */}
              <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 5 }}>
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setHeroSlide(i)} style={{
                    width: heroSlide === i ? 24 : 8, height: 8, borderRadius: 4,
                    background: heroSlide === i ? 'white' : 'rgba(255,255,255,.5)',
                    border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0,
                  }} />
                ))}
              </div>
              {/* Quote card */}
              <div className="landing-hero-quote">
                <p style={{ fontSize: 13, fontStyle: 'italic', color: C.text, lineHeight: 1.5, marginBottom: 8 }}>
                  "La recherche d'aujourd'hui est le développement de demain."
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.muted, fontWeight: 600 }}>
                  <span style={{ color: C.green }}>Innovation</span>
                  <span>&bull;</span>
                  <span style={{ color: C.gold }}>Partage</span>
                  <span>&bull;</span>
                  <span style={{ color: C.green }}>Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="landing-stats">
        <div className="landing-stats-inner">
          {STATS.map((s, i) => (
            <div key={i} className="landing-stat-card">
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: C.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: C.green }} />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.green }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SEARCH BAR ═══ */}
      <section style={{ padding: '10px 24px 48px', maxWidth: 720, margin: '0 auto' }} id="recherche">
        <div className="landing-search-bar">
          <i className="ti ti-search" style={{ fontSize: 20, color: C.muted, marginLeft: 16 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un projet, un institut, une innovation..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 15,
              padding: '14px 16px', background: 'transparent', color: C.text,
              fontFamily: 'inherit',
            }}
          />
          <button className="landing-btn-green" style={{ margin: 4, padding: '10px 24px', fontSize: 14, borderRadius: 10 }}>
            Rechercher
          </button>
        </div>
      </section>

      {/* ═══ THREE COLUMNS: PROJETS / INSTITUTS / INNOVATIONS ═══ */}
      <section className="landing-three-col" id="projets">
        <div className="landing-container">
          <div className="landing-three-grid">

            {/* ── Projets ── */}
            <div className="landing-col-card" id="projets-list">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                  <i className="ti ti-folder" style={{ color: C.green, marginRight: 8 }} />
                  Projets de recherche récents
                </h2>
              </div>
              {PROJECTS.map((p, i) => (
                <div key={i} className="landing-project-item">
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    background: `linear-gradient(135deg, ${C.lightGreen}, ${C.green}22)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <i className="ti ti-file-text" style={{ fontSize: 22, color: C.green }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: (DOMAIN_COLORS[p.domain] || DOMAIN_COLORS.Agriculture).bg,
                        color: (DOMAIN_COLORS[p.domain] || DOMAIN_COLORS.Agriculture).text,
                      }}>
                        {p.domain}
                      </span>
                      <span style={{ fontSize: 11, color: C.muted }}>{p.year}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>&bull; {p.institute}</span>
                    </div>
                  </div>
                </div>
              ))}
              <a href="#projets" onClick={e => scrollTo(e, '#projets')}
                 style={{ display: 'block', marginTop: 16, fontSize: 13, fontWeight: 600, color: C.green }}>
                Voir tous les projets &rarr;
              </a>
            </div>

            {/* ── Instituts ── */}
            <div className="landing-col-card" id="instituts">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                  <i className="ti ti-building" style={{ color: C.green, marginRight: 8 }} />
                  Nos instituts
                </h2>
              </div>
              {INSTITUTES.map((inst, i) => (
                <div key={i} className="landing-institute-item">
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: C.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: C.green }}>{inst.sigle.charAt(0)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{inst.sigle}</div>
                    <div style={{ fontSize: 12, color: C.text, marginBottom: 3, lineHeight: 1.3 }}>{inst.nom}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{inst.domaines}</div>
                  </div>
                </div>
              ))}
              <a href="#instituts" onClick={e => scrollTo(e, '#instituts')}
                 style={{ display: 'block', marginTop: 16, fontSize: 13, fontWeight: 600, color: C.green }}>
                Voir tous les instituts &rarr;
              </a>
            </div>

            {/* ── Innovations ── */}
            <div className="landing-col-card" id="innovations">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                  <i className="ti ti-bulb" style={{ color: C.gold, marginRight: 8 }} />
                  Innovations du Cameroun
                </h2>
                <button onClick={() => scrollInnovations(1)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
                    background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                  <i className="ti ti-arrow-right" style={{ fontSize: 16, color: C.muted }} />
                </button>
              </div>
              <div ref={innovRef} className="landing-innov-scroll">
                {INNOVATIONS.map((inn, i) => (
                  <div key={i} className="landing-innov-card">
                    <div style={{
                      width: '100%', height: 120, borderRadius: 12,
                      background: `linear-gradient(135deg, ${C.lightGreen}, ${C.green}15)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <img src={`/innovation-${i + 1}.png`} alt={inn.name} onError={imgFallback}
                           style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, position: 'relative', zIndex: 1 }} />
                      <i className="ti ti-bulb" style={{ position: 'absolute', fontSize: 40, color: `${C.green}33` }} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{inn.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, lineHeight: 1.4 }}>{inn.desc}</div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                      background: (DOMAIN_COLORS[inn.domain] || DOMAIN_COLORS.Agriculture).bg,
                      color: (DOMAIN_COLORS[inn.domain] || DOMAIN_COLORS.Agriculture).text,
                      display: 'inline-block',
                    }}>
                      {inn.domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="landing-features" id="apropos">
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 10 }}>
              Que pouvez-vous faire ?
            </h2>
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 520, margin: '0 auto' }}>
              SIGPRO-MINRESI vous offre un accès unique à l'écosystème de recherche camerounais.
            </p>
          </div>
          <div className="landing-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="landing-feature-card">
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: C.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <i className={`ti ${f.icon}`} style={{ fontSize: 24, color: C.green }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="landing-cta" id="actualites">
        <div className="landing-cta-inner">
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12 }}>
            Rejoignez l'écosystème de recherche du Cameroun
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Accédez à des opportunités, partagez vos connaissances et contribuez à un avenir durable et innovant.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/visitor/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              background: C.white, color: C.green, border: 'none', cursor: 'pointer',
              textDecoration: 'none', transition: 'transform .2s',
            }}>
              Se connecter <i className="ti ti-arrow-right" style={{ fontSize: 18 }} />
            </Link>
            <Link to="/visitor/register" style={{
              fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ COLLABORATION BANNER ═══ */}
      <section className="landing-collab">
        <div className="landing-collab-inner">
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: `${C.green}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <i className="ti ti-handshake" style={{ fontSize: 28, color: C.green }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>
            Collaborons pour l'avenir
          </h2>
          <p style={{ fontSize: 14, color: C.muted, maxWidth: 580, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Vous êtes une entreprise, un chercheur ou une institution internationale ? Rejoignez-nous pour développer des solutions innovantes et durables.
          </p>
          <button className="landing-btn-green" style={{ padding: '12px 28px', fontSize: 15 }}>
            <i className="ti ti-arrow-right" style={{ fontSize: 18 }} /> Nous contacter
          </button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            &copy; 2024 Gestion des Projets de Recherche - Instituts de Recherche du Cameroun. Tous droits réservés.
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {[
              { icon: 'ti-brand-linkedin', label: 'LinkedIn' },
              { icon: 'ti-brand-x', label: 'X' },
              { icon: 'ti-brand-youtube', label: 'YouTube' },
              { icon: 'ti-brand-facebook', label: 'Facebook' },
            ].map((s, i) => (
              <a key={i} href="#" aria-label={s.label} style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)', transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = C.white }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              >
                <i className={`ti ${s.icon}`} style={{ fontSize: 18 }} />
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {['Accueil', 'Projets', 'Instituts', 'Innovations', 'Contact'].map((l, i) => (
              <a key={i} href={`#${l.toLowerCase()}`} onClick={e => scrollTo(e, `#${l.toLowerCase()}`)}
                 style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', transition: 'color .2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = C.white}
                 onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                {l}
              </a>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 13 }}>|</span>
            <Link to="/login"
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', transition: 'color .2s', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              <i className="ti ti-lock" style={{ fontSize: 13 }} />
              Espace MINRESI
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Scoped CSS (injected via <style> tag)
   ══════════════════════════════════════════════════════════ */
const landingCSS = `
/* ── Navbar ── */
.landing-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #E5E7EB;
  padding: 0 32px;
}
.landing-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.landing-nav-links {
  display: flex;
  gap: 8px;
}
.landing-nav-link {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  border-radius: 8px;
  transition: all .2s;
  text-decoration: none;
}
.landing-nav-link:hover {
  color: #1B4D3E;
  background: #E8F4EF;
}

/* ── Green Button ── */
.landing-btn-green {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #1B4D3E, #0D2B1D);
  color: #fff;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: transform .2s, box-shadow .2s;
  font-family: inherit;
}
.landing-btn-green:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(27,77,62,0.3);
}

/* ── Outline Button ── */
.landing-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: transparent;
  color: #1B4D3E;
  font-weight: 600;
  border-radius: 10px;
  border: 2px solid #1B4D3E;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: all .2s;
  font-family: inherit;
}
.landing-btn-outline:hover {
  background: #E8F4EF;
}

/* ── Hero ── */
.landing-hero {
  padding: 100px 32px 60px;
  background: linear-gradient(180deg, #F5F7F5 0%, #fff 100%);
}
.landing-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}
.landing-hero-left {
  flex: 1;
  min-width: 0;
}
.landing-hero-right {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: flex-end;
}
.landing-hero-img-wrap {
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 340px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(27,77,62,0.15);
}
.landing-hero-quote {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  z-index: 2;
}

/* ── Stats ── */
.landing-stats {
  padding: 0 32px 48px;
}
.landing-stats-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.landing-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  transition: transform .2s, box-shadow .2s;
}
.landing-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(27,77,62,0.08);
}

/* ── Search ── */
.landing-search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  transition: border-color .2s, box-shadow .2s;
  overflow: hidden;
}
.landing-search-bar:focus-within {
  border-color: #1B4D3E;
  box-shadow: 0 0 0 3px rgba(27,77,62,0.08);
}

/* ── Container ── */
.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* ── Three Column Section ── */
.landing-three-col {
  padding: 20px 0 60px;
  background: #F5F7F5;
}
.landing-three-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.landing-col-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #E5E7EB;
}
.landing-project-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #F3F4F6;
  align-items: flex-start;
}
.landing-project-item:last-of-type {
  border-bottom: none;
}
.landing-institute-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F3F4F6;
  align-items: flex-start;
}
.landing-institute-item:last-of-type {
  border-bottom: none;
}

/* ── Innovation scroll ── */
.landing-innov-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}
.landing-innov-scroll::-webkit-scrollbar { height: 4px; }
.landing-innov-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }
.landing-innov-card {
  min-width: 220px;
  max-width: 240px;
  flex-shrink: 0;
  scroll-snap-align: start;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  background: #fff;
  transition: transform .2s;
}
.landing-innov-card:hover {
  transform: translateY(-2px);
}

/* ── Features ── */
.landing-features {
  padding: 60px 0;
  background: #fff;
}
.landing-features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.landing-feature-card {
  padding: 28px 24px;
  border-radius: 16px;
  border: 1px solid #E5E7EB;
  background: #fff;
  transition: transform .2s, box-shadow .2s;
}
.landing-feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(27,77,62,0.08);
}

/* ── CTA ── */
.landing-cta {
  padding: 80px 32px;
  background: linear-gradient(135deg, #1B4D3E 0%, #0D2B1D 100%);
  text-align: center;
}
.landing-cta-inner {
  max-width: 700px;
  margin: 0 auto;
}

/* ── Collaboration ── */
.landing-collab {
  padding: 60px 32px;
  background: #E8F4EF;
  text-align: center;
}
.landing-collab-inner {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Footer ── */
.landing-footer {
  padding: 40px 32px;
  background: #0D2B1D;
  text-align: center;
}
.landing-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ══════ Responsive ══════ */
@media (max-width: 1024px) {
  .landing-three-grid {
    grid-template-columns: 1fr;
  }
  .landing-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .landing-stats-inner {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .landing-hero-inner {
    flex-direction: column;
    text-align: center;
  }
  .landing-hero-left h1 {
    font-size: 30px !important;
  }
  .landing-hero-left p {
    margin-left: auto;
    margin-right: auto;
  }
  .landing-hero-left > div:last-child {
    justify-content: center;
  }
  .landing-hero-right {
    justify-content: center;
  }
  .landing-hero-img-wrap {
    max-width: 100%;
    height: 260px;
  }
  .landing-nav-links {
    display: none;
  }
  .landing-features-grid {
    grid-template-columns: 1fr;
  }
  .landing-stats-inner {
    grid-template-columns: 1fr;
  }
}
`
