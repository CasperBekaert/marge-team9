export type StudyDay = { id: string; date: string; subject: string; kind: string }
export type Subject = { id: string; name: string; credits: number; exam: string }
export type BlockPlan = { subjects: Subject[]; days: StudyDay[] }

// Keep calendar dates independent of daylight saving and UTC conversion.
export function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
export function monthDays(month: string) {
  const [year, index] = month.split('-').map(Number)
  return {
    offset: (new Date(year, index - 1, 1, 12).getDay() + 6) % 7,
    dates: Array.from({ length: new Date(year, index, 0, 12).getDate() }, (_, i) =>
      dateKey(year, index - 1, i + 1),
    ),
  }
}
export function shiftMonth(month: string, amount: number) {
  const [year, index] = month.split('-').map(Number)
  const date = new Date(year, index - 1 + amount, 1, 12)
  return dateKey(date.getFullYear(), date.getMonth(), 1).slice(0, 7)
}
export function migratePlan(days: StudyDay[]): BlockPlan {
  const names = [...new Set(days.filter((d) => d.kind !== 'Rust').map((d) => d.subject))]
  const subjects = names.map((name, i) => ({
    id: `import-${i}`,
    name,
    credits: 0,
    exam: days.find((d) => d.subject === name && d.kind === 'Examen')?.date || '',
  }))
  // Remove only the one exam now represented by each subject; keep every other old entry.
  const converted = new Set(
    subjects.map((s) => days.find((d) => d.subject === s.name && d.kind === 'Examen')?.id),
  )
  return { subjects, days: days.filter((d) => !converted.has(d.id)) }
}
export function planEntries(plan: BlockPlan): StudyDay[] {
  return [
    ...plan.days,
    ...plan.subjects
      .filter((s) => s.exam)
      .map((s) => ({ id: `exam-${s.id}`, date: s.exam, subject: s.name, kind: 'Examen' })),
  ].sort((a, b) => a.date.localeCompare(b.date))
}
export function paintDay(plan: BlockPlan, date: string, subject: string, kind: string): BlockPlan {
  if (planEntries(plan).some((d) => d.date === date && d.kind === 'Examen')) return plan
  const same = plan.days.filter((d) => d.date === date)
  const remove = same.length === 1 && same[0].subject === subject && same[0].kind === kind
  return {
    ...plan,
    days: [
      ...plan.days.filter((d) => d.date !== date),
      ...(remove || kind === 'Wissen' ? [] : [{ id: date, date, subject, kind }]),
    ],
  }
}
