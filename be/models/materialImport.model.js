const mongoose = require('mongoose');

const materialImportSchema = new mongoose.Schema({
  material_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true
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
    min: 0,
    default: 0
  },
  supplier: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  import_date: {
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
materialImportSchema.pre('save', function(next) {
  this.total_price = this.quantity * this.price;
  next();
});

module.exports = mongoose.model('MaterialImport', materialImportSchema);
