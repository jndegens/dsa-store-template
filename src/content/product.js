// One canonical, product-neutral configuration drives the visible template,
// hidden semantic learning layer and every public route manifest.
const imageSlot = (id, area, label, brief, ratio, mobileRatio = ratio) => ({
  id, shotId: id, area, label, title: label, brief, direction: brief, ratio,
  mobileRatio,
  resolution: ratio === '1:1' ? '1600 × 1600' : '1600 × 1200',
  subject: '[JOUW PRODUCT] in de beschreven situatie',
  composition: brief,
  background: 'Rustige achtergrond passend bij jouw merkstijl',
  lighting: 'Natuurlijk, zacht en geloofwaardig licht',
  mustInclude: 'Het echte product, correct van vorm, kleur en schaal',
  avoid: 'Tekst in beeld, watermerken, verzonnen onderdelen en misleidende resultaten',
  alt: `${label}: ${brief}`,
  prompt: `Maak een fotorealistische productfoto voor [MERK] [PRODUCT]. Slot: ${label}. Doel: ${brief}. Formaat exact ${ratio}${mobileRatio !== ratio ? ` op desktop en ${mobileRatio} op mobiel` : ''}. Toon het echte product correct van vorm, kleur en schaal. Gebruik een rustige merkpassende achtergrond en natuurlijk zacht licht. Geen tekst, watermerk, verzonnen onderdelen of misleidende resultaten.`,
});

export const imageSlots = [
  imageSlot('gallery-hero','gallery','Hoofdfoto','Vrijstaand product · compleet zichtbaar','1:1'),
  imageSlot('gallery-use','gallery','In gebruik','Product met gebruiker · schaal duidelijk','1:1'),
  imageSlot('gallery-close','gallery','Detailfoto','Close-up · materiaal en afwerking','1:1'),
  imageSlot('gallery-features','gallery','Kenmerken','Belangrijkste functies in één beeld','1:1'),
  imageSlot('gallery-box','gallery','In de doos','Exacte inhoud · geen extra accessoires','1:1'),
  imageSlot('feature-01','features','Productfoto 1','Lifestyle productfoto · product in gebruik · resultaat zichtbaar','4:3'),
  imageSlot('feature-02','features','Productfoto 2','Detailfoto · eigenschap en mechanisme · tastbare kwaliteit','4:3'),
  imageSlot('feature-03','features','Productfoto 3','Contextfoto · realistische omgeving · schaal en gemak','4:3'),
  imageSlot('step-01','steps','Stapfoto 01','Unboxing · product en verpakking','1:1'),
  imageSlot('step-02','steps','Stapfoto 02','Voorbereiding · één duidelijke handeling','1:1'),
  imageSlot('step-03','steps','Stapfoto 03','Product in gebruik · kernmoment','1:1'),
  imageSlot('step-04','steps','Stapfoto 04','Resultaatbeeld · geloofwaardig eindmoment','1:1'),
  imageSlot('review-01','reviews','Reviewfoto 01','Klant met product · mobiele UGC-look','4:3'),
  imageSlot('review-02','reviews','Reviewfoto 02','Product thuis · imperfect en geloofwaardig','4:3'),
  imageSlot('review-03','reviews','Reviewfoto 03','Close-up resultaat · natuurlijk licht','4:3'),
  imageSlot('expert-photo','reviews','Expertfoto','Echte portretfoto · neutrale achtergrond','1:1'),
  imageSlot('faq-photo','faq','FAQ-productfoto','Product in rustige context · herkenbare schaal','1:1','4:3'),
  imageSlot('final-thumbnail','final','Productthumbnail','Vrijstaand product · frontaal','1:1'),
];

export const stores = Object.fromEntries(['dieren','beauty','gadgets'].map((slug) => [slug, {
  slug,
  nicheLabel: 'Generieke producttemplate',
  brand: '[JOUW MERKNAAM]',
  product: { name: '[JOUW PRODUCTNAAM]', media: imageSlots },
}]));
