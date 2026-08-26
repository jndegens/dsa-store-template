import '../src/styles.css';

export const metadata = {
  title: 'Productpagina template · Dropship Academy',
  description: 'Invulbare Wolkveld-productpagina met beeldbriefs en kopieerbare AI-prompts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
