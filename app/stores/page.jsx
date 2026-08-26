import App from '../../src/App.jsx';

export const metadata = {
  title: 'Productpagina template · Dropship Academy',
  description: 'Invulbare Wolkveld-productpagina met beeldbriefs en scrape-bare AI-prompts.',
};

export default async function StoresPage({ searchParams }) {
  return <App initialConfig={(await searchParams) || {}} />;
}
