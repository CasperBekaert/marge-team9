export const SITE_NAME = 'Marge'

// The browser tab's title. The home page shows the name alone; every other page gives only its own part
// (such as "Repair clinic") and Next.js adds " · " and the name after it, so a tab or a bookmark says both
// what the page is and which site it belongs to. Used by src/app/(site)/layout.tsx.
export const SITE_TITLE = { default: SITE_NAME, template: `%s · ${SITE_NAME}` }

export const CAMPUS_CYCLE = {
  // The place, the e-mail address and the pricing rule (below) go into the Site facts global
  // (src/globals/SiteFacts.ts): every page that shows them reads them from there.
  place: 'Bibliotheek De Krook (voorbeeldlocatie)',
  email: 'beheer@marge.example',
  pricingRule: 'Tools, a tutor and standard parts are included. Bring your own parts and pay EUR 5 less per bicycle.',
  // The clinic is NOT in the seed: you add it yourself in /admin (a later exercise in the course asks
  // you to add it), with its time slots. These are the agreed facts for it: Saturday 15:00 to 17:00,
  // four 30-minute slots, two bicycles per slot.
  // Nothing reads these; they are here so you type the same values in /admin.
  clinicDefaults: {
    day: 'Saturday',
    startTime: '15:00',
    endTime: '17:00',
    slotMinutes: 30,
    placesPerSlot: 2,
    slotTimes: ['15:00', '15:30', '16:00', '16:30'],
  },
} as const

// Shown on the booking form, in the booking confirmation and on the privacy page. One copy here, so
// the three places can never say it differently. (The browser checks keep their own copy on purpose,
// in tests/e2e/helpers.ts, so a change here shows up there.)
export const MADE_UP_DATA_NOTICE = 'This is a practice project: use made-up details; no one will contact you.'

// What the booking confirmation page shows after a booking was saved.
export const BOOKING_CONFIRMATION = `Your booking is saved. ${MADE_UP_DATA_NOTICE}`

