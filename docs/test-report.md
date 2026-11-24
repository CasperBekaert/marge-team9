# D6 · Testverslag en testscript

Status: werkversie, 24 november 2026. Technische controles zijn agentcontroles; er heeft nog geen menselijke gebruikerstest plaatsgevonden. Er zijn geen citaten, tijden of successcores verzonnen.

## What was tested, and how

Taak 1: filterformulier → serverquery → CMS-methodes → detail en omgekeerde faserelatie. Taak 2: browser → /api/mentor → Postgres → status bij beide rollen. Daarnaast typecontrole, lint, migraties, seed, broncodecontrole, mobiele opmaak en toegankelijkheid.

## What we saw

Tijdens implementatie gevonden en hersteld: JSX-fout in lokale planner, nullable transactie-ID, behoud verzoek-ID bij netwerkherhaling, aangepaste oude tests die nog fietsherstelinhoud verwachtten. De eerste CI-run had 426 geslaagde tests en drie browserfouten: één mobiele kalenderoverloop en twee te brede testselectors. De kalender krijgt begrensde kolommen en afbreekbare labels; selectors richten zich op de specifieke foutmelding. Een fixture verwacht losse collectie-imports; de configuratie volgt die afspraak. Seedtests ruimen hun testbeheerder na afloop op. Na de Payload-update bleek de oude testopruiming een al vrijgegeven databaseverbinding nogmaals vrij te geven. Die workaround is verwijderd; de starter-fixture gebruikt expliciet zijn eigen transactieconfiguratie. Geen test is uitgezet om deze fouten te verbergen.

## What we changed, and the retest

Hertest op commit `e669b3582d4a1999abca3fcac1da74560c3a3c53`: alle 54 testbestanden geslaagd, 446 tests geslaagd en 7 niet-toepasselijke warm-up/example-tests overgeslagen. Alle 48 browserchecks op 390px en 1100px geslaagd, inclusief axe zonder ernstige of kritieke meldingen, toetsenbord, filters zonder JavaScript, tweerollenflow en lokale planner. Migraties, gegenereerde types, AI-note en voorbeeldinhoudcontrole zijn eveneens groen. [CI-bewijs](https://github.com/CasperBekaert/marge-team9/actions/runs/45396809191).

## The release check

Publieke URL: https://marge-team9.vercel.app. Technische releasecontrole op 24 november 2026:

- De 3 fases en 13 methodes staan in Postgres; de course-check herkent de echte M:N-relatie.
- Op productie een eigen voorbeeldgroep gemaakt, beschikbaarheid bewaard, voorstel gedaan en als andere rol bevestigd. Na herladen blijft de bevestiging staan.
- Het testrecord met `T09-7LPS` wordt door `/api/course-check?include=team&code=T09-7LPS` gevonden: `appointments`, status `ok`, record-id `1`. Dit is uitsluitend een technische test.
- Beheerlogin werkt. Anonieme REST-toegang tot participants, appointments en mentorGroups geeft 403.
- OpenStreetMap laadt na klik en toont de kaart en attributie.
- De Nederlandse ElevenLabs-intro speelt, pauzeert en duurt 54,6 seconden. Focusruis start en stopt op verzoek. Geen autoplay.
- Op de bijgewerkte preview is de homepage op 390px exact 390px breed; de kalenderoverloop is hersteld.
- Bij de aanvullende controle op 24 november bleek Web Analytics nog niet actief. Het gratis Hobby-plan is daarna in het Vercel-dashboard ingeschakeld en de actieve lege teller is gecontroleerd. Een getelde taakpagina moet nog aantoonbaar worden gecontroleerd; geen gebruikersconclusies.

De eindpublicatie volgt via de gecontroleerde PR naar main; de laatste main-run en Vercel-deployment tonen de exacte releasecommit. Deze websitepublicatie is geen opdrachtindiening.

## Not tested yet

### Menselijke test — nog uit te voeren

Vraag een eerstejaarsstudent die niet meebouwde. Gebruik alleen verzonnen gegevens. Leg uit dat de website getest wordt, niet de persoon. Vraag toestemming om korte anonieme observaties te noteren; geen naam of opname nodig.

1. Je hebt moeite met plannen. Zoek via Studiemethodes een zelf-doenmethode voor planning, open de uitleg en begin het werkblad. Vraag de persoon hardop te denken. Niet voordoen.
2. Je wil een mentorgesprek plannen. Open een eigen voorbeeldgroep, vind een passend halfuur, sla het op, stel een gesprek voor en bekijk als mentor hoe bevestigen werkt. Controleer daarna de bevestiging bij de mentee.
3. Herhaal een belangrijke stap op een telefoon. Vraag hoe duidelijk het verschil is tussen lokaal bewaard werk en gedeelde afspraken, en tussen voorgesteld en bevestigd.

Noteer per taak: datum, toestel, zonder hulp gelukt/gelukt met hulp/niet gelukt, concrete aarzeling of fout, ernst, voorstel, verantwoordelijke, hertest. Meet tijd alleen als je die echt bijhoudt. Beschrijf na afloop minimaal één echte bevinding en de verandering die eruit volgt. Laat de deelnemer de luisterfunctie alleen testen als die dat wil.

### Nog geen menselijke resultaten

Deelnemer: nog niet geworven. Observaties: nog niet verzameld. Teamreviews en individuele codebijdragen: niet aangetoond door deze bouwsessie. De voorgestelde teamrollen staan in D0 en wachten op bevestiging.

### Afhankelijkheden

Next is bijgewerkt naar 16.4.6, Payload naar 3.94.1, sharp naar 0.35.5 en de Node-minimumversie naar 22.23.5. Happy DOM is overal vastgezet op 21.0.4. De audit na deze updates telt geen hoge of kritieke meldingen. Vijf middelzware meldingen blijven in de esbuild-keten van de migratietool drizzle-kit; npm geeft geen beschikbare upstreamreparatie. De betreffende ontwikkelserver wordt niet openbaar gestart. Houd deze afhankelijkheid bij toekomstige updates in het oog.

## Aanvullende blokplannercontrole

Het oorspronkelijke Claude-prototype is in Chrome vergeleken: vakken en examendata invullen, daarna kalenderdagen inkleuren. De lijst is vervangen door die werkwijze, met drie zichtbare maanden, studeren/herhalen/rust/wissen, vaste examendagen, vakken wijzigen, één stap ongedaan maken, lijstweergave en CSV. Oude lokale lijstgegevens migreren met behoud van alle records en de oude opslagsleutel.

Lokale controles: lint, types en drie gerichte tests geslaagd (schrikkeljaren/jaargrens; oude planning inclusief meerdere examens; kleuren, wissen en examendagbescherming). In Chrome vak ingevoerd, studie/herhaling/rust gekleurd, toetsenbordactivatie, undo en herladen gecontroleerd. De volledige CI controleert ook de kalenderflow op 390 en 1100 px. Dit zijn technische agentcontroles, geen menselijke gebruikerstest.
