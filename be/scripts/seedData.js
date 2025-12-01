require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Service = require('../models/service.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dental_clinic';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Role.deleteMany({});
    // await User.deleteMany({});
    // await Category.deleteMany({});
    // await Service.deleteMany({});

    // Create Roles
    const roles = [
      { name: 'Admin', description: 'Quản trị viên hệ thống' },
      { name: 'Bác sĩ', description: 'Bác sĩ nha khoa' },
      { name: 'Điều dưỡng trưởng', description: 'Điều dưỡng trưởng' },
      { name: 'Y tá', description: 'Y tá' },
      { name: 'Lễ tân', description: 'Nhân viên lễ tân' }
    ];

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`Created role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
      }
    }

    // Create Admin User
    const adminRole = await Role.findOne({ name: 'Admin' });
    
    const adminExists = await User.findOne({ email: 'admin@dentalclinic.com' });
    
    if (!adminExists && adminRole) {
      await User.create({
        fullname: 'Administrator',
        email: 'admin@dentalclinic.com',
        username: 'admin',
        password: 'admin123', // Will be hashed by the model
        phone: '0123456789',
        address: 'Hà Nội',
        gender: 'Khác',
        role_id: adminRole._id
      });
      console.log('Created admin user - username: admin, password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create Sample Categories
    const categories = [
      { name: 'Khám và tư vấn', description: 'Các dịch vụ khám và tư vấn nha khoa' },
      { name: 'Điều trị răng', description: 'Các dịch vụ điều trị răng' },
      { name: 'Nha chu', description: 'Điều trị bệnh lý nha chu' },
      { name: 'Chỉnh nha', description: 'Niềng răng và chỉnh nha' },
      { name: 'Phục hồi răng', description: 'Bọc răng sứ, cấy ghép implant' },
      { name: 'Nha khoa thẩm mỹ', description: 'Các dịch vụ làm đẹp răng' }
    ];

    const createdCategories = {};
    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        const category = await Category.create(categoryData);
        createdCategories[categoryData.name] = category._id;
        console.log(`Created category: ${categoryData.name}`);
      } else {
        createdCategories[categoryData.name] = existingCategory._id;
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    // Create Sample Services
    const services = [
      { name: 'Khám tổng quát', category: 'Khám và tư vấn', price: 100000, duration: 30 },
      { name: 'Tư vấn chỉnh nha', category: 'Khám và tư vấn', price: 200000, duration: 45 },
      { name: 'Nhổ răng thường', category: 'Điều trị răng', price: 300000, duration: 30 },
      { name: 'Nhổ răng khôn', category: 'Điều trị răng', price: 800000, duration: 60 },
      { name: 'Trám răng composite', category: 'Điều trị răng', price: 250000, duration: 45 },
      { name: 'Lấy cao răng', category: 'Nha chu', price: 300000, duration: 30 },
      { name: 'Điều trị tủy răng', category: 'Điều trị răng', price: 1500000, duration: 90 },
      { name: 'Niềng răng mắc cài kim loại', category: 'Chỉnh nha', price: 30000000, duration: 60 },
      { name: 'Niềng răng trong suốt', category: 'Chỉnh nha', price: 50000000, duration: 60 },
      { name: 'Bọc răng sứ', category: 'Phục hồi răng', price: 3000000, duration: 120 },
      { name: 'Cấy ghép Implant', category: 'Phục hồi răng', price: 15000000, duration: 120 },
      { name: 'Tẩy trắng răng', category: 'Nha khoa thẩm mỹ', price: 2000000, duration: 90 },
      { name: 'Dán sứ Veneer', category: 'Nha khoa thẩm mỹ', price: 5000000, duration: 120 }
    ];

    for (const serviceData of services) {
      const categoryId = createdCategories[serviceData.category];
      if (categoryId) {
        const existingService = await Service.findOne({ 
          name: serviceData.name,
          category_id: categoryId 
        });
        
        if (!existingService) {
          await Service.create({
            name: serviceData.name,
            category_id: categoryId,
            price: serviceData.price,
            duration: serviceData.duration,
            description: `Dịch vụ ${serviceData.name.toLowerCase()}`
          });
          console.log(`Created service: ${serviceData.name}`);
        } else {
          console.log(`Service already exists: ${serviceData.name}`);
        }
      }
    }

    console.log('\n=== Seed data completed successfully ===');
    console.log('\nDefault credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nPlease change the admin password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
