# API Testing Guide

Hướng dẫn test các API endpoints sử dụng Postman, Thunder Client hoặc curl.

## 1. Authentication

### Login
```bash
POST http://localhost:5000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullname": "Administrator",
    "email": "admin@dentalclinic.com",
    "username": "admin",
    "role_id": {
      "_id": "...",
      "name": "Admin"
    }
  }
}
```

**Lưu token để sử dụng cho các API khác!**

### Forgot Password
```bash
POST http://localhost:5000/api/forgot_password?username=admin
Content-Type: application/json
```

## 2. Users (yêu cầu authentication)

### Get List Users
```bash
GET http://localhost:5000/api/users/get_list_users?page=1&size=10
Authorization: Bearer YOUR_TOKEN
```

### Get User Profile
```bash
GET http://localhost:5000/api/users/get_profile
Authorization: Bearer YOUR_TOKEN
```

### Register New User
```bash
POST http://localhost:5000/api/users/register
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullname": "Nguyễn Văn A",
  "email": "doctor1@dentalclinic.com",
  "username": "doctor1",
  "password": "password123",
  "phone": "0987654321",
  "address": "Hà Nội",
  "gender": "Nam",
  "role_id": "ROLE_ID_HERE"
}
```

### Update User
```bash
PUT http://localhost:5000/api/users/USER_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullname": "Nguyễn Văn B",
  "phone": "0123456789"
}
```

### Change Password
```bash
PUT http://localhost:5000/api/users/change_password/USER_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}
```

## 3. Patients

### Get List Patients
```bash
GET http://localhost:5000/api/patients/get_list_patients?page=1&size=10&search=nguyen
Authorization: Bearer YOUR_TOKEN
```

### Add Patient
```bash
POST http://localhost:5000/api/patients/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullname": "Trần Thị B",
  "phone": "0912345678",
  "email": "patient1@example.com",
  "address": "Hà Nội",
  "birthday": "1990-01-01",
  "gender": "Nữ",
  "medical_history": "Không có tiền sử bệnh",
  "allergies": "Không"
}
```

### Get Patient By ID
```bash
GET http://localhost:5000/api/patients/PATIENT_ID
Authorization: Bearer YOUR_TOKEN
```

### Update Patient
```bash
PUT http://localhost:5000/api/patients/PATIENT_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "phone": "0999999999",
  "address": "TP.HCM"
}
```

## 4. Categories & Services

### Get List Services by Category
```bash
GET http://localhost:5000/api/categories/get_list_service
Authorization: Bearer YOUR_TOKEN
```

### Get All Services
```bash
GET http://localhost:5000/api/categories/get_all_service
Authorization: Bearer YOUR_TOKEN
```

### Add Category
```bash
POST http://localhost:5000/api/categories/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Nội nha",
  "description": "Các dịch vụ điều trị nội nha"
}
```

### Add Service
```bash
POST http://localhost:5000/api/categories/add_service
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Điều trị tủy răng",
  "description": "Điều trị viêm tủy răng",
  "price": 1500000,
  "category_id": "CATEGORY_ID",
  "duration": 90
}
```

## 5. Materials

### Get List Materials
```bash
GET http://localhost:5000/api/materials/get_list_materials?page=1&size=10
Authorization: Bearer YOUR_TOKEN
```

### Add Material
```bash
POST http://localhost:5000/api/materials/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Composite 3M",
  "description": "Vật liệu trám răng composite cao cấp",
  "unit": "Hộp",
  "quantity": 50,
  "min_quantity": 10,
  "price": 500000,
  "supplier": "3M Company"
}
```

## 6. Material Import

### Add Material Import
```bash
POST http://localhost:5000/api/material_imports/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "material_id": "MATERIAL_ID",
  "quantity": 20,
  "price": 500000,
  "supplier": "3M Company",
  "note": "Nhập hàng tháng 12",
  "import_date": "2024-12-01"
}
```

## 7. Patient Records

### Add Patient Record
```bash
POST http://localhost:5000/api/patient_record/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patient_id": "PATIENT_ID",
  "treatment_id": "TRT20241201001",
  "doctor_id": "DOCTOR_ID",
  "services": [
    {
      "service_id": "SERVICE_ID",
      "quantity": 1,
      "price": 250000,
      "tooth_number": "11",
      "status": "Đang điều trị"
    }
  ],
  "diagnosis": "Sâu răng số 11",
  "treatment_plan": "Trám răng composite",
  "visit_date": "2024-12-01",
  "next_visit": "2024-12-15"
}
```

### Get Records by Patient ID
```bash
GET http://localhost:5000/api/patient_record/get_list_record/PATIENT_ID
Authorization: Bearer YOUR_TOKEN
```

## 8. Specimens

### Add Specimen
```bash
POST http://localhost:5000/api/specimens/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "patient_id": "PATIENT_ID",
  "labo_id": "LABO_ID",
  "name": "Răng sứ",
  "type": "Crown",
  "description": "Bọc răng sứ số 11",
  "tooth_number": "11",
  "quantity": 1,
  "price": 3000000,
  "expected_date": "2024-12-15"
}
```

### Labo Receive Specimen
```bash
PUT http://localhost:5000/api/specimens/labo_receive
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "specimen_id": "SPECIMEN_ID"
}
```

## 9. Bills & Receipts

### Get List Bills
```bash
GET http://localhost:5000/api/bills/get_list_bills?page=1&size=10
Authorization: Bearer YOUR_TOKEN
```

### Add Receipt (Payment)
```bash
POST http://localhost:5000/api/receipts/
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "bill_id": "BILL_ID",
  "patient_id": "PATIENT_ID",
  "treatment_id": "TRT20241201001",
  "amount": 500000,
  "payment_method": "Tiền mặt",
  "note": "Thanh toán đợt 1"
}
```

## 10. Waiting Room

### Get Waiting List
```bash
GET http://localhost:5000/api/waiting_room/get-list-waiting
Authorization: Bearer YOUR_TOKEN
```

### Call Patient
```bash
PUT http://localhost:5000/api/waiting_room/call-patient/WAITING_ID
Authorization: Bearer YOUR_TOKEN
```

### Confirm Customer
```bash
PUT http://localhost:5000/api/waiting_room/confirm-customer/WAITING_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "doctor_id": "DOCTOR_ID"
}
```

## 11. Timekeeping

### Check In
```bash
POST http://localhost:5000/api/timekeeping/checkin
Authorization: Bearer YOUR_TOKEN
```

### Check Out
```bash
POST http://localhost:5000/api/timekeeping/checkout
Authorization: Bearer YOUR_TOKEN
```

### Get Timekeeping List
```bash
GET http://localhost:5000/api/timekeeping/get_list_timekeeping?page=1&size=10
Authorization: Bearer YOUR_TOKEN
```

## 12. Schedule

### Get List Schedule
```bash
GET http://localhost:5000/api/schedule/get_list_schedule
Authorization: Bearer YOUR_TOKEN
```

### Add Schedule
```bash
POST http://localhost:5000/api/schedule
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "user_id": "USER_ID",
  "patient_id": "PATIENT_ID",
  "title": "Khám định kỳ",
  "description": "Kiểm tra sau điều trị",
  "start_time": "2024-12-15T09:00:00",
  "end_time": "2024-12-15T10:00:00",
  "type": "Lịch khám",
  "location": "Phòng 1"
}
```

## 13. Income Reports

### Get Income
```bash
GET http://localhost:5000/api/income?startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer YOUR_TOKEN
```

### Get Net Income
```bash
GET http://localhost:5000/api/income/net_income?startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer YOUR_TOKEN
```

### Get Total Spend
```bash
GET http://localhost:5000/api/income/total_spend?startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer YOUR_TOKEN
```

## Lưu ý

1. **Authorization Header**: Tất cả các API (trừ login và forgot password) đều yêu cầu token:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

2. **Content-Type**: Luôn set header `Content-Type: application/json` khi gửi dữ liệu

3. **ID Parameters**: Thay thế `PATIENT_ID`, `USER_ID`, etc. bằng ID thực tế từ database

4. **Date Format**: Sử dụng ISO 8601 format: `YYYY-MM-DD` hoặc `YYYY-MM-DDTHH:mm:ss`

5. **Pagination**: Hầu hết các API list đều hỗ trợ pagination với `page` và `size` query parameters

## Error Responses

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 500 Internal Server Error
```json
{
  "message": "Lỗi server",
  "error": "Error details..."
}
```
