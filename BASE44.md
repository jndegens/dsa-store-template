# Base44-overdracht

Deze repository is de source of truth voor de DSA Store Template. Importeer of clone de repository in Base44. Bouw de pagina niet opnieuw vanaf een screenshot en gebruik de live URL alleen ter visuele controle.

## Leesvolgorde

1. `public/base44.json` — machineleesbare inhoudsopgave, vereiste invoer, configuratie en acceptatiecriteria.
2. `public/stores/{category}/template.json` — prompts en secties van de gekozen categorieroute.
3. `src/App.jsx` — bestaande componenten, interacties en machineleesbare attributen.
4. `src/styles.css` — layout, responsiviteit, thema's en DSA-interface.
5. `src/content/product.js` — categorieën en alle 18 verplichte 1:1-beeldslots.
6. `src/content/annotations.js` — uitleg, copy-prompts en beeldprompts.

## Importeren

Repository:

```text
https://github.com/jndegens/dsa-store-template
```

Clone URL:

```text
https://github.com/jndegens/dsa-store-template.git
```

Branch: `main`

Als Base44 geen Git-import aanbiedt, download dan `https://github.com/jndegens/dsa-store-template/archive/refs/heads/main.zip` en importeer de uitgepakte map.

## Opdracht voor Base44

1. Importeer de bestaande code zonder de layout te herinterpreteren.
2. Lees `requiredInputs` in `public/base44.json` en meld welke gegevens ontbreken.
3. Wacht op echte productdata voordat placeholders worden vervangen.
4. Behoud de componentstructuur, sectievolgorde, responsive CSS en alle interacties.
5. Behoud alle `data-ai-*`, `data-learn-record` en `data-visible-slot` attributen.
6. Houd ieder zichtbaar product-, detail-, stap-, review- en contextbeeld exact 1:1.
7. Gebruik de bestaande Lucide-iconen en meegeleverde Datatrans-betaallogo's.
8. Verzin geen prijzen, kortingen, voorraad, claims, reviews, experts, keurmerken, levertijden of garanties.
9. Voer `npm test` uit en los fouten op voordat het resultaat wordt opgeleverd.

## Starten en testen

```bash
npm install
npm run dev
npm test
```

De standaardconfiguratie is `cat=dieren&pal=dsa&font=friendly`. Alle ondersteunde waarden staan onder `configuration.queryParameters` in `public/base44.json`.

## Klaar wanneer

- De gekozen categorie, kleuren en lettertypes via de URL werken.
- Desktop en mobiel responsief blijven.
- Selectors, bundels, accordeons, modals en winkelmand klikbaar zijn.
- Alle zichtbare afbeeldingen 1:1 zijn.
- Alleen aangeleverde productdata is gebruikt.
- `npm test` zonder fouten slaagt.
