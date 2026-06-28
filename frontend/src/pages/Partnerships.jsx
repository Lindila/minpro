import { useState, useEffect } from 'react'
import { getProjects } from '../api/project.api'
import { useApp }  from '../context/AppContext'
import Card        from '../components/ui/Card.jsx'
import Badge       from '../components/ui/Badge.jsx'
import Loader      from '../components/ui/Loader.jsx'
import EmptyState  from '../components/ui/EmptyState.jsx'
import { formatMoney } from '../utils/formatters'

export default function Partnerships() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const { lang } = useApp()

  useEffect(() => {
    getProjects()
      .then(r => setProjects(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const allBailleurs = []
  projects.forEach(p => {
    (p.bailleurs || []).forEach(b => {
      allBailleurs.push({ ...b, projectIntitule: p.intitule, projectCode: p.code, institute: p.institute?.sigle || '—' })
    })
  })

  const bySource = {}
  allBailleurs.forEach(b => {
    if (!bySource[b.source]) bySource[b.source] = { source: b.source, total: 0, projects: [] }
    bySource[b.source].total += b.montant
    bySource[b.source].projects.push(b)
  })
  const grouped = Object.values(bySource).sort((a, b) => b.total - a.total)

  const filtered = search
    ? grouped.filter(g => g.source.toLowerCase().includes(search.toLowerCase()))
    : grouped

  const totalFinancement = allBailleurs.reduce((s, b) => s + b.montant, 0)
  const nbPartenaires = grouped.length
  const nbProjetsFinances = new Set(allBailleurs.map(b => b.projectCode)).size

  const filterStyle = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', cursor: 'text', boxSizing: 'border-box' }

  if (loading) return <Loader label={lang === 'fr' ? 'Chargement...' : 'Loading...'} />

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }} className="page-stats-grid">
        {[
          { icon: 'handshake', bg: '#F3E8FF', color: '#7C3AED', label: lang === 'fr' ? 'Partenaires / Bailleurs' : 'Partners / Funders', value: nbPartenaires },
          { icon: 'coins', bg: '#FEF3C7', color: '#D97706', label: lang === 'fr' ? 'Financement total' : 'Total Funding', value: formatMoney(totalFinancement) },
          { icon: 'folder', bg: '#DCFCE7', color: '#16A34A', label: lang === 'fr' ? 'Projets financés' : 'Funded Projects', value: nbProjetsFinances },
        ].map((s, i) => (
          <Card key={i} padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`ti ti-${s.icon}`} style={{ fontSize: 22, color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', letterSpacing: '-.5px' }}>{s.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 16, pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher un partenaire...' : 'Search partner...'}
            style={{ ...filterStyle, paddingLeft: 34, width: '100%' }}
          />
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
        {filtered.length} {lang === 'fr' ? 'partenaire(s)' : 'partner(s)'}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="handshake" title={lang === 'fr' ? 'Aucun partenariat trouvé' : 'No partnerships found'} subtitle={lang === 'fr' ? 'Les bailleurs apparaîtront ici une fois ajoutés aux projets' : 'Funders will appear here once added to projects'} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }} className="page-cards-grid">
          {filtered.map((g, i) => (
            <Card key={i} padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="ti ti-building-bank" style={{ fontSize: 22, color: '#7C3AED' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{g.source}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    {g.projects.length} {lang === 'fr' ? 'projet(s)' : 'project(s)'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#7C3AED' }}>{formatMoney(g.total)}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{lang === 'fr' ? 'Total engagé' : 'Total committed'}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 10 }}>
                {g.projects.map((p, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 12 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ fontWeight: 500, color: '#374151' }}>{p.projectIntitule}</span>
                      <span style={{ color: '#9CA3AF', marginLeft: 6 }}>{p.projectCode}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <Badge variant="gray">{p.institute}</Badge>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{formatMoney(p.montant)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
