const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  birthday: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    default: 'Khác'
  },
  identity_card: {
    type: String,
    trim: true
  },
  medical_history: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
patientSchema.index({ fullname: 'text', phone: 'text', email: 'text' });

module.exports = mongoose.model('Patient', patientSchema);
