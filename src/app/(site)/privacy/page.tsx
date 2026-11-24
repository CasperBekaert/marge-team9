import { PageIntro } from '@/components/marge/Shell'
export const metadata = { title: 'Privacy en testgegevens' }
export default function Privacy() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Helder over je gegevens"
        title="Wat wordt waar bewaard?"
        intro="Marge is een cursusproject met testgegevens. Vul geen echte namen, e-mailadressen, medische informatie of andere gevoelige gegevens in."
      />
      <article className="reading">
        <h2>Je persoonlijke planners</h2>
        <p>
          Je weekplanning, deadlines, blokplanning en leerstoflijst worden opgeslagen in de lokale
          opslag van je browser. Ze gaan niet naar onze database. Wis je browsergegevens, dan
          verdwijnen ook die lijsten. Download een kopie als je ze wil behouden.
        </p>
        <h2>Mentorgroepen en afspraken</h2>
        <p>
          Verzonnen namen, rollen, beschikbaarheid, groepskoppelingen en afspraken worden op de
          projectdatabase bij Neon in Frankfurt bewaard. Zo kunnen mentor en mentee op verschillende
          toestellen samenwerken. De website draait op Vercel. De projectbeheerder kan deze
          testrecords in Payload CMS bekijken en verwijderen.
        </p>
        <p>
          De koppelcode laat iemand als nieuw groepslid aansluiten. Je persoonlijke toegangscode
          geeft toegang tot jouw rooster en afspraken. Die code blijft in je browser; de database
          bewaart alleen een cryptografische hash. Deel je persoonlijke code niet. Afmelden
          verwijdert de lokale toegangscode, niet de opgeslagen testrecords.
        </p>
        <p>
          De beheerder verwijdert testgroepen na de cursus en controleert maandelijks welke oude
          testrecords weg kunnen. Automatische verwijdering is nog niet ingesteld. Gebruik daarom
          uitsluitend verzonnen gegevens.
        </p>
        <h2>Technische gegevens en misbruikbeperking</h2>
        <p>
          De hosting ontvangt technische gegevens bij het openen van een pagina. Om spam te beperken
          bewaart de website tijdelijk een gezouten hash van het IP-adres. Deze limitergegevens
          worden bij volgende verzoeken na maximaal een uur opgeruimd. Beheerders gebruiken
          noodzakelijke inlogcookies voor het CMS.
        </p>
        <h2>Vercel Web Analytics</h2>
        <p>
          De site gebruikt Vercel Web Analytics om paginaweergaven te tellen. De code verwijdert
          zoekparameters en fragmenten voordat een pagina-adres naar analytics gaat. Namen,
          toegangscodes, afspraakinhoud en persoonlijke planners worden niet als analytics-events
          verzonden. Op het Hobby-plan tellen we voltooide afspraken via de database, niet via
          custom events.
        </p>
        <p>
          Vercel beschrijft Web Analytics als cookieloos. Lees de{' '}
          <a href="https://vercel.com/docs/analytics/privacy-policy">privacy-uitleg van Vercel</a>{' '}
          voor de verwerking door die dienst.
        </p>
        <h2>OpenStreetMap</h2>
        <p>
          Een kaart wordt pas geladen nadat je op Toon de kaart klikt. OpenStreetMap ontvangt dan
          onder meer je IP-adres en technische browsergegevens. Je kan de locatie ook lezen zonder
          een kaart te laden. Zie het{' '}
          <a href="https://osmfoundation.org/wiki/Privacy_Policy">
            privacybeleid van OpenStreetMap
          </a>
          .
        </p>
        <h2>Een testrecord verwijderen</h2>
        <p>
          Vraag het team dat je de demonstratie toont om je testgroep via het CMS te verwijderen.
          Geef alleen de groepsnaam door, nooit je persoonlijke toegangscode. De teambeheerder is
          verantwoordelijk voor het beheer van deze cursusversie.
        </p>
        <p className="smallprint">Laatst bijgewerkt: 24 november 2026.</p>
      </article>
    </div>
  )
}
