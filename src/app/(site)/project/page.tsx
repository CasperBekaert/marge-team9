import Link from 'next/link'
import { PageIntro } from '@/components/marge/Shell'
export const metadata = { title: 'Over Marge' }
export default function Project() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Coaching en diversiteit · Team 9"
        title="Een beetje meer ruimte. Een beetje minder alleen."
        intro="Marge maakt een persoonlijke studieaanpak zichtbaar. Niet als recept voor de perfecte student, maar als vertrekpunt om zelf te proberen."
      />
      <article className="reading">
        <h2>Van mentorgesprek naar werkboek</h2>
        <p>
          Het idee ontstond vanuit Coaching en diversiteit: een mentor begeleidt eerstejaars die hun
          weg zoeken aan de universiteit. Een studiemethode uitleggen is niet altijd gemakkelijk.
          Hier kan je ze bekijken, aanklikken en toepassen.
        </p>
        <p>
          De eerste inhoudelijke uitwerking en het prototype zijn van Ziel. Deze website bouwt
          daarop verder met een eigen ontwerp, bewerkbare studiemethodes en gedeelde
          mentorafspraken.
        </p>
        <h2>Wat je hier kan doen</h2>
        <p>
          Je vindt een studiemethode op basis van je fase en je vraag. Je maakt je eigen week,
          deadlinelijst en blokplanning. En je spreekt met een mentor af door beschikbare halfuren
          te vergelijken en een voorstel te bevestigen.
        </p>
        <h2>Een werkend studieproject</h2>
        <p>
          Marge is gemaakt voor Waarde creëren met websites, academiejaar 2026–2027. Team 9 ·
          teamcode T09-7LPS. Dit is geen officiële website van de Universiteit Gent. De afspraken
          zijn testafspraken: gebruik uitsluitend verzonnen namen en geen persoonlijke of gevoelige
          informatie.
        </p>
        <p>
          De studieaanpak komt uit persoonlijke ervaring. Waar we algemene claims over leren maken,
          verwijzen we naar onderzoek. Geen enkele methode werkt voor iedereen, voor elk vak en op
          elk moment.
        </p>
        <h2>Hulp die verder gaat</h2>
        <p>
          Loop je vast, neem dan contact op met het monitoraat of de studiebegeleiding van je
          faculteit via de officiële universiteitskanalen. Marge vervangt die begeleiding niet.
        </p>
        <div className="actions">
          <Link className="button" href="/methodes">
            Zoek een methode
          </Link>
          <Link className="text-link" href="/afspraak">
            Plan een gesprek
          </Link>
        </div>
        <h2>Hoe het gebouwd is</h2>
        <p>
          De website gebruikt de cursusstarter met Next.js, Payload CMS en een Postgres-database.
          Inhoud kan via het CMS worden aangepast. GitHub bewaart de broncode en Vercel publiceert
          de website.
        </p>
        <p>
          <a href="https://github.com/CasperBekaert/marge-team9">
            Bekijk de broncode en projectdocumenten
          </a>
          .
        </p>
      </article>
    </div>
  )
}
