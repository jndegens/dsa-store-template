import fs from 'node:fs';

const learning = JSON.parse(fs.readFileSync('public/learning.json', 'utf8'));
const app = fs.readFileSync('src/App.jsx', 'utf8');
const required = ['id', 'elementType', 'label', 'guidance', 'prompt', 'language', 'pageContext'];
const ids = new Set();
const failures = [];

for (const annotation of learning.annotations) {
  for (const field of required) {
    if (!annotation[field] || String(annotation[field]).trim() === '') failures.push(`${annotation.id || 'unknown'} mist ${field}`);
  }
  if (ids.has(annotation.id)) failures.push(`Dubbel ID: ${annotation.id}`);
  ids.add(annotation.id);
  if (!app.includes(`data-learn-id="${annotation.id}"`)) failures.push(`Geen target in App.jsx: ${annotation.id}`);
}

if (!learning.schemaVersion) failures.push('schemaVersion ontbreekt');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Leerlaag geldig: ${learning.annotations.length} unieke records met gekoppelde targets.`);
