import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLandingData } from '../api/public.api'

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

const T = {
  fr: {
    brand: 'Gestion des Projets de Recherche', brandSub: 'Instituts de Recherche – CMR',
    nav: ['Accueil','Innovations','Projets','Instituts','À propos','Contact'],
    login: 'Se connecter', hero1: "Ensemble, innovons aujourd'hui pour un", hero2: 'Cameroun', hero3: 'meilleur demain.',
    heroSub: "Découvrez les projets de recherche, les innovations et les instituts qui construisent l'avenir du Cameroun.",
    btnProjects: 'Découvrir les projets', btnMore: 'En savoir plus',
    quote: "La recherche d'aujourd'hui est le développement de demain.",
    searchPh: 'Rechercher un projet, un institut, une innovation...', searchBtn: 'Rechercher',
    innovTitle: 'Innovations du Cameroun', innovSub: 'Les technologies qui transforment notre société',
    projTitle: 'Projets de recherche récents', projSub: 'Découvrez les derniers projets des instituts camerounais',
    projAll: 'Voir tous les projets', instTitle: 'Les 8 Instituts de Recherche du Cameroun',
    instSub: 'Sous la tutelle du MINRESI — Ministère de la Recherche Scientifique et de l\'Innovation',
    featTitle: 'Que pouvez-vous faire ?', featSub: 'SIGPRO-MINRESI vous offre un accès unique à l\'écosystème de recherche camerounais.',
    feat: ['Explorez','Innovez','Collaborez','Contactez-nous'],
    featDesc: ['Recherchez et découvrez des projets de recherche et leurs résultats.','Découvrez les innovations qui transforment notre société et notre économie.','Trouvez les bons partenaires et construisez ensemble l\'avenir.','Un projet, une idée ou un partenariat ? Échangeons ensemble.'],
    ctaTitle: "Rejoignez l'écosystème de recherche du Cameroun",
    ctaSub: 'Accédez à des opportunités, partagez vos connaissances et contribuez à un avenir durable et innovant.',
    ctaCreate: 'Créer un compte',
    donTitle: 'Soutenez la recherche camerounaise', donSub: 'Votre contribution finance directement les chercheurs et leurs projets innovants.',
    donBtn: 'Faire un don', donNote: 'Paiement sécurisé via Mobile Money',
    donOm: 'Orange Money', donMomo: 'MTN MoMo',
    collabTitle: "Collaborons pour l'avenir",
    collabSub: 'Vous êtes une entreprise, un chercheur ou une institution internationale ? Rejoignez-nous pour développer des solutions innovantes et durables.',
    collabBtn: 'Nous contacter', contactWa: 'Discutons sur WhatsApp',
    copy: '© 2025 Gestion des Projets de Recherche - Instituts de Recherche du Cameroun. Tous droits réservés.',
    espaceMinresi: 'Espace MINRESI',
    stats: ['Projets de recherche','Instituts de recherche','Innovations','Chercheurs impliqués'],
  },
  en: {
    brand: 'Research Project Management', brandSub: 'Research Institutes – CMR',
    nav: ['Home','Innovations','Projects','Institutes','About','Contact'],
    login: 'Sign in', hero1: "Together, let's innovate today for a better", hero2: 'Cameroon', hero3: 'tomorrow.',
    heroSub: 'Discover the research projects, innovations and institutes building the future of Cameroon.',
    btnProjects: 'Discover projects', btnMore: 'Learn more',
    quote: "Today's research is tomorrow's development.",
    searchPh: 'Search a project, institute, innovation...', searchBtn: 'Search',
    innovTitle: 'Innovations from Cameroon', innovSub: 'Technologies transforming our society',
    projTitle: 'Recent research projects', projSub: 'Discover the latest projects from Cameroonian institutes',
    projAll: 'View all projects', instTitle: "Cameroon's 8 Research Institutes",
    instSub: 'Under the supervision of MINRESI — Ministry of Scientific Research and Innovation',
    featTitle: 'What can you do?', featSub: 'SIGPRO-MINRESI gives you unique access to the Cameroonian research ecosystem.',
    feat: ['Explore','Innovate','Collaborate','Contact us'],
    featDesc: ['Search and discover research projects and their results.','Discover innovations transforming our society and economy.','Find the right partners and build the future together.','A project, idea or partnership? Let\'s talk.'],
    ctaTitle: "Join Cameroon's research ecosystem",
    ctaSub: 'Access opportunities, share your knowledge and contribute to a sustainable and innovative future.',
    ctaCreate: 'Create an account',
    donTitle: 'Support Cameroonian research', donSub: 'Your contribution directly funds researchers and their innovative projects.',
    donBtn: 'Make a donation', donNote: 'Secure payment via Mobile Money',
    donOm: 'Orange Money', donMomo: 'MTN MoMo',
    collabTitle: 'Collaborate for the future',
    collabSub: 'Are you a company, researcher or international institution? Join us to develop innovative and sustainable solutions.',
    collabBtn: 'Contact us', contactWa: 'Chat on WhatsApp',
    copy: '© 2025 Research Project Management - Research Institutes of Cameroon. All rights reserved.',
    espaceMinresi: 'MINRESI Staff',
    stats: ['Research projects','Research institutes','Innovations','Researchers involved'],
  },
}

const WHATSAPP_NUMBER = '237677576783'

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

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const num = parseInt(target.replace(/\D/g, ''), 10)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const duration = 1800
        const step = (ts) => {
          if (!start) start = ts
          const progress = Math.min((ts - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * num))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [num])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Landing Page Component
   ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [search, setSearch] = useState('')
  const [heroSlide, setHeroSlide] = useState(0)
  const [lang, setLang] = useState('fr')
  const [data, setData] = useState({ institutes: [], recentProjects: [], innovations: [], stats: { projects: 0, institutes: 0, researchers: 0, innovations: 0 } })
  const innovRef = useRef(null)
  const t = T[lang]

  useEffect(() => {
    getLandingData().then(r => setData(r.data.data)).catch(() => {})
  }, [])

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
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{t.brand}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{t.brandSub}</div>
            </div>
          </div>

          {/* Center links */}
          <div className="landing-nav-links">
            {['#accueil','#innovations','#projets','#instituts','#apropos','#contact'].map((href, i) => (
              <a key={href} href={href} onClick={e => scrollTo(e, href)} className="landing-nav-link">
                {t.nav[i]}
              </a>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.text, fontFamily: 'inherit' }}>
              {'\u{1F1E8}\u{1F1F2}'} {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link to="/visitor/login" className="landing-btn-green" style={{ fontSize: 13, padding: '8px 20px' }}>
              <i className="ti ti-user" style={{ fontSize: 15 }} /> {t.login}
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
              {t.hero1}{' '}
              <span style={{ color: C.green }}>{t.hero2}</span>{' '}
              {t.hero3}
            </h1>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
              {t.heroSub}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#projets" onClick={e => scrollTo(e, '#projets')} className="landing-btn-green" style={{ padding: '12px 28px', fontSize: 15 }}>
                <i className="ti ti-arrow-right" style={{ fontSize: 18 }} /> {t.btnProjects}
              </a>
              <a href="#apropos" onClick={e => scrollTo(e, '#apropos')} className="landing-btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>
                {t.btnMore}
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
                  "{t.quote}"
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
          {[
            { icon: 'ti-folder',      value: String(data.stats.projects) + '+' },
            { icon: 'ti-building',    value: String(data.stats.institutes) },
            { icon: 'ti-bulb',        value: String(data.stats.innovations) + '+' },
            { icon: 'ti-users-group', value: String(data.stats.researchers) + '+' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="landing-stat-card">
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: C.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: C.green }} />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.green }}>
                    <AnimatedCounter target={s.value} suffix={s.value.includes('+') ? '+' : ''} />
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{t.stats[i]}</div>
                </div>
              </div>
            </Reveal>
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
            placeholder={t.searchPh}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 15,
              padding: '14px 16px', background: 'transparent', color: C.text,
              fontFamily: 'inherit',
            }}
          />
          <button className="landing-btn-green" style={{ margin: 4, padding: '10px 24px', fontSize: 14, borderRadius: 10 }}>
            {t.searchBtn}
          </button>
        </div>
      </section>

      {/* ═══ INNOVATIONS ═══ */}
      <section style={{ padding: '60px 0', background: C.white }} id="innovations">
        <Reveal>
        <div className="landing-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                <i className="ti ti-bulb" style={{ color: C.gold, marginRight: 10 }} />
                {t.innovTitle}
              </h2>
              <p style={{ fontSize: 14, color: C.muted }}>{t.innovSub}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => scrollInnovations(-1)} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-arrow-left" style={{ fontSize: 18, color: C.muted }} />
              </button>
              <button onClick={() => scrollInnovations(1)} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-arrow-right" style={{ fontSize: 18, color: C.muted }} />
              </button>
            </div>
          </div>
          <div ref={innovRef} className="landing-innov-scroll" style={{ gap: 20, paddingBottom: 12 }}>
            {data.innovations.map((inn, i) => (
              <div key={inn._id || i} className="landing-innov-card" style={{ minWidth: 280, maxWidth: 320, padding: 0, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: 180, position: 'relative', overflow: 'hidden', background: C.lightGreen }}>
                  {inn.image && <img src={inn.image} alt={inn.nom} onError={imgFallback} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  {!inn.image && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-bulb" style={{ fontSize: 48, color: `${C.green}44` }} /></div>}
                  <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,.9)', color: (DOMAIN_COLORS[inn.domaine] || DOMAIN_COLORS.Agriculture).text }}>
                      {inn.domaine}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>{inn.nom}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{inn.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ PROJETS ═══ */}
      <section style={{ padding: '60px 0', background: '#F5F7F5' }} id="projets">
        <Reveal>
        <div className="landing-container">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 6 }}>
              <i className="ti ti-folder" style={{ color: C.green, marginRight: 10 }} />
              {t.projTitle}
            </h2>
            <p style={{ fontSize: 14, color: C.muted }}>{t.projSub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {data.recentProjects.map((p, i) => (
              <Reveal key={p._id || i} delay={i * 0.1}>
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, transition: 'transform .2s, box-shadow .2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(27,77,62,.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.lightGreen}, ${C.green}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-flask" style={{ fontSize: 24, color: C.green }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.4 }}>{p.intitule}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 20, background: (DOMAIN_COLORS[p.domaine] || DOMAIN_COLORS.Agriculture).bg, color: (DOMAIN_COLORS[p.domaine] || DOMAIN_COLORS.Agriculture).text }}>{p.domaine}</span>
                      <span style={{ fontSize: 12, color: C.muted }}><i className="ti ti-calendar" style={{ fontSize: 13, marginRight: 4 }} />{new Date(p.dateDebut).getFullYear()}</span>
                      <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{p.institute?.sigle || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/visitor/login" className="landing-btn-outline" style={{ padding: '12px 32px' }}>
              {t.projAll} <i className="ti ti-arrow-right" style={{ fontSize: 16 }} />
            </Link>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ INSTITUTS ═══ */}
      <section style={{ padding: '60px 0', background: C.white }} id="instituts">
        <Reveal>
        <div className="landing-container">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 6 }}>
              <i className="ti ti-building" style={{ color: C.green, marginRight: 10 }} />
              {t.instTitle}
            </h2>
            <p style={{ fontSize: 14, color: C.muted }}>{t.instSub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {data.institutes.map((inst, i) => (
              <Reveal key={inst._id || i} delay={i * 0.05}>
              <div style={{ background: '#F9FAFB', borderRadius: 14, padding: '20px 22px', border: `1px solid ${C.border}`, display: 'flex', gap: 14, alignItems: 'center', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,77,62,.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: C.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.green }}>{inst.sigle.substring(0, 2)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{inst.sigle}</div>
                  <div style={{ fontSize: 12, color: C.text, lineHeight: 1.3, marginBottom: 3 }}>{inst.nom}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{inst.domaine}</div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="landing-features" id="apropos">
        <Reveal>
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 10 }}>
              {t.featTitle}
            </h2>
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 520, margin: '0 auto' }}>
              {t.featSub}
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
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t.feat[i]}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{t.featDesc[i]}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <Reveal>
      <section className="landing-cta" id="actualites">
        <div className="landing-cta-inner">
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12 }}>
            {t.ctaTitle}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto 28px', lineHeight: 1.7 }}>
            {t.ctaSub}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/visitor/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              background: C.white, color: C.green, border: 'none', cursor: 'pointer',
              textDecoration: 'none', transition: 'transform .2s',
            }}>
              {t.login} <i className="ti ti-arrow-right" style={{ fontSize: 18 }} />
            </Link>
            <Link to="/visitor/register" style={{
              fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              {t.ctaCreate}
            </Link>
          </div>
        </div>
      </section>
      </Reveal>

      {/* ═══ COLLABORATION BANNER ═══ */}
      <Reveal>
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
            {t.collabTitle}
          </h2>
          <p style={{ fontSize: 14, color: C.muted, maxWidth: 580, margin: '0 auto 24px', lineHeight: 1.7 }}>
            {t.collabSub}
          </p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="landing-btn-green" style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}>
            <i className="ti ti-brand-whatsapp" style={{ fontSize: 18 }} /> {t.collabBtn}
          </a>
        </div>
      </section>
      </Reveal>

      {/* ═══ DONATION ═══ */}
      <Reveal>
      <section style={{ padding: '60px 0', background: C.white }} id="contact">
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FEF3C7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <i className="ti ti-heart-handshake" style={{ fontSize: 32, color: '#D97706' }} />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>{t.donTitle}</h2>
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>{t.donSub}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 600, margin: '0 auto' }}>
            <a href="tel:%23150%2A1%2A1%23" style={{ background: '#FFF7ED', borderRadius: 16, padding: '28px 24px', border: '1px solid #FDBA74', textAlign: 'center', transition: 'transform .2s, box-shadow .2s', textDecoration: 'none', display: 'block', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,102,0,.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FF6600', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <i className="ti ti-device-mobile" style={{ fontSize: 24, color: C.white }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#EA580C', marginBottom: 4 }}>{t.donOm}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>#150*1*1#</div>
              <div style={{ fontSize: 12, color: C.muted }}>N° : 688 015 188</div>
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: '#FF6600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <i className="ti ti-phone-call" style={{ fontSize: 16 }} /> {lang === 'fr' ? 'Composer maintenant' : 'Dial now'}
              </div>
            </a>
            <a href="tel:%2A126%23" style={{ background: '#FEFCE8', borderRadius: 16, padding: '28px 24px', border: '1px solid #FDE047', textAlign: 'center', transition: 'transform .2s, box-shadow .2s', textDecoration: 'none', display: 'block', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(251,191,36,.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FBBF24', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <i className="ti ti-device-mobile" style={{ fontSize: 24, color: C.white }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#A16207', marginBottom: 4 }}>{t.donMomo}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>*126#</div>
              <div style={{ fontSize: 12, color: C.muted }}>N° : 677 576 783</div>
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <i className="ti ti-phone-call" style={{ fontSize: 16 }} /> {lang === 'fr' ? 'Composer maintenant' : 'Dial now'}
              </div>
            </a>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <i className="ti ti-shield-check" style={{ fontSize: 14, color: C.green }} /> {t.donNote}
            </p>
          </div>
        </div>
      </section>
      </Reveal>

      {/* ═══ WHATSAPP FLOTTANT ═══ */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lang === 'fr' ? 'Bonjour, je souhaite en savoir plus sur les projets de recherche.' : 'Hello, I would like to know more about research projects.')}`}
        target="_blank" rel="noopener noreferrer"
        className="landing-whatsapp-float"
        title={t.contactWa}
      >
        <i className="ti ti-brand-whatsapp" style={{ fontSize: 28 }} />
      </a>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            {t.copy}
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
              {t.espaceMinresi}
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

/* ── WhatsApp Float ── */
.landing-whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #25D366;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.4);
  z-index: 999;
  transition: transform .3s, box-shadow .3s;
  text-decoration: none;
  animation: landing-wa-pulse 2s infinite;
}
.landing-whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(37,211,102,0.5);
}
@keyframes landing-wa-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.4); }
  50% { box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 0 0 12px rgba(37,211,102,0.15); }
}

/* ══════ Responsive ══════ */
@media (max-width: 1024px) {
  .landing-three-grid { grid-template-columns: 1fr; }
  .landing-features-grid { grid-template-columns: repeat(2, 1fr); }
  .landing-stats-inner { grid-template-columns: repeat(2, 1fr); }
  .landing-navbar { padding: 0 16px; }
  .landing-container { padding: 0 20px; }
}
@media (max-width: 768px) {
  .landing-hero { padding: 80px 16px 40px !important; }
  .landing-hero-inner { flex-direction: column; text-align: center; gap: 32px !important; }
  .landing-hero-left h1 { font-size: 28px !important; }
  .landing-hero-left p { margin-left: auto; margin-right: auto; font-size: 14px !important; }
  .landing-hero-left > div:last-child { justify-content: center; }
  .landing-hero-right { justify-content: center; }
  .landing-hero-img-wrap { max-width: 100%; height: 240px; }
  .landing-hero-quote { bottom: 10px; left: 10px; right: 10px; padding: 12px 14px; }
  .landing-nav-links { display: none; }
  .landing-features-grid { grid-template-columns: 1fr; }
  .landing-stats-inner { grid-template-columns: repeat(2, 1fr); }
  .landing-stat-card { padding: 16px; }
  .landing-stat-card div:last-child > div:first-child { font-size: 22px !important; }
  .landing-cta { padding: 48px 20px !important; }
  .landing-cta-inner h2 { font-size: 22px !important; }
  .landing-collab { padding: 40px 20px !important; }
  .landing-footer { padding: 32px 20px; }
  .landing-whatsapp-float { width: 52px; height: 52px; bottom: 16px; right: 16px; }
  .landing-whatsapp-float i { font-size: 24px !important; }
}
@media (max-width: 480px) {
  .landing-hero-left h1 { font-size: 24px !important; }
  .landing-stats-inner { grid-template-columns: 1fr; }
  .landing-hero-img-wrap { height: 200px; }
  .landing-btn-green, .landing-btn-outline { width: 100%; justify-content: center; text-align: center; }
  .landing-search-bar { flex-direction: column; border: none; gap: 8px; }
  .landing-search-bar input { border: 2px solid #E5E7EB !important; border-radius: 12px !important; }
  .landing-search-bar button { border-radius: 12px !important; width: 100%; }
}
`
