'use client'
import { useEffect, useState, useRef, type FormEvent } from 'react'
import { commonSlots } from '@/lib/marge/scheduling'
import { playSaved } from './Audio'
import { MapEmbed } from './StudyTools'
type Person = { id: number; name: string; role: 'mentor' | 'mentee'; availability: string[] }
type Appointment = {
  id: number
  name: string
  startsAt: string
  status: 'proposed' | 'confirmed' | 'cancelled'
  place: string
  proposer: number
  partner: number
}
type State = {
  me: number
  group: { name: string; inviteCode: string }
  people: Person[]
  appointments: Appointment[]
}
const dateLabel = (s: string) =>
  new Intl.DateTimeFormat('nl-BE', {
    timeZone: 'Europe/Brussels',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(s))
function downloadCalendar(a: Appointment) {
  const stamp = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')
  const start = new Date(a.startsAt)
  const text = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marge//Mentorgesprek//NL',
    'BEGIN:VEVENT',
    `UID:marge-${a.id}@marge.example`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(new Date(+start + 1800000))}`,
    'SUMMARY:Mentorgesprek (testafspraak)',
    `LOCATION:${a.place === 'online' ? 'Online - spreek zelf een link af' : 'Bibliotheek De Krook (voorbeeldlocatie)'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'marge-gesprek.ics'
  link.click()
  URL.revokeObjectURL(url)
}
export function MentorPlanner() {
  const proposalRequestId = useRef('')
  const [token, setToken] = useState('')
  const [state, setState] = useState<State | null>(null)
  const [mode, setMode] = useState('join')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)
  const [week, setWeek] = useState(0)
  const [partner, setPartner] = useState('')
  const [demoTokens, setDemoTokens] = useState<{ mentee: string; mentor: string } | null>(null)
  async function call(action: string, data: Record<string, unknown> = {}, access = token) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({ action, ...data }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Het verzoek lukte niet.')
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Geen verbinding. Probeer opnieuw.')
      return null
    } finally {
      setBusy(false)
    }
  }
  function apply(next: State, replaceSlots = true) {
    setState(next)
    if (replaceSlots) {
      setSlots(
        next.people
          .find((p) => p.id === next.me)
          ?.availability.filter((v) => Date.parse(v) > Date.now()) || [],
      )
      setDirty(false)
    }
  }
  async function load(access: string) {
    const next = await call('state', {}, access)
    if (next) apply(next)
  }
  // Restore this external browser session only after hydration.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    let saved = ''
    try {
      saved = localStorage.getItem('marge-access') || ''
      const demo = localStorage.getItem('marge-demo')
      if (demo) setDemoTokens(JSON.parse(demo))
    } catch {}
    if (saved) {
      setToken(saved)
      void load(saved)
    }
  }, []) // The browser owns this session; no token is put into a URL.
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  async function enter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (mode === 'recover') {
      const key = String(fd.get('access') || '').trim()
      const next = await call('state', {}, key)
      if (next) {
        remember(key)
        apply(next)
      }
      return
    }
    const result = await call(mode, { name: fd.get('name'), code: fd.get('code') })
    if (result) {
      remember(result.token)
      await load(result.token)
    }
  }
  function remember(key: string) {
    setToken(key)
    try {
      localStorage.setItem('marge-access', key)
    } catch {
      setMessage('Je browser kan de toegang niet bewaren. Kopieer je persoonlijke toegangscode.')
    }
  }
  async function demo() {
    const result = await call('demo')
    if (result) {
      const keys = { mentee: result.token, mentor: result.demoMentorToken }
      setDemoTokens(keys)
      try {
        localStorage.setItem('marge-demo', JSON.stringify(keys))
      } catch {}
      remember(result.token)
      await load(result.token)
    }
  }
  async function save() {
    const next = await call('availability', {
      slots: slots.filter((v) => Date.parse(v) > Date.now()),
    })
    if (next) {
      apply(next)
      playSaved()
      setMessage('Je beschikbaarheid is opgeslagen. De andere persoon kan ze nu zien.')
    }
  }
  async function change(action: string, data: Record<string, unknown>) {
    const next = await call(action, data)
    if (next) {
      if (action === 'propose') proposalRequestId.current = ''
      playSaved()
      apply(next)
      setMessage(
        action === 'confirm'
          ? 'Afspraak bevestigd voor jullie allebei.'
          : action === 'cancel'
            ? 'Afspraak geannuleerd. Het halfuur is weer vrij.'
            : 'Voorstel opgeslagen. De andere persoon kan nu bevestigen.',
      )
    }
  }
  const me = state?.people.find((p) => p.id === state.me)
  const others = state?.people.filter((p) => p.role !== me?.role) || []
  const selected = others.find((p) => String(p.id) === partner) || others[0]
  const availableHints = (selected?.availability || [])
    .filter((v) => Date.parse(v) > Date.now())
    .slice(0, 4)
  const overlap = commonSlots(me?.availability, selected?.availability).filter(
    (time) => !state?.appointments.some((a) => a.startsAt === time && a.status !== 'cancelled'),
  )
  const monday = new Date()
  monday.setHours(12, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + week * 7)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
  const times = Array.from(
    { length: 26 },
    (_, i) => `${String(8 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
  )
  function slotISO(day: Date, time: string) {
    const d = new Date(day)
    const [h, m] = time.split(':').map(Number)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }
  return (
    <div id="plan-gesprek">
      <noscript>
        <p className="error">
          Voor het gezamenlijke rooster is JavaScript nodig. De studiemethodes en uitleg blijven
          beschikbaar.
        </p>
      </noscript>
      {!state ? (
        <div className="split">
          <section className="tool">
            <div className="tab-row" aria-label="Aanmelden">
              {[
                ['join', 'Ik heb een koppelcode'],
                ['create', 'Ik ben mentor'],
                ['recover', 'Terugkomen'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className="tab"
                  aria-pressed={mode === key}
                  onClick={() => {
                    setMode(key)
                    setError('')
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <h2 style={{ fontSize: 32 }}>
              {mode === 'create'
                ? 'Begin een mentorgroep.'
                : mode === 'recover'
                  ? 'Welkom terug.'
                  : 'Sluit aan bij je mentor.'}
            </h2>
            <p className="muted" style={{ margin: '16px 0' }}>
              Gebruik verzonnen gegevens. Deze website is een werkend studieproject, geen officiële
              afsprakenservice.
            </p>
            <form onSubmit={enter} className="steps">
              {mode === 'recover' ? (
                <div className="field">
                  <label htmlFor="access">Persoonlijke toegangscode</label>
                  <input
                    id="access"
                    name="access"
                    required
                    autoComplete="off"
                    minLength={64}
                    maxLength={64}
                  />
                  <p className="smallprint">
                    Dit is je eigen code van 64 tekens, niet de koppelcode van de groep.
                  </p>
                </div>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="name">Verzonnen naam</label>
                    <input
                      id="name"
                      name="name"
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="Bijvoorbeeld: Mentee Test"
                      autoComplete="off"
                    />
                  </div>
                  {mode === 'join' && (
                    <div className="field" style={{ marginTop: 20 }}>
                      <label htmlFor="code">Koppelcode van je mentor</label>
                      <input
                        id="code"
                        name="code"
                        required
                        maxLength={12}
                        minLength={12}
                        autoComplete="off"
                        placeholder="12 letters en cijfers"
                      />
                    </div>
                  )}
                </>
              )}
              <button className="button" disabled={busy} style={{ marginTop: 24 }}>
                {busy
                  ? 'Even bewaren…'
                  : mode === 'create'
                    ? 'Maak mijn groep'
                    : mode === 'recover'
                      ? 'Open mijn rooster'
                      : 'Sluit aan'}
              </button>
            </form>
          </section>
          <aside style={{ paddingTop: 35 }}>
            <p className="eyebrow">Eerst even proberen?</p>
            <h2>
              Ontdek het samen.
              <br />
              <em>Of speel beide rollen.</em>
            </h2>
            <p className="lead">
              De voorbeeldgroep heeft een mentor met beschikbare momenten. Kies zelf een halfuur,
              doe een voorstel en bekijk hoe bevestigen werkt.
            </p>
            <button
              className="button secondary"
              onClick={demo}
              disabled={busy}
              style={{ marginTop: 24 }}
            >
              Open een eigen voorbeeldgroep
            </button>
            <p className="smallprint" style={{ marginTop: 18 }}>
              Je krijgt een aparte groep, zodat je geen test van iemand anders verstoort.
            </p>
          </aside>
        </div>
      ) : (
        <>
          <div className="tool-head" style={{ marginTop: 30 }}>
            <div>
              <p className="eyebrow">{state.group.name}</p>
              <h2>Dag, {me?.name}.</h2>
              <p className="muted">
                Je bent aangemeld als {me?.role}. Tijden hieronder volgen je toestel (
                {Intl.DateTimeFormat().resolvedOptions().timeZone}).
              </p>
            </div>
            <div className="tool-actions">
              <button className="quiet-button" disabled={busy || dirty} onClick={() => load(token)}>
                Vernieuwen
              </button>
              <button
                className="quiet-button"
                onClick={() => {
                  setState(null)
                  setToken('')
                  try {
                    localStorage.removeItem('marge-access')
                  } catch {}
                }}
              >
                Afmelden
              </button>
            </div>
          </div>
          {demoTokens && (
            <div className="success">
              <strong>Voorbeeldgroep:</strong> probeer het gesprek vanuit beide rollen.{' '}
              <button
                className="quiet-button"
                disabled={busy || dirty}
                onClick={() => {
                  const next = me?.role === 'mentor' ? demoTokens.mentee : demoTokens.mentor
                  remember(next)
                  void load(next)
                }}
              >
                Wissel naar {me?.role === 'mentor' ? 'mentee' : 'mentor'}
              </button>
            </div>
          )}
          <details className="tool">
            <summary>Koppelcode en mijn persoonlijke toegang</summary>
            <p style={{ marginTop: 20 }}>
              Deel deze koppelcode met je mentee. Daarmee komt een nieuw groepslid erbij.
            </p>
            <code className="code">{state.group.inviteCode}</code>
            <p>
              Je persoonlijke toegangscode geeft toegang tot jouw rooster. Bewaar ze voor een ander
              toestel en deel ze niet met de groep.
            </p>
            <button
              className="quiet-button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(token)
                  setMessage('Persoonlijke toegangscode gekopieerd. Bewaar ze op een veilige plek.')
                } catch {
                  setError('Kopiëren lukte niet. Open deze pagina in je gewone browser.')
                }
              }}
            >
              Kopieer mijn persoonlijke toegangscode
            </button>
          </details>
          <section className="tool">
            <div className="tool-head">
              <div>
                <h3>Wanneer kan jij?</h3>
                <p className="muted">
                  Kies vrije halfuren. Klik nogmaals om een halfuur weg te halen.
                </p>
              </div>
              <button className="button small" onClick={save} disabled={busy || !dirty}>
                {busy ? 'Bewaren…' : dirty ? 'Bewaar beschikbaarheid' : 'Alles opgeslagen'}
              </button>
            </div>
            <div className="tool-actions">
              <button
                className="quiet-button"
                disabled={week === 0}
                onClick={() => setWeek((w) => w - 1)}
              >
                Vorige week
              </button>
              <span style={{ padding: 10 }}>
                {days[0].toLocaleDateString('nl-BE', { day: 'numeric', month: 'long' })} –{' '}
                {days[6].toLocaleDateString('nl-BE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                className="quiet-button"
                disabled={week >= 11}
                onClick={() => setWeek((w) => w + 1)}
              >
                Volgende week
              </button>
            </div>
            <div className="calendar-scroll">
              <div className="availability">
                <span>Tijd</span>
                {days.map((d) => (
                  <span key={d.toISOString()}>
                    {d.toLocaleDateString('nl-BE', { weekday: 'short', day: 'numeric' })}
                  </span>
                ))}
                {times.map((t) => (
                  <div key={t} style={{ display: 'contents' }}>
                    <span>{t}</span>
                    {days.map((d) => {
                      const iso = slotISO(d, t)
                      return (
                        <button
                          key={iso}
                          className="slot"
                          disabled={Date.parse(iso) <= Date.now()}
                          aria-label={`${d.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })} ${t}`}
                          aria-pressed={slots.includes(iso)}
                          onClick={() => {
                            setSlots((s) =>
                              s.includes(iso) ? s.filter((v) => v !== iso) : [...s, iso],
                            )
                            setDirty(true)
                          }}
                        >
                          {slots.includes(iso) ? 'Vrij' : ''}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <p className="smallprint" style={{ marginTop: 18 }}>
              {dirty ? 'Je wijzigingen zijn nog niet opgeslagen.' : ''} Elk vakje is 30 minuten. Op
              je telefoon kan je het rooster horizontaal verschuiven.
            </p>
          </section>
          <div className="split" style={{ marginTop: 35 }}>
            <section className="tool">
              <p className="eyebrow">Een moment voor jullie allebei</p>
              <h3>Stel een gesprek voor.</h3>
              {others.length === 0 ? (
                <p>
                  Er is nog niemand aangesloten. Deel de koppelcode en vraag de andere persoon om
                  beschikbaarheid in te vullen.
                </p>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="partner">Met wie?</label>
                    <select
                      id="partner"
                      value={selected?.id || ''}
                      onChange={(e) => setPartner(e.target.value)}
                    >
                      {others.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {dirty ? (
                    <p className="error">Bewaar eerst je gewijzigde beschikbaarheid.</p>
                  ) : overlap.length === 0 ? (
                    <p className="empty">
                      Nog geen gezamenlijke vrije momenten. Bewaar allebei je beschikbaarheid en
                      kies daarna Vernieuwen.
                    </p>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const fd = new FormData(e.currentTarget)
                        void change('propose', {
                          partner: selected?.id,
                          startsAt: fd.get('startsAt'),
                          place: fd.get('place'),
                          name: fd.get('title'),
                          requestId: (proposalRequestId.current ||= crypto.randomUUID()),
                        })
                      }}
                    >
                      <div className="field" style={{ marginTop: 20 }}>
                        <label htmlFor="startsAt">Gezamenlijk vrij halfuur</label>
                        <select id="startsAt" name="startsAt" required>
                          {overlap.map((s) => (
                            <option key={s} value={s}>
                              {dateLabel(s)} (Brussel)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field" style={{ marginTop: 20 }}>
                        <label htmlFor="place">Waar spreken jullie af?</label>
                        <select id="place" name="place">
                          <option value="bibliotheek">
                            Bibliotheek De Krook — voorbeeldlocatie
                          </option>
                          <option value="online">Online — spreek zelf een link af</option>
                        </select>
                      </div>
                      <div className="field" style={{ marginTop: 20 }}>
                        <label htmlFor="title">Naam van het testgesprek</label>
                        <input
                          id="title"
                          name="title"
                          maxLength={80}
                          placeholder="Bijvoorbeeld: Planning bespreken"
                        />
                      </div>
                      <button className="button" disabled={busy} style={{ marginTop: 24 }}>
                        Stuur voorstel
                      </button>
                      <p className="smallprint" style={{ marginTop: 12 }}>
                        Pas bevestigd zodra de andere persoon akkoord gaat. Er wordt geen e-mail
                        verstuurd.
                      </p>
                    </form>
                  )}
                </>
              )}
            </section>
            <section>
              <p className="eyebrow">Samen afgesproken</p>
              <h3>Jouw gesprekken</h3>
              {state.appointments.length === 0 ? (
                <p className="empty">Nog geen gesprekken. Je eerste voorstel verschijnt hier.</p>
              ) : (
                state.appointments.map((a) => (
                  <article key={a.id} className="appointment-card">
                    <span className={`status-label ${a.status}`}>
                      {a.status === 'confirmed'
                        ? 'Bevestigd'
                        : a.status === 'cancelled'
                          ? 'Geannuleerd'
                          : 'Wacht op bevestiging'}
                    </span>
                    <h3>{dateLabel(a.startsAt)}</h3>
                    <p>{a.name}</p>
                    <p className="smallprint">
                      30 minuten · {a.place === 'online' ? 'Online' : 'De Krook, voorbeeldlocatie'}{' '}
                      · tijdzone Brussel
                    </p>
                    <div className="actions">
                      {a.status === 'proposed' && a.partner === state.me && (
                        <button
                          className="button small"
                          disabled={busy || dirty}
                          onClick={() => change('confirm', { id: a.id })}
                        >
                          Bevestig afspraak
                        </button>
                      )}
                      {a.status === 'proposed' && a.proposer === state.me && (
                        <p className="smallprint">De andere persoon bevestigt dit voorstel.</p>
                      )}
                      {a.status === 'confirmed' && (
                        <button className="quiet-button" onClick={() => downloadCalendar(a)}>
                          Zet in mijn agenda
                        </button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button
                          className="quiet-button"
                          disabled={busy}
                          onClick={() => change('cancel', { id: a.id })}
                        >
                          Annuleer afspraak
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>
          {state.appointments.some(
            (a) => a.status === 'confirmed' && a.place === 'bibliotheek',
          ) && (
            <section className="tool">
              <h3>Hier spreken jullie af.</h3>
              <p>
                De Krook, Miriam Makebaplein 1 in Gent. Dit is een voorbeeldlocatie: Marge
                reserveert geen ruimte en is niet verbonden aan de bibliotheek.
              </p>
              <MapEmbed />
            </section>
          )}
        </>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="success">
          {message}
        </p>
      )}
    </div>
  )
}
