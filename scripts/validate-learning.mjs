import fs from 'node:fs';
import { stores } from '../src/content/product.js';

const failures = [];
const app = fs.readFileSync('src/App.jsx', 'utf8');
const requiredShotFields = ['shotId','shotType','subject','composition','background','lighting','ratio','copySpace','mustInclude','avoid','prompt','alt','resolution'];

for (const [slug, store] of Object.entries(stores)) {
  if (store.slug !== slug) failures.push(`${slug}: slug komt niet overeen met configuratiesleutel`);
  if (store.product.media.length !== 6) failures.push(`${slug}: verwacht precies 6 beeldslots`);
  const ids = new Set();
  for (const media of store.product.media) {
    for (const field of requiredShotFields) {
      if (!media[field] || String(media[field]).trim() === '') failures.push(`${slug}/${media.id}: mist ${field}`);
    }
    if (media.ratio !== '1:1') failures.push(`${slug}/${media.id}: ratio moet exact 1:1 zijn`);
    if (media.resolution !== '1600 × 1600') failures.push(`${slug}/${media.id}: resolutie moet exact vierkant zijn`);
    if (!media.prompt.includes('1:1') || !media.prompt.includes('1600 × 1600')) failures.push(`${slug}/${media.id}: prompt benoemt vierkant formaat niet`);
    if (ids.has(media.shotId)) failures.push(`${slug}: dubbel shotId ${media.shotId}`);
    ids.add(media.shotId);
  }
  const manifestPath = `public/stores/${slug}/template.json`;
  if (!fs.existsSync(manifestPath)) failures.push(`${slug}: JSON-manifest ontbreekt`);
  else {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.imageBriefs?.length !== store.product.media.length) failures.push(`${slug}: JSON bevat niet alle beeldbriefs`);
    if (manifest.imageBriefs?.some((shot) => shot.ratio !== '1:1')) failures.push(`${slug}: JSON bevat een niet-vierkant beeldslot`);
  }
}

for (const id of ['announcement','brand','title','proof','price','bundles','cta','benefits','story','included','reviews','faq']) {
  if (!app.includes(`${id}:`)) failures.push(`Annotatie ${id} ontbreekt`);
}
if (!app.includes('MachineContent')) failures.push('Statische scrape-bare HTML ontbreekt');
if (!fs.existsSync('app/stores/page.jsx') || !fs.existsSync('app/stores/[slug]/page.jsx')) failures.push('Store-routes ontbreken');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Template geldig: ${Object.keys(stores).length} niches, ${Object.values(stores).reduce((n,s)=>n+s.product.media.length,0)} unieke 1:1-beeldbriefs en scrape-bare HTML + JSON.`);
