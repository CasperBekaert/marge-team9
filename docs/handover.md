# D7 · Overdracht — werkversie, niet ingediend

## Who owns what

Casper beheert momenteel repository en hosting; inhoudelijke teamverantwoordelijkheden zijn voorstellen in D0.

Repository: https://github.com/CasperBekaert/marge-team9
Beoogde publieke URL: https://marge-team9.vercel.app
Beheer: /admin. Beheerdersgegevens worden apart en lokaal aan Casper bezorgd; nooit in deze repository.

### Lokaal werken

Node 22, minimaal 22.23.5; `npm ci`; eigen .env.local volgens .env.example; `npm run dev`. De guard gebruikt uitsluitend een lokale database voor ontwikkelcommando’s. Schemawijziging: `npm run migrate:create`, migratie beoordelen, `npm run migrate`, `npm run generate`, commit. Controle: `npm run lint`, `npm run typecheck`, `npm test`. CI bouwt de site, controleert schema en migraties, AI-note, inhoud en browsergedrag.

### Publiceren en herstellen

Code via branch en PR met AI-note; checks lezen, daarna merge naar main. Vercel bouwt met Node22, voert migraties uit en seedt de productie-inhoud eenmaal. Neon Free is gekoppeld; previewbranches isoleren previews van productie. Blob is beschikbaar voor CMS-media. Geheimen blijven in Vercel. Geen databases wissen om een deploy te repareren. Bij herstel een correctie-PR en nieuwe build; geen oude code terugzetten zonder compatibiliteit met het actuele schema te controleren.

## Left out, and in which order

Eerst echte teamreviews en gebruikerstest; daarna eventuele e-mail en reguliere authenticatie alleen als vervolgproject. Geen betalingen of officiële reserveringen.

## How you will know it works

Open /afspraak en maak een eigen voorbeeldgroep. Kies een vrij halfuur van de voorbeeldmentor, sla op, geef het gesprek een verzonnen naam met T09-7LPS, stel voor, wissel rol en bevestig. Of gebruik twee browsers: mentor maakt groep, deelt koppelcode, mentee sluit aan. Persoonlijke toegangscode is een geheim en hoort niet in de deelbare URL of het verslag. Gebruik de code op een ander toestel via Terugkomen.

### Voor de echte indiening door het team

Bevestig leden en rollen in D0. Laat elk teamlid een eigen echte code-PR maken en beoordelen. Voer de menselijke gebruikerstest uit met het script in D6 en noteer echte bevindingen. Controleer de UGent companion-hand-in: juiste URL, publiek repo, definitieve commit, documenten, CI op die commit, course-check, review van het toegewezen team. Team 9 beoordeelt volgens de geraadpleegde cursus Team 21; Team 6 beoordeelt Team 9. Verifieer die toewijzing opnieuw vóór indiening. Deze sessie dient niets in en voert geen collegiale review namens mensen uit.
