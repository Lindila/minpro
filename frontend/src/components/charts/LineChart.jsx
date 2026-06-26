import { Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function LineChart({ lang }) {
  const labels = lang === 'fr' ? MONTHS_FR : MONTHS_EN
  return (
    <Line
      data={{
        labels,
        datasets: [{
          label: lang === 'fr' ? 'Projets actifs' : 'Active Projects',
          data: [5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12],
          borderColor: '#1B4D3E', backgroundColor: 'rgba(27,77,62,.12)',
          tension: 0.4, fill: true,
          pointRadius: 4, pointBackgroundColor: '#1B4D3E', pointBorderColor: 'white', pointBorderWidth: 2,
        }],
      }}
      options={{
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' } } },
          y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 11, family: 'Inter' }, stepSize: 2 } },
        },
      }}
    />
  )
}
