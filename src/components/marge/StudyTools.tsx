'use client'
import { useState } from 'react'
export function WeekIllustration() {
  const [layer, setLayer] = useState(4)
  const entries = [
    { text: 'Economie', col: 2, row: 2, kind: '', level: 1 },
    { text: 'Statistiek', col: 3, row: 3, kind: '', level: 1 },
    { text: 'Werkcollege', col: 5, row: 2, kind: '', level: 1 },
    { text: 'Sport', col: 4, row: 5, kind: 'pink', level: 2 },
    { text: 'Bijbaan', col: 6, row: 4, kind: 'pink', level: 2 },
    { text: 'Oefeningen', col: 2, row: 4, kind: 'green', level: 3 },
    { text: 'Herhalen', col: 5, row: 4, kind: 'green', level: 3 },
    { text: 'Reserve', col: 3, row: 5, kind: 'yellow', level: 4 },
    { text: 'Niets moet.', col: 6, row: 6, kind: 'yellow', level: 4 },
  ]
  return (
    <div className="hero-art">
      <div className="workbook">
        <div className="workbook-head">
          <strong>Een week met marge.</strong>
          <span>Jouw werkboek</span>
        </div>
        <div className="mini-calendar" aria-label="Voorbeeldweek met vier lagen">
          <span />
          {['ma', 'di', 'wo', 'do', 'vr'].map((d) => (
            <span key={d}>{d}</span>
          ))}
          {['09u', '11u', '13u', '15u', '17u'].map((t, i) => (
            <span key={t} style={{ gridRow: i + 2, gridColumn: 1 }}>
              {t}
            </span>
          ))}
          {entries
            .filter((e) => e.level <= layer)
            .map((e) => (
              <div
                key={e.text}
                className={`mini-slot ${e.kind}`}
                style={{ gridColumn: e.col, gridRow: e.row }}
              >
                {e.text}
              </div>
            ))}
        </div>
        <p className="handnote">Laat ook wat ruimte over.</p>
        <div
          className="tab-row"
          style={{ margin: '18px 0 0' }}
          aria-label="Lagen van de voorbeeldweek"
        >
          {['Lessen', 'Leven', 'Studie', 'Marge'].map((label, i) => (
            <button
              key={label}
              className="quiet-button"
              aria-pressed={layer >= i + 1}
              onClick={() => setLayer(i + 1)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <span className="art-caption">Een plan dat ook ademhaalt.</span>
    </div>
  )
}
const quiz = [
  [
    'Herlezen is de beste manier om leerstof lang te onthouden.',
    false,
    'Herlezen geeft herkenning. Jezelf testen en het leren spreiden zijn doorgaans doeltreffender voor langdurig onthouden.',
    'Dunlosky e.a.',
    'https://doi.org/10.1177/1529100612453266',
  ],
  [
    'Jezelf overhoren kan meer helpen dan dezelfde tijd opnieuw lezen.',
    true,
    'Voor herinnering na meerdere dagen vonden onderzoekers een voordeel van jezelf testen. Controleer je antwoorden en herhaal wat nog niet lukt.',
    'Roediger & Karpicke',
    'https://doi.org/10.1111/j.1467-9280.2006.01693.x',
  ],
  [
    'Dezelfde studietijd spreiden over meerdere dagen helpt je langer onthouden.',
    true,
    'Verspreide oefening helpt doorgaans meer dan alles in één lange sessie stoppen. Hoeveel tijd ertussen past, hangt af van wanneer je het moet kennen.',
    'Cepeda e.a.',
    'https://doi.org/10.1037/0033-2909.132.3.354',
  ],
  [
    'Je leert beter als alle uitleg past bij jouw visuele of auditieve leerstijl.',
    false,
    'Voorkeuren bestaan, maar goed bewijs voor lesgeven op basis van zulke leerstijlprofielen ontbreekt. Kies de aanpak die bij de leerstof past.',
    'Pashler e.a.',
    'https://doi.org/10.1111/j.1539-6053.2009.01038.x',
  ],
  [
    'Even iets anders doen op je laptop tijdens de les heeft geen invloed.',
    false,
    'In een experiment begrepen multitaskende studenten de les minder goed. Ook studenten die het afleidende scherm konden zien scoorden lager.',
    'Sana, Weston & Cepeda',
    'https://doi.org/10.1016/j.compedu.2012.10.003',
  ],
  [
    'Slapen helpt bij het vastzetten van wat je hebt geleerd.',
    true,
    'Slaap draagt bij aan het verwerken en consolideren van herinneringen. Een nacht doorstuderen is geen vervanging voor een haalbare planning.',
    'Diekelmann & Born',
    'https://doi.org/10.1038/nrn2762',
  ],
] as const
export function StudyQuiz() {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const item = quiz[index]
  return (
    <div className="quiz">
      <div className="progress" aria-hidden="true">
        {quiz.map((_, i) => (
          <span key={i} className={i <= index ? 'active' : ''} />
        ))}
      </div>
      <p className="eyebrow" style={{ margin: 0 }}>
        Mythe of feit? · {index + 1} van {quiz.length}
      </p>
      <h3>{item[0]}</h3>
      {answer === null ? (
        <div className="actions" style={{ margin: 0 }}>
          <button
            className="button secondary"
            onClick={() => {
              setAnswer(false)
              if (!item[1]) setScore((s) => s + 1)
            }}
          >
            Mythe
          </button>
          <button
            className="button"
            onClick={() => {
              setAnswer(true)
              if (item[1]) setScore((s) => s + 1)
            }}
          >
            Feit
          </button>
        </div>
      ) : (
        <div className="quiz-result" role="status">
          <strong>
            {answer === item[1] ? 'Goed gezien.' : 'Dat ligt anders.'} Het is{' '}
            {item[1] ? 'een feit' : 'een mythe'}.
          </strong>
          <p>{item[2]}</p>
          <p className="smallprint">
            <a href={item[4]} target="_blank" rel="noreferrer">
              Onderzoek: {item[3]}
            </a>
          </p>
          <button
            className="button small"
            style={{ marginTop: 20 }}
            onClick={() => {
              setAnswer(null)
              if (index === 5) {
                setIndex(0)
                setScore(0)
              } else setIndex((i) => i + 1)
            }}
          >
            {index === 5 ? `${score} van 6 juist · Opnieuw proberen` : 'Volgende uitspraak'}
          </button>
        </div>
      )}
    </div>
  )
}
export function NotePicker() {
  const [board, setBoard] = useState('')
  const [slides, setSlides] = useState('')
  return (
    <div className="tool">
      <fieldset>
        <legend>Maakt de docent veel berekeningen of tekeningen op het bord?</legend>
        <div className="tab-row" style={{ marginTop: 15 }}>
          {['Ja', 'Nee'].map((v) => (
            <button key={v} className="tab" aria-pressed={board === v} onClick={() => setBoard(v)}>
              {v}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Staat de uitleg al goed op de slides?</legend>
        <div className="tab-row" style={{ marginTop: 15 }}>
          {['Ja', 'Nee, veel extra uitleg'].map((v) => (
            <button
              key={v}
              className="tab"
              aria-pressed={slides === v}
              onClick={() => setSlides(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </fieldset>
      {board && slides && (
        <div className="choice-box" role="status">
          <h3>
            {board === 'Ja'
              ? 'Geef je tekeningen ruimte.'
              : slides === 'Ja'
                ? 'Noteer vooral wat erbij komt.'
                : 'Verbind je notities met de slides.'}
          </h3>
          <p>
            {board === 'Ja'
              ? 'Papier of een tekentablet helpt bij formules en schema’s. Schrijf ook op waarom elke stap gebeurt.'
              : slides === 'Ja'
                ? 'Schrijf voorbeelden, verbanden en je eigen vragen bij de slides. Je hoeft de gedrukte tekst niet over te nemen.'
                : 'Typ of schrijf de aanvullende uitleg bij de juiste slide. Werk afkortingen en onduidelijkheden kort na de les bij.'}
          </p>
        </div>
      )}
    </div>
  )
}
export function EnergyPicker() {
  const [energy, setEnergy] = useState(2)
  const suggestions = [
    [
      'Vandaag mag het kleiner.',
      'Leg je materiaal klaar, kies één klein vertrekpunt of neem eerst rust.',
    ],
    [
      'Begin met iets overzichtelijks.',
      'Werk je deadlinelijst bij of leg de hoofdstukken voor morgen klaar.',
    ],
    [
      'Kort en actief werkt ook.',
      'Overhoor jezelf tien minuten, oefen woordenschat of maak enkele vragen.',
    ],
    [
      'Er is ruimte voor een uitdaging.',
      'Werk een lastige oefening uit en leg elke stap in je eigen woorden uit.',
    ],
    [
      'Gebruik je aandacht bewust.',
      'Pak nieuwe of moeilijke leerstof aan. Plan een pauze voordat je concentratie op is.',
    ],
  ]
  return (
    <div className="tool">
      <label htmlFor="energy">Mijn energie op dit moment</label>
      <input
        className="range"
        id="energy"
        type="range"
        min="0"
        max="4"
        value={energy}
        onChange={(e) => setEnergy(Number(e.target.value))}
      />
      <div className="tool-head">
        <span>Weinig</span>
        <span>Veel</span>
      </div>
      <div className="choice-box" role="status">
        <h3>{suggestions[energy][0]}</h3>
        <p>{suggestions[energy][1]}</p>
      </div>
    </div>
  )
}
export function MapEmbed() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      {open ? (
        <iframe
          className="map-frame"
          title="OpenStreetMap: voorbeeldlocatie Bibliotheek De Krook in Gent"
          src="https://www.openstreetmap.org/export/embed.html?bbox=3.7210%2C51.0470%2C3.7290%2C51.0530&layer=mapnik&marker=51.0503%2C3.7254"
          loading="lazy"
        />
      ) : (
        <button
          className="button secondary"
          style={{ marginTop: 20 }}
          onClick={() => setOpen(true)}
        >
          Toon de kaart van OpenStreetMap
        </button>
      )}
      <p className="smallprint" style={{ marginTop: 15 }}>
        Bij het openen ontvangt OpenStreetMap onder meer je IP-adres. Kaartgegevens ©{' '}
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-bijdragers</a>.{' '}
        <a
          href="https://www.openstreetmap.org/?mlat=51.0503&mlon=3.7254#map=17/51.0503/3.7254"
          target="_blank"
          rel="noreferrer"
        >
          Open de kaart op een aparte pagina
        </a>
        .
      </p>
    </div>
  )
}
