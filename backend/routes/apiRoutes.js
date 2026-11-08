// backend/routes/apiRoutes.js
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

exports.handleApiRequest = (req, res, reqUrl) => {
  // POST /api/auth/login -> đăng nhập xác thực
  if (reqUrl === '/api/auth/login' && req.method === 'POST') {
    return authController.handleLogin(req, res);
  }

  // GET /api/auth/accounts -> danh sách tài khoản demo
  if (reqUrl === '/api/auth/accounts' && req.method === 'GET') {
    return authController.handleGetAccounts(req, res);
  }

  // GET /api/health -> kiểm tra trạng thái backend
  if (reqUrl === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ status: 'OK', server: 'NOCTURNE Backend API v1.1', time: new Date() }));
  }

  // GET /api/stats -> thống kê KPI cho Admin Dashboard
  if (reqUrl === '/api/stats' && req.method === 'GET') {
    return bookingController.handleGetStats(req, res);
  }

  // GET /api/bookings -> danh sách đặt bàn
  if (reqUrl === '/api/bookings' && req.method === 'GET') {
    return bookingController.handleListBookings(req, res);
  }

  // POST /api/bookings -> tạo đặt bàn mới
  if (reqUrl === '/api/bookings' && req.method === 'POST') {
    return bookingController.handleCreateBooking(req, res);
  }

  // POST /api/bookings/status -> cập nhật trạng thái đơn (Xác nhận, Đã cọc, Hủy)
  if ((reqUrl === '/api/bookings/status' || reqUrl === '/api/bookings/update') && (req.method === 'POST' || req.method === 'PUT')) {
    return bookingController.handleUpdateStatus(req, res);
  }

  // POST /api/bookings/delete -> xóa đơn đặt bàn
  if (reqUrl === '/api/bookings/delete' && (req.method === 'POST' || req.method === 'DELETE')) {
    return bookingController.handleDeleteBooking(req, res);
  }

  // 404 cho API không tồn tại
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: false, message: 'API endpoint not found' }));
};
