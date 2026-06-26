import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { createUser } from '../../api/user.api'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { FormGroup, Input, Select } from '../ui/FormField.jsx'

const INIT = { prenom: '', nom: '', email: '', password: '', role: 'ch', institute: '' }

export default function CreateUserModal({ isOpen, onClose, institutes, onCreated }) {
  const { lang } = useApp()
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.prenom || !form.nom || !form.email || !form.password) {
      setError(lang === 'fr' ? 'Tous les champs sont requis' : 'All fields required'); return
    }
    setError(''); setLoading(true)
    try {
      const res = await createUser(form)
      setForm(INIT)
      onCreated(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur')
    } finally { setLoading(false) }
  }

  const ROLES = { admin: 'Admin MINRESI', chef: 'Chef de projet', dir: 'Directeur Institut', ch: 'Chercheur' }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lang === 'fr' ? 'Créer un utilisateur' : 'Create User'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormGroup label={lang === 'fr' ? 'Prénom' : 'First Name'} required>
          <Input value={form.prenom} onChange={set('prenom')} />
        </FormGroup>
        <FormGroup label={lang === 'fr' ? 'Nom' : 'Last Name'} required>
          <Input value={form.nom} onChange={set('nom')} />
        </FormGroup>
      </div>
      <FormGroup label="Email" required>
        <Input type="email" value={form.email} onChange={set('email')} placeholder="utilisateur@minresi.cm" />
      </FormGroup>
      <FormGroup label={lang === 'fr' ? 'Mot de passe' : 'Password'} required>
        <Input type="password" value={form.password} onChange={set('password')} />
      </FormGroup>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormGroup label={lang === 'fr' ? 'Rôle' : 'Role'}>
          <Select value={form.role} onChange={set('role')}>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="Institut">
          <Select value={form.institute} onChange={set('institute')}>
            <option value="">{lang === 'fr' ? 'Aucun' : 'None'}</option>
            {institutes.map(i => <option key={i._id} value={i._id}>{i.sigle}</option>)}
          </Select>
        </FormGroup>
      </div>
      {error && <div style={{ color: '#DC2626', fontSize: 12, marginBottom: 10, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <Button style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</Button>
        <Button variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit} disabled={loading} icon="user-plus">
          {loading ? '...' : (lang === 'fr' ? 'Créer' : 'Create')}
        </Button>
      </div>
    </Modal>
  )
}
