# Base44-overdracht

Deze repository is de source of truth voor het ontwerp en de inhoudsregels van de DSA Store Template. De repository bevat óók de DSA-studio. Importeer die studio nooit als onderdeel van de winkel. Bouw uitsluitend de klantgerichte merchant-storefront volgens `STOREFRONT.md` en gebruik de live URL alleen ter visuele controle.

## Leesvolgorde

1. `STOREFRONT.md` — harde grens tussen de DSA-studio en de uiteindelijke winkel.
2. `public/base44.json` — machineleesbare inhoudsopgave, vereiste invoer, configuratie en acceptatiecriteria.
3. `public/stores/{category}/template.json` — prompts en secties van de gekozen categorieroute.
4. `src/App.jsx` — visuele referentie voor storefrontcomponenten en interacties; kopieer niet de complete app.
5. `src/styles.css` — layout, responsiviteit en thema's; DSA-studiostijlen zijn uitgesloten.
6. `src/content/product.js` — categorieën en alle 18 verplichte 1:1-beeldslots.
7. `src/content/annotations.js` — invoer voor copy en beelden; niet tonen in de winkel.

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

1. Lees eerst `STOREFRONT.md` en bouw alleen de merchant-storefront; clone nooit de volledige DSA-app naar de uitvoer.
2. Lees `requiredInputs` in `public/base44.json` en meld welke gegevens ontbreken.
3. Wacht op echte productdata voordat placeholders worden vervangen.
4. Behoud de storefront-sectievolgorde, responsive CSS en klantgerichte interacties.
5. Gebruik `data-ai-*`, `data-learn-record` en `data-visible-slot` alleen als bouwmetadata; verwijder ze uit de productie-output.
6. Houd ieder zichtbaar product-, detail-, stap-, review- en contextbeeld exact 1:1. Bouw bovenaan én onderaan één groot beeld met pijlen en exact vijf klikbare miniaturen; laat onder het onderste beeld nooit een leeg vlak staan.
7. Installeer en gebruik `lucide-react` voor alle interface-iconen. Gebruik geen handgeschreven inline-SVG, emoji, icon-font of CSS-vorm als icoon.
8. Render de zeven officiële Datatrans-betaallogo's als `<img>` vanuit `public/payment-logos/`. Gebruik bij externe import de fallback `https://raw.githubusercontent.com/jndegens/dsa-store-template/main/public/payment-logos/{bestandsnaam}`; teken logo's nooit zelf na.
9. Houd bodytekst minimaal 16px en secundaire tekst, labels, knoppen, bundelregels en bijschriften minimaal 14px.
10. Verzin geen prijzen, kortingen, voorraad, claims, reviews, experts, keurmerken, levertijden of garanties.
11. Voer `npm test` uit en los fouten op voordat het resultaat wordt opgeleverd.
12. Neem nooit de DSA-toolbar, DSA-branding, leerlaag, promptmodals, machine-content, GitHub-links of demowinkelmand over.

## Een bestaande volledige kopie herstellen

Heeft Base44 de DSA-studio al zichtbaar overgenomen? Werk dan in hetzelfde project verder: behoud alle ingevulde merchant-data en afbeeldingen, maar verwijder de studio/editorlaag en alle DSA-, Base44-, GitHub-, AI-, prompt-, template- en leerlaagtekst volgens `STOREFRONT.md`. Bouw de header en footer om naar het aangeleverde merk en test daarna opnieuw alle klantgerichte interacties.

## Starten en testen

```bash
npm install
npm run dev
npm test
```

De standaardconfiguratie is `cat=dieren&pal=dsa&font=friendly`. Alle ondersteunde waarden staan onder `configuration.queryParameters` in `public/base44.json`.

## Klaar wanneer

- De gekozen categorie, kleuren en lettertypes zijn als initiële winkelstijl toegepast; de instelknoppen staan niet in de winkel.
- Desktop en mobiel responsief blijven.
- Galerij, bundels, accordeons, FAQ en winkelmand klikbaar zijn.
- Zowel de bovenste als de onderste galerij een groot 1:1-beeld, pijlen en vijf klikbare miniaturen bevat.
- Alle betaalmethodes met de officiële Datatrans-afbeeldingen laden.
- Alle interface-iconen uit `lucide-react` komen; er staan geen handgeschreven SVG's of emoji-iconen in.
- Bodytekst minimaal 16px en alle secundaire klantgerichte tekst minimaal 14px is.
- Alle zichtbare afbeeldingen 1:1 zijn.
- Alleen aangeleverde productdata is gebruikt.
- Geen DSA-, Base44-, GitHub-, AI-, prompt-, template- of leerlaagtekst zichtbaar is.
- `npm test` zonder fouten slaagt.
