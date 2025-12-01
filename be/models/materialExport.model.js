const mongoose = require('mongoose');

const materialExportSchema = new mongoose.Schema({
  material_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  record_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientRecord'
  },
  quantity: {
    type: Number,
    required: true,
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
  note: {
    type: String,
    trim: true
  },
  export_date: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate total_price before saving
materialExportSchema.pre('save', function(next) {
  this.total_price = this.quantity * this.price;
  next();
});

module.exports = mongoose.model('MaterialExport', materialExportSchema);
