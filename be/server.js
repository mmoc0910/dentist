require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const patientRoutes = require('./routes/patient.routes');
const roleRoutes = require('./routes/role.routes');
const categoryRoutes = require('./routes/category.routes');
const materialRoutes = require('./routes/material.routes');
const materialImportRoutes = require('./routes/materialImport.routes');
const materialExportRoutes = require('./routes/materialExport.routes');
const patientRecordRoutes = require('./routes/patientRecord.routes');
const specimenRoutes = require('./routes/specimen.routes');
const laboRoutes = require('./routes/labo.routes');
const billRoutes = require('./routes/bill.routes');
const receiptRoutes = require('./routes/receipt.routes');
const incomeRoutes = require('./routes/income.routes');
const waitingRoomRoutes = require('./routes/waitingRoom.routes');
const timekeepingRoutes = require('./routes/timekeeping.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const notifyRoutes = require('./routes/notify.routes');

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/material_imports', materialImportRoutes);
app.use('/api/material_export', materialExportRoutes);
app.use('/api/patient_record', patientRecordRoutes);
app.use('/api/specimens', specimenRoutes);
app.use('/api/labos', laboRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/waiting_room', waitingRoomRoutes);
app.use('/api/timekeeping', timekeepingRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/notifies', notifyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dental_clinic';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
