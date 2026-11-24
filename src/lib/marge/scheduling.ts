export function validSlot(value: unknown, now = Date.now()): value is string {
  if (typeof value !== 'string') return false
  const time = Date.parse(value)
  return (
    Number.isFinite(time) &&
    new Date(time).toISOString() === value &&
    time > now &&
    time < now + 90 * 86400000 &&
    time % 1800000 === 0
  )
}
export function cleanAvailability(value: unknown, now = Date.now()): string[] {
  if (!Array.isArray(value) || value.length > 1500) throw new Error('Kies maximaal 1500 halfuren.')
  if (value.some((v) => !validSlot(v, now)))
    throw new Error('Kies toekomstige halfuren binnen de komende 90 dagen.')
  return [...new Set(value as string[])].sort()
}
export function commonSlots(a: unknown, b: unknown, now = Date.now()): string[] {
  return Array.isArray(a) && Array.isArray(b)
    ? a.filter((v): v is string => validSlot(v, now) && b.includes(v)).sort()
    : []
}
