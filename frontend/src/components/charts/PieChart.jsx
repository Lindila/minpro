import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export default function PieChart({ stats, lang }) {
  const labels = lang === 'fr'
    ? ['En cours', 'En préparation', 'Clôturés/Archivés', 'Suspendus']
    : ['Active', 'In Preparation', 'Closed', 'Suspended']
  return (
    <Doughnut
      data={{
        labels,
        datasets: [{
          data: [stats?.enCours || 0, stats?.enPrep || 0, stats?.clotures || 0, 0],
          backgroundColor: ['#16A34A', '#2563EB', '#9CA3AF', '#D97706'],
          borderWidth: 2, borderColor: 'white',
        }],
      }}
      options={{
        responsive: true, maintainAspectRatio: false,
        cutout: '64%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11, family: 'Inter' }, boxWidth: 12, padding: 8 } },
        },
      }}
    />
  )
}
