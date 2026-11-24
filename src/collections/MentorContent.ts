import type { CollectionConfig } from 'payload'
import { publicContent, editorsOnly } from '../access'
const privateAccess = { read: editorsOnly, create: editorsOnly, update: editorsOnly, delete: editorsOnly }
export const StudyPhases: CollectionConfig = {
  slug: 'studyPhases', labels: { singular: 'Studiefase', plural: 'Studiefases' }, admin: { useAsTitle: 'name' }, access: publicContent,
  fields: [
    { name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'methods', type: 'join', collection: 'studyMethods', on: 'phases' },
  ],
}
export const StudyMethods: CollectionConfig = {
  slug: 'studyMethods', labels: { singular: 'Studiemethode', plural: 'Studiemethodes' }, admin: { useAsTitle: 'title' }, access: publicContent,
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'summary', type: 'textarea', required: true }, { name: 'body', type: 'textarea', required: true },
    { name: 'kind', type: 'select', options: ['uitleg', 'zelf'], required: true },
    { name: 'minutes', type: 'number', min: 1, defaultValue: 10 },
    { name: 'href', type: 'text', required: true },
    { name: 'phases', type: 'relationship', relationTo: 'studyPhases', hasMany: true, required: true },
  ],
}
export const MentorGroups: CollectionConfig = {
  slug: 'mentorGroups', labels: { singular: 'Mentorgroep', plural: 'Mentorgroepen' }, admin: { useAsTitle: 'name' }, access: privateAccess,
  fields: [{ name: 'name', type: 'text', required: true }, { name: 'inviteCode', type: 'text', required: true, unique: true, index: true }],
}
export const Participants: CollectionConfig = {
  slug: 'participants', labels: { singular: 'Deelnemer', plural: 'Deelnemers' }, admin: { useAsTitle: 'name' }, access: privateAccess,
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 80 },
    { name: 'group', type: 'relationship', relationTo: 'mentorGroups', required: true, index: true },
    { name: 'role', type: 'select', options: ['mentor', 'mentee'], required: true },
    { name: 'tokenHash', type: 'text', required: true, unique: true, index: true, admin: { hidden: true } },
    { name: 'availability', type: 'json', defaultValue: [] },
  ],
}
export const Appointments: CollectionConfig = {
  slug: 'appointments', labels: { singular: 'Mentorafspraak', plural: 'Mentorafspraken' }, admin: { useAsTitle: 'name' }, access: privateAccess,
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 100 },
    { name: 'group', type: 'relationship', relationTo: 'mentorGroups', required: true, index: true },
    { name: 'proposer', type: 'relationship', relationTo: 'participants', required: true },
    { name: 'partner', type: 'relationship', relationTo: 'participants', required: true },
    { name: 'startsAt', type: 'date', required: true, index: true },
    { name: 'status', type: 'select', options: ['proposed', 'confirmed', 'cancelled'], defaultValue: 'proposed', required: true },
    { name: 'place', type: 'select', options: ['online', 'bibliotheek'], defaultValue: 'bibliotheek', required: true },
    { name: 'requestId', type: 'text', unique: true, required: true },
  ],
}
