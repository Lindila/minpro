import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function BarChart({ byInstitute = {}, lang }) {
  const labels = Object.keys(byInstitute)
  const values = Object.values(byInstitute)
  return (
    <Bar
      data={{
        labels,
        datasets: [{
          label: lang === 'fr' ? 'Projets' : 'Projects',
          data: values,
          backgroundColor: '#1B4D3E',
          borderRadius: 6, borderSkipped: false,
        }],
      }}
      options={{
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' } } },
          y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 11, family: 'Inter' }, stepSize: 1 } },
        },
      }}
    />
  )
}
