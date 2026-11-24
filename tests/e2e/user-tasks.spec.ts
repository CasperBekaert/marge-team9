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
  await expect(
    page.getByText('Afspraak geannuleerd. Het halfuur is weer vrij.', { exact: true }),
  ).toBeVisible()
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
  await expect(page.getByRole('alert').filter({ hasText: 'overlapt' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: /Statistiek oefenen, 09:00/ })).toBeVisible()
})

test('block calendar paints, protects exams, undoes, renames and persists', async ({ page }) => {
  await page.goto('/planning#blokplanner')
  const planner = page.locator('#blokplanner')
  await planner.getByLabel('Vak', { exact: true }).fill('Economie')
  await planner.getByLabel('Studiepunten (optioneel)').fill('6')
  await planner.getByLabel('Examendatum (optioneel)').fill('2027-01-07')
  await planner.getByRole('button', { name: 'Voeg vak toe', exact: true }).click()
  await planner.getByLabel('Beginmaand').fill('2027-01')
  await expect(planner.getByRole('heading', { name: 'maart 2027', exact: true })).toBeVisible()
  await planner.getByRole('button', { name: '6 januari 2027, vrij', exact: true }).click()
  await expect(
    planner.getByRole('button', { name: '6 januari 2027, Studeren: Economie', exact: true }),
  ).toBeVisible()
  const exam = planner.getByRole('button', {
    name: '7 januari 2027, Examen: Economie, vast examen',
    exact: true,
  })
  await expect(exam).toHaveAttribute('aria-disabled', 'true')
  await planner.getByRole('button', { name: 'Rust', exact: true }).click()
  await planner
    .getByRole('button', { name: '6 januari 2027, Studeren: Economie', exact: true })
    .click()
  await expect(
    planner.getByRole('button', { name: '6 januari 2027, Rust: Rust', exact: true }),
  ).toBeVisible()
  await planner.getByRole('button', { name: 'Ongedaan maken', exact: true }).click()
  await planner.getByRole('button', { name: 'Wijzig vak Economie', exact: true }).click()
  await planner.getByLabel('Vak', { exact: true }).fill('Micro-economie')
  await planner.getByRole('button', { name: 'Bewaar vak', exact: true }).click()
  await page.reload()
  await expect(
    planner.getByRole('button', { name: '6 januari 2027, Studeren: Micro-economie', exact: true }),
  ).toBeVisible()
  await expect(
    planner.getByRole('button', {
      name: '7 januari 2027, Examen: Micro-economie, vast examen',
      exact: true,
    }),
  ).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
