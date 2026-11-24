import { describe, expect, it } from 'vitest'
import {
  migratePlan,
  monthDays,
  paintDay,
  planEntries,
  shiftMonth,
  type BlockPlan,
} from '../src/lib/block-plan'

describe('block calendar dates and saved work', () => {
  it('places Monday first and handles leap years and year boundaries', () => {
    expect(monthDays('2027-02').offset).toBe(0)
    expect(monthDays('2028-02').dates).toHaveLength(29)
    expect(monthDays('2027-02').dates).toHaveLength(28)
    expect(shiftMonth('2026-11', 3)).toBe('2027-02')
    expect(shiftMonth('2027-01', -3)).toBe('2026-10')
    expect(monthDays('2027-03').dates.at(-1)).toBe('2027-03-31')
  })
  it('keeps every legacy entry including two exams for one subject', () => {
    const old = [
      { id: 'a', date: '2027-01-03', subject: 'Economie', kind: 'Studeren' },
      { id: 'b', date: '2027-01-07', subject: 'Economie', kind: 'Examen' },
      { id: 'c', date: '2027-01-08', subject: 'Economie', kind: 'Examen' },
      { id: 'd', date: '2027-01-01', subject: 'Nieuwjaar', kind: 'Rust' },
    ]
    const plan = migratePlan(old)
    expect(plan.subjects.map((s) => s.name)).toEqual(['Economie'])
    const values = (entries: typeof old) =>
      entries.map(({ date, subject, kind }) => `${date}:${subject}:${kind}`).sort()
    expect(values(planEntries(plan))).toEqual(values(old))
  })
  const plan: BlockPlan = {
    subjects: [{ id: 'e', name: 'Economie', credits: 6, exam: '2027-01-07' }],
    days: [],
  }
  it('protects exams, toggles identical paint, replaces days and clears only the chosen day', () => {
    expect(paintDay(plan, '2027-01-07', 'Rust', 'Rust')).toBe(plan)
    const painted = paintDay(plan, '2027-01-06', 'Economie', 'Studeren')
    expect(painted.days).toHaveLength(1)
    expect(paintDay(painted, '2027-01-06', 'Economie', 'Studeren').days).toHaveLength(0)
    const rest = paintDay(painted, '2027-01-06', 'Rust', 'Rust')
    expect(rest.days).toHaveLength(1)
    expect(rest.days[0].kind).toBe('Rust')
    expect(paintDay(rest, '2027-01-06', '', 'Wissen').days).toHaveLength(0)
    expect(planEntries(paintDay(rest, '2027-01-06', '', 'Wissen'))[0].kind).toBe('Examen')
  })
})
