import { useState, useEffect } from 'react'
import { getResearchers } from '../api/researcher.api'
import { getInstitutes }  from '../api/institute.api'
import { useAuth } from '../context/AuthContext'
import { useApp }  from '../context/AppContext'
import Card        from '../components/ui/Card.jsx'
import Badge       from '../components/ui/Badge.jsx'
import Button      from '../components/ui/Button.jsx'
import Loader      from '../components/ui/Loader.jsx'
import EmptyState  from '../components/ui/EmptyState.jsx'
import { createResearcher } from '../api/researcher.api'
import Modal       from '../components/ui/Modal.jsx'
import { FormGroup, Input, Select } from '../components/ui/FormField.jsx'
import { GRADES } from '../utils/constants'

const INIT = { prenom: '', nom: '', email: '', telephone: '', grade: 'Chercheur', specialite: '', institute: '' }

export default function Researchers() {
  const [researchers, setResearchers] = useState([])
  const [institutes,  setInstitutes]  = useState([])
  const [search,      setSearch]      = useState('')
  const [fInst,       setFInst]       = useState('')
  const [showModal,   setShowModal]   = useState(false)
  const [form,        setForm]        = useState(INIT)
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const { canCreate } = useAuth()
  const { lang, showToast } = useApp()

  useEffect(() => {
    getInstitutes().then(r => setInstitutes(r.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getResearchers({ search: search || undefined, institute: fInst || undefined })
      .then(r => setResearchers(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, fInst])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleCreate = async () => {
    if (!form.prenom || !form.nom || !form.email || !form.institute) return
    setSaving(true)
    try {
      const r = await createResearcher(form)
      setResearchers(prev => [...prev, r.data.data])
      setForm(INIT); setShowModal(false)
      showToast(lang === 'fr' ? 'Chercheur ajouté !' : 'Researcher added!')
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const GRADE_CLR = {
    'Attaché de recherche':    'gray',
    'Chercheur':               'blue',
    'Maître de recherche':     'green',
    'Directeur de recherche':  'purple',
    'Chercheur hors classe':   'gold',
  }

  const filterStyle = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', cursor: 'pointer' }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 16, pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'fr' ? 'Nom, spécialité...' : 'Name, specialty...'} style={{ ...filterStyle, paddingLeft: 34, width: '100%', cursor: 'text', boxSizing: 'border-box' }} />
        </div>
        <select value={fInst} onChange={e => setFInst(e.target.value)} style={{ ...filterStyle, minWidth: 160 }}>
          <option value="">{lang === 'fr' ? 'Tous les instituts' : 'All institutes'}</option>
          {institutes.map(i => <option key={i._id} value={i._id}>{i.sigle}</option>)}
        </select>
        {canCreate && <Button variant="primary" icon="user-plus" onClick={() => setShowModal(true)}>{lang === 'fr' ? 'Nouveau chercheur' : 'New Researcher'}</Button>}
      </div>

      {!loading && <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>{researchers.length} {lang === 'fr' ? 'chercheur(s)' : 'researcher(s)'}</div>}

      {loading ? <Loader /> : researchers.length === 0 ? (
        <EmptyState icon="users-group" title={lang === 'fr' ? 'Aucun chercheur trouvé' : 'No researchers found'} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {researchers.map(r => (
            <Card key={r._id} padding={18}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(27,77,62,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 700, color: '#1B4D3E' }}>
                  {r.prenom[0]}{r.nom[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{r.prenom} {r.nom}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{r.specialite}</div>
                  <Badge variant={GRADE_CLR[r.grade] || 'gray'} style={{ fontSize: 10, marginBottom: 8 }}>{r.grade}</Badge>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {r.institute && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-building" style={{ fontSize: 13 }} />
                        <span style={{ fontWeight: 500 }}>{r.institute.sigle}</span>
                        <span style={{ color: '#9CA3AF' }}>— {r.institute.nom}</span>
                      </div>
                    )}
                    {r.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-mail" style={{ fontSize: 13 }} />
                        <span>{r.email}</span>
                      </div>
                    )}
                    {r.telephone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                        <i className="ti ti-phone" style={{ fontSize: 13 }} />
                        <span>{r.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={lang === 'fr' ? 'Ajouter un chercheur' : 'Add Researcher'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormGroup label={lang === 'fr' ? 'Prénom' : 'First Name'} required><Input value={form.prenom} onChange={set('prenom')} /></FormGroup>
          <FormGroup label={lang === 'fr' ? 'Nom' : 'Last Name'} required><Input value={form.nom} onChange={set('nom')} /></FormGroup>
        </div>
        <FormGroup label="Email" required><Input type="email" value={form.email} onChange={set('email')} /></FormGroup>
        <FormGroup label={lang === 'fr' ? 'Téléphone' : 'Phone'}><Input value={form.telephone} onChange={set('telephone')} /></FormGroup>
        <FormGroup label={lang === 'fr' ? 'Grade' : 'Grade'}><Select value={form.grade} onChange={set('grade')}>{GRADES.map(g => <option key={g}>{g}</option>)}</Select></FormGroup>
        <FormGroup label={lang === 'fr' ? 'Spécialité' : 'Specialty'} required><Input value={form.specialite} onChange={set('specialite')} /></FormGroup>
        <FormGroup label="Institut" required>
          <Select value={form.institute} onChange={set('institute')}>
            <option value="">—</option>
            {institutes.map(i => <option key={i._id} value={i._id}>{i.sigle}</option>)}
          </Select>
        </FormGroup>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Button style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</Button>
          <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleCreate} disabled={saving} icon="user-plus">
            {saving ? '...' : (lang === 'fr' ? 'Ajouter' : 'Add')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
