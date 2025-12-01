const { parsePagination } = require('../utils/pagination');
const MaterialExport = require('../models/materialExport.model');
const Material = require('../models/material.model');
const moment = require('moment');

// @desc    Get list of material exports
// @route   GET /api/material_export/get_list_export
// @access  Private
exports.getListExport = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);

    const exports = await MaterialExport.find()
      .populate('material_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email')
      .limit(pagination.size)
      .skip(pagination.skip)
      .sort({ createdAt: -1 });

    const count = await MaterialExport.countDocuments();

    res.status(200).json({
      exports,
      totalPages: Math.ceil(count / pagination.size),
      currentPage: pagination.page,
      total: count
    });
  } catch (error) {
    console.error('Get export list error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get material exports by patient ID
// @route   GET /api/material_export/get_list_material_export_of_patient/:id
// @access  Private
exports.getExportsByPatientId = async (req, res) => {
  try {
    const exports = await MaterialExport.find({ patient_id: req.params.id })
      .populate('material_id')
      .populate('created_by', 'fullname email')
      .sort({ createdAt: -1 });

    res.status(200).json(exports);
  } catch (error) {
    console.error('Get patient exports error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get material export by ID
// @route   GET /api/material_export/:id
// @access  Private
exports.getExportById = async (req, res) => {
  try {
    const materialExport = await MaterialExport.findById(req.params.id)
      .populate('material_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email');

    if (!materialExport) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu xuất' });
    }

    res.status(200).json(materialExport);
  } catch (error) {
    console.error('Get export error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add material export
// @route   POST /api/material_export/
// @access  Private
exports.addExport = async (req, res) => {
  try {
    const { material_id, patient_id, record_id, quantity, price, note, export_date } = req.body;

    // Check material quantity
    const material = await Material.findById(material_id);
    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy vật liệu' });
    }

    if (material.quantity < quantity) {
      return res.status(400).json({ message: 'Số lượng vật liệu không đủ' });
    }

    const materialExport = await MaterialExport.create({
      material_id,
      patient_id,
      record_id,
      quantity,
      price,
      note,
      export_date,
      created_by: req.user._id
    });

    // Update material quantity
    material.quantity -= quantity;
    await material.save();

    const populatedExport = await MaterialExport.findById(materialExport._id)
      .populate('material_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email');

    res.status(201).json({
      message: 'Thêm phiếu xuất thành công',
      export: populatedExport
    });
  } catch (error) {
    console.error('Add export error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update material export
// @route   PUT /api/material_export/:id
// @access  Private
exports.updateExport = async (req, res) => {
  try {
    const { quantity, price, note, export_date } = req.body;

    const materialExport = await MaterialExport.findById(req.params.id);

    if (!materialExport) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu xuất' });
    }

    // Check if same day as creation date
    const exportDate = moment(materialExport.createdAt).startOf('day');
    const currentDate = moment().startOf('day');

    if (!exportDate.isSame(currentDate)) {
      return res.status(400).json({ message: 'Vật liệu xuất chỉ được cập nhật cùng với ngày khởi tạo.' });
    }

    // Update material quantity
    const material = await Material.findById(materialExport.material_id);
    if (material && quantity !== undefined) {
      material.quantity = material.quantity + materialExport.quantity - quantity;
      await material.save();
    }

    if (quantity !== undefined) materialExport.quantity = quantity;
    if (price !== undefined) materialExport.price = price;
    if (note !== undefined) materialExport.note = note;
    if (export_date) materialExport.export_date = export_date;

    await materialExport.save();

    const updatedExport = await MaterialExport.findById(materialExport._id)
      .populate('material_id')
      .populate('patient_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Cập nhật phiếu xuất thành công',
      export: updatedExport
    });
  } catch (error) {
    console.error('Update export error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete material export
// @route   DELETE /api/material_export/:id
// @access  Private
exports.deleteExport = async (req, res) => {
  try {
    const materialExport = await MaterialExport.findById(req.params.id);

    if (!materialExport) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu xuất' });
    }

    // Check if same day as creation date
    const exportDate = moment(materialExport.createdAt).startOf('day');
    const currentDate = moment().startOf('day');

    if (!exportDate.isSame(currentDate)) {
      return res.status(400).json({ message: 'Vật liệu xuất chỉ được xóa cùng với ngày khởi tạo.' });
    }

    // Update material quantity
    const material = await Material.findById(materialExport.material_id);
    if (material) {
      material.quantity += materialExport.quantity;
      await material.save();
    }

    await MaterialExport.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa phiếu xuất thành công' });
  } catch (error) {
    console.error('Delete export error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
