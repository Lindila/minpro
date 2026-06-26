export const formatMoney = (n) => {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA'
}

export const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR')
}

export const formatDateInput = (d) => {
  if (!d) return ''
  return new Date(d).toISOString().split('T')[0]
}

export const budgetPercent = (project) => {
  if (!project?.budgetInitial) return 0
  return Math.min(100, Math.round((project.budgetDepense / project.budgetInitial) * 100))
}

export const budgetColor = (pct) => {
  if (pct >= 90) return '#DC2626'
  if (pct >= 70) return '#D97706'
  return '#16A34A'
}
