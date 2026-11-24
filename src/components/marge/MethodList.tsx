import Link from 'next/link'
import type { StudyMethod } from '@/payload-types'
export function MethodList({ methods }: { methods: StudyMethod[] }) {
  return (
    <ul className="method-list">
      {methods.map((method) => (
        <li key={method.id} className="method-item">
          <div className="meta">
            <span>{method.kind === 'zelf' ? 'Zelf doen' : 'Uitleg'}</span>
            <span>{method.minutes} min om te starten</span>
          </div>
          <h2>
            <Link href={`/methodes/${method.slug}`}>{method.title}</Link>
          </h2>
          <p>{method.summary}</p>
          <div className="tags">
            {method.phases?.map((p) =>
              typeof p === 'object' ? (
                <Link key={p.id} className="tag" href={`/fases/${p.slug}`}>
                  {p.name}
                </Link>
              ) : null,
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
