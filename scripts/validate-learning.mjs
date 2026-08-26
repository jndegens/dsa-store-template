import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { stores, imageSlots } from '../src/content/product.js';
import { annotationBase, getAnnotations } from '../src/content/annotations.js';

const failures = [];
const slugs = Object.keys(stores);
const routes = ['/', '/stores', ...slugs.map((slug) => `/stores/${slug}`)];
const annotations = getAnnotations();
const canonicalManifestPath = 'public/stores/dieren/template.json';
const forbiddenLegacyCopy = /wolknest|hondenmand|wolfvriend/i;
const appSource = fs.readFileSync('src/App.jsx', 'utf8');

if (slugs.length !== 8) failures.push(`Verwacht exact 8 categorieën, vond ${slugs.length}`);
if (imageSlots.length !== 18) failures.push(`Verwacht exact 18 beeldslots, vond ${imageSlots.length}`);
for (const token of ['aria-modal="true"','role="tablist"','aria-selected={tab===id}','onKeyDown={trapFocus}','aria-controls="builder-menu"']) {
  if (!appSource.includes(token)) failures.push(`Bouwmenu-toegankelijkheid ontbreekt in bron: ${token}`);
}

const decode = (value = '') => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`${escapeRegex(name)}="([^"]*)"`));
  return match ? decode(match[1]) : null;
};

const imageIds = new Set();
for (const slot of imageSlots) {
  if (imageIds.has(slot.id)) failures.push(`Dubbel beeldslot-ID: ${slot.id}`);
  imageIds.add(slot.id);
  for (const field of ['id', 'shotId', 'area', 'label', 'brief', 'ratio', 'mobileRatio', 'prompt']) {
    if (!slot[field] || String(slot[field]).trim() === '') failures.push(`${slot.id || 'onbekend'}: mist ${field}`);
  }
  if (!['1:1', '4:3'].includes(slot.ratio)) failures.push(`${slot.id}: onbekende desktopratio ${slot.ratio}`);
  if (!['1:1', '4:3'].includes(slot.mobileRatio)) failures.push(`${slot.id}: onbekende mobielratio ${slot.mobileRatio}`);
  if (!slot.prompt.includes(slot.ratio) || (slot.mobileRatio !== slot.ratio && !slot.prompt.includes(slot.mobileRatio))) failures.push(`${slot.id}: prompt vermeldt niet alle canonieke ratio's`);
}

const expectedContentPrompts = Object.entries(annotationBase).map(([id, record]) => ({ id, ...record }));
let canonicalBytes = null;
if (!fs.existsSync(canonicalManifestPath)) failures.push('Canoniek manifest ontbreekt');
else canonicalBytes = fs.readFileSync(canonicalManifestPath, 'utf8');

for (const slug of slugs) {
  const manifestPath = `public/stores/${slug}/template.json`;
  if (!fs.existsSync(manifestPath)) { failures.push(`${slug}: manifest ontbreekt`); continue; }
  const bytes = fs.readFileSync(manifestPath, 'utf8');
  if (canonicalBytes !== null && bytes !== canonicalBytes) failures.push(`${slug}: manifest wijkt byte-voor-byte af van canoniek manifest`);
  if (forbiddenLegacyCopy.test(bytes)) failures.push(`${slug}: manifest bevat oude productspecifieke data`);
  const manifest = JSON.parse(bytes);
  if (manifest.designSystem?.palettes?.length !== 10) failures.push(`${slug}: verwacht 10 kleurpaletten`);
  if (manifest.designSystem?.fonts?.length !== 8) failures.push(`${slug}: verwacht 8 lettertypes`);
  if (manifest.designSystem?.logoTemplates?.length !== 20) failures.push(`${slug}: verwacht 20 logo-templates`);
  if (JSON.stringify(manifest.routes) !== JSON.stringify(routes)) failures.push(`${slug}: routelijst wijkt af`);
  if (JSON.stringify(manifest.imageBriefs) !== JSON.stringify(imageSlots)) failures.push(`${slug}: beeldslots wijken af van canonieke bron`);
  if (JSON.stringify(manifest.contentPrompts) !== JSON.stringify(expectedContentPrompts)) failures.push(`${slug}: contentprompts wijken af van canonieke bron`);
}

async function verifyRenderedRoutes() {
  const port = 4179;
  const server = spawn('./node_modules/.bin/vinext', ['start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  let serverLog = '';
  server.stdout.on('data', (chunk) => { serverLog += chunk; });
  server.stderr.on('data', (chunk) => { serverLog += chunk; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try { const response = await fetch(`http://127.0.0.1:${port}/`); if (response.ok) { ready = true; break; } } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!ready) { failures.push(`SSR-testserver startte niet: ${serverLog.trim()}`); return; }

    for (const route of routes) {
      const response = await fetch(`http://127.0.0.1:${port}${route}`);
      if (!response.ok) { failures.push(`${route}: SSR-route antwoordt met ${response.status}`); continue; }
      const html = await response.text();
      if (forbiddenLegacyCopy.test(html)) failures.push(`${route}: HTML bevat oude productspecifieke promptdata`);

      const visibleTags = [...html.matchAll(/<[^>]*data-visible-slot="[^"]+"[^>]*>/g)].map((match) => match[0]);
      const visibleIds = new Set(visibleTags.map((tag) => attribute(tag, 'data-visible-slot')));
      for (const id of visibleIds) if (!imageIds.has(id)) failures.push(`${route}: onbekend zichtbaar beeldslot ${id}`);
      for (const slot of imageSlots) {
        const tags = visibleTags.filter((tag) => attribute(tag, 'data-visible-slot') === slot.id);
        if (!tags.length) { failures.push(`${route}: zichtbaar beeldslot ${slot.id} ontbreekt`); continue; }
        for (const tag of tags) {
          if (attribute(tag, 'data-slot-ratio') !== slot.ratio) failures.push(`${route}/${slot.id}: desktopratio wijkt af`);
          if (attribute(tag, 'data-slot-mobile-ratio') !== slot.mobileRatio) failures.push(`${route}/${slot.id}: mobielratio wijkt af`);
          if (attribute(tag, 'data-slot-brief') !== slot.brief) failures.push(`${route}/${slot.id}: beeldbrief wijkt af`);
        }
      }

      const targetIds = new Set([...html.matchAll(/data-learn-target="([^"]+)"/g)].map((match) => decode(match[1])));
      for (const id of Object.keys(annotations)) if (!targetIds.has(id)) failures.push(`${route}: klikbaar leerdoel ${id} ontbreekt`);
      for (const id of targetIds) if (!annotations[id]) failures.push(`${route}: leerdoel ${id} heeft geen prompt`);

      const renderedIds = [...html.matchAll(/data-learn-record="([^"]+)"/g)].map((match) => decode(match[1]));
      if (new Set(renderedIds).size !== Object.keys(annotations).length) failures.push(`${route}: verborgen leerrecords zijn niet exact compleet`);
      for (const [id, annotation] of Object.entries(annotations)) {
        const match = html.match(new RegExp(`<article[^>]*data-learn-record="${escapeRegex(id)}"[^>]*>([\\s\\S]*?)<\\/article>`));
        if (!match) { failures.push(`${route}: verborgen leerrecord ${id} ontbreekt`); continue; }
        const text = decode(match[1]);
        for (const [field, value] of [['label', annotation.label], ['guidance', annotation.guidance], ['prompt', annotation.prompt]]) {
          if (!text.includes(value)) failures.push(`${route}/${id}: verborgen ${field} wijkt af`);
        }
      }

      if (/<button[^>]*class="[^"]*learn-marker/.test(html)) failures.push(`${route}: leerlaag staat niet standaard uit`);
    }

    const configured = await fetch(`http://127.0.0.1:${port}/stores/beauty?cat=beauty&pal=rose&font=luxury&logo=logo-20&icons=solid&pay=ideal%2Cvisa&brand=TESTMERK&product=TESTPRODUCT&c1=%23b65778&c2=%232b1720&c3=%23fffafb&c4=%23f6e8ec`);
    const configuredHtml = await configured.text();
    for (const token of ['TESTMERK','TESTPRODUCT','logo-20','lucide-solid','"category":"beauty"','"paymentMethods":["ideal","visa"]']) {
      if (!configuredHtml.includes(token)) failures.push(`Deelbare URL mist SSR-configuratie: ${token}`);
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
console.log(`Template geldig: ${routes.length} routes, ${imageSlots.length} canonieke zichtbare beeldslots en ${Object.keys(annotations).length} scrape-bare leerprompts.`);
