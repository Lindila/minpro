import { useState, useEffect } from 'react'
import { getInstitutes, createInstitute } from '../api/institute.api'
import { useAuth } from '../context/AuthContext'
import { useApp }  from '../context/AppContext'
import Card        from '../components/ui/Card.jsx'
import Badge       from '../components/ui/Badge.jsx'
import Button      from '../components/ui/Button.jsx'
import Loader      from '../components/ui/Loader.jsx'
import EmptyState  from '../components/ui/EmptyState.jsx'
import Modal       from '../components/ui/Modal.jsx'
import { FormGroup, Input, Select } from '../components/ui/FormField.jsx'

const INIT = { code: '', sigle: '', nom: '', domaine: '', adresse: '', telephone: '', email: '' }

const DOMAINES = [
  'Sciences fondamentales',
  'Sciences appliquées',
  'Sciences sociales et humaines',
  'Sciences de la santé',
  'Agriculture et développement rural',
  'Environnement et ressources naturelles',
  'Technologies de l\'information',
  'Énergie et industries extractives',
]

export default function Institutes() {
  const [institutes, setInstitutes] = useState([])
  const [search,     setSearch]     = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [form,       setForm]       = useState(INIT)
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const { isAdmin } = useAuth()
  const { lang, showToast } = useApp()

  useEffect(() => {
    setLoading(true)
    getInstitutes()
      .then(r => setInstitutes(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleCreate = async () => {
    if (!form.code || !form.sigle || !form.nom || !form.domaine) return
    setSaving(true)
    try {
      const r = await createInstitute(form)
      setInstitutes(prev => [...prev, r.data.data])
      setForm(INIT); setShowModal(false)
      showToast(lang === 'fr' ? 'Institut ajouté !' : 'Institute added!')
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const filtered = institutes.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (i.sigle && i.sigle.toLowerCase().includes(q)) ||
      (i.nom && i.nom.toLowerCase().includes(q)) ||
      (i.domaine && i.domaine.toLowerCase().includes(q)) ||
      (i.code && i.code.toLowerCase().includes(q))
    )
  })

  const DOMAINE_CLR = {
    'Sciences fondamentales':              'blue',
    'Sciences appliquées':                 'purple',
    'Sciences sociales et humaines':       'yellow',
    'Sciences de la santé':                'red',
    'Agriculture et développement rural':  'green',
    'Environnement et ressources naturelles': 'green',
    'Technologies de l\'information':      'blue',
    'Énergie et industries extractives':   'gray',
  }

  const filterStyle = {
    padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 9,
    fontSize: 13, fontFamily: 'inherit', outline: 'none',
    background: 'white', cursor: 'pointer',
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 16, pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'fr' ? 'Code, sigle, nom, domaine...' : 'Code, acronym, name, domain...'}
            style={{ ...filterStyle, paddingLeft: 34, width: '100%', cursor: 'text', boxSizing: 'border-box' }}
          />
        </div>
        {isAdmin && (
          <Button variant="primary" icon="building-plus" onClick={() => setShowModal(true)}>
            {lang === 'fr' ? 'Nouvel institut' : 'New Institute'}
          </Button>
        )}
      </div>

      {/* Count */}
      {!loading && (
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
          {filtered.length} {lang === 'fr' ? 'institut(s)' : 'institute(s)'}
        </div>
      )}

      {/* Content */}
      {loading ? <Loader /> : filtered.length === 0 ? (
        <EmptyState
          icon="building-off"
          title={lang === 'fr' ? 'Aucun institut trouvé' : 'No institutes found'}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map(inst => (
            <Card key={inst._id} padding={18}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Avatar */}
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'rgba(27,77,62,.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#1B4D3E',
                }}>
                  {inst.sigle ? inst.sigle.slice(0, 3) : '?'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{inst.sigle}</span>
                    <Badge variant={inst.actif !== false ? 'green' : 'red'} style={{ fontSize: 10 }}>
                      {inst.actif !== false
                        ? (lang === 'fr' ? 'Actif' : 'Active')
                        : (lang === 'fr' ? 'Inactif' : 'Inactive')}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>{inst.nom}</div>

                  {/* Domaine */}
                  <Badge variant={DOMAINE_CLR[inst.domaine] || 'gray'} style={{ fontSize: 10, marginBottom: 8 }}>
                    {inst.domaine}
                  </Badge>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                      <i className="ti ti-hash" style={{ fontSize: 13 }} />
                      <span style={{ fontWeight: 500 }}>{inst.code}</span>
                    </div>

                    {inst.directeur && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-user-star" style={{ fontSize: 13 }} />
                        <span>{inst.directeur.prenom} {inst.directeur.nom}</span>
                      </div>
                    )}

                    {inst.adresse && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-map-pin" style={{ fontSize: 13 }} />
                        <span>{inst.adresse}</span>
                      </div>
                    )}

                    {inst.telephone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-phone" style={{ fontSize: 13 }} />
                        <span>{inst.telephone}</span>
                      </div>
                    )}

                    {inst.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-mail" style={{ fontSize: 13 }} />
                        <span>{inst.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={lang === 'fr' ? 'Ajouter un institut' : 'Add Institute'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormGroup label="Code" required>
            <Input value={form.code} onChange={set('code')} placeholder="Ex: IRAD" />
          </FormGroup>
          <FormGroup label={lang === 'fr' ? 'Sigle' : 'Acronym'} required>
            <Input value={form.sigle} onChange={set('sigle')} placeholder="Ex: IRAD" />
          </FormGroup>
        </div>
        <FormGroup label={lang === 'fr' ? 'Nom complet' : 'Full Name'} required>
          <Input value={form.nom} onChange={set('nom')} placeholder={lang === 'fr' ? 'Institut de Recherche Agricole pour le Développement' : 'Full institute name'} />
        </FormGroup>
        <FormGroup label={lang === 'fr' ? 'Domaine de recherche' : 'Research Domain'} required>
          <Select value={form.domaine} onChange={set('domaine')}>
            <option value="">--</option>
            {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label={lang === 'fr' ? 'Adresse' : 'Address'}>
          <Input value={form.adresse} onChange={set('adresse')} placeholder={lang === 'fr' ? 'Yaoundé, Cameroun' : 'Yaounde, Cameroon'} />
        </FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormGroup label={lang === 'fr' ? 'Téléphone' : 'Phone'}>
            <Input value={form.telephone} onChange={set('telephone')} placeholder="+237 ..." />
          </FormGroup>
          <FormGroup label="Email">
            <Input type="email" value={form.email} onChange={set('email')} placeholder="contact@institut.cm" />
          </FormGroup>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Button style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
            {lang === 'fr' ? 'Annuler' : 'Cancel'}
          </Button>
          <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleCreate} disabled={saving} icon="building-plus">
            {saving ? '...' : (lang === 'fr' ? 'Ajouter' : 'Add')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
