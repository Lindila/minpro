import { useState, useEffect, useMemo } from 'react'
import { getProjects } from '../api/project.api'
import { useApp }  from '../context/AppContext'
import Card        from '../components/ui/Card.jsx'
import Badge       from '../components/ui/Badge.jsx'
import Loader      from '../components/ui/Loader.jsx'
import { formatDate } from '../utils/formatters'

/* ── helpers ─────────────────────────────────────────── */

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

/** Monday = 0 ... Sunday = 6 (ISO style) */
function startDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth() &&
         a.getDate()     === b.getDate()
}

function isSameMonth(date, year, month) {
  return date.getFullYear() === year && date.getMonth() === month
}

/* ── translations ────────────────────────────────────── */

const T = {
  fr: {
    title:        'Calendrier des projets',
    today:        "Aujourd'hui",
    months: ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'],
    days:   ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    events:       'Evenements du mois',
    noEvents:     'Aucun evenement ce mois-ci',
    start:        'Debut de projet',
    end:          'Fin de projet',
    milestone:    'Jalon',
    done:         'Termine',
    pending:      'En attente',
    overdue:      'En retard',
    responsible:  'Responsable',
    loading:      'Chargement du calendrier...',
  },
  en: {
    title:        'Project Calendar',
    today:        'Today',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    days:   ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    events:       'Events this month',
    noEvents:     'No events this month',
    start:        'Project start',
    end:          'Project end',
    milestone:    'Milestone',
    done:         'Done',
    pending:      'Pending',
    overdue:      'Overdue',
    responsible:  'Responsible',
    loading:      'Loading calendar...',
  },
}

/* ── event builder ───────────────────────────────────── */

function buildEvents(projects, year, month, t) {
  const events = []

  projects.forEach(p => {
    const pName = p.intitule || p.code

    // project start date
    if (p.dateDebut) {
      const d = new Date(p.dateDebut)
      if (isSameMonth(d, year, month)) {
        events.push({
          date: d,
          type: 'start',
          label: t.start,
          name: pName,
          project: pName,
          institute: p.institute?.sigle || '',
          color: '#2563EB',
          icon: 'rocket',
        })
      }
    }

    // project end date
    if (p.dateFin) {
      const d = new Date(p.dateFin)
      if (isSameMonth(d, year, month)) {
        events.push({
          date: d,
          type: 'end',
          label: t.end,
          name: pName,
          project: pName,
          institute: p.institute?.sigle || '',
          color: '#DC2626',
          icon: 'flag-filled',
        })
      }
    }

    // milestones
    if (p.milestones) {
      p.milestones.forEach(m => {
        const dPrevue = m.datePrevue ? new Date(m.datePrevue) : null
        if (dPrevue && isSameMonth(dPrevue, year, month)) {
          const now = new Date()
          let status, color, variant
          if (m.statut === 'done') {
            status = t.done
            color  = '#16A34A'
            variant = 'green'
          } else if (dPrevue < now) {
            status = t.overdue
            color  = '#DC2626'
            variant = 'red'
          } else {
            status = t.pending
            color  = '#D97706'
            variant = 'yellow'
          }

          const resp = m.responsable
            ? `${m.responsable.prenom || ''} ${m.responsable.nom || ''}`.trim()
            : ''

          events.push({
            date: dPrevue,
            type: 'milestone',
            label: t.milestone,
            name: m.nom,
            project: pName,
            institute: p.institute?.sigle || '',
            color,
            variant,
            status,
            responsible: resp,
            icon: 'flag',
          })
        }
      })
    }
  })

  events.sort((a, b) => a.date - b.date)
  return events
}

/* ── styles ──────────────────────────────────────────── */

const navBtn = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 34, height: 34, border: '1px solid #E5E7EB', borderRadius: 8,
  background: 'white', cursor: 'pointer', fontSize: 16, color: '#374151',
  transition: 'background .15s',
}

const cellBase = {
  position: 'relative',
  textAlign: 'center',
  padding: '8px 4px',
  fontSize: 13,
  borderRadius: 8,
  cursor: 'default',
  minHeight: 38,
  transition: 'background .1s',
}

/* ── component ───────────────────────────────────────── */

export default function Calendar() {
  const { lang } = useApp()
  const t = T[lang] || T.fr

  const todayDate = new Date()
  const [year,     setYear]     = useState(todayDate.getFullYear())
  const [month,    setMonth]    = useState(todayDate.getMonth())
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getProjects()
      .then(r => setProjects(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const events = useMemo(
    () => buildEvents(projects, year, month, t),
    [projects, year, month, t]
  )

  /* map: day number -> array of dot colors for that day */
  const dotMap = useMemo(() => {
    const map = {}
    events.forEach(ev => {
      const day = ev.date.getDate()
      if (!map[day]) map[day] = []
      if (!map[day].includes(ev.color)) map[day].push(ev.color)
    })
    return map
  }, [events])

  /* ── navigation ── */
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  const goToday = () => {
    setYear(todayDate.getFullYear())
    setMonth(todayDate.getMonth())
  }

  /* ── grid data ── */
  const totalDays = daysInMonth(year, month)
  const startDay  = startDayOfMonth(year, month)
  const cells     = []

  // empty leading cells
  for (let i = 0; i < startDay; i++) cells.push(null)
  // actual days
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  if (loading) return <Loader label={t.loading} />

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(27,77,62,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-calendar" style={{ fontSize: 20, color: '#1B4D3E' }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>{t.title}</h2>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              {events.length} {lang === 'fr' ? 'evenement(s)' : 'event(s)'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Month navigation ── */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={prevMonth} style={navBtn} title="Previous">
            <i className="ti ti-chevron-left" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>
              {t.months[month]} {year}
            </span>
            <button onClick={goToday} style={{ ...navBtn, fontSize: 11, fontWeight: 600, width: 'auto', padding: '0 10px', color: '#1B4D3E' }}>
              {t.today}
            </button>
          </div>
          <button onClick={nextMonth} style={navBtn} title="Next">
            <i className="ti ti-chevron-right" />
          </button>
        </div>

        {/* ── Day headers ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {t.days.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', padding: '6px 0', letterSpacing: '.5px' }}>
              {d}
            </div>
          ))}
        </div>

        {/* ── Day grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} style={cellBase} />

            const isToday = sameDay(new Date(year, month, day), todayDate)
            const dots = dotMap[day] || []

            return (
              <div
                key={day}
                style={{
                  ...cellBase,
                  background: isToday ? '#1B4D3E' : 'transparent',
                  color: isToday ? '#fff' : '#374151',
                  fontWeight: isToday ? 700 : dots.length ? 600 : 400,
                }}
              >
                {day}
                {/* dots */}
                {dots.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 3 }}>
                    {dots.slice(0, 3).map((c, j) => (
                      <span key={j} style={{
                        display: 'inline-block', width: 6, height: 6,
                        borderRadius: '50%', background: isToday ? '#fff' : c,
                        opacity: isToday ? .85 : 1,
                      }} />
                    ))}
                    {dots.length > 3 && (
                      <span style={{ fontSize: 9, color: isToday ? '#fff' : '#9CA3AF', lineHeight: '6px' }}>+</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Event list ── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{t.events}</span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            {t.months[month]} {year}
          </span>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
            <i className="ti ti-calendar-off" style={{ fontSize: 36, display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 13 }}>{t.noEvents}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {events.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  border: '1px solid #F3F4F6', background: '#FAFAFA',
                  transition: 'background .1s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
                onMouseOut={e  => e.currentTarget.style.background = '#FAFAFA'}
              >
                {/* date badge */}
                <div style={{
                  minWidth: 44, textAlign: 'center', padding: '4px 0',
                  borderRadius: 8, background: 'white', border: '1px solid #E5E7EB',
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
                    {ev.date.getDate()}
                  </div>
                  <div style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                    {t.months[month].slice(0, 3)}
                  </div>
                </div>

                {/* icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: ev.color + '18', flexShrink: 0,
                }}>
                  <i className={`ti ti-${ev.icon}`} style={{ fontSize: 16, color: ev.color }} />
                </div>

                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                    {ev.project}{ev.institute ? ` - ${ev.institute}` : ''}
                    {ev.responsible ? ` | ${t.responsible}: ${ev.responsible}` : ''}
                  </div>
                </div>

                {/* badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {ev.type === 'milestone' && ev.variant && (
                    <Badge variant={ev.variant}>{ev.status}</Badge>
                  )}
                  {ev.type === 'start' && <Badge variant="blue">{ev.label}</Badge>}
                  {ev.type === 'end'   && <Badge variant="red">{ev.label}</Badge>}
                </div>

                {/* formatted date */}
                <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatDate(ev.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
