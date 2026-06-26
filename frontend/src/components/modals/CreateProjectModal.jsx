import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp }  from '../../context/AppContext'
import { createProject } from '../../api/project.api'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { FormGroup, Input, Select, Textarea } from '../ui/FormField.jsx'
import { DOMAINS, STATUSES } from '../../utils/constants'

const INIT = { intitule: '', description: '', domaine: 'Agriculture', statut: 'En préparation', institute: '', dateDebut: '', dateFin: '', budgetInitial: '', bailleurSource: '' }

export default function CreateProjectModal({ isOpen, onClose, institutes, onCreated }) {
  const { user } = useAuth()
  const { lang } = useApp()
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.intitule.trim() || !form.institute || !form.dateDebut || !form.dateFin) {
      setError(lang === 'fr' ? 'Les champs marqués * sont requis' : 'Fields marked * are required')
      return
    }
    setError(''); setLoading(true)
    try {
      const data = {
        intitule: form.intitule, description: form.description,
        domaine: form.domaine, statut: form.statut,
        institute: form.institute, chefProjet: user._id,
        dateDebut: form.dateDebut, dateFin: form.dateFin,
        budgetInitial: parseInt(form.budgetInitial) || 0,
        bailleurs: form.bailleurSource ? [{ source: form.bailleurSource, montant: parseInt(form.budgetInitial) || 0 }] : [],
      }
      const res = await createProject(data)
      setForm(INIT)
      onCreated(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fr' ? 'Créer un nouveau projet' : 'Create New Project'} width={560}>
      <div style={{ display: 'grid', gap: 0 }}>
        <FormGroup label={lang === 'fr' ? 'Intitulé du projet' : 'Project Title'} required>
          <Input value={form.intitule} onChange={set('intitule')} placeholder={lang === 'fr' ? 'Titre du projet...' : 'Project title...'} />
        </FormGroup>
        <FormGroup label="Description">
          <Textarea value={form.description} onChange={set('description')} rows={2} />
        </FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormGroup label={lang === 'fr' ? 'Domaine' : 'Domain'}>
            <Select value={form.domaine} onChange={set('domaine')}>
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </Select>
          </FormGroup>
          <FormGroup label={lang === 'fr' ? 'Statut initial' : 'Initial Status'}>
            <Select value={form.statut} onChange={set('statut')}>
              {STATUSES.slice(0,2).map(s => <option key={s}>{s}</option>)}
            </Select>
          </FormGroup>
        </div>
        <FormGroup label={lang === 'fr' ? 'Institut porteur' : 'Lead Institute'} required>
          <Select value={form.institute} onChange={set('institute')}>
            <option value="">— {lang === 'fr' ? 'Sélectionner un institut' : 'Select an institute'} —</option>
            {institutes.map(i => <option key={i._id} value={i._id}>{i.sigle} — {i.nom}</option>)}
          </Select>
        </FormGroup>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormGroup label={lang === 'fr' ? 'Date de début' : 'Start Date'} required>
            <Input type="date" value={form.dateDebut} onChange={set('dateDebut')} />
          </FormGroup>
          <FormGroup label={lang === 'fr' ? 'Date de fin prévue' : 'End Date'} required>
            <Input type="date" value={form.dateFin} onChange={set('dateFin')} />
          </FormGroup>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormGroup label={lang === 'fr' ? 'Bailleur de fonds' : 'Funding Source'}>
            <Input value={form.bailleurSource} onChange={set('bailleurSource')} placeholder="AFD, BIP, IAEA..." />
          </FormGroup>
          <FormGroup label={lang === 'fr' ? 'Budget initial (FCFA)' : 'Initial Budget (FCFA)'}>
            <Input type="number" value={form.budgetInitial} onChange={set('budgetInitial')} placeholder="0" min="0" />
          </FormGroup>
        </div>
        {error && <div style={{ color: '#DC2626', fontSize: 12, marginBottom: 10, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <Button style={{ flex: 1, justifyContent: 'center' }} onClick={onClose} disabled={loading}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</Button>
          <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit} disabled={loading} icon="folder-plus">
            {loading ? (lang === 'fr' ? 'Création...' : 'Creating...') : (lang === 'fr' ? 'Créer le projet' : 'Create Project')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
