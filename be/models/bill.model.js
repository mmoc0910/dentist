const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
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
  record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientRecord',
    required: true
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  paid_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  remaining_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Chưa thanh toán', 'Thanh toán một phần', 'Đã thanh toán'],
    default: 'Chưa thanh toán'
  },
  note: {
    type: String,
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate remaining amount
billSchema.pre('save', function(next) {
  this.remaining_amount = this.total_amount - this.paid_amount;
  
  if (this.paid_amount === 0) {
    this.status = 'Chưa thanh toán';
  } else if (this.paid_amount < this.total_amount) {
    this.status = 'Thanh toán một phần';
  } else {
    this.status = 'Đã thanh toán';
  }
  
  next();
});

module.exports = mongoose.model('Bill', billSchema);
