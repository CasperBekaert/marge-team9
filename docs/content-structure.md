# D3 · Inhoud en structuur

## Content inventory

| Type | Route | Inhoud en vervolgstap |
|---|---|---|
| Start | / | Weekvoorbeeld, drie ingangen, mentoruitnodiging, zesdelige quiz |
| Plannen | /planning | Vier lagen, weekplanner, deadlines, blokplanning, leerstoflijst |
| Lessen | /lessen | Mappen, voorbereiding, notitiestijl |
| Examens | /examens | Markeren, mindmap, actieve herinnering, energie |
| Methodenlijst | /methodes | Serverfilter via GET: fase, soort, zoekterm |
| Methodedetail | /methodes/[slug] | CMS-uitleg, gekoppelde fases, werkblad |
| Fasedetail | /fases/[slug] | CMS-fase en teruggekoppelde methodes |
| Mentorgesprek | /afspraak | Deelnemen, beschikbaarheid, voorstel, bevestiging |
| Project | /project | Doel, bron, context en beperkingen |

Privacy en 404 zijn ondersteunende pagina’s en tellen niet mee voor het minimum. Header en footer maken de hoofdingangen bereikbaar. De methode-faserelatie is in beide richtingen aanklikbaar.

## Content model

studyMethods (13 startrecords) heeft een top-level relationship `phases`, hasMany, naar studyPhases (3 startrecords). studyPhases heeft de omgekeerde join `methods`. Daarnaast mentorGroups, participants en appointments: vijf eigen onderwerpcollecties naast de infrastructuur van de starter.

Een participant hoort bij één groep en heeft een rol, een gehashte persoonlijke toegangscode en vrije ISO-halfuren. Een appointment hoort bij een groep, koppelt twee participants met tegengestelde rollen en bewaart beginuur, plaats, naam, status en uniek verzoek-ID. Alleen de ontvanger bevestigt. De API serialiseert wijzigingen per groep met een Postgres-rijslot. De eigen groepen en afspraken zijn niet publiek leesbaar via de CMS-API.

### Contentbeheer

In /admin passen editors methodes en fases aan. De seed voegt startinhoud eenmaal toe en bewaart latere aanpassingen. Uitlegpagina’s en interfacecopy staan bewust in code; ze wijzigen via een PR. Lokale weekblokken, deadlines en hoofdstukken worden nooit naar de server verzonden.

## Sitemap

Start → plannen, lessen, examens, methodes, afspraak, project. Methodes → methodedetail → fasedetail → methodedetail. Footer → project, privacy en broncode.

## Navigation labels

Plannen, Lessen, Examens, Studiemethodes, Plan een gesprek. Mobiel hetzelfde menu onder Menu.

## Each user task, step by step

1. Open methodes, kies fase en soort, verstuur filters, open een resultaat, bekijk de bijbehorende fase of oefening.
2. Mentor maakt groep, mentee sluit aan, ieder bewaart vrije halfuren, één stelt een gemeenschappelijk moment voor, de ander bevestigt. Beide rollen zien dezelfde databaseafspraak.
