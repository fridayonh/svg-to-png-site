import http from 'node:http';
import https from 'node:https';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;
const port = Number(process.env.PORT || 6006);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// ---- Favicon proxy: fetches remote icons server-side to bypass CORS ----
function proxyFavicon(targetUrl, res) {
  const transport = targetUrl.startsWith('https') ? https : http;
  const req = transport.get(targetUrl, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (proxyRes) => {
    // Follow redirects (up to 3 hops)
    if ([301, 302, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
      const redirectUrl = new URL(proxyRes.headers.location, targetUrl).toString();
      proxyFavicon(redirectUrl, res);
      return;
    }
    const contentType = proxyRes.headers['content-type'] || '';
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    });
    proxyRes.pipe(res);
  });
  req.on('timeout', () => { req.destroy(); res.writeHead(504); res.end('Gateway Timeout'); });
  req.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Proxy error: ${err.message}`);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Favicon proxy route
    if (url.pathname === '/proxy/favicon' && url.searchParams.has('url')) {
      const target = url.searchParams.get('url');
      if (!/^https?:\/\/.+/.test(target)) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Invalid URL');
        return;
      }
      proxyFavicon(target, res);
      return;
    }

    let filePath = path.join(root, decodeURIComponent(url.pathname));
    const fileStat = await stat(filePath).catch(() => null);

    if (!fileStat || fileStat.isDirectory()) {
      filePath = path.join(root, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const data = await readFile(filePath);

    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`SVG to PNG site running at http://0.0.0.0:${port}`);
});
