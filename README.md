# DSA Store Template

Open productpagina-template van Dropship Academy. De repository bevat de volledige React-broncode, responsive styling, acht categorieroutes, elf kleurpaletten, acht lettertypes, 18 vaste 1:1-beeldslots en een machineleesbare promptlaag.

Live template: [agents.dropshipacademy.nl/store-template](https://agents.dropshipacademy.nl/store-template)

## Base44 gebruiken

Geef Base44 de openbare repositorylink:

```text
https://github.com/jndegens/dsa-store-template
```

Laat Base44 eerst [`BASE44.md`](./BASE44.md) en daarna [`public/base44.json`](./public/base44.json) lezen. Die bestanden verwijzen naar alle broncode, routes, invoervelden, prompts, beeldregels en acceptatiecriteria. Base44 hoort de bestaande code te importeren en in te vullen, niet de live pagina vanaf een screenshot te reconstrueren.

## Lokaal starten

```bash
npm install
npm run dev
```

## Controleren

```bash
npm test
npm run build
```

## Belangrijkste bestanden

- `src/App.jsx` — zichtbare pagina en alle interacties
- `src/styles.css` — responsive layout, thema's en DSA-interface
- `src/content/product.js` — categorieroutes en 18 beeldslots
- `src/content/annotations.js` — prompts en didactische uitleg
- `public/base44.json` — machineleesbare overdracht voor Base44
- `public/stores/{category}/template.json` — route-manifest voor iedere categorie
- `ASSET_PROVENANCE.md` — herkomst en rechten van assets

## Configuratie

De template gebruikt URL-parameters voor categorie, kleur en lettertype, bijvoorbeeld:

```text
/stores/beauty?cat=beauty&pal=rose&font=luxury
```

Gebruik alleen echte, verifieerbare productdata. Verzin geen claims, prijzen, voorraad, reviews, experts, keurmerken, levertijden of garanties. Alle zichtbare afbeeldingen blijven exact 1:1.
