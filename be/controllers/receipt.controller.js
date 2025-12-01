const Receipt = require('../models/receipt.model');
const Bill = require('../models/bill.model');
const PatientRecord = require('../models/patientRecord.model');

// @desc    Get receipts by treatment ID
// @route   GET /api/receipts/get_list_receipts_by_treatment/:id
// @access  Private
exports.getReceiptsByTreatmentId = async (req, res) => {
  try {
    const receipts = await Receipt.find({ treatment_id: req.params.id })
      .populate('patient_id')
      .populate('bill_id')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json(receipts);
  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get new receipt by treatment ID
// @route   GET /api/receipts/new_receipts/:id
// @access  Private
exports.getNewReceiptByTreatmentId = async (req, res) => {
  try {
    const bill = await Bill.findOne({ treatment_id: req.params.id })
      .populate('patient_id');

    if (!bill) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    res.status(200).json({
      bill,
      remaining_amount: bill.remaining_amount
    });
  } catch (error) {
    console.error('Get new receipt error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add receipt
// @route   POST /api/receipts/
// @access  Private
exports.addReceipt = async (req, res) => {
  try {
    const { bill_id, patient_id, treatment_id, amount, payment_method, note } = req.body;

    // Get bill
    const bill = await Bill.findById(bill_id);

    if (!bill) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    // Check if payment exceeds remaining amount
    if (amount > bill.remaining_amount) {
      return res.status(400).json({ message: 'Đã thanh toán hết, vui lòng không thanh toán tiếp.' });
    }

    // Create receipt
    const receipt = await Receipt.create({
      bill_id,
      patient_id,
      treatment_id,
      amount,
      payment_method,
      note,
      created_by: req.user._id
    });

    // Update bill
    bill.paid_amount += amount;
    bill.remaining_amount = bill.total_amount - bill.paid_amount;

    if (bill.paid_amount >= bill.total_amount) {
      bill.status = 'Đã thanh toán';
    } else if (bill.paid_amount > 0) {
      bill.status = 'Thanh toán một phần';
    }

    await bill.save();

    // Update patient record
    await PatientRecord.updateMany(
      { treatment_id },
      { $set: { paid_amount: bill.paid_amount } }
    );

    const populatedReceipt = await Receipt.findById(receipt._id)
      .populate('patient_id')
      .populate('bill_id')
      .populate('created_by', 'fullname email');

    res.status(201).json({
      message: 'Thanh toán thành công.',
      receipt: populatedReceipt
    });
  } catch (error) {
    console.error('Add receipt error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
