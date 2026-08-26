import { mkdir, writeFile } from 'node:fs/promises';

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      url.pathname = "/index.html";
    }

    let response = await env.ASSETS.fetch(new Request(url, request));

    if (response.status === 404 && request.headers.get("accept")?.includes("text/html")) {
      url.pathname = "/index.html";
      response = await env.ASSETS.fetch(new Request(url, request));
    }

    return response;
  },
};
`;

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url), worker);
