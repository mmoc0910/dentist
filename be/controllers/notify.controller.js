const Notify = require('../models/notify.model');

// @desc    Get list of notifications
// @route   GET /api/notifies/get_list_notify
// @access  Private
exports.getListNotify = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, size = 20 } = req.query;

    const notifies = await Notify.find({ user_id: userId })
      .limit(size * 1)
      .skip((page - 1) * size)
      .sort({ createdAt: -1 });

    const count = await Notify.countDocuments({ user_id: userId });
    const unreadCount = await Notify.countDocuments({ user_id: userId, is_read: false });

    res.status(200).json({
      notifies,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      total: count,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifies error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifies/read_notify/:id
// @access  Private
exports.readNotify = async (req, res) => {
  try {
    const notify = await Notify.findById(req.params.id);

    if (!notify) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    notify.is_read = true;
    notify.read_at = new Date();

    await notify.save();

    res.status(200).json({
      message: 'Đã đánh dấu đã đọc',
      notify
    });
  } catch (error) {
    console.error('Read notify error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Create notification (helper function)
// @route   Not exposed as API endpoint
// @access  Internal
exports.createNotification = async (userId, title, message, type = 'Thông báo', link = null) => {
  try {
    const notify = await Notify.create({
      user_id: userId,
      title,
      message,
      type,
      link
    });

    return notify;
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};
