// backend/routes/apiRoutes.js
const bookingController = require('../controllers/bookingController');

exports.handleApiRequest = (req, res, reqUrl) => {
  // GET /api/bookings -> danh sách đặt bàn
  if (reqUrl === '/api/bookings' && req.method === 'GET') {
    return bookingController.handleListBookings(req, res);
  }

  // POST /api/bookings -> tạo đặt bàn mới
  if (reqUrl === '/api/bookings' && req.method === 'POST') {
    return bookingController.handleCreateBooking(req, res);
  }

  // GET /api/health -> kiểm tra trạng thái backend
  if (reqUrl === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ status: 'OK', server: 'NOCTURNE Backend API v1.0', time: new Date() }));
  }

  // 404 cho API không tồn tại
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: false, message: 'API endpoint not found' }));
};

