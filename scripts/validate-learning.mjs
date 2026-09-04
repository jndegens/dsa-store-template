import fs from 'node:fs';
import http from 'node:http';
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
const storefrontContractPath = 'STOREFRONT.md';

if (slugs.length !== 8) failures.push(`Verwacht exact 8 categorieën, vond ${slugs.length}`);
if (imageSlots.length !== 18) failures.push(`Verwacht exact 18 beeldslots, vond ${imageSlots.length}`);
for (const token of ['className="template-toolbar"','icon={category.icon}','icon="palette"','icon="font"','className="current-palette"','className="current-font"','DSA STORE TEMPLATE','aria-controls={`selector-${id}`}','aria-expanded={open}','Kopieer Base44-opdracht','repositoryUrl','base44DataUrl','storefrontContractUrl','merchant-storefront-only','STOREFRONT.md','datatrans-payment-logos','BASE44-BOUWOPDRACHT','BESTAAND BASE44-PROJECT HERSTELLEN','slots: imageSlots.map','ref={cartRef}','ref={studioRef}','copyStyleV2','finalGalleryIndex','className="final-gallery__thumbs"','data-payment-asset','data-payment-raw-url','lucide-react','query.brand','data-interface-brand']) {
  if (!appSource.includes(token)) failures.push(`Compacte templatebediening ontbreekt in bron: ${token}`);
}
if (!fs.existsSync(storefrontContractPath)) failures.push('Storefront-exportcontract ontbreekt');
else {
  const storefrontContract = fs.readFileSync(storefrontContractPath, 'utf8');
  for (const token of ['merchant-storefront', '.template-toolbar', '.machine-content', 'DSA-logo', 'Bestaande foutieve Base44-import herstellen', 'vijf klikbare miniaturen', 'lucide-react', 'raw.githubusercontent.com', '16px']) {
    if (!storefrontContract.includes(token)) failures.push(`Storefront-exportcontract mist harde grens: ${token}`);
  }
}
if (/<svg(?:\s|>)/i.test(appSource)) failures.push('App bevat handgeschreven inline-SVG; gebruik uitsluitend de officiële Lucide-package');
if (/setBrandName|setProductName|BuilderMenu|builder-menu/.test(appSource)) failures.push('Merk- of producttekst is nog aanpasbaar via het oude bouwmenu');
if (/id="logo"|label="Merk & logo"|setLogoId|logoId|logoTemplates|Logo-template/.test(appSource)) failures.push('De verwijderde merk- en logokeuze staat nog in de templatebediening of AI-export');
if (appSource.indexOf('<TemplateToolbar') > appSource.indexOf('<div className="sale-bar')) failures.push('Template-instellingen staan niet helemaal bovenaan de pagina');
if (/GEBRUIK-DE-HUIDIGE-PAGINA-URL|De configureerbare URL wordt opgebouwd/.test(appSource)) failures.push('AI-export bevat nog een URL-placeholder');
for (const asset of ['ideal.svg','visa.svg','mastercard.svg','apple-pay.svg','paypal.svg','klarna.svg','bancontact.svg']) {
  const assetPath=`public/payment-logos/${asset}`;
  if (!fs.existsSync(assetPath)||!fs.readFileSync(assetPath,'utf8').includes('<svg')) failures.push(`Officieel betaallogo ontbreekt of is ongeldig: ${assetPath}`);
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
  if (slot.ratio !== '1:1') failures.push(`${slot.id}: desktopratio moet exact 1:1 zijn`);
  if (slot.mobileRatio !== '1:1') failures.push(`${slot.id}: mobielratio moet exact 1:1 zijn`);
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
  if (manifest.designSystem?.palettes?.length !== 12 || !manifest.designSystem.palettes.includes('shecommerce')) failures.push(`${slug}: verwacht 12 kleurpaletten inclusief SheCommerce`);
  if (manifest.designSystem?.fonts?.length !== 9 || !manifest.designSystem.fonts.includes('shecommerce')) failures.push(`${slug}: verwacht 9 lettertypes inclusief SheCommerce`);
  if (manifest.designSystem?.logoTemplates) failures.push(`${slug}: verwijderde logo-instelling staat nog in het manifest`);
  if (manifest.designSystem?.templateBrand !== 'DSA STORE TEMPLATE') failures.push(`${slug}: vaste DSA-templatebranding ontbreekt`);
  if (JSON.stringify(manifest.aiContract?.configurableUrlParams) !== JSON.stringify(['cat','pal','font','brand'])) failures.push(`${slug}: configureerbare URL-parameters zijn niet exact cat, pal, font en brand`);
  if (manifest.schemaVersion !== '5.0') failures.push(`${slug}: verwacht manifestschema 5.0`);
  if (manifest.templateId !== 'dsa-store-template') failures.push(`${slug}: vaste template-ID ontbreekt`);
  if (manifest.sourceRepository?.url !== 'https://github.com/jndegens/dsa-store-template') failures.push(`${slug}: openbare GitHub-bron ontbreekt`);
  if (manifest.sourceRepository?.storefrontContract !== 'https://github.com/jndegens/dsa-store-template/blob/main/STOREFRONT.md') failures.push(`${slug}: storefrontcontract-URL ontbreekt`);
  if (manifest.surfaceContract?.mode !== 'merchant-storefront-only') failures.push(`${slug}: storefront-only contract ontbreekt`);
  for (const selector of ['.template-toolbar','.studio-modal','.prompt-drawer','.machine-content']) {
    if (!manifest.surfaceContract?.excludeSelectors?.includes(selector)) failures.push(`${slug}: uitsluitselector ontbreekt: ${selector}`);
  }
  if (manifest.designSystem?.paymentKit?.id !== 'datatrans-payment-logos') failures.push(`${slug}: Datatrans payment-kit ontbreekt`);
  if (manifest.designSystem?.iconPack?.source !== 'https://github.com/lucide-icons/lucide') failures.push(`${slug}: officiële Lucide-bron ontbreekt`);
  if (manifest.implementationContracts?.typography?.bodyMinimumPx !== 16) failures.push(`${slug}: minimale bodytekst is niet 16px`);
  if (manifest.implementationContracts?.typography?.secondaryMinimumPx !== 14) failures.push(`${slug}: minimale secundaire tekst is niet 14px`);
  if (manifest.implementationContracts?.icons?.package !== 'lucide-react') failures.push(`${slug}: Lucide React-package is niet verplicht`);
  if (JSON.stringify(manifest.implementationContracts?.galleries?.final?.slotIds) !== JSON.stringify(['final-thumbnail','gallery-use','gallery-close','gallery-features','gallery-box'])) failures.push(`${slug}: onderste galerij bevat niet exact vijf verplichte beelden`);
  if (manifest.implementationContracts?.galleries?.final?.thumbnailCount !== 5) failures.push(`${slug}: onderste galerij verplicht niet exact vijf miniaturen`);
  for (const method of manifest.implementationContracts?.payments?.methods || []) {
    if (!method.asset?.startsWith('/payment-logos/') || !method.rawUrl?.startsWith('https://raw.githubusercontent.com/jndegens/dsa-store-template/main/public/payment-logos/')) failures.push(`${slug}: betaallogo ${method.id} mist officiële lokale en raw bron`);
  }
  if (JSON.stringify(manifest.routes) !== JSON.stringify(routes)) failures.push(`${slug}: routelijst wijkt af`);
  if (JSON.stringify(manifest.imageBriefs) !== JSON.stringify(imageSlots)) failures.push(`${slug}: beeldslots wijken af van canonieke bron`);
  if (JSON.stringify(manifest.contentPrompts) !== JSON.stringify(expectedContentPrompts)) failures.push(`${slug}: contentprompts wijken af van canonieke bron`);
}

const base44Path = 'public/base44.json';
if (!fs.existsSync(base44Path)) failures.push('Base44-machinebestand ontbreekt');
else {
  const base44 = JSON.parse(fs.readFileSync(base44Path, 'utf8'));
  if (base44.schemaVersion !== '5.0') failures.push('Base44-machinebestand gebruikt niet schema 5.0');
  if (base44.templateId !== 'dsa-store-template') failures.push('Base44-machinebestand mist de vaste template-ID');
  if (base44.sourceRepository?.url !== 'https://github.com/jndegens/dsa-store-template') failures.push('Base44-machinebestand mist de openbare GitHub-bron');
  if (base44.readOrder?.[0] !== 'STOREFRONT.md') failures.push('Base44-machinebestand leest het storefrontcontract niet als eerste');
  if (!base44.readOrder?.includes('BASE44.md')) failures.push('Base44-machinebestand verwijst niet naar de startgids');
  if (base44.surfaceContract?.mode !== 'merchant-storefront-only') failures.push('Base44-machinebestand mist storefront-only mode');
  if (base44.implementationContracts?.typography?.bodyMinimumPx !== 16) failures.push('Base44-machinebestand mist de 16px leesbaarheidsvloer');
  if (base44.implementationContracts?.icons?.package !== 'lucide-react') failures.push('Base44-machinebestand verplicht lucide-react niet');
  if (base44.implementationContracts?.galleries?.final?.thumbnailCount !== 5) failures.push('Base44-machinebestand mist de onderste galerij met vijf miniaturen');
  for (const selector of ['.template-toolbar','.studio-modal','.prompt-drawer','.machine-content']) {
    if (!base44.surfaceContract?.excludeSelectors?.includes(selector)) failures.push(`Base44-machinebestand mist uitsluitselector: ${selector}`);
  }
  const base44InputIds = new Set((base44.requiredInputs || []).map((input) => input.id));
  for (const slot of imageSlots) if (!base44InputIds.has(`image.${slot.id}`)) failures.push(`Base44-machinebestand mist beeldslot ${slot.id}`);
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
      const paymentTags = [...html.matchAll(/<img[^>]*data-payment-id="[^"]+"[^>]*>/g)].map((match) => match[0]);
      if (paymentTags.length < 7) failures.push(`${route}: verwacht minimaal zeven officiële betaallogo's, vond ${paymentTags.length}`);
      const renderedPaymentIds = new Set(paymentTags.map(tag => attribute(tag, 'data-payment-id')));
      for (const paymentId of ['ideal', 'visa', 'mastercard', 'applepay', 'paypal', 'klarna', 'bancontact']) {
        if (!renderedPaymentIds.has(paymentId)) failures.push(`${route}: betaallogo ${paymentId} ontbreekt in de HTML-output`);
      }
      for (const tag of paymentTags) {
        if (!attribute(tag, 'data-payment-asset')?.startsWith('public/payment-logos/')) failures.push(`${route}: betaallogo mist repository-asset`);
        if (!attribute(tag, 'data-payment-raw-url')?.startsWith('https://raw.githubusercontent.com/jndegens/dsa-store-template/main/public/payment-logos/')) failures.push(`${route}: betaallogo mist raw GitHub-fallback`);
      }
    }

    const configured = await fetch(`http://127.0.0.1:${port}/stores/beauty?cat=beauty&pal=rose&font=luxury`);
    const configuredHtml = await configured.text();
    for (const token of ['DSA STORE TEMPLATE','[JOUW PRODUCTNAAM]','"category":{"id":"beauty"','datatrans-payment-logos']) {
      if (!configuredHtml.includes(token)) failures.push(`Deelbare URL mist SSR-configuratie: ${token}`);
    }
    const expectedUrl=`http://127.0.0.1:${port}/stores/beauty?cat=beauty&pal=rose&font=luxury`;
    if (!configuredHtml.replaceAll('&amp;','&').includes(expectedUrl)) failures.push('SSR-export bevat niet de exacte configureerbare URL');
    for (const slot of imageSlots) {
      if (!configuredHtml.includes(`"id":"${slot.id}"`)) failures.push(`SSR-export mist individuele beeldregel ${slot.id}`);
    }

    const spoofCases = [
      { host: 'evil.example', 'x-forwarded-host': 'evil.example', 'x-forwarded-proto': 'javascript' },
      { host: 'agents.dropshipacademy.nl', 'x-forwarded-host': 'evil.example', 'x-forwarded-proto': 'gopher' },
      { host: 'attacker.invalid', 'x-forwarded-host': 'agents.dropshipacademy.nl', 'x-forwarded-proto': 'https' },
    ];
    const productionRoute='https://agents.dropshipacademy.nl/stores/beauty';
    for (const spoofHeaders of spoofCases) {
      const response = await new Promise((resolve, reject) => {
        const request = http.request({ hostname: '127.0.0.1', port, path: '/stores/beauty?cat=beauty&pal=rose&font=luxury', headers: spoofHeaders }, (result) => {
          let body = '';
          result.setEncoding('utf8');
          result.on('data', (chunk) => { body += chunk; });
          result.on('end', () => resolve({ status: result.statusCode, body }));
        });
        request.on('error', reject);
        request.end();
      });
      if (response.status !== 200) { failures.push(`SSR proxy-header-regressie antwoordt met ${response.status}`); continue; }
      const html = response.body.replaceAll('&amp;', '&');
      if (!html.includes(productionRoute)) failures.push(`SSR proxy-header-regressie mist canonieke productie-origin voor Host ${spoofHeaders.host}`);
      if (html.includes('evil.example') || html.includes('javascript://') || html.includes('gopher://')) failures.push(`SSR proxy-header-regressie lekt vervalste header voor Host ${spoofHeaders.host}`);
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
