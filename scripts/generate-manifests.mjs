import fs from 'node:fs';
import { stores } from '../src/content/product.js';

fs.mkdirSync('public/stores', { recursive: true });
const index = {
  schemaVersion: '1.0',
  rule: 'Alle afbeeldingsslots zijn verplicht 1:1 en ontworpen voor 1600 × 1600 pixels.',
  stores: Object.values(stores).map(({ slug, nicheLabel, brand, product }) => ({
    slug, niche: nicheLabel, brand, product: product.name,
    page: `/stores/${slug}`,
    manifest: `/stores/${slug}/template.json`,
  })),
};

for (const store of Object.values(stores)) {
  const directory = `public/stores/${store.slug}`;
  fs.mkdirSync(directory, { recursive: true });
  const manifest = {
    schemaVersion: '1.0',
    pageType: 'reusable-product-detail-page',
    language: 'nl-NL',
    niche: store.nicheLabel,
    route: `/stores/${store.slug}`,
    theme: { brand: store.brand, fontClass: store.fontClass, colors: store.colors },
    imageRule: { ratio: '1:1', resolution: '1600 × 1600', appliesTo: 'productfoto’s, details, unboxing, lifestyle en review/UGC' },
    product: { name: store.product.name, subtitle: store.product.subtitle, description: store.product.description },
    imageBriefs: store.product.media,
    contentSections: ['announcement','brand','title','proof','price','bundles','cta','benefits','story','included','reviews','faq'],
    scrapeInstructions: 'Lees imageBriefs voor productieprompts. Dezelfde prompts staan semantisch in de HTML onder data-learn-record en data-shot-id.',
  };
  fs.writeFileSync(`${directory}/template.json`, `${JSON.stringify(manifest, null, 2)}\n`);
}

fs.writeFileSync('public/stores/index.json', `${JSON.stringify(index, null, 2)}\n`);
console.log(`JSON-manifests gegenereerd voor ${index.stores.length} stores.`);
