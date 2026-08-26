import App from '../src/App.jsx';
import {getRequestOrigin} from '../src/request-origin.js';

export default async function Page({ searchParams }) {
  return <App initialConfig={(await searchParams) || {}} requestOrigin={await getRequestOrigin()} />;
}
