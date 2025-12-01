const mongoose = require('mongoose');

const timekeepingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  check_in: {
    type: Date,
    required: true
  },
  check_out: {
    type: Date
  },
  work_hours: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Đang làm việc', 'Đã kết thúc', 'Đi muộn', 'Về sớm'],
    default: 'Đang làm việc'
  }
}, {
  timestamps: true
});

// Calculate work hours when checking out
timekeepingSchema.pre('save', function(next) {
  if (this.check_out && this.check_in) {
    const hours = (this.check_out - this.check_in) / (1000 * 60 * 60);
    this.work_hours = Math.round(hours * 100) / 100;
    this.status = 'Đã kết thúc';
  }
  next();
});

module.exports = mongoose.model('Timekeeping', timekeepingSchema);
