# Sử dụng Node.js Alpine nhẹ và bảo mật
FROM node:20-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file cấu hình và cài đặt dependencies (nếu có)
COPY package.json ./
# RUN npm install --production

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi chạy server
CMD ["node", "server.js"]

