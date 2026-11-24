import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { seed } from '../../src/seed/seed'
import { runSeed } from '../../src/seed/run'
import { getTestPayload, resetCollections, forgetExampleAdded } from '../setup/payload'
import { refuseUnlessThrowAwayTestDatabase } from '../setup/safety'
refuseUnlessThrowAwayTestDatabase()
afterEach(() => vi.unstubAllEnvs())
beforeEach(async () => {
  vi.stubEnv('FIRST_ADMIN_EMAIL', 'seed-test@marge.example')
  vi.stubEnv('FIRST_ADMIN_PASSWORD', 'test-password-marge-0123456789')
  await resetCollections(['studyMethods', 'studyPhases'])
  await forgetExampleAdded()
})
describe('Marge initial content', () => {
  it('adds three phases and thirteen methods once, with real many-to-many relationships', async () => {
    const p = await getTestPayload()
    expect(await seed(p)).toEqual({ created: 16, skipped: 0 })
    expect(await seed(p)).toEqual({ created: 0, skipped: 16 })
    const records = await p.find({ collection: 'studyMethods', limit: 100, depth: 1 })
    expect(records.totalDocs).toBe(13)
    expect(records.docs.some((m) => (m.phases?.length || 0) > 1)).toBe(true)
    const phase = (await p.find({ collection: 'studyPhases', limit: 1, depth: 1 })).docs[0]
    expect(phase.methods?.docs?.length).toBeGreaterThan(0)
  })
  it('preserves editor changes and never silently restores deleted content on deployment', async () => {
    const p = await getTestPayload()
    await runSeed(p, { env: {} })
    const record = (await p.find({ collection: 'studyMethods', limit: 1 })).docs[0]
    await p.update({
      collection: 'studyMethods',
      id: record.id,
      data: { title: 'Edited by the team' },
    })
    await seed(p)
    expect((await p.findByID({ collection: 'studyMethods', id: record.id })).title).toBe(
      'Edited by the team',
    )
    await p.delete({ collection: 'studyMethods', id: record.id })
    await runSeed(p, { env: {} })
    expect((await p.count({ collection: 'studyMethods' })).totalDocs).toBe(12)
  })
})
