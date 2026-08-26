import '../src/styles.css';

export const metadata = {
  title: 'MORGENMAAK — Productpagina Template',
  description: 'Een interactieve voorbeeld-productpagina met uitlegbare conversieblokken en kopieerbare AI-prompts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
