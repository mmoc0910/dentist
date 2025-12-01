const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  treatment_id: {
    type: String,
    required: true,
    trim: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    tooth_number: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Đang điều trị', 'Hoàn thành', 'Hủy'],
      default: 'Đang điều trị'
    }
  }],
  diagnosis: {
    type: String,
    trim: true
  },
  treatment_plan: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  total_price: {
    type: Number,
    default: 0,
    min: 0
  },
  paid_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Đang điều trị', 'Hoàn thành', 'Hủy'],
    default: 'Đang điều trị'
  },
  visit_date: {
    type: Date,
    default: Date.now
  },
  next_visit: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate total price
patientRecordSchema.methods.calculateTotalPrice = function() {
  this.total_price = this.services.reduce((total, service) => {
    return total + (service.price * service.quantity);
  }, 0);
};

module.exports = mongoose.model('PatientRecord', patientRecordSchema);
