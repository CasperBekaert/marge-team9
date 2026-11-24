import Link from 'next/link'
import { PageIntro, Note } from '@/components/marge/Shell'
import { EnergyPicker } from '@/components/marge/StudyTools'
export const metadata = { title: 'Je examens aanpakken' }
export default function Exams() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Examens · begrijpen, oefenen, terugkomen"
        title="Van een stapel leerstof naar een helder plan."
        intro="Begin met overzicht. Maak de kern actief. En kom er later nog eens op terug. Je cursus herkennen is iets anders dan hem zelf kunnen uitleggen."
      />
      <nav className="subnav" aria-label="Op deze pagina">
        <a href="#markeren">Tekst verwerken</a>
        <a href="#mindmap">Mindmap</a>
        <a href="#zelf-testen">Zelf testen</a>
        <a href="#energie">Mijn energie</a>
      </nav>
      <section className="editorial" id="markeren">
        <p className="eyebrow">Structuur aanbrengen</p>
        <div>
          <h2>
            Een markeerstift
            <br />
            <em>doet het werk niet alleen.</em>
          </h2>
          <p>
            Begin bij de inhoudstafel en lees een stuk volledig voordat je markeert. Geef begrippen
            en kerninformatie een vaste betekenis in je kleurgebruik. Sluit daarna de cursus: kan je
            in je eigen woorden uitleggen wat je markeerde?
          </p>
          <div className="steps">
            {[
              'Bekijk het hoofdstuk en de tussentitels.',
              'Lees globaal waar het over gaat.',
              'Markeer enkele belangrijke begrippen.',
              'Maak van de kern een vraag die je zelf beantwoordt.',
            ].map((s, i) => (
              <div className="step" key={s}>
                <b>{i + 1}</b>
                <p>{s}</p>
              </div>
            ))}
          </div>
          <Note>
            Markeren is een voorbereiding op leren. Een pagina vol kleur is nog geen bewijs dat je
            de inhoud kent.
          </Note>
        </div>
      </section>
      <section className="editorial" id="mindmap">
        <p className="eyebrow">Het grote geheel</p>
        <div>
          <h2>
            Eén hoofdstuk.
            <br />
            <em>Eén overzicht.</em>
          </h2>
          <p>
            Zet de hoofdstuktitel centraal. Geef elke hoofdtitel een tak en voeg alleen de
            belangrijkste begrippen en verbanden toe. Een mindmap hoeft niet mooi genoeg voor
            Instagram te zijn. Ze moet je helpen nadenken.
          </p>
          <div className="choice-box">
            <h3>De lege-bladtest</h3>
            <p>
              Leg je cursus en mindmap weg. Teken de structuur op een leeg blad. Vergelijk daarna:
              welke verbanden mis je? Daar zit je volgende studeerstap.
            </p>
          </div>
        </div>
      </section>
      <section className="editorial" id="zelf-testen">
        <p className="eyebrow">Actief oefenen</p>
        <div>
          <h2>
            Laat je brein
            <br />
            <em>het antwoord ophalen.</em>
          </h2>
          <p>
            Formuleer vragen, maak oefeningen of leg een begrip hardop uit zonder te kijken.
            Controleer je antwoord en plan de moeilijke vragen op een andere dag opnieuw.
          </p>
          <p>
            Een volledige samenvatting uitschrijven kost veel tijd. Soms helpt ze je structureren,
            maar blijf controleren of je er ook mee oefent. Kies bewust wat jouw vak nodig heeft.
          </p>
          <Link
            className="text-link"
            href="/methodes?fase=examens"
            style={{ display: 'inline-block', marginTop: 20 }}
          >
            Bekijk methodes voor de examenperiode
          </Link>
        </div>
      </section>
      <section className="editorial" id="energie">
        <p className="eyebrow">Ook jij telt mee</p>
        <div>
          <h2>
            Wat past er
            <br />
            <em>vandaag nog bij?</em>
          </h2>
          <p>
            Niet elk moment is geschikt voor de moeilijkste leerstof. Kies iets haalbaars, zonder
            van elke pauze een productiviteitstruc te maken.
          </p>
          <EnergyPicker />
        </div>
      </section>
    </div>
  )
}
