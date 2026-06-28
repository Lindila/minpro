import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const TRANSLATIONS = {
  fr: {
    nav: {
      dashboard:    'Tableau de bord',
      projects:     'Projets',
      institutes:   'Instituts',
      researchers:  'Chercheurs',
      reports:      'Rapports',
      finances:     'Finances',
      partnerships: 'Partenariats',
      calendar:     'Calendrier',
      documents:    'Documents',
      settings:     'Paramètres',
      users:        'Utilisateurs',
    },
    roles: {
      dev:       'Développeur',
      admin:     'Admin MINRESI',
      chef:      'Chef de projet',
      dir:       'Directeur Institut',
      comptable: 'Comptable',
      ch:        'Chercheur',
      visitor:   'Visiteur',
    },
    statuses: {
      'En préparation': 'En préparation',
      'En cours':       'En cours',
      'Suspendu':       'Suspendu',
      'Clôturé':        'Clôturé',
      'Archivé':        'Archivé',
    },
    mstatus: { done: 'Complété', pending: 'En cours', late: 'En retard' },
    docstatus: { valid: 'Validé', pending: 'En attente', draft: 'Brouillon', rejete: 'Rejeté' },
    tabs: { info: 'Informations', milestones: 'Jalons', budget: 'Budget', docs: 'Documents' },
    actions: {
      save: 'Enregistrer', cancel: 'Annuler', create: 'Créer',
      edit: 'Modifier', delete: 'Supprimer', validate: 'Valider',
      reject: 'Rejeter', add: 'Ajouter', back: 'Retour',
    },
    common: {
      search:       'Rechercher...',
      loading:      'Chargement...',
      noData:       'Aucune donnée',
      allInstitutes:'Tous les instituts',
      allStatuses:  'Tous les statuts',
      yes:          'Oui',
      no:           'Non',
    },
  },
  en: {
    nav: {
      dashboard:    'Dashboard',
      projects:     'Projects',
      institutes:   'Institutes',
      researchers:  'Researchers',
      reports:      'Reports',
      finances:     'Finances',
      partnerships: 'Partnerships',
      calendar:     'Calendar',
      documents:    'Documents',
      settings:     'Settings',
      users:        'Users',
    },
    roles: {
      dev:       'Developer',
      admin:     'MINRESI Admin',
      chef:      'Project Manager',
      dir:       'Institute Director',
      comptable: 'Accountant',
      ch:        'Researcher',
      visitor:   'Visitor',
    },
    statuses: {
      'En préparation': 'In Preparation',
      'En cours':       'In Progress',
      'Suspendu':       'Suspended',
      'Clôturé':        'Closed',
      'Archivé':        'Archived',
    },
    mstatus: { done: 'Completed', pending: 'In Progress', late: 'Overdue' },
    docstatus: { valid: 'Validated', pending: 'Pending', draft: 'Draft', rejete: 'Rejected' },
    tabs: { info: 'Information', milestones: 'Milestones', budget: 'Budget', docs: 'Documents' },
    actions: {
      save: 'Save', cancel: 'Cancel', create: 'Create',
      edit: 'Edit', delete: 'Delete', validate: 'Validate',
      reject: 'Reject', add: 'Add', back: 'Back',
    },
    common: {
      search:       'Search...',
      loading:      'Loading...',
      noData:       'No data',
      allInstitutes:'All institutes',
      allStatuses:  'All statuses',
      yes:          'Yes',
      no:           'No',
    },
  },
}

export function AppProvider({ children }) {
  const [lang,  setLang]  = useState('fr')
  const [toast, setToast] = useState(null)

  const toggleLang = useCallback(() => setLang(l => l === 'fr' ? 'en' : 'fr'), [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // Traduction par chemin pointé : t('nav.projects')
  const t = useCallback((keyPath) => {
    const keys = keyPath.split('.')
    let val = TRANSLATIONS[lang]
    for (const k of keys) { if (val == null) break; val = val[k] }
    return val ?? keyPath
  }, [lang])

  return (
    <AppContext.Provider value={{ lang, toggleLang, toast, showToast, t }}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <i className={`ti ti-${toast.type === 'success' ? 'circle-check' : toast.type === 'error' ? 'alert-circle' : 'alert-triangle'}`} />
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
