import App from "../../../src/App.jsx";
import { stores } from "../../../src/content/product.js";
import { getRequestOrigin } from "../../../src/request-origin.js";

export function generateStaticParams() {
  return Object.keys(stores).map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }) {
  await params;
  const config = (await searchParams) || {};
  const isSheCommerce = config.brand === "shecommerce";
  return {
    title: `Productpagina template · ${isSheCommerce ? "SheCommerce" : "Dropship Academy"}`,
    description:
      "Invulbare Wolkveld-productpagina met beeldbriefs en scrape-bare AI-prompts.",
  };
}

export default async function StoreTemplatePage({ params, searchParams }) {
  await params;
  return (
    <App
      initialConfig={(await searchParams) || {}}
      requestOrigin={await getRequestOrigin()}
    />
  );
}
