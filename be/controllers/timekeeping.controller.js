const { parsePagination } = require('../utils/pagination');
const Timekeeping = require('../models/timekeeping.model');
const moment = require('moment');

// @desc    Get list of timekeeping
// @route   GET /api/timekeeping/get_list_timekeeping
// @access  Private
exports.getListTimekeeping = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);

    let query = {};

    if (userId) {
      query.user_id = userId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const timekeeping = await Timekeeping.find(query)
      .populate('user_id', 'fullname email role_id')
      .limit(pagination.size)
      .skip(pagination.skip)
      .sort({ date: -1, createdAt: -1 });

    const count = await Timekeeping.countDocuments(query);

    res.status(200).json({
      timekeeping,
      totalPages: Math.ceil(count / pagination.size),
      currentPage: pagination.page,
      total: count
    });
  } catch (error) {
    console.error('Get timekeeping error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Check in
// @route   POST /api/timekeeping/checkin
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment().startOf('day').toDate();

    // Check if already checked in today
    const existingCheckin = await Timekeeping.findOne({
      user_id: userId,
      date: today
    });

    if (existingCheckin) {
      return res.status(400).json({ message: 'Bạn đã check in hôm nay' });
    }

    const timekeeping = await Timekeeping.create({
      user_id: userId,
      check_in: new Date(),
      date: today
    });

    const populatedTimekeeping = await Timekeeping.findById(timekeeping._id)
      .populate('user_id', 'fullname email role_id');

    res.status(201).json({
      message: 'Check in thành công',
      timekeeping: populatedTimekeeping
    });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Check out
// @route   POST /api/timekeeping/checkout
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = moment().startOf('day').toDate();

    // Find today's timekeeping
    const timekeeping = await Timekeeping.findOne({
      user_id: userId,
      date: today
    });

    if (!timekeeping) {
      return res.status(404).json({ message: 'Bạn chưa check in hôm nay' });
    }

    if (timekeeping.check_out) {
      return res.status(400).json({ message: 'Bạn đã check out rồi' });
    }

    timekeeping.check_out = new Date();
    await timekeeping.save();

    const populatedTimekeeping = await Timekeeping.findById(timekeeping._id)
      .populate('user_id', 'fullname email role_id');

    res.status(200).json({
      message: 'Check out thành công',
      timekeeping: populatedTimekeeping
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
