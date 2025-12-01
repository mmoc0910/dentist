const Receipt = require('../models/receipt.model');
const MaterialImport = require('../models/materialImport.model');
const moment = require('moment');

// @desc    Get income data
// @route   GET /api/income
// @access  Private
exports.getIncome = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to current month
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
    }

    // Get receipts (income)
    const receipts = await Receipt.find({
      createdAt: { $gte: start, $lte: end }
    });

    const totalIncome = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

    // Group by date
    const incomeByDate = {};
    receipts.forEach(receipt => {
      const date = moment(receipt.createdAt).format('YYYY-MM-DD');
      if (!incomeByDate[date]) {
        incomeByDate[date] = 0;
      }
      incomeByDate[date] += receipt.amount;
    });

    res.status(200).json({
      totalIncome,
      incomeByDate,
      receipts: receipts.length
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get net income
// @route   GET /api/income/net_income
// @access  Private
exports.getNetIncome = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to current month
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
    }

    // Get receipts (income)
    const receipts = await Receipt.find({
      createdAt: { $gte: start, $lte: end }
    });

    const totalIncome = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

    // Get material imports (expenses)
    const imports = await MaterialImport.find({
      createdAt: { $gte: start, $lte: end }
    });

    const totalExpense = imports.reduce((sum, imp) => sum + imp.total_price, 0);

    const netIncome = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      netIncome,
      period: { start, end }
    });
  } catch (error) {
    console.error('Get net income error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get total spend
// @route   GET /api/income/total_spend
// @access  Private
exports.getTotalSpend = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to current month
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
    }

    // Get material imports (expenses)
    const imports = await MaterialImport.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('material_id');

    const totalSpend = imports.reduce((sum, imp) => sum + imp.total_price, 0);

    // Group by date
    const spendByDate = {};
    imports.forEach(imp => {
      const date = moment(imp.createdAt).format('YYYY-MM-DD');
      if (!spendByDate[date]) {
        spendByDate[date] = 0;
      }
      spendByDate[date] += imp.total_price;
    });

    res.status(200).json({
      totalSpend,
      spendByDate,
      imports: imports.length
    });
  } catch (error) {
    console.error('Get total spend error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
