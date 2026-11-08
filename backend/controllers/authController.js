// backend/controllers/authController.js

const USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Kenji Phạm',
    role: 'admin',
    roleTitle: 'Quản trị viên · Bếp trưởng điều hành',
    avatar: 'KP',
    email: 'kenji.pham@nocturne.vn'
  },
  {
    username: 'letan',
    password: 'letan123',
    name: 'Mai Phương Thảo',
    role: 'reception',
    roleTitle: 'Lễ tân tầng 48 · Concierge',
    avatar: 'PT',
    email: 'thao.mai@nocturne.vn'
  }
];

exports.handleLogin = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const payload = JSON.parse(body || '{}');
      const username = payload.username;
      const password = payload.password;

      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: false, message: 'Vui lòng nhập tài khoản và mật khẩu' }));
      }

      const user = USERS.find(u => 
        (u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase()) && 
        u.password === password
      );

      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' }));
      }

      // Trả về thông tin người dùng an toàn (không gửi password)
      const userInfo = {
        username: user.username,
        name: user.name,
        role: user.role,
        roleTitle: user.roleTitle,
        avatar: user.avatar,
        email: user.email,
        token: 'tk_' + Buffer.from(user.username + ':' + Date.now()).toString('base64')
      };

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        message: 'Đăng nhập thành công',
        user: userInfo
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: 'Dữ liệu không hợp lệ', error: err.message }));
    }
  });
};

exports.handleGetAccounts = (req, res) => {
  // Cung cấp danh sách tài khoản demo cho môi trường dev/staging
  const demoAccounts = USERS.map(u => ({
    username: u.username,
    name: u.name,
    role: u.role,
    roleTitle: u.roleTitle,
    avatar: u.avatar
  }));

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ success: true, accounts: demoAccounts }));
};
