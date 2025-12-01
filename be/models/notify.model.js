const mongoose = require('mongoose');

const notifySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Thông báo', 'Cảnh báo', 'Lỗi', 'Thành công'],
    default: 'Thông báo'
  },
  link: {
    type: String,
    trim: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notify', notifySchema);
