import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { addExpense } from '../../api/project.api'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { FormGroup, Input, Select, Textarea } from '../ui/FormField.jsx'
import { EXPENSE_CATS } from '../../utils/constants'

const today = () => new Date().toISOString().split('T')[0]
const INIT = { categorie: 'Personnel', montant: '', date: today(), description: '' }

export default function AddExpenseModal({ isOpen, onClose, projectId, onSaved }) {
  const { lang } = useApp()
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.montant || parseFloat(form.montant) <= 0) return
    setLoading(true)
    try {
      const res = await addExpense(projectId, { ...form, montant: parseFloat(form.montant) })
      setForm(INIT)
      onSaved(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fr' ? 'Saisir une dépense' : 'Add Expense'}>
      <FormGroup label={lang === 'fr' ? 'Catégorie' : 'Category'}>
        <Select value={form.categorie} onChange={set('categorie')}>
          {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
        </Select>
      </FormGroup>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormGroup label={lang === 'fr' ? 'Montant (FCFA)' : 'Amount (FCFA)'} required>
          <Input type="number" value={form.montant} onChange={set('montant')} placeholder="0" min="0" />
        </FormGroup>
        <FormGroup label={lang === 'fr' ? 'Date' : 'Date'} required>
          <Input type="date" value={form.date} onChange={set('date')} />
        </FormGroup>
      </div>
      <FormGroup label={lang === 'fr' ? 'Description' : 'Description'}>
        <Textarea value={form.description} onChange={set('description')} rows={2} />
      </FormGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <Button style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</Button>
        <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit} disabled={loading} icon="receipt">
          {loading ? '...' : (lang === 'fr' ? 'Enregistrer' : 'Save')}
        </Button>
      </div>
    </Modal>
  )
}
