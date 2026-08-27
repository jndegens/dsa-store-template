# Storefront-exportcontract

Deze repository bevat twee verschillende lagen:

1. de DSA-studio waarmee een student een categorie, kleur en lettertype kiest en prompts bekijkt;
2. de klantgerichte productpagina die uiteindelijk voor een merk wordt gebouwd.

Base44 mag de repository daarom **niet als volledige pagina klonen**. Gebruik de broncode, stijlen, manifests en prompts als bouwreferentie, maar lever uitsluitend een schone merchant-storefront op.

## Wel opnemen

- actiebalk en drie USP's;
- winkelheader met de aangeleverde merknaam of het aangeleverde logo;
- productgalerij, productinformatie, prijs, voordelen en bundelkeuze;
- voorraadstatus, winkelmandknop en echte Datatrans-betaallogo's;
- verzend- en garantiekaarten;
- productaccordeons;
- voordelen-, stappen-, review-, expert-, garantie- en FAQ-secties;
- laatste koopsectie en mobiele koopbalk;
- een gewone winkel-footer voor het aangeleverde merk;
- alle klantgerichte interacties: galerij, bundels, accordeons, FAQ, winkelmand en mobiele koopbalk.

## Nooit opnemen of tonen

- `.template-toolbar` en de categorie-, kleuren- en lettertypekiezer;
- `.studio-modal`, `.studio-backdrop`, `.prompt-drawer` en prompt-uitleg;
- `.learn-marker`, `.placeholder__learn` en `.placeholder__prompt`;
- `.machine-content` en `#dsa-ai-blueprint`;
- DSA-logo's, DSA STORE TEMPLATE, Dropship Academy, DSA-copyright of DSA-footertekst;
- Base44-, GitHub-, AI-, prompt-, template-, leerlaag- of scrape-links en uitleg;
- `DEMO-WINKELMAND`, `onderwijstemplate` en vergelijkbare demotekst;
- URL-controls voor `cat`, `pal` en `font` in de uiteindelijke winkel;
- zichtbare placeholders wanneer echte aangeleverde productdata beschikbaar is.

## Metadataregel

`data-ai-*`, `data-learn-*`, promptrecords en machine-data zijn uitsluitend invoer voor de bouwstap. Lees en gebruik ze, maar kopieer ze niet naar de zichtbare interface en neem ze niet op in de productie-DOM. `data-visible-slot` mag tijdens de bouw worden gebruikt om beelden te koppelen en mag daarna eveneens worden verwijderd.

## Branding

- Gebruik de aangeleverde `brand_name` en eventueel `brand_logo` in header, winkelmand en footer.
- Gebruik het gekozen categorie-, kleuren- en lettertypeprofiel als initiële styling.
- Laat nergens zien dat de pagina met DSA, Base44, GitHub, AI of een template is gemaakt.

## Acceptatie

De export is pas klaar als:

- de pagina visueel overeenkomt met het klantgerichte deel van de DSA-referentie;
- alle bundels afzonderlijk selecteerbaar zijn en prijs/inhoud leesbaar blijven;
- officiële betaallogo's als afbeeldingen laden;
- accordeons met één klik openen en sluiten;
- galerij, winkelmand en mobiele CTA werken;
- alle productbeelden exact 1:1 zijn;
- zoeken in de uiteindelijke zichtbare tekst geen `DSA`, `Dropship Academy`, `Base44`, `GitHub`, `AI-prompt`, `template`, `leerlaag`, `scrape` of `DEMO-WINKELMAND` oplevert;
- geen feiten, prijzen, voorraad, claims, reviews, experts, keurmerken, levertijden of garanties zijn verzonnen.

## Bestaande foutieve Base44-import herstellen

Als een eerder gegenereerd project de volledige DSA-app bevat, herstel dan **het bestaande project** in plaats van opnieuw alle broncode te kopiëren:

1. behoud de reeds ingevulde merchant-productdata, productbeelden, prijzen en merkgegevens;
2. verwijder alle elementen en teksten uit **Nooit opnemen of tonen**;
3. vervang de DSA-header en DSA-footer door een gewone merchant-header en merchant-footer;
4. behoud alleen de klantgerichte secties uit **Wel opnemen**;
5. herstel daarna galerij, bundelkeuze, betaallogo's, accordeons, FAQ, winkelmand en mobiele CTA;
6. voer de volledige acceptatiecontrole hierboven opnieuw uit.
