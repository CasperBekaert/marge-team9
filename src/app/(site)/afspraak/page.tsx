import { PageIntro } from '@/components/marge/Shell'
import { MentorPlanner } from '@/components/marge/MentorPlanner'
export const metadata = { title: 'Plan een gesprek' }
export default function Appointment() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Even samen uitzoeken"
        title="Een moment dat voor jullie past."
        intro="Deel je vrije halfuren, vind de overlap en bevestig samen een gesprek. Geen heen-en-weer van losse berichtjes."
      />
      <MentorPlanner />
    </div>
  )
}
