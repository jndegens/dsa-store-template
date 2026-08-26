import App from '../../../src/App.jsx';
import { stores } from '../../../src/content/product.js';

export function generateStaticParams() {
  return Object.keys(stores).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const store = stores[slug] || stores.dieren;
  return {
    title: `${store.brand} · ${store.nicheLabel} producttemplate`,
    description: `${store.product.name}: klikbare oefenstore met 1:1-beeldbriefs en AI-prompts.`,
  };
}

export default async function StoreTemplatePage({ params }) {
  const { slug } = await params;
  return <App niche={slug} />;
}
