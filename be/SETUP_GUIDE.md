# Hướng dẫn cài đặt Backend - Dental Clinic Management System

## Yêu cầu hệ thống

- Node.js v14 trở lên
- MongoDB v4.4 trở lên
- npm hoặc yarn

## Bước 1: Cài đặt MongoDB

### Windows:
1. Tải MongoDB từ: https://www.mongodb.com/try/download/community
2. Cài đặt MongoDB
3. Khởi động MongoDB service:
```bash
net start MongoDB
```

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Bước 2: Cài đặt Dependencies

Từ thư mục `be/`, chạy:

```bash
npm install
```

## Bước 3: Cấu hình môi trường

File `.env` đã được tạo sẵn. Bạn có thể sửa đổi các thông tin sau:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dental_clinic
JWT_SECRET=dental_clinic_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d

# Email configuration (tùy chọn - cho tính năng quên mật khẩu)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=noreply@dentalclinic.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Cấu hình Email (Gmail):

1. Bật xác thực 2 bước trong tài khoản Gmail
2. Tạo App Password:
   - Vào https://myaccount.google.com/apppasswords
   - Chọn "Mail" và "Other"
   - Sao chép mật khẩu và dán vào `EMAIL_PASSWORD`

## Bước 4: Khởi tạo dữ liệu mẫu

Chạy script để tạo roles, admin user và dữ liệu mẫu:

```bash
npm run seed
# hoặc
node scripts/seedData.js
```

Sau khi chạy xong, bạn sẽ có:
- **Roles**: Admin, Bác sĩ, Điều dưỡng trưởng, Y tá, Lễ tân
- **Admin user**: 
  - Username: `admin`
  - Password: `admin123`
- **Categories và Services**: Dữ liệu mẫu về các dịch vụ nha khoa

## Bước 5: Khởi động server

### Development mode (với auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## Bước 6: Kiểm tra kết nối

Mở browser hoặc dùng Postman/Thunder Client để test:

```
GET http://localhost:5000/health
```

Kết quả mong đợi:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Bước 7: Test API Login

```bash
POST http://localhost:5000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Bạn sẽ nhận được token để sử dụng cho các API khác.

## Cấu trúc thư mục

```
be/
├── controllers/      # Business logic
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Authentication, validation
├── utils/           # Helper functions
├── scripts/         # Utility scripts (seed data, etc.)
├── server.js        # Entry point
├── package.json     # Dependencies
└── .env            # Environment variables
```

## API Documentation

Tất cả các API endpoints được mô tả chi tiết trong file `README.md`

## Lưu ý bảo mật

1. **Đổi JWT_SECRET**: Trong production, hãy thay đổi `JWT_SECRET` thành một chuỗi ngẫu nhiên phức tạp
2. **Đổi mật khẩu admin**: Sau khi đăng nhập lần đầu, hãy đổi mật khẩu admin
3. **HTTPS**: Trong production, sử dụng HTTPS
4. **CORS**: Cấu hình CORS phù hợp với domain frontend của bạn

## Troubleshooting

### Lỗi kết nối MongoDB:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Giải pháp**: Đảm bảo MongoDB đang chạy:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Lỗi port đã được sử dụng:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Giải pháp**: Thay đổi `PORT` trong file `.env` hoặc dừng tiến trình đang sử dụng port 5000

### Module not found:
```
Error: Cannot find module 'xxx'
```
**Giải pháp**: Chạy lại `npm install`

## Scripts có sẵn

```bash
npm start          # Khởi động server (production)
npm run dev        # Khởi động server với nodemon (development)
npm run seed       # Khởi tạo dữ liệu mẫu
```

## Kết nối với Frontend

Trong frontend, cấu hình `.env`:
```
REACT_APP_BASE_URL=http://localhost:5000
```

## Hỗ trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. MongoDB đang chạy
2. Dependencies đã được cài đặt đầy đủ
3. File .env đã được cấu hình đúng
4. Port 5000 chưa được sử dụng

## License

ISC
