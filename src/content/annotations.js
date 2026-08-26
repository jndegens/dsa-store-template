import { imageSlots } from './product.js';

const content = (label, type, guidance, prompt, checklist) => ({ label, type, guidance, prompt, checklist });

export const annotationBase = {
  announcement:content('Aankondigingsbalk','copy','Gebruik één echte, brede servicebelofte.','Schrijf 5 aankondigingsbalken van maximaal 55 tekens voor [PRODUCT]. Gebruik alleen een aantoonbare verzend-, garantie- of servicebelofte.',['Eén voordeel','Maximaal 55 tekens','Feitelijk bewijsbaar']),
  'header-benefits':content('Voordelenbalk','copy','Kies drie korte voordelen die de hele winkel ondersteunen.','Schrijf 3 korte, onderling verschillende winkelvoordelen voor [MERK]. Gebruik alleen echte service- of productfeiten.',['Drie verschillende voordelen','Kort en scanbaar','Geen nep-urgentie']),
  brand:content('Merk en logo','brand','Gebruik een compact, leesbaar logo dat ook op mobiel werkt.','Maak een briefing voor een eenvoudig woordmerk en beeldmerk voor [MERK] in [NICHE]. Beschrijf vorm, typografie, kleurgebruik en een versie voor klein mobiel formaat.',['Herkenbaar op klein formaat','Past bij merkstijl','Geen gekopieerd logo']),
  proof:content('Reviewbewijs','social-proof','Score, aantal en bron moeten controleerbaar bij elkaar horen.','Bereken de score uit [ECHTE REVIEWS] en schrijf één transparante reviewregel. Verzin geen aantal of score.',['Echte bron','Score plus aantal','Link naar reviews']),
  category:content('Productcategorie','copy','Gebruik een korte categorienaam die het product direct plaatst.','Geef 10 categorielabels van maximaal 4 woorden voor [PRODUCT]. Kies gewone klanttaal.',['Maximaal vier woorden','Product direct herkenbaar','Geen claim']),
  'action-badge':content('Actiebadge','offer','Gebruik alleen een korte badge als de actie aantoonbaar en actueel is.','Schrijf maximaal 5 korte actiebadges voor [PRODUCT] op basis van [ECHTE ACTIE]. Laat de badge weg als er geen actuele actie is.',['Actie is echt','Maximaal drie woorden','Geen nep-schaarste']),
  title:content('Producttitel','copy','Zeg wat het product is en wat het onderscheidt.','Schrijf 10 producttitels voor [PRODUCT], maximaal 6 woorden. Benoem producttype en belangrijkste onderscheid zonder onbewezen superlatief.',['Producttype duidelijk','Belangrijk onderscheid','Geen onbewezen claim']),
  price:content('Prijs en korting','offer','Toon alleen prijzen en besparingen die aantoonbaar kloppen.','Maak een prijsblok met [PRIJS] en een geldige [VAN-PRIJS]. Bereken [BESPARING] exact en laat korting weg als de referentieprijs niet aantoonbaar is.',['Prijs dominant','Exact narekenbaar','Geen verborgen kosten']),
  intro:content('Productintro','copy','Leg in drie zinnen uit wat het is, voor wie en waarom.','Schrijf een productintro van maximaal 55 woorden voor [PRODUCT]: wat het is, voor wie het bedoeld is en welk concreet probleem het helpt oplossen.',['Wat, wie en waarom','Maximaal 55 woorden','Geen absolute claim']),
  'benefit-list':content('Kernvoordelen','copy','Koppel ieder resultaat aan de eigenschap die het mogelijk maakt.','Zet [EIGENSCHAPPEN] om in 3 kernvoordelen. Geef per voordeel een kop van maximaal 5 woorden en één feitelijke uitlegzin.',['Drie scanbare voordelen','Resultaat plus reden','Beperkingen behouden']),
  bundles:content('Voordeelbundels','offer','Vergelijk hoeveelheid, inhoud en prijs op dezelfde basis.','Ontwerp 3 eerlijke bundels voor [PRODUCT]. Geef per bundel exacte inhoud, totaalprijs, prijs per stuk en alleen een feitelijke badge.',['Exacte inhoud','Zelfde vergelijkingsbasis','Selectie zichtbaar']),
  stock:content('Voorraadregel','offer','Gebruik alleen actuele, verifieerbare voorraadtekst.','Schrijf één voorraadregel voor [PRODUCT] op basis van [ACTUELE VOORRAAD]. Vermijd druk en schaarste als die niet echt is.',['Actuele bron','Geen nep-schaarste','Duidelijke status']),
  cta:content('Primaire koopknop','conversion','De knop zegt exact wat de volgende stap doet.','Schrijf 8 actieve CTA-knoppen van maximaal 4 woorden voor [PRODUCT]. Laat de tekst exact aansluiten op de volgende stap.',['Actief werkwoord','Eén actie','Uitkomst klopt']),
  trust:content('Verzending en garantie','trust','Noem alleen echte termijnen en voorwaarden.','Schrijf twee compacte trustregels voor [VERZENDING] en [GARANTIE]. Benoem echte termijn en belangrijkste voorwaarde.',['Echte termijn','Voorwaarde zichtbaar','Geen vaag keurmerk']),
  details:content('Productdetails','content','Beantwoord werking, garantie en verzending met brondata.','Schrijf vier korte productaccordions vanuit [PRODUCTDATA], [GARANTIE] en [VERZENDING]. Begin ieder antwoord met het kernfeit.',['Brondata gebruikt','Antwoord eerst','Geen verzonnen beleid']),
  'feature-heading':content('Voordelenverhaal','content','Introduceer het herkenbare probleem en de bewijsstructuur.','Schrijf een kop en intro voor drie bewijssecties van [PRODUCT]. Benoem het probleem zonder angsttaal.',['Probleem herkenbaar','Drie bewijsmomenten','Rustige toon']),
  'feature-01-copy':content('Voordeel 1','content','Bewijs het belangrijkste klantvoordeel.','Schrijf een kop, uitleg en 3 bewijsbullets voor het belangrijkste voordeel van [PRODUCT], gebaseerd op [PRODUCTEIGENSCHAP].',['Eén voordeel','Eigenschap als bewijs','Geen losse claim']),
  'feature-02-copy':content('Voordeel 2','content','Leg materiaal of mechanisme begrijpelijk uit.','Schrijf een kop, uitleg en 3 bewijsbullets over [MATERIAAL OF MECHANISME] van [PRODUCT].',['Gewone taal','Tastbaar detail','Geen jargonclaim']),
  'feature-03-copy':content('Voordeel 3','content','Plaats gebruiksgemak in een herkenbare context.','Schrijf een kop, uitleg en 3 bewijsbullets over dagelijks gebruik van [PRODUCT] in [CONTEXT].',['Echte context','Schaal duidelijk','Geloofwaardig resultaat']),
  'usp-strip':content('USP-balk','copy','Vat vier verschillende redenen samen.','Maak 4 USP-koppen met één bewijszin voor [PRODUCT]. Iedere USP behandelt een andere koopreden.',['Vier verschillende redenen','Bewijszin','Kort']),
  'steps-heading':content('Stappenintro','content','Beloof een eenvoudig proces zonder stappen over te slaan.','Schrijf een kop voor een proces van vier echte gebruiksstappen voor [PRODUCT].',['Volgorde klopt','Vier stappen','Geen resultaatclaim']),
  'steps-copy':content('Gebruiksstappen','content','Beschrijf per stap één zichtbare handeling.','Schrijf 4 genummerde gebruiksstappen voor [PRODUCT]. Geef per stap één werkwoordkop en één korte instructie uit [HANDLEIDING].',['Eén handeling per stap','Handleiding als bron','Veilige volgorde']),
  'reviews-summary':content('Reviewscore','social-proof','Gebruik een controleerbare score en reviewtelling.','Bereken gemiddelde score en aantal uit [ECHTE REVIEWS]. Rond transparant af en verzin niets.',['Controleerbare bron','Correct gemiddelde','Aantal zichtbaar']),
  'reviews-copy':content('Reviewteksten','social-proof','Behoud context en nuance van echte feedback.','Selecteer 6 representatieve reviews uit [ECHTE REVIEWS]. Behoud betekenis, anonimiseer persoonsgegevens en neem minstens één genuanceerde review op.',['Echte bron','Context zichtbaar','Ook nuance']),
  'expert-copy':content('Expertquote','social-proof','Gebruik alleen een echte, relevante expert met toestemming.','Redigeer [ECHTE EXPERTQUOTE] voor helderheid zonder de betekenis te veranderen. Voeg naam, functie en relevante expertise toe.',['Echte persoon','Toestemming','Geen gewijzigde claim']),
  guarantee:content('Garantieblok','trust','Leg termijn, proces en uitzonderingen direct uit.','Schrijf een garantieblok op basis van [ECHTE VOORWAARDEN]. Benoem termijn, aanvraagproces en uitzonderingen in gewone taal.',['Termijn klopt','Proces duidelijk','Uitzonderingen zichtbaar']),
  'faq-heading':content('FAQ-intro','content','Introduceer de laatste praktische bezwaren kort.','Schrijf een rustige FAQ-kop en één introzin voor [PRODUCT].',['Kort','Praktisch','Geen nieuwe claim']),
  'faq-copy':content('Veelgestelde vragen','content','Beantwoord echte klantvragen met het kernantwoord eerst.','Maak 5 FAQ’s uit [KLANTVRAGEN]. Begin ieder antwoord met het kernfeit en verzin geen beleid of productspecificaties.',['Gebaseerd op bron','Antwoord eerst','Geen herhaling']),
  'final-copy':content('Laatste productblok','conversion','Herhaal productnaam, bewijs en belangrijkste voordeel.','Schrijf het laatste koopblok voor [PRODUCT] met productnaam, echte reviewregel, één voordeelzin en een duidelijke bundel-CTA.',['Zelfde productnaam','Echte reviewdata','CTA klopt']),
  footer:content('Footer','brand','Vul merkbelofte, servicepagina’s en contactgegevens volledig in.','Schrijf een merkintro van maximaal 35 woorden en een complete footerlinklijst voor [MERK]. Gebruik alleen bestaande pagina’s en echte contactgegevens.',['Contact klopt','Links bestaan','Merkbelofte kort']),
};

const imageAnnotations = Object.fromEntries(imageSlots.map((slot) => [slot.id, {
  label: slot.label,
  type: `beeldbrief · ${slot.area}`,
  guidance: slot.brief,
  prompt: slot.prompt,
  checklist: [`Exact ${slot.ratio}`, `Onderwerp: ${slot.subject}`, `Verplicht: ${slot.mustInclude}`, `Vermijd: ${slot.avoid}`],
  shot: slot,
}]));

export function getAnnotations() {
  return { ...annotationBase, ...imageAnnotations };
}
