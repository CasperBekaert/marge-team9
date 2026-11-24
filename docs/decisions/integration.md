# D5b · Externe integratie

## The question

Hoe tonen we de gekozen voorbeeldlocatie zonder automatische kaarttracking?

## Options considered

alleen een adres (weinig externe afhankelijkheid, minder ruimtelijke context), OpenStreetMap-embed (geen API-sleutel, duidelijke bronvermelding) of Google Maps (grotere account- en privacyafhankelijkheid). Gekozen: OpenStreetMap met click-to-load. Pas na `Toon kaart` laadt het iframe. De tekstuele locatie en een externe route/link blijven beschikbaar als de kaart niet laadt.

## The decision

OpenStreetMap met click-to-load, een tekstlocatie en zichtbare attributie.

## Why

Geen API-sleutel of betaalde kaartdienst nodig; kaart pas na bewuste klik.

## Consequences

De browser verstuurt bij het laden het IP-adres en technische requestgegevens aan de kaartprovider, geen koppelcode of afspraaknaam. Geen geolocatie-permissie, trackingpixel of automatisch opgehaalde gebruikerslocatie. Behoud de zichtbare OpenStreetMap-attributie. De Krook is een voorbeeld, geen partner en geen gereserveerde ruimte.

## Facts read on

Bronnen, gelezen 24 november 2026: [OpenStreetMap export](https://www.openstreetmap.org/export), [Copyright en attributie](https://www.openstreetmap.org/copyright), [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

## Review when

Bij een echte lancering, meer verkeer of gewijzigde voorwaarden. Audio wordt lokaal gehost, zonder ElevenLabs-aanroep vanuit de site.
