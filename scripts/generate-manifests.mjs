import fs from 'node:fs';
import { stores, imageSlots } from '../src/content/product.js';
import { annotationBase } from '../src/content/annotations.js';

fs.mkdirSync('public/stores', { recursive: true });
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const withBasePath = (path) => `${basePath}${path}`;
const routes = [withBasePath('/'), withBasePath('/stores'), ...Object.keys(stores).map((slug) => withBasePath(`/stores/${slug}`))];
const categories = ['dieren','beauty','gadgets','wellness','fashion','wonen','kids','outdoor'];
const palettes = ['dsa','amber','rose','electric','sage','clay','violet','lemon','mono','coral','ocean'];
const fonts = ['friendly','luxury','technical','editorial','rounded','fashion','bold','minimal'];
const paymentMethods = [{id:'ideal',asset:withBasePath('/payment-logos/ideal.svg')},{id:'visa',asset:withBasePath('/payment-logos/visa.svg')},{id:'mastercard',asset:withBasePath('/payment-logos/mastercard.svg')},{id:'applepay',asset:withBasePath('/payment-logos/apple-pay.svg')},{id:'paypal',asset:withBasePath('/payment-logos/paypal.svg')},{id:'klarna',asset:withBasePath('/payment-logos/klarna.svg')},{id:'bancontact',asset:withBasePath('/payment-logos/bancontact.svg')}];
const repository = {url:'https://github.com/jndegens/dsa-store-template',cloneUrl:'https://github.com/jndegens/dsa-store-template.git',branch:'main',guide:'https://github.com/jndegens/dsa-store-template/blob/main/BASE44.md',machineData:'https://raw.githubusercontent.com/jndegens/dsa-store-template/main/public/base44.json',download:'https://github.com/jndegens/dsa-store-template/archive/refs/heads/main.zip'};
const masterPrompt = `Importeer of clone eerst de openbare DSA GitHub-repository. Lees BASE44.md, public/base44.json en daarna dit route-manifest. Gebruik de bestaande broncode als source of truth en reconstrueer de pagina niet vanaf een screenshot. Vraag eerst om ontbrekende productdata. Vervang daarna uitsluitend placeholders met aangeleverde, verifieerbare informatie. Behoud alle secties, klikbare interacties, machineleesbare attributen en 1:1 beeldverhoudingen. Verzin nooit claims, prijzen, voorraad, reviews, experts, keurmerken of garanties.`;
const manifest = {
  schemaVersion: '5.0',
  templateId: 'dsa-store-template',
  pageType: 'generic-dsa-product-template',
  language: 'nl-NL',
  routes,
  sourceRepository: repository,
  aiContract: {
    masterPrompt,
    workflow: ['Importeer de GitHub-repository','Lees BASE44.md en public/base44.json','Lees configuration en sections','Rapporteer ontbrekende requiredInputs','Wacht op echte productdata','Vul de bestaande componenten','Voer npm test uit'],
    hardRules: ['Behoud de DSA-layout en componentstructuur','Alle afbeeldingen exact 1:1','Geen verzonnen feiten of social proof','Alle controls toetsenbordtoegankelijk','Behoud machineleesbare attributen'],
    configurableUrlParams: ['cat','pal','font'],
    expectedOutput: 'Een complete, responsieve en klikbare productpagina plus een lijst van gebruikte brondata.',
  },
  designSystem: {templateBrand:'DSA STORE TEMPLATE',categories,palettes,fonts,iconPack:{id:'lucide-react',source:'https://github.com/lucide-icons/lucide',license:'ISC',style:'outline',usage:'Kies iconen op betekenis; gebruik nooit alleen een icoon voor essentiële tekst.'},paymentKit:{id:'datatrans-payment-logos',source:'https://github.com/datatrans/payment-logos',license:'CC-BY-SA-4.0',methods:paymentMethods,purpose:'Visuele betaalvertrouwensbadges; geen checkout of betalingsverwerking.'}},
  imageBriefs: imageSlots,
  contentPrompts: Object.entries(annotationBase).map(([id, annotation]) => ({ id, ...annotation })),
  promptContracts: Object.entries(annotationBase).map(([id, annotation]) => ({id,selector:`[data-learn-record='${id}']`,purpose:annotation.guidance,requiredInputs:['brand_name','product_name','verified_product_data'],variables:['[MERK]','[PRODUCT]'],constraints:['Geen onbewezen claims','Geen verzonnen prijs, review of garantie'],expectedOutput:'Nederlandse webcopy passend binnen het bestaande element'})),
  sections: Object.entries(annotationBase).map(([id, annotation])=>({id,selector:`[data-ai-section='${id}']`,promptId:id,purpose:annotation.guidance,imageSlot:annotation.shot?.shotId||null})),
  scrapeInstructions: 'Begin bij public/base44.json en lees daarna aiContract.masterPrompt. Ieder imageBrief correspondeert exact met data-visible-slot in de HTML. Ieder promptrecord staat in de initiële HTML als data-learn-record en data-ai-section. JavaScript-interactie is niet nodig om de prompts te lezen.',
};

for (const slug of Object.keys(stores)) {
  const directory = `public/stores/${slug}`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(`${directory}/template.json`, `${JSON.stringify(manifest, null, 2)}\n`);
}

const index = {
  schemaVersion: '5.0',
  template: 'generic-dsa-product-template',
  routes,
  sourceRepository: repository,
  base44Data: withBasePath('/base44.json'),
  canonicalManifest: withBasePath('/stores/dieren/template.json'),
  aliases: Object.keys(stores).map((slug) => withBasePath(`/stores/${slug}/template.json`)),
};
fs.writeFileSync('public/stores/index.json', `${JSON.stringify(index, null, 2)}\n`);

const requiredInputs = [
  {id:'brand_name',type:'string',required:true,description:'Merknaam van de winkel'},
  {id:'product_name',type:'string',required:true,description:'Korte, duidelijke productnaam'},
  {id:'product_description',type:'string',required:true,description:'Wat het product is, voor wie en welk probleem het oplost'},
  {id:'current_price',type:'money',required:true,description:'Actuele verkoopprijs'},
  {id:'compare_at_price',type:'money',required:false,description:'Controleerbare van-prijs'},
  {id:'discount',type:'string',required:false,description:'Korting afgeleid van echte prijzen'},
  {id:'benefits',type:'array',required:true,description:'Minimaal drie feitelijke voordelen'},
  {id:'bundles',type:'array',required:true,description:'Prijs en inhoud per bundel'},
  {id:'stock',type:'string',required:true,description:'Echte voorraadstatus'},
  {id:'shipping',type:'object',required:true,description:'Verzendtijd, kosten en voorwaarden'},
  {id:'guarantee',type:'object',required:true,description:'Echte proefperiode of garantievoorwaarden'},
  {id:'faqs',type:'array',required:true,description:'Veelgestelde vragen met feitelijke antwoorden'},
  {id:'reviews',type:'array',required:false,description:'Alleen echte klantreviews met toestemming'},
  {id:'expert_proof',type:'object',required:false,description:'Alleen echte en verifieerbare expertbron'},
  ...imageSlots.map((slot)=>({id:`image.${slot.id}`,type:'image',required:true,description:slot.brief,constraints:['exact 1:1',slot.prompt]})),
];

const base44Package = {
  schemaVersion:'5.0',
  templateId:'dsa-store-template',
  id:'dsa-store-template-base44-package',
  purpose:'Machineleesbare overdracht waarmee Base44 de bestaande DSA-productpagina vanuit broncode kan importeren en met echte productdata kan vullen.',
  sourceRepository:repository,
  readOrder:['BASE44.md','public/base44.json','public/stores/{category}/template.json','src/App.jsx','src/styles.css','src/content/product.js','src/content/annotations.js'],
  commands:{install:'npm install',dev:'npm run dev',test:'npm test',build:'npm run build'},
  routes,
  entrypoints:{app:'src/App.jsx',styles:'src/styles.css',productData:'src/content/product.js',promptData:'src/content/annotations.js',routeManifest:'public/stores/{category}/template.json'},
  configuration:{defaults:{cat:'dieren',pal:'dsa',font:'friendly'},queryParameters:{cat:categories,pal:palettes,font:fonts}},
  dataSources:{stores,designSystem:manifest.designSystem,imageBriefs:imageSlots,contentPrompts:manifest.contentPrompts,promptContracts:manifest.promptContracts,sections:manifest.sections},
  requiredInputs,
  buildRules:['Importeer of clone de repository; herschrijf de template niet vanaf een screenshot','Behoud de bestaande React-componenten, CSS en sectievolgorde','Vervang uitsluitend placeholders met aangeleverde, verifieerbare productdata','Behoud alle data-ai-*, data-learn-record en data-visible-slot attributen','Alle zichtbare afbeeldingen zijn exact 1:1','Behoud alle klikbare interacties en toetsenbordbediening','Gebruik Lucide voor interface-iconen en de meegeleverde Datatrans-betaallogo’s','Voer npm test uit voor oplevering'],
  forbidden:['Verzonnen claims, prijzen, voorraad, reviews, experts, keurmerken, levertijden of garanties','Een screenshot gebruiken als enige bouwbron','Afbeeldingen met een andere verhouding dan 1:1','Machineleesbare attributen of interactieve states verwijderen'],
  acceptanceCriteria:['De gekozen categorie, palette en font werken via URL-parameters','De desktop- en mobiele layout blijven responsief','Alle knoppen, selectors, bundels, accordeons, modals en winkelmand zijn klikbaar','Alle placeholders komen uit aangeleverde input','npm test slaagt zonder fouten'],
};
fs.writeFileSync('public/base44.json', `${JSON.stringify(base44Package, null, 2)}\n`);
console.log(`Eén generiek manifest gegenereerd voor ${routes.length} routes en ${imageSlots.length} zichtbare beeldslots.`);
