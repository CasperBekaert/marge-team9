import { createHash, randomBytes } from 'node:crypto'
import { createLocalReq, getPayload, type PayloadRequest } from 'payload'
import config from '@/payload.config'
import { allowRequest, clientKey } from '@/tasks/book-slot/guards'
import { lockTimeSlot } from '@/lib/slotLock'
import { cleanAvailability, commonSlots, validSlot } from '@/lib/marge/scheduling'
export const dynamic = 'force-dynamic'
const hash = (s: string) => createHash('sha256').update(s).digest('hex')
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
export async function POST(request: Request) {
  const payload = await getPayload({ config })
  let transactionID: number | string | null = null
  try {
    const origin = request.headers.get('origin')
    if (origin && origin !== new URL(request.url).origin)
      return json({ error: 'Dit verzoek komt niet van Marge.' }, 403)
    if (Number(request.headers.get('content-length') || 0) > 100000)
      return json({ error: 'Te veel gegevens.' }, 413)
    const body = await request.json()
    const action = String(body.action || '')
    if (
      !(await allowRequest(
        `mentor:${clientKey(request.headers)}`,
        action === 'state' ? 120 : 60,
        1,
        { payload },
      ))
    )
      return json({ error: 'Even te veel verzoeken. Probeer over een minuut opnieuw.' }, 429)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (action === 'create' || action === 'join' || action === 'demo') {
      if (action !== 'demo' && (name.length < 2 || name.length > 80))
        return json({ error: 'Vul een verzonnen naam van 2 tot 80 tekens in.' }, 400)
      let group
      if (action === 'join') {
        group = (
          await payload.find({
            collection: 'mentorGroups',
            where: {
              inviteCode: {
                equals: String(body.code || '')
                  .trim()
                  .toUpperCase(),
              },
            },
            limit: 1,
            depth: 0,
          })
        ).docs[0]
        if (!group)
          return json(
            { error: 'Deze koppelcode klopt niet. Vraag je mentor om de volledige code.' },
            400,
          )
        if (
          (
            await payload.count({
              collection: 'participants',
              where: { group: { equals: group.id } },
            })
          ).totalDocs >= 10
        )
          return json({ error: 'Deze groep is vol. Je mentor kan een nieuwe groep maken.' }, 409)
      } else {
        group = await payload.create({
          collection: 'mentorGroups',
          data: {
            name: action === 'demo' ? 'Voorbeeldgroep' : `Groep van ${name}`,
            inviteCode: randomBytes(6).toString('hex').toUpperCase(),
          },
        })
      }
      const token = randomBytes(32).toString('hex')
      await payload.create({
        collection: 'participants',
        data: {
          name: action === 'demo' ? 'Mentee Voorbeeld' : name,
          role: action === 'create' ? 'mentor' : 'mentee',
          group: group.id,
          tokenHash: hash(token),
          availability: [],
        },
      })
      let demoMentorToken
      if (action === 'demo') {
        demoMentorToken = randomBytes(32).toString('hex')
        const slots = Array.from({ length: 7 }, (_, day) => {
          const d = new Date()
          d.setUTCDate(d.getUTCDate() + day + 1)
          d.setUTCHours(14, 0, 0, 0)
          return d.toISOString()
        })
        await payload.create({
          collection: 'participants',
          data: {
            name: 'Mentor Voorbeeld',
            role: 'mentor',
            group: group.id,
            tokenHash: hash(demoMentorToken),
            availability: slots,
          },
        })
      }
      return json({ token, demoMentorToken })
    }
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '') || ''
    if (!/^[a-f0-9]{64}$/.test(token))
      return json({ error: 'Meld je eerst aan met je persoonlijke toegangscode.' }, 401)
    let me = (
      await payload.find({
        collection: 'participants',
        where: { tokenHash: { equals: hash(token) } },
        depth: 0,
        limit: 1,
      })
    ).docs[0]
    if (!me)
      return json(
        { error: 'Je toegangscode is niet meer geldig. Sluit opnieuw aan bij je mentor.' },
        401,
      )
    const groupId = Number(me.group)
    // Serialize changes per group. The lock covers reading availability and saving an appointment.
    if (action !== 'state' && payload.config.custom?.databaseTransactions !== false)
      transactionID = (await payload.db.beginTransaction()) ?? null
    const req: PayloadRequest = await createLocalReq(
      { req: { transactionID: transactionID ?? undefined } },
      payload,
    )
    if (transactionID) await lockTimeSlot(req, groupId, 'mentorGroups')
    me = await payload.findByID({ collection: 'participants', id: me.id, depth: 0, req })
    if (action === 'availability') {
      const slots = cleanAvailability(body.slots)
      await payload.update({
        collection: 'participants',
        id: me.id,
        data: { availability: slots },
        req,
      })
    } else if (action === 'propose') {
      const partner = await payload.findByID({
        collection: 'participants',
        id: Number(body.partner),
        depth: 0,
        disableErrors: true,
        req,
      })
      if (!partner || Number(partner.group) !== groupId || partner.role === me.role)
        throw new Error('Kies je mentor of een mentee uit je eigen groep.')
      if (
        !validSlot(body.startsAt) ||
        !commonSlots(me.availability, partner.availability).includes(body.startsAt)
      )
        throw new Error(
          'Dit moment is niet meer voor jullie allebei beschikbaar. Bewaar je beschikbaarheid en vernieuw de lijst.',
        )
      if (!['online', 'bibliotheek'].includes(body.place))
        throw new Error('Kies een ontmoetingsplek.')
      if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,64}$/.test(body.requestId))
        throw new Error('Vernieuw de pagina en probeer opnieuw.')
      const prior = (
        await payload.find({
          collection: 'appointments',
          where: { requestId: { equals: body.requestId } },
          depth: 0,
          limit: 1,
          req,
        })
      ).docs[0]
      if (prior) {
        if (Number(prior.proposer) !== me.id) throw new Error('Dit verzoek is niet van jou.')
      } else {
        const conflicts = await payload.count({
          collection: 'appointments',
          where: {
            and: [
              { group: { equals: groupId } },
              { startsAt: { equals: body.startsAt } },
              { status: { in: ['proposed', 'confirmed'] } },
              {
                or: [
                  { proposer: { in: [me.id, partner.id] } },
                  { partner: { in: [me.id, partner.id] } },
                ],
              },
            ],
          },
          req,
        })
        if (conflicts.totalDocs)
          throw new Error(
            'Een van jullie heeft op dit moment al een voorstel of afspraak. Kies een ander halfuur.',
          )
        await payload.create({
          collection: 'appointments',
          data: {
            name: name || `${me.name} en ${partner.name}`.slice(0, 100),
            group: groupId,
            proposer: me.id,
            partner: partner.id,
            startsAt: body.startsAt,
            place: body.place,
            status: 'proposed',
            requestId: body.requestId,
          },
          req,
        })
      }
    } else if (action === 'confirm' || action === 'cancel') {
      const appointment = await payload.findByID({
        collection: 'appointments',
        id: Number(body.id),
        depth: 0,
        disableErrors: true,
        req,
      })
      if (
        !appointment ||
        Number(appointment.group) !== groupId ||
        ![Number(appointment.proposer), Number(appointment.partner)].includes(me.id)
      )
        throw new Error('Deze afspraak hoort niet bij jou.')
      if (action === 'confirm') {
        if (Number(appointment.partner) !== me.id)
          throw new Error('De andere persoon bevestigt je voorstel.')
        if (appointment.status === 'cancelled')
          throw new Error('Deze afspraak is geannuleerd. Maak een nieuw voorstel.')
        if (!validSlot(appointment.startsAt))
          throw new Error('Dit moment is verstreken. Kies een nieuw moment.')
        const proposer = await payload.findByID({
          collection: 'participants',
          id: Number(appointment.proposer),
          depth: 0,
          req,
        })
        if (!commonSlots(me.availability, proposer.availability).includes(appointment.startsAt))
          throw new Error(
            'Jullie beschikbaarheid is veranderd. Annuleer dit voorstel en kies een nieuw moment.',
          )
      }
      await payload.update({
        collection: 'appointments',
        id: appointment.id,
        data: { status: action === 'confirm' ? 'confirmed' : 'cancelled' },
        req,
      })
    } else if (action !== 'state') throw new Error('Onbekende actie.')
    if (transactionID) {
      await payload.db.commitTransaction(transactionID)
      transactionID = null
    }
    const [group, people, appointments] = await Promise.all([
      payload.findByID({ collection: 'mentorGroups', id: groupId, depth: 0 }),
      payload.find({
        collection: 'participants',
        where: { group: { equals: groupId } },
        depth: 0,
        limit: 10,
      }),
      payload.find({
        collection: 'appointments',
        where: {
          and: [
            { group: { equals: groupId } },
            { or: [{ proposer: { equals: me.id } }, { partner: { equals: me.id } }] },
          ],
        },
        depth: 0,
        sort: '-startsAt',
        limit: 100,
      }),
    ])
    return json({
      me: me.id,
      group: { name: group.name, inviteCode: group.inviteCode },
      people: people.docs.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        availability: p.availability,
      })),
      appointments: appointments.docs.map((a) => ({
        id: a.id,
        name: a.name,
        startsAt: a.startsAt,
        status: a.status,
        place: a.place,
        proposer: a.proposer,
        partner: a.partner,
      })),
    })
  } catch (error) {
    if (transactionID) await payload.db.rollbackTransaction(transactionID)
    const message = error instanceof Error ? error.message : 'Er ging iets mis.'
    if (/^(Kies|Dit|Deze|Vul|Je |De andere|Een van|Jullie|Vernieuw|Onbekende)/.test(message))
      return json({ error: message }, 400)
    payload.logger.error(
      'Mentor request failed; inspect deployment logs without exposing participant data.',
    )
    return json(
      {
        error:
          'Opslaan is niet gelukt. Je invoer blijft staan. Probeer opnieuw; dubbel verzenden maakt geen dubbele afspraak.',
      },
      500,
    )
  }
}
