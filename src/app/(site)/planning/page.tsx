import { FocusSound } from '@/components/marge/Audio'
import { PageIntro, Note } from '@/components/marge/Shell'
import { WeekIllustration } from '@/components/marge/StudyTools'
import { WeekPlanner, Deadlines, BlockPlanner, Chapters } from '@/components/marge/PlanningTools'
export const metadata = { title: 'Maak ruimte in je week' }
export default function Planning() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Plannen · van overzicht naar ademruimte"
        title="Een week die ook voor jou werkt."
        intro="Je hoeft niet elk uur nuttig te maken. Een goede planning laat je zien wat moet gebeuren én wanneer je gerust vrij kan zijn."
      />
      <nav className="subnav" aria-label="Op deze pagina">
        <a href="#vier-lagen">De vier lagen</a>
        <a href="#weekplanner">Mijn week</a>
        <a href="#deadlines">Deadlines</a>
        <a href="#blokplanner">Blokplanning</a>
        <a href="#leerstof">Leerstof</a>
      </nav>
      <section className="editorial" id="vier-lagen">
        <p className="eyebrow">Zo pakt Ziel het aan</p>
        <div>
          <h2>
            Eerst wat vastligt.
            <br />
            <em>Dan de rest.</em>
          </h2>
          <p>
            Vul je week altijd in dezelfde volgorde in. Zo probeer je studietijd niet tussen
            onzichtbare afspraken te proppen.
          </p>
          <div className="steps">
            {[
              [
                'Lessen en examens',
                'Neem je vaste rooster over. Ook de les waarvoor je nog twijfelt of je gaat.',
              ],
              [
                'Je leven buiten de les',
                'Sport, werk, vrienden en familie horen in dezelfde agenda.',
              ],
              [
                'Haalbare studeeruren',
                'Bepaal per blok wat je wil afwerken. Begin kleiner dan je denkt.',
              ],
              [
                'Marge voor het onverwachte',
                'Laat reserve vrij. Een uitgelopen taak hoeft dan niet je hele week omver te gooien.',
              ],
            ].map(([title, text], i) => (
              <div className="step" key={title}>
                <b>{i + 1}</b>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <Note>Reserve-uren niet nodig? Dan heb je vrije tijd gewonnen.</Note>
        </div>
      </section>
      <FocusSound />
      <WeekPlanner />
      <section className="editorial">
        <p className="eyebrow">Minder onthouden</p>
        <div>
          <h2>Je hoofd is geen takenlijst.</h2>
          <p>
            Zet taken en tests van alle vakken samen. De datum, het vak en wat precies af moet zijn:
            meer heb je niet nodig om te starten.
          </p>
        </div>
      </section>
      <Deadlines />
      <section className="editorial">
        <p className="eyebrow">Voor de blok</p>
        <div>
          <h2>Plan terug vanaf je examens.</h2>
          <p>
            De examendata liggen vast. Geef de dagen ervoor een doel. Weeg de omvang van het vak,
            wat je al kent en wat je nog lastig vindt mee. Studiepunten alleen vertellen niet het
            hele verhaal.
          </p>
          <Note>
            Plan herhaling en rust mee in. De dag voor een examen hoeft geen reddingsoperatie te
            worden.
          </Note>
        </div>
      </section>
      <BlockPlanner />
      <Chapters />
      <details className="tool">
        <summary>Liever op papier?</summary>
        <p style={{ marginTop: 20 }}>
          Gebruik de knop Afdrukken / PDF in de planners. Je browser biedt Afdrukken en Opslaan als
          PDF. Een lege planner kan je ook afdrukken voordat je blokken toevoegt.
        </p>
        <div style={{ maxWidth: 500 }}>
          <WeekIllustration />
        </div>
      </details>
    </div>
  )
}
