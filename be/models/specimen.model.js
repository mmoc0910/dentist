const mongoose = require('mongoose');

const specimenSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientRecord'
  },
  labo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Labo'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tooth_number: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Đang chuẩn bị', 'Đã gửi labo', 'Labo đã nhận', 'Labo đã hoàn thành', 'Đã nhận về', 'Đã sử dụng'],
    default: 'Đang chuẩn bị'
  },
  send_date: {
    type: Date
  },
  receive_date: {
    type: Date
  },
  expected_date: {
    type: Date
  },
  used_date: {
    type: Date
  },
  report: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
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

// Calculate total_price before saving
specimenSchema.pre('save', function(next) {
  this.total_price = this.quantity * this.price;
  next();
});

module.exports = mongoose.model('Specimen', specimenSchema);
