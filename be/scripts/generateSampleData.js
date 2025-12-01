require('dotenv').config();
const mongoose = require('mongoose');
const moment = require('moment');

// Import models
const Role = require('../models/role.model');
const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const Category = require('../models/category.model');
const Service = require('../models/service.model');
const Material = require('../models/material.model');
const MaterialImport = require('../models/materialImport.model');
const MaterialExport = require('../models/materialExport.model');
const Labo = require('../models/labo.model');
const PatientRecord = require('../models/patientRecord.model');
const Specimen = require('../models/specimen.model');
const Bill = require('../models/bill.model');
const Receipt = require('../models/receipt.model');
const WaitingRoom = require('../models/waitingRoom.model');
const Timekeeping = require('../models/timekeeping.model');
const Schedule = require('../models/schedule.model');
const Notify = require('../models/notify.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dental_clinic';

// Sample data arrays
const vietnameseFirstNames = {
  male: ['Văn', 'Đức', 'Minh', 'Hoàng', 'Tuấn', 'Hùng', 'Thành', 'Quang', 'Dũng', 'Khoa'],
  female: ['Thị', 'Thu', 'Mai', 'Hương', 'Lan', 'Linh', 'Ngọc', 'Hà', 'Anh', 'Chi']
};

const vietnameseLastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];

const vietnameseMiddleNames = ['Văn', 'Thị', 'Minh', 'Hoàng', 'Đức', 'Anh', 'Thanh', 'Kim', 'Hồng', 'Quốc'];

const addresses = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Biên Hòa', 'Nha Trang', 'Huế', 'Vũng Tàu', 'Thủ Đức'
];

const medicalHistories = [
  'Không có tiền sử bệnh',
  'Tiểu đường type 2',
  'Huyết áp cao',
  'Dị ứng penicillin',
  'Hen suyễn',
  'Viêm gan B',
  'Tim mạch',
  'Loãng xương'
];

const allergies = [
  'Không có',
  'Dị ứng penicillin',
  'Dị ứng thuốc tê',
  'Dị ứng ibuprofen',
  'Dị ứng latex'
];

// Helper functions
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateVietnameseName(gender) {
  const lastName = randomElement(vietnameseLastNames);
  const middleName = randomElement(vietnameseMiddleNames);
  const firstName = randomElement(vietnameseFirstNames[gender]);
  return `${lastName} ${middleName} ${firstName}`;
}

function generatePhone() {
  const prefixes = ['090', '091', '093', '094', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
  return randomElement(prefixes) + randomNumber(1000000, 9999999);
}

function generateEmail(name) {
  const normalized = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
  return `${normalized}${randomNumber(1, 999)}@example.com`;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Main generation function
const generateSampleData = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (optional)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({ email: { $ne: 'admin@dentalclinic.com' } }),
      Patient.deleteMany({}),
      Material.deleteMany({}),
      MaterialImport.deleteMany({}),
      MaterialExport.deleteMany({}),
      Labo.deleteMany({}),
      PatientRecord.deleteMany({}),
      Specimen.deleteMany({}),
      Bill.deleteMany({}),
      Receipt.deleteMany({}),
      WaitingRoom.deleteMany({}),
      Timekeeping.deleteMany({}),
      Schedule.deleteMany({}),
      Notify.deleteMany({})
    ]);
    console.log('✅ Cleared existing sample data\n');

    // Get or create roles
    console.log('📋 Setting up roles...');
    const roles = await setupRoles();
    console.log('✅ Roles ready\n');

    // Get or create categories and services
    console.log('🏥 Setting up categories and services...');
    const { categories, services } = await setupCategoriesAndServices();
    console.log('✅ Categories and services ready\n');

    // Create users
    console.log('👥 Creating users...');
    const users = await createUsers(roles);
    console.log(`✅ Created ${users.length} users\n`);

    // Create patients
    console.log('🤒 Creating patients...');
    const patients = await createPatients();
    console.log(`✅ Created ${patients.length} patients\n`);

    // Create materials
    console.log('💊 Creating materials...');
    const materials = await createMaterials();
    console.log(`✅ Created ${materials.length} materials\n`);

    // Create material imports
    console.log('📥 Creating material imports...');
    const imports = await createMaterialImports(materials, users);
    console.log(`✅ Created ${imports.length} material imports\n`);

    // Create labos
    console.log('🔬 Creating labos...');
    const labos = await createLabos();
    console.log(`✅ Created ${labos.length} labos\n`);

    // Create patient records
    console.log('📝 Creating patient records...');
    const records = await createPatientRecords(patients, users, services);
    console.log(`✅ Created ${records.length} patient records\n`);

    // Create material exports
    console.log('📤 Creating material exports...');
    const exports = await createMaterialExports(materials, patients, records, users);
    console.log(`✅ Created ${exports.length} material exports\n`);

    // Create specimens
    console.log('🧪 Creating specimens...');
    const specimens = await createSpecimens(patients, labos, records, users);
    console.log(`✅ Created ${specimens.length} specimens\n`);

    // Create bills and receipts
    console.log('💰 Creating bills and receipts...');
    const { bills, receipts } = await createBillsAndReceipts(records, patients, users);
    console.log(`✅ Created ${bills.length} bills and ${receipts.length} receipts\n`);

    // Create waiting room entries
    console.log('⏰ Creating waiting room entries...');
    const waitingList = await createWaitingRoom(patients, users);
    console.log(`✅ Created ${waitingList.length} waiting room entries\n`);

    // Create timekeeping
    console.log('⏱️  Creating timekeeping records...');
    const timekeeping = await createTimekeeping(users);
    console.log(`✅ Created ${timekeeping.length} timekeeping records\n`);

    // Create schedules
    console.log('📅 Creating schedules...');
    const schedules = await createSchedules(users, patients);
    console.log(`✅ Created ${schedules.length} schedules\n`);

    // Create notifications
    console.log('🔔 Creating notifications...');
    const notifications = await createNotifications(users);
    console.log(`✅ Created ${notifications.length} notifications\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 Sample data generation completed successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Patients: ${patients.length}`);
    console.log(`   Materials: ${materials.length}`);
    console.log(`   Material Imports: ${imports.length}`);
    console.log(`   Material Exports: ${exports.length}`);
    console.log(`   Labos: ${labos.length}`);
    console.log(`   Patient Records: ${records.length}`);
    console.log(`   Specimens: ${specimens.length}`);
    console.log(`   Bills: ${bills.length}`);
    console.log(`   Receipts: ${receipts.length}`);
    console.log(`   Waiting Room: ${waitingList.length}`);
    console.log(`   Timekeeping: ${timekeeping.length}`);
    console.log(`   Schedules: ${schedules.length}`);
    console.log(`   Notifications: ${notifications.length}`);
    console.log('\n🔐 Login credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Doctors: doctor1-doctor5 / password123');
    console.log('   Nurses: nurse1-nurse3 / password123');
    console.log('   Receptionists: receptionist1-receptionist2 / password123');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating sample data:', error);
    process.exit(1);
  }
};

// Setup roles
async function setupRoles() {
  const rolesData = [
    { name: 'Admin', description: 'Quản trị viên hệ thống' },
    { name: 'Bác sĩ', description: 'Bác sĩ nha khoa' },
    { name: 'Điều dưỡng trưởng', description: 'Điều dưỡng trưởng' },
    { name: 'Y tá', description: 'Y tá' },
    { name: 'Lễ tân', description: 'Nhân viên lễ tân' }
  ];

  const roles = {};
  for (const roleData of rolesData) {
    let role = await Role.findOne({ name: roleData.name });
    if (!role) {
      role = await Role.create(roleData);
    }
    roles[roleData.name] = role;
  }

  return roles;
}

// Setup categories and services
async function setupCategoriesAndServices() {
  const categoriesData = [
    { name: 'Khám và tư vấn', description: 'Các dịch vụ khám và tư vấn nha khoa' },
    { name: 'Điều trị răng', description: 'Các dịch vụ điều trị răng' },
    { name: 'Nha chu', description: 'Điều trị bệnh lý nha chu' },
    { name: 'Chỉnh nha', description: 'Niềng răng và chỉnh nha' },
    { name: 'Phục hồi răng', description: 'Bọc răng sứ, cấy ghép implant' },
    { name: 'Nha khoa thẩm mỹ', description: 'Các dịch vụ làm đẹp răng' }
  ];

  const categories = {};
  for (const catData of categoriesData) {
    let category = await Category.findOne({ name: catData.name });
    if (!category) {
      category = await Category.create(catData);
    }
    categories[catData.name] = category;
  }

  const servicesData = [
    { name: 'Khám tổng quát', category: 'Khám và tư vấn', price: 100000, duration: 30 },
    { name: 'Tư vấn chỉnh nha', category: 'Khám và tư vấn', price: 200000, duration: 45 },
    { name: 'Chụp X-quang răng', category: 'Khám và tư vấn', price: 150000, duration: 15 },
    { name: 'Nhổ răng thường', category: 'Điều trị răng', price: 300000, duration: 30 },
    { name: 'Nhổ răng khôn', category: 'Điều trị răng', price: 800000, duration: 60 },
    { name: 'Trám răng composite', category: 'Điều trị răng', price: 250000, duration: 45 },
    { name: 'Trám răng amalgam', category: 'Điều trị răng', price: 150000, duration: 30 },
    { name: 'Điều trị tủy răng', category: 'Điều trị răng', price: 1500000, duration: 90 },
    { name: 'Lấy cao răng', category: 'Nha chu', price: 300000, duration: 30 },
    { name: 'Cạo vôi răng', category: 'Nha chu', price: 500000, duration: 45 },
    { name: 'Điều trị viêm nướu', category: 'Nha chu', price: 800000, duration: 60 },
    { name: 'Niềng răng mắc cài kim loại', category: 'Chỉnh nha', price: 30000000, duration: 60 },
    { name: 'Niềng răng mắc cài sứ', category: 'Chỉnh nha', price: 40000000, duration: 60 },
    { name: 'Niềng răng trong suốt', category: 'Chỉnh nha', price: 50000000, duration: 60 },
    { name: 'Bọc răng sứ Titan', category: 'Phục hồi răng', price: 2000000, duration: 120 },
    { name: 'Bọc răng sứ Zirconia', category: 'Phục hồi răng', price: 3000000, duration: 120 },
    { name: 'Cấy ghép Implant', category: 'Phục hồi răng', price: 15000000, duration: 120 },
    { name: 'Làm cầu răng', category: 'Phục hồi răng', price: 5000000, duration: 150 },
    { name: 'Hàm tháo lắp', category: 'Phục hồi răng', price: 8000000, duration: 90 },
    { name: 'Tẩy trắng răng', category: 'Nha khoa thẩm mỹ', price: 2000000, duration: 90 },
    { name: 'Dán sứ Veneer', category: 'Nha khoa thẩm mỹ', price: 5000000, duration: 120 }
  ];

  const services = [];
  for (const serviceData of servicesData) {
    const categoryId = categories[serviceData.category]._id;
    let service = await Service.findOne({ name: serviceData.name, category_id: categoryId });
    if (!service) {
      service = await Service.create({
        name: serviceData.name,
        category_id: categoryId,
        price: serviceData.price,
        duration: serviceData.duration,
        description: `Dịch vụ ${serviceData.name.toLowerCase()}`
      });
    }
    services.push(service);
  }

  return { categories, services };
}

// Create users
async function createUsers(roles) {
  const users = [];

  // Ensure admin exists
  let admin = await User.findOne({ email: 'admin@dentalclinic.com' });
  if (!admin) {
    admin = await User.create({
      fullname: 'Administrator',
      email: 'admin@dentalclinic.com',
      username: 'admin',
      password: 'admin123',
      phone: '0123456789',
      address: 'Hà Nội',
      gender: 'Khác',
      role_id: roles['Admin']._id
    });
  }
  users.push(admin);

  // Create doctors
  for (let i = 1; i <= 5; i++) {
    const gender = i % 2 === 0 ? 'Nam' : 'Nữ';
    const fullname = generateVietnameseName(gender === 'Nam' ? 'male' : 'female');
    const user = await User.create({
      fullname: `BS. ${fullname}`,
      email: `doctor${i}@dentalclinic.com`,
      username: `doctor${i}`,
      password: 'password123',
      phone: generatePhone(),
      address: randomElement(addresses),
      birthday: randomDate(new Date(1975, 0, 1), new Date(1990, 11, 31)),
      gender: gender,
      role_id: roles['Bác sĩ']._id
    });
    users.push(user);
  }

  // Create head nurse
  const headNurse = await User.create({
    fullname: generateVietnameseName('female'),
    email: 'headnurse@dentalclinic.com',
    username: 'headnurse',
    password: 'password123',
    phone: generatePhone(),
    address: randomElement(addresses),
    birthday: randomDate(new Date(1980, 0, 1), new Date(1992, 11, 31)),
    gender: 'Nữ',
    role_id: roles['Điều dưỡng trưởng']._id
  });
  users.push(headNurse);

  // Create nurses
  for (let i = 1; i <= 3; i++) {
    const fullname = generateVietnameseName('female');
    const user = await User.create({
      fullname: fullname,
      email: `nurse${i}@dentalclinic.com`,
      username: `nurse${i}`,
      password: 'password123',
      phone: generatePhone(),
      address: randomElement(addresses),
      birthday: randomDate(new Date(1990, 0, 1), new Date(1998, 11, 31)),
      gender: 'Nữ',
      role_id: roles['Y tá']._id
    });
    users.push(user);
  }

  // Create receptionists
  for (let i = 1; i <= 2; i++) {
    const gender = i === 1 ? 'Nữ' : 'Nam';
    const fullname = generateVietnameseName(gender === 'Nam' ? 'male' : 'female');
    const user = await User.create({
      fullname: fullname,
      email: `receptionist${i}@dentalclinic.com`,
      username: `receptionist${i}`,
      password: 'password123',
      phone: generatePhone(),
      address: randomElement(addresses),
      birthday: randomDate(new Date(1995, 0, 1), new Date(2000, 11, 31)),
      gender: gender,
      role_id: roles['Lễ tân']._id
    });
    users.push(user);
  }

  return users;
}

// Create patients
async function createPatients() {
  const patients = [];
  
  for (let i = 0; i < 50; i++) {
    const gender = i % 2 === 0 ? 'Nam' : 'Nữ';
    const fullname = generateVietnameseName(gender === 'Nam' ? 'male' : 'female');
    const phone = generatePhone();
    
    const patient = await Patient.create({
      fullname: fullname,
      phone: phone,
      email: Math.random() > 0.3 ? generateEmail(fullname) : undefined,
      address: randomElement(addresses),
      birthday: randomDate(new Date(1950, 0, 1), new Date(2010, 11, 31)),
      gender: gender,
      identity_card: Math.random() > 0.5 ? `0${randomNumber(10000000, 99999999)}` : undefined,
      medical_history: randomElement(medicalHistories),
      allergies: randomElement(allergies),
      note: Math.random() > 0.7 ? 'Bệnh nhân thân thiết' : undefined
    });
    
    patients.push(patient);
  }

  return patients;
}

// Create materials
async function createMaterials() {
  const materialsData = [
    { name: 'Composite 3M Filtek Z350', unit: 'Hộp', quantity: 50, min_quantity: 10, price: 500000, supplier: '3M Company' },
    { name: 'Composite GC Gradia', unit: 'Hộp', quantity: 30, min_quantity: 8, price: 450000, supplier: 'GC Corporation' },
    { name: 'Amalgam SDI', unit: 'Hộp', quantity: 20, min_quantity: 5, price: 300000, supplier: 'SDI Limited' },
    { name: 'Xi măng GIC Fuji', unit: 'Hộp', quantity: 40, min_quantity: 10, price: 350000, supplier: 'GC Corporation' },
    { name: 'Gutta percha Dentsply', unit: 'Hộp', quantity: 60, min_quantity: 15, price: 200000, supplier: 'Dentsply Sirona' },
    { name: 'Kim nội nha', unit: 'Hộp', quantity: 100, min_quantity: 20, price: 150000, supplier: 'Mani Inc' },
    { name: 'Bông gòn y tế', unit: 'Kg', quantity: 80, min_quantity: 20, price: 80000, supplier: 'Việt Tiến' },
    { name: 'Găng tay latex', unit: 'Hộp (100 chiếc)', quantity: 200, min_quantity: 50, price: 120000, supplier: 'Ansell' },
    { name: 'Khẩu trang y tế 4 lớp', unit: 'Hộp (50 chiếc)', quantity: 150, min_quantity: 30, price: 50000, supplier: 'Nam Anh' },
    { name: 'Gương nha khoa', unit: 'Cái', quantity: 300, min_quantity: 50, price: 5000, supplier: 'Hu-Friedy' },
    { name: 'Kim tiêm nha khoa', unit: 'Hộp (100 cái)', quantity: 80, min_quantity: 20, price: 200000, supplier: 'Septodont' },
    { name: 'Thuốc tê Lidocaine 2%', unit: 'Hộp (50 ống)', quantity: 40, min_quantity: 10, price: 350000, supplier: 'Septodont' },
    { name: 'Acid Phosphoric 37%', unit: 'Chai', quantity: 50, min_quantity: 15, price: 180000, supplier: '3M ESPE' },
    { name: 'Bonding 3M Single Bond', unit: 'Chai', quantity: 30, min_quantity: 8, price: 400000, supplier: '3M Company' },
    { name: 'Răng sứ Zirconia', unit: 'Viên', quantity: 100, min_quantity: 20, price: 800000, supplier: 'Ivoclar Vivadent' },
    { name: 'Răng sứ Titan', unit: 'Viên', quantity: 80, min_quantity: 15, price: 500000, supplier: 'Vita Zahnfabrik' },
    { name: 'Mắc cài kim loại', unit: 'Bộ', quantity: 50, min_quantity: 10, price: 2000000, supplier: 'American Orthodontics' },
    { name: 'Mắc cài sứ', unit: 'Bộ', quantity: 30, min_quantity: 8, price: 3000000, supplier: 'American Orthodontics' },
    { name: 'Dây cung niti', unit: 'Cuộn', quantity: 40, min_quantity: 10, price: 500000, supplier: '3M Unitek' },
    { name: 'Implant Straumann', unit: 'Cái', quantity: 20, min_quantity: 5, price: 8000000, supplier: 'Straumann' }
  ];

  const materials = [];
  for (const data of materialsData) {
    const material = await Material.create(data);
    materials.push(material);
  }

  return materials;
}

// Create material imports
async function createMaterialImports(materials, users) {
  const imports = [];
  const adminUser = users.find(u => u.email === 'admin@dentalclinic.com');
  
  // Create imports for last 3 months
  for (let i = 0; i < 30; i++) {
    const material = randomElement(materials);
    const quantity = randomNumber(10, 50);
    const importDate = randomDate(
      moment().subtract(3, 'months').toDate(),
      new Date()
    );
    
    const materialImport = await MaterialImport.create({
      material_id: material._id,
      quantity: quantity,
      price: material.price,
      supplier: material.supplier,
      note: Math.random() > 0.7 ? 'Nhập hàng định kỳ' : undefined,
      import_date: importDate,
      created_by: adminUser._id,
      createdAt: importDate
    });
    
    imports.push(materialImport);
  }

  return imports;
}

// Create labos
async function createLabos() {
  const labosData = [
    { name: 'Labo Nha Khoa Việt', phone: '0241234567', email: 'contact@laboviet.com', address: 'Hà Nội', contact_person: 'Nguyễn Văn A' },
    { name: 'Labo Dental Care', phone: '0287654321', email: 'info@dentalcare.vn', address: 'TP.HCM', contact_person: 'Trần Thị B' },
    { name: 'Labo Excellence', phone: '0236789012', email: 'service@excellence.vn', address: 'Đà Nẵng', contact_person: 'Lê Văn C' },
    { name: 'Labo Premium', phone: '0251234567', email: 'contact@premium.vn', address: 'Hải Phòng', contact_person: 'Phạm Thị D' }
  ];

  const labos = [];
  for (const data of labosData) {
    const labo = await Labo.create(data);
    labos.push(labo);
  }

  return labos;
}

// Create patient records
async function createPatientRecords(patients, users, services) {
  const records = [];
  
  // Populate role_id for filtering
  const populatedUsers = await User.find({ _id: { $in: users.map(u => u._id) } }).populate('role_id');
  const doctors = populatedUsers.filter(u => u.role_id && u.role_id.name === 'Bác sĩ');
  
  // Create records for 30 random patients
  const selectedPatients = patients.slice(0, 30);
  
  for (const patient of selectedPatients) {
    const numRecords = randomNumber(1, 3);
    
    for (let i = 0; i < numRecords; i++) {
      const doctor = randomElement(doctors);
      const treatmentId = `TRT${moment().format('YYYYMMDD')}${randomNumber(1000, 9999)}`;
      const visitDate = randomDate(
        moment().subtract(2, 'months').toDate(),
        new Date()
      );
      
      // Select random services
      const numServices = randomNumber(1, 3);
      const selectedServices = [];
      const usedServiceIds = new Set();
      
      for (let j = 0; j < numServices; j++) {
        let service;
        do {
          service = randomElement(services);
        } while (usedServiceIds.has(service._id.toString()));
        
        usedServiceIds.add(service._id.toString());
        
        selectedServices.push({
          service_id: service._id,
          quantity: 1,
          price: service.price,
          tooth_number: randomNumber(11, 48).toString(),
          status: randomElement(['Đang điều trị', 'Hoàn thành'])
        });
      }
      
      const record = new PatientRecord({
        patient_id: patient._id,
        treatment_id: treatmentId,
        doctor_id: doctor._id,
        services: selectedServices,
        diagnosis: `Chẩn đoán bệnh lý răng miệng`,
        treatment_plan: 'Kế hoạch điều trị theo chỉ định',
        note: Math.random() > 0.7 ? 'Bệnh nhân cần theo dõi thêm' : undefined,
        status: randomElement(['Đang điều trị', 'Hoàn thành']),
        visit_date: visitDate,
        next_visit: Math.random() > 0.5 ? moment(visitDate).add(randomNumber(7, 30), 'days').toDate() : undefined,
        createdAt: visitDate
      });
      
      record.calculateTotalPrice();
      await record.save();
      
      records.push(record);
    }
  }

  return records;
}

// Create material exports
async function createMaterialExports(materials, patients, records, users) {
  const exports = [];
  const adminUser = users.find(u => u.email === 'admin@dentalclinic.com');
  
  // Create 20 exports
  for (let i = 0; i < 20; i++) {
    const material = randomElement(materials.filter(m => m.quantity > 0));
    const patient = randomElement(patients);
    const record = records.find(r => r.patient_id.toString() === patient._id.toString()) || randomElement(records);
    const quantity = randomNumber(1, 5);
    const exportDate = randomDate(
      moment().subtract(2, 'months').toDate(),
      new Date()
    );
    
    if (material.quantity >= quantity) {
      const materialExport = await MaterialExport.create({
        material_id: material._id,
        patient_id: patient._id,
        record_id: record._id,
        quantity: quantity,
        price: material.price,
        note: Math.random() > 0.7 ? 'Sử dụng trong điều trị' : undefined,
        export_date: exportDate,
        created_by: adminUser._id,
        createdAt: exportDate
      });
      
      // Update material quantity
      material.quantity -= quantity;
      await material.save();
      
      exports.push(materialExport);
    }
  }

  return exports;
}

// Create specimens
async function createSpecimens(patients, labos, records, users) {
  const specimens = [];
  
  // Populate role_id for filtering
  const populatedUsers = await User.find({ _id: { $in: users.map(u => u._id) } }).populate('role_id');
  const doctors = populatedUsers.filter(u => u.role_id && u.role_id.name === 'Bác sĩ');
  
  const specimenTypes = [
    { name: 'Răng sứ', type: 'Crown', price: 3000000 },
    { name: 'Cầu răng sứ', type: 'Bridge', price: 5000000 },
    { name: 'Veneer sứ', type: 'Veneer', price: 5000000 },
    { name: 'Hàm tháo lắp', type: 'Denture', price: 8000000 },
    { name: 'Implant crown', type: 'Implant', price: 15000000 }
  ];
  
  // Create 25 specimens
  for (let i = 0; i < 25; i++) {
    const patient = randomElement(patients);
    const labo = randomElement(labos);
    const record = records.find(r => r.patient_id.toString() === patient._id.toString()) || randomElement(records);
    const doctor = randomElement(doctors);
    const specimenType = randomElement(specimenTypes);
    
    const statuses = ['Đang chuẩn bị', 'Đã gửi labo', 'Labo đã nhận', 'Labo đã hoàn thành', 'Đã nhận về', 'Đã sử dụng'];
    const status = randomElement(statuses);
    
    const createdDate = randomDate(
      moment().subtract(1, 'month').toDate(),
      new Date()
    );
    
    const specimen = await Specimen.create({
      patient_id: patient._id,
      record_id: record._id,
      labo_id: labo._id,
      name: specimenType.name,
      type: specimenType.type,
      description: `${specimenType.name} cho bệnh nhân`,
      tooth_number: randomNumber(11, 48).toString(),
      quantity: 1,
      price: specimenType.price,
      status: status,
      send_date: ['Đã gửi labo', 'Labo đã nhận', 'Labo đã hoàn thành', 'Đã nhận về', 'Đã sử dụng'].includes(status) 
        ? moment(createdDate).add(1, 'day').toDate() : undefined,
      receive_date: ['Labo đã nhận', 'Labo đã hoàn thành', 'Đã nhận về', 'Đã sử dụng'].includes(status)
        ? moment(createdDate).add(2, 'days').toDate() : undefined,
      expected_date: moment(createdDate).add(randomNumber(7, 14), 'days').toDate(),
      used_date: status === 'Đã sử dụng' ? moment(createdDate).add(randomNumber(10, 20), 'days').toDate() : undefined,
      report: ['Labo đã hoàn thành', 'Đã nhận về', 'Đã sử dụng'].includes(status) ? 'Hoàn thành tốt, đạt yêu cầu' : undefined,
      note: Math.random() > 0.7 ? 'Yêu cầu đặc biệt về màu sắc' : undefined,
      created_by: doctor._id,
      createdAt: createdDate
    });
    
    specimens.push(specimen);
  }

  return specimens;
}

// Create bills and receipts
async function createBillsAndReceipts(records, patients, users) {
  const bills = [];
  const receipts = [];
  const adminUser = users.find(u => u.email === 'admin@dentalclinic.com');
  
  // Group records by treatment_id
  const treatmentGroups = {};
  records.forEach(record => {
    if (!treatmentGroups[record.treatment_id]) {
      treatmentGroups[record.treatment_id] = [];
    }
    treatmentGroups[record.treatment_id].push(record);
  });
  
  // Create bills for each treatment
  for (const [treatmentId, treatmentRecords] of Object.entries(treatmentGroups)) {
    const firstRecord = treatmentRecords[0];
    const totalAmount = treatmentRecords.reduce((sum, r) => sum + r.total_price, 0);
    
    // Random payment percentage
    const paymentPercentage = Math.random();
    let paidAmount = 0;
    
    if (paymentPercentage < 0.3) {
      paidAmount = 0; // Not paid
    } else if (paymentPercentage < 0.6) {
      paidAmount = Math.floor(totalAmount * randomNumber(30, 70) / 100); // Partial payment
    } else {
      paidAmount = totalAmount; // Full payment
    }
    
    const bill = await Bill.create({
      patient_id: firstRecord.patient_id,
      treatment_id: treatmentId,
      record_id: firstRecord._id,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      created_by: adminUser._id,
      createdAt: firstRecord.createdAt
    });
    
    bills.push(bill);
    
    // Create receipts if paid
    if (paidAmount > 0) {
      const numPayments = paidAmount === totalAmount ? randomNumber(1, 2) : randomNumber(1, 3);
      let remainingAmount = paidAmount;
      
      for (let i = 0; i < numPayments && remainingAmount > 0; i++) {
        let receiptAmount;
        if (i === numPayments - 1) {
          receiptAmount = remainingAmount;
        } else {
          receiptAmount = Math.floor(remainingAmount * randomNumber(30, 60) / 100);
        }
        
        const receiptDate = moment(firstRecord.createdAt)
          .add(i * randomNumber(1, 7), 'days')
          .toDate();
        
        const receipt = await Receipt.create({
          bill_id: bill._id,
          patient_id: firstRecord.patient_id,
          treatment_id: treatmentId,
          amount: receiptAmount,
          payment_method: randomElement(['Tiền mặt', 'Chuyển khoản', 'Thẻ']),
          note: i === 0 ? 'Thanh toán đợt 1' : `Thanh toán đợt ${i + 1}`,
          created_by: adminUser._id,
          receipt_date: receiptDate,
          createdAt: receiptDate
        });
        
        receipts.push(receipt);
        remainingAmount -= receiptAmount;
      }
    }
  }

  return { bills, receipts };
}

// Create waiting room entries
async function createWaitingRoom(patients, users) {
  const waitingList = [];
  
  // Populate role_id for filtering
  const populatedUsers = await User.find({ _id: { $in: users.map(u => u._id) } }).populate('role_id');
  const receptionists = populatedUsers.filter(u => u.role_id && u.role_id.name === 'Lễ tân');
  const doctors = populatedUsers.filter(u => u.role_id && u.role_id.name === 'Bác sĩ');
  
  // Create 10 waiting entries (mix of statuses)
  for (let i = 0; i < 10; i++) {
    const patient = randomElement(patients);
    const receptionist = randomElement(receptionists);
    const status = randomElement(['Đang chờ', 'Đang chờ', 'Đang chờ', 'Đã gọi', 'Đã xác nhận']);
    
    const appointmentDate = moment().subtract(randomNumber(0, 2), 'hours').toDate();
    
    const waiting = await WaitingRoom.create({
      patient_id: patient._id,
      doctor_id: status === 'Đã xác nhận' ? randomElement(doctors)._id : undefined,
      appointment_date: appointmentDate,
      status: status,
      queue_number: i + 1,
      reason: randomElement(['Khám định kỳ', 'Đau răng', 'Tái khám', 'Lấy cao răng', 'Tư vấn niềng răng']),
      note: Math.random() > 0.7 ? 'Bệnh nhân hẹn trước' : undefined,
      called_time: ['Đã gọi', 'Đã xác nhận'].includes(status) 
        ? moment(appointmentDate).add(randomNumber(5, 30), 'minutes').toDate() : undefined,
      confirmed_time: status === 'Đã xác nhận'
        ? moment(appointmentDate).add(randomNumber(10, 40), 'minutes').toDate() : undefined,
      created_by: receptionist._id,
      createdAt: appointmentDate
    });
    
    waitingList.push(waiting);
  }

  return waitingList;
}

// Create timekeeping records
async function createTimekeeping(users) {
  const timekeeping = [];
  const staffUsers = users; // All users have roles
  
  // Create timekeeping for last 30 days
  for (let day = 0; day < 30; day++) {
    const date = moment().subtract(day, 'days');
    
    // Skip weekends
    if (date.day() === 0 || date.day() === 6) continue;
    
    for (const user of staffUsers) {
      // 90% chance of attendance
      if (Math.random() < 0.9) {
        const checkInTime = date.clone()
          .hour(8)
          .minute(randomNumber(0, 30))
          .toDate();
        
        const checkOutTime = date.clone()
          .hour(17)
          .minute(randomNumber(0, 30))
          .toDate();
        
        const record = await Timekeeping.create({
          user_id: user._id,
          check_in: checkInTime,
          check_out: checkOutTime,
          date: date.startOf('day').toDate(),
          note: Math.random() > 0.95 ? 'Đi muộn do tắc đường' : undefined,
          createdAt: checkInTime
        });
        
        timekeeping.push(record);
      }
    }
  }

  return timekeeping;
}

// Create schedules
async function createSchedules(users, patients) {
  const schedules = [];
  
  // Populate role_id for filtering
  const populatedUsers = await User.find({ _id: { $in: users.map(u => u._id) } }).populate('role_id');
  const doctors = populatedUsers.filter(u => u.role_id && u.role_id.name === 'Bác sĩ');
  const allStaff = populatedUsers;
  
  // Create schedules for next 30 days
  for (let day = 0; day < 30; day++) {
    const date = moment().add(day, 'days');
    
    // Skip Sundays
    if (date.day() === 0) continue;
    
    // Create 3-5 appointment schedules per day
    const numAppointments = randomNumber(3, 5);
    for (let i = 0; i < numAppointments; i++) {
      const doctor = randomElement(doctors);
      const patient = randomElement(patients);
      const startHour = randomNumber(8, 16);
      const startMinute = randomElement([0, 30]);
      
      const startTime = date.clone()
        .hour(startHour)
        .minute(startMinute)
        .toDate();
      
      const endTime = date.clone()
        .hour(startHour)
        .minute(startMinute)
        .add(randomNumber(30, 120), 'minutes')
        .toDate();
      
      const schedule = await Schedule.create({
        user_id: doctor._id,
        patient_id: patient._id,
        title: `Khám bệnh - ${patient.fullname}`,
        description: randomElement([
          'Khám định kỳ',
          'Tái khám sau điều trị',
          'Tư vấn niềng răng',
          'Điều trị răng sâu',
          'Lấy cao răng'
        ]),
        start_time: startTime,
        end_time: endTime,
        type: 'Lịch khám',
        status: day < 0 ? 'Hoàn thành' : 'Đã lên lịch',
        location: `Phòng khám ${randomNumber(1, 3)}`,
        note: Math.random() > 0.8 ? 'Bệnh nhân cần theo dõi đặc biệt' : undefined,
        created_by: randomElement(allStaff)._id,
        createdAt: moment().subtract(randomNumber(1, 5), 'days').toDate()
      });
      
      schedules.push(schedule);
    }
    
    // Create 1-2 meeting schedules per week
    if (date.day() === 1 || date.day() === 4) {
      const meetingStartTime = date.clone().hour(7).minute(30).toDate();
      const meetingEndTime = date.clone().hour(8).minute(30).toDate();
      
      const meetingSchedule = await Schedule.create({
        user_id: randomElement(allStaff)._id,
        title: 'Họp team',
        description: 'Họp đầu tuần để review công việc và phân công nhiệm vụ',
        start_time: meetingStartTime,
        end_time: meetingEndTime,
        type: 'Cuộc họp',
        status: day < 0 ? 'Hoàn thành' : 'Đã lên lịch',
        location: 'Phòng họp chính',
        created_by: users[0]._id,
        createdAt: moment().subtract(randomNumber(5, 10), 'days').toDate()
      });
      
      schedules.push(meetingSchedule);
    }
  }

  return schedules;
}

// Create notifications
async function createNotifications(users) {
  const notifications = [];
  
  const notificationTemplates = [
    { title: 'Lịch hẹn sắp tới', message: 'Bạn có lịch hẹn với bệnh nhân vào lúc {time}', type: 'Thông báo' },
    { title: 'Nhiệm vụ mới', message: 'Bạn được phân công nhiệm vụ mới: {task}', type: 'Thông báo' },
    { title: 'Vật liệu sắp hết', message: 'Vật liệu {material} sắp hết, cần nhập thêm', type: 'Cảnh báo' },
    { title: 'Thanh toán thành công', message: 'Bệnh nhân {patient} đã thanh toán {amount}', type: 'Thành công' },
    { title: 'Mẫu vật hoàn thành', message: 'Labo đã hoàn thành mẫu vật cho bệnh nhân {patient}', type: 'Thông báo' },
    { title: 'Cập nhật hệ thống', message: 'Hệ thống sẽ bảo trì vào {time}', type: 'Thông báo' }
  ];
  
  // Create 5-10 notifications per user
  for (const user of users) {
    const numNotifications = randomNumber(5, 10);
    
    for (let i = 0; i < numNotifications; i++) {
      const template = randomElement(notificationTemplates);
      const isRead = Math.random() > 0.4; // 60% chance of being read
      const createdDate = moment().subtract(randomNumber(0, 10), 'days').toDate();
      
      const notification = await Notify.create({
        user_id: user._id,
        title: template.title,
        message: template.message
          .replace('{time}', moment().add(randomNumber(1, 5), 'hours').format('HH:mm DD/MM/YYYY'))
          .replace('{task}', randomElement(['Kiểm tra tồn kho', 'Chuẩn bị báo cáo', 'Liên hệ labo']))
          .replace('{material}', randomElement(['Composite', 'Gutta percha', 'Kim tiêm']))
          .replace('{patient}', 'Nguyễn Văn A')
          .replace('{amount}', '2.000.000đ'),
        type: template.type,
        link: Math.random() > 0.5 ? `/dashboard/${randomElement(['patients', 'schedules', 'materials', 'bills'])}` : undefined,
        is_read: isRead,
        read_at: isRead ? moment(createdDate).add(randomNumber(1, 60), 'minutes').toDate() : undefined,
        createdAt: createdDate
      });
      
      notifications.push(notification);
    }
  }

  return notifications;
}

// Run the generation
generateSampleData();
