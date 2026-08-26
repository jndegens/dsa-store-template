import '../src/styles.css';

export const metadata = {
  title: 'Store Library · Dropship Academy',
  description: 'Interactieve productpagina-templates met vierkante beeldbriefs en kopieerbare AI-prompts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
