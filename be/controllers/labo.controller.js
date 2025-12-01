const Labo = require('../models/labo.model');
const Specimen = require('../models/specimen.model');

// @desc    Get list of labos
// @route   GET /api/labos/get_list_labos
// @access  Private
exports.getListLabos = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const labos = await Labo.find(query)
      .limit(size * 1)
      .skip((page - 1) * size)
      .sort({ createdAt: -1 });

    const count = await Labo.countDocuments(query);

    res.status(200).json({
      labos,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get labos error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get all labos
// @route   GET /api/labos/get_all_labo
// @access  Private
exports.getAllLabos = async (req, res) => {
  try {
    const labos = await Labo.find({ isActive: true })
      .sort({ name: 1 });

    res.status(200).json(labos);
  } catch (error) {
    console.error('Get all labos error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get labo by ID
// @route   GET /api/labos/:id
// @access  Private
exports.getLaboById = async (req, res) => {
  try {
    const labo = await Labo.findById(req.params.id);

    if (!labo) {
      return res.status(404).json({ message: 'Không tìm thấy labo' });
    }

    res.status(200).json(labo);
  } catch (error) {
    console.error('Get labo error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get list prepare specimens by labo ID
// @route   GET /api/labos/get_list_prepare/:id
// @access  Private
exports.getListPrepare = async (req, res) => {
  try {
    const specimens = await Specimen.find({ 
      labo_id: req.params.id,
      status: { $in: ['Đang chuẩn bị', 'Đã gửi labo'] }
    })
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json(specimens);
  } catch (error) {
    console.error('Get list prepare error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get list receive specimens by labo ID
// @route   GET /api/labos/get_list_receive/:id
// @access  Private
exports.getListReceive = async (req, res) => {
  try {
    const specimens = await Specimen.find({ 
      labo_id: req.params.id,
      status: { $in: ['Labo đã nhận', 'Labo đã hoàn thành', 'Đã nhận về'] }
    })
      .populate('patient_id')
      .populate('labo_id')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json(specimens);
  } catch (error) {
    console.error('Get list receive error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add labo
// @route   POST /api/labos/
// @access  Private
exports.addLabo = async (req, res) => {
  try {
    const { name, phone, email, address, contact_person, description } = req.body;

    const labo = await Labo.create({
      name,
      phone,
      email,
      address,
      contact_person,
      description
    });

    res.status(201).json({
      message: 'Thêm labo thành công',
      labo
    });
  } catch (error) {
    console.error('Add labo error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update labo
// @route   PUT /api/labos/:id
// @access  Private
exports.updateLabo = async (req, res) => {
  try {
    const { name, phone, email, address, contact_person, description, isActive } = req.body;

    const labo = await Labo.findById(req.params.id);

    if (!labo) {
      return res.status(404).json({ message: 'Không tìm thấy labo' });
    }

    if (name) labo.name = name;
    if (phone) labo.phone = phone;
    if (email !== undefined) labo.email = email;
    if (address !== undefined) labo.address = address;
    if (contact_person !== undefined) labo.contact_person = contact_person;
    if (description !== undefined) labo.description = description;
    if (isActive !== undefined) labo.isActive = isActive;

    await labo.save();

    res.status(200).json({
      message: 'Cập nhật labo thành công',
      labo
    });
  } catch (error) {
    console.error('Update labo error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete labo
// @route   DELETE /api/labos/:id
// @access  Private
exports.deleteLabo = async (req, res) => {
  try {
    const labo = await Labo.findById(req.params.id);

    if (!labo) {
      return res.status(404).json({ message: 'Không tìm thấy labo' });
    }

    await Labo.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa labo thành công' });
  } catch (error) {
    console.error('Delete labo error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
