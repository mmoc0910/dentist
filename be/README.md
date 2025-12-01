# Dental Clinic Management System - Backend

Backend API cho hệ thống quản lý phòng khám nha khoa.

## Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB với Mongoose
- JWT Authentication
- Bcrypt cho mã hóa password

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example` và cập nhật thông tin:
```bash
cp .env.example .env
```

3. Khởi động MongoDB (đảm bảo MongoDB đang chạy)

4. Chạy server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST `/api/login` - Đăng nhập
- POST `/api/forgot_password` - Quên mật khẩu

### Users
- GET `/api/users/get_list_users` - Lấy danh sách users
- GET `/api/users/:id` - Lấy thông tin user theo ID
- POST `/api/users/register` - Đăng ký user mới
- PUT `/api/users/:id` - Cập nhật user
- DELETE `/api/users/:id` - Xóa user
- GET `/api/users/get_profile` - Lấy thông tin profile
- PUT `/api/users/change_password/:id` - Đổi mật khẩu

### Patients
- GET `/api/patients/get_list_patients` - Lấy danh sách bệnh nhân
- GET `/api/patients/get_all_patients` - Lấy tất cả bệnh nhân
- GET `/api/patients/:id` - Lấy thông tin bệnh nhân
- POST `/api/patients/` - Thêm bệnh nhân
- PUT `/api/patients/:id` - Cập nhật bệnh nhân
- DELETE `/api/patients/:id` - Xóa bệnh nhân

### Roles
- GET `/api/roles/get_list_roles` - Lấy danh sách roles

### Categories & Services
- GET `/api/categories/get_list_service` - Lấy danh sách dịch vụ theo category
- GET `/api/categories/get_all_category_service` - Lấy tất cả category và service
- GET `/api/categories/get_all_service` - Lấy tất cả service
- GET `/api/categories/get_all_service_by_category_id/:id` - Lấy service theo category
- GET `/api/categories/get_detail_service/:id` - Chi tiết service
- POST `/api/categories/` - Thêm category
- POST `/api/categories/add_service` - Thêm service
- PUT `/api/categories/:id` - Cập nhật category
- PUT `/api/categories/update_service/:id` - Cập nhật service
- DELETE `/api/categories/:id` - Xóa category
- DELETE `/api/categories/delete_service/:id` - Xóa service

### Materials
- GET `/api/materials/get_list_materials` - Lấy danh sách vật liệu
- GET `/api/materials/get_all_material` - Lấy tất cả vật liệu
- GET `/api/materials/:id` - Chi tiết vật liệu
- POST `/api/materials/` - Thêm vật liệu
- PUT `/api/materials/:id` - Cập nhật vật liệu
- DELETE `/api/materials/:id` - Xóa vật liệu

### Material Imports
- GET `/api/material_imports/get_list_import` - Lấy danh sách nhập vật liệu
- GET `/api/material_imports/:id` - Chi tiết phiếu nhập
- POST `/api/material_imports/` - Thêm phiếu nhập
- POST `/api/material_imports/add_list_import/:id` - Thêm danh sách nhập
- PUT `/api/material_imports/:id` - Cập nhật phiếu nhập
- DELETE `/api/material_imports/:id` - Xóa phiếu nhập

### Material Exports
- GET `/api/material_export/get_list_export` - Lấy danh sách xuất vật liệu
- GET `/api/material_export/get_list_material_export_of_patient/:id` - Lấy vật liệu xuất của bệnh nhân
- GET `/api/material_export/:id` - Chi tiết phiếu xuất
- POST `/api/material_export/` - Thêm phiếu xuất
- PUT `/api/material_export/:id` - Cập nhật phiếu xuất
- DELETE `/api/material_export/:id` - Xóa phiếu xuất

### Patient Records
- GET `/api/patient_record/get_list_record/:id` - Lấy danh sách hồ sơ của bệnh nhân
- GET `/api/patient_record/get_all_record/:id` - Lấy tất cả hồ sơ theo treatment
- GET `/api/patient_record/:id` - Chi tiết hồ sơ
- POST `/api/patient_record/` - Thêm hồ sơ
- PUT `/api/patient_record/:id` - Cập nhật hồ sơ
- DELETE `/api/patient_record/:id` - Xóa hồ sơ

### Specimens
- GET `/api/specimens/get_list_speciemns` - Lấy danh sách mẫu vật
- GET `/api/specimens/get_list_specimens_of_patient/:id` - Lấy mẫu vật của bệnh nhân
- GET `/api/specimens/:id` - Chi tiết mẫu vật
- POST `/api/specimens/` - Thêm mẫu vật
- PUT `/api/specimens/:id` - Cập nhật mẫu vật
- PUT `/api/specimens/labo_receive` - Labo nhận mẫu
- PUT `/api/specimens/labo_delivery` - Labo giao mẫu
- PUT `/api/specimens/report_specimen/:id` - Báo cáo mẫu vật
- PUT `/api/specimens/use_specimen/:id` - Sử dụng mẫu vật
- DELETE `/api/specimens/:id` - Xóa mẫu vật

### Labos
- GET `/api/labos/get_list_labos` - Lấy danh sách labo
- GET `/api/labos/get_all_labo` - Lấy tất cả labo
- GET `/api/labos/:id` - Chi tiết labo
- GET `/api/labos/get_list_prepare/:id` - Lấy danh sách chuẩn bị của labo
- GET `/api/labos/get_list_receive/:id` - Lấy danh sách nhận của labo
- POST `/api/labos/` - Thêm labo
- PUT `/api/labos/:id` - Cập nhật labo
- DELETE `/api/labos/:id` - Xóa labo

### Bills & Receipts
- GET `/api/bills/get_list_bills` - Lấy danh sách hóa đơn
- GET `/api/bills/:id` - Chi tiết hóa đơn
- GET `/api/receipts/get_list_receipts_by_treatment/:id` - Lấy phiếu thu theo treatment
- GET `/api/receipts/new_receipts/:id` - Lấy phiếu thu mới
- POST `/api/receipts/` - Thêm phiếu thu

### Income
- GET `/api/income` - Lấy doanh thu
- GET `/api/income/net_income` - Lấy doanh thu ròng
- GET `/api/income/total_spend` - Lấy tổng chi tiêu

### Waiting Room
- GET `/api/waiting_room/get-list-waiting` - Lấy danh sách chờ
- GET `/api/waiting_room/get_list_confirm` - Lấy danh sách đã xác nhận
- PUT `/api/waiting_room/call-patient/:id` - Gọi bệnh nhân
- PUT `/api/waiting_room/confirm-customer/:id` - Xác nhận khách hàng
- DELETE `/api/waiting_room/:id` - Xóa khỏi danh sách chờ

### Timekeeping
- GET `/api/timekeeping/get_list_timekeeping` - Lấy danh sách chấm công
- POST `/api/timekeeping/checkin` - Check in
- POST `/api/timekeeping/checkout` - Check out

### Schedule
- GET `/api/schedule/get_list_schedule` - Lấy danh sách lịch
- GET `/api/schedule/:id` - Chi tiết lịch
- POST `/api/schedule` - Thêm lịch
- PUT `/api/schedule/:id` - Cập nhật lịch

### Notifies
- GET `/api/notifies/get_list_notify` - Lấy danh sách thông báo
- PUT `/api/notifies/read_notify/:id` - Đánh dấu đã đọc

## Database Schema

Xem chi tiết trong thư mục `/models`

## License

ISC
