# D7 · Overdracht — werkversie, niet ingediend

## Who owns what

Casper beheert momenteel repository en hosting; inhoudelijke teamverantwoordelijkheden zijn voorstellen in D0.

Repository: https://github.com/CasperBekaert/marge-team9
Publieke URL: https://marge-team9.vercel.app
Beheer: /admin. Beheerdersgegevens worden apart en lokaal aan Casper bezorgd; nooit in deze repository.

### Lokaal werken

Node 22, minimaal 22.23.5; `npm ci`; eigen .env.local volgens .env.example; `npm run dev`. De guard gebruikt uitsluitend een lokale database voor ontwikkelcommando’s. Schemawijziging: `npm run migrate:create`, migratie beoordelen, `npm run migrate`, `npm run generate`, commit. Controle: `npm run lint`, `npm run typecheck`, `npm test`. CI bouwt de site, controleert schema en migraties, AI-note, inhoud en browsergedrag.

### Publiceren en herstellen

Code via branch en PR met AI-note; checks lezen, daarna merge naar main. Vercel bouwt met Node22, voert migraties uit en seedt de productie-inhoud eenmaal. Neon Free is gekoppeld; previewbranches isoleren previews van productie. Blob is beschikbaar voor CMS-media. Geheimen blijven in Vercel. Geen databases wissen om een deploy te repareren. Bij herstel een correctie-PR en nieuwe build; geen oude code terugzetten zonder compatibiliteit met het actuele schema te controleren.

## Left out, and in which order

Eerst echte teamreviews en gebruikerstest; daarna eventuele e-mail en reguliere authenticatie alleen als vervolgproject. Geen betalingen of officiële reserveringen.

## How you will know it works

Open /afspraak en maak een eigen voorbeeldgroep. Kies een vrij halfuur van de voorbeeldmentor, sla op, geef het gesprek een verzonnen naam met T09-7LPS, stel voor, wissel rol en bevestig. Of gebruik twee browsers: mentor maakt groep, deelt koppelcode, mentee sluit aan. Persoonlijke toegangscode is een geheim en hoort niet in de deelbare URL of het verslag. Gebruik de code op een ander toestel via Terugkomen.

### Technische release

De geautomatiseerde en online controles staan met bewijs in D6. Audio is lokaal gehost; hiervoor is geen ElevenLabs-sleutel nodig. Gebruik Node 22.23.5 of nieuwer binnen Node 22. De vijf middelzware auditmeldingen in de migratietoolketen zijn vermeld in D6.

### Voor de echte indiening door het team

Bevestig leden en rollen in D0. Laat elk teamlid een eigen echte code-PR maken en beoordelen. Voer de menselijke gebruikerstest uit met het script in D6 en noteer echte bevindingen. Controleer de UGent companion-hand-in: juiste URL, publiek repo, definitieve commit, documenten, CI op die commit, course-check, review van het toegewezen team. Team 9 beoordeelt volgens de geraadpleegde cursus Team 21; Team 6 beoordeelt Team 9. Verifieer die toewijzing opnieuw vóór indiening. Deze sessie dient niets in en voert geen collegiale review namens mensen uit.

## Check-in A — aanvullende controle op 24 november 2026

Nog niet ingediend en nog niet volledig klaar. De vier officiële checks zijn gelezen in [Check-in A](https://betterwebsitesv2.vercel.app/learn/building-better-websites-ugent/check-in-a-set-up-your-teams-repository-and-live-site).

- Live site en teamcode T09-7LPS: aanwezig. Codewijzigingen lopen via PR met AI-note.
- Starter: code en gitgeschiedenis stammen van course-2026-autumn; GitHub retourneert echter geen template_repository. Het verwachte 'generated from'-label ontbreekt. Er is nog geen cursuscheck uitgevoerd: behandel starterherkenning dus als open punt. Behoud deze repository en geschiedenis totdat duidelijk is of de docent/checker dit accepteert.
- Toegang: alleen CasperBekaert is collaborator; geen open uitnodigingen. Alle echte teamleden moeten hun GitHub koppelen en een repository-uitnodiging accepteren; docent jnmoons moet eveneens worden uitgenodigd. Toegang voor de course checks-app is nog niet bevestigd.
- D0: officiële rollen en werkparen zijn voorgesteld; alleen voornamen in de actuele versie. Ieder lid moet zelf akkoord geven met datum. De identiteit van het generiek getoonde zesde lid moet eerst met de docent worden opgehelderd.
- Cursusportaal: alle rollen nog ongekozen; repository/live URL nog niet gekoppeld; A, H1, H2 en Final tonen 'Nothing handed in yet' en geen deadline.
- Setup buiten de vier kaartchecks: iedereen moet lokaal kunnen starten. Automatische Neon-previewopruiming mist nog NEON_API_KEY. De project-ID kan als Actions-variable worden ingesteld; het aanmaken/toekennen van de sleutel is nog open. Blob-token is bij deze controle beperkt tot Production, conform de cursus.

Echte gebruikerstests, hertests en een code-PR per teamlid zijn voor de latere stappen, niet allemaal al voor A. Voor H2 hoort ook de heuristische evaluatie van Team 21 erbij; Team 6 evalueert ons.
