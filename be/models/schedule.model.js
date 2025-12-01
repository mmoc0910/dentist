const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Lịch khám', 'Lịch làm việc', 'Cuộc họp', 'Khác'],
    default: 'Lịch khám'
  },
  status: {
    type: String,
    enum: ['Đã lên lịch', 'Đang diễn ra', 'Hoàn thành', 'Đã hủy'],
    default: 'Đã lên lịch'
  },
  location: {
    type: String,
    trim: true
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

module.exports = mongoose.model('Schedule', scheduleSchema);
