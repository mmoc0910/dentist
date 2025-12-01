const { parsePagination } = require('../utils/pagination');
const Bill = require('../models/bill.model');

// @desc    Get list of bills
// @route   GET /api/bills/get_list_bills
// @access  Private
exports.getListBills = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);

    let query = {};
    if (search) {
      // If search is provided, search by treatment_id
      query.treatment_id = { $regex: search, $options: 'i' };
    }

    const bills = await Bill.find(query)
      .populate('patient_id')
      .populate('record_id')
      .populate('created_by', 'fullname email')
      .limit(pagination.size)
      .skip(pagination.skip)
      .sort({ createdAt: -1 });

    const count = await Bill.countDocuments(query);

    res.status(200).json({
      bills,
      totalPages: Math.ceil(count / pagination.size),
      currentPage: pagination.page,
      total: count
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient_id')
      .populate('record_id')
      .populate('created_by', 'fullname email');

    if (!bill) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
