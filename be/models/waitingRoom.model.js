const mongoose = require('mongoose');

const waitingRoomSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appointment_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Đang chờ', 'Đã gọi', 'Đã xác nhận', 'Đã hủy'],
    default: 'Đang chờ'
  },
  queue_number: {
    type: Number
  },
  reason: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  called_time: {
    type: Date
  },
  confirmed_time: {
    type: Date
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WaitingRoom', waitingRoomSchema);
