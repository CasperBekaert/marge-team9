import { renderToString } from 'react-dom/server'
import { beforeAll, expect, it } from 'vitest'
import Home from '../../src/app/(site)/page'
import Methods from '../../src/app/(site)/methodes/page'
import Method from '../../src/app/(site)/methodes/[slug]/page'
import Phase from '../../src/app/(site)/fases/[slug]/page'
import { seed } from '../../src/seed/seed'
import { getTestPayload } from '../setup/payload'
beforeAll(async () => {
  await seed(await getTestPayload())
})
it('offers both tasks from the home page', () => {
  const html = renderToString(Home())
  expect(html).toContain('href="/planning"')
  expect(html).toContain('href="/afspraak"')
})
it('renders a GET search form and a useful empty state on the server', async () => {
  const html = renderToString(
    await Methods({ searchParams: Promise.resolve({ q: 'zznoresultzz' }) }),
  )
  expect(html).toContain('method="get"')
  expect(html).toContain('Geen')
  expect(html).not.toContain('method-row')
})
it('links methods and phases in both directions', async () => {
  const p = await getTestPayload()
  const m = (await p.find({ collection: 'studyMethods', depth: 1, limit: 1 })).docs[0]
  const phase = m.phases![0]
  if (typeof phase === 'number') throw Error('Expected populated phase')
  const a = renderToString(await Method({ params: Promise.resolve({ slug: m.slug }) }))
  expect(a).toContain(`/fases/${phase.slug}`)
  const b = renderToString(await Phase({ params: Promise.resolve({ slug: phase.slug }) }))
  expect(b).toContain(`/methodes/${m.slug}`)
})
