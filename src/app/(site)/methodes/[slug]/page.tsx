import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageIntro } from '@/components/marge/Shell'
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPayload({ config })
  const m = (
    await p.find({
      collection: 'studyMethods',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    })
  ).docs[0]
  return { title: m?.title || 'Methode niet gevonden' }
}
export default async function Method({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const method = (
    await payload.find({
      collection: 'studyMethods',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: false,
    })
  ).docs[0]
  if (!method) notFound()
  return (
    <div className="wrap">
      <PageIntro
        eyebrow={`${method.kind === 'zelf' ? 'Zelf doen' : 'Uitleg'} · ${method.minutes} minuten om te starten`}
        title={method.title}
        intro={method.summary}
      />
      <article className="reading">
        <p>{method.body}</p>
        <h2>Past bij deze fases</h2>
        <div className="tags">
          {method.phases?.map((p) =>
            typeof p === 'object' ? (
              <Link className="tag" key={p.id} href={`/fases/${p.slug}`}>
                {p.name}
              </Link>
            ) : null,
          )}
        </div>
        <div className="actions">
          <Link
            className="button"
            href={
              method.href.startsWith('/') && !method.href.startsWith('//')
                ? method.href
                : '/methodes'
            }
          >
            Bekijk de uitleg en probeer het
          </Link>
          <Link className="text-link" href="/methodes">
            Alle methodes
          </Link>
        </div>
      </article>
    </div>
  )
}
