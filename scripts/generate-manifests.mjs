import fs from 'node:fs';
import { stores, imageSlots } from '../src/content/product.js';
import { annotationBase } from '../src/content/annotations.js';

fs.mkdirSync('public/stores', { recursive: true });
const routes = ['/', '/stores', ...Object.keys(stores).map((slug) => `/stores/${slug}`)];
const manifest = {
  schemaVersion: '2.0',
  pageType: 'generic-wolkveld-product-template',
  language: 'nl-NL',
  routes,
  imageBriefs: imageSlots,
  contentPrompts: Object.entries(annotationBase).map(([id, annotation]) => ({ id, ...annotation })),
  scrapeInstructions: 'Ieder imageBrief correspondeert exact met data-visible-slot in de HTML. Ieder record staat ook als data-learn-record in de verborgen semantische leerlaag.',
};

for (const slug of Object.keys(stores)) {
  const directory = `public/stores/${slug}`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(`${directory}/template.json`, `${JSON.stringify(manifest, null, 2)}\n`);
}

const index = {
  schemaVersion: '2.0',
  template: 'generic-wolkveld-product-template',
  routes,
  canonicalManifest: '/stores/dieren/template.json',
  aliases: Object.keys(stores).map((slug) => `/stores/${slug}/template.json`),
};
fs.writeFileSync('public/stores/index.json', `${JSON.stringify(index, null, 2)}\n`);
console.log(`Eén generiek manifest gegenereerd voor ${routes.length} routes en ${imageSlots.length} zichtbare beeldslots.`);
