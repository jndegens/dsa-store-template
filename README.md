# MORGENMAAK productpagina-template

Een complete onderwijsdemo van één conversiegerichte productpagina. De winkelmodus voelt als een echte webshop; de leerlaag legt per element uit waarom het bestaat en geeft een copy-pastebare AI-prompt.

## Aanpassen

1. Open `src/content/product.js`.
2. Vervang merk, teksten, prijzen, media, bundels, voordelen, reviews en FAQ's.
3. Zet eigen afbeeldingen in `public/` en pas alleen de `src`-waarden in `product.js` aan.
4. Pas kleuren aan in `store.colors` — de pagina zet ze automatisch om naar CSS-variabelen.
5. Bewerk didactische uitleg en prompts in `public/learning.json`.

## Starten

```bash
npm install
npm run dev
```

Open `?learn=1` om direct met de leerlaag te starten. Een specifieke annotatie kan direct worden geopend met bijvoorbeeld `?learn=1&annotation=product-title`.

## Controleren

```bash
npm test
npm run build
```

`npm test` controleert verplichte velden, unieke annotatie-ID's en de koppeling met ieder `data-learn-id` in de pagina.

## Rechten en herkomst

De meegeleverde beelden, vectoren, merknaam en voorbeeldteksten zijn speciaal voor deze template gemaakt. De controleerbare verklaring staat publiek op `/ASSET_PROVENANCE.md`.
