'use client'
import { playSaved } from './Audio'
import { useEffect, useState, type FormEvent } from 'react'
// Hydrate saved browser data after the server render; subsequent changes sync back to storage.
/* eslint-disable react-hooks/set-state-in-effect */
function useSaved<T>(key: string, initial: T) {
  const [data, setData] = useState<T>(initial)
  const [loaded, setLoaded] = useState(false)
  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    try {
      const value = localStorage.getItem(key)
      if (value) setData(JSON.parse(value))
    } catch {
      setStorageError(true)
    }
    setLoaded(true)
  }, [key])
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch {
        setStorageError(true)
      }
  }, [data, key, loaded])
  return { data, setData, loaded, storageError }
}
export function exportCSV(name: string, rows: (string | number)[][]) {
  const csv =
    '\ufeff' +
    rows
      .map((row) =>
        row
          .map(
            (v) =>
              '"' +
              String(v)
                .replace(/^[=+@-]/, "'$&")
                .replaceAll('"', '""') +
              '"',
          )
          .join(';'),
      )
      .join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name + '.csv'
  a.click()
  URL.revokeObjectURL(url)
}
export function Actions({ download }: { download: () => void }) {
  return (
    <div className="tool-actions">
      <button className="quiet-button" onClick={download}>
        Download voor Excel
      </button>
      <button className="quiet-button" onClick={() => window.print()}>
        Afdrukken / PDF
      </button>
    </div>
  )
}
export function StorageNote({ error }: { error: boolean }) {
  return (
    <p className="smallprint" role={error ? 'alert' : undefined}>
      {error
        ? 'Bewaren op dit toestel lukt niet. Download je werk voordat je deze pagina sluit.'
        : 'Automatisch bewaard op dit toestel. Download een kopie om je werk mee te nemen.'}
    </p>
  )
}
type Block = { id: string; day: number; from: string; to: string; name: string; kind: string }
const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const kinds = ['lessen', 'activiteiten', 'studeren', 'reserve']
const labels = ['Lessen en examens', 'Activiteiten', 'Studeeruren', 'Reserve-uren']
export function WeekPlanner() {
  const { data: blocks, setData: setBlocks, storageError } = useSaved<Block[]>('marge-week-v1', [])
  const [kind, setKind] = useState('lessen')
  const [edit, setEdit] = useState<Block | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const block = {
      id: edit?.id || crypto.randomUUID(),
      day: Number(fd.get('day')),
      from: String(fd.get('from')),
      to: String(fd.get('to')),
      name: String(fd.get('name')).trim(),
      kind,
    }
    if (block.to <= block.from) {
      setError('Het einduur moet later zijn dan het beginuur.')
      return
    }
    if (
      blocks.some(
        (b) => b.id !== block.id && b.day === block.day && b.from < block.to && b.to > block.from,
      )
    ) {
      setError('Dit blok overlapt met een ander blok. Kies een vrij tijdstip of pas dat blok aan.')
      return
    }
    setBlocks((bs) =>
      [...bs.filter((b) => b.id !== block.id), block].sort((a, b) => a.from.localeCompare(b.from)),
    )
    setError('')
    playSaved()
    setNotice(edit ? 'Je blok is aangepast.' : 'Je blok is toegevoegd.')
    setEdit(null)
    e.currentTarget.reset()
  }
  return (
    <section className="tool" id="weekplanner">
      <div className="tool-head">
        <div>
          <h3>Jouw week, in vier lagen.</h3>
          <StorageNote error={storageError} />
        </div>
        <Actions
          download={() =>
            exportCSV('marge-weekplanning', [
              ['Dag', 'Van', 'Tot', 'Wat', 'Soort'],
              ...blocks.map((b) => [days[b.day], b.from, b.to, b.name, b.kind]),
            ])
          }
        />
      </div>
      <div className="tab-row" aria-label="Soort blok">
        {kinds.map((k, i) => (
          <button key={k} className="tab" aria-pressed={kind === k} onClick={() => setKind(k)}>
            {labels[i]}
          </button>
        ))}
      </div>
      <form key={edit?.id || 'new'} onSubmit={submit} className="field-grid">
        <div className="field">
          <label htmlFor="block-day">Dag</label>
          <select id="block-day" name="day" defaultValue={edit?.day || 0}>
            {days.map((d, i) => (
              <option value={i} key={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="block-from">Van</label>
          <input
            id="block-from"
            name="from"
            type="time"
            required
            defaultValue={edit?.from || '09:00'}
          />
        </div>
        <div className="field">
          <label htmlFor="block-to">Tot</label>
          <input id="block-to" name="to" type="time" required defaultValue={edit?.to || '10:30'} />
        </div>
        <div className="field">
          <label htmlFor="block-name">Wat ga je doen?</label>
          <input
            id="block-name"
            name="name"
            maxLength={80}
            required
            placeholder="Bijvoorbeeld: Economie"
            defaultValue={edit?.name || ''}
          />
        </div>
        <button className="button small">{edit ? 'Bewaar wijziging' : 'Voeg blok toe'}</button>
        {edit && (
          <button type="button" className="quiet-button" onClick={() => setEdit(null)}>
            Stop met wijzigen
          </button>
        )}
      </form>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="smallprint" style={{ marginTop: 15 }}>
          {notice}
        </p>
      )}
      <div className="week-board">
        {days.map((day, i) => (
          <div key={day} className="day-column">
            <h4>{day}</h4>
            {blocks
              .filter((b) => b.day === i)
              .map((b) => (
                <div key={b.id}>
                  <button
                    className="plan-block"
                    data-kind={b.kind}
                    onClick={() => {
                      setEdit(b)
                      setKind(b.kind)
                      document.getElementById('block-name')?.focus()
                    }}
                    aria-label={`${b.name}, ${b.from} tot ${b.to}, wijzigen`}
                  >
                    <span>
                      {b.from} – {b.to}
                    </span>
                    {b.name}
                  </button>
                  <button
                    className="quiet-button"
                    style={{ fontSize: 12, minHeight: 28, padding: '2px 5px', marginBottom: 10 }}
                    aria-label={`Verwijder ${b.name}`}
                    onClick={() => {
                      setBlocks((bs) => bs.filter((x) => x.id !== b.id))
                      setNotice(`${b.name} verwijderd.`)
                    }}
                  >
                    Verwijder
                  </button>
                </div>
              ))}
            {!blocks.some((b) => b.day === i) && <span className="smallprint">Nog ruimte.</span>}
          </div>
        ))}
      </div>
      <p className="smallprint" style={{ marginTop: 18 }}>
        Klik op een blok om het aan te passen. Kleur én tekst geven de soort aan.
      </p>
    </section>
  )
}
type Task = { id: string; date: string; subject: string; task: string; done: boolean }
export function Deadlines() {
  const { data, setData, storageError } = useSaved<Task[]>('marge-deadlines-v1', [])
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setData((xs) =>
      [
        ...xs,
        {
          id: crypto.randomUUID(),
          date: String(fd.get('date')),
          subject: String(fd.get('subject')),
          task: String(fd.get('task')),
          done: false,
        },
      ].sort((a, b) => a.date.localeCompare(b.date)),
    )
    e.currentTarget.reset()
  }
  return (
    <section className="tool" id="deadlines">
      <div className="tool-head">
        <div>
          <h3>Alles op één deadlinelijst.</h3>
          <StorageNote error={storageError} />
        </div>
        <Actions
          download={() =>
            exportCSV('marge-deadlines', [
              ['Datum', 'Vak', 'Taak', 'Klaar'],
              ...data.map((d) => [d.date, d.subject, d.task, d.done ? 'Ja' : 'Nee']),
            ])
          }
        />
      </div>
      <form onSubmit={submit} className="field-grid">
        <div className="field">
          <label htmlFor="deadline-date">Datum</label>
          <input name="date" id="deadline-date" type="date" required />
        </div>
        <div className="field">
          <label htmlFor="deadline-subject">Vak</label>
          <input name="subject" id="deadline-subject" required maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor="deadline-task">Wat moet klaar zijn?</label>
          <input name="task" id="deadline-task" required maxLength={150} />
        </div>
        <button className="button small">Voeg deadline toe</button>
      </form>
      {!data.length ? (
        <p className="empty">Je lijst begint leeg. Voeg de eerste taak of test toe.</p>
      ) : (
        <ul className="task-list">
          {data.map((d) => (
            <li key={d.id}>
              <input
                type="checkbox"
                checked={d.done}
                aria-label={`${d.task} afvinken`}
                onChange={() =>
                  setData((xs) => xs.map((x) => (x.id === d.id ? { ...x, done: !x.done } : x)))
                }
              />
              <div className={`grow ${d.done ? 'done' : ''}`}>
                <strong>{d.task}</strong>
                <small>
                  {new Date(d.date + 'T12:00:00').toLocaleDateString('nl-BE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  · {d.subject}
                </small>
              </div>
              <button
                className="quiet-button"
                aria-label={`Verwijder deadline ${d.task}`}
                onClick={() => setData((xs) => xs.filter((x) => x.id !== d.id))}
              >
                Verwijder
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="smallprint" role="status">
        {data.filter((d) => !d.done).length} open · {data.filter((d) => d.done).length} afgevinkt
      </p>
    </section>
  )
}
type Chapter = { id: string; subject: string; title: string; done: boolean }
export function Chapters() {
  const { data, setData, storageError } = useSaved<Chapter[]>('marge-hoofdstukken-v1', [])
  return (
    <section className="tool" id="leerstof">
      <div className="tool-head">
        <div>
          <h3>Wat moet je kennen?</h3>
          <StorageNote error={storageError} />
        </div>
        <Actions
          download={() =>
            exportCSV('marge-leerstof', [
              ['Vak', 'Hoofdstuk', 'Gekend'],
              ...data.map((d) => [d.subject, d.title, d.done ? 'Ja' : 'Nee']),
            ])
          }
        />
      </div>
      <form
        className="field-grid"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const fd = new FormData(form)
          setData((xs) => [
            ...xs,
            {
              id: crypto.randomUUID(),
              subject: String(fd.get('subject')),
              title: String(fd.get('title')),
              done: false,
            },
          ])
          const input = form.elements.namedItem('title') as HTMLInputElement
          input.value = ''
          input.focus()
        }}
      >
        <div className="field">
          <label htmlFor="chapter-subject">Vak</label>
          <input id="chapter-subject" name="subject" required maxLength={80} />
        </div>
        <div className="field wide">
          <label htmlFor="chapter-title">Hoofdstuk of onderdeel</label>
          <input id="chapter-title" name="title" required maxLength={150} />
        </div>
        <button className="button small">Voeg hoofdstuk toe</button>
      </form>
      {!data.length ? (
        <p className="empty">
          Neem de titels uit je inhoudstafel over. Met Enter voeg je snel het volgende hoofdstuk
          toe.
        </p>
      ) : (
        <ul className="task-list">
          {data.map((c) => (
            <li key={c.id}>
              <input
                type="checkbox"
                checked={c.done}
                aria-label={`${c.title} gekend`}
                onChange={() =>
                  setData((xs) => xs.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)))
                }
              />
              <div className={`grow ${c.done ? 'done' : ''}`}>
                <strong>{c.title}</strong>
                <small>{c.subject}</small>
              </div>
              <button
                className="quiet-button"
                aria-label={`Verwijder hoofdstuk ${c.title}`}
                onClick={() => setData((xs) => xs.filter((x) => x.id !== c.id))}
              >
                Verwijder
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
