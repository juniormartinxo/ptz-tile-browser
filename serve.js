// Servidor estatico opcional: node serve.js  -> http://localhost:8765
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.dzi': 'application/xml', '.xml': 'application/xml', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'max-age=3600' });
  fs.createReadStream(f).pipe(res);
}).listen(8765, () => console.log('http://localhost:8765'));
