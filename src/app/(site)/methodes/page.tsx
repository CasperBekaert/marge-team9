import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import config from '@/payload.config'
import { PageIntro } from '@/components/marge/Shell'
import { MethodList } from '@/components/marge/MethodList'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Vind een studiemethode' }
export default async function Methods({
  searchParams,
}: {
  searchParams: Promise<{ fase?: string; soort?: string; q?: string }>
}) {
  const p = await searchParams
  const payload = await getPayload({ config })
  const phases = (
    await payload.find({ collection: 'studyPhases', limit: 50, depth: 0, overrideAccess: false })
  ).docs
  const phase = phases.find((x) => x.slug === p.fase)
  const query = typeof p.q === 'string' ? p.q.slice(0, 100).trim() : ''
  const kind = ['uitleg', 'zelf'].includes(p.soort || '') ? p.soort : ''
  const filters: Where[] = []
  if (phase) filters.push({ phases: { in: [phase.id] } })
  if (kind) filters.push({ kind: { equals: kind } })
  if (query) filters.push({ or: [{ title: { like: query } }, { summary: { like: query } }] })
  const methods = (
    await payload.find({
      collection: 'studyMethods',
      where: filters.length ? { and: filters } : {},
      limit: 100,
      sort: 'title',
      depth: 1,
      overrideAccess: false,
    })
  ).docs
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Je hoeft niet alles te proberen"
        title="Vind jouw volgende kleine stap."
        intro="Zoek een methode voor waar je nu staat. Bekijk hoe ze werkt en probeer ze meteen op je eigen leerstof."
      />
      <form method="get" className="filter-form" role="search">
        <div className="field">
          <label htmlFor="phase-filter">Fase</label>
          <select id="phase-filter" name="fase" defaultValue={phase?.slug || ''}>
            <option value="">Alle fases</option>
            {phases.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="kind-filter">Soort</label>
          <select id="kind-filter" name="soort" defaultValue={kind}>
            <option value="">Alles</option>
            <option value="uitleg">Uitleg</option>
            <option value="zelf">Zelf doen</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="search-method">Zoekwoord</label>
          <input
            id="search-method"
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Bijvoorbeeld: mindmap"
          />
        </div>
        <button className="button">Toon methodes</button>
      </form>
      <div className="intro-strip">
        <p role="status">
          <strong>
            {methods.length} {methods.length === 1 ? 'methode' : 'methodes'}
          </strong>{' '}
          gevonden{phase ? ` voor ${phase.name.toLowerCase()}` : ''}.
        </p>
        <Link href="/methodes" className="text-link">
          Wis filters
        </Link>
      </div>
      {methods.length ? (
        <MethodList methods={methods} />
      ) : (
        <div className="empty">
          <h2 style={{ fontSize: 30 }}>Geen methode gevonden.</h2>
          <p>Probeer een ander zoekwoord of wis de filters.</p>
        </div>
      )}
      <p className="smallprint">
        De filters staan in de adresbalk. Je kan je selectie bewaren, delen en met de terugknop
        opnieuw openen.
      </p>
    </div>
  )
}
