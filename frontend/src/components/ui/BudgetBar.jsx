import { budgetColor } from '../../utils/formatters'

export default function BudgetBar({ pct = 0, height = 6 }) {
  return (
    <div style={{ height, background: '#E5E7EB', borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min(100, pct)}%`, height: '100%',
        background: budgetColor(pct),
        borderRadius: height / 2, transition: 'width .4s',
      }} />
    </div>
  )
}
