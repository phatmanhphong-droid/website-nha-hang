const http = require('http');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./backend/routes/apiRoutes');

const PORT = 3000;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = req.url.split('?')[0];

  // 1. Phân luồng BACKEND API (/api/...)
  if (reqUrl.startsWith('/api/')) {
    return apiRoutes.handleApiRequest(req, res, reqUrl);
  }

  // 2. Phân luồng FRONTEND TĨNH (thư mục ./frontend)
  let relativePath = reqUrl === '/' ? 'index.html' : reqUrl.replace(/^\//, '');
  let filePath = path.join(FRONTEND_DIR, relativePath);

  // An toàn đường dẫn chống path traversal
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>403 - Cấm truy cập</h1>');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Trang không tồn tại</h1><p><a href="/">Quay về trang chủ NOCTURNE</a></p>');
      } else {
        res.writeHead(500);
        res.end(`Lỗi máy chủ: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================`);
  console.log(` NOCTURNE Architecture: Frontend & Backend Separated `);
  console.log(` - Frontend root: http://localhost:${PORT}/ (from ./frontend)`);
  console.log(` - Backend API  : http://localhost:${PORT}/api/bookings`);
  console.log(`======================================================`);
});
