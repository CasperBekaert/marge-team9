import { expect, test } from '@playwright/test'
import { randomUUID } from 'node:crypto'

test('method filters work without JavaScript and relationships work in both directions', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/methodes')
  await page.getByLabel('Fase', { exact: true }).selectOption('plannen')
  await page.getByLabel('Soort', { exact: true }).selectOption('zelf')
  await page.getByLabel('Zoekwoord', { exact: true }).fill('week')
  await page.getByRole('button', { name: 'Toon methodes' }).click()
  await expect(page).toHaveURL(/fase=plannen&soort=zelf&q=week/)
  await page.getByRole('link', { name: /Maak je weekplanning/ }).click()
  await page.getByRole('main').getByRole('link', { name: 'Plannen', exact: true }).click()
  await expect(page.getByRole('link', { name: /Maak je weekplanning/ })).toBeVisible()
  await context.close()
})

test('two separate sessions save, propose, confirm, recover and cancel', async ({
  page,
  request,
}) => {
  const api = async (action: string, data: Record<string, unknown> = {}, token = '') => {
    const r = await request.post('/api/mentor', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data: { action, ...data },
    })
    expect(r.status(), await r.text()).toBe(200)
    return r.json()
  }
  const mentor = await api('create', { name: 'Mentor CI' })
  const state = await api('state', {}, mentor.token)
  const mentee = await api('join', { name: 'Mentee CI', code: state.group.inviteCode })
  const menteeState = await api('state', {}, mentee.token)
  const slot = new Date(Math.ceil((Date.now() + 86400000) / 1800000) * 1800000).toISOString()
  await api('availability', { slots: [slot] }, mentor.token)
  await api('availability', { slots: [slot] }, mentee.token)
  const proposal = {
    partner: state.me,
    startsAt: slot,
    place: 'bibliotheek',
    name: 'T09-7LPS CI test',
    requestId: randomUUID(),
  }
  const proposed = await api('propose', proposal, mentee.token)
  expect(proposed.appointments).toHaveLength(1)
  expect((await api('propose', proposal, mentee.token)).appointments).toHaveLength(1)
  const wrong = await request.post('/api/mentor', {
    headers: { Authorization: `Bearer ${mentee.token}` },
    data: { action: 'confirm', id: proposed.appointments[0].id },
  })
  expect(wrong.ok()).toBe(false)
  await page.goto('/afspraak')
  await page.getByRole('button', { name: 'Terugkomen', exact: true }).click()
  await page.getByLabel('Persoonlijke toegangscode', { exact: true }).fill(mentor.token)
  await page.getByRole('button', { name: 'Open mijn rooster', exact: true }).click()
  await page.getByRole('button', { name: 'Bevestig afspraak', exact: true }).click()
  await expect(
    page.getByText('Afspraak bevestigd voor jullie allebei.', { exact: true }),
  ).toBeVisible()
  expect((await api('state', {}, mentee.token)).appointments[0].status).toBe('confirmed')
  await page.reload()
  await expect(page.getByText('Bevestigd', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Annuleer afspraak', exact: true }).click()
  expect((await api('state', {}, mentee.token)).appointments[0].status).toBe('cancelled')
  expect(menteeState.me).not.toBe(state.me)
})

test('local week plan rejects overlap and survives a reload', async ({ page }) => {
  await page.goto('/planning')
  await page.getByLabel('Wat ga je doen?', { exact: true }).fill('Statistiek oefenen')
  await page.getByRole('button', { name: 'Voeg blok toe', exact: true }).click()
  await expect(page.getByRole('button', { name: /Statistiek oefenen, 09:00/ })).toBeVisible()
  await page.getByLabel('Wat ga je doen?', { exact: true }).fill('Overlap test')
  await page.getByRole('button', { name: 'Voeg blok toe', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('overlapt')
  await page.reload()
  await expect(page.getByRole('button', { name: /Statistiek oefenen, 09:00/ })).toBeVisible()
})
