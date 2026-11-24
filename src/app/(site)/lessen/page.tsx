import Link from 'next/link'
import { PageIntro, Note } from '@/components/marge/Shell'
import { NotePicker } from '@/components/marge/StudyTools'
export const metadata = { title: 'Lessen bijhouden' }
export default function Lessons() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Lessen · kleine gewoontes, minder inhaalwerk"
        title="Mee zijn begint vóór de blok."
        intro="Je hoeft niet na elke les alles te kennen. Wel weten waar je materiaal zit, wat de kern was en welke vraag je nog hebt."
      />
      <nav className="subnav" aria-label="Op deze pagina">
        <a href="#mapconcept">Je materiaal</a>
        <a href="#voorbereiden">Vóór de les</a>
        <a href="#notities">Notities kiezen</a>
      </nav>
      <section className="editorial" id="mapconcept">
        <p className="eyebrow">Een vaste plek</p>
        <div>
          <h2>
            Grote map thuis.
            <br />
            <em>Alleen vandaag mee.</em>
          </h2>
          <p>
            Ziel bewaart al het lesmateriaal per vak in een grote map. In de ringmap voor school
            gaan alleen de hoofdstukken van die dag. Zo blijft de tas licht en raakt de rest niet
            zoek.
          </p>
          <div className="steps">
            {[
              [
                'Verzamel per vak',
                'Gebruik tussenbladen. Digitaal: één hoofdmap per vak, met begrijpelijke bestandsnamen.',
              ],
              [
                'Kijk naar morgen',
                'Welke vakken en hoofdstukken komen aan bod? Leg ze de avond ervoor klaar.',
              ],
              [
                'Neem ruimte voor notities mee',
                'Een paar extra blaadjes of een klaarstaand notitiebestand besparen gezoek.',
              ],
              ['Berg het na de les op', 'Stop de nieuwe notities meteen bij het juiste hoofdstuk.'],
            ].map(([h, p], i) => (
              <div className="step" key={h}>
                <b>{i + 1}</b>
                <div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="editorial" id="voorbereiden">
        <p className="eyebrow">Vijf minuten vooraf</p>
        <div>
          <h2>Een eerste blik geeft houvast.</h2>
          <p>
            Lees de titel en tussentitels, kijk hoeveel dia’s er zijn en blader kort door de uitleg.
            Je hoeft nog niets te blokken. Je bouwt een kapstok waaraan de les straks kan hangen.
          </p>
          <div className="choice-box">
            <p className="eyebrow">Probeer bij je volgende les</p>
            <h3>Schrijf één vraag op.</h3>
            <p>
              “Wat wil ik na deze les kunnen uitleggen?” Kom er na de les even op terug. Is het
              antwoord nog onduidelijk, dan weet je wat je aan je docent of mentor kan vragen.
            </p>
          </div>
        </div>
      </section>
      <section className="editorial" id="notities">
        <p className="eyebrow">Jouw vak, jouw notities</p>
        <div>
          <h2>
            Niet alles hoeft
            <br />
            <em>woord voor woord.</em>
          </h2>
          <p>
            Kies hoe je noteert op basis van de les. Formules uitwerken vraagt iets anders dan een
            voorbeeld bij een bestaande slide schrijven.
          </p>
          <NotePicker />
          <Note>
            Een voorkeur is geen vaste leerstijl. Probeer een aanpak en kijk of je de leerstof ermee
            kan uitleggen.
          </Note>
          <div className="actions">
            <Link className="button" href="/examens">
              Van notities naar studeren
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
