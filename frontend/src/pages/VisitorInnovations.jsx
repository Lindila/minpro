import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const INSTITUTES = [
  { sigle: 'IRAD', nom: "Institut de Recherche Agricole pour le Développement", domaine: 'Agriculture', icon: 'plant-2' },
  { sigle: 'IMPM', nom: "Institut de Recherches Médicales et d'Études des Plantes Médicinales", domaine: 'Santé', icon: 'stethoscope' },
  { sigle: 'INC', nom: "Institut National de Cartographie", domaine: 'Cartographie', icon: 'map' },
  { sigle: 'IRGM', nom: "Institut de Recherches Géologiques et Minières", domaine: 'Géologie', icon: 'mountain' },
  { sigle: 'MIPROMALO', nom: "Mission de Promotion des Matériaux Locaux", domaine: 'Matériaux', icon: 'brick' },
  { sigle: 'ANRP', nom: "Agence Nationale de Radioprotection", domaine: 'Radioprotection', icon: 'atom' },
  { sigle: 'CNE', nom: "Centre National d'Éducation", domaine: 'Éducation', icon: 'school' },
  { sigle: 'CNDT', nom: "Comité National de Développement des Technologies", domaine: 'Technologie', icon: 'cpu' },
]

const SAMPLE_PROJECTS = [
  { titre: 'Amélioration variétale du manioc', institut: 'IRAD', statut: 'En cours', icon: 'flask' },
  { titre: 'Cartographie numérique du Littoral', institut: 'INC', statut: 'En cours', icon: 'map-pin' },
  { titre: 'Étude des plantes anti-palu', institut: 'IMPM', statut: 'Terminé', icon: 'leaf' },
  { titre: 'Inventaire minier du Nord', institut: 'IRGM', statut: 'En cours', icon: 'pickaxe' },
  { titre: 'Matériaux de construction locaux', institut: 'MIPROMALO', statut: 'Planifié', icon: 'building' },
  { titre: 'Surveillance radiologique nationale', institut: 'ANRP', statut: 'En cours', icon: 'activity' },
]

export default function VisitorInnovations() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/visitor/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7F5' }}>
        <i className="ti ti-loader spin" style={{ fontSize: 32, color: '#1B4D3E' }} />
      </div>
    )
  }

  if (!user || user.role !== 'visitor') return null

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navLeft}>
            <div style={styles.navLogo}>
              <i className="ti ti-layers-intersect" style={{ fontSize: 22, color: '#fff' }} />
            </div>
            <span style={styles.navBrand}>SIGPRO-MINRESI</span>
          </div>

          <div style={styles.navLinks}>
            <a href="#accueil" style={styles.navLink}>
              <i className="ti ti-home" style={{ fontSize: 16 }} /> Accueil Innovation
            </a>
            <a href="#projets" style={styles.navLink}>
              <i className="ti ti-folder" style={{ fontSize: 16 }} /> Projets
            </a>
            <a href="#instituts" style={styles.navLink}>
              <i className="ti ti-building" style={{ fontSize: 16 }} /> Instituts
            </a>
            <span style={styles.navLink}>
              <i className="ti ti-user" style={{ fontSize: 16 }} /> {user.prenom} {user.nom}
            </span>
            <button
              onClick={() => { logout(); navigate('/visitor/login') }}
              style={styles.logoutBtn}
            >
              <i className="ti ti-logout" style={{ fontSize: 16 }} /> D&eacute;connexion
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div id="accueil" style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Portail d'Innovation &mdash; Cameroun
          </h1>
          <p style={styles.heroSub}>
            D&eacute;couvrez les projets de recherche et d'innovation des instituts du MINRESI
          </p>
        </div>
      </div>

      {/* Instituts */}
      <section id="instituts" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            <i className="ti ti-building" style={{ color: '#1B4D3E' }} /> Instituts de recherche du MINRESI
          </h2>
          <p style={styles.sectionSub}>
            8 instituts au service de la recherche et de l'innovation camerounaise
          </p>
        </div>

        <div style={styles.grid}>
          {INSTITUTES.map((inst) => (
            <div key={inst.sigle} style={styles.instCard}>
              <div style={styles.instIconWrap}>
                <i className={`ti ti-${inst.icon}`} style={{ fontSize: 28, color: '#1B4D3E' }} />
              </div>
              <div style={styles.instSigle}>{inst.sigle}</div>
              <div style={styles.instNom}>{inst.nom}</div>
              <span style={styles.instBadge}>{inst.domaine}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projets */}
      <section id="projets" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            <i className="ti ti-flask" style={{ color: '#1B4D3E' }} /> Projets de recherche publi&eacute;s
          </h2>
          <p style={styles.sectionSub}>
            Suivez l'avancement des projets de recherche en cours au Cameroun
          </p>
        </div>

        <div style={styles.projectGrid}>
          {SAMPLE_PROJECTS.map((proj, i) => (
            <div key={i} style={styles.projCard}>
              <div style={styles.projTop}>
                <div style={styles.projIconWrap}>
                  <i className={`ti ti-${proj.icon}`} style={{ fontSize: 20, color: '#1B4D3E' }} />
                </div>
                <span style={{
                  ...styles.projStatut,
                  background: proj.statut === 'En cours' ? '#E8F4EF' : proj.statut === 'Terminé' ? '#DBEAFE' : '#FEF3C7',
                  color: proj.statut === 'En cours' ? '#1B4D3E' : proj.statut === 'Terminé' ? '#1E40AF' : '#92400E',
                }}>
                  {proj.statut}
                </span>
              </div>
              <div style={styles.projTitre}>{proj.titre}</div>
              <div style={styles.projInstitut}>
                <i className="ti ti-building" style={{ fontSize: 13 }} /> {proj.institut}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section style={{ ...styles.section, paddingBottom: 60 }}>
        <div style={styles.comingSoon}>
          <div style={styles.comingSoonIcon}>
            <i className="ti ti-sparkles" style={{ fontSize: 36, color: '#1B4D3E' }} />
          </div>
          <h3 style={styles.comingSoonTitle}>Contenu premium &mdash; Bient&ocirc;t disponible</h3>
          <p style={styles.comingSoonText}>
            Acc&eacute;dez bient&ocirc;t aux rapports d&eacute;taill&eacute;s, aux donn&eacute;es statistiques,
            aux publications scientifiques et aux opportunit&eacute;s de collaboration avec les chercheurs du MINRESI.
          </p>
          <div style={styles.comingSoonFeatures}>
            <div style={styles.csFeature}>
              <i className="ti ti-file-analytics" style={{ fontSize: 20, color: '#1B4D3E' }} />
              <span>Rapports d&eacute;taill&eacute;s</span>
            </div>
            <div style={styles.csFeature}>
              <i className="ti ti-chart-bar" style={{ fontSize: 20, color: '#1B4D3E' }} />
              <span>Statistiques</span>
            </div>
            <div style={styles.csFeature}>
              <i className="ti ti-book" style={{ fontSize: 20, color: '#1B4D3E' }} />
              <span>Publications</span>
            </div>
            <div style={styles.csFeature}>
              <i className="ti ti-users-group" style={{ fontSize: 20, color: '#1B4D3E' }} />
              <span>Collaborations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerText}>
          SIGPRO-MINRESI &mdash; Portail d'Innovation et de Recherche du Cameroun
        </div>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F5F7F5',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* Nav */
  nav: {
    background: '#1B4D3E',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  navInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  navLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBrand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: -0.3,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  navLink: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 12px',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: 'none',
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'inherit',
    marginLeft: 4,
  },

  /* Hero */
  hero: {
    background: 'linear-gradient(135deg, #1B4D3E 0%, #2D7A5F 100%)',
    padding: '56px 24px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: 700,
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 12px 0',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    lineHeight: 1.6,
  },

  /* Section */
  section: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 24px 0',
  },
  sectionHeader: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 6px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sectionSub: {
    fontSize: 14,
    color: '#6B7280',
    margin: 0,
  },

  /* Institutes Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260, 1fr))',
    gap: 16,
  },
  instCard: {
    background: '#fff',
    borderRadius: 16,
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #F3F4F6',
    transition: 'box-shadow 0.2s, transform 0.2s',
    display: 'inline-block',
    width: 260,
    verticalAlign: 'top',
    margin: '0 8px 16px 0',
  },
  instIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: '#E8F4EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  instSigle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1B4D3E',
    marginBottom: 6,
  },
  instNom: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 1.4,
    marginBottom: 10,
    minHeight: 34,
  },
  instBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#E8F4EF',
    color: '#1B4D3E',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },

  /* Projects Grid */
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  projCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #F3F4F6',
  },
  projTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  projIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: '#E8F4EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  projStatut: {
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  projTitre: {
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 6,
  },
  projInstitut: {
    fontSize: 12,
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },

  /* Coming soon */
  comingSoon: {
    background: '#fff',
    borderRadius: 20,
    padding: '48px 32px',
    textAlign: 'center',
    border: '2px dashed #D1D5DB',
  },
  comingSoonIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    background: '#E8F4EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 10px 0',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#6B7280',
    maxWidth: 500,
    margin: '0 auto 24px',
    lineHeight: 1.6,
  },
  comingSoonFeatures: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  csFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    padding: '10px 18px',
    background: '#F9FAFB',
    borderRadius: 10,
  },

  /* Footer */
  footer: {
    background: '#1B4D3E',
    padding: '20px 24px',
    textAlign: 'center',
    marginTop: 0,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 500,
  },
}
