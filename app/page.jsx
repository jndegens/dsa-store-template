import App from '../src/App.jsx';

export default async function Page({ searchParams }) {
  return <App initialConfig={(await searchParams) || {}} />;
}
