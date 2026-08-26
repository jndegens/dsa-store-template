import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { stores } from '../src/content/product.js';
import { annotationBase, getAnnotations } from '../src/content/annotations.js';

const failures = [];
const requiredShotFields = ['shotId','shotType','subject','composition','background','lighting','ratio','copySpace','mustInclude','avoid','prompt','alt','resolution'];

for (const [slug, store] of Object.entries(stores)) {
  if (store.slug !== slug) failures.push(`${slug}: slug komt niet overeen met configuratiesleutel`);
  if (store.product.media.length !== 6) failures.push(`${slug}: verwacht precies 6 beeldslots`);
  const ids = new Set();
  for (const media of store.product.media) {
    for (const field of requiredShotFields) if (!media[field] || String(media[field]).trim() === '') failures.push(`${slug}/${media.id}: mist ${field}`);
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
    const contentPrompts = Object.fromEntries((manifest.contentPrompts || []).map((record) => [record.id, record]));
    for (const [id, annotation] of Object.entries(annotationBase)) {
      const record = contentPrompts[id];
      if (!record) failures.push(`${slug}: JSON mist contentprompt ${id}`);
      else for (const field of ['label','type','guidance','prompt','checklist']) if (JSON.stringify(record[field]) !== JSON.stringify(annotation[field])) failures.push(`${slug}/${id}: JSON-veld ${field} wijkt af`);
    }
  }
}

if (!fs.existsSync('app/stores/page.jsx') || !fs.existsSync('app/stores/[slug]/page.jsx')) failures.push('Store-routes ontbreken');

const decode = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

async function verifyRenderedRoutes() {
  const port = 4179;
  const server = spawn('./node_modules/.bin/vinext', ['start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  let serverLog = '';
  server.stdout.on('data', (chunk) => { serverLog += chunk; });
  server.stderr.on('data', (chunk) => { serverLog += chunk; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try { const response = await fetch(`http://127.0.0.1:${port}/stores`); if (response.ok) { ready = true; break; } } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!ready) { failures.push(`SSR-testserver startte niet: ${serverLog.trim()}`); return; }

    for (const [slug, store] of Object.entries(stores)) {
      const response = await fetch(`http://127.0.0.1:${port}/stores/${slug}`);
      if (!response.ok) { failures.push(`${slug}: SSR-route antwoordt met ${response.status}`); continue; }
      const html = await response.text();
      const annotations = getAnnotations(store);
      const renderedIds = [...html.matchAll(/data-learn-record="([^"]+)"/g)].map((match) => match[1]);
      if (renderedIds.length !== Object.keys(annotations).length) failures.push(`${slug}: SSR bevat ${renderedIds.length} in plaats van ${Object.keys(annotations).length} leerrecords`);
      for (const [id, annotation] of Object.entries(annotations)) {
        const safeId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = html.match(new RegExp(`<article[^>]*data-learn-record="${safeId}"[^>]*>([\\s\\S]*?)<\\/article>`));
        if (!match) { failures.push(`${slug}: SSR mist leerrecord ${id}`); continue; }
        const text = decode(match[1]);
        for (const [field, value] of [['label', annotation.label], ['guidance', annotation.guidance], ['prompt', annotation.prompt]]) if (!text.includes(value)) failures.push(`${slug}/${id}: SSR-${field} wijkt af van configuratie`);
      }
    }
  } finally {
    server.kill('SIGTERM');
  }
}

await verifyRenderedRoutes();

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Template geldig: ${Object.keys(stores).length} niches, ${Object.values(stores).reduce((n,s)=>n+s.product.media.length,0)} unieke 1:1-beeldbriefs en inhoudelijk gelijke scrape-bare HTML + JSON.`);
