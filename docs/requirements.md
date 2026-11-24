# D2 · Toetsbare eisen

Stand: 24 november 2026, technische controles geslaagd; menselijke onderdelen blijven open. Eindresultaten en bewijs staan in D6. Niet ingediend.

| Id | Requirement | Serves | Check | Result |
|---|---|---|---|---|
| R1 | Passende methode vinden | Studie- of mentortaak | /methodes filtert via GET op fase, soort en zoekterm; URL behoudt keuze, ook zonder JavaScript | Gebouwd; server- en browsertest |
| R2 | Verbanden begrijpen | Studie- of mentortaak | Methodedetail linkt naar fases; fase linkt terug naar methodes | Gebouwd; M:N in CMS |
| R3 | Samen plannen | Studie- of mentortaak | Twee rollen bewaren overlappende halfuren; voorstel zichtbaar bij beide; uitsluitend andere rol bevestigt | Gebouwd; ketentest |
| R4 | Betrouwbare transactie | Studie- of mentortaak | Onbeschikbaar/verleden moment geweigerd; herhaald verzoek-ID maakt geen duplicaat; eigen groepsgrenzen afgedwongen | API-controles en Postgres-slot |
| R5 | Later terugkomen | Studie- of mentortaak | Persoonlijke code op ander toestel herstelt dezelfde afspraken | Databasepersistentie; herstelpad |
| R6 | Zelf overzicht maken | Studie- of mentortaak | Weekblok toevoegen/wijzigen, overlap weigeren, deadline afvinken, hoofdstuk bewaren; CSV/print | Lokale opslag en bediening |
| R7 | Toegankelijk lezen | Studie- of mentortaak | 9 inhoudelijke templates bereikbaar, 390px, toetsenbord, labels, focus, leescontrast | Browsercontrole |
| R8 | Beheerbare inhoud | Studie- of mentortaak | 5 eigen collecties, methodes en fases wijzigbaar in /admin; seed overschrijft geen edits | Migratie- en seedtests |
| R9 | Externe integratie | Studie- of mentortaak | Kaart pas na klik, correcte locatie en attributie, tekstfallback | OpenStreetMap |
| R10 | Bescheiden analytics | Studie- of mentortaak | Alleen paginabezoeken, query en hash verwijderd, privacytekst | Vercel-instelling en component |
| R11 | Geluid op eigen initiatief | Studie- of mentortaak | Luisteruitleg start niet automatisch; tekst blijft leesbaar; geluid uitschakelbaar | Toegevoegd aan scope op verzoek |
| R12 | Publicatie | Studie- of mentortaak | Publieke GitHub-code, productie op Vercel, footerlink, course-check met testrecord | Releasecontrole |
| R13 | Menselijk teamwerk | Studie- of mentortaak | Elk lid gemergede code-PR, bevestigde teamafspraken | Nog door team uit te voeren |
| R14 | Menselijke gebruikerstest | Studie- of mentortaak | Een echte proefpersoon voert twee taken uit; observaties en aanpassingen vastgelegd | Script klaar; test nog uit te voeren |

R13 en R14 zijn geen automatisch behaalde eisen. Deze werkversie mag het team eerst aanpassen. Publiceren van een werkende website is geen indiening bij de cursus.
