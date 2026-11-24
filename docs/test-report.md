# D6 · Testverslag en testscript

Status: werkversie, 24 november 2026. Technische controles zijn agentcontroles; er heeft nog geen menselijke gebruikerstest plaatsgevonden. Er zijn geen citaten, tijden of successcores verzonnen.

## What was tested, and how

Taak 1: filterformulier → serverquery → CMS-methodes → detail en omgekeerde faserelatie. Taak 2: browser → /api/mentor → Postgres → status bij beide rollen. Daarnaast typecontrole, lint, migraties, seed, broncodecontrole, mobiele opmaak en toegankelijkheid.

## What we saw

Tijdens implementatie gevonden en hersteld: JSX-fout in lokale planner, nullable transactie-ID, behoud verzoek-ID bij netwerkherhaling, aangepaste oude tests die nog fietsherstelinhoud verwachtten. De eerste CI-run had 426 geslaagde tests en drie browserfouten: één mobiele kalenderoverloop en twee te brede testselectors. De kalender krijgt begrensde kolommen en afbreekbare labels; selectors richten zich op de specifieke foutmelding. Een fixture verwacht losse collectie-imports; de configuratie volgt die afspraak. Seedtests ruimen hun testbeheerder na afloop op. De definitieve hertest wordt bij de release vastgelegd.

## What we changed, and the retest

Zie bovenstaande reparaties; definitieve tests worden hieronder vastgelegd.

## The release check

Nog in uitvoering. De websitepublicatie is geen opdrachtindiening.

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
