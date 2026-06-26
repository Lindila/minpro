import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { addDocument } from '../../api/project.api'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { FormGroup, Input, Select } from '../ui/FormField.jsx'
import { DOC_TYPES } from '../../utils/constants'

const INIT = { nom: '', type: 'rapport', notes: '' }

export default function AddDocumentModal({ isOpen, onClose, projectId, onSaved }) {
  const { lang } = useApp()
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.nom.trim()) return
    setLoading(true)
    try {
      const res = await addDocument(projectId, form)
      setForm(INIT)
      onSaved(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fr' ? 'Déposer un document' : 'Upload Document'}>
      <FormGroup label={lang === 'fr' ? 'Nom du fichier' : 'File Name'} required>
        <Input value={form.nom} onChange={set('nom')} placeholder="rapport_avancement.pdf" />
      </FormGroup>
      <FormGroup label={lang === 'fr' ? 'Type de document' : 'Document Type'}>
        <Select value={form.type} onChange={set('type')}>
          {DOC_TYPES.map(d => <option key={d}>{d}</option>)}
        </Select>
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <Button style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</Button>
        <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit} disabled={loading} icon="file-upload">
          {loading ? '...' : (lang === 'fr' ? 'Déposer' : 'Submit')}
        </Button>
      </div>
    </Modal>
  )
}
