const Specimen = require('../models/specimen.model');

// @desc    Get list of specimens
// @route   GET /api/specimens/get_list_speciemns
// @access  Private
exports.getListSpecimens = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const specimens = await Specimen.find(query)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email')
      .limit(size * 1)
      .skip((page - 1) * size)
      .sort({ createdAt: -1 });

    const count = await Specimen.countDocuments(query);

    res.status(200).json({
      specimens,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get specimens error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get specimens by patient ID
// @route   GET /api/specimens/get_list_specimens_of_patient/:id
// @access  Private
exports.getSpecimensByPatientId = async (req, res) => {
  try {
    const specimens = await Specimen.find({ patient_id: req.params.id })
      .populate('labo_id')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json(specimens);
  } catch (error) {
    console.error('Get patient specimens error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get specimen by ID
// @route   GET /api/specimens/:id
// @access  Private
exports.getSpecimenById = async (req, res) => {
  try {
    const specimen = await Specimen.findById(req.params.id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('record_id')
      .populate('created_by', 'fullname email');

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    res.status(200).json(specimen);
  } catch (error) {
    console.error('Get specimen error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add specimen
// @route   POST /api/specimens/
// @access  Private
exports.addSpecimen = async (req, res) => {
  try {
    const { patient_id, record_id, labo_id, name, type, description, tooth_number, quantity, price, expected_date, note, images } = req.body;

    const specimen = await Specimen.create({
      patient_id,
      record_id,
      labo_id,
      name,
      type,
      description,
      tooth_number,
      quantity,
      price,
      expected_date,
      note,
      images,
      created_by: req.user._id
    });

    const populatedSpecimen = await Specimen.findById(specimen._id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email');

    res.status(201).json({
      message: 'Thêm mẫu vật thành công',
      specimen: populatedSpecimen
    });
  } catch (error) {
    console.error('Add specimen error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update specimen
// @route   PUT /api/specimens/:id
// @access  Private
exports.updateSpecimen = async (req, res) => {
  try {
    const { labo_id, name, type, description, tooth_number, quantity, price, status, expected_date, note, images, report } = req.body;

    const specimen = await Specimen.findById(req.params.id);

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    if (labo_id !== undefined) specimen.labo_id = labo_id;
    if (name) specimen.name = name;
    if (type) specimen.type = type;
    if (description !== undefined) specimen.description = description;
    if (tooth_number !== undefined) specimen.tooth_number = tooth_number;
    if (quantity !== undefined) specimen.quantity = quantity;
    if (price !== undefined) specimen.price = price;
    if (status) specimen.status = status;
    if (expected_date !== undefined) specimen.expected_date = expected_date;
    if (note !== undefined) specimen.note = note;
    if (images) specimen.images = images;
    if (report !== undefined) specimen.report = report;

    await specimen.save();

    const updatedSpecimen = await Specimen.findById(specimen._id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Cập nhật mẫu vật thành công',
      specimen: updatedSpecimen
    });
  } catch (error) {
    console.error('Update specimen error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Labo receive specimen
// @route   PUT /api/specimens/labo_receive
// @access  Private
exports.laboReceive = async (req, res) => {
  try {
    const { specimen_id } = req.body;

    const specimen = await Specimen.findById(specimen_id);

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    specimen.status = 'Labo đã nhận';
    specimen.receive_date = new Date();

    await specimen.save();

    const updatedSpecimen = await Specimen.findById(specimen._id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Labo đã nhận mẫu vật',
      specimen: updatedSpecimen
    });
  } catch (error) {
    console.error('Labo receive error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Labo delivery specimen
// @route   PUT /api/specimens/labo_delivery
// @access  Private
exports.laboDelivery = async (req, res) => {
  try {
    const { specimen_id } = req.body;

    const specimen = await Specimen.findById(specimen_id);

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    specimen.status = 'Đã nhận về';
    
    await specimen.save();

    const updatedSpecimen = await Specimen.findById(specimen._id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Đã nhận mẫu vật từ labo',
      specimen: updatedSpecimen
    });
  } catch (error) {
    console.error('Labo delivery error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Report specimen
// @route   PUT /api/specimens/report_specimen/:id
// @access  Private
exports.reportSpecimen = async (req, res) => {
  try {
    const { report } = req.body;

    const specimen = await Specimen.findById(req.params.id);

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    specimen.report = report;
    specimen.status = 'Labo đã hoàn thành';

    await specimen.save();

    const updatedSpecimen = await Specimen.findById(specimen._id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Báo cáo mẫu vật thành công',
      specimen: updatedSpecimen
    });
  } catch (error) {
    console.error('Report specimen error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Use specimen
// @route   PUT /api/specimens/use_specimen/:id
// @access  Private
exports.useSpecimen = async (req, res) => {
  try {
    const specimen = await Specimen.findById(req.params.id);

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    specimen.status = 'Đã sử dụng';
    specimen.used_date = new Date();

    await specimen.save();

    const updatedSpecimen = await Specimen.findById(specimen._id)
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Đã sử dụng mẫu vật',
      specimen: updatedSpecimen
    });
  } catch (error) {
    console.error('Use specimen error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Delete specimen
// @route   DELETE /api/specimens/:id
// @access  Private
exports.deleteSpecimen = async (req, res) => {
  try {
    const specimen = await Specimen.findById(req.params.id);

    if (!specimen) {
      return res.status(404).json({ message: 'Không tìm thấy mẫu vật' });
    }

    // Check if specimen can be deleted
    if (specimen.status !== 'Đang chuẩn bị') {
      return res.status(400).json({ message: 'Không được xóa mẫu vật này' });
    }

    await Specimen.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa mẫu vật thành công' });
  } catch (error) {
    console.error('Delete specimen error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
