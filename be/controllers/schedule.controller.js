const Schedule = require('../models/schedule.model');

// @desc    Get list of schedules
// @route   GET /api/schedule/get_list_schedule
// @access  Private
exports.getListSchedule = async (req, res) => {
  try {
    const { userId, startDate, endDate, type } = req.query;

    let query = {};

    if (userId) {
      query.user_id = userId;
    }

    if (startDate && endDate) {
      query.start_time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (type) {
      query.type = type;
    }

    const schedules = await Schedule.find(query)
      .populate('user_id', 'fullname email role_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email')
      .sort({ start_time: 1 });

    res.status(200).json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get schedule by ID
// @route   GET /api/schedule/:id
// @access  Private
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('user_id', 'fullname email role_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email');

    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add schedule
// @route   POST /api/schedule
// @access  Private
exports.addSchedule = async (req, res) => {
  try {
    const { user_id, patient_id, title, description, start_time, end_time, type, location, note } = req.body;

    const schedule = await Schedule.create({
      user_id,
      patient_id,
      title,
      description,
      start_time,
      end_time,
      type,
      location,
      note,
      created_by: req.user._id
    });

    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('user_id', 'fullname email role_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email');

    res.status(201).json({
      message: 'Thêm lịch thành công',
      schedule: populatedSchedule
    });
  } catch (error) {
    console.error('Add schedule error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update schedule
// @route   PUT /api/schedule/:id
// @access  Private
exports.updateSchedule = async (req, res) => {
  try {
    const { user_id, patient_id, title, description, start_time, end_time, type, status, location, note } = req.body;

    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch' });
    }

    if (user_id) schedule.user_id = user_id;
    if (patient_id !== undefined) schedule.patient_id = patient_id;
    if (title) schedule.title = title;
    if (description !== undefined) schedule.description = description;
    if (start_time) schedule.start_time = start_time;
    if (end_time) schedule.end_time = end_time;
    if (type) schedule.type = type;
    if (status) schedule.status = status;
    if (location !== undefined) schedule.location = location;
    if (note !== undefined) schedule.note = note;

    await schedule.save();

    const updatedSchedule = await Schedule.findById(schedule._id)
      .populate('user_id', 'fullname email role_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Cập nhật lịch thành công',
      schedule: updatedSchedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedule/:id
// @access  Private
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch' });
    }

    await Schedule.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa lịch thành công' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
