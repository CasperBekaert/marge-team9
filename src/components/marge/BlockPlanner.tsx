'use client'
// Browser storage is restored after hydration and saved whenever the plan changes.
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type FormEvent } from 'react'
import { Actions, exportCSV, StorageNote } from './PlanningTools'
import { playSaved } from './Audio'
import {
  dateKey,
  migratePlan,
  monthDays,
  paintDay,
  planEntries,
  shiftMonth,
  type BlockPlan,
  type Subject,
} from '@/lib/block-plan'

const empty: BlockPlan = { subjects: [], days: [] }
const modes = ['Studeren', 'Herhalen', 'Rust', 'Wissen']
const dateLabel = (date: string) =>
  new Date(date + 'T12:00:00').toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
const monthLabel = (month: string) =>
  new Date(month + '-01T12:00:00').toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' })

export function BlockPlanner() {
  const [plan, setPlan] = useState<BlockPlan>(empty)
  const [loaded, setLoaded] = useState(false)
  const [readFailed, setReadFailed] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [start, setStart] = useState('')
  const [selected, setSelected] = useState('')
  const [mode, setMode] = useState('Studeren')
  const [editing, setEditing] = useState<Subject | null>(null)
  const [undo, setUndo] = useState<BlockPlan | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  // Restore after hydration. The old key stays intact as a migration backup.
  useEffect(() => {
    const now = new Date()
    let restored = empty
    try {
      const saved = localStorage.getItem('marge-blok-v2')
      restored = saved
        ? JSON.parse(saved)
        : migratePlan(JSON.parse(localStorage.getItem('marge-blok-v1') || '[]'))
      if (!Array.isArray(restored.subjects) || !Array.isArray(restored.days))
        throw new Error('Invalid saved plan')
      if (
        restored.subjects.some(
          (s) =>
            typeof s.id !== 'string' ||
            typeof s.name !== 'string' ||
            !Number.isFinite(s.credits) ||
            typeof s.exam !== 'string',
        ) ||
        restored.days.some(
          (d) =>
            typeof d.id !== 'string' ||
            typeof d.subject !== 'string' ||
            typeof d.kind !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(d.date),
        )
      )
        throw new Error('Invalid saved entries')
      setPlan(restored)
      setSelected(restored.subjects[0]?.id || '')
    } catch {
      restored = empty
      setReadFailed(true)
      setStorageError(true)
    }
    setStart(
      planEntries(restored)
        .find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date))
        ?.date.slice(0, 7) || dateKey(now.getFullYear(), now.getMonth(), 1).slice(0, 7),
    )
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded || readFailed) return
    try {
      localStorage.setItem('marge-blok-v2', JSON.stringify(plan))
    } catch {
      setStorageError(true)
    }
  }, [plan, loaded, readFailed])

  function change(next: BlockPlan, message: string) {
    setUndo(plan)
    setPlan(next)
    setNotice(message)
    setError('')
    playSaved()
  }
  function saveSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const subject = {
      id: editing?.id || crypto.randomUUID(),
      name: String(data.get('name')).trim(),
      credits: Number(data.get('credits')),
      exam: String(data.get('exam')),
    }
    if (!subject.name) {
      setError('Geef je vak een naam.')
      return
    }
    if (
      plan.subjects.some(
        (s) =>
          s.id !== subject.id && s.name.toLocaleLowerCase() === subject.name.toLocaleLowerCase(),
      )
    ) {
      setError('Dit vak staat er al in. Kies Wijzig bij dat vak.')
      return
    }
    change(
      {
        subjects: editing
          ? plan.subjects.map((s) => (s.id === subject.id ? subject : s))
          : [...plan.subjects, subject],
        days: plan.days.map((d) =>
          editing && d.subject === editing.name ? { ...d, subject: subject.name } : d,
        ),
      },
      `${subject.name} bewaard. Kies dit vak en klik op je studiedagen.`,
    )
    setSelected(subject.id)
    setEditing(null)
    form.reset()
  }
  const entries = planEntries(plan)
  const current = plan.subjects.find((s) => s.id === selected)
  const totalCredits = plan.subjects.reduce((sum, s) => sum + s.credits, 0)
  const studyCount = plan.days.filter((d) => ['Studeren', 'Herhalen'].includes(d.kind)).length
  const months = start ? [start, shiftMonth(start, 1), shiftMonth(start, 2)] : []
  const afterExam = plan.days.filter(
    (d) =>
      ['Studeren', 'Herhalen'].includes(d.kind) &&
      plan.subjects.some((s) => s.name === d.subject && s.exam && d.date >= s.exam),
  )

  return (
    <section className="tool block-planner" id="blokplanner" aria-labelledby="blok-title">
      <div className="tool-head">
        <div>
          <p className="eyebrow">Jouw blok, dag voor dag</p>
          <h3 id="blok-title">Geef elk vak zijn plek.</h3>
          <StorageNote error={storageError} />
        </div>
        <Actions
          download={() =>
            exportCSV('marge-blokplanning', [
              ['Datum', 'Vak of activiteit', 'Soort', 'Studiepunten'],
              ...entries.map((d) => [
                d.date,
                d.subject,
                d.kind,
                plan.subjects.find((s) => s.name === d.subject)?.credits || '',
              ]),
            ])
          }
        />
      </div>
      <p className="muted">
        Eerst je vakken en examens. Daarna kleur je studiedagen in, zoals in het oorspronkelijke
        werkblad. Houd ook ruimte voor herhalen en rust. Neem examendata over uit je officiële
        rooster.
      </p>
      <div className="planner-step">
        <h4>1. Zet je vakken en examens klaar</h4>
        <p className="smallprint">
          Studiepunten helpen je de verdeling afwegen; wat je al kent en hoe moeilijk je een vak
          vindt, telt ook mee.
        </p>
      </div>
      <form
        key={editing?.id || 'new'}
        onSubmit={saveSubject}
        className="field-grid planner-controls"
      >
        <div className="field">
          <label htmlFor="exam-subject">Vak</label>
          <input
            id="exam-subject"
            name="name"
            required
            maxLength={80}
            placeholder="Bijvoorbeeld: Economie"
            defaultValue={editing?.name || ''}
          />
        </div>
        <div className="field">
          <label htmlFor="exam-credits">Studiepunten (optioneel)</label>
          <input
            id="exam-credits"
            name="credits"
            type="number"
            min="0"
            max="60"
            step="0.5"
            defaultValue={editing?.credits || ''}
          />
        </div>
        <div className="field">
          <label htmlFor="exam-date">Examendatum (optioneel)</label>
          <input
            id="exam-date"
            name="exam"
            type="date"
            min="2000-01-01"
            max="2100-12-31"
            defaultValue={editing?.exam || ''}
          />
        </div>
        <button className="button small" disabled={!loaded}>
          {editing ? 'Bewaar vak' : 'Voeg vak toe'}
        </button>
        {editing && (
          <button type="button" className="quiet-button" onClick={() => setEditing(null)}>
            Annuleer wijziging
          </button>
        )}
      </form>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {plan.subjects.length > 0 && (
        <ul className="subject-list">
          {plan.subjects.map((s, i) => {
            const count = plan.days.filter(
              (d) => d.subject === s.name && ['Studeren', 'Herhalen'].includes(d.kind),
            ).length
            return (
              <li key={s.id} data-color={i % 6}>
                <div className="grow">
                  <strong>{s.name}</strong>
                  <span>
                    {s.credits ? `${s.credits} sp · ` : ''}
                    {count} studiedagen
                    {studyCount && totalCredits && s.credits
                      ? ` · ${Math.round((s.credits / totalCredits) * 100)}% van je studiepunten`
                      : ''}
                  </span>
                  <span>
                    {s.exam ? `Examen ${dateLabel(s.exam)}` : 'Examendatum nog niet ingevuld'}
                  </span>
                </div>
                <button
                  className="quiet-button planner-controls"
                  aria-label={`Wijzig vak ${s.name}`}
                  onClick={() => {
                    setEditing(s)
                    document.getElementById('exam-subject')?.focus()
                  }}
                >
                  Wijzig
                </button>
                <button
                  className="quiet-button planner-controls"
                  aria-label={`Verwijder vak ${s.name} en bijbehorende dagen`}
                  onClick={() => {
                    change(
                      {
                        subjects: plan.subjects.filter((x) => x.id !== s.id),
                        days: plan.days.filter((d) => d.subject !== s.name),
                      },
                      `${s.name} en bijbehorende dagen verwijderd. Je kan dit ongedaan maken.`,
                    )
                    if (editing?.id === s.id) setEditing(null)
                  }}
                >
                  Verwijder
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <div className="planner-step">
        <h4>2. Kies een vak, kleur je dagen</h4>
        <p className="smallprint">
          Klik nog eens op dezelfde invulling om ze weg te halen. Een andere keuze vervangt die dag.
          Examens blijven vaststaan: wijzig ze bij het vak.
        </p>
      </div>
      <div className="subject-palette planner-controls" role="group" aria-label="Kies je vak">
        {plan.subjects.map((s, i) => (
          <button
            key={s.id}
            data-color={i % 6}
            aria-pressed={selected === s.id}
            onClick={() => {
              setSelected(s.id)
              if (mode === 'Rust' || mode === 'Wissen') setMode('Studeren')
            }}
          >
            {s.name}
          </button>
        ))}
        {!plan.subjects.length && (
          <p className="smallprint">Voeg je eerste vak toe. Rustdagen kan je alvast inplannen.</p>
        )}
      </div>
      <div className="tab-row planner-controls" role="group" aria-label="Invulling van de dag">
        {modes.map((m) => (
          <button className="tab" key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>
            {m}
          </button>
        ))}
      </div>
      <div className="paint-instruction planner-controls">
        <strong>
          {mode === 'Rust'
            ? 'Je plant nu rust.'
            : mode === 'Wissen'
              ? 'Je maakt nu dagen vrij.'
              : current
                ? `${mode}: ${current.name}`
                : 'Kies eerst een vak.'}
        </strong>
        <span>Je wijzigingen worden automatisch bewaard.</span>
      </div>
      <div className="calendar-toolbar planner-controls">
        <button
          className="quiet-button"
          disabled={!start || start <= '2000-01'}
          onClick={() => setStart(shiftMonth(start, -3))}
        >
          Vorige 3 maanden
        </button>
        <div className="field">
          <label htmlFor="block-month">Beginmaand</label>
          <input
            id="block-month"
            type="month"
            min="2000-01"
            max="2100-10"
            value={start}
            onInput={(e) => {
              if (
                /^\d{4}-(0[1-9]|1[0-2])$/.test(e.currentTarget.value) &&
                e.currentTarget.value >= '2000-01' &&
                e.currentTarget.value <= '2100-10'
              )
                setStart(e.currentTarget.value)
            }}
          />
        </div>
        <button
          className="quiet-button"
          disabled={!start || start >= '2100-10'}
          onClick={() => setStart(shiftMonth(start, 3))}
        >
          Volgende 3 maanden
        </button>
      </div>
      <div className="calendar-months">
        {months.map((month) => {
          const grid = monthDays(month)
          return (
            <section className="calendar-month" key={month} aria-label={monthLabel(month)}>
              <h4>{monthLabel(month)}</h4>
              <div className="calendar-grid">
                {['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map((day) => (
                  <span className="calendar-weekday" key={day} aria-hidden="true">
                    {day}
                  </span>
                ))}
                {Array.from({ length: grid.offset }, (_, i) => (
                  <span key={`blank-${i}`} aria-hidden="true" />
                ))}
                {grid.dates.map((date) => {
                  const items = entries.filter((d) => d.date === date)
                  const exam = items.some((d) => d.kind === 'Examen')
                  const color = plan.subjects.findIndex((s) => s.name === items[0]?.subject)
                  const summary = items.map((d) => `${d.kind}: ${d.subject}`).join(', ')
                  return (
                    <button
                      key={date}
                      className="calendar-day"
                      data-color={color < 0 ? undefined : color % 6}
                      data-rest={items[0]?.kind === 'Rust'}
                      data-exam={exam}
                      aria-label={`${dateLabel(date)}${summary ? `, ${summary}` : ', vrij'}${exam ? ', vast examen' : ''}`}
                      aria-disabled={exam || (!current && !['Rust', 'Wissen'].includes(mode))}
                      onClick={() => {
                        if (exam) {
                          setNotice(
                            'Een examendag staat vast. Pas de examendatum aan via Wijzig bij het vak.',
                          )
                          return
                        }
                        if (!current && !['Rust', 'Wissen'].includes(mode)) {
                          setNotice('Voeg een vak toe en selecteer het, of kies Rust.')
                          return
                        }
                        change(
                          paintDay(
                            plan,
                            date,
                            mode === 'Rust' ? 'Rust' : current?.name || '',
                            mode,
                          ),
                          `${dateLabel(date)} aangepast.`,
                        )
                      }}
                    >
                      <span className="calendar-number">{Number(date.slice(-2))}</span>
                      {items.map((d) => (
                        <span
                          className="calendar-entry"
                          key={d.id}
                          title={`${d.kind}: ${d.subject}`}
                        >
                          <b>{d.kind === 'Studeren' ? '' : `${d.kind} · `}</b>
                          {d.subject === 'Rust'
                            ? d.kind === 'Rust'
                              ? 'Vrije dag'
                              : d.subject
                            : d.subject}
                        </span>
                      ))}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
      <div className="planner-feedback planner-controls">
        <p role="status">
          {notice ||
            (loaded ? 'Je planning is klaar om in te vullen.' : 'Je bewaarde planning laden…')}
        </p>
        <button
          className="quiet-button"
          disabled={!undo}
          onClick={() => {
            if (undo) {
              setPlan(undo)
              setUndo(null)
              setNotice('Laatste wijziging ongedaan gemaakt.')
              setEditing(null)
            }
          }}
        >
          Ongedaan maken
        </button>
      </div>
      <p className="smallprint">
        {studyCount} studie- en herhaaldagen · {plan.days.filter((d) => d.kind === 'Rust').length}{' '}
        rustdagen · {entries.filter((d) => d.kind === 'Examen').length} examens. Dit totaal telt ook
        dagen buiten de zichtbare maanden.
      </p>
      {afterExam.length > 0 && (
        <p className="planner-warning" role="status">
          Let op: {afterExam.length} studie- of herhaaldag(en) vallen op of na het examen van dat
          vak. Controleer je verdeling.
        </p>
      )}
      {entries.length > 0 && (
        <details className="planning-list">
          <summary>Bekijk alle geplande dagen als lijst</summary>
          <ul className="task-list">
            {entries.map((d) => (
              <li key={d.id}>
                <div className="grow">
                  <strong>{d.subject}</strong>
                  <small>
                    {dateLabel(d.date)} · {d.kind}
                  </small>
                </div>
                <button
                  className="quiet-button planner-controls"
                  aria-label={`Bekijk ${d.subject} op ${d.date} in de kalender`}
                  onClick={() => setStart(d.date.slice(0, 7))}
                >
                  Toon maand
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
