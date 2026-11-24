import { AudioGuide } from '@/components/marge/Audio'
import { introTranscript } from '@/content/audio'
import Link from 'next/link'
import { WeekIllustration, StudyQuiz } from '@/components/marge/StudyTools'
export default function Home() {
  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div>
            <p className="eyebrow">Van student tot student</p>
            <h1>
              Je eerste jaar.
              <br />
              Jouw ritme.<em>Een beetje marge.</em>
            </h1>
            <p className="lead">
              Een volle week hoeft geen vol hoofd te zijn. Ontdek hoe je plant, je lessen bijhoudt
              en samen met je mentor je weg vindt.
            </p>
            <div className="actions">
              <Link className="button" href="/planning">
                Maak ruimte in je week
              </Link>
              <Link className="text-link" href="/afspraak">
                Praat met je mentor
              </Link>
            </div>
            <p className="hero-foot">
              <span>Praktisch. Persoonlijk. Op jouw tempo.</span>
            </p>
          </div>
          <WeekIllustration />
        </section>
        <div className="intro-strip">
          <strong>Geen perfecte student nodig.</strong>
          <span>Wel een aanpak die bij je leven past.</span>
          <Link href="/project" className="text-link">
            Het verhaal achter Marge
          </Link>
        </div>
        <AudioGuide
          src="/audio/marge-intro.mp3"
          title="Marge in één minuut."
          transcript={introTranscript}
        />
        <section className="section">
          <div className="section-head">
            <h2>
              Waar zit je
              <br />
              <em>op dit moment?</em>
            </h2>
            <p>Begin bij wat je vandaag nodig hebt. Je hoeft niet alles tegelijk anders te doen.</p>
          </div>
          <div className="pathways">
            <Link href="/planning" className="pathway">
              <span className="phase-icon" aria-hidden="true">
                ▦
              </span>
              <h3>Mijn week loopt vol.</h3>
              <p>Bouw je planning in vier lagen en geef deadlines een vaste plek.</p>
              <span className="text-link">Ruimte maken</span>
            </Link>
            <Link href="/lessen" className="pathway">
              <span className="phase-icon" aria-hidden="true">
                ≋
              </span>
              <h3>Ik wil mee blijven.</h3>
              <p>Een lichte tas, gerichte notities en een kleine voorbereiding maken verschil.</p>
              <span className="text-link">Lessen bijhouden</span>
            </Link>
            <Link href="/examens" className="pathway">
              <span className="phase-icon" aria-hidden="true">
                ✳
              </span>
              <h3>De examens komen.</h3>
              <p>Van overzicht naar oefenen. Met tijd voor herhaling en voor jezelf.</p>
              <span className="text-link">Mijn blok aanpakken</span>
            </Link>
          </div>
        </section>
      </div>
      <section className="blue-band">
        <div className="wrap">
          <div>
            <p className="eyebrow">Even samen uitzoeken</p>
            <h2>
              Een halfuur praten.
              <br />
              <em>Weer wat overzicht.</em>
            </h2>
          </div>
          <div>
            <p>
              Je mentor hoeft niet alles voor je op te lossen. Soms helpt het al om je planning
              samen te bekijken. Geef allebei aan wanneer je kan, en vind een moment dat past.
            </p>
            <Link className="button light" href="/afspraak" style={{ marginTop: 25 }}>
              Plan een mentorgesprek
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap section">
        <div className="section-head">
          <h2>
            Dat voelt als studeren.
            <br />
            <em>Maar werkt het ook?</em>
          </h2>
          <p>Zes uitspraken die je misschien herkent. Ontdek wat onderzoek erover zegt.</p>
        </div>
        <StudyQuiz />
      </section>
    </>
  )
}
