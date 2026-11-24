# Marge · Team 9

Een werkboek voor eerstejaarsstudenten: plannen, lessen bijhouden, studiemethodes vinden en samen een mentorgesprek plannen. Gebaseerd op Ziels inhoudelijke Claude-uitwerking, opnieuw gebouwd met de verplichte Next.js + Payload course starter (`course-2026-autumn`).

**Werkversie — niet ingediend.** Teamrollen zijn voorstellen; echte team-PR’s en de menselijke gebruikerstest volgen nog.

- Website: https://marge-team9.vercel.app
- Code: https://github.com/CasperBekaert/marge-team9
- Documenten: [D0](docs/team-agreement.md), [D1](docs/brief.md), [D2](docs/requirements.md), [D3](docs/content-structure.md), [D4](docs/design-rationale.md), [D5 analytics](docs/decisions/analytics.md), [D5 integratie](docs/decisions/integration.md), [D6](docs/test-report.md), [D7](docs/handover.md).

Node22. `npm ci`, eigen `.env.local`, `npm run dev`. De guard beschermt de productiedatabase. `npm run lint`, `npm run typecheck`, `npm test`; GitHub CI controleert ook migraties en browsergedrag. Database: Neon Postgres. CMS: `/admin`. Gebruik alleen verzonnen gegevens.

Studieplanners worden lokaal bewaard. Mentorgroepen en afspraken worden in de database opgeslagen. Persoonlijke toegangscodes zijn geheim; deel alleen de koppelcode. Publieke pagina’s vragen geen account. Luisteraudio speelt uitsluitend op verzoek.

## Starter-erfgoed

Node 22 (the LTS this starter is tested on). De oorspronkelijke oefenmarker blijft in de bron bewaard: `// W4: put your own name in this tagline`. Die warming-up maakt geen deel uit van deze eindtaak.
