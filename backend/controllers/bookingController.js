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

// 1. Tạo đặt bàn mới từ phía khách hàng
exports.handleCreateBooking = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body);
      const bookings = getBookings();
      const guests = parseInt(payload.guests, 10) || 2;
      
      let tier = '12 Món Nếm Thử Tinh Hoa';
      if (guests >= 8 && guests < 16) {
        tier = '14 Món Thượng Hạng (The Obsidian Vault)';
      } else if (guests >= 16) {
        tier = '16 Món Hoàng Gia Bespoke (Penthouse Gala)';
      } else if (guests >= 4) {
        tier = '12 Món Nếm Thử Salon';
      }

      const newBooking = {
        id: 'BK-' + Date.now().toString().slice(-6),
        name: payload.name || 'Khách Vãng Lai',
        phone: payload.phone || '',
        email: payload.email || '',
        date: payload.date || new Date().toISOString().split('T')[0],
        time: payload.time || '19:30',
        guests: guests,
        tier: tier,
        space: payload.space || 'Bàn cửa sổ view thành phố',
        preference: payload.preference || 'Tiêu chuẩn Bếp trưởng',
        wine: payload.wine || 'Wine Pairing 6 ly chọn lọc',
        note: payload.note || '',
        deposit: guests * 500000,
        status: 'Chờ xác nhận',
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

// 2. Lấy danh sách tất cả đặt bàn cho Admin
exports.handleListBookings = (req, res) => {
  const bookings = getBookings();
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: true, total: bookings.length, data: bookings }));
};

// 3. Cập nhật trạng thái đặt bàn (Đã xác nhận, Đã nhận cọc, Đã hủy, Hoàn tất)
exports.handleUpdateStatus = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body);
      const { id, status } = payload;
      if (!id || !status) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: false, message: 'Thiếu id hoặc status' }));
      }

      const bookings = getBookings();
      const booking = bookings.find(b => b.id === id);
      if (!booking) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: false, message: 'Không tìm thấy đơn đặt bàn' }));
      }

      booking.status = status;
      booking.updatedAt = new Date().toISOString();
      saveBookings(bookings);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: 'Cập nhật trạng thái thành công', booking }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: 'Lỗi xử lý yêu cầu', error: err.message }));
    }
  });
};

// 4. Xóa đơn đặt bàn
exports.handleDeleteBooking = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { id } = JSON.parse(body);
      let bookings = getBookings();
      const initialLen = bookings.length;
      bookings = bookings.filter(b => b.id !== id);

      if (bookings.length === initialLen) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: false, message: 'Không tìm thấy đơn để xóa' }));
      }

      saveBookings(bookings);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: 'Đã xóa đơn đặt bàn thành công' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: 'Lỗi xóa đơn', error: err.message }));
    }
  });
};

// 5. Thống kê KPI cho trang Admin Dashboard
exports.handleGetStats = (req, res) => {
  const bookings = getBookings();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Chờ xác nhận' || b.status === 'Chờ xác nhận Concierge').length;
  const confirmedCount = bookings.filter(b => b.status === 'Đã xác nhận' || b.status === 'Đã nhận cọc').length;
  
  let todayGuests = 0;
  let totalDeposit = 0;
  let allergyCount = 0;

  bookings.forEach(b => {
    if (b.status !== 'Đã hủy') {
      totalDeposit += (b.deposit || 0);
      if (b.date === todayStr) {
        todayGuests += (b.guests || 0);
      }
      if (b.note && b.note.trim().length > 0) {
        allergyCount++;
      }
    }
  });

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({
    success: true,
    stats: {
      totalBookings,
      pendingCount,
      confirmedCount,
      todayGuests,
      maxCapacity: 24,
      totalDeposit,
      allergyCount
    }
  }));
};
