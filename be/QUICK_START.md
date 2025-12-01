# 🚀 Quick Start Guide

## Khởi động nhanh trong 5 phút

### 1. Cài đặt MongoDB (nếu chưa có)

**Windows:**
```bash
# Tải và cài đặt từ: https://www.mongodb.com/try/download/community
# Sau khi cài, MongoDB sẽ tự động chạy
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### 2. Cài đặt dependencies

```bash
cd be
npm install
```

### 3. Khởi tạo dữ liệu

```bash
npm run seed
```

Kết quả:
- ✅ Tạo 5 roles (Admin, Bác sĩ, Điều dưỡng trưởng, Y tá, Lễ tân)
- ✅ Tạo tài khoản admin (username: `admin`, password: `admin123`)
- ✅ Tạo 6 categories và 13 services mẫu

### 4. Khởi động server

```bash
npm run dev
```

Server chạy tại: `http://localhost:5000`

### 5. Test API

Mở Postman/Thunder Client và test:

```bash
POST http://localhost:5000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

✅ Nhận được token → Backend hoạt động!

## 🔗 Kết nối với Frontend

Trong frontend (fe/.env):
```env
REACT_APP_BASE_URL=http://localhost:5000
```

## 📚 Tài liệu

- **Hướng dẫn cài đặt chi tiết**: `SETUP_GUIDE.md`
- **Test API**: `API_TESTING.md`
- **API Documentation**: `README.md`

## ⚙️ Cấu hình nâng cao

File `.env` đã được tạo sẵn với cấu hình mặc định. Bạn có thể tùy chỉnh:

```env
PORT=5000                    # Port server
MONGODB_URI=mongodb://...    # MongoDB connection
JWT_SECRET=...              # Thay đổi trong production
EMAIL_USER=...              # Gmail cho forgot password
```

## 🎯 Điểm nổi bật

✅ **RESTful API** hoàn chỉnh với JWT authentication
✅ **MongoDB** với Mongoose ODM
✅ **Bcrypt** để mã hóa mật khẩu
✅ **Validation** và error handling
✅ **Email service** cho forgot password
✅ **Role-based access control**
✅ **Pagination** cho tất cả list APIs
✅ **Seed data** tự động

## 🔒 Bảo mật

⚠️ **Quan trọng:**
1. Đổi `JWT_SECRET` trong production
2. Đổi mật khẩu admin sau khi đăng nhập
3. Cấu hình CORS phù hợp
4. Sử dụng HTTPS trong production

## 📊 Cấu trúc Database

### Collections chính:
- `users` - Tài khoản người dùng
- `roles` - Phân quyền
- `patients` - Bệnh nhân
- `categories` - Danh mục dịch vụ
- `services` - Dịch vụ
- `materials` - Vật liệu
- `materialimports` - Phiếu nhập vật liệu
- `materialexports` - Phiếu xuất vật liệu
- `patientrecords` - Hồ sơ bệnh án
- `specimens` - Mẫu vật (labo)
- `labos` - Phòng labo
- `bills` - Hóa đơn
- `receipts` - Phiếu thu
- `waitingrooms` - Phòng chờ
- `timekeepings` - Chấm công
- `schedules` - Lịch hẹn
- `notifies` - Thông báo

## 🛠️ Commands

```bash
npm start       # Production mode
npm run dev     # Development mode (auto-reload)
npm run seed    # Khởi tạo dữ liệu mẫu
```

## 🐛 Troubleshooting

**MongoDB không kết nối được?**
```bash
# Kiểm tra MongoDB đang chạy
# Windows: net start MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongodb
```

**Port 5000 đã được sử dụng?**
- Thay đổi `PORT` trong `.env` thành port khác (ví dụ: 5001)

**Module not found?**
```bash
rm -rf node_modules
npm install
```

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. ✅ MongoDB đang chạy
2. ✅ Dependencies đã cài đặt
3. ✅ File `.env` đã cấu hình
4. ✅ Port chưa bị sử dụng

## 🎉 Hoàn thành!

Backend của bạn đã sẵn sàng! Giờ có thể:
- ✅ Khởi động frontend
- ✅ Test các tính năng
- ✅ Phát triển thêm features

**Happy coding! 🚀**
