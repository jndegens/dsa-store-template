import fs from 'node:fs';
import { stores, imageSlots } from '../src/content/product.js';
import { annotationBase } from '../src/content/annotations.js';

fs.mkdirSync('public/stores', { recursive: true });
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const withBasePath = (path) => `${basePath}${path}`;
const routes = [withBasePath('/'), withBasePath('/stores'), ...Object.keys(stores).map((slug) => withBasePath(`/stores/${slug}`))];
const categories = ['dieren','beauty','gadgets','wellness','fashion','wonen','kids','outdoor'];
const palettes = ['dsa','shecommerce','amber','rose','electric','sage','clay','violet','lemon','mono','coral','ocean'];
const fonts = ['friendly','shecommerce','luxury','technical','editorial','rounded','fashion','bold','minimal'];
const paymentLogoRawBase = 'https://raw.githubusercontent.com/jndegens/dsa-store-template/main/public/payment-logos';
const paymentMethods = [
  {id:'ideal',label:'iDEAL',file:'ideal.svg'},
  {id:'visa',label:'Visa',file:'visa.svg'},
  {id:'mastercard',label:'Mastercard',file:'mastercard.svg'},
  {id:'applepay',label:'Apple Pay',file:'apple-pay.svg'},
  {id:'paypal',label:'PayPal',file:'paypal.svg'},
  {id:'klarna',label:'Klarna',file:'klarna.svg'},
  {id:'bancontact',label:'Bancontact',file:'bancontact.svg'},
].map((item)=>({...item,asset:withBasePath(`/payment-logos/${item.file}`),repositoryAsset:`public/payment-logos/${item.file}`,rawUrl:`${paymentLogoRawBase}/${item.file}`}));
const finalGallerySlotIds = ['final-thumbnail','gallery-use','gallery-close','gallery-features','gallery-box'];
const implementationContracts = {
  typography:{bodyMinimumPx:16,secondaryMinimumPx:14,controlMinimumPx:14,rule:'Geen klantgerichte tekst kleiner dan 14px; lopende tekst minimaal 16px.'},
  icons:{library:'lucide-react',package:'lucide-react',repository:'https://github.com/lucide-icons/lucide',importRule:'Importeer uitsluitend via lucide-react; teken geen eigen SVG.',forbidden:['handgeschreven SVG','emoji-iconen','icon fonts','CSS-vormen als icoon']},
  payments:{library:'datatrans-payment-logos',repository:'https://github.com/datatrans/payment-logos',renderRule:'Render elk logo als <img> met asset of rawUrl; nooit als tekst, emoji, base64 of nagetekende SVG.',methods:paymentMethods,forbidden:['tekstbadges','emoji','base64','nagetekende betaalmerken']},
  galleries:{primary:{slotIds:['gallery-hero','gallery-use','gallery-close','gallery-features','gallery-box'],thumbnailCount:5},final:{slotIds:finalGallerySlotIds,thumbnailCount:5},interactionRules:['groot actief 1:1 beeld','vijf klikbare miniaturen','vorige/volgende-knoppen','geen lege ruimte onder het hoofdbeeld']},
};
const repository = {url:'https://github.com/jndegens/dsa-store-template',cloneUrl:'https://github.com/jndegens/dsa-store-template.git',branch:'main',storefrontContract:'https://github.com/jndegens/dsa-store-template/blob/main/STOREFRONT.md',guide:'https://github.com/jndegens/dsa-store-template/blob/main/BASE44.md',machineData:'https://raw.githubusercontent.com/jndegens/dsa-store-template/main/public/base44.json',download:'https://github.com/jndegens/dsa-store-template/archive/refs/heads/main.zip'};
const surfaceContract = {
  mode:'merchant-storefront-only',
  repositoryRole:'Design- en datareferentie; nooit de volledige DSA-app als uitvoer klonen.',
  include:['actiebalk en USP-balk','merchant-header','main#main met alle productsecties','merchant-footer','galerij, bundels, accordeons, FAQ, winkelmand en mobiele CTA','officiële Datatrans-betaallogo’s'],
  excludeSelectors:['.template-toolbar','.studio-modal','.studio-backdrop','.prompt-drawer','.learn-marker','.placeholder__learn','.placeholder__prompt','.machine-content','#dsa-ai-blueprint'],
  excludeVisibleTerms:['DSA STORE TEMPLATE','Dropship Academy','Base44','GitHub','AI-prompt','template','leerlaag','scrape','DEMO-WINKELMAND','onderwijstemplate'],
  metadataPolicy:'Lees data-ai-*, data-learn-* en data-visible-slot tijdens de bouw, maar render deze bouwmetadata niet in de productie-DOM.',
  brandingPolicy:'Vervang alle DSA-branding door de aangeleverde brand_name en brand_logo.',
};
const repairWorkflow = {
  useWhen:'Het bestaande Base44-project bevat de volledige DSA-studio of zichtbare DSA/editorinformatie.',
  preserve:['aangeleverde merchant-productdata','productbeelden','prijzen','merknaam en merklogo','klantgerichte storefrontsecties'],
  remove:surfaceContract.excludeSelectors,
  steps:['Lees STOREFRONT.md','Werk in het bestaande project','Behoud merchant-data en afbeeldingen','Verwijder de volledige studio/editorlaag en DSA-branding','Bouw merchant-header en merchant-footer','Herstel en test galerij, bundels, betaallogo’s, accordeons, FAQ, winkelmand en mobiele CTA','Controleer dat alle verboden zichtbare termen nul resultaten geven'],
};
const masterPrompt = `BELANGRIJK: bouw uitsluitend een schone klantgerichte merchant-storefront. Clone of render NOOIT de volledige DSA-app. Lees eerst STOREFRONT.md en daarna public/base44.json en dit route-manifest. Gebruik de repository als ontwerp- en datareferentie. Neem geen DSA-toolbar, DSA-branding, leerlaag, promptmodals, machine-content, GitHub/Base44-uitleg of demowinkelmand over. Gebruik bouwmetadata tijdens het genereren maar verwijder die uit de productie-DOM. Vraag eerst om ontbrekende productdata en vervang alleen placeholders met aangeleverde, verifieerbare informatie. Behoud de klantgerichte secties, interacties en 1:1 beeldverhoudingen. Bouw boven en onder een volledige galerij met een groot 1:1 beeld, vijf klikbare miniaturen en pijlen. Gebruik alle zeven officiële betaalassets als <img> en uitsluitend lucide-react voor interface-iconen. Lopende tekst is minimaal 16px en geen merchanttekst is kleiner dan 14px. Verzin nooit claims, prijzen, voorraad, reviews, experts, keurmerken of garanties.`;
const manifest = {
  schemaVersion: '5.0',
  templateId: 'dsa-store-template',
  pageType: 'generic-dsa-product-template',
  language: 'nl-NL',
  routes,
  sourceRepository: repository,
  aiContract: {
    masterPrompt,
    surfaceContract,
    repairWorkflow,
    implementationContracts,
    workflow: ['Lees STOREFRONT.md vóór alle broncode','Gebruik de GitHub-repository als referentie, niet als volledig te klonen eindproduct','Lees public/base44.json en configuration/sections','Rapporteer ontbrekende requiredInputs','Wacht op echte productdata','Bouw alleen de merchant-storefront','Voer npm test uit'],
    hardRules: ['Geen DSA-studio, DSA-branding of AI-uitleg in de winkel','Behoud de klantgerichte layout en sectievolgorde','Alle afbeeldingen exact 1:1','Boven en onder een complete galerij met vijf klikbare miniaturen','Alle betaalmerken als officiële afbeeldingsassets','Alle interface-iconen uit lucide-react','Lopende tekst minimaal 16px en overige merchanttekst minimaal 14px','Geen verzonnen feiten of social proof','Alle klantcontrols toetsenbordtoegankelijk','Bouwmetadata consumeren maar niet renderen'],
    configurableUrlParams: ['cat','pal','font','brand'],
    expectedOutput: 'Een complete, responsieve en klikbare merchant-productpagina zonder DSA/editor/template-informatie, plus een lijst van gebruikte brondata.',
  },
  designSystem: {templateBrand:'DSA STORE TEMPLATE',categories,palettes,fonts,typography:implementationContracts.typography,iconPack:{id:'lucide-react',package:'lucide-react',source:'https://github.com/lucide-icons/lucide',license:'ISC',style:'outline',usage:'Importeer iconen uit lucide-react op betekenis; teken geen eigen SVG en gebruik nooit alleen een icoon voor essentiële tekst.',forbidden:implementationContracts.icons.forbidden},paymentKit:{id:'datatrans-payment-logos',source:'https://github.com/datatrans/payment-logos',license:'CC-BY-SA-4.0',methods:paymentMethods,renderRule:implementationContracts.payments.renderRule,purpose:'Visuele betaalvertrouwensbadges; geen checkout of betalingsverwerking.'}},
  imageBriefs: imageSlots,
  contentPrompts: Object.entries(annotationBase).map(([id, annotation]) => ({ id, ...annotation })),
  promptContracts: Object.entries(annotationBase).map(([id, annotation]) => ({id,selector:`[data-learn-record='${id}']`,purpose:annotation.guidance,requiredInputs:['brand_name','product_name','verified_product_data'],variables:['[MERK]','[PRODUCT]'],constraints:['Geen onbewezen claims','Geen verzonnen prijs, review of garantie'],expectedOutput:'Nederlandse webcopy passend binnen het bestaande element'})),
  sections: Object.entries(annotationBase).map(([id, annotation])=>({id,selector:`[data-ai-section='${id}']`,promptId:id,purpose:annotation.guidance,imageSlot:annotation.shot?.shotId||null})),
  scrapeInstructions: 'Begin bij public/base44.json en lees daarna aiContract.masterPrompt. Ieder imageBrief correspondeert exact met data-visible-slot in de HTML. Ieder promptrecord staat in de initiële HTML als data-learn-record en data-ai-section. JavaScript-interactie is niet nodig om de prompts te lezen.',
  surfaceContract,
  repairWorkflow,
  implementationContracts,
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
  purpose:'Machineleesbare overdracht waarmee Base44 uitsluitend een klantgerichte merchant-storefront bouwt, met de DSA-repository als ontwerp- en datareferentie.',
  sourceRepository:repository,
  readOrder:['STOREFRONT.md','BASE44.md','public/base44.json','public/stores/{category}/template.json','src/App.jsx','src/styles.css','src/content/product.js','src/content/annotations.js'],
  commands:{install:'npm install',dev:'npm run dev',test:'npm test',build:'npm run build'},
  routes,
  entrypoints:{app:'src/App.jsx',styles:'src/styles.css',productData:'src/content/product.js',promptData:'src/content/annotations.js',routeManifest:'public/stores/{category}/template.json'},
  configuration:{defaults:{cat:'dieren',pal:'dsa',font:'friendly'},queryParameters:{cat:categories,pal:palettes,font:fonts}},
  implementationContracts,
  dataSources:{stores,designSystem:manifest.designSystem,implementationContracts,imageBriefs:imageSlots,contentPrompts:manifest.contentPrompts,promptContracts:manifest.promptContracts,sections:manifest.sections},
  surfaceContract,
  repairWorkflow,
  requiredInputs,
  buildRules:['Lees STOREFRONT.md vóór het openen of kopiëren van src/App.jsx','Gebruik de repository als ontwerp- en datareferentie; clone de complete app niet naar de uitvoer','Behoud de klantgerichte sectievolgorde, responsive layout en interacties','Vervang uitsluitend placeholders met aangeleverde, verifieerbare productdata','Gebruik data-ai-*, data-learn-record en data-visible-slot tijdens de bouw en verwijder bouwmetadata uit de productie-DOM','Alle zichtbare afbeeldingen zijn exact 1:1','Bouw zowel boven als onder een grote actieve afbeelding met exact vijf klikbare miniaturen en pijlen','Importeer interface-iconen uitsluitend uit lucide-react en teken geen eigen SVG','Render alle zeven meegeleverde Datatrans-betaallogo’s als <img> met asset of rawUrl','Gebruik minimaal 16px voor lopende tekst en minimaal 14px voor overige merchanttekst','Voer npm test uit voor oplevering'],
  forbidden:['DSA-toolbar, DSA-branding, leerlaag, promptmodals, machine-content, GitHub/Base44-uitleg of demowinkelmand in de storefront','Verzonnen claims, prijzen, voorraad, reviews, experts, keurmerken, levertijden of garanties','Een screenshot gebruiken als enige bouwbron','Afbeeldingen met een andere verhouding dan 1:1','Handgeschreven SVG, emoji, icon font of CSS-vorm als interface-icoon','Betaalmerken als tekst, emoji, base64 of nagetekende SVG','Een leeg vlak onder de onderste productafbeelding','Klantgerichte tekst kleiner dan 14px','Bouwmetadata als zichtbare inhoud of productie-DOM exporteren'],
  acceptanceCriteria:['De gekozen categorie, palette en font zijn als initiële merchant-stijl toegepast zonder zichtbare configuratiecontrols','De desktop- en mobiele layout blijven responsief','Beide galerijen tonen een groot actief 1:1 beeld, vijf klikbare miniaturen en werkende pijlen','Bundels, accordeons, FAQ, winkelmand en mobiele CTA zijn klikbaar','Alle zeven officiële betaallogo’s laden als afbeeldingen','Alle interface-iconen komen uit lucide-react','Lopende tekst is minimaal 16px en overige merchanttekst minimaal 14px','Alle placeholders komen uit aangeleverde input','De zichtbare tekst bevat geen DSA-, Base44-, GitHub-, AI-, prompt-, template-, leerlaag-, scrape- of demotekst','npm test slaagt zonder fouten'],
};
fs.writeFileSync('public/base44.json', `${JSON.stringify(base44Package, null, 2)}\n`);
console.log(`Eén generiek manifest gegenereerd voor ${routes.length} routes en ${imageSlots.length} zichtbare beeldslots.`);
