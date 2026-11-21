/**
 * Servidor estático de produção do OBSERVA.
 *
 * - Serve o build do Vite (`dist/`) em 0.0.0.0:$PORT.
 * - Faz fallback para index.html nas rotas do SPA (React Router).
 * - Não expõe nenhuma API, chave ou integração: esta entrega é somente frontend
 *   com dados fictícios embutidos no bundle.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

/** Resolve um caminho de URL para um arquivo dentro de ROOT, bloqueando traversal. */
function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const candidate = normalize(join(ROOT, decoded));
  if (candidate !== ROOT && !candidate.startsWith(ROOT + sep)) return null;
  return candidate;
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile() ? info : null;
  } catch {
    return null;
  }
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body === undefined) res.end();
  else res.end(body);
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { 'content-type': 'text/plain; charset=utf-8', allow: 'GET, HEAD' }, 'Método não permitido');
    return;
  }

  const urlPath = req.url || '/';
  let filePath = safePath(urlPath);

  if (!filePath) {
    send(res, 400, { 'content-type': 'text/plain; charset=utf-8' }, 'Requisição inválida');
    return;
  }

  let info = await fileExists(filePath);
  if (!info && !extname(filePath)) {
    filePath = join(ROOT, 'index.html');
    info = await fileExists(filePath);
  }

  if (!info) {
    send(res, 404, { 'content-type': 'text/plain; charset=utf-8' }, 'Não encontrado');
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const isHtml = ext === '.html';
  const isHashedAsset = /-[A-Za-z0-9_]{8,}\.(js|css|woff2?)$/.test(filePath);
  const headers = {
    'content-type': MIME[ext] || 'application/octet-stream',
    'content-length': String(info.size),
    'cache-control': isHtml
      ? 'no-cache'
      : isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'SAMEORIGIN',
  };

  if (req.method === 'HEAD') {
    send(res, 200, headers);
    return;
  }

  res.writeHead(200, headers);
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`OBSERVA disponível em http://${HOST}:${PORT} (dist: ${ROOT})`);
});
