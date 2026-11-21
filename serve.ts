// serve.ts — a tiny static server for game/ (Node 22, standard library
// only), a development convenience for play-testing: `node serve.ts`
// serves game/ on http://localhost:8080. It sends the MIME types a browser
// game needs and refuses any path outside game/.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const requested = portIndex === -1 ? 8080 : Number(args[portIndex + 1]);
const port = Number.isInteger(requested) && requested > 0 && requested < 65536 ? requested : 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

createServer((request, response) => {
  const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0]);
  const filePath = resolve(join(root, normalize(urlPath).replace(/^(\.\.[/\\])+/, '')));
  if (!filePath.startsWith(root + sep) && filePath !== root) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  const target = filePath === root ? join(root, 'index.html') : filePath;
  try {
    const stat = statSync(target);
    if (!stat.isFile()) throw new Error('not a file');
    response.writeHead(200, { 'content-type': MIME[extname(target)] ?? 'application/octet-stream' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404); response.end('Not found');
  }
}).listen(port, () => console.log(`Twin Worlds at http://localhost:${port}`));
