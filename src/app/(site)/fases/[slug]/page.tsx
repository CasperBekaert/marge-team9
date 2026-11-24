import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PageIntro } from '@/components/marge/Shell'
import { MethodList } from '@/components/marge/MethodList'
export const dynamic = 'force-dynamic'
export default async function Phase({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const phase = (
    await payload.find({
      collection: 'studyPhases',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    })
  ).docs[0]
  if (!phase) notFound()
  const methods = (
    await payload.find({
      collection: 'studyMethods',
      where: { phases: { in: [phase.id] } },
      limit: 100,
      depth: 1,
      overrideAccess: false,
    })
  ).docs
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Een fase, verschillende mogelijkheden"
        title={phase.name}
        intro={phase.description}
      />
      <p>
        Elke methode kan bij meerdere fases passen. Open een methode om de uitleg en de andere fases
        te bekijken.
      </p>
      <MethodList methods={methods} />
    </div>
  )
}
