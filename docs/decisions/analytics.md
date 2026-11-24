# D5a · Analytics

## The question

Vinden studenten de methodes en afspraakpagina, en welke apparaten gebruiken zij?

## Options considered

Geen analytics: eenvoudig, geen gebruikssignaal. Vercel: past bij hosting. Matomo: extra eigen beheer.

## The decision

Besluit op 24 november 2026: Vercel Web Analytics voor paginabezoeken, zonder betaalde custom events.

Vraag: vinden studenten de methodes en de afspraakpagina, en op welke apparaten bekijken ze die? Geen analytics geeft de meeste eenvoud maar geen gebruikssignaal. Vercel sluit aan bij de hosting en werkt zonder trackingcookies. Een zelfgehoste Matomo vraagt extra beheer buiten de scope.

`NEXT_PUBLIC_ANALYTICS=vercel` staat in .env.production. `SiteAnalytics` verwijdert queryparameters en fragments vóór verzending, zodat zoektermen niet meegaan. Tokens staan nooit in URL’s. Afspraken tellen we desgewenst in onze eigen CMS; geen namen, koppelcodes of persoonlijke toegangscodes naar analytics. Een bezoek aan /afspraak bewijst geen afgeronde transactie.

## Why

Paginabezoeken zijn voldoende voor de huidige leervraag en vereisen geen eigen analyticsserver.

## Consequences

Hobby heeft volgens de geraadpleegde documentatie 50.000 events per maand gedeeld over projecten, één maand bewaartermijn en geen custom events. We upgraden niet automatisch. Bij het bereiken van de limiet of wijziging van het doel heroverwegen we de keuze. De privacytekst vermeldt de externe verwerking.

## Facts read on

Bronnen, gelezen 24 november 2026: [Vercel Analytics limits](https://vercel.com/docs/analytics/limits-and-pricing), [Privacy](https://vercel.com/docs/analytics/privacy-policy), [beforeSend](https://vercel.com/docs/analytics/redacting-sensitive-data).

## Review when

Bij gewijzigde plannen, bereiken van limieten of behoefte aan conversiemeting. Dashboardcontrole wordt in D6 vastgelegd; nog geen echte gebruikersconclusies.
