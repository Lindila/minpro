import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { addMilestone, updateMilestone } from '../../api/project.api'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { FormGroup, Input, Select, Textarea } from '../ui/FormField.jsx'
import { formatDateInput } from '../../utils/formatters'

const INIT = { nom: '', datePrevue: '', statut: 'pending', notes: '' }

export default function AddMilestoneModal({ isOpen, onClose, projectId, milestone, onSaved }) {
  const { lang } = useApp()
  const isEdit = !!milestone
  const [form, setForm] = useState(
    milestone ? { nom: milestone.nom, datePrevue: formatDateInput(milestone.datePrevue), statut: milestone.statut, notes: milestone.notes || '' }
              : INIT
  )
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.nom.trim() || !form.datePrevue) return
    setLoading(true)
    try {
      const fn = isEdit ? updateMilestone(projectId, milestone._id, form) : addMilestone(projectId, form)
      const res = await fn
      onSaved(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? (lang === 'fr' ? 'Modifier le jalon' : 'Edit Milestone') : (lang === 'fr' ? 'Nouveau jalon' : 'New Milestone')}>
      <FormGroup label={lang === 'fr' ? 'Intitulé du jalon' : 'Milestone Title'} required>
        <Input value={form.nom} onChange={set('nom')} placeholder={lang === 'fr' ? 'Nom du jalon...' : 'Milestone name...'} />
      </FormGroup>
      <FormGroup label={lang === 'fr' ? 'Date prévue' : 'Due Date'} required>
        <Input type="date" value={form.datePrevue} onChange={set('datePrevue')} />
      </FormGroup>
      {isEdit && (
        <FormGroup label="Statut">
          <Select value={form.statut} onChange={set('statut')}>
            <option value="pending">{lang === 'fr' ? 'En cours' : 'In Progress'}</option>
            <option value="done">{lang === 'fr' ? 'Complété' : 'Completed'}</option>
          </Select>
        </FormGroup>
      )}
      <FormGroup label={lang === 'fr' ? 'Notes' : 'Notes'}>
        <Textarea value={form.notes} onChange={set('notes')} rows={2} />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <Button style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</Button>
        <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit} disabled={loading} icon="check">
          {loading ? '...' : (lang === 'fr' ? 'Enregistrer' : 'Save')}
        </Button>
      </div>
    </Modal>
  )
}
