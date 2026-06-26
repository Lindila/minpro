export const daysUntil = (dateStr) => {
  if (!dateStr) return null
  return Math.round((new Date(dateStr) - new Date()) / 86400000)
}

export const getMilestoneStatus = (milestone) => {
  if (milestone.statut === 'done') return 'done'
  const days = daysUntil(milestone.datePrevue)
  return days !== null && days < 0 ? 'late' : 'pending'
}
