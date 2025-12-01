const WaitingRoom = require('../models/waitingRoom.model');

// @desc    Get list of waiting patients
// @route   GET /api/waiting_room/get-list-waiting
// @access  Private
exports.getListWaiting = async (req, res) => {
  try {
    const waiting = await WaitingRoom.find({ 
      status: 'Đang chờ'
    })
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: 1 });

    res.status(200).json(waiting);
  } catch (error) {
    console.error('Get waiting list error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get list of confirmed patients
// @route   GET /api/waiting_room/get_list_confirm
// @access  Private
exports.getListConfirm = async (req, res) => {
  try {
    const confirmed = await WaitingRoom.find({ 
      status: { $in: ['Đã gọi', 'Đã xác nhận'] }
    })
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json(confirmed);
  } catch (error) {
    console.error('Get confirm list error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Call patient
// @route   PUT /api/waiting_room/call-patient/:id
// @access  Private
exports.callPatient = async (req, res) => {
  try {
    const waitingRoom = await WaitingRoom.findById(req.params.id);

    if (!waitingRoom) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    waitingRoom.status = 'Đã gọi';
    waitingRoom.called_time = new Date();

    await waitingRoom.save();

    const updatedWaiting = await WaitingRoom.findById(waitingRoom._id)
      .populate('patient_id')
      .populate('doctor_id', 'fullname email');

    res.status(200).json({
      message: 'Đã gọi bệnh nhân',
      waiting: updatedWaiting
    });
  } catch (error) {
    console.error('Call patient error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Confirm customer
// @route   PUT /api/waiting_room/confirm-customer/:id
// @access  Private
exports.confirmCustomer = async (req, res) => {
  try {
    const { doctor_id } = req.body;

    const waitingRoom = await WaitingRoom.findById(req.params.id);

    if (!waitingRoom) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    waitingRoom.status = 'Đã xác nhận';
    waitingRoom.confirmed_time = new Date();
    if (doctor_id) {
      waitingRoom.doctor_id = doctor_id;
    }

    await waitingRoom.save();

    const updatedWaiting = await WaitingRoom.findById(waitingRoom._id)
      .populate('patient_id')
      .populate('doctor_id', 'fullname email');

    res.status(200).json({
      message: 'Đã xác nhận khách hàng',
      waiting: updatedWaiting
    });
  } catch (error) {
    console.error('Confirm customer error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Delete waiting
// @route   DELETE /api/waiting_room/:id
// @access  Private
exports.deleteWaiting = async (req, res) => {
  try {
    const waitingRoom = await WaitingRoom.findById(req.params.id);

    if (!waitingRoom) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    await WaitingRoom.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Delete waiting error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
