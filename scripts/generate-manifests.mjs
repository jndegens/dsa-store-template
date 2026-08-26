import fs from 'node:fs';
import { stores, imageSlots } from '../src/content/product.js';
import { annotationBase } from '../src/content/annotations.js';

fs.mkdirSync('public/stores', { recursive: true });
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const withBasePath = (path) => `${basePath}${path}`;
const routes = [withBasePath('/'), withBasePath('/stores'), ...Object.keys(stores).map((slug) => withBasePath(`/stores/${slug}`))];
const categories = ['dieren','beauty','gadgets','wellness','fashion','wonen','kids','outdoor'];
const palettes = ['amber','rose','electric','sage','clay','violet','lemon','mono','coral','ocean'];
const fonts = ['friendly','luxury','technical','editorial','rounded','fashion','bold','minimal'];
const paymentMethods = [{id:'ideal',asset:withBasePath('/payment-logos/ideal.svg')},{id:'visa',asset:withBasePath('/payment-logos/visa.svg')},{id:'mastercard',asset:withBasePath('/payment-logos/mastercard.svg')},{id:'applepay',asset:withBasePath('/payment-logos/apple-pay.svg')},{id:'paypal',asset:withBasePath('/payment-logos/paypal.svg')},{id:'klarna',asset:withBasePath('/payment-logos/klarna.svg')},{id:'bancontact',asset:withBasePath('/payment-logos/bancontact.svg')}];
const masterPrompt = `Open dit JSON-manifest en reconstrueer de Wolkveld-productpagina exact volgens sections en selectors. Vraag eerst om ontbrekende productdata. Vervang daarna uitsluitend placeholders met aangeleverde, verifieerbare informatie. Behoud alle secties, klikbare interacties en 1:1 beeldverhoudingen. Verzin nooit claims, prijzen, voorraad, reviews, experts, keurmerken of garanties. Lever semantische HTML en behoud alle data-ai-section en data-ai-prompt-id attributen.`;
const manifest = {
  schemaVersion: '4.1',
  templateId: 'wolkveld-pdp',
  pageType: 'generic-wolkveld-product-template',
  language: 'nl-NL',
  routes,
  aiContract: {
    masterPrompt,
    workflow: ['Lees configuration en sections','Rapporteer ontbrekende requiredInputs','Wacht op echte productdata','Bouw exact volgens selectors','Valideer claims en alle 1:1 beelden'],
    hardRules: ['Behoud Wolkveld-layout','Alle afbeeldingen exact 1:1','Geen verzonnen feiten of social proof','Alle controls toetsenbordtoegankelijk','Behoud machineleesbare attributen'],
    configurableUrlParams: ['cat','pal','font'],
    expectedOutput: 'Een complete, responsieve en klikbare productpagina plus een lijst van gebruikte brondata.',
  },
  designSystem: {templateBrand:'DSA STORE TEMPLATE',categories,palettes,fonts,iconPack:{id:'lucide-react',source:'https://github.com/lucide-icons/lucide',license:'ISC',style:'outline',usage:'Kies iconen op betekenis; gebruik nooit alleen een icoon voor essentiële tekst.'},paymentKit:{id:'datatrans-payment-logos',source:'https://github.com/datatrans/payment-logos',license:'CC-BY-SA-4.0',methods:paymentMethods,purpose:'Visuele betaalvertrouwensbadges; geen checkout of betalingsverwerking.'}},
  imageBriefs: imageSlots,
  contentPrompts: Object.entries(annotationBase).map(([id, annotation]) => ({ id, ...annotation })),
  promptContracts: Object.entries(annotationBase).map(([id, annotation]) => ({id,selector:`[data-learn-record='${id}']`,purpose:annotation.guidance,requiredInputs:['brand_name','product_name','verified_product_data'],variables:['[MERK]','[PRODUCT]'],constraints:['Geen onbewezen claims','Geen verzonnen prijs, review of garantie'],expectedOutput:'Nederlandse webcopy passend binnen het bestaande element'})),
  sections: Object.entries(annotationBase).map(([id, annotation])=>({id,selector:`[data-ai-section='${id}']`,promptId:id,purpose:annotation.guidance,imageSlot:annotation.shot?.shotId||null})),
  scrapeInstructions: 'Lees eerst aiContract.masterPrompt. Ieder imageBrief correspondeert exact met data-visible-slot in de HTML. Ieder promptrecord staat in de initiële HTML als data-learn-record en data-ai-section. JavaScript-interactie is niet nodig om de prompts te lezen.',
};

for (const slug of Object.keys(stores)) {
  const directory = `public/stores/${slug}`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(`${directory}/template.json`, `${JSON.stringify(manifest, null, 2)}\n`);
}

const index = {
  schemaVersion: '4.1',
  template: 'generic-wolkveld-product-template',
  routes,
  canonicalManifest: withBasePath('/stores/dieren/template.json'),
  aliases: Object.keys(stores).map((slug) => withBasePath(`/stores/${slug}/template.json`)),
};
fs.writeFileSync('public/stores/index.json', `${JSON.stringify(index, null, 2)}\n`);
console.log(`Eén generiek manifest gegenereerd voor ${routes.length} routes en ${imageSlots.length} zichtbare beeldslots.`);
