import type { Payload } from 'payload'
import { phases, methods } from '../content/marge'
export const ADD_EXAMPLE_CONTENT = true
export const PAGES: {slug:string;title:string;intro:string}[] = []
export const NO_BLOB_STORE_MESSAGE = 'Connect the project media store before uploading images.'
export type SeedResult = { created: number; skipped: number }
// This project's initial content is added only once; later CMS edits are preserved by runSeed.
export async function seed(payload: Payload, _options: { env?: Record<string, string | undefined> } = {}): Promise<SeedResult> {
  const result = { created: 0, skipped: 0 }
  const ids: Record<string, number> = {}
  for (const phase of phases) {
    const found = (await payload.find({ collection: 'studyPhases', where: { slug: { equals: phase.slug } }, limit: 1 })).docs[0]
    if (found) { ids[phase.slug] = found.id; result.skipped++ }
    else { ids[phase.slug] = (await payload.create({ collection: 'studyPhases', data: phase })).id; result.created++ }
  }
  for (const method of methods) {
    const found = (await payload.find({ collection: 'studyMethods', where: { slug: { equals: method.slug } }, limit: 1 })).docs[0]
    if (found) result.skipped++
    else { await payload.create({ collection: 'studyMethods', data: { ...method, kind: method.kind as 'uitleg' | 'zelf', phases: method.phases.map(slug => ids[slug]) } }); result.created++ }
  }
  return result
}
