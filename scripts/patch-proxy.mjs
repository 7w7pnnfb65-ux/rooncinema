import fs from 'node:fs';

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const oldUrl = 'https://room-cinema-tmdb.792p2wkgrc.workers.dev';
const newUrl = '/.netlify/functions/tmdb';

if (html.includes(oldUrl)) {
  html = html.replaceAll(oldUrl, newUrl);
  fs.writeFileSync(file, html);
  console.log(`TMDB proxy patched: ${oldUrl} -> ${newUrl}`);
} else {
  console.log('TMDB proxy URL not found; leaving index.html unchanged.');
}
