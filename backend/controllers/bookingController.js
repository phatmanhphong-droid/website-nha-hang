// backend/controllers/bookingController.js
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'bookings.json');

function getBookings() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading bookings:', err);
    return [];
  }
}

function saveBookings(bookings) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(bookings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving bookings:', err);
    return false;
  }
}

exports.handleCreateBooking = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body);
      const bookings = getBookings();
      
      const newBooking = {
        id: 'BK-' + Date.now().toString().slice(-6),
        name: payload.name || 'Khách Vãng Lai',
        phone: payload.phone || '',
        email: payload.email || '',
        date: payload.date || '',
        time: payload.time || '',
        guests: parseInt(payload.guests, 10) || 2,
        space: payload.space || 'Bàn cửa sổ view thành phố',
        preference: payload.preference || 'Tiêu chuẩn Bếp trưởng',
        wine: payload.wine || 'Wine Pairing 6 ly chọn lọc',
        note: payload.note || '',
        deposit: (parseInt(payload.guests, 10) || 2) * 500000,
        status: 'Chờ xác nhận Concierge',
        createdAt: new Date().toISOString()
      };

      bookings.unshift(newBooking);
      saveBookings(bookings);

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        message: 'Ghi nhận đặt bàn thành công! Concierge sẽ gọi xác nhận trong 30 phút.',
        booking: newBooking
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: 'Dữ liệu không hợp lệ', error: err.message }));
    }
  });
};

exports.handleListBookings = (req, res) => {
  const bookings = getBookings();
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: true, total: bookings.length, data: bookings }));
};

